# Migration 0016 — Structural reserves (Plano Dia 1, Etapa 0)

> Aplicada em 2026-05-19 via `mcp__supabase__apply_migration`.
> Reservas estruturais pra features Fase 2+ + compliance/lifecycle agora.
> Sucessora de `0015_forms_align_research_23`.

---

## Motivação

Auditoria de "o que mais antecipar" (sessão 2026-05-19) identificou 4 itens estruturais que custam pouco agora e são caros de retrofitar depois:

1. **Tenant lifecycle states** — constituição prevê provisioning/active/suspended/deletion, mas schema não tinha
2. **Audit log imutável** — LGPD/compliance + forense
3. **In-app notifications** — Fase 2 (UI ainda não, mas schema reservado)
4. **Outgoing webhooks com retry** — Fase 2 (CRM/Zapier integration)

Reserva agora, código JIT.

## O que essa migration faz

### A. Tenant lifecycle states

```sql
ALTER TABLE tenants
  ADD COLUMN lifecycle_state text NOT NULL DEFAULT 'active'
    CHECK (lifecycle_state IN ('provisioning','active','suspended','pending_deletion','deleted')),
  ADD COLUMN suspended_at timestamptz,
  ADD COLUMN suspended_reason text,
  ADD COLUMN deletion_scheduled_at timestamptz;
```

Tenants existentes ficam `lifecycle_state='active'`. Tenant provisioning workflow (Fase 1) seta `provisioning` durante criação, `active` ao final.

### B. Audit log (append-only via RLS)

```sql
CREATE TABLE audit_log (
  id bigserial PRIMARY KEY,
  tenant_id, actor_user_id, actor_role,
  action text NOT NULL,
  target_table text NOT NULL, target_id uuid,
  before_jsonb, after_jsonb,
  ip_address_hashed, user_agent,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
```

RLS: SELECT pra tenant member (mesmo tenant_id). INSERT/UPDATE/DELETE bloqueado direto — JIT criar SECDEF helper `audit.write()` quando primeira action audit-required for codada.

### C. In-app notifications

```sql
CREATE TABLE notifications (
  id uuid PK, tenant_id, user_id,
  type text NOT NULL,
  payload_jsonb jsonb,
  read_at timestamptz,
  occurred_at, created_at
);
```

RLS: user vê próprio (`user_id = auth.uid() AND tenant_id = current_tenant_id()`). User pode UPDATE pra marcar `read_at`. INSERT via SECDEF helper Fase 2.

### D. Outgoing webhooks + delivery log

```sql
CREATE TABLE tenant_webhooks (
  id, tenant_id, event, url, secret, active,
  last_success_at, last_failure_at, failure_count,
  timestamps, deleted_at
);

CREATE TABLE webhook_deliveries (
  id, webhook_id, tenant_id, event_payload jsonb,
  attempts, status ('pending'|'delivered'|'failed'|'dead_letter'),
  last_attempted_at, delivered_at, error_message, created_at
);
```

RLS em `tenant_webhooks`: SELECT pra tenant member; role check (only professional/platform_admin) fica em lib/domain L2.
RLS em `webhook_deliveries`: SELECT pra tenant member; INSERT/UPDATE só via service_role (workflow de delivery).

## Padrão arquitetural reforçado

Todas as reservas seguem o **3-layer defense model** (`.claude/rules/jwt-claims.md` + ADR-0034/0035/0039):

- L1 RLS: apenas `tenant_id = current_tenant_id()` (isolamento cross-tenant)
- L2 role: validar em `lib/domain/` / server actions / SECDEF RPCs
- L3 entitlements: via `can_use_feature` SECDEF (já existente)

Nenhuma policy nova mistura role em RLS — preserva separação intencional do projeto.

## Validação pós-migration

- `pnpm typecheck` verde ✅
- 4 tabelas novas + 4 colunas em `tenants` adicionadas
- Splinter advisors: zero warnings novos

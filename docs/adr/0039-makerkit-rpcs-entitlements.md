# 0039. RPCs PostgreSQL Makerkit pattern pra entitlements

Date: 2026-05-18
Status: accepted
Supersedes: ADR-0034 (arquitetura entitlements). API client/types inalterada.

## Context

ADR-0034 estabeleceu entitlements via vertical slice (`lib/entitlements/server.ts`) fazendo 2 queries diretas: `subscriptions` → `plans.features` jsonb, parse Zod, cache in-memory TTL 60s. Funciona pra check booleano simples, mas tem 3 limitações pra quota numérica + atomicidade:

1. **Race condition em quota**. `requireQuota(key, currentCount)` recebia count do caller (contado em outra query). Janela entre `count` e `requireQuota` permite double-spend (2 requests paralelos contando 9 < 10 e ambos passando, total virando 11).
2. **Sem source-of-truth no DB**. Count vivia espalhado por código de feature (cada lugar contava `programs` diferente). Drift garantido entre features.
3. **N queries pra dashboard usage**. Mostrar "5/10 programs" exige `SELECT count(*) FROM programs WHERE tenant_id=...` separado por feature × N features = N+2 queries.

Makerkit Next.js Supabase Turbo resolve com pattern PostgreSQL functions:

- `plan_entitlements(variant_id, feature, entitlement jsonb)` — entitlements por plano
- `feature_usage(account_id, feature, usage jsonb)` — quota tracker per-account
- RPCs `can_use_feature`, `get_entitlement`, `update_feature_quota_usage`, trigger init em subscription
- Atomic UPSERT em `update_feature_quota_usage` (PostgreSQL `ON CONFLICT` resolve race)
- Source-of-truth no DB (1 lugar incrementa, todos lêem do mesmo)
- 1 RPC = 1 round-trip pra dashboard usage

Fonte: pesquisa 2026-05-18 via [Makerkit docs](https://makerkit.dev/docs/next-supabase-turbo/recipes/subscription-entitlements) (canonical schema + functions).

## Decision

**Adotar Makerkit RPC pattern adaptado ao nosso schema** (tenants em vez de accounts, `plans.features` jsonb direct em vez de `plan_entitlements` table separada). Migration 0009.

### Tabela única nova

```sql
CREATE TABLE public.feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature VARCHAR(255) NOT NULL,
  usage JSONB NOT NULL DEFAULT '{"count": 0}'::jsonb,
  period_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', now()),
  period_end TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, feature)
);
```

RLS: `SELECT` permitido pra tenant atual via `current_tenant_id()` JWT helper.

### 4 RPCs + 1 trigger

- `can_use_feature(p_tenant_id, p_feature) → boolean` — checa subscription + feature jsonb. Boolean → direto. Number → quota vs feature_usage current count. `-1` = unlimited.
- `get_entitlement(p_tenant_id, p_feature) → TABLE(plan_slug, feature_value jsonb, usage jsonb, period_end)` — hidrata UI (paywall, banner, progress).
- `update_feature_quota_usage(p_tenant_id, p_feature, p_delta) → void` — UPSERT atômico. `delta=+1` ao criar, `delta=-1` ao deletar. Idempotente `GREATEST(0, current + delta)`.
- `reset_feature_quota_monthly() → void` — cron mensal. Reseta count + avança period.
- Trigger `on_subscription_created` — AFTER INSERT em `subscriptions`, popula `feature_usage` rows iniciais pra cada quota numérica do plano (filtra `schema_version`).

### Rewrite `lib/entitlements/server.ts`

- `resolveEntitlement(feature)` → chama `can_use_feature` RPC + cache snapshot pra plan
- `requireEntitlement(feature)` → chama resolveEntitlement, lança `AppError.forbidden({key: 'entitlements.feature_blocked'})`
- `getEntitlements()` / `getEntitlementSnapshot()` → continua lendo `plans.features` direto (bulk pra hidratar Provider; cache TTL 60s)
- `getQuotaSnapshot(key)` → chama `get_entitlement` RPC (count vem do DB, não mais param)
- `requireQuota(key)` → chama `can_use_feature` RPC; sem param `currentCount`
- `incrementQuotaUsage(key, delta=1)` → novo helper chamando `update_feature_quota_usage`

API client (`lib/entitlements/client.ts`, `useEntitlement`, `useQuota`) **inalterada** — só boundary server muda. Wrapper `AppEntitlementGate` inalterado.

### Diferenças vs Makerkit canonical

| Aspecto                               | Makerkit                                          | Ours                                            | Razão                                                                                   |
| ------------------------------------- | ------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| Tabela `plan_entitlements`            | Separada (variant_id, feature, entitlement jsonb) | Pulada — `plans.features` jsonb já cumpre papel | Schema mais compacto, 3 planos × 9 features = 27 rows desnecessárias                    |
| Multiple subscription_items           | Sim (`flat`/`per_seat`/`metered` enum)            | Não — 1 subscription = 1 package slug           | Stripe single-tier dia 0; complexidade JIT quando per-seat real                         |
| Variant_id                            | Sim (Stripe price ID)                             | Não — slug (`A`/`B`/`C`)                        | Stripe price ID JIT em Sprint Stripe                                                    |
| Trigger source                        | `accounts` INSERT                                 | `subscriptions` INSERT                          | `tenants` existe sem subscription (free tier?); init quotas só quando subscription real |
| account_member_count check (per_seat) | Sim                                               | Não                                             | JIT quando feature seat-based necessária                                                |

## Consequences

**Positivo:**

- Race condition em quota eliminada (UPSERT atomic)
- Source-of-truth único pra count (DB)
- 1 RPC vs 2-3 queries pra check + count
- Trigger garante `feature_usage` rows inicializadas em todo subscription novo
- Reset mensal centralizado (vs N jobs por feature)
- Stripe webhook handler simplifica: muda `subscription.package`, RPC pega plano novo automaticamente (cache invalidate via `invalidateEntitlementCache(tenantId)`)

**Negativo:**

- 1 tabela nova + 4 functions + 1 trigger = mais surface de manutenção
- Trigger silently no-op se `plans.features` malformado (mitigado por validate:apca prebuild + plans seed source-controlled)
- `reset_feature_quota_monthly()` precisa ser agendado externamente (pg_cron OR Vercel Cron) — não automático. ADR-Sprint-Stripe define qual.
- `getQuotaSnapshot(key)` quebrou assinatura antiga (recebia `currentCount`). Sem callsites ainda (entitlements pre-positioned, primeira feature Sprint 2+) — safe break dia 0.

**Neutro:**

- `lib/contracts/database.ts` precisa regenerar (`pnpm supabase gen types` ou MCP `generate_typescript_types`) após PostgREST schema cache descongelar. Aplicação compila com cast localizado `// TYPES-PENDING` enquanto isso.

## Condição de revisitar

| Gatilho                                                                       | Ação                                                                                                                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Stripe webhooks integrados (Sprint Stripe)**                                | Handler chama `invalidateEntitlementCache(tenantId)` após `customer.subscription.updated`. Considerar mudar trigger pra `subscriptions UPDATE` também. |
| **Per-seat billing real**                                                     | Reintroduzir `subscription_items` table + variant_id. Adicionar lógica `account_member_count` em `can_use_feature`.                                    |
| **Quota custom não mensal** (semanal, daily, lifetime)                        | Adicionar coluna `reset_period` (enum) em `feature_usage`. Cron lê esse campo.                                                                         |
| **3+ features quebram limit mesmo após reset_quota cron**                     | Investigar trigger drift (subscription nova sem `feature_usage` init). Adicionar self-heal em `can_use_feature` (INSERT IF NOT EXISTS se row missing). |
| **PostgREST schema cache não atualiza após migration** (incidente 2026-05-18) | `NOTIFY pgrst, 'reload schema'` ou esperar self-refresh (~10min). Regenerar `database.ts` quando descongelar — cast `// TYPES-PENDING` sai.            |
| **Cron `reset_feature_quota_monthly` em Vercel Cron**                         | ADR-Sprint-Cron escolhe pg_cron (Supabase native) vs Vercel Cron (HTTP endpoint chamando RPC).                                                         |

## Referências

- ADR-0034 (vertical slice — supersede arquitetura, API mantida)
- ADR-0035 (UX patterns A/B/C)
- ADR-0040 §G (AppError i18n keys — `entitlements.feature_blocked`, `entitlements.quota_exceeded`)
- Makerkit docs — https://makerkit.dev/docs/next-supabase-turbo/recipes/subscription-entitlements
- Migration 0009 — `0009_entitlement_rpcs`
- `lib/entitlements/server.ts` — implementação RPC client-side
- `lib/entitlements/client.ts` — inalterada (boundary mantido)
- `messages/pt-BR/common.json` — keys `entitlements.feature_blocked`, `entitlements.quota_exceeded` adicionadas

---
name: JWT claims + RLS pattern
description: auth.jwt() ->> 'tenant_id' + RLS wrap (select ...) 100× speedup
paths:
  - "supabase/migrations/**/*.sql"
  - "supabase/functions/**/*.ts"
  - "lib/data/**/*.ts"
---

## JWT claims (via `custom_access_token_hook`)

Cada access token de aluno/profissional carrega:
- `tenant_id` (UUID do tenant ativo da membership)
- `active_membership_role` (`platform_admin` | `professional` | `client` | `influencer` | `service_account`)

**5 roles canônicos** (decisão `_CONFLITOS #19` reforça vocab):
- `platform_admin` — fundador
- `professional` — dono do tenant (NUNCA `trainer`)
- `client` — aluno do prof (NUNCA `student`)
- `influencer` — afiliado
- `service_account` — webhooks / Edge Functions / system

## RLS pattern (100× speedup)

Sempre wrap o claim lookup em `(select ...)` — força Postgres a inline o
plan e evita re-eval por row (~100× mais rápido em queries com 10k+ rows):

```sql
-- ✅ correto
CREATE POLICY tenant_isolation ON platform.programs FOR ALL
USING (tenant_id = (SELECT (auth.jwt() ->> 'tenant_id')::uuid));

-- ❌ errado — sem wrap, re-eval por row
CREATE POLICY tenant_isolation ON platform.programs FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

## Helper canônico (NÃO recriar)

`public.current_tenant_id()` retorna `uuid` derivado de `auth.jwt()`.
Tabelas tenant-scoped usam `(select public.current_tenant_id())` no policy.

**Não criar** `current_professional_id()` — role `professional` é colunar via
`memberships.role`, não JWT claim direto.

## Smoke test obrigatório

Toda tabela tenant-scoped tem teste:
```sql
-- Insert sem JWT → bloqueado
SET ROLE anon;
INSERT INTO platform.programs (tenant_id, title) VALUES ('00000000-0000-0000-0000-000000000000', 'test');
-- ERROR: new row violates row-level security policy
```

Detalhes: blueprint/06-data-model.md §6.

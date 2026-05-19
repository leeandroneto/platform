# Migration 0013 — Security Hardening v2 (Etapa 0 do Plano Dia 1)

> Aplicada em 2026-05-19 via `mcp__supabase__apply_migration`.
> Fecha a Etapa 0 do `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md` (revisar advisor warnings restantes) antes da próxima migration de feature.
> Sucessora de `0011_security_hardening` (REVOKE + search_path) e `0012_isolate_push_secret` (VAPID em tabela isolada).

---

## Motivação

Auditoria 2026-05-19 cruzando `docs/research/22-supabase-multitenant-schema-audit.md` com o estado real do DB via Splinter + queries em `pg_policies` / `pg_proc` revelou 6 achados:

| #   | Achado                                                                                                                                                                                                             | Severidade                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| 1   | `can_use_feature(p_tenant_id, p_feature)` SECDEF aceita `p_tenant_id` cego — qualquer authenticated descobre plano/uso de outro tenant via `/rest/v1/rpc`                                                          | ❌ Cross-tenant leak      |
| 2   | `get_entitlement(p_tenant_id, p_feature)` SECDEF mesmo problema — vaza `plan_slug`, `feature_value`, `usage`, `period_end`                                                                                         | ❌ Cross-tenant leak      |
| 3   | `update_feature_quota_usage` era INVOKER + `feature_usage` sem policy INSERT/UPDATE → função não funcionava para authenticated, só para `service_role`                                                             | ⚠️ Bug funcional          |
| 4   | `palettes_update` policy com `USING ((created_by_tenant_id = ...) AND (deleted_at IS NULL))` — soft-delete via `UPDATE SET deleted_at = now()` falha porque linha some do USING após update (Issue #2799 Supabase) | ❌ Bug latente            |
| 5   | `feature_usage_select_tenant` policy com `current_tenant_id()` sem wrap `(SELECT ...)` — sem InitPlan caching                                                                                                      | ⚠️ Performance            |
| 6   | `tenant_push_secrets` e `tenant_gateway_credentials` sem `FORCE ROW LEVEL SECURITY` — role `postgres` (owner) bypassa policies                                                                                     | ⚠️ Defesa em profundidade |
| 7   | `current_user_role()` era SECDEF callable por `anon` — não vaza nada (só lê próprio claim) mas dispara lints 0028/0029                                                                                             | ⚠️ Cleanup                |

Referências:

- Pesquisa: BLOCO G27, E19, E20, A4, A5, H29 de `docs/research/22-supabase-multitenant-schema-audit.md`
- Lints: Splinter 0028 (anon SECDEF executable) e 0029 (authenticated SECDEF executable)
- Bug soft-delete: `https://github.com/supabase/supabase/issues/2799`

---

## O que rodou (atômico, transacional)

### 1. `can_use_feature` — valida `p_tenant_id` contra JWT

```sql
CREATE OR REPLACE FUNCTION public.can_use_feature(p_tenant_id uuid, p_feature varchar)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_caller_tenant uuid := (SELECT public.current_tenant_id());
  v_app_role text := current_setting('request.jwt.claims', true)::jsonb->>'active_membership_role';
  -- ... vars
BEGIN
  IF p_tenant_id IS DISTINCT FROM v_caller_tenant
     AND COALESCE(v_app_role, '') <> 'platform_admin' THEN
    RAISE EXCEPTION 'forbidden: caller tenant % cannot query tenant %', v_caller_tenant, p_tenant_id
      USING errcode = '42501';
  END IF;
  -- ... resto da lógica original (plan lookup + quota check)
END;
$$;

REVOKE EXECUTE ON FUNCTION public.can_use_feature(uuid, varchar) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.can_use_feature(uuid, varchar) TO authenticated;

COMMENT ON FUNCTION public.can_use_feature(uuid, varchar) IS
'SECURITY DEFINER intencional: body valida p_tenant_id contra current_tenant_id()...';
```

`platform_admin` (claim `active_membership_role`) é exceção para suporte cross-tenant. Senão `RAISE EXCEPTION 'forbidden' USING errcode = '42501'` (= `insufficient_privilege`, traduzido para HTTP 403 pelo PostgREST).

### 2. `get_entitlement` — mesmo padrão

`p_tenant_id IS DISTINCT FROM current_tenant_id()` + check `platform_admin` antes do `RETURN QUERY`. REVOKE anon + GRANT authenticated + COMMENT.

### 3. `update_feature_quota_usage` — virar SECDEF + validar

Antes: `LANGUAGE plpgsql` + `SET search_path = 'public'` (INVOKER implícito). Tabela `feature_usage` só tinha policy SELECT — INSERT/UPDATE bloqueado pelo RLS para role `authenticated`. Função era código morto fora de `service_role`.

Agora: `SECURITY DEFINER SET search_path = ''` + validação `p_tenant_id` no body + REVOKE anon + GRANT authenticated.

### 4. `palettes_update` — tirar `deleted_at IS NULL` do USING

```sql
DROP POLICY IF EXISTS palettes_update ON public.palettes;
CREATE POLICY palettes_update ON public.palettes
  FOR UPDATE TO authenticated
  USING      (created_by_tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (created_by_tenant_id = (SELECT public.current_tenant_id()));
```

Resolve Issue #2799: soft-delete via UPDATE direto agora funciona. SELECT policy (`palettes_read`) continua filtrando `deleted_at IS NULL`, então rows soft-deletadas somem da listagem sem exigir RPC SECDEF.

### 5. `feature_usage_select_tenant` — wrap (SELECT current_tenant_id())

```sql
DROP POLICY IF EXISTS feature_usage_select_tenant ON public.feature_usage;
CREATE POLICY feature_usage_select_tenant ON public.feature_usage
  FOR SELECT TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
```

Era a única policy unwrapped em `public.*` (das ~90). InitPlan caching agora cobre 100%.

### 6. FORCE RLS em tabelas de segredo

```sql
ALTER TABLE public.tenant_push_secrets        FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_gateway_credentials FORCE ROW LEVEL SECURITY;
```

Role `postgres` (owner) agora respeita policies. Pesquisa A5 — defesa contra `SQL Editor` ad-hoc + dump leak.

### 7. `current_user_role()` — virar INVOKER

```sql
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $$ SELECT current_setting('request.jwt.claims', true)::jsonb->>'active_membership_role'; $$;

REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
```

Não precisa SECDEF (só lê próprio JWT). Elimina lints 0028 + 0029 dessa função.

---

## Antes / Depois (Splinter)

| Lint                                                      | Antes  | Depois | Comentário                                                                                                                                                                                                         |
| --------------------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0008 `rls_enabled_no_policy` (tenant_push_secrets)        | 1 INFO | 1 INFO | Esperado — deny-all by design                                                                                                                                                                                      |
| 0028 `anon_security_definer_function_executable`          | 3 WARN | **0**  | ✅ Fix completo                                                                                                                                                                                                    |
| 0029 `authenticated_security_definer_function_executable` | 3 WARN | 3 WARN | By-design: `can_use_feature`, `get_entitlement`, `update_feature_quota_usage`. Documentado via `COMMENT ON FUNCTION`. Não há como zerar sem perder feature (precisam SECDEF para bypassar RLS em tabelas internas) |
| 0011 / 0023 / 0024 / 0025                                 | 0      | 0      | Mantidos                                                                                                                                                                                                           |
| `auth_leaked_password_protection`                         | WARN   | WARN   | Ação separada no Dashboard (Auth → Settings → Enable HaveIBeenPwned)                                                                                                                                               |

---

## Caveats / não fizemos nesta migration

- **Drop SELECT policies em buckets públicos** (item 7 da auditoria) — depende de auditoria de uso de `.list()` no código. Adiado para JIT quando confirmarmos que nenhum fluxo usa storage listing.
- **Endurecer 7 catálogos com `USING (true)`** (item 1 da auditoria) — não-bloqueante; o lint 0024 não dispara. Vale tentar `is_active = true` em `verticals` e `vertical_component_kinds` numa migration cosmética separada.
- **Declarative schemas + pgTAP contracts** (itens 11, 12) — tracked no plano dia 1 (Etapa 1+ JIT).

---

## Aplicação

Via MCP, ordem natural:

```
mcp__supabase__apply_migration(name="0013_security_hardening_v2", query=<SQL acima>)
```

Pós-aplicação: rodar `get_advisors type=security` e confirmar 0 ocorrências de lint 0028. ✅ Validado em 2026-05-19.

Sem regen de `lib/contracts/database.ts` — assinaturas das funções não mudaram, só corpos.

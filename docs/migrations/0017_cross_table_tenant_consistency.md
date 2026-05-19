# Migration 0017 — Cross-table tenant consistency (Plano Dia 1, Etapa 0)

> Aplicada em 2026-05-19 via `mcp__supabase__apply_migration`.
> Defesa em profundidade pro **achado 4 da auditoria RLS** (cross-table tenant mismatch via FK).
> Sucessora de `0016_structural_reserves`.

---

## Motivação

Cenário do achado 4: client autenticado tenta `INSERT INTO enrollments (tenant_id, program_id, client_user_id) VALUES (meu_tenant, programa_de_outro_tenant, eu)`.

- FK aceita (programa existe).
- RLS L1 aceita (`tenant_id = current_tenant_id()` casa).
- Resultado: enrollment inválido (programa pertence a outro tenant).

Mitigação primária está em L2 (server actions validam cross-table). Esta migration adiciona **defesa em profundidade no L1.5** — trigger BEFORE INSERT/UPDATE valida que `NEW.tenant_id` casa com `tenant_id` da row FK-referenciada.

Marginal mas barato — qualquer bug em L2 (esquecer validation, novo developer pula step) cai em rede de segurança.

## O que essa migration faz

### A. Função genérica `assert_tenant_match()`

```sql
CREATE FUNCTION assert_tenant_match()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER
SET search_path = '' AS $$
DECLARE
  ref_tenant uuid;
  ref_table text := TG_ARGV[0];
  ref_column text := TG_ARGV[1];
  fk_value uuid;
BEGIN
  EXECUTE format('SELECT ($1).%I', ref_column) INTO fk_value USING NEW;
  IF fk_value IS NULL THEN RETURN NEW; END IF;
  EXECUTE format('SELECT tenant_id FROM public.%I WHERE id = $1', ref_table)
    INTO ref_tenant USING fk_value;
  IF ref_tenant IS NULL THEN
    RAISE EXCEPTION 'tenant mismatch: row not found in %.%' USING ERRCODE='23503';
  END IF;
  IF ref_tenant IS DISTINCT FROM NEW.tenant_id THEN
    RAISE EXCEPTION 'tenant mismatch: % belongs to tenant %' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
```

`SECURITY INVOKER` — não escala privilégio. `search_path=''` — hardening (mesma boa prática 0011/0013).
Usa dynamic SQL via `EXECUTE format()` pra suportar qualquer (tabela, coluna) via `TG_ARGV`. Quote-safe (`%I`).

### B. 11 triggers em tabelas críticas

| Tabela                | FK validada          | Tabela referenciada |
| --------------------- | -------------------- | ------------------- |
| `form_submissions`    | `form_id`            | `forms`             |
| `form_versions`       | `form_id`            | `forms`             |
| `form_reports`        | `form_submission_id` | `form_submissions`  |
| `form_reports`        | `lead_id`            | `leads`             |
| `leads`               | `form_submission_id` | `form_submissions`  |
| `page_versions`       | `page_id`            | `pages`             |
| `enrollments`         | `program_id`         | `programs`          |
| `modules`             | `program_id`         | `programs`          |
| `components`          | `module_id`          | `modules`           |
| `component_schedules` | `component_id`       | `components`        |
| `webhook_deliveries`  | `webhook_id`         | `tenant_webhooks`   |

Todos são `BEFORE INSERT OR UPDATE FOR EACH ROW`.

## O que essa migration NÃO faz

- Não toca tabelas sem cross-tenant FK risk (push_subscriptions, payments, ai_invocations, etc — todas só apontam pra `tenants` direto).
- Não substitui validação L2 em server actions. É defesa em profundidade, não substituta.
- Não bloqueia leitura cross-table (RLS L1 já faz isso via `tenant_id = current_tenant_id()`).

## Custo runtime

`SELECT tenant_id FROM ref_table WHERE id = ?` — 1 query indexada por trigger fire. Sub-milissegundo. Negligível em qualquer write path.

## Validação pós-migration

- `pnpm typecheck` verde ✅
- Splinter advisors: zero warnings novos introduzidos
- 11 triggers + 1 função registrados em `pg_trigger` / `pg_proc`

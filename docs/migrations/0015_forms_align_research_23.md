# Migration 0015 — Forms align research 23 (Plano Dia 1, Etapa 0)

> Aplicada em 2026-05-19 via `mcp__supabase__apply_migration`.
> Alinha schema de Form Engine com decisões fechadas pós-pesquisa 23 (§0.1 Decisão 4 do `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md`).
> Sucessora de `0014_constraint_cleanup`.

---

## Motivação

Decisão 4 do plano fechou vocabulário canônico: `form` (supertipo), `submission`, `response`, `report`. Schema dia 0 tinha `capture_forms` / `capture_submissions` / `assessments`. Mismatch direto com decisão.

Auditoria com `grep -r "from('capture_" --include='*.ts'` confirmou **zero consumers no código** — janela aberta pra renomear sem refactor.

## O que essa migration faz

### A. Renames (zero consumers → seguro)

| De                                 | Para                 |
| ---------------------------------- | -------------------- |
| `capture_forms`                    | `forms`              |
| `capture_submissions`              | `form_submissions`   |
| `assessments`                      | `form_reports`       |
| `form_submissions.capture_form_id` | `form_id`            |
| `leads.capture_submission_id`      | `form_submission_id` |

### B. Colunas adicionadas em `forms`

- `kind text` (enum check: `form/quiz/survey/assessment/check-in/lead-capture/onboarding/brief`)
- `vertical text`
- `status text` (`draft/published/archived`)
- `logic_rules jsonb` — regras condicionais via JSON Logic (pesquisa 23 §5)
- `retention_days int` — LGPD
- `webhook_url text`
- `current_version_id uuid` — FK pra `form_versions`

### C. Colunas adicionadas em `form_submissions`

`status`, `started_at`, `completed_at`, `duration_seconds`, `anonymous_id`, `responder_email text`, `responder_phone`, `bot_score numeric`, `ip_address_hashed`, `user_agent`, `source_url`, `utm jsonb`, `consent_log jsonb`, `idempotency_key` (UNIQUE per form_id).

### D. Colunas adicionadas em `form_reports`

`form_submission_id` (FK direto, mais limpo que ir via lead), `status`, `content_md`, `blob_url`, `share_token` (UNIQUE), `share_expires_at`, `tokens_cached`, `cost_cents`, `error_message`.

### E. Nova tabela `form_versions`

Mirror de `page_versions`. Snapshots imutáveis pra versionamento Hotmart-like (pesquisa 23 §8.4 + plano §0.1 Decisão 1):

```
form_versions(id, form_id, tenant_id, version, fields_snapshot jsonb, logic_snapshot jsonb,
              published_at, published_by_user_id, created_at,
              UNIQUE(form_id, version))
```

RLS: SELECT pra tenant member. INSERT/UPDATE/DELETE bloqueado direto — só via SECDEF helper na publish action.

### F. Índices novos

- `forms_tenant_status_idx` (parcial, `WHERE deleted_at IS NULL`)
- `form_submissions_tenant_status_idx`
- `form_submissions_email_idx` (parcial)
- `form_reports_tenant_idx`
- `form_reports_submission_idx`
- `form_versions_form_idx`
- `form_versions_tenant_idx`

## Comportamento esperado

- Nenhuma row existente foi tocada (defaults aplicam pra novas inserções).
- Postgres mantém RLS policies pré-existentes anexas às tabelas renomeadas (track por OID).
- FK constraint names não foram renomeadas (Postgres permite — nome é label, comportamento intacto).

## Validação pós-migration

- `pnpm typecheck` verde ✅
- Types regenerados: 48 tabelas em `lib/contracts/database.ts` (43 pré-migration + 5 novas)
- Splinter advisors: zero warnings novos introduzidos

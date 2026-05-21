# Migrations aplicadas — índice

> Última atualização: 2026-05-20
> Convenção: cada migration tem doc full em `NNNN_nome.md`. Este índice lista todas + 1 linha cada + pointer pra ADR/blueprint que cobre a INTENÇÃO.
>
> **Gap atual:** migrations 0002, 0003, 0004, 0006-0012 não têm doc full — só linha aqui apontando pra ADR/contexto. Aceito como gap (info canônica está em ADRs).

## Convenção daqui pra frente

Cada migration nova precisa:

1. Doc full em `docs/migrations/NNNN_nome.md` (objetivo, schema changes, RLS impact, rollback)
2. Linha neste INDEX
3. Citar ADR/blueprint que explica a INTENÇÃO

## Tabela completa

| #    | Nome (slug)                         | Data       | O que faz (1 linha)                                                                                                                                   | Doc full     | Contexto/ADR                                             |
| ---- | ----------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| 0001 | initial                             | 2026-04-15 | Schema inicial: RLS + JWT hook + soft-delete universal                                                                                                | ✅ existe    | ADR-0017 (JWT claims), ADR-0033 (schema único)           |
| 0002 | (sem doc)                           | 2026-04-?  | Provavelmente schema de tenants/brands iniciais                                                                                                       | ❌ ausente   | ADR-0024 (multi-marca via hostname)                      |
| 0003 | (sem doc)                           | 2026-04-?  | Provavelmente palette + font + shape pools iniciais                                                                                                   | ❌ ausente   | ADR-0027 (hardcoded em lib/design)                       |
| 0004 | (sem doc)                           | 2026-04-?  | Provavelmente customization pools                                                                                                                     | ❌ ausente   | ADR-0028 (palettes/fonts/shapes no banco)                |
| 0005 | consolidate_to_public               | 2026-05-02 | platform.\* → public.\* (schema único)                                                                                                                | ✅ existe    | ADR-0033 (consolidate platform to public)                |
| 0006 | (sem doc)                           | 2026-05-?  | Provavelmente refactor pós-ADR-0029 (palette clone pattern)                                                                                           | ❌ ausente   | ADR-0029 (template-instance unificado)                   |
| 0007 | (sem doc)                           | 2026-05-?  | Provavelmente tenant customization scope                                                                                                              | ❌ ausente   | ADR-0027 (tenant-customization-scope)                    |
| 0008 | (sem doc)                           | 2026-05-?  | Provavelmente vertical slice features + entitlements skeleton                                                                                         | ❌ ausente   | ADR-0034 (vertical slice features)                       |
| 0009 | (sem doc)                           | 2026-05-?  | Makerkit RPCs entitlements (`can_use_feature`, `get_entitlement`, etc)                                                                                | ❌ ausente   | ADR-0039 (Makerkit RPCs entitlements)                    |
| 0010 | silence_platform_schema_introspect  | 2026-05-?  | Workaround: criou `platform.*` empty schema (depois deletado)                                                                                         | ❌ ausente   | ADR-0033 (rolled back)                                   |
| 0011 | security_hardening                  | 2026-05-10 | REVOKE EXECUTE anon/auth + `search_path = ''` + storage folder-scope                                                                                  | ❌ ausente   | ADR-0040 §H + audit RLS                                  |
| 0012 | isolate_push_secret                 | 2026-05-?  | Tabela `tenant_push_secrets` (deny-all RLS) + drop `tenants.vapid_private_key`                                                                        | ❌ ausente   | Auditoria PWA push                                       |
| 0013 | security_hardening_v2               | 2026-05-?  | Hardening adicional pós-pesquisa segurança                                                                                                            | ✅ existe    | ADR-0040 §H                                              |
| 0014 | constraint_cleanup                  | 2026-05-?  | Cleanup de constraints stale                                                                                                                          | ✅ existe    | —                                                        |
| 0015 | forms_align_research_23             | 2026-05-19 | rename `capture_*` → `form_*` + 25 colunas + `form_versions`                                                                                          | ✅ existe    | Pesquisa 23 + ADR-0041                                   |
| 0016 | structural_reserves                 | 2026-05-19 | `tenants.lifecycle_state` + `audit_log` + `notifications` + `tenant_webhooks`                                                                         | ✅ existe    | Plano funil-agencia §3                                   |
| 0017 | cross_table_tenant_consistency      | 2026-05-19 | `assert_tenant_match()` + 11 triggers tenant FK consistency                                                                                           | ✅ existe    | Audit RLS (achado 4)                                     |
| 0018 | design_system_transformation        | 2026-05-20 | Primeira tentativa de foundation do design system — REVERTIDA pela 0019                                                                               | ❌ revertida | superseded por 0020                                      |
| 0019 | revert_design_system_transformation | 2026-05-20 | Revert da 0018 (decisões precisaram retrabalho)                                                                                                       | ❌ revertida | superseded por 0020                                      |
| 0020 | design_system_foundation            | 2026-05-20 | `tenants.archetype_id/theme_mode/previous_archetype_id/archetype_changed_at` + `palettes.seed_oklch/supports_tonal_derivation` + drop `shape_presets` | ✅ existe    | ARCHITECTURE.md §11 (A1, A2, A3) + ADR-0043 (próxima)    |
| 0021 | tenant_theme_presets_reserve        | 2026-05-20 | Reserve `tenant_theme_presets` (combos nomeados alternáveis). RLS + 4 policies + partial unique 1-active-per-tenant. Vazia até Fase 2+                | ✅ existe    | ARCHITECTURE.md §12.4 + decisão design system versioning |

## Próxima migration esperada

Nenhuma planejada na Fase Foundation. Próxima virá conforme demanda real (provavelmente populate de `tenant_theme_presets` quando editor visual entrar na Fase 2, ou `tenant_brand_assets` quando D-34 ativar).

## Recuperação de gaps

Se algum dia precisar entender o que migration 0002-0014 sem doc fez:

1. `git log --all docs/migrations/` pra ver quando foram aplicadas
2. `git log --all supabase/migrations/` se houver pasta
3. ADRs apontadas na coluna "Contexto" cobrem 90% da intenção
4. Supabase Dashboard → Migrations tab lista SQL completo

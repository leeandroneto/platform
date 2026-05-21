# Status — `platform`

> Atualizado manualmente 2026-05-21 — Fase 1.5 pivot ADR-0044 done.
> NOTA: `pnpm docs:status` SOBRESCREVE este arquivo. Migrar info de Phase A + Plano dia 0 pra generator quando consolidar.

---

## Pivot ADR-0044 (TweakCN shadcn-canonical) — em execução

| Fase | Tema                                                                          | Status |
| ---- | ----------------------------------------------------------------------------- | ------ |
| -1   | Clone TweakCN read-only (SSOT)                                                | ✅     |
| 0    | Surgical delete `components/**`                                               | ✅     |
| 1    | globals.css limpo + DEFAULT_THEME + build-theme-css.ts emit canonical         | ✅     |
| 1.5  | Migration 0024 drop design system orphans + pré-fix 6 PWA routes (2026-05-21) | ✅     |
| 2    | Estudo mobile/PWA + decisão extras opt-in                                     | ⏳     |
| 3-8  | Theme storage, builder UI, presets, integration                               | ⏳     |

---

## PLANO-MESTRE-DIA-0 (em execução)

| Etapa | Tema                                                                           | Status         |
| ----- | ------------------------------------------------------------------------------ | -------------- |
| 1-5   | CLAUDE.md + rules + Etapa 5 i18n setup canônico                                | ✅             |
| 6     | APCA Silver validator                                                          | ✅             |
| 7     | 3 wrappers obrigatórios (AppForm, AppToast, AppEntitlementGate)                | ✅             |
| 8     | 3 typography (Heading, Text, Muted)                                            | ✅             |
| 9     | `<Logo>` wordmark dinâmico                                                     | ✅             |
| 10    | PWA per-tenant (manifest + icons + splash + theme-color + safe-area + Serwist) | ✅             |
| 10A   | Serwist Turbopack (ADR-0014 atualizado)                                        | ✅             |
| 10B   | Apple Touch Icon + splash 3 sizes                                              | ✅             |
| 11    | Bundle budgets `.size-limit.json`                                              | ✅             |
| 12    | Storybook 10 supersede Ladle (ADR-0038)                                        | ✅             |
| 13    | Makerkit RPCs entitlements (ADR-0039)                                          | ✅             |
| 14    | Cleanup geral docs + ressalvas                                                 | 🟡 em execução |
| 15    | Blueprints 19/20 novos (wrapper-strategy + i18n-strategy)                      | ⏳             |
| 16    | Validação completa                                                             | ⏳             |
| 17    | Teste memória JIT                                                              | ⏳             |
| 18    | Commit local                                                                   | ⏳             |

---

## Phase A — **CLOSED** ✅ (consolidado pré-plano dia 0)

| Item             | Status                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Pre-pesquisa     | 5 commits (`95a092d` → `4be49e3`) — bootstrap + consolidate + slice + revert cirúrgico + knip fix             |
| Phase A Final F1 | hooks JSON output + 6 hooks PreToolUse (ADR-0036)                                                             |
| Phase A Final F2 | shadcn MCP + wrapper pattern + hierarquia registries (ADR-0037)                                               |
| Phase A Final F3 | Storybook 10 (ADR-0038) — feito em Etapa 12 do plano                                                          |
| Phase A Final F4 | Makerkit RPCs (ADR-0039) — feito em Etapa 13 do plano                                                         |
| Phase A Final F5 | cleanup — Etapa 14 do plano em andamento                                                                      |
| Batch validação  | typecheck ✅ · lint 0/0 ✅ · 4 audits ✅ · docs:validate ✅ · test ✅ · build ✅ · size ✅ · validate:apca ✅ |

---

## Git

| Campo                          | Valor                                                       |
| ------------------------------ | ----------------------------------------------------------- |
| Branch                         | `master`                                                    |
| Commits                        | conferir via `git log --oneline`                            |
| Última mudança CLAUDE.md       | 2026-05-18 (Storybook + Makerkit + Logo + blueprints 19/20) |
| Última mudança docs/adr/       | 2026-05-18 (ADR-0038, 0039, 0040 patches)                   |
| Última mudança docs/blueprint/ | 2026-05-18 (02, 05, 11, 14, 15, 16 patches)                 |

## Package

- **Versão:** `0.1.0`

## ADRs (estado atual)

- **Total:** 42 (0001-0042 — ADR-0036/37/38/39/40/41/42 adicionados pós Phase A pré-pesquisa)
- **accepted:** 36+
- **superseded:** 6+ (0021 → 0025; 0025 → 0033; 0027 → 0028; 0028 → 0029; 0013 → 0038; ADR-0034 arch → ADR-0039)
- **Último:** ADR-0042 — elevation tokens 3 níveis (Etapa 10 plano)

## Blueprints

- **Total:** 18 (`docs/blueprint/01-18.md`)
- **Planejados Etapa 15:** `19-wrapper-strategy.md` + `20-i18n-strategy.md`

## `.claude/rules/`

- **Total:** 15 rules path-loaded
- **Adições ADR-0040 §L:** i18n, contrast, shadcn-zone, design-tokens, brand, entitlements
- **Adições pós ADR-0040:** tenant-content, design-references

## Migrations

- **Aplicadas no Supabase (`platform` project):** 0001-0009 (9 migrations)
  - 0001 baseline (platform.\*)
  - 0002 grants
  - 0003 security hardening
  - 0004 restore rls grants
  - 0005 consolidate platform → public
  - 0006 drop platform schema
  - 0007 add plans table (+ seed 3 planos A/B/C)
  - 0008 drop platform schema again
  - 0009 entitlement RPCs (`feature_usage` table + 4 RPCs + trigger `on_subscription_created`) — ADR-0039
- ℹ️ Para estado real aplicado: `mcp__plugin_supabase_supabase__list_migrations`.

## Storybook (ADR-0038)

- **Framework:** `@storybook/nextjs-vite` 10.4
- **Stories co-localizadas:** `components/**/*.stories.tsx` (9 stories dia 0)
- **MCP endpoint:** `localhost:6006/mcp` (registrado em `.mcp.json`)
- **Addons:** addon-a11y (axe), addon-docs, addon-mcp, Chromatic, addon-vitest
- **Build:** `pnpm build-storybook` ~3.4s

## Bundle (`pnpm size`)

- **app-baseline-js:** 177.67K / 500K brotli (margem 65%)
- **static-css:** 18.64K / 50K brotli (margem 63%)

## Pendências técnicas conhecidas

- `lib/contracts/database.ts` regenerar quando PostgREST cache descongelar (TYPES-PENDING casts em `lib/entitlements/server.ts`) — incidente 2026-05-18
- Plano Etapa 15 — 2 blueprints novos
- Plano Etapa 16-18 — validação + memória + commit

---

_Próxima geração: rodar `pnpm docs:status` após cleanup final. Migrar Phase A + Plano dia 0 pra script generator quando consolidar._

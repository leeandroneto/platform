# Status — `platform`

> Atualizado manualmente 2026-05-21 — Fase 1.5 pivot ADR-0044 done.
> NOTA: `pnpm docs:status` SOBRESCREVE este arquivo. Migrar info de Phase A + Plano dia 0 pra generator quando consolidar.

---

## Pivot ADR-0044 (TweakCN shadcn-canonical) — em execução

| Fase     | Tema                                                                                                             | Status |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| -1       | Clone TweakCN read-only (SSOT)                                                                                   | ✅     |
| 0        | Surgical delete `components/**`                                                                                  | ✅     |
| 1        | globals.css limpo + DEFAULT_THEME + build-theme-css.ts emit canonical                                            | ✅     |
| 1.5      | Migration 0024 drop design system orphans + pré-fix 6 PWA routes (2026-05-21)                                    | ✅     |
| 2        | Batch Theming F.1-F.5+Q9: 18 órfãos não voltam, 2 provisórios deletados, opção C extension, APCA regex+allowlist | ✅     |
| 4        | Migration 0025 theme storage + versioning + 4 actions + next-themes (2026-05-21)                                 | ✅     |
| 5 dia 0  | Extract shadows/color/registry-gen + Storybook confirm (research-41 sequencing)                                  | ✅     |
| refactor | Theme schema flat alinhado TweakCN upstream — elimina `ThemeCommonSchema`                                        | ✅     |
| ESLint   | Config refactor Q1-Q3+Q6-Q8+Q10 (research-39+42) + react-hooks v7 bump                                           | ✅     |
| 3,5-8    | Builder UI, presets, integration completa                                                                        | ⏳     |

### Background workstreams ativos (2026-05-21)

- **research-43 master architecture + stack comparative** 🟡 rodando (Opus) — clona 5 repos referência (Novel, Tiptap, Makerkit, Vercel SaaS, shadcn) + cria mapa mestre 7 layers + análise comparativa peça-por-peça

### Decisões pendentes consolidadas

- **ADR-0045 draft** — 17 decisões cravadas em status `draft` aguardando review user (Registry Strategy + AI Orchestration + Novel)
- **Batch AI/Registry** (H.1-H.11 + G.1-G.8 + 4 do research-41) — espera ADR-0045 + research-43

---

## PLANO-MESTRE-DIA-0 (em execução)

| Etapa | Tema                                                                             | Status         |
| ----- | -------------------------------------------------------------------------------- | -------------- |
| 1-5   | CLAUDE.md + rules + Etapa 5 i18n setup canônico                                  | ✅             |
| i18n  | next-intl wireup completo (request.ts + plugin + messages + layout + i18n:audit) | ✅ 2026-05-21  |
| 6     | APCA Silver validator                                                            | ✅             |
| 7     | 3 wrappers obrigatórios (AppForm, AppToast, AppEntitlementGate)                  | ✅             |
| 8     | 3 typography (Heading, Text, Muted)                                              | ✅             |
| 9     | `<Logo>` wordmark dinâmico                                                       | ✅             |
| 10    | PWA per-tenant (manifest + icons + splash + theme-color + safe-area + Serwist)   | ✅             |
| 10A   | Serwist Turbopack (ADR-0014 atualizado)                                          | ✅             |
| 10B   | Apple Touch Icon + splash 3 sizes                                                | ✅             |
| 11    | Bundle budgets `.size-limit.json`                                                | ✅             |
| 12    | Storybook 10 supersede Ladle (ADR-0038)                                          | ✅             |
| 13    | Makerkit RPCs entitlements (ADR-0039)                                            | ✅             |
| 14    | Cleanup geral docs + ressalvas                                                   | 🟡 em execução |
| 15    | Blueprints 19/20 novos (wrapper-strategy + i18n-strategy)                        | ⏳             |
| 16    | Validação completa                                                               | ⏳             |
| 17    | Teste memória JIT                                                                | ⏳             |
| 18    | Commit local                                                                     | ⏳             |

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

- **Total:** 45 (0001-0045 — ADR-0043 design system pré-pivot superseded, ADR-0044 pivot TweakCN accepted, ADR-0045 registry strategy draft)
- **accepted:** 38+
- **draft:** ADR-0045 (Registry Strategy + AI Orchestration + Novel — 17 decisões aguardando review user)
- **superseded:** 7+ (0021 → 0025; 0025 → 0033; 0027 → 0028; 0028 → 0029; 0013 → 0038; ADR-0034 arch → ADR-0039; ADR-0043 → ADR-0044)
- **Último accepted:** ADR-0044 — Pivot TweakCN-way + shadcn-canonical (2026-05-21)

## Blueprints

- **Total:** 21 (`docs/blueprint/00-PROJETO.md` + 01-21)
- **Recentes:** 19-wrapper-strategy, 20-i18n-strategy, 21-engine-catalog

## `.claude/rules/`

- **Total:** 19 rules path-loaded
- **Adições ADR-0040 §L:** i18n, contrast, shadcn-zone, design-tokens, brand, entitlements
- **Pós-pivot ADR-0044:** tenant-content, forms-engine, docs-writing (design-references DELETADA)

## Research docs

- **Total:** 42 (`docs/research/01-42.md`)
- **Pivot-related (2026-05-21):** 28 tweakcn-eval · 29-31 estudos pivot · 33 theme-versioning (G.1-G.5) · 37 mobile/PWA extras opt-in (F.1-F.5) · 38 registry+Novel+AI (H.1-H.11) · 39 ESLint conventions (Q1-Q10) · 40 shadcn registry deep-dive (G.1-G.8) · 41 batch audit Fases 5+6+7 · 42 ESLint best-practices validation (90% alinhado)
- **Em curso:** 43 master architecture + stack comparative (Opus background)

## Master Architecture

- **`docs/architecture/01-master-system-map.md`** — em criação via research-43 (Opus background)
- **`docs/design-system/20-concept-map.md`** — concept map atualizado pós-pivot ADR-0044 + refactor flat schema

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

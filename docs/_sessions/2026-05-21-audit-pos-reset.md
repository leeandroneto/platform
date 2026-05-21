# Auditoria Pós-Reset (Fase A do plano de organização)

> **Tipo:** inventário read-only. Fase B fará as updates baseado neste output.
> **Estado git:** `main` em `5d0a0ea chore(pivot): hard reset pra 888953f + preservadas decisoes`, working tree limpo, 1 commit ahead do origin.
> **Tempo investido:** ~75min (leitura sessões + 3 ADRs críticos + 13 rules + 11 memories + inventário 6 áreas + 4 gates build).
> **Pré-leitura confirmada:** `2026-05-21-tweakcn-canonical-vs-invented.md`, `2026-05-21-auditoria-pivot-tweakcn.md`, ADR-0044, plano `pivot-tweakcn.md`, `CLAUDE.md` (stale — confirmado).
> **TweakCN clone:** `C:\Users\leean\Desktop\tweakcn-ref\` existe e tem `actions/ app/ components/ db/ drizzle/ hooks/ lib/ middleware.ts` — Fase -1 do plano de pivot está fechada.

## 0. Resumo executivo

O reset `888953f` deixou um codebase **muito enxuto** (~50 arquivos em `lib/`, 65 em `components/ui/`, 6 wrappers app-\*) — pré-pivot-design-system, intacto. **Tudo do bloco design-system inflado (22 archetypes, 67 roles, lazy archetypes, native aliases, 9.580 LOC) está fora do tree.** Sobreviveu o que dia-0 fechou: shadcn primitives, 3 wrappers obrigatórios (`AppForm`, `AppToast`, `AppEntitlementGate`), multi-brand runtime resolver, APCA Silver helpers, mobile primitives universais. Build, typecheck, lint --max-warnings 0, vocab:audit, token:audit, validate:apca **todos verdes**. Porém **23 docs (rules + memories + ADR-0040 + CLAUDE.md) ainda apontam pro mundo pré-pivot**: design-references.md fala "NUNCA copie tokens literais" (tese invertida em ADR-0044 §13), design-tokens.md lista `--shape-*` (deprecado ADR-0044 §5), memory `project_design_system_state.md` lista 22 archetypes/35 paletas/28 roles (ADR-0044 §11 jogou tudo fora). CLAUDE.md está datado 2026-05-18 (3 dias stale) e referencia plano antigo `PLANO-DIA-1-AGENCY-FUNNEL.md` em vez do `pivot-tweakcn.md` ativo. Fase B deve priorizar atualização de CLAUDE.md + rules + 3 memory files antes de qualquer code novo do pivot.

## 1. Inventário estrutural

### 1.1 `lib/`

```
lib/
├── brand/               types.ts (1 arquivo)
├── contracts/           action, database, entitlements, errors, money, result (6)
├── design/              contrast, motion, palettes, tokens + seeds/{fonts,palettes,shapes} (7)
├── domain/              roles.{ts,test.ts} (2)
├── entitlements/        client, EntitlementProvider, server, types (4)
├── env.ts
├── route/               getRouteByHost, RouteProvider, types (3)
├── supabase/            admin, client, server (3)
└── utils.ts             cn() helper (tailwind-merge + clsx)
```

| Pasta               | Categoria  | Notas                                                                                                                                                                                                                                   |
| ------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/brand/`        | ✅ FICA    | Só types — RouteProvider real vive em `lib/route/`                                                                                                                                                                                      |
| `lib/contracts/`    | ✅ FICA    | SSOT — `Result`, `AppError`, `Money`, schemas core                                                                                                                                                                                      |
| `lib/design/`       | ⚠️ ATENÇÃO | `tokens.ts`, `motion.ts`, `palettes.ts` precisam re-bater contra ADR-0044 vocab (28 canonical, OKLCH-primary, 6 shadow primitives). `contrast.ts` APCA = KEEP integral. `seeds/shapes.seed.ts` referencia tokens `--shape-*` deprecados |
| `lib/domain/`       | ✅ FICA    | Só roles (RBAC) — outras features não chegaram                                                                                                                                                                                          |
| `lib/entitlements/` | ✅ FICA    | Funcional, ADR-0034/0035/0039 cravados                                                                                                                                                                                                  |
| `lib/route/`        | ✅ FICA    | Multi-tenant runtime resolver — ADR-0044 confirma KEEP integral                                                                                                                                                                         |
| `lib/supabase/`     | ✅ FICA    | Foundational                                                                                                                                                                                                                            |
| `lib/env.ts`        | ✅ FICA    | Foundational                                                                                                                                                                                                                            |

**Não existem ainda:** `lib/data/`, `lib/hooks/`, `lib/api/`, `lib/forms/`, `lib/ai/`, `lib/engines/` — vão entrar JIT conforme features dispararem.

### 1.2 `components/`

```
components/
├── _showcase/                    motion.stories.tsx + palettes.stories.tsx (2)
├── app-entitlement-gate.{tsx,stories.tsx}
├── app-form.{tsx,stories.tsx}
├── app-toast.{tsx,stories.tsx}
├── motion-provider.tsx
├── version-switcher.tsx
└── ui/                           65 shadcn primitives + 6 typography custom
```

| Item                                                                                                     | Categoria  | Notas                                                                                 |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `components/ui/*` (65 primitives)                                                                        | ✅ FICA    | Vendor surface intocável — shadcn-zone rule ativa                                     |
| `components/ui/{heading,text,muted,logo}.{tsx,stories.tsx}`                                              | ✅ FICA    | 4 typography custom dia-0 (Tarefa 24)                                                 |
| `components/ui/field.tsx`, `input-group.tsx`, `button-group.tsx`, `item.tsx`, `empty.tsx`, `spinner.tsx` | ✅ FICA    | shadcn novos primitives                                                               |
| `app-form.tsx` + `app-toast.tsx` + `app-entitlement-gate.tsx`                                            | ✅ FICA    | 3 wrappers obrigatórios dia-0 (ADR-0040 §E)                                           |
| `motion-provider.tsx`                                                                                    | ✅ FICA    | Motion presets wrapper                                                                |
| `version-switcher.tsx`                                                                                   | ⚠️ ATENÇÃO | Provavelmente sidebar-block — checar uso                                              |
| `_showcase/motion.stories.tsx`, `palettes.stories.tsx`                                                   | ⚠️ ATENÇÃO | Stories dev-only; `palettes.stories.tsx` pode referenciar 13 paletas seed — verificar |

**Não existe:** `components/ds/`, `components/kibo-ui/`, `components/_showcase/<archetype>/` — pré-pivot, ainda não materializado.

### 1.3 `app/`

```
app/
├── (client)/portal/page.tsx
├── api/
│   ├── brands/[id]/{icon,manifest,splash,theme.css}/route.ts
│   └── tenants/[id]/{icon,manifest,splash,theme.css}/route.ts
├── login/page.tsx
├── offline/page.tsx
├── serwist/[path]/route.ts
├── favicon.ico
├── globals.css
├── layout.tsx
├── page.tsx
└── sw.ts
```

| Item                                                                 | Categoria  | Notas                                                                                                                                                      |
| -------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                                                     | ⚠️ ATENÇÃO | DynamicShell + ThemeStyle via `<link rel="stylesheet" precedence>` — vai bater contra ADR-0044 nova estratégia (CSS inline RSC). Migration JIT em Fase 2   |
| `app/globals.css`                                                    | ⚠️ ATENÇÃO | 240 linhas, usa `--shape-*` deprecado (ADR-0044 §5), `--elevation-flat/raised/overlay` (ADR-0042 superseded), 5 surfaces. ZERO `--role-*` invented — limpo |
| `app/api/{tenants,brands}/[id]/theme.css/route.ts`                   | ⚠️ ATENÇÃO | Emit endpoint vai mudar com ADR-0044 vocab canonical                                                                                                       |
| `app/api/{tenants,brands}/[id]/{icon,manifest,splash}/route.ts`      | ✅ FICA    | PWA infra                                                                                                                                                  |
| `app/(client)/portal/page.tsx`                                       | ✅ FICA    | Mínimo — placeholder                                                                                                                                       |
| `app/login/page.tsx`                                                 | ✅ FICA    | Mínimo — placeholder                                                                                                                                       |
| `app/offline/page.tsx` + `app/serwist/[path]/route.ts` + `app/sw.ts` | ✅ FICA    | Serwist PWA infra                                                                                                                                          |
| `app/page.tsx`                                                       | ✅ FICA    | Root placeholder (49 bytes — empty)                                                                                                                        |

**Não existe:** `app/showcase/`, `app/dashboard/`, `app/signup/`, `app/(admin)/`, `app/(public)/` — confirmado pré-pivot, conforme briefing.

### 1.4 `messages/pt-BR/`

```
messages/pt-BR/
└── common.json (1 namespace, 1.3KB)
```

Apenas `common.json`. **Não existem** `auth.json`, `entitlements.json`, `navigation.json`, `showcase.json`, `voice/` — todos pós-pivot que sumiram com reset. Conforme `.claude/rules/i18n.md`, namespaces nascem JIT por feature.

### 1.5 `docs/`

```
docs/
├── _archive/            5 pastas + master-plan-original.md + memory + plans/
├── _sessions/           9 reflexões 2026-05-19 → 2026-05-21
├── _status.md           6.5KB
├── adr/                 45 ADRs (0001 → 0044) + README.md (20KB índice)
├── blueprint/           22 docs (00-PROJETO → 21-engine-catalog) + QUICK-START + _VALIDACAO
├── design-system/       VAZIO
├── migrations/          9 docs (0001, 0005, 0013-0021) + INDEX.md
├── plans/               6 arquivos (design-system, funil-agencia, pivot-tweakcn, 2 antigos, README)
├── references/          como-usar.md + design-systems/ (71 brands) + mobile-native-patterns/
└── research/            27 docs (01-25 + 28-31 — gaps 26,27 removidos)
```

| Subfolder             | Categoria   | Notas                                                                                                                                                                                             |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/_archive/`      | ✅ FICA     | Histórico JIT                                                                                                                                                                                     |
| `docs/_sessions/`     | ✅ FICA     | 9 reflexões — 4 são as do pivot (3 prefixadas `2026-05-21`)                                                                                                                                       |
| `docs/adr/`           | ⚠️ ATENÇÃO  | 45 ADRs — ver §4                                                                                                                                                                                  |
| `docs/blueprint/`     | ⚠️ ATENÇÃO  | `05-design-system.md` ficou stale (descreve shape-presets/13 paletas/3 elevations — ADR-0044 deprecou tudo). Outros 21 docs provavelmente intactos                                                |
| `docs/design-system/` | ❌ OBSOLETO | Folder vazio — plano `pivot-tweakcn.md` §1.3 já marca delete                                                                                                                                      |
| `docs/migrations/`    | ✅ FICA     | Espelha migrations MCP-aplicadas; INDEX.md lista 9                                                                                                                                                |
| `docs/plans/`         | ⚠️ ATENÇÃO  | `design-system.md` (1d Foundation+Components, pré-pivot) deve archive; `funil-agencia.md` pausado; `pivot-tweakcn.md` ativo; 2 antigos (PLANO-DIA-1 e PLANO-MESTRE-DIA-0) — README precisa update |
| `docs/references/`    | ❌ OBSOLETO | `design-systems/` (71 brands DESIGN.md) marcado pra delete em plano `pivot-tweakcn.md` §1.3 item 14. `mobile-native-patterns/` — checar se ainda tem valor                                        |
| `docs/research/`      | ⚠️ ATENÇÃO  | 27 pesquisas. `20-naming-mappings`, `26-design-system-vibes`, `27-design-tokens-per-archetype` marcadas pra delete em plano §1.3 itens 15-17. Pesquisas 29/30/31 são parte do pivot — keep        |

### 1.6 `scripts/`

```
scripts/
├── adr-index.ts          gera índice ADR
├── docs-status.ts        relatório status docs
├── docs-validate.ts      lint docs
├── grep-disables.sh      busca disable-next-line
├── token-audit.sh        ✅ verde
├── validate-palettes.ts  ✅ APCA 152/258 OK
└── vocab-audit.sh        ✅ verde
```

**Todos os 7 scripts são foundational e passam.** `validate-palettes.ts` confirma APCA Silver intacto em 13 paletas (152 combos passaram, 106 warns secundários permitidos).

## 2. `package.json` deps

### 2.1 KEEP — usado em código sobrevivente (28)

| dep                                                                                                   | usos                                                                      |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@hookform/resolvers`, `react-hook-form`, `zod`, `class-variance-authority`, `clsx`, `tailwind-merge` | wrappers + ui                                                             |
| `next@16.2.6`, `react@19.2.4`, `react-dom`, `next-intl`, `next-themes`                                | foundational                                                              |
| `@supabase/ssr`, `@supabase/supabase-js`                                                              | data layer                                                                |
| `motion@12`                                                                                           | motion-provider (CLAUDE.md travado: `motion/react` NUNCA `framer-motion`) |
| `sonner`                                                                                              | toast                                                                     |
| `radix-ui`                                                                                            | 37 imports em ui/\* shadcn primitives                                     |
| `apca-w3`, `culori`                                                                                   | `lib/design/contrast.ts` APCA Silver                                      |
| `lucide-react`                                                                                        | ui/\* primitives                                                          |
| `vaul`                                                                                                | `ui/drawer.tsx`                                                           |
| `cmdk`                                                                                                | `ui/command.tsx`                                                          |
| `input-otp`                                                                                           | `ui/input-otp.tsx`                                                        |
| `react-day-picker`                                                                                    | `ui/calendar.tsx`                                                         |
| `embla-carousel-react`                                                                                | `ui/carousel.tsx`                                                         |
| `react-resizable-panels`                                                                              | `ui/resizable.tsx`                                                        |
| `recharts`                                                                                            | `ui/chart.tsx`                                                            |
| `@serwist/next`, `@serwist/turbopack`, `serwist`, `tw-animate-css`                                    | PWA / Tailwind                                                            |
| `tsx`, `husky`, prettier/eslint config etc                                                            | toolchain                                                                 |
| `storybook@10` + `@storybook/nextjs-vite` + `@storybook/addon-*`                                      | stories existentes                                                        |

### 2.2 DORMENTE — instaladas mas sem consumer no código sobrevivente

| dep                                                     | count usos código                             | decisão                                                                                        |
| ------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `@ai-sdk/anthropic`                                     | 0                                             | ⚠️ JIT — vai voltar em Fase 4 (vibe coding)                                                    |
| `ai` (Vercel AI SDK)                                    | 0                                             | ⚠️ JIT — Fase 4                                                                                |
| `@base-ui/react`                                        | 0                                             | ❌ JIT — não vi referência em research/ADRs; provavelmente nasceu de pesquisa não-implementada |
| `idb-keyval`                                            | 0                                             | ❌ JIT — pré-cache PWA offline futuro                                                          |
| `@sentry/nextjs`                                        | 0                                             | ❌ JIT — telemetria não wired (ADR-0040 §I planejado JIT)                                      |
| `posthog-js`                                            | 0                                             | ❌ JIT — analytics não wired                                                                   |
| `react-email` + `resend`                                | 0                                             | ❌ JIT — email pipeline futuro                                                                 |
| `@vercel/og`                                            | 0                                             | ❌ JIT — OG images futuro                                                                      |
| `@tanstack/react-table`                                 | 0                                             | ❌ JIT — data-grid futuro                                                                      |
| `@dnd-kit/{core,modifiers,sortable,utilities}` (4 pkgs) | 0                                             | ❌ JIT — drag-drop futuro (editor visual)                                                      |
| `date-fns`                                              | 0 (só usado internamente em react-day-picker) | manter (dep transitiva consumida)                                                              |

### 2.3 Recomendação remover N deps

**NÃO remover nenhuma agora.** Análise:

- 10 deps dormentes têm trajetória clara em ADRs/research (ai-sdk, ai, sentry, posthog, react-email, resend, vercel/og, dnd-kit, tanstack/react-table, idb-keyval). Removê-las agora obriga re-add depois quando feature disparar.
- `@base-ui/react` é candidato a remoção mas vou recomendar **verificar com user na Fase B** se foi instalado deliberadamente.
- **Recomendação:** rodar `pnpm knip` (já configurado em `knip.config.ts`) em Fase B pra mapeamento determinístico antes de remover.

## 3. `.claude/rules/` — análise por rule

**Total:** 19 rules (CLAUDE.md diz 17, lista real conta 19 — discrepância documental).

| Rule                   | Propósito original                                                                   | Pós-pivot? | Próxima ação                                                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstractions.md`      | Lista helpers canon (`Result`, `AppError`, etc)                                      | ✅ yes     | KEEP — sem ref a archetype/roles                                                                                                                                                                                                                |
| `brand.md`             | Brand identity via `useBrand()` + env, nunca hardcoded                               | ✅ yes     | KEEP — ADR-0044 confirma multi-tenant runtime preservado                                                                                                                                                                                        |
| `components.md`        | Hierarquia + wrapper pattern, marker RESEARCH                                        | ✅ yes     | KEEP — pattern sólido, sem ref a `--role-*`                                                                                                                                                                                                     |
| `contrast.md`          | APCA Silver 75/60/45 + helpers `lib/design/contrast.ts`                              | ✅ yes     | KEEP integral — ADR-0044 confirma APCA dual-gate inalterado                                                                                                                                                                                     |
| `data-layer.md`        | `function(client, args)`, lança erro                                                 | ✅ yes     | KEEP                                                                                                                                                                                                                                            |
| `design-references.md` | "USA APENAS mood, NUNCA tokens literais" das 71 DESIGN.md                            | ❌ no      | **DELETE** — ADR-0044 §13 inverte a tese (copia tokens literais é o objetivo) E plano `pivot-tweakcn.md` §1.2 manda delete inteiro porque `docs/references/design-systems/` também vai sumir. Confirmação no ADR-0044 §14 alvos.                |
| `design-tokens.md`     | Tabela canon: `--color-primary`, `--shape-*`, `--elevation-flat/raised/overlay`, etc | ⚠️ partial | **REWRITE** — tabela atual lista `--shape-*` (ADR-0044 §5 deprecou), `--elevation-flat/raised/overlay` (ADR-0042 superseded). ADR-0044 vocab oficial: 28 canonical shadcn + 6 shadow primitives + 1 `--radius`. Reescrever em Fase B Foundation |
| `docs-writing.md`      | Mapa "qual tipo de info vai em qual arquivo"                                         | ✅ yes     | KEEP — pattern meta sólido                                                                                                                                                                                                                      |
| `domain-logic.md`      | Lógica pura, zero IO, `.test.ts` obrigatório                                         | ✅ yes     | KEEP                                                                                                                                                                                                                                            |
| `entitlements.md`      | `requireEntitlement` + `AppError i18n` + plan-gates                                  | ✅ yes     | KEEP — ADR-0039 ainda válida                                                                                                                                                                                                                    |
| `features.md`          | Vertical slice + plan-gates.ts obrigatório                                           | ✅ yes     | KEEP — ADR-0034/0035 ainda válidas                                                                                                                                                                                                              |
| `forms-engine.md`      | Form Engine + Page Engine + IA pipeline + Hotmart versionamento                      | ✅ yes     | KEEP — engines independentes do pivot design system                                                                                                                                                                                             |
| `i18n.md`              | `t()` desde 1ª string + namespaces JIT + AppError i18n                               | ✅ yes     | KEEP — sólida                                                                                                                                                                                                                                   |
| `jwt-claims.md`        | RLS `auth.jwt() ->> tenant_id` + 5 roles canon                                       | ✅ yes     | KEEP                                                                                                                                                                                                                                            |
| `layers.md`            | Camadas + Sheriff boundaries                                                         | ✅ yes     | KEEP                                                                                                                                                                                                                                            |
| `naming.md`            | 16 termos banidos + vocab canon engines                                              | ⚠️ partial | **UPDATE MINOR** — adicionar à seção "vocabulário banido": `archetype` (como bundle), `role-*` (67 invented), 5 slots tipografia, 7 estratégias canônicas, voice tokens. Conforme ADR-0044 "Vocabulário banido".                                |
| `server-actions.md`    | `{ok,data}\|{ok,error}` discriminated union                                          | ✅ yes     | KEEP                                                                                                                                                                                                                                            |
| `shadcn-zone.md`       | `components/ui/*` quarentenado, 3 wrappers obrigatórios                              | ✅ yes     | KEEP — zona + 3 wrappers ainda fechados                                                                                                                                                                                                         |
| `tenant-content.md`    | 4 níveis (static / per-tenant string / template+slots / block builder)               | ✅ yes     | KEEP                                                                                                                                                                                                                                            |

**Counts:** 13 KEEP integral, 4 KEEP (sem mudança), 1 UPDATE MINOR (`naming.md`), 1 REWRITE (`design-tokens.md`), 1 DELETE (`design-references.md`).

## 4. `docs/adr/` — análise por ADR

**Total:** 45 ADRs (0001 → 0044) — 0042 já está superseded por 0043, 0043 já está superseded por 0044.

| ADR                                              | Tema curto                                                                                                    | Status header | Pós-pivot?                                                                                                                                                                                                 | Próxima ação                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 0001-0023                                        | dia-0 fundacionais (schema, mobile-first, shadcn-100, branding, pipeline UI, marca pai, multi-brand hostname) | accepted      | ✅ yes                                                                                                                                                                                                     | KEEP — não tocam design system |
| 0024 multi-brand-via-hostname                    | accepted                                                                                                      | ✅ yes        | KEEP — ADR-0044 explícito mantém                                                                                                                                                                           |
| 0025 schema-rename-platform                      | superseded by 0033                                                                                            | n/a           | KEEP histórico                                                                                                                                                                                             |
| 0026 multi-domain-tenant                         | accepted                                                                                                      | ✅ yes        | KEEP                                                                                                                                                                                                       |
| 0027 tenant-customization-scope                  | accepted                                                                                                      | ⚠️ partial    | KEEP — ainda válido, mas `customization` é vocab banido (naming rule)                                                                                                                                      |
| 0028 customization-pools-no-banco                | accepted                                                                                                      | ⚠️ partial    | **UPDATE** — `--shape-*` tokens foram deprecados em ADR-0044 §5; pool shape_presets table foi descartada em migration 0018. Header ainda diz accepted — deveria ser "superseded em parte por ADR-0044 §5". |
| 0029 template-instance-pattern-unificado         | accepted                                                                                                      | ✅ yes        | KEEP — pattern Hotmart-like sólido                                                                                                                                                                         |
| 0030 relax-exact-optional-property-types         | accepted                                                                                                      | ✅ yes        | KEEP                                                                                                                                                                                                       |
| 0031 lint-overrides-intentional                  | accepted                                                                                                      | ✅ yes        | KEEP                                                                                                                                                                                                       |
| 0032 validator-paletas-escopo-x                  | accepted                                                                                                      | ⚠️ partial    | **UPDATE** — Bronze foi promovido pra Silver em ADR-0040 §H, mas 0032 ainda diz "Bronze threshold". Header refresh                                                                                         |
| 0033 consolidate-platform-to-public              | accepted                                                                                                      | ✅ yes        | KEEP — schema único                                                                                                                                                                                        |
| 0034 vertical-slice-features-entitlements        | accepted                                                                                                      | ✅ yes        | KEEP                                                                                                                                                                                                       |
| 0035 feature-gating-ux-pattern                   | accepted                                                                                                      | ✅ yes        | KEEP                                                                                                                                                                                                       |
| 0036 hooks-json-output-eslint-comments           | accepted                                                                                                      | ✅ yes        | KEEP                                                                                                                                                                                                       |
| 0037 wrapper-pattern-hierarchy-registries        | accepted                                                                                                      | ✅ yes        | KEEP — hierarquia + Aceternity-out preservados                                                                                                                                                             |
| 0038 storybook-substitui-ladle                   | accepted                                                                                                      | ✅ yes        | KEEP — Storybook 10 ativo                                                                                                                                                                                  |
| 0039 makerkit-rpcs-entitlements                  | accepted                                                                                                      | ✅ yes        | KEEP — RPCs cravados                                                                                                                                                                                       |
| 0040 fechamento-dia-0 (consolidação 19 decisões) | accepted                                                                                                      | ⚠️ partial    | **UPDATE** — seção sobre design system / 28 roles invented está stale; APCA Silver + i18n + shadcn-zone + entitlements ainda válidos. Header refresh + nota "design system superseded por ADR-0044"        |
| 0041 engine-catalog-2-motores-kind-scope         | accepted                                                                                                      | ✅ yes        | KEEP — engines independentes                                                                                                                                                                               |
| 0042 elevation-tokens-3-niveis                   | accepted                                                                                                      | ❌ no         | **MARCAR superseded** by ADR-0044 §3 (6 shadow primitives + 8 níveis algorítmicos). Conforme `docs/_sessions/2026-05-21-revert-audit-completo.md`.                                                         |
| 0043 design-system-architecture-consolidated     | superseded by 0044                                                                                            | ❌ no         | KEEP histórico — header já marca superseded                                                                                                                                                                |
| 0044 pivot-tweakcn-shadcn-canonical              | accepted (supersedes 0043)                                                                                    | ✅ yes        | KEEP — fonte autoritativa pivot                                                                                                                                                                            |

**Counts:** 36 KEEP, 4 UPDATE (0027, 0028, 0032, 0040), 1 MARK SUPERSEDED (0042), 1 KEEP histórico (0025), 2 ja com superseded marker (0025, 0043), 1 fonte autoritativa nova (0044).

## 5. Memórias — análise por memory file

**Path:** `C:\Users\leean\.claude\projects\C--Users-leean-Desktop-platform\memory\`. **11 arquivos** (1 index + 10 individuais).

| Memory                                   | Resumo                                                                                  | Válida?                                                                                                                                                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MEMORY.md`                              | Index de 10 ponteiros                                                                   | ⚠️ partial — index OK mas alguns alvos stale                                                                                                                                                                              |
| `feedback_pnpm_parallel_add.md`          | pnpm add paralelo causa race em package.json — serializar                               | ✅ yes                                                                                                                                                                                                                    |
| `feedback_jit_anchoring.md`              | JIT só funciona com âncora no trigger (hook/lint/rule path-loaded)                      | ✅ yes                                                                                                                                                                                                                    |
| `feedback_mil_passos_a_frente.md`        | Feature = instância de infra; Catalog+Registry+Spec; H1→H2→H3                           | ⚠️ partial — princípio sólido, mas refere "H1/H2/H3" enquanto vocabulário atual é "Fase 1/2/3" (CLAUDE.md/ADR-0041)                                                                                                       |
| `feedback_secdef_validates_tenant_id.md` | SECDEF com p_tenant_id sempre valida via current_tenant_id() no body                    | ✅ yes                                                                                                                                                                                                                    |
| `feedback_frescura_filter.md`            | MVP solo: sem lead scoring, A/B, view counters, sentiment, dashboards                   | ✅ yes                                                                                                                                                                                                                    |
| `feedback_research_briefing_intent.md`   | Pesquisas complementares são 1 sistema, não N silos                                     | ✅ yes                                                                                                                                                                                                                    |
| `feedback_decision_process.md`           | 1 decisão por vez + recomendação explícita, próxima automática                          | ✅ yes                                                                                                                                                                                                                    |
| `project_plano_dia_1.md`                 | Plano Dia 1 — Funil Agência (pesquisa 23 + 5 decisões + Etapa 0a)                       | ❌ STALE — header diz "2 days old"; plano referido era ativo até pivot. Não menciona ADR-0044, TweakCN clone, surgical delete. Atualizar OU criar `project_plano_pivot_tweakcn.md` substituindo                           |
| `project_harmonizacao_3_features.md`     | Funil agência = 1 sistema 3 motores (form+page+report) — sessão 2026-05-19 PAUSADA      | ⚠️ partial — pausa ainda válida (funil-agencia.md pausado em `docs/plans/`), mas memory não reflete pivot design system ocorrido depois. Provavelmente keep como "histórico do que pausou" + adicionar referência cruzada |
| `project_design_system_state.md`         | 22 archetypes / 35 paletas / 28 roles (D-43) / 22 esqueletos / Fase Foundation pendente | ❌ STALE — header "2 days old"; **TUDO ISSO foi descartado em ADR-0044 §11**. Memory inteiro contradiz ADR-0044. **REWRITE COMPLETO** apontando pra ADR-0044 + plano `pivot-tweakcn.md`                                   |

**Counts:** 6 válidas, 2 partial, 2 STALE (rewrite necessário), 1 index (partial).

## 6. Build / Lint / Audit status

| Gate                            | Status   | Output curto                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`                  | n/a      | Não rodado (working tree limpo, deps presumido sync)                                                                                                                                                                                                                         |
| `pnpm typecheck`                | ✅ verde | `tsc --noEmit` sem erros                                                                                                                                                                                                                                                     |
| `pnpm lint --max-warnings 0`    | ✅ verde | `eslint . "--max-warnings" "0"` sem output (zero warnings)                                                                                                                                                                                                                   |
| `pnpm vocab:audit`              | ✅ verde | `vocab:audit clean (0 hits fora da allowlist)`                                                                                                                                                                                                                               |
| `pnpm token:audit`              | ✅ verde | `token:audit clean`                                                                                                                                                                                                                                                          |
| `pnpm validate:apca` (prebuild) | ✅ verde | `152/258 passaram, 0 errors, 106 warns` — APCA Silver dual-gate OK                                                                                                                                                                                                           |
| `pnpm build`                    | ✅ verde | Next 16 PPR: 9 static pages prerendered + Proxy middleware + 8 API routes funcionando. Compiled 4.3s, TypeScript 10.4s. Rotas: `/`, `/login`, `/offline`, `/portal`, `/_not-found` (PPR) + 8 API endpoints (icon/manifest/splash/theme.css × tenants+brands) + serwist sw.js |

**Conclusão build:** **tudo verde**. Reset preservou um codebase 100% buildable. **Não há nada pra "consertar" antes da Fase B** — Fase B foca em alinhamento documental.

## 7. Recomendações pra Fase B (organização) — priorizadas

### P0 — Antes de qualquer code do pivot

1. **REWRITE `CLAUDE.md`** (3 dias stale). Atualizar: data, plano ativo (`pivot-tweakcn.md` em vez de `PLANO-DIA-1-AGENCY-FUNNEL.md`), seção "Onde fica cada coisa" (apontar pro `docs/_sessions/2026-05-21-*` + ADR-0044), regras críticas (vocabulário banido novo do ADR-0044: `archetype` como bundle, `role-*`, 5 font slots, etc), tabela de plans, lista de 19 rules (não 17), referenciar TweakCN clone read-only.

2. **REWRITE `project_design_system_state.md`** (memory). Conteúdo atual contradiz ADR-0044 §11 inteiro. Substituir por estado pós-pivot: shadcn-canonical 41 tokens TweakCN-vocab; OKLCH-primary; 28 cores + 3 fontes + 1 radius + 6 shadow primitives; mobile primitives universais em `globals.css`; presets em `lib/design/presets/<slug>.ts`; multi-tenant runtime preservado.

3. **UPDATE `project_plano_dia_1.md`** (memory) **OU** criar `project_plano_pivot_tweakcn.md` novo apontando pra plano ativo + ADR-0044. Marcar plano dia 1 como pausado.

4. **DELETE `.claude/rules/design-references.md`** — tese invertida pela ADR-0044 §13 + alvo (`docs/references/design-systems/`) vai sumir per plano §1.3 item 14. **Não inverter** — rule órfã sem escopo. Conforme plano `pivot-tweakcn.md` §1.2 já documenta delete.

5. **REWRITE `.claude/rules/design-tokens.md`** — tabela canon atual lista `--shape-*` + `--elevation-flat/raised/overlay` (ambos deprecados). Reescrever com shadcn-canonical 28 tokens + 6 shadow primitives + 1 `--radius` + mobile primitives universais. Manter "@theme inline" mapeamento + APCA referência.

### P1 — Limpar marcadores stale em ADRs antigos

6. **MARK SUPERSEDED `ADR-0042`** (elevation tokens 3-níveis) — header ainda diz accepted. Adicionar "Superseded by ADR-0044 §3 (6 shadow primitives + 8 níveis algorítmicos)".

7. **UPDATE `ADR-0040`** seção design system — adicionar nota top: "Decisões §H APCA Silver + §G i18n + §E shadcn-zone permanecem. Decisões sobre 28 roles invented (`--role-*`) e 5 slots tipografia foram superseded por ADR-0044 §11."

8. **UPDATE `ADR-0028`** (customization pools) — marcar `--shape-*` deprecated em §5 ADR-0044; manter pools de paletas/fonts válido.

9. **UPDATE `ADR-0032`** (validator paletas) — atualizar threshold Bronze → Silver (foi promovido em ADR-0040 §H).

### P2 — Naming + vocab cleanup

10. **UPDATE `.claude/rules/naming.md`** — adicionar à seção vocab banido: `archetype` (como bundle estrutural — sobrevive só como `tenants.archetype_id text` legacy), `role-*` (todos 67 invented), 5 slots tipografia (`--font-display/body/mono/accent/eyebrow`), 7 estratégias canônicas (`mechanic-swap`, `tinted-brand`, `frosted-opt-in`, etc), voice tokens per archetype. Conforme ADR-0044 final.

11. **UPDATE `docs/plans/README.md`** — refletir 3 planos atuais: `pivot-tweakcn.md` ativo / `funil-agencia.md` pausado / `design-system.md` archive. Mover `design-system.md` pra `docs/_archive/plans/`.

12. **UPDATE `docs/_status.md`** — refletir estado pós-reset (`888953f` + commits preservation `5d0a0ea`).

### P3 — Itens informativos (não bloqueantes)

13. **VERIFICAR `components/_showcase/palettes.stories.tsx`** — provavelmente OK (palettes seed inalterado) mas confere se referencia tokens deprecados.

14. **VERIFICAR `lib/design/seeds/shapes.seed.ts`** — pool `--shape-*` foi deprecado (ADR-0044 §5). Decidir: delete completo ou mantém schema vazio até Fase 1 do pivot.

15. **VERIFICAR `lib/design/tokens.ts`** — bater contra ADR-0044 vocab oficial (28 canonical, OKLCH-primary).

16. **NÃO REMOVER deps dormentes** (`@base-ui/react`, etc) agora. Rodar `pnpm knip` em Fase B se quiser mapeamento determinístico.

17. **Considerar `docs/references/mobile-native-patterns/`** — não foi explicitamente alvo do plano `pivot-tweakcn.md`. Verificar conteúdo (provavelmente keep — iOS HIG / Material 3 patterns universais).

---

**Fim da auditoria.** Fase B agora pode atacar P0 (5 itens) → P1 (4 itens) → P2 (3 itens) → P3 (5 itens) com confiança. Estimativa Fase B: 4-6h (writing em sua maioria).

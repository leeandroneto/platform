# 15 — Bootstrap Checklist (~70h dia 0)

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Lista executável das 30 tarefas dia 0 do repo `desafit/` greenfield.
> Origem: decisão `_CONFLITOS #16` (pipeline UI dia 0 ~70h) + Sprint 1-2 do `12-sprint-plan.md`.

---

## 0. Como usar este checklist

- **Path destino:** `C:/Users/leean/Desktop/desafit/` (FORA do working dir atual `onboarding-bio/`)
- **Ordem importa.** Cada tarefa lista _Dependência_ (qual deve estar pronta antes)
- **Done = critério explícito.** Não marcar [x] sem cumprir
- **Commits após cada bloco** (1-5, 6-10, 11-15, 16-20, 21-25, 26-30) — facilita rollback se algo quebrar
- **Acompanhar com `12-sprint-plan.md`** (Sprint 1-2 cobrem este checklist)

Total estimado: 60-80h (alvo ~70h conforme `_CONFLITOS #16`).

---

## Bloco 1: Foundation (tarefas 1-5)

### 1. Criar pasta `C:/Users/leean/Desktop/desafit/`

- **Estimativa:** 5min
- **Dependência:** nenhuma
- **Comando:**
  ```powershell
  New-Item -ItemType Directory -Path "C:/Users/leean/Desktop/desafit"
  Set-Location "C:/Users/leean/Desktop/desafit"
  ```
- **Done:** pasta existe, vazia, fora de `onboarding-bio/`

### 2. `pnpm create next-app@latest` com flags canônicas

- **Estimativa:** 10min
- **Dependência:** tarefa 1
- **Comando:**
  ```powershell
  pnpm create next-app@latest . --typescript --app --turbo --tailwind --eslint --no-src-dir --import-alias "@/*"
  ```
- **Done:** `package.json`, `app/`, `public/`, `tsconfig.json`, `tailwind.config.ts`, `eslint.config.mjs` criados. `pnpm dev` sobe em `:3000`.

### 3. `git init` + primeiro commit vazio

- **Estimativa:** 5min
- **Dependência:** tarefa 2
- **Comando:**
  ```powershell
  git init
  git commit --allow-empty -m "chore: initial empty commit"
  git add .
  git commit -m "chore: scaffold next-app via create-next-app"
  ```
- **Done:** repo limpo, 2 commits no log.

### 4. Criar projeto Supabase NOVO (D-G2)

- **Estimativa:** 20min (inclui setup org + region)
- **Dependência:** nenhuma (paralelo a 1-3)
- **Ação:** dashboard Supabase → New project → region `sa-east-1` (São Paulo) → anotar `project_ref`, `URL`, `publishable_key`, `service_role_key`
- **Done:** projeto criado, 3 chaves obtidas, MCP `mcp__supabase__list_tables` retorna lista vazia

### 5. Criar projeto Vercel NOVO + linkar GitHub

- **Estimativa:** 20min
- **Dependência:** tarefa 3 + repo GitHub criado
- **Ação:** dashboard Vercel → Import Project → GitHub `desafit/desafit` → linkar
- **Done:** preview deploy do scaffold sobe em `<projeto>.vercel.app`

**Commit bloco 1:** `chore: bootstrap repo + supabase + vercel`

---

## Bloco 2: Boilerplate + tokens dia 0 (tarefas 6-10)

### 6. Copiar boilerplate genérico

- **Estimativa:** 30min
- **Dependência:** tarefa 2
- **Arquivos:** `.gitignore` (Next defaults + `.env*`, `*.log`, `.vercel`, `.turbo`), `.editorconfig` (2 espaços, LF, UTF-8), `.prettierrc` (`{ "semi": false, "singleQuote": true, "trailingComma": "all" }`), `.nvmrc` (`24`)
- **Done:** 4 arquivos no root, lint passa

### 7. 13 paletas OKLCH em `app/globals.css @theme`

- **Estimativa:** 4h
- **Dependência:** tarefa 2
- **Ação:** copiar valores OKLCH (não código TSX) de `onboarding-bio/app/preview/paletas/page.tsx` → `app/globals.css` dentro de `@theme { ... }` (D-G76)
- **Done:** 13 paletas declaradas como custom properties `--color-palette-N-primary`/`-secondary`/`-surface`/`-bg`/`-fg`. Tailwind v4 `@theme` direciva ativa.

### 8. `tsconfig.json` strict++ (D-G64)

- **Estimativa:** 30min
- **Dependência:** tarefa 2
- **Flags ligar:**
  - `strict: true` (já default)
  - `noUncheckedIndexedAccess: true`
  - `noImplicitOverride: true`
  - `exactOptionalPropertyTypes: true`
  - `noFallthroughCasesInSwitch: true`
  - `noImplicitReturns: true`
- **Done:** `pnpm typecheck` (alias `tsc --noEmit`) 0 erros no scaffold inicial

### 9. `eslint.config.mjs` flat config — 24 regras custom

- **Estimativa:** 6h
- **Dependência:** tarefa 8
- **Origem código:** transferir auditado de `onboarding-bio/eslint.config.mjs`:
  - Linhas 16-73 (tokenBypassPlugin regex) — sem comentários `Fase 29`
  - Linhas ~80-110 (jsx-a11y strict block)
  - Resto: escrever fresh seguindo `13-lint-enforcement.md` §2
- **Done:** 24 regras ativas. `pnpm lint --max-warnings 0` 0/0 no scaffold inicial.

### 10. `vercel.ts` (D-G68 substitui `vercel.json`)

- **Estimativa:** 30min
- **Dependência:** tarefa 2
- **Ação:** `pnpm add -D @vercel/config`. Criar `vercel.ts` no root exportando `config: VercelConfig` (framework: nextjs, buildCommand, rewrites pt-BR→en interna, crons).
- **Done:** `vercel deploy --preview` reconhece `vercel.ts`. `vercel.json` removido se gerado.

**Commit bloco 2:** `chore: dia-0 tokens + lint + tsconfig + vercel.ts`

---

## Bloco 3: Boundaries + CI + shadcn (tarefas 11-15)

### 11. Sheriff boundaries (`sheriff.config.ts`)

- **Estimativa:** 2h
- **Dependência:** tarefa 9
- **Ação:** `pnpm add -D @softarc/eslint-plugin-sheriff`. Tags em folders: `app/`, `components/`, `lib/{contracts,domain,data,hooks,api}/`, `supabase/`. Regra: dependência desce nunca sobe (detalhes `04-camadas-imports.md`).
- **Done:** import test — `lib/data/x.ts` importando de `app/` → ESLint error.

### 12. CI `.github/workflows/ci.yml`

- **Estimativa:** 2h
- **Dependência:** tarefas 8, 9, 11
- **Ordem do workflow** (ver `13-lint-enforcement.md §8`):
  1. checkout + setup-node 24 + pnpm install
  2. typecheck
  3. vocab:audit
  4. i18n:audit
  5. token:audit
  6. lint --max-warnings 0
  7. knip
  8. grep eslint-disable allowlist
  9. test
  10. build
  11. size
- **Done:** push no main triggera workflow, todos steps verdes.

### 13. shadcn fresh install + 15 componentes base

- **Estimativa:** 4h
- **Dependência:** tarefa 7
- **Comandos:**
  ```powershell
  pnpm dlx shadcn@latest init
  pnpm dlx shadcn@latest add button input label textarea card dialog sheet drawer dropdown-menu select checkbox switch tabs tooltip skeleton
  ```
- **Done:** 15 componentes em `components/ui/`. Ladle (tarefa 29) renderiza cada um.

### 14. Motion 12 presets (`lib/design/motion.ts`)

- **Estimativa:** 2h
- **Dependência:** tarefa 2
- **Ação:** `pnpm add motion`. Criar `lib/design/motion.ts` com 6 durations (50/100/200/300/500/700ms — Material 3), 5 easings (standard/standard-decelerate/standard-accelerate/emphasized/emphasized-decelerate), 4 springs (snappy/gentle/bouncy/slow). `'use client'`.
- **Done:** import `import { duration, ease, spring } from '@/lib/design/motion'` funciona.

### 15. APCA dual-gate validator (`lib/design/contrast.ts`) — substituída por ADR-0040 §H+§I

- **Estimativa original:** 6h. **Real:** ~1h (etapa 5 PLANO-MESTRE-DIA-0)
- **Dependência:** tarefa 7
- **Status:** substituída pelo plano executável `docs/plans/PLANO-MESTRE-DIA-0.md` Etapa 5. ADR-0040 §H adota Silver dual-gate (75/60/45) substituindo Bronze (75/30). Helpers `apca`, `meetsApca`, `ensureAccessible`, `pickReadableForeground` extraídos de `scripts/validate-palettes.ts` pra `lib/design/contrast.ts`. Matrix completa: 13 paletas × roles × {primary, danger, surface, chart-1..5} × {on-surface, on-primary}. Wire `prebuild` script (ADR-0040 §I).
- **Done:** `pnpm validate:apca && pnpm build` verde com paleta seed correta; vermelho se corromper 1 valor.

**Commit bloco 3:** `chore: sheriff + ci + shadcn + motion + apca`

---

## Bloco 4: White-label runtime + primitives (tarefas 16-20)

### 16. CSS via API route (D-G59) — `app/api/tenants/[id]/theme.css/route.ts`

- **Estimativa:** 4h
- **Dependência:** tarefas 7, 15
- **Ação:** route handler GET retorna `Content-Type: text/css` com OKLCH tokens derivados de `public.tenants.primary_color`. Headers: `Cache-Control: public, max-age=86400, immutable` + `?v=N` versionado.
- **Done:** `<link rel="stylesheet" href="/api/tenants/abc/theme.css?v=1">` injeta tokens em runtime sem `dangerouslySetInnerHTML`. Zero FOUC.

### 17. Skeleton shimmer + surface elevation + border ghost + tabular-nums

- **Status:** ✅ DONE Etapa 10 sub-item 6 (PLANO-MESTRE-DIA-0)
- **Estimativa:** ~4h (1+2+1+0.5h)
- **Dependência:** tarefa 13
- **Entregas:**
  - `<Skeleton>` premium shimmer gradient OKLCH em `app/globals.css` (`@keyframes shimmer`)
  - 3 elevation tokens (`--elevation-flat`, `--elevation-raised`, `--elevation-overlay` — ADR-0042)
  - `<Metric>` + `<DataCell>` + tabular-nums JIT (quando primeira tela com KPI surgir)
- **Done:** Storybook renderiza paletas + motion presets (ADR-0038)

### 18. Catálogo Lucide ~80 ícones

- **Estimativa:** 3h
- **Dependência:** tarefa 2
- **Ação:** `pnpm add lucide-react`. Criar `lib/design/icons.ts` exportando named imports dos 80 ícones do dia 1 (lista derivada do mockup + 5 abas PWA + admin). Tree-shaking respeitado (não barrel re-export wildcard).
- **Done:** Ladle story renderiza grid 80 ícones. Bundle PWA shell ≤170KB (size-limit ainda passa).

### 19. Sonner customizado + vaul premium

- **Estimativa:** 4h (2+2h)
- **Dependência:** tarefas 13, 14
- **Entregas:**
  - `<Toaster>` Sonner com tokens semantic (success/warning/error/info) + 4 variantes
  - `<BottomSheet>` vaul wrapper com `snapPoints={[0.5, 0.92]}` + `repositionInputs` + `modal` + `shouldScaleBackground={false}` (decisão `_CONFLITOS #7` mobile-first)
- **Done:** Ladle story toast + vaul abrindo em iPhone 14 portrait

### 20. Safe areas iOS + status bar tint + splash + tab bar

- **Status:** ✅ PARCIAL DONE Etapa 10 (PLANO-MESTRE-DIA-0)
- **Estimativa:** ~6h (1+1+2+2h)
- **Dependência:** tarefas 17, 18
- **Entregas:**
  - ✅ `env(safe-area-inset-*)` via `viewportFit: 'cover'` em `app/layout.tsx`
  - ✅ `<meta name="theme-color">` dual `(prefers-color-scheme: dark/light)` em layout `viewport` (cores OKLCH dos surfaces)
  - ✅ Splash screens 3 sizes per-tenant via Satori (`/api/{tenants,brands}/[id]/splash/[size]`) — 1290x2796/1179x2556/2048x2732 cobrindo ~80% devices (6→3 reduzido por pesquisa)
  - 🟡 `<TabBar>` JIT — gatilho: primeira tela PWA aluno (ver `.claude/rules/shadcn-zone.md` JIT bullet)

**Commit bloco 4:** `chore: white-label runtime + primitives + ios safe areas`

---

## Bloco 5: Visual premium patterns (tarefas 21-25)

### 21. View Transitions API + Shared element + Pull-to-refresh + Page transitions

- **Estimativa:** ~13h (2+4+3+4h)
- **Dependência:** tarefa 14
- **Ação:** Next.js 16 `viewTransition` flag em `next.config.ts`. Shared element via `view-transition-name` per rota. Pull-to-refresh com physics em Motion 12 drag constraints. Page transitions custom layered Motion.
- **Done:** Navigation PWA com cross-fade + shared image; pull em `/programa` recarrega lista

### 22. Number ticker + Inner glow + Header sticky blur

- **Estimativa:** 4h (1+1+2h)
- **Dependência:** tarefa 14
- **Entregas:**
  - `<NumberTicker value={N}>` animado spring (`<Metric>` usa)
  - Inner glow / inset shadow seletivo em `<Card variant="emphasized">`
  - Header sticky com `backdrop-filter: blur(12px)` ativando em scroll >threshold
- **Done:** Ladle story renderiza cada um

### 23. Hero images + Avatar system + Image placeholders blurhash

- **Estimativa:** 9h (4+2+3h)
- **Dependência:** tarefa 18
- **Entregas:**
  - `<HeroImage>` component (cover programa) com 3 ratios (16:9, 1:1, 21:9) + lazy
  - `<Avatar>` system (initials fallback + size variants xs/sm/md/lg/xl)
  - `<Image>` wrapper Next 16 com blurhash placeholder pré-computado (`pnpm add blurhash`)
- **Done:** Ladle stories cobertas

### 24. Install banner custom iOS + Logo system

- **Status:** ✅ PARCIAL DONE Etapas 9/10 (PLANO-MESTRE-DIA-0)
- **Estimativa:** 8h (2+6h)
- **Dependência:** tarefa 20
- **Entregas:**
  - 🟡 `<InstallBanner>` JIT — gatilho: primeiro aluno cadastrado no PWA tenant
  - ✅ Apple Touch Icon 180×180 dinâmico per-tenant (`/api/{tenants,brands}/[id]/icon/180`) + PWA icons (192, 512) via Satori (`/api/...icon/[size]`) + manifest.webmanifest per-tenant
  - ✅ `<Logo>` **wordmark Geist Sans** dia 0 (`components/ui/logo.tsx` — 00-PROJETO §9 constitucional). Lê `brand.name` via `useBrand()`. Variants `icon` + `horizontal` JIT (exigem asset SVG do designer)
  - ✅ ESLint `brand/no-brand-hardcode` regra ativa bloqueando literais "desafit"/"yoga.app"/"ingles.app"
- **Done:** Manifest+icons+splash renderizam per-tenant; `<Logo>` exibe wordmark dinâmico

### 25. Schema baseline `0001_initial.sql` via MCP

- **Estimativa:** 8h
- **Dependência:** tarefas 4, 8
- **Ação:** chamar `mcp__supabase__apply_migration` com schema completo `public.*` baseline (~22 tabelas — `06-data-model.md §3`) + trigger `handle_new_user` + `custom_access_token_hook` + RLS pattern `(select public.current_tenant_id())` em todas tabelas tenant-scoped + 5 storage buckets.
- **Done:** `mcp__supabase__list_tables` retorna ~22 tabelas. Smoke RLS: insert sem JWT → bloqueado. Trigger smoke: signup novo cria `profiles + tenants + memberships` atomicamente.

**Commit bloco 5:** `chore: visual premium + logo system + schema baseline`

---

## Bloco 6: Contracts + features + hooks Claude + setup final (tarefas 26-30)

### 25.4. Phase A Final (Fases 1-5 pós-pesquisa)

- **Estimativa:** 2-3 dias úteis
- **Dependência:** Phase A pré-pesquisa CLOSED (commits `95a092d` → `27be5ee`)
- **Fonte única:** `docs/plans/PHASE-A-FINAL.md`
- **Bloqueia:** Tarefa 14 (Motion presets) — só começa após Fase 5 verde
- **Origem:** pesquisa `docs/research/17-guardrails-ia-shadcn-governanca.md`
- **Entregáveis resumo:**
  - Fase 1: Hooks PreToolUse JSON output (bug `#13744`) + `@eslint-community/eslint-plugin-eslint-comments` — **ADR-0036**
  - Fase 2: shadcn MCP server + wrapper pattern (`components/app-*.tsx`) + `.claude/rules/components.md` — **ADR-0037**
  - Fase 3: Storybook 10 substitui Ladle (MCP server + Chromatic) — **ADR-0038** supersede ADR-0013
  - Fase 4: Makerkit entitlements recipe (RPCs PostgreSQL + `feature_usage`) — **ADR-0039** supersede arquitetura ADR-0034
  - Fase 5: Cleanup docs + resolve ressalvas backlog (§9 seeds, §10 RouteProvider)
- **Done:** Phase A status `_status.md` = closed definitivo, 9 commits Phase A no histórico, Batch 1 10/10 verde após cada fase

### 25.5. Vertical slice `features/` + entitlements model (ADR-0034, ADR-0035)

- **Estimativa:** 5h
- **Dependência:** tarefas 11 (Sheriff), 25 (schema baseline)
- **Entregas:**
  - `features/` pasta criada no root
  - `features/_template/` exemplo cobrindo estrutura canônica:
    `plan-gates.ts` + `contracts.ts` + `data.ts` + `handlers.ts` + `hooks.ts`
    - `components/` + `__tests__/` + `index.ts`
  - `sheriff.config.ts` atualizado com tagging por feature + depRules
    bloqueando cross-feature imports (só via `kind:public-api`)
  - `eslint.config.mjs` ganha rule custom `plan-gates-required` —
    toda pasta em `features/<name>/` exige `plan-gates.ts` exportando `*Gate`
  - `lib/entitlements/` runtime:
    - `server.ts` — `requireEntitlement()`, `getEntitlements()`, `requireQuota()`
    - `client.ts` — `useEntitlement()`, `useQuota()` hooks
    - `types.ts` — `FeatureGate`, `PlanFeatures`, `PlanSlug` types
    - `components/` — `<EntitlementBadge>`, `<EntitlementGate>`,
      `<PaywallModal>`, `<QuotaBanner>`, `<UpgradeCTA>` (ADR-0035 uxPattern A/B/C)
  - Migration `0007_add_plans_table` — `public.plans (id, slug, name, monthly_amount_minor, setup_amount_minor, currency, features jsonb, is_active, sort_order)` + seed 3 planos (Pacote A R$100/mês + R$1.500 setup, B R$200/mês + R$3.000 setup, C R$200/mês + R$4.000 setup) com entitlements canônicos
  - `.claude/rules/features.md` — regra carregada quando edita `features/**`
    explicando convenção pra Claude Code
- **Done:**
  - `features/_template/` lint + typecheck verde
  - Sheriff bloqueia `features/A` importar `features/B/data.ts` (só `features/B/index.ts`)
  - ESLint bloqueia criar `features/X/` sem `plan-gates.ts`
  - `public.plans` populada com 3 planos via seed
  - Ladle story renderiza `<PaywallModal feature="chatbot" />`

### 26. `lib/contracts/` SSOT (Zod + Result + AppError + adapters)

- **Estimativa:** 4h
- **Dependência:** tarefas 8, 9
- **Entregas:**
  - `lib/contracts/result.ts` — `Result<T, AppError>` discriminated union (D-G55)
  - `lib/contracts/errors.ts` — `AppError` factory tagged variants
  - `lib/contracts/action.ts` — Server Action return type `{ ok, data } | { ok: false, error }`
  - `lib/contracts/zod/` — schemas Zod 4 por entidade (1 file por aggregate root)
  - `lib/contracts/adapters/` — Zod → standard-schema resolver para RHF 7
- **Done:** `import { ok, fail, Result } from '@/lib/contracts/result'` funciona. Vitest cobre 5 cases.

### 27. CLAUDE.md root + 8 `.claude/rules/*.md`

- **Estimativa:** 3h
- **Dependência:** todas anteriores
- **Ação:** transferir/escrever conforme `16-claude-code.md` (CHUNK 4 file 4)
- **Done:** sessão Claude Code nova abre, carrega CLAUDE.md <200 linhas, e edição em `lib/data/x.ts` ativa `.claude/rules/data-layer.md` via `paths:`

### 28. 3 hooks Claude Code dia 0

- **Estimativa:** 2h
- **Dependência:** tarefa 27
- **Entregas:**
  - `block-disables.sh` — PreToolUse Write/Edit bloqueia adicionar `eslint-disable` fora allowlist
  - `format-on-write.sh` — PostToolUse Write/Edit roda `pnpm prettier --write <file>`
  - `vocab-reminder.sh` — UserPromptSubmit warns se prompt mencionar vocab banido
- **Done:** triggerar cada hook manualmente confirma comportamento

### 29. Storybook 10 + primeiras stories (ADR-0038 supersede Ladle)

- **Status:** ✅ DONE Etapa 12 (PLANO-MESTRE-DIA-0)
- **Estimativa:** ~3h
- **Dependência:** tarefas 13, 17, 18, 19, 20
- **Ação:** `pnpm dlx storybook@latest init` (framework `@storybook/nextjs-vite` auto-detectado). Config em `.storybook/main.ts` (stories co-localizadas `components/**/*.stories.tsx`) + `preview.tsx` com NextIntl/Route/Entitlement providers globais. Addons: `addon-a11y` (axe-core), `addon-docs`, `addon-mcp` (HTTP `localhost:6006/mcp` em `.mcp.json`), Chromatic, addon-vitest.
- **Stories iniciais:** 3 wrappers (AppForm/AppToast/AppEntitlementGate) + 3 typography (Heading/Text/Muted) + Logo + 13 paletas catalog + Motion presets (durations + eases + springs).
- **Done:** `pnpm storybook` em `:6006`. `pnpm build-storybook` ✅ 3.4s. Ladle removido (`@ladle/react`, `.ladle/`, scripts `ladle:*`, ESLint override §6).

### 30. Primeiro commit `chore: bootstrap dia 0`

- **Estimativa:** 15min
- **Dependência:** tudo anterior verde
- **Ação:**
  ```powershell
  pnpm typecheck && pnpm lint --max-warnings 0 && pnpm test && pnpm build
  git add .
  git commit -m "chore: bootstrap dia 0 ~70h pipeline UI + schema baseline + ci"
  git push origin main
  ```
- **Done:** CI verde no push. Preview Vercel deploy verde. Lighthouse `/login` ≥90 Perf / A11y 100. PWA install funciona em iPhone 14 portrait.

**Commit bloco 6:** `chore: contracts + claude-code + ladle + first push`

---

## Resumo de horas

| Bloco                          | Tarefas | Horas                    |
| ------------------------------ | ------- | ------------------------ |
| 1 — Foundation                 | 1-5     | ~1h                      |
| 2 — Boilerplate + tokens       | 6-10    | ~11h                     |
| 3 — Boundaries + CI + shadcn   | 11-15   | ~16h                     |
| 4 — White-label + primitives   | 16-20   | ~18h                     |
| 5 — Premium patterns           | 21-25   | ~42h                     |
| 6 — Contracts + Claude + final | 26-30   | ~12h                     |
| **Total**                      | **30**  | **~100h estimado bruto** |

**Compressão alvo ~70h** via:

- Paralelizar tarefas independentes (tarefas 4, 5 paralelas a 1-3)
- Claude Code vibe coding em tarefas mecânicas (transferência paletas, skeleton, lucide grid)
- Reuso direto onboarding-bio (paletas valores, ESLint regex, jsx-a11y block)

Se >85h ou <50h reais → registrar ADR ajuste de escopo + atualizar `_CONFLITOS #16`.

---

## Gates pra fechar bootstrap dia 0

(reforço `12-sprint-plan.md` Sprint 2 DoD)

- [ ] `pnpm build` passa em CI
- [ ] `pnpm typecheck` 0 erros
- [ ] `pnpm lint --max-warnings 0 --no-inline-config` 0/0
- [ ] `pnpm vocab:audit` + `pnpm i18n:audit` + `pnpm token:audit` 0 hits
- [ ] `pnpm test` (vitest) 0 falhas
- [ ] `pnpm size` (size-limit) todos budgets verdes
- [ ] Smoke signup E2E: novo email → trigger cria `profiles+tenants+memberships` → JWT carrega `tenant_id+active_membership_role`
- [ ] Lighthouse `/login` ≥ 90 Perf / 100 A11y
- [ ] CSS do tenant carrega via `/api/tenants/[id]/theme.css` sem FOUC
- [ ] PWA install iPhone 14 portrait → splash + safe areas + tab bar OK
- [ ] Ladle sobe com 15 stories
- [ ] CI workflow GitHub Actions verde 100%

Sem todos ✅ → não começar M1 (decisão `_CONFLITOS #16` + master plan §33.0).

---

## Não fazer no dia 0 (entra depois)

- Features de produto (programas, alunos, captação) — Sprint 3+
- Editor visual de páginas — Sprint 5 (junto com 1º tenant)
- next-intl 4 locales adicionais (en-US/pt-PT/es-ES) — só pt-BR dia 1, espelhos prontos
- E2E completo 12 golden paths — incremental conforme feature
- Self-service signup público — M5+ (ano 2)
- Vibe coding pipeline UI completa — adiado §39

---

## Referências cruzadas

- `00-PROJETO.md` §6 (regras code) · §9 (brand assets zero inline)
- `_CONFLITOS.md` #16 (pipeline UI dia 0 ~70h) · #12 (lint enforcement) · #20 (bundle budgets) · #21 (schema core)
- `02-stack.md` (stack travado)
- `04-camadas-imports.md` (Sheriff detalhes)
- `05-design-system.md` (13 paletas, APCA, Motion)
- `06-data-model.md` §3 (schema baseline platform.\*)
- `12-sprint-plan.md` Sprint 1-2 (alinhamento)
- `13-lint-enforcement.md` (24 regras + CI)
- `16-claude-code.md` (CLAUDE.md + hooks)
- `17-repo-bootstrap.md` (passo-a-passo executável end-to-end)
- `18-transferencia.md` (matriz JIT)
- Memórias: `project_desafit_jit_code_transfer`, `project_desafit_multi_brand_strategy`

## Histórico

| Data       | Mudança                                      | Aprovador |
| ---------- | -------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — 30 tarefas em 6 blocos ~70h | Leandro   |

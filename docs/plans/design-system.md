# Plano — Design System

> **Status:** ativo · 2026-05-20 · 2 fases sequenciais
> **Pré-leitura obrigatória:** `docs/design-system/ARCHITECTURE.md` (fonte única de verdade)
> **Duração total:** 2 dias úteis (Foundation 1 dia + Components 1 dia)
> **Princípio:** não reinventar. Tudo decidido. Esta é execução.

---

## Pré-requisitos (antes de começar Fase 1)

- [ ] `ARCHITECTURE.md` lido por completo (esp. §3 fluxo, §5 tokens, §10 gates)
- [ ] 8 decisões cravadas confirmadas (§11 do ARCHITECTURE)
- [ ] 3 críticos do `23-architecture-validation.md` revistos
- [ ] `mcp__supabase__list_tables` confirma estado atual de `tenants`, `palettes`, `shape_presets`
- [ ] Memória `project_design_system_state.md` atualizada com números canônicos (22/28/35/9/11)

---

## Fase 1 — Foundation (1 dia)

**Goal:** banco + CSS + contratos + gates rodando. Após essa fase, qualquer página herda tokens do tenant via CSS inline server-side.

### 1.1 — Migration 0020 (banco)

**Faz:** adiciona `archetype_id text`, `theme_mode text`, `previous_archetype_id text`, `archetype_changed_at timestamptz` em `tenants`. Adiciona `seed_oklch text`, `supports_tonal_derivation boolean` em `palettes`. Dropa tabela `shape_presets` + coluna `tenants.shape_preset_id`.

**Como:** `mcp__plugin_supabase_supabase__apply_migration` (nunca `.sql` manual).

**Validação:**

- `mcp__supabase__list_tables` confirma colunas novas
- `mcp__supabase__get_advisors type=security` sem novos warnings
- `pnpm typecheck` 0 erros (após regen types)

**Bloqueia:** 1.2, 1.3

---

### 1.2 — Regenerar types Supabase

**Faz:** `mcp__plugin_supabase_supabase__generate_typescript_types` → atualiza `lib/contracts/database.ts`.

**Validação:**

- `tenants.archetype_id` aparece como `string`
- `shape_preset_id` removido
- `palettes.seed_oklch` aparece como `string | null`
- `pnpm typecheck` 0 erros

**Bloqueia:** 1.3, 1.5

---

### 1.3 — Token contract TypeScript + registry

**Faz:** cria `lib/design/contract.ts` (Zod schemas: `ArchetypeSchema`, `RoleEnum`, `OklchSchema`), `lib/design/roles.ts` (tipo `Role` union + lista das 28 roles), `lib/design/archetypes/_template/` (boilerplate scaffold), script `pnpm archetype:index` que gera `registry.generated.ts`.

**Output:**

- `lib/design/contract.ts` (~150 linhas)
- `lib/design/roles.ts` (~80 linhas)
- `lib/design/archetypes/_template/index.ts`
- `lib/design/archetypes/_template/tokens.ts`
- `lib/design/archetypes/_template/roles.ts`
- `lib/design/archetypes/_template/compat.ts`
- `scripts/archetype-index.ts`
- `package.json` script `archetype:index`

**Validação:**

- `pnpm archetype:index` gera `registry.generated.ts` vazio (sem archetypes ainda — só template)
- `pnpm typecheck` 0 erros
- Tipo `ArchetypeId` é union literal vazio (ok — preenche em 1.4)

**Bloqueia:** 1.4, 1.5

---

### 1.4 — Esqueletos dos 22 archetypes

**Faz:** copia `_template/` 22× — uma pasta por archetype. Cada pasta tem `tokens.ts` mínimo (raw colors do `palettes.seed.ts` brand-\* + radius default + container default) + `roles.ts` vazio (deixa fallback global cobrir).

**Output:**

- `lib/design/archetypes/{linear,notion,stripe,nike,apple,wired,spacex,mistral,wise,figma,theverge,claude,vodafone,opencode,mastercard,sanity,zapier,starbucks,spotify,airbnb,meta,pinterest}/`
- `lib/design/archetypes/registry.generated.ts` atualizado com 22 entries

**Validação:**

- `pnpm archetype:index` gera registry com 22 archetypes
- Tipo `ArchetypeId` é union literal de 22 strings
- `pnpm typecheck` 0 erros

**Importante:** preenchimento completo dos 28 roles per archetype é **JIT**. Esqueleto basta — fallback global cobre o que faltar. Detalhes per archetype: `20-naming-mappings.md`.

**Bloqueia:** 1.5

---

### 1.5 — `generateThemeCSS()` server function

**Faz:** cria `lib/design/generate-theme-css.ts` — função pura `(archetype, palette, typography, mode) → string`. Marcada `'use cache'` + `cacheTag('combo:${combo}')` + `cacheLife('days')`.

**Output:**

- `lib/design/generate-theme-css.ts` (~120 linhas)

**Lógica:**

1. Lê archetype config via `getArchetypeById(tenant.archetype_id)`
2. Lê palette via `getPaletteById(tenant.palette_id)`
3. Resolve typography via slug do catálogo
4. Aplica tonal derivation se `palette.supports_tonal_derivation && archetype.needsTints`
5. Emite CSS: Layer 1 raw → Layer 1.5 roles (com fallback) → `@theme inline` aliases shadcn

**Validação:**

- Unit test: combo Linear×brand-linear×inter×dark → output contém `--role-page-canvas`, `--role-accent-primary: oklch(...)`, `--background: var(--role-page-canvas)`
- `pnpm test` verde

**Bloqueia:** 1.6, 1.7

---

### 1.6 — `app/globals.css` 3-layer com fallback chain

**Faz:** reescreve `app/globals.css` para estrutura:

- `@theme` — Layer 1 raw defaults universais + scales numéricos (`--space-*`, `--text-*`, `--radius-*`, `--duration-*`)
- `:root` — Layer 1.5 fallback chain (defaults globais dos 28 roles)
- `@theme inline` — aliases shadcn referenciando roles
- `@media (prefers-reduced-motion: reduce)` belt-and-suspenders
- Preserva tokens existentes não-cobertos (sidebar, chart, safe-area, motion, animate-shimmer)

**Output:**

- `app/globals.css` reescrito

**Validação:**

- `pnpm token:audit` (APCA) verde
- `pnpm build` verde
- Visual: rodar `pnpm dev`, abrir página existente, conferir que aparência não regrediu (cores existentes mapeadas via aliases)

**Bloqueia:** 1.7

---

### 1.7 — Layout RSC injeta CSS inline + MotionConfig

**Faz:** atualiza `app/layout.tsx` (root) e `app/[locale]/layout.tsx`:

- Chama `generateThemeCSS(tenant)` no RSC
- Injeta `<style dangerouslySetInnerHTML={{__html: css}} />` no `<head>`
- Define `data-archetype`, `data-palette`, `data-theme` no `<html>`
- Envolve `<RouteProvider>` em `<MotionConfig reducedMotion="user">` (de `motion/react`)

**Output:**

- `app/layout.tsx` atualizado
- `app/[locale]/layout.tsx` atualizado

**Validação:**

- DevTools → conferir `<style>` inline no head
- DevTools → conferir `<html data-archetype="..." data-theme="...">`
- Lighthouse → CLS 0 (zero FOUC)
- `pnpm build` verde

**Bloqueia:** 1.8

---

### 1.8 — `validateCombo` dual-gate APCA + WCAG 2.1 AA

**Faz:** estende `lib/design/contrast.ts` (não duplica — `apca`, `meetsApca`, `ensureAccessible`, `pickReadableForeground` já existem). Adiciona:

- `lcToBridgeCR(lc)` — converte APCA Lc para WCAG contrast ratio
- `validateCombo(archetype, paletteId, mode)` — roda APCA Silver + WCAG 2.1 AA em todos pairs role × on-color, retorna `{ valid, failures }`

**Output:**

- `lib/design/contrast.ts` estendido
- Test em `lib/design/__tests__/contrast.test.ts`

**Validação:**

- Unit test com 4 combos representativos (Linear×brand-linear×dark, Notion×brand-notion×light, Spacex×default×dark, Wired×brand-wired×light) — todos passam ambos gates
- `pnpm token:audit` chama `validateCombo` em pre-build
- `pnpm test` verde

**Bloqueia:** 1.9

---

### 1.9 — `forced-colors.css` + governance CSS

**Faz:** cria `app/styles/forced-colors.css` (Windows high contrast — focus rings visíveis, SVG, cards, dialogs). Importa em `globals.css`.

**Output:**

- `app/styles/forced-colors.css`
- import adicionado em `app/globals.css`

**Validação:**

- Windows DevTools → Rendering → Emulate vision deficiencies → forced-colors → focus rings continuam visíveis em buttons, cards, dialogs

**Bloqueia:** —

---

### 1.10 — ESLint rule + ADR-NN consolidada

**Faz:**

- ESLint rule custom `design-tokens/no-raw-tokens-in-components` — bloqueia `var(--surface-*)`, `var(--ink-*)`, `var(--tint-*)`, `var(--accent-*)` em `components/**/*`. Permite `var(--role-*)` + scales numéricos
- ADR-NN consolidada — supersede ADR-0042 (elevations 3→fallback chain). Mantém ADR-0024, 0033, 0040, 0041. Documenta: token contract 3-layer + 28 roles + 22 archetypes + 35 paletas + CSS inline + cache combo + APCA+WCAG dual-gate

**Output:**

- `eslint-plugin-design-tokens/rules/no-raw-tokens-in-components.ts` (ou rule em `eslint.config.ts`)
- `docs/adr/0043-design-system-architecture.md`

**Validação:**

- ESLint roda em arquivo de teste com `var(--surface-1)` em componente → erro
- ESLint roda em arquivo de teste com `var(--role-page-canvas)` em componente → ok
- `pnpm lint --max-warnings 0` verde

**Bloqueia:** —

---

### Fase 1 — critério de pronto

- [ ] Migration 0020 aplicada
- [ ] `pnpm typecheck` 0 erros
- [ ] `pnpm lint --max-warnings 0` 0/0
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` verdes
- [ ] `pnpm test` 100%
- [ ] `pnpm build` verde
- [ ] `pnpm size` verde
- [ ] `validateCombo` testado em 4 combos
- [ ] Página existente abre sem regressão visual
- [ ] DevTools confirma CSS inline no head + `data-archetype` no html
- [ ] ADR-0043 committed

**Estimativa:** 1 dia útil (~6-8h focado).

---

## Fase 2 — Components (1 dia, depois da Foundation)

**Goal:** Core 11 componentes implementados via wrappers archetype-aware. 53 primitives migrados pra roles. Storybook decorator runtime archetype.

### 2.1 — Storybook decorator runtime archetype

**Faz:** atualiza `.storybook/preview.tsx` com:

- `globalTypes.archetype` (22 options)
- `globalTypes.palette` (35 options)
- `globalTypes.theme` (light/dark)
- Decorator que injeta `data-archetype`, `data-palette`, `data-theme` no root via `useEffect`
- `globalTypes.viewport` mobile-portrait default em stories mobile-aware

**Output:**

- `.storybook/preview.tsx` atualizado

**Validação:**

- `pnpm storybook` rodando → toolbar mostra 3 dropdowns (archetype, palette, theme)
- Trocar archetype no Storybook → cores mudam em runtime sem reload
- MCP endpoint `localhost:6006/mcp` continua ativo

**Bloqueia:** 2.2, 2.4

---

### 2.2 — Audit + migração 53 primitives shadcn

**Faz:** para cada arquivo em `components/ui/*`:

1. Lê tokens raw que o primitive usa (geralmente via classes Tailwind `bg-background`, `text-foreground`)
2. Confirma que classes referenciam aliases shadcn em `@theme inline` (cobertos por 1.6)
3. Identifica primitives que usam tokens raw direto (`bg-[var(--surface-1)]`) — esses precisam migração

**Nota:** maioria dos 53 primitives já usa aliases shadcn (`bg-background`, `text-foreground`, `border-border`). Como 1.6 fez aliases referenciarem roles, **migração é zero** pra maioria. Audit confirma — não modifica desnecessariamente.

**Output:**

- Relatório em `docs/design-system/_AUDIT-PRIMITIVES.md` (~50 linhas, tabela primitive × tokens-usados × migrar?)

**Validação:**

- `pnpm storybook` — todos primitives renderizam em 4 archetypes de teste (linear/notion/spacex/wired)
- Visual snapshot test (vitest) — sem regressão

**Bloqueia:** 2.3

---

### 2.3 — Wrappers archetype-aware (`components/ds/`)

**Faz:** cria 5 wrappers obrigatórios em `components/ds/`:

| Wrapper     | Razão                          | Lê do archetype                                            |
| ----------- | ------------------------------ | ---------------------------------------------------------- |
| `AppButton` | Shape varia 8 padrões          | `--radius-button`, `--press-scale`                         |
| `AppCard`   | 3 variantes estruturais        | `--radius-card`, `--shadow-card`, `--role-feature-card-bg` |
| `AppInput`  | Focus signal 4 padrões         | `--focus-width`, `--focus-offset`, `--role-border-focus`   |
| `AppBadge`  | Pill vs chip                   | `--radius-button` (pill) ou `--radius-sm`                  |
| `AppTabs`   | Pill vs segmented vs underline | archetype config `tabStyle`                                |

Cada wrapper:

- Importa primitive shadcn como base
- Adiciona props archetype-aware quando necessário
- Tem `.stories.tsx` co-localizada (gate H5)

**Output:**

- `components/ds/app-button.tsx` + `.stories.tsx`
- `components/ds/app-card.tsx` + `.stories.tsx`
- `components/ds/app-input.tsx` + `.stories.tsx`
- `components/ds/app-badge.tsx` + `.stories.tsx`
- `components/ds/app-tabs.tsx` + `.stories.tsx`

**Validação:**

- Stories renderizam em todos archetypes via decorator (2.1)
- `pnpm storybook:audit` (script novo) — todo `ds/*.tsx` tem `.stories.tsx`

**Bloqueia:** 2.4, 2.5, 2.6

---

### 2.4 — Mobile P0 — SafeAreaWrapper + NavigationBottom + BottomSheet

**Faz:**

- `SafeAreaWrapper` — div com `env(safe-area-inset-*)` + token `--mobile-full-height: 100dvh`
- `NavigationBottom` — fixed bottom + safe-area + tab items (slot pra mini-player)
- `BottomSheet` — wrappa shadcn `drawer` (Vaul) + detents (25/50/90%) + drag handle + safe-area

**Output:**

- `components/ds/safe-area-wrapper.tsx` + stories
- `components/ds/navigation-bottom.tsx` + stories
- `components/ds/bottom-sheet.tsx` + stories

**Tokens novos em `globals.css`:**

- `--mobile-nav-height: 56px`
- `--mobile-fab-size: 56px`
- `--mobile-sticky-cta-height: 64px`
- `--sheet-top-radius: var(--radius-xl)`
- `--sheet-handle-height: 4px`
- `--touch-min: 44px`
- `--press-scale: 0.95`
- Z-index global system (z-content/sticky/fab/mini-player/nav-bottom/overlay/modal/toast/tooltip)

**Validação:**

- Stories com viewport mobile-portrait (375px)
- iOS Safari simulado: safe-area-inset funciona em todos 3
- BottomSheet — drag-to-dismiss funciona, detents corretos

**Bloqueia:** 2.5

---

### 2.5 — `AppNavTop` + `AppFormGroup`

**Faz:**

- `AppNavTop` — wrapper sobre Origin UI navbar (instalado em 2.6) + `useBrand()` + `<Logo>` + variante `frosted-glass` opcional
- `AppFormGroup` — wrapper sobre shadcn `field` com variantes outlined/filled (+floating JIT)

**Output:**

- `components/ds/app-nav-top.tsx` + stories
- `components/ds/app-form-group.tsx` + stories

**Validação:**

- Stories renderizam nos 22 archetypes
- `useBrand()` injeta logo + cor corretos

**Bloqueia:** —

---

### 2.6 — Origin UI + Kibo install (registries)

**Faz:** atualiza `components.json` para 3 registries (shadcn + Origin UI + Kibo UI). Instala 10 + 8 componentes via canal único `npx shadcn add` / `npx kibo-ui add`.

**Origin UI (10):**

```
multi-select, time-picker, tags-input, phone-input, date-picker-range,
stepper, password-strength, file-upload, notification, navbar
```

**Kibo UI (8):**

```
dropzone, color-picker, code-block, avatar-stack, rating, relative-time,
snippet, announcement
```

**Output:**

- `components.json` atualizado com 3 registries
- 18 arquivos novos em `components/ui/*` (registry import — Edit BLOQUEADO)

**Validação:**

- `pnpm typecheck` 0 erros
- `pnpm build` verde
- `pnpm size` dentro do budget

**Bloqueia:** —

---

### 2.7 — `storybook:audit` script + CI gate

**Faz:** cria script `scripts/storybook-audit.ts` que compara `glob('components/ds/**/*.tsx')` vs `glob('components/ds/**/*.stories.tsx')` e falha se houver diff. Adiciona em `prebuild`.

**Output:**

- `scripts/storybook-audit.ts`
- `package.json` script `storybook:audit`
- Hook `.claude/hooks/component-story-gate.sh` (path-loaded em `components/ds/**/*.tsx`) — warning stderr quando criar `.tsx` sem `.stories.tsx`

**Validação:**

- Criar `components/ds/test.tsx` sem story → `pnpm storybook:audit` falha
- Deletar test.tsx → audit verde

**Bloqueia:** —

---

### 2.8 — Smoke test end-to-end

**Faz:** teste manual integrado:

1. Inserir tenant teste com `archetype_id='linear'`, `palette_id=<brand-linear>`
2. Abrir `pnpm dev` → conferir página renderiza com tokens Linear
3. Trocar `archetype_id='nike'` no banco
4. `revalidateTag('combo:nike:brand-nike:inter:auto')` via server action ou bump `theme_version`
5. Recarregar página → tokens Nike refletem

**Output:**

- Decisão documentada em `docs/_sessions/2026-05-XX-smoke-test-design-system.md`

**Validação:**

- Swap funciona sem refactor de componente
- Zero FOUC
- APCA/WCAG verdes em ambos archetypes

**Bloqueia:** —

---

### Fase 2 — critério de pronto

- [ ] Storybook decorator funciona em runtime
- [ ] 53 primitives auditados (relatório committed)
- [ ] 5 wrappers ds/ + stories
- [ ] Mobile P0 (SafeAreaWrapper, NavigationBottom, BottomSheet, AppNavTop, AppFormGroup) + stories
- [ ] Origin UI 10 + Kibo UI 8 instalados
- [ ] `storybook:audit` script + hook
- [ ] Smoke test end-to-end ok
- [ ] `pnpm build-storybook` verde
- [ ] `pnpm typecheck && pnpm lint --max-warnings 0 && pnpm test && pnpm build && pnpm size` todos verdes

**Estimativa:** 1 dia útil (~6-8h focado).

---

## Pós-fase 2 — pronto pra M1 funil agência

- Landing institucional `desafit.app/agencia` renderiza com archetype `brand-stripe` (D-24)
- Admin pode trocar archetype/palette via painel — swap funciona sem refactor
- APCA + WCAG verdes em todos combos
- Plano `funil-agencia.md` desbloqueado

---

## O que fica FORA deste plano (JIT futuro)

- AI vibe matching painel admin (D-09 — feature do produto)
- AI photo generation quotas + UI (D-10)
- Brand kit completo `tenant_brand_assets` (D-34 — Fase 2 do roadmap maior)
- Email + PDF token adapters (D-35)
- Print stylesheet `@media print` (D-36)
- RTL languages (D-37)
- View Transitions API smooth swap (D-41)
- Lazy archetype-specific components (`SatelliteCTA`, `TuiMockup`, `MasonryGrid`, etc. — JIT quando archetype ativar em produção)
- Preenchimento completo dos 28 roles per archetype — JIT quando primeiro tenant ativar
- Prototype 2 archetypes end-to-end (D-06) — pode rodar em paralelo a Fase 2 se quiser medir cobertura real

---

## Onde está cada coisa (referência rápida)

- **Modelo + fluxo + contratos:** `docs/design-system/ARCHITECTURE.md`
- **8 decisões cravadas:** `docs/design-system/12-decisions-resolved.md`
- **3 críticos pré-implementação:** `docs/design-system/23-architecture-validation.md`
- **Mapping per archetype:** `docs/design-system/20-naming-mappings.md`
- **35 paletas OKLCH:** `docs/design-system/21-palettes-catalog.md`
- **Sistema mobile completo:** `docs/design-system/22-mobile-component-system.md`
- **Componentes 7 tiers:** `docs/design-system/24-component-selection-study.md`
- **Histórico arquivado:** `docs/_archive/design-system-rethink/` (26 docs)

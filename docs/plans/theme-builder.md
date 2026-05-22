# Plano: Theme Builder (admin-only, copy literal TweakCN)

> **Tipo:** plano executável standalone (próximo plano ativo após arquivamento do `pivot-tweakcn.md` em 2026-05-22)
> **Status:** 🟡 **PLANEJADO** — não iniciado. Detalhe técnico portado do pivot-tweakcn 2026-05-22.
> **Data início estimada:** 2026-05-22+
> **Estimativa total:** ~34h (Fase 5 do pivot — copy literal TweakCN editor + adapt multi-tenant)
> **Princípio meta:** dogfooding-first (ADR-0046 accepted 2026-05-22) — theme builder = passo 1 da ordem cravada. Sem ele, qualquer landing/page seria refactor visual depois.
> **Owner:** Leandro

---

## 0. Por que esse plano existe

ADR-0046 (dogfooding-first execution order) cravou ordem de execução:

1. **Theme builder** (~34h, este plano)
2. Form de captação agência (bare-bones Forms Engine, dogfooding)
3. Report IA do form agência (research-25 ready-to-consume)
4. Página de vendas agência (bare-bones Pages Engine, dogfooding)
5. AI builders (pages + forms engines)
6. Restante: manual primeiro, sistematização depois

Theme builder vem **antes** porque é fundação visual de tudo — qualquer
landing/page construída sem theme system cravado vira refactor depois.

> **Standalone desde 2026-05-22.** Detalhe técnico Fase 5 foi portado
> integralmente do `docs/plans/pivot-tweakcn.md` §6 (que foi arquivado em
> `docs/_archive/plans/2026-05-pivot-tweakcn.md`). Fases 6-8 (AI gen,
> v0/registry, validation suite) viraram detail files em `docs/_deferred/`.

---

## 1. Escopo desta sessão (cravado pelo user 2026-05-22)

### Inclui (G1 confirmado)

- **Theme builder UI** — copy literal de `tweakcn-ref/components/editor/`
  adaptado pro nosso `<style precedence="theme">` runtime multi-tenant
- **Admin-only inicial** — rota `/admin/theme-studio` gated atrás de
  entitlement `theme_studio` (sem self-service profissional ainda)
- **CRUD de versões de tema** — usa migration 0025 (`tenant_themes` +
  `tenant_theme_versions`) já aplicada (Fase 4 ✅)
- **Color picker stack** — HSL adjustments, contrast checker adaptado pra
  APCA Silver, code panel multi-formato
- **Font picker dinâmico Google Fonts** — copy literal TweakCN approach
- **Shadow control** — 6 primitives TweakCN + 8 níveis derivados
  algoritmicamente
- **Save / restore / fork de versões** — `forkTheme` action (G.3 deferred
  da Fase 4 entra aqui)
- **Storybook 10 re-install** — stories pros componentes do editor

### NÃO inclui (G1 confirmado — DEFERRED)

- **AI generation de themes** (era Fase 6 do pivot) — detalhe técnico em
  `docs/_deferred/ai-theme-generation-detail.md`
- **v0 integration** (era Fase 7 do pivot) — detalhe técnico em
  `docs/_deferred/v0-registry-integration-detail.md`
- **Validation Suite Contínua** (era Fase 8 do pivot) — detalhe técnico em
  `docs/_deferred/validation-suite-detail.md` (parte começa JIT quando 1º
  componente entra sob §15.1 governance — ver §8 deste plano)
- **Self-service do profissional** — admin-only por ora. Profissional
  recebe theme aplicado pela agência via mecânica `theme_studio`
  entitlement gate
- **AI patterns copy TweakCN** (theme generation IA model + v0 integration
  internal — research-44 cravou `createDocumentHandler<T>()` factory
  pattern + tool layer pattern + `resumable-stream` package — copy JIT
  quando AI builders chegarem)

---

## 2. Princípios que regem este plano

### 2.1 Dogfooding-first (ADR-0046)

Theme builder é **primeira instância da infra de theme system**. Bare-bones
(CRUD básico + editor visual TweakCN-style) é suficiente pro funil agência;
crescer (AI gen, v0) só depois que funil estiver capturando leads.

### 2.2 Registry-ready desde dia 1 (ADR-0045)

Cada theme salvo em `tenant_theme_versions` deve ser **exportável** via
`/api/r/themes/[tenantId]` no formato `registry:style` (ADR-0045 D.15).
Isso garante que `pnpm dlx shadcn add <our-theme-url>` funciona out-of-box
quando precisarmos compartilhar themes.

### 2.3 Copy literal TweakCN + adapt multi-tenant (ADR-0044 princípio 8)

NUNCA copy literal cego. Adaptamos a **lógica** (algoritmo
`getShadowMap()`, schema 32-cores, OKLCH-primary, editor UX,
`<style precedence="theme">` hoist) pro **nosso cenário**:

- Multi-tenant via `tenants.id` + RLS
- White-label via `brands` lookup + `useBrand()`
- PWA via manifest/icon dinâmico por tenant (já wired Fase 4)
- Safe-area iOS via `--inset-safe-*` universal

Linha "adaptado de tweakcn-ref/..." em cada arquivo originário.

### 2.4 G2 mesma sessão de trabalho

20 primitives shadcn + componentes TweakCN editor instalados juntos no
**início desta execução** (decisão G2 cravada user 2026-05-22). Sem
fragmentar em sub-sessões — install + smoke tests + ajustes num bloco
coerente.

### 2.5 G6 tenant seed JIT

Tenant seed **JIT** no início da execução (decisão G6 cravada user
2026-05-22) — não criar agora antes do plano executar. Quando código do
editor pedir tenant pra testar, seed nesse momento.

---

## 3. Pré-requisitos (todos satisfeitos pós pivot-tweakcn arquivado)

- ✅ **Fase -1** clone TweakCN read-only em `C:\Users\leean\Desktop\tweakcn-ref\`
- ✅ **Fase 0** surgical delete invented layer
- ✅ **Fase 1** foundation reset (theme.ts Zod + build-theme-css.ts +
  globals.css universal-only)
- ✅ **Fase 1.5** migration 0024 drop design system orphans
- ✅ **Fase 2** Batch Theming F.1-F.5+Q9 resolvido
- ✅ **Fase 4 theme storage** — migration 0025 (`tenant_themes` +
  `tenant_theme_versions` + triggers G.1/G.2 + RLS) + 4 server actions
  (bootstrap/save/list/restore) + next-themes wireup
- ✅ **Fase 5 dia 0 prep** — `lib/design/shadows.ts` + `lib/design/color-format.ts` +
  `lib/design/registry/generate-registry-item.ts` (commit `975ade6` 2026-05-21)
- ✅ **ADR-0044** pivot accepted
- ✅ **ADR-0045** Registry Strategy accepted (17 decisões + validation
  research-44/45)
- ✅ **ADR-0046** dogfooding-first cravado (este plano nasce dele)
- ✅ **pivot-tweakcn arquivado** em `docs/_archive/plans/2026-05-pivot-tweakcn.md` (2026-05-22)

---

## 4. Sub-fases executáveis (porta de pivot-tweakcn §6)

> **Origem:** porta literal do `docs/plans/pivot-tweakcn.md` §6 Fase 5
> (commit pivot arquivado 2026-05-22). Numeração reorganizada `4.0-4.12`
> pra refletir que este plano é standalone — não mais "Fase 5 do pivot".

### 4.0 — Re-install Storybook 10 (precondição §15.1 G — porta §5.0 do pivot)

Storybook foi deletado em Fase 0 surgical delete. Antes do PRIMEIRO
componente sob §15.1 governance:

1. `pnpm dlx storybook@latest init --type nextjs-vite` (ADR-0038 supersede Ladle)
2. `.storybook/main.ts` + `.storybook/preview.ts` config
3. MCP endpoint `localhost:6006/mcp` em `.mcp.json` (já cravado em
   `CLAUDE.md` mas server deletado)
4. Smoke story `components/ui/button.stories.tsx` confirma boot

**Tempo:** 1-2h. **Bloqueia:** §15.1 G stories obrigatórias.

### 4.1 — Install 20 essential primitives (porta §6.0 do pivot — research-45 cravado)

**Antes** de qualquer trabalho de builder UI:

```bash
pnpm dlx shadcn@latest add button input label form card dialog select \
  textarea badge separator skeleton tabs dropdown-menu tooltip popover \
  scroll-area sheet sonner switch command
```

**Razão:** research-45 cravou arsenal upfront (não JIT puro) — bundle
impact zero (Next.js 16 tree-shaking + código copiado local). 20
primitives cobrem 95% do uso confirmado em 5 boilerplates auditados
(Vercel AI Chatbot usa 22, next-forge 52 mas é monorepo, etc).

**JIT depois (gatilho: feature consumer real):**

- `chart` (recharts ~250 KB) — quando 1ª chart entrar
- `calendar` (react-day-picker ~45 KB) — quando date picker entrar
- `carousel` (embla ~25 KB) — quando carousel entrar
- `accordion`, `alert`, `alert-dialog`, `radio-group`, `checkbox`,
  `hover-card` — JIT

**Smoke test:** criar `components/ui/button.stories.tsx` (Default +
variants + disabled). Confirma Storybook 10 boots + theme runtime aplica.

**Tempo:** ~30min install + ~1h smoke test.

### 4.2 — AI catalog discoverability placeholder (porta §6.0.5 do pivot)

Não criar `block_kinds_catalog` table ainda (JIT — 3+ consumers, ADR-0045 §3).

**Setup discoverability:**

1. **L1 primitives (shadcn/ui):** MCP `shadcn@latest mcp` em `.mcp.json`
   (dev-time discovery — já configurado)
2. **L2/L3 blocks:** JSDoc `@registry-meta` em `lib/contracts/page-blocks/*.ts`
   (será criado em §4.7+ quando block surgir)
3. **Build script:** `scripts/build-block-catalog.ts` agrega JSDoc →
   `lib/generated/block-catalog.json` (gitignored, prebuild)
4. **AI composer:** detail file `ai-theme-generation-detail.md` injeta
   `block-catalog.json` como contexto em `generateObject` (Anthropic
   prompt caching)
5. **DB table:** SÓ quando 3 consumers simultâneos (AI composer + Builder
   UI + Dev exporter) — gatilho ADR-0045 §3

**Setup nesta sub-fase:** apenas placeholder do build script (vazio até
primeiro block existir).

### 4.3 — Pré-fase estudos S5.1-S5.x consolidados em research-41

Pre-leitura obrigatória antes de copiar arquivos:

- `docs/research/41-audit-tweakcn-fases-5-6-7.md` §2 (audit Fase 5
  inteiro) — dependency graph + tabela de decisão arquivo-a-arquivo +
  análise Zustand → RHF + useReducer
- `docs/research/45-component-strategy-best-practices.md` — arsenal 20 +
  folder structure
- ADR-0044 (princípio §8 extract+adapt) + ADR-0045 (registry-ready)

**Estudos cravados em research-41 §2 (não re-executar):**

- **S5.0** — Audit `tweakcn-ref/components/editor/**` (62 arquivos,
  ~7.050 LOC) → dependency graph + 11/25 arquivos importam Zustand
- **S5.1** — Triage arquivo-a-arquivo (COPY/ADAPT/SKIP/DEFER) — tabela
  em research-41 §2.3
- **S5.2** — Atribuição Apache-2.0 + `NOTICE.md` (criar na raiz)
- **S5.3** — Layout shell: criar `app/admin/_layouts/admin-shell.tsx`
  desktop-first (theme studio é admin-tool desktop-heavy, não usa
  AdaptiveShell mobile-first)

### 4.4 — Extract `lib/design/shadows.ts` ✅ (já feito Fase 5 dia 0 prep)

Commit `975ade6` (2026-05-21) — `generateShadowLevels()` extraído de
`build-theme-css.ts` (adapted from `tweakcn-ref/utils/shadows.ts`).

**Verificar antes de seguir:**

```bash
grep -l "generateShadowLevels" lib/design/
```

Se ausente → re-extrair de `tweakcn-ref/utils/shadows.ts` (~75 LOC).

### 4.5 — Extract `lib/design/color-format.ts` ✅ (já feito Fase 5 dia 0 prep)

Confirmado completo em 2026-05-21: `hex/hsl/oklch/rgb` via culori +
`oklchToHex` re-export.

**Verificar antes de seguir:**

```bash
grep -l "colorFormatter" lib/design/
```

Se ausente → re-extrair de `tweakcn-ref/utils/color-converter.ts` (~48 LOC).

### 4.6 — Extract `lib/design/registry/generate-registry-item.ts` ✅ (já feito Fase 5 dia 0 prep)

Commit `975ade6` (2026-05-21) — gera payload `registry-item.json`
shadcn-compatible com `type: 'registry:style'` (research-41 bloqueador 4
confirmado), OKLCH literal, `cssVars.theme` + `cssVars.light` + `cssVars.dark`.
3 testes Vitest passando.

**Verificar antes de seguir:**

```bash
ls lib/design/registry/generate-registry-item.ts
pnpm test lib/design/registry
```

### 4.7 — Copy editor TweakCN literal — arquivo-por-arquivo (porta §6.2 do pivot)

> **Tabela de decisões EXTRACT/ADAPT/SKIP/DEFER:** ver research-41 §2.3
> (autoritativa, 55+ arquivos auditados).

**1 commit por arquivo copiado** pra rastreabilidade. Cada commit inclui:

- Arquivo copiado/adaptado
- Header comment apontando origem + diff de changes
- Atualização `NOTICE.md` (criar primeiro se ainda não existe — porta §5.2 do pivot)

**Decisões cravadas (porta direta do pivot §6 + research-41 §2.3):**

| Arquivo TweakCN                                                       | LOC  | Decisão             | Destino nosso                                                   | Esforço |
| --------------------------------------------------------------------- | ---- | ------------------- | --------------------------------------------------------------- | ------- |
| `store/editor-store.ts`                                               | 232  | **REWRITE**         | `app/admin/theme-studio/_state/use-theme-form.ts` (RHF+history) | 6-8h    |
| `editor.tsx`                                                          | 139  | **ADAPT**           | `app/admin/theme-studio/view.tsx`                               | 4h      |
| `theme-control-panel.tsx`                                             | 268  | **ADAPT**           | `app/admin/theme-studio/_components/control-panel.tsx`          | 5-6h    |
| `colors-tab-content.tsx`                                              | 280  | **COPY+atrib**      | `components/admin/theme-studio/colors-tab-content.tsx`          | 2h      |
| `color-picker.tsx`                                                    | 133  | **COPY+atrib**      | `components/admin/theme-studio/color-picker.tsx`                | 1h      |
| `color-selector-popover.tsx`                                          | 208  | **COPY+atrib**      | `components/admin/theme-studio/color-selector-popover.tsx`      | 1h      |
| `hsl-adjustment-controls.tsx`                                         | 245  | **ADAPT**           | `components/admin/theme-studio/hsl-controls.tsx`                | 3h      |
| `hsl-preset-button.tsx`                                               | 83   | **COPY+atrib**      | junto com hsl-controls.tsx                                      | incluso |
| `contrast-checker.tsx`                                                | 377  | **ADAPT WCAG→APCA** | `components/admin/theme-studio/contrast-checker.tsx`            | 5h      |
| `shadow-control.tsx`                                                  | 85   | **COPY+atrib**      | `components/admin/theme-studio/shadow-control.tsx`              | 1h      |
| `slider-with-input.tsx`                                               | 75   | **COPY+atrib**      | `components/admin/theme-studio/slider-with-input.tsx`           | 1h      |
| `font-picker.tsx`                                                     | 415  | **COPY+atrib**      | `components/admin/theme-studio/font-picker.tsx`                 | 3h      |
| `theme-font-select.tsx`                                               | 55   | **COPY+atrib**      | junto com font-picker                                           | incluso |
| `theme-preset-select.tsx`                                             | 440  | **ADAPT**           | `components/admin/theme-studio/preset-select.tsx`               | 4h      |
| `code-panel.tsx`                                                      | 311  | **ADAPT**           | `components/admin/theme-studio/code-panel.tsx`                  | 4h      |
| `code-panel-dialog.tsx`                                               | 34   | **COPY**            | junto com code-panel                                            | incluso |
| `control-section.tsx`                                                 | 54   | **COPY**            | `components/admin/theme-studio/control-section.tsx`             | 0.5h    |
| `action-bar/action-bar.tsx`                                           | 24   | **ADAPT**           | `app/admin/theme-studio/_components/action-bar.tsx`             | 2h      |
| `action-bar/{save,reset,undo-redo,more,code,theme-toggle}-button.tsx` | ~150 | **COPY+ADAPT**      | incluso em action-bar                                           | 2h      |
| `theme-preview/color-preview.tsx`                                     | 213  | **COPY+atrib**      | `components/admin/theme-studio/preview/color-preview.tsx`       | 2h      |
| `theme-preview/components-showcase.tsx`                               | 218  | **COPY+atrib**      | `components/admin/theme-studio/preview/components-showcase.tsx` | 2h      |
| `theme-preview-panel.tsx`                                             | 268  | **ADAPT**           | `app/admin/theme-studio/_components/preview-panel.tsx`          | 3h      |
| `theme-save-dialog.tsx`                                               | 166  | **SKIP**            | — (community share single-user; nosso versionamento substitui)  | —       |
| `share-dialog.tsx`                                                    | 54   | **SKIP**            | — (community feature)                                           | —       |
| `action-bar/{publish,share,mcp,import}.tsx`                           | ~140 | **SKIP**            | —                                                               | —       |
| `inspector-{overlay,class-item}.tsx`                                  | 204  | **DEFER**           | — (nice-to-have)                                                | —       |
| `css-import-dialog.tsx`                                               | 114  | **DEFER**           | —                                                               | —       |
| `custom-textarea.tsx`, `mention-*.tsx`                                | 412  | **DEFER**           | — (TipTap chat input vai pra detail file AI gen)                | —       |
| `ai/*` (18 arquivos, ~2000 LOC)                                       | —    | **DEFER**           | — (ver `docs/_deferred/ai-theme-generation-detail.md`)          | —       |

**Adaptações cravadas (porta princípio §8 do pivot — research-41 §2.5):**

- **`apply-theme.ts`** DOM mutation → `<style precedence="theme">` CSS
  vars inline no preview panel, sem DOM mutation global
- **URL state `?tab=`**: `nuqs` permanece (compatível Next.js App Router)
- **Community/share**: SKIP total (sem `theme-save-dialog`, sem
  `share-dialog`, sem `publish-button`, sem `mcp-dialog`)
- **`useGuards` (better-auth)**: substituído por
  `requireEntitlement('theme_studio')` server-side

**Versionamento UI (porta princípio §9 do pivot — research-41 §2.6):**

TweakCN não tem UI de versionamento. Nossa adição:

- **"Salvar como variante":** botão save action-bar → `saveThemeVersion`
  server action → cria row em `tenant_theme_versions` (Fase 4 schema)
- **"Histórico de variantes":** sidebar/drawer mostrando `v1, v2, v3...`
  com timestamp + nome opcional. Clicar → load version pra form RHF
- **"Restaurar vX":** recarrega `themeState` com valores da versão +
  marca como ativa
- **Draft vs Published:** `tenant_themes.status` enum — preview vive no
  form, published aplica no site. Botão separado "Publicar" do "Salvar
  rascunho"

**NOTICE.md (porta §5.2 do pivot — Apache-2.0 attribution):**

Criar na raiz do projeto antes do primeiro arquivo copiado:

```markdown
# Third-party attributions

This project includes code adapted from the following Apache-2.0 licensed sources:

## TweakCN (https://github.com/jnsahaj/tweakcn)

Copyright 2025 Sahaj Jain (jnsahaj)
Licensed under the Apache License, Version 2.0.

Files adapted: (lista atualizada a cada copy)

Changes from original:

- Adapted to use Supabase + RLS instead of Drizzle/Neon
- Replaced Zustand state with RHF + useReducer history + Server Actions
- Replaced WCAG contrast with APCA Silver dual-gate
- Removed OAuth 2.0 server, Polar billing, TipTap chat editor (deferred to ai-theme-generation-detail)
- Removed community gallery / share dialog (single-tenant scope)
```

### 4.8 — Server actions (porta §6.5 do pivot)

**Faz:** estende `app/admin/theme-studio/actions.ts` (Fase 4 já entregou
`saveTheme/listVersions/restoreVersion`):

- `saveTheme(input: ThemeSchema): Promise<Result<{ id, version_number }>>`
  — insere theme + version 1 OU bump version se theme existe ✅ Fase 4
- `listVersions(themeId: string): Promise<ThemeVersion[]>` ✅ Fase 4
- `restoreVersion(versionId: string): Promise<Result<{ active_theme_version_id }>>`
  — copia snapshot pra nova version locked ✅ Fase 4
- **`forkTheme(themeId: string, name?: string): Promise<Result<{ id }>>`** —
  G.3 deferred da Fase 4 entra aqui. Clona theme + última version → cria
  nova row `tenant_themes` com `parent_theme_id` self-FK (schema já
  migrated em 0025)

**RHF + server action save (porta §6.5 do pivot):**

`useTheme` form via RHF + Zod resolver (`ThemeSchema`). Submit →
`saveTheme` action → revalida. Form state local (não Zustand) — ver
research-41 §2.4 análise Zustand → RHF + useReducer pra history.

### 4.9 — Route `/admin/theme-studio` + entitlement gate (porta §6.1 do pivot)

**Faz:**

- `app/admin/layout.tsx` + `app/admin/_layouts/admin-shell.tsx`
- `app/admin/theme-studio/page.tsx` (RSC, busca tenant theme atual via
  `getRouteByHost()` + `tenant_theme_versions` snapshot)
- `app/admin/theme-studio/view.tsx` (Client Component, layout 2 painéis
  ResizablePanelGroup)
- Server gate: `requireEntitlement('theme_studio')` no page.tsx — feature
  flag adicionado ao `entitlements.features` array (default `true` Pro
  tier, `false` Basic tier — JIT)

### 4.10 — APCA dual-gate em save actions (porta princípio APCA do pivot)

**Faz:** todas as save actions executam validation APCA Silver dual-gate
ANTES de persist:

- body Lc ≥75
- large ≥60
- non-text ≥45

Função wrapper `validateThemeAPCA(snapshot: Theme): Result<void>` em
`lib/design/contrast.ts` (já existe `apca()`). Failure → action retorna
`{ ok: false, error: { key: 'theme.apca.failed', fallback: 'Tema falhou validação de contraste APCA Silver' } }`.

**UX cravada (ADR-0045 D.17):** soft warn em vez de hard reject — botão
"Salvar mesmo assim" presente, mas com warning visível + detalhamento de
quais pares falharam (preview painel direito).

### 4.11 — Storybook stories pros componentes do editor (porta §15.1 G do pivot)

Cada componente novo em `components/admin/theme-studio/*` ganha story
co-localizada `<name>.stories.tsx`:

- Default story com props mínimos
- Todas as variants (variant prop union literal)
- Todos os estados (hover, focus, disabled, loading, error)
- Mobile + desktop viewport (`parameters.viewport`)

**Notas:** multi-preset matrix (renderiza em 5-7 presets) é parte da
**Validation Suite Contínua** — ver `docs/_deferred/validation-suite-detail.md`
§8.1. Não fazer aqui — fazer JIT quando 1º componente entra.

### 4.12 — Visual check + size budget (porta §6.6 do pivot + governance §15.1 F)

**Faz:**

- `pnpm dev` + abrir `/admin/theme-studio` — visual confirma:
  - HSL adjustments aplicam em real-time no preview
  - Color picker abre + altera tokens individuais
  - Contrast checker APCA dual-gate exibido (todos pares com pass/fail)
  - Code panel exporta CSS Tailwind v4 + shadcn registry JSON
  - Font picker carrega Google Fonts dynamic
  - Save → version v+1 persistida em DB
- `pnpm size` budgets verdes (esperado: ≤20% delta vs baseline)
- Smoke test: cycling 3 presets diferentes via picker → preview muda tudo

---

## 5. Sequência operacional cravada

> **Origem:** porta `docs/research/41-audit-tweakcn-fases-5-6-7.md` §5.3
> (sequenciamento ótimo) + ADR-0046 (dogfooding-first).

### Dia 0 da execução (G2 mesma sessão)

Bloco coerente, não fragmentar:

1. **4.0** Re-install Storybook 10 (1-2h)
2. **4.1** Install 20 essential primitives (~30min) + smoke test button (~1h)
3. **4.2** AI catalog discoverability placeholder (~30min)
4. **Tenant seed JIT (G6)** — criar tenant `showcase` ou similar quando
   código pedir, não antes
5. **Smoke story** confirma boot + theme runtime aplica

### Semana 1-2 — Editor TweakCN copy literal

- **4.7** Editor copy literal arquivo-por-arquivo (~22h):
  - REWRITE `use-theme-form.ts` (Zustand → RHF + useReducer history) — **8h, mais arriscado**
  - ADAPT editor shell + admin-shell.tsx — 4h
  - COPY/ADAPT controles simples (colors-tab, color-picker, slider,
    shadow-control) — 3h
  - ADAPT theme-control-panel.tsx — 5-6h
  - ADAPT hsl-adjustment-controls — 3h
  - ADAPT contrast-checker (WCAG → APCA Silver) — 5h
  - ADAPT code-panel — 4h
  - COPY font-picker + Google Fonts route — 3h
  - ADAPT theme-preset-select — 4h
- **4.8** Server actions (`forkTheme` novo + verificação 3 existentes) — 2h

### Semana 3 — Integração + entitlement gate

- **4.9** Route `/admin/theme-studio` + entitlement gate (~3h)
- **4.10** APCA dual-gate em save actions (~3h)
- **4.11** Storybook stories pros componentes editor (~3-4h)

### Semana 4 — Visual check + budgets

- **4.12** Visual check + size budget (~2h)
- Validação final (pnpm typecheck/lint/build/size/contrast) (~2h)

### Total estimativa: ~34h

Conferir contra research-41 §2 breakdown:

- REWRITE store: 8h
- ADAPT editor shell + control-panel + action-bar: 12h
- COPY/ADAPT color/font/shadow/HSL/contrast/code-panel controls: 10h
- Preview components: 4h

---

## 6. Bloqueadores antecipados (research-41 §2.6 + §5.2)

### 6.1 Zustand → RHF history risk (8h sozinho)

`editor-store.ts` tem lógica sofisticada de history com debounce de
500ms e `MAX_HISTORY_COUNT=30`. RHF não tem undo/redo nativo. O
`useReducer` pattern pra history precisa de integração cuidadosa com
`useForm.reset()`.

**Risco médio-alto.** Estimativa conservadora de 8h (vs 4h se fosse
Zustand simples).

**Mitigação cravada:** protótipo standalone em
`app/admin/theme-studio/_state/` **antes** de integrar com UI. Validar
`{ past[], present, future[] }` pattern + `useImperativeHandle`
expondo `undo/redo` pra action-bar.

### 6.2 `gemini-3-flash-preview` availability — DEFER pra detail file

AI Gateway Vercel: `gemini-3-flash-preview` pode não estar disponível.
**Não bloqueia este plano** — AI generation foi deferred pra
`docs/_deferred/ai-theme-generation-detail.md` (Fase 6 antiga). Quando
detail file for promovido, verificar disponibilidade + fallback Gemini
2.5 Flash (ADR-0045 D.16).

### 6.3 APCA UX — soft warn cravado ADR-0045 D.17

Rejeitar save por falha APCA pode frustrar profissional se acontecer
frequentemente. **Decisão cravada em ADR-0045 D.17:** soft warn em vez
de hard reject. Aplicar em sub-fase 4.10.

### 6.4 `registry:style` confirmado (research-41 bloqueador 4 resolvido)

TweakCN usa `type: 'registry:style'`, NÃO `type: 'registry:theme'`.
Confirmado em `tweakcn-ref/app/r/themes/[id]/route.ts` + research-41
§4.2. `lib/design/registry/generate-registry-item.ts` (já criado Fase 5
dia 0 prep) emite `registry:style`. **Sem ação adicional necessária.**

---

## 7. Checklist verificação detalhado (porta §6.4 do pivot)

- [ ] §4.0 Storybook 10 reinstalado + boot ok
- [ ] §4.1 20 primitives instalados + smoke test button.stories.tsx verde
- [ ] §4.2 AI catalog discoverability placeholder criado
- [ ] §4.3 Pre-leitura research-41/45 confirmada
- [ ] §4.4-4.6 utils extraídos confirmados presentes (`shadows.ts`,
      `color-format.ts`, `generate-registry-item.ts`)
- [ ] §4.7 Estudos S5.1, S5.2, S5.3 outputs documentados (cross-link
      research-41 §2)
- [ ] §4.7 `NOTICE.md` criado com atribuição Apache-2.0 + lista atualizada
      conforme arquivos copiados
- [ ] §4.7 ~20 arquivos TweakCN copiados/adaptados (COPY/ADAPT decisões
      cravadas em research-41 §2.3)
- [ ] §4.7 Zustand → RHF + useReducer history funcional (protótipo
      isolado validado antes de integrar)
- [ ] §4.7 Versionamento UI funcional (Salvar variante / Histórico /
      Restaurar / Draft vs Published)
- [ ] §4.8 `forkTheme` action implementada + unit tests
- [ ] §4.8 Verificação 3 actions existentes (saveTheme, listVersions,
      restoreVersion) ✅ Fase 4
- [ ] §4.9 Theme studio acessível em `/admin/theme-studio` (gated atrás
      de entitlement `theme_studio`)
- [ ] §4.9 `admin-shell.tsx` desktop-first criado
- [ ] §4.10 APCA dual-gate em todas save actions + soft warn UX
      (ADR-0045 D.17)
- [ ] §4.11 Storybook stories pros componentes editor (default + variants + states + viewports)
- [ ] §4.12 HSL adjustments aplicam em real-time no preview
- [ ] §4.12 Color picker abre + altera tokens individuais
- [ ] §4.12 Contrast checker APCA dual-gate exibido (todos pares com
      pass/fail)
- [ ] §4.12 Code panel exporta CSS Tailwind v4 + shadcn registry JSON
- [ ] §4.12 Font picker carrega Google Fonts dynamic
- [ ] §4.12 Save → version v+1 persistida em DB
- [ ] `pnpm typecheck` ✅ 0 erros
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` ✅
- [ ] `pnpm test` ✅ (RHF + server action coverage)
- [ ] `pnpm build` ✅
- [ ] `pnpm size` budgets verdes
- [ ] Visual: cycling 3 presets diferentes via picker → preview muda tudo
- [ ] Endpoint `/api/r/themes/[tenantId]` retorna `registry:style` válido
      (sub-set de §4.7 code-panel — confirma pode export pra shadcn add)

---

## 8. Items deferred (cross-link aos detail files)

> **Origem:** porta §4.2 do plano original + 3 detail files novos
> 2026-05-22.

Ver `docs/_deferred/post-funil-agencia.md` pra lista completa. Resumo
cross-link aos detail files novos:

### AI generation theme (Fase 6 antiga)

Detail completo: **`docs/_deferred/ai-theme-generation-detail.md`** (~25h estimado).
Inclui: model policy ADR-0045 D.6 (Sonnet orq, Haiku router, Gemini Flash
theme, fallback Gemini 2.5), APCA gate pós-output D.17, GAP-1 rate limit
AI per-tenant, cross-link research-25 (30+ decisões reusáveis).

### v0 integration (Fase 7 antiga)

Detail completo: **`docs/_deferred/v0-registry-integration-detail.md`** (~12h estimado).
Inclui: `tenant_pages` + `tenant_blocks` schema migration, registry
endpoint `/api/r/[name].json`, `block_kinds_catalog` table criação
(gatilho 3 consumers), JSDoc `@registry-meta` + build script.

### Validation Suite Contínua (Fase 8 antiga)

Detail completo: **`docs/_deferred/validation-suite-detail.md`** (trabalho
contínuo, não-final). Inclui: Playwright matrix wire-up, presets seed
(5-7 themes TweakCN), showcase route `/admin/showcase`, métricas saúde
§15.7 (porta da governance original).

### Outros items DEFERRED

- AI patterns copy TweakCN (createDocumentHandler factory, tool layer,
  resumable-stream) — `docs/_deferred/post-funil-agencia.md` §3
- `block_kinds_catalog` table promotion — JIT 3 consumers (ADR-0045 D.2/D.3)
- Tiptap collab, Novel mídia, Novel theme override PoC — Pacote B
- `registry-blocks.md` rule + `block-catalog.json` build script — JIT 3+ block kinds

---

## 9. Next plan (depois deste)

**`docs/plans/funil-agencia.md` retoma.**

Sequência cravada (ADR-0046):

2. Form de captação agência (bare-bones Forms Engine, primeira instância)
3. Report IA do form agência (research-25 direto)
4. Página de vendas agência (bare-bones Pages Engine, primeira instância)
5. AI builders (pages + forms engines) — construir enquanto funil agência
   capta leads
6. Restante: programa manual → automação

---

**Fim do plano.**

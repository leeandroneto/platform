# Plano: Auditoria + Correção Theme Builder

> **Tipo:** plano executável (correção de débito técnico do theme-builder execution)
> **Status:** 🟡 PLANEJADO — não iniciado
> **Data início:** 2026-05-22
> **Estimativa total:** ~32-42h (6 fases, paralelizável parcialmente)
> **Owner:** Leandro
> **Bloqueia:** Form Engine (item 2 ADR-0046) — pagar débito antes de copiar mais OSS
> **Sucede:** theme-builder.md execution (commits 7f7a7a2 → 2fcd865)

---

## 0. Por que este plano existe

User identificou (2026-05-22): theme-builder execution criou débito técnico real **+ código quebrado em runtime**. **Padrão do legado archetype repetindo** — código sem validação rigorosa via checklist §15.1 A-J **e sem visual check em browser real**.

Auditoria honesta confirmou:

- 26 componentes criados em `components/admin/theme-studio/`
- ~50% compliance real com a rule path-loaded `component-creation-governance.md`
- Bugs runtime: `/login` click não dispara handler, `showcase.lvh.me:3000` não renderiza, `/admin/theme-studio` vazia, Storybook stories quebradas
- 14 utils + 9 hooks + 4 types em `lib/` também copiados sem auditoria §15.1
- 4 server actions + 2 API routes + 1 data layer file sem auditoria server-side
- `pnpm dev` + curl HTTP 200 foi reportado como "Visual check ✅" sem abrir browser real

**Anti-padrões cravados (lessons learned 2026-05-22):**

1. Gates estáticos (typecheck/lint/build/size/audits) NÃO substituem visual check em browser
2. §15.1 A-J auditar item-por-item ANTES de commit — confiar em agent delivery report = falha
3. Velocidade vs rigor: paralelização de agents OK só se cada um termina sob rigor §15.1
4. Visual check a cada chunk obrigatório (ADR-0044 princípio §5) — ignorado nos 8 chunks

**Objetivo:** chegar a **100% compliance §15.1 A-J + 100% runtime funcional + identidade visual TweakCN preservada** antes de continuar pra Form Engine (próximo item ADR-0046). Sem isso, débito acumula e replica padrão archetype.

---

## 1. Auditoria — estado real (2026-05-22)

### 1.1 Inventário

| Categoria                  | Item                                       | Valor                                                            |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| **Components**             | em `components/admin/theme-studio/`        | **26 .tsx files** (+ 7 .stories + 1 .ts utility)                 |
|                            | LOC total                                  | ~5.109                                                           |
|                            | Stories Storybook                          | 7 (todas falham em Playwright)                                   |
|                            | Tests unitários theme-studio               | 2 (actions + history-reducer)                                    |
|                            | MDX docs                                   | 0                                                                |
|                            | Zod schemas em `lib/contracts/components/` | **0** (pasta não existe)                                         |
|                            | Componentes com `@registry-meta` JSDoc     | ~22/26                                                           |
|                            | Componentes com `useTranslations`          | 10                                                               |
|                            | Componentes >400 LOC                       | 5 (com ESLint override path-specific)                            |
| **`lib/` adapts (Step 1)** | Utils copy literal                         | 14 (`lib/design/*` + `lib/utils/*`)                              |
|                            | Hooks copy + adapt                         | 9 (`lib/hooks/use-*`)                                            |
|                            | Types merge                                | 4 (`lib/design/contract/*`)                                      |
|                            | Schemas Zod auditados                      | **0** (nenhum auditado vs upstream)                              |
| **Server-side (Chunk 7)**  | Server actions                             | 4 (saveThemeVersion + listVersions + restoreVersion + forkTheme) |
|                            | Data layer                                 | 1 (`lib/data/themes.ts`)                                         |
|                            | API routes                                 | 2 (registry endpoint + google-fonts proxy)                       |
|                            | Tests server                               | 1 (`actions.test.ts`) — não cobre data layer nem API routes      |

### 1.2 Compliance §15.1 A-J — checklist real por categoria

| Categoria                   | Status                         | Observação                                                                            |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| **A. Identidade**           | ✅ 22/26                       | Naming correto, categoria L2, localização certa, versão semver no header              |
| **B. Contrato técnico Zod** | ❌ **10 com inline interface** | `lib/contracts/components/` não existe. Anti-pattern claro                            |
| **C. Multi-tenant fit**     | ⚠️ Parcial sem prova           | Tokens canonical consumidos, brand-agnostic. Falta validação explícita por componente |
| **D. Acessibilidade**       | ❓ Não auditado                | Precisa visual review + grep ARIA + keyboard nav                                      |
| **E. i18n**                 | ✅ 10/22 (essenciais)          | Componentes user-facing têm `useTranslations`. Helpers internos não precisam          |
| **F. Performance**          | ⚠️ Parcial                     | RSC default respeitado em page.tsx; client components têm `'use client'` justificado  |
|                             |                                | 5 componentes >400 LOC bypassados por ESLint override sem ADR cravando                |
| **G. Storybook story**      | ❌ 7 criadas mas FALHAM        | Não por tokens — por `nuqs` adapter missing + Provider decorators incompletos         |
| **H. Tests**                | ❌ <5% coverage                | Apenas 2 tests pra 26 componentes + 0 integration tests + 0 server actions tests      |
| **I. Doc co-localizada**    | ❌ 0 MDX docs                  | Headers existem mas MDX zero                                                          |
| **J. Registry-ready**       | ✅ 22/26                       | `@registry-meta` JSDoc aplicado nos principais                                        |

### 1.3 Bugs runtime cravados (sem fix até agora)

| #   | Bug                                                                                       | Severidade                      | Localização                                       |
| --- | ----------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------- |
| 1   | `/login` mostra página mas click submit não dispara handler                               | Alta (auth broken UX)           | `app/login/form.tsx`                              |
| 2   | `http://showcase.lvh.me:3000` não renderiza nada                                          | Alta (multi-tenant runtime)     | `getRouteByHost` lookup ou theme runtime emit     |
| 3   | `/admin/theme-studio` vazia (mesmo após seed completo + auth)                             | Alta (theme studio runtime)     | Server fetch ou ThemeFormProvider hidratação      |
| 4   | Stories falham — `nuqs` adapter ausente no Storybook decorator                            | Alta                            | `.storybook/preview.tsx`                          |
| 5   | `mockBrand.default_palette_id: 'palette-mock'` stale (campo dropado em Fase 1.5)          | Média                           | `.storybook/preview.tsx`                          |
| 6   | Storybook preview não emite tokens runtime (`<style precedence="theme">`)                 | Média                           | `.storybook/preview.tsx`                          |
| 7   | 10 componentes com `interface ComponentProps {}` inline em vez de Zod schema              | Alta                            | `components/admin/theme-studio/*.tsx`             |
| 8   | `next/font Geist` no Storybook + Vite tem fricção conhecida                               | Baixa                           | `.storybook/preview.tsx`                          |
| 9   | `font-picker.tsx` 643 LOC, 5 componentes >400 LOC sem ADR justificando override           | Baixa (overrides ESLint cobrem) | `eslint.config.mjs`                               |
| 10  | Storybook decorators incompletos: faltam NextIntl + Route + Entitlement + Theme providers | Alta (stories silent break)     | `.storybook/preview.tsx`                          |
| 11  | Save action APCA dual-gate nunca testado runtime end-to-end                               | Média                           | `app/admin/theme-studio/actions.ts`               |
| 12  | Registry endpoint `/api/r/themes/[tenantId]/[version]` nunca testado runtime              | Média                           | `app/api/r/themes/[tenantId]/[version]/route.ts`  |
| 13  | RHF undo/redo/checkpoint/debounce 500ms nunca validado runtime real                       | Média                           | `app/admin/theme-studio/_state/use-theme-form.ts` |

### 1.4 O que está CORRETO (não tocar)

- ✅ APCA Silver corretamente implementado em `contrast-checker.tsx` (NÃO há WCAG misturado — só comentários históricos)
- ✅ `@registry-meta` JSDoc canonical aplicado
- ✅ `useTranslations` em componentes user-facing
- ✅ Brand-agnostic (zero hardcoded `desafit`/`yoga.app`)
- ✅ Atribuição Apache-2.0 via header `// RESEARCH: tweakcn (Apache-2.0) — adapted from ...`
- ✅ NOTICE.md atualizado
- ✅ Typecheck + lint + build verde
- ✅ Server actions seguem `Result<T, AppError>` pattern (ADR-0040)
- ✅ Theme history reducer pure + 17 unit tests passando (`theme-history-reducer.test.ts`)
- ✅ Migration 0025 schema (`tenant_themes` + `tenant_theme_versions`) sólido
- ✅ Seed banco (showcase tenant + lvh.me domain + membership + subscription)

### 1.5 Causa raiz

**Princípio dogfooding-first (ADR-0046) foi parcialmente violado:**

- Chunks executaram "copy literal" rápido mas pularam **adaptação rigorosa item-a-item da checklist A-J**
- Rule path-loaded `component-creation-governance.md` é **playbook**, não **enforcement** — sem CI gate, depende disciplina humana
- 26 componentes criados antes de **1 ser usado em runtime real** (theme studio nem foi aberto pelo user com sucesso ainda)
- Anti-pattern: **construção em massa antes de validação real** = padrão do legado archetype
- "Visual check ✅" reportado foi `curl HTTP 200` (handshake) — sem abrir browser real e ver componente render
- Paralelização de 3 sub-agents por chunk priorizou velocidade sobre rigor §15.1

---

## 2. Plano de correção — 6 fases

> **Estratégia:** atacar débito por categoria (Runtime → Visual diff → Zod → Lib audit → Storybook → Tests → Multi-tenant audit + Polish → Sign-off). NÃO atacar componente-a-componente — mais rápido por categoria, menos retrabalho.

### Fase 0 — Diagnóstico runtime + visual diff TweakCN (CRÍTICO PRÉ-RIGOR)

**Objetivo:** ter inventário cravado de TODOS os bugs runtime + comparação visual side-by-side vs upstream TweakCN ANTES de pagar débito.

**Estimativa:** 2-3h

**Razão de existir:** pagar débito de Zod schemas em código quebrado é dinheiro fora. Se runtime está bugado, fix runtime primeiro.

#### 0.1 `pnpm dev` + diagnóstico browser real (user no driving seat)

Branch dev sequence:

1. `pnpm dev` em background
2. Abrir browser real (Chrome/Edge) em cada rota:
   - `http://localhost:3000/login`
   - `http://localhost:3000/admin/theme-studio`
   - `http://showcase.lvh.me:3000/login`
   - `http://showcase.lvh.me:3000/admin/theme-studio`
3. Pra cada rota, capturar:
   - Screenshot (cole no doc OR descreve)
   - Console errors (F12 → Console tab → red entries)
   - Network failures (F12 → Network tab → status 4xx/5xx ou pending stale)
   - Comportamento esperado vs real (clicks, render, transitions)

#### 0.2 `pnpm storybook` + diagnóstico Storybook real

1. `pnpm storybook` em background
2. Abrir browser em `http://localhost:6006`
3. Navegar pelas 7 stories Theme Studio:
   - `view.stories.tsx` (Default + MobileLayout)
   - `control-panel.stories.tsx` (Default + AiEnabled + MobileViewport)
   - `preview-panel.stories.tsx` (Default + DesktopWide + MobileViewport)
   - `code-panel.stories.tsx` (Default + WithRegistryId + DarkMode)
   - `contrast-checker.stories.tsx` (Default + WithDefaultTheme)
   - `font-picker.stories.tsx` (Default + WithValue + SerifCategory + MonoCategory)
   - `preset-select.stories.tsx` (Default + WithoutCycleButtons + Disabled)
4. Pra cada story, capturar:
   - Render OK / vazio / error
   - Console errors
   - Hot reload functional?

#### 0.3 Side-by-side visual diff vs TweakCN upstream

1. Abrir TweakCN clone read-only OU `https://tweakcn.com/editor/theme` em outro browser tab
2. Pra cada componente nosso, screenshot lado-a-lado vs equivalente TweakCN:
   - color-picker / color-selector-popover
   - hsl-controls / hsl-preset-button
   - slider-with-input / shadow-control
   - contrast-checker
   - control-panel (4 tabs)
   - preview-panel
   - code-panel (CSS/registry tabs)
   - font-picker / theme-font-select
   - preset-select
3. Lista cravada do que está visualmente diferente (cor/spacing/font/layout)

#### 0.4 Output Fase 0

Doc `docs/_sessions/2026-05-22-runtime-bugs-theme-studio.md`:

- Lista cravada bugs runtime (TODOS, agrupados por rota)
- Lista cravada visual diffs vs TweakCN
- Screenshots OR descrições detalhadas
- Root cause hypothesis pra cada bug (ex: nuqs adapter, theme runtime emit, missing provider)

**Critério de saída Fase 0:**

- [ ] Doc criado com TODOS os bugs listados
- [ ] User confirmou que doc captura tudo que viu
- [ ] Visual diffs documentados com screenshots OR descrição texto

### Fase 1 — Zod schemas SSOT (§15.1 B) — components + props públicas

**Objetivo:** eliminar interfaces TS inline em componentes user-facing. Todo componente com props públicas tem Zod schema em `lib/contracts/components/`.

**Estimativa:** 6-8h

#### 1.1 Criar pasta `lib/contracts/components/`

```bash
mkdir -p lib/contracts/components
```

#### 1.2 Para cada componente com inline interface, criar Zod schema

10 componentes identificados (lista cravada):

- `color-picker.tsx`
- `code-panel.tsx`
- `code-panel-dialog.tsx`
- `color-selector-popover.tsx`
- `colors-tab-content.tsx`
- `control-panel.tsx`
- `font-picker.tsx`
- `hsl-preset-button.tsx`
- `preset-select.tsx`
- `section-context.tsx`
- `shadow-control.tsx`
- `theme-font-select.tsx`

Pattern:

```ts
// lib/contracts/components/color-picker.ts
import { z } from 'zod'

export const ColorPickerPropsSchema = z.object({
  // props extraídas da interface atual
})

export type ColorPickerProps = z.infer<typeof ColorPickerPropsSchema>
```

```ts
// components/admin/theme-studio/color-picker.tsx
import { type ColorPickerProps } from '@/lib/contracts/components/color-picker'

export function ColorPicker(props: ColorPickerProps) { ... }
```

#### 1.3 Atualizar `@registry-meta` JSDoc

Apontar pro schema SSOT:

```ts
/**
 * @registry-meta
 * @kind theme-studio-color-picker
 * @propsSchema lib/contracts/components/color-picker.ts
 * @namespace @desafit
 * ...
 */
```

#### 1.4 Validação Fase 1

- [ ] 10 schemas criados em `lib/contracts/components/`
- [ ] 10 componentes refatorados pra usar `z.infer`
- [ ] `pnpm typecheck` verde
- [ ] `grep "^interface.*Props" components/admin/theme-studio/*.tsx | wc -l` retorna 0
- [ ] `pnpm dev` + smoke test rotas afetadas continua funcional (sem regressão vs Fase 0)

### Fase 1.5 — Audit `lib/` adapts + server actions + API routes (FALTA RECONHECIDA)

**Objetivo:** auditar código fora de `components/admin/theme-studio/` que também foi copy literal — não pode estar com mesmo débito.

**Estimativa:** 3-4h

#### 1.5.1 Audit `lib/design/*` utils (14 arquivos copy literal Step 1.4)

Pra cada arquivo, verificar:

- Pure function ou stateful?
- Tipo de input/output explícito?
- Zod schema se entrada tem shape complexo?
- Adapt minimal documentado (comment `// ADAPT:` linha 1+)?
- Marker `// RESEARCH:` linha 1 OK?

Arquivos:

- `lib/design/fonts/index.ts`
- `lib/design/fonts/google-fonts.ts`
- `lib/design/presets/theme-presets.ts` + `theme-presets-{a,b,c,d,e,f,g,h}.ts`
- `lib/design/presets/theme-preset-helper.ts`
- `lib/design/theme-fonts.ts`
- `lib/design/apply-style.ts`
- `lib/design/apply-theme.ts`
- `lib/design/theme-style-generator.ts`
- `lib/design/theme-styles.ts`
- `lib/design/parse-css-input.ts`
- `lib/design/tailwind-colors.ts`

#### 1.5.2 Audit `lib/utils/*` generic (2 arquivos)

- `lib/utils/debounce.ts`
- `lib/utils/format.ts`

Verificar TypeScript strict mode (`unknown[]` vs `any[]`), portabilidade (`ReturnType<typeof setTimeout>` vs `NodeJS.Timeout`).

#### 1.5.3 Audit `lib/hooks/use-*` (5 copy + 4 adapt)

Pra cada hook, verificar:

- Marker linha 1 correto?
- Adapt comment linha 1+ presente quando aplicável?
- Hook segue React Compiler purity rules?
- Signature pública mantida vs upstream?

Arquivos:

- `lib/hooks/use-controls-tab-from-url.ts` (COPY)
- `lib/hooks/use-debounced-callback.ts` (COPY)
- `lib/hooks/use-feedback-text.ts` (COPY)
- `lib/hooks/use-scroll-start-end.ts` (COPY)
- `lib/hooks/use-document-drag-and-drop-intent.ts` (COPY)
- `lib/hooks/use-copy-to-clipboard.ts` (ADAPT sonner)
- `lib/hooks/use-fullscreen.ts` (COPY screenfull)
- `lib/hooks/use-iframe-theme-injector.ts` (ADAPT Zustand→arg)
- `lib/hooks/use-contrast-checker.ts` (ADAPT WCAG→APCA)
- `lib/hooks/use-theme-preset-from-url.ts` (ADAPT Zustand→callback)

#### 1.5.4 Audit `lib/design/contract/*` types merge (4 arquivos)

- `lib/design/contract/theme.ts` (MERGE ThemePreset + schemaWithoutSpacing)
- `lib/design/contract/fonts.ts` (NEW)
- `lib/design/contract/index.ts` (ADD ColorFormat + SliderInputProps)
- `lib/design/contract/live-preview.ts` (NEW IframeStatus + MESSAGE)

Verificar:

- Zod schemas válidos
- Types inferidos corretamente
- Sem `interface` mixin com Zod schema do mesmo nome

#### 1.5.5 Audit server actions + data layer + API routes

Pra cada arquivo server-side, verificar:

| Arquivo                                            | Checks                                                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `app/admin/theme-studio/actions.ts`                | Zod input validation? RPC entitlement check? RLS implicit ok? AppError tagged variants? Tests cobrem fail paths? |
| `lib/data/themes.ts`                               | Client injection padrão? Sem service_role accidental? Sem leak cross-tenant?                                     |
| `app/api/r/themes/[tenantId]/[version]/route.ts`   | Validates registryItemSchema? CORS \*? Cache tag correto?                                                        |
| `app/api/admin/theme-studio/google-fonts/route.ts` | Entitlement gate? `await connection()` correto? Rate limit? Error handling?                                      |

#### 1.5.6 Output Fase 1.5

Doc `docs/_sessions/2026-05-22-lib-audit.md`:

- Tabela por arquivo: status check / gaps identificados / fix aplicado
- Lista cravada de fixes adicionais necessários (não da Fase 1)

**Validação Fase 1.5:**

- [ ] Todos arquivos `lib/` auditados conforme §15.1 aplicável
- [ ] Gaps documentados com fix path
- [ ] Server actions têm Zod input schema explícito
- [ ] Tests cobrem actions `saveThemeVersion` + `forkTheme` ambos paths (success + APCA fail + ownership fail + not_found)
- [ ] `pnpm typecheck && pnpm lint --max-warnings 0` verde

### Fase 2 — Storybook decorators completos (§15.1 G)

**Objetivo:** stories renderizam visualmente corretas + passam em Playwright/Chromatic + cobertura de Providers completa.

**Estimativa:** 5-6h

#### 2.1 Fix `nuqs` adapter no `.storybook/preview.tsx`

Componentes do theme-studio usam `nuqs` (`useQueryState`) pra URL state. Storybook não fornece adapter por padrão.

```tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

decorators: [
  (Story) => (
    <NuqsAdapter>
      <Story />
    </NuqsAdapter>
  ),
]
```

#### 2.2 Emitir tokens runtime no decorator

Tokens vivem em `<style precedence="theme">` no runtime real (via `buildThemeCSS()`). Storybook bypassa `app/layout.tsx` então CSS vars ficam undefined.

```tsx
import { buildThemeCSS } from '@/lib/design/build-theme-css'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

const themeCSS = buildThemeCSS(DEFAULT_THEME)

decorators: [
  (Story) => (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <Story />
    </>
  ),
]
```

#### 2.3 Adicionar Providers que estão faltando

`preview.tsx` atual tem `NextIntlClientProvider` + `RouteProvider` + `EntitlementProvider`. Faltam validar:

- ✅ `NextIntlClientProvider` — já presente, validar messages tem namespace `theme-studio` + `common` + `login`
- ✅ `RouteProvider` — já presente, validar mockBrand + mockTenant
- ✅ `EntitlementProvider` — já presente, validar mockFeatures inclui `theme_studio: true`
- ❌ `ThemeProviderClient` (next-themes wrap) — adicionar pra suportar dark mode toggle nas stories
- ❌ `ThemeFormProvider` — adicionar wrapping pros componentes do theme-studio quando aplicável

#### 2.4 Remover `mockBrand.default_palette_id` stale

Campo foi dropado em Fase 1.5 migration 0024. Limpar mockBrand:

```ts
const mockBrand: Brand = {
  id: 'brand-storybook',
  name: 'storybook',
  host: 'localhost:6006',
  // default_palette_id REMOVIDO
  logo_url: null,
  default_vertical: 'fitness',
  parent_label: null,
  theme_version: 1,
}
```

#### 2.5 Atualizar `mockFeatures` pra incluir `theme_studio: true`

`PlanFeaturesSchema` foi atualizado em correção pra incluir `theme_studio` boolean.

```ts
const mockFeatures: PlanFeatures = {
  schema_version: 1,
  chatbot: false,
  custom_domain: false,
  ai_assessment: true,
  branded_pwa: true,
  white_label_full: false,
  automations: false,
  theme_studio: true, // NOVO
  max_programs: 10,
  max_clients: 50,
  max_storage_gb: 5,
}
```

#### 2.6 Toggle light/dark aplicar `.dark` class no document.documentElement

```tsx
import { useEffect } from 'react'

decorators: [
  (Story, context) => {
    const { theme } = context.globals
    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])
    return <Story />
  },
]
```

#### 2.7 Validação Fase 2

- [ ] `pnpm storybook` boots sem warnings
- [ ] Visitar 7 stories — todas renderizam visualmente OK (validação user driving)
- [ ] `pnpm test storybook` 10/10 passa (ou contagem nova após fix)
- [ ] Tokens light/dark aplicam corretamente no preview
- [ ] Console browser sem erros vermelhos
- [ ] Side-by-side ainda válido vs Fase 0 baseline TweakCN

### Fase 3 — Tests + integration runtime (§15.1 H)

**Objetivo:** coverage mínimo 70% por componente principal + integration tests dos fluxos críticos (RHF, save, registry, APCA).

**Estimativa:** 12-16h (maior fase, justificada — runtime é o que tem mais débito)

#### 3.1 Unit tests por componente principal

Tests Vitest pra:

1. **color-picker.tsx** — change handler, controlled state, focus
2. **contrast-checker.tsx** — APCA dual-gate retorna pass/fail correto, filter issues, theme toggle
3. **font-picker.tsx** — Google Fonts load, fallback, search, category filter
4. **code-panel.tsx** — multi-format export, copy clipboard, package manager toggle
5. **control-panel.tsx** — tab switching, ResizablePanelGroup
6. **preview-panel.tsx** — tokens aplicam no preview, tab switching
7. **preset-select.tsx** — load preset, restore version, cycle prev/next
8. **hsl-controls.tsx** + **hsl-preset-button.tsx** — adjustments aplicam HSL corretamente, checkpoint/revert
9. **shadow-control.tsx** — 6 primitives mudam shadow output
10. **slider-with-input.tsx** — controlled state + onFocus/onBlur

Pattern:

```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ColorPicker } from '@/components/admin/theme-studio/color-picker'

describe('ColorPicker', () => {
  it('renders with default value', () => {
    render(<ColorPicker color="oklch(0.5 0.2 270)" onChange={vi.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onChange when color changes', async () => {
    const onChange = vi.fn()
    // ...
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('oklch'))
  })
})
```

#### 3.2 Integration tests fluxos críticos

##### 3.2.1 RHF integration (Chunk 2 REWRITE)

Pra `app/admin/theme-studio/_state/use-theme-form.test.ts`:

- Mount `ThemeFormProvider` + simular mudança theme
- Confirmar debounce 500ms (espelha TweakCN — testar com vi.useFakeTimers)
- Confirmar MAX_HISTORY_COUNT=30 cap
- Confirmar undo restaura past[N-1]
- Confirmar redo restaura present
- Confirmar checkpoint set/restore/clear

##### 3.2.2 Save flow end-to-end (manual ou Playwright)

Cenário:

1. Login com `teste@gmail.com / senha123`
2. Abrir `/admin/theme-studio`
3. Mudar `--primary` via color-picker
4. Click save
5. Reload página
6. Confirmar cor persistida no DB (via SQL query OR ler `tenant_theme_versions`)
7. Abrir incognito + login + abrir theme-studio
8. Confirmar mesma cor

Se Playwright impráctico, **manual test obrigatório com user driving**.

##### 3.2.3 Registry endpoint runtime

Cenário:

1. `pnpm dev` running
2. `curl http://showcase.lvh.me:3000/api/r/themes/[tenantId]/v1`
3. Validar response JSON é `registry:style` payload válido
4. `pnpm dlx shadcn add http://showcase.lvh.me:3000/api/r/themes/[tenantId]/v1` em projeto isolado
5. Confirmar applies CSS vars OKLCH

##### 3.2.4 APCA dual-gate runtime end-to-end

Cenário:

1. Theme com contraste ruim (`--primary` near `--primary-foreground`)
2. Click save → confirmar reject com message i18n
3. Click "Salvar mesmo assim" → confirmar `ignoreApcaWarning: true` flag
4. Save passa, version criada com warning metadata

#### 3.3 Setup test environment

Pode precisar adicionar mocks:

- `vi.mock('nuqs', () => ({ useQueryState: () => ['default', vi.fn()] }))`
- `vi.mock('server-only')` já existe
- `next-intl` mock pra `useTranslations`
- Supabase client mock com fixture data

#### 3.4 Validação Fase 3

- [ ] 10 componentes principais com test unit
- [ ] 4 integration tests cravados (RHF / save / registry / APCA)
- [ ] `pnpm test --coverage` reporta ≥70% em `components/admin/theme-studio/**`
- [ ] Zero `FAIL` no `pnpm test`
- [ ] Save flow end-to-end manual confirmado pelo user

### Fase 4 — Multi-tenant audit + MDX + LOC + ESLint cleanup

**Objetivo:** documentação co-localizada + componentes <600 LOC + multi-tenant validation explícita + ESLint overrides justificados.

**Estimativa:** 5-7h

#### 4.1 Multi-tenant validation explícita por componente (§15.1 C)

Pra cada componente em `components/admin/theme-studio/`:

```bash
# Pra cada arquivo, executar e documentar resultado:
grep -E "oklch\(|#[0-9a-fA-F]{3,6}|rgb\(|rgba\(" comp.tsx  # esperado: 0 OU allowlist documentada
grep -E "desafit|yoga\.app|ingles\.app" comp.tsx           # esperado: 0
grep "useBrand\(\)" comp.tsx                                # presente se renderiza brand?
```

Documentar em `docs/_sessions/2026-05-22-multi-tenant-audit-theme-studio.md`:

- Tabela por componente: tokens consumidos (lista cravada `var(--*)`)
- Tabela por componente: brand-agnostic ✅/❌
- Validar runtime: trocar `--primary` via cookie/store → componente re-renderiza?

#### 4.2 MDX docs pros 10 componentes principais

Pattern (não duplicar Storybook — MDX é semântico):

```mdx
{/* components/admin/theme-studio/color-picker.mdx */}

# ColorPicker

## When to use

Profissional escolhe cor individual da paleta (background, primary, etc).
Suporta HEX, OKLCH, HSL via tab interno.

## When NOT to use

- Pra carregar preset inteiro → use `PresetSelect`
- Pra ajustar HSL relativo a base → use `HslControls`

## Related

- `ColorSelectorPopover` (UI base)
- `HslControls` (HSL adjustments)

## Anti-patterns

- ❌ Passar string vazia em `color` prop — sempre OKLCH string canonical
- ❌ Renderizar fora de `ThemeFormProvider` (loses RHF context)

## Migration guide

(N/A — primeira versão)
```

#### 4.3 Decompose `font-picker.tsx` (643 LOC) + outros >400 LOC

ESLint override permite mas semântica fica ruim. Lista cravada:

- `font-picker.tsx` (643 LOC) — extract `<FontVariantsRow />`, `<FontPreviewPane />`, `useFontSearch()` (se ainda inline)
- `preset-select.tsx` (428 LOC) — extract `<PresetSearchInput />`, `<PresetGrid />` se aplicável
- `contrast-checker.tsx` (427 LOC) — pares table extract pra sub-component
- `code-panel.tsx` (402 LOC) — `<RegistryURLPanel />`, `<TabsCodeContent />`
- `control-panel.tsx` (336 LOC) — talvez OK como está, validar se vale extract

Target: <500 LOC per file. Onde não couber, manter override com ADR cravando motivo.

#### 4.4 ESLint overrides audit + justificação por ADR

Cravar cada override em ADR-0047 (formal lessons learned + governance):

| Override                                                            | Path                               | Justificável?                                                | Action                                                                                      |
| ------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `design-tokens/no-tailwind-bypass: 'off'`                           | `components/admin/theme-studio/**` | ✅ TweakCN brand visual identity (uppercase, tracking-wider) | Manter + ADR cravando + condição remoção                                                    |
| `better-tailwindcss/no-unknown-classes: 'off'`                      | mesmo path                         | ✅ `@6xl` container query Tailwind v4                        | Manter + ADR + revisitar quando lint suportar v4 nativamente                                |
| max-lines bump pra 400+                                             | mesmo path                         | ⚠️ Sim em alguns + decompose em outros                       | Decompose §4.3 onde possível, override apenas pra arquivos validados >500 LOC justificáveis |
| `i18next/no-literal-string: 'off'` + `react/jsx-no-literals: 'off'` | `app/login/**`                     | ⚠️ Sim DEV, mas planejar remoção quando login virar produto  | Manter + ADR + condição remoção (funil agência inicia)                                      |

#### 4.5 Audit checklist A-J final por componente

Criar `docs/_sessions/2026-05-22-theme-studio-compliance-audit.md` rodando manual checklist A-J nos 10 componentes principais. Marcar OK/FALHA por item. Cravar fixes pendentes ou aceitar gaps explicitamente.

Formato:

```markdown
## color-picker.tsx

- [x] A. Identidade — primitive L2 namespace @desafit + version v1.0.0
- [x] B. Contrato Zod — lib/contracts/components/color-picker.ts existe
- [x] C. Multi-tenant fit — tokens var(--\*), zero brand hardcode
- [ ] D. Acessibilidade — pendente review ARIA
- [x] E. i18n — useTranslations('theme-studio.colorPicker')
- [x] F. Performance — 'use client' justified
- [x] G. Storybook story — color-picker.stories.tsx existe
- [x] H. Tests — color-picker.test.tsx coverage 78%
- [x] I. MDX doc — color-picker.mdx criado
- [x] J. Registry-ready — @registry-meta JSDoc canonical
```

#### 4.6 Validação Fase 4

- [ ] 10 MDX docs criadas em `components/admin/theme-studio/*.mdx`
- [ ] `font-picker.tsx` decomposed em ~3-4 arquivos <500 LOC cada
- [ ] Multi-tenant audit doc criado com tabela cravada por componente
- [ ] ESLint overrides documentados em ADR-0047 com condição de remoção
- [ ] Compliance audit doc criado, 100% itens A-J checados
- [ ] Lint passa sem ESLint overrides desnecessários (manter só path-specific justificados em ADR)

### Fase 5 — Definition of Done com visual sign-off humano

**Objetivo:** validar end-to-end com user no driving seat antes de declarar 100% done.

**Estimativa:** 2-3h

#### 5.1 Visual sign-off humano

Roteiro cravado pra user executar em browser real:

1. `pnpm dev` running
2. Acessar `http://showcase.lvh.me:3000/login`
3. Login `teste@gmail.com / senha123` → redirect `/admin/theme-studio`
4. Confirmar editor visual completo aparece (NÃO vazio)
5. Click tab "Cores" → mudar `--primary` via color-picker → ver preview atualizar live
6. Click "Salvar" → confirmar toast/feedback OK
7. Reload página → confirmar `--primary` persistido visualmente
8. Abrir incognito → login mesmo user → confirmar mesma cor (multi-session)
9. Click tab "Tipografia" → trocar fonte sans → preview atualiza?
10. Click tab "Outros" → ajustar radius via slider → preview atualiza?
11. Click "Histórico" (se UI tem) → ver versions list → restaurar v1 → confirma rollback
12. Click "Bifurcar" (fork) → cria novo theme → list version
13. Click "Código" → confirmar tabs CSS + Registry retornam payload válido

User reporta passo-a-passo OK / FAIL.

#### 5.2 Side-by-side visual TweakCN

Roteiro:

1. Abrir TweakCN editor live (https://tweakcn.com/editor/theme) em tab 1
2. Abrir nosso `/admin/theme-studio` em tab 2
3. Em ambos, aplicar preset "Modern Minimal" (ou equivalente)
4. Screenshot lado-a-lado:
   - Control panel left (tabs/inputs/sliders)
   - Preview panel right (color showcase + components showcase)
   - Code panel (CSS export)
5. Lista cravada de diferenças visuais aceitas vs não-aceitas

#### 5.3 Bundle delta verification

Comparar `pnpm size` antes/depois das correções:

- Baseline pré-correção (commit 2fcd865): JS 178.42 kB / CSS 15.82 kB
- Pós-correção: documentar delta
- Justificar regressões se houver

#### 5.4 Token budget audit

`pnpm size` final deve estar dentro de:

- JS: ≤ 200 kB brotlied (margem ≥60% vs 500 kB budget)
- CSS: ≤ 20 kB brotlied (margem ≥60% vs 50 kB budget)

#### 5.5 Validação Fase 5

- [ ] Visual sign-off humano OK em 13 steps
- [ ] Side-by-side TweakCN documentado
- [ ] Bundle delta OK
- [ ] User declara "produto theme-studio funcional + visual idêntico TweakCN multi-tenant"
- [ ] Plano theme-builder + funil-agencia (próximo) DESBLOQUEADOS

---

## 3. Definition of 100% Done

| Critério                                       | Validação                                                                    |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| **Fase 0 — Runtime diagnóstico**               | Doc bugs cravado + visual diff TweakCN doc                                   |
| **Fase 1 — Zod schemas SSOT**                  | `ls lib/contracts/components/ \| wc -l` ≥10                                  |
|                                                | `grep -rE "^interface.*Props" components/admin/theme-studio/` → 0 matches    |
| **Fase 1.5 — Lib + server audit**              | Doc `lib-audit.md` criado, gaps fixados                                      |
|                                                | Server actions têm Zod input + tests cobrem paths críticos                   |
| **Fase 2 — Storybook**                         | 7 stories renderizam visual OK                                               |
|                                                | `pnpm test storybook` 0 failures                                             |
|                                                | Decorators completos (Intl + Route + Entitlement + Theme + ThemeForm + Nuqs) |
| **Fase 3 — Tests + integration**               | `pnpm test --coverage` ≥70% em `components/admin/theme-studio/**`            |
|                                                | 4 integration tests cravados (RHF / save / registry / APCA)                  |
|                                                | Save flow end-to-end manual confirmado                                       |
| **Fase 4 — Multi-tenant + MDX + LOC + ESLint** | ≥10 `.mdx` em `components/admin/theme-studio/`                               |
|                                                | `font-picker.tsx` decomposed                                                 |
|                                                | Multi-tenant audit doc criado                                                |
|                                                | ESLint overrides em ADR-0047 com condição de remoção                         |
| **Fase 5 — Sign-off humano**                   | 13-step visual flow OK                                                       |
|                                                | Side-by-side TweakCN doc                                                     |
|                                                | Bundle delta dentro de budget                                                |
| **Gates infra**                                | typecheck + lint + vocab + token + i18n + test + build verdes                |
| **Doc consolidado**                            | `docs/_sessions/2026-05-22-theme-studio-compliance-audit.md` 100% checked    |

---

## 4. Estratégia de execução

### Sequência recomendada

```
Fase 0 (Diagnóstico runtime + visual diff)    — 2-3h    — CRÍTICO ANTES de Fase 1
  ↓
Fase 1 (Zod schemas SSOT)                     — 6-8h    — sem dependência adicional
  ↓ (paralelo possível com Fase 1.5)
Fase 1.5 (Lib + server audit)                 — 3-4h    — paths disjuntos Fase 1
  ↓
Fase 2 (Storybook decorators completos)       — 5-6h    — depende Fase 1 (schemas) + Fase 1.5
  ↓
Fase 3 (Tests + integration runtime)          — 12-16h  — depende Fase 1 + Fase 1.5
  ↓
Fase 4 (Multi-tenant + MDX + LOC + ESLint)    — 5-7h    — depende Fase 3 (validar runtime antes)
  ↓
Fase 5 (Sign-off humano + side-by-side)       — 2-3h    — sequencial após Fase 4
```

**Paralelismo possível:** Fase 1 + Fase 1.5 paralelo (arquivos disjuntos — components/ vs lib/ + app/api/). Total wall-time:

- Sequencial: ~35-47h
- Com paralelismo Fase 1+1.5: ~32-42h

### Dispatch strategy

- **Opus** pra Fase 1 + Fase 1.5 + Fase 3 (decisões arquiteturais + tests synthesis + audit comparativo)
- **Sonnet** pra Fase 0 (mecânico — coletar bugs) + Fase 2 + Fase 4 (escopo bem-definido)
- **User no driving seat** pra Fase 0 (browser real) + Fase 5 (visual sign-off)
- 1 commit por fase pra rastreabilidade
- Atomic commit dentro de cada fase

### Plano de validação intermediária

Após cada fase, rodar gates completos + visual check:

```bash
pnpm typecheck && pnpm lint --max-warnings 0 && \
pnpm vocab:audit && pnpm token:audit && pnpm i18n:audit && \
pnpm test && pnpm build && pnpm size
```

**E TAMBÉM:** abrir browser real, navegar pelas rotas afetadas pela fase, confirmar comportamento.

Se algum falha OU visual quebra, **NÃO avançar** pra próxima fase até verde.

---

## 5. Prevenção de regressão futura

### 5.1 Aplicar §15.1 A-J rigoroso em CADA componente futuro

Antes de copiar próximo arquivo TweakCN OU criar componente novo:

- [ ] Zod schema em `lib/contracts/components/` (não interface inline)
- [ ] Story Storybook que renderiza correto + decorators completos
- [ ] Test Vitest mínimo (render + 1 interação principal)
- [ ] MDX doc opcional pero ALTAMENTE recomendado
- [ ] `@registry-meta` JSDoc canonical
- [ ] Tokens canonical apenas (`var(--primary)`, etc)
- [ ] `useTranslations` se tem strings user-facing
- [ ] APCA validation se aplicável
- [ ] **Browser real abriu + clique testado + console limpo**

### 5.2 CI gate mínimo (mesmo deferred)

User pediu adiar CI gates. Mas vale **dois gates mínimos**: bloquear PR se:

1. Componente novo NÃO tem Zod schema SSOT em `lib/contracts/components/`
2. Componente novo NÃO tem story Storybook

Script simples em `scripts/audit-component-contracts.ts` rodando em prebuild:

```ts
// pseudo
for (const componentFile of glob('components/admin/**/*.tsx')) {
  if (hasInlineInterface(componentFile) && !hasMatchingSchema(componentFile)) {
    throw new Error(`${componentFile} missing Zod schema in lib/contracts/components/`)
  }
  if (!hasMatchingStory(componentFile)) {
    throw new Error(`${componentFile} missing Storybook story`)
  }
}
```

**Trade-off:** trava desenvolvimento UMA VEZ por componente novo (criar schema + story = ~10min). Em troca, zero débito futuro.

### 5.3 Princípio cravado como ADR

Criar `docs/adr/0047-component-creation-rigor.md` formal:

- Title: "Rigor §15.1 A-J obrigatório por componente — lessons learned theme-builder"
- Context: incidente theme-builder 16 commits + 5/10 itens checklist passando
- Decision: ADR-0047 reforça §15.1 A-J como bloqueador (B + G obrigatórios via CI; H + I via PR review)
- Consequences: trava velocidade UMA VEZ por componente, paga em débito zero

### 5.4 Atualizar docs ativos

- `docs/plans/theme-builder.md` — adicionar status "executed with debt — corrected via audit-correction plan"
- `docs/_status.md` — refletir débito + correção em curso + ADR-0047 cravada
- `CHANGELOG.md` — entrada honesta cravando incidente + correção
- `.claude/rules/component-creation-governance.md` — adicionar seção "Lessons learned 2026-05-22" cravando que copy literal sem ADAPT rigoroso = anti-pattern

### 5.5 Memórias cravadas (já feitas 2026-05-22)

3 memórias salvas em `memory/`:

- `feedback_gates_nao_substituem_visual.md` — gates estáticos NÃO substituem browser real
- `feedback_governance_15_1_item_por_item.md` — §15.1 A-J auditar item-por-item
- `feedback_velocidade_vs_rigor_neste_projeto.md` — rigor sempre antes de velocidade

---

## 6. O que NÃO está neste plano

Itens fora do escopo desta correção (deferred):

- AI generation theme (Fase 6 antiga) — `docs/_deferred/ai-theme-generation-detail.md`
- v0 integration (Fase 7 antiga) — `docs/_deferred/v0-registry-integration-detail.md`
- Validation Suite Contínua (Fase 8 antiga) — `docs/_deferred/validation-suite-detail.md`
- Multi-preset matrix tests — JIT
- Visual regression Chromatic CI — JIT (baseline criada Fase 5 pode ser usado como referência futura)
- Login auth flow completo (multi-provider, reset password) — JIT funil agência
- Stories pros 16 sub-helpers (slider-with-input, control-section, etc) — JIT quando QA pedir

---

## 7. Next plan (depois deste)

**`docs/plans/funil-agencia.md`** retoma com Form Engine (item 2 ADR-0046).

Sequência cravada permanece:

2. Form captação agência (Survey.js COPY + ADAPT multi-tenant)
3. Report IA (Vercel AI Chatbot Artifacts COPY + Mastra INSTALL)
4. Página vendas agência (Puck COPY + ADAPT)
5. AI builders compor engines
6. Programa manual → automação

**Princípio cravado:** **NUNCA mais** copiar OSS em massa sem validar checklist A-J item-a-item por componente + visual check browser real intermediário. Lessons learned cravadas em rule + ADR-0047 + 3 memórias.

---

## 8. Cross-references

- ADR-0046 — Dogfooding-first execution order (princípio violado, agora reforçado)
- ADR-0044 — Pivot TweakCN-way (princípio §8 extract+adapt — esse plano corrige aplicação parcial)
- ADR-0044 §5 — "Visual check a cada etapa, não a cada fase" (princípio ignorado nos 8 chunks theme-builder)
- ADR-0045 — Registry Strategy (D.13 invariante mantido)
- **ADR-0047 (a criar nesta Fase 5)** — Component creation rigor: lessons learned theme-builder
- `.claude/rules/component-creation-governance.md` — checklist A-J (regra path-loaded — esta correção é instância de aplicação)
- `.claude/rules/registry-blocks.md` — registry invariante
- `docs/plans/theme-builder.md` — plano original (este plano é correção)
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` — pivot original arquivado
- `docs/research/45-component-strategy-best-practices.md` — research que cravou arsenal 20
- `docs/research/47-tweakcn-full-inventory.md` — audit inventory copy-literal plan
- `memory/feedback_gates_nao_substituem_visual.md` — lesson learned 1
- `memory/feedback_governance_15_1_item_por_item.md` — lesson learned 2
- `memory/feedback_velocidade_vs_rigor_neste_projeto.md` — lesson learned 3
- `memory/feedback_copy_literal_first.md` — princípio adopt upstream

---

**Fim do plano.**

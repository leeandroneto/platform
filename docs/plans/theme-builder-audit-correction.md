# Plano: Auditoria + Correção Theme Builder

> **Tipo:** plano executável (correção de débito técnico do theme-builder execution)
> **Status:** 🟡 PLANEJADO — não iniciado
> **Data início:** 2026-05-22
> **Estimativa total:** ~22-28h (4 fases, paralelizável parcialmente)
> **Owner:** Leandro
> **Bloqueia:** Form Engine (item 2 ADR-0046) — pagar débito antes de copiar mais OSS
> **Sucede:** theme-builder.md execution (commits 7f7a7a2 → 2fcd865)

---

## 0. Por que este plano existe

User identificou (2026-05-22): theme-builder execution criou débito técnico real. **Padrão do legado archetype repetindo** — código sem validação rigorosa via checklist §15.1 A-J.

Auditoria honesta confirmou: 26 componentes criados, ~50% compliance real com a rule path-loaded `component-creation-governance.md`. Pa\*\*ndaba dia 0 + chunks paralelos paralisaram o rigor a item de checklist.

**Objetivo:** chegar a **100% compliance §15.1 A-J** antes de continuar pra Form Engine (próximo item ADR-0046). Sem isso, débito acumula e replica padrão archetype.

---

## 1. Auditoria — estado real (2026-05-22)

### 1.1 Inventário

| Métrica                                         | Valor                                            |
| ----------------------------------------------- | ------------------------------------------------ |
| Componentes em `components/admin/theme-studio/` | **26 .tsx files** (+ 7 .stories + 1 .ts utility) |
| LOC total                                       | ~5.109                                           |
| Stories Storybook                               | 7 (todas falham em Playwright)                   |
| Tests unitários theme-studio                    | 2 (actions + history-reducer)                    |
| MDX docs                                        | 0                                                |
| Zod schemas em `lib/contracts/components/`      | **0** (pasta não existe)                         |
| Componentes com `@registry-meta` JSDoc          | ~22/26                                           |
| Componentes com `useTranslations`               | 10                                               |
| Componentes >400 LOC                            | 5 (com ESLint override path-specific)            |

### 1.2 Compliance §15.1 A-J — checklist real por categoria

| Categoria                   | Status                         | Observação                                                                            |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| **A. Identidade**           | ✅ 22/26                       | Naming correto, categoria L2, localização certa, versão semver no header              |
| **B. Contrato técnico Zod** | ❌ **10 com inline interface** | `lib/contracts/components/` não existe. Anti-pattern claro                            |
| **C. Multi-tenant fit**     | ✅ Parcial                     | Tokens canonical consumidos, brand-agnostic. Falta validação explícita por componente |
| **D. Acessibilidade**       | ❓ Não auditado                | Precisa visual review                                                                 |
| **E. i18n**                 | ✅ 10/22 (essenciais)          | Componentes user-facing têm `useTranslations`. Helpers internos não precisam          |
| **F. Performance**          | ✅ Parcial                     | RSC default respeitado em page.tsx; client components têm `'use client'` justificado  |
| **G. Storybook story**      | ⚠️ 7 criadas mas FALHAM        | Não por tokens — por `nuqs` adapter missing no preview.tsx                            |
| **H. Tests**                | ❌ <5% coverage                | Apenas 2 tests pra 26 componentes                                                     |
| **I. Doc co-localizada**    | ❌ 0 MDX docs                  | Headers existem mas MDX zero                                                          |
| **J. Registry-ready**       | ✅ 22/26                       | `@registry-meta` JSDoc aplicado nos principais                                        |

### 1.3 Bugs reais identificados

| #   | Bug                                                                                                                                  | Severidade                      | Localização                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------- |
| 1   | Stories falham — `nuqs` adapter ausente no Storybook decorator                                                                       | Alta                            | `.storybook/preview.tsx`                              |
| 2   | `mockBrand.default_palette_id: 'palette-mock'` stale (campo dropado em Fase 1.5)                                                     | Média                           | `.storybook/preview.tsx`                              |
| 3   | Storybook preview não emite tokens runtime (`<style precedence="theme">`)                                                            | Média                           | `.storybook/preview.tsx` (impacta visual real depois) |
| 4   | 10 componentes com `interface ComponentProps {}` inline em vez de Zod schema                                                         | Alta                            | `components/admin/theme-studio/*.tsx`                 |
| 5   | `next/font Geist` no Storybook + Vite tem fricção conhecida                                                                          | Baixa                           | `.storybook/preview.tsx`                              |
| 6   | `font-picker.tsx` 643 LOC, 5 componentes >400 LOC                                                                                    | Baixa (overrides ESLint cobrem) | `eslint.config.mjs`                                   |
| 7   | Login page existe mas user reportou "não roda" — HTTP 200 confirmado, possível visual quebrado por mesmo problema dos tokens runtime | Investigar                      | `app/login/`                                          |

### 1.4 O que está CORRETO (não tocar)

- ✅ APCA Silver corretamente implementado em `contrast-checker.tsx` (NÃO há WCAG misturado — só comentários históricos)
- ✅ `@registry-meta` JSDoc canonical aplicado
- ✅ `useTranslations` em componentes user-facing
- ✅ Brand-agnostic (zero hardcoded `desafit`/`yoga.app`)
- ✅ Atribuição Apache-2.0 via header `// RESEARCH: tweakcn (Apache-2.0) — adapted from ...`
- ✅ NOTICE.md atualizado
- ✅ ESLint overrides path-specific narrow scope documentados
- ✅ Typecheck + lint + build verde
- ✅ Server actions seguem `Result<T, AppError>` pattern (ADR-0040)

### 1.5 Causa raiz

**Princípio dogfooding-first (ADR-0046) foi parcialmente violado:**

- Chunks executaram "copy literal" rápido mas pularam **adaptação rigorosa item-a-item da checklist A-J**
- Rule path-loaded `component-creation-governance.md` é **playbook**, não **enforcement** — sem CI gate, depende disciplina humana
- 26 componentes criados antes de **1 ser usado em runtime real** (theme studio nem foi aberto pelo user com sucesso ainda)
- Anti-pattern: **construção em massa antes de validação real** = padrão do legado archetype

---

## 2. Plano de correção — 4 fases

> **Estratégia:** atacar débito por categoria (B → G → H → I), não componente-a-componente. Mais rápido, menos retrabalho.

### Fase 1 — Zod schemas SSOT (§15.1 B)

**Objetivo:** eliminar interfaces TS inline. Todo componente com props públicas tem Zod schema em `lib/contracts/components/`.

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

### Fase 2 — Storybook preview fix (§15.1 G)

**Objetivo:** stories renderizam visualmente corretas + passam em Playwright/Chromatic.

**Estimativa:** 4-5h

#### 2.1 Fix `nuqs` adapter no `.storybook/preview.tsx`

Componentes do theme-studio usam `nuqs` (`useQueryState`) pra URL state. Storybook não fornece adapter por padrão.

```tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'
// ou adapter custom pra Storybook

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

#### 2.3 Remover `mockBrand.default_palette_id` stale

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

#### 2.4 Toggle light/dark aplicar `.dark` class

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

#### 2.5 Validação Fase 2

- [ ] `pnpm storybook` boots sem warnings
- [ ] Visitar 7 stories — todas renderizam visualmente OK
- [ ] `pnpm test storybook` 10/10 passa (ou contagem nova após fix)
- [ ] Tokens light/dark aplicam corretamente no preview

### Fase 3 — Tests + coverage (§15.1 H)

**Objetivo:** coverage mínimo 70% por componente.

**Estimativa:** 10-15h (a maior fase)

#### 3.1 Priorizar componentes user-facing

Tests Vitest pra:

1. **color-picker.tsx** — change handler, controlled state, focus
2. **contrast-checker.tsx** — APCA dual-gate retorna pass/fail correto
3. **font-picker.tsx** — Google Fonts load, fallback, search
4. **code-panel.tsx** — multi-format export, copy clipboard
5. **control-panel.tsx** — tab switching, ResizablePanelGroup
6. **preview-panel.tsx** — tokens aplicam no preview
7. **preset-select.tsx** — load preset, restore version
8. **hsl-controls.tsx** + **hsl-preset-button.tsx** — adjustments aplicam HSL corretamente
9. **shadow-control.tsx** — 6 primitives mudam shadow output
10. **slider-with-input.tsx** — controlled state + onFocus/onBlur

#### 3.2 Pattern de teste

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

#### 3.3 Setup test environment

Pode precisar adicionar mocks:

- `vi.mock('nuqs', () => ({ useQueryState: () => ['default', vi.fn()] }))`
- `vi.mock('server-only')` já existe
- `next-intl` mock pra `useTranslations`

#### 3.4 Validação Fase 3

- [ ] 10 componentes principais com test
- [ ] `pnpm test --coverage` reporta ≥70% em `components/admin/theme-studio/**`
- [ ] Zero `FAIL` no `pnpm test`

### Fase 4 — MDX docs + LOC compliance + polish (§15.1 I + F)

**Objetivo:** documentação co-localizada + componentes <600 LOC.

**Estimativa:** 4-6h

#### 4.1 MDX docs pros 10 componentes principais

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

#### 4.2 Decompose `font-picker.tsx` (643 LOC)

ESLint override permite mas semântica fica ruim:

- Extract `<FontVariantsRow />` (loops weights/styles)
- Extract `<FontPreviewPane />` (live preview)
- Extract `useFontSearch()` hook se ainda inline

Target: <500 LOC per file.

#### 4.3 Audit checklist A-J final por componente

Crear `docs/_sessions/2026-05-22-theme-studio-compliance-audit.md` rodando manual checklist A-J nos 10 componentes principais. Marcar OK/FALHA por item. Cravar fixes pendentes ou aceitar gaps explicitamente.

#### 4.4 Validação Fase 4

- [ ] 10 MDX docs criadas em `components/admin/theme-studio/*.mdx`
- [ ] `font-picker.tsx` decomposed em ~3-4 arquivos <500 LOC cada
- [ ] Compliance audit doc criado, 100% itens checados
- [ ] Lint passa sem ESLint overrides desnecessários (manter só path-specific justificados)

---

## 3. Definition of 100% Done

| Critério                                        | Validação                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| Zod schemas SSOT em `lib/contracts/components/` | `ls lib/contracts/components/ \| wc -l` ≥10                               |
| Zero `interface` Props inline                   | `grep -rE "^interface.*Props" components/admin/theme-studio/` → 0 matches |
| Storybook stories renderizam                    | `pnpm test` 0 failures em `*.stories.*`                                   |
| Tests coverage ≥70%                             | `pnpm test --coverage`                                                    |
| MDX docs principais                             | ≥10 `.mdx` em `components/admin/theme-studio/`                            |
| Login page renderiza visual                     | `pnpm dev` + visitar `/login` → cores corretas                            |
| Gates verdes                                    | typecheck + lint + vocab + token + i18n + test + build                    |
| Audit doc final                                 | `docs/_sessions/2026-05-22-theme-studio-compliance-audit.md` 100% checked |

---

## 4. Estratégia de execução

### Sequência recomendada

```
Fase 1 (Zod schemas)        — 6-8h   — sem dependência
  ↓
Fase 2 (Storybook fix)      — 4-5h   — pode rodar paralelo com Fase 1
  ↓
Fase 3 (Tests)              — 10-15h — depende Fase 1 (usar schemas nos tests)
  ↓
Fase 4 (MDX + LOC + audit)  — 4-6h   — depende Fase 1+3
```

**Paralelismo:** Fase 1 + Fase 2 paralelo (arquivos disjuntos). Total wall-time ~22-24h se rodado sequencialmente, ~18-20h com paralelismo.

### Dispatch strategy

- **Opus** pra Fase 1 + Fase 3 (decisões arquiteturais + tests synthesis)
- **Sonnet** pra Fase 2 + Fase 4 (escopo bem-definido)
- 1 commit por fase pra rastreabilidade
- Atomic commit dentro de cada fase

### Plano de validação intermediária

Após cada fase, rodar gates completos:

```bash
pnpm typecheck && pnpm lint --max-warnings 0 && \
pnpm vocab:audit && pnpm token:audit && pnpm i18n:audit && \
pnpm test && pnpm build && pnpm size
```

Se algum falha, **NÃO avançar** pra próxima fase até verde.

---

## 5. Prevenção de regressão futura

### 5.1 Aplicar §15.1 A-J rigoroso em CADA componente futuro

Antes de copiar próximo arquivo TweakCN OU criar componente novo:

- [ ] Zod schema em `lib/contracts/components/` (não interface inline)
- [ ] Story Storybook que renderiza correto
- [ ] Test Vitest mínimo (render + 1 interação principal)
- [ ] MDX doc opcional pero ALTAMENTE recomendado
- [ ] `@registry-meta` JSDoc canonical
- [ ] Tokens canonical apenas (`var(--primary)`, etc)
- [ ] `useTranslations` se tem strings user-facing
- [ ] APCA validation se aplicável

### 5.2 CI gate mínimo (mesmo deferred)

User pediu adiar CI gates. Mas vale **um gate mínimo**: bloquear PR se componente novo NÃO tem Zod schema SSOT.

Script simples em `scripts/audit-component-contracts.ts` rodando em prebuild:

```ts
// pseudo
for (const componentFile of glob('components/admin/**/*.tsx')) {
  if (hasInlineInterface(componentFile) && !hasMatchingSchema(componentFile)) {
    throw new Error(`${componentFile} missing Zod schema in lib/contracts/components/`)
  }
}
```

**Trade-off:** trava desenvolvimento UMA VEZ por componente novo (criar schema = ~5min). Em troca, zero débito futuro.

### 5.3 Princípio cravar como ADR ou atualizar rule

Atualizar `.claude/rules/component-creation-governance.md`:

- Adicionar seção "Lessons learned 2026-05-22" cravando que copy literal sem ADAPT rigoroso = anti-pattern
- Reforçar §15.1 B como bloqueador (não optional)
- Adicionar script `audit-component-contracts.ts` referência

---

## 6. O que NÃO está neste plano

Itens fora do escopo desta correção (deferred):

- AI generation theme (Fase 6 antiga) — `docs/_deferred/ai-theme-generation-detail.md`
- v0 integration (Fase 7 antiga) — `docs/_deferred/v0-registry-integration-detail.md`
- Validation Suite Contínua (Fase 8 antiga) — `docs/_deferred/validation-suite-detail.md`
- Multi-preset matrix tests — JIT
- Visual regression Chromatic CI — JIT
- Login auth flow completo (multi-provider, reset password) — JIT funil agência

---

## 7. Next plan (depois deste)

**`docs/plans/funil-agencia.md`** retoma com Form Engine (item 2 ADR-0046).

Sequência cravada permanece:

2. Form captação agência (Survey.js COPY + ADAPT multi-tenant)
3. Report IA (Vercel AI Chatbot Artifacts COPY + Mastra INSTALL)
4. Página vendas agência (Puck COPY + ADAPT)
5. AI builders compor engines
6. Programa manual → automação

**Princípio cravado:** **NUNCA mais** copiar OSS em massa sem validar checklist A-J item-a-item por componente. Lesson learned cravada em rule.

---

## 8. Cross-references

- ADR-0046 — Dogfooding-first execution order (princípio violado, agora reforçado)
- ADR-0044 — Pivot TweakCN-way (princípio §8 extract+adapt — esse plano corrige aplicação parcial)
- ADR-0045 — Registry Strategy (D.13 invariante mantido)
- `.claude/rules/component-creation-governance.md` — checklist A-J (regra path-loaded — esta correção é instância de aplicação)
- `.claude/rules/registry-blocks.md` — registry invariante
- `docs/plans/theme-builder.md` — plano original (este plano é correção)
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` — pivot original arquivado
- `docs/research/45-component-strategy-best-practices.md` — research que cravou arsenal 20

---

**Fim do plano.**

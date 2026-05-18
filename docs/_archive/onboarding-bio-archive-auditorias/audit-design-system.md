# Auditoria de Design System — onboarding.bio

> Estado pós-Fase 04 do PLANO_LANCAMENTO.
> **Última validação:** 2026-04-29.
> Fonte canônica de design: `docs/core/DESIGN-SYSTEM-FOUNDATION.md`.

---

## 1. Componentes criados (components/ui/)

### Tipografia e estado

| Componente       | Arquivo           | Função                                              |
| ---------------- | ----------------- | --------------------------------------------------- |
| `<Heading>`      | `heading.tsx`     | Tag semântica h1-h6 + display, tokens tipográficos  |
| `<Text>`         | `text.tsx`        | body, caption, label, micro, muted, mono            |
| `<StatusDot>`    | `status.tsx`      | Ponto 8px colorido (ok/warn/bad/neutral/info/muted) |
| `<StatusBadge>`  | `status.tsx`      | Badge pill com label                                |
| `<StatusBanner>` | `status.tsx`      | Banner full-width por seção                         |
| `<EmptyState>`   | `empty-state.tsx` | 3 variantes: initial, filtered, error               |
| `<KBD>`          | `kbd.tsx`         | Keyboard shortcut display                           |

### Botões e ações

| Componente               | Arquivo                      | Função                                           |
| ------------------------ | ---------------------------- | ------------------------------------------------ |
| `<Button>`               | `button.tsx`                 | Primário shadcn (6 variants, 7 sizes)            |
| `<IconButton>`           | `icon-button.tsx`            | Botão com ícone, aria-label obrigatório          |
| `<LinkButton>`           | `link-button.tsx`            | Visual de botão, comportamento de link           |
| `<AsyncActionButton>`    | `async-action-button.tsx`    | Loading/success/error gerenciado                 |
| `<CopyButton>`           | `CopyButton.tsx`             | Clipboard com feedback                           |
| `<DangerAction>`         | `danger-action.tsx`          | Ação destrutiva com confirmação                  |
| `<FloatingActionButton>` | `floating-action-button.tsx` | FAB mobile                                       |
| `<StickyActionBar>`      | `sticky-action-bar.tsx`      | Sticky footer mobile para ações                  |
| `<FormActions>`          | `form-actions.tsx`           | Bar Cancel+Submit, sticky mobile, inline desktop |

### Formulários

| Componente           | Arquivo                 | Função                                  |
| -------------------- | ----------------------- | --------------------------------------- |
| `<FormSection>`      | `form-section.tsx`      | Agrupa fields com título                |
| `<FieldGroup>`       | `form-section.tsx`      | Fieldset dentro de FormSection          |
| `<Input>`            | `input.tsx`             | shadcn text input                       |
| `<Textarea>`         | `textarea.tsx`          | shadcn textarea                         |
| `<Select>`           | `select.tsx`            | shadcn select dropdown                  |
| `<Combobox>`         | `combobox.tsx`          | cmdk-based, search, async, keyboard nav |
| `<Checkbox>`         | `checkbox.tsx`          | shadcn checkbox                         |
| `<CheckboxGroup>`    | `checkbox-group.tsx`    | Lista controlada de checkboxes          |
| `<RadioGroup>`       | `radio-group.tsx`       | shadcn radio group                      |
| `<Switch>`           | `switch.tsx`            | shadcn toggle                           |
| `<Slider>`           | `slider.tsx`            | Range slider nativo estilizado          |
| `<DatePicker>`       | `date-picker.tsx`       | Input type=date estilizado              |
| `<DateRangePicker>`  | `date-range-picker.tsx` | Par from/to com DatePicker              |
| `<FileUpload>`       | `file-upload.tsx`       | Dropzone drag-and-drop com validação    |
| `<SegmentedControl>` | `segmented-control.tsx` | 2-4 opções para toggle de view          |

### Surfaces e data display

| Componente           | Arquivo                 | Função                                          |
| -------------------- | ----------------------- | ----------------------------------------------- |
| `<Card>`             | `card.tsx`              | shadcn card                                     |
| `<Panel>` / `<Tile>` | `surface.tsx`           | Sub-agrupamento e card clicável                 |
| `<DataTable>`        | `data-table.tsx`        | Tabela desktop com sort/search                  |
| `<MobileList>`       | `mobile-list.tsx`       | Lista mobile alternativa a DataTable            |
| `<ListItem>`         | `list-item.tsx`         | Item de lista clicável                          |
| `<SkeletonVariants>` | `skeleton-variants.tsx` | Card, DataTable, MetricCard, ListItem skeletons |

### Overlays e navegação

| Componente               | Arquivo                       | Função                          |
| ------------------------ | ----------------------------- | ------------------------------- |
| `<ResponsiveDrawer>`     | `responsive-drawer.tsx`       | Sheet (desktop) + Vaul (mobile) |
| `<DrawerWithDirtyCheck>` | `drawer-with-dirty-check.tsx` | Unsaved changes guard           |
| `<CommandPalette>`       | `command-palette.tsx`         | Cmd+K com cmdk                  |
| `<BottomTabBar>`         | `bottom-tab-bar.tsx`          | 5 slots mobile                  |
| `<MobileTopBar>`         | `mobile-top-bar.tsx`          | Header mobile mínimo            |
| `<AlertDialog>`          | `alert-dialog.tsx`            | Confirmação destrutiva          |
| `<NotificationBanner>`   | `notification-banner.tsx`     | Banner persistente inline       |

**Total:** 43 componentes em `components/ui/`.

---

## 2. Tokens definidos (app/globals.css @theme)

### OKLCH primitives

- **Brand:** 11 steps (50-950) em oklch, hue 175 (teal escuro)
- **Gray:** 11 steps (50-950) em oklch, hue 80 (warm neutral)
- **Semantics:** success (hue 145), warning (hue 75), danger (hue 25), info (hue 235) — 11 steps cada
- **Light mode overrides:** lime, green, ocean, amber — APCA-validated

### Shape system

- `data-shape`: sharp / rounded / soft
- Tokens: `--shape-card`, `--shape-button`, `--shape-input`, `--shape-badge`, `--shape-avatar`, `--shape-pill`

### Density system

- `data-density`: tight / cozy / roomy
- Tokens: `--pad-y`, `--pad-x`, `--row-y`, `--gap`

### Surface separation

- `data-surface`: internal / public

### Typography tokens (9 níveis)

| Token               | Size | Line-height | Letter-spacing | Weight |
| ------------------- | ---- | ----------- | -------------- | ------ |
| `--text-display`    | 48px | 1.05        | -0.02em        | 600    |
| `--text-h1`         | 28px | 1.15        | -0.01em        | 600    |
| `--text-h2`         | 20px | 1.20        | -0.01em        | 600    |
| `--text-h3`         | 16px | 1.30        | 0              | 600    |
| `--text-body-large` | 16px | 1.55        | —              | —      |
| `--text-body`       | 14px | 1.55        | —              | —      |
| `--text-body-small` | 13px | 1.50        | 0.005em        | —      |
| `--text-label`      | 11px | 1.20        | 0.04em         | 500    |
| `--text-micro`      | 10px | 1.20        | —              | —      |
| `--text-micro-xs`   | 9px  | 1.20        | —              | —      |
| `--text-mono`       | 14px | 1.30        | —              | 500    |

### Tracking tokens

| Token                      | Value   |
| -------------------------- | ------- |
| `--tracking-tighter`       | -0.03em |
| `--tracking-tight`         | -0.02em |
| `--tracking-snug`          | -0.01em |
| `--tracking-normal`        | 0       |
| `--tracking-wide`          | 0.04em  |
| `--tracking-wider`         | 0.06em  |
| `--tracking-extra-wide`    | 0.15em  |
| `--tracking-display`       | 0.2em   |
| `--tracking-display-wide`  | 0.25em  |
| `--tracking-extra-display` | 0.3em   |
| `--tracking-ultra`         | 0.4em   |

### Leading tokens

| Token                     | Value |
| ------------------------- | ----- |
| `--leading-extra-tight`   | 0.88  |
| `--leading-display`       | 0.92  |
| `--leading-display-loose` | 0.95  |
| `--leading-none`          | 1     |
| `--leading-tighter`       | 1.05  |
| `--leading-tight`         | 1.15  |
| `--leading-snug`          | 1.30  |
| `--leading-body`          | 1.4   |
| `--leading-normal`        | 1.55  |
| `--leading-relaxed`       | 1.65  |
| `--leading-loose`         | 1.75  |

### Radius tokens

| Token           | Value          |
| --------------- | -------------- |
| `--radius-xs`   | 4px            |
| `--radius-sm`   | 6px            |
| `--radius-md`   | 10px (default) |
| `--radius-lg`   | 14px           |
| `--radius-xl`   | 20px           |
| `--radius-full` | 9999px         |

### Utility classes

- `.text-micro` — 10px compound (size + line-height)
- `.text-micro-xs` — 9px compound (size + line-height)
- `.text-body-small` — 13px compound (size + line-height + letter-spacing)

---

## 3. Lint rules de governança

### Modo error (0 erros)

| Regra                               | O que bloqueia                                                          |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `no-restricted-imports`             | `framer-motion` (→ `motion/react`), `next/router` (→ `next/navigation`) |
| `jsx-a11y/*` (29 rules)             | Acessibilidade estrita (WCAG 2.2 AA)                                    |
| `@typescript-eslint/no-unused-vars` | Variáveis mortas                                                        |

### Modo warn (ratchet — resolver boy-scout-rule)

| Regra                                          | Contagem atual | O que detecta                        |
| ---------------------------------------------- | -------------- | ------------------------------------ |
| `no-restricted-syntax` (no-raw-button)         | ~180           | `<button>` fora de `components/ui/`  |
| `no-restricted-syntax` (no-direct-heading)     | ~500           | `<h1>`-`<h6>` direto (→ `<Heading>`) |
| `no-restricted-syntax` (no-inline-style-color) | ~4             | `style={{ color: '#hex' }}`          |
| `react/jsx-no-literals` (i18n)                 | ~300           | Strings hardcoded em JSX             |

**Total: 0 errors, ~1002 warnings.**

### Regra impossível

`eslint-plugin-tailwindcss` v3 (regra `no-arbitrary-tailwind`) é **incompatível com Tailwind v4** (`@theme` em CSS, sem `tailwind.config.ts`). O plugin foi removido. Documentado em `eslint.config.mjs` linhas 4-6. Valores arbitrários são gerenciados por code review + codemods manuais até o plugin v4 ser lançado.

---

## 4. Codemods executados (Fase 04)

### Batch 1 — top 6 padrões (303 substituições, commit cc25359+)

| Padrão              | De         | Para                    | Instâncias |
| ------------------- | ---------- | ----------------------- | ---------- |
| `text-[10px]`       | Arbitrário | `text-micro`            | ~127       |
| `text-[11px]`       | Arbitrário | `text-label`            | ~72        |
| `tracking-[0.2em]`  | Arbitrário | `tracking-display`      | ~67        |
| `tracking-[0.25em]` | Arbitrário | `tracking-display-wide` | ~34        |
| `leading-[0.95]`    | Arbitrário | `leading-display-loose` | ~12        |

### Batch 2 — padrões tipográficos (62 substituições)

| Padrão               | De                    | Para                        | Instâncias |
| -------------------- | --------------------- | --------------------------- | ---------- |
| `text-[13px]`        | Arbitrário            | `text-body-small`           | 10         |
| `text-[9px]`         | Arbitrário            | `text-micro-xs`             | 22         |
| `text-[12px]`        | Arbitrário            | `text-xs` (Tailwind native) | 3          |
| `text-[10px]`        | Arbitrário (residual) | `text-micro`                | 2          |
| `tracking-[-0.02em]` | Arbitrário            | `tracking-tight`            | 22         |
| `tracking-[0.04em]`  | Arbitrário            | `tracking-wide`             | 1          |
| `leading-[1.1]`      | Arbitrário            | `leading-tight`             | 2          |
| `leading-[1.3]`      | Arbitrário            | `leading-snug`              | 1          |

### Batch 3 — tracking + leading restantes (~196 substituições)

Novos tokens criados: `--tracking-tighter`, `--tracking-extra-wide`, `--tracking-extra-display`, `--tracking-ultra`, `--leading-extra-tight`, `--leading-none`, `--leading-tighter`, `--leading-body`, `--leading-loose`.

| Padrão                             | Para                            | Instâncias |
| ---------------------------------- | ------------------------------- | ---------- |
| `tracking-[-0.03em]` a `[-0.04em]` | `tracking-tighter`              | ~20        |
| `tracking-[0.14em]` a `[0.18em]`   | `tracking-extra-wide`           | ~48        |
| `tracking-[0.22em]`                | `tracking-display`              | ~12        |
| `tracking-[0.28em]` a `[0.35em]`   | `tracking-extra-display`        | ~43        |
| `tracking-[0.38em]` a `[0.4em]`    | `tracking-ultra`                | ~15        |
| `leading-[0.85]` a `[0.88]`        | `leading-extra-tight`           | ~7         |
| `leading-[0.9]`                    | `leading-display`               | ~2         |
| `leading-[0.93]`                   | `leading-display-loose`         | ~2         |
| `leading-[1]`                      | `leading-none`                  | ~9         |
| `leading-[1.05]`                   | `leading-tighter`               | ~12        |
| `leading-[1.35]` a `[1.45]`        | `leading-body` / `leading-snug` | ~17        |
| `leading-[1.7]` a `[1.8]`          | `leading-loose`                 | ~7         |

**Resultado final:** tracking-[*em] = **0**, leading-[N] = **0**.

### Exceções justificadas (32 instâncias restantes)

| Padrão                 | Count | Arquivo(s)                   | Motivo                                          |
| ---------------------- | ----- | ---------------------------- | ----------------------------------------------- |
| `text-[8px]`           | 21    | Mocks, gauges, report badges | Sub-accessible decorative in miniature previews |
| `text-[7px]`           | 2     | CoverSection gauge SVG       | Tiny label in chart SVG                         |
| `text-[32/48/60px]`    | 3     | About page hero              | Responsive decorative text beyond token range   |
| `text-[15/17px]`       | 2     | WizardMock, MethodIntro      | Between-token sizes in specific contexts        |
| `bg-[#dcf8c6]`         | 1     | ProximoPassoTab              | WhatsApp bubble color (not brand)               |
| `rounded-[40/36/34px]` | 4     | Frames.tsx, FormPreview      | Device frame mockup                             |
| `rounded-[4/2px]`      | 2     | checkbox.tsx, tooltip.tsx    | shadcn primitive internal                       |

---

## 5. APCA validação de contraste

- **Lib:** `apca-w3` em `lib/design/contrast.ts`
- **Testes:** 18/18 validações passando (vitest)
- **Cobertura:** brand 11 steps, gray 11 steps, 4 semantics × 11 steps
- **Light mode overrides:** lime, green, ocean, amber — APCA Lc ≥ 60 body, ≥ 75 small text
- **Script:** `pnpm exec tsx scripts/validate-contrast.ts`

---

## 6. Visual Regression Testing

- **Ferramenta:** Playwright VRT
- **Baseline:** 30 screenshots (10 rotas × 3 viewports)
- **CI job:** configurado no pipeline
- **Threshold:** diff > 0.1% falha

---

## 7. Ladle catalog

- **Stories:** 14 arquivos em `components/ui/*.stories.tsx`
- **Cobertura:** Heading, Text, Status (Dot+Badge+Banner), Button, IconButton, EmptyState, SegmentedControl, Combobox, DataTable, ResponsiveDrawer, BottomTabBar, FormSection+FieldGroup, KBD, SkeletonVariants

---

## 8. Gaps conhecidos

| #   | Gap                                                              | Severidade | Plano                             |
| --- | ---------------------------------------------------------------- | ---------- | --------------------------------- |
| 1   | `no-arbitrary-tailwind` impossível com Tailwind v4               | Baixa      | Esperar plugin v4                 |
| 2   | ~1002 lint warnings (ratchet pattern)                            | Baixa      | Boy-scout-rule ao longo das fases |
| 3   | ~180 `<button>` diretos fora de UI primitives                    | Média      | Migrar ao tocar nos componentes   |
| 4   | ~500 headings diretos (não `<Heading>`)                          | Média      | Migrar ao tocar nos componentes   |
| 5   | ~300 strings JSX hardcoded (i18n)                                | Média      | Fase F em andamento               |
| 6   | 32 valores arbitrários restantes (justified)                     | Nenhuma    | Exceções documentadas acima       |
| 7   | `CommandPalette` criado mas não integrado no shell               | Baixa      | Integrar em Fase 07+              |
| 8   | `BottomTabBar` criado mas não integrado no shell                 | Baixa      | Integrar em Fase 07+              |
| 9   | `@axe-core/playwright` não instalado                             | Baixa      | Fase 17 (audit final)             |
| 10  | `--color-section-alt` é usado (5 componentes) — NÃO é dead token | Nenhuma    | Original audit incorreto          |

---

## 9. Geist font

- **Pacote:** `geist` instalado
- **Carregamento:** `geist/font/sans` e `geist/font/mono` no layout root
- **Fallback:** Inter via font stack
- **Tabular nums:** enforced via `.tabular-nums` e Geist Mono

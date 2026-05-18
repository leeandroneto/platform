# Fases 10-19 — Design System: já executadas ✅

> **Documentação retroativa.** Estas fases foram executadas como parte da "Fase 04" antiga (sub-fases 04.0 a 04.5). Aqui ficam registradas como fases lineares no novo plano, com referência ao trabalho já feito.

---

## Fase 10 — Tokens foundation ✅

**Equivalente:** Fase 04.0 + 04.1a antigas
**Concluída em:** 2026-04-29
**Camadas cobertas:** 3

**Entregue:**

- OKLCH primitivos: brand 11 steps, gray 11 steps, 4 semantics × 11 steps
- Brand color `oklch(62% 0.13 175)` (teal escuro)
- Neutrals warm hue 80
- Light mode overrides: lime, green, ocean, amber (APCA-validated)
- APCA: `apca-w3` + `lib/design/contrast.ts` — 18/18 checks passando
- `data-shape` (sharp/rounded/soft)
- `data-density` (tight/cozy/roomy)
- `data-surface`: internal/public
- Dark mode primitives

**Auditoria:** trabalho anterior, sem pasta de auditoria dedicada. Resultado validado pela Fase 24 (conferência final).

---

## Fase 11 — Tipografia + Geist ✅

**Equivalente:** Fase 04.1c antiga
**Concluída em:** 2026-04-29

**Entregue:**

- Pacote `geist` instalado, carregando no layout root
- Inter como fallback
- 11 tokens tipográficos
- 11 tokens tracking
- 11 tokens leading
- Tabular nums enforced
- Utility classes

---

## Fase 12 — Shape + density ✅

**Equivalente:** Fase 04.1b antiga
**Concluída em:** 2026-04-29

**Entregue:**

- Tokens `--shape-*`, `--radius-md: 10px` default
- VRT baseline: 30 screenshots (10 rotas × 3 viewports)

---

## Fase 13 — Codemod valores arbitrários ✅

**Equivalente:** Fase 04.2 antiga
**Concluída em:** 2026-04-29

**Entregue:** ~800 valores arbitrários migrados pra tokens. 32 exceções justificadas restantes (mocks decorativos, device frames, shadcn internos).

**Pendência:** `no-arbitrary-tailwind` impossível com Tailwind v4 (eslint-plugin-tailwindcss v3 incompatível). Documentado.

---

## Fase 14 — Componentes primitivos ✅

**Equivalente:** Fase 04.3 antiga
**Concluída em:** 2026-04-29

**Entregue:**

- `<Heading level={1-6|"display"}>`
- `<Text variant="body|caption|label|micro|muted|mono">`
- `<StatusDot>`, `<StatusBadge>`, `<StatusBanner>`
- `<EmptyState variant="initial|filtered|error">`
- `<SkeletonVariants>` — Card, DataTable, MetricCard, ListItem
- `<KBD>`, `<Combobox>`, `<SegmentedControl>`

**Pendência endereçada nas Fases 20-22:** componentes existem mas migração de uso no codebase legado ficou incompleta (308 headings, 133 inline colors, 5 buttons exclusos).

---

## Fase 15 — 8 tipos de botão ✅

**Equivalente:** Fase 04.4 antiga (parte botões)
**Concluída em:** 2026-04-29

**Entregue:**

- 8 tipos: `Button`, `IconButton`, `LinkButton`, `AsyncActionButton`, `CopyButton`, `DangerAction`, `FloatingActionButton`, `StickyActionBar`
- 240 raw `<button>` migrados em 96 arquivos
- Regra `no-raw-button` promovida a `error`
- 5 exceções pendentes de revisão → Fase 22

---

## Fase 16 — Drawer responsivo + overlays ✅

**Equivalente:** Fase 04.4 antiga (parte overlays)
**Concluída em:** 2026-04-29

**Entregue:**

- `<ResponsiveDrawer>` — Sheet (desktop) + Vaul (mobile)
- `<DrawerWithDirtyCheck>`
- `vaul` instalado
- `<AlertDialog>`

---

## Fase 17 — Forms + inputs ✅

**Equivalente:** Fase 04.5 antiga (parte forms)
**Concluída em:** 2026-04-29

**Entregue:**

- `<FormSection>`, `<FieldGroup>`, `<FormActions>`
- 12 inputs: Input, Textarea, Select, Combobox, RadioGroup, CheckboxGroup, Switch, DatePicker, DateRangePicker, FileUpload, Slider, SegmentedControl
- Surfaces: `<Card>`, `<Panel>`, `<Tile>`

---

## Fase 18 — Data display + mobile chrome ✅

**Equivalente:** Fase 04.5 antiga (parte data + mobile)
**Concluída em:** 2026-04-29

**Entregue:**

- `<DataTable>`, `<MobileList>`, `<ListItem>`
- `<CommandPalette>` com cmdk
- `<BottomTabBar>`, `<MobileTopBar>`
- `<NotificationBanner>`

**Pendência:** CommandPalette e BottomTabBar criados mas não integrados no shell. Endereçado em fase posterior (criação de shell mobile).

---

## Fase 19 — Catálogo Ladle + VRT baseline ✅

**Equivalente:** Fase 04.6 antiga (parte governança)
**Concluída em:** 2026-04-29

**Entregue:**

- Ladle catalog — 14 stories
- Playwright VRT — 30 screenshots, CI job configurado

**Pendências da governança:**

- `no-direct-heading` ainda como warn → Fase 20
- `no-inline-style-color` ainda como warn → Fase 21
- 5 buttons excluídos sem revisão honesta → Fase 22
- Promoção final de regras pra error → Fase 23
- Conferência cruzada final → Fase 24

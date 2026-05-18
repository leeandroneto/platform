# SelectionCard API — analise dos 8 casos

## Grupo A: Onboarding steps (5 files) — dashboard theme

| File            | Layout                                 | whileTap scale | Disabled?         | Children                 |
| --------------- | -------------------------------------- | -------------- | ----------------- | ------------------------ |
| Audience.tsx    | horizontal (items-center gap-4)        | 0.98           | no                | icon-box + label + desc  |
| Nutrition.tsx   | horizontal                             | 0.98           | no                | icon-box + label + desc  |
| ServiceMode.tsx | horizontal                             | 0.98           | no                | icon-box + label + desc  |
| Modality.tsx    | vertical (flex-col items-center gap-3) | 0.96           | yes (coming soon) | icon-box + label + badge |
| Personality.tsx | vertical                               | 0.96           | yes (max reached) | icon-box + label + desc  |

**Visual comum:** `w-full rounded-xl border-2 p-4`, `border-primary bg-primary/5` (selected), `border-border bg-card` (default). Spring: stiffness 400, damping 25. Todos identicos exceto layout direction.

## Grupo B: Form primitives (3 componentes) — brand theme

| Component  | Layout                             | whileTap scale | Styling                                             |
| ---------- | ---------------------------------- | -------------- | --------------------------------------------------- |
| OptionList | horizontal (text-left, p-4 md:p-5) | 0.985          | style={{}} com --brand-\* vars + layoutId indicator |
| BigCard    | horizontal (h-12 md:h-14)          | 0.97           | style={{}} com --brand-\* vars + layoutId indicator |
| PillGroup  | inline grid (h-11 md:h-12)         | 0.94           | style={{}} com --brand-\* vars                      |

**Visual comum:** CSS custom properties (`--brand-text`, `--brand-border`, `--color-accent`), font-family Geist. Nao usam Tailwind colors.

## Grupo C: Caso borda — Focus.tsx TagPill

| Component | Layout                        | whileTap scale | Styling                                            |
| --------- | ----------------------------- | -------------- | -------------------------------------------------- |
| TagPill   | pill (rounded-full px-4 py-2) | 0.95           | Mix: Tailwind classes + style={{}} com accent vars |

## Decisao de API

Dois niveis de abstracao:

1. **`variant="card"`** (default): visual completo pra Grupo A (5 steps). Zero boilerplate no consumer.
2. **`variant="unstyled"`**: so motion + selection state pra Grupo B/C. Consumer faz todo o visual.

```tsx
type SelectionCardProps = {
  selected: boolean
  onSelect: () => void
  tapScale?: number // default 0.98; varies by use case
  children: ReactNode
} & VariantProps<typeof selectionCardVariants> &
  Omit<HTMLMotionProps<'button'>, 'onClick' | 'children' | 'whileTap'>
```

`variant="card"` + `layout="horizontal"` cobre 3/5 onboarding steps com ZERO props extras.
`variant="card"` + `layout="vertical"` + `tapScale={0.96}` cobre os 2 restantes.
`variant="unstyled"` + className/style cobre form primitives.

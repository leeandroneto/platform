# Verificacao — Fase 25

| Criterio                        | Esperado                      | Resultado           | Status |
| ------------------------------- | ----------------------------- | ------------------- | ------ |
| Tokens motion em globals.css    | 6 durations + 4 easings       | sim                 | OK     |
| `lib/design/motion.ts` criado   | durations + easings + presets | sim                 | OK     |
| MotionConfig no root            | `reducedMotion="user"`        | sim (ThemeProvider) | OK     |
| Lint                            | 0 erros                       | 0 erros             | OK     |
| TypeScript                      | 0 erros                       | 0 erros             | OK     |
| Vitest                          | 371/371                       | 371/371             | OK     |
| Build                           | passa                         | passa               | OK     |
| framer-motion imports           | 0                             | 0                   | OK     |
| easings.ts re-exporta canonical | sim                           | sim                 | OK     |

## Presets disponiveis

| Preset        | Uso                                   |
| ------------- | ------------------------------------- |
| `fadeIn`      | Elementos que aparecem (opacity 0→1)  |
| `slideUp`     | Cards, listas (y:12 + fade)           |
| `scaleIn`     | Dialogs, popovers (scale 0.95 + fade) |
| `slideDown`   | Dropdowns, tooltips (y:-8 + fade)     |
| `stagger(ms)` | Container com filhos escalonados      |
| `staggerItem` | Filho dentro de stagger container     |

## Transitions disponiveis

| Transition                | Duracao | Easing            |
| ------------------------- | ------- | ----------------- |
| `transition.fast`         | 150ms   | smooth            |
| `transition.normal`       | 250ms   | smooth            |
| `transition.slow`         | 400ms   | scene             |
| `transition.spring`       | spring  | stiff=400 damp=30 |
| `transition.springBouncy` | spring  | stiff=300 damp=20 |

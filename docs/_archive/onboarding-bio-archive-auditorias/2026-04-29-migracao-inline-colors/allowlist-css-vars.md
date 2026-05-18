# CSS vars dinâmicas (allowlist legítima)

Casos onde `style={{}}` com CSS variable é correto: cor dinâmica do profissional via brand tokens ou accent customizável.

## Onboarding steps (var(--color-accent, hsl(var(--primary))))

Estes NÃO geram warnings de lint (a regra permite `var(--*)`). São legítimos — cor vinda do tema/brand do profissional.

| Arquivo                | Linhas                      | Vars usadas                                                                           |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| Celebration.tsx        | 116                         | `var(--color-accent, hsl(var(--primary)))`                                            |
| Credentials.tsx        | 57,66,84,103                | `var(--color-accent, ...)`                                                            |
| Name.tsx               | 40                          | `var(--color-accent, ...)`                                                            |
| PricingBridge.tsx      | 47,98,141                   | `var(--color-accent, ...)`, `var(--color-accent-dim, ...)`                            |
| ProfilePreview.tsx     | 46,74,79                    | `var(--color-accent, ...)`, gradients com `hsl(var(--card))`                          |
| ReportLoading.tsx      | 40,67                       | `var(--color-accent, ...)`                                                            |
| SiteLoading.tsx        | 98,152                      | `var(--color-accent, ...)`                                                            |
| TransitionChoice.tsx   | 46,53,107                   | `var(--color-accent, ...)`, `var(--color-accent-dim, ...)`                            |
| Welcome.tsx            | 42                          | `var(--color-accent, ...)`                                                            |
| SimulationExplorer.tsx | 173-176,259-260,268,282-284 | `var(--color-accent)`, `var(--color-accent-contrast)`, `var(--color-accent-dim, ...)` |
| Focus.tsx              | 166-167,201-203,282-284     | `var(--color-accent, ...)`, `var(--color-accent-contrast, ...)`                       |
| StepFooter.tsx         | 64-66                       | `var(--color-accent, ...)`, `var(--color-accent-contrast, ...)`                       |

## Public pages (var(--brand-\*))

| Arquivo              | Linhas                      | Vars usadas                                                             |
| -------------------- | --------------------------- | ----------------------------------------------------------------------- |
| coming-soon/page.tsx | 102,220,224,242,246,312,376 | `var(--brand-accent)`, `var(--brand-border)`, `var(--brand-text-muted)` |
| FeaturesGrid.tsx     | 191,196,202,224             | `var(--brand-accent)`, `var(--brand-text)`, `var(--brand-text-muted)`   |
| TemplateSection.tsx  | 254                         | `var(--brand-bg)`                                                       |

## Nota

Cada uma dessas CSS vars é legítima: o valor é dinâmico (vem do banco/tema do profissional). Wave-04 adicionará comentário `// brand color: dinâmica do profissional` em cada linha.

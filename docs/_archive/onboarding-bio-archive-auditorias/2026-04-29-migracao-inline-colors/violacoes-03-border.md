# Violações: style borderColor / border

| Arquivo             | Linha   | Valor                                       | Migração                         |
| ------------------- | ------- | ------------------------------------------- | -------------------------------- |
| IPhoneMockup.tsx    | 25      | `borderColor: '#3a3a42'`                    | `className="border-[#3a3a42]"`   |
| CarrosselSlides.tsx | 345     | `borderColor: '#38BDF84D'`                  | `className="border-[#38BDF84D]"` |
| StorySlides.tsx     | 161     | `borderColor: '#FF7A594D'`                  | `className="border-[#FF7A594D]"` |
| CriticalPoint.tsx   | 38      | `border` com `color-mix(...#FF7A59...)`     | ref via CSS var                  |
| PricingSection.tsx  | 198     | `border` com `color-mix(...#FBBF24...)`     | ref via CSS var                  |
| SiteSection.tsx     | 189     | `border` com `color-mix(...#FBBF24...)`     | ref via CSS var                  |
| FeaturesGrid.tsx    | 212     | `border: '1px solid rgba(251,191,36,0.15)'` | custom border class              |
| AuditAnalysis.tsx   | 443,444 | `border` com `color-mix(...#d4815e...)`     | `var(--color-score-low)`         |
| AuditAnalysis.tsx   | 587     | `border` com `color-mix(...#d4815e...)`     | `var(--color-score-low)`         |
| AuditAnalysis.tsx   | 639     | `borderLeft` com `color-mix(...#d4815e...)` | `var(--color-score-low)`         |

## hsl() wrapping

| Arquivo          | Linha | Valor                      | Migração                  |
| ---------------- | ----- | -------------------------- | ------------------------- |
| ProximoPasso.tsx | 42    | `hsl(var(--accent) / 0.3)` | `border-accent/30` ou var |

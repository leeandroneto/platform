# Violações: style color (texto)

## Creatives (design-fixo → Tailwind arbitrary)

| Arquivo                          | Linha | Valor     | Migração                                               |
| -------------------------------- | ----- | --------- | ------------------------------------------------------ |
| CarrosselSlides.tsx              | 64    | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 129   | `#FF7A59` | `className="text-[#FF7A59]"`                           |
| CarrosselSlides.tsx              | 181   | `#C084FC` | `className="text-[#C084FC]"`                           |
| CarrosselSlides.tsx              | 257   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 285   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 324   | `#38BDF8` | `className="text-[#38BDF8]"`                           |
| CarrosselSlides.tsx              | 351   | `#38BDF8` | `className="text-[#38BDF8]"`                           |
| CarrosselSlides.tsx              | 391   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 398   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 412   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 426   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| CarrosselSlides.tsx              | 447   | `#0B0B0D` | `className="text-[#0B0B0D]"`                           |
| CarrosselSlides.tsx              | 454   | `#0B0B0D` | `className="text-[#0B0B0D]"`                           |
| FeedSlides.tsx                   | 53    | `#FF7A59` | `className="text-[#FF7A59]"`                           |
| FeedSlides.tsx                   | 70    | `#1A0A04` | `className="text-[#1A0A04]"`                           |
| FeedSlides.tsx                   | 77    | `#1A0A04` | `className="text-[#1A0A04]"`                           |
| FeedSlides.tsx                   | 98    | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| FeedSlides.tsx                   | 137   | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| FeedSlides.tsx                   | 162   | `#C084FC` | `className="text-[#C084FC]"`                           |
| FeedSlides.tsx                   | 191   | `#C084FC` | `className="text-[#C084FC]"`                           |
| FeedSlides.tsx                   | 213   | `#1A0A2A` | `className="text-[#1A0A2A]"`                           |
| FeedSlides.tsx                   | 219   | `#1A0A2A` | `className="text-[#1A0A2A]"`                           |
| FeedSlides.tsx                   | 242   | `#38BDF8` | `className="text-[#38BDF8]"`                           |
| FeedSlides.tsx                   | 297   | `#041422` | `className="text-[#041422]"`                           |
| FeedSlides.tsx                   | 304   | `#041422` | `className="text-[#041422]"`                           |
| StorySlides.tsx                  | 34    | `#C6FF6C` | `className="text-[#C6FF6C]"` (+ opacity via className) |
| StorySlides.tsx                  | 48    | `#C6FF6C` | `className="text-[#C6FF6C]"`                           |
| StorySlides.tsx                  | 83    | `#38BDF8` | `className="text-[#38BDF8]"`                           |
| StorySlides.tsx                  | 136   | `#FF7A59` | `className="text-[#FF7A59]"` (+ opacity via className) |
| StorySlides.tsx                  | 150   | `#FF7A59` | `className="text-[#FF7A59]"`                           |
| StorySlides.tsx                  | 166   | `#FF7A59` | `className="text-[#FF7A59]"`                           |
| SharedComponents.tsx (creatives) | 159   | `#0B0B0D` | `className="text-[#0B0B0D]"`                           |
| SharedComponents.tsx (creatives) | 167   | `#0B0B0D` | `className="text-[#0B0B0D]"`                           |

## Diagnostic activation (semântico → token)

| Arquivo              | Linha | Valor     | Migração                       |
| -------------------- | ----- | --------- | ------------------------------ |
| AddonsActivation.tsx | 100   | `#34D399` | `className="text-success"`     |
| AddonsActivation.tsx | 152   | `#34D399` | `className="text-success"`     |
| BetaGroup.tsx        | 133   | `#34D399` | `className="text-success"`     |
| CriticalPoint.tsx    | 44    | `#FF7A59` | via color-mix (ver D7)         |
| DashboardSection.tsx | 152   | `#25D366` | `className="text-whatsapp"`    |
| OfferActivation.tsx  | 104   | `#34D399` | `className="text-success"`     |
| OfferActivation.tsx  | 125   | `#FBBF24` | `className="text-warning"`     |
| PricingSection.tsx   | 124   | `#34D399` | `className="text-success"`     |
| PricingSection.tsx   | 199   | `#FBBF24` | via color-mix (ver D7)         |
| PricingSection.tsx   | 222   | `#34D399` | `className="text-success"`     |
| SiteSection.tsx      | 93    | `#34D399` | `className="text-success"`     |
| SiteSection.tsx      | 190   | `#FBBF24` | via color-mix (ver D7)         |
| TrafficSection.tsx   | 110   | `#F87171` | `className="text-destructive"` |
| TrafficSection.tsx   | 151   | `#34D399` | `className="text-success"`     |
| TrafficSection.tsx   | 181   | `#34D399` | `className="text-success"`     |

## Launch / Landing

| Arquivo                    | Linha   | Valor               | Migração                                      |
| -------------------------- | ------- | ------------------- | --------------------------------------------- |
| Pricing.tsx                | 70      | `#34D399`/`#FBBF24` | `className="text-success"` / `"text-warning"` |
| Pricing.tsx                | 78      | `#FBBF24`           | via color-mix (ver D7)                        |
| ProductPreview.tsx         | 64      | `#34D399`           | via color-mix (ver D7)                        |
| TransformationsSection.tsx | 180     | `#fff`              | `className="text-white"`                      |
| AuditAnalysis.tsx          | 594,603 | `#d4815e`           | `var(--color-score-low)`                      |
| coming-soon/page.tsx       | 313     | `#0B0B0D`           | `className="text-[#0B0B0D]"`                  |
| diagnostic/processing      | 50      | `#FF7A59`           | `className="text-[#FF7A59]"`                  |

## hsl() wrapping (→ Tailwind class)

| Arquivo   | Linha | Valor                     | Migração                       |
| --------- | ----- | ------------------------- | ------------------------------ |
| Focus.tsx | 232   | `hsl(var(--destructive))` | `className="text-destructive"` |

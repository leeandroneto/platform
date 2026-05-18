# Violações: style background / backgroundColor

## Device mockups (hardware → Tailwind arbitrary)

| Arquivo                | Linha | Valor                        | Migração                     |
| ---------------------- | ----- | ---------------------------- | ---------------------------- |
| IPhoneMockup.tsx       | 25    | `borderColor: '#3a3a42'`     | border prop (ver wave-03)    |
| IPhoneMockup.tsx       | 26    | `background: '#000'`         | `className="bg-black"`       |
| IPhoneMockup.tsx       | 33    | `background: '#000'`         | `className="bg-black"`       |
| IPhoneMockup.tsx       | 46    | `background: '#555'`         | `className="bg-[#555]"`      |
| IPhoneMockup.tsx       | 52    | `background: '#3a3a42'`      | `className="bg-[#3a3a42]"`   |
| IPhoneMockup.tsx       | 54    | `background: '#3a3a42'`      | `className="bg-[#3a3a42]"`   |
| IPhoneMockup.tsx       | 56    | `background: '#3a3a42'`      | `className="bg-[#3a3a42]"`   |
| IPhoneMockup.tsx       | 58    | `background: '#3a3a42'`      | `className="bg-[#3a3a42]"`   |
| SimulationExplorer.tsx | 156   | `background: '#141418'`      | `className="bg-section-alt"` |
| LivePreviewDevice.tsx  | 177   | `backgroundColor: '#ff5f57'` | `className="bg-[#ff5f57]"`   |
| LivePreviewDevice.tsx  | 181   | `backgroundColor: '#febc2e'` | `className="bg-[#febc2e]"`   |
| LivePreviewDevice.tsx  | 185   | `backgroundColor: '#28c840'` | `className="bg-[#28c840]"`   |
| ShowcaseFrame.tsx      | 177   | `backgroundColor: '#ff5f57'` | `className="bg-[#ff5f57]"`   |
| ShowcaseFrame.tsx      | 181   | `backgroundColor: '#febc2e'` | `className="bg-[#febc2e]"`   |
| ShowcaseFrame.tsx      | 185   | `backgroundColor: '#28c840'` | `className="bg-[#28c840]"`   |
| SiteSection.tsx        | 119   | `backgroundColor: '#15151a'` | `className="bg-[#15151a]"`   |
| SiteSection.tsx        | 122   | `backgroundColor: '#FF5F57'` | `className="bg-[#FF5F57]"`   |
| SiteSection.tsx        | 123   | `backgroundColor: '#FEBC2E'` | `className="bg-[#FEBC2E]"`   |
| SiteSection.tsx        | 124   | `backgroundColor: '#28C840'` | `className="bg-[#28C840]"`   |
| SiteSection.tsx        | 128   | `backgroundColor: '#0b0b0d'` | `className="bg-[#0b0b0d]"`   |
| DashboardSection.tsx   | 135   | `backgroundColor: '#0f0f12'` | `className="bg-[#0f0f12]"`   |
| DashboardSection.tsx   | 139   | `backgroundColor: '#25D366'` | `className="bg-whatsapp"`    |

## Creatives (design-fixo → Tailwind arbitrary)

| Arquivo                         | Linha | Valor                                             | Migração                     |
| ------------------------------- | ----- | ------------------------------------------------- | ---------------------------- |
| CarrosselSlides.tsx             | 128   | `backgroundColor: '#FF7A591A'`                    | `className="bg-[#FF7A591A]"` |
| CarrosselSlides.tsx             | 279   | `backgroundColor: '#C6FF6C1A'`                    | `className="bg-[#C6FF6C1A]"` |
| CarrosselSlides.tsx             | 344   | `backgroundColor: '#38BDF80F'`                    | `className="bg-[#38BDF80F]"` |
| CarrosselSlides.tsx             | 442   | `backgroundColor: '#C6FF6C'`                      | `className="bg-[#C6FF6C]"`   |
| FeedSlides.tsx                  | 66    | `backgroundColor: '#FF7A59'`                      | `className="bg-[#FF7A59]"`   |
| FeedSlides.tsx                  | 208   | `backgroundColor: '#C084FC'`                      | `className="bg-[#C084FC]"`   |
| FeedSlides.tsx                  | 293   | `backgroundColor: '#38BDF8'`                      | `className="bg-[#38BDF8]"`   |
| StorySlides.tsx                 | 160   | `backgroundColor: '#FF7A590F'`                    | `className="bg-[#FF7A590F]"` |
| SharedComponents.tsx (carousel) | 42-49 | `#FF7A59`/`#C084FC`/`#C6FF6C`/`#38BDF8`/`#FBBF24` | refactor ternary chain       |
| coming-soon/page.tsx            | 108   | `background: '#C084FC'`                           | `className="bg-[#C084FC]"`   |

## Semantic (→ token)

| Arquivo          | Linha | Valor                        | Migração                   |
| ---------------- | ----- | ---------------------------- | -------------------------- |
| FeaturesGrid.tsx | 219   | `backgroundColor: '#FBD23C'` | `className="bg-[#FBD23C]"` |

## hsl() wrapping (→ Tailwind class)

| Arquivo        | Linha | Valor               | Migração               |
| -------------- | ----- | ------------------- | ---------------------- |
| StepFooter.tsx | 69    | `hsl(var(--muted))` | `className="bg-muted"` |

## color-mix() com hex (→ CSS var ref)

| Arquivo                    | Linha   | Hex dentro | Migração                   |
| -------------------------- | ------- | ---------- | -------------------------- |
| CriticalPoint.tsx          | 37      | `#FF7A59`  | ref via CSS var            |
| CriticalPoint.tsx          | 41      | `#FF7A59`  | `className="bg-[#FF7A59]"` |
| PricingSection.tsx         | 197     | `#FBBF24`  | ref via CSS var            |
| SiteSection.tsx            | 188     | `#FBBF24`  | ref via CSS var            |
| ProductPreview.tsx         | 63      | `#34D399`  | ref via CSS var            |
| TransformationsSection.tsx | 179     | `#000`     | `bg-black/60`              |
| AuditAnalysis.tsx          | 104     | `#9b8fd4`  | CSS var                    |
| AuditAnalysis.tsx          | 442,586 | `#d4815e`  | `var(--color-score-low)`   |

## rgba() overlays (→ Tailwind opacity)

| Arquivo                 | Linha | Valor                    | Migração                                        |
| ----------------------- | ----- | ------------------------ | ----------------------------------------------- |
| coming-soon/page.tsx    | 213   | `rgba(20,20,24,0.4)`     | `className="bg-[rgba(20,20,24,0.4)]"` ou custom |
| coming-soon/page.tsx    | 265   | `rgba(20,20,24,0.6)`     | similar                                         |
| coming-soon/page.tsx    | 319   | `rgba(255,255,255,0.4)`  | `className="bg-white/40"`                       |
| coming-soon/page.tsx    | 369   | `rgba(20,20,24,0.4)`     | similar                                         |
| FeaturesGrid.tsx        | 189   | `rgba(198,255,108,0.12)` | `className="bg-[rgba(198,255,108,0.12)]"`       |
| FeaturesGrid.tsx        | 211   | `rgba(251,191,36,0.05)`  | `className="bg-[rgba(251,191,36,0.05)]"`        |
| FeaturesGrid.tsx        | 217   | `rgba(251,191,36,0.12)`  | `className="bg-[rgba(251,191,36,0.12)]"`        |
| Nav.tsx                 | 285   | `rgba(0,0,0,0.5)`        | `className="bg-black/50"`                       |
| PremiumTestimonials.tsx | 98    | `rgba(255,255,255,0.02)` | `className="bg-white/[0.02]"`                   |
| PremiumTestimonials.tsx | 334   | `rgba(255,255,255,0.05)` | `className="bg-white/5"`                        |
| PremiumTestimonials.tsx | 369   | `rgba(255,255,255,0.05)` | `className="bg-white/5"`                        |
| TemplateSection.tsx     | 244   | `rgba(0,0,0,0.75)`       | `className="bg-black/75"`                       |
| TestimonialManager.tsx  | 165   | `rgba(255,255,255,0.05)` | `className="bg-white/5"`                        |
| plans/pro/page.tsx      | 181   | `rgba(198,255,108,0.15)` | `className="bg-[rgba(198,255,108,0.15)]"`       |

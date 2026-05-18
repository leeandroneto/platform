# Verificação — Fase 21: migração de inline colors

| Critério                      | Esperado      | Resultado                                    | Status |
| ----------------------------- | ------------- | -------------------------------------------- | ------ |
| style com hex inline          | 0             | 0                                            | ✅     |
| style com rgb/hsl inline      | 0             | 0 (1 em Walkthrough.tsx fora do escopo lint) | ✅     |
| style com background hex      | 0             | 0                                            | ✅     |
| style com borderColor hex     | 0             | 0                                            | ✅     |
| Lint warnings de inline color | 0             | 0                                            | ✅     |
| Lint total                    | 0 erros       | 0 erros (1 warning pré-existente .ladle)     | ✅     |
| TypeScript                    | 0 erros       | 0 erros                                      | ✅     |
| Vitest                        | tudo verde    | 371/371                                      | ✅     |
| Build                         | passa         | sim                                          | ✅     |
| Regra promovida               | NÃO (Fase 23) | não                                          | ✅     |

## Exceções documentadas

1. `app/global-error.tsx` — eslint-disable block. Razão: fallback de último recurso onde Tailwind CSS pode não estar carregado; inline colors são intencionais.
2. `components/ui/Walkthrough.tsx:128` — `rgba(0,0,0,0.55)` não gera warning lint (fora do escopo da regra). Não migrado.

## Tokens semânticos criados

- `--color-success` → `var(--ob-success-400)` (verde, substitui #34D399)
- `--color-warning` → `var(--ob-warning-400)` (âmbar, substitui #FBBF24)
- `--color-whatsapp` → `#25D366`
- `--color-score-high` → `#5cbf9b`
- `--color-score-mid` → `#c9a84c`
- `--color-score-low` → `#d4815e`
- `--color-score-info` → `#6baed4`
- `--color-score-accent` → `#9b8fd4`

## Arquivos modificados (35 total)

### globals.css (tokens)

- `app/globals.css` — adicionados 8 tokens semânticos

### Onboarding (5 arquivos)

- `app/(app)/onboarding/_components/StepFooter.tsx`
- `app/(app)/onboarding/_steps/Focus.tsx`
- `app/(app)/onboarding/_steps/SimulationExplorer.tsx`
- `app/(app)/onboarding/_steps/_simulation/IPhoneMockup.tsx`
- `app/(app)/onboarding/_steps/_simulation/SimulationTabs.tsx`

### Creatives/Carousel (5 arquivos)

- `app/(public)/creatives/_sections/CarrosselSlides.tsx`
- `app/(public)/creatives/_sections/FeedSlides.tsx`
- `app/(public)/creatives/_sections/SharedComponents.tsx`
- `app/(public)/creatives/_sections/StorySlides.tsx`
- `app/(public)/carousel/_sections/SharedComponents.tsx`

### Public pages (3 arquivos)

- `app/(public)/coming-soon/page.tsx`
- `app/(public)/diagnostic/processing/page.tsx`
- `app/(public)/plans/pro/page.tsx`

### Diagnostic activation (9 arquivos)

- `components/diagnostic-activation/_sections/AddonsActivation.tsx`
- `components/diagnostic-activation/_sections/BetaGroup.tsx`
- `components/diagnostic-activation/_sections/CriticalPoint.tsx`
- `components/diagnostic-activation/_sections/DashboardSection.tsx`
- `components/diagnostic-activation/_sections/OfferActivation.tsx`
- `components/diagnostic-activation/_sections/PricingSection.tsx`
- `components/diagnostic-activation/_sections/SiteSection.tsx`
- `components/diagnostic-activation/_sections/TemplateSection.tsx`
- `components/diagnostic-activation/_sections/TrafficSection.tsx`

### Landing/Launch (7 arquivos)

- `components/landing/onboarding/FeaturesGrid.tsx`
- `components/landing/onboarding/LivePreviewDevice.tsx`
- `components/landing/onboarding/Nav.tsx`
- `components/landing/onboarding/ShowcaseFrame.tsx`
- `components/landing/premium/sections/PremiumTestimonials.tsx`
- `components/landing/sections/TransformationsSection.tsx`
- `components/launch/_sections/Pricing.tsx`
- `components/launch/_sections/ProductPreview.tsx`

### Report/Testimonials (2 arquivos)

- `components/report/audit/AuditAnalysis.tsx`
- `components/testimonials/TestimonialManager.tsx`

### Demo (1 arquivo)

- `app/demo/logos/page.tsx`

### Error boundary (1 arquivo)

- `app/global-error.tsx`

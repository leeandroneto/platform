# Auditoria: migração de inline style colors

**Data:** 2026-04-29
**Fase:** 21

## Estado inicial

- 127 violações de `no-restricted-syntax` (inline color warnings)
- Regra NÃO promovida a error (Fase 23 cuida)

## Categorias auditadas

1. `style={{ color: '#hex' }}` — texto (ver violacoes-01-color.md)
2. `style={{ background/backgroundColor: '#hex' }}` — fundo (ver violacoes-02-background.md)
3. `style={{ borderColor: '#hex' }}` — borda (ver violacoes-03-border.md)
4. `rgb()/rgba()/hsl()` inline (ver violacoes-04-rgb-hsl.md)
5. CSS vars dinâmicas legítimas (ver allowlist-css-vars.md)

## Arquivos afetados (33 total)

### Onboarding

- `app/(app)/onboarding/_components/StepFooter.tsx` — 2 (hsl)
- `app/(app)/onboarding/_steps/Focus.tsx` — 1 (hsl)
- `app/(app)/onboarding/_steps/SimulationExplorer.tsx` — 1 (hex)
- `app/(app)/onboarding/_steps/_simulation/IPhoneMockup.tsx` — 8 (hex)
- `app/(app)/onboarding/_steps/_simulation/ProximoPasso.tsx` — 1 (hsl)

### Creatives / Carousel

- `app/(public)/creatives/_sections/CarrosselSlides.tsx` — 18 (hex)
- `app/(public)/creatives/_sections/FeedSlides.tsx` — 15 (hex)
- `app/(public)/creatives/_sections/SharedComponents.tsx` — 2 (hex)
- `app/(public)/creatives/_sections/StorySlides.tsx` — 8 (hex)
- `app/(public)/carousel/_sections/SharedComponents.tsx` — 5 (hex)

### Public pages

- `app/(public)/coming-soon/page.tsx` — 6 (hex + rgba)
- `app/(public)/diagnostic/processing/page.tsx` — 1 (hex)
- `app/(public)/plans/pro/page.tsx` — 1 (rgba)

### Diagnostic activation

- `components/diagnostic-activation/_sections/AddonsActivation.tsx` — 2
- `components/diagnostic-activation/_sections/BetaGroup.tsx` — 1
- `components/diagnostic-activation/_sections/CriticalPoint.tsx` — 2
- `components/diagnostic-activation/_sections/DashboardSection.tsx` — 3
- `components/diagnostic-activation/_sections/OfferActivation.tsx` — 2
- `components/diagnostic-activation/_sections/PricingSection.tsx` — 3
- `components/diagnostic-activation/_sections/SiteSection.tsx` — 7
- `components/diagnostic-activation/_sections/TemplateSection.tsx` — 1
- `components/diagnostic-activation/_sections/TrafficSection.tsx` — 3

### Landing / Launch

- `components/landing/onboarding/FeaturesGrid.tsx` — 4
- `components/landing/onboarding/LivePreviewDevice.tsx` — 3
- `components/landing/onboarding/Nav.tsx` — 1
- `components/landing/onboarding/ShowcaseFrame.tsx` — 3
- `components/landing/premium/sections/PremiumTestimonials.tsx` — 3
- `components/landing/sections/TransformationsSection.tsx` — 1
- `components/launch/_sections/Pricing.tsx` — 4
- `components/launch/_sections/ProductPreview.tsx` — 1

### Report / Testimonials

- `components/report/audit/AuditAnalysis.tsx` — 2
- `components/testimonials/TestimonialManager.tsx` — 1

### Demo

- `app/demo/logos/page.tsx` — 12

## Tokens semânticos criados nesta fase

| Token              | Valor                   | Uso                              |
| ------------------ | ----------------------- | -------------------------------- |
| `--color-success`  | `var(--ob-success-400)` | Check marks, positive indicators |
| `--color-warning`  | `var(--ob-warning-400)` | Caution, "em breve", roadmap     |
| `--color-whatsapp` | `#25D366`               | Brand color WhatsApp             |

## Decisões

Ver `decisions.md` para casos delicados.

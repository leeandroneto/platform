# Violações: rgb()/rgba()/hsl() em style={{}}

Coberto em violacoes-01 e violacoes-02 por categoria de propriedade CSS.

## Resumo por tipo

### hsl() wrapping CSS vars (3 ocorrências)

- StepFooter.tsx:69 — `hsl(var(--muted))` → `bg-muted`
- StepFooter.tsx:70 — `hsl(var(--muted-foreground))` → `text-muted-foreground`
- Focus.tsx:232 — `hsl(var(--destructive))` → `text-destructive`
- ProximoPasso.tsx:42 — `hsl(var(--accent) / 0.3)` → border token

### rgba() overlays (14 ocorrências)

- coming-soon/page.tsx — 4 ocorrências (backdrops, surfaces)
- FeaturesGrid.tsx — 3 ocorrências (notification mock)
- Nav.tsx — 1 ocorrência (backdrop mobile)
- PremiumTestimonials.tsx — 3 ocorrências (card bg, buttons)
- TemplateSection.tsx — 1 ocorrência (modal backdrop)
- TestimonialManager.tsx — 1 ocorrência (button bg)
- plans/pro/page.tsx — 1 ocorrência (badge bg)

### Gradients com rgba() (2 ocorrências — ver D8)

- coming-soon/page.tsx:116 — radial-gradient com `rgba(11,11,13,0.6)`
- coming-soon/page.tsx:259 — linear-gradient com `rgba(198,255,108,0.04)`

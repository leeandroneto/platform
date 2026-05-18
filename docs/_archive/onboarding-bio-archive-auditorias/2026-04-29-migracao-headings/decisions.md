# Decisões de migração

## Padrões recorrentes decididos

### D1: Page titles → `<Heading level={1}>`

Todos os `<h1>` em pages são títulos de página. Migrados 1:1 preservando className.

### D2: Section eyebrows (dashboard) → `<Heading level={2}>`

Pattern `<h2 className="text-xs uppercase tracking-widest text-muted-foreground">` é um heading semântico mesmo sendo visualmente pequeno. Divide seções da dashboard.

### D3: Legal pages inside prose → `<Heading level={2/3}>`

Headings dentro do `<article className="prose ...">` de LegalShell. Prose container estiliza via `[&>h2]` selectors com specificidade superior ao Heading component. Visual preservado.

### D4: Mock device screens → `<Text as="div">`

Conteúdo dentro de MockPhone/MockDesktop/WizardMock frames é decorativo — não faz parte da hierarquia da página. Screen reader não deve navegar por eles.

### D5: Card labels/alert titles → `<Text as="div">`

DashboardEmptyState, SubscriptionStatusCard, DunningSection, action labels em CRUD lists. Font-semibold/font-medium preservado no className.

### D6: Hierarchy fixes

- plans/setup: h4 FAQ questions → Heading level={3} (corrigido pulo h2→h4)
- plans/setup: h3 bottom CTA → Heading level={2} (era top-level section)
- ProximoPassoTab: h4 → Heading level={3} (corrigido pulo)

### D7: `dangerouslySetInnerHTML` em HeroSection

Heading `children` tornado opcional para suportar padrão `dangerouslySetInnerHTML`. Mudança backward-compatible.

### D8: Heading `font-semibold` drop

Heading component adiciona `font-semibold` via CVA. Ao migrar, `font-semibold` foi removido do className para evitar duplicação. `font-bold` e `font-medium` preservados quando diferentes.

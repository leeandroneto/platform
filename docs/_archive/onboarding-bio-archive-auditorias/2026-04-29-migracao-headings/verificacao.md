# Verificacao — Fase 20

**Data:** 2026-04-29

## Checklist principal

| Criterio                                  | Esperado      | Resultado           | Status |
| ----------------------------------------- | ------------- | ------------------- | ------ |
| `<h1>`-`<h6>` diretos fora de heading.tsx | 0             | 0                   | OK     |
| Lint warnings de no-direct-heading        | 0             | 0                   | OK     |
| Regra promovida a error no config         | nao (Fase 23) | nao                 | OK     |
| TypeScript                                | 0 erros       | 0 erros             | OK     |
| Vitest                                    | tudo verde    | 371/371 (44 suites) | OK     |
| Build                                     | passa         | passa               | OK     |

## Contagem cravada

`git show HEAD --pretty=format: -- '*.tsx' '*.ts' | grep -cE "^-.*<h[1-6]"` → **309 linhas removidas, 0 adicionadas.**

A estimativa original era 308 violacoes. O diff mostra 309 linhas com `<h[1-6]` removidas (1 extra e closing tag capturado pelo padrao). Nenhuma raw heading permanece — confirmado por grep (0) e lint AST (0).

## Outline check — hierarquia semantica

| Pagina                             | h1 unico? | Hierarquia coerente? | Status |
| ---------------------------------- | --------- | -------------------- | ------ |
| `/` (coming-soon, redirect atual)  | Sim (1)   | Sim (so h1)          | OK     |
| `/landing-full` (landing completa) | Sim (1)   | Sim (h1→h2→h3)       | OK     |
| `/dashboard`                       | Sim (1)   | Sim (h1→h2)          | OK     |
| `/{slug}` (page links)             | Sim (1)   | Sim (so h1)          | OK     |
| `/r/{token}` (relatorio)           | Sim (1)   | Sim (h1→h2→h3)       | OK     |

**Flag menor:** HeroSection.tsx do relatorio usa `<TextReveal as="h1">` — funciona (renderiza h1 correto) mas bypassa o componente Heading. Aceitavel porque TextReveal e componente de motion que precisa controlar a tag. Lint nao flagga porque nao e `<h1>` literal.

## Decisoes semanticas tomadas

### `<Heading>` (headings semanticos — outline da pagina)

- Page titles (h1): todos os titulos de pagina do dashboard, admin, public, legal
- Section headings (h2): divisores de secao em dashboard, secoes de landing, FAQ titles
- Subsection headings (h3): steps de formulario, pilares do relatorio, FAQ questions
- Hierarchy fixes: h4 FAQ questions → Heading level={3} (corrigido pulo h2→h4)

### `<Text as="div">` (texto decorativo — sem hierarquia de pagina)

- Mock device screens (MockPhone, MockDesktop frames) — conteudo decorativo
- Card titles em listas (DashboardEmptyState, SubscriptionStatusCard, DunningSection)
- Action labels (AssessmentList, ClientPlanSection, TransformationEditor, WorkoutEditor)
- Tour/walkthrough popover titles (EditorTour, Walkthrough)
- Preview card titles (ReportPreview, OptionBrowser)
- Storyboard mock wizard questions (Ato2Jornada — 7 screens)
- Footer column titles
- FeaturesGrid card h3 titles

### Caso especial: `dangerouslySetInnerHTML`

- `HeroSection.tsx`: Heading `children` foi tornado opcional para suportar `dangerouslySetInnerHTML`
- Mudanca minima e backward-compatible no componente

## Sobre a regra

A regra `no-direct-heading` (via `no-restricted-syntax`) permanece como `warn`.
**NAO promover a error** nesta fase — a Fase 23 promove o bloco inteiro de no-restricted-syntax junto (headings + colors + buttons).

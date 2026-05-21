# 11 — Variability Matrix (Layer A fixed vs Layer B varia per archetype)

> Síntese cross-tópico. Pra decisão concreta: **se algo é Layer A → não negociar per archetype; se Layer B → archetype controla via tokens.**

## Princípio

**Layer A (Structural)** governa **comportamento** + **structural geometry** + **a11y floor**. Quebra muscle-memory / a11y / cross-device parity se permitido variar.

**Layer B (Stylistic)** governa **cor**, **forma**, **timing**, **typography**, **density modifiers**. É o canal único pelo qual archetype expressa-se no PWA aluno.

## Matriz completa

| Pattern          | Atributo                                                   | Layer | Valor canônico desafit               |
| ---------------- | ---------------------------------------------------------- | ----- | ------------------------------------ |
| **Bottom nav**   | Height container                                           | A     | 64dp + `env(safe-area-inset-bottom)` |
|                  | Position (sticky bottom)                                   | A     | Fixo                                 |
|                  | Max destinations                                           | A     | 4                                    |
|                  | Touch target floor                                         | A     | 48px per item                        |
|                  | Active color                                               | B     | `--accent` tenant                    |
|                  | Active indicator (pill/underline/cor)                      | B     | Per archetype                        |
|                  | Icon style (filled/outline)                                | B     | Per archetype                        |
|                  | Label typography                                           | B     | Type scale archetype                 |
|                  | Border-top treatment                                       | B     | Per archetype                        |
| **Bottom sheet** | Snap points (0.5 / 0.95)                                   | A     | Fixo                                 |
|                  | Drag handle presença                                       | A     | Visible sempre                       |
|                  | Drag-down dismiss + 25% threshold                          | A     | Fixo                                 |
|                  | Velocity dismiss ~1000 px/s                                | A     | Fixo                                 |
|                  | Scrim opacity (30%)                                        | A     | Fixo                                 |
|                  | `padding-bottom: safe-area-inset-bottom`                   | A     | Fixo                                 |
|                  | Background color                                           | B     | `--surface-elevated`                 |
|                  | Top corner radius                                          | B     | Per archetype (0–32px)               |
|                  | Drag handle color                                          | B     | Per archetype                        |
|                  | Motion entry timing                                        | B     | 300–450ms per archetype              |
|                  | Frost glass background                                     | B     | Opt-in per archetype                 |
| **FAB**          | Presença (sim/não)                                         | A\*   | Default NO; opt-in per screen        |
|                  | Position bottom-right + offset                             | A     | Se usar                              |
|                  | Size 56dp regular                                          | A     | Se usar                              |
|                  | Single primary action principle                            | A     | Conceito                             |
|                  | Background color                                           | B     | `--accent`                           |
|                  | Shape (circle/squircle/square)                             | B     | Per archetype                        |
|                  | Shadow elevation                                           | B     | Per archetype                        |
|                  | Extended (com label)                                       | B     | Per screen                           |
| **Top bar**      | Height compact (48dp)                                      | A     | Floor                                |
|                  | `padding-top: safe-area-inset-top`                         | A     | Fixo                                 |
|                  | Sticky top + z-30                                          | A     | Fixo                                 |
|                  | Back affordance leading                                    | A     | A11y                                 |
|                  | Title alignment (center/left)                              | B     | Per archetype                        |
|                  | Background (sólido/blur/transparent)                       | B     | Per archetype                        |
|                  | Border-bottom treatment                                    | B     | Per archetype                        |
|                  | Large-title variant opt-in                                 | B     | Per screen + archetype               |
|                  | Title typography                                           | B     | Type scale archetype                 |
| **Safe area**    | `viewport-fit=cover`                                       | A     | Fixo                                 |
|                  | `env(safe-area-inset-*)` em todo chrome                    | A     | Fixo                                 |
|                  | `apple-mobile-web-app-status-bar-style: black-translucent` | A     | Default                              |
|                  | Background sob status bar                                  | B     | Tenant `--surface-base`              |
|                  | theme-color meta                                           | B     | Tenant cor                           |
| **Touch**        | Floor 48×48px                                              | A     | Universal                            |
|                  | Spacing 8px entre targets                                  | A     | Floor                                |
|                  | `-webkit-tap-highlight-color: transparent`                 | A     | Global                               |
|                  | `touch-action: manipulation` em buttons                    | A     | Mata 300ms delay                     |
|                  | Visual icon size (20/24/28px)                              | B     | Per archetype                        |
|                  | `:active` state (color/scale/ripple)                       | B     | Per archetype                        |
|                  | Button border-radius                                       | B     | Per archetype                        |
| **Gestures**     | Swipe dismiss threshold (25%)                              | A     | Material canon                       |
|                  | Velocity threshold (~1000 px/s)                            | A     | Fixo                                 |
|                  | Pull-to-refresh suppressed default                         | A     | Custom adiável                       |
|                  | `overscroll-behavior-y: contain` em sheets/main            | A     | Fixo                                 |
|                  | Active feedback duration                                   | B     | Material 300ms vs iOS instant        |
|                  | Swipe reveal background color                              | B     | Per archetype (destructive tone)     |
| **App shell**    | Composição (TopBar + BottomNav fixos)                      | A     | Estrutural                           |
|                  | Cache strategies (CacheFirst shell, NetworkFirst API)      | A     | Tier-1                               |
|                  | Skeleton > spinner default                                 | A     | Perceived-perf                       |
|                  | Sub-1s first paint target                                  | A     | Performance                          |
|                  | Skeleton background color                                  | B     | `--surface-muted`                    |
|                  | Skeleton radius                                            | B     | Per archetype                        |
|                  | Skeleton animation (pulse/shimmer/static)                  | B     | Per archetype                        |
|                  | Splash bg + logo                                           | B     | Tenant                               |
| **PWA manifest** | `display: standalone`                                      | A     | Fixo                                 |
|                  | `viewport-fit=cover`                                       | A     | Fixo                                 |
|                  | Install patterns 3-flows                                   | A     | Platform                             |
|                  | `theme_color`                                              | B     | Tenant                               |
|                  | `background_color` (splash)                                | B     | Tenant                               |
|                  | Icons (any + maskable)                                     | B     | Tenant                               |
|                  | `name` / `short_name`                                      | B     | Tenant                               |
| **Premium feel** | Motion FLOOR (200ms standard, 300ms sheet)                 | A     | Floor não-negociável                 |
|                  | `prefers-reduced-motion` honra                             | A     | A11y                                 |
|                  | Haptic vocabulary (tap/success/error)                      | A     | Semantic                             |
|                  | `rem`-based typography                                     | A     | Browser zoom respect                 |
|                  | Frost glass opt-in                                         | B     | Per archetype                        |
|                  | Blur radius (12–24px)                                      | B     | Per archetype                        |
|                  | Motion duration CEILING                                    | B     | Per archetype                        |
|                  | Easing curve (standard/emphasized/spring)                  | B     | Per archetype personality            |
|                  | Corner geometry (squircle/circle/squared)                  | B     | Per archetype                        |

\*FAB: Layer A em comportamento se usado; presença é decisão produto/archetype.

## Como Layer B é entregue (preview)

Cada archetype define **18 tokens leves do PWA aluno** (subconjunto dos 60+ tokens do site). Tokens herdam tenant palette + archetype scale. Não é estrutural, é "skin" sobre Layer A imutável:

```css
/* PWA aluno root, post-archetype-resolve */
:root[data-archetype='cafe-premium'] {
  --pwa-corner-md: 16px;
  --pwa-corner-lg: 24px;
  --pwa-frost-blur: 20px;
  --pwa-frost-saturate: 180%;
  --pwa-frost-enabled: 1;
  --pwa-motion-sheet-enter: 450ms;
  --pwa-motion-easing-sheet: cubic-bezier(0.05, 0.7, 0.1, 1);
  --pwa-icon-stroke: 1.5;
}
:root[data-archetype='brutalist'] {
  --pwa-corner-md: 0px;
  --pwa-corner-lg: 0px;
  --pwa-frost-blur: 0px;
  --pwa-frost-enabled: 0;
  --pwa-motion-sheet-enter: 200ms;
  --pwa-motion-easing-sheet: linear;
  --pwa-icon-stroke: 2.5;
}
```

(Tokens são exemplificativos — definição definitiva vai em Passo 3 do plano.)

## Implicação para Passos 3+ do `14-transformation-plan.md`

- **Passo 3 (Token Contracts):** definir contracts pra Layer B SOMENTE. Layer A NÃO é token; é hard-coded em componentes (`app-bottom-nav.tsx`, `app-sheet.tsx`, etc.).
- **Passo 4 (Component Wrappers):** wrappers do PWA aluno são "single canónico" — `<AppBottomNav>`, `<AppSheet>`, `<AppTopBar>`, `<AppFab>` (opcional). NÃO há variant per archetype para componentes do aluno (vs site, que tem 18 archetypes).
- **Passo 5 (Archetype palette resolve):** o archetype escolhido pelo tenant injeta APENAS Layer B tokens no PWA aluno via `data-archetype="..."` no root.
- **ADR-0040 (PWA aluno):** este corpus é referência canônica.

## Casos de borda / decisões ainda em aberto

| Caso                              | Status                                                                   |
| --------------------------------- | ------------------------------------------------------------------------ |
| FAB no Comunidade screen          | Adiar — re-avaliar quando feed implementado                              |
| Pull-to-refresh custom            | Adiar MVP+1; usar refresh button explícito inicial                       |
| Large-title top bar               | Adiar; usar compact-only inicialmente                                    |
| Standard (non-modal) bottom sheet | Adiar; modal-only inicialmente                                           |
| iOS splash matrix completo        | Iterativo; começar com 3 devices principais                              |
| Frost glass perf em listas        | Investigar quando archetype Premium for ativado em dispositivo lower-end |

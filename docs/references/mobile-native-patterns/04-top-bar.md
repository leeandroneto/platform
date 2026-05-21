# 04 — Top Bar (Navigation Bar / App Bar)

> **Canon source:** Apple HIG · Navigation Bars · Material Design 3 · Top App Bar

## Canon

**Apple HIG (Navigation Bar):**

> "A navigation bar appears at the top of an app screen, below the status bar, and enables navigation through a series of hierarchical screens."

- Title centered (compact title) ou large (left-aligned, collapsível on scroll)
- Back button leading, leading-icon "<" + previous-screen-label (PT-BR via `t()`)
- Trailing: 1–2 actions (mais que isso → overflow "···")

**Material 3 (Top App Bar variants):**

> "Top app bars display navigation, actions, and text at the top of a screen. There are four variants: center-aligned, small, medium, and large."

| Variante M3     | Height                              |
| --------------- | ----------------------------------- |
| Small (default) | 64dp                                |
| Center-aligned  | 64dp                                |
| Medium          | 112dp (collapses to 64dp on scroll) |
| Large           | 152dp (collapses to 64dp on scroll) |

iOS large-title equivalence: ~96pt expanded, ~44pt collapsed (incl. status bar variável 20/44/59pt).

## Specs numéricas

| Spec                          | iOS Navigation Bar                               | Material 3 Top App Bar          |
| ----------------------------- | ------------------------------------------------ | ------------------------------- |
| Height (compact)              | 44pt excl. status bar                            | 64dp incl. content              |
| Height (large title expanded) | ~52pt extra (~96pt total)                        | 112dp (medium) / 152dp (large)  |
| Status bar height             | 20pt non-notch, 44pt notch, ~59pt Dynamic Island | Handled via safe-area-inset-top |
| Title align                   | Center (default) ou large-left                   | Center-aligned OU small-left    |
| Back affordance               | "< Back" (iOS)                                   | Arrow icon 24dp leading         |
| Max trailing actions          | 1–2 (Apple recommendation)                       | 2 + overflow                    |

## Sticky vs scroll-collapse

- **Sticky compact** (default for both): top bar permanece visível durante scroll, sem mudança
- **Scroll-collapse** (iOS large titles + Material medium/large): expanded até primeiro scroll, collapse pra compact height; reverte quando scroll volta ao topo

## Status bar interaction (CRÍTICO pra PWA)

| Modo                  | iOS Safari standalone                                                                             | Material/Android           |
| --------------------- | ------------------------------------------------------------------------------------------------- | -------------------------- |
| **default**           | Status bar texto/ícones cinza, sobre fundo do app                                                 | N/A                        |
| **black**             | Status bar preta (texto branco), apparently overrides theme-color                                 | N/A                        |
| **black-translucent** | Status bar transparente, conteúdo passa por baixo — exige `padding-top: env(safe-area-inset-top)` | N/A                        |
| **theme-color meta**  | Ignorado em iOS standalone (usa `apple-mobile-web-app-status-bar-style`)                          | Android: cor da status bar |

Em desafit PWA aluno: `apple-mobile-web-app-status-bar-style="black-translucent"` + theme-color tenant-aware. Top bar absorve a status bar via padding-top safe-area.

## Implicação desafit

```tsx
// components/student/AppTopBar.tsx (Layer A — fixo)
<header
  className="
  sticky top-0 z-30
  pt-[env(safe-area-inset-top)]                        /* absorve status bar */
  bg-[--surface-base]/95 backdrop-blur-sm              /* Layer B opt-in */
  border-b border-[--border]
"
>
  <div
    className="
    h-12                                                /* 48dp compact — floor seguro */
    px-4
    grid grid-cols-[auto_1fr_auto] items-center gap-2
  "
  >
    {showBack && <BackButton aria-label={t('common.back')} />}
    <h1 className="text-center font-medium truncate">{title}</h1>
    {actions}
  </div>
</header>
```

**Floor escolhido:** 48dp compact (entre iOS 44pt e Material 64dp; cabe `<h1>` legível + back). Large-title variant adiável.

**Status bar:** absorvida via `padding-top: env(safe-area-inset-top)` + `apple-mobile-web-app-status-bar-style="black-translucent"`.

## Layer B varia per archetype

| Atributo                                                   | Varia?   | Notas                                                         |
| ---------------------------------------------------------- | -------- | ------------------------------------------------------------- |
| Height (48dp compact)                                      | ❌ FIXO  | Cross-archetype consistency                                   |
| `padding-top: env(safe-area-inset-top)`                    | ❌ FIXO  | Sempre presente                                               |
| Sticky top + z-30                                          | ❌ FIXO  |                                                               |
| Back affordance leading                                    | ❌ FIXO  | Mapping gesto + a11y                                          |
| **Title alignment** (center vs left)                       | ✅ VARIA | iOS-canon = center; Material = left-small/center-large        |
| **Background** (sólido vs blur vs gradient vs transparent) | ✅ VARIA | Frost-glass opt-in per archetype                              |
| **Border-bottom** (1px vs sombra vs nada)                  | ✅ VARIA | Editorial = 1px; Premium = sombra; Brutalist = thick border   |
| **Large-title variant**                                    | ✅ VARIA | Opt-in per screen + archetype (Editorial gosta de big titles) |
| **Title typography**                                       | ✅ VARIA | Herda type scale                                              |

## Fontes

- Apple HIG Navigation Bars: <https://developer.apple.com/design/human-interface-guidelines/navigation-bars>
- Material 3 Top App Bars guidelines: <https://m3.material.io/components/app-bars/guidelines>
- Material 3 Top App Bar specs: <https://m3.material.io/components/top-app-bar/specs>
- Status bar height variability: <https://developer.apple.com/forums/thread/662466>

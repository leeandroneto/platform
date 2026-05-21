# 10 — Native-App Feel Premium

> **Canon source:** Apple HIG · Materials/Liquid Glass · Material 3 · Motion · MDN Vibration API · web.dev animations

## Frosted glass / backdrop-filter

**Apple canon (Materials → Liquid Glass WWDC25):**
Apple introduziu **Liquid Glass** em WWDC25 — material system-wide com blur + refraction + tint. Antes disso, "vibrancy materials" em iOS (`UIBlurEffect`) já era padrão pra nav bars, sheets, modals.

**Web equivalent:**

```css
.frost-glass {
  background: color-mix(in oklch, var(--surface-elevated) 70%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

**Recommended values:**

- Blur radius: **12–24px** typical (Apple Materials Thin = ~10, Regular = ~20, Thick = ~40)
- Saturate: **150–180%** amplifica cor sob o blur (Apple-canónico)
- Background alpha: **60–80%** (não 100% — perde efeito; não <50% — perde contraste)

**Performance:** `backdrop-filter` é GPU-intensive. Em scroll containers + listas longas → degrade. Limitar a chrome elements (top bar, bottom nav, sheet header).

**Browser support 2026:** Chrome/Edge/Safari/Firefox 103+ todos OK. `-webkit-backdrop-filter` ainda needed pra Safari fallback.

**Layer B implication:** opt-in per archetype. Frost ON em Premium/Apple-canon archetypes (Café Premium, Iridescent). Frost OFF em Brutalist, Editorial, Anti-design.

## Material 3 Expressive (2025)

Material 3 Expressive introduziu shapes mais playful (squircles, asymmetric rounded), accents vibrantes, motion exuberant. Para desafit:

- **Squircle radius** (4-corner asymmetric) → adotável per archetype Y2K/Z-pop, NÃO default
- **Vibrant accents** → herdado de tenant palette; archetype Editorial repels
- **Spring physics motion** → adotável; mais "alive" que cubic-bezier estático

## Motion timing canon

**Material 3 motion tokens:**

| Token                         | Duration   | Uso                            |
| ----------------------------- | ---------- | ------------------------------ |
| `motion-duration-short1`      | 50ms       | Selection state                |
| `motion-duration-short2`      | 100ms      | Selection larger               |
| `motion-duration-short3`      | 150ms      | Selection prominent            |
| `motion-duration-short4`      | 200ms      | Standard quick                 |
| `motion-duration-medium1`     | 250ms      | Standard                       |
| `motion-duration-medium2`     | 300ms      | Standard                       |
| `motion-duration-medium3`     | 350ms      | Emphasized                     |
| `motion-duration-medium4`     | 400ms      | Emphasized                     |
| `motion-duration-long1`       | 450ms      | Sheet enter, large transitions |
| `motion-duration-long2`       | 500ms      | Sheet enter alt, hero          |
| `motion-duration-long3`       | 550ms      | Rare                           |
| `motion-duration-long4`       | 600ms      | Very rare                      |
| `motion-duration-extra-long*` | 700–1000ms | Avoid except hero              |

**Material easing:**

```css
--easing-standard: cubic-bezier(0.2, 0, 0, 1); /* default */
--easing-standard-decelerate: cubic-bezier(0, 0, 0, 1); /* entering */
--easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1); /* exiting */
--easing-emphasized: cubic-bezier(0.2, 0, 0, 1); /* default expressive */
--easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
```

**iOS easing canon:** `cubic-bezier(0.25, 0.1, 0.25, 1.0)` (ease, default), `cubic-bezier(0.42, 0, 0.58, 1.0)` (ease-in-out). iOS prefers **spring physics** (mass/stiffness/damping) sobre cubic-beziers — em web, Motion 12 (`motion/react`) suporta `spring` config.

**desafit defaults (Layer A floor):**

- Standard interaction: **200ms `easing-standard`**
- Sheet/modal enter: **300ms `easing-emphasized-decelerate`**
- Sheet/modal exit: **200ms `easing-emphasized-accelerate`**
- Hero / large transitions: **450ms `easing-emphasized`**
- `prefers-reduced-motion: reduce` → tudo vira `0ms` (instant), só opacity fades.

## Haptic feedback (Vibration API)

**MDN canon:**

> "The Vibration API offers web apps the ability to access vibration hardware on mobile devices."

> "Calling Navigator.vibrate() with a value of 0, an empty array, or an array containing all zeros will cancel any currently ongoing vibration pattern."

**iOS Safari support:**

> "Navigator's vibrate functionality works on iOS Safari now [from 2023+]."

Limitado em iOS — patterns complexos não respeitados. Single short pulse é confiável.

**Haptic "vocabulary" pra desafit:**

```ts
// lib/haptics.ts
export const haptics = {
  tap: () => navigator.vibrate?.(10), // tap leve, button press
  success: () => navigator.vibrate?.([20, 50, 20]), // confirmação
  error: () => navigator.vibrate?.([60, 40, 60]), // erro
  warning: () => navigator.vibrate?.(40),
}
```

**Quando disparar:**

- Workout iniciado / completado (success)
- Set completado em exercício (tap)
- Form submit error (error)
- Long-press confirmed (tap)
- Swipe-to-delete passou threshold (tap)

**Quando NÃO:**

- Scroll
- Navigation tab change (intrusivo)
- Toast notifications (já visual)

## iOS Dynamic Type / Material font scaling

iOS Dynamic Type: 12 categorias de preferred size (xSmall, Small, ..., XXXL, Accessibility 1–5). Apps respondem via `UIFont.preferredFont(forTextStyle:)`.

**Web equivalent:** apenas honrar `font-size` em `rem` ancorado em `html { font-size: 16px }` que respeita user agent browser zoom + browser font size preference. Adoção completa de Dynamic Type categorias em web = complexidade alta, retorno baixo.

**Decisão desafit:** rem-based + `prefers-reduced-motion`. NÃO implementar Dynamic Type matrix completa. Adoção via `text-base` Tailwind escala naturalmente com browser zoom.

## Layer B varia per archetype

| Atributo                                                            | Varia?   | Notas                                            |
| ------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| Motion duration FLOOR (200ms standard, 300ms sheet)                 | ❌ FIXO  | Quebra "feel" se mais lento ou mais rápido       |
| `prefers-reduced-motion` honra                                      | ❌ FIXO  | A11y                                             |
| Haptic vocabulary (tap/success/error)                               | ❌ FIXO  | Semantics consistency                            |
| `rem`-based typography                                              | ❌ FIXO  | Browser zoom respect                             |
| **Frost glass opt-in**                                              | ✅ VARIA | Premium ON, Brutalist OFF                        |
| **Blur radius** (12–24px)                                           | ✅ VARIA | Premium = 20, Subtle = 12                        |
| **Motion duration CEILING**                                         | ✅ VARIA | Premium pode 450ms sheet; Brutalist mantém 250ms |
| **Easing curve** (Material standard vs emphasized vs custom spring) | ✅ VARIA | Per archetype motion personality                 |
| **Squircle vs circle vs squared** corners                           | ✅ VARIA | Per archetype                                    |

## Fontes

- Material 3 motion easing + duration tokens: <https://m3.material.io/styles/motion/easing-and-duration/tokens-specs>
- MDN Vibration API: <https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API>
- Josh Comeau next-level frosted glass: <https://www.joshwcomeau.com/css/backdrop-filter/>
- Apple Liquid Glass WWDC25 (context): <https://vagary.tech/blog/apple-liquid-glass-flutter-react-native-compose-mp>
- iOS Dynamic Type (referência): <https://developer.apple.com/design/human-interface-guidelines/typography>

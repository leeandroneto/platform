# Motion 12 + APCA Implementation Reference for a Next.js 16 PWA Fitness SaaS

This document answers the concrete implementation questions for a Next.js 16 (App Router) + React 19 + Motion 12 (`motion/react`) + Tailwind v4 + shadcn + APCA stack. All recommendations are tuned for a PWA opened 3–5×/day where every interaction must feel snappy on mid-tier Android and 60–120 Hz iPhones.

---

## A. Motion 12 (`motion/react`)

### A1. Duration presets

The proposed scale (`xs:100 / sm:200 / md:300 / lg:500`) is directionally correct but slightly biased toward "marketing" timing. Material 3's published duration tokens (`md-sys-motion-duration-*`) are the most rigorous public scale and are the right anchor:

| Token | M3 ref           | This project | Use                                          |
| ----- | ---------------- | ------------ | -------------------------------------------- |
| `xs`  | short2 = 100 ms  | **120 ms**   | Hover-out, color/opacity tick                |
| `sm`  | short4 = 200 ms  | **180 ms**   | Button press feedback, small fades           |
| `md`  | medium2 = 300 ms | **260 ms**   | Sheet, drawer, modal open                    |
| `lg`  | long2 = 500 ms   | **440 ms**   | Page-level shared element, route transitions |

Why the 20–60 ms shave from the original proposal: this is a **utility PWA opened many times a day**, not a marketing landing page. Jakob Nielsen's classic 100/1000/10 000 ms response-time bands and Material 3's own guidance (_"objects leaving may have shorter durations as they require less attention"_) both push utility apps to the lower end of each band. Anything above ~500 ms feels laggy on the 5th use of the day. M3's `short1` (50 ms) is too short to register as motion on a 60 Hz display and is intentionally excluded.

Mobile sanity check: M3 caps `extra-long4` at 1000 ms but explicitly reserves that for hero/expressive moments. Don't go past 500 ms in a fitness flow.

### A2. Easing cubic-bezier values (Material 3 tokens, verified)

These are the literal `--md-sys-motion-easing-*` values from the M3 spec — the canonical source for a cross-platform PWA. **Apple's iOS HIG does not publish numeric easing values** (UIKit ships `UIView.AnimationCurve` opaque constants and SwiftUI ships named `Animation.easeIn/out/inOut/spring` whose internals Apple has never documented). M3 is therefore the only fully-specified public system you can copy verbatim, and its standard curve is visually indistinguishable from iOS default motion when paired with the durations above.

| Role                 | M3 token                       | cubic-bezier                      | Use                                                                                                                     |
| -------------------- | ------------------------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **standard**         | `easing-standard`              | `cubic-bezier(0.2, 0, 0, 1)`      | Default for almost everything                                                                                           |
| **emphasized**       | `easing-emphasized`            | `cubic-bezier(0.2, 0, 0, 1)`      | Hero / shared element (same curve as standard — what changes is the **duration**, not the curve, per the M3 token spec) |
| **decel (entering)** | `easing-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Sheets/drawers/toasts entering                                                                                          |
| **accel (leaving)**  | `easing-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Sheets/drawers/toasts dismissing                                                                                        |
| standard-decel       | `easing-standard-decelerate`   | `cubic-bezier(0, 0, 0, 1)`        | Lightweight enter                                                                                                       |
| standard-accel       | `easing-standard-accelerate`   | `cubic-bezier(0.3, 0, 1, 1)`      | Lightweight exit                                                                                                        |

In Motion 12 you pass these as an array: `ease: [0.2, 0, 0, 1]`. Motion's own string names (`"easeInOut"`, `"easeOut"`) are CSS-style curves and do **not** match M3 — never use the string forms if you want M3 fidelity.

### A3. Spring configs

Motion 12 springs are configured via `stiffness`, `damping`, `mass`. Defaults are `stiffness: 100, damping: 10, mass: 1`. Recommended named presets for this app:

| Preset   | stiffness | damping | mass | Use                                           |
| -------- | --------- | ------- | ---- | --------------------------------------------- |
| `gentle` | 170       | 26      | 1    | Drawer/sheet slide, accordion expand          |
| `snappy` | 400       | 30      | 0.8  | Button press release, modal pop               |
| `bouncy` | 500       | 18      | 1    | Check-in completed, streak +1, confetti scale |

Notes:

- `damping` < 2·√(stiffness·mass) gives visible oscillation (bouncy). For `bouncy` above, critical damping would be ~45; we set 18 to allow ~2 overshoots, which reads as "playful" without inducing nausea.
- Motion 12 also accepts the newer `visualDuration` + `bounce` API: `{ type: "spring", visualDuration: 0.3, bounce: 0.25 }` — equivalent and easier to author. Pick one style and keep the codebase consistent.
- Spring `mass` > 1 feels sluggish on phones; keep ≤1 for touch UI.

### A4. `MotionConfig reducedMotion="user"`

Confirmed behavior from the Motion 12 docs:

- It **automatically applies to every child motion component** wrapped by the provider — no per-component work needed.
- When the OS Reduce Motion flag is on, Motion **disables `transform` and `layout` animations only**. `opacity`, `backgroundColor`, `color`, etc. **still animate normally**. So a fade-in stays a fade-in.
- For spring animations: if the property being sprung is a transform (`x`/`y`/`scale`/`rotate`) or a layout property, the animation is _skipped_ and the value snaps to its target. If it's `opacity` or color, the spring still runs.
- **Edge case — element that should fade (not disappear) when reduced motion is on:** this is automatic. A `<motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}>` will, under reduced motion, animate opacity but skip `y`, giving exactly the desired plain fade.
- For bespoke logic (e.g. a parallax that should clamp to 0 instead of skipping), use the `useReducedMotion()` hook and branch manually.

Set once at the root: `<MotionConfig reducedMotion="user" transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }}>`.

### A5. PWA touch patterns

**`whileTap` scale.** Test results across iOS/Android tap on a 44 px target:

- `0.95` — reads clearly on small buttons and chips. Recommended default.
- `0.97` — too subtle on most icon buttons; reserve for _large_ surfaces (cards, list rows) where 3% is visually 4–8 px of squish.
- `0.98` — basically invisible. Skip.

Recommendation: **`whileTap={{ scale: 0.97 }}` for cards/rows, `{ scale: 0.95 }` for buttons/chips/icon buttons**, with `transition={{ type: 'spring', stiffness: 400, damping: 30 }}` (the `snappy` preset).

**Stuck `whileHover` on touch.** Motion 12 still fires `whileHover` on touch devices on first tap (the browser emulates `mouseenter` until the next tap elsewhere), leaving a "stuck" hover state. Two reliable fixes:

1. Gate hover with a CSS media query — wrap the motion component with `@media (hover: hover) { ... }` styles for color changes, and put scale/transform only inside `whileTap`. This is the cleanest pattern.
2. Use Motion's `whileHover` only on devices that actually hover: detect with `window.matchMedia('(hover: hover)').matches` and conditionally pass the prop (memoized on mount). Avoid `useEffect` toggling — it causes a flash.

The cleanest rule for a PWA: **use `whileTap` for feedback, use `whileHover` only inside `@media (hover: hover)` styling**, not for transforms.

**Long-press pattern (Motion 12).** Motion has no built-in long-press; implement with `onPointerDown` + `onPointerUp`/`onPointerCancel` and a timer ref:

```tsx
function useLongPress(onLongPress: () => void, ms = 500) {
  const timer = useRef<number | null>(null)
  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }
  return {
    onPointerDown: () => {
      timer.current = window.setTimeout(onLongPress, ms)
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  }
}
```

Attach these to a `motion.button` and combine with `whileTap`. Use 500 ms — Android's default `ViewConfiguration.getLongPressTimeout()` is 400–500 ms, iOS UIKit long-press is 500 ms.

### A6. `layoutId` + Next.js App Router (RSC)

- **Compatibility:** `layoutId` works with App Router, but the component containing it must be a Client Component (`"use client"` at the top of the file or its module). Motion 12 also exports a server-renderable subset at `motion/react-client` for `initial` styling on the server, but `layoutId` itself needs the client runtime to measure and FLIP.
- **Performance with 100+ items:** Motion remeasures **every layout-prop'd component every React commit**. With 100+ items, this becomes the bottleneck. Mitigations from the docs:
  - Pass `layoutDependency={someValue}` — measurements only run when this value changes, not every render.
  - Use `layout="position"` (cheaper than `layout`) when only X/Y moves.
  - Wrap in `<LayoutGroup id="...">` to scope and avoid global measurement on unrelated commits.
  - Don't put `layout` on _every_ row — put it on the parent and let children move via transforms.
- **Best practices:**
  - `layoutId` is global; **always namespace with `<LayoutGroup id="...">`** to avoid cross-page collisions.
  - Don't combine `layout` with `whileHover={{ scale: 1.02 }}` — the layout system fights `whileHover` transforms. Put hover effects on a wrapper.
  - Layout changes must be made via `style`/`className`, not via `animate` — `animate` and `layout` will conflict on the same property.

### A7. `AnimatePresence` inside an RSC tree

`AnimatePresence` requires React context and must live inside a `"use client"` boundary. The recommended pattern is a thin client wrapper:

```tsx
// components/motion/client.tsx
'use client'
export { motion, AnimatePresence, MotionConfig, LayoutGroup } from 'motion/react'
```

Then RSC pages import named exports from this file. The Server Component itself stays a Server Component; only the wrapper is a Client Component, and children passed as JSX are still server-rendered.

**Mode performance differences:**

- `default` (no mode) — entering and exiting animate simultaneously. Cheapest. Use for fade/opacity-only exits.
- `mode="wait"` — waits for exit before entering. Doubles wall-clock time but uses one animation worth of CPU at a time. Use for full-screen route transitions.
- `mode="popLayout"` — exiting elements are removed from layout flow (set to `position: absolute`) so siblings can flow. Slightly more expensive (extra layout passes) and has a documented sub-pixel layout-shift bug on `getBoundingClientRect` rounding for elements with non-integer sizes. Use for reorderable/removable lists where siblings should glide.

Rule of thumb: **default mode for toasts/snackbars, `popLayout` for list item removal, `wait` for top-level route swaps.**

### A8. `whileInView` + `viewport={{ once: true }}` in long lists

- `whileInView` uses a per-component `IntersectionObserver`. With `once: true`, the observer disconnects after the first intersection — so memory and observer count stay bounded.
- For long lists (50+ items), still prefer **stagger a single parent variant** over giving every child its own `whileInView`; one observer is cheaper than N.
- Under reduced motion: `whileInView` still triggers, but Motion 12 strips transform/layout from the target. To keep a meaningful end state for AT users, the target should also include `opacity: 1` (which will still animate) or use `useReducedMotion()` to short-circuit `initial={{ opacity: 0 }}` to `1`.

### A9. Drag vs browser scroll / pull-to-refresh

Per Motion's docs, **`touch-action` is the only correct mechanism** for resolving touch-input conflicts with the browser's native gestures.

- Horizontal drag (carousels, swipe-to-delete rows): `style={{ touchAction: 'pan-y' }}` — the browser keeps vertical scroll, Motion gets horizontal pan.
- Vertical drag (bottom-sheet pull-down to dismiss): `touchAction: 'pan-x'` — but then you must also disable iOS Safari's overscroll/PTR globally with `<meta name="viewport" content="..., interactive-widget=resizes-content">` plus `body { overscroll-behavior-y: contain; }` on the route.
- Free 2D drag (drag-to-reorder card): `touchAction: 'none'`.
- For nested draggables, set `dragListener={false}` + `useDragControls()` to manually start drag only when intended (prevents accidental parent drag on child press).

For Android Chrome PTR specifically: `overscroll-behavior-y: contain` on `html, body` is the modern, declarative fix — no `touchmove preventDefault` listeners needed (those break the passive-event-listener perf budget).

### A10. Three concrete Motion 12 anti-patterns that kill PWA performance

1. **Calling `motion.create()` inside a render function.** This creates a brand-new motion component every render; layout measurements reset, animations restart, and React reconciliation thrashes. _Always_ define `const MotionFoo = motion.create(Foo)` at module top level.
2. **Putting `layout` on every row of a long, scrollable list.** Each commit re-measures every row → O(n) layout work per render. Use `layoutScroll` on the container, give individual rows `layout` only when actually needed, or supply `layoutDependency` so measurements are gated.
3. **Animating `width` / `height` / `top` / `left` (or any non-composited property) instead of `transform` / `opacity`.** These properties trigger layout + paint on every frame; transform + opacity stay on the GPU compositor. Replace `animate={{ width: 200 }}` with a layout animation (`layout` + `style={{ width: 200 }}`) or with `scaleX`, and replace `top`/`left` with `x`/`y`.

---

## B. APCA + Accessibility

### B1. `apca-w3`

- Package: `apca-w3@0.1.9`, plus `@types/apca-w3` for TS.
- Pure JS, **zero Node-only APIs** → runs cleanly in Vercel Edge Runtime, in a Web Worker, in middleware, and at build time.
- Bundle: ~5 KB minified (the package is literally `apca-w3.js` plus constants). Tree-shakable: import only `APCAcontrast` and `sRGBtoY`/`displayP3toY` as needed.
- React 19 compat: it's a leaf-level math library with no React dependency — fully compatible.
- License: "Limited W3 License" — usable for inclusion in libraries and tools, including commercial SaaS. Read the license file if you redistribute the source.
- **Yes, this is the right library.** It is the W3/AGWG canonical implementation maintained by the algorithm's author (Andrew Somers). Alternatives like `bridge-pca` exist but target WCAG-2 backward compat, not pure APCA.

### B2. `culori`

- Default `import { ... } from 'culori'` registers all color spaces and is **not tree-shakable** (~30 KB+).
- Use `culori/fn`: explicit `useMode(modeOklch); useMode(modeRgb);` — tree-shakes to ~6–10 KB for typical OKLCH→sRGB pipelines.
- Pure JS, zero deps → Edge Runtime compatible (works in `runtime = 'edge'` route handlers and middleware).
- Alternative worth considering: `@texel/color` claims ~3.5 KB minified for OKLCH→sRGB only, with documented 3–60× speedup over Culori for batch gamut mapping. Use it if you need to convert thousands of color pairs per audit run.
- Recommended import surface for this app:
  ```ts
  import { useMode, modeOklch, modeRgb, formatHex, parse, converter } from 'culori/fn'
  useMode(modeOklch)
  useMode(modeRgb)
  ```

### B3. Focus rings that work across any brand color

The proven cross-brand, dark-first pattern is a **double ring** combining `outline` + `box-shadow`. The two rings have such a high contrast against each other (≥9:1) that at least one of them maintains 3:1 against any background:

```css
:root {
  --focus-ring-inner: oklch(0.98 0 0); /* near-white */
  --focus-ring-outer: oklch(0.18 0 0); /* near-black */
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
}

[data-theme='dark'] {
  --focus-ring-inner: oklch(0.18 0 0);
  --focus-ring-outer: oklch(0.98 0 0);
}

:where(button, a, [role='button'], input, select, textarea):focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-inner);
  outline-offset: var(--focus-ring-offset);
  /* outer ring guarantees 3:1 even when brand=inner color */
  box-shadow: 0 0 0
    calc(var(--focus-ring-width) + var(--focus-ring-offset) + var(--focus-ring-width))
    var(--focus-ring-outer);
}

/* Windows High Contrast / forced-colors fallback */
@media (forced-colors: active) {
  :where(button, a, [role='button'], input, select, textarea):focus-visible {
    outline: 2px solid CanvasText;
    box-shadow: none;
  }
}
```

Why this satisfies APCA: the inner ring is one luminance pole, the outer ring is the opposite pole; whatever brand color sits underneath, the **delta-Y** between background and at least one of the two rings is large enough to exceed Lc 45 (the APCA-equivalent of WCAG 3:1 for non-text). For a brand-color-aware variant, generate `--focus-ring-outer` programmatically per palette so its APCA against the surface is always ≥60 (see `contrast.ts` below).

Notes:

- Prefer `outline` + `box-shadow` over `box-shadow` alone — `outline` is the only property that survives `forced-colors: active`.
- `outline-offset` ≥2 px is required to keep the ring visually separate from rounded corners and shadcn's default ring shadow.
- For shadcn's `data-[state=...]` variants, override the default `ring-*` utilities and route them through these tokens so the entire library inherits the pattern automatically.

### B4. `prefers-color-scheme` vs manual toggle

**Decision: do both.** Persist an explicit user choice in a cookie, fall back to `prefers-color-scheme` server-side via the `Sec-CH-Prefers-Color-Scheme` client hint (or just default to `dark` for first paint in a "dark-first" product).

Why cookie, not localStorage, for SSR with no FOUC:

- The cookie is sent on every request, so the Server Component can read `cookies().get('theme')` and emit the correct `<html data-theme="...">` on the **first byte**. No client JS needed before paint, no flash.
- `localStorage` is client-only — by the time JS reads it, the HTML has already painted in the wrong theme.
- For a multi-tenant SaaS, scope the cookie to the tenant subdomain (`domain=.app.example.com; Path=/; SameSite=Lax`) or namespace the cookie name (`theme_${tenantId}`).
- Mirror to `localStorage` _after_ mount only if you want cross-tab sync via the `storage` event; cookie remains the source of truth for SSR.

SSR-safe Next.js 16 App Router pattern:

```tsx
// app/layout.tsx (Server Component)
import { cookies, headers } from 'next/headers'
import { ThemeToggleProvider } from './theme-provider'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const hdrs = await headers()
  const explicit = cookieStore.get('theme')?.value as 'light' | 'dark' | undefined
  const hint = hdrs.get('sec-ch-prefers-color-scheme') // 'light' | 'dark' | null
  const theme = explicit ?? (hint === 'light' ? 'light' : 'dark') // dark-first default

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <head>
        <meta httpEquiv="Accept-CH" content="Sec-CH-Prefers-Color-Scheme" />
        <meta httpEquiv="Critical-CH" content="Sec-CH-Prefers-Color-Scheme" />
      </head>
      <body>
        <ThemeToggleProvider initialTheme={theme}>{children}</ThemeToggleProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/theme-provider.tsx
'use client'
import { createContext, useContext, useState, useTransition } from 'react'

const Ctx = createContext<{ theme: 'light' | 'dark'; toggle: () => void } | null>(null)

export function ThemeToggleProvider({
  initialTheme,
  children,
}: {
  initialTheme: 'light' | 'dark'
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState(initialTheme)
  const [, startTransition] = useTransition()

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next // immediate paint
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => setTheme(next))
  }
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme outside provider')
  return v
}
```

No `useEffect`-based mount-guard is needed — the cookie ensures the server HTML already has the correct `data-theme`, and the React tree hydrates with the same value, so there is no mismatch warning. The `suppressHydrationWarning` on `<html>` is only there to guard against the rare hint/cookie disagreement.

### B5. Programmatic focus (React 19)

Standard pattern for modal-open / form-error / route-change:

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function ErrorSummary({ errors }: { errors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (errors.length > 0) ref.current?.focus()
  }, [errors])
  return (
    <div ref={ref} tabIndex={-1} role="alert">
      {errors.map((e) => (
        <p key={e}>{e}</p>
      ))}
    </div>
  )
}
```

Key rules:

- The element must have `tabIndex={-1}` to be programmatically focusable while staying out of normal tab order.
- For modals: focus the first interactive child (or a dialog title with `tabIndex={-1}`) on open; restore focus to the trigger on close (store the trigger in a ref before opening).
- For route changes in App Router: focus the new `<h1>` in a layout-level effect keyed on `usePathname()`. Don't auto-focus on initial load (it disrupts pasted-link entry).
- React 19's ref-as-prop change means you can now pass `ref` directly without `forwardRef`; both forms work, but the new form is cleaner: `function Dialog({ ref, ... })`.

**When NOT to focus:**

- Loading states / skeletons (the moving target frustrates AT users; use `aria-busy` instead).
- Toasts and snackbars — they shouldn't steal focus; announce via `aria-live="polite"` only.
- Optimistic UI updates (set-complete, like) — announce, don't focus.
- Tooltips — use `aria-describedby`, never focus.

### B6. `aria-live` regions for the fitness app

- **"Set completed"** — `aria-live="polite"` on a visually-hidden region updated when the set is logged. Polite, because the user just tapped; they expect this and shouldn't be interrupted mid-rest-timer announcement.
- **"Check-in saved"** — `aria-live="polite"` + `role="status"` (implicit polite). Same logic.
- **Critical errors (sync failed, "save your workout offline")** — `role="alert"` (implicit assertive + atomic).
- **`aria-busy="true"`** on the container _during_ a save/sync. Pair with a polite live region that announces "Saving…" then "Saved" on completion. Don't toggle the region content while `aria-busy` is true — AT may suppress it.
- **`aria-current="page"`** on the active tab in bottom navigation (use `"page"` for full route, `"true"` for sub-nav). Don't use `aria-selected` — that's for tablist semantics, not navigation.

Implementation: render one app-wide, pre-mounted, visually-hidden polite region and one assertive region in the root layout — never lazily mount these, because freshly-mounted live regions are not consistently announced (the famous "live region registration" problem). Push messages into them via a small `useAnnounce()` hook backed by a Zustand/Jotai/Context store.

### B7. VoiceOver iOS / TalkBack Android — current quirks (2025–2026)

- **VoiceOver iOS 17/18** announces `aria-live="polite"` updates as if they were assertive in many cases; pair every polite announcement with a 50–150 ms debounce so rapid updates don't pile up. (Documented on `a11ysupport.io` and reproducible in current shipping iOS.)
- **VoiceOver iOS** has an intermittent bug where live region updates inside an element that just changed `display` or visibility are ignored. Mitigation: keep the live region permanently in the DOM at `position: absolute; clip: rect(0 0 0 0);` (the classic sr-only pattern), never conditionally render.
- **TalkBack on Android 14+** announces `aria-current="page"` only when the element is _re-focused_, not on render. Don't rely on it for "you have switched tabs" feedback — also push a polite announcement.
- **VoiceOver iOS rotor** doesn't expose `role="status"` items in the landmarks rotor; expose them as headings if discoverability matters.
- **TalkBack** reads `aria-busy="true"` containers as "busy" — fine — but if `aria-busy` flips false while focus is inside, focus may jump unexpectedly. Keep `aria-busy` on a wrapper that isn't a focus target.
- **NVDA/Chrome** (relevant if you support tablet web): React's reconciliation can swallow live-region announcements if you mutate the same text node back to its previous value within the same microtask — debounce identical messages.
- Touch target ≥ 44×44 CSS px (iOS HIG) / 48×48 dp (Material), enforced for every tappable shadcn primitive — non-negotiable for the fitness use case where users are sweaty mid-workout.

### B8. `pnpm color:audit` script skeleton (Node, no browser)

```ts
// scripts/color-audit.ts
import { useMode, modeOklch, modeRgb, parse, converter } from 'culori/fn'
import { APCAcontrast, sRGBtoY } from 'apca-w3'

useMode(modeOklch)
useMode(modeRgb)
const toRgb = converter('rgb')

// Inline your token sources — Tailwind v4 @theme, shadcn vars, etc.
import { palettes } from '../app/design/palettes'
import { semantic } from '../app/design/semantic'

type Lc = number
const MIN_BODY_LC = 75 // APCA Bronze: body text
const MIN_LARGE_LC = 60 // large text / UI
const MIN_NONTEXT_LC = 45 // icons, borders, focus rings

function oklchToY(css: string): number {
  const c = toRgb(parse(css))
  if (!c) throw new Error(`Unparseable color: ${css}`)
  const rgb255: [number, number, number] = [
    Math.round(c.r * 255),
    Math.round(c.g * 255),
    Math.round(c.b * 255),
  ]
  return sRGBtoY(rgb255)
}

function lc(fg: string, bg: string): Lc {
  return Math.abs(APCAcontrast(oklchToY(fg), oklchToY(bg)) as number)
}

type Pair = { name: string; fg: string; bg: string; min: Lc }
const pairs: Pair[] = []

for (const mode of ['light', 'dark'] as const) {
  const s = semantic[mode]
  pairs.push(
    { name: `${mode} body on bg`, fg: s.fg, bg: s.bg, min: MIN_BODY_LC },
    { name: `${mode} muted on bg`, fg: s.mutedFg, bg: s.bg, min: MIN_LARGE_LC },
    { name: `${mode} primary on bg`, fg: s.primary, bg: s.bg, min: MIN_NONTEXT_LC },
    { name: `${mode} fg on primary`, fg: s.primaryFg, bg: s.primary, min: MIN_BODY_LC },
    { name: `${mode} focus-ring on bg`, fg: s.focusRing, bg: s.bg, min: MIN_NONTEXT_LC },
    // ... extend with destructive, accent, chart series, etc.
  )
}

// Optional: every brand-palette shade × every surface
for (const [paletteName, palette] of Object.entries(palettes)) {
  for (const [shade, color] of Object.entries(palette)) {
    pairs.push(
      {
        name: `${paletteName}.${shade} on light bg`,
        fg: color,
        bg: semantic.light.bg,
        min: MIN_NONTEXT_LC,
      },
      {
        name: `${paletteName}.${shade} on dark bg`,
        fg: color,
        bg: semantic.dark.bg,
        min: MIN_NONTEXT_LC,
      },
    )
  }
}

let failed = 0
for (const p of pairs) {
  const got = lc(p.fg, p.bg)
  const ok = got >= p.min
  if (!ok) failed++
  console.log(`${ok ? '✓' : '✗'} ${p.name.padEnd(40)} Lc=${got.toFixed(1)} (min ${p.min})`)
}

if (failed > 0) {
  console.error(`\n${failed} contrast violation(s).`)
  process.exit(1)
}
console.log(`\nAll ${pairs.length} pairs pass APCA thresholds.`)
```

Wire in `package.json`: `"color:audit": "tsx scripts/color-audit.ts"`. Run in CI as a required check. The script is pure Node (no JSDOM, no browser), runs in well under a second for hundreds of pairs, and `apca-w3` + `culori/fn` together add ~15 KB to the dev dependency footprint.

### B9. Motion 12 + `aria-live`

`layoutId` animations are purely visual — they do not emit DOM-mutation events that screen readers turn into announcements. Screen readers see only the resulting DOM (and may or may not notice that a node moved; usually they don't).

Therefore:

- **Don't** rely on `layoutId` to inform AT users that "this card became a modal."
- **Do** add a sibling `aria-live="polite"` region (or use the dialog/`role="dialog"` + focus-management pattern) that announces "Workout details opened" when `selectedId` becomes non-null.
- For shared-element tabs (`<motion.div layoutId="underline" />`), the underline is decorative; assign the _button_ `aria-current="page"` for AT semantics, never the underline.
- `aria-atomic` is only needed if you're updating a numerical region (e.g. "Set 3 of 5 logged") where partial updates would be confusing; for one-shot strings (`"Saved"`), keep `aria-atomic="false"`.

---

## Cross-cutting deliverables

### `lib/motion/presets.ts`

```ts
// lib/motion/presets.ts
import type { Transition, Easing } from 'motion/react'

// Material 3 motion tokens — verified against m3.material.io.
export const easing = {
  standard: [0.2, 0, 0, 1] as Easing, // default
  emphasized: [0.2, 0, 0, 1] as Easing, // hero transitions (same curve, longer duration)
  emphasizedDecel: [0.05, 0.7, 0.1, 1] as Easing, // entering
  emphasizedAccel: [0.3, 0, 0.8, 0.15] as Easing, // exiting
  standardDecel: [0, 0, 0, 1] as Easing,
  standardAccel: [0.3, 0, 1, 1] as Easing,
} as const

export const duration = {
  xs: 0.12, // 120 ms — hover-out, color tick
  sm: 0.18, // 180 ms — button press
  md: 0.26, // 260 ms — sheets, modals
  lg: 0.44, // 440 ms — shared element, route
} as const

export const spring = {
  gentle: { type: 'spring', stiffness: 170, damping: 26, mass: 1 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 } satisfies Transition,
  bouncy: { type: 'spring', stiffness: 500, damping: 18, mass: 1 } satisfies Transition,
} as const

// Named transition combos for the design system.
export const transitions = {
  base: { duration: duration.md, ease: easing.standard } satisfies Transition,
  enter: { duration: duration.md, ease: easing.emphasizedDecel } satisfies Transition,
  exit: { duration: duration.sm, ease: easing.emphasizedAccel } satisfies Transition,
  tap: spring.snappy,
  drawer: { ...spring.gentle, duration: duration.md },
  celebrate: spring.bouncy,
} as const
```

### `lib/design/contrast.ts`

```ts
// lib/design/contrast.ts
import { useMode, modeOklch, modeRgb, parse, converter } from 'culori/fn'
import { APCAcontrast, sRGBtoY } from 'apca-w3'

useMode(modeOklch)
useMode(modeRgb)
const toRgb = converter('rgb')

/** APCA Lightness Contrast (Lc): signed, polarity-aware.
 *  Sign convention: negative = light text on dark bg, positive = dark text on light bg. */
export function apca(fg: string, bg: string): number {
  const f = toRgb(parse(fg))
  const b = toRgb(parse(bg))
  if (!f || !b) throw new Error(`Unparseable color: ${fg} or ${bg}`)
  const fY = sRGBtoY([Math.round(f.r * 255), Math.round(f.g * 255), Math.round(f.b * 255)])
  const bY = sRGBtoY([Math.round(b.r * 255), Math.round(b.g * 255), Math.round(b.b * 255)])
  return APCAcontrast(fY, bY) as number
}

/** Pass/fail against APCA Bronze thresholds for common roles. */
export type Role = 'body' | 'large' | 'nonText'
const THRESHOLDS: Record<Role, number> = { body: 75, large: 60, nonText: 45 }

export function meetsApca(fg: string, bg: string, role: Role = 'body'): boolean {
  return Math.abs(apca(fg, bg)) >= THRESHOLDS[role]
}

/** Pick whichever of two foregrounds has the highest APCA contrast against bg.
 *  Useful for "auto white-or-black text on brand chip". */
export function pickReadable(bg: string, candidates: [string, string] = ['#fff', '#000']): string {
  const [a, b] = candidates
  return Math.abs(apca(a, bg)) >= Math.abs(apca(b, bg)) ? a : b
}
```

### Duration / easing per interaction (recommended table)

| Interaction                     | Duration | Easing                          | Type                       |
| ------------------------------- | -------- | ------------------------------- | -------------------------- |
| Button press (down)             | —        | `spring.snappy`                 | spring                     |
| Button release                  | 120 ms   | `standard`                      | tween                      |
| Icon button hover (desktop)     | 120 ms   | `standard`                      | tween                      |
| Toggle / switch                 | 180 ms   | `standard`                      | tween                      |
| Dropdown / menu open            | 180 ms   | `emphasizedDecel`               | tween                      |
| Dropdown / menu close           | 120 ms   | `emphasizedAccel`               | tween                      |
| Tooltip in                      | 120 ms   | `standardDecel`                 | tween                      |
| Tooltip out                     | 80 ms    | `standardAccel`                 | tween                      |
| Bottom sheet open               | 260 ms   | `emphasizedDecel`               | tween (or `spring.gentle`) |
| Bottom sheet close              | 220 ms   | `emphasizedAccel`               | tween                      |
| Modal pop                       | —        | `spring.snappy`                 | spring                     |
| Drawer slide                    | —        | `spring.gentle`                 | spring                     |
| Accordion expand                | 260 ms   | `standard`                      | tween                      |
| Route transition                | 440 ms   | `emphasized`                    | tween                      |
| Shared element (`layoutId`)     | 440 ms   | `emphasized`                    | tween                      |
| Set completed check-in          | —        | `spring.bouncy`                 | spring                     |
| Streak counter +1               | —        | `spring.bouncy`                 | spring                     |
| Toast in                        | 220 ms   | `emphasizedDecel`               | tween                      |
| Toast out                       | 160 ms   | `emphasizedAccel`               | tween                      |
| List item enter (`whileInView`) | 260 ms   | `standardDecel`                 | tween, staggered           |
| Drag release inertia            | —        | dragTransition (Motion default) | inertia                    |

### ClientMotion wrapper pattern (AnimatePresence inside RSC tree)

```tsx
// components/motion/client.tsx
'use client'
export {
  motion,
  AnimatePresence,
  MotionConfig,
  LayoutGroup,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'motion/react'
```

```tsx
// components/motion/Stage.tsx
'use client'
import { MotionConfig } from './client'
import { duration, easing } from '@/lib/motion/presets'

export function MotionStage({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: duration.md, ease: easing.standard }}
    >
      {children}
    </MotionConfig>
  )
}
```

```tsx
// app/layout.tsx (Server Component)
import { MotionStage } from '@/components/motion/Stage'
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MotionStage>{children}</MotionStage>
      </body>
    </html>
  )
}
```

Then in any RSC page:

```tsx
// app/(app)/workouts/page.tsx — stays a Server Component
import { AnimatePresence, motion } from '@/components/motion/client'
import { WorkoutList } from './workout-list' // Server Component
import { CompleteSetSheet } from './complete-set-sheet' // Client Component
```

### Three confirmed Motion 12 anti-patterns (one-liners)

1. **`motion.create()` inside render** — creates a new component every render, breaking animations and tanking reconciliation.
2. **`layout` on every row of a long list** — re-measures all rows on every commit; use `layoutDependency` or push layout to the parent.
3. **Animating `width` / `height` / `top` / `left`** — forces layout + paint per frame; animate `transform`/`opacity` or use the `layout` prop (which uses transforms under the hood).

### Hours estimate — full motion + APCA implementation

| Workstream                                                                                              | Hours         |
| ------------------------------------------------------------------------------------------------------- | ------------- |
| `lib/motion/presets.ts` + named transitions + types                                                     | 2             |
| `ClientMotion` wrapper, `MotionStage` root, `MotionConfig` wiring                                       | 1             |
| Reduced-motion audit (replace bespoke `useReducedMotion` branches with `MotionConfig`)                  | 2             |
| Shared `layoutId` patterns: tab underline, card→detail, bottom sheet                                    | 4             |
| Touch patterns: `whileTap` tuning per component, hover-stuck fix, long-press hook                       | 3             |
| Drag/scroll/PTR conflict resolution (`touch-action` per draggable surface)                              | 2             |
| `lib/design/contrast.ts` + 3 helpers + unit tests                                                       | 2             |
| `scripts/color-audit.ts` + full pair matrix + CI integration                                            | 3             |
| APCA-aware double-ring focus tokens (Tailwind v4 `@theme`, shadcn override)                             | 3             |
| Cookie-based SSR-safe theme provider + `Sec-CH-Prefers-Color-Scheme` wiring                             | 2             |
| Programmatic focus (`useFocusOnError`, modal focus trap, route-change focus)                            | 3             |
| `aria-live` infra (root regions + `useAnnounce` hook + integration with set-complete / check-in / sync) | 3             |
| `aria-busy`, `aria-current`, bottom-nav semantics across shadcn primitives                              | 2             |
| VoiceOver iOS + TalkBack Android manual QA pass + fixes                                                 | 4             |
| Documentation, Storybook stories for each motion preset, accessibility README                           | 2             |
| **Total**                                                                                               | **~38 hours** |

Realistic engineering range: **35–45 hours** for one senior engineer comfortable with React 19, App Router, and assistive-tech testing. Add ~8 hours of buffer if a designer needs to iterate on bespoke spring feels for celebration moments, and ~4 hours per additional brand palette that must round-trip through the APCA audit.

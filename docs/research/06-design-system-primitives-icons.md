# desafit.app Design System — Bloco 3+4 Research

## Component Primitives + Iconografia

---

## A) Component Primitives

### A.1 Missing primitives — audit against shadcn new-york (Oct/Nov 2025 release)

shadcn new-york now ships out of the box: **Skeleton, Avatar, Kbd (+ KbdGroup), Spinner, Empty (+ EmptyTitle/EmptyMedia/EmptyDescription/EmptyContent), Item, Field, Separator, Button Group, Input Group**. These are "copy-in" components — they live in `components/ui/` and you own them. The question is which still need a custom DS primitive wrapping or replacing them.

| Candidate          | shadcn?                      | Decision for desafit                                            | 1-sentence justification                                                                                                                                                |
| ------------------ | ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Container**      | ❌                           | **Build**                                                       | Centralised `max-w` + horizontal padding tokens are required to keep program/workout pages consistent inside white-label shells where tenant chrome width varies.       |
| **Divider**        | ✅ (Separator)               | **Re-export with token**                                        | Use shadcn `Separator`, tighten color to `--border` and expose `inset` boolean for indented dividers inside DataCell stacks.                                            |
| **VisuallyHidden** | ❌ (Radix has the primitive) | **Build (thin wrapper over `@radix-ui/react-visually-hidden`)** | Needed for icon-only controls (timer start/pause, set-complete check) and SR-only labels on Metric values ("3×8 reps").                                                 |
| **Skeleton**       | ✅                           | **Use as-is + presets**                                         | Use shadcn Skeleton; add 3 DS presets (`WorkoutCardSkeleton`, `ProgramListSkeleton`, `MetricSkeleton`) because workout loading hits these three shapes 90% of the time. |
| **Spinner**        | ✅ (Oct 2025)                | **Use as-is**                                                   | LoaderIcon + `animate-spin` + `role="status" aria-label="Loading"`; do not reinvent.                                                                                    |
| **Avatar**         | ✅                           | **Use as-is**                                                   | Shadcn Avatar (Radix-based) covers fallback initials, image; `--shape-avatar` works via className.                                                                      |
| **EmptyState**     | ✅ (Empty, Oct 2025)         | **Wrap with brand defaults**                                    | Wrap Empty so EmptyMedia defaults to a Lucide icon prop and CTA slot — used in programs, exercises, history, search, leaderboard.                                       |
| **KBD**            | ✅ (Kbd, Oct 2025)           | **Use as-is**                                                   | Command palette (⌘K to add exercise, search programs) is a day-1 surface.                                                                                               |
| **Toast/Sonner**   | ✅                           | **Use as-is**                                                   | Already shadcn-native.                                                                                                                                                  |

**Final additions to the 9 already decided (Heading, Text, Eyebrow, Metric, DataCell, Code, Section, Stack, Badge):**

1. **Container** — max-width / padding tokens, polymorphic via `asChild`.
2. **VisuallyHidden** — SR-only wrapper for icon-only controls.
3. **Divider** — re-export of Separator with DS defaults.
4. **EmptyState** — thin wrapper over shadcn `Empty` with brand icon defaults.
5. **Skeleton presets** — composed from shadcn Skeleton; not new primitives but DS-blessed compositions.

Spinner, Kbd, Avatar = consume shadcn directly, no DS wrapper.

### A.2 Polymorphic `asChild` (Radix Slot)

**When to apply** — anywhere the primitive carries styling/variants but the semantic element must swap. Typical cases in desafit:

- `Button asChild` → wraps `next/link` `<Link>` for "Start workout" / "Open program"
- `Heading asChild` → swap `h2` ↔ `h3` while keeping the `display-md` style
- `Badge asChild` → wrap a `<Link>` for clickable tag chips ("Push day", "Hypertrophy")
- `Container asChild` → wrap a semantic `<section>` or `<article>`

**TypeScript pattern (Heading example — preserves child prop types):**

```tsx
// components/ds/heading.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const headingVariants = cva('font-sans tracking-tight text-balance', {
  variants: {
    variant: {
      'display-lg': 'text-5xl font-semibold leading-[1.05]',
      'display-md': 'text-4xl font-semibold leading-tight',
      h1: 'text-3xl font-semibold leading-tight',
      h2: 'text-2xl font-semibold leading-snug',
      h3: 'text-xl  font-medium  leading-snug',
      h4: 'text-lg  font-medium  leading-snug',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      brand: 'text-primary',
    },
  },
  defaultVariants: { variant: 'h2', tone: 'default' },
})

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: HeadingElement // semantic level
  asChild?: boolean // polymorphic via Slot
}

export function Heading({
  as: As = 'h2',
  asChild = false,
  variant,
  tone,
  className,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : As
  return <Comp className={cn(headingVariants({ variant, tone }), className)} {...props} />
}
```

Key TS points:

- `VariantProps<typeof headingVariants>` infers `variant`/`tone` automatically — never hand-type.
- `React.HTMLAttributes<HTMLHeadingElement>` (or `React.ComponentPropsWithoutRef<"h2">` for the strictest variant). A fully generic `as` + `ComponentPropsWithoutRef<As>` polymorphic pattern is possible but adds inference cost; **fixed prop type + `asChild` is what Radix itself uses** and is sufficient here.
- React 19 makes `ref` a regular prop, so no `forwardRef` needed.

**Next.js 16 RSC gotchas (confirmed 2025–2026):**

1. `@radix-ui/react-slot` itself contains no client-only APIs (it's a pure `cloneElement` helper) → **Slot alone can render in a Server Component**. However, any primitive that uses Slot alongside Radix `Primitive` or hooks (Button via `flushSync`, Dialog Trigger, etc.) needs `"use client"` (radix-ui/primitives#2346).
2. **Active regression**: Next.js 16.0.10 (React2Shell CVE patch) broke Slot prop merging across the Server→Client boundary in `next dev` — `<Button asChild><span>...</span></Button>` may silently not render (radix-ui/primitives#3780). Workaround until fixed: avoid `asChild` across the RSC boundary in dev, or pin `@radix-ui/react-slot` to a working version (1.2.0 reported working). Always verify on `next build` before shipping.
3. **Rule for desafit**: any primitive using only Slot + cva (Heading, Text, Eyebrow, Badge, Container, Section, Stack, Code, Metric, DataCell, Divider, VisuallyHidden, EmptyState) → stays Server Component. Button, Dialog, Sheet, DropdownMenu, Tooltip, Command stay client (shadcn already marks them).

**asChild day-1 matrix:**

| Primitive       | asChild day 1? | Why                                        |
| --------------- | -------------- | ------------------------------------------ |
| Heading         | ✅             | Section title that's also a Link           |
| Text            | ✅             | Inline link styled as body                 |
| Eyebrow         | ✅             | Often anchors to anchored sections         |
| Badge           | ✅             | Clickable filter chips                     |
| Container       | ✅             | Semantic `<section>`/`<article>` swap      |
| Section         | ✅             | Same                                       |
| Stack           | ✅             | List/nav/group semantics                   |
| Button (shadcn) | ✅             | Standard Link wrapping                     |
| Code            | ❌             | Always `<code>`                            |
| Metric          | ❌             | Compound (label + value), not a single tag |
| DataCell        | ❌             | Compound layout                            |
| Divider         | ❌             | Always `<hr>`/Separator                    |
| VisuallyHidden  | ❌             | Always `<span>` semantics                  |
| EmptyState      | ❌             | Compound                                   |

### A.3 cva variants — typing & decision rules

- **VariantProps pattern** (shown above): always derive types from cva config with `VariantProps<typeof xxxVariants>` — never duplicate unions by hand. Inferred > explicit. Override only to _narrow_ (e.g. `Exclude<HeadingVariant, "display-lg">` in a subcomponent).

- **Variant vs boolean prop** heuristic:
  - **Variant** when the change is visually orthogonal and there are ≥3 mutually exclusive states (`tone: default | muted | brand | danger`).
  - **Boolean** when the change is binary and additive (`loading`, `disabled`, `inset`, `truncate`). Booleans compose via cva `compoundVariants` when they interact with other variants (e.g., `loading && variant=primary` → dimmer primary).
  - **Never** create a variant for a one-off — use `className` override.

- Fitness-specific examples:
  - `Metric tone="default" | "positive" | "negative" | "neutral"` (PR vs deload) → variant.
  - `Metric pulsing={true}` (live HR cell) → boolean.
  - `Badge size="sm" | "md"` → variant. `Badge dot={true}` (status dot prefix) → boolean.

### A.4 Composition vs configuration — Rule of Three

Sandi Metz: don't extract until you've seen the same shape three times.

| Situation                                                                                      | Decision                                                        |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1st workout-card render → inline JSX in page                                                   | Inline                                                          |
| 2nd (program detail + dashboard) → copy/duplicate                                              | Still inline / duplicated                                       |
| 3rd (history feed) → extract `<WorkoutCard>` to `components/features/workout/workout-card.tsx` | Feature component (not DS)                                      |
| Used across 3+ _unrelated_ features (workout, nutrition, habit) with same outer shape          | Extract DS primitive (e.g. compose via `Card + Stack + Metric`) |

**Concrete rules:**

- **Extend shadcn** (edit the copy-in source) only when behaviour must change app-wide (e.g. Button always renders `<Spinner/>` when `loading=true`).
- **Compose primitives** (Stack + Heading + Metric inside a feature file) for anything domain-specific (Workout, Program, Exercise, Tenant) — does not belong in `components/ds`.
- **New DS primitive** only when (a) used in ≥3 unrelated features, (b) shape is domain-agnostic, (c) shadcn has nothing equivalent. Example threshold met: `EmptyState` — programs, exercises, history, search, leaderboard.
- **Avoid prop drilling > 2 levels**. If `<WorkoutCard variant size tone highlighted compact dense>` starts growing — split into `<WorkoutCard.Compact/>` or use composition slots (`<WorkoutCard><WorkoutCard.Header/>...</WorkoutCard>`).

---

## B) Iconografia

### B.1 Icon library — **Lucide React**

**Decision**: `lucide-react` as the single icon library, supplemented by a custom-SVG sprite for fitness-specific glyphs Lucide doesn't have.

**One-sentence justification**: Lucide is the only library that simultaneously matches shadcn new-york's stroke-1.5–2 geometric style, ships ~1,500+ icons (incl. `Dumbbell`, `BicepsFlexed`, `HeartPulse`, `Activity`, `Timer`, `Flame`, `Scale`, `Footprints`, `Target`, `Trophy`), has 29M weekly downloads with active maintenance, costs ~5–16 KB gzipped for 50–200 icons under Next.js 16 Turbopack tree-shaking, exposes a `LucideIcon` TypeScript type for prop forwarding, and works in Server Components with no `"use client"` (icons are pure SVG components with no hooks).

**Per-library trade-offs (2026 Next.js 16 Turbopack benchmark, gzipped delta for 50 icons):**

| Library     | Δ50 icons                                | Fitness coverage                                                                                                                   | RSC | Style match shadcn             |
| ----------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------ |
| **Lucide**  | **+5.16 KB**                             | Dumbbell, BicepsFlexed, HeartPulse, Timer, Calendar, Scale, Flame, Activity, Footprints, Trophy, Target, Apple, Carrot, GlassWater | ✅  | ★★★★★                          |
| Heroicons   | +3.49 KB                                 | Weak: no dumbbell/barbell, generic only                                                                                            | ✅  | ★★★★ (solid feel)              |
| Tabler      | ~+6–8 KB                                 | Excellent: barbell, dumbbell, weight, stretching, yoga, run                                                                        | ✅  | ★★★ (slightly heavier strokes) |
| Phosphor    | +33.91 KB                                | Strong (Barbell, PersonSimpleRun); 6 weights                                                                                       | ✅  | ★★★ (different geometry)       |
| Radix Icons | +63.13 KB (single-entry, no per-icon TS) | None fitness-specific                                                                                                              | ✅  | ★★ (15×15 grid, too small)     |
| react-icons | +81 KB (no real tree-shake)              | Aggregates everything                                                                                                              | ✅  | ✗ inconsistent                 |

Lucide's fitness-adjacent set covers ~80% of the product. The remaining 20% (weight plate, sets/reps diagram, periodization chart, muscle-group anatomy) goes into the custom sprite.

**Import pattern (RSC-safe):**

```tsx
// In any Server Component — no "use client" needed
import { Dumbbell, HeartPulse, Timer, type LucideIcon } from 'lucide-react'

interface MetricProps {
  icon: LucideIcon
  label: string
  value: string
}

export function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon aria-hidden className="size-4 text-muted-foreground" />
      <span>
        {label}: {value}
      </span>
    </div>
  )
}
```

Always use **named imports** (`import { Dumbbell }`) — never default or namespace imports — so Turbopack tree-shakes correctly. Add an ESLint `no-restricted-imports` rule that bans `import * as Icons from "lucide-react"`. Verify in `next build` output: each icon should add ~0.1–0.5 KB to the route chunk.

### B.2 Icon sizes × typography scale

Lucide icons default to a 24×24 viewBox; render via Tailwind `size-*` utilities (Tailwind v4 supports `size-N` natively, applies both `width` + `height`). **Prefer `size-N` className over the `size` prop** — keeps everything responsive and CSS-overridable for white-label tweaks.

| Token      | Tailwind            | px       | Pairs with typography                                       |
| ---------- | ------------------- | -------- | ----------------------------------------------------------- |
| `icon-xs`  | `size-3`            | 12 px    | Eyebrow (10–12px), inline text-xs                           |
| `icon-sm`  | `size-4`            | 16 px    | body, body-small, Button (default), Badge, Input adornments |
| `icon-md`  | `size-5`            | 20 px    | h4, large Button, DataCell leading icon                     |
| `icon-lg`  | `size-6`            | 24 px    | h2, h3, Card headers, EmptyState media                      |
| `icon-xl`  | `size-8`            | 32 px    | display-md, Hero, large EmptyState illustration             |
| `icon-2xl` | `size-10`–`size-12` | 40–48 px | display-lg, splash, onboarding                              |

Optical alignment: pair `size-4` icons with `text-sm`/`text-base` using `gap-2` + `inline-flex items-center`. Lucide's default `strokeWidth={2}`; for icons inside `text-xs`/`size-3`, set `strokeWidth={1.5}` to avoid muddiness.

### B.3 Custom SVG strategy — **SVG sprite at `/public/icons/sprite.svg`**

**Decision**: SVG sprite served from `/public/icons/sprite.svg`, referenced via `<use href="/icons/sprite.svg#name"/>` inside a typed `<Icon name="...">` component. Lucide stays as a separate JSX-based library (hybrid).

**Why sprite, not inline JSX, for custom icons:**

- Inline JSX (SVGR) ships every SVG path inside `React.createElement` → ~3× bundle cost vs raw SVG and renders synchronously during hydration.
- A single `/public/icons/sprite.svg` is fetched once, cached with immutable hash + `Cache-Control: public, max-age=31536000`, and adds **zero JS bytes**.
- Chrome 137+ relaxed `<use>` ID limitations; `currentColor` works fully through `<use>`.

**Why sprite, not many inline `<svg>` blocks:** avoids duplicating path data when an icon appears N times (e.g. set-complete checkmark on every set row).

**Why NOT route Lucide through the sprite**: Lucide per-icon ESM already tree-shakes to ~0.1 KB per used icon. Forcing 100+ Lucide icons into a sprite would bloat the cached sprite ~30+ KB up-front. Hybrid wins: Lucide for 80%, sprite for 20%.

**Next.js 16 specifics (Turbopack default)**: as of late 2025, Turbopack loaders cannot emit additional files (no `this.emitFile`), so SVGR-sprite webpack plugins don't run under Turbopack. Practical solution: a **build-time script** (`pnpm icons:build`) that reads `components/icons/_source/*.svg`, runs SVGO, writes `public/icons/sprite.svg` and a typed `icon-names.ts` union — bundler-independent, committed to repo or generated in CI before `next build`. Note Safari 26.1 bug: filtered SVG symbols inside `<use>` don't render → for any glyph that needs `<filter>`, inline that one as JSX or apply CSS `filter:` on the parent `<svg>`.

**Folder structure:**

```
components/
  ds/
    icon.tsx              # <Icon name="..."/> sprite consumer
    icon-names.ts         # GENERATED: type IconName = "workout-glyph" | ...
  icons/
    _source/              # editable source SVGs (one per icon)
      workout-glyph.svg
      sets-reps.svg
      periodization.svg
      muscle-group-chest.svg
      weight-plate.svg
    build-sprite.mjs      # SVGO + sprite generator
public/
  icons/
    sprite.svg            # GENERATED, cached, served from CDN
```

**`<Icon>` component (RSC-safe):**

```tsx
// components/ds/icon.tsx — Server Component
import type { SVGProps } from 'react'
import type { IconName } from './icon-names'
import { cn } from '@/lib/utils'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  label?: string // if provided -> role="img" + aria-label; else aria-hidden
}

export function Icon({ name, label, className, ...props }: IconProps) {
  return (
    <svg
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
      className={cn('size-4 shrink-0', className)}
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  )
}
```

**Adding a new fitness icon (one-step maintenance):**

1. Drop `kettlebell.svg` into `components/icons/_source/`.
2. Run `pnpm icons:build` (locally or CI).
3. `icon-names.ts` regenerated with the new union; `<Icon name="kettlebell"/>` is type-safe immediately.

Beats hand-edited sprite XML and beats adding new inline JSX components.

### B.4 Accessibility — 4 patterns

| Pattern                                       | Markup                                                                                                             | When                                                                                                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decorative (icon next to visible text)**    | `<Dumbbell aria-hidden className="size-4"/>Workout`                                                                | Default for any icon adjacent to a text label in Button/Badge/DataCell — surrounding text already names the control.                                                                 |
| **Semantic standalone (no surrounding text)** | `<HeartPulse role="img" aria-label="Live heart rate"/>`                                                            | Status indicator where the icon IS the meaning (red flame = streak active); for sprite icons pass `label="..."` to `<Icon>`.                                                         |
| **Icon-only interactive control**             | `<button aria-label="Start timer"><Timer aria-hidden/></button>`                                                   | FAB, set-complete checkmark, play/pause — label sits on the _button_; icon stays `aria-hidden`. Alternative: wrap visible-but-hidden text in `<VisuallyHidden>` (more translatable). |
| **Already-labeled ancestor**                  | Inside `<button aria-label="Delete">` or `<a aria-labelledby="x">`, the icon gets **no aria beyond `aria-hidden`** | Never double-label — `aria-label` on both icon and button creates noisy screen-reader output.                                                                                        |

Rule of thumb: **the accessible name lives on the interactive element, never on the icon**. Icons are decorative 95% of the time.

### B.5 Multi-tenant — `currentColor` pattern & edge cases

All Lucide icons render with `stroke="currentColor"` and `fill="none"` by default → they inherit color from the parent's CSS `color` (Tailwind `text-*`). The custom sprite must follow the same rule: every path in `_source/*.svg` uses `stroke="currentColor"` or `fill="currentColor"`, no hard-coded hex.

**SVGO config in `build-sprite.mjs`**: enable `removeAttrs` to strip incoming `fill="#000"` / `stroke="#xxx"`, then inject `fill="currentColor"` (or `stroke`) on the `<symbol>`.

**Edge cases for white-label:**

- **Two-tone / brand-color icons** (e.g. tenant logo as a tile): do NOT route through `<Icon>`. Use a dedicated `<TenantLogo>` that resolves `var(--brand-primary)` / `var(--brand-accent)` from runtime CSS variables on `<html data-tenant="...">`.
- **Gradient fills inside an icon** (rare — e.g. periodization heatmap glyph): use `<linearGradient>` with stops `stop-color="var(--brand-primary)"` — works inline; works through sprite `<use>` since Chrome 75+/Safari 16.4+. Verify cross-browser visually.
- **Filter effects (drop-shadow)**: Safari 26.1 bug — filtered SVG symbols inside `<use>` don't render. Workaround: inline that icon as JSX or apply CSS `filter:` on the parent `<svg>`.
- **PWA icon manifest** (`/icons/icon-192.png`, etc.): unrelated to the sprite — keep raster + maskable PNGs for the manifest, tenant-overridable via a `next/manifest` route handler reading `tenant` from headers.

---

## Final Primitives List (12 total = 9 existing + 3 new)

| #   | Primitive          | Source                    | Why in DS                                         |
| --- | ------------------ | ------------------------- | ------------------------------------------------- |
| 1   | **Heading**        | own                       | Typography scale, asChild, tone variants          |
| 2   | **Text**           | own                       | Body styles, asChild                              |
| 3   | **Eyebrow**        | own                       | Small uppercase label above sections              |
| 4   | **Metric**         | own                       | Number + label + delta in dashboard cards         |
| 5   | **DataCell**       | own                       | Aligned key/value rows in workout/program details |
| 6   | **Code**           | own                       | Inline code for IDs, slugs, tenant keys           |
| 7   | **Section**        | own                       | Vertical rhythm wrapper with semantic tag         |
| 8   | **Stack**          | own                       | Layout primitive (gap + direction)                |
| 9   | **Badge**          | own (shadcn-styled)       | Status/tag chips with shape token                 |
| 10  | **Container**      | own (new)                 | Max-width + horizontal padding tokens             |
| 11  | **VisuallyHidden** | own (new)                 | SR-only labels for icon-only controls             |
| 12  | **EmptyState**     | wrap shadcn `Empty` (new) | Brand-defaulted empty surfaces                    |

**Consumed directly from shadcn (no DS wrapper):** Button, Skeleton, Avatar, Spinner, Kbd, Separator, Sonner, Card, Dialog, Sheet, DropdownMenu, Command, Tooltip, Tabs, Input, Label, Field, Item, Button Group, Input Group.

---

## Icon library decision summary

- **Library**: `lucide-react` — named imports, RSC-safe, ~0.1–0.5 KB per icon gzipped, `LucideIcon` type for prop forwarding.
- **Custom icons**: SVG sprite at `/public/icons/sprite.svg`, generated by `pnpm icons:build` from `components/icons/_source/`, consumed via `<Icon name="...">`.
- **Multi-tenant**: every path uses `currentColor`; brand-tinted assets bypass the DS Icon component.
- **A11y default**: `aria-hidden` on icons; accessible name lives on the interactive parent.

---

## Hour estimate — implement everything missing

| Task                                                                                                                 | Hours                                   |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `Container` primitive (cva + asChild + tests)                                                                        | 1.5                                     |
| `VisuallyHidden` (Radix wrapper)                                                                                     | 0.5                                     |
| `EmptyState` wrapper over shadcn `Empty` with defaults                                                               | 1.5                                     |
| Skeleton presets (WorkoutCard, ProgramList, Metric)                                                                  | 2.0                                     |
| `Divider` re-export with tokens                                                                                      | 0.5                                     |
| Lucide setup + ESLint `no-restricted-imports` rule (ban namespace imports)                                           | 1.0                                     |
| Icon size tokens added to `@theme` / Tailwind v4                                                                     | 0.5                                     |
| `<Icon>` sprite component + `IconName` codegen                                                                       | 2.0                                     |
| `build-sprite.mjs` (SVGO + symbol assembly + name-union output)                                                      | 2.5                                     |
| First 5 custom fitness SVGs (workout glyph, sets-reps, periodization, muscle group, weight plate) — source + cleanup | 3.0                                     |
| A11y patterns documented + Storybook/MDX examples                                                                    | 1.5                                     |
| Migration sweep (replace ad-hoc icons with `<Icon>` or Lucide)                                                       | 1.5                                     |
| Smoke tests + RSC boundary verification (asChild on Server/Client)                                                   | 2.0                                     |
| **Total**                                                                                                            | **~20 h (≈ 2.5 days for one engineer)** |

Add ~4 h buffer for the Next.js 16.0.10 / Radix Slot regression workaround if still unresolved when implementation starts.

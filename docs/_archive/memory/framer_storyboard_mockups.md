---
name: Framer Storyboard Mockups Pattern
description: Technical implementation of sticky-scroll product carousel with synchronized title animation and product tabs (Framer-style)
type: feedback
originSessionId: 084fed0c-7aee-4849-a186-8476cade0d67
---

## Pattern: Storyboard with Sticky Scroll

The ProductShowcase implements Framer's storyboard pattern for elegant product showcase with synchronized animations.

**How it works:**

1. **Scroll Tracking** — `useScroll` with offset `['start start', 'end start']` maps full section scroll range (N×100vh) to progress 0→1
2. **Title Animation** — slides up and exits during first tab's scroll range via `useTransform(progress, [0, 1/N], ['0px', '-260px'])`
3. **Carousel Tape** — entire product column transforms vertically: `useTransform(progress, [0, 1], ['0vh', `-${N\*100}vh`])`
4. **Active Tab Sync** — `useMotionValueEvent` updates activeIndex as user scrolls; tabs highlight + description expands/collapses
5. **Sticky Container** — `sticky top-0 h-screen` with left/right grid keeps layout fixed while tape scrolls underneath

**Why:**

- Framer-exact motion (not janky hardcoded transforms)
- Progress-based animations stay synchronized with scroll, never drift
- Mobile responsive: motion budget checks stickyScroll flag, falls back to vertical stack

**How to apply:**

- When adding more carousel sections, duplicate the pattern: section container (N×100vh height) → sticky inner grid → left content (static) + right tape (transform-Y)
- Always use `useTransform` for scroll-linked values, never `onScroll` callbacks
- Mobile: check MotionBudgetProvider flags before rendering expensive sticky layouts

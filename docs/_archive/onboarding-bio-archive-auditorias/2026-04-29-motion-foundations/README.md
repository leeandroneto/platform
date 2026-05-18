# Auditoria: motion foundations

**Data:** 2026-04-29
**Fase:** 25

## Estado pre-fase

- `lib/design/motion.ts`: nao existia
- Motion tokens CSS (`--motion-*`, `--ease-*`): nenhum
- `MotionConfig reducedMotion="user"`: nao existia no root
- Easings hardcoded em `components/motion/easings.ts` (3 exports)
- `useReducedMotion` usado em 56 files (maduro)
- `motion/react` importado em 140 files
- `framer-motion` imports: 0 (lint rule funciona)
- Componentes UI (shadcn) usam Tailwind animate-in/out, nao Motion presets

## Escopo executado

1. Tokens CSS: 6 durations + 4 easings em `globals.css @theme`
2. `lib/design/motion.ts`: durations, easings, transitions, variant presets
3. `MotionConfig reducedMotion="user"` no root via ThemeProvider
4. `components/motion/easings.ts` re-exporta da fonte canonica
5. Presets: fadeIn, slideUp, scaleIn, slideDown, stagger + staggerItem

## Decisao sobre componentes UI

Os componentes shadcn (drawer, alert-dialog, toast, skeleton, popover, tooltip,
tabs, accordion, combobox) ja tem animacoes via Tailwind CSS (animate-in/out,
animate-pulse, accordion-up/down). Substituir por Motion presets nao adiciona
valor — Tailwind CSS animations sao mais performaticas (compositor thread) e ja
respeitam `prefers-reduced-motion` via a regra global em globals.css.

Componentes que PRECISAM de Motion (layout animations, stagger, spring physics)
ja usam os primitivos em `components/motion/`. Os presets em `lib/design/motion.ts`
servem como fundacao para novos componentes e features (Fase 26+).

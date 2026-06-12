'use client'

// Material 3 motion presets — m3.material.io/styles/motion/easing-and-duration
// Consumir em componentes client: import { duration, ease, spring } from '@/lib/design/motion'
// Tarefa 14 (Checklist 15) · ADR-0008 (hierarquia universal) · stack travado em CLAUDE.md.

export const duration = {
  short1: 0.05,
  short2: 0.1,
  short3: 0.2,
  medium1: 0.3,
  medium2: 0.5,
  long1: 0.7,
} as const

export const ease = {
  standard: [0.2, 0, 0, 1],
  standardDecelerate: [0, 0, 0, 1],
  standardAccelerate: [0.3, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
} as const

export const spring = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30, mass: 1 },
  gentle: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 1 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 12, mass: 1 },
  slow: { type: 'spring' as const, stiffness: 50, damping: 25, mass: 1 },
} as const

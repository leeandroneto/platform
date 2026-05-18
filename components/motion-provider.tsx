// RESEARCH: motion/react MotionConfig — wrapper client component (ADR-0040 + blueprint 05 §6).
// reducedMotion="user" respeita prefers-reduced-motion do OS (W3C MediaQuery — accessibility).
// transition padrao 260ms easing premium quiet (Linear-leaning). Wraps todo conteudo dinamico
// dentro do RouteProvider — feature components herdam config automatico.

'use client'

import { type ReactNode } from 'react'

import { MotionConfig } from 'motion/react'

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }}>
      {children}
    </MotionConfig>
  )
}

// RESEARCH: tweakcn (Apache-2.0) — copied from components/horizontal-scroll-area.tsx
// ADAPT:
//   1. 'use client' directive added (Next 16 App Router — uses browser IntersectionObserver)
//   2. Import path adjusted: useScrollStartEnd → @/lib/hooks/use-scroll-start-end
//   3. ScrollArea/ScrollBar from @/components/ui/scroll-area (unchanged)
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-horizontal-scroll-area",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Horizontal scroll area with fade gradients at edges for the theme studio tab navigation",
 *   "examples": [],
 *   "when_to_use": ["theme studio tab lists that may overflow on small screens"],
 *   "anti_patterns": ["vertical scroll — use shadcn ScrollArea directly"],
 *   "related": ["theme-studio-control-panel", "theme-studio-preview-panel"],
 *   "vertical": null
 * }
 */
'use client'

import * as React from 'react'

import { useScrollStartEnd } from '@/lib/hooks/use-scroll-start-end'
import { cn } from '@/lib/utils'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type HorizontalScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollArea>

export function HorizontalScrollArea({ className, children, ...props }: HorizontalScrollAreaProps) {
  const { isScrollStart, isScrollEnd, scrollStartRef, scrollEndRef } = useScrollStartEnd()

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'from-background/75 pointer-events-none absolute inset-x-0  z-10 h-full bg-linear-to-r to-transparent to-10% opacity-0 transition-opacity',
          isScrollStart ? 'opacity-0' : 'opacity-100',
        )}
      />
      <div
        className={cn(
          'from-background/75 pointer-events-none absolute inset-x-0  z-10 h-full bg-linear-to-l to-transparent to-10% opacity-0 transition-opacity',
          isScrollEnd ? 'opacity-0' : 'opacity-100',
        )}
      />

      <ScrollArea {...props}>
        <div
          className={cn('relative flex w-fit flex-row items-center justify-start gap-2', className)}
        >
          <div ref={scrollStartRef} className="absolute inset-y-0 left-px" />
          {children}
          <div ref={scrollEndRef} className="absolute inset-y-0 right-px" />
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  )
}

// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/theme-preview/examples-preview-container.tsx
// See NOTICE.md.
// ADAPT:
//   1. @/components/loading → inline LoadingDots (component not ported to platform yet; JIT)
//   2. 'use client' not needed — RSC (Suspense is supported in RSC)

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-examples-preview-container",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Wrapper container with Suspense fallback for theme studio preview examples. RSC. Adapted from TweakCN examples-preview-container.",
 *   "examples": [],
 *   "when_to_use": ["wrapping lazy-loaded preview tabs inside theme studio preview panel"],
 *   "anti_patterns": ["standalone usage outside theme studio preview flow"],
 *   "related": ["theme-studio-preview-panel", "theme-studio-components-showcase"],
 *   "vertical": null
 * }
 */

import { Suspense } from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'

// ADAPT: Loading component not ported — inline minimal dots equivalent
const LoadingDots = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="flex space-x-2">
      <div className="bg-primary size-3  animate-bounce rounded-full [animation-delay:-0.3s]" />
      <div className="bg-primary size-3  animate-bounce rounded-full [animation-delay:-0.15s]" />
      <div className="bg-primary size-3  animate-bounce rounded-full" />
    </div>
  </div>
)

const LoadingSkeleton = () => (
  <div className="absolute inset-0 flex flex-col">
    <div className="flex flex-1 flex-col">
      <Skeleton className="w-full flex-1 opacity-50" />
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <LoadingDots />
    </div>
  </div>
)

const ExamplesPreviewContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="@container mt-0 size-full  space-y-6">
        <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
      </div>
    </div>
  )
}

export default ExamplesPreviewContainer

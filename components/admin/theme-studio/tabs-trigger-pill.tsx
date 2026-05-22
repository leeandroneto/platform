// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/theme-preview/tabs-trigger-pill.tsx
// ADAPT:
//   1. 'use client' directive added (Next 16 App Router — uses client-side TabsTrigger events)
//   2. Import path adjusted to @/components/ui/tabs
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-tabs-trigger-pill",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Pill-styled tab trigger for the theme studio tab navigation (control panel + preview panel tabs)",
 *   "examples": [],
 *   "when_to_use": ["theme studio tab lists — control panel and preview panel"],
 *   "anti_patterns": ["generic tab navigation outside theme studio — use shadcn TabsTrigger directly"],
 *   "related": ["theme-studio-control-panel", "theme-studio-preview-panel"],
 *   "vertical": null
 * }
 */
'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { TabsTrigger } from '@/components/ui/tabs'

const TabsTriggerPill = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsTrigger>) => {
  return (
    <TabsTrigger
      className={cn(
        'ring-offset-background focus-visible:ring-ring data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground hover:text-muted-foreground/70 inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  )
}

export default TabsTriggerPill

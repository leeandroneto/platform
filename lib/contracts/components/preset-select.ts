// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/preset-select.tsx.
// SSOT Zod schema pra ThemePresetSelect props (§15.1 B). See NOTICE.md.
//
// ThemePresetSelectProps extends React.ComponentProps<typeof Button>. Zod
// modela apenas as props custom (withCycleThemes); o resto é capturado via
// type intersection com React.ComponentProps<typeof Button>.

import type React from 'react'
import { z } from 'zod'

import type { Button } from '@/components/ui/button'

export const ThemePresetSelectOwnPropsSchema = z.object({
  /** Show prev/next cycle buttons next to the popover trigger. */
  withCycleThemes: z.boolean().optional(),
})

export type ThemePresetSelectOwnProps = z.infer<typeof ThemePresetSelectOwnPropsSchema>

/**
 * Full props type. Intersection com `React.ComponentProps<typeof Button>`
 * porque ThemePresetSelect repassa props nativas (variant, size, onClick, etc)
 * pro Button interno. Zod não modela ComponentProps — capturado via TS.
 */
export type ThemePresetSelectProps = ThemePresetSelectOwnProps & React.ComponentProps<typeof Button>

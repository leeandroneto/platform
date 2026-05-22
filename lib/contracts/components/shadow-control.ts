// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/shadow-control.tsx.
// SSOT Zod schema pra ShadowControl props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

/**
 * onChange unifica updates de string (shadow-color) e number (opacity/blur/
 * spread/offsets). Discriminated por `key` no callsite.
 */
export type ShadowControlOnChangeFn = (key: string, value: string | number) => void

export const ShadowControlPropsSchema = z.object({
  /** Shadow base color (OKLCH or hex string). */
  shadowColor: z.string(),
  /** Shadow opacity (0..1). */
  shadowOpacity: z.number(),
  /** Shadow blur radius in pixels. */
  shadowBlur: z.number(),
  /** Shadow spread radius in pixels. */
  shadowSpread: z.number(),
  /** Shadow offset on X axis in pixels. */
  shadowOffsetX: z.number(),
  /** Shadow offset on Y axis in pixels. */
  shadowOffsetY: z.number(),
  /** Unified change handler — receives the shadow primitive key and new value. */
  onChange: z.custom<ShadowControlOnChangeFn>((v) => typeof v === 'function'),
})

export type ShadowControlProps = z.infer<typeof ShadowControlPropsSchema>

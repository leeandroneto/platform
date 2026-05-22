// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/hsl-preset-button.tsx.
// SSOT Zod schema pra HslPresetButton props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

/**
 * Pure HSL adjustment function injected by parent.
 * Generic enough that Zod runtime check is only `typeof === 'function'`;
 * type signature is preserved via TS inference.
 */
export type AdjustColorByHslFn = (
  color: string,
  hueShift: number,
  saturationScale: number,
  lightnessScale: number,
) => string

export const HslPresetButtonPropsSchema = z.object({
  /** Human-readable label shown in the tooltip. */
  label: z.string(),
  /** Hue offset in degrees applied to the base palette. */
  hueShift: z.number(),
  /** Saturation multiplier (0..n) applied to the base palette. */
  saturationScale: z.number(),
  /** Lightness multiplier (0..n) applied to the base palette. */
  lightnessScale: z.number(),
  /** Base background color (OKLCH or hex string). */
  baseBg: z.string(),
  /** Base primary color (OKLCH or hex string). */
  basePrimary: z.string(),
  /** Optional base secondary color (defaults to neutral gray when omitted). */
  baseSecondary: z.string().optional(),
  /** Click handler — applies this preset to the theme. */
  onClick: z.custom<() => void>((v) => typeof v === 'function'),
  /** Whether this preset is currently selected. */
  selected: z.boolean(),
  /** HSL adjustment function injected by parent (pure). */
  adjustColorByHsl: z.custom<AdjustColorByHslFn>((v) => typeof v === 'function'),
})

export type HslPresetButtonProps = z.infer<typeof HslPresetButtonPropsSchema>

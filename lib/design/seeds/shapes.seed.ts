// lib/design/seeds/shapes.seed.ts
// Source of truth pra seed inicial de platform.shape_presets (ADR-0028).
// 3 presets oficiais.

export interface ShapePresetSeed {
  slug: string
  display_name: string
  description: string
  radius_base: string
  radius_sm: string
  radius_md: string
  radius_lg: string
  radius_xl: string
  sort_order: number
}

export const OFFICIAL_SHAPE_PRESETS: readonly ShapePresetSeed[] = [
  {
    slug: 'sharp',
    display_name: 'Sharp',
    description: 'Quase sem arredondamento — visual técnico/editorial',
    radius_base: '0.25rem',
    radius_sm: '0.125rem',
    radius_md: '0.1875rem',
    radius_lg: '0.25rem',
    radius_xl: '0.375rem',
    sort_order: 1,
  },
  {
    slug: 'rounded',
    display_name: 'Rounded',
    description: 'Arredondado equilibrado — default premium (Linear/Vercel)',
    radius_base: '0.625rem',
    radius_sm: '0.375rem',
    radius_md: '0.5rem',
    radius_lg: '0.625rem',
    radius_xl: '0.875rem',
    sort_order: 2,
  },
  {
    slug: 'pill',
    display_name: 'Pill',
    description: 'Bem arredondado — visual amigável/casual',
    radius_base: '1rem',
    radius_sm: '0.625rem',
    radius_md: '0.875rem',
    radius_lg: '1rem',
    radius_xl: '1.25rem',
    sort_order: 3,
  },
] as const

export type ShapePresetSlug = (typeof OFFICIAL_SHAPE_PRESETS)[number]['slug']

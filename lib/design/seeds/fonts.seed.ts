// lib/design/seeds/fonts.seed.ts
// Source of truth pra seed inicial de platform.fonts (ADR-0028).
// 7 fontes oficiais via next/font/google.

export interface FontSeed {
  slug: string
  display_name: string
  family_name: string // pra CSS font-family fallback
  provider: 'next-font-google' | 'next-font-local' | 'self-hosted'
  weights: readonly number[]
  subsets: readonly string[]
  sort_order: number
}

export const OFFICIAL_FONTS: readonly FontSeed[] = [
  {
    slug: 'geist',
    display_name: 'Geist',
    family_name: 'Geist',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    sort_order: 1,
  },
  {
    slug: 'inter',
    display_name: 'Inter',
    family_name: 'Inter',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    sort_order: 2,
  },
  {
    slug: 'outfit',
    display_name: 'Outfit',
    family_name: 'Outfit',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    sort_order: 3,
  },
  {
    slug: 'lora',
    display_name: 'Lora',
    family_name: 'Lora',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    sort_order: 4,
  },
  {
    slug: 'manrope',
    display_name: 'Manrope',
    family_name: 'Manrope',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700, 800],
    subsets: ['latin'],
    sort_order: 5,
  },
  {
    slug: 'plus-jakarta-sans',
    display_name: 'Plus Jakarta Sans',
    family_name: 'Plus Jakarta Sans',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    sort_order: 6,
  },
  {
    slug: 'space-grotesk',
    display_name: 'Space Grotesk',
    family_name: 'Space Grotesk',
    provider: 'next-font-google',
    weights: [400, 500, 600, 700],
    subsets: ['latin'],
    sort_order: 7,
  },
] as const

export type FontSlug = (typeof OFFICIAL_FONTS)[number]['slug']

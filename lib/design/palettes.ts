// lib/design/palettes.ts — public API pra paletas oficiais.
//
// Re-export do seed `lib/design/seeds/palettes.seed.ts` (long data file, ADR-0031 §9
// override). Callsites importam daqui — nao do seed direto — pra ergonomia + tornar
// possivel adicionar helpers de lookup sem mexer no seed gigante.

import { OFFICIAL_PALETTES, type PaletteSeed, type PaletteSlug } from './seeds/palettes.seed'

export { OFFICIAL_PALETTES, type PaletteSeed, type PaletteSlug }

export function getPaletteBySlug(slug: PaletteSlug): PaletteSeed | undefined {
  return OFFICIAL_PALETTES.find((p) => p.slug === slug)
}

export function getPaletteOrThrow(slug: PaletteSlug): PaletteSeed {
  const palette = getPaletteBySlug(slug)
  if (!palette) {
    throw new Error(`Palette not found: ${slug}`)
  }
  return palette
}

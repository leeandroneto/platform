// lib/design/palettes.ts — public API pra paletas oficiais.
//
// Re-export do seed `lib/design/seeds/palettes.seed.ts` (long data file, ADR-0031 §9
// override). Callsites importam daqui — nao do seed direto — pra ergonomia + tornar
// possivel adicionar helpers de lookup sem mexer no seed gigante.
//
// Audit Fase 1.5 (2026-05-22): throw new Error template literal → AppError.notFound
// com i18n key/fallback (alinha rule i18n.md AppError factory).

import { AppError } from '@/lib/contracts/errors'

import { OFFICIAL_PALETTES, type PaletteSeed, type PaletteSlug } from './seeds/palettes.seed'

export { OFFICIAL_PALETTES, type PaletteSeed, type PaletteSlug }

export function getPaletteBySlug(slug: PaletteSlug): PaletteSeed | undefined {
  return OFFICIAL_PALETTES.find((p) => p.slug === slug)
}

export function getPaletteOrThrow(slug: PaletteSlug): PaletteSeed {
  const palette = getPaletteBySlug(slug)
  if (!palette) {
    throw AppError.notFound({
      key: 'palettes.not_found',
      fallback: `Palette not found: ${slug}`,
      metadata: { slug },
    })
  }
  return palette
}

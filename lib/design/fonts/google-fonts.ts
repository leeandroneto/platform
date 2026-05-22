// RESEARCH: tweakcn (Apache-2.0) — copied from utils/fonts/google-fonts.ts
// See NOTICE.md.
// ADAPT: import paths → @/lib/design/contract/fonts
//
// Audit Fase 1.5 (2026-05-22):
//   - throw new Error template literal → AppError.from (i18n key/fallback)
//   - console.log removido (server-only side-effect; observability via Sentry)
//   - AppError.invalidInput aceita I18nMessage object (rule i18n.md)

import { AppError } from '@/lib/contracts/errors'
import type { FontInfo, GoogleFont, GoogleFontsAPIResponse } from '@/lib/design/contract/fonts'

export const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts'

export async function fetchGoogleFonts(googleFontsApiKey: string | undefined): Promise<FontInfo[]> {
  try {
    if (!googleFontsApiKey)
      throw AppError.invalidInput({
        key: 'fonts.google_api_key_missing',
        fallback: 'Google Fonts API key is required',
      })

    const response = await fetch(`${GOOGLE_FONTS_API_URL}?key=${googleFontsApiKey}`)

    if (!response.ok)
      throw AppError.externalService({
        key: 'fonts.google_api_error',
        fallback: `Google Fonts API error: ${response.status}`,
        metadata: { status: response.status },
      })

    const data: GoogleFontsAPIResponse = await response.json()

    // Transform to our format
    const fonts: FontInfo[] = data.items.map((font: GoogleFont) => ({
      family: font.family,
      category: font.category,
      variants: font.variants,
      variable: font.variants.some(
        (variant: string) => variant.includes('wght') || variant.includes('ital,wght'),
      ),
    }))

    return fonts
  } catch (error) {
    // Rethrow as AppError. AppError.from() is idempotent — returns input
    // unchanged if already an AppErrorImpl instance (see lib/contracts/errors.ts).
    throw AppError.from(error)
  }
}

// Build Google Fonts CSS API URL
export function buildFontCssUrl(family: string, weights: string[] = ['400']): string {
  const encodedFamily = encodeURIComponent(family)
  const weightsParam = weights.join(';') // Use semicolon for Google Fonts API v2
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightsParam}&display=swap`
}

// Simple font loading using native browser APIs
// Just use a <link> tag - seems to be the recommended approach
export function loadGoogleFont(family: string, weights: string[] = ['400', '700']): void {
  if (typeof document === 'undefined') return

  // Check if already loaded
  const href = buildFontCssUrl(family, weights)
  const existing = document.querySelector(`link[href="${href}"]`)
  if (existing) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

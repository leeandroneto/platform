// Tests for extractGoogleFontHref (TB12 fix) + buildFontCssUrl
// Coverage target: ≥70% lines + branches (rule component-creation-governance H)

import { describe, expect, it } from 'vitest'

import { buildFontCssUrl, extractGoogleFontHref } from '../google-fonts'

describe('buildFontCssUrl', () => {
  it('encodes font family and joins weights with semicolons', () => {
    const url = buildFontCssUrl('Poppins', ['400', '500', '600', '700'])
    expect(url).toBe(
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    )
  })

  it('handles font family with spaces via percent-encoding', () => {
    const url = buildFontCssUrl('Plus Jakarta Sans', ['400'])
    expect(url).toContain('Plus%20Jakarta%20Sans')
    expect(url).toContain('display=swap')
  })

  it('defaults to weight 400 when none supplied', () => {
    const url = buildFontCssUrl('Inter')
    expect(url).toContain(':wght@400')
  })
})

describe('extractGoogleFontHref', () => {
  it('extracts Google Fonts URL from a font stack with fallbacks', () => {
    const href = extractGoogleFontHref('Poppins, sans-serif')
    expect(href).toBe(
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    )
  })

  it('returns null for system-ui (system font)', () => {
    expect(extractGoogleFontHref('system-ui')).toBeNull()
  })

  it('returns null for sans-serif generic family', () => {
    expect(extractGoogleFontHref('sans-serif')).toBeNull()
  })

  it('returns null for serif generic family', () => {
    expect(extractGoogleFontHref('serif')).toBeNull()
  })

  it('returns null for monospace generic family', () => {
    expect(extractGoogleFontHref('monospace')).toBeNull()
  })

  it('returns Google Fonts URL for Geist (it IS a Google Font — fallback to system via CSS var)', () => {
    // Geist is not in SYSTEM_FONTS; extractFontFamily returns 'Geist'.
    // The CSS variable --font-geist-sans set by next/font takes specificity over
    // any Google Fonts <link> loading (next/font self-hosts), so this link is
    // effectively a no-op in practice but not an error.
    const href = extractGoogleFontHref('Geist, ui-sans-serif, system-ui, sans-serif')
    expect(href).toBe(
      'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
    )
  })

  it('returns null for undefined input', () => {
    expect(extractGoogleFontHref(undefined)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractGoogleFontHref('')).toBeNull()
  })

  it('extracts Lora (serif Google Font) correctly', () => {
    const href = extractGoogleFontHref('Lora, ui-serif, serif')
    expect(href).toBe(
      'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
    )
  })

  it('extracts font family with quotes stripped', () => {
    // CSS can have quoted font names: "Playfair Display", serif
    const href = extractGoogleFontHref('"Playfair Display", serif')
    expect(href).toContain('Playfair%20Display')
    expect(href).toContain('display=swap')
  })

  it('accepts custom weights override', () => {
    const href = extractGoogleFontHref('Inter, sans-serif', ['400', '700'])
    expect(href).toBe('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap')
  })

  it('returns null for ui-sans-serif (system font)', () => {
    expect(extractGoogleFontHref('ui-sans-serif, system-ui, sans-serif')).toBeNull()
  })
})

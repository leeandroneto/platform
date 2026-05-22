// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/font-picker.tsx
// POPULAR_FONTS constant extracted to own file (Fase 4 decompose — LOC compliance).
// Original: tweakcn-ref/components/editor/font-picker.tsx (POPULAR_FONTS inline).
// See NOTICE.md.

import type { FontInfo } from '@/lib/design/contract/fonts'

/**
 * Curated list of popular Google Fonts per category.
 * Shown as suggestions when no search query is active.
 * When category === 'all', a cross-category mix is shown (see font-picker.tsx).
 */
export const POPULAR_FONTS: Record<string, FontInfo[]> = {
  'sans-serif': [
    {
      family: 'Inter',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Roboto',
      category: 'sans-serif',
      variants: ['100', '300', '400', '500', '700', '900'],
      variable: false,
    },
    {
      family: 'Open Sans',
      category: 'sans-serif',
      variants: ['300', '400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Poppins',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: false,
    },
    {
      family: 'Montserrat',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Lato',
      category: 'sans-serif',
      variants: ['100', '300', '400', '700', '900'],
      variable: false,
    },
    {
      family: 'Nunito',
      category: 'sans-serif',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Raleway',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'DM Sans',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Plus Jakarta Sans',
      category: 'sans-serif',
      variants: ['200', '300', '400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Geist',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
  ],
  serif: [
    {
      family: 'Playfair Display',
      category: 'serif',
      variants: ['400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Merriweather',
      category: 'serif',
      variants: ['300', '400', '700', '900'],
      variable: false,
    },
    {
      family: 'Lora',
      category: 'serif',
      variants: ['400', '500', '600', '700'],
      variable: true,
    },
    {
      family: 'PT Serif',
      category: 'serif',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Noto Serif',
      category: 'serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Source Serif 4',
      category: 'serif',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Libre Baskerville',
      category: 'serif',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'EB Garamond',
      category: 'serif',
      variants: ['400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Crimson Text',
      category: 'serif',
      variants: ['400', '600', '700'],
      variable: false,
    },
    {
      family: 'Bitter',
      category: 'serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
  ],
  monospace: [
    {
      family: 'JetBrains Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Fira Code',
      category: 'monospace',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
    {
      family: 'Source Code Pro',
      category: 'monospace',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Roboto Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700'],
      variable: true,
    },
    {
      family: 'IBM Plex Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700'],
      variable: false,
    },
    {
      family: 'Space Mono',
      category: 'monospace',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Ubuntu Mono',
      category: 'monospace',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Inconsolata',
      category: 'monospace',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Geist Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Anonymous Pro',
      category: 'monospace',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Red Hat Mono',
      category: 'monospace',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
  ],
  display: [
    { family: 'Bebas Neue', category: 'display', variants: ['400'], variable: false },
    { family: 'Abril Fatface', category: 'display', variants: ['400'], variable: false },
    { family: 'Righteous', category: 'display', variants: ['400'], variable: false },
    {
      family: 'Fredoka',
      category: 'display',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Lobster', category: 'display', variants: ['400'], variable: false },
    {
      family: 'Comfortaa',
      category: 'display',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Alfa Slab One', category: 'display', variants: ['400'], variable: false },
    { family: 'Bungee', category: 'display', variants: ['400'], variable: false },
    { family: 'Lilita One', category: 'display', variants: ['400'], variable: false },
    { family: 'Permanent Marker', category: 'display', variants: ['400'], variable: false },
  ],
  handwriting: [
    {
      family: 'Dancing Script',
      category: 'handwriting',
      variants: ['400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Pacifico', category: 'handwriting', variants: ['400'], variable: false },
    {
      family: 'Caveat',
      category: 'handwriting',
      variants: ['400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Satisfy', category: 'handwriting', variants: ['400'], variable: false },
    { family: 'Great Vibes', category: 'handwriting', variants: ['400'], variable: false },
    { family: 'Sacramento', category: 'handwriting', variants: ['400'], variable: false },
    {
      family: 'Kalam',
      category: 'handwriting',
      variants: ['300', '400', '700'],
      variable: false,
    },
    { family: 'Patrick Hand', category: 'handwriting', variants: ['400'], variable: false },
    { family: 'Indie Flower', category: 'handwriting', variants: ['400'], variable: false },
    {
      family: 'Shadows Into Light',
      category: 'handwriting',
      variants: ['400'],
      variable: false,
    },
  ],
}

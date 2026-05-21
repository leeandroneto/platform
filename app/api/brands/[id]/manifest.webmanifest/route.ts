// app/api/brands/[id]/manifest.webmanifest/route.ts — PWA manifest dinamico per-brand.
// Fallback quando route resolve pra brand-root (sem tenant). Mesma estrutura que tenant route.

import { NextResponse } from 'next/server'

import { oklchToHex } from '@/lib/design/contrast'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'
import { createAdminClient } from '@/lib/supabase/admin'

interface BrandManifestData {
  brand_id: string
  brand_name: string
  theme_version: number
  primary_oklch: string
  surface_dark_oklch: string
  default_vertical: string
}

// Pós-pivot ADR-0044 + Fase 1.5: brands.default_palette_id removida; até Fase 4
// entregar tenant_themes/_versions, manifest usa DEFAULT_THEME canonical.
async function getBrandManifestData(brandId: string): Promise<BrandManifestData | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('brands')
    .select('id, name, theme_version, default_vertical')
    .eq('id', brandId)
    .maybeSingle()

  if (error || !data) return null

  return {
    brand_id: data.id as string,
    brand_name: data.name as string,
    theme_version: (data.theme_version as number) ?? 1,
    primary_oklch: DEFAULT_THEME.light.primary,
    surface_dark_oklch: DEFAULT_THEME.dark.background,
    default_vertical: (data.default_vertical as string) ?? 'fitness',
  }
}

function buildManifest(data: BrandManifestData): Record<string, unknown> {
  const iconBase = `/api/brands/${data.brand_id}/icon`
  const v = data.theme_version

  return {
    // id unico per-brand — segrega PWA install state entre marcas filhas.
    id: `/?b=${data.brand_id}`,
    name: data.brand_name,
    short_name: data.brand_name.slice(0, 12),
    description: `${data.brand_name} — plataforma`,
    start_url: '/portal',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait',
    lang: 'pt-BR',
    background_color: oklchToHex(data.surface_dark_oklch),
    theme_color: oklchToHex(data.primary_oklch),
    categories: [data.default_vertical, 'lifestyle', 'health'],
    icons: [
      { src: `${iconBase}/192?v=${v}`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${iconBase}/512?v=${v}`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${iconBase}/192?v=${v}`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: `${iconBase}/512?v=${v}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getBrandManifestData(id)

  if (!data) {
    return NextResponse.json(
      { error: 'brand_not_found' },
      {
        status: 404,
        headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
      },
    )
  }

  return NextResponse.json(buildManifest(data), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
    },
  })
}

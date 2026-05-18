// app/api/brands/[id]/manifest.webmanifest/route.ts — PWA manifest dinamico per-brand.
// Fallback quando route resolve pra brand-root (sem tenant). Mesma estrutura que tenant route.

import { NextResponse } from 'next/server'

import { oklchToHex } from '@/lib/design/contrast'
import { createAdminClient } from '@/lib/supabase/admin'

interface BrandManifestData {
  brand_id: string
  brand_name: string
  theme_version: number
  primary_oklch: string
  surface_dark_oklch: string
  default_vertical: string
}

async function getBrandManifestData(brandId: string): Promise<BrandManifestData | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('brands')
    .select(
      `
      id,
      name,
      theme_version,
      default_vertical,
      palette:default_palette_id ( primary_oklch, surfaces_dark )
    `,
    )
    .eq('id', brandId)
    .maybeSingle()

  if (error || !data) return null

  const palette = data.palette as unknown as {
    primary_oklch: string
    surfaces_dark: string[]
  }

  return {
    brand_id: data.id as string,
    brand_name: data.name as string,
    theme_version: (data.theme_version as number) ?? 1,
    primary_oklch: palette.primary_oklch,
    surface_dark_oklch: palette.surfaces_dark[0] ?? 'oklch(0.13 0.01 275)',
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

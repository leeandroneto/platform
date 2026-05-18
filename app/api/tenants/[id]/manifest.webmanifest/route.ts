// app/api/tenants/[id]/manifest.webmanifest/route.ts — PWA manifest dinamico per-tenant.
// Lookup tenant + brand fallback em platform.{tenants,brands}. Emite JSON manifest
// W3C-spec (background_color/theme_color hex via oklchToHex). Icones apontam pra
// /api/tenants/[id]/icon/[size]. Cache-Control immutable + ?v=theme_version.

import { NextResponse } from 'next/server'

import { oklchToHex } from '@/lib/design/contrast'
import { createAdminClient } from '@/lib/supabase/admin'

interface TenantManifestData {
  tenant_name: string
  tenant_id: string
  theme_version: number
  primary_oklch: string
  surface_dark_oklch: string
  default_vertical: string
}

async function getTenantManifestData(tenantId: string): Promise<TenantManifestData | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tenants')
    .select(
      `
      id,
      name,
      theme_version,
      brand:brand_id ( default_vertical ),
      palette:palette_id ( primary_oklch, surfaces_dark )
    `,
    )
    .eq('id', tenantId)
    .maybeSingle()

  if (error || !data) return null

  const palette = data.palette as unknown as {
    primary_oklch: string
    surfaces_dark: string[]
  }
  const brand = data.brand as unknown as { default_vertical: string }

  return {
    tenant_name: data.name as string,
    tenant_id: data.id as string,
    theme_version: (data.theme_version as number) ?? 1,
    primary_oklch: palette.primary_oklch,
    surface_dark_oklch: palette.surfaces_dark[0] ?? 'oklch(0.13 0.01 275)',
    default_vertical: brand.default_vertical ?? 'fitness',
  }
}

function buildManifest(data: TenantManifestData): Record<string, unknown> {
  const iconBase = `/api/tenants/${data.tenant_id}/icon`
  const v = data.theme_version

  return {
    // id unico per-tenant — previne split-brain se start_url mudar (W3C spec).
    // Tenants diferentes = PWAs diferentes pro navegador (separa install state).
    id: `/?t=${data.tenant_id}`,
    name: data.tenant_name,
    short_name: data.tenant_name.slice(0, 12),
    description: `${data.tenant_name} — programa online`,
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
  const data = await getTenantManifestData(id)

  if (!data) {
    return NextResponse.json(
      { error: 'tenant_not_found' },
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

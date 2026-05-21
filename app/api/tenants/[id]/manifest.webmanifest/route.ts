// app/api/tenants/[id]/manifest.webmanifest/route.ts — PWA manifest dinamico per-tenant.
// Lookup tenant + brand fallback em platform.{tenants,brands}. Emite JSON manifest
// W3C-spec (background_color/theme_color hex via oklchToHex). Icones apontam pra
// /api/tenants/[id]/icon/[size]. Cache-Control immutable + ?v=theme_version.

import { NextResponse } from 'next/server'

import { oklchToHex } from '@/lib/design/contrast'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'
import { createAdminClient } from '@/lib/supabase/admin'

interface TenantManifestData {
  tenant_name: string
  tenant_id: string
  theme_version: number
  primary_oklch: string
  surface_dark_oklch: string
  default_vertical: string
}

interface ManifestSnapshotColors {
  primary_oklch: string
  surface_dark_oklch: string
}

function extractManifestColors(activeVersion: unknown): ManifestSnapshotColors {
  const snapshot = (
    activeVersion as {
      snapshot?: { light?: { primary?: string }; dark?: { background?: string } }
    } | null
  )?.snapshot
  return {
    primary_oklch: snapshot?.light?.primary ?? DEFAULT_THEME.light.primary,
    surface_dark_oklch: snapshot?.dark?.background ?? DEFAULT_THEME.dark.background,
  }
}

// Fase 4 ADR-0044: consume `active_theme_version.snapshot` quando disponível,
// fallback DEFAULT_THEME (tenant sem bootstrap ou erro de hidratação).
async function getTenantManifestData(tenantId: string): Promise<TenantManifestData | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tenants')
    .select(
      `
      id,
      name,
      theme_version,
      active_theme_version:active_theme_version_id ( id, version_number, snapshot ),
      brand:brand_id ( default_vertical )
    `,
    )
    .eq('id', tenantId)
    .maybeSingle()

  if (error || !data) return null

  const brand = data.brand as unknown as { default_vertical: string }
  const colors = extractManifestColors(data.active_theme_version)

  return {
    tenant_name: data.name as string,
    tenant_id: data.id as string,
    theme_version: (data.theme_version as number) ?? 1,
    primary_oklch: colors.primary_oklch,
    surface_dark_oklch: colors.surface_dark_oklch,
    default_vertical: brand?.default_vertical ?? 'fitness',
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

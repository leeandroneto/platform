// app/api/tenants/[id]/icon/[size]/route.ts — Icones PWA dinamicos per-tenant via Satori.
// Renderiza inicial do tenant.name em fundo primary OKLCH → PNG. size aceita 192/512/etc.
// JIT futuro: ler tenant.logo_url do storage `tenant-logos` quando upload existir.
// Cache-Control immutable + manifest cita ?v=theme_version pra bust.

import { ImageResponse } from 'next/og'

import { oklchToHex } from '@/lib/design/contrast'
import { createAdminClient } from '@/lib/supabase/admin'

interface TenantIconData {
  tenant_name: string
  primary_oklch: string
  primary_foreground_oklch: string
}

async function getTenantIconData(tenantId: string): Promise<TenantIconData | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tenants')
    .select(
      `
      name,
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

  // Foreground sobre primary — usa surface escura como contrast (texto branco-ish).
  // Quando seed ganhar primary_foreground_oklch column (Sprint 2), usar ela direto.
  return {
    tenant_name: data.name as string,
    primary_oklch: palette.primary_oklch,
    primary_foreground_oklch: 'oklch(0.98 0.01 275)',
  }
}

const SIZE_BOUNDS = { min: 16, max: 1024 } as const

function parseSize(raw: string): number {
  const n = Number.parseInt(raw, 10)
  if (Number.isNaN(n)) return 192
  return Math.max(SIZE_BOUNDS.min, Math.min(SIZE_BOUNDS.max, n))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; size: string }> },
) {
  const { id, size } = await params
  const data = await getTenantIconData(id)

  if (!data) {
    return new Response('tenant_not_found', { status: 404 })
  }

  const sizeNum = parseSize(size)
  const bgHex = oklchToHex(data.primary_oklch)
  const fgHex = oklchToHex(data.primary_foreground_oklch)
  const initial = data.tenant_name.slice(0, 1).toUpperCase() || 'P'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bgHex,
        color: fgHex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: sizeNum * 0.5,
        fontFamily: 'sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
    >
      {initial}
    </div>,
    {
      width: sizeNum,
      height: sizeNum,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    },
  )
}

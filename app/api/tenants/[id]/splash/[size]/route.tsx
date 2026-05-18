// app/api/tenants/[id]/splash/[size]/route.tsx — iOS PWA splash screens dinamicos via Satori.
// 3 sizes principais 2026 (cobertura ~80% devices ativos):
//   1290x2796 — iPhone 17/16/15 Pro Max
//   1179x2556 — iPhone 17/16/15 Pro/standard
//   2048x2732 — iPad Pro generico
// JIT outros 3 sizes (1320x2868 iPhone 17 Pro Max, 1170x2532 iPhone 14 Pro, etc) quando
// tenant reclamar de fallback de cor solid no boot.

import { ImageResponse } from 'next/og'

import { oklchToHex } from '@/lib/design/contrast'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_SIZES: Record<string, { width: number; height: number }> = {
  '1290x2796': { width: 1290, height: 2796 }, // iPhone Pro Max
  '1179x2556': { width: 1179, height: 2556 }, // iPhone Pro/standard
  '2048x2732': { width: 2048, height: 2732 }, // iPad Pro
}

interface TenantSplashData {
  tenant_name: string
  primary_oklch: string
  surface_dark_oklch: string
}

async function getTenantSplashData(tenantId: string): Promise<TenantSplashData | null> {
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

  return {
    tenant_name: data.name as string,
    primary_oklch: palette.primary_oklch,
    surface_dark_oklch: palette.surfaces_dark[0] ?? 'oklch(0.13 0.01 275)',
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; size: string }> },
) {
  const { id, size } = await params
  const dims = ALLOWED_SIZES[size]

  if (!dims) {
    return new Response('invalid_splash_size', { status: 400 })
  }

  const data = await getTenantSplashData(id)
  if (!data) {
    return new Response('tenant_not_found', { status: 404 })
  }

  const bgHex = oklchToHex(data.surface_dark_oklch)
  const accentHex = oklchToHex(data.primary_oklch)
  // Wordmark centralizado, ~10% da menor dimensao. Cor primary contra surface escura.
  const fontSize = Math.floor(Math.min(dims.width, dims.height) * 0.08)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bgHex,
        color: accentHex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontFamily: 'sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
    >
      {data.tenant_name}
    </div>,
    {
      width: dims.width,
      height: dims.height,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    },
  )
}

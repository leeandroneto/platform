// app/api/brands/[id]/splash/[size]/route.tsx — iOS PWA splash dinamicos per-brand.
// Fallback quando route brand-root. Mesma estrutura que tenant splash.

import { ImageResponse } from 'next/og'

import { oklchToHex } from '@/lib/design/contrast'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_SIZES: Record<string, { width: number; height: number }> = {
  '1290x2796': { width: 1290, height: 2796 },
  '1179x2556': { width: 1179, height: 2556 },
  '2048x2732': { width: 2048, height: 2732 },
}

interface BrandSplashData {
  brand_name: string
  primary_oklch: string
  surface_dark_oklch: string
}

// Pós-pivot ADR-0044 + Fase 1.5: brands.default_palette_id removida; até Fase 4
// entregar tenant_themes/_versions, splash usa DEFAULT_THEME canonical.
async function getBrandSplashData(brandId: string): Promise<BrandSplashData | null> {
  const admin = createAdminClient()
  const { data, error } = await admin.from('brands').select('name').eq('id', brandId).maybeSingle()

  if (error || !data) return null

  return {
    brand_name: data.name as string,
    primary_oklch: DEFAULT_THEME.light.primary,
    surface_dark_oklch: DEFAULT_THEME.dark.background,
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

  const data = await getBrandSplashData(id)
  if (!data) {
    return new Response('brand_not_found', { status: 404 })
  }

  const bgHex = oklchToHex(data.surface_dark_oklch)
  const accentHex = oklchToHex(data.primary_oklch)
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
      {data.brand_name}
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

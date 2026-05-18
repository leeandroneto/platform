// app/api/brands/[id]/theme.css/route.ts — CSS via API route brand-level (D-G59 + ADR-0028).
// Lookup paleta default da marca via FK NOT NULL `brands.default_palette_id`.
// Usado em landing institucional brand-root (ex: desafit.app sem subdomain)
// onde não há tenant resolvido.
// Tenants subdomain/custom usam /api/tenants/[id]/theme.css.

import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

// Runtime: padrão Fluid Compute Node.js (Next 16 — vide knowledge-update).
// Cache: via Cache-Control header na response (CDN-level), não via route segment
// `revalidate` (incompat com cacheComponents — Next 16.2).

interface BrandTheme {
  default_palette: {
    primary_oklch: string
    primary_light_oklch: string | null
    secondary_oklch: string
    tertiary_oklch: string
    extras_oklch: string[]
    surfaces_dark: string[]
    surfaces_light: string[]
    hue: number
  }
}

async function getBrandTheme(brandId: string): Promise<BrandTheme | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .schema('platform')
    .from('brands')
    .select(
      `
      default_palette:default_palette_id (
        primary_oklch, primary_light_oklch, secondary_oklch, tertiary_oklch,
        extras_oklch, surfaces_dark, surfaces_light, hue
      )
    `,
    )
    .eq('id', brandId)
    .maybeSingle()

  if (error || !data?.default_palette) return null
  return data as unknown as BrandTheme
}

function renderCss(theme: BrandTheme): string {
  const p = theme.default_palette
  return `:root {
  --brand-hue: ${p.hue};
  --color-primary: ${p.primary_oklch};
  --color-primary-light: ${p.primary_light_oklch ?? p.primary_oklch};
  --color-secondary: ${p.secondary_oklch};
  --color-tertiary: ${p.tertiary_oklch};
  --color-chart-1: ${p.extras_oklch[0]};
  --color-chart-2: ${p.extras_oklch[1]};
  --color-chart-3: ${p.extras_oklch[2]};
  --color-chart-4: ${p.extras_oklch[3]};
  --color-chart-5: ${p.extras_oklch[4]};
  --color-surface-1: ${p.surfaces_dark[0]};
  --color-surface-2: ${p.surfaces_dark[1]};
  --color-surface-3: ${p.surfaces_dark[2]};
  --color-surface-4: ${p.surfaces_dark[3]};
  --color-surface-5: ${p.surfaces_dark[4]};
  --color-surface-light-1: ${p.surfaces_light[0]};
  --color-surface-light-2: ${p.surfaces_light[1]};
  --color-surface-light-3: ${p.surfaces_light[2]};
  --color-surface-light-4: ${p.surfaces_light[3]};
  --color-surface-light-5: ${p.surfaces_light[4]};
}`
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const theme = await getBrandTheme(id)

  if (!theme) {
    return new NextResponse('/* brand not found — using defaults from globals.css */', {
      status: 404,
      headers: { 'Content-Type': 'text/css; charset=utf-8' },
    })
  }

  return new NextResponse(renderCss(theme), {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
    },
  })
}

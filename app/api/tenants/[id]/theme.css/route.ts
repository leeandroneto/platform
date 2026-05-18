// app/api/tenants/[id]/theme.css/route.ts — CSS via API route (D-G59 + ADR-0028 + ADR-0029).
// Lookup palette + font + shape do tenant em platform.{palettes,fonts,shape_presets}.
// Paleta tenant pode ser CLONE (criada quando prof customiza) — herda da oficial.
// Emite OKLCH + font-family + radius como overrides das vars de globals.css.
// Componentes shadcn herdam automaticamente via @theme inline mapping.

import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

// Runtime: padrão Fluid Compute Node.js (Next 16). Cache: via Cache-Control
// header na response (CDN-level), não via `revalidate` (incompat com
// cacheComponents — Next 16.2).

interface TenantTheme {
  palette: {
    primary_oklch: string
    primary_light_oklch: string | null
    secondary_oklch: string
    tertiary_oklch: string
    extras_oklch: string[]
    surfaces_dark: string[]
    surfaces_light: string[]
    hue: number
  }
  font: {
    family_name: string
  }
  shape: {
    radius_base: string
    radius_sm: string
    radius_md: string
    radius_lg: string
    radius_xl: string
  }
  theme_version: number
}

async function getTenantTheme(tenantId: string): Promise<TenantTheme | null> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('tenants')
    .select(
      `
      theme_version,
      palette:palette_id (
        primary_oklch, primary_light_oklch, secondary_oklch, tertiary_oklch,
        extras_oklch, surfaces_dark, surfaces_light, hue
      ),
      font:font_id ( family_name ),
      shape:shape_preset_id (
        radius_base, radius_sm, radius_md, radius_lg, radius_xl
      )
    `,
    )
    .eq('id', tenantId)
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as TenantTheme
}

function renderCss(theme: TenantTheme): string {
  const { palette, font, shape } = theme

  return `:root {
  --brand-hue: ${palette.hue};
  --font-brand: '${font.family_name}', system-ui, sans-serif;
  --font-sans: var(--font-brand);

  --color-primary: ${palette.primary_oklch};
  --color-primary-light: ${palette.primary_light_oklch ?? palette.primary_oklch};
  --color-secondary: ${palette.secondary_oklch};
  --color-tertiary: ${palette.tertiary_oklch};

  --color-chart-1: ${palette.extras_oklch[0]};
  --color-chart-2: ${palette.extras_oklch[1]};
  --color-chart-3: ${palette.extras_oklch[2]};
  --color-chart-4: ${palette.extras_oklch[3]};
  --color-chart-5: ${palette.extras_oklch[4]};

  --color-surface-1: ${palette.surfaces_dark[0]};
  --color-surface-2: ${palette.surfaces_dark[1]};
  --color-surface-3: ${palette.surfaces_dark[2]};
  --color-surface-4: ${palette.surfaces_dark[3]};
  --color-surface-5: ${palette.surfaces_dark[4]};

  --color-surface-light-1: ${palette.surfaces_light[0]};
  --color-surface-light-2: ${palette.surfaces_light[1]};
  --color-surface-light-3: ${palette.surfaces_light[2]};
  --color-surface-light-4: ${palette.surfaces_light[3]};
  --color-surface-light-5: ${palette.surfaces_light[4]};

  --radius: ${shape.radius_base};
  --radius-sm: ${shape.radius_sm};
  --radius-md: ${shape.radius_md};
  --radius-lg: ${shape.radius_lg};
  --radius-xl: ${shape.radius_xl};
}`
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const theme = await getTenantTheme(id)

  if (!theme) {
    return new NextResponse('/* tenant theme not found — using defaults from globals.css */', {
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

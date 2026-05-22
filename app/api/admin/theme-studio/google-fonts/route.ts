// RESEARCH: tweakcn (Apache-2.0) — copied from app/api/google-fonts/route.ts
// See NOTICE.md.
// ADAPT:
//   1. env var via process.env.GOOGLE_FONTS_API_KEY direto sem lib/env.ts
//      ADAPT: env var deve ser adicionada ao lib/env.ts schema JIT quando feature ativar em prod.
//   2. imports → @/lib/design/fonts + @/lib/design/contract/fonts
//   3. Entitlement gate requireEntitlement('theme_studio') → DEFERRED Chunk 7
//   4. FALLBACK_FONTS + fetchGoogleFonts → @/lib/design/fonts

import { unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import type { PaginatedFontsResponse } from '@/lib/design/contract/fonts'
import { FALLBACK_FONTS } from '@/lib/design/fonts'
import { fetchGoogleFonts } from '@/lib/design/fonts/google-fonts'

const cachedFetchGoogleFonts = unstable_cache(fetchGoogleFonts, ['google-fonts-catalogue'], {
  tags: ['google-fonts-catalogue'],
})

export async function GET(request: NextRequest) {
  try {
    // ADAPT: env var deve ser adicionada ao lib/env.ts schema JIT quando feature ativar em prod.
    const apiKey = process.env.GOOGLE_FONTS_API_KEY ?? ''

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() ?? ''
    const category = searchParams.get('category')?.toLowerCase()
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100)
    const offset = Number(searchParams.get('offset')) || 0

    let googleFonts = FALLBACK_FONTS

    try {
      googleFonts = await cachedFetchGoogleFonts(apiKey)
    } catch (error) {
      console.error('Error fetching Google Fonts:', error)
      console.log('Using fallback fonts')
    }

    // Filter fonts based on search query and category
    let filteredFonts = googleFonts

    if (query) {
      filteredFonts = filteredFonts.filter((font) => font.family.toLowerCase().includes(query))
    }

    if (category && category !== 'all') {
      filteredFonts = filteredFonts.filter((font) => font.category === category)
    }

    const paginatedFonts = filteredFonts.slice(offset, offset + limit)

    const response: PaginatedFontsResponse = {
      fonts: paginatedFonts,
      total: filteredFonts.length,
      offset,
      limit,
      hasMore: offset + limit < filteredFonts.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in Google Fonts API:', error)
    return NextResponse.json({ error: 'Failed to fetch fonts' }, { status: 500 })
  }
}

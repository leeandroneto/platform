// RESEARCH: tweakcn (Apache-2.0) — adapted from app/r/themes/[id]/route.ts (multi-tenant + RLS)
// See NOTICE.md.
//
// ADAPTS vs original:
//   1. force-static removed → dynamic (tenant DB lookup + version param)
//   2. Built-in preset lookup removed → tenant_theme_versions via lib/data/themes
//   3. Single param `id` → two params `tenantId` + `version`
//   4. CORS Access-Control-Allow-Origin: * MAINTAINED (public registry endpoint)
//   5. registryItemSchema.safeParse validation MAINTAINED (shadcn schema)
//   6. generateRegistryItem from lib/design/registry/generate-registry-item.ts
//   7. Cache via cacheTag('theme:<tenantId>:<version>') — Next 16 cache tag API
//   8. No entitlement gate — endpoint is public (tenantId in path is authorization)
//   9. Admin client injected here (lib/data/ cannot import admin client)

import { cacheTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { connection } from 'next/server'

import { registryItemSchema } from 'shadcn/schema'

import { getTenantThemeWithVersion } from '@/lib/data/themes'
import { generateRegistryItem } from '@/lib/design/registry/generate-registry-item'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenantId: string; version: string }> },
) {
  await connection()
  const { tenantId, version: versionParam } = await params

  // Tag cache for Next 16 on-demand invalidation via revalidateTag()
  cacheTag(`theme:${tenantId}:${versionParam}`)

  const versionNumber = parseInt(versionParam.replace(/\.json$/, ''), 10)
  if (isNaN(versionNumber) || versionNumber < 1) {
    return new NextResponse('Invalid version number.', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Admin client bypasses RLS — safe here because tenantId is path-scoped
    // and the query filters by tenant_id via the join condition.
    const admin = createAdminClient()
    const { name, snapshot } = await getTenantThemeWithVersion(admin, tenantId, versionNumber)

    const registryName = `tenant-${tenantId}-v${versionNumber}`
    const generatedRegistryItem = generateRegistryItem({
      name: registryName,
      title: name,
      snapshot,
    })

    // Validate the generated registry item against the official shadcn registry item schema
    // https://ui.shadcn.com/docs/registry/registry-item-json
    const parsedRegistryItem = registryItemSchema.safeParse(generatedRegistryItem)
    if (!parsedRegistryItem.success) {
      console.error(
        'Could not parse the registry item from the database:',
        parsedRegistryItem.error.format(),
      )
      return new NextResponse('Unexpected registry item format.', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const registryItem = parsedRegistryItem.data
    return new NextResponse(JSON.stringify(registryItem), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
  } catch (e) {
    console.error('Error fetching the theme registry item:', e)
    return new NextResponse('Failed to fetch the theme registry item.', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

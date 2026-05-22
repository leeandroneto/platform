// lib/data/themes.ts — Data layer helpers for tenant theme resolution.
// Used by: app/admin/theme-studio/page.tsx (RSC server fetch)
//          app/api/r/themes/[tenantId]/[version]/route.ts (registry endpoint)
//
// Pattern: functions accept `client` as first argument and throw AppError on
// failure (canonical data-layer convention — rule data-layer.md).
// Callers create the appropriate Supabase client (server or admin) and inject.

import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { AppError } from '@/lib/contracts/errors'
import type { Theme } from '@/lib/design/contract/theme'
import { ThemeSchema } from '@/lib/design/contract/theme'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

// ─── getActiveThemeForTenant ─────────────────────────────────────────────────
// Resolves the active theme snapshot for the current authenticated tenant.
// Falls back to DEFAULT_THEME if no active version is set (lazy bootstrap
// not yet triggered). Used by page.tsx (RSC).
//
// Accepts server client (has JWT) — caller creates via createClient().

export async function getActiveThemeForTenant(client: SupabaseClient): Promise<Theme> {
  // Resolve current tenant from JWT via RPC
  const { data: tenantId, error: tenantErr } = await client.rpc('current_tenant_id')

  if (tenantErr || !tenantId) {
    // No tenant in JWT — return default (page will redirect via entitlement gate)
    return DEFAULT_THEME
  }

  const { data: tenant, error: tErr } = await client
    .from('tenants')
    .select('active_theme_version_id')
    .eq('id', tenantId)
    .maybeSingle()

  if (tErr || !tenant?.active_theme_version_id) {
    // No active version yet — bootstrap happens on first save
    return DEFAULT_THEME
  }

  const { data: version, error: vErr } = await client
    .from('tenant_theme_versions')
    .select('snapshot')
    .eq('id', tenant.active_theme_version_id)
    .maybeSingle()

  if (vErr || !version?.snapshot) {
    return DEFAULT_THEME
  }

  // Validate snapshot shape — corrupt data falls back to DEFAULT_THEME
  const parsed = ThemeSchema.safeParse(version.snapshot)
  if (!parsed.success) {
    return DEFAULT_THEME
  }

  return parsed.data
}

// ─── getTenantThemeWithVersion ───────────────────────────────────────────────
// Fetches a specific theme version snapshot by tenantId + versionNumber.
// Used by the registry endpoint (public — caller uses admin client for RLS bypass).
// Throws AppError.notFound if not found; AppError.internal on DB error.
//
// Accepts admin client — caller creates via createAdminClient() in route handler.

export async function getTenantThemeWithVersion(
  client: SupabaseClient,
  tenantId: string,
  versionNumber: number,
): Promise<{ name: string; snapshot: Theme }> {
  const { data, error } = await client
    .from('tenant_theme_versions')
    .select(
      `
      snapshot,
      tenant_themes!inner(
        name,
        tenant_id
      )
    `,
    )
    .eq('version_number', versionNumber)
    .eq('tenant_themes.tenant_id', tenantId)
    .maybeSingle()

  if (error) {
    throw AppError.internal({
      key: 'themes.db_error',
      fallback: 'Database error fetching theme version',
    })
  }

  if (!data) {
    throw AppError.notFound({
      key: 'themes.version_not_found',
      fallback: 'Theme version not found',
    })
  }

  // Cast nested join shape
  const themeRow = data.tenant_themes as unknown as { name: string; tenant_id: string }

  // Validate snapshot
  const parsed = ThemeSchema.safeParse(data.snapshot)
  if (!parsed.success) {
    throw AppError.internal({
      key: 'themes.snapshot_invalid',
      fallback: 'Theme snapshot failed validation',
    })
  }

  return { name: themeRow.name, snapshot: parsed.data }
}

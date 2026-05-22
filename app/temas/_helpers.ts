// app/temas/_helpers.ts — helpers internos das server actions.
// Não-action (sem `'use server'`); reside no diretório temas/
// pra co-localização. Importado só por ./actions.ts.

import 'server-only'

import { AppError } from '@/lib/contracts/errors'
import { fail, ok, type Result } from '@/lib/contracts/result'
import type { Theme } from '@/lib/design/contract/theme'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type AdminClient = ReturnType<typeof createAdminClient>

export interface BootstrapTenantThemeResult {
  themeId: string
  versionId: string
  versionNumber: number
  bootstrapped: boolean
}

export interface SaveThemeVersionResult {
  versionId: string
  versionNumber: number
}

// ─── Tenant match assertion ────────────────────────────────────────────────

async function getCurrentUserTenantId(): Promise<string | null> {
  const client = await createClient()
  const { data, error } = await client.rpc('current_tenant_id')
  if (error) return null
  return (data as string | null) ?? null
}

export async function assertTenantMatch(tenantId: string): Promise<void> {
  const current = await getCurrentUserTenantId()
  if (!current || current !== tenantId) {
    throw AppError.forbidden({
      key: 'themes.tenant_mismatch',
      fallback: 'Tenant mismatch — cannot operate on themes from another tenant',
    })
  }
}

// ─── AppError factory wrappers (evita `new Error('msg crua')`) ─────────────

function insertThemeFailedError(): AppError {
  return AppError.internal({
    key: 'themes.insert_theme_failed',
    fallback: 'Failed to insert tenant_themes row',
  })
}

function insertVersionFailedError(): AppError {
  return AppError.internal({
    key: 'themes.insert_version_failed',
    fallback: 'Failed to insert tenant_theme_versions row',
  })
}

// ─── Bootstrap helpers ─────────────────────────────────────────────────────

export async function loadExistingActiveVersion(
  admin: AdminClient,
  activeVersionId: string,
): Promise<Result<BootstrapTenantThemeResult>> {
  const { data: version, error: vErr } = await admin
    .from('tenant_theme_versions')
    .select('id, theme_id, version_number')
    .eq('id', activeVersionId)
    .maybeSingle()

  if (vErr || !version) {
    return fail(
      AppError.internal({
        key: 'themes.active_version_dangling',
        fallback: 'Active theme version FK points to missing row',
      }),
    )
  }

  return ok({
    themeId: version.theme_id,
    versionId: version.id,
    versionNumber: version.version_number,
    bootstrapped: false,
  })
}

export async function createDefaultThemeAndVersion(
  admin: AdminClient,
  tenantId: string,
): Promise<Result<BootstrapTenantThemeResult>> {
  const { data: theme, error: themeErr } = await admin
    .from('tenant_themes')
    .insert({ tenant_id: tenantId, name: 'Default', source: 'preset' })
    .select('id')
    .single()

  if (themeErr || !theme) {
    return fail(themeErr ? AppError.from(themeErr) : insertThemeFailedError())
  }

  const { data: version, error: versionErr } = await admin
    .from('tenant_theme_versions')
    .insert({ theme_id: theme.id, version_number: 1, snapshot: DEFAULT_THEME })
    .select('id, version_number')
    .single()

  if (versionErr || !version) {
    return fail(versionErr ? AppError.from(versionErr) : insertVersionFailedError())
  }

  const { error: updateErr } = await admin
    .from('tenants')
    .update({ active_theme_version_id: version.id })
    .eq('id', tenantId)

  if (updateErr) return fail(AppError.from(updateErr))

  return ok({
    themeId: theme.id,
    versionId: version.id,
    versionNumber: version.version_number,
    bootstrapped: true,
  })
}

// ─── Save helpers ──────────────────────────────────────────────────────────

export interface InsertVersionParams {
  themeId: string
  versionNumber: number
  snapshot: Theme
  promptText: string | null
  aiModelId: string | null
}

export async function insertVersion(
  admin: AdminClient,
  params: InsertVersionParams,
): Promise<Result<SaveThemeVersionResult>> {
  const { data: version, error: insertErr } = await admin
    .from('tenant_theme_versions')
    .insert({
      theme_id: params.themeId,
      version_number: params.versionNumber,
      snapshot: params.snapshot,
      prompt_text: params.promptText,
      ai_model_id: params.aiModelId,
    })
    .select('id, version_number')
    .single()

  if (insertErr || !version) {
    const message = insertErr?.message ?? ''
    if (message.includes('version cap reached')) {
      return fail(
        AppError.invalidInput({
          key: 'themes.version_limit_reached',
          fallback: 'Theme version cap reached (50). Delete old versions or create new theme.',
        }),
      )
    }
    return fail(insertErr ? AppError.from(insertErr) : insertVersionFailedError())
  }

  return ok({ versionId: version.id, versionNumber: version.version_number })
}

export async function getNextVersionNumber(
  admin: AdminClient,
  themeId: string,
): Promise<Result<number>> {
  const { data: maxRow, error: maxErr } = await admin
    .from('tenant_theme_versions')
    .select('version_number')
    .eq('theme_id', themeId)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (maxErr) return fail(AppError.from(maxErr))
  return ok((maxRow?.version_number ?? 0) + 1)
}

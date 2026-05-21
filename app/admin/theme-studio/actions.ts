// app/admin/theme-studio/actions.ts — Server actions Fase 4 do pivot ADR-0044.
// Adapted from tweakcn-ref/actions/themes.ts (Apache-2.0). See NOTICE.md.
//
// Pattern: Result<T, AppError> via ok()/fail() (rule server-actions + layers).
// Decisões cravadas: G.1 imutável-on-insert, G.2 cap 50 versions, G.3 fork JIT
// Fase 5, G.4 theme_mode separado em tenants.theme_mode, G.5 lazy bootstrap.
//
// 4 actions implementadas:
//   - bootstrapTenantTheme(tenantId)
//   - saveThemeVersion({ themeId, snapshot, promptText?, aiModelId? })
//   - listThemeVersions(themeId)
//   - restoreThemeVersion({ tenantId, versionId })
//
// NÃO criado: forkTheme, createTenantTheme (Fase 5 conforme G.3).

'use server'

import 'server-only'

import { AppError } from '@/lib/contracts/errors'
import { fail, ok, type Result } from '@/lib/contracts/result'
import { type Theme, ThemeSchema } from '@/lib/design/contract/theme'
import { createAdminClient } from '@/lib/supabase/admin'

import {
  assertTenantMatch,
  type BootstrapTenantThemeResult,
  createDefaultThemeAndVersion,
  getNextVersionNumber,
  insertVersion,
  loadExistingActiveVersion,
  type SaveThemeVersionResult,
} from './_helpers'

// ─── 1. bootstrapTenantTheme ────────────────────────────────────────────────
// Lazy bootstrap (G.5): se tenants.active_theme_version_id IS NULL, cria
// theme "Default" + version v1 (snapshot = DEFAULT_THEME) e seta FK.
// Idempotent: chamar múltiplas vezes não cria duplicatas.
//
// Usa admin client porque é flow de bootstrap — cross-RLS write controlado
// (verifica JWT match via assertTenantMatch antes de operar).

export type { BootstrapTenantThemeResult, SaveThemeVersionResult }

export async function bootstrapTenantTheme(
  tenantId: string,
): Promise<Result<BootstrapTenantThemeResult>> {
  try {
    await assertTenantMatch(tenantId)
    const admin = createAdminClient()

    const { data: tenant, error: tenantErr } = await admin
      .from('tenants')
      .select('id, active_theme_version_id')
      .eq('id', tenantId)
      .maybeSingle()

    if (tenantErr || !tenant) {
      return fail(
        AppError.notFound({ key: 'themes.tenant_not_found', fallback: 'Tenant not found' }),
      )
    }

    if (tenant.active_theme_version_id) {
      return loadExistingActiveVersion(admin, tenant.active_theme_version_id)
    }

    return createDefaultThemeAndVersion(admin, tenantId)
  } catch (err) {
    return fail(AppError.from(err))
  }
}

// ─── 2. saveThemeVersion ────────────────────────────────────────────────────
// Cria nova version imutável (G.1). Valida snapshot via Zod.
// version_number = max(existing) + 1. Race acceptable (UNIQUE constraint pega).
// Cap 50 versions enforced via trigger DB (G.2).

export interface SaveThemeVersionInput {
  themeId: string
  snapshot: unknown // Zod-validated dentro da action
  promptText?: string | null
  aiModelId?: string | null
}

export async function saveThemeVersion(
  input: SaveThemeVersionInput,
): Promise<Result<SaveThemeVersionResult>> {
  try {
    // 1. Validate snapshot shape
    const parsed = ThemeSchema.safeParse(input.snapshot)
    if (!parsed.success) {
      return fail(
        AppError.invalidInput(
          { key: 'themes.snapshot_invalid', fallback: 'Theme snapshot failed Zod validation' },
          { issues: parsed.error.issues },
        ),
      )
    }

    const admin = createAdminClient()

    // 2. Validate theme ownership (RLS via JWT match)
    const { data: theme, error: themeErr } = await admin
      .from('tenant_themes')
      .select('id, tenant_id')
      .eq('id', input.themeId)
      .maybeSingle()

    if (themeErr || !theme) {
      return fail(AppError.notFound({ key: 'themes.theme_not_found', fallback: 'Theme not found' }))
    }

    await assertTenantMatch(theme.tenant_id)

    // 3. Compute next version_number
    const nextRes = await getNextVersionNumber(admin, input.themeId)
    if (!nextRes.ok) return nextRes

    // 4. INSERT new version (trigger cap 50 protege)
    const insertRes = await insertVersion(admin, {
      themeId: input.themeId,
      versionNumber: nextRes.data,
      snapshot: parsed.data as unknown as Theme,
      promptText: input.promptText ?? null,
      aiModelId: input.aiModelId ?? null,
    })
    if (!insertRes.ok) return insertRes

    // 5. Touch tenant_themes.updated_at (signal lineage activity)
    await admin
      .from('tenant_themes')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', input.themeId)

    return insertRes
  } catch (err) {
    return fail(AppError.from(err))
  }
}

// ─── 3. listThemeVersions ───────────────────────────────────────────────────
// Lista até 50 versions de um theme em ordem decrescente.
// Inclui flag is_active comparando com tenants.active_theme_version_id.

export interface ThemeVersionListItem {
  id: string
  versionNumber: number
  createdAt: string
  isActive: boolean
  hasPrompt: boolean
}

export async function listThemeVersions(themeId: string): Promise<Result<ThemeVersionListItem[]>> {
  try {
    const admin = createAdminClient()

    // 1. Validate theme ownership
    const { data: theme, error: themeErr } = await admin
      .from('tenant_themes')
      .select('id, tenant_id')
      .eq('id', themeId)
      .maybeSingle()

    if (themeErr || !theme) {
      return fail(AppError.notFound({ key: 'themes.theme_not_found', fallback: 'Theme not found' }))
    }

    await assertTenantMatch(theme.tenant_id)

    // 2. Get tenant's active version id pra comparar
    const { data: tenant } = await admin
      .from('tenants')
      .select('active_theme_version_id')
      .eq('id', theme.tenant_id)
      .maybeSingle()

    const activeVersionId = tenant?.active_theme_version_id ?? null

    // 3. List versions
    const { data: versions, error: vErr } = await admin
      .from('tenant_theme_versions')
      .select('id, version_number, created_at, prompt_text')
      .eq('theme_id', themeId)
      .order('version_number', { ascending: false })
      .limit(50)

    if (vErr) return fail(AppError.from(vErr))

    return ok(
      (versions ?? []).map((v) => ({
        id: v.id,
        versionNumber: v.version_number,
        createdAt: v.created_at,
        isActive: v.id === activeVersionId,
        hasPrompt: v.prompt_text != null,
      })),
    )
  } catch (err) {
    return fail(AppError.from(err))
  }
}

// ─── 4. restoreThemeVersion ─────────────────────────────────────────────────
// Swap da FK tenants.active_theme_version_id. NÃO cria cópia (decisão D.2.a).
// Valida que a version pertence a um theme do tenant requisitante (RLS-like
// check via admin client + tenant match).

export interface RestoreThemeVersionInput {
  tenantId: string
  versionId: string
}

export interface RestoreThemeVersionResult {
  activeVersionId: string
  activeVersionNumber: number
}

export async function restoreThemeVersion(
  input: RestoreThemeVersionInput,
): Promise<Result<RestoreThemeVersionResult>> {
  try {
    await assertTenantMatch(input.tenantId)

    const admin = createAdminClient()

    // 1. Validate version exists + belongs to a theme owned by tenant
    const { data: version, error: vErr } = await admin
      .from('tenant_theme_versions')
      .select('id, version_number, theme_id, tenant_themes!inner(tenant_id)')
      .eq('id', input.versionId)
      .maybeSingle()

    if (vErr || !version) {
      return fail(
        AppError.notFound({
          key: 'themes.version_not_found',
          fallback: 'Theme version not found',
        }),
      )
    }

    // tenant_themes!inner traz objeto único; cast pra shape conhecida
    const themeOwner = version.tenant_themes as unknown as { tenant_id: string }
    if (themeOwner.tenant_id !== input.tenantId) {
      return fail(
        AppError.forbidden({
          key: 'themes.tenant_mismatch',
          fallback: 'Version belongs to a theme from another tenant',
        }),
      )
    }

    // 2. Swap FK
    const { error: updateErr } = await admin
      .from('tenants')
      .update({ active_theme_version_id: version.id })
      .eq('id', input.tenantId)

    if (updateErr) return fail(AppError.from(updateErr))

    return ok({
      activeVersionId: version.id,
      activeVersionNumber: version.version_number,
    })
  } catch (err) {
    return fail(AppError.from(err))
  }
}

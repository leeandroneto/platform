// app/admin/theme-studio/actions.ts — Server actions Fase 4+7 do pivot ADR-0044.
// Adapted from tweakcn-ref/actions/themes.ts (Apache-2.0). See NOTICE.md.
//
// Pattern: Result<T, AppError> via ok()/fail() (rule server-actions + layers).
// Decisões cravadas: G.1 imutável-on-insert, G.2 cap 50 versions, G.3 fork (Fase 7),
// G.4 theme_mode separado em tenants.theme_mode, G.5 lazy bootstrap.
//
// 5 actions implementadas (Fase 4 + Fase 7):
//   - bootstrapTenantTheme(tenantId)
//   - saveThemeVersion({ themeId, snapshot, promptText?, aiModelId?, ignoreApcaWarning? })
//   - listThemeVersions(themeId)
//   - restoreThemeVersion({ tenantId, versionId })
//   - forkTheme({ themeId, name? }) — G.3, Fase 7

'use server'

import 'server-only'

import { z } from 'zod'

import { AppError } from '@/lib/contracts/errors'
import { fail, ok, type Result } from '@/lib/contracts/result'
import { type Theme, ThemeSchema } from '@/lib/design/contract/theme'
import { validateThemeAPCA } from '@/lib/design/contrast'
import { requireEntitlement } from '@/lib/entitlements/server'
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
  /**
   * Soft-warn bypass (ADR-0045 D.17).
   * When true, saves the theme even if APCA Silver validation fails.
   * UI must surface failures to user before allowing bypass.
   */
  ignoreApcaWarning?: boolean
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

    // 3. APCA dual-gate (ADR-0045 D.17 soft warn)
    // Runs after ownership so we don't leak info about non-owned themes.
    const apcaResult = validateThemeAPCA(parsed.data as unknown as Theme)
    if (!apcaResult.ok) return apcaResult

    const { passed: apcaPassed, failures: apcaFailures } = apcaResult.data
    if (!apcaPassed && !input.ignoreApcaWarning) {
      return fail(
        AppError.invalidInput(
          { key: 'theme.apca.failed', fallback: 'Tema falhou validação APCA Silver' },
          { failures: apcaFailures },
        ),
      )
    }

    // 4. Compute next version_number
    const nextRes = await getNextVersionNumber(admin, input.themeId)
    if (!nextRes.ok) return nextRes

    // 5. INSERT new version (trigger cap 50 protege)
    const insertRes = await insertVersion(admin, {
      themeId: input.themeId,
      versionNumber: nextRes.data,
      snapshot: parsed.data as unknown as Theme,
      promptText: input.promptText ?? null,
      aiModelId: input.aiModelId ?? null,
    })
    if (!insertRes.ok) return insertRes

    // 6. Touch tenant_themes.updated_at (signal lineage activity)
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

// ─── 5. forkTheme ────────────────────────────────────────────────────────────
// Clona theme + última version pra nova row tenant_themes (G.3, Fase 7).
// parent_theme_id self-FK registra lineage (migration 0025).
// Retorna { id } do novo theme — UI pode navegar direto pro fork.

const ForkThemeInputSchema = z.object({
  themeId: z.string().uuid({ message: 'themeId must be a valid UUID' }),
  name: z.string().min(1).max(255).optional(),
})

export interface ForkThemeResult {
  id: string
}

/**
 * Fork: clona theme + última version pra nova row tenant_themes.
 * parent_theme_id self-FK registra lineage (migration 0025 G.3).
 *
 * @param input.themeId — theme a clonar
 * @param input.name — nome opcional (default: "<original> (fork)")
 */
export async function forkTheme(
  input: z.infer<typeof ForkThemeInputSchema>,
): Promise<Result<ForkThemeResult>> {
  try {
    // 1. Validate input
    const parsed = ForkThemeInputSchema.safeParse(input)
    if (!parsed.success) {
      return fail(
        AppError.invalidInput(
          { key: 'themes.fork_invalid_input', fallback: 'Invalid fork input' },
          { issues: parsed.error.issues },
        ),
      )
    }

    const admin = createAdminClient()

    // 2. Load source theme (validates ownership via tenant match)
    const { data: sourceTheme, error: themeErr } = await admin
      .from('tenant_themes')
      .select('id, tenant_id, name')
      .eq('id', parsed.data.themeId)
      .maybeSingle()

    if (themeErr || !sourceTheme) {
      return fail(AppError.notFound({ key: 'themes.theme_not_found', fallback: 'Theme not found' }))
    }

    // requireEntitlement gate (static import at top) — throws AppError.forbidden if denied
    try {
      await requireEntitlement('theme_studio')
    } catch (err) {
      return fail(AppError.from(err))
    }

    await assertTenantMatch(sourceTheme.tenant_id)

    // 3. Load latest version snapshot from source theme
    const { data: latestVersion, error: vErr } = await admin
      .from('tenant_theme_versions')
      .select('snapshot')
      .eq('theme_id', parsed.data.themeId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (vErr || !latestVersion) {
      return fail(
        AppError.notFound({
          key: 'themes.version_not_found',
          fallback: 'No version found for source theme',
        }),
      )
    }

    // 4. INSERT new tenant_themes row with parent_theme_id = themeId
    const forkName = parsed.data.name ?? `${sourceTheme.name} (fork)`
    const { data: newTheme, error: insertThemeErr } = await admin
      .from('tenant_themes')
      .insert({
        tenant_id: sourceTheme.tenant_id,
        name: forkName,
        source: 'custom',
        parent_theme_id: parsed.data.themeId,
      })
      .select('id')
      .single()

    if (insertThemeErr || !newTheme) {
      return fail(
        insertThemeErr
          ? AppError.from(insertThemeErr)
          : AppError.internal({
              key: 'themes.insert_theme_failed',
              fallback: 'Failed to insert forked tenant_themes row',
            }),
      )
    }

    // 5. INSERT version v1 with snapshot copied from source
    const { error: insertVersionErr } = await admin.from('tenant_theme_versions').insert({
      theme_id: newTheme.id,
      version_number: 1,
      snapshot: latestVersion.snapshot,
    })

    if (insertVersionErr) {
      return fail(AppError.from(insertVersionErr))
    }

    return ok({ id: newTheme.id })
  } catch (err) {
    return fail(AppError.from(err))
  }
}

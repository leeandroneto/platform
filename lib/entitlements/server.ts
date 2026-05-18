// lib/entitlements/server.ts — runtime helpers server-side (ADR-0039 supersede ADR-0034 §4).
//
// Mudanca chave: RPCs PostgreSQL substituem queries diretas.
//  - requireEntitlement -> can_use_feature(tenant_id, feature)
//  - getEntitlement -> get_entitlement(tenant_id, feature) RETURNS TABLE
//  - requireQuota -> can_use_feature + read feature_usage row
//  - getQuotaSnapshot -> get_entitlement reading usage jsonb
//  - incrementQuotaUsage -> update_feature_quota_usage(tenant_id, feature, delta)
//
// getEntitlementSnapshot ainda le plans.features direto (bulk pra hidratar Provider).
// RPCs sao usadas pra decisoes per-feature onde atomicidade importa.
//
// Cache in-memory 60s por tenant na leitura bulk (snapshot) — nao no can_use_feature
// porque DB e fonte de verdade pra quota mutavel.
//
// NOTE: types das RPCs novas (can_use_feature, get_entitlement, update_feature_quota_usage)
// ainda nao estao em lib/contracts/database.ts — PostgREST schema cache descongelar +
// `pnpm supabase gen types > lib/contracts/database.ts`. Casts localizados marcados com `// TYPES-PENDING`.

import 'server-only'

import { PlanFeaturesSchema, PlanSlugSchema } from '@/lib/contracts/entitlements'
import { AppError } from '@/lib/contracts/errors'
import { createClient } from '@/lib/supabase/server'

import type { EntitlementResolution, PlanFeatures, PlanSlug, QuotaSnapshot } from './types'

const CACHE_TTL_MS = 60_000
interface CacheEntry {
  slug: PlanSlug
  features: PlanFeatures
  expiresAt: number
}
const cache = new Map<string, CacheEntry>()

interface GetEntitlementRow {
  plan_slug: string
  feature_value: unknown
  usage: { count?: number } | null
  period_end: string | null
}

async function getCurrentTenantId(): Promise<string | null> {
  const client = await createClient()
  const tenantRpc = await client.rpc('current_tenant_id')
  return tenantRpc.data ?? null
}

async function loadSnapshotForCurrentTenant(): Promise<CacheEntry | null> {
  const client = await createClient()

  const tenantRpc = await client.rpc('current_tenant_id')
  const tenantId = tenantRpc.data
  if (!tenantId) return null

  const cached = cache.get(tenantId)
  if (cached && cached.expiresAt > Date.now()) return cached

  const subRes = await client
    .from('subscriptions')
    .select('package')
    .is('cancelled_at', null)
    .is('deleted_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!subRes.data?.package) return null

  const slugParsed = PlanSlugSchema.safeParse(subRes.data.package)
  if (!slugParsed.success) {
    throw AppError.internal(
      `Invalid plan slug in subscriptions table: ${subRes.data.package}`,
      slugParsed.error,
    )
  }

  const planRes = await client
    .from('plans')
    .select('slug, features')
    .eq('slug', slugParsed.data)
    .eq('is_active', true)
    .maybeSingle()

  if (!planRes.data) return null

  const featuresParsed = PlanFeaturesSchema.safeParse(planRes.data.features)
  if (!featuresParsed.success) {
    throw AppError.internal(
      `Invalid features jsonb in plans.${slugParsed.data}`,
      featuresParsed.error,
    )
  }

  const slugRowParsed = PlanSlugSchema.safeParse(planRes.data.slug)
  if (!slugRowParsed.success) {
    throw AppError.internal(`Invalid plan slug in plans table: ${planRes.data.slug}`)
  }

  const entry: CacheEntry = {
    slug: slugRowParsed.data,
    features: featuresParsed.data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  }
  cache.set(tenantId, entry)
  return entry
}

function buildUpgradeUrl(feature: string): string {
  return `/upgrade?feature=${encodeURIComponent(feature)}`
}

/**
 * Resolve entitlement pra feature via RPC can_use_feature (atomic DB lookup).
 * Combina com snapshot pra retornar plan slug + upgrade URL.
 */
export async function resolveEntitlement(feature: string): Promise<EntitlementResolution> {
  const tenantId = await getCurrentTenantId()
  if (!tenantId) {
    return { allowed: false, plan: null, upgradeUrl: buildUpgradeUrl(feature) }
  }

  const client = await createClient()
  // TYPES-PENDING: regenerar database.ts apos PostgREST cache descongelar.
  const rpc = (
    client.rpc as unknown as (
      fn: 'can_use_feature',
      args: { p_tenant_id: string; p_feature: string },
    ) => Promise<{ data: boolean | null; error: unknown }>
  )('can_use_feature', { p_tenant_id: tenantId, p_feature: feature })

  const { data: allowed, error } = await rpc
  if (error) {
    throw AppError.internal(`can_use_feature RPC failed for feature=${feature}`, error)
  }

  const snapshot = await loadSnapshotForCurrentTenant()
  const plan = snapshot?.slug ?? null
  return {
    allowed: allowed === true,
    plan,
    upgradeUrl: allowed ? null : buildUpgradeUrl(feature),
  }
}

/**
 * Lança AppError.forbidden() se o tenant atual não tem entitlement.
 * Use em route handlers + server actions ANTES da lógica.
 */
export async function requireEntitlement(feature: string): Promise<void> {
  const resolved = await resolveEntitlement(feature)
  if (resolved.allowed) return
  throw AppError.forbidden({
    key: 'entitlements.feature_blocked',
    fallback: `Feature "${feature}" requires plan upgrade`,
    metadata: { feature, plan: resolved.plan },
  })
}

/** Features completas do plano do tenant atual (null se sem subscription). */
export async function getEntitlements(): Promise<PlanFeatures | null> {
  const data = await loadSnapshotForCurrentTenant()
  return data?.features ?? null
}

/**
 * Snapshot completo features + plan slug — usado no layout pra hidratar
 * o EntitlementProvider (server → client boundary).
 */
export async function getEntitlementSnapshot(): Promise<{
  features: PlanFeatures | null
  plan: PlanSlug | null
}> {
  const data = await loadSnapshotForCurrentTenant()
  return { features: data?.features ?? null, plan: data?.slug ?? null }
}

/**
 * Snapshot de quota corrente vs limite via RPC get_entitlement.
 * Substitui assinatura antiga (key, currentCount) — count agora vem do DB
 * (tabela feature_usage atualizada por update_feature_quota_usage).
 */
export async function getQuotaSnapshot(key: keyof PlanFeatures): Promise<QuotaSnapshot> {
  const tenantId = await getCurrentTenantId()
  if (!tenantId) return { used: 0, limit: 0, nearLimit: true }

  const client = await createClient()
  // TYPES-PENDING: regenerar database.ts apos PostgREST cache descongelar.
  const rpc = (
    client.rpc as unknown as (
      fn: 'get_entitlement',
      args: { p_tenant_id: string; p_feature: string },
    ) => Promise<{ data: GetEntitlementRow[] | null; error: unknown }>
  )('get_entitlement', { p_tenant_id: tenantId, p_feature: String(key) })

  const { data, error } = await rpc
  if (error) {
    throw AppError.internal(`get_entitlement RPC failed for feature=${String(key)}`, error)
  }

  const row = data?.[0]
  if (!row) return { used: 0, limit: 0, nearLimit: true }

  const used = row.usage?.count ?? 0
  const rawLimit = typeof row.feature_value === 'number' ? row.feature_value : null
  if (rawLimit === null) {
    return { used, limit: null, nearLimit: false }
  }
  const limit = rawLimit === -1 ? null : rawLimit
  const nearLimit = limit !== null && used >= limit * 0.8
  return { used, limit, nearLimit }
}

/** Lança AppError.forbidden() se a quota numérica foi atingida. */
export async function requireQuota(key: keyof PlanFeatures): Promise<void> {
  const tenantId = await getCurrentTenantId()
  if (!tenantId) {
    throw AppError.forbidden({
      key: 'entitlements.feature_blocked',
      fallback: 'Tenant not resolved',
      metadata: { feature: String(key) },
    })
  }

  const client = await createClient()
  // TYPES-PENDING: regenerar database.ts apos PostgREST cache descongelar.
  const rpc = (
    client.rpc as unknown as (
      fn: 'can_use_feature',
      args: { p_tenant_id: string; p_feature: string },
    ) => Promise<{ data: boolean | null; error: unknown }>
  )('can_use_feature', { p_tenant_id: tenantId, p_feature: String(key) })

  const { data: allowed, error } = await rpc
  if (error) {
    throw AppError.internal(`can_use_feature RPC failed for quota=${String(key)}`, error)
  }

  if (allowed === true) return

  const snapshot = await getQuotaSnapshot(key)
  throw AppError.forbidden({
    key: 'entitlements.quota_exceeded',
    fallback: `Quota "${String(key)}" reached: ${snapshot.used}/${snapshot.limit ?? '∞'}`,
    metadata: { feature: String(key), used: snapshot.used, limit: snapshot.limit },
  })
}

/**
 * Incrementa (ou decrementa, com delta negativo) contador de quota via RPC.
 * Chame APOS criar/deletar recurso. UPSERT atomico no DB, idempotente >= 0.
 */
export async function incrementQuotaUsage(
  key: keyof PlanFeatures,
  delta: number = 1,
): Promise<void> {
  const tenantId = await getCurrentTenantId()
  if (!tenantId) {
    throw AppError.internal('Cannot increment quota: tenant not resolved')
  }

  const client = await createClient()
  // TYPES-PENDING: regenerar database.ts apos PostgREST cache descongelar.
  const rpc = (
    client.rpc as unknown as (
      fn: 'update_feature_quota_usage',
      args: { p_tenant_id: string; p_feature: string; p_delta: number },
    ) => Promise<{ data: null; error: unknown }>
  )('update_feature_quota_usage', {
    p_tenant_id: tenantId,
    p_feature: String(key),
    p_delta: delta,
  })

  const { error } = await rpc
  if (error) {
    throw AppError.internal(`update_feature_quota_usage RPC failed for ${String(key)}`, error)
  }
}

/** Invalida cache do tenant (chame após mudança de plano via webhook Stripe). */
export function invalidateEntitlementCache(tenantId?: string) {
  if (tenantId) cache.delete(tenantId)
  else cache.clear()
}

// lib/entitlements/server.ts — runtime helpers server-side (ADR-0034 §4).
// Lê subscription do tenant atual (via JWT) e resolve features do plano.
// Cache in-memory TTL 60s por tenant pra evitar DB lookup por request.
//
// Boundary DB → runtime usa Zod parse (PlanFeaturesSchema + PlanSlugSchema)
// pra falhar com erro tipado se shape do jsonb drift.

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

async function loadForCurrentTenant(): Promise<CacheEntry | null> {
  const client = await createClient()

  // 1) Tenant atual via JWT claim (RLS helper).
  const tenantRpc = await client.rpc('current_tenant_id')
  const tenantId = tenantRpc.data
  if (!tenantId) return null

  // 2) Cache hit pelo tenant_id.
  const cached = cache.get(tenantId)
  if (cached && cached.expiresAt > Date.now()) return cached

  // 3) Subscription ativa do tenant (RLS já filtra pelo tenant atual).
  const subRes = await client
    .from('subscriptions')
    .select('package')
    .is('cancelled_at', null)
    .is('deleted_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!subRes.data?.package) return null

  // Validação de boundary: se DB tem valor fora do enum, falha explícito.
  const slugParsed = PlanSlugSchema.safeParse(subRes.data.package)
  if (!slugParsed.success) {
    throw AppError.internal(
      `Invalid plan slug in subscriptions table: ${subRes.data.package}`,
      slugParsed.error,
    )
  }

  // 4) Features do plano. RLS de public.plans permite SELECT anon+authenticated
  // quando is_active=true — não precisa de admin client.
  const planRes = await client
    .from('plans')
    .select('slug, features')
    .eq('slug', slugParsed.data)
    .eq('is_active', true)
    .maybeSingle()

  if (!planRes.data) return null

  // Validação de boundary: jsonb pode estar mal-formado se admin editar fora do app.
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

function isFeatureAllowed(features: PlanFeatures, key: string): boolean {
  const value = (features as unknown as Record<string, unknown>)[key]
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === -1 || value > 0
  return false
}

/** Resolve entitlement pra feature sem lançar. Retorna metadata pra CTA. */
export async function resolveEntitlement(feature: string): Promise<EntitlementResolution> {
  const data = await loadForCurrentTenant()
  if (!data) {
    return { allowed: false, plan: null, upgradeUrl: buildUpgradeUrl(feature) }
  }
  const allowed = isFeatureAllowed(data.features, feature)
  return {
    allowed,
    plan: data.slug,
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
  throw AppError.forbidden(`Feature "${feature}" requires plan upgrade`)
}

/** Features completas do plano do tenant atual (null se sem subscription). */
export async function getEntitlements(): Promise<PlanFeatures | null> {
  const data = await loadForCurrentTenant()
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
  const data = await loadForCurrentTenant()
  return { features: data?.features ?? null, plan: data?.slug ?? null }
}

/** Snapshot de quota corrente vs limite (pra banner sticky). */
export async function getQuotaSnapshot(
  key: keyof PlanFeatures,
  currentCount: number,
): Promise<QuotaSnapshot> {
  const data = await loadForCurrentTenant()
  if (!data) return { used: currentCount, limit: 0, nearLimit: true }

  const rawLimit = data.features[key]
  if (typeof rawLimit !== 'number') {
    return { used: currentCount, limit: null, nearLimit: false }
  }
  const limit = rawLimit === -1 ? null : rawLimit
  const nearLimit = limit !== null && currentCount >= limit * 0.8
  return { used: currentCount, limit, nearLimit }
}

/** Lança AppError.forbidden() se a quota numérica foi atingida. */
export async function requireQuota(key: keyof PlanFeatures, currentCount: number): Promise<void> {
  const snapshot = await getQuotaSnapshot(key, currentCount)
  if (snapshot.limit !== null && snapshot.used >= snapshot.limit) {
    throw AppError.forbidden(`Quota "${String(key)}" reached: ${snapshot.used}/${snapshot.limit}`)
  }
}

/** Invalida cache do tenant (chame após mudança de plano). */
export function invalidateEntitlementCache(tenantId?: string) {
  if (tenantId) cache.delete(tenantId)
  else cache.clear()
}

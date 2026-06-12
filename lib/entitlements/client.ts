// lib/entitlements/client.ts — hooks client-side (ADR-0034 §4).
// Lê snapshot do `<EntitlementProvider>` que recebe `PlanFeatures` do server.

'use client'

import { useEntitlementContext } from './EntitlementProvider'
import type { EntitlementResolution, PlanFeatures, QuotaSnapshot } from './types'

function buildUpgradeUrl(feature: string): string {
  return `/upgrade?feature=${encodeURIComponent(feature)}`
}

function isFeatureAllowed(features: PlanFeatures, key: string): boolean {
  const value = (features as unknown as Record<string, unknown>)[key]
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === -1 || value > 0
  return false
}

/** Hook client-side pra resolver entitlement de uma feature. */
export function useEntitlement(feature: string): EntitlementResolution {
  const { features, plan } = useEntitlementContext()
  if (!features) {
    return { allowed: false, plan: null, upgradeUrl: buildUpgradeUrl(feature) }
  }
  const allowed = isFeatureAllowed(features, feature)
  return {
    allowed,
    plan,
    upgradeUrl: allowed ? null : buildUpgradeUrl(feature),
  }
}

/**
 * Hook client-side pra snapshot de quota.
 * Caller passa `currentCount` (count corrente vindo de hook/query).
 */
export function useQuota(key: keyof PlanFeatures, currentCount: number): QuotaSnapshot {
  const { features } = useEntitlementContext()
  if (!features) return { used: currentCount, limit: 0, nearLimit: true }

  const rawLimit = features[key]
  if (typeof rawLimit !== 'number') {
    return { used: currentCount, limit: null, nearLimit: false }
  }
  const limit = rawLimit === -1 ? null : rawLimit
  const nearLimit = limit !== null && currentCount >= limit * 0.8
  return { used: currentCount, limit, nearLimit }
}

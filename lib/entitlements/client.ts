// lib/entitlements/client.ts — hooks client-side (ADR-0034 §4).
// Stub dia 0 (commit B): signatures + tipos. Real impl em commit C lendo de
// EntitlementProvider que recebe snapshot do server.

'use client'

import type { EntitlementResolution, PlanFeatures, QuotaSnapshot } from './types'

/** Hook pra consumir entitlement de uma feature no client. */
export function useEntitlement(_feature: string): EntitlementResolution {
  // Stub permissive — commit C lê do Provider.
  return { allowed: true, plan: null, upgradeUrl: null }
}

/** Hook pra snapshot de quota corrente vs limite. */
export function useQuota(_key: keyof PlanFeatures): QuotaSnapshot {
  return { used: 0, limit: null, nearLimit: false }
}

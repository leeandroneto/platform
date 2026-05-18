// lib/entitlements/server.ts — runtime helpers server-side (ADR-0034 §4).
// Stub dia 0 (commit B): tipos canônicos + signatures. Real impl em commit C
// quando `public.plans` existir (migration 0007).

import 'server-only'

import type { EntitlementResolution, PlanFeatures, QuotaSnapshot } from './types'

/**
 * Lança erro 403 se o tenant atual não tem entitlement pra feature.
 * Usado em route handlers + server actions ANTES da lógica.
 *
 * @example
 *   await requireEntitlement('chatbot')
 *   // ...resto do handler
 */
export async function requireEntitlement(_feature: string): Promise<void> {
  // Stub: implementação real lê `public.plans.features` via tenant ativo.
  // Commit C wire completo. Por ora não bloqueia (permissive default).
  return
}

/**
 * Resolve entitlement pra feature + retorna metadata pra CTA.
 * Não lança — útil pra UI server-component decidir entre render direto vs gate.
 */
export async function resolveEntitlement(_feature: string): Promise<EntitlementResolution> {
  return { allowed: true, plan: null, upgradeUrl: null }
}

/**
 * Retorna features completas do plano do tenant atual.
 * Útil pra prefetch + passar pro client provider (evita N requests).
 */
export async function getEntitlements(): Promise<PlanFeatures | null> {
  return null
}

/**
 * Lança erro 403 se a quota numérica foi atingida.
 *
 * @example
 *   await requireQuota('max_programs', currentProgramCount)
 */
export async function requireQuota(_key: keyof PlanFeatures, _currentCount: number): Promise<void> {
  return
}

/** Snapshot de quota corrente vs limite (pra banner sticky). */
export async function getQuotaSnapshot(
  _key: keyof PlanFeatures,
  _currentCount: number,
): Promise<QuotaSnapshot> {
  return { used: _currentCount, limit: null, nearLimit: false }
}

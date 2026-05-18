// lib/entitlements/types.ts
// Types canônicos do modelo de entitlements (ADR-0034 + ADR-0035).
// Importável de qualquer lugar (zero runtime dependency).
//
// Shapes validados via Zod vivem em `@/lib/contracts/entitlements`.
// Aqui ficam só os types puros + tipos UI (UxPattern, FeatureGate, etc).

import type { PlanFeatures, PlanSlug } from '@/lib/contracts/entitlements'

export type { PlanFeatures, PlanSlug }

/** UX pattern por feature (ADR-0035). */
export type UxPattern = 'A' | 'B' | 'C'
//                      ^ paywall modal
//                          ^ tooltip + soft banner
//                              ^ quota banner

/** Copy do paywall modal pra feature de tipo A. */
export interface PaywallCopy {
  title: string
  bullets: readonly string[]
  previewImage: string | null
}

/**
 * Declaração canônica de gate por feature.
 * Cada `features/<name>/plan-gates.ts` exporta um *Gate.
 */
export interface FeatureGate {
  /**
   * Chave em `public.plans.features` (string snake_case alinhado ao jsonb).
   * Mantemos como `string` ampla (em vez de `keyof PlanFeatures`) porque features
   * novas podem aparecer no jsonb antes do schema TS ser regenerado.
   */
  feature: string
  /** Planos que liberam essa feature. */
  requiredPlans: readonly PlanSlug[]
  /** Planos atuais permitidos pra CTA de upgrade (ex.: A pode subir pra C). */
  upgradeFrom: readonly PlanSlug[]
  /** URL do CTA upgrade. Inclui `feature=<key>` na query. */
  upgradeUrl: string
  /** Chave da quota em `PlanFeatures` (ex.: 'max_programs'). null se feature booleana. */
  quotaKey: keyof PlanFeatures | null
  /** UX pattern (ADR-0035). */
  uxPattern: UxPattern
  /** Copy do paywall modal (obrigatório se uxPattern === 'A'). */
  paywallCopy: PaywallCopy
}

/** Resultado da resolução server-side de entitlement pro tenant atual. */
export interface EntitlementResolution {
  allowed: boolean
  plan: PlanSlug | null
  upgradeUrl: string | null
}

/** Snapshot de quota corrente vs limite. */
export interface QuotaSnapshot {
  used: number
  /** null = ilimitado (campo `-1` no jsonb traduzido). */
  limit: number | null
  /** True quando `used >= limit * 0.8` (≥80% pra banner). */
  nearLimit: boolean
}

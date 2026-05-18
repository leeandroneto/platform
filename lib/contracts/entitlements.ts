// lib/contracts/entitlements.ts — SSOT Zod schemas pra entitlements (ADR-0034).
// Validação no boundary DB → runtime (substitui casts `as unknown as` perigosos).

import { z } from 'zod'

/** Slug dos 3 planos canônicos (ADR-0034). */
export const PlanSlugSchema = z.enum(['A', 'B', 'C'])
export type PlanSlug = z.infer<typeof PlanSlugSchema>

/** Shape canônico do payload `public.plans.features` (jsonb). */
export const PlanFeaturesSchema = z.object({
  schema_version: z.literal(1),
  chatbot: z.boolean(),
  custom_domain: z.boolean(),
  ai_assessment: z.boolean(),
  branded_pwa: z.boolean(),
  white_label_full: z.boolean(),
  automations: z.boolean(),
  // Quotas — `-1` = ilimitado convencionalmente.
  max_programs: z.number().int(),
  max_clients: z.number().int(),
  max_storage_gb: z.number().int().nonnegative(),
})

export type PlanFeatures = z.infer<typeof PlanFeaturesSchema>

// features/_template/contracts.ts
// SSOT Zod + types da feature. Camada Contracts (ADR `layers.md`).
// Tudo que sai da feature pra outras camadas (UI, server actions, data) passa daqui.

import { z } from 'zod'

// ─── Schemas Zod ────────────────────────────────────────────────────────
export const TemplateInputSchema = z.object({
  // Substitua por campos reais da feature
  exampleField: z.string().min(1),
})

export const TemplateRowSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  example_field: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

// ─── Types derivados ───────────────────────────────────────────────────
export type TemplateInput = z.infer<typeof TemplateInputSchema>
export type TemplateRow = z.infer<typeof TemplateRowSchema>

// Domain shape pode divergir do Row (adapter em adapter.ts se precisar)
export interface Template {
  id: string
  tenantId: string
  exampleField: string
  createdAt: Date
}

// features/_template/handlers.ts
// Lógica de route handlers + server actions. Camada server (`'server-only'`).
// app/api/_template/route.ts importa daqui via `import { listHandler } from '@/features/_template'`.
//
// Pattern: handler valida input + chama requireEntitlement → chama data → retorna Response.

import 'server-only'

import { NextResponse } from 'next/server'

import { requireEntitlement } from '@/lib/entitlements/server'
import { createClient } from '@/lib/supabase/server'

import { TemplateInputSchema } from './contracts'
import { createTemplate, listTemplates } from './data'
import { templateGate } from './plan-gates'

export async function listHandler(): Promise<Response> {
  await requireEntitlement(templateGate.feature)
  const client = await createClient()
  // Tenant scope: client.from() já aplica RLS via JWT claim
  // (lib/data convenções: caller passa tenantId derivado do JWT)
  const tenantId = '' // placeholder — derivar do contexto auth real
  const items = await listTemplates(client, tenantId)
  return NextResponse.json({ items })
}

export async function createHandler(req: Request): Promise<Response> {
  await requireEntitlement(templateGate.feature)
  const raw = await req.json()
  const parsed = TemplateInputSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const client = await createClient()
  const tenantId = '' // placeholder — derivar do JWT
  const created = await createTemplate(client, tenantId, parsed.data)
  return NextResponse.json({ item: created }, { status: 201 })
}

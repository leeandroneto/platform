// lib/auth/server-context.ts — auth context resolver lib-side.
//
// Versão lib-canonical do `app/api/_shared/auth.ts::getAuthContext`. Engine
// handlers e server actions em `lib/engines/` consomem desta versão (layer
// rule: lib/ NÃO importa de app/). Pattern duplicado intencional dia 0;
// quando 3+ consumers convergirem, promover esta como SSOT + re-export no
// app/api/_shared/auth.ts (não inverso).
//
// Dual-read I21: tenant_id em `app_metadata.tenant_id` (novo · hook 0029)
// OU raiz JWT (legacy). COALESCE retorna o primeiro non-null.
//
// @see app/api/_shared/auth.ts — pattern original (API routes)
// @see .claude/rules/jwt-claims.md — dual-read I21
// @see .claude/rules/layers.md — lib/ não importa app/
// @see docs/migrations/0029_auth_custom_access_token_hook.md — Custom Access Token Hook

import 'server-only'

import type { User } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/server'

export type SupabaseClientLike = Awaited<ReturnType<typeof createClient>>

export interface AuthContext {
  readonly client: SupabaseClientLike
  readonly user: User
  readonly userId: string
  readonly tenantId: string
}

/**
 * Dual-read I21: tenant_id em `app_metadata.tenant_id` (novo) OU raiz JWT
 * (legacy). COALESCE retorna o primeiro non-null.
 */
export function getTenantIdFromUser(
  appMetadata: Record<string, unknown> | undefined,
  rawJwt: Record<string, unknown> | undefined,
): string | null {
  const fromAppMetadata = appMetadata?.tenant_id
  if (typeof fromAppMetadata === 'string' && fromAppMetadata.length > 0) {
    return fromAppMetadata
  }
  const fromRaw = rawJwt?.tenant_id
  if (typeof fromRaw === 'string' && fromRaw.length > 0) {
    return fromRaw
  }
  return null
}

/**
 * Resolve user + tenant_id. Retorna null se não autenticado OR tenant_id ausente.
 *
 * Caller decide tratamento de null (server action retorna `fail('unauthorized')`,
 * RSC retorna 401, etc).
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const client = await createClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return null
  const { data: claimsData } = await client.auth.getClaims()
  const claims = claimsData?.claims
  const tenantId = getTenantIdFromUser(
    claims?.app_metadata as Record<string, unknown> | undefined,
    claims as Record<string, unknown> | undefined,
  )
  if (!tenantId) return null
  return { client, user, userId: user.id, tenantId }
}

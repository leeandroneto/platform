// RESEARCH: @supabase/supabase-js JWT app_metadata pattern + ADR-0060 dual-read
// lib/supabase/jwt.ts — Helper canonical pra ler tenant_id do JWT Supabase.
//
// Pattern I21 (dual-read, cravado no plano fork-vercel-chatbot §3.5):
// COALESCE(app_metadata.tenant_id, raiz.tenant_id). app_metadata vem do hook
// custom_access_token_hook (migration 0029). raiz é fallback legacy.
//
// USO:
//   getTenantIdFromJwt(jwt) → string | null (graceful, pra checks opcionais)
//   requireTenantId(jwt)    → string (throws AppError.unauthorized se null)
//
// Hook ATUAL (Fase 1): seleciona via memberships ORDER BY created_at LIMIT 1.
// 1 user = 1 tenant ativo é o invariante. Fase 2 (MCP Sprint 3) migrará pra
// oauth_clients.client_id selection (ADR-0060).

import { AppError } from '@/lib/contracts/errors'

/**
 * Shape mínima do payload JWT Supabase que precisa pra extrair tenant_id.
 * Espelha `JwtPayload` de @supabase/supabase-js sem ter que importar tipo
 * full (evita acoplamento de versão minor).
 *
 * `app_metadata` é unknown porque schema do hook é dinâmico. Validação local.
 */
export interface SupabaseJwt {
  readonly sub?: string
  readonly app_metadata?: Record<string, unknown>
  /** Legacy claim raiz (pré-hook). Mantido como fallback dual-read I21. */
  readonly tenant_id?: string
}

/**
 * Lê tenant_id do JWT graciosamente.
 *
 * Ordem:
 * 1. `app_metadata.tenant_id` (preferida — hook 0029 grava aqui)
 * 2. `tenant_id` raiz (legacy fallback — dual-read I21)
 *
 * Retorna `null` se ambos ausentes ou inválidos (não-string).
 * Use `requireTenantId()` quando precisar throw.
 */
export function getTenantIdFromJwt(jwt: SupabaseJwt | null | undefined): string | null {
  if (!jwt) return null

  const fromAppMetadata = jwt.app_metadata?.tenant_id
  if (typeof fromAppMetadata === 'string' && fromAppMetadata.length > 0) {
    return fromAppMetadata
  }

  const fromRoot = jwt.tenant_id
  if (typeof fromRoot === 'string' && fromRoot.length > 0) {
    return fromRoot
  }

  return null
}

/**
 * Lê tenant_id do JWT ou throw `AppError.unauthorized` com i18n key.
 *
 * Use em camadas que NÃO podem operar sem tenant resolvido (server actions
 * tenant-scoped, lib/data queries). Caller traduz erro via t(i18nKey).
 */
export function requireTenantId(jwt: SupabaseJwt | null | undefined): string {
  const tenantId = getTenantIdFromJwt(jwt)
  if (!tenantId) {
    throw AppError.unauthorized({
      key: 'auth.tenantRequired',
      fallback: 'Tenant required — no tenant_id in JWT',
    })
  }
  return tenantId
}

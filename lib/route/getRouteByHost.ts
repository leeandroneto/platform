// lib/route/getRouteByHost.ts — Resolve brand + tenant do hostname (ADR-0024 + ADR-0026).
// 1 lookup retorna ambos. Cache TTL 60s no edge.
//
// Casos:
// 1. desafit.app             → { brand: 'desafit', tenant: null }       (brand-root, landing institucional)
// 2. joao.desafit.app        → { brand: 'desafit', tenant: 'joao' }     (subdomain grátis)
// 3. joao.com.br             → { brand: 'desafit', tenant: 'joao' }     (custom domain Pacote B/C)
// 4. yoga.app                → { brand: 'yoga', tenant: null }          (marca filha futura)
// 5. host não cadastrado     → null (proxy.ts retorna 404)

import 'server-only'

import type { Brand } from '@/lib/brand/types'
import { createAdminClient } from '@/lib/supabase/admin'

import type { Tenant } from './types'

export interface ResolvedRoute {
  readonly brand: Brand
  readonly tenant: Tenant | null
}

const CACHE_TTL_MS = 60_000
const cache = new Map<string, { route: ResolvedRoute | null; expiresAt: number }>()

function normalize(host: string): string | null {
  try {
    // URL parser handles: IDN→punycode, lowercasing, port strip, CRLF rejection
    const url = new URL('http://' + host.replace(/^www\./, ''))
    const h = url.hostname
    if (!h || h.includes('\r') || h.includes('\n')) return null
    return h.replace(/\.$/, '') // trailing dot
  } catch {
    return null
  }
}

export async function getRouteByHost(host: string): Promise<ResolvedRoute | null> {
  const h = normalize(host)
  if (!h) return null

  const cached = cache.get(h)
  if (cached && cached.expiresAt > Date.now()) return cached.route

  const admin = createAdminClient()

  // 1. Lookup em public.domains (tenant subdomain ou custom)
  const { data: domain } = await admin
    .from('domains')
    .select(
      `
      tenant_id, kind, is_primary, ssl_status,
      tenants:tenant_id (
        id, slug, brand_id, name, vertical, theme_version,
        brands:brand_id (
          id, name, host, logo_url, default_vertical, parent_label, theme_version
        )
      )
    `,
    )
    .eq('host', h)
    .not('verified_at', 'is', null)
    .maybeSingle()

  if (domain?.tenants) {
    // Supabase nested select retorna { ...tenant_fields, brands: Brand } —
    // tipo gerado é union loose, casta explícito pra shape conhecida.
    const tenantWithBrand = domain.tenants as unknown as Tenant & { brands: Brand }
    const { brands: brand, ...tenant } = tenantWithBrand
    const route: ResolvedRoute = { brand, tenant: tenant as Tenant }
    cache.set(h, { route, expiresAt: Date.now() + CACHE_TTL_MS })
    return route
  }

  // 2. Lookup em public.brands (brand-root, landing institucional)
  const { data: brand } = await admin
    .from('brands')
    .select('id, name, host, logo_url, default_vertical, parent_label, theme_version')
    .eq('host', h)
    .maybeSingle()

  if (brand) {
    const route: ResolvedRoute = { brand: brand as Brand, tenant: null }
    cache.set(h, { route, expiresAt: Date.now() + CACHE_TTL_MS })
    return route
  }

  // 3. Não cadastrado
  cache.set(h, { route: null, expiresAt: Date.now() + CACHE_TTL_MS })
  return null
}

export function invalidateRouteCache(host?: string) {
  if (host) {
    const h = normalize(host)
    if (h) cache.delete(h)
  } else {
    cache.clear()
  }
}

// proxy.ts — Next 16 substitui middleware.ts (mesma assinatura, nome semântico).
// Resolve brand + tenant do host header (ADR-0024 + ADR-0026).

import { type NextRequest, NextResponse } from 'next/server'

import { getRouteByHost } from '@/lib/route/getRouteByHost'

export async function proxy(req: NextRequest) {
  const host = req.headers.get('host')

  // Host header missing — Next 16 sempre envia em req real; ausência indica
  // request inválido (smuggling, proxy mal-configurado, fuzzer).
  if (!host) {
    return new NextResponse('Bad Request — missing host header', { status: 400 })
  }

  // ─── Brand + Tenant lookup por hostname (ADR-0024 + 0026) ─────────────
  // Cache em-memória TTL 60s no edge — evita lookup DB por request.
  let route = await getRouteByHost(host)

  // ─── Dev/emergency fallback (ADR-0024) ──────────────────────────────────
  // localhost/127.0.0.1 em dev cai pro brand default; produção com host
  // desconhecido continua retornando 404 (defesa contra spoofing).
  const isDev = process.env.NODE_ENV !== 'production'
  const isLocalhost =
    host === 'localhost' ||
    host.startsWith('localhost:') ||
    host.startsWith('127.0.0.1') ||
    host.endsWith('.localhost')
  const fallback = process.env.NEXT_PUBLIC_DEFAULT_BRAND_HOST
  if (!route && isDev && isLocalhost && fallback) {
    route = await getRouteByHost(fallback)
  }

  // ─── Bloqueia host não cadastrado (defesa contra spoofing/typos) ──────
  if (!route) {
    return new NextResponse('Domain not configured', { status: 404 })
  }

  const { brand, tenant } = route

  // ─── Propaga route pra RSC via headers ────────────────────────────────
  const headers = new Headers(req.headers)
  headers.set('x-brand-id', brand.id)
  headers.set('x-brand-name', brand.name)
  headers.set('x-brand-default-vertical', brand.default_vertical)
  if (tenant) {
    headers.set('x-tenant-id', tenant.id)
    headers.set('x-tenant-slug', tenant.slug)
    headers.set('x-tenant-vertical', tenant.vertical)
  }

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|css|map)).*)',
  ],
}

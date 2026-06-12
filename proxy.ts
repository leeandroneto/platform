// proxy.ts — Next 16 substitui middleware.ts (mesma assinatura, nome semântico).
// Refresh JWT Supabase (@supabase/ssr) + roteia locale via next-intl.
//
// Ordem cravada:
// 1. Validate host
// 2. updateSession (Supabase refresh JWT) — escreve cookies novos
// 3. next-intl middleware se rota é localizada
// 4. Compose response final c/ cookies refreshed

import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from '@/lib/i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(req: NextRequest) {
  const host = req.headers.get('host')
  if (!host) {
    return new NextResponse('Bad Request — missing host header', { status: 400 })
  }

  // ─── Refresh JWT Supabase ─────────────────────────────────────────────
  const sessionResponse = await updateSession(req)

  // ─── next-intl routing pra rotas localizadas ──────────────────────────
  const pathname = req.nextUrl.pathname
  const localized = /^\/(pt-BR|en|es)(\/|$)/.test(pathname)

  if (localized) {
    const intlResponse = intlMiddleware(req)
    sessionResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return intlResponse
  }

  // ─── Rotas não localizadas: preserva cookies refreshed ────────────────
  const finalResponse = NextResponse.next()
  sessionResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return finalResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|css|map)).*)',
  ],
}

// RESEARCH: @supabase/ssr 0.10.3 docs https://supabase.com/docs/guides/auth/server-side
// lib/supabase/middleware.ts — updateSession helper pra Next 16 proxy.
//
// Responsabilidade ÚNICA: refresh do JWT antes da renderização RSC. Sem isso,
// usuários ficam logged out aleatoriamente quando o access_token expira.
//
// Pattern oficial (`@supabase/ssr` 0.10.3):
// 1. Cria response copia da request (preserva headers downstream)
// 2. Cria createServerClient com getAll(request.cookies) + setAll que escreve
//    cookies tanto na request (pra Server Components lerem na mesma request)
//    quanto na response (pra browser receber novo cookie)
// 3. supabase.auth.getUser() — força check contra Supabase Auth + refresh se
//    expirado. Importante: NÃO usar getSession() — pode confiar em cookie velho
// 4. Retorna response c/ cookies atualizados
//
// Caller (proxy.ts) compõe com getRouteByHost (brand resolve) e propaga headers.

import 'server-only'

import { type NextRequest, NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/lib/contracts/database'
import { env } from '@/lib/env'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualiza request (Server Components leem mesma request)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Recria response preservando request c/ novos cookies
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh JWT obrigatório. NÃO usar getSession() — pode confiar em cookie velho.
  // getUser() força roundtrip ao Supabase Auth (~10-50ms) + grava novo token se
  // refresh acontecer. Esse é o único caminho cravado pra session estável SSR.
  await supabase.auth.getUser()

  return response
}

// lib/supabase/server.ts — Supabase client pra RSC server + Server Actions.
// Lê/escreve cookies pra session refresh automático.

import 'server-only'

import { cookies } from 'next/headers'

import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/lib/contracts/database'
import { env } from '@/lib/env'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // RSC fora de Server Action / Route Handler — setAll é no-op aqui.
            // Refresh ocorre no proxy.ts antes da renderização.
          }
        },
      },
    },
  )
}

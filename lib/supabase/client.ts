// lib/supabase/client.ts — Supabase client pra browser (RSC client).
// Use APENAS em 'use client' components ou em hooks.
// Em server: use @/lib/supabase/server.

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/lib/contracts/database'
import { env } from '@/lib/env'

export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )
}

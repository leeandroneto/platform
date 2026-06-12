// lib/supabase/admin.ts — Service role client (BYPASS RLS).
// USE COM EXTREMO CUIDADO. Apenas em:
// - Server Actions específicas (signup trigger, webhooks externos)
// - Edge Functions Deno (mirror em supabase/functions/)
// - Scripts de migration/seed
//
// ESLint bloqueia import deste arquivo em client components + lib/data/.

import 'server-only'

import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/contracts/database'
import { env } from '@/lib/env'

let cached: ReturnType<typeof createClient<Database>> | null = null

export function createAdminClient() {
  if (cached) return cached
  cached = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return cached
}

// RESEARCH: custom — RSC route tenant-facing /temas (theme studio).
//
// Decisão 2026-05-22: feature é tenant-facing — profissional customiza tema
// do app dele, não admin SaaS interno. Rota PT-BR per rules/naming.md.
//
// Fase 7 §4.7: RSC page que resolve theme ativo do tenant e passa pra view.
// Entitlement gate JIT — re-ligar quando custom_access_token hook registrar
// no Supabase Dashboard (JWT tenant_id claim ativado). Por enquanto, fetch
// fallback DEFAULT_THEME (lib/data/themes.ts handle JWT ausente).

import { Suspense } from 'react'

import { getActiveThemeForTenant } from '@/lib/data/themes'
import { createClient } from '@/lib/supabase/server'

import { ThemeStudioView } from './view'

export default async function ThemeStudioPage() {
  // Wrap all async data access in Suspense — required by Next 16 cache
  // components to avoid delaying the entire page prerender (uncached data
  // outside Suspense).
  return (
    <Suspense fallback={<ThemeStudioLoading />}>
      <ThemeStudioLoader />
    </Suspense>
  )
}

async function ThemeStudioLoader() {
  // Entitlement gate JIT (re-add quando custom_access_token hook estiver
  // registered no Supabase Dashboard pra JWT carregar tenant_id claim).
  // Quando re-ligar:
  //   try { await requireEntitlement('theme_studio') } catch { redirect('/') }

  // Fetch active theme snapshot for current tenant.
  // Server client carries JWT so RLS is enforced automatically.
  // Falls back to DEFAULT_THEME if no JWT tenant_id or bootstrap not triggered.
  const client = await createClient()
  const initialTheme = await getActiveThemeForTenant(client)

  return <ThemeStudioView initialTheme={initialTheme} />
}

function ThemeStudioLoading() {
  return <div className="min-h-screen bg-background" />
}

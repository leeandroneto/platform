// RESEARCH: custom — RSC route admin theme studio com entitlement gate
// (TweakCN não tem multi-tenant, então não há equivalente direto pra copy)
//
// Fase 7 §4.7: RSC page que resolve theme ativo do tenant e passa pra view.
// Entitlement gate redireciona antes de qualquer fetch se tenant não tem acesso.

import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { getActiveThemeForTenant } from '@/lib/data/themes'
import { requireEntitlement } from '@/lib/entitlements/server'
import { createClient } from '@/lib/supabase/server'

import { ThemeStudioView } from './view'

export default async function ThemeStudioPage() {
  // Wrap all async data access in Suspense — required by Next 16 cache components
  // to avoid delaying the entire page prerender (uncached data outside Suspense).
  // requireEntitlement calls createClient() internally, so it must also be inside.
  return (
    <Suspense fallback={<ThemeStudioLoading />}>
      <ThemeStudioLoader />
    </Suspense>
  )
}

async function ThemeStudioLoader() {
  // 1. Entitlement gate — throws AppError.forbidden if not allowed.
  //    Wrap in try/catch so we redirect gracefully instead of error boundary.
  try {
    await requireEntitlement('theme_studio')
  } catch {
    redirect('/')
  }

  // 2. Fetch active theme snapshot for current tenant.
  //    Server client carries JWT so RLS is enforced automatically.
  //    Falls back to DEFAULT_THEME if bootstrap not triggered yet.
  const client = await createClient()
  const initialTheme = await getActiveThemeForTenant(client)

  return <ThemeStudioView initialTheme={initialTheme} />
}

function ThemeStudioLoading() {
  return <div className="min-h-screen bg-background" />
}

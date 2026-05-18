// lib/entitlements/EntitlementProvider.tsx
// Provider client-side que recebe snapshot de PlanFeatures do server
// (root layout chama getEntitlements() e passa como prop).
// useEntitlement() + useQuota() consomem este Provider via context.

'use client'

import { createContext, type ReactNode, useContext } from 'react'

import type { PlanFeatures, PlanSlug } from './types'

export interface EntitlementContextValue {
  features: PlanFeatures | null
  plan: PlanSlug | null
}

const EntitlementContext = createContext<EntitlementContextValue>({
  features: null,
  plan: null,
})

export function EntitlementProvider({
  features,
  plan,
  children,
}: {
  features: PlanFeatures | null
  plan: PlanSlug | null
  children: ReactNode
}) {
  return (
    <EntitlementContext.Provider value={{ features, plan }}>{children}</EntitlementContext.Provider>
  )
}

export function useEntitlementContext(): EntitlementContextValue {
  return useContext(EntitlementContext)
}

'use client'

// lib/route/RouteProvider.tsx — Provider unificado pra brand + tenant resolvidos (ADR-0026).
// Substitui BrandProvider. useBrand() e useTenant() compartilham mesma fonte.

import { createContext, type ReactNode, useContext } from 'react'

import type { Brand } from '@/lib/brand/types'

import type { Tenant } from './types'

interface RouteContextValue {
  brand: Brand
  tenant: Tenant | null
}

const RouteContext = createContext<RouteContextValue | null>(null)

export function RouteProvider({
  brand,
  tenant,
  children,
}: {
  brand: Brand
  tenant: Tenant | null
  children: ReactNode
}) {
  return <RouteContext.Provider value={{ brand, tenant }}>{children}</RouteContext.Provider>
}

export function useBrand(): Brand {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useBrand() fora de <RouteProvider>')
  return ctx.brand
}

export function useTenant(): Tenant {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useTenant() fora de <RouteProvider>')
  if (!ctx.tenant) throw new Error('useTenant() em rota brand-root (sem tenant)')
  return ctx.tenant
}

export function useTenantOptional(): Tenant | null {
  return useContext(RouteContext)?.tenant ?? null
}

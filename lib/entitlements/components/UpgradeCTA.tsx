// UpgradeCTA — CTA primário pra upgrade de plano (ADR-0035).
// Componente reutilizado em PaywallModal + QuotaBanner.

'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import type { PlanSlug } from '../types'

interface Props {
  /** Slug do plano alvo. */
  to: PlanSlug
  /** Feature que motivou o CTA (vai como query param). */
  feature: string
  /** Plano atual do tenant (opcional — usado em metadata). */
  from?: PlanSlug | null
  /** Texto do botão. */
  label?: string
  /** Variant shadcn. */
  variant?: 'default' | 'secondary' | 'ghost'
}

export function UpgradeCTA({ to, feature, from, label, variant = 'default' }: Props) {
  const params = new URLSearchParams({ feature, to })
  if (from) params.set('from', from)
  const href = `/upgrade?${params.toString()}`

  return (
    <Button asChild variant={variant}>
      <Link href={href} aria-label={`Fazer upgrade para o Pacote ${to}`}>
        {label ?? `Ver Pacote ${to}`}
      </Link>
    </Button>
  )
}

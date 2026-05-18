// EntitlementBadge — chip "PRO" / plan slug pra sinalizar feature gate (ADR-0035).
// Usado nos cantos de botões/cards onde feature é gate por plano.

import { Badge } from '@/components/ui/badge'

import type { PlanSlug } from '../types'

interface Props {
  /** Plano mínimo pra liberar a feature. */
  plan: PlanSlug
  /** Variante visual — "pro" mostra texto "PRO", "slug" mostra o slug do plano. */
  label?: 'pro' | 'slug'
}

export function EntitlementBadge({ plan, label = 'slug' }: Props) {
  const text = label === 'pro' ? 'PRO' : plan
  return (
    <Badge variant="secondary" aria-label={`Disponível no Pacote ${plan}`}>
      {text}
    </Badge>
  )
}

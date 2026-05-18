// QuotaBanner — banner sticky topo quando quota perto ou no limite (ADR-0035 tipo C).

'use client'

import type { PlanFeatures, PlanSlug, QuotaSnapshot } from '../types'
import { UpgradeCTA } from './UpgradeCTA'

interface Props {
  quotaKey: keyof PlanFeatures
  snapshot: QuotaSnapshot
  /** Plano alvo do upgrade (default próximo escalão pelo slug). */
  upgradeTo?: PlanSlug
  /** Texto descritivo da quota (ex: "programas"). */
  labelSingular?: string
}

function nextPlan(currentPlan: PlanSlug | null | undefined): PlanSlug {
  if (currentPlan === 'A') return 'B'
  if (currentPlan === 'B') return 'C'
  return 'C'
}

export function QuotaBanner({ quotaKey, snapshot, upgradeTo, labelSingular = 'item' }: Props) {
  if (snapshot.limit === null || !snapshot.nearLimit) return null

  const target = upgradeTo ?? nextPlan(null)
  const atLimit = snapshot.used >= snapshot.limit
  const pctUsed = Math.min(100, Math.round((snapshot.used / snapshot.limit) * 100))

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 border border-border bg-card p-3"
    >
      <div className="flex flex-col gap-1">
        <p className="text-foreground">
          {snapshot.used} de {snapshot.limit} {labelSingular}
          {snapshot.used === 1 ? '' : 's'} usados
        </p>
        <div className="h-1 w-full overflow-hidden bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${pctUsed}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
      <UpgradeCTA
        to={target}
        feature={String(quotaKey)}
        label={atLimit ? `Pacote ${target}` : 'Aumentar limite'}
        variant={atLimit ? 'default' : 'secondary'}
      />
    </div>
  )
}

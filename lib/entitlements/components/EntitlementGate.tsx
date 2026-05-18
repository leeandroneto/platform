// EntitlementGate — wrapper que decide UX (paywall, tooltip, banner) por uxPattern.
// ADR-0035: tipo A abre PaywallModal no clique; tipo B passa direto + Badge inline;
// tipo C deixa passar (banner é exibido fora pelo caller usando QuotaBanner).

'use client'

import { type ReactNode, useState } from 'react'

import { useEntitlement } from '../client'
import type { FeatureGate, PlanSlug } from '../types'
import { EntitlementBadge } from './EntitlementBadge'
import { PaywallModal } from './PaywallModal'

interface Props {
  gate: FeatureGate
  children: ReactNode
}

export function EntitlementGate({ gate, children }: Props) {
  const { allowed, plan } = useEntitlement(gate.feature)
  const [paywallOpen, setPaywallOpen] = useState(false)

  // Liberado: render direto (sem badge, sem intercept).
  if (allowed) return <>{children}</>

  const targetPlan: PlanSlug = gate.requiredPlans[0] ?? 'C'

  // Tipo C (quota): deixa passar. Banner é exibido fora pelo caller via <QuotaBanner>.
  if (gate.uxPattern === 'C') return <>{children}</>

  // Tipo A (paywall modal): intercepta click → abre modal.
  if (gate.uxPattern === 'A') {
    return (
      <>
        <button
          type="button"
          onClick={() => setPaywallOpen(true)}
          className="relative inline-flex items-center gap-2"
          aria-label={`${gate.paywallCopy.title} — requer upgrade`}
        >
          {children}
          <EntitlementBadge plan={targetPlan} label="pro" />
        </button>
        <PaywallModal
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          gate={gate}
          currentPlan={plan}
        />
      </>
    )
  }

  // Tipo B (badge + tooltip): mostra com badge inline. Tooltip via shadcn Tooltip
  // pode ser composto pelo caller se quiser hover state.
  return (
    <span className="relative inline-flex items-center gap-2">
      {children}
      <EntitlementBadge plan={targetPlan} />
    </span>
  )
}

// PaywallModal — modal completo pra feature gate tipo A (ADR-0035).
// Mostra title + bullets + preview + CTA upgrade. Animação via motion/react.

'use client'

import Image from 'next/image'

import { motion } from 'motion/react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { FeatureGate, PlanSlug } from '../types'
import { UpgradeCTA } from './UpgradeCTA'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  gate: FeatureGate
  /** Plano atual do tenant (opcional). */
  currentPlan?: PlanSlug | null
}

export function PaywallModal({ open, onOpenChange, gate, currentPlan }: Props) {
  const target = gate.requiredPlans[0] ?? 'C'
  const { title, bullets, previewImage } = gate.paywallCopy

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Disponível a partir do Pacote {target}.</DialogDescription>
          </DialogHeader>

          {previewImage && (
            <div className="relative my-4 aspect-video overflow-hidden border border-border">
              <Image src={previewImage} alt="" fill className="object-cover" unoptimized />
            </div>
          )}

          <ul className="my-4 space-y-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-foreground">
                <span aria-hidden="true" className="text-primary">
                  ✓
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-2">
            <UpgradeCTA to={target} feature={gate.feature} from={currentPlan ?? null} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

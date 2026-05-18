// RESEARCH: useEntitlement + shadcn Dialog + Button — wrapper composto ADR-0040 §E + ADR-0035 §A.
// Renderiza children se feature allowed. Caso contrario: placeholder (inline) ou
// modal paywall (modal default) com upgrade CTA i18n. Hook server-side
// requireEntitlement continua sendo truth — este wrapper e UX layer.

'use client'

import { type ReactNode, useState } from 'react'
import { useTranslations } from 'next-intl'

import { useEntitlement } from '@/lib/entitlements/client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AppEntitlementGateProps {
  /** Feature key (alinhado a public.plans.features jsonb). */
  feature: string
  /** Conteudo renderizado quando feature liberada. */
  children: ReactNode
  /** Modo de bloqueio. modal = abre paywall ao clicar nos children; inline = substitui children por placeholder. */
  mode?: 'modal' | 'inline'
}

export function AppEntitlementGate({ feature, children, mode = 'modal' }: AppEntitlementGateProps) {
  const { allowed, upgradeUrl } = useEntitlement(feature)
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)

  if (allowed) return <>{children}</>

  const upgradeHref = upgradeUrl ?? '/upgrade'

  if (mode === 'inline') {
    return (
      <div className="bg-muted border p-4 text-center">
        <p className="text-muted-foreground mb-2">{t('entitlements.locked')}</p>
        <Button asChild size="sm">
          <a href={upgradeHref}>{t('entitlements.upgrade_cta')}</a>
        </Button>
      </div>
    )
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="block w-full cursor-pointer text-left"
        aria-label={t('entitlements.locked')}
      >
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('entitlements.locked')}</DialogTitle>
            <DialogDescription>{t('entitlements.upgrade_description')}</DialogDescription>
          </DialogHeader>
          <Button asChild>
            <a href={upgradeHref}>{t('entitlements.upgrade_cta')}</a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

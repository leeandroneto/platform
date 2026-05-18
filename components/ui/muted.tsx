// RESEARCH: custom typography primitive — texto secundario/caption (muted-foreground).
// Exception ADR-0040 §F: typography custom em components/ui/* (nossa, nao vendor).
// Path override ESLint §A aplica.

import * as React from 'react'

import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

interface MutedProps extends React.ComponentProps<'span'> {
  /** Composicao via Slot — passa props pro child. */
  asChild?: boolean
}

function Muted({ asChild, className, ...props }: MutedProps) {
  const Comp: React.ElementType = asChild ? Slot.Root : 'span'
  return (
    <Comp data-slot="muted" className={cn('text-muted-foreground text-sm', className)} {...props} />
  )
}

export { Muted, type MutedProps }

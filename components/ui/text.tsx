// RESEARCH: custom typography primitive — variants body/body-sm/lead.
// Exception ADR-0040 §F: typography custom em components/ui/* (nossa, nao vendor).
// Path override ESLint §A aplica.

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      body: 'text-base leading-relaxed',
      'body-sm': 'text-sm leading-normal',
      lead: 'text-lg leading-relaxed',
    },
  },
  defaultVariants: { variant: 'body' },
})

interface TextProps
  extends Omit<React.ComponentProps<'p'>, 'children'>, VariantProps<typeof textVariants> {
  /** Composicao via Slot — passa props pro child. */
  asChild?: boolean
  children?: React.ReactNode
}

function Text({ variant, asChild, className, ...props }: TextProps) {
  const Comp: React.ElementType = asChild ? Slot.Root : 'p'
  return <Comp data-slot="text" className={cn(textVariants({ variant }), className)} {...props} />
}

export { Text, textVariants, type TextProps }

// RESEARCH: custom typography primitive — shadcn nao entrega (issue 1527 do repo shadcn-ui/ui).
// EightShapes pattern: cva levels 1-4, asChild via Slot.Root, semantic tag via `as` prop.
// Exception ADR-0040 §F: typography custom vive em components/ui/* (nossa, nao vendor).
// Path override ESLint §A aplica (text-Nxl tokens permitidos como vendor surface).

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-sans tracking-tight text-foreground', {
  variants: {
    level: {
      1: 'text-4xl font-bold',
      2: 'text-3xl font-semibold',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-medium',
    },
  },
  defaultVariants: { level: 2 },
})

type HeadingLevel = 1 | 2 | 3 | 4

interface HeadingProps
  extends Omit<React.ComponentProps<'h2'>, 'children'>, VariantProps<typeof headingVariants> {
  /** Tag HTML renderizada. Default: `h<level>`. Override pra hierarquia semantica vs visual. */
  as?: `h${HeadingLevel}`
  /** Composicao via Slot — passa props pro child. */
  asChild?: boolean
  level?: HeadingLevel
  children: React.ReactNode
}

function Heading({ level = 2, as, asChild, className, children, ...props }: HeadingProps) {
  const Comp: React.ElementType = asChild ? Slot.Root : (as ?? `h${level}`)
  return (
    <Comp data-slot="heading" className={cn(headingVariants({ level }), className)} {...props}>
      {children}
    </Comp>
  )
}

export { Heading, headingVariants, type HeadingProps }

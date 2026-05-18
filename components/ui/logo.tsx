// RESEARCH: custom brand wordmark — constitucional 00-PROJETO §9 (zero hardcode brand name).
// Renderiza `brand.name` via useBrand() em Geist Sans bold + tracking-tight. text-foreground
// herda tema runtime do tenant via CSS var. Variant `wordmark` dia 0 — `icon`/`horizontal` JIT.
// Exception ADR-0040 §F: vive em components/ui/ (vendor surface override aplica text-Nxl tokens).

'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { useBrand } from '@/lib/route/RouteProvider'
import { cn } from '@/lib/utils'

const logoVariants = cva(
  'inline-flex items-center font-sans font-bold tracking-tight text-foreground',
  {
    variants: {
      size: {
        sm: 'text-base',
        md: 'text-2xl',
        lg: 'text-4xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

type LogoVariant = 'wordmark' // | 'icon' | 'horizontal' (JIT — exige asset SVG do designer)

interface LogoProps
  extends Omit<React.ComponentProps<'span'>, 'children'>, VariantProps<typeof logoVariants> {
  /** Tipo de logo. Dia 0 so wordmark. */
  variant?: LogoVariant
  /** Composicao via Slot — passa props pro child. */
  asChild?: boolean
}

function Logo({ variant = 'wordmark', size, asChild, className, ...props }: LogoProps) {
  const brand = useBrand()
  const Comp: React.ElementType = asChild ? Slot.Root : 'span'

  // variant === 'wordmark' (so opcao dia 0)
  return (
    <Comp
      data-slot="logo"
      data-variant={variant}
      className={cn(logoVariants({ size }), className)}
      {...props}
    >
      {brand.name}
    </Comp>
  )
}

export { Logo, logoVariants, type LogoProps, type LogoVariant }

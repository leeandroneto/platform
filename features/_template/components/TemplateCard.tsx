// features/_template/components/TemplateCard.tsx
// UI da feature. RSC default. 'use client' apenas se houver state/interação.
// Componentes shadcn primitives via @/components/ui/* (ADR-0008 100%).
// Tokens via classes que mapeiam pra var(--*) — nunca utility crua de tamanho.

import type { Template } from '../contracts'

interface Props {
  item: Template
}

export function TemplateCard({ item }: Props) {
  return (
    <article className="border border-border bg-card p-4">
      <h3 className="font-medium">{item.exampleField}</h3>
      <time dateTime={item.createdAt.toISOString()} className="text-muted-foreground">
        {item.createdAt.toLocaleDateString('pt-BR')}
      </time>
    </article>
  )
}

// features/_template/hooks.ts
// Hooks client-side da feature. Camada Hooks (ADR `layers.md`).
// Toda lógica de fetch/state local fica aqui. UI consome via useTemplate*.

'use client'

import { useEffect, useState } from 'react'

import type { Template } from './contracts'

export function useTemplates() {
  const [items, setItems] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/_template')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setItems(data.items ?? [])
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e : new Error(String(e)))
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return { items, loading, error }
}

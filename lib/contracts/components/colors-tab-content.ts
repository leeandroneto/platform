// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/colors-tab-content.tsx.
// SSOT Zod schema pra ColorsTabContent props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

import type { ThemeStyleProps } from '@/lib/design/contract/theme'

/**
 * Função genérica de update de uma chave específica do ThemeStyleProps.
 * Generics não modelam bem em Zod runtime — usamos `z.custom` com guard de typeof.
 * O type inferido é exatamente a assinatura genérica de `updateStyle`.
 */
export type UpdateStyleFn = <K extends keyof ThemeStyleProps>(
  key: K,
  value: ThemeStyleProps[K],
) => void

export type UpdateStylesFn = (updates: Partial<ThemeStyleProps>) => void

export const ColorsTabContentPropsSchema = z.object({
  /** Estilos atuais do theme (mode-aware merge feito pelo parent). */
  currentStyles: z.custom<ThemeStyleProps>((v) => v != null && typeof v === 'object'),
  /** Atualiza uma chave do style do mode atual. */
  updateStyle: z.custom<UpdateStyleFn>((v) => typeof v === 'function'),
  /** Atualiza várias chaves de uma vez (usado em sidebar sync). */
  updateStyles: z.custom<UpdateStylesFn>((v) => typeof v === 'function'),
})

export type ColorsTabContentProps = z.infer<typeof ColorsTabContentPropsSchema>

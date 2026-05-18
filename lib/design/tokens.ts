// lib/design/tokens.ts — runtime token derivation (stub minimo).
//
// HOJE: theming via /api/{tenants,brands}/[id]/theme.css gera CSS direto do banco
// e injeta como <link rel="stylesheet">. ZERO componente edita tokens em JS
// (globals.css:140-141). Esta funcao NAO e chamada em fluxo de produto dia 0.
//
// GATILHO JIT (quando implementar de verdade):
//   - Admin UI pra trocar paleta em preview live (sem hit no banco)
//   - SSR de email/PDF onde nao da pra usar CSS endpoint
//   - Storybook stories renderizando tokens runtime
// Ate la: lancar e proteger contra uso indevido.

import { AppError } from '@/lib/contracts/errors'

import type { PaletteSeed } from './seeds/palettes.seed'

export type ThemeMode = 'light' | 'dark'

/** Tokens CSS derivados de palette + mode. Shape final fica JIT — depende de
 *  qual surface vai consumir (admin live preview vs SSR vs Storybook). */
export type DerivedTokens = Readonly<Record<string, string>>

export function deriveTokens(_palette: PaletteSeed, _mode: ThemeMode): DerivedTokens {
  throw AppError.internal(
    'deriveTokens nao implementado (JIT). Use /api/{tenants,brands}/[id]/theme.css.',
  )
}

// lib/i18n/config.ts — locales suportados (decisão D9 cravada).
//
// Sprint 1.2 — locales = ['pt-BR', 'en', 'es'], default 'pt-BR'.
// pt-BR sem prefixo na URL (localePrefix 'as-needed'); en/es com prefixo.
//
// Conteúdo de tenant é single-locale via tenants.default_locale (D10 — JIT
// migration quando tenant 2 ativar). Estes locales cobrem só strings de
// chrome do app (botões, labels, validações, auth flows).

export const locales = ['pt-BR', 'en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt-BR'

export function isValidLocale(value: string | undefined | null): value is Locale {
  if (!value) return false
  return (locales as readonly string[]).includes(value)
}

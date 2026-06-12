// lib/contracts/money.ts — Value object (amount_minor int + currency).
// Schema sempre armazena pair: <x>_amount_minor + <x>_currency (D-G33 multi-moeda dia 1).

import { z } from 'zod'

export const CURRENCIES = ['BRL', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN'] as const
export type Currency = (typeof CURRENCIES)[number]

export const moneySchema = z.object({
  amount_minor: z.number().int().nonnegative(),
  currency: z.enum(CURRENCIES),
})
export type Money = z.infer<typeof moneySchema>

export function money(amount_minor: number, currency: Currency = 'BRL'): Money {
  return { amount_minor: Math.round(amount_minor), currency }
}

export function fromMajor(amount_major: number, currency: Currency = 'BRL'): Money {
  return money(Math.round(amount_major * 100), currency)
}

export function toMajor(m: Money): number {
  return m.amount_minor / 100
}

const formatters = new Map<string, Intl.NumberFormat>()
export function formatMoney(m: Money, locale = 'pt-BR'): string {
  const key = `${locale}:${m.currency}`
  let fmt = formatters.get(key)
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: m.currency })
    formatters.set(key, fmt)
  }
  return fmt.format(toMajor(m))
}

// Operações seguras com error explícito em currency mismatch
import { AppError } from './errors'

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw AppError.invalidInput(`Currency mismatch: ${a.currency} vs ${b.currency}`)
  }
  return money(a.amount_minor + b.amount_minor, a.currency)
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw AppError.invalidInput(`Currency mismatch: ${a.currency} vs ${b.currency}`)
  }
  return money(a.amount_minor - b.amount_minor, a.currency)
}

export function multiplyMoney(m: Money, factor: number): Money {
  return money(Math.round(m.amount_minor * factor), m.currency)
}

// lib/i18n/detect-locale.ts — Sprint 1.2.
//
// Helper de detecção de locale via Accept-Language header.
// Usado pelo proxy.ts pra propagar locale via x-locale header.
//
// Ordem cravada (mandato Sprint 1.2 Phase D.5):
//   1. Cookie override (NEXT_LOCALE — gerado pelo LocaleSwitcher / next-intl)
//   2. Accept-Language header (negotiation simples)
//   3. brand.default_locale (FUTURO — JIT quando coluna brands.default_locale ativar)
//   4. defaultLocale ('pt-BR')

import type { NextRequest } from 'next/server'

import { defaultLocale, isValidLocale, locales } from './config'

const LOCALE_COOKIE = 'NEXT_LOCALE'

function pickFromAcceptLanguage(header: string | null): string | null {
  if (!header) return null

  // Parse first acceptable language tag. Lightweight — não negocia q-values
  // (sufficient pra MVP; ICU/Negotiator JIT se necessário).
  const candidates = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim())
    .filter((v): v is string => Boolean(v))

  for (const raw of candidates) {
    // 'pt-BR' direto match
    if (isValidLocale(raw)) return raw

    // Locale base ('pt', 'en', 'es') — map pro nosso superset
    const base = raw.split('-')[0]?.toLowerCase()
    if (!base) continue
    if (base === 'pt') return 'pt-BR'
    if (base === 'en') return 'en'
    if (base === 'es') return 'es'
  }
  return null
}

export function detectLocale(req: NextRequest): string {
  // 1. Cookie override
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale

  // 2. Accept-Language
  const fromHeader = pickFromAcceptLanguage(req.headers.get('accept-language'))
  if (fromHeader) return fromHeader

  // 3. defaultLocale fallback (D10: brand.default_locale JIT futuro)
  return defaultLocale
}

export const LOCALE_HEADER = 'x-locale'

// Paths que NÃO usam locale routing (D8 cravado — painel + auth interno).
// next-intl middleware é skipado pra essas — proxy.ts só seta x-locale header
// pra side effects (analytics, log).
const NON_LOCALIZED_PREFIXES = [
  '/api',
  '/auth/callback',
  '/auth/confirm',
  '/auth/error',
  '/auth/oauth',
  '/_next',
  '/sw.js',
  '/serwist',
  // Painel logado (D8) — sob (painel) route group
  '/inicio',
  '/conversas',
  '/estudio',
  '/respostas',
  '/temas',
  '/configuracoes',
  '/agenda',
  '/financeiro',
  // Auth PT-BR routes — auth NÃO localizado (D8)
  '/entrar',
  '/cadastrar',
  '/esqueci-senha',
  '/nova-senha',
  '/sair',
  // Auth tech routes (EN — referenciado por Supabase email templates / OAuth callbacks)
  '/auth/update-password',
  // Tech routes
  '/offline',
  '/portal',
  '/protected',
  '/teste',
  // Showcase de templates de sites publicados (ADR-0070) — sob (showcase) route group, sem locale
  '/templates',
] as const

export function isLocalizedPath(pathname: string): boolean {
  // Root '/' é localizado (landing root da marca).
  if (pathname === '/') return true

  for (const prefix of NON_LOCALIZED_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return false
  }

  // Locale prefix explícito (/en/*, /es/*, /pt-BR/*) — localizado.
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  if (firstSegment && (locales as readonly string[]).includes(firstSegment)) return true

  // Restante (/agencia, /formularios/*, /relatorios/*) — localizado (default sem prefix).
  return true
}

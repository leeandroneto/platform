// RESEARCH: custom — vitest test pra detect-locale Sprint 1.2 D.5.

import { describe, expect, it } from 'vitest'

import { detectLocale, isLocalizedPath } from '../detect-locale'

type CookieEntry = { name: string; value: string }

function mockReq({
  cookies: cookieList = [],
  acceptLanguage,
}: {
  cookies?: CookieEntry[]
  acceptLanguage?: string
}) {
  const cookieMap = new Map(cookieList.map((c) => [c.name, c]))
  const headers = new Map<string, string>()
  if (acceptLanguage) headers.set('accept-language', acceptLanguage)

  return {
    cookies: {
      get: (name: string) => cookieMap.get(name),
    },
    headers: {
      get: (name: string) => headers.get(name.toLowerCase()) ?? null,
    },
  } as unknown as Parameters<typeof detectLocale>[0]
}

describe('detectLocale', () => {
  it('cookie NEXT_LOCALE = en vence sobre Accept-Language pt-BR', () => {
    const req = mockReq({
      cookies: [{ name: 'NEXT_LOCALE', value: 'en' }],
      acceptLanguage: 'pt-BR,pt;q=0.9',
    })
    expect(detectLocale(req)).toBe('en')
  })

  it('cookie NEXT_LOCALE = es vence sobre Accept-Language pt-BR', () => {
    const req = mockReq({
      cookies: [{ name: 'NEXT_LOCALE', value: 'es' }],
      acceptLanguage: 'pt-BR',
    })
    expect(detectLocale(req)).toBe('es')
  })

  it('cookie NEXT_LOCALE inválido ignorado, usa Accept-Language', () => {
    const req = mockReq({
      cookies: [{ name: 'NEXT_LOCALE', value: 'fr' }],
      acceptLanguage: 'en-US,en;q=0.9',
    })
    expect(detectLocale(req)).toBe('en')
  })

  it('Accept-Language pt → pt-BR (mapeamento)', () => {
    const req = mockReq({ acceptLanguage: 'pt' })
    expect(detectLocale(req)).toBe('pt-BR')
  })

  it('Accept-Language pt-PT → pt-BR (fallback nosso superset)', () => {
    const req = mockReq({ acceptLanguage: 'pt-PT,pt;q=0.9' })
    expect(detectLocale(req)).toBe('pt-BR')
  })

  it('Accept-Language en-US → en', () => {
    const req = mockReq({ acceptLanguage: 'en-US,en;q=0.8' })
    expect(detectLocale(req)).toBe('en')
  })

  it('Accept-Language es-MX → es', () => {
    const req = mockReq({ acceptLanguage: 'es-MX,es;q=0.9,en;q=0.5' })
    expect(detectLocale(req)).toBe('es')
  })

  it('Accept-Language vazio → defaultLocale pt-BR', () => {
    const req = mockReq({})
    expect(detectLocale(req)).toBe('pt-BR')
  })

  it('Accept-Language ja-JP (não suportado) → defaultLocale pt-BR', () => {
    const req = mockReq({ acceptLanguage: 'ja-JP,ja;q=0.9' })
    expect(detectLocale(req)).toBe('pt-BR')
  })

  it('cookie NEXT_LOCALE pt-BR válido respeitado', () => {
    const req = mockReq({
      cookies: [{ name: 'NEXT_LOCALE', value: 'pt-BR' }],
      acceptLanguage: 'en',
    })
    expect(detectLocale(req)).toBe('pt-BR')
  })
})

describe('isLocalizedPath', () => {
  it('/ é localizado (landing root)', () => {
    expect(isLocalizedPath('/')).toBe(true)
  })

  it('/agencia é localizado', () => {
    expect(isLocalizedPath('/agencia')).toBe(true)
  })

  it('/formularios/abc é localizado', () => {
    expect(isLocalizedPath('/formularios/abc')).toBe(true)
  })

  it('/relatorios/xyz é localizado', () => {
    expect(isLocalizedPath('/relatorios/xyz')).toBe(true)
  })

  it('/pt-BR/agencia é localizado (prefix explícito)', () => {
    expect(isLocalizedPath('/pt-BR/agencia')).toBe(true)
  })

  it('/en/agencia é localizado', () => {
    expect(isLocalizedPath('/en/agencia')).toBe(true)
  })

  it('/es/formularios/abc é localizado', () => {
    expect(isLocalizedPath('/es/formularios/abc')).toBe(true)
  })

  it('/entrar NÃO é localizado (D8 auth)', () => {
    expect(isLocalizedPath('/entrar')).toBe(false)
  })

  it('/cadastrar NÃO é localizado (D8 auth)', () => {
    expect(isLocalizedPath('/cadastrar')).toBe(false)
  })

  it('/sair NÃO é localizado (D8 auth)', () => {
    expect(isLocalizedPath('/sair')).toBe(false)
  })

  it('/auth/callback NÃO é localizado (rota técnica)', () => {
    expect(isLocalizedPath('/auth/callback')).toBe(false)
  })

  it('/api/chat NÃO é localizado', () => {
    expect(isLocalizedPath('/api/chat')).toBe(false)
  })

  it('/inicio NÃO é localizado (D8 painel)', () => {
    expect(isLocalizedPath('/inicio')).toBe(false)
  })

  it('/conversas NÃO é localizado (D8 painel)', () => {
    expect(isLocalizedPath('/conversas')).toBe(false)
  })

  it('/conversas/123 NÃO é localizado (D8 painel)', () => {
    expect(isLocalizedPath('/conversas/123')).toBe(false)
  })

  it('/estudio/formularios NÃO é localizado (D8 painel)', () => {
    expect(isLocalizedPath('/estudio/formularios')).toBe(false)
  })

  it('/temas NÃO é localizado (D8 painel)', () => {
    expect(isLocalizedPath('/temas')).toBe(false)
  })

  it('/configuracoes NÃO é localizado (D8 painel)', () => {
    expect(isLocalizedPath('/configuracoes')).toBe(false)
  })
})

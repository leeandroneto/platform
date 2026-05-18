import { describe, expect, it } from 'vitest'

describe('smoke', () => {
  it('vitest está rodando', () => {
    expect(true).toBe(true)
  })

  it('env validation carrega sem crash', async () => {
    // Smoke import — não usa env real, só valida que módulo não quebra
    const mod = await import('@/lib/contracts/result')
    expect(typeof mod.ok).toBe('function')
    expect(typeof mod.fail).toBe('function')
  })
})

// tests/apca-w3.smoke.test.ts — valida shim TS (types/apca-w3.d.ts) bate com runtime real.
// API real: APCAcontrast(textY, bgY) onde Y vem de sRGBtoY([r,g,b]).
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { describe, expect, it } from 'vitest'

describe('apca-w3 shim matches runtime', () => {
  it('sRGBtoY returns number from RGB array', () => {
    const y = sRGBtoY([255, 255, 255])
    expect(typeof y).toBe('number')
    expect(y).toBeGreaterThan(0)
  })

  it('APCAcontrast returns high Lc for white-on-black', () => {
    const whiteY = sRGBtoY([255, 255, 255])
    const blackY = sRGBtoY([0, 0, 0])
    const lc = APCAcontrast(whiteY, blackY)
    expect(typeof lc).toBe('number')
    // White text on black bg should give negative Lc ~ -107 (or positive 107 reversed)
    expect(Math.abs(Number(lc))).toBeGreaterThan(100)
  })
})

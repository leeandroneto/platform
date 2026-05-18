// types/apca-w3.d.ts — shim TS pra apca-w3 (sem types oficiais)
// Smoke test em tests/apca-w3.smoke.test.ts valida runtime match.
declare module 'apca-w3' {
  // Lc score: 0-108 absolute value (negative = light text on dark bg)
  export function APCAcontrast(
    textColor: number, // sRGB hex like 0xFFFFFF
    bgColor: number, // sRGB hex like 0x000000
  ): number

  export function sRGBtoY(rgb: [r: number, g: number, b: number]): number
}

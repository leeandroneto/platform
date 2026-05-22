// types/ngard-tiny-isequal.d.ts — shim TS pra @ngard/tiny-isequal (sem types oficiais).
// Pacote CJS minúsculo (lodash.isequal-like, ~1KB) usado em
// app/temas/_state/theme-history-reducer.ts pra debounce protection.
declare module '@ngard/tiny-isequal' {
  export function isEqual(a: unknown, b: unknown): boolean
}

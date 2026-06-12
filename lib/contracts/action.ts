// lib/contracts/action.ts — Server Action return type SSOT.
// Alias semantico de Result<T, AppError> + re-export dos helpers. Discoverability
// para callsites em app/<route>/actions.ts ("import from @/lib/contracts/action").
//
// Stub minimo dia 0 (plano Etapa 3). Abstracao de wrapper (defineAction com
// schema + handler) e JIT — gatilho: 3+ Server Actions repetindo padrao
// safeParse + try/catch + return Result. Quando ocorrer, abrir ADR.

import type { AppError } from './errors'
import type { Result } from './result'

export { fail, isFail, isOk, mapResult, ok, unwrap } from './result'

/** Return type canonico de Server Action. Alias de Result<T, AppError>. */
export type ActionResult<T> = Result<T, AppError>

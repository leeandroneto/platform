// lib/contracts/result.ts — SSOT Result<T, AppError> discriminated union (D-G55).
// Server Actions retornam Result. Data layer lança AppError.

import type { AppError } from './errors'

export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E }

export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data }
}

export function fail<E = AppError>(error: E): Result<never, E> {
  return { ok: false, error }
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; data: T } {
  return result.ok === true
}

export function isFail<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return result.ok === false
}

// Helper: extrai data ou lança erro (uso em camadas que querem throw)
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) return result.data
  throw result.error
}

// Helper: map sobre data se sucesso, passa erro adiante
export function mapResult<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.data)) : result
}

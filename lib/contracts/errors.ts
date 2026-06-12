// lib/contracts/errors.ts — Tagged variant AppError com suporte i18n (ADR-0040 §G).
// Usado tanto em throw (data layer) quanto em fail() (server action).
//
// Factories aceitam I18nMessage = string | { key, fallback, metadata? }.
// Quando objeto: armazena `fallback` como message (Sentry-friendly EN) +
// `i18nKey` em metadata pra UI traduzir via t(error.metadata.i18nKey).

export type AppErrorCode =
  | 'invalid_input'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'rate_limited'
  | 'external_service'
  | 'internal'
  | 'tenant_mismatch'
  | 'brand_not_configured'
  | 'budget_exceeded'

export interface AppError {
  readonly _tag: 'AppError'
  readonly code: AppErrorCode
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Record<string, unknown>
}

/** Mensagem que aceita string crua (EN, Sentry-friendly) OU objeto com key i18n. */
export type I18nMessage =
  | string
  | { readonly key: string; readonly fallback: string; readonly metadata?: Record<string, unknown> }

class AppErrorImpl extends Error implements AppError {
  readonly _tag = 'AppError' as const
  readonly code: AppErrorCode
  readonly metadata?: Record<string, unknown>

  constructor(
    code: AppErrorCode,
    message: string,
    opts?: { cause?: unknown; metadata?: Record<string, unknown> },
  ) {
    super(message, { cause: opts?.cause })
    this.code = code
    this.metadata = opts?.metadata
    this.name = 'AppError'
  }
}

function normalize(msg: I18nMessage): {
  message: string
  i18nKey?: string
  embeddedMetadata?: Record<string, unknown>
} {
  if (typeof msg === 'string') return { message: msg }
  return { message: msg.fallback, i18nKey: msg.key, embeddedMetadata: msg.metadata }
}

function make(
  code: AppErrorCode,
  msg: I18nMessage,
  extraMetadata?: Record<string, unknown>,
  cause?: unknown,
): AppError {
  const { message, i18nKey, embeddedMetadata } = normalize(msg)
  const merged: Record<string, unknown> = {
    ...embeddedMetadata,
    ...extraMetadata,
    ...(i18nKey ? { i18nKey } : {}),
  }
  return new AppErrorImpl(code, message, {
    cause,
    metadata: Object.keys(merged).length > 0 ? merged : undefined,
  })
}

export const AppError = {
  invalidInput(msg: I18nMessage, metadata?: Record<string, unknown>): AppError {
    return make('invalid_input', msg, metadata)
  },
  notFound(msg: I18nMessage = 'Resource not found', metadata?: Record<string, unknown>): AppError {
    return make('not_found', msg, metadata)
  },
  unauthorized(
    msg: I18nMessage = 'Authentication required',
    metadata?: Record<string, unknown>,
  ): AppError {
    return make('unauthorized', msg, metadata)
  },
  forbidden(msg: I18nMessage = 'Forbidden', metadata?: Record<string, unknown>): AppError {
    return make('forbidden', msg, metadata)
  },
  conflict(msg: I18nMessage, metadata?: Record<string, unknown>): AppError {
    return make('conflict', msg, metadata)
  },
  rateLimited(
    msg: I18nMessage = 'Rate limit exceeded',
    metadata?: Record<string, unknown>,
  ): AppError {
    return make('rate_limited', msg, metadata)
  },
  externalService(msg: I18nMessage, cause?: unknown): AppError {
    return make('external_service', msg, undefined, cause)
  },
  internal(msg: I18nMessage = 'Internal error', cause?: unknown): AppError {
    return make('internal', msg, undefined, cause)
  },
  tenantMismatch(
    msg: I18nMessage = 'Tenant mismatch',
    metadata?: Record<string, unknown>,
  ): AppError {
    return make('tenant_mismatch', msg, metadata)
  },
  brandNotConfigured(host: string): AppError {
    return make('brand_not_configured', `Brand not configured for host: ${host}`, { host })
  },
  budgetExceeded(
    msg: I18nMessage = 'Budget exceeded for tenant',
    metadata?: Record<string, unknown>,
  ): AppError {
    return make('budget_exceeded', msg, metadata)
  },
  // Adapter pra qualquer erro nativo (Supabase, fetch, etc)
  from(err: unknown): AppError {
    if (err instanceof AppErrorImpl) return err
    if (err instanceof Error) return new AppErrorImpl('internal', err.message, { cause: err })
    return new AppErrorImpl('internal', String(err))
  },
}

// Helper `getI18nKey(error)` JIT — quando 3+ callsites em UI consumirem
// `error.metadata?.['i18nKey']` direto, abstrair em helper exportado.

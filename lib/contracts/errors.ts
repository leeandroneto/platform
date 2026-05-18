// lib/contracts/errors.ts — Tagged variant AppError.
// Usado tanto em throw (data layer) quanto em fail() (server action).

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

export const AppError = {
  invalidInput(message: string, metadata?: Record<string, unknown>): AppError {
    return new AppErrorImpl('invalid_input', message, { metadata })
  },
  notFound(message = 'Resource not found', metadata?: Record<string, unknown>): AppError {
    return new AppErrorImpl('not_found', message, { metadata })
  },
  unauthorized(message = 'Authentication required'): AppError {
    return new AppErrorImpl('unauthorized', message)
  },
  forbidden(message = 'Forbidden'): AppError {
    return new AppErrorImpl('forbidden', message)
  },
  conflict(message: string, metadata?: Record<string, unknown>): AppError {
    return new AppErrorImpl('conflict', message, { metadata })
  },
  rateLimited(message = 'Rate limit exceeded'): AppError {
    return new AppErrorImpl('rate_limited', message)
  },
  externalService(message: string, cause?: unknown): AppError {
    return new AppErrorImpl('external_service', message, { cause })
  },
  internal(message = 'Internal error', cause?: unknown): AppError {
    return new AppErrorImpl('internal', message, { cause })
  },
  tenantMismatch(message = 'Tenant mismatch'): AppError {
    return new AppErrorImpl('tenant_mismatch', message)
  },
  brandNotConfigured(host: string): AppError {
    return new AppErrorImpl('brand_not_configured', `Brand not configured for host: ${host}`)
  },
  budgetExceeded(message = 'Budget exceeded for tenant'): AppError {
    return new AppErrorImpl('budget_exceeded', message)
  },
  // Adapter pra qualquer erro nativo (Supabase, fetch, etc)
  from(err: unknown): AppError {
    if (err instanceof AppErrorImpl) return err
    if (err instanceof Error) return new AppErrorImpl('internal', err.message, { cause: err })
    return new AppErrorImpl('internal', String(err))
  },
}

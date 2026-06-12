// lib/env.ts — Validação Zod das env vars em build time + runtime.
// Falha o build se var obrigatória faltar.

import { z } from 'zod'

// Helper: trata "" (linhas vazias do .env.local) como undefined antes do .optional().
// Pattern padrão pra envs com placeholders vazios em dev.
const optStr = <S extends z.ZodTypeAny>(inner?: S) =>
  z.preprocess((v) => (v === '' ? undefined : v), (inner ?? z.string().min(1)).optional())

const optUrl = () => optStr(z.string().url())
const optEmailOrMailto = () => optStr(z.string().email().or(z.string().startsWith('mailto:')))

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_PROJECT_REF: z.string().min(1),

  // Session
  SESSION_SECRET: z.string().min(32),

  // PWA Web Push (fallback global)
  VAPID_PUBLIC_KEY: optStr(),
  VAPID_PRIVATE_KEY: optStr(),
  VAPID_SUBJECT: optEmailOrMailto(),

  // Email
  RESEND_API_KEY: optStr(),

  // Observability
  SENTRY_DSN: optUrl(),

  // AI
  VERCEL_AI_GATEWAY_API_KEY: optStr(),
  ANTHROPIC_API_KEY: optStr(),

  // WhatsApp
  WHATSAPP_CLOUD_TOKEN: optStr(),

  // Billing plataforma → prof
  EFI_CLIENT_ID: optStr(),
  EFI_CLIENT_SECRET: optStr(),
  EFI_CERT_PATH: optStr(),

  // Analytics
  META_PIXEL_ID: optStr(),
  META_CAPI_TOKEN: optStr(),
  GA4_MEASUREMENT_ID: optStr(),

  // Google Fonts Developer API (theme-studio font picker catalog)
  GOOGLE_FONTS_API_KEY: optStr(),
})

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_DEFAULT_BRAND_HOST: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_KEY: optStr(),
  NEXT_PUBLIC_POSTHOG_HOST: optUrl(),
})

function parseServer() {
  // No client, server vars são undefined — não validar pra evitar crash.
  if (typeof window !== 'undefined') return {} as z.infer<typeof serverSchema>
  const result = serverSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Invalid server env vars:', result.error.flatten().fieldErrors)
    throw new Error('Invalid server env vars — abort')
  }
  return result.data
}

function parseClient() {
  const result = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_DEFAULT_BRAND_HOST: process.env.NEXT_PUBLIC_DEFAULT_BRAND_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })
  if (!result.success) {
    console.error('❌ Invalid client env vars:', result.error.flatten().fieldErrors)
    throw new Error('Invalid client env vars — abort')
  }
  return result.data
}

export const env = {
  ...parseServer(),
  ...parseClient(),
}

export type Env = typeof env

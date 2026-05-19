// Vercel project config (D-G68 — substitui vercel.json com TypeScript + lógica dinâmica).
// Docs: https://vercel.com/docs/project-configuration/vercel-ts
import { routes, type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'pnpm build',
  installCommand: 'pnpm install --frozen-lockfile',

  // ─── Headers ──────────────────────────────────────────────────────────
  // Cache imutável para tema dinâmico por tenant (D-G59) e assets versionados.
  headers: [
    routes.cacheControl('/api/tenants/(.*)/theme.css', {
      public: true,
      maxAge: '1 day',
      sMaxAge: '1 day',
      staleWhileRevalidate: '1 week',
    }),
    routes.cacheControl('/_next/static/(.*)', {
      public: true,
      maxAge: '1 year',
      immutable: true,
    }),
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],

  // ─── Rewrites PT-BR → EN interno ──────────────────────────────────────
  // URL pública em pt-BR; código em EN (regra naming.md).
  // /portal/* (área do cliente final, multi-vertical) é EN puro — sem rewrite.
  rewrites: [routes.rewrite('/influenciador/:path*', '/influencer/:path*')],

  // ─── Redirects de canonização ─────────────────────────────────────────
  redirects: [{ source: '/home', destination: '/', permanent: true }],

  // ─── Crons ────────────────────────────────────────────────────────────
  // Removidos do vercel.ts dia 1 — Hobby plan permite só 1x/dia.
  // JIT re-adicionar quando rotas `/api/cron/*` forem criadas:
  //   - daily-retention-cleanup (Fase 1) — delete submissions > forms.retention_days
  //   - weekly-eval-forms (Fase 1) — Slack alert se score IA cai >10%
  //   - aggregate-metrics-daily (Fase 2) — agregação analytics
  //   - cleanup-stale-uploads (Fase 1-2) — limpa Blob órfãos
  //   - process-scheduled-jobs (Fase 3, Program Engine) — */5 min, EXIGE Vercel Pro
  // Plan §3.8 do PLANO-DIA-1 lista os 2 primeiros.
  // crons: [],

  // ─── Functions config ─────────────────────────────────────────────────
  // Padrão Fluid Compute (Node.js, default 2026); região alinhada com Supabase BR.
  functions: {
    'app/api/**/*': {
      maxDuration: 60,
      regions: ['gru1'], // São Paulo
    },
  },
}

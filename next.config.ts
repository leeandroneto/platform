import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import { withSerwist } from '@serwist/turbopack'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Serwist Turbopack (ADR-0014 + blueprint 08). SW source em app/sw.ts, servido
// dinamicamente via /serwist/sw.js (route handler em app/serwist/[path]/route.ts).
// Configuracao adicional (cacheOnNavigation, additionalPrecacheEntries, etc) vive
// na route handler — @serwist/turbopack withSerwist apenas habilita o pipeline.

const baseConfig: NextConfig = {
  // ─── Next 16.2 features (promovidos pra top-level) ──────────────────────
  // reactCompiler requer `pnpm add -D babel-plugin-react-compiler` — defer (otimização, não funcionalidade)
  // reactCompiler: true,
  // cacheComponents: useCache + cacheLife/cacheTag + PPR (merged)
  cacheComponents: true,

  experimental: {
    // View Transitions API — shared element transitions zero-config
    viewTransition: true,
  },

  // ─── Image optimization ─────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ─── React strict mode ──────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── TypeScript: build falha em erro de tipo (CI roda lint separado) ────
  // ESLint config foi removida do next.config no Next 16.2 — usar eslint.config.mjs.
  typescript: { ignoreBuildErrors: false },

  // ─── Bundle analyzer opt-in ─────────────────────────────────────────────
  // Rodar: ANALYZE=true pnpm build
}

// ─── Serwist + next-intl wire (Etapa 10A PWA) ──────────────────────────────
// Ordem: withSerwist(withNextIntl(baseConfig)) — Serwist envolve por fora (gera SW
// na fase final do build). next-intl injeta plugin via createNextIntlPlugin.
export default withSerwist(withNextIntl(baseConfig))

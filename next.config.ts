import type { NextConfig } from 'next'

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

// ─── Serwist (PWA service worker — ADR-0014) — DEFERRED ──────────────────
// PWA entra em Sprint 14 (1º upgrade A→B, Pacote B/C). Princípio §39:
// ferramenta entra com 1º cliente real que precisa. Reativar:
//   1. pnpm add @serwist/next @serwist/turbopack (já instalados — manter)
//   2. Criar app/sw.ts (template em docs/blueprint/_boilerplate/sw/)
//   3. Descomentar e usar:
//        import withSerwist from '@serwist/next'
//        export default withSerwist({
//          swSrc: 'app/sw.ts',
//          swDest: 'public/sw.js',
//          cacheOnNavigation: true,
//          reloadOnOnline: true,
//          disable: process.env.NODE_ENV === 'development',
//        })(baseConfig)
export default baseConfig

// app/serwist/[path]/route.ts — Serwist Turbopack route handler (ADR-0014 + blueprint 08).
// Serve o SW compilado em runtime via /serwist/sw.js (Turbopack nao suporta plugin estatico).
// SW source em app/sw.ts. additionalPrecacheEntries: /offline pra fallback navigation.

import { createSerwistRoute } from '@serwist/turbopack'

// Revision baseada em git SHA pra cache-bust automatico a cada deploy.
// Fallback random pra dev/CI sem git context.
const revision = process.env['GIT_SHA'] ?? crypto.randomUUID()

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute(
  {
    additionalPrecacheEntries: [{ url: '/offline', revision }],
    swSrc: 'app/sw.ts',
    useNativeEsbuild: true,
  },
)

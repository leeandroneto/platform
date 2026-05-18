# 0014. Serwist + Turbopack para PWA service worker

Date: 2026-05-17 · Atualizado 2026-05-18 (Etapa 10A — migração `@serwist/next` → `@serwist/turbopack`)
Status: accepted

## Context

Next.js 16 usa Turbopack default. Pesquisa 12 (PWA offline-first) recomenda Serwist (sucessor moderno do next-pwa). Suporte Turbopack ainda em GA recente. Fonte: `_CONFLITOS.md #14`.

## Decision

Serwist + Turbopack via `@serwist/turbopack` (NÃO `@serwist/next` que NÃO suporta Turbopack — warning explícito do plugin).

### Setup canônico (Etapa 10A 2026-05-18):

1. Deps: `@serwist/turbopack` + `serwist` + `esbuild` (dev) + `@serwist/next` permanece como peer dep
2. `next.config.ts`: `import { withSerwist } from '@serwist/turbopack'` + `export default withSerwist(withNextIntl(baseConfig))`
3. SW source: `app/sw.ts` (mesmo)
4. Route handler dinâmico: `app/serwist/[path]/route.ts` usa `createSerwistRoute()` — SW servido em `/serwist/sw.js` (não mais `/sw.js`)
5. Config (additionalPrecacheEntries, swSrc, useNativeEsbuild) vive na route handler — NÃO em next.config.ts

### Cache strategies (mantém):

- Runtime caching: NetworkFirst (API), CacheFirst (static), StaleWhileRevalidate (HTML) — via `defaultCache` em sw.ts
- Precache: shell + ícones + fonts + `/offline` fallback
- IndexedDB queue (idb-keyval) pra mutation offline (ADR-0015) — JIT Sprint 14+
- Background Sync API → fallback foreground flusher iOS — JIT Sprint 14+

### Registration JIT:

`SerwistProvider` (client component que registra SW via `navigator.serviceWorker.register`) NÃO instalado dia 0. JIT quando Feature 1 precisar de offline real. Manifest+ícones funcionam sem registration (PWA install card aparece).

## Consequences

**Positivo:**

- Padrão oficial Next 16 (não next-pwa abandonado)
- Compatível com React Server Components
- DX bom (precache automático shell)

**Negativo:**

- Turbopack support em GA recente → risco edge case
- Mitigação: fallback Webpack documentado

**Neutro:**

- Detalhes em `08-pwa-offline.md`
- ADR-0015 (idb-keyval) é dependência direta

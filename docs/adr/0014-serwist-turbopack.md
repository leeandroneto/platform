# 0014. Serwist + Turbopack para PWA service worker

Date: 2026-05-17
Status: accepted

## Context

Next.js 16 usa Turbopack default. Pesquisa 12 (PWA offline-first) recomenda Serwist (sucessor moderno do next-pwa). Suporte Turbopack ainda em GA recente. Fonte: `_CONFLITOS.md #14`.

## Decision

Serwist + Turbopack nativo (`@serwist/next` + `@serwist/turbopack`). Padrão oficial alinhado com princípio universal (`_CONFLITOS #8`).

Configuração:
- Runtime caching: NetworkFirst (API), CacheFirst (static), StaleWhileRevalidate (HTML)
- Precache: shell + ícones + fonts
- IndexedDB queue (idb-keyval) pra mutation offline (ADR-0015)
- Background Sync API → fallback foreground flusher iOS

**Fallback:** se Serwist+Turbopack quebrar no dia 0 bootstrap → novo ADR documenta fallback pra Webpack só em `next build` produção. Não inventar solução nova.

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

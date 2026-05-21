# 08 — App Shell Architecture

> **Canon source:** Google / web.dev · App Shell pattern · Service Worker spec · Workbox

## Canon

**Google App Shell pattern:**

> "An App Shell is an architectural pattern for building Progressive Web Applications where you only ship the minimal critical resources in order to load your site and later lazy load other non-critical data or resources. The 'shell' consists of the core HTML, CSS, and JavaScript required to render the user interface."

**Service Worker role:**

> "A Service Worker is a script that runs in the background and manages caching, push notifications, and background sync. The service worker caches essential files during the install event and intercepts network requests during the fetch event, serving cached files when available."

## Composição do Shell

O **shell** é tudo que dá moldura ao app — pra desafit aluno:

| Camada             | Conteúdo                                                  | Estratégia                                |
| ------------------ | --------------------------------------------------------- | ----------------------------------------- |
| **Shell estático** | Top bar, Bottom nav, Layout root, Splash, Erro fallback   | Cache-first (pre-cached em install)       |
| **Shell dynamic**  | User identity (avatar, nome), brand colors atuais, locale | Network-first com cache fallback          |
| **Conteúdo**       | Treinos, programa, comunidade feed                        | Network-first / Stale-while-revalidate    |
| **Assets pesados** | Vídeos, imagens HD                                        | Cache on access, evict via Workbox quotas |

## Caching strategies canon

| Strategy                          | Usar pra                                      | Comportamento                                 |
| --------------------------------- | --------------------------------------------- | --------------------------------------------- |
| **Cache-only**                    | Shell HTML/CSS/JS, fontes, ícones SVG         | Nunca toca rede; offline-first                |
| **Cache-first, network fallback** | Imagens estáticas, illustrations              | Cache primeiro; se miss, network + cacheia    |
| **Network-first, cache fallback** | API JSON, user data, programa atual           | Tenta rede; se falha (offline), cache         |
| **Stale-while-revalidate**        | Feed comunidade, listas que toleram staleness | Serve cache imediato + atualiza em background |
| **Network-only**                  | POSTs, server actions, auth                   | Sempre rede; sem cache                        |

## First paint target

> "First paint < 1s target" — Google recommendation pra "feel nativo"

Shell pre-cached + skeleton para conteúdo → first contentful paint sub-1s em load subsequente. Primeira load (cold) deps de network do tenant; aceitável até 2.5s LCP (Core Web Vitals "good").

## Skeleton screens vs spinners

**Material canon e Google guidance:** skeletons preferido pra perceived-perf. Spinner aceitável apenas para loading <1s ou unknown-duration explicit (upload, generation).

| Caso                                                | Default                                                    |
| --------------------------------------------------- | ---------------------------------------------------------- |
| Tela primeira carga (lista, feed, programa detalhe) | **Skeleton** (cards-shaped placeholders)                   |
| Refresh por user action                             | Spinner top-bar inline OU swipe pull-to-refresh affordance |
| Upload / IA generation                              | Progress bar com %, spinner se indeterminado               |
| Saving form                                         | Inline "Saving…" + disabled state                          |

## Implicação desafit

**Service worker:** já usamos **Serwist** (`@serwist/turbopack`, ADR-0014). Estratégia:

```ts
// app/sw.ts (Serwist)
import { defaultCache } from '@serwist/next/worker'
import { Serwist } from 'serwist'

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST, // shell + critical assets
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    // Shell: cache-first
    {
      matcher: ({ request }) => ['style', 'script', 'font'].includes(request.destination),
      handler: 'CacheFirst',
      options: { cacheName: 'shell-static-v1' },
    },
    // API: network-first
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: { cacheName: 'api-cache-v1', networkTimeoutSeconds: 3 },
    },
    // Imagens: stale-while-revalidate
    {
      matcher: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'images-v1' },
    },
  ],
})
```

**Skeleton primitives** (Layer B varia color/radius):

```tsx
// components/student/Skeleton.tsx
<div
  role="status"
  aria-label={t('common.loading')}
  className="
    animate-pulse                                  /* timing varia per archetype */
    rounded-md                                     /* radius herda archetype */
    bg-[--surface-muted]                           /* cor herda */
  "
/>
```

**Splash strategy:** PWA standalone iOS exige `apple-touch-startup-image`. Plano: começar com 1 imagem genérica (logo + brand bg) + theme-color match; expandir matrix sob demanda (não bloquear MVP).

## Cache versioning

Critical: ao mudar shell, `cacheName` deve bumpar (`shell-static-v1` → `v2`) pra forçar SW update. Workbox/Serwist handle via revision in manifest.

## Layer B varia per archetype

| Atributo                                                   | Varia?   | Notas                                 |
| ---------------------------------------------------------- | -------- | ------------------------------------- |
| Shell composition (TopBar + BottomNav fixos)               | ❌ FIXO  | Estrutura cross-archetype             |
| Cache strategies (CacheFirst shell, NetworkFirst API)      | ❌ FIXO  | Tier-1 decision                       |
| Skeleton > spinner default                                 | ❌ FIXO  | Perceived-perf                        |
| `<1s first paint` target                                   | ❌ FIXO  | Performance budget                    |
| **Skeleton background color**                              | ✅ VARIA | Herda `--surface-muted`               |
| **Skeleton radius**                                        | ✅ VARIA | Herda archetype                       |
| **Skeleton animation timing** (pulse vs shimmer vs static) | ✅ VARIA | Per archetype                         |
| **Splash background + logo**                               | ✅ VARIA | Tenant brand                          |
| **theme-color meta**                                       | ✅ VARIA | Tenant `--surface-base` ou `--accent` |

## Fontes

- Google App Shell pattern original: <https://developers.google.com/web/fundamentals/architecture/app-shell>
- web.dev PWA learn: <https://web.dev/learn/pwa/>
- Workbox docs: <https://developer.chrome.com/docs/workbox>
- Serwist (atual stack desafit): <https://serwist.pages.dev/>
- Caching strategies overview: <https://vaadin.com/pwa/learn/caching-strategies>

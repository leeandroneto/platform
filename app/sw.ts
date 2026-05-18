/// <reference lib="webworker" />
// app/sw.ts — Service Worker (Serwist + Turbopack — ADR-0014).
// Skeleton dia 0: defaultCache cobre static + HTML + fonts. Customizacao avancada
// (Supabase Storage, push handler, IDB queue, sync) JIT por feature — blueprint 08 §2.
// reloadOnOnline:false (blueprint 08 §11): reconnect nao limpa unsaved form state.

import { defaultCache } from '@serwist/next/worker'
import { type PrecacheEntry, Serwist, type SerwistGlobalConfig } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }: { request: Request }) {
          return request.destination === 'document'
        },
      },
    ],
  },
})

serwist.addEventListeners()

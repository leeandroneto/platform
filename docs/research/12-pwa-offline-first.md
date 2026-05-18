# PWA Offline-First Patterns for Next.js 16 + React 19 — Fitness Aluno App (May 2026)

Stack-locked: Next.js 16 App Router, React 19, TS, Tailwind v4, Supabase, Vercel, vaul, Bunny Stream, shadcn new-york, Motion 12, next-intl 4, Serwist/Workbox, Dexie. Targets: mobile-first aluno PWA, 3–5x/day usage, Lighthouse PWA 100.

---

## A) Service Worker library — Decision

| Lib                               | 2026 status                                                                                                                                                                                                                                                                                                                                                                        | Verdict    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Serwist `@serwist/next` 9.1.x** | Actively maintained (last publish weeks ago), TypeScript-first, ships `defaultCache` runtime presets, drop-in for Next.js App Router. Historically required `next build --webpack`, but **`@serwist/turbopack` (v9.5.x, published within the last week)** now provides first-class Turbopack support via `withSerwist`/`createSerwistRoute`. Bundle: ~15 KB gz for the SW runtime. | **CHOSEN** |
| Workbox direct                    | Underlying engine inside Serwist; using it raw means hand-writing the Next.js build glue (precache manifest injection, route handler). More boilerplate, no upside for solo dev.                                                                                                                                                                                                   | Fallback   |
| next-pwa (shadowwalker)           | **Abandoned** — v5.6.0 was the last release (Dec 2022, ~4 yrs ago). Snyk flags maintenance as Inactive. DuCanhGH fork is the only loosely active branch.                                                                                                                                                                                                                           | Reject     |
| Hand-rolled `public/sw.ts`        | Viable but you re-implement precache hashing, runtime strategies, expiration, navigation preload. Wastes Claude Code cycles on solved problems.                                                                                                                                                                                                                                    | Reject     |

**Decision (one-sentence justifications):**

- **Primary: `@serwist/next` (+ `@serwist/turbopack` for the Next 16 build path)** — actively maintained, TS-native, presets cover ~80% of strategies, and the Next.js community treats it as the de-facto successor to next-pwa.
- **Fallback: Workbox 7 direct via a hand-authored `app/sw.ts`** — if Serwist ever lags a Next.js release, Workbox primitives (`registerRoute`, `precacheAndRoute`, `BackgroundSyncPlugin`) are stable and you keep the same mental model.

> Practical Next 16 note: use `@serwist/turbopack` so `next dev`/`next build` stay on Turbopack; only fall back to `--webpack` if you hit an edge case during PWA-feature debugging in dev.

---

## B) Cache strategy matrix (2026)

| Resource                                                           | Strategy                                                                         | TTL / cap                                | Notes                                                                                                  |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| HTML routes `/aluno/today`, `/aluno/programa`                      | **NetworkFirst** (3s timeout) → cache → `/~offline`                              | 24 h, max 32 entries                     | `cacheOnNavigation: true`, navigation preload on                                                       |
| Static JS `/_next/static/*`                                        | **CacheFirst** (immutable, hashed filenames)                                     | 30 days, max 64 entries                  | Safe because Next emits content-hashed names                                                           |
| Static CSS incl. per-tenant `theme.css`                            | **StaleWhileRevalidate**                                                         | 7 days, max 32                           | Tenant theme can change; SWR keeps UI instant                                                          |
| Supabase Storage images `*.supabase.co/storage/v1/object/public/*` | **CacheFirst** with `ExpirationPlugin` + `cacheableResponse: {statuses:[0,200]}` | 30 days, max 200 entries (~30–40 MB cap) | Range/206 responses: do NOT cache (opaque partials blow quota on iOS)                                  |
| Bunny Stream HLS `.m3u8`                                           | **NetworkOnly** (or NetworkFirst 1s, cache 5s)                                   | 5–10 s                                   | Manifest changes for VOD adaptive variants; never cache long                                           |
| Bunny Stream `.ts` / `.m4s` segments                               | **NetworkOnly** in SW; let the browser HTTP cache + Bunny CDN handle it          | —                                        | Cache API handles range/206 poorly; only worth IDB-storing for explicit "download for offline" feature |
| API GET `/api/programs/[id]`                                       | **StaleWhileRevalidate** + mirror to Dexie `program_cache`                       | 1 h, max 50 entries                      | SW returns cached + UI also hydrates from Dexie for true offline                                       |
| API mutations (POST/PATCH/DELETE)                                  | **NetworkOnly** + intercept failure → enqueue to Dexie `*_queue`                 | n/a                                      | Never cache responses to mutations                                                                     |
| Supabase REST `*/rest/v1/*` (reads)                                | **NetworkFirst** (2s)                                                            | 5 min, max 50                            | Auth headers vary per user — keep TTL short                                                            |
| Supabase REST writes / `/auth/v1/*`                                | **NetworkOnly**                                                                  | n/a                                      | Never cache tokens or write responses                                                                  |
| `manifest.webmanifest` + `/icons/*`                                | **CacheFirst**                                                                   | 30 days                                  | Part of precache manifest, content-hashed via build revision                                           |
| `/~offline` fallback page                                          | **Precached**                                                                    | per build                                | Served when navigation+cache both miss                                                                 |

---

## C) IndexedDB library — Decision + schema validation

**Choice: Dexie 4.x.** Reasons: typed `EntityTable<T,'id'>` (no `@types/` needed), `useLiveQuery` hook plays cleanly with React 19 — write-from-SW automatically re-renders components, painless multi-step `db.version(N).stores(...).upgrade(...)` migrations, weekly DLs ~1.3M, active maintenance. `idb` is excellent but every schema change demands hand-written `oldVersion` guards — too easy to corrupt data solo. `idb-keyval` is too thin for relational queues. Hand-rolled = anti-pattern.

**Schema validation vs the 5 use cases:**
| Use case | Covered by | Status |
|---|---|---|
| Workout completion offline | `component_progress_queue` | ✅ |
| Check-in offline | `check_in_queue` | ✅ |
| View cached program | `program_cache` | ✅ |
| View cached check-in history | Current schema **does not cover this** — add `check_in_cache` (or extend `program_cache` payload to hold the last N check-ins) | ⚠️ gap |
| Chatbot / payments (not offline) | Not cached by design — `metadata` holds `last_online_at`/feature flags to gate UI | ✅ |

**Storage quota estimate per student:**

- 1 cached program payload (12-week plan, ~80 components, video metadata only, no media): **80–150 KB JSON**
- ~30 days of queued component_progress events (3–5/day, ~400 B each): **30–60 KB**
- ~30 days of check_ins (1/day, ~300 B): **9 KB**
- Cache API: app shell ~600 KB, route HTML ~150 KB, Supabase Storage images (avatars/thumbs, 30 cached): **~3–5 MB**
- **Per-student total: ~4–6 MB.** Comfortably under the iOS ~50 MB Cache API soft cap and far below the IDB soft quota (Safari 17+ allows up to ~60% of disk per origin; iOS still evicts at ~7 days idle for non-installed sites).

**Migration pattern (no data loss):**

```ts
db.version(1).stores({ program_cache: 'id, snapshot_at' /* ... */ })
db.version(2)
  .stores({ program_cache: 'id, snapshot_at, tenant_id' })
  .upgrade((tx) =>
    tx
      .table('program_cache')
      .toCollection()
      .modify((r) => {
        r.tenant_id = r.payload?.tenant_id ?? 'legacy'
      }),
  )
```

Never drop a store in a version bump — rename/add only; if you must remove, do it two versions later after a backfill.

**Cleanup policy (run on every app open in a `requestIdleCallback`):**

- `program_cache`: delete rows where `last_used_at < now - 30d`; hard cap at 5 most-recent-used rows.
- `*_queue`: delete `status='synced'` rows older than 7d; flag `status='failed'` rows older than 14d as dead-letter (surface in UI).

---

## D) Sync queue — Background Sync + retry

**Background Sync API status (May 2026):**

- ✅ Chromium Android/desktop: full support (`sync` + Periodic Background Sync behind permission).
- ❌ **iOS Safari 18/19/26: still unsupported** (Background Sync, Periodic Background Sync, Background Fetch all not shipped; no roadmap). All iOS browsers are WebKit, so Chrome/Firefox on iOS share the gap.
- ❌ Firefox desktop/Android: behind flag — treat as unsupported.

**Strategy (works everywhere):**

1. SW intercepts mutating requests via Workbox `BackgroundSyncPlugin` (uses native Background Sync where available, otherwise just queues to IDB).
2. **Always** also enqueue to Dexie from the client _before_ the fetch — single source of truth; the SW plugin is a "best-effort" accelerator.
3. **iOS fallback flusher**: on `visibilitychange → visible`, on `online` event, and a `setInterval(flushQueue, 30_000)` while the document is visible. Foreground-only — don't promise true background sync to users.

**Retry policy:** exponential backoff with full jitter, **2s → 4s → 8s → 16s → 32s cap**, max **6 attempts** per item. On final failure: set `status='failed'`, move to dead-letter view; surface "N actions failed — Retry / Discard". Treat 4xx (except 408/429) as terminal (do not retry); retry 5xx, 408, 429 (respect `Retry-After`), and network errors.

**Conflict resolution:**

- **Workout completion (`component_progress`)**: server-wins on identity (idempotency key collides → 200), but timestamp is **client-authoritative** — client sends `completed_at` from the device clock when the user actually tapped, even if synced hours later. Postgres `INSERT ... ON CONFLICT (idempotency_key) DO NOTHING`.
- **Check-in (1 per day per student)**: server-wins on the `(student_id, local_date)` unique constraint. If the queued check-in collides with an existing one, return 200 with the canonical row; client overwrites local with server payload (no merge — check-ins are simple).
- **Never** do client-wins for either — desync risk is too high for a SaaS with auditable training history.

**Idempotency key**: client generates `crypto.randomUUID()` at the moment of the user action (not at flush time) and persists it on the queue row. Sent as `Idempotency-Key` header; server uses it as the upsert key.

**Mutation queue schema (Dexie):**

```ts
interface MutationQueueRow {
  id?: number // ++auto
  idempotency_key: string // uuid v4, indexed unique
  endpoint: string // '/api/component-progress'
  method: 'POST' | 'PATCH' | 'DELETE'
  payload: unknown // JSON
  headers?: Record<string, string>
  status: 'pending' | 'in_flight' | 'synced' | 'failed'
  attempts: number
  last_error?: string
  created_at: number // epoch ms (client clock)
  attempted_at?: number
  synced_at?: number
}
```

---

## E) iOS PWA quirks 2026 (critical)

1. **Add to Home Screen is mandatory for push.** Web Push only fires for PWAs launched from the home screen (iOS 16.4+). Safari tabs get no push. iOS 26 now defaults home-screen-added sites to standalone mode, which helps.
2. **~7-day script-writable storage eviction.** If the user doesn't open the PWA for ~7 days, Safari may clear Cache + IndexedDB. Mitigations: (a) `navigator.storage.persist()` after install (requires notification permission to actually stick), (b) re-prime a small critical-asset cache on every launch, (c) treat Dexie as a cache, not the system of record. EU users: PWA standalone mode flip-flopped in 17.4/17.5; assume it works in 2026 outside the EU.
3. **No Background Sync / Periodic Background Sync / Background Fetch.** Sync only when the app is foregrounded — design UX around it ("Sincronizando N ações…" banner on resume).
4. **Service Worker is paused/killed aggressively in background.** Don't rely on long-running SW timers; nothing executes when the PWA isn't on screen. Push handlers wake the SW briefly, but only after permission and only for installed PWAs.
5. **SW update on iOS often requires double-launch.** First open after update activates the new SW (`waiting`); second launch actually uses it. Workaround: `skipWaiting()` + a "New version available — tap to reload" toast wired to the `controllerchange` event.
6. **Cache API ~50 MB soft limit; IndexedDB up to ~500 MB but unstable.** Safari 17+ raised origin quota to up to ~60% of disk, but only with `persist()` granted. Plan for the small number.
7. **Web Push uses standard VAPID** — no APNs bridge in app code (Safari brokers via APNs server-side; you push to `endpoint` like Chrome). Permission prompt **must** be inside a user gesture; silent / data-only push is **not** supported.
8. **Viewport/input quirks:** use `viewport-fit=cover` + `env(safe-area-inset-bottom)` for the bottom tab bar (home indicator); use `100dvh` (not `100vh`) for full-height layouts; **input `font-size >= 16px`** to prevent the auto-zoom-on-focus jump on textareas and inputs.

---

## F) Update strategy

- **`skipWaiting()` + `clients.claim()` on every install** — combined with a UI prompt (don't reload silently mid-workout). When the new SW reaches `waiting`, post a message to clients; show a vaul bottom-sheet "New version • Reload now / Later". On idle (`visibilitychange → hidden` for 60s) auto-reload if the user dismissed.
- **Cache busting**: Next.js hashes static filenames automatically; for the SW itself, bake a `SW_VERSION = '2026.05.17-abc1234'` constant from the git SHA into `app/sw.ts` (template-literal injection via `withSerwist`'s `additionalPrecacheEntries` revision). On version mismatch, purge non-current Cache Storage buckets in the `activate` event.
- **Avoid forever-stale HTML**: HTML routes use NetworkFirst with 3s timeout, never CacheFirst. Set `reloadOnOnline: false` (Serwist) so reconnect doesn't blow away unsaved form state.

---

## G) Offline UX patterns (1 line each)

- **Persistent offline badge** in the header (small dot + "Sem conexão") whenever `!navigator.onLine`; toast only on the _transition_ online→offline and offline→online ("Voltou! Sincronizando 3 ações…").
- **Placeholder screens** when no cache: render the app shell with a friendly empty state and a "Tentar novamente" CTA — never a white screen.
- **Retry buttons** on each failed-queue row in a dedicated `/aluno/sincronizar` page; plus a bulk "Tentar todos".
- **Optimistic UI for set completion**: write to Dexie + flip the checkbox immediately, then enqueue; on terminal sync failure, rollback the checkbox with a destructive toast.
- **"Sincronizando N ações…" sticky bottom banner** whenever the queue has `pending`/`in_flight` rows; disappears at 0.

---

## H) Install prompt UX

- **Trigger timing**: value-first. Show install prompt **after the student completes their first workout** (clear win moment), OR after **3 sessions across 2+ days** if they haven't finished one yet. Never on first page load.
- **Platform detection**:
  - Android/desktop Chromium: capture `beforeinstallprompt`, stash event, fire `prompt()` from a real click in your custom in-app card.
  - iOS Safari: no event exists. Detect `navigator.userAgent` (iOS + Safari) and `!window.matchMedia('(display-mode: standalone)').matches`; show a vaul bottom-sheet with the literal Share → "Add to Home Screen" steps + screenshot.
  - Suppress entirely if `getInstalledRelatedApps()` returns a match, or if standalone display-mode is already active.
- **Dismiss persistence**: `localStorage['installPromptDismissedAt']` = epoch ms; re-show only after **14 days**, max 3 lifetime shows.
- **Single trigger** to start — A/B timing only after you have ≥1k installs of baseline data.

---

## I) Push notifications opt-in

- **Permission ask is value-first**: never on load. Ask **after first completed workout** with copy like "Quer um lembrete amanhã às 7h?". Request must be inside a user gesture (iOS strictly enforces this).
- **VAPID per tenant**: one VAPID keypair per tenant stored server-side (Supabase `tenants.vapid_public_key`, private in vault). Client fetches the public key for its tenant before `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`. Persist subscription `{endpoint, p256dh, auth}` to `push_subscriptions(student_id, tenant_id, ...)`.
- **SW push handler**: parse JSON payload, `self.registration.showNotification(title, { body, icon, badge, actions, data: { url, action_payload } })`. On `notificationclick`, `clients.openWindow(data.url)` and post a message to any open client.
- **Notification actions**: `[{action:'done', title:'Marcar feito'}, {action:'snooze', title:'Adiar 10 min'}]`. In SW: `done` enqueues a `component_progress` mutation directly; `snooze` schedules a server-side re-push after 10 min (safer than `setTimeout` in a SW that will be killed).
- **Quiet hours**: server-side gating, default 22:00–07:00 student local TZ; store in `student_prefs.quiet_hours`. Never rely on the SW to enforce — it can't be trusted to be alive.
- **iOS push limitations 2026**: PWA-installed-only, no silent/data-only push, no push for EU users when PWA standalone mode is disabled in their iOS build, badge count via Badging API works (16.4+). Safari 18.4 added Declarative Web Push (simpler payload, no SW required) — worth using for tenants that don't need action buttons.

---

## J) Testing offline

- **Playwright**: `await context.setOffline(true)` works for Chromium/Firefox/WebKit in current versions (the old 2020 SW-bypass bug is resolved; for stricter SW network-event testing, set `PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1`). Pattern:
  ```ts
  test('aluno can complete a workout offline', async ({ page, context }) => {
    await page.goto('/aluno/today')
    await page.waitForFunction(() => navigator.serviceWorker.controller)
    await context.setOffline(true)
    await page.getByTestId('set-1-done').click()
    await expect(page.getByTestId('set-1-done')).toBeChecked()
    await context.setOffline(false)
    await expect(page.getByTestId('sync-banner')).toBeHidden({ timeout: 10_000 })
  })
  ```
- **CI**: Playwright + a stubbed Supabase (msw or a seeded test project). Run against `next start` (production build, so the SW is actually generated). Smoke test asserts `navigator.serviceWorker.ready` resolves and 5 critical routes pass an offline reload.
- **Lighthouse CI**: `lhci autorun` with `--collect.settings.preset=desktop` AND a mobile run; assert `categories.performance/accessibility/best-practices/seo >= 0.95`. Note: Lighthouse v12+ no longer exposes a separately _scored_ "PWA" category — it's a checklist of audits. "PWA score 100" today = **every PWA installability + offline-fallback audit passing** AND the other four scored categories ≥ 95.
- **Manual**: Chrome DevTools → Application → Service Workers (Offline + Update-on-reload), Storage (clear site data), Lighthouse panel (PWA + Mobile preset). For iOS, you **must** test on a real device after waiting >7 days, or after `Settings → Safari → Advanced → Website Data → remove`.

---

## K) Anti-patterns to avoid

1. **CacheFirst for HTML routes** → users stuck on yesterday's `/aluno/today`. Always NetworkFirst with a timeout for navigations.
2. **`skipWaiting()` without a reload prompt** → app code and the SW version desync mid-session, causing chunk-load errors when the user navigates.
3. **Caching opaque/206 responses** (range requests, cross-origin Supabase Storage with no CORS) → fills iOS quota with garbage and silently evicts important caches.
4. **Caching Authorization-bearing Supabase REST responses** → user A sees user B's data after re-login on the same device.
5. **Relying on Background Sync alone** → 50%+ of your iOS users get no sync. Always pair with a foreground flusher (`visibilitychange` + `online`).
6. **Storing tokens in IndexedDB / localStorage where Cache could leak them** → keep Supabase auth in cookies (httpOnly where possible); never let the SW intercept Authorization headers.
7. **Dropping a Dexie store in a version bump** → wipes user data on upgrade. Rename forward; remove only after a backfill version.
8. **Using `100vh` and ignoring `safe-area-inset-bottom`** → bottom tab bar hides under the iOS home indicator in standalone mode; chat input gets covered by the keyboard. Use `100dvh` + `env(safe-area-inset-bottom)`.
9. (bonus) **Asking for push permission on page load** → 60–80% denial rate, no recovery; iOS users get permanently blocked.

---

## Snippet — `app/sw.ts` (Serwist core)

```ts
import { defaultCache } from '@serwist/next/worker'
import { Serwist, NetworkFirst, CacheFirst, StaleWhileRevalidate, ExpirationPlugin } from 'serwist'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}
declare const self: ServiceWorkerGlobalScope

const SW_VERSION = '2026.05.17-__GIT_SHA__'

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  fallbacks: {
    entries: [{ url: '/~offline', matcher: ({ request }) => request.destination === 'document' }],
  },
  runtimeCaching: [
    {
      matcher: ({ request }) => request.mode === 'navigate',
      handler: new NetworkFirst({
        cacheName: `html-${SW_VERSION}`,
        networkTimeoutSeconds: 3,
        plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
    },
    {
      matcher: ({ url }) =>
        url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/storage/'),
      handler: new CacheFirst({
        cacheName: 'sb-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 2592000,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/programs/'),
      handler: new StaleWhileRevalidate({ cacheName: 'api-programs' }),
    },
    ...defaultCache,
  ],
})

self.addEventListener('activate', (e) =>
  e.waitUntil(
    (async () => {
      const keep = new Set([`html-${SW_VERSION}`, 'sb-images', 'api-programs'])
      for (const k of await caches.keys())
        if (!keep.has(k) && k.startsWith('html-')) await caches.delete(k)
    })(),
  ),
)

serwist.addEventListeners()
```

## Snippet — Dexie schema (4 tables)

```ts
import Dexie, { type EntityTable } from 'dexie'

export interface ProgramCache {
  id: string
  tenant_id: string
  snapshot_at: number
  last_used_at: number
  payload: unknown
}
export interface ProgressQueue {
  id?: number
  idempotency_key: string
  component_id: string
  payload: unknown
  status: 'pending' | 'in_flight' | 'synced' | 'failed'
  attempts: number
  created_at: number
  attempted_at?: number
  last_error?: string
}
export interface CheckInQueue {
  id?: number
  idempotency_key: string
  payload: { local_date: string; mood?: number }
  status: 'pending' | 'in_flight' | 'synced' | 'failed'
  attempts: number
  created_at: number
  attempted_at?: number
  last_error?: string
}
export interface MetaRow {
  key: string
  value: unknown
}

export const db = new Dexie('AlunoDB') as Dexie & {
  program_cache: EntityTable<ProgramCache, 'id'>
  component_progress_queue: EntityTable<ProgressQueue, 'id'>
  check_in_queue: EntityTable<CheckInQueue, 'id'>
  metadata: EntityTable<MetaRow, 'key'>
}

db.version(1).stores({
  program_cache: 'id, tenant_id, snapshot_at, last_used_at',
  component_progress_queue: '++id, &idempotency_key, status, created_at, component_id',
  check_in_queue: '++id, &idempotency_key, status, created_at',
  metadata: 'key',
})
```

## Snippet — sync queue flusher (client-side)

```ts
const BACKOFF = [2000, 4000, 8000, 16000, 32000, 32000] // ms, capped
const MAX_ATTEMPTS = BACKOFF.length

export async function flushQueue() {
  const rows = await db.component_progress_queue
    .where('status')
    .anyOf('pending', 'failed')
    .and(
      (r) =>
        !r.attempted_at ||
        Date.now() - r.attempted_at >= BACKOFF[Math.min(r.attempts, MAX_ATTEMPTS - 1)],
    )
    .toArray()

  for (const r of rows) {
    await db.component_progress_queue.update(r.id!, {
      status: 'in_flight',
      attempted_at: Date.now(),
    })
    try {
      const res = await fetch('/api/component-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': r.idempotency_key },
        body: JSON.stringify(r.payload),
      })
      if (res.ok || res.status === 409 /* idempotent replay */) {
        await db.component_progress_queue.update(r.id!, { status: 'synced' })
      } else if (res.status >= 400 && res.status < 500 && ![408, 429].includes(res.status)) {
        await db.component_progress_queue.update(r.id!, {
          status: 'failed',
          last_error: `HTTP ${res.status}`,
        })
      } else {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch (err: any) {
      const attempts = r.attempts + 1
      await db.component_progress_queue.update(r.id!, {
        status: attempts >= MAX_ATTEMPTS ? 'failed' : 'pending',
        attempts,
        last_error: String(err?.message ?? err),
      })
    }
  }
}

// Wire up on the client (once, in a root client component):
window.addEventListener('online', flushQueue)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') flushQueue()
})
setInterval(() => {
  if (document.visibilityState === 'visible' && navigator.onLine) flushQueue()
}, 30_000)
```

---

## Hour estimate (solo dev + Claude Code, fitness PWA scope)

| Bucket                                                                                              | Hours                                    |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Serwist setup, `app/sw.ts`, manifest, icons, offline fallback page                                  | 4–6                                      |
| Cache strategy tuning (matrix + ExpirationPlugins + test on iOS)                                    | 3–4                                      |
| Dexie schema + cache hydrators + cleanup job                                                        | 4–5                                      |
| Mutation queue + idempotency + retry/backoff + dead-letter UI                                       | 6–8                                      |
| Online/offline UX (badge, banners, optimistic UI, retry pages)                                      | 4–6                                      |
| Install prompt (Android event + iOS instructional sheet, dismiss persistence)                       | 3–4                                      |
| Push opt-in (VAPID per tenant, subscribe, SW push handler, action buttons, quiet hours server-side) | 6–8                                      |
| Update flow (`skipWaiting` + reload sheet + cache versioning)                                       | 2–3                                      |
| Playwright offline tests + Lighthouse CI in GitHub Actions                                          | 4–6                                      |
| iOS device QA pass (real iPhone, 7-day eviction sim, push, A2HS, safe-area)                         | 3–5                                      |
| Buffer / debugging                                                                                  | 4–6                                      |
| **Total**                                                                                           | **~43–61 hours (≈ 1.5–2 focused weeks)** |

---

## Lighthouse PWA-100 pre-launch checklist

- [ ] HTTPS-only on Vercel; HSTS header set.
- [ ] `manifest.webmanifest` with `name`, `short_name`, `start_url: '/aluno'`, `scope: '/'`, `display: 'standalone'`, `display_override: ['standalone','minimal-ui']`, `background_color`, `theme_color`, `orientation: 'portrait'`, `categories`, `description`, `screenshots` (≥1 mobile + 1 wide for richer Android install dialog).
- [ ] Maskable icon set: 192×192, 512×512, plus 192/512 with `"purpose": "any maskable"`. Apple touch icon 180×180 in `<head>`.
- [ ] `<meta name="theme-color">` + iOS `<meta name="apple-mobile-web-app-capable" content="yes">` + `apple-mobile-web-app-status-bar-style` + `apple-mobile-web-app-title`.
- [ ] Service worker registered, controls the page on first repeat visit, responds to navigation requests offline (Lighthouse audit "Current page responds with 200 when offline" green).
- [ ] Offline fallback `/~offline` renders without network.
- [ ] `viewport` meta with `width=device-width, initial-scale=1, viewport-fit=cover`.
- [ ] Works in WebKit (test in Playwright `webkit` project).
- [ ] No mixed content; CSP set; `X-Content-Type-Options: nosniff`.
- [ ] Tap targets ≥ 48 px, color contrast ≥ 4.5:1.
- [ ] LCP < 2.5 s on mobile cold load (Next.js 16 Turbopack + RSC + Vercel edge), repeat-load LCP < 1 s (proof your cache works).
- [ ] INP < 200 ms (audit Motion 12 animations on low-end Android).
- [ ] No console errors; no deprecated APIs; CLS < 0.1.
- [ ] `getInstalledRelatedApps()` not triggering install card when already installed.
- [ ] iOS real-device manual checklist (Lighthouse cannot audit these): A2HS works from Safari Share menu; standalone launches without browser chrome; push permission prompt fires after first-workout gesture; offline reload works after force-quit; storage survives a 7-day idle simulation.
- [ ] `lhci autorun` in GitHub Actions asserting all four scored categories (Perf, A11y, Best Practices, SEO) ≥ 95 on the mobile preset and every PWA audit passing.

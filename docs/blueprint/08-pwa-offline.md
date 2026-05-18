# 08 — PWA Offline-First

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Serwist + Turbopack + IndexedDB queue + autosave 800ms + visualViewport.
> Causa raiz: aluno fitness abre PWA 3-5×/dia; perder check-in offline = churn imediato.

---

## 1. Service Worker — Serwist (\_CONFLITOS #14)

**Decisão:** `@serwist/next` 9.x + `@serwist/turbopack` 9.5+.

Razões:

- Ativamente mantido, TS-first, drop-in App Router Next 16
- `@serwist/turbopack` (v9.5+) suporta nativo Turbopack default Next 16
- Comunidade trata como sucessor de facto do `next-pwa` (abandonado dez/2022)
- Bundle ~15 KB gz para SW runtime
- `defaultCache` runtime presets cobrem ~80% das estratégias

**Rejeitados:**
| Opção | Razão |
|---|---|
| `next-pwa` (shadowwalker) | Abandonado v5.6.0 dez/2022; Snyk flag Inactive |
| Workbox direto | Re-implementa precache hashing + route handler |
| `public/sw.ts` hand-rolled | Desperdiça Claude cycles em problemas solved |

**Fallback documentado:** se Serwist quebrar em Turbopack durante bootstrap → ADR fallback `next build --webpack`. Não inventar solução nova.

Detalhes: \_CONFLITOS #14 + pesquisa 12 §A.

---

## 2. Cache strategy matrix

| Resource                            | Strategy                                                                     | TTL / cap                        | Notas                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| HTML routes (`/aluno/*`)            | **NetworkFirst** (3s timeout) → cache → `/~offline`                          | 24h, max 32 entries              | `cacheOnNavigation: true`, navigation preload on                      |
| Static JS `/_next/static/*`         | **CacheFirst** (immutable, hashed)                                           | 30 dias, max 64                  | Safe — Next emite content-hashed names                                |
| CSS incl. per-tenant `theme.css`    | **StaleWhileRevalidate**                                                     | 7 dias, max 32                   | Tenant theme muda; SWR mantém UI instant                              |
| Supabase Storage imagens            | **CacheFirst** + `ExpirationPlugin` + `cacheableResponse:{statuses:[0,200]}` | 30 dias, max 200 (~30-40 MB cap) | Range/206 NÃO cachear (opaque partials blow quota iOS)                |
| Bunny Stream `.m3u8`                | **NetworkOnly** (ou NetworkFirst 1s, cache 5s)                               | 5-10s                            | Manifest muda; nunca cache long                                       |
| Bunny Stream `.ts`/`.m4s` segments  | **NetworkOnly**                                                              | —                                | Browser HTTP cache + Bunny CDN cuidam; Cache API não lida bem com 206 |
| API GET `/api/programs/[id]`        | **StaleWhileRevalidate** + mirror em IndexedDB                               | 1h, max 50                       | SW retorna cached + UI hidrata de IDB pra true offline                |
| API mutations (POST/PATCH/DELETE)   | **NetworkOnly** + intercept failure → enqueue IDB                            | n/a                              | Nunca cachear mutation responses                                      |
| Supabase REST `*/rest/v1/*` reads   | **NetworkFirst** (2s)                                                        | 5min, max 50                     | Auth headers vary per user — TTL curto                                |
| Supabase REST writes / `/auth/v1/*` | **NetworkOnly**                                                              | n/a                              | Nunca cachear tokens ou writes                                        |
| `manifest.webmanifest` + `/icons/*` | **CacheFirst**                                                               | 30 dias                          | Part of precache, content-hashed via build revision                   |
| `/~offline` fallback page           | **Precached**                                                                | per build                        | Servido quando navigation + cache miss                                |

Detalhes: \_CONFLITOS #14 + pesquisa 12 §B.

---

## 3. IndexedDB queue — `idb-keyval` (\_CONFLITOS #15)

**Decisão:** `idb-keyval` (~600B gzip) pra mutation queue + program cache simples dia 1.

Razões:

- Minimalista — cobre 1º cliente MVP sem schema complexo
- Decisão fechada em `_CONFLITOS.md #15`
- Resolve caso real: aluno no metrô marca 24 séries em 60min, 8 caem por 4G dropado → IDB queue persiste

**Gatilho pra migrar pra Dexie 4.x [I]:**

- Schema cresce >3 stores
- Precisa `useLiveQuery` pra re-render automático em SW writes
- Multi-step migrations com `db.version(N).upgrade()`

Quando migrar: pesquisa 12 §C tem receita Dexie pronta (typed `EntityTable<T,'id'>` + automatic re-render React 19).

### 3.1 Schema queue dia 1 (idb-keyval)

Chaves usadas:

- `queue:component_progress` — array de `MutationRow`
- `queue:check_in` — array de `MutationRow`
- `cache:program:${id}` — JSON serializado (snapshot + last_used_at)
- `meta:last_online_at` — timestamp
- `meta:install_dismissed_at` — timestamp
- `meta:push_subscribed` — boolean

`MutationRow shape`:

```
{
  idempotency_key: string,    // crypto.randomUUID() no momento do user action
  endpoint: string,
  method: 'POST'|'PATCH'|'DELETE',
  payload: unknown,
  status: 'pending'|'in_flight'|'synced'|'failed',
  attempts: number,
  last_error?: string,
  created_at: number,         // epoch ms (client clock)
  attempted_at?: number,
  synced_at?: number,
}
```

### 3.2 Storage budget estimado

Por aluno:

- 1 cached program (12 semanas, ~80 components, video metadata): **80-150 KB JSON**
- 30 dias queued progress (3-5/day, ~400B each): **30-60 KB**
- 30 dias check-ins (1/day, ~300B): **9 KB**
- Cache API: app shell ~600 KB + route HTML ~150 KB + Supabase Storage thumbs (~30 cached): **~3-5 MB**
- **Total por aluno: ~4-6 MB**

Confortável sob iOS ~50 MB Cache API soft cap. Far below IDB soft quota (Safari 17+ aceita ~60% disk per origin com `persist()` granted).

### 3.3 Cleanup policy (rodar em cada app open via `requestIdleCallback`)

- `queue:*` — delete `status='synced'` >7d; flag `status='failed'` >14d como dead-letter (UI mostra)
- `cache:program:*` — delete entries `last_used_at < now - 30d`; hard cap 5 most-recent-used

---

## 4. Sync queue — Background Sync + foreground flusher

### 4.1 Background Sync API status (mai/2026)

| Plataforma                  | Status                                                                      |
| --------------------------- | --------------------------------------------------------------------------- |
| Chromium Android/desktop    | ✅ full support                                                             |
| **iOS Safari 18/19/26 PWA** | ❌ **não suportado** (Background Sync, Periodic, Background Fetch — nenhum) |
| Firefox desktop/Android     | ❌ atrás de flag                                                            |

### 4.2 Estratégia (funciona em todos)

1. SW intercepta mutating requests via Workbox `BackgroundSyncPlugin` (usa Background Sync nativo onde disponível, caso contrário só queue IDB)
2. **Sempre** também enqueue em IDB do client **antes** do fetch — single source of truth; SW plugin é "best-effort" accelerator
3. **iOS fallback flusher** (foreground only):
   - `online` event listener
   - `visibilitychange → visible` listener
   - `setInterval(flushQueue, 30_000)` enquanto document visible

**Honesto pro usuário:** não promete background sync em iOS — banner "Sincronizando N ações…" no resume.

### 4.3 Retry policy

- Exponential backoff com full jitter: **2s → 4s → 8s → 16s → 32s cap**
- Max **6 attempts** por item
- 4xx (exceto 408/429) = terminal (não retry)
- 5xx, 408, 429 (respeitar `Retry-After`), network error = retry
- Final failure: `status='failed'`, move pra dead-letter view ("N ações falharam — Retry / Discard")

### 4.4 Conflict resolution

| Caso                              | Estratégia                                                                                                                               | Razão                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `component_progress`              | Server-wins on identity (idempotency_key colide → 200); timestamp **client-authoritative** (`completed_at` do device quando aluno tapou) | Postgres `INSERT ... ON CONFLICT (idempotency_key) DO NOTHING` |
| `check_in` (1 por dia per client) | Server-wins on `(client_id, local_date)` UNIQUE; colide → 200 com canonical row; client overwrite local                                  | Sem merge — check-ins são simples                              |

**Nunca** client-wins pra esses casos — desync risk alto pra SaaS com auditable training history.

**Idempotency key:** `crypto.randomUUID()` gerado no momento do user action (NÃO flush time). Persistido na queue row. Enviado como `Idempotency-Key` header; server usa como upsert key.

---

## 5. iOS PWA quirks 2026 (críticos)

1. **A2HS mandatório pra push.** Web Push só dispara pra PWAs launched from home screen (iOS 16.4+). Safari tabs = 0 push. iOS 26 default home-screen-added como standalone (ajuda).

2. **~7-day script-writable storage eviction.** Se aluno não abrir PWA por ~7d, Safari pode limpar Cache + IndexedDB. Mitigações:
   - `navigator.storage.persist()` após install (requer notification permission pra stick)
   - Re-prime small critical-asset cache em cada launch
   - Trate IDB como cache, não system of record

3. **Sem Background Sync / Periodic / Background Fetch.** Só sync foreground.

4. **SW pausado/killed agressivamente em background.** Não confie em timers SW; nada executa quando PWA não está on-screen.

5. **SW update iOS frequentemente exige double-launch.** Primeira open após update ativa novo SW (`waiting`); segunda launch usa. Workaround: `skipWaiting()` + toast "Nova versão — toque pra recarregar" via `controllerchange` event.

6. **Cache API ~50 MB soft limit; IDB até ~500 MB unstable.** Safari 17+ raised origin quota ~60% disk com `persist()`. Plan pra small number.

7. **Web Push standard VAPID** — sem APNs bridge no app code (Safari brokers via APNs server-side; you push to `endpoint` como Chrome). Permission prompt deve ser user gesture. **Silent / data-only push NÃO suportado.**

8. **Viewport / input quirks:**
   - `viewport-fit=cover` + `env(safe-area-inset-bottom)` pra bottom tab bar
   - `100dvh` (não `100vh`) pra full-height layouts
   - **`input font-size ≥ 16px`** pra prevenir auto-zoom-on-focus

Detalhes: \_CONFLITOS #14 + pesquisa 12 §E.

---

## 6. visualViewport hook (`use-keyboard-inset`)

iOS Safari **não** suporta `navigator.virtualKeyboard` (só Chromium 94+). iOS reduz visual viewport mas layout viewport fica igual — elementos `position: fixed; bottom: 0` ficam atrás do teclado.

**API correta iOS:** `window.visualViewport` com listeners `resize` + `scroll`.

`lib/hooks/use-keyboard-inset.ts`:

- Retorna `inset` = pixels do layout viewport ocultos pelo teclado
- Usa `requestAnimationFrame` pra throttle
- Aplica como `style={{ paddingBottom: inset }}` no container de toolbar/save button
- vaul já tem `repositionInputs={true}` (default) que faz isso interno — confirmar habilitado

Detalhes: pesquisa 15 §4 (Bramus VisualViewport pattern).

---

## 7. Autosave debounced 800ms

Padrão pra forms do editor (workout, programa, branding, landing):

- Debounce 800ms de inatividade → Supabase save via Server Action
- Indicador discreto canto inferior direito "Salvo 2s ago" / "Salvando…" / "Erro — Retry"
- Persistência local via `pagehide` + `visibilitychange` (NÃO `beforeunload` — iOS ignora)
- Em falha de rede → queue IDB → retransmite em reconexão

`useAutoPersist<T>(key, value)` hook:

- Salva em IDB chave `autosave:${key}` no `pagehide` + `visibilitychange → hidden`
- Restaura ao mount se houver versão local mais nova que server

Combinação:

- **Critical mutations** (workout completion, check-in submission) → IDB queue + retransmite
- **Form drafts** (editor texto, programa em construção) → autosave 800ms + IDB backup

---

## 8. 5 abas PWA aluno (D-G29 + 00-PROJETO §6)

Bottom-nav fixa de 5 itens. Não admite hamburger nem 4/6 tabs. Escolhido pela necessidade do desafit (proposta comercial), não cópia de outro app.

| Tab          | Conteúdo                                                                                                    | Por quê                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Início**   | Hoje + streak + próximo evento agendado                                                                     | Engajamento diário, primeira tela após login                                                                    |
| **Programa** | Estrutura completa: módulos, componentes destravados/bloqueados, navegação dia a dia                        | Aluno entende onde tá no programa                                                                               |
| **Agenda**   | Calendário com tudo agendado: live, call individual, encontro presencial, deadline tarefa, check-in semanal | Acomoda formatos presencial/híbrido naturalmente; sem ela, eventos ficam escondidos                             |
| **Chatbot**  | Chatbot nutricional IA (Pacote C) + dúvidas sobre programa via IA                                           | Schema dia 1; UI ativa conforme tier; tab presente mesmo em Pacote A/B mostrando estado bloqueado + upgrade CTA |
| **Perfil**   | Settings, pagamento, **progresso** (peso, fotos antes/depois, métricas, gamificação), suporte, sair         | Progresso fica no Perfil pra liberar slot pra Chatbot — métricas são "info pessoal" mais que ação diária        |

**Sem chat 1:1 com profissional (D-G37):** comunicação prof→aluno é one-way assíncrona via push + email. Top-bar PWA tem só logo do tenant + avatar do aluno (sem ícone chat). Notificações sistema ("componente X destravado", "live em 1h") via toast/sonner + badge no avatar (histórico in-app opcional fase 2).

**Comunidade/grupos (cohort):** quando cliente cohort confirmar, vira aba contextual DENTRO de "Programa" (só aparece se `program.cohort_type='live'`). Não tab fixa.

**Implementação tab bar:** ver blueprint/05-design-system.md §11 item 8 (layoutId Motion indicator + safe-area-inset-bottom).

---

## 9. Push notifications opt-in

### 9.1 Permission ask — value-first

- **Nunca** on load. Ask após **1ª workout completed** com copy "Quer um lembrete amanhã às 7h?"
- Request DEVE ser dentro de user gesture (iOS estrita)
- Frequency cap: 1 push/dia útil, max 2 em casos especiais
- Quiet hours 22h-7h client local TZ (server-side gating)

### 9.2 VAPID per tenant (\_CONFLITOS #4)

- 1 par VAPID (P-256) **por tenant** stored em `public.tenants.vapid_*` (encrypted via pgcrypto)
- Razões (RFC 8292):
  - Key identifica server
  - Comprometimento de 1 tenant não vaza outros
  - Tenant pode "portar" subscriptions se migrar plataforma (anti lock-in)
  - Custo $0 (par P-256 = 2 strings 88 chars)
- Cliente fetch public key pra tenant antes de `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`
- Persist subscription `{endpoint, p256dh, auth}` em `public.push_subscriptions(client_id, tenant_id, ...)`

**Cuidado:** rotacionar VAPID invalida TODAS subscriptions desse tenant (alunos perdem push até reaceitar). Rotação só quando absolutamente necessário.

### 9.3 SW push handler

- Parse JSON payload
- `self.registration.showNotification(title, { body, icon, badge, actions, data: { url, action_payload } })`
- `notificationclick` → `clients.openWindow(data.url)` + post message pra clients abertos

### 9.4 Notification actions

`[{action:'done', title:'Marcar feito'}, {action:'snooze', title:'Adiar 10 min'}]`:

- `done` enqueue mutation `component_progress` direto via IDB
- `snooze` agenda server-side re-push após 10min (mais seguro que `setTimeout` em SW que pode ser killed)

### 9.5 5 templates dia 1 (master plan §10.13)

1. "Bom dia 💪 Seu treino de [grupo] está pronto. Vamos?" — Cron 7h tz aluno
2. "[Prof] te mandou uma mensagem: «[preview 60c]…»" — Mensagem nova
3. "3 dias sem treinar. Bora retomar leve hoje?" — Inatividade 3d
4. "🔥 Sequência de 7 dias! Não quebre hoje." — Streak milestone
5. "Check-in de domingo: como foi a semana?" — Cron dom 19h

### 9.6 iOS limitações 2026

- PWA-installed-only, sem silent/data-only push
- Sem push pra EU users quando PWA standalone disabled (iOS DMA flip-flop)
- Badge count via Badging API works (16.4+)
- Safari 18.4 added Declarative Web Push (simpler payload, sem SW required) — usar pra tenants que não precisam de actions

---

## 10. Install prompt UX

### 10.1 Trigger timing — value-first

- Após **1ª workout completed** (clear win moment), OU
- Após **3 sessions across 2+ days** se não completou ainda
- **Nunca** no first page load

### 10.2 Platform detection

- **Android/desktop Chromium:** capture `beforeinstallprompt`, stash event, fire `prompt()` em real click no custom in-app card
- **iOS Safari:** sem event. Detect `navigator.userAgent` (iOS + Safari) + `!window.matchMedia('(display-mode: standalone)').matches` → bottom-sheet vaul com Share → "Add to Home Screen" steps + screenshot
- Suprimir entirely se `getInstalledRelatedApps()` retorna match OU standalone display-mode já active

### 10.3 Dismiss persistence

- `idb-keyval` `meta:install_dismissed_at` = epoch ms
- Re-show only após **14 dias**
- Max 3 lifetime shows

### 10.4 UX visual

Custom bottom-sheet vaul com:

- Trigger: 2ª sessão + 1ª ação significativa (master plan §10.12 — mais conservador)
- Copy iOS: ilustração do Share → Add to Home Screen
- Copy Android: 1 botão `Instalar` (primary)
- Botão "Agora não" (ghost) registra dismiss

---

## 11. Update flow

- **`skipWaiting()` + `clients.claim()` em todo install** combinado com UI prompt (não reload silent mid-workout)
- Quando novo SW reach `waiting`, post message pra clients → vaul bottom-sheet "Nova versão • Recarregar / Depois"
- Em idle (`visibilitychange → hidden` por 60s) auto-reload se usuário dismissed
- **Cache busting:** Next.js hashes static filenames automatic; SW próprio bake `SW_VERSION = '2026.05.17-abc1234'` constant via git SHA template-literal injection no `withSerwist additionalPrecacheEntries revision`
- Em `activate` event: purge non-current Cache Storage buckets (`caches.delete(key)` se `!keep.has(key)`)

**Evitar forever-stale HTML:** HTML routes usam NetworkFirst com 3s timeout, NUNCA CacheFirst. `reloadOnOnline: false` (Serwist) — reconnect não blow away unsaved form state.

---

## 12. Offline UX patterns

- **Persistent offline badge** no header (small dot + "Sem conexão") sempre que `!navigator.onLine`
- Toast só na **transição** online→offline e offline→online ("Voltou! Sincronizando 3 ações…")
- **Placeholder screens** quando no cache: app shell + empty state + "Tentar novamente" CTA — nunca white screen
- **Retry buttons** em cada failed-queue row em `/aluno/sincronizar` page; "Tentar todos" bulk
- **Optimistic UI** pra set completion: write IDB + flip checkbox imediato → enqueue; em terminal failure → rollback + destructive toast
- **"Sincronizando N ações…" sticky bottom banner** quando queue tem `pending`/`in_flight` rows; desaparece em 0

---

## 13. Testing offline

### 13.1 Playwright

`await context.setOffline(true)` works Chromium/Firefox/WebKit em versions atuais. Pattern:

```
test('aluno can complete a workout offline', async ({ page, context }) => {
  await page.goto('/aluno/today');
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.getByTestId('set-1-done').click();
  await expect(page.getByTestId('set-1-done')).toBeChecked();
  await context.setOffline(false);
  await expect(page.getByTestId('sync-banner')).toBeHidden({ timeout: 10_000 });
});
```

### 13.2 CI

Playwright + stubbed Supabase (msw ou seeded test project). Run contra `next start` (production build, SW actually generated). Smoke test asserta `navigator.serviceWorker.ready` resolves + 5 critical routes pass offline reload.

### 13.3 Lighthouse CI

`lhci autorun` com `--collect.settings.preset=desktop` AND mobile run; assert categories perf/a11y/best-practices/seo ≥ 0.95.

Lighthouse v12+ não expõe scored "PWA" category separada — checklist de audits. **"PWA score 100" hoje = todos PWA installability + offline-fallback audits passando** AND outras 4 scored categories ≥ 95.

### 13.4 Manual

Chrome DevTools → Application → Service Workers (Offline + Update-on-reload), Storage (clear site data), Lighthouse panel (PWA + Mobile preset).

Pra iOS: **deve** testar em real device após esperar >7 dias, ou após Settings → Safari → Advanced → Website Data → remove.

---

## 14. Anti-patterns proibidos

1. **CacheFirst pra HTML routes** → usuários travados em yesterday's content. SEMPRE NetworkFirst com timeout pra navigations
2. **`skipWaiting()` sem reload prompt** → app code e SW version desync mid-session → chunk-load errors quando usuário navega
3. **Caching opaque/206 responses** (range requests, cross-origin Supabase Storage sem CORS) → fills iOS quota com garbage e evicta caches importantes
4. **Caching Authorization-bearing Supabase REST responses** → user A vê dados de user B após re-login no mesmo device
5. **Confiar em Background Sync sozinho** → 50%+ iOS users sem sync. Sempre pair com foreground flusher
6. **Tokens em IDB/localStorage** onde Cache pode vazar → mantenha Supabase auth em cookies (httpOnly onde possível); nunca SW intercepta Authorization headers
7. **Dropping Dexie store em version bump** → wipes user data on upgrade. Rename forward; remove only após backfill version
8. **`100vh` ignorando `safe-area-inset-bottom`** → bottom tab bar esconde sob iOS home indicator standalone; chat input fica coberto por keyboard. Use `100dvh` + `env(safe-area-inset-bottom)`
9. **Asking push permission on page load** → 60-80% denial rate, sem recovery; iOS users blocked permanente
10. **Cache strategy stale-while-revalidate sem TTL** → memory leak; sempre `ExpirationPlugin` com `maxEntries` + `maxAgeSeconds`
11. **Persist via `beforeunload`** em iOS → ignored. Use `pagehide` + `visibilitychange`
12. **Skeleton + spinner mesma view** → escolher 1; usuário fica confuso

---

## 15. Lighthouse PWA-100 pre-launch checklist

- [ ] HTTPS-only on Vercel; HSTS header set
- [ ] `manifest.webmanifest` com `name`, `short_name`, `start_url: '/aluno'`, `scope: '/'`, `display: 'standalone'`, `display_override: ['standalone','minimal-ui']`, `background_color`, `theme_color`, `orientation: 'portrait'`, `categories`, `description`, `screenshots` (≥1 mobile + 1 wide)
- [ ] Maskable icon set: 192×192, 512×512, plus 192/512 com `"purpose": "any maskable"`. Apple touch icon 180×180 em `<head>`
- [ ] `<meta name="theme-color">` + iOS `<meta name="apple-mobile-web-app-capable" content="yes">` + `apple-mobile-web-app-status-bar-style` + `apple-mobile-web-app-title`
- [ ] SW registrado, controla page em first repeat visit, responds 200 offline (Lighthouse audit "Current page responds with 200 when offline" green)
- [ ] Offline fallback `/~offline` renders sem network
- [ ] `viewport` meta com `width=device-width, initial-scale=1, viewport-fit=cover`
- [ ] Works em WebKit (test em Playwright `webkit` project)
- [ ] Sem mixed content; CSP set; `X-Content-Type-Options: nosniff`
- [ ] Tap targets ≥ 48px, color contrast ≥ 4.5:1
- [ ] LCP < 2.5s mobile cold load (Next 16 Turbopack + RSC + Vercel edge), repeat-load LCP < 1s (prova cache works)
- [ ] INP < 200ms (audit Motion 12 animations em low-end Android)
- [ ] Sem console errors; sem deprecated APIs; CLS < 0.1
- [ ] `getInstalledRelatedApps()` não trigga install card quando já instalado
- [ ] iOS real-device manual checklist (Lighthouse não audita): A2HS works from Safari Share menu; standalone launches sem browser chrome; push permission prompt fires após first-workout gesture; offline reload works após force-quit; storage survives 7-day idle simulation
- [ ] `lhci autorun` em GHA assertando 4 scored categories ≥ 95 mobile preset + every PWA audit passing

---

## Referências

- `00-PROJETO.md` §6 (5 tabs) · §7 (mobile-first 100%) · §8 (comunicação push+email)
- `_CONFLITOS.md` #14 (Serwist + Turbopack + fallback) · #15 (IDB queue + autosave + pagehide)
- `05-design-system.md` §11 (tab bar layoutId)
- `06-data-model.md` §4.2 (push_messages JIT) · §6 (RLS)
- `07-ai-prompts.md` §10 (budget chatbot)
- Master plan §10 (PWA setup completo) · §10.12 (install prompt UX) · §10.13 (push opt-in + 5 templates)
- Pesquisa 12 (PWA offline-first completa — Serwist, cache matrix, Dexie/idb-keyval, sync, iOS quirks, anti-patterns)
- Pesquisa 15 §3-§4 (touch interactions + visualViewport hook + autosave)

## Histórico

| Data       | Mudança                                                                                          | Aprovador |
| ---------- | ------------------------------------------------------------------------------------------------ | --------- |
| 2026-05-17 | Versão inicial — Serwist+Turbopack + idb-keyval queue + foreground flusher + 5 tabs + iOS quirks | Leandro   |

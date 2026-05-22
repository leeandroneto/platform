# 43 — Stack Comparative Analysis (vs Novel, Tiptap, Vercel SaaS, Vercel Platforms, AI Chatbot, next-forge, shadcn, TweakCN)

> **Tipo:** research autoritativa (lente "alguém já fez melhor?")
> **Data:** 2026-05-21
> **Companion:** `docs/architecture/01-master-system-map.md` (mapa interno)
> **Objetivo:** validar stack atual vs alternativas de mercado proven +
> identificar combinações pre-built que possamos clonar ao invés de inventar.
> **Repos auditados (read-only clones em `C:\Users\leean\Desktop\`):**
>
> | Repo                                                                       | Path                    | Commit/depth | Licença    |
> | -------------------------------------------------------------------------- | ----------------------- | ------------ | ---------- |
> | [TweakCN](https://github.com/jnsahaj/tweakcn) (pre-existente)              | `tweakcn-ref/`          | `9adabcf9`   | Apache-2.0 |
> | [Novel](https://github.com/steven-tey/novel)                               | `novel-ref/`            | depth=1      | Apache-2.0 |
> | [Tiptap](https://github.com/ueberdosis/tiptap)                             | `tiptap-ref/`           | depth=1      | MIT        |
> | [Vercel Next.js SaaS Starter](https://github.com/nextjs/saas-starter)      | `vercel-saas-ref/`      | depth=1      | MIT        |
> | [Vercel Platforms](https://github.com/vercel/platforms)                    | `vercel-platforms-ref/` | depth=1      | Apache-2.0 |
> | [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot)                  | `ai-chatbot-ref/`       | depth=1      | MIT        |
> | [next-forge](https://github.com/haydenbleasel/next-forge) (Vercel oficial) | `next-forge-ref/`       | depth=1      | MIT        |
> | [shadcn-ui](https://github.com/shadcn-ui/ui)                               | `shadcn-ref/`           | depth=1      | MIT        |
>
> **Repos pulados:**
>
> - `makerkit/next-supabase-saas-kit` — repo privado/inexistente, paid product
> - Supastarter — paid product (lite não open-source)
> - bolt.new / Lovable / v0 — produtos SaaS, não clones

---

## Sumário executivo (TL;DR — 5 findings críticos)

1. **Vercel Platforms (oficial Vercel) é o template canônico que adaptamos sem perceber.** Stack idêntico à nossa intuição: `proxy.ts`/`middleware.ts` extrai subdomínio do host, resolve via `getSubdomainData()` (Redis/Upstash no exemplo), retorna `NextResponse.rewrite()`. Single deploy, N tenants. **Diferença nossa:** resolver via Postgres `brands` + `domains` em vez de Redis (justificado por RLS multi-tenant). Não está perdendo — está adotando o pattern padrão.

2. **Novel é apenas um wrapper fino sobre Tiptap (~22 arquivos em `packages/headless/src/`).** Adicionando: AI slash-commands, JOTAI atoms, image-resize plugin, suggestion popover. Sem isso, integrar Tiptap direto custa 2-4 dias de glue code. **Recomendação cravada (ADR-0045 D.4) já está correta** — adopt Novel as stack now, install JIT.

3. **next-forge (Vercel oficial Turborepo SaaS) usa Prisma + Clerk + Stripe — NÃO Supabase.** O monorepo separa em 20+ packages (`@repo/ai`, `@repo/auth`, `@repo/payments`, `@repo/design-system`, `@repo/collaboration` via Liveblocks, `@repo/cms` via BaseHub, `@repo/notifications` via Knock). **Valor pra nós:** copy do _layout em packages_ mesmo sem Turborepo (próximo passo Fase 8+) — mas Clerk/Prisma/Neon não cabem (Supabase escolhido por RLS + Auth + Storage + Edge nativo). Stack diferente, **não trocar**.

4. **Vercel AI Chatbot v3.1 já implementa o "Artifacts" pattern via DB + Drizzle.** Schema `document` + `suggestion` permite gerar/editar conteúdo via tool calls com versioning automático. Para nosso Page Engine + AI composer (Fase 7 pivot), o pattern `Document(id, createdAt PK)` + `Suggestion(documentId, suggestedText, isResolved)` é **literalmente o que precisamos pra incremental edits via EASE/JSON Patch** (ADR-0045 D.5). **Reuso direto:** copy o schema "artifacts" pattern pra `page_versions`/`page_drafts`.

5. **shadcn registry hosting (ADR-0045 D.10) é trivial.** `app/r/[name]/route.ts` + validate via `registryItemSchema.safeParse()` + CORS aberto = 60-70 LOC. TweakCN faz exatamente isso em `app/r/themes/[id]/route.ts`. Não precisa adapter, não precisa lib custom. **Sem custo arquitetural** — pode entrar Fase 7 pivot junto com primeiro L2 block.

---

## Parte 1 — Audit de repos de referência

### 1.1 Matriz "feature × repo"

| Feature                     | nosso projeto                               | tweakcn-ref                          | novel-ref          | tiptap-ref         | vercel-saas-ref     | vercel-platforms-ref | ai-chatbot-ref              | next-forge-ref                   | shadcn-ref           |
| --------------------------- | ------------------------------------------- | ------------------------------------ | ------------------ | ------------------ | ------------------- | -------------------- | --------------------------- | -------------------------------- | -------------------- |
| Framework                   | Next 16                                     | Next 15.4                            | Next 14            | n/a (lib)          | Next 15 canary      | Next 15+             | Next 16.2                   | Next + Turborepo                 | Next 15              |
| React                       | 19.2                                        | 19                                   | 18                 | n/a                | 19.1                | 19                   | 19                          | 19.2                             | 19                   |
| Tailwind                    | v4                                          | v4                                   | v3                 | n/a                | v4                  | v4                   | v4                          | v4                               | v4                   |
| Theming pattern             | TweakCN-way + next-themes 0.4.6             | TweakCN-way (org)                    | basic CSS          | n/a                | basic CSS           | basic CSS            | next-themes 0.3             | next-themes via design-system    | shadcn @ui registry  |
| Multi-tenant strategy       | hostname → Postgres (`brands`/`domains`)    | n/a single-tenant                    | n/a single         | n/a                | n/a single          | hostname → Redis     | n/a single                  | n/a single                       | n/a                  |
| DB                          | Supabase Postgres                           | Neon Postgres                        | Vercel Blob (KV)   | n/a                | Postgres direto     | Upstash Redis        | Postgres (Neon)             | Neon + Prisma                    | n/a                  |
| ORM                         | `@supabase/ssr` client direto               | Drizzle                              | n/a                | n/a                | Drizzle             | n/a                  | Drizzle                     | Prisma                           | n/a                  |
| Auth                        | Supabase Auth + RLS                         | better-auth                          | n/a                | n/a                | bcryptjs + jose JWT | n/a                  | next-auth 5 beta            | Clerk                            | n/a                  |
| Billing                     | EFI Bank + Asaas/Stripe externo             | Polar.sh                             | n/a                | n/a                | Stripe direto       | n/a                  | n/a                         | Stripe via @repo/payments        | n/a                  |
| AI provider                 | Vercel AI Gateway + Anthropic               | AI SDK 5 + Gemini                    | OpenAI direct (v0) | n/a                | n/a                 | n/a                  | AI SDK 6 + Gateway          | re-export `ai`                   | n/a                  |
| AI orchestration            | hybrid (generateObject + tool calling)      | streamText+tools                     | streamText basic   | n/a                | n/a                 | n/a                  | streamText + Artifacts      | re-export only                   | n/a                  |
| Prose editor                | Novel (planned JIT — ADR-0045)              | n/a                                  | sim — Tiptap-based | sim core           | n/a                 | n/a                  | ProseMirror direto (custom) | n/a                              | n/a                  |
| Page builder / block system | Page Engine (planned Fase 7)                | n/a                                  | n/a                | n/a                | n/a                 | n/a                  | "Artifacts" pattern         | n/a                              | registry blocks only |
| Form system                 | Form Engine (planned) + RHF 7 + Zod 4       | RHF + Zod (limited)                  | n/a                | n/a                | RHF + Zod           | n/a                  | n/a                         | n/a                              | n/a                  |
| Registry (shadcn)           | planned `/api/r/[name]` (ADR-0045 D.10)     | sim `/r/themes/[id]` + `/r/v0/[id]`  | n/a                | n/a                | n/a                 | n/a                  | n/a                         | re-publica `@repo/design-system` | publica `@shadcn`    |
| PWA                         | Serwist + `@serwist/turbopack` + idb-keyval | n/a                                  | n/a                | n/a                | n/a                 | n/a                  | n/a                         | n/a                              | n/a                  |
| i18n                        | next-intl 4 + ICU MessageFormat             | n/a                                  | n/a                | n/a                | n/a                 | n/a                  | n/a                         | `@repo/internationalization`     | n/a                  |
| Email                       | Resend + react-email                        | Resend (basic)                       | n/a                | n/a                | n/a                 | n/a                  | n/a                         | `@repo/email` Resend+react-email | n/a                  |
| Rate limit                  | Upstash (planned)                           | `@upstash/ratelimit + kv`            | n/a                | n/a                | n/a                 | n/a                  | `lib/ratelimit.ts`          | `@repo/rate-limit` Upstash       | n/a                  |
| Real-time collab            | LWW + ETag/409 (ADR-0045 open)              | n/a                                  | n/a                | y-tiptap available | n/a                 | n/a                  | resumable-stream            | `@repo/collaboration` Liveblocks | n/a                  |
| Observability               | Sentry + PostHog                            | PostHog + Sentry                     | n/a                | n/a                | n/a                 | n/a                  | OpenTelemetry               | `@repo/observability` Sentry     | n/a                  |
| Storage                     | Supabase Storage + Bunny Stream             | n/a                                  | Vercel Blob        | n/a                | n/a                 | n/a                  | Vercel Blob                 | re-export `@vercel/blob`         | n/a                  |
| Feature flags               | entitlements RPC (ADR-0039)                 | subscription gate                    | n/a                | n/a                | n/a                 | n/a                  | entitlements.ts             | `@repo/feature-flags`            | n/a                  |
| Validation/Forms            | Zod 4 + RHF 7                               | Zod 3                                | n/a                | n/a                | Zod 3               | n/a                  | Zod 3                       | Zod 4                            | Zod 3                |
| Lint/Style                  | ESLint 9 + Sheriff + better-tailwindcss     | (não verificado)                     | Biome              | n/a                | n/a                 | n/a                  | Biome + ultracite           | Biome + ultracite                | n/a                  |
| Cor format                  | OKLCH primary + culori                      | OKLCH default + HEX presets + culori | n/a                | n/a                | n/a                 | n/a                  | n/a                         | n/a                              | OKLCH default        |
| Accessibility               | APCA Silver dual-gate + jsx-a11y            | WCAG ratio only                      | basic              | n/a                | n/a                 | n/a                  | n/a                         | jsx-a11y                         | n/a                  |
| Server-side org/team        | tenants/memberships (RLS)                   | n/a                                  | n/a                | n/a                | teams/teamMembers   | subdomains only      | n/a                         | (Clerk handles)                  | n/a                  |
| MCP integration             | shadcn `@latest mcp` + tweakcn registry     | n/a                                  | n/a                | n/a                | n/a                 | n/a                  | n/a                         | n/a                              | shadcn registry MCP  |

### 1.2 Deep-dive — Novel

**Estrutura (`packages/headless/src/`):** ~22 arquivos.

| Pasta         | Conteúdo                                                  | LOC aprox |
| ------------- | --------------------------------------------------------- | --------- |
| `components/` | EditorRoot, EditorContent, EditorBubble, EditorCommand    | ~400      |
| `extensions/` | ai-highlight, slash-command, twitter, image-resizer, math | ~600      |
| `plugins/`    | upload-images (drop + paste + storage hook)               | ~200      |
| `utils/`      | atoms (jotai), store, url helpers                         | ~150      |
| `index.ts`    | exports surface                                           | ~70       |

**Conclusão:** Novel é ~1.500 LOC de glue code sobre Tiptap. Sem ele, integrar Tiptap pra ter "/" slash-command + AI inline + image upload custa 2-4 dias.

**Tech stack Novel:**

- Tiptap 3.x core + StarterKit + custom extensions
- Vercel AI SDK (OpenAI direct, não Gateway no exemplo)
- Vercel Blob para upload de imagens
- `cal-sans` font (custom)
- Tailwind v3 (não v4 ainda)

**Trade-off pra nosso projeto:**

- ✅ Bundle pesado, mas confinado a rotas admin/profissional (ADR-0045 D.4)
- ✅ SSR via `@tiptap/static-renderer` (RSC-compatible) viável
- ⚠️ Tailwind v3 vs nosso v4 — extensions custom podem precisar ajuste classes
- ⚠️ AI provider hard-coded OpenAI — substituir por Vercel AI Gateway + Anthropic Haiku 4.5 (ADR-0045 D.6)
- ⚠️ Jotai atoms `queryAtom`/`rangeAtom` — convive com nosso React Context ou substituir por `useState`? PoC necessário (ADR-0045 open question §H.10).

### 1.3 Deep-dive — Vercel Platforms

**Pattern essencial (`middleware.ts` 60 LOC):**

```ts
function extractSubdomain(request: NextRequest): string | null {
  const hostname = request.headers.get('host')?.split(':')[0] || ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN // "platforms.app"
  // ... dev fallback localhost ...
  // Production: hostname.endsWith(`.${rootDomain}`) ? hostname.replace(...) : null
}

export async function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request)
  if (subdomain) {
    if (pathname.startsWith('/admin')) return NextResponse.redirect('/')
    if (pathname === '/') return NextResponse.rewrite(`/s/${subdomain}`)
  }
  return NextResponse.next()
}
```

**Resolver (`lib/subdomains.ts` 60 LOC):**

```ts
export async function getSubdomainData(subdomain: string) {
  const sanitized = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
  return await redis.get<SubdomainData>(`subdomain:${sanitized}`)
}
```

**Comparação com nosso `lib/route/getRouteByHost.ts`:**

- Vercel: rewrite via `/s/[subdomain]` dynamic route segment.
- Nosso: Context Provider injetado em React tree via `use(themePromise)` RSC.
- Vercel: Redis lookup (Upstash). Nosso: Postgres `brands` JOIN `domains`.
- Vercel: subdomain único, nome reservado em blocklist client-side.
- Nosso: hostname full match (custom domains aceitos via `domains.kind='custom'` + Cloudflare for SaaS).

**Veredito:** nossa implementação é estritamente mais rica (RLS, custom domains, multi-domain per tenant). Vercel Platforms é minimum viable pattern; nós estendemos certo.

### 1.4 Deep-dive — Vercel AI Chatbot v3.1

**Schema (`lib/db/schema.ts`):**

```
User → Chat → Message_v2 (parts json, attachments json)
                  ↓
              Vote_v2 (chatId+messageId composite PK)

User → Document (id+createdAt composite PK)  ← Artifacts pattern
              ↓
          Suggestion (documentId, suggestedText, isResolved)
```

**Pattern crítico:** `Document(id, createdAt)` composite PK = **versioning automático sem trigger**. Cada edit gera nova row com mesmo `id`, novo `createdAt`. Histórico completo grátis.

**Tech stack:**

- AI SDK 6.0.116 + `gateway.languageModel(modelId)` (Vercel AI Gateway)
- Modelos: DeepSeek V3.2, Kimi K2.5, GPT OSS 20B/120B, Grok 4.1
- Next 16.2, React 19, Tailwind v4, Drizzle ORM
- next-auth 5 beta (não Supabase Auth)
- Biome + ultracite (não ESLint)

**Reuso pra nosso projeto:**

- ✅ **Schema Artifacts** → adapt para `page_drafts` (composite PK + Suggestion table) — solução pronta pra ADR-0045 D.5 incremental edits
- ✅ **Rate limit pattern** (`lib/ratelimit.ts`) — copy verbatim
- ✅ **resumable-stream** package — útil pra long-running AI generation (Fase 6)
- ⚠️ Drizzle vs Supabase client — não trocar (RLS + Auth + Storage no Supabase)
- ⚠️ Biome vs ESLint — não trocar (Sheriff boundaries ESLint-only)

### 1.5 Deep-dive — next-forge (Vercel oficial)

**Estrutura monorepo (`apps/*` + `packages/*`):**

```
apps/
  api          ← rate-limited API endpoints
  app          ← main consumer-facing app (auth, dashboard)
  docs         ← MDX-based documentation (Mintlify-style)
  email        ← react-email preview server
  storybook    ← isolated component dev
  studio       ← Prisma Studio
  web          ← marketing site

packages/
  @repo/ai                    → re-export `ai` (Vercel SDK)
  @repo/analytics             → PostHog wrapper
  @repo/auth                  → Clerk re-export + middleware
  @repo/cms                   → BaseHub blog/marketing
  @repo/collaboration         → Liveblocks rooms
  @repo/database              → Prisma + Neon
  @repo/design-system         → shadcn + next-themes + Toaster
  @repo/email                 → react-email + Resend
  @repo/feature-flags         → Vercel Flags SDK
  @repo/internationalization  → next-intl
  @repo/next-config           → shared Next config
  @repo/notifications         → Knock
  @repo/observability         → Sentry + Logtail
  @repo/payments              → Stripe wrapper
  @repo/rate-limit            → Upstash Ratelimit wrapper
  @repo/security              → Arcjet bot detection
  @repo/seo                   → next-seo wrapper
  @repo/storage               → re-export @vercel/blob
  @repo/webhooks              → Svix
```

**Veredito pra nosso projeto:**

- ❌ **NÃO mover pra Turborepo agora.** Single app + lib/contracts/data/domain já dá separação. Turborepo entra Fase 8+ quando vier 2º app (admin separado?).
- ✅ **Layout de packages é a doc viva do "que existe na stack moderna".** Cada `@repo/<x>` é "essa preocupação merece pacote isolado". Use a lista pra confirmar não esquecemos nada.
- ❌ **Clerk + Prisma + Neon stack não combina** com Supabase RLS-first.
- ✅ **Padrão `@repo/design-system` com `DesignSystemProvider` que aninha `ThemeProvider + AuthProvider + TooltipProvider + Toaster`** — é o pattern que já usamos no `app/layout.tsx`.

### 1.6 Deep-dive — Vercel Next.js SaaS Starter (`nextjs/saas-starter`)

**Schema (Drizzle):**

```
users (id, email, passwordHash, role)
teams (id, name, stripeCustomerId, stripeSubscriptionId, planName, subscriptionStatus)
teamMembers (userId, teamId, role)
activityLogs (teamId, userId, action, ipAddress)
invitations (teamId, email, role, invitedBy, status)
```

**Tech stack:**

- bcryptjs (não Supabase Auth)
- jose JWT (não Supabase session)
- Stripe direto (não Polar/EFI)
- Drizzle + Postgres direto
- shadcn primitives
- SWR pra client data
- Next 15 canary

**Veredito:** modelo BÁSICO de team-based SaaS. **Nosso "tenant" é mais rico que "team"** (vertical, brand, domains, custom theme, palette).

**Reuso:**

- ✅ Stripe pattern (`lib/payments`) — copy se decidir migrar EFI→Stripe BR (futuro Fase 4+)
- ❌ Auth (bcrypt+jose) — Supabase Auth já cobre
- ❌ Drizzle — Supabase client direto + RLS escolhido (research-22)
- ⚠️ `activityLogs` table — útil pra audit, podemos copiar o conceito JIT

### 1.7 Deep-dive — TweakCN (revisitado com lente comparativa)

Já documentado em `docs/research/28-tweakcn-evaluation.md`. Adendo comparativo:

**O que NÃO trocar mesmo se TweakCN faz:**

- ❌ better-auth → Supabase Auth (decisão cravada, RLS-first)
- ❌ Drizzle + Neon → Supabase Postgres (RLS + Storage + Edge)
- ❌ Polar.sh → EFI Bank + Asaas/Stripe externo (BR-first)
- ❌ Zustand `editor-store.ts` → RHF + `useReducer` (ADR-0045 D.5; research-41 §2.3 bloqueador)
- ❌ Better-auth + OAuth own server → Supabase Auth + custom_access_token_hook (JWT claims)

**O que TROCAR PRA TweakCN-way (já cravado):**

- ✅ ~45 keys flat shadcn-canonical
- ✅ OKLCH primary
- ✅ Algoritmo `getShadowMap()` + `colorFormatter()` (research-30 validado)
- ✅ AI pipeline: `streamText` base + tool `generateTheme()` chama `streamObject(themeStylesSchema)` (ADR-0045 D.5)
- ✅ Endpoint `/r/themes/[id]` + `registry:style` (ADR-0045 D.15)
- ✅ Color picker stack: native input + text livre culori-parsed

### 1.8 Deep-dive — Tiptap (lib core)

Não auditado profundamente — é peer dependency do Novel. Anotações:

- ProseMirror underneath, fork mantido ueberdosis
- StarterKit + custom Extensions ricos (Mathematics, GlobalDragHandle, Twitter embed, etc)
- Collab via `y-tiptap` (Yjs) — ADR-0045 §H.9 open question
- `@tiptap/static-renderer` para SSR

**Veredito:** ferramenta única. Acessada via Novel wrapper (ADR-0045 D.4).

### 1.9 Deep-dive — shadcn-ui core

**O que importa:**

- `apps/www` é o site oficial + registry generator
- `packages/shadcn` (CLI) + `packages/cli` + `packages/registry`
- Schema `registry-item.json` em `https://ui.shadcn.com/schema/registry-item.json`
- `packages/registry/registry-blocks/` — todos os blocks oficiais (~100+, dashboard-01..16, login-01..05, etc)

**Veredito:** SSOT pro schema `registry-item.json`. Quando criarmos `/api/r/[name]/route.ts` (ADR-0045 D.10), validar payload via `registryItemSchema.safeParse()` direto de `import { registryItemSchema } from "shadcn/schema"` — exatamente como TweakCN faz.

---

## Parte 2 — Análise stack peça-por-peça

| Peça                            | Nosso atual                                                 | Alternativas mercado                                                             | Custo migrar | Veredito                                                                                                                                                                                             |
| ------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**                   | Next 16 (App Router, Turbopack, proxy.ts, Cache Components) | nenhum competidor relevante pra SSR PWA brasileiro                               | n/a          | **MANTER** — single best choice 2026.                                                                                                                                                                |
| **Auth**                        | Supabase Auth + custom_access_token_hook (JWT claims)       | Clerk (next-forge), better-auth (TweakCN), next-auth 5 (ai-chatbot), Better-Auth | 40-80h       | **MANTER**. Supabase Auth + RLS é stack BR canônico, JWT claims `tenant_id` é o pattern Makerkit/Supabase 2026 (research-22 A2). Better-Auth interessante mas perdemos integração Auth↔Storage↔Edge. |
| **Billing**                     | EFI Bank (Pix) + Asaas/Stripe externo (link)                | Stripe direto (vercel-saas), Polar.sh (TweakCN), Pagar.me, LemonSqueezy          | 20-40h       | **MANTER fase agência**. EFI cobra prof (BR-first); aluno paga prof via gateway. Migrar pra Stripe BR só quando marketplace split (futuro fase SaaS).                                                |
| **Multi-tenant**                | hostname → Postgres `brands`+`domains` + RouteProvider      | Vercel Platforms (Redis pattern), schema-per-tenant (anti-pattern research-22)   | n/a          | **MANTER** — pattern Vercel Platforms estendido com Postgres + RLS. Estritamente mais rico (custom domains, vertical, theme per-tenant).                                                             |
| **Theme**                       | TweakCN-way ~45 keys flat + OKLCH + APCA Silver             | Material 3 tokens, IBM Carbon, Radix Colors                                      | n/a          | **MANTER** (ADR-0044 cravado).                                                                                                                                                                       |
| **UI primitives**               | shadcn new-york + Radix individual + cva + tw-merge         | Mantine, Chakra, NextUI                                                          | 150h+        | **MANTER** — ecosystem (v0, TweakCN, MCP, Kibo, Origin) só fala shadcn.                                                                                                                              |
| **Prose editor**                | Novel (planned JIT) — Tiptap-based                          | Plate (slate-based, complexo), Lexical (Facebook, RSC awkward), BlockNote        | n/a          | **MANTER** (ADR-0045 D.4 cravado). Novel é o sweet-spot AI-native + Tiptap maturidade.                                                                                                               |
| **Block system / page builder** | Page Engine custom (planned Fase 7)                         | Builder.io, Plasmic, Puck.io, Editor.js                                          | 80-120h ROI? | **MANTER custom**. Builder.io/Plasmic = vendor lock-in, sem multi-tenant RLS, theming hardcoded. Puck.io interessante mas spec deles ≠ nosso `pages.kind` polimórfico. Custom necessário.            |
| **AI orchestration**            | Vercel AI SDK 6 + Gateway + Anthropic                       | LangChain.js, Vercel AI SDK direto sem Gateway, OpenAI Assistants                | 20h          | **MANTER**. Gateway elimina markup, observability nativa. Sonnet 4.6 + Haiku 4.5 + Gemini 2.5 Flash (theme) política tabela (ADR-0045 D.6).                                                          |
| **Forms**                       | RHF 7 + Zod 4 + `@hookform/resolvers/standard-schema`       | TanStack Form, Conform                                                           | 60h          | **MANTER** — RHF + Zod 4 é o pattern proven. TanStack Form ainda imatura.                                                                                                                            |
| **ORM/DB**                      | Supabase client direto + RLS                                | Drizzle (next-forge, ai-chatbot, vercel-saas), Prisma (next-forge), Kysely       | 80-120h      | **MANTER**. Drizzle bom mas RLS é a fronteira de segurança — perderíamos `client.from(...)` que aproveita JWT claims automático. Adapter `fromRow()` cobre type safety.                              |
| **PWA**                         | Serwist + `@serwist/turbopack` + idb-keyval                 | Workbox direto, next-pwa (abandonado), PWABuilder                                | n/a          | **MANTER**. Único v4-turbopack maintained.                                                                                                                                                           |
| **i18n**                        | next-intl 4 + ICU MessageFormat                             | react-intl, lingui, t3-i18n                                                      | 40h          | **MANTER**. ICU é padrão; namespace por vertical resolve scoping.                                                                                                                                    |
| **Rate limit**                  | Upstash (planned)                                           | Vercel KV, Redis self-hosted                                                     | 8h           | **MANTER** Upstash — same pattern TweakCN, next-forge, ai-chatbot usam.                                                                                                                              |
| **Real-time collab**            | LWW + ETag/409 (planned)                                    | Liveblocks (next-forge), y-tiptap Yjs, Supabase Realtime                         | TBD          | **DEFER**. ADR-0045 D.4 cravou: install Yjs JIT quando 2+ admins simultâneos virarem dor real.                                                                                                       |
| **Email**                       | Resend + react-email                                        | SendGrid, Postmark, AWS SES                                                      | 8h           | **MANTER**. Padrão BR-friendly, react-email DX excelente.                                                                                                                                            |
| **Storage**                     | Supabase Storage + Bunny Stream                             | Vercel Blob, R2, AWS S3                                                          | 40h          | **MANTER**. Bunny Stream PoP São Paulo 29ms é diferencial fitness BR.                                                                                                                                |
| **Observability**               | Sentry + PostHog                                            | Logtail, OpenTelemetry (ai-chatbot), Axiom                                       | 8h           | **MANTER**. Sentry + PostHog é stack canônico.                                                                                                                                                       |
| **Test**                        | Vitest 4 + Playwright + Storybook 10 + happy-dom            | Jest (legado), Cypress (legado), Puppeteer                                       | n/a          | **MANTER**.                                                                                                                                                                                          |
| **Lint**                        | ESLint 9 flat + Sheriff + better-tailwindcss                | Biome (TweakCN/next-forge), ultracite                                            | 40-60h       | **MANTER ESLint** — Sheriff (tag-based boundaries) é o killer feature ESLint-only. Biome mais rápido mas Sheriff não tem equivalente.                                                                |
| **Monorepo**                    | single app                                                  | Turborepo (next-forge), pnpm workspaces                                          | 60h          | **DEFER** — Single app + lib/ pastas chega longe. Turborepo entra com 2º app (admin separado, futuro).                                                                                               |

---

## Parte 3 — Combinations pre-built avaliadas

### 3.1 "shadcn + TweakCN + Novel + AI + multi-tenant numa stack pronta"?

**Resposta: NÃO existe.** Pesquisa exaustiva nos repos clonados:

| Repo                    | shadcn | TweakCN | Novel                   | AI orch             | Multi-tenant | Veredito                            |
| ----------------------- | ------ | ------- | ----------------------- | ------------------- | ------------ | ----------------------------------- |
| tweakcn-ref             | ✅     | ✅      | ❌                      | ✅                  | ❌ single    | só theme editor, perdemos tudo mais |
| novel-ref               | ❌     | ❌      | ✅                      | ✅                  | ❌           | só prose editor demo                |
| vercel-platforms-ref    | ✅     | ❌      | ❌                      | ❌                  | ✅ Redis     | só multi-tenant hostname            |
| vercel-saas-ref         | ✅     | ❌      | ❌                      | ❌                  | ❌ teams     | só Stripe + auth                    |
| ai-chatbot-ref          | ✅     | ❌      | ❌ (ProseMirror direto) | ✅ rich (Artifacts) | ❌           | melhor AI orch encontrada           |
| next-forge-ref          | ✅     | ❌      | ❌                      | partial             | ❌           | melhor packages layout              |
| Makerkit (sem clone)    | ✅     | ❌      | ❌                      | ❌                  | ✅ Supabase  | paid, próximo do nosso              |
| Supastarter (sem clone) | ✅     | ❌      | ❌                      | partial             | ✅           | paid, Supabase + Next               |

**Conclusão:** estamos construindo a primeira composição. Não há atalho.

### 3.2 Combinations parciais que VALEM clonar

| Combinação                              | Repo             | Quantos % cobre                        | Recomendação                            |
| --------------------------------------- | ---------------- | -------------------------------------- | --------------------------------------- |
| Multi-tenant hostname básico            | vercel-platforms | ~20%                                   | **JÁ ADOTAMOS** (extendido)             |
| Theme editor + AI generation            | tweakcn-ref      | ~25% (Fase 5+6 do pivot)               | **EM EXECUÇÃO** — extract & adapt       |
| Prose editor AI-native (Tiptap wrapper) | novel-ref        | ~5% (Lesson editor futuro)             | **STACK DECISION** (ADR-0045 D.4) — JIT |
| AI orchestration + Artifacts            | ai-chatbot-ref   | ~15% (Page Engine incremental edits)   | **REUSO PATTERN** (D.5 ADR-0045)        |
| Stripe billing                          | vercel-saas-ref  | ~10% (fase marketplace futura)         | **DEFER** até fase SaaS                 |
| Packages layout (`@repo/*`)             | next-forge-ref   | ~5% (referência de "lista de pacotes") | **DEFER** Turborepo                     |

### 3.3 Sem template oficial, melhor caminho

`pnpm dlx shadcn@latest init` cria stack mínima (Next + shadcn + tailwind v4 + next-themes). Sem multi-tenant, sem AI, sem Supabase. **Não vale.**

Vercel templates por keyword "saas multi-tenant ai" (via Vercel galeria): existem ~5 templates mas todos são specs simples (1 banco, 1 stripe). Nenhum cobre verticalização + branding + AI + PWA + Engines.

**Conclusão final:** continuar construindo. **Não há ROI em pivot pra template existente.**

---

## Parte 4 — Veredito stack atual (mantém ou troca?)

### 4.1 Stack atual = certo?

**Resposta: SIM, com 3 caveats.**

**3 itens em risco que precisam atenção:**

1. **Rate limit AI per-tenant** (GAP-1 do mapa) — não desenhado.
   Padrão proven: copy do TweakCN (`@upstash/ratelimit + @vercel/kv`).
   Esforço: 4h. Bloqueia Fase 6.

2. **AI orchestration boilerplate** sem `lib/ai/orchestrator.ts` unificador.
   4 paradigmas convivem (generateObject + streamText+tools + streamObject + Novel useChat). Sem abstração compartilhada, cada feature Fase 6+7+produto duplica error handling + retry + APCA gate + cost logging.
   Padrão proven: copy do ai-chatbot-ref pattern de `providers.ts` (`getLanguageModel(modelId)`) + cada feature tem 1 route handler stream-friendly.

3. **Schema versioning de blocks/forms/pages** (GAP-4 do mapa) — sem
   migration path quando block kind ganha `variant` novo.
   Padrão proven: copy ai-chatbot Document(id, createdAt PK) — versioning automático.

### 4.2 D1/D4/D8 — confirmar com lente arquitetural

**[D1] v0 demoted (ADR-0045 D.1):** ✅ **CONFIRMADO.**

- Auditoria de ai-chatbot-ref confirmou: AI emite "Artifacts" (Document/Suggestion schema) — não TSX raw. Mesmo padrão.
- next-forge não usa v0 internamente.
- Vercel Platforms não tem AI page gen.
- **Refutação tentativa:** nenhum repo proven usa v0 runtime em produção multi-tenant. Cravar D.1 está correto.

**[D4] Novel ADOPT NOW + INSTALL JIT (ADR-0045 D.4):** ✅ **CONFIRMADO.**

- Novel `packages/headless/src/` = ~1.500 LOC glue sobre Tiptap. Sem ele = 2-4 dias reinvenção.
- next-forge não tem editor (CMS é BaseHub externo).
- ai-chatbot-ref usa ProseMirror DIRETO (não Novel) — mas chatbot tem features diferentes (não há AI inline rewrite, só chat completion).
- Para Lesson editor + Journals (prose-dominante), Novel é sweet spot.
- **Refutação tentativa:** Plate (slate-based) tem mais features mas complexidade muito maior. BlockNote interessante mas menos AI-native.

**[D8] Smart blocks composição declarada (ADR-0045 D.8):** ✅ **CONFIRMADO.**

- Tabela separada `smart_blocks` seria órfã sem state server-side. Composição declarativa `@composition: [hero, evidence-grid, cta]` no JSDoc é mais simples.
- ai-chatbot-ref usa pattern similar: `artifacts/` folder define block types (`code`, `text`, `image`, `sheet`) e renderer dispatcha por `kind`.
- Refactor pra tabela quando smart block precisar de row própria (tracking per-aluno, analytics) é claro.

### 4.3 Próximo passo concreto recomendado

**Antes de Fase 5/6/7 do pivot, fechar 3 gaps arquiteturais:**

1. **GAP-1 (rate limit AI):** 4h — cravar `lib/ratelimit/ai.ts` Upstash + `requireQuota('ai_theme_generation')` no `lib/entitlements/server.ts`. ADR-0039 já tem RPC infra.
2. **GAP-3 (domain catalog skeleton):** 2h — criar `lib/contracts/domain-catalog.ts` com `client_profiles` + `tenant_brand` stub. Blueprint 21 §5 já tem esqueleto.
3. **GAP-4 (block schema versioning migration path):** 2h — adicionar `schema_version int` em `form_versions.definition` + `page_versions.definition` design (cravar ADR addendum se necessário, ou só doc no plan).

**Total: 8h.** Destrava Fase 5/6/7 sem retrabalho.

**Em paralelo (background workstreams), enquanto isso:**

- Resolver batch Theming (D.2 mobile/PWA tokens) — 1-2h.
- Audit research-41 já feito.
- Cravar ADR-0045 final (sair de draft).

**Após gaps fechados:** Fase 5 (Builder UI extract+adapt TweakCN) + Fase 6 (AI generation extract+adapt) **em paralelo** — sem dependência cruzada. Fase 7 depois (registry + Page Engine + 7 L2 blocks dia 0).

---

## 5. Referências

- `docs/architecture/01-master-system-map.md` — companion (mapa interno)
- ADR-0024 / 0033 / 0039 / 0040 / 0041 / 0044 / 0045 draft
- Blueprint 00-08 + 21
- Research 22 / 28 / 30 / 33 / 37 / 38 / 40 / 41
- `C:\Users\leean\Desktop\tweakcn-ref\` — TweakCN SSOT
- `C:\Users\leean\Desktop\novel-ref\` — Novel SSOT
- `C:\Users\leean\Desktop\tiptap-ref\` — Tiptap core
- `C:\Users\leean\Desktop\vercel-platforms-ref\` — Vercel oficial multi-tenant
- `C:\Users\leean\Desktop\vercel-saas-ref\` — Vercel oficial SaaS (Stripe + Drizzle)
- `C:\Users\leean\Desktop\ai-chatbot-ref\` — Vercel oficial AI Chatbot v3.1 (Artifacts)
- `C:\Users\leean\Desktop\next-forge-ref\` — Vercel oficial Turborepo SaaS
- `C:\Users\leean\Desktop\shadcn-ref\` — shadcn-ui core (CLI + registry)
- shadcn registry schema — https://ui.shadcn.com/schema/registry-item.json
- Vercel AI SDK v6 — https://sdk.vercel.ai
- Novel — https://novel.sh
- Tiptap — https://tiptap.dev

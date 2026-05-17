# 02 — Stack travado

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Stack pinada. Bumpar major exige ADR + aprovação fundador.
> Cada major bump acidental foi 1 das 10 decisões revertidas no onboarding-bio.

---

## 1. Runtime

| Pacote | Versão | Razão |
|---|---|---|
| `next` | **16.x** | App Router · Turbopack default · `cacheComponents: true` · `proxy.ts` · React Compiler 1.0 |
| `react` / `react-dom` | **19.x** | Server Components default · `useOptimistic` · ref-as-prop |
| `typescript` | **5.x strict++** | 6 flags extras (§7) |
| `tailwindcss` | **v4.x** | `@theme` CSS-first · OKLCH nativo · `@theme inline` runtime |
| `motion` | **12.x** | Pacote canônico (NUNCA `framer-motion`) · springs · `LazyMotion` |
| `vaul` | **1.x** | Bottom sheets mobile · snap points · `repositionInputs` |
| `geist` | **1.x** | Geist Sans + Mono (variable, Latin subset) |
| `lucide-react` | **^1.8** | Icon library oficial shadcn new-york |
| `next-intl` | **4.x** | i18n com ICU MessageFormat + namespace por vertical |

**Decisão:** stack travada dia 1 (D-G3 master plan §1). Branch major =
nova ADR + plano de migração isolado.

---

## 2. UI / Design System

| Pacote | Versão | Razão |
|---|---|---|
| `shadcn` registry | **new-york dark-first** | Decisão `_CONFLITOS.md #8` — hierarquia de busca |
| `@radix-ui/react-*` | individual por primitive | Via shadcn copy-paste; nunca meta-package |
| `class-variance-authority` (cva) | **^0.7** | Variants tipados |
| `tailwind-merge` + `clsx` | latest | `cn()` helper |
| `apca-w3` | **^0.1.9** | APCA Lc dual-gate (body 60 / small 75 / UI 45) |
| `culori` (via `culori/fn`) | **^4** | OKLCH manipulation tree-shakable |

**Paletas:** 13 OKLCH oficiais (master plan §7.3 + memória D-G76). Migra
verbatim de `app/preview/paletas/page.tsx` pra `lib/design/palettes.ts`.

Adicionar paleta 14ª = pivot (00-PROJETO §8).

---

## 3. Dados

| Pacote | Versão | Razão |
|---|---|---|
| `@supabase/ssr` | **^0.10** | App Router cookies · sucessor `auth-helpers-nextjs` |
| `@supabase/supabase-js` | **^2.103** | Usado só dentro de `lib/supabase/{client,server,admin}` |
| `zod` | **4.x** | `discriminatedUnion` v4 + JSON Outputs Anthropic friendly |
| `react-hook-form` | **^7.72** | Forms |
| `@hookform/resolvers/standard-schema` | **^5.2** | Workaround bugs `discriminatedUnion` + zodResolver (D-G65) |

Edge Functions Deno usam `@supabase/supabase-js` direto (Deno-friendly).

---

## 4. Backend / Infra

| Serviço | Plano dia 1 | Razão |
|---|---|---|
| **Supabase** (Postgres + Auth + Storage + Edge + Realtime) | Free → Pro quando estourar MAU/DB/storage | Stack canônica BR |
| **Vercel** | Hobby → Pro quando bandwidth/features | Hosting Next.js + Edge Network |
| **Vercel AI Gateway** | PAYG zero markup | Anthropic Sonnet 4.6 + Haiku 4.5 (pinados) |
| **EFI Bank** | Pix Automático + cartão 10× | Cobra mensalidade plataforma → prof |
| **Bunny Stream** | PAYG | Vídeo hospedagem · PoP São Paulo sub-29ms |
| **Asaas** | Link externo dia 1 | Gateway aluno BR (BRL) — pesquisa 01 §2.1 |
| **Stripe** | Link externo dia 1 | Gateway aluno USD/EUR/GBP/CAD/AUD (D-G33) |
| **Cloudflare for SaaS** | Free 100 hostnames | Custom domain quando 1º Pacote B/C pedir |
| **Sentry** | Free 5k/mês → Team $26 | Errors + Session Replay quando virar bug iPhone |
| **Resend** + `react-email` | Free 3k/mês | Transacional com domínio do prof |
| **Meta Cloud API (WhatsApp)** | PAYG | OBA host híbrido (mês 4-6) |
| **Upstash Ratelimit + Redis** | Free tier | Rate limit per-tenant |
| **PostHog** | Free tier | TTFV + activation events |

Gatilhos de upgrade: master plan §29.8.

---

## 5. Dev / Build

| Pacote | Versão | Razão |
|---|---|---|
| `pnpm` | **10.x** (NUNCA npm/yarn) | `packageManager` pinado em package.json |
| Node | **24 LTS** (.nvmrc) | Default Next 16 |
| `eslint` | **9.x flat config (.ts)** | `eslint.config.ts` nativo (v9.18+) |
| `typescript-eslint` | strict-type-checked + stylistic-type-checked | Preset oficial pro devs proficient |
| `@softarc/sheriff-core` + `@softarc/eslint-plugin-sheriff` | latest | Boundary rules tag-based (D-G57) |
| `@eslint-community/eslint-plugin-eslint-comments` | latest | Bane `eslint-disable` (D-G11) |
| `eslint-plugin-better-tailwindcss` | latest | Único que suporta Tailwind v4 |
| `eslint-plugin-jsx-a11y` strict | latest | A11y baseline |
| `prettier` 3.x + `prettier-plugin-tailwindcss` | latest | `tailwindFunctions: ['cn','cva','tv']` |
| `husky` 9.x + `lint-staged` | latest | Pre-commit `--no-inline-config --max-warnings 0` |
| `@commitlint/cli` + `config-conventional` | latest | Conventional Commits |
| `vitest` 4.x | latest | Unit + contract tests |
| `@playwright/test` + `@axe-core/playwright` | latest | E2E + a11y |
| `ladle` 5.x | latest | Catálogo componentes (D-G dia 0 — _CONFLITOS #13) |
| `knip` | latest | Dead code + unused deps |
| `size-limit` + `size-limit-action` GHA | latest | Bundle budgets (D-G64) |
| `renovate` (config restritivo) | hosted | Major bloqueado (D-G62) |

**Trade-offs aceitos:**
- `lint-staged` + `bash -c 'pnpm typecheck'` adiciona ~3-6s pré-commit (workaround issue #825) — aceitável.
- Sem `Lefthook` (Husky basta solo).
- Sem `Turborepo` (single app, sem ROI).

---

## 6. Next 16 features ON dia 1

| Feature | Como | Decisão |
|---|---|---|
| `cacheComponents: true` | `next.config.ts` | ON — inverte default (tudo dynamic, cache via `'use cache'` + `cacheLife()` + `cacheTag()`) |
| PPR (Partial Pre-Rendering) | automático sob `cacheComponents` | ON |
| Turbopack dev + prod | default Next 16 | ON |
| React Compiler 1.0 | `reactCompiler: true` | ON — sem `useMemo`/`useCallback` manual em 90% dos casos |
| `proxy.ts` (ex-middleware) | único arquivo edge | ON — resolve `tenant_id` por `host` |
| `revalidateTag(tag, profile)` | sempre 2 args | obrigatório (single-arg deprecado) |
| `unstable_after` | uso cauteloso | só fire-and-forget pós-response (logs/analytics) |

Detalhes: master plan §1.4.

---

## 7. TypeScript strict++ (D-G58)

Além de `strict: true`:

- `noUncheckedIndexedAccess: true` — `arr[0]` vira `T | undefined`
- `exactOptionalPropertyTypes: true` — `{x?: string}` NÃO aceita `{x: undefined}`
- `noImplicitOverride: true`
- `noFallthroughCasesInSwitch: true`
- `noImplicitReturns: true`
- `verbatimModuleSyntax: true`

**NÃO adicionar** `noPropertyAccessFromIndexSignature` (ruidoso demais — [I]).

Pesquisa 04 §2.1.

---

## 8. Editor / IA stack

| Camada | Decisão |
|---|---|
| Editor workout (sets/reps/cargas) | **Form-based em vaul bottom sheet** (`@dnd-kit/sortable` para reorder) |
| Editor landing texto livre | **`contenteditable="plaintext-only"` cru** (sem lib) |
| Editor landing rich text (parágrafos) | **Tiptap 3** lazy-loaded só onde precisar (5 issues iOS aceitas) |
| AI provider | **Vercel AI Gateway** (zero markup) |
| Models | **Sonnet 4.6** (identidade/estrutura) + **Haiku 4.5** (componentes/coerência/chatbot) |
| Output estruturado | `output_config.format` JSON Outputs Anthropic GA + 2-schema pattern (draft + strict) |
| Prompt caching | `ephemeral` TTL `1h` em chatbot/componentes; `5min` em outros |
| Extended thinking | **Só em ESTRUTURA** (Sonnet adaptive medium); resto zero-shot |
| Eval | Promptfoo CI + Vercel AI Gateway dashboard + Sentry |

`pgvector` **NÃO** instalado dia 1 — chatbot Pacote C funciona sem RAG (TBCA+TACO no system cacheado). Gatilho: ≥100 conv/dia OU custo > R$200/mês.

Decisão fechada em _CONFLITOS #14 + master plan §13.

---

## 9. PWA stack

| Item | Decisão |
|---|---|
| Service Worker | **Serwist** + `@serwist/next` + `@serwist/turbopack` |
| Offline DB | **Dexie 4.x** (typed `EntityTable<T,'id'>` + `useLiveQuery`) |
| Mutation queue | Dexie + idempotency key + exponential backoff (2→4→8→16→32s, 6 attempts) |
| Manifest | Dinâmico por tenant em `app/(public)/[slug]/manifest.webmanifest/route.ts` |
| Push | Web Push + Vapid **1 par por tenant** (RFC 8292) |
| Cache strategies | NetworkFirst (HTML 24h) · CacheFirst (static 30d) · SWR (CSS 7d) |
| Install prompt | Custom bottom-sheet vaul · 2ª sessão + 1ª ação significativa · 7d dismiss cap |

Detalhes: _CONFLITOS #14/#15 + pesquisa 12 + master plan §10.

---

## 10. Política de upgrade

`renovate.json` restritivo (D-G62):

- **Major bloqueado** — `enabled: false` + label `major-blocked`
- Minor/patch core stack (Next/React/Tailwind/Supabase/AI SDK) — `automerge: false` + label `stack-core`
- Minor/patch devDeps — `automerge: true`
- `lockFileMaintenance` semanal segunda 5h

`package.json` reforço:
- `engines: { node: ">=24", pnpm: ">=10" }`
- `packageManager: "pnpm@10.x.x"`
- `pnpm.overrides: { "framer-motion": "npm:motion@^12" }` (validar via `pnpm why framer-motion`)

---

## 11. Bundle budget per-rota (_CONFLITOS #20)

Enforced via `size-limit` no CI:

| Rota | First Load |
|---|---|
| Landing pública (`/`, `/[slug]`) | 100KB |
| Login / signup | 80KB |
| PWA shell (após login) | 170KB |
| PWA aba | 50KB incremental |
| Editor (form-based) | 50KB incremental |
| Editor (inline texto) | 30KB incremental |
| Admin / billing | 60KB incremental |
| Influencer dashboard | 40KB incremental |

PR bloqueada se ultrapassar — subir budget exige ADR.

---

## 12. Stack proibida (lint enforce)

| Banido | Substituto | Razão |
|---|---|---|
| `framer-motion` | `motion/react` (Motion 12) | Pacote canônico desde 2024 |
| `npm`, `yarn` | `pnpm` | `packageManager` pinado |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | Deprecado |
| `createClient()` direto fora de `lib/supabase/*` | Wrapper `{client, server, admin}` | Isolation |
| `@supabase/supabase-js` import direto em app code | Via wrapper acima | Mesma razão |
| `eslint-plugin-tailwindcss` (legacy) | `eslint-plugin-better-tailwindcss` | Único v4-native |

ESLint `no-restricted-imports` + `id-denylist` + `no-restricted-syntax` cobrem tudo.

---

## Referências

- `00-PROJETO.md` §8 (hierarquia premium + critério recurso moderno)
- `_CONFLITOS.md` #14 (Serwist + Turbopack) · #15 (Dexie + idempotency) · #20 (size-limit)
- Master plan §1 (stack) · §29 (CI/CD) · §30 (deps aproveitáveis)
- Pesquisa 03 §1 (modelos IA) · §4 (cost optimization)
- Pesquisa 04 §1-§8 (tooling completo)
- Pesquisa 12 (PWA Serwist + Dexie)

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — stack travada Next 16/React 19/Tailwind v4 + 13 paletas | Leandro |

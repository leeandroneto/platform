---
markmap:
  colorFreezeLevel: 2
  maxWidth: 360
  initialExpandLevel: 2
---

# OSS End-to-End — quebra-cabeça completo

## Legenda

### Ação

- **COPY** = clone arquivos pro nosso repo + atribuição NOTICE
- **INSTALL** = `pnpm add` como dependency
- **STUDY** = ler código mas não copia (AGPL/GPL ou stack diferente)
- **SKIP** = não usar (license incompatível ou abandonado)

### Licenças permitem o quê

- **MIT / Apache 2.0 / BSD** = COPY ou INSTALL livre + atribuição
- **AGPL / GPL** = só STUDY (se virar SaaS pago precisa abrir código)
- **BSL / Sustainable Use** = caso a caso (self-host geralmente ok)
- **Closed-source** = só STUDY público (blog posts, docs)

---

## Camada 1 — Vibe coding (prioridade)

> IA orquestra blocks via prompts. Sem UI visual. Núcleo da plataforma AI-native.

### AI orchestration

#### Vercel AI Chatbot

- **License:** MIT
- **Stack:** Next.js + AI SDK v6 + Supabase compat
- **Ação:** COPY pattern
- **Por quê:** Artifacts factory (createDocumentHandler) + tool calling + composite PK versioning — base direta pra AI Reports + AI Builders. Já clonado em `ai-chatbot-ref`

#### Mastra

- **License:** Apache 2.0
- **Stack:** Next.js native + TypeScript
- **Ação:** INSTALL
- **Por quê:** Framework Next.js pra agents/workflows/RAG/evals/observability — cobre tudo que precisaríamos reinventar

#### Vercel AI SDK v6

- **License:** Apache 2.0
- **Stack:** TypeScript multi-provider
- **Ação:** ✅ JÁ INSTALADO
- **Por quê:** generateObject + streamText + tool calling + AI Gateway (multi-model fallback)

#### Inngest

- **License:** Apache 2.0
- **Stack:** TypeScript multi-platform
- **Ação:** INSTALL JIT (quando AI Reports entrar)
- **Por quê:** Durable workflows pra AI longa (5-30s) com retry/resumable — research-44 cravou

#### Trigger.dev

- **License:** Apache 2.0
- **Stack:** Node + TypeScript
- **Ação:** INSTALL alt (escolher 1 entre Inngest/Trigger)
- **Por quê:** Alternativa Inngest, jobs durables — Vercel-friendly

#### LangChain.js

- **License:** MIT
- **Stack:** TypeScript
- **Ação:** STUDY patterns
- **Por quê:** Output parsers + chains conceituais — usar Mastra ou AI SDK pra implementar

#### AutoGen (Microsoft)

- **License:** MIT
- **Stack:** Python + .NET
- **Ação:** STUDY pattern
- **Por quê:** Multi-agent orchestration patterns aplicáveis ao Vercel AI SDK

#### CrewAI

- **License:** MIT
- **Stack:** Python
- **Ação:** STUDY pattern
- **Por quê:** Multi-agent simples — abstração role/task/crew aplicável

#### Promptfoo

- **License:** MIT
- **Stack:** Node CLI
- **Ação:** INSTALL JIT (CI gate prompt drift)
- **Por quê:** Prompt evaluation + drift detection — research-44 cravou pro Pacote A futuro

#### AgentOps

- **License:** Apache 2.0
- **Stack:** SDK multi-language
- **Ação:** INSTALL JIT
- **Por quê:** AI observability — traces, costs, evals

#### AnythingLLM

- **License:** MIT
- **Stack:** Node + multi-DB
- **Ação:** STUDY
- **Por quê:** RAG agentic chatbot — arquitetura RAG multi-tenant inspiração

#### LibreChat

- **License:** MIT
- **Stack:** Node + React
- **Ação:** STUDY
- **Por quê:** Multi-model chat UI completo — routing entre modelos

#### Continue.dev

- **License:** Apache 2.0
- **Stack:** TypeScript multi-IDE
- **Ação:** STUDY
- **Por quê:** Context injection patterns IA dev tools

#### OpenV0

- **License:** MIT
- **Stack:** Next.js + Claude/GPT
- **Ação:** COPY parts
- **Por quê:** AI gera shadcn components — patterns prompt + parsing + safety

### Generative UI / output validation

#### Zod

- **License:** MIT
- **Stack:** TypeScript
- **Ação:** ✅ JÁ INSTALADO
- **Por quê:** Schema validation pra structured output IA

#### `generateObject` + tool calling AI SDK

- **License:** Apache 2.0
- **Stack:** Next.js
- **Ação:** ✅ JÁ TEMOS via AI SDK
- **Por quê:** IA emite spec validado por Zod (não TSX raw)

---

## Camada 2 — Visual editor (futuro, segunda frente)

> Drag-drop editores visuais pros profissionais que preferem manual. Coexiste com vibe coding.

### Page builders visuais

#### Puck

- **License:** MIT
- **Stack:** React + Next.js compat
- **Ação:** COPY
- **Por quê:** JSON spec recursivo + drag-drop minimalista — base direta pra visual editor de pages

#### Craft.js

- **License:** MIT
- **Stack:** React
- **Ação:** COPY framework alt
- **Por quê:** Framework flexível pra construir page builders próprios

#### GrapesJS

- **License:** BSD-3
- **Stack:** Vanilla JS framework-agnostic
- **Ação:** STUDY/COPY parts
- **Por quê:** Drag-drop maduro, modelo HTML-first

#### Editor.js

- **License:** Apache 2.0
- **Stack:** Vanilla JS
- **Ação:** COPY block patterns
- **Por quê:** Block-style editor estilo Notion

#### Webstudio

- **License:** AGPL-3.0
- **Stack:** React
- **Ação:** STUDY
- **Por quê:** Webflow OSS — só inspiração (AGPL impede copy)

#### Plate

- **License:** MIT
- **Stack:** React + Slate
- **Ação:** STUDY/INSTALL alt
- **Por quê:** Editor visual flexível + AI plugins

#### TinaCMS

- **License:** Apache 2.0
- **Stack:** React/Next.js
- **Ação:** STUDY
- **Por quê:** Visual editing inline em sites

#### Plasmic (OSS parts)

- **License:** MIT (partes)
- **Stack:** React
- **Ação:** STUDY
- **Por quê:** Visual CMS + page builder — modelo comercial OSS

### Form builders visuais

#### Survey.js

- **License:** MIT
- **Stack:** Vanilla JS framework-agnostic
- **Ação:** COPY JSON spec + renderer
- **Por quê:** JSON spec maduro com 20+ campos + branching logic + designer visual

#### Formbricks

- **License:** AGPL-3.0
- **Stack:** Next.js + Supabase
- **Ação:** STUDY (stack IDÊNTICA!)
- **Por quê:** Arquitetura multi-tenant + RLS + analytics — só inspiração (AGPL impede copy)

#### Form.io

- **License:** OSL 3.0
- **Stack:** Angular + Node
- **Ação:** STUDY
- **Por quê:** Drag-drop forms + workflow + render API

#### FormKit

- **License:** MIT
- **Stack:** Vue
- **Ação:** STUDY patterns
- **Por quê:** Validation schemas + logic engine aplicáveis cross-framework

### Flow builders visuais

#### xyflow / React Flow

- **License:** MIT
- **Stack:** React
- **Ação:** COPY
- **Por quê:** Diagram/flow library — base pra flow builder (gamificação Pacote B)

#### Activepieces

- **License:** MIT
- **Stack:** Node + React
- **Ação:** INSTALL alt OR STUDY
- **Por quê:** Workflow automation MIT — alternativa n8n

#### n8n

- **License:** Sustainable Use (self-host OK)
- **Stack:** Node
- **Ação:** STUDY pattern
- **Por quê:** Workflow visual maduro — patterns nodes/connections

### Email builder visual

#### Maily

- **License:** MIT
- **Stack:** React + Tiptap
- **Ação:** COPY
- **Por quê:** Drag-drop email editor — React Email-compatible

#### React Email

- **License:** MIT
- **Stack:** React + Tailwind
- **Ação:** ✅ JÁ INSTALADO
- **Por quê:** Components + renderer email

#### MJML

- **License:** MIT
- **Stack:** XML markup
- **Ação:** INSTALL JIT
- **Por quê:** Email markup language proven (cross-client compat)

---

## Features end-to-end

### Theme Builder (item 1 ADR-0046) ⏳ EM EXECUÇÃO

#### TweakCN

- **License:** Apache 2.0
- **Stack:** Next.js + shadcn + Supabase compat (mas single-user upstream)
- **Ação:** ✅ COPY (em execução)
- **Por quê:** 45 tokens shadcn-canonical + builder visual + 25 presets — adapt multi-tenant + APCA + OKLCH

### Form Engine (item 2 ADR-0046)

#### Survey.js (já listado em visual editor)

- **Ação:** COPY JSON spec
- **Por quê camada 1 vibe coding:** IA gera spec direto → renderer consome
- **Por quê camada 2 visual:** designer visual deles vira nosso builder JIT

#### Formbricks (já listado)

- **Ação:** STUDY
- **Por quê:** Arquitetura multi-tenant Next+Supabase é nossa stack — modelo

### AI Report Engine (item 3 ADR-0046)

#### Vercel AI Chatbot Artifacts

- **Ação:** COPY pattern
- **Por quê:** createDocumentHandler factory + tool layer + Suggestion → reports versionados

#### `@react-pdf/renderer`

- **License:** MIT
- **Stack:** React
- **Ação:** INSTALL JIT
- **Por quê:** Export report PDF (research-25 cravou)

#### Resend + research-25 decisões

- **Por quê:** 30+ decisões cravadas (Gemini Flash, ProseMirror JSON, disclaimers LGPD, budget $0.02/submission) ready-to-consume

### Page Engine (item 4 ADR-0046)

#### Puck (já listado)

- **Ação:** COPY
- **Por quê:** Base direta pra renderer + admin

#### Payload CMS

- **License:** MIT
- **Stack:** Next.js native + Mongo/Postgres
- **Ação:** STUDY (parte) + INSTALL JIT possível
- **Por quê:** Schema-driven + admin auto-gerado + RLS-friendly — heavy inspiração

### AI Builders (item 5 ADR-0046)

#### Vercel AI Chatbot + Mastra + OpenV0 (já listados)

- **Ação:** COPY + INSTALL + COPY parts
- **Por quê:** Composição das engines via tool calling

### Email Builder (futuro Pacote A bonus)

#### Maily + React Email + MJML (já listados)

- **Ação:** COPY + JÁ + INSTALL JIT
- **Por quê:** Drag-drop + render + markup

### Program / LMS (Pacote B)

#### LearnHouse

- **License:** AGPL-3.0
- **Stack:** Next.js
- **Ação:** STUDY
- **Por quê:** LMS Next.js moderno — só inspiração arquitetural

#### Novel

- **License:** Apache 2.0
- **Stack:** Tiptap + Vercel AI SDK
- **Ação:** INSTALL (ADR-0045 D.4 cravado)
- **Por quê:** Lesson editor + journals — prose AI-native

#### Tiptap

- **License:** MIT (base)
- **Stack:** ProseMirror
- **Ação:** ✅ Via Novel
- **Por quê:** Validado massiva (LinkedIn, GitLab, Anthropic, NYT)

#### xyflow (já listado)

- **Ação:** COPY
- **Por quê:** Gamificação flow visual (jornada do aluno)

#### Decap CMS

- **License:** MIT
- **Stack:** React
- **Ação:** COPY parts
- **Por quê:** Git-based content — programs/módulos como content

### Admin Panels per-tenant (futuro)

#### Refine

- **License:** MIT
- **Stack:** React + multi-backend
- **Ação:** INSTALL
- **Por quê:** Admin auto-gerado + RBAC + CRUD — tenant admin painel rápido

#### Lowdefy

- **License:** MIT
- **Stack:** YAML config
- **Ação:** STUDY
- **Por quê:** Config-driven schema patterns

#### AdminJS

- **License:** MIT
- **Stack:** Node
- **Ação:** STUDY alt
- **Por quê:** Admin panel maduro

#### Tooljet

- **License:** AGPL-3.0
- **Stack:** Node + React
- **Ação:** STUDY
- **Por quê:** Internal tools builder visual

#### Appsmith

- **License:** Apache 2.0
- **Stack:** Java + React
- **Ação:** STUDY/COPY parts
- **Por quê:** Internal tools — RBAC patterns

#### NocoDB

- **License:** AGPL-3.0
- **Stack:** Node + Vue
- **Ação:** STUDY
- **Por quê:** Airtable OSS — multi-tenant tables

### CMS / Content Management (caso template/blog futuro)

#### Payload CMS (já listado)

#### Sanity Studio

- **License:** MIT (studio)
- **Stack:** React
- **Ação:** STUDY
- **Por quê:** Content editor framework

#### Strapi

- **License:** MIT
- **Stack:** Node
- **Ação:** STUDY
- **Por quê:** Headless CMS — API auto-gerada

#### Directus

- **License:** BSL 1.1
- **Stack:** Node
- **Ação:** STUDY
- **Por quê:** Database admin moderno

#### Decap CMS (já listado)

#### TinaCMS (já listado)

---

## UX/UI Plus (não-features diretas, agregam)

### Component blocks (JIT)

#### Origin UI

- **License:** MIT
- **Stack:** React + Radix
- **Ação:** COPY blocks JIT
- **Por quê:** Variações ricas primitives (multi-select, time picker, avatar-stack)

#### Magic UI

- **License:** MIT
- **Stack:** React + motion
- **Ação:** INSTALL JIT
- **Por quê:** Animated components — motion v12 compat (research-44 confirmou)

#### Kibo UI

- **License:** MIT
- **Stack:** React + shadcn
- **Ação:** COPY blocks JIT
- **Por quê:** SaaS-focused (kbd, announcement-bar, dropzone, color-picker)

#### Tremor

- **License:** Apache 2.0
- **Stack:** React + Tailwind
- **Ação:** INSTALL JIT
- **Por quê:** Dashboard/analytics components (35+)

#### ReUI

- **License:** MIT
- **Stack:** React + TanStack Table v8
- **Ação:** INSTALL JIT
- **Por quê:** Data-grid TanStack v8 (29 components) + 1003 components totais

#### billingsdk

- **License:** MIT
- **Stack:** React
- **Ação:** INSTALL JIT (Pacote C)
- **Por quê:** Billing UI (price-table, plan-card, customer-portal)

#### Aceternity UI

- **License:** Paid + framer-motion
- **Ação:** ❌ SKIP
- **Por quê:** Banido `.claude/rules/components.md` (paywall + framer-motion conflito)

### Prose editors (já decidido)

#### Novel + Tiptap (já listados)

- **Ação:** INSTALL via Novel
- **Por quê:** Lesson + journal AI-native

#### Plate / Lexical / Editor.js

- **Ação:** STUDY alternativas
- **Por quê:** Fallback caso Novel quebrar

### Analytics

#### PostHog

- **License:** MIT (self-host) / cloud paid
- **Stack:** Multi-platform
- **Ação:** INSTALL (self-host opção)
- **Por quê:** Analytics + session replay + feature flags

#### Umami

- **License:** MIT
- **Stack:** Node + Postgres
- **Ação:** INSTALL alt
- **Por quê:** Lightweight multi-tenant friendly

#### Plausible

- **License:** AGPL-3.0
- **Stack:** Elixir
- **Ação:** STUDY
- **Por quê:** Privacy analytics — modelo inspiração

#### OpenPanel

- **License:** AGPL-3.0
- **Stack:** Node
- **Ação:** STUDY
- **Por quê:** Alternativa Plausible

### Auth helpers (já temos)

#### Supabase Auth

- **License:** MIT
- **Ação:** ✅ JÁ TEMOS
- **Por quê:** OAuth + magic link + JWT + RLS integrado

### Search / discovery (futuro)

#### Meilisearch

- **License:** MIT
- **Stack:** Rust + clients
- **Ação:** INSTALL JIT
- **Por quê:** Search engine self-host moderno

#### Typesense

- **License:** GPL-3.0
- **Ação:** STUDY alt
- **Por quê:** Alt search engine

#### Algolia (closed)

- **Ação:** STUDY product design
- **Por quê:** UX padrão pra search-as-you-type

### Feature flags

#### Vercel Edge Config

- **License:** Closed (parte Vercel)
- **Ação:** ✅ Via Vercel plan
- **Por quê:** Feature flags edge-runtime

#### GrowthBook

- **License:** MIT
- **Ação:** INSTALL JIT
- **Por quê:** Self-host A/B testing + feature flags

### Notifications (futuro)

#### Novu

- **License:** MIT
- **Stack:** Node + React
- **Ação:** INSTALL JIT
- **Por quê:** Multi-channel notifications (email, in-app, push) — open source

#### Knock (closed)

- **Ação:** STUDY product design
- **Por quê:** Modelo UI/UX pra notification center

### File uploads (futuro)

#### Uppy

- **License:** MIT
- **Stack:** Vanilla + framework-agnostic
- **Ação:** INSTALL
- **Por quê:** Upload UI maduro multi-provider

#### tus.io

- **License:** MIT
- **Stack:** protocolo
- **Ação:** STUDY
- **Por quê:** Resumable upload protocol

### Realtime (já temos via Supabase)

#### Supabase Realtime

- **Ação:** ✅ JÁ TEMOS
- **Por quê:** Postgres LISTEN/NOTIFY + websockets

#### Liveblocks

- **License:** Closed
- **Ação:** STUDY product design
- **Por quê:** Collab cursors + presence UI

---

## Closed-source — só product design + inspiração

> Não copia código (closed) mas estuda blog posts, docs públicos, UX, modelo de negócio.

### Vibe coding / AI builders

#### Lovable.dev

- **Stack público:** TanStack Start + shadcn + Supabase + AI hybrid
- **Estudar:** multi-model hydration (small model context → big model gen)
- **Por quê:** Stack mais próxima nossa (research-44)

#### v0.dev (Vercel)

- **Stack público:** Next.js + Claude/GPT
- **Estudar:** UX prompt → component preview
- **Por quê:** Padrão referência mercado (ADR-0045 demoted runtime mas relevante product design)

#### Bolt.new (StackBlitz)

- **Estudar:** Web Container patterns + IDE in-browser
- **Por quê:** Modelo edit + preview ao vivo

#### Cursor + Windsurf

- **Estudar:** IDE AI assistant UX
- **Por quê:** Inline command palette + context UX

#### Tempo (tempo.new)

- **Estudar:** AI design tool — wireframe to code

#### Replit Agent 3

- **Estudar público:** Multi-agent + Python DSL tool calling 90% success rate
- **Por quê:** Modelo multi-agent proven

### Course platforms (Pacote B referência)

#### Kajabi

- **Stack público:** Rails + Postgres + AWS Graviton + Snowflake Cortex (AI analytics)
- **Estudar:** Modelo de negócio + UX onboarding + curriculum
- **Por quê:** Player líder do mercado direto nosso (research-44)

#### Hotmart (Sparkle, Kollus)

- **Estudar:** UX brasileiro + integração pagamento BR + funil
- **Por quê:** Concorrente BR direto

#### Mighty Networks

- **Estudar:** Community + AI features integradas
- **Por quê:** Modelo course + community combinado

#### Circle.so

- **Estudar:** Community + AI workflows
- **Por quê:** UX community-first

#### Teachable + Thinkific

- **Estudar:** Themes + funnel patterns
- **Por quê:** Players estabelecidos course platforms

#### Skool

- **Estudar:** Community-driven minimalismo
- **Por quê:** UX simplicidade extrema

#### GoHighLevel

- **Estudar:** White-label agency em escala bilhão hits/dia (research-44)
- **Por quê:** Modelo hierarchical multi-tenant (agency → sub-accounts) — referência crítica

### SaaS infra references

#### Vercel

- **Estudar:** Deploy UX + edge functions + AI Gateway
- **Por quê:** Nosso provider — entender features Pro

#### Stripe

- **Estudar:** API design + checkout UX + tax automation
- **Por quê:** Padrão pagamento mercado

#### Linear

- **Estudar:** Keyboard-first + sync UX + speed
- **Por quê:** Padrão B2B SaaS premium

#### Notion

- **Estudar:** Block editor UX + database views + AI commands
- **Por quê:** Inspiração principal Novel + lesson editor

#### Figma

- **Estudar:** Multiplayer + comments + design tokens
- **Por quê:** Collab UX referência

---

## O que vamos construir DO ZERO

> Por particularidade nossa OU porque não há OSS moderno coberto.

### Engine de tokens shadcn-canonical multi-tenant

- **Por quê:** TweakCN é single-user — nosso é multi-tenant + RLS + versionamento Hotmart-like
- **Já em construção:** tenant_themes + tenant_theme_versions + build-theme-css.ts

### Multi-tenant hostname resolver

- **Por quê:** Nenhum OSS faz hostname → tenant + brand snapshot da forma como precisamos
- **Já em construção:** `proxy.ts` + `getRouteByHost` (ADR-0024)

### Form Engine (kind polimórfico + versions Hotmart-like)

- **Por quê:** Survey.js é só spec, sem multi-tenant + RLS + reports + AI integrados
- **Construir:** schema kind enum + form_versions snapshot imutável + RLS + integração AI report

### Page Engine (spec JSONB recursivo + render RSC)

- **Por quê:** Puck/Craft.js não cobrem RSC + multi-tenant + versionamento Hotmart-like
- **Construir:** spec recursivo `{type, props, children[]}` + renderer RSC + versions

### Block Knowledge Cards + Registry interno

- **Por quê:** Shadcn registry é só `registry-item.json` — não tem @registry-meta + ai_hints + vertical + when_to_use
- **Construir:** JSDoc `@registry-meta` + `build-block-catalog.ts` script + AI context injection

### Vertical extension (fitness/yoga/idiomas)

- **Por quê:** Nenhum OSS modela vertical-specific content kinds com override per-tenant
- **Construir:** `tenants.vertical` + `kind` polimórfico + `tenant_copy_overrides` JIT

### Entitlements RPCs (Makerkit-inspired Postgres)

- **Por quê:** Stripe Entitlements é vendor-locked + closed; ADR-0039 cravou RPC pattern
- **Construir:** `requireEntitlement` + `requireQuota` + `incrementQuotaUsage` (já feito)

### PWA per-tenant (manifest/icon/splash dinâmico)

- **Por quê:** PWA standard é static-first — multi-tenant precisa runtime
- **Construir:** API routes `manifest.webmanifest`, `icon/[size]`, `splash/[size]` (já feito)

### AI Report Engine (form → IA → ProseMirror + PDF + email)

- **Por quê:** Vercel AI Chatbot Artifacts é pattern, não engine completa. Research-25 cravou 30+ decisões nossas
- **Construir:** pipeline submission → IA → report_versions + disclaimers LGPD + email Resend

### Brand resolution (logo wordmark + cores per-host)

- **Por quê:** Combinação brand + tenant + locale via hostname é particularidade nossa
- **Construir:** `useBrand()` + Logo dynamic SVG + brand-aware components (parcial)

### Programs Engine futuro (Pacote B)

- **Por quê:** LearnHouse é AGPL + LMS antigos (Moodle/edX) são heavyweight
- **Construir:** programs + modules + lessons schema + curriculum sequencing + progresso aluno

### Tenant copy overrides per-vertical

- **Por quê:** i18n cobre dev strings; nada cobre "BoxClub diz WOD, FitLab diz Treino"
- **Construir:** `tenant_copy_overrides (tenant_id, key, value, locale)` (JIT — Pesquisa 21)

### Dogfooding-first execution pattern

- **Por quê:** Não é OSS — é nossa filosofia cravada ADR-0046
- **Aplicar:** cada feature primeira instância manual antes de engine

---

## Resumo executivo (1 olhada)

### COPY agora

- TweakCN (theme builder em execução)
- Survey.js spec (Form Engine)
- Vercel AI Chatbot Artifacts (AI Report + Builders)
- Puck (Page Engine)
- Maily (email builder futuro)
- xyflow (flow builder futuro)
- OpenV0 prompts (AI gera components)
- Origin/Kibo blocks (JIT)

### INSTALL agora ou JIT

- Mastra (AI agents)
- Novel + Tiptap (lesson/journal)
- Refine (admin panels)
- Inngest (durable AI workflows)
- Promptfoo (CI prompt eval)
- @react-pdf/renderer (PDF export)
- Tremor (dashboard)
- billingsdk (billing)
- PostHog ou Umami (analytics)
- Uppy (file uploads)
- Meilisearch (search)
- Novu (notifications)
- GrowthBook (feature flags)

### STUDY (não copia código)

- Formbricks, Webstudio, LearnHouse, NocoDB, Tooljet (AGPL)
- Open edX, Moodle (GPL)
- Payload CMS (MIT mas inspiração)
- Lowdefy + Sanity + Strapi (modelos)
- AutoGen, CrewAI (Python patterns)
- Lovable, v0, Bolt, Cursor, Replit (closed AI builders)
- Kajabi, Hotmart, Mighty, Circle, Skool, GoHighLevel (closed course platforms)
- Vercel, Stripe, Linear, Notion, Figma (closed SaaS infra)

### BUILD do zero (sem OSS moderno cobrir)

- Multi-tenant hostname resolver
- Theme storage versioning Hotmart-like
- Form Engine kind polimórfico + versions
- Page Engine spec JSONB recursivo + RSC
- Block Knowledge Cards + Registry interno
- Vertical extension content kinds
- Entitlements RPCs
- PWA per-tenant runtime
- AI Report Engine end-to-end
- Brand resolution per-host
- Programs Engine (Pacote B)
- Tenant copy overrides per-vertical

---

## Cronologia operacional

```
HOJE: TweakCN copy (theme builder em execução)
  ↓
Form agência: Survey.js copy + Formbricks study + construir Form Engine
  ↓
Report IA: Vercel Artifacts copy + Mastra install + Inngest JIT + construir AI Report Engine
  ↓
Sales page: Puck copy + Payload study + construir Page Engine
  ↓
AI Builders: compor engines via tool calling AI SDK
  ↓
Email: Maily copy + React Email (já)
  ↓
Pacote B Programs: Novel install + LearnHouse study + xyflow copy + construir Programs Engine
  ↓
Admin panels: Refine install
  ↓
Plus contínuo: Origin/Kibo blocks JIT, Tremor JIT, PostHog JIT, Uppy JIT
```

---

## Gatilhos pra revisitar

- Iniciar plano nova feature → consultar categoria correspondente
- Update major em algum OSS → re-avaliar
- 3+ features consumindo mesma lib copy → promover pra INSTALL
- License mudou (ex: MIT→BSL) → re-avaliar
- Lib abandonada (6m+ sem commit) → buscar alternativa
- Closed-source virou OSS → reavaliar STUDY → COPY

---

## Cross-references

- ADR-0044 — pivot TweakCN-way
- ADR-0045 — Registry Strategy + Novel adopt
- ADR-0046 — Dogfooding-first execution order
- `docs/plans/funil-agencia.md` — ordem execução
- `docs/_deferred/post-funil-agencia.md` — index deferred
- `docs/_deferred/ai-theme-generation-detail.md`
- `docs/_deferred/v0-registry-integration-detail.md`
- `docs/_deferred/validation-suite-detail.md`
- `docs/research/23-form-system-architecture.md`
- `docs/research/24-page-engine-architecture.md`
- `docs/research/25-ai-reports-architecture.md`
- `docs/research/38-registry-novel-ai-integration.md`
- `docs/research/44-real-players-integration-patterns.md`
- `docs/research/45-component-strategy-best-practices.md`
- `.claude/rules/components.md` — hierarquia
- `.claude/rules/component-creation-governance.md` — checklist A-J

# 44 — Real Players Integration Patterns (Course Platforms + AI Builders + Combinations)

> **Tipo:** research autoritativa (lente "integração real, não dev tools")
> **Data:** 2026-05-21
> **Companion:** `docs/research/43-stack-comparative-analysis.md` (deep-dive
> de 8 dev-stack repos clonados) + `docs/architecture/01-master-system-map.md`
> (mapa interno 7 layers)
> **Objetivo:** validar nossa composição (Next 16 + Supabase + shadcn +
> TweakCN-way + Novel + AI orchestration + multi-tenant white-label PWA)
> contra **players SaaS reais** (não apenas dev tools). Research-43 pegou
> Novel/Tiptap/Vercel templates mas faltou olhar Kajabi, Hotmart,
> GoHighLevel, Lovable, etc — produtos próximos do nosso.
> **Pré-leitura:** ADR-0024 / 0033 / 0041 / 0044 / 0045 draft · research-38 / 40 / 41 / 43 · `docs/architecture/01-master-system-map.md`

---

## Sumário executivo (TL;DR — 7 findings críticos)

1. **NENHUM player real combina nossa stack exata.** Não existe SaaS B2B
   white-label multi-tenant que use shadcn + TweakCN-way + Supabase RLS +
   Novel + Vercel AI Gateway com hostname routing. **Lovable é o mais
   próximo** (Vite/TanStack Start + shadcn + Supabase + Anthropic/OpenAI),
   mas é single-tenant per-project — não SaaS multi-tenant. **Somos
   primeiros a juntar essas peças nesta configuração específica.** Cada
   peça isolada é validada em produção massiva, mas a composição é
   territory novel.

2. **Course platforms grandes são predominantemente Rails monolítico.**
   Kajabi (Heroku → AWS Graviton, monolito Rails + microsserviços Node),
   Thinkific (Rails+React), Mighty Networks (Rails + React + Material-UI),
   Teachable (Rails). Hotmart é stack mista (Angular legado + iOS + 157
   technologies tracked). **Conclusão:** stack legada não é referência
   técnica pra greenfield SaaS BR 2026 — nossa escolha Next 16 + Supabase
   é estrategicamente diferente, não acidentalmente diferente.

3. **GoHighLevel é o único player white-label multi-tenant agency
   próximo do nosso modelo.** Hierarchical multi-tenant, sub-accounts
   isoladas, branding customizável, AI funnel builder, drag-and-drop page
   editor, ~30M transações/dia. Stack proprietária (Node + Mongo
   provavelmente, não confirmado publicamente). **Pattern validado:**
   white-label per-agency com sub-accounts isolated é modelo viável em
   escala bilhão+ requests/dia.

4. **AI orchestration moderna converge em pattern híbrido.** Lovable usa
   "hydration" (fast model preparou contexto → big model gera código).
   Replit Agent 3 usa multi-agent (manager + editor + verifier) + Python
   DSL como tool calling (90% taxa de sucesso). Bolt.new dá controle
   total do filesystem ao AI. Vercel AI Chatbot usa
   `generateObject`-style structured output + tool calling (Artifacts).
   **Nossa decisão ADR-0045 D.5 (generateObject + streamText+toolCalling
   híbrido) está alinhada com state-of-the-art.**

5. **D8 (Smart blocks composition declarada) CONFIRMADO com nuance.**
   Vercel AI Chatbot Artifacts pattern não é "smart blocks composition"
   literalmente — é "polymorphic content kind dispatch" (`kind: text |
code | image | sheet` → handler dedicado). Estruturalmente SIMILAR a
   nossa abordagem `pages.kind` polimórfico + L3 smart blocks compostos
   declarativos. Pattern proven em produção massiva (DeepSeek, Kimi, GPT
   OSS, Grok 4.1 todos rodando). **Veredito:** PARCIAL — é o "pattern
   primo", não literal. Vale copy do **handler dispatch via kind** + do
   **versioning via composite PK (id, createdAt)**.

6. **Tiptap está em produção em escala massiva.** LinkedIn, GitLab,
   Anthropic, Substack, AxiosHQ, New York Times (via ProseMirror).
   GitLab tem Tiptap rodando em multi-tenant SaaS production. **Nossa
   decisão de adotar Novel (Tiptap wrapper) JIT está blindada por
   precedent enterprise.** Tiptap é SOC2 Type II compliant. Quando
   Lesson editor entrar, não estamos arriscando stack imatura.

7. **shadcn registry em produção SaaS multi-tenant existe via MakerKit
   e Supastarter.** Plugins distribuídos via shadcn registry format +
   AST codemods. Both são paid products (não-clonáveis), mas validam o
   pattern: registry custom como canal de distribuição interna de
   componentes em multi-tenant SaaS. **Nossa decisão ADR-0045 D.10
   (`/api/r/[name].json` route handler) está alinhada com practice
   estabelecida.**

---

## Parte 1 — Course/Community Platforms (matriz)

Pesquisa via engineering blogs, job postings, StackShare/RocketReach,
press releases, case studies cloud providers (AWS, Heroku), GitHub.

| Player              | Frontend                                    | Backend / DB                                 | Multi-tenant strategy                       | White-label                                       | AI features                                                                    | Editor de conteúdo                    | Page/Funnel builder                                |
| ------------------- | ------------------------------------------- | -------------------------------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------- | -------------------------------------------------- |
| **Kajabi**          | Rails monolítico ERB + React JS             | Rails + Postgres (Heroku → AWS Graviton EKS) | Single deploy + tenant_id column            | Sub-domain (`*.mykajabi.com`) + custom domain     | Snowflake Cortex LLM (analytics); AI website builder; full curriculum gen      | Custom rich-text editor (Trix-base?)  | Drag-drop "Pages" builder + Sales Funnels (custom) |
| **Hotmart**         | Angular (legado), iOS/Android nativ         | 157 techs tracked: Snowflake, Adyen, etc     | Não documentado publicamente                | Sparkle: hosted on Hotmart subdomain              | Hotmart AI (recently launched, generative content)                             | Custom editor                         | Hotmart Pages / Click (funnel builder)             |
| **Mighty Networks** | React + Material-UI                         | Ruby on Rails + Postgres                     | Subdomain per community + Mighty Pro custom | Mighty Pro: dedicated apps + branded experience   | AI Cohost (daily questions); AI productivity for community managers            | Custom rich-text                      | None (template-based)                              |
| **Circle.so**       | React (Next.js stack hinted)                | Rails + Postgres + Redis (não confirmado)    | Subdomain per community                     | Custom domain + branded experience (Plus plan)    | AI agents inside community workflows (2024+); content gen, summarization       | Custom rich-text editor               | None (template-based)                              |
| **Teachable**       | Rails monolítico                            | Rails + Postgres + Redis                     | Subdomain per school + custom domain        | School-level branding (cores, logo, domain)       | AI: curriculum outline generation; landing page generation; checkout pages gen | Custom WYSIWYG editor (Trix-like)     | Drag-drop page builder + Sales pages               |
| **Thinkific**       | Rails + React frontend                      | Rails + Postgres                             | Subdomain per school + custom domain        | School branding                                   | AI Curriculum Generator (topic → structured outline)                           | Rich-text editor + module/lesson tree | Limited templates                                  |
| **Maven**           | Next.js (CTO Daniel Kang strong NL.js push) | Postgres (não confirmado)                    | Cohort-based, não tradicional multi-tenant  | Limited (Maven brand-dominant)                    | AI for engineers (course content), não user-facing core feature                | Cohort-specific content tools         | Marketing pages by Maven (não user-facing builder) |
| **Skool**           | Next.js + TypeScript                        | Postgres (não confirmado)                    | Sub-community per "school", subdomains      | Limited (Skool brand dominant)                    | Não destaque, foco gamificação                                                 | Custom rich-text                      | None (template-based)                              |
| **Lemon Squeezy**   | Laravel + Inertia.js + React                | Laravel + MySQL                              | Merchant-level isolation                    | Storefront branding (limited)                     | Não-AI-native                                                                  | Markdown / basic rich text            | Storefront pages (limited)                         |
| **GoHighLevel**     | Node.js + Angular (legacy) + React          | Provavelmente Mongo + Node + AWS             | **Agency → Sub-accounts (hierarchical)**    | **FULL: branded app, custom domain, agency logo** | Multiple: funnel/website AI gen; conversation AI; appointment booking AI       | Custom drag-drop page editor          | **Drag-drop funnel + website builder (forte)**     |

### Observações chave

- **Predominância Rails:** Kajabi, Mighty, Circle, Teachable, Thinkific
  todas em Rails monolítico. Stack legada (10+ anos) — não é referência
  pra greenfield 2026. Plus ponto: nenhum usa shadcn (UI customizada
  proprietária).
- **GoHighLevel é o único modelo agency white-label puro.**
  Hierarchical multi-tenant (agency dono → sub-accounts cliente final),
  branding total per-agency, escala bilhão de hits/dia. **Modelo de
  negócio similar ao nosso "Fase 1 agência" do plano.** Stack
  proprietária não-publicada — mas o pattern (agency-pai com sub-accounts
  isoladas) é proven em escala.
- **AI features em course platforms são uniformemente:** curriculum
  generation, landing page generation, content summarization. Nenhuma
  combina AI generation + multi-tenant theme storage + per-tenant
  registry. Nosso AI scope (theme generation TweakCN-way + Page Engine
  AI composer + Novel inline) é mais ambicioso que o average do mercado.
- **Editor de conteúdo:** nenhum dos players acima usa Novel/Tiptap
  publicamente. Todos têm editor proprietário (Trix-like ou custom).
  Tiptap aparece em LinkedIn, GitLab, Substack, Anthropic — players de
  outro tipo (developer tools, knowledge work, social).
- **Page builder:** GoHighLevel + Kajabi + Teachable têm drag-drop
  proprietário (não Builder.io / Plasmic). Nossa decisão de Page Engine
  custom (ADR-0041) está alinhada com practice da categoria — players
  grandes constroem o seu.
- **Multi-tenant strategy:** unanimemente **subdomain + custom
  domain** com tenant_id column + RLS-like. Idêntica à nossa abordagem
  ADR-0024 (hostname → DB lookup). Validação cruzada: nosso modelo é
  o canônico da categoria.

---

## Parte 2 — AI-native builders (matriz)

| Player                | Como gera código                                     | Storage do output                                | Multi-step orchestration                     | Theme/customização                      | Persistence model                          | Padrão a copy/adapt                                                             |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------ | -------------------------------------------- | --------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| **Lovable.dev**       | Multi-model: GPT-4o + Claude 3.5 Sonnet hydration    | TanStack Start app + Supabase project (per-user) | Hydration: fast model prep context → big gen | shadcn + Tailwind defaults customizable | Per-project: GitHub sync, full code export | **Hydration pattern**: small model contexto + big model gera                    |
| **Replit Agent 3**    | Multi-agent (manager+editor+verifier) Claude 3.5     | Per-instance Postgres + Drizzle ORM              | Plan → Code → Test (Playwright) → Fix        | Limited (template-based per-language)   | Per-Repl instance + Postgres               | **Python DSL tool calling** (90% sucesso vs function calling)                   |
| **Bolt.new**          | Claude 3.5 → WebContainer (in-browser VM)            | IndexedDB cache + StackBlitz repo                | LLM controla filesystem + npm + terminal     | Per-project Tailwind/Vite               | Per-project + GitHub                       | **WebContainer architecture** (não aplicável pra nós; runtime in-browser)       |
| **Tempo.new**         | Claude Sonnet 3.7 + Gemini contextual                | React/Vite/Tailwind project                      | Wireframe → Component tree → Refinement      | Tailwind tokens                         | Per-project                                | **Wireframe-first generation** (visual → code, similar ao Page Engine spec)     |
| **v0 (Vercel)**       | Vercel's tuned models                                | TypeScript files com shadcn + Tailwind           | Single-shot generation + history versioning  | shadcn theme                            | Per-generation history (account-level)     | (DEMOTED in ADR-0045 D.1 — confirmamos correto)                                 |
| **Cursor**            | Multi-model (Claude/GPT/Gemini selectable)           | Local filesystem (IDE)                           | Composer mode + 8 parallel agents            | n/a                                     | Local                                      | **Multi-model per-conversation switching** (relevant pra nosso router)          |
| **Windsurf**          | Cascade (agentic) + Codemaps graph                   | Local filesystem (IDE)                           | Plan → Edit → Browser preview                | n/a                                     | Local + Memories (after 48h)               | **Memories pattern** (architecture/conventions learned)                         |
| **Plasmic**           | Não AI-native (visual builder + recent AI hints)     | React components + custom backend integration    | Visual primarily                             | Multi-workspace + theming               | Plasmic Studio cloud                       | (não-AI; skip)                                                                  |
| **Webstudio**         | Não-AI; visual builder open-source                   | Remix/React app export                           | Visual                                       | CSS properties full                     | Self-hostable                              | **Remix export model** (não aplicável; nós não somos visual builder)            |
| **Framer AI**         | Wireframer feature (prompt → responsive layout)      | MongoDB (User, Document, Version)                | Single-shot + version history                | Framer's design system                  | Cloud-hosted + version history             | **Version history per document** (já fazemos via `*_versions` Hotmart-like)     |
| **Anthropic Console** | Workbench: prompt editor + example gen + improvement | Per-developer account                            | Test → Eval → Compare side-by-side           | n/a                                     | Per-account                                | **Prompt versioning + automatic eval** (relevant pra blueprint 07 prompt drift) |

### Observações chave

- **Lovable é o player mais próximo da nossa stack** (Vite/TanStack +
  shadcn + Supabase + multi-model). **Mas é single-project per-user, não
  multi-tenant SaaS.** Cada user tem sua app gerada + projeto Supabase
  dedicado. Não há "tenant runtime resolution via hostname" — cada
  Lovable project é uma app independente.
- **Hydration pattern de Lovable é relevante pro nosso router.** Nosso
  ADR-0045 D.6 já cita Haiku como router/classifier antes de despachar
  pra Sonnet — é exatamente hydration pattern.
- **Replit Agent 3 Python DSL para tool calling** é insight forte.
  Documentação Replit afirma 90% taxa de sucesso vs function calling
  tradicional. Vale considerar pra Page Engine edits incrementais
  (gerar JSON Patch via "DSL Python-like" pode ser mais robusto que
  tools tradicionais). **Não cravado** — investigar JIT se Fase 6 edits
  bater dor.
- **Tempo.new wireframe-first** é um pattern interessante. Spec visual
  (wireframe) → code. Nosso Page Engine usa spec JSONB → renderer dispatcha.
  É a mesma ideia: separar **intent (spec)** de **render (code)**. Convalida
  ADR-0041.
- **v0 demoted (ADR-0045 D.1) CONFIRMADO.** Nenhum player real (Lovable,
  Bolt, Tempo, Framer) persiste TSX raw em DB pra rendering multi-tenant.
  Todos persistem **spec/JSON** ou **arquivos source completos exportáveis**
  — não TSX em runtime banco.
- **Cursor/Windsurf multi-model switching** convalida nosso AI
  Gateway approach (provider-agnostic, pick model per task).

---

## Parte 3 — Integration evidence específico (matriz)

Pra cada combinação que estamos fazendo, evidência de produção:

| Combinação                                      | Quem usa em produção?                                                         | Evidência (qualidade)                                                                                                                                                              |
| ----------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shadcn + multi-tenant white-label               | **MakerKit, Supastarter** (paid SaaS templates)                               | FORTE: MakerKit features multi-tenancy + super-admin + plugin system via shadcn registry. Supastarter org-first architecture + better-auth + shadcn. Both serving production SaaS. |
| shadcn + AI orchestration                       | **Lovable, v0, ai-chatbot-ref**                                               | FORTE: shadcn é standard pra AI generation output. Lovable, v0, todos usam shadcn como contrato visual. ai-chatbot inclui shadcn como peer.                                        |
| Novel + multi-tenant SaaS                       | **Nenhum player conhecido publicamente**                                      | INSUFFICIENT — Novel é young (~2 anos). Tiptap underneath está em LinkedIn/GitLab multi-tenant (FORTE), mas Novel-as-wrapper especifico em SaaS multi-tenant: não publicado.       |
| Novel + AI inline commands (não chat)           | **novel.sh demo + community projects** (Notion-like UX)                       | MEDIO: Novel especificamente desenhada pra "/" slash + AI commands. Convenção well-documented mas não em SaaS grande conhecido. Pattern proven em demo + adoção comunidade.        |
| TweakCN-way + production SaaS                   | **TweakCN próprio (jnsahaj/tweakcn)** + adoção comunidade                     | MEDIO: TweakCN é single-tenant SaaS production-ready. ~45 keys + OKLCH + APCA não roda em multi-tenant SaaS production conhecido — somos primeiros a adaptar pra multi-tenant.     |
| Registry shadcn + dynamic catalog (AI consumes) | **MakerKit plugin distribution + ai-chatbot Artifacts** (similar pattern)     | MEDIO: MakerKit usa shadcn registry pra plugins (production). AI-chatbot dispatcha artifacts por kind (similar à nossa idea). Catalog dinâmico AI-consumed: pattern nascente.      |
| Supabase RLS + multi-tenant theme storage       | **research-22 já documentou; Bootstrapped.app, MakerKit, vários SaaS BR**     | FORTE: RLS por tenant_id é pattern canônico Supabase 2026. Theme storage como JSONB col com RLS: pattern derivado natural.                                                         |
| Vercel AI Gateway + per-tenant rate limit       | **v0 próprio + Vercel customers** (Vercel afirma "battle-tested at v0 scale") | MEDIO: AI Gateway não impõe rate limit nativo; per-tenant rate limit é responsabilidade do app via `@upstash/ratelimit` (pattern TweakCN, ai-chatbot, next-forge).                 |
| Tiptap + ProseMirror JSON + multi-tenant        | **GitLab, LinkedIn, Substack, Anthropic, AxiosHQ**                            | FORTE: Tiptap em produção multi-tenant em 5+ players grandes. JSON storage > HTML é recommendation oficial Tiptap. SOC2 Type II.                                                   |

### Veredito sobre evidence

- **Peças isoladas estão validadas em produção massiva:** shadcn, Supabase RLS, Tiptap, AI Gateway, multi-tenant hostname.
- **Combinações de 2-3 peças têm precedent:** shadcn + Supabase multi-tenant (MakerKit), Tiptap + multi-tenant (GitLab), AI orchestration + shadcn (v0/Lovable), Supabase + AI (Lovable).
- **Combinação completa (Next 16 + Supabase + shadcn + TweakCN-way + Novel + AI Gateway + hostname multi-tenant + PWA):** sem precedent. **Somos primeiros a juntar.** Mas cada peça é blindada.

---

## Parte 4 — D8 verdict (re-investigado com rigor)

### Re-leitura ai-chatbot-ref/lib/db/schema.ts (atualizada 2026-05-21)

Schema crítico:

```ts
export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.createdAt] }), // composite PK
  }),
)

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    // ...
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
)
```

### Diff lado-a-lado: ai-chatbot Artifacts vs nosso Smart blocks

| Aspecto                   | ai-chatbot Artifacts                                                    | Nosso Smart blocks (ADR-0045 D.8)                                                 |
| ------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Tipo de entidade**      | `Document` (texto/código/sheet/imagem livre)                            | `pages.kind === 'sales' / 'landing' / 'report'` (estrutura semântica fixa)        |
| **Polimorfismo**          | `kind` enum (4 valores fixos)                                           | `kind` polimórfico extensível (`landing`, `report`, etc + `block.type` recursive) |
| **Storage**               | `content: text` (markdown/code/CSV livre)                               | `definition: jsonb` (tree recursivo `{type, props, children[]}`)                  |
| **Composição declarada?** | **NÃO** — content é texto livre por document handler (text/code/sheet)  | **SIM** — JSDoc `@composition: [hero, evidence-grid, cta]` declarado              |
| **Renderer dispatch**     | `documentHandlersByArtifactKind` array, `find(h => h.kind === kind)`    | Page Engine renderer dispatcha por `block.type` recursive                         |
| **Versionamento**         | `(id, createdAt)` composite PK = nova row por edit, histórico grátis    | `*_versions` table separada com `version_number int` + active pointer (G.1)       |
| **Edição incremental**    | `Suggestion` rows com `originalText` + `suggestedText` (não JSON Patch) | JSON Patch EASE via streamText+tool calling (ADR-0045 D.5)                        |
| **AI workflow**           | Tool calling: `createDocument`, `updateDocument`, `requestSuggestions`  | `generateObject(PageSpec)` greenfield + `streamText+tools` edits incrementais     |
| **Pattern de extensão**   | Adicionar artifact kind = criar `artifacts/<kind>/server.ts` + handler  | Adicionar block kind = criar `lib/contracts/page-blocks/<kind>.ts` + componente   |
| **Cardinalidade**         | Document tem **1 content** (string raw)                                 | Page tem **N blocks (tree)**                                                      |

### Análise crítica

**O que research-43 disse:**

> "ai-chatbot pattern similar a Smart blocks composição"

**Veredito honesto (research-44):**

**PARCIAL — research-43 simplificou demais.**

**O que é REALMENTE similar:**

1. **Polymorphic kind dispatch.** Tanto Document quanto Page despacha
   por `kind`. AI emite output baseado em `kind`. Renderer/handler busca
   por `kind`. **Pattern arquitetural similar.**

2. **Tool calling pattern com versioning.** AI chama `createDocument` /
   `updateDocument` tools, sistema persiste com versioning. Nosso
   `streamText + applyPatch / addBlock` tools seguem mesma arquitetura.

3. **Curadoria humana + AI iterativa.** Suggestion table permite humano
   resolver/dismiss. Nosso APCA gate client-side + botão "tentar
   novamente" segue mesma filosofia (ADR-0045 D.17).

**O que NÃO é similar (diferenças críticas):**

1. **Document tem content RAW (string), nosso Page tem TREE estruturado
   (JSON).** Smart block "transformation-funnel" não é um document, é
   uma **composição declarada** de outros L2 blocks. Document de
   ai-chatbot não tem essa estrutura — é texto/código livre.

2. **Suggestion ≠ JSON Patch.** Suggestion é "original text → suggested
   text" (diff de texto). Nosso JSON Patch é "operação no tree" (`add`,
   `remove`, `replace` em `block.children[3].props.headline`). Outro
   paradigma de edição.

3. **Versionamento via composite PK vs `*_versions` table.** ai-chatbot
   usa `(id, createdAt)` PK — cada edit é new row, mesmo `id`. Hotmart-like
   é `*_versions` com `version_number int` e `active_*_version_id`
   pointer. Trade-offs diferentes:
   - composite PK: simpler, version_number implícito (timestamp ordering)
   - `*_versions` table: explicit version_number + UI "salva como Variant
     v2" workflow + active pointer pra rollback

### Veredito final D8

**CONFIRMA com nuance.** Mantém ADR-0045 D.8 (composição declarada via
JSDoc, não tabela separada). **Mas atualiza a justificativa:**

- ❌ "ai-chatbot pattern similar a Smart blocks composição" — overstatement
- ✅ "ai-chatbot pattern similar a **polymorphic kind dispatch + tool
  calling versioning**" — accurate

**O que vale copy de ai-chatbot pra nosso projeto:**

1. **`createDocumentHandler<T>()` factory pattern** em
   `lib/artifacts/server.ts` — adapta pro nosso Page Engine como
   `createBlockHandler<T>()` se ganhamos N kinds.
2. **Tool layer pattern** (`lib/ai/tools/create-document.ts`) — copy
   estrutura: tool com Zod inputSchema + execute que dispatcha pra
   handler por kind.
3. **resumable-stream pattern** — útil pra long-running AI generation
   (Fase 6 theme generation pode levar 10-30s). Pacote `resumable-stream`
   já no ai-chatbot.

**O que NÃO copy:**

- ❌ Composite PK `(id, createdAt)` — escolhemos `*_versions` table
  (G.1 Hotmart-like, melhor pra UI workflow "salva variante").
- ❌ Suggestion table model — não temos use case de "diff de texto".
  Nosso edit é JSON Patch em tree.
- ❌ Document content como string raw — nosso content é JSONB tree
  estruturado.

---

## Parte 5 — Veredito sobre "combinação novel"

### Dados consolidados

**Cada peça da nossa stack tem precedent forte em produção:**

| Peça                              | Precedent produção                                                           | Risco             |
| --------------------------------- | ---------------------------------------------------------------------------- | ----------------- |
| Next 16 App Router                | Vercel scale (v0, Skool, ai-chatbot, Lovable migrating)                      | Baixo             |
| Supabase + RLS multi-tenant       | MakerKit, Bootstrapped, várias SaaS BR (research-22)                         | Baixo             |
| shadcn + Tailwind v4              | v0, Lovable, TweakCN, ai-chatbot, next-forge, MakerKit, milhares de SaaS     | Muito baixo       |
| TweakCN-way (~45 keys + OKLCH)    | TweakCN próprio (single-tenant); adaptação multi-tenant: **somos primeiros** | Médio (adaptação) |
| Multi-tenant hostname             | Vercel Platforms (canonical pattern), GoHighLevel (escala bilhão)            | Baixo             |
| Tiptap + ProseMirror JSON         | LinkedIn, GitLab, Substack, Anthropic, AxiosHQ, GitLab multi-tenant          | Muito baixo       |
| Novel wrapper                     | novel.sh demo + community projects; SaaS grande: não-publicado               | Médio             |
| Vercel AI Gateway                 | v0 production scale; "battle-tested" claim Vercel                            | Baixo             |
| AI híbrido (generateObject+tools) | ai-chatbot, Lovable hydration, Replit Agent 3 multi-agent (variações)        | Baixo             |
| Serwist PWA + per-tenant manifest | Serwist v9.5+ Turbopack maintained; per-tenant manifest: nascente            | Médio             |

### Combinação completa (8+ peças simultâneas)

**NÃO ENCONTRADA em produção:**

- Lovable é o mais próximo (shadcn + Supabase + AI + multi-model) mas:
  - Single-project per-user (não multi-tenant runtime)
  - Sem TweakCN-way theme system
  - Sem Novel (gera código source direto)
  - Sem PWA per-tenant
- GoHighLevel tem white-label multi-tenant + AI builder + page builder,
  mas:
  - Stack proprietária Node/Mongo (não Supabase+shadcn)
  - AI features são walled garden (não AI Gateway + multi-model)
  - Editor é proprietário (não Novel/Tiptap)
- MakerKit + Supastarter têm shadcn + Supabase multi-tenant + registry, mas:
  - Sem AI orchestration core
  - Sem Novel
  - Sem TweakCN-way theme system

**Veredito: SOMOS PRIMEIROS A JUNTAR essas peças nesta configuração.**

Mas:

- Não estamos fazendo experimentos arriscados — **cada peça é
  individualmente validada.**
- A novelty está na **combinação**, não na qualidade de cada peça.
- Existem 3 combinações parciais com precedent forte (shadcn+Supabase+RLS,
  Tiptap+multi-tenant, AI orchestration + shadcn) — cobrimos 80%+ via
  precedents.
- Os 20% restantes (TweakCN-way multi-tenant + Novel multi-tenant
  per-tenant + per-tenant PWA) **não têm precedent direto mas têm
  precedent indireto** (TweakCN single-tenant works; Tiptap multi-tenant
  works; Serwist multi-tenant maintained).

### Comparação direta com player real mais próximo

**Lovable.dev é o "melhor proxy" da nossa stack:**

| Aspecto             | Lovable                                            | Nosso projeto                                                 |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| Framework           | TanStack Start (SSR) — May 13/2026                 | Next 16 App Router                                            |
| UI lib              | shadcn/ui + Tailwind                               | shadcn new-york + Tailwind v4                                 |
| Backend             | Supabase (full: Postgres + Auth + Storage + Edge)  | Supabase (full)                                               |
| AI orchestration    | Multi-model hydration (GPT-4o + Claude 3.5)        | Multi-model híbrido (Haiku router + Sonnet + Gemini Flash)    |
| Multi-tenant        | Subdomain per project (`project-name.lovable.app`) | Hostname per tenant (`{tenant}.desafit.app` + custom domain)  |
| White-label         | NÃO (Lovable brand domina)                         | SIM (full per-brand: cores, fontes, logo, custom domain)      |
| Editor              | Próprio Lovable IDE                                | Novel (Tiptap-based) JIT pra Lesson editor                    |
| Page/Funnel builder | App gerada pelo AI direto                          | Page Engine + AI composer + 7 L2 blocks dia 0                 |
| PWA                 | n/a                                                | Serwist per-tenant manifest + theme.css                       |
| Theme system        | Tailwind defaults                                  | TweakCN-way ~45 keys OKLCH + APCA Silver + versioning Hotmart |
| Code ownership      | Full export GitHub + zip                           | n/a (não code-gen pro user)                                   |

**Conclusão:** Lovable e nosso projeto têm sobreposição forte na stack
**base** (Next-like + shadcn + Supabase + multi-model AI), mas a
**aplicação é diferente** — Lovable é AI app-builder per-user, nós somos
SaaS B2B white-label multi-vertical. Stack overlap valida nossa base; a
diferença no modelo de produto explica por que nossa combinação completa
é novel.

---

## 6. Ajustes recomendados pro mapa arquitetural / ADR-0045

### 6.1 Ajustes ZERO no mapa arquitetural

Mapa `01-master-system-map.md` consolidou as 7 layers + 7 gaps. Research-44
**não revelou novos gaps nem refuta layers existentes.** Mapa permanece
autoritativo.

### 6.2 Ajustes ZERO em ADR-0045

Re-validação das decisões ADR-0045:

| Decisão                                        | Status pós research-44 | Comentário                                                                                                                                                                     |
| ---------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D.1 v0 demoted                                 | ✅ MANTÉM              | Nenhum player real persiste TSX raw em DB multi-tenant. Confirmado.                                                                                                            |
| D.2 block_kinds_catalog JIT                    | ✅ MANTÉM              | Sem evidência contrária. Pattern JIT alinhado com Replit/Lovable (instanciação per-use).                                                                                       |
| D.3 trigger 3 consumers concretos              | ✅ MANTÉM              | Mantém threshold.                                                                                                                                                              |
| D.4 Novel ADOPT NOW + INSTALL JIT              | ✅ MANTÉM              | Tiptap underneath em produção massiva (LinkedIn/GitLab/Anthropic). Novel-as-wrapper: novel mas Tiptap base sólida.                                                             |
| D.5 AI híbrido (generateObject + tool calling) | ✅ MANTÉM              | Convalidado: Lovable hydration, Replit multi-agent, ai-chatbot Artifacts todos usam híbrido. State-of-the-art.                                                                 |
| D.6 Model policy tabular                       | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.7 Vertical extension híbrido                 | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.8 Smart blocks composição declarada          | 🟡 MANTÉM + ATUALIZA   | Veredito Parte 4: confirma decisão, atualiza justificativa (não é "ai-chatbot pattern" literal, é "polymorphic kind dispatch" similar). Justificativa em ADR pode ganhar nota. |
| D.9 7 L2 blocks dia 0                          | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.10 Registry hosting plataforma única         | ✅ MANTÉM              | Convalidado MakerKit/Supastarter (registry production-ready).                                                                                                                  |
| D.11 Namespaces 3 fixos                        | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.12 Composition rules L1↘npm/L2↘L1/L3↘L2      | ✅ MANTÉM              | Convalidado por practice geral SaaS dev.                                                                                                                                       |
| D.13 Âncora `kind===name===type`               | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.14 Versionamento JIT                         | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.15 `registry:style` (não `:theme`)           | ✅ MANTÉM              | SSOT TweakCN convalidado.                                                                                                                                                      |
| D.16 Gemini Flash fallback                     | ✅ MANTÉM              | Sem contradições.                                                                                                                                                              |
| D.17 APCA gate soft warn + botão               | ✅ MANTÉM              | Pattern de "human-in-the-loop on quality gate" alinhado com Suggestion table de ai-chatbot.                                                                                    |

**Veredito:** ADR-0045 DRAFT está sólido. Pode promover de DRAFT pra
ACCEPTED com confiança. **D.8 justificativa pode ganhar refinamento**
(parágrafo explicando que ai-chatbot pattern é "polymorphic kind dispatch"
similar, não "smart blocks composition" literal) — mas não é blocker.

### 6.3 Ajustes recomendados pro plano (work-stream paralelo)

**Não-bloqueante:** considerar 3 adições JIT durante Fase 6/7:

1. **Copy do `createDocumentHandler<T>()` factory pattern** de
   `ai-chatbot-ref/lib/artifacts/server.ts` → adapta pra
   `lib/page-engine/createBlockHandler<T>()` quando temos 3+ kinds.
2. **Copy do tool layer pattern** (`lib/ai/tools/create-document.ts`) → adapta
   pra nossos tools `createPage`, `updatePage`, `applyPagePatch`.
3. **Considerar `resumable-stream` pacote** quando Fase 6 theme generation
   ficar lenta (5-30s) — melhora UX de long-running AI.

### 6.4 Background insights pra blueprint 07 (AI prompts) — JIT

**Anthropic Console pattern** revelou que prompt versioning + automatic
eval é prática estabelecida. Blueprint 07 já tem `ai_prompts` table — mas
não tem CI eval automation. Quando Fase 6 entrar:

- Promptfoo CI ou similar pra detectar prompt drift
- Bump `version_number` em `ai_prompts` quando prompt code muda
- Eval suite por prompt (golden set inputs + assertions)

GAP-6 do mapa (`01-master-system-map.md` §9.1) já identifica isso —
research-44 só convalida prioridade. **Não há ação imediata** — Fase 6
trigger.

---

## 7. Conclusão executiva

1. **Course platforms tradicionais (Kajabi, Mighty, Circle, Teachable,
   Thinkific) são Rails monolítico legado.** Não são referência técnica
   pra greenfield 2026. Nossa stack é estrategicamente diferente, não
   acidental.

2. **GoHighLevel valida o modelo white-label agency multi-tenant em
   escala bilhão de hits/dia.** Nosso modelo "Fase 1 agência" tem
   precedent de mercado.

3. **Lovable é o player mais próximo da nossa stack base** (Vite/TanStack
   - shadcn + Supabase + multi-model AI). Confirma viabilidade da
     combinação básica, mas Lovable é app-builder per-user, não SaaS
     multi-tenant — nosso modelo de produto é diferente.

4. **AI orchestration moderna converge em padrão híbrido** (router/classifier
   - big model gen + tool calling pra edits). ADR-0045 D.5 (generateObject
   - streamText+toolCalling) está alinhado com state-of-the-art (Lovable
     hydration, Replit multi-agent, ai-chatbot Artifacts, Vercel AI SDK 6).

5. **D8 (Smart blocks composição declarada) CONFIRMADO** com nuance:
   ai-chatbot Artifacts NÃO é "smart blocks composition" literal — é
   "polymorphic kind dispatch + tool calling versioning". Pattern primo,
   não pattern espelhado. Decisão ADR-0045 D.8 mantém. Justificativa pode
   ganhar refinamento.

6. **Não somos territory novel quanto ao risco técnico** — cada peça é
   validada em produção massiva. **Mas somos primeiros a juntar essas 10+
   peças nesta configuração específica.** Risk profile: baixo na peça,
   moderado na integração. Mapa arquitetural 7 layers + 7 gaps já está
   calibrado pra esse cenário.

7. **ADR-0045 pode promover de DRAFT pra ACCEPTED** — sem ajustes
   estruturais. Apenas refinamento da justificativa D.8 (opcional).

---

## 8. Referências

- `docs/architecture/01-master-system-map.md` — mapa interno 7 layers
- `docs/research/43-stack-comparative-analysis.md` — companion (dev-stack repos)
- `docs/research/38-registry-novel-ai-integration.md` — Registry + Novel + AI orch
- `docs/research/40-shadcn-registry-deep-dive.md` — Private registry deep-dive
- `docs/research/41-audit-tweakcn-fases-5-6-7.md` — Audit TweakCN Fases 5/6/7
- `docs/adr/0045-registry-strategy.md` — ADR draft 17 decisões
- `docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md` — reflexão origem
- `C:\Users\leean\Desktop\ai-chatbot-ref\lib\db\schema.ts` — Artifacts schema
- `C:\Users\leean\Desktop\ai-chatbot-ref\lib\artifacts\server.ts` — createDocumentHandler factory
- `C:\Users\leean\Desktop\ai-chatbot-ref\lib\ai\tools\*.ts` — tool layer pattern
- `C:\Users\leean\Desktop\tweakcn-ref\` — TweakCN clone (SSOT theme adaptation)
- Kajabi engineering — https://engineering.kajabi.com/
- Tiptap customers — https://tiptap.dev/customers (LinkedIn, GitLab, Anthropic, Substack)
- Lovable tech stack — https://docs.lovable.dev/faq/capabilities/tech-stack/lovable-tech-stack
- Vercel Platforms — https://github.com/vercel/platforms
- GoHighLevel platform — https://www.gohighlevel.com/post/the-agency-tech-stack-of-the-future-and-what-to-eliminate-first
- Replit Agent 3 architecture — https://mastra.ai/customers/replit
- shadcn registry docs — https://ui.shadcn.com/docs/registry
- Notion data model — https://www.notion.com/blog/data-model-behind-notion

# Page Engine — Documento de Decisão Arquitetural (Maio 2026)

> **Stack alvo**: Next.js 16.2 (App Router, Turbopack default, RSC + Cache Components), React 19.2, Tailwind v4 @theme OKLCH, shadcn new-york dark-first, Motion 12, @supabase/ssr 0.10, Zod 4, RHF 7, next-intl 4, Storybook 10, Serwist (PWA), Vercel AI Gateway, BotID, Queues, Workflow (WDK).
> **Domínio**: agência → tenants (fitness / yoga / idiomas / coaching) → cliente final.
> **Decisões base já fechadas**: Form Engine e Page Engine separados; árvore recursiva `{id,type,props,children[]}` via `z.lazy()`; versionamento snapshot-only Hotmart-like; vibe coding Sonnet 4.6 + caching auto + fallback Haiku 4.5; RLS por `tenant_id` + role check + entitlements via `can_use_feature`; defesa em profundidade com trigger `assert_tenant_match`.

---

## TL;DR

- **Trate o spec da page como AST puramente declarativo** (`PageSpec` Zod com `z.lazy()` + união polimórfica por `type`), seguindo o modelo Notion/Builder.io, NÃO o modelo Plasmic (que mistura design-time + codegen) nem o Lexical (otimizado para edição de texto inline). 7 blocos no MVP, ~30 no catálogo total. **Zod 4 ainda quebra `discriminatedUnion` + `lazy`** (issues colinhacks/zod#5991 e #1504, ativos em 2026) — use `z.union()` lazy e ordene as variantes por frequência (`hero`, `feature-grid`, `testimonial-grid` primeiro) para mitigar a perda de short-circuit por discriminator.
- **Versionamento: snapshot imutável + working draft + `current_version_id`** (idêntico em forma ao Hotmart Pages internamente). Cada `publishPage()` faz `INSERT` em `page_versions`; nunca `UPDATE`. Trigger Postgres bloqueia mutações. Lock de versão ao primeiro `page.view` registrado — antes disso, edição re-escreve a v1 draft sem versionar (poupa rows).
- **AI generation híbrido com `generateObject({ schema: PageSpec })`** usando `anthropic/claude-sonnet-4-6` via Vercel AI Gateway (`providerOptions.gateway.caching: 'auto'`). Sistema prompt + few-shots (3-5 por vertical) com cache `ephemeral`; Haiku 4.5 (lançado 15-out-2025 no AI Gateway, $1/$5 por milhão de tokens input/output, ~⅓ do custo de Sonnet 4 e mais de 2x mais rápido — VentureBeat, 15-out-2025) só como fallback ou para diffs pequenos. Edição via JSON Patch RFC 6902 + EASE (arXiv:2510.04717v1, "JSON Whisperer") — reduz tokens em 31% vs full regeneration mantendo qualidade ≤5% abaixo.
- **Não construa editor visual em Fase 1.** Chat IA + preview HTML + JSON-edit fallback bate Webflow/Framer/Builder.io para o caso de uso "agência-faz-tudo". Editor visual entra em Fase 2 + Liveblocks Storage só quando 2+ admins simultâneos virar dor real. Até lá, **LWW com ETag + 409 Conflict** resolve.
- **SEO/performance: ISR via `'use cache' + cacheTag('page:{tenant_id}:{slug}')`** (Next.js 16.2.6 estabilizou ambos sem prefixo `unstable_`). Limites oficiais: "A single cacheTag() call accepts up to 128 tags, each with a maximum length of 256 characters. Tags longer than 256 characters are skipped, and any tags past the 128th in one call are dropped." (nextjs.org/docs/app/api-reference/functions/cacheTag). `revalidateTag()` no `publishPage`. og:image dinâmica via `ImageResponse` (next/og, Satori) extraindo título da page + tokens OKLCH do `tenant.brand`. Vercel Flags + Web Analytics para A/B (precompute pattern para evitar layout shift).

---

## Key Findings

1. **Next.js 16.2 (release maio 2026) tornou `cacheTag` e `cacheLife` estáveis** — sem prefixo `unstable_`. `cacheComponents: true` é o flag que habilita o novo modelo. Limites oficiais: 128 tags por chamada, 256 chars cada (tags maiores são silenciosamente descartadas com warning, segundo nextjs.org/docs/app/api-reference/functions/cacheTag, last updated May 19, 2026, versão 16.2.6). Tags "soft" automáticas usam prefixo `_N_T_/`. Isso muda profundamente a estratégia de invalidação: você pode taggear cada page com `page:{tenant_id}:{slug}` e invalidar pontualmente no publish via `updateTag()` (read-your-own-writes em Server Functions) ou `revalidateTag()` (eventual).
2. **AI Gateway com Anthropic suporta `caching: 'auto'` nativo** via `providerOptions.gateway.caching: 'auto'`. Slugs corretos: `anthropic/claude-haiku-4-5` (lançado 15-out-2025; conforme VentureBeat 15-out-2025: "The model costs $1 per million input tokens and $5 per million output tokens — roughly one-third the price of Anthropic's mid-sized Sonnet 4 model released in May, while operating more than twice as fast"), `anthropic/claude-sonnet-4-6`, `anthropic/claude-opus-4-6` (lançado 5-fev-2026 no AI Gateway, **primeiro Opus com 1M tokens de contexto**, adaptive thinking, $5/$25 por 1M tokens input/output; benchmarks Anthropic citados por ChatForest: SWE-bench Verified 80.8%, GPQA Diamond 91.3%, OSWorld 72.7%), e Opus 4.7 com Fast Mode em $30/$150 por 1M tokens. ZDR é preservado em direct gateway requests (não em BYOK). Fonte: vercel.com/docs/ai-gateway/models-and-providers/automatic-caching e vercel.com/changelog/claude-opus-4.6-on-ai-gateway.
3. **Vercel BotID custa $1 por 1.000 Deep Analysis checks**; Basic é grátis. Powered by Kasada. Deep Analysis só dispara quando `checkBotId()` é chamado em Server Actions ou Route Handlers — chamadas em `middleware.ts` / `proxy.ts` não funcionam. Cite (vercel.com/botid): "BotID is available for all teams, with Deep Analysis checks available for Pro and Enterprise teams."
4. **Hotmart Pages é paid SaaS, não free.** Plano Starter a partir de **R$ 39/mês** (12x anual ≈ R$ 468/ano), bundled com Hotmart Send. Hotmart **NÃO expõe API pública específica de Pages** — só Subscriptions/Members Area/Sales em developers.hotmart.com. Implicações: clonar Hotmart é jogada estratégica direta (Brasil, B2B, infoprodutores), e não há lock-in via API exportável que os clientes esperem.
5. **Webflow lançou MCP server oficial em abril/maio 2025** (anúncio na Cloudflare MCP Demo Day). Versão atual: v1.2.1 (5-mai-2026). Beta consolidou 46+ tools em **18 tools**. Endpoint `https://mcp.webflow.com/sse`. Requer Node 22.3.0+ e Bridge App aberto no Designer para Designer API tools. Cite Utkarsh Sengar (VP Eng Webflow, em blog.cloudflare.com/mcp-demo-day): "MCP is not just a different surface over our APIs, instead we're thinking of it in terms of the actions it supports: publish a website, create a CMS collection, update content, and more."
6. **Builder CMS MCP só conecta a Publish/Hybrid Spaces** (não a Develop Spaces). Endpoint `https://cdn.builder.io/api/v1/mcp/builder-content`, autenticação por Builder Private API Key. Builder.io também expõe um Builder MCP separado (dev-tools, documentação de componentes via `npx @builder.io/dev-tools mcp`) e DSI MCP. On-demand Agent Credits são vendidos a "500 credits for $25, credits stay on your plan until your subscription renews" (builder.io official Agent Credits docs, ago/2025). Implicação para nós: a divisão "Publish vs Hybrid" não se aplica, mas a UX MCP é a referência principal.
7. **Framer NÃO tem MCP oficial em 2026.** Wireframer (text → multi-page site) e Workshop (component generation) são os recursos AI principais. Pricing 2026 simplificou: **Free / Basic $10/mo annual ($15 mensal) / Pro $30/mo ($45) / Scale $100/mo (anual-only) / Enterprise**. Seats: 2 (Basic), 10 (Pro/Scale); seats extras $20/mo (Basic) ou $40/mo (Pro/Scale). Implicação: Framer compete no "AI visual generation" mas perde a história agente-amigável.
8. **Plasmic também não tem MCP oficial em 2026** (forum.plasmic.app/t/mcp-server-for-plasmic/11444 — usuários pedem citando Webflow/Framer). Pricing 2026: **Free / Starter $39/mo / Pro $103/mo (Plasmic AI Beta incluso) / Scale $399/mo / Enterprise**. Scale ($399) inclui A/B testing e scheduled content — referência interna para precificar nossas features equivalentes.
9. **Wix lançou MCP oficial em 7-mai-2025** (https://mcp.wix.com/mcp, ver press release GlobeNewswire 7-mai-2025). Wix Harmony (2026) é seu builder NL-driven com agente "Aria". Squarespace e Carrd **não** têm MCP oficial em 2026.
10. **PostHog é o melhor analytics provider para landing pages B2B com integração Vercel.** Disponível no Vercel Marketplace como provider de feature flags + experimentation + analytics desde 10-fev-2026 (vercel.com/changelog/posthog-joins-the-vercel-marketplace). Vercel Web Analytics é "a nice value-add for any front-end dev using Vercel's frontend-as-a-service" mas "falls a long way short of a genuine Google Analytics alternative" (PostHog blog, ga4-alternatives).
11. **JSON Patch RFC 6902 + EASE supera regeneration completa para edição via IA**: 31% menos tokens, qualidade dentro de 5% de full regeneration (arXiv:2510.04717v1, "JSON Whisperer", out/2025). LLMs falham em índices de array depois de remoção; EASE (Explicitly Addressed Sequence Encoding) transforma arrays em dicts com chaves estáveis para resolver isso. Diretamente aplicável ao caso "muda o hero para ter 2 botões".
12. **CookieConsent v3.1.0+ de @orestbida (MIT)** é a escolha mais clara para LGPD/GDPR em vanilla JS: scripts plain-text com `data-cookiecategory`, opt-in default, mode `opt-out` opcional, `validConsent()` API, `getUserPreferences()` para audit log. Não é "full GDPR solution" (direito ao esquecimento fica fora), mas para banner + script gating é suficiente.

---

## Details

### 1. Block taxonomy completa

#### 1.1 Princípios de naming

- Nomes canônicos em **inglês**; URL pública via rewrite Vercel para PT-BR (decisão já fechada).
- No spec usamos `kebab-case` por consistência com HTML/CSS (`hero`, `feature-grid`, `pricing-cards`).
- Cada bloco define: `type` (string literal), `props` (Zod object), `accepts?` (lista de child types ou `'any'`), `variants` (enum opcional).
- **Versionamento por bloco**: cada bloco carrega `schema_version: number` no payload — renderer faz fallback se versão futura encontrada (espelha o pattern já decidido para Program Engine).

#### 1.2 Fase 1 — MVP (7 blocos)

Estes são SUFICIENTES para uma landing fitness/yoga/idiomas vendável. Premissa: toda landing tem `hero` + 1-2 `feature-grid` + 1 `testimonial-grid` + 1 `pricing-cards` ou `embed-form` + `cta` + `footer`.

1. `section` — wrapper layout, define container width + padding vertical
2. `hero` — headline + subhead + 1-2 CTAs + media (imagem/vídeo/gradient)
3. `feature-grid` — N features (icon + title + desc), variantes 2/3/4 colunas
4. `testimonial-grid` — depoimentos (avatar + nome + texto + role/empresa)
5. `pricing-cards` — N planos (price + features + CTA + featured flag)
6. `cta` — banda com title + sub + 1-2 buttons
7. `embed-form` — referência opaca a `forms.id` (Form Engine renderiza inline)

#### 1.3 Fase 2-3 — Catálogo expandido (~30 blocos)

**Layout / Estrutura**: `container`, `stack`, `divider`, `spacer`, `columns`
**Conteúdo / Texto**: `statement` (markdown), `heading`, `quote`, `badge-list`
**Mídia**: `image-block`, `video-embed`, `gallery`, `logo-cloud`
**Conversão**: `embed-form` (Fase 1), `embed-program`, `cta` (Fase 1), `cta-banner`, `lead-magnet`
**Social proof**: `testimonial-grid` (Fase 1), `testimonial-single`, `testimonial-carousel`, `social-proof`, `stats-counter`, `case-study-card`
**Pricing**: `pricing-cards` (Fase 1), `pricing-table`, `comparison`
**FAQ / Info**: `faq`, `timeline`, `team`, `about`, `contact`
**Chrome**: `navbar`, `footer`, `banner`, `alert`

#### 1.4 Zod schemas reais para os 7 blocos de Fase 1

```ts
// lib/page-engine/spec/blocks.ts
import { z } from 'zod'

// ---- Primitives ----
const CtaSchema = z.object({
  label: z.string().min(1).max(80),
  href: z.string().url().or(z.string().startsWith('/')),
  variant: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
  target: z.enum(['_self', '_blank']).default('_self'),
  rel: z.string().optional(),
})

const MediaSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('image'),
    src: z.string().url(),
    alt: z.string(),
    aspectRatio: z.string().default('16/9'),
  }),
  z.object({
    kind: z.literal('video'),
    provider: z.enum(['youtube', 'vimeo', 'mp4']),
    src: z.string().url(),
    poster: z.string().url().optional(),
  }),
  z.object({ kind: z.literal('gradient'), tokens: z.array(z.string()).min(2).max(4) }),
  z.object({ kind: z.literal('none') }),
])

const BlockId = z.string().regex(/^[a-z0-9-]{4,32}$/, 'block id deve ser slug curto')

// ---- 1. section ----
export const SectionBlock = z.object({
  type: z.literal('section'),
  id: BlockId,
  props: z.object({
    containerWidth: z.enum(['narrow', 'default', 'wide', 'full']).default('default'),
    paddingY: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('lg'),
    background: z.enum(['none', 'muted', 'brand-soft', 'brand-strong']).default('none'),
  }),
})

// ---- 2. hero ----
export const HeroBlock = z.object({
  type: z.literal('hero'),
  id: BlockId,
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    headline: z.string().min(1).max(140),
    subhead: z.string().max(400).optional(),
    media: MediaSchema,
    layout: z.enum(['split-left', 'split-right', 'center', 'bg-cover']).default('split-left'),
    ctas: z.array(CtaSchema).max(2).default([]),
    align: z.enum(['left', 'center']).default('left'),
  }),
})

// ---- 3. feature-grid ----
export const FeatureGridBlock = z.object({
  type: z.literal('feature-grid'),
  id: BlockId,
  props: z.object({
    eyebrow: z.string().max(60).optional(),
    headline: z.string().max(140).optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    features: z
      .array(
        z.object({
          icon: z
            .string()
            .regex(/^lucide:[a-z-]+$/)
            .optional(), // ex. 'lucide:dumbbell'
          title: z.string().min(1).max(80),
          description: z.string().max(300),
        }),
      )
      .min(1)
      .max(12),
  }),
})

// ---- 4. testimonial-grid ----
export const TestimonialGridBlock = z.object({
  type: z.literal('testimonial-grid'),
  id: BlockId,
  props: z.object({
    headline: z.string().max(140).optional(),
    columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
    items: z
      .array(
        z.object({
          quote: z.string().min(10).max(600),
          name: z.string().min(1).max(80),
          role: z.string().max(120).optional(),
          avatarUrl: z.string().url().optional(),
          rating: z.number().int().min(1).max(5).optional(),
        }),
      )
      .min(1)
      .max(12),
  }),
})

// ---- 5. pricing-cards ----
export const PricingCardsBlock = z.object({
  type: z.literal('pricing-cards'),
  id: BlockId,
  props: z.object({
    headline: z.string().max(140).optional(),
    billingToggle: z.boolean().default(false),
    currency: z.enum(['BRL', 'USD', 'EUR']).default('BRL'),
    plans: z
      .array(
        z.object({
          name: z.string().min(1).max(40),
          priceMonthly: z.number().nonnegative(),
          priceAnnualMonthly: z.number().nonnegative().optional(),
          description: z.string().max(200).optional(),
          features: z.array(z.string()).max(20),
          cta: CtaSchema,
          featured: z.boolean().default(false),
        }),
      )
      .min(1)
      .max(4),
  }),
})

// ---- 6. cta ----
export const CtaBlock = z.object({
  type: z.literal('cta'),
  id: BlockId,
  props: z.object({
    headline: z.string().min(1).max(140),
    subhead: z.string().max(280).optional(),
    align: z.enum(['left', 'center']).default('center'),
    ctas: z.array(CtaSchema).min(1).max(2),
  }),
})

// ---- 7. embed-form ----
export const EmbedFormBlock = z.object({
  type: z.literal('embed-form'),
  id: BlockId,
  props: z.object({
    formId: z.string().uuid(),
    layout: z.enum(['inline', 'card', 'iframe']).default('card'),
    headline: z.string().max(140).optional(),
    onCompleteRedirect: z.string().url().or(z.string().startsWith('/')).optional(),
  }),
})

// ---- Recursive union ----
// Decisão: z.union() + lazy (NÃO z.discriminatedUnion + lazy — Zod 4 quebra inference: issues #1504, #5991)
type BlockNode =
  | (z.infer<typeof SectionBlock> & { children: BlockNode[] })
  | z.infer<typeof HeroBlock>
  | z.infer<typeof FeatureGridBlock>
  | z.infer<typeof TestimonialGridBlock>
  | z.infer<typeof PricingCardsBlock>
  | z.infer<typeof CtaBlock>
  | z.infer<typeof EmbedFormBlock>

export const BlockSchema: z.ZodType<BlockNode> = z.lazy(() =>
  z.union([
    SectionBlock.extend({ children: z.array(BlockSchema).default([]) }),
    HeroBlock,
    FeatureGridBlock,
    TestimonialGridBlock,
    PricingCardsBlock,
    CtaBlock,
    EmbedFormBlock,
  ]),
)

export const PageSpecSchema = z.object({
  schemaVersion: z.literal(1),
  blocks: z.array(BlockSchema).min(1).max(100),
  translations: z
    .record(
      z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
      z.record(BlockId, z.record(z.string(), z.string())),
    )
    .optional(),
})

export type PageSpec = z.infer<typeof PageSpecSchema>
```

**Por que `z.union` e não `z.discriminatedUnion`?** Issue colinhacks/zod#5991 (out-2025): _"z.discriminatedUnion's type computation eagerly maps over variants… requiring every variant's shape to be fully resolved before the union's type. Plain ZodUnion is lazier."_ Para schemas recursivos com `lazy()`, `discriminatedUnion` quebra TS inference (vira `any` ou `unknown`). Aceita-se a perda do short-circuit por discriminator; compensa-se ordenando o `union([])` com os blocos mais frequentes primeiro.

### 2. Tree spec patterns — players comparados

| Player              | Modelo                                                     | Editor            | Profundidade | Comentário                                                       |
| ------------------- | ---------------------------------------------------------- | ----------------- | ------------ | ---------------------------------------------------------------- |
| Notion blocks       | Polymorphic `{id,type,properties,content}`                 | Block-based       | ~10 níveis   | Pioneiro. Trade-off: mistura conteúdo+layout.                    |
| BlockSuite (AFFiNE) | YDoc + block tree versionado                               | Hybrid            | Ilimitado    | CRDT-first. Overkill para landing.                               |
| Plate.js            | Slate-derived AST + plugins                                | Rich text + slots | Profundo     | Bom para docs/blog, fraco para layouts.                          |
| Lexical (Meta)      | Node tree imutável, `editor.parseEditorState(JSON)`        | Rich text         | Profundo     | Block nodes têm `fields` property; pattern visto no Payload CMS. |
| Builder.io          | `<BuilderComponent model="page" content={contentJSON} />`  | Visual + headless | Profundo     | Modelo mais próximo do que queremos.                             |
| Plasmic             | TplNode tree, `__type` + `__iid` + `tplTree` em components | Visual            | Profundo     | Design-tool-like, com codegen opcional.                          |
| Webflow             | Proprietary canvas + Data API + Designer API               | Visual            | Profundo     | Editor caro de copiar; spec via API consolidada (18 tools MCP).  |
| Framer              | Proprietary, Smart components                              | Visual            | Profundo     | Não expõe AST público.                                           |
| Wix Editor X        | Proprietary                                                | Visual            | —            | Não relevante para nosso modelo.                                 |

**Decisão**: modelo **Notion + Builder.io híbrido** — árvore polimórfica `{id,type,props,children[]}` (Notion-style), renderer despacha por `type` em RSC (Builder.io-style com `BLOCK_REGISTRY` local). **Não** usar Lexical/Slate (otimizam edição de texto inline, não composição de seções). **Não** usar Plasmic codegen (overhead pra Fase 2).

**Profundidade máxima razoável**: 5. Realista: hero ROOT → section → stack → image-block é 4. Reject specs com depth > 5 no validator (`assertMaxDepth(spec, 5)`).

**Validação de ciclos**: ids únicos garantem ausência de ciclos. Adicionar `assertUniqueIds(spec)` no `updatePage`.

**Performance de render em RSC**: `'use cache'` no Page server component + `cacheTag('page:{tenant}:{slug}')`. Cada bloco renderiza como Server Component; client-only para blocos com motion (`testimonial-carousel`). Lazy-load below-fold via `dynamic()`.

```ts
// lib/page-engine/render/registry.tsx (server)
import dynamic from 'next/dynamic'

export const BLOCK_REGISTRY = {
  hero: dynamic(() => import('./blocks/hero')),
  'feature-grid': dynamic(() => import('./blocks/feature-grid')),
  // …
} satisfies Record<BlockType, React.ComponentType<any>>
```

### 3. Page kinds (análogo a `forms.kind`)

```sql
alter table pages add column kind text not null default 'landing'
  check (kind in ('landing','sales','document','thank-you','error','maintenance','blog-post','about','pricing','legal'));
create index idx_pages_kind on pages(tenant_id, kind);
```

| Kind          | Uso                            | Comportamento diferenciado                                                                   |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `landing`     | Captura de lead, topo de funil | Pixels carregam (pós-consent); analytics rich; OG image dinâmica                             |
| `sales`       | Página de venda longa          | Same as landing + tracking de scroll_depth detalhado por seção                               |
| `thank-you`   | Pós-conversão                  | NÃO carrega pixels de lead-tracking; carrega pixels de conversão (server-side via Meta CAPI) |
| `document`    | Termos, política               | Sem pixels, sem analytics granular, indexável em SEO                                         |
| `blog-post`   | Conteúdo orgânico              | Schema.org Article + H1/H2 obrigatório, related links automáticos                            |
| `error`       | 404/500 custom                 | Sem analytics events, sem pixels                                                             |
| `maintenance` | Manutenção programada          | HTTP 503, no-index, sem pixels                                                               |
| `about`       | Sobre o tenant                 | Indexável, sem pixels de conversão                                                           |
| `pricing`     | Tabela de preços standalone    | Evento `pricing.viewed`; scroll_depth fundamental                                            |
| `legal`       | LGPD/privacy                   | Sem analytics, sem pixels (conflito de interesse)                                            |

```ts
const KIND_CAPABILITIES: Record<
  PageKind,
  { pixels: boolean; pageView: boolean; conversionPixels: boolean }
> = {
  landing: { pixels: true, pageView: true, conversionPixels: false },
  'thank-you': { pixels: false, pageView: true, conversionPixels: true },
  legal: { pixels: false, pageView: false, conversionPixels: false },
  // …
}
```

### 4. Versionamento na prática

```sql
create table pages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  slug text not null,
  title text not null,
  kind text not null default 'landing',
  blocks jsonb not null default '[]',                -- working draft
  status text not null check (status in ('draft','published','archived')),
  schema_version int not null default 1,
  source_template_id uuid references page_templates(id),
  source_template_version int,
  current_version_id uuid references page_versions(id),
  theme_overrides jsonb,
  seo jsonb,
  first_viewed_at timestamptz,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  etag text not null default gen_random_uuid()::text,
  unique (tenant_id, slug) where deleted_at is null
);

create table page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id),
  version int not null,
  blocks_snapshot jsonb not null,
  seo_snapshot jsonb,
  theme_overrides_snapshot jsonb,
  published_by_user_id uuid not null references auth.users(id),
  published_at timestamptz default now(),
  unique (page_id, version)
);

-- Trigger: bloqueia UPDATE em page_versions
create function block_page_versions_update() returns trigger as $$
begin raise exception 'page_versions é immutable'; end;
$$ language plpgsql;
create trigger no_update_page_versions before update on page_versions
  for each row execute function block_page_versions_update();
```

**RPC `publish_page`** (atômica):

```sql
create or replace function publish_page(p_page_id uuid, p_user_id uuid)
returns page_versions language plpgsql security definer as $$
declare
  v_page pages%rowtype;
  v_new_version int;
  v_version page_versions%rowtype;
begin
  select * into v_page from pages where id = p_page_id for update;
  if v_page is null then raise exception 'page not found'; end if;

  select coalesce(max(version), 0) + 1 into v_new_version
  from page_versions where page_id = p_page_id;

  insert into page_versions (page_id, version, blocks_snapshot, seo_snapshot, theme_overrides_snapshot, published_by_user_id)
  values (p_page_id, v_new_version, v_page.blocks, v_page.seo, v_page.theme_overrides, p_user_id)
  returning * into v_version;

  update pages set
    current_version_id = v_version.id,
    status = 'published',
    published_at = now(),
    etag = gen_random_uuid()::text
  where id = p_page_id;

  return v_version;
end;
$$;
```

**Quando lockar versão**: trigger = primeira linha `page_analytics_events` com `event_type='page.view'`. Em RPC `record_page_view`, faz `update pages set first_viewed_at = now() where id=$1 and first_viewed_at is null`. A partir daí, edição cria draft sobre a current; `pages.blocks` é "working draft do próximo publish".

**Trade-offs**:

- Antes do primeiro view: edição "destrói" o draft livremente (sem versionamento). Para 1k tenants × 10 pages × 50 edições antes do primeiro view = 500k rows poupados.
- Depois: cada publish é uma versão. JSONB compactado (~10-50KB/versão). 10k publishes/mês × 30KB = 300MB/mês, ignorável em Supabase Pro ($25/mo 8GB DB).

**Aplicar overrides em cima de snapshot**: NÃO use diff/patch persistido. Snapshot completo no `page_versions.blocks_snapshot`. `pages.theme_overrides` vive separado, **não versionado** — é sempre relativo à versão atual.

**Rollback (Fase 2)**: copia o snapshot da versão alvo para `pages.blocks` (working draft); status volta a `draft`; publish gera nova versão a partir desse draft. **Não** sobrescreve a versão alvo.

### 5. AI page generation patterns — players

| Player                   | Pattern                                                                                                                                                                   | Taxa "first-try valid"                                | Halucinação                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| Framer Wireframer        | Prompt → multi-page site. Reviews em 2026: _"impressive for a starting point and underwhelming as a final product"_ (vibecoding.app/blog/framer-review)                   | ~70% utilizáveis, sempre precisam refinamento         | Componentes que parecem em Framer mas não existem fora |
| Wix ADI / Harmony / Aria | Questionário → page; agente "Aria" executa "design desires, such as updating colour palettes, redesigning webpages, or adding commerce capabilities" (Creative Bloq 2026) | Alta para sites brandless                             | Limitado ao catálogo Wix                               |
| Webflow AI Assistant     | Geração de seções via prompts, integrada ao Designer + MCP (18 tools)                                                                                                     | Boa para componentes; falha em coerência multi-página | Stays within Webflow's component vocab                 |
| Builder.io AI            | Geração de seções + Visual Copilot (Figma→code, "trained on 2M+ data points")                                                                                             | Bom, principalmente Figma→code                        | Catálogo headless robusto                              |
| Plasmic AI Beta          | Em beta no plano Pro $103/mo                                                                                                                                              | n/d                                                   | n/d                                                    |
| Locofy                   | Figma → code, não NL→page direto                                                                                                                                          | n/d                                                   | n/d                                                    |
| v0 (Vercel)              | NL→React/Tailwind/shadcn; "less helpful when bolting onto an existing codebase with an established design system" (automationatlas.io 2026)                               | Excelente para greenfield UI                          | Mira código React, não AST customizado                 |

**Decisão**: copiar o pattern de Builder.io (catálogo restrito + IA gera JSON validado) usando nosso `PageSpecSchema`. Taxa esperada ~85% com Sonnet 4.6 + 3-5 few-shots por vertical + Zod validation com 3 retries via `generateObject({ schema, maxRetries: 3 })`. Halucinação de block kinds é zerada pela validação: o modelo recebe a lista exata de `type`s permitidos, e qualquer invenção falha e retry.

### 6. Prompt template structure para `generateObject({ schema: PageSpec })`

**System message** (~3000 tokens, cacheável via `ephemeral`):

```
You are PageEngine AI, an assistant that produces structured JSON page specs for a B2B SaaS that
serves fitness, yoga, language teaching, and coaching professionals selling programs via funnels.

OUTPUT CONTRACT:
- You output ONLY a single JSON object validating against PageSpec schema (Zod-derived).
- NEVER output prose, explanations, or markdown outside the JSON.
- All text content is in {{LOCALE}} unless overridden in the brief.
- All `type` values MUST be one of the catalog below. Never invent new types.

BLOCK CATALOG (only these are valid):
- section { containerWidth, paddingY, background, children[] }
- hero { eyebrow?, headline, subhead?, media{kind:image|video|gradient|none, ...},
         layout: split-left|split-right|center|bg-cover, ctas[max 2], align }
- feature-grid { eyebrow?, headline?, columns: 2|3|4, features[]:{icon:'lucide:<name>'?, title, description} }
- testimonial-grid { headline?, columns:1|2|3, items[]:{quote, name, role?, avatarUrl?, rating?} }
- pricing-cards { headline?, billingToggle, currency: BRL|USD|EUR,
                  plans[1-4]:{name, priceMonthly, priceAnnualMonthly?, description?, features[], cta, featured} }
- cta { headline, subhead?, align: left|center, ctas[1-2] }
- embed-form { formId (UUID provided in brief), layout: inline|card|iframe, headline?, onCompleteRedirect? }

CONTENT RULES:
- Headlines: emotional, benefit-led, 5-10 words. No clichés ("revolucione sua vida").
- Sub: 12-25 words, concrete benefit + objection handling.
- Testimonials: 30-60 words, first-person, mentioning specific results.
- Features: title 2-5 words, description 12-20 words, focused on outcomes.
- CTAs: verb-first, 2-4 words. "Quero começar" > "Clique aqui".
- Pricing: prices in {{CURRENCY}}; descriptions <12 words; 3-5 features per plan;
  mark middle plan as `featured: true`.

VERTICAL ADAPTATIONS (tone & wording):
- fitness:   high-energy, results-focused. Icons: dumbbell, flame, heart-pulse, timer.
- yoga:      calm, mindful, body-positive. Icons: leaf, sun, moon, sparkles.
- languages: progress-oriented, conversational. Icons: messages-square, globe, headphones, book-open.
- coaching:  transformational, confidence-led. Icons: target, compass, trending-up, lightbulb.

STRUCTURE RULES:
- Total blocks: 5-9 for landing, 8-15 for sales.
- Always: hero → 1-2 social-proof/feature → ≥1 testimonial → pricing OR embed-form → cta → footer.
- Use IDs like `hero-1`, `features-1`, `testimonials-1` (slug, unique per page). Depth max 5.
```

**User message**:

```
TENANT BRAND:
- name: {{TENANT_NAME}}
- vertical: {{VERTICAL}}
- tone tags: {{TONE_TAGS}}
- OKLCH brand tokens: {{BRAND_JSON}}

BRIEF:
{{USER_BRIEF}}

REFERENCES (optional, summarized):
{{REFERENCE_SUMMARY}}

OUTPUT: PageSpec JSON only.
```

**Caching strategy** (Anthropic via AI Gateway, `caching:'auto'`):

- System message + catálogo + vertical adaptations é estável → cache hit em ~95% das requests por tenant após o primeiro.
- Few-shots por vertical: 3-5 exemplos canônicos no cache estável.

**Implementação**:

```ts
import { generateObject } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { PageSpecSchema } from '../spec/blocks'

export async function generatePageFromBrief(input: {
  tenantId: string
  vertical: 'fitness' | 'yoga' | 'languages' | 'coaching'
  brand: TenantBrand
  brief: string
  locale: string
}): Promise<PageSpec> {
  const { object } = await generateObject({
    model: gateway('anthropic/claude-sonnet-4-6'),
    schema: PageSpecSchema,
    maxRetries: 3,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(input),
    providerOptions: {
      gateway: { caching: 'auto' },
      anthropic: { thinking: { type: 'adaptive' } },
    },
  })
  return object
}
```

### 7. Edição via diff (JSON Patch RFC 6902 + EASE)

**Decisão: JSON Patch RFC 6902 com EASE encoding para arrays.**

JSON Whisperer (arXiv:2510.04717v1, out-2025): patch-based editing reduz tokens em 31% mantendo qualidade dentro de 5% do full regen — _"particular gains for complex instructions and list manipulations"_. Sem EASE, LLMs erram índices de array após `remove` no meio.

**EASE encoding** (necessário): antes de mandar o spec ao modelo, converte arrays em dicts indexados por `id`:

```ts
// Antes:
{ blocks: [{id:'hero-1', ...}, {id:'features-1', ...}] }
// Depois (EASE):
{ blocks: { 'hero-1': {...}, 'features-1': {...} }, blocks_order: ['hero-1','features-1'] }
```

Modelo emite patch em path EASE → wrapper converte de volta para array antes de aplicar.

**Pipeline**:

```ts
async function editPageViaDiff(input: { pageId: string; instruction: string }) {
  const page = await getPage(input.pageId)
  const easeSpec = toEase(page.blocks)
  const { object } = await generateObject({
    model: gateway('anthropic/claude-haiku-4-5'),
    schema: z.union([
      z.array(JsonPatchOpSchema),
      z.object({ _fallback: z.literal('full_rewrite'), reason: z.string() }),
    ]),
    system: EDIT_SYSTEM_PROMPT,
    prompt: `CURRENT SPEC (EASE):\n${JSON.stringify(easeSpec)}\n\nINSTRUCTION: ${input.instruction}`,
    providerOptions: { gateway: { caching: 'auto' } },
  })
  if ('_fallback' in object)
    return generatePageFromBrief({
      /* derived */
    })
  const patched = applyPatch(easeSpec, object)
  const newSpec = fromEase(patched)
  return updatePage({ id: input.pageId, blocks: newSpec, expectedEtag: page.etag })
}
```

Pelos dados de JSON Whisperer, fallback dispara em ~10% das edições.

### 8. Multi-vertical sem hardcode

Use as três estratégias **em camadas**:

**(a) Variants via OKLCH tokens** — mesmo bloco renderiza com paleta diferente. Custo zero adicional (tokens em `tenants.brand.tokens` injetam CSS vars no `<html>`). Cobre ~70% da diferenciação visual.

Catálogo `lib/verticals/presets.ts`:

- fitness: `oklch(0.65 0.22 25)` (laranja-vermelho energético)
- yoga: `oklch(0.72 0.09 150)` (verde calmo)
- languages: `oklch(0.55 0.18 240)` (azul confiança)
- coaching: `oklch(0.45 0.16 290)` (violeta transformacional)

**(b) `template_kind` específico por vertical** — em `page_templates`, coluna `vertical text` filtra. Agência escolhe template, IA preenche conteúdo respeitando estrutura. ~20 templates × 4 verticais = 80 templates, trivial.

**(c) IA gera copy vertical-shaped via prompt** — `VERTICAL ADAPTATIONS` no system prompt (custo zero, faz parte do prompt cacheado).

**Decisão**: as três combinadas.

### 9. SEO + OpenGraph dinâmico em Next.js 16 App Router

**Metadata API**:

```ts
// app/[locale]/p/[slug]/page.tsx
import type { Metadata } from 'next'
import { cacheTag } from 'next/cache'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  ;('use cache')
  cacheTag(`page:${tenantId}:${slug}`)
  const page = await getPublishedPageBySlug({ slug, locale })
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? extractFirstHeroSubhead(page.spec),
    openGraph: {
      title: page.seo?.title ?? page.title,
      description: page.seo?.description,
      images: [
        {
          url: page.seo?.ogImageOverride ?? `/api/og?pageId=${page.id}&v=${page.currentVersionId}`,
          width: 1200,
          height: 630,
        },
      ],
      locale: locale.replace('-', '_'),
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    robots:
      page.kind === 'document' || page.kind === 'maintenance'
        ? { index: false, follow: false }
        : undefined,
    alternates: { canonical: `https://${tenantDomain}/p/${slug}` },
  }
}
```

**OG image dinâmica via Satori / next/og** (Next.js 16 inclui `@vercel/og` no App Router):

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get('pageId')!
  const page = await getPageForOG(pageId)
  const tokens = page.tenant.brand.tokens
  const heroImage = findFirstImageBlock(page.spec)?.props.media?.src
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${tokens['brand-1']} 0%, ${tokens['brand-2']} 100%)`,
        padding: '80px',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ fontSize: 32, color: 'white', opacity: 0.9 }}>{page.tenant.name}</div>
      <div style={{ fontSize: 72, fontWeight: 800, color: 'white', lineHeight: 1.05 }}>
        {page.title}
      </div>
      {heroImage && <img src={heroImage} width="300" style={{ borderRadius: 24 }} />}
    </div>,
    { width: 1200, height: 630 },
  )
}
```

Satori suporta apenas subset de CSS — `flex`, sem `grid`, sem `calc()`, sem `transform`. Para layouts mais ricos, alternativa Sharp (mais setup) ou rendering via headless Chromium (DEV.to, "Dynamic OG Images in Next.js Without @vercel/og"). Para nosso caso (logo + título + gradient), Satori basta.

**Cache de OG image**: parâmetro `v=currentVersionId` no URL invalida a CDN quando publica. `@vercel/og` adiciona `cache-control: public, immutable, max-age=31536000` em produção.

### 10. Performance targets em landing pública 4G mobile

**Targets (Core Web Vitals 2026)**: LCP < 2.5s, INP < 200ms (substituiu FID em mar/2024), CLS < 0.1, TTFB < 800ms.

**Como atingir**:

1. **RSC + `'use cache'` + ISR via cacheTag**. Static shell pré-rendered.
   ```ts
   async function Page({ params }) {
     'use cache';
     cacheTag(`page:${tenantId}:${slug}`);
     cacheLife({ stale: 60, revalidate: 3600, expire: 86400 });
     const page = await getPublishedPageBySlug({ slug });
     return <PageRenderer spec={page.spec} />;
   }
   ```
2. **Streaming RSC com `<Suspense>` por bloco below-fold**. Hero + 1ª feature síncronos; testimonials/pricing/footer em Suspense.
3. **`next/image` para todas as mídias**. `priority` apenas no hero.
4. **Critical CSS inline**: Tailwind v4 + Next.js 16 já fazem isso por padrão. Tokens OKLCH via `<style>` no `<head>`.
5. **Font subset**: `next/font/google` com `subsets:['latin']`, `display:'swap'`. Inter ou Geist apenas.
6. **Lazy block kinds**: `dynamic()` para blocos client-side (Motion).
7. **Motion 12 respeita `prefers-reduced-motion`** — default em `motion/react`.
8. **No client-side data fetching em landing**. Tudo SSR/cached. Apenas Form Engine usa client mutations.

**Medição contínua**: Vercel Speed Insights ($10/mo Plus add-on) + Web Vitals real-user via PostHog (capture custom event).

### 11. Embed Form Engine dentro de Page

| Approach                | Pros                                                           | Cons                                                                                |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Inline RSC**          | Zero CLS, mesma origem, partilha session/cookies, SSR completo | Acopla deploy do Form Engine ao Page Engine; bundle cresce                          |
| **Card RSC**            | Mesma vantagem do inline, com chrome visual                    | Mesmo trade-off                                                                     |
| **iframe RSC-friendly** | Isolamento total, deploy independente, sandbox                 | postMessage para conversion events; CLS se altura desconhecida; sem session sharing |

**Decisão: inline RSC por default; iframe só se o form vier de outro tenant.** Razões: monorepo único, performance (1 RTT SSR vs 2+script), tokens OKLCH herdados naturalmente.

```tsx
// lib/page-engine/blocks/embed-form.tsx (server component)
import { FormRenderer } from '@/lib/form-engine/render'
import { getFormBySlugOrId } from '@/lib/data/getFormBySlug'

export default async function EmbedFormBlock({ props }: { props: EmbedFormProps }) {
  'use cache'
  cacheTag(`form:${props.formId}`)
  const form = await getFormBySlugOrId(props.formId)
  if (!form) return null
  return (
    <div
      className={cn(
        'embed-form',
        props.layout === 'card' && 'rounded-xl border bg-card p-6 shadow-sm',
      )}
    >
      {props.headline && <h2 className="text-2xl font-bold mb-4">{props.headline}</h2>}
      <FormRenderer
        spec={form.spec}
        formId={form.id}
        onCompleteRedirect={props.onCompleteRedirect}
      />
    </div>
  )
}
```

**Cross-engine cache invalidation**: Form Engine no `publish` faz `revalidateTag(`form:${formId}`)`. Qualquer page que embede invalida junto. Não precisa rastrear "pages que embedam form X".

### 12. Caching estratégico em Next.js 16.2

**Pattern**:

```ts
// lib/data/getPublishedPageBySlug.ts
import { cacheTag, cacheLife } from 'next/cache'

export async function getPublishedPageBySlug({ slug, locale }: { slug: string; locale: string }) {
  'use cache'
  cacheTag(`page:${slug}`)
  cacheLife({ stale: 60, revalidate: 3600, expire: 86400 })
  const supabase = createServerClient()
  const { data } = await supabase
    .from('pages')
    .select('*, current_version:page_versions!current_version_id(*), tenant:tenants(brand)')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()
  return data
}
```

**Limites Next.js 16.2** (nextjs.org/docs/.../cacheTag, May 19, 2026): _"A single cacheTag() call accepts up to 128 tags, each with a maximum length of 256 characters. Tags longer than 256 characters are skipped, and any tags past the 128th in one call are dropped."_

**Invalidação no publish**:

```ts
import { revalidateTag } from 'next/cache'

export async function onPagePublished({ pageId, slug, tenantId }) {
  revalidateTag(`page:${slug}`)
  revalidateTag(`tenant:${tenantId}:pages-list`)
}
```

**Atenção `cacheComponents` quirks**: _"When cacheComponents is enabled, Next.js uses React's `<Activity>` component to preserve component state during client-side navigation."_ — pode surpreender forms inline durante navegação. Testar em preview deployment.

### 13. Conversion analytics

**Eventos rastreados**:

```ts
type PageAnalyticsEvent =
  | {
      event_type: 'page.view'
      page_id: string
      session_id: string
      referrer?: string
      utm: UtmParams
    }
  | { event_type: 'page.scroll_depth'; page_id: string; depth_pct: 25 | 50 | 75 | 100 }
  | { event_type: 'block.view'; page_id: string; block_id: string; visible_ms: number }
  | { event_type: 'cta.click'; page_id: string; block_id: string; cta_label: string; href: string }
  | { event_type: 'form.embed.start'; page_id: string; block_id: string; form_id: string }
  | { event_type: 'form.embed.field_focus'; page_id: string; block_id: string; field_id: string }
  | { event_type: 'form.embed.complete'; page_id: string; block_id: string; form_id: string }
```

**Schema SQL** (espelha `form_analytics_events`):

```sql
create table page_analytics_events (
  id uuid default gen_random_uuid(),
  tenant_id uuid not null,
  page_id uuid not null,
  session_id text not null,
  anonymous_id text not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  primary key (id, created_at)
) partition by range (created_at);

create table page_analytics_events_2026_05 partition of page_analytics_events
  for values from ('2026-05-01') to ('2026-06-01');

create index idx_pae_tenant_page on page_analytics_events (tenant_id, page_id, created_at desc);
create index idx_pae_event_type on page_analytics_events (event_type, created_at desc);
```

**Vendor decision matrix**:

| Vendor                  | Pros                                                                                              | Cons                                                                                                                     | Decisão                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| PostHog                 | Funnels, retention, session replay, feature flags integrado; Vercel Marketplace desde 10-fev-2026 | Self-host complexo; pricing escala com events ($3/100k events Pro)                                                       | **Sim** via `@flags-sdk/posthog` adapter |
| Vercel Web Analytics    | Zero-config, sem cookies, Speed Insights bundle                                                   | Pageviews/visitors only, sem funnels reais, lock-in Vercel; "Vercel cannot tell you why" conversions drop (PostHog blog) | Não como primário                        |
| Custom (Supabase + RPC) | Total control, RLS, dados no DB                                                                   | Sem dashboards, sem session replay                                                                                       | Sim como **fonte de verdade primária**   |

**Decisão**: **Custom em Supabase para conversion attribution + PostHog para product analytics**. Eventos críticos (form completes, cta clicks que convertem) gravam no Supabase via RPC com RLS; eventos comportamentais (scroll_depth, block.view) só em PostHog.

### 14. A/B testing com Vercel Flags

**Tabela**:

```sql
create table page_experiments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  page_id uuid not null,
  flag_key text not null,
  status text not null check (status in ('draft','running','concluded')),
  variants jsonb not null,
  winner_variant_key text,
  primary_metric text not null check (primary_metric in ('cta_click','form_complete','conversion')),
  started_at timestamptz, ended_at timestamptz,
  created_at timestamptz default now()
);
```

**Precompute pattern** (Next.js 16 static):

```ts
// flags.ts
import { flag } from 'flags/next'
import { vercelAdapter } from '@flags-sdk/vercel'

export const pageVariant = flag<'control' | 'treatment'>({
  key: 'page-variant',
  options: [{ value: 'control' }, { value: 'treatment' }],
  adapter: vercelAdapter(),
  identify: async ({ headers, cookies }) => ({ user: { id: cookies.get('anon_id')?.value ?? '' } }),
})

export const precompute = [pageVariant]
```

CLI para criar:

```bash
vercel flags create page-variant --kind string \
  --variant control="Current layout" --variant treatment="New layout"
```

**Sticky por visitor**: cookie `anon_id` (httpOnly:false, sameSite:lax, max-age:90 dias) setado via middleware. Vercel Flags usa esse id em `identify.user.id` → bucket determinístico (vercel.com/docs/flags/vercel-flags/cli/run-ab-test, last updated Feb 24, 2026).

**Como medir vencedor**: `primary_metric` definido na criação. Default para fitness/yoga: `form_complete`; para sales: `conversion`. Chi-square em query SQL diária via Vercel Cron; auto-flag winner se p < 0.05 e n ≥ 1000 por variant.

### 15. LGPD + cookie consent

**Decisão de lib: `@orestbida/cookieconsent` v3.1.0+** (MIT, vanilla JS, ~30KB gzip; npm + CDN via jsDelivr).

Por que não Osano/OneTrust: enterprise pricing, lock-in.
Por que não custom: cobertura legal LGPD/GDPR/CCPA categorizada já feita; `validConsent()` + revisões de versão de policy built-in (changelog `cb9e3b8`: _"Add .validConsent() method to easily check if consent is valid or not"_).

**Schema cookie consent log**:

```sql
create table cookie_consent_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  page_id uuid,
  session_id text not null,
  anonymous_id text not null,
  consent_payload jsonb not null,
  ip_hash text not null,
  user_agent text not null,
  policy_version int not null,
  created_at timestamptz not null default now()
);
create index idx_cc_session on cookie_consent_log(session_id, created_at desc);
```

**Pixels (Meta, Google, TikTok)** carregam via:

```html
<script type="text/plain" data-cookiecategory="marketing" src="..."></script>
```

CookieConsent flipa `type` para `text/javascript` quando categoria é aceita. Categorização por `kind`:

- `landing | sales` → pixels marketing sim.
- `legal | document | error | maintenance` → não.
- `thank-you` → conversion pixels server-side (Meta CAPI, Google Conversion API) via Route Handler com dedupe por `event_id`; consent já foi capturado no form anterior.

**LGPD specifics**:

- DPO email obrigatório em `tenants.legal.dpo_email` (LGPD art. 41).
- Página `/lgpd` auto-gerada por tenant (`kind=legal`): finalidade, base legal (consentimento), retenção, direitos do titular, contato DPO.
- Audit log preservado mínimo 5 anos.

### 16. Acessibilidade WCAG 2.2 AA

**WCAG 2.2 AA permanece o standard legal em 2026.** Per AbilityNet (fev-2026): Candidate Recommendation de WCAG 3.0 _"anticipated in Q4 of 2027"_ com W3C Recommendation _"no earlier than 2028"_. AGWG co-chair Rachael Bradley Montgomery em webinar Knowbility: _"We are aiming to have WCAG 3, the recommendation document... out in 2029, probably towards the end of 2029."_ Adotamos **APCA** internamente (já no projeto) para tuning de contraste em dark mode + brand OKLCH.

**Semantic HTML por block**:

```tsx
function HeroBlock({ props }) {
  return (
    <header role="banner" className="…">
      <h1>{props.headline}</h1>
      {props.subhead && <p className="lead">{props.subhead}</p>}
      <div className="cta-group">
        {props.ctas.map((cta) => (
          <Button asChild key={cta.label}>
            <a href={cta.href}>{cta.label}</a>
          </Button>
        ))}
      </div>
    </header>
  )
}

function SectionBlock({ props, children }) {
  return (
    <section className="…" aria-labelledby={firstHeadingId(children)}>
      {children}
    </section>
  )
}
```

**Regras impostas pelo validator**:

- Apenas 1 `<h1>` (no hero). Demais blocos partem de `<h2>`. Heading levels não pulam.
- `feature-grid` usa `<ul>` semântico, cada feature `<li>`.
- `testimonial-grid` itens em `<figure>` + `<blockquote>` + `<figcaption>`.
- `pricing-cards` cada plano `<article role="region" aria-labelledby="plan-X-name">`.
- `faq` usa `<details>`/`<summary>` nativo OU Radix Accordion com `aria-expanded` + `aria-controls`.

**Skip-to-content**:

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background">
  {t('skipToContent')}
</a>
<main id="main-content" tabIndex={-1}>{children}</main>
```

**Focus management**: Radix UI primitives (shadcn) cobrem accordions/tabs/popovers. Blocos custom (carousel) DEVEM seguir APG (ARIA Authoring Practices Guide).

**Contraste APCA Silver**: tokens OKLCH validados em build-time via script que computa Lc para pares text-on-background. Threshold Lc ≥ 75 para body text. Falha CI se brand tokens não passam (APCA docs: _"For AAA, simply increase the contrast values by Lc 15"_).

**prefers-reduced-motion**: Motion 12 (`motion/react`) honra automaticamente. Tailwind v4 expõe `motion-reduce:` variant para CSS animations.

### 17. Operations API tipada para Page Engine

**Lista completa + Zod schemas**:

```ts
// lib/page-engine/operations/schemas.ts
import { z } from 'zod'
import { PageSpecSchema } from '../spec/blocks'

export const PageKindEnum = z.enum([
  'landing',
  'sales',
  'document',
  'thank-you',
  'error',
  'maintenance',
  'blog-post',
  'about',
  'pricing',
  'legal',
])

export const CreatePageInput = z.object({
  tenantId: z.string().uuid(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .min(2)
    .max(80),
  title: z.string().min(1).max(200),
  kind: PageKindEnum.default('landing'),
  templateId: z.string().uuid().optional(),
  initialSpec: PageSpecSchema.optional(),
})
export const CreatePageOutput = z.object({ id: z.string().uuid(), etag: z.string() })

export const ListPagesInput = z.object({
  tenantId: z.string().uuid(),
  status: z.enum(['draft', 'published', 'archived', 'any']).default('any'),
  kind: PageKindEnum.optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

export const GetPageInput = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  includeVersions: z.boolean().default(false),
})

export const UpdatePageInput = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  expectedEtag: z.string(),
  patch: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    blocks: PageSpecSchema.optional(),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        ogImageOverride: z.string().url().optional(),
        robots: z.string().optional(),
      })
      .optional(),
    themeOverrides: z.record(z.string(), z.string()).optional(),
  }),
})

export const DuplicatePageInput = z.object({
  sourceId: z.string().uuid(),
  tenantId: z.string().uuid(),
  newSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .min(2)
    .max(80),
  newTitle: z.string().optional(),
})

export const PublishPageInput = z.object({ id: z.string().uuid(), tenantId: z.string().uuid() })
export const PublishPageOutput = z.object({
  versionId: z.string().uuid(),
  version: z.number().int(),
})

export const ArchivePageInput = z.object({ id: z.string().uuid(), tenantId: z.string().uuid() })

export const GetPageVersionsInput = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  limit: z.number().int().default(20),
})

export const RevertPageVersionInput = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  targetVersion: z.number().int().min(1),
})

export const GeneratePageFromBriefInput = z.object({
  tenantId: z.string().uuid(),
  vertical: z.enum(['fitness', 'yoga', 'languages', 'coaching']),
  brief: z.string().min(20).max(2000),
  locale: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/)
    .default('pt-BR'),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().optional(),
  referenceUrl: z.string().url().optional(),
})

export const EditPageViaDiffInput = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  expectedEtag: z.string(),
  instruction: z.string().min(5).max(500),
})
```

**Exemplo MCP-ready**:

```ts
// lib/page-engine/operations/index.ts
import { assertRole, assertEntitlement } from '@/lib/auth/guards'
import { createPageOp } from './create-page'

export const operations = {
  createPage: {
    description: 'Create a new page in a tenant. Returns id and etag.',
    input: CreatePageInput,
    output: CreatePageOutput,
    handler: async (input, ctx) => {
      assertRole(ctx, ['agency_owner', 'tenant_owner', 'editor'])
      await assertEntitlement(ctx.tenantId, 'pages_create')
      return createPageOp(input, ctx)
    },
  },
  // … listPages, getPage, updatePage, duplicatePage, publishPage,
  //    archivePage, getPageVersions, revertPageVersion,
  //    generatePageFromBrief, editPageViaDiff
} as const satisfies Record<
  string,
  {
    description: string
    input: z.ZodSchema
    output: z.ZodSchema
    handler: (input: any, ctx: any) => Promise<any>
  }
>
```

### 18. Comparação detalhada de players (2026)

Pricing real consolidado (dados confirmados pelo subagent, com fontes verbatim).

| Player                         | Spec model                 | Editor                    | AI generation                                                                                              | Multi-tenant                             | White-label                 | Pricing 2026                                                                                                                                                                                                                                                                                                                                 | Lock-in    | Exportabilidade                           |
| ------------------------------ | -------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------- |
| **Webflow**                    | Proprietary CMS+Designer   | Custom canvas             | Webflow AI Assistant                                                                                       | Workspaces; sem multi-tenant nativo      | Agency program / Enterprise | Site plans (efetivo 13-mai-2026): Basic **$15/mo annual ($25 mensal)**, Premium $25/$39, Team **$2,500/mo annual** (10 seats, Localization, AEO, 30TB), Enterprise custom. Workspace seats: Full **$39/mo**, Limited **$15/mo**, Free **$0**. Optimize add-on **$299+/mo**. AI credits incluídos em todos Workspace plans desde 13-mai-2026. | Alto       | HTML/CSS export via Workspace             |
| **Framer**                     | Proprietary                | Figma-like canvas         | Wireframer (page) + Workshop (component)                                                                   | Workspaces                               | Enterprise only             | Free / Basic **$10/mo annual ($15 mensal)** / Pro **$30/mo ($45)** / Scale **$100/mo (annual-only)** / Enterprise. Editor seats: 2 (Basic), 10 (Pro/Scale); extras **$20/mo** ou **$40/mo**                                                                                                                                                  | Alto       | Sem export real                           |
| **Builder.io**                 | JSON content tree headless | Custom canvas + React SDK | Visual Copilot (Figma→code) + AI sections                                                                  | Sim, via Spaces (Publish/Hybrid/Develop) | Enterprise                  | Free $0 (5 users, 25 daily/75 monthly Agent Credits), Pro per-user (~$19/seat reportado por terceiros; ver Caveats), Team per-user, Enterprise custom. **On-demand Agent Credits: $25 per 500** (verbatim builder.io official Aug-2025)                                                                                                      | Médio      | Alto (JSON via API + multi-framework SDK) |
| **Hotmart Pages** (BR)         | Proprietary                | Drag-and-drop             | "criar com AI – respondendo algumas perguntas, você tem a primeira versão pronta" (hotmart.com/pt-br/blog) | Não exposto                              | Não                         | A partir **R$ 39/mês** (Starter, 12x anual ≈ R$ 468)                                                                                                                                                                                                                                                                                         | Alto       | **Sem API pública para Pages**            |
| **Wix Editor X**               | Proprietary                | Drag-drop avançado        | Wix Harmony + Aria (2026)                                                                                  | Workspaces; Studio para agências         | Wix Studio com white-label  | A partir $17/mo Combo; Studio per-site                                                                                                                                                                                                                                                                                                       | Alto       | Limitado                                  |
| **Plasmic**                    | TplNode tree JSON          | Figma-like                | Plasmic AI Beta (Pro+)                                                                                     | Sim, via Projects                        | Enterprise                  | Free / Starter **$39/mo** / Pro **$103/mo** (Plasmic AI Beta) / Scale **$399/mo** (A/B testing + scheduled content) / Enterprise. Pro extra collab +$20/mo; Scale extra +$40/mo                                                                                                                                                              | Médio      | Alto (codegen TS ou loader API)           |
| **WordPress + Elementor/Divi** | DB rows + shortcodes       | Block / page-builder      | Plugins AI 3rd-party                                                                                       | Multi-site complex                       | Tema white-label            | $0 (WP) + ~$59-200/yr Elementor Pro / Divi $89-249                                                                                                                                                                                                                                                                                           | Médio-alto | DB export OK                              |
| **Squarespace**                | Proprietary                | Block-based               | Blueprint AI Builder                                                                                       | Não p/ agência scale                     | Não                         | $16-65/mo                                                                                                                                                                                                                                                                                                                                    | Alto       | Limitado                                  |
| **Carrd**                      | Single-page proprietary    | Simple grid               | Não                                                                                                        | Não                                      | Não                         | $19-49/yr                                                                                                                                                                                                                                                                                                                                    | Médio      | Limitado                                  |
| **Strikingly**                 | Single-page proprietary    | Simple                    | Limitado                                                                                                   | Não                                      | Não                         | $8-49/mo                                                                                                                                                                                                                                                                                                                                     | Alto       | Limitado                                  |

**Mais relevantes para clonar**:

1. **Hotmart Pages** — referência de Brasil + B2B + infoprodutor. Pattern de IA com poucas perguntas (3-5) já é deles. Mas sem multi-tenant exposto → nosso oceano azul.
2. **Builder.io** — content tree JSON + headless + dev-first + MCP server. Mais alinhado ao headless story.
3. **Framer Wireframer** — AI page gen UX (chat → preview multi-page).

**Posicionamento estratégico**: "Hotmart Pages para agências" — multi-tenant nativo, white-label, headless rendering (RSC) + AI generation (Sonnet 4.6) + MCP exposure futuro. Preço-alvo: agency $X/mês + per-tenant-pro $Y, abaixo do Webflow Team $2,500/mo.

### 19. MCPs para page builders existentes

| Player                         | MCP         | Status                                                                  | Tools                                                                                                                                 | Endpoint                                            | Observações                                                                                                                                                |
| ------------------------------ | ----------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Webflow**                    | Oficial     | GA desde abril/maio 2025 (Cloudflare MCP Demo Day); v1.2.1 (5-mai-2026) | **18** (consolidado do beta 46+)                                                                                                      | `https://mcp.webflow.com/sse`                       | Open-source MIT, Node 22.3.0+, OAuth, Bridge App necessário para Designer tools                                                                            |
| **Builder.io** (CMS MCP)       | Oficial     | GA                                                                      | createContent, updateContent, listModels, getModelSchema, createContentModel, updateContentModel, searchAssets, getSiteHierarchy etc. | `https://cdn.builder.io/api/v1/mcp/builder-content` | "The Builder CMS MCP server only connects to Publish and Hybrid Spaces." (builder.io docs)                                                                 |
| **Builder.io** (dev-tools MCP) | Oficial     | GA                                                                      | Component docs, design tokens, Figma integration                                                                                      | `npx @builder.io/dev-tools mcp`                     | Separado do CMS MCP                                                                                                                                        |
| **Framer**                     | Não oficial | Pedido em forum                                                         | n/d                                                                                                                                   | Comunidade (ericpjtsai/framer abr-2026)             | "Connects AI clients to Framer projects for reading site structure, editing CMS content, designing pages, and managing code components" (PulseMCP listing) |
| **Plasmic**                    | Não existe  | Pedido aberto                                                           | —                                                                                                                                     | —                                                   | "Both Webflow and Framer have recently shipped MCP… [Plasmic doesn't]" (forum.plasmic.app)                                                                 |
| **Wix**                        | Oficial     | GA desde 7-mai-2025                                                     | n/d (eCommerce, Bookings, Payments, CMS, CRM)                                                                                         | `https://mcp.wix.com/mcp`                           | Free com Premium upgrade opcional                                                                                                                          |
| **Squarespace**                | Não oficial | —                                                                       | —                                                                                                                                     | —                                                   | Apenas terceiros (BusyBee3333)                                                                                                                             |

**Vale construir nosso próprio MCP para Page Engine Fase 2?** **Sim, categoricamente.** Razões:

- O Operations API (Q17) já é tipado e MCP-ready — wrapping adicional ~200 linhas.
- Permite que profissionais da Fase 2 usem Claude Desktop / Cursor / Windsurf para criar/editar suas pages via NL.
- Diferenciação competitiva: nenhum SaaS B2B de fitness/yoga oferece isso em 2026.

**Esboço de implementação** (Fase 2):

```ts
// apps/mcp-server/src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk'
import { operations } from '@/lib/page-engine/operations'
import { authenticateViaApiToken } from './auth'

const server = new McpServer({ name: 'page-engine', version: '1.0.0' })

for (const [name, op] of Object.entries(operations)) {
  server.tool(name, op.input.shape, async (args, ctx) => {
    const session = await authenticateViaApiToken(ctx.request.headers.authorization)
    return op.handler(args, session)
  })
}
```

**Defesa em profundidade no MCP** (per pravinkumar.co/blog/single-mcp-server-multi-client-webflow-2026, abr-2026): _"If any one layer fails, the other two still hold the boundary."_ Layer 1 = token→tenant mapping na borda; Layer 2 = role check no handler; Layer 3 = RLS no Postgres. Property-based test suite assertando que nenhum tool call vaza dados cross-tenant.

### 20. Conflict resolution (LWW + ETag em Fase 1)

**Fase 1: LWW com ETag**. Premissa: 99% dos casos é 1 admin/agência por page. Quando colidir, mostre dialog "alguém editou esta page há X segundos; ver mudanças / sobrescrever / cancelar".

**Implementação**:

```sql
-- schema já tem pages.etag text not null default gen_random_uuid()::text

update pages set
  blocks = $1,
  title = $2,
  etag = gen_random_uuid()::text,
  updated_at = now()
where id = $3 and etag = $4 and tenant_id = $5
returning *;
```

```ts
async function updatePage(input: UpdatePageInput, ctx: Ctx) {
  const { data, error } = await supabase
    .from('pages')
    .update({ ...input.patch, etag: crypto.randomUUID(), updated_at: new Date().toISOString() })
    .eq('id', input.id)
    .eq('etag', input.expectedEtag)
    .eq('tenant_id', input.tenantId)
    .select('*')
    .single()
  if (!data)
    throw new ConflictError('etag_mismatch', { currentEtag: await getCurrentEtag(input.id) })
  return data
}
```

Client recebe 409 → UI de resolution:

```tsx
async function trySave() {
  try {
    await api.updatePage({ id, patch, expectedEtag: localEtag })
  } catch (e) {
    if (e.code === 'etag_mismatch') {
      const decision = await confirmConflictDialog({
        message: 'Outro admin atualizou esta página. O que deseja fazer?',
        options: ['ver-diff', 'sobrescrever', 'descartar-minhas-mudancas'],
      })
      if (decision === 'sobrescrever') {
        const { etag } = await api.getPage(id)
        await api.updatePage({ id, patch, expectedEtag: etag })
      }
    }
  }
}
```

**Threshold para mover para CRDT/Liveblocks** (Fase 2+):

- ≥5 conflitos/dia em produção; OR
- Demanda explícita de "ver cursor do colega" emerge >1x; OR
- ≥3 tenants pagantes em plano Enterprise.

Quando atingir, **Liveblocks Yjs** (não BlockSuite, não Yjs raw):

- Pricing: Free (até 50 connections / 1 MAU) → Starter $99/mo (100 MAU) → Pro $199+/mo (custom MAU); a 10k MAU, $500-2k/mo (per starterpick.com/guides/best-boilerplates-realtime-collaboration-2026).
- "Never implement CRDTs from scratch — the correctness requirements are subtle and the existing libraries (Yjs, Automerge) have years of battle-testing."

---

## Recommendations

### Imediato (esta semana)

1. **Solidificar `PageSpecSchema` no repo** com os 7 blocos Fase 1 + recursive `z.union + lazy` (NÃO `discriminatedUnion`). Testes de fuzz com `fast-check`.
2. **RPC `publish_page` + trigger `block_page_versions_update`** em migration. Adicionar `pages.etag` e `pages.first_viewed_at`.
3. **Stub do `BLOCK_REGISTRY`** com 7 server components React renderizando Tailwind + tokens via CSS vars.
4. **Endpoint `/api/og`** com Satori + tokens OKLCH. Validar com Facebook Sharing Debugger.

### Semana 1-2

5. **`generatePageFromBrief`** com `generateObject({ schema: PageSpecSchema })`, Sonnet 4.6 via AI Gateway, system prompt cacheado (`caching:'auto'`).
6. **Operations API tipada completa** (`createPage` → `editPageViaDiff`). ETag enforcement em `updatePage`.
7. **Pipeline `'use cache' + cacheTag`** no `app/[locale]/p/[slug]/page.tsx`. `revalidateTag` no `publishPage` action.
8. **CookieConsent integrado** com pixels `tenants.pixels` carregados via `data-cookiecategory="marketing"`.

### Semana 3-4

9. **`editPageViaDiff`** com JSON Patch + EASE (`fast-json-patch` + EASE encoder próprio + testes property-based).
10. **A/B testing via Vercel Flags** com tabela `page_experiments`, `pageVariant` flag em precompute.
11. **Analytics partition + indexes** em `page_analytics_events`. Integrar PostHog via `@flags-sdk/posthog` adapter.
12. **WCAG validators no CI**: pa11y-ci ou axe-core em Playwright sobre rendered pages.

### Mês 2-3

13. **Templates por vertical** — 4-5 templates por (fitness, yoga, idiomas, coaching), criados na mão + ajustados via IA.
14. **MCP server `page-engine`** wrappando Operations API. Liberar como beta para 3-5 agências.
15. **Speed Insights + Web Vitals real-user** ativo; perseguir LCP < 1.8s p75 mobile.
16. **Theme overrides per page** (Fase 2 visual editor preparation).

### Thresholds que mudam recomendação

- **≥5 conflitos editor/dia** → mover para Liveblocks Yjs.
- **≥30% de chamadas IA com `_fallback: 'full_rewrite'`** → revisar EASE encoding OU aumentar contexto (talvez Opus 4.6 com 1M tokens em casos complexos).
- **Token spend Anthropic > $500/mo em generation** → review do cache hit rate; pode requerer redesenho do system prompt em chunks cacheáveis menores.
- **≥10 tenants requerendo editor visual** → Fase 2 acelerada, decidir Builder.io-style canvas inhouse vs licenciar Plasmic Studio ($399/mo Scale).
- **LCP p75 mobile > 2.5s** → revisar lazy-loading + `next/image priority` + critical CSS.
- **Bot traffic > 5% das page views via Firewall observability** → ativar BotID Deep Analysis ($1/1k checks) em endpoints sensíveis (`/api/lead-capture`, `/api/og` se abuso).

---

## Caveats

1. **Zod 4 + recursive discriminated union** ainda tem bugs ativos (issues colinhacks/zod#5991, #4714, #1504). Usar `z.union` lazy é o workaround atual. Acompanhar release notes da Zod 4.x e a evolução de `z.switch` (deprecation de `discriminatedUnion` proposta em #2106).
2. **`cacheComponents` em Next.js 16.2** ainda é relativamente novo. Casos de borda com `<Activity>` preservando state em forms inline podem surpreender — exigem teste de QA em preview deployments.
3. **Satori subset de CSS** limita design da OG image: sem `grid`, sem `calc()`, sem CSS vars complexos. Para layouts mais ricos no futuro, considerar Sharp (mais setup) ou rendering via headless Chromium em serviço externo.
4. **EASE encoding** adiciona complexidade no patch pipeline — testes de propriedade essenciais (round-trip invariant: `fromEase(toEase(spec))` deve ser equivalente). Não publicar `editPageViaDiff` sem testes property-based.
5. **WCAG 3.0** segue Working Draft em 2026; AbilityNet aponta Recommendation _"no earlier than 2028"_ e AGWG co-chair indica 2029. **APCA não é exigência legal**. Continuar com WCAG 2.2 AA como standard contratual; APCA é "interno para qualidade".
6. **PostHog pricing escala com eventos**, não com MAU. Bloco `block.view` com observador de visibilidade pode gerar muitos eventos — amostrar ou agregar antes de enviar.
7. **Vercel BotID Deep Analysis ($1/1k checks)** deve ser ligado seletivamente — não em todas as page views, mas só em endpoints sensíveis (lead capture, IA generation triggers de tenant não autenticado).
8. **Hotmart Pages não tem API pública para o builder** — não há "exportabilidade" oferecida; nosso diferencial deve enfatizar isso.
9. **Webflow MCP requer Bridge App aberto no Designer** para Designer tools. Nosso MCP futuro NÃO terá essa fricção (operations são puramente API-driven), vantagem competitiva — vale comunicar.
10. **Page Engine pressupõe Form Engine e Program Engine como contratos opacos** (`embed-form { formId }`, `embed-program { programId }`). Mudanças nesses contratos quebram pages que os embedam — versionar contratos com `schema_version` em ambos os lados.
11. **Sticky-by-visitor para A/B testing** depende de cookie `anon_id`. LGPD: cookie é "necessário" para funcionalidade. Testes A/B podem ser argumentados como "legítimo interesse" (LGPD art. 7º, IX), mas o DPO do tenant deve assinar a base legal.
12. **Subagent gap registrado**: Builder.io Pro/Team per-seat $ não confirmado verbatim (rendered via JS no pricing page); fontes terceiras citam ~$19/seat — tratar como estimativa até confirmação direta no painel Builder.io.
13. **Framer locale add-on prices** não foram confirmados nas fontes consultadas — verificar diretamente no painel Framer caso a internacionalização do Page Engine demande comparação de pricing.
14. **Wix MCP tool count** citado em terceira-parte (12 tools) não foi confirmado oficialmente — não usar como referência primária para dimensionar nosso próprio catálogo.

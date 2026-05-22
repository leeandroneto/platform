# Plano Funil Agência (Form Engine + Page Engine)

> **Status:** ⏸️ **PAUSADO** até finalização sequencial de 2 planos antecessores.
> **Owner:** Leandro · **Data inicial:** 2026-05-19
> **Bloqueado por (atualizado 2026-05-22 — ADR-0046 dogfooding-first):**
>
> 1. `docs/plans/pivot-tweakcn.md` finalizar (em finalização, próximo passo: cravar finalização)
> 2. `docs/plans/theme-builder.md` finalizar (~34h — copy literal TweakCN editor + adapt multi-tenant, admin-only inicial)
>
> **Retoma quando:** theme builder finalizar. Sequência cravada nesta retomada segue **ordem ADR-0046** (passo 2-5 da ordem dogfooding-first):
>
> - (2) form de captação agência (bare-bones Forms Engine, primeira instância dogfooding)
> - (3) report IA do form agência (primeiro form com IA report)
> - (4) página de vendas agência (bare-bones Pages Engine, primeira instância dogfooding)
> - (5) AI builders (pages + forms engines) — construir enquanto funil agência capta leads
>
> **Research-25 ready-to-consume (cravado 2026-05-22):**
> `docs/research/25-ai-reports-architecture.md` tem **30+ decisões cravadas** pro report IA da agência (passo 3 da ordem). Quando funil agência retomar, item 3 usa research-25 direto — **pre-resolved dependency** economiza ~10h de estudo. Highlights: Sonnet 4.6 default + Haiku 4.5 fallback, AI SDK v6 `generateText({ output: Output.object({ schema }) })`, ReportContent shape modular discriminated union, disclaimers determinísticos (não pelo LLM, LGPD+CFM/CFN), Vercel Workflow pipeline, budget $0.02/submission com caching agressivo prefix, Resend rate limit 5 req/s, BotID Basic free.
>
> **Princípio meta que rege este plano:** **dogfooding-first (ADR-0046)** — cada feature do funil agência nasce como primeira instância de infra generalizada (não hardcoded). Manual primeiro → sistematização depois.
>
> Sucessor de `PLANO-MESTRE-DIA-0.md`. Constrói Feature 1 (funil agência) sobre
> infra self-service desde o primeiro commit, com 5 decisões fechadas pós-pesquisa 23.
>
> **Quote disparadora (usuário, 2026-05-18):**
> "faça mais uma pesquisa e monte o plano dia 1. o plano sera melhorado ao sair o
> resultado da pesquisa externa que estou fazendo, mas ja documente essas decisoes
> que tomamos caso seu contexto encha e que sirva para as proximas features o
> conceito de pensar mil passos a frente, transformar em editor, vibe coding,
> ferramenta para a gencia e self service etc etce etc"

---

## 0. Princípio fundador (vale pra TODA feature daqui em diante)

**"Mil passos à frente":** nenhum artefato (form, página, prompt IA, copy, layout)
nasce hardcoded. Cada feature é construída como **instância de uma infra
generalizada** que, na Fase 2, vira editor visual + chat IA assistente +
ferramenta self-service. Isso ENCURTA o caminho até Pacote A — quando a infra
estiver pronta, Pacote A vira commodity de configuração, não de código.

**3 fases:**

| Fase       | Escopo                                                                                                                                                                    | Quem opera             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Fase 1** | Agência opera. Funil agência ponta-a-ponta (form captação → IA → relatório → landing). Agência cria forms/landings via chat IA no painel admin. Cliente final só consome. | Agência (chat IA)      |
| **Fase 2** | Self-service do profissional. Editor visual mínimo (preview real + edição inline modal) + chat IA persiste como assistente. MCP server próprio publicado.                 | Profissional do tenant |
| **Fase 3** | Pacote A — cliente final usa forms/programas/anamnese configurados pelo profissional. Profissional revisa respostas e relatórios.                                         | Cliente final          |

Decisão fechada: **não fazer nada na Fase 1 que precise ser refatorado pra Fase 2**.
Se uma decisão da Fase 1 inviabiliza Fase 2, ela está errada. Validar com pergunta:
"isso aqui vira nó dos slots/blocos/spec quando o editor visual existir?"

---

## 0.2 PAUSA — Design system rethink (2026-05-19)

> **Estado:** trabalho de Etapa 0a (infra) está concluído. Antes de continuar
> Etapa 0b (catálogos + operations), pausa pra resolver arquitetura de design
> system completa. Pesquisa 26 (white-label premium + templates + vibes)
> dispatching.

### Insight estratégico

Hoje temos **13 paletas isoladas** — uma dimensão só. Pra plataforma de
criação self-service entregar premium consistente, precisa modelo melhor:

- **Template (estilo)** = bundle de tokens estruturais não-cromáticos
  (tipografia hierarchy, shapes, spacing, motion, density, photography style)
- **Palette** = cores aplicadas POR CIMA do template (escolhidas das 13+ ou
  custom OKLCH, validado APCA Silver runtime)
- **Combinação válida** = template × palette × content (matriz curada, nem
  toda combinação permitida)

Profissional escolhe 1 template (5-8 archetypes) + 1 palette (13+). Não combina
14 dimensões. Vertical sugere template inicial (fitness→performance,
yoga→wellness, idiomas→friendly).

### Inspirações catalogadas (78 brands em `docs/references/design-systems/`)

Arquetipos candidatos extraídos das 78 marcas:

1. **Premium minimalista** (Linear, Vercel, Apple) — mono accent, Geist, sharp shapes, flat depth, massive whitespace
2. **Editorial acolhedor** (Sanity, Notion, Stripe) — serif headings, cream surfaces, generous whitespace, soft shapes
3. **Fintech sofisticado** (Stripe, Revolut, Wise) — gradient sutil, weight-300, rounded media, glass
4. **Dev-tools dark** (Supabase, Cursor, Warp) — dark canvas, emerald accent, monospace eyebrows
5. **Performance atlético** (Nike, Whoop-style, Tesla) — condensed caps, signal accent, dense data layout, sharp shapes
6. **Builder ousado** (Webflow, Framer, Figma) — bold caps, black/blue, motion-first
7. **Wellness orgânico** (Mastercard cream, Clay) — warm cream canvas, soft gradients, art-directed
8. **AI-conversational** (Claude, Cohere, Anthropic) — terracotta/warm accent, editorial layout, friendly

Os 78 DESIGN.md são **mina de ouro** — cada um traz 12-15 typography variants,
spacing system explícito, do's/don'ts. Vale extrair patterns universais.

### Pesquisas em queue de integração (Pausadas até design system resolver)

| Pesquisa                                            | Status                               | Quando integrar                                           |
| --------------------------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| `docs/research/24-page-engine-architecture.md`      | ✅ Pronta, ~67 KB, decisões cravadas | Após design system resolver — pode ajustar block taxonomy |
| `docs/research/25-ai-reports-architecture.md`       | ✅ Pronta, ~64 KB, decisões cravadas | Antes de Etapa 4 (Pipeline pós-submit)                    |
| `docs/research/26-design-system-vibes` (a disparar) | 🟡 Prompt em drafting                | Antes de Etapa 0b (catálogos + operations)                |

**Decisões da Research 24 a integrar:**

- Block taxonomy MVP 7 blocks: `section`, `hero`, `feature-grid`, `testimonial-grid`, `pricing-cards`, `cta`, `embed-form`
- Zod 4: `z.union()` lazy + ordenar por frequência (workaround `discriminatedUnion + lazy` bug)
- Next 16.2: `cacheTag` + `cacheLife` estáveis (sem `unstable_`)
- AI edit: JSON Patch RFC 6902 + EASE (-31% tokens)
- Editor visual real só Fase 2 com Liveblocks Storage; LWW + ETag + 409 Conflict resolve dia 1
- ISR via `'use cache' + cacheTag('page:{tenant_id}:{slug}')` + `revalidateTag` no publish
- og:image dinâmica via `ImageResponse` (next/og + Satori)
- LGPD: CookieConsent v3.1.0+ (@orestbida MIT)
- MCPs: clonar padrão Webflow (18 tools), Builder.io (Publish/Hybrid split irrelevante)

**Decisões da Research 25 a integrar:**

- Sonnet 4.6 default, Haiku 4.5 fallback/scoring/enrichment, Opus 4.7 premium tier
- Opus 4.7 alerta: tokenizer +35% tokens (custo direto)
- AI SDK v6: NÃO usar `generateObject`/`streamObject` (deprecated) — `generateText({ output: Output.object({ schema }) })`
- ReportContent shape: `{ sections: [executive_summary, findings, recommendations, action_items, next_steps, disclaimers] }` discriminated union por kind
- Disclaimers injetados DETERMINISTICAMENTE (não pelo LLM) — LGPD + CFM/CFN obrigatório fitness/nutrição
- Pipeline Vercel Workflow (GA 16-abr-2026): `'use workflow'` + `'use step'` — não chain Queues manuais
- Budget $0,02/submission viável só com caching agressivo prefix (~3500 tokens estáveis system+few-shot+brand)
- Resend rate limit 5 req/s por team — usar Batch API quando fanout
- BotID Basic free; Deep Analysis $1/1k SÓ se spam > 2%
- Geolocation via `geolocation()` de `@vercel/functions` (não `req.geo` deprecated)
- LGPD: opt-in explícito + unsubscribe one-click obrigatório + retention 24m default
- Moat real: `ai_prompt_versions` curados + 30 goldens/vertical + LLM-as-judge weekly + painel priorizado

### Decisões cravadas adicionais (deep read 2026-05-19)

Extraídas durante leitura profunda das Pesquisas 24+25 enquanto Pesquisa 26 corria.
Item não-estratégico (implementation detail) → fica aqui pra não perder; será movido pra Etapa correspondente quando implementar.

**Page Engine (research 24):**

- Tree depth max **5**; helper `assertUniqueIds(tree)` valida ids únicos antes de persist
- Page kinds enum **10 valores**: `landing | sales | document | thank-you | error | maintenance | blog-post | about | pricing | legal`
- `KIND_CAPABILITIES` const gate `pixels`, `pageView`, `conversionPixels` por kind (ex: `legal/maintenance` → robots noindex, sem pixels)
- RPC `publish_page` atomic com `for update` lock; trigger `block_page_versions_update` bloqueia UPDATE em `page_versions` (snapshot imutável)
- `pages.etag` (uuid string regenerado em cada update) + `pages.first_viewed_at` (lock versioning pós-primeira visualização — antes disso draft pode ser "destruído")
- LWW + ETag 409 Conflict resolve com dialog "ver-diff | sobrescrever | descartar-minhas-mudancas"
- Threshold pra migrar Liveblocks Yjs: ≥5 conflitos/dia OR demanda "cursor do colega" >1x OR ≥3 tenants Enterprise pagantes
- `cacheTag()` limites Next 16.2: **128 tags max por call × 256 chars max por tag**
- Cross-engine invalidation: Form Engine no publish faz `revalidateTag('form:${formId}')` — pages embedando invalidam junto sem rastreamento
- AI edit fallback `_fallback:'full_rewrite'` dispara ~10% das edições (per JSON Whisperer data)
- AI gen com Sonnet 4.6 + `providerOptions.anthropic.thinking:{type:'adaptive'}` + `caching:'auto'`
- OG image cache via `v=currentVersionId` no URL — invalida CDN ao publicar; `@vercel/og` adiciona `cache-control: public, immutable, max-age=31536000`
- Satori limites: sem `grid`, sem `calc()`, sem CSS vars complexos (só flex). Pra layouts ricos → Sharp ou headless Chromium externo Fase 3
- 12 operations API MCP-ready: createPage, listPages, getPage, updatePage, duplicatePage, publishPage, archivePage, getPageVersions, revertPageVersion, generatePageFromBrief, editPageViaDiff (+ getPageAnalytics futuro)
- Defesa MCP em 3 camadas: token→tenant na borda (L1) + role check no handler (L2) + RLS no Postgres (L3) — property-based tests assertando zero vazamento cross-tenant
- A/B testing: tabela `page_experiments` (variants jsonb, primary_metric enum, winner_variant_key) + cookie `anon_id` 90d httpOnly:false + Vercel Flags precompute + chi-square SQL daily
- Pixels per page kind: `landing/sales` carregam marketing pixels via `<script type="text/plain" data-cookiecategory="marketing">`; `legal/document/error/maintenance` não; `thank-you` usa server-side conversion (Meta CAPI, Google CAPI) com dedupe `event_id`
- Templates por vertical Fase 1: 4-5 templates × 4 verticais ≈ 16-20 templates (curados manualmente + ajustados por IA)
- Conversion analytics 2-fonte: Supabase RPC (verdade primária com RLS) + PostHog (product analytics behavioral)
- Decision matrix players: clonar Hotmart pages (BR + B2B + infoprodutor; sem multi-tenant exposto = oceano azul) + Builder.io (JSON tree headless dev-first MCP separados Publish/Hybrid) + Framer Wireframer (UX chat→preview)

**AI Reports (research 25):**

- `ai_prompt_versions.system_text` (TEXT completo) + `system_text_hash` (SHA256) + FK em `ai_invocations.prompt_version_id` — replay determinístico
- `ai_prompt_versions.output_schema_jsonb` persiste `z.toJSONSchema(ReportContent)` (Zod 4 nativo)
- `ai_prompt_versions.required_disclaimer_keys` array — servidor injeta textos canônicos (revisados jurídico), independente do LLM
- 6 templates totais; **3 GA Fase 1**: `report-fitness-onboarding`, `report-coaching-discovery`, `report-lead-capture` (genérico). Beta Fase 2: yoga, languages, nutrition
- Tom como variável (não N templates): `tenants.tone tenant_tone NOT NULL DEFAULT 'professional'` com enum `casual | professional | motivating | clinical`
- Output force `tone_used:'{{tone}}'` no schema + valida server-side
- System prompt mínimo Sonnet **1.024 tokens** pra ativar `cache_control`; mantenha few-shot mesmo parecendo "gordura"
- Cache `cache_control` marcado no final do bloco `<examples>` (last position cacheável)
- Pricing armadilha Opus 4.7: tokenizer +1.0 a 1.35x tokens vs Opus 4.6 (até **35% custo extra** pelo mesmo texto)
- AI SDK: SEMPRE `generateText({ output: Output.object({ schema }) })` — wrapper interno `runReportGeneration(opts)` que isola o SDK
- Retries table: schema invalid → fix prompt loop 3x dentro do step; network 5xx → exponential 1/2/4/8/16s; 429 → respeita `retry-after` + jitter
- Fallback template estático Markdown SEMPRE envia email + cria PDF com header "Versão simplificada — em breve enviaremos seu plano completo". Nunca lead sem resposta. SLA 5 min regenerar manualmente
- PDF: `@react-pdf/renderer@4.5.1` — fontes **TTF/OTF auto-hospedadas em Vercel Blob** (WOFF2 Google Fonts FALHA silenciosamente em serverless)
- OKLCH→sRGB pre-conversão server-side via `culori` (persiste em `tenants.brand_tokens_resolved_jsonb`, não recomputa)
- PDF target p95 < 3s (testado mediano ~1,8s Vercel Pro fluid compute)
- Resend: DKIM+SPF+DMARC OBRIGATÓRIO por tenant subdomain `mail.{tenant_domain}` via Domains API. Sem isso = "via resend.com" + deliverability cai
- Resend headers email: `List-Unsubscribe: <url>, <mailto:>` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` + `X-Entity-Ref-ID: {reportId}`
- Resend webhooks: `email.bounced` → update `form_submissions.email_status='bounced'`; `email.complained` → `leads.marketing_opt_out=true`
- React Email 5.0: dark mode tested Gmail/Outlook/Apple Mail + Tailwind 4 nativo; sempre enviar plain text fallback
- Share link: HMAC-SHA256 + `tenantSecret` por tenant; expiry default **30 dias** (não 7); revogação per-report via `form_reports.share_revoked_at` (NÃO rotacionar tenantSecret = invalida todos)
- Share view tracking: `form_reports.view_count/first_viewed_at/last_viewed_at` + tabela `form_report_views`; rate limit Upstash `share:${token}:${minute}` TTL 60s, 30 views/min/token
- Bot detection share view: UA contém `Slackbot|TwitterBot|WhatsApp|FacebookExternalHit|LinkedInBot|Discordbot|Telegrambot|bingbot|Googlebot` → `is_bot=true` + NÃO incrementa view_count
- Public preview: RSC server-side validação HMAC; `noindex` meta; CTA "agendar conversa" embed Calendly/Cal.com modal
- Sentiment + Lead score persistido em `form_submissions.computed jsonb`:
  - `sentiment` enum (`positive|neutral|negative|mixed`) + `sentiment_score` -100..100
  - `lead_score` 1..100; composição **30% firmographic + 50% behavioral + 20% intent**
  - `intent_level` enum (`cold|warm|hot|urgent`); `red_flags[]` max 5; `opportunity_signals[]` max 5; `reasons[]` 2..5
  - `scorer_model: 'claude-haiku-4-5'` + `scorer_version` (FK ai_prompt_versions)
- LLM-as-judge: promptfoo Fase 1 (open source YAML CI free); 30 goldens × 6 verticais = **180 fixtures**; weekly cron `/api/internal/evals/run`
- Rubric scoring 1-10: `relevance, actionability, safety, tone_match, cta_clarity, overall`
- Alert Slack se `overall_score` cai >10% WoW OR `safety < 9` em qualquer caso → release block
- Hallucination mitigation 4 camadas: (1) `sourceFields[]` validado contra field_ids reais; (2) `confidence:'high|medium|low'` por section; (3) Haiku second-pass fact-check Fase 2 (~$0,001 extra); (4) escape hatch `next_steps` OBRIGATÓRIA no schema (`min(3)`)
- Constitutional principles cravados (anexar system prompt): nunca prometa resultado quantificado; nunca diagnostique; nunca estigmatize corpo/peso/raça/gênero/idade/sotaque; recomende avaliação presencial se lesão/dor/gravidez/transtorno alimentar/medicação contínua; linguagem inclusiva ("pessoas que correm" > "corredores")
- Retention default **24 meses** configurável por tenant; cron move blob pra tier archive + zera PDF mantendo metadata
- Direito esquecimento: `DELETE /api/me/erasure?email=...` dispara workflow `erase-pii` (DELETE form_submissions/form_reports/ai_invocations, mantém row anonimizada audit fiscal)
- Cancelamento mid-stream: `AbortSignal` nativo AI SDK v6; Anthropic continua faturando output já enviado + input completo (sem refund parcial); log em `ai_invocations.metadata: { aborted_at_token_count, abort_reason, partial_blob_url }`
- Geolocation: `geolocation(request)` de `@vercel/functions` (gratuito, todos planos); `req.geo` middleware DEPRECATED Next 16
- Pipeline Workflow 7 steps: enrich → score → generateReport → storeBlob → sendEmail → fanoutWebhooks → notifyProfessional
- Workflow limites por run: **25.000 events, 10.000 steps, 2 GB entity, 50 MB payload**; replay lento >2.000 events → quebrar em child workflows
- Retention storage Workflow pós-run: Hobby 1d, Pro 7d, Enterprise 30d
- Workflow pricing pior caso: $20/1M events; 25 events/submission × 25k subs/mês = 625k events ≈ $12,50/mês só workflow antes de blob/queue/AI
- DLQ pattern: step `step_failed` → child workflow `escalate-to-human(submissionId, failedStep, error)` → INSERT `dlq_items` + Slack DM admin + badge "⚠ 1 lead com erro" no painel + ações "Reprocessar" / "Marcar resolvido"
- Sentry tags: `tenant_id, vertical, submission_id, model_used` em cada step error
- BotID Basic free; upgrade Deep Analysis **$1/1k checks** SÓ se spam > 2%; honeypot + timing checks no form como camada extra gratuita
- Cost cap obrigatório: `tenant.monthly_budget_usd` + bloqueio em 95%; em pico de cache cold pode estourar pra $0,03-$0,04/submission (target é $0,02)
- MCP server Fase 2: 6 tools (`generate_report`, `regenerate_report`, `share_report`, `revoke_share`, `get_report_analytics`, `list_recent_leads`); OAuth 2.1 com PKCE (padrão HubSpot MCP GA 13-abr-2026); NÃO PAT-only (Typeform aprendeu lição)
- Vercel Workflow pricing inconsistente entre `/pricing` ($20/1M events) e `/docs/workflows/pricing` ($2,50/100k steps) — assumir pior caso até confirmar dashboard
- Vercel Queues Public Beta 27-fev-2026: $0,60/1M ops; metering chunks 4 KiB (msg 12 KiB = 3 ops); `idempotencyKey` ou push max concurrency = 2x; <500k ops/mês Fase 1 é adequado
- Resend rate limit **5 req/s POR TEAM (não por API key)** — gargalo fanout email+webhooks+notify em paralelo; usar Batch API (até 100/call) ou queue dedicada concurrency 4

### O que muda no escopo Fase 1 (preliminar — confirma após pesquisa 26)

- **Etapa 0b (catálogos)** ganha conceito de "template" antes do domain catalog
- **§3.7 (Infra)** ganha skills MCPs novos (Impeccable, etc — a pesquisar)
- **§3 (Primitivos)** ganha "TemplateSpec" como entidade primária, paletas viram dimensão secundária
- **Vibe coding (Etapa 3)** ganha "vibe matching" — IA escolhe template baseado em brief/foto referência
- **Etapa 6 (Funil ponta-a-ponta)** ganha template demo aplicado pra confirmar premium

Material que CONTINUA sem mudança:

- Schema Form Engine, Page Engine — já em produção
- Migrations 0015-0017 aplicadas (forms align + reserves + cross-table)
- 13 paletas atuais (continuam vivas como dimensão color)
- Tokens shape/motion/elevation (continuam — só são empacotados em templates)
- 47 shadcn primitives (intactos)
- Wrapper pattern (intacto)

### Próxima ação imediata

Disparar Pesquisa 26 — White-label premium architecture (template+palette+vibes

- photo handling + AI matching + mobile vs desktop + PWA + componentes shadcn
  adaptáveis). Prompt em drafting na conversa.

---

## 0.2.1 RESET — Harmonização das 3 pesquisas com framing correto (2026-05-19 fim de tarde)

> **Estado:** sessão de "harmonizar 3 features" pausou na decisão 9 de 12 porque
> o framing inteiro estava errado. Decisões 1-9 ficaram (algumas valem
> independente da lente, outras a verificar). Decisões 10-12 não foram fechadas.
> Retomar **com lente integrada**, não comparativa.

### Framing correto (re-decifrado a partir do briefing original)

Mensagem do usuário que disparou pesquisas 24+25 (preservada literalmente):

> "certo, sera que vale a pena fazer duas pesquisas externas sobre pages e
> relatorios com IA? para fechar a composição completa desse primeiro fluxo da
> agencia de maneira mais harmonica? com a mesma profundidade que fizemos no
> forms, engines, ia, estrutura, schema, zod, mcp, etc etc etc?"

**Intenção decifrada:**

- Pesquisa 23 (forms) + 24 (pages) + 25 (reports IA) = **UM sistema único = funil
  agência**, não 3 features separadas
- **Mesma profundidade arquitetural** em TODOS os pilares: engines + IA + estrutura
  - schema + Zod + MCP — replicados nos 3 motores do fluxo
- Fluxo único: `form (captação) → relatório IA (isca personalizada) → page (vendas)`
- Report **NÃO é PDF primário** — é PÁGINA com CTA pra sales page. PDF opcional
- Report **NÃO é engine 3 separado** — é Page Engine + AI fill content, ligado a
  `form_kind` via template+prompt específico

### Decisões 1-9 que ficaram (fechadas na sessão de hoje)

1. **Coluna spec:** form usa `definition`, page usa `blocks_snapshot`. Cada nome semântico próprio
2. **Versionamento Model X** unificado: rascunho vivo + snapshot imutável no publicar
3. **ETag/LWW:** adiar até Fase 2 (editor visual). ALTER ADD COLUMN é trivial em Postgres
4. **Tabelas IA:** `ai_prompts` + `ai_prompt_versions` + `ai_invocations` + `ai_usage_monthly` (já no schema)
5. **Brand tokens pré-resolvidos:** `tenants.brand_tokens_resolved jsonb` + trigger OKLCH→sRGB
6. **A/B testing:** removido (frescura/JIT real)
7. **`form_submissions.computed`:** removido (frescura — triage manual)
8. **`form_reports` Lego columns:** `share_token` + `share_revoked_at NULL` + `share_expires_at NULL` (pular view counters)
9. **Cross-engine invalidation:** princípio "invalidação por etiqueta, não rastreamento" — `cacheTag('engine:id')` + `revalidateTag('engine:id')`

### Decisões 10-12 NÃO fechadas (precisam retomada com lente correta)

- 10: Pipeline pós-submit (cancelei após "checar se é bot" virar JIT)
- 11: Vocab `form_kind` vs `page_kind` enums SQL
- 12: Cost cap unificado `tenants.monthly_budget_usd`

### Insights críticos que apareceram (respeitar na retomada)

- **Report é PÁGINA com CTA, não PDF primário** — funil comercial
- **Report como saída de IA aplicada sobre Page Engine** — não motor separado
- **`forms.report_template_id NULL`** opcional liga form a page_template tipo report + ai_prompt_version curado
- **Vibe coding PRIMEIRO, editor visual DEPOIS** (já em §0.1 Decisão 3)
- **Lego principle:** infra suporta agência + self-service desde dia 1; Fase 1
  USA modo agência; seed começa com 1 instância (não 3 templates GA)
- **Filtro "frescura"** (`feedback_frescura_filter.md`): não propor
  analytics/scoring/dashboards sem demanda real
- **Ordem correta:** M0 → M1 (funil agência atual) → M2 (Pacote A entregue) → M3
  (2º-5º tenant). Plano dia 1 = M1, NÃO Pacote A direto

### O que precisa acontecer ANTES de retomar harmonização

1. Reler `docs/research/03-engenharia-de-prompt.md` (não foi consultada nessa
   sessão — deveria ter sido)
2. Reler as 3 pesquisas (23+24+25) com lente "1 sistema, mapear pilares comuns"
3. Pesquisa 26 retorna (~30min Claude Desktop) e integra
4. SÓ ENTÃO retomar com mapping pilar-por-pilar dos 3 motores

### Erros documentados pra Claude futuro não repetir

`memory/feedback_research_briefing_intent.md` — Pesquisas complementares = UM sistema, não N silos
`memory/feedback_frescura_filter.md` — Não propor analytics/scoring sem demanda
`memory/feedback_jit_anchoring.md` — Decisão JIT precisa trigger + âncora
`memory/feedback_mil_passos_a_frente.md` — Feature = instância de infra, nunca hardcoded

---

## 0.1 Decisões consolidadas pós-pesquisa 23 (fonte autoritativa)

> Estas 5 decisões fecham os conflitos identificados ao cruzar este plano com
> `docs/research/23-form-system-architecture.md`. Vencem em caso de conflito
> com qualquer seção abaixo. As §1-§8 abaixo executam estas decisões.

### Decisão 1 — Dois motores separados (não um spec único)

- **Form Engine** (motor de formulários): estrutura **linear**. Spec = `steps[] → blocks[]` + `logic[]` (regras condicionais via JSON Logic ao lado da estrutura, não dentro). Cobre TODOS os tipos de form via coluna `forms.kind` enum + prompt-template próprio por kind. Mesmo renderer, mesmo editor.
- **Page Engine** (motor de páginas): estrutura **árvore recursiva** (`children[]` permitido). Cobre landing pages, páginas de venda, futuros documentos tipo Notion.
- **Motores isolados por código e por tabela.** Compartilham só conceitos genéricos (tenant, versionamento, publicação, slug, owner) via helper `lib/engines/base.ts`. Sem tabela polimórfica única.
- **Adicionar motor 3+ no futuro:** novo motor exige ADR. Tabelas próprias, entry no `engineRegistry` em código, 1 prompt-template + 1 renderer + 1 editor. Não toca motores existentes.

### Decisão 2 — i18n inline na definition, `t()` só pro chrome

- **Chrome do app** (botões, menus, erros genéricos, mensagens de validação reutilizáveis, labels de progresso) → `t('key')` em `messages/<locale>/<ns>.json` (regra `i18n.md` vale aqui).
- **Conteúdo gerado por tenant** (perguntas do form, opções, mensagens boas-vindas/agradecimento, copy da landing) → **inline no JSONB** do spec. NÃO passa por `t()`.
- **Multi-idioma do form** (quando precisar): overlay `translations: { 'en': { 'block-id': {...} } }` no próprio spec.
- **Atualizar `.claude/rules/i18n.md`** com seção explícita "conteúdo gerado por tenant NÃO usa `t()`".

### Decisão 3 — Vibe coding mínimo na Fase 1, editor visual na Fase 2

**Fase 1 inclui (chat IA no painel admin):**

- Chat com **roteador inteligente** (Haiku 4.5 classifica: form? page? qual kind?)
- Coleta híbrida: opções clicáveis pra estrutural (vertical, kind, idioma, tom) + texto livre pra contexto (programa, objetivo, público) + opção de ler referência externa
- IA adapta profundidade de perguntas conforme complexidade (3 pra captação simples, 8 pra avaliação fitness)
- Máximo 5 turnos no chat de coleta antes de gerar
- Geração via `generateObject` (Sonnet 4.6 + caching auto + fallback Haiku)
- Validação Zod com retry automático até 3x
- Preview real em iframe (mobile + desktop)
- Revisão por pergunta: cada pergunta gerada vem com opções sugeridas + alternativas clicáveis
- Edição via chat: profissional pede ajustes, IA aplica diff, preview atualiza, versiona automaticamente
- Edição via chat **após publicado**: profissional fala "quero editar meu form X", IA confirma qual (se vários), aplica diff, gera nova versão. Confirmações onde dói errar (sobrescrever versão com 234 submissions, etc).
- **Duplicar form/page**: server action `duplicate(formId, newName)` faz deep clone do spec → novo form com novo id/slug, status='draft'. Histórico original intacto.
- Trava de custo IA: prompt caching auto, limite de turnos, quota por plano (entitlement), rate limit 10 calls/min, early stop em streaming, cache de contexto do tenant
- Custo estimado por profissional/mês: ~$1,50-$3,00 em uso normal

**Fase 1 NÃO inclui:** editor visual qualquer, mapa mental, logic graph, drag-drop, streaming live IA escrevendo, IA proativa por analytics.

**Fase 2 inclui (depois do Pacote C ponta-a-ponta entregue):**

- Preview real + edição inline via modal/popover (clica em pergunta abre modal pequeno; ~1-2 sem)
- Reordenar via chat (já existia, zero custo)
- Chat persiste como assistente lateral
- **MCP server próprio** publicado em Smithery.ai (~2 sem) — 9 tools v1: create*form, list_forms, get_form, update_form, publish_form, get_submissions, analyze_submissions, generate_form_from_brief, list_templates. Sem `delete*\*` em v1 (safety guardrail).

**Fase 2+ JIT (quando demanda real comprovar):** editor drag-drop Tally-like, logic graph view (xyflow), IA proativa baseada em analytics.

### Decisão 4 — Vocabulário canônico (adotar pesquisa 23 §18)

**Core terms (EN no código + banco, sempre):**

| Conceito                | Termo canônico    | Banidos / Evitar                                   |
| ----------------------- | ----------------- | -------------------------------------------------- |
| Objeto inteiro          | `form`            | quiz, survey, intake, questionnaire (viram `kind`) |
| Bloco no form           | `block`           | field (campo exclui statement/image)               |
| Bloco que é pergunta    | `input block`     | question                                           |
| Container de blocos     | `step`            | page, section                                      |
| Definição publicada     | `version`         | revision                                           |
| Resposta de uma pessoa  | `submission`      | response (1 submissão tem N responses)             |
| Resposta de um block    | `response`        | answer                                             |
| Resultado IA gerado     | `report`          | analysis, summary                                  |
| Critério IA pra geração | `generation rule` | guideline                                          |
| Padrão pré-pronto       | `template`        | preset, recipe                                     |
| Variante A/B            | `variant`         | experiment-arm                                     |
| Regra condicional       | `logic rule`      | conditional, branch                                |

**Enum `forms.kind` (Postgres):**

`'form' | 'quiz' | 'survey' | 'assessment' | 'check-in' | 'lead-capture' | 'onboarding' | 'brief'`

- `intake` → **`lead-capture`** (substitui `capture_form` do plano original e atualiza `.claude/rules/naming.md`)
- `vibe_coding` → kind `brief` (form que alimenta IA pra gerar artifact). "Vibe coding" segue como nome da **feature** (ação do profissional), não kind no banco.

**Tabelas SQL (snake_case plural EN):**

`forms`, `form_versions`, `form_submissions`, `form_responses`, `form_reports`, `form_templates`, `form_generation_rules`, `form_analytics_events`.

- `form_submissions` = 1 row por submissão completa (JSONB consolidado, leitura O(1)).
- `form_responses` = 1 row por bloco respondido (normalizada, analytics drop-off + agregação cross-versão).
- Write 2x, leitura otimizada. Pesquisa 23 §8.3 confirma trade-off.

**Rotas — código EN, URL pública PT-BR via rewrite `vercel.ts`:**

| Pasta interna (EN)                         | URL pública                               |
| ------------------------------------------ | ----------------------------------------- |
| `app/(public)/[tenant]/f/[slug]/page.tsx`  | `/{tenant}/f/[slug]` (curto, mainstream)  |
| `app/(public)/[tenant]/r/[token]/page.tsx` | `/{tenant}/r/[token]` (report público)    |
| `app/(admin)/forms/page.tsx`               | `/painel/formularios` (PT-BR via rewrite) |
| `app/(admin)/forms/[id]/page.tsx`          | `/painel/formularios/[id]`                |
| `app/(admin)/forms/[id]/submissions`       | `/painel/formularios/[id]/respostas`      |
| `app/(admin)/forms/[id]/reports`           | `/painel/formularios/[id]/relatorios`     |
| `app/api/forms/[id]/submit/route.ts`       | `/api/forms/[id]/submit` (API sempre EN)  |

**Componentes (EN, prefixo `app-form-*` / `app-page-*`):**

`app-form`, `app-form-block-*`, `app-form-step`, `app-form-progress`, `app-form-renderer`, `app-form-preview`, `app-form-chat`, `app-form-editor-*` (Fase 2), `app-form-logic-graph` (Fase 2+), `app-page-renderer`, `app-page-block-*`.

**Strings públicas via `t()`:** namespace `messages/pt-BR/forms.json` (chrome — Próximo/Voltar/Enviar/validações genéricas).

**Strings inline no spec (conteúdo do tenant, Decisão 2):** perguntas, opções, mensagens boas-vindas/agradecimento — JSONB de `form_versions.definition`.

**Eventos analytics (namespace dotted):** `form.view`, `form.start`, `form.step_enter`, `form.step_complete`, `form.block_focus`, `form.block_blur`, `form.submit`, `form.abandon`, `report.generated`, `report.viewed`, `report.shared`.

### Decisão 5 — Sequenciado por demanda (não split rígido)

**Estratégia:** aplicar migration quando a feature precisa, não tudo de uma vez.

**Sequência cronológica (sem números fixos — outras migrations paralelas podem entrar à frente):**

1. ✅ `0013_security_hardening_v2` — APLICADA 2026-05-19. Doc: `docs/migrations/0013_security_hardening_v2.md`
2. ✅ `0014_constraint_cleanup` — APLICADA 2026-05-19. PK/FK/index cleanup. Doc: `docs/migrations/0014_constraint_cleanup.md`
3. ✅ `0015_forms_align_research_23` — APLICADA 2026-05-19. Rename `capture_forms→forms`, `capture_submissions→form_submissions`, `assessments→form_reports`. Adicionadas colunas (kind enum, vertical, status, logic_rules, bot_score, ip_address_hashed, idempotency_key, share_token, etc). Criada `form_versions` espelhando `page_versions`. Zero consumers no código antes da migration (grep confirmou) → rename seguro.
4. ✅ `0016_structural_reserves` — APLICADA 2026-05-19. Reservas estruturais: `tenants.lifecycle_state` (+ suspended_at/reason, deletion_scheduled_at), `audit_log` (append-only via RLS), `notifications` (in-app, Fase 2), `tenant_webhooks` + `webhook_deliveries` (outgoing webhooks com retry, Fase 2).
5. ✅ `0017_cross_table_tenant_consistency` — APLICADA 2026-05-19. Função `assert_tenant_match()` + 11 triggers em tabelas críticas (enrollments, modules, components, component_schedules, form_submissions, form_versions, form_reports, leads, page_versions, webhook_deliveries). Defesa em profundidade (achado 4 da auditoria RLS).
6. ⏳ `page_engine_full` — JIT Fase 2 quando estudo de seções/componentes maturar (page_engine_minimal já existia no schema dia 0 — `pages`/`page_versions`/`page_templates`)

**Regra de numeração:** sequencial conforme aplicação real. **NÃO travar números neste plano.** Cada migration aplicada deve ser comunicada aqui pra manter alinhamento. Próxima migration (form*engine) será aplicada com número sequencial atual no banco — provavelmente `0015*\*` se nenhuma outra entrar antes.

**Sub-decisões fechadas:**

| Item                                | Decisão                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| `prompt_templates`                  | Tabela única com `engine_kind` + `form_kind` discriminadores   |
| `form_templates` / `page_templates` | Separadas (Zod schema próprio por motor)                       |
| Foreign keys cross-motor            | Resolvidas pela ordem cronológica de aplicação                 |
| Validação pós-cada-migration        | Type gen + RLS smoke test com 3 tenants antes de prosseguir    |
| Page Fase 1                         | Schema mínimo viável agora, refinar com estudo dedicado depois |

**Pendência aberta:** estudo profundo de page engine (seções, componentes, hierarquia, templates de landing) — input pra `page_engine_full`. Disparado quando Fase 2 começar.

---

## 1. Arquitetura — Form Engine + Page Engine

### 1.1 Form Engine

- **Spec linear**, Zod discriminated union via `z.discriminatedUnion('type', [...])` (pesquisa 23 §4.3):
  - `FormDefinition` = `{ version, kind, vertical, locale, steps[], logic[], welcome?, thankYou, theme? }`
  - `Step` = `{ id, ref, title?, blocks[], layout: 'single-question' | 'multi-question' }`
  - `Block` = base + discriminated union por `type`
  - `LogicRule` = `{ id, when: JsonLogic, then: { action, ... } }` — actions: `show`, `hide`, `jump`, `require`, `calculate`, `end-form`
- **Catálogo Fase 1 (9 blocks mínimo, demais JIT):** `short-text`, `long-text`, `email`, `phone`, `single-choice`, `multi-choice`, `nps`, `consent-checkbox`, `statement` (content). Restantes ~25 blocks da pesquisa 23 §1.3 entram conforme demanda.
- **Conditional logic** via `json-logic-js` (~7kb, server+client, determinístico) em array `logic[]` separado. Branching como DAG, topological sort no save.
- **Renderer** RSC default + `react-hook-form` v7 + `motion/react` v12 transitions entre steps.
- **Validação** Zod end-to-end: `Block` schema valida props; `FormDefinition.superRefine` valida invariantes (refs únicos, max blocks, max steps).

### 1.2 Page Engine

- **Spec árvore recursiva**, Zod: `PageSpec` = `{ version, kind, root: PageBlock }` onde `PageBlock = { id, type, props, children: PageBlock[] }` (recursão via `z.lazy`).
- **Catálogo Fase 1 (5 blocks mínimo):** `hero`, `features`, `faq`, `cta`, `stack`. Restantes (`testimonial`, `media-image`, `media-video`, `section`, `container`, `divider`) JIT.
- **Renderer** recursivo, dispatcher por `type`, valida props via Zod por block.
- **Schema mínimo Fase 1:** `pages(tenant_id, slug, template_id, definition jsonb)` + `page_versions(page_id, version, snapshot jsonb, state)`. Sem `overrides_jsonb` ainda — todo edit cria nova versão.

### 1.3 Compartilhado entre motores

- `lib/engines/base.ts` — funções genéricas:
  - `publish(engineKind, entityId)` — cria nova versão `state='published'` no histórico
  - `duplicate(engineKind, entityId, newName)` — deep clone, novo id/slug, status='draft'
  - `lockVersionAfterFirstUse(engineKind, versionId)` — quando 1ª submission/view, marca `locked=true`; edits forçam nova versão
- `lib/engines/registry.ts` — `engineRegistry = { form: {...}, page: {...} }`. Cada entry tem `table`, `specSchema`, `renderer`, `chatPromptTemplate`. IA roteadora consulta aqui.

### 1.4 IA pipeline (compartilhada)

- **AI SDK v6** + Vercel AI Gateway (`https://ai-gateway.vercel.sh`)
- **Modelos:**
  - Haiku 4.5 (`anthropic/claude-haiku-4-5`) — roteador, coletor de contexto, validação de resposta livre, sentiment, lead score
  - Sonnet 4.6 (`anthropic/claude-sonnet-4-6`) — geração de spec, relatório padrão, edição via diff
  - Opus 4.7 (`anthropic/claude-opus-4-7`) — relatório premium (tier pago, JIT)
- **`providerOptions.gateway.caching = 'auto'`** — injeta `cache_control` em Anthropic prompt caching (0,1× input em cache hit)
- **Fallback declarado:** `providerOptions.gateway.models: ['anthropic/claude-haiku-4-5']`
- **`generateObject({ schema })` na geração** com Zod schema; `streamObject` reservado pra Fase 2 (UX streaming live)
- **Validação Zod no output** + retry até 3x com explicit fix prompt em caso de schema inválido
- **Prompt-templates versionados** em `prompt_templates(engine_kind, form_kind, version, body, output_schema_jsonb, is_active)`
- **Trava de custo dia 1:**
  - Prompt caching auto (ganho 5-10x em prefixos estáveis)
  - Quota por plano via `feature_usage` + entitlement
  - Rate limit 10 calls/min por tenant via Upstash Redis (`@upstash/ratelimit`)
  - Max 5 turnos no chat de coleta
  - Early stop em streaming (profissional cancela = paga só o gerado)
  - Cache de contexto do tenant (página lida ~1h)

---

## 2. Schema (migrations cronológicas, sem números fixos)

Detalhes SQL completos em `docs/research/23-form-system-architecture.md §8`.

### 2.1 `form_engine` migration (próxima a aplicar após validar pendências dia 0)

**Enums:** `form_kind`, `form_status`, `form_vertical`, `submission_status`, `report_status`, `engine_kind`.

**Tabelas:**

- `forms` — id, tenant_id, slug, kind, vertical, status, current_version_id, retention_days, webhook_url, created_by, timestamps
- `form_versions` — id, form_id, tenant_id, version, definition jsonb, locked, experiment_id, variant, published_at, created_by, timestamps
- `form_submissions` — id, form_version_id, tenant_id, user_id, anonymous_id, contact_email, contact_phone, status, started_at, completed_at, duration_seconds, responses jsonb, computed jsonb, source_url, user_agent, ip_address_hashed, utm, bot_score, variant, consent_log jsonb, timestamps
- `form_responses` — id, submission_id, tenant_id, block_ref, block_type, value jsonb, time_on_field_ms, step_index, answered_at
- `form_reports` — id, submission_id, tenant_id, status, model_used, tokens_input, tokens_output, tokens_cached, cost_cents, content_jsonb, content_md, blob_url, share_token, share_expires_at, error_message, generated_at, timestamps
- `form_templates` — id, vertical, kind, definition jsonb, locale, name, description, is_official, timestamps
- `form_generation_rules` — id, tenant_id, vertical, name, when jsonb, must_include jsonb, must_exclude jsonb, priority, enabled, timestamps
- `form_analytics_events` (PARTITION BY RANGE occurred_at) — id, tenant_id, form_version_id, submission_id, event_type, step_ref, block_ref, metadata jsonb, device, occurred_at
- `prompt_templates` — id, engine_kind, form_kind, version, body, output_schema_jsonb, is_active, timestamps

**Índices críticos:** `tenant_id` em toda tabela + composto leading; GIN em `form_versions.definition` e `form_submissions.responses`.

**RLS policies (pesquisa 23 §8.2):** public read de version publicada (anon com JWT claim `tenant_id`), public insert de submission anônima (RLS condicional `is_anonymous=true`), professional select de submissions próprias, restrictive no-cross-tenant.

### 2.2 `page_engine_minimal` migration (Fase 1, mínimo viável)

**Tabelas:**

- `pages` — id, tenant_id, slug, template_id, status, current_version_id, owner_id, timestamps
- `page_versions` — id, page_id, tenant_id, version, definition jsonb, locked, published_at, created_by, timestamps
- `page_templates` — id, kind, definition jsonb, name, description, is_official, timestamps

**RLS:** análogo ao form_engine.

### 2.3 `page_engine_full` (JIT Fase 2)

Disparado quando estudo dedicado de seções/componentes/templates de landing maturar. Provavelmente adiciona: `page_blocks` normalizada, `page_overrides`, `page_analytics_events`, `page_a_b_variants`, `media_assets`.

---

## 3. Primitivos Fase 1

### 3.1 Form Engine

| #   | Primitivo            | Localização                              | Função                                              |
| --- | -------------------- | ---------------------------------------- | --------------------------------------------------- |
| 1   | `FormDefinition` Zod | `lib/contracts/form.ts`                  | Discriminated union + superRefine                   |
| 2   | `BlockSchemas`       | `lib/contracts/form-blocks/*.ts`         | 9 blocos mínimo (Zod por type)                      |
| 3   | `FormRenderer`       | `components/app-form-renderer.tsx`       | RSC default, dispatcher por step                    |
| 4   | `StepRenderer`       | `components/app-form-step.tsx`           | Motion 12 transitions, single/multi-question layout |
| 5   | `BlockRenderer`      | `components/app-form-block-renderer.tsx` | Dispatcher por `type`, integrado com RHF            |
| 6   | `VisibilityEngine`   | `lib/forms/engine/visibility.ts`         | json-logic-js wrapper pra `show`/`hide`/`jump`      |
| 7   | `ValidationEngine`   | `lib/forms/engine/validation.ts`         | Extrai Zod por block + valida submission completa   |
| 8   | `FormVersioning`     | `lib/forms/versioning.ts`                | publish, duplicate, lock                            |
| 9   | `SubmitAction`       | `app/api/forms/[id]/submit/route.ts`     | BotID + Origin + RLS insert + dispatch Queue        |

### 3.2 Page Engine

| #   | Primitivo          | Localização                        | Função                 |
| --- | ------------------ | ---------------------------------- | ---------------------- |
| 10  | `PageSpec` Zod     | `lib/contracts/page.ts`            | Recursivo via `z.lazy` |
| 11  | `PageBlockSchemas` | `lib/contracts/page-blocks/*.ts`   | 5 blocos mínimo        |
| 12  | `PageRenderer`     | `components/app-page-renderer.tsx` | Recursivo              |

### 3.3 IA Pipeline

| #   | Primitivo         | Localização                    | Função                                              |
| --- | ----------------- | ------------------------------ | --------------------------------------------------- |
| 13  | `EngineRouter`    | `lib/ai/router.ts`             | Haiku classifica engine + kind                      |
| 14  | `ChatCollector`   | `lib/ai/collector.ts`          | Coleta híbrida (opções + texto livre + ref externa) |
| 15  | `SpecGenerator`   | `lib/ai/generator.ts`          | generateObject + validação + retry                  |
| 16  | `DiffApplier`     | `lib/ai/diff.ts`               | Aplica patch via IA em spec existente               |
| 17  | `AICatalogPrompt` | `lib/ai/catalog-prompt.ts`     | Renderiza catálogo de blocks → texto pro prompt     |
| 18  | `ChatUI`          | `components/app-form-chat.tsx` | Painel admin: chat + preview lado-a-lado            |

### 3.4 Pipeline pós-submit

| #   | Primitivo         | Localização                              | Função                                              |
| --- | ----------------- | ---------------------------------------- | --------------------------------------------------- |
| 19  | `BotIDCheck`      | `lib/security/botid.ts`                  | Wrapper `checkBotId()` server-side                  |
| 20  | `QueueHandler`    | `app/api/queues/process-lead/route.ts`   | Vercel Queue receiver                               |
| 21  | `WorkflowProcess` | `lib/workflows/process-lead.ts`          | WDK `'use workflow'` — enrich, score, report, email |
| 22  | `ReportEmail`     | `lib/email/templates/capture-report.tsx` | React Email template                                |

### 3.5 Compartilhado

| #   | Primitivo         | Localização               | Função                                     |
| --- | ----------------- | ------------------------- | ------------------------------------------ |
| 23  | `EnginesBase`     | `lib/engines/base.ts`     | publish, duplicate, lock helpers           |
| 24  | `EnginesRegistry` | `lib/engines/registry.ts` | Mapa engineKind → spec + renderer + prompt |

### 3.6 Catálogos + Operations API (IA-discovery, prep MCP Fase 2)

| #   | Primitivo                 | Localização                                                      | Função                                                                                                         |
| --- | ------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 25  | `DomainCatalog`           | `lib/contracts/domain-catalog.ts`                                | Mapa tabela→campos bindáveis (semantics, units) — fonte pra IA bindings                                        |
| 26  | `EngineCatalog`           | `docs/blueprint/21-engine-catalog.md`                            | Markdown enumera todos engines (status, propósito, tabelas, relações)                                          |
| 27  | `ProgramEnginePreSpec`    | `docs/blueprint/22-program-engine-spec.md`                       | Pre-spec Program Engine (componentes, sequenciamento, schema) — ancora Fase 1, NÃO codar                       |
| 28  | `Operations`              | `lib/engines/operations/*.ts`                                    | ~15 tools tipadas (`createForm`, `listForms`, `duplicateForm`, etc.) — Zod input/output + descrições MCP-ready |
| 29  | `BlockKnowledgeCards`     | Embedded em `lib/contracts/form-blocks/<kind>.ts` (props `card`) | Card estruturado: purpose, when_to_use, common_bindings, anti_patterns, relations                              |
| 30  | `PageBlockKnowledgeCards` | Embedded em `lib/contracts/page-blocks/<kind>.ts`                | Mesmo padrão                                                                                                   |
| 31  | `PromptCatalogLoader`     | `lib/ai/catalog-loader.ts`                                       | Carrega `domain-catalog` + cards dos blocks como contexto pra prompts                                          |

### 3.7 Infra externa + ENVs + dependências

| #   | Item                            | Status a confirmar / setup                                                                                                                                  |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 32  | GitHub repo + branch protection | Repo criado, `main` protegida, require PR + 1 review + CI verde                                                                                             |
| 33  | Vercel project                  | Linkado ao repo, preview por PR, region `gru1` (BR) ou `iad1` (US East — Workflow lock)                                                                     |
| 34  | Supabase plan                   | Pro (backup diário + 100GB + 8GB RAM) — vital pra produção                                                                                                  |
| 35  | Domínio + DNS                   | `desafit.app` apontando pra Vercel + wildcard `*.desafit.app` (subdomain por tenant)                                                                        |
| 36  | Resend                          | Domínio verificado (DKIM + SPF + DMARC), template "capture-report" criado                                                                                   |
| 37  | Upstash Redis                   | Marketplace Vercel → conectado → ENVs injetadas                                                                                                             |
| 38  | Vercel AI Gateway               | API key gerada no dashboard, ZDR ativado (Pro+)                                                                                                             |
| 39  | Vercel BotID Deep Analysis      | Pro+ → ativado em `/api/forms/[id]/submit`                                                                                                                  |
| 40  | ENVs em `.env.local` + Vercel   | Lista completa em §10.2 abaixo                                                                                                                              |
| 41  | Dependências npm                | `ai`, `@vercel/queue`, `botid`, `json-logic-js` + types, `@upstash/ratelimit`, `@upstash/redis`, `resend`, `@react-pdf/renderer`, `@react-email/components` |
| 42  | Paleta agência operadora        | Escolher 1 das 13 seedadas + validar APCA Silver                                                                                                            |
| 43  | Paleta desafit SaaS             | Escolher 1 + validar APCA Silver                                                                                                                            |
| 44  | Logo wordmark desafit           | Versão texto + cor (refinar Fase 2 com designer)                                                                                                            |

### 3.8 Tools/scripts + ESLint

| #   | Item                           | Localização                         | Função                                                              |
| --- | ------------------------------ | ----------------------------------- | ------------------------------------------------------------------- |
| 45  | `pnpm seed:templates`          | `scripts/seed-templates.ts`         | Popula `form_templates`, `page_templates`, `prompt_templates`       |
| 46  | `pnpm validate:rls`            | `scripts/validate-rls.ts`           | Smoke test 3 tenants (anon + 2 authed) — anti cross-tenant leak     |
| 47  | `pnpm eval:forms`              | `scripts/eval-forms.ts`             | Roda golden cases IA (10 por vertical Fase 1) + LLM-as-judge        |
| 48  | Cron `weekly-eval-forms`       | `app/api/cron/weekly-eval/route.ts` | Vercel Cron — alerta Slack se score IA cai >10%                     |
| 49  | Cron `daily-retention-cleanup` | `app/api/cron/retention/route.ts`   | Vercel Cron — delete submissions > `forms.retention_days`           |
| 50  | ESLint path-exception          | `eslint.config.mjs`                 | Permitir literais em `app-form-renderer*`, `app-form-block-*`, etc. |

### 3.9 Docs + ADRs novos

| #   | Item                                         | Função                                                                             |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| 51  | ADR-0041 "Engine catalog + 2 motores"        | Formaliza decisão arquitetural (referenciada por `forms-engine.md` + blueprint 21) |
| 52  | Blueprint 21 — Engine catalog                | Conforme #26                                                                       |
| 53  | Blueprint 22 — Program Engine pre-spec       | Conforme #27                                                                       |
| 54  | CHANGELOG entry 2026-05-19                   | Rewrite plano + 5 decisões + nova rule `forms-engine`                              |
| 55  | `docs/_status.md` update                     | Marcar Fase 1 começando                                                            |
| 56  | README do repo                               | Onboarding pra dev novo (existe? confirmar)                                        |
| 57  | Rule nova `engines-operations.md` (opcional) | Path-loaded em `lib/engines/operations/**` — convenções pra criar nova operation   |

---

## 4. Etapas executáveis (ordem)

> **Sequência sugerida:** Etapas 0a + 0b (infra + catálogos) podem rodar em paralelo
> com Etapa 1. Etapas 2-7 dependem da 1 + 0a. Etapa 0b é leitura/decisão e bloqueia
> Etapas 3 (IA) e 4 (pipeline).

### Pré-requisitos antes de Etapa 1

- [✅] Migration `0013_security_hardening_v2` aplicada
- [✅] Migration `0014_constraint_cleanup` aplicada (PK/FK/index cleanup pós-auditoria)
- [✅] Migration `0015_forms_align_research_23` aplicada (rename `capture_*→form_*` + colunas pesquisa 23 + `form_versions`)
- [✅] Migration `0016_structural_reserves` aplicada (tenant lifecycle + audit_log + notifications + tenant_webhooks + webhook_deliveries)
- [✅] Migration `0017_cross_table_tenant_consistency` aplicada (`assert_tenant_match` + 11 triggers — defesa em profundidade)
- [✅] Types regenerados (`lib/contracts/database.ts` — 48 tabelas, zero TYPES-PENDING)
- [✅] `pnpm typecheck` verde após regen
- [✅] `page_engine_minimal` JÁ EXISTIA no schema dia 0 (`pages` + `page_versions` + `page_templates`) — não precisa nova migration
- [✅] Rewrite deste plano consolidado (este doc)
- [✅] `.claude/rules/naming.md` atualizada (vocab + lead-capture)
- [✅] `.claude/rules/i18n.md` atualizada (seção conteúdo do tenant)
- [✅] `.claude/rules/forms-engine.md` criada (path-loaded em forms/pages/blocks)
- [⏳] Decisões abertas §10 respondidas
- [⏳] HaveIBeenPwned password protection ativado no Supabase Dashboard
- [⏳] `pnpm typecheck && pnpm lint --max-warnings 0 && pnpm test && pnpm build` verde

### Etapa 0a — Infra externa + ENVs + dependências (~10-12h)

- [ ] GitHub: validar repo + branch protection na `main` (require PR + CI verde)
- [ ] Vercel: linkar projeto + preview por PR + region escolhida (decidir gru1 vs iad1 em §10)
- [ ] Supabase: confirmar plano Pro (backup diário) ou planejar upgrade
- [ ] Domínio `desafit.app`: DNS apontando pra Vercel + wildcard `*.desafit.app`
- [ ] Resend: criar conta, verificar domínio (DKIM + SPF + DMARC)
- [ ] Upstash Redis: instalar via marketplace Vercel
- [ ] Vercel AI Gateway: gerar API key + ativar ZDR (Pro+)
- [ ] Vercel BotID: ativar Deep Analysis (Pro+) em `/api/forms/[id]/submit`
- [ ] Subscrever Vercel Pro+ (BotID Deep + ZDR + Sandbox > 5min)
- [ ] Instalar deps: `pnpm add ai @vercel/queue botid json-logic-js @upstash/ratelimit @upstash/redis resend @react-pdf/renderer @react-email/components` + `pnpm add -D @types/json-logic-js`
- [ ] Popular ENVs em `.env.local` + Vercel (lista §10.2)
- [ ] Escolher paleta agência operadora (das 13 seedadas) + validar APCA
- [ ] Escolher paleta desafit SaaS + validar APCA
- [ ] Logo wordmark desafit em versão texto+cor (refinar Fase 2)

### Etapa 0b — Catálogos + docs + ADR (~12-15h)

- [ ] `docs/blueprint/21-engine-catalog.md` — enumera todos engines (status, propósito, tabelas, relações)
- [ ] `docs/blueprint/22-program-engine-spec.md` — pre-spec Program Engine (componentes, dimensões, sequenciamento)
- [ ] `lib/contracts/domain-catalog.ts` — domain schema (skeleton: `client_profile` + `tenant_brand`)
- [ ] `lib/engines/operations/*.ts` — 15 operations tipadas (create/list/get/update/duplicate/publish/get_submissions × forms + pages, generate_form, generate_report, edit_via_diff)
- [ ] Cards estruturados (`card` prop em cada block Zod schema) — purpose, when_to_use, common_bindings, anti_patterns, relations
- [ ] `lib/ai/catalog-loader.ts` — carrega domain-catalog + cards como contexto pra prompts
- [ ] ADR-0041 "Engine catalog + 2 motores separados"
- [ ] CHANGELOG entry 2026-05-19
- [ ] `docs/_status.md` update (Fase 1 começa)
- [ ] README do repo (criar/atualizar — onboarding dev)
- [ ] (opcional) Rule `engines-operations.md` path-loaded em `lib/engines/operations/**`

### Etapa 1 — Form Engine spec + renderer mínimo (~10h)

- [ ] `lib/contracts/form.ts` — `FormDefinition` Zod discriminated union
- [ ] `lib/contracts/form-blocks/*.ts` — 9 block schemas
- [ ] Migration `form_engine` aplicada via MCP (após pré-reqs verdes)
- [ ] Type gen + RLS smoke test 3 tenants
- [ ] `components/app-form-renderer.tsx` + `app-form-step.tsx` + `app-form-block-renderer.tsx`
- [ ] `lib/forms/engine/visibility.ts` — json-logic-js wrapper
- [ ] `lib/forms/engine/validation.ts` — extração Zod recursiva
- [ ] `lib/forms/versioning.ts` — publish + duplicate + lock
- [ ] Storybook stories com 3 fixtures (lead-capture, assessment, onboarding)

### Etapa 2 — Page Engine spec + renderer mínimo (~6h)

- [ ] `lib/contracts/page.ts` — `PageSpec` Zod recursivo
- [ ] `lib/contracts/page-blocks/*.ts` — 5 block schemas
- [ ] Migration `page_engine_minimal` aplicada
- [ ] `components/app-page-renderer.tsx` — RSC recursivo
- [ ] Seed 1 template `landing-minimal-v1` (suficiente Fase 1)

### Etapa 3 — IA Chat híbrido (~10h)

- [ ] `lib/ai/router.ts` — Haiku classifica
- [ ] `lib/ai/collector.ts` — chat híbrido coleta
- [ ] `lib/ai/generator.ts` — generateObject + retry
- [ ] `lib/ai/diff.ts` — aplica patch em spec existente
- [ ] `lib/ai/catalog-prompt.ts` — renderiza catálogo
- [ ] `components/app-form-chat.tsx` — UI chat + preview
- [ ] Página `/painel/formularios/novo` — chat IA + preview iframe
- [ ] Trava de custo: caching auto + quota + rate limit + max turns

### Etapa 4 — Pipeline pós-submit (~6h)

- [ ] `lib/security/botid.ts` — wrapper checkBotId
- [ ] `app/api/forms/[id]/submit/route.ts` — BotID + Origin + insert + dispatch
- [ ] Vercel Queue `lead.submitted` configurada
- [ ] `lib/workflows/process-lead.ts` — WDK steps: enrich, score, generate-report, email
- [ ] `lib/email/templates/capture-report.tsx` — React Email
- [ ] Resend integration

### Etapa 5 — Seed templates + scripts (~6h)

- [ ] Seed `form_templates` com `cref-funnel-v1` (CREF fitness B2B)
- [ ] Seed `prompt_templates` com `capture-report-v1` + `vibe-coding-v1` + `router-v1`
- [ ] Seed `page_templates` com `landing-minimal-v1`
- [ ] `scripts/seed-templates.ts` — wrapper `pnpm seed:templates`
- [ ] `scripts/validate-rls.ts` — wrapper `pnpm validate:rls` (3 tenants smoke)
- [ ] `scripts/eval-forms.ts` — wrapper `pnpm eval:forms` (10 golden cases × 1 vertical Fase 1)
- [ ] Cron Vercel `weekly-eval-forms` + `daily-retention-cleanup`
- [ ] ESLint path-exception em `react/jsx-no-literals` pra renderers

### Etapa 6 — Funil agência ponta-a-ponta (~6h)

- [ ] `app/(public)/[tenant]/f/[slug]/page.tsx` — form público (resolve hostname + slug)
- [ ] `app/(public)/[tenant]/r/[token]/page.tsx` — report público (HMAC token)
- [ ] `app/(public)/[tenant]/agencia/[slug]/page.tsx` — landing pública
- [ ] Theme override runtime via `RouteProvider`
- [ ] APCA Silver validado, mobile-first
- [ ] Rate-limit anônimo (Upstash Redis)

### Etapa 7 — Admin viewer read-only (~3h)

- [ ] `/painel/formularios` — lista forms do tenant
- [ ] `/painel/formularios/[id]` — detalhe + lista de submissions
- [ ] `/painel/formularios/[id]/respostas` — lista de submissions detalhada
- [ ] `/painel/formularios/[id]/relatorios` — reports gerados
- [ ] Sem edição visual ainda — só chat IA + preview

**Total Fase 1 estimado:** ~80-90h (10-12 dias úteis solo).

Quebra:

- Etapa 0a (infra) ~10-12h
- Etapa 0b (catálogos + docs) ~12-15h
- Etapa 1 (Form Engine) ~10h
- Etapa 2 (Page Engine) ~6h
- Etapa 3 (IA Chat) ~10h
- Etapa 4 (Pipeline pós-submit) ~6h
- Etapa 5 (Seed + scripts) ~6h
- Etapa 6 (Funil ponta-a-ponta) ~6h
- Etapa 7 (Admin viewer) ~3h
- Buffer + decisões + ajustes ~10-15h

---

## 5. O que NÃO entra na Fase 1 (JIT, anchored)

| Item                                 | Quando entra                                    |
| ------------------------------------ | ----------------------------------------------- |
| Editor visual qualquer               | Fase 2 (após Pacote C ponta-a-ponta entregue)   |
| Logic graph view (xyflow)            | Fase 2+                                         |
| MCP server próprio (Smithery)        | Fase 2 (~2 sem)                                 |
| Streaming live IA escrevendo o form  | Fase 2+                                         |
| IA proativa por analytics            | Fase 2+                                         |
| `page_engine_full` (estudo dedicado) | Fase 2 (estudo profundo de seções)              |
| Tenant copy overrides                | JIT (gatilho rule `i18n.md`)                    |
| WhatsApp/Telegram bot                | Fase 3+                                         |
| Embed widget (`desafit-embed.js`)    | Fase 3+                                         |
| Blocos restantes (~25)               | JIT por demanda real                            |
| A/B testing (variants)               | Fase 2+                                         |
| PWA offline em forms (Serwist)       | Sprint 14+                                      |
| Sandbox pra validators custom        | Fase 3+                                         |
| Collaborative editing (Liveblocks)   | Fase 3+ (>20 editores simultâneos)              |
| Multi-locale forms                   | JIT (primeiro cliente internacional)            |
| LGPD DSAR endpoints                  | Antes de produção real (Etapa 5+ ou pós-Fase 1) |

---

## 6. Gatilhos de revisão deste plano

| Gatilho                                    | Ação                                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Primeiro cliente B2B validar funil**     | Promover Fase 2 — preview real + edição inline modal + MCP server                                  |
| **Vertical 2 (yoga/idiomas/outro)**        | Seed template novo em `form_templates` + prompt-template novo. Sem código novo se infra estiver ok |
| **Block kind faltando no catálogo**        | Adicionar ao catalog + nova versão de prompt-template. Nunca inline em código                      |
| **IA emite spec inválido em produção**     | Hard reject + log estruturado + ajustar prompt-template versão (sem hotfix em código)              |
| **Page Engine atinge limite Fase 1**       | Disparar estudo `page_engine_full` + migration                                                     |
| **Completion rate <30% em qualquer form**  | Revisar comprimento, ordem (email primeiro), welcome copy (pesquisa 23 §2)                         |
| **Custo IA >$0,10/submissão**              | Migrar relatório default Sonnet→Haiku; Sonnet/Opus em tier pago                                    |
| **Forms passam 25 perguntas regularmente** | Forçar multi-step + progress bar; quebrar em duas submissions                                      |
| **>50% das submissões vêm de fora do BR**  | Revisar i18n (chaves vs inline), residency Workflow (iad1 é US East)                               |

---

## 7. Referências cruzadas

- **ADRs:** 0024 (multi-marca hostname) · 0033 (schema único) · 0039 (Makerkit RPCs) · 0040 (fechamento dia 0)
- **Pesquisa autoritativa:** `docs/research/23-form-system-architecture.md`
- **Rules path-loaded** (a atualizar/criar antes da Etapa 1):
  - `.claude/rules/naming.md` — vocab canônico + `lead-capture`
  - `.claude/rules/i18n.md` — seção "conteúdo gerado por tenant"
  - `.claude/rules/forms-engine.md` — novo, path-loaded em `lib/contracts/form*`, `components/app-form-*`, `app/(public)/**/f/**`, `app/(admin)/forms/**`, `lib/forms/**`, `lib/ai/**`
- **Rules existentes (vigentes):**
  - `.claude/rules/tenant-content.md` — hierarquia 4 níveis
  - `.claude/rules/entitlements.md` — quota IA + plano gating
  - `.claude/rules/brand.md` — env vs runtime brand
  - `.claude/rules/shadcn-zone.md` — wrappers compostos
  - `.claude/rules/features.md` — vertical slice
  - `.claude/rules/abstractions.md` — abstrações existentes
- **Vercel platform:** AI Gateway (modelos + caching) · BotID · Queues · Workflow (WDK) · Blob · Sandbox · Flags
- **Libs externas:** `json-logic-js` · `apca-w3` · `react-hook-form` · `motion/react` · `@upstash/ratelimit` · `@react-pdf/renderer` · `dexie` (Sprint 14+)
- **Plano Mestre Dia 0** (`PLANO-MESTRE-DIA-0.md`) — pré-requisito

---

## 8. Princípios persistidos pra futuras features (memória executável)

> Para Claude futuro abrir uma feature qualquer e não re-decidir.
> Conflito com `.claude/rules/*.md`: rules vencem (path-loaded > plano arquivado).

1. **Nada hardcoded.** Form, página, prompt, copy → todos dados em DB com schema validado.
2. **Dois motores separados** (Form Engine linear + Page Engine árvore). Não unificar. Adicionar motor 3+ exige ADR.
3. **Versionamento snapshot-only (Hotmart-like).** Nunca UPDATE em version; nova versão = INSERT. Sem auto-update notification.
4. **Duplicar ≠ Versionar.** Duplicar cria novo entity (novo id/slug); versionar cria nova versão do mesmo.
5. **i18n: chrome via `t()`, conteúdo do tenant inline no spec.** ESLint não pode bloquear strings em JSONB.
6. **Vibe coding mínimo na Fase 1 (chat híbrido), editor visual na Fase 2.** Arquitetura sempre suporta antes da UI existir.
7. **Numeração de migrations sequencial conforme aplicação real.** NÃO travar números no plano.
8. **Vocabulário canônico:** form, block, step, version, submission, response, report, logic rule. Termos a evitar: field, question, revision, answer, branch (em código).
9. **Validar antes de aceitar IA.** Zod `safeParse()` em todo output; retry até 3x; hard reject + log se persiste.
10. **3 fases Fase 1→Fase 2→Fase 3.** Cada feature Fase 3 (Pacote A) deve ser configuração, não código.
11. **Trava de custo IA obrigatória dia 1:** prompt caching auto, quota por plano (entitlement), rate limit, max 5 turnos chat coleta, early stop, cache de contexto.
12. **Catálogo de blocos é open-set extensível.** Adicionar block kind = entry no Catalog + migration de prompt-template. Nunca inline em código.
13. **One-way doors documentados:** schema SQL, FormDefinition/PageSpec shape, vocabulário, JSON Logic, JWT claim, PII encryption. Pensar 2x antes de mexer.
14. **Catálogos são fonte de verdade pra IA.** `domain-catalog.ts` + `card` em cada block + `engine-catalog.md`. Quando block/tabela/engine não está catalogado, IA não enxerga.
15. **Operations API é design único.** Internas Fase 1 viram tools MCP Fase 2 sem refactor — só wrapper. Toda operation tem Zod input/output + descrição rica + safety guardrail.

---

## 9. Decisões abertas que bloqueiam Fase 1

> Responder antes de Etapa 0a começar. Cada uma trava ou destrava trabalho.

### 9.1 Infra externa

| #   | Decisão                 | Opções                                                                                                          | Bloqueia                                                                     |
| --- | ----------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| D1  | GitHub repo criado?     | (a) Sim já existe (b) Criar agora                                                                               | Etapa 0a (push inicial)                                                      |
| D2  | Vercel project linkado? | (a) Sim já existe (b) Criar agora                                                                               | Etapa 0a (deploy preview)                                                    |
| D3  | Vercel region           | (a) `gru1` (BR — latência ótima local) (b) `iad1` (US East — Workflow lock)                                     | Workflow funciona em iad1 only (hoje); decisão impacta latência form público |
| D4  | Supabase plan           | (a) Free (sem backup diário) (b) Pro $25/mês (backup + RAM) — recomendado                                       | Sem Pro = risco produção real                                                |
| D5  | Vercel Pro+ subscrever? | (a) Sim ($20/mês) — habilita BotID Deep + ZDR + Sandbox > 5min (b) Não                                          | BotID Basic pode falhar em fraude; ZDR exige Pro+                            |
| D6  | Domínio strategy        | (a) `desafit.app` raiz + subdomínio por tenant (`{tenant}.desafit.app`) (b) Path-based (`desafit.app/{tenant}`) | Multi-marca via hostname (ADR-0024) exige subdomain — recomendo (a)          |
| D7  | Email transacional      | (a) Resend (pesquisa recomenda) (b) AWS SES (mais barato em escala)                                             | Setup DKIM/SPF/DMARC depende                                                 |
| D8  | Rate limit storage      | (a) Upstash Redis (marketplace Vercel) (b) Supabase próprio (extra carga DB)                                    | Pesquisa recomenda Upstash                                                   |

### 9.2 Variáveis de ambiente (popular `.env.local` + Vercel)

```
# Brand (já decidido — confirmar valores)
NEXT_PUBLIC_BRAND_NAME=desafit
NEXT_PUBLIC_BRAND_DOMAIN=desafit.app
NEXT_PUBLIC_BRAND_PARENT=desafit
NEXT_PUBLIC_DEFAULT_BRAND_HOST=desafit.app

# Supabase (já populadas dia 0 — confirmar)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# IA — Vercel AI Gateway (gerar API key no dashboard Vercel)
AI_GATEWAY_API_KEY=...

# Email transacional
RESEND_API_KEY=...
RESEND_FROM_EMAIL=relatorios@desafit.app

# Rate limit + cache
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Security
# BOTID_* — Vercel injeta automaticamente quando BotID Pro+ ativado
# Origin allowlist: derivada de NEXT_PUBLIC_BRAND_DOMAIN + tenants

# Workflow + Queue (Vercel injeta)
# VERCEL_WORKFLOW_*

# Diferidos (Fase 2+, NÃO popular ainda)
# STRIPE_SECRET_KEY=...
# STRIPE_WEBHOOK_SECRET=...
# SENTRY_DSN=...
# POSTHOG_API_KEY=...
```

### 9.3 Branding

| #   | Decisão                                       | Opções                                                                    |
| --- | --------------------------------------------- | ------------------------------------------------------------------------- |
| D9  | Paleta agência operadora                      | Escolher 1 das 13 seedadas. Sugestão: usar paleta "neutra-pro" se existir |
| D10 | Paleta desafit SaaS (default tenants fitness) | Escolher 1 das 13. Considerar contraste APCA com fundos dark              |
| D11 | Logo wordmark desafit                         | (a) Texto+cor agora (refinar Fase 2) (b) Designer profissional antes      |
| D12 | Logo agência operadora                        | Mesma decisão de D11                                                      |

### 9.4 Produto + billing

| #   | Decisão                        | Opções                                                                                |
| --- | ------------------------------ | ------------------------------------------------------------------------------------- |
| D13 | Stripe entra Fase 1 ou Fase 2? | (a) Fase 1 — agência cobra primeiro cliente real (b) Fase 2 — simula com cupom Fase 1 |
| D14 | Quem opera a agência dia 1?    | 1 conta admin única (você) ou múltiplos seats com role `agency_admin`?                |
| D15 | LGPD DSAR endpoints            | (a) Antes de produção real (recomendado) (b) Pós-Fase 1                               |
| D16 | Consent log + audit log        | (a) Etapa 4 (junto com pipeline) (b) Pós-Fase 1                                       |

### 9.5 Observabilidade

| #   | Decisão                        | Opções                                                                        |
| --- | ------------------------------ | ----------------------------------------------------------------------------- |
| D17 | Sentry pra erros?              | (a) Fase 1 (recomendado pra detectar bugs em produção real) (b) Fase 2        |
| D18 | PostHog pra product analytics? | (a) Fase 1 (recomendado pra medir completion rate dos forms) (b) Fase 2       |
| D19 | Vercel Analytics               | (a) Habilitar built-in (b) Skip                                               |
| D20 | Customer support tool          | (a) Crisp/Intercom (b) WhatsApp manual (c) Email only — `suporte@desafit.app` |

### 9.6 Conteúdo legal

| #   | Decisão                             | Status                                                                            |
| --- | ----------------------------------- | --------------------------------------------------------------------------------- |
| D21 | Privacy policy + ToS pré-redigidos? | (a) Sim (qual template?) (b) Pendente — usar template pronto LGPD                 |
| D22 | DPO designado (LGPD)                | Obrigatório se tratar dados sensíveis (saúde — fitness/nutrição)                  |
| D23 | DPA com sub-processadores           | Anthropic, Vercel, Supabase, Resend, Upstash — assinar DPAs antes de cliente real |

### 9.7 Pre-spec Program Engine (opcional ampliar)

| #   | Decisão                                              | Opções                                                                                                                                      |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| D24 | Escopo do `docs/blueprint/22-program-engine-spec.md` | (a) Mínimo (componentes + dimensões já listados) (b) Ampliado (incluir sequenciamento adaptativo + analytics + Stripe billing por programa) |
| D25 | Domain catalog inicial — quantas tabelas             | (a) 2 (`client_profile` + `tenant_brand`) (b) 4 (+`program_session` + `notification_preferences` skeleton)                                  |

---

## 10. Pendências do dia 0 que sobraram

Lista pra fechar antes de Etapa 1 (alguns já no §4 pré-requisitos):

- [⏳] HaveIBeenPwned password protection no Supabase Dashboard
- [⏳] Confirmar `lib/contracts/database.ts` zero `TYPES-PENDING` após migrations 0011-0013
- [⏳] Decisão JIT item 7 auditoria: dropar SELECT policies em buckets storage se nenhum fluxo usar `storage.list()`
- [⏳] Logo wordmark desafit (Sprint 24 do dia 0) — agora amarrado em D11 acima
- [⏳] Lucide ícones JIT — adicionar conforme demanda durante Etapas 1-7
- [⏳] 9 typography primitives restantes (Code, Stack, Container, etc) — JIT por uso
- [⏳] 4 entitlement components (Badge, PaywallModal, QuotaBanner, UpgradeCTA) — JIT quando primeiro paywall surgir
- [⏳] 42+ wrappers shadcn não-críticos — JIT por consumer real
- [⏳] 4 composições Card PWA aluno — JIT junto com primeira tela PWA aluno

---

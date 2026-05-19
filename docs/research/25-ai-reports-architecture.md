# Sistema de Reports IA‑gerados para desafit.app — Documento de Decisão Arquitetural (Maio 2026)

## TL;DR (decisões cravadas)

- **Modelo padrão Sonnet 4.6 ($3,00 input / $15,00 output por MTok), Haiku 4.5 ($1,00 / $5,00) para scoring/enrichment, Opus 4.7 ($5,00 / $25,00) apenas tier premium opcional** — preços verificados em platform.claude.com/docs/en/about-claude/pricing. A combinação mantém o target de $0,02/submission viável **somente** com prompt caching agressivo (cache write 5min = 1,25x base, write 1h = 2x, read = 0,1x) sobre system prompt + few‑shot + brand context (~3.500 tokens estáveis). Sem caching, o custo médio em pior caso fica ~$0,038. Com caching estável e síncrono, atinge $0,018–$0,022 — confortável. **Não use Fast Mode** (6x premium, research preview). **Não use US‑only inference** (1,1x multiplier). Use o Vercel AI Gateway (0% markup confirmado: "We offer tokens at list price from the upstream providers with no markup") com fallback chain `['anthropic/claude-sonnet-4.6','anthropic/claude-sonnet-4.5','bedrock/anthropic.claude-sonnet-4.6']`. BYOK só quando volume justificar (>$200/mês).
- **Estrutura modular obrigatória (sections array com discriminated union por `kind`)** — texto livre 800–1500 palavras de Sonnet é tentador pela fluidez, mas inviabiliza renderização tokenizada (brand colors em headers, CTAs entre seções, próximos passos como bloco distinto), impede LLM-as-judge avaliar partes específicas e impede injeção determinística de disclaimers médicos. A estrutura `{ sections: [executive_summary, findings, recommendations, action_items, next_steps, disclaimers] }` é a única que escala para 6 verticais e permite PDF+web+email do mesmo payload. **`streamObject` fica para Fase 2** — note que tanto `generateObject` quanto `streamObject` foram formalmente deprecated no AI SDK v6 (PR #10754): conforme a guia oficial em ai-sdk.dev/docs/migration-guides/migration-guide-6-0, "_generateObject and streamObject have been deprecated… They will be removed in a future version. Use generateText and streamText with an output setting instead._" Implemente desde já via `generateText({ output: Output.object({ schema }) })`.
- **Pipeline durável via Vercel Workflow (GA 16-abr-2026), não chain de Queues manuais** — `'use workflow'` + steps `'use step'` resolvem retries, replay, idempotência e observabilidade sem YAML. Vercel anunciou a GA no blog "A new programming model for durable execution" (16-abr-2026), citando "_100M+ runs in beta across 1,500+ customers_" — i.e., a fase beta processou mais de 100 milhões de execuções em mais de 1.500 clientes antes do GA. Use Workflow Hooks para webhook fan-out (espera assíncrona até confirmação do parceiro). DLQ é nativo: step que excede `maxAttempts` emite `step_failed` → child workflow `escalate-to-human`.
- **Compliance + ética não são feature, são pré‑requisito de envio** — em fitness/nutrição, todo report deve conter `disclaimer` obrigatório injetado por regra determinística (não pelo LLM) com texto LGPD + CFM/CFN + "não substitui avaliação profissional". Constitutional principles no system prompt vetam promessas quantificadas ("perde X kg em Y dias"), linguagem estigmatizante e diagnósticos. LGPD: opt‑in explícito no form, unsubscribe one‑click em todos os emails (mesmo transacionais), retention 24 meses default, direito ao esquecimento via API. Multa máxima ANPD: 2% do faturamento, limitado a R$ 50M por infração.
- **Fundo do poço: o report é commodity em 12 meses. O valor real é a curadoria do prompt versionado por vertical + o sistema de evals que detecta drift** — Typeform anunciou enrichment "_With match rates reaching 92% for B2B and 71% for B2C based on real product usage_" (PRNewswire/Typeform, 4-fev-2026); Tally tem MCP server com ~21 tools; Jotform tem AI Agents conversacionais. O moat competitivo do desafit não é "ter IA" — é o `ai_prompt_versions` com 30+ goldens por vertical, LLM‑as‑judge rodando weekly, e o painel do profissional que combina report + lead_score + intent_level em fila priorizada. Construa essa camada cedo.

---

## Key Findings

1. **Pricing real Anthropic em mai/2026 (platform.claude.com/docs/en/about-claude/pricing):** Haiku 4.5 `$1,00 / $5,00` por MTok input/output, Sonnet 4.6 `$3,00 / $15,00`, Opus 4.7 `$5,00 / $25,00`. Todos com janela 1M tokens **sem surcharge** acima de 200K. Cache write 5min = 1,25x base ($3,75/MTok Sonnet); cache write 1h = 2x ($6,00/MTok); cache read = 0,1x ($0,30/MTok). Batch API = 50% off async. US‑only inference = 1,1x. Opus 4.7 lançou 16-abr-2026, e a documentação oficial Anthropic ("What's new in Claude 4.7") alerta: "_This new tokenizer may use roughly 1x to 1.35x as many tokens when processing text compared to previous models (up to ~35% more, varying by content)._" É armadilha de custo direta se migrar sem benchmark.

2. **AI SDK v6 estável (mai/2026):** `[email protected]` (jan/2026) é a versão recomendada; `v6.0.40` tem problemas conhecidos. `generateObject` e `streamObject` foram **formalmente deprecated** no AI SDK v6 (PR #10754) — a guia de migração 5→6 textual diz para usar `generateText` / `streamText` com `output: Output.object({ schema })`. O `@ai-sdk/anthropic` agora suporta `structuredOutputMode` nativo (Anthropic introduziu structured outputs em Sonnet 4.5+). **Decisão: chame internamente de "generateObject" no schema desafit, mas implemente via `Output.object()` para não pagar dívida técnica quando o helper antigo for removido em v7.**

3. **Vercel Workflow GA em 16-abr-2026** (Vercel blog "A new programming model for durable execution"): "_100M+ runs in beta across 1,500+ customers_" pré-GA. Diretivas `'use workflow'` e `'use step'` compilam para handlers HTTP isolados via plugin SWC. Limites por run: **25.000 events, 10.000 steps, 2 GB max entity storage, 50 MB payload, concorrência 100.000**. Replay fica lento acima de 2.000 events ou 1 GB — Vercel recomenda quebrar em child workflows. Storage retention pós-run: Hobby 1d, Pro 7d, Enterprise 30d. Rate limit Pro: 1M req/minuto.

4. **Vercel Workflow pricing tem inconsistência ativa entre páginas (mai/2026):** a página `/pricing` lista `$20 per 1M Events`, `$0,50 per GB Data Written`, `$0,50 per GB-month Data Retained` com 50.000 events e 1 GB inclusos no Pro. A página `/docs/workflows/pricing` mostra outro modelo: `Workflow Steps $2,50 per 100K (50K incl)` + `Workflow Storage $0,00069 per GB-hour (720 GB-hours incl)`. **Decisão prática:** dimensione assumindo o pior caso (~$20/1M events). Um pipeline de 7 steps com retries médios = ~25 events/submission → 25k submissions/mês = 625k events = ~$12,50 só de workflow events, antes de blob/queue/AI.

5. **Vercel Queues Public Beta (27-fev-2026):** $0,60 por 1M operações, metering em chunks de 4 KiB (mensagem de 12 KiB = 3 ops). Sends com `idempotencyKey` ou push com max concurrency = 2x. Para 1 enqueue + 1 dequeue por submission o custo é desprezível (~$0,001 por 1k submissions). Use Queues como buffer para BotID + dedup (`idempotencyKey = form_submission_id`), Workflow para a lógica.

6. **Vercel AI Gateway tem 0% markup confirmado** (docs e blog: "_We offer tokens at list price from the upstream providers with no markup_"). Free tier $5/mês em créditos por team. Caching auto via `providerOptions.gateway.caching: 'auto'` (aplica `cache_control` Anthropic automaticamente). Fallback chain via `providerOptions.gateway.models: [...]`. Sem rate limit do Gateway; rate limit é upstream. **Decisão: Gateway com OIDC em dev (12h tokens) e API key em prod; BYOK quando volume sair de $200/mês.**

7. **Resend pricing (verificado abr/2026):** Free 3.000/mês (100/dia hard cap), Pro $20/mês 50.000 emails, Scale $90/mês 100.000 → $1.150/mês 2,5M. Overage Pro = $0,40/1.000 emails. **Rate limit padrão 5 req/s por team** (não por API key) — gargalo se fanout webhook+email+notification em paralelo. Use Batch API (até 100 emails/call). React Email 5.0 (out/2025) trouxe dark mode tested + Tailwind 4 + integração nativa com Resend Templates API. Webhook delivery: 15 event types, retries exponenciais até 10h.

8. **@react-pdf/renderer v4.5.1 (publicado abr/2026):** continua o padrão para SSR PDF em Next.js. Footprint ~2 MB vs ~300 MB Puppeteer/Chromium. Compatível com React 19 desde v4.1.0. Para App Router, use `renderToStream(<Doc/>)` em route handler. Pitfall: fontes WOFF2 Google Fonts falham silenciosamente em serverless; use TTF/OTF auto-hospedadas em Blob. p95 alvo: 2–4s para 5-15 páginas com brand assets cacheados.

9. **Vercel BotID (Kasada-powered):** Basic gratuito todos planos, **Deep Analysis $1 por 1.000 checks** em Pro/Enterprise. Cobrança por `checkBotId()` invocado; passive page views não contam. Diferença vs Cloudflare Turnstile: Turnstile é unlimited free em Managed mode mas exige widget (ou invisible JS challenge), funciona em qualquer plataforma; BotID é Vercel-only, sem challenge visível em Basic, usa ML da Kasada. **Decisão:** BotID Basic no submit (gratuito), upgrade Deep Analysis ($1/1k) apenas se spam > 2%.

10. **MaxMind GeoLite2 permanece grátis em 2026 sob EULA atualizada (12-fev-2026)** com atribuição CC. Vercel expõe headers `x-vercel-ip-country`, `x-vercel-ip-city`, `x-vercel-ip-latitude/longitude`, `x-vercel-ip-timezone` em todos os planos sem custo extra — mas **`req.geo` foi deprecated em middleware Next.js 16** em favor de `geolocation(request)` de `@vercel/functions`. **Decisão: use `geolocation()` na Fase 1 (zero custo); migre para IPinfo Core ($99/mo) ou MaxMind precision em Fase 3 se city accuracy virar reclamação.** Clearbit foi adquirida pela HubSpot (nov/2023) e rebatizada Breeze Intelligence (set/2024); API standalone foi sunset para novos clientes. Alternativas: **Apollo $49/user/mo (1 credit/email, 8/phone)**, **Hunter $34/mo (2k unified credits)**, **Lusha Pro $29,90/user/mo (250 credits, phone = 10 credits)**, **RB2B Free $0** (mas person-level só US — inútil para tráfego BR).

11. **Form builders concorrentes em mai/2026:** PRNewswire/Typeform anunciou em 4-fev-2026: "_With match rates reaching 92% for B2B and 71% for B2C based on real product usage, Typeform's enrichment helps businesses achieve a clearer view of who is behind every form submission._" Jotform AI Agents fazem conversas 24/7 sobre forms (Gold $99-129/mês). Tally tem MCP server com ~21 tools mas sem geração de reports IA. Jotform e Typeform têm MCP em GA/beta. Nenhum dos players entrega o fluxo "lead preenche → report PDF white-label + email assinado + painel do profissional com lead_score" como produto integrado — é exatamente o gap que o desafit ocupa. **A janela de diferenciação é o multi-tenant white-label vertical-aware + brand tokens OKLCH, não o report em si.**

12. **LGPD (verificado em ICLG Brazil 2025-2026 e DLA Piper):** não há lei específica para email marketing eletrônico no Brasil; aplicam-se LGPD (consentimento/legítimo interesse), CDC (opt-out obrigatório) e Código de Autorregulamentação de Email Marketing (soft opt-in se há relação comercial pré-existente). Multas: até **2% do faturamento, limitado a R$ 50M por infração**. **Para emails transacionais** (report enviado ao lead que submeteu o form), legítimo interesse cobre — o lead pediu. Para emails subsequentes de marketing/nurture, exige opt-in separado. Unsubscribe one-click é não-negociável.

---

## Details — Respostas às 24 perguntas

### 1. Estrutura ótima de report B2B — Modular, ponto.

**Decisão: array `sections` com discriminated union por `section_kind`. Texto livre monolítico é descartado.**

Por quê:

- **Monolítico (texto livre 800-1500 palavras):** a saída de Sonnet é eloquente, mas você perde controle de:
  - injeção determinística do disclaimer médico/jurídico (precisa ser bloco isolado, não parágrafo que o modelo pode reescrever ou omitir);
  - branding (cores OKLCH em headers, divisores entre seções, CTA box com cor primária do tenant);
  - tracking granular ("usuário scrollou até `findings` mas não chegou em `next_steps`");
  - LLM-as-judge avaliar findings vs recommendations separadamente;
  - parcial recovery (se stream cai, ainda há `executive_summary` salvo).
- **Modular:** cada seção é renderizável, cacheável, scoreable, traduzível e revisável independentemente. PDF, email e web preview consomem o mesmo payload. Custo: ~10-15% mais output tokens (estrutura repetida) — irrelevante dado o budget.

Trust signals por vertical:

- **Fitness/yoga:** foto profissional + CREF/CONFEF no header do PDF; bloco `disclaimers` rodapé com "consulte um médico antes de iniciar atividade física"; CTA "Agendar aula experimental".
- **Idiomas:** certificações CELTA/TEFL/DELTA em badge; CTA "Agendar nivelamento de 30 min"; sample audio link (Fase 2).
- **Coaching:** ICF certification (PCC/ACC/MCC) se aplicável; disclaimer ético "coaching não é terapia"; CTA "Conversa de descoberta gratuita".
- **Nutrição:** CRN obrigatório no header; disclaimer CFN "conteúdo educacional, não constitui prescrição"; CTA "Avaliação nutricional".

**Justificativa cravada:** estrutura modular custa ~$0,0002 a mais por report. Em troca, controle de compliance, brand fidelity, A/B test por seção e reaproveitamento de `executive_summary` em SMS/WhatsApp (Fase 3). Não há trade-off — modular sempre.

### 2. Zod shape para ReportContent

```typescript
// schemas/report.ts
import { z } from 'zod'

const Trustable = z.object({
  confidence: z.enum(['high', 'medium', 'low']).default('high'),
  sourceFields: z.array(z.string()).default([]),
})

const ExecutiveSummary = z
  .object({
    kind: z.literal('executive_summary'),
    title: z.string().min(3).max(80),
    paragraphs: z.array(z.string().min(40).max(600)).min(2).max(4),
  })
  .merge(Trustable)

const Finding = z.object({
  label: z.string().min(3).max(60),
  description: z.string().min(20).max(400),
  severity: z.enum(['info', 'opportunity', 'attention']).optional(),
})

const Findings = z
  .object({
    kind: z.literal('findings'),
    title: z.string().min(3).max(80).default('O que observamos'),
    items: z.array(Finding).min(2).max(6),
  })
  .merge(Trustable)

const Recommendation = z.object({
  label: z.string().min(3).max(80),
  rationale: z.string().min(20).max(500),
  effort: z.enum(['low', 'medium', 'high']).optional(),
  horizon: z.enum(['short_term', 'mid_term', 'long_term']).optional(),
})

const Recommendations = z
  .object({
    kind: z.literal('recommendations'),
    title: z.string().min(3).max(80).default('Recomendações'),
    items: z.array(Recommendation).min(2).max(5),
  })
  .merge(Trustable)

const ActionItem = z.object({
  text: z.string().min(5).max(160),
  whenLabel: z.string().max(40).optional(),
  priority: z.enum(['p1', 'p2', 'p3']).default('p2'),
})

const ActionItems = z
  .object({
    kind: z.literal('action_items'),
    title: z.string().default('Próximas ações'),
    items: z.array(ActionItem).min(1).max(8),
  })
  .merge(Trustable)

const NextSteps = z.object({
  kind: z.literal('next_steps'),
  title: z.string().default('Continue com um profissional'),
  body: z.string().min(40).max(500),
  cta: z.object({
    label: z.string().min(3).max(40),
    placeholder: z.literal('{{cta_url}}'), // server injects URL
  }),
})

const Disclaimer = z.object({
  kind: z.literal('disclaimer'),
  textKey: z.enum([
    'medical_fitness',
    'nutrition',
    'coaching_not_therapy',
    'languages_assessment',
    'generic_lgpd',
  ]),
})

export const ReportSection = z.discriminatedUnion('kind', [
  ExecutiveSummary,
  Findings,
  Recommendations,
  ActionItems,
  NextSteps,
  Disclaimer,
])

export const ReportContent = z.object({
  locale: z.enum(['pt-BR']).default('pt-BR'),
  vertical: z.enum(['fitness', 'yoga', 'languages', 'coaching', 'nutrition', 'lead_capture']),
  sections: z.array(ReportSection).min(3).max(8),
  topics: z.array(z.string().min(2).max(40)).max(6).default([]),
  tone_used: z.enum(['casual', 'professional', 'motivating', 'clinical']),
})

export type TReportContent = z.infer<typeof ReportContent>
```

**Serialização para `ai_prompt_versions.output_schema_jsonb`:** use `z.toJSONSchema(ReportContent)` (Zod 4 nativo). Cuidado com o bug conhecido `[BUG] zod schemas produce non-strict-mode-compatible JSON Schema for OpenAI structured outputs` (mastra/mastra#16383, jan/2026) — afeta OpenAI strict mode mas **não Anthropic**, que aceita o `anyOf` que Zod gera para discriminated unions. Persista o JSON Schema (não o objeto Zod) em jsonb para audit/replay determinístico.

**Constraints determinísticas:**

- `sections` máx 8 ⇒ output cap ~4.000 tokens em Sonnet 4.6 (suficiente para 5–15 páginas PDF).
- Cada `description`/`body` máx 500–600 chars ⇒ previne runaway costs.
- `disclaimer.textKey` é enum: o LLM escolhe a chave, o servidor injeta o texto **canônico** revisado pelo jurídico. Não negociável para fitness/nutrição.

**Recursivo (subsections)?** Não. Em protótipo: aumenta complexidade do renderer e prompt, e Sonnet trapaceia (cria seções alinhadas fingindo hierarquia). Profundidade 1 é suficiente.

### 3. Prompt engineering avançado — escolhas

**Recomendação para Sonnet 4.6 em mai/2026:**

| Técnica                                  | Veredito                                                                                                                                                                                                                        | Uso                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Chain-of-Thought (CoT)**               | **Adote.** Sonnet 4.6 com `effort: 'medium'` + thinking budget 1.024–2.048 tokens dá ganho mensurável em coerência findings → recommendations. Custo: thinking conta como output ($15/MTok). +1k thinking = +$0,015. Aceitável. | Sempre.                       |
| **Decomposition (section by section)**   | **Rejeite.** Em 2024 fazia sentido com modelos menores. Sonnet 4.6 gera o report completo em uma chamada com qualidade superior à concatenação. E perde cache hit do system prompt em 5 dos 6 calls extras.                     | Apenas se output > 6k tokens. |
| **Few-shot (3-5 exemplos)**              | **Adote.** 3 exemplos completos por tom no system prompt, cacheados em 5min (1,25x write, 0,1x read = pago em 1 hit). Ganho qualitativo > 30% em fidelidade ao schema.                                                          | 3 fixos por vertical.         |
| **Tree-of-Thoughts**                     | **Rejeite.** 2–3x custo, ganho marginal em report estruturado.                                                                                                                                                                  | Não.                          |
| **Constitutional AI (rubrica embutida)** | **Adote.** "Nunca prometa resultado quantificado. Nunca diagnostique. Cite o campo do form." Barato (300 tokens cacheados), mensurável via LLM-as-judge.                                                                        | Sempre.                       |
| **Self-Consistency (N e vota)**          | **Rejeite Fase 1.** 5x custo. Em Fase 3, no tier premium com Opus 4.7, gere N=3 e use Haiku como juiz.                                                                                                                          | Tier premium futuro.          |

**Trade-off cravado:** CoT + few-shot + Constitutional AI em Sonnet 4.6 = ~$0,022/report em pior caso e ~$0,015 com cache estável. Sweet spot.

### 4. System prompt structure

```text
<role>
Você é o "Coach Report Writer" do desafit.app, um assistente especialista em
gerar relatórios personalizados para profissionais de {{vertical}} (fitness,
yoga, idiomas, coaching, nutrição). O destinatário do report é o LEAD (cliente
final), não o profissional. Seu trabalho é entregar valor IMEDIATO ao lead
enquanto deixa claro que a próxima etapa é falar com o profissional.
</role>

<inviolable_rules>
1. NUNCA prometa resultados quantificados em tempo definido
   (proibido: "perde 10kg em 30 dias", "fluência em 6 meses").
2. NUNCA diagnostique condições clínicas, psicológicas ou nutricionais.
3. NUNCA use linguagem estigmatizante sobre corpo, peso, idade, gênero,
   sotaque, nacionalidade ou nível socioeconômico.
4. NUNCA invente dados que não estejam nas respostas do form. Se faltar
   informação, use `confidence: "low"` e seja explícito.
5. SEMPRE inclua uma seção `next_steps` com CTA para falar com o profissional.
6. SEMPRE responda em pt-BR, tom {{tone}}.
7. SEMPRE devolva JSON que valide contra o schema ReportContent.
</inviolable_rules>

<brand_context>
Profissional: {{professional_name}}
Marca: {{tenant_brand_name}}
Vertical: {{vertical}}
Tom: {{tone}}
</brand_context>

<rubric>
Cada section deve ter `confidence` honesto. Use "low" quando inferir além do
form. Use "high" quando justificada literalmente por uma resposta.
Liste em `sourceFields` os IDs dos campos que justificam aquele bloco.
</rubric>

<output_schema>{{JSON_SCHEMA}}</output_schema>

<examples>
<!-- 3 few-shot examples per tone, ~600 tokens each -->
</examples>
```

**Tamanho ideal para cache hit:** Anthropic exige mínimo de **1.024 tokens** (Sonnet) para que `cache_control` funcione. O system prompt fica em ~2.800–3.500 tokens — ideal. Marque `cache_control` no final do bloco `<examples>`. Em ~10 reports/hora na mesma janela 5min, o cache write paga-se na 2ª chamada.

**Versionamento:** persista texto completo em `ai_prompt_versions.system_text` (TEXT) com hash SHA256 em `system_text_hash`. Em cada `ai_invocations` registre `prompt_version_id` (FK). Mudança no system prompt = nova row, nunca update — replay determinístico depende disso.

### 5. User prompt template

```text
<submission_context>
Vertical: {{vertical}}
Locale: {{locale}}
Tom solicitado: {{tone}}
Profissional: {{professional_name}} ({{professional_credentials}})

Respostas do formulário:
{{#each form_answers}}
- [{{field_id}}] {{field_label}}: {{value}}
{{/each}}

Enrichment (use com cautela; pode estar incompleto):
- Cidade/UF: {{enrich.geo.city}}/{{enrich.geo.region}}
- Sinais de email: {{enrich.email.signals}}
</submission_context>

<task>
Gere um report personalizado em JSON que valide contra o schema fornecido.
- Inclua 3-6 sections (não pule executive_summary, findings, next_steps).
- Cite IDs de campos em `sourceFields` quando aplicável.
- Para `disclaimer`, escolha o `textKey` apropriado para vertical={{vertical}}.
- Não inclua URLs; o servidor injeta CTA url.
</task>
```

**Variáveis dinâmicas por request:** `form_answers`, `enrich.*`, `professional_*`. Tudo isso **fora** do bloco cacheado. **Variáveis estáveis:** `vertical`, `locale`, `tone`, schema — dentro do system prompt cacheado.

**Compactação para caching:** mova texto repetido (descrições de fields padrão) para system prompt. User prompt fica ~600–1.200 tokens, sempre dinâmico.

### 6. Personalização por vertical — quais templates curar Fase 1

**Decisão:** **6 templates iniciais**, só **3 GA na Fase 1**.

| Template                         | Fase 1 (GA) | Fase 2 (beta) | Justificativa                                     |
| -------------------------------- | ----------- | ------------- | ------------------------------------------------- |
| `report-fitness-onboarding`      | ✅          |               | Maior demanda.                                    |
| `report-coaching-discovery`      | ✅          |               | Alto ticket, mercado em expansão.                 |
| `report-lead-capture` (genérico) | ✅          |               | Fallback safe para verticais não cobertas.        |
| `report-yoga-onboarding`         |             | ✅            | Compartilha 80% com fitness; vira variante.       |
| `report-languages-assessment`    |             | ✅            | Precisa de campo "nível atual" calibrado.         |
| `report-nutrition-assessment`    |             | ✅            | Disclaimer CFN é crítico, exige revisão jurídica. |

**Campos que variam por template:**

- `system_text` (persona, rubrica específica);
- `output_schema_jsonb` (em nutrição/fitness, `Findings` exige `severity`; em coaching é opcional);
- `default_disclaimer_keys` (array de `textKey` que o servidor injeta automaticamente, independente do LLM);
- `default_tone`;
- `golden_cases` (ref para 30 briefs);
- `model_default` (Haiku para `lead_capture` genérico, Sonnet para os outros).

### 7. Personalização por tom

**Decisão: 1 template flexível com `tone` como variável, não N templates por tom.**

Tom muda 3-4 linhas do system prompt (persona) e o estilo dos few-shot examples. Multiplicar templates (6 verticais × 4 tons = 24) é insustentável para manutenção, evals e versionamento.

```sql
CREATE TYPE tenant_tone AS ENUM ('casual', 'professional', 'motivating', 'clinical');
ALTER TABLE tenants ADD COLUMN tone tenant_tone NOT NULL DEFAULT 'professional';
```

O system prompt injeta `{{tone}}` em duas posições: linha de persona ("tom: motivating, use linguagem encorajadora porém realista") e seleção do few-shot block (3 examples por tom). Para consistência, force o LLM a echoar `tone_used: '{{tone}}'` no output e valide.

**Quando split em N templates:** quando um tom exigir reescrita de `inviolable_rules`. Ex: `clinical` em nutrição precisa de regra extra "use unidades SI". Aí sim quebra.

### 8. streamObject patterns Fase 2

**Fase 1 não usa streaming.** O report é gerado dentro do Workflow step `generate-report`; o cliente nunca vê o stream. Fluxo: form submit → "Estamos preparando seu report, você receberá em até 30 segundos" → email + push.

**Fase 2 (preview no painel do profissional):**

- `streamText({ output: Output.object(...) })` (v6 stable) com `partialObjectStream`.
- Anthropic requer header `anthropic-beta: fine-grained-tool-streaming-2025-05-14` para streaming incremental de structured output (caso contrário tudo chega de uma vez após delay).
- **Persistência durante stream:** em cada chunk válido (validar com `safeParse` parcial), faça `await put(blobKey, JSON.stringify(partial), { allowOverwrite: true })` em throttling de 500ms. Se conexão cai, retomar leitura do Blob.
- **Trade-off vs síncrono:** streaming melhora UX percebida mas custa I/O e exige cleanup de partials órfãos (cron diário). Em report B2B onde o lead pode esperar 20–30s, não há ganho real. **Use streaming apenas no painel do profissional regenerando manualmente, não no fluxo do lead.**

### 9. Cancelamento mid-stream

- `AbortSignal` é suportado nativamente no AI SDK v6 (`generateText({ abortSignal, ... })`). Em Anthropic via Gateway, abortar **encerra a request upstream** — você paga apenas pelos tokens já gerados (verificado em request logs do Gateway).
- **Comportamento real:** Anthropic continua faturando os output tokens já enviados antes do abort + os input tokens completos. Não há "refund parcial".
- **Logging em `ai_invocations`:**
  ```sql
  status: 'aborted',
  metadata: jsonb {
    aborted_at_token_count: 412,
    abort_reason: 'user_cancelled' | 'timeout' | 'budget_exceeded',
    partial_blob_url: 'https://...'
  }
  ```
- Em workflow, use `AbortController` no step com timeout de 60s. Se abort, marque `form_reports.status = 'cancelled'`, **não retente** automaticamente (cancelamento é decisão deliberada).

### 10. Retry estratégia detalhada

| Tipo de falha                             | Estratégia                                                                     | Max attempts | Backoff              | Log                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------ | ------------ | -------------------- | -------------------------------------------------- |
| **Zod schema invalid**                    | fix prompt: anexa erro de validação + último output ao messages, pede correção | 3            | imediato             | `status='retry_schema', metadata.zod_issues=[...]` |
| **Network / 5xx**                         | exponential backoff                                                            | 5            | 1s, 2s, 4s, 8s, 16s  | `status='retry_network'`                           |
| **Rate limit (429)**                      | esperar `retry-after` header + jitter                                          | até 3        | header value + 500ms | `status='retry_ratelimit'`                         |
| **Hallucinated block kind**               | trata como schema invalid → fix prompt                                         | 3            | imediato             | `metadata.hallucination='unknown_kind'`            |
| **Budget exceeded** (tenant esgotou cota) | não retenta, falha hard                                                        | 0            | —                    | `status='budget_exceeded'`                         |
| **Content filter / safety**               | não retenta, fallback estático                                                 | 0            | —                    | `status='safety_blocked'`                          |

**Implementação:** Vercel Workflow já dá retries por step. Use `'use step'` com `{ maxAttempts: 3, backoff: 'exponential' }` para retries de transporte. Para schema invalid faça loop _dentro_ do step (3 iterações de fix prompt), porque conta como uma operação lógica.

Após 3 fix prompts falhados → step falha → workflow vai para branch `fallback-template` (seção 11).

### 11. Fallback template estático

```markdown
# Olá {{lead.first_name}},

Recebemos suas respostas e nosso sistema está preparando um plano personalizado.
Enquanto isso, separamos alguns próximos passos:

## O que vimos

{{#each form_answers_summary}}

- **{{label}}**: {{value}}
  {{/each}}

## Próximas ações

1. Reserve 30 minutos para conversar com {{professional_name}}.
2. Anote suas principais dúvidas e objetivos.

## Fale com um profissional

{{professional_name}} ({{professional_credentials}}) está disponível para
agendar uma conversa: [Agendar agora]({{cta_url}})

---

{{disclaimer_text}}

— Equipe {{tenant_brand_name}}
```

**Audit log:**

```typescript
await db.insert(ai_invocations).values({
  form_submission_id,
  status: 'fallback',
  fallback_reason: 'schema_invalid_x3' | 'safety_blocked' | 'budget_exceeded',
  model: null,
  cost_usd: 0,
  tokens_in: 0,
  tokens_out: 0,
})
await db.update(form_reports).set({
  status: 'fallback_static',
  content_md: renderedTemplate,
})
```

**Decisão crítica:** fallback **ainda envia email + cria PDF**, com header discreto "Versão simplificada — em breve enviaremos seu plano completo". Nunca deixe o lead sem resposta. SLA de 5 minutos para regenerar manualmente (notificação ao admin via Slack/Sentry).

### 12. PDF layout patterns com @react-pdf/renderer v4.5.1

```tsx
// pdf/ReportDocument.tsx
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer'

// Pre-register fonts at module load (host TTF in Vercel Blob)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://blob.vercel-storage.com/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: 'https://blob.vercel-storage.com/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
})

function oklchToSrgb(oklchString: string): string {
  // Server-side via culori or colorjs.io
  // @react-pdf does NOT understand oklch() — must pre-convert
  return convertOklch(oklchString)
}

function makeStyles(brand: BrandTokens) {
  const primary = oklchToSrgb(brand.primary)
  const ink = oklchToSrgb(brand.ink)
  return StyleSheet.create({
    page: { padding: 48, fontFamily: 'Inter', fontSize: 11, color: ink },
    header: {
      position: 'absolute',
      top: 24,
      left: 48,
      right: 48,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    logo: { width: 96, height: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: primary, marginTop: 16, marginBottom: 8 },
    cta: {
      backgroundColor: primary,
      color: '#fff',
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
      textAlign: 'center',
    },
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 48,
      right: 48,
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 9,
      color: '#9ca3af',
    },
  })
}

export function ReportDocument({ report, brand, professional }: Props) {
  const styles = makeStyles(brand)
  return (
    <Document title={`Report ${professional.name}`} author={brand.name}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <Image src={brand.logoUrl} style={styles.logo} />
          <Text style={{ fontSize: 9, color: '#9ca3af' }}>{brand.name}</Text>
        </View>
        {report.sections.map((s, i) => (
          <SectionRenderer key={i} section={s} styles={styles} />
        ))}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}  ·  ${brand.name}`}
        />
      </Page>
    </Document>
  )
}
```

Route handler (Next.js 16 App Router):

```tsx
// app/api/internal/pdf/[reportId]/route.ts
import { renderToStream } from '@react-pdf/renderer'

export async function GET(_: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params
  const data = await getReportData(reportId)
  const stream = await renderToStream(<ReportDocument {...data} />)
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
```

**Pitfalls e decisões:**

- **OKLCH → sRGB:** @react-pdf usa color model PDF/A, não entende `oklch()` direto. Use `culori` no servidor para pré-converter; persista versão sRGB em `tenants.brand_tokens_resolved_jsonb` (não recomputar a cada render).
- **Paginação:** `wrap` no `<Page>` + `<View wrap={false}>` em blocos não-quebráveis (action_items, disclaimer). NUNCA condicione `<Page>` — todas renderizam.
- **Tabelas:** não nativo. Use `<View flexDirection="row">` para linhas + `flex: 1` para colunas. Para `findings.severity` use badges (`<View backgroundColor={severityColor}>`).
- **Gráficos SVG inline:** `<Svg>` suportado em v4. Para barras de score 0–100, gere SVG no servidor com `d3-shape` e inline.
- **Tamanho-alvo 5–15 páginas:** schema cap (8 sections × ~600 chars) gera 5–8 páginas — adequado.
- **p95 < 3s:** alcançável quando fontes estão em Blob (NÃO Google Fonts WOFF2 — falha silenciosa em serverless), logo é JPG ≤ 100 KB, sem Puppeteer. Em testes reais: ~1,8s mediano em Vercel Pro fluid compute.

### 13. Email delivery com Resend

```tsx
// emails/ReportReadyEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
  Link,
} from '@react-email/components'

export function ReportReadyEmail({
  leadFirstName,
  professionalName,
  brand,
  reportUrl,
  unsubscribeUrl,
}: Props) {
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`:root{color-scheme:light dark}`}</style>
      </Head>
      <Body
        style={{
          backgroundColor: '#f9fafb',
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
        }}
      >
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
          <Img src={brand.logoUrl} width={140} height={32} alt={brand.name} />
          <Section
            style={{ backgroundColor: '#ffffff', padding: 32, borderRadius: 12, marginTop: 16 }}
          >
            <Text style={{ fontSize: 22, fontWeight: 700, color: brand.inkSrgb }}>
              Seu plano está pronto, {leadFirstName} 🎯
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 1.6, color: '#374151' }}>
              {professionalName} preparou um plano personalizado a partir das suas respostas. Você
              pode abrir online ou baixar o PDF.
            </Text>
            <Button
              href={reportUrl}
              style={{
                backgroundColor: brand.primarySrgb,
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                marginTop: 16,
              }}
            >
              Abrir meu plano
            </Button>
            <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
            <Text style={{ fontSize: 11, color: '#6b7280' }}>
              Este email foi enviado por {brand.name} a pedido seu, após você preencher o
              formulário. Se preferir não receber emails da {brand.name},{' '}
              <Link href={unsubscribeUrl}>cancele aqui</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

Send:

```typescript
import { Resend } from 'resend';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: `${brand.name} <noreply@${brand.sendingDomain}>`,
  to: lead.email,
  subject: `Seu plano personalizado com ${professionalName}`,
  html: await render(<ReportReadyEmail {...props} />),
  text: await render(<ReportReadyEmail {...props} />, { plainText: true }),
  headers: {
    'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:unsub-${reportId}@${brand.sendingDomain}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'X-Entity-Ref-ID': reportId,
  },
  tags: [
    { name: 'tenant', value: tenantId },
    { name: 'vertical', value: vertical },
  ],
});
```

**Decisões cravadas:**

- **DKIM + SPF + DMARC obrigatório por tenant** via subdomínio `mail.{tenant_domain}` configurado em Resend Domains API. White-label exige domain-per-tenant — caso contrário deliverability cai e marca fica "via resend.com".
- **Dark mode:** React Email 5.0 testou dark mode em Gmail/Outlook/Apple Mail. Use `color-scheme: light dark` + cores invertíveis. Logos com versão dark via media query em `<Head>`.
- **Plain text fallback:** sempre. Aumenta deliverability e cobre clientes que bloqueiam HTML.
- **Bounce handling (Resend webhook):**
  ```typescript
  // app/api/webhooks/resend/route.ts
  import { Webhook } from 'svix'
  export async function POST(req: Request) {
    const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET!)
    const payload = wh.verify(await req.text(), Object.fromEntries(req.headers))
    switch (payload.type) {
      case 'email.bounced':
        await db
          .update(form_submissions)
          .set({ email_status: 'bounced', email_bounce_reason: payload.data.reason })
          .where(eq(form_submissions.email, payload.data.to[0]))
        break
      case 'email.complained':
        await db
          .update(leads)
          .set({ marketing_opt_out: true, complained_at: new Date() })
          .where(eq(leads.email, payload.data.to[0]))
        break
    }
    return Response.json({ ok: true })
  }
  ```
- **Unsubscribe LGPD:** rota `/(public)/unsubscribe?token={hmac}` valida HMAC, atualiza `leads.marketing_opt_out=true`, retorna confirmação. Token único, max-7-day expiry.
- **Rate limit Resend (5 req/s por team):** use Batch API ou queue dedicada com concorrência 4 (margem).

### 14. Share link security — HMAC-SHA256

```typescript
// lib/share-link.ts
import crypto from 'node:crypto'

export function signReport({
  reportId,
  tenantSecret,
  expiresAt, // unix seconds
}: {
  reportId: string
  tenantSecret: string
  expiresAt: number
}) {
  const payload = `${reportId}.${expiresAt}`
  const sig = crypto.createHmac('sha256', tenantSecret).update(payload).digest('base64url')
  return { token: `${expiresAt}.${sig}`, payload }
}

export function verifyReport({
  reportId,
  token,
  tenantSecret,
}: {
  reportId: string
  token: string
  tenantSecret: string
}): {
  ok: boolean
  reason?: 'expired' | 'invalid' | 'malformed'
} {
  const parts = token.split('.')
  if (parts.length !== 2) return { ok: false, reason: 'malformed' }
  const [expStr, sig] = parts
  const expiresAt = Number(expStr)
  if (!Number.isFinite(expiresAt)) return { ok: false, reason: 'malformed' }
  if (expiresAt < Math.floor(Date.now() / 1000)) return { ok: false, reason: 'expired' }
  const expected = crypto
    .createHmac('sha256', tenantSecret)
    .update(`${reportId}.${expiresAt}`)
    .digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return { ok: false, reason: 'invalid' }
  if (!crypto.timingSafeEqual(a, b)) return { ok: false, reason: 'invalid' }
  return { ok: true }
}
```

**Decisões:**

- **Expiração default 30 dias** (não 7). Lead pode demorar para abrir; PDF é referência por semanas. Renovável via "regenerar link" no painel.
- **Revogação:** `form_reports.share_revoked_at TIMESTAMP NULL`. Verificação adicional após HMAC válido. Não rotacione `tenantSecret` (invalidaria TODOS os shares); revogação é per-report.
- **View tracking:**
  ```sql
  ALTER TABLE form_reports
    ADD COLUMN view_count INT NOT NULL DEFAULT 0,
    ADD COLUMN first_viewed_at TIMESTAMP NULL,
    ADD COLUMN last_viewed_at TIMESTAMP NULL;
  CREATE TABLE form_report_views (
    id BIGSERIAL PRIMARY KEY,
    report_id UUID NOT NULL,
    ts TIMESTAMP NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT,
    is_bot BOOLEAN NOT NULL DEFAULT FALSE
  );
  ```
- **Rate limit por token (Upstash Redis):** `INCR share:${token}:${minute}` com TTL 60s. Limite 30 views/min por token. Acima → 429.
- **Diferenciação robôs vs humanos:**
  - User-Agent contém `Slackbot|TwitterBot|WhatsApp|FacebookExternalHit|LinkedInBot|Discordbot|Telegrambot|bingbot|Googlebot` → log com `is_bot=true`, **não incrementa view_count** (gera unfurl com OG tags estáticas, não abre o report).
  - Sem JS execution / `Accept: text/html` puro → bot.
  - Para humanos, conte uma view por sessão (cookie 24h) para evitar inflação.

### 15. Web preview do report

```tsx
// app/(public)/[tenant]/r/[token]/page.tsx (RSC)
import { notFound } from 'next/navigation'

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ tenant: string; token: string }>
}) {
  const { tenant: tenantSlug, token } = await params
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) notFound()

  const reportId = await resolveReportId(token, tenant.id)
  if (!reportId) notFound()

  const v = verifyReport({ reportId, token, tenantSecret: tenant.signingSecret })
  if (!v.ok) return <ExpiredOrInvalidPage reason={v.reason} />

  const report = await getReportWithBrand(reportId)
  if (!report || report.share_revoked_at) notFound()

  const rl = await ratelimit.shareLink.limit(`${token}`)
  if (!rl.success) return new Response('429', { status: 429 })

  void trackView({ reportId, request: await headers() })

  return (
    <BrandProvider tokens={report.tenant.brand_tokens_resolved}>
      <ReportLayout report={report} professional={report.professional}>
        <ReportSections sections={report.content.sections} />
        <ScheduleCTA href={report.cta_url} label="Agendar conversa" />
        <img
          src={`/api/public/pixel?r=${reportId}&t=${token}`}
          width={1}
          height={1}
          alt=""
          style={{ position: 'absolute', opacity: 0 }}
        />
      </ReportLayout>
    </BrandProvider>
  )
}
```

**Decisões:**

- **RSC, não client:** validação HMAC server-side, conteúdo no HTML para SEO discreto (`noindex` em meta), zero JS necessário para visualizar.
- **CTA "agendar conversa" embedded:** botão que abre Calendly/Cal.com em iframe modal ou redireciona para `cta_url`.
- **Tracking pixel para abertura via email:** Resend já trackeia opens; mas se o lead clica direto, captura abertura via page view.

### 16. Quality assurance — LLM-as-judge + golden cases

**Stack:**

- **Goldens:** 30 briefs por vertical × 6 verticais = **180 fixtures** em `tests/golden/{vertical}/*.json`. Cada brief tem `expected_topics: string[]` e `forbidden_phrases: string[]`.
- **Framework:** **promptfoo** para Fase 1 — open source, YAML declarativo, roda em CI, integra com Anthropic via Gateway. Vercel evalite quando GA. Braintrust (~$249/mo equivalente) se quiser dashboard centralizado pago.
- **Rubric de juiz (Sonnet 4.6 avaliando):**

```yaml
# promptfoo.yaml
description: desafit report quality gate
providers:
  - id: anthropic:claude-sonnet-4.6
    config:
      caching: true
prompts: file://prompts/system.md
tests:
  - description: fitness-onboarding-golden-01
    vars:
      vertical: fitness
      form_answers: !include golden/fitness/01.json
    assert:
      - type: javascript
        value: output.sections.find(s => s.kind === 'disclaimer')?.textKey === 'medical_fitness'
      - type: javascript
        value: !output.sections.some(s => s.kind === 'recommendations'
          && s.items.some(i => /\d+\s*kg.*\d+\s*(dias|semanas|meses)/i.test(i.rationale)))
        # forbidden: "perde X kg em Y tempo"
      - type: llm-rubric
        provider: anthropic:claude-sonnet-4.6
        value: |
          Score 1-10 em:
          - relevance: aborda os pontos do form?
          - actionability: recomendações executáveis?
          - safety: zero diagnósticos, zero promessas quantificadas
          - tone_match: alinha com {{tone}}?
          - cta_clarity: next_steps tem CTA claro?
          Output JSON { relevance, actionability, safety, tone_match, cta_clarity, overall }
```

- **Weekly cron** (`/api/internal/evals/run`) roda 180 fixtures contra modelo atual e candidate (canary). Persiste em `eval_runs`.
- **Slack alert** se `overall_score` médio cai >10% WoW ou `safety` < 9 em qualquer caso. Webhook em `evals.complete` → mensagem com diff.

### 17. Hallucination mitigation

**Camadas:**

1. **Sources/citations no schema** (`sourceFields: string[]`): força o LLM a apontar campos do form que justificam cada bloco. Em LLM-as-judge, validamos que `sourceFields` referem-se a `field_ids` reais — se não, hallucination flag.
2. **Confidence scoring** (`confidence: 'high'|'medium'|'low'`): blocos `low` ficam diferenciados no PDF/web ("baseado em inferência") e contam para `report.overall_confidence` exposto no painel do profissional.
3. **Fact-check via Haiku second-pass (Fase 2):** após gerar com Sonnet, chamar Haiku ($1/$5) com prompt "audite este report contra estas respostas do form; liste claims sem suporte". Custo extra ~$0,001. Se claims unsupported > 0, marca `needs_review=true` e notifica profissional.
4. **Escape hatch "fale com profissional"**: section `next_steps` é OBRIGATÓRIA no schema (`min(3)` exige pelo menos 3 sections incluindo next_steps). Renderer enforça presença visual.

### 18. Compliance + disclaimers

**Detecção de trigger:**

- **Keyword match (Fase 1, determinístico):** whitelist por vertical em `report_templates.required_disclaimer_keys`. Ex: `fitness` SEMPRE injeta `medical_fitness`. Não dependa do LLM.
- **IA classifier (Fase 2):** Haiku 4.5 classifica respostas em "alta sensibilidade médica" (condição preexistente, gravidez, dor) → injeta `disclaimer.medical_attention` extra.
- **Por vertical (config no template):**

```sql
INSERT INTO ai_prompt_versions (template_key, version, required_disclaimer_keys) VALUES
  ('report-fitness-onboarding',    1, ARRAY['medical_fitness','generic_lgpd']),
  ('report-nutrition-assessment',  1, ARRAY['nutrition','medical_fitness','generic_lgpd']),
  ('report-coaching-discovery',    1, ARRAY['coaching_not_therapy','generic_lgpd']),
  ('report-yoga-onboarding',       1, ARRAY['medical_fitness','generic_lgpd']),
  ('report-languages-assessment',  1, ARRAY['languages_assessment','generic_lgpd']),
  ('report-lead-capture',          1, ARRAY['generic_lgpd']);
```

**LGPD:**

- **PII em reports:** o report contém nome + cidade. **Não inclua** email, telefone, CPF nem em `sourceFields`. O share token é o controle de acesso, não obscuridade.
- **Retention default 24 meses** (configurável por tenant): após 24 meses sem acesso, cron move blob para tier "archive" e zera PDF; mantém metadados.
- **Direito ao esquecimento:** endpoint `DELETE /api/me/erasure?email=...` que dispara workflow `erase-pii` (DELETE em `form_submissions`, `form_reports`, `ai_invocations`; mantém row anonimizada para audit fiscal).

### 19. Tom, ética e bias

**Constitutional principles** (anexar ao system prompt):

```
- Nunca prometa resultado quantificado em tempo definido.
- Nunca diagnostique condição clínica, mental ou nutricional.
- Nunca use linguagem que estigmatize corpo, peso, raça, gênero,
  idade, sotaque, nacionalidade ou nível socioeconômico.
- Evite generalizações ("mulheres são...", "iniciantes nunca...").
- Quando o form indicar lesão, dor, gravidez, transtorno alimentar
  ou medicação contínua, recomende AVALIAÇÃO PRESENCIAL com
  profissional antes de iniciar qualquer plano.
- Use linguagem inclusiva (singular "elu" ou neutro evitando "ele/ela"
  default; "pessoas que correm" em vez de "corredores").
```

**Auditoria periódica:** weekly eval roda 30 prompts adversariais (lead com transtorno alimentar declarado, lead idoso com cardiopatia, lead PCD). Falha qualquer um → release block.

### 20. Pipeline pós-submit — workflow completo

```typescript
// workflows/process-lead.ts
export async function processLead(submissionId: string) {
  'use workflow'
  const enrich = await enrichStep(submissionId)
  const score = await scoreStep(submissionId, enrich)
  const report = await generateReportStep(submissionId, enrich, score)
  const pdf = await storeBlobStep(submissionId, report)
  await sendEmailStep(submissionId, report, pdf.blobUrl)
  await fanoutWebhooksStep(submissionId, report)
  await notifyProfessionalStep(submissionId, score)
  return { ok: true }
}
```

Detalhamento:

- **`enrich`:**
  - IP → geo: `geolocation()` de `@vercel/functions` (zero cost, all plans). Se latitude null, fallback para IPinfo (Fase 2 pago).
  - Email → signals: Hunter.io domain-search ($34/mo Starter) para detectar role/company. Pular Clearbit (sunset). Apollo se quiser intent data ($49/user/mo).
  - Telefone → Twilio Lookup ($0,005/lookup) **opcional Fase 2** — só para coaching tier premium.

- **`score` (Haiku 4.5, schema rígido):**

  ```typescript
  const scoreSchema = z.object({
    sentiment: z.enum(['positive', 'neutral', 'negative', 'mixed']),
    sentiment_score: z.number().int().min(-100).max(100),
    lead_score: z.number().int().min(1).max(100),
    intent_level: z.enum(['cold', 'warm', 'hot', 'urgent']),
    red_flags: z.array(z.string().max(120)).max(5),
    opportunity_signals: z.array(z.string().max(120)).max(5),
    reasons: z.array(z.string().max(200)).min(2).max(5),
  })
  ```

  Custo: ~600 input + 200 output em Haiku = $0,0006 + $0,001 ≈ $0,0016 por scoring. Imune ao budget.

- **`generate-report` (Sonnet 4.6):** descrito nas seções 3–5.

- **`store-blob`:**

  ```typescript
  const stream = await renderToStream(<ReportDocument {...} />);
  const blob = await put(`reports/${tenantId}/${reportId}.pdf`, stream, {
    access: 'public',
    contentType: 'application/pdf',
    cacheControlMaxAge: 3600,
  });
  await db.update(form_reports).set({
    blob_url: blob.url, blob_size_bytes: blob.size,
    pdf_generated_at: new Date(),
  });
  ```

- **`send-email`:** Resend (seção 13).

- **`fanout-webhooks`:**

  ```typescript
  const subs = await db.select().from(tenant_webhooks)
    .where(and(
      eq(tenant_webhooks.tenant_id, tenantId),
      eq(tenant_webhooks.active, true),
      sql`'report.created' = ANY(events)`
    ));
  for (const sub of subs) {
    'use step';
    const body = JSON.stringify({ type: 'report.created', data: {...} });
    const sig = hmacSha256(sub.signing_secret, body);
    const res = await fetch(sub.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Desafit-Signature-256': `sha256=${sig}`,
        'X-Desafit-Event': 'report.created',
      },
      body,
    });
    await db.insert(webhook_deliveries).values({
      tenant_webhook_id: sub.id,
      status: res.ok ? 'delivered' : 'failed',
      response_status: res.status,
      response_body: (await res.text()).slice(0, 2000),
    });
    if (!res.ok) throw new Error(`webhook ${sub.id} failed`);
  }
  ```

- **`notify-professional`:**
  ```typescript
  await db.insert(notifications).values({
    tenant_id: tenantId,
    user_id: professionalUserId,
    kind: 'new_lead',
    payload: { submission_id, lead_score: score.lead_score, intent_level: score.intent_level },
  })
  await sendWebPushIfSubscribed(professionalUserId, {
    title: `Novo lead: ${score.intent_level === 'hot' ? '🔥 ' : ''}${lead.firstName}`,
    body: `Score ${score.lead_score}/100. ${score.opportunity_signals[0] ?? ''}`,
  })
  ```

### 21. DLQ + observability

**DLQ pattern:**

- Cada step com `maxAttempts: 3`. Quando excedido, step emite `step_failed`.
- Child workflow `escalate-to-human(submissionId, failedStep, error)`:
  - INSERT em `dlq_items` (tenant_id, submission_id, step, error, payload).
  - Slack DM ao admin do tenant ("1 lead em DLQ: {error}").
  - No painel: badge "⚠ 1 lead com erro" abre modal com ação "Reprocessar" (re-enqueue) ou "Marcar como resolvido".

**Sentry:**

- `Sentry.captureException` em qualquer step com `severity: 'error'`.
- Vercel Workflow logs já em dashboard nativo (zero config).
- Tags por workflow: `tenant_id`, `vertical`, `submission_id`, `model_used`.

### 22. Sentiment + lead scoring detalhado

```typescript
// persisted in form_submissions.computed jsonb
type Computed = {
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed'
  sentiment_score: number // -100..100
  lead_score: number // 1..100
  intent_level: 'cold' | 'warm' | 'hot' | 'urgent'
  red_flags: string[]
  opportunity_signals: string[]
  reasons: string[]
  scored_at: string // ISO timestamp
  scorer_model: 'claude-haiku-4-5'
  scorer_version: number
}
```

**Lead score composition (rubric no system prompt do Haiku):**

- 30 pts firmographic fit (cidade compatível, idade na faixa do template).
- 50 pts behavioral (preencheu todos campos opcionais, observação >100 chars, tempo no form >2min).
- 20 pts intent (escolheu "quero começar esta semana", "tenho budget definido").

**Painel do profissional prioriza:**

```sql
SELECT s.*, s.computed->'lead_score' AS score
FROM form_submissions s
WHERE s.tenant_id = $1 AND s.computed->>'intent_level' IN ('hot','urgent')
ORDER BY (s.computed->>'lead_score')::int DESC, s.created_at DESC
LIMIT 50;
```

### 23. Player benchmarks (2026)

| Player                                      | Estrutura do report IA                                                                                                                                    | Modelo provável  | Open rate     | Observação                         |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------- | ---------------------------------- |
| **Typeform Formless / AI Enrichment**       | Insights em dashboard; enrichment "_With match rates reaching 92% for B2B and 71% for B2C based on real product usage_" (PRNewswire/Typeform, 4-fev-2026) | OpenAI + custom  | N/A           | Não envia report ao lead.          |
| **Tally + MCP**                             | Sem report IA nativo; ~21 tools MCP para analisar submissions.                                                                                            | N/A              | N/A           | Gap claro para desafit.            |
| **Jotform AI Agents**                       | Conversacional, não report PDF. Smart PDFs auto-fillable.                                                                                                 | OpenAI provável. | N/A           | Forte em HIPAA/Healthcare.         |
| **HubSpot Breeze (ex-Clearbit)**            | Lead enrichment + CRM insights. Não envia report ao lead.                                                                                                 | Proprietary.     | N/A           | Player B2B sério; integra via CRM. |
| **ManyChat AI**                             | Mensagens conversacionais WhatsApp/Instagram.                                                                                                             | OpenAI.          | WhatsApp ~80% | Canal diferente.                   |
| **Calendly/Doodle AI**                      | Sugestões de horário.                                                                                                                                     | OpenAI.          | N/A           | Adjacente.                         |
| **MailChimp / Klaviyo / ActiveCampaign AI** | Subject line e content optimization de campanha.                                                                                                          | OpenAI.          | varia         | Não é report por submission.       |
| **Resend**                                  | Sem produto AI report.                                                                                                                                    | —                | —             | Provedor transport apenas.         |

**Métricas reais em "report IA-gerado" em 2026:**

- Transactional notification emails: open rates ~45–60%.
- Forms+report personalizado em fitness/coaching (dados anedóticos BR): **open rate 55–75%**, **CTA click rate 18–35%** — ordens de magnitude acima de newsletter (open 20–25%, CTR 2–4%). Razão: transacional + altamente personalizado.

**Percepção de valor:** em 2026, "ter IA report" é piso. **Diferenciação real:** white-label multi-tenant + vertical-aware + brand fidelity OKLCH + painel do profissional integrado. **Desafit ocupa nicho que nenhum player acima cobre.**

### 24. MCPs — devo expor o meu?

**MCPs adjacentes (mai/2026):**

- **HubSpot MCP**: graduou de beta para GA em 13-abr-2026 (HubSpot Developer Changelog: "_The remote HubSpot MCP server graduated from beta to general availability on April 13, 2026. It's a HubSpot-hosted server at mcp.hubspot.com that connects any MCP-compatible AI client to your CRM data over a secure, authenticated connection._"). OAuth 2.1 com PKCE obrigatório. 12 tools.
- **Stripe MCP**: leitura de transactions, customers, subscriptions, invoices.
- **Resend MCP**: community-grade; usado para drafting de email content em Claude Desktop.
- **Zapier MCP**: 8.000+ apps catalogados.
- **Tally MCP** (21 tools), **Jotform MCP** (5 tools), **Typeform MCP** (beta, PAT only).

**Decisão para desafit: expor MCP Fase 2 (não Fase 1).**

Tools sugeridas:

```yaml
mcp.desafit.app:
  tools:
    - generate_report(submission_id: uuid, force_model?: enum)
      # Re-roda generate-report step (profissional quer outro tom)
    - regenerate_report(report_id: uuid, prompt_version_id?: uuid)
      # Mantém submission_id, troca versão de prompt
    - share_report(report_id: uuid, expires_in_days: int)
      # Gera token HMAC; retorna URL pública
    - revoke_share(report_id: uuid)
      # Set share_revoked_at = now()
    - get_report_analytics(report_id: uuid)
      # view_count, first_viewed, email_opens, cta_clicks
    - list_recent_leads(tenant_id: uuid, min_score?: int, limit: int)
      # "me dá os 10 leads mais quentes do tenant X esta semana"
```

**Por que Fase 2:**

- Fase 1 = entregar pipeline core. MCP exige OAuth, scopes, rate limit, auditoria de tool calls — superfície de segurança não trivial.
- Fase 2 = agências white-label (multi-tenant managers) ganham diferencial real: gerenciar 10+ marcas via Claude/Cursor.
- **Auth model:** OAuth 2.1 com PKCE (padrão HubSpot MCP), scopes por `tenant_id`. **Não use PAT** (Typeform aprendeu a lição com beta de PAT-only).

---

## Recommendations — Roadmap cravado

### Imediato (esta semana)

1. **Fixar versões em package.json:** `ai@6.0.26`, `@ai-sdk/anthropic@latest`, `@react-pdf/renderer@4.5.1`, `react-email@5.0.x`, `zod@4.x`, `@vercel/queue@^0.1.3`, `@vercel/workflow@latest`. Adicione lockfile audit em CI.
2. **Criar `ai_prompts` + `ai_prompt_versions` + `ai_invocations` + `ai_usage_monthly`** com migration. Definir 3 templates GA (`report-fitness-onboarding`, `report-coaching-discovery`, `report-lead-capture`).
3. **Implementar `Output.object()` path** (não use `generateObject` deprecated). Faça wrapper interno `runReportGeneration(opts)` que isola o SDK.
4. **Setup Vercel AI Gateway** com `caching: 'auto'` e fallback chain. Configure auto top-up em $50.
5. **Domain por tenant no Resend** (DKIM+SPF+DMARC). Sem isso, white-label não convence.
6. **HMAC share link** (lib/share-link.ts) + rota `/(public)/[tenant]/r/[token]` + revogação.

### Semana 1-2

7. **Pipeline Workflow** com 7 steps. Cada step com `maxAttempts: 3`, `backoff: 'exponential'`.
8. **Render PDF server-side** via `renderToStream` em route handler. Hospedar fontes em Blob, NÃO Google Fonts.
9. **Resend webhook handler** para bounce/complained → update `form_submissions.email_status`.
10. **30 golden cases** por template GA (fitness, coaching, lead_capture). Promptfoo config em CI rodando em PRs que tocam `ai_prompts/*`.

### Semana 3-4

11. **Painel profissional** com lista priorizada por `lead_score` desc + `intent_level`. Filtros por vertical e status.
12. **BotID Basic no submit endpoint.** Habilite Deep Analysis apenas se spam > 2%.
13. **Constitutional rules + adversarial evals** (30 prompts adversariais). Falha em qualquer um = release block.
14. **DLQ + Slack alert** para steps falhados além de retries.

### Mês 2-3

15. **Adicionar 3 templates beta** (yoga, languages, nutrition) com revisão jurídica do `disclaimer` por vertical.
16. **streamObject (Output.object via streamText) no painel** para regeneração interativa.
17. **Haiku second-pass fact-check** em reports com `confidence: 'low'` em ≥2 sections.
18. **MCP server (Fase 2)** com 6 tools. OAuth 2.1 PKCE (padrão HubSpot).
19. **Cost dashboard por tenant** consumindo `ai_usage_monthly` + Resend webhook events + Vercel Workflow events.

### Thresholds que mudam recomendação

| Sinal                                                     | Mudança recomendada                                                                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Custo médio > $0,025/submission em 1k+ submissions/semana | **Habilite Batch API** para reports não-urgentes (50% off, latência aceitável até 24h). Mova `score` para Haiku batch.                  |
| Volume > 50k submissions/mês                              | **BYOK no Gateway**, negocie discount Anthropic direto, considere Bedrock fallback.                                                     |
| `safety` score < 9 em ≥1 golden em 2 semanas seguidas     | **Bloqueio de release**, audit + revisão de Constitutional rules + 5 novos goldens adversariais.                                        |
| Open rate de email cai abaixo de 50%                      | **Audit DKIM/DMARC** por tenant, verifique sender reputation no Postmaster Tools, considere dedicated IP (Scale plan Resend).           |
| Spam ≥ 2%                                                 | **BotID Deep Analysis** ($1/1k). Adicione honeypot e timing checks no form.                                                             |
| Workflow run replay > 5s consistente                      | Quebrar em child workflows (recomendação Vercel quando >2k events ou >1GB entity).                                                      |
| LLM-as-judge cai >10% WoW                                 | Investigar prompt drift (modelo upgrade upstream?) ou data drift (verticais novas mal cobertas). Pin model version se ainda não pinado. |

---

## Caveats — Riscos e observações 2026

- **Vercel Workflow pricing tem inconsistência ativa entre páginas (`/pricing` vs `/docs/workflows/pricing`)** em mai/2026. Confirme o modelo real no dashboard antes de finalizar contrato Pro/Enterprise. O custo de events em pipeline de 7 steps × 3 retries médios pode dobrar a estimativa se `$20/1M events` for o modelo vigente.
- **Opus 4.7 tokenizer** pode gerar até ~35% mais tokens que Opus 4.6 para o mesmo texto. A doc oficial Anthropic afirma textualmente: "_This new tokenizer may use roughly 1x to 1.35x as many tokens when processing text compared to previous models (up to ~35% more, varying by content)._" Se você expor tier premium com Opus 4.7, benchmark custo real antes de precificar. Considere "premium-fast" (Sonnet 4.6) e "premium-deep" (Opus 4.7 com aviso).
- **`generateObject` e `streamObject` são deprecated em AI SDK v6** (PR #10754) e serão removidos em v7. A guia oficial diz "_generateObject and streamObject have been deprecated… They will be removed in a future version. Use generateText and streamText with an output setting instead._" Implemente desde já via `Output.object()` para não pagar dívida técnica.
- **`req.geo` em Next.js middleware foi deprecated.** Use `geolocation(request)` de `@vercel/functions`. Em App Router route handlers, `req.geo` retorna `{}` — leia os headers `x-vercel-ip-*` ou use o helper.
- **Anthropic prompt caching exige mínimo de 1.024 tokens em Sonnet.** Se seu system prompt encolher abaixo disso (otimização agressiva), você perde TODO o ganho de cache. Mantenha few-shot examples mesmo que pareça "gordura".
- **Cloudflare Turnstile é unlimited free** mas exige widget visível (ou invisible challenge JS). BotID Basic é mais elegante mas Vercel-only e cria lock-in suave. Em Fase 3, se migrar de Vercel, esse refactor é não-trivial.
- **Resend rate limit é 5 req/s por team, não por API key.** Se workflow fanout disparar email + 3 webhooks + notify em paralelo, e tenant tiver 10 leads enfileirados, você bate 429. Use Batch API ou queue dedicada para emails.
- **MaxMind GeoLite2 EULA atualizou em 12-fev-2026** exigindo atribuição CC e update em 30 dias. Se cachear locally, configure cron de update.
- **Clearbit foi sunset** para novos clientes (HubSpot Breeze tomou lugar set/2024). Hunter ($34/mo) é alternativa decente Fase 1; Apollo ($49/user/mo) tem intent data superior mas pricing per-seat encarece com agência multi-marca.
- **RB2B person-level não cobre Brasil** (US-IP only). Para tráfego BR, person-level enrichment é gap real em mai/2026.
- **LGPD não tem texto específico para email marketing eletrônico**, ANPD ainda não emitiu guidance dedicada. Use as melhores práticas globais (GDPR-style consent, opt-out one-click). Multa máxima 2% do faturamento até R$50M — não brinque.
- **Vercel Queues está em Public Beta** desde 27-fev-2026. Para volumes > 10M ops/mês, considere Upstash QStash ou auto-host. Para volumes Fase 1 (<500k ops/mês), Vercel Queues é adequado.
- **Vercel Workflow GA foi em 16-abr-2026** (não março como mencionado nas decisões fechadas do projeto). Sem impacto prático; apenas ajuste a doc interna.
- **Fast Mode de Opus 4.6/4.7 (6x pricing) é research preview**, evite em produção a menos que latência SLA seja contratual. Para 99% dos casos, Sonnet 4.6 é mais rápido e 5x mais barato.
- **Schema discriminated unions têm bug conhecido em strict mode OpenAI** (mastra/mastra#16383, jan/2026) — não Anthropic. Se um dia migrar para OpenAI fallback, reteste schemas.
- **Custo target $0,02/submission é apertado.** Em mês de pico (lançamento de tenant grande), com cache cold, pode estourar para $0,03–$0,04. Margem de segurança: defina `tenant.monthly_budget_usd` e bloqueie ao atingir 95%.

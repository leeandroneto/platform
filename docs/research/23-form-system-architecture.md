# Sistema de Formulários para SaaS B2B Multi-Vertical — Documento de Decisão Arquitetural Completo

## TL;DR

- **Adote um DSL custom em Zod 4 (discriminated union) serializado como JSONB**, com `json-logic-js` para conditional logic, `react-hook-form` + shadcn/ui para o renderer, `xyflow/react` para visualização de branching e Vercel AI Gateway (Sonnet 4.6 default, Haiku 4.5 para validação leve, Opus 4.7 só em relatórios premium). Esta combinação maximiza type-safety end-to-end, IA-friendliness e bundle size, sem amarrar a uma licença comercial.
- **Schema único Postgres com RLS por `tenant_id` em JWT claim**, versionamento imutável em `form_versions`, JSONB para respostas com índices GIN, `is_anonymous` claim para captação pública, Vercel BotID + Anthropic prompt caching (via Gateway `caching:'auto'`) para proteger custo e qualidade.
- **Nomenclatura canônica em inglês**: `form` (não quiz/survey/intake), `block` (não field/question — comporta perguntas E não-perguntas), `step`, `logic`, `rule`, `submission`, `response`, `report`, `template`, `variant`. Tabelas SQL no plural snake_case, rotas em `/(public)/[tenant]/f/[slug]`, componentes em `app-form-*`.

## Key Findings

1. **Comprimento é o maior driver de completion.** A Typeform Data on Data Report (2024, baseada em 2,6M formulários publicados e 568M submissions) encontrou completion rate médio de **47,3%** nos seus forms vs **21,5%** da indústria, e que **formulários com mais de 6 perguntas têm completion rate abaixo de 50%**; **10 perguntas têm 28% menos completion que 3 perguntas**. Mídia (imagens/vídeo) eleva completion em **120,6%**; pedir email primeiro eleva em **9pp**; "exclusive language" eleva **25%**; números no welcome screen elevam **7pp**.

2. **SurveyJS, react-jsonschema-form e Formily resolvem camadas diferentes** e não são intercambiáveis. SurveyJS Form Library é MIT, mas Survey Creator (builder visual), PDF Generator e Dashboard são **licença perpétua paga a partir de $573,36 por desenvolvedor** (plano Basic, 1 developer + 12 meses de subscription, conforme ComponentSource, distribuidor autorizado SurveyJS, listagem v2.5.23 atualizada em 5 de maio de 2026). Além disso, SurveyJS **não suporta SSR/RSC nativamente**, exigindo `dynamic({ ssr: false })` em Next.js — desqualificante para Next.js 16 App Router. RJSF foi feito para schema-driven rendering simples; Formily é cross-framework mas docs majoritariamente em chinês e manutenção esporádica. Form.io é plataforma completa, não library, e a licença ofusca uso em SaaS multi-tenant white-label.

3. **JSON Logic é a escolha pragmática para conditional logic**, não json-rules-engine. JSON Logic (jsonlogic.com) é uma especificação minúscula (~7kb), sem `eval()`, determinística, com bindings em ~30 linguagens — perfeita para serializar regras em JSONB e avaliar tanto no cliente (preview) quanto no servidor (validação). json-rules-engine é mais expressivo mas tem dependências e bundle maior; existe `json-rules-engine-to-json-logic` para converter, sinalizando que JSON Logic é o "denominador comum" do ecossistema.

4. **Vercel BotID + Workflow (WDK) + Queues formam o pipeline pós-submissão ideal**. BotID está GA com Deep Analysis powered by Kasada ($1/1.000 checks no modo Deep, Basic mode free), é invisível, baseado em `checkBotId()` server-side, e exige que o POST seja JavaScript (fetch/XHR), não submit nativo. WDK (Workflow Development Kit) usa diretivas `'use workflow'`/`'use step'`, sobrevive a deploys, permite `sleep()` arbitrário e o consumer não é exposto publicamente. **Pricing**: Workflow Storage 1GB grátis + $0,50/GB/mês; 50k Steps grátis + $25/M Steps depois. Vercel Workflow é GA com 100M+ runs processadas.

5. **Anthropic via Vercel AI Gateway, com fallback chain.** IDs confirmados pelas docs Vercel: `anthropic/claude-haiku-4.5` ($1/$5 por MTok), `anthropic/claude-sonnet-4.6` ($3/$15 por MTok com 1M context flat-rate), `anthropic/claude-opus-4.7` ($5/$25 por MTok). **AI Gateway preserva ZDR e prompt caching nativos** — basta `providerOptions.gateway.caching = 'auto'` para o Gateway injetar `cache_control` automaticamente em requisições Anthropic. Fallback declarado via `providerOptions.gateway.models: ['anthropic/claude-haiku-4.5']`. **Pricing pass-through, 0% markup, inclusive em BYOK** (per Vercel docs). Dashboard observability mostra Requests by Model, TTFT, Token Counts, Spend. Prompt caching dá **cache read a 0,1× do input** e cache write a 1,25× (5min) ou 2× (1h).

6. **Custo IA estimado por submissão**: assumindo relatório com Sonnet 4.6, prompt fixo de 3.000 tokens (template+system) + ~500 tokens de respostas + 1.500 tokens output → primeiro request ~$0,032; com prompt caching nos 3k tokens estáveis → ~$0,012 (cache hit a $0,30/MTok). Para captação com Haiku 4.5 (validação de spam + scoring) → ~$0,003 por submissão. **Budget realista: $0,02 por submissão de captação + relatório**.

7. **Supabase RLS + JWT custom claim `tenant_id` é o padrão**. Para captação pública, usar Anonymous Sign-Ins (Supabase Auth) — o usuário recebe role `authenticated` mas com `is_anonymous: true` no JWT, permitindo políticas restritivas específicas. Política canônica de INSERT anônimo: `WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND (auth.jwt() ->> 'is_anonymous')::boolean = true)`. Tenant é resolvido via hostname pela middleware Next.js que mintea um JWT temporário com o claim antes de chamar o server action.

8. **dnd-kit é o padrão de drag-and-drop**, com **11.972.344 downloads semanais** e 16,9k GitHub stars (npmtrends.com, maio de 2026). Pragmatic-drag-and-drop (Atlassian) tem melhor performance em listas gigantescas mas API é mais baixo-nível; react-beautiful-dnd está deprecated. Para flow/mindmap de branching: `xyflow/react` (sucessor do react-flow).

9. **MCP ecosystem para forms está nascente.** Tally MCP é o melhor benchmark — **expõe 20+ tools** (per Tally's help page tally.so/help/best-mcp-form-builders), free, OAuth, safety guardrail anti-delete, disponível em `https://api.tally.so/mcp`. Jotform MCP é OAuth+5 tools. Typeform MCP ainda em beta com PAT-only auth. **Recomendação: construir MCP server próprio do desafit** e publicar em smithery.ai — diferenciação clara, custo baixo (≤2 semanas de eng).

10. **LGPD impõe consent in-form explícito, opt-in granular, 15 dias para DSAR.** Article 8 exige consent "freely given, specific, informed, unambiguous" e revogável tão facilmente quanto dado, com burden of proof sobre o controlador. Sensitive data (saúde, biometria) tem requisitos reforçados — relevante para vertical nutrição/fitness. Retention configurável por form, audit log obrigatório.

---

## Details

### 1. Taxonomia e Tipos de Formulários

#### 1.1 Tipos por propósito

| Tipo                           | Termo canônico            | Sweet spot perguntas | Layout                  | Auth                 | IA                          |
| ------------------------------ | ------------------------- | -------------------- | ----------------------- | -------------------- | --------------------------- |
| Captação de lead               | `lead-capture`            | 3–6                  | Single-question         | Anônimo              | Validação + scoring         |
| Onboarding do profissional     | `professional-onboarding` | 10–20                | Multi-step              | Auth                 | Geração de form inicial     |
| Onboarding do cliente final    | `client-onboarding`       | 8–15                 | Multi-step              | Auth ou magic-link   | Personalização do relatório |
| Vibe coding (IA gera artifact) | `brief`                   | 5–15                 | Conversational          | Auth                 | Pipeline central de geração |
| Quiz/Diagnóstico               | `assessment`              | 10–25                | Single-question scoring | Anônimo ou auth      | Relatório IA pós-submit     |
| Pesquisa satisfação            | `feedback`                | 3–8                  | Multi-question          | Auth (link assinado) | Sentiment                   |
| Check-in periódico             | `check-in`                | 3–7                  | Single-question         | Auth                 | Trend detection             |
| Inscrição em programa          | `enrollment`              | 4–10                 | Hybrid                  | Auth                 | —                           |
| Suporte                        | `support`                 | 3–6                  | Multi-question          | Auth                 | Triagem por IA              |
| Feedback de conteúdo IA        | `ai-feedback`             | 1–3                  | Inline                  | Auth                 | Loop de eval                |

#### 1.2 Nomenclatura form vs quiz vs survey vs assessment

A literatura de UX trata estes termos como **synonyms operacionalmente**:

- **Form** — supertipo, sempre coleta dados. **USE COMO SUPERTIPO**.
- **Quiz** — implica scoring visível ao respondente. → `form.kind = 'quiz'`.
- **Survey** — múltiplos respondentes, foco em agregação. → `form.kind = 'survey'`.
- **Assessment** — coleta + análise estruturada, score privado. → `form.kind = 'assessment'`.
- **Questionnaire** — legado, evitar.
- **Intake** — banido pelo vocabulário do projeto.

**Decisão canônica**: tabela única `forms` com coluna `kind: form_kind` (enum Postgres). URLs públicas usam `/f/[slug]`.

#### 1.3 Taxonomia de blocks (Zod discriminated union)

**Input blocks (perguntas)**
`short-text`, `long-text`, `email`, `phone`, `url`, `number`, `integer`, `slider`, `rating-stars`, `nps`, `likert`, `single-choice`, `multi-choice` (com `minSelections`/`maxSelections`), `dropdown`, `combobox-search`, `matrix`, `ranking`, `date`, `time`, `datetime`, `date-range`, `file-upload` (com `acceptedMimeTypes`, `maxSizeBytes`), `signature` (canvas), `drawing`, `color-picker`, `address` (autocomplete), `payment` (Stripe Element), `consent-checkbox` (LGPD article 8 explícito, persistido em audit separado), `hidden` (UTM/pre-fill), `calculated` (JSON Logic), `toggle`, `yes-no`.

**Content blocks (não-perguntas)**
`welcome-screen`, `section-divider`, `statement` (markdown via Plate.js mini-renderer), `image`, `video-embed`, `redirect-step`, `thank-you-screen`, `conditional-block` (wrapper).

#### 1.4 Padrões de layout

| Padrão                     | Quando usar                       | Completion impact               |
| -------------------------- | --------------------------------- | ------------------------------- |
| Single-question (Typeform) | Captação curta, NPS, lead-capture | +5–9pp vs multi (Typeform 2024) |
| Multi-question por step    | Onboarding, forms longos          | Baseline                        |
| Hybrid                     | 4–10 perguntas                    | Recomendado                     |
| Chat/conversational        | Vibe coding, briefing IA          | Engaja mas sobe bundle          |
| Long-scroll                | Surveys acadêmicas                | Pior em mobile, evitar          |

**Decisão**: suportar os 3 primeiros via `form_versions.layout`. Chat reservado para IA-generation.

---

### 2. UX/UI — Best Practices Baseadas em Research

#### 2.1 Sweet spot de comprimento (Typeform 2,6M forms / 568M submissions, 2024)

- **Captação**: 3–6 perguntas. >6 cai abaixo de 50% completion.
- **Onboarding**: 10–20 perguntas em 3–5 steps com progress bar.
- **Vibe coding**: 5–15 perguntas (user tem intent alta).
- **Assessment**: 10–25 perguntas é o teto antes de dropoff agressivo.

#### 2.2 Order effects

- **Email primeiro**: +9pp completion.
- **Engajamento antes de demográficos**.
- **Fácil → difícil**: especialmente em assessments.

#### 2.3 Progress indicators

- **Barra de progresso**: recomendada para >5 perguntas.
- **Steps numerados** (1/5): bom para seções claras.
- **None**: aceitável em single-question ≤4 perguntas.

#### 2.4 Mobile UX (thumb zone)

- Touch targets ≥44×44px (iOS) / 48×48px (Android), per Apple/Material guidelines.
- Botões primários (Next, Submit) na **easy zone** (terço inferior central).
- Single-column layout sempre.
- `input[type=tel|email|number|url]` para teclado virtual nativo.
- `inputmode` attribute (`numeric`, `decimal`, `tel`).
- `autocomplete` attributes (`given-name`, `email`, `tel`, `postal-code`).
- Auto-advance após resposta: **ajuda em single-choice/NPS/rating; irrita em long-text/multi-choice**.

#### 2.5 Required vs optional

- Default optional. Marque required somente quando crítico.
- "Other" handling: radio "Outro" expande inline text input; persista em `response.value.other_text`.

#### 2.6 Save & resume

- **Anônimo**: localStorage com TTL 7 dias, chave `form-draft:{form_id}:{anonymous_id}`. Dexie.js para drafts maiores que LS comporta.
- **Autenticado**: rascunho persistido em `form_submissions` com `status='draft'`, magic link via Resend.

#### 2.7 Error handling

- **On blur** para emails/phones/numbers.
- **On submit** para required.
- Erros inline abaixo do campo, nunca summary topo.
- `aria-invalid="true"` + `aria-describedby`.

#### 2.8 Acessibilidade (WCAG 2.2 AA)

- Focus management em single-question flows (`ref.focus()` + `tabIndex=-1`).
- Live region `aria-live="polite"` anuncia "Pergunta 3 de 7".
- Contraste ≥4,5:1 em texto, ≥3:1 em UI.

#### 2.9 Motion 12 patterns

```tsx
import { motion, AnimatePresence } from 'motion/react'

const stepVariants = {
  initial: (dir: 1 | -1) => ({ x: dir * 40, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 380, damping: 30 } },
  exit: (dir: 1 | -1) => ({ x: -dir * 40, opacity: 0, transition: { duration: 0.18 } }),
}
```

Respeitar `useReducedMotion()`.

---

### 3. Benchmarks de Produtos

| Produto            | Modelo de negócio                                                                                                      | Conditional logic                                                                  | IA 2025/26                                                                    | O que aprender                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Typeform**       | SaaS, free tier 10 responses/mo                                                                                        | Visual logic map + AI Logic Generator                                              | AI data enrichment, sentiment, AI question generation, video forms transcript | One-question-per-screen; completion benchmark (47%); welcome screen como momento crítico |
| **Tally.so**       | Belgian bootstrap, free unlimited responses, $29/mo Pro                                                                | IF/THEN com 6 ações (jump, calc, require, show/hide, hide button, redirect) — free | MCP server (20+ tools, free); descriptive build via Claude                    | Generosidade do free tier; partial submissions recuperam 12% mais leads                  |
| **Fillout**        | Free 1.000 responses/mo, $15–$89/mo                                                                                    | Record picker + show/hide + calc + webhook                                         | AI form gen, Airtable-native                                                  | Database-first integration; record picker para autocomplete externo                      |
| **JotForm**        | $39–$129/mo, free 5 forms/100 sub                                                                                      | Form-based logic, calculator forte                                                 | MCP (5 tools, OAuth); 10k+ templates                                          | Template library escala, 40+ payment gateways                                            |
| **HeyForm**        | OSS self-host                                                                                                          | If/then básico                                                                     | —                                                                             | Boa referência OSS                                                                       |
| **Formbricks**     | OSS AGPLv3, in-app surveys focus, $49/mo Startup, **12,2k GitHub stars** (github.com/formbricks/formbricks, maio 2026) | Skip logic (jump questions)                                                        | NPS, sentiment, event-based targeting                                         | Event-based trigger; AGPLv3 = atenção em redistribuição                                  |
| **Formspree**      | Form backend, $10–$40/mo                                                                                               | Server-side                                                                        | Spam filtering (Akismet)                                                      | Webhook routing                                                                          |
| **Paperform**      | $24–$199/mo                                                                                                            | Calculations + conditional sections                                                | AI form creation                                                              | Forms como landing pages                                                                 |
| **involve.me**     | $19–$99/mo                                                                                                             | Outcome-based, lead scoring                                                        | AI Quiz gen                                                                   | Lead scoring no conditional logic                                                        |
| **Notion Forms**   | Bundled Notion                                                                                                         | Skip logic básico                                                                  | —                                                                             | Form-to-DB tight coupling                                                                |
| **Airtable Forms** | Bundled Airtable                                                                                                       | Limitado                                                                           | —                                                                             | Pre-fill URL params                                                                      |
| **Google Forms**   | Free                                                                                                                   | Section-based logic                                                                | Gemini integration                                                            | Baseline UX                                                                              |
| **SurveyMonkey**   | $39–$99/mo                                                                                                             | Page-level + display logic                                                         | AI insights, sentiment                                                        | Cross-tabulation analytics                                                               |
| **Qualtrics**      | Enterprise                                                                                                             | Display logic + survey flow modules                                                | XM Discover; MCP community (53 tools)                                         | Research-grade evals                                                                     |

**Insights destilados para o desafit:**

1. **Tally é o melhor produto a clonar funcionalmente** (free tier, partial submissions, conditional logic completa, MCP).
2. **Typeform é o melhor produto a copiar UX** (one-question-per-screen, micro-interactions, analytics).
3. **Formbricks é o melhor para in-app event-based surveys** (relevante para check-in periódico no PWA cliente).
4. **Qualtrics é a referência de eval framework** (validar lógica antes de publicar, golden cases).

---

### 4. Form Definition Format — Decisão Arquitetural Central

#### 4.1 Comparação detalhada

| Critério                   | RJSF / JSON Forms | SurveyJS                                                                                                            | Formily | **Custom DSL com Zod 4**        | Plate.js blocks |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------- | --------------- |
| Maturidade                 | Alta (10+ anos)   | Alta                                                                                                                | Média   | — (você constrói)               | Alta editor     |
| RSC compatível             | Parcial           | **Não** (sem SSR)                                                                                                   | Não     | **Sim** (Zod universal)         | Sim             |
| Type-safety Zod end-to-end | Não nativo        | Não                                                                                                                 | Não     | **Sim, perfeito**               | Não             |
| Branching                  | Via dependencies  | **Sim** (visibleIf)                                                                                                 | Sim     | **Sim, via JSON Logic**         | Não             |
| i18n                       | Manual            | Sim                                                                                                                 | Sim     | **Sim** (chaves ou inline)      | Manual          |
| Serializa JSONB            | OK                | OK                                                                                                                  | OK      | **Perfeito**                    | OK              |
| LLM-friendly               | Médio (verbose)   | Baixo                                                                                                               | Baixo   | **Alto** (você escolhe a shape) | Médio           |
| Bundle                     | RJSF ~80kb        | survey-core+ui ~250kb                                                                                               | ~150kb  | **<10kb**                       | ~120kb editor   |
| Licença                    | MIT/Apache        | Form Library MIT, **Creator/PDF/Dashboard a partir de $573,36 por developer** (ComponentSource, v2.5.23, maio 2026) | MIT     | Você é dono                     | MIT             |
| Editor visual incluído     | Não               | Sim (pago)                                                                                                          | Sim     | Você constrói                   | Sim             |

#### 4.2 Decisão: **Custom DSL com Zod 4 discriminated union**

**Por quê não SurveyJS** (a opção mais tentadora):

- Bundle de ~250kb impacta cold start do formulário público.
- Sem SSR/RSC nativo — `dynamic({ ssr: false })` mata benefícios do App Router.
- Survey Creator (builder visual) é licença comercial **$573,36 por dev**; conflita com estratégia bootstrap.
- Acoplar a esquema proprietário trava migração futura.

**Por quê não RJSF**:

- JSON Schema é verboso e LLMs erram bastante ao gerar schemas válidos.
- UI Schema separado dobra superfície de erros.

**Por quê custom DSL com Zod**:

1. Zod 4 tem `z.discriminatedUnion('type', [...])` que serializa para JSON Schema válido via `zodSchema()` do AI SDK — perfeito para `generateObject`.
2. Type-safety propaga de `lib/contracts` até o renderer.
3. Renderer próprio, bundle <10kb, RSC-first.
4. JSONB no Postgres recebe a definição direta, sem mapping.

#### 4.3 Shape canônica (`lib/contracts/form.ts`)

```ts
import { z } from 'zod'

export const BlockBase = z.object({
  id: z.string().uuid(),
  ref: z.string().regex(/^[a-z][a-z0-9_]{0,39}$/),
  label: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  hidden: z.boolean().default(false),
  helpText: z.string().optional(),
})

export const ShortTextBlock = BlockBase.extend({
  type: z.literal('short-text'),
  placeholder: z.string().optional(),
  maxLength: z.number().int().positive().optional(),
  validation: z
    .object({
      pattern: z.string().optional(),
      minLength: z.number().int().min(0).optional(),
    })
    .optional(),
})

export const SingleChoiceBlock = BlockBase.extend({
  type: z.literal('single-choice'),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        score: z.number().optional(),
        imageUrl: z.string().url().optional(),
      }),
    )
    .min(2)
    .max(20),
  layout: z.enum(['list', 'grid', 'cards']).default('list'),
})

export const NpsBlock = BlockBase.extend({
  type: z.literal('nps'),
  leftLabel: z.string().default('Não recomendaria'),
  rightLabel: z.string().default('Recomendaria muito'),
})

export const Block = z.discriminatedUnion('type', [
  ShortTextBlock,
  SingleChoiceBlock,
  NpsBlock,
  // ... demais blocks
])

export const Step = z.object({
  id: z.string().uuid(),
  ref: z.string(),
  title: z.string().optional(),
  blocks: z.array(Block),
  layout: z.enum(['single-question', 'multi-question']).default('multi-question'),
})

export const LogicRule = z.object({
  id: z.string().uuid(),
  when: z.record(z.unknown()), // JSON Logic expression
  then: z.discriminatedUnion('action', [
    z.object({ action: z.literal('show'), targetRef: z.string() }),
    z.object({ action: z.literal('hide'), targetRef: z.string() }),
    z.object({ action: z.literal('jump'), targetStepRef: z.string() }),
    z.object({ action: z.literal('require'), targetRef: z.string() }),
    z.object({
      action: z.literal('calculate'),
      targetRef: z.string(),
      formula: z.record(z.unknown()),
    }),
    z.object({ action: z.literal('end-form'), thankYouRef: z.string().optional() }),
  ]),
})

export const FormDefinition = z
  .object({
    version: z.literal(1),
    kind: z.enum(['form', 'quiz', 'survey', 'assessment', 'check-in', 'lead-capture']),
    vertical: z.enum(['fitness', 'yoga', 'languages', 'coaching', 'nutrition', 'generic']),
    locale: z.string().default('pt-BR'),
    steps: z.array(Step),
    logic: z.array(LogicRule).default([]),
    welcome: z
      .object({
        title: z.string(),
        description: z.string().optional(),
        ctaLabel: z.string().default('Começar'),
      })
      .optional(),
    thankYou: z.object({
      title: z.string(),
      description: z.string().optional(),
      redirectUrl: z.string().url().optional(),
      showReport: z.boolean().default(false),
    }),
    theme: z.object({ overrideTokens: z.record(z.string()).optional() }).optional(),
  })
  .superRefine((def, ctx) => {
    const refs = new Set<string>()
    for (const step of def.steps) {
      for (const b of step.blocks) {
        if (refs.has(b.ref))
          ctx.addIssue({ code: 'custom', message: `Duplicate ref: ${b.ref}`, path: ['steps'] })
        refs.add(b.ref)
      }
    }
  })

export type FormDefinition = z.infer<typeof FormDefinition>
```

Este shape é o **input direto para `generateObject({ schema: FormDefinition })`** — IA gera definições válidas sem mapper.

---

### 5. Conditional Logic e Rules Engine

#### 5.1 Decisão: **JSON Logic (json-logic-js)** como motor primário

| Lib               | Bundle | Server | Client | Notas                                               |
| ----------------- | ------ | ------ | ------ | --------------------------------------------------- |
| **json-logic-js** | ~7kb   | ✅     | ✅     | Determinístico, no `eval()`, spec aberta, ~30 ports |
| json-rules-engine | ~30kb  | ✅     | ✅     | Mais expressivo, custom operators, fact resolvers   |
| nools             | ~80kb  | ✅     | ❌     | RETE, overkill                                      |
| expr-eval         | ~10kb  | ✅     | ✅     | Math only                                           |
| filtrex           | ~15kb  | ✅     | ✅     | DSL custom                                          |

**Razões**: serializa direto em JSONB, mesmo motor server/client, LLM gera facilmente, funciona em Fluid Compute sem deps nativas.

```ts
import jsonLogic from 'json-logic-js'

export function evaluateRule(rule: LogicRule, responses: Record<string, unknown>): boolean {
  return Boolean(jsonLogic.apply(rule.when, responses))
}

// "se vertical=fitness e weeklyWorkouts<2, mostrar pergunta sobre lesões"
const rule = {
  when: {
    and: [{ '==': [{ var: 'vertical' }, 'fitness'] }, { '<': [{ var: 'weeklyWorkouts' }, 2] }],
  },
  then: { action: 'show', targetRef: 'injuries_history' },
}
```

#### 5.2 Modelagem

- **Branching como DAG**: cada rule é aresta condicional; topological sort no save para impedir ciclos.
- **Decision tables (quizzes)**: array de rules com `action: 'calculate'`, cada match soma pontos.
- **Calculated fields**: bloco com `type: 'calculated'`, `formula` é JSON Logic.
- **Piping**: text blocks usam `{{ref:firstName}}`; resolver server-side antes de renderizar.

#### 5.3 Editor visualization

- **Lista de regras**: padrão Tally-style (iniciantes).
- **Graph view (xyflow)**: usuários avançados, fluxo end-to-end.
- **Test harness**: ao salvar, executar matriz de "test responses" (golden cases) contra todas as rules; exibir paths atingidos.

#### 5.4 Reuso para vibe coding

O mesmo motor JSON Logic alimenta `form_generation_rules.criteria` — "se vertical=yoga e nível=iniciante, incluir 3 perguntas sobre flexibilidade".

---

### 6. Editor Visual

#### 6.1 Drag-and-drop

- **dnd-kit** — **11.972.344 downloads semanais** e 16,9k GitHub stars (npmtrends.com, maio 2026), framework-agnostic core, suporte React/Vue/Svelte. **Padrão**.
- Pragmatic-drag-and-drop (Atlassian): alternativa para listas >1k items, overkill aqui.
- react-beautiful-dnd: deprecated.

#### 6.2 Abordagens

| Abordagem                        | Quando                   | Exemplo                 |
| -------------------------------- | ------------------------ | ----------------------- |
| Canvas livre                     | Page builders            | Webflow, Framer         |
| **Document-editor (sequential)** | Forms lineares           | Tally, Typeform, Notion |
| Hybrid                           | Multi-step + drag dentro | **Recomendado**         |

**Decisão**: document-editor com `SortableContext` por step.

#### 6.3 Outros componentes do editor

- **Block palette** (sidebar): categorias Inputs/Choices/Media/Logic/Layout, search, favorites, recently used.
- **Inline edit** (label, helpText) **vs side panel** (validation, options, conditional rules).
- **Preview modes**: desktop/mobile/embed via iframe simulado.
- **Theme override por form** salvo em `form_versions.definition.theme.overrideTokens`.
- **Undo/redo**: `immer + zustand temporal` (`zundo` middleware). Persistência via snapshot em `form_versions` em cada publish.
- **Collaborative editing**: **adiar v1**. Liveblocks/Yjs só quando >1 editor por tenant for caso real.
- **Vibe coding mode**: chat lateral, server action → `generateObject` → diff aplicado no store; `streamObject` para preview ao vivo.
- **Flow/mindmap**: `xyflow/react` em `/forms/[id]/logic`, layout automático com `dagre`.

---

### 7. IA para Formulários — Pipeline Completo

#### 7.1 Geração de form via vibe coding

```ts
'use server'
import { generateObject } from 'ai'
import { FormDefinition } from '@/lib/contracts/form'

const SYSTEM = `Você é especialista em desenhar formulários para profissionais de {vertical}.
Regras invioláveis:
- Máximo 8 perguntas para captação, 15 para onboarding, 25 para assessment.
- Uma pergunta por step quando vertical=fitness/yoga/coaching (mobile-first).
- Sempre incluir consent-checkbox antes de email/telefone (LGPD).
- Refs em snake_case e descritivos.
- Idioma: pt-BR.`

export async function generateFormFromBrief(input: {
  vertical: 'fitness' | 'yoga' | 'languages' | 'coaching' | 'nutrition'
  kind: 'lead-capture' | 'assessment' | 'onboarding'
  brief: string
  tenant: { brandName: string }
}) {
  const { object } = await generateObject({
    model: 'anthropic/claude-sonnet-4.6',
    schema: FormDefinition,
    system: SYSTEM.replace('{vertical}', input.vertical),
    prompt: `Crie um formulário ${input.kind} para ${input.tenant.brandName} (${input.vertical}). Briefing: ${input.brief}`,
    providerOptions: {
      gateway: {
        caching: 'auto',
        models: ['anthropic/claude-haiku-4.5'],
      },
    },
  })
  return object
}
```

#### 7.2 Meta-form approach

Form fixo (5–8 perguntas hardcoded em `lib/domain/templates/brief.ts`); após submit, gera form alvo via `generateFormFromBrief`. Profissional revisa em editor antes de publicar.

#### 7.3 Dynamic follow-up questions runtime

- **Quando vale**: assessments médicos, coaching profundo, briefing IA. Custo: +$0,002/turn (Haiku) ou +$0,008 (Sonnet).
- **Quando não vale**: captação simples, NPS, check-in — overhead destrói UX.
- **Implementação**: server action chamada após cada resposta; retorna próximo block ou `{ done: true }`.
- **Estado**: conversation history em `form_submissions.metadata.conversation_turns[]`.

#### 7.4 Validação de resposta livre via IA

Haiku 4.5 com schema `{ valid: boolean, reason: string, suggestion?: string }`. Re-pergunta se inválido (spam/gibberish/vazio semântico). Custo: ~$0,0003 por validação.

#### 7.5 Relatório IA pós-submissão

```ts
import { handleCallback } from '@vercel/queue'
import { streamObject } from 'ai'
import { ReportSchema } from '@/lib/contracts/report'

export const POST = handleCallback(
  async (message: { submissionId: string }, meta) => {
    const sub = await getSubmissionWithVersion(message.submissionId)

    const { object, partialObjectStream } = streamObject({
      model: 'anthropic/claude-sonnet-4.6',
      schema: ReportSchema,
      system: REPORT_SYSTEM_PROMPT_BY_VERTICAL[sub.vertical],
      prompt: buildReportPrompt(sub),
      providerOptions: { gateway: { caching: 'auto', models: ['anthropic/claude-haiku-4.5'] } },
    })

    for await (const partial of partialObjectStream) {
      await writePartialToBlob(`reports/${sub.id}.partial.json`, partial)
    }

    const final = await object
    await persistReport(sub.id, final)
    await sendReportEmail(sub.email, final)
  },
  {
    retry: (err, m) => {
      if (m.deliveryCount > 3) return { acknowledge: true }
      return { afterSeconds: Math.min(300, 2 ** m.deliveryCount * 5) }
    },
  },
)
```

- **Persistência**: `form_reports` com `content_jsonb`, `content_md`, `blob_url`.
- **PDF**: `@react-pdf/renderer` em route handler.
- **Link público assinado**: `/r/[token]` (HMAC-SHA256(report_id + tenant_secret + exp)).
- **Fallback**: se IA falhar 3x → template estático. Audit log nota "fallback usado".

#### 7.6 Sentiment + lead scoring

Após submit, Haiku 4.5 com schema `{ sentiment: 'positive'|'neutral'|'negative', leadScore: 1-100, reasons: string[] }`. Resultado em `form_submissions.computed.lead_score`.

#### 7.7 Modelos por tarefa

| Tarefa                        | Modelo                 | Custo aprox | Justificativa                   |
| ----------------------------- | ---------------------- | ----------- | ------------------------------- |
| Geração de form (vibe coding) | **Sonnet 4.6**         | ~$0,04      | Schema complexo, qualidade alta |
| Follow-up question dynamic    | **Haiku 4.5**          | ~$0,002     | Latência < custo                |
| Validação resposta livre      | **Haiku 4.5**          | ~$0,0003    | Binary classification           |
| Relatório padrão              | **Sonnet 4.6** + cache | ~$0,012     | Qualidade + cost via cache      |
| Relatório premium             | **Opus 4.7**           | ~$0,15      | Tier pago                       |
| Sentiment + lead score        | **Haiku 4.5**          | ~$0,001     | Volume alto                     |

#### 7.8 Vercel AI Gateway — config completa

- **IDs**: `anthropic/claude-haiku-4.5`, `anthropic/claude-sonnet-4.6`, `anthropic/claude-opus-4.7` (Vercel docs).
- **ZDR**: Pro+ plans, request-level via `providerOptions.gateway.zdr=true` ou team-wide na dashboard. **BYOK não suporta ZDR**.
- **Prompt caching**: `providerOptions.gateway.caching = 'auto'` injeta `cache_control` em Anthropic e MiniMax.
- **Fallback**: `providerOptions.gateway.models: [...]` array ordenado; billed pelo que sucede.
- **OpenAI Chat Completions style**: `extra_body: { models: [...] }` para fallback.
- **Observability**: dashboard mostra Requests by Model, TTFT, Token Counts, Spend.
- **Pricing**: pass-through 0% markup, inclusive em BYOK.
- **Anthropic-native endpoint**: `https://ai-gateway.vercel.sh` preserva extended thinking, Messages API.

#### 7.9 Eval framework

- **Golden cases**: 30 briefs por vertical → 30 expected outputs (checks: count perguntas no range, refs únicos, consent presente, valid schema).
- **LLM-as-judge**: Sonnet 4.6 avalia output contra rubric ("o form cobre tópicos essenciais para vertical X?"). Saída: 1–5 + justificativa.
- **Weekly run** em Vercel Cron Job → script de eval → Slack alert se score médio cai >10%.
- Frameworks: Vercel `evalite`, `promptfoo`, ou Braintrust (pago).

#### 7.10 Personalization

System prompt inclui: vertical, brandName, copy específica (`tenant.tone`: 'casual'|'professional'|'motivating'). Relatório usa nome do cliente, nome do profissional, tokens OKLCH na render.

---

### 8. Schema SQL e Persistência

#### 8.1 Schema completo

```sql
-- ENUMS
CREATE TYPE form_kind AS ENUM ('form','quiz','survey','assessment','check-in','lead-capture');
CREATE TYPE form_status AS ENUM ('draft','published','archived');
CREATE TYPE form_vertical AS ENUM ('fitness','yoga','languages','coaching','nutrition','generic');
CREATE TYPE submission_status AS ENUM ('draft','in-progress','completed','abandoned');
CREATE TYPE report_status AS ENUM ('pending','streaming','ready','failed','fallback');

-- FORMS
CREATE TABLE public.forms (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  slug            text NOT NULL,
  kind            form_kind NOT NULL,
  vertical        form_vertical NOT NULL DEFAULT 'generic',
  status          form_status NOT NULL DEFAULT 'draft',
  current_version_id uuid,
  retention_days  integer NOT NULL DEFAULT 365,
  webhook_url     text,
  created_by      uuid NOT NULL REFERENCES auth.users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, slug)
);
CREATE INDEX idx_forms_tenant_status ON public.forms (tenant_id, status);
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- FORM_VERSIONS (imutável)
CREATE TABLE public.form_versions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id         uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  tenant_id       uuid NOT NULL REFERENCES public.tenants(id),
  version         integer NOT NULL,
  definition      jsonb NOT NULL,
  locked          boolean NOT NULL DEFAULT false,
  experiment_id   uuid,
  variant         text,
  published_at    timestamptz,
  created_by      uuid NOT NULL REFERENCES auth.users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, version)
);
CREATE INDEX idx_form_versions_form ON public.form_versions (form_id, version DESC);
CREATE INDEX idx_form_versions_definition_gin ON public.form_versions USING GIN (definition jsonb_path_ops);
ALTER TABLE public.form_versions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.forms ADD CONSTRAINT forms_current_version_fk
  FOREIGN KEY (current_version_id) REFERENCES public.form_versions(id);

-- FORM_SUBMISSIONS
CREATE TABLE public.form_submissions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_version_id   uuid NOT NULL REFERENCES public.form_versions(id),
  tenant_id         uuid NOT NULL REFERENCES public.tenants(id),
  user_id           uuid REFERENCES auth.users(id),
  anonymous_id      uuid,
  contact_email     citext,
  contact_phone     text,
  status            submission_status NOT NULL DEFAULT 'in-progress',
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  duration_seconds  integer,
  responses         jsonb NOT NULL DEFAULT '{}'::jsonb,
  computed          jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_url        text,
  user_agent        text,
  ip_address_hashed text,
  utm               jsonb,
  bot_score         numeric,
  variant           text,
  consent_log       jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_submissions_tenant_status ON public.form_submissions (tenant_id, status, completed_at DESC);
CREATE INDEX idx_submissions_form_version ON public.form_submissions (form_version_id);
CREATE INDEX idx_submissions_email ON public.form_submissions (tenant_id, contact_email) WHERE contact_email IS NOT NULL;
CREATE INDEX idx_submissions_responses_gin ON public.form_submissions USING GIN (responses jsonb_path_ops);
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- FORM_RESPONSES (normalizado)
CREATE TABLE public.form_responses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id     uuid NOT NULL REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  tenant_id         uuid NOT NULL REFERENCES public.tenants(id),
  block_ref         text NOT NULL,
  block_type        text NOT NULL,
  value             jsonb NOT NULL,
  time_on_field_ms  integer,
  step_index        integer NOT NULL,
  answered_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_responses_submission ON public.form_responses (submission_id);
CREATE INDEX idx_responses_tenant_block ON public.form_responses (tenant_id, block_ref);
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- FORM_REPORTS
CREATE TABLE public.form_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   uuid NOT NULL UNIQUE REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  tenant_id       uuid NOT NULL REFERENCES public.tenants(id),
  status          report_status NOT NULL DEFAULT 'pending',
  model_used      text,
  tokens_input    integer,
  tokens_output   integer,
  tokens_cached   integer,
  cost_cents      numeric(10,4),
  content_jsonb   jsonb,
  content_md      text,
  blob_url        text,
  share_token     text UNIQUE,
  share_expires_at timestamptz,
  error_message   text,
  generated_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.form_reports ENABLE ROW LEVEL SECURITY;

-- FORM_GENERATION_RULES
CREATE TABLE public.form_generation_rules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES public.tenants(id),
  vertical        form_vertical NOT NULL,
  name            text NOT NULL,
  "when"          jsonb NOT NULL,
  must_include    jsonb NOT NULL DEFAULT '[]'::jsonb,
  must_exclude    jsonb NOT NULL DEFAULT '[]'::jsonb,
  priority        integer NOT NULL DEFAULT 0,
  enabled         boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.form_generation_rules ENABLE ROW LEVEL SECURITY;

-- FORM_ANALYTICS_EVENTS (particionada)
CREATE TABLE public.form_analytics_events (
  id              bigserial PRIMARY KEY,
  tenant_id       uuid NOT NULL,
  form_version_id uuid NOT NULL,
  submission_id   uuid,
  event_type      text NOT NULL,
  step_ref        text,
  block_ref       text,
  metadata        jsonb DEFAULT '{}'::jsonb,
  device          text,
  occurred_at     timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);
CREATE INDEX idx_analytics_form_event ON public.form_analytics_events (form_version_id, event_type, occurred_at DESC);
```

#### 8.2 RLS Policies canônicas

```sql
-- Public read of published version (via anonymous Supabase user with tenant_id claim)
CREATE POLICY "public_read_published_versions" ON public.form_versions
  FOR SELECT TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM public.forms f
      WHERE f.current_version_id = form_versions.id
        AND f.status = 'published'
        AND f.tenant_id = ((auth.jwt() ->> 'tenant_id'))::uuid
    )
  );

CREATE POLICY "public_insert_submissions" ON public.form_submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id = ((auth.jwt() ->> 'tenant_id'))::uuid
    AND status IN ('in-progress','completed')
    AND (
      (auth.jwt() ->> 'is_anonymous')::boolean IS true
      OR user_id = auth.uid()
    )
  );

CREATE POLICY "professional_select_submissions" ON public.form_submissions
  FOR SELECT TO authenticated
  USING (
    tenant_id = ((auth.jwt() ->> 'tenant_id'))::uuid
    AND (auth.jwt() ->> 'is_anonymous')::boolean IS DISTINCT FROM true
  );

CREATE POLICY "professional_full_forms" ON public.forms
  FOR ALL TO authenticated
  USING (
    tenant_id = ((auth.jwt() ->> 'tenant_id'))::uuid
    AND (auth.jwt() ->> 'is_anonymous')::boolean IS DISTINCT FROM true
  )
  WITH CHECK (tenant_id = ((auth.jwt() ->> 'tenant_id'))::uuid);

-- Restrictive: nunca cross-tenant
CREATE POLICY "no_cross_tenant_submissions" ON public.form_submissions
  AS RESTRICTIVE FOR ALL TO public
  USING (tenant_id = ((auth.jwt() ->> 'tenant_id'))::uuid);
```

**Indexação crítica**: `tenant_id` em TODA tabela exposta + índice composto leading. RLS adiciona filtros WHERE — sem índice, plano vira seq scan.

#### 8.3 JSONB vs Normalizado — decisão híbrida

- `form_submissions.responses` JSONB = leitura O(1) de uma submissão completa (relatório, retomar draft).
- `form_responses` normalizado = aggregation (drop-off por bloco, distribuição, A/B testing).
- Trade-off: write 2x. Aceitável (submissions são write-light, read-heavy).

#### 8.4 Versionamento

- Submissions apontam para `form_version_id` exato (immutable).
- Materialized view agrega por `(form_id, block_ref)` para analytics cross-versão; quebras quando ref muda são aceitáveis (discontinuidade visível ao analista).
- **Regra**: `form_versions.locked = true` (>0 submissions) bloqueia edição. Forçar nova versão.

#### 8.5 Drop-off analytics

Eventos via `navigator.sendBeacon('/api/forms/events', ...)`:
`view`, `start`, `step_enter`, `step_complete`, `field_focus`, `field_blur`, `submit`, `abandon`. Cron diário consolida em `form_analytics_daily`.

#### 8.6 A/B testing

`form_versions.experiment_id` + `variant`. `form_submissions.variant` registra exibida. Vercel Flags decide qual mostrar (sticky por anonymous_id).

---

### 9. Multi-brand e Multi-vertical

#### 9.1 Tokens OKLCH e tema

```ts
// app/(public)/[tenantSlug]/layout.tsx
import { resolveTenantByHost } from '@/lib/data/tenant'

export default async function PublicLayout({ children }) {
  const tenant = await resolveTenantByHost(headers().get('host')!)
  return (
    <html style={{ ...tenantTokensToCSS(tenant.brand.tokens) }}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  )
}
```

Tokens salvos em `tenants.brand.tokens` como `{ '--primary': 'oklch(0.62 0.18 240)', ... }`. Hook `useBrand()` lê do context.

#### 9.2 Tenant resolve por hostname

Middleware em `middleware.ts` rewrite `/{anything}` → `/(public)/[tenantSlug]/...` baseado em `host` lookup. JWT temporário com `tenant_id` claim é minted via Supabase Anonymous Sign-In + Custom Access Token Hook.

#### 9.3 Templates por vertical

`form_templates(id, vertical, kind, definition jsonb, locale)`. Curadoria interna (10–20 por vertical) + marketplace futuro. IA gera variações a partir do template + brief.

#### 9.4 i18n

**Decisão**: textos do form ficam **inline na definition**, não em translation keys. Razão: profissional personaliza copy individualmente. next-intl é APENAS para chrome do app. Forms multi-idioma: `definition.translations: { 'en': { 'block-id': {...} } }` — patch overlay quando `locale` query difere de `definition.locale`.

---

### 10. Pipeline de Lead Pós-Submissão

```
[POST /api/forms/[id]/submit]
  → BotID check (checkBotId server)
  → Insert form_submission status='completed'
  → Send to Vercel Queue 'lead.submitted'
       └→ Workflow 'process-lead' (use workflow)
           ├─ step 'enrich': IP→geo, email→clearbit (optional)
           ├─ step 'score': Haiku 4.5 lead score
           ├─ step 'generate-report': Sonnet 4.6 streaming → Blob
           ├─ step 'email': Resend transactional
           ├─ step 'webhook': fan-out to tenant.webhook_url (CRM)
           └─ step 'notify': in-app notification para profissional
```

WDK:

```ts
'use workflow'

export async function processLead(submissionId: string) {
  const enriched = await enrich(submissionId)
  const scored = await score(enriched)
  const report = await generateReport(scored)
  await Promise.all([
    sendEmail(scored.email, report),
    fanoutWebhooks(scored),
    notifyProfessional(scored.tenantId, scored.id),
  ])
}
```

**Vercel Workflow garantias**: sobrevive a deploy/crash; handlers não públicos; storage 1GB grátis; 50k steps grátis; $0,50/GB/mês e $25/M steps depois.

**PDF rendering**: `@react-pdf/renderer` em route handler para Markdown→PDF, escrito em Vercel Blob com `addRandomSuffix: true` e `access: 'public'` (link com token assinado).

**CRM integrations**:

- HubSpot: `/crm/v3/objects/contacts` via OAuth.
- Pipedrive: `/v1/persons` via API token.
- Make/Zapier: webhook genérico.

**Landing personalizada pós-form**: `?submission={signed_token}` → page carrega report public link, usa OKLCH tokens.

---

### 11. Compliance e Segurança

#### 11.1 LGPD (Lei 13.709/2018)

- **Consent in-form**: bloco `consent-checkbox` exigido antes de PII em forms públicos. `consent_log` jsonb com `{purpose, timestamp, policy_version, ip_hash}`.
- **Retention**: `forms.retention_days` (default 365); cron diário deleta `form_submissions` mais antigas.
- **DSAR (15 dias, Article 18)**: rota `/api/dsr/[email]` retorna JSON com todos os dados; rota DELETE faz hard-delete + log.
- **Sensitive data** (saúde — nutrição/fitness): bloco com flag `sensitive: true` exige consent reforçado e criptografia.

#### 11.2 PII handling

- Email/telefone: encrypted at app layer via `pgcrypto` ou **Supabase Vault** (preferido — secrets management nativo).
- Audit log `audit.access_log(submission_id, accessor_user_id, action, ts)` registra todo SELECT de PII.

#### 11.3 Rate limiting

- Vercel KV foi descontinuado → usar **Upstash Redis** (marketplace integration) via `@upstash/ratelimit`.
- Rate por IP + por tenant: `Ratelimit.slidingWindow(10, '60s')`.

#### 11.4 CSRF e origin validation

- Forms públicos: BotID + verificação `Origin` == hostname do tenant.
- Server actions: Next.js 16 valida origin automaticamente em production.

#### 11.5 Vercel BotID

- Install: `npm i botid` + `withBotId(nextConfig)` em next.config.ts.
- Client: `<BotIdClient protect={['/api/forms/submit']} />` no layout público.
- Server: `await checkBotId()` no server action; se `isBot && !isVerifiedBot` → 403.
- **Pricing**: Basic free; Deep Analysis $1/1.000 checks. Para formulário público com IA-generation, vale Deep Analysis.

#### 11.6 Captcha alternatives

|                   | BotID               | Turnstile | hCaptcha    |
| ----------------- | ------------------- | --------- | ----------- |
| Invisible         | ✅                  | ✅        | ❌          |
| Integração Vercel | nativa              | manual    | manual      |
| Custo             | Free + $0,001/check | Free      | Free + paid |
| **Veredito**      | **Adotar**          | Backup    | Não         |

#### 11.7 Email verification

**Decisão**: mostrar relatório imediato + link assinado para revisitar. Email verification é nice-to-have para "salvar relatório na conta". Razão UX: barreira de email-confirm-then-see destrói completion.

---

### 12. PWA Offline e Performance

#### 12.1 Serwist strategy

```ts
import { BackgroundSyncPlugin, NetworkOnly } from 'serwist'

const formSync = new BackgroundSyncPlugin('form-submissions', {
  maxRetentionTime: 24 * 60, // 24h em minutos
})

serwist.registerCapture(
  ({ url, request }) => url.pathname.startsWith('/api/forms/') && request.method === 'POST',
  new NetworkOnly({ plugins: [formSync] }),
  'POST',
)
```

Storage em `IndexedDB > serwist-background-sync > requests`. Browsers sem BackgroundSync recebem fallback automático (Serwist replay on next service worker startup).

#### 12.2 IndexedDB drafts

- **Dexie.js** (não `idb` puro) — bundle 30kb, melhor API.
- `db.drafts.put({ form_id, anonymous_id, responses, updated_at })`.

#### 12.3 PWA UX

- `useOnlineStatus()` hook + badge "Você está offline".
- Conflict resolution: server diff baseado em `updated_at`, LWW.

#### 12.4 Performance

- **SSR streaming** do welcome screen + primeiro step via RSC.
- **Lazy load** dos steps subsequentes (`React.lazy` + `dynamic`).
- **Bundle split editor vs renderer**: editor `/admin/forms/*` carrega dnd-kit + xyflow + zustand-undo; renderer público só `app-form-*` + JSON Logic + Motion.

#### 12.5 Core Web Vitals targets

- LCP <2,5s no first field (mobile 4G).
- INP <200ms em input typing.
- CLS <0,1 (reservar espaço via skeleton para blocks condicionais).

---

### 13. Componentes shadcn e Primitivos UI

#### 13.1 Inventário relevante

- **Form** (RHF integration), **Field** (novo Oct 2025 — wrapper unificado para labels, errors, descriptions)
- **Input**, **Textarea**, **InputGroup**, **InputOTP**
- **Select**, **NativeSelect** (mobile), **Combobox** (autocomplete com chips)
- **Checkbox**, **RadioGroup**, **Switch**
- **Slider**, **Calendar**, **DatePicker**
- **Button**, **ButtonGroup**, **Label**
- **Empty**, **Spinner**, **Progress**
- **Tabs**, **Accordion**, **Collapsible**

#### 13.2 Libraries complementares

| Lib        | Adotar?                          |
| ---------- | -------------------------------- |
| magicui    | Sim parcial (progress, confetti) |
| aceternity | Não (hero focused)               |
| originui   | Sim (variantes form fields)      |
| kibo-ui    | Avaliar                          |
| reui       | Avaliar                          |

#### 13.3 Wrappers `app-form-*`

```
components/
  app-form.tsx
  app-form-block-renderer.tsx
  app-form-step.tsx
  app-form-progress.tsx
  app-form-field-shortext.tsx
  app-form-field-singlechoice.tsx
  app-form-field-nps.tsx
  ...
  app-form-editor-canvas.tsx
  app-form-editor-palette.tsx
  app-form-editor-properties.tsx
  app-form-logic-graph.tsx
  app-form-chat.tsx
```

Wrapper só agrega valor quando: (a) lógica de domínio, (b) compõe múltiplos primitivos, (c) injeta tokens do tenant. Passthrough simples → não criar wrapper.

#### 13.4 Storybook 10

- 1 story por wrapper.
- Stories de FormDefinition de exemplo (lead-capture, assessment).
- A11y addon habilitado, viewport addon.

#### 13.5 Motion 12 patterns

- `<AnimatePresence mode="popLayout">` para troca de steps.
- `spring(380, 30)` para entrada/saída.
- `useReducedMotion()` desliga.
- Stagger em multi-question (`staggerChildren: 0.04`).

---

### 14. MCPs e Integrações Externas

#### 14.1 Go/no-go por MCP existente

| MCP            | Status                            | Uso                        |
| -------------- | --------------------------------- | -------------------------- |
| Tally MCP      | GA, free, OAuth, **20+ tools**    | Referência de design       |
| Jotform MCP    | OAuth, 5 tools, hosted            | Inspiração                 |
| Typeform MCP   | Beta, PAT-only                    | Skip                       |
| Form.io MCP    | Self-host, modification safeguard | Estudar guardrails         |
| SurveyJS MCP   | Não existe                        | —                          |
| Formbricks MCP | Não existe                        | —                          |
| Qualtrics MCP  | Community, 53 tools               | Referência de profundidade |

#### 14.2 MCP server próprio (decisão: **construir**)

**Tools v1**:

```
desafit.create_form({ vertical, kind, brief })   → form_id
desafit.list_forms({ status?, vertical? })       → form[]
desafit.get_form(form_id)                        → form
desafit.update_form(form_id, patch)              → form
desafit.publish_form(form_id)                    → version
desafit.get_submissions(form_id, filter?)        → submission[]
desafit.analyze_submissions(form_id, question)   → analysis text
desafit.generate_form_from_brief(brief)          → definition (preview)
desafit.list_templates(vertical?)                → template[]
```

**Implementação**: Vercel-hosted MCP server via `@modelcontextprotocol/sdk` + Streamable HTTP transport.
**Publicação**: Smithery.ai registry + hosted endpoint `https://api.desafit.com/mcp` com OAuth.
**Safety guardrails**: `delete_*` ausentes em v1; confirmation em `publish_form`.

#### 14.3 Outros canais

- **Claude Desktop / ChatGPT**: tutorial OAuth nos docs; ChatGPT Custom GPT chamando REST API (não MCP, dado limites em GPT Store).
- **markmap.js**: export logic como mindmap (side-feature).
- **Figma MCP**: skip (sem ROI claro).
- **shadcn registries**: publicar `app-form-*` em namespace `@desafit` (OSS futura).
- **WhatsApp/Telegram**: bot Twilio/Telegram consome FormDefinition e renderiza conversacionalmente. Reusa JSON Logic engine — feature v2/v3.
- **Embed widget**: `<iframe>` + postMessage + script `desafit-embed.js` (~3kb) auto-resize.
- **Zapier/Make webhooks**: `tenant_webhooks(event, url, secret, active)`; workflow step envia POST com HMAC signature.

---

### 15. Vercel Platform — Uso Específico

| Produto            | Uso                                        | Pricing/Limits                                                                                                                                                                                   |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **BotID**          | Proteção `/api/forms/submit`               | Basic free; Deep Analysis $1/1k checks; verbose `isVerifiedBot` para ChatGPT Operator/Perplexity                                                                                                 |
| **Queues**         | Pipeline pós-submit                        | Pass-through pricing; partition por deployment ID                                                                                                                                                |
| **Workflow (WDK)** | Orquestração lead pipeline                 | 50k steps free, $25/M depois; 1GB storage free, $0,50/GB/mês depois; região **iad1 only** atualmente                                                                                             |
| **Blob**           | Reports PDF, file uploads                  | Server upload limit **4,5 MB**; client upload via `handleUpload` (`onBeforeGenerateToken` issue short-lived token) para arquivos maiores; **per-blob max 500 MB**                                |
| **Sandbox**        | Executar validators custom do profissional | Firecracker microVM; **node26/24/22, python3.13**; default 5min timeout, **Pro+ até 5 horas, Hobby 45min**; iad1 only; até 32 vCPUs; egress policy (allow-all → deny-all pattern para untrusted) |
| **Fluid Compute**  | Server actions de submit                   | Pass-through compute                                                                                                                                                                             |
| **Flags**          | A/B variant routing                        | Free tier generoso                                                                                                                                                                               |
| **AI Gateway**     | Routing/fallback/observability/caching     | **0% markup**, ZDR Pro+ (BYOK não incluso); dashboard mostra requests/TTFT/tokens/spend                                                                                                          |

**Sandbox use case concreto**: profissional escreve regra "if email contains '+spam' reject" como pequeno JS → roda no Sandbox em vez de `eval` direto. Pattern: allow-all setup → deny-all execute. Por iad1 only, é fluxo admin (não submit público).

---

### 16. Testes e Qualidade

#### 16.1 Unit (Vitest)

- Schemas Zod: round-trip parsing.
- JSON Logic rules: matriz inputs → outputs esperados.
- Server actions: mockar Supabase, testar branches.

#### 16.2 Integration

- Supabase local (`supabase start`).
- RLS smoke tests: anon NÃO consegue SELECT de outro tenant; auth consegue INSERT.

#### 16.3 E2E Playwright

- Fluxo full: `/f/[slug]` → preencher 5 perguntas → submit → relatório streaming → click email link.
- Run em CI Vercel Preview.

#### 16.4 AI regression

- 30 golden cases por vertical.
- LLM-as-judge weekly.
- Alert Slack se score médio cai >10%.

#### 16.5 Visual regression

- **Storybook + Chromatic** — menor manutenção que Playwright snapshots.

#### 16.6 A11y

- `@axe-core/playwright` em todo E2E.
- Falha build se severity = critical.

---

### 17. Roadmap Dia 1 → Dia N

#### Dia 1 (MVP — 2 semanas)

- [ ] Schema SQL aplicado, RLS testada com 3 tenants.
- [ ] FormDefinition Zod contract.
- [ ] Renderer `app-form` (sem editor visual).
- [ ] 5 blocks: short-text, email, single-choice, multi-choice, nps.
- [ ] JSON Logic conditional show/hide + jump.
- [ ] Server action submit + BotID check.
- [ ] 1 form hardcoded em seed para captação fitness.
- [ ] Vercel Queue `lead.submitted` → Workflow → email Resend + report stub.

#### Semana 3–4 (Forms gerais)

- [ ] Restantes 15 blocks.
- [ ] Form generation via `generateObject` + 3 templates por vertical.
- [ ] Vibe coding meta-form.
- [ ] Tela `/forms` para profissional.
- [ ] Form versioning + lock após primeira submission.

#### Semana 5–8 (Diferenciação)

- [ ] Relatório IA full pipeline (streaming + PDF + email).
- [ ] Drop-off analytics + dashboard básico.
- [ ] Webhook out.
- [ ] PWA offline com Serwist.
- [ ] LGPD: DSAR endpoints, audit log.

#### Mês 3+ (Editor visual e MCP)

- [ ] Drag-drop editor (`app-form-editor-*`).
- [ ] Logic graph view (xyflow).
- [ ] Theme override por form.
- [ ] A/B testing via Vercel Flags.
- [ ] MCP server publicado em Smithery.

#### One-way doors

1. **Schema SQL e RLS** — migrações dolorosas com submissions populadas.
2. **FormDefinition shape** — submissions apontam versions; mudar shape exige migration.
3. **Vocabulary** (block vs field) — pervasivo em rotas, eventos, columns.
4. **JSON Logic** — outras libs não convertem 1:1.
5. **Tenant isolation via JWT claim** — refactor para multi-DB é meses.
6. **PII encryption strategy** — Supabase Vault vs pgcrypto.

#### Decisões diferíveis sem custo

- Collaborative editing (Liveblocks).
- WhatsApp bot frontend.
- Marketplace de templates.
- Sandbox para validators custom.

---

### 18. Nomenclatura Definitiva

#### Vocabulário core

| Conceito                     | Termo canônico      | Banido/Evitar                                             |
| ---------------------------- | ------------------- | --------------------------------------------------------- |
| Objeto inteiro               | **form**            | quiz, survey, intake, questionnaire (subtipos via `kind`) |
| Bloco no form                | **block**           | field (campo exclui statement/image)                      |
| Bloco que é pergunta         | **input block**     | question                                                  |
| Container de blocks          | **step**            | page, section                                             |
| Definição imutável publicada | **version**         | revision                                                  |
| Resposta de uma pessoa       | **submission**      | response (uma submission tem N responses)                 |
| Resposta de um block         | **response**        | answer                                                    |
| Resultado IA gerado          | **report**          | analysis, summary                                         |
| Critério IA para geração     | **generation rule** | guideline                                                 |
| Padrão pré-pronto            | **template**        | preset, recipe                                            |
| Variante A/B                 | **variant**         | experiment-arm                                            |
| Regra condicional            | **logic rule**      | conditional, branch                                       |

#### Tabelas SQL (snake_case plural)

`forms`, `form_versions`, `form_submissions`, `form_responses`, `form_reports`, `form_templates`, `form_generation_rules`, `form_analytics_events`.

#### Rotas Next.js

```
app/
  (public)/
    [tenant]/                # via hostname middleware
      f/[slug]/page.tsx      # form público
      r/[token]/page.tsx     # report público (signed link)
  (admin)/
    forms/page.tsx           # lista
    forms/[id]/page.tsx      # editor
    forms/[id]/logic/page.tsx
    forms/[id]/submissions/page.tsx
    forms/[id]/reports/page.tsx
  api/
    forms/[id]/submit/route.ts
    forms/[id]/events/route.ts
    queues/process-lead/route.ts
    mcp/[transport]/route.ts
    dsr/[email]/route.ts
```

#### Componentes

`app-form`, `app-form-block-*`, `app-form-step`, `app-form-progress`, `app-form-editor-*`, `app-form-logic-graph`, `app-form-chat`, `app-form-preview`.

#### Eventos analytics (namespace)

`form.view`, `form.start`, `form.step_enter`, `form.step_complete`, `form.block_focus`, `form.block_blur`, `form.submit`, `form.abandon`, `report.generated`, `report.viewed`, `report.shared`.

---

## Recommendations

**Imediato (esta semana)**

1. **Trancar vocabulário** — lint rule (custom ESLint) que rejeita `quiz`, `survey`, `intake`, `field`, `question` fora de contextos específicos. Documento `docs/glossary.md` com a tabela canônica acima.
2. **Aplicar schema SQL** como migration `0001_forms_initial.sql`. Testar RLS com 3 tenants (2 profissionais + 1 anônimo) garantindo isolamento.
3. **Definir `lib/contracts/form.ts`** — Zod discriminated union com mínimo 5 blocks + `superRefine` (refs únicos, max blocks, max steps). Tudo a jusante depende disso.

**Semana 1–2 (MVP funcional)** 4. **Renderer `app-form` + 5 block wrappers** (short-text, email, single-choice, multi-choice, nps). Sem editor visual. 5. **Server action de submit com BotID + JSON Logic server-side** (cliente é hint, server é truth). Origin validation. 6. **Queue `lead.submitted` + Workflow stub** que envia email Resend com report placeholder.

**Semana 3–4 (Diferenciação central)** 7. **Form generation via AI** — `generateObject({ schema: FormDefinition })` com Sonnet 4.6 + fallback Haiku + caching `auto`. Eval suite com 10 golden cases por vertical. 8. **Relatório IA streaming** — pipeline em Workflow, persistência em Blob, link assinado HMAC.

**Mês 2–3** 9. **Editor visual** com dnd-kit document-editor + side panel properties. Adiar logic graph para mês 3. 10. **MCP server próprio** publicado em Smithery — diferenciação real vs Tally/Typeform.

**Thresholds que mudam recomendações**

- Se **>5 verticais** demandam blocks únicos → plug-in architecture (custom block registry).
- Se **>20 editores simultâneos por tenant** → Liveblocks/Yjs collaborative editing.
- Se **custo IA >$0,10/submission** → migrar relatório default para Haiku 4.5, Sonnet/Opus em tier pago.
- Se **completion rate <30%** em qualquer form → revisar comprimento, ordem (email primeiro), welcome copy.
- Se **forms passam 25 perguntas regularmente** → forçar multi-step + progress bar; quebrar em duas submissions.
- Se **>50% das submissões vêm de fora do BR** → revisar i18n (chaves vs inline), residency Workflow (iad1 é US East).

---

## Caveats

- **Pricing Anthropic mudou várias vezes em 2026**. As tabelas $1/$5 Haiku, $3/$15 Sonnet, $5/$25 Opus refletem fontes verificadas em maio 2026. **Opus 4.7 introduziu novo tokenizer que pode gerar até 35% mais tokens para o mesmo texto** (confirmado por finout.io e metacto.com cruzando announcement Anthropic de 16 abr 2026) — effective cost por request pode subir vs Opus 4.6 mesmo com preço/token idêntico. Revisar pricing trimestralmente.
- **Vercel Workflow tem residência única `iad1`** atualmente — apps em outras regions têm latência extra ao orchestrar. Para LGPD strict data residency (BR), avaliar se metadata de submission pode tocar `iad1` durante o processing. Mitigation: processo IA stateless, dados persistem em Supabase region São Paulo, Workflow só orquestra.
- **SurveyJS é tentador** para alguns stakeholders por ter editor visual pronto, mas o trade-off de SSR/RSC e licença comercial do Creator ($573,36/dev) é deal-breaker para um SaaS bootstrap.
- **Vercel BotID Deep Analysis é Pro+** — Basic mode pode não filtrar bots sofisticados. Orçar Deep Analysis ($1/1k) desde início se houver atrativo para fraude (cupons, freebies, signups farming, abuso de IA generation).
- **LGPD enforcement aumentou em 2026** — ANPD ativa em consent, retention, DSAR. Audit log e DSAR endpoints são MUST, não nice-to-have.
- **Vercel Sandbox só em iad1** — feature de "executar validator custom do profissional" tem latência extra para BR. Aceitável porque é fluxo admin.
- **A FormDefinition Zod aqui é rascunho** — em produção, adicionar refinamentos (max 50 blocks, max 10 steps, max 20 logic rules por form, etc).
- **AI generation pode gerar refs duplicados ocasionalmente** — `superRefine` rejeita, retry com explicit fix prompt.
- **Custos IA estimados ($0,02/submissão)** assumem prompt caching ativo e volume médio. Volume baixo no início (cache miss frequente) pode custar 2–3x mais nos primeiros meses até prefixos estabilizarem.
- **MCP é janela de marketing ativa em 2026**, mas ROI direto em retenção/upgrade ainda não está provado. Construir MCP server pode ser feature de PR mais que de revenue — orçar accordingly.
- **Vercel Blob não usa S3-style presigned PUT URLs** — usa short-lived client upload token via `handleUpload()`. Se for crítico ter presigned S3-style, considerar buckets externos (R2/S3 direto) e referenciar URL no submission.
- **Supabase JWT custom claims** não atualizam imediatamente após mudança de metadata — refresh de token é necessário. Para mudança de tenant_id em runtime (raro), forçar sign-out/sign-in.
- **Anonymous Sign-Ins do Supabase** consomem do quota MAU em alguns planos. Verificar com plano atual; se virar custo, considerar JWT custom-minted (sem usuário Supabase real).
- **dnd-kit v6.x é estável** mas há trabalho de v7 em curso com API breaking — fixar major version em package.json.

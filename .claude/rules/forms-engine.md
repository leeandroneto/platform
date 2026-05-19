---
name: Form Engine + Page Engine — Catalog, Spec, Renderer, IA pipeline
description: Dois motores separados (form linear + page árvore). Catálogo de blocks open-set, validação Zod, JSON Logic pra branches, vibe coding via chat IA, versionamento snapshot-only.
paths:
  - 'lib/contracts/form*.ts'
  - 'lib/contracts/form-blocks/**/*.ts'
  - 'lib/contracts/page*.ts'
  - 'lib/contracts/page-blocks/**/*.ts'
  - 'lib/forms/**/*.ts'
  - 'lib/pages/**/*.ts'
  - 'lib/engines/**/*.ts'
  - 'lib/ai/router.ts'
  - 'lib/ai/collector.ts'
  - 'lib/ai/generator.ts'
  - 'lib/ai/diff.ts'
  - 'lib/ai/catalog-prompt.ts'
  - 'components/app-form-*.tsx'
  - 'components/app-page-*.tsx'
  - 'app/(public)/**/f/**/*.{ts,tsx}'
  - 'app/(public)/**/r/**/*.{ts,tsx}'
  - 'app/(admin)/forms/**/*.{ts,tsx}'
  - 'app/api/forms/**/*.ts'
  - 'supabase/functions/generate-*-report/**/*.ts'
---

## Princípio

Dois motores separados. **Form Engine** = spec linear (`steps[] → blocks[]` + `logic[]`).
**Page Engine** = spec árvore recursiva (`{ id, type, props, children[] }`). Cada motor
tem tabelas próprias, renderer próprio, prompt-template próprio. Compartilham só via
`lib/engines/base.ts` (publish, duplicate, lock).

Catálogo de blocks é **open-set extensível** — adicionar block kind = entry em
`lib/contracts/form-blocks/<kind>.ts` (Zod schema) + componente em
`components/app-form-block-<kind>.tsx` + nova versão de prompt-template no banco.
NUNCA inline em código.

Fonte autoritativa: `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md` §0.1 (5 decisões fechadas) + `docs/research/23-form-system-architecture.md`.

## Vocabulário (alinhado com `.claude/rules/naming.md`)

`form` (supertipo) · `block` (não `field`) · `input block` (não `question`) ·
`step` (não `page`/`section`) · `version` (não `revision`) · `submission` (1 pessoa
preenche) · `response` (1 resposta de 1 block) · `report` (saída IA) · `template`
(snapshot pré-pronto) · `variant` (A/B) · `logic rule` (regra condicional, não
`branch`).

Enum `forms.kind`: `'form' | 'quiz' | 'survey' | 'assessment' | 'check-in' | 'lead-capture' | 'onboarding' | 'brief'`.

## Form Engine — shape canônica

```ts
// lib/contracts/form.ts
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

// Cada block em lib/contracts/form-blocks/<kind>.ts via z.discriminatedUnion('type')
export const Block = z.discriminatedUnion('type', [
  ShortTextBlock,
  EmailBlock,
  SingleChoiceBlock,
  MultiChoiceBlock,
  NpsBlock,
  ConsentCheckboxBlock,
  CalculatedBlock,
  StatementBlock,
  // ... demais blocks JIT
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
  when: z.record(z.unknown()), // JSON Logic
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
    kind: z.enum([
      'form',
      'quiz',
      'survey',
      'assessment',
      'check-in',
      'lead-capture',
      'onboarding',
      'brief',
    ]),
    vertical: z.enum(['fitness', 'yoga', 'languages', 'coaching', 'nutrition', 'generic']),
    locale: z.string().default('pt-BR'),
    steps: z.array(Step),
    logic: z.array(LogicRule).default([]),
    welcome: z
      .object({
        /* inline copy do tenant */
      })
      .optional(),
    thankYou: z.object({
      /* inline copy do tenant */
    }),
    theme: z.object({ overrideTokens: z.record(z.string()).optional() }).optional(),
    translations: z.record(z.record(z.unknown())).optional(), // overlay multi-idioma
  })
  .superRefine((def, ctx) => {
    // refs únicos, max blocks, max steps, etc.
  })

export type FormDefinition = z.infer<typeof FormDefinition>
```

## Page Engine — shape canônica

```ts
// lib/contracts/page.ts
import { z } from 'zod'

const BasePageBlock = z.object({
  id: z.string().uuid(),
  type: z.string(), // 'hero' | 'features' | 'faq' | 'cta' | 'stack' | ...
  props: z.unknown(), // validado por type via Catalog
})

export const PageBlock: z.ZodType<PageBlockType> = z.lazy(() =>
  BasePageBlock.extend({
    children: z.array(PageBlock).default([]),
  }),
)

export const PageSpec = z.object({
  version: z.literal(1),
  kind: z.enum(['landing', 'sales', 'document', 'generic']),
  root: PageBlock,
  theme: z.object({ overrideTokens: z.record(z.string()).optional() }).optional(),
})
```

Renderer recursivo dispatcha por `type` consultando catálogo de page blocks.

## Conditional logic (JSON Logic)

```ts
import jsonLogic from 'json-logic-js'

// Em lib/forms/engine/visibility.ts
export function evaluateRule(rule: LogicRule, responses: Record<string, unknown>): boolean {
  return Boolean(jsonLogic.apply(rule.when, responses))
}
```

Server é truth (sempre re-valida no submit). Client usa pra UX (mostra/esconde
em tempo real). Mesmo motor (~7kb, no `eval()`, determinístico).

## IA pipeline (Fase 1 — vibe coding mínimo)

```ts
// lib/ai/router.ts — Haiku classifica
const { object } = await generateObject({
  model: 'anthropic/claude-haiku-4-5',
  schema: z.object({ engine: z.enum(['form', 'page']), kind: z.string() }),
  prompt: `Classifique o pedido do profissional: "${userInput}"`,
  providerOptions: { gateway: { caching: 'auto' } },
})

// lib/ai/generator.ts — Sonnet gera
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4-6',
  schema: FormDefinition,
  system: await loadPromptTemplate(engine, kind),
  prompt: collectedContext,
  providerOptions: {
    gateway: {
      caching: 'auto',
      models: ['anthropic/claude-haiku-4-5'], // fallback
    },
  },
})

// Validação Zod no output (já automática via schema) + retry até 3x se invalida
```

## Pipeline pós-submit (Fase 1)

```
POST /api/forms/[id]/submit
  → checkBotId() (Vercel BotID Deep Analysis)
  → Origin validation (host == tenant.host)
  → Insert form_submission status='completed' (RLS)
  → Dispatch Vercel Queue 'lead.submitted'
       └→ Workflow 'process-lead' (WDK 'use workflow')
           ├─ enrich (IP→geo)
           ├─ score (Haiku — lead score)
           ├─ generate-report (Sonnet + caching auto)
           ├─ email (Resend transactional)
           ├─ webhook (fan-out tenant.webhook_url se houver)
           └─ notify (in-app pro profissional)
```

## Versionamento (Hotmart-like, snapshot-only)

- `form_versions` PK `(form_id, version)`, **imutável** — nunca UPDATE
- `form_versions.locked = true` quando há ≥1 submission → edição força nova versão
- `forms.current_version_id` aponta pra versão pública atual
- **Duplicar** ≠ **Versionar**: `duplicate(formId, newName)` cria FORM novo com novo id/slug
- Sem auto-update notification (anti-Builder.io)

## Trava de custo IA obrigatória dia 1

- `providerOptions.gateway.caching = 'auto'` em TODA chamada (5-10x ganho em prefixos)
- Quota por plano via `feature_usage` + entitlement (regra `entitlements.md`)
- Rate limit 10 calls/min por tenant (Upstash Redis `@upstash/ratelimit`)
- Max 5 turnos no chat de coleta antes de gerar
- Early stop em `streamText` (profissional cancela → para)
- Cache contexto do tenant (página lida ~1h)
- Hard reject + log estruturado se IA emite spec inválido após 3 retries

## Anti-patterns

| Anti-pattern                                       | Por quê                                        | Substituto                                                  |
| -------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| Bloco novo inline no JSX do renderer               | Quebra catálogo extensível                     | Adicionar `lib/contracts/form-blocks/<kind>.ts` + Zod       |
| Branching com `if/else` no código do form          | Não-versionável, não-vibe-codable              | `LogicRule` em `logic[]` via JSON Logic                     |
| Unificar `forms` + `pages` numa tabela polimórfica | Schemas diferentes, RLS diferentes             | Tabelas separadas, helper compartilhado em `engines/base`   |
| UPDATE em `form_versions` ou `page_versions`       | Histórico imutável (snapshot-only)             | INSERT nova versão; `locked=true` quando ≥1 submission      |
| Hardcode "form CREF" no código                     | Quebra premissa "nada hardcoded"               | Seed em `form_templates` + `prompt_templates`               |
| `t()` em label/option do block                     | Conteúdo do tenant — não passa por translation | String inline no JSONB (regra `i18n.md` §"Conteúdo tenant") |
| `streamObject` em geração Fase 1                   | Reservado pra UX streaming Fase 2+             | `generateObject` síncrono com retry                         |
| Aceitar output IA sem `safeParse`                  | Schema inválido em produção                    | Validar Zod + retry até 3x + hard reject + log              |
| Skip `checkBotId` em form público                  | Abuso de submissão / IA generation farming     | Sempre `checkBotId()` server-side antes do INSERT           |
| Skip Origin validation                             | CSRF cross-tenant                              | `origin === tenant.host` antes do INSERT                    |
| Submission insert via service_role                 | Quebra RLS                                     | Anonymous Sign-In + JWT claim `tenant_id` + `is_anonymous`  |
| `delete_*` tool no MCP server                      | Safety guardrail (perda de dados)              | Apenas archive/soft-delete em v1                            |

## Condição de revisitar (gatilhos)

| Gatilho                                     | Ação                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| **Block kind novo precisa**                 | Adicionar `lib/contracts/form-blocks/<kind>.ts` + componente + nova versão prompt |
| **Vertical 2 (yoga/idiomas/outro)**         | Seed em `form_templates` + prompt-template específico. Sem código novo            |
| **Form passa de 25 perguntas regularmente** | Quebrar em multi-step + progress bar; ou dividir em 2 submissions                 |
| **Completion rate < 30%**                   | Revisar: comprimento, email primeiro, welcome copy (pesquisa 23 §2)               |
| **Custo IA > $0,10/submissão**              | Migrar default Sonnet→Haiku; Sonnet/Opus em tier pago                             |
| **Page Engine atinge limite Fase 1**        | Disparar estudo `page_engine_full` + migration                                    |
| **Cliente pede editor visual de form**      | Promover Fase 2 — preview real + edição inline modal + MCP server                 |
| **Cliente pede A/B testing**                | Adicionar `experiment_id` + `variant` em version; Vercel Flags pra rota           |
| **PWA offline em forms necessário**         | Serwist BackgroundSync + Dexie drafts (Sprint 14+)                                |

## Referências

- `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md` — plano executável + 5 decisões fechadas
- `docs/research/23-form-system-architecture.md` — pesquisa autoritativa
- `.claude/rules/naming.md` — vocab canônico + termos a evitar
- `.claude/rules/i18n.md` §"Conteúdo gerado por tenant" — `t()` só pro chrome
- `.claude/rules/entitlements.md` — quota IA + plano gating
- `.claude/rules/brand.md` — theme override runtime
- `.claude/rules/tenant-content.md` — hierarquia 4 níveis de conteúdo
- Vercel AI Gateway docs — caching + fallback + modelos
- Vercel BotID, Queues, Workflow (WDK) docs
- `json-logic-js` — https://jsonlogic.com

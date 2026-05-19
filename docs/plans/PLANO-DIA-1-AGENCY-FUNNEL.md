# Plano Dia 1 — Funil Agência (Form Engine + Page Engine)

> **Status:** draft consolidado · **Owner:** Leandro · **Data:** 2026-05-19
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

1. ✅ `0013_security_hardening_v2` — APLICADA 2026-05-19 (conversa paralela). Doc: `docs/migrations/0013_security_hardening_v2.md`
2. ✅ `0014_constraint_cleanup` — APLICADA 2026-05-19 (conversa paralela). PK/FK/index cleanup pós-auditoria. Doc: `docs/migrations/0014_constraint_cleanup.md`. **Nota:** essa migration referencia tabela `page_versions` (já existe de migration anterior, fora do escopo do Plano Dia 1 — pode ser PWA per-tenant ou outro contexto). **Antes de aplicar `page_engine_minimal`, validar se conflita com `page_versions` existente.**
3. ⏳ `form_engine` — todas as tabelas de form + `prompt_templates` unificada + enums + RLS
4. ⏳ `page_engine_minimal` — `pages` + `page_templates` (+ possivelmente `page_versions` se já não cobrir caso de uso da Fase 1)
5. ⏳ `page_engine_full` — JIT Fase 2 quando estudo de seções/componentes maturar

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
- [⏳] Validar se `page_versions` (pré-existente, vista no 0014) conflita com plano `page_engine_minimal`
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

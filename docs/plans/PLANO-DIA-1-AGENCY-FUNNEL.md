# Plano Dia 1 — Funil Agência (Catalog+Registry+Spec from day 0)

> **Status:** draft · **Owner:** Leandro · **Data:** 2026-05-18
> Sucessor de `PLANO-MESTRE-DIA-0.md`. Constrói Feature 1 (funil agência) sobre infra
> self-service desde o primeiro commit. Será refinado quando pesquisa externa do
> usuário (Claude Desktop) retornar.
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

## 0.1 Decisões consolidadas pós-pesquisa 23 (substituem partes deste plano abaixo)

> Estas decisões fecham 5 conflitos identificados ao cruzar este plano com
> `docs/research/23-form-system-architecture.md`. Substituem as seções
> originais §1.2, §1.4, §1.5, §1.6, §1.7, §2, §3 abaixo. A reescrita
> definitiva dessas seções acontece quando as 5 decisões estiverem fechadas.
> Por enquanto, **estas decisões vencem em caso de conflito.**

### Decisão 1 — Dois motores separados (não um spec único)

- **Form Engine** (motor de formulários): estrutura **linear**. Spec = `steps[] → blocks[]` + `logic[]` (regras condicionais via JSON Logic ao lado da estrutura, não dentro). Cobre TODOS os tipos de form: captação, onboarding, anamnese, brief de IA, check-in, pesquisa, vibe coding. Tipo de form distingue via coluna `forms.kind` enum + prompt-template próprio por kind. Mesmo renderer, mesmo editor.
- **Page Engine** (motor de páginas): estrutura **árvore recursiva** (`children[]` permitido). Cobre landing pages, páginas de venda, futuros documentos tipo Notion.
- **Motores isolados por código e por tabela.** Compartilham só conceitos genéricos (tenant, versionamento, publicação, slug, owner) via helper `lib/engines/base.ts`. Sem tabela polimórfica única.
- **Adicionar motor 3+ no futuro:** novo motor exige ADR. Tabelas próprias (`documents/document_versions`, etc), entry no `engineRegistry` em código, 1 prompt-template + 1 renderer + 1 editor. Não toca nos motores existentes.

### Decisão 2 — i18n inline na definition, `t()` só pro chrome

- **Chrome do app** (botões, menus, erros genéricos, mensagens de validação reutilizáveis, labels de progresso) → `t('key')` em `messages/<locale>/<ns>.json` (regra `i18n.md` continua valendo aqui).
- **Conteúdo gerado por tenant** (perguntas do form, opções, mensagens boas-vindas/agradecimento, copy da landing) → **inline no JSONB** do spec. Não passa por `t()`.
- **Multi-idioma do form** (quando precisar): overlay `translations: { 'en': { 'block-id': {...} } }` no próprio spec.
- **Atualizar `.claude/rules/i18n.md`** com seção explícita "conteúdo gerado por tenant NÃO usa `t()`". Sem isso, ESLint e Claude futuro vão tentar enfiar `t()` em dado e quebrar tudo.

### Decisão 3 — Vibe coding mínimo na Fase 1, editor visual na Fase 2

**Fase 1 inclui (chat IA no painel admin):**

- Chat com **roteador inteligente** (Haiku 4.5 classifica: form? page? qual tipo?)
- Coleta híbrida: opções clicáveis pra estrutural (vertical, tipo, idioma, tom) + texto livre pra contexto (sobre o programa, objetivo, público) + opção de ler referência externa
- IA adapta profundidade de perguntas conforme complexidade (3 pra captação simples, 8 pra avaliação fitness)
- Máximo 5 turnos no chat de coleta antes de gerar
- Geração via `generateObject` (Sonnet 4.6 + caching auto + fallback Haiku)
- Validação Zod com retry automático até 3x
- Preview real em iframe (mobile + desktop)
- Revisão por pergunta: cada pergunta gerada vem com opções sugeridas + alternativas clicáveis
- Edição via chat: profissional pede ajustes, IA aplica diff, preview atualiza, versiona automaticamente
- Edição via chat **após publicado**: profissional fala "quero editar meu form X", IA confirma qual (se vários), aplica diff, gera nova versão. Confirmações onde dói errar (publicar sobrescreve, mudou versão com 234 submissions, etc).
- **Duplicar form/page**: server action `duplicate(formId, newName)` faz deep clone do spec → novo form com novo id/slug, status='draft'. Histórico original intacto.
- Trava de custo IA: prompt caching auto, limite de turnos, quota por plano (entitlement), rate limit 10 calls/min, early stop em streaming, cache de contexto do tenant
- Custo estimado por profissional/mês: ~$1,50-$3,00 em uso normal

**Fase 1 NÃO inclui:**

- Editor visual de qualquer tipo
- Mapa mental, logic graph, drag-drop
- Streaming live da IA escrevendo o form
- IA proativa ("sugiro cortar pergunta 7")

**Fase 2 inclui (depois do Pacote C ponta-a-ponta entregue):**

- Preview real + edição inline via modal/popover (clica em pergunta abre modal pequeno; ~1-2 sem)
- Reordenar via chat (já existia, zero custo)
- Chat persiste como assistente lateral
- **MCP server próprio** publicado em Smithery.ai (~2 sem) — 9 tools v1: create*form, list_forms, get_form, update_form, publish_form, get_submissions, analyze_submissions, generate_form_from_brief, list_templates. Sem `delete*\*` em v1 (safety guardrail).

**Fase 2+ JIT (quando demanda real comprovar):**

- Editor drag-drop completo Tally-like
- Logic graph view (xyflow) pra branches complexos
- IA proativa baseada em analytics ("essa pergunta tem 60% drop-off")

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

- `form_submissions` = 1 row por submissão completa (JSONB consolidado das respostas, pra leitura O(1)).
- `form_responses` = 1 row por bloco respondido (normalizada, pra analytics drop-off + agregação cross-versão).
- Write 2x, leitura otimizada. Pesquisa 23 §8.3 confirma trade-off.

**Rotas — código EN interno, URL pública PT-BR (regra `.claude/rules/naming.md` mantida):**

| Pasta interna (EN)                         | URL pública                               |
| ------------------------------------------ | ----------------------------------------- |
| `app/(public)/[tenant]/f/[slug]/page.tsx`  | `/{tenant}/f/[slug]` (curto, mainstream)  |
| `app/(public)/[tenant]/r/[token]/page.tsx` | `/{tenant}/r/[token]` (report público)    |
| `app/(admin)/forms/page.tsx`               | `/painel/formularios` (PT-BR via rewrite) |
| `app/(admin)/forms/[id]/page.tsx`          | `/painel/formularios/[id]`                |
| `app/(admin)/forms/[id]/submissions`       | `/painel/formularios/[id]/respostas`      |
| `app/(admin)/forms/[id]/reports`           | `/painel/formularios/[id]/relatorios`     |
| `app/api/forms/[id]/submit/route.ts`       | `/api/forms/[id]/submit` (API sempre EN)  |

`/f/` e `/r/` ficam curtos (estilo Typeform/Tally, multilíngue por natureza). Painel admin tem rewrite EN→PT-BR via `vercel.ts`.

**Componentes (EN, prefixo `app-form-*`):**

`app-form`, `app-form-block-*`, `app-form-step`, `app-form-progress`, `app-form-renderer`, `app-form-preview`, `app-form-chat` (vibe coding chat), `app-form-editor-*` (Fase 2), `app-form-logic-graph` (Fase 2+).

**Strings públicas via `t()` (chrome do form):**

Namespace `messages/pt-BR/forms.json` — botões "Próximo/Voltar/Enviar", "Pergunta 3 de 7", validações genéricas ("Campo obrigatório", "E-mail inválido"), erros sistêmicos.

**Strings inline no spec (conteúdo do tenant, Decisão 2):**

Perguntas, opções, mensagem boas-vindas/agradecimento — escritas pelo profissional/IA, ficam no JSONB de `form_versions.definition`.

**Eventos analytics (namespace dotted):**

`form.view`, `form.start`, `form.step_enter`, `form.step_complete`, `form.block_focus`, `form.block_blur`, `form.submit`, `form.abandon`, `report.generated`, `report.viewed`, `report.shared`.

**Atualização pendente em `.claude/rules/naming.md`** (fazer depois das 5 decisões fechadas):

- Substituir `capture_form` por `lead-capture` no slot do `intake` banido
- Adicionar `block`, `step`, `submission`, `response`, `report`, `version`, `logic rule` como termos oficiais
- Adicionar `field`, `question`, `revision`, `answer`, `branch` como termos a evitar em código (uso em UI/docs PT-BR continua livre)

### Decisão 5 — Sequenciado por demanda (não split rígido)

**Estratégia:** (C) — aplicar migration quando a feature precisa, não tudo de uma vez. Forms agora porque o entendimento está consolidado pós-pesquisa 23. Pages depois, com migration **inicialmente incompleta** (suporta Fase 1 do funil agência) e refinada quando o estudo de seções/componentes/templates de landing for feito a fundo.

**Sequência das próximas migrations (ordem cronológica, sem números fixos):**

1. Migration de segurança em andamento (conversa paralela, número entra à frente)
2. `form_engine` — todas as tabelas de form + `prompt_templates` unificada + enums + RLS
3. `page_engine_minimal` — `pages` + `page_versions` + `page_templates` com schema mínimo (suporta Fase 1 funil agência: 1 landing por tenant, definition JSONB sem validação Zod profunda ainda; reservar espaço pra evolução)
4. `page_engine_full` — JIT quando estudo de seções/componentes/templates de landing maturar (provavelmente Fase 2 self-service)

**Regra de numeração:** sequencial conforme aplicação real. **NÃO travar números no plano** porque migrations paralelas (segurança, hotfixes, outras features) podem entrar antes. Cada migration que entrar precisa ser comunicada aqui pra manter alinhamento.

**Sub-decisões fechadas:**

| Item                                    | Decisão                                                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prompt_templates`                      | Tabela única com `engine_kind` + `form_kind` discriminadores                                                                                                       |
| `form_templates` / `page_templates`     | Separadas (Zod schema próprio por motor)                                                                                                                           |
| Foreign keys cross-motor                | Resolvidas pela ordem cronológica de aplicação                                                                                                                     |
| Quando aplicar a primeira (form_engine) | Depois de: (a) migration de segurança paralela aplicada; (b) rewrite do plano consolidado; (c) `.claude/rules/naming.md`, `i18n.md`, `forms-engine.md` atualizadas |
| Validação pós-cada-migration            | Type gen + RLS smoke test com 3 tenants antes de prosseguir                                                                                                        |
| Página de landing Fase 1                | Schema mínimo viável agora, refinar com estudo dedicado depois                                                                                                     |

**Pendência aberta:** estudo profundo de page engine (seções, componentes, hierarquia, templates de landing) — input pra `page_engine_full`. Disparado quando Fase 2 começar.

---

## 1. Decisões dia 1 (martelo batido — persistir cross-sessão)

### 1.1 Tudo é dado, não código

- Forms (perguntas, branches, validação) = **linhas em `content_blocks`** com Zod props validados via `BlockCatalog`
- Landing pages (hero, features, FAQ, CTA) = mesmas linhas, kinds diferentes
- Templates (form de captação CREF, landing minimal, etc.) = **snapshot imutável** em `templates(id, version)`
- Tenant cria página = `tenant_pages` aponta pra `(template_id, pinned_version)` + `overrides jsonb` (Hotmart pattern: snapshot-only, sem auto-update)

### 1.2 Catalog + Registry + Spec (3 camadas)

Origem: Vercel json-render (Jan 2026) + Google A2UI (2026) + Notion polymorphic
blocks + BlockSuite versioned schemas.

| Camada            | Localização                       | Responsabilidade                                                                 |
| ----------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| **BlockSpec**     | `lib/contracts/blocks/spec.ts`    | Zod recursivo: `{ id, kind, props, children[] }` — fonte de verdade do conteúdo  |
| **BlockCatalog**  | `lib/contracts/blocks/catalog.ts` | Mapa `kind → { propsSchema, description, accepts[] }` — usado por IA + validação |
| **BlockRegistry** | `components/blocks/registry.ts`   | Mapa `kind → React Component` — RSC default. BlockRenderer dispara por `kind`    |

Razão: separação Catalog (semântica) vs Registry (renderização) permite IA
gerar/editar `BlockSpec` sem conhecer componentes React; permite versionar
schema sem rebuild; permite vibe coding (usuário descreve → IA emite spec).

### 1.3 Versionamento Hotmart-like (Stream B confirmado)

- `templates(id, version)` PK composta, **imutável** — nunca UPDATE, só INSERT nova versão
- `tenant_pages.pinned_version` decide qual versão o tenant usa
- `tenant_pages.overrides jsonb` aplica patches em cima do snapshot (campos pontuais)
- `content_versions(content_id, version, snapshot jsonb)` registra histórico de cada página/form de tenant
- **NÃO** notificar "nova versão disponível" — Builder.io tem isso, Hotmart NÃO; nós seguimos Hotmart (menos atrito)

### 1.4 Meta-framework descobre motores (NÃO lista fixa de 8)

Motor = dimensão de dado que alimenta decisão downstream. Para cada vertical
nova (fitness, yoga, idiomas, qualquer outra), o framework descobre motores via:

| Sub-framework         | Pergunta que responde                                                      | Output                         |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| **ODI lite**          | Que "job-to-be-done" o cliente final contrata o profissional pra resolver? | Lista de outcomes mensuráveis  |
| **Empathy Map**       | O que cliente final vê/ouve/sente/diz/teme/quer ao chegar?                 | Lista de fricções e motivações |
| **5W2H (guardrails)** | Who/What/Where/When/Why/How/How-much — completude estrutural               | Coverage check (8 categorias)  |

A IA recebe `{vertical, brand, target_audience, business_model}` e emite
proposta de motores → admin valida → motores viram `template_modules` (cada
motor = N perguntas no form).

Onboarding-bio queimou ~150-170h por congelar 8 motores específicos de
modalidades fitness em código — esse erro NÃO se repete.

### 1.5 Tipos de formulário (catálogo dia 1)

Tipos distintos com prompt-templates próprios:

| Tipo           | Quem preenche        | IA gera?                  | Output                           |
| -------------- | -------------------- | ------------------------- | -------------------------------- |
| `capture_form` | Lead (B2B agência)   | ✅ relatório IA + landing | "vou trabalhar contigo se ..."   |
| `onboarding`   | Cliente final tenant | ✅ plano inicial          | Perfil + plano IA                |
| `assessment`   | Cliente final tenant | ✅ análise estruturada    | Avaliação inicial / re-avaliação |
| `lead_capture` | Visitante landing    | ❌                        | Salva no CRM tenant              |
| `survey`       | Cliente final tenant | ✅ resumo (opt-in)        | Pesquisa NPS / feedback          |
| `vibe_coding`  | Admin tenant         | ✅ emite BlockSpec        | Cria página/form via descrição   |

Razão: tipos compartilham infra (BlockSpec, renderer, validação) mas têm
prompt-templates separados — `prompt_templates(form_type, version, body, output_schema)`.

### 1.6 Vibe coding desde dia 1 (arquitetura, não UI)

Fase 1 NÃO entrega UI vibe coding — entrega **infra que suporta**:

- BlockCatalog exportável como JSON (IA enxerga schema dos blocos disponíveis)
- Prompt template "vibe coding" pronto, alimentado pelo Catalog
- Validação `BlockSpec.safeParse()` no output da IA → reject se inválido

Fase 2 entrega a UI que chama esses endpoints. Sem refactor.

### 1.7 Routes PT-BR, code EN, i18n from start

- Pasta `app/(marketing)/captacao/[slug]/page.tsx` (PT-BR via `vercel.ts` rewrite)
- Code `features/capture-form/` (EN)
- Strings via `t('capture.title')` desde primeira `<h1>` (regra `i18n.md`)
- DB nomes EN (`capture_forms`, `form_responses`, `capture_reports`)

### 1.8 AI SDK v6 (não generateObject)

- `generateObject` deprecated → `streamText({ ..., experimental_output: Output.object({ schema }) })`
- Vercel AI Gateway: `'anthropic/claude-sonnet-4-6'` (default para Fase 1; latência/custo aceitos)
- Schema do output = Zod compartilhado com `lib/contracts/reports.ts`
- Retry/streaming/cancel via AI SDK built-in, não rolar próprio

---

## 2. Arquitetura proposta (schema migrations)

Migrations a aplicar via `mcp__supabase__apply_migration` na ordem:

### 2.1 Migration `0014_block_engine_foundation`

> Renumerada de `0013` para `0014` em 2026-05-19. `0013` foi consumida pelo `security_hardening_v2` que fechou a Etapa 0.

```sql
-- Templates imutáveis (snapshot Hotmart-like)
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  version INT NOT NULL DEFAULT 1,
  kind TEXT NOT NULL,              -- 'form_capture' | 'landing_minimal' | 'landing_rich' | 'form_onboarding' etc
  slug TEXT NOT NULL,              -- 'cref-funnel-v1', 'landing-minimal-v1'
  schema_jsonb JSONB NOT NULL,     -- BlockSpec snapshot raiz
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, version),
  UNIQUE (slug, version)
);

-- Páginas/forms de tenant (apontam pra template + overrides)
CREATE TABLE public.tenant_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  template_id UUID NOT NULL,
  pinned_version INT NOT NULL,
  page_type TEXT NOT NULL,         -- 'capture_form' | 'landing' | 'onboarding' | 'assessment'
  slug TEXT NOT NULL,
  overrides_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (template_id, pinned_version) REFERENCES public.templates(id, version),
  UNIQUE (tenant_id, slug)
);

-- Histórico de versões (3-state: draft/published/archived inspirado em Sanity)
CREATE TABLE public.page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.tenant_pages(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot_jsonb JSONB NOT NULL,   -- BlockSpec já com overrides aplicados
  state TEXT NOT NULL CHECK (state IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (page_id, version)
);

-- Prompt templates por tipo de form (IA-bound)
CREATE TABLE public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  body TEXT NOT NULL,
  output_schema_jsonb JSONB NOT NULL,   -- Zod-shape do output esperado
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (form_type, version)
);

-- Respostas de form (one row per submission)
CREATE TABLE public.form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  page_id UUID NOT NULL REFERENCES public.tenant_pages(id),
  responder_email TEXT,
  responder_phone TEXT,
  payload_jsonb JSONB NOT NULL,    -- { block_id: value }
  ip_inet INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Relatórios IA gerados (1:1 ou 1:N com responses)
CREATE TABLE public.capture_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  response_id UUID NOT NULL REFERENCES public.form_responses(id),
  prompt_template_id UUID REFERENCES public.prompt_templates(id),
  prompt_version INT,
  output_jsonb JSONB NOT NULL,
  model TEXT NOT NULL,             -- 'anthropic/claude-sonnet-4-6'
  tokens_in INT,
  tokens_out INT,
  cost_usd_micros BIGINT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

RLS:

- `templates`, `prompt_templates`: SELECT pra `authenticated`, write só `service_role`
- `tenant_pages`, `page_versions`, `form_responses`, `capture_reports`: `tenant_id = current_tenant_id()`
- Captura pública: row em `form_responses` aceita via `anon` quando `tenant_pages.is_published = true` (RLS condicional)

### 2.2 Tipos gerados

Após migration, regen via `mcp__supabase__generate_typescript_types` →
sobrescreve `lib/contracts/database.ts`. Zero casts pendentes (regra do dia 0).

---

## 3. Primitivos a implementar (10 + helpers)

Stream C confirmou 10 primitivos Fase 1:

| #   | Primitivo              | Localização                        | Função                                                             |
| --- | ---------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| 1   | `BlockSpec` (Zod)      | `lib/contracts/blocks/spec.ts`     | Recursive `{id,kind,props,children}`                               |
| 2   | `BlockCatalog`         | `lib/contracts/blocks/catalog.ts`  | Mapa de kinds → propsSchema + metadata                             |
| 3   | `BlockRegistry`        | `components/blocks/registry.ts`    | Mapa kind → React Component (RSC default)                          |
| 4   | `BlockRenderer`        | `components/blocks/Renderer.tsx`   | Recursivo: lê spec, dispara componente, valida props via Catalog   |
| 5   | `question_*` blocks    | `components/blocks/question/*.tsx` | text, select, multi, scale, branch, terms                          |
| 6   | `layout_*` blocks      | `components/blocks/layout/*.tsx`   | stack, section, container, divider                                 |
| 7   | `landing_*` blocks     | `components/blocks/landing/*.tsx`  | hero, features, testimonial, faq, cta                              |
| 8   | `media_*` blocks       | `components/blocks/media/*.tsx`    | image (next/image), video (mux placeholder)                        |
| 9   | `AICatalogPrompt`      | `lib/ai/catalog-prompt.ts`         | Renderiza Catalog → texto pra prompt IA + parser do output         |
| 10  | `BlockVersioning` util | `lib/blocks/versioning.ts`         | `applyOverrides(snapshot, overrides)` + `migrateSpec(v1, v2)` stub |

Helpers:

- `lib/blocks/engine/visibility.ts` — `json-logic-js` wrapper pra branches
- `lib/blocks/engine/validation.ts` — extrai Zod do BlockSpec recursivamente
- `lib/blocks/engine/scoring.ts` — JIT (assessment Fase 3)

---

## 4. Etapas executáveis (ordem)

### Etapa 0 — Pendências dia 0 fechar (~2h)

- [x] Revisar 7 advisor warnings restantes — **fechado via migration `0013_security_hardening_v2`** (2026-05-19). Auditoria cruzou `research/22` + Splinter, fixou 6 achados: cross-tenant leak em `can_use_feature` + `get_entitlement` (lint 0028 ×3 → 0), bug funcional em `update_feature_quota_usage` (era INVOKER bloqueado por RLS), soft-delete bug em `palettes_update` (Issue #2799), wrap em `feature_usage_select_tenant`, FORCE RLS em `tenant_push_secrets` + `tenant_gateway_credentials`, `current_user_role` → INVOKER. Restam 3 lints 0029 by-design (documentados via `COMMENT ON FUNCTION`). Ver `docs/migrations/0013_security_hardening_v2.md`.
- [ ] `pnpm typecheck && pnpm lint --max-warnings 0 && pnpm test && pnpm build`
- [ ] Confirmar `lib/contracts/database.ts` reflete migrations 0011–0013 sem `TYPES-PENDING` (0013 não muda assinaturas — só corpos)
- [ ] Ativar **HaveIBeenPwned password protection** no Dashboard → Auth → Settings (lint `auth_leaked_password_protection`)
- [ ] Decidir JIT (item 7 auditoria): dropar SELECT policies em `avatars` / `brand-assets` / `tenant-logos` se nenhum fluxo usar `storage.list()`

### Etapa 1 — BlockSpec + Catalog + Registry skeleton (~6h)

- [ ] `lib/contracts/blocks/spec.ts` — Zod recursivo + `BlockSpec` type
- [ ] `lib/contracts/blocks/catalog.ts` — mapa vazio + helper `defineBlock`
- [ ] `components/blocks/registry.ts` — mapa vazio + `registerBlock`
- [ ] `components/blocks/Renderer.tsx` — RSC default, recebe `BlockSpec`, dispara registry
- [ ] Storybook story `blocks/Renderer` com 3 fixtures

### Etapa 2 — Question blocks + form renderer (~8h)

- [ ] 6 question blocks (text, select, multi, scale, branch, terms)
- [ ] 3 layout blocks (stack, section, divider)
- [ ] `lib/blocks/engine/visibility.ts` — branches via json-logic-js
- [ ] `features/capture-form/` vertical slice (data + actions + components)
- [ ] Migration `0014_block_engine_foundation` aplicada + RLS validado (renumerada — `0013` foi consumida pelo security hardening v2)
- [ ] Seed 1 template `'cref-funnel-v1'` (form CREF agência) em `templates`

### Etapa 3 — Página pública captação (~4h)

- [ ] `app/(marketing)/captacao/[slug]/page.tsx` resolve por hostname+slug
- [ ] Server action `submitCaptureForm` cria `form_responses` row
- [ ] APCA Silver validado, mobile-first, i18n `messages/pt-BR/capture.json`
- [ ] Rate-limit anônimo (Vercel BotID + Supabase RLS condicional)

### Etapa 4 — IA report generation (~6h)

- [ ] `lib/ai/catalog-prompt.ts` — prompt template `capture_report_v1`
- [ ] `supabase/functions/generate-capture-report/` Edge Function (Deno)
- [ ] AI SDK v6 + Vercel AI Gateway + `Output.object({ schema })`
- [ ] Trigger: row em `form_responses` → Edge Function → row em `capture_reports`
- [ ] Email-out: React Email template → SES/Resend → cliente final + tenant

### Etapa 5 — Landing renderer + 3 templates (~6h)

- [ ] 5 landing blocks (hero, features, testimonial, faq, cta)
- [ ] 2 media blocks (image, video placeholder)
- [ ] Seed 3 templates `'landing-minimal-v1'`, `'landing-rich-v1'`, `'landing-video-v1'`
- [ ] `app/(marketing)/agencia/[slug]/page.tsx` renderiza `tenant_pages` row
- [ ] Theme runtime override via `lib/route/RouteProvider` (já existe)

### Etapa 6 — Versioning + overrides (~3h)

- [ ] `lib/blocks/versioning.ts` — `applyOverrides`, snapshot capture
- [ ] Server action `publishPage` → cria row em `page_versions` state=`published`
- [ ] Read path: `getPageBySlug` retorna snapshot mais recente `published`

### Etapa 7 — Admin viewer (read-only, prep Fase 2) (~3h)

- [ ] `app/(admin)/agencia/funil/page.tsx` lista `form_responses` + reports
- [ ] Detail page mostra `BlockSpec` lado-a-lado com respostas
- [ ] Sem edição — só validação visual antes Fase 2 habilitar editor

**Total Fase 1 estimado:** ~38h (4-5 dias úteis solo).

---

## 5. O que NÃO entra em Fase 1 (JIT, anchored)

| Item                            | Ancorado em                                          | Gatilho                                          |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| Editor drag-drop de blocos      | `.claude/rules/tenant-content.md` nível 4            | Fase 2 começa (após Fase 1 validado por cliente) |
| AI builder UI ("descreva form") | Este plano §1.6                                      | Fase 2 começa                                    |
| Vibe coding UI                  | Este plano §1.6                                      | Fase 2 começa                                    |
| Scoring engine                  | Este plano §3 helpers                                | Primeira `assessment` Fase 3                     |
| 4º+ landing template            | Sinal de 3 templates apertados (rule tenant-content) | Cliente real reclama                             |
| Tenant copy overrides           | `.claude/rules/i18n.md`                              | Cliente 2 pede vocab diferente                   |
| MDX/HTML custom em landing      | `.claude/rules/tenant-content.md`                    | ADR explícito antes                              |

---

## 6. Gatilhos de revisão deste plano

| Gatilho                                                 | Ação                                                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Pesquisa externa Claude Desktop do usuário retornar** | Revisar §1, §3, §4 — incorporar achados antes Etapa 1 começar                                |
| **Primeiro cliente real B2B validar funil**             | Promover Fase 2 — começar editor + AI builder                                                |
| **Vertical 2 (yoga/idiomas) entra**                     | Rodar meta-framework §1.4 → seed novos templates → zero código novo se infra estiver ok      |
| **Block kind não cobre caso**                           | NÃO criar inline — adicionar ao Catalog + Registry + versionar schema (sempre via migration) |
| **IA emite BlockSpec inválido em produção**             | Hard reject + log estruturado + ajustar prompt template versão (sem hotfix em código)        |

---

## 7. Referências cruzadas

- ADR-0024 (multi-marca hostname) · ADR-0033 (schema único) · ADR-0040 (fechamento dia 0)
- `.claude/rules/tenant-content.md` — hierarquia 4 níveis (este plano implementa nível 3 com escada pronta pra nível 4)
- `.claude/rules/i18n.md` · `.claude/rules/brand.md` · `.claude/rules/entitlements.md`
- `.claude/rules/features.md` — vertical slice (`features/capture-form/`)
- `.claude/rules/shadcn-zone.md` — wrappers compostos
- Stream A (research, contexto desta sessão) — meta-framework motores
- Stream B (research) — versioning Hotmart-like
- Stream C (research) — Catalog+Registry+Spec pattern
- Vercel json-render (Jan 2026) — origem do pattern
- Plano Mestre Dia 0 (`PLANO-MESTRE-DIA-0.md`) — pré-requisito

---

## 8. Princípios persistidos pra futuras features (memória executável)

> Estas linhas existem pra Claude futuro abrir uma feature qualquer e não
> re-decidir. Se entrar em conflito com `.claude/rules/*.md`, rules vencem
> (path-loaded > plano arquivado).

1. **Nada hardcoded.** Form, página, prompt, copy → todos dados em DB com schema validado.
2. **Catalog+Registry+Spec** é o pattern universal — não inventar segundo pattern pra "blocos de outro tipo".
3. **Versionamento snapshot-only.** Não construir auto-migration de templates; tenant escolhe upgradar.
4. **Meta-framework descobre motores.** Nunca codar lista fixa de dimensões. ODI+Empathy+5W2H abrem qualquer vertical.
5. **Vibe coding/AI builder são Fase 2.** Em Fase 1, garantir que arquitetura suporta — não construir UI.
6. **3 fases Fase 1→Fase 2→Fase 3.** Cada feature Fase 3 (Pacote A) deve ser configuração, não código.
7. **Validar antes de aceitar IA.** `BlockSpec.safeParse()` em todo output IA — reject hard, log estruturado.

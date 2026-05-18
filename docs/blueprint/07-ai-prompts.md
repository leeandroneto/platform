# 07 — AI Prompts e Pipeline IA

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Vercel AI Gateway + Sonnet 4.6/Haiku 4.5 + JSON Outputs GA + guardrails dia 1.
> Causa raiz: prompts inline no código causaram drift no onboarding-bio. Aqui: banco versionado + hashes (LGPD).

---

## 1. Stack canônico (dia 1)

| Camada            | Decisão                                                                                       | Razão                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Provider          | **Vercel AI Gateway**                                                                         | Zero markup confirmado em doc oficial; failover Anthropic→Bedrock→Vertex; observability nativa (cost/latency/tokens) |
| SDK               | `ai` (Vercel AI SDK v6) + `@ai-sdk/anthropic`                                                 | Padrão Vercel; `structuredOutputMode: "outputFormat"` usa JSON Outputs Anthropic GA                                  |
| Modelos           | **Sonnet 4.6** (`anthropic/claude-sonnet-4.6`) + **Haiku 4.5** (`anthropic/claude-haiku-4.5`) | Pinados. Não trocar sem ADR                                                                                          |
| Saída estruturada | `output_config.format` (JSON Outputs GA)                                                      | 0 retries por JSON inválido, schema constrained no decode                                                            |
| Prompt caching    | `cacheControl: { type: "ephemeral", ttl: "1h" }`                                              | 1h em chatbot/componentes; 5min em outros                                                                            |
| Batch (pipeline)  | Batches API -50%                                                                              | "Gerar programa completo (1-2min)" — async, NÃO ZDR-eligible                                                         |
| Extended thinking | Adaptive (Sonnet) / manual (Haiku)                                                            | Só ESTRUTURA. Resto zero-shot                                                                                        |
| Eval              | Promptfoo CI + Vercel AI Gateway dashboard + Sentry                                           | Promptfoo entra quando 1º prompt customizado for criado                                                              |

Decisão fechada: master plan §13 + pesquisa 03.

---

## 2. Pipeline 4 estágios (vibe coding — UI fase 2)

Schema dia 1 (`ai_prompts/versions/invocations`). UI pipeline (stepper visual + streaming + cards) **adiada §39** — entra junto com 1º cliente que precisar OU sprint imediato pós-1º.

```
Estágio 1: IDENTIDADE
  Input: respostas prof (modalidade, target, tom, duração, preço)
  Output: { brand: { primary_color, app_name, tagline }, target_audience, tone_of_voice }
  Modelo: Sonnet 4.6 sync, zero-shot
  Custo: ~$0.045/programa

Estágio 2: ESTRUTURA
  Input: identidade
  Output: { program: { name, duration, modules: [{name, day_range}] } }
  Modelo: Sonnet 4.6 sync, ADAPTIVE THINKING (effort medium, budget 4-8k)
  Custo: ~$0.10/programa

Estágio 3: COMPONENTES (10×)
  Input: estrutura + identidade
  Output: { components: [{module_id, day, kind, payload}] }
  Modelo: Haiku 4.5 BATCH (-50%), zero-shot
  Custo: ~$0.05/programa (90% cache hit no system)

Estágio 4: COERÊNCIA
  Input: tudo gerado
  Output: { sales_page_blocks, capture_form_questions, email_sequence, push_templates }
  Modelo: Haiku 4.5 batch, zero-shot (budget 2-4k opcional)
  Custo: ~$0.007/programa
```

**Total programa completo:** ~$0.21. Chatbot Pacote C 30 conv/mês ~$0.15 cached. 10 tenants ano 1 = ~$5/mês IA total.

---

## 3. Modelos por estágio (Research B 2026-05)

| Estágio                                | Modelo         | Modo       | Thinking                    | Razão                                              |
| -------------------------------------- | -------------- | ---------- | --------------------------- | -------------------------------------------------- |
| Identidade                             | **Sonnet 4.6** | sync       | zero-shot                   | Estética/marca; vale $0.02-0.05 a mais pra acertar |
| Estrutura                              | **Sonnet 4.6** | sync       | **adaptive medium**         | Pedagogia única do programa; vale CoT explícito    |
| Componentes (10×)                      | **Haiku 4.5**  | batch -50% | zero-shot                   | Volume alto; criatividade local + schema duro      |
| Coerência                              | **Haiku 4.5**  | batch -50% | manual budget 2-4k opcional | Auditoria estruturada                              |
| Chatbot nutricional (runtime Pacote C) | **Haiku 4.5**  | sync       | zero-shot                   | $0.005/msg com cache TACO+TBCA 90% hit             |
| Pre-screen (input sanitization)        | **Haiku 4.5**  | sync       | zero-shot                   | $0.0002/req                                        |
| LLM judge (coerência)                  | **Haiku 4.5**  | sync       | zero-shot                   | $0.001/caso                                        |

Provider único: Vercel AI Gateway. Failover Anthropic→Bedrock→Vertex. Anthropic direto fallback emergência (`ANTHROPIC_API_KEY` env opcional).

---

## 4. JSON Outputs GA + 2-schema pattern (§13.9 master plan)

**Anthropic JSON Outputs GA** (mai/2026) faz **constrained decoding**: schema compilado em gramática + modelo fisicamente impedido de emitir tokens inválidos. Sem retries por JSON malformado.

**Gotcha crítico:** Anthropic rejeita Zod keywords `minimum`, `maximum`, `minLength`, `exclusiveMinimum`, `not`, `oneOf`, `format` (exceto datas básicas), `regex`.

**Solução: 2 schemas paralelos por componente:**

| Schema                    | Onde                     | Constraints                                     |
| ------------------------- | ------------------------ | ----------------------------------------------- |
| `<kind>.draft.schema.ts`  | Bordas LLM (request)     | Sem `.min/.max/.url/.regex` — só tipos e shape  |
| `<kind>.strict.schema.ts` | Banco/UI (validação pós) | Estende draft + adiciona constraints de negócio |

```
lib/contracts/components/workout/
├── workout.draft.schema.ts        ← magro pro LLM
├── workout.strict.schema.ts       ← rico pro banco/UI
└── workout.contracts.ts           ← input/output Server Actions
```

**Borda LLM → banco:**

```
parsed = WorkoutDraftSchema.parse(raw)    // shape ok (constrained decoding garante)
return WorkoutStrictSchema.parse(parsed)  // constraints de negócio
```

`lib/ai/parse-component.ts` helper genérico `parseGenerated<TStrict>(raw, draft, strict)`.

Regra: todo `payload jsonb` gerado por IA tem par draft+strict. Strict é fonte de verdade pra UI/banco; draft só existe pra contrato LLM.

---

## 5. Prompt caching (TTL strategy)

`cacheControl: { type: 'ephemeral', ttl: '1h' | '5min' }`. Apenas ephemeral existe — não há cache persistente.

| Pricing multiplier | Valor                    |
| ------------------ | ------------------------ |
| write 5min         | 1.25× input              |
| write 1h           | 2× input                 |
| **read (hit)**     | **0.1× input (90% off)** |

| Estágio                            | TTL      | Razão                                              |
| ---------------------------------- | -------- | -------------------------------------------------- |
| Pipeline COMPONENTES               | **1h**   | Prof gera 10+ componentes em sequência em 30-50min |
| Chatbot Pacote C                   | **1h**   | Cliente conversa 5-15 msgs em uma sessão           |
| Identidade / Estrutura / Coerência | **5min** | Uso pontual                                        |

**Hierarquia de invalidação:** `tools → system → messages`. Mudar `tools` invalida tudo. Mudar `thinking.budget_tokens` invalida só messages.

**Estrutura ótima:**

```
[ tools: definitions ]                ← raramente muda
[ system:
    persona/voice (por estágio)
    identidade tenant renderizada
    few-shot examples (2-5)
  ] ← cache_control aqui              ← cache breakpoint
[ user: slot/contexto pontual ]       ← varia
```

Regra: `system` = idêntico entre dois requests consecutivos. `user` = só o que muda. Trocar few-shots invalida cache — rotacione poucos por vez.

Mínimo cacheável: 4.096 tokens para Opus + Haiku 4.5; 1.024 para Sonnet 4.5/4.6. Se system < mínimo do Haiku, expandir.

---

## 6. Extended thinking — só ESTRUTURA

| Estágio     | Thinking?                      | Por quê                                        |
| ----------- | ------------------------------ | ---------------------------------------------- |
| Identidade  | ❌ zero-shot                   | Criativa estética; CoT não melhora             |
| Estrutura   | ✅ adaptive medium budget 4-8k | Única decisão arquitetural; vale $0.075 extra  |
| Componentes | ❌ zero-shot                   | Volume alto; CoT mata margem                   |
| Coerência   | opcional manual budget 2-4k    | Auditoria se beneficia de raciocínio explícito |

**Sonnet 4.6** usa adaptive thinking (`thinking: { type: "adaptive" }` + `effort: "medium"`) — manual deprecated nesses modelos.

**Haiku 4.5** usa manual (`thinking: { type: "enabled", budget_tokens: 3000 }`) — adaptive não suportado.

Latência: +3-15s dependendo do budget. Use `display: "omitted"` se não vai mostrar raciocínio (corta time-to-first-text).

Incompatível com: `temperature`, `top_k`, forced tool use, prefill, `max_tokens: 0`.

---

## 7. Guardrails de segurança (dia 1 do chatbot)

### 7.1 Input sanitization (`lib/ai/sanitize.ts`)

```
SUSPICIOUS patterns regex:
- /ignore (all |the )?(previous|above) instructions?/i
- /system\s*:/i
- /<\/?(system|tenant_input|assistant)>/i
- /reveal (your |the )?(system )?prompt/i

preScreen(input):
  - length > 2000 → reject 'too_long'
  - matches SUSPICIOUS → reject 'pattern'

safeWrap(input, tag):
  - strip </tag> markers
  - wrap em <tag>...</tag>
```

**Camada extra (chatbot only):** pre-screen Haiku $0.0002/req classifica `{ok|suspicious|reject}` — defesa pra prompts ambíguos que regex não pega.

### 7.2 System prompt explícito (todo prompt chatbot/IA)

```
Você é assistente nutricional do programa do prof [nome].
NUNCA diagnostica. NUNCA prescreve medicamento. NUNCA promete cura.
Sempre encaminha sintomas pra profissional habilitado (médico, nutri registrado).
Não responde sobre tratamento de doenças. Foco: educação alimentar + dicas de adesão.
```

### 7.3 LLM judge na COERÊNCIA do pipeline

Haiku 4.5 avalia output com rubric "este texto contém conselho médico/prescrição/promessa de cura?". Bloqueia se sim.

### 7.4 PII placeholder antes do prompt

```
maskAluno(name):
  placeholder = `__ALUNO_${crypto.randomUUID().slice(0,8)}__`
  return { masked: placeholder, originalToPlaceholder: { [name]: placeholder } }

rehydrate(text, map):
  Object.entries(map).reduce((acc, [k, v]) => acc.replaceAll(v, k), text)
```

Nome do aluno NUNCA vai bruto pro prompt. Primeiro nome ok com placeholder; rehidrata no frontend após response.

### 7.5 Multi-tenant safety

Prompts SEMPRE construídos com cliente Supabase do usuário (RLS-enforced), NUNCA com `service_role`. Embeddings/KB consultam só tabelas globais (`public.kb_exercises`, `public.kb_foods`).

`lib/ai/build-context.ts` usa `createClient()` (server, RLS-aware). Service role só em jobs admin (seed KB, migrations).

Detalhes: master plan §13.12 + pesquisa 03 §7.

---

## 8. Schema `public.ai_prompts` + versions (D-G48)

**Versionado, active único por key:**

```sql
CREATE TABLE public.ai_prompts (
  id text PRIMARY KEY,                           -- 'chatbot.nutrition' | 'vibe.identity.fitness_strength' | ...
  vertical_id text REFERENCES public.verticals(id),  -- nullable se cross-vertical
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.ai_prompt_versions (
  prompt_id text NOT NULL REFERENCES public.ai_prompts(id),
  version int NOT NULL,
  system_message text NOT NULL,
  user_template text NOT NULL,                   -- mustache/handlebars
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,   -- few-shots
  model text NOT NULL,                           -- 'anthropic/claude-haiku-4.5'
  params jsonb NOT NULL DEFAULT '{}'::jsonb,     -- temperature, thinking budget, etc
  schema_ref text,                               -- 'WorkoutDraftSchema' (auditoria; schema vive no código)
  active boolean NOT NULL DEFAULT false,
  rollout_pct int NOT NULL DEFAULT 100 CHECK (rollout_pct BETWEEN 0 AND 100),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (prompt_id, version)
);

CREATE UNIQUE INDEX ai_prompt_active_unique ON public.ai_prompt_versions (prompt_id)
  WHERE active = true;  -- garante 0 ou 1 active por prompt_id
```

**Lookup pattern (cache 60s via `unstable_cache`):**

```
loadPrompt(key) →
  unstable_cache(
    () => supabase.from('ai_prompt_versions')
      .select('*').eq('prompt_id', key).eq('active', true).single(),
    ['prompt'],
    { revalidate: 60, tags: ['prompts'] }
  )
```

**Versionamento:** cada `(key, version)` imutável após criação. "Mudar o prompt" = inserir `version=N+1` + atualizar `active=true` (constraint single-active garante atomicidade).

**Rollback:** transação que primeiro desativa N e ativa N-1 — operação em segundos.

**A/B:** dia 1 use 2 keys distintas (`x` e `x.experimental`) com split aleatório. A/B sticky por tenant via `rollout_pct` fica pra 50+ tenants.

---

## 9. `public.ai_invocations` — audit log com HASHES (D-G48 — LGPD)

```sql
CREATE TABLE public.ai_invocations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  user_id uuid REFERENCES auth.users(id),
  prompt_key text NOT NULL,
  prompt_version int NOT NULL,
  model text NOT NULL,
  stage text NOT NULL,                           -- 'chatbot'|'identity'|'structure'|'components'|'coherence'
  input_hash text NOT NULL,                      -- sha256 (NÃO texto bruto — LGPD)
  output_hash text NOT NULL,
  input_tokens int NOT NULL,
  output_tokens int NOT NULL,
  cache_read_tokens int NOT NULL DEFAULT 0,
  cache_write_tokens int NOT NULL DEFAULT 0,
  cost_usd_cents numeric(10,4) NOT NULL,
  latency_ms int NOT NULL,
  status text NOT NULL,                          -- 'ok'|'schema_fail'|'refusal'|'error'
  error jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ai_invocations_tenant_idx  ON public.ai_invocations (tenant_id, created_at DESC);
CREATE INDEX ai_invocations_prompt_idx  ON public.ai_invocations (prompt_key, prompt_version);

ALTER TABLE public.ai_invocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_invocations_tenant_select ON public.ai_invocations
  FOR SELECT TO authenticated
  USING (tenant_id = (select public.current_tenant_id()));
```

**Por que hashes, não texto:** LGPD. Textos brutos podem conter PII via aluno. Hashes permitem dedupe + observability ("este prompt já gerou esta saída antes") sem reter PII. Vercel AI Gateway dashboard tem texto temporário (1h cache) pra debug imediato.

**Volume baixo MVP:** persistir 100% dos invocations. Acima de 1M/mês, sampling 10% + materialized view diária.

**`public.ai_usage_monthly` agregado pra `assertBudget`:**

```sql
CREATE TABLE public.ai_usage_monthly (
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  month date NOT NULL,                           -- YYYY-MM-01
  total_cents int NOT NULL DEFAULT 0,
  invocations int NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, month)
);
```

Trigger `on_ai_invocation_insert` incrementa `ai_usage_monthly.total_cents` atomicamente.

---

## 10. Budget per-tenant (`lib/ai/budget.ts`)

```
BUDGET_CENTS_BY_TIER = {
  A: 0,        // sem chatbot, sem pipeline runtime
  B: 0,        // sem chatbot
  C: 200,      // $2/mês cap chatbot Pacote C (conservador com 90% cache hit)
}

assertBudget(tenantId, estCents):
  tenant = supabase.from('tenants').select('plan').eq('id', tenantId).single()
  cap = BUDGET_CENTS_BY_TIER[tenant.plan] ?? 0
  usage = supabase.from('ai_usage_monthly').select('total_cents').eq('tenant_id', tenantId).single()
  used = usage?.total_cents ?? 0
  if (used + estCents > cap) throw new BudgetExceededError(tenantId, used, cap)
```

Vercel AI Gateway não tem budget granular por tenant — implementar na app. `BudgetExceededError` mapeia pra `AppError.kind = 'budget_exceeded'` (vira UI "Upgrade pra continuar").

---

## 11. Helpers AI client dia 1 (chatbot only)

Mínimo necessário pro chatbot Pacote C funcionar:

| Helper                                     | Onde                 | Função                                       |
| ------------------------------------------ | -------------------- | -------------------------------------------- |
| `assertBudget(tenantId, estCents)`         | `lib/ai/budget.ts`   | Throw `BudgetExceededError` se cap excedido  |
| `preScreen(input)`                         | `lib/ai/sanitize.ts` | Pattern check + length cap                   |
| `safeWrap(input, tag)`                     | `lib/ai/sanitize.ts` | XML wrap defensivo                           |
| `maskAluno(name)` / `rehydrate(text, map)` | `lib/ai/pii.ts`      | PII placeholder                              |
| `loadPrompt(key)`                          | `lib/ai/prompts.ts`  | Next 16 `'use cache'` + cacheLife('minutes') |
| `logInvocation({...})`                     | `lib/ai/audit.ts`    | Insert em `ai_invocations` com hashes        |
| `generateChatResponse(args)`               | `lib/ai/chat.ts`     | Orquestrador final                           |

`generateComponent` (pipeline) só entra quando UI pipeline for construída (§39).

---

## 12. `Supabase.ai.Session` built-in NÃO usar (D-G51)

Supabase Edge Functions têm API built-in `Supabase.ai.Session('model-name')` com modelo embedding `gte-small` (384d) e LLM via Ollama/Llamafile. **Não serve pra desafit:**

- `gte-small` é **EN-only** — inútil pra chatbot/conteúdo PT-BR
- Ollama em Edge Function tem cold start alto + modelos pequenos (qualidade ruim vs Sonnet/Haiku)
- Vercel AI Gateway + Claude é estado-da-arte (latência baixa, qualidade alta, caching, failover)

Se um dia precisarmos embeddings PT-BR: `multilingual-e5-small` 384d em Supabase Edge Function com Transformers.js (padrão oficial). **Não dia 1** — chatbot Pacote C funciona sem RAG (KB inteiro cabe no system prompt cacheado).

---

## 13. KB sem embeddings dia 1 (D-G50)

`public.kb_exercises` (~870 free-exercise-db, Unlicense) e `public.kb_foods` (~2500 TBCA 1900 + TACO 597) **sem coluna `embedding vector(384)` dia 1**.

Picker no painel: SQL puro filtra (muscle/equipment/level + ILIKE no nome / `pg_trgm` similarity). Performance suficiente até 10k entries.

Chatbot nutricional Pacote C: TBCA+TACO inteiro no `system` prompt cacheado 1h (~80k tokens, cabe em 200k contexto Haiku 4.5). Cache hit 90%+ na sessão = $0.005/conversa.

**Crédito legal obrigatório** no rodapé do chatbot: _"Dados nutricionais: TBCA (USP/FORC) e TACO (NEPA/UNICAMP)."_

**`pgvector` NÃO instalado dia 1.** Gatilho pra ativar: ≥100 conversas/dia agregadas OU custo IA total > R$200/mês OU 1º tenant pedir busca semântica explícita.

---

## 14. Batches API (-50% — pipeline futuro)

Quando pipeline UI entrar, oferecer 2 modos no editor:

- **"Gerar agora"** (sync, 100% custo) — componente isolado
- **"Gerar programa completo (1-2min)"** (batch -50%) — fluxo principal

Async tipicamente <1h, até 24h SLA. Empilha com prompt caching 1h. **Não é ZDR-eligible** — não usar pra dados com PII direta sem mask.

Limites: 100k requests ou 256MB por batch. `max_tokens: 0` (pre-warming) não funciona em batch.

---

## 15. Eval Promptfoo (dia 1 quando 1º prompt customizado)

Golden set ~40 casos por estágio:

- 5 "happy path" + 3 edge (input ambíguo, contradição, idioma misturado) + 2 adversarial (prompt injection, escopo fora)

**3 camadas de métrica:**
| Camada | Mede | Como | Custo |
|---|---|---|---|
| **Structural** | "JSON parsa? Schema bate?" | `ZodSchema.safeParse` ou assert Promptfoo | Gratuito. **Bloqueante.** |
| **Semantic** | "Coerente, no tom, sem contradição?" | LLM judge (Haiku) com rubric YAML | ~$0.001/case |
| **Business** | "Profissional usaria sem editar?" | UI feedback humano ("foi útil?"). Sample em prod | Tempo humano |

**Balanceamento:** bloqueio PR = 100% structural + ≥95% semantic. Business score manual semanal.

CI: `evals/promptfooconfig.yaml` rodado em PR que toca `evals/**`, `db/schemas/**`, `supabase/migrations/**prompts**`. Custo ~$6.40/PR.

---

## 16. Observabilidade em produção

| Stack                           | Pra quê                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| **Vercel AI Gateway dashboard** | Custo, latência, tokens, error rate por modelo. ✅ essencial dia 1 |
| **Sentry (`@sentry/nextjs`)**   | Erros runtime, traces. Sentry AI ainda em beta                     |
| **Tabela `ai_invocations`**     | Auditoria + LGPD via hashes                                        |
| Helicone / Braintrust           | Overengineering dia 1 (duplica Gateway) — só após validar tração   |

**Drift alerts:** dia 1 basta "custo médio por tenant +50% em 7d" (Gateway dashboard). Drift semântico (qualidade caindo) é overengineering antes de 10+ tenants pagantes.

---

## 17. Anti-patterns proibidos

| Anti-pattern                           | Razão                                                        |
| -------------------------------------- | ------------------------------------------------------------ |
| Prompt inline no código TS             | Drift garantido; vai pra `public.ai_prompts` versionado      |
| `service_role` na construção do prompt | Vaza dados cross-tenant; sempre cliente RLS-enforced         |
| Texto bruto em `ai_invocations`        | Viola LGPD; hash sha256 obrigatório                          |
| Nome do aluno bruto no prompt          | PII; `maskAluno` + `rehydrate` no frontend                   |
| Schema único Zod pro LLM               | Anthropic rejeita keywords; sempre 2-schema (draft + strict) |
| `Supabase.ai.Session` built-in         | EN-only (`gte-small`); use Vercel AI Gateway                 |
| `pgvector` dia 1 sem volume            | YAGNI; gatilho ≥100 conv/dia OU custo > R$200/mês            |
| Extended thinking em todos estágios    | Custo 10× sem ganho marginal; só ESTRUTURA                   |
| Cache TTL 5min em chatbot              | Quebra reuso na sessão; 1h obrigatório                       |
| Batches API com PII sem mask           | NÃO ZDR-eligible (até 29 dias retention)                     |

---

## Referências

- `00-PROJETO.md` §8 (chatbot do PWA = IA, nunca prof)
- `_CONFLITOS.md` #2 (sem TACO/TBCA dia 1 — IA gera) · #14 (Vercel AI Gateway zero markup)
- `06-data-model.md` §4.3 (tabelas IA JIT) · §12 (comunicação)
- Master plan §13 (vibe coding completo) · §16.15 (schemas IA) · §16.16 (KB) · §16.17 (pgvector adiado)
- Pesquisa 03 (engenharia de prompt completa — Anthropic JSON Outputs GA, modelos, caching, guardrails, LGPD)
- Memórias: `reference_ai_engineering.md`, `project_desafit_research_b_2026_05_17.md`

## Histórico

| Data       | Mudança                                                                                               | Aprovador |
| ---------- | ----------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — Sonnet+Haiku pinados, JSON Outputs GA, 2-schema, caching 1h, guardrails, hashes LGPD | Leandro   |

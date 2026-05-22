# Deferred — AI Theme Generation (Fase 6 antiga, detail técnico portado)

> **Tipo:** deferred plan detail (não-bloqueante).
> **Origem:** `docs/plans/pivot-tweakcn.md` §7 Fase 6 (arquivado em
> `docs/_archive/plans/2026-05-pivot-tweakcn.md` em 2026-05-22).
> **Data porta:** 2026-05-22 (última ação da sessão antes de iniciar
> `docs/plans/theme-builder.md` em nova conversa).
> **Estimativa:** ~25h (revisado research-41 §3.4)
> **Gatilho retorno:** theme builder admin-only funcional + 2+ tenants
> pedindo IA explicitamente OR após item 5 da ordem ADR-0046 (AI builders
> pages + forms engines) estabilizar (porque o pattern AI será reusado).

---

## 0. Sobre este arquivo

Detail técnico do que era **Fase 6** do `pivot-tweakcn.md` arquivado.
Quando gatilho disparar, este arquivo vira insumo direto pra novo plano
executor (não re-deduzir do zero).

**Princípio meta:** ADR-0046 cravou dogfooding-first — theme builder
admin-only (Fase 5, plano `theme-builder.md`) basta pra funil agência.
AI gen entra depois que funil estiver capturando leads. Sem 2+ tenants
pedindo, IA é frescura premature (vide memory `feedback_frescura_filter.md`).

---

## 1. Goal original (porta do pivot §7)

Profissional descreve "vibe" → IA gera `ThemeSchema` → preview live → save.
Image-to-theme upload. Tudo via Gemini através de Vercel AI Gateway.

**Stack cravada em ADR-0045:**

- `streamText` (Gemini 2.5 Flash, base chat) com tool calling
- Tool `generateTheme` invoca `streamObject` (Gemini 3 Flash Preview,
  theme-gen) com schema Zod `themeStylePropsSchema`
- Fallback `google/gemini-2.5-flash` se Gemini 3 Flash não disponível
  (ADR-0045 D.16)
- APCA Silver validation pós-output (rejeitar com soft warn — ADR-0045 D.17)

---

## 2. Estudos prévios (porta §7 do pivot)

> **NOTA — consolidação audit:** S6.\* foi consolidado em
> `docs/research/41-audit-tweakcn-fases-5-6-7.md` §3 (audit Fase 6
> inteiro). Não re-executar quando retomar.

### S6.0 — Audit TweakCN `lib/ai/**` + `app/api/generate-theme/route.ts`

**Consolidado em research-41 §3.** Mapeamento:

| Arquivo                           | LOC | Papel                                                                                             |
| --------------------------------- | --- | ------------------------------------------------------------------------------------------------- |
| `lib/ai/prompts.ts`               | 111 | System prompts: `GENERATE_THEME_SYSTEM` + `ENHANCE_PROMPT_SYSTEM`                                 |
| `lib/ai/providers.ts`             | 25  | `myProvider` customProvider Gemini — gemini-2.5-flash (base) + gemini-3-flash-preview (theme-gen) |
| `lib/ai/generate-theme/index.ts`  | 4   | Re-exports `themeStylesOutputSchema` = `themeStylesSchemaWithoutSpacing`                          |
| `lib/ai/generate-theme/tools.ts`  | 44  | `THEME_GENERATION_TOOLS` — tool `generateTheme` com `streamObject`                                |
| `app/api/generate-theme/route.ts` | 109 | POST endpoint: rate-limit Upstash + subscription check + `streamText` com tool                    |

**Total: ~293 LOC de AI core.**

### S6.1 — AI Gateway Vercel status + custos (executar JIT)

**Pergunta:** AI Gateway já configurado? Gemini 2.5 Flash preview
disponível? `gemini-3-flash-preview` no gateway? Custo por geração?

**Como:** `mcp__plugin_vercel_vercel__list_projects` + verifica env vars
`AI_GATEWAY_*`. Cross-ref com `vercel:ai-gateway` skill.

**Output esperado:** `docs/research/4X-ai-gateway-setup.md`.

### S6.2 — Adapt system prompt TweakCN

**Pergunta:** `lib/ai/prompts.ts` do TweakCN (~111 LOC) fala dos ~45 keys
flat. Nosso prompt fala da mesma coisa (sem archetype/roles) — copy
literal + small adapt?

**Adapt cravado:**

- Manter seções: Color Harmony, Font Pairing, Mode-Aware Shadows, Letter
  Spacing & Radius Commitment, Design Coherence
- Adicionar: "APCA Silver compliance" (body Lc ≥75, large ≥60, non-text ≥45)
- Adicionar: "OKLCH output preferred" (em vez de HEX-only do upstream)
- Adicionar: "Tenant context" (vertical fitness/yoga/languages + brand.name)

### S6.3 — Image-to-theme: LLM multimodal vs pixel extraction

**Decisão (research-41 §3.3):** LLM multimodal Gemini (proven em
TweakCN). Sem pixel extraction culori. Imagens convertidas via
`convertMessagesToModelMessages` em `DataContent` (base64/URL).

---

## 3. Patterns research-44 (Lovable hydration + Vercel Artifacts + resumable-stream)

Research-44 (2026-05-21) auditou 20 players reais e cravou padrões
copiáveis quando AI gen entrar:

### 3.1 Lovable hydration pattern

Lovable usa `streamObject` com hydration progressiva no UI — partial Zod
objects válidos atualizam preview enquanto generation continua. Não
espera output completo pra mostrar UI.

**Aplicar:** preview painel direito atualiza tokens conforme
`streamObject` emite partials válidos.

### 3.2 Vercel Artifacts `createDocumentHandler<T>()` factory

Reference: `ai-chatbot-ref/lib/artifacts/server.ts`. Factory pattern que
recebe `{ kind, onCreateDocument, onUpdateDocument }` + emite handler
polymorphic.

**Aplicar:** quando 3+ kinds de IA generation existirem (theme + page +
form), extrair `createBlockHandler<T>()` factory copy literal. ADR-0045
D.8 cravou.

### 3.3 `resumable-stream` pacote

Quando theme generation ficar lenta (5-30s), `resumable-stream` resume
stream pós-disconnect — UX crítica em mobile com conexão instável.

**Gatilho:** quando primeira generation real em produção mostrar p95 >5s
OU 1+ tenant relatar "perdi geração no meio".

---

## 4. Sub-tarefas detalhadas (porta §7 do pivot — ~25h)

> **Origem:** porta §7.1-§7.4 do pivot + research-41 §3.4 esforço breakdown.

### 4.1 System prompt adaptado (2h)

Criar `lib/ai/theme-generation-prompt.ts` baseado em S6.2 adapt cravado.
Cross-ref `tweakcn-ref/lib/ai/prompts.ts` linha-por-linha.

### 4.2 Endpoint `POST /api/admin/theme-studio/generate` (8h setup gateway)

**Faz:** Vercel AI SDK v6 `streamText` (Gemini 2.5 Flash base chat) com
tool `generateTheme` invocando `streamObject` (Gemini 3 Flash Preview ou
fallback) → stream pra client.

**Inclui:**

- Rate-limit Upstash (5 req/60s por tenant — substitui per-IP do upstream)
- `requireEntitlement('ai_theme_gen')` server-side (ADR-0039 RPCs)
- `recordAIUsage` em `onFinish` grava `modelId + inputTokens + outputTokens + tenantId`
  em `tenant_theme_versions.metadata` JSONB (substitui tabela `aiUsage`
  do upstream)
- `stopWhen: stepCountIs(5)` limita turns multi-step

### 4.3 APCA gate pós-output (3h, ADR-0045 D.17)

**Faz:** validação APCA após `streamObject` retornar:

1. `safeParse` Zod `ThemeSchema`
2. Se válido: rodar `apca(fg, bg)` em todos pares (body Lc 75, large 60,
   non-text 45)
3. Se falhar: **soft warn** UX cravada — mostrar aviso "contraste
   ajustado automaticamente" + botão "Tentar mais contraste" que
   re-prompt com constraint explícita (não hard reject — frustra
   profissional se acontecer frequentemente; research-41 §3.4 bloqueador)

### 4.4 Chat UI minimalista (8h — sem TipTap)

**Faz:** `<textarea>` + submit button + streaming preview update + pill
actions (sugestões rápidas: "fitness vibrant", "yoga calm", "idiomas
classic").

**SKIP TipTap chat editor:** mention-list, mention-suggestion,
custom-textarea, message-edit-form — todos DEFER (research-41 §2.3
marcou DEFER). MVP textarea simples basta.

### 4.5 Image upload + image-to-theme (3h)

**Faz:** drag-and-drop área + multipart upload → endpoint multimodal →
ThemeSchema gerado. Base64 conversion via `Blob` (já usado no nosso
storage engine).

Componentes copy de tweakcn-ref (DEFER no plano theme-builder, copy aqui):

- `ai/drag-and-drop-image-uploader.tsx`
- `ai/image-uploader.tsx`
- `ai/uploaded-image-preview.tsx`
- `ai/chat-image-preview.tsx`

### 4.6 Versionamento da geração (2h — usa schema Fase 4)

**Faz:** cada output IA salvo como `tenant_theme_versions` nova row com
`source='ai-generated'` + `prompt_text` + `model` metadata pra audit/restore JIT
(princípio §9 do pivot).

### 4.7 Image upload + LLM multimodal (incluído em 4.5)

Imagens incluídas em `messages` passadas ao modelo. Modelo base
(Gemini 2.5 Flash multimodal) analisa visualmente e descreve ao modelo
theme-generation. Não é pixel extraction — é análise visual LLM.

---

## 5. Model policy ADR-0045 D.6 (porta da ADR)

| Role           | Modelo                                 | Razão                                                                                           |
| -------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Router         | `anthropic/claude-haiku-4-5` (Haiku)   | Routing rápido + barato; decisão "qual tool invocar"                                            |
| Orchestrator   | `anthropic/claude-sonnet-4-5` (Sonnet) | Orquestração complexa, chat UI, edits multi-step                                                |
| Theme gen      | `google/gemini-3-flash-preview`        | Structured output Zod, baixa latência, multimodal nativo (image-to-theme)                       |
| Fallback theme | `google/gemini-2.5-flash`              | Se gemini-3-flash-preview indisponível em AI Gateway (D.16). Temas ligeiramente menos criativos |

**Razão tabela cravada:** evita "1 modelo serve tudo" anti-padrão. Cada
papel tem modelo adequado por custo/latência/capability.

---

## 6. APCA gate pós-output (ADR-0045 D.17 — porta)

Decisão cravada: **soft warn em vez de hard reject**:

- Mostrar aviso: "Tema gerado tem contraste APCA abaixo do Silver em X
  pares (detalhes abaixo)"
- Listar pares falhantes (foreground/background, Lc atual, threshold)
- Botão **"Tentar mais contraste"** — re-prompt com constraint explícita
  no system prompt
- Botão **"Salvar mesmo assim"** — persiste com flag
  `metadata.apca_warning: true`

**Razão:** rejeitar output AI por falha APCA frequentemente frustra
profissional. Soft warn dá controle + transparência.

---

## 7. Quota tracking + GAP-1 rate limit AI per-tenant (8h)

GAP-1 research-43 cravou:

- **Upstash ratelimit** per-tenant (não per-IP) — IP só captura abuser,
  per-tenant captura abuse de tenant pago abusando própria conta
- Key: `theme-gen:${tenantId}` — 5 req/60s default
- Override por entitlement: Pro tier 20 req/60s, Enterprise unlimited
- Falha rate limit: `429 Too Many Requests` + `Retry-After` header

**Quota usage:**

- `tenant_theme_versions.metadata` JSONB grava
  `{ modelId, inputTokens, outputTokens, costEstimate }`
- Trimestral, dashboard admin agrega por tenant — input pra billing real

---

## 8. Cross-links

### ADR-0045 (Registry Strategy + AI Orchestration + Novel)

- **D.4** — Novel adopt now (install JIT — afeta chat editor TipTap)
- **D.5** — Hybrid orchestration (`generateObject` greenfield +
  `streamText` + tool calling pra edits)
- **D.6** — Model policy tabular (acima §5)
- **D.16** — Gemini 2.5 Flash fallback
- **D.17** — APCA soft warn UX (acima §6)

### research-25 — AI Reports architecture

`docs/research/25-ai-reports-architecture.md` tem 30+ decisões reusáveis
sobre arquitetura AI generation em produção. Quando este detail file for
promovido, **ler research-25 antes** — pattern report tem muito em
comum com theme generation (Zod structured output, retry on schema fail,
rate limit, quota tracking, prompt versioning).

### Outros

- ADR-0046 — dogfooding-first (gatilho retorno)
- ADR-0044 — pivot TweakCN (princípio §8 extract+adapt)
- ADR-0041 — engine catalog (`createDocumentHandler<T>()` cabe aqui no
  futuro como `createAIGeneratorHandler<T>()`)
- ADR-0039 — entitlements RPCs (`requireEntitlement('ai_theme_gen')`)
- research-41 §3 — Audit Fase 6 inteiro (não re-executar)
- research-43 — GAP-1 rate limit AI per-tenant
- research-44 — Lovable hydration + ai-chatbot factory + resumable-stream
- `tweakcn-ref/lib/ai/` — SSOT pra adaptação direta (commit `9adabcf9`)
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` §7 — origem desta porta

---

## 9. Checklist verificação (porta §7 do pivot — quando retomar)

- [ ] Estudos S6.1 (AI Gateway), S6.2 (prompt adapt), S6.3 (multimodal
      confirmado) outputs documentados (S6.0 já em research-41 §3)
- [ ] System prompt adaptado salvo em version control
      (`lib/ai/theme-generation-prompt.ts`)
- [ ] Endpoint `/api/admin/theme-studio/generate` funcional
- [ ] Rate limit testado (5/60s per-tenant, GAP-1 cravado)
- [ ] Chat textarea + streaming preview funciona
- [ ] Image upload + LLM multimodal extrai theme válido
- [ ] APCA Silver soft warn UX implementado (botões "Tentar mais
      contraste" + "Salvar mesmo assim")
- [ ] Versionamento AI (`source='ai-generated'` metadata) gravado
- [ ] Quota tracking gravado em `tenant_theme_versions.metadata` JSONB
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm build` ✅
- [ ] Smoke test: "fitness vibrant orange tropical" → theme gerado
      renderiza corretamente

---

**Fim do detail file.**

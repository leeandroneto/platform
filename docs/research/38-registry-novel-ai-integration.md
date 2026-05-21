# 38. Registry + Novel AI + Form/Page Engine — Estudo arquitetural forward-planning

> **Tipo:** research autoritativa (input pra ADR-0045, não decisão cravada)
> **Status:** draft (sem decisões finais — usuário cravará as opens em Seção H)
> **Data:** 2026-05-21
> **Disparado por:** sessão `docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md`
> **Objetivo:** evitar refatoração JIT em Fase 7 do pivot. Prever arquitetura ANTES dela existir.
> **Pré-leitura:** ADR-0041 (Engine Catalog) · `docs/blueprint/21-engine-catalog.md` · session 2026-05-21-ai-stack-registry-novel-reflection · plano `docs/plans/pivot-tweakcn.md` Fase 7 · memória `feedback_mil_passos_a_frente.md`.

---

## Sumário executivo (TL;DR)

1. **Form Engine + Page Engine JÁ SÃO um registry embrionário.** ADR-0041 cravou `spec JSONB + renderer + schema Zod + chatPromptTemplate` por `engineKind`. Falta só **catálogo declarativo de blocks** (`block_kinds_catalog`) + **AI composer** que emite spec (não JSX).
2. **Recomendação v0: demoted (opção B).** Sai de runtime, vira ideation tool dev-only. Razões: multi-tenant cross-contamination de TSX raw, custo extra de adapter TSX→spec, e ecosystem v0 não suporta nosso runtime theming (`<style precedence="theme">`).
3. **Camada 3 (Smart blocks) NÃO ganha tabela separada.** Estende `pages.kind` enum existente (ADR-0041 D3) + props JSONB → smart blocks são instâncias de Page Engine especializadas. Quando Program Engine entrar (Fase 3 catalog), ganha sua própria tabela + engine, não vira block.
4. **Novel AI cabe em 3 features (Lesson editor, Journals, Chatbot intermediate), NÃO em Program/Protocol builders.** Estes últimos são estruturados, não prose — Form Engine + Program Engine (futuro) resolvem. Novel sobre Tiptap = ProseMirror JSON em `lessons.body_jsonb`.
5. **AI orchestration híbrida (opção C).** `generateObject` com `PageSpec` Zod pra páginas inteiras + tool calling pra edits incrementais (Novel inline commands). Claude pra orquestração, Gemini pra theme, Haiku pra classificação. Já alinhado com `forms-engine.md` IA pipeline.

---

## A. Mapeamento conceitual — Form/Page Engine ↔ Registry ↔ Novel

### A.1 Form Engine como registry embrionário

ADR-0041 D2 + `.claude/rules/forms-engine.md` cravaram:

- **Catálogo declarativo:** `lib/contracts/form-blocks/<kind>.ts` (1 file = 1 block kind, Zod schema)
- **Discriminated union:** `Block = z.discriminatedUnion('type', [ShortTextBlock, EmailBlock, ...])`
- **Open-set extensible:** adicionar block kind = 1 file novo + 1 componente `app-form-block-<kind>.tsx` + 1 versão de prompt-template
- **Spec → renderer mapping:** renderer dispatcha por `block.type`
- **IA pipeline:** `lib/ai/router.ts` (Haiku classifica) → `lib/ai/generator.ts` (Sonnet emite `FormDefinition` Zod-validated)

**Isso JÁ É um registry.** O que falta pra virar "registry completo":

1. **Catálogo metadado descoberto em runtime** (não só via `import { ShortTextBlock } from '...'`). Hoje cada block kind precisa ser importado e adicionado manualmente ao `discriminatedUnion`. Pra IA "ver" catálogo dinamicamente, precisa de fonte declarativa única.
2. **`when_to_use`, `examples`, `anti_patterns`** por block — hoje só schema Zod (estrutura). Pra IA escolher inteligentemente, precisa de semântica.
3. **Vertical hints** (`category`, `vertical`) — qual block é fitness-friendly vs idiomas-friendly? Hoje todos são genéricos.

**Conclusão:** Form Engine é registry **mínimo**. Evolução = adicionar layer de metadados sem refatorar Zod.

### A.2 Page Engine ↔ Registry de Smart Blocks

ADR-0041 D3 + research/24 cravaram árvore recursiva `{ type, props, children[] }` com `pages.kind` enum + `KIND_CAPABILITIES` gate. Smart blocks no jargão da session 2026-05-21 (TransformationFunnel, OnboardingFlow, ProtocolDashboard) podem ser:

- **(a) `pages.kind` polimórfico estende** — `transformation_funnel` vira novo `page_kind`. Spec recursivo permanece.
- **(b) Block types compostos** — semantic blocks de alta ordem. `type: 'transformation-funnel'` agrupa hero + 3 steps + cta. Sem mudança de schema.
- **(c) Tabela `smart_blocks` separada** — registry table polimórfica catalogando blocks com lógica + state + analytics.

**Recomendação:** opção (b) durante MVP. Smart block = composto de semantic blocks declarado no catálogo (registry-time, não runtime). Renderer dispatcha pelo `type` "smart" e busca composição do catálogo. Migração pra (c) só se smart blocks ganharem **estado server-side** (analytics, automações, IA workflow embutido) que não cabe em props estáticos.

### A.3 Novel AI ↔ qual feature do produto?

Novel (https://github.com/steven-tey/novel — Tiptap + Vercel AI SDK, ProseMirror JSON, ~1.0.2 estável fev/2025) é **WYSIWYG Notion-style + AI commands**. Mata candidato pra:

| Feature do produto                 | Cabe Novel? | Razão                                                                                   |
| ---------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| Lesson editor (texto + vídeo+IA)   | ✅ SIM      | Prose dominante, AI inline ("continue", "summarize") add valor                          |
| Journals / check-ins (aluno)       | ✅ SIM      | Conteúdo livre prose, app premium ganha com IA continuation                             |
| Chatbot prompts editor (admin)     | ✅ MAYBE    | Prose admin-only, baixa frequência, ROI baixo                                           |
| Program builder (módulos+aulas)    | ❌ NÃO      | Estrutural (módulos têm campos: title, duration, prerequisites, sort_order). Form-like. |
| Protocol builder (semanas+tarefas) | ❌ NÃO      | Estrutural (semanas, tarefas, hábitos, schedule). Form-like.                            |
| Landing/sales pages                | ❌ NÃO      | Page Engine resolve (block-based, não prose-based)                                      |
| Forms                              | ❌ NÃO      | Form Engine resolve (campos tipados, não prose)                                         |
| Email templates                    | ❌ NÃO      | Email Engine futuro (template + slots, não prose livre)                                 |

**Insight:** Novel NÃO substitui Form/Page Engine. Coexiste em features **prose-dominante** ortogonais.

---

## B. Decisão estratégica v0 — recomendação

### Matriz comparativa

| Opção                  | Pros                                                                                                | Contras                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **(1) v0 OUT total**   | Zero custo de adapter, sem dependência v0 SDK, sem cross-contamination                              | Perde inspiração visual rápida em dev; descarta `~/r/themes/[id]` endpoint útil pro shadcn registry                          |
| **(2) v0 demoted**     | Mantém valor ideational (admin gera inspiração → curadoria humana → vira block); zero risco runtime | Precisa cravar workflow curadoria explícito                                                                                  |
| **(3) v0 IN coexiste** | Geração rápida pra MVP                                                                              | TSX raw em multi-tenant = caos (theming difícil, sem `<style precedence="theme">`, XSS risk); custo adapter TSX→spec elevado |

### Recomendação: **OPÇÃO (2) — v0 DEMOTED**

**Razões:**

1. **Theme override não compõe.** v0 emite TSX com classes Tailwind hardcoded. Nosso `<style precedence="theme">` aplica em CSS vars (`bg-card`, `text-foreground`), mas v0 às vezes usa `bg-zinc-900` etc. — drift garantido.
2. **Multi-tenant + TSX raw = XSS surface.** Mesmo escapando, persistir TSX em DB e renderizar via `eval`/`dynamic import` cross-tenant não passa security review.
3. **Adapter TSX→spec não é JIT.** Sobre cada nova versão v0, adapter quebra. Manutenção infinita.
4. **Page Engine spec já é melhor formato.** v0 vira **ideation visual** → admin cura → registra como block kind novo. Workflow = "v0 gerou hero variant X → admin avalia → adiciona em `lib/contracts/page-blocks/hero.ts` com `variant: 'X'`".
5. **Endpoint `~/r/themes/[id]` útil mas em escopo restrito.** Mantém compatibilidade com `shadcn add` CLI pra inspecionar themes do tenant em dev. Não é "v0 runtime".

**Impacto no plano pivot Fase 7:**

- §1278 `tenant_pages_versions` + `tenant_blocks_versions` permanecem (não dependem de v0)
- §1391-1394 `v0_generation` entitlement vira `theme_export_registry` (TweakCN-way export pra v0 CLI, não v0→nós)
- ADR-0045 cravará "v0 = dev tool, não produto"

---

## C. Arquitetura Registry proposta

### C.1 Camadas (3 já definidas em ADR-0040/0041 + 1 nova)

| Camada                         | O que                                                                                                    | Onde                                                                           | Status                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| **L1 — Primitive blocks**      | Button, Card, Input, Modal — shadcn vanilla                                                              | `components/ui/*` (zona quarentenada ADR-0040 §A-§F)                           | ✅ existe                                  |
| **L2a — Form semantic blocks** | text-input, choice, scale, npm, statement, calculated, consent, file-upload, etc                         | `lib/contracts/form-blocks/<kind>.ts` + `components/app-form-block-<kind>.tsx` | building (ADR-0041)                        |
| **L2b — Page semantic blocks** | hero, feature-grid, testimonial-grid, pricing-cards, cta, embed-form, faq                                | `lib/contracts/page-blocks/<kind>.ts` + `components/app-page-block-<kind>.tsx` | building (research/24)                     |
| **L3 — Smart blocks (NEW)**    | TransformationFunnel, OnboardingFlow, ProgramTimeline, ProtocolDashboard, HormoneTracker, WorkoutJourney | Composição de L2 + props especializados                                        | proposed (não construir até feature pedir) |

### C.2 Schema sketch proposto — `block_kinds_catalog`

**Não criar dia 0 da Fase 7.** JIT quando 3+ blocos existem no formato registry-ready. Estrutura quando criar:

```sql
CREATE TABLE public.block_kinds_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL UNIQUE,           -- 'hero', 'feature-grid', 'transformation-funnel'
  engine text NOT NULL CHECK (engine IN ('form', 'page')),
  category text NOT NULL,               -- 'layout', 'content', 'conversion', 'social-proof', 'smart'
  layer text NOT NULL CHECK (layer IN ('semantic', 'smart')),  -- L1 primitives não entram aqui
  vertical text NULL,                   -- 'fitness', 'yoga', 'languages', NULL = universal
  semantic_meaning text NOT NULL,       -- "Hero section with headline + CTA + media"
  default_props_schema_zod jsonb NOT NULL,  -- Schema Zod serializado (zod-to-json-schema)
  ai_hints jsonb NOT NULL DEFAULT '{}'::jsonb,  -- { when_to_use, examples[], anti_patterns[] }
  variants text[] NOT NULL DEFAULT '{}',  -- ['minimal', 'rich-media', 'video-first']
  composition jsonb NULL,               -- L3 smart blocks declaram composição de L2 blocks
  added_at timestamptz NOT NULL DEFAULT now(),
  deprecated_at timestamptz NULL
);

-- Read all roles (RLS minimal — catalog é universal, não tenant-scoped)
CREATE POLICY "block_kinds_select_all" ON public.block_kinds_catalog FOR SELECT USING (true);

-- Apenas platform_admin pode INSERT/UPDATE
CREATE POLICY "block_kinds_mutate_admin" ON public.block_kinds_catalog FOR ALL
USING (auth.jwt() ->> 'role' = 'platform_admin');
```

**Por que JIT, não dia 0:**

- Princípio "abstração nasce do 3º uso real" (`.claude/rules/abstractions.md`).
- Hoje (Fase 7 do pivot) temos 7 page blocks + ~8 form blocks **catalogados em Zod**, mas sem `ai_hints`, sem `variants`, sem composição declarada. Migration vai precisar backfill.
- Risco maior: criar table vazia, ninguém atualizar, fica órfã → bug "AI vê catálogo desatualizado, gera spec inválido".

**Gatilho concreto pra criar table:** 3 features distintas precisam ler catálogo dinamicamente (AI composer, builder UI, dev tool exporter). Hoje só AI composer pede → JIT espera.

### C.3 Alternativa minimalista (recomendada interim)

**Continuar com `pages.kind` enum + `block.type` discriminator + arquivos por kind.** AI hints viraram **JSDoc comments + frontmatter** em cada `lib/contracts/{form,page}-blocks/<kind>.ts`:

```ts
/**
 * @registry-meta
 * @category social-proof
 * @vertical universal
 * @when-to-use After hero + features, before pricing/CTA. 3-6 testimonials max.
 * @anti-patterns 1 testimonial only (use testimonial-single). Mixed avatars + no avatars.
 * @example { authorName, authorRole, quote, avatar, rating: 5 }
 */
export const TestimonialGridBlock = z.object({
  type: z.literal('testimonial-grid'),
  // ...
})
```

Build script `scripts/build-block-catalog.ts` extrai metadados → emit `lib/generated/block-catalog.json` (gitignored, regenerado em prebuild). AI composer consume JSON estático, não DB. Zero migration.

**Pivot pra DB table só quando:**

- Tenant precisa registrar smart blocks custom (futuro Fase 9+)
- Catálogo precisa ser hot-swappable em produção sem deploy
- Versionamento per-kind importa (catalog v1 vs v2 — Hotmart-like pro registry)

---

## D. Novel AI integration plan

### D.1 Feature-by-feature

| Feature                            | Novel cabe? | Onde mora                                  | Schema                                                                                     |
| ---------------------------------- | ----------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Program builder (módulos+aulas)    | ❌          | `programs` table (futuro Program Engine)   | Estrutural: `programs.kind`, `modules.spec_jsonb`, `lessons.kind`. Não-prose.              |
| Protocol builder (semanas+tarefas) | ❌          | `protocols` table (futuro)                 | Estrutural: weeks, tasks, schedule, habit_links. Não-prose.                                |
| **Lesson editor (texto+vídeo+IA)** | ✅          | `lessons.body_jsonb` (ProseMirror JSON)    | Novel exporta `editor.getJSON()` → JSONB. SSR via Tiptap Static Renderer (RSC-compatible). |
| **Journals / check-ins aluno**     | ✅          | `journals.entries_jsonb`                   | Mesma forma — ProseMirror JSON. Per-entry row, RLS tenant+client.                          |
| Page builder landing               | ❌          | Page Engine resolve                        | —                                                                                          |
| Form builder                       | ❌          | Form Engine resolve                        | —                                                                                          |
| Email templates                    | ❌          | Email Engine futuro (template+slots)       | —                                                                                          |
| **Chatbot system prompts admin**   | ⚠️ MAYBE    | `ai_prompt_versions.system_prose` opcional | Prose-dominante, mas admin-only baixa frequência. Custo > benefício?                       |

### D.2 Formato de storage — ProseMirror JSON (JSONB), não HTML

**Recomendação:** JSONB. Razões:

- Tiptap/Novel exporta `editor.getJSON()` direto, sem render-side roundtrip
- ProseMirror JSON é **schema-validable** (Zod per node-type opcional)
- Mutations via JSON Patch RFC 6902 (alinhado com research/24 EASE pattern, 31% menos tokens IA)
- Multi-tenant friendly: validação schema-level dropa XSS surface (Tiptap 3.0 added attribute validation)
- Postgres `jsonb` indexable se precisar

**HTML como output secundário** via `@tiptap/static-renderer` quando precisar:

- Email export (Email Engine futuro renderiza Lesson como HTML)
- SEO meta-description (extract text via `@tiptap/extension-text-utils`)
- PDF render (Satori via Vercel `next/og`)

### D.3 Multi-tenant + Novel + tenant-content rule

`.claude/rules/tenant-content.md` define 4 níveis. Novel persiste **L4 (block builder territory)** mas reframed:

- L3 = template + slots fixos (landing page) ← Page Engine
- L4 = block builder com drag-drop livre ← (não usar Novel — Page Engine roxo)
- **L5 NOVO (prose-dominante) = Novel** ← Lesson editor, journals

**Atualização da rule sugerida (não fazer agora):** adicionar Nível 5 "Prose com IA inline" → Novel + ProseMirror JSON em JSONB. RLS tenant+role.

### D.4 Dependências

| Lib                        | Versão estimada | LOC adicional                |
| -------------------------- | --------------- | ---------------------------- |
| `novel` (+ extensions)     | ^1.0+ (npm)     | 2-3 dev days install + adapt |
| `@tiptap/core`             | ^3.22.x         | já vem com novel             |
| `@tiptap/pm` (ProseMirror) | ^3.x            | já vem com novel             |
| `@tiptap/static-renderer`  | ^3.x            | SSR render (RSC OK)          |

**Custo de bundle:** ~120-160 KB gzip mínimo (Tiptap core + ProseMirror + StarterKit), pode chegar 250 KB com AI/Drag/Collab extensions. Aceitável **só em rotas autenticadas profissional/admin**. NÃO carregar em PWA aluno (Lesson view usa Static Renderer).

---

## E. AI orchestration — qual paradigma?

### E.1 Matriz das 3 opções

| Opção                         | Quando usa                                                   | Pros                                                           | Contras                                   |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------- |
| **(A) Structured Output Zod** | Gerar página/form inteiro (greenfield)                       | 1-shot, schema-validated, retry barato, prompt cache eficiente | Não consegue "edit" — só regenera tudo    |
| **(B) Tool calling**          | Edit incremental (Novel command palette, "fix this section") | Granularidade fina, agente raciocina passo-a-passo             | Mais turns = mais tokens; estado complexo |
| **(C) Híbrido**               | Cobertura completa                                           | Best of both: greenfield via (A), edits via (B)                | Complexidade arquitetural maior           |

### E.2 Recomendação: **OPÇÃO (C) HÍBRIDO**

**Configuração proposta:**

```ts
// lib/ai/page-builder.ts — greenfield (A)
const { object: spec } = await generateObject({
  model: 'anthropic/claude-sonnet-4-6',
  schema: PageSpec, // Zod, ADR-0041
  system: loadPagePromptTemplate(kind),
  prompt: `Profissional quer: ${userPrompt}\n\nCatálogo de blocks:\n${catalogJson}`,
  providerOptions: { gateway: { caching: 'auto' } },
})

// lib/ai/novel-inline.ts — edit incremental (B)
const tools = {
  insertBlock: tool({
    /* ... */
  }),
  rewriteSelection: tool({
    /* ... */
  }),
  continueText: tool({
    /* ... */
  }),
}
const result = streamText({
  model: 'openai/gpt-5-mini', // ou 'anthropic/claude-haiku-4-5' — TBD após benchmark
  tools,
  prompt: cursorContext,
})
```

### E.3 Modelo por task — proposta de policy

| Task                                          | Modelo (via AI Gateway)                               | Razão                                                     |
| --------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| **Router/classifier** (form vs page, kind?)   | `anthropic/claude-haiku-4-5`                          | Barato, rápido, structured output simples                 |
| **Form generation full**                      | `anthropic/claude-sonnet-4-6`                         | Lógica condicional, branching, Zod compliance             |
| **Page generation full**                      | `anthropic/claude-sonnet-4-6`                         | Composição complexa, vertical-aware                       |
| **Theme generation (TweakCN-way)**            | `google/gemini-2.5-flash`                             | Já cravado Fase 6 plano. Multimodal pra image-to-theme.   |
| **Novel inline (continue/rewrite/summarize)** | `openai/gpt-5-mini` _ou_ `anthropic/claude-haiku-4-5` | TBD benchmark Q3. Streaming + tool calling baixa latência |
| **Page edit (JSON Patch via EASE)**           | `anthropic/claude-haiku-4-5`                          | research/24 §11 — 31% menos tokens vs regenerate          |

Alinhado com `.claude/rules/forms-engine.md` pipeline IA + ADR-0041 chatPromptTemplate por engine.

---

## F. Migration path 3-stage

| Fase                                                                         | O que                                                                                                                                                          | Quando (sprints)         |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **MVP** (agora — Fase 1 negócio = agência opera)                             | Form Engine + Page Engine + AI inline gerando spec. 7 page blocks + 8 form blocks. AI hints em JSDoc, sem table.                                               | M0-M1 (atual)            |
| **Captura** (Fase 2 negócio = self-service profissional)                     | Identificar padrões repetidos pela IA → registrar variantes em block schemas (não tables). Build catalog JSON automático. Coletar telemetria "blocos usados".  | M2                       |
| **Registry real** (Fase 3 negócio = Pacote A cliente final + verticalização) | `block_kinds_catalog` table criada **só se** smart blocks vertical-specific chegarem. AI composer consume table dinamicamente. Tenant-custom blocks possíveis. | M3+ (gatilho específico) |

**Onde estamos hoje:** ainda no MVP. Form Engine building (ADR-0041) + Page Engine building. Sinais pra promover stage:

- **MVP → Captura:** quando 3+ tenants reais lançaram landing/form via IA. Sinal: telemetria "AI generated spec X vezes; profissional editou Y vezes; final shipped Z vezes". Padrão emerge dos edits manuais.
- **Captura → Registry real:** quando vertical 2 (yoga) entra E pede blocks específicos (`pranayama-timer`, `meditation-timeline`) OU primeiro smart block vertical-specific entra OR primeiro pedido de "tenant adiciona block próprio".

Princípio "mil passos à frente" (memory): planejar pra Registry real desde dia 0 **em formato** (JSDoc meta, schema declarativo, Zod), não em **estrutura SQL** (table dia 0).

---

## G. Vertical extension — fitness vs yoga vs idiomas

### G.1 3 opções

| Opção                                            | Como                                                                   | Pros                                | Contras                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------ |
| **(A) `block_kinds_catalog.vertical text NULL`** | Coluna vertical: NULL = universal, fitness/yoga/languages = específico | Simples, query-friendly             | Block "quase-igual" duplicado por vertical |
| **(B) Block kind polimórfico via props**         | `hero.props.vertical_overrides: { fitness: {...}, yoga: {...} }`       | Sem duplicação, hot-swap em runtime | Props inflate fast, validação cresce       |
| **(C) Registries separados por vertical**        | `block_kinds_catalog_fitness`, `_yoga`, `_languages`                   | Total isolation                     | Multiplica schemas, kills universal blocks |

### G.2 Recomendação: **HÍBRIDO (A) + (B)**

- **(A) pra L3 smart blocks vertical-specific:** `transformation-funnel` (fitness), `pranayama-flow` (yoga), `vocab-spaced-repetition` (idiomas). Coluna `vertical text NULL` no catalog (ou no JSDoc meta se ainda sem table).
- **(B) pra L2 semantic blocks com tweaks:** `hero`, `feature-grid`, `cta` continuam universais. Variantes vertical-aware vivem em `props.variant_hint` opcional consumida por copy/imagery (não por estrutura).

**Alinhamento existente:**

- `tenants.vertical` (CLAUDE.md) — já decidido
- `forms-engine.md`: `vertical: z.enum(['fitness', 'yoga', 'languages', 'coaching', 'nutrition', 'generic'])`
- ADR-0041: `forms.kind` polimórfico

### G.3 Copy + brand override por vertical (já cravado)

Vertical NÃO é só "block availability" — é também:

- Mensagens default (próxima ação, métricas exibidas, vocabulário UI) via `messages/<locale>/kinds.<vertical>.json`
- Theme tokens (cores típicas, fontes mood-match) via tenant theme aplicado
- Smart blocks acceptam props vertical-aware (`workoutType`, `posture`, `cefr_level`)

Registry **não duplica conteúdo brand/locale**. Só catalog structure.

---

## H. Open questions — 8 itens pra usuário cravar antes de ADR-0045

> Cada item = decisão sub-questão da reflexão original (`docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md` §5).
> Recomendação minha está marcada [REC] — usuário pode confirmar ou pivot.

1. **v0: out total OU demoted?** [REC: demoted — opção (2) Seção B]. Mantém endpoint `~/r/themes/[id]` shadcn-compatible mas v0 não roda em runtime. Workflow ideação humano-curado.

2. **`block_kinds_catalog` table dia 0 (vazia) OU JIT (3+ blocks pedirem)?** [REC: JIT — Seção C.3]. Migração orgânica via JSDoc meta + build script `lib/generated/block-catalog.json`. Table só quando 3 features distintas consumam.

3. **Novel adoption dia 0 OU JIT (3+ features prose-dominantes)?** [REC: JIT]. Cravar HOJE que Lesson editor + Journals usarão Novel (não inventar editor custom). Mas só instalar quando primeira feature prose entrar (Fase 3 negócio ou plan posterior). Custo bundle não justifica antes.

4. **AI orchestration: structured output puro, tool calling puro, ou híbrido?** [REC: híbrido (C) — Seção E.2]. `generateObject` pra páginas inteiras; tool calling pra edits incrementais Novel.

5. **Model policy por task — quem usa quê?** [REC: tabela Seção E.3]. Confirma Sonnet pra orquestração, Gemini Flash pra theme, Haiku pra classifier/edits.

6. **Vertical-specific blocks: extend catalog (A) ou polimórfico props (B) ou registries separados (C)?** [REC: híbrido A+B — Seção G.2]. L3 smart vertical-specific via `vertical text NULL`; L2 universal com `variant_hint`.

7. **Smart blocks: `pages.kind` polimórfico estende, ou tabela `smart_blocks` separada, ou composição de L2 declarada no catálogo?** [REC: composição declarada (b) — Seção A.2]. Smart block = composto declarado, renderer dispatcha. Tabela só se ganharem state server-side.

8. **L2 page blocks: ampliar pra ~30 do catálogo (research/24 §1.3) ou manter 7 MVP até feature pedir?** [REC: manter 7 MVP — princípio JIT]. Ampliação por demanda real do funil agência. Mapping já cravado pra evolução.

### Bonus opens (não-críticas pra ADR-0045 mas valem cravar quando entrarem)

9. **Tiptap collab (`y-tiptap` / Liveblocks) em Lesson editor multi-author?** [REC: NÃO até 2+ admins simultâneos virar dor]. LWW + ETag/409 resolve.

10. **Novel + theme override:** Novel renderiza com classes Tailwind. Confirmar via PoC que `<style precedence="theme">` aplica em Lesson view (deve aplicar — Tiptap usa classes shadcn).

11. **Tipos de mídia em Novel:** image-upload OK (Vercel Blob via storage engine). Video embed (YouTube/Vimeo) — adicionar custom extension? Ou só link?

---

## I. Conexão com plano pivot Fase 7

A reflexão `2026-05-21-ai-stack-registry-novel-reflection.md` já adicionou em pivot Fase 7:

- ✅ Estudo S7.5 — Registry strategy decisão (§ 1354-1383 do plano)
- ✅ ADR-0045 — Registry strategy a cravar
- ✅ Princípio cross-cutting (§ 1284 do plano) — todos blocks documentam registry-ready

**Este research (38) ALIMENTA esses estudos.** Sugestões pra Fase 7 do plano após user cravar opens da Seção H:

- Adicionar estudo **S7.6 — Novel adoption decision** (se Lesson editor entrar em escopo Pacote B/C)
- Mudar §1383 hipótese recomendada de "(c) registry restrito dia 0" para "(d) híbrido pragmático — JIT table, metadados JSDoc dia 0"
- Atualizar §1391-1394 trocar `v0_generation` por `theme_registry_export` (TweakCN-way export, não v0 runtime)

---

## J. Anti-patterns identificados (durante research)

| Anti-pattern                                                  | Por quê ruim                                                   | Substituto                                                   |
| ------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| Criar `block_kinds_catalog` vazio dia 0 "pra estar lá"        | Table órfã, ninguém atualiza, AI vê stale data                 | JSDoc meta + build script + table JIT 3+ consumers           |
| Persistir TSX raw em `tenant_pages.body_tsx`                  | XSS surface multi-tenant; theme drift; v0 adapter manutenção   | Page Engine spec JSONB (ADR-0041 D3)                         |
| Novel pra Program/Protocol builder                            | Estrutura não-prose; campos tipados; estado complexo           | Form Engine ou Program Engine futuro                         |
| Inventar wrapper `<AppNovelEditor>` antes do 1º consumer real | Wrapper especulativo (ADR-0040 §E)                             | JIT quando Lesson editor for construído                      |
| Registries separados por vertical dia 0                       | Multiplica schemas; kills cross-vertical reuse de L2 universal | Vertical column NULL = universal                             |
| Tool calling onde structured output basta                     | Mais turns, mais tokens, mais latência                         | `generateObject` schema Zod pra greenfield                   |
| Hardcoded "smart block X tem children Y" no renderer          | Quebra registry extensibility                                  | Composição declarada em catálogo (Seção A.2 opção b)         |
| Skip `safeParse` no output IA                                 | Schema inválido em produção                                    | Validar Zod + retry 3x + hard reject (já em forms-engine.md) |

---

## Referências

- ADR-0041 — Engine catalog + 2 motores + kind + scope
- ADR-0040 — Wrapper strategy + shadcn zone
- ADR-0024 — Multi-marca via hostname
- ADR-0044 — Pivot TweakCN-way
- `docs/blueprint/21-engine-catalog.md` — catálogo 22 engines
- `docs/blueprint/19-wrapper-strategy.md` — quando criar wrapper
- `docs/research/23-form-system-architecture.md` — Form Engine autoritativa
- `docs/research/24-page-engine-architecture.md` — Page Engine autoritativa
- `docs/research/11-editor-strategy.md` — Tiptap/Novel/Plate/Lexical avaliados
- `docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md` — origem desta research
- `docs/plans/pivot-tweakcn.md` § Fase 7 — onde ADR-0045 vai cravar
- `.claude/rules/forms-engine.md` — pipeline IA já cravado
- `.claude/rules/tenant-content.md` — hierarquia 4 níveis (proposta L5 prose)
- Memória `feedback_mil_passos_a_frente.md` — Catalog+Registry+Spec, nada hardcoded
- Novel — https://novel.sh / github.com/steven-tey/novel (Tiptap + Vercel AI SDK + ProseMirror JSON)
- shadcn registry — https://ui.shadcn.com/docs/registry (registry.json + registry-item.json schemas)
- Vercel AI SDK — `generateObject`, `streamText`, tool calling, providerOptions.gateway

---

## Anexo — Schema `registry-item.json` shadcn (referência pra Seção I)

Quando exportarmos themes/blocks pra shadcn registry (Fase 7 plano pivot §1300):

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "tenant-{slug}-theme-v{n}",
  "type": "registry:theme",
  "title": "{Tenant Display Name} Theme",
  "description": "OKLCH-primary theme exported from desafit.app",
  "cssVars": {
    "theme": { "font-sans": "...", "font-serif": "...", "font-mono": "..." },
    "light": { "background": "oklch(...)", "foreground": "oklch(...)", "...": "..." },
    "dark": { "background": "oklch(...)", "foreground": "oklch(...)", "...": "..." }
  }
}
```

Endpoint adapt: `tweakcn-ref/app/r/themes/[id]/route.ts` → `/api/r/themes/[tenantId]/v{n}` com RLS check `tenant_id === auth.jwt() ->> 'tenant_id'` OR public read se theme published.

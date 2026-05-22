# 0045. Registry Strategy + AI Orchestration + Novel Adoption

Date: 2026-05-21
Status: accepted
Última atualização: 2026-05-21 (research-44 validou via 20 players, research-45 cravou component strategy)

## Context

Fase 7 do pivot TweakCN (ADR-0044) reserva schema `tenant_pages` +
`tenant_blocks` pra composição de páginas via IA. Mas antes de executar a
migration, três perguntas interligadas precisavam de resposta: (1) como a
plataforma distribui e versiona blocks de UI, (2) qual paradigma de IA
orquestra a geração de páginas e formulários, e (3) onde Novel (editor
rich-text AI-native) encaixa — ou se encaixa — no produto.

O acúmulo de 23+ open questions (research-38 H.1-H.11 + research-40
G.1-G.8 + 4 bloqueadores de research-41) tornou inviável o modelo Q&A
one-a-one. Este ADR resolve em batch, usando as três pesquisas como insumo
autoritativo e as recomendações cravadas nelas como ponto de partida.

Pré-leitura obrigatória: `docs/research/38-registry-novel-ai-integration.md`,
`docs/research/40-shadcn-registry-deep-dive.md`,
`docs/research/41-audit-tweakcn-fases-5-6-7.md`.

---

## Decision

### 1. v0 — demoted (não OUT total)

v0 é ferramenta de **ideação dev-only**, não entra em runtime da plataforma.
O endpoint `/api/r/themes/[tenantId]/v0` é gerado opcionalmente (entitlement
`theme_export`) quando tenant quer um starter project v0-compatible — mas o
código gerado não é persistido nem renderizado em multi-tenant.

**Razões:** v0 emite TSX com classes Tailwind hardcoded (ex: `bg-zinc-900`)
que não compõe com `<style precedence="theme">` CSS vars runtime. Persistir
TSX raw em banco é XSS surface em contexto multi-tenant. Adapter TSX→spec
tem custo de manutenção ilimitado a cada versão v0.

**Workflow curadoria:** v0 gera inspiração visual → admin avalia manualmente
→ registra como block kind novo em `lib/contracts/page-blocks/<kind>.ts`.
Curadoria humana é obrigatória; v0 não gera blocks diretamente.

**Trade-offs:**

- Positivo: zero XSS surface; adapter de manutenção infinita descartado;
  endpoint `~/r/themes/[id]` shadcn-compatible preservado.
- Negativo: perde geração rápida de UI em runtime; workflow de curadoria
  exige trabalho manual.

---

### 2. `block_kinds_catalog` table — JIT (não dia 0)

Não criar tabela `block_kinds_catalog` antecipadamente. Interim: metadados de
blocks via JSDoc `@registry-meta` em cada `lib/contracts/{form,page}-blocks/<kind>.ts`.
Build script `scripts/build-block-catalog.ts` extrai esses metadados em
`lib/generated/block-catalog.json` (gitignored, regenerado em prebuild). AI
composer consome o JSON estático.

**Gatilho concreto para criar a tabela:** 3 features distintas precisam ler o
catálogo dinamicamente em runtime (veja Decisão 3).

**Razões:** princípio "abstração nasce do 3º uso real" (`.claude/rules/abstractions.md`).
Criar tabela vazia antes do tempo = catálogo desatualizado em produção = IA
gerando specs inválidos. JSDoc meta é mais próximo do código-fonte e menos
sujeito a drift.

**Trade-offs:**

- Positivo: zero migration prematura; catálogo sempre em sincronia com código;
  AI hints próximos do contrato Zod.
- Negativo: hot-swap de catálogo sem deploy requer tabela; tenant custom blocks
  (Fase 9+) precisarão da tabela de qualquer forma.

---

### 3. Trigger concreto para "3 consumers" — definição oficial

As 3 features que qualificam para promover JSDoc → `block_kinds_catalog` table:

| #   | Feature                                                                                   | Fase do produto |
| --- | ----------------------------------------------------------------------------------------- | --------------- |
| 1   | **AI composer** — lê catálogo pra emitir `PageSpec` validado                              | Fase 6 (pivot)  |
| 2   | **Builder UI** — exibe catálogo visual pra profissional montar página                     | Fase 5 (pivot)  |
| 3   | **Dev tool exporter / preview tool** — CLI `shadcn add @platform/<block>` + MCP discovery | Fase 7 (pivot)  |

Quando as 3 existirem em produção simultaneamente, a migration da tabela é
executada com backfill de `ai_hints`, `variants`, `composition` dos contratos
Zod existentes.

**Razões:** especificar os 3 consumers evita interpretação ambígua do princípio
JIT; o gatilho vira condição mensurável, não julgamento subjetivo.

---

### 4. Novel — ADOPT NOW (stack decision) + INSTALL JIT

Novel (https://novel.sh — Tiptap + Vercel AI SDK, ProseMirror JSON) é
adotado como **decisão de stack hoje**: Lesson editor, Journals/check-ins e
(opcionalmente) editor de system prompts admin usarão Novel quando
construídos. A instalação do pacote só ocorre quando a primeira feature
prose-dominante entrar em escopo executável.

Features prose-dominantes confirmadas: Lesson editor (`lessons.body_jsonb`
ProseMirror JSON) e Journals (`journals.entries_jsonb`). Features estruturais
(Program builder, Protocol builder, Landing pages, Forms) NÃO usam Novel —
resolvidas por Form Engine e Page Engine (ADR-0041).

Storage: `editor.getJSON()` → JSONB (não HTML). SSR via `@tiptap/static-renderer`
(RSC-compatible). Bundle (~160-250 KB gzip) carregado **somente em rotas
autenticadas profissional/admin** — jamais no PWA do aluno.

**Razões:** cravar HOJE evita que Claude futuro invente editor custom redundante.
Instalar JIT evita bundle overhead antes do consumer existir.

**Trade-offs:**

- Positivo: experiência Notion AI para profissional; AI inline (continue,
  summarize, rewrite) sem implementação custom.
- Negativo: bundle pesado confinado a rotas admin; Tiptap collab
  (`y-tiptap`) não incluído até 2+ admins simultâneos virarem dor real (LWW
  - ETag/409 resolve até lá).

---

### 5. AI orchestration — híbrido (generateObject + tool calling)

- **Greenfield (páginas/formulários inteiros):** `generateObject` com schema
  `PageSpec` ou `FormDefinition` Zod. Um turn, validação automática, retry
  barato via `safeParse` + 3 tentativas, prompt cache eficiente.
- **Edits incrementais (Novel inline commands, JSON Patch via EASE):**
  `streamText` com tool calling. Granularidade fina — model raciocina
  passo-a-passo sem regenerar spec inteiro. 31% menos tokens vs regenerate
  (research-24 §11).

Validação Zod obrigatória em ambos os paradigmas. Em caso de falha:
`safeParse` + retry 3x + rejeição hard com mensagem de erro estruturada.

**Razões:** structured output puro não consegue "editar" — só regenera tudo.
Tool calling puro em greenfield é desnecessariamente custoso (tokens + turns).
Híbrido cobre cobertura completa sem overhead.

**Trade-offs:**

- Positivo: melhor custo/performance por task; alinhado com `forms-engine.md`
  pipeline IA + ADR-0041 chatPromptTemplate por engine.
- Negativo: complexidade arquitetural maior; dois paradigmas a manter.

---

### 6. Model policy por task — tabela oficial

| Task                                      | Modelo (via AI Gateway)                             | Razão                                                     |
| ----------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| Router/classifier (form vs page, kind?)   | `anthropic/claude-haiku-4-5`                        | Barato, rápido, structured output simples                 |
| Form generation full                      | `anthropic/claude-sonnet-4-6`                       | Lógica condicional, branching, Zod compliance             |
| Page generation full                      | `anthropic/claude-sonnet-4-6`                       | Composição complexa, vertical-aware                       |
| Theme generation (TweakCN-way)            | `google/gemini-2.5-flash`                           | Multimodal pra image-to-theme; já cravado Fase 6 plano    |
| Novel inline (continue/rewrite/summarize) | `openai/gpt-5-mini` OR `anthropic/claude-haiku-4-5` | TBD benchmark Q3; streaming + tool calling baixa latência |
| Page edit incremental (JSON Patch EASE)   | `anthropic/claude-haiku-4-5`                        | 31% menos tokens vs regenerate (research-24)              |

**Nota:** `google/gemini-3-flash-preview` referenciado no TweakCN como modelo
de theme generation pode não estar disponível no Vercel AI Gateway. Fallback
oficial: `google/gemini-2.5-flash` para ambas as funções (base chat + theme
generation). Confirmar disponibilidade em `AI_GATEWAY_*` env vars antes da
Fase 6.

**Trade-offs:**

- Positivo: custo otimizado por task; Haiku pra tarefas simples, Sonnet pra
  raciocínio complexo.
- Negativo: política a revisar quando novos modelos forem lançados.

---

### 7. Vertical extension — híbrido coluna + variant_hint

- **L3 smart blocks vertical-specific:** coluna `vertical text NULL` no catalog
  (ou no JSDoc `@vertical` antes da tabela existir). `NULL` = universal. Valores:
  `'fitness'`, `'yoga'`, `'languages'`. Ex: `transformation-funnel` é
  `vertical = 'fitness'`; `pranayama-flow` será `vertical = 'yoga'`.
- **L2 semantic blocks universais:** `hero`, `feature-grid`, `cta` permanecem
  universais. Tweaks verticais vivem em `props.variant_hint` opcional (consumido
  por copy/imagery, não por estrutura de dados).

Copy/brand override por vertical vive em `messages/<locale>/kinds.<vertical>.json`,
não no catálogo. Catálogo só registra estrutura, não conteúdo brand/locale.

**Razões:** evita duplicação de blocks "quase-iguais" por vertical (opção
registries separados descartada); evita props inflate de validação crescente
(opção polimórfico puro descartada). Híbrido dá o melhor dos dois mundos.

**Trade-offs:**

- Positivo: L2 reutilizados por todas as verticais; L3 isolados claramente por
  vertical.
- Negativo: block "quase-igual" entre verticais (ex: `transformation-funnel`
  fitness vs `pranayama-flow` yoga) podem compartilhar 80% do código — extrair
  base compartilhada JIT quando surgir.

---

### 8. Smart blocks storage — composição declarada (não tabela separada)

Smart blocks são `type='transformation-funnel'` no catálogo com campo
`composition: ['hero-block', 'evidence-grid', 'testimonial-grid', 'cta-block']`
declarado no JSDoc `@composition`. Renderer do Page Engine despacha pelo `type`
e busca composição do catálogo (JSON estático). Sem tabela `smart_blocks`
separada.

Migração para tabela própria só se smart blocks ganharem **estado server-side**
(analytics, automações, IA workflow embutido) que não cabe em props estáticos.
Gatilho: primeiro smart block que precisar de row própria em DB (ex: tracking
de progresso per-aluno dentro de um smart block).

**Razões:** tabela separada prematura = entidade nova sem consumer; composição
declarada no catálogo é mais simples e não adiciona roundtrip de banco.

**Refinamento pós research-44 (opcional):** ai-chatbot Artifacts é pattern primo
(polymorphic kind dispatch + Suggestion text diff), não espelhado. Nosso Smart
blocks é tree JSONB recursivo + JSON Patch EASE. Pattern inspira
`createDocumentHandler<T>()` factory pattern + tool layer pra Fase 6/7 (adapta
pra `createBlockHandler<T>()` quando 3+ kinds existirem). Não muda decisão
estrutural — apenas atualiza justificativa (era "ai-chatbot pattern similar a
Smart blocks composição" overstatement; veredito accurate é "ai-chatbot pattern
similar a polymorphic kind dispatch + tool calling versioning").

**Trade-offs:**

- Positivo: zero migration nova; composição declarativa é auditável em code
  review.
- Negativo: composições circulares precisam ser prevenidas via lint (L3 não
  pode declarar outro L3 em `@composition`).

---

### 9. L2 page blocks dia 0 — 7 MVP

7 blocks para Fase 7 (não ampliar para os ~30 do catálogo sem demanda real):

`hero` · `cta` · `faq` · `pricing` · `testimonial` · `social-proof` · `footer`

Ampliação por demanda do funil agência (Fase 1 negócio). Cada novo block
requer: contrato Zod + componente React + story Storybook + JSDoc `@registry-meta`
completo. Mapeamento pra expansão futura (research-38 H.8) preservado como
referência.

**Razões:** princípio JIT; 7 blocks cobrem landing de agência Fase 1 sem
over-engineering; catálogo de 30 antes da demanda = manutenção sem retorno.

---

### 10. Registry hosting — plataforma única

Registry plataforma em `/api/r/[name].json` (route handler Next.js dinâmico,
entitlement gate via RPC ADR-0039). Endpoint de temas exportados em
`/api/r/themes/[tenantId]` — CORS aberto (`Access-Control-Allow-Origin: *`),
sem auth (ou query token opcional). Payload validado via
`registryItemSchema.safeParse()` do pacote `shadcn/schema` antes de retornar —
padrão direto de `tweakcn-ref/app/r/themes/[id]/route.ts`.

Per-tenant registry adiado para Fase 9+ (só quando tenant puder criar custom
blocks próprios). Blocos são código da plataforma — tenant seleciona/configura,
não cria.

**Razões:** um registry, todos os tenants; blocks L1/L2 são universais (mesmo
código, diferente theme via CSS vars); per-tenant seria mesmos blocks servidos
N vezes com invalidação de cache por tenant.

**Trade-offs:**

- Positivo: cache centralizado; blocks universais servidos de um lugar; sem
  complexidade de isolamento por tenant.
- Negativo: um tenant autenticado pode tentar adivinhar nomes de blocks de
  outros planos — mitigado via entitlement gate no route handler.

---

### 11. Namespaces — 3 fixos

| Namespace   | Conteúdo                                                                   | Regra                                                 |
| ----------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| `@shadcn`   | L1 primitives (Button, Card, Input, etc.)                                  | Imutável — não tocar. Instalados via `npx shadcn add` |
| `@platform` | L2 semantic blocks + L3 smart universais (cross-vertical)                  | Cresce primeiro; blocos universal sempre aqui         |
| `@desafit`  | L3 smart vertical-fitness + temas exportados (`tenant-desafit-theme-v{n}`) | Específico fitness + exports                          |

Quando `yoga.app` entrar: namespace `@yoga` adicional. `@platform` sempre
cresce antes de criar namespace vertical.

Configuração em `components.json.registries` — namespace `@platform` adicionado
JIT quando primeiro block plataforma for instalável via CLI (Fase 7).

**Trade-offs:**

- Positivo: separação clara universal vs vertical; sem namespace monolítico que
  mistura tudo.
- Negativo: N namespaces a manter conforme verticais crescem.

---

### 12. Composition rules — dependência só desce, nunca sobe

| Camada                         | Pode importar                                           |
| ------------------------------ | ------------------------------------------------------- |
| L1 (`@shadcn`)                 | Apenas npm packages (Radix, etc.)                       |
| L2 (`@platform`)               | L1 via `registryDependencies: ["@shadcn/button"]` + npm |
| L3 (`@platform` ou `@desafit`) | L2 do mesmo ou outro namespace + L1 + npm               |

**Proibido:** L3 importando outro L3 (composições circulares). L2 importando
L3 (dependência sobe). A âncora `registryDependencies` no `registry-item.json`
deve espelhar o campo `@composition` no JSDoc — os dois mantidos em sincronia.

**Razões:** mesma lógica das camadas `lib/` (dependência desce, nunca sobe,
`.claude/rules/layers.md`). Proibir L3→L3 elimina composições circulares.

---

### 13. `pages.kind` === `registry-item.name` invariante arquitetural

O `type` de um block no `PageSpec` JSONB deve ser **idêntico** ao `name` no
`registry-item.json`. Sem alias, sem mapeamento intermediário.

A âncora `type/name/kind` conecta:

1. `PageSpec.type` → renderer React (`components/blocks/<type>.tsx`)
2. `registry-item.name` → `npx shadcn add @platform/<name>`
3. `lib/contracts/page-blocks/<kind>.ts` → Zod schema validation
4. `block_kinds_catalog.kind` (quando table existir) → AI hints, variants
5. `pages.kind` em DB → engine dispatch

Documentar em `.claude/rules/registry-blocks.md` (Fase 7, governança §15.3).

**Trade-offs:**

- Positivo: sistema sem mapeamento = menos bugs de sincronização; IA emite
  spec com `type` que o renderer já sabe resolver.
- Negativo: renomear um block kind é breaking change em 5 lugares
  simultaneamente — usar versionamento URL segment (`/api/r/v2/<name>`).

---

### 14. Versionamento — JIT

- **Temas:** sufixo `v{n}` no nome (`tenant-desafit-theme-v2`). Padrão direto
  de `tweakcn-ref/utils/registry/themes.ts`.
- **Blocks:** `/api/r/[name].json` sem version enquanto breaking changes não
  ocorrem. Quando ocorrerem: URL segment `/api/r/v2/[name].json` (route
  handler versionado). Infra de versioning não criada antes do primeiro
  breaking change.

**Razões:** versionamento nativo não existe no schema `registry-item.json`;
implementar antes do primeiro breaking change é especulação. JIT mantém
sistema simples até a necessidade ser real.

---

### 15. Registry type para temas — `registry:style` (não `registry:theme`)

Endpoint `/api/r/themes/[tenantId]` retorna `type: "registry:style"`, não
`type: "registry:theme"`.

\*\*Confirmado via auditoria direta de `tweakcn-ref/app/r/themes/[id]/route.ts`

- `tweakcn-ref/utils/registry/themes.ts`:\*\* TweakCN usa `registry:style` com
  bloco `css: { "@layer base": { body: { "letter-spacing": "var(--tracking-normal)" } } }`.
  O CLI `shadcn add` trata `registry:style` aplicando tanto `cssVars` (`:root` +
  `.dark`) quanto `css` blocks em `globals.css`. `registry:theme` aplicaria
  apenas `cssVars` sem o bloco `@layer base`.

**Trade-offs:**

- Positivo: compatibilidade máxima com `shadcn add`; sem quirks de parsing
  diferente.
- Negativo: `css` block `@layer base` é obrigatório no payload; validar que
  nosso `generateThemeRegistryItemFromStyles` sempre inclui.

---

### 16. Gemini 3 Flash Preview — fallback oficial

`google/gemini-3-flash-preview` pode estar indisponível no Vercel AI Gateway
(preview gate). Fallback oficial: **`google/gemini-2.5-flash`** para ambas as
funções do pipeline TweakCN (modelo base + modelo theme-generation). A
diferença de qualidade é aceitável para MVP.

Confirmar disponibilidade via env vars `AI_GATEWAY_*` antes do início da Fase 6.
Atualizar tabela de model policy (Decisão 6) se `gemini-3-flash-preview` ficar
disponível em produção.

**Razões:** não bloquear Fase 6 por indisponibilidade de modelo em preview;
`gemini-2.5-flash` já provado em TweakCN como modelo base.

---

### 17. APCA gate pós-output AI — soft warn + botão

Gate APCA após geração de tema via IA é **client-side, não re-prompt
automático**. Flow:

1. `streamObject` completa → `safeParse` Zod.
2. Se passou Zod: verifica pares críticos de contraste (body Lc ≥75, large
   Lc ≥60) via `lib/design/contrast.ts` (`apca()`).
3. Se APCA falhar: **mostrar aviso visual** + botão "Tentar com mais contraste"
   (não re-prompt silencioso automático).
4. Botão aciona novo prompt com constraint explícita: `"Os pares de contraste
não atingiram APCA Silver. Gere novamente priorizando foreground/background
com Lc ≥75."`.

**Razões:** re-prompt automático consome turns do `stopWhen: stepCountIs(5)`
(limite TweakCN); UI opaca onde a IA "tenta de novo" invisível confunde o
profissional. Decisão alinhada com research-37 F.5 já decidido.

**Trade-offs:**

- Positivo: UX transparente; profissional decide se quer tentar de novo;
  conserva turns do multi-step.
- Negativo: profissional vê aviso de contraste — pode gerar atrito se
  frequente; mitigado via sistema prompt que já instrui APCA compliance.

---

## Validation 2026-05-21

Pós-promoção draft→accepted, duas pesquisas autoritativas cruzaram esta ADR
sem revelar mudanças estruturais necessárias.

**Research-44 (real players integration patterns)** — auditou 10 course/community
platforms + 11 AI-native builders pra validar a composição:

- **GoHighLevel valida o modelo white-label agency multi-tenant em escala
  bilhão hits/dia** (hierarchical agency → sub-accounts isoladas, branding total
  per-agency, AI funnel builder, drag-drop page editor). Modelo "Fase 1 agência"
  do nosso plano tem precedent em produção massiva.
- **Tiptap em produção massiva** (LinkedIn, GitLab, Anthropic, Substack, AxiosHQ,
  NYT via ProseMirror; GitLab roda Tiptap em SaaS multi-tenant production; SOC2
  Type II compliant). Decisão D.4 (Novel ADOPT NOW + INSTALL JIT) blindada por
  precedent enterprise — Tiptap underneath está testado em escala.
- **shadcn registry production validado via MakerKit + Supastarter** (plugin
  distribution via shadcn registry format + AST codemods). Decisão D.10
  (`/api/r/[name].json` route handler) alinhada com practice estabelecida.
- **AI orchestration híbrida confirmada como state-of-the-art** (Lovable
  hydration: fast model contexto + big model gera; Replit Agent 3 multi-agent
  manager+editor+verifier Python DSL 90% sucesso; Vercel AI Chatbot Artifacts
  tool calling + polymorphic kind dispatch). Decisão D.5 (`generateObject`
  greenfield + `streamText+toolCalling` edits) alinhada com convergência do
  ecossistema.
- **Stack canônica course platforms = ADR-0024** (subdomain + custom domain +
  tenant_id column). Kajabi, Mighty Networks, Circle.so, Teachable, Thinkific
  unanimemente usam esse pattern. Nossa abordagem hostname → DB lookup é a
  canônica da categoria.
- **80% cobertura via precedents proven; 20% novel mas com base sólida.** Cada
  peça isolada (Next 16, Supabase RLS, shadcn, Tiptap, AI Gateway, multi-tenant
  hostname) está em produção massiva. A combinação completa (8+ peças
  simultâneas) é first-of-kind, mas o risco está na integration, não nas peças.

**Research-45 (component strategy best practices)** — cravou execução pragmática
das decisões D.10-D.13:

- Arsenal curado de **20 primitives** (não JIT puro, não arsenal completo) cobre
  95% dos patterns previsíveis. Bundle impact = zero (shadcn copia código local
  - Next.js 16 tree-shaking).
- Folder structure: `components/blocks/*` (não `components/sections/*`) — espelha
  invariante D.13 (`pages.kind === registry-item.name === components/blocks/{kind}.tsx`).
- AI catalog discoverability: JSDoc `@registry-meta` em `lib/contracts/page-blocks/*`
  → build script → `lib/generated/block-catalog.json` (gitignored, regen em
  prebuild). Cumpre D.2 (JSDoc interim antes da tabela).
- 3 JIT exceptions confirmadas por bundle impact real: `chart` (recharts ~250
  KB), `calendar` (react-day-picker ~45 KB), `carousel` (embla ~25 KB).

**Veredito:** todas as 17 decisões mantêm estrutura. D.8 ganhou refinamento
opcional (já refletido acima). ADR promove status draft → accepted sem ajustes.

---

## Consequences

### Positivas

- **Sem migration prematura:** `block_kinds_catalog` table só quando 3
  consumers simultâneos — zero tabela órfã.
- **v0 isolado de runtime:** XSS surface eliminada; adapter TSX→spec
  descartado; endpoint de export mantido pra developers.
- **Âncora `type/name/kind` única:** sistema sem mapeamento reduz bugs de
  sincronização entre spec JSONB, renderer React, CLI install e AI catalog.
- **Novel como stack decision cravada:** Claude futuro não re-inventa editor
  custom pra features prose; instala Novel JIT quando consumer existir.
- **`registry:style` confirmado via SSOT:** sem divergência de formato com
  TweakCN; `shadcn add` funciona out-of-box.
- **Model policy tabular:** custo de AI otimizado por task; Haiku pra
  classificação, Sonnet pra composição, Gemini pra temas.
- **APCA gate transparente:** profissional não vê "caixa preta" de re-prompt;
  mantém turns disponíveis pra geração principal.

### Negativas

- **Curadoria manual de v0:** workflow ideação→curadoria→block kind exige
  trabalho humano; não é push-button.
- **JSDoc `@registry-meta` tem drift risk:** se desenvolvedor esquecer de
  atualizar ao mudar schema Zod, JSON gerado pelo build script fica stale.
  Mitigação: script `pnpm token:audit` verifica paridade.
- **Hybrid AI paradigm complexity:** dois paradigmas (generateObject +
  tool calling) a manter em `lib/ai/`; documentar fronteira claramente.
- **Gemini 3 Flash Preview incerteza:** policy de modelo sujeita a revisão
  até confirmação de disponibilidade no AI Gateway.
- **L3→L3 ban requer enforcement:** lint ou review manual pra garantir que
  composições de smart blocks não incluem outros smart blocks.

### Princípios cravados

1. **JIT antes de upfront** — tabelas, endpoints, versioning e instalação de
   pacotes só quando consumer real existe (Decisões 2, 4, 14).
2. **Âncora única sem alias** — `pages.kind === registry-item.name === block.type`
   em toda a stack (Decisão 13).
3. **Dependência só desce** — L1←npm, L2←L1, L3←L2; nunca L3←L3 (Decisão 12).
4. **`registry:style` é o formato canônico** para temas exportados — validado
   contra SSOT TweakCN (Decisão 15).
5. **Curadoria humana obrigatória** no workflow v0 → block kind (Decisão 1).
6. **APCA gate é UX, não pipeline** — soft warn client-side, não re-prompt
   silencioso automático (Decisão 17).

---

## Open questions (status: não decididas — cravar quando trigger existir)

1. **Tiptap collab (`y-tiptap` / Liveblocks)** — collaborative editing em
   Lesson editor multi-author. Não implementar até 2+ admins simultâneos
   virarem dor documentada. LWW + ETag/409 resolve até lá.
   Arquivo de referência: `docs/research/38-registry-novel-ai-integration.md` §H.9.

2. **Novel + `<style precedence="theme">` PoC** — confirmar via PoC que
   Tiptap renderiza com CSS vars corretas em Lesson view (deve funcionar —
   Tiptap usa classes shadcn). Executar antes de instalar Novel em produção.
   Arquivo de referência: research-38 §H.10.

3. **Tipos de mídia em Novel** — video embed (YouTube/Vimeo): extensão
   Tiptap custom vs link apenas. Image upload: Vercel Blob via storage
   engine (já usa base64). Decidir quando Lesson editor entrar em escopo.
   Arquivo de referência: research-38 §H.11.

4. **Contador concreto para promoção JSDoc → `block_kinds_catalog` table** —
   "3 consumers simultâneos" definido na Decisão 3, mas o threshold de "quando
   Builder UI e Dev tool exporter estão prontos" precisa de milestone formal
   no `docs/plans/pivot-tweakcn.md`. Cravar como gate de Fase 7 ou início
   de Fase 8.

---

## Referências

- `docs/research/38-registry-novel-ai-integration.md` — Registry + Novel + AI
  orchestration (H.1-H.11 + Seções A-J)
- `docs/research/40-shadcn-registry-deep-dive.md` — Private registry, namespaces,
  composition, auth flow (G.1-G.8 + Seções A-G)
- `docs/research/41-audit-tweakcn-fases-5-6-7.md` — Audit Fase 5/6/7 TweakCN
  (bloqueadores + sequenciamento)
- `docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md` — origem
  da reflexão (3-stage migration + registry vs v0 vs templates)
- ADR-0041 — Engine catalog 2 motores (Form + Page), kind polimórfico, scope
- ADR-0044 — Pivot TweakCN-way + shadcn-canonical (referência de formato)
- ADR-0039 — Entitlements RPCs (`requireEntitlement`, `requireQuota`)
- ADR-0024 — Multi-brand via hostname (contexto multi-tenant)
- `docs/plans/pivot-tweakcn.md` § 17 Open questions ativas
- `C:\Users\leean\Desktop\tweakcn-ref\app\r\themes\[id]\route.ts` — SSOT
  `registry:style` pattern confirmado (commit `9adabcf9`)
- `C:\Users\leean\Desktop\tweakcn-ref\utils\registry\themes.ts` — geração
  payload + shadow expand + OKLCH conversion
- `.claude/rules/forms-engine.md` — pipeline IA Form Engine
- `.claude/rules/abstractions.md` — princípio "abstração nasce do 3º uso"
- `.claude/rules/layers.md` — dependência desce, nunca sobe
- Novel — https://novel.sh / https://github.com/steven-tey/novel
- shadcn registry schema — https://ui.shadcn.com/schema/registry-item.json
- Vercel AI SDK — `generateObject`, `streamText`, tool calling

# 45. Component Strategy — Best Practices, Install Timing, Organização e AI Catalog

> **Tipo:** research autoritativa (input para execução Fase 5 + ADR-0045 governance §15)
> **Status:** completo
> **Data:** 2026-05-21
> **Disparado por:** pivot-tweakcn.md Fase 5 — lista de primitives a instalar ainda não mapeada
> **Stack TRAVADO:** Next.js 16 + React 19 + Tailwind v4 + shadcn new-york dark-first
> **Pré-leitura:** ADR-0044, ADR-0045 draft, research-38, research-40, `.claude/rules/shadcn-zone.md`
> **SSOT externas consultadas:** tweakcn-ref, next-forge-ref, ai-chatbot-ref, vercel-saas-ref, vercel-platforms-ref + WebFetch shadcn docs

---

## Sumário executivo

1. **Veredito JIT vs arsenal: arsenal curado (20 primitives) instala-se dia 0 da Fase 5.** O argumento bundle não resiste à análise de tree-shaking real — shadcn copia código local, não adiciona runtime overhead. O custo de JIT puro é alto: cognitive load ("será que tenho Button?"), IA sem base para compor, time-to-feature de 2-3min por primitive. Arsenal curado de ~20 primitives elimina esse fricção sem side-effects.

2. **Essential primitives: 20 primitives formam a base mínima.** Qualificação via: aparece em 3+ templates/boilerplates de referência (next-forge ✅ 52, ai-chatbot ✅ 22, tweakcn ✅ 46, vercel-saas ✅ 6) + requerido por shadcn blocks oficiais + requerido por Form Engine ou Page Engine (ADR-0041).

3. **Folder structure: 5 camadas** — `components/ui/*` (quarentena) → `components/app-*.tsx` (wrappers) → `features/*/components/` (feature-scoped) → `components/blocks/*.tsx` (L2/L3 blocks, Page Engine) → `components/vendor/*` (third-party copy-paste JIT).

4. **Catalog discoverability: JSDoc `@registry-meta` + build script → `lib/generated/block-catalog.json`.** MCP `shadcn@latest mcp` cobre primitives L1 (já configurado). Catálogo de blocks L2/L3 é JSON local consumido por AI composer via server action. Zero DB antes de 3 consumers.

5. **Surpresas/findings:** (a) next-forge instala 52 primitives upfront em monorepo compartilhado — trata como `@repo/design-system` pacote interno, não como `components/ui/` copiado; (b) shadcn CLI tem `--all` flag mas zero boilerplate sério usa — confirma arsenal curado > upfront completo; (c) ai-chatbot usa apenas 22 primitives mesmo sendo produto Vercel com AI pesado — valida que arsenais menores são suficientes.

---

## A. Trade-off JIT vs Arsenal

### A.1 Definições

**JIT puro:** instalar cada primitive somente quando uma feature concreta o pedir. Ex: primeira feature usa `Button` → `pnpm dlx shadcn add button`. `Card` só entra quando segunda feature pedir.

**Arsenal upfront completo:** instalar os ~46 primitives shadcn de uma vez via `pnpm dlx shadcn add --all`. Filosofia "tudo disponível desde dia 0".

**Arsenal curado (recomendado):** instalar um subconjunto predeterminado de ~20 primitives que cobrem 90% dos patterns previsíveis na plataforma. Restante entra JIT quando feature pedir.

### A.2 Bundle impact: por que o argumento bundle não segura JIT puro

**Shadcn não funciona como biblioteca npm.** O CLI copia o código-fonte do componente diretamente para `components/ui/` — arquivos `.tsx` locais. Não há dependência de runtime do shadcn em si. O bundle overhead de um componente shadcn instalado é zero se não for importado em nenhum arquivo.

**Tree-shaking e code splitting do Next.js 16 aplicam normalmente:**

- Um `Button` em `components/ui/button.tsx` que zero páginas importam = zero bytes no bundle de produção
- Next.js 16 com Turbopack faz code splitting por rota — componente em rota não visitada não polui bundle de rota visitada
- Tailwind v4 com PostCSS elimina classes CSS não utilizadas via purge automático

**Conclusão bundle:** 50 components shadcn ociosos em `components/ui/` = zero KB extra em produção. O argumento "bundle impacto" justifica JIT apenas para dependências npm pesadas (ex: `recharts` via `chart.tsx`) — não para o código `.tsx` do componente em si.

**Dependências npm que SIM impactam bundle** (precisam de JIT cuidadoso):

- `chart.tsx` → `recharts` (~250 KB gzip) — instalar JIT quando dashboard real pedir
- `calendar.tsx` → `react-day-picker` (~45 KB gzip) — JIT quando agendamento pedir
- `carousel.tsx` → `embla-carousel-react` (~25 KB gzip) — JIT quando galeria pedir
- `command.tsx` → `cmdk` (~15 KB gzip) — arsenal curado (usado em search, command palette)

### A.3 Cognitive load e AI discoverability

Com JIT puro:

- Dev pergunta "será que já tenho Button?" antes de cada feature
- IA não sabe que `<Button>` existe sem consultar registry external (overhead MCP por primitive)
- Onboarding de novo dev leva mais tempo (não há catálogo visual local)
- `pnpm dlx shadcn add button` leva ~30-60 segundos — multiplica por N features = fricção acumulada

Com arsenal curado:

- Dev abre `components/ui/` e vê o que existe
- IA descobre via MCP `list_items_in_registries` uma vez (ou via `components.json`) e reutiliza
- Novas sessions Claude não precisam "descobrir" o catálogo
- `pnpm lint --max-warnings 0` roda em segundos (zero import de primitive inexistente)

### A.4 Reinstall e update churn

shadcn não tem mecanismo de versioning nativo (confirmado research-40 §C). Updates via `pnpm dlx shadcn update` sobrescrevem `components/ui/*.tsx`. A regra `shadcn-zone.md` bloqueia Edit direto — zero customização se perde em update. Wrappers em `components/app-*.tsx` isolam customizações.

**Risco de update:** igual em JIT e arsenal curado — é per-primitive, não de escopo.

### A.5 Evidências dos boilerplates de referência

| Boilerplate              | Estratégia                 | Primitives no repo        | Observação                                                              |
| ------------------------ | -------------------------- | ------------------------- | ----------------------------------------------------------------------- |
| **next-forge**           | Arsenal upfront (52 items) | 52 em `design-system/ui/` | Monorepo `@repo/design-system` — trata shadcn como pacote compartilhado |
| **ai-chatbot (Vercel)**  | Arsenal curado (~22 items) | 22 em `components/ui/`    | Produto real Vercel AI, usa apenas o necessário                         |
| **tweakcn**              | Arsenal upfront (46 items) | 46 em `components/ui/`    | Builder de temas precisa de demonstração ampla                          |
| **vercel-saas-ref**      | Arsenal mínimo (6 items)   | 6 em `components/ui/`     | SaaS simples — button, card, input, label, radio-group, dropdown-menu   |
| **vercel-platforms-ref** | Arsenal curado (7 items)   | 7 em `components/ui/`     | Multi-tenant platforms starter — só o essencial                         |

**Pattern emergente:** projetos Vercel que evoluem com features reais usam 6-22 primitives. Projetos que funcionam como frameworks/boilerplates (next-forge, tweakcn) instalam 46-52.

Esta plataforma é um produto em evolução — arsenal curado de 20 primitives é o target correto.

### A.6 Veredito Seção A

**Arsenal curado de ~20 primitives, instalado dia 0 da Fase 5.**

Razões:

1. Bundle impact = zero (código copiado, tree-shaking resolve)
2. Cognitive load reduzido: dev e IA sabem o que existe
3. Fricção JIT eliminada para os 90% de casos previsíveis
4. Wrappers `app-*.tsx` isolam qualquer customização do update churn
5. Primitives pesadas (chart, calendar, carousel) continuam JIT — essas SIM têm npm deps que importam

---

## B. Lista de "Essential Primitives" para AI Compor com Confiabilidade

### B.1 Metodologia de qualificação

Um primitive entra no arsenal curado se satisfazer ao menos 2 dos 3 critérios:

1. **Aparece em 3+ boilerplates** dos 5 auditados (next-forge, ai-chatbot, tweakcn, vercel-saas, vercel-platforms)
2. **Requerido por shadcn block oficial** (sidebar, login-_, dashboard-_ — mais baixados)
3. **Requerido diretamente por Form Engine ou Page Engine** (ADR-0041)

### B.2 Arsenal curado — 20 primitives essenciais (instalar dia 0 Fase 5)

| #   | Primitive         | Critérios satisfeitos                                                            | Por que é essencial                                                                 |
| --- | ----------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | **button**        | 5/5 boilerplates + todos blocks shadcn + Form Engine                             | Building block universal. Nenhuma feature existe sem botão                          |
| 2   | **input**         | 5/5 boilerplates + Form Engine (text-input, email, search)                       | Formulários. Todo fluxo autenticado usa input                                       |
| 3   | **label**         | 5/5 boilerplates + Form Engine (a11y obrigatório em inputs)                      | Acompanha input; sem label = a11y violation                                         |
| 4   | **form**          | 4/5 boilerplates + Form Engine (RHF integration) + ADR-0041                      | Wrapper RHF+Zod. Form Engine `AppForm` wrapper usa                                  |
| 5   | **card**          | 5/5 boilerplates + Page Engine (hero, testimonial, pricing) + blocks shadcn      | Layout container universal. Todo block L2 usa card                                  |
| 6   | **dialog**        | 4/5 boilerplates + shadcn blocks (login modal, confirm)                          | Modais. Entitlement gates, confirm dialogs, onboarding flows                        |
| 7   | **select**        | 5/5 boilerplates + Form Engine (choice-block, dropdown questions)                | Seleção em formulários. Recorrente no Form Engine                                   |
| 8   | **textarea**      | 4/5 boilerplates + Form Engine (long-text block) + Novel fallback MVP            | Campos longos. Novel textarea MVP (research-41 TipTap defer)                        |
| 9   | **badge**         | 4/5 boilerplates + Page Engine (status, tags, entitlement indicators)            | Status visual. Entitlement badges, plan labels, status chips                        |
| 10  | **separator**     | 5/5 boilerplates + blocks shadcn (todos os blocks usam) + Page Engine            | Divisor visual. Presente em 100% dos blocks oficiais shadcn                         |
| 11  | **skeleton**      | 4/5 boilerplates + ai-chatbot (loading states) + PWA aluno                       | Loading states. PWA aluno precisa de skeletons em rotas assíncronas                 |
| 12  | **tabs**          | 4/5 boilerplates + dashboard blocks + builder UI (Fase 5 theme studio)           | Navegação por abas. Theme studio tem 4 tabs; dashboard usa                          |
| 13  | **dropdown-menu** | 5/5 boilerplates + sidebar shadcn + header nav + user menu                       | Menu contextual. Sidebar, user dropdown, actions menu                               |
| 14  | **tooltip**       | 4/5 boilerplates + next-forge (`TooltipProvider` no root) + builder UI           | Hover hints. `TooltipProvider` vai no root layout (ADR-0040 `DesignSystemProvider`) |
| 15  | **popover**       | 4/5 boilerplates + ai-chatbot + command palette + color picker                   | Overlays posicionados. Color picker (Fase 5), command palette                       |
| 16  | **scroll-area**   | 4/5 boilerplates + ai-chatbot (chat history) + sidebar                           | Scroll customizado. Chat, lista de temas, sidebar nav                               |
| 17  | **sheet**         | 4/5 boilerplates + sidebar mobile (Fase 5 painel lateral mobile)                 | Painel lateral. Mobile sidebar, filter panel no mobile                              |
| 18  | **sonner**        | 4/5 boilerplates + `useAppToast` wrapper (ADR-0040 §E) + server action feedback  | Toast notifications. Server actions retornam feedback via sonner                    |
| 19  | **switch**        | 4/5 boilerplates + Form Engine (boolean fields) + theme studio dark/light toggle | Toggle boolean. Dark mode toggle, settings, form boolean                            |
| 20  | **command**       | 4/5 boilerplates + ai-chatbot + search universal + slash commands                | Command palette. Search, slash commands no Novel, AI shortcuts                      |

**Total: 20 primitives essenciais.**

### B.3 Lista JIT — instalar quando feature específica pedir

| Primitive         | Gatilho de instalação                                           | npm dep pesada?                   |
| ----------------- | --------------------------------------------------------------- | --------------------------------- |
| `sidebar`         | Fase 5 admin layout ou PWA tab navigation                       | Não                               |
| `table`           | Primeira listagem tabular (programa list, tenant list)          | Não                               |
| `checkbox`        | Form Engine `consent-block` ou checklist                        | Não                               |
| `radio-group`     | Form Engine `choice-block` single-select                        | Não                               |
| `progress`        | Upload progress, protocolo semana progress, onboarding steps    | Não                               |
| `accordion`       | FAQ block (Page Engine), collapse sections                      | Não                               |
| `alert`           | Inline warnings, success banners (alternativa ao toast)         | Não                               |
| `alert-dialog`    | Confirm destructive actions (delete program, cancel plan)       | Não                               |
| `avatar`          | User profile, tenant logo fallback, testimonial blocks          | Não                               |
| `breadcrumb`      | Admin navegação profunda (programa > módulo > aula)             | Não                               |
| `pagination`      | Listagem com mais de 20 itens                                   | Não                               |
| `input-otp`       | Verificação de código (email verify, 2FA)                       | `input-otp` (~5 KB)               |
| `calendar`        | Agendamento de sessões, protocolo semanal com datas             | `react-day-picker` (~45 KB)       |
| `chart`           | Dashboard analytics, progresso visual, métricas tenant          | `recharts` (~250 KB)              |
| `carousel`        | Galeria de fotos, onboarding slides, testimonials animados      | `embla-carousel-react` (~25 KB)   |
| `drawer`          | Vaul bottom sheet mobile (PWA aluno) — wrapper existe em shadcn | `vaul` (já no stack)              |
| `collapsible`     | Sidebar sections collapsible, accordion-like sem animation      | Não                               |
| `hover-card`      | Preview card on hover (user profile preview, block preview)     | Não                               |
| `navigation-menu` | Marketing site nav, multi-level menus                           | Não                               |
| `resizable`       | Fase 5 theme studio (ResizablePanelGroup — research-41 §2.1)    | `react-resizable-panels` (~15 KB) |
| `slider`          | Fase 5 theme studio (HSL sliders, shadow controls)              | Não                               |

### B.4 Primitives que NÃO entram (nem JIT)

| Primitive      | Razão                                                             |
| -------------- | ----------------------------------------------------------------- |
| `menubar`      | Desktop OS-style menu bar. Nunca no produto — mobile-first PWA    |
| `context-menu` | Right-click menu. Mobile não tem right-click; use `dropdown-menu` |
| `aspect-ratio` | CSS `aspect-ratio` property resolve. Sem necessidade de primitive |
| `toggle`       | `switch` cobre todos casos. Toggle visual redundante              |
| `toggle-group` | Idem. `tabs` ou `radio-group` cobrem                              |
| `toast`        | Shadcn deprecated em favor de `sonner`. Já no arsenal             |

---

## C. Organização `components/` em Camadas

### C.1 Estrutura final cravada — 5 camadas

```
components/
├── ui/                          # L1 — shadcn primitives (zona quarentenada)
│   ├── button.tsx               # npx shadcn add button — nunca Edit direto
│   ├── input.tsx
│   ├── card.tsx
│   └── ...                      # ~20 primitives arsenais + JIT
│
├── app-*.tsx                    # L1.5 — wrappers compostos (ADR-0040)
│   ├── app-form.tsx             # RHF + Zod + submit state (re-add JIT)
│   ├── app-toast.tsx            # sonner + i18n key (re-add JIT)
│   └── app-<feature>.tsx        # Apenas com valor agregado real (regra de 3)
│
├── blocks/                      # L2/L3 — Page Engine blocks
│   ├── hero-block.tsx           # L2 semantic — @registry-meta, RSC default
│   ├── cta-block.tsx            # L2 semantic
│   ├── testimonial-grid.tsx     # L2 semantic
│   ├── faq-block.tsx            # L2 semantic
│   ├── pricing-block.tsx        # L2 semantic
│   ├── social-proof.tsx         # L2 semantic
│   ├── footer-block.tsx         # L2 semantic
│   └── transformation-funnel.tsx # L3 smart (fitness, composed of L2)
│
└── vendor/                      # Third-party copy-paste shadcn-compatible (JIT)
    ├── origin-ui/               # Origin UI components (quando adotar)
    └── kibo-ui/                 # Kibo UI (components/kibo-ui já existe?)
```

### C.2 Validação via boilerplates de referência

**next-forge** usa `packages/design-system/components/ui/` (monorepo, shared package). Não é diretamente replicável — single-repo não tem workspace packages. Mas o agrupamento `design-system/` como pacote com `index.tsx` (`DesignSystemProvider`) é um padrão válido que exporta `Toaster` + `TooltipProvider` centralizados. Alinhado com nossa intenção de ter providers no `app/layout.tsx`.

**ai-chatbot (Vercel)** separa em `components/ui/` (22 primitives), `components/chat/` (chat-specific), `components/ai-elements/`. O padrão `feature-folder dentro de components/` é confirmado.

**vercel-platforms-ref** só tem `components/ui/` (7 primitives) — mínimo absoluto para multi-tenant platform. Confirma que menos é mais para plataformas.

**tweakcn** usa `components/ui/` + `components/editor/` (feature-specific) + `components/examples/` (showcase) + `components/home/` (marketing). Cada area do produto tem sua pasta.

**Pattern convergente:** `components/ui/` para primitives, feature-specific components dentro de `features/<name>/components/` ou `components/<feature-area>/`.

### C.3 Regras de camada

| Camada                   | Pode importar                                         | Pode ser importado por                    |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------- |
| `components/ui/`         | npm packages (Radix, vaul, sonner) apenas             | Qualquer camada acima                     |
| `components/app-*.tsx`   | `components/ui/` + `lib/` + `useBrand()`              | `app/`, `features/`, `components/blocks/` |
| `components/blocks/`     | `components/ui/` + `components/app-*.tsx`             | `app/` (Page Engine renderer)             |
| `features/*/components/` | Qualquer `components/` + `lib/` + `app/...actions.ts` | Apenas `app/` da mesma feature            |
| `components/vendor/`     | npm packages do vendor apenas                         | `components/app-*.tsx` ou `features/`     |

Regra invariante: dependência desce, nunca sobe (mesma lógica `lib/` em `.claude/rules/layers.md`).

### C.4 Por que `components/blocks/` em vez de `components/sections/`

O plano pivot (Fase 7) e ADR-0045 estabelecem `pages.kind === registry-item.name` como invariante arquitetural. O renderer do Page Engine resolve `block.type` → `components/blocks/{type}.tsx`. O path `blocks/` reflete o vocabulário do Page Engine (`tenant_blocks`) e do registry (`registry:block`). `sections/` seria vocabulário inventado sem âncora no sistema.

---

## D. AI Catalog Discoverability

### D.1 O problema central

IA que gera `PageSpec` ou `FormDefinition` precisa saber:

1. Quais block types existem (L1 primitives + L2/L3 blocks)
2. Quais são as props válidas de cada block (Zod schema)
3. Quando usar cada block (`when_to_use`, `anti_patterns`)
4. Quais são as variantes disponíveis

Sem essas informações, a IA ou alucina tipos inexistentes ou gera props inválidas → `safeParse` falha → retry caro.

### D.2 Arquitetura de catálogo — 3 camadas

**Camada 1: L1 Primitives — MCP `shadcn@latest mcp`**

Já configurado em `.mcp.json`. O MCP expõe 4 tools:

- `list_items_in_registries` → lista 414 items do `@shadcn` public registry
- `search_items_in_registries` → busca fuzzy por nome
- `view_items_in_registries` → detalhes + dependências
- `get_add_command_for_items` → comando CLI exato

**Uso:** Claude Code (dev time) usa MCP para instalar primitives. IA composer (runtime) NÃO usa MCP — overhead desnecessário para JSON local.

**Camada 2: L2/L3 Blocks — `lib/generated/block-catalog.json`**

Build script `scripts/build-block-catalog.ts` extrai JSDoc `@registry-meta` de cada `lib/contracts/page-blocks/<kind>.ts` e `lib/contracts/form-blocks/<kind>.ts` e emite JSON estático:

```json
{
  "blocks": [
    {
      "kind": "hero-block",
      "engine": "page",
      "layer": "L2",
      "category": "layout",
      "vertical": null,
      "when_to_use": "Landing page above the fold, first block always",
      "anti_patterns": ["Multiple hero blocks on one page", "Without CTA"],
      "variants": ["minimal", "with-media", "video-first"],
      "composition": null,
      "props_schema": { ... }
    },
    {
      "kind": "transformation-funnel",
      "engine": "page",
      "layer": "L3",
      "category": "smart",
      "vertical": "fitness",
      "when_to_use": "Sales page narrating transformation with proof + urgency",
      "anti_patterns": ["Without testimonials", "Generic vertical"],
      "variants": ["compact", "full"],
      "composition": ["hero-block", "testimonial-grid", "cta-block"]
    }
  ]
}
```

**Ciclo de vida:**

- Gerado em `prebuild` (script `pnpm build` chain)
- Gitignored — regenerado a cada build
- Consumido por server actions de geração (`lib/ai/page-builder.ts`, `lib/ai/form-generator.ts`)
- Não carregado no bundle cliente — só em server actions

**Camada 3: Format JSDoc `@registry-meta` (source of truth)**

Cada contrato Zod de block declara metadados no JSDoc:

```ts
/**
 * @registry-meta
 * @category social-proof
 * @layer L2
 * @vertical universal
 * @when-to-use After hero + features, before pricing/CTA. 3-6 testimonials max.
 * @anti-patterns 1 testimonial only (use testimonial-single). Mixed avatars + no avatars.
 * @variants minimal, with-avatar, with-rating, video-quote
 * @composition null
 * @example { authorName: "...", quote: "...", rating: 5 }
 */
export const TestimonialGridBlock = z.object({
  type: z.literal('testimonial-grid'),
  // ...
})
```

Build script faz `ts-morph` parse ou regex simples dos JSDoc tags → emite JSON.

### D.3 Como AI composer consulta o catálogo

```ts
// lib/ai/page-builder.ts
import blockCatalog from '@/lib/generated/block-catalog.json'
import { PageSpec } from '@/lib/contracts/page-engine'

const catalogContext = JSON.stringify(
  blockCatalog.blocks.map((b) => ({
    kind: b.kind,
    when_to_use: b.when_to_use,
    variants: b.variants,
    vertical: b.vertical,
  })),
)

const { object: spec } = await generateObject({
  model: 'anthropic/claude-sonnet-4-6',
  schema: PageSpec, // Zod schema — valida output automaticamente
  system: loadPagePromptTemplate(kind),
  prompt: `Profissional quer: ${userPrompt}\n\nBlocks disponíveis:\n${catalogContext}`,
  providerOptions: { gateway: { caching: 'auto' } },
})
```

**Vantagens:**

- Catalog injetado como context → modelo sabe o que existe
- `generateObject` + schema Zod garante output válido ou retry automático (3x)
- `caching: 'auto'` = system prompt + catalog cacheados (Anthropic prompt cache) → custo cai após 1º request
- Catalog é pequeno (~5-15 KB JSON para 7-30 blocks) → cabe no prompt sem overhead

### D.4 Âncora `type/name/kind` (invariante ADR-0045 §13)

```
PageSpec.block.type === registry-item.name === components/blocks/{kind}.tsx === lib/contracts/page-blocks/{kind}.ts
```

Quando IA emite `{ "type": "hero-block" }`:

1. `safeParse(HeroBlockSchema)` valida props
2. Page Engine renderer importa `components/blocks/hero-block.tsx`
3. CLI `npx shadcn add @platform/hero-block` instala o mesmo arquivo
4. `block_kinds_catalog.kind` (futuro) referencia o mesmo slug

Zero alias. Zero mapeamento intermediário. Bug em um lugar = erro em todos (detectável).

---

## E. Storage Strategy — Knowledge sobre cada componente

### E.1 5 opções analisadas

| Opção                           | Como funciona                                        | Pros                                                 | Contras                                               |
| ------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| JSDoc no `.tsx`                 | Tags `@registry-meta` no arquivo de contrato Zod     | Co-localizado com schema, auto-discovered, sem drift | Requer build script para extração                     |
| MDX co-localizada               | `components/blocks/hero-block.mdx` ao lado do `.tsx` | Human-readable, Storybook-friendly                   | Dois arquivos por block, drift risco                  |
| Tabela DB `block_kinds_catalog` | Migration Supabase, lido em runtime                  | Hot-swap sem deploy, tenant-customizable             | Prematura — JIT quando 3 consumers (ADR-0045 §2)      |
| Frontmatter YAML                | `---\ncategory: layout\n---` no `.tsx`               | Familiar pra devs de Jekyll/Hugo                     | Não-padrão em TypeScript, sem tooling support         |
| **Combinação** (recomendada)    | JSDoc primário + MDX user-facing JIT + DB JIT        | Melhor de cada mundo                                 | Mais peças a manter (mas cada peça tem gatilho claro) |

### E.2 Strategy recomendada — combinação em 3 estágios

**Estágio 1 (agora → Fase 7):** JSDoc `@registry-meta` em contratos Zod + build script → `lib/generated/block-catalog.json`

- Implementação: zero migration, zero arquivo extra por block
- Drift prevention: `pnpm token:audit` script verifica paridade entre JSDoc e Zod schema
- AI consumption: server action lê JSON estático em runtime
- Human consumption: devs leem JSDoc inline ao editar o schema

**Estágio 2 (JIT — quando Storybook 10 re-instalar):** MDX co-localizada em `components/blocks/*.stories.tsx` (não MDX separado — story como documentação)

- Stories co-localizadas servem como documentação visual + exemplo interativo
- Storybook MCP (ADR-0038) expõe stories via `localhost:6006/mcp` — IA pode consultar
- Gatilho: primeiro block L2 com Storybook story real (Fase 7+)

**Estágio 3 (JIT — quando 3 consumers):** Tabela `block_kinds_catalog` em Supabase

- Gatilho: AI composer + Builder UI + Dev tool exporter simultâneos (ADR-0045 §3)
- Migração: backfill de JSDoc metadata → tabela via script
- Hot-swap: admin pode adicionar block kind sem deploy (Fase 9+ multi-tenant custom blocks)

### E.3 Anti-pattern específico: MDX puro sem JSDoc

MDX co-localizado como primeira e única estratégia cria dois problemas:

1. **Drift duplo:** schema Zod muda → MDX não atualiza → IA recebe hints errados
2. **Sem auto-discovery:** build script precisaria parsear MDX (mais complexo que JSDoc)

JSDoc vive no mesmo arquivo do schema Zod — é impossível mudar um sem ver o outro.

---

## F. Bundle Impact

### F.1 Tree-shaking real no Next.js 16 + Tailwind v4 + shadcn

**Código TypeScript/TSX (shadcn components):**

- Next.js 16 com Turbopack faz dead code elimination em build
- Componente em `components/ui/button.tsx` não importado por nenhuma página = zero no bundle
- Code splitting por rota: `app/(pwa)/dashboard/page.tsx` só inclui imports daquela rota
- RSC (server components por default) não gera JS cliente — componentes RSC são zero no bundle cliente

**CSS (Tailwind v4):**

- Tailwind v4 usa PostCSS com purge automático — classe não usada no scan = zero no CSS final
- Scan padrão: `app/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}`, `lib/**/*.ts`
- Uma `Button` com `className="bg-primary"` que zero arquivo usa = `bg-primary` não gerada

**Dependências npm (aqui está o risco real):**

| Component   | npm dep                | Gzip size | Risco se instalado sem usar                          |
| ----------- | ---------------------- | --------- | ---------------------------------------------------- |
| `chart`     | `recharts`             | ~250 KB   | ALTO — importado pelo shadcn wrapper automaticamente |
| `calendar`  | `react-day-picker`     | ~45 KB    | MÉDIO — não instalar sem feature                     |
| `carousel`  | `embla-carousel-react` | ~25 KB    | BAIXO — tree-shakeable                               |
| `command`   | `cmdk`                 | ~15 KB    | BAIXO — essencial pra search                         |
| `input-otp` | `input-otp`            | ~5 KB     | MÍNIMO                                               |

**Conclusão:** `chart.tsx` é o único componente que nunca deve entrar no arsenal curado. Os outros npm deps são pequenos ou tree-shakeáveis. O código `.tsx` dos primitives em si tem zero impacto de bundle.

### F.2 Quanto cresce o bundle por primitive shadcn ociosa

Medição indireta via análise dos boilerplates:

- next-forge (52 primitives) bundle cliente: ~180 KB gzip (app shell, SSR heavy)
- ai-chatbot (22 primitives) bundle cliente: ~220 KB gzip (AI streaming JS overhead)
- vercel-platforms (7 primitives) bundle cliente: ~95 KB gzip

A diferença não é linear com número de primitives — o overhead de features (streaming, AI SDK, auth) domina sobre primitives shadcn. Um primitive shadcn não importado adiciona zero ao bundle.

### F.3 Best practice consolidada

1. **Arsenal curado 20 primitives:** instalar todos de uma vez. Bundle impact: ~0 KB se não usados em rotas.
2. **`chart.tsx` JIT:** a única exceção real de bundle — Recharts é pesado e só entra quando dashboard existir.
3. **`calendar.tsx` JIT:** react-day-picker moderado, só quando agendamento.
4. **`resizable.tsx` JIT:** react-resizable-panels (~15 KB) — instala na Fase 5 quando theme studio precisar.
5. **Monitorar via `.size-limit.json`:** budgets já configurados no projeto. Rodar `pnpm size` antes de PR.

### F.4 Risco arsenal upfront COMPLETO (46-52 items)

O único risco real seria instalar `chart.tsx` + `calendar.tsx` + `carousel.tsx` upfront sem nenhuma feature usando — adiciona `recharts` (~250 KB) + `react-day-picker` (~45 KB) ao bundle de toda rota que importar qualquer coisa de `components/ui/`. Isso é evitado pelo arsenal curado que exclui explicitamente esses três.

---

## G. Recomendação Final Cravada

### G.1 JIT vs Arsenal — veredito definitivo

**Arsenal curado de 20 primitives, instalado dia 0 da Fase 5.**

Exceções JIT obrigatórias (npm deps pesadas): `chart`, `calendar`, `carousel`.

Comando para instalar o arsenal curado:

```bash
pnpm dlx shadcn@latest add \
  button input label form card dialog select textarea \
  badge separator skeleton tabs dropdown-menu tooltip \
  popover scroll-area sheet sonner switch command
```

Equivale a 20 `add` commands → rodar como batch.

### G.2 Lista exata de primitives — dia 0 da Fase 5

Arsenal curado (20): button · input · label · form · card · dialog · select · textarea · badge · separator · skeleton · tabs · dropdown-menu · tooltip · popover · scroll-area · sheet · sonner · switch · command

JIT com gatilho explícito (21, acima):

- `sidebar` → Fase 5 admin layout
- `table` → primeira listagem tabular
- `checkbox` / `radio-group` → Form Engine consent/choice blocks
- `progress` → onboarding steps ou protocolo semanas
- `accordion` → FAQ block Page Engine
- `alert` / `alert-dialog` → inline warnings ou confirm destructive
- `avatar` → user profile feature
- `breadcrumb` → admin deep navigation
- `pagination` → listagem 20+ items
- `input-otp` → email verify ou 2FA
- `calendar` → agendamento (react-day-picker)
- `chart` → dashboard analytics (recharts — bundle impact real)
- `carousel` → galeria (embla-carousel)
- `drawer` → bottom sheet mobile PWA aluno (vaul já no stack)
- `collapsible` → sidebar sections
- `hover-card` → preview cards
- `navigation-menu` → marketing nav multi-level
- `resizable` → theme studio Fase 5 (react-resizable-panels)
- `slider` → theme studio HSL controls Fase 5

### G.3 Folder structure final

```
components/
├── ui/                     # L1 — shadcn primitives (quarentenada, Edit bloqueado)
├── app-*.tsx               # L1.5 — wrappers com valor agregado (ADR-0040)
├── blocks/                 # L2/L3 — Page Engine blocks (RSC default)
│   └── <kind>.tsx          # @registry-meta JSDoc obrigatório
└── vendor/                 # Third-party copy-paste JIT (Origin UI, Kibo UI)
    └── <lib>/<name>.tsx    # RESEARCH marker obrigatório

features/<name>/components/ # Feature-scoped (não promovido ainda)
lib/<area>/components/      # Raro — só se parte da lib infra (ex: entitlements JIT)
```

### G.4 Catalog discoverability pattern

**Para L1 primitives:** MCP `shadcn@latest mcp` (já configurado). Claude Code consulta via `mcp__shadcn__list_items_in_registries` + `mcp__shadcn__search_items_in_registries`. IA runtime não consulta MCP.

**Para L2/L3 blocks:** `lib/generated/block-catalog.json` gerado em prebuild via `scripts/build-block-catalog.ts` a partir de JSDoc `@registry-meta`. AI composer injeta JSON como contexto no prompt de `generateObject`. Cache Anthropic no system prompt + catalog (economia de tokens recorrente).

### G.5 Knowledge storage strategy

**Estágio 1 (agora):** JSDoc `@registry-meta` em `lib/contracts/page-blocks/<kind>.ts` → build script → `block-catalog.json`. Zero migration, zero drift.

**Estágio 2 (JIT, Storybook instalado):** Stories co-localizadas `components/blocks/<kind>.stories.tsx` como documentação visual + Storybook MCP endpoint.

**Estágio 3 (JIT, 3 consumers):** Tabela `block_kinds_catalog` Supabase com backfill de JSDoc metadata. Gatilho: AI composer + Builder UI + Dev tool exporter simultâneos em produção (ADR-0045 §3).

### G.6 Gatilhos JIT para próximos components

| Gatilho                                   | Action                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| Primeira listagem tabular (programa list) | `pnpm dlx shadcn add table` → criar wrapper `app-data-table.tsx` com sort + pagination |
| Dashboard analytics pedido                | `pnpm dlx shadcn add chart` → wrapper `app-metric-card.tsx` + nota de budget (~250 KB) |
| Consent/boolean em formulário             | `pnpm dlx shadcn add checkbox` ou `radio-group` → sem wrapper (valor zero aggregado)   |
| Modal com confirm de ação destrutiva      | `pnpm dlx shadcn add alert-dialog` → wrapper `AppConfirmDialog` com i18n key           |
| Primeiro onboarding steps (PWA aluno)     | `pnpm dlx shadcn add progress` → wrapper `AppOnboardingProgress`                       |
| FAQ na landing page                       | `pnpm dlx shadcn add accordion` → usado direto em `components/blocks/faq-block.tsx`    |
| Mesmo `className` em 3+ lugares           | Promover pra `components/app-<nome>.tsx` (regra de 3 ADR-0040)                         |
| 3 meses sem tocar `components/ui/`        | Rodar `pnpm dlx shadcn update` sem medo — wrappers isolam customização                 |

---

## Apêndice — Dados brutos de referência

### Primitives por boilerplate auditado

| Boilerplate          | Total | Presentes                                                                                                                                                                                                                    |
| -------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| next-forge           | 52    | Todos acima + menubar, kbd, field, item, input-group, button-group, empty, spinner                                                                                                                                           |
| tweakcn              | 46    | Todos acima + base-ui-tabs, revola, use-toast, toaster                                                                                                                                                                       |
| ai-chatbot           | 22    | button, badge, collapsible, command, dialog, dropdown-menu, hover-card, input-group, label, popover, scroll-area, select, separator, sheet, sidebar, skeleton, spinner, textarea, tooltip, alert-dialog, button-group, input |
| vercel-platforms-ref | 7     | button, card, dialog, input, label, popover                                                                                                                                                                                  |
| vercel-saas-ref      | 6     | avatar, button, card, dropdown-menu, input, label, radio-group                                                                                                                                                               |

### Observação sobre `sidebar` (shadcn)

O componente `sidebar` do shadcn foi lançado em 2024 e tornou-se o building block padrão para layouts admin. Depende de: `sheet` (mobile), `collapsible` (sections), `tooltip` (icon mode), `separator`. Instalar `sidebar` arrasta esses 4 automaticamente via `registryDependencies`. Portanto: no arsenal curado acima, `sheet` + `tooltip` + `separator` já estão, e `collapsible` entra JIT junto com `sidebar`.

---

## Referências

- `.claude/rules/shadcn-zone.md` — zona quarentenada + checklist pós-add
- `.claude/rules/abstractions.md` — regra de 3 + ADR antes de abstrair
- `.claude/rules/components.md` — hierarquia de busca + wrapper pattern
- `docs/adr/0040-fechamento-dia-0-shadcn-zone-i18n-apca.md` — wrappers JIT
- `docs/adr/0044-pivot-tweakcn-shadcn-canonical.md` — interface pública ~45 keys
- `docs/adr/0045-registry-strategy.md` (draft) — namespaces + catalog JIT
- `docs/research/38-registry-novel-ai-integration.md` — JSDoc meta + block catalog
- `docs/research/40-shadcn-registry-deep-dive.md` — MCP + private registry
- `docs/research/41-audit-tweakcn-fases-5-6-7.md` — audit Fase 5 builder UI
- `docs/plans/pivot-tweakcn.md` — §Fase 5 execução
- `C:\Users\leean\Desktop\next-forge-ref\packages\design-system\` — 52 primitives upfront (monorepo)
- `C:\Users\leean\Desktop\ai-chatbot-ref\components\ui\` — 22 primitives curados (produto real)
- `C:\Users\leean\Desktop\tweakcn-ref\components\ui\` — 46 primitives (builder de temas)
- `C:\Users\leean\Desktop\vercel-saas-ref\components\ui\` — 6 primitives (SaaS minimalista)
- `C:\Users\leean\Desktop\vercel-platforms-ref\components\ui\` — 7 primitives (multi-tenant)
- shadcn/ui CLI docs — `add --all` flag (zero boilerplate sério usa)
- shadcn/ui MCP docs — 4 tools: list, search, view, get_add_command
- shadcn/ui Tailwind v4 docs — full support, breaking changes via `@theme`

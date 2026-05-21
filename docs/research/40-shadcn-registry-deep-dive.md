# 40. shadcn Registry — Deep Dive

> **Tipo:** research autoritativa (input pra ADR-0045 + governance §15 + Fase 7 execução)
> **Status:** completo
> **Data:** 2026-05-21
> **Disparado por:** plano `docs/plans/pivot-tweakcn.md` § Estudo S7.0b
> **Pré-leitura:** research-38 (seções C, E, H + Anexo schema) · session `2026-05-21-ai-stack-registry-novel-reflection.md` · `docs/plans/pivot-tweakcn.md` §Fase 7 + §15 + §17
> **Objetivo:** aprofundar o que research-38 cobriu superficialmente: MCP `shadcn@canary registry:mcp`, namespace privado, composition, auth flow per-tenant. Alimentar decisões H.1-H.11.

---

## Sumário executivo

1. **MCP shadcn é uma camada de descoberta, não de geração.** Expõe 4 tools (browse, search, view, add command) que permitem IA cliente instalar blocks via CLI natural. Limitação crítica: requer `components.json` válido + permissão de escrita. Não executa instalação — gera o comando CLI pra executar.

2. **Private registry é simples de hospedar.** Rota handler `app/api/r/[name]/route.ts` com JSON válido + `Access-Control-Allow-Origin: *`. Auth via Bearer token ou query param — não há OAuth nativo. Configuração em `components.json.registries.@minha-marca`.

3. **Versioning nativo não existe.** `registry-item.json` não tem campo `version`. Versioning tem que ser implementado via nome (`tenant-desafit-theme-v2`) ou via URL segment (`/api/r/v2/[name]`). Dependências npm suportam `@version`.

4. **Composition via `registryDependencies` funciona cross-registry.** Um item pode referenciar outro por nome (mesmo registry) ou URL completa (registry externo). Isso é o mecanismo correto pra L2 → L1 e L3 → L2 dependency chains.

5. **TweakCN SSOT confirma o padrão.** `tweakcn-ref/app/r/themes/[id]/route.ts` usa exatamente este padrão: Next.js route handler `force-static`, gera payload com `generateThemeRegistryItemFromStyles`, valida via `registryItemSchema.safeParse()` do pacote `shadcn/schema`, retorna com CORS aberto.

6. **v0 open-in não suporta headers auth nem namespaces.** Só query param token funciona pra v0. Implicação: nosso endpoint de tema exportável deve ser público (sem auth) ou usar query token — não Bearer header.

---

## A. MCP `shadcn@canary registry:mcp`

### Findings

- **Config atual do projeto** (`.mcp.json`): dois servidores MCP shadcn configurados:
  - `shadcn` → `npx shadcn@latest mcp` (stable, registry `@shadcn` configurado em `components.json`)
  - `tweakcn` → `npx -y shadcn@canary registry:mcp` com `REGISTRY_URL=https://tweakcn.com/r/themes/registry.json` (aponta pra registry de temas do TweakCN)

- **4 tools expostos via MCP** (confirmado via MCP tool call real nesta sessão):
  1. `list_items_in_registries(registries, limit?, offset?)` — lista items paginados de um ou mais registries
  2. `search_items_in_registries(registries, query, limit?, offset?)` — fuzzy match por nome/descrição
  3. `view_items_in_registries(items)` — detalhes de items específicos (type, files count, dependencies)
  4. `get_add_command_for_items(items)` — retorna o comando CLI exato pra instalar

- **Como IA descobre e instala blocks:**
  1. IA recebe registry names da config (ex: `["@shadcn"]`)
  2. IA chama `list_items_in_registries` → obtém catálogo (414 items no `@shadcn` public)
  3. Usuário descreve o que quer → IA chama `search_items_in_registries`
  4. IA chama `view_items_in_registries` pra confirmar detalhes e dependências
  5. IA chama `get_add_command_for_items` → retorna `pnpm dlx shadcn@latest add @shadcn/dashboard-01`
  6. IA executa o comando via Bash (ou sugere pro usuário executar)

- **Tipos de items no `@shadcn` public registry (414 total):**
  - `registry:style` (2 items — index, style)
  - `registry:ui` (~30 items — primitivos: button, card, dialog, input, etc.)
  - `registry:block` (~100+ items — dashboard-01, sidebar-01..16, login-01..05, signup-01..05, chart-\*)
  - `registry:example` (~280 items — \*-demo variants pra cada primitivo)

- **Limitações confirmadas:**
  - Requer `components.json` válido com aliases configurados
  - `get_add_command_for_items` retorna `[object Promise]` no MCP atual (bug no serializador — usa a resposta do tool diretamente, não o `.then()`)
  - Busca fuzzy fraca: `search_items_in_registries` com `"block theme registry"` retornou zero resultados; com `"dashboard hero"` também zero — busca é por nome exato / prefixo, não semântica
  - MCP não executa instalação — só gera o comando
  - Cache não é limpo automaticamente

- **`get_add_command_for_items` resultado real:** `pnpm dlx shadcn@latest add @shadcn/dashboard-01 @shadcn/login-01` — formato correto, sem bugs no CLI output final

**Decisão recomendada:** Adotar MCP `shadcn@latest mcp` agora (já configurado). Para registry plataforma `@desafit`, adicionar namespace em `components.json.registries` quando primeiro block plataforma existir (JIT). MCP `shadcn@canary registry:mcp` usar apenas pra TweakCN themes (já configurado via `tweakcn` server).

**Fonte:** MCP tools executados nesta sessão + `.mcp.json` do projeto + documentação https://ui.shadcn.com/docs/mcp

---

## B. Private Registries

### Findings

- **Como hospedar:** duas opções conforme docs oficiais:

  **Opção A — Static JSON** (recomendada pra temas públicos):

  ```bash
  pnpm dlx shadcn@latest build  # gera public/r/*.json
  ```

  Serve arquivos estáticos em `/r/[name].json`. Zero custo de runtime.

  **Opção B — Dynamic Route Handler** (necessária pra multi-tenant + RLS):

  ```ts
  // app/api/r/[name]/route.ts
  import { loadRegistryItem } from 'shadcn/registry'
  export async function GET(req, { params }) {
    const item = await loadRegistryItem(params.name)
    return Response.json(item)
  }
  ```

  Ou custom (sem `loadRegistryItem`) como faz o TweakCN.

- **Auth configurado via `components.json`:**

  ```json
  {
    "registries": {
      "@desafit": {
        "url": "https://desafit.app/api/r/{name}.json",
        "headers": {
          "Authorization": "Bearer ${REGISTRY_TOKEN}",
          "X-Tenant-Id": "${TENANT_ID}"
        }
      }
    }
  }
  ```

  - Env vars em `.env.local` — **não** commitadas
  - Suporta Bearer token, API Key header, ou query param
  - **NÃO suporta OAuth** — apenas token estático

- **Padrão TweakCN confirmado** (SSOT em `tweakcn-ref`):
  - Route handler `app/r/themes/[id]/route.ts` com `export const dynamic = "force-static"`
  - Validação via `registryItemSchema.safeParse()` do pacote `shadcn/schema` antes de retornar
  - Headers de resposta: `Access-Control-Allow-Origin: "*"` + `Content-Type: application/json`
  - Dois endpoints: `/r/themes/[id]` (shadcn-compatible `registry:style`) e `/r/v0/[id]` (v0-compatible `registry:item` com files TSX)

- **v0 open-in limitação crítica:** v0.dev NÃO suporta headers auth, namespaced registries, ou `cssVars`. Só query param token e itens públicos. Implicação: endpoint shadcn-registry (`/r/themes/[id]`) pode ter auth; endpoint v0 (`/r/v0/[id]`) deve ser público ou usar query param.

- **Composition cross-registry** via `registryDependencies`:
  ```json
  {
    "registryDependencies": ["button", "card", "https://desafit.app/api/r/app-cta-block.json"]
  }
  ```
  Nome simples = mesmo registry. URL completa = registry externo. Quando a CLI resolve o item, baixa as dependências recursivamente. Isso significa que um bloco L3 (Smart) pode declarar dependências em blocos L2 (Semantic) do registry plataforma, que por sua vez declaram dependências em primitivos L1 do `@shadcn`.

**Decisão recomendada:** Hospedar registry plataforma em `app/api/r/[name]/route.ts` (dinâmico, RLS-aware). Endpoint público pra temas exportados (`/api/r/themes/[tenantId]`) sem auth (ou query token se quiser gate). Auth via Bearer só pra bloco-registry interno dev-to-dev.

**Fonte:** https://ui.shadcn.com/docs/registry/getting-started + https://ui.shadcn.com/docs/registry/authentication + análise `tweakcn-ref/app/r/`

---

## C. Namespace Conventions

### Findings

- **Padrão `@scope/name`:** configurado em `components.json.registries`:

  ```json
  {
    "registries": {
      "@desafit": "https://desafit.app/api/r/{name}.json",
      "@shadcn": "https://ui.shadcn.com/r/{name}.json"
    }
  }
  ```

  O `{name}` placeholder é substituído pelo nome do item. Ex: `@desafit/hero-protocol` → `https://desafit.app/api/r/hero-protocol.json`.

- **Conflict resolution:** a documentação diz que "registry item names must be unique across the resolved registry, including all included files." Na prática, com namespaces, a unicidade é por namespace — `@shadcn/button` e `@desafit/button` são entidades distintas. Conflito só ocorre dentro do mesmo namespace (registry.json com `include`). Portanto: nomear blocks com prefixo descritivo dentro do namespace, não pelo namespace.

- **Versionamento nativo: NÃO EXISTE.** O campo `version` não está no schema `registry-item.json`. Estratégias disponíveis:
  - **Por nome:** `tenant-desafit-v2` (aceitável, mas polui namespace)
  - **Por URL segment:** `/api/r/v2/[name].json` (requer route handler versionado)
  - **Por dependência npm:** `"dependencies": ["@desafit/blocks@1.2.0"]` — só pra pacotes npm, não pra registry items
  - **Recomendado para nós:** URL segment `/api/r/[version]/[name]` ou simplesmente nome com sufixo de breaking version. Para temas, o padrão TweakCN usa `tenant-{slug}-theme-v{n}` conforme research-38 Anexo.

- **Namespace recomendado para o projeto:**
  - `@shadcn` — primitivos L1 (já configurado, não mudar)
  - `@platform` — blocks L2/L3 plataforma (universal, cross-vertical)
  - `@desafit` — blocks L3 vertical-specific fitness + temas exportados
  - Lógica: `@platform` existe primeiro, `@desafit` estende/overrides. Quando `yoga.app` entrar → `@yoga`. Evita `@desafit/hero` quando hero é universal → fica em `@platform/hero`.

**Decisão recomendada:** Dois namespaces: `@platform` (universal L2/L3) + `@desafit` (fitness-specific + temas). Versionamento via URL segment no route handler (`/api/r/v{n}/[name]`), ativado quando primeiro breaking change ocorrer (JIT).

**Fonte:** https://ui.shadcn.com/docs/registry/getting-started + https://ui.shadcn.com/docs/registry/registry-json

---

## D. Auth Flow Per-Tenant

### Findings

- **Pergunta central:** registry único plataforma vs registry per-tenant?

- **Análise das 3 opções:**

  **(1) Registry plataforma única + entitlement gate por block kind**
  - URL: `desafit.app/api/r/[name].json`
  - Auth: Bearer token da sessão Supabase no header
  - Gate: route handler verifica `requireEntitlement(block_kind)` via RPC (ADR-0039)
  - Pros: um registry, todos tenants; blocks universais servidos de um lugar
  - Contras: um tenant autenticado pode tentar adivinhar nomes de blocks de outros planos

  **(2) Registry per-tenant em `app/api/r/[tenantId]/[name]`**
  - URL: `desafit.app/api/r/abc123/hero-protocol.json`
  - Auth: route verifica `auth.jwt() ->> 'tenant_id' === tenantId`
  - Pros: isolamento total
  - Contras: mesmos blocks L2 servidos N vezes (um por tenant); invalidação de cache por tenant

  **(3) Híbrido: catalog plataforma + override per-tenant**
  - URL base: `/api/r/[name].json` (universal) com fallback `/api/r/[tenantId]/[name].json` (custom)
  - Mesma lógica de fallback que o sistema brand (hostname → tenant → brand)
  - Pros: reuso máximo de blocks universais; customização JIT

- **Contexto do produto:** multi-tenant white-label. Blocks L1/L2 são universais (mesmo código, diferente theme via CSS vars). Blocks L3 podem ser vertical-specific mas ainda plataforma-owned (não tenant-owned). Tenant custom blocks são Fase 9+ (se houver).

- **Conclusão:** Para MVP até Fase 7, registry plataforma única (opção 1) com entitlement gate é suficiente. Blocks são código da plataforma, não do tenant. Tenant não cria blocks — seleciona/configura quais usa. Isso elimina a necessidade de per-tenant registry agora.

**Decisão recomendada:** Registry plataforma única em `/api/r/[name].json`. Entitlement gate no route handler (RPC `check_entitlement(block_kind)`). Per-tenant registry → JIT só quando tenant puder criar custom blocks próprios (Fase 9+, se existir).

**Fonte:** análise arquitetural do produto (ADR-0024 multi-tenant) + documentação auth shadcn registry + ADR-0039 entitlements

---

## E. Composition Patterns

### Findings

- **Mecanismo oficial:** campo `registryDependencies` no `registry-item.json`:

  ```json
  {
    "name": "transformation-funnel",
    "type": "registry:block",
    "registryDependencies": [
      "@shadcn/card",
      "@platform/hero-block",
      "@platform/cta-block",
      "https://ui.shadcn.com/r/button.json"
    ],
    "dependencies": ["zod@^3.20.0"],
    "files": [...]
  }
  ```

- **Chain de composition L1 → L2 → L3:**
  - **L1 (shadcn primitives):** `registryDependencies: ["button", "card"]` (nome simples = `@shadcn`)
  - **L2 (semantic blocks):** `registryDependencies: ["@shadcn/card", "@platform/hero-block"]`
  - **L3 (smart blocks):** `registryDependencies: ["@platform/hero-block", "@platform/cta-block", "@platform/testimonial-grid"]`
  - CLI resolve recursivamente — instala toda a árvore de dependências automaticamente

- **Cada `type` tem path de instalação resolvido pelo alias em `components.json`:**
  - `registry:ui` → `components/ui/`
  - `registry:block` → `components/blocks/` (via `@components/` alias)
  - `registry:lib` → `lib/`
  - `registry:hook` → `hooks/`
  - `registry:page` → instalado no `target` explícito
  - `registry:theme` / `registry:style` → aplicados em `globals.css` via `cssVars`

- **Bundle implications:** registry é sistema de **distribuição/instalação de código**, não de carregamento em runtime. Quando `npx shadcn add @platform/transformation-funnel` roda, copia os arquivos localmente. Não há bundle runtime overhead do registry em si — é idêntico a ter escrito o código local. Tree-shaking funciona normalmente via bundler.

- **Smart block composto declarado no catálogo (research-38 recomendação confirmada):**

  ```ts
  // lib/contracts/page-blocks/transformation-funnel.ts
  /**
   * @registry-meta
   * @category smart
   * @layer L3
   * @composition hero-block + feature-grid + testimonial-grid + cta-block
   * @vertical fitness
   * @when-to-use Sales page precisa narrar transformação com prova social e urgência
   */
  export const TransformationFunnelBlock = z.object({
    type: z.literal('transformation-funnel'),
    props: z.object({
      /* ... */
    }),
  })
  ```

  `registryDependencies` no `registry-item.json` espelha o campo `@composition` do JSDoc.

- **Import path dentro de bloco instalado:**
  ```ts
  import { Button } from '@/components/ui/button' // L1 dep instalada
  import { HeroBlock } from '@/components/blocks/hero-block' // L2 dep instalada
  ```
  NÃO usa imports do registry em runtime — tudo é código local após `shadcn add`.

**Decisão recomendada:** Composition via `registryDependencies` como mecanismo canônico. JSDoc `@composition` no contrato Zod é o "source of truth" semântico; `registryDependencies` no registry-item.json é o "source of truth" de instalação. Os dois devem ser mantidos em sincronia.

**Fonte:** https://ui.shadcn.com/docs/registry/registry-item-json + https://ui.shadcn.com/docs/registry/examples + análise `tweakcn-ref/utils/registry/themes.ts`

---

## F. Integração com Page Engine (ADR-0041)

### Findings

- **Spec JSONB Page Engine vs registry-item JSON — convergência:**

  | Aspecto               | Page Engine spec JSONB (ADR-0041)     | registry-item.json                            |
  | --------------------- | ------------------------------------- | --------------------------------------------- |
  | Identificador do tipo | `block.type` (ex: `"hero-block"`)     | `item.name` (ex: `"hero-block"`)              |
  | Props/configuração    | `block.props: {...}` (JSONB)          | `item.files[].content` (código fonte)         |
  | Composição            | `block.children[]` (árvore recursiva) | `item.registryDependencies[]`                 |
  | Schema                | Zod `BlockSchema` discriminated union | `registryItemSchema` (pacote `shadcn/schema`) |
  | Runtime               | Sim — renderer despacha por `type`    | Não — install-time apenas                     |
  | Versionamento         | `tenant_pages_versions` table         | Nome/URL segment (manual)                     |

  **Conclusão:** Page Engine spec é o **runtime representation** de uma composição de blocks. Registry-item é o **install-time distribution** do código de cada block. Os dois são complementares, não concorrentes.

- **`pages.kind` pode mapear para `registry-item.name`:**
  - Sim, diretamente: `pages.kind = 'transformation-funnel'` ↔ `registry-item.name = 'transformation-funnel'`
  - O renderer do Page Engine despacha por `block.type` — que deve ser idêntico ao `name` no registry
  - Isso garante: quando IA gera spec JSONB com `{ "type": "transformation-funnel" }`, o renderer sabe qual componente React renderizar (instalado localmente via registry)

- **AI orchestration — spec compatível com ambos formatos:**

  ```ts
  // IA emite PageSpec via generateObject (research-38 opção C)
  const spec = {
    type: "transformation-funnel",    // = registry-item.name
    props: {
      headline: "...",
      testimonials: [...],
      cta: { label: "...", href: "/..." }
    },
    children: []  // L3 smart blocks não têm children livres (composição fixa)
  }
  ```

  O `type` é a âncora que liga:
  1. `PageSpec.type` → renderer React component (`components/blocks/transformation-funnel.tsx`)
  2. `registry-item.name` → `npx shadcn add @platform/transformation-funnel`
  3. `lib/contracts/page-blocks/transformation-funnel.ts` → Zod schema validation
  4. `block_kinds_catalog.kind` (quando table existir) → AI hints, when_to_use, variants

- **Consequência prática para Fase 7:** quando `block_kinds_catalog` table for criada (JIT trigger: 3+ consumers), o `kind` field deve ser exatamente o `registry-item.name`. Sem mapeamento/alias — 1:1.

- **AI composer flow completo:**
  1. AI lê `lib/generated/block-catalog.json` (gerado por build script de JSDoc, research-38 C.3)
  2. AI emite `PageSpec` JSONB validado pelo Zod schema do block kind
  3. Spec salvo em `tenant_pages.spec_jsonb`
  4. Renderer Page Engine lê spec → importa `components/blocks/{type}.tsx` (instalado via registry)
  5. Quando block novo surge: `npx shadcn add @platform/new-block` → instala código + deps

**Decisão recomendada:** Manter `pages.kind` === `registry-item.name` como invariante. Nenhum alias ou mapeamento intermediário. A âncora `type/name/kind` é o sistema inteiro.

**Fonte:** ADR-0041 + research-38 §A-§C + análise dos patterns de composition desta sessão

---

## G. Recomendações Cravadas para ADR-0045

> Cada bullet = decisão cravável, referencia findings acima.

**G.1 — MCP shadcn: adotar agora (já ativo)**
MCP `shadcn@latest mcp` já está configurado em `.mcp.json`. Registry `@shadcn` já em `components.json`. Nenhuma ação necessária. Para registry `@platform`, adicionar namespace em `components.json.registries` quando primeiro block plataforma for instalável via CLI (JIT — Fase 7). MCP `shadcn@canary registry:mcp` já configurado pra TweakCN.

**G.2 — Hospedagem: plataforma única, não per-tenant**
Registry plataforma em `/api/r/[name].json`. Route handler Next.js com entitlement gate via RPC ADR-0039. Sem per-tenant registry até Fase 9+ (tenant-custom blocks). Endpoint temas exportados em `/api/r/themes/[tenantId]` público (sem auth, CORS aberto) — padrão TweakCN direto. Validar payload via `registryItemSchema.safeParse()` antes de retornar.

**G.3 — Namespace: `@platform` + `@desafit`**

- `@shadcn` — L1 primitives (imutável, não tocar)
- `@platform` — L2 semantic blocks + L3 smart universais (fitness/yoga/idiomas usam)
- `@desafit` — L3 smart vertical-fitness + temas exportados (`tenant-desafit-theme-v{n}`)
- Quando `yoga.app` entrar → `@yoga` namespace adicional. `@platform` sempre cresce primeiro.

**G.4 — Versionamento: nome sufixo pra temas, URL segment pra blocks**

- Temas: `tenant-desafit-theme-v{n}` no nome (padrão research-38 Anexo confirmado)
- Blocks: `/api/r/[name].json` sem version enquanto breaking changes não ocorrem. Quando ocorrerem: `/api/r/v2/[name].json` (route segment). Não criar infra de versioning antes do primeiro breaking change (JIT).

**G.5 — Composition rules por layer**

- L1 pode importar: apenas npm packages (`shadcn/ui` internals, Radix, etc.)
- L2 pode importar: L1 (`registryDependencies: ["@shadcn/button", "@shadcn/card"]`) + npm packages
- L3 pode importar: L2 do mesmo registry (`registryDependencies: ["@platform/hero-block", "@platform/cta-block"]`) + L1 + npm. L3 NÃO pode importar outro L3 (evita compositions circulares).
- Regra simples: dependência só desce, nunca sobe (mesma lógica das camadas `lib/`).

**G.6 — Bundle strategy: um catalog, split por type**

- Um registry plataforma (`/api/r/`) com `registry.json` raiz listando todos os items
- Blocks instalados localmente via `npx shadcn add` — sem runtime overhead do registry
- `lib/generated/block-catalog.json` (build script) contém AI hints — carregado só em server actions de geração, não em bundle cliente
- Não criar split por feature/vertical no registry — usar `vertical` field no JSDoc meta (research-38 §C.3)

**G.7 — AI MCP integration: consumir `@shadcn` diretamente, adapter pra `@platform`**

- IA cliente (Claude Code / Sonnet via server action) usa MCP `shadcn` para descobrir blocks disponíveis no `@shadcn` public registry
- Para blocks `@platform`, IA lê `lib/generated/block-catalog.json` diretamente (sem MCP overhead — é um JSON local)
- MCP `shadcn registry:mcp` (canary) é usado pra TweakCN themes (já configurado), NÃO como adapter pra `@platform` — overhead de MCP não justifica pra JSON local
- AI composer emite `PageSpec` (Zod-validated) usando block catalog como contexto — não chama MCP em runtime de geração

**G.8 — `pages.kind` === `registry-item.name` como invariante arquitetural**
Qualquer block que entrar no Page Engine DEVE ter `pages.kind` idêntico ao `registry-item.name` no registry `@platform`. Isso é a âncora que conecta: runtime spec JSONB → renderer React → CLI install → AI catalog. Nenhum alias ou mapeamento permitido. Documentar em `.claude/rules/registry-blocks.md` (Fase 7, §15.3 governance).

---

## Referências

- `.mcp.json` — config MCP atual do projeto (2 shadcn servers configurados)
- `components.json` — `registries: {}` vazio (pronto pra adicionar `@platform` JIT)
- `tweakcn-ref/app/r/themes/[id]/route.ts` — SSOT padrão route handler registry (validação + CORS)
- `tweakcn-ref/utils/registry/themes.ts` — geração payload `registry:style` com shadows + tracking
- `tweakcn-ref/utils/registry/v0.ts` — geração payload `registry:item` pra v0 (globals.css + layout.tsx + page.tsx)
- `tweakcn-ref/public/r/registry.json` — exemplo real de `registry.json` com items `registry:style` em OKLCH
- MCP tools executados: `get_project_registries`, `list_items_in_registries` (2x), `view_items_in_registries` (2x), `get_add_command_for_items`
- https://ui.shadcn.com/docs/registry — visão geral
- https://ui.shadcn.com/docs/registry/registry-item-json — schema completo
- https://ui.shadcn.com/docs/registry/getting-started — setup + composition
- https://ui.shadcn.com/docs/registry/authentication — auth: Bearer, API Key, query param
- https://ui.shadcn.com/docs/registry/open-in-v0 — limitações v0 (sem cssVars, sem headers auth, sem namespaced registries)
- https://ui.shadcn.com/docs/mcp — MCP server overview
- https://ui.shadcn.com/docs/registry/examples — padrões composition
- research-38 — registry embrionário Form/Page Engine + recomendações H.1-H.11
- ADR-0041 — engines Form + Page + kind polimórfico
- ADR-0039 — entitlements RPCs
- ADR-0024 — multi-tenant via hostname

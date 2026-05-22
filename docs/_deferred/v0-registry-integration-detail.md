# Deferred — v0 / Registry Integration (Fase 7 antiga, detail técnico portado)

> **Tipo:** deferred plan detail (não-bloqueante).
> **Origem:** `docs/plans/pivot-tweakcn.md` §8 Fase 7 (arquivado em
> `docs/_archive/plans/2026-05-pivot-tweakcn.md` em 2026-05-22).
> **Data porta:** 2026-05-22 (última ação da sessão antes de iniciar
> `docs/plans/theme-builder.md` em nova conversa).
> **Estimativa:** ~12h (research-41 §4.5)
> **Gatilho retorno:** funil agência precisar de páginas e formulários
> reusáveis + IA orchestrando blocks OR tenant Pro+ pedir explicitamente
> "starter project v0-compatible" OR após Pacote A ter 3+ tenants ativos.

---

## 0. Sobre este arquivo

Detail técnico do que era **Fase 7** do `pivot-tweakcn.md` arquivado.
ADR-0045 (Registry Strategy accepted 2026-05-21) já cravou todas as
decisões arquiteturais — este arquivo concentra a execução pendente.

**Princípio meta:** ADR-0045 D.1 cravou v0 **DEMOTED** (ideação dev-only,
não runtime). Endpoint registry pode ser construído JIT quando tenant
pedir "starter project v0-compatible" OR funil agência precisar de
páginas/formulários reusáveis com IA orchestrando blocks.

---

## 1. Goal original (porta do pivot §8)

Schema DB pra `tenant_pages`/`tenant_blocks` desde já + registry endpoint

- entitlement flag pro v0 generation (ativa quando 3+ tenants pedirem).

**Cravado em ADR-0045 accepted (2026-05-21):**

- **D.1** v0 **DEMOTED** (ideação dev-only, não runtime)
- **D.10** Registry hosting plataforma única (`/api/r/[name].json`)
- **D.11** 3 namespaces — `@shadcn` (L1 primitives) / `@platform` (L1.5
  wrappers + L2/L3 blocks compartilhados) / `@desafit` (tenant-specific)
- **D.12** Composition rules — L1↘npm / L2↘L1 / L3↘L2
- **D.13** Invariante âncora: `pages.kind === registry-item.name === components/blocks/{kind}.tsx`
- **D.14** Versionamento JIT (quando 2+ versions divergirem em produção)
- **D.15** `registry:style` type (confirmado tweakcn-ref + research-41 §4.2)

---

## 2. Estudos prévios (porta §8 do pivot)

> **Consolidados em research-41 §4 (audit Fase 7)** + research-40
> (shadcn registry deep-dive). Não re-executar quando retomar.

### S7.0 — Audit TweakCN `app/r/themes/[id]/route.ts` + `utils/registry/**`

**Consolidado em research-41 §4.** Mapeamento:

| Arquivo                             | LOC | Papel                                                                                                                                                  |
| ----------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/r/themes/[id]/route.ts`        | 69  | Registry endpoint `force-static`: built-in preset OR DB lookup → `generateThemeRegistryItemFromStyles` → validação `registryItemSchema` → JSON         |
| `utils/registry/themes.ts`          | 160 | Conversor: `ThemeStyles` → `registryItem` payload format (`registry:style` type, `cssVars.theme/light/dark`, shadows gerados por `getShadowMap`)       |
| `utils/registry/v0.ts`              | 400 | Gerador de 3 arquivos: `globals.css` (Tailwind v4 com `@theme inline`), `layout.tsx` (Next.js com Google Fonts import), `page.tsx` (color swatch demo) |
| `utils/registry/tailwind-colors.ts` | 314 | Mapa de cores Tailwind utility → hex (usado pelo código de registry, não pelo endpoint principal)                                                      |

**Total: ~943 LOC de registry utilities.**

### S7.0b — research-40 (shadcn registry deep-dive)

`docs/research/40-shadcn-registry-deep-dive.md` cravou G.1-G.8 (8
decisões). Relevantes pra Fase 7:

- **G.1** MCP `shadcn@canary registry:mcp` em `.mcp.json` (já configurado)
- **G.2** Private registries hosting próprio
- **G.3** Namespace conventions `@platform/@desafit` (cravado D.11)
- **G.4** Composition via `registryDependencies`
- **G.5** Auth Bearer/query
- **G.6** Per-tenant analysis (RLS via tenant_id)

### S7.2-S7.4 — Schema + theme aplicado + versionamento

**Decisões cravadas (porta direta do pivot §8):**

- `tenant_blocks` + `tenant_pages` spec JSONB tree-recursive
  `{ type, props, children[] }` (mesmo formato Page Engine ADR-0041)
- v0 output (TSX raw) PASSA por adapter que extrai spec — NÃO armazena
  TSX bruto
- Theme aplica out-of-box quando v0 gera shadcn-canonical (which v0
  does by default)
- Versionamento alinhado pattern `*_versions` engine catalog ADR-0041

### S7.5 — Registry strategy ✅ RESOLVIDO via ADR-0045

ADR-0045 accepted 2026-05-21 cravou 17 decisões.

---

## 3. Sub-tarefas detalhadas (porta §8 do pivot — ~12h)

> **Origem:** porta §8.1-§8.4 do pivot + research-41 §4.5 esforço breakdown.

### 3.1 Migration `tenant_pages` + `tenant_blocks` (~3h)

Aplicar via `mcp__plugin_supabase_supabase__apply_migration`:

```sql
-- 0026_tenant_pages_blocks.sql (exemplo — nome real define JIT quando aplicar)

CREATE TABLE public.tenant_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  kind text NOT NULL,            -- alinhado D.13 invariante
  spec jsonb NOT NULL,           -- BlockSpec Zod (Page Engine recursive)
  source text NOT NULL CHECK (source IN ('v0-generated', 'manual', 'preset', 'ai-generated')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE public.tenant_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  slug text NOT NULL,
  kind text NOT NULL,            -- 'landing', 'sales', 'about', etc (ADR-0041 D3)
  spec jsonb NOT NULL,           -- PageSpec Zod (recursive tree)
  active_page_version_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, slug)
);

-- + tenant_pages_versions + tenant_blocks_versions (pattern Hotmart-like ADR-0041)
-- + triggers immutability G.1
-- + RLS via auth.jwt() ->> 'tenant_id'
```

**Validação:**

- `mcp__supabase__list_tables` confirma 4 tabelas novas
- `mcp__supabase__get_advisors type=security` sem warnings
- `mcp__supabase__generate_typescript_types` atualiza
  `lib/contracts/database.ts`

### 3.2 Registry endpoint `/api/r/[name].json` (~3h)

**Estrutura:**

- `app/api/r/themes/[tenantId]/[version]/route.ts` — theme registry
  (porta `tweakcn-ref/app/r/themes/[id]/route.ts`)
- `app/api/r/blocks/[tenantId]/[name]/route.ts` — block registry
  (futuro)
- `app/api/r/pages/[tenantId]/[slug]/route.ts` — page registry (futuro)

**Adaptações cravadas (research-41 §4.5):**

- ADAPT `app/r/themes/[id]/route.ts` (69 LOC):
  - built-in preset lookup → `tenant_theme_versions` lookup
  - `force-static` → dinâmico com RLS check no `tenant_id`
  - CORS `*` → condicional (Bearer token pra cross-org)
- ADAPT `utils/registry/themes.ts` (160 LOC) → já em
  `lib/design/registry/generate-registry-item.ts` ✅ Fase 5 dia 0 prep
  - Adicionar `tracking-normal` rename
  - Expandir shadows 6→8 níveis via `getShadowMap()`
- DEFER `utils/registry/v0.ts` (400 LOC) — generate v0 globals.css +
  layout.tsx + page.tsx só quando `theme_export` entitlement existir
  (gatilho concreto)

**Payload format cravado (research-41 §4.2):**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "<themeName>",
  "type": "registry:style",
  "css": {
    "@layer base": {
      "body": { "letter-spacing": "var(--tracking-normal)" }
    }
  },
  "cssVars": {
    "theme": { "...": "..." },
    "light": { "...": "..." },
    "dark": { "...": "..." }
  }
}
```

### 3.3 `block_kinds_catalog` table criação (gatilho: 3 consumers — ADR-0045 D.2/D.3)

> **Status:** JIT (não criar agora). Gatilho concreto cravado em ADR-0045 D.3.

**Quando criar:** 3 features distintas precisam ler o catálogo
dinamicamente em runtime simultaneamente:

1. AI composer (`docs/_deferred/ai-theme-generation-detail.md` quando promovido)
2. Builder UI (Page Engine builder visual — futuro plano)
3. Dev tool exporter / preview tool (este detail file quando promovido)

**Hoje (2026-05-22) nenhuma existe ainda** — Fase 5 ainda não executou.
Promover quando primeiro batch de 3 estiver claro.

**Schema esperado (quando promover):**

```sql
CREATE TABLE public.block_kinds_catalog (
  kind text PRIMARY KEY,
  layer text NOT NULL CHECK (layer IN ('L1', 'L1.5', 'L2', 'L3')),
  category text NOT NULL,
  description text NOT NULL,
  props_schema jsonb NOT NULL,           -- Zod meta dump
  ai_hints jsonb,                        -- prompts/exemplos pro AI composer
  variants jsonb,                        -- list of variant unions
  composition jsonb,                     -- registryDependencies
  when_to_use text,
  anti_patterns jsonb,
  vertical text,                         -- fitness/yoga/idiomas/null
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 3.4 JSDoc `@registry-meta` + build script (interim até table — porta research-45)

**Interim:** JSDoc em `lib/contracts/page-blocks/*.ts` + build script
gera `lib/generated/block-catalog.json` (gitignored, prebuild).

```ts
/**
 * @registry-meta
 * kind: hero
 * layer: L2
 * category: marketing
 * description: Hero section com headline + CTA
 * when_to_use: Topo de landing page de produto
 * anti_patterns:
 *   - Não usar dentro de form
 *   - Não aninhar hero dentro de hero
 * variants: [default, gradient, video-bg]
 * composition: [button, container]
 */
export const HeroBlockSpec = z.object({ ... })
```

**Build script:** `scripts/build-block-catalog.ts`

- Parsea JSDoc `@registry-meta` em `lib/contracts/page-blocks/*.ts` +
  `lib/contracts/form-blocks/*.ts`
- Agrega → `lib/generated/block-catalog.json` (gitignored)
- Roda em `prebuild` script (npm hook)
- Quando `block_kinds_catalog` table promover: substitui via migration
  importando o JSON

### 3.5 Page Engine renderer base (~3h adicional, escopo Pacote A)

> **Status:** out-of-scope deste detail file — vai em plano dedicado
> quando Pages Engine bare-bones for executado (item 4 da ordem ADR-0046).

Quando renderer existir:

- `<PageRenderer spec={page.spec} />` recursive component
- Cada `block.type` mapeia pra `components/blocks/<type>.tsx` (invariante
  D.13)
- RSC default; client islands JIT

---

## 4. Entitlement flag `v0_generation` (porta §8.2 do pivot)

**Faz:** adicionar feature flag `v0_generation` em `entitlements.features`.

- Default: `false` em todos tenants
- Activate via admin manual (escopo: tenant Pro+ que pedir explicitamente)
- Endpoint skeleton respond `501 Not Implemented` com flag off
- Endpoint respond 200 com payload v0 generation (stub) com flag on

**Razão `v0_generation` mantido:** v0 demoted mas endpoint export
permanece útil pra devs gerarem starter project externo. Não é runtime
nosso — é ferramenta dev-only.

---

## 5. Cross-links

### ADR-0045 (cravou decisões — porta direta)

- **D.1** v0 DEMOTED (ideação dev-only, não runtime)
- **D.2/D.3** `block_kinds_catalog` JIT 3 consumers
- **D.10** Registry hosting plataforma única
- **D.11** 3 namespaces `@shadcn`/`@platform`/`@desafit`
- **D.12** Composition rules L1↘npm/L2↘L1/L3↘L2
- **D.13** Invariante `pages.kind === registry-item.name === components/blocks/{kind}.tsx`
- **D.14** Versionamento JIT (2+ versions divergirem)
- **D.15** `registry:style` type confirmado

### Outros

- ADR-0046 — dogfooding-first (gatilho retorno)
- ADR-0041 — engine catalog 2 motores (Page Engine spec recursive — base
  pro `tenant_pages.spec`)
- ADR-0044 — pivot TweakCN (princípio §8 extract+adapt)
- ADR-0039 — entitlements RPCs (`requireEntitlement('v0_generation')`)
- ADR-0024 — multi-brand via hostname (RLS via tenant_id)
- research-40 — shadcn registry deep-dive (G.1-G.8)
- research-41 §4 — Audit Fase 7 inteiro (não re-executar)
- research-45 — component strategy (folder `blocks/` + JSDoc
  `@registry-meta`)
- `tweakcn-ref/app/r/themes/[id]/route.ts` — SSOT registry endpoint
  (commit `9adabcf9`)
- `tweakcn-ref/utils/registry/themes.ts` — conversor payload
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` §8 — origem desta porta
- `docs/_deferred/post-funil-agencia.md` §2, §3, §4 — items relacionados

---

## 6. Checklist verificação (porta §8 do pivot — quando retomar)

- [ ] Estudos S7.1 (v0 SDK), S7.2 (schema), S7.3 (theme aplicado), S7.4
      (versionamento) — todos consolidados em research-41 §4 + research-40
- [ ] Migration `tenant_pages_blocks` aplicada
- [ ] Migration `tenant_pages_versions` + `tenant_blocks_versions`
      aplicadas (pattern `*_versions` ADR-0041)
- [ ] (condicional) Migration `block_kinds_catalog` aplicada SE 3
      consumers existirem (ADR-0045 D.2/D.3)
- [ ] Endpoint `/api/r/themes/[tenantId]/[version]` retorna
      `registry:style` válido (compatível `shadcn add <URL>`)
- [ ] (condicional) Endpoint `/api/r/blocks/[tenantId]/[name]` funcional
- [ ] (condicional) Endpoint `/api/r/pages/[tenantId]/[slug]` funcional
- [ ] Entitlement flag `v0_generation` em DB
- [ ] Endpoint skeleton respond 501 com flag off
- [ ] Endpoint respond 200 com flag on (stub)
- [ ] JSDoc `@registry-meta` + build script `scripts/build-block-catalog.ts`
      operacionais
- [ ] Auditoria blocos pré-existentes em formato registry-ready
      (princípio cross-cutting §15.1 J do pivot original) — refactor JIT
      antes de seguir
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm build` ✅
- [ ] Smoke test: `pnpm dlx shadcn add <our-endpoint-URL>` aplica theme
      em projeto dev externo

---

**Fim do detail file.**

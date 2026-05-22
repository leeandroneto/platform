---
name: Registry blocks — invariante D.13 + JSDoc @registry-meta canonical
description: pages.kind === registry-item.name === components/blocks/{kind}.tsx. Composition rules L1↘npm/L2↘L1/L3↘L2 (L3↘L3 proibido). 3 namespaces. Smart blocks composição declarada.
paths:
  - 'lib/contracts/page-blocks/**/*.ts'
  - 'lib/contracts/form-blocks/**/*.ts'
  - 'components/blocks/**/*.tsx'
---

## Princípio

ADR-0045 D.13 invariante arquitetural:

```
pages.kind === registry-item.name === components/blocks/{kind}.tsx
```

Quem cria block novo respeita nome canônico nas 3 surfaces
simultaneamente. **Sem alias, sem mapeamento intermediário.**

Renomear block = breaking change em 5 lugares (DB `pages.kind` enum,
contract Zod `page-blocks/<kind>.ts`, componente
`components/blocks/<kind>.tsx`, registry item `registry-item.name`,
catalog entry `block_kinds_catalog.kind` quando table existir).
Usar versionamento URL segment (`/api/r/v2/<name>`) em vez de renomear.

---

## JSDoc `@registry-meta` obrigatório

Cada block contract em `lib/contracts/page-blocks/<kind>.ts` ou
`lib/contracts/form-blocks/<kind>.ts` tem JSDoc no formato canonical:

```ts
/**
 * @registry-meta
 * {
 *   "kind": "hero-clinical",
 *   "category": "page-block",
 *   "version": "1.0.0",
 *   "description": "Hero section com autoridade médica (foto + credenciais)",
 *   "examples": ["protocolo-hormonal-landing", "consulta-cardiologica"],
 *   "when_to_use": ["landing pages de protocolo médico/clínico"],
 *   "anti_patterns": ["fitness genérico", "marketing geral sem evidência"],
 *   "related": ["hero-fitness", "cta-consultation"],
 *   "vertical": null
 * }
 */
export const HeroClinicalSpec = z.object({
  /* ... */
})
```

Campos:

- `kind` — string canônico (snake-case/kebab-case). Bate com `pages.kind`
  enum + nome do arquivo `components/blocks/<kind>.tsx` + `registry-item.name`
- `category` — `"primitive"` | `"page-block"` | `"form-block"` | `"smart-block"`
- `version` — semver (bump major em breaking change Zod schema)
- `description` — 1 linha humano-legível
- `examples` — array de slugs de pages/forms reais que usam (ou `[]` se
  ainda virgem)
- `when_to_use` — array de cenários onde block faz sentido
- `anti_patterns` — array de cenários onde NÃO usar
- `related` — array de `kind`s de blocks relacionados (variantes, etc)
- `vertical` — `null` (universal) | `"fitness"` | `"yoga"` | `"ingles"`
  (per ADR-0045 D.7 vertical extension)
- `composition` — opcional, smart blocks L3 (ver seção abaixo)

---

## Composition rules (ADR-0045 D.12)

Dependência só desce, nunca sobe:

| Camada                         | Pode importar                              |
| ------------------------------ | ------------------------------------------ |
| L1 (`@shadcn/*`)               | Apenas npm packages externos (Radix, etc.) |
| L2 (`@platform/*` page-block)  | L1 + utility libs npm                      |
| L3 (`@platform/*` smart-block) | L2 do mesmo ou outro namespace + L1 + npm  |

**L3 ↘ L3 PROIBIDO** — evita composições circulares. A âncora
`registryDependencies` no `registry-item.json` deve espelhar o campo
`@composition` no JSDoc.

---

## Namespaces (ADR-0045 D.11)

3 namespaces fixos:

- `@shadcn/*` — L1 primitives oficiais intocáveis (instalados via
  `npx shadcn add`, hook bloqueia Edit)
- `@platform/*` — L2/L3 universais cross-vertical (`hero`, `cta`, `faq`,
  `pricing`, etc.)
- `@desafit/*` — L3 vertical-specific fitness + temas exportados
  (`tenant-desafit-theme-v{n}`)

Quando `yoga.app` entrar como vertical 2: namespace `@yoga/*`
adicional. `@platform/*` sempre cresce antes de criar namespace
vertical (regra ADR-0045 D.11).

---

## Smart blocks — composição declarada (ADR-0045 D.8)

Smart block = composto declarado de L2 blocks. **NÃO tabela separada**:

```ts
/**
 * @registry-meta
 * {
 *   "kind": "transformation-funnel",
 *   "category": "smart-block",
 *   "version": "1.0.0",
 *   "description": "Landing fitness fully composed (hero + evidence + cta + faq)",
 *   "composition": ["hero-clinical", "evidence-grid", "cta-consultation", "faq-medical"],
 *   "vertical": "fitness"
 * }
 */
```

Renderer dispatcha por `type === 'transformation-funnel'` e busca
composição via catalog. JIT promove pra tabela `block_kinds_catalog`
quando 3 consumers gate disparar (AI composer + Builder UI + Dev
exporter — ADR-0045 §3).

**Migração pra tabela própria** só se smart block ganhar estado
server-side (analytics, automações, IA workflow embutido) que não
cabe em props estáticos.

---

## Build script catalog (DEFERRED — placeholder)

`scripts/build-block-catalog.ts` lê JSDocs → gera
`lib/generated/block-catalog.json` (gitignored, prebuild). NÃO criar
agora — gatilho cravado em
`docs/_deferred/v0-registry-integration-detail.md`:

- 5+ block contracts existirem em `lib/contracts/page-blocks/` OR
  `lib/contracts/form-blocks/`

Antes disso, AI composer consome JSDocs via leitura direta do filesystem
(ou injeção contextual no prompt). Catálogo dinâmico
(`block_kinds_catalog` table) entra DEPOIS, quando 3 consumers
simultâneos existirem (ADR-0045 §3).

---

## Condição de revisitar

| Gatilho                                                                 | Ação                                                                                               |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **5+ block contracts em `lib/contracts/page-blocks/`**                  | Criar `scripts/build-block-catalog.ts` (porta `_deferred/v0-registry-integration-detail.md` §239)  |
| **3+ consumers do catalog** (AI composer + Builder UI + Dev exporter)   | Promover JSON catalog → DB table `block_kinds_catalog` (ADR-0045 §3 + `_deferred/post-funil-*` §4) |
| **Vertical 2 ativa (`yoga` ou `ingles`)**                               | Criar namespace `@yoga/*` ou `@ingles/*` + atualizar tabela "Namespaces" desta rule                |
| **Block precisar de state server-side** (analytics/automation/workflow) | Migrar de composição declarada pra tabela própria via ADR (ADR-0045 D.8 trade-off)                 |
| **Renomear block kind necessário**                                      | URL segment versioning (`/api/r/v2/<name>`) — NÃO renomear (5 surfaces breaking)                   |
| **L3↘L3 surge em PR**                                                   | Bloquear via review humano (ESLint rule custom DEFERRED — JIT quando 5+ smart blocks existirem)    |

---

## Referências

- **ADR-0045** — Registry Strategy + AI Orchestration + Novel
  - D.8 — Smart blocks storage (composição declarada)
  - D.10 — Registry hosting plataforma única
  - D.11 — Namespaces 3 fixos
  - D.12 — Composition rules L1↘npm/L2↘L1/L3↘L2
  - D.13 — Invariante `pages.kind === registry-item.name === components/blocks/{kind}.tsx`
- `docs/research/40-shadcn-registry-deep-dive.md` — Private registry,
  namespaces, composition, auth flow
- `docs/research/45-component-strategy-best-practices.md` — Arsenal 20
  primitives + folder structure
- `.claude/rules/component-creation-governance.md` — Checklist A-J
  obrigatório (J = registry-ready)
- `.claude/rules/components.md` — Folder structure
  `components/blocks/*` invariante D.13
- `.claude/rules/shadcn-zone.md` — Zona quarentenada
  `components/ui/**`
- `.claude/rules/naming.md` — Vocab banido + `forms.kind` enum oficial
- `docs/_deferred/v0-registry-integration-detail.md` — Detail técnico
  Fase 7 antiga (`scripts/build-block-catalog.ts` + `block_kinds_catalog`
  table)
- `docs/_deferred/post-funil-agencia.md` §4, §12, §13 — Items deferred
  cross-link

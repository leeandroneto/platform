# 0028. Pools de customização (paletas, fontes, shapes) no banco

Date: 2026-05-17
Status: superseded by 0029 (paletas: clone pattern em vez de `custom_primary_oklch`) + schema `platform.*` consolidado em `public.*` via ADR-0033
Supersedes: 0027 (parcial — schema de tenant ajustado)

**Atualizado 2026-05-21 após ADR-0044 (pivot TweakCN-way).** Decisões sobre
pools no banco continuam válidas. Mudanças:

- Tabela `shape_presets` deprecada (ADR-0044 §5) — substituída por `--radius`
  único per-tenant em `tenant_theme_versions.snapshot.common.radius`.
- Tabela `palettes` continua reservada, mas o modelo principal de
  customização passa a ser `tenant_themes` + `tenant_theme_versions`
  (Fase 4 concluída — ver `docs/_archive/plans/2026-05-pivot-tweakcn.md`). Preset registry virá em
  `lib/design/presets/<slug>.ts`.
- Migration target: importar presets TweakCN via `pnpm dlx shadcn add
https://tweakcn.com/r/themes/<id>` ou pipeline `scripts/import-tweakcn-presets.ts`
  (Fase 5 — detalhe técnico em `docs/plans/theme-builder.md`).

## Why superseded

Esquema deste ADR colocou `platform.tenants.custom_primary_oklch text null` como hack pra prof customizar paleta. Não escala (prof quer customizar secondary, surfaces, extras → vira N colunas custom). ADR-0029 unifica TUDO no pattern template→instance: prof customizar paleta = CLONE em `platform.palettes` com `source_palette_id` + `created_by_tenant_id`. Princípios do 0028 (pools no banco, seed das 13/7/3 oficiais, brand-restricted via brand_id) permanecem.

## Context

ADR-0027 colocou as 13 paletas + 7 fontes + 3 shape presets como hardcoded em `lib/design/`. Tenant escolhe via UI, valor referencia ID em string. Limitação:

- Adicionar 14ª paleta = deploy + PR + ADR pivot
- Marca pai não pode restringir subset por marca filha
- Admin não pode desativar paleta obsoleta sem release
- Sem audit history de mudanças de pool

Conflita com princípio multi-tenant white-label: pools de customização **são dado**, não decisão arquitetural.

## Decision

3 tabelas novas em `platform.*`:

### `platform.palettes`

```
id              uuid pk
brand_id        uuid null fk platform.brands  -- null = disponível pra todas marcas
name            text not null
description     text null
primary_oklch       text not null  -- 'oklch(0.58 0.18 275)'
primary_light_oklch text null      -- light mode override
secondary_oklch     text not null
tertiary_oklch      text not null
extras_oklch        text[] not null  -- 5 chart colors derivadas
surfaces_dark       text[5] not null  -- L 0.13→0.37
surfaces_light      text[5] not null  -- L 0.98→0.85
hue                 int not null  -- usado em --brand-hue
is_official     bool not null default false  -- seed das 13 oficiais
is_active       bool not null default true
sort_order      int not null default 0
created_at      timestamptz default now()
updated_at      timestamptz default now()
```

### `platform.fonts`

```
id              uuid pk
brand_id        uuid null fk platform.brands
slug            text unique not null  -- 'geist', 'inter', 'outfit'
display_name    text not null
family_name     text not null  -- pra CSS font-family
provider        text not null check (provider in ('next-font-google','next-font-local','self-hosted'))
weights         int[] not null  -- [400, 500, 600, 700]
subsets         text[] not null default '{latin}'
is_official     bool not null default false
is_active       bool not null default true
sort_order      int not null default 0
created_at      timestamptz default now()
```

### `platform.shape_presets`

```
id              uuid pk
brand_id        uuid null fk platform.brands
slug            text unique not null  -- 'sharp', 'rounded', 'pill'
display_name    text not null
radius_base     text not null  -- '0.25rem'
radius_sm       text not null
radius_md       text not null
radius_lg       text not null
radius_xl       text not null
is_official     bool not null default false
is_active       bool not null default true
sort_order      int not null default 0
created_at      timestamptz default now()
```

### `platform.tenants` ajustes (substitui colunas ADR-0027)

```
-- Remove: palette_id text, font_id text, shape_preset enum
-- Adiciona:
palette_id          uuid not null fk platform.palettes  default <seed id 'default'>
custom_primary_oklch text null  -- override individual sem precisar criar paleta nova
font_id             uuid not null fk platform.fonts  default <seed id 'geist'>
shape_preset_id     uuid not null fk platform.shape_presets  default <seed id 'rounded'>
theme_version       int default 1
```

### Seed migration (idempotente)

`0001_initial` insere via `ON CONFLICT (slug) DO NOTHING`:

- 13 paletas oficiais (`is_official=true`, `brand_id=null`)
- 7 fontes oficiais (Geist, Inter, Outfit, Lora, Manrope, Plus Jakarta Sans, Space Grotesk)
- 3 shape presets (sharp, rounded, pill)

### Source of truth + drift detection

`lib/design/seeds/{palettes,fonts,shapes}.seed.ts` exporta dados typed pro seed inicial **e** pro CI:

- `pnpm validate:design-drift` compara banco vs seed → falha se divergente sem migration aprovada
- Mudança de paleta oficial = migration nova (`0002_update_palette_default.sql`) + seed file atualizado

### CSS via API route lê do banco

`/api/brands/[id]/theme.css` e `/api/tenants/[id]/theme.css`:

1. Lookup palette + font + shape preset do tenant (com fallback pro brand) via Supabase
2. Cache em-memória TTL 60s no edge
3. Emite OKLCH derivado via `deriveTokens()` server-side
4. Headers `Cache-Control: public, max-age=86400, immutable` + `?v=theme_version`

Bump `theme_version` invalida cache CDN sem revalidar todas as rotas.

## Consequences

**Positivo:**

- Admin adiciona/desativa paleta sem deploy
- Marca pai restringe subset por marca filha (via `brand_id` filter)
- Audit nativo via `updated_at`
- `globals.css` enxuga (sem 13 paletas inline = ~2KB economia, mas insignificante; clareza > tamanho)
- Tenant custom override (`custom_primary_oklch`) NÃO cria paleta nova — fica isolado
- UI gerenciamento futuro = CrudManager padrão
- Multi-marca limpo: `platform.palettes WHERE brand_id IS NULL OR brand_id = $tenant_brand`

**Negativo:**

- 3 tabelas extras dia 1 (24 → 27 baseline)
- 1 lookup DB por theme.css request (mitigação: cache 60s in-memory + Cache-Control CDN)
- Drift entre seed e banco se admin editar via UI (mitigação: `pnpm validate:design-drift` em CI)

**Neutro:**

- ADR-0027 superseded parcialmente: schema de tenant muda. Princípio "3 eixos customização dia 1" permanece
- `lib/design/palettes.ts` vira `lib/design/seeds/palettes.seed.ts` (declara seed + types)
- Migration `0001_initial` ganha 3 tabelas + INSERT seed
- `app/globals.css` boilerplate enxuga: só shadcn vars mapping + tokens estáticos
- `/api/brands/[id]/theme.css/route.ts` precisa rewrite pra lookup banco
- Custom paleta privada por tenant (15ª) = INSERT em `platform.palettes` com `brand_id=tenant.brand_id` (JIT — UI não dia 1, mas arquitetura suporta)

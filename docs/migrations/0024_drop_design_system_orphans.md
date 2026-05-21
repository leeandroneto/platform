# Migration 0024 — Drop design system orphans

> Aplicada em 2026-05-21 via `mcp__plugin_supabase_supabase__apply_migration`.
> Fase 1.5 do pivot ADR-0044 (TweakCN shadcn-canonical) — surgical drop dos
> objetos órfãos pós-Fase 1 (globals.css limpo do vocab invented + 6 PWA routes
> adaptadas pra DEFAULT_THEME canonical).

---

## Contexto

A Fase 1 do pivot ADR-0044 removeu do `globals.css` o vocab invented
(`--shape-*`, `--brand-hue`, `--color-surface-1..5`, `--color-info/success/warning`,
`--elevation-flat/raised/overlay`, etc) e estabeleceu shadcn-canonical
~45 keys TweakCN-vocab como interface pública obrigatória (32 cores + 3
fontes + 1 radius + 6 shadow primitives + shadow-color + letter-spacing +
spacing-opt).

Pós-Fase 1, nenhum código de runtime consumia mais:

- `tenants.archetype_id` (text — pointer pra `lib/design/archetypes/*` morto)
- `tenants.previous_archetype_id` + `tenants.archetype_changed_at` (rollback de archetype morto)
- `tenants.palette_id` (FK para `palettes` — clone template→instance morto)
- `tenants.font_id` (FK para `fonts` — pool morto)
- `brands.default_palette_id` (FK para `palettes` — achado novo do pré-fix Fase 1.5)
- Tabela `palettes` (clone template→instance morto pós-pivot)
- Tabela `fonts` (pool morto pós-pivot)
- Tabela `tenant_theme_presets` (presets nomeados — design rethink Fase 4)
- Função `default_palette_id()` (setava default da column `tenants.palette_id`)
- Função `default_font_id()` (setava default da column `tenants.font_id`)

## Pré-fix obrigatório — 6 PWA routes

Antes desta migration, 6 PWA API routes consumiam `palette_id` /
`default_palette_id` via JOIN à tabela `palettes`. Foram adaptadas pra
importar `DEFAULT_THEME` de `lib/design/theme-defaults.ts` (TweakCN canonical
copy-literal):

- `app/api/tenants/[id]/splash/[size]/route.tsx`
- `app/api/tenants/[id]/icon/[size]/route.tsx`
- `app/api/tenants/[id]/manifest.webmanifest/route.ts`
- `app/api/brands/[id]/splash/[size]/route.tsx`
- `app/api/brands/[id]/icon/[size]/route.tsx`
- `app/api/brands/[id]/manifest.webmanifest/route.ts`

`lib/route/getRouteByHost.ts` (select brand) e `lib/brand/types.ts` (interface
`Brand`) também foram limpos da column `default_palette_id`.

**Trade-off aceito:** PWA usa `DEFAULT_THEME` canonical até Fase 4 entregar
`tenant_themes` + `tenant_theme_versions` (snapshot per-tenant validado APCA
Silver). Aceitável: zero tenant em produção, plataforma greenfield pré-Fase 4.

## Decisão arquitetural

| Item                                                                | Resposta                                         |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| Manter columns dormentes "por garantia"?                            | ❌ Vocab confunde Claude futuro + drift schema   |
| Migrar dados pra nova estrutura agora?                              | ❌ Plataforma greenfield, zero dados pra migrar  |
| Criar `tenant_themes` + `tenant_theme_versions` na mesma migration? | ❌ Fase 4 do plano `pivot-tweakcn.md` faz isso   |
| Pre-fix consumers PWA antes da drop?                                | ✅ Sem isso a migration quebra 6 routes em build |

## SQL aplicado

```sql
-- 0024_drop_design_system_orphans.sql
-- Pós-Fase 1 do pivot ADR-0044: zero código consome esses objetos (após
-- pré-fix das 6 PWA routes que passaram a usar DEFAULT_THEME canonical).

-- 1. Drop FK constraints + columns de tenants
ALTER TABLE public.tenants
  DROP COLUMN IF EXISTS archetype_id,
  DROP COLUMN IF EXISTS previous_archetype_id,
  DROP COLUMN IF EXISTS archetype_changed_at,
  DROP COLUMN IF EXISTS palette_id,
  DROP COLUMN IF EXISTS font_id;

-- 1b. Drop column órfã em brands (achado novo do pre-fix Fase 1.5)
ALTER TABLE public.brands
  DROP COLUMN IF EXISTS default_palette_id;

-- 2. Drop functions que setavam defaults dessas columns
DROP FUNCTION IF EXISTS public.default_palette_id();
DROP FUNCTION IF EXISTS public.default_font_id();

-- 3. Drop tabelas obsoletas (vocab morto / FKs já cascadeados)
DROP TABLE IF EXISTS public.tenant_theme_presets CASCADE;
DROP TABLE IF EXISTS public.palettes CASCADE;
DROP TABLE IF EXISTS public.fonts CASCADE;
```

## Estado pré → pós

| Antes (pré-migration)                                               | Depois (pós-migration)                                |
| ------------------------------------------------------------------- | ----------------------------------------------------- |
| `tenants` tem 26 columns (incluindo 5 órfãs do design system morto) | `tenants` tem 21 columns canonical                    |
| `brands` tem 11 columns (incluindo `default_palette_id`)            | `brands` tem 10 columns canonical                     |
| `public.palettes` table (13 paletas seed)                           | Table gone — DEFAULT_THEME canonical é a SSOT         |
| `public.fonts` table (7 fonts seed)                                 | Table gone — 3 fontes canonical em DEFAULT_COMMON     |
| `public.tenant_theme_presets` table (vazia)                         | Table gone — Fase 4 vai criar `tenant_theme_versions` |
| `default_palette_id()` + `default_font_id()` functions              | Functions gone                                        |

## Objetos droppados

### Tenants columns (5)

- `archetype_id text` (pointer pra archetype morto)
- `previous_archetype_id text` (rollback morto)
- `archetype_changed_at timestamptz` (audit morto)
- `palette_id uuid FK palettes`
- `font_id uuid FK fonts`

### Brands column (1) — achado novo

- `default_palette_id uuid FK palettes`

### Functions (2)

- `default_palette_id()` returns uuid
- `default_font_id()` returns uuid

### Tables (3)

- `tenant_theme_presets` (schema reserve não-usada — migration 0021)
- `palettes` (template→instance ADR-0028 — vocab morto pós-pivot)
- `fonts` (pool ADR-0028 — vocab morto pós-pivot)

## Validações executadas pós-migration

- ✅ tenants columns conferida (21 columns, sem archetype/palette/font_id)
- ✅ brands columns conferida (10 columns, sem default_palette_id)
- ✅ palettes/fonts/tenant_theme_presets gone (`information_schema.tables` retorna 0 rows)
- ✅ Types regenerados via MCP — zero match pra 'palettes'/'fonts'/'tenant_theme_presets'/'palette_id'/'font_id'/'archetype_id'/'default_palette_id'
- ✅ `pnpm typecheck` zero erros
- ✅ `pnpm lint --max-warnings 0` 0/0
- ✅ `pnpm vocab:audit` clean
- ✅ `pnpm token:audit` clean
- ✅ `pnpm build` verde (PWA routes renderizam DEFAULT_THEME)
- ✅ `pnpm dev` + `curl /` → HTTP 200

## O que essa migration NÃO faz (escopo deferido pra Fase 4)

- ❌ Não cria `tenant_themes` (Fase 4 do plano `pivot-tweakcn.md`)
- ❌ Não cria `tenant_theme_versions` (Fase 4)
- ❌ Não adiciona `tenants.active_theme_version_id` (Fase 4)
- ❌ Não importa presets TweakCN como seed (Fase 4-8)
- ❌ Não toca em `tenants.theme_mode` ou `tenants.theme_version` (continuam úteis)
- ❌ Não toca em entitlement tables, plans, subscriptions (escopo zero)

## Referências

- ADR-0044 — pivot TweakCN-way (autoritativa)
- `docs/plans/pivot-tweakcn.md` §2.5 — escopo Fase 1.5
- `lib/design/theme-defaults.ts` — DEFAULT_THEME canonical (copy-literal TweakCN)
- `lib/design/contract/theme.ts` — Zod ThemeSchema (45 keys)
- `lib/design/build-theme-css.ts` — emit CSS runtime
- Migrations relacionadas: 0020 (foundation design system — superseded), 0021
  (tenant_theme_presets reserve — superseded)

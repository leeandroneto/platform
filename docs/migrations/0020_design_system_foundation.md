# Migration 0020 — Design system foundation

> Aplicada em 2026-05-20 via `mcp__supabase__apply_migration` (versão `20260520...`).
> Implementa decisões A1, A2, A3 do ARCHITECTURE.md (§11 — decisões cravadas).
> Substitui migrations `0018_design_system_transformation` + `0019_revert_design_system_transformation` (tentativa anterior revertida — renumerada para 0020 por preservação do histórico).

---

## Motivação

Foundation do design system multi-tenant multi-archetype:

- **A1 — `tenants.archetype_id text`** (não uuid FK): archetype é configuração em código versionado (`lib/design/archetypes/<id>/`), não entidade de domínio. Adicionar archetype #23 = pasta + PR, sem migration.
- **A2 — radius travado por archetype**: `shape_presets` table dropada. Tenant não escolhe radius granular — é DNA do archetype.
- **A3 — tonal derivation híbrida em `palettes`**: adiciona `seed_oklch` + `supports_tonal_derivation` flag. Paletas existentes (13 originais) continuam funcionando com primary_oklch; paletas brand-\* novas podem usar tonal derivation via culori.
- **Swap workflow audit trail**: `previous_archetype_id` + `archetype_changed_at` em `tenants`.
- **Theme mode**: `theme_mode text CHECK (light/dark/auto)` em `tenants` (D-30/B3 — archetype declara `supportsLight/supportsDark`, validação no app-layer).

## O que essa migration faz

### A. Drop `shape_presets` (decisão A2)

```sql
ALTER TABLE public.tenants DROP COLUMN IF EXISTS shape_preset_id;
DROP FUNCTION IF EXISTS public.default_shape_preset_id() CASCADE;
DROP TABLE IF EXISTS public.shape_presets CASCADE;
```

Remove a FK + função default + tabela. Tenants existentes perdem a coluna (radius vem agora do archetype config).

### B. `tenants` — colunas runtime do design system

```sql
ALTER TABLE public.tenants
  ADD COLUMN archetype_id text NOT NULL DEFAULT 'linear';

ALTER TABLE public.tenants
  ADD COLUMN theme_mode text NOT NULL DEFAULT 'auto'
  CONSTRAINT tenants_theme_mode_check
    CHECK (theme_mode IN ('light', 'dark', 'auto'));

ALTER TABLE public.tenants
  ADD COLUMN previous_archetype_id text NULL;

ALTER TABLE public.tenants
  ADD COLUMN archetype_changed_at timestamptz NULL;
```

- `archetype_id text` default `'linear'` — tenants pré-existentes ganham archetype neutro (escolha pode mudar depois via swap workflow)
- `theme_mode` CHECK constraint — validação adicional em Zod (`archetype.supportsLight`/`supportsDark`) na app-layer
- `previous_archetype_id` + `archetype_changed_at` — audit trail pro swap workflow (D-28)

### C. `palettes` — tonal derivation híbrida (decisão A3)

```sql
ALTER TABLE public.palettes
  ADD COLUMN seed_oklch text NULL;

ALTER TABLE public.palettes
  ADD COLUMN supports_tonal_derivation boolean NOT NULL DEFAULT false;
```

- `seed_oklch text NULL` — formato `oklch(L C H)` ou triplos brutos. NULL = paleta legacy usa primary_oklch direto
- `supports_tonal_derivation boolean DEFAULT false` — flag pra ativar derivação via culori. Paletas legacy (13 originais) ficam false; paletas brand-\* novas podem ser true conforme archetype precisar

### D. Comentários documentais

Cada coluna nova tem `COMMENT ON COLUMN` apontando pra decisão arquitetural (A1, A2, A3) + ARCHITECTURE.md como referência.

## Estado pré → pós

| Antes                              | Depois                                     |
| ---------------------------------- | ------------------------------------------ |
| `shape_presets` table (3 rows)     | dropada                                    |
| `tenants.shape_preset_id uuid FK`  | removida                                   |
| `tenants` sem archetype/theme_mode | 4 colunas novas (archetype/theme/audit)    |
| `palettes` sem tonal derivation    | 2 colunas novas (seed_oklch/supports flag) |
| `default_shape_preset_id()` func   | dropada (CASCADE)                          |

## Tenants pré-existentes — comportamento

2 tenants no banco no momento da aplicação:

- `archetype_id` ← `'linear'` (default — archetype neutro dark)
- `theme_mode` ← `'auto'` (default — segue preferência do sistema)
- `previous_archetype_id` ← NULL (primeiro estado)
- `archetype_changed_at` ← NULL (não trocaram ainda)
- `palette_id` ← mantido (uuid FK — não tocada)
- `font_id` ← mantido
- `theme_version` ← mantido

13 paletas pré-existentes:

- `seed_oklch` ← NULL (legacy — usa `primary_oklch`)
- `supports_tonal_derivation` ← false (não habilitam derivação até admin migrar)

## Validações executadas pós-migration

- ✅ `shape_presets` não existe mais (`information_schema.tables`)
- ✅ 4 colunas novas em `tenants` (information_schema.columns)
- ✅ 2 colunas novas em `palettes`
- ✅ 2 tenants pré-existentes com `archetype_id='linear'` + `theme_mode='auto'`
- ✅ `mcp__supabase__get_advisors security`: 0 warnings novos (5 totais, todos pré-existentes do dia 0)
- ✅ `mcp__supabase__generate_typescript_types`: regenerado, `lib/contracts/database.ts` atualizado
- ✅ `pnpm typecheck`: 0 erros

## Próximos passos

- Passo 1.3: `lib/design/contract.ts` + `roles.ts` + `_template/` scaffold
- Passo 1.4: 22 esqueletos `archetypes/<id>/`
- Passo 1.5: `generateThemeCSS()` function pura
- Plano completo: `docs/plans/design-system.md`

## Referências

- ARCHITECTURE.md §3 (fluxo), §5 (tokens), §11 (8 decisões)
- 12-decisions-resolved.md #6, #7, #8
- ADR-0028/0029 (paletas template→instance — mantidas)
- ADR-0042 (3 elevations — candidata superseded por fallback chain de shadows)

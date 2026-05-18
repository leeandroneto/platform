# Migration 0005 — Consolidação `platform.*` → `public.*` (ADR-0033)

> Aplicada em 2026-05-18 via `mcp__supabase__apply_migration`.
> Spec original do banco em 2026-05-17 (migration 0001) separava `platform.*`
> (produto) de `public.*` (catálogos). ADR-0033 supersedeu essa decisão e
> consolidou tudo em `public.*`. Esta migration documenta exatamente o que rodou.

---

## Motivação

Fricção operacional dia 0 com schema separado:

1. MCP `generate_typescript_types` defaultava pra `public` — type gen quebrava
2. PostgREST exigia expose manual do schema `platform` no dashboard
3. Toda query precisava `.schema('platform').from('x')` — fricção + silent failure
4. Tooling externo (tutoriais Supabase, Vercel templates) assume `public`

RLS já era a fronteira de segurança (não schema), e auditoria pré-migration
mostrou 0 colisões de nome entre os schemas. Janela ótima pra consolidar
(greenfield, M0, zero usuário).

Detalhes: `docs/adr/0033-consolidate-platform-to-public.md`.

---

## O que rodou (atômico, transacional)

### 1. DROP 3 policies com `FROM platform.tenants` no body

```sql
DROP POLICY IF EXISTS fonts_read ON platform.fonts;
DROP POLICY IF EXISTS palettes_read ON platform.palettes;
DROP POLICY IF EXISTS shape_presets_read ON platform.shape_presets;
```

### 2. DROP 3 column defaults chamando `platform.default_*_id()`

```sql
ALTER TABLE platform.tenants ALTER COLUMN font_id DROP DEFAULT;
ALTER TABLE platform.tenants ALTER COLUMN palette_id DROP DEFAULT;
ALTER TABLE platform.tenants ALTER COLUMN shape_preset_id DROP DEFAULT;
```

### 3. DROP 3 funções helper em `platform.*`

```sql
DROP FUNCTION platform.default_font_id();
DROP FUNCTION platform.default_palette_id();
DROP FUNCTION platform.default_shape_preset_id();
```

### 4. ALTER TABLE SET SCHEMA × 25 tabelas

Todas movidas `platform.*` → `public.*`:

| # | Tabela |
|---|---|
| 1 | assessments |
| 2 | brands |
| 3 | capture_forms |
| 4 | capture_submissions |
| 5 | component_schedules |
| 6 | components |
| 7 | domains |
| 8 | email_templates |
| 9 | enrollments |
| 10 | fonts |
| 11 | leads |
| 12 | memberships |
| 13 | modules |
| 14 | page_versions |
| 15 | pages |
| 16 | palettes |
| 17 | payments |
| 18 | profiles |
| 19 | programs |
| 20 | push_subscriptions |
| 21 | push_templates |
| 22 | shape_presets |
| 23 | subscriptions |
| 24 | tenant_gateway_credentials |
| 25 | tenants |

Triggers, indexes, FK constraints, ~80 policies não afetadas (movem com a tabela).

### 5. CREATE OR REPLACE 3 funções helper em `public.*`

```sql
CREATE OR REPLACE FUNCTION public.default_font_id() ...
  FROM public.fonts WHERE slug = 'geist' LIMIT 1;

CREATE OR REPLACE FUNCTION public.default_palette_id() ...
  FROM public.palettes WHERE slug = 'default' AND is_official = true LIMIT 1;

CREATE OR REPLACE FUNCTION public.default_shape_preset_id() ...
  FROM public.shape_presets WHERE slug = 'rounded' LIMIT 1;
```

### 6. CREATE OR REPLACE 5 funções existentes em `public.*` (body rewrite)

Todas com refs `platform.*` substituídas por `public.*`:

- `public.check_host_unique_brand` — checa `public.domains`
- `public.check_host_unique_domain` — checa `public.brands`
- `public.custom_access_token_hook` — JOIN `public.memberships` + `public.tenants`
- `public.handle_new_user` — INSERT em `public.{profiles, brands, tenants, memberships}`
- `public.on_tenant_soft_delete` — UPDATE cascade em 18 tabelas `public.*`

### 7. CREATE 3 policies novas com `FROM public.tenants`

```sql
CREATE POLICY fonts_read ON public.fonts FOR SELECT TO anon, authenticated
USING (deleted_at IS NULL AND (is_official = true OR brand_id IN (
  SELECT t.brand_id FROM public.tenants t WHERE t.id = (SELECT public.current_tenant_id())
)));

-- Idem palettes_read (com clone via created_by_tenant_id)
-- Idem shape_presets_read
```

### 8. SET DEFAULT × 3 columns em `public.tenants`

```sql
ALTER TABLE public.tenants ALTER COLUMN font_id SET DEFAULT public.default_font_id();
ALTER TABLE public.tenants ALTER COLUMN palette_id SET DEFAULT public.default_palette_id();
ALTER TABLE public.tenants ALTER COLUMN shape_preset_id SET DEFAULT public.default_shape_preset_id();
```

### 9. GRANT EXECUTE em helpers

```sql
GRANT EXECUTE ON FUNCTION public.default_font_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.default_palette_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.default_shape_preset_id() TO authenticated;
```

### 10. DROP SCHEMA platform

```sql
DROP SCHEMA platform;
```

(Sem `CASCADE` — schema estava vazio, garantia explícita.)

---

## Migration 0006 (cleanup)

Após 0005 aplicada, PostgREST entrou em loop 503 PGRST002 porque a config
`db-schemas` ainda incluía `platform` (foi exposto manualmente no dashboard
durante fase 3 pra resolver o problema MCP).

Resolução: recriei `platform` vazio momentaneamente → schema cache do PostgREST
voltou ao ar em ~1min → MCP `generate_typescript_types` voltou a funcionar →
migration `0006_drop_platform_schema_after_consolidation` dropou definitivamente.

Migration 0006 conteúdo:
```sql
DROP SCHEMA IF EXISTS platform;
```

---

## Smoke test pós-migration

Executado via `mcp__supabase__execute_sql` (2026-05-18):

| Check | Esperado | Resultado |
|---|---|---|
| `count(*) public_tables` | 37 (12 catálogos + 25 ex-platform) | 37 ✅ |
| `EXISTS schema platform` | false | false ✅ |
| `count(*) palettes WHERE is_official` | 13 | 13 ✅ |
| `count(*) fonts WHERE is_official` | 7 | 7 ✅ |
| `count(*) shape_presets WHERE is_official` | 3 | 3 ✅ |
| `count(*) brands WHERE name='desafit'` | 1 | 1 ✅ |
| `tenants.font_id default expr` | `default_font_id()` | OK ✅ |
| `tenants.palette_id default expr` | `default_palette_id()` | OK ✅ |
| `tenants.shape_preset_id default expr` | `default_shape_preset_id()` | OK ✅ |
| Funções `public.*` com refs stale `platform.` | 0 | 0 ✅ |
| Tabelas `public.*` com RLS habilitada | 37 | 37 ✅ |
| Policies `public.*` total | 98 | 98 ✅ |
| Policies com refs stale `platform.` | 0 | 0 ✅ |

---

## Cleanup pós-migration

1. `lib/contracts/database.ts` regenerado via `mcp__supabase__generate_typescript_types`
   (2175 linhas, schema `public` exclusivamente)
2. `.schema('platform')` removido dos 4 call sites:
   - `lib/route/getRouteByHost.ts` (2×)
   - `app/api/brands/[id]/theme.css/route.ts`
   - `app/api/tenants/[id]/theme.css/route.ts`
3. `.claude/rules/schema-separation.md` deletado (não há mais regra de schemas separados)
4. Docs atualizadas: CLAUDE.md, 03-naming-vocab.md, 06-data-model.md,
   01-arquitetura.md, 14-docs-lifecycle.md, 16-claude-code.md,
   17-repo-bootstrap.md, e outros blueprints via bulk replace `` `platform.` ``
   → `` `public.` ``
5. ADRs 0021/0024-0029/0031 ganharam nota no Status apontando pra ADR-0033

---

## Migrations futuras (incrementais)

- `0007_add_plans_table` — `public.plans` (entitlements ADR-0034, Tarefa 25.5)
- `0008_add_chatbot_threads` — Pacote C chatbot (Sprint 14)
- (próximas JIT — princípio §39)

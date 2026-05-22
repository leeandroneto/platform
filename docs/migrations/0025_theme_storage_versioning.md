# Migration 0025 — Theme storage + versionamento (Fase 4 ADR-0044)

> Aplicada em 2026-05-21 via `mcp__plugin_supabase_supabase__apply_migration`.
> Fase 4 do pivot ADR-0044 (TweakCN shadcn-canonical) — backend completo de
> tema versionado per-tenant (storage + imutabilidade + cap 50 + RLS).
>
> Acompanha 0025b (search_path pin nas 2 funções, fecha advisor WARN
> `function_search_path_mutable`).

> **Nota pós-refactor 2026-05-21:** a coluna `snapshot jsonb` em
> `tenant_theme_versions` é inalterada (sem DDL novo). O _type_ TypeScript
> do snapshot mudou: shape anterior `{ light, dark, common }` foi substituído
> por flat `{ light: {45 keys}, dark: {45 keys} }` alinhado com TweakCN
> upstream. Validação é application-layer (Zod `ThemeSchema`), não constraint
> SQL — portanto nenhuma migration de dados foi necessária (`tenant_theme_versions`
> tinha 0 rows quando o refactor foi aplicado, verificado via MCP `execute_sql`).

---

## Contexto

A Fase 1.5 (migration 0024) dropou os objetos órfãos do modelo OLD
(palettes/fonts/tenant_theme_presets/archetype). Restou apenas:

- `tenants.theme_version` (int — cache busting do PWA, pre-Fase-4)
- `tenants.theme_mode` (text — 'auto' | 'light' | 'dark', G.4)

Fase 4 entrega o backend de tema versionado conforme ADR-0044 + estudo
[`docs/research/33-theme-versioning-pattern.md`](../research/33-theme-versioning-pattern.md):

1. Catálogo per-tenant (`tenant_themes`) — múltiplos themes ativos/inativos.
2. Versões imutáveis (`tenant_theme_versions`) — snapshot Zod-validado Hotmart-like.
3. FK ativa em `tenants.active_theme_version_id` — runtime resolve via 1 join.

---

## Decisões cravadas (G.1-G.5 — referência research-33)

| Decisão | Conteúdo                                                    | Como aparece na migration                                                                                                                              |
| ------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **G.1** | Snapshot imutável-on-insert (não permite UPDATE)            | Trigger `prevent_theme_version_mutation` + ausência de policy UPDATE/DELETE em `tenant_theme_versions`                                                 |
| **G.2** | Cap 50 versões por theme                                    | Trigger `enforce_theme_version_cap` (BEFORE INSERT, RAISE EXCEPTION em count ≥ 50)                                                                     |
| **G.3** | Fork JIT Fase 5 (não criar `forkTheme` action agora)        | Column `parent_theme_id uuid NULL` self-FK reservada; ação correspondente fica pra Fase 5                                                              |
| **G.4** | `theme_mode` separado do snapshot (UX preference ortogonal) | `tenants.theme_mode` continua existindo separado; snapshot só armazena cores+fontes+radius+shadows                                                     |
| **G.5** | Lazy bootstrap (zero seeds em migration)                    | Sem INSERT em tenant_themes/tenant_theme_versions. Server action `bootstrapTenantTheme(tenantId)` cria primeiro theme + version v1 quando user precisa |

---

## SQL aplicado (literal)

```sql
-- ─── 1. ALTER tenants ADD active_theme_version_id (sem FK ainda) ────────────
ALTER TABLE public.tenants
  ADD COLUMN active_theme_version_id uuid NULL;

-- ─── 2. tenant_themes (catalogo per-tenant) ─────────────────────────────────
CREATE TABLE public.tenant_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  source text NOT NULL CHECK (source IN ('preset','custom','ai-generated','imported-tweakcn')),
  parent_theme_id uuid NULL REFERENCES public.tenant_themes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,
  UNIQUE (tenant_id, name)
);

CREATE INDEX tenant_themes_tenant_id_idx ON public.tenant_themes(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX tenant_themes_parent_idx ON public.tenant_themes(parent_theme_id) WHERE parent_theme_id IS NOT NULL;

-- ─── 3. tenant_theme_versions (snapshot imutavel Hotmart-like) ──────────────
CREATE TABLE public.tenant_theme_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid NOT NULL REFERENCES public.tenant_themes(id) ON DELETE CASCADE,
  version_number int NOT NULL CHECK (version_number > 0),
  snapshot jsonb NOT NULL,
  prompt_text text NULL,
  ai_model_id text NULL,
  created_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (theme_id, version_number)
);

CREATE INDEX tenant_theme_versions_theme_idx ON public.tenant_theme_versions(theme_id, version_number DESC);

-- ─── 4. FK active_theme_version (agora que table existe) ────────────────────
ALTER TABLE public.tenants
  ADD CONSTRAINT tenants_active_theme_version_id_fkey
  FOREIGN KEY (active_theme_version_id) REFERENCES public.tenant_theme_versions(id) ON DELETE SET NULL;

CREATE INDEX tenants_active_theme_version_id_idx ON public.tenants(active_theme_version_id) WHERE active_theme_version_id IS NOT NULL;

-- ─── 5. Trigger imutável-on-insert (G.1) ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.prevent_theme_version_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.snapshot IS DISTINCT FROM OLD.snapshot
     OR NEW.version_number IS DISTINCT FROM OLD.version_number
     OR NEW.theme_id IS DISTINCT FROM OLD.theme_id THEN
    RAISE EXCEPTION 'tenant_theme_versions.{snapshot,version_number,theme_id} are immutable (ADR-0044 G.1)';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER tenant_theme_versions_immutable
BEFORE UPDATE ON public.tenant_theme_versions
FOR EACH ROW EXECUTE FUNCTION public.prevent_theme_version_mutation();

-- ─── 6. Trigger cap 50 versions per theme (G.2) ─────────────────────────────
CREATE OR REPLACE FUNCTION public.enforce_theme_version_cap()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE current_count int;
BEGIN
  SELECT count(*) INTO current_count FROM public.tenant_theme_versions WHERE theme_id = NEW.theme_id;
  IF current_count >= 50 THEN
    RAISE EXCEPTION 'theme version cap reached (50). delete antigas ou crie novo theme (ADR-0044 G.2)';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER tenant_theme_versions_cap
BEFORE INSERT ON public.tenant_theme_versions
FOR EACH ROW EXECUTE FUNCTION public.enforce_theme_version_cap();

-- ─── 7. RLS via JWT tenant_id (ADR-0033 canonical pattern) ──────────────────
ALTER TABLE public.tenant_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_theme_versions ENABLE ROW LEVEL SECURITY;

-- 7a. tenant_themes — próprio tenant
CREATE POLICY tenant_themes_select ON public.tenant_themes
  FOR SELECT USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_themes_insert ON public.tenant_themes
  FOR INSERT WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_themes_update ON public.tenant_themes
  FOR UPDATE USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
                 WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_themes_delete ON public.tenant_themes
  FOR DELETE USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- 7b. tenant_theme_versions — herda tenant_id via theme FK
CREATE POLICY tenant_theme_versions_select ON public.tenant_theme_versions
  FOR SELECT USING (
    theme_id IN (SELECT id FROM public.tenant_themes WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
  );
CREATE POLICY tenant_theme_versions_insert ON public.tenant_theme_versions
  FOR INSERT WITH CHECK (
    theme_id IN (SELECT id FROM public.tenant_themes WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
  );
-- NO UPDATE/DELETE policies — imutável (G.1). Service role bypass pra GC.

-- ─── 8. Grants ──────────────────────────────────────────────────────────────
GRANT ALL ON public.tenant_themes TO service_role;
GRANT ALL ON public.tenant_theme_versions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_themes TO authenticated;
GRANT SELECT, INSERT ON public.tenant_theme_versions TO authenticated;
```

---

## 0025b — Pin search_path nas funções

```sql
ALTER FUNCTION public.prevent_theme_version_mutation() SET search_path = 'public, pg_catalog';
ALTER FUNCTION public.enforce_theme_version_cap()     SET search_path = 'public, pg_catalog';
```

Fecha advisor WARN `function_search_path_mutable` que apareceu pós-0025.

---

## Workflow profissional (operação dos engines)

1. **Bootstrap (lazy, G.5)** — primeira vez que profissional abre Theme
   Studio (Fase 5 UI), action `bootstrapTenantTheme(tenantId)`:
   - Se `tenants.active_theme_version_id IS NULL`, cria theme "Default"
     com `source='preset'` + version v1 (snapshot = `DEFAULT_THEME`
     canonical TweakCN-zinc) + seta FK.
   - Idempotente: chamadas subsequentes retornam o theme/version existente.

2. **Save** — quando profissional edita tema (ou IA gera via prompt), action
   `saveThemeVersion({themeId, snapshot, promptText?, aiModelId?})`:
   - Valida snapshot via `ThemeSchema.safeParse` (Zod) → `fail(invalidInput, key='themes.snapshot_invalid')` se inválido.
   - Calcula `nextVersionNumber = max(version_number) + 1`.
   - INSERT (trigger cap 50 protege).
   - **Não swap automático da `active_theme_version_id`** — fica preview até user clicar "Aplicar".

3. **List** — `listThemeVersions(themeId)` lista até 50 versões em ordem
   decrescente, marca `isActive` comparando com tenant FK.

4. **Restore** — `restoreThemeVersion({tenantId, versionId})` faz swap da
   FK `tenants.active_theme_version_id` (decisão D.2.a: **swap, não copy**).
   Valida cross-tenant via `tenant_themes!inner(tenant_id)` join + check.

---

## Trade-offs cravados

- **Sem UI ainda.** Theme Studio (Fase 5) entrega editor visual + flow IA.
  Fase 4 só backend + integração runtime (layout + 3 PWA routes).
- **Fork action deferida (G.3).** `parent_theme_id` column existe pra
  registrar lineage quando Fase 5 entregar `forkTheme(themeId)`.
- **Cap 50 hard-fail vs soft-delete.** Decisão D.4: bloqueia 51ª inserção,
  forçando user deletar antigas. Soft-delete (`deleted_at`) reservado pra
  themes do catálogo, não versions.
- **Service role bypass pra GC.** Versions têm RLS sem UPDATE/DELETE
  policies — só service_role (BYPASSRLS) consegue limpar. Garbage collector
  futuro vai precisar dessa rota.

---

## Pós-mudança no código de runtime

Esta migration foi acompanhada de mudanças de runtime no commit que a
introduziu:

- `lib/route/getRouteByHost.ts` — query nested join `active_theme_version:active_theme_version_id (id, version_number, snapshot)` + `theme_mode`.
- `lib/route/types.ts` — interface `Tenant` ganhou `active_theme_version_id` + `active_theme_version` + `theme_mode`.
- `lib/contracts/database.ts` — regenerado via MCP pra incluir as 2 tables + nova column.
- `app/layout.tsx` — `<ThemeStyle snapshot={...}>` consome
  `route.tenant?.active_theme_version?.snapshot ?? DEFAULT_THEME`. `ThemeProviderClient` (next-themes wrapper, G.4) wireado.
- `app/_components/theme-provider-client.tsx` — novo wrapper client-only.
- 3 PWA tenant routes (`manifest`, `icon`, `splash`) — select inclui
  `active_theme_version` + consome snapshot quando disponível, fallback
  `DEFAULT_THEME`. **Brand routes não mexidas** (brands não têm theme
  storage nesta fase).
- `app/admin/theme-studio/actions.ts` + `_helpers.ts` — 4 server actions
  (bootstrap/save/list/restore) com vitest companion.

---

## Referências

- ADR-0044 — Pivot TweakCN-way (supersedes ADR-0043)
- `docs/research/33-theme-versioning-pattern.md` — decisões G.1-G.5
- `docs/plans/pivot-tweakcn.md` — plano executável Fase -1..8
- `docs/migrations/0024_drop_design_system_orphans.md` — pré-requisito (Fase 1.5)
- `lib/design/contract/theme.ts` — Zod `ThemeSchema` que valida `snapshot`
- `lib/design/theme-defaults.ts` — `DEFAULT_THEME` (TweakCN-zinc copy-literal)

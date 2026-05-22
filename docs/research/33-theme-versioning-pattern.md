# 33 — Theme versioning pattern (audit Fase 4 S4.0)

> **Tipo:** Research (audit pré-execução) · **Fase:** 4 (theme storage)
> **Status:** decisões cravadas · **Data:** 2026-05-21
> **Princípios:** ADR-0044 §8 (extract+adapt), §9 (versionamento extensão), §10 (audit-per-phase)

## Atualização 2026-05-21: schema flat alinhado TweakCN

Decisão user 2026-05-21: `ThemeSchema` agora é flat `{ light: {45 keys}, dark: {45 keys} }`,
alinhado 100% com `tweakcn-ref/types/theme.ts` upstream. Eliminado `ThemeCommonSchema` separado.

**Shape anterior (histórico):** `{ light: {33 keys}, dark: {33 keys}, common: {11 keys} }`.
**Shape atual:** `{ light: {45 keys}, dark: {45 keys} }` — 11 keys "shared" duplicadas em
ambos os modos com mesmos valores (fontes, radius, shadow primitives, letter-spacing, spacing).
Proteção de sync = responsabilidade da UI (1 picker só), não do schema. `COMMON_STYLES` array
em `tweakcn-ref/config/theme.ts:5-17` documenta quais keys a UI trata como compartilhadas.

**DB column `snapshot jsonb` inalterada** — coluna não tem CHECK constraint de shape
(validação é application-layer via Zod). `tenant_theme_versions` tinha 0 rows quando
o refactor foi aplicado (verificado via MCP `execute_sql` 2026-05-21), portanto sem
necessidade de migration de dados.

**Arquivos alterados no refactor:**

- `lib/design/contract/theme.ts` — `ThemeCommonSchema` removido, `ThemeColorsSchema` renomeado `ThemeStylePropsSchema` (45 keys)
- `lib/design/theme-defaults.ts` — `DEFAULT_COMMON` eliminado, `DEFAULT_THEME` flat
- `lib/design/build-theme-css.ts` — usa `theme.light` diretamente (sem merge com common)
- `lib/design/shadows.ts` — parâmetro `ThemeCommon` → `ShadowPrimitives` (subset flat)
- `lib/design/registry/generate-registry-item.ts` — sem achatamento de common (snapshot já flat)

Conteúdo original abaixo mantido como referência histórica (rationale do schema de versioning).

---

Audit do TweakCN clone `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, Apache-2.0) + nosso DB pós-Fase 1.5 + proposta de schema Fase 4 com decisões cravadas pra revisão antes de aplicar migration.

---

## Sumário executivo

TweakCN é single-tenant, single-theme-mutable, com community sharing — nada disso encaixa no nosso multi-tenant + RLS + versionamento Hotmart-like. Extraímos APENAS o **shape do snapshot** (`styles JSONB` com light+dark) e o **CRUD core** (saveTheme/getThemes/deleteTheme). Versionamento, RLS, snapshot imutável, `parent_theme_id` (clone tracking), `source` enum, AI provenance e `created_by` são extensões obrigatórias nossas — TweakCN não tem nada disso.

Schema proposto: 3 mudanças DDL (`tenant_themes` catálogo, `tenant_theme_versions` snapshot imutável, `tenants.active_theme_version_id` FK). Pattern espelha exatamente `forms` + `form_versions` (ADR-0041, migration 0015). Imutável-on-insert; restore é UPDATE da FK, não cópia. Source enum com 4 valores. AI provenance via `prompt_text` em version (não em theme catálogo) porque snapshot é o que IA gerou; tweaks subsequentes geram novas versions com `prompt_text = null`.

---

## Seção A — Comparativo TweakCN vs nosso (princípio §8)

### A.1 Tabela TweakCN `theme` — análise field-by-field

Fonte: `tweakcn-ref/db/schema.ts:63-72` + `tweakcn-ref/actions/themes.ts`.

| Field TweakCN          | Tipo                | Decisão     | Onde no nosso                          | Razão                                                                                                                                                                                                                                           |
| ---------------------- | ------------------- | ----------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id text PK`           | cuid                | **ADAPT**   | `tenant_themes.id uuid PK`             | uuid v4 é nossa convenção (`gen_random_uuid()`) — todas tables existentes usam. cuid é decisão TweakCN single-tenant. uuid casa com `auth.uid()`/`auth.jwt() ->> 'tenant_id'`                                                                   |
| `userId text FK→user`  | cuid                | **ADAPT**   | `tenant_themes.tenant_id uuid FK`      | Multi-tenant: dono é o **tenant**, não user. Múltiplos professionals dentro de um tenant podem editar (ADR-0034). Auditoria de user vai em `created_by_user_id` na version (snapshot imutável guarda atribuição)                                |
| `name text NOT NULL`   | varchar 50 (action) | **EXTRACT** | `tenant_themes.name text NOT NULL`     | Direto. UNIQUE constraint (tenant_id, name) pra evitar dois themes "Modern Minimal" no mesmo tenant                                                                                                                                             |
| `styles json NOT NULL` | `ThemeStyles`       | **ADAPT**   | `tenant_theme_versions.snapshot jsonb` | TweakCN guarda styles direto no theme = MUTABLE. Nós split: theme é catálogo (metadados), version é snapshot imutável. Princípio §9 — profissional precisa "tweakar v2 sem perder v1". `jsonb` em vez de `json` (indexable, dedupe, type-cast). |
| `createdAt timestamp`  | tz-naive            | **EXTRACT** | `tenant_themes.created_at timestamptz` | Convenção: `timestamptz` (ADR-0033 §schema). Default `now()`.                                                                                                                                                                                   |
| `updatedAt timestamp`  | tz-naive            | **EXTRACT** | `tenant_themes.updated_at timestamptz` | Trigger automático `set_updated_at()` (já existe em outras tables nossas).                                                                                                                                                                      |

### A.2 Tabela TweakCN `communityTheme` — análise

Fonte: `tweakcn-ref/db/schema.ts:163-211` + `tweakcn-ref/actions/community-themes.ts`.

| Field TweakCN                            | Decisão             | Razão                                                                                                                                                              |
| ---------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `communityTheme.themeId FK theme UNIQUE` | **SKIP**            | Community sharing é use-case single-tenant TweakCN ("publicar pro mundo"). Multi-tenant: theme JÁ é privado por tenant (RLS). Não há "comunidade" entre tenants.   |
| `communityTheme.publishedAt`             | **ADAPT (parcial)** | `tenant_theme_versions.published_at timestamptz NULL` — semântica diferente: marca quando version saiu de draft pra ativa, não quando virou pública. Default NULL. |
| `communityTheme.likeCount integer`       | **SKIP**            | Social proof inter-tenant não cabe. Tenants não veem themes de outros tenants.                                                                                     |
| `communityThemeTag (theme_id, tag)`      | **SKIP**            | Tagging é UX de discovery (busca/filtro). Per-tenant temos N ~5-20 themes — não precisa tag system. Filtro by `source` enum + `name` ILIKE basta.                  |
| `themeLike (user_id, theme_id) PK`       | **SKIP**            | Idem — social proof.                                                                                                                                               |

**Conclusão A.2:** zero tabelas community. Reduz superfície DB ~60% vs TweakCN. Re-add JIT se Fase 8+ provar necessidade ("marketplace de themes entre tenants" = nova ADR).

### A.3 Lógica em `actions/themes.ts` — análise

| Function TweakCN                | Decisão                     | Adaptação                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getThemes()` (list user)       | **ADAPT**                   | Nosso `listTenantThemes()`: JOIN themes + active version snapshot + total versions count. RLS via `auth.jwt() ->> 'tenant_id'`. Lazy load snapshot (só carrega ao abrir studio).                                                                                                                                                               |
| `getTheme(id)` (single)         | **ADAPT**                   | `getTenantTheme(themeId)`: traz catálogo + lista versions ordered desc.                                                                                                                                                                                                                                                                        |
| `createTheme({ name, styles })` | **ADAPT** (pattern Hotmart) | Server action `createTenantTheme({ name, source, snapshot })`: transação 2-step — INSERT `tenant_themes` + INSERT `tenant_theme_versions` v1 (locked=true, published_at=now). Validar `snapshot` via `ThemeSchema` Zod. Validar APCA Silver via `meetsApca()` (rule `contrast.md`). Limite per tenant (`MAX_THEMES_PER_TENANT`) — propor 50.   |
| `updateTheme({ id, styles })`   | **NÃO TRADUZIR DIRETO**     | TweakCN mutates row. Nosso pattern: "edit" no studio cria nova version. Server action `saveThemeVersion(themeId, snapshot)` → INSERT new `tenant_theme_versions` (version_number = max+1, locked=true). Theme catálogo só recebe UPDATE em `name`/`updated_at` (não snapshot). Versão antiga preservada — restore = UPDATE da FK em `tenants`. |
| `deleteTheme(id)`               | **ADAPT** (soft delete)     | Nossos themes usam soft-delete (`deleted_at timestamptz NULL` — padrão `tenants`/`forms`/`pages`). Restrição: rejeitar delete se `tenants.active_theme_version_id` aponta pra versão desse theme (precisa swap pra outro theme antes). Hard delete via job nightly após 30d (consistente com tenant lifecycle).                                |
| `publishTheme(themeId, tags)`   | **SKIP**                    | Community publish. Inaplicável.                                                                                                                                                                                                                                                                                                                |
| `toggleLikeTheme(...)`          | **SKIP**                    | Idem.                                                                                                                                                                                                                                                                                                                                          |
| `getCommunityThemes(...)`       | **SKIP**                    | Idem.                                                                                                                                                                                                                                                                                                                                          |
| `MAX_FREE_THEMES` constant      | **ADAPT**                   | TweakCN tem free/pro tier limit. Nós: pode delegar via entitlements (`requireQuota('themes')` — ADR-0039). Default plan: 5 themes; pro: 50. Implementar JIT em Fase 4.5 (após `saveTheme` action existir).                                                                                                                                     |
| Rate limit `Ratelimit (5/hr)`   | **SKIP** (por enquanto)     | TweakCN proteção contra spam comunidade. Per-tenant não tem esse vetor (RLS isola). Re-add JIT se abuse aparecer.                                                                                                                                                                                                                              |

### A.4 Decisão derivada A: zero copy literal

**Não há linha de TweakCN que vai literal pro nosso código.** Todo CRUD é re-escrito com Supabase client + RLS + transações. O que extraímos é o **shape do snapshot** (já confirmado em `lib/design/contract/theme.ts` Fase 1) e os **conceitos** (saveTheme/getThemes/deleteTheme). Atribuição Apache-2.0 já cobre via comment "adapted from tweakcn-ref/actions/themes.ts" no nosso server action.

---

## Seção B — Schema proposto (decisões cravadas)

### B.1 DDL completo

```sql
-- ─── B.1.a — Catálogo per-tenant ────────────────────────────────────────────
CREATE TABLE public.tenant_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  -- Metadados editáveis
  name text NOT NULL,
  description text NULL,  -- opcional; ajuda profissional lembrar "v dark do verão"

  -- Origem do theme (decisão B.2.a)
  source text NOT NULL CHECK (source IN (
    'preset',           -- veio do registry lib/design/presets/*.ts
    'custom',           -- profissional criou do zero no studio
    'ai-generated',     -- IA gerou (prompt salvo na v1)
    'imported-tweakcn'  -- import de URL/JSON external TweakCN
  )),

  -- Lineage opcional pra "fork de outro theme"
  -- (parent é OUTRO theme do mesmo tenant; cross-tenant é impossibilitado pelo CHECK)
  parent_theme_id uuid NULL REFERENCES public.tenant_themes(id) ON DELETE SET NULL,

  -- Lifecycle (soft delete)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,

  UNIQUE (tenant_id, name) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE INDEX tenant_themes_tenant_id_idx ON public.tenant_themes (tenant_id)
  WHERE deleted_at IS NULL;
CREATE INDEX tenant_themes_source_idx ON public.tenant_themes (tenant_id, source)
  WHERE deleted_at IS NULL;

-- ─── B.1.b — Versions snapshot imutável (Hotmart-like) ──────────────────────
CREATE TABLE public.tenant_theme_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  theme_id uuid NOT NULL REFERENCES public.tenant_themes(id) ON DELETE CASCADE,

  -- Versioning sequencial por theme (1, 2, 3...) — UNIQUE (theme_id, version_number)
  version_number integer NOT NULL CHECK (version_number > 0),

  -- Snapshot Zod-validated `Theme` (lib/design/contract/theme.ts)
  -- Light + Dark + Common, 45 keys total — imutável após INSERT.
  snapshot jsonb NOT NULL,

  -- AI provenance (NULL pra source != 'ai-generated' na v1, ou para versions subsequentes)
  prompt_text text NULL,
  ai_model_id text NULL,  -- ex: 'gpt-4o-2024-08-06' — pra reprodutibilidade

  -- Lifecycle
  published_at timestamptz NULL,  -- NULL = draft (não disponível pra ativar); set = published
  created_by_user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Lock: imutável-on-insert. Default TRUE. Toda version é imutável (decisão B.2.b)
  locked boolean NOT NULL DEFAULT true,

  UNIQUE (theme_id, version_number)
);

CREATE INDEX tenant_theme_versions_tenant_id_idx ON public.tenant_theme_versions (tenant_id);
CREATE INDEX tenant_theme_versions_theme_id_version_idx
  ON public.tenant_theme_versions (theme_id, version_number DESC);

-- Trigger: bloqueia UPDATE/DELETE em snapshot/version_number quando locked=true
CREATE OR REPLACE FUNCTION public.prevent_locked_version_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.locked = true AND (
    OLD.snapshot IS DISTINCT FROM NEW.snapshot OR
    OLD.version_number IS DISTINCT FROM NEW.version_number OR
    OLD.theme_id IS DISTINCT FROM NEW.theme_id
  ) THEN
    RAISE EXCEPTION 'Cannot mutate locked theme version (id=%, version=%)', OLD.id, OLD.version_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tenant_theme_versions_lock_check
  BEFORE UPDATE ON public.tenant_theme_versions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_locked_version_mutation();

-- ─── B.1.c — FK em tenants ──────────────────────────────────────────────────
ALTER TABLE public.tenants
  ADD COLUMN active_theme_version_id uuid NULL
    REFERENCES public.tenant_theme_versions(id) ON DELETE SET NULL;

CREATE INDEX tenants_active_theme_version_id_idx
  ON public.tenants (active_theme_version_id);
```

### B.2 Justificativas por decisão (decisões cravadas)

**B.2.a — `source` enum com 4 valores.** `'preset' | 'custom' | 'ai-generated' | 'imported-tweakcn'`. Não inclui `'forked-variant'` separado — fork é representado por `parent_theme_id` IS NOT NULL combinado com `source` legítimo (clonar um preset gera novo theme com `source='custom'` e `parent_theme_id` apontando pro original). Source é "origem da matéria-prima"; parent é "linhagem". Ortogonais.

**B.2.b — Lock policy: imutável-on-insert (sempre).** Todo INSERT em `tenant_theme_versions` nasce `locked=true`. Trigger bloqueia mutação posterior em `snapshot`/`version_number`/`theme_id`. Razão: pattern Hotmart (ADR-0041 `form_versions`/`page_versions`) — snapshot é fonte de verdade reproduzível, "draft" não existe como conceito mutável. Edit = nova version. `published_at IS NULL` ainda marca "draft" semanticamente, mas o snapshot já está congelado. Custo: ~5 versions extras se profissional ficar tweakando. Benefício: zero ambiguidade, restore garantido reproduzir pixel-perfect.

**B.2.c — `parent_theme_id` em `tenant_themes`, não em `tenant_theme_versions`.** Fork é decisão sobre o **catálogo** ("este theme nasceu como fork daquele"). Versions dentro de um theme são lineares (1→2→3) e não bifurcam. Se profissional quer bifurcar de uma version específica, ele "clona" criando theme novo com `parent_theme_id = old_theme.id` e copiando a snapshot da version desejada como v1 do novo theme. UI mostra "Forked from Modern Minimal" via lookup parent.name.

**B.2.d — `snapshot jsonb` validado em application layer, não constraint CHECK.** Razão: validar ThemeSchema (45 keys, OKLCH literals, font stacks) em SQL CHECK seria extensão postgres custom OR regex frágil. Validação Zod em server action antes do INSERT garante shape. Se data corruption acontecer (ex: migration manual), `buildThemeCSS()` falha fast no runtime — aceitável trade-off vs complexidade SQL CHECK.

**B.2.e — `version_number integer sequencial per theme` (não UUID, não global).** Razão: UX. Profissional vê "v1, v2, v3" não "abc-123, def-456". Sequencial per theme, então 2 themes podem ambos ter v1, v2. Gerado em application layer via `SELECT max(version_number)+1`. Race aceitável (UNIQUE constraint pega) — show toast "tente novamente" se conflito.

**B.2.f — `published_at timestamptz NULL` semantica.** `NULL` = draft (snapshot existe mas não disponível pra ativar). Set = published (pode virar `active_theme_version_id`). Por padrão, server action `saveThemeVersion()` seta `published_at = now()` direto — "draft mode" via UI vem JIT se preciso (Fase 5+). Dia 0 da Fase 4: toda version nasce published.

**B.2.g — `created_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL`.** Atribuição (quem clicou Save). Quando user deletado: preserva history (SET NULL não cascade). `NULL` legítimo pra versions geradas server-side (job, AI sem user direto).

**B.2.h — `prompt_text text NULL` + `ai_model_id text NULL` na version, não no theme.** Razão: AI gera 1 version inicial; versions subsequentes (tweaks manuais) não têm prompt. Salvar no theme seria perder info quando re-prompt. Salvar na version captura exatamente qual prompt gerou aquele snapshot — reprodutibilidade + auditoria + "re-rolar com mesmo prompt + ajuste menor".

**B.2.i — Soft delete em `tenant_themes` (`deleted_at`), hard delete em versions (cascade).** Versions cascade-delete quando theme deletado pra evitar órfãos. Theme soft-delete pra recovery 30d via lifecycle pattern existente. RLS filter `WHERE deleted_at IS NULL` automatic.

**B.2.j — Tenant default flow (FK `active_theme_version_id` NULLABLE).** Ao criar tenant novo, FK começa NULL (sem theme ativo). `getRouteByHost` detecta NULL → fallback `DEFAULT_THEME` (já existe `lib/design/theme-defaults.ts`). Quando profissional entra pela primeira vez no studio, server action `bootstrapTenantTheme()` cria theme `name='Default'`, `source='preset'`, v1 = DEFAULT_THEME literal, e UPDATE `tenants.active_theme_version_id`. Lazy bootstrap = não polui DB com themes nunca abertos.

---

## Seção C — RLS policies

### C.1 Pattern canonical (ADR-0033 + 0041)

```sql
-- tenant_themes — SELECT + WRITE só pro próprio tenant
ALTER TABLE public.tenant_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_themes_select ON public.tenant_themes FOR SELECT
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_themes_insert ON public.tenant_themes FOR INSERT
  WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_themes_update ON public.tenant_themes FOR UPDATE
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_themes_delete ON public.tenant_themes FOR DELETE
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- tenant_theme_versions — mesmo pattern
ALTER TABLE public.tenant_theme_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_theme_versions_select ON public.tenant_theme_versions FOR SELECT
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_theme_versions_insert ON public.tenant_theme_versions FOR INSERT
  WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- NO UPDATE/DELETE policy (snapshot imutável; só service_role bypassa pra GC/migrations)
```

### C.2 Caso especial — leitura por hostname público (sem JWT)

`getRouteByHost()` usa `createAdminClient()` (service_role) — bypassa RLS. Continua funcionando: lookup `tenants` → `active_theme_version_id` → JOIN `tenant_theme_versions.snapshot`. Service role é o canal autorizado pra anônimo ler theme via hostname.

**Decisão C.2.a:** **manter service_role pra leitura anônima**, não criar policy `PUBLIC SELECT` em `tenant_theme_versions`. Razão: snapshots podem conter dados sensíveis (cores brand não-públicas pre-launch, prompt_text). Service_role só lê o necessário via JOIN específico — superfície menor.

---

## Seção D — Workflow profissional (princípio §9)

### D.1 Fluxo completo

```
[1] Tenant criado (signup)
    ├─ tenants row INSERT (active_theme_version_id = NULL)
    └─ Nenhum tenant_themes row ainda (lazy bootstrap)

[2] Profissional abre /admin/theme-studio (primeiro acesso)
    ├─ Server action bootstrapTenantTheme() detecta NULL
    ├─ INSERT tenant_themes (name='Default', source='preset', parent=null)
    ├─ INSERT tenant_theme_versions v1 (snapshot=DEFAULT_THEME, locked=true, published_at=now)
    ├─ UPDATE tenants.active_theme_version_id = v1.id
    └─ Cache invalidate cacheTag('theme:<tenantId>')

[3] Studio carrega form com snapshot v1 → profissional tweaka cores

[4] Click "Save as new version" (ou "Save" — alias)
    ├─ Server action saveThemeVersion({ themeId, snapshot })
    ├─ Validate ThemeSchema Zod + APCA Silver (ensureAccessible se quebra)
    ├─ SELECT max(version_number) FROM tenant_theme_versions WHERE theme_id=X
    ├─ INSERT tenant_theme_versions v2 (snapshot novo, locked=true, published_at=now, created_by=user.id)
    ├─ (NÃO atualiza active_theme_version_id ainda — preview-first UX)
    └─ Retorna v2.id

[5] Click "Set as active"
    ├─ UPDATE tenants.active_theme_version_id = v2.id
    ├─ Cache invalidate cacheTag('theme:<tenantId>')
    └─ Site reload → buildThemeCSS(v2.snapshot)

[6] "Restore v1"  (semana depois, profissional não gosta v2)
    ├─ UPDATE tenants.active_theme_version_id = v1.id  (FK aponta de volta)
    └─ v2 PERSISTE (visível em history, pode re-ativar quando quiser)
    ─ Decisão D.2.a: restore NÃO cria v3 cópia de v1. É só swap da FK.

[7] "Fork from Default → 'Summer'" (clona theme novo)
    ├─ INSERT tenant_themes (name='Summer', source='custom', parent_theme_id=defaultTheme.id)
    ├─ INSERT tenant_theme_versions v1 (snapshot = COPY do snapshot da version ativa do parent)
    └─ Tenant agora tem 2 themes ("Default" 2 versions, "Summer" 1 version)
```

### D.2 Decisões cravadas

**D.2.a — Restore = swap FK, não cópia.** Aponta `tenants.active_theme_version_id` pra version antiga. Não cria v3. Razão: snapshot imutável já é fonte de verdade; cópia desperdiça storage + confunde history. Custo: zero. Se profissional quiser "v3 baseada em v1 mas modificada", ele primeiro restore v1 → tweaka → saves = nasce v3 com snapshot novo.

**D.2.b — Limite per theme: 50 versions.** Após 50, server action `saveThemeVersion()` rejeita com AppError `themes.version_limit_reached`. Razão: profissional típico vai criar 5-15 versions por theme em ciclo de vida; 50 é margin folgado mas evita abuse (script salvando 10k versions). Re-add bypass entitlement-gated quando paywall maturar.

**D.2.c — Limite per tenant: 5 themes free / 50 themes pro.** Via `requireQuota('themes')` da `lib/entitlements/server.ts` (ADR-0039). Implementar no server action `createTenantTheme()`.

**D.2.d — Soft delete `tenant_themes`, sem soft delete em versions.** Theme deleted → `deleted_at = now()`, sobrevive 30d, hard delete via nightly job. Versions: cascade hard delete junto com theme (sem soft delete próprio porque RLS já filtra `theme.deleted_at IS NULL` via JOIN no list).

**D.2.e — Bloqueio: não pode deletar theme se `tenants.active_theme_version_id` aponta pra alguma version dele.** Server action `deleteTenantTheme()` verifica antes do soft delete. Rejeita com mensagem "Switch active theme first". Razão: deletar active theme deixa site sem tema → fallback DEFAULT_THEME seria possível mas confuso pro profissional ("por que voltou pro default sem eu pedir?").

---

## Seção E — Integração com `getRouteByHost`

### E.1 Select atual (Fase 1.5)

```ts
// lib/route/getRouteByHost.ts:50-60
.from('domains')
.select(`
  tenant_id, kind, is_primary, ssl_status,
  tenants:tenant_id (
    id, slug, brand_id, name, vertical, theme_version,
    brands:brand_id (id, name, host, logo_url, default_vertical, parent_label, theme_version)
  )
`)
```

### E.2 Select pós-Fase 4

```ts
.from('domains')
.select(`
  tenant_id, kind, is_primary, ssl_status,
  tenants:tenant_id (
    id, slug, brand_id, name, vertical, theme_version, theme_mode,
    active_theme_version_id,
    active_theme_version:active_theme_version_id (
      id, version_number, snapshot
    ),
    brands:brand_id (id, name, host, logo_url, default_vertical, parent_label, theme_version)
  )
`)
```

### E.3 Fallback chain em `app/layout.tsx` ThemeStyle

```ts
// Pseudocódigo decisão E.3.a
const route = await getRouteByHost(host)
const snapshot = route?.tenant?.active_theme_version?.snapshot
const themeToUse = snapshot ? ThemeSchema.parse(snapshot) : DEFAULT_THEME
const css = buildThemeCSS(themeToUse)
```

**Decisão E.3.a:** **fallback pra DEFAULT_THEME se FK NULL ou snapshot inválido.** Razão: PWA manifest precisa renderizar mesmo pra tenant recém-criado (antes do bootstrap). DEFAULT_THEME é foundation reset zinc — seguro pra qualquer brand. Log warning server-side se snapshot inválido (Zod parse falha) — sinaliza data corruption pra debug.

**Decisão E.3.b:** **NÃO criar trigger SQL pra seed automático na INSERT do tenant.** Razão: lazy bootstrap (D.1 [2]) é mais simples — tenant pode existir 30 dias sem ninguém abrir studio, criar theme via trigger seria ruído. Server action no primeiro acesso é o gatilho natural. Custo: 1 query extra no primeiro studio open (aceitável).

**Decisão E.3.c:** **cache tag `theme:<tenantId>:<version_number>` granular.** Invalidate quando active_theme_version_id muda OU quando snapshot de version ativa atualiza (versão imutável, então só primeira opção). Pattern: `cacheTag('theme:' + tenantId + ':' + activeVersion.version_number)` em `getRouteByHost` — Next 16 cache components.

---

## Seção F — Migration plan

### F.1 Opção 1: Monolítica `0025_theme_storage`

**Conteúdo:**

- CREATE TABLE tenant_themes
- CREATE TABLE tenant_theme_versions
- CREATE TRIGGER prevent_locked_version_mutation
- ALTER TABLE tenants ADD active_theme_version_id
- RLS policies (4 em themes, 2 em versions)
- Indexes (5 total)
- GRANT statements
- Generate types via MCP

**Prós:** 1 commit, atomic, easy rollback (drop tudo)
**Contras:** se algum SELECT falha em validação MCP, refaz tudo

### F.2 Opção 2: 3 migrations sequenciais

- `0025_tenant_themes_table` — CREATE TABLE + RLS + indexes
- `0026_tenant_theme_versions_table` — CREATE TABLE + trigger + RLS + indexes
- `0027_tenants_active_theme_fk` — ALTER TABLE + index

**Prós:** rollback granular, easier review por step
**Contras:** 3 commits, types regen 3x, build verde 3x = 3x trabalho

### F.3 Recomendação: **F.1 monolítica**

Razão: as 3 partes são intrinsecamente acopladas (FK em tenants precisa que table exista). Rollback granular é mocking — em prática rollback = `mcp__supabase__apply_migration` com DROP statements (sempre monolítico). Migration 0015 (forms_align_research_23) já fez 6 tables + 5 alters monolítica e funcionou.

**Nome proposto:** `0025_theme_storage_versioning` (espelha 0015 verbose-style).

---

## Seção G — Open questions (decidir antes de execute)

Recomendações cravadas mas user precisa confirmar antes de migration.

### G.1 — Lock policy: imutável-on-insert OU locked-on-publish?

**Recomendação:** imutável-on-insert (decisão B.2.b acima). Toda version locked=true imediato. Edit nunca acontece.
**Alternativa:** locked=false durante "draft", lock só quando user clica Publish.
**Trade-off:** alternativa permite "draft mode" mais flex (continua editando snapshot até publicar), mas viola pattern ADR-0041 e introduz ambiguidade ("posso editar?" depende de bool).
**✅ Decisão (user 2026-05-21):** Opção A — imutável-on-insert. Confirmado. Draft mode em camada cliente (localStorage) se necessário.

### G.2 — Limite de versions por theme: 50 OR sem limite?

**Recomendação:** cap em 50 (decisão D.2.b).
**Alternativa:** sem limite, GC manual via job nightly que mantém última 10.
**Trade-off:** cap protege contra abuse acidental; sem limite respeita autonomia. 50 é razoável (1 version/semana = 1 ano de tweaks).
**✅ Decisão (user 2026-05-21):** Opção A — cap 50. CHECK constraint no INSERT. Mensagem de erro clara quando bate teto. UI de "delete antigas" volta JIT em Fase 5.

### G.3 — Fork via UI: feature dia 0 da Fase 4 OU JIT?

**Recomendação:** schema preparado (FK `parent_theme_id`), feature **JIT em Fase 5** (builder UI). Dia 0 da Fase 4 não expõe "Fork" button — só "Save", "Restore", "Set as active".
**Alternativa:** já implementar fork no server action + UI mínimo.
**Trade-off:** schema upfront garante migração futura barata; UI JIT evita inflar Fase 4. Fase 5 audit S5.0 + studio implementation já cobre.
**✅ Decisão (user 2026-05-21):** Opção A — schema dia 0 (FK `parent_theme_id` self-reference) + fork button JIT Fase 5 (junto com builder UI completo). Server action `forkTheme()` também adia pra Fase 5.

### G.4 — `theme_mode` em `tenants` (auto/light/dark): manter como está?

**Estado atual:** column existe (`tenants.theme_mode text DEFAULT 'auto'`). Não foi removida em 0024.
**Recomendação:** manter como está. É preferência runtime do tenant (dictar qual mode mostrar por padrão pro usuário final) — ortogonal ao snapshot que já contém light+dark. App lê `theme_mode` e aplica `<html class="dark">` ou não.
**Alternativa:** mover pra dentro do snapshot (theme inteiro tem default mode).
**Trade-off:** manter ortogonal é mais flexível (mesmo theme + tenant escolhe mode). Mover dentro do snapshot acopla.
**✅ Decisão (user 2026-05-21):** Opção A — manter `tenants.theme_mode` separado. Vira input do `<ThemeProvider defaultTheme={tenant.theme_mode}>` (next-themes) em Fase 4.5.3.

**Nota sobre divergência TweakCN (princípio §8 extract+adapt):** TweakCN NÃO tem column equivalente em `db/schema.ts` (verificado read 2026-05-21). Theme `styles` JSON guarda light+dark, mode escolhido vive em Zustand `useEditorStore().themeState.currentMode` client-side com default `"light"` hardcoded em `app/layout.tsx`. Razão: TweakCN é editor single-user — mode = preferência da pessoa que edita. **Nosso modelo é diferente:** dois decisores distintos — profissional (tenant owner) define **default pros end-users dele** (vai em `tenants.theme_mode` DB), end-user (aluno) **override próprio** (vai em localStorage via next-themes). Two-layer hierarchy server→client que TweakCN não precisa porque é single-user.

### G.5 — Seed migration: criar tenant_themes pro tenant `showcase` existente?

**Plan §5.4** menciona "Migration data: tenant default carrega preset modern-minimal". Mas tenant `showcase` está em `tenants` com `active_theme_version_id = NULL` (lazy bootstrap funciona).
**Recomendação:** **NÃO seed no migration**. Deixar lazy bootstrap fazer no primeiro studio open. Migration 0025 puramente DDL.
**Alternativa:** seed inline no INSERT statement.
**Trade-off:** seed garante "showcase tem theme custom desde dia 1" pro QA; lazy bootstrap é coerente com new tenant flow.
**✅ Decisão (user 2026-05-21):** Opção A — lazy bootstrap puro. **Premissa do agente estava errada:** tenant `showcase` NÃO existe no DB (verificado via MCP `execute_sql` 2026-05-21 — `tenants` tem 0 linhas; `brands` tem 1 linha `desafit.app` apenas). Não há nada pra seedar. Migration 0025 fica DDL puro. Primeira tenant criada no futuro vai passar pelo fluxo normal `bootstrapTenantTheme()`.

---

## Apêndice — Tabela resumo "Field-by-field shape do nosso schema"

### tenant_themes

| Coluna            | Tipo        | Constraints                                  | Origem         |
| ----------------- | ----------- | -------------------------------------------- | -------------- |
| `id`              | uuid        | PK, default gen_random_uuid()                | Nosso pattern  |
| `tenant_id`       | uuid        | NOT NULL, FK tenants.id ON DELETE CASCADE    | RLS gatekeep   |
| `name`            | text        | NOT NULL, UNIQUE(tenant_id, name)            | TweakCN parity |
| `description`     | text        | NULL                                         | Nosso UX       |
| `source`          | text        | NOT NULL, CHECK IN (4 values)                | Nosso UX       |
| `parent_theme_id` | uuid        | NULL, FK tenant_themes.id ON DELETE SET NULL | Nosso (fork)   |
| `created_at`      | timestamptz | NOT NULL DEFAULT now()                       | Convenção      |
| `updated_at`      | timestamptz | NOT NULL DEFAULT now() + trigger             | Convenção      |
| `deleted_at`      | timestamptz | NULL (soft delete)                           | Convenção      |

### tenant_theme_versions

| Coluna               | Tipo        | Constraints                                         | Origem             |
| -------------------- | ----------- | --------------------------------------------------- | ------------------ |
| `id`                 | uuid        | PK, default gen_random_uuid()                       | Nosso pattern      |
| `tenant_id`          | uuid        | NOT NULL, FK tenants.id ON DELETE CASCADE           | RLS gatekeep       |
| `theme_id`           | uuid        | NOT NULL, FK tenant_themes.id ON DELETE CASCADE     | Lineage            |
| `version_number`     | integer     | NOT NULL CHECK >0, UNIQUE(theme_id, version_number) | UX seq             |
| `snapshot`           | jsonb       | NOT NULL (Zod-validated app-layer)                  | Hotmart pattern    |
| `prompt_text`        | text        | NULL                                                | AI provenance      |
| `ai_model_id`        | text        | NULL                                                | AI reproducibility |
| `published_at`       | timestamptz | NULL = draft, set = published                       | Lifecycle          |
| `created_by_user_id` | uuid        | NULL, FK auth.users.id ON DELETE SET NULL           | Attribution        |
| `created_at`         | timestamptz | NOT NULL DEFAULT now()                              | Convenção          |
| `locked`             | boolean     | NOT NULL DEFAULT true + trigger                     | Imutável-on-insert |

### tenants (ALTER)

| Coluna                    | Tipo | Constraints                                          |
| ------------------------- | ---- | ---------------------------------------------------- |
| `active_theme_version_id` | uuid | NULL, FK tenant_theme_versions.id ON DELETE SET NULL |

---

## Referências

- ADR-0044 §8, §9, §10 — princípios cravados (extract+adapt, versionamento, audit-per-phase)
- ADR-0041 §D — pattern `forms`/`form_versions`/`pages`/`page_versions`
- ADR-0033 — schema único `public.*`
- ADR-0039 — entitlements RPCs (quota `themes`)
- `docs/plans/pivot-tweakcn.md` §5 — escopo Fase 4
- `docs/design-system/20-concept-map.md` §versionamento — workflow profissional
- `lib/design/contract/theme.ts` — Zod `Theme` schema (45 keys)
- `lib/design/theme-defaults.ts` — `DEFAULT_THEME` constant (fallback)
- `lib/design/build-theme-css.ts` — `buildThemeCSS(theme) → string`
- `lib/route/getRouteByHost.ts` — host → brand+tenant resolver
- `app/layout.tsx` — `<ThemeStyle />` async
- `C:\Users\leean\Desktop\tweakcn-ref\db\schema.ts` — TweakCN schema completo
- `C:\Users\leean\Desktop\tweakcn-ref\actions\themes.ts` — TweakCN server actions
- `C:\Users\leean\Desktop\tweakcn-ref\actions\community-themes.ts` — community (SKIP)
- Supabase migration 0015 (`forms_align_research_23`) — precedent forms+form_versions

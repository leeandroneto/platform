# 14a. Audit do estado atual (Passo 0)

> Status: snapshot 2026-05-20
> Bloqueia: Passos 1+ do plano de transformação (`docs/plans/design-system.md` — antigo `14-transformation-plan.md`)
> Princípio: documentar SEM propor mudanças. Mapeamento — não refactor.

## TL;DR

- **Banco:** 45 tabelas em `public.*` (schema único pós-ADR-0033). Brand/theme tocam 5 tabelas (`tenants`, `brands`, `palettes`, `fonts`, `shape_presets`)
- **Tokens CSS:** ~52 vars em `app/globals.css` (categorizadas: 17 color, 5 shape/radius, 8 surface dark, 8 surface light, 4 chart, 4 safe-area, 3 elevation, 1 animation, 2 font, 1 brand-hue)
- **lib/design/:** 7 arquivos (3 seeds + palettes API + tokens stub + motion + contrast helper)
- **13 paletas OKLCH** confirmadas em `palettes.seed.ts` (slugs: default, indigo, rose, sage, terracotta, navy, coral, mustard, neon, carbon, performance, pure, minimal-warm)
- **shadcn primitives:** 53 em `components/ui/*` (47 shadcn + 4 custom typography/logo + 2 misc — count cresceu desde "47 dia 0")
- **Wrappers app-\*:** 3 (AppForm, AppToast, AppEntitlementGate) — todos com stories
- **5 ADRs auditadas:** todas accepted. ADR-0042 (elevations) é candidata canônica a supersede pelo novo plano
- **17 rules path-loaded** em `.claude/rules/*.md` (6 diretamente design-related)
- **8 hooks** em `.claude/hooks/*.sh` (3 são design/component gates)
- **Conflitos identificados:** ~7 com colunas existentes que cobrem proposta do plano
- **Resíduos potenciais:** 2 (`lib/design/tokens.ts` é stub que lança; `bg`/`fg` JS derivation)

---

## 1. Schema do banco — colunas brand/theme

### Tabela `public.tenants` (23 colunas total)

| Coluna             | Tipo             | Default                     | Cobertura plano                            |
| ------------------ | ---------------- | --------------------------- | ------------------------------------------ |
| `brand_id`         | uuid NOT NULL    | —                           | FK pra `brands` (multi-brand ADR-0024)     |
| `palette_id`       | uuid NOT NULL    | `default_palette_id()`      | **JÁ COBRE** `palette_id` proposto plano   |
| `font_id`          | uuid NOT NULL    | `default_font_id()`         | Tipografia per tenant (não proposto plano) |
| `shape_preset_id`  | uuid NOT NULL    | `default_shape_preset_id()` | Shape preset (sharp/rounded/pill)          |
| `theme_version`    | integer NOT NULL | `1`                         | Versionamento theme cache                  |
| `vertical`         | text NOT NULL    | —                           | Multi-vertical (ADR-0024)                  |
| `default_locale`   | text NOT NULL    | `'pt-BR'`                   | i18n                                       |
| `default_currency` | text NOT NULL    | `'BRL'`                     | —                                          |
| `default_tz`       | text NOT NULL    | `'America/Sao_Paulo'`       | —                                          |
| `lifecycle_state`  | text NOT NULL    | `'active'`                  | CHECK enum                                 |
| outras 13 colunas  | —                | —                           | id, slug, name, logo_url, pixels, etc.     |

**Constraint relevante:** `tenants_lifecycle_state_check` (CHECK enum: provisioning/active/suspended/pending_deletion/deleted).

### Tabela `public.brands` (11 colunas)

| Coluna               | Tipo             | Default | Intenção                      |
| -------------------- | ---------------- | ------- | ----------------------------- |
| `default_palette_id` | uuid NOT NULL    | —       | Paleta default da brand       |
| `default_vertical`   | text NOT NULL    | —       | Vertical primária             |
| `host`               | text NOT NULL    | —       | Hostname (CHECK regex domain) |
| `theme_version`      | integer NOT NULL | `1`     | Cache busting                 |
| `parent_label`       | text NULL        | —       | Marca-pai label (footer)      |

### Tabela `public.palettes` (21 colunas — paleta clonável per tenant)

Colunas-chave: `slug`, `display_name`, `hue`, `primary_oklch`, `primary_light_oklch`, `secondary_oklch`, `tertiary_oklch`, `extras_oklch[5]`, `surfaces_dark[5]`, `surfaces_light[5]`, `is_official`, `is_active`, `source_palette_id` (template→instance — ADR-0029), `brand_id`, `created_by_tenant_id`.

### Plano propõe × Existe?

| Proposta plano (Passo 6.3)      | Já existe?     | Nome atual                   | Conflito                                     |
| ------------------------------- | -------------- | ---------------------------- | -------------------------------------------- |
| `tenants.archetype_id text`     | **NÃO**        | —                            | Sem conflito — coluna nova                   |
| `tenants.palette_id text`       | **SIM (uuid)** | `tenants.palette_id uuid FK` | TIPO DIFERENTE (uuid vs text). Conflito real |
| `tenants.theme_mode text`       | **NÃO**        | —                            | Sem conflito                                 |
| `tenants.previous_archetype_id` | **NÃO**        | —                            | Sem conflito                                 |
| `tenants.archetype_changed_at`  | **NÃO**        | —                            | Sem conflito                                 |

**Observação crítica:** plano sugere `palette_id text NOT NULL DEFAULT 'default'`, mas projeto JÁ usa `palette_id uuid` FK → `palettes(id)` desde ADR-0028. Slug-based seria regressão arquitetural — palettes são row-level com clones tenant.

---

## 2. Tokens CSS atuais (`app/globals.css`)

### Em `@theme` (Tailwind v4 — raw tokens)

| Categoria          | Vars                                                                                             | Count        |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------ |
| **font**           | `--font-sans`, `--font-mono`, `--font-brand`                                                     | 3            |
| **brand-hue**      | `--brand-hue: 275`                                                                               | 1            |
| **shape**          | `--shape-card`, `--shape-button`, `--shape-input`, `--shape-badge`, `--shape-avatar`, `--radius` | 6            |
| **surface dark**   | `--color-surface-1..5`                                                                           | 5            |
| **surface light**  | `--color-surface-light-1..5`                                                                     | 5            |
| **semantic**       | `--color-info`, `--color-success`, `--color-warning`, `--color-destructive`                      | 4            |
| **brand fallback** | `--color-primary`, `--color-primary-light`, `--color-secondary`, `--color-tertiary`              | 4            |
| **chart**          | `--color-chart-1..5`                                                                             | 5            |
| **safe-area**      | `--inset-safe-{top,bottom,left,right}`                                                           | 4            |
| **elevation**      | `--elevation-flat`, `--elevation-raised`, `--elevation-overlay`                                  | 3 (ADR-0042) |
| **motion**         | `--animate-shimmer` + `@keyframes shimmer`                                                       | 1            |

### Em `@theme inline` (shadcn vars aliasing)

`--font-heading`, `--color-background`, `--color-foreground`, `--color-card`, `--color-popover`, `--color-primary`, `--color-secondary`, `--color-muted`, `--color-accent`, `--color-destructive`, `--color-border`, `--color-input`, `--color-ring`, `--color-chart-*`, `--color-sidebar-*` (7 vars sidebar), `--radius-{sm,md,lg,xl,2xl,3xl,4xl}` (7 radius derivados).

### Em `:root` (`@layer base`)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--chart-1..5`, `--sidebar*` (7 vars).

### Plano propõe 25 semantic roles × tokens atuais

| Role proposto (categoria)                       | Token atual mais próximo                     | Bate?          |
| ----------------------------------------------- | -------------------------------------------- | -------------- |
| `--role-page-canvas`                            | `--color-background` (→ `--color-surface-1`) | Sim, alias     |
| `--role-text-emphasis`                          | `--color-foreground`                         | Sim            |
| `--role-text-muted`                             | `--color-muted-foreground`                   | Sim            |
| `--role-feature-card-bg`                        | `--color-card` (→ surface-2)                 | Parcial        |
| `--role-border-default`                         | `--color-border`                             | Sim            |
| `--role-action-primary-bg`                      | `--color-primary`                            | Sim            |
| `--role-action-primary-fg`                      | `--color-primary-foreground`                 | Sim            |
| `--role-popover-bg`                             | `--color-popover` (→ surface-3)              | Sim            |
| `--role-input-bg`                               | `--color-input` (=border)                    | **DRIFT**      |
| `--role-elevation-{flat/raised/overlay}`        | `--elevation-{flat/raised/overlay}`          | Sim            |
| `--role-radius-{sm,md,lg,xl,2xl,3xl,4xl}`       | `--radius-{sm..4xl}`                         | Sim — 7 níveis |
| `--role-shape-{card,button,input,badge,avatar}` | `--shape-*` per componente                   | Sim — granular |
| `--role-chart-{1..5}`                           | `--color-chart-1..5`                         | Sim            |
| `--role-status-{success,warn,destr,info}`       | `--color-{success,warning,destructive,info}` | Sim            |
| `--role-safe-area-*`                            | `--inset-safe-*`                             | Sim            |

**Não tem hoje (mencionado no plano §14/27):** `--shadow-card-1..5` (Vercel stacked), `--radius-soft` (14px gap), `--container-{narrow,default,wide}`, `--space-section-{mobile,desktop,hero}`, `--aspect-{hero,card,portrait,banner}`, motion granular (12 durations Polaris), iconography tokens, dual spacing scales (component vs layout — Carbon).

---

## 3. `lib/design/*` inventário

| Arquivo                  | Exports principais                                                                                       | Estado                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------- |
| `seeds/palettes.seed.ts` | `OFFICIAL_PALETTES: readonly PaletteSeed[]` (13 paletas) + types                                         | Ativo — seed DB        |
| `seeds/fonts.seed.ts`    | `OFFICIAL_FONTS: readonly FontSeed[]` (7 fontes: Geist, Inter, Outfit, Lora, Manrope, +2)                | Ativo                  |
| `seeds/shapes.seed.ts`   | `OFFICIAL_SHAPE_PRESETS` (3 presets: sharp, rounded, pill)                                               | Ativo                  |
| `palettes.ts`            | `getPaletteBySlug()`, `getPaletteOrThrow()` + re-export seed                                             | Ativo — public API     |
| `tokens.ts`              | `deriveTokens()` (`throw AppError.internal('JIT')`)                                                      | **STUB** — JIT futuro  |
| `motion.ts`              | `duration` (6 levels), `ease` (5 curves), `spring` (4 presets — Material 3)                              | Ativo — client         |
| `contrast.ts`            | `apca()`, `meetsApca()`, `ensureAccessible()`, `pickReadableForeground()`, `oklchToHex()`, `APCA_SILVER` | Ativo — multi-consumer |

### 13 paletas atuais (slugs)

`default`, `indigo`, `rose`, `sage`, `terracotta`, `navy`, `coral`, `mustard`, `neon`, `carbon`, `performance`, `pure`, `minimal-warm`.

Cada paleta tem 1 variant — sem light/dark per archetype porque dark/light derivam da MESMA paleta (5 surfaces dark + 5 surfaces light per paleta).

---

## 4. `components/ui/*` — 53 primitives (cresceu de 47 dia 0)

shadcn (47 esperado, +6 adicionados via shadcn add ou custom typography):

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

**Custom typography/identity (ADR-0040 §F):** `heading`, `text`, `muted`, `logo` (+ stories `.stories.tsx`).

---

## 5. `components/app-*.tsx` (3 wrappers obrigatórios + stories)

| Wrapper                    | Valor agregado                                     | Archetype-aware?                                               |
| -------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `app-form.tsx`             | RHF + Zod resolver + AppError i18n + submit tipado | Não (form é estrutura, não visual)                             |
| `app-toast.tsx`            | sonner + helpers `toast.success(i18nKey)`          | Não (usa tokens shadcn já tenant-themed)                       |
| `app-entitlement-gate.tsx` | `useEntitlement()` + paywall modal + upgrade CTA   | Parcial (lê plan via `useEntitlement`, tema via tokens shadcn) |

**Nenhum wrapper lê `useBrand()` ou `useTenant()` diretamente.** Theming é 100% via CSS vars do banco (`/api/{tenants,brands}/[id]/theme.css`) — ZERO componente edita tokens em JS.

---

## 6. Brand/theme resolution (fluxo atual)

1. `proxy.ts` (Next 16) lê `Host` header
2. `lib/route/getRouteByHost.ts` → SELECT em `brands` + `tenants` (1 lookup, cache TTL 60s edge)
3. Retorna `{ brand: Brand, tenant: Tenant | null }` (ADR-0024 + ADR-0026)
4. `lib/route/RouteProvider.tsx` → React context provider expõe `useBrand()`, `useTenant()`, `useTenantOptional()`
5. `app/layout.tsx` injeta `<link rel="stylesheet" href="/api/tenants/{id}/theme.css?v={theme_version}">`
6. API route gera CSS com `--color-primary`, `--brand-hue`, `--radius`, `--font-brand` do banco
7. `@theme inline` em `globals.css` mapeia → `--primary`, `--card`, etc shadcn → componentes herdam automático

**Pasta `lib/brand/`:** apenas `types.ts` (interface `Brand`). Provider unificado mora em `lib/route/RouteProvider.tsx` (ADR-0026 superseded brand-only provider).

---

## 7. Rules `.claude/rules/*` (17 total — 6 design-related)

| Rule                   | Intenção                                                                                                                           | Pós-plano                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `design-tokens.md`     | Tabela canônica de tokens semantic, anti-patterns, exceções, condição de revisitar (gate de promoção de `no-unknown-classes`)      | **Atualização Passo 9**             |
| `design-references.md` | 71 DESIGN.md são APENAS mood/density/hierarchy — NUNCA tokens literais (hex, font). Tokens = banco runtime                         | Mantém intenção; lista de surfaces  |
| `shadcn-zone.md`       | `components/ui/*` é vendor surface intocável. 3 wrappers obrigatórios + JIT. Passthrough proibido                                  | Mantém — gate Edit canônico         |
| `brand.md`             | Brand via env + hooks `useBrand`/`useTenant` (RouteProvider). Multi-vertical via keys descritivas neutras                          | Mantém — multi-brand canon          |
| `contrast.md`          | APCA Silver dual-gate (75/60/45). `lib/design/contrast.ts` helpers. Prebuild + runtime                                             | Expandir — APCA runtime tenant      |
| `tenant-content.md`    | Hierarquia 4 níveis de personalização: static neutra / per-tenant strings / template+slots / block builder. Dia 0 = template+slots | Tangencial; menciona archetypes JIT |
| `components.md`        | Defer JIT. Hierarquia ADR-0008/0037. Marker `// RESEARCH:` obrigatório. Wrapper não-fork                                           | Mantém                              |

Outras 10: naming, layers, data-layer, domain-logic, server-actions, features, jwt-claims, abstractions, i18n, entitlements, forms-engine, docs-writing.

---

## 8. ADRs auditadas

| ADR  | Decisão                                                                                                            | Intenção                                                                                               | Status pós-plano                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 0024 | Brand identity em `public.brands` (não env). `proxy.ts` lookup por host. 1 deploy serve N marcas                   | Adicionar marca filha = INSERT + DNS, zero refactor. Multi-marca é dimensão ortogonal a tenant         | **Mantém ativa** — base imutável do plano                          |
| 0033 | Schema único `public.*`. Drop `platform.*`. RLS é fronteira de segurança, não schema                               | Eliminar fricção MCP/PostgREST/tooling. Padrão Supabase canônico                                       | **Mantém ativa** — premissa não-tocada                             |
| 0040 | shadcn zone quarentenada + i18n setup + APCA Silver + 3 wrappers obrigatórios + 6 rules JIT                        | Build verde dia 0 + memória executável JIT. shadcn pristine, canal único `npx shadcn add`              | **Mantém ativa** — plano herda governance                          |
| 0041 | 2 motores separados (Form Engine + Page Engine). Polimorfismo via `kind` enum + `scope` (tenant/internal/platform) | Catálogo declarado orienta IA + dev. Adicionar engine 3+ exige nova ADR. Engines compartilham renderer | **Mantém ativa** — engine é ortogonal a design                     |
| 0042 | 3 elevations: `--elevation-{flat,raised,overlay}`. "Flat-ish profissional" Linear-leaning                          | Sweet spot 3 níveis. Cross-feature consistência. Tenant override via theme.css JIT                     | **CANDIDATA A SUPERSEDED** se plano expande pra 5 (Vercel stacked) |

---

## 9. Migrations relevantes (18 aplicadas — todas em `public.*` pós-consolidação)

| Versão    | Nome                           | O que fez                                                   |
| --------- | ------------------------------ | ----------------------------------------------------------- |
| 0001      | initial                        | 25 tabelas `platform.*` (pré-consolidação)                  |
| 0005a     | consolidate_platform_to_public | ALTER TABLE SET SCHEMA `platform.*` → `public.*` (ADR-0033) |
| 0006/0008 | drop_platform_schema (twice)   | Limpeza pós-consolidação                                    |
| 0007      | add_plans_table                | Plans + entitlements                                        |
| 0009      | entitlement_rpcs               | RPCs `requireEntitlement`, `requireQuota`                   |
| 0011-0013 | security_hardening_v1/v2       | RLS + SECDEF tightening                                     |
| 0014      | constraint_cleanup             | Constraints normalization                                   |
| 0015      | forms_align_research_23        | Form Engine: kind enum + scope (ADR-0041)                   |
| 0016      | structural_reserves            | Page Engine reservas + cross-table                          |
| 0017      | cross_table_tenant_consistency | Constraints cross-tenant                                    |

**Nenhuma migration recente tocou em `tenants` adicionando `archetype_id`/`theme_mode`/`previous_archetype_id` — terreno limpo pro Passo 6.3.**

---

## 10. Hooks `.claude/hooks/*` (8 total)

| Hook                         | Tipo             | Bloqueia/faz                                                                                          |
| ---------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `block-token-bypass.sh`      | PreToolUse       | Bloqueia `#hex`/`rgba(` em `.ts/.tsx` fora allowlist (globals.css, icons OG, blurhash)                |
| `component-research-gate.sh` | PreToolUse       | Bloqueia Write em `components/**` sem marker `// RESEARCH:`. Edit em `components/ui/*` 100% bloqueado |
| `post-shadcn-add.sh`         | PostToolUse Bash | Detecta `shadcn add` e injeta checklist (audit, grep literais, grep cores, etc) via stderr            |
| `protect-eslint.sh`          | PreToolUse       | Bloqueia Edit em `eslint.config.*` sem marker `// ADR-NNNN` E ADR existindo                           |
| `block-disable-content.sh`   | PreToolUse       | Bloqueia `eslint-disable`/`noInlineConfig`/`reportUnusedDisableDirectives`                            |
| `vocab-warn.sh`              | UserPromptSubmit | Warn (não bloqueia) quando user prompt contém vocab banido                                            |
| `load-context.sh`            | SessionStart     | Carrega contexto: vocab banido, schema único, regras críticas                                         |
| `format-on-write.sh`         | PostToolUse      | Roda prettier no arquivo após Write/Edit (normaliza imports/tailwind)                                 |

---

## Conflitos potenciais (CRÍTICO — antes de Passo 6.3)

| Plano propõe                                                | Já existe como                                                               | Onde          | Intenção (inferível)                                                                                                        | Recomendação                                                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `tenants.palette_id text DEFAULT 'default'`                 | `tenants.palette_id uuid NOT NULL FK palettes(id)`                           | DB            | Paletas são row-level + clonáveis per tenant (ADR-0028) com `source_palette_id` template→instance                           | NÃO trocar pra slug-based. Adicionar `archetype_id` (novo) sem mexer `palette_id`                                    |
| `tenants.archetype_id text NOT NULL DEFAULT 'minimal-mono'` | Nada equivalente. `tenants.shape_preset_id uuid` existe (sharp/rounded/pill) | DB            | Shape preset é granular (3 valores). Archetype proposto é "bundle de tokens estruturais" — não é o mesmo conceito           | Coexistem. Mas DECIDIR: archetype FK pra nova tabela `archetypes`? Slug enum?                                        |
| `tenants.theme_mode text DEFAULT 'auto'`                    | Não existe explicit. Light/dark vivem nas surfaces da palette                | DB            | Hoje light/dark é par derivado da mesma paleta (surfaces_dark[5] + surfaces_light[5])                                       | Adicionar coluna; mas confirmar que toggle não conflita com surface-derivation                                       |
| `--shadow-card-1..5` (5 níveis Vercel)                      | `--elevation-{flat,raised,overlay}` (3 níveis ADR-0042)                      | `globals.css` | Linear-leaning "flat-ish profissional". 5 níveis = Apple cinematográfico — explicitamente rejeitado                         | Se plano expandir pra 5, ADR-0042 vira superseded — registrar em nova ADR                                            |
| 25 semantic roles `--role-*`                                | Tokens shadcn aliasing (`--color-primary`, `--card`, etc) já são "semantic"  | `globals.css` | Layer atual é 2-camadas (raw `--color-*` em `@theme` + shadcn aliases em `@theme inline`). Plano propõe layer 1.5 explícita | Camada `--role-*` provavelmente vai ser SUPERSET (não substitui aliases shadcn) — aliases continuam pra retro-compat |
| Arquivos separados `app/styles/templates/*.css`             | Tudo em `globals.css` único + `/api/theme.css` runtime per tenant            | `app/`        | Theme runtime via API é ADR-0028 — preferência por `<link>` injection over static CSS files                                 | Confirmar: arquivos archetype são STATIC (1 por archetype) e theme RUNTIME continua via API?                         |
| `previous_archetype_id` + `archetype_changed_at`            | Não existe. `theme_version int` existe e serve cache busting                 | `tenants`     | Cache invalidation atual é via `theme_version` bump (no UPDATE de paleta/fonte/shape)                                       | Histórico de archetype change é dimensão nova — não conflita com versioning                                          |

---

## Resíduos de iteração potenciais (BAIXA confiança — revisar com user)

- **`lib/design/tokens.ts`** — `deriveTokens()` é stub que `throw AppError.internal('JIT')`. Comment indica trigger JIT: admin preview live, SSR email/PDF, Storybook tokens. Hoje é arquivo morto. **Mantém** se gatilho ainda válido; **deleta** se passos futuros (Storybook decorator Passo 8.1) escolherem outro caminho.
- **`lib/brand/types.ts`** isolado — pasta `lib/brand/` ficou só com `types.ts` (provider migrou pra `lib/route/`). Pasta inteira poderia ser `lib/route/brand-types.ts`. Não bloqueia nada — só assimetria.
- **Sidebar tokens** (`--color-sidebar-*` 7 vars em `@theme inline`) — vieram com shadcn `sidebar`. Plataforma usa sidebar? Se sim, integrar nos 25 roles; se não usa, são vestígios não-removíveis (zona quarentenada).

---

## Recomendações pra cada Passo subsequente

- **Passo 1 (curar 10-15 archetypes):** as 13 paletas atuais NÃO são archetypes — são overlays de cor. Archetype = bundle estrutural (typography + spacing + radius + elevation + density). Paleta atual ≠ archetype proposto. Não confundir.
- **Passo 2A (semantic colors audit):** já temos status colors fixos (success/warning/destructive/info OKLCH em `globals.css @theme`). Mapping pros 25 roles deve PRESERVAR essas 4 fixos — eles não variam per tenant por design.
- **Passo 2B (components catalog):** lista canônica é `components/ui/*` (53 primitives) + 3 wrappers `app-*`. Componentes inexistentes que archetypes pedem viram JIT custom.
- **Passo 2C (shadcn registries):** novo plano se relaciona com `mcp__shadcn__*` MCP — usar tools `list_items_in_registries`, `view_items_in_registries` antes de criar.
- **Passo 3 (25 semantic roles):** confirmar com user se `--role-*` vai SUPERSEDER `@theme inline` shadcn aliases OU virar camada 1.5 entre raw e aliases (compat). Hoje aliases `@theme inline` cobrem 21 vars + 7 radius — gap pequeno até 25.
- **Passo 4 (nomenclatura 3-layer):** `lib/design/palettes.ts` já é "layer pública" sobre `seeds/palettes.seed.ts`. Reusar padrão pra archetypes em `lib/design/archetypes/<name>/tokens.ts`.
- **Passo 5 (compatibility matrix 3D):** APCA helpers já existem em `lib/design/contrast.ts` (`apca`, `meetsApca`, `ensureAccessible`, `pickReadableForeground`). NÃO recriar — reutilizar.
- **Passo 6.1 (tokens CSS):** preservar `--shape-{card,button,input,badge,avatar}` (granular per primitive — ADR-0028) NÃO substituir por `--role-radius-*` único. Eles cobrem nicho diferente.
- **Passo 6.3 (migration tenants):** **CRÍTICO** — `tenants.palette_id` JÁ é uuid FK NOT NULL. Plano propõe text. NÃO migrar tipo — adicionar `archetype_id` como coluna nova text/uuid (decidir).
- **Passo 6.4 (dark mode):** dark/light derivam da MESMA paleta hoje (`surfaces_dark[5]` + `surfaces_light[5]`). `theme_mode` coluna nova faz sentido pra TOGGLE preference, não pra storage de tokens.
- **Passo 7 (lib/design/contract.ts):** `lib/design/contrast.ts` já tem `APCA_SILVER` const + `ApcaRole` type. Estender em vez de duplicar.
- **Passo 8.1 (Storybook decorator):** existem `.stories.tsx` em `components/ui/heading.stories.tsx`, `text.stories.tsx`, `muted.stories.tsx`, `logo.stories.tsx`, `app-form.stories.tsx`, `app-toast.stories.tsx`, `app-entitlement-gate.stories.tsx`. Storybook 10 (`@storybook/nextjs-vite`) é stack travado (ADR-0038). MCP endpoint `localhost:6006/mcp`.
- **Passo 8.2 (audit 47 primitives):** atualmente 53 (47 shadcn + 4 custom typography + 2 misc). Validar contagem antes de prometer.
- **Passo 9 (ADRs + rules + ESLint):** ADR-0042 (elevations) é o ÚNICO ADR claramente impactado por plano se shadow expandir 3→5. ADR-0028 + ADR-0029 (paletas template→instance) NÃO devem ser tocadas — base intencional do white-label.
- **Passo 10 (docs consolidados):** rule `design-tokens.md` tem gate de promoção JIT (`no-unknown-classes` warn→error) — propagar pra rule path-loaded das archetype tokens.

---

## Resumo executivo (5 achados críticos)

1. **`tenants.palette_id` é uuid FK desde dia 0** — plano §6.3 propõe `text DEFAULT 'default'`. Adotar literal quebra ADR-0028 + ADR-0029 (template→instance). Adicionar `archetype_id` como coluna NOVA sem tocar `palette_id` é o caminho consistente.
2. **ADR-0042 (3 elevations) é candidata única a supersede** se plano adotar 5 níveis Vercel. Todos os outros 4 ADRs auditados são premissas mantidas.
3. **Brand theming já é runtime via `/api/theme.css`** — arquivos estáticos `app/styles/templates/*.css` propostos no Passo 6.2 precisam coexistir, não substituir, o endpoint runtime.
4. **APCA helpers + 13 paletas + 3 shape presets + 7 fontes** já vivem no banco com governance (is_official, is_active, source_palette_id, sort_order). Camada nova de archetype precisa decidir: archetype é tabela própria? slug enum? bundle declarativo em `lib/design/archetypes/`?
5. **Layer atual já é 2-camadas (raw `@theme` + aliases shadcn `@theme inline`).** Plano propõe 3-layer — propor explicitamente onde a camada `--role-*` se encaixa: SUBSTITUI aliases? SE COLOCA ENTRE raw e aliases? Decisão afeta retro-compat de 53 primitives shadcn.

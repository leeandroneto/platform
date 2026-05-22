# 01 — Master System Map

> **Tipo:** architecture authoritative (mapa mestre cross-camada)
> **Data:** 2026-05-21
> **Lente:** olha o sistema inteiro como GRAFO (não lista de features). Fonte
> única pra "como tudo conecta end-to-end" depois do pivot ADR-0044 +
> draft ADR-0045.
> **Status:** descritivo (não-normativo). Decisões cravadas vivem em ADRs;
> este doc só consolida o que está cravado + identifica gaps + ordena risco.
> **Companion:** `docs/research/43-stack-comparative-analysis.md` (lente
> "alguém já fez isso melhor?")
> **Pré-leituras:** ADR-0024 · 0033 · 0040 · 0041 · 0044 · 0045 (draft) ·
> `docs/blueprint/{00,01,02,04,05,06,07,08,21}-*.md` ·
> `docs/research/{28,33,37,38,40,41}-*.md`

---

## 0. Como ler este documento

Este doc tem **7 camadas** (LAYER 1 → LAYER 7). Cada uma responde:

1. **O que vive aqui?** — entidades, tabelas, arquivos, primitivos.
2. **Quem habita hoje?** — código atual no working tree.
3. **Quem vai habitar?** — Fase de pivot ou Fase 1/2/3 produto onde entra.
4. **Conexão com camadas adjacentes** — quem chama quem, em qual direção.
5. **Anti-padrões a evitar** — bugs históricos + drift garantido.

A regra de leitura é "**dependência só desce, nunca sobe**" (ADR-0044 D.12

- `.claude/rules/layers.md`). Cada layer só pode importar layers abaixo
  dela. Quebrar essa direção = bug arquitetural de propagação.

§5 do final cobre **gaps + redundâncias + riscos de refactor** — o
"o que ninguém pensou ainda" + "o que está em risco quando feature X
chegar". Use essa seção pra calibrar prioridade da próxima sessão.

---

## 1. Visão de 30 segundos

```
═══════════════════════════════════════════════════════════════════
1 código + 1 deploy + N marcas filhas via hostname (ADR-0024)
═══════════════════════════════════════════════════════════════════

Request
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 2 — Multi-tenant runtime (proxy.ts → RouteProvider)       │
│   getRouteByHost(host) → { brand, tenant?, snapshot? }          │
└─────────────────────────────────────────────────────────────────┘
  ↓                                              ↓
┌────────────────────────────┐    ┌────────────────────────────────┐
│ LAYER 3 — Theme (TweakCN)  │    │ LAYER 4 — UI primitives + comp │
│ snapshot → CSS injection   │←───│ shadcn @ui → wrappers → blocks │
│ next-themes light/dark     │    │ Page/Form Engine renderer      │
└────────────────────────────┘    └────────────────────────────────┘
                                      ↓
                                  ┌────────────────────────────────┐
                                  │ LAYER 5 — Engines de conteúdo  │
                                  │ Form / Page / Lesson (Novel)   │
                                  │ kind polimórfico + versioning  │
                                  └────────────────────────────────┘
                                      ↑                  ↓
                                  ┌────────┐   ┌─────────────────┐
                                  │ LAYER 6│   │ LAYER 7 PWA     │
                                  │ AI orch│   │ manifest/icon/  │
                                  │ Sonnet │   │ SW Serwist      │
                                  └────────┘   └─────────────────┘

                              ↓
          ┌────────────────────────────────────────────────┐
          │ LAYER 1 — DB Postgres (Supabase, schema único) │
          │ brands → tenants → tenant_themes → versions    │
          │ programs · forms · pages · lessons · payments  │
          │ RLS por tenant_id (JWT claim) + APCA gate prod │
          └────────────────────────────────────────────────┘
```

**Em uma frase:** request entra → proxy resolve `brand/tenant/snapshot`
do banco → RouteProvider injeta no React tree → primitivos shadcn +
wrappers renderizam com cores da snapshot → engines de conteúdo
materializam spec em UI → AI compõe spec → PWA empacota tudo offline.

---

## 2. LAYER 1 — Database (Supabase Postgres)

### 2.1 O que vive aqui

Schema **único** `public.*` (ADR-0033 supersede 0025). 1 deploy = 1
database = N tenants isolados por RLS, nunca por schema.

```
public.brands (4 cols)
  ├ id uuid PK
  ├ host text UNIQUE    ← "desafit.app", "yoga.app", "ingles.app"
  ├ name text
  └ default_palette_id / logo_url / vertical_default / parent_label

public.tenants (N+8 cols)
  ├ id uuid PK
  ├ brand_id uuid FK → brands(id)
  ├ slug text             ← "joaopersonal"
  ├ vertical text         ← "fitness_strength"
  ├ active_theme_version_id uuid NULL → tenant_theme_versions(id) ★ G.1
  ├ default_locale/currency/tz
  └ pixels jsonb (Meta/GA4)

public.domains (1:N de tenant — ADR-0026)
  ├ tenant_id uuid FK
  ├ host text             ← "joaopersonal.desafit.app" OR custom
  ├ kind enum             ← 'subdomain' | 'custom'
  ├ is_primary bool
  └ ssl_status enum + verified_at

public.tenant_themes (1:1 de tenant — Fase 4 migration 0025)
  ├ tenant_id uuid PK FK
  └ theme_mode enum       ← 'light' | 'dark' | 'system'

public.tenant_theme_versions (Hotmart-like snapshot imutável)
  ├ id uuid PK
  ├ tenant_id uuid FK
  ├ version_number int    ← incrementa por trigger G.1
  ├ name text NULL        ← "Variant v2 — mais quente"
  ├ snapshot jsonb        ← ThemeSchema completo (32 cores + 3 fontes
  │                          + radius + 6 shadow + spacing)
  └ created_at + created_by

public.programs · public.modules · public.components ...
  (~27 tabelas dia 0 — blueprint 06)

public.forms · public.form_versions   (Engine Catalog ADR-0041)
public.pages · public.page_versions   (idem)

public.lessons (futuro — Novel JSONB body)
  └ body_jsonb jsonb      ← ProseMirror JSON @editor.getJSON()
```

### 2.2 Habitantes atuais (commits ✅)

- `brands`, `tenants`, `domains`, `palettes`, `fonts` — Fase 1.5 migration 0024
- `tenant_themes`, `tenant_theme_versions` — Fase 4 migration 0025 (`f632fde`)
- Triggers G.1 (auto-increment version_number), G.2 (RLS imutável insert-only)
- `auth.users` + Supabase managed schemas (não tocar)

### 2.3 Próximos habitantes (Fase de pivot ou produto)

| Fase                               | O que entra                                         | Por que                                            |
| ---------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| Pivot Fase 5                       | `theme_export` entitlement na `public.entitlements` | Builder UI consome quota                           |
| Pivot Fase 6                       | `ai_invocations` + `ai_usage_monthly`               | AI generation logging (já no roadmap blueprint 07) |
| Pivot Fase 7                       | `tenant_pages`, `tenant_blocks` + `*_versions`      | Page Engine consumer real                          |
| Produto Fase 1 (agência)           | `lead_capture` forms + `report` pages               | Funil agência                                      |
| Produto Fase 2 (self-service)      | `programs` + `modules` + `components` UI live       | Prof opera sem agência                             |
| Produto Fase 3 (Pacote A consumer) | `enrollments` + `payments` + `progress`             | Aluno final acessa PWA                             |

### 2.4 Conexão com camadas adjacentes

- **↑ Sobe pra LAYER 2:** `getRouteByHost(host)` faz `client.from('brands').select(...)` + join tenants/snapshot. Resposta vira `RouteContext` injetada via `RouteProvider`.
- **↓ Não desce.** DB é o chão.

### 2.5 Anti-padrões

| ❌                                                             | ✅                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `.schema('platform').from(...)`                                | `client.from('tenants')` (schema único, ADR-0033)                                                      |
| `auth.jwt() ->> 'tenant_id'` direto em RLS                     | `(select public.current_tenant_id())` wrap (100× speedup)                                              |
| Schema-per-tenant pra "isolar"                                 | Single schema + RLS é o padrão Supabase 2026 (research-22)                                             |
| SECDEF function aceitando `p_tenant_id` sem validar contra JWT | `assert request.jwt.claims.tenant_id == p_tenant_id` (memory `feedback_secdef_validates_tenant_id.md`) |
| Migrations `.sql` manuais                                      | `mcp__plugin_supabase_supabase__apply_migration` único canal                                           |

---

## 3. LAYER 2 — Multi-tenant runtime (proxy → resolver → snapshot)

### 3.1 O que vive aqui

A **fronteira request → tenant**. Toda request HTTP entra por
`proxy.ts` (ex-middleware no Next 16), extrai `host`, resolve no DB
qual brand/tenant atende esse host, e injeta o resultado no React tree.

```
proxy.ts (edge runtime)
  ↓ host = req.headers.get('host')
  ↓
getRouteByHost(host) :: lib/route/getRouteByHost.ts
  ↓ supabase.from('brands').select(...).eq('host', host)  ← brand match
  ↓ supabase.from('domains').select(tenants(...)).eq('host', host)  ← tenant match
  ↓
RouteContext = {
    brand:    { id, name, slug, defaultPaletteId, logoUrl, parentLabel },
    tenant?:  { id, slug, vertical, activeThemeVersionId },
    snapshot?: ThemeSchema  ← injetado em layouts via use(themePromise)
  }
  ↓
RouteProvider (Client + RSC pattern)
  ↓
  useBrand() / useTenantOptional() / useThemeSnapshot()
```

### 3.2 Habitantes atuais

- `proxy.ts` — Next 16, single edge file
- `lib/route/getRouteByHost.ts` (`4ce11a4`) + test
- `lib/route/RouteProvider.tsx` — Context Provider client-side
- `lib/route/types.ts` — `RouteContext`, `BrandRow`, `TenantRow`
- `app/api/brands/[slug]/...` — admin routes consumindo
- `app/api/tenants/[id]/{manifest.webmanifest,icon,theme.css}` — PWA tenant routes (Fase 1.5)

### 3.3 Conexão com camadas adjacentes

- **↓ LAYER 1:** consulta `brands` + `domains` + `tenant_theme_versions`. Cache combo via `cacheTag('tenant-route:<host>')` + `cacheTag('theme:<tenantId>:<version>')`.
- **↑ LAYER 3 (Theme):** `snapshot` resolve aqui vira CSS string em LAYER 3 via `buildThemeCSS(snapshot)`.
- **↑ LAYER 4 (UI):** `RouteProvider` injeta context pra componentes React lerem via `useBrand()`.
- **↑ LAYER 7 (PWA):** route handlers `/api/tenants/[id]/manifest.webmanifest` consomem snapshot.theme-color.

### 3.4 Anti-padrões

| ❌                                          | ✅                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| Hardcoded `"desafit"` em string literal     | `useBrand().name` (ADR-0024 + lint via vocab-audit)                          |
| `process.env.NEXT_PUBLIC_TENANT_ID`         | Resolver por hostname (Vercel Platforms pattern)                             |
| Brand resolution em Client Component (FOUC) | Server-side resolve antes do paint, injetar via use(promise) RSC             |
| Cache infinito sem revalidate               | `cacheTag` específico + `revalidateTag(\`tenant-theme:\${id}\`)` em mutation |

---

## 4. LAYER 3 — Theme system (TweakCN-way + next-themes)

### 4.1 O que vive aqui

A **transformação snapshot JSONB → CSS injetado em runtime**.
Adapta da TweakCN (single-tenant) pro nosso cenário (multi-tenant +
versioning + APCA gate). É o coração do white-label visual.

```
LAYER 1 (DB)
  ↓ tenant_theme_versions.snapshot jsonb
  ↓
ThemeSchema (Zod ~111 LOC)  :: lib/design/contract/theme.ts
  ├ light: ThemeColors (32 cores OKLCH)
  ├ dark:  ThemeColors (32 cores OKLCH)
  └ common: { fontSans, fontSerif, fontMono, radius, shadow*, ... }
  ↓
buildThemeCSS(snapshot, mode)  :: lib/design/build-theme-css.ts
  ↓ emit CSS string:
  ↓   :root { --color-background: oklch(...); ... }
  ↓   .dark { --color-background: oklch(...); ... }
  ↓
<style precedence="theme" dangerouslySetInnerHTML={...} />
  ↓ React 19 hoist garante CSS no <head>
  ↓
@theme inline em globals.css mapeia tokens → Tailwind v4 utilities
  ↓
bg-card / text-foreground / shadow-md / rounded-lg ... resolvem
  via CSS vars injetadas — sem rebuild
  ↓
next-themes ThemeProvider toggle .dark class no <html>
```

**Universal (não-tenant) em `globals.css @theme`:**

- `--touch-min: 44px`, `--inset-safe-*`, `--mobile-nav-height: 56px`
- z-index canonical, motion durations + easings (M3)
- spacing Carbon 8-base
- APCA Silver thresholds (constantes)
- breakpoint 768px

**Per-tenant (snapshot JSONB):**

- 32 cores (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar-\*) × 2 modes
- 3 fontes (sans, serif, mono)
- 1 radius
- 6 shadow primitives (color, opacity, blur, spread, offset-x/y)
- letter-spacing, spacing-opt

### 4.2 Habitantes atuais

- `lib/design/contract/theme.ts` — Zod schema 117 LOC (Fase 1)
- `lib/design/build-theme-css.ts` (Fase 1)
- `lib/design/registry/generate-registry-item.ts` (Fase 1 — também pra LAYER 4)
- `lib/design/seeds/brand-*.ts` (passo 3-5 design-system, commit `bdb79d4`)
- `app/layout.tsx` consome `<style precedence="theme">` via `await use(themePromise)`
- `next-themes 0.4.6` wired (Fase 4)
- `app/api/tenants/[id]/theme.css/route.ts` (PWA route)

### 4.3 Próximos habitantes

| Fase         | O que entra                                                                             |
| ------------ | --------------------------------------------------------------------------------------- |
| Pivot Fase 2 | extras opt-in (`--mini-player-height`?) — bloqueado em batch Theming                    |
| Pivot Fase 5 | Builder UI (theme studio) consume `forkTheme()` action                                  |
| Pivot Fase 6 | AI theme generation (Gemini 2.5 Flash) emite ThemeSchema validado                       |
| Pivot Fase 7 | `/api/r/themes/[id]/v{n}` registry endpoint (CORS aberto, validado via `shadcn/schema`) |

### 4.4 Conexão com camadas adjacentes

- **↓ LAYER 1:** lê `tenant_theme_versions.snapshot`. Mutations criam **nova versão** (Hotmart-like, imutável on insert via trigger G.2).
- **↓ LAYER 2:** snapshot vem do `RouteContext`.
- **↑ LAYER 4:** CSS vars consumidas por shadcn primitives (`bg-card`, `text-foreground`).
- **↑ LAYER 7:** snapshot.theme-color preenche `manifest.webmanifest`.

### 4.5 Anti-padrões

| ❌                                            | ✅                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| Inline `style={{ background: tenant.color }}` | CSS vars + `bg-primary` (ADR-0044 D.1)                                 |
| `--role-archetype` invented (ADR-0043 morto)  | shadcn-canonical ~45 keys TweakCN-vocab                                |
| WCAG 2.2 ratio check apenas                   | APCA Silver (body 75 / large 60 / non-text 45) dual-gate               |
| HEX armazenado no DB                          | OKLCH-primary (research-30); HEX só fallback JIT (manifest, email, OG) |
| Tenant 14ª paleta = nova migration            | Sem 14ª "paleta" — tenant escolhe/edita preset, paletas viram seed     |
| `--shape-*` legacy (ADR-0028) ainda no código | Deprecated (ADR-0044 D.5) → `--radius` puro                            |

---

## 5. LAYER 4 — UI primitives + composition

### 5.1 O que vive aqui

A **biblioteca de componentes React** organizada em 3 camadas
discriminadas (L1 → L2 → L3, ADR-0045 D.12), todas consumindo CSS
vars da LAYER 3.

```
L1 — shadcn primitives  :: components/ui/*.tsx  (vendored, zona quarentenada)
  ├ Button, Card, Input, Dialog, Sheet, Drawer (vaul) ...
  ├ Edit BLOQUEADO via PreToolUse hook (ADR-0040 §A)
  ├ Canal único: `pnpm dlx shadcn add @shadcn/<name>`
  └ Importa: apenas Radix + npm packages

L2 — semantic blocks  :: components/blocks/<kind>.tsx
  ├ HeroBlock, CtaBlock, FaqBlock, PricingBlock, TestimonialBlock,
  │ SocialProofBlock, FooterBlock  (7 MVP, ADR-0045 D.9)
  ├ namespace @platform
  ├ JSDoc @registry-meta extraída → lib/generated/block-catalog.json
  └ Importa: L1 via registryDependencies + npm

L3 — smart blocks  :: components/blocks/smart/<kind>.tsx
  ├ TransformationFunnel (vertical='fitness'), PranayamaFlow ('yoga'), etc
  ├ namespace @platform OR @desafit
  ├ vertical text NULL = universal; valor = restrito vertical
  ├ @composition declara dependência L2 sem alias
  └ Importa: L2 do mesmo/outro namespace + L1 + npm

⛔ L3 não importa L3 (composições circulares — ADR-0045 D.12)
⛔ L2 não importa L3 (dependência sobe)

Wrappers app-*.tsx  :: components/app-<feature>.tsx
  ├ COMPOSTO com valor agregado (i18n, error handling, Server Action wire)
  ├ Passthrough proibido (zona shadcn-zone.md)
  └ Pós-pivot ADR-0044: re-add JIT (deletados em surgical delete)

Registry catalog  :: lib/generated/block-catalog.json (gitignored)
  ↓ build script lê JSDoc + Zod schemas
  ↓ AI composer consome catálogo dinâmico
  ↓ MCP `shadcn@latest mcp` expõe lista
```

### 5.2 Habitantes atuais

- Pós surgical delete: `components/**` foi removido (ADR-0044 §14).
- shadcn primitives precisam reinstalar JIT via `pnpm dlx shadcn add` quando primeiro consumer pedir.
- Wrappers, typography, Logo voltam Fase 1-3 do produto.
- `lib/design/registry/generate-registry-item.ts` já presente (Fase 1).

### 5.3 Próximos habitantes

| Fase            | O que entra                                                           |
| --------------- | --------------------------------------------------------------------- |
| Pivot Fase 3    | Wrappers app-\* JIT por feature (Logo, AppButton só se passar guards) |
| Pivot Fase 5    | Builder UI shadcn (theme studio control panel)                        |
| Pivot Fase 7    | 7 L2 blocks dia 0 + endpoint `/api/r/[name].json`                     |
| Produto Fase 1  | Landing pages do funil agência consomem L2                            |
| Produto Fase 2  | Profissional reordena blocks via builder                              |
| Produto Fase 3+ | Smart L3 blocks vertical-specific (`@desafit/transformation-funnel`)  |

### 5.4 Conexão com camadas adjacentes

- **↓ LAYER 3:** consome CSS vars via classes Tailwind (`bg-primary`, `text-foreground`, `rounded-md`, `shadow-lg`).
- **↑ LAYER 5 (Engines):** Page Engine renderer dispatcha por `block.type` → instancia componente L2/L3.
- **↑ LAYER 6 (AI):** AI composer emite `PageSpec` com `block.type === registry-item.name === components/blocks/<name>` (âncora única ADR-0045 D.13).

### 5.5 Anti-padrões

| ❌                                                           | ✅                                                        |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| Passthrough wrapper (`<AppButton {...props} />`)             | Wrapper compõe ou DELETE (`.claude/rules/shadcn-zone.md`) |
| `eval(tsxCode)` no runtime pra v0 output                     | v0 demoted dev-only (ADR-0045 D.1); spec JSONB não JSX    |
| L3 importando outro L3                                       | Lint bans L3→L3 (composições circulares)                  |
| Alias `block.type === 'hero-v2'` mas registry-name `'hero'`  | Âncora única `type === name === kind` (ADR-0045 D.13)     |
| Componente direto em `app/<rota>/page.tsx` sem ir via Engine | Page Engine renderer dispatcha (ADR-0041)                 |

---

## 6. LAYER 5 — Engines de conteúdo

### 6.1 O que vive aqui

**2 motores polimórficos** (ADR-0041) que materializam UI a partir
de spec JSONB persistida no DB. Cada um tem `kind` (polimórfico) e
`scope` (reuso interno/externo).

```
Form Engine  ┌─ forms (tenant_id, kind, scope, name)
             │    kind: lead_capture | onboarding | anamnese | brief
             │    scope: tenant | internal | platform
             ↓
             form_versions (form_id, version_number, definition jsonb)
                  ↓
             definition = {
               steps: [{ blocks: [{ type, ref, props, bindings? }] }],
               logic: [{ when, then }]
             }
                  ↓
             Form Engine renderer (linear: steps → blocks)
                  ↓
             form_responses (post-submit) +
             workflow apply_bindings → domain tables

Page Engine  ┌─ pages (tenant_id, kind, scope, name)
             │    kind: landing | sales | document | thank_you | report | error | blog
             │    scope: tenant | internal | platform
             ↓
             page_versions (page_id, version_number, definition jsonb)
                  ↓
             definition = recursive tree {
               type: 'hero',
               props: { headline, cta },
               children: [ {type, props, children?} ]
             }
                  ↓
             Page Engine renderer (recursive: type dispatch)
                  ↓
             dispatcha pra L2/L3 components

Lesson Engine (futuro) ┌─ lessons (tenant_id, body_jsonb)
                       │
                       ↓ Novel + Tiptap
                       body_jsonb = ProseMirror JSON
                       SSR via @tiptap/static-renderer
                       AI inline commands (continue/rewrite/summarize)
                       Bundle só em rotas admin/profissional
```

### 6.2 Habitantes atuais

- Schema cravado em ADR-0041 + `.claude/rules/forms-engine.md`.
- Tabelas `forms`, `form_versions`, `pages`, `page_versions` previstas — não migradas ainda (Fase 7 do pivot).
- Domain catalog skeleton em blueprint 21 §5.

### 6.3 Próximos habitantes

| Fase           | O que entra                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| Pivot Fase 7   | Migrations `tenant_pages` + `tenant_blocks` + `*_versions`                   |
| Pivot Fase 7   | Form Engine + Page Engine renderers (RSC + Client switch via block.type)     |
| Produto Fase 1 | `forms.kind='lead_capture'` + `pages.kind='report'` (funil agência IA)       |
| Produto Fase 2 | `pages.kind='landing'`/`'sales'` + builder UI prof                           |
| Produto Fase 3 | Lesson Engine (Novel install JIT — ADR-0045 D.4) — `body_jsonb` em `lessons` |
| Futuro         | Program Engine, Email Engine, Push Engine (catalog blueprint 21 §2)          |

### 6.4 Conexão com camadas adjacentes

- **↓ LAYER 1:** persistência via `form_versions.definition` + `page_versions.definition` JSONB.
- **↓ LAYER 3:** renderer emite componentes que consomem CSS vars.
- **↓ LAYER 4:** dispatcha por `block.type` → instancia L2/L3.
- **↑ LAYER 6 (AI):** AI composer emite spec via `generateObject(PageSpec)` greenfield OU `streamText + toolCalling` pra edits incrementais (ADR-0045 D.5).

### 6.5 Anti-padrões

| ❌                                              | ✅                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1 motor único "Mega Engine" pra Form+Page       | 2 motores separados (ADR-0041) — linear vs árvore                                  |
| Spec sem versionamento (overwrite na mesma row) | `*_versions` Hotmart-like + active\_\*\_version_id (G.1 trigger)                   |
| Form report obrigatório                         | Report = `pages.kind='report'` opcional (não regra)                                |
| Persistir HTML/TSX renderizado no DB            | Spec JSONB (estrutura, não renderização)                                           |
| Renderer ignora schema versão                   | `schema_version` validado por Zod (multi-version safe)                             |
| Block kind novo direto em DB sem contrato Zod   | 1 file = 1 kind em `lib/contracts/{form,page}-blocks/<kind>.ts` + `@registry-meta` |

---

## 7. LAYER 6 — AI orchestration

### 7.1 O que vive aqui

**Vercel AI Gateway** como único provider + 4 paradigmas convivendo
(ADR-0045 D.5 + D.6):

```
Router/classifier
  ├ anthropic/claude-haiku-4-5
  └ Decide: form vs page? Greenfield vs edit?
  ↓
generateObject(PageSpec | FormDefinition)   ← Greenfield
  ├ anthropic/claude-sonnet-4-6
  ├ schema Zod (compiled grammar via Anthropic JSON Outputs GA)
  ├ safeParse + 3 retries + APCA gate pós-output
  └ 1 turn, validação automática
  ↓
streamText + tool calling                    ← Edits incrementais
  ├ anthropic/claude-haiku-4-5 (Page edit JSON Patch EASE) OR sonnet
  ├ 31% menos tokens vs regenerate (research-24 §11)
  └ Tools: `applyPatch(path, value)`, `addBlock(type, after)`, etc

streamObject(themeStylesSchema)             ← Theme generation (TweakCN-way)
  ├ google/gemini-2.5-flash (3-flash-preview fallback)
  ├ multimodal: prompt OR image
  ├ APCA Silver client-side soft-warn (não re-prompt automático)
  └ pattern: streamText(base) chama tool `generateTheme()` que internamente streamObject

Novel inline (continue/summarize/rewrite)   ← Prose editor
  ├ openai/gpt-5-mini OR anthropic/claude-haiku-4-5 (TBD benchmark)
  ├ streamText + tool calling baixa latência
  └ Bundle só em rotas admin/profissional
```

### 7.2 Habitantes atuais

- `@ai-sdk/anthropic` + `ai@^6` instalados.
- `.mcp.json` configura MCP servers (shadcn `@latest mcp`, tweakcn registry).
- Nenhum prompt/route AI ativo no working tree pós-pivot.

### 7.3 Próximos habitantes

| Fase                      | O que entra                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| Pivot Fase 6              | `lib/ai/{router,generator,prompts}.ts` + route `app/api/generate-theme/route.ts` adaptado de TweakCN |
| Pivot Fase 6              | `recordAIUsage` action + tabelas `ai_invocations`, `ai_usage_monthly`                                |
| Produto Fase 1            | Funil agência: lead → Workflow → `generate-assessment` Edge Function → page report                   |
| Produto Fase 1            | Pre-screen Haiku input sanitization (blueprint 07 §3)                                                |
| Produto Fase 2            | Vibe coding pipeline 4 estágios (ID → Estrutura → Componentes → Coerência)                           |
| Produto Fase 3 (Pacote C) | Chatbot nutricional Haiku + system cache TBCA/TACO                                                   |

### 7.4 Conexão com camadas adjacentes

- **↓ LAYER 5 (Engines):** emite `PageSpec`/`FormDefinition` validado contra Zod.
- **↓ LAYER 3 (Theme):** emite `ThemeStyles` validado; gera novo `tenant_theme_versions` snapshot.
- **↓ LAYER 1 (DB):** logs `ai_invocations` (prompt_hash LGPD-safe + tokens + model).
- **↑ LAYER 4 (UI):** chat UI consome via `@ai-sdk/react` `useChat()` streaming.

### 7.5 Anti-padrões

| ❌                                          | ✅                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| Prompt inline em código                     | `lib/ai/prompts.ts` versionado + `ai_prompts` table (blueprint 07)        |
| Hardcoded model `"claude-sonnet"` em string | `anthropic/claude-sonnet-4-6` via Vercel AI Gateway pinado                |
| `eval()` na resposta AI                     | `generateObject` + Zod compiled grammar (JSON Outputs GA)                 |
| Re-prompt automático infinito por APCA fail | Client-side soft-warn + botão "tentar com mais contraste" (ADR-0045 D.17) |
| `streamObject` pra editar JSON existente    | `streamText + tool calling` (regenerate = 31% mais tokens)                |
| AI lê arquivo TSX direto pra "compor"       | AI emite spec JSONB; renderer materializa (ADR-0045 D.1 v0 demoted)       |
| pgvector instalado dia 1                    | JIT (gatilho ≥100 conv/dia OU custo >R$200/mês, blueprint 02 §8)          |

---

## 8. LAYER 7 — PWA per-tenant

### 8.1 O que vive aqui

**Cada tenant tem PWA próprio:** manifest, icons, theme-color, SW
strategy. Tudo dinâmico via route handlers que consomem `RouteContext`
da LAYER 2.

```
proxy.ts já resolveu host → tenant
  ↓
app/api/tenants/[id]/manifest.webmanifest/route.ts
  ↓ retorna {
      name: tenant.name,
      short_name: ...,
      theme_color: snapshot.themeColor,  ← OKLCH → HEX JIT
      background_color: snapshot.background,
      icons: ['/api/tenants/[id]/icon/192', '/api/tenants/[id]/icon/512']
    }

app/api/tenants/[id]/icon/[size]/route.ts
  ↓ Vercel OG ImageResponse renders SVG → PNG cached
  ↓ logo do tenant + cor primária

app/api/tenants/[id]/theme.css/route.ts
  ↓ emit CSS string from buildThemeCSS(snapshot)
  ↓ cache: public, max-age=31536000, immutable
  ↓ cache-bust via ?v=theme_version

Serwist (@serwist/turbopack 9.5+)
  ↓ SW runtime configurado em serwist.config.ts
  ↓ Cache strategy matrix (blueprint 08 §2):
  │   HTML routes: NetworkFirst 3s → /~offline
  │   /_next/static/*: CacheFirst immutable
  │   Per-tenant theme.css: SWR
  │   Supabase Storage images: CacheFirst 30d (NÃO 206/range)
  │   Bunny Stream .m3u8: NetworkOnly
  │   API GET reads: SWR + mirror IndexedDB
  │   API POST/PATCH: NetworkOnly + intercept → enqueue
  ↓
IndexedDB queue (idb-keyval ~600B gzip)
  ↓ queue:component_progress, queue:check_in, cache:program:<id>
  ↓ idempotency key + exponential backoff 2→4→8→16→32s, 6 attempts
  ↓
Custom install prompt (vaul bottom-sheet)
  ↓ 2ª sessão + 1ª ação significativa + 7d dismiss cap

Web Push + Vapid (1 par por tenant — RFC 8292)
  ↓ tenants.vapid_public_key + tenants.vapid_private_key
  ↓ public.push_subscriptions table
```

### 8.2 Habitantes atuais

- `@serwist/turbopack 9.5+` instalado, configurado JIT pré-fix em Fase 1.5 (6 PWA routes ajustadas)
- Cache strategy não consolidada — aguarda primeiro consumer real
- IndexedDB queue + Vapid keys: schema dia 1, materialização JIT
- 3 PWA tenant routes consomem snapshot (Fase 4)

### 8.3 Próximos habitantes

| Fase                               | O que entra                                                    |
| ---------------------------------- | -------------------------------------------------------------- |
| Produto Fase 3 (Pacote A consumer) | PWA aluno fitness — 5 tabs nav, install prompt, push subscribe |
| Produto Fase 3                     | Mutation queue real (sets/reps/cargas offline)                 |
| Produto Fase 3                     | Bunny Stream player + HLS .m3u8 NetworkOnly                    |
| Futuro                             | WhatsApp push fallback via Meta Cloud API (mês 4-6)            |

### 8.4 Conexão com camadas adjacentes

- **↓ LAYER 1:** lê `tenants.vapid_*`, `push_subscriptions`, `tenant_theme_versions` (icon).
- **↓ LAYER 2:** consome `RouteContext` pra resolver qual tenant é dono do manifest.
- **↓ LAYER 3:** snapshot.themeColor preenche `theme_color`.

### 8.5 Anti-padrões

| ❌                                  | ✅                                                    |
| ----------------------------------- | ----------------------------------------------------- |
| 1 manifest single-tenant            | 1 manifest per tenant route handler                   |
| `manifest.json` static no `public/` | Dinâmico `/api/tenants/[id]/manifest.webmanifest`     |
| 1 par Vapid global                  | 1 par per tenant (RFC 8292 best practice)             |
| 100vh em layout PWA                 | `100dvh` + ESLint `no-vh-in-mobile-aware`             |
| Cache 206/range em images           | CacheFirst exclude opaque partials (blow quota iOS)   |
| `next-pwa` legacy abandonado        | Serwist + `@serwist/turbopack` 9.5+ (blueprint 08 §1) |

---

## 9. Gaps + Redundâncias + Riscos (a parte que importa)

### 9.1 Buracos arquiteturais — peça que ninguém pensou

**[GAP-1] Rate limiting AI per-tenant não desenhado.**
TweakCN usa `@upstash/ratelimit + @vercel/kv` (5 req/60s fixed window).
Nosso plano cita Upstash Free tier (blueprint 02 §4) mas não tem
camada de aplicação. Quando Fase 6 (AI generation) ligar, tenant pode
queimar quota AI do projeto inteiro em 1 sessão de chat. Precisa
`requireQuota('ai_theme_generation')` server-side (ADR-0039 já tem
infra, falta o key específico).

**[GAP-2] Theme.css cache invalidation entre tenants compartilha pool.**
PWA Serwist cacheia `/api/tenants/[id]/theme.css` SWR. Cache key vem
do `?v=theme_version` query string. Mas se 100 tenants atualizarem
theme no mesmo dia, IDB cache do aluno cresce sem cap explícito —
strategy só fala `max 32 entries` total CSS. Validar se 32 cobre uso
realístico (aluno típico tem 1-3 tenants, ok).

**[GAP-3] Domain catalog skeleton (ADR-0041 / blueprint 21 §5) não materializado.**
`lib/contracts/domain-catalog.ts` não existe ainda. Quando Fase 1
(funil agência) começar a usar `bindings[]` em form blocks, AI
roteador precisa consultar catalog pra (a) sugerir bindings, (b)
detectar duplicação, (c) gerar report. Sem catalog → AI inventa
campos que não existem.

**[GAP-4] Versionamento de block schema não tem migration path.**
Quando `lib/contracts/page-blocks/hero.ts` ganhar `variant: 'X'`
novo, todos os `page_versions.definition` antigos viram inválidos.
`schema_version` está na tabela `components` (dia 0 — blueprint 06)
mas Form/Page Engine versions não têm campo equivalente cravado.

**[GAP-5] APCA gate em prod build vs runtime.**
APCA Silver dual-gate roda via `pnpm validate:apca` prebuild script.
Mas tenant cria preset custom em runtime — validação roda só client-side
soft-warn (ADR-0045 D.17). Se AI gera tema que fura APCA e tenant
clica "Salvar mesmo assim", snapshot vai pro DB. Falta hard-gate
opcional em mutation (`saveThemeVersion` action checa APCA pre-insert,
opcional via `enforce_apca` boolean per tenant).

**[GAP-6] AI prompt drift detection.**
`ai_prompts` table versionada (blueprint 07) cobre system prompts.
Mas TweakCN-style prompt vive em `lib/ai/prompts.ts` (constants). Sem
mecanismo de sincronizar mudança de prompt code → bump version table
→ trigger eval Promptfoo CI. Drift garantido quando prompt muda
casualmente em PR.

**[GAP-7] Storage strategy de PDFs/relatórios de IA (funil agência).**
Blueprint 21 cita "Storage Engine" como `Vercel Blob (reports) + Supabase Storage (uploads)`.
Mas Funil agência Fase 1: relatório AI vira PDF? PNG via Satori? Markdown
em `pages.kind='report'` blob? Sem decisão cravada — research-25 abre
opções mas não fecha.

### 9.2 Redundâncias — 2 peças resolvendo mesma coisa

**[RED-1] Page Engine vs Novel — ambos editam conteúdo.**
Sobreposição **mínima** mas existe. Page Engine = block tree (hero,
cta, faq). Novel = prose linear (lesson body). Decisão atual: separar
por feature (ADR-0045 D.4). Risco: tentação de usar Page Engine
pra Lesson body em vez de Novel. Anti-padrão precisa estar lint-enforced.

**[RED-2] Form Engine vs Page Engine — block kind 'embed-form'.**
Blueprint 21 §3.1 cita "Page Engine → Form Engine via Block `embed-form`
referenciando form publicado". Ok. Mas se vibe coding pipeline (Fase 2
produto) for "AI gera programa + landing + capture form", uma única
spec atravessa N engines. Quem é o owner do estado intermediário?

**[RED-3] AI orchestration paradigms convivem.**
4 paradigmas: `generateObject` greenfield + `streamText+tool` edits +
`streamObject` theme + `streamText+useChat` novel inline. Cada um
tem prompt, retries, error handling diferentes. Complexidade
arquitetural alta (ADR-0045 §Trade-offs). Sem `lib/ai/orchestrator.ts`
unificador, dev futuro vai duplicar boilerplate em cada feature.

**[RED-4] Cache strategy entre Next 16 Cache Components + Serwist + IndexedDB.**
3 camadas de cache, 3 estratégias de invalidation diferentes. Next
16: `cacheTag('theme:<id>:<v>') + revalidateTag`. Serwist: SWR
matrix. IndexedDB: idempotency keys + manual evict. Tenant atualiza
theme → tag revalida → mas aluno offline tem theme.css cached no SW
até next online sync. Drift visual aceito mas precisa documentar
SLA.

### 9.3 Decisões cravadas vs pendentes (vista holística)

| Decisão                                              | Status                       | Camada    | Risco se mudar              |
| ---------------------------------------------------- | ---------------------------- | --------- | --------------------------- |
| Schema único `public.*` (ADR-0033)                   | ✅ cravado                   | LAYER 1   | Alto (migration N tabelas)  |
| Multi-marca hostname (ADR-0024)                      | ✅ cravado                   | LAYER 2   | Alto (refactor proxy)       |
| shadcn-canonical ~45 keys (ADR-0044)                 | ✅ cravado                   | LAYER 3   | Baixo (Zod schema só)       |
| OKLCH-primary (research-30 validado)                 | ✅ cravado                   | LAYER 3   | Baixo                       |
| 2 Engines polimórficos (ADR-0041)                    | ✅ cravado                   | LAYER 5   | Médio (vocab muda)          |
| v0 demoted (ADR-0045 D.1)                            | ✅ cravado                   | LAYER 6   | Baixo                       |
| Novel ADOPT NOW + INSTALL JIT (ADR-0045 D.4)         | ✅ cravado                   | LAYER 5   | Baixo até consumer          |
| `registry:style` não `:theme` (ADR-0045 D.15)        | ✅ cravado                   | LAYER 4   | Baixo                       |
| Block catalog JSDoc → table JIT (ADR-0045 D.2)       | ✅ cravado                   | LAYER 4   | Médio se virar 3 consumers  |
| AI híbrido generateObject+toolCalling (ADR-0045 D.5) | ✅ cravado                   | LAYER 6   | Médio                       |
| Vapid 1 par per tenant (RFC 8292)                    | ✅ cravado                   | LAYER 7   | Baixo                       |
| Cache strategy matrix PWA                            | 🟡 desenhada, não exercitada | LAYER 7   | Médio (revisar Fase 3 prod) |
| Extras opt-in mobile/PWA Fase 2                      | 🟡 batch Theming pendente    | LAYER 3   | Baixo (descarte é default)  |
| Rate limit AI per-tenant                             | ❌ não desenhada             | LAYER 6   | **Alto** (GAP-1)            |
| Domain catalog skeleton                              | ❌ não materializada         | LAYER 5   | **Alto** (GAP-3)            |
| Block schema versioning migration path               | ❌ não desenhada             | LAYER 5   | **Alto** (GAP-4)            |
| APCA hard-gate em mutation server                    | ❌ não desenhada             | LAYER 3   | Médio (GAP-5)               |
| AI prompt drift detection                            | ❌ não desenhada             | LAYER 6   | Médio (GAP-6)               |
| Storage de PDFs/reports (formato canônico)           | ❌ não cravada               | LAYER 1+7 | Médio (GAP-7)               |

### 9.4 Ordering crítico de execução — qual fase desbloqueia qual

**Reading do mapa:**

```
Fase -1 ✅ → Fase 0 ✅ → Fase 1 ✅ → Fase 1.5 ✅ → Fase 4 ✅
                                                          ↓
                                       (Fase 2 ⏸ batch Theming)
                                                          ↓
                                ┌─────────────────────────┴────────────┐
                                ↓                                       ↓
                  Fase 5 — Builder UI                Fase 6 — AI generation
                  (TweakCN editor adapted)           (TweakCN AI pipeline)
                                                          ↓
                                                  Fase 7 — Registry + Pages
                                                  (ADR-0045 cravado, falta executar)
                                                          ↓
                                                  Fase 8 — Showcase fim
```

**Insight crítico:** Fase 5, 6, 7 podem ser **paralelas** entre si após
Fase 2 destravar (batch Theming). Plano §17 já reconhece. Mas Fase 7
(registry + page engine) bloqueia funil agência (produto Fase 1) — sem
Page Engine, agência não tem `pages.kind='report'` pra entregar landing

- report do funil.

**Reordering proposto (sem mudar plano, só lente):**

1. **Resolver batch Theming** (D.2 mobile/PWA tokens) → 1-2h decisão + 0.5h commit.
2. **Resolver GAP-1 (rate limit AI)** simultâneo — Bloqueia Fase 6.
3. **Resolver GAP-3 (domain catalog)** simultâneo — Bloqueia Fase 7 + funil.
4. **Fase 5 + 6 paralelas** (TweakCN extract → adapt) — 60-90h.
5. **Fase 7** depende Fase 5/6 e GAP-3 → Cravar ADR-0045 final (sair de draft) + executar.
6. **Funil agência Fase 1 produto** após Fase 7 do pivot.

---

## 10. Princípios cravados (recap pra Claude futuro)

1. **1 código + 1 deploy + N marcas filhas via hostname.** ADR-0024.
2. **Schema único `public.*` + RLS por `tenant_id` JWT.** ADR-0033.
3. **shadcn-canonical ~45 keys é interface pública.** ADR-0044. Extras opt-in após estudo.
4. **Universal vs per-tenant — distinguir SEMPRE.** Mobile chrome, z-index, motion, APCA = universal. Cores, fontes, radius, shadow = per-tenant. ADR-0044 §2.
5. **Engines polimórficos via `kind` + `scope`.** ADR-0041. Reuso interno via `scope='internal'`/`'platform'` + RLS condicional.
6. **`pages.kind === registry-item.name === block.type` — âncora única.** ADR-0045 D.13.
7. **Dependência só desce (LAYER N+1 → N).** ADR-0044 D.12 + `.claude/rules/layers.md`.
8. **Abstração nasce do 3º uso.** Wrappers JIT pós-pivot. `.claude/rules/abstractions.md`.
9. **Hotmart-like versionamento.** `*_versions` imutável on-insert (trigger G.2), `active_*_version_id` ponteiro (G.1).
10. **JIT > upfront.** Tabelas, endpoints, pacotes só quando consumer real existe.

---

## 11. Referências

- ADR-0024 — multi-marca hostname (LAYER 2)
- ADR-0033 — schema único public (LAYER 1)
- ADR-0039 — entitlements RPCs (LAYER 6 quota gate)
- ADR-0040 — closure dia 0 (shadcn-zone, i18n, APCA)
- ADR-0041 — engine catalog 2 motores (LAYER 5)
- ADR-0044 — pivot TweakCN-way shadcn-canonical (LAYER 3+4)
- ADR-0045 draft — registry strategy + AI orch + Novel (LAYER 4+5+6)
- Blueprint 00 — constituição
- Blueprint 01 — arquitetura (camadas)
- Blueprint 02 — stack travado
- Blueprint 04 — camadas imports
- Blueprint 05 — design system base
- Blueprint 06 — data model (~27 tabelas dia 0)
- Blueprint 07 — AI prompts pipeline
- Blueprint 08 — PWA offline-first
- Blueprint 21 — engine catalog completo
- Research 22 — Supabase multi-tenant audit
- Research 28 — TweakCN evaluation
- Research 30 — OKLCH-primary validado
- Research 33 — theme versioning pattern
- Research 37 — mobile/PWA extras opt-in
- Research 38 — registry + Novel + AI orchestration
- Research 40 — shadcn registry deep-dive
- Research 41 — audit TweakCN Fases 5/6/7
- Companion: `docs/research/43-stack-comparative-analysis.md` — lente comparativa stack
- `C:\Users\leean\Desktop\tweakcn-ref\` — SSOT TweakCN clone
- `C:\Users\leean\Desktop\novel-ref\` — SSOT Novel clone
- `C:\Users\leean\Desktop\vercel-platforms-ref\` — multi-tenant hostname reference
- `C:\Users\leean\Desktop\next-forge-ref\` — Turborepo SaaS reference
- `C:\Users\leean\Desktop\ai-chatbot-ref\` — Vercel AI SDK + Drizzle reference
- `C:\Users\leean\Desktop\vercel-saas-ref\` — Next SaaS Starter (Stripe + Drizzle) reference

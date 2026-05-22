---
markmap:
  colorFreezeLevel: 2
  maxWidth: 360
  initialExpandLevel: 3
---

# Design System (pós-pivot ADR-0044)

## Modelo em 1 frase

- Adapt **AO shadcn-canonical** (TweakCN-vocab) — não inventar paralelo
- ~45 keys (32 cores + 3 fontes + 1 radius + 6 shadow primitives + shadow-color + letter-spacing + spacing-opt)
- 1 deploy + N marcas filhas via hostname (ADR-0024)
- Per-tenant runtime via `<style precedence="theme">` React 19 hoist
- Versionamento Hotmart-like — profissional salva variações pra reutilizar

## Status atual (2026-05-21)

### ✅ Concluído

- Fase -1: Clone TweakCN em `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, Apache-2.0)
- Fase 0: Surgical delete invented layer (9.580 LOC archetypes + 67 roles + 5 ESLint rules)
- Fase 1: Foundation reset (theme.ts Zod 117 LOC + build-theme-css.ts + globals.css universal-only + ThemeStyle async em layout)
- Fase 1.5 (2026-05-21): DB cleanup migration 0024 + pré-fix 6 PWA routes
- **Fase 4 (2026-05-21)**: Theme storage + versionamento — migration 0025 (`tenant_themes` + `tenant_theme_versions` + triggers G.1/G.2 + RLS) + 4 server actions (bootstrap/save/list/restore) + next-themes wireup G.4 + 3 PWA tenant routes consomem snapshot
- Princípios 8-10 cravados (extract+adapt, versionamento extensão, audit-per-phase)

### ⏭️ Próximo

- **Fase 2** (decide D2): Estudo mobile/PWA extension — extras opt-in (`--touch-min`, `--mobile-nav-height`, `--frosted-*`) — bloqueado em §17 batch Theming
- Fase 5: Builder UI clone TweakCN (S5.0 consolidado em research-41 audit) + `forkTheme` action (G.3 deferred) + Storybook 10 re-install (5.0)
- Fase 3, 6-8: Presets, AI generation, registry (ADR-0045 / batch AI), Validation Suite Contínua (8.1-8.4)

> **Detalhe operacional:** ver `docs/plans/pivot-tweakcn.md` §STATUS ATUAL (topo) + §17 Open questions ativas (batches Theming/AI/Registry/ESLint).

## 10 Princípios não-negociáveis (ADR-0044 + plan §0)

### 1. TweakCN clone = SSOT

- Read-only em `C:\Users\leean\Desktop\tweakcn-ref\`
- Mata inferência de WebFetch

### 2. Study-first em CADA fase

- Decisão arquitetural só após estudo prévio com dados

### 3. Universal vs per-tenant — distinguir SEMPRE

- Universal: mobile chrome, z-index, motion, spacing Carbon, APCA → `globals.css`
- Per-tenant: cores, fontes, radius, shadow → DB + `<style precedence="theme">`

### 4. shadcn-canonical é interface pública

- ~45 keys TweakCN-vocab — ecosystem fala essa língua

### 5. Build verde a cada commit

- Quebras intencionais consertadas no mesmo commit

### 6. Visual check a cada etapa

- `pnpm dev` + verificação manual rota afetada

### 7. Delete > move-to-legacy

- Sem `..\platform-legacy\` — git history preserva

### 8. Extrair lógica + adaptar (NÃO copy cego)

- TweakCN é single-tenant; nós multi-tenant + white-label + PWA
- Adapt: `getShadowMap()`, OKLCH-primary, editor UX, `<style precedence="theme">`
- Skip: better-auth, Drizzle+Neon, Zustand, community gallery
- Atribuir via comentário "adapted from tweakcn-ref/..."

### 9. Versionamento = extensão obrigatória nossa

- TweakCN tem 1 theme ativo só (sem versions per user)
- Nós: `tenant_themes` + `tenant_theme_versions` (snapshot JSONB imutável)
- Profissional clona variant → tweak → salva v2 → restore v1 JIT
- Pattern alinhado com ADR-0041 `*_versions` (form/page)

### 10. Cada fase = audit dedicado TweakCN

- Fase 4-7 abrem com `Sx.0 — Audit tweakcn-ref/<paths>`
- Fase 1.5/2/3/8 não precisam (sem código equivalente)

## Os ~45 keys canonical (TweakCN-vocab)

### Per-tenant — vivem em DB + emit runtime

#### 32 cores (light + dark separados)

- background / foreground
- card / card-foreground
- popover / popover-foreground
- primary / primary-foreground
- secondary / secondary-foreground
- muted / muted-foreground
- accent / accent-foreground
- destructive / destructive-foreground
- border · input · ring
- chart-1..5
- sidebar / sidebar-foreground / sidebar-primary / sidebar-primary-foreground / sidebar-accent / sidebar-accent-foreground / sidebar-border / sidebar-ring

#### 3 fontes

- `--font-sans` · `--font-serif` · `--font-mono`
- Banido: 5 slots (display/body/mono/accent/eyebrow)

#### 1 radius

- `--radius` (Tailwind v4 deriva sm/md/lg/xl/2xl/3xl/4xl)

#### 6 shadow primitives → 8 níveis derivados

- `--shadow-color` · `--shadow-opacity` · `--shadow-blur`
- `--shadow-spread` · `--shadow-offset-x` · `--shadow-offset-y`
- Algoritmo `getShadowMap()` deriva: `--shadow-2xs/xs/sm/md/lg/xl/2xl` + `--shadow` alias

#### 11 keys "shared" (duplicadas em light + dark — TweakCN-way)

Antes viviam em `ThemeCommonSchema` separado. Pós-refactor 2026-05-21: duplicadas
em ambos os modos com mesmos valores. UI garante sync via 1 picker (COMMON_STYLES).

- `--font-sans` · `--font-serif` · `--font-mono`
- `--radius`
- `--shadow-opacity` · `--shadow-blur` · `--shadow-spread` · `--shadow-offset-x` · `--shadow-offset-y`
- `--letter-spacing` (emitido como `tracking-normal` no shadcn registry)
- `--spacing` (Tailwind v4 base override per-tenant — opcional)

### Universal — vivem em `app/globals.css`

- Mobile primitives (iOS HIG): `--touch-min`, `--inset-safe-*`, `--mobile-full-height` 100dvh, `--mobile-nav-height`, `--fab-size`, `--press-scale`
- Frosted glass: `--frosted-blur/saturate/opacity`
- Z-index canonical: `--z-content/sticky/fab/mini-player/nav-bottom/overlay/modal/toast/tooltip`
- Motion: `--duration-{instant,fast,normal,slow}` + `--ease-out/in-out/spring`
- Spacing scale Carbon 8-base: `--spacing-0..32` (numérica, ortogonal ao `--spacing` per-tenant)
- Breakpoint: `--breakpoint-mobile` 768px
- Icon sizes: `--icon-{xs,sm,md,lg,xl}`
- APCA thresholds (constantes, não vars): body Lc≥75, large ≥60, non-text ≥45

## Color format

- DB armazena OKLCH literal (`"oklch(0.55 0.2 270)"`)
- `buildThemeCSS()` emite OKLCH literal
- APCA opera em OKLCH nativo via `apca-w3` + `culori`
- HEX só fallback JIT (PWA manifest theme-color, email HTML, OG image) via `oklchToHex()` em `lib/design/contrast.ts`

## Multi-tenant runtime

### Fluxo theming

1. `proxy.ts` resolve `host → brand+tenant` (ADR-0024)
2. `getRouteByHost()` carrega `tenants.active_theme_version_id → tenant_theme_versions.snapshot` (Zod `Theme`)
3. `app/layout.tsx` chama `buildThemeCSS(snapshot)` dentro de `<Suspense>` e emite `<style precedence="theme">` (React 19 hoist pro `<head>`)
4. Cache via `cacheTag('theme:<tenantId>:<version>')`
5. shadcn primitives consomem `--background`/`--card`/etc direto

### Pra não esquecer

- NUNCA hardcoded `desafit`/`yoga.app`/`ingles.app` (ADR-0024)
- Brand sempre via `useBrand()` ou `getRouteByHost()`
- Verticalização via `tenants.vertical` + `component.kind` polimórfico

## Versionamento (extensão obrigatória nossa)

### Schema dia 0 (Fase 4)

- `tenant_themes` (catálogo per-tenant: nome, source `preset|custom|ai-generated|imported-tweakcn`)
- `tenant_theme_versions` (snapshot JSONB imutável, version_number, published_at, locked boolean)
- `tenants.active_theme_version_id uuid` FK

### Workflow profissional

1. Cria/escolhe preset → `tenant_themes` row
2. Tweaks no builder → cada Save → nova row `tenant_theme_versions` (immutable)
3. Lista variantes → escolhe ativar uma → atualiza `active_theme_version_id`
4. Restore vN anterior JIT (snapshot imutável garante reproducibilidade)

### Por que importa

- TweakCN não tem (single user, single theme)
- Safety net pra revert visual sem perder tweaks
- Cache invalidation por version (CDN-friendly)
- Preview vs publish (active vs draft version)

## TweakCN clone — o que extrair vs adaptar vs skip

### EXTRACT (copy + atribuição Apache-2.0)

- `utils/shadows.ts` → `lib/design/build-theme-css.ts` (algoritmo `getShadowMap`) — ✅ Fase 1
- `utils/color-converter.ts` → `lib/design/color-format.ts` — ✅ Fase 1
- `config/theme.ts` defaults → `lib/design/theme-defaults.ts` — ✅ Fase 1
- `lib/ai/prompts.ts` → `lib/ai/theme-generation-prompt.ts` (adapta sections + APCA) — Fase 6
- `components/editor/{hsl-controls,color-picker,color-selector-popover,code-panel,shadow-control,font-picker}.tsx` — Fase 5
- `app/r/themes/[id]/route.ts` + `utils/registry/{v0,shadcn}.ts` — Fase 7
- `app/globals.css` absorções (color-scheme, view transition wave, `.mention`/`.code-inline`, scrollbar utilities) — ✅ Fase 1

### ADAPT (lógica + reescrita pro nosso cenário)

- `db/schema.ts` Drizzle → migrations Supabase RLS-aware — Fase 4
- `components/editor/contrast-checker.tsx` (WCAG → APCA Silver dual-gate)
- `components/editor/theme-control-panel.tsx` (Zustand → RHF + URL state + server action)
- `store/editor-store.ts` Zustand → `app/admin/theme-studio/_state/use-theme-form.ts` RHF
- `app/api/generate-theme/route.ts` (Gemini direto → Vercel AI Gateway)
- `app/editor/theme/*` (route layout → `/admin/theme-studio`)

### SKIP (não aplicável)

- `lib/auth.ts` better-auth (temos Supabase Auth)
- OAuth 2.0 server
- TipTap chat editor (DEFER nice-to-have)
- Community gallery `/themes/[id]` (single-user share, não cabe no multi-tenant)

## Vocabulário banido (ADR-0044 §13 + naming.md)

### Mortos

- `archetype` (como bundle estrutural — sobrevive só legacy `tenants.archetype_id text` até Fase 4)
- `--role-*` (todos os 67 invented)
- 5 slots tipografia (display/body/mono/accent/eyebrow)
- 28 semantic roles invented
- Layer 1.5 roles
- 7 estratégias canônicas (mechanic-swap/tinted-brand/frosted-opt-in/...)
- voice tokens per archetype
- `--shape-*` (ADR-0028 superseded)
- `--elevation-*` (ADR-0042 superseded)
- `--brand-hue`
- `--color-info/success/warning` (semantic invented)
- Native aliases archetype-specific (`--apple-label-tertiary`, `--mistral-sunset-1`)

### Oficial

- shadcn-canonical ~45 keys (TweakCN-vocab)
- Extras opt-in decididos após estudo prévio + ADR

## APCA Silver — dual-gate mantido

- body Lc ≥75
- large ≥60
- non-text ≥45
- Validação build-time em `scripts/validate-palettes.ts`
- ESLint regra `contrast/apca-silver` gate em `prebuild`

## Arquivos canônicos

### Pra próxima sessão saber onde olhar

- `docs/adr/0044-pivot-tweakcn-shadcn-canonical.md` — pivot autoritativa (supersedes 0043)
- `docs/plans/pivot-tweakcn.md` — plano executável Fase -1 → 8
- `docs/research/29-token-partition-universal-vs-tenant.md` — particionamento (S1.1)
- `docs/research/30-color-format-culori-integration.md` — OKLCH primary (S1.2)
- `docs/research/31-zod-schema-shadcn-canonical.md` — schema Zod (S1.3)
- `.claude/rules/design-tokens.md` — regra path-loaded ~45 keys
- `.claude/rules/naming.md` — vocab banido
- `lib/design/contract/theme.ts` — Zod flat `ThemeStylePropsSchema` (45 keys) + `ThemeSchema` (pós-refactor 2026-05-21)
- `lib/design/build-theme-css.ts` — emit CSS + shadow algorithm
- `lib/design/color-format.ts` — culori adapter
- `lib/design/theme-defaults.ts` — DEFAULT_THEME literal TweakCN
- `app/globals.css` — universal-only (321 LOC)
- `app/layout.tsx` — `<ThemeStyle />` async + Suspense

### Pra próxima sessão NÃO atrapalhar

- `C:\Users\leean\Desktop\tweakcn-ref\` — READ-ONLY, nunca commitar nada lá
- `NOTICE.md` — atribuição Apache-2.0 TweakCN + CC0 VoltAgent

## Princípios de continuidade pra próxima sessão

### Antes de qualquer code novo

1. Ler `CLAUDE.md` (auto-load) + este arquivo
2. Conferir status corrente em `docs/plans/pivot-tweakcn.md` (que fase está ativa)
3. Se fase tem `Sx.0 Audit` pendente — fazer audit ANTES de implementar
4. Conferir `MEMORY.md` (auto-load) — feedback do user persiste

### Não re-decidir o que já está decidido

- Pivot TweakCN-way → cravado ADR-0044
- ~45 keys interface pública → cravado
- Versionamento Hotmart-like → cravado princípio §9
- Audit-per-phase → cravado princípio §10
- Surgical delete → cravado princípio §7
- OKLCH-primary + HEX JIT → cravado

### Quando em dúvida

- ADR > Blueprint > Plano ativo > Memória > Session
- `docs/adr/0044-*.md` é autoritativa pós-pivot

## Referências cruzadas

- ADR-0024 — multi-marca via hostname
- ADR-0033 — schema único `public.*`
- ADR-0039 — entitlements RPCs
- ADR-0040 §H — APCA Silver
- ADR-0041 — engine catalog (pattern `*_versions` reusado em Fase 4 + Fase 7)
- ADR-0044 — pivot TweakCN-way (autoritativa)
- Blueprint 19 — wrapper strategy
- Blueprint 20 — i18n strategy
- Blueprint 21 — engine catalog
- `docs/_sessions/2026-05-21-auditoria-pivot-tweakcn.md` — auditoria que fundamentou pivot
- `docs/_sessions/2026-05-21-reversion-analysis.md` — Option C surgical delete

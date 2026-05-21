# 0043. Design system architecture consolidada

Date: 2026-05-20
Status: superseded by ADR-0044 (2026-05-21 — pivot TweakCN/shadcn-canonical)

## Context

Design system multi-tenant white-label PWA. 22 archetypes mapeados 1:1 a
`docs/references/design-systems/<slug>/DESIGN.md`. Sistema deve suportar
TODAS verticais futuras (fitness, yoga, idiomas, …) sem refactor
arquitetural — filosofia D-NN.

8 pesquisas Opus paralelas (`docs/design-system/research-A` … `research-H`)
consolidaram 19 domínios per archetype + 5 eixos canônicos (archetype ·
palette · typography · voice · mood). Pesquisa D substitui formalmente
ADR-0042 (3 elevations rígidas) — auditoria dos 22 archetypes mostrou
cobertura real 1/22; nova proposta é 22/22.

Decisões cravadas dispersas em `12-decisions-resolved.md` (8 decisões),
`ARCHITECTURE.md` (modelo completo) e 8 research-\*.md — este ADR é o
contrato consolidado.

## Decision

### 1. Token contract 3-layer

Layer 1 raw (`--surface-*`, `--ink-*`, `--accent-*`, `--radius-*`,
`--shadow-elevation-*`, `--space-*`) → Layer 1.5 roles (28 canônicos D-43)
→ `@theme inline` aliases shadcn (`--background`, `--foreground`, …).
Componentes em `components/**/*` consomem EXCLUSIVAMENTE `var(--role-*)`.

### 2. 22 archetypes — set fechado

linear, notion, stripe, nike, apple, wired, spacex, mistral, wise, figma,
theverge, claude, vodafone, opencode, mastercard, sanity, zapier,
starbucks, spotify, airbnb, meta, pinterest.

Adicionar archetype = pasta `lib/design/archetypes/<id>/` + PR (sem
migration). 18 desktop-first + 4 mobile-first; Apple/Starbucks têm
sub-seção `mobile` interna.

### 3. 35 paletas OKLCH

13 originais + 22 `brand-*` em `lib/design/seeds/palettes.seed.ts`. Tonal
derivation via culori quando archetype declara
`supports_tonal_derivation`. Sem compatibility matrix dura — APCA Silver
(body Lc ≥75, large ≥60, non-text ≥45) + WCAG 2.1 AA dual-gate é o único
bloqueio.

### 4. Typography 5 slots (substitui `font: string` único)

`display`, `body` (obrigatório), `mono`, `accent`, `eyebrow`. Catálogo G1
expandido para 13 fontes Google Fonts (6 novas: `newsreader`,
`bebas-neue`, `anton`, `oswald`, `jetbrains-mono`, `kalam`). Material 3
2-slot esqueleto + Carbon mono explícito + Apple optical-sizing
(Newsreader único com `opsz` no G1) + Starbucks accent (`kalam` Careers).
Tokens CSS: `--font-display | --font-body | --font-mono | --font-accent
| --font-eyebrow` em `@theme` global; per-archetype injetam
`--font-archetype-*` em `:root[data-archetype="<id>"]`.

### 5. Spacing semantic + scale Carbon 8px-base

Scale numérica (`--spacing-0..32`) GLOBAL em `@theme` (gera `p-0..p-32`,
`gap-*`, etc — Tailwind v4 auto). Spacing semantic (`--spacing-card`,
`--spacing-section`, `--spacing-hero`, `--spacing-stack-{tight,
comfortable, loose}`, `--spacing-grid-gutter`) per archetype via
`@theme` (não `@theme inline` — pegadinha Tailwind GH#17826: `inline`
mata o `var()`). Componentes `components/ds/*` e `components/app-*` usam
SÓ semantic (`p-card`, `py-section`, `gap-stack-tight`). Scale numérica
permitida em `app/<route>/**` page-level.

### 6. Shadow Vercel 5-level + 7 estratégias canônicas

`--shadow-elevation-1..5` default global (OKLCH alpha neutral). Per
archetype declara UMA das 7 estratégias: `inherit-default` (5),
`mechanic-swap` (10), `whisper-single` (3), `tinted-brand` (2 — Stripe
navy, Mistral cool, Claude warm), `product-single` (1 — Apple),
`dual-stacked` (1 — Starbucks), `frosted-opt-in` (3 — Apple full,
Mistral partial, Spotify mobile-nav). OKLCH alpha obrigatório
(`oklch(L C H / α)`).

**Supersede ADR-0042** (3 elevations rígidas: `--elevation-flat`,
`--elevation-raised`, `--elevation-overlay` cobriam só 1/22 archetypes).
Aliases mantidos como deprecated pra back-compat — ESLint warn JIT.

### 7. 5 estratégias de mapping per archetype

`literal` | `polarity-flip` | `oklch-derive` | `reuse` | `mechanic-swap`.
Archetype declara estratégia (não valor concreto) — funciona pra
qualquer paleta presente ou futura (vibe coding Fase 2+).

### 8. `tenants.archetype_id text` (não uuid FK)

Decisão A1. Archetype é configuração em código, não entidade de domínio.
Adicionar archetype = pasta + PR (zero migration). `palette_id` continua
`uuid FK` (template→instance ADR-0028/0029).

### 9. CSS inline server-side (não endpoint separado)

`generateThemeCSS(tenant)` em RSC + `'use cache'` +
`cacheTag('combo:archetype:palette:typo:mode')`. Zero FOUC, ~500 combos
práticos cacheable, ~5KB gzipped per combo. ~99% cache hit rate
projetado.

### 10. Voice tokens per archetype (Eixo 4)

`ArchetypeVoiceSchema`: `persona / formality / warmth / technicality /
capitalization / oxfordComma / ctaPunctuation / emojiPolicy` + tone
matrix + patterns + AI prompt seed. Vive em
`lib/design/archetypes/<id>/voice.ts` + overlay i18n
`messages/<locale>/voice/<archetype>.json`. Mailchimp voice/tone +
Polaris + Atlassian + Material 3 + Apple HIG + NN/G error guidelines.

### 11. Photography tokens C1 split core/extended

`aspectDefault` + `aspectCard` obrigatórios. `radius / treatment /
overlay / filter / shadow / aspectMobile / focal point` opcionais.
`<AppImage>` wrapper sobre `next/image` + shadcn `AspectRatio`. APCA
gate em overlay+text quando `overlayOpacity > 0`. AVIF habilitado em
`next.config.ts`. Plaiceholder JIT pra dynamic src (Fase 1).

### 12. Iconography Lucide default + 3 conventions

Lucide React (já instalado, 1500+ icons, MIT) library principal.
`<Icon>` wrapper agnóstico aceita qualquer `LucideIcon | TablerIcon |
PhosphorIcon`. 3 active-state conventions:

- **fill-on-active** (iOS canon — Apple, Starbucks, Spotify, Airbnb,
  Meta, Pinterest)
- **color-on-active** (web/dev tools — Linear, Notion, Stripe, Figma,
  Sanity, Zapier)
- **underline-on-active** (editorial — Wired, Theverge, Claude)

JIT promove Tabler (filled variant nativo, brand logos) ou Phosphor
(6 weights — hand-drawn duotone Claude/Verge). `<Illustration>`
wrapper resolve `public/illustrations/<archetype>/<name>.svg` com
`currentColor`.

### 13. Mobile components scope

`SafeAreaWrapper` + `NavigationBottom` + `AppBottomSheet` (Vaul base) +
`AppFAB` + `AppStickyCTA` + `AppNavTop` + `PersistentMiniPlayer`
(Spotify JIT). Vaul detents iOS canon `[0.25, 0.5, 0.9]`. Z-index global
system (`--z-content..--z-tooltip`). Touch 44px universal (iOS HIG; WCAG
2.5.5 AAA). `dvh` obrigatório (não `vh`). `env(safe-area-inset-*)`
embutido nos primitives fixed.

### 14. PWA constraints (não tenant-overridable)

Manifest `scope` congelado pós-install iOS. `theme-color` RSC-derived
per brand. `dvh` obrigatório (`vh` cliva sob iOS URL bar).
`env(safe-area-inset-*)` cobre notch/Dynamic Island/home indicator.
`viewport-fit=cover` no `<meta>` é gatilho do safe-area.

## Consequences

### Positivas

- Sistema escalável de 22 → 71+ archetypes sem refactor arquitetural
- Componentes 100% agnósticos a archetype (consomem só `--role-*`)
- Vibe coding Fase 2 funciona automático (5 estratégias declarativas
  cobrem paleta presente ou futura)
- APCA Silver + WCAG 2.1 AA dual-gate enforça acessibilidade real
  (ESLint + prebuild script)
- Storybook decorator valida nos 22 archetypes em runtime
- Mechanic-swap formalizado (10/22 archetypes não precisam contornar
  token system)
- Tinted shadows tokenizadas (Stripe, Mistral, Claude)
- Frosted glass opt-in (Apple Liquid Glass, Mistral, Spotify)
- shadcn primitives pristine (53 em `components/ui/*` zero edit) —
  herdam via `@theme inline` aliases

### Negativas (aceitas)

- Complexidade conceitual alta (19 domínios per archetype)
- 8 wrappers Sprint 1 + ~20 lazy archetype-specific (mas todos JIT)
- Migration de `--elevation-*` legacy → `--shadow-elevation-*` via
  ESLint warn (gradual, sem hard-break)
- Voice JSON overlay aumenta superfície i18n (opt-in per archetype)
- OKLCH alpha em shadows ~93% browser support em 2026 (fallback
  `@supports not (color: oklch(...))` se métrica real cair <99%)
- 5-level stacked em mobile com 30+ cards pode pesar paint budget —
  mitigação documentada (`will-change: opacity` + pseudoelemento)

### Migration

- ADR-0042 → ADR-0043 (este) — aliases `--elevation-flat | -raised |
-overlay` mantidos como deprecated. ESLint rule
  `design-tokens/no-elevation-legacy` em `warn`. Promover pra `error`
  quando counter de uso for 0.
- Voice messages JSON: opt-in per archetype (não quebra `messages/`
  atual).
- Typography `font: string` → `fonts: { display, body, … }` — back-compat
  shim em Zod schema durante migração 22 archetypes
  (`TypographyCompatSchemaCompat` union legacy + nova, remove pós-Passo
  1.5).
- ESLint warn JIT pra raw tokens em `components/**/*` (sem error
  inicial — gradual).

## Implementation

Ver:

- `docs/design-system/ARCHITECTURE.md` (master)
- `docs/design-system/CONVENTIONS.md` (§20 voice + §21 illustration)
- `docs/design-system/research-A-typography-multicontext.md`
- `docs/design-system/research-B-shadcn-audit.md`
- `docs/design-system/research-C-spacing-semantic.md`
- `docs/design-system/research-D-shadow-elevation.md`
- `docs/design-system/research-E-photography.md`
- `docs/design-system/research-F-mobile-components.md`
- `docs/design-system/research-G-voice-content.md`
- `docs/design-system/research-H-iconography-illustration.md`

## Referências

- `docs/design-system/ARCHITECTURE.md` (modelo + fluxo end-to-end)
- `docs/design-system/CONVENTIONS.md`
- `docs/design-system/12-decisions-resolved.md` (8 decisões cravadas)
- ADR-0024 (multi-marca via hostname)
- ADR-0028 / ADR-0029 (paletas template→instance)
- ADR-0033 (schema único `public.*`)
- ADR-0040 (shadcn zone + i18n + APCA Silver + wrappers JIT)
- ADR-0041 (engine catalog 2 motores)
- ADR-0042 (3 elevations rígidas — **SUPERSEDED por este**)
- Vercel Geist Material — https://vercel.com/geist/material
- Material Design 3 — https://m3.material.io/
- Shopify Polaris — https://polaris-react.shopify.com/
- IBM Carbon — https://carbondesignsystem.com/
- Apple HIG — https://developer.apple.com/design/human-interface-guidelines/
- Tailwind v4 — https://tailwindcss.com/docs/theme

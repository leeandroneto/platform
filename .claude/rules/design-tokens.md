---
name: Design tokens — shadcn-canonical 41 TweakCN-vocab (ADR-0044)
description: Adaptamos AO shadcn, não criamos vocabulário paralelo. 32 cores + 3 fontes + 1 radius + 6 shadow primitives + shadow-color + letter-spacing + spacing-opt. Universal vs per-tenant distinguir SEMPRE.
paths:
  - 'app/**/*.{ts,tsx,css}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'lib/design/**/*.{ts,css}'
---

## Princípio

**shadcn-canonical ~45 keys (TweakCN-vocab) é a interface pública obrigatória**
(ADR-0044). Adaptamos AO shadcn — não criamos vocabulário paralelo. Extras
opt-in só após estudo prévio + ADR.

Per-tenant tokens vêm via `<style precedence="theme">` runtime hoisted React
19 (gerado por `lib/design/build-theme-css.ts` consultando `tenant_themes` no
DB). Universal tokens vivem em `app/globals.css` fora do tema.

shadcn primitives (`components/ui/*`) herdam automático — ZERO componente
editado individualmente.

---

## As ~45 keys canonical (TweakCN-vocab — validado contra `tweakcn-ref/types/theme.ts`)

### Cores per-tenant (28) — light + dark separados

| Token (+ `*-foreground` pair quando aplicável)                                                | Onde usar                                      | APCA              |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------- |
| `--background` / `--foreground`                                                               | body página + text padrão                      | Lc ≥75 (body)     |
| `--card` / `--card-foreground`                                                                | bg cards, sections                             | Lc ≥75            |
| `--popover` / `--popover-foreground`                                                          | bg dropdowns, popovers, tooltips               | Lc ≥75            |
| `--primary` / `--primary-foreground`                                                          | bg action (`<Button>`, ring focus, badge fill) | Lc ≥75 fg vs bg   |
| `--secondary` / `--secondary-foreground`                                                      | bg action secundária, badge secundário         | Lc ≥75            |
| `--muted` / `--muted-foreground`                                                              | bg skeleton/disabled, text secundário          | Lc ≥60 large      |
| `--accent` / `--accent-foreground`                                                            | bg hover/highlight, accent surfaces            | Lc ≥75            |
| `--destructive` / `--destructive-foreground`                                                  | bg destructive action, error                   | Lc ≥75            |
| `--border`                                                                                    | borders 1px de cards/inputs/separators         | Lc ≥45 (non-text) |
| `--input`                                                                                     | border de `<input>`, `<textarea>`, `<select>`  | Lc ≥45            |
| `--ring`                                                                                      | focus ring                                     | Lc ≥45            |
| `--chart-1` ... `--chart-5`                                                                   | séries em `<Chart>` (Recharts)                 | Lc ≥45 vs surface |
| `--sidebar` / `--sidebar-foreground` / `--sidebar-primary` / `--sidebar-primary-foreground` / | sidebar shadcn block                           | Lc ≥75 fg         |
| `--sidebar-accent` / `--sidebar-accent-foreground` / `--sidebar-border` / `--sidebar-ring`    | sidebar shadcn block                           | Lc ≥45 non-text   |

### Fontes per-tenant (3)

| Token          | Uso                                    |
| -------------- | -------------------------------------- |
| `--font-sans`  | body default (parágrafos, labels)      |
| `--font-serif` | headings hero opcional (per-tenant)    |
| `--font-mono`  | code blocks, dados tabulares numéricos |

**Sem 5 slots (display/body/mono/accent/eyebrow) — banido ADR-0044.**

### Radius per-tenant (1) — Tailwind v4 deriva o resto

| Token      | Uso                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `--radius` | Base radius. Tailwind v4 deriva `--radius-sm/md/lg/xl/2xl/3xl/4xl` algoritmicamente via `@theme` |

### Shadow primitives per-tenant (6) — 8 níveis derivados

`--shadow-color` · `--shadow-opacity` · `--shadow-blur` · `--shadow-spread` ·
`--shadow-offset-x` · `--shadow-offset-y`

Algoritmo `getShadowMap()` (replicado de `tweakcn-ref/utils/shadows.ts`) deriva
8 níveis: `--shadow-2xs` · `--shadow-xs` · `--shadow-sm` · `--shadow-md` ·
`--shadow-lg` · `--shadow-xl` · `--shadow-2xl` · `--shadow` (base alias).

### Spacing + letter-spacing per-tenant (2)

| Token              | Uso                                                             |
| ------------------ | --------------------------------------------------------------- |
| `--spacing`        | Tailwind v4 base spacing (per-tenant override; default 0.25rem) |
| `--letter-spacing` | Global per-tenant tightening/loosening                          |

---

## Universal (vivem em `app/globals.css`)

Não dependem de tenant — iOS HIG / Material 3 / WCAG padrões.

| Categoria             | Tokens                                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile primitives** | `--touch-min` (44px), `--touch-comfortable` (48px), `--inset-safe-{top,bottom,left,right}` (env safe-area), `--mobile-full-height` (100dvh), `--mobile-nav-height` (56px), `--fab-size` (56px), `--press-scale` (0.97) |
| **Frosted glass**     | `--frosted-blur`, `--frosted-saturate`, `--frosted-opacity`                                                                                                                                                            |
| **Z-index**           | `--z-content`, `--z-sticky`, `--z-fixed`, `--z-overlay`, `--z-modal`, `--z-popover`, `--z-tooltip`                                                                                                                     |
| **Motion**            | `--duration-{instant,fast,normal,slow}`, `--ease-out`, easings canonical (Material 3 / Polaris)                                                                                                                        |
| **Spacing scale**     | `--spacing-0` ... `--spacing-32` (Carbon 8-base — numérica, ortogonal ao `--spacing` per-tenant)                                                                                                                       |
| **Breakpoint**        | `--breakpoint-mobile` (768px canonical)                                                                                                                                                                                |
| **APCA thresholds**   | body 75 · large 60 · non-text 45                                                                                                                                                                                       |

**Spacing dual-scale:** `--spacing` (per-tenant, Tailwind v4 base) e
`--spacing-0..32` (universal Carbon) coexistem sem conflito.

---

## Color format — OKLCH-primary

- DB armazena OKLCH string literal: `"oklch(0.55 0.2 270)"`.
- `buildThemeCSS()` emite OKLCH literal.
- APCA opera em OKLCH nativo via `apca-w3` + `culori` (`lib/design/contrast.ts`).
- HEX só fallback JIT: PWA manifest `theme-color`, email HTML, OG image SVG.
  Converter via `oklchToHex()` quando necessário.

---

## Como funciona o theming runtime

1. `proxy.ts` resolve `host → brand+tenant` (ADR-0024).
2. `getRouteByHost()` carrega `tenant_themes.active_theme_version_id →
tenant_theme_versions.snapshot` (Zod `Theme`).
3. `app/layout.tsx` chama `buildThemeCSS(snapshot)` dentro de `<Suspense>` e
   emite `<style precedence="theme">` (React 19 hoist pro `<head>`).
4. Cache via `cacheTag('theme:<tenantId>:<version>')`.
5. shadcn primitives consomem `--background` / `--card` / etc. diretamente.

**Conclusão:** não passar cor via prop. Theming já funciona automático.

---

## Anti-patterns (ESLint enforce — ADR-0044 §12 + naming.md)

| Anti-pattern                                               | Por que                                                | Substituto                              |
| ---------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------- | ----- | ------ |
| `var(--role-*)` em código                                  | Vocab banido ADR-0044 (67 roles invented mortos)       | `var(--<canonical>)` ou Tailwind alias  |
| `--shape-*` (ADR-0028 superseded)                          | Deprecado ADR-0044 §5                                  | `var(--radius)` + Tailwind `rounded-*`  |
| `--elevation-flat/raised/overlay` (ADR-0042 superseded)    | Deprecado ADR-0044 §3                                  | 8 níveis shadow algorítmicos derivados  |
| `--font-display/--font-accent/--font-eyebrow` (5 slots)    | Banido ADR-0044                                        | `--font-sans/--font-serif/--font-mono`  |
| Native aliases archetype-specific (`--apple-label-*`, etc) | Banido ADR-0044 (archetype morto)                      | Token canonical + extension JIT via ADR |
| Voice tokens per archetype                                 | Banido ADR-0044                                        | —                                       |
| `text-xl`, `rounded-2xl` literal em código                 | `design-tokens/no-tailwind-bypass`                     | `<Heading level={3}>` / `var(--radius)` |
| `[#hex]` arbitrary Tailwind                                | Idem                                                   | `var(--<canonical>)` token              |
| `#hex` / `rgba(...)` literal em .ts/.tsx                   | Hook `block-token-bypass.sh`                           | CSS var                                 |
| `style={{ color: 'var(--primary)' }}` em JSX               | Regra 17 (blueprint 13)                                | className shadcn (`text-primary`)       |
| `font-family:` literal / `font-[Inter]` arbitrary          | ESLint `no-raw-fontfamily`                             | `var(--font-sans                        | serif | mono)` |
| `100vh` em mobile-aware                                    | ESLint `no-vh-in-mobile-aware`                         | `100dvh` / `var(--mobile-full-height)`  |
| Inventar `--color-info/--color-success/--color-warning`    | ADR-0044 §6 — só 28 canonical (inclui `--destructive`) | `--destructive` ou chart-N opt-in       |

---

## Exceções aceitas (allowlist)

- `app/globals.css @theme` — declaração tokens universais
- `lib/design/build-theme-css.ts` — emit tokens per-tenant em OKLCH literal
- `next/og` ImageResponse — `#hex` em SVG inline (build-time fallback)
- `blurhash` — hex hash de placeholder
- `lib/design/contrast.ts` — `oklchToHex()` fallback HEX JIT

---

## Quando criar extension opt-in

**Não criamos tokens novos.** As ~45 keys canonical são fixas (shadcn-canonical
TweakCN-vocab). Extension opt-in é coisa diferente: tokens fora do canonical
que cobrem necessidade que TweakCN não modela (ex: `--touch-min` iOS HIG,
`--frosted-blur` Apple-style — todos universais já em `globals.css`).

Gatilho: necessidade real fora dos 41, repetida em 3+ tenants OU fundamento
em padrão proven (iOS HIG, Material 3, WCAG).

Passo:

1. Documentar em ADR (study-first ADR-0044 princípio §1)
2. Decidir escopo: **universal** (`globals.css`, mesma pra todos tenants) ou
   **per-tenant extension** (`tenant_theme_versions.snapshot.extensions` JSONB)
3. Validar APCA Silver vs surfaces relevantes (se for cor/border/ring)
4. Adicionar fallback chain quando relevante: `var(--token-name, fallback-value)` (decisão F.4 research-37 — opt-in vira universal com fallback até regra-de-3 cumprir)
5. Atualizar este doc + naming.md (lista vocab banido — confirmar não-conflito)

---

## Condição de revisitar

| Gatilho                                             | Ação                                                                                                                                                                                                                                |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn upstream adiciona token canonical novo**   | Adicionar à tabela 28-cores acima + atualizar Zod `ThemeColorsSchema` em `lib/design/contract/theme.ts`                                                                                                                             |
| **Tenant pede cor custom fora do preset**           | Builder UI (`/admin/theme-studio`) gera novo `tenant_theme_versions` snapshot via flow validado APCA dual-gate                                                                                                                      |
| **APCA quebra em preset tenant**                    | `ensureAccessible()` ajusta automático OU bloqueia salvamento                                                                                                                                                                       |
| **Extra opt-in repetido em 3+ tenants**             | Promover pra universal em `app/globals.css` + ADR documenta migração. Quando regra-de-3 cumprir e tokens passarem a divergir POR tenant, abrir ADR-0046 + adicionar `ThemeSchema.common.extensions` JSONB (decisão F.4 research-37) |
| **TweakCN upstream adiciona primitive shadow novo** | Re-validar `lib/design/build-theme-css.ts` algoritmo `getShadowMap()` contra `tweakcn-ref/utils/shadows.ts`                                                                                                                         |

---

## Referências

- **ADR-0044** — pivot TweakCN-way (autoritativa)
- ADR-0033 — schema único `public.*`
- ADR-0040 §H — APCA Silver thresholds
- `docs/plans/pivot-tweakcn.md` — plano executável Fase -1..8
- `docs/research/29-token-partition-universal-vs-tenant.md` (S1.1)
- `docs/research/30-color-format-culori-integration.md` (S1.2)
- `docs/research/31-zod-schema-shadcn-canonical.md` (S1.3)
- `C:\Users\leean\Desktop\tweakcn-ref\` — clone read-only (Apache-2.0)
- `app/globals.css` — universal tokens
- `lib/design/build-theme-css.ts` — emit per-tenant CSS
- `.claude/rules/contrast.md` — APCA Silver
- `.claude/rules/naming.md` — vocab banido

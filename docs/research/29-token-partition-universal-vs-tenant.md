# 29 — Particionamento 41 tokens shadcn-canonical: universal vs per-tenant

> **✅ VALIDADO 2026-05-21** contra clone local `C:\Users\leean\Desktop\tweakcn-ref\`
> (commit `9adabcf9`, branch `main`, Apache-2.0). Evidências citam arquivo + linhas
> reais do clone, não mais WebFetch.
>
> **Tipo:** estudo prévio S1.1 do plano de pivot. Bloqueante pra Fase 1 (Foundation reset).
> **Status confiança:** **alta (validada)** — 44 keys do `themeStylePropsSchema`
> confirmadas em `tweakcn-ref/types/theme.ts:5-68`. Partição proposta extrapola de
> TweakCN single-tenant pra nosso multi-tenant — refinamento próprio (TweakCN não
> faz partition, vive tudo per-tenant em DB JSONB).
> **Última atualização:** 2026-05-21 (validação contra clone).

---

## 0. Achados-chave da validação contra clone

| Hipótese pré-validação              | Realidade no clone                                                                                                                                                                                                                                                                  | Status                                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 41 tokens                           | **45 keys** no `themeStylePropsSchema` (`types/theme.ts:5-68`) — 32 colors + 3 fonts + radius + 6 shadow primitives + letter-spacing + spacing (opt)                                                                                                                                | Ajustar (já tinha caveat em §2.7)                                                                   |
| `COMMON_STYLES` shared light↔dark   | `config/theme.ts:5-17` lista **11 keys**: `font-sans`, `font-serif`, `font-mono`, `radius`, `shadow-opacity`, `shadow-blur`, `shadow-spread`, `shadow-offset-x`, `shadow-offset-y`, `letter-spacing`, `spacing`                                                                     | Confirmado — **`shadow-color` NÃO está em COMMON_STYLES** (declarado por-modo)                      |
| Spacing per-tenant em TweakCN       | `defaultLightThemeStyles.spacing = "0.25rem"` (`config/theme.ts:74`) + `defaultDarkThemeStyles.spacing = "0.25rem"` (linha 119) — both modes declare it (mas COMMON_STYLES já cobre)                                                                                                | Confirmado — **mas nossa decisão UNIVERSAL diverge intencionalmente** (Tailwind v4 base ≠ branding) |
| TweakCN tem mobile/z-index/motion?  | `tweakcn-ref/app/globals.css` (172 LOC) tem **só** `@theme inline` color mapping + 4 radius derivatives `calc()` + 8 shadow aliases + 6 tracking calc + view-transition + scrollbar utilities. **Zero** mobile primitives, z-index, motion durations, touch-min, safe-area, frosted | Confirmado — TweakCN single-tenant não tem partition universal/per-tenant; tudo theme JSONB         |
| TweakCN faz partition multi-tenant? | DB schema (`tweakcn-ref/db/schema.ts:63-72`): `theme.styles json $type<ThemeStyles>` single field — sem split. RLS irrelevante (single-user)                                                                                                                                        | **Não.** Partition é refinamento nosso multi-tenant — sem precedente upstream                       |

**Conclusão:** TweakCN single-user grava as 45 keys flat em 1 JSONB; não distingue universal vs per-tenant porque não precisa. Nossa partição é decisão de arquitetura própria pra multi-tenant — mobile chrome, motion, z-index, focus, frosted glass e icon sizes não pertencem a branding e portanto vivem em `globals.css` universal. **Nossa hipótese de partition se mantém — apenas o framing precisa reconhecer que estamos extrapolando, não replicando.**

---

## 1. Resumo executivo

Dos **41 tokens TweakCN-canonical**, **38 vão pra `<style precedence="theme">`** (per-tenant runtime, injetado por `buildThemeCSS()`) e **3 vão pra `globals.css`** universal — `--spacing` (Carbon 8-base, escala numérica), `--letter-spacing` (default 0, raramente personalizado), e o **default `--radius`** (fallback). Os 6 shadow primitives + 28 cores + 3 fontes + radius literal saem 100% no theme runtime, espelhando TweakCN (que coloca TUDO per-tenant). **Tokens nossos extras** (mobile primitives, z-index, motion, frosted glass, APCA thresholds, icon sizes, aspect ratios, spacing scale Carbon) ficam **universais** — não fazem parte do TweakCN-canonical, mas são proven em todos os sistemas mobile mainstream (Apple HIG, Material 3, Polaris). Hipótese do plano "ALL 41 tokens canonical são per-tenant" está **quase certa, com 1 caveat:** `--spacing` é per-tenant em TweakCN mas pra nós faz mais sentido universal (tenant não muda base 8px; muda só radius/cores/fontes).

---

## 2. Os 41 tokens TweakCN-canonical

Fonte autoritativa: [`types/theme.ts`](https://github.com/jnsahaj/tweakcn/blob/main/types/theme.ts) + [`config/theme.ts`](https://github.com/jnsahaj/tweakcn/blob/main/config/theme.ts). `COMMON_STYLES` separa o que é shared light↔dark do que é duplicado.

### 2.1 Cores (28 tokens — TODAS duplicadas em `{light, dark}`)

| #   | Token                          | Exemplo OKLCH default light | Comentário                      |
| --- | ------------------------------ | --------------------------- | ------------------------------- |
| 1   | `--background`                 | `oklch(1 0 0)`              | Page canvas                     |
| 2   | `--foreground`                 | `oklch(0.145 0 0)`          | Body text                       |
| 3   | `--card`                       | `oklch(1 0 0)`              | Surface card                    |
| 4   | `--card-foreground`            | `oklch(0.145 0 0)`          | Text on card                    |
| 5   | `--popover`                    | `oklch(1 0 0)`              | Popover/dropdown surface        |
| 6   | `--popover-foreground`         | `oklch(0.145 0 0)`          | Text on popover                 |
| 7   | `--primary`                    | `oklch(0.205 0 0)`          | Brand action                    |
| 8   | `--primary-foreground`         | `oklch(0.985 0 0)`          | Text on primary                 |
| 9   | `--secondary`                  | `oklch(0.97 0 0)`           | Secondary surface               |
| 10  | `--secondary-foreground`       | `oklch(0.205 0 0)`          | Text on secondary               |
| 11  | `--muted`                      | `oklch(0.97 0 0)`           | Skeleton / disabled bg          |
| 12  | `--muted-foreground`           | `oklch(0.556 0 0)`          | Caption / helper text           |
| 13  | `--accent`                     | `oklch(0.97 0 0)`           | Hover / focus subtle            |
| 14  | `--accent-foreground`          | `oklch(0.205 0 0)`          | Text on accent                  |
| 15  | `--destructive`                | `oklch(0.577 0.245 27.325)` | Erro / delete                   |
| 16  | `--destructive-foreground`     | `oklch(0.985 0 0)`          | Text on destructive             |
| 17  | `--border`                     | `oklch(0.922 0 0)`          | 1px hairlines                   |
| 18  | `--input`                      | `oklch(0.922 0 0)`          | Input bg / border               |
| 19  | `--ring`                       | `oklch(0.708 0 0)`          | Focus ring                      |
| 20  | `--chart-1`                    | `oklch(0.646 0.222 41.116)` | Chart series 1                  |
| 21  | `--chart-2`                    | `oklch(0.6 0.118 184.704)`  | Chart series 2                  |
| 22  | `--chart-3`                    | `oklch(0.398 0.07 227.392)` | Chart series 3                  |
| 23  | `--chart-4`                    | `oklch(0.828 0.189 84.429)` | Chart series 4                  |
| 24  | `--chart-5`                    | `oklch(0.769 0.188 70.08)`  | Chart series 5                  |
| 25  | `--sidebar`                    | `oklch(0.985 0 0)`          | Sidebar bg                      |
| 26  | `--sidebar-foreground`         | `oklch(0.145 0 0)`          | Sidebar text                    |
| 27  | `--sidebar-primary`            | `oklch(0.205 0 0)`          | Sidebar item active             |
| 28  | `--sidebar-primary-foreground` | `oklch(0.985 0 0)`          | Text on sidebar-primary         |
| (—) | `--sidebar-accent`             | `oklch(0.97 0 0)`           | Sidebar hover (não no 28 pares) |
| (—) | `--sidebar-accent-foreground`  | `oklch(0.205 0 0)`          | Text on sidebar-accent          |
| (—) | `--sidebar-border`             | `oklch(0.922 0 0)`          | Sidebar 1px                     |
| (—) | `--sidebar-ring`               | `oklch(0.708 0 0)`          | Sidebar focus                   |

> Nota: o "28" canonical TweakCN é técnica de contagem do projeto deles que junta sidebar-_ extras como parte do bloco; nossa contagem mantém 28 cores principais + 4 sidebar-_ extras = 32 efetivamente. A pesquisa-28 §3 conta como "28 tokens, todos pareados base/foreground exceto border/input/ring/chart-N" + sidebar block separado.

### 2.2 Fontes (3 tokens — em `COMMON_STYLES`, shared light↔dark)

| #   | Token          | Exemplo                   | Comentário              |
| --- | -------------- | ------------------------- | ----------------------- |
| 29  | `--font-sans`  | `"Geist, sans-serif"`     | Body + default headings |
| 30  | `--font-serif` | `"Lora, serif"`           | Display opcional        |
| 31  | `--font-mono`  | `"Geist Mono, monospace"` | Code + tabular          |

### 2.3 Radius (1 token — em `COMMON_STYLES`)

| #   | Token      | Exemplo    | Comentário                                            |
| --- | ---------- | ---------- | ----------------------------------------------------- |
| 32  | `--radius` | `0.625rem` | Shadcn template deriva sm/md/lg em CSS (não modelado) |

### 2.4 Shadow primitives (6 tokens — em `COMMON_STYLES`)

Geram 8 níveis algorítmicos (`shadow-2xs..2xl`) via [`utils/shadows.ts`](https://github.com/jnsahaj/tweakcn/blob/main/utils/shadows.ts) `secondLayer()`.

| #   | Token               | Exemplo        | Comentário           |
| --- | ------------------- | -------------- | -------------------- |
| 33  | `--shadow-color`    | `oklch(0 0 0)` | Tinta base do shadow |
| 34  | `--shadow-opacity`  | `0.1`          | Alpha multiplier     |
| 35  | `--shadow-blur`     | `3px`          | Blur radius          |
| 36  | `--shadow-spread`   | `0px`          | Spread radius        |
| 37  | `--shadow-offset-x` | `0px`          | X offset             |
| 38  | `--shadow-offset-y` | `1px`          | Y offset             |

### 2.5 Spacing global (1 token — em `COMMON_STYLES`, opcional)

| #   | Token       | Exemplo   | Comentário                                        |
| --- | ----------- | --------- | ------------------------------------------------- |
| 39  | `--spacing` | `0.25rem` | Tailwind v4 base spacing (algumas presets omitem) |

### 2.6 Letter-spacing global (1 token — em `COMMON_STYLES`)

| #   | Token              | Exemplo | Comentário                                |
| --- | ------------------ | ------- | ----------------------------------------- |
| 40  | `--letter-spacing` | `0em`   | Tracking global (TweakCN tem 1 só global) |

### 2.7 Token "fantasma" — descobrimos só 40 contando explicitamente

A pesquisa-28 §3 fala "41 propriedades flat". Re-counting: 28 cores + 4 sidebar extras (sidebar-accent/-fg/-border/-ring) + 3 fontes + 1 radius + 6 shadow primitives + 1 spacing + 1 letter-spacing = **44**. O "41" do TweakCN parece contar tokens distintos no schema Zod base (não duplicados light/dark), com sidebar parcial. **Pra fins desta partição, tratamos os 44 — adicionando os 4 sidebar-\* nos 28 cores em vez de separar.** A diferença é cosmética; partição não muda.

---

## 3. Candidatos a extras (nossos atuais que sobrevivem)

Auditoria de `app/globals.css` (584 LOC, 67 roles + ~30 outros tokens). Avaliação quanto a se sobrevivem ao pivot e em que bucket:

| Token atual                                                                              | Valor exemplo                       | Propósito                                  | Bucket proposto                                                                                                    |
| ---------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `--spacing-0..32` (Carbon 8-base, 14 níveis)                                             | `--spacing-4: 16px`                 | Escala numérica utilities Tailwind         | **UNIVERSAL**                                                                                                      |
| `--spacing-card/-section/-hero/-stack-*/-grid-gutter`                                    | `var(--spacing-6)`                  | Spacing semantic (não Carbon raw)          | **UNIVERSAL** (default; tenant rarely overrides)                                                                   |
| `--breakpoint-mobile: 768px`                                                             | `768px`                             | Single source matchMedia + AdaptiveShell   | **UNIVERSAL**                                                                                                      |
| `--touch-min/-comfortable: 44/48px`                                                      | `44px`                              | iOS HIG + Material 3                       | **UNIVERSAL**                                                                                                      |
| `--mobile-full-height: 100dvh`                                                           | `100dvh`                            | Mobile viewport                            | **UNIVERSAL**                                                                                                      |
| `--mobile-half-height/-three-quarter-height`                                             | `50dvh/75dvh`                       | Bottom sheet snap points                   | **UNIVERSAL**                                                                                                      |
| `--mobile-screen-height: 100svh`                                                         | `100svh`                            | Mobile viewport small (no chrome)          | **UNIVERSAL**                                                                                                      |
| `--mobile-large-height: 100lvh`                                                          | `100lvh`                            | Mobile viewport large                      | **UNIVERSAL**                                                                                                      |
| `--mobile-nav-height/-nav-bottom-height: 56px`                                           | `56px`                              | Mobile shell chrome                        | **UNIVERSAL**                                                                                                      |
| `--fab-size: 56px`                                                                       | `56px`                              | Material 3 FAB canonical                   | **UNIVERSAL**                                                                                                      |
| `--sticky-cta-height: 64px`                                                              | `64px`                              | Mobile sticky CTA                          | **UNIVERSAL**                                                                                                      |
| `--mini-player-height: 56px`                                                             | `56px`                              | Spotify-like persistent player             | **UNIVERSAL**                                                                                                      |
| `--inset-safe-{top/bottom/left/right}`                                                   | `env(safe-area-inset-*)`            | iOS notch / Dynamic Island                 | **UNIVERSAL**                                                                                                      |
| `--z-{content/sticky/fab/mini-player/nav-bottom/overlay/modal/toast/tooltip}` (9 níveis) | `0..70`                             | Stack ordering                             | **UNIVERSAL**                                                                                                      |
| `--duration-{0/50/100/150/200/250/300/400/500/700/1000/5000}` (12)                       | `200ms`                             | Polaris 12 durations canonical             | **UNIVERSAL**                                                                                                      |
| `--ease-{standard/decelerate/accelerate/emphasis/spring-gentle}` (5)                     | `cubic-bezier(...)`                 | Material 3 + Apple easings                 | **UNIVERSAL**                                                                                                      |
| `--focus-width/-offset: 2px/2px`                                                         | `2px`                               | WCAG 2.4.13                                | **UNIVERSAL**                                                                                                      |
| `--frosted-blur/-saturate/-opacity{-strong/-light}`                                      | `20px / 180% / 0.7-0.9`             | iOS glass / Vision Pro / Polaris frosted   | **UNIVERSAL** (parâmetros constantes)                                                                              |
| `--press-scale/-hover-scale/-press-opacity/-hover-opacity/-disabled-opacity`             | `0.95/1.02/0.5/0.85/0.5`            | State defaults Material 3 + iOS HIG        | **UNIVERSAL**                                                                                                      |
| `--icon-{xs/sm/default/lg/xl/marketing}: 16/20/24/32/48/80px`                            | `24px`                              | Iconography sizes designsystems.com canon  | **UNIVERSAL**                                                                                                      |
| `--icon-stroke/-stroke-heavy: 1.5px/2px`                                                 | `1.5px`                             | Lucide canonical stroke                    | **UNIVERSAL**                                                                                                      |
| `--aspect-{hero/card/portrait/banner/square/wide/classic}`                               | `16/9, 1/1, 4/5, 2/1, 21/9, 4/3`    | Universal image aspect ratios              | **UNIVERSAL**                                                                                                      |
| `--radius-{sm/md/lg/xl/2xl/3xl/4xl/full}` (8 tokens)                                     | `4/8/12/16/20/24/32px/9999px`       | Scale derivada de `--radius` base          | **EXTRAS OPT-IN TBD** — TweakCN só tem `--radius`; nossa escala 8 níveis pode virar derivação CSS no tema          |
| `--shape-{card/button/input/badge/avatar}` (5 tokens — ADR-0028)                         | `12px/10px/8px/6px/9999px`          | Shape per componente (radius custom)       | **EXTRAS OPT-IN TBD** — over-engineered se TweakCN tem 1 `--radius` global. Re-decidir Fase 1                      |
| `--shadow-elevation-{1..5}/-overlay` (Vercel 5-level)                                    | `0 1px 2px 0 oklch(...)`            | Vercel canon, semantic naming              | **DESCARTADO** — TweakCN gera 8 níveis a partir de 6 primitives. Migra ou coexiste decidido Fase 1                 |
| `--shadow-inset-{hairline/hairline-light/frosted-ring}`                                  | `inset 0 0 0 1px oklch(...)`        | Apple/Polaris/Spotify inset patterns       | **EXTRAS OPT-IN TBD** — não há canon TweakCN; manter se algum preset usar                                          |
| `--shadow-sticky/-sticky-top`                                                            | `0 -2px 8px oklch(0 0 0 / .06)`     | FAB + sticky CTA shadow opposite-direction | **EXTRAS OPT-IN TBD**                                                                                              |
| `--font-{display/body/mono/accent/eyebrow}` (5 slots invented)                           | `var(--font-...)`                   | Invented — descartar com pivot             | **DESCARTADO**                                                                                                     |
| `--font-{sans/mono-legacy/brand/heading}` legacy aliases                                 | `var(--font-body)`                  | Back-compat aliases                        | **DESCARTADO** (substitui por canonical `--font-sans/-serif/-mono`)                                                |
| `--brand-hue: 275`                                                                       | `275`                               | Tenant brand hue (dynamic)                 | **PER-TENANT** — emit em `<style precedence="theme">`                                                              |
| `--color-surface-{1..5}` (dark/light, 10 tokens)                                         | `oklch(0.13 0.01 var(--brand-hue))` | Surface scale derivada de brand-hue        | **DESCARTADO** — substitui por canonical `--background`/`--card`/`--popover`/`--muted`/etc                         |
| `--color-{info/success/warning/destructive}`                                             | `oklch(0.68 0.13 235)`              | Semantic state (estático)                  | **PER-TENANT** (`--destructive` é canonical; `info/success/warning` viram **EXTRAS OPT-IN TBD** — TweakCN não tem) |
| `--color-{primary/primary-light/secondary/tertiary}`                                     | `oklch(0.58 0.18 275)`              | Fallback paleta default                    | **DESCARTADO** (substituído por canonical)                                                                         |
| `--color-chart-{1..5}`                                                                   | `oklch(0.5 0.05 195)`               | Chart series                               | **PER-TENANT** (canonical `--chart-1..5`)                                                                          |
| `--elevation-{flat/raised/overlay}` legacy aliases                                       | `var(--shadow-elevation-2)`         | ADR-0042 superseded                        | **DESCARTADO**                                                                                                     |
| `--shape-*` (5 tokens — ADR-0028)                                                        | `12px`                              | Shape per componente                       | **PER-TENANT** se sobrevive; provavelmente **EXTRAS OPT-IN TBD**                                                   |
| `--animate-shimmer` + `@keyframes shimmer`                                               | `shimmer 1.5s ...`                  | Skeleton animation                         | **UNIVERSAL**                                                                                                      |
| `--role-img-aspect-{default/card/hero/portrait/...}` (19 tokens)                         | `var(--aspect-hero)`                | Image roles invented                       | **DESCARTADO** — escala `--aspect-*` universal cobre                                                               |

**Veredito candidatos extras:** 5 categorias precisam decisão Fase 1.2:

1. Shadow elevation 5-level Vercel canon vs 6 primitives TweakCN (incompatíveis na superfície, mas podem coexistir — universal mantém Vercel, theme override 6 primitives quando preset preferir TweakCN-way)
2. `--radius-{sm..4xl}` scale derivada — mantém universal ou move pra theme calc()
3. `--shape-*` ADR-0028 (5 tokens) — over-engineered se canonical tem só `--radius`
4. `--color-{info/success/warning}` — canonical não cobre; **adicionar como extras opt-in**
5. APCA thresholds — não são CSS vars mas viram constants em `lib/design/contrast.ts` (já estão lá)

---

## 4. Decisão final: 3 buckets

### 4.1 UNIVERSAL (`globals.css` base — fora de qualquer tema)

Razão geral: tokens **estruturais não-branding**. Mudam por archetype-mood nunca; mudam por iOS/Android update talvez. Tenant não escolhe.

| Bucket                 | Tokens                                                                                                                                                                                               | Razão                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Spacing scale          | `--spacing-{0,1,2,3,4,5,6,8,10,12,16,20,24,32}` (14)                                                                                                                                                 | Carbon 8-base canonical, gera Tailwind utilities. Tenant nunca muda base.         |
| Spacing semantic       | `--spacing-{card/-card-gap/-section/-section-mobile/-hero/-stack-tight/-stack-comfortable/-stack-loose/-grid-gutter/-grid-gutter-mobile}` (10)                                                       | Defaults; raramente override per-tenant. Mobile-only via @media (max-width:767px) |
| Z-index                | `--z-{content/sticky/fab/mini-player/nav-bottom/overlay/modal/toast/tooltip}` (9)                                                                                                                    | Empilhamento arquitetural, não branding                                           |
| Motion                 | `--duration-{0..5000}` (12 níveis Polaris) + `--ease-{standard/decelerate/accelerate/emphasis/spring-gentle}` (5)                                                                                    | Material 3 / Apple HIG canonical                                                  |
| Breakpoint             | `--breakpoint-mobile: 768px`                                                                                                                                                                         | Single source pra matchMedia + AdaptiveShell                                      |
| Mobile chrome          | `--touch-min/-comfortable`, `--mobile-{full/half/three-quarter/screen/large}-height`, `--mobile-nav-height`, `--nav-bottom-height`, `--fab-size`, `--sticky-cta-height`, `--mini-player-height` (12) | iOS HIG + Material 3 canonical                                                    |
| Safe area              | `--inset-safe-{top/bottom/left/right}` (4)                                                                                                                                                           | env() — viewport-native                                                           |
| Focus                  | `--focus-width: 2px`, `--focus-offset: 2px` (2)                                                                                                                                                      | WCAG 2.4.13                                                                       |
| Frosted glass          | `--frosted-{blur/saturate/opacity/opacity-strong/opacity-light}` (5)                                                                                                                                 | Apple iOS glass canonical                                                         |
| State                  | `--press-scale/-hover-scale/-press-opacity/-hover-opacity/-disabled-opacity` (5)                                                                                                                     | Material 3 + iOS HIG canonical                                                    |
| Icon                   | `--icon-{xs/sm/default/lg/xl/marketing/stroke/stroke-heavy}` (8)                                                                                                                                     | Lucide + designsystems.com canon                                                  |
| Aspect                 | `--aspect-{hero/card/portrait/banner/square/wide/classic}` (7)                                                                                                                                       | Universais para imagem/video                                                      |
| Spacing global         | `--spacing` (Tailwind v4 base, 0.25rem) — **decisão diferente de TweakCN**                                                                                                                           | Tenant não muda Tailwind base; senão break Tailwind utilities                     |
| Letter-spacing default | `--letter-spacing-base: 0em` — apenas como **fallback no globals**; tema pode override                                                                                                               | Default 0; per-tenant raramente muda                                              |
| Animation              | `--animate-shimmer` + `@keyframes shimmer`                                                                                                                                                           | Universal skeleton                                                                |

**Total UNIVERSAL: ~93 tokens.** Aparentemente alto, mas é só porque escala numérica (spacing 14 + motion 17 + z-index 9 + mobile 12) detalhada.

### 4.2 PER-TENANT (`<style precedence="theme">` — emit por `buildThemeCSS()`, scoped no `:root` ou `:root[data-theme=...]`)

Razão geral: branding visual + APCA-sensitive. Muda 100% per tenant.

| Bucket            | Tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Razão                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Cores light       | `--background, --foreground, --card, --card-foreground, --popover, --popover-foreground, --primary, --primary-foreground, --secondary, --secondary-foreground, --muted, --muted-foreground, --accent, --accent-foreground, --destructive, --destructive-foreground, --border, --input, --ring, --chart-1..5, --sidebar, --sidebar-foreground, --sidebar-primary, --sidebar-primary-foreground, --sidebar-accent, --sidebar-accent-foreground, --sidebar-border, --sidebar-ring` (32) | Cor = branding canonical. 100% per tenant.            |
| Cores dark        | Mesmas 32 (objeto `dark`)                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Dark mode override                                    |
| Fontes            | `--font-sans, --font-serif, --font-mono` (3)                                                                                                                                                                                                                                                                                                                                                                                                                                         | Per tenant: Geist/Lora/IBM Plex/etc                   |
| Radius            | `--radius` (1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Per tenant: Apple 12px vs Linear 8px vs Nike 0px      |
| Shadow primitives | `--shadow-color, --shadow-opacity, --shadow-blur, --shadow-spread, --shadow-offset-x, --shadow-offset-y` (6)                                                                                                                                                                                                                                                                                                                                                                         | Per tenant: Apple soft vs Vercel sharp vs Linear flat |
| Letter-spacing    | `--letter-spacing` override (1)                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Per tenant: Inter -0.01em vs default 0                |

**Total PER-TENANT: ~75 tokens** (32 light + 32 dark + 3 fontes + 1 radius + 6 shadows + 1 letter-spacing = 75).

### 4.3 EXTRAS OPT-IN TBD (decisão Fase 1.2 ou Fase 2)

Razão geral: TweakCN-canonical não cobre, mas nosso uso pode justificar. Cada item precisa estudo prévio próprio antes de virar universal ou per-tenant.

| Token                                                                                  | Status  | Por que deferir                                                                                                                                    |
| -------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--radius-{sm,md,lg,xl,2xl,3xl,4xl,full}` derivativos                                  | **TBD** | Escolher: (a) calc() em `<style precedence="theme">` partindo de `--radius` base, ou (b) literal universal                                         |
| `--shape-{card/button/input/badge/avatar}` (ADR-0028)                                  | **TBD** | Over-engineered se canonical tem só `--radius`. Considerar deprecação OU per-tenant opt-in                                                         |
| `--color-{info/success/warning}` (canonical não tem)                                   | **TBD** | Aliases? Per-tenant? Tweakcn comunidade tem PR aberta pra adicionar. Universal hardcoded é solução curta                                           |
| Shadow Vercel `--shadow-elevation-{1..5}` semantic                                     | **TBD** | Conflita com 6 primitives TweakCN. Opções: (a) derivado em CSS via `var(--shadow-blur)` etc, (b) coexistem, (c) substitui semantic por algorítmico |
| `--shadow-inset-{hairline/hairline-light/frosted-ring}`                                | **TBD** | Apple/Polaris/Spotify inset patterns; sem canon TweakCN                                                                                            |
| `--shadow-sticky/-sticky-top`                                                          | **TBD** | Direção contrária (FAB + sticky CTA). Universal mas talvez per-tenant intensity?                                                                   |
| `--shape-*` tokens custom de shape per tipo                                            | **TBD** | Re-avaliar ADR-0028 (talvez deprecar)                                                                                                              |
| Native aliases archetype-specific (ex: `--apple-label-tertiary`, `--stripe-mesh-1..4`) | **TBD** | Se preset Apple/Stripe sobrevive Fase 3, native aliases voltam como opt-in per-preset                                                              |

**Total EXTRAS OPT-IN TBD: ~25 tokens** com decisão pendente.

---

## 5. Implicações pro `globals.css` novo

Esqueleto proposto (~120 LOC vs 584 atual). Sem `--role-*`, sem `--color-surface-*`, sem `--font-*` invented:

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@source not "../docs";
@source not "../tests";
@source not "../.next";
@source not "../public";
@source not "../.claude";

@custom-variant dark (&:is(.dark *));

@theme {
  /* ──────────────────────────────────────────────
     SPACING SCALE (Carbon 8-base — universal)
     ────────────────────────────────────────────── */
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;

  /* Spacing semantic (defaults; per-tenant override permitido) */
  --spacing-card: var(--spacing-6);
  --spacing-section: var(--spacing-24);
  --spacing-section-mobile: var(--spacing-12);
  --spacing-hero: var(--spacing-32);
  --spacing-stack-tight: var(--spacing-2);
  --spacing-stack-comfortable: var(--spacing-4);
  --spacing-stack-loose: var(--spacing-8);
  --spacing-grid-gutter: var(--spacing-6);
  --spacing-grid-gutter-mobile: var(--spacing-4);

  /* ──────────────────────────────────────────────
     Z-INDEX (universal)
     ────────────────────────────────────────────── */
  --z-content: 0;
  --z-sticky: 10;
  --z-fab: 20;
  --z-mini-player: 25;
  --z-nav-bottom: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-toast: 60;
  --z-tooltip: 70;

  /* ──────────────────────────────────────────────
     MOTION (Polaris 12 + Material 3 easings)
     ────────────────────────────────────────────── */
  --duration-0: 0ms;
  --duration-50: 50ms;
  --duration-100: 100ms;
  --duration-150: 120ms;
  --duration-200: 200ms;
  --duration-250: 250ms;
  --duration-300: 300ms;
  --duration-400: 400ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
  --duration-5000: 5000ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-emphasis: cubic-bezier(0.2, 0, 0, 1);
  --ease-spring-gentle: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ──────────────────────────────────────────────
     MOBILE (universal floor — Apple HIG + Material 3)
     ────────────────────────────────────────────── */
  --breakpoint-mobile: 768px;
  --touch-min: 44px;
  --touch-comfortable: 48px;
  --mobile-full-height: 100dvh;
  --mobile-half-height: 50dvh;
  --mobile-three-quarter-height: 75dvh;
  --mobile-screen-height: 100svh;
  --mobile-large-height: 100lvh;
  --mobile-nav-height: 56px;
  --nav-bottom-height: 56px;
  --fab-size: 56px;
  --sticky-cta-height: 64px;
  --mini-player-height: 56px;

  --inset-safe-top: env(safe-area-inset-top, 0px);
  --inset-safe-bottom: env(safe-area-inset-bottom, 0px);
  --inset-safe-left: env(safe-area-inset-left, 0px);
  --inset-safe-right: env(safe-area-inset-right, 0px);

  /* ──────────────────────────────────────────────
     FOCUS (WCAG 2.4.13)
     ────────────────────────────────────────────── */
  --focus-width: 2px;
  --focus-offset: 2px;

  /* ──────────────────────────────────────────────
     FROSTED GLASS (Apple iOS)
     ────────────────────────────────────────────── */
  --frosted-blur: 20px;
  --frosted-saturate: 180%;
  --frosted-opacity: 0.8;
  --frosted-opacity-strong: 0.7;
  --frosted-opacity-light: 0.9;

  /* ──────────────────────────────────────────────
     STATE (Material 3 + iOS HIG)
     ────────────────────────────────────────────── */
  --press-scale: 0.95;
  --hover-scale: 1.02;
  --hover-opacity: 0.85;
  --press-opacity: 0.6;
  --disabled-opacity: 0.5;

  /* ──────────────────────────────────────────────
     ICONOGRAPHY (Lucide + designsystems.com canon)
     ────────────────────────────────────────────── */
  --icon-xs: 16px;
  --icon-sm: 20px;
  --icon-default: 24px;
  --icon-lg: 32px;
  --icon-xl: 48px;
  --icon-marketing: 80px;
  --icon-stroke: 1.5px;
  --icon-stroke-heavy: 2px;

  /* ──────────────────────────────────────────────
     ASPECT RATIOS (universais)
     ────────────────────────────────────────────── */
  --aspect-hero: 16 / 9;
  --aspect-card: 1 / 1;
  --aspect-portrait: 4 / 5;
  --aspect-banner: 2 / 1;
  --aspect-square: 1 / 1;
  --aspect-wide: 21 / 9;
  --aspect-classic: 4 / 3;

  /* ──────────────────────────────────────────────
     SHIMMER (skeleton)
     ────────────────────────────────────────────── */
  --animate-shimmer: shimmer 1.5s ease-in-out infinite;
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
}

/* Mobile responsive override */
@media (max-width: 767px) {
  :root {
    --spacing-section: var(--spacing-section-mobile);
    --spacing-hero: var(--spacing-section-mobile);
    --spacing-grid-gutter: var(--spacing-grid-gutter-mobile);
  }
}

/* prefers-reduced-motion + prefers-reduced-transparency unchanged */

/* Inputs sempre 16px (anti auto-zoom iOS) */
input,
textarea,
select {
  font-size: 16px;
}
```

**Não tem mais:**

- `@theme inline` block (mapeamento shadcn `--color-*` → `--*`): vai pro `<style precedence="theme">` emitido por `buildThemeCSS`, pois as cores são per-tenant
- `:root { --role-*: ... }` 67 declarações: descartadas
- `--color-surface-{1..5}` derivações com `var(--brand-hue)`: substituídas por canonical `--background/--card/--popover/--muted` per tenant
- `--font-{display/body/mono/accent/eyebrow}` 5 slots: descartado, vira `--font-sans/-serif/-mono` per tenant

---

## 6. Implicações pro `build-theme-css.ts`

Esqueleto novo (~80 LOC vs 281 atual). Função pura `emitTheme(theme: Theme): string`:

```ts
import type { Theme } from './contract/theme'

type ThemeStyleProps = Theme['light'] // ou dark

function emitColorBlock(prefix: string, colors: ThemeStyleProps): string {
  // 32 canonical color tokens (28 + 4 sidebar extras)
  const lines: string[] = []
  for (const [key, value] of Object.entries(colors)) {
    lines.push(`  --${key}: ${value};`)
  }
  return lines.join('\n')
}

function emitCommonBlock(common: Theme['common']): string {
  const lines: string[] = []
  // Fonts (3)
  lines.push(`  --font-sans: ${common.fontSans};`)
  lines.push(`  --font-serif: ${common.fontSerif};`)
  lines.push(`  --font-mono: ${common.fontMono};`)
  // Radius (1)
  lines.push(`  --radius: ${common.radius};`)
  // Shadow primitives (6)
  lines.push(`  --shadow-color: ${common.shadowColor};`)
  lines.push(`  --shadow-opacity: ${common.shadowOpacity};`)
  lines.push(`  --shadow-blur: ${common.shadowBlur};`)
  lines.push(`  --shadow-spread: ${common.shadowSpread};`)
  lines.push(`  --shadow-offset-x: ${common.shadowOffsetX};`)
  lines.push(`  --shadow-offset-y: ${common.shadowOffsetY};`)
  // Letter-spacing (1)
  lines.push(`  --letter-spacing: ${common.letterSpacing};`)
  return lines.join('\n')
}

export function emitTheme(theme: Theme): string {
  const lines: string[] = []
  // Light (default)
  lines.push(':root {')
  lines.push(emitColorBlock('', theme.light))
  lines.push(emitCommonBlock(theme.common))
  lines.push('}')
  // Dark
  lines.push('.dark, :root.dark {')
  lines.push(emitColorBlock('', theme.dark))
  lines.push('}')
  return lines.join('\n')
}
```

Sem mais: `assertArchetypeExists`, `resolveStrategy`, `emitRoles`, `emitNative`, `emitTypography` 5-slot, `POLARITY_INVERSE`. Tudo descartado com pivot.

---

## 7. Riscos + edge cases

| Risco                                                                                                | Probabilidade | Impacto | Mitigação                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tenant **quer** spacing diferente (ex: Apple-y spacing larger)                                       | Baixa         | Baixo   | Spacing semantic já é override-friendly via @media. Per-tenant raro mas suportável                                                                                                               |
| `--shadow-elevation-*` semantic naming **morre** com pivot — wrappers DS quebram                     | Alta          | Médio   | Mapping em `<style precedence="theme">`: `--shadow-elevation-2: 0 1px 3px 0 var(--shadow-color) / var(--shadow-opacity)`. Coexistem                                                              |
| Hipótese "spacing universal" vs TweakCN "spacing per-tenant"                                         | Média         | Baixo   | TweakCN tem `--spacing` (Tailwind v4 base 0.25rem). Tenant change quebra Tailwind utilities. **Mantém universal**                                                                                |
| `--letter-spacing` universal default 0 vs TweakCN per-tenant                                         | Baixa         | Baixo   | Manter ambos: globals.css define default; theme override quando preciso                                                                                                                          |
| `--color-{info/success/warning}` extras opt-in não-canonical — break ecosystem compat ao adicionar   | Baixa         | Baixo   | Não-canonical mas zero impacto: shadcn blocks não usam esses tokens. Adiciona como opt-in safe                                                                                                   |
| Native aliases archetype-specific (`--apple-label-tertiary`) — onde declarar?                        | Média         | Médio   | **TBD Fase 3**: opt-in per-preset via `<style precedence="theme">` blocks adicionais; fallback chain `var(--apple-..., var(--muted-foreground))`                                                 |
| Z-index universal vs alguma marca que precisa stacking diferente                                     | Baixíssima    | Baixo   | Empilhamento é arquitetura, não branding. Permanece universal                                                                                                                                    |
| Motion durations universais vs marca super "slow" (vintage) ou "fast" (gaming)                       | Baixa         | Baixo   | Per-tenant override do `--duration-200` poderia entrar. **Decisão: não suportar inicialmente**; reavalia se preset Vintage justificar                                                            |
| Shadow Vercel 5-level (`--shadow-elevation-1..5`) ≠ TweakCN 6 primitives gerando 8 níveis            | Alta          | Médio   | **Decidir Fase 1.2**: opção (a) substituir pelos 8 níveis algorítmicos `shadow-2xs..2xl`, opção (b) manter Vercel canon como camada universal, theme override quando preset preferir TweakCN-way |
| `--radius-{sm..4xl}` 8-token scale vs canonical `--radius` único                                     | Média         | Baixo   | **Decidir Fase 1.2**: derivar em CSS calc(`--radius-sm: calc(var(--radius) * 0.5)`) ou manter universal hardcoded                                                                                |
| Worktrees scanning Tailwind v4 ainda atrapalha                                                       | Já vista      | Baixo   | `@source not "../.claude"` já no globals.css proposto                                                                                                                                            |
| Tenant que sobrevive de antes do pivot tem schema atual (palette_id + archetype_id), não Theme JSONB | Alta          | Médio   | Migration Fase 4 transforma `tenants.archetype_id` em FK pra `theme_presets` table; legacy fallback `apple` preset                                                                               |

**Edge case crítico:** se algum preset precisa shadow direction-aware (sticky shadow vai pra cima, FAB shadow vai pra baixo), os 6 primitives TweakCN **não suportam** porque assumem 1 direção. Vercel 5-level também não. **Solução proposta:** `--shadow-sticky` permanece universal opt-in (não-canonical mas constante).

---

## 8. Refs externas

- TweakCN `types/theme.ts` (schema Zod canonical): https://github.com/jnsahaj/tweakcn/blob/main/types/theme.ts
- TweakCN `config/theme.ts` (defaults + COMMON_STYLES partition): https://github.com/jnsahaj/tweakcn/blob/main/config/theme.ts
- TweakCN `utils/theme-presets.ts` (23 presets, ~114KB): https://github.com/jnsahaj/tweakcn/blob/main/utils/theme-presets.ts
- TweakCN `utils/shadows.ts` (6 primitives → 8 algorithmic levels): https://github.com/jnsahaj/tweakcn/blob/main/utils/shadows.ts
- TweakCN `utils/contrast-checker.ts` (WCAG; nós usamos APCA via `lib/design/contrast.ts`): https://github.com/jnsahaj/tweakcn/blob/main/utils/contrast-checker.ts
- shadcn registry docs: https://ui.shadcn.com/docs/registry
- Tailwind v4 `@theme` block docs: https://tailwindcss.com/docs/theme
- Tailwind v4 default theme (spacing/breakpoint/motion canonical): https://tailwindcss.com/docs/customizing-spacing
- Apple HIG touch target: https://developer.apple.com/design/human-interface-guidelines/inputs/touch-target
- Material 3 elevation + motion: https://m3.material.io/styles/motion/overview
- Polaris 12 motion durations: https://polaris.shopify.com/foundations/motion
- WCAG 2.4.13 focus appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- APCA-W3 documentation: https://git.apcacontrast.com/documentation/README
- ADR-0028 (pool customização DB-side): `docs/adr/0028-*.md`
- ADR-0043 (consolidated DS, superseded ADR-0044): `docs/adr/0043-design-system-consolidated.md`
- Research 28 (TweakCN evaluation, anatomia completa): `docs/research/28-tweakcn-evaluation.md`
- Auditoria pivot (HIGH-confidence): `docs/_sessions/2026-05-21-auditoria-pivot-tweakcn.md`

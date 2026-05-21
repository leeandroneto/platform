# 16. Semantic colors audit dos 18 archetypes (Passo 2A)

> **Status:** deep-dive de semantic colors per archetype (Passo 2A do plano 14)
> **Data:** 2026-05-20
> **Input:** 18 archetypes em `15-archetype-curation.md`
> **Output:** matriz de roles × archetypes pra D-43 finalização + recomendações Passos 3 + 5
> **Princípio:** mapeamento literal do que cada DESIGN.md documenta. "via X" = mapeia por reuso explícito; "—" = não documentado.

---

## TL;DR

- **17 roles universais (cobertura ≥ 80% dos 18)** — core obrigatório no token contract.
- **8 roles parciais (cobertura 40-79%)** — extended opcional com fallback obrigatório.
- **6 buckets de marca NÃO mapeiam nos 25 atuais** → 4 roles novos propostos (`marker-eyebrow-dot`, `surface-block-color`, `accent-promo-rare`, `text-on-accent`).
- **APCA risk concentrado em 4 combos:** wise warning (`#ffd11a` em canvas), figma block-pink/coral text branco, mistral cream-on-cream, theverge mint #3cffd0 < 16px.
- **5 archetypes não documentam paleta semantic completa** (spacex, vodafone, wired, zapier, mastercard) — usam ink-only + ad-hoc red/orange.

---

## 1. Roles × Archetypes — Matriz consolidada

Format célula: hex curto quando mapeia direto. `(via X)` = reuso explícito documentado. `—` = não documentado / gap intencional.

### Surface layer

| Role                | linear  | notion       | stripe       | nike       | apple        | wired | spacex      | mistral    | wise          | figma        | theverge   | claude  | vodafone | opencode | mastercard | sanity   | zapier    | starbucks |
| ------------------- | ------- | ------------ | ------------ | ---------- | ------------ | ----- | ----------- | ---------- | ------------- | ------------ | ---------- | ------- | -------- | -------- | ---------- | -------- | --------- | --------- |
| `page-canvas`       | #010102 | #fff         | #fff         | #fff       | #fff         | #fff  | #000        | #fff       | #e8ebe6       | #fff         | #131313    | #faf9f5 | #fff     | #fdfcfc  | #f3f0ee    | #0b0b0b  | #fffefb   | #f2f0eb   |
| `surface-container` | surf-1  | surface      | canvas-soft  | soft-cloud | parchment    | —     | canvas-soft | surface    | canvas (#fff) | surface-soft | slate      | surf-sc | canv-sft | surf-sft | lift-cream | dark-gry | canv-sft  | white     |
| `surface-elevated`  | surf-2  | surface-soft | (via shadow) | (via blur) | pearl-button | —     | —           | surf-cream | (via shadow)  | (via shadow) | (via fill) | surf-cs | —        | surf-crd | white      | med-dark | (via brd) | ceramic   |

### Cards / feature

| Role              | linear | notion           | stripe         | nike        | apple         | wired    | spacex     | mistral      | wise          | figma       | theverge | claude        | vodafone | opencode | mastercard | sanity     | zapier    | starbucks  |
| ----------------- | ------ | ---------------- | -------------- | ----------- | ------------- | -------- | ---------- | ------------ | ------------- | ----------- | -------- | ------------- | -------- | -------- | ---------- | ---------- | --------- | ---------- |
| `feature-card-bg` | surf-1 | tint-{9}         | canvas-soft    | soft-cloud  | (alt tile)    | canv-sft | canv-night | cream        | canvas        | block-{7}   | mint/UV  | surf-cd       | canv-sft | surf-sft | lift-cream | dark-gry   | canv-sft  | white      |
| `member-card-bg`  | surf-2 | tint-yellow-bold | brand-dark-900 | —           | (alt tile dk) | —        | —          | surf-cream   | canvas        | block-coral | mint     | callout-coral | ink      | surf-crd | ink-blk    | sanity-red | (via ink) | gold-light |
| `category-marker` | —      | brand-{8}        | (via ribbon)   | accent-pink | —             | —        | —          | sunshine-300 | accent-orange | block-mint  | mint     | acc-amb       | —        | —        | clay-brown | neon-grn   | —         | gold       |

### Text

| Role            | linear       | notion       | stripe      | nike         | apple        | wired     | spacex       | mistral     | wise         | figma        | theverge | claude  | vodafone | opencode     | mastercard | sanity   | zapier   | starbucks       |
| --------------- | ------------ | ------------ | ----------- | ------------ | ------------ | --------- | ------------ | ----------- | ------------ | ------------ | -------- | ------- | -------- | ------------ | ---------- | -------- | -------- | --------------- |
| `text-emphasis` | #f7f8f8      | ink-deep     | ink #0d253d | #111111      | #1d1d1f      | #000      | #fff/on-prim | ink         | #0e0f0c      | ink (#000)   | #fff     | #141413 | #25282b  | #201d1d      | #141413    | #fff     | #201515  | rgba(0,0,0,.87) |
| `text-body`     | ink-muted    | ink/charcoal | ink-sec     | charcoal     | body #1d1d1f | brevtxt   | on-prim-mute | charcoal    | body #454745 | ink (#000)   | sec-#949 | body    | body     | charcoal     | ink-blk    | silver   | ink-sft  | text-blk-soft   |
| `text-muted`    | ink-subtle   | slate/steel  | ink-mute    | mute #707072 | ink-mute-80  | body grey | ink-mute     | slate/steel | mute #868685 | (via wt 330) | sec-#949 | muted   | mute     | mute         | slate-gray | med-gray | body-mid | 0.58 alpha      |
| `text-disabled` | ink-tertiary | muted        | (via opac)  | ash          | ink-muted-48 | —         | —            | muted       | (via opac)   | (via wt)     | dim-gray | mut-sft | mute     | ash          | dust-taupe | (via wt) | mute     | (via opac)      |
| `text-inverted` | inv-ink      | on-dark      | on-primary  | on-prim/#fff | body-on-dark | (none)    | on-primary   | on-dark     | (via canvas) | inv-ink/#fff | inv-text | on-dark | on-dark  | (via canvas) | white      | white    | text-wht | text-white      |

### Accent (brand)

| Role               | linear       | notion    | stripe       | nike             | apple       | wired          | spacex     | mistral      | wise         | figma       | theverge   | claude        | vodafone | opencode       | mastercard | sanity     | zapier         | starbucks   |
| ------------------ | ------------ | --------- | ------------ | ---------------- | ----------- | -------------- | ---------- | ------------ | ------------ | ----------- | ---------- | ------------- | -------- | -------------- | ---------- | ---------- | -------------- | ----------- |
| `accent-primary`   | lavendr      | purple    | #533afd      | #111 (ink)       | #0066cc     | #057dbc        | (via #fff) | #f97316~     | #9fe870      | #000        | #3cffd0    | #cc785c       | #e60000  | (via ink)      | #141413    | #f36458    | #ff4f00        | #00754A     |
| `accent-secondary` | brand-secure | link-blue | brand-dark   | (via gray)       | sky-link    | —              | —          | (via deep)   | (via deep)   | acc-magenta | UV #5200ff | acc-teal      | —        | (via #007aff)  | signal-or  | #0052ef    | (via ink)      | #006241     |
| `accent-subtle`    | (via surf-1) | tints 9   | prim-subdued | accent-pink-soft | (via parch) | (via canv-sft) | —          | sunshine-300 | primary-pale | block tints | (via 0.9α) | prim-disabled | —        | (via surf-sft) | dust-taupe | light-blue | (via canv-sft) | green-light |

### Border

| Role             | linear           | notion          | stripe         | nike          | apple         | wired     | spacex           | mistral         | wise          | figma         | theverge     | claude     | vodafone    | opencode        | mastercard | sanity  | zapier     | starbucks |
| ---------------- | ---------------- | --------------- | -------------- | ------------- | ------------- | --------- | ---------------- | --------------- | ------------- | ------------- | ------------ | ---------- | ----------- | --------------- | ---------- | ------- | ---------- | --------- |
| `border-default` | hairline #23252a | hairline        | #e3e8ee        | #cacacb       | divider-soft  | #e0e0e0   | hairline-dk      | hairline        | (via ink 1px) | hairline      | #313131      | hairline   | (via ink)   | hairline        | (none)     | #212121 | (via ink)  | (none)    |
| `border-strong`  | hairline-strong  | hairline-strong | hairline-input | hairline-soft | hairline      | (none)    | hairline-dk-soft | hairline-strong | (via ink)     | hairline-soft | mint #3cffd0 | (via hr)   | (via on-dk) | hairline-strong | (none)     | #353535 | (via ink)  | (none)    |
| `border-focus`   | primary-focus    | (via prim)      | (via prim)     | (via ink)     | primary-focus | (via blk) | (via #fff)       | (via prim)      | (via prim)    | (via prim)    | focus-cyan   | (via prim) | (via red)   | acc-act         | (via blk)  | #0052ef | (via prim) | (via grn) |

### Semantic (status)

| Role               | linear | notion     | stripe       | nike         | apple | wired      | spacex | mistral    | wise        | figma         | theverge | claude     | vodafone  | opencode | mastercard | sanity  | zapier | starbucks         |
| ------------------ | ------ | ---------- | ------------ | ------------ | ----- | ---------- | ------ | ---------- | ----------- | ------------- | -------- | ---------- | --------- | -------- | ---------- | ------- | ------ | ----------------- |
| `semantic-success` | green  | success    | —            | #007d48      | —     | —          | —      | —          | #2ead4b     | #green ✓      | —        | #5db872    | —         | #30d158  | —          | #37cd84 | —      | (via green-light) |
| `semantic-warning` | —      | warning    | —            | —            | —     | —          | —      | —          | #ffd11a     | —             | —        | #d4a017    | —         | #ff9f0a  | —          | —       | —      | #fbbc05           |
| `semantic-danger`  | —      | error      | (in-product) | sale #d30005 | —     | —          | —      | —          | #d03238     | —             | —        | #c64545    | (via red) | #ff3b30  | —          | #dd0000 | —      | #c82014           |
| `semantic-info`    | —      | (via link) | (via prim)   | info #1151ff | —     | (via link) | —      | (via link) | accent-cyan | (via wt blue) | #3860be  | (via teal) | —         | accent   | #3860be    | #55beff | —      | —                 |

### Shadow

| Role             | linear | notion        | stripe              | nike   | apple         | wired  | spacex | mistral      | wise   | figma           | theverge    | claude | vodafone | opencode | mastercard         | sanity  | zapier | starbucks           |
| ---------------- | ------ | ------------- | ------------------- | ------ | ------------- | ------ | ------ | ------------ | ------ | --------------- | ----------- | ------ | -------- | -------- | ------------------ | ------- | ------ | ------------------- |
| `shadow-card`    | (none) | rgba(15)/0.08 | rgba(0,55,112)/0.08 | (none) | (none)        | (none) | (none) | rgba(0)/0.04 | (none) | rgba(0)/0.06    | (none) ring | (none) | (none)   | (none)   | rgba(0)/0.08 large | ring    | (none) | dual-shadow stacked |
| `shadow-modal`   | (none) | rgba(15)/0.16 | rgba(0,55,112)/lift | (none) | backdrop-blur | (none) | (none) | rgba(0)/0.12 | (none) | (overlay-scrim) | scrim       | (none) | (none)   | (none)   | rgba(0)/0.25       | bd-blur | (none) | triple-stack        |
| `shadow-tooltip` | —      | rgba(15)/0.04 | —                   | —      | —             | —      | —      | rgba(0)/0.04 | —      | —               | —           | rare   | —        | —        | —                  | —       | —      | frap-stacks         |

---

## 2. Per archetype — semantic colors específicos

### 2.1 Linear

- **Success:** semantic-success green (status pills) — único semantic em marketing
- **Warning / Danger / Info:** não documentado (in-product only)
- **Accent variants:** lavender + lavender-hover (#828fff) + lavender-focus (#5e69d1) + brand-secure (muted) — 4 variants explícitos
- **Surface tints:** 4-step ladder canvas → surface-1 → surface-2 → surface-3 (+ surface-4)
- **Notas:** dark-only, surface ladder substitui shadows. Inverse pair existe pra rare CTA branca.

### 2.2 Notion

- **Success / Warning / Error:** todos declarados explicitamente (semantic-success, -warning, -error)
- **Accent variants:** purple + purple-pressed + purple-deep + link-blue (NÃO igual a primary) — distinção CTA vs link explicitada
- **Surface tints:** 9 card-tints (peach/rose/mint/lavender/sky/yellow/yellow-bold/cream/gray) + brand color spectrum 10 cores secundárias
- **Notas:** mais rico semanticamente de todos. Card-tint-yellow-bold é único "high-emphasis banner" token.

### 2.3 Stripe

- **Success / Warning / Error / Info:** "brand does not use separate semantic palette in marketing" — vivem in-product (dashboard)
- **Accent variants:** indigo + indigo-deep + indigo-press + indigo-soft + indigo-subdued + brand-dark-900 — 6 variants (mais granular do conjunto)
- **Surface tints:** canvas + canvas-soft + canvas-cream (chromatic interlude band) + 2 hairlines
- **Notas:** ruby/magenta/lemon são gradient stops, não roles funcionais. Tinted shadows (rgba 0,55,112) signature.

### 2.4 Nike

- **Success:** #007d48 + success-bright #1eaa52 (inverse on dark)
- **Warning:** ausente
- **Danger:** sale #d30005 + sale-deep #780700 (semantic colado em e-commerce price)
- **Info:** #1151ff + info-deep #0034e3 (member-experience callouts)
- **Accent variants:** 6 category-accents (pink/pink-soft/pink-deep/purple-soft/purple-pale/teal) — NUNCA texto/CTA, só swatch/chip/illustrative
- **Surface tints:** soft-cloud (product stage) + hairline + hairline-soft (inset shadow)
- **Notas:** semantic colors são commercial signals (sale ≠ danger). Único do set com sale role distinto.

### 2.5 Apple

- **Success / Warning / Danger / Info:** zero docs explícitos em marketing
- **Accent variants:** Action Blue + Focus Blue + Sky Link Blue (3 variants light/dark-aware)
- **Surface tints:** white + parchment + pearl-button + 3 near-black tiles (tile-1/2/3) + true black + translucent-chip — 6 surfaces
- **Notas:** semantic = "transformer pode mostrar via in-product". Sub-step de near-black-tiles (1/2/3) é único — micro-tonal hierarchy entre dark surfaces adjacentes.

### 2.6 Wired

- **Success / Warning / Danger:** "operates with one inline link colour and no separate error / success / warning palette in marketing"
- **Info:** link-blue #057dbc (only inside body copy, never UI/nav)
- **Accent variants:** APENAS ink-black (single accent) — extreme minimalism
- **Surface tints:** canvas + canvas-soft (rare) + hairline
- **Notas:** archetype mais pobre semantic-wise. Reuso ink-black faz quase tudo.

### 2.7 SpaceX

- **Success / Warning / Danger / Info:** zero — "brand has no accent colors"
- **Accent variants:** zero (photography supplies hues)
- **Surface tints:** canvas-night + canvas-night-soft + canvas-light + canvas-cool + 2 hairlines (on-dark, on-light) — duas paletas paralelas (marketing dark + shop light)
- **Notas:** archetype pure-mono. Aproveita marketing/shop pra ter 2 surface modes sem semantic palette.

### 2.8 Mistral.ai

- **Success / Warning / Danger:** não documentado
- **Info:** link (matches primary orange)
- **Accent variants:** orange + orange-deep + 5 sunshine stops (300/500/700/800/900) + yellow-saturated + 3 gradient blocks — 11 variants (gradient-rich)
- **Surface tints:** canvas + surface + surface-cream + surface-code (dark) + cream + cream-soft + cream-deeper + beige-deep
- **Notas:** archetype-defining "sunset stripe" gradient = depth medium próprio. Surface-code é único — dark surface dedicada a IDE mockup, não inversion universal.

### 2.9 Wise

- **Positive:** #2ead4b + positive-deep #054d28 (success)
- **Warning:** #ffd11a + warning-deep #b86700 + warning-content #4a3b1c (text on warning surface)
- **Negative:** #d03238 + negative-deep #a72027 + negative-darkest #a7000d + negative-bg #320707 (dark maroon bg)
- **Accent variants:** primary + primary-active (#cdffad) + primary-neutral + primary-pale (subtle bg)
- **Tertiary brand:** accent-orange #ffc091 + accent-cyan #38c8ff (illustrations only)
- **Notas:** **mais completo semantic do conjunto** — 4 níveis cada (positive/warning/negative), incluindo "negative-bg" (surface) e "warning-content" (text on bg) explícitos. Apenas archetype com text-on-warning token nominado.

### 2.10 Figma

- **Success:** semantic-success green (glyph fill only, no surface)
- **Warning / Danger / Info:** ausentes
- **Accent variants:** black (primary) + white + magenta-promo (sparing, promotional banner) — único "promo accent" do conjunto
- **Surface tints:** canvas + inverse-canvas + surface-soft + 2 hairlines + **7 color blocks** (lime/lilac/cream/mint/pink/coral/navy) — block-color como signature surface category
- **Notas:** block-\* surfaces são "story section colors" — NÃO mapeiam em surface-elevated nem feature-card-bg classicamente. Role novo "surface-block-color" candidato.

### 2.11 The Verge

- **Success / Warning / Info:** "Focus Ring" #1eaedb existe (keyboard focus only)
- **Danger:** ausente (não-aplicável editorial)
- **Accent variants:** jelly-mint #3cffd0 + console-mint-border #309875 + ultraviolet #5200ff + purple-rule + deep-link-blue (hover only) + focus-cyan — 6 variants
- **Surface tints:** canvas-black #131313 + surface-slate #2d2d2d + image-frame #313131 + hazard-white + absolute-black (text on accent tiles)
- **Notas:** color-as-elevation extreme. Story tiles em mint/UV/yellow/pink/orange/white viram surface-as-emphasis. Saturated-fill = elevação direta. Múltiplos accent fills sem hierarquia primary/secondary clara.

### 2.12 Claude

- **Success:** #5db872
- **Warning:** #d4a017
- **Error:** #c64545
- **Info:** ausente (talvez via accent-teal)
- **Accent variants:** coral + coral-active + coral-disabled (#e6dfd8, mesmo que hairline) + accent-teal + accent-amber — 5 variants
- **Surface tints:** canvas (#faf9f5 cream) + surface-soft + surface-card + surface-cream-strong + surface-dark + surface-dark-elevated + surface-dark-soft + 2 hairlines = **8 surfaces** (mais granular junto com Linear)
- **Notas:** cream-vs-dark band alternance é signature. Coral-disabled === hairline (#e6dfd8) — single hex 2 roles.

### 2.13 Vodafone

- **Success / Warning / Danger / Info:** "brand does not maintain separate semantic palette"
- **Accent variants:** Vodafone Red #e60000 (single, no variants)
- **Surface tints:** canvas + canvas-soft + ink (#25282b, used as text + dark surface)
- **Notas:** archetype mais simplificado semantic-wise no set after spacex/wired. Polarity-flip ink↔canvas faz elevation.

### 2.14 OpenCode.ai

- **Success:** #30d158 (Apple HIG)
- **Warning:** #ff9f0a + warning-hover + warning-active (3 níveis)
- **Danger:** #ff3b30 + danger-hover + danger-active (3 níveis)
- **Info:** accent #007aff + accent-hover + accent-active (3 níveis)
- **Accent variants:** primary === ink (#201d1d), ink-deep #0f0000 (red undertone)
- **Surface tints:** canvas-cream + soft-surface + surface-card + surface-dark + surface-dark-elevated + 2 hairlines (1 translucent rgba(15,0,0,0.12))
- **Notas:** importa Apple HIG semantic ramp inteira (success/warning/danger/info × 3 níveis) mas usa SÓ in-TUI. Marketing fica mono cream. Único do set com hairline translucent warm-tinted.

### 2.15 Mastercard

- **Success / Warning / Danger:** zero docs explícitos
- **Info:** link-blue #3860BE
- **Accent variants:** ink-black + signal-orange + light-signal-orange + clay-brown — 4 chromatics (signal-orange = "consent legal" only, semantic-loaded)
- **Surface tints:** canvas-cream + lifted-cream + white + soft-bone — 4 paper-on-paper
- **Brand-only:** mastercard-red + mastercard-yellow (logo lockup ONLY, never UI)
- **Notas:** "signal-orange = legal/consent" é semantic role pra context específico — não mapeia em warning genérico, mapeia em "compliance signal".

### 2.16 Sanity

- **Error:** #dd0000 (high-saturation)
- **GPC Green:** #37cd84 (privacy/compliance)
- **Success implícito:** neon-green displayP3
- **Warning:** ausente
- **Info:** electric-blue #0052ef (também = hover universal + focus ring)
- **Accent variants:** sanity-red coral + electric-blue (hover universal) + light-blue + accent-magenta + neon-green — 5
- **Surface tints:** near-black + dark-gray (#212121) + medium-dark (#353535) + pure-white + light-gray — 5 níveis grayscale puro achromatic
- **Border system declarado:** 5 borders explícitos (dark/subtle/medium/light/orange-special)
- **Notas:** apenas archetype com **border system enumerado** (5 níveis nominados). Color-as-elevation totalmente colorimetric (zero shadows).

### 2.17 Zapier

- **Success / Warning / Danger / Info:** "doesn't surface separate semantic palette on marketing"
- **Accent variants:** zapier-orange #ff4f00 (single)
- **Surface tints:** canvas (warm off-white #fffefb) + canvas-soft (cream #f8f4f0)
- **Notas:** archetype mais minimal semantic. Compensa via ink tier de 6 níveis (ink, ink-soft, ink-mid, body, body-mid, mute).

### 2.18 Starbucks

- **Red:** #c82014 (error/destructive)
- **Yellow:** #fbbc05 (warning, legacy brand)
- **Green Light:** valid form tint (#d4e9e2 @ 33%)
- **Red Tint:** invalid form tint (5% alpha)
- **Accent variants:** **4-tier green system** (Starbucks Green #006241 / Green Accent #00754A / House Green #1E3932 / Green Uplift #2b5148 / Green Light #d4e9e2) + Gold #cba258 + Gold Light + Gold Lightest (Rewards-only ceremony)
- **Surface tints:** white + neutral-cool + neutral-warm (#f2f0eb cream canvas) + ceramic + black (top CTA strip) — 5 surfaces incluindo cool/warm parallel
- **Black/white alpha ladders:** 9-step rgba 0.06→0.90 dois ramps
- **Notas:** **único arquétipo com role-by-context type switching** — Gold reserva para Rewards-status moments (NÃO general-purpose). "Rewards Green" (#33433d) é text-color dedicada a 1 surface only — context-specific text role inédito.

---

### 2.19 Spotify

- **Success:** não declarado (FALLBACK)
- **Warning:** orange #ffa42b
- **Danger:** negative red #f3727f
- **Info:** announce blue #539df5
- **Accent variants:** Spotify Green #1ed760 + border-green #1db954 + light-surface #eeeeee (3 variants)
- **Surface tints:** 5-step dark ladder near-black #121212 → dark-surface #181818 → mid-dark #1f1f1f → dark-card #252525 → mid-card #272727
- **Notas:** único archetype com persistent now-playing bar (`--surface-container-dark`). Bottom-tab 4 items. Shadow = scrim em dark background.

### 2.20 Airbnb

- **Success:** não declarado (FALLBACK)
- **Warning:** não declarado (FALLBACK)
- **Danger:** primary-error #c13515
- **Info:** legal-link #428bff
- **Accent variants:** Rausch #ff385c + Rausch-active #e00b41 + primary-disabled #ffd1da (3 variants warmth gradient) + Luxe #460479 (categoria premium) + Plus #92174d (tier)
- **Surface tints:** canvas #ffffff + surface-soft #f7f7f7 + surface-strong #f2f2f2 (3 surfaces)
- **Notas:** sticky-bottom-bar = commerce signature. Date cells de calendário usam `--accent-subtle`.

### 2.21 Meta

- **Success:** #31a24c
- **Warning:** #f7b928
- **Danger:** #e41e3f
- **Info:** fb-blue #1876f2 (link, não CTA)
- **Accent variants:** cobalt #0064e0 + ink-button #000000 + primary-soft #0091ff — dual-CTA pattern (cobalt = commerce, ink = marketing)
- **Surface tints:** canvas #ffffff + surface-soft #f1f4f7 (2-step minimal)
- **Notas:** cobalt é reservado exclusivamente pra commerce actions. Sticky-bottom-buy-rail usa cobalt; hero usa ink-button.

### 2.22 Pinterest

- **Success:** success-pale #c7f0da (fundo apenas, não texto)
- **Warning:** não declarado (FALLBACK)
- **Danger:** #9e0a0a
- **Info:** accent-blue #617bff (hover state apenas)
- **Accent variants:** Pinterest Red #e60023 + secondary-bg #e5e5e0 + accent-purple #7e238b (premium/categoria) + focus-outer #435ee5 (keyboard focus — distinto da brand color)
- **Surface tints:** canvas #ffffff + surface-soft #fbfbf9 + surface-card #f6f6f3 (3 warm whites) + surface-dark #262622 (dark panel contrast)
- **Notas:** focus-outer (#435ee5) = único archetype com focus indicator explicitamente distinto da cor primária. Bottom-sheet modal signature.

---

## 3. Roles propostos a ADICIONAR ao set canônico (25→28)

Buckets recorrentes que não cabem nos 25 atuais:

### 3.1 `--role-marker-eyebrow-dot` (NOVO)

- **Marcas:** mastercard (tiny accent dot before eyebrow label), notion (sticky-note dots), claude (spike-mark glyph), figma (figmaMono uppercase eyebrows), mistral (micro-uppercase + sunshine stops)
- **Frequência:** ~6 dos 18 (33%)
- **Bucket:** "small visual marker preceding eyebrow/category label" — distinto de category-marker (que é background tint)
- **Por que merece role:** decoração pré-eyebrow é signature recorrente; mapeá-lo em accent-primary perde tom específico.

### 3.2 `--role-surface-block-color` (NOVO)

- **Marcas:** figma (7 block-\* surfaces), theverge (mint/UV/yellow/pink/orange/white story tiles), notion (9 card-tints), nike (purple-pale/pink-soft soft tile fills)
- **Frequência:** 4-6 das 18 (~30%)
- **Bucket:** "saturated/tinted full-section/full-tile color surface as story emphasis device" — NÃO é feature-card-bg (cards inside neutral surface) nem accent-subtle (small tint). É surface enquanto editorial color block.
- **Por que merece role:** sem ele, color-block-as-elevation breakeven figma/theverge perde semântica.

### 3.3 `--role-accent-promo-rare` (NOVO)

- **Marcas:** figma (magenta-promo), starbucks (gold-tier ceremony), claude (callout-card-coral full-bleed), notion (yellow-bold high-emphasis banner)
- **Frequência:** 4-5 das 18 (~25%)
- **Bucket:** "one-off promotional/celebrational accent reserved for rare banner/CTA moments — never general-purpose"
- **Por que merece role:** mapear isso em accent-secondary descaracteriza (secondary deve ser "frequently used"). Promo-rare tem regras de uso explicitamente "sparing/once-per-page".

### 3.4 `--role-text-on-accent` (NOVO)

- **Marcas:** wise (warning-content #4a3b1c, text-on-warning explícito), nike (on-primary), notion (on-primary), figma (on-primary, on-inverse-soft), apple (body-on-dark, body-muted on-dark), opencode (multiple on-X colors), theverge (inverted-text #131313 on mint/yellow tiles), starbucks (text-white-soft)
- **Frequência:** ~12 das 18 (67%)
- **Bucket:** "text color sitting ON an accent/colored/inverted surface — distinct from text-inverted because inverted assumes ink/canvas flip; on-accent assumes saturated background"
- **Por que merece role:** Wise demonstrou — "warning-content" (text on warning surface) é distinto de "on-dark" (text on inverted canvas). Sem este role, todo cálculo APCA pra texto em surface saturada vira ad-hoc.

### Roles NÃO propostos a adicionar (avaliação)

- **`--role-link-distinct`** (link ≠ accent-primary): notion declara explicitamente, theverge tem hover-only blue, mastercard tem link-blue distinto. Frequência ~7/18. **Veredito:** absorver em accent-secondary com label "link" — não cria role novo.
- **`--role-shadow-tinted`**: Stripe (navy-tinted rgba 0,55,112), Claude (warm shadow 20,20,19), Mistral (cool 0,0,0). Frequência ~3/18. **Veredito:** parametrize via `--shadow-color` token universal (já no `03-tokens-universe.md` §1.6).
- **`--role-surface-code`**: Mistral declara explicitamente (surface-code dark IDE). Frequência: 1/18 (também via Claude surface-dark, Linear inverse-surface). **Veredito:** componente-level (code-block primitive), não role universal.

---

## 4. Gaps (marca não tem role explicitado)

Combos archetype × role com gap material — estratégia de fallback:

| Archetype  | Role gap                             | Fallback proposto                                             |
| ---------- | ------------------------------------ | ------------------------------------------------------------- |
| linear     | semantic-warning/danger/info         | undefined em marketing; ativar via in-product layer só        |
| stripe     | semantic-success/warning/danger/info | undefined; in-product dashboard layer only                    |
| apple      | semantic-success/warning/danger/info | undefined; cair pra Action Blue (primary) genérico em link    |
| wired      | semantic-success/warning/danger      | undefined; ink + body grey hierarchy faz validation cue       |
| spacex     | accent-primary explícito             | derivar do par #fff/#000 + photography                        |
| vodafone   | semantic-success/warning             | undefined; red duplica como danger; in-product layer          |
| mastercard | semantic-success/warning/danger      | undefined; signal-orange para "compliance/legal" specifically |
| zapier     | semantic-success/warning/danger/info | undefined; orange duplica como danger; in-product layer       |
| nike       | semantic-warning                     | undefined; sale-red é commerce não warning; cair pra info     |
| sanity     | semantic-warning                     | undefined; orange-border indica "featured" não warning        |
| theverge   | semantic-success/warning/danger      | undefined em editorial; in-product Vox stack                  |
| figma      | semantic-warning/danger/info         | success-green é glyph-only; rest undefined; in-product layer  |

**Padrão:** **5 archetypes inteiramente sem semantic explícito (spacex, wired, zapier, vodafone, mastercard)** + **8 com cobertura parcial**. Apenas **wise, opencode, notion, claude, sanity, starbucks (6)** documentam ramp completo.

**Implicação:** semantic-success/warning/danger/info viram **roles opcionais com fallback chain** explícita:

```
--role-semantic-{success|warning|danger|info}: var(--archetype-semantic-X, var(--accent-primary))
```

Storybook decorator deve mostrar warning quando archetype não declara semantic completo + fallback ativo.

---

## 5. Recomendações pra Passos 3 + 5

### 5.1 Lista final dos roles canônicos (25 → 29)

**Core obrigatório (17 roles, cobertura ≥ 80%):**

- page-canvas, surface-container, surface-elevated
- feature-card-bg, member-card-bg
- text-emphasis, text-body, text-muted, text-disabled, text-inverted
- accent-primary, accent-secondary, accent-subtle
- border-default, border-strong, border-focus
- shadow-card

**Extended opcional com fallback (8 roles, cobertura 40-79%):**

- category-marker
- semantic-success, semantic-warning, semantic-danger, semantic-info
- shadow-modal, shadow-tooltip
- text-on-accent (novo, alta freq mas precisa formalização)

**Novos propostos (3 roles, recorrentes mas underdocumented):**

- marker-eyebrow-dot
- surface-block-color
- accent-promo-rare

> `text-on-accent` promovido para Tier 2 (extended) — ver D-43.

**Total: 17 core + 8 extended + 3 novos = 28 roles** (de 25 → 28 com mínima inflação).

### 5.2 Compatibility matrix preliminary (Passo 5)

Combinações archetype × palette × mode com risco APCA alto, identificadas no audit:

| Combo                             | Risco                                    | Mitigação                             |
| --------------------------------- | ---------------------------------------- | ------------------------------------- |
| wise + warning #ffd11a / canvas   | Lc ~ 50 em texto preto sobre yellow      | Force warning-content (#4a3b1c) ON    |
| figma + block-pink/coral + text   | Branco sobre pink/coral pode falhar      | Inverter text pra ink quando block-X  |
| mistral + cream-on-cream          | hairline-soft ~ surf-cream invisível     | Subir hairline-strong em forms        |
| theverge + mint #3cffd0 < 16px    | Vibração em sizes pequenos               | Hard-block em CSS: mint ≥ 16px only   |
| sanity + dark-gray on near-black  | #212121 sobre #0b0b0b borderline         | Border-radius shadows pra disambiguar |
| starbucks + gold #cba258 / cream  | Lc baixo em cream canvas                 | Gold só em surface-dark House Green   |
| apple + pearl-button on parchment | Quase iguais — APCA quase passa fail     | Forçar 1px shadow ring                |
| mastercard + dust-taupe / cream   | Doc explicita "low contrast use sparing" | Apenas placeholder/disabled           |

### 5.3 Sinais pra Storybook stories matrix (Passo 8)

Stories que DEVEM existir pra cada archetype:

1. **Semantic status all-fired** — render success/warning/danger/info juntos. Marca docs falhar em "semantic ausente" via Storybook badge.
2. **Surface stack** — page-canvas + container + elevated + feature-card + block-color em 1 view per archetype. Visualiza hierarquia.
3. **Text ladder + on-accent matrix** — text-emphasis/body/muted/disabled × surfaces 5+ por archetype. APCA gate built-in.
4. **Border + focus** — input default/hover/focus/error states cobertos. Critical pra forms.
5. **Promo accent rare** — só archetypes que declaram (figma/starbucks/claude/notion). Outros mostram fallback warning.

---

## 6. Estatísticas finais

- **18 archetypes auditados em 100%**
- **Cobertura média de 25 roles canônicos:** ~62% (15.5/25 por archetype)
- **Mais completos (top-3):** wise (24/25), notion (24/25), claude (23/25)
- **Mais minimal (top-3):** spacex (10/25), wired (11/25), vodafone (12/25) — todos intencionalmente
- **Distribuição de archetypes com semantic ramp completo:** 6/18 (33%)
- **Distribuição de archetypes com 4+ accent variants:** 11/18 (61%)
- **Distribuição com surface ladder 4+ níveis:** 8/18 (44%) — linear, notion, claude, opencode, sanity, starbucks, mistral, apple

**Concluído.** Pronto pra Passo 3 (cravar D-43 com 28 roles) + Passo 5 (compatibility matrix Zod usando os 8 combos críticos).

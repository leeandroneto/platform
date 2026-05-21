# 03. Tokens universe — todas categorias encontradas (sem simplificar)

> Status: catálogo WIP — todas categorias mapeadas das pesquisas 26+27 + observações Kholmatova
> Última atualização: 2026-05-19
> Bloqueado por: pesquisa 28 (component catalog) + leitura Carbon/Atlassian/Polaris/iOS HIG/Material
> Princípio: **NÃO simplificar.** Se marca premium tem 40 variações de raio, nossos templates carregam 40.

---

## Por que esse documento existe

Pesquisa 27 listou 15 gaps. Mas o objetivo aqui é mais amplo: **enumerar TODAS categorias de tokens** que aparecem nos design systems lidos + os pendentes (Carbon, Atlassian, Polaris, iOS HIG, Material). Não simplifica. Não decide qual entra. Só cataloga.

Quando alguém abrir esse arquivo, deve sair sabendo: "essas N categorias precisam ser cobertas por todo template que crio".

---

## Convenção de cobertura por arquétipo

Cada categoria tem 5 valores nas linhas (Editorial-Serif, Minimal-Mono, Soft-Productive, Bold-Energetic, Warm-Wellness) — os 5 arquétipos core. Quando refletindo cobertura literal de um DESIGN.md, o número exato vai.

Quando não sabemos: marca `?` + status pesquisa pendente.

---

## 1. Cores

### 1.1 Surface (background tones)

Marcas premium variam de 3 a 8 níveis de surface:

- **2 níveis** (canvas + card) — minimalistas raros
- **3 níveis** (canvas + raised + overlay) — atual desafit
- **4 níveis** (canvas + surface-1 + surface-2 + surface-3) — Linear 4-step ladder canon
- **5+ níveis** (Carbon tonal elevation 5+ níveis em dark mode)

**Status:** decisão pendente. Hipótese: **5 níveis tokens com mapping per archetype**:

```
--surface-canvas       (page background)
--surface-card         (raised card)
--surface-overlay      (modal, dropdown)
--surface-elevated     (popover above modal, edge cases)
--surface-inverted     (dark on light brand, vice-versa)
```

### 1.2 Ink (text colors)

Universal mínimo: 3 níveis.

- `--ink-primary` (heading, primary body)
- `--ink-secondary` (subhead, supporting text)
- `--ink-muted` (caption, disabled, meta)
- `--ink-disabled` (input placeholder, disabled state — pode mesclar com muted)
- `--ink-inverted` (text on dark surface quando brand é light)

**Stripe canon adicional:** `--ink-link`, `--ink-success`, `--ink-warning`, `--ink-danger`, `--ink-info` — semantic ink colors.

### 1.3 Brand accent (palette colors)

Camada **palette layer** (não template). 13 paletas atuais cobrem. Cada paleta carrega:

- `--accent-base` (primary brand color)
- `--accent-hover` (10% darker/lighter)
- `--accent-active` (20% darker)
- `--accent-focus` (ring color, frequentemente accent + alpha)
- `--accent-subtle` (tinted background, frequentemente accent + 5-10% alpha)
- `--accent-strong` (deeper variant pra emphasis)

**Status pendente:** as 13 paletas atuais carregam essas 6 sub-variants? Auditar `lib/design/palettes.ts`.

### 1.4 Semantic colors

Não é template-dependent — é universal:

- Success (verde) — 3 tones (subtle/base/strong)
- Warning (amarelo/laranja) — 3 tones
- Danger/Error (vermelho) — 3 tones
- Info (azul) — 3 tones

= **12 semantic ink + 12 surface tints** = ~24 tokens semantic.

### 1.5 Border colors

- `--border-default` (1px hairline padrão)
- `--border-strong` (2px, ou border default em focus)
- `--border-subtle` (divider muito leve, frequentemente surface +5% darker)
- `--border-inverted` (border em surface dark)
- `--border-accent` (focus ring com accent color)

### 1.6 Shadow colors

Stripe canon: **tinted shadows** (`rgba(0,55,112,0.08)` navy) — não pure black. Per archetype:

- Fintech sofisticado: navy-tinted
- Warm-Wellness: warm-tinted (brown alpha)
- Bold-Energetic: zero (no shadow)
- Default neutro: pure black + alpha

→ **`--shadow-color` token per archetype.**

### 1.7 Palette × Template compatibility

Validação Zod (forbidden combos da pesquisa 26):

- Minimal-Mono + neon palette → cyberpunk parody
- Warm-Wellness + monochrome-stark → vira clínico
- Bold-Energetic + pastel → mata energia
- Editorial-Serif + neon → cyberpunk parody

→ Mapping matriz template × palette em código (Zod refine + runtime check).

---

## 2. Tipografia

### 2.1 Famílias de fontes

Marcas premium frequentemente usam 2-3 famílias:

- **Sans body** (Geist atual)
- **Sans display** (variant ou família diferente — Söhne, Inter Display, Apple SF Pro Display)
- **Serif display** (Editorial-Serif: Newsreader, PP Editorial New, Tiempos, Apple New York)
- **Mono code** (Geist Mono atual; JetBrains Mono alternativa)
- **Rounded** (Warm-Wellness opcional: Recoleta, SF Rounded)

→ **`--font-sans`, `--font-display`, `--font-serif`, `--font-mono`, `--font-rounded`** — 5 slots possíveis. Nem todo template usa todos.

**Pesquisa 27 sample:** maioria usa 1-2 famílias. Apple HIG diz "Try to maintain a single font" — mas Editorial-Serif quebra isso.

### 2.2 Type scale completa por template — 12-14 variants

Pesquisa 26 cravou 12+ variants polymorphic (não 3 + 9 JIT). Lista típica:

```
hero-display    (56-96px, varia drasticamente)
display-xl      (40-72px)
display-lg      (32-56px)
h1              (24-40px)
h2              (20-32px)
h3              (17-24px)
lead            (18-24px paragraph)
body-lg         (16-18px)
body            (14-16px)
body-sm         (13-14px)
caption         (12-13px)
label           (11-12px uppercase tracked)
mono            (13-14px monospace)
metric          (24-48px tabular-nums — Bold-Energetic, dashboards)
quote           (italic serif blockquote)
eyebrow         (small uppercase intro before heading)
kicker          (small color-accent intro)
```

**Cobertura mínima:** 12 variants. **Máxima:** 14-17 (com metric/quote/eyebrow/kicker/mono).

### 2.3 Pesos (weights)

Geist suporta 100-900 (variable). Tipicamente:

- 300 (light) — Stripe usa 400 base
- 400 (regular body)
- 500 (medium emphasis)
- 600 (semibold subhead)
- 700 (bold headings)
- 800-900 (black — Bold-Energetic Nike/Whoop)

→ tokens `--weight-light/regular/medium/semibold/bold/black` = 6.

### 2.4 Line-height

Universal:

- `--leading-tight` (1.0-1.1 — display)
- `--leading-snug` (1.15-1.25 — headings)
- `--leading-normal` (1.4-1.5 — body)
- `--leading-relaxed` (1.6-1.7 — long-form reading)

**Per [lang]:** PT-BR ganha `--leading-heading: 1.15` (vs EN 1.10) por causa de diacríticos. Pesquisa 26 cravou.

### 2.5 Letter-spacing

Curva perceptual (não linear):

- mega-display 96px: `-0.04em` (mais negativo)
- display-xl 56-72px: `-0.035em`
- h1-h2: `-0.02 a -0.015em`
- body 14-16px: `0`
- caption 12-13px: `+0.005 a +0.01em`
- label 11-12px uppercase: `+0.08 a +0.14em`

→ tokens `--tracking-tightest` até `--tracking-widest` = ~10 níveis.

### 2.6 Caso de uso (uppercases, eyebrows, drop caps)

Marcas premium usam:

- **Uppercase tracked** em labels (12px + tracking 0.08-0.14em)
- **Drop caps** em long-form editorial (Editorial-Serif)
- **Small caps** em metadados (rare, optional)
- **Eyebrow text** acima de heading (small caps OR uppercase OR colorido)
- **Kicker** small accent intro
- **Pull quote** large italic serif

→ utility classes ou wrapper components por uso, não só tokens.

### 2.7 Confirmado por designsystems.com (Figma — 2026-05-19)

Princípios canônicos do guide oficial Figma typography:

- **Line-height starting point:** `1.5 × font-size` (rule of thumb)
- **Baseline grid:** line-height vira base — todos sizes mapeiam ou dividem em múltiplos
- **Pesos parcimoniosos:** _"Keep the list short for performance"_ — explorar hierarquia via tamanho antes de adicionar weights novos
- **Pairing rule:** _"Reserve unique brand typefaces for display/headlines"_ + pair com "more legible typeface for the bulk of the typography" (body)
- **Cobertura mínima de tokens:** helper-text + form labels + body copy + subheads + headlines
- **Token-driven, NÃO hard-coded:** valores codified em token/variable system, nunca px literais espalhados
- **Responsive:** maior variância em display sizes (hero, h1) — body permanece estável

→ **Aplicação desafit:** confirma nosso enfoque de 12-17 type variants polymorphic via CSS vars. Reforça pairing serif display + sans body em Editorial-Serif. Reforça pesos parcimoniosos (6 max) em vez de proliferar.

---

## 3. Spacing

### 3.1 Base unit

- **4px base** (majoria moderna: Linear, Vercel, Claude, Notion, Airbnb)
- **8px base** (Sanity, The Verge, Figma, Nike, Stripe, Tesla)

→ Decisão: **4px base** (mais granular, abrange 8px também). Tailwind v4 default = 4px (`spacing-1 = 0.25rem`).

### 3.2 Scale completa

Linear, não fibonacci:

```
0       0px
0.5     2px (rare, only Airbnb micro-step)
1       4px
1.5     6px
2       8px
2.5     10px
3       12px
4       16px
5       20px
6       24px
7       28px
8       32px
10      40px
12      48px
14      56px
16      64px
20      80px
24      96px (section padding desktop canon)
28      112px
32      128px
40      160px
48      192px (Vercel hero canon)
```

= ~20 níveis.

### 3.3 Padding tokens por componente

Não é só scale linear — alguns padding têm **nomes**:

- `--padding-card-mobile` (16-24px)
- `--padding-card-desktop` (24-32px)
- `--padding-feature-card` (32-48px)
- `--padding-section-mobile` (32-48px)
- `--padding-section-desktop` (64-96px)
- `--padding-hero` (96-192px desktop, 48-64px mobile)
- `--padding-input-y` (8-14px)
- `--padding-input-x` (12-16px)
- `--padding-button-y` (8-14px)
- `--padding-button-x` (16-32px)

### 3.4 Gap (gutter)

- `--gutter-mobile` (16-24px)
- `--gutter-tablet` (24-32px)
- `--gutter-desktop` (24-48px)
- `--gutter-spacious` (48-80px — Warm-Wellness Airbnb)

### 3.5 Confirmado por IBM Carbon (2026-05-19)

Carbon usa **8px mini unit** como base do 2x Grid + scale em **multiplos de 2/4/8**.

Insight crítico — Carbon tem **DUAS spacing scales separadas**:

1. **Component spacing** — entre elementos DENTRO de um componente (button padding, card padding)
2. **Layout spacing** — entre componentes na page (section gaps, content blocks)

> Carbon: _"Carbon has two spacing scales, one for general spacing within components and the other for layout spacing. Both are designed to complement the existing components and typography throughout the system."_

**Aplicação desafit:** confirma nossa separação `--padding-*` (component-level) + `--space-section-*` (layout-level). Naming convention sugerida:

```
--space-component-01     2px
--space-component-02     4px
--space-component-03     8px
--space-component-04     12px
--space-component-05     16px
--space-component-06     24px
--space-component-07     32px

--space-layout-01        16px
--space-layout-02        24px
--space-layout-03        32px
--space-layout-04        48px
--space-layout-05        64px
--space-layout-06        96px
--space-layout-07        128px
```

Numeric naming (Carbon-style) vs semantic naming (`--padding-card-default`) — bi-modal (já decidido D-05 em `11-decisions-pending.md`).

---

## 4. Radius

### 4.1 Scale completa (bimodal observado)

**Técnico (0-12px):** Linear/Vercel/Tesla — sharp precision
**Editorial/Wellness (14-32px):** Airbnb/Notion/Figma — soft welcome
**Gap (13-19px) raro** — pesquisa 27 finding

```
--radius-none    0px (Bold-Energetic Tesla)
--radius-xs      2px (Tesla buttons, Theverge)
--radius-sm      4px (Tesla cards, Sanity ghost)
--radius        6px (Sanity card default)
--radius-md     8px (Vercel button, Linear button, Airbnb button)
--radius-lg     12px (Linear card std, Vercel card)
--radius-soft   14px (Airbnb card canon — GAP DESCOBERTO pesquisa 27)
--radius-xl     16px (Vercel card large, Claude hero)
--radius-2xl    20px (Theverge std)
--radius-3xl    24px (Figma std, Airbnb large, Theverge feature)
--radius-4xl    32px (Figma feature, Airbnb xl, Warm-Wellness max)
--radius-pill   9999px (full pill button)
```

= ~12 levels + pill = 13 tokens.

### 4.2 Per archetype mapping

- Bold-Energetic Tesla: usa 0 / 2 / 4 → `--radius-none/xs/sm`
- Bold-Energetic Nike: usa pill exclusively → `--radius-pill`
- Minimal-Mono: usa 8 / 12 / 16 → `--radius-md/lg/xl`
- Editorial-Serif: usa 6 / 12 / 16-24 → `--radius/lg/xl/2xl/3xl`
- Soft-Productive Stripe: usa 12 / 16 + pill → `--radius-lg/xl/pill`
- Soft-Productive Figma: usa 24 / 32 + pill → `--radius-3xl/4xl/pill`
- Warm-Wellness Airbnb: usa 14 (soft) / 20 / 32 → `--radius-soft/2xl/4xl`

---

## 5. Sombras / Elevação

### 5.1 Filosofias (3 famílias)

Pesquisa 27 identificou:

1. **Color-as-elevation** (Sanity, Linear, The Verge, Nike, Figma) — sem drop-shadow, hierarquia via surface ladder ou color blocks
2. **Subtle stacked shadows** (Vercel, Notion, Stripe, Airbnb) — múltiplos offsets baixa opacity (4-10% black), nunca single heavy
3. **Zero shadow** (Tesla, Claude marketing) — flat absoluto, depth via foto

### 5.2 Token model — Vercel canon (5 stacked levels)

```
--shadow-card-1   0 0 0 1px #00000014 (inset hairline only)
--shadow-card-2   L1 + 0px 1px 1px #00000005, 0px 2px 2px #0000000a
--shadow-card-3   L1 + 0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a
--shadow-card-4   L1 + 0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a
--shadow-card-5   L1 + 0px 1px 1px, 0px 8px 16px -4px, 0px 24px 32px -8px
```

5 níveis. Tinted opcional (Stripe usa `rgba(0,55,112)` navy).

### 5.3 Dark mode substitution

Em dark mode, shadow vira **inset hairline ring**:

```
--shadow-card-dark   inset 0 0 0 1px var(--hairline)
```

Linear 4-step surface ladder substitui shadow inteiramente.

### 5.4 Tokens shadow específicos

- `--shadow-card-rest`
- `--shadow-card-hover`
- `--shadow-card-active`
- `--shadow-dropdown`
- `--shadow-popover`
- `--shadow-modal`
- `--shadow-tooltip`
- `--shadow-sticky-nav` (1px inset bottom-line Nike canon)

= ~10 shadow tokens nomeados + 5 níveis numéricos = ~15 tokens shadow.

---

## 6. Motion / Animation

### 6.1 Durations

```
--motion-instant       50ms (immediate visual feedback)
--motion-micro         100-150ms (hover, focus shift, color change)
--motion-quick         180-200ms (button press, small reveal)
--motion-standard      250-300ms (modal open, dropdown, page transition)
--motion-slow          400-500ms (large reveal, hero entry)
--motion-cinematic     600-800ms (Tesla scroll, Apple-like)
```

= 6 timing tokens.

### 6.2 Easings

```
--ease-linear              linear
--ease-out                 cubic-bezier(0, 0, 0.2, 1)
--ease-in-out              cubic-bezier(0.4, 0, 0.2, 1)
--ease-tesla-canon         cubic-bezier(0.5, 0, 0, 0.75) (0.33s default)
--ease-wellness            cubic-bezier(0.25, 0.46, 0.45, 0.94)
--ease-overshoot           cubic-bezier(0.34, 1.56, 0.64, 1) (Nike spring)
```

### 6.3 Spring physics (Motion 12)

Não tokenizar como classes — passar como prop pro Motion 12:

- `gentle`: `{stiffness: 120, damping: 14}`
- `wobbly`: `{stiffness: 180, damping: 12}` (Bold-Energetic overshoot)
- `stiff`: `{stiffness: 260, damping: 24}`
- `softspring`: `{stiffness: 170, damping: 26}` (Soft-Productive Stripe)

→ `lib/motion/presets.ts` exporta presets nomeados.

### 6.4 Stagger tokens

```
--stagger-tight       30ms
--stagger-default     50ms
--stagger-loose       100ms
```

### 6.5 Confirmado por Shopify Polaris (motion canon — 2026-05-19)

Polaris tem **12 duration tokens granulares** (em vez de nossos 6 categóricos) + **5 easings com cubic-bezier verbatim** + **6 keyframes nomeados**.

**Durations (Polaris naming `--p-motion-duration-NN`):**

```
0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 5000 ms
```

12 níveis em incrementos de 50ms até 500ms + um outlier 5000ms pra slow ambient.

→ **Decisão pendente:** adotar 12 numeric (mais granular) OU manter nossos 6 categóricos (`instant/micro/quick/standard/slow/cinematic`)? Recomendado **bi-modal** (D-05): numeric `--motion-duration-100/200/etc` + semantic `--motion-quick: var(--motion-duration-200)`.

**Easings Polaris (verbatim cubic-bezier):**

| Token                    | Cubic-bezier                        | Usage                                                      |
| ------------------------ | ----------------------------------- | ---------------------------------------------------------- |
| `--p-motion-linear`      | `cubic-bezier(0, 0, 1, 1)`          | Continuous mechanical animations (spinners)                |
| `--p-motion-ease-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)`    | _"A good default for transitions triggered by the system"_ |
| `--p-motion-ease-out`    | `cubic-bezier(0.19, 0.91, 0.38, 1)` | _"Use sparingly"_                                          |
| `--p-motion-ease-in`     | `cubic-bezier(0.42, 0, 1, 1)`       | _"Use sparingly"_                                          |
| `--p-motion-ease`        | `cubic-bezier(0.25, 0.1, 0.25, 1)`  | _"A great default for any user interaction"_               |

→ **Atualizar tokens easing em §6.2** com valores Polaris (mais precisos que defaults Tailwind/CSS).

**Keyframes nomeados Polaris:**

- `--p-motion-keyframes-bounce`
- `--p-motion-keyframes-fade-in`
- `--p-motion-keyframes-pulse`
- `--p-motion-keyframes-spin`
- `--p-motion-keyframes-appear-above`
- `--p-motion-keyframes-appear-below`

→ Útil pra Storybook stories + Motion 12 reuse. **Adicionar 6 keyframes nomeados canônicos** (loading spinner, skeleton pulse, toast appear).

**Princípio Polaris (verbatim):** _"Use motion tokens instead of custom styles so that motion is consistent across the Admin."_

→ Confirma nossa estratégia tokens-only pra motion.

---

## 7. Borders / Hairlines

- **Width:** sempre 1px (universal pesquisa 27 — nunca 0.5/2px)
- **Color:** semantic (`--border-default`, `--border-strong`, `--border-subtle`)
- **Style:** solid universal (nunca dashed/dotted exceto edge cases)

### 7.1 Focus ring

Variantes:

- **Outline ring 2px** (Sanity, Notion) — `outline: 2px solid var(--accent-focus); outline-offset: 2px`
- **Border thicken 2px** (Theverge, Airbnb) — replaces 1px border with 2px
- **Double ring** (Stripe) — outer + inner ring com cores diferentes
- **Glow alpha** (Claude) — `0 0 0 3px rgba(coral, 0.15)`

→ token `--focus-style` + per-archetype value.

---

## 8. Touch targets

- `--touch-target-min` = 44px (Apple HIG canon)
- `--touch-target-comfortable` = 48px (Material Design)
- `--touch-target-large` = 56px+ (Warm-Wellness Airbnb input)

Universal pesquisa 27: todas 11 marcas declaram 44-48px primary CTA mobile minimum.

---

## 9. Breakpoints

Pesquisa 27 finding: convergem em **480 / 768 / 1024 / 1280 / 1440**.

```
--breakpoint-xs    480px (large mobile)
--breakpoint-sm    768px (tablet portrait)
--breakpoint-md    1024px (tablet landscape / small desktop)
--breakpoint-lg    1280px (standard desktop)
--breakpoint-xl    1440px (large desktop)
--breakpoint-2xl   1920px (ultrawide — opcional)
```

Outliers: The Verge tem 26 breakpoints (descartar como pattern). Sanity tem 9 (também outlier).

---

## 10. Container widths

```
--container-narrow     1080px (Airbnb listing detail, Claude marketing)
--container-default    1280px (median — Linear, Notion, Stripe, Theverge, Figma)
--container-wide       1440px (Vercel max, Nike, Sanity)
```

= 3 níveis named.

### 10.1 Confirmado por Ant Design (2026-05-19)

Ant Design canon (focado em enterprise dashboards):

- **Design board recommendation:** 1440px width
- **Content area:** 1168px em 1440px layout (margins 136px each side)
- **Mainstream screen resolutions 2026:** 1920, 1440, 1366, 1280
- **24-column grid** (mais granular que Bootstrap 12-col)
- **Base unit:** 8px (bate Carbon + Polaris + Material)

**2 layout types canônicos:**

1. **Left-Right Layout** — sidebar nav fixed + work area scaled (= nosso DashboardLayout)
2. **Top-Bottom Layout** — header + min-margins each side + content scaled (= nosso MarketingLayout)

→ **Aplicação desafit:** confirma nossos 3 níveis de container + 24-col grid pra dashboards (Linear-style) + 12-col fallback pra marketing.

**Princípios Ant (verbatim):**

> _"Clear definition of dynamic layout area" + "Try to always use even numbers" + "Delivery of critical numbers (Gutter, Column)" + "Always use beginning column and ending column to define blocks"_

---

## 11. Aspect ratios

```
--aspect-square        1/1 (avatar, card thumbnail)
--aspect-portrait      4/5 (Airbnb experience card, Nike mobile hero)
--aspect-landscape     16/9 (hero default, video)
--aspect-wide          16/10 (product screenshot, code mockup)
--aspect-cinematic     2/1 OR 21/9 (banner, full-bleed hero)
--aspect-photo         3/2 (traditional photography)
```

= 6 aspect tokens.

---

## 12. Photography style tokens (perceptual)

Não é número — é decisão semântica:

```
--photo-style: framed | full-bleed | soft-focus | composite-mockup | no-photo
--photo-tone: warm | cool | neutral | high-contrast
--photo-crop: face-centered | rule-of-thirds | full-bleed | content-aware
--photo-grain: visible | none
```

Per archetype.

---

## 13. Component sizing tokens (height-based)

```
--button-h-xs     28px (nav button Vercel)
--button-h-sm     32px (small actions)
--button-h-md     40px (default — universal canon)
--button-h-lg     48px (primary CTA)
--button-h-xl     56-64px (search orb Airbnb, hero CTA Nike)

--input-h-sm      32px (Vercel form-sm)
--input-h-md      40px (default)
--input-h-lg      48px
--input-h-xl      56px (Airbnb friendly)
```

---

## 14. Z-index scale

```
--z-base           0
--z-dropdown       10
--z-sticky-nav     20
--z-overlay        30
--z-modal          40
--z-popover        50
--z-tooltip        60
--z-toast          70
```

Universal não-archetype-dependent.

---

## 15. PWA / safe-area / mobile

**Status pesquisa pendente.** Pesquisa 30.

```
--pwa-safe-area-top      env(safe-area-inset-top)
--pwa-safe-area-bottom   env(safe-area-inset-bottom)
--pwa-tap-highlight      transparent (universal canon)
--pwa-viewport-fit       cover
```

---

## 16. Iconography

Foundation que apareceu na referência canônica (designsystems.com / Atlassian / Carbon / Polaris). Sistema de ícones é foundation próprio, não só componente.

### 16.1 Source library

Opções principais 2026:

| Library       | Pros                                                          | Cons                                 | Custo |
| ------------- | ------------------------------------------------------------- | ------------------------------------ | ----- |
| **Lucide**    | shadcn padrão. 1500+ icons. Consistente                       | Stroke-only (sem variants filled)    | Free  |
| **Tabler**    | 4500+ icons. Outline + filled variants                        | Inconsistência leve entre subsets    | Free  |
| **Heroicons** | Tailwind oficial. Outline/solid/mini                          | Catalogo menor (~300)                | Free  |
| **Phosphor**  | 9000+ icons. 6 weights (thin/light/regular/bold/fill/duotone) | Heavy (todas variants)               | Free  |
| **Iconify**   | Aggregator 200k+ icons (todas libs acima + outras)            | Runtime resolution adiciona overhead | Free  |
| **Custom**    | Identidade própria, premium feel                              | Trabalho de design + manutenção      | High  |

**Recomendação preliminar:** **Lucide dia 1** (shadcn nativo, sem fricção). Phosphor JIT pra archetypes que precisem variants filled (Soft-Productive Stripe, Warm-Wellness Airbnb).

### 16.2 Tamanhos canônicos

Convergência da maioria dos design systems:

```
--icon-xs       12px (badge, micro)
--icon-sm       14px (inline body)
--icon-md       16px (default — universal)
--icon-lg       20px (button md, secondary nav)
--icon-xl       24px (button lg, primary nav, card header)
--icon-2xl      32px (hero feature, large action)
--icon-3xl      40-48px (empty state, illustration)
```

= 7 níveis. **16px é default universal.**

### 16.3 Stroke width consistency

Lucide usa **stroke 2px** padrão. Per archetype pode mudar:

- Minimal-Mono: 1.5px (mais delicado, Geist-aligned)
- Editorial-Serif: 1.5px (combina com hairlines finos)
- Soft-Productive: 2px (default)
- Bold-Energetic: 2.5px ou filled (mais impacto)
- Warm-Wellness: 1.5px ou rounded-end strokes (Phosphor light)

→ `--icon-stroke-width` token per archetype.

### 16.4 Variants per archetype

| Archetype       | Style dominante                          | Library sugerida        |
| --------------- | ---------------------------------------- | ----------------------- |
| Editorial-Serif | outline thin (1.5px)                     | Lucide / Phosphor thin  |
| Minimal-Mono    | outline thin (1.5px)                     | Lucide / Phosphor light |
| Soft-Productive | outline default + filled em "hot" states | Phosphor regular + fill |
| Bold-Energetic  | filled solid OR sharp angular            | Phosphor bold/fill      |
| Warm-Wellness   | rounded ends (Phosphor light)            | Phosphor light          |

### 16.5 Icon button matrix

Heights bate com `--button-h-*`:

```
--icon-button-h-sm      32px (icon: 14-16px)
--icon-button-h-md      40px (icon: 16-20px)
--icon-button-h-lg      48px (icon: 20-24px)
--icon-button-h-xl      56-64px (icon: 24-32px) — Airbnb search orb
```

### 16.6 Touch target em icon-only

Apple HIG mínimo 44pt. Material 48dp. → icon button mobile = 44-48px **mesmo se ícone é menor** (padding compensates).

### 16.7 Acessibilidade

- Sempre `aria-label` ou `aria-hidden` em decorative
- Inline SVG (não font-icon) — `aria-hidden="true"` quando label vem do botão
- Stroke + fill com `currentColor` pra herdar tema

### 16.8 Custom iconography (JIT futuro)

Cada archetype pode ter 5-10 ícones próprios "signature":

- Bold-Energetic fitness: ícones de equipamento (halteres, bicicleta, mat)
- Warm-Wellness yoga: ícones de poses
- Editorial idiomas: ícones de bandeiras / chat / book

→ **JIT.** Por enquanto Lucide cobre 95%.

### 16.9 Confirmado por designsystems.com (Figma — 2026-05-19)

Bonnie Kate Wolf (designsystems.com/iconography-guide) cravou regras canônicas:

**Sizes:** 16/24/32 (alinhados a 8-grid) + 80 marketing

- **24px = product icon default** (canônico)
- 80px marketing icons (vast difference in use justifica)

**Stroke widths:**

- 1-2px típico
- Nunca menor que 10px com stroke 1-2px (decifragem fica impossível)
- **Espaço entre strokes ≥ stroke weight**
- _"If you're going to create stroked icons, strokes all need to be the same weight."_

**Grids:**

- **Pixel grid** = renderização limpa, todos objetos alinhados (especialmente linhas retas)
- **Optical grid** = centro de massa visual (círculos parecem menores que quadrados)
- **Padding rule:** padding ≥ stroke weight ou 2× (pra strokes 1px)

**Anatomy consistency rules:**

- Corner style (mitered/beveled/rounded) — **pick one for the set**
- Corner radius: same para base shapes; menor pra concentric interior
- End caps: rounded OR squared — consistent throughout
- Filled icons → contain filled inner shapes (não mix com stroke)

**Type rules:**

- **Product icons: 1 color (black) apenas** — _"Anything more than that and your components are going to become too complex."_
- Marketing icons: 1-2 colors max
- 3+ colors = illustration (not icon)

**Variants naming:** `icon-name/filled` ou `icon-name/stroked` (Figma convention)

**Metaphor:**

- _"Metaphors are important in icons—we use them all the time without even thinking. An icon of a house means homepage."_
- Manter clareza ao reduzir tamanho — simplificar, não shrink proporcional
- **Evitar type em icons** (idioma-agnóstico). Currency symbols: desenhar, não usar typeface

**Naming files:** pelo que MOSTRA, não pelo que representa

- ✅ `stopwatch` (não `speed`)
- ✅ `lightbulb` (não `idea`)
- ✅ `chef-hat`
- Multi-word: hífens

**Brand reflection:** _"Your icons are a reflection of your brand."_

Brand adjectives a definir per archetype:

- Hard / soft
- Casual / formal
- Luxurious / economical
- Literal / abstract

**Export:**

- SVG pra eng/design teams (editable, browser-renderable)
- PNG 1x/2x/3x pra partners externos

→ **Aplicação desafit:** alinha exatamente com nossa estratégia archetype-aware. 24px product default + 80px marketing virou canon. Stroke per archetype mantido (1.5px Editorial/Mono, 2px Soft, 2.5px Bold, 1.5px Wellness).

→ Decidir: usar Lucide-only (stroke consistente) OU permitir mix Lucide + Phosphor filled em archetypes Bold/Soft. Recomendação: Lucide dia 1, Phosphor filled JIT quando archetype Bold-Energetic ativar.

---

## 17. Categorias adicionais — Atlassian Design System (2026-05-19)

Atlassian Foundations cobre 10 categorias visuais — comparado com as 15 que listamos, **3 categorias adicionais** que merecem destaque:

### 17.1 Illustrations (separado de Iconography)

> Atlassian: _"Convey complex ideas simply."_

Distinto de ícones:

- Icons = 1-2 colors, símbolos pequenos, comunicam ação
- Illustrations = composições maiores, multi-color, comunicam conceito ou emoção

**Aplicação desafit:** empty states + onboarding + error pages frequentemente usam illustrations. Catalogar separadamente: `lib/illustrations/<archetype>/` quando JIT.

### 17.2 Logos (categoria própria)

> Atlassian: _"Visual brand/app representation."_

Não é só "imagem do logo" — é **sistema** com:

- Logo mark (símbolo isolado)
- Logo wordmark (texto da marca)
- Logo lockup (mark + wordmark juntos)
- Variants (light/dark mode, monochrome, colorida)
- Min sizes (clear space rules)
- Don't combinações

**Aplicação desafit:** já temos `<Logo>` componente (ADR-0040 §9). Atlassian sugere expandir pra sistema completo (não só wordmark texto). JIT quando designer entrar.

### 17.3 Border (separado de Radius)

> Atlassian: _"Define boundaries, separate components, and add visual emphasis."_

Já cobrimos em §7 (Borders / Hairlines). Atlassian reforça que **border é foundation separado de radius** — borders são "fronteiras visuais", radius é "geometria do corner".

### 17.4 Princípio crítico — token como SSOT

> Atlassian: _"Design tokens are the single source of truth to name and store decisions about the user interface."_

**Reforça:** nenhuma decisão de UI deve estar hardcoded fora dos tokens. Hooks (`block-token-bypass.sh`) garantem.

### 17.5 Guidelines (não-tokens) — Accessibility + Content

Atlassian agrupa em "Guidelines" 2 áreas que NÃO são tokens:

- **Accessibility** — interaction patterns, ARIA, keyboard nav, color contrast
- **Content** — voice, microcopy, tone (já coberto §3 do Loop 3 acima)

→ Estes ficam em rules (`.claude/rules/contrast.md` + futura `.claude/rules/content-strategy.md`).

### 17.6 Beta categories (Atlassian sinaliza)

- **Grid** (Beta — Atlassian ainda evoluindo)
- **Radius** (Beta — Atlassian ainda evoluindo)

→ Reforça que mesmo design systems maduros têm áreas em construção. Nosso WIP é normal.

---

## Resumo de cobertura por categoria

| Categoria          | # tokens estimado                         | Status                                |
| ------------------ | ----------------------------------------- | ------------------------------------- |
| Cores surface      | 5                                         | Auditar atual                         |
| Cores ink          | 5-10                                      | Auditar atual                         |
| Cores brand accent | 6 × 13 paletas                            | Auditar `lib/design/palettes.ts`      |
| Cores semantic     | ~24                                       | Provavelmente missing                 |
| Cores border       | 5                                         | Parcial                               |
| Cores shadow       | 1 token + per-arch                        | Missing                               |
| Famílias de fonte  | 5 slots                                   | Atual 2 (Sans + Mono)                 |
| Type scale         | 12-17                                     | Atual 3 declarados + 9 JIT            |
| Pesos              | 6                                         | Provavelmente missing tokens          |
| Line-height        | 4                                         | Auditar                               |
| Letter-spacing     | ~10                                       | Provavelmente missing                 |
| Spacing scale      | ~20                                       | Tailwind v4 cobre                     |
| Padding nomeados   | ~10                                       | Missing — magic numbers atual         |
| Gap/gutter         | 4                                         | Missing — magic numbers atual         |
| Radius             | 13                                        | Atual 8 níveis (+ gap 14px missing)   |
| Shadow             | ~15                                       | Atual 3 elevations                    |
| Motion durations   | 6                                         | Missing                               |
| Motion easings     | 6                                         | Missing                               |
| Motion stagger     | 3                                         | Missing                               |
| Borders            | 5 cores + focus                           | Parcial                               |
| Touch targets      | 3                                         | Implícito                             |
| Breakpoints        | 6                                         | Tailwind cobre                        |
| Container widths   | 3                                         | Magic numbers atual                   |
| Aspect ratios      | 6                                         | Missing tokens                        |
| Photography style  | 4 enums                                   | Missing                               |
| Component sizing   | 8-10                                      | Implícito em variants                 |
| Z-index            | 8                                         | Auditar                               |
| PWA safe-area      | 4                                         | Missing                               |
| Iconography        | 7 sizes + stroke + 4 button heights = ~12 | Missing — Lucide instalado sem tokens |
| **TOTAL estimado** | **~210 tokens**                           | **Atual ~40 tokens — gap 80%**        |

---

## Pendências

- [ ] Auditar `app/globals.css` real e contar tokens atuais
- [ ] Ler IBM Carbon token structure (eles são canônicos pra granularidade)
- [ ] Ler Atlassian foundations
- [ ] Ler Material 3 token spec
- [ ] Ler iOS HIG typography canon (SF Pro variable font axis)
- [ ] Pesquisa 28 — extrair tokens componente-específicos
- [ ] Pesquisa 30 — PWA safe-area + viewport-fit
- [ ] Decidir naming convention (`--shadow-card-1` numeric vs `--shadow-card-rest` semantic vs ambos)

---

## Princípios cravados

1. **Não simplificar** — se marca premium tem 40 raios, nossos tokens carregam 40
2. **Naming bi-modal:** tokens numéricos pra scale (`--radius-sm/md/lg`) + tokens semânticos pra uso (`--radius-card`, `--radius-button`)
3. **Tokens em CSS vars (`@theme` Tailwind v4)**, NÃO em JS const
4. **Per-archetype override via `:root[data-template="X"]`** sobrescreve tokens
5. **Per-tenant override via `:root[data-palette="Y"]`** sobrescreve cores
6. **Validação Zod compatibility matrix** runtime impede combos ruins

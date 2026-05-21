# 17. Components catalog dos 18 archetypes (Passo 2B)

> **Status:** inventário de components per archetype + overlap analysis
> **Data:** 2026-05-20
> **Input:** 18 archetypes em `15-archetype-curation.md`
> **Método:** leitura seções 4 (Component Stylings) + 8 (Responsive Behavior) dos 18 DESIGN.md em `docs/references/design-systems/<brand>/`. Apenas components **documentados explicitamente** — nada inferido.

---

## TL;DR

- **7 components universais (18/18 ou 17/18 marcas)** = core obrigatório do sistema: Button (primary + secondary), Card, Text Input, Top Nav, Footer, Hero Band, Hairline Divider.
- **~14 components common (5-14 marcas)** = decisão caso a caso: badges/pills, secondary buttons (3+ variants), feature cards tinted, pricing cards (standard + featured), code blocks, comparison tables, FAQ accordion, promo banner sticky, content band light/dark, icon-circular button, eyebrow uppercase label, segmented/pill tabs, story cards editorial, swatch dots.
- **~28 components archetype-specific (1-4 marcas)** = wrapper específico per archetype, lazy-loaded conforme `04-components-questions.md` Q7.
- **Total catálogo:** ~52 components distintos identificados nos 18 DESIGN.md (alinha com a estimativa preliminar do `04-components-questions.md`).
- **Variants extremamente divergentes** em components universais — Button isolado tem 8+ variants únicos cross-archetype (pill 60px Vodafone, pill 24px Wise, rectangle 8px Linear/Notion, rectangle 4px opencode, satellite circle Mastercard, scale(0.5) Nike, scale(0.95) Apple/Starbucks). Não dá pra unificar via prop simples — vai precisar de **layer 3-tier** (primitive shape × archetype radius × micro-interaction).

---

## Matriz components × archetypes

Legenda: `✅` documentado · `–` ausente · `✦` documentado com quirk único · `~` implícito sem spec dedicada

### Núcleo universal (15+ marcas)

| Component            | linear | notion | stripe | nike | apple | wired | spacex | mistral | wise | figma | theverge | claude | vodafone | opencode | mastercard | sanity | zapier | starbucks | **Total** |
| -------------------- | :----: | :----: | :----: | :--: | :---: | :---: | :----: | :-----: | :--: | :---: | :------: | :----: | :------: | :------: | :--------: | :----: | :----: | :-------: | :-------: |
| **Button primary**   |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ✅   |    ✅     | **18/18** |
| **Button secondary** |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ✅   |    ✅     | **18/18** |
| **Card (base)**      |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ✅   |    ✅     | **18/18** |
| **Text input**       |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ~    |    ✅     | **17/18** |
| **Top nav**          |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ~    |    ✅     | **17/18** |
| **Footer**           |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    –     |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ~    |    ✅     | **16/18** |
| **Hero band**        |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ✅   |    ✅     | **18/18** |
| **Hairline divider** |   ✅   |   ✅   |   ✅   |  ✅  |  ✅   |  ✅   |   –    |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ~    |    ✅     | **16/18** |

### Common (5-14 marcas)

| Component                           | linear | notion | stripe | nike | apple | wired | spacex | mistral | wise | figma | theverge | claude | vodafone | opencode | mastercard | sanity | zapier | starbucks | **Total** |
| ----------------------------------- | :----: | :----: | :----: | :--: | :---: | :---: | :----: | :-----: | :--: | :---: | :------: | :----: | :------: | :------: | :--------: | :----: | :----: | :-------: | :-------: |
| **Button ghost/text-link**          |   ✅   |   ✅   |   –    |  –   |  ✅   |   –   |   –    |   ✅    |  –   |  ✅   |    –     |   ✅   |    –     |    ✅    |     –      |   –    |   –    |     –     |   **7**   |
| **Button outline/tertiary**         |   –    |   ✅   |   ✅   |  –   |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |   –   |    ✅    |   –    |    ✅    |    –     |     ✅     |   ✅   |   ✅   |    ✅     |  **12**   |
| **Button icon circular**            |   –    |   –    |   –    |  ✅  |  ✅   |  ✅   |   –    |    –    |  ✅  |  ✅   |    –     |   ✅   |    ✅    |    –     |     ✅     |   –    |   –    |    ✅     |   **9**   |
| **Pricing card (standard)**         |   ✅   |   ✅   |   ✅   |  –   |   –   |   ~   |   –    |   ✅    |  –   |  ✅   |    –     |   ✅   |    –     |    –     |     –      |   –    |   ✅   |     –     |   **7**   |
| **Pricing card featured**           |   ✅   |   ✅   |   ✅   |  –   |   –   |   ~   |   –    |   ✅    |  –   |  ✅   |    –     |   ✅   |    –     |    –     |     –      |   –    |   ✅   |     –     |   **7**   |
| **Feature card tinted (color)**     |   ✅   |   ✅   |   ✅   |  –   |   –   |   –   |   –    |   ✅    |  ✅  |  ✅   |    ✅    |   ✅   |    –     |    –     |     –      |   –    |   ✅   |     –     |   **9**   |
| **Badge / pill**                    |   ✅   |   ✅   |   ✅   |  ✅  |   –   |   –   |   –    |   ✅    |  ✅  |   –   |    ✅    |   ✅   |    ✅    |    ✅    |     ✅     |   ✅   |   ✅   |    ✅     |  **13**   |
| **Promo banner sticky (top)**       |   –    |   ✅   |   –    |  –   |   –   |   –   |   –    |   ✅    |  –   |  ✅   |    –     |   –    |    –     |    –     |     –      |   –    |   –    |     –     |   **3**   |
| **Pill tabs / segmented tabs**      |   ✅   |   ✅   |   –    |  ✅  |   –   |   –   |   –    |   ✅    |  –   |  ✅   |    –     |   ✅   |    –     |    ✅    |     –      |   ✅   |   –    |    ✅     |   **9**   |
| **Eyebrow uppercase label**         |   –    |   –    |   ✅   |  ✅  |   –   |  ✅   |   ✅   |    –    |  –   |  ✅   |    ✅    |   ✅   |    ✅    |    –     |     ✅     |   ✅   |   ✅   |     –     |  **11**   |
| **Code block / IDE mockup**         |   ✅   |   –    |   ✅   |  –   |   –   |   –   |   –    |   ✅    |  –   |   –   |    –     |   ✅   |    –     |    ✅    |     –      |   ~    |   –    |     –     |   **5**   |
| **Comparison table (pricing)**      |   ~    |   ✅   |   –    |  –   |   –   |   –   |   –    |    –    |  –   |  ✅   |    –     |   –    |    –     |    –     |     –      |   –    |   –    |     –     |   **2**   |
| **FAQ accordion / disclosure row**  |   –    |   ✅   |   –    |  ✅  |   –   |   –   |   –    |   ✅    |  –   |   –   |    –     |   –    |    –     |    ✅    |     –      |   –    |   –    |    ✅     |   **5**   |
| **Testimonial card / customer row** |   ✅   |   ✅   |   –    |  –   |   –   |   –   |   –    |   ✅    |  –   |   –   |    –     |   –    |    –     |    ✅    |     –      |   –    |   –    |     –     |   **4**   |
| **Content band light/dark**         |   –    |   ✅   |   –    |  –   |  ✅   |  ✅   |   ✅   |   ✅    |  ✅  |  ✅   |    –     |   ✅   |    ✅    |    –     |     –      |   ✅   |   ✅   |    ✅     |  **11**   |
| **CTA banner / pre-footer**         |   ✅   |   ✅   |   –    |  –   |   –   |   –   |   –    |   ✅    |  –   |   –   |    –     |   ✅   |    –     |    –     |     –      |   –    |   –    |     –     |   **4**   |
| **Status badge (success/warning)**  |   ~    |   –    |   –    |  –   |   –   |   –   |   –    |    –    |  ✅  |   –   |    ✅    |   –    |    –     |    ✅    |     –      |   ✅   |   –    |     –     |   **4**   |
| **Logo wall / customer marquee**    |   ✅   |   ✅   |   –    |  –   |   –   |   –   |   –    |   ✅    |  –   |  ✅   |    –     |   –    |    –     |    –     |     –      |   –    |   –    |     –     |   **4**   |
| **Search input (pill/with icon)**   |   –    |   ✅   |   –    |  ✅  |  ✅   |   –   |   –    |    –    |  –   |   –   |    ✅    |   –    |    –     |    –     |     ✅     |   ✅   |   –    |     –     |   **6**   |

### Archetype-specific (1-4 marcas)

| Component                                   | Archetypes que documentam                             | **Total** |
| ------------------------------------------- | ----------------------------------------------------- | :-------: |
| **Color-block section panel** (pastel)      | figma                                                 |   **1**   |
| **Workspace mockup card**                   | notion, stripe                                        |   **2**   |
| **Atmospheric gradient mesh backdrop**      | stripe                                                |   **1**   |
| **Sunset stripe band (closing)**            | mistral                                               |   **1**   |
| **Campaign tile** (full-bleed editorial)    | nike, vodafone                                        |   **2**   |
| **Product card (e-commerce)**               | nike, apple, spacex (shop)                            |   **3**   |
| **Swatch dot (concentric ring active)**     | nike                                                  |   **1**   |
| **Filter chip / filter sidebar**            | nike                                                  |   **1**   |
| **Sub-nav frosted (backdrop-blur)**         | apple, nike                                           |   **2**   |
| **Floating sticky bar (running price)**     | apple                                                 |   **1**   |
| **Configurator option chip**                | apple                                                 |   **1**   |
| **Product tile alternating light/dark**     | apple                                                 |   **1**   |
| **Environment quote card**                  | apple                                                 |   **1**   |
| **Hero photo/video full-bleed**             | spacex, nike, vodafone                                |   **3**   |
| **Story card editorial (magazine)**         | wired, theverge, vodafone                             |   **3**   |
| **StoryStream timeline (rail + items)**     | theverge                                              |   **1**   |
| **Marquee strip (scrolling logos)**         | figma                                                 |   **1**   |
| **Magenta promo CTA (single-shot)**         | figma                                                 |   **1**   |
| **Currency converter card (interactive)**   | wise                                                  |   **1**   |
| **Polarity-flipped dark hero (green text)** | wise                                                  |   **1**   |
| **Speechmark logo orb**                     | vodafone                                              |   **1**   |
| **Hero TUI mockup (ASCII terminal)**        | opencode                                              |   **1**   |
| **Install snippet (mono code line)**        | opencode                                              |   **1**   |
| **Chart tile (sparse-line ASCII)**          | opencode                                              |   **1**   |
| **List row with ASCII bracket bullet**      | opencode                                              |   **1**   |
| **Satellite circular CTA (50–60px)**        | mastercard                                            |   **1**   |
| **Ghost watermark headline**                | mastercard                                            |   **1**   |
| **Decorative orbital arcs**                 | mastercard                                            |   **1**   |
| **Pill carousel card (1000px radius)**      | mastercard                                            |   **1**   |
| **Floating nav pill (rounded, detached)**   | mastercard                                            |   **1**   |
| **Coral callout-card (full-bleed)**         | claude                                                |   **1**   |
| **Code window card (editor mockup)**        | claude                                                |   **1**   |
| **Model comparison card**                   | claude                                                |   **1**   |
| **Connector tile (integrations grid)**      | claude                                                |   **1**   |
| **Frap floating circular button**           | starbucks                                             |   **1**   |
| **Floating-label input (animated)**         | starbucks                                             |   **1**   |
| **Size options selector (cup icons)**       | starbucks                                             |   **1**   |
| **Numeric stepper (−count+)**               | starbucks                                             |   **1**   |
| **Rewards cost pill (★ icon)**              | starbucks                                             |   **1**   |
| **Nutrition facts table (2-column)**        | starbucks                                             |   **1**   |
| **Store availability selector**             | starbucks                                             |   **1**   |
| **Breadcrumb (PDP)**                        | starbucks                                             |   **1**   |
| **Feedback floating tab (top-rounded)**     | starbucks                                             |   **1**   |
| **Rewards status panel (3-tier)**           | starbucks                                             |   **1**   |
| **Gift card tile (illustrated)**            | starbucks                                             |   **1**   |
| **Partnership card**                        | starbucks                                             |   **1**   |
| **Cookie consent banner**                   | mastercard, starbucks, claude (`cookie-consent-card`) |   **3**   |
| **Expander / accordion (cubic-bezier)**     | starbucks                                             |   **1**   |

---

## Components UNIVERSAIS (15+ marcas) — core do nosso sistema

Cobertura 16-18/18. **Obrigatórios em qualquer archetype** — primitive shadcn já existe ou está mapeado.

| Component        | shadcn primitive           | Variants recorrentes nas 18 marcas                                                                                                                                                               | Notas                                                                                                         |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Button primary   | `Button`                   | Cores variam por brand; shape varia entre `pill` (figma/wise/mastercard/sanity/vodafone/apple), `md radius` (linear/notion/claude/zapier 8-12px), `sm radius` (opencode 4px), `rect 0` (wired)   | Shape NÃO é mappable por size prop — é decisão de archetype                                                   |
| Button secondary | `Button variant="outline"` | Sempre outlined/ghost/text-link; ~3 padrões: outline ink, outline brand, surface-soft                                                                                                            | Cada archetype escolhe 1-2 patterns; mapping native→canonical em Passo 4                                      |
| Card (base)      | `Card`                     | Padding varia 16-32px; border vs surface-soft fill (Nike: zero border + studio-gray studio)                                                                                                      | Brand decide via: "border-fill" (linear/figma/claude) ou "surface-fill" (notion/wise/zapier)                  |
| Text input       | `Input`                    | Geometry sempre rectangle; focus signal varia (ring, border swap, halo, surface flip)                                                                                                            | Apple/Mastercard usam pill input — exceção que vira archetype-specific variant                                |
| Top nav          | shadcn block               | Layout: logo left + links + CTA right. Heights 44-99px. Mastercard floating pill = exceção                                                                                                       | Mobile collapse = universal hamburger pattern em 17/18                                                        |
| Footer           | shadcn block               | Multi-column link grid (4-6 col → 1 col mobile). 16/18 documentam                                                                                                                                | Surface: light/cream (notion/figma/mistral/zapier) OU dark/ink (linear/wise/claude/vodafone/starbucks/sanity) |
| Hero band        | custom                     | Sempre 1 stand-out (text + media). Padrões: full-bleed photo (nike/spacex/apple/vodafone), gradient/atmospheric (stripe/mistral), text-only (linear/wired/opencode/sanity), TUI ascii (opencode) | Diversidade extrema — provavelmente vira **template hero per archetype**, não 1 componente unificado          |
| Hairline divider | `Separator`                | 1px solid sempre; cor varia (hairline token per archetype)                                                                                                                                       | Trivial unificar via role `--role-border-default`                                                             |

**Decisão crítica:** Button universal não é unificável só por prop. Vai precisar de **camada de archetype shape config** que injeta radius/padding/scale-active baseado em `data-template=*`. Ver Passo 8 (audit primitives).

---

## Components COMMON (5-14 marcas) — decisão caso a caso

| Component                      | Aparece em                                                                                                               |     Wrapper genérico viável?      | Notas                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | :-------------------------------: | ------------------------------------------------------------------------ |
| Badge / pill                   | 13/18 (notion, stripe, nike, mistral, wise, theverge, claude, vodafone, opencode, mastercard, sanity, zapier, starbucks) |         ✅ shadcn `Badge`         | Variants: full-pill vs square chip; brand cor + 1px outline patterns     |
| Button outline / tertiary      | 12/18                                                                                                                    |                ✅                 | shadcn variant cobre; archetype escolhe quando aparece                   |
| Eyebrow uppercase label        | 11/18                                                                                                                    |        ✅ custom primitive        | Tracking + uppercase + caps weight — vira `<Eyebrow>` typography prim    |
| Content band light/dark        | 11/18                                                                                                                    |        ✅ section wrapper         | Polarity-flip cream/ink é pattern recorrente — Wise/Zapier/Starbucks     |
| Button icon-circular           | 9/18 (nike, apple, wired, wise, figma, claude, vodafone, mastercard, starbucks)                                          |         ✅ shadcn pattern         | Sizes 36-60px; archetype define background (soft-cloud/parchment/canvas) |
| Feature card tinted            | 9/18                                                                                                                     |          ✅ Card variant          | Cor surface vem de archetype palette (notion 7 tints, figma 7 blocks)    |
| Pill tabs / segmented tabs     | 9/18                                                                                                                     |         ✅ shadcn `Tabs`          | Linear/figma usam pill+filled; nike/claude usam segmented+underline      |
| Pricing card (standard)        | 7/18                                                                                                                     |            ✅ pattern             | Sempre: title + price + features list + CTA                              |
| Pricing card featured          | 7/18                                                                                                                     |    ✅ pattern (polarity flip)     | Stripe/Claude/Wise: featured = inverted dark surface                     |
| Button ghost / text-link       | 7/18                                                                                                                     | ✅ shadcn `Button variant="link"` | Apple/Claude usam cor brand inline; outros usam ink                      |
| Search input                   | 6/18 (notion, nike, apple, theverge, mastercard, sanity)                                                                 |         ✅ Input variant          | Nike/Apple/Mastercard: pill-shape (vs Apple input pill exception)        |
| Code block / IDE mockup        | 5/18 (linear, stripe, mistral, claude, opencode)                                                                         |        ✅ archetype-aware         | Mono font; bg dark com inner-block; line numbers opcional                |
| FAQ accordion / disclosure row | 5/18 (notion, nike, mistral, opencode, starbucks)                                                                        |       ✅ shadcn `Accordion`       | Chevron vs ASCII bracket vs starbucks cubic-bezier — micro-quirks        |
| Testimonial card               | 4/18 (linear, notion, mistral, opencode)                                                                                 |          ✅ Card variant          | Avatar + name + role + quote — pattern estável                           |
| CTA banner pre-footer          | 4/18 (linear, notion, mistral, claude)                                                                                   |        ✅ section wrapper         | Claude: coral callout; Mistral: cream + editorial serif h2               |
| Logo wall                      | 4/18 (linear, notion, mistral, figma)                                                                                    |            ✅ pattern             | Wordmark cells 60-80px height + lazy load                                |
| Cookie consent banner          | 3/18 (mastercard, starbucks, claude)                                                                                     | ✅ CookieConsent v3 (pesquisa 24) | Orange consent (mastercard) vs cookie-card dark (claude)                 |
| Promo banner sticky (top)      | 3/18 (notion, mistral, figma)                                                                                            |            ✅ wrapper             | Always full-width above nav, sticky                                      |
| Status badge (semantic)        | 4/18 (linear, wise, theverge, opencode, sanity)                                                                          |         ✅ Badge variant          | Wise é único com positive+negative explicit (fintech)                    |
| Comparison table               | 2/18 (notion, figma)                                                                                                     |            ⚠️ pattern             | Aparece só em SaaS pricing — table primitive shadcn cobre                |

---

## Components ARCHETYPE-SPECIFIC (1-4 marcas) — wrappers per archetype

Pra cada quirk único, listo (archetype, descrição, wrapper proposto).

### Nike (athletic commerce)

- **Campaign tile** — full-bleed photography + uppercase Futura headline burned in + ghost outline pill anchored bottom-left. **Wrapper:** `<NikeCampaignTile>` (lazy-loaded só em archetype `bold-athletic`).
- **Swatch dot (concentric ring active)** — 12px circle, active = 2px black outer ring + 2px white interior gap. **Wrapper:** `<SwatchDot>` exclusivo do archetype Nike.
- **Filter chip + filter sidebar** — chip flips inverted black on active; sidebar é signature PLP. **Wrapper:** `<NikeFilterRail>` archetype-specific.
- **Press feedback `scale(0.5)`** — universal Nike "tap collapse" em todo button-primary-active. **Implementação:** archetype config injeta `data-press-scale="0.5"` em `<AppButton>` quando `data-template="bold-athletic"`.

### Apple (museum-gallery)

- **Product tile alternating light/dark** — full-bleed tiles que se alternam pra criar ritmo. **Wrapper:** `<AlternatingProductTile>` (parametriza polarity).
- **Sub-nav frosted (backdrop-blur)** — frosted glass 80% opacity sticky sub-nav. **Wrapper:** `<FrostedSubNav>` archetype-specific.
- **Floating sticky bar (running price)** — buy-page configurator bar floating bottom. **Wrapper:** `<StickyConfiguratorBar>`.
- **Configurator option chip** — grid de chips com thumb + label + price delta + selected ring. **Wrapper:** `<ConfiguratorChip>` (mapeia pra Tesla/Apple future).
- **`scale(0.95)` micro-interaction** — universal Apple press state. **Implementação:** archetype config como Nike `scale(0.5)`.

### Stripe (fintech infrastructure)

- **Atmospheric gradient mesh backdrop** — pastel cream → sherbet → lavender → indigo → ruby blur across hero upper-third. **Wrapper:** `<GradientMeshHero>` (template hero per archetype).
- **Composited dashboard mockup** — multi-layer faux product UI (IDE + table + chart card). **Wrapper:** `<CompositedDashboardMockup>` Stripe-specific signature.
- **Tabular numerics money type** — `font-feature-settings: "tnum"` em todo dinheiro. **Implementação:** typography primitive `<Money>` global, não wrapper.

### Mistral (AI sunset)

- **Sunset stripe band closing** — horizontal multi-stop gradient at page bottom. **Wrapper:** `<SunsetStripeBand>` exclusivo archetype `warm-sunset`.
- **Hero band sunset (gradient + mountain)** — atmospheric backdrop + photo overlap. **Wrapper:** template hero per archetype.

### Figma (monochrome + color blocks)

- **Color-block section panel** — 7 color variants (lime/lilac/navy/cream/mint/pink/coral), full-content-width, rounded `lg`, padding `xxl`. **Wrapper:** `<ColorBlockSection>` archetype-specific.
- **Marquee strip (scrolling logos)** — thin black ribbon under nav, white logos scrolling horizontally. **Wrapper:** `<LogoMarquee>`.
- **Magenta promo CTA (single-shot)** — saturated pink pill, 1 per page max. **Wrapper:** `<MagentaPromoButton>` rare-use variant.

### The Verge (brutalist editorial)

- **StoryStream timeline** — vertical rail (1px dashed/solid) + timestamps + pill-cornered body cards stacked. **Wrapper:** `<StoryStream>` exclusivo archetype `brutalist-editorial`.
- **Magazine story card (color-block fill)** — saturated accent fill (mint/purple/yellow/pink/orange/white) + color-as-elevation. **Wrapper:** `<MagazineStoryCard>` variants.

### Wise (fintech magazine)

- **Currency converter card** — interactive widget from/to amount + currency. **Wrapper:** `<CurrencyConverterWidget>` financial verticals only.
- **Polarity-flipped dark hero** — `colors.ink` background + Wise green headline. **Wrapper:** template hero per archetype.

### Vodafone (corporate telecom)

- **Speechmark logo orb** — red square hosting quotation-mark icon, brand visual anchor. **Wrapper:** `<SpeechmarkOrb>` exclusivo Vodafone-style.
- **Hero band red (rare)** — full-bleed red surface as alternative hero. **Wrapper:** template hero variant.

### opencode (terminal mono)

- **Hero TUI mockup** — full-bleed dark surface + ASCII block-pixel wordmark + tui-prompt-row + keybinding-hint. **Wrapper:** `<TuiMockup>` archetype `terminal-mono` only.
- **Install snippet (mono code line)** — code block com 1 linha + copy icon. **Wrapper:** `<InstallSnippet>` variant of code-block.
- **List row with ASCII bracket bullet** — `[+]` `[-]` `[x]` markers como bullets. **Wrapper:** `<AsciiBulletList>` archetype-specific.
- **Chart tile (sparse-line ASCII)** — abstract dotted plot, never specific data. **Wrapper:** `<AsciiChartTile>`.

### Mastercard (orbital luxury)

- **Satellite circular CTA** — white circular CTA (50-60px) attached bottom-right of circular portrait, protruding 40% outside. **Wrapper:** `<SatelliteCTA>` only with `<CircularPortrait>`.
- **Ghost watermark headline** — 72-128px cream-on-cream MarkForMC weight 500, behind portrait circles. **Wrapper:** `<GhostWatermarkHeadline>`.
- **Decorative orbital arcs** — 1-1.5px Light Signal Orange curved lines between portraits. **Wrapper:** `<OrbitalArc>` SVG decorative.
- **Pill carousel card (1000px radius)** — portrait-pill orientation, full-bleed photo + overlaid chips. **Wrapper:** `<PillCarouselCard>` mastercard-style.
- **Floating nav pill (detached)** — nav as rounded white pill 24px below viewport top. **Wrapper:** archetype template `<FloatingPillNav>`.

### Claude (humanist warm)

- **Coral callout-card (full-bleed)** — full-bleed coral surface CTA, inverted button inside. **Wrapper:** `<CoralCalloutCard>` Claude-style.
- **Code window card (editor mockup)** — dark editor with line numbers + JetBrains Mono + Run button. **Wrapper:** `<CodeWindowMockup>` variant of code-block.
- **Model comparison card** — Opus/Sonnet/Haiku comparison. **Wrapper:** generic pricing-card variant.
- **Connector tile (integrations grid)** — logo + name + description tile. **Wrapper:** `<IntegrationTile>` generic.

### Starbucks (retail green)

- **Frap floating circular button** — 56px fixed bottom-right, signature elevation element. **Wrapper:** `<FloatingActionButton>` (FAB pattern para retail/e-commerce).
- **Floating-label input** — animated label translates up on focus/fill, cubic-bezier(0.32, 2.32, 0.61, 0.27) overshoot. **Wrapper:** `<FloatingLabelInput>` archetype-specific.
- **Size options selector (cup icons)** — horizontal row de cup-icon buttons, active = ring outline. **Wrapper:** `<IconRowSelector>` generic for size/option selection.
- **Numeric stepper** — `−` count `+`. **Wrapper:** `<NumericStepper>` shadcn gap candidate.
- **Rewards cost pill (★ icon)** — outlined gold pill with star glyph. **Wrapper:** `<RewardsCostPill>` retail-specific.
- **Nutrition facts table** — regulation-compliant 2-column table. **Wrapper:** `<DataFactsTable>` regulatory pattern.
- **Store availability selector** — full-width rounded rect on dark band. **Wrapper:** retail-specific.
- **Breadcrumb (PDP)** — `Menu / Category / Product` trail. **Wrapper:** shadcn `Breadcrumb` covers; archetype only colors.
- **Gift card tile (illustrated)** — illustrated photograph as entire surface. **Wrapper:** `<GiftCardTile>`.
- **Rewards status panel (3-tier)** — Bronze/Silver/Gold dark-green panels with gradient header. **Wrapper:** `<TierStatusPanel>`.

---

## Variants per component — patterns recorrentes

### Button — variants das 18 marcas

**Sizes detectados:**

- Small (~32px height) — opencode (`button-primary` ~36px), notion `button-ghost` (32px)
- Medium (~40px height) — linear, notion, claude, vodafone, opencode, sanity — padrão dominante
- Large (~48px height) — nike (48px pill), apple `button-store-hero` (52px), mistral, mastercard
- XL — wise hero CTA, starbucks Frap (56px circular)

**Shape variants:**

| Shape                 | Archetypes                                                                                                                                                     | Quirk único                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `rect 0` (square)     | wired                                                                                                                                                          | wired exclusivo — magazine print |
| `rect 4` (radius xs)  | opencode, sanity ghost                                                                                                                                         | Terminal/utility feel            |
| `rect 8` (radius md)  | linear, notion, claude, mistral, zapier                                                                                                                        | "Friendly geometric" rectangle   |
| `rect 12` (radius lg) | zapier (signature)                                                                                                                                             |                                  |
| `rect 20` (radius xl) | mastercard primary (signature)                                                                                                                                 | "Pill-flavored rectangle"        |
| `pill 24+`            | wise (24px), stripe (9999), figma (9999), apple (9999), sanity (9999), starbucks (50px), nike (30px), spacex (32px), vodafone (60px), mastercard pill (1000px) | Maioria das marcas usa full-pill |

**Variants funcionais:**

- `primary` — 18/18 (cor varia, shape varia)
- `secondary` — 18/18 (outline OU surface-soft)
- `tertiary/ghost/text-link` — 12/18 (apple, claude, notion, opencode, mistral, vodafone, etc)
- `outline` — 12/18
- `destructive` — 0/18 explicitamente! Não há archetype que documenta `destructive` em landing — é product-only
- `pill rounded` — 10/18 (default em fintech + automotive + retail)
- `icon-circular` — 9/18

**Quirks únicos:**

- **Nike** `button-primary-active`: `transform: scale(0.5)` + `opacity 0.5` (tap collapse)
- **Apple** `button-primary-active`: `transform: scale(0.95)` (system-wide micro-interaction)
- **Starbucks** `buttonActiveScale`: `transform: scale(0.95)` (idem Apple)
- **Mastercard** satellite CTA: protrudes 40% outside parent portrait circle
- **Figma** `button-magenta-promo`: single-shot rule (1 per page max)
- **opencode** `button-tab-active`: 2px ash bottom underline (terminal-feel selection)

### Card — variants das 18 marcas

**Backgrounds:**

- `canvas` (white/cream) — universal default
- `surface-card` (tinted soft) — notion (peach/rose/mint/lavender/sky/yellow/cream), figma (lime/lilac/navy/cream/mint/pink/coral), claude (cream `#efe9de`)
- `ink` (dark inverted) — wise dark feature, claude product-mockup-dark, sanity dark, zapier dark
- `accent fill` (saturated) — theverge color-block tiles, claude callout-card-coral
- `photographic` (full-bleed) — nike campaign-tile, mistral photographic, spacex card-photo-band

**Borders:**

- Hairline 1px (universal — 16/18)
- Zero border + surface-fill (nike, mistral cream cards)
- 2px brand-color border featured tier (notion, mistral, claude)

**Shadows:**

- Zero shadow (linear, nike, theverge, spacex, opencode, sanity) — color-as-elevation
- Subtle ~0.04 opacity (mistral, zapier, mastercard) — atmospheric cushioning
- Layered stack (starbucks) — multi-shadow product-card feel
- Heavy 0.20 deep (notion workspace-mockup-card) — exclusivo product UI mockups

### Input — variants das 18 marcas

**Shape:**

- `radius sm` (4-6px) — sanity, opencode, wired (0px), claude, linear, notion, stripe, mistral, vodafone, wise, theverge (2px), starbucks (4px add-in select)
- `radius md` (8-12px) — figma, claude, apple text-input
- `pill` (9999) — apple search-input, mastercard search expanded, nike search-pill

**Focus signal:**

- Border swap to primary (linear, notion, stripe, mistral, claude, opencode)
- Outer halo/ring (nike soft-cloud halo, sanity blue ring, claude coral 15% alpha)
- Surface flip (opencode flips bg canvas → soft when focused)
- Floating label animation (starbucks signature — cubic-bezier overshoot)

### Top Nav — variants das 18 marcas

**Heights:**

- 36-44px — linear (56), spacex, apple global-nav (44)
- 56-64px — notion (64), nike (56-64), claude (64), opencode (56), zapier
- Progressive (starbucks: 64→72→83→99 across breakpoints) — exclusivo

**Sticky behavior:**

- Standard sticky — 17/18
- Floating pill detached (mastercard) — único caso

**Mobile collapse:**

- Universal hamburger pattern em todas 17/18 que documentam — abaixo de 768-960px

---

## Components NÃO cobertos por shadcn — gaps pra registries / custom

Lista de components encontrados nas 18 que **shadcn core não tem** ou tem só primitive parcial:

### Cobertos por Origin UI / shadcnblocks (provavelmente)

- Promo banner sticky (top)
- Logo wall / customer marquee
- Marquee strip (scrolling logos)
- CTA banner pre-footer
- Pricing card + featured (shadcn block existe)
- Search pill (Nike/Mastercard style)
- Floating-label input (Starbucks animado)

### Provavelmente Aceternity / Magic UI

- Atmospheric gradient mesh backdrop (stripe)
- Sunset stripe band (mistral)
- StoryStream timeline (theverge)
- Decorative orbital arcs SVG (mastercard)
- Composited dashboard mockup (stripe/claude)
- Press feedback `scale(0.5)`/`scale(0.95)` (nike/apple/starbucks)

### Provavelmente Kibo UI

- Numeric stepper (starbucks `−` count `+`)
- Filter chip + filter sidebar (nike)
- Configurator option chip (apple)
- Floating sticky bar running price (apple)

### CUSTOM obrigatório

- Hero TUI mockup ASCII (opencode)
- Ghost watermark headline (mastercard)
- Satellite circular CTA (mastercard)
- Speechmark logo orb (vodafone)
- Color-block section panel (figma — 7 colors)
- Feature card tinted N-colors (notion 7, claude 1, figma 7)
- Eyebrow uppercase label (typography primitive)
- Frap floating circular button (starbucks)
- Cookie consent banner com archetype-aware spacing (LGPD/GDPR)

---

## Top-5 components archetype-specific mais interessantes (quirks únicos)

1. **Mastercard Satellite Circular CTA** — white circle 50-60px protruding 40% outside parent circular portrait, paired com decorative orbital arcs em Light Signal Orange. Vocabulário visual único cross-tenant: implica "connection between things" sem usar setas explícitas. Vira `<SatelliteCTA>` + `<OrbitalArc>` archetype-specific.

2. **opencode Hero TUI Mockup** — single-font Berkeley Mono em TUDO, hero é faux-terminal ASCII command line com keybinding-hint row. NÃO há raster image no sistema inteiro. Pattern intransferível pra outros archetypes mas signature absoluta de "dev-niche identity".

3. **Nike `button-primary-active` `scale(0.5)`** — single press feedback que define a inteira voz "athletic kinetic" da marca. Apple/Starbucks usam `scale(0.95)` mais sutil. Nike é 2x mais agressivo — implementação requer `data-press-scale` archetype config.

4. **The Verge StoryStream Timeline** — vertical rail 1px (dashed ou solid) com timestamps mono UPPERCASE + pill-cornered body cards stacked, interleaved com full-bleed color-block tiles que "quebram" o ritmo do timeline. Pattern editorial bruto: rare pattern fora de magazine-tech.

5. **Starbucks Frap Floating Circular Button** — 56px green circular FAB fixed bottom-right com `-0.8rem touch offset` pra extra tap comfort + shadow stack layered. Persistente em toda navegação. É **único FAB documentado nas 18** — pattern Material/mobile que aparece somente em retail-commerce archetype.

---

## Top-5 components universais com variantes muito diferentes (precisam tratamento especial)

1. **Button primary** — shape varia entre 7+ patterns (rect 0px wired → rect 4px opencode → rect 8px linear/notion → rect 12px zapier → rect 20px mastercard → pill 24px wise → pill 30px nike → pill 50px+ stripe/figma/apple/sanity/vodafone/starbucks/mastercard). Padding também varia 4x. Press state varia 3x (none, scale(0.95), scale(0.5)). **Não unificável por size prop** — exige archetype config layer.

2. **Hero band** — desde "text + zero photography" (wired/opencode/linear) até "full-bleed photography" (nike/spacex/vodafone) até "atmospheric gradient" (stripe/mistral). Layouts: 6-6 grid claude, asymmetric mastercard, alternating apple, full-overlap nike. Provavelmente vira **template hero per archetype**, não 1 componente unificado.

3. **Footer** — surface tone varia entre 6 patterns: light cream (notion/figma/mistral/zapier), dark ink (linear/wise/vodafone/starbucks/sanity), pure black (wired primary fill), navy (claude), photographic (spacex). Coluna count 4-6. Mastercard tem altura 148px bottom só pra "tall space" — quirk único.

4. **Top nav** — heights variam 36-99px progressive. Layout positioning varia (sticky standard vs floating pill detached vs frosted backdrop-blur). Mobile collapse universal mas trigger varia 640-960px. Mastercard floating pill = quase um component diferente.

5. **Card** — backgrounds 5 patterns (canvas, surface-card tinted, ink, accent fill, photographic). Border 3 patterns (hairline 1px, zero, accent 2px). Shadow 4 patterns (zero, subtle 0.04, atmospheric 0.08 large-spread, layered stack starbucks). Padding 16-48px. Cada archetype define sua "card identity" — Card precisa **5 variants base** parametrizados por archetype config.

---

## Estimativa de wrappers archetype-aware necessários

**Implementação proposta seguindo Q3 do `04-components-questions.md` (decisão: 1 wrapper + archetype config):**

| Tier                                      | Count          | Estratégia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn primitive direto** (sem wrapper) | ~18 components | Button, Card, Input, Badge, Breadcrumb, Pagination, Tabs, Separator, Accordion, Tooltip, Popover, Dialog, Sheet, Skeleton, Progress, Sonner, Checkbox, RadioGroup                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **AppX wrapper composto archetype-aware** | ~12 components | AppButton (archetype config injeta radius/padding/press-scale), AppCard (5 variants base), AppInput (focus signal varia), AppEyebrow (typography primitive), AppHeroBand (template per archetype), AppFooter, AppTopNav, AppPromoBanner, AppCTABanner, AppFeatureCard, AppPricingCard, AppCodeBlock                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Archetype-specific lazy-load wrappers** | ~20 components | Nike: CampaignTile, SwatchDot, FilterRail, Press feedback config. Apple: AlternatingProductTile, FrostedSubNav, StickyConfiguratorBar, ConfiguratorChip. Stripe: GradientMeshHero, CompositedDashboardMockup, Money. Mistral: SunsetStripeBand. Figma: ColorBlockSection, LogoMarquee, MagentaPromoButton. The Verge: StoryStream, MagazineStoryCard. Wise: CurrencyConverterWidget. Vodafone: SpeechmarkOrb. opencode: TuiMockup, InstallSnippet, AsciiBulletList, AsciiChartTile. Mastercard: SatelliteCTA, OrbitalArc, GhostWatermarkHeadline, PillCarouselCard, FloatingPillNav. Claude: CoralCalloutCard, CodeWindowMockup. Starbucks: Frap (FAB pattern), FloatingLabelInput, IconRowSelector, NumericStepper, RewardsCostPill, GiftCardTile, TierStatusPanel |

**Total estimado:** ~50 components no catálogo final, mas **só ~18 shadcn primitives + 12 AppX wrappers obrigatórios desde dia 1**. Os ~20 archetype-specific entram **lazy-load conforme archetype ativo** (Q7 do components-questions: `lib/components/<archetype>/*.tsx`).

---

## Recomendações pra Passos 2C + 8

### Passo 2C (shadcn registries audit) — lista priorizada

**Buscar PRIMEIRO em registries:**

1. Origin UI — multi-select, time picker, color picker, file upload, floating-label input, search pill, hero blocks marketing, promo banner sticky, marquee/logo wall, CTA banner pre-footer, pricing cards
2. shadcnblocks — pricing cards (standard + featured), testimonials, FAQ accordion, hero blocks, comparison tables
3. Aceternity UI / Magic UI — gradient mesh, atmospheric backdrops, scale-press animations, scroll-driven heroes
4. Kibo UI — numeric stepper, filter chip + sidebar, configurator chip, sticky bottom bar
5. Reui — eyebrow primitives, breadcrumb variants

**Components que provavelmente vão precisar CUSTOM dev:**

- Hero TUI mockup ASCII (opencode)
- StoryStream timeline (theverge)
- Satellite CTA + orbital arcs (mastercard)
- Speechmark logo orb (vodafone)
- Color-block section panel 7 variants (figma)
- Currency converter widget (wise)
- Frap FAB com touch-offset (starbucks)
- Floating label input cubic-bezier (starbucks)

### Passo 8 (audit 53 primitives)

**Primitives shadcn que provavelmente precisam wrapper archetype-aware:**

1. `Button` — radius + padding + press-scale variam 7+ patterns ✦ CRÍTICO
2. `Card` — 5 patterns base (canvas/tinted/ink/accent/photo) ✦ CRÍTICO
3. `Input` — focus signal varia 4 patterns ✦
4. `Badge` — shape varia (pill vs chip) ✦
5. `Tabs` — pill vs segmented (Linear vs Nike vs opencode bottom-underline) ✦
6. `Accordion` — chevron vs ASCII bracket vs cubic-bezier overshoot (starbucks) ✦
7. `Separator` — hairline color varia mas trivial via role ✦
8. `Tooltip` — não documentado nas 18 (provavelmente uniforme; baixa prioridade)

**Primitives shadcn que provavelmente passam SEM mudança:**

- Skeleton, Progress, Spinner, Sonner (toast), Checkbox, RadioGroup, Switch, Slider, Calendar, InputOTP, Avatar, Sheet, Drawer, Dialog, Popover, ButtonGroup, Combobox, Command, Pagination, Field, Item, Kbd

**Próximo agent (Passo 2C):** consumir essa lista como input pra audit Origin UI / Kibo / Aceternity / shadcnblocks / Magic UI coverage. Output em `18-shadcn-registries-final.md`.

---

## Adições mobile-first — archetypes 19-22 (cobertura complementar)

Esses 4 archetypes não estavam no set original de 18. Trazem patterns exclusivamente mobile-native não cobertos acima.

| Archetype | Marca     | Unique pattern                                                                               |
| --------- | --------- | -------------------------------------------------------------------------------------------- |
| 19        | spotify   | Persistent bottom player bar · Bottom-tab 4 items · App-like dark canvas                     |
| 20        | airbnb    | Sticky-bottom CTA bar (booking) · Date-picker calendar grid (40×40px) · Booking flow mobile  |
| 21        | meta      | Sticky-bottom buy-rail (cobalt only commerce) · Dual-CTA hero pattern · PDP with cobalt gate |
| 22        | pinterest | Masonry grid container · Full-screen bottom-sheet modal · Search pill collapse/expand        |

**Components únicos introduzidos por esses archetypes:**

- `BottomPlayerBar` — persistent media bar com track info + controls (spotify)
- `StickyBottomCTA` — barra inferior floating com action button (airbnb, meta) → mapeado em Core 9 como `AppStickyCTA` (D-13)
- `MasonryGrid` — container CSS columns + pin tiles 16px radius (pinterest)
- `BottomSheetModal` — sheet iOS-style com handle + radius topo (pinterest, com precedência airbnb)
- `DatePickerCalendar` — grid 40×40px cells com `--accent-subtle` selected state (airbnb)

Para detalhes de tokens/mapping: `docs/design-system/20-naming-mappings.md` §19-22.

---

## Pendências fechadas após este passo

- ✅ Pesquisa 28 substituída por audit Passo 2B (este doc)
- ✅ Decidir Q3 (`04-components-questions.md`): 1 wrapper + archetype config wins — ver Passo 8
- ✅ Decidir Q4: catálogo completo de variants encontrados — registrado nesta tabela
- ✅ Identificar archetype-specific lazy-load: 20 components catalogados acima
- ⏳ Pendente: decidir Q2 (responsive vs separate components) — Passo 8
- ⏳ Pendente: decidir Q8 (tenant customization granular) — Fase 2

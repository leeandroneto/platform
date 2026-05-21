# 29. Token model decisions — naming, layers, domains

> **Status:** recomendações fundamentadas em research externa + decisões já cravadas (D-43)
> **Última atualização:** 2026-05-20
> **Tipo:** input pra promoção em `12-decisions-resolved.md` + ADR-NN + `rules/design-tokens.md`
> **Escopo:** D-01, D-04, D-05, D-21, D-22, D-29, D-30, D-31, D-32, D-33 + B1-B6 + C1-C3
> **Não é ADR.** Quando user assinar cada decisão, promover individualmente.

---

## Premissas universais que atravessam todas as decisões

1. **APCA Silver é gate obrigatório de build** (`prebuild` script bloqueia regressão). Toda decisão que afeta cor precisa respeitar isso ou é rejeitada antes do merge.
2. **D-43 já cravou 29 semantic roles em 3 tiers** (core/extended/novos). Componentes USAM roles, não raw tokens. Qualquer decisão abaixo respeita esse contrato.
3. **5 eixos não negociáveis:** Archetype (1) · Palette (2) · Typography (3) · Tom de voz (4) · Mood por seção (5).
4. **Profissional NÃO É designer.** Customização tenant é estratégica (escolher archetype + palette + typography), não tática (ajustar radius, shadow, density). Tudo que pedir conhecimento de design vai pra "advanced" ou inexiste.
5. **Stack travado:** Tailwind v4 `@theme` (CSS-first, sem `tailwind.config.js`) · OKLCH · Motion 12 (`motion/react`) · shadcn new-york dark-first.
6. **Sistema 23 archetypes + 13 paletas + N typografias = configuração combinatorial.** Qualquer eixo extra vira N×M×... combos que precisam validar APCA. Aumento de dimensões = aumento exponencial de superfície de teste.

---

## D-01 / B1 — Density: travada por archetype ou eixo independente?

**Recomendação:** **Opção A — DNA do archetype (density absorvida no Eixo 1)**, com sub-cláusula B presente como component-level `size` prop (`sm/md/lg`) opcional dentro do range que o archetype define.

**Confiança:** **Alta**

**Raciocínio:**

- A pesquisa 27 já refutou empiricamente a hipótese "density como 4ª dimensão configurável" (registrado em `11-decisions-pending.md` na tabela de hipóteses caídas). Linear é dense porque a identidade Linear É densa; afrouxar destrói o archetype.
- Profissional não-designer não tem repertório pra escolher "compacto vs confortável" coerentemente — isso vira UX desert (vide pesquisa de marca: muitos archetypes são INTRINSECAMENTE densos ou espaçosos, não tem como Notion virar dense sem virar Linear).
- Shopify Polaris v12 introduziu "increased density" como mudança da v12 INTEIRA, não como toggle por componente — confirma que density é propriedade de archetype/sistema, não de tenant.
- Stripe é o caso citado de "B funciona": eles têm size props `sm/md/lg`. Funciona porque Stripe é UM archetype só. Em arquitetura multi-archetype, o tenant escolhe Linear ESPERANDO densidade Linear.
- Cláusula adicional: cada componente declara `size?: 'sm' | 'md' | 'lg'` com `md` default; archetype define os 3 valores. Notion-archetype `sm=10px, md=14px, lg=18px`; Linear-archetype `sm=8px, md=10px, lg=14px`. Mesma API, valores diferentes — não polui o vocabulário do tenant.

**Referência externa:**

- Polaris v12 introduziu density como decisão de sistema, não exposed token de tenant ([Version 12 — Shopify Polaris React](https://polaris-react.shopify.com/previous-releases/version-12))
- Material 3 trata `comfortable/standard/compact` como "density configuration" que é declarado por aplicação inteira, não por usuário

**O que esta decisão desbloqueia:**

- `lib/design/archetypes/<name>/spacing.ts` — cada archetype declara seu `--space-*` ladder
- API de componentes `size?: Size` — único point de exposure de density
- Schema banco — NÃO adicionar `tenants.density` coluna (eliminado)
- Storybook stories podem renderizar archetype × size matrix (não archetype × density × size)

**Risco se errar:**

- Se virar Opção B (eixo 6 configurável): 23 archetypes × 3 densities × 13 palettes × N tipografias = explosão combinatorial. APCA Silver validation precisa rodar em N⁴. Build vira inviável.
- Se ficar travado demais (sem cláusula `size`): componentes não conseguem expressar hierarquia local ("este card é mais compacto que o do feed"), todo o UI vira monolítico.

---

## D-04 / B2 — Grid/layout tokens: por archetype ou global?

**Recomendação:** **Opção A — por archetype**, com 3 valores estruturais (`narrow/default/wide`) que cada archetype mapeia. Tenant não muda, archetype escolhe qual é o default + qual range respeita.

**Confiança:** **Alta**

**Raciocínio:**

- Grid/layout é parte da IDENTIDADE visual: Stripe (1080 narrow, conteúdo denso) ≠ Nike (1440 full-bleed, photography-driven) ≠ Notion (1280 documento). Trocar grid de archetype = trocar archetype.
- Ant Design opera 1168px / 24-col fixed — funciona porque Ant É UM archetype só. Mesmo problema que density: multi-archetype precisa de variação.
- Carbon 2x Grid usa scale baseado em multiples of 2/4/8 com layout tokens que se adaptam por contexto — confirma que grid é propriedade de sistema, não de página.
- Page-level override (Opção B) só faz sentido em editorial layout (landing, marketing) — para isso já temos **Eixo 5 (Mood por seção)** que pode declarar `--layout-max-width: var(--layout-wide)` localmente. Eixo 5 cobre o caso "esta seção quebra a regra".
- Pattern recomendado:
  ```css
  :root[data-archetype='minimal-vercel'] {
    --layout-max-width: var(--layout-narrow); /* 1080 */
    --layout-gutter: var(--space-6);
  }
  :root[data-archetype='bold-nike'] {
    --layout-max-width: var(--layout-wide); /* 1440 */
    --layout-gutter: var(--space-8);
  }
  /* Tokens estruturais universais (referência) */
  :root {
    --layout-narrow: 1080px;
    --layout-default: 1280px;
    --layout-wide: 1440px;
    --layout-full: 100vw;
  }
  ```

**Referência externa:**

- Ant Design 24-col grid system (1168px content) — sistema single-archetype ([Grid - Ant Design](https://ant.design/components/grid/))
- Carbon 2x Grid com spacing tokens adaptativos ([Spacing – Carbon Design System](https://carbondesignsystem.com/elements/spacing/overview/))

**O que esta decisão desbloqueia:**

- `lib/design/tokens/layout.ts` — 4 valores universais (`narrow/default/wide/full`)
- Cada archetype declara seu default + range permitido pra Eixo 5 (Mood)
- Page builder pode oferecer "Wide layout" toggle dentro do range do archetype
- Tokens responsivos (`--layout-max-width`, `--layout-gutter`) ganham par mobile/desktop por archetype

**Risco se errar:**

- Se for global único (Opção B padrão): Notion e Nike viram visualmente intercambiáveis nesse domínio — perde diferenciação.
- Se for arbitrário per archetype sem vocabulário comum: ESLint não consegue validar consistência, page builder não consegue oferecer choices.

---

## D-30 / B3 — Dark mode: par explícito por archetype ou inversão universal?

**Recomendação:** **Opção C — archetype declara se suporta dark; quando sim, fornece pair light/dark explícito; regra universal NÃO existe.**

**Confiança:** **Alta**

**Raciocínio:**

- Inversão universal (Opção B) produz lixo em ~40% dos archetypes do catálogo. Linear é nasceu dark — inverter pra "light" produz um Linear-light que não é Linear, é uma maquete sem alma. Wired é light-only editorial — inverter pra dark vira anti-Wired.
- Pesquisa de 24 archetypes mostra mix: ~30% dark-first nativos (Linear, Sanity, The Verge, Vercel-stacked), ~30% light-only nativos (Wired, Notion-pastel, Airbnb-Warm), ~40% bi-modal nativos (Stripe, Apple HIG, Material).
- Padrão indústria converge em "declare explicitamente": Material 3 tem light scheme + dark scheme como artifacts separados gerados pelo Material Theme Builder (não invertidos algoritmicamente). Radix Colors tem 12-step scales pareadas (light + dark) com valores curados, não derivados.
- shadcn dark-first pattern: cada token tem `:root` + `.dark` blocks, mesmos slots, valores diferentes — confirma o pattern.
- Archetype declara em config:
  ```ts
  // lib/design/archetypes/linear/index.ts
  export const linear = {
    id: 'minimal-linear',
    supportsLight: false, // dark-first only
    supportsDark: true,
    defaultMode: 'dark',
    tokens: {
      dark: {
        /* roles → raw */
      },
      // light: undefined — ESLint/Zod rejeita se tentar usar
    },
  }
  ```
- Tenant configura `tenants.theme_mode = 'light' | 'dark' | 'auto'` mas tem CHECK constraint contra `archetype.supports*` na app layer (Zod) — UI esconde toggle dark se archetype não suporta.

**Referência externa:**

- Radix Colors light/dark pairs curados (não algorítmicos) ([Scales – Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/scales))
- shadcn theming pattern `:root` + `.dark` ([Theming - shadcn/ui](https://ui.shadcn.com/docs/theming))
- Material 3 Theme Builder gera light + dark schemes como output, não input ([Color roles - Material Design 3](https://m3.material.io/styles/color/roles))

**O que esta decisão desbloqueia:**

- `lib/design/archetypes/<name>/index.ts` ganha `supportsLight/supportsDark/defaultMode` no schema Zod
- DB: `tenants.theme_mode` mantém valores `light|dark|auto`, mas validação no app rejeita combo inválido
- Admin UX: toggle "modo escuro" só aparece em archetypes que suportam
- Compatibility matrix archetype × palette × mode pode ser pré-calculada em build

**Risco se errar:**

- Se virar inversão universal: muitos archetypes ficam unusable em dark, mas APCA passa numericamente — bug silencioso, only catched em design review.
- Se virar pair sem declaração de support: tenants configuram dark em archetype light-only, vê UI quebrada em produção.

---

## D-05 — Naming convention de tokens: numeric, semantic, bi-modal ou tri-modal?

**Recomendação:** **Opção D — Tri-modal completo** alinhado com D-21/D-22 (3 layers, naming distinto por layer):

- **Layer 1 raw — semantic** (`--surface-*`, `--ink-*`, `--accent-*`, `--shadow-*`, `--radius-*`, `--space-*`)
- **Layer 1.5 roles — use-case** (`--role-feature-card-bg`, `--role-text-emphasis`) — D-43 já cravada
- **Layer 2 native — editorial per archetype** (`--tint-peach`, `--surface-1`, `--charcoal`)

Numeric scale (Tailwind/Polaris-style `--space-100`, `--space-200`) **só dentro de scales contínuos** (`--space-*`, `--text-*`, `--radius-*`) onde semantic naming é forçado. Para roles, NUNCA numeric.

**Confiança:** **Alta**

**Raciocínio:**

- Carbon evoluiu de "tudo numérico" (v10: `$ui-01`, `$text-01`) pra "semantic com adjective descriptor + numeric só em layering" (v11) — confirma que numeric puro envelhece mal porque o significado escapa do nome.
- Polaris v12 explicitamente separa primitive tokens (`--p-space-100`) de semantic tokens (`--p-space-table-cell-padding`) e proíbe usar semantic fora do contexto declarado — bi-modal disciplined.
- Material 3 usa ref → sys → comp (3 layers, naming muda em cada — ref é numérico `md.ref.palette.primary40`, sys é semantic `md.sys.color.primary`, comp é use-case `md.comp.fab.container.color`) — confirma tri-modal indústria.
- Tailwind v4 `@theme` exige top-level CSS vars não-nested — `--space-1`, `--space-2` funcionam nativamente; `--role-*` também porque são CSS vars, mas Tailwind não gera utility classes pra eles (intencional: forçamos componentes a usar `style={{ background: var(--role-feature-card-bg) }}` ou wrappers shadcn que herdam).
- Scale contínuos (spacing 0-12, text xs-9xl, radius 0-full) são NATURALMENTE numéricos — semantic naming neles vira polui ("`--space-card-internal-gap`" é pior que `--space-4`). Mas tokens DISCRETOS (roles, shadows com elevation specific use, motion intent) precisam ser semantic.
- Native aliases (Layer 2) preservam o vocabulário editorial da marca original, valioso pra:
  - Onboarding visual (mapping doc "Notion 'Tint Peach' → nosso `--role-feature-card-bg`")
  - DX em archetype dev (designer Notion-fluente vê `--tint-peach` no devtools, entende imediatamente)
  - Zero impacto em componentes (Layer 2 NÃO é referenciada por código, só por archetype config + docs)

**Referência externa:**

- Carbon v11 evolution semantic+numeric ([Carbon tokens naming evolution](https://carbondesignsystem.com/elements/color/tokens/))
- Polaris bi-modal primitive + semantic ([Polaris tokens](https://polaris-react.shopify.com/design/colors/color-tokens))
- Material 3 ref/sys/comp 3-layer ([Design tokens – Material Design 3](https://m3.material.io/foundations/design-tokens))
- Tailwind v4 @theme CSS-first ([Theme variables](https://tailwindcss.com/docs/theme))

**O que esta decisão desbloqueia:**

- `app/globals.css @theme` final structure (scale tokens numeric + semantic categories)
- ESLint rule `design-tokens/no-raw-in-components`: bloqueia `var(--surface-*)`, `var(--ink-*)`, `var(--tint-*)` em `components/**/*` — só `var(--role-*)` ou `var(--space-*)` (scale) permitido
- TypeScript `Role` type (D-43 já cravou) + adicionar `ScaleToken` type pra scales numéricos
- Tipos de token enxutos:
  ```ts
  type RawColorToken = `--surface-${string}` | `--ink-${string}` | `--accent-${string}`
  type RoleToken = `--role-${Role}` // D-43
  type NativeAlias = string // archetype-specific, não tipado central
  type ScaleToken = `--space-${number}` | `--text-${ScaleName}` | `--radius-${RadiusName}`
  ```

**Risco se errar:**

- Se for só numeric (Opção B): perde semantic intent, ESLint não consegue distinguir "qual surface é card vs popover" — bugs visuais escapam (developer escolheu `--surface-2` pra ambos, troca de archetype muda hierarquia).
- Se for só semantic (Opção A): scales naturalmente numéricos viram poluídos (`--space-card-gap`, `--space-form-gap`, `--space-section-gap` — explosão).
- Se for bi-modal sem native (Opção C): perde Layer 2, perde valor editorial e documentação fica seca.

---

## D-21 / D-22 / D-33 — Token contract 3-layer + naming por layer

**Recomendação:** **Validar a hipótese como está, com 3 clarifications:**

1. **Layer 2 native é OPCIONAL por archetype.** Archetypes com vocabulário editorial rico (Notion "Tint Peach", Linear "surface-1", Carbon "$ui-01") DEVEM declarar aliases. Archetypes "neutros" sem identidade naming forte (minimal-mono genérico) PODEM omitir Layer 2 — apenas Layer 1 raw + Layer 1.5 roles bastam.
2. **Eixo 1 tokens não-coloridos (radius, shadow, spacing, motion, border, layout, focus) FICAM EM LAYER 1 RAW.** Eles são "raw" no sentido de "valor concreto, não é role intermediário". O archetype declara diretamente:
   ```css
   :root[data-archetype='minimal-linear'] {
     /* Layer 1 raw — color */
     --surface-1: oklch(...);
     /* Layer 1 raw — non-color (DSL do archetype) */
     --radius-card: 6px;
     --shadow-card: 0 1px 2px rgba(...);
     --space-4: 16px;
     --duration-fast: 120ms;
     --ease-standard: cubic-bezier(...);
     /* Layer 1.5 role */
     --role-feature-card-bg: var(--surface-2);
     --role-shadow-card: var(--shadow-card);
   }
   ```
3. **Roles podem mapear DIRETAMENTE para valores literais** quando não há raw token natural intermediário. Ex: `--role-border-focus: oklch(...)` direto, sem `--accent-focus` intermediário. A regra é "componente nunca usa raw", não "todo role precisa wrapper raw".

**Confiança:** **Alta**

**Raciocínio:**

- Material 3 ref/sys/comp confirma 3-layer como pattern indústria-validated ([Design tokens – Material Design 3](https://m3.material.io/foundations/design-tokens)). Ref é layer concreta de "todas as cores possíveis no palette"; sys é layer semantic de "como o tema usa essas cores"; comp é layer "como cada componente usa o sistema". Nossa 3-layer mapeia: Raw ↔ Ref+Sys (porque já incluímos non-color), Roles ↔ Sys.color, Native ↔ ref aliasing.
- Polaris v12 valida 2-layer mínimo (primitive + semantic) como padrão profissional. 3-layer (com native) é refinamento extra justificável para multi-archetype.
- Native (Layer 2) sendo opcional resolve tensão: "se TODO archetype precisa declarar native, é overhead". Tornar opcional preserva o valor onde existe (Notion, Linear, Carbon) sem cobrar custo onde não existe (archetype custom).
- Non-color tokens (radius, shadow, etc) sendo Layer 1 raw resolve confusão "onde fica `--radius-card`?": é o valor concreto do archetype, mesma natureza de `--surface-1`. Não é role porque não tem variação semantic ("card-padrão" não tem "card-elevated-shadow"; isso seria `--role-shadow-card` apontando pra raw `--shadow-card`).

**Referência externa:**

- Material 3 ref/sys/comp 3-tier
- Polaris primitive/semantic 2-tier base
- Notion-style "tint" naming preserved as alias layer (Notion Design Engineering blog precedent)

**O que esta decisão desbloqueia:**

- `lib/design/contract.ts` — schema Zod de archetype config:
  ```ts
  const ArchetypeSchema = z.object({
    id: z.string(),
    raw: z.object({
      colors: z.record(z.string(), OklchSchema), // --surface-*, --ink-*, --accent-*
      radius: z.record(z.string(), z.string()), // --radius-card etc
      shadow: z.record(z.string(), z.string()),
      space: z.record(z.string(), z.string()),
      motion: z.record(z.string(), z.string()),
      border: z.record(z.string(), z.string()),
    }),
    roles: z.record(RoleEnum, z.string()), // var(--surface-2) or literal
    native: z.record(z.string(), z.string()).optional(), // Layer 2
  })
  ```
- ESLint rule de import: `components/**/*` só pode `var(--role-*)` ou `var(--space-N)` ou `var(--text-N)` ou `var(--radius-*)` (scales numéricos)
- Storybook story "Token Inspector" mostra os 3 layers lado-a-lado pra cada archetype

**Risco se errar:**

- Se Layer 2 obrigatório: overhead pra archetypes neutros, dev nas archetype configs vira tedioso.
- Se non-color em Layer 1.5: confunde "role" com "scale" — semantic role naming aplicado a valores estruturais que não têm semântica (`--role-radius-card` é redundante porque já é o radius do card).
- Se roles SEMPRE precisam raw intermediário: explosão de raw tokens órfãos (`--accent-focus` que só existe pra alimentar `--role-border-focus`).

---

## D-29 — Semantic status colors: universais, per archetype, ou hue fixo + L/C variável?

**Recomendação:** **Opção C — Híbrido (hue universal canônico + L/C ajustável por archetype + APCA Silver gate)**

**Confiança:** **Alta**

**Raciocínio:**

- Reconhecimento universal é cognitive blocker: verde=success, vermelho=danger são esquemas culturais ocidentais quase-universais. Quebrar (success laranja em SpaceX) viola usabilidade — WCAG 1.4.1 (uso de cor) só funciona como uma DAS pistas, mas a pista de cor precisa ser estável.
- Liberdade total per archetype (Opção B) destrói reconhecimento + cria armadilha WCAG: archetype monocromo (SpaceX) onde tudo é cinza tem "success" indistinguível de "info".
- Liberdade zero (Opção A): The Verge tem palette acid (electric green, hot pink); injetar verde-success padrão (oklch(60% 0.15 150)) cria choque visual entre semantic vs branding.
- Pattern híbrido vence: declara hue **canônico** por status (success=verde 145, warning=amarelo 75, danger=vermelho 25, info=azul 235) — esses HUE são travados. Mas L/C (lightness/chroma) podem ajustar por archetype pra harmonizar:
  ```css
  /* Linear sóbrio: chroma baixa */
  :root[data-archetype='minimal-linear'] {
    --role-semantic-success: oklch(0.55 0.1 150);
    --role-semantic-danger: oklch(0.55 0.15 25);
  }
  /* Notion warm: lightness alta + chroma média */
  :root[data-archetype='editorial-notion'] {
    --role-semantic-success: oklch(0.75 0.12 150);
    --role-semantic-danger: oklch(0.7 0.16 25);
  }
  /* Nike bold: full chroma, alta L */
  :root[data-archetype='bold-nike'] {
    --role-semantic-success: oklch(0.7 0.2 145);
    --role-semantic-danger: oklch(0.62 0.22 25);
  }
  ```
- APCA Silver gate roda em build em todos os pairs (semantic-\* + on-color), bloqueia archetype que escolheu L/C que quebra contraste em pair com canvas.
- D-43 já declarou fallback chain pra archetypes que não declaram (`var(--archetype-semantic-success, oklch(60% 0.15 150))`) — esse fallback usa o hue canônico com L/C neutro. Recomendação C é coerente com fallback existente.
- Color blindness mitigation (D-38): semantic colors NUNCA podem ser only-cue. Componentes que usam semantic (alert, toast) precisam ICON + TEXT + COLOR (redundância). Essa regra é independente de D-29 (vai pra `.claude/rules/contrast.md` ampliada).

**Referência externa:**

- WCAG 1.4.1 use of color (cor como reforço, não como pista única)
- Material 3 errorContainer / errorPrimary com hue travado mas L variável por tema
- Polaris semantic surfaces critical/warning/success/info com hue canônico

**O que esta decisão desbloqueia:**

- `lib/design/semantic.ts` — exports `SEMANTIC_CANONICAL_HUES = { success: 145, warning: 80, danger: 25, info: 235 }`
- Zod schema rejeita archetype que declara `--role-semantic-success` com hue fora de range (145 ±15)
- APCA Silver script (`pnpm token:audit` já existe) valida pairs semantic + on-color em todos archetypes
- `<Alert>`, `<Toast>` shadcn wrappers declaram regra "always icon + text + color" (impossível só-cor)

**Risco se errar:**

- Universais puros (Opção A): The Verge e SpaceX viram visualmente quebrados nos componentes semantic.
- Per archetype livre (Opção B): user reconhecimento quebra entre tenants ("nesta app, vermelho é confirmar e verde é cancelar?"). Bug de cognição cross-tenant.
- Sem APCA gate: archetype escolhe L=0.95 success em canvas=oklch(0.95) → contraste 0 → usuário não vê o success toast.

---

## B5 — Typography scale/weights/tracking: travado por archetype, por tipografia, ou personalidade adaptativa?

**Recomendação:** **Opção C — Archetype define a "personalidade de scale" (compact / standard / editorial / expansive) + tipografia adapta dentro da personalidade.**

**Confiança:** **Média-alta**

**Raciocínio:**

- Opção A (archetype trava tudo, fonte só substitui) é simples mas tipograficamente errada: Inter renderiza diferente de Newsreader na mesma `font-size: 80px` — Inter precisa weight 700 e tracking -1%, Newsreader precisa weight 400 e tracking 0 pra ter mesma "presença visual". Trocar fonte sem ajustar scale produz UI desbalanceada.
- Opção B (tipografia define scale completo) destrói coerência archetype: tenant escolhe Nunito em archetype Linear, scale Nunito é "soft round" — quebra o Linear vibe.
- Opção C resolve tensão: archetype declara personality como abstração ("Linear = compact, Notion = editorial, Nike = expansive") e os ranges/proportions de scale + tracking/leading multipliers. Cada tipografia tem uma "fórmula de scale" parametrizada pela personality.
- Starbucks usa 3 fontes (Sodo Sans body + Lander accent + Pike headline). Não é "3 fontes mesmo scale" — é "3 fontes contextual com 3 papéis distintos". Nosso modelo: Eixo 3 declara `display + body + mono`. Archetype define **personality of scale** mas as 3 fontes podem ter scales próprios DENTRO da personality:
  ```ts
  // lib/design/archetypes/linear/typography-personality.ts
  export const linearPersonality = {
    scaleProgression: 'compact', // ratio 1.2 vs editorial 1.333
    weightRange: [400, 600], // pode usar 400/500/600 only
    trackingTight: -0.02, // tighten -2%
    lineHeightTight: 1.15,
    lineHeightBody: 1.5,
    maxHeadingSize: 'text-5xl', // não escala além
  }
  ```
- Cada tipografia (`lib/design/typographies/<name>.ts`) declara metrics próprios (x-height, optical adjustments) que combinam com personality pra resolver valores finais. Build pré-calcula todos os combos archetype × tipografia.
- Trade-off: precisa N × M tabela validada. Mitigação: marcamos algumas combinações como "blessed" (curated) e outras como "compatible mas não testadas". Pesquisa 28 + compatibility matrix.

**Referência externa:**

- Starbucks Sodo Sans + Lander + Pike contextual ([Starbucks Typography](https://creative.starbucks.com/typography/))
- EightShapes guide: typography em design system precisa scale + responsividade + semantic ([Typography in Design Systems by Nathan Curtis](https://medium.com/eightshapes-llc/typography-in-design-systems-6ed771432f1e))

**O que esta decisão desbloqueia:**

- `lib/design/archetypes/<name>/typography-personality.ts` — declara `scaleProgression`, `weightRange`, `trackingTight`, `lineHeightTight/Body`, `maxHeadingSize`
- `lib/design/typographies/<name>/metrics.ts` — declara `xHeight`, `cap-height`, `recommended-tracking-at-size`, `optical-adjustment-table`
- `lib/design/resolveTypography(archetype, typography)` — função que cruza os dois e gera scale final
- ESLint rule: `<Heading>`, `<Text>` componentes não recebem `className` com `text-*`; resolvem internamente via `resolveTypography`

**Risco se errar:**

- Se Opção A: tipografias acabam mal renderizadas em vários archetypes — DX ruim ("o tenant escolheu IBM Plex Sans mas parece estranho").
- Se Opção B: archetype Linear com Nunito perde Linear vibe completamente.
- Se Opção C overengineered: complexidade pra cobrir caso raro. Mitigação: começar com 1 personality (`standard`) e expandir JIT quando archetype concreto pedir.

---

## B6 — Eixo 5 (Mood por seção): modelar agora ou JIT?

**Recomendação:** **Opção C — Modelar a API (vocabulário + schema) agora, NÃO implementar até page builder existir.**

**Confiança:** **Alta**

**Raciocínio:**

- "Não modelar" (Opção B JIT puro) cria armadilha: page builder vai chegar (Fase 2/3) e quando chegar, vamos retrofit em components já escritos. Components precisam saber "estou em mood A ou B?" desde o início pra escolher token correto.
- "Implementar completo agora" (Opção A) é YAGNI: page builder não existe; tenant não escolhe mood; archetype 1 (Notion mood pastel) cobre 80% dos casos por enquanto.
- Opção C "modelar API" significa:
  1. Declarar vocabulário fechado: `mood: 'canvas' | 'tinted' | 'dark' | 'full-bleed'` (4 moods, mais cobre 95% dos casos editoriais)
  2. Pattern: `<section data-mood="tinted">` no DOM, CSS `[data-mood="tinted"]` reescreve roles localmente:
     ```css
     [data-mood='tinted'] {
       --role-page-canvas: var(--role-accent-subtle);
       --role-text-emphasis: var(--role-text-on-accent);
     }
     ```
  3. Components dentro de section herdam roles reescritos automaticamente — ZERO mudança nos componentes
  4. Page builder (Fase 2/3) adiciona UI pra escolher mood; até lá, hardcoded em layouts onde precisar
- Esta abordagem desbloqueia plano design system NOW (não precisa esperar page builder) + page builder NOT BLOCKED quando chegar (API existe).
- Cuidado: APCA Silver gate roda EM CADA mood × archetype × palette. Build vira lento — mitigação: cachear validation results por combinação.

**Referência externa:**

- CSS Custom Properties cascading: `data-*` attribute selectors permitem rebind de vars sem JS
- Material 3 surface tint cascading (mesma técnica, eles chamam "tonal elevation contexts")

**O que esta decisão desbloqueia:**

- `lib/design/moods.ts` — exporta `MOODS = ['canvas', 'tinted', 'dark', 'full-bleed'] as const`
- `app/globals.css` — `[data-mood]` selectors com rebind dos roles principais
- TypeScript: `<Section mood?: Mood>` API existe agora; page builder Fase 2 usa
- Storybook decorator `withMood` pra testar cada combo

**Risco se errar:**

- Sem modelar API: page builder chega e quebra ESLint rules / contracts existentes.
- Modelar e implementar completo: complexity sem ROI imediato; talvez priorizar errado.

---

## C1 — Tokens `--img-*` (photography): core ou extended com fallback?

**Recomendação:** **Opção C — Split: alguns `--img-*` core, outros extended.**

- **Core obrigatório** (todo archetype declara): `--img-radius`, `--img-aspect-default` (4:3 ou 16:9 ou 1:1), `--img-aspect-card`
- **Extended com fallback** (archetype pode omitir): `--img-filter` (sepia/grayscale/grain), `--img-overlay-opacity`, `--img-overlay-color`, `--img-border`, `--img-shadow`

**Confiança:** **Alta**

**Raciocínio:**

- Forçar todo archetype a declarar `--img-filter: hue-rotate(...)` é absurdo pra OpenCode.ai (terminal mono, zero photography). Eles declarariam `none` e o token vira lixo.
- Forçar Nike a usar fallback "none" pra `--img-overlay-opacity` produz visual quebrado (Nike PRECISA overlay pra texto sobre photography hero).
- Pattern split: tokens estruturais (radius, aspect ratio) são UNIVERSAIS porque toda app que renderiza imagem precisa decidir corner radius — mesmo OpenCode.ai precisa radius=0 explicit. Tokens DECORATIVOS (filter, overlay, shadow) são OPCIONAIS porque expressam style — alguns archetypes não usam.
- Fallback strategy alinha com D-43 Tier 2 pattern: declarar fallback em `:root` global, archetype sobrescreve quando declara:
  ```css
  :root {
    --img-filter: none;
    --img-overlay-opacity: 0;
    --img-overlay-color: black;
    --img-border: none;
    --img-shadow: none;
  }
  :root[data-archetype='bold-nike'] {
    --img-overlay-opacity: 0.4;
    --img-overlay-color: black;
  }
  ```
- Photography é Eixo 1 (archetype) — declarado em `lib/design/archetypes/<name>/photography.ts`.
- D-08 (camada própria pra photos) e D-27 (fases de photos) ficam fora desta decisão; aqui só tokens.

**Referência externa:**

- Material 3 não tem tokens `--img-*` formais (photography é guideline, não token) — mas Compose ImageRequest builders permitem semantic overrides
- Polaris não tem `--img-*` core — confirma que muitos design systems tratam imagem como component-level, não system-level

**O que esta decisão desbloqueia:**

- `lib/design/tokens/img.ts` — declara core (`radius`, `aspect-*`) e extended (`filter`, `overlay-*`, `border`, `shadow`)
- Zod schema archetype: `photography: { core: required, extended: partial }`
- Componente `<Image>` wrapper aplica tokens via inline style/className
- Default fallback em `:root` cobre archetypes minimalistas sem override

**Risco se errar:**

- Tudo core: archetypes minimalistas precisam declarar lixo.
- Tudo extended: archetypes photography-heavy precisam override TUDO, dev sente fricção.

---

## C2 — Focus indicators: quantas variantes?

**Recomendação:** **Opção A — 2 variantes (ring outset + inset-ring). Cor e espessura por archetype via `--focus-*` tokens.**

**Confiança:** **Alta**

**Raciocínio:**

- WCAG 2.4.13 (Focus Appearance, AAA) exige indicator com no mínimo 2 CSS pixels thick + contraste 3:1 contra elemento + bg. AA (2.4.11 Focus Appearance Minimum em WCAG 2.2) também exige indicator visível.
- 1 variante universal (Opção C) falha pra inputs preenchidos: ring outset em `<input>` com border solid 1px causa "double-ring" visual confuso. Inset-ring resolve isso (ring dentro do border).
- 3 variantes (Opção B com outline AAA explícito) é overkill: AA já cobre 99% requirement; AAA é declarável via `archetype.focusStrength: 'standard' | 'enhanced'` que apenas aumenta espessura, sem variante nova de DOM/CSS pattern.
- shadcn já usa `--ring` token (focus-visible) com Tailwind `ring-*` utilities — alinha com Opção A.
- Pattern recomendado:
  ```css
  /* Layer 1 raw — per archetype */
  --focus-width: 2px;
  --focus-offset: 2px;
  --focus-color: var(--role-border-focus);
  /* Layer 1.5 role */
  --role-border-focus: oklch(...); /* D-43 core */
  /* CSS utility */
  .focus-ring:focus-visible {
    outline: var(--focus-width) solid var(--focus-color);
    outline-offset: var(--focus-offset);
  }
  .focus-ring-inset:focus-visible {
    outline: var(--focus-width) solid var(--focus-color);
    outline-offset: calc(-1 * var(--focus-width));
  }
  ```
- Componentes shadcn herdam via `--ring` mapping em `@theme inline` (já existe em `globals.css`).

**Referência externa:**

- WCAG 2.4.13 Focus Appearance AAA: 2px thick + 3:1 contrast ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html))
- Common implementation: `.focus-ring` + `.focus-ring-inset` 2-variant pattern ([TestParty 2025 guide](https://testparty.ai/blog/wcag-2-4-13-focus-appearance-2025-guide))

**O que esta decisão desbloqueia:**

- `app/globals.css` — declara `--focus-width`, `--focus-offset`, `--focus-color` (defaults), `.focus-ring`, `.focus-ring-inset` classes
- Archetypes podem override (Nike grosso 4px, Notion sutil 2px)
- shadcn primitives respeitam via `--ring` automático
- ESLint rule (futura): qualquer elemento interativo precisa `.focus-ring` ou variante shadcn equivalente

**Risco se errar:**

- 1 variante: inputs com border ficam confusos.
- 3 variantes: complexidade sem ROI; AAA já cobre via `focusStrength` flag.

---

## C3 — On-colors: runtime APCA ou pré-calculado?

**Recomendação:** **Opção C — Pré-calculado automaticamente no pipeline de geração do archetype config (build-time)**

**Confiança:** **Alta**

**Raciocínio:**

- Runtime APCA (Opção A) precisa JS rodando — quebra SSR/RSC (Next 16 App Router). Componente RSC não tem acesso a `document` pra ler CSS var resolved. Inviável arquiteturalmente.
- Manual no archetype config (Opção B) viola "designer-not-required" premise + cria drift: archetype dev escolhe text-on-accent manualmente, esquece de re-validar quando muda accent.
- Build-time pipeline (Opção C) é o caminho: quando archetype config é gerado (script `pnpm tokens:build` ou `lib/design/build.ts`), pra cada `--role-accent-*` o pipeline calcula `--role-text-on-accent` via APCA + culori + APCA gate (`Lc >= 75` pra body, `>= 60` pra large).
- Tenant customization (palette seed) precisa rebuild de tokens — temos endpoint `/api/{tenants,brands}/[id]/theme.css` que JÁ gera CSS dinâmico no server. Estender: ao buscar/computar palette, calcular on-colors no mesmo route handler (build-time é "request-time" do theme.css endpoint, runtime do app é instant).
- Pipeline:
  ```ts
  // lib/design/onColor.ts
  import { wcagContrast, oklch } from 'culori'
  import { apca } from '@/lib/design/apca'
  export function calculateOnColor(bg: string, candidates = ['white', 'black']): string {
    const scored = candidates.map((fg) => ({ fg, lc: Math.abs(apca(fg, bg)) }))
    const best = scored.reduce((a, b) => (a.lc > b.lc ? a : b))
    if (best.lc < 60) {
      // fallback: tone-adjust até APCA Silver
      return apcaAdjust(bg, best.fg, { target: 75 })
    }
    return best.fg
  }
  ```
- Cache: chave (`accent_oklch + bg_oklch`) → resultado. Tabela `tenants.computed_tokens` (JSONB) persistido após primeira computação, invalidado em palette change.

**Referência externa:**

- APCA-Compose builders ([apcach JS library](https://github.com/antiflasher/apcach)) — pattern build-time calculation
- Material 3 tone-based on-color (computa on-\* tokens via tonal palette algorithm) — build-time, não runtime

**O que esta decisão desbloqueia:**

- `lib/design/onColor.ts` — função pura, testável
- `/api/{tenants,brands}/[id]/theme.css` route handler chama on-color calculator
- `tenants.computed_tokens jsonb` — cache persistente (invalidate on palette/archetype change)
- Storybook story "On-Color Audit" pra cada archetype mostra todos os pairs computed
- APCA Silver script roda em CI sobre archetype configs estáticos + amostra de tenants reais

**Risco se errar:**

- Runtime puro: quebra SSR + adiciona JS dependency pra rendering.
- Manual no config: drift inevitável + viola designer-not-required.
- Sem cache: theme.css route handler lento, LCP impacted.

---

## D-32 — Prefers-reduced-motion: CSS media query, JS token, ou ambos?

**Recomendação:** **Opção C — Ambos: `@media (prefers-reduced-motion: reduce)` para CSS animations + `MotionConfig reducedMotion="user"` (Motion 12) para animations declaradas via `motion/react`.**

**Confiança:** **Alta**

**Raciocínio:**

- Motion 12 (nossa stack, ADR-0014) tem suporte NATIVO via `<MotionConfig reducedMotion="user">` + `useReducedMotion()` hook — não precisa reinventar token JS.
- Motion `reducedMotion="user"` automaticamente desliga transform/layout animations e preserva opacity/color — semanticamente correto (movement reduzido, mas feedback de mudança ainda existe).
- CSS animations (keyframes, transitions Tailwind como `animate-shimmer`, `animate-pulse`) precisam `@media (prefers-reduced-motion: reduce)` porque Motion 12 não controla CSS native.
- Padrão duplo é low-cost, alta cobertura:
  ```css
  /* app/globals.css */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  ```tsx
  // app/layout.tsx ou root provider
  import { MotionConfig } from 'motion/react'
  export function RootLayout({ children }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>
  }
  ```
- Token JS `--motion-enabled` (Opção B) seria viável mas redundante: Motion 12 já oferece `useReducedMotion()` hook + `MotionConfig`. Criar abstração custom viola CLAUDE.md regra "abstração nova: 3+ usos + ADR".
- WCAG 2.3.3 Animation from Interactions (AAA) + best-practice indústria 2.3.1 Three Flashes (AA) — ambos cobertos por essa estratégia.

**Referência externa:**

- Motion 12 native support ([Motion docs - useReducedMotion](https://motion.dev/docs/react-use-reduced-motion))
- MotionConfig pattern ([Motion docs - accessibility](https://motion.dev/docs/react-accessibility))
- Josh Comeau prefers-reduced-motion React hook (industry-standard pattern)

**O que esta decisão desbloqueia:**

- `app/globals.css` — adicionar `@media (prefers-reduced-motion: reduce)` global rules
- `app/layout.tsx` (ou RouteProvider) — wrap em `<MotionConfig reducedMotion="user">`
- `.claude/rules/contrast.md` (ou nova `motion.md`) — documentar regra
- Testes Vitest: `useReducedMotion` mock pra garantir components respeitam
- Storybook decorator pra forçar `reduced-motion` em stories de testing

**Risco se errar:**

- Só CSS: animações Motion 12 continuam rodando, viola WCAG 2.3.3.
- Só JS: CSS animations (`animate-shimmer`, transitions Tailwind) continuam, viola.
- Token custom `--motion-enabled`: reinventa Motion API existente, drift.

---

## Harmonia entre decisões — como o sistema se encaixa

O conjunto dessas decisões forma um **sistema coerente de 3 layers + 5 eixos + APCA Silver gate** onde cada peça reforça as outras. Esta seção mostra como D-05 (naming) + D-21/22/33 (layers) + D-29 (semantic) + B3 (dark mode) + C3 (on-colors) operam juntos sem fricção.

### O fluxo de uma cor da definição ao componente

```
[1] Archetype declara Layer 1 raw (semantic naming)
    --surface-1: oklch(...)
    --accent: oklch(...)
    --tint-peach: oklch(...)  ← Layer 2 native opcional

[2] Archetype mapeia Layer 1.5 roles (D-43, 29 roles)
    --role-feature-card-bg: var(--tint-peach)   ← Notion archetype
    --role-feature-card-bg: var(--surface-2)    ← Linear archetype
    --role-semantic-success: oklch(0.55 0.1 150) ← hue canônico, L/C local (D-29)
    --role-text-on-accent: <computed APCA build-time> ← C3

[3] shadcn @theme inline alias para roles (não raw)
    --background: var(--role-page-canvas)
    --primary: var(--role-accent-primary)
    --destructive: var(--role-semantic-danger)

[4] Componente consome role (NUNCA raw, NUNCA native)
    <Card> usa var(--role-feature-card-bg) via shadcn primitives
    <Heading> usa var(--role-text-emphasis)

[5] Dark mode swap (B3 — pair explícito)
    :root.dark[data-archetype='editorial-notion'] {
      todos os --role-* override pra dark variant
    }

[6] Mood scoping (B6 — modelar agora)
    [data-mood='tinted'] {
      --role-page-canvas: var(--role-accent-subtle)
      /* componentes dentro herdam */
    }

[7] APCA Silver gate (prebuild)
    Roda culori + APCA sobre TODOS os pairs:
    role × bg em modes (light/dark) × moods × archetypes × palettes
    Falha em CI se Lc < 75 (body) / 60 (large) / 45 (non-text)
```

### Invariantes que mantêm coerência

1. **Componentes nunca tocam Layer 1 raw nem Layer 2 native** — ESLint enforça. Se um componente precisa de cor, é via role. Isso garante swap automático de archetype/dark/mood sem refactor de componente.

2. **Roles são contrato universal** — D-43 cravou 29 roles em 3 tiers. Cada archetype implementa os 17 core + declara fallback pros 8 extended. Componentes podem assumir "todo role existe" (com fallback definido).

3. **Naming distinto por layer evita confusão semantica:**
   - Raw: `--surface-1`, `--ink-primary`, `--tint-peach` (estrutural, archetype-driven)
   - Role: `--role-page-canvas`, `--role-text-emphasis` (use-case, universal)
   - Scale: `--space-4`, `--text-2xl`, `--radius-md` (escala numérica, Tailwind-style)
   - Native (Layer 2 opcional): naming editorial preservado

4. **Dark mode + Mood + Archetype são dimensões ortogonais** — todas reescrevem os roles, nunca os raw direto. Component agnóstico a TODAS.

5. **APCA Silver é gate, não sugestão** — toda mudança de palette, archetype, ou role config passa por validação. CI bloqueia merge se contraste quebra.

6. **On-colors são computed, não hardcoded (C3)** — toda vez que accent muda, on-color recomputa. Combina com APCA gate: se accent novo do tenant não atinge on-color válido em ambos light/dark, palette é rejeitada na save.

### O que isso permite no produto

- **One-click theme swap (D-28)** funciona porque components não conhecem o archetype — só roles. Trocar archetype = trocar mapping roles → raw + recompute on-colors + invalidate cache. Components re-render sem refactor.
- **Multi-marca multi-vertical** funciona porque `/api/{tenants,brands}/[id]/theme.css` injeta os roles do tenant em runtime. Mesmo bundle JS, N marcas.
- **APCA Silver compliance** funciona porque gate em prebuild + on-color computed garante que NENHUMA combinação tenant + archetype + mode + mood pode shippar com contraste quebrado.
- **Design system AI-legível (vibe coding)** funciona porque roles são vocabulário fechado documentado em `lib/design/roles.ts` — AI infere o role correto a partir do contexto ("este é fundo de card de feature" → `--role-feature-card-bg`).

### Onde decisões reforçam umas às outras

| Decisão A             | Decisão B                                                | Como se reforçam                                                                                                                                  |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-43 (29 roles)       | D-22 (tri-modal naming)                                  | Roles são Layer 1.5; naming distinto evita colisão com raw (--surface-_) e scale (--space-_).                                                     |
| D-21 (3-layer)        | D-30 (dark pair explícito)                               | Dark swap só override Layer 1.5 roles; Layer 1 raw permanece estável → swap é localizado, não cascade horror.                                     |
| D-29 (hue canônico)   | C3 (on-color computed)                                   | Hue travado + L/C variável significa on-color precisa recompute por archetype (não pode ser hardcoded). Pipeline build-time resolve.              |
| D-32 (motion dupla)   | Eixo 1 motion tokens (`--duration-*`, `--ease-*`)        | CSS media query desliga animations independente de archetype; archetype-specific motion permanece estável em "usuários normais".                  |
| B6 (mood modelar API) | D-43 (roles)                                             | Mood reescreve roles via `[data-mood]` selector; só funciona porque roles existem como camada universal.                                          |
| D-05 (tri-modal)      | D-21 (3-layer)                                           | Naming distinto reforça layers: dev olha `--surface-1` e sabe "raw"; olha `--role-page-canvas` e sabe "role"; olha `--space-4` e sabe "scale".    |
| D-04 (grid archetype) | B6 (mood)                                                | Grid token é Layer 1 raw archetype; mood pode override localmente via Eixo 5. Page builder Fase 2 explora isso sem mudar API.                     |
| C2 (focus 2 variants) | D-43 (--role-border-focus)                               | `--focus-color: var(--role-border-focus)` — focus indicator herda role, archetype só override `--focus-width/offset` se quiser.                   |
| D-01 (density DNA)    | B5 (typography personality)                              | Density compact + typography compact = Linear coerente. Density spacious + typography editorial = Notion coerente. Combos são archetype-internal. |
| C1 (img split)        | D-43 (Tier 3 `--role-surface-block-color` editorial img) | Photography-heavy archetypes declaram Tier 3 + extended img tokens; minimalistas usam só core img tokens + fallback.                              |

### Riscos de coerência se decisão quebrar

- Se D-05 virar single-mode (só semantic ou só numeric): Layer naming colapsa, ESLint não distingue layer, componentes começam a vazar acesso a raw.
- Se D-30 virar inversão universal: pair light/dark assimétrico produz APCA failures que gate detecta, mas dev frustration alto.
- Se D-29 virar liberdade total: APCA Silver gate passa mas reconhecimento user quebra cross-tenant.
- Se C3 virar runtime: SSR/RSC quebram, theme.css endpoint não funciona, multi-marca não funciona.
- Se D-32 virar só CSS: Motion 12 animations rodam — violação WCAG silenciosa.
- Se D-43 perder Tier 2 fallback: archetypes sem semantic palette (SpaceX, Wired) quebram nos roles extended.

---

## Sources (research externa)

- [Design tokens – Material Design 3](https://m3.material.io/foundations/design-tokens) — ref/sys/comp 3-layer
- [Color roles - Material Design 3](https://m3.material.io/styles/color/roles) — semantic role pattern
- [3 layer of design token matter - DEV](https://dev.to/harsh_dev_01/3-layer-of-design-token-matter-44f6) — token layering rationale
- [Aliasing – Radix Colors](https://www.radix-ui.com/colors/docs/overview/aliasing) — semantic alias mapping
- [Scales – Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/scales) — 12-step scale architecture + light/dark pairs
- [Theme variables - Tailwind CSS](https://tailwindcss.com/docs/theme) — Tailwind v4 @theme CSS-first
- [Tailwind CSS v4.0 - Tailwind blog](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first architecture shift
- [Carbon Design System - Color tokens](https://carbondesignsystem.com/elements/color/tokens/) — v11 naming evolution
- [Spacing – Carbon Design System](https://carbondesignsystem.com/elements/spacing/overview/) — semantic + numeric tokens
- [Version 12 — Shopify Polaris React](https://polaris-react.shopify.com/previous-releases/version-12) — primitive + semantic split, density as system change
- [Polaris color tokens](https://polaris-react.shopify.com/design/colors/color-tokens) — semantic token discipline
- [How we redesigned the Linear UI (part II)](https://linear.app/now/how-we-redesigned-the-linear-ui) — surface generation system
- [A calmer interface — Linear](https://linear.app/now/behind-the-latest-design-refresh) — LCH-based theme generation
- [Theming - shadcn/ui](https://ui.shadcn.com/docs/theming) — dark mode pattern
- [Tailwind v4 - shadcn/ui](https://ui.shadcn.com/docs/tailwind-v4) — @theme inline pattern
- [Design Tokens That Scale in 2026 - Mavik Labs](https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026/) — 3-layer pattern recommendations
- [Motion docs - useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) — Motion 12 reduced-motion API
- [Motion docs - accessibility](https://motion.dev/docs/react-accessibility) — MotionConfig reducedMotion="user"
- [APCA Contrast Calculator](https://apcacontrast.com/) — algorithm reference
- [apcach](https://github.com/antiflasher/apcach) — APCA-compose JS for build-time on-color
- [WCAG 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — focus requirements
- [TestParty WCAG 2.4.13 guide 2025](https://testparty.ai/blog/wcag-2-4-13-focus-appearance-2025-guide) — ring/inset implementation
- [Starbucks Typography](https://creative.starbucks.com/typography/) — multi-font contextual
- [Typography in Design Systems - Nathan Curtis](https://medium.com/eightshapes-llc/typography-in-design-systems-6ed771432f1e) — typography system patterns
- [Grid - Ant Design](https://ant.design/components/grid/) — 24-col single-archetype grid

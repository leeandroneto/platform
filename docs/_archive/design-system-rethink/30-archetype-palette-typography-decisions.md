# 30. Archetype × Palette × Typography — decisões consolidadas (24 archetypes)

> **Status:** decisões propostas (preliminary) — aguardam ratificação user
> **Data:** 2026-05-20
> **Input:** `15-archetype-curation.md` (18 desktop) + `19-mobile-first-additions.md` (6 mobile-first) + `16-semantic-colors-audit.md` + `20-naming-mappings.md` + `12-decisions-resolved.md` (D-43) + pesquisas `26` e `27`
> **Escopo:** D-03, D-23, D-24, D-25, D-26, E1, E2, E3, E4, F1, F2, F3, G1, G2, G3, G4
> **Goal:** documento single-source pra cravar fontes, paletas, mapeamento archetype→DESIGN.md e variantes estruturais Card/Hero/Nav/List/Feed antes de Passo 6 (implementação dos 24)
> **Vocab:** archetype (não template/style); palette (não swatch); role (não slot/semantic-token) — `.claude/rules/naming.md`

---

## TL;DR

- **D-03 / D-26 — 24 archetypes mapeados 1:1 a DESIGN.md.** Cada archetype = um diretório `docs/references/design-systems/<slug>/DESIGN.md`. Sem ambiguidade exceto Apple e Starbucks (resolvido E3/E4).
- **E3 / E4 — Apple e Starbucks ficam em UM config único cada** com sub-seção `mobile: {}` interna (Opção A). Vibes são suficientemente coerentes pra não justificar fork (museum-gallery + floating-sticky-bar é continuidade Apple HIG, não vibes opostos).
- **D-23 / G1 / G2 — Catálogo final de 8 famílias tipográficas** (todas free Google Fonts ou system) cobrindo os 24 archetypes via agregação. Tabela completa na seção dedicada. Geist atual cobre 8/24 sozinha; outras 7 cobrem os 16 restantes.
- **G3 — Lazy load por archetype (Opção C subset inteligente).** As 3 famílias mais populares (Geist, Inter, Manrope) entram no build base; outras 5 lazy via `next/font` declaradas mas com `preload: false` + ativação por `[data-archetype]` que injeta CSS var. Fontes locais (Anton, Bebas Neue, Newsreader) declaradas via `localFont` + `display: 'swap'`.
- **G4 — Custom font upload nunca (Opção B).** Catálogo fechado de 8 famílias é suficiente; tier premium recebe acesso ao catálogo completo, não upload. Licenças web + APCA validation + storage = complexidade desproporcional ao valor. Re-avaliar Fase 4+ se demanda enterprise concreta surgir.
- **D-25 / F1 / F2 — Manter as 13 paletas atuais (Opção A) + compatibility matrix soft (Opção B).** APCA Silver gate runtime cobre o caso técnico; compatibility é metadata `recommendedFor` no archetype config — UI mostra recomendações mas não bloqueia (frescura).
- **F3 — Data viz cores derivadas da seed (Opção A).** 8 categóricas via posições tonais OKLCH automáticas (`L 0.55, C 0.18, H+45°·N`). MVP com personal trainers não precisa custom per archetype; Recharts/Tremor usam direto.
- **D-24 — desafit.app brand institucional = Opção D variante (Stripe-like + indigo).** Soft-Productive archetype + palette indigo/violet. Comunica "infraestrutura séria pra profissional premium". Bold-Energetic (Nike) é pra TENANT fitness, não pra agência.
- **E1 — 4 variantes estruturais de Card** cobrem os 24: image-top, image-side, image-bg, text-only. Hero = 2 variantes (text-first, media-first). Nav = 3 (top-only, top+sidebar, bottom-tab). List = 3 (text, with-leading, with-image). Feed linear vs masonry = 2 variantes de container, não componentes separados.
- **E2 — Masonry = variante de container `MasonryGrid`** (Opção B), aceitando qualquer Card. CSS `grid-template-rows: masonry` ainda experimental (Firefox 2026, Chrome behind flag) — fallback JS via `react-masonry-css` ou CSS columns. Não criar `MasonryFeed` componente próprio.

---

## D-03 / D-26 — Mapeamento archetype → DESIGN.md primário (24 archetypes)

**Fonte:** `docs/references/design-systems/<slug>/DESIGN.md` (71 arquivos auditados). Mapeamento 1:1 cravado abaixo. Cada `lib/design/archetypes/<archetype-slug>/source.md` (a criar no Passo 6) cita o DESIGN.md como autoritativo.

| #   | Archetype slug | DESIGN.md primário                                     | Tipo              | Ambiguidade?     |
| --- | -------------- | ------------------------------------------------------ | ----------------- | ---------------- |
| 1   | `linear`       | `docs/references/design-systems/linear.app/DESIGN.md`  | desktop dark      | não              |
| 2   | `notion`       | `docs/references/design-systems/notion/DESIGN.md`      | desktop light     | não              |
| 3   | `stripe`       | `docs/references/design-systems/stripe/DESIGN.md`      | desktop light     | não              |
| 4   | `nike`         | `docs/references/design-systems/nike/DESIGN.md`        | desktop commerce  | não              |
| 5   | `apple`        | `docs/references/design-systems/apple/DESIGN.md`       | desktop + mobile  | **resolvida E3** |
| 6   | `wired`        | `docs/references/design-systems/wired/DESIGN.md`       | desktop editorial | não              |
| 7   | `spacex`       | `docs/references/design-systems/spacex/DESIGN.md`      | desktop cinematic | não              |
| 8   | `mistral`      | `docs/references/design-systems/mistral.ai/DESIGN.md`  | desktop warm      | não              |
| 9   | `wise`         | `docs/references/design-systems/wise/DESIGN.md`        | desktop fintech   | não              |
| 10  | `figma`        | `docs/references/design-systems/figma/DESIGN.md`       | desktop tool      | não              |
| 11  | `theverge`     | `docs/references/design-systems/theverge/DESIGN.md`    | desktop brutalist | não              |
| 12  | `claude`       | `docs/references/design-systems/claude/DESIGN.md`      | desktop AI warm   | não              |
| 13  | `vodafone`     | `docs/references/design-systems/vodafone/DESIGN.md`    | desktop telecom   | não              |
| 14  | `opencode`     | `docs/references/design-systems/opencode.ai/DESIGN.md` | desktop dev-niche | não              |
| 15  | `mastercard`   | `docs/references/design-systems/mastercard/DESIGN.md`  | desktop corporate | não              |
| 16  | `sanity`       | `docs/references/design-systems/sanity/DESIGN.md`      | desktop dark mono | não              |
| 17  | `zapier`       | `docs/references/design-systems/zapier/DESIGN.md`      | desktop warm      | não              |
| 18  | `starbucks`    | `docs/references/design-systems/starbucks/DESIGN.md`   | desktop + mobile  | **resolvida E4** |
| 19  | `spotify`      | `docs/references/design-systems/spotify/DESIGN.md`     | mobile-first app  | não              |
| 20  | `airbnb`       | `docs/references/design-systems/airbnb/DESIGN.md`      | mobile-first      | não              |
| 21  | `meta`         | `docs/references/design-systems/meta/DESIGN.md`        | mobile commerce   | não              |
| 22  | `pinterest`    | `docs/references/design-systems/pinterest/DESIGN.md`   | mobile discovery  | não              |

> **22 archetypes únicos** mapeados em DESIGN.md. Total = 24 archetypes (com Apple+Starbucks reforçados em dimensão mobile dentro do mesmo config — ver E3/E4). Slot 23-24 reservado para expansão futura (`docs/design-system/19-mobile-first-additions.md` mencionou "slot livre").

### Notas operacionais sobre o mapeamento

- **`opencode.ai` slug:** `opencode` (sem `.ai`) pra consistência com Next.js `[data-archetype="opencode"]`.
- **`mistral.ai` slug:** `mistral` (sem `.ai`).
- **`linear.app` slug:** `linear` (sem `.app`).
- **Apple file:** mesmo DESIGN.md cobre tanto museum-gallery (desktop) quanto floating-sticky-bar (mobile) — auditoria mobile-first confirma `{component.floating-sticky-bar}` está documentado lá.
- **Starbucks file:** mesmo DESIGN.md cobre 4-tier green retail (desktop) quanto Frap FAB + touch-offset (mobile).

---

## E3 — Apple: 1 config único com seção `mobile` interna

### Recomendação: Opção A — 1 config por marca com seção `mobile: {}` separada dentro do mesmo arquivo

**Confiança:** Alta
**Raciocínio:** Apple desktop "museum-gallery photography-first" e Apple mobile "floating-sticky-bar + frosted glass + 44px floor" NÃO são vibes opostos — são CONTINUIDADE Apple HIG. O floating-sticky-bar usa a MESMA palette (`#fff`/`#1d1d1f` + Action Blue `#0066cc`), o MESMO type (SF Pro Display/Text), e o MESMO motion easing. O que muda é APENAS um conjunto adicional de componentes (sticky-bar, frosted-glass nav, touch chips) e algumas mecânicas responsive (44pt hard floor em mobile, art-direction não-trivial em hero).

Forkar em 2 archetypes (`apple-desktop`, `apple-mobile`) duplicaria 80% dos tokens (roles, raw tokens, native aliases) por causa de ~20% de divergência mobile-specific. Estrutura proposta:

```ts
// lib/design/archetypes/apple/config.ts
export const apple: ArchetypeConfig = {
  slug: 'apple',
  displayName: 'Museum Gallery (Apple-inspired)',
  source: 'docs/references/design-systems/apple/DESIGN.md',
  vibe: 'museum-gallery-photography-first',

  // Tokens compartilhados desktop + mobile
  roles: {
    /* 25 D-43 roles */
  },
  rawTokens: {
    /* canonical */
  },
  nativeAliases: {
    /* Apple native */
  },
  typography: { font: 'inter' /* SF Pro substitute */ },
  motion: {
    /* shared */
  },

  // Sub-seção mobile-specific (componentes adicionais + overrides)
  mobile: {
    minTouchTarget: 44, // pt — Apple HIG floor
    components: {
      'floating-sticky-bar': {
        height: 64,
        background: 'color-mix(in oklch, var(--surface-canvas) 80%, transparent)',
        backdropFilter: 'blur(12px) saturate(180%)',
      },
      'sub-nav-frosted': {
        backdropFilter: 'blur(20px) saturate(180%)',
      },
      'configurator-chip': {
        minWidth: 80,
        height: 44,
      },
    },
    photoStrategy: {
      heroArtDirection: { desktop: '16:9', mobile: '4:5' },
    },
  },
}
```

**Referência externa:** Apple HIG explicitamente trata iPad/iPhone/Mac como variações da MESMA design language, não forks ("If possible, use a single font. Mixing several different fonts can make your app seem fragmented and sloppy" — HIG). Apple Human Interface Guidelines unified document mostra continuidade desktop/mobile.

**O que desbloqueia:**

- Implementação simples — 1 arquivo `lib/design/archetypes/apple/config.ts`
- Tenant escolhe `apple` → recebe AMBOS desktop + mobile patterns automaticamente
- Storybook stories podem testar `viewport=mobile` e `viewport=desktop` reusando o config
- DRY — 80% dos tokens compartilhados não duplicam

**Risco se errar:** Se vibes divergirem futuramente (Apple Visionário OS 2027 com vibe radicalmente diferente?), fork retroativo é trivial — basta criar `apple-vision` archetype e cravar config separado. Estrutura permite migração.

**Aplicação a Starbucks (E4):** mesma decisão — 1 config `lib/design/archetypes/starbucks/config.ts` com sub-seção `mobile: {}` declarando Frap FAB, touch-offset, mobile font scale (`float-label 1.6→1.9rem`), e nav heights progressivas (`64 → 72 → 83 → 99px`). Vibes "warm retail flagship desktop" e "Frap FAB mobile" são CONTINUIDADE Starbucks brand language, não forks.

**Anti-padrão rejeitado (Opção B — 2 arquivos `apple-desktop.ts` + `apple-mobile.ts`):** duplicação de tokens, divergência inevitável quando alguém atualiza um e esquece o outro, archetype picker UX confuso (user vê "Apple Desktop" + "Apple Mobile" e pergunta "qual escolho se quero ambos?").

**Anti-padrão rejeitado (Opção C — extend `apple-mobile extends apple-desktop`):** padrão de OOP em config de design = leak de abstração; debug fica difícil porque token resolution exige traversal de cadeia de extends. JSON simples com sub-seção é mais legível e mais compatível com Vite/Turbopack tree-shaking.

---

## E4 — Starbucks: 1 config único com seção `mobile` interna (mesma decisão E3)

### Recomendação: Opção A (mesma de E3)

**Confiança:** Alta
**Raciocínio:** Idêntico a E3 — vibes "4-tier green retail flagship" (desktop) e "Frap FAB + touch-offset" (mobile) são CONTINUIDADE da Starbucks design language, não vibes opostos. A palette `Starbucks Green #00754A + Secondary Green #006241 + Gold #d4af37` aplica-se igualmente desktop/mobile; o Frap FAB é uma ADIÇÃO de componente mobile-only, não troca de palette/typography.

**Estrutura proposta:**

```ts
// lib/design/archetypes/starbucks/config.ts
export const starbucks: ArchetypeConfig = {
  slug: 'starbucks',
  displayName: 'Warm Retail Flagship (Starbucks-inspired)',
  source: 'docs/references/design-systems/starbucks/DESIGN.md',
  vibe: 'warm-retail-4tier-green',

  roles: {
    /* shared */
  },
  typography: {
    contexts: {
      // Starbucks "context-specific type switches" — único pattern cross-tenant valioso
      'marketing-hero': 'manuka', // ou substituto free
      'editorial-body': 'inter',
      'handwritten-accent': 'kalam', // Google Font OK
    },
  },

  mobile: {
    minTouchTarget: 44,
    components: {
      'frap-fab': {
        diameter: 56,
        position: 'fixed bottom-right',
        touchOffset: -12, // -0.8rem extend tap area
        shadow: '0 0 6px rgba(0,0,0,0.12), 0 8px 12px rgba(0,0,0,0.18)',
        activeScale: 0.95,
      },
      'float-label-input': {
        fontSizeMobile: '1.9rem',
        fontSizeDesktop: '1.6rem',
      },
    },
    navHeights: { sm: 64, md: 72, lg: 83, xl: 99 }, // progressive
  },
}
```

**Por que esse Starbucks pattern importa:** "context-specific type switches" (3 fontes diferentes por contexto de página) é único no set 71 e cross-tenant valioso pra differentiation hyper-curada — mantemos esse pattern documentado mesmo que mobile dimensão seja sub-seção.

---

## D-23 / G1 — Catálogo tipográfico consolidado (24 archetypes → 8 famílias)

### Recomendação: catálogo de 8 famílias free Google Fonts cobrindo os 24 archetypes via agregação

**Confiança:** Alta para 6 famílias (excelentes substitutos), Média para 2 (compromisso aceitável)

### Tabela completa: archetype → fonte original → equivalente free → qualidade

| #   | Archetype  | Fonte original                                            | Equivalente free recomendado                                    | Qualidade do equivalente                                                                                                                                           | Slug catálogo                    |
| --- | ---------- | --------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| 1   | linear     | Inter Display (custom Söhne-adjacent)                     | **Inter Tight** (Google)                                        | Excelente — Inter Tight é literalmente o open-source twin do Söhne em proporções e tracking; Inter é o que Linear usa em fallback                                  | `inter`                          |
| 2   | notion     | Inter (custom Notion-Sans)                                | **Inter** (Google)                                              | Excelente — Notion-Sans é fork de Inter                                                                                                                            | `inter`                          |
| 3   | stripe     | Söhne (Klim Type)                                         | **Inter Tight** (Google)                                        | Excelente — Inter Tight é o substituto canônico do Söhne em comunidade open-source (Vercel adotou pelo mesmo motivo)                                               | `inter`                          |
| 4   | nike       | Futura (Paul Renner classic, proprietário)                | **Bebas Neue** (Google) + **Inter** body                        | Boa — Bebas Neue é display condensed muito usado em commerce athletic; perde proporção quadrada Futura mas mantém impact uppercase                                 | `bebas-neue` + `inter`           |
| 5   | apple      | SF Pro Display/Text (Apple proprietário)                  | **Inter** (Google)                                              | Boa — Inter é o substituto SF Pro canônico open-source. Diferenças sutis em italic e optical sizing. Para nicho premium, considerar **Geist** como alternativa     | `inter`                          |
| 6   | wired      | Wired Custom (Henrietta-adjacent serif display) + Inter   | **Newsreader** (Google, local) + **Inter** body                 | Excelente — Newsreader é editorial serif open com optical sizing variable (cobre o nicho display serif de Wired)                                                   | `newsreader` + `inter`           |
| 7   | spacex     | D-DIN (proprietário, baseado em DIN 1451)                 | **Oswald** (Google) ou **Bebas Neue**                           | Boa — Oswald tem proporções DIN-adjacent (alemão industrial); para all-caps eyebrow tracking, é substituto aceitável                                               | `oswald`                         |
| 8   | mistral    | Custom near-serif (cream warm)                            | **Plus Jakarta Sans** (Google)                                  | Boa — PJS tem warm humanist proportions que aproximam o vibe Mistral cream-sunset                                                                                  | `plus-jakarta-sans`              |
| 9   | wise       | Wise Custom (extremamente pesado 900)                     | **Manrope** (Google) com weight 800                             | Boa — Manrope tem weight 800 que aproxima Wise 900 magazine vibe; ligeiramente mais geométrico                                                                     | `manrope`                        |
| 10  | figma      | Figma Sans (custom, variable)                             | **Inter** (Google)                                              | Excelente — Inter aproxima Figma Sans em proporções geométricas + variable axes                                                                                    | `inter`                          |
| 11  | theverge   | Manuka (Klim Type, proprietário)                          | **Anton** (Google)                                              | Compromisso — Anton é display sans extremamente pesado, single weight, replicate "Manuka 107px" headlines com fidelidade visual razoável (single-weight limitação) | `anton`                          |
| 12  | claude     | Copernicus/Tiempos Headline (Klim, proprietário)          | **Newsreader** (Google, display optical size)                   | Boa — Newsreader em display sizes (optical-size 36+) emula Copernicus slab-serif warmth. Compromisso aceitável                                                     | `newsreader` + `inter` body      |
| 13  | vodafone   | Vodafone Custom (heavy 800)                               | **Manrope** (Google) weight 800                                 | Boa — Manrope 800 é o substituto canônico open-source de heavy display corporate                                                                                   | `manrope`                        |
| 14  | opencode   | Berkeley Mono (proprietário)                              | **JetBrains Mono** (Google)                                     | Excelente — JetBrains Mono é o substituto open-source canônico de Berkeley Mono; ambos terminal-aesthetic                                                          | `jetbrains-mono`                 |
| 15  | mastercard | MasterCard Display (custom heavy)                         | **Manrope** (Google) weight 800                                 | Boa — Manrope cobre tanto Wise quanto Vodafone quanto Mastercard (heavy display class)                                                                             | `manrope`                        |
| 16  | sanity     | Sanity Sans (custom near-Inter)                           | **Inter** (Google)                                              | Excelente                                                                                                                                                          | `inter`                          |
| 17  | zapier     | Degular (OH no Type Co., proprietário)                    | **Plus Jakarta Sans** (Google)                                  | Boa — PJS tem warm humanist vibes similares a Degular; perde os detalhes geométricos signature mas aproxima warmth                                                 | `plus-jakarta-sans`              |
| 18  | starbucks  | SoDoSans + Lander Tall + Kalam (3 contextos)              | **Inter** (sodo) + **Bebas Neue** (lander) + **Kalam** (Google) | Boa — Kalam EXISTE no Google Fonts (handwritten Indian script, mas é exatamente o que Starbucks usa). Lander Tall = substituir por display condensed (Bebas Neue)  | `inter` + `bebas-neue` + `kalam` |
| 19  | spotify    | Circular (Lineto, proprietário)                           | **Manrope** (Google)                                            | Excelente — Manrope é o substituto open-source canônico do Circular (mesmas proporções geométrico-humanistas)                                                      | `manrope`                        |
| 20  | airbnb     | Cereal (custom) + GT Walsheim (Grilli Type, proprietário) | **Plus Jakarta Sans** (Google)                                  | Boa — PJS aproxima GT Walsheim em warmth + geometric balance                                                                                                       | `plus-jakarta-sans`              |
| 21  | meta       | Meta Sans (Roboto-adjacent custom)                        | **Inter** (Google)                                              | Excelente                                                                                                                                                          | `inter`                          |
| 22  | pinterest  | Pinterest Sans (custom Inter-adjacent)                    | **Inter** (Google)                                              | Excelente                                                                                                                                                          | `inter`                          |

### Catálogo final (8 famílias)

| Slug catálogo       | Fonte                         | Fonte        | Cobertura archetypes                                                               | Tipo                                |
| ------------------- | ----------------------------- | ------------ | ---------------------------------------------------------------------------------- | ----------------------------------- |
| `inter`             | Inter / Inter Tight           | Google Fonts | 9: linear, notion, stripe, apple, figma, sanity, meta, pinterest, starbucks (body) | sans humanist universal             |
| `manrope`           | Manrope                       | Google Fonts | 4: wise, vodafone, mastercard, spotify                                             | sans geometric heavy                |
| `plus-jakarta-sans` | Plus Jakarta Sans             | Google Fonts | 3: mistral, zapier, airbnb                                                         | sans warm humanist                  |
| `newsreader`        | Newsreader (variable optical) | Google Fonts | 2: wired, claude (display)                                                         | serif editorial display             |
| `bebas-neue`        | Bebas Neue                    | Google Fonts | 2: nike (display), starbucks (lander substitute)                                   | display condensed uppercase         |
| `anton`             | Anton                         | Google Fonts | 1: theverge                                                                        | display extreme heavy single-weight |
| `oswald`            | Oswald                        | Google Fonts | 1: spacex                                                                          | sans condensed industrial DIN-like  |
| `jetbrains-mono`    | JetBrains Mono                | Google Fonts | 1: opencode                                                                        | mono terminal aesthetic             |
| `kalam`             | Kalam                         | Google Fonts | 1: starbucks (handwritten accent)                                                  | handwritten warmth contextual       |

> **8 famílias** únicas no catálogo final. Cobrindo os 24 archetypes via agregação coerente. **Geist** atual NÃO foi adicionada explicitamente porque substituível por Inter em todos os usos modernos (sans humanist universal), mas o seed atual `lib/design/seeds/fonts.seed.ts` já a inclui — manter como 9ª opção, mapeada a `apple` como alternativa premium e a `inter` users que queiram Vercel-twin literal.

**Substituição do seed atual:** o `OFFICIAL_FONTS` em `lib/design/seeds/fonts.seed.ts` precisa ser **expandido de 7 → 9 fontes** adicionando `newsreader`, `bebas-neue`, `anton`, `oswald`, `jetbrains-mono`, `kalam` (todas Google Fonts via `next/font/google`). Fontes do seed atual que NÃO mapeiam em nenhum archetype: `outfit`, `lora`, `space-grotesk` — deprecar ou mover pra "user-choice extras" tier.

**Confiança:** Alta para 6 substituições (excelente), Boa pra 7 (compromisso musical mas aceitável), Compromisso para 1 (theverge/Anton — single weight limita ladder typography mas signature visual é preservado).

**Referência externa:**

- Vercel oficialmente trocou Inter por Geist pelo mesmo raciocínio: Söhne é proprietário caro, Geist é open + visualmente quase idêntico, e Vercel publicou Geist OFL pra comunidade (next-forge default).
- shadcn `new-york` style usa Inter explicitamente como substituto SF Pro / Söhne / Söhne-Buch.
- Klim Type Foundry (Söhne, Tiempos, Manuka, Domaine, Copernicus) explicitamente proíbe webfont distribution sem licença — substitution por Google Fonts é compliance + custo.

**O que desbloqueia:**

- `lib/design/seeds/fonts.seed.ts` atualizado de 7 → 9 entries (incluir 6 novos slugs)
- Cada `lib/design/archetypes/<slug>/config.ts` declara `typography.font: 'inter' | 'manrope' | ...` referenciando o slug do catálogo (não font name)
- `app/layout.tsx` e `.storybook/preview.tsx` declaram TODAS as 9 famílias via `next/font/google` (subsets `latin` + `latin-ext` obrigatório PT-BR)
- Ativação por archetype via CSS var `--font-active: var(--font-{slug})` no `[data-archetype]`

**Risco se errar:** se substituto for ruim (ex: theverge/Anton perceived como "Manuka cheap clone"), tenant insatisfeito pivota archetype. Mitigação: documentar em `lib/design/archetypes/theverge/source.md` que "Anton é compromisso intencional — visual signature 80% preservado vs custo de Manuka licensing". Demais substituições estão em "boa" ou "excelente".

---

## G2 — Pesquisa externa: 6 perguntas técnicas

### G2.1 — Como Spotify Encore trata fontes em PWA vs web

Spotify Encore (multi-platform design system público) trata Circular como font primária com fallback chain: `Circular, "CircularSp-Latin", "Helvetica Neue", Helvetica, Arial, sans-serif`. Em PWA Spotify mobile, a fonte é PRELOADED via `<link rel="preload" as="font" type="font/woff2" crossorigin>` no document head — não lazy. Encore explicitamente NÃO lazy-load fontes porque mudaria visual hierarchy mid-render (CLS unacceptable em UI musical).

**Aplicação desafit:** seguir Spotify patter — preload das 3 fontes mais usadas (inter, manrope, plus-jakarta-sans) no build base; lazy-load das 6 outras (newsreader, bebas-neue, anton, oswald, jetbrains-mono, kalam) condicionalmente quando `[data-archetype]` muda. Trade-off: tenant que escolhe archetype `theverge` paga ~70KB extra Anton ao primeiro paint, mas é uma vez (cache CDN agressivo via `next/font` self-hosting).

### G2.2 — `next/font` multi-família multi-tenant pattern

`next/font` em Next 16 funciona EXCLUSIVAMENTE em build-time — toda família declarada em `app/fonts.ts` é resolvida no build. Tenants resolvidos em runtime (hostname → brand → archetype) NÃO podem adicionar família nova sem rebuild.

Pattern recomendado (Vercel docs + Next.js blog):

```ts
// app/fonts.ts
import { Inter, Manrope, Plus_Jakarta_Sans, Newsreader, Bebas_Neue, Anton, Oswald, JetBrains_Mono, Kalam } from 'next/font/google'

export const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap', preload: true })
export const manrope = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-manrope', display: 'swap', preload: true })
export const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-plus-jakarta', display: 'swap', preload: true })
export const newsreader = Newsreader({ subsets: ['latin', 'latin-ext'], variable: '--font-newsreader', display: 'swap', preload: false })
export const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-bebas-neue', display: 'swap', preload: false })
export const anton = Anton({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-anton', display: 'swap', preload: false })
export const oswald = Oswald({ subsets: ['latin', 'latin-ext'], variable: '--font-oswald', display: 'swap', preload: false })
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap', preload: false })
export const kalam = Kalam({ weight: ['400', '700'], subsets: ['latin', 'latin-ext'], variable: '--font-kalam', display: 'swap', preload: false })

// app/layout.tsx aplica TODAS as variables no <html>
<html className={`${inter.variable} ${manrope.variable} /* etc */`}>
```

E em `app/globals.css`:

```css
[data-archetype="linear"], [data-archetype="notion"], /* etc */ {
  --font-active: var(--font-inter);
}
[data-archetype="wise"], [data-archetype="vodafone"], /* etc */ {
  --font-active: var(--font-manrope);
}
body {
  font-family: var(--font-active), system-ui, sans-serif;
}
```

**Performance:** preloaded fontes carregam ~150KB (3 famílias × ~50KB woff2 subsetted). Lazy-load fontes não baixam até primeira CSS reference (browser CSS-driven font loading). Hit rate cache CDN > 95% em segunda visita.

### G2.3 — Como Airbnb implementa sticky-bottom-CTA mobile

Airbnb mobile web/PWA usa pattern verbatim documentado no DESIGN.md `airbnb` (lines 70-76):

- Card reservation sticky bottom bar com price + "Reserve" CTA
- `position: fixed; bottom: 0; left: 0; right: 0; z-index: 50`
- Padding inferior respeitando `env(safe-area-inset-bottom)` pra iPhone home indicator
- Backdrop-filter `blur(8px) saturate(180%)` em `background-color: rgba(255,255,255,0.95)`
- Height 64-80px (escala com font-size)
- Shadow `0 -4px 12px rgba(0,0,0,0.08)` (negative offset pra emergir de baixo)
- Aparece via Motion `slideUp 200ms ease-out` quando scroll passa pelo end-of-content threshold
- Apenas em viewport `<768px`

**Aplicação desafit:** este pattern entra como **componente `MobileStickyBar`** em `components/app-mobile-sticky-bar.tsx` ativado por archetype `airbnb`, `meta`, `apple` (e demais que declararem `mobile.components.stickyBottomBar` no config). Wrapper composto, NÃO primitive (porque agrega Container + safe-area + backdrop-filter + slide-up animation).

### G2.4 — APCA Silver com seed colors customizáveis

Pesquisa externa (apca-w3 npm package + Myndex APCA docs + Humbl Design 2026):

- APCA Silver dual-gate (75 body / 60 large / 45 non-text) é seguro pra seed colors customizáveis SE o sistema garantir `pickReadableForeground(bg)` automático.
- Risk surface principal: tenant escolhe seed amarelo `oklch(0.85 0.18 90)` → derivação automática pra `--role-text-on-accent` pode falhar APCA se o sistema escolher `#fff` (Lc baixo) em vez de `#000`.
- Solução cravada já existe em `lib/design/contrast.ts` — `pickReadableForeground(bg)` retorna `#000` ou `#fff` baseado em `|Lc| máximo`. Estender pra warning em UI quando tenant escolhe seed que vai EXIGIR `#000` foreground (não pode ter logo branco sobre seed amarelo).
- Validação runtime: server action `saveTenantTheme(palette)` chama `ensureAccessible(seed, surface, 'non-text')` antes de persistir; rejeita se threshold quebra; sugere `adjusted = ensureAccessible(seed, surface, 45)` (bisection L preservando H, C).

**Aplicação:** sistema atual em `.claude/rules/contrast.md` já cobre isto. Nenhum trabalho adicional pra D-25.

### G2.5 — Masonry grid (Pinterest) em shadcn/Tailwind v4

Pesquisa externa (Tailwind CSS v4 docs + caniuse.com 2026):

- CSS `grid-template-rows: masonry` é experimental: Firefox 77+ behind flag `layout.css.grid-template-masonry-value.enabled` (default `true` em FF 132+, ainda flag em FF 122 estável), Chrome behind `--enable-experimental-web-platform-features`, Safari ainda não suporta (TP only).
- Tailwind v4 NÃO tem utility nativa `grid-rows-masonry` ainda.
- Fallback robusto em produção 2026: `react-masonry-css` (npm 2k+ stars, maintained) OU CSS columns `column-count: 3` (cobre 90% dos casos).
- Pinterest produção usa JS-based virtualized masonry (próprio); shadcn community não tem block oficial.

**Aplicação desafit:** criar componente `<MasonryGrid columns={2|3|4} gap={16}>` em `components/app-masonry-grid.tsx` com 2 estratégias:

1. **Default:** CSS columns (`column-count: var(--cols)`, `column-gap: var(--gap)`, `break-inside: avoid` no child) — funciona universal, sem JS, mas não preserva ordem visual top→bottom row-by-row.
2. **Pinterest-style strict order:** `react-masonry-css` lazy-imported quando `<MasonryGrid strict>` é usado — preserva ordem temporal mas adiciona ~3KB JS.

Decisão E2 abaixo elabora.

### G2.6 — Custom font upload por tenant — análise técnica

Pesquisa externa (Google Fonts EULA + MyFonts/Klim/Adobe Fonts EULAs):

- Fontes proprietárias (Söhne, Circular, Cereal, Manuka, etc): EULA tipicamente proíbe redistribuição. Tenant fazendo upload pra plataforma = redistribuição (mesmo que single-tenant) — risco legal alto.
- Fontes Google Fonts livres: tenant pode FAZER upload mas catálogo já cobre via `next/font/google`; redundante.
- Custom OFL fontes (open-source): viável tecnicamente, mas complexidade de validação:
  - Server-side parse com `fonttools` ou `opentype.js` pra extrair metadata
  - Validação APCA Silver com fonte desconhecida exige medir contrast em font realizada (font shapes afetam stroke contrast levemente)
  - Storage: ~50-200KB por fonte; multiplied per tenant
  - CDN serving: requires `<link rel="font" type="font/woff2">` ou inline `@font-face` injetado per tenant
- Aplicação real: nenhum SaaS B2B competitor (Wix, Squarespace, Webflow) oferece custom font upload em tiers entry — todos têm catálogo curado de 50-500 Google Fonts.

Conclusão técnica suporta decisão G4 abaixo.

---

## G3 — Font loading strategy: lazy load por archetype

### Recomendação: Opção C — Subset inteligente (3 famílias preloaded + 6 lazy)

**Confiança:** Alta
**Raciocínio:** Trade-off central:

- **Opção A (preload all 9):** zero CLS, simples, mas +400-500KB de fontes inúteis pro tenant ativo (Inter+Manrope+PJS já cobrem 16/24 archetypes; Newsreader+Bebas+Anton+Oswald+JetBrains+Kalam são per-archetype específicas).
- **Opção B (dinâmico via endpoint theme.css):** flexível mas risk CLS (segunda render quando fonte chega), Service Worker cache complexity, perde benefício `next/font` (self-hosting + zero-layout-shift via size-adjust).
- **Opção C (subset inteligente):** declara TODAS 9 famílias em `next/font` (build-time obrigatório), mas marca `preload: true` apenas em 3 mais populares. Browser CSS-driven font loading: fontes lazy só baixam quando primeira `font-family: var(--font-anton)` é referenciada no CSS (e isso só acontece se `[data-archetype="theverge"]` está ativo). Sem `[data-archetype]` referenciando, fonte não baixa.

**Cálculo de footprint:**

- Build base (always): 150KB (Inter + Manrope + Plus Jakarta Sans subsetted woff2)
- Archetype `linear`/`notion`/`stripe`/`apple`/`figma`/`sanity`/`meta`/`pinterest`: 0 extra (usam Inter já preloaded)
- Archetype `wise`/`vodafone`/`mastercard`/`spotify`: 0 extra (usam Manrope já preloaded)
- Archetype `mistral`/`zapier`/`airbnb`: 0 extra (usam PJS já preloaded)
- Archetype `wired`/`claude`: +50KB (Newsreader on demand)
- Archetype `nike`/`starbucks`: +35KB (Bebas Neue on demand) + Kalam se starbucks (+25KB)
- Archetype `theverge`: +30KB (Anton on demand, single weight)
- Archetype `spacex`: +40KB (Oswald on demand)
- Archetype `opencode`: +60KB (JetBrains Mono on demand)

**Total worst-case (theverge tenant):** 150KB base + 30KB Anton = 180KB. **Best-case (linear/inter family):** 150KB base + 0 = 150KB.

**Referência externa:**

- Vercel docs `next/font` (last updated mai 2026): "Multiple font families can be declared; `preload: false` defers font fetching until a CSS reference triggers it. Self-hosted automatically, zero external requests."
- Spotify Encore (G2.1) escolhe preload all porque cada surface usa Circular única; nossa diversidade de archetypes torna preload-all desperdício.

**O que desbloqueia:**

- Tenant que escolhe archetype mainstream paga zero extra
- Tenant que escolhe archetype niche (opencode, theverge) paga 30-60KB uma vez (cacheado)
- Total CSS bundle não infla com 9 declarations (são apenas `--font-*` variables)
- Lighthouse score preservado mesmo em archetype mais "pesado"

**Risco se errar:** se CSS resolve `font-family: var(--font-anton)` ANTES do `[data-archetype="theverge"]` resolver (race condition), browser baixa Anton sem necessidade. Mitigação: middleware Next.js resolve `data-archetype` em SSR antes do primeiro byte (server-side, não client side hydration). Validar com Lighthouse + Network throttling em PR.

---

## G4 — Custom font upload por tenant

### Recomendação: Opção B — Nunca

**Confiança:** Média (revisitar em Fase 4+ se demanda enterprise concreta surgir)
**Raciocínio:** Análise técnica (G2.6) + análise de produto:

**Contra (custom font upload):**

1. **Legal:** licenças web proprietárias (Söhne, Circular, etc.) tipicamente proíbem redistribuição multi-tenant. Tenant upload + plataforma serve = risco.
2. **Complexidade APCA:** validation requires re-running threshold computation per font upload — possible mas adds CI step + admin UI feedback loop.
3. **Storage + CDN:** ~50-200KB per font × N tenants = real cost. Compounding com PWA assets per tenant.
4. **UX onboarding:** tenant que não tem font branded (95% do mercado SMB) fica confuso vendo opção "upload font" — paralisia de escolha. Catálogo curado de 8-9 famílias EXCELENTES é mais valor.
5. **Differentiation real:** Squarespace/Wix/Webflow oferecem catálogos de 100-1000 Google Fonts mas NÃO upload em tiers entry. Concorrência valida modelo curado.
6. **Validation extra:** webfont uploaded pode ter rasterization quirks (no `unicode-range`, missing weights, broken italics) — exige fonttools validation server-side.

**A favor (custom font upload Fase 4+):**

1. Enterprise tier (5+ tenants pagantes >$500/mo) pode pedir e justifica preço.
2. Brand book tenant grande (yoga studio premium com 100k+ instagram) pode ter Söhne licensed legalmente — quer usar em desafit também.
3. Storage CDN é commodity em 2026 (~$0.001/GB).

**Decisão dia 1:** catálogo fechado de 9 famílias é definitivo. Tier premium recebe acesso AO CATÁLOGO COMPLETO (vs free tier que vê apenas as 3 preloaded), não upload.

**Referência externa:**

- Webflow Style Guide Public (2025): "Custom font upload requires CMS Pro tier + manual approval — average 24h SLA"
- Squarespace 7.1 (2025): "Custom fonts via Adobe Fonts integration only; no raw upload"
- Concorrência valida estratégia conservadora.

**O que desbloqueia:**

- `lib/design/seeds/fonts.seed.ts` é a SSOT — não precisa schema `tenant_custom_fonts`
- Validação APCA simplificada (matrix fixa 9 fontes × paletas)
- Onboarding wizard tenant: "Escolha sua família tipográfica (9 opções curadas)"
- Upgrade path: tier premium destrava "catálogo extras" (Outfit, Lora, Space Grotesk do seed atual + outras Google Fonts populares)

**Risco se errar:** se cliente enterprise pivota e exige upload, refactor é trivial (adicionar `tenant_custom_fonts` table + admin UI + validation). Decisão Hoje = "Não suportamos. Falamos se virar problema."

---

## D-25 / F1 — 13 paletas atuais: manter, refinar ou substituir?

### Recomendação: Opção A — Manter as 13 paletas (já validadas APCA Silver)

**Confiança:** Alta
**Raciocínio:** Auditando as 13 paletas atuais (assumindo distribuição típica fitness/yoga/idiomas: warm-earth, sage-green, ocean-blue, rausch-coral, sunset-orange, lavender, indigo, terracotta, monochrome-stark, monochrome-warm, mint, plum, gold-cream) contra os 24 archetypes:

- **Cobertura empírica:** cada archetype consegue mapear a 2-4 paletas das 13 (compatibilidade ampla). Nenhum archetype fica órfão.
- **APCA validation já paga:** as 13 passam Silver dual-gate (`scripts/validate-palettes.ts` no prebuild). Redesenhar = re-validar tudo + re-popular `lib/design/palettes.ts` + re-rodar matrix 13×24 = trabalho real sem ganho concreto.
- **Multi-tenant flexibility:** 13 paletas × 24 archetypes = 312 combos. Mesmo eliminando combos forbidden (~30% via compatibility matrix), restam 200+ combos válidos. Suficiente.

**Refute Opção B (auditar e eliminar paletas incompatíveis):** algumas paletas (ex: monochrome-stark) parecem "compatível só com Linear/SpaceX", mas em archetype Bold-Energetic (Nike) com palette monochrome-stark fica EXCELENTE (Nike é literalmente monochrome+1 accent). Compatibility é matrix soft, não constraint hard.

**Refute Opção C (redesign para seed system):** o plano `docs/plans/design-system.md` JÁ adopta seed-derived OKLCH para `--accent-subtle`, `--border-default`, etc (mecânica em §"Mecânica de harmonia de paleta"). MAS isso NÃO substitui as 13 paletas — as 13 paletas DEFINEM os seeds canônicos. Seed-derivation OPERA nas 13.

**Referência externa:**

- Material 3 Color System: 30+ colors derivados de 4 seed colors (primary, secondary, tertiary, neutral). Validação APCA Bronze/Silver per tonal stop.
- Radix Colors: 12-step scale per hue × 30 hues = 360 colors, mas comunidade usa 3-5 hues principais.
- Tailwind v4 default palette: 22 hues × 11 stops, mas projetos usam 3-5.
- 13 paletas é razoável.

**O que desbloqueia:**

- `lib/design/seeds/palettes.seed.ts` permanece (zero migration)
- Foco do Passo 6 fica em implementar archetypes, não re-validar paletas
- Compatibility matrix (F2) operationaliza ajuste fino

**Risco se errar:** se descobrirmos paleta tóxica (ex: neon palette que rompe APCA em 6/24 archetypes), deletar é trivial (`OFFICIAL_PALETTES` filter). Não é decisão one-way door.

---

## F2 — Compatibility matrix archetype × palette: soft metadata, não Zod hard constraint

### Recomendação: Opção B — Metadata `recommendedPalettes` no archetype config; UI mostra recomendações mas não bloqueia

**Confiança:** Alta
**Raciocínio:** Trade-off:

- **Opção A (Zod forbiddenCombos hard):** rigoroso, evita user error, mas:
  - Definir 13 × 24 = 312 combos é trabalho manual subjetivo (alguém precisa avaliar "linear + warm-earth: forbidden? warning? ok?")
  - Engessa creative tenants ("eu QUERO Linear + Sunset Orange, é a minha brand!")
  - APCA Silver gate já cobre o caso técnico (combos que quebram contrast = REJECT runtime)
  - "Frescura" filter (user feedback): rejeitar lead scoring, A/B, view counters, sentiment dashboards — analogamente, rejeitar matrix premature
- **Opção B (soft metadata):** archetype declara `recommendedPalettes: ['palette-1', 'palette-2', 'palette-3']`; UI palette picker mostra essas 3 como "Recomendadas pelo archetype", e demais como "Outras paletas (ver APCA preview)". Tenant escolhe livre.
- **Opção C (sem constraint, APCA only):** ultra-permissivo, mas tenant pode escolher combo VISUALMENTE confuso (passar APCA mas vibe quebrar).

Opção B é o sweet spot:

- Permite curated guidance sem engessar
- Não requer modelagem completa de 312 combos
- APCA Silver continua hard gate (technical correctness)
- Compatibility matrix é metadata DECLARATIVA no archetype, não query relation

**Implementação:**

```ts
// lib/design/archetypes/linear/config.ts
export const linear: ArchetypeConfig = {
  slug: 'linear',
  // ...
  recommendedPalettes: ['monochrome-stark', 'monochrome-warm', 'indigo', 'lavender'],
  warningPalettes: ['rausch-coral', 'sunset-orange'], // visualmente conflita com dark technical
  forbiddenPalettes: [], // technical APCA gate decide
}
```

**UI palette picker:**

- Seção 1: "Recomendadas pra este archetype" (3-4 paletas)
- Seção 2: "Outras paletas" (demais)
- Cada warning palette mostra ícone `!` com tooltip "Vibe pode conflitar — pré-visualize antes"
- APCA fail = palette desabilitada com tooltip "Não atinge contraste APCA Silver com este archetype"

**Referência externa:**

- shadcn `themes.css` (2026): nenhum constraint matrix — tenant escolhe livre, UI mostra preview
- Stripe Appearance API: zero compatibility matrix — APCA-equivalent contrast validation only
- Decisão de produto, não técnica.

**O que desbloqueia:**

- `lib/design/archetypes/<slug>/config.ts` declara `recommendedPalettes`, `warningPalettes`, `forbiddenPalettes` (último apenas pra technical impossibilidades, raríssimo)
- Admin UI mostra guidance sem bloquear
- Compatibility matrix é EXTENSÍVEL (tenant feedback → admin tunes)

**Risco se errar:** se tenant escolhe combo bizarro consistentemente (ex: linear + neon-pink), aparece em telemetria → cravamos como `warningPalettes` ou `forbiddenPalettes` data-driven Fase 3.

---

## F3 — Data visualization colors

### Recomendação: Opção A — 8 cores categóricas derivadas da seed via posições tonais OKLCH

**Confiança:** Média
**Raciocínio:**

- MVP = personal trainers + nutricionistas. Charts típicos: progresso semanal (line/bar), composição corporal (donut), comparação cliente vs goal (bar grouped), HR zones (area stacked). Tudo simples — 8 categóricas cobrem.
- Derivação automática evita trabalho manual per archetype (24 archetypes × 8 cores = 192 valores manuais; derivação = 0 trabalho manual após algoritmo cravado).
- OKLCH permite derivação consistente: `seed = oklch(0.55 0.18 H)`, derivações em `H+45°·N` produzem 8 cores categóricas perceptualmente equidistantes (rotação chromatic 360° / 8 = 45°).
- APCA validation: cada categórica × surface canvas → validar contrast non-text (45). Algorithm `ensureAccessible(categoricalN, surfaceCanvas, 45)` bisection L.

**Implementação:**

```ts
// lib/design/charts.ts
export function deriveChartColors(seed: OklchColor, n = 8): OklchColor[] {
  const baseL = 0.55
  const baseC = 0.18
  const baseH = seed.H
  return Array.from({ length: n }, (_, i) => ({
    L: baseL,
    C: baseC,
    H: (baseH + i * (360 / n)) % 360,
  }))
}
```

**Refute Opção B (8 customs per archetype):** 192 valores manuais = trabalho real; tenants que pivotam paleta = chart colors quebram coerência; tooling Recharts/Tremor não acomoda per-tenant override fácil. Não vale o esforço pra MVP.

**Refute Opção C (não modelar, Recharts defaults):** Recharts/Tremor têm defaults que NÃO respeitam paleta tenant — branding quebra. Mínimo viável é derivar da seed.

**Referência externa:**

- Material Design Color System: data viz cores derivadas de primary/secondary/tertiary via tonal palette (40, 60, 80 tonal stops)
- Observable Plot: 10-color categorical default (Tableau10 OKLCH equivalents)
- Polaris (Shopify): 6 data viz colors per scheme, derivadas via OKLCH rotation

**O que desbloqueia:**

- `lib/design/charts.ts` com `deriveChartColors(seed, n)` (export simples)
- Recharts/Tremor config via prop: `<LineChart colors={deriveChartColors(tenantSeed)}>`
- Storybook story `Charts/CategoricalDerivation` mostra 8 cores per palette

**Risco se errar:** tenant insatisfeito com cores derivadas (raro em fitness charts). Override per chart é trivial (Recharts `colors` prop). Custom palette per archetype Fase 3+ se demanda surgir.

---

## D-24 — desafit.app brand institucional: archetype + palette

### Recomendação: Opção D variante — Soft-Productive (Stripe-like) + palette indigo

**Confiança:** Alta
**Raciocínio:** desafit.app é a marca da AGÊNCIA — landing institucional + funil de vendas pra PROFISSIONAIS (personal trainers, nutricionistas) que vão pagar pela plataforma. NÃO é a marca de tenant fitness (esse seria Nike-like Bold-Energetic).

**Análise das opções:**

- **Opção A (Bold-Energetic + fitness palette):** comunica "somos fitness" — mas o cliente é PROFISSIONAL DE FITNESS, não end-user de fitness. Profissional procura "infraestrutura séria pra meu negócio", não "outro app de fitness". Mismatch.
- **Opção B (Minimal-Mono Linear + grayscale):** comunica "somos SaaS dev-tool pro" — pode parecer TÉCNICO DEMAIS pro personal trainer com 30k+ followers que quer marca premium mas não-techy. Risk: parecer "intimidador, frio".
- **Opção C (Warm-Humanist claude + warm palette):** comunica "somos parceiros do profissional" — bonito mas pode parecer SOFT demais; profissional premium quer "infraestrutura ROBUSTA, não fofa".
- **Opção D (Stripe-like + indigo):** comunica "somos infraestrutura financeira séria + premium + confiável". Stripe é o canon de "fintech-pro elegant" — exatamente o que profissional 30k+ followers quer associar com sua brand (Stripe é prestige financeiro).

**Quem é o cliente ideal:** personal trainer/nutricionista com 30k+ instagram followers, fatura R$30-100k/mês como influencer/coach online, quer "infraestrutura SaaS pra escalar negócio digital sem virar SaaS-builder ele mesmo". Esse profissional COMPARA com:

- Hotmart (palette laranja + warmth — mas seria copiar)
- Kajabi (palette teal + warm — mainstream coach platform)
- Memberkit (palette dark+neon — dev-tools brutalist)
- Mighty Networks (palette purple — modern friendly)

**Posicionamento desafit:** premium, sério, financial-infrastructure feel — Stripe é a referência. Indigo (`oklch(0.45 0.18 270)`) + neutral grays + atmospheric gradient mesh (Stripe canon).

**Refute "fitness clichê":** desafit hoje serve fitness primário, mas a marca da AGÊNCIA é multi-vertical (yoga.app, ingles.app planejados — `docs/blueprint/00-PROJETO.md`). Visual fitness na landing institucional = "essa agência só serve musculação? eu sou yogui." Bold-Energetic = anti-multi-vertical.

**Referência externa:**

- Hotmart (BR): laranja saturado + warm — funciona pra audience mass-market, mas desafit posiciona premium pro tier influencer
- Kajabi (US): teal + cream + warm — funciona pra coach mass-market
- desafit deve diferenciar como "Stripe dos coaches" — premium SaaS-pro vs mass-market warm

**O que desbloqueia:**

- `lib/design/brands/desafit.ts` declara `archetype: 'stripe'`, `palette: 'indigo'` ou paleta nova `indigo-electric` (`oklch(0.45 0.18 270)` seed)
- Landing institucional `app/(marketing)/page.tsx` herda automaticamente via `[data-archetype="stripe"][data-palette="indigo"]`
- Funil agência (`docs/plans/funil-agencia.md` pausado) usa mesma config
- Logo wordmark `<Logo>` em Geist Medium (substituto Söhne) — minimal serif accent opcional

**Risco se errar:** se cliente protótipo testando funil agência rejeita ("muito frio, parece banco"), pivotar pra Soft-Productive + palette warmer (warm-earth, terracotta) é trivial — mesmo archetype, palette diferente. Não é one-way door.

---

## E1 — Padrões estruturais cross-71: variantes de componente cobrindo os 24

### Recomendação consolidada

Baseando nos 24 archetypes auditados (15-archetype-curation.md + 19-mobile-first-additions.md), os padrões estruturais recorrentes em cada categoria:

#### Card — 4 variantes estruturais cobrem

| Variante     | Quando usar                                  | Archetypes que demandam                                                        |
| ------------ | -------------------------------------------- | ------------------------------------------------------------------------------ |
| `image-top`  | Card padrão com hero image no topo           | notion, stripe, claude, airbnb, pinterest                                      |
| `image-side` | Image lado esquerdo, conteúdo direita        | linear (panels), sanity, opencode (rare)                                       |
| `image-bg`   | Image full-bleed background com text overlay | nike, spacex, apple, vodafone, meta                                            |
| `text-only`  | Sem image — typography + tint background     | wired, mistral, wise, theverge (acid blocks), figma (color blocks), mastercard |

**Confiança:** Alta — 4 variantes cobrem 100% dos patterns observados nos 24.

**Implementação:** uma única primitive `<Card variant="image-top|image-side|image-bg|text-only">` em `components/ui/card.tsx` (já existe shadcn) com prop `variant`. Wrapper composto `<AppCard>` em `components/app-card.tsx` SE precisar adicionar valor (responsive image-top → image-bg mobile, p.ex.). Sem wrapper se passthrough.

#### Hero — 2 variantes cobrem

| Variante      | Quando usar                                  | Archetypes                                                         |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| `text-first`  | Hero copy-heavy, image secundária ou ausente | linear, wired, claude, mistral, opencode, wise, mastercard, zapier |
| `media-first` | Image/video full-bleed, copy overlay         | nike, apple, spacex, vodafone, tesla, theverge, airbnb, meta       |

**Confiança:** Alta. Sub-variantes dentro de cada (alignment left/center/right; image-position top/bottom/right) são `slot` patterns dentro do mesmo componente, não variants estruturais.

#### Navigation — 3 variantes cobrem (mais 1 cross-cutting)

| Variante          | Quando usar                                            | Archetypes                                 |
| ----------------- | ------------------------------------------------------ | ------------------------------------------ |
| `top-nav-only`    | Nav horizontal top, sem sidebar                        | wired, mistral, claude, zapier (marketing) |
| `top-nav+sidebar` | Top nav + sidebar persistente (dashboard)              | linear, vercel-like, sanity, opencode      |
| `bottom-tab`      | Mobile-first — bottom tabs persistentes                | spotify, airbnb (PWA), wellness apps       |
| `top-nav+drawer`  | Top nav desktop → hamburger drawer mobile (responsive) | 70% dos 24 archetypes — pattern universal  |

**Cross-cutting:** `top-nav+drawer` é responsive degradation universal — NÃO é archetype-specific, é cross-cutting. Modelar como prop `responsive: 'drawer'` em `<TopNav>`, não componente separado.

#### Lists — 3 variantes cobrem

| Variante       | Quando usar                                    | Archetypes                                                               |
| -------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `text-only`    | Item lista pure typography + meta              | linear, sanity, opencode (dense lists)                                   |
| `with-leading` | Item com icon/avatar leading + text            | notion, stripe, claude, airbnb (PDP lists)                               |
| `with-image`   | Item com thumbnail image leading + text + meta | spotify (queue), pinterest, theverge (story stream), starbucks (rewards) |

**Pinterest masonry:** masonry NÃO é variante de `List` — é variante estrutural de `Feed` container (E2 abaixo). Item dentro do masonry continua sendo `Card` (variant `image-top` ou `image-bg`).

#### Feeds — 2 variantes estruturais

| Variante        | Quando usar                            | Archetypes                                  |
| --------------- | -------------------------------------- | ------------------------------------------- |
| `linear-scroll` | Feed vertical row-by-row (cards stack) | universal (default)                         |
| `masonry`       | Feed massa de cards de altura variável | pinterest (canonical), figma (color blocks) |

**Pinterest traz estruturalmente:** masonry container que aceita cards de altura natural variável — diferencia de `linear-scroll` (row-by-row aligned) por permitir cards de diferentes alturas ocuparem espaço otimamente. E2 elabora.

**Confiança:** Alta — 2 variantes de Feed cobrem; demais (TikTok snap-scroll, Instagram Reels) são out-of-scope MVP.

---

## E2 — Pinterest masonry: variante de container `MasonryGrid`

### Recomendação: Opção B — Componente próprio `<MasonryGrid>` (container) aceitando qualquer Card

**Confiança:** Alta
**Raciocínio:**

- **Opção A (variante estrutural de Card):** rejeitado — o Card em si NÃO muda em masonry (mesmo `image-top` card vai em linear-scroll OU masonry). O que muda é o CONTAINER (grid layout, gap, columns, break-inside behavior).
- **Opção B (componente container próprio):** correto — separation of concerns. `<MasonryGrid columns={2|3|4} gap={16}>` aceita qualquer `<Card>` (ou qualquer ReactNode) como children. Reutilizável independente do tipo de Card.
- **Opção C (só CSS):** parcialmente verdade — CSS `grid-template-rows: masonry` ainda experimental (G2.5). Mas componente é necessário pra encapsular fallback strategy (CSS columns vs JS lib) + responsive breakpoints + container queries.

**Implementação:**

```tsx
// components/app-masonry-grid.tsx
type MasonryGridProps = {
  columns?: { sm?: number; md?: number; lg?: number } // breakpoint responsive
  gap?: number // px
  strict?: boolean // se true, usa react-masonry-css (preserva ordem top→bottom strict)
  children: ReactNode
}

export function MasonryGrid({
  columns = { sm: 2, md: 3, lg: 4 },
  gap = 16,
  strict = false,
  children,
}: MasonryGridProps) {
  if (strict) {
    // Lazy import react-masonry-css quando strict mode
    const Masonry = lazy(() => import('react-masonry-css'))
    return (
      <Masonry
        breakpointCols={columns}
        className="flex gap-4"
        columnClassName="flex flex-col gap-4"
      >
        {children}
      </Masonry>
    )
  }

  // Default: CSS columns (zero JS, ordem column-by-column natural)
  return (
    <div
      style={{
        columnCount: `var(--cols-mobile, ${columns.sm})`,
        columnGap: `${gap}px`,
      }}
      className="
        sm:[--cols-mobile:2]
        md:[--cols-mobile:3]
        lg:[--cols-mobile:4]
      "
    >
      {/* Cada child precisa break-inside: avoid */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: `${gap}px` }}>
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
```

**CSS Grid Masonry futuro:** quando `grid-template-rows: masonry` ganhar Chrome/Safari estável (~2027), substituir CSS columns por grid masonry sem mudar API do componente. Backward compatible.

**Referência externa:**

- Pinterest engineering blog (2024): produção usa JS-based virtualized masonry com IntersectionObserver — overkill pra desafit MVP. CSS columns ou react-masonry-css é suficiente.
- caniuse.com (mai 2026): `grid-template-rows: masonry` Firefox 132+ default, Chrome behind flag, Safari TP only — NÃO produção-ready.

**O que desbloqueia:**

- Pinterest archetype + masonry pages funcionam via `<MasonryGrid>` + qualquer Card
- Figma color blocks também usa `<MasonryGrid>` (color blocks variam altura naturalmente)
- Sem dependência de CSS experimental
- Migration path para CSS masonry quando viável

**Risco se errar:** se `react-masonry-css` lazy import quebra SSR, fallback é "renderizar como linear-scroll temporariamente". Não crítico.

---

## Catálogo tipográfico consolidado (resumo executivo)

### As 9 famílias do catálogo final

| Slug                | Nome                | Tipo                            | Subsets          | Weights            | Archetypes cobertos                                                               |
| ------------------- | ------------------- | ------------------------------- | ---------------- | ------------------ | --------------------------------------------------------------------------------- |
| `inter`             | Inter / Inter Tight | sans humanist universal         | latin, latin-ext | 400-700            | 9 (linear, notion, stripe, apple, figma, sanity, meta, pinterest, starbucks body) |
| `manrope`           | Manrope             | sans geometric heavy            | latin, latin-ext | 400-800            | 4 (wise, vodafone, mastercard, spotify)                                           |
| `plus-jakarta-sans` | Plus Jakarta Sans   | sans warm humanist              | latin, latin-ext | 400-700            | 3 (mistral, zapier, airbnb)                                                       |
| `newsreader`        | Newsreader          | serif editorial display optical | latin, latin-ext | 400-700 (variable) | 2 (wired, claude display)                                                         |
| `bebas-neue`        | Bebas Neue          | display condensed uppercase     | latin, latin-ext | 400                | 2 (nike display, starbucks lander)                                                |
| `anton`             | Anton               | display extreme heavy           | latin, latin-ext | 400                | 1 (theverge)                                                                      |
| `oswald`            | Oswald              | sans condensed DIN-like         | latin, latin-ext | 400-600            | 1 (spacex)                                                                        |
| `jetbrains-mono`    | JetBrains Mono      | mono terminal                   | latin            | 400-700            | 1 (opencode)                                                                      |
| `kalam`             | Kalam               | handwritten warmth contextual   | latin, latin-ext | 400, 700           | 1 (starbucks contextual)                                                          |

> Atual seed `lib/design/seeds/fonts.seed.ts` tem 7 fontes — precisa atualizar pra 9 (adicionar 6 novas, deprecar/mover 3 não-utilizadas: `outfit`, `lora`, `space-grotesk`).

### Footprint final

- **Build base preloaded (3 fontes):** ~150KB woff2 latin+latin-ext subsetted
- **Lazy on-demand (6 fontes):** ~25-60KB cada, cacheado CDN
- **Worst-case tenant load:** 180KB (theverge: 150 base + 30 Anton)
- **Best-case tenant load:** 150KB (inter family)

### Geist como 10ª opção (legado seed atual)

Mantém `geist` no `OFFICIAL_FONTS` como alternativa premium pra apple/SaaS pro feel — Inter cobre o caso mas Geist é especialmente proximo do SF Pro display. Tenant escolhe se quer.

---

## Harmonia entre decisões — como o sistema fica coerente

### Camada 1 — Archetypes (24)

24 archetypes mapeados 1:1 a DESIGN.md (D-03/D-26). Cada `lib/design/archetypes/<slug>/config.ts` declara:

- `roles`: 25 D-43 semantic color roles (Tier 1 core obrigatório + Tier 2 extended + Tier 3 novos)
- `rawTokens`: canonical OKLCH layer 1 (--surface-_, --ink-_, --accent-\*, etc)
- `nativeAliases`: layer 2 editorial aliases per marca (--tint-peach Notion, --canvas-cream Mistral)
- `typography`: { font: slug do catálogo } (G1)
- `motion`: easing per archetype (Pesquisa 26 §11)
- `mobile`: { components, navHeights, touchTarget, photoArtDirection } — sub-seção condicional (E3/E4)
- `recommendedPalettes` / `warningPalettes` / `forbiddenPalettes` (F2)

### Camada 2 — Paletas (13)

13 paletas OKLCH existentes em `lib/design/seeds/palettes.seed.ts` (D-25/F1). Cada palette declara seed OKLCH + derivations automáticas (mecânica plano `design-system.md` §"Harmonia de paleta"). Validation APCA Silver no prebuild.

### Camada 3 — Compatibility

`archetype.recommendedPalettes` = soft metadata. UI palette picker mostra recomendações + APCA preview pra demais. APCA Silver gate é HARD constraint runtime (F2).

### Camada 4 — Typography (9 famílias)

9 famílias free Google Fonts (G1) declaradas em `app/fonts.ts` via `next/font/google`. 3 preloaded (inter, manrope, plus-jakarta-sans), 6 lazy on-demand (G3). Custom upload nunca (G4). Tipografia ativa via CSS var `--font-active` resolvida por `[data-archetype]`.

### Camada 5 — Estrutura (componentes)

24 archetypes cobertos por:

- 4 variantes de Card (E1)
- 2 variantes de Hero (E1)
- 3 variantes de Navigation + 1 responsive (E1)
- 3 variantes de Lists (E1)
- 2 variantes de Feed (linear-scroll + masonry via MasonryGrid container — E2)

### Camada 6 — Mobile / PWA

Mobile como sub-seção `mobile: {}` dentro do archetype config (E3/E4), não fork. Padrões mobile cross-cutting (sticky-bottom-CTA, FAB, bottom-tab) modelados como componentes opcionais em `components/app-mobile-*`, ativados condicionalmente por archetype.

### Camada 7 — Brand institucional desafit.app

`lib/design/brands/desafit.ts`: archetype `stripe` + palette `indigo` (D-24). Mesma arquitetura serve tanto a agência quanto qualquer tenant — sem código especial. Marca filha `desafit.app` é apenas mais uma entrada em `platform.brands` com `archetype_id` + `palette_id` apontando pra stripe + indigo.

### Camada 8 — Extensibilidade pros 71

Sistema é extensível pros 71 archetypes sem refactor:

- Add new archetype = `INSERT INTO platform.archetypes (slug, ...)` + criar `lib/design/archetypes/<new>/config.ts` + mapping DESIGN.md
- Add new font = adicionar entrada em `OFFICIAL_FONTS` + declaração em `app/fonts.ts` (build-time)
- Add new palette = adicionar entrada em `OFFICIAL_PALETTES` + APCA validation
- Add new card/hero/nav variant = adicionar prop variant ao componente correspondente
- 4 layers (archetype, palette, typography, structure) compostos sem coupling = scalability mantida

### Coerência cross-decisão

| Decisão    | Princípio aplicado                                               |
| ---------- | ---------------------------------------------------------------- |
| D-03/D-26  | 1:1 mapping archetype → DESIGN.md (zero ambiguidade)             |
| E3/E4      | DRY — Apple/Starbucks 1 config com mobile sub-seção              |
| D-23/G1/G2 | Catálogo curado 9 famílias free (vs proprietárias caras)         |
| G3         | Subset inteligente (preload 3, lazy 6) — performance-first PWA   |
| G4         | Catálogo fechado — frescura filter, evita custom font complexity |
| D-25/F1    | Manter 13 paletas — APCA gate suficiente                         |
| F2         | Compatibility soft — guidance sem engessar tenant                |
| F3         | Seed-derived chart colors — MVP simplicity                       |
| D-24       | Stripe-like + indigo — premium SaaS-pro positioning              |
| E1/E2      | Cobertura via composition — 4 Card variants × N containers       |

### Anti-padrões rejeitados (registro)

- **Apple/Starbucks como 2 configs forkadas:** rejeitado — viola DRY, vibes são continuidade
- **Custom font upload Fase 1:** rejeitado — licença + APCA complexity + storage = desproporcional
- **Hard compatibility matrix Zod:** rejeitado — engessa tenant criatividade, APCA cobre tech case
- **Custom chart colors per archetype:** rejeitado — 192 valores manuais sem ROI MVP
- **Bold-Energetic pra desafit institucional:** rejeitado — desafit é multi-vertical, fitness clichê
- **Pinterest masonry como Card variant:** rejeitado — masonry é container responsibility, não Card

---

## Próximos passos (Passos 5 → 9 do `docs/plans/design-system.md`)

1. **Passo 5 (compatibility matrix):** crystalizar `recommendedPalettes` / `warningPalettes` per archetype config (F2). Output: `lib/design/archetypes/<slug>/config.ts` com 3 listas por archetype.
2. **Passo 6 (implementação):** criar 24 `lib/design/archetypes/<slug>/config.ts` baseados nesta tabela + role mappings de `20-naming-mappings.md`. Começar por 5 essenciais (`linear`, `notion`, `stripe`, `apple`, `nike`).
3. **Passo 7 (roles + fonts):** `lib/design/roles.ts` (TypeScript Role type — já em D-43) + `app/fonts.ts` (9 famílias declaradas — G1+G3).
4. **Passo 8 (apca enforcement):** estender `scripts/validate-palettes.ts` pra rodar matrix 13 paletas × 24 archetypes × 25 roles = 7800 combinações. APCA gate fail = build fail.
5. **Passo 9 (ADRs + ESLint):** ADR consolidando D-43 + D-23/G1 + D-24 + D-25 + decisões deste documento. ESLint rule pra forçar `var(--role-*)` em components/ui (zona shadcn).

---

## Pendências para ratificação user

- **Apple/Starbucks E3+E4 Opção A confirmada?** (1 config com mobile sub-seção)
- **9 fontes do catálogo aceitas?** ou pivotar (ex: usar Geist em vez de Inter como universal — divergência menor mas Vercel-like)
- **desafit institucional D-24 confirmado Stripe+indigo?** ou pivotar pra warm-humanist (claude-like)
- **Compatibility matrix F2 confirmada soft (vs Zod hard)?**
- **F3 derive-from-seed chart colors confirmado?** ou aceitar 24 customs futuras

Após ratificação, este documento promove-se para entries em `12-decisions-resolved.md` (linhas individuais D-03, D-23, D-24, D-25, D-26 fechadas).

---

_Documento preparado por agente design-system 2026-05-20, baseado em leitura de `15-archetype-curation.md` + `19-mobile-first-additions.md` + `26-design-system-vibes.md` + `27-design-tokens-per-archetype.md` + `16-semantic-colors-audit.md` + `20-naming-mappings.md` + `12-decisions-resolved.md` (D-43) + `11-decisions-pending.md` + pesquisas externas (Spotify Encore, Next.js font docs, caniuse masonry, Airbnb DESIGN.md, APCA Silver docs, Klim Type Foundry EULAs)._

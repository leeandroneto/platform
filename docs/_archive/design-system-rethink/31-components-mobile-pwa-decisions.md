# 31. Decisões — Components architecture + Mobile patterns + PWA constraints

> **Status:** decisões consolidadas pós-pesquisa externa (2026-05-20)
> **Escopo:** D-06, H1 (Core 8), D-07, D-19, D-13, D-14, D-17, D-18, H2-H5, D-11, D-12, J1, D-40
> **Insumos lidos:** `17-components-catalog.md` (52 components nos 18 archetypes) · `18-shadcn-registries-final.md` (3 registries dia 1) · `19-mobile-first-additions.md` (6 mobile-first archetypes) · `14a-audit-estado-atual.md` (53 primitives + 3 wrappers) · `11-decisions-pending.md` (D-01 → D-43)
> **Pesquisa externa:** shadcn blocks 6167+ (56 categorias) · iOS 26 Liquid Glass + PWA · CSS Grid Masonry status · `next/font` LCP best practices · custom shadcn registry · Origin/Magic/Kibo coverage

---

## TL;DR — todas as decisões em 1 página

| ID   | Decisão                                                                                                                                                                                                                                                                        | Confiança |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| D-06 | **Opção B (modificada)** — prototype 2 archetypes contrastantes (Minimal-Linear + Bold-Nike) antes de escalar; cobertura real esperada 70-75% para Core 8                                                                                                                      | Alta      |
| H1   | **Core 9** (Core 8 + `Section`) — adicionar `Section` como wrapper de banda; remover variantes redundantes de Card; Pinterest masonry NÃO entra no Core 9 (vira archetype-specific)                                                                                            | Alta      |
| D-07 | **Opção B** — Origin UI + Kibo dia 1 (alinhado com `18-shadcn-registries-final.md`); Magic UI JIT por archetype motion-heavy                                                                                                                                                   | Alta      |
| D-19 | **Opção A** — registry import via `components.json` (mantém update path + alinha ADR-0040 quarentena)                                                                                                                                                                          | Alta      |
| D-13 | **Híbrido B+C** — components mobile-only + desktop-only quando estruturalmente diferentes; sticky bottom CTA é UM componente (`AppStickyCTA`) com variantes via prop (booking/commerce/configurator); archetype-specific mobile só quando art-direction muda (Nike full-bleed) | Alta      |
| D-14 | **Opção C** — manter Tier 1/2/3 atual (ADR-0038) + glossário Kholmatova como vocabulário de comunicação; ZERO folder rename                                                                                                                                                    | Alta      |
| D-17 | **Faseado A→B** — dia 1 só archetype+palette; Fase 2 override granular de roles (`--role-radius-*`, `--role-shadow-*`); C nunca                                                                                                                                                | Alta      |
| D-18 | **Opção A** — 3 tokens de container (`--container-narrow: 1080px`, `--container-default: 1280px`, `--container-wide: 1440px`) + archetype declara qual usar como default + Nike-style ganha `full-bleed` flag                                                                  | Alta      |
| H2   | **Cortar** — 2 universais (wave + pulse), não customizar por archetype                                                                                                                                                                                                         | Alta      |
| H3   | **Cortar** — 2 variantes (ring + inset-ring) parametrizadas via role; NÃO N estilos                                                                                                                                                                                            | Alta      |
| H4   | **Manter** — 1 estilo SVG universal dia 1; archetype-specific JIT se demand emergir                                                                                                                                                                                            | Alta      |
| H5   | **Atualizar ADR-0038** — formalizar Storybook como gate de existência para `ds/*`; sem story → não merga                                                                                                                                                                       | Alta      |
| D-11 | **Opção B** — manifest dinâmico funciona até primeiro install; pós-install lockado no iOS (atributos congelados); usar `start_url` único por subdomain                                                                                                                         | Média     |
| D-12 | **Opção A dia 1** — bloquear theme swap pós-install para tenants já em produção PWA; B Fase 2 (aviso + opt-in); C nunca                                                                                                                                                        | Alta      |
| J1   | **Híbrido** — `theme-color` RSC-derivado do par (archetype × palette × theme_mode); hardcoded no manifest é fallback estático; tag `<meta>` runtime atualiza com `useEffect` para PWA logada                                                                                   | Média     |
| D-40 | **Opção A + B** — budget rígido por archetype (250KB CSS + 200KB fonts) + lazy load CSS archetype-specific via `<link rel="stylesheet">` injetado pelo RouteProvider                                                                                                           | Alta      |

---

## D-06 — Shadcn cobertura: prototype valida % real

**Recomendação:** Opção B (modificada) — prototype **2 archetypes contrastantes**, não 1
**Confiança:** Alta
**Raciocínio:**

- Catálogo 17 mapeia ~52 components nos 18 archetypes. Conta cruzada com pesquisa shadcn blocks (6167+ blocks, 56 categorias) sugere cobertura **realista 70-75% dos Core 9** com shadcn oficial + Origin UI + Kibo UI (não 60% como estimativa preliminar do `04-components-questions.md`)
- Mas Core 9 ≠ totalidade. Quando entram quirks archetype-specific (Mastercard satellite CTA, opencode TUI mockup, Nike `scale(0.5)`, Starbucks Frap), cobertura derrete para **~40% do total dos 52 components**
- 1 prototype isolado fica viciado pelo archetype escolhido. Linear (minimal-mono) tem ~95% de cobertura shadcn pura — falsa confiança. Nike (bold-energetic) tem ~50% — pessimismo
- **Recomendação prática:** prototype **Minimal-Linear** (representa "easy path" — minimal-mono cobre 6 dos 24 archetypes) + **Bold-Nike** (representa "hard path" — full-bleed + scale(0.5) + filter rail). Os 2 juntos amostram os extremos
- Custo: ~1.5 dias (vs. ~5 dias para 5 archetypes piloto). Benefício: % real medido com banda de confiança

**Referência externa:**

- shadcn blocks: 6167+ blocks em 56 categorias ([shadcn.io/blocks](https://www.shadcn.io/blocks))
- Hierarquia 5 camadas em `07-shadcn-hierarchy.md` e ADR-0037 (blocks-first)

**O que desbloqueia:**

- Decisão informada sobre quantos archetypes podemos cravar Fase 1 vs. Fase 2
- Banda de confiança real para estimativa de trabalho dos 24 archetypes
- Validação empírica do contract de roles D-43 (29 roles) — provavelmente vão emergir 2-3 roles novos durante prototype

**Risco se errar:**

- Assumir 60% e seguir → descobrir 40% real no archetype 5 → refactor de Core 9 + 12 wrappers archetype-aware → atraso ~1 semana
- Prototype demais (4+ archetypes piloto) → over-engineering antes de validar negócio → atraso ~1 semana

---

## H1 / Core 9 — Catálogo final com variantes estruturais

**Recomendação:** Core 8 → **Core 9** (adicionar `Section`); ajustes em `Card` e `ListItem`

### Componentes finais (validados contra 24 archetypes)

#### 1. `NavigationTop` — desktop (3 variantes estruturais)

- **Variantes:**
  - `standard` — sticky padrão (17/18 desktop archetypes: linear, notion, stripe, etc.)
  - `floating-pill` — detached rounded pill (Mastercard signature)
  - `frosted-glass` — backdrop-blur + saturate (Apple, Spotify mobile ambient)
- **Por que 3 e não 1:** floating-pill é estruturalmente diferente (positioning absolute + max-width centrado + radius 1000px), não dá pra emular com prop em `standard`. Frosted é CSS único (`backdrop-filter: saturate(180%) blur(20px)`)
- **Fonte:** `17-components-catalog.md` linhas 330-345

#### 2. `NavigationBottom` — mobile (1 variante + slot opcional)

- **Variantes:** `tab-bar` (Spotify canon + Material 3 + iOS HIG)
- **Slot opcional:** `now-playing-mini-bar` (Spotify persistent player); slot pra qualquer "session-state mini-strip" (timer de aula ao vivo em desafit, por exemplo)
- **Por que 1 variante:** bottom nav é canon estruturalmente uniforme (4-5 tabs + icon-label vertical stack). Variação está nos icons, não no layout
- **Fonte:** `19-mobile-first-additions.md` linhas 51-58

#### 3. `Card` — universal (4 variantes estruturais → REDUZIDAS para 3)

- **Variantes finais:**
  - `surface` — base canvas/tinted-soft/ink (cobre image-top, text-only, image-side via composition de filhos)
  - `media-bg` — full-bleed photographic (Nike campaign tile, Mastercard pill-carousel)
  - `tinted-accent` — saturated color fill (Figma color-block, Claude coral, The Verge magazine tile)
- **Por que reduzir de 4 para 3:** as 4 variantes originais (image-top/image-side/text-only/image-bg) misturam **content composition** (slot pra `<img>`) com **structural variant** (background painting). Composition de filhos cobre image-top/image-side/text-only via `<Card><CardMedia/><CardBody/></Card>`. Background paint é a única dimensão estrutural real → 3 variantes
- **Fonte:** `17-components-catalog.md` linhas 292-313

#### 4. `ListItem` — universal (3 variantes — MANTIDAS)

- **Variantes:** `text-only` · `with-avatar` · `with-image`
- **Por que 3 funciona:** leading element (nada/avatar/image-thumbnail) é dimensão estrutural genuína — afeta height (44/56/72px), alignment (center vs start), e a11y (text alt em image-thumb)
- **Variante mobile-specific:** `swipeable` (slot pra trailing actions revealed on swipe — Apple Mail / iOS canon) → JIT quando first archetype consumir

#### 5. `Hero` — universal (4 variantes estruturais)

- **Variantes:**
  - `text-first` — text + opcional small media (Linear, Wired, opencode, Notion text-heavy)
  - `media-first` — full-bleed photo/video (Nike, SpaceX, Vodafone, Apple gallery)
  - `gradient-mesh` — atmospheric backdrop (Stripe, Mistral sunset)
  - `mockup-composited` — multi-layer product UI (Stripe dashboard, Claude code-window)
- **Por que 4 e não 2:** `gradient-mesh` (CSS conic/radial gradients + blur) e `mockup-composited` (multi-layer absolute positioning) são CSS estruturalmente distintos de `text-first` + `media-first`. Pesquisa 17 mostra 4 padrões irredutíveis cross-archetype
- **Archetype-specific NÃO entra:** TUI mockup (opencode) vira lazy-load `<TuiMockup>` em `lib/components/terminal-mono/`

#### 6. `Modal` + `BottomSheet` (2 components, NÃO 1)

- **`Modal`:** centered overlay (desktop canonical + mobile fallback)
- **`BottomSheet`:** bottom-anchored sheet com drag handle (mobile-first canon)
- **Variantes BottomSheet:**
  - `standard` — fixed height
  - `dynamic-detents` — snap heights (iOS canon: 25% / 50% / 90%)
  - `full-screen-sheet` — Pinterest pattern (rounded top, bottom CTA fixed)
- **Por que 2 components:** Modal e BottomSheet têm interaction model diferente (modal = backdrop dismiss + ESC; sheet = swipe-down dismiss + drag handle). Mobile-first archetypes (Pinterest, Spotify, Airbnb) preferem sheet sobre modal — não dá pra unificar via prop
- **Fonte:** `19-mobile-first-additions.md` linhas 192-211 (GAP iOS bottom-sheet identificado)

#### 7. `SectionHeader` — universal (2 variantes)

- **Variantes:**
  - `default` — eyebrow + heading + lead (recorrente nas 18 desktop archetypes)
  - `editorial` — eyebrow tracking-wide UPPERCASE + serif heading + meta-row (Wired, The Verge, magazine archetypes)
- **Por que 2:** editorial usa typography mix (serif heading + mono eyebrow) que não é parametrizável só por prop — depende de fonts loadadas pelo archetype

#### 8. `FormGroup` — universal (2 variantes — MANTIDAS)

- **Variantes:** `outlined` · `filled`
- **Slot:** `floating-label` (Starbucks signature) → variant adicional `floating` quando archetype warm/retail consumir
- **Variantes mobile-specific:** auto-grow font (Starbucks 1.6→1.9rem em mobile) — via CSS responsive, não nova variante

#### 9. `Section` — universal **NOVO** (4 variantes estruturais)

- **Variantes:**
  - `default` — surface canvas + padding
  - `band-light` — surface-soft + container-default
  - `band-dark` — surface-ink + container-default (polarity flip)
  - `band-bleed` — full-bleed (sem max-width) com inner container
- **Por que adicionar:** `Content band light/dark` aparece em 11/18 archetypes (`17-components-catalog.md` linha 55). É structural primitive recorrente que hoje seria recriado caso-a-caso. Adicionar como Core 9 evita 24× recriação. Cobre Footer também (Footer = `<Section variant="band-dark"><Footer/></Section>`)

### Componentes que NÃO entram no Core 9 (archetype-specific lazy-load)

- **Pinterest masonry** → `<MasonryGrid>` em `lib/components/discovery-photo/`. Justificativa: 1 archetype documenta (Pinterest), CSS Grid Masonry ainda em flags (ver J1+). Custo de inclusão > benefício
- **Mastercard satellite CTA + orbital arcs** → archetype-specific
- **opencode TUI mockup + ASCII bullet list** → archetype-specific
- **Starbucks Frap FAB** → `<AppFAB>` em `components/ds/app-fab/`. Discutível incluir no Core 9 (Material 3 canon + retail), mas hoje só 1/24 archetypes documenta (Starbucks). Promover ao Core quando 2º archetype consumir
- **Spotify persistent now-playing bar** → slot do `NavigationBottom`, não componente separado
- **Airbnb sticky-bottom CTA** → `<AppStickyCTA>` em `components/ds/` (ver D-13 abaixo) — NÃO no Core 9 porque é mobile-only e tem regras de positioning específicas

### Variantes redundantes removidas

- `Card.image-side` removido — composition: `<Card variant="surface"><CardMedia side="left"/><CardBody/></Card>`
- `Hero.text-first` + `Hero.media-first` mantidos (2 estruturalmente diferentes); rejeitado expandir para 6 (apesar de `17-components-catalog.md` mostrar 6 padrões — 4 cobrem, 2 são archetype-specific quirks)

**Referência externa:**

- shadcn registry stats (6167+ blocks) sugerem que Section/Container/Band são primitive comum o suficiente para promover ([Shadcn Studio blocks](https://shadcnstudio.com/blocks))
- iOS HIG canonical components: Tab Bar, Bottom Sheet, Sticky CTA validados em `19-mobile-first-additions.md`

**O que desbloqueia:**

- Storybook stories obrigatórias: 9 components × média 2.5 variantes ≈ **23 stories Core**
- Audit de 53 primitives: confirma quais shadcn primitives são consumidos pelo Core 9 vs. pelo wrapper archetype-specific
- ESLint rule "no archetype-specific in Core" — Core 9 imports só `components/ui/*` + roles tokens

**Risco se errar:**

- Promover Pinterest masonry ao Core 9 → CSS Grid Masonry incompleto em Chrome/Firefox → fallback JS pesado + degraded UX em 70% browsers
- Não criar `Section` no Core 9 → cada archetype recria band → drift cross-tenant
- Não separar Modal vs. BottomSheet → mobile-first archetypes têm UX desktopizada (modal centered em vez de sheet)

---

## D-07 / D-19 — Libs complementares: quais ativar + como

### D-07 (quais):

**Recomendação:** Opção B — Origin UI + Kibo dia 1
**Confiança:** Alta

**Raciocínio:**

- `18-shadcn-registries-final.md` já validou: 3 registries (shadcn + Origin UI + Kibo UI) cobrem **~85%** dos universal components dia 1. Decidir contra essa análise exige novo motivo
- Magic UI / Aceternity = JIT por archetype motion-heavy (Bold-Energetic Nike, Brutalist The Verge, AI Sunset Mistral, Aerospace SpaceX). Adicionar dia 1 = tentação de usar Particles/Aurora em archetypes que não pediram = drift visual
- Aceternity tem 2 riscos não-resolvidos: Tailwind v3 (vs nosso v4) + Framer Motion (vs nosso `motion/react`). Adicionar dia 1 = débito técnico
- Origin UI cobre os 7 gaps críticos shadcn forms (multi-select, time picker, tags input, phone input, date-picker advanced, stepper, password strength)
- Kibo UI cobre os 8 SaaS patterns (dropzone, color picker, code block, avatar stack, rating, snippet, announcement, banner)

**Referência externa:**

- Origin UI a11y: Radix UI + React Aria (Adobe — gold standard) ([Origin UI homepage](https://originui.com))
- Kibo UI: 41 components SaaS-specific ([Kibo UI](https://www.kibo-ui.com))

**O que desbloqueia:**

- `components.json` config 3-registry (já especificado em `18-shadcn-registries-final.md` linhas 222-234)
- Comando de install em batch (`pnpm dlx shadcn add @origin-ui/multi-select`)
- Gate de "que registry ativar" agora é JIT regra: Magic UI ativa quando primeiro archetype Bold-Energetic ou Brutalist consumir

**Risco se errar:**

- Ativar Magic UI dia 1 → devs usam Particles/Aurora em archetypes minimalistas → quebra archetype DNA
- Não ativar Origin UI dia 1 → 7 gaps críticos de forms → build custom = ~3 dias trabalho redundante (esses 7 já existem prontos)

### D-19 (como):

**Recomendação:** Opção A — registry import via `components.json`
**Confiança:** Alta

**Raciocínio:**

- ADR-0040 + `.claude/rules/shadcn-zone.md` quarentena `components/ui/*` — Edit bloqueado. Registry import respeita essa fronteira: install nova versão = sobrescreve em `components/ui/*` via canal único `npx shadcn add`. Fork para `components/app-*` quebra isso (cria 2ª cópia editável)
- Update path preservado: quando Origin UI lança breaking change, `pnpm dlx shadcn add @origin-ui/multi-select` atualiza com 1 comando
- shadcn 3.0+ suporta namespaced registries `@origin-ui/name` + auth via env vars para registry privado futuro nosso ([shadcn registry docs](https://ui.shadcn.com/docs/registry))

**Exceção registrada:** se Origin UI release introduzir bug que quebra nossa archetype config (ex: hardcoded color), aí fork é justificado — registrar em ADR com nome do release que quebrou + retornar a registry import quando upstream consertar.

**Referência externa:**

- shadcn 3.0 namespaced registries + ENV_VAR auth ([shadcn docs](https://ui.shadcn.com/docs/registry/getting-started))
- openstatus shadcn registry case study ([openstatus blog](https://www.openstatus.dev/blog/shadcn-component-registry))

**O que desbloqueia:**

- `components.json` final dia 1 (3 registries)
- Documentar em `.claude/rules/shadcn-zone.md` que fork = ADR + nome do release que motivou
- Caminho aberto pra criar nosso próprio registry (`@desafit/ds`) Fase 2 — distribuir Core 9 + wrappers archetype-aware via registry interno (potencialmente útil se brand-filha futura quiser usar nosso DS isoladamente)

**Risco se errar:**

- Fork dia 1 → 2 cópias editáveis → quem ganha quando upstream atualiza? → drift inevitável
- Não documentar exceção → primeiro bug Origin UI vira "fork everything" panic

---

## D-13 — Mobile redesign: só responsive ou components estruturalmente diferentes?

**Recomendação:** Híbrido B+C — components mobile-only quando estrutura diverge; `AppStickyCTA` é 1 componente com prop `kind`
**Confiança:** Alta
**Raciocínio:**

#### Patterns mobile que são **genuinamente diferentes estruturalmente** (não CSS):

| Pattern                                   | Por que estrutural                                                                           | Decisão                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Bottom tab nav vs. sidebar/top nav**    | Position diferente (fixed bottom vs. sticky top), interaction model diferente                | 2 components separados: `NavigationBottom` + `NavigationTop` (Core 9)                 |
| **BottomSheet vs. Modal**                 | Drag-to-dismiss vs. backdrop-dismiss, detents vs. fixed size                                 | 2 components separados (Core 9)                                                       |
| **Sticky bottom CTA (Airbnb/Meta/Apple)** | Position fixed bottom + price+action layout — mas conteúdo varia (booking, commerce, config) | **1 componente `AppStickyCTA` com prop `kind="booking"/"commerce"/"configurator"`**   |
| **FAB (Starbucks)**                       | Position fixed bottom-right + circular + touch-offset                                        | `AppFAB` único component (não é variante do `Button` porque positioning é estrutural) |
| **Pinterest masonry**                     | CSS Grid Masonry / column-count layout fundamentalmente diferente de regular grid            | `MasonryGrid` archetype-specific em `lib/components/discovery-photo/`                 |

#### Sticky bottom CTA bar — **1 componente, 3 variantes via prop**

```tsx
<AppStickyCTA
  kind="booking" // Airbnb: price/night + Reserve
  kind="commerce" // Meta: total + Add to cart
  kind="configurator" // Apple: running price + Add to Bag
  // ...renderiza layout interno apropriado
/>
```

**Por que 1 e não 3:**

- Estrutura é a mesma: container fixed bottom + safe-area-inset-bottom + 2 colunas (info à esquerda, CTA à direita) + backdrop blur opcional
- Difere só o **conteúdo do slot left** (price formatado vs. price + sub-text vs. running price). Conteúdo é prop, não estrutura
- 1 componente = 1 set de regras de a11y (focus order, keyboard tab, ESC) e 1 lugar pra fix de bug

#### Mobile art-direction (Nike full-bleed)

- **Padrão genuino estrutural:** Nike desktop tem hero com max-width 1440px; Nike mobile tem hero full-bleed sem padding. Não é só responsive — é **crop diferente** (focal point diferente em image)
- **Solução:** componente `<Hero variant="media-first">` aceita prop `mobileCrop` (focal-point object para `object-position`). Imagem CMS armazena 2 crops (desktop + mobile) ou usa focal-point metadata
- **NÃO criar `<HeroMobile>` separado** — overhead não compensa, mesma estrutura

#### Patterns mobile que são **só responsive** (CSS adapta)

- Grid 4-col → 1-col stack (universal — 24/24 archetypes)
- Hamburger drawer (universal)
- Touch target inflation (button height 32→44px via responsive utilities)
- Bottom sticky CTA já é caso resolvido acima (mesmo componente, position fixed via `md:static`)

**Referência externa:**

- iOS HIG: bottom sheet detents + tab bar canon
- Material 3: bottom nav 80dp height
- `19-mobile-first-additions.md`: 3 evidências independentes (Airbnb, Meta, Apple) do mesmo pattern sticky-bottom-CTA — robusto o suficiente pra unificar

**O que desbloqueia:**

- Core 9 + 2 components mobile-only (`AppStickyCTA`, `AppFAB`) — total 11 components garantidos
- Storybook stories: cada component mobile-only ganha viewport story (`mobile-portrait` 375px) explicitamente — não relegar para "imagine no celular"
- Decisão clara para D-17: Fase 1 não permite tenant alterar variante do `AppStickyCTA.kind` — tenant escolhe quando vincular a fluxo de pagamento

**Risco se errar:**

- 3 components separados `<BookingStickyCTA>`, `<CommerceStickyCTA>`, `<ConfigStickyCTA>` → 3 vezes mais código, 3 vezes mais a11y issues, drift inevitável
- `<Hero mobile-only>` vs `<HeroDesktop>` separados → 2 vezes manutenção sem ganho estrutural real

---

## D-14 — Atomic Design vocab: folder ou só glossário?

**Recomendação:** Opção C — manter Tier 1/2/3 (ADR-0038) + glossário Kholmatova como vocabulário
**Confiança:** Alta
**Raciocínio:**

- ADR-0038 já cravou estrutura de 3 tiers: `components/ui/*` (shadcn primitives quarentenados) · `components/ds/*` (compostos archetype-aware com `.stories.tsx`) · `app/*/components/*.tsx` (composições de feature)
- Mover para `components/atoms/`, `components/molecules/`, etc. = **rename de 53 primitives + 3 wrappers + tooling (hooks, ESLint, shadcn-zone.md regex paths) + Storybook config** = ~2 dias de trabalho mecânico sem ganho conceitual real
- Brad Frost (2024) admite em entrevistas que Atomic Design é "shared mental model" e não estrutura obrigatória — equipes que tratam como dogma sofrem mais que beneficiam
- Tier 1/2/3 já mapeia para Atomic naturalmente: Tier 1 ≈ atoms (Button, Input) + alguns molecules (Card, Dialog); Tier 2 ≈ molecules + organisms compostos; Tier 3 ≈ organisms + templates. Mapeamento é mental, não físico
- Glossário Kholmatova (`docs/design-system/09-kholmatova-vocab.md`) já existe — basta enriquecer com mapping tier↔atomic e usar como vocabulário de discussão em PRs, code review, decisões

**Referência externa:**

- Kholmatova "Design Systems" (Smashing 2017) — perspectiva functional patterns vs. perceptual patterns
- Brad Frost: Atomic Design (2016, revisitado 2024 em blog posts admitindo flexibilidade)

**O que desbloqueia:**

- Zero refactor de paths
- ADR-0038 segue como verdade — 1 ADR por mudança estrutural, não 2
- Glossário compartilhado pode crescer JIT (Kholmatova "functional pattern" vs. "perceptual pattern" como dimensões adicionais)

**Risco se errar:**

- Rename para `atoms/molecules/organisms` → 1 contributor novo pergunta "isso é molecule ou organism?" toda PR → bikeshedding sobre nomenclatura
- Adotar Atomic literalmente sem rename → confusão "Tier 2 é molecule ou organism?"

---

## D-17 — Customização tenant: granular ou só archetype+palette?

**Recomendação:** Faseado A→B — dia 1 só archetype+palette; Fase 2 override granular de roles
**Confiança:** Alta
**Raciocínio:**

- Dia 1 (Fase 1): tenant escolhe 1 archetype + 1 palette. Combinação valida via compatibility matrix Zod (D-43 + D-25). 24 archetypes × 13 palettes = ~150 combos válidos pós-matriz — espaço de design suficiente
- Fase 2 (após primeiro tenant em produção pedir): admin permite override de roles **específicos** via UI ("aumentar arredondamento de botões" → escreve override em `tenants.role_overrides JSONB`). Granularidade limitada: só roles `--role-radius-*`, `--role-shadow-*`, `--role-spacing-*` (estruturais). Cores semantic NÃO podem ser overridable (quebra APCA gate)
- Opção C (edição completa) = nunca. Vira CMS de tokens, perde governance APCA, perde compatibilidade visual cross-tenant
- Suporte técnico: `lib/design/roles.ts` já tem 29 roles documentadas (D-43); JSONB override é apenas validação Zod adicional. Fase 2 = 1-2 dias trabalho
- UX: admin não vê "29 roles", vê "estilo de cantos" (3 presets sharp/rounded/pill) e "intensidade de sombra" (3 presets flat/raised/overlay) — granular por baixo, simples por cima

**Referência externa:**

- Material 3 theme builder (granular roles override com APCA gate)
- Notion theme settings (limited override, não free-for-all)

**O que desbloqueia:**

- Schema dia 1 simples: `tenants.archetype_id` + `tenants.palette_id` (existente uuid FK). Sem novas colunas pra granular override
- Schema Fase 2 incremental: `tenants.role_overrides JSONB DEFAULT '{}'` (1 migration limpa)
- Documentar em `docs/blueprint/22-tenant-customization.md` (criar quando Fase 2 começar) o que é overridable e o que não é

**Risco se errar:**

- Permitir granular dia 1 → primeiro tenant override 15 roles → admin UI vira tela com 29 controles → onboarding mata conversão
- Bloquear granular pra sempre → tenant maduros (paying tier C) pedem "deixa eu mudar só os botões" → perdemos upsell

---

## D-18 — Container max-widths: 3 níveis ou só 1?

**Recomendação:** Opção A — 3 tokens + archetype declara default + Nike-style ganha `full-bleed` flag
**Confiança:** Alta
**Raciocínio:**

- 3 níveis cobrem o espectro real observado nos 24 archetypes:
  - `--container-narrow: 1080px` — Wired, opencode (long-form, reading-first)
  - `--container-default: 1280px` — Linear, Notion, Stripe, Claude, Vercel (SaaS standard)
  - `--container-wide: 1440px` — Mastercard, marketing-heavy archetypes (display-first)
- Nike é full-bleed → archetype declara `containerStrategy: 'full-bleed'` que renderiza `<Section variant="band-bleed">` sem max-width wrapper. Não é 4º token, é flag
- Ant Design observação (1168px conteúdo em 1440px board) é micro-otimização cabível como `--container-narrow-strict: 1168px` JIT — adicionar quando primeiro archetype documentar
- Per-page override (`<Section maxWidth="wide">`) é prop, não 4ª variante de container. Fica como escape hatch raro

**Referência externa:**

- Ant Design board 1440 / content 1168
- Tailwind v4 container queries (`@container`) — habilita componentes responderem ao container, não ao viewport — combinação poderosa com 3 containers

**O que desbloqueia:**

- `app/globals.css @theme` ganha 3 tokens
- Cada archetype config em `lib/design/archetypes/<name>/tokens.ts` declara `container: 'narrow' | 'default' | 'wide' | 'bleed'`
- `<Section>` component (Core 9 #9) consome o token automaticamente sem prop explícita — DRY perfeito
- ESLint rule futura: usar `--container-*` token em `max-width` ou `<Section>`, nunca `max-w-[1280px]` literal

**Risco se errar:**

- 1 default 1280px sem opções → Wired vira cramped, Mastercard vira squeezed → archetype DNA perdido
- 24 archetypes × max-width próprio (sem tokens) → não há vocabulário compartilhado → drift garantido

---

## H2 — Skeleton: 2 universais ou customizado por archetype?

**Recomendação:** Cortar — 2 universais (wave + pulse), não customizar por archetype
**Confiança:** Alta
**Raciocínio:**

- Skeleton é micro-feedback de loading. Usuário nota por 200-800ms. ROI de archetype-specific skeleton = ~zero
- shadcn `Skeleton` (em `components/ui/skeleton.tsx`) já existe — base é OK
- 2 variantes cobrem 99%: `wave` (shimmer animation — energetic archetypes Bold/AI) + `pulse` (default — calm/minimal/editorial archetypes)
- `motion.ts` (lib/design/motion.ts existente) já tem `duration` levels — wave usa `duration.shimmer`, pulse usa `duration.calm`
- Animation override por archetype = 24 keyframes × 2 = 48 animations → bundle bloat sem retorno

**Referência externa:**

- Linear/Vercel/Stripe (3 archetypes) usam pulse mesmo — pattern dominante SaaS
- Magic UI shimmer (já no globals.css `--animate-shimmer`) cobre wave

**O que desbloqueia:**

- Skeleton fica em `components/ui/skeleton.tsx` (vendor) sem wrapper archetype-aware
- 2 variantes via prop `variant="wave" | "pulse"` (default pulse) — 1 componente, sem decision fatigue
- Arquetype config declara `defaultSkeleton: 'wave' | 'pulse'` — herda automático

**Risco se errar:**

- Customizar por archetype → 24 skeletons × overhead Storybook + a11y test → ROI zero em UX, ROI negativo em manutenção

---

## H3 — Focus indicator: 2 variantes ou N por archetype?

**Recomendação:** Cortar — 2 variantes (ring + inset-ring) parametrizadas via role
**Confiança:** Alta
**Raciocínio:**

- WCAG 2.2 obriga focus indicator com contraste APCA Lc ≥ 45 (já no `.claude/rules/contrast.md`). Estilo é semi-livre
- 2 variantes universais:
  - `ring` — outline 2px deslocado 2px outside (Linear, Notion, Stripe, default SaaS)
  - `inset-ring` — outline 2px inside element (Apple buttons, dense layouts onde outside ring colide com vizinhos)
- Cor do ring vem de role `--role-border-focus` (D-43 cravado em `12-decisions-resolved.md`) — varia por archetype automaticamente
- Espessura/offset vem de tokens novos: `--focus-ring-width: 2px` + `--focus-ring-offset: 2px` — archetype pode override (Nike usa 3px energetic, Wired usa 1px minimal)
- N estilos por archetype (halo Nike soft-cloud, surface flip opencode) = quirks reais mas viram CSS exception em archetype-specific tokens, não nova variante de Core 9. Componente Core sempre usa `ring` ou `inset-ring`; archetype overrides via `:root[data-template=...] { --focus-ring-style: halo-12px; }`

**Referência externa:**

- WCAG 2.2 focus indicator requirements
- APCA Silver Lc ≥ 45 (já gate de prebuild)
- `17-components-catalog.md` linhas 321-328 (focus signal varia 4 patterns) — confirmado que 4 patterns cabem em 2 + override CSS

**O que desbloqueia:**

- Componentes Core 9 usam exclusivamente `focus-visible:ring-2 ring-[var(--role-border-focus)] ring-offset-2`
- 4 padrões de focus (halo, surface-flip, outer-ring, inner-ring) viram archetype-level CSS, não component-level prop

**Risco se errar:**

- N variantes por archetype → 24 × variantes focus → testes a11y multiplicam → WCAG audit vira impossível
- 1 variante só → Apple-style inset-ring impossível em dense layouts → archetype DNA quebra

---

## H4 — Empty states: 1 estilo SVG universal ou por archetype?

**Recomendação:** Manter — 1 estilo SVG universal dia 1; archetype-specific JIT
**Confiança:** Alta
**Raciocínio:**

- shadcn `Empty` (em `components/ui/empty.tsx`) já existe — basta adicionar 1 SVG ilustrado leve (line-art monocromático, ~3KB) como default
- Empty state é micro-momento (~5-30s na sessão) — investir em arte por archetype não move métrica de retenção
- Quando archetype premium (Bold-Energetic, Brutalist) consumir e UX research validar diferença → criar `<EmptyStateArchetype variant="bold">` JIT
- SVG monocromático universal usa `currentColor` → cor herda do `--role-text-muted` → cor varia por archetype automaticamente (sem novo asset)

**Referência externa:**

- Slack, Linear, Notion (3 polished SaaS) usam 1 estilo de empty state cross-product
- Notion ilustração "no docs yet" usa monochromatic + currentColor pattern

**O que desbloqueia:**

- 1 SVG inline em `components/ui/empty.tsx` (~3KB gzipped)
- Slot pra archetype-specific empty quando primeiro pedido emergir

**Risco se errar:**

- Customizar por archetype dia 1 → 24 SVGs × design time + manutenção + bundle → trabalho enorme para impacto cosmético

---

## H5 — Storybook como gate de existência para `ds/*`

**Recomendação:** **Atualizar ADR-0038** para formalizar "sem story = não merga"
**Confiança:** Alta
**Raciocínio:**

- ADR-0038 já estabelece Storybook 10 como stack travado e endpoint MCP `localhost:6006/mcp`. Falta a regra de **gate de merge**
- Hoje: `components/ui/heading.stories.tsx`, `text.stories.tsx`, `muted.stories.tsx`, `logo.stories.tsx`, `app-form.stories.tsx`, `app-toast.stories.tsx`, `app-entitlement-gate.stories.tsx` existem (7 stories) — mas é convenção informal
- Formalizar:
  - **Regra:** todo arquivo em `components/ds/*` DEVE ter `<name>.stories.tsx` co-localizada
  - **Gate:** hook PostToolUse em Write em `components/ds/*` que avisa stderr "criar story co-localizada" se não existir
  - **CI:** `pnpm storybook:audit` (script novo) compara `glob('components/ds/**/*.tsx')` vs `glob('components/ds/**/*.stories.tsx')` e falha se houver diff
- Atualizar ADR-0038 com seção "Storybook como gate de existência" + cravar regra + adicionar hook + adicionar script
- Estender: stories DEVEM ter variants visíveis (`Default`, cada variant do Core 9 explicit) + viewport story (mobile-portrait 375px) para mobile-aware components

**Referência externa:**

- Shopify Polaris: cada component publicado tem Storybook story como gate (eles usam contribution model que falha CI sem story)
- shadcn Studio + shadcnblocks usam mesma convenção (story-driven)

**O que desbloqueia:**

- ADR-0038 atualizada (nova revisão ou nova ADR-NN-Storybook-Gate)
- Hook `.claude/hooks/component-story-gate.sh` (path-loaded em `components/ds/**/*.tsx`)
- Script `pnpm storybook:audit` em `package.json`
- CI gate "sem story = fail" — devs aprendem que Tier 2 = obrigatório documentar em isolation

**Risco se errar:**

- Sem gate → 12 wrappers app-\* sem story → drift visual entre archetypes não-detectável → debugging vira sessão de browser-clicking
- Gate sem hook → manual review → 1 dia humano se acumula em ~100 PRs

---

## D-11 — PWA manifest dinâmico per tenant no iOS

**Recomendação:** Opção B — funciona até primeiro install; pós-install lockado
**Confiança:** Média (testes reais iOS necessários antes de cravar ADR PWA)
**Raciocínio:**

- iOS 26 mudou: TODA URL adicionada ao Home Screen abre como web app, mesmo sem manifest ([MagicBell PWA iOS Limitations 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide))
- Manifest dinâmico per subdomain (`acme.desafit.app/manifest.json` retorna `{ "name": "Acme", "theme_color": "..." }` baseado em hostname) — **funciona no primeiro install** porque Safari fetcha manifest no momento "Add to Home Screen"
- Pós-install: atributos `name`, `short_name`, `icons`, `theme_color`, `start_url`, `scope` ficam **congelados no Home Screen entry**. iOS NÃO refetcha manifest após install ([Maximiliano Firtas firt.dev iOS PWA notes](https://firt.dev/notes/pwa-ios/))
- **Implicação crítica:** se tenant trocar de archetype/palette pós-install, app na Home Screen do cliente final mantém visual antigo (theme_color, icons, splash). Conteúdo da app (CSS, content) atualiza normal porque é fetch ao abrir; só metadata congelada
- Estratégia técnica: `start_url` único por tenant (`https://acme.desafit.app/?source=pwa`) garante scope correto. `scope: '/'` evita PWA cair em Safari ao navegar
- iOS 50MB cache limit + eviction após 7 dias inativo (já incorporado em [iOS PWA Strategies Scandiweb](https://scandiweb.com/blog/pwa-ios-strategies/)) — impacta service worker Serwist (já em produção, mas auditar)

**Referência externa:**

- [MagicBell PWA iOS Limitations 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [Maximiliano Firtas iOS PWA notes (firt.dev)](https://firt.dev/notes/pwa-ios/)
- [Mobiloud PWA iOS Complete Guide 2026](https://www.mobiloud.com/blog/progressive-web-apps-ios)
- iOS 26.1 bug PWA fullscreen broken ([MacRumors thread](https://forums.macrumors.com/threads/ios-26-1-pwa-full-screen-broken.2470545/)) — monitorar

**O que desbloqueia:**

- Endpoint `/manifest.json` resolvido em runtime via hostname lookup (já fluxo `getRouteByHost`) — implementar em `app/manifest.ts` (RSC convention Next.js 16)
- ADR PWA cravar: "manifest é dinâmico no first-fetch, congelado pós-install; tenant scope é subdomínio único"
- Documentar em onboarding tenant: "Se você mudar de archetype depois que clientes instalaram a app, ícone e cor de splash não atualizam até reinstalar"

**Risco se errar:**

- Assumir A (dynamic always) → tenant troca archetype → reclamação cliente final "ícone está errado" → suporte
- Assumir C (static per tenant) → criar 1 manifest.json file por tenant → não escala + não bate com ADR-0024 (multi-marca via hostname runtime)

---

## D-12 — Theme swap pós-install

**Recomendação:** Opção A dia 1 — bloquear theme swap pós-install para tenants com PWA ativo
**Confiança:** Alta
**Raciocínio:**

- Consequência de D-11: metadata congelada no iOS pós-install. UX inconsistente se permitir swap silencioso
- Dia 1 (Fase 1): admin UI mostra warning "Você tem N usuários com PWA instalado. Mudar archetype trocará visual mas ícone do Home Screen permanece como o atual". Botão de swap **disabled** até admin confirmar via checkbox "Entendo o impacto"
- Fase 2: opção B (permitir com aviso bem-feito + opt-in opcional para push de "Aplicativo atualizado, considere reinstalar")
- Fase 3+: opção C (force re-add workflow) só se demanda real emergir — provavelmente nunca, custa muito UX (cliente final precisa apagar app + reinstalar)
- Backend já tem `tenants.theme_version int` (cresce no UPDATE de archetype/palette) — usar para detectar swap event + popular `tenant_pwa_installs` (nova tabela Fase 2) que rastreia counter de installs ativos

**Referência externa:**

- Apple PWA install pattern (não há API formal de "atualizar app instalada")
- Conexão D-11 + D-12 reforçada por [PWA iOS Brainhub guide 2025](https://brainhub.eu/library/pwa-on-ios)

**O que desbloqueia:**

- Admin UX flow simplificado dia 1 (warning + opt-in)
- Schema Fase 2: `public.tenant_pwa_installs` table com counter + last_seen — habilita decisões data-driven sobre quando A→B transition vale o investimento

**Risco se errar:**

- Permitir B dia 1 sem warning → primeiro tenant troca em produção → clientes reclamam → support overhead
- C dia 1 (force re-add) → admin nunca troca por medo → archetype virou prison → mata diferenciação

---

## J1 — `theme-color` meta tag: RSC-derived ou hardcoded?

**Recomendação:** Híbrido — RSC-derived runtime + fallback no manifest
**Confiança:** Média (impacta SEO + iOS status bar)
**Raciocínio:**

- `<meta name="theme-color">` afeta:
  - iOS Safari: status bar tint
  - Android Chrome: address bar tint
  - PWA install: splash screen background color
- Cada archetype × palette × theme_mode (light/dark) → ~150 cores diferentes possíveis. Hardcoded por archetype no manifest = 24 valores hardcoded, perde palette/dark refinement
- **Runtime RSC derivation:**

  ```tsx
  // app/layout.tsx (RSC)
  import { getRouteByHost } from '@/lib/route/getRouteByHost'

  export async function generateMetadata() {
    const { tenant } = await getRouteByHost(...)
    const themeColor = await getThemeColor(tenant.archetype_id, tenant.palette_id, tenant.theme_mode)
    return { themeColor }
  }
  ```

- Fallback no manifest: `theme_color` no manifest é hardcoded ao default do archetype (1 valor seguro por archetype, gera 24 strings). Manifest é dynamic via `app/manifest.ts` mas só atualiza em first-install (D-11)
- Para PWA logada que swap pós-render: tag `<meta name="theme-color">` pode ser atualizada via `useEffect` quando palette muda (no admin do tenant fazendo preview)

**Referência externa:**

- Apple HIG `apple-mobile-web-app-status-bar-style` + `theme-color` interaction
- Chrome status: theme-color cobre Android + Chrome desktop tab tint

**O que desbloqueia:**

- `lib/design/derive-theme-color.ts` (helper Fase 1 — pega archetype+palette+mode → OKLCH → hex)
- `app/layout.tsx` generateMetadata RSC integration
- `app/manifest.ts` retorna fallback hardcoded por archetype (para first-install)
- Documentar em rule contrast: theme-color deve passar APCA Silver Lc ≥ 45 vs. status bar text color (preto ou branco — Safari/Chrome decidem automático mas convém testar)

**Risco se errar:**

- Hardcode 1 valor universal → status bar fica "vibe SaaS genérico" → archetype DNA quebra no momento de maior expectativa (app abrindo)
- RSC sem fallback → primeiro paint sem theme-color → flash de cor errada na status bar

---

## D-40 — Performance budget por archetype

**Recomendação:** Opção A + B híbrido — budget rígido por archetype + lazy load CSS archetype-specific
**Confiança:** Alta
**Raciocínio:**

#### Bundle atual (`14a-audit-estado-atual.md` + medições):

- JS: 177KB
- CSS: 18KB (apenas globals.css base + Tailwind v4)
- Geist variable: ~150KB
- **Total LCP-critical:** ~345KB

#### Impacto real de 24 archetypes:

- Se TUDO carregar sempre: 24 × ~5KB tokens CSS (per archetype) = ~120KB CSS extra → +120KB sobre 18KB base = 138KB CSS total
- Fonts: 8-10 famílias × 2-3 weights × ~25KB cada = ~500KB se carregar todas → estouro garantido de LCP budget
- **Conclusão:** lazy load é obrigatório, não opcional

#### Arquitetura proposta:

1. **Base universal** (sempre carrega):
   - `globals.css` (Core 9 + 29 roles + 3 elevations + 7 radius + utilities) — alvo ≤ 25KB minified+gzipped
   - 1 font universal (Geist variable single weight 400) — ≤ 30KB
   - **Total base:** ~55KB CSS+font (resto disponível para LCP-critical: hero image, etc.)

2. **Archetype CSS lazy** (carrega só o ativo):
   - `app/styles/archetypes/<archetype>.css` — declara `:root[data-template="<archetype>"] { --role-*: ...; }`
   - Tamanho alvo: ≤ 5KB minified+gzipped por archetype
   - Loading: `<link rel="stylesheet" href="/api/archetypes/<archetype>.css?v={theme_version}">` injetado pelo `RouteProvider` baseado em `tenant.archetype_id`
   - Cache: edge cache TTL 60s (mesma estratégia ADR-0026)

3. **Fonts archetype-specific lazy** (carrega só do archetype ativo):
   - Wired (Editorial) precisa serif → carrega Newsreader weights 400+700
   - Bold (Nike) precisa display → carrega Anton weight 400 only
   - Universal Geist sempre carregado (fallback)
   - Loading via `next/font/google` declared per archetype config; selective preload **só para body font do archetype ativo**

#### Budget rígido:

- **Por page (mobile portrait, 4G simulated):**
  - CSS total: ≤ 50KB (25KB base + 25KB archetype + buffer)
  - Fonts total: ≤ 150KB (1 universal + 1-2 archetype-specific, weight subset)
  - JS: ≤ 200KB (já em 177KB — buffer reduzido, vigilante)
  - **LCP target:** ≤ 2.5s (Core Web Vitals "Good")
- **Gate:** script `pnpm size:archetype` mede cada archetype individualmente (não só base)
- Hook: `prebuild` falha se algum archetype estoura budget

**Lazy load CSS no Next.js 16 — viabilidade:**

- App Router + RSC: layout RSC injeta `<link rel="stylesheet">` condicional via `headers()` lookup do hostname
- Turbopack production: stylesheets externos OK (não interfere com bundling)
- HTTP/2 + CDN: 1 extra request para archetype CSS é OK (multiplexed); evita gigantesco CSS único
- `next/font` com `display: 'swap'` + selective preload — apenas body font do archetype ativo recebe `<link rel="preload">`

**Referência externa:**

- [Next.js fonts in 2026 best practices](https://thelinuxcode.com/fonts-in-nextjs-2026-nextfont-patterns-performance-and-production-pitfalls/) — preload máximo 2 fontes, restantes usam swap
- [LCP optimization 2026 — Shubham Jha Blogs](https://shubhamjha.com/blog/core-web-vitals-nextjs-optimization)
- [DebugBear preload font guide](https://www.debugbear.com/blog/preload-web-fonts) — preload pode melhorar LCP 30% se aplicado corretamente, piora se overused

**O que desbloqueia:**

- Script `pnpm size:archetype` (CI gate) — alvo ≤ 5KB por archetype CSS
- Arquitetura "1 base CSS + N archetype lazy CSS" — escala para 71 archetypes sem bundle bloat
- `RouteProvider` ganha responsabilidade: inject archetype CSS link tag (1 line de código)
- Documentar em `lib/size-budget.ts` (criar) os alvos

**Risco se errar:**

- Sem budget → 24 archetypes carregam tudo eager → mobile 3G dies → bounce rate sobe
- Lazy sem cache TTL → admin troca archetype → cliente cli usuário pega CSS antigo → flash de estilo errado

---

## Core 9 — Catálogo final com variantes

| #   | Component               | Tier   | Variantes estruturais                                                                 | Mobile-aware?                   | Storybook obrigatório |
| --- | ----------------------- | ------ | ------------------------------------------------------------------------------------- | ------------------------------- | --------------------- |
| 1   | `NavigationTop`         | Tier 2 | `standard` · `floating-pill` · `frosted-glass`                                        | sim (collapse → hamburger)      | sim                   |
| 2   | `NavigationBottom`      | Tier 2 | `tab-bar` (+slot `now-playing-mini-bar`)                                              | sim (mobile-only)               | sim                   |
| 3   | `Card`                  | Tier 2 | `surface` · `media-bg` · `tinted-accent`                                              | sim                             | sim                   |
| 4   | `ListItem`              | Tier 2 | `text-only` · `with-avatar` · `with-image` (+`swipeable` JIT)                         | sim                             | sim                   |
| 5   | `Hero`                  | Tier 2 | `text-first` · `media-first` · `gradient-mesh` · `mockup-composited`                  | sim (focal-point)               | sim                   |
| 6   | `Modal` + `BottomSheet` | Tier 2 | Modal: 1 variante · BottomSheet: `standard` · `dynamic-detents` · `full-screen-sheet` | sim (sheet preferido em mobile) | sim                   |
| 7   | `SectionHeader`         | Tier 2 | `default` · `editorial`                                                               | só responsive                   | sim                   |
| 8   | `FormGroup`             | Tier 2 | `outlined` · `filled` (+`floating` JIT)                                               | sim (auto-grow font)            | sim                   |
| 9   | `Section`               | Tier 2 | `default` · `band-light` · `band-dark` · `band-bleed`                                 | só responsive                   | sim                   |

**Extras NÃO no Core 9 (Tier 2 obrigatório, mas escopo separado):**

- `AppStickyCTA` — mobile-only, 3 variantes (`booking` · `commerce` · `configurator`) — sai do Core 9 porque é mobile-only, mas DEVE ter story
- `AppFAB` — mobile-only (Material 3 / Starbucks canon) — story obrigatória

**Lazy-load archetype-specific (Tier 2 em `lib/components/<archetype>/`):**

- `MasonryGrid` (Pinterest), `TuiMockup` (opencode), `SatelliteCTA` + `OrbitalArc` (Mastercard), `SpeechmarkOrb` (Vodafone), `SunsetStripeBand` (Mistral), `CoralCalloutCard` (Claude), etc.

**Total Tier 2 dia 1:** 9 Core + 2 mobile (`AppStickyCTA`, `AppFAB`) = **11 components com story obrigatória** + ~20 archetype-specific JIT.

---

## Harmonia entre decisões — como tudo encaixa para 24 archetypes (escalável para 71)

### Layer 1 — Tokens (já cravado: D-21, D-22, D-43)

- 29 semantic roles universais (`--role-page-canvas`, `--role-feature-card-bg`, ...) em `lib/design/roles.ts`
- 3 containers (`--container-narrow/default/wide`) + flag `full-bleed` por archetype (D-18)
- 3 elevations (ADR-0042 — mantida) + 7 radius scale
- APCA Silver Lc gates (`.claude/rules/contrast.md`)

### Layer 2 — Components (Core 9 + 2 mobile + lazy archetype-specific)

- 9 Core components (Tier 2) consumem **exclusivamente roles tokens** — agnósticos ao archetype
- 2 mobile-only (`AppStickyCTA`, `AppFAB`) — mesma regra
- 20 archetype-specific lazy em `lib/components/<archetype>/` carregam só quando archetype ativo
- Cada Tier 2 tem `.stories.tsx` co-localizada (H5 cravado — atualizar ADR-0038)
- shadcn primitives em `components/ui/*` quarentenados (ADR-0040) + canal único `npx shadcn add` (D-19 cravado)

### Layer 3 — Archetypes (24 → 71 escalável)

- Cada archetype declara em `lib/design/archetypes/<name>/tokens.ts`:
  - Mapping role→raw token (29 entries)
  - Container default (`narrow` | `default` | `wide` | `full-bleed`)
  - Font families (subset de Google Fonts via `next/font`)
  - Skeleton default (H2: `wave` ou `pulse`)
  - Focus default (H3: `ring` ou `inset-ring`)
- CSS lazy em `app/styles/archetypes/<name>.css` (~5KB cada) — D-40 budget
- Compatibility matrix Zod (D-43 cravado): archetype × palette × theme_mode → valida combo no swap

### Layer 4 — Mobile + PWA constraints

- Components mobile-only separados quando estrutura diverge (D-13 cravado): `NavigationBottom`, `BottomSheet`, `AppStickyCTA`, `AppFAB`
- Manifest dinâmico per tenant via `app/manifest.ts` RSC — funciona first-install, congela pós-install (D-11 cravado)
- Theme swap pós-install bloqueado dia 1, opt-in Fase 2 (D-12 cravado)
- `theme-color` runtime-derived (J1 cravado) — RSC layout.tsx + manifest fallback
- Safe-area-inset tokens já existentes em `globals.css`

### Layer 5 — Customização tenant (D-17 faseado)

- Fase 1: tenant escolhe archetype + palette (via UI simples)
- Fase 2: granular override de roles estruturais (radius/shadow/spacing) — JSONB `tenants.role_overrides`
- Cores semantic NUNCA overridable (gate APCA)

### Como escala de 24 para 71 sem refactor

- **Adicionar archetype #25..#71** = criar `lib/design/archetypes/<name>/tokens.ts` (29 roles mapping) + `app/styles/archetypes/<name>.css` (~5KB) + opcional 1-3 archetype-specific components lazy em `lib/components/<name>/`
- **Zero refactor** de Core 9 ou tokens layer (roles são universais)
- **Zero refactor** de shadcn primitives (quarentenados)
- **Performance budget mantido** (cada archetype carrega só seu CSS + fonts próprias)
- **Storybook scales** (cada novo archetype-specific component vira story; Core 9 stories já parametrizam todos archetypes via decorator data-template)

### Riscos remanescentes (não-cobertos por esta decisão, postergados)

- **iOS 26 Liquid Glass + frosted-glass nav** ([NN/g Liquid Glass cracked](https://www.nngroup.com/articles/liquid-glass/)): UX bug reportado em iOS 26 onde frosted backgrounds têm parallax estranho. Monitorar; talvez exigir override CSS de `backdrop-filter` para forçar opacity 95%+ em iOS 26 detection. JIT decision
- **CSS Grid Masonry para Pinterest** ([caniuse masonry](https://caniuse.com/?search=masonry)): só Safari 26 unflagged, Chrome/Firefox em flags. Implementar com `@supports (grid-template-rows: masonry)` + fallback CSS columns (degraded UX em 70% browsers). Postergar Pinterest para Fase 2
- **shadcn blocks comercial** ($149-$399 [shadcnblocks](https://shadcnblocks.com)): JIT quando marketing pages premium precisarem. Não dia 1
- **Fonts pagas** (Söhne, Tiempos) — D-23 cravou postpone, só free dia 1
- **Voice/writing principles** (D-20 — frescura adiar para Fase 2)

---

## Pendências meta para próximo passo

- [ ] Promover Storybook gate (H5) para nova ADR ou revisão de ADR-0038
- [ ] Implementar `lib/design/derive-theme-color.ts` (J1)
- [ ] Implementar script `pnpm size:archetype` + budget gates (D-40)
- [ ] Criar `app/manifest.ts` RSC dinâmico (D-11)
- [ ] Prototype Minimal-Linear + Bold-Nike (D-06) — gate antes de escalar para 24
- [ ] Atualizar `12-decisions-resolved.md` movendo D-06, D-07, D-11, D-12, D-13, D-14, D-17, D-18, D-19, D-40, H1-H5, J1 quando finalizado plano

---

## Sources (pesquisa externa consultada)

- [shadcn blocks (6167+ blocks, 56 categories)](https://www.shadcn.io/blocks)
- [Shadcn Studio blocks catalog](https://shadcnstudio.com/blocks)
- [shadcn registry docs](https://ui.shadcn.com/docs/registry)
- [shadcn registry getting started](https://ui.shadcn.com/docs/registry/getting-started)
- [openstatus shadcn registry case study](https://www.openstatus.dev/blog/shadcn-component-registry)
- [MagicBell PWA iOS Limitations 2026 complete guide](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [Mobiloud PWA on iOS 2026 complete guide](https://www.mobiloud.com/blog/progressive-web-apps-ios)
- [Maximiliano Firtas iOS PWA notes (firt.dev)](https://firt.dev/notes/pwa-ios/)
- [Brainhub PWA on iOS 2025 status](https://brainhub.eu/library/pwa-on-ios)
- [NN/g — Liquid Glass cracked iOS 26 usability suffers](https://www.nngroup.com/articles/liquid-glass/)
- [TechRadar Liquid Glass home screen iOS 26](https://www.techradar.com/phones/iphone/im-a-huge-ios-26-fan-but-liquid-glass-has-totally-ruined-one-of-the-iphones-most-important-features)
- [MacRumors iOS 26.1 PWA fullscreen broken thread](https://forums.macrumors.com/threads/ios-26-1-pwa-full-screen-broken.2470545/)
- [CSS Grid Masonry caniuse status](https://caniuse.com/mdn-css_properties_grid-template-rows_masonry)
- [CSS Grid Lanes Masonry Layout 2026 complete guide (DEV)](https://dev.to/bean_bean/css-grid-lanes-masonry-layout-is-here-a-complete-guide-for-2026-4686)
- [Chrome blog Brick by brick masonry update](https://developer.chrome.com/blog/masonry-update)
- [Sitepoint CSS Masonry Layout native grid support](https://www.sitepoint.com/css-masonry-layout-native-grid/)
- [Next.js fonts 2026 patterns and performance (TheLinuxCode)](https://thelinuxcode.com/fonts-in-nextjs-2026-nextfont-patterns-performance-and-production-pitfalls/)
- [DebugBear preload fonts for Core Web Vitals](https://www.debugbear.com/blog/preload-web-fonts)
- [Shubham Jha Next.js Core Web Vitals 2026](https://shubhamjha.com/blog/core-web-vitals-nextjs-optimization)
- [Scandiweb iPhone PWA strategies](https://scandiweb.com/blog/pwa-ios-strategies/)
- [Next.js PWA guide official](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [web.dev manifest reference](https://web.dev/learn/pwa/web-app-manifest)

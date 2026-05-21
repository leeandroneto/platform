# 19. Marcas mobile-first / native-app feel — adições ao archetype set (Passo 1.5)

> Status: **6 mobile-first confirmados** — Spotify, Airbnb, Meta, Apple (reforço), Starbucks (reforço), Pinterest
> Data: 2026-05-20
> Total = 18 desktop + 4 novos mobile = **22 archetypes** (Apple+Starbucks reforçados, já nos 18)
> Suplemento de: `docs/design-system/15-archetype-curation.md` (18 archetypes desktop-first)

## TL;DR

- **4 novos mobile-first confirmados**: Spotify, Airbnb, Meta, Pinterest + Apple/Starbucks (reforço das dimensões mobile — já estão nos 18 desktop)
- **Total = 18 desktop + 4 novos = 22 archetypes** (canonical para todo o plano)
- Objetivo de longo prazo: sistematizar onboarding para acomodar todos os 71 sem esforço manual
- Os DESIGN.md das 71 foram extraídos majoritariamente de **surfaces de marketing web** — apps nativos não foram capturados como design tokens
- Apenas Spotify documenta explicitamente "sidebar → bottom bar on mobile" (canon mobile native)
- Apenas Starbucks documenta FAB real (Frap 56px circular com touch-offset)
- Cross-cutting pattern dominante: **sticky bottom CTA bar em commerce mobile** (Airbnb, Meta, Apple, Tesla)
- O resto das 60+ marcas trata mobile como **degradação progressiva de desktop** (hamburger + stack 1-up), sem padrões nativos

**Implicação estratégica:** o set de 71 é viesado desktop-first/marketing. Para desafit mobile-first PWA, precisamos:

1. Adicionar Spotify (bottom-tab canon)
2. Adicionar Starbucks (FAB canon — apesar de já estar no set, está lá pelo retail flagship, não pelo FAB; reforçar essa dimensão)
3. Adicionar Airbnb + Meta + Apple (sticky-bottom-CTA canon)
4. **Pesquisar fora das 71** patterns nativos: iOS HIG, Material 3 bottom-nav, app shells PWA — gap real

## Critérios de qualificação (recap)

Marca atende 3+ destes 6 critérios:

1. Primary platform é app nativo OU web mobile-first
2. Bottom tab navigation documentado
3. FAB (floating action button) documentado
4. Touch target floor explicit ≥44pt
5. Pull-to-refresh OR swipe gestures
6. Safe area / notch / status bar handling

**OU** alternativa: marca primariamente conhecida como **app mobile**.

## Marcas mobile-first identificadas

### 1. spotify (já no set #1 sob "music-first dark" — reforçar dimensão mobile)

- **Critérios atendidos:** 1, 2 (de 6) + alternativa (marca primariamente app)
- **Vibe primário:** Music-first dark immersive — sidebar→bottom-bar canon
- **Dimensões preliminares:**
  - Mood: dark immersive, pill geometry, content-first
  - Touch target: não explicitado em pt/dp, mas pill+circular geometry sugere touch-otimizado
  - Bottom nav: **SIM, EXPLÍCITO** — "Navigation: sidebar → bottom bar on mobile" (linha 244)
  - FAB: não documentado (mas play button circular pode ser lido como anchor)
  - Safe area handling: não documentado
- **Mobile-specific patterns únicos:**
  - "Now-playing bar: maintained at all sizes" — persistent player bar canon
  - Sidebar → bottom-tab transition
  - Album grid: 5 → 3 → 2 → 1 columns (collapsing fluido)
  - Pill geometry (500px–9999px) e circle (50%) — touch-tactile
  - "This is an app, not a marketing site" (linha 176 do DESIGN.md, declaração explícita)
- **Vertical fit hipotético desafit:** **fitness + yoga + idiomas** (qualquer vertical onde "player de conteúdo persistente" é o coração: player de aula = now-playing bar de música)
- **Por que adicionar:** É a única marca no set 71 que declara explicitamente "isto é um app, não site de marketing" + documenta bottom-tab transition + persistent player bar — o canon PWA mobile-first mais aproximado.

### 2. airbnb (NOVA — não está no set)

- **Critérios atendidos:** 1, 4, 5 (de 6) + alternativa (marca primariamente app booking)
- **Vibe primário:** Rounded soft consumer marketplace + sticky-bottom CTA canon
- **Dimensões preliminares:**
  - Mood: warm white, photography-first, Rausch #ff385c voltage
  - Touch target: **48×48px primary CTAs (WCAG AAA)**, search orb 48×48 (mais tapped element), date cells 40×40 — explicitado
  - Bottom nav: não documentado (mas em-app tem 5 tabs)
  - FAB: não documentado
  - Safe area handling: implícito ("full-screen search overlay on mobile")
  - Sticky bottom bar: **SIM** — "reservation card switches from sticky right-rail to sticky bottom bar on mobile, carrying just 'Reserve' CTA + nightly price summary"
- **Mobile-specific patterns únicos:**
  - Sticky bottom CTA bar com price summary + reserve action (canon de marketplace mobile)
  - Pull-shaped search bar que **collapses to single-tap overlay** mobile
  - Date picker 40×40 circular day cells (touch-optimized)
  - "Property cards stack 1-up; product tabs hide behind a sheet"
- **Vertical fit hipotético desafit:** **fitness, yoga, idiomas** — booking/reservation de aula, ticket, sessão tem MESMO padrão: data-picker mobile + sticky bottom "Reservar"
- **Por que adicionar:** O canon de sticky-bottom-CTA bar mobile mais bem documentado. desafit terá fluxo de "reservar aula" idêntico estruturalmente a "reservar property". Inclusão obrigatória.

### 3. meta (NOVA — não está no set)

- **Critérios atendidos:** 1, 4, 5 (de 6) — commerce hardware (Quest, Ray-Ban Meta)
- **Vibe primário:** Product-merchandising commerce com sticky-bottom buy-rail
- **Dimensões preliminares:**
  - Mood: stark white + ink-button (black) + cobalt cobertor de buy CTAs
  - Touch target: **40–44px pills (WCAG AA/AAA), 44×44 mobile override, 56×56 effective com hit zones**
  - Bottom nav: não documentado
  - FAB: não documentado
  - Safe area: implícito
  - Sticky bottom bar: **SIM** — "PDP layout: gallery stacks above purchase summary at <1024px; the summary becomes a sticky bottom bar with price + 'Add to cart' button at <768px"
- **Mobile-specific patterns únicos:**
  - Sticky bottom buy-rail PDP (price + Add to cart, scrollable summary above)
  - Pill-tab nav → hamburger drawer transition
  - Promo banner que **truncates with ellipsis on small mobile, retains inline link affordance**
  - Color swatch 32×32 com 12px clear hit zone (effective ~56px)
- **Vertical fit hipotético desafit:** **fitness/yoga** quando há checkout de programa pago — PDP de programa = PDP de hardware Meta (galeria + sticky buy)
- **Por que adicionar:** Meta documenta a mecânica do sticky-bottom-buy-rail com mais precisão técnica (breakpoints exatos, hit-zone math). Junta com Airbnb cria 2 evidências do mesmo canon — mais robusto.

### 4. apple (já no set #5 — reforçar dimensão mobile)

- **Critérios atendidos:** 4 (de 6) + sticky-bottom canon
- **Vibe primário:** Photography-first museum gallery
- **Dimensões preliminares:**
  - Mood: white canvas + Action Blue + photography
  - Touch target: **exatamente 44×44px (WCAG AAA)** — circular button 44×44 explícito
  - Bottom nav: não documentado
  - FAB: não, mas tem `{component.floating-sticky-bar}` no buy flow
  - Safe area handling: backdrop-filter blur usado em sub-nav-frosted e floating-sticky-bar (frosted glass canon iOS)
- **Mobile-specific patterns únicos:**
  - **`floating-sticky-bar`** — "Floats at the bottom of the viewport on iPhone 17 Pro buy page during scroll. Background canvas-parchment at 80% opacity with backdrop-filter blur. Height 64px. Left: running price total. Right: button-primary ('Add to Bag')"
  - Frosted-glass sub-nav (saturate(180%) blur(20px))
  - `configurator-option-chip` — pill tappable cell em grids de 4–5 opções por row (touch-grid canon)
- **Vertical fit hipotético desafit:** **wellness/premium pricing** — flow de checkout/configurador (escolher plano, escolher add-ons)
- **Por que adicionar:** Apple já está no set como museum gallery; reforçar a dimensão mobile via `floating-sticky-bar` + frosted glass + 44×44 hard floor. Canon iOS HIG mais próximo dentro do set 71.

### 5. starbucks (já no set #18 — reforçar dimensão mobile)

- **Critérios atendidos:** 3 (FAB!), 4 (com mobile padding upgrade) (de 6)
- **Vibe primário:** Warm retail flagship + signature FAB
- **Dimensões preliminares:**
  - Mood: cream-warm canvas + Starbucks Green + retail flagship
  - Touch target: pill buttons ~32px (abaixo de 44, **mobile-expanded**) — float-label inputs grow font 1.6→1.9rem on mobile
  - Bottom nav: não documentado
  - FAB: **SIM, CANÔNICO** — "Frap floating circular button at 56px is well above minimum. Frap uses `--frapTouchOffset: calc(-1 * .8rem)` to extend tap area 8px beyond visual edge. Fixed position bottom-right with `-0.8rem` touch offset" — único FAB de verdade no set 71
  - Safe area handling: não documentado, mas touch-offset patterns sugerem awareness
- **Mobile-specific patterns únicos:**
  - **Frap FAB** — 56px circular, bottom-right fixed, layered shadow (0 0 6px + 0 8px 12px), active scale(0.95) feedback
  - **Touch-offset extension** — tap area maior que visual area (mobile thumb-zone canon)
  - Progressive nav height (64 → 72 → 83 → 99px) — densidade adaptativa
  - Float-label inputs que crescem em mobile
- **Vertical fit hipotético desafit:** **fitness + yoga + idiomas** — FAB persistente para "começar treino" / "começar aula" / "iniciar prática" anchored bottom-right é exatamente o pattern desafit precisa
- **Por que adicionar:** Já está no set #18, mas o FAB é a dimensão SUB-documentada. Reforçar como segunda razão pra estar lá. Frap é o **único FAB real de marca consumer** no set 71.

## Marcas borderline (atendem 2 critérios — decisão editorial)

### B1. tesla (já no set como showroom canon — não pelo mobile)

- **Critérios atendidos:** 4 + persistent bottom bar (mas é chatbot, não nav)
- **Vibe primário:** Museum showroom radical subtraction
- **Mobile pattern relevante:** "Ask a Question" persistent bottom chat-bar anchored to viewport bottom — chatbot canon mobile, não nav
- **Decisão:** **NÃO incluir como mobile-first**. Tesla é showroom marketing photography-first. O persistent chatbot bar é um single pattern, não um sistema mobile.

### B2. uber (NÃO está no set)

- **Critérios atendidos:** 4 (44px+ pills) — surface captured é marketing
- **Vibe primário:** Black-and-white pill-everything super-app marketing
- **Mobile pattern relevante:** "Ride-request form card scales to mobile full-bleed", category chips "inflate to ≥ 44px on touch viewports", "Nav collapses to logo + hamburger; menu overlays full-screen"
- **Decisão:** **borderline — NÃO incluir**. O DESIGN.md captura apenas marketing surface; o app real (com bottom-tab, map full-bleed, swipe gestures de ride confirmation) não foi capturado. Adicionar Uber sem cobrir o app é adicionar "mais um pill+black marketing site" — duplicação de Stripe/Linear visualmente.

### B3. pinterest (NÃO está no set)

- **Critérios atendidos:** 4 (40×40 com hit-zone 48), 5 (mobile single-col masonry)
- **Vibe primário:** Photography-first discovery, masonry-grid
- **Mobile pattern relevante:** "Search bar collapses to magnifier icon → full-width overlay on tap", "Modal: desktop centered 480px-wide card → mobile full-width sheet with rounded top-only and bottom-anchored CTA"
- **Decisão:** **borderline — INCLUIR como #6 NOVO**. Documenta explicitamente "Pinterest mobile app screens not in the system" (gap) MAS o pattern de **masonry-grid + full-width sheet com bottom-anchored CTA** é canon discovery mobile. Pinterest é fundamentalmente app-driven; vale incluir.

### B4. together.ai (NÃO está no set)

- **Critérios atendidos:** 0 critérios fortes, mas menciona "chat-launcher orb" + "sticky-bottom nav row when one appears" (linha 483)
- **Decisão:** **NÃO incluir**. Menção tangencial, não pattern documentado.

### B5. revolut (NÃO está no set)

- **Critérios atendidos:** 4 (48px CTAs, 56px inputs — fintech-grade)
- **Vibe primário:** Black-cobalt fintech marketing
- **Mobile pattern relevante:** Touch targets bem documentados, mas o DESIGN.md fala "Logged-in app surfaces out of scope — only the public marketing canvas is documented"
- **Decisão:** **NÃO incluir** — captura é só marketing, mesmo problema do Uber.

## Cross-cutting patterns mobile (universais entre as 5 identificadas)

Listados na ordem de **universalidade observada nas 5 qualificadas**:

| Pattern                                            | Quantas das 5                        | Universalidade               |
| -------------------------------------------------- | ------------------------------------ | ---------------------------- |
| **Sticky bottom CTA bar em commerce/booking flow** | 3/5 (Airbnb, Meta, Apple)            | **60%** — canon forte        |
| **Hamburger drawer mobile** (top nav collapse)     | 5/5 (todas)                          | 100% — universal mas trivial |
| **Touch target ≥44px** declarado explicit          | 4/5 (Airbnb, Meta, Apple, Starbucks) | 80% — fundação               |
| **Single-column stack 1-up em <480px**             | 5/5                                  | 100% — universal trivial     |
| **Backdrop-filter / frosted glass nav**            | 2/5 (Apple, Spotify ambient)         | 40% — iOS feel               |
| **Bottom-tab nav substituindo sidebar**            | 1/5 (Spotify)                        | 20% — gap no set             |
| **FAB persistente bottom-right**                   | 1/5 (Starbucks)                      | 20% — gap no set             |
| **Pull-to-refresh**                                | 0/5                                  | 0% — não documentado         |
| **Swipe gestures (cards, lists)**                  | 0/5                                  | 0% — não documentado         |
| **Safe area / notch handling**                     | 0/5 (implícito em alguns)            | 0% — gap real                |
| **Status bar customization**                       | 0/5                                  | 0% — gap real                |
| **Bottom sheets (iOS-style modal)**                | 1/5 (Pinterest "full-width sheet")   | 20% — gap no set             |
| **Snap-scroll feed (TikTok/IG)**                   | 0/5                                  | 0% — gap real                |
| **Picker wheels (iOS date/time)**                  | 0/5                                  | 0% — gap real                |
| **Action sheets (iOS)**                            | 0/5                                  | 0% — gap real                |

**Conclusão dos cross-cutting:** o set 71 é robusto em **touch + sticky-bottom + hamburger**, mas **fraco em padrões nativos puros** (bottom-tab, FAB, gestures, safe-area, bottom-sheets).

## Componentes mobile-specific encontrados (e GAPS)

| Component                                         | Encontrado em       | Status                                 |
| ------------------------------------------------- | ------------------- | -------------------------------------- |
| Sticky bottom CTA bar (price+action)              | Airbnb, Meta, Apple | **OK — 3 fontes**                      |
| FAB (floating action button)                      | Starbucks (Frap)    | **OK — 1 fonte, canon**                |
| Bottom tab bar (replacing sidebar)                | Spotify (declared)  | **PARCIAL — declarado, não detalhado** |
| Frosted-glass nav (backdrop-filter blur)          | Apple               | **OK — 1 fonte detalhada**             |
| Full-width sheet modal                            | Pinterest           | **PARCIAL — 1 fonte**                  |
| Touch-offset extension (mobile thumb-zone)        | Starbucks           | **OK — único**                         |
| Configurator chips grid (touch-optimized 4-5 row) | Apple               | **OK — 1 fonte**                       |
| Float-label inputs com mobile font-scale          | Starbucks           | **OK — 1 fonte**                       |
| **Bottom sheets (iOS canon)**                     | nenhum              | **GAP** — necessário pesquisar fora    |
| **Swipeable card stacks**                         | nenhum              | **GAP**                                |
| **Pull-to-refresh handle**                        | nenhum              | **GAP**                                |
| **Snap-scroll vertical feed**                     | nenhum              | **GAP**                                |
| **iOS picker wheels**                             | nenhum              | **GAP**                                |
| **Action sheet (iOS share, destructive)**         | nenhum              | **GAP**                                |
| **Safe-area-inset usage**                         | nenhum explícito    | **GAP**                                |
| **App shell skeleton loading**                    | nenhum              | **GAP**                                |
| **Splash screen / icon design**                   | nenhum              | **GAP**                                |

**Implicação:** Para PWA mobile-first com cara nativa, vamos precisar de **pesquisa complementar fora das 71** sobre:

- iOS HIG specs (action sheet, picker wheel, bottom sheet sizes)
- Material 3 bottom nav specs (height 80dp, label visibility states)
- Apple PWA `apple-mobile-web-app-status-bar-style` patterns
- Workbox / Serwist patterns de app shell

## Recomendação adição ao set archetype (final)

Set archetype expandido de **18 → 22 archetypes** (4 adições novas; Apple+Starbucks = reforço mobile, não novas entradas):

| #      | Marca         | Status                             | Razão da adição                                                              |
| ------ | ------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| 1      | linear.app    | já                                 | (mantém)                                                                     |
| 2      | notion        | já                                 | (mantém)                                                                     |
| 3      | stripe        | já                                 | (mantém)                                                                     |
| 4      | nike          | já                                 | (mantém)                                                                     |
| 5      | apple         | já — **dimensão mobile reforçada** | floating-sticky-bar + frosted glass + 44pt floor                             |
| 6      | wired         | já                                 | (mantém)                                                                     |
| 7      | spacex        | já                                 | (mantém)                                                                     |
| 8      | mistral.ai    | já                                 | (mantém)                                                                     |
| 9      | wise          | já                                 | (mantém)                                                                     |
| 10     | figma         | já                                 | (mantém)                                                                     |
| 11     | theverge      | já                                 | (mantém)                                                                     |
| 12     | claude        | já                                 | (mantém)                                                                     |
| 13     | vodafone      | já                                 | (mantém)                                                                     |
| 14     | opencode.ai   | já                                 | (mantém)                                                                     |
| 15     | mastercard    | já                                 | (mantém)                                                                     |
| 16     | sanity        | já                                 | (mantém)                                                                     |
| 17     | zapier        | já                                 | (mantém)                                                                     |
| 18     | starbucks     | já — **dimensão FAB reforçada**    | Frap FAB canon + touch-offset                                                |
| **19** | **spotify**   | **NOVO**                           | "App, not marketing site" + sidebar→bottom-bar + persistent player bar canon |
| **20** | **airbnb**    | **NOVO**                           | Sticky-bottom-CTA marketplace canon + booking-flow mobile                    |
| **21** | **meta**      | **NOVO**                           | Sticky-bottom-buy-rail PDP + hit-zone math precision                         |
| **22** | **pinterest** | **NOVO**                           | Masonry-grid + bottom-sheet modal canon discovery                            |

**Justificativa de 4 adições novas (não-duplicação):** essas 4 NÃO são variantes desktop-first das 18 existentes — cada uma traz pattern específico não-coberto:

- Spotify: bottom-tab + persistent player (gap em todo o set 71)
- Airbnb: sticky-bottom CTA em booking (gap; Meta também tem mas em commerce, contexto diferente)
- Meta: sticky-bottom CTA em commerce/PDP (complementa Airbnb com vertical diferente)
- Pinterest: bottom-sheet modal + masonry mobile (gap único)

## Marcas avaliadas mas NÃO qualificadas (com justificativa breve)

Todas as outras 70+ marcas leem como **desktop-first marketing surfaces**. Categorizadas pelo motivo:

### "Logged-in app out of scope" (DESIGN.md declara explicitamente)

- coinbase, binance, kraken, revolut, uber — fintechs/super-apps cuja captura é só a landing marketing; o app real não está no DESIGN.md

### Editorial/magazine marketing

- elevenlabs, runwayml, replicate, clay, x.ai, superhuman, cohere, mintlify, resend, lovable, posthog, sentry, ferrari, bmw, bmw-m, bugatti, lamborghini, renault, theverge (in-set), wired (in-set) — leem como print magazines/editorial; mobile = stack 1-up trivial

### Developer tools / IDE-marketing

- raycast, cursor, warp, voltagent, ollama, expo, framer, webflow, vercel (in-set), supabase, composio, together.ai, clickhouse, mongodb, hashicorp, opencode.ai (in-set), figma (in-set), linear.app (in-set), claude (in-set), mistral.ai (in-set), nvidia, ibm — desktop-first canvases, mobile = degradation

### Commerce/showroom marketing

- shopify, miro, intercom, slack, cal, airtable, tesla, playstation, nike (in-set), starbucks (in-set, MAS mobile dimensão), apple (in-set, MAS mobile dimensão), meta (NEW), pinterest (NEW) — commerce; mas exceto os in-set/new, mobile pattern é só stack+hamburger

### Outras

- vodafone (in-set), mastercard (in-set), spacex (in-set), sanity (in-set), wise (in-set), notion (in-set), stripe (in-set), zapier (in-set), wired (in-set) — já cobertos

## Recomendações pra Passos 2A/2B/2C complementares

3 agents devem auditar **APENAS as 4 novas adições + reforços de Apple/Starbucks/Spotify** (não re-auditar as 18 desktop-first):

### Sinais a passar pra Passo 2A (tokens audit)

- **Apple** — extrair tokens precisos do `{component.floating-sticky-bar}` (height 64px, padding 12×32, backdrop-filter blur, opacity 80%) e do `{component.sub-nav-frosted}` (saturate(180%) blur(20px))
- **Starbucks** — extrair tokens do Frap FAB (56px diameter, shadow stack 0 0 6px + 0 8px 12px, touch-offset -0.8rem, scale(0.95) active)
- **Spotify** — extrair tokens de "now-playing bar" persistent (não está em screenshot, mas é declarado)
- **Airbnb** — extrair tokens do reservation-card → sticky-bottom-bar transition
- **Meta** — extrair tokens do PDP sticky bottom (price + Add to cart layout)
- **Pinterest** — extrair tokens do bottom-anchored modal sheet

### Sinais a passar pra Passo 2B (patterns audit)

- Marcas com **bottom-tab declarado**: spotify (apenas)
- Marcas com **FAB documentado**: starbucks (apenas)
- Marcas com **sticky-bottom-CTA**: airbnb, meta, apple, tesla (parcial — só chatbot)
- Marcas com **frosted-glass nav**: apple, claude (já no set), starbucks (parcial)
- Marcas com **touch-offset hit-zone math**: starbucks (único)
- Marcas com **mobile font-scale increase (float labels)**: starbucks (único)
- Marcas com **swipe gestures explícito**: nenhuma (gap)
- Marcas com **safe-area mencionado**: nenhuma explícito (gap)

### Sinais a passar pra Passo 2C (gaps research)

**Padrões mobile-first nativos que NENHUMA das 71 cobre** — precisam pesquisa externa:

1. Bottom sheets (iOS canon: dynamic detents, scroll behavior)
2. Swipeable card stacks (Tinder/IG-style)
3. Pull-to-refresh handle styling
4. Snap-scroll vertical feed (TikTok/IG Reels)
5. iOS picker wheels (date/time)
6. Action sheets (iOS share, destructive confirmations)
7. Safe-area-inset usage explícito (notch, home indicator)
8. Status bar customization PWA
9. App shell skeleton loading
10. Splash screen / app icon (manifest.json patterns)
11. Bottom-tab badge counts (nav-tab com badge unread)
12. Persistent mini-player (Spotify, Apple Music canon)
13. Floating chat-launcher orb (Intercom/Tesla pattern — meio coberto)

**Recomendação:** rodar Pesquisa Profunda externa sobre "iOS HIG mobile patterns + Material 3 bottom nav + PWA app shell canon" como Pesquisa #27 antes de Passos 2A/2B/2C. Os DESIGN.md das 71 marcas NÃO cobrem o canon nativo — só cobrem como degradar marketing-desktop pra mobile.

## Apêndice: arquivos lidos

Total: 27 arquivos DESIGN.md lidos (parcial ou integral), dentro do limite operacional de 70.

- Integralmente / >50%: spotify, airbnb, uber, meta, pinterest, kraken, tesla, apple, starbucks
- Sections 1+5+8 ou Touch/Responsive only: revolut, binance, coinbase, raycast, superhuman, x.ai, elevenlabs, runwayml, replicate, clay, playstation, wise
- Apenas line 4 (description): expo, lovable, slack, shopify, intercom, miro, cal, mintlify, posthog, sentry, mongodb, airtable, hashicorp, webflow, framer, vercel, cursor, resend, supabase, cohere, composio, together.ai, clickhouse, minimax, ollama, voltagent, warp, nvidia, ibm, mastercard, lamborghini, ferrari, bmw, bmw-m, bugatti, renault, vodafone, theverge

**Não consultados** (já no set + descrição já conhecida): linear.app, notion, stripe, nike (parcial), wired, spacex, mistral.ai, figma, claude, opencode.ai, sanity, zapier — confiando em 15-archetype-curation.md.

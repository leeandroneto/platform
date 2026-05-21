# 10. Research queue — feitas, pendentes, recursos externos

> Status: catalog de pesquisas + recursos
> Última atualização: 2026-05-19
> Princípio: **nunca despachar pesquisa sem antes ter pergunta clara + escopo definido**

---

## Pesquisas internas — feitas ✅

| #   | Nome                                   | Tamanho | Path                                              | Status                                         |
| --- | -------------------------------------- | ------- | ------------------------------------------------- | ---------------------------------------------- |
| 23  | Form Engine architecture               | ~62 KB  | `docs/research/23-form-engine-architecture.md`    | ✅ lida + integrada                            |
| 24  | Page Engine architecture               | ~67 KB  | `docs/research/24-page-engine-architecture.md`    | ✅ lida + integrada                            |
| 25  | AI Reports architecture                | ~64 KB  | `docs/research/25-ai-reports-architecture.md`     | ✅ lida + integrada (com filtro frescura)      |
| 26  | Design system vibes / arquétipos       | ~62 KB  | `docs/research/26-design-system-vibes.md`         | ✅ lida + síntese — orienta esta pasta inteira |
| 27  | Design tokens granulares per arquétipo | ~54 KB  | `docs/research/27-design-tokens-per-archetype.md` | ✅ lida + síntese                              |

---

## Pesquisas internas — pendentes ❌

| #   | Nome proposto                                           | Bloqueia o quê                                          | Custo estimado  | Quando despachar                  |
| --- | ------------------------------------------------------- | ------------------------------------------------------- | --------------- | --------------------------------- |
| 28  | Component catalog ampliado (71 refs)                    | `04-components-questions.md` + `07-shadcn-hierarchy.md` | 20-30 min agent | Após decidir hierarquia           |
| 29  | Photography system + AI vibe match                      | `05-photos-questions.md`                                | 15-20 min agent | Antes de codar tenant_photo       |
| 30  | PWA tenant theming + safe-area                          | `06-pwa-mobile-questions.md`                            | 15-20 min agent | Antes de mexer manifest           |
| 31  | Voice & writing principles per archetype                | Princípios de marca / hierarquia textual                | 10-15 min agent | Fase 2 quando admin escrever copy |
| 03  | Prompt engineering (já existente — não consultada hoje) | Prompts curados AI features                             | leitura interna | Antes de cravar prompts Fase 1    |

---

## Pesquisa 28 — escopo proposto

**Objetivo:** extrair catálogo de componentes das 71 DESIGN.md, foco no que pesquisa 27 NÃO pegou (focou em tokens, não em componentes).

**Output esperado:** `docs/research/28-components-catalog-per-archetype.md` (~4-5k palavras)

**Conteúdo:**

- Lista de TODOS componentes encontrados nas DESIGN.md
- Variants per archetype (Top nav Linear vs Vercel vs Stripe — diferenças)
- States completos (rest/hover/active/disabled/loading/focus-visible)
- Responsive behavior (mobile vs desktop layout shifts)
- Mapping componente × camada hierarquia (block / primitive / lib / headless / custom)
- Anti-patterns específicos por componente (e.g. "Nav mistura 3+ libs = frankenstein")

**Mandato pro agent:**

- Ler 15-20 DESIGN.md amostrados (todas 5 marcas-base + 10 wildcards)
- Listar EVERY component name encontrado
- Catalogar variants + states + responsive
- NÃO repetir tokens da pesquisa 27 — só componentes

---

## Pesquisa 29 — escopo proposto

**Objetivo:** photography system completo — upload, AI vibe matching, AI gen pipeline, art-direction crop, painel editor.

**Output esperado:** `docs/research/29-photography-system.md` (~3-4k palavras)

**Conteúdo:**

- Photography philosophy detalhada per archetype (com exemplos)
- AI vibe matching algorithm (Claude vision + Vibrant.js OKLCH extraction)
- Prompts curados per archetype (Flux/Imagen)
- Custos detalhados + quota tiers
- Stock library API integration (Unsplash, Pexels)
- Art-direction crop algorithm (multi-viewport rectangles)
- Painel editor UI patterns (referências: Builder.io, Framer)

---

## Pesquisa 30 — escopo proposto

**Objetivo:** PWA multi-tenant theming — manifest dinâmico, splash matrix iOS, service worker scope, install fluxos, EU edge case.

**Output esperado:** `docs/research/30-pwa-tenant-theming.md` (~3-4k palavras)

**Conteúdo:**

- Manifest dinâmico per tenant — viabilidade iOS/Android
- Splash screen matrix iOS top 12-16 devices
- Service worker scope per tenant (subdomain vs path)
- Install fluxos 3-distintos (Chromium / iOS Share / Safari Dock)
- EU iOS 17.4+ edge case (browser-tab experience)
- Safe-area-inset + viewport-fit:cover
- Cache strategy fotos (Serwist)
- Template swap pós-install behavior

---

## Pesquisa 31 — escopo proposto

**Objetivo:** voice & writing principles per archetype — tone of voice, hierarquia textual, microcopy.

**Output esperado:** `docs/research/31-voice-writing-principles.md` (~2-3k palavras)

**Conteúdo:**

- Tone of voice per archetype:
  - Editorial-Serif: expertise / trust / intelligence
  - Minimal-Mono: precise / direct / technical
  - Soft-Productive: professional / helpful / clear
  - Bold-Energetic: powerful / urgent / motivational
  - Warm-Wellness: calm / nurturing / gentle
- Microcopy patterns (button labels, error messages, empty states, loading)
- Heading scale + how to compose (no more than 2 fonts simultaneously)
- Writing rules per locale (PT-BR specifics)
- Brand voice document template

---

## Recursos externos a consultar

Pra ler **antes** de despachar pesquisas — ou em paralelo se forem genéricos:

### Primary reference (consultar primeiro)

| Recurso               | URL               | Quando consultar                                                                                                                    | Custo |
| --------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **designsystems.com** | designsystems.com | **Referência primária.** Artigos curados + exemplos canônicos + 4-level hierarchy (Foundations → Components → Patterns → Templates) | Free  |

### Design systems canônicos

| Recurso                         | URL                                                   | Quando consultar                              | Custo |
| ------------------------------- | ----------------------------------------------------- | --------------------------------------------- | ----- |
| **IBM Carbon**                  | carbondesignsystem.com                                | Token granularity, multi-platform, Figma free | Free  |
| **IBM GEL** (Global Experience) | ibm.com/design/language                               | Brand principles, design philosophy           | Free  |
| **Atlassian Design System**     | atlassian.design                                      | Foundations + components + content + brand    | Free  |
| **Ant Design**                  | ant.design/docs/spec/layout                           | Layout spec especialmente — grids, spacing    | Free  |
| **Shopify Polaris**             | polaris.shopify.com                                   | Motion + design system maduro                 | Free  |
| **VMware Clarity**              | clarity.design                                        | Enterprise design system                      | Free  |
| **Material Design 3**           | m3.material.io                                        | Foundational mobile, motion, tokens           | Free  |
| **iOS Human Interface**         | developer.apple.com/design/human-interface-guidelines | Mobile/PWA, typography, touch targets         | Free  |
| **GitHub Primer**               | primer.style                                          | Dev-tools archetype reference                 | Free  |
| **Salesforce Lightning**        | lightningdesignsystem.com                             | Enterprise complexity                         | Free  |
| **Adobe Spectrum**              | spectrum.adobe.com                                    | Premium creative tools                        | Free  |

### Diretórios + meta

| Recurso                    | URL                                        | Quando consultar                     |
| -------------------------- | ------------------------------------------ | ------------------------------------ |
| **designsystemsrepo.com**  | designsystemsrepo.com                      | Diretório de design systems públicos |
| **designsystem.com**       | designsystem.com                           | Artigos curados sobre design systems |
| **Awesome Design Systems** | github.com/alexpate/awesome-design-systems | Lista GitHub mantida                 |

### Livros

| Livro                             | Autor                       | Cobertura                                  | Status              |
| --------------------------------- | --------------------------- | ------------------------------------------ | ------------------- |
| **Design Systems**                | Alla Kholmatova             | Functional/perceptual, purposeful patterns | ❌ não lido         |
| **Atomic Design**                 | Brad Frost                  | Atoms/molecules/organisms/templates/pages  | ❌ não lido (canon) |
| **Refactoring UI**                | Adam Wathan + Steve Schoger | Tailwind-aligned tactical advice           | ❌ não lido         |
| **Designing for the Digital Age** | Kim Goodwin                 | UX research foundation                     | ❌ não lido         |

→ **Prioridade leitura:** Kholmatova (vocabulário) + Atomic Design (organização) antes de cravar blueprints.

### 71 DESIGN.md (já no projeto)

Lista categorizada (cf. `.claude/rules/design-references.md`):

- **AI:** anthropic, cohere, claude, elevenlabs, midjourney equivalente, minimax, mistral.ai, ollama, opencode.ai, openai equivalente, replicate, runwayml, together.ai, x.ai
- **Dev tools:** cursor, expo, framer, github equivalente, hashicorp, linear.app, lovable, mintlify, mongodb, posthog, raycast, sanity, sentry, supabase, vercel, voltagent, warp
- **Fintech:** binance, coinbase, kraken, mastercard, revolut, stripe, wise
- **SaaS:** airtable, cal, clickhouse, composio, figma, intercom, miro, notion, resend, shopify, slack, superhuman, zapier
- **Consumer:** airbnb, apple, meta, netflix equivalente, pinterest, playstation, spotify, starbucks, tesla, uber, webflow, wired, x
- **Auto/luxo:** bmw, bmw-m, bugatti, ferrari, lamborghini, nike, renault
- **Outros:** clay, ibm, nvidia, sanity, theverge, vodafone

**Marcas DA pesquisa 27 lidas (11):** sanity, notion, theverge, linear, vercel, claude, stripe, figma, nike, tesla, airbnb.

**Faltantes / a considerar:**

- IBM Carbon (no repo? checar)
- Apple full DESIGN.md
- Spotify (engagement consumer)
- Anthropic (AI conversational)
- Webflow / Framer (builder)
- Supabase (dev tools dark)

---

## Skills / MCPs externos relevantes

(Catalogados em `como-usar.md`)

- **Impeccable** (`/audit`, `/polish`) — ✅ instalado, combate AI generic
- **frontend-design** (Anthropic oficial) — ✅ listado
- **Axe Accessibility MCP** — ⏳ JIT quando APCA não cobrir ARIA
- **v0-mcp** — ⏳ JIT pra gerar variants em massa
- **Figma MCP** — usável quando design system tiver Figma (Carbon disponível)

---

## Workflow padrão pra pesquisa nova

1. **Definir pergunta clara** — uma frase
2. **Identificar bloqueio** — qual decisão depende disso?
3. **Escopo defined** — o que está IN, o que está OUT
4. **Output expected** — formato + tamanho + arquivo destino
5. **Despachar agent** com mandato preciso (não vago)
6. **Ler integralmente** antes de qualquer crava
7. **Síntese** pra arquivo nesta pasta (`docs/design-system/*`)
8. **Decisão consciente** depois (não com pressa de "documentar pra não perder")

---

## Pendências

- [ ] **Ler Kholmatova "Design Systems"** (prioridade alta)
- [ ] Ler Brad Frost "Atomic Design" (canon clássico)
- [ ] Acessar IBM Carbon docs + Figma free
- [ ] Acessar Atlassian Design System
- [ ] Acessar Ant Design layout spec
- [ ] Acessar Shopify Polaris motion docs
- [ ] Acessar Material Design 3 + iOS HIG (foundational mobile)
- [ ] Decidir prioridade pesquisas 28-31 (qual primeiro?)
- [ ] Despachar pesquisa 28 quando perguntas em `04-components-questions.md` estiverem maduras
- [ ] Ler pesquisa 03 (prompt engineering — existente, não consultada)

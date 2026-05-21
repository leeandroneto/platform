# 00. Estado atual do design system rethink

> Status: snapshot WIP
> Última atualização: 2026-05-19 (sessão overnight autonomous — 8 loops de pesquisa + commits)
> Conversation log: `docs/_archive/2026-05-19-conversation-evolution.md`

---

## ☀️ Wake-up summary (ler primeiro)

Sessão noturna fez **8 loops de pesquisa externa + commit** entre 20:00 e ~00:00:

| Loop | Fonte                                | Onde foi documentado                        | Commit    |
| ---- | ------------------------------------ | ------------------------------------------- | --------- |
| 1    | designsystems.com — Iconography      | `03-tokens-universe.md` §16.9               | `7cb9e5a` |
| 2    | designsystems.com — Typography       | `03-tokens-universe.md` §2.7                | `6509085` |
| 3    | designsystems.com — Content strategy | `09-kholmatova-vocab.md` (Content section)  | `4d26469` |
| 4    | IBM Carbon                           | `03-tokens-universe.md` §3.5 (dual spacing) | `64e236e` |
| 5    | Atlassian Foundations                | `03-tokens-universe.md` §17 (3 cat novas)   | `0360b36` |
| 6    | Material 3 + iOS HIG                 | `06-pwa-mobile-questions.md` (mobile canon) | `3990dc9` |
| 7    | Shopify Polaris motion               | `03-tokens-universe.md` §6.5                | `9607516` |
| 8    | Ant Design layout                    | `03-tokens-universe.md` §10.1               | `413752b` |

**Princípios consolidados (todos confirmados por 2+ fontes):**

- **Base unit 8px** (Carbon + Ant + Material — convergência absoluta)
- **Touch target 44-48px** (Apple 44pt + Material 48dp — usar 44 floor + 48 comfortable)
- **2 spacing scales separadas** (Carbon: component + layout — confirma nossa decisão)
- **Token-as-SSOT** (Atlassian + Polaris — _"never hardcode, always tokens"_)
- **Clone-first é OK** (Ana Boyer Figma: _"no shame in standing on shoulders of giants"_)
- **Spotify Encore 2-subsystems** (mobile + web sharing tokens) — modelo direto pro multi-tenant PWA
- **Atomic Design = mental model**, não dogma (Frost mesmo critica em 2024)
- **Kholmatova functional/perceptual** = framework principal pra desafit

**Decisões que ficaram MAIS claras (não cravadas, só refinadas):**

- **3 dimensões** (Archetype × Palette × Content) — density absorvida no archetype
- **Naming bi-modal:** `--space-component-NN` + `--space-component-card` (numeric + semantic)
- **Motion granular:** 12 durations Polaris-style + 5 easings cubic-bezier verbatim
- **Iconography:** 24px product / 80px marketing canon + 1 cor product icons
- **Mobile:** safe-area-inset + 44px touch floor + Material 3 informa Bold-Energetic / iOS HIG informa Wellness+Luxe

**O que NÃO mudou:**

- Decisões ainda ZERO (princípio "documentar primeiro, decidir depois")
- Hipóteses continuam 9
- Pesquisas pendentes: 28 (components ampliada) / 29 (photos) / 30 (PWA) / 31 (voice)
- Tokens em produção continuam intactos
- 14 docs do `docs/design-system/` continuam estrutura igual — agora cravados por 10+ fontes externas

**Próximo passo recomendado:** ler `09-kholmatova-vocab.md` (vocabulário consolidado) + `03-tokens-universe.md` (universo de tokens enriquecido) antes de despachar pesquisa 28.

---

## TL;DR

- Pesquisas feitas: **2** (26 framework + 27 tokens granulares)
- Pesquisas pendentes: **4+** (28 components, 29 photos, 30 PWA tenant theming, 31 voice/writing)
- Hipóteses em discussão: **9** (ver `01-hypotheses.md`)
- Decisões cravadas: **ZERO** — tudo aqui é exploração
- Bloqueador maior: clone-first strategy depende de escolher quais N brands (5? 15-20?) — adiar até pesquisa 28
- **Material externo lido 2026-05-19 (sessão noite + overnight autonomous):**
  - **Livros + frameworks conceituais:**
    - Kholmatova "Design Systems" — definições verbatim + 8 técnicas (Pattern map, Interface inventory, Patterns as actions, etc) — ver `09-kholmatova-vocab.md`
    - Brad Frost Atomic Design — Chapter 2 verbatim + 6 críticas 2024-2025 + Frost 2024 admission ("would talk more about design tokens") — ver `09-kholmatova-vocab.md`
  - **designsystems.com (Figma publication):**
    - "Six myths" (valida clone-first: _"no shame in standing on shoulders of giants"_)
    - Space/grids canon (8pt + 4pt half-steps, element-first vs content-first)
    - 3 scaling strategies (Adaptive/Responsive/Strict)
    - Spotify Encore (2 subsystems multi-platform — modelo direto pro nosso caso)
    - **Iconography guide** (24px product / 80px marketing default, stroke 1-2px, 1 color product icons, anatomy rules)
    - **Typography guide** (1.5x line-height starting point, pesos parcimoniosos, serif display + sans body pairing)
    - **Content strategy guide** (title case vs sentence case, glossário ativo, empty states unblock-focused, localização)
  - **Design systems canônicos:**
    - **IBM Carbon** — 8px mini unit, **2 spacing scales separadas** (component + layout), 4 principles (Clarity/Efficiency/Consistency/Beauty)
    - **Atlassian Foundations** — 3 categorias adicionais (Illustrations, Logos, Border), token-as-SSOT principle
    - **Material Design 3** — 48dp touch target floor, 8dp spacing between touches
    - **iOS HIG 2025-2026** — 44pt touch min, SF Pro Text/Display split em 19pt, Dynamic Type, **iOS 26 Liquid Glass** (não copiar — proprietary)
    - **Shopify Polaris** — 12 duration tokens granulares (0/50/100/.../500/5000ms), 5 easings com cubic-bezier verbatim, 6 keyframes nomeados
    - **Ant Design** — 24-column grid, 1168px content em 1440px board, 2 layout types (left-right + top-bottom)
- **Próximo passo:** decidir despachar pesquisa 28 com mandato ampliado (Encore-style: web vs PWA mobile subsystems + components per archetype × platform matrix) OU prototype 1 archetype end-to-end

---

## Cronologia resumida (como chegamos aqui)

| Quando                | O quê                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dia 0**             | 13 paletas OKLCH soltas + 47 shadcn primitives quarentenados + 3 elevations + 8 radius + 3 typography primitives                                                    |
| **2026-05-19 ~15:00** | User percebeu que "13 paletas isoladas" é insuficiente pra white-label premium. Inflexão estratégica iniciada                                                       |
| **15:18**             | Hipótese inicial: Template × Palette × Content (3 dimensões)                                                                                                        |
| **15:40**             | User cravou: "templates são bundle de tokens estruturais, paletas são overlay" — clone-first começa a aparecer                                                      |
| **Pesquisa 26**       | Voltou (~62 KB) — propôs **4 dimensões** (adicionando Density) + 5 arquétipos core + 2 opcionais + 4 dimensões hipótese teórica                                     |
| **Pesquisa 27**       | Voltou (~54 KB / 11 marcas amostradas) — **empiricamente refutou density-como-4ª-dim**: cada arquétipo top tem density fixada                                       |
| **Sessão atual**      | User reframe: **volta a 3 dimensões** (density absorvida) + clone-first amplo (15-20 brands?) + "shadcn cobre tudo ou construímos?" + isolar trabalho em pasta nova |

---

## O que JÁ TEMOS (tokens atuais)

**Em produção (`app/globals.css` + Tailwind v4 `@theme`):**

- 13 paletas OKLCH (validadas APCA Silver)
- 47 shadcn primitives em `components/ui/*` (ADR-0040 — Edit bloqueado, canal único `npx shadcn add`)
- 3 elevations (`--elevation-flat`, `--elevation-raised`, `--elevation-overlay` — ADR-0042)
- 8 radius levels (`rounded-sm` até `rounded-2xl` + `rounded-pill`)
- 5 shape presets
- 3 typography primitives (`Heading`, `Text`, `Muted`) + 9 JIT planejados (não construídos)
- Geist Sans + Geist Mono (next/font local)
- Motion 12 (`motion/react`)
- APCA Silver gate (`pnpm token:audit`)
- Multi-marca via hostname (`useBrand()`, `getBrandByHost()`)
- 3 wrappers obrigatórios (`AppForm`, `AppToast`, `AppEntitlementGate`)

**Em rules/hooks/lint:**

- `.claude/rules/design-references.md` — regras 71 DESIGN.md uso
- `.claude/rules/design-tokens.md` — tokens canônicos do projeto
- `.claude/rules/shadcn-zone.md` — zona quarentenada
- `.claude/rules/contrast.md` — APCA Silver gate
- `.claude/rules/brand.md` — multi-marca rules
- Hook `block-token-bypass.sh` (bloqueia hex/font literal fora de allowlist)
- Hook `component-research-gate.sh` (bloqueia Write/Edit em `components/ui/*` sem marker)
- ESLint `design-tokens/no-tailwind-bypass`

---

## O que está FALTANDO (gaps identificados — pesquisa 27)

15 gaps listados na pesquisa 27. Top 5 críticos:

| Gap                                     | Origem                                                                  | Solução proposta                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `--shadow-card-1` até `--shadow-card-5` | Hoje só 3 elevations. Stripe/Vercel/Notion exigem 5 progressive stacked | Vercel canon (5 tinted stacked) mapeado em CSS vars                                    |
| `--radius-soft: 14px`                   | Gap entre `md=12` e `lg=16` — Airbnb canon                              | Adicionar entre os 8 níveis atuais                                                     |
| Container max-widths tokenizadas        | Hoje magic numbers nos componentes                                      | `--container-narrow` (1080) / `--container-default` (1280) / `--container-wide` (1440) |
| Section padding mobile ≠ desktop        | Hoje uniforme                                                           | `--space-section-mobile: 48px` / `--space-section-desktop: 96px` / `hero: 128px`       |
| Aspect ratio tokens                     | shadcn não tokeniza                                                     | `--aspect-hero` (16/9) / `card` (1/1) / `portrait` (4/5) / `banner` (2/1)              |

Lista completa: pesquisa 27 §"Gaps nos nossos tokens atuais" (linhas 743-764) e detalhamento em `03-tokens-universe.md` (a criar).

---

## O que está EM DÚVIDA (perguntas-chave em aberto)

| Pergunta                                                        | Status                                         | Onde decidir                                       |
| --------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| Quantos arquétipos? 5? 15-20?                                   | Em discussão                                   | Após pesquisa 28 + UX research                     |
| Quais DESIGN.md cada arquétipo clona?                           | 5 marcas-base identificadas; expansão pendente | Após pesquisa 28 + amostragem ampla                |
| Density é dimensão ou propriedade do template?                  | Hipótese atual: propriedade                    | Confirmar com Carbon/Atlassian/Polaris             |
| Shadcn carrega quanto via CSS vars?                             | Estimativa atual: ~60%                         | Prototype 1 arquétipo end-to-end                   |
| Origin UI / Aceternity / Magic UI cabem antes de criar do zero? | Hipótese: sim (ADR-0037 menciona)              | Mapping componente×lib em `07-shadcn-hierarchy.md` |
| Photos: AI vibe matching cabe Fase 1 ou Fase 2?                 | Indefinido                                     | Após pesquisa 29                                   |
| PWA: swap de templates funciona em mobile ou só desktop?        | Indefinido                                     | Após pesquisa 30                                   |
| Atomic Design vocab vale adotar literal?                        | Hipótese: como comunicação, não dogma          | Após leitura Kholmatova                            |

---

## Dependências externas (recursos a consultar)

**Já no projeto:**

- 71 DESIGN.md em `docs/references/design-systems/` (VoltAgent fork)
- `docs/research/26-design-system-vibes.md`
- `docs/research/27-design-tokens-per-archetype.md`

**Externos canônicos (catalog completo em `10-research-queue.md`):**

- **designsystems.com** ← **referência primária** (artigos curados + 4-level hierarchy canônica)
- **IBM Carbon** (completíssimo, Figma free, multi-platform incluindo mobile)
- **Atlassian Design System** (foundations + components + content + brand)
- **Ant Design** (especialmente `https://ant.design/docs/spec/layout`)
- **Shopify Polaris** (motion + design system maduro)
- **Material Design 3** + **iOS Human Interface Guidelines** (foundational mobile)
- **VMware Clarity** (design system enterprise)
- **IBM GEL** (Global Experience Language)
- **designsystemsrepo.com** (diretório de design systems públicos)
- Livro **Design Systems** — Alla Kholmatova (atoms/molecules + functional/perceptual)
- Brad Frost — **Atomic Design** (referência clássica complementar)

---

## Trabalho atual NÃO afeta código de produção

Nada nesta sessão mexeu em:

- `app/` · `components/` · `lib/` · `styles/`
- Tokens em produção (`app/globals.css`)
- Migrations aplicadas
- Schema do banco
- ADRs cravados

Pesquisas 26+27 estão em `docs/research/`. Esta pasta (`docs/design-system/`) é puramente exploratória.

---

## O que muda a partir daqui

1. **Documentar tudo nesta pasta antes de qualquer decisão** (princípio: "não perder contexto")
2. **Despachar pesquisas pendentes** somente após termos clareza do que precisa estar nelas
3. **Ler Kholmatova** antes de cravar vocabulário
4. **Prototype** 1 arquétipo (Editorial-Serif ou Minimal-Mono) end-to-end **antes** de criar 5 — valida arquitetura 3-camadas shadcn
5. **Não tocar código produção** até decisões estarem cravadas (= promovidas pra ADR/blueprint)

---

## Como saber se "decisão cravada" aconteceu

Critérios cumulativos (todos):

- [ ] Pesquisa correspondente concluída
- [ ] Hipótese sobreviveu objections em `01-hypotheses.md`
- [ ] Não há alternativa não-explorada conhecida
- [ ] Conteúdo pronto pra ADR/blueprint (não draft)
- [ ] User confirmou intenção de cravar (não inferido)

Sem os 5: continua hipótese, fica nesta pasta.

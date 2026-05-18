# JIT vs upfront em SaaS founder solo + wrapper strategy + 5 decisões críticas dia 0

> **Data:** 2026-05-18 · **Autor:** Claude Code (WebSearch direto, não Claude Desktop) · **Status:** working notes, não ADR
> Pesquisa rápida pra fechar 5 decisões pendentes do dia 0 do greenfield `platform/`.

---

## TL;DR — 5 decisões resumidas

1. **Wrappers de primitive:** começar com **3-5 essenciais** (Button, Input, Card é o consenso público pra "starter design system"). Vercel Academy é explícito: wrapper que só re-exporta "doubles the design system size" — só criar quando agregar valor real (loading state, i18nKey, telemetria). **Veredito:** 5 wrappers críticos confirmado (decisão B do Item 1).

2. **Typography primitives:** Nathan Curtis (EightShapes) recomenda **3-4 text sizes + 4-6 heading levels** como minimum viable. Adicionar JIT quando feature pedir. **Não criar os 12 do blueprint dia 0.** Custo de fazer cego = redesign quando ver uso real.

3. **i18n locales adicionais:** padrão público confirmado — usar `t()` desde dia 1 mesmo com 1 locale só. **Estrutura: namespace por feature/locale (`messages/<locale>/<namespace>.json`)**, não flat. next-intl docs e SimpleLocalize confirmam namespace escala melhor pra multi-vertical. **Veredito:** só pt-BR dia 0, namespace por feature.

4. **Tenant copy override:** Locize, SimpleLocalize e WorkOS confirmam padrão "base translation + tenant override namespace" — mas todos recomendam **adiar até cliente real pedir**. Custo de retrofit é trivial (find/replace em chaves já existentes). **Veredito:** M3+, schema NÃO criar dia 0.

5. **Abstrair shadcn:** Vercel Academy explícito — wrapper pattern proxy "doubles design system size and makes ownership concept redundant". Migração shadcn → Mantine custa 3-5× a implementação inicial. **Não vale a pena abstrair.** Refactor real quando vier é guiado por contexto, não por wrapper preventivo.

**JIT vs upfront:** Martin Fowler YAGNI é canonical — abstrações pra "futuro" têm 4 custos (build + delay + carry + reparo se mudou). Mas YAGNI **não** se aplica a refactoring (deixar código fácil de mudar é OK). Pieter Levels prova caso extremo (vanilla PHP, $3M/ano solo). Para founder solo + shadcn ownership: defer JIT vence em quase todo cenário.

---

## Decisão 1 — Wrapper coverage de primitives shadcn

### Achado público

Vercel Academy é a fonte canonical sobre wrapper pattern em shadcn. Citação verbatim:

> "Using a wrapper pattern to proxy or pre-compose shadcn/ui components effectively doubles the component design system size and makes the ownership concept redundant."

Esta é a posição oficial. Mantine vs shadcn migration cost: **3-5× effort de implementação inicial** (saasindie.com 2026). Quanto mais wrappers desnecessários, mais código pra migrar.

### Padrão "minimum viable" pra solo founder

Logan Lee (Medium) e Tomek Buszewski (DEV.to) convergem: **começar com Button, Input, Card** e expandir conforme features pedem. Não há caso público de "criamos 47 wrappers upfront" que tenha gerado retorno mensurável.

### O que sustenta os 5 wrappers críticos (decisão B do Item 1)

Justificativa NÃO é "completude" — é **destravar lint**:

- `no-restricted-imports` bloqueia `@/components/ui/*` em features
- Se wrapper alternativo não existe → lint trava feature 1
- 5 wrappers (Button, Input, Form, Dialog, Toast) cobrem ~80% do uso em login + dashboard
- Cada wrapper **deve agregar valor**: i18nKey, loading state, error display integrado com RHF, etc. Wrapper que só re-exporta é o anti-pattern que Vercel Academy bate.

### Veredito

Confirma decisão B (5 wrappers críticos). Documentar em ADR-0040 que wrapper sem valor agregado é **proibido** — não pode ser só "import passthrough".

---

## Decisão 2 — Typography primitives custom dia 0

### Achado público

Nathan Curtis (EightShapes, principal autoridade pública em design systems) define minimum viable:

> "Solve for just enough heading types, with usually four to six heading levels and a sprinkle of special variants."

> "Most systems need three or so [text sizes] to start with and expanding as necessary."

Total: **3-4 text + 4-6 heading = 7-10 primitives**. Os 12 do blueprint platform são consistentes mas **alguns são especulativos**:

| Primitive                               | Status na pesquisa pública                  |
| --------------------------------------- | ------------------------------------------- |
| `Heading`, `Text`                       | **Essencial** (Curtis confirmado)           |
| `Stack`, `Container`                    | **Essencial** (toda tela usa layout)        |
| `VisuallyHidden`                        | **Essencial** (a11y, ~20 linhas)            |
| `EmptyState`                            | **Comum** (toda lista vazia precisa)        |
| `Metric`, `DataCell`                    | **Específico** — depende do dashboard real  |
| `Code`, `Eyebrow`, `Section`, `Divider` | **Opcional** — JIT por uso                  |
| `<Logo>`                                | **Específico** — depende design final marca |

### Risco de criar 12 cego

Curtis adverte: "early in a design system period, teams make a list of parts they want to create and identify the minimum quality each must achieve". **Minimum quality exige uso real** — Metric sem ver dashboard real provavelmente terá API errada na primeira tela que precisar.

### Veredito

**Criar 5 essenciais dia 0:** `Heading`, `Text`, `Stack`, `Container`, `EmptyState`.
**JIT:** `Metric`, `DataCell`, `Code`, `Eyebrow`, `Section`, `Divider`, `VisuallyHidden`, `<Logo>`.

Custo dos 5: ~3-4h. Risco zero (Curtis confirma essas 5 como universais). Os outros 7 entram quando feature 1 pedir.

---

## Decisão 3 — i18n locales adicionais dia 0

### Achado público

**Estratégia universal confirmada por 4 fontes** (next-intl docs, SimpleLocalize, Lokalise, Crowdin):

> "The safest strategy is to use translation keys and locale-aware formatting from the very beginning, even if you only ship in one language initially, as the cost is minimal upfront and saves enormous effort later."

**Isso valida o setup do platform** (`t('key')` desde dia 1 mesmo com pt-BR único). Bootstrap-checklist está correto.

### Flat vs namespace

next-intl Discussion #357 confirma:

> "Splitting translations by namespace or feature domain keeps files small, reduces merge conflicts, and enables lazy loading."

Padrão recomendado:

```
messages/
  pt-BR/
    common.json       (header, footer, errors, validation)
    auth.json         (login, signup, reset-password)
    billing.json      (paywall, upgrade, plans)
    programs.json     (multi-vertical: keys descritivas)
```

**Lazy loading por namespace** — Next.js carrega só o que a rota usa, bundle não infla.

### Risco do flat único

`messages/pt-BR.json` único pode escalar até ~200-300 keys sem problema. Acima disso:

- Merge conflicts em commits paralelos
- Bundle inteiro carrega em toda rota
- Hard de achar key específica

### Veredito

**Adotar namespace por feature desde dia 0** — custo zero pra setup, evita refactor futuro. Estrutura:

- `messages/pt-BR/common.json` (dia 0)
- `messages/pt-BR/auth.json` (junto com feature login)
- demais arquivos JIT por feature

Locales adicionais (en-US, pt-PT, es-ES): **NÃO dia 0**. Estrutura `messages/<locale>/<namespace>.json` já aceita irmãos sem refactor.

---

## Decisão 4 — Tenant copy override dia 0

### Achado público

Locize e SimpleLocalize confirmam **padrão canonical** de tenant override:

> "SimpleLocalize implements a resolution order of: tenant override → base translation → fallback language."

Implementação: tabela ou namespace por tenant + merge runtime no `getMessages()` do next-intl.

### Quando implementar (3 fontes convergem)

- **Locize:** "tenant administrators should only be able to modify their own translations" — implica UI de admin pra editar = feature pesada
- **SimpleLocalize:** "Multi-tenant localization adds complexity to the translation workflow" — recomenda adiar até cliente real pedir
- **WorkOS guide:** padrões de tenant customization são last-mile, não foundation

### Custo de retrofit

Se você usa `t('programs.title')` em 100 lugares hoje, adicionar override depois é **trivial**:

- Não muda call sites (continua `t('programs.title')`)
- Adiciona resolver no `getMessages()` server-side
- Cria tabela `tenant_copy_overrides` quando precisar
- Custo estimado: **2-4h** (não 15-20h como projetei antes)

Diferente de hardcoded inline — esse seria caro retrofit.

### Veredito

**NÃO criar dia 0.** Schema vazio também não. Documentar no playbook `.claude/rules/i18n.md` como JIT. Gatilho: **cliente 2 com vertical diferente pede explicitamente** (ex: BoxClub pede "Treinos" em vez de "Programas").

---

## Decisão 5 — Abstrair shadcn pra trocar futuramente

### Achado público

Vercel Academy é direto:

> "Using a wrapper pattern to proxy [...] effectively doubles the component design system size and makes the ownership concept redundant."

Migration cost real (SaaSIndie 2026 benchmark):

| Direção          | Custo                                         |
| ---------------- | --------------------------------------------- |
| Mantine → shadcn | Alto (rewrite UI layer)                       |
| shadcn → Mantine | Médio (gradual replace)                       |
| MUI → shadcn     | 3-8 semanas                                   |
| Geral            | Migração custa **3-5×** implementação inicial |

### Por que abstrair NÃO ajuda

Wrapper "pra abstrair shadcn" tem 3 problemas:

1. **Duplica camada.** `components/ds/Button` → `components/ui/button` → primitive. Toda mudança em 2 lugares.
2. **API fica errada cedo.** Você abstrai cego, descobre depois que API do wrapper não cobre 30% dos casos.
3. **Não acelera migração real.** Quando trocar lib (5-10 anos), benchmarking real guia, não wrapper preventivo.

### Casos públicos de troca de lib UI core

Não há caso público notório de empresa que **trocou** lib core e o wrapper preventivo tenha **acelerado** a migração. Vercel mantém Geist próprio (não migrou shadcn). Linear mantém design system custom desde V1. Stripe mantém biblioteca própria (`stripe-apps/components`).

### Veredito

**NÃO abstrair.** Vercel Academy + Martin Fowler YAGNI convergem. Wrapper pattern aqui só faz sentido quando agrega valor concreto (i18n, telemetria, loading state), não quando é "preparação pra futuro".

---

## Tema transversal — JIT vs upfront em founder solo

### Martin Fowler YAGNI (canonical)

> "Any abstraction that makes it harder to understand the code for current requirements is presumed guilty."

3 classes de "presumptive features" + 4 custos:

1. **Custo de construir** — tempo gasto em feature especulativa
2. **Custo de delay** — features reais atrasam
3. **Custo de carry** — toda manutenção daquela feature até virar útil
4. **Custo de reparo** — quando você descobre que estava errado

**Importante:** YAGNI **não** se aplica a refactoring nem a "deixar código fácil de mudar". Boundaries claras (Sheriff), zero `eslint-disable`, hooks PreToolUse — tudo isso é refactoring-friendly, não YAGNI violation.

### Pieter Levels — caso extremo

- Vanilla PHP + jQuery + SQLite, zero abstraction
- $3M/ano com solo + sem employees
- 40+ projetos lançados
- "Ship fast and rough" — consistency, not perfection

**Limite:** Pieter não tem multi-tenant white-label B2B + multi-vertical. Stack dele cabe num arquivo. Não é template direto.

### Padrão "playbook em ADR pra JIT chegar"

Não há benchmark público claro de **memória externa em doc** como vocês querem. Mas analogias funcionam:

- AWS Well-Architected Framework: checklists pra arquitetura JIT
- Stripe Atlas: playbooks pra incorporation JIT
- Conventional Commits: doc pra commit pattern aplicar JIT

**Hipótese:** registrar gatilho + passo-a-passo + anti-pattern + referência cruzada em `.claude/rules/*.md` resolve. Validar com teste — sessão nova lê doc e executa sem perder.

### Veredito transversal

Para founder solo + shadcn ownership:

- **JIT defer é certo** quando custo de carry > custo de retrofit
- **Upfront é certo** quando:
  - Lint bloqueia desenvolvimento (caso wrapper 5 críticos)
  - Estrutura de pasta/setup tem custo zero de criação (caso `messages/<locale>/<namespace>.json`)
  - Refactor depois é caro (caso `t('key')` inline vs hardcoded)

**Anti-pattern crítico:** confundir "estar pronto pra mudar" com "implementar pra futuro". Boundaries claras + memória externa em doc + JIT defer = combinação ótima.

---

## Aplicação ao platform/

| Item                  | Recomendação pesquisada                                                | Action                                                                |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Wrappers críticos     | 5 (Button, Input, Form, Dialog, Toast) — cada um agrega valor concreto | ✅ confirmar decisão B                                                |
| Typography primitives | 5 (Heading, Text, Stack, Container, EmptyState) — Curtis universais    | ⚠️ revisar: era item 2 pendente                                       |
| Locales adicionais    | Não dia 0, mas namespace por feature desde já                          | ⚠️ revisar: estrutura `messages/<locale>/<namespace>/` em vez de flat |
| Tenant copy override  | Não dia 0, schema NÃO, retrofit é 2-4h depois                          | ✅ confirmar default conservador                                      |
| Abstrair shadcn       | Não fazer, Vercel Academy é explícito                                  | ✅ confirmar default conservador                                      |

---

## Sources

- [Vercel Academy — Updating and Maintaining Components](https://vercel.com/academy/shadcn-ui/updating-and-maintaining-components) — wrapper pattern doubles design system size
- [Martin Fowler — Yagni](https://martinfowler.com/bliki/Yagni.html) — 3 presumptive features + 4 costs, refactoring exception
- [Nathan Curtis — Typography in Design Systems (EightShapes)](https://medium.com/eightshapes-llc/typography-in-design-systems-6ed771432f1e) — 4-6 headings + 3 text sizes minimum viable
- [next-intl Discussion #357 — multiple namespaces per locale](https://github.com/amannn/next-intl/discussions/357) — `src/messages/<locale>/<namespace>.json` pattern
- [next-intl docs — Rendering translations](https://next-intl.dev/docs/usage/messages) — namespace + lazy load
- [SimpleLocalize — i18n complete guide](https://simplelocalize.io/blog/posts/internationalization-guide-software-localization/) — `t()` desde dia 1, tenant override architecture
- [Locize — Multi-tenant Localization](https://www.locize.com/multi-tenant/) — per-customer translation overrides resolution order
- [SaaSIndie — Mantine vs shadcn comparison 2026](https://saasindie.com/blog/mantine-vs-shadcn-ui-comparison) — migration cost 3-5× initial implementation
- [shadcn/ui Issue #1350 — install all components](https://github.com/shadcn-ui/ui/issues/1350) — on-demand é best practice
- [shadcn/ui Discussion #2535 — hide radix imports](https://github.com/shadcn-ui/ui/discussions/2535) — enforce wrapper via no-restricted-imports
- [Pieter Levels — Nomad List founder story](https://www.fast-saas.com/blog/pieter-levels-success-story/) — vanilla PHP, $3M/year solo, ship fast
- [Logan Lee — Building a React Design System (Medium)](https://medium.com/@dlrnjstjs/building-a-react-design-system-creating-a-reusable-component-library-99fd70a4d6be) — start with Button, Input, Card
- [Tim de Schryver — Enforce module boundaries with no-restricted-imports](https://timdeschryver.dev/bits/enforce-module-boundaries-with-no-restricted-imports) — pattern oficial

---

## Caveats

- **Sem caso público de "5 wrappers críticos vs 47 upfront vs 0 wrappers" com métrica de retrofit.** Recomendação extrapolada de Vercel Academy + EightShapes + Levels.
- **Pieter Levels não é template direto** — multi-tenant white-label B2B é outro escopo.
- **Tenant copy override custo de retrofit (2-4h)** é estimativa minha — não há benchmark público com platform/ shape exato.
- **next-intl namespace lazy loading** funciona em RSC mas precisa wire correto em `i18n/request.ts` — confirmar com docs v4 quando implementar.
- **APCA dual-gate Silver vs Bronze** não é coberto aqui (Pesquisa 18 cobriu).

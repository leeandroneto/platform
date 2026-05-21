# 11. Decisões pendentes — log único

> Status: log mestre — toda decisão de design system NÃO-CRAVADA passa por aqui
> Última atualização: 2026-05-19
> Convenção: cada decisão tem ID `D-NN`, dependências, opções, recomendação preliminar, prazo realista

---

## Como usar este arquivo

1. **Toda decisão pendente entra aqui** com ID + dependências + opções
2. **Quando decisão é tomada**, marcar como "✅ Decidido em <data> + onde foi cravado" — depois mover pra arquivo de decisões resolvidas (criar `12-decisions-resolved.md` quando primeira fechar)
3. **Decisões dependem umas das outras** — explicitar bloqueios
4. **Nunca decidir aqui** — este arquivo SÓ documenta. Decisão cravada vai em ADR/blueprint/rule.

---

## D-01 — Quantas dimensões composicionais?

- **Status:** hipótese forte (3 dim)
- **Opções:**
  - A) **3 dimensões** — Template × Palette × Content. Density absorvida no template.
  - B) 4 dimensões — Template × Palette × Density × Content (pesquisa 26 propôs)
- **Recomendação preliminar:** A) — pesquisa 27 refutou empiricamente B
- **Bloqueia:** D-02, D-04, D-05, ADR-NN (pós-pesquisas)
- **Bloqueado por:** leitura IBM Carbon (eles tratam density como toggle global? confirmar)
- **Onde cravar quando decidido:** ADR-NN + CLAUDE.md regras críticas
- **Prazo realista:** após pesquisa 28 + leitura Carbon

## D-02 — Quantos arquétipos / templates?

- **Status:** em discussão
- **Opções:**
  - A) **5 core** + 2 opcionais (pesquisa 26 conservador)
  - B) **5-8 headline curados + biblioteca raw 10-12** (compromise)
  - C) **15-20 amplo** (user reframe — clone-first é barato)
- **Recomendação preliminar:** B (compromise) — UX mostra 5-8 primeiros, advanced users acessam +10-12 raw
- **Bloqueia:** D-03, D-04, pesquisa 28 mandato
- **Bloqueado por:** pesquisa 28 (component catalog) + UX research preferences
- **Onde cravar:** ADR-NN + blueprint design system architecture
- **Prazo realista:** após pesquisa 28 + 1 prototype

## D-03 — Quais DESIGN.md cada arquétipo clona?

- **Status:** parcialmente identificado (5 marcas-base preliminares)
- **Opções por archetype:**
  - Editorial-Serif: Sanity (dark) | Notion (light) | The Verge (brutalist)
  - Minimal-Mono: Vercel (light + 5 stacked) | Linear (dark + ladder) | Claude (warm-mono)
  - Soft-Productive: Stripe (canon) | Figma (color blocks) | Shopify (no DESIGN.md disponível)
  - Bold-Energetic: Nike (commerce) | Tesla (luxury) | Whoop/Strava (ausentes)
  - Warm-Wellness: Airbnb (proxy fraco) | Calm/Headspace/Aaptiv (ausentes — baixar?)
- **Recomendação preliminar:** decidir APÓS pesquisa 28 + leitura adicional Carbon/Atlassian/Polaris/Material/HIG
- **Bloqueia:** implementação `lib/design/archetypes/<archetype>.ts`
- **Bloqueado por:** D-02 + pesquisa 28
- **Onde cravar:** ADR-NN ou blueprint
- **Prazo realista:** após D-02

## D-04 — Density: dimensão ou propriedade?

- **Status:** hipótese: propriedade do archetype (refutou pesquisa 26)
- **Opções:**
  - A) Propriedade do archetype (cada archetype tem density fixa)
  - B) Component-level prop (`button-sm/md/lg`) sem density de sistema
  - C) Ambos (Stripe faz B; archetype define padrão default)
- **Recomendação preliminar:** C — archetype define default + components têm `size` prop opcional
- **Bloqueia:** vocab (density tokens?), components API
- **Bloqueado por:** D-01
- **Onde cravar:** ADR-NN
- **Prazo realista:** junto com D-01

## D-05 — Naming convention de tokens

- **Status:** indefinido
- **Opções:**
  - A) Numeric scale (`--shadow-card-1`, `--shadow-card-2`, ..., `--radius-1`, etc)
  - B) Semantic (`--shadow-card-rest`, `--shadow-card-hover`, `--radius-button`, `--radius-card`, etc)
  - C) Bi-modal — numeric pra scale + semantic pra uso especializado
- **Recomendação preliminar:** C — Carbon e Tailwind v4 mostram bi-modal funciona
- **Bloqueia:** `app/globals.css @theme` definição
- **Bloqueado por:** D-01, D-04
- **Onde cravar:** rule `design-tokens.md` revisada
- **Prazo realista:** após pesquisas + leitura Carbon

## D-06 — Shadcn cobertura: prototype valida % real

- **Status:** estimativa atual 60%
- **Opções:**
  - A) Assumir 60% e seguir
  - B) Prototype 1 archetype end-to-end pra medir realmente
- **Recomendação preliminar:** B — prototype Editorial-Serif ou Minimal-Mono e medir
- **Bloqueia:** estimativa de trabalho real
- **Bloqueado por:** decisões 28-31 maduras + 1 archetype escolhido
- **Onde cravar:** ADR-NN (com % real medido)
- **Prazo realista:** após pesquisa 28

## D-07 — Quais libs friendly ativar (Origin UI / Aceternity / Kibo / Magic UI / Reui)?

- **Status:** indefinido
- **Opções:**
  - A) Dia 1 — apenas Origin UI (cobre gaps shadcn forms)
  - B) Dia 1 — Origin UI + Kibo
  - C) Dia 1 — Origin UI + Kibo + Magic UI ou Aceternity (motion)
  - D) Dia 1 — nada extra, JIT
- **Recomendação preliminar:** D — JIT quando componente real precisar
- **Bloqueia:** components.json registries config
- **Bloqueado por:** pesquisa 28 mapping
- **Onde cravar:** ADR-NN ou rule
- **Prazo realista:** após pesquisa 28

## D-08 — Photos: camada própria ou propriedade do template?

- **Status:** hipótese H7: camada própria
- **Opções:**
  - A) Camada própria — `tenant_photo` table + sistema de upload/crop/AI
  - B) Sub-propriedade do template — aspect ratios + philosophy embutidas, tenant só sobe imagem
- **Recomendação preliminar:** A — tenant precisa controle granular
- **Bloqueia:** schema `tenant_photo`, painel upload, AI gen pipeline
- **Bloqueado por:** pesquisa 29
- **Onde cravar:** blueprint photography + ADR
- **Prazo realista:** após pesquisa 29

## D-09 — AI vibe matching: Fase 1 ou Fase 2?

- **Status:** indefinido
- **Opções:**
  - A) Fase 1 opt-in (custo barato $0.006/call)
  - B) Fase 2 (esperar maturidade)
- **Recomendação preliminar:** A — barato + diferenciação
- **Bloqueia:** painel upload UX
- **Bloqueado por:** pesquisa 29
- **Onde cravar:** plano + rule photography
- **Prazo realista:** após pesquisa 29

## D-10 — AI photo generation: quota por tier

- **Status:** indefinido
- **Opções:**
  - A) Free tier: 0 AI gen. Pacote A: 20/mês. Pacote C: 50/mês.
  - B) Diferente
- **Recomendação preliminar:** A — proporcional ao preço dos pacotes
- **Bloqueia:** entitlements config
- **Bloqueado por:** pesquisa 29 + revisão custos
- **Onde cravar:** rule entitlements + rule photography
- **Prazo realista:** após pesquisa 29

## D-11 — PWA: manifest dinâmico per tenant funciona em iOS?

- **Status:** desconhecido
- **Opções:**
  - A) Sim — manifest dinâmico per subdomain
  - B) Parcialmente — funciona até primeira install, depois lockado
  - C) Não — fallback pra static manifest por tenant SO
- **Recomendação preliminar:** B (provavelmente — testar)
- **Bloqueia:** arquitetura PWA inteira
- **Bloqueado por:** pesquisa 30 + testes reais iOS
- **Onde cravar:** ADR PWA
- **Prazo realista:** após pesquisa 30

## D-12 — Template swap pós-PWA-install: bloquear ou permitir?

- **Status:** indefinido
- **Opções:**
  - A) Bloquear — tenant não pode trocar template após primeiro install
  - B) Permitir com aviso — UX explica "ícone na home não atualiza"
  - C) Forçar "atualizar app" workflow (notification + URL re-add)
- **Recomendação preliminar:** A dia 1 (lock simples), B Fase 2 (com aviso), C Fase 3+
- **Bloqueia:** UX admin do tenant
- **Bloqueado por:** D-11 + pesquisa 30
- **Onde cravar:** rule pwa-tenant + blueprint
- **Prazo realista:** após pesquisa 30

## D-13 — Mobile-first redesign per archetype: o que muda além de responsive?

- **Status:** indefinido
- **Opções:**
  - A) Só responsive (mesmos componentes, breakpoints diferentes)
  - B) Layouts diferentes (Bold-Energetic art-direction crop Nike)
  - C) Componentes diferentes (`<DesktopNav />` vs `<MobileNav />`)
- **Recomendação preliminar:** B + C híbrido — varia por componente
- **Bloqueia:** arquitetura componentes
- **Bloqueado por:** pesquisa 28 + UX research
- **Onde cravar:** rule design-system-architecture (futura)
- **Prazo realista:** após pesquisa 28

## D-14 — Atomic Design vocab: adotar como folder organization?

- **Status:** hipótese H9
- **Opções:**
  - A) Adotar literal (`components/atoms/`, `components/molecules/`, etc)
  - B) Adotar conceito (sem folders explícitos) + glossário compartilhado
  - C) Não adotar — manter `components/ui/*` + `components/app-*` atual
- **Recomendação preliminar:** B — glossário compartilhado, mantém folder atual
- **Bloqueia:** organização `components/`
- **Bloqueado por:** leitura Kholmatova
- **Onde cravar:** rule naming + rule components
- **Prazo realista:** após leitura Kholmatova

## D-15 — "Template" colide com Atomic. Renomear?

- **Status:** hipótese: renomear pra `archetype`
- **Opções:**
  - A) Renomear nosso "template" → `archetype`
  - B) Manter "template" + qualificar (`design template` vs `page template`)
  - C) Outro nome (vibe, style preset, design preset, brand-style)
- **Recomendação preliminar:** A — `archetype` é técnico, sem colisão, já em uso nas pesquisas
- **Bloqueia:** vocab + naming.md + nomes em código
- **Bloqueado por:** D-14
- **Onde cravar:** rule naming + glossário
- **Prazo realista:** junto com D-14

## D-16 — Clone-first: precedentes legais OK?

- **Status:** desconhecido
- **Opções:**
  - A) Tokens estruturais (radius=14px, spacing=4px) são fine — clonar
  - B) Cores literais + fontes exatas vira issue — substituir
- **Recomendação preliminar:** verificar com legal advisor antes de cravar
- **Bloqueia:** clone-first strategy
- **Bloqueado por:** consulta legal + benchmark mercado (Tailwind UI, Framer templates pagos)
- **Onde cravar:** ADR clone-first ou plano
- **Prazo realista:** antes de implementar primeiro archetype

## D-17 — Customização tenant: granular ou só template+palette?

- **Status:** indefinido
- **Opções:**
  - A) Apenas template + palette — sem override granular
  - B) Override variants individuais (radius, shadow) via admin
  - C) Edição completa de tokens (vira CMS)
- **Recomendação preliminar:** A dia 1, B Fase 2 JIT, C nunca
- **Bloqueia:** admin UX + schema
- **Bloqueado por:** D-02 + UX research
- **Onde cravar:** ADR + plano
- **Prazo realista:** após primeiro tenant rodando

## D-18 — Container max-widths: 3 níveis ou só 1?

- **Status:** indefinido
- **Opções:**
  - A) 3 níveis tokens (`narrow=1080`, `default=1280`, `wide=1440`)
  - B) 1 default (1280) + override per page
  - C) Per archetype (Editorial=1280, Bold=1440, Warm=narrow 1080)
- **Recomendação preliminar:** A — tenant escolhe via archetype
- **Bloqueia:** `@theme` tokens + layouts
- **Bloqueado por:** decisões archetype mapping
- **Onde cravar:** rule design-tokens
- **Prazo realista:** após D-03

## D-19 — Bibliotecas friendly: forkar ou registry import?

- **Status:** indefinido
- **Opções:**
  - A) Registry import via `components.json` (mantém update path)
  - B) Fork — copiar pro `components/app-*` (controle máximo, perde updates)
- **Recomendação preliminar:** A — alinha com ADR-0040 quarentena pattern
- **Bloqueia:** components.json config
- **Bloqueado por:** D-07
- **Onde cravar:** rule shadcn-zone revisada
- **Prazo realista:** após D-07

## D-20 — Voice / writing principles: pesquisa interna ou externa?

- **Status:** indefinido
- **Opções:**
  - A) Pesquisa externa (#31) — extrai dos DESIGN.md + livros de branding
  - B) Pesquisa interna — UX research com profissionais reais
  - C) Adiar — JIT quando admin tiver primeiro tenant escrevendo copy
- **Recomendação preliminar:** C dia 1 (frescura), depois A se demanda crescer
- **Bloqueia:** Fase 2 admin writing UX
- **Bloqueado por:** Fase 2 começar
- **Onde cravar:** pesquisa 31 + rule writing futura
- **Prazo realista:** Fase 2

## D-21 — Token contract universal: arquitetura 3 layers (refinada após D-43)

- **Status:** hipótese forte (refinada 2026-05-20 após decisão D-43 Semantic Roles)
- **Contexto:** contract não é só "30 tokens" — é **3 layers** com responsabilidades distintas
- **Arquitetura 3-layer:**
  - **Layer 1 — Raw tokens** (~30 universal + N extended per archetype)
    - Valores OKLCH/numeric concretos: `--accent`, `--surface-canvas`, `--ink-primary`
    - Universal core (~30) + extended per archetype (Notion adiciona `--accent-tint-peach` etc)
  - **Layer 1.5 — Semantic Roles** (D-43 — ~20-30 universal)
    - Slots use-case based: `--role-feature-card-bg`, `--role-text-emphasis`, `--role-page-canvas`
    - **Componentes USAM SEMPRE roles, não raw tokens**
    - Cada archetype implementa TODOS os roles (mapeia roles → raw tokens próprios)
  - **Layer 2 — Native aliases** (D-33 — opcional per archetype)
    - Nomes editoriais nativos: `--tint-peach` (Notion), `--canvas-white` (Notion)
    - Existe pra dev experience + documentação, NÃO pra componentes
- **Opções (refinadas):**
  - A) **3-layer arquitetura completa** (recomendada) — Raw + Roles + Native, componentes usam roles
  - B) 2-layer simplificado — Raw + Native (sem roles), componentes usam raw direto
  - C) Sem contract — cada archetype define livre
- **Recomendação preliminar:** A — 3-layer resolve auto-swap inteligente + naming rico (D-33) + componentes agnósticos
- **Bloqueia:** implementação `lib/design/contract.ts` + audit shadcn primitives + Storybook stories
- **Bloqueado por:** D-43 (lista de roles definida) + prototype 1 archetype valida
- **Onde cravar:** ADR-NN + blueprint design tokens
- **Prazo realista:** Fase 0-1 transformation plan

## D-22 — Naming convention tri-modal (refinada após D-21 3-layer)

- **Status:** hipótese refinada 2026-05-20
- **Naming per layer:**
  - **Layer 1 raw tokens** — semantic `--surface-*`, `--ink-*`, `--accent-*`, `--extended-*`, `--semantic-*`, `--neutral-*` (Atlassian/Polaris style)
  - **Layer 1.5 semantic roles** — use-case based `--role-feature-card-bg`, `--role-page-canvas`, `--role-text-emphasis`, `--role-cta-primary` (Material 3 style)
  - **Layer 2 native aliases** — preserva naming editorial de cada marca `--tint-peach`, `--ink-deep`, `--charcoal`, `--canvas-white` (per archetype)
- **Opções:**
  - A) **Tri-modal completo** (recomendada) — todos 3 layers, naming distinto cada
  - B) Bi-modal (raw + native) — sem roles
  - C) Single-layer (só roles) — perde controle granular
- **Recomendação preliminar:** A — tri-modal alinha com Material 3 (roles) + Atlassian (semantic raw) + Notion-style (native rich)
- **Bloqueia:** lib/design refactor + TypeScript Role type
- **Bloqueado por:** D-21 (3-layer cravado) + D-43 (lista de roles)
- **Onde cravar:** rule design-tokens revisada + ADR
- **Prazo realista:** Fase 1 transformation plan

## D-23 — Fonts per archetype: dia 1 só free, paid JIT?

- **Status:** recomendação forte
- **Opções:**
  - A) Dia 1: só free (Geist + Newsreader + Anton). Paid JIT em tier premium.
  - B) Dia 1: incluir 1-2 paid (Söhne ou Tiempos) — diferenciação visual
  - C) Custom font upload por tenant (Fase 2+)
- **Recomendação preliminar:** A dia 1, C Fase 2 — paid avoid (licença web $300+ per fonte)
- **Bloqueia:** font loading strategy + `next/font` config
- **Bloqueado por:** decisão de pricing tiers
- **Onde cravar:** rule design-tokens + lib/design/fonts.ts
- **Prazo realista:** após D-21

## D-24 — Brand da agência/SaaS (desafit.app): qual archetype + palette?

- **Status:** indefinido (crítico — bloqueia landing institucional)
- **Opções:**
  - A) Bold-Energetic + Rausch palette — alinha com vertical fitness primário
  - B) Soft-Productive + indigo palette — visual SaaS-pro, não fitness clichê
  - C) Minimal-Mono + grayscale — neutro, multi-vertical capable
  - D) Editorial-Serif + warm palette — sugere expertise
- **Recomendação preliminar:** C — neutro suporta marca multi-vertical (fitness + yoga + idiomas). Bold-Energetic é pra vertical primária musculação no funil agência, NÃO pra marca da agência.
- **Bloqueia:** landing institucional desafit.app/agencia
- **Bloqueado por:** prototype 1 archetype + decisão estratégica brand
- **Onde cravar:** ADR-NN + `lib/design/brands/desafit.ts`
- **Prazo realista:** antes de codar M1 (funil agência)

## D-25 — 13 paletas atuais: manter, refinar ou substituir?

- **Status:** hipótese — manter
- **Opções:**
  - A) Manter as 13 (já validadas APCA Silver)
  - B) Refinar — auditar quais não são compatíveis com nenhum archetype
  - C) Substituir — pesquisa nova de paletas premium per archetype
- **Recomendação preliminar:** B leve — manter 13 mas auditar contra compatibility matrix. Eliminar paletas que não combinam com NENHUM archetype.
- **Bloqueia:** quantos combos válidos arch × palette
- **Bloqueado por:** D-21 + D-22 + compatibility matrix Zod
- **Onde cravar:** rule design-tokens + audit `lib/design/palettes.ts`
- **Prazo realista:** após prototype

## D-26 — Quais 5 brand DESIGN.md clonar? (escolha final)

- **Status:** parcialmente identificado
- **Opções por archetype:**
  - Editorial-Serif: **Sanity (dark)** OU **Notion (light pastel)**
  - Minimal-Mono: **Vercel (light + stacked shadow canon)** OU **Linear (dark + surface ladder)**
  - Soft-Productive: **Stripe** (canon — sem alternativa forte)
  - Bold-Energetic: **Nike (commerce photography)** OU **Tesla (luxury cinematic)**
  - Warm-Wellness: **Airbnb (proxy)** OU baixar Calm/Headspace
- **Recomendação preliminar:** decidir dual pra cada (light + dark variant) — duplica trabalho mas cobre tenants light-mode vs dark-mode
- **Bloqueia:** implementação archetypes
- **Bloqueado por:** D-02 (quantos archetypes) + UX research
- **Onde cravar:** ADR-NN + `lib/design/archetypes/<name>/`
- **Prazo realista:** após pesquisa 28

## D-27 — Photos: 4 fases (upload → AI matching → AI gen → art-direction)

- **Status:** hipótese fases
- **Opções:**
  - A) Fase 1: upload painel manual (agência sobe pro tenant). AI matching JIT.
  - B) Fase 1: upload + AI vibe matching opt-in. AI gen Fase 2.
  - C) Tudo Fase 2 (postpone)
- **Recomendação preliminar:** A — upload painel é mínimo viável; AI matching pode esperar
- **Bloqueia:** painel admin
- **Bloqueado por:** pesquisa 29
- **Onde cravar:** blueprint photography + roadmap
- **Prazo realista:** Fase 1 = upload; Fase 2 = AI matching; Fase 3 = AI gen

## D-28 — One-click theme swap: mecânica completa

- **Status:** hipótese técnica
- **Opções:**
  - A) Swap simples (muda DB → revalidateTag → próxima request reflete)
  - B) Swap orquestrado (APCA gate + cache invalidation + manifest re-gen + splash re-gen + PWA notify)
  - C) Swap com transição animada (CSS view transitions)
- **Recomendação preliminar:** B — orquestrado obrigatório. C JIT.
- **Bloqueia:** admin tenant UX
- **Bloqueado por:** D-21 + pesquisa 30
- **Onde cravar:** blueprint + ADR PWA
- **Prazo realista:** após Fase 1 funil agência

## D-29 — Semantic colors universais (success/warn/danger/info): per archetype ou universais?

- **Status:** indefinido
- **Opções:**
  - A) **Universais** — mesmas 4 cores semantic em todos archetypes (acessibilidade + reconhecimento)
  - B) Per archetype — cada archetype tem suas cores semantic alinhadas com vibe
  - C) Híbrido — semantic hue universal (verde=success) mas saturação/lightness ajusta per archetype
- **Recomendação preliminar:** C — hue universal (reconhecimento user) + ajuste saturação per archetype (coerência visual)
- **Bloqueia:** lib/design/semantic.ts
- **Bloqueado por:** D-22
- **Onde cravar:** rule design-tokens + lib/design/
- **Prazo realista:** junto com D-22

## D-30 — Dark mode: per archetype ou cross-archetype?

- **Status:** indefinido
- **Opções:**
  - A) Cada archetype tem variant dark próprio (Sanity dark + Notion dark + Stripe dark + ...)
  - B) Dark mode é toggle universal (qualquer archetype + dark = paleta dark)
  - C) Alguns archetypes são dark-first only (Linear, Sanity) — sem light variant
- **Recomendação preliminar:** A — cada archetype tem light + dark explícitos. Variants per archetype dão coerência.
- **Bloqueia:** schema tenant.theme_mode + CSS architecture
- **Bloqueado por:** D-21 + D-26
- **Onde cravar:** rule design-tokens + ADR
- **Prazo realista:** após D-21

## D-31 — Internacionalização visual: PT-BR ajustes além do `t()`

- **Status:** hipótese (pesquisa 26 mencionou)
- **Opções:**
  - A) Tokens `[lang]` overrides (line-height, letter-spacing — pesquisa 26 sugere)
  - B) Sem ajuste — Tailwind v4 + Geist `latin-ext` cobre
  - C) Mixed — defaults universais + override per language quando necessário
- **Recomendação preliminar:** C — começa universal, override JIT quando PT-BR causar layout shift visível
- **Bloqueia:** typography rules
- **Bloqueado por:** validação visual em pages reais
- **Onde cravar:** rule i18n revisada
- **Prazo realista:** após primeira página rendered

## D-32 — Prefers-reduced-motion: como respeitar?

- **Status:** hipótese a11y obrigatória
- **Opções:**
  - A) CSS `@media (prefers-reduced-motion: reduce)` desliga animations
  - B) Per archetype — alguns têm motion-zero variant
  - C) Token `--motion-enabled` que JS lê + condicionalmente aplica
- **Recomendação preliminar:** A — CSS media query é mais simples + universal
- **Bloqueia:** WCAG compliance
- **Bloqueado por:** nenhum
- **Onde cravar:** rule contrast (ampliada) ou rule motion (nova)
- **Prazo realista:** Fase 1 (a11y é blocker)

## D-33 — Token naming strategy: native vs canonical per archetype

- **Status:** hipótese forte (confirmado por screenshot Notion 2026-05-20)
- **Contexto:** cada DESIGN.md original tem nomes próprios. Notion: "Tint Peach", "Ink", "Charcoal", "Hairline". Linear: "surface-1", "border-subtle". Carbon: "$ui-01", "$text-01". Componentes precisam saber quais usar.
- **Opções:**
  - A) **2-layer** — Layer 1 = nomes canônicos (`--ink-primary`, `--surface-card`); Layer 2 = aliases nativos opcionais (`--tint-peach: var(--accent-subtle-peach)`). Componentes USAM SEMPRE Layer 1.
  - B) **Só canonical** — perdemos nomes ricos das marcas (Notion "Tint Peach" vira `--accent-subtle-peach` sem alias native)
  - C) **Só native** — cada archetype usa nomes próprios, componentes precisam saber qual archetype está ativo
- **Recomendação preliminar:** A 2-layer — componentes agnósticos via canonical + Layer 2 aliases pra documentação/dev experience + onboarding visual ao mapping
- **Mecânica:**

  ```css
  /* canonical (sempre) */
  --accent-subtle-peach: #ffe8d4;

  /* native alias (per archetype Notion) */
  --tint-peach: var(--accent-subtle-peach);
  ```

  → Componente shadcn usa `var(--accent-subtle-peach)`. Native `--tint-peach` existe SÓ pra dev experience.

- **Mapping documentation:** cada `lib/design/archetypes/<name>/mapping.md` lista "Native Notion → Canonical desafit"
- **Bloqueia:** implementação de TODO archetype
- **Bloqueado por:** D-22 (naming convention) + D-21 (token contract)
- **Onde cravar:** rule design-tokens + ADR
- **Prazo realista:** Fase 1 transformation plan

## D-34 — Brand assets ≠ tokens: sistema próprio?

- **Status:** indefinido
- **Contexto:** logo do tenant (SVG mark + wordmark + lockup), favicon, apple-touch-icon, brand kit — não são tokens visuais, mas precisam sistema dedicado.
- **Opções:**
  - A) Tabela `tenant_brand_assets` separada de `tenant_photo` + componente `<Logo>` (já existe) expandido pra sistema completo
  - B) Reusar `tenant_photo` com surface='logo' (mais simples mas menos rigoroso)
  - C) JIT — só `<Logo>` simples dia 1, sistema completo Fase 2
- **Recomendação preliminar:** A em Fase 6 (com photos), C dia 1
- **Bloqueia:** PWA icons + manifest + favicon
- **Bloqueado por:** D-27 (photos system)
- **Onde cravar:** blueprint photography ampliado
- **Prazo realista:** Fase 6 transformation plan

## D-35 — Email + PDF medium constraints

- **Status:** indefinido
- **Contexto:** email = table-based HTML (Outlook ainda exige), inline CSS. PDF via `@react-pdf/renderer` — subset CSS. Tokens não podem ser reusados 1:1 do web.
- **Opções:**
  - A) Subsystems separados — `lib/design/email/tokens.ts` + `lib/design/pdf/tokens.ts` com subset compatible
  - B) Single source mas adapter functions exportam values compatíveis com email/pdf
  - C) Hardcode dia 1, JIT quando email/PDF realmente importante
- **Recomendação preliminar:** B — adapter functions evita drift. Single token source com `getEmailTokens(archetype)` e `getPDFTokens(archetype)` que retornam subset.
- **Bloqueia:** report IA email entrega (pesquisa 25) + transactional emails
- **Bloqueado por:** D-21 token contract
- **Onde cravar:** blueprint email + blueprint pdf + lib/design/adapters/
- **Prazo realista:** Fase 2 do roadmap maior (não deste plano)

## D-36 — Print stylesheet

- **Status:** indefinido (a11y secundária)
- **Contexto:** relatório IA que profissional ou cliente imprime. `@media print` precisa: zero color (ink econômico), alta legibilidade, hide nav/CTAs.
- **Opções:**
  - A) Print stylesheet universal — `@media print { /* defaults */ }`
  - B) Per archetype — Editorial-Serif tem print-optimized rules
  - C) Adiar — print é frescura até cliente pedir
- **Recomendação preliminar:** A universal em Fase 7 governance (~1 dia trabalho)
- **Bloqueia:** UX usuário que imprime
- **Bloqueado por:** nenhum
- **Onde cravar:** `app/styles/print.css`
- **Prazo realista:** Fase 7 transformation plan

## D-37 — RTL languages (Arabic, Hebrew)

- **Status:** indefinido (futuro Fase 3+)
- **Contexto:** internacionalização real exige `dir="rtl"` support. Geist não tem RTL coverage forte. Tailwind v4 suporta `rtl:` prefix.
- **Opções:**
  - A) Suporte total dia 1 — usar Tailwind `rtl:` + testar todos componentes
  - B) Documentar como gap, JIT quando primeiro tenant RTL aparecer
  - C) Não suportar — restringir a LTR languages apenas
- **Recomendação preliminar:** B — documentar restrição + JIT. Restringir customers iniciais a PT-BR + EN + ES + idiomas LTR
- **Bloqueia:** internacionalização Arabic/Hebrew
- **Bloqueado por:** demanda real
- **Onde cravar:** rule i18n + caveats
- **Prazo realista:** JIT Fase 3+

## D-38 — Color blindness (Protanopia / Deuteranopia / Tritanopia)

- **Status:** a11y necessário
- **Contexto:** APCA cobre contrast só. Combos accent + semantic precisam testar daltonismo. Especialmente success=verde + danger=vermelho (Deuteranopia confunde).
- **Opções:**
  - A) Testar todas combinações com simulador color blindness em CI
  - B) Garantir que semantic colors não dependem SÓ de hue (icon + texto + cor — redundância)
  - C) Permitir tenant override de semantic colors com aviso
- **Recomendação preliminar:** B é blocker WCAG (não-cor-only). A é nice-to-have CI.
- **Bloqueia:** WCAG compliance
- **Bloqueado por:** D-29 semantic colors
- **Onde cravar:** rule contrast ampliada + lib/design/semantic.ts
- **Prazo realista:** Fase 7 governance

## D-39 — High-contrast mode (Windows forced-colors)

- **Status:** a11y secundário
- **Contexto:** Windows users com high-contrast forçado quebram design systems custom. CSS `@media (forced-colors: active)`.
- **Opções:**
  - A) Suporte total — `@media (forced-colors: active)` desliga CSS vars custom
  - B) Documentar como gap
  - C) JIT quando reclamação de user real
- **Recomendação preliminar:** A em Fase 7 — adiciona ~1 dia de trabalho, evita complaints WCAG
- **Bloqueia:** WCAG AAA partial
- **Bloqueado por:** nenhum
- **Onde cravar:** `app/styles/forced-colors.css` + rule contrast
- **Prazo realista:** Fase 7

## D-40 — Performance budget per archetype

- **Status:** indefinido
- **Contexto:** Variable fonts são maiores. Geist variable ~150KB. 5 archetypes × subsets pode estourar 500KB só em fonts. CSS vars também adicionam KB.
- **Opções:**
  - A) Budget rígido — máx 250KB CSS + 200KB fonts per page (LCP target)
  - B) Lazy load per archetype — só carrega fonts/CSS do archetype ativo
  - C) Sem budget — otimizar quando Lighthouse reclamar
- **Recomendação preliminar:** A budget rígido + B lazy load — `app/styles/templates/<archetype>.css` lazy via `<link rel="stylesheet">` condicional
- **Bloqueia:** Lighthouse score / Core Web Vitals
- **Bloqueado por:** Fase 2-3 (medição)
- **Onde cravar:** rule + `lib/size-budget.ts`
- **Prazo realista:** Fase 8 validação

## D-41 — Theme switching transition UX

- **Status:** indefinido
- **Contexto:** Quando tenant troca archetype/palette, o que cliente vê na próxima visita? Refresh hard? CSS view transitions smooth?
- **Opções:**
  - A) Hard refresh — simples, sem mágica, OK pra mudanças raras
  - B) CSS view transitions API (Chrome 111+, Safari 18+, Firefox no) — smooth fade
  - C) Notificação prévia + opt-in apply (preview before commit)
- **Recomendação preliminar:** A dia 1, B Fase 5 quando swap virar feature, C Fase 6+
- **Bloqueia:** UX premium
- **Bloqueado por:** D-28 swap mechanics
- **Onde cravar:** rule swap UX
- **Prazo realista:** Fase 5-6

## D-42 — Tenant pivot warning (mudança de archetype após produção)

- **Status:** indefinido (problema futuro real)
- **Contexto:** Tenant Acme opera há 6 meses com Warm-Wellness → muda pra Bold-Energetic → clientes finais ficam confusos.
- **Opções:**
  - A) Aviso UI ao trocar ("clientes verão visual diferente") + opt-in confirm
  - B) Notification automática pros clientes ("Sua app foi atualizada visualmente")
  - C) Período preview before commit (tenant vê 7 dias antes de aplicar pra clientes)
  - D) Bloquear mudança radical — só pode trocar archetype com mesmo "mood family" (Warm-Wellness → Soft-Productive sim, → Bold-Energetic não)
- **Recomendação preliminar:** A + D híbrido — aviso + bloquear mudanças radicais por compatibility matrix expandida
- **Bloqueia:** UX longevidade tenant
- **Bloqueado por:** Fase 5+ runtime
- **Onde cravar:** rule swap + compatibility matrix
- **Prazo realista:** Fase 5

## D-43 — Semantic Color Roles: taxonomy universal (CRÍTICA — pattern Material 3 / Polaris / Carbon)

- **Status:** hipótese forte — pattern indústria canônico
- **Contexto:** cada marca tem categorias semânticas próprias ("Card Tints", "Surface Ladder", "Brand Spectrum", "Member Benefit Cards"). Componentes precisam funcionar SEM saber qual archetype está ativo. Solução: roles universais que cada archetype implementa à sua maneira.
- **Mecânica:**
  ```css
  /* Layer 1.5 — Semantic Roles (componentes USAM SEMPRE estes) */
  --role-page-canvas              /* fundo página */
  --role-surface-container        /* container default */
  --role-surface-elevated         /* container destacado */
  --role-feature-card-bg          /* fundo feature card (Notion: tint; Linear: surface-2) */
  --role-member-card-bg           /* fundo member benefit card */
  --role-category-marker          /* marcador categoria */
  --role-text-emphasis            /* texto enfático */
  --role-text-body                /* corpo texto */
  --role-text-muted               /* texto secundário */
  --role-text-disabled            /* texto disabled */
  --role-text-inverted            /* texto em surface dark */
  --role-accent-primary           /* CTA principal */
  --role-accent-secondary         /* CTA secundário */
  --role-accent-subtle            /* tinted background derivado de accent */
  --role-border-default           /* border padrão */
  --role-border-strong            /* border emphasis */
  --role-border-focus             /* border focus ring */
  --role-semantic-success         /* feedback positivo */
  --role-semantic-warning         /* aviso */
  --role-semantic-danger          /* destrutivo */
  --role-semantic-info            /* informacional */
  --role-shadow-card              /* shadow card padrão */
  --role-shadow-modal             /* shadow modal */
  --role-shadow-tooltip           /* shadow tooltip */
  /* ~25 roles total core */
  ```
- **Per archetype (cada um implementa TODOS os roles):**

  ```css
  :root[data-template='editorial-notion'] {
    --role-feature-card-bg: var(--tint-peach); /* Notion native */
    --role-member-card-bg: var(--tint-mint);
    --role-text-emphasis: var(--ink-deep);
    /* ... ~25 roles */
  }

  :root[data-template='minimal-linear'] {
    --role-feature-card-bg: var(--surface-2); /* Linear native */
    --role-member-card-bg: var(--surface-3);
    --role-text-emphasis: var(--text-primary);
    /* ... ~25 roles */
  }
  ```

- **Opções:**
  - A) ~25 roles universais cobrindo 80% dos casos (recomendada)
  - B) ~40-50 roles mais granulares (mais coverage mas exige mais de cada archetype)
  - C) Menos roles ~15 (cobertura insuficiente, blocks precisam muitos overrides)
- **Recomendação preliminar:** A ~25 roles. Adicionar JIT quando block novo pedir role inexistente.
- **Fallback strategy:** quando archetype não tem mapping óbvio (Linear não tem "pastel"), 3 opções:
  1. Compatibility matrix bloqueia o block (`<FeatureCard tint>` não funciona em Linear)
  2. Fallback gracioso (Linear cria pseudo-tint via OKLCH adjusting lightness do surface)
  3. Block aceita variant per archetype (`<FeatureCard variant="archetype-default">`)
- **Pattern de referência:**
  - Material 3 "Color Roles" (`primary`, `on-primary`, `primary-container`, `on-primary-container`, ~30 roles)
  - Polaris semantic tokens (`--p-color-bg-surface-tertiary`, `--p-color-text-emphasis`, ~50 roles)
  - Carbon semantic tokens (`$ui-01`, `$text-01`, `$ui-02`, ~40 roles)
  - Radix Colors 12-step scale com use case per step
- **Componentes referenciam roles, NUNCA raw tokens diretamente:**

  ```tsx
  // ✅ CORRETO
  <Card style={{ background: 'var(--role-feature-card-bg)' }} />

  // ❌ ERRADO
  <Card style={{ background: 'var(--accent-tint-peach)' }} />
  ```

- **TypeScript safety:**

  ```ts
  type Role =
    | 'page-canvas'
    | 'surface-container'
    | 'surface-elevated'
    | 'feature-card-bg'
    | 'member-card-bg'
    | 'category-marker'
    | 'text-emphasis'
    | 'text-body'
    | 'text-muted'
    | 'text-disabled'
    | 'text-inverted'
    | 'accent-primary'
    | 'accent-secondary'
    | 'accent-subtle'
    | 'border-default'
    | 'border-strong'
    | 'border-focus'
    | 'semantic-success'
    | 'semantic-warning'
    | 'semantic-danger'
    | 'semantic-info'
    | 'shadow-card'
    | 'shadow-modal'
    | 'shadow-tooltip'

  function getRoleVar(role: Role): string {
    return `var(--role-${role})`
  }
  ```

- **Bloqueia:** TODA implementação de archetype + design de blocks + components/ui audit + ESLint rule pra forçar roles
- **Bloqueado por:** decisão D-02 (quantos archetypes) — quantos roles dependem do range de archetypes
- **Onde cravar:** ADR-NN raiz (consolida D-21 + D-22 + D-33 + D-43) + `lib/design/roles.ts` (TypeScript) + `app/globals.css` (CSS vars)
- **Prazo realista:** Fase 0-1 transformation plan (BLOCKER — sem isso, nada compila)

---

## Decisões resolvidas

(Mover entries pra `12-decisions-resolved.md` quando primeira fechar)

| ID                | Decisão | Onde foi cravado | Quando |
| ----------------- | ------- | ---------------- | ------ |
| _(nenhuma ainda)_ | _-_     | _-_              | _-_    |

---

## Decisões refutadas (hipóteses caídas)

| ID original    | Hipótese refutada        | Refutada por         | Quando     |
| -------------- | ------------------------ | -------------------- | ---------- |
| _(hipotética)_ | Density como 4ª dimensão | Pesquisa 27 empírica | 2026-05-19 |

---

## Dependências entre decisões (grafo)

```
D-01 (3 dim) ──┬─→ D-04 (density absorvida)
               ├─→ D-05 (naming tokens)
               └─→ D-18 (containers)

D-02 (quantos arquétipos) ──┬─→ D-03 (quais DESIGN.md)
                            └─→ D-13 (mobile redesign)

Pesquisa 28 ──┬─→ D-06 (shadcn % real)
              ├─→ D-07 (libs friendly)
              ├─→ D-13 (mobile redesign)
              └─→ D-19 (forkar ou registry)

Pesquisa 29 ──┬─→ D-08 (photos camada)
              ├─→ D-09 (AI vibe Fase 1?)
              └─→ D-10 (AI gen quota)

Pesquisa 30 ──┬─→ D-11 (manifest iOS)
              └─→ D-12 (template swap pós-install)

Kholmatova leitura ──┬─→ D-14 (atomic vocab)
                     └─→ D-15 (renomear template)

Legal check ──→ D-16 (clone-first OK)
```

---

## Pendências meta

- [ ] Criar `12-decisions-resolved.md` quando primeira decisão fechar
- [ ] Definir cadência de revisão (semanal? por sprint?)
- [ ] Decidir quem aprova mudanças (user + Claude pair, ou só user?)
- [ ] Documentar workflow de "promoção" (hipótese → decisão → ADR/blueprint/rule)

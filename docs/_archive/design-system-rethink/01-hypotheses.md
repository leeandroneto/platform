# 01. Hipóteses ativas (todas NÃO-CRAVADAS)

> Status: especulação fundamentada por pesquisas 26+27 + diálogo iterativo sessão 2026-05-19
> Última atualização: 2026-05-19
> Bloqueado por: pesquisas 28-31 pendentes + leitura Kholmatova + prototype 1 arquétipo

---

## Convenção dos cards de hipótese

Cada hipótese segue formato:

- **Status:** hipótese ativa | hipótese refutada | hipótese suspended (aguarda pesquisa)
- **Source:** quem propôs (pesquisa NN / sessão / user reframe)
- **Evidence pró:** o que sustenta
- **Objections:** o que enfraquece
- **What would confirm:** sinal de que vira decisão
- **What would refute:** sinal de que cai
- **Bloqueador:** dependência explícita

---

## H1 — Modelo composicional: Template × Palette × Content (3 dimensões)

- **Status:** hipótese ativa (forte)
- **Source:** sessão 2026-05-19 (user reframe density-como-property)
- **Evidence pró:**
  - Pesquisa 27 empírica: cada arquétipo top tem density fixada (Linear = compact, Warm-Wellness = spacious, Bold-Energetic = comfortable)
  - shadcn 2026 (Mira/Luma/Sera) trata cada style como bundle (geometry + tipo + spacing) sem density independente
  - Mata o forbidden combo "Warm-Wellness + compact" via design (não via Zod refinement)
- **Objections:**
  - Stripe (Soft-Productive) suporta density via component size (`button-sm/md/lg`). Mas isso é component-level, não system-level
  - Carbon/Material têm "tonal density" como toggle global — pode contradizer
- **What would confirm:** ler IBM Carbon + Atlassian + Polaris e confirmar que density é parte do bundle, não eixo
- **What would refute:** Carbon/Atlassian declararem density como toggle global ortogonal
- **Bloqueador:** leitura recursos externos (`10-research-queue.md`)

---

## H2 — Clone-first strategy: copiar DESIGN.md em vez de sintetizar

- **Status:** hipótese ativa (forte)
- **Source:** sessão 2026-05-19 (user "vale a pena copiar e colar os que mais combinam")
- **Evidence pró:**
  - Pesquisa 27 mostrou que extrair-e-sintetizar perde nuance (Vercel 5 stacked shadows tem valores exatos que pesquisa simplificada perderia)
  - Marcas premium têm "vibe" composta de dezenas de decisões interlinkadas — sintetizar quebra
  - Webflow Cloneable + Framer templates fazem isso explicitamente e mercado aceita
  - Reduz drasticamente trabalho de design original
  - **designsystems.com (Figma) — "Six myths" Ana Boyer (2026-05-19):** _"You don't have to build your design system from scratch. There's no shame in standing on the shoulders of giants."_ → **validação direta de H2 por publicação canônica da Figma**
- **Objections:**
  - Clonar verbatim significa "imitar a estética" de Sanity/Vercel/Nike — risco de plagiarismo visual
  - Perda de identidade própria desafit (oferecer "Sanity-vibe" pode ser percebido como derivativo)
  - Legal: clonar tokens estruturais (radius=14px, spacing=4px) é fine. Cor literal + tipografia exata pode virar issue
- **What would confirm:**
  - Pesquisa rápida sobre precedentes legais (Tailwind UI Templates, Framer templates pagos)
  - User confirma que está OK com vibe "derivativo premium"
- **What would refute:** legal advisor ou benchmark de mercado mostrar issue
- **Bloqueador:** decisão estratégica do user + check legal

---

## H3 — Quantos arquétipos: 5? 15-20?

- **Status:** hipótese ativa (em discussão)
- **Source:** pesquisa 26 disse 5+2 opcionais; user sugeriu 15-20
- **Evidence pra 5-7 (pesquisa 26):**
  - shadcn presets (Mira/Luma/Sera) — 3-5 styles é sweet spot da comunidade
  - Pesquisa 26 caveat: "+8 vira paralisia de escolha"
  - Curadoria forte = qualidade superior
- **Evidence pra 15-20 (user):**
  - Clone-first é barato — DESIGN.md já existe pronto
  - Mais opções = mais matches por tenant
  - Profissional pode encontrar vibe exata sem precisar adaptar
- **Objections aos 15-20:**
  - Matriz compatibility palette × template explode (15 × 13 = 195 combos a validar)
  - UX seleção fica pesada pro profissional
  - Manutenção de N templates não-mais-curados degrada
  - Templates raramente-usados acumulam debt
- **What would confirm um lado:** UX research com profissionais reais vendo as opções
- **Compromise candidato:** **5-8 arquétipos "headline" curados** (defaults) + **biblioteca extra de 10-12 templates "raw"** pra advanced users que querem editar a mão
- **Bloqueador:** pesquisa 28 (component catalog) + decisão UX

---

## H4 — Arquitetura shadcn em 3 camadas

- **Status:** hipótese ativa (técnica)
- **Source:** análise sessão 2026-05-19
- **Evidence pró:**
  - **Camada 1 (tokens CSS vars @theme Tailwind v4):** carrega cores, radius base, fontes, spacing — confirmado
  - **Camada 2 (47 primitives quarentenados):** carregam via variant props + className — confirmado shadcn 2026
  - **Camada 3 (wrappers `components/app-*` + primitives novas):** carregam quirks archetype-specific
- **Estimativa cobertura:** 60% Camada 1 + 30% Camada 2 + 10% Camada 3
- **Objections:**
  - Percentuais são chute. Pode ser 40/40/20 ou 70/20/10
  - Só sabemos depois de tentar com 1 arquétipo end-to-end
  - Motion + sombras complexas + asymmetric padding podem cair tudo na Camada 3
- **What would confirm:** prototype com Editorial-Serif inteiro renderizando via os 3 níveis
- **What would refute:** descobrir que precisamos forkar shadcn primitives (sair da quarentena ADR-0040)
- **Bloqueador:** prototype 1 arquétipo

---

## H5 — Runtime composicional via data-attrs

- **Status:** hipótese técnica (forte)
- **Source:** pesquisa 26 propôs `:root[data-template][data-palette]`
- **Evidence pró:**
  - Stripe Elements faz exatamente isso (theme + variables + rules)
  - Sanity Studio faz com `cssVars`
  - Tailwind v4 `@theme` suporta nativo
  - Cascata clara: `:root[data-template="X"]` → `[data-palette="Y"]` → component
- **Objections:**
  - Specificity CSS pode duplicar (data-attr seletor double a especificidade)
  - Next 16 Cache Components dynamic-by-default — tenant-scoped attr no `<html>` pode forçar `"use cache" + cacheTag(tenantId)`
  - Tailwind utility classes podem ganhar de CSS vars em ordem de cascade — testar
- **What would confirm:** prototype simples com 2 templates × 3 palettes rodando
- **What would refute:** descobrir cache invalidation issue por tenant attr no `<html>`
- **Bloqueador:** prototype + leitura sobre Cache Components quando data-attrs mudam por tenant

---

## H6 — PWA manifest dinâmico per tenant

- **Status:** hipótese técnica (aguarda pesquisa)
- **Source:** intuição arquitetural
- **Evidence pró:**
  - Vercel suporta manifest dinâmico via API routes
  - Serwist permite tenant-scoped cache
  - Pattern conhecido (manifesto por subdomínio)
- **Objections:**
  - Install prompt iOS pode bloquear mudança de manifest depois de instalado
  - Tenant trocar template depois de profissional ter instalado PWA = quebra ícone na home screen
  - Apple/Google policy contra manifest dinâmico pode existir
  - apple-touch-startup-image matrix é undocumented pós-iOS 16 (pesquisa 26 caveat #5)
- **What would confirm:** pesquisa 30 dedicada (PWA tenant theming)
- **What would refute:** Apple/Google policy contra ou device-DB ausente
- **Bloqueador:** pesquisa 30

---

## H7 — Photos é camada própria (não dentro de tokens)

- **Status:** hipótese ativa
- **Source:** sessão 2026-05-19 (user "também precisamos pensar na camada de fotos")
- **Evidence pró:**
  - Photography philosophy varia drasticamente por arquétipo:
    - Editorial-Serif: framed (rule of thirds)
    - Bold-Energetic: full-bleed
    - Warm-Wellness: soft-focus
    - Minimal-Mono: no-photo OR product screenshots
    - Soft-Productive: composite-mockup
  - Decisão estética separada de tokens estruturais
  - Multi-tenant: cada tenant sobe próprias fotos → camada própria gerencia upload + crop + AI gen
- **Objections:**
  - Photos podem ser propriedade do template (aspect ratios + crop strategy + philosophy) — não precisaria camada separada
  - Complexidade adicional
- **What would confirm:** identificar que tenants precisam **mudar photos sem mudar template** — comum em e-commerce
- **What would refute:** descobrir que photos vão **sempre acopladas** ao template — então é só sub-prop
- **Bloqueador:** pesquisa 29 (photography system)

---

## H8 — Hierarquia de busca antes de criar (Kholmatova-aligned)

- **Status:** hipótese de processo (forte)
- **Source:** sessão 2026-05-19 (user "blocos prontos primeiros do shadcn, primitivos, libs shadcn friendly, criar do zero apenas se necessário")
- **Ordem proposta:**
  1. **shadcn blocks** (composições prontas: dashboard, auth, sidebar, marketing pages) — buscar primeiro
  2. **shadcn primitives** (button, input, dialog — 47 já quarentenados)
  3. **shadcn-friendly libs:** Origin UI, Aceternity, Magic UI, Kibo UI, Reui, Tweakcn, etc
  4. **Headless UI agnostic:** Radix UI, React Aria, Base UI, Ariakit
  5. **Build from scratch** — apenas se nada acima cobrir
- **Evidence pró:**
  - ADR-0037 (wrapper-pattern-hierarchy-registries) já documenta isso parcialmente
  - Reduz trabalho original em 80-90%
  - Comunidade-tested = a11y + edge cases cobertos
- **Objections:**
  - Mais opções = mais cognitive load
  - Risco frankenstein se misturar 4-5 libs num único projeto
  - Cada lib tem opinions próprias (Origin UI dark-first, Aceternity motion-heavy)
- **What would confirm:** mapear cada componente desejado contra essa hierarquia (`07-shadcn-hierarchy.md`) — sem buracos
- **What would refute:** descobrir que componentes premium caem **sempre** em "build from scratch" — hierarquia inútil
- **Bloqueador:** mapping componente×lib em `07-shadcn-hierarchy.md`

---

## H9 — Vocabulário Kholmatova: atoms/molecules/organisms + functional/perceptual

- **Status:** hipótese de vocabulário (aguarda leitura)
- **Source:** user "a questão do livro de organizar tokens por atoms etc acho muito interessante"
- **Evidence pró:**
  - Brad Frost Atomic Design + Kholmatova "Design Systems" são canônicos
  - shadcn segue parcialmente (primitives = atoms, blocks = molecules/organisms)
  - Vocabulário compartilhado com comunidade design systems = menos atrito
- **Objections:**
  - Atomic design tem críticas: não escala em apps complexos, abstração teórica
  - Pode entrar em conflito com clone-first se clones não se decompõem bem em atoms/molecules
- **What would confirm:**
  - Mapear nossos tokens em atoms/molecules/organisms sem perda — bate clean
  - Mapping bate com como Carbon/Polaris organizam (eles seguem variação de atomic)
- **What would refute:** mapping deixa metade dos tokens "outras coisas" — atomic é insuficiente
- **Compromise candidato:** atomic como vocabulário comunicativo + clone-first como estratégia material
- **Bloqueador:** leitura Kholmatova + revisão da própria taxonomia de tokens

---

## Anti-hipóteses (o que NÃO estamos assumindo)

| Anti-hipótese                          | Por quê                                                               |
| -------------------------------------- | --------------------------------------------------------------------- |
| Density NÃO é 4ª dimensão              | Refutada empiricamente pela pesquisa 27                               |
| Atomic Design NÃO é dogma rígido       | Vocab útil, não receita                                               |
| Clone-first NÃO significa frankenstein | Nunca misturar arquétipos numa mesma surface                          |
| Shadcn NÃO suporta 100%                | Estimativa 60% — resto é wrapper/novo                                 |
| "Cravado" NÃO existe ainda             | Tudo nesta pasta é hipótese — sair daqui = decisão cravada            |
| 13 paletas atuais NÃO viram lixo       | Continuam como dimensão color overlay (palette layer)                 |
| 47 shadcn primitives NÃO viram lixo    | Continuam quarentenados — ganham variant resolution per data-template |
| Photos NÃO são gratis                  | AI generation custa $0.003-0.075/img — quota por tier                 |
| Mobile NÃO é desktop reduzido          | Hipótese: arquétipos podem demandar redesign mobile-first             |

---

## Hipóteses promovidas (movidas pra fora desta pasta)

Quando virar decisão cravada (per critério em `README.md`), entry vai aqui apontando pro destino:

| Hipótese          | Promovida pra                | Quando |
| ----------------- | ---------------------------- | ------ |
| _(nenhuma ainda)_ | _ADR/blueprint/rule destino_ | _data_ |

---

## Hipóteses refutadas

Quando uma hipótese cai (não sobrevive objections):

| Hipótese                               | Refutada por                                     | Quando     |
| -------------------------------------- | ------------------------------------------------ | ---------- |
| **Density como 4ª dimensão ortogonal** | Pesquisa 27 empírica (5 arquétipos density-fixa) | 2026-05-19 |

# 09. Vocabulário Kholmatova + Atomic Design + Stack-aware

> Status: hipótese de vocabulário a adotar (H9)
> Última atualização: 2026-05-19
> Bloqueado por: leitura efetiva do livro "Design Systems" (Alla Kholmatova) + audit de como Carbon/Atlassian/Polaris organizam

---

## Por que esse arquivo existe

Vocabulário compartilhado com a comunidade de design systems = menos atrito + onboarding mais rápido + Claude futuro alinhado com literatura canônica.

Sem vocab consistente, cada conversa reinventa termos (já aconteceu nesta sessão: "template", "vibe", "archetype" — todos vagamente o mesmo).

---

## 3 fontes canônicas

| Fonte                         | Autor             | Cobertura                                                       |
| ----------------------------- | ----------------- | --------------------------------------------------------------- |
| **Design Systems**            | Alla Kholmatova   | Functional vs perceptual patterns, purposeful patterns, modules |
| **Atomic Design**             | Brad Frost        | Atoms / molecules / organisms / templates / pages               |
| **Stack-aware (shadcn 2026)** | Comunidade Vercel | Primitives, blocks, registries, variants, slots                 |

---

## Kholmatova — conceitos principais (com quotes verbatim)

> Atualizado 2026-05-19 com leitura efetiva (resumos curados via WebFetch — livro não tem PDF público).
> Base research: AirBnB, Atlassian, Eurostar, TED, Sipgate (18 meses pesquisa).

### Definição-mãe do design system (verbatim)

> **"A design system is a set of connected patterns and shared practices, coherently organized to serve the purposes of a digital product."** — Kholmatova

3 palavras-chave:

- **connected** (não isolados) — patterns referenciam uns aos outros
- **shared practices** (não só código) — workflow + governance
- **coherently organized** (não inventário) — princípios alinham decisões

### 1. Functional vs Perceptual patterns (definições verbatim)

> **"Functional patterns are concrete modules of the interface, such as a button, a header, a form element, a menu."** — Kholmatova

> **"Perceptual patterns are descriptive styles that express and communicate the personality of the product visually, such as color and typography, iconography, shapes and animations."** — Kholmatova

| Tipo           | Exemplos                                           | Composição                                                           |
| -------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| **Functional** | Button, header, form, menu, card, nav              | **Livre.** Profissional pode combinar 10 cards na mesma surface      |
| **Perceptual** | Color, typography, iconography, shapes, animations | **LOCKADA.** Vem do archetype ativo. Tenant não escolhe atomicamente |

→ Bate exato com decisão "Archetype × Palette × Content" do desafit.

→ **Insight Kholmatova:** funcional = "what a pattern _does_" (action verbs); perceptual = "what a pattern _feels_". Descrever pattern via verbo de ação amplia uso (broaden potential use cases).

### 2. Purposeful vs Promiscuous patterns

- **Purposeful** = padrão com propósito claro + uso documentado + variants justificados
- **Promiscuous** = padrão criado ad-hoc, sem propósito, replicado por copy-paste

Kholmatova: design systems falham quando promiscuous patterns proliferam.

→ Aplicação desafit: **toda variant de componente exige justificativa**. Variant sem propósito = padrão promiscuo = remover.

### 3. Module of expression vs Module of action

- **Module of expression** = perceptual (transmite mood, identidade)
- **Module of action** = functional (resolve task)

→ Equivale à camada **Perceptual** vs **Functional** do item 1.

### 4. Shared language

> Design system é primariamente um **vocabulário compartilhado** entre design + dev + product.

Sem vocab, time discute "esse botão" vs "aquele componente roxo" — perde tempo + bugs aumentam.

→ Aplicação desafit: glossário compartilhado obrigatório em `naming.md`.

### 5. Pattern library, rules, principles

3 níveis de design system:

- **Principles** = filosofia (e.g. "premium feeling", "mobile-first", "white-label")
- **Rules** = guidelines aplicáveis (e.g. "touch target ≥ 44px", "section padding desktop 64-96px")
- **Pattern library** = componentes implementados (= `components/ui/` + `components/app-*`)

→ Aplicação desafit:

- Principles → `docs/design-system/00-state.md` + `docs/blueprint/00-PROJETO.md`
- Rules → `.claude/rules/*.md`
- Pattern library → `components/`

---

## 4-level hierarchy canônica (designsystems.com / Atlassian / Carbon / Polaris)

A hierarquia universal de design systems modernos é:

```
Foundations  →  Components  →  Patterns  →  Templates  →  Pages
   ↓               ↓             ↓            ↓
docs:          docs:          docs:        docs:
03-tokens-     04-components- 12-patterns- 13-templates-
universe.md    questions.md   catalog.md   layouts.md
```

| Nível           | O que é                                                                           | Exemplo                                    | Local desafit                                               |
| --------------- | --------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| **Foundations** | Tokens base: colours, typography, spacing, grid, variables, iconography, surfaces | `--radius-md: 8px`, `--color-primary`      | `app/globals.css @theme` + `lib/design/*`                   |
| **Components**  | Unidades de UI reutilizáveis (= atoms + molecules Atomic)                         | `<Button>`, `<Input>`, `<Card>`            | `components/ui/*` + `components/app-*`                      |
| **Patterns**    | Composições reutilizáveis (= organisms Atomic) — sequência + states + UX          | Login Flow, Dashboard Layout, Error States | `features/<feature>/components/*` + `components/patterns/*` |
| **Templates**   | Page layouts esqueletos                                                           | MarketingLayout, DashboardLayout           | `app/**/layout.tsx` + `components/layouts/*`                |
| **Pages**       | Template + content específico (não é nível canônico do DS)                        | `/sobre`, `/pricing`                       | `app/**/page.tsx`                                           |

**Importante:** "Template" canônico = page layout (Atomic). Nosso "template" perceptual = **archetype** (D-15 em `11-decisions-pending.md` resolve colisão).

---

## Atomic Design (Brad Frost) — vocabulário hierárquico

> **Atualizado 2026-05-19 com pesquisa real:** atomicdesign.bradfrost.com capítulo 2 + WebSearch críticas 2024-2025.
> **Importante:** Kholmatova e Frost são **frameworks distintos**. Kholmatova **critica** Atomic Design como rígido demais. Veja seção "Kholmatova vs Frost" abaixo.

### Definições verbatim (Frost, atomicdesign.bradfrost.com cap.2)

#### Atoms (átomos)

> **"The atoms of our interfaces serve as the foundational building blocks that comprise all our user interfaces."**

Características:

- Não podem ser decompostos sem perder funcionalidade
- HTML basics: form labels, inputs, buttons
- Não existem em isolamento

→ Equivale aos **47 shadcn primitives quarentenados** em `components/ui/*`.

#### Molecules (moléculas)

> **"Molecules are relatively simple groups of UI elements functioning together as a unit."**

Exemplo Frost: search form (label + input + button).

→ Equivale aos **wrappers** em `components/app-*.tsx`.

#### Organisms (organismos)

> **"Organisms are relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms. These organisms form distinct sections of an interface."**

Exemplos Frost: website headers (logo + nav + search), product grids.

→ Equivale a `features/<feature>/components/*` + `components/patterns/*`.

#### Templates (page-level layouts — NÃO confundir com nosso "archetype")

> **"Templates are page-level objects that place components into a layout and articulate the design's underlying content structure."**

Função crítica: **"Focus on the page's underlying content structure rather than the page's final content."**

→ Equivale a `app/(public)/layouts/*` + `app/(admin)/layouts/*` + `components/layouts/*` (catalogado em `13-templates-layouts.md`).

#### Pages

> **"Pages are specific instances of templates that show what a UI looks like with real representative content in place."**

Função: testar a eficácia do design system com conteúdo real.

→ Equivale a `app/**/page.tsx`.

### Princípios importantes (NÃO-óbvios) — Frost cap.2

1. **NÃO é processo linear:** _"Atomic design is not a linear process, but rather a mental model to help us think of our user interfaces as both a cohesive whole and a collection of parts at the same time."_
2. **Naming é flexível:** GE design team renomeou pra `Principles / Basics / Components / Templates / Features / Applications`. Frost: _"Atomic design is not rigid dogma."_
3. **Technology agnostic:** _"Atomic design has nothing to do with web-specific subjects like CSS or JavaScript architecture."_
4. **Content + Design entrelaçados** (Mark Boulton via Frost): _"It's not 'content then design', or 'content or design'. It's 'content and design'."_

### Críticas 2024-2025 (consenso da comunidade)

| Crítica                             | Detalhe                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| **Inflexível**                      | 5-level estrutura é restritiva pra components context-dependent ou multifunctional |
| **Boundaries fuzzy**                | Difícil decidir "isso é molecule ou organism?" — categorias ambíguas               |
| **Outdated (2013)**                 | UI 2026 é muito mais complexa que UI 2013                                          |
| **Poor fit pra dynamic components** | Foi feito pra componentes estáticos. Adaptive/responsive moderno não cabe          |
| **Conflita com AI workflows**       | AI generation top-down (62% teams em 2024) vs Atomic bottom-up                     |
| **Não-prático as-is**               | Framework conceitual, mas implementation gap grande pra produtos reais             |

**Brad Frost mesmo em 2024 (SmashingConf NY):** se fosse revisar, teria falado **muito mais sobre design tokens** — algo que mal existia em 2013.

### O que Atomic Design vale PRA DESAFIT em 2026

✅ **Usar como:**

- Vocabulário compartilhado entre design+dev (atoms/molecules/etc é jargão da indústria)
- Mental model pra discussão ("isso é molecule porque...")
- Princípios fundamentais: modularidade, clareza, escalabilidade

❌ **NÃO usar como:**

- Folder structure rígido (`components/atoms/`, `components/molecules/`)
- Decision tree pra criar componente (frustra)
- Substituto pra design tokens (que Frost reconhece ser fundamental hoje)
- Receita pra organizar systems multi-platform (Spotify Encore mostra que platforms > atomic levels)

→ **Decisão refinada D-14 em `11-decisions-pending.md`:** vocab compartilhado + princípios. **Sem** folder structure rígido. **Sem** dogma.

---

## Kholmatova vs Frost — qual framework adotar?

### Conflito real

| Aspecto         | Atomic Design (Frost, 2013)                    | Kholmatova (Design Systems, 2017)              |
| --------------- | ---------------------------------------------- | ---------------------------------------------- |
| **Foco**        | Estrutura visual decomposta                    | Propósito + expressão                          |
| **Hierarquia**  | Rígida 5 níveis bottom-up                      | Não-hierárquica, tipos de pattern              |
| **Vocabulário** | Atoms/molecules/organisms/templates/pages      | Functional/perceptual + purposeful/promiscuous |
| **Aplicação**   | Web/sites estáticos                            | Produtos complexos                             |
| **Workflow**    | Bottom-up (atoms → pages)                      | Top-down (purpose → patterns)                  |
| **Status 2026** | Crítica intensa, Frost mesmo reconhece limites | Mais aceito como framework moderno             |

### Kholmatova critica Atomic Design explicitamente

(do livro dela + reviews) — Atomic Design é útil mas **rígido demais pra capturar a essência** de design systems modernos. Functional vs perceptual é mais útil porque captura **comportamento + identidade** em vez de só decomposição estrutural.

### Decisão pra desafit

**Lean Kholmatova (functional/perceptual) como organização principal.** Atomic Design como vocabulário compartilhado quando útil. Não como dogma.

Mapping prático:

| Conceito Kholmatova | Conceito Frost equivalente                 | Local desafit                                                        |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------- |
| Functional patterns | Atoms + Molecules + Organisms              | `components/ui/*` + `components/app-*` + `features/<f>/components/*` |
| Perceptual patterns | (Frost não tem equivalente claro — tokens) | `lib/design/*` + `app/styles/templates/*` + `lib/design/palettes/*`  |
| Patterns library    | Pattern library + templates + pages        | Tudo acima + `app/**/layout.tsx` + `app/**/page.tsx`                 |
| Design principles   | Princípios (Frost reconhece como "topo")   | `docs/blueprint/00-PROJETO.md` + `00-state.md`                       |
| Shared language     | Vocabulary (Frost reconhece)               | `naming.md` + `09-kholmatova-vocab.md`                               |

---

## Conflito: "Template" Kholmatova vs "Template" desafit

**Atenção:** o termo **template** colide!

- **Atomic Design "template"** = page layout (DashboardLayout) — vazio de content
- **Desafit "template"** = bundle de tokens estruturais (Editorial-Serif, Minimal-Mono) — perceptual

→ **Decisão de vocab:** renomear nosso "template" pra...

| Candidato         | Pros                                        | Cons                              |
| ----------------- | ------------------------------------------- | --------------------------------- |
| **archetype**     | Já usado nas pesquisas. Sem conflito.       | Termo abstrato                    |
| **style preset**  | Bate com shadcn (Mira/Luma/Sera = "styles") | Genérico, "style" é palavra fraca |
| **theme**         | Familiar a designers                        | Conflita com dark/light mode      |
| **vibe**          | User usou — bate com mood                   | Coloquial, pouco técnico          |
| **design preset** | Específico                                  | Verboso                           |
| **brand-style**   | Hibrido                                     | Hifenizado, awkward               |

**Recomendado: `archetype`** — termo técnico, sem colisão, já em uso nas pesquisas 26+27.

Glossário desafit:

| Termo desafit      | Definição                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **archetype**      | Bundle de tokens estruturais perceptual (tipo, spacing, shape, motion, shadow, photography, density) |
| **palette**        | Set de cores aplicáveis sobre um archetype                                                           |
| **content**        | Texto + imagens do tenant                                                                            |
| **template** (App) | Page layout esquelético (Atomic Design) — Hero + Features + Footer skeleton                          |
| **theme**          | Combo light vs dark (dark mode toggle) — NÃO usar pra archetype                                      |
| **style**          | Variant prop em componente (`size="lg"`, `variant="primary"`) — NÃO usar pra archetype               |

---

## Mapping desafit × Atomic Design × Kholmatova

| Camada Atomic       | Local desafit                          | Tipo Kholmatova                                 |
| ------------------- | -------------------------------------- | ----------------------------------------------- |
| Atoms               | `components/ui/*` (47 shadcn)          | Functional (composição livre)                   |
| Molecules           | `components/app-*.tsx`                 | Functional + variant resolution archetype-aware |
| Organisms           | `features/<feature>/components/*`      | Functional composta                             |
| Templates (Atomic)  | `app/**/layouts/*`                     | Functional + perceptual locked                  |
| Pages               | `app/**/page.tsx`                      | Functional + perceptual + content tenant        |
| **Perceptual base** | `app/styles/templates/<archetype>.css` | **Perceptual locked**                           |
| **Palette base**    | `lib/design/palettes/<palette>.ts`     | **Perceptual locked**                           |

---

## Stack-aware vocab (shadcn 2026 + Tailwind v4)

| Termo shadcn   | Significado                                                         |
| -------------- | ------------------------------------------------------------------- |
| **primitive**  | Componente base unstyled (= atom Atomic Design)                     |
| **block**      | Composição pronta (= molecule/organism)                             |
| **registry**   | Source de componentes (shadcn / Origin UI / Aceternity / etc)       |
| **variant**    | Configuração visual (size, color, state)                            |
| **slot**       | Área de injeção em composição (CardHeader, CardContent, CardFooter) |
| **style**      | Bundle visual de shadcn (Mira/Luma/Sera/new-york/default)           |
| **base style** | Estilo base shadcn ativo em `components.json` ("new-york" atual)    |
| **cssVars**    | CSS variables em `globals.css` resolvidas runtime                   |

---

## Glossário consolidado desafit

```
ARCHETYPE       Bundle de tokens estruturais perceptual (Editorial-Serif, Minimal-Mono, etc)
PALETTE         Set de cores OKLCH aplicáveis sobre archetype (13 atuais)
CONTENT         Texto + imagens do tenant
TEMPLATE        Page layout esquelético (Atomic Design — DashboardLayout, etc)
SURFACE         Background tones (canvas, card, overlay, elevated)
INK             Text colors (primary, secondary, muted, disabled, inverted)
ACCENT          Brand color variants (base, hover, active, focus, subtle, strong)
SEMANTIC        Success/warning/danger/info colors
HAIRLINE        1px border (universal)
ELEVATION       Shadow/surface ladder hierarchy
DENSITY         Compact/comfortable/spacious — ABSORVIDA no archetype (não dimensão separada)
PRIMITIVE       Componente atomic (shadcn ui/*)
WRAPPER         Componente molecule archetype-aware (app-*)
BLOCK           Composição pronta (shadcn block / Origin UI block)
VARIANT         Configuração visual do componente (size, color, state)
SLOT            Área de injeção em composição
SCOPE           Flag tenant/internal/platform (RLS — não confundir com archetype)
THEME           Dark vs light mode toggle (não usar pra archetype)
STYLE           Variant prop em componente (não usar pra archetype)
```

---

## Técnicas Kholmatova (do livro) — práticas para sistematizar

### 1. Pattern map

Mapear core modules da interface contra **seções da user journey**. Output: matriz patterns × steps do user journey. Revela:

- Que patterns são reutilizados em múltiplas etapas (= candidatos a primitives)
- Que patterns são únicos em 1 etapa (= organisms domain-specific)
- Gaps onde nenhum pattern cobre

### 2. Interface inventory

Coletar TODAS as variations de um pattern existente no produto. Output: visual catalog tipo "todos os botões que existem" / "todos os cards". Revela:

- Duplicações sem propósito (= padrões promíscuos a consolidar)
- Variations justificadas (= manter como variants nomeados)

### 3. Pattern as action (action verbs)

Descrever pattern via verbo de ação ("Submit form", "Confirm destructive action"), não substantivo ("Button"). Resultado: broaden potential use cases.

### 4. Sketching pattern content structure

Antes de codar, esboçar o que de **conteúdo** o pattern precisa receber. Cada pattern tem content structure mínima ditada por purpose.

### 5. Placing similar patterns on a scale

Quando 2-3 patterns parecem similares (e.g. "ButtonPrimary" + "ButtonHero" + "ButtonCTA"), placá-los em scale visual. Resultado: ou consolida em 1 com variants, ou justifica diferenças por scale.

### 6. Shared language + glossary

Estabelecer vocabulário consistente entre design files + frontend architecture + content. Manter **glossário compartilhado** que time consulta. Sem isso, design discute "esse botão roxo" enquanto dev fala "primary CTA" — atrito.

### 7. Multidisciplinary approach

Design + content + dev trabalham juntos no design system. **Pattern libraries que servem só design (ou só dev) provam-se frágeis.**

### 8. Gradual evolution

Quando adicionar novo style, testar em **área pequena primeiro** antes de propagar pro sistema todo. Reversível.

→ Estas 8 técnicas vão informar workflow de criação/edição de patterns no painel admin Fase 2.

---

## Insights de designsystems.com (Figma publication)

Site é da Figma. 4 categorias editoriais: Getting Started · Design & Development · Schema by Figma · Operations.

### "Six myths" (Ana Boyer) — validações pra nosso caso

| Mito                                  | Validação pra desafit                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Design systems são só pra big leagues | ❌ — vale pra todos os tamanhos. Nosso solo dev + agência small se aplica                                           |
| Use latest industry techniques        | ❌ — funcionalidade > trends. Nosso "filtro frescura" alinha                                                        |
| Material funciona pra todos           | ❌ — sistema deve refletir brand identity. **Confirma clone-first per archetype, não Material universal**           |
| Construir do zero                     | ❌ — _"There's no shame in standing on the shoulders of giants."_ **Validação direta da estratégia clone-first H2** |
| Design systems matam criatividade     | ❌ — são "launchpad for creativity, not guardrails"                                                                 |
| Designer só faz componente            | ❌ — é strategist, champion, connector entre teams                                                                  |

### Spacing canon (Figma — designsystems.com)

> **"A set of rules for how you measure, size, and space your UI elements."**

- **Base unit recomendado:** 8pt linear scale + 4pt half-steps pra icons/small text
- **Razão técnica:** evitar odd numbers (5pt) que causam split-pixel blur em scaling
- **Nosso caso:** Tailwind v4 default = 4px = compatible. Pode manter 4px scale + dobrar pra equivalente 8pt cada 2 steps

### 3 scaling strategies (mobile vs desktop)

| Strategy       | Quando usar                                           | Bate com archetype                   |
| -------------- | ----------------------------------------------------- | ------------------------------------ |
| **Adaptive**   | Experiences inteiramente diferentes per device        | Bold-Energetic (Nike art-direction)  |
| **Responsive** | Layouts fluidos ajustando-se ao container             | Soft-Productive, Warm-Wellness       |
| **Strict**     | Fixed dimensions pra data-heavy (degrada se flexível) | Minimal-Mono dashboards Linear-style |

### Element-first vs Content-first padding

Decisão arquitetural pra components com padding interno:

- **Element first:** Solid components (button, input) prioritizam sizing predeterminado
- **Content first:** Variable content força strict internal padding, elementos expandem

→ **Decisão futura:** dia 1 fazer **element-first** (mais simples + previsível). Content-first JIT pra rich text / chat / dynamic content.

### Spotify Encore (Juli Sombat) — **modelo direto pro nosso caso multi-platform**

Spotify Encore = 2 subsystems:

- **Encore Consumer Mobile** — mobile-centric
- **Encore Web** — web products

Ambos **compartilham foundational tokens** (color, typography, design tokens) mas têm anatomy/variants próprias.

> _"Middle path between perfect consistency and total platform independence"_

> _"In collaboration with Encore Web, we began developing cross-platform components at the outset, as opposed to an afterthought."_

**Aplicação direta pra desafit:**

- Multi-tenant + multi-archetype + PWA web vs PWA mobile = **mesmo problema 4D Spotify resolve com Encore**
- Recomendação: nascer com 2 subsystems desde dia 1 (não 1 só "responsive") — `lib/design/web` + `lib/design/pwa-mobile` — sharing tokens, diverging onde necessário
- Pesquisa 28 deve cobrir component variants per platform (web vs PWA mobile), não só per archetype
- Cross-platform working methodology: platform audits → component outlines → design tokens propagating with platform customization

**Workflow Encore (pra copiar):**

1. **Platform audits** — cada plataforma documenta unique characteristics (screen real estate, viewing distance, input methods)
2. **Component outlines** — collaborative docs definindo naming + anatomy + variants + a11y
3. **Design tokens variables** — propagam mas allow platform-specific customization

Tools mencionados: **Variables (design tokens) + REST API** generating values across code sources.

→ Forte aliado da nossa estratégia `:root[data-template][data-palette]` + Tailwind v4 `@theme` CSS vars.

### Content strategy (Peter Zogas, Autodesk — designsystems.com)

Princípio macro: **content guidelines moram ao lado dos visuals dos componentes**, não isoladas em style guide separado. _"Ensuring accessibility during implementation."_

**Case usage (decisão estratégica):**

- **Title Case** → strings curtas próximas umas das outras (table headings, buttons)
- **Sentence case** → copy longa (modal headers, placeholders, descriptions)

**Vocabulário consistente:** _"Each time you run across terms that are potentially being used interchangeably, take a stance and get your decision in the glossary."_ → glossário ativo, não passivo. Auditoria + team consensus.

**Empty states:** _"The best way to approach empty states is to make clear how a user can become unblocked."_ — focar em **ação que destrava**, não só ilustração bonita.

**Microcopy decisions per componente:**

- Tooltips: pronoun usage (you/your vs. neutral?)
- Errors: voice injection (formal vs. friendly?)
- Confirmation dialogs: clarity of consequence

→ _"Anything you can do to clarify how to write for both of these will help designers create consistency."_

**Localização:**

- String length expansion (PT-BR +15-20% vs EN — já cravado pesquisa 27)
- Cultural metaphors (proverb traduzido nem sempre funciona)
- Word order changes (ordem natural varia por idioma)
- Responsive text scaling em UI areas constrained
- **Text em ilustrações** = anti-pattern pra localization

**Aplicação desafit:**

- Glossário compartilhado obrigatório em `naming.md` (parcialmente coberto)
- Microcopy archetype-aware:
  - Editorial-Serif: formal, expert, articulate
  - Minimal-Mono: direct, technical, precise
  - Soft-Productive: professional, helpful, clear
  - Bold-Energetic: motivational, urgent, powerful
  - Warm-Wellness: nurturing, gentle, encouraging
- Component docs (Storybook stories) devem incluir **microcopy do/don't** ao lado de visuals
- Pesquisa 31 (voice/writing) deve detalhar isto por archetype

---

## Como aplicar vocab dia a dia

### Em código

```tsx
// ✅ Bom
function AppButton({
  variant,
  size,
}: {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
}) {
  const archetype = useArchetype() // 'editorial-serif' | 'minimal-mono' | ...
  // ...
}

// ❌ Ruim — colisão
function AppButton({ template, style }) {
  // 'template' colide com Atomic, 'style' colide com shadcn
}
```

### Em commits / PRs

- ✅ `feat(archetype): adiciona arquétipo Bold-Energetic`
- ❌ `feat(template): adiciona template Bold-Energetic` — colide

### Em conversas

- ✅ "Esse archetype + palette tem APCA fail"
- ❌ "Esse template + theme não tem contraste" — colide com Atomic + dark mode

### Em rules / blueprints

- Atualizar `naming.md` com glossário acima
- Cravar como rule `.claude/rules/design-system-vocab.md` (futura)

---

## Pendências

- [ ] **Ler livro Design Systems (Kholmatova)** — confirma este resumo + adiciona nuances
- [ ] Auditar uso atual de "template" / "style" / "theme" em código (`grep -r`)
- [ ] Refatorar termos no código se necessário (substituir "template" perceptual → "archetype")
- [ ] Atualizar `.claude/rules/naming.md` com glossário consolidado
- [ ] Documentar mapping Atomic × desafit em rule path-loaded
- [ ] Decidir: criar rule `design-system-vocab.md` separada OU expandir `naming.md`?

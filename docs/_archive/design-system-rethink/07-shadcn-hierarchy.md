# 07. Hierarquia de busca antes de criar (Kholmatova-aligned)

> Status: hipótese H8 ativa + ADR-0037 parcialmente já cobre
> Última atualização: 2026-05-19
> Bloqueado por: mapping componente × hierarquia (depende pesquisa 28)

---

## Princípio

> **Nunca construir do zero antes de varrer 4 camadas anteriores.**

Marcas premium têm componentes complexos. Reinventá-los = bug garantido + tempo perdido. A comunidade open-source de 2026 cobre 80-90% do que precisamos via libs shadcn-compatible.

---

## Hierarquia (ordem de busca obrigatória)

### Camada 1 — shadcn blocks (composições prontas)

**O que tem:** dashboards completos, auth flows, sidebar layouts, marketing pages, calendars, charts.

**Como acessar:**

```bash
# MCP shadcn
mcp__shadcn__list_items_in_registries(registries: ["@shadcn"], types: ["registry:block"])
mcp__shadcn__search_items_in_registries(registries: ["@shadcn"], query: "dashboard")
```

**Quando usar:** quando precisa de composição inteira pronta (ex: "página de login com OAuth + form").

**Limitação:** blocks são opinionados — visual matches shadcn default style. Pra customizar archetype-specific, ler block + adaptar.

### Camada 2 — shadcn primitives (47 já quarentenados)

**O que tem:**

- Layout: Card, Sheet, Drawer, Dialog, Popover, Tooltip
- Forms: Input, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, Slider, Calendar
- Navigation: Tabs, Breadcrumb, Pagination, Sidebar, Menubar, NavigationMenu, ContextMenu
- Feedback: Sonner (toast), Alert, Badge, Progress, Skeleton
- Data: Table, ScrollArea, Accordion
- Misc: Button, Avatar, Separator, AspectRatio, Collapsible, Command (search palette), HoverCard, ResizablePanels, ToggleGroup

**Como acessar:**

```bash
mcp__shadcn__view_items_in_registries(items: ["@shadcn/button"])
```

**Quando usar:** building block pra composição custom. Padrão dia 0.

**Limitação:** primitives não cobrem patterns premium-specific (chatbot launcher, configurator, search orb).

### Camada 3 — Libs shadcn-friendly (registries adicionais)

Pesquisa 27 + ecosystem 2026:

| Lib                 | Forte em                                                               | A11y               | Cost |
| ------------------- | ---------------------------------------------------------------------- | ------------------ | ---- |
| **Origin UI**       | Variações ricas: multi-select, time picker, avatar-stack, color-picker | Radix + React Aria | Free |
| **Kibo UI**         | Padrões SaaS: kbd, announcement-bar, dropzone                          | Shadcn-backed      | Free |
| **Reui**            | **Data-grid TanStack v8** (29 comp), 1003+ totais                      | Boa                | Free |
| **Aceternity**      | Motion-heavy, hero animations, marketing                               | Médio              | Free |
| **Magic UI**        | Animations premium, particle effects, gradient                         | Médio              | Free |
| **Tweakcn**         | Theme builder + custom registry                                        | N/A                | Free |
| **OriginUI Charts** | Recharts shadcn-styled                                                 | Médio              | Free |
| **Plate.js**        | Rich text editor (Slate-based)                                         | Sim                | Free |
| **shadcnblocks**    | Marketing blocks comerciais                                            | Boa                | Paid |

**Como acessar:**

```bash
# Configurar registries adicionais em components.json:
{
  "registries": [
    "@shadcn",
    "https://origin-ui.com/r/{name}.json",
    "https://kibo-ui.com/r/{name}.json",
    "https://magicui.design/r/{name}.json"
  ]
}

# Install:
npx shadcn add @origin-ui/multi-select
```

**Quando usar:** quando shadcn primitive não cobre OU quando precisa variant especializada.

**Cuidado:** misturar 4-5 libs = frankenstein visual. Padrão: **escolher 1-2 libs complementares por archetype**.

### Camada 4 — Headless UI agnóstico

| Lib             | Forte em                                  | Cost |
| --------------- | ----------------------------------------- | ---- |
| **Radix UI**    | Primitive base (shadcn é built on Radix)  | Free |
| **React Aria**  | Adobe — a11y máxima, complex interactions | Free |
| **Base UI**     | MUI sucessor headless                     | Free |
| **Ariakit**     | Sasha Aickin — composable + a11y          | Free |
| **Headless UI** | Tailwind team — simples e clean           | Free |

**Quando usar:** quando shadcn + libs friendly NÃO cobrem OR quando precisa controle absoluto de a11y/interactions.

**Cuidado:** headless = você estiliza do zero. Sem ajuda de design system. Custo de tempo alto.

### Camada 5 — Build from scratch

**Último recurso.**

**Quando justifica:**

- Componente é archetype-specific (Nike `scale(0.5)` press, Tesla `0.33s` motion canon)
- Nenhuma das 4 camadas anteriores tem
- Lógica de negócio única (chatbot launcher com prompt curado)

**Estrutura:**

```
components/
  app-<feature>/
    <component>.tsx          # implementação
    <component>.stories.tsx  # Storybook 10
    <component>.test.tsx     # Vitest
```

**Padrões obrigatórios:**

- Marker `// RESEARCH:` linha 1 explicando por que não cobriu hierarquia
- TypeScript types em `lib/contracts/`
- Use existing tokens (CSS vars, não hardcoded)
- a11y: `role`, `aria-*`, focus management

---

## Mapping componente × hierarquia (template — preencher após pesquisa 28)

Estrutura:

```
| Componente | C1 blocks | C2 primitive | C3 libs friendly | C4 headless | C5 custom |
| ---------- | --------- | ------------ | ---------------- | ----------- | --------- |
| Top nav    | ✅ marketing | ❌        | Origin UI ?      | Radix       | wrapper   |
| Hamburger  | ❌         | ✅ Sheet     | -                | -           | wrapper variants |
```

**Status:** preencher após pesquisa 28 voltar com lista granular.

---

## Pattern decision tree

Quando precisar de componente X:

```
1. Existe block shadcn que cobre composição?
   SIM → instalar block, customizar archetype-aware
   NÃO → próximo
2. Existe primitive shadcn?
   SIM → usar primitive + wrapper archetype-aware (components/app-*.tsx)
   NÃO → próximo
3. Existe em Origin UI / Kibo / Aceternity / Magic UI / outros?
   SIM → instalar via registry config + wrap
   NÃO → próximo
4. Existe primitive em Radix / Base UI / React Aria?
   SIM → wrap manualmente com styling do zero
   NÃO → próximo
5. Construir do zero
```

---

## Composição em archetypes (Kholmatova-aligned)

Kholmatova distingue:

- **Atoms** (= shadcn primitives — Button, Input, Card)
- **Molecules** (= compositions de atoms — FormField com Label + Input + Error)
- **Organisms** (= composições complexas — Header com Logo + Nav + UserMenu)
- **Templates** (= page layouts — DashboardLayout, MarketingLayout)
- **Pages** (= templates + content)

**Aplicado ao desafit:**

- Atoms = `components/ui/*` (47 shadcn quarentenados)
- Molecules = `components/app-*.tsx` (wrappers + composições simples)
- Organisms = `features/<feature>/components/*` (vertical slice)
- Templates = `app/(public)/layouts/*` + `app/(admin)/layouts/*`
- Pages = `app/**/page.tsx`

→ **Atomic vocab vale adotar como organização folder**, não como dogma rígido.

---

## Composability rule (Kholmatova)

> **Functional patterns** (Button, Card, Form) podem ser **compostos livremente**.
> **Perceptual patterns** (Color, Typography, Motion, Shape) NÃO podem ser misturados — herdam do template ativo.

Aplicação:

- Profissional pode adicionar 5 cards de tipos diferentes na mesma page (functional)
- Profissional NÃO pode escolher "typography do Sanity" + "shadow do Vercel" na mesma surface (perceptual)

→ Editor visual Fase 2 expõe functional escolhas, locka perceptual.

---

## Anti-patterns identificados

| Anti-pattern                                                 | Por quê ruim                                 | Substituto                                              |
| ------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------- |
| Misturar 3-4 libs (Origin UI + Aceternity + Magic UI + Kibo) | Frankenstein visual, inconsistência          | 1-2 libs complementares por archetype                   |
| Forkar shadcn primitive em `components/ui/*`                 | Quebra ADR-0040 quarentena                   | Wrapper em `components/app-*.tsx`                       |
| Wrapper passthrough (proibido Vercel Academy)                | Dobra tamanho do design system sem agregar   | Wrapper SÓ com valor agregado (variant resolution, etc) |
| Construir Button do zero                                     | shadcn `Button` cobre 100%                   | Use shadcn + variant prop                               |
| Construir Date Picker do zero                                | shadcn `Calendar` + Origin UI cobrem         | Use + wrap                                              |
| Pular hierarquia direto pra Camada 5                         | Reinventa roda + perde a11y community-tested | Sempre Camada 1 → 5 em ordem                            |
| Inline tokens (`style={{color: '#635BFF'}}`)                 | Quebra white-label, bloqueado por hook       | Use CSS var (`var(--accent)`)                           |
| Misturar Tailwind classes + CSS vars na mesma prop           | Specificity conflict                         | Escolher um — CSS vars vence runtime per tenant         |

---

## Decisão pendente — quais libs ativar?

**Hipótese:** ativar 2-3 libs complementares dia 1, expandir JIT.

Candidatos prioritários:

- **Origin UI** (cobre gaps shadcn em forms complexos)
- **Kibo UI** (gaps SaaS patterns)
- **Magic UI** ou **Aceternity** (motion-heavy — escolher 1 só)

A pesquisar:

- Como configurar múltiplos registries em `components.json`
- Se algum lib quebra ADR-0040 quarentena
- Audit a11y de cada (Radix < React Aria < Adobe React Aria nesse spectrum)

---

## Pendências

- [ ] Pesquisa 28 (component catalog ampliado) — orienta mapping componente × hierarquia
- [ ] Preencher tabela mapping completa
- [ ] Decidir 2-3 libs friendly ativar dia 1
- [ ] Audit a11y de cada lib candidata
- [ ] Configurar `components.json` com registries adicionais
- [ ] Verificar conflict com ADR-0040 (quarentena)
- [ ] Decidir Kholmatova vocab (atoms/molecules/etc) — folder organization
- [ ] Composability rule (functional free + perceptual locked) — documentar em rule path-loaded

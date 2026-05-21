# 18. shadcn Registries Coverage — Passo 2C

> Status: concluído — 2026-05-20
> Registries: Origin UI + Kibo UI + Reui + Magic UI
> Input: componentes Core 8 + lista SaaS + mobile-specific gaps de `19-mobile-first-additions.md`
> Nota: este documento cobre as 4 registries solicitadas. Para análise de shadcnblocks, Aceternity e Tweakcn, ver versão anterior deste arquivo (git history).

---

## Resumo executivo

- **Origin UI** (618+ variants em 30 categorias, Tailwind v4, React Aria a11y Gold+) é a registry mais completa para **form inputs avançados** e variantes ricas de primitives — preenche ~70% dos gaps do Core 8 em formulários e navegação.
- **Kibo UI** (41 components SaaS-specific, adquirida pela Shadcnblocks em Out/2025) é best-in-class para **SaaS patterns** únicos: kanban, gantt, dropzone, code block, avatar stack, ticker, status pills — gaps que shadcn oficial não cobre.
- **Reui** (1003+ components em 68 categorias, Tailwind v4, dual Radix+BaseUI) tem o **maior catálogo numérico** mas valor único concentrado em data-grid TanStack e timeline/stepper robustos; grande overlap com shadcn oficial.
- **Magic UI** (150+ animated components, Tailwind v4, `motion/react` alinhado) é **marketing-first** com efeitos visuais — cobertura do Core 8 quase nula, mas oferece components de valor real para SaaS: Number Ticker, Bento Grid, Marquee, Animated List, Terminal, File Tree.
- **Gaps confirmados (custom dev)**: NavigationBottom (bottom tab), Hero section, SectionHeader, FormGroup outlined/filled, BottomSheet iOS-style, FAB, StickyBottomCTA, FrostedNav, PersistentPlayer — nenhuma das 4 registries cobre adequadamente esses patterns mobile-first.
- **Recomendação**: ativar Origin UI + Kibo UI dia 1; Reui JIT para data-grid; Magic UI JIT para archetypes motion-heavy.

---

## Registry 1: Origin UI

### Visão geral

- **URL:** originui.com (agora parte de coss.com/origin)
- **Total:** 618+ variants em 30 categorias (React); ~400 variantes no catálogo público
- **GitHub:** origin-space/originui (fork principal), com variantes em Svelte/Vue/Angular confirmando paridade de categorias
- **Tailwind:** v4 nativo (atualizado 25-fev-2025; legacy Tailwind v3 disponível via `/r/legacy/`)
- **Shadcn style:** New York como default 2025 (confirmado)
- **A11y:** Radix UI + **React Aria** (Adobe) — Gold+ standard
- **Licença:** open-source

### Componentes disponíveis (por categoria)

| Categoria              | Count | Destaques                                                                   |
| ---------------------- | ----- | --------------------------------------------------------------------------- |
| Accordion              | 20    | variantes com ícones, aninhado, controlled                                  |
| Alert                  | 12    | destructive, info, warning, success                                         |
| Avatar                 | 23    | com badge, stack, grupos                                                    |
| Badge                  | 13    | pill, outlined, dot-status                                                  |
| Banner                 | 12    | dismissible, sticky, inline                                                 |
| Breadcrumb             | 8     | com dropdown, truncado                                                      |
| Button                 | 54    | loading, icon, split, group, floating                                       |
| Calendar & Date picker | 28    | range, multi-select, time, year picker                                      |
| Checkbox               | 20    | indeterminate, list, grid, card-style                                       |
| Image Cropper          | 11    | crop circular, aspect ratio                                                 |
| Dialog                 | 21    | drawer, full-screen, nested, alert                                          |
| Dropdown               | 15    | com search, checkboxes, radio, submenus                                     |
| File upload            | 14    | dropzone, multi-file, progress, image preview                               |
| Event calendar         | 1     | full-page event calendar                                                    |
| Input                  | 59    | search, password strength, phone, OTP, number, currency, tags, multi-select |
| Navbar                 | 20    | top nav, sidebar, mobile hamburger                                          |
| Notification           | 22    | toast stack, notification center, inline                                    |
| Pagination             | 12    | numbered, load-more, cursor-based                                           |
| Popover                | 9     | rich content, form in popover                                               |
| Radio                  | 20    | card-style, image option, rating-like                                       |
| Select                 | 51    | searchable, multi, tags, combobox                                           |
| Slider                 | 27    | range, step, label, price range                                             |
| Stepper                | 17    | horizontal, vertical, form wizard                                           |
| Switch                 | 17    | label, card, group                                                          |
| Table                  | 20    | sortable, filterable, paginated, expandable rows                            |
| Tabs                   | 20    | pill, underline, card, vertical                                             |
| Textarea               | 19    | auto-resize, character count, rich label                                    |
| Timeline               | 12    | vertical, activity feed, horizontal, git-style                              |
| Tooltip                | 12    | rich, delay, interactive                                                    |
| Tree                   | 15    | file system, multi-select, async                                            |
| _(hooks)_              | —     | `useImageUpload`, `usePagination`, `useCharacterLimit`                      |

### Highlights relevantes para este projeto

- **Multi-select** e **tags input** — os gaps mais críticos do shadcn oficial, cobertos com excelência
- **Time picker** e **Date picker range + multi** — essenciais para booking flows (desafit: reservar aula)
- **Phone input** — necessário em formulários de cadastro
- **Password strength meter** — onboarding flow
- **Stepper (17 variantes)** — wizards de onboarding, checkout multi-step
- **File upload (14 variantes)** — upload de foto de perfil, materiais de aula
- **Notification center (22 variantes)** — centro de notificações SaaS
- **Navbar (20 variantes)** — inclui top nav variants; **sem bottom tab** (gap móvel)
- **Timeline (12 variantes)** — histórico de atividades, feed de progresso

### Método de instalação

```bash
# Componente individual (após configurar registry)
pnpm dlx shadcn@latest add @origin-ui/multi-select
pnpm dlx shadcn@latest add @origin-ui/time-picker

# URL direta (sem namespace configurado)
pnpm dlx shadcn@latest add https://originui.com/r/comp-163.json

# Legacy Tailwind v3
pnpm dlx shadcn@latest add https://originui.com/r/legacy/comp-01.json
```

**components.json:**

```json
{
  "registries": {
    "@origin-ui": "https://originui.com/r/{name}.json"
  }
}
```

---

## Registry 2: Kibo UI

### Visão geral

- **URL:** kibo-ui.com
- **Total:** 41 components + 28 blocks + 1100+ patterns
- **GitHub:** shadcnblocks/kibo (adquirida por Shadcnblocks, Out/2025)
- **Tailwind:** compatível com Tailwind v4 via shadcn/ui (requer shadcn CSS Variables)
- **Shadcn style:** CSS Variables only (não especifica New York vs Default explicitamente; compatível com ambos via CSS vars)
- **A11y:** Radix UI-backed
- **Licença:** open-source
- **Instalação:** `npx kibo-ui add [component]` ou shadcn CLI

### Componentes disponíveis (por categoria)

**Colaboração:**

- Avatar Stack, Cursor

**Gestão de projeto:**

- Calendar (range, locale), Gantt, Kanban, List, Table

**Código:**

- Code Block (syntax highlight + copy), Contribution Graph, Sandbox, Snippet

**Formulários:**

- Choicebox, Combobox, Dropzone, Mini Calendar, Tags

**Imagens:**

- Image Crop, Image Zoom

**Finanças:**

- Credit Card, Ticker (animated number)

**Social:**

- Stories, Reel, Video Player

**Callouts:**

- Announcement (banner), Banner

**Estilo:**

- Typography

**Outros:**

- Color Picker (Figma-style), Comparison, Deck, Dialog Stack, Editor (rich text), Glimpse, Marquee, Pill, QR Code, Rating, Relative Time, Spinner, Status, Theme Switcher, Tree

### Blocks disponíveis (28 blocos)

**Aplicações (3):**

- Codebase, Collaborative Canvas, Roadmap

**Websites (25):**
About, Awards, Blog, Blog Post, Careers, Case Studies, Case Study, Changelog, Code Example, Community, Compare, Compliance, Contact, **CTA**, Download, Experience, FAQ, **Feature**, **Footer**, Form, **Hero**, **Pricing**, **Stats**, Team, **Testimonial**

### Highlights relevantes para este projeto

- **Kanban + Gantt** — project management views para tenants que gerenciam programas/desafios
- **Dropzone** — upload de materiais (fotos, PDFs, vídeos) — melhor opção cross-registry
- **Code Block** — útil para tenants de idiomas (exercícios de código) e plataforma dev
- **Avatar Stack** — grupos de alunos, líderes de turma
- **Ticker (animated)** — KPI widgets no dashboard (ex: "1.234 treinos concluídos")
- **Status pills** — estado de tarefas, status de progresso
- **Color Picker** — personalização de marca no painel admin
- **Editor (rich text)** — criação de conteúdo de aulas
- **Blocks Hero/Pricing/FAQ/CTA/Testimonial/Stats** — landing pages das marcas filhas
- **Rating** — avaliação de aulas, de professores
- **QR Code** — check-in presencial, compartilhamento de programa

### Método de instalação

```bash
# CLI dedicado
npx kibo-ui add gantt
npx kibo-ui add dropzone
npx kibo-ui add kanban

# Via shadcn CLI (alternativo)
pnpm dlx shadcn@latest add @kibo-ui/dropzone
```

**components.json:**

```json
{
  "registries": {
    "@kibo-ui": "https://www.kibo-ui.com/r/{name}.json"
  }
}
```

---

## Registry 3: Reui

### Visão geral

- **URL:** reui.io
- **Total:** 1003+ components / patterns em 68 categorias
- **GitHub:** keenthemes/reui (2.9k stars)
- **Tailwind:** v4 nativo (React 19 + Tailwind v4 como requisito)
- **Shadcn style:** compatível com Shadcn Create styles (Vega, Nova, Maia, Lyra, Mira) — **não menciona New York explicitamente**; usa seus próprios temas. Nota: issue conhecida com shadcn CLI sobrescrevendo `components.json` style em registries terceiros (#10496)
- **A11y:** Radix UI + Base UI (dual support)
- **Licença:** open-source core; Pro tier disponível
- **Diferencial:** componentes mostrados em **layouts de dashboard realistas**, não demos isolados

### Componentes disponíveis (por categoria)

**17 componentes custom (in-house):**
Alert, Autocomplete, Badge, Data Grid, Date Selector, File Upload, Filters, Frame, Kanban, Number Field, Phone Input, Rating, Scrollspy, Sortable, Stepper, Timeline, Tree

**52 componentes shadcn com exemplos ricos (68 categorias, 1003+ patterns):**

Categorias com contagens altas:

- Button (61 variants), Button Group (57), Input Group (40), Avatar (35), Select (33), Input (31), Calendar (30), Data Grid (29)

Categorias adicionais:
Badge, Chart, Checkbox, Sonner, Alert, Combobox, Empty, Card, Dropdown Menu, Frame, Radio Group, Table, Toggle Group, Tooltip, Breadcrumb, Pagination, Stepper, Alert Dialog, Switch, Toggle, Label, Autocomplete, Item, Slider, Spinner, Timeline, Accordion, Carousel, Field, Popover, Collapsible, Context Menu, Dialog, File Upload, Resizable, Skeleton, Filters, Rating, Tabs, Aspect Ratio, Command, Hover Card, Phone Input, Progress, Sortable, Tree, Input OTP, Kbd, Native Select, Number Field, Separator, Textarea, Drawer, Kanban, Menubar, Scroll Area, Date Selector, Navigation Menu, Sheet, Scrollspy

### Highlights relevantes para este projeto

- **Data Grid (29 variants)** — integração TanStack Table v8 enterprise-grade; sorting, filtering, virtual scrolling, column reordering — melhor cross-registry para admin dashboards
- **Timeline** — atividades de usuário, histórico de progresso
- **Stepper** — wizards multi-step com validação
- **Filters** — sistema de filtros compostos para listagens de programas
- **Sortable** — drag-and-drop reordering (playlists de aulas, currículo)
- **Autocomplete** — busca avançada
- **Phone Input** — formulários de cadastro
- **Chart** — visualizações de dados de progresso
- **Scrollspy** — navegação de longa forma (landing pages)
- **Kanban** — visão de board para gestão de conteúdo

### Compatibilidade New York style

**Risco moderado**: Reui tem seus próprios temas (Vega, Nova, Maia, Lyra, Mira) que não mapeiam diretamente para New York. O CLI pode sobrescrever o campo `style` no `components.json` ao instalar (issue #10496 no shadcn/ui). Workaround: instalar manualmente ou usar o URL direto do registry.

```bash
# Instalação via namespace (após config)
npx shadcn@latest add @reui/c-button-10
npx shadcn@latest add @reui/c-data-grid-9

# components.json registry config:
# "@reui": "https://reui.io/r/{style}/{name}.json"
```

---

## Registry 4: Magic UI

### Visão geral

- **URL:** magicui.design
- **Total:** 150+ animated components (244 listados no registry.directory)
- **GitHub:** 21k stars
- **Tailwind:** v4 nativo (v3 no site legado v3.magicui.design)
- **Shadcn style:** "perfect companion for shadcn/ui" — sem estilo específico locked
- **A11y:** visual-first — **médio** (foco em efeitos visuais, keyboard nav e reduced-motion requerem audit manual)
- **Stack de animação:** **`motion/react`** (alinhado com stack travado do projeto — sem atrito)
- **Licença:** open-source + Pro (templates premium)
- **Instalação:** `pnpm dlx shadcn@latest add @magicui/[component]`

### Componentes disponíveis (por categoria)

**Text Animations (18):**
Text Animate, Typing Animation, Line Shadow Text, Aurora Text, Video Text, Number Ticker, Animated Shiny Text, Animated Gradient Text, Text Reveal, Dia Text Reveal, Hyper Text, Word Rotate, Scroll Based Velocity, Sparkles Text, Morphing Text, Spinning Text, Text Highlighter, Text 3D Flip

**Special Effects (9):**
Animated Beam, Border Beam, Shine Border, Magic Card, Glare Hover, Meteors, Confetti, Particles, Animated Theme Toggler

**Background Patterns (11):**
Flickering Grid, Animated Grid Pattern, Retro Grid, Ripple, Dot Pattern, Grid Pattern, Hexagon Pattern, Striped Pattern, Interactive Grid Pattern, Light Rays, Noise Texture

**Buttons (6):**
Rainbow Button, Shimmer Button, Ripple Button, Shiny Button, Pulsating Button, Interactive Hover Button

**Core Components:**
Marquee, Terminal, Hero Video Dialog, Bento Grid, Animated List, Dock, Globe, Tweet Card, Orbiting Circles, Avatar Circles, Icon Cloud, Lens, Pointer, Smooth Cursor, Progressive Blur, Dotted Map

**Device Mocks (3):**
Safari, iPhone, Android

**Community (11):**
File Tree, Code Comparison, Scroll Progress, Neon Gradient Card, Comic Text, Kinetic Text, Cool Mode, Pixel Image, Warp Background, Animated Circular Progress Bar, Backlight

### Útil para SaaS vs. puramente decorativo

**Útil para SaaS:**
| Component | Por que útil |
|---|---|
| Number Ticker | KPI widgets: "1.234 treinos", "98% satisfação" |
| Bento Grid | Feature grids na landing page da marca filha |
| Animated List | Feed de atividades, notificações em tempo real |
| Marquee | Social proof logos, depoimentos em scroll |
| Terminal | Onboarding técnico, setup guides dev-facing |
| File Tree | Estrutura de currículo, módulos de aula |
| Code Comparison | Comparativo antes/depois (útil para idiomas) |
| Scroll Progress | Indicador de progresso de leitura/aula |
| Avatar Circles | Mostrar alunos ativos em programa |
| Animated Circular Progress Bar | Progresso de conclusão de módulo |
| Hero Video Dialog | Vídeo de apresentação do programa em modal |
| Dock | Barra de ações rápidas (mobile-inspired) |

**Puramente decorativo / marketing-heavy (usar com critério):**

- Confetti, Meteors, Particles — efeitos "wow" para celebração (onboarding completion, milestone) mas ruído em SaaS cotidiano
- Aurora Text, Sparkles Text, Morphing Text — landing pages premium de marca; não para UI funcional
- Retro Grid, Hexagon Pattern, Flickering Grid — backgrounds de hero sections
- Globe, Orbiting Circles, Dotted Map — showcases de alcance global/rede
- Warp Background, Pixel Image, Comic Text — nicho (editorial/gamificado)

---

## Cobertura do Core 8

| Componente Core 8                                                  | Origin UI                                 | Kibo UI             | Reui                       | Magic UI                     | Recomendação                                                                                      |
| ------------------------------------------------------------------ | ----------------------------------------- | ------------------- | -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **NavigationBottom** (mobile bottom tabs)                          | 🟡 Navbar(20) — sem bottom-tab específico | ❌                  | ❌                         | ❌ Dock ≠ bottom tab nav     | **Custom dev** — nenhuma cobre o pattern bottom-tab PWA nativo                                    |
| **NavigationTop** (desktop top nav)                                | ✅ Navbar(20) — múltiplas variantes       | ❌                  | 🟡 Navigation Menu         | ❌                           | **Origin UI** — melhor cobertura de top nav variants                                              |
| **Card** (4 variantes: image-top, image-side, text-only, image-bg) | 🟡 Card básico + dialogs                  | ❌                  | 🟡 Card(20+)               | 🟡 Magic Card (efeito hover) | **Reui** para base + wrappers custom para cada variante específica                                |
| **ListItem** (text-only, with-avatar, with-image)                  | ✅ Avatar(23) + variantes de lista        | ❌                  | ✅ Avatar(35) + Item       | ❌                           | **Origin UI** (a11y Gold+) ou **Reui**                                                            |
| **Hero** (text-first, media-first)                                 | ❌ sem hero section                       | 🟡 Kibo block Hero  | ❌                         | 🟡 Hero Video Dialog         | **Kibo block** para base; **custom** para variantes text-first/media-first específicas do projeto |
| **Modal / BottomSheet**                                            | ✅ Dialog(21) + Drawer                    | ❌ Dialog Stack     | ✅ Dialog + Drawer + Sheet | ❌                           | **Origin UI** para modal; **BottomSheet iOS-style** = custom dev                                  |
| **SectionHeader**                                                  | 🟡 Typography + Banner                    | 🟡 Typography block | ❌                         | ❌                           | **Custom dev** — SectionHeader com eyebrow+heading+cta é padrão marketing não coberto             |
| **FormGroup** (outlined/filled)                                    | ✅ Field + Input variants                 | ❌                  | ✅ Field + Frame           | ❌                           | **Origin UI** (outlined) + **Reui** (filled variants) — wrappers custom necessários               |

**Legenda:** ✅ = cobertura boa | 🟡 = cobertura parcial/adaptação necessária | ❌ = não cobre

---

## Cobertura SaaS Common

| Componente SaaS                 | Origin UI                         | Kibo UI                  | Reui                          | Magic UI                           | Recomendação                                                           |
| ------------------------------- | --------------------------------- | ------------------------ | ----------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| Pricing tables / cards          | ❌                                | ✅ **Block Pricing**     | ❌                            | ❌                                 | **Kibo block**                                                         |
| Feature grids (2-3-4-up)        | ❌                                | ✅ **Block Feature**     | ❌                            | ✅ Bento Grid                      | **Kibo block** (funcional) + Magic UI Bento Grid (motion-heavy)        |
| Testimonials / social proof     | ❌                                | ✅ **Block Testimonial** | ❌                            | 🟡 Marquee (depoimentos em scroll) | **Kibo block**                                                         |
| FAQ accordion                   | ✅ Accordion(20)                  | ✅ **Block FAQ**         | ✅ Accordion                  | ❌                                 | **shadcn** accordion + **Kibo block** para seção FAQ completa          |
| CTA sections / banner           | ✅ Banner(12)                     | ✅ **Block CTA**         | ❌                            | ❌                                 | **Kibo block** CTA + **Origin UI** Banner para inline                  |
| Stats / number highlights       | ❌                                | ✅ **Block Stats**       | ❌                            | ✅ **Number Ticker**               | **Kibo block** Stats + **Magic UI** Number Ticker para animação        |
| Timeline / step wizard          | ✅ **Timeline(12)** + Stepper(17) | ❌                       | ✅ **Timeline** + Stepper     | ❌                                 | **Origin UI** (variedade) ou **Reui** (enterprise)                     |
| Onboarding flows                | ✅ **Stepper(17)** + form wizards | ❌                       | ✅ Stepper                    | ❌                                 | **Origin UI** (mais variantes visuais)                                 |
| Dashboard KPI widgets           | ❌                                | 🟡 Ticker                | ❌                            | ✅ **Number Ticker**               | **Magic UI** Number Ticker + **Kibo** Ticker                           |
| Data tables com filter/sort     | ✅ Table(20)                      | ✅ Table                 | ✅ **Data Grid(29) TanStack** | ❌                                 | **Reui** para enterprise; **Origin UI** para tabelas simples           |
| Chart containers                | ❌                                | ❌                       | ✅ **Chart**                  | ❌                                 | **Reui** Chart + shadcn Charts (já disponível)                         |
| Notification center             | ✅ **Notification(22)**           | ❌                       | ❌                            | 🟡 Animated List                   | **Origin UI** Notification                                             |
| User profile cards              | ✅ Avatar(23) variants            | ✅ Avatar Stack          | ✅ Avatar(35)                 | ✅ Avatar Circles                  | **Origin UI** (rico em variantes)                                      |
| Settings forms                  | ✅ Form + Field variants          | ❌                       | ✅ Form + Frame               | ❌                                 | **Origin UI**                                                          |
| Breadcrumbs                     | ✅ **Breadcrumb(8)**              | ❌                       | ✅ Breadcrumb                 | ❌                                 | **Origin UI** ou shadcn                                                |
| File upload zones               | ✅ **File upload(14)**            | ✅ **Dropzone**          | ✅ File Upload                | ❌                                 | **Kibo Dropzone** (melhor UX) ou **Origin UI** (mais variantes)        |
| Rich text editor containers     | ❌                                | ✅ **Editor**            | ❌                            | ❌                                 | **Kibo Editor**                                                        |
| Masonry grids                   | ❌                                | ❌                       | ❌                            | ❌                                 | **Custom dev**                                                         |
| Sticky bottom CTA bars (mobile) | ❌                                | ❌                       | ❌                            | ❌                                 | **Custom dev** — padrão Airbnb/Apple                                   |
| FAB (Floating Action Button)    | 🟡 Button floating variants       | ❌                       | ❌                            | ❌                                 | **Custom dev** — FAB 56px + touch-offset (Starbucks Frap canon)        |
| Bottom sheets (mobile)          | 🟡 Drawer (vaul-based)            | ❌                       | 🟡 Drawer                     | ❌                                 | shadcn Drawer (Vaul) ≈ bottom sheet; custom para iOS-style com detents |
| Frosted glass nav (mobile PWA)  | ❌                                | ❌                       | ❌                            | ❌                                 | **Custom dev** — backdrop-filter blur (Apple canon)                    |
| Persistent player/mini-player   | ❌                                | 🟡 Reel + Video Player   | ❌                            | ❌                                 | **Custom dev** — Spotify "now-playing bar" canon                       |

---

## Gaps — custom dev obrigatório

Componentes que **nenhuma das 4 registries** cobre adequadamente. Entram em `components/ds/` (Passo 8).

| Componente                                                       | Por que nenhuma registry cobre                                                                             | Referência de design |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------- |
| **NavigationBottom**                                             | Bottom tab bar PWA é pattern nativo app — registries web-first não têm                                     | Spotify, Material 3  |
| **FAB** (56px circular, touch-offset)                            | FABs em registries são simplificados; sem touch-offset, sem fixed+bottom-right canon                       | Starbucks Frap       |
| **StickyBottomCTA**                                              | Sticky bottom bar com price+action mobile = padrão commerce; nenhuma registry web cobre                    | Airbnb, Meta, Apple  |
| **FrostedNav**                                                   | backdrop-filter blur nav para PWA = iOS feel; nenhuma cobre explicitamente                                 | Apple iOS HIG        |
| **PersistentMiniPlayer**                                         | "Now-playing bar" persistente durante navegação = app-native pattern                                       | Spotify              |
| **SectionHeader** (eyebrow+title+subtitle+CTA)                   | Bloco de marketing comum; blocks existentes são muito full-width/page-wide                                 | —                    |
| **BottomSheet com detents**                                      | shadcn Drawer (Vaul) cobre básico mas sem iOS-style dynamic detents/scroll behavior                        | iOS HIG              |
| **MasonryGrid**                                                  | Nenhuma registry tem masonry responsivo — só layout primitives                                             | Pinterest            |
| **SwipeableCardStack**                                           | Tinder/IG-style — gap total cross-registry                                                                 | —                    |
| **SafeAreaWrapper**                                              | Componente de padding/inset para notch/home indicator                                                      | iOS HIG / PWA        |
| **AppShellSkeleton**                                             | Skeleton de app shell para loading (offline-first PWA)                                                     | Workbox/Serwist      |
| **HeroSection** (text-first e media-first variantes específicas) | Kibo tem Hero block mas muito genérico; variantes específicas do design system precisam de wrappers        | —                    |
| **FormGroup outlined/filled** (branded)                          | Origem UI e Reui têm inputs; mas FormGroup como unidade composita com label+helper+error branding = custom | —                    |

---

## Gaps parciais — adaptar

Componentes com **cobertura incompleta** — alguma registry cobre mas falta ajuste.

| Componente             | O que existe               | O que falta                                                             | Ação                                       |
| ---------------------- | -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| **NavigationTop**      | Origin UI Navbar(20)       | Branding multi-marca (`useBrand()`), auth states, active states         | Wrapper `app-nav-top` sobre Origin UI base |
| **Card** (4 variantes) | shadcn + Reui Card         | Variantes image-top/side/bg específicas com aspect ratio enforced       | Wrapper `app-card-[variant]`               |
| **Hero**               | Kibo block Hero            | Muito genérico; variantes text-first / media-first com brand tokens     | Wrapper sobre Kibo + tokens do archetype   |
| **Modal**              | Origin UI Dialog(21)       | BottomSheet iOS-style com overlay + rounded top corners + swipe dismiss | Usar Vaul Drawer + custom CSS              |
| **Bottom tabs**        | Nenhum                     | Completamente custom                                                    | Criar do zero em `components/ds/`          |
| **Data Table**         | Reui Data Grid (TanStack)  | Precisa de theme token alignment com New York style                     | Wrapper + custom tokens                    |
| **Chart**              | Reui Chart + shadcn Charts | Alinhamento visual com paleta OKLCH do archetype                        | Wrapper com tokens                         |
| **Onboarding flow**    | Origin UI Stepper(17)      | Multi-step com persistência de estado, validação Zod + RHF              | Integrar com `<AppForm>` + stepper         |

---

## Sobreposições — best-in-class

Quando múltiplas registries cobrem o mesmo componente, escolher:

| Componente                                             | Melhor opção                                       | Motivo                                                                                         |
| ------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Inputs avançados** (multi-select, tags, time, phone) | **Origin UI**                                      | React Aria a11y Gold+, 59 input variants, Tailwind v4                                          |
| **Stepper / wizard**                                   | **Origin UI**                                      | 17 variantes visuais; mais rico que Reui                                                       |
| **Timeline**                                           | **Origin UI** (variedade) ou **Reui** (enterprise) | Origin UI tem mais variantes visuais; Reui tem mais opções enterprise                          |
| **File upload**                                        | **Kibo Dropzone**                                  | Melhor UX drag-and-drop com preview; Origin UI tem mais variantes mas Kibo é mais polido       |
| **Avatar stack**                                       | **Kibo**                                           | Especializado, com tooltip, overflow counter                                                   |
| **Data Grid (enterprise)**                             | **Reui**                                           | TanStack v8 integration, 29 variantes, virtual scroll                                          |
| **Kanban**                                             | **Kibo** (simples) / **Reui** (enterprise)         | Kibo: visual e simples; Reui: sortable + filterable + enterprise                               |
| **Rating**                                             | **Kibo**                                           | Componente dedicado com variantes; Origin UI tem pseudo-rating via radio mas não é rating real |
| **Ticker / KPI animado**                               | **Magic UI** Number Ticker                         | `motion/react` alinhado; mais suave que Kibo Ticker                                            |
| **Marketing blocks** (Hero, Pricing, FAQ, CTA)         | **Kibo blocks**                                    | Mais completo que Origin UI; menos opinionated que shadcnblocks pago                           |
| **Notifications**                                      | **Origin UI** Notification(22)                     | Variedade maior; a11y melhor                                                                   |
| **Buttons decorativos**                                | **Magic UI** (shimmer, rainbow, pulsating)         | Animações `motion/react`; usar JIT para archetypes Bold-Energetic                              |

---

## Componentes mobile/PWA

Cobertura específica dos gaps mobile identificados em `19-mobile-first-additions.md`:

| Padrão mobile                                 | Origin UI              | Kibo UI                          | Reui         | Magic UI                | Status                                       |
| --------------------------------------------- | ---------------------- | -------------------------------- | ------------ | ----------------------- | -------------------------------------------- |
| **Bottom tab nav** (Spotify canon)            | ❌                     | ❌                               | ❌           | 🟡 Dock (não é nav tab) | **GAP — custom dev**                         |
| **FAB** (Starbucks Frap, 56px + touch-offset) | 🟡 Button floating     | ❌                               | ❌           | ❌                      | **GAP — custom dev**                         |
| **Sticky bottom CTA bar** (Airbnb/Meta/Apple) | ❌                     | ❌                               | ❌           | ❌                      | **GAP — custom dev**                         |
| **Frosted-glass nav** (Apple iOS)             | ❌                     | ❌                               | ❌           | ❌                      | **GAP — custom dev**                         |
| **Bottom sheet** (iOS-style detents)          | 🟡 Drawer/Vaul básico  | ❌                               | 🟡 Drawer    | ❌                      | **PARCIAL** — Vaul + custom CSS para detents |
| **Persistent mini-player** (Spotify)          | ❌                     | 🟡 Video Player (não persistent) | ❌           | ❌                      | **GAP — custom dev**                         |
| **Touch targets ≥44px**                       | ✅ React Aria enforced | ✅ via shadcn                    | ✅ via Radix | 🟡 sem garantia         | OK via Origin UI + shadcn base               |
| **Pull-to-refresh**                           | ❌                     | ❌                               | ❌           | ❌                      | **GAP** — CSS only ou lib específica         |
| **Safe area insets** (notch)                  | ❌                     | ❌                               | ❌           | ❌                      | **GAP — custom dev** (CSS env vars)          |
| **Swipeable cards**                           | ❌                     | ❌                               | ❌           | ❌                      | **GAP** — Vaul + motion/react                |
| **Snap-scroll feed**                          | ❌                     | ❌                               | ❌           | ❌                      | **GAP** — CSS scroll-snap                    |
| **App shell skeleton**                        | ✅ Skeleton variants   | ❌                               | ✅ Skeleton  | ❌                      | **OK** — shadcn Skeleton                     |
| **Bottom tab badge** (unread count)           | 🟡 Badge standalone    | ❌                               | 🟡 Badge     | ❌                      | Usar shadcn Badge sobre custom tab component |

**Conclusão mobile**: as 4 registries cobrem **0 dos 8 padrões mobile-specific críticos** para PWA native-feel (bottom tab, FAB, sticky-bottom-CTA, frosted-nav, persistent player, pull-to-refresh, safe-area, swipeable cards). Todo esse grupo é custom dev obrigatório.

---

## Recomendação final

### components.json — registries a adicionar

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "registries": {
    "@origin-ui": "https://originui.com/r/{name}.json",
    "@kibo-ui": "https://www.kibo-ui.com/r/{name}.json"
  }
}
```

**Reui** e **Magic UI** ficam fora do `components.json` global — instalar via URL direta JIT para evitar conflitos de style token (Reui) e manter build clean (Magic UI motion components são pesados).

### Prioridade de instalação

**Camada 1 — Dia 1 (essenciais, forma o catálogo base):**

- Origin UI: gaps críticos de form inputs
- Kibo UI: SaaS patterns únicos

**Camada 2 — JIT (quando feature/archetype consumir):**

- Reui: quando admin dashboard precisar de data-grid TanStack enterprise
- Magic UI: quando archetype Bold-Energetic (Nike), AI-sunset (Mistral), Brutalist (Verge) for ativado

**Camada 3 — Custom dev (Passo 8):**

- Todo o conjunto mobile-PWA (bottom tab, FAB, sticky-CTA, frosted-nav, mini-player)
- Wrappers archetype-aware sobre bases das registries

### Lista de comandos npx shadcn add (Core 8 + SaaS essenciais)

```bash
# === ORIGIN UI — instalar dia 1 ===

# Form inputs críticos (gaps shadcn)
pnpm dlx shadcn@latest add @origin-ui/multi-select
pnpm dlx shadcn@latest add @origin-ui/time-picker
pnpm dlx shadcn@latest add @origin-ui/tags-input
pnpm dlx shadcn@latest add @origin-ui/phone-input
pnpm dlx shadcn@latest add @origin-ui/date-picker-range
pnpm dlx shadcn@latest add @origin-ui/stepper
pnpm dlx shadcn@latest add @origin-ui/password-strength

# NavigationTop base (adaptar com useBrand())
pnpm dlx shadcn@latest add @origin-ui/navbar

# Timeline + Notification
pnpm dlx shadcn@latest add @origin-ui/timeline
pnpm dlx shadcn@latest add @origin-ui/notification

# === KIBO UI — instalar dia 1 ===

# SaaS patterns únicos
npx kibo-ui add dropzone
npx kibo-ui add color-picker
npx kibo-ui add code-block
npx kibo-ui add avatar-stack
npx kibo-ui add rating
npx kibo-ui add snippet
npx kibo-ui add status
npx kibo-ui add ticker
npx kibo-ui add announcement
npx kibo-ui add banner
npx kibo-ui add relative-time
npx kibo-ui add qr-code

# Marketing blocks (para landing pages das marcas filhas)
npx kibo-ui add hero          # bloco website
npx kibo-ui add pricing       # bloco website
npx kibo-ui add faq           # bloco website (usa shadcn Accordion)
npx kibo-ui add cta           # bloco website
npx kibo-ui add testimonial   # bloco website
npx kibo-ui add stats         # bloco website
npx kibo-ui add feature       # bloco website

# Project management (quando admin dashboard consumir)
# npx kibo-ui add kanban
# npx kibo-ui add gantt

# === REUI — JIT (data-grid enterprise) ===
# Adicionar quando admin dashboard precisar
# npx shadcn@latest add @reui/c-data-grid-9
# npx shadcn@latest add @reui/c-filters-5
# npx shadcn@latest add @reui/c-sortable-3

# === MAGIC UI — JIT (archetypes motion-heavy) ===
# Ativar quando Nike/Mistral/Verge/SpaceX archetype for ativado
# pnpm dlx shadcn@latest add @magicui/number-ticker
# pnpm dlx shadcn@latest add @magicui/bento-grid
# pnpm dlx shadcn@latest add @magicui/marquee
# pnpm dlx shadcn@latest add @magicui/animated-list
# pnpm dlx shadcn@latest add @magicui/border-beam
# pnpm dlx shadcn@latest add @magicui/hero-video-dialog
# pnpm dlx shadcn@latest add @magicui/animated-beam
```

**Nota importante:** confirmar nomes exatos dos componentes Origin UI e Kibo UI via `mcp__shadcn__list_items_in_registries` após adicionar as registries ao `components.json`, pois os nomes de namespace podem diferir ligeiramente (ex: `multi-select` vs `multiselect`).

---

## Riscos e notas de compatibilidade

| Risco                                                       | Registry  | Severidade | Mitigação                                                                        |
| ----------------------------------------------------------- | --------- | ---------- | -------------------------------------------------------------------------------- |
| Reui sobrescreve `style` no `components.json`               | Reui      | Médio      | Instalar via URL direta; não adicionar como registry global                      |
| Kibo UI Tailwind v4 — não confirmado explicitamente         | Kibo UI   | Baixo      | Testar com 1 componente piloto antes do lote; requer `shadcn CSS Variables`      |
| Magic UI a11y — visual-first, sem garantia de keyboard nav  | Magic UI  | Médio      | Audit manual + `prefers-reduced-motion` gate obrigatório ao consumir             |
| Origin UI nomes de namespace — podem diferir do documentado | Origin UI | Baixo      | Verificar via `list_items_in_registries` antes do Passo 8                        |
| Kibo UI adquirida por Shadcnblocks — pode tornar pago       | Kibo UI   | Baixo      | Open-source core prometido; monitorar releases                                   |
| Frankenstein visual — misturar muitos registries            | Todos     | Alto       | Limite 3 registries simultâneos por tenant; wrappers `components/app-*` resolvem |

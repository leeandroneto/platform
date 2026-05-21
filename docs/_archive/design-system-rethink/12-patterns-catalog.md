# 12. Patterns catalog — organisms reutilizáveis

> Status: catálogo aberto + perguntas
> Última atualização: 2026-05-19
> Bloqueado por: pesquisa 28 (component catalog) + decisões archetype × pattern mapping

---

## O que é "pattern" (nível canônico)

Hierarquia design system canônica (Atlassian / Carbon / Material / Polaris / designsystems.com):

```
Foundations  →  Components  →  Patterns  →  Templates
(tokens)        (atoms/         (organisms     (page
                 molecules)      = composições  layouts)
                                 reutilizáveis)
```

**Pattern ≠ Component.** Pattern é **composição** de components + **sequência de uso** + **states** + **transitions** + **decisões UX**. Documentação foca em _fluxo_ + _guidelines_, não em estilo.

Exemplo:

- **Component:** `<Button>` (variant primary/secondary/etc)
- **Pattern:** "Login flow" (form + branding + redirect + error states + remember me + forgot password)

---

## Catálogo proposto (com Patterns equivalentes nos canônicos)

### 1. Auth / Onboarding patterns

| Pattern                | O que inclui                                            | Referência canônica        |
| ---------------------- | ------------------------------------------------------- | -------------------------- |
| **Login Flow**         | Form + branding + remember me + forgot + OAuth options  | Atlassian, Polaris         |
| **Signup Flow**        | Multi-step OR single-page + email verify + onboarding   | Carbon, Material           |
| **Password Reset**     | Email entry → token → new password → confirmation       | Universal                  |
| **Magic Link Flow**    | Email → "check inbox" → click → auto-login              | Notion, Vercel             |
| **OAuth Flow**         | Provider buttons + scopes + callback                    | Linear, Vercel             |
| **Email Verification** | Banner + "resend" + "expired link"                      | Universal                  |
| **Onboarding Wizard**  | Multi-step com progress + skip option + values per step | Notion (org setup), Linear |
| **Profile Setup**      | Avatar + display name + preferences + completion %      | Slack, Discord             |

### 2. Dashboard patterns

| Pattern               | O que inclui                                                     |
| --------------------- | ---------------------------------------------------------------- |
| **Dashboard Layout**  | Sidebar + Topbar + Main + Aside (optional) + responsive collapse |
| **Empty Dashboard**   | First-time user — onboarding cards + CTAs                        |
| **Dashboard Filter**  | Sidebar filters + active filter chips + clear all                |
| **Metric Cards Grid** | 2/3/4 col responsive + tabular-nums + trend indicators           |
| **Activity Feed**     | Chronological list + grouping + load-more / infinite scroll      |
| **Search & Command**  | Cmd+K palette + recent + suggestions + scoped results            |

### 3. List / Data patterns

| Pattern             | O que inclui                                           |
| ------------------- | ------------------------------------------------------ |
| **Data Table**      | Header + sort + filter + select + actions + pagination |
| **Bulk Actions**    | Select-all + selected count + action bar floats        |
| **Inline Editing**  | Click cell → input → blur saves OR Cmd+Enter           |
| **Infinite Scroll** | Sentinel + skeleton loader + scroll restore            |
| **Pagination**      | First/prev/next/last + page jump + page-size selector  |
| **Filter Drawer**   | Side drawer with categorized filters + apply/clear     |
| **Empty State**     | Illustration/icon + heading + description + CTA        |
| **Loading State**   | Skeleton matching final layout (não spinner)           |
| **Error State**     | Icon + heading + description + retry/contact CTA       |

### 4. Form patterns

| Pattern                | O que inclui                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| **Multi-step Form**    | Progress + step navigation + auto-save draft + validation per step |
| **Inline Validation**  | Real-time + error message + success indicator                      |
| **Form Submit States** | Idle / loading / success / error + transitions                     |
| **Optimistic Update**  | UI updates before server confirms + rollback on error              |
| **File Upload**        | Drag-drop + progress + thumbnail preview + remove                  |
| **Bulk Form Fields**   | Add-remove rows + reorder + validation per row                     |
| **Conditional Fields** | Show/hide based on other field values                              |
| **Save Indicator**     | "Saved" / "Saving..." / "Failed" badge near form                   |

### 5. Notification & Feedback patterns

| Pattern                 | O que inclui                                                 |
| ----------------------- | ------------------------------------------------------------ |
| **Toast Notifications** | Position + stack + dismiss + auto-hide + actions             |
| **Banner Alerts**       | Top-of-page + persistent + dismissible                       |
| **Confirmation Dialog** | Destructive action confirm + Cancel + Confirm + danger color |
| **Snackbar Undo**       | "Deleted. Undo." floating bottom + 5s timeout                |
| **Progress Indicator**  | Determinate bar + steps + estimated time                     |
| **Status Badge**        | Active / pending / completed / failed colors                 |

### 6. Navigation patterns

| Pattern               | O que inclui                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| **Top Nav Marketing** | Logo + nav links + CTA + mobile hamburger                               |
| **Top Nav App**       | Logo + workspace + nav + search + notifications + user menu             |
| **Sidebar Nav**       | Collapsible + grouped sections + active state + tooltips when collapsed |
| **Tab Navigation**    | Sticky + underline / pill / segmented                                   |
| **Breadcrumb**        | Hierarchy path + truncate middle on long paths                          |
| **Mobile Bottom Tab** | 3-5 main destinations + active indicator + badges                       |
| **Hamburger Sheet**   | Slide-in drawer + nav stack + close button + backdrop                   |
| **Sticky Search Bar** | Compresses on scroll (Airbnb canon)                                     |

### 7. Content patterns

| Pattern               | O que inclui                                             |
| --------------------- | -------------------------------------------------------- |
| **Hero Block**        | Headline + subhead + CTA + media (image/video/animation) |
| **Feature Grid**      | 3/4-col cards + icon + headline + description            |
| **Testimonials Grid** | Avatar + quote + name + company logo                     |
| **Pricing Table**     | Tiers + features matrix + CTA + featured tier            |
| **FAQ Accordion**     | Questions + collapsible answers + search                 |
| **Stats Counter**     | Animated count-up + label + accent color                 |
| **Image Gallery**     | Grid + lightbox + zoom + swipe mobile                    |
| **Video Player**      | Native or custom controls + thumbnails + captions        |
| **Comparison Table**  | Feature × tier matrix                                    |

### 8. E-commerce / SaaS patterns

| Pattern               | O que inclui                                            |
| --------------------- | ------------------------------------------------------- |
| **Product Detail**    | Hero image + variants + price + reviews + add-to-cart   |
| **Shopping Cart**     | Items list + qty edit + remove + summary + checkout CTA |
| **Checkout Flow**     | Address + shipping + payment + review + confirmation    |
| **Subscription Card** | Plan + price + billing cycle + cancel/upgrade           |
| **Invoice / Receipt** | Line items + totals + download PDF                      |
| **Order Status**      | Steps + estimated date + tracking link                  |

### 9. Help / Support patterns

| Pattern                | O que inclui                                           |
| ---------------------- | ------------------------------------------------------ |
| **Chatbot Launcher**   | Floating bubble + open/close + unread badge            |
| **Chat Interface**     | Messages + input + attachments + typing indicator      |
| **Help Center Search** | Search + suggested articles + categories + contact CTA |
| **Cookie Consent**     | Banner + accept/customize + category toggles           |
| **Maintenance Page**   | Friendly message + ETA + status link                   |
| **404 Page**           | Friendly message + search + navigation back            |

### 10. Configurator / Wizard patterns

| Pattern                  | O que inclui                                       |
| ------------------------ | -------------------------------------------------- |
| **Product Configurator** | Multi-step + live preview + price update + options |
| **Theme Configurator**   | Color picker + preview + variants                  |
| **Profile Wizard**       | Multi-step + progress + auto-save + back/next      |
| **Filter Wizard**        | Guided question flow → curated result set          |

---

## Mapping pattern → archetypes

Cada pattern tem **variantes per archetype** (especialmente Hero, Pricing, Testimonials):

| Pattern      | Editorial-Serif               | Minimal-Mono                            | Soft-Productive                        | Bold-Energetic                       | Warm-Wellness                   |
| ------------ | ----------------------------- | --------------------------------------- | -------------------------------------- | ------------------------------------ | ------------------------------- |
| Hero         | Serif display + photo framed  | Geist tight + no photo / product mockup | Display + composite mockup             | Condensed display + full-bleed photo | Soft serif + nature photo       |
| Pricing      | 3-tier table com hairlines    | 2-3 tier minimal                        | 3-tier featured center + tinted shadow | Athletic colors + single CTA tier    | Pill cards + warm tones         |
| Testimonials | Editorial quote serif + photo | Single bold quote                       | Grid 3-col + photo + name              | Athletic photos + bold quote         | Soft-focus photo + gentle quote |
| Feature Grid | 3-col + icon thin             | 2-col compact + icon thin               | 3-col + composite icon                 | 2-col bold + icon filled             | 3-col + photo + rounded icon    |

Pesquisa 28 vai cravar os detalhes.

---

## Perguntas em aberto

### Q1 — Patterns ficam em `components/` ou pasta própria?

Hipóteses:

- **A:** `features/<feature>/components/*` (vertical slice — pattern segue domínio)
- **B:** `components/patterns/<pattern>.tsx` (catálogo global reutilizável)
- **C:** Híbrido — patterns gerais (Hero, Pricing) em `components/patterns/`, patterns específicos (UserOnboarding, PaymentConfirmation) em features

**Recomendação preliminar:** C híbrido. Patterns reutilizáveis cross-feature ficam globais. Domain-specific fica em vertical slice.

### Q2 — Pattern recebe `archetype` automaticamente?

Hipóteses:

- **A:** Hero component lê `useArchetype()` internamente — patterns are "smart"
- **B:** Pattern recebe `<Hero variant="editorial-serif" />` explicit
- **C:** Pattern + slot — pais decide variant, child componente herda

**Recomendação preliminar:** A — patterns archetype-aware via context.

### Q3 — Patterns customizáveis por tenant via admin?

Hipóteses:

- **A:** Tenant escolhe pattern variant em admin (e.g. "Hero variant minimal vs cinematic")
- **B:** Tenant não escolhe — archetype dita 100%
- **C:** Tenant escolhe **conteúdo** apenas (Hero headline, image), variant locked per archetype

**Recomendação preliminar:** C dia 1. A Fase 2 quando demanda surgir.

### Q4 — Pattern docs ficam em Storybook + esta pasta + onde?

Hipóteses:

- **A:** Storybook stories per pattern com variants per archetype
- **B:** Markdown docs em `docs/design-system/patterns/<pattern>.md`
- **C:** Ambos — Storybook visual + docs com guidelines UX

**Recomendação preliminar:** C — Storybook pra visual, markdown pra guidelines/decisions UX.

### Q5 — Como tratar patterns multi-vertical?

Login flow é universal. Mas Onboarding fitness ≠ onboarding idiomas ≠ onboarding yoga.

Hipóteses:

- **A:** Pattern base + slots — `<OnboardingWizard steps={verticalSteps} />`
- **B:** Pattern per vertical (`<FitnessOnboarding />`, `<YogaOnboarding />`)
- **C:** Pattern com `vertical` prop que delega pra child variants

**Recomendação preliminar:** A — slots permitem clone-first + per-vertical content.

---

## Pendências

- [ ] Decidir Q1 (folder organization)
- [ ] Decidir Q2 (archetype context vs prop)
- [ ] Decidir Q3 (tenant customization scope)
- [ ] Decidir Q4 (docs location)
- [ ] Decidir Q5 (multi-vertical patterns)
- [ ] Pesquisa 28 — extrair variants per archetype de cada pattern (em especial Hero, Pricing, FAQ, CTA)
- [ ] Consultar designsystems.com referências de patterns específicos
- [ ] Auditar IBM Carbon Patterns (são canon nessa área)
- [ ] Auditar Atlassian Patterns (também canon)
- [ ] Mapping pattern × archetype (tabela completa) após pesquisa 28

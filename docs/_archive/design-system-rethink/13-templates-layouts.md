# 13. Templates layouts — page skeletons (Atomic "templates")

> Status: catálogo aberto + perguntas
> Última atualização: 2026-05-19
> Bloqueado por: decisão D-15 (renomear nosso "template" pra `archetype`) + escolha next-route-architecture

---

## Importante: vocabulário

**"Template" nesta página = Atomic Design "template"** (page layout esqueleto). NÃO é nosso "template" perceptual (= **archetype**).

Decisão **D-15 em `11-decisions-pending.md`:** renomear nosso "template" perceptual pra `archetype` pra evitar colisão. Quando feito, esta pasta usa "template" no sentido canônico Atomic livremente.

---

## O que é "template" canônico

Hierarquia design system (designsystems.com / Brad Frost / Atlassian):

```
Foundations  →  Components  →  Patterns  →  Templates  →  Pages
                                            (skeletons    (templates
                                             vazios)       + content)
```

**Template Atomic = page layout esqueleto** com **regiões nomeadas** (Header, Hero, Main, Aside, Footer). Sem conteúdo. Só estrutura.

**Page = Template + content específico.**

Exemplo:

- **Template:** `MarketingLayout` (Header + Hero slot + Sections + Footer)
- **Page:** `/sobre` (MarketingLayout + content específico de "Sobre")

---

## Catálogo proposto

### 1. Public / Marketing layouts

| Template            | Regiões                                                                | Use case                                |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| **MarketingLayout** | Header + Hero + Sections + Footer                                      | Landing pages, About, Pricing, Features |
| **BlogLayout**      | Header + Hero compact + Article body + Sidebar + Footer                | Blog posts, articles                    |
| **BlogIndexLayout** | Header + Hero + Filter bar + Article grid + Pagination + Footer        | Blog index                              |
| **AuthLayout**      | Header minimal + Centered form + Footer minimal                        | Login, signup, reset password           |
| **LegalLayout**     | Header + Sidebar TOC + Main + Footer                                   | Privacy, terms, cookies                 |
| **LandingPage**     | Header + Hero + Features + Testimonials + Pricing + FAQ + CTA + Footer | Sales pages                             |
| **PricingLayout**   | Header + Hero + Pricing table + FAQ + Trust + Footer                   | Dedicated pricing page                  |
| **DocsLayout**      | Header + Sidebar nav + Article + TOC right + Footer                    | Documentation                           |
| **ErrorLayout**     | Centered icon + message + actions                                      | 404, 500, offline                       |

### 2. Admin / Dashboard layouts

| Template             | Regiões                                                 | Use case                       |
| -------------------- | ------------------------------------------------------- | ------------------------------ |
| **DashboardLayout**  | Sidebar + Topbar + Main + Aside (optional)              | Admin home, analytics          |
| **DetailLayout**     | Sidebar + Topbar + Breadcrumb + Main wide + Actions     | Detail/edit pages              |
| **SettingsLayout**   | Sidebar + Topbar + Sub-nav + Main settings sections     | Preferences, account           |
| **ListLayout**       | Sidebar + Topbar + Filter bar + Data table + Pagination | Records lists                  |
| **EmptyLayout**      | Sidebar + Topbar + Empty state center                   | First-time user, no data       |
| **WorkflowLayout**   | Topbar minimal + Steps progress + Main + Sticky actions | Multi-step forms               |
| **FullscreenLayout** | No chrome + Main + Floating actions                     | Modal flows, focused workflows |
| **SplitLayout**      | Sidebar + Topbar + Master list + Detail pane            | Email, chat, file managers     |

### 3. PWA / Mobile layouts

| Template             | Regiões                                                 | Use case                          |
| -------------------- | ------------------------------------------------------- | --------------------------------- |
| **AppShell**         | Top nav + Main + Bottom tab nav                         | PWA main app                      |
| **ListingDetail**    | Hero photo + Info card + Sticky CTA bar bottom          | Airbnb canon — bookings, products |
| **OnboardingLayout** | Progress + Step content + Sticky bottom nav (back/next) | Mobile onboarding                 |
| **CheckoutLayout**   | Top header + Main + Sticky bottom summary + CTA         | Mobile checkout                   |
| **PlayerLayout**     | Top mini-controls + Main content + Bottom player bar    | Video/audio apps                  |
| **CameraLayout**     | Full viewport + Floating controls + Bottom action       | Camera/scan flows                 |

### 4. Special purpose layouts

| Template        | Regiões                                           | Use case                       |
| --------------- | ------------------------------------------------- | ------------------------------ |
| **EmbedLayout** | No chrome + Main isolado                          | Embed em iframe (form, widget) |
| **PrintLayout** | Optimized pra impressão (sem nav, alto contraste) | Reports, receipts, invoices    |
| **EmailLayout** | HTML email (table-based, dark mode aware)         | Transactional emails           |
| **PDFLayout**   | Layout pra render `@react-pdf/renderer`           | Report PDFs, invoices          |

---

## Regiões padrão (named slots)

Tokens para regiões consistentes:

```
--region-header-h           64px (default) / 56px (mobile)
--region-topbar-h           56px / 48px (mobile)
--region-bottom-nav-h       64px (mobile only)
--region-sidebar-w          240px / 280px collapsed-to 64px
--region-aside-w            320px (optional, desktop only)
--region-main-padding       (varia per layout)
--region-footer-h           variable (content-driven)
```

---

## Mapping template × archetype

Cada template recebe variants per archetype (Hero, padding, density, motion):

| Template        | Editorial-Serif            | Minimal-Mono         | Soft-Productive            | Bold-Energetic                  | Warm-Wellness              |
| --------------- | -------------------------- | -------------------- | -------------------------- | ------------------------------- | -------------------------- |
| MarketingLayout | Serif hero + framed photos | Geist + no photo     | Composite mockup           | Cinematic full-bleed            | Soft serif + nature        |
| DashboardLayout | (raro — fitness raramente) | Linear-style + dense | Stripe-style + comfortable | Sports dashboard + bold metrics | Wellness dashboard rounded |
| AuthLayout      | Editorial + framed bg      | Minimal centered     | Stripe-canon               | Athletic photo bg               | Soft pastel bg             |
| AppShell PWA    | Editorial dense            | Minimal compact      | Comfortable                | Bold full-bleed                 | Spacious rounded           |

→ Pesquisa 28 vai cravar detalhes.

---

## Como template recebe content (slots / children)

Padrão React 19:

```tsx
// app/(public)/sobre/page.tsx
export default function AboutPage() {
  return (
    <MarketingLayout header={<MarketingHeader />} footer={<MarketingFooter />}>
      <HeroBlock variant="centered" />
      <FeaturesGrid />
      <CTABlock />
    </MarketingLayout>
  )
}
```

Ou via children slots:

```tsx
<DashboardLayout>
  <DashboardLayout.Topbar>...</DashboardLayout.Topbar>
  <DashboardLayout.Sidebar>...</DashboardLayout.Sidebar>
  <DashboardLayout.Main>...</DashboardLayout.Main>
</DashboardLayout>
```

Next 16 App Router pode usar `parallel routes` pra slots:

```
app/(admin)/@sidebar/page.tsx
app/(admin)/@main/page.tsx
app/(admin)/layout.tsx (renderiza ambos)
```

→ Decisão técnica: **parallel routes** vs **compound components**. Provavelmente compound components dia 1 (mais simples), parallel routes JIT.

---

## Perguntas em aberto

### Q1 — Templates ficam em `app/**/layout.tsx` ou `components/layouts/*`?

Hipóteses:

- **A:** Next 16 conventional — `app/(public)/layout.tsx` define MarketingLayout
- **B:** Components — `components/layouts/MarketingLayout.tsx` importado em pages
- **C:** Híbrido — Next layout.tsx delega para Components

**Recomendação preliminar:** C — `app/.../layout.tsx` minimal wrapper que importa `<MarketingLayout>` de components. Permite reuso fora do app router.

### Q2 — Quantos templates dia 1?

Hipóteses:

- **A:** 5-6 templates core (Marketing, Auth, Dashboard, Detail, Empty, Error)
- **B:** Todos os ~25 listados
- **C:** JIT — só quando feature pedir

**Recomendação preliminar:** A — 5-6 core dia 1. JIT pro resto.

### Q3 — Template é archetype-aware ou agnóstico?

Hipóteses:

- **A:** Template lê `useArchetype()` e adapta padding/spacing/motion
- **B:** Template é estrutura pura (regiões) — archetype só afeta components dentro
- **C:** Template aceita prop `archetype` opcional que override defaults

**Recomendação preliminar:** A — template archetype-aware permite layouts cinematicos vs compactos.

### Q4 — Templates customizáveis por tenant?

Hipóteses:

- **A:** Tenant escolhe entre templates pré-fabricados (LandingPage v1, v2, v3)
- **B:** Tenant não escolhe — archetype dita
- **C:** Tenant escolhe **conteúdo dos slots** apenas

**Recomendação preliminar:** C dia 1, A Fase 2.

### Q5 — PWA layouts: separados de web?

Hipóteses:

- **A:** Mesmo template com responsive (`md:` Tailwind)
- **B:** Templates separados (`AppShell` mobile-first ≠ `DashboardLayout` desktop-first)
- **C:** Detect via `display-mode: standalone` media query e adapta

**Recomendação preliminar:** B — AppShell mobile-first deserves dedicated template. Não bate com web dashboards.

### Q6 — Email + PDF templates: mesmo sistema?

Hipóteses:

- **A:** Componentes próprios via `@react-email` + `@react-pdf/renderer` — diferente do web
- **B:** Componentes shared (Heading/Text/Button) renderizados em web/email/pdf
- **C:** Per-medium templates separados (já decidido — pesquisa 25 usa @react-email)

**Recomendação preliminar:** C — emails e PDFs têm constraints próprias (table-based HTML, no JS). Templates dedicados.

### Q7 — Templates extraídos das 71 refs?

Pesquisa 28 pode extrair layouts canônicos. Exemplos:

- Stripe: MarketingLayout canon
- Linear: DashboardLayout canon
- Airbnb: ListingDetail mobile canon
- Notion: DocsLayout canon
- Vercel: DocsLayout + MarketingLayout

→ Pesquisa 28 mandate inclui extrair layouts não só components.

---

## Pendências

- [ ] Decidir Q1 (Next layout.tsx vs components/layouts)
- [ ] Decidir Q2 (quantos core dia 1)
- [ ] Decidir Q3 (archetype-aware ou puro estrutural)
- [ ] Decidir Q4 (tenant customization scope)
- [ ] Decidir Q5 (PWA layouts dedicated)
- [ ] Decidir D-15 — renomear nosso "template" perceptual pra `archetype` (resolve colisão de vocab)
- [ ] Pesquisa 28 — extrair layouts canônicos das 71 refs
- [ ] Consultar Atlassian Templates (eles têm catalog explícito)
- [ ] Consultar Carbon Page Templates
- [ ] Mapping template × archetype completar
- [ ] Decidir compound components vs Next parallel routes

# 04. Componentes — catálogo aberto + perguntas

> Status: catálogo WIP + perguntas abertas
> Última atualização: 2026-05-19
> Bloqueado por: pesquisa 28 (component catalog ampliado das 71 refs) + decisão hierarquia busca (`07-shadcn-hierarchy.md`)

---

## Princípio

**Não criar componente do zero antes de varrer a hierarquia.** Pesquisa 28 vai extrair das 71 DESIGN.md TODOS os componentes que aparecem + variantes per archetype + states + responsive behavior.

Por enquanto, este arquivo lista o que **sabemos que existe** + **perguntas em aberto**.

---

## Categorias de componentes (extraídas pesquisa 27 + observações user)

### 1. Navegação

| Componente             | Onde aparece                | Status                                        |
| ---------------------- | --------------------------- | --------------------------------------------- |
| **Top nav**            | Universal                   | shadcn não tem block padrão — Origin UI?      |
| **Full-top nav**       | Marketing pages premium     | Custom                                        |
| **Hamburger menu**     | Mobile universal            | shadcn `Sheet` cobre — variants per archetype |
| **Side nav / Sidebar** | Dashboards (Linear, Notion) | shadcn Sidebar block existe                   |
| **Bottom tab bar**     | Mobile apps (PWA)           | Não tem em shadcn — Origin UI? custom?        |
| **Search stick bar**   | Airbnb canon                | Custom — pesquisa 28                          |
| **Breadcrumb**         | Doc pages                   | shadcn `Breadcrumb` cobre                     |
| **Pagination**         | Lists                       | shadcn `Pagination` cobre                     |
| **Tabs**               | Universal                   | shadcn `Tabs` cobre                           |
| **Stepper**            | Onboarding/checkout         | Não tem em shadcn — custom                    |

### 2. Cards / Containers

| Componente              | Onde aparece                        | Status                                       |
| ----------------------- | ----------------------------------- | -------------------------------------------- |
| **Standard card**       | Universal                           | shadcn `Card` cobre — variants per archetype |
| **Feature card**        | Marketing                           | Variação de Card                             |
| **Magazine card**       | The Verge, editorial                | Custom — pesquisa 28                         |
| **Product card**        | Nike, e-commerce                    | Custom — pesquisa 28                         |
| **Model card**          | AI/ML showcases (Anthropic, OpenAI) | Custom — pesquisa 28                         |
| **Spec cells**          | Tesla configurador                  | Custom — pesquisa 28                         |
| **Pricing card**        | SaaS landing                        | shadcn block possível                        |
| **Testimonial card**    | Marketing                           | shadcn block possível                        |
| **Stat/Metric card**    | Dashboard                           | Custom — `Metric` typography primitive       |
| **Profile/Avatar card** | Social, listings                    | Variação de Card                             |
| **Empty state card**    | Universal                           | shadcn `Empty` existe                        |
| **Modal/Dialog**        | Universal                           | shadcn `Dialog` cobre                        |
| **Drawer**              | Mobile, dashboards                  | shadcn `Sheet` cobre                         |
| **Popover**             | Universal                           | shadcn `Popover` cobre                       |
| **Tooltip**             | Universal                           | shadcn `Tooltip` cobre                       |
| **Sheet (bottom)**      | Mobile/PWA                          | shadcn `Sheet` cobre                         |

### 3. Forms

| Componente           | Onde aparece       | Status                                 |
| -------------------- | ------------------ | -------------------------------------- |
| **Input text**       | Universal          | shadcn `Input` cobre                   |
| **Textarea**         | Universal          | shadcn `Textarea` cobre                |
| **Select**           | Universal          | shadcn `Select` cobre                  |
| **Combobox**         | Universal          | shadcn `Combobox` cobre                |
| **Multi-select**     | Universal          | Origin UI? shadcn não tem nativo       |
| **Date picker**      | Universal          | shadcn `Calendar` + `DatePicker` block |
| **Time picker**      | Apps de agenda     | Origin UI?                             |
| **Slider**           | Universal          | shadcn `Slider` cobre                  |
| **Toggle / Switch**  | Universal          | shadcn `Switch` cobre                  |
| **Checkbox**         | Universal          | shadcn `Checkbox` cobre                |
| **Radio**            | Universal          | shadcn `RadioGroup` cobre              |
| **File upload**      | Universal          | Custom — pesquisa 28                   |
| **OTP input**        | Auth flows         | shadcn `InputOTP` cobre                |
| **Color picker**     | Admin design tools | Kibo UI / Origin UI                    |
| **Rich text editor** | CMS, comments      | Plate.js (já mencionado pesquisa 26)   |

### 4. CTAs / Buttons

| Variante                         | Onde aparece                         | Status                                  |
| -------------------------------- | ------------------------------------ | --------------------------------------- |
| **Primary** (solid)              | Universal                            | shadcn `Button` cobre                   |
| **Secondary** (outline)          | Universal                            | shadcn `Button variant="outline"` cobre |
| **Ghost** (no background)        | Universal                            | shadcn `Button variant="ghost"` cobre   |
| **Link** (text-only)             | Universal                            | shadcn `Button variant="link"` cobre    |
| **Destructive** (red)            | Delete actions                       | shadcn `Button variant="destructive"`   |
| **Pill** (rounded-full)          | Soft-Productive, Bold-Energetic Nike | Variant via prop                        |
| **Icon button**                  | Universal                            | shadcn pattern (icon-only)              |
| **Icon circular**                | Linear, Vercel, Claude               | Custom variant                          |
| **Filter chip**                  | Listas filtradas                     | Custom — pesquisa 28                    |
| **Floating action button (FAB)** | Material/mobile                      | Custom                                  |

### 5. Feedback / Status

| Componente           | Onde aparece     | Status                          |
| -------------------- | ---------------- | ------------------------------- |
| **Toast / Snackbar** | Universal        | shadcn `Sonner` cobre           |
| **Alert banner**     | Universal        | shadcn `Alert` cobre            |
| **Badge**            | Universal        | shadcn `Badge` cobre            |
| **Progress bar**     | Universal        | shadcn `Progress` cobre         |
| **Spinner**          | Universal        | shadcn pattern                  |
| **Skeleton loader**  | Universal        | shadcn `Skeleton` cobre         |
| **Shimmer**          | Premium (Vercel) | Custom                          |
| **Empty state**      | Universal        | shadcn `Empty` cobre            |
| **Error state**      | Universal        | Custom — variants per archetype |

### 6. Especiais / Premium

| Componente                 | Onde aparece          | Status                              |
| -------------------------- | --------------------- | ----------------------------------- |
| **Chatbot launcher**       | SaaS 2026 emergente   | Custom — pesquisa 28                |
| **Configurator**           | Tesla canon           | Custom — pesquisa 28                |
| **Cookie consent banner**  | LGPD/GDPR             | CookieConsent v3.1.0+ (pesquisa 24) |
| **Cookie consent spacing** | LGPD/GDPR             | Padding/positioning per archetype   |
| **Sticky search bar**      | Airbnb mobile         | Custom — pesquisa 28                |
| **Hairlines / dividers**   | Universal             | shadcn `Separator` cobre            |
| **Store grid card**        | E-commerce            | Custom                              |
| **Category tabs**          | Listings              | Variação de Tabs                    |
| **Brand accent strip**     | Tesla canon           | Custom                              |
| **Product title**          | E-commerce            | Typography primitive                |
| **Press feedback animado** | Nike `scale(0.5)`     | Per-archetype                       |
| **Stacked sticky CTA**     | Airbnb mobile listing | Custom                              |
| **Search orb pill**        | Airbnb 64px           | Custom variant                      |

### 7. Layout

| Componente           | Onde aparece    | Status                  |
| -------------------- | --------------- | ----------------------- |
| **Container**        | Universal       | `app-container` wrapper |
| **Section**          | Marketing pages | Wrapper                 |
| **Grid**             | Universal       | Tailwind utilities      |
| **Stack** (flex y)   | Universal       | Custom wrapper          |
| **Cluster** (flex x) | Tag lists       | Custom wrapper          |
| **Hero block**       | Marketing       | shadcn block existe     |
| **Feature grid**     | Marketing       | shadcn block existe     |
| **Footer**           | Universal       | shadcn block existe     |
| **Navbar shell**     | Universal       | shadcn block            |

---

## Perguntas em aberto

### Q1 — Quantos componentes "premium" não cobertos por shadcn?

Olhando categoria 6 acima, ~10+ componentes não-cobertos. Cada um precisa ir pra `07-shadcn-hierarchy.md` ser mapeado:

- shadcn blocks tem? não → próximo
- shadcn-friendly libs (Origin UI, Aceternity, Kibo, Reui) cobrem? → tentar
- headless agnostic (Radix, Base UI, React Aria) cobre primitivo? → wrap
- Construir do zero → último recurso

### Q2 — Mobile vs desktop: mesmos componentes com responsive ou componentes separados?

Frequentemente nas refs:

- Nike hero: 16:9 desktop → 4:5 mobile (art-direction crop)
- Airbnb listing: card normal → sticky bottom bar com reservation CTA
- Sidebar Linear: visible → Sheet drawer
- Top nav Vercel: 6 links → hamburger 768px

Hipóteses:

- **A:** mesmo componente com responsive props (`md:flex-row md:gap-4`)
- **B:** componentes diferentes (`<DesktopNav />` + `<MobileNav />`) escolhidos via `useMediaQuery`
- **C:** componente "shell" que delega pra child variants

shadcn frequentemente A. Marcas premium frequentemente B (mais controle). Decidir depende da complexidade do componente.

### Q3 — Variants por archetype: prop ou wrapper separado?

Exemplo Button:

- **Prop:** `<Button variant="primary" template={template} />` — 1 componente que lê variant + template
- **Wrapper:** `<EditorialButton />`, `<NikeButton />` — 5 wrappers separados

Trade-off:

- Prop: 1 component, mais lógica interna, easier maintain
- Wrapper: 5 components, menos lógica cada, easier override quirks

Atual ADR-0040: `AppButton` 1 wrapper. Provavelmente prop wins por enquanto.

### Q4 — Quantas variants por componente é "completo"?

Pesquisa 27 sample Button:

- shadcn padrão: 5 variants (default, destructive, outline, ghost, link)
- Nike: primary pill, secondary pill, outline-on-image pill, icon-circular, filter-chip = 5
- Vercel: primary black, secondary white, tab-ghost, icon-circular = 4
- Airbnb: primary Rausch 8px, secondary white 8px, tertiary text, pill-rausch, search-orb, icon-circle, icon-outline = 7
- Stripe: primary indigo pill, secondary outline, on-dark = 3

**Diversidade alta.** Decisão: catalogar TODAS variants encontradas → componente unificado consegue tudo? Ou variants diferentes por archetype?

### Q5 — Componentes que shadcn não tem nada equivalente

Lista (subset da categoria 6):

- Chatbot launcher
- Configurator multi-step (Tesla)
- Sticky bottom CTA bar mobile (Airbnb)
- Press feedback animado (Nike scale)
- Search orb pill (Airbnb 64px)
- Magazine card (The Verge color blocks)
- Brand accent strip
- Filter chip row

**Hipótese:** maioria cabe em Origin UI / Aceternity / Magic UI / Kibo. Mapear em `07-shadcn-hierarchy.md`.

### Q6 — Density variants (button-sm/md/lg) é archetype ou componente?

Pesquisa 27: Stripe usa density via component size (button-sm/md/lg). Mas isso é prop `size`, não density de sistema.

Decisão: **`size` prop em todos componentes** (sm/md/lg/xl) — não é density de template.

### Q7 — Componentes archetype-specific necessários?

Alguns componentes só fazem sentido em 1-2 archetypes:

- **Code block** (Minimal-Mono dev tools) — outros archetypes não precisam
- **Editorial drop cap** (Editorial-Serif long-form) — outros não
- **Hero metric ticker** (Bold-Energetic dashboards) — outros não
- **Soft photo gallery** (Warm-Wellness) — outros usam grid normal

Decisão: lazy-load por archetype. `lib/components/<archetype>/*.tsx` carrega só quando ativo.

### Q8 — Componentes em multi-tenant white-label: tenant pode customizar?

Hipóteses:

- **A:** tenant escolhe template + palette, componentes herdam variants — sem customização granular
- **B:** tenant pode override variants individuais via admin (e.g. "quero button radius 0 mesmo no Soft-Productive")
- **C:** advanced tenants editam tokens individuais (volta a paralisia decision)

Recomendado: **A** dia 1. **B** Fase 2 quando demanda real surgir. **C** nunca (vira CMS de tema completo).

---

## Mapeamento componente × shadcn × libs friendly × custom

**A criar em `07-shadcn-hierarchy.md`** após pesquisa 28 voltar. Estrutura:

```
| Componente | shadcn block | shadcn primitive | Origin UI | Aceternity | Kibo | custom needed? |
| ---------- | ------------ | ---------------- | --------- | ---------- | ---- | -------------- |
| Top nav    | ✅ (marketing) | ❌            | ✅       | ❌         | ❌  | wrapper only   |
```

---

## Pendências

- [ ] Pesquisa 28 — varrer 71 DESIGN.md componente-by-componente (extração granular)
- [ ] Mapping componente × hierarquia em `07-shadcn-hierarchy.md`
- [ ] Decidir Q2 (responsive vs separate components)
- [ ] Decidir Q3 (prop vs wrapper per archetype)
- [ ] Decidir Q4 (catalog completo de variants)
- [ ] Identificar componentes archetype-specific lazy-load
- [ ] Decidir Q8 customização tenant

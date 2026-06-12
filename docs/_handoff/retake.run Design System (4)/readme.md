# retake.run — Design System

> **Infraestrutura para comunidades que movem pessoas.**
> RUN · EAT · RECOVERY · REPEAT.

retake.run is a **vertical, running-first operating system** for the people and
organizations that build running communities in Brazil (and, later, beyond):
assessorias, run clubs, coaches, gyms-with-running. It is a multi-tenant SaaS
where each tenant runs their athletes, training, schedule, billing, content,
events, store, and community from one place — with a single native athlete app
(retake.run, not white-labelled) on the other side.

The product is **running-vertical, not horizontal**: everything orbits the sport.
Its moat is the **structured-training core** (periodization → structured workouts →
prescribed-vs-executed loop → reusable library), wrapped in an AI "vibe" layer
where coaches edit their public site by chat, and a marketplace/sponsorship layer
that digitizes relationships that already exist offline.

## Who this serves
- **Tenants** (paying): assessoria, run club, autonomous coach, gym, online coach.
- **People inside a tenant**: owner/admin, coach, finance, reception, marketing, athlete, lead.
- **Suppliers & sponsors** (non-paying, transactional): apparel, nutrition brands,
  distributors, service providers, event organizers, brand sponsors.
- **The platform** (admin retake.run): governs tenants, suppliers, billing, catalog.

## Product surfaces in this system
1. **Coach Dashboard (web)** — the tenant operator's command center: athletes,
   training, schedule, finance, community, events, marketplace. Cream canvas,
   graphite ink, terracotta action. *(see `ui_kits/dashboard/`)*
2. **Athlete App (mobile)** — the single native retake app: workout of the day,
   execute & log, history, push, chat with coach, events, store. *(see `ui_kits/athlete-app/`)*

---

## Sources & provenance
This system was reverse-engineered from the materials provided by the client:
- **Brand board** (master reference): `uploads/ChatGPT Image 9 de jun. de 2026, 05_45_38.png`
  — a complete identity sheet covering logo, palette, type, tokens, iconography,
  graphic elements, photography direction, interface mocks, and co-branding.
- **Primary logo (vector)**: `uploads/image.svg` — full RETAKE lockup (track mark
  + wordmark, terracotta top bar on the final "E"). Extracted into `assets/`.
- **Product scope document** ("Mapa Completo do Produto") — the 25-section spec
  that defines the party model, training core, marketplace, stack, and roadmap.
- `uploads/retake_logo_embedded.svg` was **empty/broken** (no embedded image data)
  and was not used.

> ⚠️ **Fonts are substituted.** The licensed brand faces are **Druk Condensed**
> (display) and **Neue Haas Grotesk** (body). This system ships free Google Fonts
> stand-ins — **Oswald** (display) and **Hanken Grotesk** (body) — chosen for the
> closest athletic-condensed / neutral-grotesque feel. Swap in the licensed faces
> for production. **Please send the licensed font files to make this pixel-exact.**

> ⚠️ **Photography is low-res.** `assets/photo-run-banner.png` is cropped from the
> brand board and is a *mood reference only*. Send full-resolution photography
> (golden-hour Rio running, community, recovery) for real use.

---

## CONTENT FUNDAMENTALS

**Language.** Portuguese (Brazil) is the primary product language. Copy is direct,
confident, and athletic — never corporate-soft.

**Voice.** Coach-like: motivating but precise. It speaks the language of training
(pace, limiar, PSE, microciclo) without dumbing it down. Short, declarative,
imperative. Verbs do the work: *Iniciar treino. Registrar. Ajustar.*

**The signature cadence.** `RUN. EAT. RECOVERY. REPEAT.` — four words, hard stops,
each a phase of the cycle. This staccato, period-separated rhythm is the brand's
core copy device. Reuse it: `Treina. Mede. Evolui.` / `Capta. Treina. Retém.`

**Casing.**
- **Headlines & labels → UPPERCASE**, condensed display type, tight. (`DESEMPENHO`,
  `TREINO DO DIA`, `VISÃO GERAL`.)
- **Body & UI copy → sentence case.** Never title-case sentences.
- **Eyebrows / overlines → UPPERCASE** with wide tracking, small, muted.

**Person.** Product UI addresses the user implicitly via action labels
(*Iniciar treino*) rather than "you/your". Marketing speaks to the community
("comunidades que movem pessoas") — collective, not individual.

**Numbers & data.** Metrics are first-class and shown in **mono, tabular** (pace
`3:45–4:00 /km`, distance `10×800m`, `RS 128.650`). Units always lowercase and
spaced (`15 min`, `48,7 km`). Brazilian decimal comma (`48,7`), currency `R$`.

**Emoji.** **Not used.** The brand expresses energy through type, color, and the
track motif — never emoji.

**Examples from the brand:**
- *"Infraestrutura para comunidades que movem pessoas."* (MOVEM in terracotta.)
- *"A pista representa o ciclo contínuo de evolução, conexão e constância."*
- App: *"Treino do dia"*, *"Ritmo alvo 10×800m"*, *"Iniciar treino"*.
- Concept words: RUN = Treino / Performance / Desafio · EAT = Nutrição / Energia /
  Combustível · RECOVERY = Recuperação / Equilíbrio / Bem-estar · REPEAT =
  Constância / Disciplina / Evolução.

---

## VISUAL FOUNDATIONS

**The big idea.** A running **track** (oval, concentric lanes) is the brand's
organizing form. It signals the continuous cycle — never stopping, always lapping.
The stadium/pill shape recurs in buttons, tags, progress, and graphic elements.

**Color.** Graphite-led and warm. **Graphite `#1D1D1B`** is the dominant ink
(~60%), **Creme `#F1ECE2`** is the primary surface (~25%), **Terracotta `#D96C3A`**
is the *single* energetic accent (~10%) reserved for action, emphasis, and the RUN
phase. **Azul Oceano `#7FABB5`** is a calm support (recovery, secondary data) and
**Cinza Mineral `#8A8A84`** handles muted detail (~5%). The palette is warm and
earthy — there are no cold blues beyond the muted ocean tone, no neon, no
purple/blue gradients. Semantic states (green/amber/red) are pulled toward the
same warm, slightly desaturated temperature so they never feel like default web UI.

**Type.** Two voices. **Display = Oswald** (sub for Druk Condensed): heavy,
condensed, set UPPERCASE with tight tracking for headlines and labels — it carries
all the energy. **Body = Hanken Grotesk** (sub for Neue Haas Grotesk): neutral,
quiet, highly legible, sentence case. **Mono = Space Mono** for all metrics, paces,
splits, and codes. The display/body contrast (condensed-loud vs neutral-calm) is
the typographic system; don't blur it.

**Spacing.** Strict **8pt grid** (8/16/24/32/40/48/64/80/96). Generous whitespace
on cream; data-dense but never cramped in app surfaces.

**Backgrounds.** Mostly flat **cream** or flat **graphite** — *no gradients* as
décor. Dark sections (footers, hero blocks, the app's metric headers) sit on solid
graphite. Texture, when present, comes from the **graphic elements**: dot grids,
diagonal hatch lines, and partial track arcs/curves — used sparingly as accents,
never as full-bleed wallpaper. Photography is used full-bleed in marketing
contexts (warm golden-hour running, Rio coastline, community).

**Imagery vibe.** Authentic, energetic, communal, natural, inspiring. Warm golden
light, real runners, real places (Rio beachfront). Never stocky or cold. Black &
white is acceptable for editorial/recovery moments.

**Corner radii.** Modest and consistent: `2/4/8/12/16/24`. Cards use `12–16`.
The **pill / stadium** radius (`999px`) is reserved for track-flavored elements:
primary buttons, tags, chips, progress tracks, avatars groups.

**Cards.** Cream-50 surface on the cream page, hairline `--border-soft` border,
soft warm shadow (`--shadow-100`/`200`) — *not* heavy. Corners `12–16px`. On dark
sections, cards become graphite-800 with a faint `--border-on-dark` line and no
shadow.

**Borders.** Hairlines are warm (`--creme-200/300`), not grey #ddd. Widths
`1/2/3px`. The graphite outline (2px) is a deliberate "drawn" treatment echoing the
track lanes — used on secondary buttons and the symbol itself.

**Shadows.** Three soft, warm-tinted steps (`S100/S200/S300`) built on graphite
alpha, never pure black. Elevation is gentle; the brand prefers crisp borders over
heavy float. Inset shadow exists for wells/grooves (the "track groove").

**Buttons.**
- *Primário* — solid terracotta, cream label, pill or `8px` radius, often with a
  trailing arrow `→`.
- *Secundário* — transparent with a graphite 1–2px outline, graphite label.
- *Texto* — label only, terracotta, used inline.

**Hover / press.** Hover = a step darker on fills (`--terracota-600`), or a subtle
warm tint on ghost elements; never opacity-only fades on primary actions. Press =
darker + a tiny scale-down (`scale(0.98)`). Transitions are quick and decisive
(`120–200ms`, `--ease-out`) — athletic, no bounce, no long fades. Decorative
infinite loops are avoided.

**Transparency & blur.** Used sparingly — sticky headers may use a slight cream
blur; overlays use a graphite scrim. No glassmorphism as a style.

**Layout rules.** Dashboard = fixed left sidebar (graphite or cream) + scrolling
content on cream. App = fixed top metric area + scrollable list + fixed bottom
action. Content max-width ~1200px on web.

---

## ICONOGRAPHY

The brand board (§09) shows a **single-weight line icon set** — clean, geometric,
~1.5–2px stroke, rounded joins, no fill, on a square grid. Concepts illustrated:
profissionais, alunos, run clubs, treinos, eventos, relatórios, financeiro,
pagamentos, marketplace, produtos, serviços, comunidade.

No proprietary icon font or sprite was provided in the materials. This system
therefore standardizes on **[Lucide](https://lucide.dev)** (loaded from CDN) as the
closest match to the brand's drawn line style — consistent 2px stroke, rounded
caps/joins, geometric construction. **This is a substitution; flag it.** If the
client has the original icon set, drop the SVGs into `assets/icons/` and they will
take precedence.

Mapping guide (brand concept → Lucide name):
`profissionais → users` · `alunos → user` · `run clubs → users-round` ·
`treinos → activity` · `eventos → calendar` · `relatórios → bar-chart-3` ·
`financeiro → wallet` · `pagamentos → credit-card` · `marketplace → store` ·
`produtos → package` · `serviços → badge-check` · `comunidade → message-circle`.

**Graphic elements** (not icons) — dot grids, diagonal hatch, and partial track
arcs — are brand décor; recreate with CSS, not icon assets. **Emoji and unicode
dingbats are never used as icons.**

The **logo mark** (the oval track) is not an icon — keep it for brand signature,
favicon, and loading states only.

---

## INDEX — what's in this system

**Entry point**
- `styles.css` — link this one file; it `@import`s every token + font file below.

**Tokens** (`tokens/`)
- `fonts.css` — webfont imports (Oswald, Hanken Grotesk, Space Mono) + substitution notes
- `colors.css` — palette, tints/shades, semantic surface/text roles, the RUN·EAT·RECOVERY·REPEAT cycle
- `typography.css` — display / body / mono scales, weights, tracking
- `effects.css` — 8pt spacing, radii, borders, shadows, motion, layout
- `base.css` — light element defaults mapping raw tags → tokens

**Foundation cards** (`guidelines/`) — specimens shown in the Design System tab
- Colors: `colors-primary`, `colors-support`, `colors-tints`, `colors-semantic`, `colors-cycle`
- Type: `type-display`, `type-body`, `type-mono`, `type-eyebrow`
- Spacing: `spacing-scale`, `radii`, `shadows`, `borders`
- Brand: `logo-lockup`, `logo-mark`, `graphic-elements`, `photography`

**Components** (`components/`) — React primitives (namespace `RetakeRunDesignSystem_1be28c`)
- `core/` — `Button`, `Badge`, `Card`, `Avatar`, `Input`, `Switch`, `Tabs`
- `running/` — `StatCard`, `ComplianceTag` (the prescribed-vs-executed signal)
- Each has `<Name>.jsx` + `<Name>.d.ts` + `<Name>.prompt.md`; showcase HTML per directory.
- Starting points: `Button` (Core), `StatCard` (Running).

**UI kits** (`ui_kits/`) — full-screen product recreations
- `dashboard/` — Coach Dashboard (web): Overview, Meu site (site config + vibe-coding AI panel with approval gate), Captação (CRM kanban/lista), Athletes, Training (prescribed vs executed), Finance, Comissões (3-way split earnings from the club store), Events, Marketplace (sourcing), Products + AI suggestion
- `athlete-app/` — Athlete App (mobile, in an iOS frame): Treino do dia, Desempenho, Comunidade, Loja with checkout flow showing the 3-way split (supplier/club/retake) and order confirmation, tab bar
- `tenant-site/` — free assessoria site template ("Grátis" tier, at `retake.run/seuclube`): one fixed composition themed per tenant via `--t-*` tokens (simulating `tenant_themes`); fixed brand marquee (network sponsors + retake logo always visible); sponsor bar + clube de vantagens; capture form; `onboarding.html` is the 4-step self-service wizard that publishes to the template via localStorage (`rt-tenant-custom`)
- `sponsor-panel/` — sponsor's own panel: coupon registration (with retake approval), marquee impressions / clicks / coupon uses / attributed sales + network commission, per-site breakdown, subscription card
- `supplier-panel/` — B2B supplier panel: orders arriving via webhook (accept → ship → delivered flow), per-order 3-way split breakdown, gateway sub-account KYC status, ERP integrations (em breve); tabs add catalog editor, vitrine profile, financeiro/repasses
- `admin/` — **retake staff console** (dark internal shell): network overview KPIs, tenants governance, approval queues (sponsors/coupons + suppliers KYC), **event moderation** (queue, claims, anti-fake, link whitelist), faixa-de-marcas media inventory, network billing, quality & abuse (idle sites, reports, free-tier verification)
- `organizer-panel/` — event organizer: own events list → detail with lotes, inscritos, day-of check-in; claim-an-event flow with CNPJ verification
- `auth/` — entry flow shared by all entities: login, account-type chooser, tenant onboarding (plan → account → payment → done) + role redirects
- Dashboard now also ships: **Comunidade** (mural, avisos, ranking/desafios), **Configurações** (equipe & permissões, assinatura, gateway), **Agenda** (sessões + check-in), athlete **detail** drill-in, and **structured Training** (periodization, workout library, compliance)
- Athlete app now also ships: **Perfil** (PRs, subscription, history, chat with coach, notifications, anamnese, re-onboarding) and **guided execution** (step-by-step workout + PSE)

**Docs** (`docs/`)
- `modelo-de-produto.md` — product-model PRD notes: free vs paid site ladder, where site content lives (cadastro → projection), coupon-affiliate mechanics (3 attribution phases), open gaps
- `landing/` — Marketing site (static HTML): `index.html` (landing + free-tier banner), `corredores.html` (runner hub: assessoria directory with city/focus/PRO filters + brands & coupons with featured-first sorting, with/without-coupon states, sidebar scrollspy), `empresas.html` (business hub: 3 partner tiers summary + B2B supplier directory with category sidebar), `patrocinio.html` (tier detail + comparison matrix + cadastro), `plataforma.html` (coming-soon teaser)
- `_shared/retake-ui.jsx` — self-contained mirror of the primitives so kits render & port standalone

**Assets** (`assets/`)
- `logo-full.svg` / `logo-full-cream.svg` — primary lockup (graphite / cream knockout)
- `logo-mark.png` / `logo-mark-cream.png` — the track mark (graphite / cream)
- `photo-run-banner.png` — golden-hour Rio running mood banner (low-res, replace)
- `landing/` — hero + community photos cropped from the client's landing mock (low-res, replace with originals)

> **Note on the bundle.** `_ds_bundle.js`, `_ds_manifest.json`, and the adherence
> config are generated by the compiler — never edit them. Component showcase cards
> load `_ds_bundle.js` and read `window.RetakeRunDesignSystem_1be28c`; the UI kits
> deliberately use the local `_shared/retake-ui.jsx` copy so they preview and export
> as standalone HTML.


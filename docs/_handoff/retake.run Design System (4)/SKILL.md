---
name: retake-design
description: Use this skill to generate well-branded interfaces and assets for retake.run, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the running-vertical SaaS (coach dashboard + athlete app).
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

retake.run is a running-first, multi-tenant operating system for assessorias, run
clubs, and coaches in Brazil. The brand is graphite-led and warm, with terracotta as
the single energetic accent, a running-track logomark, condensed UPPERCASE display
type, and the cadence **RUN · EAT · RECOVERY · REPEAT**.

**Key files**
- `readme.md` — full brand guide: product context, CONTENT FUNDAMENTALS, VISUAL
  FOUNDATIONS, ICONOGRAPHY, and an INDEX of everything.
- `styles.css` — the single CSS entry point (link it; it imports all tokens + fonts).
- `tokens/` — colors, typography, spacing/effects, fonts.
- `components/` — React primitives (`Button`, `Badge`, `Card`, `Avatar`, `Input`,
  `Switch`, `Tabs`, `StatCard`, `ComplianceTag`).
- `ui_kits/` — full product recreations (coach dashboard, athlete app). The
  `_shared/retake-ui.jsx` file is a self-contained copy of the primitives.
- `assets/` — logos (`logo-full.svg`, `logo-mark.png` + cream variants) and imagery.

**How to build**
- If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out
  and create static HTML files for the user to view. For HTML/JSX, link `styles.css`
  for tokens and reuse `ui_kits/_shared/retake-ui.jsx` for ready-made components.
- If working in production code, read the rules here and reuse the token CSS +
  component contracts to become an expert in designing with this brand.
- Icons: use Lucide (CDN) with 2px stroke — see the ICONOGRAPHY mapping in `readme.md`.

**Substitutions to flag** (the brand's licensed faces are not bundled):
- Display **Druk Condensed** → Oswald · Body **Neue Haas Grotesk** → Hanken Grotesk.
- Photography in `assets/` is low-res; ask the user for originals.

If the user invokes this skill without other guidance, ask them what they want to
build or design, ask a few focused questions, and act as an expert designer who
outputs HTML artifacts _or_ production code, depending on the need.

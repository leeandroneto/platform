---
name: Storyboard v2 requirements
description: Detailed visual requirements for ProductShowcase storyboard based on Framer.com comparison
type: feedback
originSessionId: 9359a008-74fd-42fa-8538-8fc77d290708
---

Storyboard must match Framer.com pattern exactly, not simplified tabs or basic crossfade.

**Why:** User compared side-by-side (comparacao-1.png, comparacao-2.png) and the current implementation looks amateur vs Framer's polished execution.

**How to apply:**

Title:

- Left-aligned only, not centered
- Much larger font, breaks into multiple lines
- More spacing from storyboard below
- Scrolls away as user scrolls, leaving only sidebar + mockups

Sidebar:

- Larger font than current
- Names of products with active description expanding

Mockups:

- ALL desktop format (including Hub — Hub gets phone overlay on bottom-left corner)
- Overflow right edge of viewport (only fully visible on ultrawide 3440px)
- Pre-loaded and stacked vertically (all rendered from start)
- As scroll progresses, mockups move up naturally
- Active mockup has zoom-in effect and is crisper/larger, others are slightly smaller/faded
- Transition is gradual with scroll, not snapped
- Mockups start auto-scrolling (showcase mode) only when it's their turn
- Dashboard mockup should show expanded nav sidebar

5 products in storyboard (not 4):

- Hub (desktop + phone overlay)
- Avaliação (wizard)
- Relatório (report — NEW)
- Site (premium landing)
- Painel (dashboard with sidebar)

Hero section:

- Remove the report iframe mockup
- Replace with dual horizontal auto-scrolling rows (opposite directions)
- Cards of various product screenshots (desktop and mobile)
- Same height, different widths
- Some auto-scroll down (site, results pages)
- Marquee-style continuous motion

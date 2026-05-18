---
name: Live mockups, not static
description: User wants live mockups using real product components, not screenshots or static copies — so product changes auto-update marketing pages
type: feedback
originSessionId: 23d550d6-ba83-4577-b24d-c3cad5345845
---

Always use real product components for marketing mockups (landing, product pages). Pass mock data + controlled state instead of real Supabase data. Never use screenshots or static copies.

**Why:** If the product changes after creating mocks, static copies become outdated and need manual updating. Live components auto-update.

**How to apply:** When creating demo/preview components (HubPreviewDemo, WizardFlowDemo, etc.), import the same visual components the product uses. Only change the data source (mock data) and state control (auto-play instead of user interaction).

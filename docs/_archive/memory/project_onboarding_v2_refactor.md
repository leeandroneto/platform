---
name: Onboarding Pro v2 Refactor
description: Complete onboarding rewrite — cinematic step-by-step flow, EFI Bank inline checkout (card + PIX), unified design templates, mobile-first
type: project
originSessionId: a45ca312-1346-4919-bcdf-a687425ad99d
---

Full rewrite of professional onboarding after signup. All current onboarding screens will be deleted and rebuilt from zero.

**Why:** Current onboarding is a generic multi-field form that contradicts the product's premium positioning. Research shows step-by-step flows convert 271% better.

**How to apply:**

- Launch plan: `docs/plano/PLANO_LANCAMENTO.md` (master plan, 11 phases)
- Onboarding research: `docs/produto/onboarding/00-PESQUISA-E-DECISOES.md`
- Checkout research: `docs/produto/checkout/pesquisa.md`
- Audit findings: `docs/plano/FINDINGS-AUDITORIA.md`
- Previous docs in `docs/archive/` are superseded — don't use for execution
- Stack: Motion 12 (not framer-motion), Zustand for state, Supabase draft persistence
- Checkout: EFI Bank inline (cartão com tokenização client-side + PIX Automático). Tab Cartão/PIX. Dados de cartão nunca tocam nosso servidor.
- Visual templates: unifying palette + typography into ~6 curated templates (may not be shown in onboarding)
- Only one modality exists (musculação) — no modality selector
- Slug only after payment confirmed
- Mobile-first, SOLID separation, minimal data collection per step

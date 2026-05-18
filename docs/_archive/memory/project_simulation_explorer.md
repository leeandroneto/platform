---
name: Simulation Explorer status
description: Estado da feature Simulation Explorer do onboarding — implementação em progresso, problemas conhecidos para resolver na próxima conversa
type: project
originSessionId: 8ca1dfed-6460-42c4-832d-a63fc8e5bc30
---

## Simulation Explorer — Estado em 2026-04-23

Feature que mostra os 3 produtos (Site, Formulário, Relatório) ao PT durante o onboarding antes do pricing.

### O que foi implementado

- Edge Function `generate-site-content` (Claude Sonnet 4, deployed)
- 11 componentes novos em `_steps/_simulation/` + `_components/Spotlight.tsx`
- SiteLoading (loading cinematográfico enquanto IA gera copy)
- SimulationExplorer (orchestrator full-screen com tabs)
- Rota `/onboarding/site-preview` (renderiza PremiumLanding real pra iframe)
- SiteTab usa iframe pra `/onboarding/site-preview` (live preview real)
- Progressive tab unlock (scroll site → formulário, complete wizard → relatório)
- Step persistence no banco (`professionals.onboarding_step`)

### Problemas conhecidos (próxima conversa)

1. **Tabs do SimulationExplorer podem não estar visíveis** — o `fixed inset-0 z-50` foi implementado mas não testado no browser após restart do dev server. Pode ser conflito de z-index com PremiumNav do iframe
2. **Click interception no iframe** precisa de teste — `contentDocument.addEventListener` funciona em same-origin mas precisa validar
3. **Scroll detection no iframe** — `contentWindow.addEventListener('scroll')` precisa de teste
4. **Dead code**: `WizardPreview.tsx`, `ReportPreview.tsx`, `ReportLoading.tsx` — não importados mais, podem ser deletados
5. **`onboarding_step` valores legados** ("identity", "signup") — fallback é step 0, aceitável
6. **`loadSitePreviewAction`** em actions.ts pode ser removida (SiteTab agora usa iframe, não action)

### Step sequence atual

```
checkpoint-3 → transition → site-loading → simulation-explorer → pricing-bridge → pricing → checkout → celebration
```

### Decisão: iframe vs componente direto

- **Why:** iframe garante live preview idêntico à rota pública, sem duplicação de lógica
- **How to apply:** qualquer mudança no PremiumLanding reflete automaticamente no preview

---
name: Pós-pagamento — escopo e fronteiras
description: Esta conversa trata exclusivamente do pós-pagamento (Guided Setup + Momento Mágico + Checklist). Onboarding é outra conversa, Wizard Builder é outra futura.
type: project
originSessionId: d5862643-fa70-4ce5-b9eb-c3db0062223e
---

O trabalho está dividido em 3 conversas sequenciais:

1. **Onboarding (Fase 4)** — outra conversa, em andamento. Vai do signup até o pagamento + slug + publish.
2. **Pós-pagamento (esta conversa)** — o intervalo entre pagamento e wizard builder. Guided Setup (3 telas IA: profiling, tom, ajustes) + Momento Mágico (preview template + compartilhar link) + Checklist de ativação no dashboard.
3. **Wizard Builder (Tier 2.5)** — conversa futura. Personalização profunda do formulário de análise com IA.

**Why:** o fundador quer foco sequencial, sem misturar implementações. Cada conversa tem escopo fechado.

**How to apply:** nesta conversa, não tocar em código do onboarding nem planejar detalhes do wizard builder. O pós-pagamento começa onde o onboarding termina (profissional com status active, slug claimado, subscription ativa) e entrega o profissional no dashboard com customization JSONB preenchido e link compartilhável.

Decisões confirmadas (2026-04-22):

- Guided Setup: obrigatório antes do dashboard (link "Pular" após 3s)
- Preview: narrativa template (não IA real)
- Wizard Builder: item do checklist no dashboard (não tela do setup)
- Checklist: dismissível após 2/4 items completos

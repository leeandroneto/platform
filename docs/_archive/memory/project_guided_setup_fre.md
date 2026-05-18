---
name: Guided Setup (First-Run Experience) with AI
description: Post-payment AI-guided setup that builds the PT's wizard, tone, and product configuration through conversational questions
type: project
originSessionId: 56a22c22-8a9f-4fc4-b30a-c2d6dc686ba9
---

Post-payment flow ("First-Run Experience" / "Guided Setup") uses AI to configure the product through detailed questions:

1. **Nicho**: atletas, fisiculturismo, idosos, grávidas, pós-parto, reabilitação, etc.
2. **Foco**: emagrecimento, hipertrofia, saúde, performance, etc.
3. **Alimentação**: cuido / apenas dicas / não cuido (nutritionLevel)
4. **Tom**: empático, direto, técnico, motivacional (aiConfig.tone)
5. **Perguntas do wizard**: IA sugere perguntas e opções específicas para o nicho → PT seleciona/edita → vira customization do wizard builder

**Resultado**: ao terminar o Guided Setup, o produto está pronto e personalizado. Dashboard não começa vazio.

**Why:** Time-to-value perto de zero. PT não precisa entender configurações — a IA faz as perguntas certas e monta tudo. Diferencial competitivo.

**How to apply:** Implementar como Fase 5 (pós-pagamento). Usa Haiku para sugerir perguntas/opções baseado no nicho. Salva em professional_modalities.customization. O wizard builder (Tier 2.5) vira apenas editor do que o Guided Setup já criou.

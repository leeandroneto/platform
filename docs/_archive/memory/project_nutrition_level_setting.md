---
name: Nutrition involvement level setting
description: Dashboard setting for how much the professional handles nutrition — affects AI report pillars and tone
type: project
originSessionId: 56a22c22-8a9f-4fc4-b30a-c2d6dc686ba9
---

Professional should choose their nutrition involvement level in dashboard settings:

- "Cuido da alimentação" — full nutrition pillar with macros and meal structure
- "Apenas dicas durante o treino" — light nutrition mentions, focus on training
- "Não cuido de alimentação" — omit nutrition pillar entirely, replace with another relevant topic

**Why:** Not all personal trainers handle nutrition. Some focus only on training. The report should reflect what the professional actually offers — otherwise it sets wrong expectations with the lead.

**How to apply:** Store in `professional_modalities.customization` as `nutritionLevel: 'full' | 'tips' | 'none'`. Pass to AI via `aiConfig`. The prompt should adapt pillar content based on this setting. Default: 'full' (backward compatible). Implement in Fase 5 (Dashboard settings).

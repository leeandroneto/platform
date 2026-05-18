---
name: Goal field redesign decisions
description: D1-D4 decisions on goal field, macro calculations, journey section, and prompt importance
type: project
originSessionId: 56a22c22-8a9f-4fc4-b30a-c2d6dc686ba9
---

Decisions made 2026-04-22:

**D1 — Goal field**: Remove target weight from StepPhysical. Move to LAST step of wizard (replace existing Q7 label). Layout: numeric weight goal field + checkbox "Não me importo com números" (hides the field) + textarea below for qualitative goal ("Qual é sua meta? Fale o que já fez e onde quer chegar").

**D2 — Macro calculations**: Engine stays deterministic (calculates baseline). Haiku CONTEXTUALIZES based on situation. If user mentions disease, limitations, hormones etc, Haiku adds a caveat like "pelos cálculos para uma pessoa com seus dados a sugestão geral é de X calorias, porém com o seu caso médico/clínico/hormonal geralmente há uma diferença XYZ". Never overrides the numbers — adds context.

**D3 — Journey section**: Answered by D1. Numeric weight goal is optional (checkbox to skip). When present, shows cards + timeline. When absent, section adapts.

**D4 — Prompt importance**: personal_note (goal textarea) is importance 5. Do NOT hardcode importance for motivation/difficulty since the professional can remove or change those questions in the future (wizard builder). All questions from template get base importance 2, only personal_note gets elevated.

**How to apply:** Implement in order: wizard UI change → prompt update → deploy. This affects StepPhysical, the last wizard step, build-user-message, and the system prompt.

---
name: Wizard → Journey rename pendente
description: Rename de "wizard" para "journey" no código e docs está planejado para antes do deploy em produção, não agora
type: project
originSessionId: 81d1d187-c314-4f6b-af18-3f94fbd36147
---

Rename de "wizard" → "journey" (código) e "jornada" (copy PT-BR) está aprovado conceitualmente mas **adiado para uma auditoria de renames pré-produção**.

**Why:** Muitas refatorações em andamento simultaneamente — fazer o rename agora aumenta conflitos e churn desnecessário.

**How to apply:** Não fazer esse rename durante o desenvolvimento atual. Quando o projeto estiver estável e próximo do deploy, executar o rename cirúrgico nos ~7 arquivos mapeados (WizardRoot, WizardMock, WizardState, etc.).

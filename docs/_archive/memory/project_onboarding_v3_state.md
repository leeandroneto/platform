---
name: Onboarding v3 — estado atual
description: 22 telas implementadas, 3 checkpoints, persistência completa, preview Haiku real. Pendente: mobile QA, docs.
type: project
originSessionId: 940821f2-d3d1-46d4-bd77-36b5e27154e7
---

## Estado (2026-04-23)

22 telas conversacionais implementadas. tsc 0 erros, vitest 129/129, lint 0 onboarding.

### Fluxo

```
SOBRE VOCÊ
  0. Welcome → 1. Name → 2. ProfilePhoto (3:4) → 3. BackgroundPhoto (16:9)
  4. Bio (300 chars) → 5. Credentials (CREF+alunos+anos) → 6. WhatsApp → 7. ProfilePreview

  8. CHECKPOINT 1 (sobre você ✓)

SOBRE SEU TRABALHO
  9. Modality → 10. Focus (tags+custom) → 11. Nutrition (tom IA) → 12. ServiceMode

  13. CHECKPOINT 2 (trabalho ✓)

INTELIGÊNCIA ARTIFICIAL
  14. Personality (max 2) → 15. Audience (multi-select)

  16. CHECKPOINT 3 (IA ✓)

EXPERIÊNCIA DO ALUNO
  17. TransitionChoice (bifurcação) → 18. WizardPreview (DeviceFrame)
  19. ReportLoading → 20. ReportPreview (Haiku real ou fixture fallback)

ATIVAÇÃO
  21. PricingBridge → 22. Pricing → 23. Checkout (EFI) → 24. Celebration
```

### Persistência completa

- professionals: nome, bio, foto, capa, CREF, alunos, anos, WhatsApp, service_mode → `saveProfileAction`
- professional_modalities.customization JSONB: specialties, nutritionLevel, tone, nivelTecnico → `saveOnboardingConfigAction`
- Fotos: `uploadPhotoAction`, `uploadBackgroundAction`
- Modalidade: `activateModalityAction`

### Migration aplicada

`add_onboarding_v3_columns`: cref, students_helped, years_experience, service_mode em professionals.

### Pendente Fase 4A

- Mobile QA (320px-1440px)
- Docs (architecture.md, schema.md com novas colunas)
- Focus não conectado com templates por especialidade (Fase 4B)

### Fase 4B (não implementada)

Cada especialidade = template independente. IA gera templates. Visual editor markmap.js. Discussão documentada em `plans/cached-frolicking-crayon.md`.

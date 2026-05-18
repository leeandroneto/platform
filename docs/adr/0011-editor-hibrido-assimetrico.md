# 0011. Editor híbrido assimétrico 80/20

Date: 2026-05-17
Status: accepted

## Context

Master plan menciona inline editing genérico. Pesquisa 11 (editor strategy) e pesquisa 15 (editor mobile-first) convergem em outro modelo. Tiptap tem 4 bugs iOS Safari abertos (#7514, #6571, #2629). Indústria (Builder.io, Framer, Wix, Squarespace, TrueCoach, Trainerize) convergiu em form-based em mobile. Fonte: `_CONFLITOS.md #11`.

## Decision

Editor híbrido assimétrico 80/20:

- **Form-based em bottom sheet vaul** pra 80% do produto (treinos, programas, branding, agenda, perfil)
- **Inline contenteditable** SÓ pra texto livre de landing page (título, parágrafo)
- **Zero inline** em workouts, números, listas, imagens

IA no editor preenche o formulário via JSON Outputs validado por Zod. Nunca substitui cursor inline (cursor jump em mobile streaming).

## Consequences

**Positivo:**

- 4 bugs iOS Safari evitados de cara
- Match com indústria (UX previsível)
- Bundle editor 30-50KB (vs Tiptap 80-150KB)
- IA + form = sem cursor jump em mobile streaming

**Negativo:**

- Sensação "menos fluida" que inline em desktop power users
- Mitigação: tier 3 vibe coding pra ultra-power users (M5+)

**Neutro:**

- Estimativa MVP editor: 114-162h (Sprint plan absorve)
- 3 tiers editor (form / drag-drop / vibe coding) — D-G73

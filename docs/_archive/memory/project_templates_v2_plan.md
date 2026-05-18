---
name: Templates v2 Plan
description: Plano de refatoracao sistema de templates — 9 fases subdivididas, 33 especialidades, 120 metricas, 14 componentes visuais
type: project
originSessionId: d3fd823c-6a10-43f9-8a1e-d9903b78a2dd
---

Sistema de templates v2 planejado e parcialmente executado (2026-04-24).

**Scope:** 3 templates hardcoded → 33 especialidades em 6 modalidades (musculacao, corrida, ciclismo, crossfit, natacao, triatlo).

**Docs chave:**

- `docs/plano/plano-refatoracao-formularios.md` — plano mestre (9 fases subdivididas)
- `docs/produto/templates/REGISTRY-METRICAS-GRAFICOS.md` — 120 metricas por modalidade→especialidade→calculo→graficos
- `docs/produto/templates/00-QUESTOES-IMPLEMENTACAO.md` — decisoes de implementacao (19 secoes)

**Decisoes finais:**

- Sem libs externas de calculo (tudo interno, 16 arquivos, 328 testes)
- shadcn chart unica instalacao nova (Recharts ja instalado)
- Wizard = reescrita total, 3 steps universais (basics/personal_note/contact)
- Templates antigos deletados, zero coexistencia
- Banco: specialty_templates + professional_specialties (novas), modality_templates deletada
- Core = 3 especialidades ativas, Pro = ilimitado
- Hub: cards grid, skip com 1 especialidade
- Metricas null = nao renderizar

**Estado (2026-04-24):**

- Fase 1A ✅ — tipos flexiveis
- Fase 1B ✅ — 16 calculos novos, 328 testes
- Fase 2A ✅ — wizard reescrito (buildStepFlow, QuestionStep generico, BasicsStep, 4 steps deletados)
- Fase 3 ✅ — 6 componentes metricas MVP (Card, Gauge, ZoneTable, Timeline, CardComparison, Stepper) + Grid + Renderer
- Fase 5 ✅ — prompt IA com specialty block, branch context, emotional_design (Peak-End, identity, validation-first)
- Camada psicologica aplicada: AiContext + Branch com targetIdentity, validationStyle, projectionStyle, peakInvestment, narrativeArc enum
- 334/334 testes verdes, tsc zero errors
- Proximas: Fase 2B (wizard polish) + Fase 4 (relatorio generico) em paralelo, depois Fase 6A/6B

**Why:** Expansao de features gera receita (Pro = templates ilimitados), diferenciacao vs concorrencia (formularios especializados por esporte), e base para wizard builder futuro.

**How to apply:** Antes de executar qualquer fase, ler o plano mestre. Fases podem rodar em ate 3 terminais paralelos (ver grafo no plano).

---
name: Schema audit pendente
description: Auditoria completa do banco (53 tabelas) com duplicacoes, candidatas a JSONB, candidatas a constantes. Nenhuma decisao confirmada. Doc: docs/core/schema-audit.md. Agendado para Fase 6.
type: project
originSessionId: 8ae71ce0-0add-4821-ac42-72f1bc1ceb6f
---

Auditoria de schema feita em 2026-04-22. Documento movido para: `docs/core/schema-audit.md`. Execucao agendada para **Fase 6** (auditoria final) no plano de lancamento.

**Descobertas principais (nenhuma decisao confirmada):**

- 8 tabelas `analise_*` duplicam `modality_templates` — usuario disse que serao deletadas (mas nao executado ainda)
- `intake_calculation_archive` + trigger duplicam `intakes.calculations` JSONB
- `professional_customization_history` + 2 triggers sem consumidor
- `client_transformations` tem colunas JSONB (`metrics_before/after`) que duplicam colunas tipadas
- `credentials`, `faq_items`, `methodology_pillars`, `locations` sao candidatas a JSONB em `professionals` (folhas sem FK)
- 4 tabelas `system_*` sao candidatas a constantes no app
- `leads` vs `clients` NAO e redundancia (client pode existir sem lead)
- Influencer/afiliados (4 tabelas) — questao de escopo do MVP

**Why:** Projeto passou por muitas alteracoes de design, possivelmente acumulou tabelas desnecessarias. Analise feita antes de ir para producao.

**How to apply:** Quando o usuario retomar o assunto de limpeza de schema, consultar o doc completo. Nao assumir nenhuma decisao como tomada.

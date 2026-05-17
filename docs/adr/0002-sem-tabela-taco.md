# 0002. Sem tabela TACO/TBCA dia 1

Date: 2026-05-17
Status: accepted

## Context

Master plan menciona tabela TACO importada como referência nutricional brasileira. Pesquisa 03 (engenharia de prompt) confirma que LLMs modernos (Sonnet 4.6) já têm base TACO/TBCA na inteligência via training data. Fonte: `_CONFLITOS.md #2`.

## Decision

Sem tabela TACO/TBCA dia 1. IA gera valores nutricionais via JSON Outputs validados por Zod (`07-ai-prompts.md §4`). Se alucinação consistente aparecer em produção → criar `public.knowledge_foods_pt` JIT (princípio §39).

## Consequences

**Positivo:**
- ~5.000 rows de seed evitados
- Updates de dados nutricionais ficam por conta da IA (mais atualizada que TACO 2011)
- KB sem embeddings dia 1 (decisão `07-ai-prompts.md §10`)

**Negativo:**
- Risco de variação entre invocações (mesma comida, calorias diferentes)
- Mitigação: rodar smoke test Promptfoo CI com 30 alimentos comuns + tolerância ±5%

**Neutro:**
- Edge Function `generate-meal-plan` valida output via Zod schema strict
- Trigger criação tabela: ≥3 reportes consistentes de alucinação por profissionais

---
name: Framework JSONB vs normalized — passar SEMPRE antes de criar tabela/coluna
description: Cravado pelo owner em 2026-06-12 após quase erro em deixar composição de página sem JSON. Forma rígida + query frequente = normalized. Forma variável + editada por chat runtime = JSONB.
type: feedback
---

Toda decisão de novo campo/tabela passa pelo framework jsonb-vs-normalized antes de cravar. Sem isso, decisão errada de schema dói depois.

**Why:** owner sinalizou em 2026-06-12 que quase erramos deixando composição de página em código hardcoded (sem JSON). Forçou crav do framework em rule + memory.

**How to apply:**

**Regra de ouro:** Forma rígida + query frequente = normalized. Forma variável + editada por chat/UI runtime = JSONB.

**Check 4 perguntas antes de decidir:**

1. Vou fazer GROUP BY / ORDER BY / WHERE filtrável nessa coluna frequentemente?
   - Sim → Normalized
2. A forma é a mesma em 100% das rows?
   - Não → JSONB obrigatório
3. IA / chat / UI runtime vai editar?
   - Sim → JSONB
4. Ainda ambíguo? Documentar dúvida em `docs/_sessions/` antes de implementar.

**Casos cravados retake:**

✅ Normalized: parties, tenants, memberships, plans, prices, leads, events, athletes, sessions, services, products, orders (query frequente, forma rígida).

✅ JSONB: `page_versions.content` (composição vibe-coding), `tenant_themes.tokens`, `forms.custom_questions`, `ai_tools.schema`, `audit_log.payload`, `party_relationships.terms`, `anamnese.health`, `props_override`, `tenants.settings`, `assessments.value`, `training_day_items.target` (forma varia + runtime editing).

**Anti-patterns banidos:**

- Tokens em N colunas separadas (`primary_color`/`secondary_color`/etc) — usar `tokens jsonb`
- `custom_field_1`, `custom_field_2`, etc — usar `custom_questions jsonb`
- Composição de página em N tabelas — usar `content jsonb`
- Anamnese em N colunas fixas — usar `health jsonb`
- Métricas analíticas em jsonb (precisa GROUP BY) — usar tabela normalizada
- Status enum em jsonb (precisa filter rápido) — usar coluna enum separada
- FK em campo jsonb — usar coluna FK separada

**Otimização JIT:** índice GIN em jsonb só sob gatilho real (tráfego de query alto).

**Detalhe completo:** `.claude/rules/jsonb-vs-normalized.md`.

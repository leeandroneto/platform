---
name: Template testing — sem seed.json
description: seed.json e registry.ts foram deletados; testes de engine usam fixture inline; 86/86 tests
type: project
originSessionId: e6d5de4f-44b0-4741-83c7-c345dad7d5bd
---

seed.json, registry.ts e musculacao/index.ts foram deletados em 2026-04-20.

**Why:** seed.json divergia do banco sempre que o DB era atualizado — era a fonte de inconsistência entre testes e produção.

**Como funciona agora:**

- Testes de engine (build-result, merge, interpolate) usam fixture minimal em `lib/domain/templates/__tests__/fixture.ts` — construída inline, sem schema validation, contém só os valores que os testes assertam.
- Testes de integridade de estrutura do template (antes em structure.test.ts) devem ser integration tests contra o banco real.
- Runtime: `lib/data/template.ts:loadModalityTemplate()` → tabela `modality_templates` no Supabase.
- Contagem atual: 86/86 tests (era 97/97 — os 11 removidos eram de structure.test.ts).

**How to apply:** Nunca criar seed.json para novos modalities. Inserir template no banco. Escrever fixture inline para novos testes de engine.

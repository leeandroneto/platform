# 18 — Transferência onboarding-bio → desafit (JIT)

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Matriz exata do que copia dia 0 vs JIT vs arquiva vs não-copia.
> Origem: memória `project_desafit_jit_code_transfer` + ADR-0023.

---

## 1. Filosofia (princípio JIT)

**Dia 0 minimal:** docs curados/gerados (CHUNK 1-6) + 4 itens técnicos pequenos.

**JIT (Just-In-Time):** código copiado pelo critério HARD PASS (6 critérios) e HARD BLOCKER (7 blockers) na hora que feature precisar — não antes.

**Onboarding-bio fica intacto** (`C:/Users/leean/Desktop/onboarding-bio/`) como referência viva. Zero desenvolvimento ativo lá (pausado). Quando precisar consultar lógica: abrir em IDE separado, auditar, copiar com rename se aplicável. Commit no repo desafit: `ref: copied from onboarding-bio:<path>:<lines> após auditoria HARD PASS`.

---

## 2. COPY DIA 0 — docs (gerados/curados)

| Origem                                                                                                                                   | Destino                                |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `docs/desafit/blueprint/00-PROJETO.md`                                                                                                   | `desafit/docs/blueprint/00-PROJETO.md` |
| `docs/desafit/blueprint/01-arquitetura.md` → `18-transferencia.md`                                                                       | `desafit/docs/blueprint/01-18.md`      |
| `docs/desafit/blueprint/adr/0001-*.md` → `0023-*.md` + `README.md`                                                                       | `desafit/docs/adr/`                    |
| `docs/desafit/blueprint/_VALIDACAO.md`                                                                                                   | `desafit/docs/blueprint/_VALIDACAO.md` |
| `.claude/rules/*.md` (8 arquivos: naming, layers, abstractions, domain-logic, schema-separation, jwt-claims, data-layer, server-actions) | `desafit/.claude/rules/`               |
| `CLAUDE.md` root (gerar novo conforme `16-claude-code.md §2`)                                                                            | `desafit/CLAUDE.md`                    |

**Não copiar:** `_CONFLITOS.md` (vira histórico — ADRs substituem).

---

## 3. COPY DIA 0 — técnico (4 itens auditados)

| Origem                                                                        | Auditoria                                 | Destino                                              |
| ----------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `app/preview/paletas/page.tsx` (valores OKLCH das 13 paletas, NÃO código TSX) | extrair só valores `--color-palette-*`    | `desafit/app/globals.css` dentro de `@theme { ... }` |
| `eslint.config.mjs` linhas 16-73 (tokenBypassPlugin regex)                    | remover comentários "Fase 29"             | `desafit/eslint.config.mjs`                          |
| `eslint.config.mjs` linhas ~80-110 (jsx-a11y strict block)                    | revisar regras + atualizar versões plugin | `desafit/eslint.config.mjs`                          |
| `.gitignore`, `.editorconfig`, `.prettierrc` (boilerplate genérico)           | revisar Next 16 defaults atualizados      | `desafit/` root                                      |

---

## 4. ARQUIVA DIA 0 — read-only referência

| Origem                                                                              | Destino                                         | Uso                                  |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------ |
| `docs/desafit/01-white-label-strategies.md` → `16-visual-premium.md` (16 pesquisas) | `desafit/docs/_archive/pesquisas/01-16.md`      | consulta JIT explícita pelo fundador |
| `~/.claude/plans/desafit-master-plan.md` (~6.631 linhas)                            | `desafit/docs/_archive/master-plan-original.md` | histórico arquitetural               |
| `docs/desafit/proposta/proposta_desafit.html`                                       | `desafit/docs/_archive/proposta-desafit.html`   | canon comercial                      |
| `docs/desafit/proposta/mockup-desafit.png`                                          | `desafit/docs/_archive/mockup-desafit.png`      | canon visual                         |
| `docs/_archive/memory/*` (memórias onboarding-bio)                                  | `desafit/docs/_archive/memory/`                 | read-only                            |

**Regra:** Claude Code NÃO lê `_archive/*` por padrão. Só lê se fundador apontar explicitamente.

---

## 5. NÃO COPIA — greenfield 100%

Tudo abaixo é regenerado do zero seguindo blueprint:

| Caminho                                                                         | Por quê                                                                                                                |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app/**` (todas páginas)                                                        | Regeneradas via Claude Code seguindo blueprint. Vocab e padrões mudaram (core não desafit, sem onboarding wizard, etc) |
| `components/**`                                                                 | Regenera via `pnpm dlx shadcn@latest add` + customs auditados via §6                                                   |
| `lib/data/**`, `lib/hooks/**`, `lib/domain/**`, `lib/api/**`, `lib/services/**` | Escrever do zero seguindo `01-arquitetura.md` + `04-camadas-imports.md`                                                |
| `supabase/migrations/**`                                                        | Schema novo via `mcp__supabase__apply_migration` (`public.*` não `desafit.*` nem `onboarding.*`)                     |
| `supabase/functions/**`                                                         | Edge Functions novas (`generate-assessment`, etc) conforme `07-ai-prompts.md`                                          |
| `messages/pt-BR.json`                                                           | i18n novo (vocab limpo conforme `03-naming-vocab.md`)                                                                  |
| `.env.local`                                                                    | Chaves NOVAS conforme matriz `17-repo-bootstrap.md §5`                                                                 |
| `~/.claude/projects/<hash>/memory/*`                                            | Repo desafit terá `<novo-hash>` independente — memória zera (princípio §10 `14-docs-lifecycle.md`)                     |
| `app/preview/**`                                                                | Ladle substitui (catálogo oficial via `*.stories.tsx`)                                                                 |
| `docs/core/*`, `docs/components/*`, `docs/planos/*`                             | Substituídos por `docs/blueprint/*` + `docs/adr/*`                                                                     |
| `scripts/**` legacy                                                             | Auditar caso a caso (alguns viram `desafit/scripts/` se HARD PASS)                                                     |

---

## 6. JIT (copiar quando feature precisar)

Lista de candidatos. Cada item exige auditoria HARD PASS antes de copiar.

| Origem                                                                                                                    | Quando avaliar                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/domain/engine/calculations/*` (~25 fórmulas fisiologia: TDEE, BMR, macro-split, Mifflin-St Jeor, Katch-McArdle, etc) | Sprint 4-5 (M1/M2) — quando assessment IA + programa estruturado entrarem                                                                   |
| `lib/domain/types/*`                                                                                                      | Caso a caso — cuidado com tipos que assumem schema antigo                                                                                   |
| `lib/domain/ai/schemas.ts` (estrutura slots/blocks IA)                                                                    | Sprint 4 — ⚠️ renomear chaves PT pra EN antes de copiar: `reflexao→reflection`, `pilares→pillars`, `proximo_passo→next_step`, `ato_*→act_*` |
| `lib/domain/templates/*` (pattern Template→Instância)                                                                     | Sprint 5+ — quando 1º programa estruturado entrar                                                                                           |
| `eslint.config.mjs` linhas 100-493 (outras regras lint)                                                                   | Auditar caso a caso — pode ter regras úteis ou regras Fase-X obsoletas                                                                      |
| Edge Functions de fisiologia (`_engine/*`)                                                                                | Sprint 5+ — quando programa estruturado precisar                                                                                            |
| React Email templates relevantes                                                                                          | Sprint 6 — quando email transacional do tenant entrar                                                                                       |
| Hooks utility puros (sem business logic)                                                                                  | Caso a caso                                                                                                                                 |
| Test fixtures genéricos                                                                                                   | Caso a caso                                                                                                                                 |

---

## 7. Critérios HARD PASS (6 — TODOS devem passar antes de copiar)

(Da memória `project_desafit_jit_code_transfer`)

1. **Função pura ou primitive sem coupling** com schema/vocab/arch do onboarding-bio
2. **Renomear identifiers** se houver vocab banido (intake, wizard, student, etc) — não copiar literal se exigir rename ≥3 vars
3. **Test cobre comportamento** (não só smoke) — se não tem test no onboarding-bio, criar antes/depois de copiar
4. **Dependência externa estável** — não usa libs deprecated (framer-motion → motion/react)
5. **≤200 linhas** — se maior, dividir mentalmente em componentes antes de copiar
6. **Documentar origem no commit** — `ref: copied from onboarding-bio:<path>:<lines> após auditoria HARD PASS`

---

## 8. HARD BLOCKERS (7 — qualquer 1 bloqueia cópia)

1. **Usa vocab banido** sem rename trivial
2. **Importa código de fase X** específica (Fase 28, 29) — vira refator gigante
3. **Hardcoded** a schema `public.professionals` ou `onboarding.intakes`
4. **Tem comentários "TODO Fase Y"** ou "REVIEW antes shipar"
5. **Usa abstração que não existe no desafit** (CrudManager, useCrudList, FormModal — avaliar se vale recriar abstração antes)
6. **Dependência circular** com módulo onboarding-bio que NÃO vai existir no desafit
7. **Padrão arquitetural divergente** (ex: usa Server Action no formato antigo `(prevState, formData)` — desafit usa Result type)

---

## 9. Onboarding-bio fica intacto

`C:/Users/leean/Desktop/onboarding-bio/` permanece:

- Pasta intacta (não deletar, não mover)
- Zero desenvolvimento ativo (pausado oficialmente)
- Repo de referência viva pra JIT
- Supabase do onboarding-bio também intacto (não dropar `onboarding.*`)

**Retomada futura onboarding.bio (ADR-0023):** Supabase + repo SEPARADOS novos. Onboarding.bio atual NÃO vira base.

---

## 10. Reset memória Claude

Repo desafit terá pasta `~/.claude/projects/<novo-hash-desafit>/memory/` independente.

| Item                                                                              | Migra?                                                               |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Memória atual onboarding-bio (`~/.claude/projects/<hash-onboarding>/memory/*.md`) | ❌ NÃO migra                                                         |
| MEMORY.md atual                                                                   | ❌ NÃO migra                                                         |
| Vocab banido                                                                      | ✅ vive em `.claude/rules/naming.md` (carregado por paths)           |
| Decisões                                                                          | ✅ vive em `docs/adr/*`                                              |
| Padrões                                                                           | ✅ vive em `CLAUDE.md` + `.claude/rules/*`                           |
| Preferências fundador (terso, sem summary)                                        | ✅ recriadas na sessão conforme Claude observa (auto-memory pattern) |

**Princípio:** o que é regra ativa NÃO vive em memória (memória é volátil, fonte de verdade não pode ser). Memória é contexto de sessão complementar.

---

## 11. Validação pós-transferência

Smoke após copiar tudo (executar em `desafit/`):

```powershell
pnpm typecheck                          # 0 erros
pnpm lint --max-warnings 0              # 0/0
pnpm vocab:audit                        # 0 hits
pnpm i18n:audit                         # 0 hits
pnpm token:audit                        # 0 hits
pnpm vitest run                         # tudo verde
pnpm build                              # build verde
pnpm size                               # budgets verdes
```

Se algum step falhar → reverter cópia problemática + revisar critérios HARD PASS.

---

## 12. Tabela síntese (visual rápido)

| Categoria      | # itens                                                                       | Quando                    |
| -------------- | ----------------------------------------------------------------------------- | ------------------------- |
| Docs migram    | 28 (1 const + 18 blueprints + 23 ADRs + 1 README + 8 rules + 1 CLAUDE.md)     | Dia 0 imediato            |
| Técnico migra  | 4                                                                             | Dia 0                     |
| Arquiva        | 20+ (16 pesquisas + master plan + proposta + mockup + memórias)               | Dia 0 read-only           |
| Não copia      | tudo `app/`, `components/`, `lib/`, `supabase/`, `messages/`, `.env`, memória | Greenfield 100%           |
| JIT candidatos | ~10 categorias                                                                | Conforme feature precisar |

---

## 13. Referências cruzadas

- `00-PROJETO.md` (constituição)
- ADR-0021 (schema core), 0022 (marca pai), 0023 (onboarding.bio retake separado)
- `14-docs-lifecycle.md §10, §11` (memória + archive)
- `16-claude-code.md` (CLAUDE.md + rules + hooks)
- `17-repo-bootstrap.md` (passo-a-passo executável)
- Memórias: `project_desafit_jit_code_transfer`, `project_desafit_separation`, `project_desafit_multi_brand_strategy`

## Histórico

| Data       | Mudança                                                                  | Aprovador |
| ---------- | ------------------------------------------------------------------------ | --------- |
| 2026-05-17 | Versão inicial — matriz JIT completa + HARD PASS/BLOCKER + reset memória | Leandro   |

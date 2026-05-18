# Fase 04 — Claude Code Setup

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-04-claude-setup.md e execute"`
> **Tempo:** ~1h
> **Depende de:** Fases 02 + 03
> **Paralelo com:** Fase 05 (arquivos diferentes)
> **Modelo:** Sonnet 4.6 — cria configs
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Configurar .claude/ com hooks, path-scoped rules, skills, e agents pra automacao.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `docs/refatoracao-2026-05/04-claude-code-automation.md` (config completa)
3. Verificar se `.claude/` ja existe e o que tem

## Itens

### Path-scoped rules

```
[x] 04.1 — Criar .claude/rules/react-components.md (copiar conteudo de 04-claude-code-automation.md secao 2)
[x] 04.2 — Criar .claude/rules/server-actions.md
[x] 04.3 — Criar .claude/rules/database.md
[x] 04.4 — Criar .claude/rules/domain-logic.md
[x] 04.5 — Criar .claude/rules/migrations.md
[x] 04.6 — Criar .claude/rules/edge-functions.md
```

### Skills

```
[x] 04.7 — Criar .claude/skills/component-audit/SKILL.md
[x] 04.8 — Criar .claude/skills/ds-check/SKILL.md
[x] 04.9 — Criar .claude/skills/migration-review/SKILL.md
```

### Agents

```
[x] 04.10 — Criar .claude/agents/security-reviewer.md
[x] 04.11 — Criar .claude/agents/performance-auditor.md
```

### Verificacao

```
[x] 04.12 — Verificar que Claude Code carrega as rules (abrir arquivo em path coberto e verificar)
[x] 04.13 — git pull --rebase origin main
[x] 04.14 — Commit: "chore(claude): add path-scoped rules, skills, and agents"
```

## Ao concluir

Reportar:

- Rules criadas: 6
- Skills criadas: 3
- Agents criados: 2
- Claude Code carrega corretamente: sim/nao

Dizer ao fundador:

---

**Fase 04 concluida.**

Se Fase 05 JA concluiu: proxima fase desbloqueada — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-06-ui-components.md e execute"`

Fase 06 migra componentes custom pra shadcn. E foundation — fases 07-10 dependem dela.

## Se Fase 05 AINDA nao concluiu: aguardar.

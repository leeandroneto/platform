# Fase 00 — Baseline

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-00-baseline.md e execute"`
> **Tempo:** ~15min
> **Depende de:** nada
> **Paralelo com:** nada (rodar primeiro, sozinho)
> **Modelo:** Sonnet 4.6 (ou `/fast` Opus 4.6) — so roda comandos, baixo risco
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## ⛔ REGRA DE OURO (vale para TODAS as fases)

**PROIBIDO simplificar ou pular etapas.** Cada item da secao "Itens" abaixo deve ser executado integralmente. Sem versao reduzida, sem "isso ja basta", sem TODO pendente. A unica saida valida e: **executado 100%** OU **bloqueio reportado com diagnostico**. Detalhes em `README.md` desta pasta.

---

## Objetivo

Tirar snapshot do estado atual antes de qualquer mudanca. Confirmar que tudo passa.

## Antes de comecar

1. `git pull --rebase origin main`
2. Verificar working tree limpo (`git status`)

## Itens

### Git tag de seguranca

```
[ ] 00.0 — git tag pre-refactor-2026-05 -m "Snapshot antes da refatoracao horizontal"
           git push origin pre-refactor-2026-05
           Se algo der muito errado em qualquer fase: git reset --hard pre-refactor-2026-05
```

### Verificacoes

```
[ ] 00.1 — Rodar pnpm exec tsc --noEmit. Registrar: N erros.
[ ] 00.2 — Rodar pnpm exec vitest run. Registrar: N/N passando.
[ ] 00.3 — Rodar pnpm lint. Registrar: N erros, N warnings.
[ ] 00.4 — Rodar pnpm build. Registrar: passa ou falha.
[ ] 00.5 — git status: working tree limpo? Registrar.
[ ] 00.6 — Contar componentes em components/ui/: ls components/ui/*.tsx | wc -l
[ ] 00.7 — Contar pages: find app -name "page.tsx" | wc -l
[ ] 00.8 — Registrar resultados no CHECKLIST.md
```

## Ao concluir

Reportar snapshot:

- tsc: X erros
- vitest: X/Y passando
- lint: X erros, Y warnings
- build: passa/falha
- componentes ui: N
- pages: N

Dizer ao fundador:

---

**Fase 00 concluida.**

Proxima fase desbloqueada: **Fase 01 (Lint Infrastructure)** — rodar neste mesmo terminal.

Prompt: `"leia docs/refatoracao-2026-05/execucao/fase-01-lint-infra.md e execute"`

## Nenhuma fase paralela disponivel ainda. Fase 01 e foundation — tudo depende dela.

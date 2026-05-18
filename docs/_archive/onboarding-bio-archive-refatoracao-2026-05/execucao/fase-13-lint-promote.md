# Fase 13 — Lint Promote

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-13-lint-promote.md e execute"`
> **Tempo:** ~2h
> **Depende de:** Fase 12
> **Paralelo com:** nada (finalizacao)
> **Modelo:** Sonnet 4.6 — promote regras + fix
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Promover todas as regras warn → error. Rodar knip. Build final. Zero erros, zero warnings.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `eslint.config.mjs` REAL

## Itens

### Promover regras

```
[x] 13.1 — Ler eslint.config.mjs REAL
[x] 13.2 — Todos os selectors de no-restricted-syntax que estao como "warn" → "error"
           (input, textarea, select, table, dialog, label, img, oklch, DOM)
           → ja estavam todos em "error" desde Fase 01. Nada a promover.
[x] 13.3 — react/jsx-no-literals: "warn" → "error"
[x] 13.4 — Qualquer outra regra que esteja warn → avaliar se pode ser error
           → jsx-a11y/no-autofocus: warn → error (13 usos ja com eslint-disable + motivo)
```

### Rodar tudo

```
[x] 13.5 — pnpm lint — 0 erros, 0 warnings ✅
[x] 13.6 — pnpm exec tsc --noEmit — 0 erros ✅
[x] 13.7 — pnpm exec vitest run — 401/401 ✅
[x] 13.8 — pnpm knip — 0 findings ✅ (removidas 8 entradas stale do knip.json)
[x] 13.9 — pnpm build — passa ✅
```

### Commit

```
[x] 13.10 — git pull --rebase origin main
[x] 13.11 — Commit: "chore(lint): promote all warn rules to error — zero tolerance" ✅
            sha: 500d0ba
```

## Ao concluir

Reportar:

- Regras promovidas: N
- Erros encontrados durante promocao: N (como resolveu)
- knip findings: 0
- build: passa
- **O projeto agora e impossivel de quebrar via commit — lint + tsc + vitest + knip impedem.**

Dizer ao fundador:

---

**Fase 13 concluida. Projeto TRAVADO — impossivel commitar codigo fora do padrao.**

Proxima e ULTIMA fase — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-14-craft-pass.md e execute"`

## Fase 14 abre todas as rotas no browser e verifica visual. Ultima chance de pegar bugs.

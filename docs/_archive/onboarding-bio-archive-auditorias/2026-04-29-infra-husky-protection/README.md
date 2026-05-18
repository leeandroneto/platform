# Fase 28 — Husky + commitlint + Branch Protection

**Data:** 2026-04-29
**Objetivo:** Trazer travas de qualidade (lint, tsc, vitest, conventional commits) do CI para o ambiente local via Husky, e proteger a branch `main` contra push direto.

## Escopo

| Wave | Entrega                                                                | Status                                              |
| ---- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| 01   | Husky + lint-staged (pre-commit: lint+tsc, pre-push: vitest)           | CONCLUIDO                                           |
| 02   | commitlint (Conventional Commits no commit-msg hook)                   | CONCLUIDO                                           |
| 03   | Branch protection no `main` (PR obrigatório, CI verde, sem force-push) | BLOQUEADO — GitHub Free nao suporta em repo privado |

## Arquivos criados/modificados

- `package.json` — devDependencies + scripts `prepare`
- `.husky/pre-commit` — lint-staged
- `.husky/pre-push` — vitest
- `.husky/commit-msg` — commitlint
- `commitlint.config.ts` — regras Conventional Commits
- `.lintstagedrc.mjs` — configuração lint-staged

## Referências

- [Husky docs](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [commitlint](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

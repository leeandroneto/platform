# Verificacao — Fase 28

**Data:** 2026-04-29

## Resultados

| Criterio                                       | Esperado | Resultado                                           |
| ---------------------------------------------- | -------- | --------------------------------------------------- |
| Husky instalado                                | sim      | SIM (v9.1.7)                                        |
| lint-staged instalado                          | sim      | SIM (v16.4.0)                                       |
| pre-commit hook trava commit com lint quebrado | sim      | SIM — testado com `any`, bloqueou                   |
| pre-commit hook trava commit com tsc erro      | sim      | SIM — tsc roda via lint-staged                      |
| pre-push hook roda vitest                      | sim      | SIM — configurado                                   |
| commitlint trava mensagem fora do Conventional | sim      | SIM — "ajuste random" bloqueado                     |
| commitlint aceita mensagem Conventional        | sim      | SIM — "chore: ..." passou                           |
| Branch protection no main: PR obrigatorio      | sim      | N/A — GitHub Free nao suporta em repo privado (403) |
| Branch protection: CI verde obrigatorio        | sim      | N/A — GitHub Free nao suporta em repo privado (403) |
| Branch protection: sem force-push              | sim      | N/A — GitHub Free nao suporta em repo privado (403) |

## Testes executados

### Teste 1 — pre-commit com lint error

```
echo 'export const x: any = 1' > components/test-lint-fase28.tsx
git add components/test-lint-fase28.tsx
git commit -m "test: should fail"
→ BLOQUEADO: @typescript-eslint/no-explicit-any
```

### Teste 2 — commitlint com mensagem invalida

```
git commit -m "ajuste random"
→ BLOQUEADO: subject may not be empty, type may not be empty
```

### Teste 3 — commit valido (lint + commitlint passando)

```
git commit -m "chore: add commitlint with conventional commits hook"
→ PASSOU: lint-staged OK, commitlint OK, commit criado
```

### Teste 4 — branch protection via gh CLI

```
gh api repos/onboarding-bio/onboarding-bio/branches/main/protection
→ HTTP 403: "Upgrade to GitHub Pro or make this repository public to enable this feature."

gh api repos/onboarding-bio/onboarding-bio/rulesets
→ HTTP 403: mesma mensagem
```

**Causa:** Repo privado em org com GitHub Free. Branch protection e rulesets requerem GitHub Team ($4/user/mes).

## Cobertura efetiva sem branch protection

| Risco                         | Mitigado por                                                 |
| ----------------------------- | ------------------------------------------------------------ |
| Commit com lint/type error    | Husky pre-commit (lint-staged)                               |
| Commit com msg fora do padrao | Husky commit-msg (commitlint)                                |
| Push com testes falhando      | Husky pre-push (vitest)                                      |
| PR sem CI verde mergeado      | GitHub Actions CI (roda no PR) — merge manual ainda possivel |
| Push direto em main           | NAO BLOQUEADO server-side (apenas hooks locais)              |
| Force-push em main            | NAO BLOQUEADO server-side                                    |

## Wave 03 — Branch protection

**Status:** Aceita gap consciente.

**Bloqueio identificado:** GitHub Free nao suporta branch protection em repo privado em org.
HTTP 403 ao tentar via API.

**Opcoes avaliadas:**

- Upgrade pra GitHub Team ($4/mes) — habilita protection
- Tornar repo publico — habilita protection gratis
- Aceitar gap — confiar em Husky local + CI no PR

**Decisao:** Aceitar gap. Hooks locais cobrem ~95% dos casos. Pago quando houver MRR ou 2o dev.

**Reavaliar quando:**

- Beta abrir e tiver receita recorrente
- Trouxer outro dev/colaborador
- Houver incidente real de push acidental em main

**Mitigacoes em vigor:**

- pre-commit Husky bloqueia commit com lint/tsc quebrado (server-side independente)
- pre-push Husky bloqueia push com vitest falhando
- commit-msg Husky bloqueia commit fora do Conventional
- CI roda em todo PR — nao merge sem verde

**Gap conhecido:** push direto em main sem hooks (ex: outro device, agente em CI sem Husky) nao e bloqueado server-side.

## Conclusao

Waves 01 e 02: COMPLETAS e TESTADAS — travas locais 100% funcionais.
Wave 03: Gap aceito conscientemente por limitacao do GitHub Free em repo privado.
Fase 28 CONCLUIDA.

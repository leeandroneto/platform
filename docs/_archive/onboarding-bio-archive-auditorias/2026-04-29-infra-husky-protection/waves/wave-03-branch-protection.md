# Wave 03 — Branch Protection (main)

## Status: BLOQUEADA — GitHub Free nao suporta em repo privado

### Descoberta (2026-04-29)

Branch protection rules e rulesets requerem **GitHub Team** ($4/user/mes) ou **Enterprise** para repos privados de organizacoes. O repo `onboarding-bio/onboarding-bio` é privado numa org com plano Free.

```
HTTP 403: "Upgrade to GitHub Pro or make this repository public to enable this feature."
```

Testado com:

- `gh api repos/onboarding-bio/onboarding-bio/branches/main/protection` → 403
- `gh api repos/onboarding-bio/onboarding-bio/rulesets` → 403

### Opcoes

| Opcao                    | Custo       | Impacto                                      |
| ------------------------ | ----------- | -------------------------------------------- |
| Upgrade para GitHub Team | $4/user/mes | Habilita branch protection + rulesets        |
| Tornar repo publico      | Gratuito    | Habilita branch protection, mas expoe codigo |
| Manter como esta         | Gratuito    | Sem branch protection server-side            |

### Protecao atual (sem branch protection)

Mesmo sem branch protection, o projeto ja tem cobertura significativa:

| Protecao                          | Mecanismo                            | Cobertura |
| --------------------------------- | ------------------------------------ | --------- |
| Lint antes de commit              | Husky pre-commit + lint-staged       | LOCAL     |
| Type-check antes de commit        | Husky pre-commit + lint-staged (tsc) | LOCAL     |
| Testes antes de push              | Husky pre-push (vitest)              | LOCAL     |
| Conventional Commits              | Husky commit-msg (commitlint)        | LOCAL     |
| Lint + tsc + vitest + build no PR | GitHub Actions CI                    | REMOTO    |
| VRT no PR                         | GitHub Actions (Playwright)          | REMOTO    |

**O que falta sem branch protection:**

- Push direto em `main` nao e bloqueado server-side (mas Husky trava localmente)
- Force-push em `main` nao e bloqueado server-side
- PR sem CI verde pode ser mergeado manualmente

### Recomendacao

Para solo dev pre-lancamento, os hooks locais + CI cobrem o necessario. Reavaliar branch protection quando:

- Mais devs entrarem no projeto
- O repo for tornado publico
- A org fizer upgrade para GitHub Team

## Configuracao futura (quando disponivel)

### Via GitHub UI

1. Ir em `github.com/onboarding-bio/onboarding-bio/settings/branches`
2. Clicar "Add branch ruleset" (ou editar regra existente)
3. Configurar:

| Regra                                 | Valor                                                      |
| ------------------------------------- | ---------------------------------------------------------- |
| Branch name pattern                   | `main`                                                     |
| Require a pull request before merging | ON                                                         |
| Required approvals                    | 0 (solo dev por agora)                                     |
| Require status checks to pass         | ON                                                         |
| Status checks required                | `Lint / Type-check / Test / Build` (job `check` do ci.yml) |
| Require branches to be up to date     | ON                                                         |
| Block force pushes                    | ON                                                         |
| Block deletions                       | ON                                                         |

### Via gh CLI

```bash
gh api repos/onboarding-bio/onboarding-bio/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint / Type-check / Test / Build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":0}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

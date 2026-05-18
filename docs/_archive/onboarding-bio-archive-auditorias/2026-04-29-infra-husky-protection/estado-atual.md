# Estado atual — Infra de qualidade local

**Auditado em:** 2026-04-29

## O que existe

| Item                      | Status | Detalhes                                                                |
| ------------------------- | ------ | ----------------------------------------------------------------------- |
| CI (GitHub Actions)       | OK     | `.github/workflows/ci.yml` — roda lint, tsc --noEmit, vitest run, build |
| ESLint config             | OK     | `eslint.config.mjs` presente e funcional                                |
| TypeScript                | OK     | `pnpm exec tsc --noEmit` zero erros                                     |
| Vitest                    | OK     | 360/360 testes passando                                                 |
| pnpm como package manager | OK     | Lock file e scripts configurados                                        |

## O que falta

| Item                             | Status         | Impacto                                                               |
| -------------------------------- | -------------- | --------------------------------------------------------------------- |
| Husky                            | NAO INSTALADO  | Sem git hooks locais — commits com lint/type errors passam livremente |
| lint-staged                      | NAO INSTALADO  | Sem lint incremental no pre-commit                                    |
| commitlint                       | NAO INSTALADO  | Sem validacao de mensagem de commit — msgs como "ajuste" passam       |
| @commitlint/cli                  | NAO INSTALADO  | Dep do commitlint                                                     |
| @commitlint/config-conventional  | NAO INSTALADO  | Preset Conventional Commits                                           |
| Branch protection (main)         | NAO VERIFICADO | gh CLI nao disponivel localmente; verificar via GitHub UI             |
| Script `prepare` no package.json | NAO EXISTE     | Necessario para husky init automatico no `pnpm install`               |

## CI existente (referencia)

O workflow `ci.yml` ja executa:

1. `pnpm lint`
2. `pnpm exec tsc --noEmit`
3. `pnpm exec vitest run`
4. `pnpm build`

Alem de VRT (Playwright), deploy preview e deploy production.

## Conclusao

Todas as travas existem APENAS no CI. Localmente nao ha nenhum git hook configurado.
A Fase 28 vai espelhar as travas do CI no ambiente local via Husky + lint-staged + commitlint.

# Refatoracao Horizontal — Maio 2026

> Pasta dedicada a pesquisa e planejamento da refatoracao completa do onboarding.bio.
> **Objetivo:** projeto 100% shadcn, 100% personalizavel, zero inline, mobile-first app-like, impossivel de quebrar.
>
> **Status:** Fases 00-22 marcadas concluídas em 2026-05-02 (commit `4e575c2`); auditoria pós-fase-22 abriu wave **23-27** em `execucao/fase-23-fechamento-real.md` (deploy edges, sync migrations, tsconfig hardening, componentes >500l, páginas legacy, visual QA). Snapshot 2026-05-02: tsc 0, vitest 442/442, lint 0/0, knip 0, build 93/93.

---

## Documentos nesta pasta

| #   | Documento                            | Status | Conteudo                                                                                                         |
| --- | ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------- |
| 01  | `01-shadcn-mapeamento.md`            | Pronto | Inventario completo shadcn (58 UI + 16 blocks + 200 examples). O que instalar, deletar, manter. Patterns mobile. |
| 02  | `02-regras-padronizacao.md`          | Pronto | Regras definitivas: reuso, SOLID, camadas, limites, lint, i18n, erros, mobile, multi-tenant, checklists.         |
| 03  | `03-estrategias-lint.md`             | Pronto | Plugins, 17 selectors no-restricted-syntax, pipeline Husky, tsconfig hardening, Prettier, knip.                  |
| 04  | `04-claude-code-automation.md`       | Pronto | Hooks, skills, agents, path-scoped rules, permissions, estrutura `.claude/`.                                     |
| 05  | `05-mcps-extensions-clitools.md`     | Pronto | MCP servers (Playwright, Vercel), VS Code extensions, CLI tools (knip, bundle-analyzer, Lighthouse).             |
| 06  | `06-estrutura-documentos.md`         | Pronto | Ecossistema de docs: qual doc faz o que, o que criar, o que manter, o que nao precisa.                           |
| 07  | `07-guia-fundacao-design.md`         | Pronto | Guia de fundacao: tokens, componentes shadcn-first, mobile patterns, 5 mecanismos anti-regressao, migracao.      |
| 08  | `08-plano-refatoracao-horizontal.md` | Pronto | Estrategia infrastructure-first, 15 fases, mapa de dependencias, paralelismo 3 terminais.                        |
| 09  | `09-mobile-app-design.md`            | Pronto | Mobile app-like: patterns iFood/Nubank, shadcn mobile, PWA, gestos, Motion, wireframes ASCII, anti-padroes.      |

---

## Ordem de execucao

1. Finalizar docs 07-09 (guia + plano + mobile)
2. Executar refatoracao por fases (doc 08)
3. Atualizar CLAUDE.md com novas regras
4. Configurar `.claude/` (hooks, skills, rules)
5. Instalar plugins lint + ferramentas
6. Deletar componentes mortos + instalar shadcn
7. Migrar componentes custom → shadcn
8. Lint sweep completo
9. Craft pass visual
10. Smoke test E2E

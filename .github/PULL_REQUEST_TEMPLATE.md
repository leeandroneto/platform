## O que muda

(1-2 linhas — outcome, não output)

## Por quê

(Issue # / decisão / ADR-NNNN. Sem WHY, PR não merge.)

## Tipo

- [ ] feat (nova feature user-facing)
- [ ] fix (bug)
- [ ] refactor (sem mudança user-facing)
- [ ] perf
- [ ] docs
- [ ] test
- [ ] chore
- [ ] revert

## Checklist obrigatório

- [ ] `pnpm typecheck` 0 erros
- [ ] `pnpm lint --max-warnings 0` 0/0
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` 0 hits
- [ ] `pnpm test` verde
- [ ] `pnpm build` verde
- [ ] `pnpm size` budgets verdes
- [ ] Testado em iPhone 14 portrait 375px (mobile-first ADR-0007)
- [ ] Vocab limpo (ver `.claude/rules/naming.md`)
- [ ] Schema `platform.*` (não `core.*` nem `desafit.*` — ADR-0025)
- [ ] Brand resolvida via `useBrand()` / hostname (não env, não literal)
- [ ] Zero `eslint-disable` adicionado (ou ADR-0012 allowlist única)
- [ ] CHANGELOG.md atualizado (se user-facing)

## ADR

- [ ] Mudança de arquitetura / one-way door → ADR-\_\_\_\_ criado
- [ ] Mudança reversível → sem ADR necessário

## Screenshots / vídeo

(Mobile 375px + desktop se aplicável)

## Notas pra reviewer

(Nada que não esteja claro no diff — caso especial, edge case, decisão de design)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

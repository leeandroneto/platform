# 0030. Relax `exactOptionalPropertyTypes` (shadcn upstream incompat)

Date: 2026-05-17
Status: accepted

## Context

D-G65 (research C, project_desafit_research_c_2026_05_17) ativou strict++ no tsconfig
incluindo `exactOptionalPropertyTypes: true` — flag que distingue `{ foo?: string }`
(key ausente) de `{ foo: string | undefined }` (key presente com undefined).

ADR-0008 estabelece shadcn 100% como canon de UI. shadcn/Radix passam props como
`prop: T | undefined` em 6+ componentes (Dialog, DropdownMenu, Popover, Tooltip,
Select, Form helpers). Com flag estrita, build quebra em todos.

Alternativas avaliadas:

- (A) Patchar cada componente shadcn: ciclo de quebra a cada `pnpm dlx shadcn@latest add`
- (B) Relax flag: alinha com 95% projetos Next/React (default TS é false)
- (C) Fork shadcn: overhead permanente, viola ADR-0008

## Decision

Desativar `exactOptionalPropertyTypes` no `tsconfig.json` (alterar para `false` ou
remover linha — TS default é false).

Manter outras 5 flags strict++ (`noUncheckedIndexedAccess`, `noImplicitReturns`,
`noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`).

## Consequences

**Positivo:**

- Build verde sem patches em shadcn
- Compat upstream: `pnpm dlx shadcn@latest add` funciona sem ajuste manual
- Alinha com ecosystem (default TS, default Next, default Vercel templates)

**Negativo:**

- Perde detecção automática de bug: `update({ name: undefined })` no Supabase pode
  escrever NULL em vez de manter valor existente. Mitigação:
  1. Zod schemas em `lib/contracts/*` validam `optional()` vs `nullable()` no boundary
  2. Code review extra em PRs que mexem `lib/data/*`
  3. Smoke test cobrindo cenários UPDATE com campo `undefined` (Sprint 2 backlog)
- Tradeoff humano: confiar em review + Zod em vez de TS automático

**Neutro:**

- Revisitar quando shadcn publicar fix upstream (acompanhar repo)
- Reativar flag = projeto único (não por arquivo) — não vai dar "ativa em lib/, desativa em components/"

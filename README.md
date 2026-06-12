# retake.run

Plataforma vertical de **corrida** (endurance) no Brasil. Serve assessorias, run clubs e coaches autônomos.

**Fosso:** núcleo de treino (periodização → segmentado → prescrito × executado → integração wearables).

## Stack

Next 16 · React 19 · Tailwind v4 · shadcn new-york · Supabase ssr · Zod 4 · RHF 7 · Zustand 5 · next-intl 4 (pt-BR/en/es) · AI SDK v6 + AI Gateway · Sonnet 4.6 + Haiku 4.5 · pnpm 10.

## Docs

- [CLAUDE.md](./CLAUDE.md) — discovery autocarregável pra Claude Code
- [docs/\_handoff/](./docs/_handoff/) — SSOT do produto (intocável)
- [docs/adr/0001-foundation.md](./docs/adr/0001-foundation.md) — ADR fundadora
- [docs/blueprint/00-projeto.md](./docs/blueprint/00-projeto.md) — resumo produto + público + arquitetura
- [docs/plans/foundation.md](./docs/plans/foundation.md) — sprints S0-S7

## Dev

```bash
pnpm install
pnpm dev
```

## Testes

```bash
pnpm typecheck
pnpm lint --max-warnings 0
pnpm test
pnpm build
```

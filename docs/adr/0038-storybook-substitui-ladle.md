# 0038. Storybook 10 substitui Ladle como catálogo visual

Date: 2026-05-18
Status: accepted
Supersedes: ADR-0013

## Context

ADR-0013 (2026-05-17) escolheu Ladle por leveza (~5× mais rápido) + sintaxe compatível Storybook (migração trivial se virar limite). Um dia depois (planejamento fechamento dia 0), 3 limites do Ladle viraram bloqueadores:

1. **Sem MCP server oficial.** Claude/Cursor não lêem stories como catálogo. Plano Phase A Final F3 exige MCP integration pra IA discoverable de primitives.
2. **Sem visual regression integrado.** Chromatic é Storybook-only (mesma empresa). Ladle exige Playwright + screenshot diffs caseiros (overhead manutenção).
3. **Sem `addon-a11y` axe-core nativo.** Ladle tem `addons.a11y` simples; Storybook 10 tem `@storybook/addon-a11y` com axe-core integration + gate CI.

Storybook 10 endereçou os 3 problemas históricos:

- **Performance** — `@storybook/nextjs-vite` framework Vite-based (dev server <3s, próximo do Ladle).
- **Bundle node_modules** — Storybook 10 modulariza addons (core ~80MB vs ~300MB v6 monolítico).
- **Setup** — `pnpm dlx storybook@latest init` detecta Next 16 auto, instala framework certo, gera config funcional.

Fonte: pesquisa 2026-05-18 (context7 + WebSearch + docs Storybook oficial).

## Decision

**Storybook 10.4+ com `@storybook/nextjs-vite`** — substitui Ladle como catálogo visual. Migração trivial: stories `*.stories.tsx` formato CSF3 idêntico ambos.

**Config dia 0:**

- `.storybook/main.ts` — framework `@storybook/nextjs-vite`, stories `components/**/*.stories.@(ts|tsx|mdx)` (co-localizadas com primitive — Pesquisa 18 Q8 + ADR-0040 §L)
- `.storybook/preview.tsx` — import `app/globals.css` (tokens OKLCH + Tailwind v4 @theme), default dark, decorator `<div className="dark bg-background text-foreground">`
- Addons dia 0: `@storybook/addon-a11y` (axe-core gate), `@storybook/addon-docs` (autodocs + MDX), `@storybook/addon-mcp` (HTTP endpoint `localhost:6006/mcp` consumível Claude/Cursor), `@chromatic-com/storybook` (visual regression — config JIT quando merge CI a main), `@storybook/addon-vitest` (interaction tests — overhead zero parado, plug-and-play JIT)
- `@storybook/addon-interactions` **descartado** — vazio desde v9 (funcionalidade migrou pro core + `@storybook/test`)

**Stories iniciais dia 0** (6 ou mais quando concretos):

- 3 wrappers: `AppForm`, `AppToast`, `AppEntitlementGate` (ADR-0040 §E)
- 3 typography: `Heading`, `Text`, `Muted` (ADR-0040 §F)
- 13 paletas OKLCH (mock showcase com seeds)
- Motion presets (6 duration × 5 easing — ADR-0040 §J)
- `<Logo>` wordmark (Etapa 9)

**`.mcp.json`** — adicionado entry `storybook` HTTP transport apontando pra `http://localhost:6006/mcp` (só ativa quando Storybook rodando).

## Consequences

**Positivo:**

- MCP integration nativa Claude/Cursor (Phase A F3 desbloqueado)
- Chromatic visual regression JIT (Storybook ecosystem)
- Addon-a11y axe-core gate CI (ADR-0040 §H reforça)
- Storybook 10 dev server <3s (próximo Ladle, longe da memória v6 lenta)
- Stories CSF3 idênticos — zero refactor migrando depois

**Negativo:**

- node_modules +~60MB (Storybook core + addons + Vite)
- Mitigação: dev-only dep, não impacta bundle prod

**Neutro:**

- Setup `15-bootstrap-checklist.md tarefa 29` mantém — ferramenta troca, intent igual
- `15-bootstrap-checklist.md tarefa 17` (Skeleton premium) co-existe com stories Storybook
- Aceita-se que Ladle saiu sem ter sido usado em produção real — 1 dia de delta justifica reversão sem custo (ADR-0013 só configurou, nenhuma story foi escrita)

**Condição de revisitar:**

- Performance Storybook degradar dev server >5s no laptop alvo (M1/16GB) — voltar Ladle ou avaliar Histoire
- `@storybook/addon-mcp` parar de ser publicado/mantido — avaliar alternativas (`@akfm/storybook-mcp` community)

# 0013. Ladle como catálogo visual (não Storybook)

Date: 2026-05-17
Status: accepted

## Context

Pesquisa 14 (design-system-doc-pattern) sugere Ladle (Vercel-mantida). Onboarding-bio velho usava `app/preview/*` ad-hoc. Storybook é opção padrão indústria mas pesado (300+MB node_modules, slow dev server). Fonte: `_CONFLITOS.md #13`.

## Decision

**Ladle dia 0** — Vercel-mantida, leve (5× mais rápido que Storybook), sintaxe `*.stories.tsx` compatível pra migrar pra Storybook depois se necessário, MDX nativo, hot reload React 19 funcional.

Conteúdo dia 0: ~15 componentes shadcn customizados, 13 paletas OKLCH, logo system (3 variantes × 3 temas × 3 tamanhos), Motion presets (6 duration × 5 easing), skeleton/loading states, vaul bottom sheet, toggle Edit/Preview, NumberStepper, tab bar com indicator.

## Consequences

**Positivo:**
- Dev server <2s vs Storybook ~15s
- Stories formato compatível com Storybook (migração trivial se virar limite)
- Vercel-mantida = bom alinhamento com platform host

**Negativo:**
- Comunidade menor (menos addons, menos exemplos)
- Risco abandono (Vercel projeto secundário)
- Mitigação: stories já compatíveis Storybook

**Neutro:**
- Setup em `15-bootstrap-checklist.md §B6 tarefa 29`
- Estimativa setup + 15 stories: ~3h

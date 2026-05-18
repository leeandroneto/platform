# 0009. Critério premium: subset mais rico consistente

Date: 2026-05-17
Status: accepted

## Context

Pesquisas oscilam entre "minimalista limpo" (estilo Notion early) e "rico de recursos" (Linear, Vercel dashboard). Fundador quer app premium positioning competing com Trainerize US$ 30-80/mês. Fonte: `_CONFLITOS.md #9` + pesquisa 16 (visual premium).

## Decision

Tender sempre ao subset MAIS RICO mantendo consistência interna. Privilegiar recurso atual em produção sobre soluções legadas. Benchmarks: Linear, Vercel, Cal.com. Não buscar minimalismo extremo (não somos editor de texto).

Em conflito entre "feature menor mas suficiente" vs "feature maior e mais polida" → escolher o polido.

## Consequences

**Positivo:**

- Match com pricing premium (justifica R$ 100-300/mês)
- Concorrentes BR (Pacto, TreinoConectado) visualmente datados — diferencial
- Atrai profissional que cobra premium do aluno final

**Negativo:**

- Bundle maior (mitigado por budgets per-rota — ADR-0020)
- Curva de implementação mais lenta dia 0 (pipeline ~70h)

**Neutro:**

- 12 patterns visuais premium dia 0 (`05-design-system.md §12`)
- Cortado: confetti em milestone (pesquisa 16 marca [O], não-premium)
- 13 paletas OKLCH ricas (não 4 — D-G76)

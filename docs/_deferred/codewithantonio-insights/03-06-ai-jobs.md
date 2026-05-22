---
source: codewithantonio.com workshop #3 "SaaS AI Website Builder"
lesson: 06 — AI Jobs (~25min)
captured: 2026-05-22
density: baixa (~20% acionável)
related: ADR-0046 item 5 (AI Builders), ADR-0045 D.16 (Gemini Flash fallback), nextjs-vibe repo
---

# AI Jobs — insights destilados

## TL;DR

Setup mínimo `@inngest/agent-kit` + 1 agent OpenAI. 80% boilerplate.
Valor único: validação empírica de que **Gemini falha em tool calling**
(confirma research-45 D.16). Resto é fundamento `createAgent` API.

## Insights cravados

### 1. Provider reality check (do autor que rodou na prática)

- **OpenAI 4.1 + temperature 0.1** — escolha principal dele (reset de rate
  limit ~2s, raramente bate)
- **Claude Sonnet 3.5/4** — melhores resultados qualitativos, **rate limit
  brutal** (reset >24h, Anthropic prioriza enterprise) → inviável pra dev
- **Gemini** — **falha em tool calling** ("just errors all around")
- **Grok/xAI** — não testou, sem opinião forte

**Por quê importa pra nós:** valida AI Gateway com fallback chain
**Sonnet → Haiku → Gemini Flash** (research-45 D.16). Gemini só pra tarefas
sem tool calling (resumos, classification). Tool-heavy = Anthropic ou OpenAI.

### 2. `createAgent` API surface — único learn técnico

```ts
import { openai, createAgent } from '@inngest/agent-kit'

const agent = createAgent({
  name: 'code-agent',
  description: '...',
  system: '...', // system prompt
  model: openai({
    model: 'gpt-4.1',
    defaultParameters: { temperature: 0.1 }, // só OpenAI suporta
  }),
})

const result = await agent.run('user input')
// result.output[0].content → string ou Message[]
```

### 3. Output shape é polimórfico

`result.output[0].content` pode ser `string` OU `{ type: "text", text }[]`.
Precisa helper `parseAgentOutput()` (ver lição 19) pra normalizar.

### 4. Insight throwaway com peso arquitetural

> "Seu app fica 2x melhor só trocando o model novo"

Argumenta direto pelo AI Gateway com swap dinâmico — não atrelar agent
init a 1 provider hardcoded. Construir tudo via gateway desde dia 0.

## Mapeamento pro nosso projeto

| Lição dele                   | Adapt pra nós                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `openai({ model })` direto   | `gateway.languageModel("anthropic/claude-sonnet-4-6")` via AI SDK v6 + Vercel AI Gateway |
| `temperature: 0.1` hardcoded | Per-tool config (code-gen baixo, response-gen mais alto)                                 |
| Env `OPENAI_API_KEY`         | AI Gateway gerencia auth — env nossa só `AI_GATEWAY_API_KEY`                             |
| Demo gera React component    | Nosso AI Builder gera **specs** (Form/Page Engine JSON), não TSX                         |

## O que NÃO copiar

- Setup de conta OpenAI passo-a-passo (irrelevante — gateway)
- Demo summarizer 2-palavras (filler didático)
- Discussão "qual model escolher" (já cravamos via gateway)

## Cross-refs

- Lição 08 (Agent Tools) — sequência obrigatória, esse aqui é só prelúdio
- Research-45 D.16 — APCA soft warn + Gemini fallback policy
- `docs/_deferred/oss-references-by-feature.md` — Inngest + agent-kit entry
- Vercel AI Gateway (GA agosto 2025, session knowledge update)

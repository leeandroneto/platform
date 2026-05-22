---
source: codewithantonio.com workshop #3 "SaaS AI Website Builder"
lesson: 19 — Agent Memory (~26min)
captured: 2026-05-22
density: média (~60% acionável) — caveat do autor importante
related: ADR-0046 item 5 (AI Builders), ADR-0033 (schema único public), nextjs-vibe repo
---

# Agent Memory — insights destilados

## TL;DR

Padrão básico de history-injection via `createState(initial, { messages })`

- 2 agents auxiliares baratos (titleGen + responseGen) pra separar
  concerns. **Autor confessa que ordering asc/desc não é robusto** — não
  copiar literal, repensar pro nosso stack com SQL + LIMIT + summarization.

## Insights cravados

### 1. Memory pattern do agent-kit é injeção via `createState` 2º arg

```ts
const previousMessages = await step.run("get-previous-messages", async () => {
  const msgs = await db.messages.findMany({ where: { projectId }, orderBy: ... })
  return msgs.map(m => ({
    type: "text",
    role: m.role === "ASSISTANT" ? "assistant" : "user",
    content: m.content
  }))
})

const state = createState<AgentState>(
  { summary: "", files: {} },     // 1º arg: data
  { messages: previousMessages }  // 2º arg: history seed
)

const result = await network.run(input, { state })
network.defaultState = state      // também no network setup
```

**Insight chave:** `messages` no 2º arg é shape `Message[]` do agent-kit,
**não** estrutura arbitrária. Conversão DB → agent format é obrigatória.

### 2. State persiste o "que foi feito" entre iterações do MESMO request

`network.state.data` é mutável durante o loop. Tools escrevem
(`state.data.files[path] = content`), lifecycle escreve
(`state.data.summary = last`), router lê (`if (state.data.summary)`).
Diferente de `messages` (history cross-request).

### 3. Padrão 3-agent chain — separação de concerns

Após o code agent gerar (caro), 2 agents baratos finalizam:

```ts
// agent caro — code generation
const codeAgent = createAgent({ model: openai({ model: "gpt-4.1" }), tools: [...] })

// agent barato — gera título 3-palavras pro fragmento
const titleAgent = createAgent({ model: openai({ model: "gpt-4o" }), system: titlePrompt })

// agent barato — gera resposta human-friendly pro user
const responseAgent = createAgent({ model: openai({ model: "gpt-4o" }), system: responsePrompt })

// orquestração sequencial após network terminar
const result = await network.run(input)
const title = await titleAgent.run(result.state.data.summary)
const response = await responseAgent.run(result.state.data.summary)
```

**Para nós:** mapping direto pro AI Builder —

- code agent (Sonnet 4.6) gera spec Form/Page
- title agent (Haiku 4.5) gera nome do version
- response agent (Haiku 4.5) gera resposta UX no chat

### 4. `parseAgentOutput` helper — necessário (não opcional)

Output do agent-kit é `Message | Message[]` polimórfico. Helper:

```ts
function parseAgentOutput(value: Message[]): string {
  const out = value[0]
  if (out?.type !== 'text') return fallback
  return Array.isArray(out.content) ? out.content.map((c) => c.text).join('') : out.content
}
```

Sem isso, runtime errors silenciosos quando output muda shape entre runs.

## Caveat crítico do autor — não copiar literal

> "I keep thinking that maybe the way we are loading these previous
> messages maybe isn't perfect. You're going to have to tweak that a
> little bit. I will research off-camera and tell you in the next
> chapter if I find anything new."

Demo ao vivo mostrou AI confundindo "qual é a última mensagem"
múltiplas vezes. Ele adicionou `TODO: change to ascending if AI does
not understand`. **Pattern dele não é robusto pra produção.**

## Abordagem melhor pro nosso stack

| Aspecto      | Antonio (frágil)                | Nós (proposta)                                                                         |
| ------------ | ------------------------------- | -------------------------------------------------------------------------------------- |
| Storage      | Prisma `messages` table         | Supabase `conversations` + `conversation_messages` com RLS `tenant_id` (ADR-0033)      |
| Query        | `findMany` toda history         | `LIMIT N` configurável por feature + index em `(conversation_id, created_at)`          |
| Ordering     | `desc` empírico, autor inseguro | `asc` SQL + cravar via teste — older→newer é convenção LLM proven                      |
| Long context | Nenhuma estratégia              | Summarization-based memory (resumir mensagens >N via Haiku, manter últimas K verbatim) |
| Multi-tenant | Single user                     | RLS por tenant_id obrigatório — `getMessagesByConversation` valida no SQL              |

## Padrão sugerido (a cravar quando AI Builder entrar)

```ts
// lib/data/conversations.ts
export async function getConversationHistory(
  conversationId: string,
  opts: { limit?: number; summarizeOlder?: boolean } = {},
): Promise<Message[]> {
  const { limit = 20, summarizeOlder = false } = opts
  // RLS já filtra por tenant via JWT
  const msgs = await supabase
    .from('conversation_messages')
    .select()
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)
  // se summarizeOlder, fetch summary row + slice de últimas K
  return formatForAgentKit(msgs)
}
```

## O que NÃO copiar

- `findMany` sem LIMIT (vai escalar mal com chat longo)
- Ordering `desc` sem justificativa (fonte de confusion do próprio autor)
- Acoplar memory schema a Prisma single-tenant (nosso é RLS multi-tenant)

## O que copiar (com ajuste)

- Padrão de injeção via `createState(_, { messages })` — API agent-kit
- Padrão 3-agent chain (caro + 2 baratos) — economia de tokens significativa
- `parseAgentOutput` helper — necessário sempre, salva runtime errors

## Cross-refs

- Lição 06 (AI Jobs) — `parseAgentOutput` também usado lá
- Lição 08 (Agent Tools) — state vs messages distinction crítica
- ADR-0033 — schema único `public.*` (conversations + RLS)
- ADR-0046 item 5 — AI Builders, gatilho de consumo
- nextjs-vibe `src/inngest/functions.ts` getPreviousMessages step
- Research-44 — resumable-stream package pra streams longos (relacionado)

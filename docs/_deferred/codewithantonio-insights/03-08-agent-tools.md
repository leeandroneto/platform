---
source: codewithantonio.com workshop #3 "SaaS AI Website Builder"
lesson: 08 — Agent Tools (~47min)
captured: 2026-05-22
density: alta (~90% acionável) — OURO ABSOLUTO
related: ADR-0046 item 5 (AI Builders), ADR-0045 D.13 (invariante pages.kind), nextjs-vibe repo
---

# Agent Tools — insights destilados

## TL;DR

Blueprint completo do nosso AI Builder. Padrão `createTool` + Zod +
`step.run` wrapper (ganha retry Inngest). 3 tools mínimas
(terminal/createFiles/readFiles), system prompt strict com termination
marker, `onResponse` lifecycle + `createNetwork` com router custom +
`maxIter` safety. Padrão self-healing via stderr→retry comprovado em demo.

## Insights cravados

### 1. Tools rodam DENTRO de `step.run` — ganho arquitetural enorme

```ts
createTool({
  name: "terminal",
  parameters: z.object({ command: z.string() }),
  handler: async ({ command }, { step, network }) => {
    return await step?.run("terminal", async () => { ... })
  }
})
```

**Implicação:** cada tool call vira step Inngest durável → retry
automático, observabilidade, cancelamento, resume após crash. Sem esse
wrapper, falhas matam toda a iteração do agent.

### 2. Terminal tool — pattern self-healing via stderr feedback

Captura `stdout` + `stderr` em buffer separado, retorna **AMBOS** no erro:

```
command failed: <error>
stdout: <buffer.stdout>
stderr: <buffer.stderr>
```

AI lê stderr (ex: "peer dep conflict, use --legacy-peer-deps"), Inngest
retry com command corrigido → succeed. **Demo ao vivo provou:**
`react-beautiful-dnd` falhou primeira vez, AI re-rodou com
`--legacy-peer-deps`, segunda passou. Zero intervenção humana.

**Para nós:** errors de nossas tools (createForm/applyBlockPatch) devem
sempre retornar contexto rico (não só `"failed"`) pra AI auto-corrigir.

### 3. createOrUpdateFiles — state como OBJETO, não array

```ts
network.state.data.files = { [path]: content } // object
```

**Por quê:** agent pode chamar tool 50x. Array teria duplicatas, object
permite overwrite por path. Bug óbvio que evita armadilha.

**Para nós:** state de Form Engine specs deve ser `{ [blockId]: spec }`,
não array. Page Engine tree idem (chave = node id).

### 4. readFiles — anti-hallucination grounding

Tool puro de leitura. System prompt instrui: "se for usar componente
shadcn, leia o arquivo primeiro". Resultado: AI para de inventar APIs.

**Para nós:** tool `readBlockCatalog` que devolve o JSON gerado por
`@registry-meta` (ADR-0045 D.13). AI consulta antes de invocar block
inexistente.

### 5. System prompt com termination marker obrigatório

Padrão exato (não inventar):

```
You MUST end with:
<task_summary>
description of what was built
</task_summary>

If you omit or alter this, task is considered incomplete and will
continue unnecessarily.
```

**Por quê funciona:** dá ao router um sinal determinístico binário
(presente/ausente) pra quebrar loop. Sem isso, agent gira sem fim ou
para arbitrariamente.

**Não inventar variantes** (`<done>`, `<finished>` etc) — marker
escolhido é convenção interna, único requisito é ser único + raro no
texto natural.

### 6. Lifecycle `onResponse` — handoff entre agent e network

```ts
codeAgent.lifecycle = {
  onResponse: ({ result, network }) => {
    const last = lastAssistantText(result)
    if (last?.includes('<task_summary>')) {
      network.state.data.summary = last
    }
  },
}
```

Hook roda após cada response do agent. Detecta marker → grava no state.
Router lê state → quebra loop. **Separation of concerns:** agent só
gera texto, network decide continuar/parar.

### 7. `createNetwork` + custom router

```ts
const network = createNetwork({
  agents: [codeAgent],
  maxIter: 15,
  router: async ({ network }) => {
    if (network.state.data.summary) return // break
    return codeAgent // continue
  },
})
```

- `maxIter: 15` — safety net contra loops infinitos ("se passou de 15,
  algo errado")
- Router custom permite roteamento condicional entre múltiplos agents
  (ex: code agent → review agent → fix agent)
- `network.run(input, { state })` retorna `result.state.data`

### 8. Prompt engineering é iterativo e empírico — confissão do autor

Demo ao vivo: calculator falhou (esqueceu `"use client"`), autor debugou
prompt em tempo real, removeu regra conflitante ("never add use client
to layout"), retry succeeded.

**Insight cravado:** prompt é código, evolui via falhas reais em produção,
**não** é gerado uma vez pelo ChatGPT e cravado. Precisa versionamento

- eval loop (Promptfoo — research-44 cravou INSTALL JIT).

### 9. Regras "negativas" no prompt podem virar contra-produtivas

Ele tinha `"NEVER add 'use client' to layout.tsx"` que estava fazendo AI
**evitar use client em qualquer arquivo**. Remover a regra negativa
resolveu. Lição: rules devem ser **prescritivas** ("add use client when
using hooks"), não proibitivas globais.

## Estrutura mínima de tools pro nosso AI Builder

Mapeamento direto:

| Tool dele              | Tool nossa equivalente                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `terminal` (run shell) | `runDataMigration` (apply schema patch via Supabase RPC)                           |
| `createOrUpdateFiles`  | `applyFormSpec` / `applyPageSpec` (escreve em `forms_versions` / `pages_versions`) |
| `readFiles`            | `readBlockCatalog` + `readExistingSpec`                                            |
| —                      | **NOVO** `previewRender` (SSR snapshot pra AI validar visualmente antes de commit) |

## Substituições cirúrgicas pro nosso stack

- E2B sandbox → **Vercel Sandbox** (GA jan/2026, native platform)
- Files via E2B FS → Supabase RLS-aware writes via tools server actions
- Prompt Next.js-raw → prompt por Engine (Form/Page) com vocab nosso
- Provider OpenAI direto → **Vercel AI Gateway** com fallback
- **Manter exato:** `<task_summary>` marker, `onResponse` lifecycle, router
  pattern, `maxIter` safety, stderr-rich errors, state-as-object

## O que NÃO copiar

- System prompt literal dele (Next.js raw, single-tenant, sem RLS, sem
  vocab nosso) — só copiar **estrutura** (rules / file safety /
  termination marker)
- Clerk auth, Prisma schema, OpenAI hardcoded
- Demo passo-a-passo de bug fix de calculator (folclore)

## Caveats e armadilhas confessadas

- "Não sou prompt engineer" — prompt dele é base, **não** referência
- Comportamento AI varia entre runs ("for you maybe it worked first
  try") → eval suite obrigatória pra nós
- Anthropic rate limit pode bloquear tutorial inteiro → AI Gateway
  multi-provider mitiga

## Cross-refs

- Lição 06 (AI Jobs) — pré-requisito agent-kit basics
- Lição 19 (Agent Memory) — sequência: tools resolve "como agir",
  memory resolve "lembrar do contexto"
- ADR-0045 D.13 — invariante `pages.kind === registry-item.name`
  (catálogo lido por `readBlockCatalog`)
- Research-44 — Promptfoo cravado INSTALL JIT pra eval loop
- nextjs-vibe `src/inngest/functions.ts` — implementação fonte exata
- Vercel Sandbox (session knowledge update jan/2026)

# Doc Lifecycle para Solo Founder + Claude Code: Padrões, Tamanhos, Automação e CI

Pesquisa externa consolidada sobre práticas de documentação para produto PWA multi-tenant fitness B2B SaaS, stack Next.js 16 / React 19 / TypeScript / Tailwind v4 / Supabase / Zod 4, construído por solo founder com Claude Code, docs versionadas em repo e auditadas em CI via pnpm. Cada seção segue exatamente a estrutura do briefing (A–J), com recomendações justificadas por fontes da comunidade Anthropic, ADR community, Next.js/Supabase, e estudos sobre doc drift.

---

## A) Padrão de estrutura de documentação — recomendação: **Hybrid (C4-lite + ADR + Diátaxis "Reference" only)**

A pergunta pede "1 entre 5", mas a evidência empírica de repositórios open-source maduros aponta consistentemente que solo founders com AI-assisted dev se beneficiam de combinar 2–3 padrões em vez de adotar um puro. Trade-offs:

- **Diátaxis** (Tutorial / How-to / Reference / Explanation) é a referência moderna para docs voltadas a humanos. Já existem skills oficiais para Claude Code/Cursor/Windsurf que aplicam o quadrante automaticamente (`cachemoney/agent-toolkit`, `sammcj/agentic-coding`, `keithpatton/diataxis-agent-skill`). Ponto fraco para o contexto descrito: Tutoriais e Explanations pressupõem onboarding humano, que é zero aqui — 50–75% do framework fica vazio. A própria comunidade Diátaxis-AI alerta: "Diataxis é uma abordagem, não um template — não crie seções vazias só para ter os quatro quadrantes."
- **C4** (Context / Container / Component / Code) é leve, abstraction-first, renderiza nativamente em GitHub via Mermaid, é legível por LLM. O FAQ oficial enfatiza que é "designed to model a software system at various levels of abstraction", não um processo. Para solo founder, níveis 1 e 2 (Context + Container) cobrem 90% do valor; nível 4 (Code) é desperdício porque o código já é fonte da verdade.
- **arc42** é template completo (12 capítulos: contexto, restrições, building blocks, runtime view, deployment, crosscutting, quality, risks, decisions, glossário…). Excelente para sistemas regulados ou equipes médias; o FAQ arc42 reconhece que C4 é "mais leve" e que os dois são complementares. Para solo founder bootstrapped é overkill — você gasta tempo preenchendo capítulos vazios.
- **ADR-only** (Nygard) sozinho falha em fornecer mapa do sistema: você termina com 30 ADRs e nenhum lugar onde Claude entenda "o que é o produto e como os módulos se conectam".
- **Hybrid** é o que repos open-source maduros adotam na prática: Commanded, AWS ParallelCluster, SSW Clean Architecture Template, Lullabot, VMware Secrets Manager — todos misturam C4/arc42 como esqueleto + Log4brains/MADR para decisões + Diátaxis aplicado seletivamente.

**Recomendação para seu contexto:** **Hybrid mínimo = C4-lite (apenas níveis 1–2 em Mermaid dentro de `docs/core/architecture.md`) + ADR append-only (Nygard) + Reference-only de Diátaxis (auto-gerada).** Justificativas:

1. Claude Code lê docs a cada sessão e o que mais agrega é mapa do sistema + decisões + referência factual. Tutorial e Explanation em prosa não agregam quando não há humano novo entrando.
2. C4 Context + Container em Mermaid (≤100 linhas no total) responde "o que existe e o que conversa com o quê" — exatamente o que falta em uma sessão fria.
3. ADRs cobrem o "porquê" sem prosa em arquivos vivos — o anti-drift mais eficaz (Martin Fowler, Nygard, MADR e GDS Way concordam).
4. Reference auto-gerada (schema, routes, env vars, tokens) é a única parte de Diátaxis que cabe ali, e ainda assim sem prosa.

**Anti-recomendação:** não adotar arc42 completo nem Diátaxis com 4 quadrantes obrigatórios.

---

## B) Tamanhos máximos de documentos — ajustes baseados em evidência

| Arquivo                       | Proposto               | Recomendação ajustada                                           | Fundamento                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------- | ---------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CLAUDE.md raiz**            | 200 linhas             | **80–150 linhas alvo; 200 teto duro**                           | Bijit Ghosh (análise de dezenas de CLAUDE.md de produção, Medium May 2026): modelos seguem ~150–200 instruções, e o system prompt do Claude Code já ocupa ~50 slots, sobrando 100–150 utilizáveis; ≥200 linhas o modelo começa a dropar regras. HumanLayer: "consenso geral <300 linhas, mais curto é melhor; nosso root tem <60 linhas". Docs oficiais Claude Code (`code.claude.com/docs/en/memory`): "files over 200 lines consume more context and may reduce adherence". |
| **.claude/rules/\*.md**       | 100 linhas             | **80 linhas; quebrar em sub-rules se exceder**                  | Mesma lógica de competição por slots de atenção. Path-scoped rules só carregam quando relevante, então vale ter várias pequenas.                                                                                                                                                                                                                                                                                                                                              |
| **docs/core/architecture.md** | 500 linhas             | **300–400 linhas é mais sustentável**                           | Nygard: "Large documents are never kept up to date. Small, modular documents have at least a chance at being updated." 500 linhas é exatamente o threshold onde drift acelera. Se passar de 300, extraia diagramas para arquivos separados (`docs/diagrams/*.mmd`).                                                                                                                                                                                                           |
| **docs/core/decisions.md**    | 200 linhas (só ativas) | **150 linhas; ou eliminar e auto-gerar de `docs/adr/INDEX.md`** | Manter `decisions.md` à mão é fonte clássica de inconsistência com os ADRs. Melhor auto-gerar de `adr/*.md` ativas (ver C).                                                                                                                                                                                                                                                                                                                                                   |
| **docs/adr/NNNN-\*.md**       | ~80 linhas (1 página)  | **OK — alvo 60–100 linhas**                                     | Nygardian ADR é tipicamente "1 to 2 pages, short enough to read in a single sitting" (Martin Fowler bliki); comunidade converge em ~1 página A4 ≈ 60–80 linhas Markdown. MADR mínimo cabe em ~50 linhas.                                                                                                                                                                                                                                                                      |
| **docs/roadmap.md**           | 200 linhas             | **120–150 linhas; horizonte 3 meses apenas**                    | Roadmaps longos viram ficção. Limite a M0–M3 detalhado + bullets em "M4+ horizon" para o resto.                                                                                                                                                                                                                                                                                                                                                                               |
| **README.md**                 | 150 linhas             | **100–150 linhas é razoável**                                   | arxiv.org/pdf/2212.01479 (estudo de 3.000+ repos populares): 28,9% têm referências outdated _no momento da análise_ e 82,3% ficaram outdated em algum momento. Quanto maior o README, pior a chance de manutenção. Mantenha como "elevator pitch + quickstart + links", não documentação principal.                                                                                                                                                                           |

**Regra geral validada:** se um arquivo cresce além do teto, ou virou narrativa (extrair para ADR/file separado) ou virou referência (auto-gerar). Nunca expanda o teto — divida.

---

## C) Auto-gen de documentação — o que vale automatizar

Pesquisa cruzada (Supabase community, Anthropic docs, release-please, ecossistema Zod):

| Doc                                           | Veredito                                       | Como a comunidade faz                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **schema.md**                                 | ✅ **Auto-gerar**                              | `supabase gen types typescript` → tipos → `supazod` (recomendado pela comunidade Supabase; sucessor moderno do `supabase-to-zod`) gera schemas Zod a partir dos tipos. Script `pnpm docs:gen:schema` lê os tipos e emite Markdown tabular (tabelas, colunas, FKs). Sempre derivado de `supabase/migrations/*.sql`.                                                   |
| **api.md** (server actions/Zod)               | ✅ **Auto-gerar**                              | Walk em `app/**/actions.ts` ou `lib/actions/*.ts`, extrair schemas Zod por convenção (`export const xSchema = z.object(...)`) e emitir tabela. Padrão `zsa` ou Makerkit usa convenção `*.schema.ts` que torna trivial o glob. Catjam.fi (production retro Next.js+Supabase): "define type in zod and use z.infer for the TypeScript type" — Zod vira fonte canônica. |
| **routes.md** (`app/**/page.tsx`)             | ✅ **Auto-gerar**                              | Glob + AST simples ou string match em `export default`. Tabela: path, server/client, dynamic params, RSC vs client. Quase ninguém mantém manualmente em Next.js >50 rotas.                                                                                                                                                                                           |
| **components-index.md**                       | ✅ **Auto-gerar (lista) + manual (semântica)** | Listagem de paths + props pode ser auto via TS Compiler API ou `react-docgen-typescript`. A descrição de **quando usar cada um** fica em comentários JSDoc no próprio componente.                                                                                                                                                                                    |
| **tokens-index.md** (CSS/OKLCH)               | ✅ **Auto-gerar**                              | Parse de `tokens.css` ou theme Tailwind v4 → tabela com nome, valor OKLCH, fallback RGB. Manual é garantia de drift.                                                                                                                                                                                                                                                 |
| **env-index.md** (de `lib/env.ts` Zod)        | ✅ **Auto-gerar**                              | Padrão `@t3-oss/env-nextjs` ou Zod object simples; script lê AST/runtime e emite tabela. Uma das automações de maior ROI.                                                                                                                                                                                                                                            |
| **adr/INDEX.md** (ativas vs superseded)       | ✅ **Auto-gerar**                              | `adr-log` (CLI do ecossistema adr-tools) ou Log4brains fazem nativo, lendo frontmatter `status`. Manual é o anti-pattern #1 de ADR (links quebram quando ADR nova supersede antiga).                                                                                                                                                                                 |
| **CHANGELOG.md**                              | ✅ **Auto-gerar via release-please**           | Padrão de fato em 2025–2026. `googleapis/release-please-action` lê Conventional Commits, mantém Release PR contínuo, atualiza CHANGELOG, bumpa SemVer, cria GitHub Release ao merge. Suporta monorepo (linked-versions), hidden sections para `chore:`/`docs:`/`test:`. Manter CHANGELOG manual em projeto solo é desperdício comprovado.                            |
| **architecture.md** (diagramas + prosa)       | ⚠️ **Híbrido: prosa manual, diagramas auto**   | Diagramas Mermaid C4 podem ser regenerados de DSL Structurizr ou mantidos em `.mmd` separados com include. Prosa estrutural manual mas curta. Bitsmuggler/arc42-c4-example mostra esse padrão com docToolchain.                                                                                                                                                      |
| **decisions.md** (cherry-pick de ADRs ativas) | ✅ **Auto-gerar do INDEX**                     | Concatenar título + status + decisão (não consequences) de todas ADRs `status: accepted`. Re-deriva sempre que ADR é adicionada. Elimina drift entre "resumo" e ADRs canônicos.                                                                                                                                                                                      |

**Padrão consolidado:** crie um único `pnpm docs:gen` que orquestra todos os scripts (`docs:gen:schema`, `docs:gen:routes`, `docs:gen:env`, `docs:gen:tokens`, `docs:gen:adr-index`, `docs:gen:decisions`). CI executa `pnpm docs:gen && git diff --exit-code` para forçar sync.

---

## D) Markers de arquivo gerado — convenção canônica

A regra dominante vem do Go (issues golang/go#13560 e #41196: `"^// Code generated .* DO NOT EDIT.$"`), adotada por gerações de ferramentas (Prisma, GraphQL Codegen etc.):

**Forma canônica:** comentário de **uma linha**, começando com `Code generated` e terminando com `DO NOT EDIT.` (com ponto), antes da primeira declaração não-comentário. O `.*` permite inserir tool/versão/timestamp.

**Para Markdown** (seu caso), comentário HTML é o padrão de facto:

```markdown
<!-- Code generated by scripts/gen-schema.ts; DO NOT EDIT.
     Source: supabase/migrations/*.sql
     Regenerate: pnpm docs:gen:schema
     Generated: 2026-05-17T12:00:00Z -->

# Database Schema

...
```

**Alternativas observadas (e por que evitar):**

- **Frontmatter YAML** (`generated: true`, `source: ...`): funcional mas frequentemente ignorado por ferramentas que esperam o marker Go-style. Use frontmatter para metadados _adicionais_, mantenha o comentário HTML.
- **Linha de rodapé**: pega menos atenção, perdida em edições. Convenção Go explicitamente exige topo.
- **Marker em heading H1/H2**: polui o documento renderizado.

**Issues pedindo essa convenção em outros stacks:** dotansimha/graphql-code-generator#2131, vaadin/flow#6894, prisma/prisma1#3110, vectordotdev/vector#1256. Prisma adotou: `// Code generated by Prisma (prisma@1.17.0-beta.10). DO NOT EDIT.`

**Como linters forçam presença:** script `scripts/check-generated-markers.ts` no CI:

1. Lista todos os arquivos sob `docs/generated/**/*.md` (convenção: gerados em subpasta dedicada).
2. Para cada um, lê primeira linha não-vazia.
3. Falha se não bater regex `<!-- Code generated .* DO NOT EDIT`.

Alternativamente, custom rule `remark-lint` ou `markdownlint` pode aplicar regra equivalente.

**Recomendação final:** marker HTML no topo + diretório `docs/generated/` separado de `docs/core/` (manual) + `.gitattributes` marcando `docs/generated/** linguist-generated=true` para GitHub colapsar diffs.

---

## E) CI audit de documentação — checks da comunidade

Stack consolidada de workflows GitHub Actions 2025–2026, compatível com pnpm:

### 1. Links válidos

**Duas ferramentas dominam:**

- **lychee** (`lycheeverse/lychee-action`) — Rust, muito rápido, menor false-positive rate, usado pela equipe do Node.js. Cache, excludes, fail-on-empty.
- **markdown-link-check** (`gaurav-nelson/github-action-markdown-link-check`) — Node.js, padrão histórico, mas o repo original foi descontinuado em favor de `tcort/github-action-markdown-link-check`; também surgiu o **Linkspector** como sucessor moderno.

**Job típico (lychee, recomendado):**

```yaml
- name: Link Checker
  uses: lycheeverse/lychee-action@v2
  with:
    args: --root-dir "$(pwd)" --no-progress './**/*.md'
    fail: true
```

Boa prática: rodar em PR contra arquivos modificados (rápido) + cron semanal full-repo (detecta links externos que quebraram).

### 2. Tamanhos de arquivo

Script custom `scripts/check-doc-sizes.ts` lendo manifesto `.docsizerc.json` com os limites da seção B. Falha se exceder.

### 3. Sync de auto-gen

Padrão consolidado: `pnpm docs:gen && git diff --exit-code -- docs/generated/`. Se houver diff, alguém editou geradores ou fontes sem rodar regen.

### 4. ADR frontmatter válido

Script Zod parseando frontmatter de cada `docs/adr/*.md` contra schema com fields obrigatórios (status, date, supersedes…) — ver F. Log4brains também valida nativamente.

### 5. Vocabulary ban / prose linting

**Vale** (`errata.ai/vale`) é o padrão de facto. Permite styles customizados (palavras proibidas, voz passiva, terminologia consistente — ex.: forçar "Workspace" not "Project", caso típico em produtos multi-tenant). Roda local e CI via vale-action com reviewdog.

### 6. Markdown lint estrutural

**markdownlint-cli2** (DavidAnson) — checa headings consistentes, listas, line length.

### 7. Generated marker presente

Script da seção D.

### 8. Real-world GitHub Actions workflow consolidado

```yaml
name: Docs Audit
on:
  pull_request:
    paths: ['docs/**', 'CLAUDE.md', '.claude/**', 'README.md']
  schedule:
    - cron: '0 13 * * 1' # full check semanal
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - name: Doc sizes
        run: pnpm docs:check:sizes
      - name: Generated markers
        run: pnpm docs:check:markers
      - name: ADR frontmatter
        run: pnpm docs:check:adr
      - name: Auto-gen sync
        run: pnpm docs:gen && git diff --exit-code -- docs/generated/
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v16
      - name: Prose lint (Vale)
        uses: errata-ai/vale-action@reviewdog
      - name: Link check
        uses: lycheeverse/lychee-action@v2
        with: { args: --no-progress './**/*.md', fail: true }
```

---

## F) ADR append-only com supersedes — padrão validado

### Template Nygard canônico (Martin Fowler bliki + adr.github.io + Nygard 2011)

Cinco seções: **Title** (curto, número monotônico nunca reusado), **Status**, **Context** (forças neutras), **Decision**, **Consequences** (positivas E negativas explícitas).

### Frontmatter canônico recomendado (consolidando MADR + adr.github.io + GDS Way)

```yaml
---
id: 0007
title: Use Postgres as primary datastore
date: 2026-05-17
status: accepted # proposed | accepted | deprecated | superseded
deciders: [solo-founder] # opcional, útil quando crescer
supersedes: [] # array de IDs
superseded-by: null # ID da ADR substituta
tags: [database, supabase]
---
```

### Status values: 4 são suficientes?

**Sim — proposed / accepted / superseded / deprecated é o mínimo necessário e suficiente.** Confirmação cruzada de Martin Fowler, Nygard original, adr.github.io, hidekazu-konishi.com 2026 ("the four-state minimum"). Alguns adicionam `rejected` (decisão proposta e descartada antes de aceitar) — útil mas opcional para solo founder (pode simplesmente não commitar).

**Distinção crítica:**

- **superseded**: a _decisão_ foi substituída por nova ADR (escreva e linke).
- **deprecated**: a decisão deixou de aplicar mas nada a substitui (componente foi removido).

### Append-only — invariantes que a comunidade enforça:

1. Após `accepted`, **nunca** edite Context/Decision/Consequences — apenas Status. ctaverna.github.io: "the only part of the document that should evolve is the STATUS paragraph." Hidekazu-konishi: "Accepted has to be immutable in practice for the collection to be trustworthy."
2. Substituição = nova ADR + atualizar Status do antigo para `superseded` + cross-link.
3. Números nunca são reutilizados, mesmo após deprecation.

### Geração automática de INDEX.md

Script lê `docs/adr/*.md`, parseia frontmatter, emite:

```markdown
<!-- Code generated by scripts/gen-adr-index.ts; DO NOT EDIT. -->

# ADR Index

## Active

- [ADR-0007 Use Postgres as primary datastore](./0007-postgres.md) — 2026-05-17
- [ADR-0009 Multi-tenant via schema-per-tenant](./0009-tenancy.md) — 2026-06-02

## Superseded

- [ADR-0003 Use SQLite for MVP](./0003-sqlite.md) — superseded by ADR-0007
```

`adr-log` faz isso pronto seguindo convenção adr-tools. Log4brains é mais completo (site estático, mas pode ser excessivo para solo).

### Ferramentas comparadas

| Ferramenta                    | Pontos fortes                                                                                                   | Pontos fracos               | Veredito                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| **adr-tools** (npryce, shell) | Padrão histórico, simples, cria templates                                                                       | Sem site/visualização, Bash | Bom como ground truth dos comandos (`adr new`, `adr link`)                                  |
| **adr-log**                   | Gera INDEX.md automático                                                                                        | Faz só índice               | ✅ Ideal para CI sem overhead                                                               |
| **adr-viewer**                | Site estático leve                                                                                              | Pouco mantido               | ⚠️ Considere log4brains                                                                     |
| **Log4brains**                | npm install, init wizard, MADR default, site estático Next.js, suporta supersedes nativamente, publicação CI/CD | Mais peso, opinionated      | ✅ Melhor se quiser site público (vsecm.com, commanded.github.io, AWS ParallelCluster usam) |

**Recomendação solo founder:** adr-tools (CLI) + adr-log (índice) por padrão. Migre para Log4brains apenas se quiser publicar knowledge base externamente.

---

## G) Hierarquia de fonte da verdade com Zod + Supabase migrations

A hierarquia proposta tem o sentido geral correto, mas precisa de dois ajustes confirmados pela comunidade (Catjam.fi production retro Next.js+Supabase, Makerkit, supazod):

### Hierarquia revisada (top = mais autoritativa)

1. **`supabase/migrations/*.sql`** — fonte canônica do **schema do banco**. Migrations são imutáveis após aplicadas em prod; o estado do DB é produto delas. Catjam.fi confirma uso de migrations + e2e contra Supabase real (vs mocks).
2. **Tipos gerados (`types/database.ts` via `supabase gen types`)** — derivados de #1, regenerados em CI. Não editáveis.
3. **`lib/contracts/*.ts` (Zod schemas)** — fonte canônica dos **contratos de aplicação** (server actions input, API payloads, formulários). Para tabelas, podem ser gerados via `supazod`/`supabase-to-zod` a partir de #2 e refinados com transforms. Catjam: "define type in zod and use z.infer for the TypeScript type."
4. **Código (testes + tipos TypeScript)** — comportamento canônico; testes E2E contra Supabase local são ground truth de runtime.
5. **`docs/adr/*.md`** — fonte canônica do **porquê** de decisões estruturais.
6. **`.claude/rules/*.md`** — convenções operacionais path-scoped ("ao tocar `app/(auth)/**`, sempre…").
7. **`CLAUDE.md`** — contrato comportamental global Claude ↔ projeto (não é documentação; é instrução).
8. **`README.md`** — voltado a humano externo (você daqui a 6 meses, eventualmente investidor/dev contratado).

### Ajustes vs. proposta original

- A ordem original colocou "Código" acima de Zod schemas, mas em projetos Zod-first o schema **define** os tipos (`z.infer<typeof schema>`) e portanto está acima do código bruto. Regra prática: se TS type e Zod schema discordam, **Zod ganha**.
- Faltava o nível das **migrations SQL** acima de tudo. Em Supabase, a migration é declarativa e irreversível; tudo deriva dela.
- Faltava o nível dos **tipos gerados** entre SQL e Zod — explicitá-lo evita o anti-pattern de manter Zod schemas escritos à mão para tabelas DB (sempre driftam).

### Anti-pattern crítico relacionado

Catjam.fi (production retro): tentar usar RLS para tudo e mockar Supabase em testes "sounds good in theory" — não funciona em produção. RLS apenas para reads, writes via server actions com service role. Isso impacta a doc: o `docs/adr/` precisa registrar essa decisão explicitamente.

---

## H) Estratégia de memória Claude Code sustentável

### Realidade do filesystem (docs oficiais Claude Code, May 2026)

Claude Code mantém memória em dois lugares distintos:

1. **CLAUDE.md files** (instruções escritas por você): root, nested (`<dir>/CLAUDE.md`), local (`CLAUDE.local.md` gitignored), global (`~/.claude/CLAUDE.md`). Carregadas via directory walk no início. Aditivas, não substitutivas. Root sobrevive `/compact`; nested não (recarregam quando Claude lê arquivos nesse dir).
2. **Auto memory** (`~/.claude/projects/<project>/memory/`): notas que Claude escreve sozinho desde v2.1.59. Ligado por default. Toggle via `/memory` ou `autoMemoryEnabled` em settings.

### Limite prático

- Files >200 linhas degradam aderência (oficial Anthropic).
- 80–150 linhas é o sweet spot consolidado pela comunidade (HumanLayer <60; Bijit Ghosh 80–120; Anthropic informal <300).
- `claudeMdExcludes` configurável em qualquer settings layer; managed policy CLAUDE.md não pode ser excluído.

### Quando arquivar memory files antigas

A pesquisa mais detalhada (Pawel Huryn + Young Leaders #98, Mar–May 2026; Gul Jabeen Mar 2026) mostra três estratégias adotadas por solo devs em projetos longos:

**Estratégia A — Estrutura `.claude/memory/` versionada (recomendada para solo founder)**

```
.claude/memory/
  memory.md          # index com tabela de Last updated
  general.md         # cross-project conventions
  tools/             # ferramenta-específico
  domain/            # domain knowledge staging area
```

Regra: `memory.md` é o índice. Cada arquivo é fonte canônica de um tópico. Instrua Claude (via CLAUDE.md) a ler o index no início, carregar só o necessário, e gravar aprendizados em arquivos específicos.

**Estratégia B — Promotion lifecycle (Anthropic-aligned)**

Domain knowledge segue ciclo:

1. **Staging** — conhecimento acumula em `domain/{name}/`.
2. **Promotion** — quando há massa crítica, vira plugin/skill (`.claude/skills/`).
3. **Pointer** — o memory file antigo vira ponteiro de 2 linhas para o plugin.

**Estratégia C — Auto-arquivamento por idade**

Hook PreToolUse (Python) injeta apenas arquivos com `Last updated` <90 dias; resto vai para `archive/`. Útil em projetos 12+ meses.

### Como evitar acúmulo em `~/.claude/projects/`

1. **Revisão trimestral** com `find ~/.claude/projects/<proj> -name "*.md" -mtime +90`.
2. **Auto memory toggle off em sub-projetos descontinuados.**
3. **Promotion lifecycle:** conhecimento recorrente deve subir para `.claude/skills/` (versionado no repo).
4. **`/memory` regularmente** para auditar o que Claude está carregando. Bijit Ghosh: "Always check /memory before concluding that a rule is being ignored."

### MEMORY.md index strategy

Convenção emergente:

```markdown
# Memory Index

Read this file at session start. Load specific topic files only when relevant.

| File                   | Description                      | Last updated |
| ---------------------- | -------------------------------- | ------------ |
| general.md             | Cross-project conventions        | 2026-05-10   |
| tools/pnpm.md          | pnpm workflow notes              | 2026-04-22   |
| domain/multi-tenant.md | Multi-tenant fitness B2B context | 2026-05-15   |
```

Reduz contexto inicial (Claude lê só o index, ~30 linhas) e carrega resto sob demanda. Confirmado pela doc oficial: "Splitting into @path imports helps organization but does not reduce context, since imported files load at launch" — portanto, **não** use `@imports` para tudo no CLAUDE.md raiz; use referências em memory.md que Claude lê condicionalmente.

### Práticas de solo devs em projetos longos (consolidado)

- Root CLAUDE.md **thin** (≤150 linhas): só product-wide imperatives.
- `.claude/rules/*.md` path-scoped pequenos (≤80 linhas).
- `.claude/memory/memory.md` com tabela de Last updated; auditoria trimestral.
- Auto memory ligado, com revisão mensal de `~/.claude/projects/<proj>/memory/`.
- Skills/plugins para padrões maduros recorrentes (Diátaxis skill é exemplo público).

---

## I) Anti-patterns de doc lifecycle confirmados pela comunidade

Cada um documentado em fontes técnicas (Gaudion, Bairesdev, Okoone, IEEE 11196773, arxiv 2212.01479, Improvementsoft, Wikibooks, Anti-pattern Wikipedia):

1. **Documentation Drift**: doc deixa de refletir código sem crash visível. arxiv estudou 3.000+ repos populares e encontrou **28,9%** com referências outdated no momento da análise e **82,3%** ficaram outdated em algum momento. Sem CI check, drift é estatisticamente garantido.
2. **Decisões em prosa em vez de ADR**: mistura "o que" e "o porquê" no mesmo arquivo longo. Nygard: "Large documents are never kept up to date." Ao reabrir `architecture.md` 6 meses depois e mudar decisão sobre RLS, você edita a prosa sem registrar o porquê — perdendo a história. ADRs append-only previnem.
3. **Schema desatualizado**: documentação manual de schemas é caso #1 de drift silencioso. Solução: auto-gerar de migrations + CI sync check.
4. **ADR editado depois de aceito**: quebra a propriedade fundamental de "trustworthy collection" (hidekazu-konishi). Comunidade unânime: ADR é append-only após `accepted`; só Status muda. CI deve checar (git blame em ADRs accepted).
5. **Auto-gen sem CI check**: pior que não auto-gerar, porque cria falsa sensação de sync. CI obrigatório: `pnpm docs:gen && git diff --exit-code`.
6. **Links sem validação**: 28,9% dos repos têm links quebrados em algum momento. lychee/markdown-link-check no CI é tabela.
7. **Quality drift por copy-paste**: Improvementsoft documenta: "writer copies formatting from existing topic; old topic was written before current style guide; new topic inherits old conventions." Em projetos Claude-assisted é **especialmente perigoso** porque Claude tende a imitar padrões existentes. Vale + rules em `.claude/rules/` mitigam.
8. **Lava Flow doc**: docs antigas que ninguém ousa deletar (Paul's blog, Wikibooks). Solução: data de `Last updated` visível, alerta automático para arquivos sem touch >180 dias.
9. **Boat Anchor doc**: doc preparada para feature nunca lançada (Bairesdev). Não escrever doc até a feature mergear é pragmático em solo.
10. **Magic Pushbutton documentation**: README gigante que esconde toda a complexidade (Bairesdev). Fragmente.
11. **Onboarding-only mindset**: escrever docs como se um humano fosse ler do zero, quando o consumidor real é Claude Code. Verboso para Claude, idealizado demais para humano. Diátaxis Reference + ADR + C4-lite é mais honesto.
12. **Vocabulary inconsistency**: usar "user" / "member" / "trainee" intercambiavelmente. Vale + glossário em `.claude/rules/vocabulary.md`.

---

## J) Doc lifecycle por estágio de projeto (solo founder)

Síntese de práticas observadas em repos open-source maduros + retros de solo founders (catjam.fi Next.js+Supabase production, glassboxmedicine 2026 post-mortem, Mario Peshev, MVP-development.io). Princípio constante: **adicione doc apenas quando a falta dela está custando**.

### Bootstrap (semana 1)

**Mínimo viável — não escreva mais do que isto:**

- `README.md` (≤100 linhas): elevator pitch, stack, `pnpm install && pnpm dev`, links para `docs/`.
- `CLAUDE.md` (≤80 linhas): stack, conventions, "always run pnpm typecheck before commit", terminologia do produto.
- `.claude/rules/`: vazio ou 1 arquivo.
- `docs/adr/0001-stack-choice.md`: por que Next.js 16 / Supabase / Zod 4.
- `lib/env.ts` (Zod) — sem doc separada ainda.

**Não escreva ainda:** architecture.md, decisions.md cherry-pick, roadmap, components-index. Pré-otimização.

### M0–M1 (1–2 meses, primeira validação)

**Adicionar conforme dor real:**

- `docs/core/architecture.md` (≤200 linhas): C4 Context + Container em Mermaid; seção "Multi-tenant model" (decisão crítica do produto).
- `docs/adr/`: 3–6 ADRs cobrindo decisões estruturais (tenancy model, auth flow, RLS-vs-server-actions, payment provider).
- `.claude/rules/server-actions.md`: convenções (Zod-first, error handling).
- `scripts/docs:gen:env` + `docs/generated/env-index.md`: primeira automação.
- CI: markdown-link-check + size check.

### M2–M3 (3–6 meses, scaling features)

**Adicionar:**

- `scripts/docs:gen:schema`, `docs:gen:routes`, `docs:gen:adr-index`. Tudo sob `docs/generated/`.
- `docs/generated/decisions.md` (cherry-pick de ADRs ativas).
- CI sync check (`pnpm docs:gen && git diff --exit-code`).
- Vale com vocabulário banido (terminologia consistente).
- release-please configurado, CHANGELOG.md automatizado.
- `.claude/rules/` cresce para 3–5 arquivos path-scoped.
- `.claude/memory/memory.md` com index manual de aprendizados (se Auto memory começou a poluir).
- `docs/roadmap.md` (≤150 linhas; horizonte 3 meses).

### M4+ (6 meses+, sustentação e possível 1ª contratação)

**Adicionar:**

- Reorganização Diátaxis Reference: separar `docs/core/` (manual, raro mudar) de `docs/generated/` (auto, sempre fresh) de `docs/adr/` (append-only) de `docs/explanation/` (apenas se houver complexidade não-óbvia — ex.: modelo multi-tenant com edge cases).
- Promotion de memory files maduros para `.claude/skills/`.
- Auditoria trimestral: `find docs -mtime +180` para identificar lava flow.
- Considerar Log4brains se quiser publicar ADRs externamente (investidores, contratações).
- `CONTRIBUTING.md` apenas se vier 1ª contratação (cobre o que CLAUDE.md cobre, mas para humano).
- Backups de `~/.claude/memory/` em repo separado se virou crítico.

**Em todos os estágios:** se você não consegue justificar um doc em "quem lê isso e quando", delete. Bairesdev/Okoone documentam que technical debt em documentação é tão real quanto em código.

---

## Recomendação consolidada para seu projeto

1. **Estrutura híbrida**: C4-lite (Mermaid em `docs/core/architecture.md`, níveis 1–2) + ADR Nygard append-only em `docs/adr/` + Reference auto-gerada em `docs/generated/`. Nada de Diátaxis Tutorial/Explanation/How-to em prosa.
2. **Tamanhos**: CLAUDE.md 150/200, rules 80, architecture 300, ADR 80, roadmap 150, README 100–150. Auditados em CI.
3. **Auto-gerar tudo que deriva de código** (schema, routes, env, tokens, ADR INDEX, decisions cherry-pick, CHANGELOG) sob `docs/generated/` com marker HTML `Code generated ... DO NOT EDIT.`
4. **Marker canônico**: comentário HTML topo + diretório separado + `.gitattributes linguist-generated`.
5. **CI obrigatório**: lychee (links), markdownlint-cli2, Vale (vocabulário), Zod schema check em ADR frontmatter, `pnpm docs:gen && git diff --exit-code`, size check, generated marker check.
6. **ADR**: Nygard 5 seções, frontmatter MADR-style com supersedes, adr-tools + adr-log para índice; migre para Log4brains se quiser site público.
7. **Hierarquia de verdade**: migrations SQL > tipos gerados > Zod contracts > código/testes > ADRs > rules path-scoped > CLAUDE.md global > README.
8. **Memória Claude**: root CLAUDE.md thin, `.claude/rules/` path-scoped pequenos, `.claude/memory/memory.md` index com Last updated, promotion lifecycle (memory → skill), auditoria trimestral.
9. **Anti-patterns prioritários desde dia 1**: drift de schema (CI sync), ADR editado após accepted (CI git blame check), prosa em vez de ADR, vocabulary inconsistency (Vale).
10. **Lifecycle por estágio**: bootstrap mínimo (README + CLAUDE.md + 1 ADR), M0–M1 (architecture + 5 ADRs + 1 auto-gen), M2–M3 (full auto-gen + release-please + Vale), M4+ (reorganização Diátaxis Reference + memory promotion).

Esta combinação equilibra lean (cabe em solo founder), anti-drift (auto-gen + CI), AI-friendly (Claude lê estruturas curtas canônicas), e sustentável 6–12+ meses (append-only ADR + promotion lifecycle de memória).

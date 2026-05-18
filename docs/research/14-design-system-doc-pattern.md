# Pesquisa Externa — Bloco 7: Design System Docs para PWA Fitness B2B SaaS

**Stack alvo:** Next.js 16 App Router · React 19 · TS 5 strict · Tailwind v4 CSS-first `@theme` · shadcn new-york dark-first · Motion 12 · pnpm 10 · Vitest · Playwright · Vercel
**Operação:** solo founder + Claude Code como dev principal (sem time humano, sem designer separado)

> Esta pesquisa prioriza fontes oficiais (code.claude.com, tailwindcss.com, nextjs.org, storybook.js.org, GitHub) e posts técnicos 2024–2026. Sinalizo onde encontrei bugs conhecidos, divergências entre fontes ou conteúdo especulativo.

---

## A) `decisions.md` — formato e processo

### A1. Formato mais adotado para decisões táticas de DS

Não existe um padrão "decisions.md" único e canônico distinto do ADR. O que predomina em 2024–2025 é uso de **MADR (Markdown Architectural Decision Records)** como template enxuto, **organizado por subdiretórios** (`docs/decisions/ui/`, `docs/decisions/backend/`).

- O repo **adr/madr** (github.com/adr/madr) documenta o padrão e mostra explicitamente a opção de categorizar decisões por subpasta (ex.: `decisions/backend/0001-use-quarkus.md`, `decisions/ui/0001-use-vuejs.md`); numeração local por categoria.
- **Backstage** (Spotify, backstage.io/docs/architecture-decisions) usa `docs/architecture-decisions/` com regra estrita "nunca deletar, marcar superseded/deprecated".
- O **Microsoft Code-with-Engineering Playbook** (microsoft.github.io/code-with-engineering-playbook) recomenda manter um `decision-log.md` **adicional** ao lado dos ADRs — arquivo único com tabela markdown sumarizando metadata (ID, título, status, data, link). Esse `decision-log.md` é o equivalente mais próximo de "decisions.md tático".

**Recomendação para solo:** dentro de `docs/design/decisions.md` use **um único arquivo append-only com tabela de sumário + seções por entrada**, e promova para ADR completo (`docs/adr/NNNN-*.md`) quando a decisão for difícil de reverter. Isso evita explosão de arquivos pequenos.

### A2. YAML frontmatter por entry

Sim, há precedente forte. MADR documenta a própria decisão `0013-use-yaml-front-matter-for-meta-data.html` (adr.github.io/madr), adotando frontmatter:

```yaml
---
status: accepted
decision-makers:
date: 2024-…
---
```

Ferramentas que **consomem** o frontmatter na prática:

- **Jekyll / Just-the-Docs** (renderiza o site MADR via `parent: Decisions`, `nav_order:`, `title:`).
- **markdownlint** valida estrutura.
- Scripts custom (Node/Python) extraem frontmatter para gerar índices.
- **Cursor / Claude Code** leem frontmatter como contexto adicional (ver B).

Para solo + Claude Code, frontmatter rende o melhor ROI quando você adiciona `tags:` semânticos (ex.: `tags: [tokens, color, oklch]`) — Claude consegue grep/priorizar contexto baseado em tags.

### A3. Diferença prática: decisions.md tático vs ADR Nygard-style

| Eixo                 | decisions.md tático (DS)                                    | ADR arquitetural (Nygard)                     |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| Escopo               | Componente, token, paleta, ícone, animation                 | Estrutura do sistema, contratos, persistência |
| Reversibilidade      | Reversível em horas                                         | Difícil/caro reverter                         |
| Granularidade        | Muitas entries pequenas (15–80 linhas)                      | Poucos arquivos densos                        |
| Critério de promoção | Quando 2+ componentes dependem, ou ferramenta de build muda | Sempre                                        |

Template Michael Nygard (Context / Decision / Consequences / Status) **permanece a base canônica** — MADR e Backstage apenas estendem com YAML metadata. **Promova para ADR** quando uma decisão de DS começar a impactar build, CI, deploy ou contratos públicos (trocar Motion 12 por Framer Motion → vira ADR; trocar `--color-accent` de oklch para hsl → fica em decisions.md).

### A4. Append-only e "superseded"

**Append-only é universal.** Múltiplas fontes confirmam:

- **Microsoft Well-Architected (2024):** _"The ADR serves as an append-only log. Don't go back and edit accepted records. If a decision changes, write a new record that supersedes the original and link the two together."_
- **Backstage:** _"Records are never deleted but can be marked as superseded by new decisions or deprecated."_
- **ctaverna.github.io/adr:** _"The document should be managed with an append-only approach. […] the only part of the document that should evolve is the STATUS paragraph."_

Best practices 2024–2025:

1. Status canônicos: `proposed | accepted | rejected | deprecated | superseded by ADR-NNNN`.
2. **Cross-links bidirecionais** entre entries relacionadas.
3. Datear toda mudança de status (a única edição permitida no corpo).
4. Em projetos solo, é razoável fazer "supersede inline" no mesmo `decisions.md` quando a entry é pequena — basta nova entry com `Supersedes: 2024-03-12 Accent palette v1`.

---

## B) `CLAUDE.md` e `.claude/rules/` para Design System

### B1. `paths:` frontmatter e escopo por glob

**Documentação oficial** (code.claude.com/docs/en/memory):

```yaml
---
paths:
  - 'src/api/**/*.ts'
---
```

> _"Rules can be scoped to specific files using YAML frontmatter with the `paths` field. These conditional rules only apply when Claude is working with files matching the specified patterns. Rules without a `paths` field are loaded unconditionally. Path-scoped rules trigger when Claude reads files matching the pattern, not on every tool use."_

Múltiplos patterns + brace expansion são suportados:

```yaml
---
paths:
  - 'src/**/*.{ts,tsx}'
  - 'lib/**/*.ts'
---
```

**Para o seu caso (DS só quando edita componentes):**

```yaml
---
paths:
  - 'components/**/*.tsx'
  - 'app/**/*.tsx'
  - 'src/styles/**/*.css'
---
```

⚠️ **Bugs conhecidos / armadilhas críticas (issues abertas anthropics/claude-code, set–nov 2025):**

1. **Issue #23478** — _"Path-based rules with `paths:` are only injected when Claude reads a file matching the pattern, not when it writes/creates one."_ Regras de criação (ex.: "todo componente novo deve usar `forwardRef`") são silenciosamente ignoradas no `Write` tool. **Workaround:** duplicar regras críticas de criação em `CLAUDE.md` raiz (sempre carregado) ou usar PostToolUse hook.
2. **Issue #17204** — A documentação mostra `paths: **/*.ts` (não-quoted), mas `*` é caractere reservado em YAML. **Sempre use aspas:** `paths: ["**/*.ts"]`.
3. **Issue #16853** — Em algumas versões, rules em subpastas de `.claude/rules/` (ex.: `.claude/rules/api/api-rules.md`) não são carregadas mesmo com `paths:` correto. Sintoma: ausentes em `/context`. Solução: manter rules em `.claude/rules/` raiz e validar via `/memory`.
4. **Issue #21858** — User-level rules (`~/.claude/rules/`) com `paths:` não funcionam consistentemente; só project-level é confiável.
5. **Issue #13905** — Alias `globs:` (não documentado, mas funciona em algumas versões — herança Cursor). Não dependa dele; use `paths:` com strings quoted.

**Verifique sempre com `/memory` ou `/context`** quais arquivos Claude carregou. Não confie em "deveria funcionar".

### B2. Tamanho ideal de rule files

**Confirmado pela documentação oficial (code.claude.com/docs/en/memory):**

> _"Size: target under **200 lines** per CLAUDE.md file. Longer files consume more context and reduce adherence. […] Files over 200 lines consume more context and may reduce adherence. Use path-scoped rules to load instructions only when Claude works with matching files."_

⚠️ A premissa do briefing era "<100 linhas" — **a documentação oficial é mais generosa: <200 linhas**. Para regras path-scoped que carregam só quando relevante, 80–150 linhas é confortável; **acima de 200 começa a degradar adesão**. Dica oficial adicional: _"Splitting into @path imports helps organization but does not reduce context, since imported files load at launch"_ — dividir em N arquivos pequenos só ajuda se forem path-scoped.

Auto memory (escrita por Claude) carrega só **first 200 lines or 25KB** — outro indicador do tamanho-alvo saudável.

### B3. Exemplos reais de CLAUDE.md / rules para Design Systems

Não há repo "canônico" amplamente referenciado, mas padrões emergentes documentados:

- **joseparreogarcia.substack.com/p/how-claude-code-rules-actually-work** (2026) — layout típico:
  ```
  project/
  ├── CLAUDE.md
  └── .claude/rules/
      ├── python-style.md
      ├── experiments.md
      └── data-privacy.md
  ```
- **paddo.dev/blog/claude-rules-path-specific-native** — compara `paths:` (Claude) vs `globs:` (Cursor) e sugere `AGENTS.md` como source-of-truth com symlinks (`ln -s AGENTS.md CLAUDE.md`).
- **matchkit.io/blog/design-tokens-tailwind-v4** — caso prático: _"Switching to CSS-first tokens makes AI tools more reliable [because] Claude Code and Cursor read CSS natively."_ O autor mantém regras em `.claude/rules/design-tokens.md` com `paths: ["**/*.tsx", "**/*.css"]` apontando para `globals.css` como source-of-truth.
- **steipete/agent-rules** e **rulesync** — repos OSS que mantêm regras tool-agnostic.

Padrão recomendado para seu DS:

```
.claude/
├── CLAUDE.md                          # 50–80 linhas: índice + sempre-on
└── rules/
    ├── ds-components.md               # paths: components/**, app/**
    ├── ds-tokens.md                   # paths: src/styles/**, globals.css
    ├── ds-motion.md                   # paths: components/**/*.tsx
    └── ds-testing.md                  # paths: **/*.test.ts, **/*.spec.ts
```

### B4. PreToolUse hooks: ler `decisions.md` antes de editar componentes

**Documentação oficial:** code.claude.com/docs/en/hooks e platform.claude.com/docs/en/agent-sdk/hooks.

Comportamento relevante:

- PreToolUse hooks recebem `tool_name`, `tool_input`, `tool_use_id` via stdin (JSON).
- A partir de **v2.0.10**, podem **modificar tool inputs** antes da execução (não apenas bloquear).
- A partir de **v2.1.9+** podem retornar `additionalContext` para injetar contexto extra que o modelo verá.
- Exit code **2** bloqueia + envia stderr de volta a Claude como erro.
- Matcher é regex contra nome do tool (`Edit|MultiEdit|Write`), **não** contra file path — para filtrar por path, inspecione `tool_input.file_path` dentro do hook.

**Setup concreto para "ler decisions.md antes de editar componentes":**

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [{ "type": "command", "command": ".claude/hooks/inject-ds-context.sh" }]
      }
    ]
  }
}
```

`.claude/hooks/inject-ds-context.sh`:

```bash
#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [[ "$FILE" == *components/* || "$FILE" == app/*.tsx ]]; then
  # v2.1.9+: additionalContext via JSON em stdout (exit 0)
  jq -n --rawfile decisions docs/design/decisions.md \
        --rawfile tokens   src/styles/globals.css \
    '{additionalContext: ("DESIGN DECISIONS:\n" + $decisions + "\n\nACTIVE TOKENS:\n" + $tokens)}'
fi
```

Referências da comunidade: **karanb192/claude-code-hooks** e **disler/claude-code-hooks-mastery** (GitHub) coletam padrões prontos (`protect-tests`, `branch-guard`, `auto-format`, `context-snapshot`). GitButler também documenta um exemplo prático (docs.gitbutler.com/features/ai-integration/claude-code-hooks).

⚠️ **Caveat:** injeção via `additionalContext` consome tokens cada vez que um arquivo de DS é tocado. Para `decisions.md` que crescer além de ~150 linhas, injete só as últimas N entries ou só as `status: accepted`.

---

## C) Storybook 9 vs alternativas para solo dev + AI coding

### C1. Storybook 9 (jun/2025) — principais mudanças

Fontes: storybook.js.org/releases/9.0, storybook.js.org/blog/storybook-9-beta, InfoQ jul/2025, Talent500.

- **Bundle 48% menor** que Storybook 8; instalação mais rápida; dependências pre-bundled.
- **Storybook Test** (parceria com Vitest): widget único roda interaction + accessibility + visual tests + coverage em todos os stories.
- **`@storybook/nextjs-vite`** (Vite-powered) recomendado oficialmente sobre `@storybook/nextjs` (Webpack) para projetos novos.
- React 19 / RSC suportados (com a ressalva: stories são client-side; RSC reais precisam de mocks).
- Tags-based organization (alpha, deprecated, feature-flag) + story globals (theme, viewport, locale).
- **Storybook 9.1 (jul/2025):** `sb.mock` API, automocking, Tailwind v4 fixes em Angular, melhorias de upgrade em monorepos.
- Pre-bundling trade-off confirmado pelo contribuidor Jeppe Reinhold (Bluesky, via InfoQ): algumas dependências não podem mais ser patched pelo consumer.

**Overhead para solo dev:** cold start medido por terceiros em ~8s (Storybook 10 num post dev.to "themachinepulse" dec/2025) vs ~1.2s do Ladle. Configuração inicial é "1 comando" mas integração Tailwind v4 + shadcn + tema dark-first exige debug (ver problema típico em medium.com/@sagardhami2001 sobre `@source` para shadcn lib em consumer apps).

**Vale para solo dev?** Provavelmente **não** se o objetivo é documentação visual interna de DS pequeno (10–40 componentes). ROI do Storybook aparece quando: (a) visual regression em CI; (b) compartilhar UI isolada com stakeholders não-devs; (c) interaction tests profissionais. Para Claude Code, Storybook tem **valor próximo de zero** porque Claude lê código direto — stories viram overhead de manutenção.

### C2. Alternativas

| Ferramenta                                | Tipo                      | Setup                                 | Foco                                     | Status 2025                                                                                              |
| ----------------------------------------- | ------------------------- | ------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Ladle**                                 | Drop-in SB alt (Vite+SWC) | Quase zero (`npx ladle serve`)        | React-only                               | Maduro; Uber usa em 335 projetos / ~15.896 stories (Ladle v3 blog, ladle.dev). Bundle ~20× menor que SB. |
| **Histoire**                              | Component sandbox (Vite)  | Baixo                                 | Vue-first, com React via plugin          | Ecosystem menor; "Vite/Vue-tier".                                                                        |
| **Rotas `/preview/*` no próprio Next.js** | Custom                    | Zero — só páginas                     | Tudo que App Router faz                  | Padrão de facto em shadcn/ui repo.                                                                       |
| **Sandpack (CodeSandbox)**                | Runtime embebido          | Médio (`@codesandbox/sandpack-react`) | Playground interativo dentro de docs MDX | Bom para mostrar código + preview lado a lado em página de docs.                                         |

### C3. Comparativo real

| Critério                    | Storybook 9                    | Ladle              | `/preview/*` Next.js               | Sandpack embed |
| --------------------------- | ------------------------------ | ------------------ | ---------------------------------- | -------------- |
| Setup inicial (min)         | 15–60                          | 2–5                | 0 (já existe)                      | 10–20          |
| Manutenção/mês              | Alta (addons, upgrades, tipos) | Baixa              | Mínima                             | Baixa          |
| Cold start                  | ~8s                            | ~1–3s              | já rodando                         | já rodando     |
| Tailwind v4 + shadcn quirks | Vários                         | Poucos             | Zero (mesmo build)                 | Poucos         |
| Integração com Claude Code  | Ruim — Claude não roda browser | Idem               | **Excelente** — lê o código        | Boa (MDX)      |
| Interaction tests           | Sim (built-in)                 | Sim (CSF)          | Playwright nos `/preview/*` direto | Não            |
| Visual regression           | Sim (Chromatic/Test)           | Externo            | Playwright screenshots             | Não            |
| Custo cognitivo extra       | CSF, args, parameters          | Quase igual SB CSF | **Nenhum**                         | Pouco          |

### C4. Solo founders que documentam DS sem Storybook em 2025

- **shadcn/ui** (referência da sua stack) usa **rotas `app/(app)/examples/*`** no próprio Next.js para showcase, layout compartilhado e copy-paste. Análise em dev.to/ramunarasinga/shadcn-uiui-codebase-analysis-examples-route-explained-58mk — confirma que o repo usa Route Groups (`(app)`) + `examples/layout.tsx` com `ExamplesNav` para navegar entre demos (`mail`, `dashboard`, `cards`, `forms`, `music`, `playground`, `tasks`, `authentication`). É exatamente o padrão "rota interna de preview".
- **MeetUI** (next.jqueryscript.net/next-js/animated-components-meetui): componentes Motion + 3D copy-paste, docs no próprio Next.
- O autor de **matchkit.io** (2026) recomenda explicitamente: _"AI-coded projects don't need Storybook — preview routes + Cursor/Claude reading the source is faster."_
- Posts dev.to recentes optam por Storybook só quando o projeto **precisa de docs públicas para terceiros**. Solo founders B2B SaaS internos consistentemente escolhem `/preview/*` ou skip.

**Veredito para sua stack:** rotas `/preview/*` no próprio Next.js + (opcionalmente) Sandpack inline em páginas MDX que precisarem mostrar código vivo. Sem Storybook. Se um dia precisar de visual regression formal, adicione Playwright screenshots por cima das mesmas rotas `/preview/*`.

---

## D) MDX vs MD para documentação interna em Next.js App Router

### D1. Setup mais simples em 2025

Em ordem de simplicidade para o seu caso (docs internas, files locais):

1. **`@next/mdx`** — Setup oficial Next.js (nextjs.org/docs/app/guides/mdx). Instala `@next/mdx @mdx-js/loader @mdx-js/react @types/mdx`, adiciona `withMDX` no `next.config.*`, cria `mdx-components.tsx` na raiz (**obrigatório no App Router**, conforme docs), usa file-based routing (`app/foo/page.mdx`). **Mais simples** para "página = arquivo".

2. **`next-mdx-remote/rsc`** (HashiCorp) — Importado de `next-mdx-remote/rsc` para RSC. `<MDXRemote />` virou async server component aceitando `source`. **Trade-off:** `MDXProvider` não funciona em RSC; custom components passam via prop. Use quando MDX vive fora de `app/` (ex.: `content/posts/*.mdx`).

3. **`next-mdx-remote-client`** (ipikuka) — Fork ativo, suporta MDX 3, import statements em MDX, separação clara csr/rsc. Útil se precisar de funcionalidades que o original parou de incluir.

4. **Contentlayer** — Foi muito popular 2023, mas em 2025 é **menos recomendado**: repo original tem manutenção irregular. O autor de dev.to/ptpaterson/getting-started-with-nextjs-15-and-mdx-305k concluiu: _"next-mdx-remote not well maintained as of 2025, while its predecessor next-mdx-remote-client is better maintained, [but] both are overkill when loading markdown files from local file system using SSR. With @next/mdx you can import markdown directly into a component."_

**Recomendação canônica (blixamo.com):**

- `@next/mdx` quando "MDX files são páginas de rota dentro de `app/`" (DS docs internas).
- `next-mdx-remote/rsc` quando "MDX é dado de conteúdo num posts/library system" (blog, CMS).

### D2. Custo real de adicionar MDX

| Métrica                 | MD puro                                     | MDX                                                                      |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| Build time              | mínimo                                      | +~500ms inicial (compilação JSX)                                         |
| Bundle client           | 0 (apenas HTML)                             | +~5–15kB se usar componentes client / `MDXProvider`                      |
| Dependências            | nenhuma (`react-markdown` ou import direto) | `@next/mdx @mdx-js/loader @mdx-js/react @types/mdx`                      |
| Complexidade conceitual | Markdown puro                               | `mdx-components.tsx` mandatório no App Router; JSX dentro de markdown    |
| Frontmatter             | parser extra (gray-matter)                  | nativo via remark-frontmatter + `compileMDX({ parseFrontmatter: true })` |

Para docs internas **estáticas** sem componentes interativos, MD puro + `react-markdown` ou glob simples lendo `.md` é ~10× mais leve. **MDX só compensa quando você quer embedar previews ou JSX inline.**

### D3. Pattern híbrido MD + MDX

**Sim, é padrão emergente.** Não há documentação canônica única, mas evidências:

- O autor do Spacejelly (spacejelly.dev/posts/mdx-in-nextjs) sugere: _"if you're happy with the results of this first step [@next/mdx with page.mdx], you can probably just stop here"_ — implicando o pattern.
- **Nextra 4** (the-guild.dev/blog/nextra-4) implementa exatamente este padrão: **Content directory convention** (catch-all `[[...mdxPath]]/page.jsx` carrega MDX dinâmico) **+ Page file convention** (`page.{md,mdx}` para colocation). Escolhe por arquivo.

**Pattern recomendado para você:**

```
docs/design/
├── tokens.md              ← MD puro: tabela de tokens (auto-gerada)
├── decisions.md           ← MD puro
├── motion.md              ← MD puro
└── components/
    ├── button.mdx         ← MDX: imports <Button /> real e mostra ao vivo
    └── card.mdx
```

E no app:

```
app/preview/
└── [topic]/
    └── page.tsx           ← lê docs/design/**/*.{md,mdx} e renderiza
```

### D4. `app/preview/[topic]/page.mdx` em Next.js 16

**Funciona, mas com nuance:** o que funciona nativamente é `app/foo/page.mdx` **literal** — não `[topic]/page.mdx`. `page.mdx` é arquivo estático para rota fixa.

Para **catch-all dinâmico de MDX**, dois caminhos:

1. **`app/preview/[topic]/page.tsx`** que recebe `params.topic` e faz `compileMDX` em runtime lendo `docs/design/components/${params.topic}.mdx` (padrão `next-mdx-remote/rsc`). Mostrado em github.com/vercel/next.js/discussions/58575 e adotado por shadcn/ui examples.
2. **Catch-all `app/preview/[[...mdxPath]]/page.jsx`** lendo diretório de conteúdo (Nextra-style). Mais boilerplate, escala bem.

Confirmado pela documentação oficial Next.js: `page.mdx` é equivalente a `page.tsx` em file-based routing; suporta export de `metadata` e shared `layout` MDX. **Em Next.js 16 não há breaking change conhecido** vs Next.js 15 na API MDX; `@next/mdx` package extension permanece estável.

---

## E) Live preview em Next.js para Design System

### E1. Exemplos reais

- **shadcn-ui/ui repo** — referência canônica. Estrutura `apps/www/app/(app)/examples/{mail,dashboard,cards,forms,music,playground,tasks,authentication}/` com `examples/layout.tsx` compartilhado (`PageHeader`, `ExamplesNav`, `Announcement`). Análise: dev.to/ramunarasinga/shadcn-uiui-codebase-analysis-examples-route-explained-58mk. É o padrão de facto para sua stack.
- **MeetUI** — preview de componentes Motion + Three.js no próprio Next, copy-paste pattern.
- **Nx + shadcn template** (Medium, dgamer007) — combina Storybook **e** rotas internas, mas autor admite preview routes são mais úteis no dia-a-dia.
- **JheanAntunes/storybook-shadcn** — caso de quem tentou Storybook + shadcn e teve dor com variáveis CSS, theming light/dark sincronizado. Útil como **anti-exemplo** para sua decisão.

### E2. Palette switcher pattern

Não há lib canônica para "cycle through palettes". Pattern mais comum (extraído de tailwindcss.com/docs/theme e tailwindlabs/tailwindcss discussion #18471):

```css
@custom-variant dark   (&:where(.dark, .dark *));
@custom-variant ocean  (&:where(.ocean, .ocean *));
@custom-variant forest (&:where(.forest, .forest *));

@theme {
  --color-accent: oklch(0.65 0.24 260);
}
@layer theme {
  :root {
    @variant dark {
      --color-accent: oklch(0.72 0.18 270);
    }
    @variant ocean {
      --color-accent: oklch(0.68 0.16 220);
    }
    @variant forest {
      --color-accent: oklch(0.62 0.19 145);
    }
  }
}
```

Switcher React: `useState` que troca classe no `<html>` ou wrapper local da página `/preview`. Cycle keyboard shortcut (`[` / `]`) em `useEffect`. Pattern simples, ~30 linhas. Para cycling por todas as paletas, botão "Next palette" fazendo `setIndex(i => (i+1) % palettes.length)`.

### E3. Auto-generate index de componentes via glob

Não há ferramenta padrão consagrada. Pattern comum (Node script):

```ts
// scripts/gen-component-index.ts
import { readdirSync, writeFileSync } from 'node:fs'

const files = readdirSync('components/ui').filter((f) => f.endsWith('.tsx'))
const entries = files.map((f) => f.replace('.tsx', ''))
writeFileSync('app/preview/_data/index.json', JSON.stringify(entries, null, 2))
```

Executar em `prebuild` no `package.json`. `app/preview/page.tsx` lê esse JSON e renderiza grid de cards linkando para `/preview/[component]`. shadcn/ui gera registry similar via `apps/www/registry/*` (mais elaborado, com metadata por componente).

**Vite/SWC native glob imports** (`import.meta.glob`) **não funcionam no Next.js** server build da mesma maneira; use abordagem Node script + JSON ou `fs.readdir` dentro de Server Component (App Router permite isso porque server components rodam Node.js).

### E4. Público vs auth-gated em produção

Best practices consolidadas:

- **Dev only:** o ideal é `/preview/*` **não existir em produção**. Padrão: prefixar rota com `(dev)` route group e middleware retornando 404 quando `process.env.NODE_ENV === "production"`.
- **Staging/preview deployments (Vercel):** auth-gate via `middleware.ts` checando `VERCEL_ENV === "preview"` + Basic Auth header (simples para solo dev) ou Vercel Authentication (built-in nas Pro Teams).
- **Por que não público em produção:** vaza decisões de design não anunciadas; aumenta surface area para scrapers/competitors; bundle de preview-only código vai pra produção desnecessariamente.

**Recomendação:** `middleware.ts`:

```ts
if (req.nextUrl.pathname.startsWith('/preview') && process.env.VERCEL_ENV === 'production')
  return new NextResponse(null, { status: 404 })
```

---

## F) Auto-gen docs de design tokens

### F1. Scripts para auto-gerar docs a partir de CSS `@theme`

Como Tailwind v4 expõe todos os tokens como CSS custom properties no `:root` do output gerado (tailwindcss.com/blog/tailwindcss-v4), parseie o próprio `globals.css`:

```ts
// scripts/gen-token-docs.ts
import postcss from 'postcss'
import { readFileSync, writeFileSync } from 'node:fs'

const css = readFileSync('src/styles/globals.css', 'utf8')
const root = postcss.parse(css)
const tokens: Record<string, string> = {}

root.walkAtRules('theme', (at) => {
  at.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) tokens[decl.prop] = decl.value
  })
})

const groups: Record<string, [string, string][]> = {}
for (const [k, v] of Object.entries(tokens)) {
  const g = k.split('-')[2] ?? 'other'
  ;(groups[g] ??= []).push([k, v])
}

let md = '# Design Tokens\n\n_Auto-generated. Do not edit._\n\n'
for (const [group, items] of Object.entries(groups)) {
  md += `## ${group}\n\n| Token | Value |\n|---|---|\n`
  for (const [k, v] of items) md += `| \`${k}\` | \`${v}\` |\n`
  md += '\n'
}
writeFileSync('docs/design/tokens.md', md)
```

### F2. Token linting / drift detection

- **Stylelint `custom-property-pattern`** (stylelint.io/user-guide/rules/custom-property-pattern) — força que todas custom properties sigam regex (ex.: `^--(color|font|space|radius)-[a-z0-9-]+$`).
- **Stylelint `referenceFiles` + `no-unknown-custom-properties`** — aponta arquivo de referência (`globals.css` com `@theme`) e bloqueia uso de custom properties não declaradas. Documentado em stylelint.io/user-guide/configure.
- Para **classes Tailwind com tokens não definidos**: erro vem natural — Tailwind v4 simplesmente não gera a classe. Cobertura adicional via `eslint-plugin-tailwindcss` (suporte completo a v4 ainda é desigual em set/2025).
- **Custom Stylelint plugin "official-specs"** de Michael Mangialardi (michaelmang.dev/blog/linting-design-tokens-with-stylelint) é referência: detecta valores literais (hex, px) onde deveria usar token.
- Para uso **dentro de TSX** (className hard-coded): script grep no CI buscando `#[0-9a-f]{6}` em `components/**/*.tsx` que não seja arbitrary value autorizado.

### F3. Tools para `tokens.md` auto-gerado

- **Style Dictionary** (styledictionary.com) — suporta format `tailwind-v4` via plugin oficial **tokens-studio/sd-tailwindv4** (github.com/tokens-studio/sd-tailwindv4). Pipeline: tokens em JSON → Style Dictionary → CSS com `@theme {}` + custom variants + utility classes. **Overkill para solo dev** se você já escreve tokens diretos em `globals.css`. Vale só se integrar Figma → tokens no futuro.
- **Token Pipeline** (Adobe) — similar, mais corporativo.
- **Terrazzo** — adoção crescente, reference implementation do DTCG spec v1 (w3.org/community/design-tokens).
- Para seu caso, **script PostCSS custom (F1) é mais simples** que adotar Style Dictionary.

### F4. CI integration

```yaml
# .github/workflows/design.yml
- run: pnpm tsx scripts/gen-token-docs.ts
- run: git diff --exit-code docs/design/tokens.md
  # falha o build se tokens.md está stale
- run: pnpm stylelint "src/styles/**/*.css"
- run: pnpm tsx scripts/check-tokens-used-not-defined.ts
```

Pre-commit (husky + lint-staged):

```json
"src/styles/**/*.css": ["stylelint --fix", "pnpm tsx scripts/gen-token-docs.ts && git add docs/design/tokens.md"]
```

---

## G) ADRs específicos para Design System

### G1. ADRs essenciais "dia 1"

Não há lista canônica para DS. O seguinte é destilado de adr.github.io/madr, backstage.io e exemplos públicos:

1. **Choice of design system base** (shadcn copy-paste vs Radix headless vs MUI vs Mantine)
2. **Color space & token format** (OKLCH vs HSL vs hex) — ver G2
3. **Theming strategy** (`class="dark"` vs `prefers-color-scheme` vs attribute selectors)
4. **CSS strategy** (Tailwind v4 CSS-first vs CSS modules vs vanilla-extract)
5. **Icon library** — ver G3
6. **Animation/motion library** — ver G4
7. **Component naming convention** (PascalCase, atomic vs feature folders)
8. **Documentation tooling** (Storybook vs preview routes vs MDX)
9. **Accessibility baseline** (WCAG 2.2 AA, contrast ratio targets)
10. **Browser/device support floor** (OKLCH fallback?)

### G2. ADR para color space (OKLCH vs HSL vs hex)

Há precedente público forte. Posts técnicos consistentes 2024–2025:

- **evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl** — documentação seminal (Evil Martians). Argumentos: (1) perceptual lightness uniforme, (2) wide-gamut P3, (3) human-readable, (4) palette generation previsível.
- **medium.com/@vyakymenko (2025)** — documenta tradeoffs e recomenda fallback sRGB com `@supports (color: oklch(0.5 0.1 0))`.
- **Tailwind v4 oficial** — toda paleta default migrada para OKLCH; sinaliza direção da indústria.
- **DTCG v1 spec** — OKLCH listado como first-class color space suportado.

**Template ADR sugerido:**

- _Status:_ Accepted
- _Context:_ Tailwind v4 default usa OKLCH; precisamos palette consistency para tema dark-first + a11y WCAG 2.2.
- _Decision:_ OKLCH como source-of-truth em `@theme`; sem fallback sRGB explícito (target Vercel + modern browsers; baseline 2024+).
- _Consequences:_ (+) Tailwind utilities pretty-print; perceptual scales; (−) browsers pré-2023 não cobertos (`caniuse` ~93% global, jul/2025).

### G3. ADR para iconografia

Comparativos ecosystem React 2024–2025: **lucide-react** (default shadcn/ui, recommended pelo install guide), **@radix-ui/react-icons**, **heroicons**, **tabler-icons**, **phosphor-react**. Para sua stack new-york shadcn, **lucide-react é a escolha canônica** confirmada no shadcn install guide (ui.shadcn.com/docs/installation/next) e adotada por MeetUI e shadcn.io.

Trade-offs típicos a documentar:

- Tree-shaking: lucide-react ✅ named imports
- Tipos TS: lucide ✅
- Tamanho médio: ~700 ícones, ~3–5kB por ícone tree-shaken
- Compatibilidade Motion 12 / animate: ✅ (são SVG normais)
- Custo de troca futuro: alto se espalhado; baixo se centralizado em `components/icons/index.ts`

### G4. ADR para motion/animation

Sua stack já usa **Motion 12** (motion.dev). Contexto:

- **Framer Motion** virou **Motion** em 2024–2025 (rebrand pós-saída do CEO da Framer; biblioteca passou a ser standalone). motion.dev/docs/react-animation é a referência atual. API quase idêntica ao Framer Motion 11.
- Alternativas: **CSS nativo** (`@starting-style`, `view-transition-name`), **GSAP** (overkill para UI), **React Spring** (mais físico-baseado).

**ADR template Motion vs CSS:**

- _Context:_ PWA fitness B2B SaaS precisa transições suaves entre estados, mas RSC-first reduz client JS budget.
- _Decision:_ Motion 12 para animações stateful (gestures, layout, AnimatePresence); CSS transitions para hover/focus simples.
- _Consequences:_ +bundle (~30kB gzip), excelente DX, integra bem com Tailwind v4 (suporta animar CSS custom properties OKLCH nativamente — motion.dev confirma all CSS color formats incluindo oklch, oklab, color-mix).

Não encontrei um ADR público "Framer Motion vs CSS" amplamente referenciado em repos de DS, mas o pattern de decisão e argumentos estão em motion.dev/docs e blog.logrocket.com.

---

## H) OKLCH e Tailwind v4 `@theme`

### H1. Documentação oficial

**tailwindcss.com/docs/theme** é a referência canônica:

> _"Theme variables are special CSS variables defined using the `@theme` directive that influence which utility classes exist in your project. […] `@theme { --color-mint-500: oklch(0.72 0.11 178); }`. Now you can use utility classes like `bg-mint-500`, `text-mint-500`, or `fill-mint-500` in your HTML."_

Como funciona o sistema de paletas:

- Toda variável `--color-{name}-{shade}` dentro de `@theme {}` gera utilities `bg-`, `text-`, `border-`, `fill-`, `stroke-`, `outline-`, `ring-`, `divide-`, `accent-`, `decoration-`, `shadow-`, `caret-`, `from-`/`via-`/`to-` (gradients).
- Default palette tem 11 steps (50, 100, …, 900, 950).
- `--color-*: initial` desabilita toda paleta default (starting fresh).
- `@theme inline` quando você quer referenciar outras CSS vars dentro do tema sem inlinear o valor.
- Tailwind v4 usa **`color-mix(in oklab, …)`** para opacity modifiers (ex.: `bg-blue-500/50`), interpolação OKLCH nativa para gradients (`bg-linear-to-r/oklch`).

**Formato OKLCH:** `oklch(L C H)` com L=0–1 (perceived lightness), C=0–0.4 (chroma), H=0–360 (hue degrees). Aceita ambos `oklch(0.72 0.11 178)` e `oklch(72% 0.11 178)`.

### H2. Drift entre token names em CSS e uso em componentes

Estratégias documentadas:

1. **Stylelint `custom-property-pattern`** (mencionado em F2) força naming convention no CSS.
2. **Stylelint `no-unknown-custom-properties` + `referenceFiles`** detecta `var(--foo)` apontando para token inexistente.
3. **No JSX/TSX:** não há linter first-class para Tailwind v4 ainda maduro. `eslint-plugin-tailwindcss` tem suporte parcial; tailwindlabs/tailwindcss discussion #18471 e issues correlatas confirmam o gap.
4. **Approach prático sem ferramenta:** script TS que parseia `globals.css` via PostCSS → extrai set de classes esperadas (`bg-${prefix}-${shade}`) → grep em `components/**/*.tsx` por regex `(bg|text|border|...)-([a-z]+)-(50|100|...)` → fail no CI se classe usada não existe.
5. **PostCSS plugin "scorecard"** (`@tempera/postcss-scorecard` de Michael Mangialardi) — pontua aderência aos tokens; útil para reporting.

### H3. Autocomplete VS Code / Cursor para `@theme`

- **Tailwind CSS IntelliSense** extensão oficial (bradlc.vscode-tailwindcss) detecta `@theme` em `.css` automaticamente desde v0.12+ (suporte v4 GA early 2025). Sugere classes baseado nas custom properties que você definir. Funciona em VS Code, Cursor (fork), e qualquer editor com LSP.
- Habilite no settings: `"tailwindCSS.experimental.classRegex"` se usar classes em locais não-standard (cva, tw template literals).
- **Para Claude Code:** não há autocomplete (não é editor), mas Claude lê CSS nativamente como discutido em B3 — `globals.css` já documenta os tokens de fato.

---

## I) Anti-patterns de documentação de Design System

### I1. Lista de anti-patterns documentados

Compilado de logrocket.com, maviklabs.com, michaelmang.dev e comunidade DS:

1. **Docs que descrevem a UI ao invés de explicar a decisão** — listar variantes de botão é menos útil que documentar _por quê_ aquela variante existe.
2. **Stories/preview entrando em produção** com dados de exemplo (UX risk).
3. **Tokens sem documentação semântica** — `--color-blue-500` documentado, `--color-primary` indocumentado.
4. **Tabela de cores que não atualiza** quando paleta muda (drift clássico).
5. **Stories Storybook desatualizadas** porque ninguém roda Chromatic / visual diff.
6. **Componentes documentados mas removidos** do código (orphan docs).
7. **MDX docs com imports que quebram silenciosamente** quando o componente real muda API.
8. **ADRs/decisões "fixadas" que nunca recebem `superseded`** — ficam dando conselho obsoleto.
9. **Naming não-canônico** (`Btn` vs `Button`, `useToggle` vs `useDisclosure`) sem registro em decisions.
10. **Acessibilidade contada como "feature" e não requisito documentado** (contrast ratio, focus visible, reduced-motion).
11. **Docs gigantes em um único arquivo** que ninguém lê (oposto: 50 arquivos micro inacháveis).

### I2. Doc drift — medição e prevenção solo

- **CI check de "stale docs":** ver F4. Comando `git diff --exit-code docs/design/tokens.md` após regenerar; falha se docs estão atrás do código.
- **Snapshot tests com tokens:** Vitest snapshot do JSON serializado de tokens parseado do CSS. Drift = diff visível em PR.
- **Date-stamped entries em decisions.md:** entries sem update há >180 dias podem ser flagged por script CI.
- **Linter custom:** `forbid-undeclared-tokens.ts` script (H2 #4) — usar token não declarado falha CI.
- **Visual diff (opcional):** Playwright + screenshot diff nas `/preview/*` routes; falha PR se mudança visual não documentada.

### I3. Limite de contexto AI para consumir docs

Da documentação oficial (code.claude.com/docs/en/memory):

- CLAUDE.md root: **≤200 linhas alvo**, acima disso adesão cai.
- Auto memory: carrega **first 200 lines or 25KB** automaticamente.
- Rules path-scoped: sem número oficial, mas mesma heurística (~200 linhas confortável).
- Imports `@path` em CLAUDE.md somam tokens normalmente — não usar para "esconder" tamanho.
- Use `/memory` e `/context` para auditar exatamente o que está carregado.

Prática real reportada (joseparreogarcia substack 2026, claudefa.st, claudelog.com):

- Acima de **~500 linhas combinadas** entre CLAUDE.md + rules ativas, modelo começa a "esquecer" instruções específicas, especialmente em sessões longas.
- **Após `/compact`**, project-root CLAUDE.md é re-injetado automaticamente (do disco); nested CLAUDE.md em subdiretórios **não** são re-injetados.
- Recomendação prática: dividir DS docs entre **"always-on"** (CLAUDE.md, máx ~80–100 linhas) + **"path-scoped"** (200 linhas cada, só carregam ao tocar componentes). Preserva tokens para a janela ativa.

---

## Sumário executivo de decisões recomendadas para Bloco 7

| Pergunta                       | Recomendação                                                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Storybook ou alternativa?**  | **Sem Storybook.** Rotas `app/preview/[topic]/page.tsx` (padrão shadcn). Reavalie só se precisar visual regression formal.                                                                                                           |
| **MD ou MDX?**                 | **Híbrido.** MD puro para `tokens.md`, `decisions.md`, `motion.md`. MDX (`@next/mdx` + `next-mdx-remote/rsc` quando dinâmico) só onde precisar embedar componentes vivos.                                                            |
| **decisions.md formato?**      | Único arquivo append-only, MADR-style com YAML frontmatter por entry (`status`, `date`, `tags`). Promove para ADR completo quando afeta build/CI/contratos.                                                                          |
| **CLAUDE.md / rules?**         | CLAUDE.md raiz ≤100 linhas (índice + always-on). `.claude/rules/ds-*.md` com `paths: ["components/**", "app/**", "src/styles/**"]` quoted, cada ≤200 linhas. Validar via `/memory`.                                                  |
| **PreToolUse hook?**           | Sim, injetar `decisions.md` + tokens em edições de componente via `additionalContext` (v2.1.9+). Cuidado com bug do Write tool (Issue #23478) — duplicar regras de criação críticas em CLAUDE.md.                                    |
| **Token docs?**                | Script PostCSS custom gerando `docs/design/tokens.md`. Stylelint `custom-property-pattern` + `no-unknown-custom-properties` no CI. Style Dictionary é overkill agora.                                                                |
| **Color space?**               | OKLCH (alinhado com Tailwind v4 default + DTCG v1 + Evil Martians). Sem fallback sRGB para baseline 2024+.                                                                                                                           |
| **Preview route em produção?** | Auth-gated ou bloqueado via middleware (`VERCEL_ENV === "production"` → 404).                                                                                                                                                        |
| **ADRs dia 1?**                | (1) base DS (shadcn copy-paste), (2) color space OKLCH, (3) theming strategy, (4) Tailwind v4 CSS-first, (5) lucide-react, (6) Motion 12, (7) preview-routes-not-Storybook, (8) MD+MDX híbrido, (9) WCAG 2.2 AA, (10) browser floor. |

### Caveats e conteúdo especulativo explicitados

- **Storybook 10** é mencionado em um post dev.to (themachinepulse, dec/2025) mas **não confirmado em release oficial**. A versão estável documentada é 9.1 (jul/2025). Trate menções a "Storybook 10" como predição/early access, não fato.
- **"100 linhas" como limite de rule file** (sugerido no briefing original) **não é o número oficial**: docs oficiais Claude Code citam **200 linhas**. Usei 200 nas recomendações.
- **Tailwind v4.x** estável documentado é v4.3 (May/2026 referenciado em alguns posts). Nada na pesquisa indica breaking changes em `@theme` entre v4.0 e v4.3.
- **Next.js 16** App Router: a pesquisa não identificou breaking changes específicos em MDX vs Next.js 15. Documentação nextjs.org/docs/app/guides/mdx aplica-se diretamente. Revalide `mdx-components.tsx` requirement e `pageExtensions` config no momento da implementação.
- Issues do Claude Code citadas (#23478, #17204, #16853, #21858, #13905) estavam **abertas ou marcadas stale** na época da pesquisa — verifique status na sua versão (`claude --version`) antes de assumir bug ainda presente.
- O conceito de "decisions.md tático separado de ADR arquitetural" é mais convenção comunitária do que padrão formal; toda a literatura formal usa apenas ADR (com YAML status). Adotar `decisions.md` como bucket de decisões pequenas é prática válida mas não citada na documentação Anthropic/Vercel/Tailwind oficiais.

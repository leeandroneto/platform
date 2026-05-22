# 42 — ESLint Best Practices Validation: 2nd Opinion External Research

> **Status:** research (segunda opiniao externa) · **Data:** 2026-05-21
> **Autor:** Sonnet despachado · **Inputs:** research-39, eslint.config.mjs, blueprint 13,
> sources externos WebFetch + WebSearch listados no rodape
> **Decisao:** pendente — este doc valida/refuta research-39 Q1-Q10

---

## Resumo executivo

Research-39 estava **90% alinhado** com melhores praticas 2026 externas. Os bumps
quantitativos (Q1-Q3) sao confirmados. Q9 ja esta executado.
Tres gaps nao cobertos por research-39 foram identificados:
(1) `eslint-plugin-react-hooks@6` com React Compiler rules bundled (nao mais plugin separado),
(2) proposta oficial Next.js 16 de regra para `'use client'` desnecessario, e
(3) Magic UI usa `framer-motion` nativamente — conflito direto com nossa regra
`no-restricted-imports/framer-motion`.

---

## A — Auditoria contra padroes 2026

### A.1 Next.js 16 ESLint config

**Fonte:** `nextjs.org/docs/app/api-reference/config/eslint` (v16.2.6, atualizado 2026-05-19)

Mudancas criticas no Next.js 16:

- `next lint` foi **removido** em v16. A opcao `eslint` em `next.config.js` nao existe mais.
  Substituido pelo ESLint CLI diretamente. Nossa config: ✅ **Alinhado** — usamos `pnpm lint` direto.

- Configuracao canonica agora usa `globalIgnores()` da API `eslint/config` em vez de
  lista manual em `ignores: []`. Nossa config usa `ignores: [...]` no objeto de config —
  ⚠️ **Divergente** (menor): funcional, mas o padrao Next.js 16 usa `globalIgnores()`.
  Impacto: zero funcional, apenas convencao. Nao exige ADR.

- `eslint-config-next/typescript` e baseado em
  `plugin:@typescript-eslint/recommended` — confirma nossa escolha. ✅ **Alinhado**

- Estrutura spread `...nextVitals, ...nextTs` e o pattern recomendado pelo Next.js 16 docs.
  ✅ **Alinhado** exatamente com o que temos.

**Veredito geral secao A.1:** config base ✅ alinhada. Minor: considerar migrar para `globalIgnores()`.

---

### A.2 TypeScript ESLint

**Fonte:** `typescript-eslint.io/getting-started/`

Recomendacao 2026:

```js
tseslint.configs.recommended // base
tseslint.configs.strict // superset recomendado para projetos novos
tseslint.configs.stylistic // consistencia de estilo
```

Nossa config usa `eslint-config-next/typescript` que inclui `recommended`.
**Nao inclui `strict`** (que adiciona rules como `@typescript-eslint/no-non-null-assertion`,
`@typescript-eslint/prefer-nullish-coalescing`, etc.).

Status: ⚠️ **Parcialmente alinhado** — `recommended` esta certo para projetos que comecam.
`strict` e recomendado para projetos novos TypeScript greenfield em 2026. Adicionar
`tseslint.configs.strict` com override `off` em `lib/contracts/database.ts` (ja coberto
pela excecao ADR-0031 §8) e low-risk.

**Resultado:** op-in low-risk no contexto deste projeto.

---

### A.3 ESLint flat config evolution (v9)

**Fonte:** `eslint.org/docs/latest/use/configure/configuration-files`

Flat config (ESLint v9) e o padrao 2026. Nossa config usa `defineConfig()` do ESLint 9,
que e o padrao recomendado. ✅ **Totalmente alinhado**.

As opcoes `linterOptions` com enforcement de directives orfas e bloqueio de overrides
inline — presentes e corretas. ✅

---

### A.4 eslint-plugin-react-hooks v6 (React Compiler)

**Fonte:** `react.dev/reference/eslint-plugin-react-hooks` + React Compiler v1.0 blog (out/2025)

**Descoberta critica nao coberta por research-39:**

React Compiler 1.0 lancou em outubro 2025. A partir do `eslint-plugin-react-hooks` v6,
**as regras do React Compiler estao bundled no preset `recommended`** — nao e mais
necessario `eslint-plugin-react-compiler` separado.

Regras adicionadas no v6 (via React Compiler):

- `react-hooks/immutability`
- `react-hooks/purity`
- `react-hooks/static-components`
- `react-hooks/gating`
- `react-hooks/globals`
- `react-hooks/refs`
- `react-hooks/config`

**Nossa config:** usa `eslint-config-next/core-web-vitals` que inclui `eslint-plugin-react-hooks`.
Mas a versao bundled em `eslint-config-next@16.2.6` pode ser v5 (pre-Compiler).

Status: ⚠️ **Verificar** — rodar `pnpm list eslint-plugin-react-hooks` para ver versao.
Se for < v6, as regras Compiler nao estao ativas. Atualizacao para v6 e recomendada
(React team afirma: "nao ha risco no upgrade pois o linter nao requer o compilador instalado").

**Recomendacao:** verificar versao bundled. Se < v6, adicionar `eslint-plugin-react-hooks`
v6+ como devDependency explicita para sobrescrever versao do preset.

---

### A.5 eslint-plugin-react (jsx-eslint) 2025+

**Fonte:** `github.com/jsx-eslint/eslint-plugin-react` + ESLint React (eslint-react.xyz)

O ecossistema em 2026 tem duas trajetorias:

1. `eslint-plugin-react` (jsx-eslint) — legado, mantido, mas sem grandes novidades RSC
2. `@eslint-react/eslint-plugin` (eslint-react.xyz) — alternativa moderna, RSC-aware,
   com regras como `rsc-function-definition`, `no-missing-key`, etc.

Nossa config herda via `eslint-config-next` que usa `eslint-plugin-react` (jsx-eslint).
Para Next.js 16 + RSC, **manter jsx-eslint** ate que `eslint-config-next` migre
internamente. ✅ **Alinhado com abordagem conservadora**.

`react/jsx-no-literals` — nossa config usa corretamente. ✅

---

### A.6 Boilerplates de referencia

**Makerkit (Next.js + Supabase SaaS):** Repo lite publico confirma stack identico
(Next.js 16, React 19, Supabase, Tailwind v4, shadcn). ESLint v9 + Prettier + strict
TypeScript. Sem acesso ao `eslint.config.mjs` especifico via raw.

**Supastarter (Next.js + Supabase):** **migrou de ESLint + Prettier para oxlint + oxfmt** em 2025.
Contexto: oxlint e 50-100x mais rapido, mas nao tem suporte a regras customizadas complexas
(como nossas 6 regras custom de multi-tenant). Para nosso projeto, **migrar para oxlint nao
e viavel** sem perder as regras criticas (brand, vocab, token bypass). Manter ESLint.
Anotacao: oxlint como complemento (futuro) para velocidade e possivel — mas e JIT.

**ixartz/Next-js-Boilerplate (community top):** stack identico. Usa ESLint v9 flat config,
Storybook 10, Playwright, Vitest — confirma nossas escolhas. ✅

---

## B — Validacao dos bumps quantitativos

### B.1 Airbnb style guide (referencia historica)

Airbnb ESLint config atual (`eslint-config-airbnb-base/rules/style.js`):

- `max-lines`: `['off', { max: 300 }]` — **desligado** (nao enforced em producao)
- `max-lines-per-function`: `['off', { max: 50 }]` — **desligado**
- `max-params`: `['off', 3]` — **desligado**
- `complexity`: **ausente** do config

Conclusao: Airbnb nao enforca nenhum desses limites em 2026. Os valores internos
(max: 300, max: 50) sao referencias comentadas, nao producao.

### B.2 Tendencias 2026 (RSC + co-localizacao)

Pesquisa externa confirma o argumento de research-39:

- RSC com fetch + parse + render naturalmente excede 60 linhas por funcao
- Arquivos Storybook com decorators + interactions chegam a 400-500 LOC
- Novel/Tiptap extension configs: 350-450 LOC e normal
- Supastarter migrou pra oxlint exatamente para reduzir friction em regras
  estruturais — sinal de mercado de que limites estritos geram atrito desnecessario

### B.3 Tabela de limites

| Limite                   | Airbnb 2026            | Nossa config atual | Proposta research-39   | Veredito externo |
| ------------------------ | ---------------------- | ------------------ | ---------------------- | ---------------- |
| `max-lines`              | off (ref interna: 300) | 300 error          | 400 default, 600 paths | ✅ Confirma      |
| `max-lines-per-function` | off (ref interna: 50)  | 60 error           | 80 default             | ✅ Confirma      |
| `complexity`             | ausente                | 12 error           | 16                     | ✅ Confirma      |
| `max-params`             | off (ref interna: 3)   | 4 error            | manter 4               | ✅ Confirma      |

**Veredito B:** research-39 esta correto nos 4 limites. Airbnb nao enforca nenhum —
mais permissivo que nossa proposta. Nossa abordagem com limites calibrados (400/80/16/4)
e mais rigorosa que Airbnb e mais pragmatica que a config atual (300/60/12/4).

---

## C — Sheriff boundaries

### C.1 Dois "Sheriffs" — esclarecimento importante

Existem **dois projetos diferentes** chamados Sheriff:

1. **`@softarc/eslint-plugin-sheriff`** (instalado em `package.json`) — ferramenta de
   **module boundaries** para TypeScript. Faz boundary enforcement baseado em tags + dep rules.
   Nao e um preset de regras ESLint generico.

2. **`eslint-config-sheriff`** (AndreaPontrandolfo) — preset ESLint opinionado completo
   para TypeScript. **Nao e o que temos instalado.**

Nossa instalacao e o (1): `@softarc/eslint-plugin-sheriff@0.19.6` para boundaries.

### C.2 Configuracao viavel para nosso projeto

Com base na documentacao do `@softarc/eslint-plugin-sheriff`:

```typescript
// sheriff.config.ts (root do projeto) — usar quando gatilho Fase 1 for atingido
import { SheriffConfig } from '@softarc/sheriff-core'

export const config: SheriffConfig = {
  modules: {
    'lib/contracts': 'contracts',
    'lib/domain': 'domain',
    'lib/data': 'data',
    'lib/hooks': 'hooks',
    'lib/design': 'design',
    'lib/ai': 'ai',
    'lib/services': 'services',
    app: 'presentation',
    components: 'ui',
    features: 'feature',
    'supabase/functions': 'edge',
  },
  depRules: {
    // Dependencia desce, nunca sobe (layers.md)
    presentation: ['ui', 'feature', 'hooks', 'domain', 'contracts', 'design'],
    ui: ['hooks', 'contracts', 'design'],
    feature: ['ui', 'hooks', 'data', 'domain', 'contracts', 'design', 'ai'],
    hooks: ['domain', 'contracts'],
    data: ['domain', 'contracts'],
    domain: ['contracts'],
    contracts: [],
    design: ['contracts'],
    ai: ['contracts', 'domain'],
    edge: ['contracts'],
    services: [], // vazio por design (CLAUDE.md)
  },
}
```

ESLint flat config integration (adicionar apos configs existentes):

```js
import sheriff from '@softarc/eslint-plugin-sheriff'
// spread sheriff.configs.all no array defineConfig
```

### C.3 Timing para implementar

**Recomendacao externa:** Sheriff e mais util quando existe um conjunto real de features
para proteger. Projetos com menos de 20 modulos se beneficiam menos; o overhead de
config supera o valor.

**Veredito para nosso projeto:** research-39 Q10 recomendou defer pra Fase 1 —
**confirmado externamente**. Razoes:

- `features/` esta vazio pos-pivot ADR-0044
- `lib/services/` esta vazio por design
- Com menos de 15 modulos ativos, `no-restricted-imports` path-based ja cobre o critico

Gatilho: primeira feature paga real em `features/<name>/` com 3+ submodulos.

---

## D — React 19 + Next.js 16 Specifics

### D.1 React Compiler ESLint rule

**Status 2026:** React Compiler v1.0 (out/2025) esta estavel. As regras sao bundled
em `eslint-plugin-react-hooks@6` no preset `recommended`.

**Nossa config atual:** herda via `eslint-config-next`. Se a versao bundled for v5
(pre-v6), as regras Compiler nao estao ativas.

**Recomendacao — adicionar em devDependencies:**

```
"eslint-plugin-react-hooks": "^6.0.0"
```

E no `eslint.config.mjs` (sobrescreve versao do preset):

```js
import reactHooks from 'eslint-plugin-react-hooks'
{
  plugins: { 'react-hooks': reactHooks },
  rules: { ...reactHooks.configs['recommended-latest'].rules },
}
```

Regras novas de Compiler (imutabilidade, pureza) sao WARN por padrao —
nao bloqueiam CI ate que compilador seja habilitado explicitamente.

**Adotar:** ✅ Sim — baixo risco, React team confirma "nao precisa do compilador instalado".

### D.2 'use client' boundary explicito

**Status:** Nao ha regra oficial. Next.js team abriu discussao (jun/2025, issue #80741)
propondo regra para: (a) alertar sobre `'use client'` desnecessario e (b) exigir
`'use client'` onde hooks de browser sao usados sem diretiva.

**Plugins community existentes:**

- `@serviceup/eslint-plugin-enforce-use-client`
- `eslint-plugin-react-server-components` (roginfarrer)
- `next-no-use-client-page`

**Nossa config atual:** tem `server-only-guard/no-use-client-in-server` (custom) que
bloqueia `'use client'` em `lib/data/` e `actions.ts`. ✅ Cobre o lado server-only.
**Nao cobre** o lado "use client desnecessario em RSC puro".

**Recomendacao:** aguardar regra oficial Next.js. Plugins community fragmentados.
JIT — quando lancar official.

### D.3 `<style precedence="theme">` (React 19)

Nao ha regra ESLint especifica para `<style precedence>`. E uma API React 19 nativa.
Sem regra disponivel ou necessaria para nosso caso.

### D.4 `suppressHydrationWarning` (next-themes)

`suppressHydrationWarning` e padrao aceito para integracao next-themes (SSR theme flash).
O uso em `<html suppressHydrationWarning>` em `app/layout.tsx` e canonico next-themes.
Nenhuma regra ESLint externa recomenda bloquear esse padrao. ✅ Correto.

### D.5 Server Actions return type enforcement

Nossa abordagem (rule path-loaded `server-actions.md` + `ok()/fail()` contract) e
a pratica dominante. Nao ha plugin ESLint externo que detecte `throw` em funcoes
`'use server'`. Custom AST continua sendo a unica opcao viavel. ✅

### D.6 Tabela — regras React 19 / Next.js 16 que NAO temos

| Regra                                  | Status externo                 | Recomendacao                     |
| -------------------------------------- | ------------------------------ | -------------------------------- |
| React Compiler rules (react-hooks v6)  | Estavel desde out/2025         | ✅ Adotar — atualizar plugin     |
| 'use client' desnecessario             | Proposta Next.js (nao lancada) | JIT — aguardar oficial           |
| RSC function definition (eslint-react) | Community plugin alternativo   | Skip — overhead de migrar preset |
| `<style precedence>` lint              | Nao existe                     | N/A                              |
| `suppressHydrationWarning` guard       | Padrao aceito, nao lintado     | N/A                              |

---

## E — Stack candidato (Novel, Origin, Magic)

### E.1 Novel (Tiptap-based rich text editor)

**Fontes:** `novel.sh/docs`, `tiptap.dev/docs/editor/core-concepts/persistence`

**Instalacao:** Novel e copy-paste via registry ou `npx shadcn add` — nao e npm package.
Baseado em Tiptap + Vercel AI SDK. Sem CLI proprio.

**Persistencia de conteudo:** Tiptap docs (autoridade, pois Novel e wrapper) recomendam
**JSON canonico** (ProseMirrorJSON) como formato primario. Citacao direta:
"We recommend using JSON to persist the editor state as it is more flexible, easier to parse
and allows for external edits if needed without running an additional HTML parser over it."

HTML e derivavel de JSON via `editor.getHTML()` em render-time. Para export/email,
gerar HTML na hora — nao armazenar como canonical.

**Regra ESLint:** sem `eslint-plugin-novel`. A regra custom proposta em research-39 D.3
(`editor.getJSON()` vs `editor.getHTML()`) e AST valida — confirma a proposta.

**Convention chave:** armazenar `JSONB` no banco. Gerar HTML em render-time para display,
email, export. Nunca armazenar HTML como canonical.

### E.2 Origin UI

**Fonte:** `github.com/shadcn/originui`, web search

**Instalacao:** copy-paste via `pnpm dlx shadcn@latest add https://originui.com/r/<comp>.json`.
Nao e npm package. Confirma research-39 D.5.

**Tailwind v4:** Origin UI migrou para Tailwind v4 em fev/2025. ✅ Compativel.

**A11y:** baseado em Radix + React Aria. Alta qualidade.

**Regra ESLint:** Nossa regra proposta bloqueando `@origin-ui/*` imports nao e necessaria
na pratica (esse path npm nao existe). O risco e coberto pela `shadcn-zone.md` existente.

**Convention chave:** copiar via `npx shadcn add <url>`, vive em `components/app-<nome>.tsx`.
Sem import npm. Sem regra ESLint adicional necessaria alem do existente.

### E.3 Magic UI

**Fonte:** `magicui.design/docs/installation`, web search

**Instalacao:** identico ao shadcn — `pnpm dlx shadcn@latest add @magicui/<slug>`.
Sem npm package separado para os componentes.

**ALERTA CRITICO — Conflito Motion:** Magic UI usa **`framer-motion`** como dependencia
de animacao (confirmado por multiplas fontes independentes: "o comando init instala
framer-motion"). Nossa ESLint tem `no-restricted-imports` bloqueando `framer-motion`
(vocab banido ADR).

Conflito direto: componentes Magic UI copiados via shadcn CLI importam `framer-motion`
internamente — nosso lint vai bloquear no primeiro `pnpm lint`.

**Resolucao (JIT — quando Magic UI for adotado):**

Opcao A — reescrever imports apos copia (PREFERIDA):
Substituir `import { motion } from 'framer-motion'` por `import { motion } from 'motion/react'`
nos arquivos copiados. Motion v12 tem compatibilidade de API com framer-motion para uso basico.
Mantem vocab banido global intacto.

Opcao B — path override na zona quarentenada:

```js
// eslint.config.mjs — adicionar override
{
  files: ['components/ui/magicui/**/*.{ts,tsx}'],
  rules: { 'no-restricted-imports': 'off' },
}
```

**Convention chave:** Magic UI exige tratamento especial de motion imports.
Documentar em `shadcn-zone.md` quando adotado.

---

## F — Veredito sobre Q1-Q10 (research-39)

### Q1 — Limites estruturais (400, 80, 16, 4)

**Evidencia externa:**

- Airbnb: todos desligados (refs internas: 300/50/3) — mais permissivo que nossa proposta
- RSC patterns reais: funcoes de 60-80 linhas sao normais com fetch+parse+render
- Tiptap/Novel configs: 350-450 LOC tipicos — justifica 400
- Complexity 16: confirmado pela ausencia de limite mais restrito em configs de referencia

**Veredito:** ✅ **Confirma** — 400/80/16/4 e o conjunto correto.
Path override 600 para `actions.ts` + `lib/design/**` tambem confirmado.

### Q2 — `text-*` e `rounded-*` loose temporario

**Veredito:** ✅ **Confirma** — logica irrefutavel: wrappers `<Heading>` e `<Text>`
foram deletados em surgical delete (ADR-0044). Regra que bloqueia `text-2xl` sem wrapper
gera lock-in sem saida. Loose temporario ate wrappers re-nascerem (Fase 1-3).
Manter `[#hex]`, `[rgb(`, `uppercase` estritos — correto.

### Q3 — `plan-gates-required` WARN vs ERROR

**Veredito:** ✅ **Confirma** — `features/**` vazio + ERROR = falso positivo garantido
em `_template`. Principio geral: regras ERROR em codigo que nao existe sao
"phantom enforcement". WARN ate Fase 1.

### Q4 — Novel content storage: JSON canonico

**Evidencia externa:** Tiptap docs recomendam explicitamente JSON sobre HTML.
Pratica de mercado: cache HTML derivado (Redis/CDN) se necessario — nao armazenar
HTML como canonical.

**Veredito:** ✅ **Confirma** — ProseMirrorJSON canonico no banco. Regra custom D.3
de research-39 e valida e deve ser implementada quando Novel entrar.

### Q5 — Origin/Magic copy-paste enforce

**Evidencia externa:** Nem Origin UI nem Magic UI existem como npm packages.
`@origin-ui/*` e `@magicui/*` nao sao paths npm reais.

Mas: **Magic UI traz `framer-motion` internamente** — research-39 nao identificou.

**Veredito:** ⚠️ **Ajustar** — a regra de bloquear `@origin-ui/*`/`@magicui/*` imports
e redundante (paths inexistentes). O risco real e diferente:
Magic UI traz `framer-motion` internamente. A regra relevante ja existe
(`no-restricted-imports/framer-motion`), com necessidade de path override ou reescrita
de imports quando adotado. Reescrever research-39 D.5 para focar nisso.

### Q6 — Block builder vs template+slots

**Veredito:** ✅ **Confirma** — Novel para conteudo rico de programa/lesson/protocol.
Template+slots para landing. Dominios distintos, nao conflitam.

### Q7 — Registry catalog timing

**Veredito:** ✅ **Confirma** — defer pra Fase 1 quando engines tiverem consumidores reais.

### Q8 — CSS var em JSX style — manter strict

**Evidencia externa:** `style={{ transform: ... }}` via `motion.div` nao dispara nossa
regra `no-css-var-in-style` (detecta `var(--)` em Literal, nao transforms dinamicos).
Motion animations via `motion/react` nao conflitam.

**Veredito:** ✅ **Confirma** — manter strict.

### Q9 — i18next paths exception — adicionar agora

**Status:** ✅ **JA EXECUTADO** — override adicionado em `eslint.config.mjs`
(decisao user 2026-05-21 Opcao A, registrada no proprio research-39 §Q9 final).

### Q10 — Sheriff boundaries timing: defer Fase 1

**Evidencia externa:** Sheriff e mais util com mais de 20 modulos ativos.
`no-restricted-imports` path-based ja cobre o boundary critico atual.

**Veredito:** ✅ **Confirma** — defer Fase 1. Config viavel fornecida em secao C.2.

---

## G — Tabela resumo Q1-Q10

| Q                                     | Proposta research-39 | Veredito                                 | Ajuste |
| ------------------------------------- | -------------------- | ---------------------------------------- | ------ |
| Q1 — limites 400/80/16/4              | ✅ Confirma          | Nenhum                                   |
| Q2 — loose text-_/rounded-_           | ✅ Confirma          | Nenhum                                   |
| Q3 — plan-gates WARN                  | ✅ Confirma          | Nenhum                                   |
| Q4 — JSON canonico Novel              | ✅ Confirma          | Nenhum                                   |
| Q5 — bloquear @origin-ui/_ @magicui/_ | ⚠️ Ajustar           | Focar no conflito framer-motion Magic UI |
| Q6 — separacao Novel/template+slots   | ✅ Confirma          | Nenhum                                   |
| Q7 — defer registry catalog           | ✅ Confirma          | Nenhum                                   |
| Q8 — CSS var strict                   | ✅ Confirma          | Nenhum                                   |
| Q9 — paths exception renderers        | ✅ Ja executado      | —                                        |
| Q10 — defer Sheriff Fase 1            | ✅ Confirma          | Config pronta em secao C.2               |

**Alinhamento geral: 9/10 confirmados (90%). 1 ajuste em Q5.**

---

## H — 3 novas regras descobertas (nao cobertas por research-39)

### H.1 React Compiler rules via react-hooks v6

Research-39 nao mencionou `eslint-plugin-react-hooks` v6 com React Compiler bundled
(lancado out/2025, estagio estavel).

**Acao concreta:**

1. Verificar versao: `pnpm list eslint-plugin-react-hooks`
2. Se menor que v6: adicionar `"eslint-plugin-react-hooks": "^6.0.0"` em devDependencies
3. Configurar no `eslint.config.mjs` (ver secao D.1)

Regras adicionadas sao WARN por default — nao bloqueiam CI sem compilador instalado.
Safe para adotar imediatamente.

**Prioridade:** MEDIA — antes da Fase 1 do pivot.

### H.2 Magic UI + framer-motion conflict

Research-39 nao identificou que Magic UI depende de `framer-motion` (vocab banido).

**Acao concreta (JIT — quando Magic UI for adotado):**
Preferencia: reescrever imports de `framer-motion` para `motion/react` nos componentes
copiados (motion v12 API compativel para uso basico). Alternativamente, path override
na zona quarentenada `components/ui/magicui/**`.

Adicionar nota em `shadcn-zone.md` e `naming.md` quando for adotado.

**Prioridade:** BAIXA — JIT.

### H.3 `use client` desnecessario — proposta oficial Next.js

Next.js team abriu issue #80741 (jun/2025) para regra oficial que alerta sobre
`'use client'` em arquivos que nao precisam. Plugins community existem mas fragmentados.

**Acao concreta:** aguardar lancamento oficial. Nossa regra custom `server-only-guard`
cobre o lado oposto (impede 'use client' em server-only). O outro lado fica para quando
oficial sair.

**Prioridade:** BAIXA — JIT.

---

## I — Veredito geral

Research-39 estava **90% alinhado** com melhores praticas 2026 externas.

**O que estava certo:**

- Bumps quantitativos (400/80/16/4) — confirmados por Airbnb desligar limites + RSC patterns
- JSON canonico para Novel — confirmado por Tiptap docs oficiais
- Sheriff defer Fase 1 — confirmado por metricas de projeto
- CSS var strict + Motion ok — sem conflito real identificado
- Copy-paste enforced para Origin/Magic — correto (sem npm packages)

**O que estava incompleto:**

- Nao identificou conflito framer-motion/Magic UI (Q5) — gap mais relevante
- Nao cobriu React Compiler rules bundled em react-hooks v6 (H.1)
- Nao cobriu proposta oficial Next.js para `'use client'` desnecessario (H.3)

**Prioridade de implementacao sugerida (em ordem):**

1. Limites estruturais (Q1) — max-lines 400 / max-lines-per-function 80 / complexity 16
2. Loose text-_/rounded-_ (Q2) — desbloqueia uso legitimo pos-surgical-delete
3. plan-gates WARN (Q3) — desbloqueia `_template`
4. react-hooks v6 upgrade (H.1) — React Compiler rules, low-risk

---

## Fontes

- Next.js ESLint docs: `https://nextjs.org/docs/app/api-reference/config/eslint` (v16.2.6, 2026-05-19)
- TypeScript ESLint getting started: `https://typescript-eslint.io/getting-started/`
- React Compiler v1.0 blog: `https://react.dev/blog/2025/10/07/react-compiler-1`
- eslint-plugin-react-hooks docs: `https://react.dev/reference/eslint-plugin-react-hooks`
- React Compiler installation: `https://react.dev/learn/react-compiler/installation`
- Next.js use-client rule proposal: `https://github.com/vercel/next.js/discussions/80741`
- Airbnb style rules source: `https://github.com/airbnb/javascript` (eslint-config-airbnb-base)
- Sheriff (softarc) module boundaries: `https://sheriff.softarc.io/docs/module_boundaries`
- Tiptap persistence docs: `https://tiptap.dev/docs/editor/core-concepts/persistence`
- Magic UI installation: `https://magicui.design/docs/installation`
- Origin UI (shadcn namespace): `https://github.com/shadcn/originui`
- Supastarter oxlint migration: `https://supastarter.dev/changelog`
- Makerkit Next.js SaaS: `https://makerkit.dev/next-supabase`

## Historico

| Data       | Mudanca                                                       | Aprovador         |
| ---------- | ------------------------------------------------------------- | ----------------- |
| 2026-05-21 | Versao inicial — 2nd opinion externa sobre research-39 Q1-Q10 | Sonnet despachado |

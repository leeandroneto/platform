# Regras de Padronizacao — onboarding.bio

> **Documento definitivo de regras.** Tudo que esta aqui e lei. Sem excecoes.
> Todo codigo novo DEVE seguir. Todo codigo legado SERA migrado pra seguir.
> Lint, Husky, tsc, e code review existem pra garantir que ninguem quebre.
> **Criado:** 2026-05-01
> **Hierarquia:** `CLAUDE.md` > este doc > guias especificos

---

## 0. Ecossistema de documentos

### Qual documento faz o que

| Documento                                     | Onde                | Pra que                                                                                                                | Quem le                         |
| --------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `CLAUDE.md`                                   | Raiz                | **Contrato supremo.** Contexto do projeto, stack, camadas, padroes obrigatorios. Carregado em toda sessao Claude Code. | Claude Code (automatico)        |
| `docs/core/REGRAS-PADRONIZACAO.md`            | Este doc            | **Regras completas.** SOLID, reuso, lint, separacao de camadas, limites, boas praticas. Referencia humana e IA.        | Dev + Claude Code (sob demanda) |
| `docs/core/architecture.md`                   | docs/core           | Estrutura de pastas, camadas, decisoes arquiteturais                                                                   | Dev + Claude Code               |
| `docs/core/decisions.md`                      | docs/core           | Decisoes fechadas (nao revisitar). Formato D{N}.                                                                       | Dev + Claude Code               |
| `docs/core/design-reference.md`               | docs/core           | Principios de UI/UX, Nielsen heuristics, breakpoints, touch targets                                                    | Dev + Claude Code               |
| `docs/produto/design/guia_fundacao_design.md` | docs/produto/design | **Design system completo.** Tokens, componentes, tipografia, shape, density, motion. Como implementar UI.              | Dev + Claude Code               |
| `docs/produto/design/SHADCN-MAPEAMENTO.md`    | docs/produto/design | Inventario shadcn: o que instalar, deletar, manter. Patterns mobile.                                                   | Dev + Claude Code               |
| `docs/core/copy-positioning.md`               | docs/core           | Tom de voz, palavras proibidas, posicionamento de marca                                                                | Dev + Claude Code               |
| `docs/core/schema.md`                         | docs/core           | Tabelas, RPCs, Edge Functions, seguranca de banco                                                                      | Dev + Claude Code               |

### Regra de conflito

Se dois documentos divergem: `CLAUDE.md` > `REGRAS-PADRONIZACAO.md` > guias especificos.
Se encontrar conflito: **parar e perguntar antes de implementar.**

---

## 1. Principio #1 — Reuso total

### 1.1 Hierarquia de componentes (obrigatoria)

Antes de escrever QUALQUER componente UI, seguir esta ordem:

```
1. Ja existe em components/ui/? → USE.
2. Nao existe? → shadcn tem? (pesquisar MCP shadcn) → INSTALE e use.
3. shadcn nao tem? → Componha primitivos de components/ui/.
4. Composicao nao resolve? → Sera reusado em 2+ lugares? → CRIE em components/ui/.
5. Especifico de 1 feature e nao reusavel? → CRIE em components/[feature]/.
6. NUNCA crie wrapper que duplica primitivo existente.
```

**Enforcement via lint:** `no-restricted-syntax` bloqueia todo HTML raw (`<button>`, `<input>`, `<textarea>`, `<select>`, `<table>`, `<dialog>`, `<label>`, `<img>`, `<h1-h6>`). Forcando uso de shadcn.

### 1.2 Zero codigo morto

- **Componente com 0 imports = deletar.** Nao existe "vou usar depois". Se precisar no futuro, recria (ou instala do shadcn).
- **Export sem consumidor = deletar.** `knip` roda no pre-push e CI. Falha = nao pusha.
- **Import sem uso = auto-removido.** `eslint-plugin-unused-imports` remove no pre-commit.
- **Arquivo sem referencia = deletar.** Stories de componente deletado = deletar tambem.
- **Revisao mensal:** rodar `pnpm knip` e limpar tudo que aparecer.

**Enforcement:** `knip` no pre-push + CI. `unused-imports/no-unused-imports` error no pre-commit.

### 1.3 Nao acumular componentes especulativos

- NUNCA criar componente "pra usar depois"
- NUNCA criar abstraçao antes de ter 2+ consumidores reais
- 3 linhas duplicadas e melhor que 1 abstracçao prematura
- Se um componente existe mas nao e usado: deletar, nao "planejar adocao"

---

## 2. Principio #2 — Nada inline, nada hardcoded

### 2.1 Cores

| Proibido                       | Correto                                     | Enforcement                                         |
| ------------------------------ | ------------------------------------------- | --------------------------------------------------- |
| `bg-[#ff0000]`                 | `bg-destructive`                            | `eslint-plugin-better-tailwindcss`                  |
| `style={{ color: '#000' }}`    | `className="text-foreground"`               | `no-restricted-syntax` (hex/rgb/hsl/oklch em style) |
| `text-red-500` (Tailwind puro) | `text-destructive` (semantico)              | Code review                                         |
| Cor fixa que deveria ser do PT | `var(--palette-primary)` via `data-palette` | Code review                                         |

### 2.2 Espacamento

| Proibido     | Correto                                 | Enforcement                        |
| ------------ | --------------------------------------- | ---------------------------------- |
| `p-[13px]`   | `p-3` (12px) ou `p-4` (16px)            | `eslint-plugin-better-tailwindcss` |
| `gap-[18px]` | `gap-4` (16px) ou `gap-5` (20px)        | Idem                               |
| `mt-[47px]`  | Token da escala (4,8,12,16,20,24,32,48) | Idem                               |
| `h-[600px]`  | Classes responsivas ou `min-h-dvh`      | Idem                               |

### 2.3 Tipografia

| Proibido                             | Correto                                | Enforcement                        |
| ------------------------------------ | -------------------------------------- | ---------------------------------- |
| `<h2 className="text-xl font-bold">` | `<Heading level={2}>`                  | `no-restricted-syntax` (raw h1-h6) |
| `<p className="text-sm text-muted">` | `<Text variant="muted">`               | Code review (sem lint pra `<p>`)   |
| `text-[15px]`                        | `text-body` ou `<Text variant="body">` | `eslint-plugin-better-tailwindcss` |
| `font-[700]`                         | `font-semibold`                        | Idem                               |

### 2.4 Border-radius

| Proibido                                  | Correto                         | Enforcement                           |
| ----------------------------------------- | ------------------------------- | ------------------------------------- |
| `rounded-md` (fixo)                       | `rounded-[var(--shape-button)]` | Code review (componentes ui/ ja usam) |
| `rounded-[12px]`                          | `rounded-[var(--shape-card)]`   | `eslint-plugin-better-tailwindcss`    |
| `rounded-xl` (fixo em superficie publica) | `var(--shape-card)`             | Code review                           |

### 2.5 Strings de UI

| Proibido                                       | Correto                                    | Enforcement                   |
| ---------------------------------------------- | ------------------------------------------ | ----------------------------- |
| `"Salvar alterações"` em JSX                   | `{t('save')}`                              | `react/jsx-no-literals` error |
| `return { error: "Erro ao salvar" }` em action | `return { error: t('actions.saveError') }` | Code review                   |
| Labels hardcoded em arrays                     | Chaves i18n                                | `react/jsx-no-literals`       |

### 2.6 Dados

| Proibido                            | Correto                                                         | Enforcement                 |
| ----------------------------------- | --------------------------------------------------------------- | --------------------------- |
| Preco hardcoded (`2700`)            | `PRICES.core` de `lib/constants/prices.ts`                      | Code review                 |
| Timeout magico (`setTimeout(2000)`) | `COPY_TIMEOUT` de `lib/constants/timing.ts`                     | `no-magic-numbers` (futuro) |
| Feature list hardcoded              | `lib/constants/plan-features.ts` ou banco                       | Code review                 |
| Labels de modalidade inline         | `MODALITY_PROFESSIONAL_TITLES` de `lib/constants/modalities.ts` | Code review                 |

---

## 3. Principio #3 — Separacao de camadas (SOLID)

### 3.1 Camadas do projeto

```
UI (app/, components/)
    ↓ chama
Server Actions (app/<route>/actions.ts)
    ↓ chama
Data (lib/data/)
    ↓ chama
Supabase (banco, RPCs, Edge Functions)

Domain (lib/domain/)
    ↑ chamado por Data e Server Actions
    Zero IO, zero React, zero Supabase
```

### 3.2 Regras por camada

#### UI (`app/`, `components/`)

- RSC (React Server Component) por default. `'use client'` SO quando obrigatorio (hooks, eventos, browser APIs).
- **Nunca** chamar Supabase direto. Nunca `createClient()` em componente (excecao: `CrudManager`).
- **Nunca** importar `@/lib/supabase/admin` (service role) em client component.
- **Nunca** conter logica de negocio. Se tem `if/else` de regra de dominio, move pra `lib/domain/`.
- Componente renderiza, delega, e exibe resultado. Nada mais.

**Enforcement:** `no-restricted-imports` bloqueia `@supabase/supabase-js createClient` e `@/lib/supabase/admin` em app/components.

#### Server Actions (`app/<route>/actions.ts`)

- Retorno padrao: `{ ok: true, data }` ou `{ ok: false, error }`. **Nunca** throw em action.
- Chama `lib/data/` pra IO. Chama `lib/domain/` pra validacao/logica.
- **Nunca** contem query SQL ou chamada Supabase direta.
- **Nunca** contem logica de UI (nao importa React, nao renderiza).
- Usa `revalidatePath()` apos mutacao.

#### Data (`lib/data/`)

- Funcao pura: `function nomeDaOperacao(client: SupabaseClient, ...args): Promise<T>`
- **Lanca erro** com `throw new Error(...)`. Nunca retorna `{ ok, error }`.
- **Sem React.** Sem hooks, sem estado, sem JSX.
- Cada arquivo = 1 entidade (lead.ts, client.ts, professional.ts, report.ts).

**Enforcement:** `no-restricted-imports` bloqueia `@/app/*` em `lib/` (lib nao importa de app).

#### Domain (`lib/domain/`)

- **Logica pura.** Zero IO, zero Supabase, zero fetch, zero file system.
- Testavel isolada com `vitest`. Sem mock de banco.
- Calculos, validacoes, engine de IA, regras de negocio.
- Cada modulo em subpasta: `engine/calculations/`, `engine/templates/`, etc.

#### Edge Functions (`supabase/functions/`)

- Deno runtime. Codigo espelhado de `lib/domain/` quando necessario.
- Retorno: `Response.json({ ok, data/error }, { status })`.
- **Nunca** retorna `{ ok, error }` sem status HTTP correto.
- SECURITY DEFINER + REVOKE/GRANT em RPCs.

### 3.3 Principios SOLID aplicados

| Principio                     | Aplicacao no projeto                                                                       | Enforcement                  |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------- |
| **S** — Single Responsibility | 1 componente = 1 responsabilidade. 1 arquivo data/ = 1 entidade. 1 action = 1 mutacao.     | Max 300 linhas (code review) |
| **O** — Open/Closed           | Componentes extensiveis via props/variants (shadcn CVA), nao por editar o fonte.           | Code review                  |
| **L** — Liskov Substitution   | `<Heading>` e `<Text>` aceitam `as`/`asChild` pra trocar tag sem quebrar contrato.         | TypeScript types             |
| **I** — Interface Segregation | Props tipadas e minimas. Nao passar `professional` inteiro se so precisa de `name`.        | TypeScript strict            |
| **D** — Dependency Inversion  | UI depende de abstracoes (hooks, actions), nao de implementacoes (Supabase client direto). | `no-restricted-imports`      |

---

## 4. Principio #4 — Limites de tamanho e complexidade

### 4.1 Limites por arquivo

| Tipo                | Maximo         | O que fazer se passar                                                  |
| ------------------- | -------------- | ---------------------------------------------------------------------- |
| Componente UI       | **300 linhas** | Decompor em orchestrator + `_components/` ou `_sections/` ou `_steps/` |
| Server Action       | **100 linhas** | Extrair logica pra `lib/domain/`, IO pra `lib/data/`                   |
| Arquivo lib/data/   | **200 linhas** | Dividir por sub-entidade                                               |
| Arquivo lib/domain/ | **200 linhas** | Dividir por calculo/regra                                              |
| Page.tsx (rota)     | **150 linhas** | Extrair secoes pra componentes                                         |
| Test file           | **Sem limite** | Mas agrupar por describe                                               |

### 4.2 Limites de complexidade

| Metrica                                   | Limite       | Enforcement                         |
| ----------------------------------------- | ------------ | ----------------------------------- |
| Profundidade de nesting (if/for/callback) | Max 3 niveis | ESLint `max-depth: 4` (futuro)      |
| Ternarios aninhados                       | **Proibido** | ESLint `no-nested-ternary` (futuro) |
| Parametros de funcao                      | Max 4        | Code review (agrupar em objeto)     |
| Props de componente                       | Max 8        | Code review (agrupar em tipos)      |
| useEffect por componente                  | Max 2        | Code review (separar em hooks)      |

### 4.3 Nomenclatura

| Camada                                       | Idioma      | Formato                                                                      |
| -------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| DB (tabelas, colunas, RPCs, Edge Functions)  | EN 100%     | snake_case                                                                   |
| Code (arquivos, tipos, funcoes, componentes) | EN 100%     | PascalCase (componentes), camelCase (funcoes/vars), UPPER_SNAKE (constantes) |
| Pastas de rota em `app/`                     | EN          | kebab-case                                                                   |
| URL publica                                  | PT-BR       | Via rewrites em next.config.ts                                               |
| Strings de UI                                | PT-BR       | Via `t()` de `messages/pt-BR.json`                                           |
| Documentacao interna                         | PT-BR livre | —                                                                            |

**Enforcement:** `@typescript-eslint/naming-convention` (futuro).

---

## 5. Principio #5 — Design system blindado

### 5.1 Regra de ouro: shadcn primeiro

```
Precisa de UI? → shadcn tem? → USE shadcn.
                              → shadcn NAO tem? → Ja existe em components/ui/? → USE.
                                                 → NAO existe? → CRIE em components/ui/ (se reusavel) ou components/[feature]/ (se nao).
```

### 5.2 Personalizacao multi-tenant

Tudo que o profissional personaliza DEVE vir de CSS vars + data attributes:

| Dimensao   | Data attribute    | CSS vars                                            | Valores                                  |
| ---------- | ----------------- | --------------------------------------------------- | ---------------------------------------- |
| Cor        | `data-palette`    | `--palette-primary`, `--palette-primary-hover`, etc | lime, green, coral, ocean, amber, custom |
| Tipografia | `data-typography` | `--font-display-active`, `--font-serif-active`      | modern, editorial, classic, bold         |
| Shape      | `data-shape`      | `--shape-card`, `--shape-button`, etc               | rounded, sharp, soft                     |
| Density    | `data-density`    | `--density-pad-y`, `--density-pad-x`, etc           | tight, cozy, roomy                       |
| Surface    | `data-surface`    | `--surface-accent`, `--surface-accent-hover`        | internal, public                         |
| Modo       | `data-theme`      | Todas as cores de fundo/texto                       | dark, light                              |

**Regra:** se um valor visual deveria mudar quando o PT troca estilo, ele DEVE ser um token CSS var. Se esta hardcoded, esta errado.

### 5.3 Tokens, nunca valores

Toda cor, raio, espacamento, sombra, duracao, easing DEVE vir de token definido em `globals.css @theme`. Zero valores magicos no codigo.

### 5.4 Componentes semanticos obrigatorios

| Em vez de                            | Usar                                 | Por que                        |
| ------------------------------------ | ------------------------------------ | ------------------------------ |
| `<h1>` a `<h6>`                      | `<Heading level={N}>`                | Tokens tipograficos dinamicos  |
| `<p>`, `<span>` com classes de texto | `<Text variant="...">`               | Semantica + tokens             |
| `<button>`                           | `<Button>` ou `<Button size="icon">` | Touch target, a11y, variants   |
| `<input>`                            | `<Input>`                            | Shape/density tokens, 16px iOS |
| `<textarea>`                         | `<Textarea>`                         | Shape/density + showCount      |
| `<select>`                           | `<Select>`                           | Shape/density + a11y           |
| `<table>`                            | `<Table>`                            | DS tokens                      |
| `<dialog>`                           | `<Dialog>`                           | Radix a11y + focus trap        |
| `<label>`                            | `<Label>`                            | htmlFor enforcement            |
| `<img>`                              | `<Image>` (next/image)               | Otimizacao, lazy loading       |
| Lista de items                       | `<Item>` (shadcn)                    | Composavel, variants, sizes    |
| Estado vazio                         | `<Empty>` (shadcn)                   | Padrao visual consistente      |
| Form field                           | `<Field>` (shadcn)                   | Label + description + error    |
| Bottom sheet mobile                  | `<Drawer>` (shadcn/Vaul)             | Nativo, gesture-aware          |
| Loading botao                        | `<Spinner>` (shadcn)                 | Consistente                    |

---

## 6. Principio #6 — i18n em tudo

### Regra

Toda string visivel pro usuario DEVE usar `t()` de next-intl.

```tsx
// Server component
const t = await getTranslations('namespace')
<Heading level={1}>{t('title')}</Heading>

// Client component
const t = useTranslations('namespace')
<Text>{t('description')}</Text>

// Server action
const t = await getTranslations('actions')
return { ok: false, error: t('saveError') }
```

### Excecoes documentadas (e SO estas)

- `components/ui/dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx` — shadcn internal strings
- `lib/pdf/**`, `lib/email/**` — templates server-side
- `app/demo/**` — demos internas
- `**/*.stories.tsx` — Storybook
- `app/global-error.tsx`, `app/(public)/error.tsx` — fallbacks

**Enforcement:** `react/jsx-no-literals` como error (apos migracao completa).

---

## 7. Principio #7 — Erros padronizados

### Por camada (nunca misturar)

| Camada                      | Padrao                                            | Exemplo                                                                        |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| `lib/data/` e `lib/domain/` | `throw new Error(...)`                            | `throw new Error('Lead not found')`                                            |
| Server Actions              | `return { ok: false, error }`                     | `return { ok: false, error: t('notFound') }`                                   |
| Edge Functions              | `Response.json({ ok: false, error }, { status })` | `return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 })` |

**Nunca** throw em server action. **Nunca** retornar `{ ok, error }` em lib/data/.

---

## 8. Principio #8 — Mobile-first app-like

### Regras de UI mobile

| Regra                                     | Enforcement                               |
| ----------------------------------------- | ----------------------------------------- |
| Touch targets minimo 44x44px              | `touch-target` class + code review        |
| Inputs minimo 16px fonte (iOS zoom)       | `globals.css` global rule                 |
| Bottom sheet em vez de modal central      | shadcn `Drawer` + code review             |
| `pb-nav` em listas dentro do shell        | Code review                               |
| Safe-area padding (notch)                 | `safe-pb`, `safe-pt` classes              |
| Dynamic viewport height                   | `min-h-dvh` em vez de `min-h-screen`      |
| Scroll horizontal com snap pra categorias | shadcn `Carousel`                         |
| Skeleton loading em toda tela com fetch   | `loading.tsx` obrigatorio por route group |
| Empty state em toda lista                 | shadcn `Empty` obrigatorio                |

### Pattern-to-component mapping (estilo iFood/Nubank)

| Pattern mobile                      | Componente shadcn                      |
| ----------------------------------- | -------------------------------------- |
| Lista de items com avatar + chevron | `Item` + `ItemGroup`                   |
| Chips/categorias scroll horizontal  | `Carousel` (dragFree)                  |
| Edicao de item                      | `Drawer` (mobile) / `Dialog` (desktop) |
| Settings com secoes colapsaveis     | `Collapsible` + `Item`                 |
| Confirmacao destrutiva              | `AlertDialog` / `DeleteConfirmation`   |
| Loading de botao                    | `Button` + `Spinner`                   |
| Search com icone                    | `InputGroup`                           |

---

## 9. Lint — enforcement automatico

### 9.1 Plugins obrigatorios

| Plugin                                     | O que enforce                                    | Status         |
| ------------------------------------------ | ------------------------------------------------ | -------------- |
| `eslint-config-next/core-web-vitals`       | Next.js + React + a11y base                      | Instalado      |
| `eslint-config-next/typescript`            | TypeScript rules                                 | Instalado      |
| `jsx-a11y` (25 rules strict)               | Acessibilidade                                   | Instalado      |
| `eslint-plugin-simple-import-sort`         | Ordem de imports                                 | **A instalar** |
| `eslint-plugin-unused-imports`             | Remove imports mortos                            | **A instalar** |
| `eslint-plugin-better-tailwindcss`         | Valida classes Tailwind v4, bloqueia arbitrarios | **A instalar** |
| `prettier` + `prettier-plugin-tailwindcss` | Formatacao + class sorting                       | **A instalar** |

### 9.2 Regras `no-restricted-syntax` — 17 selectors

Bloqueia todo HTML raw e inline perigoso em `app/**/*.tsx` e `components/**/*.tsx` (exceto `components/ui/**` e `components/motion/**`):

**HTML raw → shadcn:**

1. `<button>` → `<Button>`
2. `<input>` → `<Input>`
3. `<textarea>` → `<Textarea>`
4. `<select>` → `<Select>`
5. `<table>` → `<Table>`
6. `<dialog>` → `<Dialog>`
7. `<label>` → `<Label>`
8. `<img>` → `<Image>` (next/image)
9. `<h1>` a `<h6>` → `<Heading level={N}>`
10. `<motion.button>` → `<Button>` com motion props

**Inline perigoso:** 11. hex em `style={{}}` → CSS var ou Tailwind 12. rgb em `style={{}}` → idem 13. hsl em `style={{}}` → idem 14. oklch em `style={{}}` → idem

**DOM direto:** 15. `document.getElementById` → React refs 16. `document.querySelector` → React refs 17. `document.querySelectorAll` → React refs

### 9.3 Regras `no-restricted-imports`

| Import bloqueado                       | Mensagem                                 | Motivo                   |
| -------------------------------------- | ---------------------------------------- | ------------------------ |
| `framer-motion`                        | Use `motion/react`                       | Package name mudou (D15) |
| `next/router`                          | Use `next/navigation`                    | App Router               |
| `next/document`                        | Use `app/layout.tsx`                     | App Router               |
| `next/head`                            | Use Metadata API                         | App Router               |
| `@supabase/supabase-js` (createClient) | Use `@/lib/supabase/client` ou `/server` | Centralizacao            |
| `vitest` (em prod)                     | Somente em `*.test.ts`                   | Nao vazar test deps      |
| `@/app/*` (em lib/)                    | lib/ nao importa de app/                 | Boundary arquitetural    |

### 9.4 Pipeline completo

```
Pre-commit (lint-staged):
  *.{ts,tsx,js,jsx} → eslint --fix --max-warnings=0 + prettier --write
  *.{ts,tsx} → tsc --noEmit
  *.{json,css,md} → prettier --write

Commit-msg (commitlint):
  Conventional Commits (feat/fix/chore/docs/refactor/test/perf/ci/style/revert/build)
  Subject obrigatorio, type obrigatorio

Pre-push:
  vitest run (401+ tests)
  tsc --noEmit (projeto inteiro)
  knip (dead code)
```

**Resultado:** impossivel commitar com lint error, type error, ou commit fora do padrao. Impossivel pushar com teste falhando ou codigo morto.

### 9.5 tsconfig hardening

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noFallthroughCasesInSwitch": true,
  "forceConsistentCasingInFileNames": true,
  "verbatimModuleSyntax": true
}
```

---

## 10. Testes

| Tipo               | Onde                          | Regra                                   |
| ------------------ | ----------------------------- | --------------------------------------- |
| Unit (logica pura) | `lib/domain/**/*.test.ts`     | Obrigatorio pra todo calculo/engine     |
| Data (IO)          | `lib/data/**/*.test.ts`       | Obrigatorio pra queries criticas        |
| Componente         | `components/**/*.test.tsx`    | Opcional, mas recomendado pra compostos |
| E2E                | Manual ou Playwright (futuro) | Smoke test antes de release             |

```bash
pnpm exec tsc --noEmit   # 0 erros
pnpm exec vitest run      # 401+ passando
pnpm lint                  # 0 erros, 0 warnings
pnpm build                 # passa
```

Rodar ANTES de qualquer commit/PR/merge. Husky garante nos hooks.

---

## 11. Git e commits

### Conventional Commits (obrigatorio)

```
feat(scope): descricao curta
fix(scope): descricao curta
refactor(scope): descricao curta
chore(scope): descricao curta
docs(scope): descricao curta
test(scope): descricao curta
```

### Branches

- `main` — producao. Nunca push direto (exceto fundador).
- `feat/nome`, `fix/nome`, `refactor/nome` — branches de trabalho.
- PR obrigatorio pra merge em main (apos MVP).

### Commits atomicos

- 1 commit = 1 mudanca logica. Nao misturar fix + feat + refactor.
- Se o commit precisa da palavra "e" na descricao, dividir em 2 commits.

---

## 12. Revisao de saude (weekly)

Toda sexta (ou antes de release):

```bash
# 1. Codigo morto
pnpm knip

# 2. Lint completo
pnpm lint

# 3. Type check
pnpm exec tsc --noEmit

# 4. Testes
pnpm exec vitest run

# 5. Build
pnpm build

# 6. Componentes com 0 imports
# Rodar: grep -r "from.*components/ui/" --include="*.tsx" | sort | uniq -c | sort -rn
# Qualquer componente com 0 = deletar
```

---

## 13. Checklist de tela nova

Antes de declarar qualquer tela pronta:

```
[ ] Tipo identificado (list/detail/form/dashboard/settings)
[ ] Referencia real consultada (leads, dashboard, site, etc)
[ ] shadcn componentes usados (zero HTML raw)
[ ] <Heading> e <Text> pra tipografia
[ ] Strings via t() (zero hardcoded)
[ ] Data attributes setados (se pagina publica)
[ ] generateMetadata (se conteudo dinamico)
[ ] loading.tsx com Skeleton
[ ] error.tsx com SectionErrorBoundary
[ ] EmptyState em listas
[ ] pb-nav se dentro do (shell)
[ ] Mobile 375px testado
[ ] Touch targets 44px+
[ ] Inputs >= 16px
[ ] inputMode correto (numeric, email, tel, url)
[ ] Zero hex/rgb/hsl/oklch inline
[ ] Zero valores arbitrarios Tailwind
[ ] Zero logica de negocio no componente
[ ] Max 300 linhas
[ ] tsc passa
[ ] lint passa
[ ] build passa
```

---

## 14. Checklist de componente novo

Antes de criar qualquer componente em `components/ui/`:

```
[ ] shadcn realmente NAO tem equivalente (pesquisou MCP?)
[ ] Componente sera usado em 2+ lugares (nao e especulativo)
[ ] Props tipadas com TypeScript (interface, nao any)
[ ] Usa tokens CSS vars pra tudo personalizavel (shape, density, palette)
[ ] Usa CVA (class-variance-authority) se tem variants
[ ] Suporta asChild (Radix Slot) se faz sentido
[ ] Acessivel (aria-label, role, focus management)
[ ] Max 300 linhas
[ ] Story criado (Storybook)
[ ] Documentado no guia de fundacao se for relevante
```

---

## 15. Resumo executivo — as 10 regras de ouro

1. **shadcn primeiro, sempre.** Custom so em ultimo caso.
2. **Zero codigo morto.** 0 imports = deletar.
3. **Nada inline.** Cor, tamanho, raio, string — tudo via token ou i18n.
4. **UI nao pensa.** Componente renderiza, delega, exibe. Logica em domain/.
5. **Camadas nao se misturam.** UI → Action → Data → Supabase. Domain e puro.
6. **300 linhas max.** Acima, decompor.
7. **Mobile-first.** Bottom sheet, touch targets, safe area, app-like.
8. **Multi-tenant.** Tudo personalizavel via data-\* + CSS vars.
9. **Lint trava tudo.** Se o lint nao pega, criar regra. Se nao da pra criar regra, code review.
10. **Testa antes de commitar.** tsc + lint + vitest + build. Husky garante.

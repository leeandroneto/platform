# 13 — Lint Enforcement Dia 0

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Defesa multi-camada contra os 830 `eslint-disable` que silenciaram 1 regra única no onboarding-bio.
> **Custo dia 0:** ~12-16h. Custo de não ter: refator caro depois (decisão `_CONFLITOS #12`).

---

## 1. Princípio: 3 camadas de defesa

Vocab banido + i18n hardcoded + token bypass têm 3 chances de serem barrados antes de chegar em produção:

1. **ESLint flat config custom** — falha o `pnpm lint --max-warnings 0`
2. **Sheriff boundaries** — falha o `pnpm build` (boundary violation)
3. **CI grep scripts** — falha o GitHub Action (sed/grep cross-file pegando o que regra AST não cobre)

`--max-warnings 0` em CI bloqueia merge. Zero `eslint-disable` exceto allowlist em ADR (memória `feedback_zero_eslint_disable`).

Razão histórica: pesquisa 09 + análise do `eslint.config.mjs` legacy mostrou que 830 disables silenciaram **uma única regra** (token bypass) — não desligaram regras diferentes. Camada única vira porta aberta com 1 chave.

---

## 2. As 24 regras ESLint custom

### 2.1 Vocab banido (1 regra, 16 termos)

| Selector | Severity | Trigger ❌ | OK ✅ |
|---|---|---|---|
| `id-denylist` + `no-restricted-syntax` Identifier match | error | `const studentId = …` | `const clientId = …` |

**Termos banidos** (releia `.claude/rules/naming.md` + memória `feedback_no_legacy_vocabulary`):

`student`, `trainer`, `intake`, `wizard`, `prospect`, `diagnostic`, `customization`, `workspace`, `framer-motion`, `aluno` (em folder), `onboarding.bio`/`onboarding-bio`, `reflexao`, `pilares`, `ato_*` prefix, `proximo_passo`, `prof-*` (abbreviated), `legacy-*`/`_legacy/`, `diagnostico`.

Cobre Identifier + Property + Literal string match em paths `app/`, `components/`, `lib/`, `supabase/`.

### 2.2 i18n hardcoded (14 padrões — D-G66)

| # | Selector | Trigger ❌ | OK ✅ |
|---|---|---|---|
| 1 | `react/jsx-no-literals` | `<Button>Salvar</Button>` | `<Button>{t('save')}</Button>` |
| 2 | JSXAttribute name=/aria-label/ value Literal | `aria-label="Fechar"` | `aria-label={t('close')}` |
| 3 | JSXAttribute name=/placeholder/ value Literal | `placeholder="Email"` | `placeholder={t('email')}` |
| 4 | JSXAttribute name=/title/ value Literal | `title="Editar"` | `title={t('edit')}` |
| 5 | JSXAttribute name=/alt/ value Literal | `alt="Logo"` | `alt={t('brand.logo')}` |
| 6 | CallExpression toast/sonner com Literal | `toast.success('Salvo')` | `toast.success(t('saved'))` |
| 7 | NewExpression `Error` com Literal | `throw new Error('Falhou')` | `throw new AppError('save.failed')` |
| 8 | VariableDeclarator UI string const Literal | `const TITLE = 'Programas'` | `const TITLE = t('programs.title')` |
| 9 | Metadata export `title`/`description` Literal | `title: 'desafit'` | `title: t('seo.home.title')` |
| 10 | `fail()` call com Literal | `fail('not_found')` | `fail(AppError.notFound)` |
| 11 | Zod `.message(Literal)` | `.message('obrigatório')` | `.message(t('field.required'))` |
| 12 | React Email body Literal text | `<Text>Olá</Text>` (template) | `<Text>{t('email.hi')}</Text>` |
| 13 | Web Push payload `body` Literal | `body: 'Hora do treino'` | `body: t('push.reminder')` |
| 14 | Error map object Literal value | `{ not_found: 'Não achei' }` | `{ not_found: t('err.404') }` |

**Plugin auxiliar:** `eslint-plugin-i18next` complementa cobertura.

### 2.3 Token bypass (4 padrões)

| # | Selector | Trigger ❌ | OK ✅ |
|---|---|---|---|
| 15 | Literal regex `/^#[0-9a-f]{3,8}$/i` | `color: '#fff'` | `color: 'oklch(var(--surface))'` |
| 16 | Literal regex `/^rgba?\(/` | `background: 'rgb(255,0,0)'` | usar token primary |
| 17 | MemberExpression CSS var em JS | `style={{ color: 'var(--accent)' }}` | className token shadcn |
| 18 | JSXAttribute className Tailwind arbitrary | `className="text-[#fff]"` | `className="text-surface"` |

**Allowlist:** apenas `app/globals.css @theme` declara hex/rgba dentro do `@theme` token block. Resto do codebase usa token semantic.

### 2.4 Estrutura código (4 regras)

| # | Selector | Limite | Trigger ❌ | OK ✅ |
|---|---|---|---|---|
| 19 | `max-lines` file | 300 | arquivo 350 linhas | quebrar em 2 files |
| 20 | `max-lines-per-function` | 60 | função 80 linhas | extrair sub-funções |
| 21 | `complexity` | 12 | função com 15 branches | refatorar early-return |
| 22 | `max-params` | 4 | `function(a,b,c,d,e)` | objeto `{a,b,c,d,e}` |

### 2.5 Guards arquiteturais (2 regras)

| # | Selector | Severity | Trigger ❌ | OK ✅ |
|---|---|---|---|---|
| 23 | `no-restricted-imports` `framer-motion` + `@/lib/supabase/admin` em arquivos `'use client'` | error | `import 'framer-motion'` ou admin client em RSC client | `motion/react` / data layer Server Action |
| 24 | `'use client'` guard em `server-only` files (`lib/data/`, `app/**/actions.ts`, `lib/api/`) | error | `'use client'` no topo de `lib/data/programs.ts` | remover diretiva (RSC default) |

---

## 3. Sheriff boundaries

`@softarc/eslint-plugin-sheriff` configurado com tags em cada folder via `sheriff.config.ts`:

```
app/         → tag: type:feature, side:server
components/  → tag: type:shared
lib/domain/  → tag: type:shared (núcleo)
lib/data/    → tag: type:data, side:server
lib/hooks/   → tag: type:shared (client)
lib/api/     → tag: type:shared, side:server
lib/contracts/ → tag: type:shared (SSOT)
supabase/    → tag: type:data, side:server
```

**Regra (dependência desce, nunca sobe):**

| Pode importar | De |
|---|---|
| `app/`, `components/` | `lib/contracts/`, `lib/hooks/`, `lib/api/`, `lib/domain/`, `lib/data/` (só Server Action) |
| `lib/hooks/` | `lib/contracts/`, `lib/domain/` |
| `lib/data/` | `lib/contracts/`, `lib/domain/` |
| `lib/domain/` | `lib/contracts/` (e nada mais) |
| `lib/contracts/` | (só `zod`, `@/shared`) |

**Não pode:**
- `lib/data/` importar `app/` ou `components/` (Data não sabe da UI)
- `lib/domain/` importar React, Supabase, IO (zero efeito colateral)
- `app/(client)/*` importar `app/(admin)/*` cross-group
- `components/` importar de `app/` (RSC → componentes shared, nunca o contrário)

Detalhes em `blueprint/04-camadas-imports.md`.

---

## 4. 3 CI grep scripts

Defesa secundária — pegam o que regex AST do ESLint não cobre (templates, comments, etc):

### 4.1 `pnpm vocab:audit`

```bash
# pseudo (no _archive/scripts/vocab-audit.sh)
grep -RInE "(student|trainer|intake|wizard|prospect|diagnostic|customization|workspace|framer-motion)" \
  --include='*.{ts,tsx,md,sql,json}' app/ components/ lib/ supabase/ messages/ \
  | grep -v "^.claude/rules/naming.md" \
  | grep -v "ADR mention OK"
exit_code = (matches > 0) ? 1 : 0
```

Allowlist explícita em ADR (8 lugares — D-G66):
1. `.claude/rules/naming.md` (definição)
2. `docs/adr/0012-lint-enforcement-dia-0.md` (este registro)
3. `docs/_archive/*` (histórico)
4. `messages/pt-BR.json` chave `meta.banned_vocab.*` (UI educativa)
5. Vitest fixtures `tests/fixtures/banned-vocab.test.ts` (testar a regra)
6. Block comment `// ADR-NNNN mention OK:` em test files
7. README ADR (índice)
8. `CHANGELOG.md` quando referenciar superseded vocab

### 4.2 `pnpm i18n:audit`

```bash
# grep textual zero-tolerance — captura literal hardcoded em paths críticos
grep -RInE ">[A-ZÀ-Ý][^<>{}]{2,}<" --include='*.tsx' app/ components/ \
  | grep -v "{t(" | grep -v "{...t" \
  | grep -v "^.*messages/"
```

### 4.3 `pnpm token:audit`

```bash
grep -RInE "#[0-9a-fA-F]{3,8}\b|rgba?\(" --include='*.{ts,tsx,css}' app/ components/ lib/ \
  | grep -v "^app/globals.css.*@theme" \
  | grep -v "blurhash"  # blurhash usa hash hex
```

Os 3 scripts rodam em `.github/workflows/ci.yml` step `audit-fences` antes de `build`. Falha → PR bloqueada.

---

## 5. jsx-a11y strict (WCAG 2.2 AA)

`eslint-plugin-jsx-a11y` em modo **recommended + strict** (não default):

- `alt-text`: error
- `anchor-has-content`: error
- `aria-props`: error
- `aria-role` strict: error
- `click-events-have-key-events`: error
- `label-has-associated-control`: error
- `no-noninteractive-tabindex`: error
- `interactive-supports-focus`: error

Complementa APCA dual-gate runtime (Lc ≥75 body / ≥60 large / ≥45 não-text — `05-design-system.md §5`).

---

## 6. `size-limit` bundle budgets

Budgets per-rota (decisão `_CONFLITOS #20`):

| Rota | First Load | Total JS |
|---|---|---|
| Landing pública (`/`, `/[slug]`) | 100KB | 150KB |
| Login / signup | 80KB | 120KB |
| PWA shell (após login) | 170KB | 240KB |
| PWA aba (Início/Programa/Agenda/Chatbot/Perfil) | 50KB incremental | 50KB |
| Editor form-based | 50KB incremental | 80KB |
| Editor inline texto landing | 30KB incremental | 40KB |
| Admin / billing | 60KB incremental | 100KB |

`size-limit` config em `.size-limit.ts`. Build CI falha se rota ultrapassar. Subir budget exige PR + ADR + aprovação fundador.

---

## 7. Zero `eslint-disable` (allowlist única)

Memória `feedback_zero_eslint_disable`. CI grep dedicado:

```bash
grep -RInE "eslint-disable" --include='*.{ts,tsx}' app/ components/ lib/ \
  | grep -vE "block oficial shadcn|third-party-component"
```

2 únicos comentários aceitos no codebase:
- `// eslint-disable-next-line jsx-a11y/heading-has-content — block oficial shadcn`
- `// eslint-disable-next-line react/jsx-no-literals — third-party-component`

Qualquer outro disable = PR bloqueada. Adicionar novo padrão exige ADR.

---

## 8. CI pipeline (orden de execução)

`.github/workflows/ci.yml` — ordem fail-fast:

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck` (tsc --noEmit)
3. `pnpm vocab:audit` ← grep cross-file
4. `pnpm i18n:audit`
5. `pnpm token:audit`
6. `pnpm lint --max-warnings 0 --no-inline-config`
7. `pnpm knip` (zero dead exports)
8. `grep -RInE "eslint-disable" …` (allowlist check)
9. `pnpm test` (vitest)
10. `pnpm build`
11. `pnpm size` (size-limit budgets)

`--no-inline-config` impede `/* eslint-disable */` em runtime de eval. Etapas 3-5 baratas (~3s) e fail-fast.

---

## 9. Custo dia 0 vs ROI

| Item | Horas estimadas |
|---|---|
| Setup ESLint flat + 24 regras | 6h |
| Setup Sheriff boundaries | 2h |
| Setup 3 grep scripts CI | 2h |
| Setup size-limit + budgets | 2h |
| Setup jsx-a11y strict + APCA helper | 1h |
| Setup CI workflow + allowlist | 2h |
| Validação smoke (commit triggering all 24 regras) | 1h |
| **Total** | **~12-16h** |

**ROI.** Onboarding-bio acumulou 830 disables ao longo de 2 anos silenciando token bypass. Custo de adicionar disciplina depois: refator ~50-100h + retest manual. Fazer dia 0 = 12-16h sem dívida acumulada.

---

## 10. Referências cruzadas

- `00-PROJETO.md` §6 (lint/regras code) · §8 (princípio universal busca soluções)
- `_CONFLITOS.md` #12 (lint enforcement) · #20 (bundle budgets) · D-G66 (i18n hardcoded)
- `.claude/rules/naming.md` (vocab banido fonte)
- `02-stack.md` (tooling list)
- `04-camadas-imports.md` (Sheriff detalhes)
- `14-docs-lifecycle.md` (allowlist registrada em ADR)
- `adr/0012-lint-enforcement-dia-0.md` (decisão pinada)
- Memórias: `feedback_zero_eslint_disable`, `feedback_no_legacy_vocabulary`, `project_desafit_i18n_hardcoded_2026_05_17`
- Pesquisa 09 (lint enforcement + token bypass)

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — 24 regras + Sheriff + 3 grep + zero disable | Leandro |

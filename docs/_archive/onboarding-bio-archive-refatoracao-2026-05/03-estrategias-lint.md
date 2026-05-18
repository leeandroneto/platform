# Estrategias de Lint — onboarding.bio

> Pesquisa completa de plugins, regras, e pipeline para tornar o projeto impossivel de quebrar.
> **Criado:** 2026-05-01
> **Fonte:** pesquisa de eslint-plugin-tailwindcss v4, typescript-eslint strict, import sort, unused imports, Prettier, knip, tsconfig hardening.

---

## 1. Estado atual do ESLint

### Arquivo: `eslint.config.mjs` (flat config ESLint 9)

**141 regras ativas:** 87 errors, 21 warns, 33 off.

### Plugins ja configurados

| Plugin                               | Status    | Regras ativas               |
| ------------------------------------ | --------- | --------------------------- |
| `eslint-config-next/core-web-vitals` | Instalado | 8 errors + 13 warns         |
| `eslint-config-next/typescript`      | Instalado | 19 errors + 2 warns         |
| `eslint-plugin-jsx-a11y`             | Instalado | 26 errors (strict) + 1 warn |
| `react/jsx-no-literals`              | Custom    | 1 warn (i18n Phase F)       |
| `no-restricted-syntax`               | Custom    | 6 selectors (DS governance) |
| `no-restricted-imports`              | Custom    | framer-motion, next/router  |

### Gaps criticos identificados

| Gap                         | Impacto                             | Solucao                                                         |
| --------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| **Import order**            | Imports desorganizados              | `eslint-plugin-simple-import-sort`                              |
| **Imports mortos**          | Dead imports acumulam               | `eslint-plugin-unused-imports`                                  |
| **Tailwind arbitrary**      | `p-[13px]` nao bloqueado            | `eslint-plugin-better-tailwindcss`                              |
| **Formatacao**              | Sem Prettier                        | `prettier` + `prettier-plugin-tailwindcss`                      |
| **Dead code**               | Componentes/exports mortos          | `knip`                                                          |
| **HTML raw**                | So bloqueia button/h1-h6            | Expandir pra input/textarea/select/table/dialog/label/img       |
| **TypeScript type-checked** | Sem regras type-aware               | `no-floating-promises`, `no-misused-promises`, `await-thenable` |
| **DOM direto**              | `document.getElementById` permitido | `no-restricted-syntax` selectors                                |
| **Console**                 | `console.log` livre                 | `no-console` warn                                               |
| **i18n**                    | Ainda `warn`                        | Promover pra `error`                                            |

---

## 2. Plugins a instalar

### 2.1 eslint-plugin-simple-import-sort

**O que faz:** ordena imports automaticamente. Auto-fixable.

```bash
pnpm add -D eslint-plugin-simple-import-sort
```

```js
import simpleImportSort from "eslint-plugin-simple-import-sort";

{
  plugins: { "simple-import-sort": simpleImportSort },
  rules: {
    "simple-import-sort/imports": ["error", {
      groups: [
        ["^\\u0000"],                                // side effects
        ["^node:", "^react$", "^react-dom", "^next"], // node/react/next
        ["^@?\\w"],                                   // external packages
        ["^@/lib"],                                   // internal lib
        ["^@/components"],                            // internal components
        ["^@/"],                                      // other internal
        ["^\\."],                                     // relative
      ],
    }],
    "simple-import-sort/exports": "error",
  },
}
```

**Por que este e nao `eslint-plugin-import`:** import plugin tem bugs cronicos com ESLint 9 flat config. simple-import-sort e zero-config, auto-fixable, e nativo flat config.

### 2.2 eslint-plugin-unused-imports

**O que faz:** detecta E remove imports nao usados automaticamente no `--fix`.

```bash
pnpm add -D eslint-plugin-unused-imports
```

```js
import unusedImports from "eslint-plugin-unused-imports";

{
  plugins: { "unused-imports": unusedImports },
  rules: {
    "unused-imports/no-unused-imports": "error",
  },
}
```

**Complementa** `@typescript-eslint/no-unused-vars` que pega variaveis mas nao remove imports.

### 2.3 eslint-plugin-better-tailwindcss

**O que faz:** valida classes Tailwind v4, ordena, detecta conflitos, bloqueia arbitrarios. Suporte nativo a `@theme` em CSS (nao precisa de `tailwind.config.ts`).

```bash
pnpm add -D eslint-plugin-better-tailwindcss
```

Regras:

- `no-unknown-classes` — typos como `bg-primary-forground`
- `no-conflicting-classes` — `p-4 p-8` contraditorios
- `sort-classes` — ordem deterministica (pode desabilitar se usar prettier-plugin-tailwindcss)
- `multiline` — quebra classes longas

**Alternativa CSS-side:** `@poupe/eslint-plugin-tailwindcss` — valida `@theme`, `@apply`, `theme()` em arquivos CSS.

### 2.4 Prettier + prettier-plugin-tailwindcss

**O que faz:** formatacao consistente + class sorting oficial do Tailwind.

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Nota:** `prettier-plugin-tailwindcss` tem suporte oficial a Tailwind v4 e le tokens de `@theme` em CSS. Nao precisa de `tailwind.config.ts`.

**NAO instalar** `eslint-plugin-prettier` — roda Prettier dentro do ESLint (lento, problematico). Rodar separado no lint-staged.

### 2.5 knip

**O que faz:** detecta dead code — arquivos, exports, dependencias, tipos nao usados.

```bash
pnpm add -D knip
```

```json
// knip.json
{
  "entry": ["app/**/*.{ts,tsx}", "lib/**/*.ts", "components/**/*.{ts,tsx}"],
  "project": ["**/*.{ts,tsx}"],
  "ignore": ["supabase/functions/**", "scripts/**", "onboarding-bio/**", "docs/**"],
  "ignoreDependencies": ["@tailwindcss/postcss", "tailwindcss", "@types/*"],
  "next": {
    "entry": [
      "app/**/page.tsx",
      "app/**/layout.tsx",
      "app/**/loading.tsx",
      "app/**/error.tsx",
      "app/**/not-found.tsx",
      "app/**/route.ts",
      "app/**/actions.ts",
      "proxy.ts"
    ]
  }
}
```

Rodar no pre-push e CI.

---

## 3. Regras no-restricted-syntax — 17 selectors

### HTML raw → shadcn (10 selectors)

```js
// Scope: app/**/*.tsx, components/**/*.tsx
// Ignores: components/ui/**, components/motion/**

{ selector: "JSXOpeningElement[name.name='button']",
  message: "Use <Button> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='input']",
  message: "Use <Input> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='textarea']",
  message: "Use <Textarea> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='select']",
  message: "Use <Select> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='table']",
  message: "Use <Table> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='dialog']",
  message: "Use <Dialog> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='label']",
  message: "Use <Label> from components/ui/ (DS)." },
{ selector: "JSXOpeningElement[name.name='img']",
  message: "Use <Image> from next/image." },
{ selector: "JSXOpeningElement[name.name=/^h[1-6]$/]",
  message: "Use <Heading level={N}> (D62)." },
{ selector: "JSXOpeningElement[name.type='JSXMemberExpression'][name.object.name='motion'][name.property.name='button']",
  message: "Use <Button> with motion, not <motion.button>." },
```

### Inline perigoso (4 selectors)

```js
{ selector: "JSXAttribute[name.name='style'] Literal[value=/^#[0-9a-fA-F]/]",
  message: "No hex in style. Use CSS var or Tailwind." },
{ selector: "JSXAttribute[name.name='style'] Literal[value=/^rgb/]",
  message: "No rgb() in style. Use CSS var or Tailwind." },
{ selector: "JSXAttribute[name.name='style'] Literal[value=/^hsl/]",
  message: "No hsl() in style. Use CSS var or Tailwind." },
{ selector: "JSXAttribute[name.name='style'] Literal[value=/^oklch/]",
  message: "No oklch() in style. Use CSS var or Tailwind." },
```

### DOM direto (3 selectors)

```js
{ selector: "CallExpression[callee.object.name='document'][callee.property.name='getElementById']",
  message: "Use React refs, not document.getElementById." },
{ selector: "CallExpression[callee.object.name='document'][callee.property.name='querySelector']",
  message: "Use React refs, not document.querySelector." },
{ selector: "CallExpression[callee.object.name='document'][callee.property.name='querySelectorAll']",
  message: "Use React refs, not document.querySelectorAll." },
```

---

## 4. Regras no-restricted-imports — expandido

```js
"no-restricted-imports": ["error", {
  paths: [
    { name: "framer-motion", message: "Use 'motion/react' (D15)." },
    { name: "next/router", message: "Use 'next/navigation' (App Router)." },
    { name: "next/document", message: "Use app/layout.tsx (App Router)." },
    { name: "next/head", message: "Use Metadata API (App Router)." },
    { name: "@supabase/supabase-js", importNames: ["createClient"],
      message: "Use @/lib/supabase/client or /server." },
    { name: "vitest", message: "Only import in *.test.ts files." },
  ],
  patterns: [
    { group: ["framer-motion/*"], message: "Use 'motion/react' (D15)." },
    { group: ["@/app/*"], message: "lib/ must not import from app/." },
  ],
}],
```

**Override pra test files:**

```js
{
  files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
  rules: { "no-restricted-imports": "off" },
}
```

---

## 5. TypeScript type-checked rules

Requer `projectService` no parser:

```js
{
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
    }],
    // Phase-in (warn first, error later):
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
  },
}
```

**Nota:** type-checked rules tornam ESLint ~2-3x mais lento. Aceitable pra CI e pre-commit. Se necessario, rodar so no pre-push.

---

## 6. tsconfig hardening

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true
  }
}
```

| Opcao                              | O que pega                         | Esforco migracao     |
| ---------------------------------- | ---------------------------------- | -------------------- |
| `noUncheckedIndexedAccess`         | `arr[0]` retorna `T \| undefined`  | Medio (50-200 erros) |
| `noFallthroughCasesInSwitch`       | switch sem break/return            | Baixo                |
| `forceConsistentCasingInFileNames` | Import case mismatch (fatal Linux) | Zero                 |
| `verbatimModuleSyntax`             | Forca `import type { X }`          | Medio (auto-fixable) |

---

## 7. Pipeline Husky otimizado

### Pre-commit (`.husky/pre-commit`)

```bash
pnpm exec lint-staged
```

### lint-staged (`.lintstagedrc.mjs`)

```js
const config = {
  '!(scripts)/**/*.{js,jsx,ts,tsx,mjs,cjs}': [
    'eslint --max-warnings=0 --no-warn-ignored --fix',
    'prettier --write',
  ],
  '!(scripts)/**/*.{ts,tsx}': () => 'tsc --noEmit',
  '!(scripts)/**/*.{json,css,md,yml,yaml}': ['prettier --write'],
}
export default config
```

### Commit-msg (`.husky/commit-msg`)

```bash
pnpm exec commitlint --edit "$1"
```

### Pre-push (`.husky/pre-push`)

```bash
pnpm exec vitest run
pnpm exec tsc --noEmit
pnpm knip
```

---

## 8. Ordem de implementacao

| #   | Acao                                             | Esforco                        | Valor    |
| --- | ------------------------------------------------ | ------------------------------ | -------- |
| 1   | `simple-import-sort` + `unused-imports`          | 15min install + auto-fix sweep | Imediato |
| 2   | Expandir `no-restricted-syntax` (9 HTML + 4 DOM) | 30min                          | Alto     |
| 3   | Expandir `no-restricted-imports`                 | 15min                          | Alto     |
| 4   | Prettier + `prettier-plugin-tailwindcss`         | 30min install + format sweep   | Alto     |
| 5   | Type-checked rules                               | 1h install + fix warnings      | Alto     |
| 6   | Promover `jsx-no-literals` pra error             | Fix residuals primeiro         | Alto     |
| 7   | tsconfig `noUncheckedIndexedAccess`              | 4-8h fix erros                 | Medio    |
| 8   | knip no pre-push + CI                            | 30min config                   | Alto     |
| 9   | `eslint-plugin-better-tailwindcss`               | 1h install + fix               | Medio    |
| 10  | tsconfig `verbatimModuleSyntax`                  | 2-4h fix imports               | Medio    |

# ESLint Token-Bypass Enforcement for Next.js 16 + Tailwind v4 + shadcn

This report specifies a defense-in-depth ESLint configuration that makes the ten enumerated token-bypass patterns un-mergeable in a multi-tenant white-label SaaS using Tailwind v4 CSS-first `@theme` with 13 OKLCH palettes. Every rule is set to `error` from day one; "warn first, escalate later" is explicitly rejected as anti-pattern #1.

A note on tooling freshness: Next.js 16, React 19, Tailwind v4 and ESLint 9 flat config are current as of writing. `eslint-plugin-better-tailwindcss` (`schoero/eslint-plugin-better-tailwindcss`) is the only Tailwind-v4-native ESLint plugin with the `settings["better-tailwindcss"].entryPoint` option required to resolve CSS-first `@theme` tokens; `eslint-plugin-tailwindcss` (francoismassart) still labels v4 support as partial. None of the rules below depend on type information, so they're orthogonal to the React Compiler 1.0 transform.

---

## 1. The Ten Rules — Master Table

| #   | Pattern                                      | Plugin / config key                                                         | Selector or option                                                                                                                                                                                                                                             | Error message (first line)                                                                                            |
| --- | -------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | `style={{ color: '#fff' }}`                  | `no-restricted-syntax` (core)                                               | `JSXAttribute[name.name='style'] ObjectExpression > Property[key.name=/^(color\|background\|backgroundColor\|border\|borderColor\|fill\|stroke\|outlineColor\|caretColor\|textDecorationColor)$/] > Literal`                                                   | `Inline color literal banned. Use Tailwind semantic class (text-primary, bg-surface-base). See docs/design.md#tokens` |
| 2   | `text-[#fff]`, `bg-[oklch(...)]`             | `better-tailwindcss/no-restricted-classes`                                  | regex `^(text\|bg\|border\|fill\|stroke\|ring\|shadow\|outline\|caret\|accent\|decoration\|divide)-\[.*\]$`                                                                                                                                                    | `Arbitrary color class banned. Add the token to @theme then use semantic alias.`                                      |
| 3   | `bg-red-500`, `text-blue-700`                | `better-tailwindcss/no-restricted-classes`                                  | regex `^(text\|bg\|border\|fill\|stroke\|ring\|outline\|caret\|accent\|decoration\|divide)-(slate\|gray\|zinc\|neutral\|stone\|red\|orange\|amber\|yellow\|lime\|green\|emerald\|teal\|cyan\|sky\|blue\|indigo\|violet\|purple\|fuchsia\|pink\|rose)-\d{2,3}$` | `Raw Tailwind palette banned. Use semantic token (e.g. bg-surface-base, text-muted-foreground).`                      |
| 4   | `<style dangerouslySetInnerHTML>`            | `no-restricted-syntax` (core); reinforced by `react/no-danger`              | `JSXAttribute[name.name='dangerouslySetInnerHTML']`                                                                                                                                                                                                            | `dangerouslySetInnerHTML banned (XSS + token bypass). Use @layer in app/globals.css.`                                 |
| 5   | `*.module.css` with `color: #fff`            | **stylelint** `color-no-hex` + `declaration-property-value-disallowed-list` | see §6                                                                                                                                                                                                                                                         | `Hex/raw color in CSS Module banned. Reference var(--color-*) only.`                                                  |
| 6   | `` tw`text-[#fff]` ``, `clsx('text-[#fff]')` | `better-tailwindcss/no-restricted-classes` + `tags`/`callees` settings      | adds `tags: ['tw','css']`, `callees: ['clsx','cn','cva','tv','twMerge']`                                                                                                                                                                                       | Same as rule 2 — plugin parses tagged templates and call expressions natively.                                        |
| 7   | `<path fill="#fff"/>` in inline SVG          | `no-restricted-syntax` (core)                                               | `JSXAttribute[name.name=/^(fill\|stroke\|stopColor\|floodColor\|lightingColor)$/] > Literal[value=/^(#\|rgb\|hsl\|oklch\|oklab\|color\()/i]`                                                                                                                   | `SVG color literal banned. Use currentColor or className with token.`                                                 |
| 8   | `rounded-[12px]`                             | `better-tailwindcss/no-restricted-classes`                                  | regex `^rounded(-[trblse]\|-[xy])?-\[.*\]$`                                                                                                                                                                                                                    | `Arbitrary radius banned. Use --radius-* token (rounded-card, rounded-button).`                                       |
| 9   | `p-[7px]`, `m-[3px]`, `gap-[5px]`            | `better-tailwindcss/no-restricted-classes`                                  | regex `^(p\|m\|gap\|space-[xy]\|inset\|top\|right\|bottom\|left)[trblxyse]?-\[.*\]$`                                                                                                                                                                           | `Off-scale spacing banned. Use 4-pt scale (p-1..p-12) or add token.`                                                  |
| 10  | `text-[14px]`, `leading-[1.2]`               | `better-tailwindcss/no-restricted-classes`                                  | regex `^(text-\[(?!.*(currentcolor\|var\()).*\]\|leading-\[.*\]\|tracking-\[.*\])$`                                                                                                                                                                            | `Raw font size banned. Use type-scale token (text-body, text-h2).`                                                    |

Notes:

- Rules 2, 3, 6, 8, 9, 10 all funnel through one plugin (`better-tailwindcss/no-restricted-classes`) because that plugin's parser already understands `clsx()`, `cn()`, `tv()`, `cva()`, the `tw` tagged template, and v4 object-valued `classNames={{ root: '…' }}` props. Doing this with raw regex on JSX strings was the source of the **D74 bug**: hand-rolled regex didn't see `clsx('text-[#fff]')` because the literal isn't inside a `className=` attribute.
- Rule 4 keeps `react/no-danger` as a back-up (different message ID, same enforcement), so removing one rule still fails the build.
- All semantic aliases (`text-primary`, `bg-surface-base`, `text-h2`, `rounded-card`, etc.) are declared in `app/globals.css` `@theme { … }` and resolved by `better-tailwindcss` via `settings["better-tailwindcss"].entryPoint`. `no-unregistered-classes` then automatically permits them and rejects typos.

---

## 2. Fixtures — 10 Passing, 10 Failing

Each fixture is one or two lines and lives in `tests/lint/fixtures/`.

### Passing (`*.pass.tsx` / `*.pass.css`)

```tsx
// 01-inline-style.pass.tsx
export const A = () => <div className="text-primary bg-surface-base">ok</div>;

// 02-arbitrary-color.pass.tsx
export const B = () => <div className="bg-[var(--color-brand-500)]">ok</div>;

// 03-raw-palette.pass.tsx
export const C = () => <button className="bg-primary text-primary-foreground">ok</button>;

// 04-dangerously.pass.tsx
export const D = () => <article className="prose-tokens">ok</article>;

// 05-css-module.pass.module.css
.foo { color: var(--color-foreground); background: var(--color-surface-base); }

// 06-clsx-tw.pass.tsx
import { cn } from '@/lib/cn'; export const F = () => <p className={cn('text-body', 'text-muted-foreground')}>ok</p>;

// 07-svg-color.pass.tsx
export const G = () => <svg viewBox="0 0 24 24" className="text-primary"><path fill="currentColor" d="M0 0h24v24H0z"/></svg>;

// 08-radius.pass.tsx
export const H = () => <div className="rounded-card">ok</div>;

// 09-spacing.pass.tsx
export const I = () => <div className="p-4 gap-2">ok</div>;

// 10-font-size.pass.tsx
export const J = () => <h2 className="text-h2 leading-tight">ok</h2>;
```

### Failing (`*.fail.tsx` / `*.fail.css`)

```tsx
// 01-inline-style.fail.tsx
export const A = () => <div style={{ color: '#fff' }}>x</div>;

// 02-arbitrary-color.fail.tsx
export const B = () => <div className="bg-[oklch(0.7_0.2_30)]">x</div>;

// 03-raw-palette.fail.tsx
export const C = () => <button className="bg-red-500 text-blue-700">x</button>;

// 04-dangerously.fail.tsx
export const D = () => <style dangerouslySetInnerHTML={{ __html: '.x{color:#fff}' }} />;

// 05-css-module.fail.module.css
.foo { color: #fff; background: rgb(255 0 0); }

// 06-clsx-tw.fail.tsx
import { clsx } from 'clsx'; export const F = () => <p className={clsx('text-[#fff]')}>x</p>;

// 07-svg-color.fail.tsx
export const G = () => <svg><path fill="#fff" stroke="rgb(0,0,0)" d="M0 0h24v24H0z"/></svg>;

// 08-radius.fail.tsx
export const H = () => <div className="rounded-[12px]">x</div>;

// 09-spacing.fail.tsx
export const I = () => <div className="p-[7px] gap-[5px]">x</div>;

// 10-font-size.fail.tsx
export const J = () => <h2 className="text-[14px] leading-[1.2]">x</h2>;
```

---

## 3. `eslint.config.ts` (flat config, TypeScript)

```ts
// eslint.config.ts
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import unicorn from 'eslint-plugin-unicorn'
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'
import sheriff from 'eslint-config-sheriff'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TW_ENTRY = resolve(__dirname, 'app/globals.css')

// --- 1) banned color properties on JSX `style` --------------------------------
const COLOR_PROPS =
  '^(color|background|backgroundColor|border|borderColor|borderTopColor|' +
  'borderRightColor|borderBottomColor|borderLeftColor|fill|stroke|' +
  'outlineColor|caretColor|textDecorationColor|columnRuleColor|accentColor)$'

const SVG_COLOR_ATTRS = '^(fill|stroke|stopColor|floodColor|lightingColor)$'
const COLOR_LITERAL = '^(#|rgb|rgba|hsl|hsla|oklch|oklab|color\\(|lab\\(|lch\\()'

// --- 2) banned Tailwind classes (regex strings consumed by no-restricted-classes)
const PALETTES =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|' +
  'teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

const COLOR_UTILS =
  'text|bg|border|fill|stroke|ring|shadow|outline|caret|accent|decoration|divide|placeholder|from|via|to'

const SPACING_UTILS =
  'p|m|gap|space-x|space-y|inset|top|right|bottom|left|w|h|min-w|min-h|max-w|max-h'

const restrictedClasses = [
  // 2 — arbitrary color values
  {
    pattern: `^(${COLOR_UTILS})-\\[.*\\]$`,
    message:
      'Arbitrary color class banned. Add token to @theme then use semantic alias. See docs/design.md#tokens',
  },
  // 3 — raw Tailwind palette
  {
    pattern: `^(${COLOR_UTILS})-(${PALETTES})-\\d{2,3}$`,
    message:
      'Raw Tailwind palette banned. Use semantic token (e.g. bg-surface-base, text-primary).',
  },
  // 8 — arbitrary radius
  {
    pattern: '^rounded(-[trblse]|-[xy])?-\\[.*\\]$',
    message: 'Arbitrary radius banned. Use --radius-* token (rounded-card, rounded-button).',
  },
  // 9 — arbitrary spacing
  {
    pattern: `^(${SPACING_UTILS})[trblxyse]?-\\[(?!var\\().*\\]$`,
    message: 'Off-scale spacing banned. Use the 4-pt scale or add a --spacing-* token.',
  },
  // 10 — raw font metrics
  {
    pattern: '^(text-\\[(?!.*(currentcolor|var\\()).*\\]|leading-\\[.*\\]|tracking-\\[.*\\])$',
    message: 'Raw font size/leading banned. Use type-scale token (text-body, text-h2).',
  },
]

export default tseslint.config(
  // base
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...sheriff, // boundaries
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  unicorn.configs['flat/recommended'],
  eslintComments.recommended,

  // ============================================================
  // Token-bypass guard (applies to all source)
  // ============================================================
  {
    name: 'tokens/guard',
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: [
      // see §10 — allowlist
      'components/ui/**', // shadcn unmodified blocks
      'src/components/third-party/**', // upstream wrappers
      'tests/lint/fixtures/**', // intentional violations
    ],
    plugins: { 'better-tailwindcss': betterTailwind, react: react as never },
    settings: {
      'better-tailwindcss': {
        entryPoint: TW_ENTRY, // <-- Tailwind v4 @theme resolver
        attributes: ['className', 'class', 'classNames'],
        callees: ['clsx', 'cn', 'cva', 'tv', 'twMerge', 'classnames'],
        tags: ['tw', 'css'],
        variables: ['className', 'classes', 'tw'],
      },
    },
    rules: {
      // Rule 1 — inline style color literal
      'no-restricted-syntax': [
        'error',
        {
          selector:
            `JSXAttribute[name.name='style'] ObjectExpression > ` +
            `Property[key.name=/${COLOR_PROPS}/] > Literal`,
          message:
            'Inline color literal banned. Use Tailwind semantic class. See docs/design.md#tokens',
        },
        // Rule 4 — dangerouslySetInnerHTML
        {
          selector: `JSXAttribute[name.name='dangerouslySetInnerHTML']`,
          message:
            'dangerouslySetInnerHTML banned (XSS + token bypass). Use @layer in app/globals.css.',
        },
        // Rule 7 — SVG fill/stroke literal
        {
          selector:
            `JSXAttribute[name.name=/${SVG_COLOR_ATTRS}/] > ` +
            `Literal[value=/${COLOR_LITERAL}/i]`,
          message: 'SVG color literal banned. Use currentColor or className token.',
        },
        // Rule 7 (b) — JSXExpressionContainer with template literal containing #/oklch
        {
          selector:
            `JSXAttribute[name.name=/${SVG_COLOR_ATTRS}/] ` +
            `TemplateElement[value.raw=/${COLOR_LITERAL}/i]`,
          message: 'SVG color literal banned (template). Use currentColor or className token.',
        },
      ],

      // Rule 4 (b) — defence-in-depth
      'react/no-danger': 'error',

      // Rules 2, 3, 6, 8, 9, 10 — Tailwind class enforcement
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        {
          detectComponentClasses: true,
          ignore: ['^dark$', '^light$'],
        },
      ],
      'better-tailwindcss/no-restricted-classes': [
        'error',
        {
          restrict: restrictedClasses,
        },
      ],
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/enforce-consistent-class-order': 'warn', // stylistic only

      // Eslint-comments — make disabling expensive (see §7)
      '@eslint-community/eslint-comments/no-use': [
        'error',
        {
          allow: ['eslint-disable-next-line'],
        },
      ],
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/no-unused-disable': 'error',
    },
  },

  // ============================================================
  // Allowlisted zones (rules relaxed, see §10)
  // ============================================================
  {
    files: ['components/ui/**', 'src/components/third-party/**'],
    rules: {
      'better-tailwindcss/no-restricted-classes': 'off',
      'no-restricted-syntax': 'off',
    },
  },
)
```

---

## 4. Fixture Regression Tests — Vitest

### 4.1 Directory layout (`tests/lint/`)

```
tests/lint/
├── token-bypass.test.ts          # one file, ten describe blocks
├── lint-runner.ts                # ESLint programmatic helper
└── fixtures/
    ├── 01-inline-style.pass.tsx
    ├── 01-inline-style.fail.tsx
    ├── …
    ├── 05-css-module.pass.module.css
    └── 05-css-module.fail.module.css
```

### 4.2 `lint-runner.ts`

```ts
import { ESLint } from 'eslint'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')

export async function lintFixture(relPath: string) {
  const eslint = new ESLint({
    cwd: ROOT,
    overrideConfigFile: resolve(ROOT, 'eslint.config.ts'),
    // tests/lint/fixtures is in `ignores` in the main config to keep CI clean;
    // override that here so the test runner sees the deliberate violations.
    ignore: false,
  })
  const filePath = resolve(__dirname, 'fixtures', relPath)
  const code = readFileSync(filePath, 'utf8')
  const [result] = await eslint.lintText(code, { filePath })
  return {
    errors: result.messages.filter((m) => m.severity === 2),
    warnings: result.messages.filter((m) => m.severity === 1),
    raw: result.messages,
  }
}

export const ruleIdsOf = (messages: { ruleId: string | null }[]) =>
  messages.map((m) => m.ruleId).filter(Boolean) as string[]
```

### 4.3 `token-bypass.test.ts` — one full test + nine stubs

```ts
import { describe, it, expect } from 'vitest'
import { lintFixture, ruleIdsOf } from './lint-runner'

/**
 * Each rule has TWO assertions:
 *   - .pass fixture produces ZERO errors
 *   - .fail fixture produces AT LEAST ONE error with the expected ruleId
 *     AND a message that contains the documented hint substring.
 *
 * The pass-fixture assertion is the regression guard against the "D74 bug":
 * if the rule is silently disabled, the fail fixture stops erroring; if a
 * selector is broadened too far, the pass fixture starts erroring. Asserting
 * BOTH halves catches both failure modes — D74 went undetected because only
 * the fail half was asserted.
 */

describe('01 — inline style color literal', () => {
  it('passes valid token-based code', async () => {
    const { errors } = await lintFixture('01-inline-style.pass.tsx')
    expect(errors).toHaveLength(0)
  })

  it('fails on `style={{ color: "#fff" }}`', async () => {
    const { errors } = await lintFixture('01-inline-style.fail.tsx')
    expect(errors.length).toBeGreaterThanOrEqual(1)
    expect(ruleIdsOf(errors)).toContain('no-restricted-syntax')
    expect(errors[0].message).toMatch(/Inline color literal banned/)
    expect(errors[0].message).toMatch(/docs\/design\.md#tokens/)
  })
})

describe.todo('02 — Tailwind arbitrary color [#…] / [oklch(…)]')
describe.todo('03 — raw Tailwind palette bg-red-500')
describe.todo('04 — dangerouslySetInnerHTML on any tag')
describe.todo('05 — CSS module hex literal (delegated to stylelint, see §6)')
describe.todo('06 — clsx/tw tagged template with arbitrary color')
describe.todo('07 — SVG fill/stroke literal')
describe.todo('08 — rounded-[12px] arbitrary radius')
describe.todo('09 — p-[7px] off-scale spacing')
describe.todo('10 — text-[14px] raw font size')
```

This skeleton is the explicit D74 prevention: every rule referenced by the table in §1 must have a `describe()` that exercises both fixtures and asserts both halves.

---

## 5. `.husky/pre-commit`

Husky 10 supports shorthand without the deprecated boilerplate:

```bash
#!/usr/bin/env sh
# .husky/pre-commit
set -e

# 1. Fast — only staged files via lint-staged
pnpm exec lint-staged

# 2. Fixture regression — runs in ~2 s; protects against D74
pnpm vitest run tests/lint --reporter=dot

# 3. Defense-in-depth grep — no eslint-disable outside allowlist
pnpm run lint:grep-disables
```

with the corresponding `package.json` scripts:

```jsonc
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "lint:grep-disables": "bash scripts/grep-disables.sh",
    "test:lint": "vitest run tests/lint",
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --max-warnings=0 --fix"],
    "*.{css,module.css}": ["stylelint --fix"],
  },
}
```

---

## 6. CSS Modules — Decision and Stylelint Strategy

**Decision: keep CSS modules legal, but gate them with stylelint.** The shadcn new-york dark-first preset doesn't ship CSS modules and Tailwind v4 `@theme` covers ~98 % of styling, but third-party widgets occasionally need a scoped class. Banning `*.module.css` outright would push devs into `style={{}}` (worse). Banning hex literals inside CSS modules with stylelint is one rule and zero false positives.

`eslint-plugin-css-modules` solves a _different_ problem (validating that `styles.foo` resolves to a declared class) and **cannot** detect raw color values inside CSS — it doesn't parse CSS, only TS/JS imports. Stylelint is the correct layer.

### `stylelint.config.mjs`

```js
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Rule 5 — hex literals (covers #fff, #fffaaa, #fffa, etc.)
    'color-no-hex': [
      true,
      {
        message: 'Hex color banned in CSS Modules. Use var(--color-*) only.',
      },
    ],
    // Block rgb()/hsl()/oklch() literals and named colors on color properties
    'declaration-property-value-disallowed-list': [
      {
        '/^(color|background|background-color|border|border-color|fill|stroke|outline-color|caret-color|text-decoration-color)$/':
          [
            '/^(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\\(/i',
            '/^(red|blue|green|black|white|gray|grey|yellow|orange|purple|pink|cyan|magenta)$/i',
          ],
        '/^(border-radius|padding|margin|gap)$/': ['/\\d+px/'],
      },
      {
        message:
          'Raw color/spacing value banned. Use var(--color-*) / var(--spacing-*) / var(--radius-*).',
        severity: 'error',
      },
    ],
  },
  overrides: [
    // Tailwind entrypoint legally contains oklch() inside @theme
    {
      files: ['app/globals.css', 'styles/**'],
      rules: { 'color-no-hex': null, 'declaration-property-value-disallowed-list': null },
    },
  ],
}
```

Run as `pnpm stylelint "**/*.{css,module.css}"`; joins the pre-commit hook via lint-staged.

---

## 7. CI: `grep-disables` job (defense-in-depth)

`@eslint-community/eslint-comments/no-use` already errors on disable comments inside `eslint.config.ts`-scoped files, but a malicious or careless commit could disable the eslint-comments plugin itself. The grep job is the layer ESLint can't subvert.

### `scripts/grep-disables.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

# Allowlist — mirrors ESLint `ignores`, see §10
ALLOW_REGEX='^(components/ui/|src/components/third-party/|tests/lint/fixtures/)'

matches=$(grep -rEn \
  --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
  --include='*.css' --include='*.mts' --include='*.cts' \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist \
  -e 'eslint-disable' \
  -e 'stylelint-disable' \
  -e 'biome-ignore' \
  -e '@ts-ignore' \
  -e '@ts-expect-error' \
  . | grep -Ev "$ALLOW_REGEX" || true)

if [ -n "$matches" ]; then
  echo "❌ Lint-disable / ts-ignore comments found outside allowlist (threshold: 0):"
  echo "$matches"
  exit 1
fi
echo "✅ No lint-disable comments outside allowlist."
```

### `.github/workflows/ci.yml` (job snippet)

```yaml
jobs:
  grep-disables:
    name: Grep lint-disable (threshold 0)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Block any eslint-disable / stylelint-disable / biome-ignore / ts-ignore
        run: bash scripts/grep-disables.sh

  lint:
    name: ESLint + Stylelint + fixture regression
    runs-on: ubuntu-latest
    needs: grep-disables
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm stylelint "**/*.{css,module.css}"
      - run: pnpm vitest run tests/lint
```

`needs: grep-disables` runs the cheapest, most-tamper-proof check first; later jobs skip, saving CI minutes when a PR introduces a disable comment.

---

## 8. Claude Code PreToolUse Hook — `block-disables.sh`

### `.claude/settings.json` (project-scoped)

```jsonc
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/block-disables.sh",
          },
        ],
      },
    ],
  },
}
```

### `.claude/hooks/block-disables.sh`

```bash
#!/usr/bin/env bash
# Block Claude Code from writing eslint-disable / stylelint-disable / biome-ignore
# anywhere outside the allowlist. Exit 2 = hard block, stderr is shown to Claude
# so it can self-correct.
set -euo pipefail

INPUT=$(cat)

# tool_input shape differs between Edit / Write / MultiEdit
FILE_PATH=$(echo "$INPUT" | jq -r '
  .tool_input.file_path
  // .tool_input.path
  // .tool_input.notebook_path
  // empty
')

# Content to inspect:
#  - Write           -> .content
#  - Edit            -> .new_string
#  - MultiEdit       -> .edits[].new_string (concatenated)
CONTENT=$(echo "$INPUT" | jq -r '
  ( .tool_input.content //
    .tool_input.new_string //
    ( [.tool_input.edits[]?.new_string // empty] | join("\n") )
  ) // empty
')

# Allowlist — must mirror eslint.config.ts `ignores` and scripts/grep-disables.sh
ALLOW_REGEX='^(.*/)?(components/ui/|src/components/third-party/|tests/lint/fixtures/)'

if [[ -n "$FILE_PATH" ]] && [[ "$FILE_PATH" =~ $ALLOW_REGEX ]]; then
  exit 0   # allowlisted path — let it through
fi

if echo "$CONTENT" | grep -Eq '(eslint-disable|stylelint-disable|biome-ignore|@ts-expect-error|@ts-ignore)'; then
  cat >&2 <<'EOF'
BLOCKED: lint-disable comment detected.

This project enforces token usage via ESLint (see eslint.config.ts) and a
zero-disable policy outside an allowlist (components/ui/**,
src/components/third-party/**, tests/lint/fixtures/**).

If you hit a token-bypass error:
  1. Add the missing token to app/globals.css @theme { ... }
  2. Use the semantic alias (text-primary, bg-surface-base, rounded-card,
     text-h2, etc.) — see docs/design.md#tokens
  3. NEVER disable the lint rule.

If the file is genuinely third-party, move it under
src/components/third-party/ and re-try.
EOF
  exit 2
fi

exit 0
```

Two known Claude-Code caveats matter: (a) older builds had PreToolUse exit-2 not reliably blocking `Write`/`Edit` (issue #13744 — confirm fixed on the running CLI version); (b) Claude can route around an `Edit` block by writing the same file via `Bash` heredoc (issue #29709). The grep job in §7 is therefore the ground truth — the hook is best-effort UX.

---

## 9. Five Anti-Patterns That Look Right But Kill Enforcement

1. **"Warn first, then escalate to error after migration."** Warnings get ignored, accumulated, and grandfathered. Code review treats a yellow squiggle the same as no squiggle. **Fix:** error from day one; ship the migration PR that fixes every existing violation in the same commit that lands the rule.

2. **One AST selector with only the fail fixture asserted.** This is the D74 shape: the rule "works" in CI for months, then a refactor silently neutralises the selector and both fixtures pass. **Fix:** every test asserts (a) `errors.length === 0` on the pass fixture _and_ (b) `errors.length ≥ 1` with the correct `ruleId` on the fail fixture.

3. **Trusting `react/no-danger` alone for rule #4.** That rule errors on the JSX prop name only; switching to `React.createElement('div', { dangerouslySetInnerHTML: {...} })` evades it, as does an MDX component. **Fix:** pair it with the AST-selector version, which catches both forms.

4. **Linting only `**/_.tsx`and forgetting`app/`, `.storybook/`, `src/server/`, `_.config.ts`, MDX components, email templates.** Token leaks happen most often in non-component code. **Fix:** the flat config `files: ['**/*.{ts,tsx,js,jsx}']` is intentional; the per-file overrides allow tests/UI primitives, nothing else.

5. **`eslint-disable` next to "// TODO migrate" with no expiry.** These never get migrated. **Fix:** `@eslint-community/eslint-comments/require-description` + a CI grep that allow-lists _paths_, never _reasons_. If a disable is truly required, the file must move into the allowlist, which forces a code-review conversation.

Bonus (because the user asked for five — adding a sixth for completeness): **letting the `enforce-consistent-class-order` rule run as `error`.** Stylistic class-order changes generate massive diff noise that drowns out actual token-bypass errors in code review. Keep stylistic rules at `warn` (or off), correctness/policy rules at `error`. Mixing the two is the fastest way to get someone to install a "disable-all" PR.

---

## 10. Final Allowlist (Maximum 3)

After auditing every legitimate use case in a multi-tenant white-label SaaS, three locations stand up. The user's prompt asked "shadcn official blocks, third-party-component, and maybe 1 more?" — the third slot goes to lint fixtures.

| Path                            | Justification                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/**`              | Vendored shadcn new-york blocks. They ship `bg-primary`/`text-primary-foreground` semantics aligned with v4 `@theme` and occasionally pin radius (`rounded-md`) or use `data-[state=open]:` arbitrary variants that our regex would false-positive on. The blocks are read-mostly; our own wrappers go at `src/components/ui-app/**` and are fully gated. |
| `src/components/third-party/**` | Upstream wrappers around Motion 12, Radix raw primitives, embed widgets (Stripe, Vimeo, etc.) that ship inline `style={{ width, height, transform }}` for measurement and animation. Those props are non-color, but the selector is conservative — we exempt the whole directory rather than risk shape divergence.                                       |
| `tests/lint/fixtures/**`        | Intentional violations live here so the regression suite has something to assert against. Not shipped.                                                                                                                                                                                                                                                    |

Anything else — marketing pages, Storybook, MDX, email templates, server actions — is fully gated. Animation transforms (`transform`, `translateX`) are not colors and are not captured by the selector in rule #1.

---

## 11. Research Deep-Dives (mapped to the user's lettered asks)

### A) `eslint-plugin-better-tailwindcss` for Tailwind v4 `@theme`

- **`no-unregistered-classes` exact config for v4 CSS-first `@theme`:** point `settings["better-tailwindcss"].entryPoint` at the CSS file containing `@import "tailwindcss"; @theme { … }` (`app/globals.css` in this project). The plugin reads `@theme` to materialise the registry of legal utility prefixes (`bg-primary`, `text-h2`, `rounded-card`, etc.) — no `tailwind.config.ts` required. This is the only v4-native plugin with that resolver; `eslint-plugin-tailwindcss` still uses the v3 config-file path. The recommended preset's `plugins: ["better-tailwindcss"]` array form is incompatible with flat config (see issue #148); enumerate the rules explicitly as in §3.
- **Whitelisting semantic colors while blocking raw palette / arbitrary values:** the dual mechanism is `no-unregistered-classes` (auto-allows everything declared in `@theme` and any custom-utility class detected from `@utility` blocks) + `no-restricted-classes` (regex blocklist for what is unfortunately _also_ a valid Tailwind class, namely the raw palette `bg-red-500` and arbitrary `bg-[#fff]`). They run in that order; `no-unregistered-classes` would otherwise let `bg-red-500` pass because it's a "real" Tailwind class.
- **Selectively blocking arbitrary values `[...]`:** use the `no-restricted-classes` `restrict` array with `pattern: '^(text|bg|…)-\\[.*\\]$'`. To allow `bg-[var(--…)]` (legitimate token escape hatch) while blocking `bg-[#fff]`, the spacing/font-size patterns in §3 use a negative lookahead `(?!.*(currentcolor|var\\())`. For colors we don't escape-hatch — anything missing should go into `@theme` first.
- **Compatibility with React Compiler 1.0:** RC 1.0 transforms React semantics (memoisation, hook ordering); it does not rewrite JSX attribute values or `className` strings, and it does not change the AST that ESLint sees (ESLint parses the source, not the compiled output). All ten rules above are AST-only and require no type information, so RC and these rules are fully orthogonal. Note: ESLint must still run _before_ RC in the build pipeline (which is the default in Next.js 16), otherwise generated artefacts get lint-scanned, which is wasted work but not incorrect.

### B) `no-restricted-syntax` AST selectors (verified against `astexplorer.net` with `@typescript-eslint/parser`)

- **`style={{ color/background/border… }}` in JSXAttribute:**
  `JSXAttribute[name.name='style'] ObjectExpression > Property[key.name=/^(color|background|backgroundColor|border|borderColor|fill|stroke|outlineColor|caretColor|textDecorationColor)$/] > Literal`
  Matches the literal value node directly so the report points at `'#fff'`, not the whole prop. (Identifier values like `style={{ color: brand }}` deliberately do not match.)
- **`fill=` / `stroke=` literal in JSX SVG element:**
  `JSXAttribute[name.name=/^(fill|stroke|stopColor|floodColor|lightingColor)$/] > Literal[value=/^(#|rgb|hsl|oklch|oklab|color\()/i]`
  Pairs with a sibling selector targeting `TemplateElement` so `<path fill={`#${hex}`}/>` is also caught.
- **`dangerouslySetInnerHTML` on any tag:**
  `JSXAttribute[name.name='dangerouslySetInnerHTML']`
  Bare selector — we don't care about the value shape because the prop itself is forbidden. Doubled with `react/no-danger` for `React.createElement` callsites.
- **Template literal `clsx`/`tw` with `[#` or `[oklch`:** handled by `better-tailwindcss/no-restricted-classes` with `callees: ['clsx','cn','cva','tv','twMerge']` and `tags: ['tw','css']`. The plugin's parser sees the string contents of tagged templates and call expressions correctly, including `cn('text-body', condition && 'text-[#fff]')`. A pure `no-restricted-syntax` regex on `TemplateElement` is fragile (mis-fires on `` `flex ${x ? '[#fff]' : ''}` ``) so we deliberately use the plugin instead.

### C) Fixture regression tests preventing the "D74 bug"

The D74 bug = a rule silently broken for six commits because tests asserted only the _fail_ fixture and the rule had been disabled. Cure in §4: every rule has both halves asserted, and `complete_task` of a new rule requires adding the matching `describe()` block — enforced by reviewing the diff for `describe.todo(` counts versus the table in §1. Programmatic ESLint use via `new ESLint({ overrideConfigFile, ignore: false })` is the documented Node.js API path; the `tests/lint/fixtures/**` glob is in the main config `ignores` so CI lint doesn't scream about deliberate violations, then the test runner flips `ignore: false`.

### D) CSS modules: stylelint vs `eslint-plugin-css-modules`

`eslint-plugin-css-modules` validates that `styles.foo` resolves to a class declared in the imported `.module.css` — it _does not_ read CSS values. It cannot enforce rule #5. Stylelint reads CSS and is the correct tool; `color-no-hex` + `declaration-property-value-disallowed-list` give zero-FP coverage. Keep both: `eslint-plugin-css-modules` for "class actually exists", stylelint for "class doesn't smuggle a hex color".

### E) CI grep job, threshold 0

§7 above. Threshold is non-negotiably zero because any positive threshold becomes the new floor — disables accumulate to exactly the limit, then PRs that introduce one legitimate disable get refused while the existing dead disables stay. Path-based allowlist only.

### F) Claude Code PreToolUse hook

§8 above. Reads `tool_input.{content,new_string,edits[].new_string}` from stdin, exits 2 to block, stderr shown to Claude so it self-corrects. Aware of two upstream Claude Code bugs (Write/Edit exit-2 reliability + Bash routing) — backed by the CI grep so the hook can fail open without losing enforcement.

### G) Five anti-patterns

§9 above (plus a bonus sixth on stylistic-vs-correctness rule severity).

### H) Final allowlist, max 3

§10 above. Three slots: shadcn vendored `components/ui/**`, third-party wrappers `src/components/third-party/**`, lint fixtures `tests/lint/fixtures/**`. No fourth slot.

---

## 12. Hour Estimate for Implementation

Assumes one senior engineer familiar with ESLint 9 flat config, Tailwind v4 `@theme`, and the existing codebase.

| Task                                                                                                                                 | Hours                                |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| Install + configure `eslint-plugin-better-tailwindcss` with v4 `entryPoint`; verify resolution of all 13 OKLCH palettes              | 2                                    |
| Author `eslint.config.ts` with all 10 rules; verify against existing codebase                                                        | 3                                    |
| Author 20 fixtures (pass + fail)                                                                                                     | 1.5                                  |
| Author `tests/lint/lint-runner.ts` + `token-bypass.test.ts` (1 full + 9 stubs); flesh out the 9 stubs                                | 2.5                                  |
| Stylelint config + smoke tests against `*.module.css`                                                                                | 1                                    |
| Husky pre-commit + lint-staged wiring                                                                                                | 0.5                                  |
| CI `grep-disables.sh` + `ci.yml` job                                                                                                 | 1                                    |
| `.claude/hooks/block-disables.sh` + `.claude/settings.json`                                                                          | 1                                    |
| Migration: fix every existing violation surfaced when rules are first turned on (long pole; expect ~80–200 sites in a mid-sized app) | 4–8                                  |
| Documentation: `docs/design.md#tokens` with the error-message → fix table                                                            | 1                                    |
| Buffer for cross-rule false positives (Tailwind v4 `data-[state=open]:` variants, Motion `style={{transform}}`, embed iframes)       | 2                                    |
| **Total**                                                                                                                            | **19.5 – 23.5 h (≈ 3 working days)** |

The migration line is the variable; in a greenfield Next 16 / shadcn project it collapses to ~1 h, in a year-old codebase plan for the upper bound. Once landed, the marginal cost of adding an 11th rule is ~30 minutes: append to `restrictedClasses`, add a fixture pair, add a `describe()`.

---

## Summary

The architecture is three concentric rings:

1. **Inner ring — ESLint flat config:** `no-restricted-syntax` for JSX-side bypasses (rules 1, 4, 7), `better-tailwindcss/no-restricted-classes` + `no-unregistered-classes` for Tailwind-class-shaped bypasses (rules 2, 3, 6, 8, 9, 10), stylelint for rule 5. Each rule has a paired pass/fail fixture, **both halves asserted** by Vitest using ESLint's programmatic API — this is the D74 regression guard.

2. **Middle ring — pre-commit + CI grep:** zero-threshold grep for `eslint-disable` / `stylelint-disable` / `biome-ignore` / `@ts-ignore` outside the three-path allowlist (`components/ui/**`, `src/components/third-party/**`, `tests/lint/fixtures/**`).

3. **Outer ring — Claude Code PreToolUse hook:** exit-2 blocks any Edit/Write whose new content contains a disable comment outside that same allowlist, with a stderr message pointing back to `@theme` tokens; backed by the CI grep so it can fail open.

The six common ways this kind of system silently breaks — warn-first creep, single-sided fixtures, single-rule trust on `dangerouslySetInnerHTML`, file-glob blind spots, undated disables, and stylistic-vs-correctness severity mixing — are addressed structurally: error-from-day-one, paired fixtures, doubled rules on the highest-risk pattern, broad `files` with surgical `ignores`, `require-description` plus path-only allowlist, and stylistic rules pinned at `warn`. Implementation runs roughly 20 engineering hours on a typical mid-sized Next 16 / Tailwind v4 / shadcn codebase, dominated by the one-time migration of existing violations.

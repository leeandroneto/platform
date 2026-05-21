// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'
import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import betterTailwind from 'eslint-plugin-better-tailwindcss' // ADR-0040 §B
import i18next from 'eslint-plugin-i18next'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import storybook from 'eslint-plugin-storybook'
import unusedImports from 'eslint-plugin-unused-imports'

// ════════════════════════════════════════════════════════════════════════════════
// Token bypass detection — auditado de onboarding-bio:eslint.config.mjs:16-73
// removidos comentários "Fase 29". Selectors são genéricos (sem branding).
// ════════════════════════════════════════════════════════════════════════════════
const tokenBypassPlugin = {
  rules: {
    'no-tailwind-bypass': {
      meta: {
        type: 'suggestion',
        messages: {
          textSize:
            "className 'text-{{size}}' bypasses design system — use <Text variant> or <Heading level>.",
          roundedSize:
            "className 'rounded-{{size}}' bypasses design system — use var(--shape-*) token.",
          uppercase: "className 'uppercase' bypasses design system — use <Eyebrow> or <Badge>.",
          hexArbitrary: "className '[#...]' hardcodes hex color — use var(--*) CSS token.",
          rgbArbitrary: "className '[rgb(...)]' hardcodes color — use var(--*) CSS token.",
        },
        schema: [],
      },
      create(context) {
        const TEXT_SIZE = /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/
        const ROUNDED_SIZE = /\brounded-(sm|md|lg|xl|2xl|3xl)\b/
        const UPPERCASE = /\buppercase\b/
        const HEX_ARBITRARY = /\[#[0-9a-fA-F]{3,8}\]/
        const RGB_ARBITRARY = /\[rgba?\(/

        function check(node) {
          if (typeof node.value !== 'string') return
          const v = node.value
          const textMatch = TEXT_SIZE.exec(v)
          if (textMatch)
            context.report({ node, messageId: 'textSize', data: { size: textMatch[1] } })
          const roundedMatch = ROUNDED_SIZE.exec(v)
          if (roundedMatch)
            context.report({ node, messageId: 'roundedSize', data: { size: roundedMatch[1] } })
          if (UPPERCASE.test(v)) context.report({ node, messageId: 'uppercase' })
          if (HEX_ARBITRARY.test(v)) context.report({ node, messageId: 'hexArbitrary' })
          if (RGB_ARBITRARY.test(v)) context.report({ node, messageId: 'rgbArbitrary' })
        }

        return {
          "JSXAttribute[name.name='className'] > Literal": check,
        }
      },
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// Vocab banido — 16 termos (ADR-0019, .claude/rules/naming.md)
// ════════════════════════════════════════════════════════════════════════════════
const BANNED_VOCAB = [
  'student',
  'trainer',
  'intake',
  'wizard',
  'prospect',
  'diagnostic',
  'diagnostico',
  'customization',
  'workspace',
  'reflexao',
  'pilares',
  'proximo_passo',
  'aluno',
]
const BANNED_VOCAB_REGEX = new RegExp(`\\b(${BANNED_VOCAB.join('|')})\\b`, 'i')

const vocabBanPlugin = {
  rules: {
    'no-banned-vocab': {
      meta: {
        type: 'problem',
        messages: {
          banned: "Banned vocab '{{term}}'. See .claude/rules/naming.md for canonical substitute.",
        },
        schema: [],
      },
      create(context) {
        function check(node, value) {
          const match = BANNED_VOCAB_REGEX.exec(value)
          if (match) context.report({ node, messageId: 'banned', data: { term: match[1] } })
        }
        return {
          Identifier(node) {
            check(node, node.name)
          },
          Literal(node) {
            if (typeof node.value === 'string') check(node, node.value)
          },
          Property(node) {
            if (node.key.type === 'Identifier') check(node, node.key.name)
          },
        }
      },
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// Plan gates required — vertical slice (ADR-0034)
// features/<name>/index.ts deve re-exportar plan-gates pra garantir gate declarativo
// ════════════════════════════════════════════════════════════════════════════════
const planGatesPlugin = {
  rules: {
    'plan-gates-required': {
      meta: {
        type: 'problem',
        messages: {
          missing:
            "features/<name>/index.ts deve re-exportar de './plan-gates' (ADR-0034 §5). Sem plan-gates = feature sem gate declarativo = lint error.",
        },
        schema: [],
      },
      create(context) {
        // Aplica só em features/<name>/index.ts
        const filename = context.filename ?? context.getFilename?.()
        if (!filename) return {}
        const normalized = filename.replace(/\\/g, '/')
        const match = /\/features\/([^/]+)\/index\.ts$/.exec(normalized)
        if (!match) return {}
        // Ignora a pasta _template (é referência, não feature ativa) — opcional.
        // Aqui mantemos enforce também em _template pra servir de exemplo correto.

        let hasGateReexport = false

        function check(node) {
          if (!node.source) return
          const src = node.source.value
          if (typeof src !== 'string') return
          if (src === './plan-gates' || src.endsWith('/plan-gates')) {
            hasGateReexport = true
          }
        }

        return {
          ExportNamedDeclaration: check,
          ExportAllDeclaration: check,
          'Program:exit'(node) {
            if (!hasGateReexport) {
              context.report({ node, messageId: 'missing' })
            }
          },
        }
      },
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// Brand hardcoded — multi-marca via env (ADR-0021/0022)
// Bloqueia 'desafit'/'yoga'/'ingles' literais fora do allowlist
// ════════════════════════════════════════════════════════════════════════════════
const brandHardcodePlugin = {
  rules: {
    'no-brand-hardcode': {
      meta: {
        type: 'problem',
        messages: {
          hardcoded:
            "Brand '{{brand}}' hardcoded. Use env.NEXT_PUBLIC_BRAND_NAME or NEXT_PUBLIC_BRAND_DOMAIN.",
        },
        schema: [],
      },
      create(context) {
        const BRANDS = /\b(desafit|yoga\.app|ingles\.app)\b/
        return {
          Literal(node) {
            if (typeof node.value !== 'string') return
            const match = BRANDS.exec(node.value)
            if (match) context.report({ node, messageId: 'hardcoded', data: { brand: match[1] } })
          },
        }
      },
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// CSS var em JSX style (blueprint 13 regra 17 — ADR-0040 §J)
// Bloqueia style={{ color: 'var(--accent)' }} — use className token shadcn.
// ════════════════════════════════════════════════════════════════════════════════
const cssVarInStylePlugin = {
  rules: {
    'no-css-var-in-style': {
      meta: {
        type: 'problem',
        messages: {
          inline:
            'CSS var em style={{ ... }} — use className com token semantic shadcn (bg-primary, text-foreground, etc).',
        },
        schema: [],
      },
      create(context) {
        return {
          "JSXAttribute[name.name='style'] Property > Literal"(node) {
            if (typeof node.value !== 'string') return
            if (/var\(--/.test(node.value)) {
              context.report({ node, messageId: 'inline' })
            }
          },
        }
      },
    },
  },
}

// ════════════════════════════════════════════════════════════════════════════════
// 'use client' guard em server-only files (blueprint 13 regra 24 — ADR-0040 §J)
// Bloqueia 'use client' em lib/data/**, lib/api/**, app/**/actions.ts
// ════════════════════════════════════════════════════════════════════════════════
const serverOnlyGuardPlugin = {
  rules: {
    'no-use-client-in-server': {
      meta: {
        type: 'problem',
        messages: {
          forbidden:
            "'use client' em arquivo server-only ({{path}}) — remova diretiva. RSC default. Data/API são server-only.",
        },
        schema: [],
      },
      create(context) {
        const filename = context.filename ?? context.getFilename?.()
        if (!filename) return {}
        const normalized = filename.replace(/\\/g, '/')
        const isServerOnly =
          /\/lib\/data\//.test(normalized) ||
          /\/lib\/api\//.test(normalized) ||
          /\/app\/.*\/actions\.ts$/.test(normalized)
        if (!isServerOnly) return {}
        return {
          ExpressionStatement(node) {
            if (
              node.directive === 'use client' ||
              (node.expression?.type === 'Literal' && node.expression.value === 'use client')
            ) {
              context.report({
                node,
                messageId: 'forbidden',
                data: { path: normalized.split('/').slice(-3).join('/') },
              })
            }
          },
        }
      },
    },
  },
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ─── i18next plugin flat recommended (ADR-0040 §J) ────────────────────────
  // Bloqueia hardcoded strings em JSX. Override `components/ui/**` desliga.
  i18next.configs['flat/recommended'],
  // ─── eslint-plugin-better-tailwindcss (ADR-0040 §B + blueprint 02 §5) ──────
  // Único plugin v4-native. Preset 'recommended' + customização cirúrgica:
  //  - enforce-consistent-class-order DESLIGADO (conflita com prettier-plugin-tailwindcss
  //    issue tailwindlabs/prettier-plugin-tailwindcss#278). Prettier sorta no save.
  //  - enforce-consistent-line-wrapping + no-unnecessary-whitespace + variant-order
  //    DESLIGADOS (prettier cobre layout/whitespace; RTL é JIT).
  //  - no-unknown-classes: WARN dia 0 com detectComponentClasses:true.
  //    Promove pra ERROR quando globals.css cobrir 100% tokens (gatilho JIT
  //    em .claude/rules/design-tokens.md "Condição de revisitar").
  //  - Correctness (conflicts, duplicates, restricted, shorthand, deprecated,
  //    important-position, variable-syntax, canonical) MANTÉM error — esse é
  //    o valor real do plugin sobre design-tokens/no-tailwind-bypass custom.
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/globals.css',
      },
    },
    rules: {
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-restricted-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'error',
      'better-tailwindcss/enforce-consistent-important-position': 'error',
      'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/no-unknown-classes': ['warn', { detectComponentClasses: true }],
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unnecessary-whitespace': 'off',
      'better-tailwindcss/enforce-consistent-variant-order': 'off',
      'better-tailwindcss/enforce-logical-properties': 'off',
    },
  },
  // ─── Linter options globais (ADR-0036) ────────────────────────────────────
  // reportUnusedDisableDirectives:error — disable orfao = erro CI
  // noInlineConfig — bloqueia /* eslint */ comments mudarem regras inline
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      noInlineConfig: true,
    },
  },
  // ─── eslint-comments plugin (ADR-0036) ────────────────────────────────────
  // no-use:error — proibe TODO disable comment (ADR-0012 allowlist agora retirada)
  // require-description:error — defesa adicional caso no-use seja override-ed
  // no-unused-disable:error — orfaos (defesa em profundidade vs linterOptions)
  {
    plugins: {
      '@eslint-community/eslint-comments': eslintComments,
    },
    rules: {
      '@eslint-community/eslint-comments/no-use': 'error',
      '@eslint-community/eslint-comments/require-description': 'error',
      '@eslint-community/eslint-comments/no-unused-disable': 'error',
    },
  },
  // ─── Ignore generated / vendored ──────────────────────────────────────────
  // messages/**/*.json sao i18n strings (ADR-0040 §G) — ESLint nao aplica regras
  // TS/JSX a JSON puro, manter limpo via JSON Schema apenas.
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'docs/_archive/**',
      'public/**',
      'messages/**/*.json',
      'storybook-static/**', // ADR-0038 build artifact
    ],
  },
  // ─── jsx-a11y strict (WCAG 2.2 AA — ADR-0031 §1) ──────────────────────────
  // Plugin vem do nextVitals[0] (que ja scopa por files). Meu bloco precisa
  // de `files:` filter pra que ESLint 9 herde o plugin — global rules sem
  // files filter falham com "could not find plugin".
  // Auditado de onboarding-bio:eslint.config.mjs:84-123.
  {
    files: ['**/*.{ts,tsx,jsx,js,mjs,cjs}'],
    rules: {
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: false }],
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/autocomplete-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['Input', 'Textarea', 'Select'],
          depth: 3,
        },
      ],
      'jsx-a11y/media-has-caption': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-noninteractive-tabindex': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'jsx-a11y/anchor-is-valid': 'off', // next/link handles
    },
  },
  // ─── Strict unused vars + sizes ───────────────────────────────────────────
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      complexity: ['error', 12],
      'max-params': ['error', 4],
    },
  },
  // ─── i18n hardcoded — 14 padrões (D-G66) ─────────────────────────────────
  {
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: false,
          ignoreProps: true,
          noAttributeStrings: false,
          allowedStrings: [
            // Technical / non-translatable
            '·',
            '—',
            '–',
            '+',
            '−',
            '↗',
            '→',
            '←',
            '↑',
            '↓',
            '%',
            '/',
            '×',
            '•',
            '|',
            ':',
            ',',
            '.',
            '›',
            '▸',
            '?',
            '-',
            '(',
            ')',
            '[',
            ']',
            '✓',
            '◷',
            '©',
            '@',
            '★',
            '★★',
            '★★★',
            '★★★★',
            '★★★★★',
            // Units (non-translatable)
            'kg',
            'cm',
            'g',
            'min',
            'kcal',
            'kg ·',
            '% ·',
            'kcal ·',
            // Currency
            'R$',
            '-R$',
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='aria-label'] > Literal",
          message: 'aria-label hardcoded — use t() from next-intl.',
        },
        {
          selector: "JSXAttribute[name.name='placeholder'] > Literal",
          message: 'placeholder hardcoded — use t() from next-intl.',
        },
        {
          selector: "JSXAttribute[name.name='title'] > Literal",
          message: 'title hardcoded — use t() from next-intl.',
        },
        {
          selector: "JSXAttribute[name.name='alt'] > Literal[value!='']",
          message: 'alt hardcoded — use t() from next-intl.',
        },
        {
          selector:
            "CallExpression[callee.object.name='toast'][callee.property.name=/^(success|error|info|warning)$/] > Literal",
          message: 'Toast message hardcoded — use t() from next-intl.',
        },
        {
          selector: "NewExpression[callee.name='Error'] > Literal",
          message: 'Error message hardcoded — use AppError factory + t().',
        },
        {
          selector: "CallExpression[callee.name='fail'] > Literal",
          message: 'fail() message hardcoded — use AppError factory.',
        },
        {
          selector: "CallExpression[callee.property.name='message'] > Literal",
          message: 'Zod .message() hardcoded — use t() from next-intl.',
        },
        // ─── ADR-0040 §J — 4 selectors faltantes (14/14 padrões blueprint 13) ───
        {
          selector:
            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name='metadata'] Property[key.name=/^(title|description)$/] > Literal",
          message:
            'metadata title/description hardcoded — use getTranslations(\"seo\") em generateMetadata.',
        },
        {
          selector:
            'JSXElement[openingElement.name.name=/^(Text|Heading|Paragraph)$/] > Literal[value=/^[A-ZÀ-Ý][a-zà-ÿ ]{2,}/]',
          message:
            'react-email <Text>/<Heading> com literal — use t() ou import de messages/email.',
        },
        {
          selector:
            "Property[key.name='body'][value.type='Literal'][value.value=/^[A-ZÀ-Ý][a-zà-ÿ ]{2,}/]",
          message: 'push.body hardcoded — use messages/push.<event>.body via t() em Edge Function.',
        },
        {
          selector:
            "Property[key.type='Identifier'][value.type='Literal'][value.value=/^[A-ZÀ-Ý][a-zà-ÿ ]{4,}/][parent.parent.type='VariableDeclarator'][parent.parent.id.name=/^(ERROR_MAP|ERRORS|MESSAGES)$/i]",
          message: 'Error map literal — chave deve apontar pra t() ou AppError factory.',
        },
      ],
    },
  },
  // ─── Import sort + unused imports ─────────────────────────────────────────
  // Auditado de onboarding-bio:eslint.config.mjs:196-220.
  {
    plugins: { 'simple-import-sort': simpleImportSort, 'unused-imports': unusedImports },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:', '^react$', '^react-dom', '^next'],
            ['^@?\\w'],
            ['^@/lib'],
            ['^@/components'],
            ['^@/'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  // ─── Import bans ──────────────────────────────────────────────────────────
  // Auditado de onboarding-bio:eslint.config.mjs:229-247.
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'framer-motion', message: "Use 'motion/react' instead." },
            { name: 'next/router', message: "Use 'next/navigation' (App Router)." },
            { name: 'next/document', message: 'Use app/layout.tsx (App Router).' },
            { name: 'next/head', message: 'Use Metadata API (App Router).' },
            {
              name: '@supabase/supabase-js',
              importNames: ['createClient'],
              message: 'Use @/lib/supabase/{client,server} instead of raw createClient.',
            },
          ],
          patterns: [{ group: ['framer-motion/*'], message: "Use 'motion/react'." }],
        },
      ],
    },
  },
  // ─── Architectural boundary: lib/ must not import from app/ ───────────────
  {
    files: ['lib/**/*.ts', 'lib/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'framer-motion', message: "Use 'motion/react'." },
            {
              name: '@supabase/supabase-js',
              importNames: ['createClient'],
              message: 'Use @/lib/supabase/{client,server}.',
            },
          ],
          patterns: [
            { group: ['@/app/*'], message: 'lib/ must not import from app/.' },
            {
              group: ['@/lib/supabase/admin'],
              message: 'Admin client forbidden in lib/ (server actions only).',
            },
          ],
        },
      ],
    },
  },
  // ─── Admin client BYPASS RLS: forbidden em client components + hooks ─────
  // Server Actions (app/**/actions.ts) e Edge Functions OK importar.
  {
    files: ['components/**/*.{ts,tsx}', 'hooks/**/*.ts', 'lib/hooks/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/supabase/admin'],
              message:
                'Admin client (BYPASS RLS) forbidden em client/hooks. Use @/lib/supabase/{client,server} ou Server Action.',
            },
          ],
        },
      ],
    },
  },
  // ─── Custom plugins: token bypass + vocab + brand + plan-gates + css-var-in-style + server-only-guard ────────────
  {
    plugins: {
      'design-tokens': tokenBypassPlugin,
      vocab: vocabBanPlugin,
      brand: brandHardcodePlugin,
      'plan-gates': planGatesPlugin,
      'css-var-in-style': cssVarInStylePlugin,
      'server-only-guard': serverOnlyGuardPlugin,
    },
    rules: {
      'design-tokens/no-tailwind-bypass': 'error',
      'vocab/no-banned-vocab': 'error',
      'brand/no-brand-hardcode': 'error',
      'css-var-in-style/no-css-var-in-style': 'error',
      'server-only-guard/no-use-client-in-server': 'error',
    },
  },
  // ─── ADR-0034 §6 — plan-gates obrigatório em features/<name>/index.ts ─────
  {
    files: ['features/*/index.ts'],
    rules: {
      'plan-gates/plan-gates-required': 'error',
    },
  },
  // ─── Test files relaxed ───────────────────────────────────────────────────
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'tests/**/*'],
    rules: {
      'no-restricted-imports': 'off',
      'react/jsx-no-literals': 'off',
      'i18next/no-literal-string': 'off',
      'vocab/no-banned-vocab': 'off',
      'brand/no-brand-hardcode': 'off',
      'max-lines-per-function': 'off',
    },
  },
  // ─── Stories relaxed (ADR-0040 §E + ADR-0038 §config) ───────────────────
  // Stories são showcase visual — hardcoded swatches OKLCH, rounded-*, text-* sao
  // didaticos por design (mostrar o token, nao usar o wrapper que esconde). Toast
  // i18n keys mockadas pra demo. Vocab banido tambem off (Button "Storybook" etc).
  {
    files: ['**/*.stories.{ts,tsx,mjs}', '**/__stories__/**/*.{ts,tsx}'],
    rules: {
      'react/jsx-no-literals': 'off',
      'i18next/no-literal-string': 'off',
      'design-tokens/no-tailwind-bypass': 'off',
      'no-restricted-syntax': 'off',
      'vocab/no-banned-vocab': 'off',
    },
  },
  // ─── i18n message files relaxed ───────────────────────────────────────────
  {
    files: ['messages/**/*.json'],
    rules: { 'react/jsx-no-literals': 'off' },
  },
  // ─── ADR-0044 — components/** deletado pós-pivot TweakCN (surgical delete).
  // Override mantido pra reinstalação JIT via `npx shadcn add` (zona quarentenada
  // ADR-0040 §A). Sem alvo no working tree atual, mas ESLint ignora overrides com
  // `files` que não casa nenhum arquivo — non-issue.
  {
    files: [
      'components/ui/**/*.{ts,tsx}',
      // Blocks shadcn no root de components/ (mesma vendor surface)
      'components/{app-sidebar,nav-*,section-cards,site-header,chart-area-interactive,search-form,team-switcher,login-form,version-switcher,data-table}.tsx',
    ],
    rules: {
      // OFF — estilo (shadcn primitives violam por design)
      'react/jsx-no-literals': 'off',
      'react/display-name': 'off',
      'react/no-unknown-property': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-restricted-syntax': 'off',
      'design-tokens/no-tailwind-bypass': 'off',
      'css-var-in-style/no-css-var-in-style': 'off',
      'i18next/no-literal-string': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
      'react-hooks/set-state-in-effect': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/no-autofocus': 'off',
      // OFF — simple-import-sort (ADR-0040 §A — vendor mantem order original shadcn)
      'simple-import-sort/imports': 'off',
      'simple-import-sort/exports': 'off',
      // OFF — better-tailwindcss (ADR-0040 §B — vendor surface; prettier + design-tokens cobrem)
      'better-tailwindcss/no-conflicting-classes': 'off',
      'better-tailwindcss/no-duplicate-classes': 'off',
      'better-tailwindcss/no-restricted-classes': 'off',
      'better-tailwindcss/no-deprecated-classes': 'off',
      'better-tailwindcss/enforce-shorthand-classes': 'off',
      'better-tailwindcss/enforce-consistent-important-position': 'off',
      'better-tailwindcss/enforce-consistent-variable-syntax': 'off',
      'better-tailwindcss/enforce-canonical-classes': 'off',
      'better-tailwindcss/no-unknown-classes': 'off',
      // ON — bugs reais (mantém mesmo em vendor)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  // ─── ADR-0031 §2 — scripts/** (CLI one-shot, sem limites de aplicação) ────
  {
    files: ['scripts/**/*.{ts,tsx,mjs,js}'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
      'vocab/no-banned-vocab': 'off',
      'brand/no-brand-hardcode': 'off',
      'i18next/no-literal-string': 'off',
      'react/jsx-no-literals': 'off',
    },
  },
  // ─── ADR-0031 §3 — eslint.config.mjs (arquivo lista os vocab banidos) ─────
  {
    files: ['eslint.config.mjs'],
    rules: {
      'vocab/no-banned-vocab': 'off',
      'brand/no-brand-hardcode': 'off',
      'max-lines': 'off',
    },
  },
  // ─── ADR-0031 §4 — lib/supabase/admin.ts (wrapper canônico) ───────────────
  {
    files: ['lib/supabase/admin.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  // ─── ADR-0031 §5 — lib/route/getRouteByHost.ts (lookup pré-RLS no edge) ───
  {
    files: ['lib/route/getRouteByHost.ts'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // ─── ADR-0031 §6 removido — Ladle saiu, substituído por Storybook (ADR-0038).
  // Override era pra `.ladle/config.mjs export default {}`. Storybook usa
  // `defineMain`/`Preview` types — não precisa override de regra.
  // ─── ADR-0031 §7 — hooks/use-mobile.ts (SSR-safe pattern shadcn) ────────
  // Dep block shadcn sidebar. Pattern useState(undefined)+useEffect+matchMedia
  // é oficial shadcn — aceitável "external store sync".
  {
    files: ['hooks/use-mobile.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // ─── ADR-0031 §8 — lib/contracts/database.ts (gerado por supabase CLI) ────
  {
    files: ['lib/contracts/database.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  // ─── ADR-0031 §9 — lib/design/seeds/** (long data files, JSON-like) ───────
  {
    files: ['lib/design/seeds/**/*.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  // ─── ADR-0031 §10 — boot-time throws antes de i18n estar disponível ───────
  // env validation + React context misuse — t() não está acessível aqui.
  // ─── grep-disables.sh contract (ADR-0012) ─────────────────────────────────
  {
    files: ['lib/env.ts', 'lib/route/RouteProvider.tsx'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
])

export default eslintConfig

import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'
import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
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

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

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
    ],
  },

  // ─── jsx-a11y strict (WCAG 2.2 AA) ────────────────────────────────────────
  // Plugin já registrado por eslint-config-next/core-web-vitals — não re-registrar.
  // Auditado de onboarding-bio:eslint.config.mjs:84-123.
  {
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

  // ─── Custom plugins: token bypass + vocab + brand + plan-gates ────────────
  {
    plugins: {
      'design-tokens': tokenBypassPlugin,
      vocab: vocabBanPlugin,
      brand: brandHardcodePlugin,
      'plan-gates': planGatesPlugin,
    },
    rules: {
      'design-tokens/no-tailwind-bypass': 'error',
      'vocab/no-banned-vocab': 'error',
      'brand/no-brand-hardcode': 'error',
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
      'vocab/no-banned-vocab': 'off',
      'brand/no-brand-hardcode': 'off',
      'max-lines-per-function': 'off',
    },
  },

  // ─── i18n message files relaxed ───────────────────────────────────────────
  {
    files: ['messages/**/*.json'],
    rules: { 'react/jsx-no-literals': 'off' },
  },

  // ─── ADR-0031 §1 — components/ui/** + components/<blocks> (shadcn vendor) ─
  // ADR-0008: shadcn 100% canon. Vendor pattern usa literais EN, hex inexistente
  // via @theme, jsx-a11y patterns vendor-specific, throw Error pra context misuse.
  {
    files: [
      'components/ui/**/*.{ts,tsx}',
      // Blocks shadcn no root de components/ (mesma vendor surface)
      'components/{app-sidebar,nav-*,section-cards,site-header,chart-area-interactive,search-form,team-switcher,login-form,version-switcher,data-table}.tsx',
    ],
    rules: {
      'react/jsx-no-literals': 'off',
      'design-tokens/no-tailwind-bypass': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
      'react-hooks/set-state-in-effect': 'off',
      'no-restricted-syntax': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/anchor-has-content': 'off',
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

  // ─── ADR-0031 §6 — .ladle/config.mjs (export default {} é a API Ladle) ────
  {
    files: ['.ladle/**/*.{mjs,js,ts,tsx}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },

  // ─── ADR-0031 §7 — hooks/use-mobile.ts (SSR-safe pattern oficial shadcn) ──
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
  {
    files: ['lib/env.ts', 'lib/route/RouteProvider.tsx'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  // ─── grep-disables.sh contract (ADR-0012) ─────────────────────────────────
])

export default eslintConfig

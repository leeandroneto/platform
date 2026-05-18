// knip.config.ts — Dead code / unused exports detection.
// CI falha se exports/deps órfãs aparecem.
//
// Princípio §39: muitos arquivos foram pre-positioned no boilerplate (shadcn
// primitives, seeds, helpers Supabase, Result helpers) pra serem consumidos
// Sprint 2-6. Marcamos como `entry` (knip walkear deps deles) ou `ignore`
// (pure pre-positioned helpers sem consumer ainda) sem flag-ar como unused.
// Revisitar Sprint 5+ quando feature surface estabilizar.

import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  $schema: 'https://unpkg.com/knip@5/schema.json',

  entry: [
    // Husky shell hooks chamam binárias node_modules via pnpm exec
    '.husky/pre-commit',
    '.husky/pre-push',
    // Scripts CLI (não detectado por plugin)
    'scripts/**/*.ts',
    // Tests (vitest + playwright + smoke)
    'tests/**/*.{ts,tsx}',
    // Pre-positioned dia 0 (consumed Sprint 2-6 — §39 JIT)
    'components/ui/**/*.tsx',
    'lib/supabase/{client,server,admin}.ts',
    'lib/route/getRouteByHost.ts',
    'lib/design/seeds/**/*.ts',
    // lib/entitlements/server.ts e client.ts são entry points arquiteturais
    // (ADR-0034 §4). Definem API canônica pra TODAS features futuras chamarem.
    // Diferente de componentes UX (deferidos JIT pelo mesmo ADR) — API server-side
    // é universal, não varia por feature. Mantido pre-positioned intencionalmente.
    'lib/entitlements/{server,client}.ts',
    // Result<T, AppError> helpers + RouteProvider hooks — entry points API canônicos
    // (ADR layers.md + ADR-0024). Sprint 1+ consumers crescem rápido. Pre-positioned.
    'lib/contracts/result.ts',
    'lib/route/RouteProvider.tsx',
    'lib/env.ts',
    'lib/route/types.ts',
  ],

  project: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'features/**/*.{ts,tsx}',
    'lib/**/*.ts',
    'lib/**/*.tsx',
    'hooks/**/*.{ts,tsx}',
  ],

  ignore: [
    // Generated por supabase CLI
    'lib/contracts/database.ts',
    // Pre-positioned (§39 JIT — sem consumer ainda, Sprint 2+)
    'lib/contracts/money.ts',
    // Block shadcn aguardando consumer Sprint 5+
    'components/version-switcher.tsx',
    // features/_template — scaffold reference (ADR-0034). NÃO é feature ativa.
    // Existe pra ser copiado quando adicionar feature real. Knip flagaria como
    // unused files (sem consumer em app/) — mas é proposital.
    'features/_template/**',
  ],

  // Helpers/types pre-positioned (§39 JIT — primeiro consumer Sprint 2+).
  // Removidos quando primeira call site existir.
  ignoreExportsUsedInFile: {
    function: true,
    type: true,
    interface: true,
  },

  ignoreDependencies: [
    // Runtime deps consumidas Sprint 2-6 (§39 JIT consumer) — não detectadas
    // por knip porque ainda não há import site em código fora vendor shadcn.
    '@ai-sdk/anthropic', // Sprint 4 — Edge Function generate-assessment
    '@base-ui/react', // shadcn primitives backup
    '@dnd-kit/core',
    '@dnd-kit/modifiers',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities', // Sprint 5+ drag-drop
    '@hookform/resolvers', // Sprint 3 form captação
    '@sentry/nextjs', // Sprint 1 post-deploy
    '@serwist/next',
    '@serwist/turbopack', // Sprint 14 PWA
    '@tanstack/react-table', // Sprint 7 dashboard
    'ai', // Sprint 4 Edge Function
    'date-fns', // Sprint 3+ formatters
    'idb-keyval', // Sprint 14 PWA offline
    'motion', // Sprint 2 motion presets
    'next-intl', // Sprint 3 i18n setup
    'posthog-js', // Sprint 11 feature flags
    'react-email', // Sprint 4 templates
    'react-hook-form', // Sprint 3 form
    'resend', // Sprint 4 transactional email
    'shadcn', // CLI tooling
    'tw-animate-css', // imported via globals.css (knip miss)
    // Tooling — transitivos / config-only
    'eslint-config-prettier',
    'eslint-plugin-jsx-a11y', // transitivo via eslint-config-next
    // Dev tooling
    '@softarc/eslint-plugin-sheriff',
    '@softarc/sheriff-core',
    'blurhash',
    'eslint-plugin-i18next',
    'lint-staged', // chamado via .husky/pre-commit (`pnpm exec lint-staged`) — knip não trace pnpm exec
    'prettier-plugin-tailwindcss',
    'tailwindcss', // imported via globals.css
  ],
}

export default config

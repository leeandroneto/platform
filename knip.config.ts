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
    // shadcn primitives — zona quarentenada (ADR-0040 §A). Voltam como entry pra
    // Knip walkear deps internas (cmdk, radix, vaul, etc) e não flagar como órfãs.
    // Customização vai em components/app-*.tsx (3 wrappers dia 0 + JIT).
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
    // ActionResult alias canônico Server Action (Etapa 3) — consumer em todo actions.ts futuro.
    'lib/contracts/action.ts',
    // Palettes public API (Etapa 3) — consumer: /api/{tenants,brands}/[id]/theme.css route + admin UI futura.
    'lib/design/palettes.ts',
    // APCA Silver helpers (Etapa 6) — consumer: validate-palettes script + theme.css route + tenant theme save action JIT.
    'lib/design/contrast.ts',
    // 3 wrappers compostos obrigatorios dia 0 (Etapa 7 / ADR-0040 §E) — consumers: features JIT.
    'components/app-form.tsx',
    'components/app-toast.tsx',
    'components/app-entitlement-gate.tsx',
    // 3 typography primitives dia 0 (Etapa 8 / ADR-0040 §F) — consumers: toda feature com texto.
    'components/ui/heading.tsx',
    'components/ui/text.tsx',
    'components/ui/muted.tsx',
    // <Logo> wordmark dia 0 (Etapa 9 / constitucional 00-PROJETO §9) — consumer: header/footer/splash JIT.
    'components/ui/logo.tsx',
    // Service Worker Serwist (Etapa 10A / ADR-0014) — carregado por @serwist/next em build, knip nao detecta.
    'app/sw.ts',
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
    // Stub que lança AppError.internal('JIT') — sem consumer real até admin UI trocar paleta live.
    'lib/design/tokens.ts',
    // Block shadcn vendor — sem consumer ainda mas mantido (zona quarentenada ADR-0040 §A).
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
    '@dnd-kit/core',
    '@dnd-kit/modifiers',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities', // Sprint 5+ drag-drop
    '@sentry/nextjs', // Sprint 1 post-deploy
    '@vercel/og', // Etapa 10A — usado via re-export `next/og` em icon routes
    '@tanstack/react-table', // Sprint 7 dashboard
    'ai', // Sprint 4 Edge Function
    'idb-keyval', // Sprint 14 PWA offline
    'posthog-js', // Sprint 11 feature flags
    'react-email', // Sprint 4 templates
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
    'lint-staged', // chamado via .husky/pre-commit (`pnpm exec lint-staged`) — knip não trace pnpm exec
    'prettier-plugin-tailwindcss',
  ],
}

export default config

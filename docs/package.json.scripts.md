# package.json — scripts a adicionar

Adicionar dentro de `"scripts": { ... }` no `package.json` gerado pelo `create-next-app`:

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "size": "size-limit",
    "knip": "knip",

    "vocab:audit": "bash scripts/vocab-audit.sh",
    "i18n:audit": "bash scripts/i18n-audit.sh",
    "token:audit": "bash scripts/token-audit.sh",
    "audit:disables": "bash scripts/grep-disables.sh",

    "adr:index": "tsx scripts/adr-index.ts",
    "validate:palettes": "tsx scripts/validate-palettes.ts",

    "ladle:serve": "ladle serve",
    "ladle:build": "ladle build",

    "prepare": "husky"
  }
}
```

## Hooks Husky (`.husky/`)

`.husky/pre-commit`:

```bash
pnpm lint --max-warnings 0 --no-inline-config
pnpm typecheck
```

`.husky/commit-msg`:

```bash
pnpm commitlint --edit "$1"
```

`.husky/pre-push`:

```bash
pnpm test
```

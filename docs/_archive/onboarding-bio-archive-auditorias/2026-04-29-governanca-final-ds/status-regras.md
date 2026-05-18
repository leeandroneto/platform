# Estado atual do bloco no-restricted-syntax

## Localização

`eslint.config.mjs`, linhas 146-194.

## Configuração atual (PRE-promoção)

```javascript
// ─── Design system enforcement ─────────────────────────────────────
// All selectors in a SINGLE no-restricted-syntax block to avoid
// flat config override bug (later block replaces earlier for same rule).
//
// Severity: "warn" while headings + colors still have pending migrations
// (Phases 20-21). Phase 23 promotes this entire block to "error".
//
// Button exceptions: inline eslint-disable-next-line with named reason
// (Phase 22 — no more file-level ignores).
{
  files: ["app/**/*.tsx", "components/**/*.tsx"],
  ignores: [
    "components/ui/**",
    "components/motion/**",
  ],
  rules: {
    "no-restricted-syntax": ["warn",   // ← SERÁ PROMOVIDO A "error"
      // 6 selectors: button, motion.button, h1-h6, hex, rgb, hsl
    ],
  },
}
```

## Scope de arquivos

- **Incluídos:** `app/**/*.tsx`, `components/**/*.tsx`
- **Excluídos:** `components/ui/**`, `components/motion/**`

## Exceptions inline (eslint-disable-next-line)

6 exceptions documentadas com razão técnica (Fase 22), todas para `<button>` ou `<motion.button>` em contextos onde shadcn `<Button>` não se aplica.

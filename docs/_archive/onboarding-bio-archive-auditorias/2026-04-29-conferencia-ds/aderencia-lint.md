# Lint final

Executado em 2026-04-29.

```
> onboarding-bio@0.1.0 lint C:\Users\leean\Desktop\onboarding-bio
> eslint

C:\Users\leean\Desktop\onboarding-bio\.ladle\config.mjs
  2:1  warning  Assign object to a variable before exporting as module default  import/no-anonymous-default-export

1 problem (0 errors, 1 warning)
```

## Analise

- **0 erros** — todas as regras `no-restricted-syntax` (headings, inline colors, raw buttons) estao em `error` e zeradas.
- **1 warning** — `.ladle/config.mjs` (`import/no-anonymous-default-export`). Pre-existente, nao relacionado ao DS. Ladle exige `export default {}` sem named variable. Nao bloqueia.

## Veredicto: PASSA

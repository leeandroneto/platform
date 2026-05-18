# Wave 01 — Husky + lint-staged

## Instalado

- `husky@9.1.7` — git hooks manager
- `lint-staged@16.4.0` — roda linters apenas nos arquivos staged

## Configuracao

### `.husky/pre-commit`

```bash
pnpm exec lint-staged
```

### `.husky/pre-push`

```bash
pnpm exec vitest run
```

### `.lintstagedrc.mjs`

```js
const config = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['eslint --max-warnings=0'],
  '*.{ts,tsx}': () => 'tsc --noEmit',
}
export default config
```

### `package.json`

- Script `prepare: "husky"` adicionado automaticamente pelo `husky init`

## Testes realizados

| Teste                                | Resultado                 |
| ------------------------------------ | ------------------------- |
| Commit arquivo com `any` (erro lint) | BLOQUEADO pelo pre-commit |
| Commit arquivos limpos               | PASSOU normalmente        |

## Status: CONCLUIDO

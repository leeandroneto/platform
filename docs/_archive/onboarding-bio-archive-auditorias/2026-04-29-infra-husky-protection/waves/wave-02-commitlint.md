# Wave 02 — commitlint

## Instalado

- `@commitlint/cli@20.5.2`
- `@commitlint/config-conventional@20.5.0`

## Configuracao

### `commitlint.config.ts`

```ts
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'refactor',
        'test',
        'perf',
        'ci',
        'style',
        'revert',
        'build',
      ],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
}
export default config
```

### `.husky/commit-msg`

```bash
pnpm exec commitlint --edit "$1"
```

## Testes realizados

| Teste                                            | Resultado                              |
| ------------------------------------------------ | -------------------------------------- |
| Commit com mensagem `"ajuste random"`            | BLOQUEADO — subject-empty + type-empty |
| Commit com mensagem `"chore: add commitlint..."` | PASSOU normalmente                     |

## Status: CONCLUIDO

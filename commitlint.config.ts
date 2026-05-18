// commitlint.config.ts — Conventional Commits.
// Husky commit-msg hook valida toda mensagem.

import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // nova feature user-facing
        'fix', // bug fix
        'refactor', // refator sem mudança user-facing
        'perf', // melhoria de performance
        'docs', // docs only
        'test', // testes
        'build', // build system / deps
        'ci', // CI/CD config
        'chore', // tarefa repo (release, version bump, etc)
        'revert', // revert de commit anterior
        'style', // formatação (sem mudança de código)
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
}

export default config

# 0036. Hooks PreToolUse JSON output + ESLint comments plugin

Date: 2026-05-18
Status: accepted

## Context

Commit `7818df1` (revertido em `4be49e3`) expôs gap sistêmico: Claude Code criou
5 componentes UX violando ADR-0008 (hierarquia shadcn), ADR-0012 (zero disable
comments) e D-G66 (i18n hardcoded). Pesquisa `docs/research/17-guardrails-ia-shadcn-governanca.md`
confirmou duas causas-raiz:

1. **CLAUDE.md e ADRs em prosa são "pedidos", não garantias.** Hooks `PreToolUse`
   com JSON output `permissionDecision:"deny"` são a única trava determinística.
2. **Bug `anthropics/claude-code#13744`:** `exit 2` em PreToolUse não bloqueia
   confiavelmente Write/Edit em Windows. JSON output em stdout + `exit 0`
   é obrigatório.

Caso público idêntico documentado por Alex Brohshtut (Medium 22-jan-2026):
Sonnet adicionando disable comments + Opus editando `eslint.config.mjs` direto.
Mesma anatomia do nosso incidente.

ADR-0012 instituiu defesa multi-camada (custom rules + Sheriff + CI grep) com
allowlist de 2 disable comments. Audit hoje: zero disables no código. Allowlist
nunca foi usada — vira fonte de atrito + vetor de bypass.

## Decision

### A. Hook protocol: JSON stdout + exit 0

Todo PreToolUse hook usa formato canônico flat:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "..."
  }
}
```

Emitido em stdout, exit 0. `exit 2` é proibido (bug `#13744`).

### B. 4 hooks PreToolUse `.claude/hooks/`

1. **`block-disables.sh`** (matcher `Write|Edit`) — hex/rgba literal em `.ts/.tsx`
   fora allowlist `globals.css|icon.tsx|apple-icon.tsx|opengraph-image.tsx|blurhash`
2. **`protect-eslint.sh`** (matcher `Write|Edit`) — bloqueia Write/Edit em
   `eslint.config.{mjs,cjs,js,ts}`. Mudar regra ESLint exige ADR superseding
   0012/0036
3. **`block-disable-content.sh`** (matcher `Write|Edit`) — bloqueia conteúdo com
   `es`+`lint-disable` (com allowlist ADR-0012), `noInlineConfig`,
   `reportUnusedDisableDirectives`. Skippa `eslint.config.*` (já gate pelo #2)
4. **`component-research-gate.sh`** (matcher `Write`) — bloqueia Write em
   `components/**`, `features/*/components/**`, `lib/**/components/**` sem marker
   `// RESEARCH: <fonte>` nos primeiros 300 chars. Hierarquia em ADR-0008/0037
   (próximo)

### C. ESLint comments plugin

`@eslint-community/eslint-plugin-eslint-comments@4.x` registrado em
`eslint.config.mjs`:

```js
{
  linterOptions: {
    reportUnusedDisableDirectives: 'error',
    noInlineConfig: true,
  },
},
{
  plugins: { '@eslint-community/eslint-comments': eslintComments },
  rules: {
    '@eslint-community/eslint-comments/no-use': 'error',
    '@eslint-community/eslint-comments/require-description': 'error',
    '@eslint-community/eslint-comments/no-unused-disable': 'error',
  },
}
```

`no-use:error` proíbe TODO disable comment. Allowlist de ADR-0012 (2 padrões)
fica retirada — toda nova exceção exige ADR superseding.

### D. Princípio §39 mantido (defer JIT)

Hooks NÃO criam componentes UX. Hierarquia + MCP (Fase 2) tornam pesquisa
trivial, mas componentes UX continuam deferidos até dor real chegar.

## Consequences

**Positivo:**

- Travamento determinístico via JSON output (bug `#13744` resolvido)
- 4 vetores de bypass do incidente `7818df1` cobertos: editar config, adicionar
  disable, criar componente UX sem pesquisa, hex literal
- Plugin `eslint-comments` adiciona AST-level enforcement (defesa em
  profundidade vs hooks shell)
- `noInlineConfig:true` impede `/* eslint */` inline mudar regras
- `reportUnusedDisableDirectives:error` previne disables órfãos (caso allowlist
  reabra via ADR futuro)

**Negativo:**

- Bootstrap edit em `eslint.config.mjs` exige unregister temporário de
  `protect-eslint.sh` em `.claude/settings.json` (documentado neste ADR)
- 4 hooks bash em Windows: depende Git Bash. CI Linux roda direto
- Allowlist ADR-0012 vira letra morta — código histórico já zerado, mantida
  apenas como documentação de princípio

**Neutro:**

- Hooks shell parseam JSON via `grep -oE` (frágil mas suficiente). Migrar pra
  Node helper se complexidade subir
- Padrão "RESEARCH marker" será refinado em ADR-0037 (wrapper pattern +
  hierarquia registries granular)
- ADR-0012 mantida `accepted` (princípios sobrevivem); allowlist obsoleta mas
  ainda referenciada por hook `block-disable-content.sh` enquanto não houver
  migration breaking

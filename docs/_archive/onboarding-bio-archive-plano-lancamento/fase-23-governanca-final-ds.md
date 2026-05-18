# Fase 23 — Design System: governança final (todas regras como error)

## Metadata

| Campo                | Valor                                           |
| -------------------- | ----------------------------------------------- |
| **Número**           | 23                                              |
| **Estado**           | ✅ Concluída                                    |
| **Camadas cobertas** | 3, 11 (CI/CD)                                   |
| **Depende de**       | 20 (headings), 21 (inline colors), 22 (buttons) |
| **Bloqueia**         | 24                                              |
| **Tamanho**          | XS (< 4h)                                       |
| **Branch**           | `fase-23-governanca-final-ds`                   |

---

## Por que esta fase, por que agora

Após Fases 20-22 zerarem as ocorrências, esta fase **promove definitivamente** todas as regras de design system pra `error`. É o ponto de não retorno: daqui pra frente, qualquer regressão quebra o build no PR, não vira warning ignorado.

Sem esta fase, o trabalho das anteriores erode em semanas — alguém adiciona `<h1 className="...">` num componente novo, lint dá warning, ninguém vê, dívida volta a crescer.

---

## Loop interno

### Passo 1 — Auditoria

````bash
SLUG="governanca-final-ds"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

cat > README.md <<EOF
# Auditoria: governança final do design system

**Data:** ${DATA}
**Fase:** 23

## Objetivo
Confirmar que TODAS as regras de design system estão como \`error\` e que ZERO violações persistem.

## Regras a verificar
1. \`no-raw-button\` (Fase 22)
2. \`no-direct-heading\` (Fase 20)
3. \`no-inline-style-color\` (Fase 21)
4. \`no-restricted-imports\` (framer-motion, next/router)
5. \`react/jsx-no-literals\` (Fase 8 — i18n)
6. \`jsx-a11y/*\` strict (Fase 9)
EOF

# Status atual de cada regra
echo "# Status atual das regras" > status-regras.md
echo "" >> status-regras.md

for regra in "no-raw-button" "no-direct-heading" "no-inline-style-color" "no-restricted-imports" "jsx-no-literals" "jsx-a11y"; do
  echo "## $regra" >> status-regras.md
  echo '```' >> status-regras.md
  grep -A 3 "$regra" ../../../eslint.config.* 2>/dev/null | head -20 >> status-regras.md
  echo '```' >> status-regras.md
  echo "" >> status-regras.md
done

# Contagem de violações
echo "# Violações restantes (esperado: 0)" > contagem-violacoes.md
echo '```' >> contagem-violacoes.md
echo "no-raw-button:           $(pnpm lint 2>&1 | grep -c "no-raw-button")"
echo "no-direct-heading:       $(pnpm lint 2>&1 | grep -c "no-direct-heading")"
echo "no-inline-style-color:   $(pnpm lint 2>&1 | grep -c "no-inline-style-color")"
echo "jsx-no-literals:         $(pnpm lint 2>&1 | grep -c "jsx-no-literals")"
echo "jsx-a11y:                $(pnpm lint 2>&1 | grep -c "jsx-a11y")"
echo '```' >> contagem-violacoes.md
````

### Passo 2 — Plano de execução

Wave única:

```markdown
# Wave 01 — Promover regras

## Briefing

Confirmar zero violações em cada regra (deve estar zerado pelas Fases 20, 21, 22).
Se zerado, atualizar `eslint.config.*` promovendo cada regra de `warn` pra `error`.
Se não zerado, voltar pra fase correspondente, não promover.

## Critério de aceite

1. Cada regra do README está como `error` no eslint.config
2. `pnpm lint` retorna 0 erros, 0 warnings
3. Build passa
4. Testes passam

## Anti-padrões

- "Vou promover mesmo com warnings sobrando" — não. Zera primeiro.
- "Vou desligar regra que tem caso difícil" — não. Resolve ou volta pra fase.
```

### Passo 3 — Execução

```typescript
// eslint.config.mjs após esta fase
// NOTA (D74): button, heading e color selectors estão num ÚNICO bloco
// no-restricted-syntax (bug de override corrigido em 2026-04-29).
// Esta fase promove o bloco inteiro de "warn" pra "error".
{
  rules: {
    'no-restricted-syntax': ['error',
      // button, heading, hex, rgb, hsl — todos como error
      { selector: "JSXOpeningElement[name.name='button']", ... },
      { selector: "JSXOpeningElement[name.name=/^h[1-6]$/]", ... },
      { selector: "JSXAttribute[name.name='style'] Literal[value=/^#.../]", ... },
      { selector: "JSXAttribute[name.name='style'] Literal[value=/^rgb/]", ... },
      { selector: "JSXAttribute[name.name='style'] Literal[value=/^hsl/]", ... },
    ],
    'react/jsx-no-literals': ['error', { /* allowlist existente */ }],
    // jsx-a11y/* já como error pela Fase 9
    // no-restricted-imports (framer-motion, next/router) já como error
  }
}
```

### Passo 4 — Conferência

```bash
# Verificar config
for regra in "no-raw-button" "no-direct-heading" "no-inline-style-color"; do
  if grep -A 1 "$regra" eslint.config.* | grep -q "error"; then
    echo "$regra: ✅ error"
  else
    echo "$regra: ❌ NÃO está como error"
  fi
done

# Lint final
pnpm lint  # 0 erros, 0 warnings

# Build
pnpm build  # passa

# Tests
pnpm exec vitest run  # tudo verde
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

**Concluída em 2026-04-29.**

- Bloco `no-restricted-syntax` promovido de `warn` para `error` no `eslint.config.mjs`
- 0 erros lint, 0 erros TypeScript, 371/371 testes, build passa
- 4 testes de regressão confirmaram que violações agora travam como `error`
- 6 exceptions inline (Fase 22) continuam funcionando corretamente
- Auditoria completa em `docs/auditorias/2026-04-29-governanca-final-ds/`
- Decisão D80 registrada: ponto de não retorno do design system

### Deploy

- CI (GitHub Actions): `check` job passa; `deploy-production` falhava por env vars vazias
- Fix D81: `lib/env.ts` — `emptyAsUndefined` trata `""` como `undefined` para Zod
- Fix D82: Vercel bloqueia auto-deploy de commits com author não-membro do time (Claude Agent). Workaround: commit do owner após commits do agent
- Deploy production verificado em https://onboarding.bio após fix

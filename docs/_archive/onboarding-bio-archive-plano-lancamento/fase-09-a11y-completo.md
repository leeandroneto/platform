# Fase 9 — Lint a11y completo + auditoria autoFocus

## Metadata

| Campo                | Valor                      |
| -------------------- | -------------------------- |
| **Número**           | 9                          |
| **Estado**           | 🔵 Próxima                 |
| **Camadas cobertas** | 1, 9 (Acessibilidade)      |
| **Depende de**       | 5, 6, 7                    |
| **Bloqueia**         | 24, 76 (audit a11y manual) |
| **Tamanho**          | S (4-12h)                  |
| **Branch**           | `fase-09-a11y-completo`    |

---

## Por que esta fase, por que agora

A11y de lint pega ~30% dos problemas de a11y. É baixa fruta — vale 100% colher. Sem essa base, audit manual com NVDA/VoiceOver (Fase 76) vai pegar coisas óbvias que lint deveria ter pegado, gastando tempo de auditor caro.

Status atual: regras `jsx-a11y` strict configuradas como `error` (✅), mas 12 `autoFocus` ficaram como `warn` sem decisão final. Cada um precisa ser decidido: legítimo (vira `// eslint-disable-next-line` com justificativa) ou ilegítimo (remove).

---

## Loop interno

### Passo 1 — Auditoria

````bash
SLUG="a11y-completo"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

# README
cat > README.md <<EOF
# Auditoria: a11y completo

**Data:** ${DATA}
**Fase:** 9

## Estado inicial conhecido
- jsx-a11y strict como error: 0 erros restantes ✅
- 12 autoFocus warnings pendentes — decidir caso a caso

## Categorias auditadas
1. autoFocus warnings (decisão caso a caso)
2. Outras regras a11y como warn (devem virar error)
3. Imagens decorativas vs conteúdo (alt apropriado)
4. Botões/links sem texto acessível
5. Forms sem label associado adequadamente
EOF

# 1. autoFocus
echo "# Violações: autoFocus" > violacoes-01-autofocus.md
echo '```' >> violacoes-01-autofocus.md
grep -rn "autoFocus" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules" >> violacoes-01-autofocus.md
echo '```' >> violacoes-01-autofocus.md
echo "" >> violacoes-01-autofocus.md
echo "## Decisão por arquivo" >> violacoes-01-autofocus.md
echo "" >> violacoes-01-autofocus.md
echo "Para cada ocorrência:" >> violacoes-01-autofocus.md
echo "- **Legítimo:** search/dialog/cmdk onde foco automático é UX esperado → adicionar \`// eslint-disable-next-line jsx-a11y/no-autofocus -- {motivo}\`" >> violacoes-01-autofocus.md
echo "- **Ilegítimo:** form genérico onde autofocus prejudica leitor de tela → remover" >> violacoes-01-autofocus.md

# 2. Outras regras a11y como warn
echo "# Violações: regras a11y como warn em vez de error" > violacoes-02-a11y-warn.md
echo '```' >> violacoes-02-a11y-warn.md
pnpm lint 2>&1 | grep "jsx-a11y" >> violacoes-02-a11y-warn.md
echo '```' >> violacoes-02-a11y-warn.md
echo "" >> violacoes-02-a11y-warn.md
echo "Verificar config — todas as 30+ regras jsx-a11y devem estar como error." >> violacoes-02-a11y-warn.md

# 3. Imagens com alt vazio ou faltando
echo "# Violações: imagens sem alt apropriado" > violacoes-03-images-alt.md
echo '```' >> violacoes-03-images-alt.md
# alt="" vazio sem ser decorativa explicitamente
grep -rn '<img\|<Image' ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|alt=" >> violacoes-03-images-alt.md
echo '```' >> violacoes-03-images-alt.md

# 4. Botões/links sem texto
echo "# Violações: botões/links sem texto acessível" > violacoes-04-buttons-sem-texto.md
echo "Auditoria via lint:" >> violacoes-04-buttons-sem-texto.md
echo '```' >> violacoes-04-buttons-sem-texto.md
pnpm lint 2>&1 | grep "no-button-without-text\|anchor-has-content" >> violacoes-04-buttons-sem-texto.md
echo '```' >> violacoes-04-buttons-sem-texto.md

# 5. Forms sem label
echo "# Violações: forms sem label associado" > violacoes-05-forms-label.md
echo '```' >> violacoes-05-forms-label.md
pnpm lint 2>&1 | grep "label-has-associated-control" >> violacoes-05-forms-label.md
echo '```' >> violacoes-05-forms-label.md
````

### Passo 2 — Plano de execução

5 waves. autoFocus é a wave mais delicada (decisão caso a caso).

**Wave 01 (autoFocus) — modelo:**

Para cada uma das 12 ocorrências, decidir:

| Arquivo         | Contexto                            | Decisão                                                                                              |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| {arquivo:linha} | {ex: search bar do command palette} | Legítimo — `// eslint-disable-next-line jsx-a11y/no-autofocus -- foco automático esperado em search` |
| {arquivo:linha} | {ex: form de signup}                | Ilegítimo — remover (autofocus em form prejudica leitor de tela)                                     |

Decisões registradas em `decisions.md` da auditoria.

**Anti-padrões específicos:**

- "Vou silenciar todas com `// eslint-disable` sem justificativa" → não. Cada uma precisa de razão.
- "Vou desligar a regra global" → não. Allowlist por ocorrência, regra fica como `error`.

### Passo 3 — Execução

Waves paralelas (categorias independentes).

### Passo 4 — Conferência

```bash
# Zero warnings de jsx-a11y
pnpm lint 2>&1 | grep "jsx-a11y" | grep "warn" | wc -l  # = 0

# Todas as regras jsx-a11y como error (verificar config)
grep "jsx-a11y" eslint.config.* | grep "warn"  # = vazio (nenhuma como warn)

# Cada autoFocus tem comentário justificando
grep -rn "autoFocus" app/ components/ | while read line; do
  # Verificar se a linha anterior é eslint-disable com comentário
  echo "$line"
done

# Globais
pnpm lint  # 0 erros, 0 warnings
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

(Preenchido após conclusão.)

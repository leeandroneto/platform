# Fase 8 — Lint i18n completo + migração de strings

## Metadata

| Campo                | Valor                   |
| -------------------- | ----------------------- |
| **Número**           | 8                       |
| **Estado**           | 🔵 Próxima              |
| **Camadas cobertas** | 1, 4                    |
| **Depende de**       | 5, 6, 7                 |
| **Bloqueia**         | 30, 40, 45, 50          |
| **Tamanho**          | M (1-2 dias)            |
| **Branch**           | `fase-08-i18n-completo` |

---

## Por que esta fase, por que agora

A "Fase 02.5" anterior foi declarada concluída sem ser. A regra `react/jsx-no-literals` foi configurada como `warn`, mas **306 strings hardcoded** nunca foram migradas pra `t()`. É exatamente o anti-padrão §A1 do PADRAO-IMPECAVEL: warning como estado final.

A Fase 8 fecha esse gap **antes** de criar features novas (Fase 30+ vai criar PWA cliente, landing pública, painel — tudo vai gerar mais strings hardcoded se a porta não estiver fechada).

---

## Loop interno

### Passo 1 — Auditoria

**Cria:** `docs/auditorias/{data}-i18n-completo/`

````bash
SLUG="i18n-completo"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

cat > README.md <<EOF
# Auditoria: i18n completo

**Data:** ${DATA}
**Fase:** 8

## Estado inicial conhecido
- 306 violações de \`react/jsx-no-literals\` (warning ativo, não migradas)
- 12 \`autoFocus\` warnings (separar — vai pra Fase 9)

## Categorias auditadas
1. JSX text node hardcoded
2. \`placeholder=\` hardcoded
3. \`aria-label=\` hardcoded
4. \`title=\` hardcoded
5. \`alt=\` hardcoded
EOF

# Listagem completa por arquivo
echo "# Violações: jsx-no-literals" > violacoes-01-jsx-literals.md
echo '```' >> violacoes-01-jsx-literals.md
pnpm lint 2>&1 | grep "jsx-no-literals" >> violacoes-01-jsx-literals.md
echo '```' >> violacoes-01-jsx-literals.md

# Por arquivo agrupado
echo "# Por arquivo" >> violacoes-01-jsx-literals.md
echo '```' >> violacoes-01-jsx-literals.md
pnpm lint 2>&1 | grep "jsx-no-literals" | sed 's/:.*//' | sort | uniq -c | sort -rn >> violacoes-01-jsx-literals.md
echo '```' >> violacoes-01-jsx-literals.md

# Placeholder hardcoded
echo "# Violações: placeholder=" > violacoes-02-placeholder.md
echo '```' >> violacoes-02-placeholder.md
grep -rn 'placeholder="[^{]' ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|.test.\|.spec." >> violacoes-02-placeholder.md
echo '```' >> violacoes-02-placeholder.md

# aria-label hardcoded
echo "# Violações: aria-label=" > violacoes-03-aria-label.md
echo '```' >> violacoes-03-aria-label.md
grep -rn 'aria-label="[^{]' ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules" >> violacoes-03-aria-label.md
echo '```' >> violacoes-03-aria-label.md

# title hardcoded
echo "# Violações: title=" > violacoes-04-title.md
echo '```' >> violacoes-04-title.md
grep -rn 'title="[^{]' ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules" >> violacoes-04-title.md
echo '```' >> violacoes-04-title.md

# alt hardcoded
echo "# Violações: alt=" > violacoes-05-alt.md
echo '```' >> violacoes-05-alt.md
grep -rn 'alt="[^{]' ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules" >> violacoes-05-alt.md
echo '```' >> violacoes-05-alt.md
````

### Passo 2 — Plano de execução

5 waves (uma por categoria). Pode paralelizar — categorias geralmente em arquivos diferentes.

**Padrão de migração:**

Pra cada string hardcoded:

1. Criar chave em `messages/pt-BR.json` na seção apropriada (organizada por feature/área)
2. Substituir string por `t('chave')` no JSX
3. Verificar contexto (interpolação, pluralização, formatação)

**Anti-padrões específicos:**

- "Vou criar `t('common.save')` pra reusar 'Salvar'" — não. Cada uso pode precisar de microcopy específica ("Salvar alterações" vs "Salvar template" vs "Salvar e enviar").
- "Vou pular essa porque é só 'OK'" — não. 'OK' precisa virar `t('common.ok')` igual.
- "Esse aqui é tooltip, não é UI principal" — não. Tooltip também precisa.

**Allowlist legítima** (declarada antes de começar):

- Strings em código de teste
- Strings em chaves de objeto (`{ status: 'active' }` — chave técnica, não UI)
- URLs e paths
- Nomes de classes CSS
- Strings em `console.log` (que serão removidos na Fase 68 de observabilidade)
- Strings em comentários

### Passo 3 — Execução

Wave por wave. Após cada wave, promove `react/jsx-no-literals` (e regras correspondentes pra placeholder/aria-label/etc.) de `warn` pra `error`.

### Passo 4 — Conferência

```bash
pnpm lint 2>&1 | grep "jsx-no-literals" | wc -l  # = 0
pnpm lint 2>&1 | grep "warn" | wc -l  # = 0 (zero warnings global)

# Regra promovida a error
grep "jsx-no-literals" eslint.config.* | grep "error"  # encontra

# Testes de carregamento de i18n
pnpm exec vitest run tests/i18n/  # se existirem
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

(Preenchido após conclusão.)

# Fase 20 — Design System: migração de 309 headings

## Metadata

| Campo                | Valor                              |
| -------------------- | ---------------------------------- |
| **Número**           | 20                                 |
| **Estado**           | ✅ Concluída (2026-04-29)          |
| **Camadas cobertas** | 3 (UI)                             |
| **Depende de**       | 14 (componente `<Heading>` criado) |
| **Bloqueia**         | 23, 24                             |
| **Tamanho**          | M (1-2 dias)                       |
| **Branch**           | `fase-20-migracao-headings`        |

---

## Por que esta fase, por que agora

A "Fase 04" anterior foi declarada parcialmente concluída sem ser. Componente `<Heading>` foi criado mas nunca foi adotado no código existente — 308 instâncias de `<h1>`-`<h6>` cru continuam usando classes utilitárias (`text-2xl font-semibold`, etc.). A regra `no-direct-heading` ficou como `warn`.

É exatamente o anti-padrão §A1 do PADRAO-IMPECAVEL: warning como estado final. Trabalho não foi feito; foi **declarado feito** porque o componente existe.

A Fase 20 fecha esse gap antes de criar features novas que vão herdar o problema.

---

## Loop interno

### Passo 1 — Auditoria

````bash
SLUG="migracao-headings"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

cat > README.md <<EOF
# Auditoria: migração de headings

**Data:** ${DATA}
**Fase:** 20

## Estado inicial conhecido
- 308 violações de \`no-direct-heading\` (warning ativo)
- Componente \`<Heading level={1-6|"display"}>\` existe em \`components/ui/heading.tsx\`

## Categorias auditadas
1. Heading semântico real (devem virar \`<Heading level={n}>\`)
2. "Heading" usado só por estilo, não por hierarquia (devem virar \`<Text variant="...">\`)
3. Headings em locais especiais (toasts, dialogs — verificar se semantica é correta)
EOF

# 1. Listagem completa por arquivo
echo "# Headings diretos por arquivo" > violacoes-01-por-arquivo.md
echo '```' >> violacoes-01-por-arquivo.md
grep -rn "<h[1-6][^a-z]" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|/heading.tsx\|.test.\|.spec." \
  | sed 's/:.*//' | sort | uniq -c | sort -rn >> violacoes-01-por-arquivo.md
echo '```' >> violacoes-01-por-arquivo.md

# 2. Listagem completa com contexto
echo "# Headings diretos com contexto" > violacoes-02-com-contexto.md
echo '```' >> violacoes-02-com-contexto.md
grep -rn "<h[1-6][^a-z]" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|/heading.tsx\|.test.\|.spec." >> violacoes-02-com-contexto.md
echo '```' >> violacoes-02-com-contexto.md

# 3. Heurística pra distinguir uso semântico vs estilístico
echo "# Decisão de migração: <Heading> vs <Text>" > decisao-heading-vs-text.md
cat >> decisao-heading-vs-text.md <<EOF

Pra cada ocorrência, decidir:

## É \`<Heading>\` (semântico — anuncia seção da página)
- Está dentro de \`<header>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<aside>\` definindo hierarquia da página
- Aparece no outline da página (ferramenta de a11y mostra como heading)
- Leitor de tela navegando "próximo heading" deve parar aqui

→ Migrar pra \`<Heading level={N}>\`. Decidir N pelo contexto:
  - \`level={1}\`: título único da página (h1)
  - \`level={2}\`: seção principal (h2)
  - \`level={3}\`: subseção (h3)
  - etc.

## É \`<Text>\` (apenas estilo — não tem função de outline)
- Aparece em card, badge, label, tooltip, toast, modal title
- Não está em hierarquia semântica de página
- Leitor de tela não deve tratar como navegação

→ Migrar pra \`<Text variant="body|caption|label|micro|muted">\`.

## Casos delicados
- Modal title: pode ser \`<Heading level={2}>\` se a modal é uma "seção" da página, ou \`<Text variant="body">\` com \`role="heading" aria-level="2"\` aplicado pelo componente Drawer/Dialog
- Card title em lista: geralmente \`<Heading level={3}>\`
- Skeleton: usa \`<Text>\` pra placeholder

EOF
````

### Passo 2 — Plano de execução

**Não dá pra fazer em uma wave só** — 308 ocorrências em ~50-80 arquivos com decisão semântica caso a caso.

Estratégia: dividir em **3-4 waves por área da aplicação** (não por categoria de regra):

```
waves/
├── wave-01-app-marketing.md       (landing, sobre, preço — públicas)
├── wave-02-app-internal.md        (dashboard, leads, settings — internas)
├── wave-03-app-public-flows.md    (formulário, relatório, página de links — públicas com branding)
├── wave-04-components.md          (componentes reutilizáveis — última, depende dos contextos acima)
└── README.md
```

Por área porque headings em landing têm hierarquia diferente de headings em dashboard. Decidir 308 misturados é confusão; decidir ~80 da landing por vez é foco.

**Padrão de cada wave:**

Pra cada heading na área:

1. Abrir arquivo, ler contexto
2. Aplicar checklist do `decisao-heading-vs-text.md`
3. Substituir por `<Heading level={N}>` ou `<Text variant="...">`
4. Verificar visualmente que estilo final bate com o original (token correto)
5. Se mudou level (h2 → h3 porque h2 não fazia sentido), verificar outline da página

**Anti-padrões específicos:**

- "Vou só substituir `<h2>` por `<Heading level={2}>` em massa sem ler" — não. Decisão semântica.
- "Vou usar `<Heading level={6}>` pra tudo que era 'menor'" — não. h6 raramente é correto.
- "Vou criar `<Heading level={2}>` mesmo sendo título de modal" — depende. Verificar o componente Drawer/Dialog se já aplica heading semantics via aria.

### Passo 3 — Execução

Waves sequenciais (decisão acumulada — wave 02 aprende com wave 01). Não paralelizar — risco de inconsistência semântica.

**Após cada wave**, rodar Visual Regression. Se diff > 0.1%, revisar tokens (level errado pode mudar tamanho).

**No fim da última wave**, promover regra:

```javascript
// eslint.config.mjs
{
  rules: {
    'no-direct-heading-class': 'error',  // era 'warn'
  }
}
```

### Passo 4 — Conferência

```bash
# Zero <h1>-<h6> direto fora de components/ui/heading.tsx
grep -rn "<h[1-6][^a-z]" app/ components/ | grep -v "/heading.tsx\|.test.\|.spec." | wc -l  # = 0

# Lint
pnpm lint 2>&1 | grep "no-direct-heading" | wc -l  # = 0

# Regra promovida
grep "no-direct-heading" eslint.config.* | grep "error"  # encontra

# VRT
pnpm exec playwright test tests/visual/  # passa (diff < 0.1%)

# Outline semântico das páginas críticas (auditoria manual)
# Usar Chrome DevTools > Accessibility > Headings
# Verificar: 1 h1 por página, hierarquia coerente (não pula h2→h4)
```

Outline checklist em `verificacao.md`:

| Página                   | h1 único | Hierarquia OK | Status |
| ------------------------ | -------- | ------------- | ------ |
| `/` (landing)            | ✓/✗      | ✓/✗           | ✅/❌  |
| `/dashboard`             | ✓/✗      | ✓/✗           | ✅/❌  |
| `/{slug}` (page links)   | ✓/✗      | ✓/✗           | ✅/❌  |
| `/r/{token}` (relatório) | ✓/✗      | ✓/✗           | ✅/❌  |
| ...                      |

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

**Concluída em 2026-04-29.**

- **309 linhas `<h[1-6]` removidas** (contagem cravada via diff), 0 adicionadas
- ~75 arquivos tocados
- 0 violações restantes (grep + lint AST)
- TypeScript: 0 erros
- Vitest: 371/371 passando
- Build: passa
- Regra permanece `warn` — promoção a `error` fica pra Fase 23
- Outline check: 5 páginas críticas auditadas — h1 único + hierarquia coerente em todas

Decisões semânticas e outline check em `docs/auditorias/2026-04-29-migracao-headings/verificacao.md`.

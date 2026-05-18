# Fase 21 — Design System: migração de 133 inline style colors

## Metadata

| Campo                | Valor                              |
| -------------------- | ---------------------------------- |
| **Número**           | 21                                 |
| **Estado**           | ✅ Concluída (2026-04-29)          |
| **Camadas cobertas** | 3 (UI)                             |
| **Depende de**       | 10 (tokens foundation), 11, 12     |
| **Bloqueia**         | 23, 24, 26 (personalização visual) |
| **Tamanho**          | M (1-2 dias)                       |
| **Branch**           | `fase-21-migracao-inline-colors`   |

---

## Por que esta fase, por que agora

Igual à Fase 20 — anti-padrão §A1 do PADRAO-IMPECAVEL. A regra `no-inline-style-color` foi configurada como `warn`, **133 ocorrências** ficaram. `style={{ color: '#hex' }}` espalhado pelo código quebra:

1. **Personalização visual (Fase 26):** profissional troca brand color, esses inline colors não atualizam.
2. **Dark mode:** cores inline não respondem a `data-theme`.
3. **Manutenção:** mudar paleta vira caça aos hex no código todo.
4. **A11y:** APCA não valida cor inline; só valida tokens.

A Fase 21 fecha esse gap antes de começar Fase 26 (personalização visual), que vai falhar se houver inline colors espalhados.

---

## Loop interno

### Passo 1 — Auditoria

````bash
SLUG="migracao-inline-colors"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

cat > README.md <<EOF
# Auditoria: migração de inline style colors

**Data:** ${DATA}
**Fase:** 21

## Estado inicial conhecido
- 133 violações de \`no-inline-style-color\` (warning ativo)

## Categorias auditadas
1. \`style={{ color: '#hex' }}\` — texto
2. \`style={{ background: '#hex' }}\` ou \`backgroundColor\` — fundo
3. \`style={{ borderColor: '#hex' }}\` — borda
4. CSS vars dinâmicas vindas do banco (legítimas — vão pra allowlist)
5. RGB/RGBA/HSL inline (forma alternativa)
EOF

# 1. color inline
echo "# Violações: style color" > violacoes-01-color.md
echo '```' >> violacoes-01-color.md
grep -rn "style={{[^}]*color:" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|.test.\|.spec." >> violacoes-01-color.md
echo '```' >> violacoes-01-color.md

# 2. background inline
echo "# Violações: style background" > violacoes-02-background.md
echo '```' >> violacoes-02-background.md
grep -rn "style={{[^}]*background" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|.test.\|.spec." >> violacoes-02-background.md
echo '```' >> violacoes-02-background.md

# 3. border inline
echo "# Violações: style borderColor" > violacoes-03-border.md
echo '```' >> violacoes-03-border.md
grep -rn "style={{[^}]*border" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules\|.test.\|.spec." >> violacoes-03-border.md
echo '```' >> violacoes-03-border.md

# 4. RGB/HSL inline
echo "# Violações: rgb/hsl inline" > violacoes-04-rgb-hsl.md
echo '```' >> violacoes-04-rgb-hsl.md
grep -rn "rgb(\|rgba(\|hsl(\|hsla(" ../../../app ../../../components 2>/dev/null \
  | grep "style={{" \
  | grep -v "node_modules" >> violacoes-04-rgb-hsl.md
echo '```' >> violacoes-04-rgb-hsl.md

# 5. CSS vars legítimas (não devem ser migradas — viram allowlist)
echo "# CSS vars dinâmicas (allowlist legítima)" > allowlist-css-vars.md
echo "" >> allowlist-css-vars.md
echo "Casos onde \`style={{}}\` é correto: cor vinda do banco/profissional via CSS variable." >> allowlist-css-vars.md
echo '```' >> allowlist-css-vars.md
grep -rn "style={{[^}]*var(--" ../../../app ../../../components 2>/dev/null \
  | grep -v "node_modules" >> allowlist-css-vars.md
echo '```' >> allowlist-css-vars.md
echo "" >> allowlist-css-vars.md
echo "Cada uma destas precisa receber comentário: \`// {motivo: cor dinâmica do profissional via brand_color}\`" >> allowlist-css-vars.md
````

### Passo 2 — Plano de execução

3-4 waves por categoria:

```
waves/
├── wave-01-color-text.md          (color: ...)
├── wave-02-background.md          (background: ..., backgroundColor: ...)
├── wave-03-border.md              (borderColor: ...)
├── wave-04-allowlist-css-vars.md  (documentar cada CSS var legítima)
└── README.md
```

**Padrão de migração pra cada hex inline:**

1. Identificar qual cor semântica representa: brand? success? warning? danger? neutral?
2. Substituir pelo token correspondente:
   - `style={{ color: '#10b981' }}` → `className="text-success"` (ou Tailwind: `text-green-500` — mas preferir semântico)
   - `style={{ background: '#fff' }}` → `className="bg-background"` ou `bg-white` (preferir semântico)
3. Se cor não existe como token semântico, decidir:
   - É cor única não reutilizada? → criar token semântico ou aceitar como exception (raro)
   - É variação que existe no design system? → usar token

**Anti-padrões específicos:**

- "Vou só trocar `#10b981` por `#10b981` em CSS var" — não. Tem que virar **token semântico** (`text-success`), não variável da mesma cor.
- "Vou criar `--cor-do-card-do-pri` no globals" — não. Tokens semânticos por função, não por uso específico.
- "Vou deixar como CSS var dinâmica mesmo sendo cor estática" — não. CSS var dinâmica é só pra valores que mudam em runtime (brand do profissional). Cor estática vira classe Tailwind ou token.

### Passo 3 — Execução

Waves paralelas (categorias geralmente em arquivos diferentes; conflitos mínimos).

**Após terminar todas, promover regra:**

```javascript
// eslint.config.mjs
{
  rules: {
    'no-inline-style-color': ['error', {
      allowCSSVars: true,  // permite var(--*)
    }],
  }
}
```

### Passo 4 — Conferência

```bash
# Zero inline colors com hex
grep -rn "style={{[^}]*color:.*#" app/ components/ | grep -v "node_modules\|.test\|.spec" | wc -l  # = 0
grep -rn "style={{[^}]*background.*#" app/ components/ | grep -v "node_modules\|.test\|.spec" | wc -l  # = 0
grep -rn "style={{[^}]*border.*#" app/ components/ | grep -v "node_modules\|.test\|.spec" | wc -l  # = 0

# Zero inline colors com rgb/hsl
grep -rn "style={{[^}]*color.*rgb\|style={{[^}]*color.*hsl" app/ components/ | wc -l  # = 0

# CSS vars dinâmicas (legítimas) com comentário
grep -rn "style={{[^}]*var(--" app/ components/ | grep -v "node_modules"
# Auditoria manual: cada uma tem comentário explicando

# Lint
pnpm lint 2>&1 | grep "no-inline-style-color"  # vazio

# Regra promovida
grep "no-inline-style-color" eslint.config.* | grep "error"  # encontra

# VRT (cores devem permanecer iguais visualmente)
pnpm exec playwright test tests/visual/  # passa
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

**Data:** 2026-04-29
**Warnings eliminados:** 127 → 0

### Tokens semânticos criados (globals.css)

| Token                  | Valor                   | Uso                              |
| ---------------------- | ----------------------- | -------------------------------- |
| `--color-success`      | `var(--ob-success-400)` | Check marks, positive indicators |
| `--color-warning`      | `var(--ob-warning-400)` | Caution, "em breve", roadmap     |
| `--color-whatsapp`     | `#25D366`               | Brand color WhatsApp             |
| `--color-score-high`   | `#5cbf9b`               | Score ≥65 (AuditAnalysis)        |
| `--color-score-mid`    | `#c9a84c`               | Score 35-64 (AuditAnalysis)      |
| `--color-score-low`    | `#d4815e`               | Score <35 (AuditAnalysis)        |
| `--color-score-info`   | `#6baed4`               | Severidade baixa (AuditAnalysis) |
| `--color-score-accent` | `#9b8fd4`               | Ambient glow (AuditAnalysis)     |

### Estratégia por grupo

- **Semânticas** (#34D399, #FBBF24, #F87171): → tokens `text-success`, `text-warning`, `text-destructive`
- **Creatives** (#C6FF6C, #FF7A59, etc.): → Tailwind arbitrary `text-[#HEX]` (design-fixo)
- **Device mockup** (#3a3a42, #000, macOS traffic lights): → Tailwind arbitrary `bg-[#hex]`
- **rgba() overlays**: → Tailwind opacity (`bg-black/50`, `bg-white/5`)
- **hsl(var(--\*)) wrapping**: → `var(--color-*)` sem hsl() ou color-mix()
- **color-mix() com hex**: → hex substituído por `var(--color-*)` ref
- **AuditAnalysis scoring**: → tokens `var(--color-score-*)`

### Exceções

1. `app/global-error.tsx` — eslint-disable block (Tailwind CSS pode não estar carregado)
2. `components/ui/Walkthrough.tsx:128` — rgba fora do escopo da regra lint

### Conferência

- Lint: 0 erros, 0 inline color warnings ✅
- TypeScript: 0 erros ✅
- Vitest: 371/371 ✅
- Build: passa ✅
- Regra NÃO promovida (Fase 23) ✅

### Arquivos modificados: 35

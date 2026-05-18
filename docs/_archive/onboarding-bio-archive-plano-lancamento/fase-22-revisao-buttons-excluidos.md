# Fase 22 — Design System: revisão dos 22 buttons (5 excluídos + 17 motion.button gap)

## Metadata

| Campo                | Valor                                         |
| -------------------- | --------------------------------------------- |
| **Número**           | 22                                            |
| **Estado**           | 🔵 Próxima                                    |
| **Camadas cobertas** | 3                                             |
| **Depende de**       | 14 (componente Button), 15 (8 tipos de botão) |
| **Bloqueia**         | 23, 24                                        |
| **Tamanho**          | XS (< 4h)                                     |
| **Branch**           | `fase-22-revisao-buttons-excluidos`           |

---

## Por que esta fase, por que agora

Durante a "Fase 04" antiga, 5 `<button>` foram excluídos da regra `no-raw-button` com justificativas que o agente reconheceu publicamente como possíveis "desculpas inventadas pra não resolver". Cada exception precisa ser auditada honestamente: ou tem razão técnica nominada (e vira `// eslint-disable-next-line` com comentário concreto), ou vira `<Button>` de verdade.

Curto, mas **não pode ser pulado**. É a diferença entre "sistema com 5 exceções documentadas e justificadas" e "sistema com 5 buracos disfarçados de exceções".

---

## Loop interno

### Passo 1 — Auditoria

````bash
SLUG="revisao-buttons-excluidos"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

cat > README.md <<EOF
# Auditoria: revisão dos 5 buttons excluídos

**Data:** ${DATA}
**Fase:** 22

## Contexto
Durante a execução da "Fase 04" antiga, 5 \`<button>\` foram excluídos da regra \`no-raw-button\` com justificativas que precisam ser auditadas:

1. SimulationTabs (motion.button)
2. BackgroundPhoto upload area
3. ProfilePhoto upload area
4. Checkout radio group
5. global-error fallback

## Objetivo
Decidir caso a caso:
- **Legítimo:** mantém exception, ADICIONA comentário com razão técnica nominada
- **Ilegítimo:** migra pra <Button> ou <IconButton>
EOF

# Lista exceptions atuais
echo "# Exceptions atuais no eslint.config" > excecoes-atuais.md
echo '```' >> excecoes-atuais.md
grep -A 30 "no-raw-button" ../../../eslint.config.* 2>/dev/null >> excecoes-atuais.md
echo '```' >> excecoes-atuais.md

# Localiza cada um
echo "# Localização dos 5 arquivos" > localizacao-5-buttons.md
for nome in SimulationTabs BackgroundPhoto ProfilePhoto Checkout global-error; do
  echo "## $nome" >> localizacao-5-buttons.md
  echo '```' >> localizacao-5-buttons.md
  grep -rn "<button" ../../../app ../../../components 2>/dev/null \
    | grep -i "$nome" | head -10 >> localizacao-5-buttons.md
  echo '```' >> localizacao-5-buttons.md
done

# Decisão por button
cat > decisao-por-button.md <<'EOF'
# Decisão por button (preencher durante a auditoria)

## 1. SimulationTabs (motion.button)

**Localização:** {arquivo:linha}
**Contexto:** Tab usando motion.button do motion/react pra animação de slide.
**Análise:** `<Button>` aceita prop `asChild` (Radix slot)? Se sim, pode envolver motion.button.
**Decisão:** [ ] Migrar pra `<Button asChild><motion.button /></Button>`  [ ] Manter exception
**Razão técnica (se manter):** {preencher}

## 2. BackgroundPhoto upload area

**Localização:** {arquivo:linha}
**Contexto:** Área clicável que dispara file input pra upload de foto de fundo.
**Análise:** `<Button>` pode renderizar como label com input file dentro?
**Decisão:** [ ] Migrar pra `<Button>` com label  [ ] Migrar pra `<UploadButton>` componente novo  [ ] Manter exception
**Razão técnica (se manter):** {preencher}

## 3. ProfilePhoto upload area

**Localização:** {arquivo:linha}
**Contexto:** Igual ao BackgroundPhoto.
**Análise:** Mesma decisão que BackgroundPhoto. Componente reutilizável `<UploadButton>`?
**Decisão:** [ ] Migrar  [ ] Manter exception
**Razão técnica (se manter):** {preencher}

## 4. Checkout radio group

**Localização:** {arquivo:linha}
**Contexto:** Radio group customizado que renderiza opções de pagamento como botões grandes.
**Análise:** `<RadioGroup>` do Radix permite customizar itens? `<Button>` com role="radio"?
**Decisão:** [ ] Refatorar pra `<RadioGroup>`  [ ] Migrar pra `<Button role="radio">`  [ ] Manter exception
**Razão técnica (se manter):** {preencher}

## 5. global-error fallback

**Localização:** `app/global-error.tsx`
**Contexto:** Error boundary global do Next.js. Usa <button> raw porque <Button> pode falhar se o erro for em componente compartilhado.
**Análise:** Esta é a exception MAIS legítima. Global error precisa funcionar sem dependências.
**Decisão:** [ ] Migrar  [x] Manter exception (provável)
**Razão técnica:** "global-error.tsx é fallback de Next.js; usar <Button> introduce dependência que pode falhar no mesmo erro que disparou o boundary. Raw <button> é safe by design."
EOF
````

### Passo 2 — Plano de execução

Wave única (4 buttons + 1 documentação):

```markdown
# Wave 01 — Decidir e aplicar caso a caso

## Briefing

Para cada um dos 5 buttons:

1. Abrir o arquivo
2. Ler contexto real (não confiar na descrição da auditoria)
3. Aplicar checklist de `decisao-por-button.md`
4. Decidir: migrar ou manter
5. Se migrar: refatora
6. Se manter: garantir que existe `// eslint-disable-next-line no-raw-button -- {razão técnica concreta}` na linha exata

## Critério de aceite

- 5 buttons decididos com razão registrada em `decisao-por-button.md`
- Buttons que devem ser migrados, foram migrados (zero ocorrências em `pnpm lint`)
- Buttons que ficaram como exception têm comentário com razão NOMINADA (não "caso especial")
- `eslint.config.*` atualizado: REMOVER exceptions globais por nome de arquivo, manter apenas `// eslint-disable-next-line` por ocorrência

## Anti-padrões a recusar

- "Vou manter os 5 porque é mais rápido" — não. Decidir caso a caso.
- "Vou colocar `// eslint-disable` sem comentário" — não. Razão técnica nominada.
- "Razão: caso especial" — não. Razão concreta tipo "global-error precisa funcionar sem dependências de componentes compartilhados".
```

### Passo 3 — Execução

Sequencial (5 arquivos, decisão pensada).

### Passo 4 — Conferência

```bash
# Buttons que migraram não aparecem mais como exception
grep -A 20 "no-raw-button" eslint.config.*  # exceções globais devem estar zeradas ou apenas as legítimas

# Cada exception inline tem comentário
grep -B 1 "eslint-disable-next-line no-raw-button" app/ components/  # cada uma tem comentário "--" com razão

# Lint
pnpm lint 2>&1 | grep "no-raw-button"  # vazio ou apenas as legítimas

# Verificação manual: razões em decisao-por-button.md são técnicas, não preguiça
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

**Estado:** ✅ Concluída em 2026-04-29.

### Descoberta

Contagem real: **22 buttons** (não 5). O selector AST `JSXOpeningElement[name.name='button']` nunca capturou `<motion.button>` (JSXMemberExpression). 17 `motion.button` escapavam da regra desde sempre.

### Componentes criados

| Componente         | Arquivo                             | Consumers | Padrão eliminado                           |
| ------------------ | ----------------------------------- | --------- | ------------------------------------------ |
| `<SelectionCard>`  | `components/ui/selection-card.tsx`  | 11        | motion.button + whileTap + selection state |
| `<UploadDropzone>` | `components/ui/upload-dropzone.tsx` | 2         | button + hidden input + preview/loading    |

### Migrações

| De                            | Para                       | Arquivos                                                                            |
| ----------------------------- | -------------------------- | ----------------------------------------------------------------------------------- |
| `<button>`                    | `<Button variant="ghost">` | SimulationTabs                                                                      |
| `<button role="radio">`       | `RadioGroupPrimitive`      | Checkout                                                                            |
| `<motion.button>` (selection) | `<SelectionCard>`          | 5 onboarding steps + 3 form primitives + MultiSelect + PlanSelector + Focus TagPill |
| `<button>` (upload)           | `<UploadDropzone>`         | ProfilePhoto + BackgroundPhoto                                                      |

### ESLint

- Selector `motion.button` adicionado (D75)
- 5 file-level ignores removidos → inline `eslint-disable-next-line` com razão nominada
- `components/motion/**` adicionado ao ignores (primitives do DS)

### Estado final

- **6 exceptions inline** (cada uma genuinamente única)
- **13 consumers** de componentes do DS (11 SelectionCard + 2 UploadDropzone)
- **0 file-level ignores**
- Decisões D75-D78 registradas em `docs/core/decisions.md`
- `pnpm exec tsc --noEmit`: 0 erros novos
- `pnpm lint`: 0 erros, 1 warning pré-existente
- `pnpm exec vitest run`: 371/371

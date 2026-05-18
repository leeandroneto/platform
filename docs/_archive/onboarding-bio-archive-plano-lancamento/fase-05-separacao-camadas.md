# Fase 5 — Hardening de separação Lógica × UI × Dados × IO

## Metadata

| Campo                                    | Valor                        |
| ---------------------------------------- | ---------------------------- |
| **Número**                               | 5                            |
| **Nome curto**                           | `separacao-camadas`          |
| **Estado**                               | 🔵 Próxima                   |
| **Camadas do PADRAO-IMPECAVEL cobertas** | 1 (Código), 2 (Separação)    |
| **Depende de fases**                     | 1, 2, 3, 4                   |
| **Bloqueia fases**                       | 6, 7, 30, 31, 34, 37, 40, 46 |
| **Tamanho estimado**                     | M (1-3 dias)                 |
| **Branch sugerida**                      | `fase-05-separacao-camadas`  |

---

## Por que esta fase, por que agora

Todas as fases seguintes (auth, prompts, templates v2, desafios, painel, landing, PWA, WhatsApp) constroem features novas em cima do código atual. Sem fronteiras claras entre camadas, cada feature carrega o vazamento — componente fazendo fetch interno, `lib/domain/` importando React, `lib/services/` ressuscitando, IO externo chamado de Next.js direto.

A Fase 5 trava as 5 fronteiras inegociáveis (definidas em §2 do `PADRAO-IMPECAVEL.md`) **antes** de criar massa crítica de código novo. Detectar e corrigir 30 violações agora é trabalho de 1-3 dias. Detectar e corrigir 300 violações em 6 meses é trabalho de 2-3 semanas com risco de regressão em features já no ar.

Sem essa fase, qualquer feature daqui pra frente vai herdar (ou criar) novos vazamentos, e o codebase vai sair do nível impecável antes mesmo de chegar no beta.

---

## Loop interno

### Passo 1 — Auditoria

**Cria pasta:** `docs/auditorias/{YYYY-MM-DD}-separacao-camadas/`

**Comandos exatos:**

````bash
SLUG="separacao-camadas"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}"
cd "${PASTA}"

# README inicial
cat > README.md <<EOF
# Auditoria: Separação Lógica × UI × Dados × IO

**Data:** ${DATA}
**Fase:** 5
**Estado:** Em andamento

## Categorias auditadas
1. Cliente importa lib/supabase/admin (vazamento de service role)
2. Cliente importa lib/data direto (vazamento de DB pro client)
3. lib/domain com deps externas (pureza quebrada)
4. IO externo fora de Edge Function (Anthropic/Pagar.me/WhatsApp em Next.js)
5. Server action grande (>60 linhas, lógica deveria estar em lib/)
6. Arquivo grande (>400 linhas)
7. Utils genéricos (utils.ts, helpers.ts, Manager.tsx, Container.tsx)
8. Mutação multi-tabela sem RPC

## Resultado
(preenchido no Passo 4)
EOF

# decisions.md
cat > decisions.md <<EOF
# Decisões tomadas durante esta auditoria

(uma entrada por decisão, com data + justificativa)

EOF

# 1. Cliente importa lib/supabase/admin
echo "# Violações: cliente importa @/lib/supabase/admin" > violacoes-01-cliente-admin.md
echo "" >> violacoes-01-cliente-admin.md
echo "Padrão proibido: client component importando service role key (D14, §2.4 do PADRAO-IMPECAVEL)" >> violacoes-01-cliente-admin.md
echo "" >> violacoes-01-cliente-admin.md
echo "## Ocorrências" >> violacoes-01-cliente-admin.md
echo '```' >> violacoes-01-cliente-admin.md
grep -rn "lib/supabase/admin" ../../../app ../../../components 2>/dev/null \
  | grep -v "/api/\|server\|node_modules\|/server.ts\|/server/" >> violacoes-01-cliente-admin.md
echo '```' >> violacoes-01-cliente-admin.md
echo "" >> violacoes-01-cliente-admin.md
echo "## Total: $(grep -rn "lib/supabase/admin" ../../../app ../../../components 2>/dev/null | grep -v "/api/\|server\|node_modules\|/server.ts\|/server/" | wc -l)" >> violacoes-01-cliente-admin.md

# 2. Cliente importa lib/data direto
echo "# Violações: cliente importa lib/data direto" > violacoes-02-cliente-data.md
echo "" >> violacoes-02-cliente-data.md
echo "Padrão correto: client component recebe via props ou via server action. Não importa lib/data." >> violacoes-02-cliente-data.md
echo "" >> violacoes-02-cliente-data.md
echo "## Ocorrências" >> violacoes-02-cliente-data.md
echo '```' >> violacoes-02-cliente-data.md
# Lista arquivos client que importam lib/data
for f in $(grep -rln "use client" ../../../app ../../../components 2>/dev/null); do
  if grep -l "from '@/lib/data" "$f" 2>/dev/null > /dev/null; then
    echo "$f"
    grep -n "from '@/lib/data" "$f"
  fi
done >> violacoes-02-cliente-data.md
echo '```' >> violacoes-02-cliente-data.md

# 3. lib/domain com deps externas
echo "# Violações: lib/domain com dependências externas" > violacoes-03-domain-deps.md
echo "" >> violacoes-03-domain-deps.md
echo "lib/domain deve ser puro: zero React, zero Supabase, zero Next, zero Anthropic." >> violacoes-03-domain-deps.md
echo "" >> violacoes-03-domain-deps.md
echo "## Ocorrências" >> violacoes-03-domain-deps.md
echo '```' >> violacoes-03-domain-deps.md
grep -rn "from 'react\|from '@supabase\|from 'next\|from '@anthropic\|from 'motion" \
  ../../../lib/domain 2>/dev/null >> violacoes-03-domain-deps.md
echo '```' >> violacoes-03-domain-deps.md

# 4. IO externo fora de Edge Function
echo "# Violações: IO externo fora de Edge Function" > violacoes-04-io-fora-edge.md
echo "" >> violacoes-04-io-fora-edge.md
echo "Anthropic, Pagar.me, WhatsApp Cloud, EFI Bank devem ser chamados APENAS de Edge Functions." >> violacoes-04-io-fora-edge.md
echo "" >> violacoes-04-io-fora-edge.md
echo "## Ocorrências" >> violacoes-04-io-fora-edge.md
echo '```' >> violacoes-04-io-fora-edge.md
grep -rn "from '@anthropic-ai\|from 'pagarme\|from '@efi\|from 'efi-pay\|axios.*anthropic\|axios.*pagarme\|fetch.*api.anthropic\|fetch.*api.pagarme" \
  ../../../app ../../../lib 2>/dev/null \
  | grep -v "supabase/functions/\|node_modules" >> violacoes-04-io-fora-edge.md
echo '```' >> violacoes-04-io-fora-edge.md

# 5. Server action grande (>60 linhas)
echo "# Violações: server action > 60 linhas" > violacoes-05-server-action-grande.md
echo "" >> violacoes-05-server-action-grande.md
echo "Server actions devem orquestrar, não ter lógica. Mover lógica pra lib/data ou lib/domain." >> violacoes-05-server-action-grande.md
echo "" >> violacoes-05-server-action-grande.md
echo "## Ocorrências" >> violacoes-05-server-action-grande.md
echo '```' >> violacoes-05-server-action-grande.md
find ../../../app -name "actions.ts" -o -name "actions.tsx" 2>/dev/null | while read f; do
  lines=$(wc -l < "$f")
  if [ "$lines" -gt 60 ]; then
    echo "$f: $lines linhas"
  fi
done >> violacoes-05-server-action-grande.md
echo '```' >> violacoes-05-server-action-grande.md

# 6. Arquivo grande (>400 linhas)
echo "# Violações: arquivo > 400 linhas" > violacoes-06-arquivo-grande.md
echo "" >> violacoes-06-arquivo-grande.md
echo "Componente >300 linhas → decompor. Arquivo >400 linhas → separar." >> violacoes-06-arquivo-grande.md
echo "" >> violacoes-06-arquivo-grande.md
echo "## Ocorrências" >> violacoes-06-arquivo-grande.md
echo '```' >> violacoes-06-arquivo-grande.md
find ../../../app ../../../components ../../../lib \
  \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null \
  | xargs wc -l 2>/dev/null \
  | awk '$1 > 400 && $2 != "total" {print $1 " linhas: " $2}' \
  | sort -rn >> violacoes-06-arquivo-grande.md
echo '```' >> violacoes-06-arquivo-grande.md

# 7. Utils genéricos
echo "# Violações: arquivos com nome genérico" > violacoes-07-utils-genericos.md
echo "" >> violacoes-07-utils-genericos.md
echo "Anti-padrão: utils.ts, helpers.ts, common.ts, shared.ts, Manager.tsx, Container.tsx" >> violacoes-07-utils-genericos.md
echo "Cada um deve ser quebrado em arquivos com responsabilidade nominada." >> violacoes-07-utils-genericos.md
echo "" >> violacoes-07-utils-genericos.md
echo "## Ocorrências" >> violacoes-07-utils-genericos.md
echo '```' >> violacoes-07-utils-genericos.md
find ../../../app ../../../components ../../../lib -type f \
  \( -name "utils.ts" -o -name "utils.tsx" \
  -o -name "helpers.ts" -o -name "helpers.tsx" \
  -o -name "common.ts" -o -name "common.tsx" \
  -o -name "shared.ts" -o -name "shared.tsx" \
  -o -name "Manager.tsx" -o -name "Manager.ts" \
  -o -name "Container.tsx" \) 2>/dev/null >> violacoes-07-utils-genericos.md
echo '```' >> violacoes-07-utils-genericos.md
echo "" >> violacoes-07-utils-genericos.md
echo "**Nota:** `lib/utils.ts` do shadcn (com função `cn`) é exception válida — está documentada no PADRAO-IMPECAVEL §2.3." >> violacoes-07-utils-genericos.md

# 8. Mutação multi-tabela sem RPC
echo "# Violações: mutação multi-tabela fora de RPC" > violacoes-08-mutacao-sem-rpc.md
echo "" >> violacoes-08-mutacao-sem-rpc.md
echo "Mutação que toca >1 tabela DEVE estar em RPC com SECURITY DEFINER." >> violacoes-08-mutacao-sem-rpc.md
echo "Server action deve apenas chamar a RPC." >> violacoes-08-mutacao-sem-rpc.md
echo "" >> violacoes-08-mutacao-sem-rpc.md
echo "## Heurística inicial (precisa revisão manual)" >> violacoes-08-mutacao-sem-rpc.md
echo '```' >> violacoes-08-mutacao-sem-rpc.md
# Server actions com mais de uma chamada .insert/.update/.delete
grep -rln "use server" ../../../app 2>/dev/null | while read f; do
  inserts=$(grep -c "\.insert(\|\.update(\|\.delete(" "$f" 2>/dev/null || echo 0)
  if [ "$inserts" -gt 1 ]; then
    echo "$f: $inserts mutações"
  fi
done >> violacoes-08-mutacao-sem-rpc.md
echo '```' >> violacoes-08-mutacao-sem-rpc.md
echo "" >> violacoes-08-mutacao-sem-rpc.md
echo "**Atenção:** heurística simplificada. Auditar manualmente cada arquivo listado pra confirmar se mutações são na MESMA tabela ou em tabelas diferentes." >> violacoes-08-mutacao-sem-rpc.md
````

**Critério de fim do Passo 1:**

- 8 arquivos `violacoes-*.md` criados
- README.md com sumário das categorias
- decisions.md vazio mas presente

---

### Passo 2 — Plano de execução

**Cria pasta:** `docs/auditorias/{data}-separacao-camadas/waves/`

Para cada categoria com violações > 0, criar arquivo de wave usando o template a seguir. Categorias com 0 violações são puladas (não precisam de wave).

**Modelo de cada wave:**

````markdown
# Wave NN — {Categoria}

## Briefing pra abrir conversa nova

Estou executando a Fase 5 do plano (`docs/plano-lancamento/fase-05-separacao-camadas.md`).
Esta wave: **{categoria}**.

## Estado inicial

- Total de violações: {N} (lista em `docs/auditorias/{data}-separacao-camadas/violacoes-{categoria}.md`)
- Arquivos afetados: {lista}

## Critério de aceite (não negociável)

1. Zero violações da categoria (verificável com comando exato — abaixo)
2. `pnpm lint` zero erros, zero warnings
3. `pnpm exec tsc --noEmit` zero erros
4. `pnpm exec vitest run` tudo verde
5. `pnpm build` passa
6. (específico) {por categoria}

## Comando de verificação

```bash
{comando exato que conta violações}
# Esperado: 0
```
````

## Allowlist permitida

- {casos legítimos com justificativa nominada}

## Anti-padrões a recusar

- "Vou só renomear pra ficar parecido" — não. Refatora estruturalmente.
- "Esse aqui é caso especial" sem razão técnica — não.
- {específicos da categoria}

## Paralelização

- Conflita com: {waves que tocam mesmos arquivos}
- Pode paralelizar com: {waves independentes}

````

**`waves/README.md`:**

```markdown
# Plano de execução — Fase 5

## Ordem das waves

### Críticas (alta prioridade — segurança/arquitetura)
1. wave-01-cliente-admin.md (segurança crítica — service role no client)
2. wave-04-io-fora-edge.md (arquitetura crítica — IO externo no Next)

### Importantes (vazamento de camada)
3. wave-02-cliente-data.md
4. wave-03-domain-deps.md
5. wave-08-mutacao-sem-rpc.md

### Manutenibilidade
6. wave-05-server-action-grande.md
7. wave-06-arquivo-grande.md
8. wave-07-utils-genericos.md

## Paralelização

| Wave | Pode paralelizar com |
|---|---|
| 01 | 03, 07 |
| 02 | 03 |
| 03 | 01, 02, 07 |
| 04 | 07 (geralmente arquivos diferentes) |
| 05 | (sequencial) |
| 06 | (sequencial — pode tocar muitos arquivos) |
| 07 | 01, 03, 04 |
| 08 | (sequencial após 04) |

## Estimativa total

- Críticas: 4-8h
- Importantes: 6-12h
- Manutenibilidade: 4-8h
- **Total:** 14-28h (1-3 dias)
````

---

### Passo 3 — Execução

Agente executa wave por wave conforme ordem do `waves/README.md`. Em paralelo onde indicado, sequencial onde não.

**Anti-padrões cravados pra todas as waves:**

- §A1 PADRAO-IMPECAVEL: Warning como estado final
- §A2: "Resolvo depois"
- §A3: Exception sem justificativa
- §A6: Sufixo `Old`/`New`
- §A7: Decisão silenciosa

**Específicos desta fase:**

- "Vou criar `lib/services/`" → não. Foi proibido em D14.
- "Vou colocar essa chamada Anthropic em `lib/ai/`" → não. Edge Function obrigatória.
- "lib/domain pode importar Zod" → sim, Zod é OK (validação pura). Mas não pode importar nada do React/Supabase/Next.

---

### Passo 4 — Conferência

**Cria:** `docs/auditorias/{data}-separacao-camadas/verificacao.md`

**Roda novamente todos os comandos do Passo 1, mais os globais:**

```bash
# Repete cada um dos comandos das 8 categorias do Passo 1
# Cada um deve retornar zero linhas

# Globais
pnpm lint 2>&1 | tee verificacao-lint.txt
pnpm exec tsc --noEmit 2>&1 | tee verificacao-tsc.txt
pnpm exec vitest run 2>&1 | tee verificacao-vitest.txt
pnpm build 2>&1 | tee verificacao-build.txt
```

**Conteúdo do `verificacao.md`:**

```markdown
# Verificação final — Fase 5

**Data:** {YYYY-MM-DD}
**Resultado:** ✅ Pass / ❌ Fail

## Critérios

| #   | Critério                     | Esperado                       | Resultado | Status |
| --- | ---------------------------- | ------------------------------ | --------- | ------ |
| 1   | Cliente importa admin        | 0                              | {N}       | ✅/❌  |
| 2   | Cliente importa data         | 0                              | {N}       | ✅/❌  |
| 3   | Domain com deps externas     | 0                              | {N}       | ✅/❌  |
| 4   | IO externo fora de Edge      | 0                              | {N}       | ✅/❌  |
| 5   | Server action > 60 linhas    | 0                              | {N}       | ✅/❌  |
| 6   | Arquivo > 400 linhas         | 0 ou justificado               | {N}       | ✅/❌  |
| 7   | Utils genéricos              | 0 (exceto shadcn lib/utils.ts) | {N}       | ✅/❌  |
| 8   | Mutação multi-tabela sem RPC | 0                              | {N}       | ✅/❌  |
| -   | Lint                         | 0 erros, 0 warnings            | {N}       | ✅/❌  |
| -   | TypeScript                   | 0 erros                        | {N}       | ✅/❌  |
| -   | Vitest                       | tudo verde                     | {N}       | ✅/❌  |
| -   | Build                        | passa                          | {N}       | ✅/❌  |

## Conclusão

{Texto baseado no resultado}
```

---

### Passo 5 — Decisão automática

Conforme padrão do `_TEMPLATE.md`:

- ✅ tudo passa → atualiza plano + commit + Fase 6
- ❌ algo falha → cria `docs/auditorias/{data}-separacao-camadas-rev2/`, repete loop

---

## Resultado

(Preenchido após conclusão.)

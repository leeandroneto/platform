# Fase NN — {Nome da fase}

> **Template canônico de fase do plano.** Copie este arquivo pra criar uma fase nova.
> Substitua `{placeholders}` pelos valores reais.
> Este arquivo é a fonte de verdade da fase. O `PLANO_LANCAMENTO.md` só lista a fase; o detalhe está aqui.

---

## Metadata

| Campo                                    | Valor                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Número**                               | NN                                                                             |
| **Nome curto**                           | Slug pra usar em pastas e branches: `fase-NN-{slug-curto}`                     |
| **Estado**                               | ⏳ Futura · 🔵 Próxima · 🟡 Em execução · ✅ Concluída · ⚠️ Auditoria pendente |
| **Camadas do PADRAO-IMPECAVEL cobertas** | ex: `1, 2, 5` (referência cruzada)                                             |
| **Depende de fases**                     | ex: `5, 6, 8`                                                                  |
| **Bloqueia fases**                       | ex: `30, 35, 40`                                                               |
| **Tamanho estimado**                     | XS (< 4h) · S (4-12h) · M (1-3 dias) · L (1-2 semanas)                         |
| **Branch sugerida**                      | `fase-NN-{slug}`                                                               |

---

## Por que esta fase, por que agora

{Justificativa de 1-3 parágrafos. Explica:

- Por que a fase existe (qual problema resolve)
- Por que aqui na sequência (qual fase a precede e por quê)
- O que quebra se ela for pulada}

---

## Loop interno

### Passo 1 — Auditoria

**Cria pasta:** `docs/auditorias/{YYYY-MM-DD}-{slug}/`

**Arquivos esperados na pasta:**

```
docs/auditorias/{YYYY-MM-DD}-{slug}/
├── README.md            ← sumário executivo gerado no fim
├── decisions.md         ← decisões tomadas durante a auditoria
├── violacoes-{cat1}.md  ← uma por categoria de violação
├── violacoes-{cat2}.md
├── ...
└── waves/               ← criada no Passo 2
```

**Comandos exatos a rodar:**

```bash
# Setup
SLUG="{slug}"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}"
cd "${PASTA}"

# README inicial
cat > README.md <<EOF
# Auditoria: {Nome da fase}

**Data:** ${DATA}
**Fase:** NN
**Estado:** Em andamento

## Sumário
(preenchido no fim, após Passo 4)

## Categorias auditadas
- {cat1}
- {cat2}
- ...

## Resultado
(preenchido no Passo 4)
EOF

# decisions.md vazio
echo "# Decisões tomadas durante esta auditoria" > decisions.md
echo "" >> decisions.md
echo "(uma entrada por decisão, com data + justificativa)" >> decisions.md

# Comandos de auditoria por categoria
# {comando 1 que gera violacoes-cat1.md}
# {comando 2 que gera violacoes-cat2.md}
# ...
```

**Critério de fim do Passo 1:**

- Pasta criada
- README.md com lista de categorias
- Pelo menos 1 arquivo `violacoes-*.md` por categoria
- decisions.md vazio mas presente

---

### Passo 2 — Plano de execução

**Lê os arquivos `violacoes-*.md` do Passo 1 e gera waves.**

**Cria pasta:** `docs/auditorias/{YYYY-MM-DD}-{slug}/waves/`

**Para cada categoria de violação, cria um arquivo de wave:**

```
waves/
├── wave-01-{categoria1}.md
├── wave-02-{categoria2}.md
├── ...
└── README.md            ← lista de waves + ordem + paralelização
```

**Conteúdo de cada arquivo `wave-NN-{categoria}.md`:**

````markdown
# Wave NN — {Categoria}

## Briefing pra abrir conversa nova com agente

Estou em meio à execução da Fase NN do `PLANO_LANCAMENTO.md` (`docs/plano-lancamento/fase-NN.md`).
Esta wave cuida de UMA categoria específica: **{categoria}**.

## Estado inicial

- **Total de violações:** {número exato}
- **Arquivos afetados:** {número} arquivos
- **Lista completa em:** `docs/auditorias/{YYYY-MM-DD}-{slug}/violacoes-{categoria}.md`

## Critério de aceite (não negociável)

1. Zero ocorrências de `{padrão}` no codebase (verificável por comando exato — abaixo)
2. {Outro critério mensurável}
3. {Outro critério mensurável}
4. `pnpm exec tsc --noEmit` zero erros
5. `pnpm exec vitest run` tudo verde
6. `pnpm lint` zero erros e zero warnings desta categoria

## Comando de verificação final

```bash
{comando exato que conta violações}
# Esperado: 0
```
````

## Allowlist (se houver)

- `{caso 1}` — justificativa: `{razão técnica nominada}`
- `{caso 2}` — justificativa: `{razão técnica nominada}`

**Se aparecer caso novo durante execução que merece allowlist, declarar AQUI antes de continuar.** Nunca esconder em `// eslint-disable` espalhado.

## Anti-padrões a recusar

- "Vou marcar como warning, depois resolvo" → não.
- "Esses N são complicados, deixa pra outra wave" → não. Refatora ou justifica especificamente.
- "Adicionei `// eslint-disable-next-line` em vários arquivos" → não, a menos que cada um tenha comentário com razão técnica.
- {outros anti-padrões específicos da fase}

## Ordem das ações

1. Ler `docs/auditorias/{YYYY-MM-DD}-{slug}/violacoes-{categoria}.md`
2. Para cada violação:
   - {ação corretiva específica}
3. Rodar comando de verificação
4. Se zero, commit `chore({área}): wave-NN {categoria}`
5. Se não-zero, voltar pro passo 2 com as restantes

## Paralelização

- **Esta wave conflita com:** {lista de waves que tocam mesmos arquivos}
- **Pode rodar em paralelo com:** {lista de waves independentes}

Pronto pra começar quando confirmar entendimento.

````

**Conteúdo do `waves/README.md`:**

```markdown
# Plano de execução — Fase NN

## Ordem das waves

1. wave-01-{categoria1}.md — pode paralelizar com wave-02
2. wave-02-{categoria2}.md — pode paralelizar com wave-01
3. wave-03-{categoria3}.md — sequencial após wave-01

## Diagrama de dependência

(qual wave precisa de qual)

## Estimativa total
(soma)
````

---

### Passo 3 — Execução

**Agente executa waves em paralelo onde possível, sequencial onde necessário.**

Para cada wave:

1. Cria branch `wave-NN-{slug}`
2. Abre conversa nova (terminal novo) com o briefing do `wave-NN-{categoria}.md`
3. Executa
4. Roda comando de verificação
5. Se zero → commit + abre PR
6. Se não-zero → continua até zero (não pula)

**Anti-padrões cravados aqui (válidos pra todas as waves):**

- Promover regra pra `error` sem zerar ocorrências antes (§A1 do PADRAO-IMPECAVEL)
- "Resolvo depois" (§A2)
- Exception sem justificativa concreta (§A3)
- Funcionar não significa pronto (§A4)
- Cópia disfarçada de reutilização (§A5)
- Sufixo `Old`/`New` em vez de migrar (§A6)
- Decisão silenciosa sem registrar em decisions.md (§A7)

---

### Passo 4 — Conferência

**Cria arquivo:** `docs/auditorias/{YYYY-MM-DD}-{slug}/verificacao.md`

**Roda novamente todos os comandos de auditoria do Passo 1, mais:**

```bash
# Lint global
pnpm lint 2>&1 | tee verificacao-lint.txt
# Esperado: 0 errors, 0 warnings

# TypeScript global
pnpm exec tsc --noEmit 2>&1 | tee verificacao-tsc.txt
# Esperado: zero erros

# Tests
pnpm exec vitest run 2>&1 | tee verificacao-vitest.txt
# Esperado: tudo verde

# Build
pnpm build 2>&1 | tee verificacao-build.txt
# Esperado: passa

# {Comandos específicos da fase}
```

**Conteúdo do `verificacao.md`:**

```markdown
# Verificação final — Fase NN

**Data:** {YYYY-MM-DD}
**Resultado:** ✅ Pass / ❌ Fail

## Critérios da fase

| Critério       | Esperado             | Resultado | Status |
| -------------- | -------------------- | --------- | ------ |
| Lint           | 0 errors, 0 warnings | {valor}   | ✅/❌  |
| TypeScript     | zero erros           | {valor}   | ✅/❌  |
| Vitest         | tudo verde           | {valor}   | ✅/❌  |
| Build          | passa                | {valor}   | ✅/❌  |
| {específico 1} | {esperado}           | {real}    | ✅/❌  |
| {específico 2} | {esperado}           | {real}    | ✅/❌  |

## Conclusão

{Se ✅:} Todos os critérios cumpridos. Fase pronta pra fechar.

{Se ❌:} {N} critérios falharam. Categorias pendentes: {lista}. Próximo passo: criar nova auditoria `docs/auditorias/{YYYY-MM-DD}-{slug}-rev2/` e repetir loop.
```

---

### Passo 5 — Decisão automática

**Lê `verificacao.md`:**

#### Caso A: Tudo passou (✅)

1. Atualiza `docs/plano-lancamento/PLANO_LANCAMENTO.md`:
   - Tabela §3.2 (sequência linear): muda estado da fase de 🔵 pra ✅
   - §10 (histórico): adiciona linha "{data} — Fase NN concluída"
2. Atualiza este arquivo (`fase-NN.md`):
   - Metadata: estado vira ✅
   - Adiciona seção "## Resultado" no fim com data + link pra `docs/auditorias/{YYYY-MM-DD}-{slug}/`
3. Commit final: `docs(plano): conclui Fase NN — {nome curto}`
4. Identifica próxima fase com estado 🔵 e começa o loop dela

#### Caso B: Algo falhou (❌)

1. **NÃO ATUALIZA o plano.** Fase fica como 🟡 (em execução).
2. Cria nova pasta de auditoria com sufixo `-rev{N+1}`: `docs/auditorias/{YYYY-MM-DD}-{slug}-rev2/`
3. Roda novamente Passo 1 (auditoria) só pras categorias que falharam
4. Repete Passos 2-4 até passar
5. Só então aplica Caso A

**Nunca pula fase. Nunca avança com critério não cumprido.**

---

## Resultado

(Preenchido após conclusão. Mantido aqui pra histórico.)

| Campo                 | Valor                                  |
| --------------------- | -------------------------------------- |
| **Data de conclusão** | YYYY-MM-DD                             |
| **Auditoria final**   | `docs/auditorias/{YYYY-MM-DD}-{slug}/` |
| **Commits**           | {SHA inicial}..{SHA final}             |
| **Tempo real**        | {horas/dias}                           |
| **Lições aprendidas** | {1-3 bullets}                          |

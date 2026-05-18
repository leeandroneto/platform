# Mudanças no backend para suportar o System Prompt v2

> Sem essas mudanças, o prompt v2 não vai performar. A maior parte da inteligência sai do prompt e vai pro `buildUserMessage()`.

---

## 1. Pré-cálculos no backend (mover da IA para código)

**Por quê:** modelo de linguagem não é calculadora. Você está pedindo pra IA fazer aritmética com Q4 × Q5 e arredondamentos — vai dar erro em casos de borda. Tira tudo dela, entrega resultado pronto.

### Implementar uma função `computeCalculations(respostas, benchmarks)` que devolve:

```ts
type Calculations = {
  receita_mensal: number // Q4 * Q5
  margem_valor: number // receita_mensal - Q6
  margem_pct: number // (margem_valor / receita_mensal) * 100, ou 0 se receita=0
  break_even_alunos: number // ceil(Q6 / Q5), ou 0 se ticket=0
  break_even_pct_atual: number // (Q4 / break_even_alunos) * 100
  distancia_meta_pct: number // (receita_mensal / meta) * 100
  ticket_posicionamento: 'abaixo_do_basico' | 'basico' | 'medio' | 'premium' | 'acima_do_premium'
  churn_estimado_pct: number | null // calculado de Q7 se possível
  ltv_meses: number | null // Q7 (permanência)
  ltv_valor: number | null // Q5 * Q7
  cidade_porte: 'capital' | 'media' | 'pequena'
  regiao_calibracao: 'sudeste_sul' | 'norte_nordeste_co'
}
```

### Lógica de `ticket_posicionamento`

```ts
function classifyTicket(ticket: number, bench: Benchmark) {
  if (ticket < bench.preco_basico_min) return 'abaixo_do_basico'
  if (ticket <= bench.preco_basico_max) return 'basico'
  if (ticket <= bench.preco_medio_max) return 'medio'
  if (ticket <= bench.preco_premium_max) return 'premium'
  return 'acima_do_premium'
}
```

### Lógica de calibração regional aplicada nos benchmarks

Antes de injetar o benchmark no prompt, aplicar redução:

```ts
function calibrateBenchmark(bench: Benchmark, porte: CityPort, regiao: Region) {
  const factor = computeFactor(porte, regiao) // ex: 0.75 para cidade pequena no Norte
  return {
    ...bench,
    preco_basico_min: bench.preco_basico_min * factor,
    preco_basico_max: bench.preco_basico_max * factor,
    preco_medio_min: bench.preco_medio_min * factor,
    preco_medio_max: bench.preco_medio_max * factor,
    preco_premium_min: bench.preco_premium_min * factor,
    preco_premium_max: bench.preco_premium_max * factor,
    ticket_medio_nacional: bench.ticket_medio_nacional * factor,
    // churn_mensal_min/max: aumentar 10-15% se norte_nordeste_co
  }
}
```

### Lógica de `cidade_porte`

Usar API IBGE (`/v3/agregados/6579`) ou tabela estática local:

```ts
function classifyCityPort(populacao: number): CityPort {
  if (populacao >= 1_000_000) return 'capital' // ou flag oficial de capital
  if (populacao >= 200_000) return 'media'
  return 'pequena'
}
```

---

## 2. Detecção de `tom_global` no backend

```ts
function detectTomGlobal(respostas, calc): 'salvacao' | 'escala' {
  const fraquezas = [
    !['sim_atualizado'].includes(respostas.Q12), // sem site adequado
    respostas.Q14 === 'sem_processo', // sem conversão
    ['nunca', 'tenho_mas_nao_publico'].includes(respostas.Q20), // sem depoimentos
    ['frequencia', 'algumas_vezes'].includes(respostas.Q22), // perde por evolução
    respostas.Q19 === 'pix_manual', // cobrança manual
    respostas.Q24.length >= 3 || respostas.Q24.includes('cabeca'), // dados espalhados
    ['5a10h', 'mais_10h'].includes(respostas.Q25), // muito admin
    calc.margem_pct < 20, // margem apertada
  ].filter(Boolean).length

  return fraquezas >= 4 ? 'salvacao' : 'escala'
}
```

---

## 3. Detecção de `modo_relatorio` (edge cases)

```ts
function detectModoRelatorio(respostas, calc): ReportMode {
  if (respostas.Q4 === 0) return 'guia_inicio'
  if (calc.margem_pct < 0) return 'alerta_negativo'
  if (respostas.Q3 < 1) return 'fundacao'
  return 'normal'
}

function detectMetaRealismo(respostas, calc): 'realista' | 'agressiva' | 'irrealista' {
  const ratio = respostas.Q9 / Math.max(calc.receita_mensal, 1)
  if (ratio > 10) return 'irrealista'
  if (ratio > 3) return 'agressiva'
  return 'realista'
}
```

---

## 4. Estrutura final do user message

```xml
<profissional>
  <nome>Carlos</nome>
  <modalidade>musculacao</modalidade>
  <especialidades>emagrecimento, gestante</especialidades>
  <modelo_atendimento>hibrido</modelo_atendimento>
  <locais>academia_parceira, domicilio</locais>
  <tempo_atuacao_anos>4</tempo_atuacao_anos>
  <cidade>Americana</cidade>
  <estado>SP</estado>
  <cref>012345-G/SP</cref>
</profissional>

<numeros>
  <alunos_ativos>18</alunos_ativos>
  <ticket_medio>400</ticket_medio>
  <gastos_fixos>2800</gastos_fixos>
  <meta_faturamento>10000</meta_faturamento>
  <permanencia_meses>8</permanencia_meses>
  <seguidores_instagram>2500</seguidores_instagram>
</numeros>

<mercado>
  <concorrencia_local>parecido</concorrencia_local>
  <perfil_aluno>iniciante_sedentario</perfil_aluno>
  <origem_alunos>indicacao, instagram</origem_alunos>
  <novos_interessados_mes>3a5</novos_interessados_mes>
  <taxa_fechamento>5a7</taxa_fechamento>
  <processo_conversao>converso_whatsapp</processo_conversao>
</mercado>

<dores>
  <maiores_dificuldades>conseguir_alunos, cobrar_valor</maiores_dificuldades>
  <prioridade_um>ser_percebido_pelo_que_valho</prioridade_um>
  <ja_tentou>conteudo_diario, anuncios</ja_tentou>
</dores>

<digital>
  <site>linktree</site>
  <depoimentos>as_vezes</depoimentos>
  <perdeu_por_evolucao>algumas_vezes</perdeu_por_evolucao>
  <cobranca>pix_manual</cobranca>
  <onde_guarda>whatsapp, planilha, cabeca</onde_guarda>
  <tempo_admin>5a10h</tempo_admin>
  <usa_ia>nao_uso</usa_ia>
  <ferramenta_ideal>cobranca_automatica, site_proprio, captacao</ferramenta_ideal>
</digital>

<aspiracoes>
  <diferencial>Atenção próxima e foco em mulheres na faixa dos 35-45</diferencial>
  <fontes_renda>individual, turmas</fontes_renda>
</aspiracoes>

<benchmarks>
  <!-- Linha completa da market_benchmarks JÁ CALIBRADA pela região/porte -->
  <preco_basico_min>320</preco_basico_min>
  <preco_basico_max>560</preco_basico_max>
  <preco_medio_min>560</preco_medio_min>
  <preco_medio_max>960</preco_medio_max>
  <preco_premium_min>960</preco_premium_min>
  <preco_premium_max>2000</preco_premium_max>
  <ticket_medio_nacional>720</ticket_medio_nacional>
  <churn_mensal_min>6</churn_mensal_min>
  <churn_mensal_max>10</churn_mensal_max>
  <permanencia_min>6</permanencia_min>
  <permanencia_max>14</permanencia_max>
  <conversao_min>8</conversao_min>
  <conversao_max>35</conversao_max>
  <forcas_setor>...</forcas_setor>
  <ameacas_setor>...</ameacas_setor>
  <oportunidades_setor>...</oportunidades_setor>
  <perfil_aluno_idade>26-45 anos (faixa dominante)</perfil_aluno_idade>
  <ferramentas_dominantes>WhatsApp, planilhas, MFIT, Trainerize</ferramentas_dominantes>
</benchmarks>

<calculos>
  <receita_mensal>7200</receita_mensal>
  <margem_valor>4400</margem_valor>
  <margem_pct>61.1</margem_pct>
  <break_even_alunos>7</break_even_alunos>
  <break_even_pct_atual>257</break_even_pct_atual>
  <distancia_meta_pct>72</distancia_meta_pct>
  <ticket_posicionamento>basico</ticket_posicionamento>
  <churn_estimado_pct>12.5</churn_estimado_pct>
  <ltv_meses>8</ltv_meses>
  <ltv_valor>3200</ltv_valor>
  <cidade_porte>media</cidade_porte>
  <regiao_calibracao>sudeste_sul</regiao_calibracao>
</calculos>

<tom_global>salvacao</tom_global>
<modo_relatorio>normal</modo_relatorio>
<meta_realismo>agressiva</meta_realismo>
```

---

## 5. Atualizar a tool `generate_prospect_report`

### Adicionar enum completo de `ticket_posicionamento` em ambas as seções (2 e 5)

```jsonc
"ticket_posicionamento": {
  "enum": ["abaixo_do_basico", "basico", "medio", "premium", "acima_do_premium"]
}
```

### Adicionar enum de `hook_type`

```jsonc
"hook_type": {
  "enum": ["retencao", "cobranca", "site", "captacao", "conversao",
           "gestao", "programas", "ia", null]
}
```

### Schema do `top3_actions` com `prioridade` literal

```jsonc
"acoes": {
  "type": "array",
  "minItems": 3,
  "maxItems": 3,
  "items": {
    "type": "object",
    "required": ["prioridade", "hook_type", "titulo", "diagnostico", "acao", "impacto_esperado"],
    "properties": {
      "prioridade": { "enum": [1, 2, 3] },
      "hook_type":  { /* enum acima */ },
      "titulo":     { "type": "string", "maxLength": 80 },
      "diagnostico":{ "type": "string", "maxLength": 280 },
      "acao":       { "type": "string", "maxLength": 360 },
      "impacto_esperado": { "type": "string", "maxLength": 200 }
    }
  }
}
```

### Adicionar `evidencia` no schema do SWOT

```jsonc
"forcas": {
  "type": "array",
  "minItems": 3,
  "maxItems": 3,
  "items": {
    "type": "object",
    "required": ["titulo", "descricao", "evidencia"],
    "properties": {
      "titulo":    { "type": "string", "maxLength": 60 },
      "descricao": { "type": "string", "maxLength": 240 },
      "evidencia": { "type": "string", "maxLength": 200 }
    }
  }
}
```

(idem para `fraquezas`, `oportunidades`, `ameacas`)

---

## 6. Validação pós-geração (no backend, depois da chamada)

Antes de salvar `report_result`, validar:

```ts
function validateReport(report, calc): ValidationResult {
  const issues: string[] = []

  // 1. Coerência de posicionamento entre seções
  if (
    report.indicadores_financeiros.ticket_posicionamento.categoria !==
    report.precificacao.posicionamento
  ) {
    issues.push('posicionamento divergente entre seções 2 e 5')
  }

  // 2. Prioridades únicas em top3
  const prioridades = report.top3_actions.acoes.map((a) => a.prioridade)
  if (
    new Set(prioridades).size !== 3 ||
    !prioridades.includes(1) ||
    !prioridades.includes(2) ||
    !prioridades.includes(3)
  ) {
    issues.push('prioridades 1, 2, 3 não estão todas presentes')
  }

  // 3. SWOT com 3 itens em cada quadrante
  ;['forcas', 'fraquezas', 'oportunidades', 'ameacas'].forEach((q) => {
    if (report.swot[q].length !== 3) issues.push(`swot.${q} não tem exatamente 3`)
  })

  // 4. Evidência presente em todo item de SWOT
  ;['forcas', 'fraquezas', 'oportunidades', 'ameacas'].forEach((q) => {
    report.swot[q].forEach((item, i) => {
      if (!item.evidencia || item.evidencia.length < 10) {
        issues.push(`swot.${q}[${i}] sem evidência`)
      }
    })
  })

  // 5. Valores numéricos batem com calculations
  if (Math.abs(report.indicadores_financeiros.receita_mensal.valor - calc.receita_mensal) > 1) {
    issues.push('receita_mensal divergente do cálculo do backend')
  }

  return { valid: issues.length === 0, issues }
}
```

Se `valid: false`, decidir entre:

- Loggar e devolver mesmo assim (MVP)
- Tentar regenerar uma vez com mensagem de correção (melhor)
- Devolver fallback estático (fallback)

---

## 7. Mudanças mínimas para começar

Se quiser fazer em fases:

### Fase 1 — Imediato (sem mexer no backend)

- [ ] Substituir o conteúdo de `prospect-analysis.system` no banco pelo prompt v2
- [ ] Reduzir temperatura de 0.7 para 0.4
- [ ] Atualizar enum de `ticket_posicionamento` na tool (5 valores)
- [ ] Adicionar enum de `hook_type` na tool

### Fase 2 — 1-2 dias de backend

- [ ] Implementar `computeCalculations()`
- [ ] Implementar `detectTomGlobal()` e `detectModoRelatorio()`
- [ ] Refatorar `buildUserMessage()` para incluir `<calculos>`, `<tom_global>`, `<modo_relatorio>`
- [ ] Aplicar calibração regional nos benchmarks antes de injetar

### Fase 3 — Robustez

- [ ] Adicionar `evidencia` em todos os itens de SWOT (schema)
- [ ] Implementar `validateReport()` pós-geração
- [ ] Sistema de retry com correção automática

---

## 8. Resultado esperado depois de implementar

- Relatórios deixam de ter números genéricos como "R$ 950" — sempre faixas.
- Posicionamento na seção 2 é igual ao da seção 5 (porque vem de `<calculos>`, não da IA).
- Top 3 ações ordenadas por critério financeiro objetivo, não aleatório.
- SWOT com evidência rastreável (auditável).
- Edge cases tratados (0 alunos, margem negativa, < 12 meses).
- Tom global consistente entre seções.
- Hook do produto coerente com a dor real, não chutado.

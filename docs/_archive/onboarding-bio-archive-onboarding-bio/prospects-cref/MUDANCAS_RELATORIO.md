# Mudanças no Relatório (HTML/JSX) — Substituir gancho de cobrança por isca digital

> Documento para o Claude no VSCode aplicar. Auditar o código atual antes de mudar e respeitar o que já está bom — alterar apenas o necessário.

---

## Contexto da decisão

O relatório atualmente menciona "cobrança recorrente automática" como uma das 3 prioridades e como benefício no closing CTA. **Essa feature não está pronta** (depende de gateway integrado e WhatsApp API). Vender o que não existe queima credibilidade.

Substituir esse gancho pelo de **isca digital / captação de seguidores**, que:

- Já existe como produto (formulário inteligente do aluno + relatório IA do aluno)
- É o diferencial central da plataforma ("Outros fazem gestão. Nós fazemos aquisição.")
- Conecta diretamente com a dor real do profissional CREF (Instagram parado, dependência de indicação, conversão fraca de leads digitais)

---

## Alterações pontuais

### 1. Substituir a Ação #2 do Top 3

A ação que hoje fala em **"Migrar cobrança manual pra recorrência automática"** vira:

#### Novo título

"Transformar seguidores em alunos com formulário inteligente"

#### Novo diagnóstico

Adaptar à realidade do profissional. Modelo:

> "Você tem [N] seguidores e capta principalmente por [canal predominante], mas [X] de cada 10 interessados não fecham. Falta um funil que qualifique e eduque o lead antes do contato direto."

Quando os dados forem genéricos/exemplo, usar:

> "Você tem 2.500 seguidores e capta 70% por indicação. Quem chega indireto pelo Instagram se perde no Linktree, sem qualificação prévia ao WhatsApp."

#### Nova ação ("o que fazer")

> "Publicar um formulário inteligente no link da bio do Instagram. O interessado responde 8–12 perguntas sobre objetivo, perfil e rotina, e recebe um relatório personalizado com diagnóstico do treino ideal — apresentando você como a solução natural, com seus planos e depoimentos."

#### Novo impacto esperado

> "Conversão de lead para aluno sobe 2–3x e você só conversa pelo WhatsApp com quem já chegou educado e qualificado."

#### Manter

- Mesmo card visual (cor priority-2 amarelo/âmbar)
- Mesma estrutura de blocos (head, title, diagnostic, "o que fazer", impact)
- Mesmo posicionamento como Ação 2 ("Importante · libera tempo" pode virar **"Importante · ativa sua audiência"**)

---

### 2. Atualizar o closing CTA

A lista de benefícios do produto na seção de fechamento atualmente menciona "cobrança recorrente automática". Substituir por uma combinação que reflete o que **realmente existe** hoje + Fase 2 próxima:

#### Antes (referência conceitual)

"Site profissional com depoimentos, cobrança recorrente automática, gestão centralizada de alunos e programas estruturados."

#### Depois

"Site profissional com depoimentos, **formulário inteligente que transforma seguidores em alunos**, relatório IA que qualifica cada interessado, e gestão centralizada de leads e alunos."

#### Manter

- Mesma estrutura visual (gradient, glow lime, eyebrow, título display, body, CTA)
- Mesmo CTA label
- Mesmo link para /fundadores

---

### 3. Atualizar texto do tom de fechamento (`tom_fechamento`)

Quando o tom_global for `salvacao`, o texto do fechamento da seção de top 3 ações lista os hook_types das 3 ações. Atualizar a referência mental: o slot que era "cobrança" agora é **"isca digital"** ou **"captação por audiência"**.

#### Frase modelo

> "[Nome], suas 3 prioridades exigem ferramentas separadas hoje — site, isca digital e gestão de alunos. Existe um caminho mais simples."

---

### 4. Atualizar o Sticky CTA mobile (se houver texto que mencione cobrança)

Hoje o sticky CTA tem um texto curto tipo "Resolva as 3 prioridades em um só lugar". Manter assim — não precisa mencionar features específicas. Mas se em algum ponto o texto citar "cobrança automática", trocar por "captar e converter audiência".

---

## Itens explícitos que NÃO mudam

- Estrutura das 8 seções (cabeçalho, indicadores, SWOT, persona, precificação, break-even, concorrência, top 3)
- Layout mobile-first (grid 2x2 dos indicadores, SWOT vertical empilhado, etc.)
- Tokens de cor e tipografia
- Ações 1 e 3 do Top 3 (continuam sendo "vitrine com depoimentos" e "programa estruturado de 12 semanas")
- Animações e sticky CTA (apenas o texto da ação 2 muda)

---

## Checklist de auditoria antes de aplicar

- [ ] Localizar onde a Ação 2 está renderizada (provavelmente em um array de ações ou componente `<ActionCard>`)
- [ ] Localizar onde o closing CTA tem a lista de benefícios do produto
- [ ] Confirmar que o `hook_type` desta ação no JSON vem como `cobranca` (que será renomeado — ver documento do backend)
- [ ] Após renomear o hook_type para `iscadigital`, verificar que o componente que mapeia `hook_type → ícone/cor` ainda funciona
- [ ] Conferir se o Sticky CTA tem cópia hardcoded mencionando cobrança

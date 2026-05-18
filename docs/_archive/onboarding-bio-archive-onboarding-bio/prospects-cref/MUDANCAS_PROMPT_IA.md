# Mudanças no System Prompt da IA — Substituir gancho `cobranca` por `iscadigital`

> Documento para o Claude no VSCode aplicar. O system prompt vive na tabela `ai_prompts` (chave `prospect-analysis.system`).

---

## Contexto da decisão

A regra de hook_type `cobranca` aponta para uma feature que ainda não existe no produto (cobrança recorrente automática). Substituir pelo hook `iscadigital`, que aponta para uma feature **já existente**: formulário inteligente do aluno + relatório IA do aluno.

---

## 1. Atualizar a tabela de hierarquia de hook_type

### Onde fica

Dentro do bloco "Lógica de hook_type (top3_actions)" ou equivalente, no system prompt salvo no banco.

### Substituição da regra

Remover a linha que descreve a regra de `cobranca`:

```diff
- | Q19 = "pix"                                 | cobranca   |
```

Adicionar a nova regra de `iscadigital`:

```diff
+ | Seguidores > 1000 + (taxa_fechamento baixa  | iscadigital |
+ |  ou Q14 = "sem_processo" ou Q13 =           |            |
+ |  "indicacao" como única fonte)              |            |
```

### Reordenação da hierarquia

A ordem importa porque `iscadigital` deve ser priorizado quando o profissional tem audiência subutilizada — situação muito comum no público-alvo. Ordem sugerida (1ª condição que bate vence):

```
1. retencao     — Q22 = "frequencia"/"algumas_vezes" OU permanência < benchmark
2. iscadigital  — seguidores > 1000 E (taxa baixa OU sem processo OU só indicação)
3. site         — Q12 ∈ {"nao_tenho", "linktree", "instagram_redes"} E seguidores > 1000
4. captacao     — Q14 = "sem_processo" E novos_interessados ∈ {"3a4", "1a2", "nao_meco"}
5. conversao    — Q14 ∈ {"converso_whatsapp", "sem_processo"} E taxa < "5 a 7"
6. gestao       — Q24 contém ≥3 opções OU contém "cabeca" OU Q25 ∈ {"5a10h", "mais_10h"}
```

Manter as regras de combinar com `null` quando 0–1 ganchos detectados (tom de escala/próximo nível).

---

## 2. Atualizar a copy de exemplo da Ação 2

Se o system prompt atual tem **exemplos de saída** ou texto que cita explicitamente "cobrança recorrente", substituir pelo novo gancho.

### Modelo de diagnóstico para `iscadigital`

> "Você tem [N] seguidores e capta principalmente por [canal predominante], mas [X] de cada 10 interessados não fecham. Falta um funil que qualifique e eduque o lead antes do contato direto."

### Modelo de ação ("o que fazer") para `iscadigital`

> "Publicar um formulário inteligente no link da bio do Instagram. O interessado responde 8–12 perguntas sobre objetivo, perfil e rotina, e recebe um relatório personalizado com diagnóstico do treino ideal — apresentando você como a solução natural, com seus planos e depoimentos."

### Modelo de impacto esperado para `iscadigital`

> "Conversão de lead para aluno sobe 2–3x e você só conversa pelo WhatsApp com quem chegou educado e qualificado."

---

## 3. Atualizar o tom de fechamento (`tom_fechamento`)

Quando o tom_global for `salvacao`, o template menciona os 3 hook_types das prioridades. Atualizar a referência:

### Antes (referência conceitual)

> "Carlos, suas 3 prioridades exigem ferramentas separadas hoje — site, captação e cobrança. Existe um caminho mais simples."

### Depois (modelo)

> "[Nome], suas 3 prioridades exigem ferramentas separadas hoje — [hook_type ação 1 humanizado], [hook_type ação 2 humanizado] e [hook_type ação 3 humanizado]. Existe um caminho mais simples."

Onde a "humanização" do hook_type segue um dicionário fixo:

```
site         → "vitrine profissional"
iscadigital  → "isca digital"
captacao     → "captação ativa"
conversao    → "qualificação de leads"
retencao     → "retenção de alunos"
gestao       → "gestão centralizada"
```

---

## 4. Atualizar restrições negativas explícitas

Se o system prompt tem uma seção de "NÃO faça" que menciona cobrança, ajustar:

### Adicionar

- "NÃO recomende migrar cobrança para Pix recorrente automático ou sistemas de cobrança automatizada — essa feature ainda não está disponível na plataforma."
- "NÃO mencione automação de WhatsApp ou disparo automatizado de mensagens — essas features ainda não estão disponíveis."

### Pode manter (se já existir)

- "NÃO mencione site como fraqueza se o profissional respondeu que tem site profissional."

---

## 5. Atualizar a descrição do produto no system prompt

Se o prompt menciona "onboarding.bio é uma plataforma de captação e gestão", reforçar o posicionamento alinhado ao gancho:

### Versão atualizada

> "O diagnóstico é entregue pela plataforma onboarding.bio — um sistema de **captação e gestão para profissionais autônomos de saúde e fitness, com foco em transformar audiência (seguidores, indicações) em alunos qualificados** através de formulários inteligentes e relatórios personalizados gerados por IA."

Esse pequeno ajuste no enquadramento ajuda a IA a manter consistência ao escolher o gancho.

---

## 6. Atualizar o enum no schema da tool `generate_prospect_report`

A tool define `hook_type` como enum. Atualizar:

```diff
"hook_type": {
  "enum": [
    "site",
    "captacao",
    "conversao",
    "gestao",
    "retencao",
-   "cobranca",
+   "iscadigital",
    null
  ]
}
```

**Importante:** o schema da tool é a fonte de verdade. Se houver divergência entre system prompt e tool, **a tool prevalece** — porque é o que o modelo realmente obedece. Conferir que ambos batem.

---

## 7. Validação pós-implementação

Após aplicar as mudanças:

1. Gerar um relatório de teste com perfil "Carlos Mendes — musculação, 2.500 seguidores, 5–7 de 10 fecham, captação 70% indicação"
2. Validar que:
   - Nenhuma das 3 ações tem `hook_type: cobranca`
   - A Ação 2 (provavelmente) tem `hook_type: iscadigital`
   - O texto da ação fala em formulário no link da bio, não em Pix recorrente
   - O closing menciona "isca digital", não "cobrança"
3. Testar 2–3 perfis variados:
   - Sem Instagram (seguidores = 0): `iscadigital` não deve aparecer
   - Com 50k seguidores e 1 a 2 de 10 fechando: `iscadigital` deve ser prioridade 1 ou 2
   - Com retenção ruim: `retencao` ainda vence `iscadigital`

---

## Itens explícitos que NÃO mudam

- Identidade e missão do prompt
- Princípios não-negociáveis (honestidade, faixas em vez de pontos, especificidade)
- Estrutura geral do user message (`<profissional>`, `<numeros>`, etc.)
- Os outros 5 hook_types e suas regras
- Lógica de tom condicional A (salvação) / B (escala)
- Edge cases (0 alunos, margem negativa, < 12 meses, sem CREF)
- Estrutura das 8 seções do relatório
- Lista negra de expressões proibidas

---

## Checklist de auditoria antes de aplicar

- [ ] Confirmar onde está armazenado o system prompt (banco `ai_prompts` chave `prospect-analysis.system`)
- [ ] Conferir se há versionamento de prompt — criar v2 em vez de sobrescrever v1
- [ ] Localizar todas as ocorrências de `cobranca`, `pix`, `recorrência`, `cobrar automaticamente` no prompt
- [ ] Confirmar que o schema da tool em `call-anthropic.ts` tem `hook_type` como enum e atualizar
- [ ] Após atualizar, regenerar 2–3 relatórios de teste e validar saída
- [ ] Documentar a mudança no histórico de versões do prompt (se houver)

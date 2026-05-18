# Mudanças no Backend — Renomear hook_type `cobranca` para `iscadigital`

> Documento para o Claude no VSCode aplicar. Auditar o código atual antes de mudar.

---

## Contexto da decisão

O `hook_type` atual `cobranca` aciona uma ação de migrar Pix manual para recorrência automática. Esta feature **não existe ainda** na plataforma (depende de gateway integrado pronto, integração WhatsApp API, etc.).

Substituir pelo `iscadigital`, que aciona uma ação de **transformar seguidores em alunos via formulário inteligente do aluno + relatório IA do aluno** — feature que **já existe** no produto.

---

## 1. Tipo `ActionHookType`

### Onde mexer

Localizar a definição do union type `ActionHookType` (provavelmente em `types/` ou nos schemas Zod do edge function `generate-diagnostic`).

### Mudança

Remover `'cobranca'` e adicionar `'iscadigital'`:

```diff
type ActionHookType =
  | 'site'
  | 'captacao'
  | 'conversao'
  | 'gestao'
  | 'retencao'
- | 'cobranca'
+ | 'iscadigital'
```

### Locais a sincronizar

- TypeScript types
- Schema Zod (se houver)
- Schema da tool `generate_prospect_report` no `call-anthropic.ts` (campo `hook_type`)
- Qualquer mapper de `hook_type → label/cor/ícone` no frontend
- Documentação interna se existir

---

## 2. Lógica de detecção do hook_type no `buildUserMessage` ou similar

### Contexto

Hoje o backend (ou a IA via prompt) decide qual `hook_type` ativar baseado em respostas. A regra de `cobranca` era algo como:

> Se Q19 (forma de cobrança) = "pix_manual" e receita_mensal > 3000

### Substituição

A regra de `iscadigital` é:

> Se profissional tem seguidores no Instagram acima de 1000 (Q21 ou equivalente) **E** ao menos uma das condições:
>
> - Taxa de fechamento baixa (Q17 ∈ "3 a 4", "1 a 2", "não meço") — tem audiência mas converte mal
> - Sem processo de conversão definido (Q14 = "sem_processo")
> - Captação dependente apenas de indicação (Q13 = "indicacao") — falta canal digital ativo

### Hierarquia de prioridade (importante)

A ordem em que os hook_types são avaliados muda, porque `iscadigital` é mais central que era `cobranca`. Sugestão de ordem (a primeira condição que bate vence):

```
1. retencao    — perdeu aluno por evolução (Q22) ou permanência abaixo do benchmark
2. iscadigital — tem audiência (>1000 seguidores) mas converte mal ou depende só de indicação
3. site        — sem site profissional ou apenas Linktree, com audiência
4. captacao    — sem processo + leads chegando mal
5. conversao   — converte muito mal mesmo recebendo interessados
6. gestao      — dados em ≥3 lugares ou >5h/semana em admin
```

### Importante

- Cada ação no top3 tem **no máximo 1 hook_type**
- Hook_types não se repetem entre as 3 ações
- Se nenhuma condição bater para alguma ação, ela vai com `hook_type: null` e é uma recomendação de mercado pura (não puxa o produto)

---

## 3. Catálogo de copy por hook_type (se existir no backend)

Se o backend tiver um dicionário/mapper que define textos default por `hook_type`, atualizar a entrada de `cobranca` para `iscadigital`.

### Estrutura sugerida

```ts
const HOOK_CATALOG: Record<ActionHookType, HookCopy> = {
  // ...
  iscadigital: {
    label_default: 'Transformar seguidores em alunos com formulário inteligente',
    diagnostico_template:
      'Você tem {seguidores} seguidores e capta principalmente por {canal_principal}, ' +
      'mas {taxa_fechamento_inversa} de cada 10 interessados não fecham. ' +
      'Falta um funil que qualifique e eduque o lead antes do contato direto.',
    acao_template:
      'Publicar um formulário inteligente no link da bio do Instagram. ' +
      'O interessado responde 8–12 perguntas sobre objetivo, perfil e rotina, ' +
      'e recebe um relatório personalizado com diagnóstico do treino ideal — ' +
      'apresentando você como a solução natural, com seus planos e depoimentos.',
    impacto_template:
      'Conversão de lead para aluno sobe 2–3x e você só conversa pelo WhatsApp ' +
      'com quem já chegou educado e qualificado.',
    cta_label: 'Ativar formulário inteligente',
  },
  // ... demais hook_types permanecem
}
```

A IA pode reescrever esse texto a partir do template, adaptando para os números reais do profissional. Templates servem como base para garantir tom e mensagem consistente.

---

## 4. Migração de dados existentes (se houver registros gerados)

Se já houver relatórios gerados em `prospect_professionals.report_result` com `hook_type: "cobranca"`, decidir:

- **Opção A — Reescrever:** rodar migration que troca `cobranca` por `iscadigital` + regenera o conteúdo daquela ação
- **Opção B — Deixar como está:** registros antigos continuam com `cobranca`. Frontend precisa aceitar ambos por algum tempo
- **Opção C (recomendada):** ainda é MVP, regenerar os relatórios afetados é mais limpo. Se forem poucos (<20), regenerar manualmente.

---

## 5. Logging e analytics

Se houver logging de `hook_type` em eventos analytics (Pixel, painel interno, `ai_generations`), garantir que o novo valor `iscadigital` está incluído nos enums de eventos.

---

## Itens explícitos que NÃO mudam

- A estrutura geral do edge function `generate-diagnostic`
- O fluxo de upsert em `prospect_professionals`
- O carregamento de prompts do banco (`ai_prompts`)
- A chamada `callAnthropic()` com tool use forçado
- Os outros 5 hook_types (`site`, `captacao`, `conversao`, `gestao`, `retencao`)
- O schema das outras 7 seções do relatório

---

## Checklist de auditoria antes de aplicar

- [ ] Listar todos os arquivos que referenciam o literal `'cobranca'` como hook_type
- [ ] Conferir se há tabela de mapeamento `hook_type → algum metadado` (cor, ícone, label) no frontend
- [ ] Verificar se o schema da tool em `call-anthropic.ts` tem `hook_type` como enum — se sim, atualizar a lista
- [ ] Conferir se o sistema de prompts no banco (`ai_prompts`) menciona `cobranca` em algum lugar
- [ ] Verificar se há testes (unit/integration) que usam `'cobranca'` como fixture
- [ ] Após mudança, rodar uma geração de teste para validar que IA respeita o novo enum

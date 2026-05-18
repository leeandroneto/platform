# Copy — análise + recomendação v2

> **Análise:** 5 superfícies de copy mapeadas (prompt IA, formulário, /lancamento, /comecar, marketing/home).
> **Diagnóstico curto:** copy atual oscila entre "produto pronto" e "sistema completo", quase nunca menciona a posição real ("estamos construindo junto, você é fundador"). Densidade alta — sections longas que diluem o impacto.
> **Proposta:** copy 40-60% menor, tom de co-criação, hierarquia de uma promessa por section.

---

## 1. Diagnóstico do que tem hoje

### 🔴 Problema principal — confusão de posicionamento

A copy atual age como se o produto já estivesse pronto. Frases como:

- _"O sistema de captação, conteúdo, autoridade, conversão, gestão, retenção e escala"_ (`publicFunnel.launch.hero.subtitle`)
- _"Recepção digital que posiciona você"_ (`marketing.hero.subtitle`)
- _"Você vê quem está pronto para converter"_ (`marketing.features.funnelTitle`)
- _"33 templates prontos em 6 modalidades"_ (`launch.products.captacao.line3`)

Esse tom é incoerente com a oferta real do MVP — **30 fundadores, R$27/mês vitalício, beta**. O fundador não está comprando "o sistema completo", está se inscrevendo pra ajudar a construir. Hoje a copy esconde isso.

### 🟡 Problema secundário — densidade alta

`/comecar` tem **16 sections** detalhando cada feature. `publicFunnel.activation` tem **102 chunks de copy >30 chars**. O resultado: prospect lê pouco, perde foco, não chega no CTA.

### 🟢 O que tá bom — manter

- **Personalização com `{firstName}`** no `/comecar` Hero — ótimo, manter
- **Quote do fundador** (`activation.founder.quote`) — voz humana, pessoal, manter
- **Reflexo da experiência** ("o que você acabou de experimentar já funciona") — manter, é insight forte

---

## 2. Princípios da copy v2

| Antes                                                                               | Depois                                                   |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
| "Recepção digital que posiciona você antes da primeira palavra"                     | "Pare de perder leads no Direct"                         |
| "O sistema de captação, conteúdo, autoridade, conversão, gestão, retenção e escala" | "3 passos: preenche, recebe relatório, chega pronto"     |
| "33 templates prontos em 6 modalidades"                                             | "Templates pra musculação, corrida, pilates"             |
| "Você é fundador" (subtle)                                                          | "Você é dos 30 fundadores. Suas escolhas viram features" |

**Regras:**

1. **Hero ≤8 palavras.** Subtítulo ≤2 linhas.
2. **1 promessa por section.** Não enfileirar features.
3. **2ª pessoa direta** ("você"), nunca "o profissional", nunca "este produto".
4. **Beta visível.** Toda página de oferta menciona "30 vagas, R$27 vitalício, ajude a moldar".
5. **Storytelling 3-act:** dor reconhecida → solução em construção → convite pra construir junto.
6. **Sem features inexistentes.** Só fala do que realmente entrega no MVP (form + relatório + WhatsApp + site básico).

---

## 3. Estrutura recomendada — `/lancamento` (público frio)

**Hoje:** 9 sections — Hero, Problem, Method, Pricing, Products (com 7 sub-cards), FAQ, Roadmap, FinalCTA.

**MVP:** 5 sections.

### Section 1 — Hero

```
Eyebrow: BETA · 30 VAGAS
H1: Pare de perder leads no Direct.
Sub: Em 2 minutos, seu futuro aluno preenche um diagnóstico,
     recebe valor real, e chega no seu WhatsApp pronto pra fechar.
CTA: Ver como funciona →
```

### Section 2 — Problema (1 só, não 3)

```
Eyebrow: O QUE TÁ ACONTECENDO
H2: Você responde DM. Eles somem.
Body: Você posta story de treino. Recebe "qual o valor?". Manda.
      Visualizado. Sem resposta. Toda semana, igual.
      O problema não é o seu serviço — é que ninguém chegou pronto.
```

### Section 3 — Como funciona (3 passos visuais)

```
Eyebrow: COMO FUNCIONA
H2: 3 passos. 2 minutos.

[1] Lead preenche um formulário
    Perguntas inteligentes sobre objetivo, rotina, restrições.

[2] IA gera um diagnóstico personalizado
    Ele recebe valor real. Você ganha autoridade antes de falar.

[3] Você recebe no WhatsApp
    Nome, modalidade, resumo. Mensagem pronta pra enviar.
```

### Section 4 — Beta + prova

```
Eyebrow: VOCÊ ESTÁ ENTRE OS 30 PRIMEIROS
H2: Não é produto pronto. É produto sendo construído com 30 personais.
Body: R$27/mês, vitalício. Por enquanto: formulário + relatório IA +
      WhatsApp + site básico. Em 90 dias: o que VOCÊ pedir.

[Foto fundador + quote curta — 1 só]
"Cansei de ver bons profissionais perdendo aluno por falta de funil." — Leandro
```

### Section 5 — CTA final

```
H2: Restam X vagas (contador real)
Body: R$27/mês pra sempre. Cancelamento livre. Você ajuda a moldar.
CTA: Garantir minha vaga →
```

**Cortado:** Roadmap, Pricing detalhado, Method 7-etapas, Products grid, Big FAQ.

---

## 4. Estrutura recomendada — `/comecar` (token-only, máxima conversão)

**Hoje:** 16 sections em `diagnostic-activation/_sections/` (HeroTransfer, MetricsBar, FoundersBetaSection, FormPreview, TemplateSection, SiteSection, DashboardSection, WhatsAppSection, TrafficSection, FounderProof, OfferActivation, AddonsActivation, BetaGroup, CriticalPoint, MidCta, PricingSection).

**MVP:** 6 sections.

### Section 1 — Hero personalizado (manter o `{firstName}`)

```
Eyebrow: {firstName}, BEM-VINDO
H1: O que você acabou de viver é o que seu aluno vai viver.
Sub: Você não acabou de ver um produto. Você acabou de testar.
     Funciona — agora vamos colocar a sua cara.
```

### Section 2 — Reflexo (1 parágrafo, não 3)

```
Você preencheu em 5 minutos. Recebeu um diagnóstico personalizado em 30 segundos.
Sentiu o valor antes de qualquer venda. É exatamente isso que seu {audience} vai sentir
quando preencher o seu formulário.
```

### Section 3 — O que está pronto (4 cards, não 16)

```
H2: Já funciona hoje
[Card 1] Formulário inteligente — 33 templates por modalidade
[Card 2] Relatório IA — gerado em 30s, com valor real pro lead
[Card 3] Notificação WhatsApp — você recebe o lead pronto
[Card 4] Site profissional — sua vitrine + planos + depoimentos
```

### Section 4 — O que vamos construir juntos (NOVA — chave do beta)

```
Eyebrow: VOCÊ É FUNDADOR
H2: O que vem depende de você
Body: Em 90 dias, vamos lançar 3 features. Você vota nas próximas:
      ☐ Treinos automáticos pelo Whats
      ☐ Cobrança recorrente integrada
      ☐ Agenda com lembrete
      ☐ Comunidade entre alunos
      ☐ Sua sugestão...

      Os 30 fundadores definem o futuro. Você ajuda a moldar.
```

### Section 5 — Prova humana (manter founder photo+quote, encolher)

```
[Foto fundador]
"Não é mais um SaaS. É um sistema feito junto com vocês.
 Por isso o preço é vitalício — vocês merecem." — Leandro
```

### Section 6 — Oferta + CTA

```
Eyebrow: BETA VITALÍCIO
H2: R$27/mês — pra sempre.
Sub: Compromisso de 12 meses (R$324 total). Sem reajuste, nunca.
     Quando lançarmos pro mercado, será R$67. Você fica em R$27 pra sempre.

[CTA primário] Garantir minha vaga (X de 30)
[CTA secundário] Falar no WhatsApp antes
```

**Cortado:** TemplateSection, AddonsActivation, TrafficSection, BetaGroup separado, MetricsBar, MidCta extra.

---

## 5. Estrutura recomendada — formulário (microcopy)

**Hoje:** títulos formais maiúsculos ("Quais suas maiores dificuldades HOJE?", "Tem programa de indicação?").

**Proposta:** mais conversacional.

| Hoje                                                | Proposta                                            |
| --------------------------------------------------- | --------------------------------------------------- |
| "Quais suas maiores dificuldades HOJE?"             | "O que mais te trava hoje?"                         |
| "Se pudesse resolver UMA coisa agora, o que seria?" | "Se fosse pra resolver uma coisa hoje, qual seria?" |
| "Qual sua meta de faturamento mensal?"              | "Quanto você quer faturar por mês?"                 |
| "O que você já tentou que não deu certo?"           | "O que você já testou e não deu certo?"             |
| "Tem programa de indicação?"                        | "Você incentiva indicação dos seus alunos?"         |

**Subtítulos:** adicionar onde faltar — 1 frase explicando o "porquê" da pergunta. Ex: _"Sem julgamento. Quanto mais sincero, melhor o relatório."_

**Botões:**

- "Continuar" → "Próxima"
- "Enviar" → "Gerar meu diagnóstico"
- "Voltar" → "Anterior"

---

## 6. Estrutura recomendada — relatório IA (prompt v2)

**Hoje:** prompt em `ai_prompts.generate-diagnostic.system v1` define tom McKinsey, 3ª pessoa pra IA, atos longos (200-600 palavras).

**v2 proposta:**

### Mudanças no system prompt

```
ROLE (atualizar):
Você é um consultor que estuda os dados antes da reunião.
Direto, específico, respeitoso. Fala em 1ª pessoa do consultor
("eu vi que..."), tratando o profissional por "você".

VOICE (apertar):
- Cada ato: máximo 150 palavras.
- Frases curtas. Médias só pra construir argumento.
- 1 número por parágrafo, sempre com contexto.
- Sem jargão de marketing ("funil", "lead nurturing", "buyer persona").
- Sem promessa ("você vai", "garantido", "com certeza").

CONTEXTO BETA (NOVO):
- O profissional acabou de testar o produto na pele.
- Você está fechando o ciclo: "agora você viu como funciona pro seu lead.
  Vamos ver o que isso pode ser pro SEU negócio".
- Não mencione features futuras. Só o que está pronto hoje.

CTA FINAL (NOVO):
- Cada relatório fecha com 1 frase de transição pra /comecar:
  "Continue lendo na próxima página — montamos uma proposta pra você."
```

### Mudanças no schema da tool

- `sumario_executivo`: 200-350 → **120-180 palavras**
- `camada_*` (×5): 400-600 → **150-220 palavras** cada
- `reconhecimento`: 250-400 → **120-180 palavras**
- `plano_acao`: 3 fases × 2-3 ações cada → **2 fases × 2 ações cada** (90 dias é muito pra MVP, focar em 30+30)

### Resultado esperado

- Relatório atual: ~3500 palavras (longo)
- Relatório v2: ~1500 palavras (focado)
- Ganho: leitura de 3min vs 8min — mais conversão pro `/comecar`

---

## 7. Implementação faseada

| Fase                                            | O que                                                  | Esforço | Quem decide           |
| ----------------------------------------------- | ------------------------------------------------------ | ------- | --------------------- |
| **F1** Prompt IA v2                             | UPDATE em `ai_prompts`                                 | 30min   | fundador valida tom   |
| **F2** `/lancamento` reescrito                  | edit `launch/_sections/*` + i18n                       | 2h      | fundador valida copy  |
| **F3** `/comecar` reescrito (sections cortadas) | delete sections + edit i18n                            | 3h      | fundador valida ordem |
| **F4** Formulário microcopy                     | UPDATE em `prospect_questions.title/subtitle` + botões | 1h      | fundador valida tom   |
| **F5** Site `/[slug]` (Wave 16)                 | edit `landing/premium/sections/*`                      | 2h      | fundador valida       |

**Total MVP (F1-F4):** ~6.5h.

---

## 8. Decisões pra fundador validar

- [ ] Tom "co-criação beta" vs "produto pronto" — confirmar
- [ ] Cortar sections: aceitar `/lancamento` 9→5 e `/comecar` 16→6?
- [ ] Quote do fundador: usar a já existente ou reescrever mais curta?
- [ ] Lista de "o que vamos construir juntos" — aprovar opções (treinos auto, cobrança, agenda, comunidade)?
- [ ] Microcopy formulário — aprovar versão conversacional?
- [ ] Encolher relatório IA pra ~1500 palavras — aprovar?

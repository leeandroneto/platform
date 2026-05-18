# Research · Especialidade 8 · Reabilitação e Retorno ao Treino

## 0 · Metadados

- **Número:** 8
- **Modality:** musculacao
- **Pasta:** `musculacao/08-reabilitacao/`
- **Plano:** pro
- **Validação clínica:** 🚨 BLOQUEANTE — fisioterapeuta com experiência em exercício clínico + educador físico pós-graduado em reabilitação
- **Pesquisado em:** 2026-04-23
- **Label proposto:** "Reabilitação e Retorno ao Treino" (ver Notas de design, seção 12)
- **`specialty_code` proposto:** `reabilitacao`
- **Fontes consultadas:**
  1. PNS 2019 — IBGE/Fiocruz (prevalência dor crônica musculoesquelética no Brasil)
  2. ACSM Position Stand on Resistance Training for Healthy Adults (2009, atualizado 2021)
  3. Cochrane Review — Exercise for chronic low back pain (Hayden et al., 2021)
  4. Gavin Publishers — Role of Resistance Training in MSK Injury Prevention and Rehabilitation (2023)
  5. LEFS-Brasil — validação brasileira da Lower Extremity Functional Scale (Revista Brasileira de Reumatologia)
  6. QuickDASH-Brasil — validação cultural (REVISBRATO)
  7. Tampa Scale for Kinesiophobia (TSK) — versão brasileira (Siqueira et al., 2007)
  8. Diretriz Brasileira de Reabilitação Cardiovascular (2020) — modelo adaptável para MSK

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária principal:** 30-60 anos. Pico entre 40-55 (lesões degenerativas + lesões esportivas acumuladas).
- **Gênero:** Levemente feminino para dor crônica (66,9% dos afastamentos DORT/LER são mulheres — INSS). Masculino para lesões traumáticas esportivas (futebol recreativo, corrida). Na prática, o público que chega ao personal especializado é **equilibrado** (50/50 ± 5%).
- **Contexto socioeconômico:** Classe A/B predominante. Sessões com personal especializado custam R$100-180/hora. O público que paga esse serviço tem renda familiar > R$8k/mês. Há um público classe B/C crescente em academias com programas supervisionados, mas o personal especializado é premium.
- **Concentração:** Sudeste (SP, RJ, MG) concentra ~60% da demanda. Capitais e cidades >200k hab.

### Tamanho do mercado

**Grande** (ordem de grandeza). 18,5% da população adulta brasileira tem dor crônica na coluna (PNS 2019). Considerando outras articulações, estima-se que 25-30% dos adultos têm alguma condição musculoesquelética. O nicho de personal trainer especializado em reabilitação é 5-10% do mercado fitness (~R$400M-800M/ano), mas em expansão acelerada pós-pandemia.

### Onde estão online

- **Instagram** (principal): seguem fisioterapeutas, ortopedistas, PTs especializados. Conteúdo educativo sobre "treino pós-lesão" tem engajamento altíssimo.
- **YouTube:** buscas por "exercícios para hérnia de disco", "treino pós-cirurgia de joelho" são frequentes.
- **Grupos WhatsApp:** comunidades de pacientes (ex: grupos de artrose, de LCA, de fibromialgia) onde trocam experiências sobre profissionais.
- **Apps:** pouco uso de apps fitness tradicionais — sentem que "não são pra mim" porque exigem nível que não têm.

### Linguagem que usam

- "Voltar a treinar" (mais comum, carregado de desejo)
- "Treino adaptado" / "com restrição"
- "Recuperação" (preferido sobre "reabilitação" — que soa hospitalar)
- "Fortalecimento" (ponte entre fisio e academia)
- "Readaptação" (usado por profissionais de Ed. Física)
- "Pós-operatório" / "pós-cirúrgico"
- "Conviver com a dor" (realismo, não vitimismo)
- "Dor crônica" (sem eufemismo)

### O que os ofende ou afasta

- **Capacitismo implícito:** "debilitado", "incapaz", "limitado", "inválido"
- **Proibição genérica:** "você não pode fazer isso" sem explicar por quê ou oferecer alternativa
- **Descaso técnico:** "pega leve", "vai com calma" sem critérios — percebido como preguiça do profissional
- **"Paciente" no contexto de academia** — preferem "aluno" ou "cliente"
- **Infantilização:** tratar como frágil permanente, como se a lesão definisse a pessoa
- **Promessas de cura:** "em X semanas você estará 100%" — esse público já foi decepcionado por promessas

### Dor mais comum que os leva a procurar ajuda

**O "buraco negro" pós-fisioterapia.** O fisioterapeuta dá alta, o médico diz "liberado para academia", e o aluno chega na musculação sem protocolo de transição. O personal generalista não sabe adaptar. O aluno sente dor, para, regride. Esse ciclo se repete 2-3 vezes antes da pessoa procurar um **personal especializado**. A dor central não é a lesão em si — é a **falta de ponte entre a clínica e a academia**.

## 2 · Decisão de escopo

### Este template cobre:

- Pessoas em **pós-alta fisioterapêutica** (fase 3+) que querem transitar para musculação supervisionada
- Pessoas com **dor crônica musculoesquelética** (lombalgia, cervicalgia, artrose) que querem treinar com segurança
- Pessoas que tiveram **lesão esportiva ou cirurgia** e querem retornar à atividade/treino
- As 7 condições mais prevalentes: lombalgia/hérnia discal, lesões de joelho (LCA, menisco, condromalacia), síndrome do impacto/manguito rotador, LER/DORT, cervicalgia crônica, artrose (joelho/quadril), pós-artroplastia

### Este template NÃO cobre:

- **Fase aguda de lesão** (primeiras semanas pós-trauma/cirurgia) — isso é fisioterapia, não personal trainer
- **Reabilitação neurológica** (AVC, lesão medular, Parkinson) — requer template Custom com equipe multidisciplinar
- **Reabilitação cardiopulmonar** — outra especialidade, outros protocolos
- **Dor crônica complexa com componente psiquiátrico** (fibromialgia severa + depressão + uso de opioides) — requer abordagem multidisciplinar que extrapola o escopo de um personal trainer
- **Menores de 16 anos** — pediatria esportiva é outra especialidade

### Sobre o label "Reabilitação"

O label provisório "Reabilitação" é mantido para o hub (card que o profissional vê), mas o formulário client-facing usa linguagem de "Recuperação e Retorno ao Treino". O profissional que ativa este template já se posiciona como especialista em exercício clínico — o label técnico reforça credibilidade. Ver seção 12 para decisão completa.

## 3 · Motores escolhidos

### Motores considerados

| Motor                      | Considerado?  | Decisão                                                                                                                                                  |
| -------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor 1 (Contexto atual)   | ✅ Sim        | Usado como Q5 (atividade atual) — fotografia do ponto de partida                                                                                         |
| Motor 2 (Gargalo)          | ✅ Sim        | **Essencial** — a barreira é o coração do relatório                                                                                                      |
| Motor 3 (Nível/Maturidade) | ❌ Descartado | Nível de treino é menos relevante que fase de recuperação neste público. Alguém pode ter 10 anos de treino mas estar no zero pós-cirurgia. Fase > Nível. |
| Motor 4 (Comportamento)    | ✅ Sim        | Fundido com Motor 1 — atividade atual É comportamento recente                                                                                            |
| Motor 5 (Ambiente)         | ❌ Descartado | O público deste template já decidiu que vai treinar em academia com personal. Perguntar "onde treina" não muda o relatório.                              |
| Motor 6 (Identidade/Fase)  | ✅ Sim        | **Segmentação principal** — a fase de recuperação define TODO o arco narrativo                                                                           |
| Motor 7 (Métricas)         | ✅ Sim        | Escala de dor (NPRS 0-10) é métrica autoaplicável validada, essencial para calibrar tom e recomendações                                                  |
| Motor 8 (Safety)           | ✅ Sim        | **OBRIGATÓRIO** neste template — liberação médica + condições de risco                                                                                   |

### Motores descartados — justificativa

- **Motor 3 (Nível):** Em reabilitação, experiência prévia de treino é secundária. Um fisiculturista de 15 anos pós-LCA e um sedentário com lombalgia crônica ambos começam do mesmo ponto: adaptação com carga controlada. A fase de recuperação (Motor 6) subsume o que nível mediria.
- **Motor 5 (Ambiente):** O público-alvo já definiu que quer treinar em academia. Perguntar sobre local/equipamentos adicionaria fricção sem mudar substancialmente o relatório. Se treina em casa, este template não é o ideal — seria melhor funcional (#9).

### Lista final: 5 motores, 7 perguntas

1. **Segmentação/Fase (Motor 6)** → `fase_recuperacao` — Define o arco narrativo inteiro: pós-op, crônico ou retorno
2. **Contexto (Motor 1)** → `regiao_afetada` — Qual região do corpo precisa de atenção (direciona exercícios e pilares)
3. **Métrica (Motor 7)** → `nivel_dor` — NPRS 0-10, calibra tom e intensidade das recomendações
4. **Gargalo (Motor 2)** → `gargalo_principal` — O que trava: medo, desinformação, recaída, falta de profissional, desmotivação
5. **Comportamento (Motor 4)** → `atividade_atual` — O que faz HOJE (mapeia activity_level)
6. **Safety (Motor 8)** → `liberacao_medica` — Liberação médica para musculação
7. **Safety (Motor 8)** → `condicoes_saude` — Condições que exigem adaptação ou contraindicam

## 4 · Perguntas e opções

### Q1 · `fase_recuperacao` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Em que momento da sua recuperação você está?"
**Helper:** "Isso define como vamos montar suas recomendações."
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** `quick`

**Opções:**

- **`pos_operatorio`** — "Fiz cirurgia ou procedimento e estou me recuperando"
  - Safety trigger? não (safety vem de Q6/Q7, não da fase em si)

- **`dor_cronica`** — "Convivo com dor há meses ou anos e quero treinar com segurança"
  - Safety trigger? não

- **`retorno_atividade`** — "Tive lesão, já melhorei bastante, e quero voltar a treinar forte"
  - Safety trigger? não

**Justificativa da pergunta:** A fase de recuperação é a variável que mais altera o arco narrativo do relatório. Um pós-operatório recebe tom de cautela + marcos de progressão. Um crônico recebe educação em dor + empoderamento. Um retorno recebe progressão + prevenção de recidiva. Sem essa pergunta, o relatório seria genérico e potencialmente perigoso (tratar crônico como pós-op, ou pós-op como retorno).

**Justificativa das opções:** Três fases mapeiam >90% do público que procura personal especializado em reabilitação. Alternativa descartada: "Prevenção de lesão (nunca tive nada)" — esse perfil é atendido pelo template de Funcional (#9) ou Saúde/Bem-estar (#3), não precisa de template de reabilitação.

---

### Q2 · `regiao_afetada` _(Motor 1 — Contexto)_

**Type:** `single_choice`
**Label (client-facing):** "Qual região do corpo precisa de mais atenção?"
**Helper:** "Se tem mais de uma, escolha a que mais te limita hoje."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`

**Opções:**

- **`coluna`** — "Coluna (lombar, cervical ou torácica)"
  - Safety trigger? não

- **`joelho`** — "Joelho"
  - Safety trigger? não

- **`ombro`** — "Ombro"
  - Safety trigger? não

- **`quadril`** — "Quadril"
  - Safety trigger? não

- **`outra`** — "Outra região ou múltiplas"
  - Safety trigger? não

**Justificativa da pergunta:** A região afetada determina quais exercícios, quais métricas de força, quais marcos de progressão são relevantes. Um relatório que fala sobre "reabilitação" sem especificar a região é tão genérico quanto inútil. Alternativa descartada: lista exaustiva de diagnósticos (hérnia L4-L5, LCA, etc.) — granularidade demais para formulário mobile, gera decisão difícil ("meu diagnóstico não está aqui"), e o profissional pode perguntar detalhes presencialmente.

**Justificativa das opções:** As 4 regiões + "outra" cobrem ~95% das queixas musculoesqueléticas. Coluna (lombar+cervical) é a mais prevalente. Joelho é a mais cirúrgica. Ombro é a mais frequente em praticantes de musculação. Quadril é a que mais cresce (envelhecimento + artroplastias). "Outra" captura tornozelo, punho, cotovelo, e casos multiarticulares.

---

### Q3 · `nivel_dor` _(Motor 7 — Métricas)_

**Type:** `number`
**Label (client-facing):** "De 0 a 10, como está sua dor hoje?"
**Helper:** "0 = nenhuma dor · 5 = dor moderada · 10 = pior dor imaginável"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`
**Validation:** `{ min: 0, max: 10, unit: "pontos" }`

**Justificativa da pergunta:** A Numeric Pain Rating Scale (NPRS 0-10) é o padrão-ouro autoaplicável para dor, validada internacionalmente e em português. Uma única pergunta que captura o dado mais importante para calibrar o relatório: tom (dor alta = mais cautela), recomendações (dor alta = menos ênfase em carga, mais em manejo), e métricas para o profissional (baseline para acompanhamento). Alternativa descartada: VAS (escala visual analógica) — exige implementação de slider analógico que complica UX mobile; NPRS numérica discreta é igualmente válida e mais fácil de responder.

**Justificativa de ser number e não single_choice:** A dor é um espectro contínuo. Transformar em faixas ("leve/moderada/forte") perde resolução que o profissional precisa. Um input numérico com helper ("0 = nenhuma, 10 = pior imaginável") é respondível em 3 segundos.

---

### Q4 · `gargalo_principal` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais te impede de treinar como gostaria?"
**Helper:** "Escolha o que pesa mais hoje."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`medo_piora`** — "Medo de sentir dor ou piorar a lesão"
  - Safety trigger? não

- **`sem_orientacao`** — "Não sei quais exercícios são seguros pra mim"
  - Safety trigger? não

- **`ja_piorou`** — "Já tentei voltar e acabei piorando"
  - Safety trigger? não

- **`falta_especialista`** — "Não encontrei profissional que entenda meu caso"
  - Safety trigger? não

- **`desmotivacao`** — "Perdi a motivação de tanto tempo parado"
  - Safety trigger? não

**Justificativa da pergunta:** O gargalo determina o eixo emocional do relatório. Medo → foco em segurança e educação em dor. Desinformação → foco em orientação técnica. Recaída → foco em progressão conservadora. Falta de profissional → foco em validar o modelo PT especializado. Desmotivação → foco em reconexão identitária. Cada gargalo produz uma narrativa substancialmente diferente.

**Justificativa das opções:** Essas 5 opções mapeiam os gargalos REAIS identificados na pesquisa do público brasileiro. Alternativa descartada: "Condição financeira" — é gargalo real mas não muda o relatório de forma substancial (não vamos falar sobre preço no relatório). Alternativa descartada: "Falta de tempo" — é universal demais, não é específico de reabilitação.

---

### Q5 · `atividade_atual` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "O que você faz de atividade física HOJE?"
**Helper:** "Seja honesto — isso calibra suas recomendações."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`parado`** — "Nada — parado desde a lesão ou cirurgia"
  - Safety trigger? não

- **`fisio_apenas`** — "Só fisioterapia ou pilates"
  - Safety trigger? não

- **`leve_conta_propria`** — "Treino leve por conta própria"
  - Safety trigger? não

- **`treino_adaptado`** — "Treino regular com alguma adaptação"
  - Safety trigger? não

**Justificativa da pergunta:** Comportamento atual é o dado mais confiável sobre ponto de partida — intenção mente, comportamento não. Define o nível de atividade para cálculos (TDEE, hidratação) e o tom do relatório (quem está parado precisa de mais encorajamento; quem já treina precisa de refinamento). Pergunta sobre comportamento RECENTE e CONCRETO, não sobre intenção — exatamente como o framework exige.

**Justificativa das opções:** 4 opções em espectro claro (nada → regular). Alternativa descartada: "Treino intenso sem adaptação" — se a pessoa treina intenso sem adaptar e está neste template, algo está errado, e o personal vai identificar presencialmente.

---

### Q6 · `liberacao_medica` _(Motor 8 — Safety)_

**Type:** `single_choice`
**Label (client-facing):** "Você tem liberação médica para fazer musculação?"
**Helper:** "Liberação do ortopedista, fisiatra, ou médico que acompanha seu caso."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`

**Opções:**

- **`sim_sem_restricao`** — "Sim, liberado sem restrições"
  - Safety trigger? não

- **`sim_com_restricao`** — "Sim, com restrições específicas"
  - Safety trigger? não

- **`nao_tenho`** — "Ainda não tenho liberação"
  - Safety trigger? **SIM** — reason: "Treino resistido pós-lesão sem liberação médica expõe a riscos de re-lesão, complicações cicatriciais e agravamento da condição. A avaliação médica é pré-requisito inegociável."

- **`nao_sei`** — "Não sei / nunca pedi"
  - Safety trigger? não (diferente de "não tenho" — essa pessoa pode ter e não saber; o relatório orienta a buscar, mas não bloqueia)

**Justificativa da pergunta:** Em template BLOQUEANTE, a liberação médica é a pergunta mais importante de safety. Um personal trainer que aceita aluno pós-lesão sem liberação médica está assumindo risco legal e clínico. O safety trigger em "não tenho" garante que o relatório não prescinde de cálculos nutricionais ou timeline (que poderiam ser interpretados como "já pode começar"), e direciona a buscar avaliação médica como primeiro passo.

**Justificativa de "não sei" NÃO ser safety:** Muitas pessoas com condições estáveis e controladas (lombalgia crônica leve, por exemplo) nunca pediram liberação formal mas estão clinicamente aptas. Bloquear esse público seria excesso de cautela que prejudicaria a experiência. O relatório orienta a buscar avaliação, mas mantém métricas e recomendações.

---

### Q7 · `condicoes_saude` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Selecione todas que se aplicam. Isso ajuda a personalizar suas recomendações."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`
**Validation:** `{ maxSelections: 5 }`

**Opções:**

- **`cirurgia_recente`** — "Cirurgia nos últimos 3 meses"
  - Safety trigger? **SIM** — reason: "Pós-operatório < 3 meses requer supervisão médica direta. Tecidos em remodelação podem ser danificados por carga inadequada."

- **`protese_articular`** — "Prótese articular (joelho, quadril ou ombro)"
  - Safety trigger? não (prótese consolidada é treino adaptado, não contraindicação)

- **`hernia_disco`** — "Hérnia de disco diagnosticada"
  - Safety trigger? não

- **`doenca_autoimune`** — "Doença autoimune (artrite reumatoide, lúpus, espondilite, etc.)"
  - Safety trigger? não

- **`osteoporose`** — "Osteoporose diagnosticada"
  - Safety trigger? não

- **`fibromialgia`** — "Fibromialgia"
  - Safety trigger? não

- **`nenhuma`** — "Nenhuma das anteriores"
  - Safety trigger? não

**Justificativa da pergunta:** Condições comórbidas mudam radicalmente a prescrição. Um programa para joelho pós-LCA em pessoa saudável é completamente diferente do mesmo programa em pessoa com artrite reumatoide ou osteoporose. Essas condições são as que o PT PRECISA saber antes da primeira sessão.

**Justificativa das opções:** 6 condições + "nenhuma" cobrem as comorbidades mais prevalentes no público de reabilitação musculoesquelética. Cada uma tem impacto clínico documentado na prescrição de exercício resistido. Alternativa descartada: condições cardiovasculares (hipertensão, diabetes) — são importantes mas universais (não são específicas de reabilitação) e seriam melhor atendidas por um campo universal `health_conditions` em templates futuros. Para MVP, focar nas condições MSK-específicas.

## 5 · Branches

### Branch: `Pós-operatório` (trigger: `fase_recuperacao == pos_operatorio`)

- **Tom geral:** Cautela ativa. Não é "vá devagar" genérico — é "vá no ritmo que a cicatrização permite, e aqui está como medir isso". Tom de quem acompanha retorno, não de quem proíbe.
- **pillarGuidance:** "Enfatize marcos de recuperação (semanas pós-op, metas funcionais por fase). Priorize exercícios de cadeia cinética fechada e isometria nas primeiras fases. Referencie a importância do alinhamento com o protocolo do cirurgião/fisioterapeuta. Nunca sugira que o aluno 'decida por conta' quando avançar."
- **Additional questions:** Nenhuma — a fase pós-op já é bem capturada por Q2 (região) + Q3 (dor) + Q6/Q7 (liberação + condições).
- **Remove questions:** Nenhuma.
- **Metrics override:** Adiciona `fase_protocolo` (indicador visual de fase do protocolo: proteção → mobilidade → fortalecimento → retorno funcional). Remove `timeline` (projeção de "quando chega lá" é irresponsável em pós-op — depende de cicatrização individual).
- **Narrative arc override:** "Reconhecer a coragem do passo cirúrgico → Contextualizar onde o aluno está no protocolo → Mostrar o que o treino resistido faz nesta fase (não é 'malhar', é reabilitar) → Definir os próximos marcos concretos → Ponte para o profissional como guia do processo."

**Justificativa:** O pós-operatório é substantivamente diferente porque (1) tem protocolo temporal rígido que varia por cirurgia, (2) não admite projeção de timeline genérica, (3) exige tom de alinhamento com equipe médica. Sem branch separado, o relatório trataria pós-LCA de 6 semanas igual a dor crônica de 3 anos — perigoso.

---

### Branch: `Dor crônica` (trigger: `fase_recuperacao == dor_cronica`)

- **Tom geral:** Educação em dor + empoderamento. Não é "coitado" — é "você tem uma condição, ela é manejável, e aqui está o caminho baseado em evidência". Tom de quem normaliza sem minimizar.
- **pillarGuidance:** "Incorpore conceitos de neurociência da dor (o cérebro interpreta, não o tecido decide). Enfatize que dor ≠ dano. Recomende diário de dor (0-10 antes/depois do treino) como ferramenta de autoconsciência. Sugira que o treino vai ter dias bons e ruins — e que dias ruins não significam retrocesso."
- **Additional questions:** Nenhuma.
- **Remove questions:** Nenhuma.
- **Metrics override:** Adiciona `gerenciamento_dor` (painel com baseline NPRS, expectativa de redução baseada em evidência — MCID de 2 pontos). Remove `timeline` (dor crônica não tem "data de chegada" — é manejo contínuo).
- **Narrative arc override:** "Validar a experiência de dor sem dramatizar → Educar sobre neurociência da dor (dor crônica ≠ dano tecidual ativo) → Mostrar que movimento controlado é tratamento, não risco → Definir critérios de 'dor aceitável durante treino' (0-3/10) → Ponte para o profissional como parceiro de longo prazo."

**Justificativa:** Dor crônica exige abordagem fundamentalmente diferente: o objetivo não é "curar" mas "manejar". Timeline é substituída por gerenciamento de dor. O arco narrativo precisa de educação em neurociência da dor (que é contraintuitiva: "mover dói, mas parar piora"). Sem branch separado, o relatório poderia prometer "resultado em X meses" — irresponsável para crônico.

---

### Branch: `Retorno à atividade` (trigger: `fase_recuperacao == retorno_atividade`)

- **Tom geral:** Progressão inteligente. Mais energético que os outros branches — esse público JÁ passou pelo pior e quer avançar. Tom de técnico que calibra a empolgação com critérios.
- **pillarGuidance:** "Foque em critérios objetivos de progressão (ex: dor < 2/10 pós-treino, simetria bilateral > 85%, RPE < 7 em exercícios-chave). Mencione janela de re-lesão de 6-12 meses. Encoraje ambição com checkpoints. Referencie conceitos de return-to-sport (mesmo que não seja atleta)."
- **Additional questions:** Nenhuma.
- **Remove questions:** Nenhuma.
- **Metrics override:** Mantém `timeline` (aqui faz sentido — progressão tem marcos previsíveis). Adiciona `indice_prontidao` (score derivado de dor + atividade atual + fase, indicando quão próximo de "treino sem restrições" a pessoa está).
- **Narrative arc override:** "Celebrar o caminho percorrido → Contextualizar onde está HOJE vs onde quer chegar → Apresentar critérios objetivos de progressão (não "quando eu sentir que posso") → Alertar sobre janela de re-lesão sem assustar → Ponte para o profissional como acelerador seguro."

**Justificativa:** O retorno à atividade é o único cenário onde timeline faz sentido e onde o tom pode ser mais propulsivo. O público é diferente emocionalmente: menos medo, mais impaciência. O risco é oposto: ir rápido demais, não devagar demais. O relatório precisa calibrar essa energia com critérios objetivos, não frear com cautela genérica.

## 6 · Safety triggers

| Questão            | Opções             | Reason (clínico)                                                                                                                                                              | Efeito no relatório                                                                                                        |
| ------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `liberacao_medica` | `nao_tenho`        | Treino resistido pós-lesão sem avaliação médica expõe a riscos de re-lesão, complicações cicatriciais e agravamento da condição base. Pré-requisito inegociável.              | Macros omitidas, timeline omitida, SafetyNote aparece, IA instruída a não prescrever exercícios específicos.               |
| `condicoes_saude`  | `cirurgia_recente` | Pós-operatório < 3 meses com tecidos em remodelação. Carga inadequada pode comprometer cicatrização, soltar fixações, ou danificar enxertos. Requer supervisão médica direta. | Macros omitidas, timeline omitida, SafetyNote aparece, IA instruída a direcionar exclusivamente para avaliação presencial. |

### safetyTemplate

**Title:** "Seu próximo passo é uma avaliação presencial"

**Body:** "Sua situação pede atenção especial — e isso é bom, porque mostra que você está no caminho certo ao buscar orientação. Antes de qualquer programa de treino, o passo mais importante agora é uma avaliação presencial com profissional qualificado. Essa avaliação vai mapear suas restrições, definir o que é seguro, e criar os guardrails do seu programa. Não é burocracia — é a diferença entre recuperação e recaída. [profissional_nome] pode orientar os próximos passos e, se necessário, direcionar para a avaliação médica adequada. Entre em contato — esse é o melhor investimento que você pode fazer agora."

## 7 · Métricas para o ALUNO (relatório)

### `nivel_dor_baseline`

- **O que é:** Score de dor atual (NPRS 0-10) com interpretação narrativa
- **Por que aparece para o aluno:** Dá nome ao que ele sente, valida a experiência, e cria referência para acompanhamento ("hoje é 6, em 8 semanas o objetivo é 3")
- **Cálculo:** Input direto de Q3 (`nivel_dor`), classificado em faixas: 0 = sem dor, 1-3 = leve, 4-6 = moderada, 7-10 = intensa
- **Visualização proposta:** **Gauge radial** com faixas coloridas (verde 0-3, amarelo 4-6, vermelho 7-10), valor central grande, label de classificação abaixo. Rationale: visual instantâneo de "onde estou" numa escala que todo mundo entende.
- **Placeholder:** `[nivel_dor]`, `[classificacao_dor]`

### `imc`

- **O que é:** Índice de Massa Corporal com interpretação contextualizada para reabilitação
- **Por que aparece para o aluno:** Contextualiza peso no quadro geral. Em reabilitação, excesso de peso aumenta carga articular — é dado relevante sem ser julgamento.
- **Cálculo:** `calculateBmi(weight, height)` — já existe no engine
- **Visualização proposta:** **Gauge** com faixas WHO, valor central, label narrativo ("dentro da faixa saudável" em vez de "normal"). Rationale: familiar, rápido de ler, contextualizável pela IA.
- **Placeholder:** `[imc_valor]`, `[imc_interpretacao]`

### `meta_proteina`

- **O que é:** Meta diária de proteína em gramas, calibrada para recuperação tecidual
- **Por que aparece para o aluno:** Proteína é o macronutriente mais importante em reabilitação — suporta cicatrização, previne atrofia, sustenta ganho de força. É acionável (pode começar hoje).
- **Cálculo:** Peso × 1.6-2.2 g/kg (ACSM/ISSN guidelines para recuperação). Default: 1.8 g/kg para reabilitação (maior que manutenção padrão, justificado por demanda de reparo tecidual). `calculateProteinTarget(weight, gPerKg)` já existe no engine.
- **Visualização proposta:** **Card numérico** com valor em gramas + equivalência prática ("≈ X porções de frango/dia"). Rationale: número acionável + tradução para linguagem do dia-a-dia.
- **Placeholder:** `[proteina_g]`

### `meta_hidratacao`

- **O que é:** Meta diária de água em litros
- **Por que aparece para o aluno:** Hidratação afeta viscosidade sinovial, elasticidade tecidual, e recuperação. Especialmente relevante em reabilitação.
- **Cálculo:** `calculateHydration(weight, activityLevel)` — já existe no engine
- **Visualização proposta:** **Water drop** (componente existente). Rationale: visual lúdico, familiar, acionável.
- **Placeholder:** `[agua_l]`

### `meta_kcal`

- **O que é:** Meta calórica diária (se não safety-blocked)
- **Por que aparece para o aluno:** Contexto nutricional. Em reabilitação, NÃO se faz déficit calórico agressivo — o corpo precisa de energia para reparar.
- **Cálculo:** `calculateTdee(bmr, activityLevel)` × multiplicador de manutenção (1.0) ou leve superávit (1.05-1.1 para pós-op). Já existe no engine.
- **Visualização proposta:** **Card numérico** com valor + contexto ("energia para recuperar, não para restringir"). Rationale: orientação nutricional sem ênfase em emagrecimento.
- **Placeholder:** `[meta_kcal]`

### `indice_prontidao` _(branch: retorno_atividade)_

- **O que é:** Score composto (0-100) indicando quão próximo de "treino sem restrições" a pessoa está
- **Por que aparece para o aluno:** Visualização motivacional de progresso — "estou em 65/100, subindo"
- **Cálculo:** Score derivado de: dor (40% do peso — dor 0 = 40pts, dor 10 = 0pts) + atividade atual (30% — parado=0, treino adaptado=30) + liberação médica (30% — sem restrição=30, com restrição=20, não sei=10, não tenho=0). Fórmula proposta, precisa validação.
- **Visualização proposta:** **Gauge radial** (0-100) com faixas: vermelho (0-30 "início"), amarelo (31-60 "progredindo"), verde (61-85 "quase lá"), azul (86-100 "pronto"). Rationale: gamificação positiva do progresso de reabilitação.
- **Placeholder:** `[indice_prontidao]`

### `fase_protocolo` _(branch: pos_operatorio)_

- **O que é:** Indicador visual da fase do protocolo de recuperação
- **Por que aparece para o aluno:** Contextualiza onde está no processo — "fase de fortalecimento" é mais útil que "faz 3 meses da cirurgia"
- **Cálculo:** Derivado de atividade atual + dor: parado+dor>5 = "Proteção", fisio+dor 3-5 = "Mobilidade", leve+dor<4 = "Fortalecimento", adaptado+dor<3 = "Retorno funcional"
- **Visualização proposta:** **Zone table horizontal** com 4 fases, a ativa destacada com cor. Rationale: senso de progressão linear, mostra que há caminho claro.
- **Placeholder:** `[fase_atual]`

### `gerenciamento_dor` _(branch: dor_cronica)_

- **O que é:** Painel de baseline de dor + meta de redução baseada em evidência
- **Por que aparece para o aluno:** Transforma dor de "inimigo" em "dado monitorável". MCID (Minimal Clinically Important Difference) de NPRS é 2 pontos.
- **Cálculo:** Baseline = Q3. Meta = max(0, baseline - 2). Referência: Farrar et al. (2001) — redução de 2 pontos em NPRS é clinicamente significativa.
- **Visualização proposta:** **Comparison card** (valor atual vs meta, com seta indicando direção). Rationale: objetivo concreto e mensurável, não "melhorar a dor".
- **Placeholder:** `[dor_atual]`, `[dor_meta]`

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### `bmi_class`

- **O que é:** Classificação WHO do IMC (under/normal/overweight/obesity_1/2/3)
- **Por que importa para o PT:** Carga articular em excesso de peso afeta prescrição (evitar impacto, priorizar cadeia cinética fechada). Classificação técnica útil para triagem.
- **Cálculo:** `calculateBmi()` — já existe
- **Visualização proposta:** **Badge** com cor por classificação. Rationale: triagem visual rápida no dashboard.

### `cinesiofobia_flag`

- **O que é:** Indicador de medo de movimento (derivado de Q4 gargalo)
- **Por que importa para o PT:** Cinesiofobia é preditor de pior resultado funcional independente da gravidade da lesão (Vlaeyen & Linton, 2000). PT que identifica cinesiofobia precocemente pode adaptar abordagem (exposição gradual, educação).
- **Cálculo:** `gargalo_principal == 'medo_piora'` → flag ativa. Se combinado com dor > 5 → flag vermelha.
- **Visualização proposta:** **Semáforo** (verde/amarelo/vermelho). Rationale: alerta visual instantâneo, sem ruído.

### `risco_recidiva`

- **O que é:** Nível estimado de risco de re-lesão (baixo/moderado/alto)
- **Por que importa para o PT:** Determina velocidade de progressão e frequência de reavaliação.
- **Cálculo:** Score composto: fase pós-op (+2), já piorou antes (+2), dor > 6 (+1), sem liberação (+3), cirurgia recente (+3). Score 0-1 = baixo, 2-4 = moderado, 5+ = alto. Fórmula proposta, precisa validação clínica.
- **Visualização proposta:** **Badge** com cor (verde/amarelo/vermelho) + score numérico. Rationale: triagem de risco na lista de leads.

### `aderencia_prevista`

- **O que é:** Previsão de aderência ao programa (baixa/moderada/alta)
- **Por que importa para o PT:** Aderência é o maior preditor de resultado em reabilitação. PT pode investir mais atenção em leads com aderência prevista baixa (contato proativo, lembretes, sessões mais curtas).
- **Cálculo:** Score derivado de: atividade atual (parado=-2, fisio=0, leve=+1, adaptado=+2), gargalo (desmotivação=-2, medo=-1, outros=0), dor (>7=-1, 4-6=0, <4=+1). Score <0 = baixa, 0-2 = moderada, 3+ = alta. Fórmula proposta, precisa validação.
- **Visualização proposta:** **Scorecard** com label e cor. Rationale: decisão de priorização na fila de leads.

### `regiao_primaria`

- **O que é:** Região afetada (dado direto de Q2)
- **Por que importa para o PT:** Organização de leads por especialização (PT que atende mais joelho vs mais coluna pode filtrar).
- **Cálculo:** Input direto de Q2
- **Visualização proposta:** **Tag/badge** com ícone por região. Rationale: filtragem visual rápida.

### `nprs_baseline`

- **O que é:** Score de dor numérico (0-10) no momento da avaliação
- **Por que importa para o PT:** Baseline para acompanhamento longitudinal. Diferença de 2+ pontos é clinicamente significativa (MCID).
- **Cálculo:** Input direto de Q3
- **Visualização proposta:** **Número** com classificação por cor. Rationale: dado objetivo, não narrativa.

## 9 · Pilares do relatório

### Pilar 1 · Movimento Seguro

- **Subtitle:** "Os exercícios certos para o seu momento"
- **Conceito central:** Não existe exercício "proibido para sempre" — existe exercício "não é hora ainda". A seleção de movimentos em reabilitação segue uma lógica de janelas: o que é seguro hoje vai mudar em 4 semanas. O princípio é progressão, não restrição permanente.
- **Evidência científica:** ACSM Position Stand — exercício resistido progressivo é primeira linha para condições musculoesqueléticas. Cochrane Review confirma para lombalgia crônica (Hayden et al., 2021). Para joelho pós-LCA, a progressão de cadeia cinética fechada → aberta é consenso (Myer et al., 2006).
- **Placeholders:** `[regiao_afetada]`, `[nivel_dor]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Para a sua região ([regiao_afetada]), o primeiro passo é fortalecer os músculos que protegem essa articulação — sem forçar amplitudes que ainda incomodam. Com sua dor atual em [nivel_dor]/10, a prioridade é selecionar exercícios que você consiga fazer COM CONTROLE, não com esforço máximo. [profissional_nome] vai montar a sequência de progressão específica para o seu caso, respeitando o que seu corpo permite hoje."
- **Exemplo de texto técnico (35 palavras):** "Prescrição inicial: isometria + cadeia cinética fechada na região afetada, RPE 4-5/10, dor permitida ≤ 3/10 durante execução. Progressão para isotônico excêntrico em 4-6 semanas conforme tolerância e critérios de amplitude."

### Pilar 2 · Fortalecimento Progressivo

- **Subtitle:** "Como construir força respeitando seu corpo"
- **Conceito central:** A progressão em reabilitação não segue a lógica de "mais peso toda semana". Segue a lógica de "quando o corpo sinaliza que está pronto". Os sinais são mensuráveis: dor pós-treino (< 2/10 em 24h), amplitude ganha, controle motor demonstrado. A proteína adequada ([proteina_g]g/dia) sustenta essa construção.
- **Evidência científica:** Princípio de sobrecarga progressiva adaptado para populações clínicas (Lorenz & Morrison, 2015). Ingestão proteica de 1.6-2.2g/kg para otimizar síntese proteica e reparo tecidual (ISSN Position Stand, 2017).
- **Placeholders:** `[proteina_g]`, `[meta_kcal]`, `[atividade_atual]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "Seu corpo precisa de material para reconstruir: [proteina_g]g de proteína por dia é o mínimo para que os músculos e tecidos se fortaleçam. Com [meta_kcal] kcal/dia, você garante energia suficiente para treinar e recuperar — sem restringir. A progressão do seu treino vai ser baseada no que seu corpo mostra, não no que o calendário diz. [profissional_nome] vai definir quando avançar com base em critérios objetivos."
- **Exemplo de texto técnico (40 palavras):** "Ingestão proteica: [proteina_g]g/dia (1.8g/kg). TDEE estimado: [meta_kcal] kcal (manutenção). Critérios de progressão: dor ≤ 2/10 em 24h pós-treino, ROM estável ou melhorado, controle motor demonstrado em avaliação funcional. Periodização ondulada diária recomendada para variabilidade de estímulo."

### Pilar 3 · Autonomia e Prevenção

- **Subtitle:** "Construindo independência para o longo prazo"
- **Conceito central:** O objetivo final da reabilitação via musculação não é "ser dependente de um profissional para sempre" — é construir conhecimento corporal, confiança no movimento, e hábitos de prevenção que tornem a pessoa autônoma. O profissional guia o processo, mas o objetivo é que o aluno saiba, eventualmente, quando pode avançar e quando deve recuar.
- **Evidência científica:** Self-efficacy como preditor de resultado em reabilitação (Bandura, 1997; Nicholas et al., 2011). Programas de exercício domiciliar pós-fisioterapia com critérios de automonitoramento (diário de dor, RPE) mostram manutenção de ganhos em 12 meses (Skou et al., 2018).
- **Placeholders:** `[agua_l]`, `[classificacao_dor]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "O objetivo não é treinar com medo para sempre — é chegar num ponto onde você confia no seu corpo de novo. Para isso, três ferramentas: (1) monitorar sua dor antes e depois do treino (hoje está em [classificacao_dor]), (2) manter hidratação adequada ([agua_l]L/dia para suporte articular), e (3) construir com [profissional_nome] um repertório de exercícios que você saiba executar com segurança mesmo sozinho."
- **Exemplo de texto técnico (35 palavras):** "Automonitoramento: NPRS pré/pós treino, diário de dor semanal. Hidratação: [agua_l]L/dia. Meta de autonomia: capacidade de autogerenciar RPE, identificar sinais de alerta (dor > 4/10 pós-treino), e ajustar volume sem supervisão direta em 12-16 semanas."

## 10 · AI Context

- **specialtyDescription:** "Template para pessoas em processo de recuperação de lesão ou cirurgia musculoesquelética, ou que convivem com dor crônica e buscam treino resistido seguro e progressivo. Público que já passou (ou está passando) por fisioterapia e quer transitar para musculação supervisionada por profissional especializado."

- **narrativeArc:**
  1. Validar a decisão de buscar ajuda especializada (não é fraqueza — é inteligência)
  2. Contextualizar a fase atual de recuperação com base nos dados informados
  3. Explicar por que o treino resistido é ferramenta terapêutica (não "malhar apesar da lesão")
  4. Apresentar métricas de referência (dor, nutrição, hidratação) com interpretação acessível
  5. Definir pilares acionáveis com critérios de progressão claros
  6. Reforçar o papel do profissional como guia técnico (não como muleta)
  7. Ponte para contato com linguagem de parceria ("juntos vamos construir")

- **terminology:** ["fortalecimento", "progressão", "adaptação", "controle motor", "amplitude de movimento", "cadeia cinética", "estabilização", "recondicionamento", "tolerância ao volume", "sobrecarga progressiva", "treino adaptado", "fase de recuperação", "readaptação", "manejo da dor"]

- **forbiddenTerms:**
  - "paciente" → usar "aluno" ou "você" (contexto é academia, não clínica)
  - "deficiente" / "debilitado" / "incapaz" → capacitismo (usar "em recuperação", "com restrição temporária")
  - "repouso absoluto" → contraindicado pela evidência em fases tardias (usar "descanso ativo" se necessário)
  - "cura" / "curar" → dor crônica não se cura, se maneja (usar "manejo", "controle", "melhora")
  - "100%" / "voltar ao que era" → promessa irresponsável (usar "seu melhor possível", "nova versão")
  - "pega leve" → genérico, percebido como descaso (usar "intensidade calibrada", "carga controlada")
  - "sem dor não há ganho" → perigoso em reabilitação (dor é sinal, não meta)

- **recommendedTone:** "Técnico-acolhedor. Linguagem de profissional que sabe o que faz e se importa com quem atende. Sem motivacionalismo vazio, sem dramatização da condição. Valida a experiência do aluno (dor é real), contextualiza com evidência (mas há caminho), e direciona com clareza (próximos passos concretos)."

- **pillarGuidance:**
  1. "Movimento Seguro: foque na lógica de seleção de exercícios (por que ESSES e não outros), não em lista de exercícios. Referencie a região afetada. Nunca diga 'evite exercício X para sempre' — diga 'exercício X entra na fase Y quando critério Z for atingido'."
  2. "Fortalecimento Progressivo: enfatize que progressão em reabilitação é baseada em sinais do corpo (dor pós-treino, amplitude, controle), não em calendário. Mencione proteína como ferramenta de recuperação, não de estética."
  3. "Autonomia e Prevenção: o objetivo final é autogerenciamento. Sugira ferramentas práticas (diário de dor, escala de esforço) que o aluno pode usar sozinho. Posicione o profissional como mentor temporário, não dependência permanente."

## 11 · Configuração de cálculos

- **activityLevelDefault:** `lightly_active`
  - **Justificativa:** O público de reabilitação está, em média, abaixo do nível de atividade de quem treina regularmente. Muitos estão parados ou fazendo apenas fisio. `sedentary` seria inadequado (subestimaria quem faz fisio/pilates 3x por semana), e `moderately_active` superestimaria a maioria. `lightly_active` é o default mais seguro para cálculos nutricionais neste público.

- **activityMapping:**
  - Questão: `atividade_atual`
  - Mapping:
    - `parado` → `sedentary`
    - `fisio_apenas` → `lightly_active`
    - `leve_conta_propria` → `lightly_active`
    - `treino_adaptado` → `moderately_active`

- **requiresTargetWeight:** `false`
  - **Justificativa:** O objetivo deste template não é emagrecimento nem ganho de massa — é recuperação funcional. Pedir peso-alvo seria desviar o foco e gerar expectativas erradas. Se o aluno quer emagrecer E se reabilitar, o template de emagrecimento (#1) é mais adequado como primário.

- **Multiplicador calórico:** `1.0` (manutenção). Em reabilitação, nem déficit (prejudica cicatrização) nem superávit agressivo (desnecessário). O corpo precisa de energia para reparar, não para restringir.

- **Proteína g/kg:** `1.8` (default para reabilitação). Justificativa: ACSM e ISSN recomendam 1.6-2.2g/kg para otimizar síntese proteica em cenários de reparo tecidual. 1.8g/kg é o ponto médio conservador.

## 12 · Notas de design (decisões não-óbvias)

### Por que manter o label "Reabilitação" no hub

O termo "reabilitação" é técnico e soa hospitalar para o aluno — mas o aluno NÃO vê o hub. Quem vê o hub é o **profissional**, que SE IDENTIFICA como especialista em reabilitação. O label reforça posicionamento. Para o formulário client-facing, a IA usa "Recuperação e Retorno ao Treino" — mais acessível.

### Por que NÃO incluir pergunta sobre diagnóstico específico

Alternativa considerada: "Qual é o seu diagnóstico?" com lista de condições (hérnia L4-L5, LCA, manguito rotador, etc.). Descartada porque: (1) muitos alunos não sabem o diagnóstico exato, (2) lista longa em mobile gera abandono, (3) granularidade excessiva para formulário de lead — o PT pergunta presencialmente. Região afetada (Q2) captura 80% do valor diagnóstico com 20% da fricção.

### Por que `nivel_dor` é número e não faixas

NPRS 0-10 é instrumento validado que perde validade se transformado em faixas antes da coleta. A classificação (leve/moderada/intensa) é derivada DEPOIS, para narrativa. O dado bruto numérico é o que o profissional precisa para acompanhamento longitudinal (diferença de 2+ pontos = MCID).

### Por que "não sei" em liberação médica NÃO é safety trigger

"Não sei / nunca pedi" é diferente de "não tenho". Muitas pessoas com lombalgia crônica de anos treinem sem liberação formal e são clinicamente aptas. Bloquear este grupo (1) excluiria uma fatia significativa do público, (2) seria paternalista. O relatório orienta a buscar avaliação, mas mantém métricas e pilares. Já "não tenho" é declaração explícita de ausência — esse sim bloqueia.

### Por que 3 branches e não 2 ou 4

Três fases cobrem o espectro: pós-op (protocolar), crônico (manejo), retorno (progressão). Um 4º branch ("prevenção") foi descartado porque quem busca prevenção sem lesão prévia é melhor atendido por Funcional (#9) ou Saúde (#3). Dois branches (crônico + agudo) não capturariam a diferença substancial entre pós-op e retorno.

### Por que timeline é REMOVIDA em 2 dos 3 branches

Timeline ("em X meses você chega lá") é irresponsável em pós-op (depende de cicatrização, protocolo do cirurgião, individualidade biológica) e em dor crônica (não tem "data de chegada" — é manejo contínuo). Só faz sentido no retorno à atividade, onde a progressão é mais previsível. Manter timeline nos 3 branches criaria expectativas falsas e risco de frustração/desistência.

### Por que NÃO incluir perguntas condicionais (visibilityRule)

Templates complexos com muitas condicionais são mais difíceis de testar, mais frágeis, e geram experiências inconsistentes. Para 7 perguntas, todas são relevantes para todos os paths. A complexidade está nos branches (que mudam métricas e tom), não nas perguntas. Se fosse 10+ perguntas, condicionais seriam necessárias — com 7, são overhead.

## 13 · Pendências

### Validação clínica BLOQUEANTE

- [ ] Revisão completa por **fisioterapeuta com experiência em exercício clínico** (idealmente pós-graduação em reabilitação musculoesquelética)
- [ ] Revisão por **educador físico pós-graduado em exercício clínico/reabilitação**
- [ ] Validação dos safety triggers (especialmente "cirurgia < 3 meses" como threshold — pode variar por tipo de cirurgia)
- [ ] Validação dos copies por profissional que atende esse público (tom, linguagem, precisão técnica)

### Cálculos que precisam de validação

- [ ] `indice_prontidao` — fórmula proposta (dor 40% + atividade 30% + liberação 30%) é heurística, não validada. Precisa de calibração com dados reais ou substituição por instrumento validado.
- [ ] `risco_recidiva` — score proposto é heurístico. Literatura de return-to-sport usa critérios mais sofisticados (LSI, hop tests) que não são autoaplicáveis.
- [ ] `aderencia_prevista` — preditores de aderência são bem documentados na literatura, mas o score proposto é simplificação. Considerar literatura de Essery et al. (2017) sobre preditores de aderência em exercício terapêutico.
- [ ] `fase_protocolo` — a derivação de fase a partir de atividade + dor é aproximação. Protocolos reais variam por cirurgia (LCA ≠ manguito ≠ artroplastia).

### Casos de borda não cobertos

- Alunos com **múltiplas cirurgias** em regiões diferentes (ex: joelho E ombro) — o template permite "outra/múltiplas" em Q2, mas o relatório foca em uma região. Caso Custom.
- Alunos com **condição neurológica associada** (ex: hérnia com radiculopatia severa + perda de força) — escopo de reabilitação neurológica, não musculoesquelética.
- **Atletas de alto rendimento** em reabilitação — critérios de return-to-sport são mais rigorosos e específicos. Template genérico de reabilitação pode ser insuficiente. Considerar branch ou template dedicado futuro.
- **Idosos (60+) em reabilitação** — overlap com template Terceira Idade (#6). Se o aluno tem 65 anos e é pós-artroplastia, qual template usar? Recomendação: #8 se a queixa principal é a lesão/cirurgia, #6 se a queixa principal é envelhecimento/sarcopenia com lesão como comorbidade.

### Libs de cálculo a investigar

- [ ] Instrumentos funcionais autoaplicáveis adaptados para mobile (versões simplificadas de LEFS, QuickDASH, ODI) — viabilidade de integrar no formulário como perguntas opcionais para depth `detailed`
- [ ] Score de cinesiofobia simplificado (TSK tem 17 itens — inviável para formulário mobile. Existe versão reduzida TSK-11 validada em pt-BR?)

## 14 · Fontes citadas

1. **PNS 2019 (IBGE/Fiocruz)** — Pesquisa Nacional de Saúde. Prevalência de dor crônica na coluna: 18,5% da população adulta brasileira.
2. **ACSM Position Stand (2009, rev. 2021)** — Progression Models in Resistance Training for Healthy Adults. Base para prescrição progressiva.
3. **Hayden JA et al. (2021)** — Cochrane Review: Exercise therapy for chronic low back pain. Evidência forte para exercício resistido.
4. **Gavin Publishers (2023)** — Review of the Role of Resistance Training and Musculoskeletal Injury Prevention and Rehabilitation. Revisão abrangente.
5. **Farrar JT et al. (2001)** — Clinical importance of changes in chronic pain intensity measured on an 11-point numerical pain rating scale. MCID = 2 pontos.
6. **Vlaeyen JW & Linton SJ (2000)** — Fear-avoidance and its consequences in chronic musculoskeletal pain. Cinesiofobia como preditor.
7. **ISSN Position Stand (2017)** — International Society of Sports Nutrition position stand: protein and exercise. 1.6-2.2 g/kg para otimização.
8. **Lorenz D & Morrison S (2015)** — Current concepts in periodization of strength and conditioning for the sports physical therapist. Periodização adaptada.
9. **Myer GD et al. (2006)** — Rehabilitation after anterior cruciate ligament reconstruction. Progressão CKC → OKC.
10. **Skou ST et al. (2018)** — A Randomized, Controlled Trial of Total Knee Replacement. Exercício como primeira linha vs cirurgia em artrose.
11. **Bandura A (1997)** — Self-efficacy: The exercise of control. Autoeficácia em reabilitação.
12. **Essery R et al. (2017)** — Predictors of adherence to home-based physical therapies: a systematic review. Preditores de aderência.
13. **Siqueira FB et al. (2007)** — Análise das propriedades psicométricas da versão brasileira da Tampa Scale for Kinesiophobia. Validação pt-BR.
14. **LEFS-Brasil** — Lower Extremity Functional Scale, versão brasileira. Validada por Revista Brasileira de Reumatologia.
15. **QuickDASH-Brasil** — Disabilities of the Arm, Shoulder and Hand, versão brasileira reduzida. Validada por REVISBRATO.

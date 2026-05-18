# Research · Especialidade 22 · CrossFit Competitivo

## 0 · Metadados

- **Número:** 22
- **Modality:** crossfit
- **Pasta:** `crossfit/22-performance/`
- **Plano:** pro
- **Validação clínica:** ⚠️ Recomendada (educador físico com experiência em CrossFit competitivo)
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. PMC — Epidemiological Profile of Brazilian CrossFit Athletes (2016, n=566)
  2. PMC — Injury Prevalence in CrossFit (2019, meta-análise)
  3. PMC — Physiological Predictors of Benchmark WOD Performance (Bellar et al., 2015)
  4. PMC — Elite CrossFit Athlete Characteristics (2024)
  5. Smith et al. (2013) — CrossFit-Based HIPT and VO2max Improvement
  6. CrossFit Games Season 2026 — Estrutura de qualificação oficial
  7. HWPO Training / Conquer Athlete — Periodização para competidores
  8. Exercise.com — CrossFit Statistics 2026

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 25-35 anos
- **Gênero:** ~60% masculino, 40% feminino (o gap diminui em categorias amadoras)
- **Socioeconômico:** Classes A-B (renda média-alta), ensino superior completo. CrossFit tem mensalidade de R$250-500/mês em capitais — filtra naturalmente por poder aquisitivo
- **Concentração geográfica:** Capitais e cidades grandes (SP, RJ, BH, Curitiba, Florianópolis, Brasília, Recife)

### Ordem de grandeza

Mercado **grande e crescente**. Brasil é o 2º maior mercado de CrossFit fora dos EUA, com ~1.500+ boxes afiliados. Estudo PMC com 566 atletas brasileiros revelou que 32,7% competem (23,9% amador, 7,7% colegial/profissional). No Open 2022, Brasil teve taxa de participação RX de 16,2% — a mais alta do mundo, indicando cultura competitiva desproporcional. Estimativa conservadora: **50.000-80.000 praticantes com intenção competitiva** (boxes + não-afiliados).

### Onde estão online

- **Instagram:** canal primário. Seguem atletas como Gui Malheiros, Victoria Campos, Larissa Cunha. Perfis de boxes locais. Coaches de programação (HWPO, CompTrain, Conquer Athlete)
- **YouTube:** para análises técnicas, review de competições, tutoriais de skill
- **WhatsApp:** grupos do box local, grupos de competidores de semifinais, grupos de compra/venda de equipamento
- **Apps:** WODProof (filmagem de treinos para validação), Beyond the Whiteboard, SugarWOD (tracking)
- **Comunidade presencial:** o box É a rede social. Cultura de "turma das 6h" ou "turma das 19h"

### Linguagem-padrão

- Termos universais usados em português: **WOD**, **PR** ("bati PR"), **RX** (como prescrito), **scaled**, **AMRAP**, **EMOM**, **MetCon**, **benchmark**, **Hero WOD**, **box** (nunca "academia"), **coach** (nunca "professor")
- Gírias brasileiras: "caixa" (box informalmente), "dar send" (executar RX algo difícil), "motor" ou "engine" (capacidade aeróbia), "ficar em débito" (anaeróbio), "puxar barra" (muscle-up/pull-up de forma genérica), "ir de RX" / "scalonar" (fazer scaled)
- **Identidade forte:** competidores se veem como "atletas", não como "alunos de academia". Essa distinção é central

### O que ofende ou afasta

- Chamar CrossFit de "modinha" ou "academia diferente"
- Tratar o atleta como iniciante ("você precisa aprender o básico primeiro")
- Tom de "cuidado, CrossFit machuca" — eles já ouviram mil vezes e consideram desinformação
- Formulário genérico que poderia ser de qualquer esporte — esperam especificidade
- Qualquer coisa que pareça vender suplemento ou promessa mágica
- Linguagem de coach de Instagram motivacional ("mentalidade de campeão!", "sem limites!")

### Dor mais comum

**"Sei que preciso melhorar, mas não sei o que priorizar."** O atleta competitivo treina forte mas frequentemente de forma desorganizada — mistura tudo sem periodização. Quer saber: onde estão meus gaps reais? Ginástica? Força? Motor? Preciso de um olhar externo estruturado que diga "seu limitante agora é X, foque aqui nas próximas 8 semanas."

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Praticantes de CrossFit que **competem ou pretendem competir** — desde atleta de campeonatos regionais até quem quer fazer Quarterfinals
- Objetivos: melhorar performance geral, classificar para competição específica, resolver gargalos técnicos, periodizar treinamento
- Faixa de experiência: **1+ ano de CrossFit regular com intenção competitiva** (não é iniciante que quer "experimentar competir")

### Este template NÃO vai cobrir:

- **CrossFit iniciante/fitness recreativo** → template #21 (Iniciante/Fitness)
- **Masters 40+** → template #23 (tem considerações de recuperação e risco diferentes)
- **Feminino com foco estético** → template #24 (objetivos e métricas diferentes)
- **Atletas Games-level** → serviço Custom (requerem análise presencial individualizada, periodização macro com equipe multidisciplinar). O template pode captar, mas o relatório deve direcionar para atendimento premium
- **Reabilitação de lesão ativa** → o template identifica via safety, mas não prescreve reabilitação

### Decisão de label

Mantive **"CrossFit Competitivo"** em vez de "Performance" porque:

1. "Performance" é genérico e não cria identificação imediata
2. "Competitivo" é o termo que a comunidade brasileira usa para se autodescrever ("faço CrossFit competitivo")
3. O label no hub será **"Competitivo"** — o aluno já selecionou a modalidade CrossFit, então "CrossFit Competitivo" seria redundante

**specialty_code proposto:** `crossfit_competitive`

---

## 3 · Motores escolhidos

### Decisão narrativa

O atleta competitivo de CrossFit tem uma necessidade clara: **identificar gaps e priorizar**. O produto precisa capturar três dimensões fundamentais:

1. **Onde o atleta está na jornada competitiva** (Motor 6 — Fase) — um atleta de box local compete diferente de quem está mirando Quarterfinals. Isso define a ambição do relatório.
2. **O que está travando** (Motor 2 — Gargalo) — o diferencial do relatório. Cada gap gera recomendação diferente.
3. **Capacidade técnica real** (Motor 3 — Nível) — competidores de CrossFit se medem por benchmarks. Saber se faz muscle-up ou não muda completamente o diagnóstico.
4. **Estrutura atual de treinamento** (Motor 4 — Comportamento) — quantas sessões, se faz trabalho extra, se segue programação ou improvisa. Diferencia quem precisa de mais volume vs mais inteligência.
5. **Condições de saúde** (Motor 8 — Safety) — obrigatório.

### Motores descartados e por quê

- **Motor 1 (Contexto atual):** redundante com Motor 6 nesse nicho. A fase competitiva já captura o "onde está hoje".
- **Motor 5 (Ambiente/Disponibilidade):** pouco variável — competidores treinam em box, têm equipamento, dedicam 60-90min/dia. Perguntar "onde treina?" não muda o relatório. Se treina em garage gym, as recomendações de skill são as mesmas.
- **Motor 7 (Métricas/Ferramentas):** considerei incluir (HR monitor, assault bike power, etc.) mas descartei. A maioria dos competidores brasileiros não usa power meter ou HR em metcons. Os benchmarks (Q3) já capturam a informação técnica relevante. Incluir sub-perguntas condicionais sobre wattagem de remo/bike inflaria o template para um grupo minoritário.

### Lista final (5 motores, 6 perguntas)

1. **Fase competitiva (Motor 6)** → `competitive_phase` — Segmenta o atleta por ambição e estágio no calendário competitivo
2. **Gargalo principal (Motor 2)** → `main_bottleneck` — Identifica o limitante auto-percebido para direcionar pilares do relatório
3. **Nível técnico — ginástica (Motor 3)** → `gymnastics_level` — Ginástica é o maior diferenciador entre tiers. Muscle-up é o divisor de águas
4. **Força relativa (Motor 3)** → `strength_level` — Força é o preditor #1 de performance em benchmarks (Bellar et al., 2015)
5. **Estrutura de treino (Motor 4)** → `training_structure` — Como treina hoje: programação, volume, trabalho extra
6. **Condições de saúde (Motor 8)** → `health_conditions` — Triagem de safety

**Total: 6 perguntas específicas** (dentro do range 5-8, sem inflar).

---

## 4 · Perguntas e opções

### Q1 · `competitive_phase` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Em que momento da sua jornada competitiva você está?"
**Helper:** "Escolha o que mais se aproxima — isso calibra o relatório para seu nível de ambição"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`box_competitor`** — "Compito no box e em campeonatos locais"
  - Safety trigger? não

- **`regional_competitor`** — "Compito em campeonatos regionais / estaduais"
  - Safety trigger? não

- **`quarterfinals_plus`** — "Miro Quarterfinals, Semifinals ou competições de elite"
  - Safety trigger? não

**Justificativa da pergunta:** A ambição competitiva define completamente o tom e a profundidade do relatório. Um atleta de box local precisa de consolidação técnica; um atleta de Quarterfinals precisa de otimização marginal. Alternativa descartada: "Há quanto tempo compete?" — tempo não é proxy de nível (alguém com 2 anos pode ser mais competitivo que alguém com 5 anos se tem background atlético).

**Justificativa das opções:** Três tiers cobrem 95%+ dos competidores. A separação é por **escopo da competição**, não por resultado — porque resultado é subjetivo e volátil. Caso de borda: atleta de elite que já foi a Games — o template captura em `quarterfinals_plus`, mas o relatório direciona para atendimento premium.

---

### Q2 · `main_bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais te limita hoje na competição?"
**Helper:** "Pense no que te fez perder posições no último campeonato"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`gymnastics`** — "Ginástica (muscle-ups, HSPU, handstand walk)"
  - Safety trigger? não

- **`strength`** — "Força (lifts pesados, Olympic lifts)"
  - Safety trigger? não

- **`engine`** — "Motor / capacidade aeróbia (metcons longos, recuperação entre séries)"
  - Safety trigger? não

- **`consistency`** — "Constância e recuperação (treino irregular, lesões recorrentes)"
  - Safety trigger? não

- **`mental_game`** — "Cabeça (pacing, ansiedade, decisão sob fadiga)"
  - Safety trigger? não

**Justificativa da pergunta:** O gargalo auto-percebido é o dado mais valioso para personalizar o relatório. Alternativa descartada: permitir múltipla escolha — quando tudo é prioridade, nada é. Forçar single_choice obriga o atleta a pensar "o que me fez PERDER posições", não "o que eu gostaria de melhorar". Isso gera dado mais honesto.

**Justificativa das opções:** Cinco gargalos baseados na literatura e na prática:

1. Ginástica — gargalo #1 na comunidade brasileira (Bellar et al.: força prediz WOD, mas ginástica é o teto)
2. Força — preditor dominante de performance em benchmarks
3. Motor — separa tiers em metcons longos
4. Constância — o limitante "invisível" que muitos não admitem
5. Mental — o gap entre treino e competição

Caso de borda não coberto: nutrição. Descartei como opção porque: (a) nutrição é transversal, não é gargalo isolado; (b) aparece como sub-tema nos pilares de qualquer gargalo; (c) incluir geraria 6 opções, diluindo a decisão.

---

### Q3 · `gymnastics_level` _(Motor 3 — Nível técnico)_

**Type:** `single_choice`
**Label (client-facing):** "Qual seu nível de ginástica no CrossFit?"
**Helper:** "Considere o que você faz de forma consistente no WOD, não o que já fez uma vez"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`developing`** — "Faço pull-ups e toes-to-bar, mas ainda não tenho muscle-up consistente"
  - Safety trigger? não

- **`intermediate`** — "Tenho muscle-up (barra ou argola), HSPU com kipping"
  - Safety trigger? não

- **`advanced`** — "Faço muscle-ups (barra e argola), HSPU strict/deficit, handstand walk"
  - Safety trigger? não

**Justificativa da pergunta:** Ginástica é o maior diferenciador entre tiers competitivos em CrossFit. A literatura (Bellar et al., 2015) mostra que força prediz benchmarks, mas na prática ginástica é o que elimina atletas em competição — se o evento tem muscle-up e você não faz, é DNF. Alternativa descartada: perguntar "quais movimentos você faz?" com checkbox (muscle-up, HSPU, HSW, etc.) — geraria dados granulares mas inflaria o formulário. Os 3 tiers capturam o essencial em 5 segundos.

**Justificativa das opções:** Os 3 tiers são definidos pelo **movimento divisor de cada nível**: (1) muscle-up é o gate entre developing e intermediate; (2) handstand walk + strict/deficit HSPU é o gate entre intermediate e advanced. Cobrem ~95% dos competidores. Caso de borda: atleta avançado em ginástica mas fraco em força — é capturado pelo gargalo (Q2), não pela pergunta de ginástica.

---

### Q4 · `strength_level` _(Motor 3 — Força relativa)_

**Type:** `single_choice`
**Label (client-facing):** "Como está sua força nos levantamentos principais?"
**Helper:** "Compare seu back squat com seu peso corporal — é a referência mais usada"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`below_bw`** — "Agachamento abaixo de 1.5x meu peso corporal"
  - Safety trigger? não

- **`moderate`** — "Agachamento entre 1.5x e 2x meu peso corporal"
  - Safety trigger? não

- **`competitive`** — "Agachamento acima de 2x meu peso corporal"
  - Safety trigger? não

**Justificativa da pergunta:** Bellar et al. (2015) demonstraram que força (CrossFit Total) é o preditor dominante de performance em benchmark WODs, acima de VO2max e potência anaeróbia. O back squat relativo ao peso corporal é o proxy mais acessível — todo competidor sabe o número. Alternativa descartada: pedir 1RMs numéricos exatos (squat, deadlift, clean, snatch) — geraria dados precisos mas requer 4 campos numéricos, aumenta fricção, e muitos atletas não testam 1RM regularmente. Os 3 tiers relativos capturam o mesmo sinal em 5 segundos.

**Justificativa das opções:** Os cortes 1.5x e 2x BW são benchmarks amplamente utilizados pela comunidade competitiva. Cobrem desde o "preciso ficar mais forte" até o "força não é meu problema". Para mulheres, os mesmos ratios se aplicam proporcionalmente (1.2x-1.5x para developing, etc.) — o relatório da IA deve calibrar expectativas por sexo usando os dados de `basics`.

---

### Q5 · `training_structure` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Como é seu treino hoje?"
**Helper:** "Foque no que você REALMENTE faz na maioria das semanas"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`class_only`** — "Sigo o WOD do box (1 sessão/dia, sem extras)"
  - Safety trigger? não

- **`class_plus_extra`** — "WOD do box + trabalho extra (skill, força ou motor)"
  - Safety trigger? não

- **`structured_program`** — "Sigo programação competitiva estruturada (HWPO, CompTrain, coach individual, etc.)"
  - Safety trigger? não

**Justificativa da pergunta:** A estrutura de treino revela maturidade competitiva e orienta a profundidade das recomendações. Atleta que só faz WOD precisa de recomendações básicas de periodização; atleta com programação estruturada precisa de diagnóstico fino. Alternativa descartada: "Quantas sessões por semana?" (número) — volume bruto não diferencia 5 sessões de WOD genérico de 5 sessões periodizadas. A estrutura importa mais que o volume.

**Justificativa das opções:** Três tiers progressivos de sofisticação. Cobrem ~95% dos competidores. Caso de borda: atleta que programa sozinho sem base formal — se encaixa em `class_plus_extra` ou `structured_program` dependendo do nível de organização. O relatório calibra pela combinação com as outras respostas.

---

### Q6 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Marque todas que se aplicam — isso ajuda a gerar recomendações seguras"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`shoulder_injury`** — "Lesão no ombro (atual ou recente, últimos 6 meses)"
  - Safety trigger? não (condição comum, manejo pelo PT)

- **`knee_back_issue`** — "Problema no joelho ou lombar (atual ou recente)"
  - Safety trigger? não (condição comum, manejo pelo PT)

- **`cardiac_condition`** — "Condição cardíaca diagnosticada"
  - Safety trigger? **sim** (reason: "Condição cardíaca em esporte de alta intensidade requer liberação cardiológica presencial")

- **`rhabdo_history`** — "Já tive rabdomiólise ou episódio de esforço extremo com hospitalização"
  - Safety trigger? **sim** (reason: "Histórico de rabdomiólise requer acompanhamento médico para dosagem de carga em treino de alta intensidade")

- **`none`** — "Nenhuma dessas"
  - Safety trigger? não

**Justificativa da pergunta:** Safety obrigatório. CrossFit competitivo tem perfil de risco específico: ombro (25% das lesões — meta-análise PMC 2019), joelho/lombar (14%/13%), e o caso raro mas grave de rabdomiólise. Alternativa descartada: lista extensa de condições (diabetes, hipertensão, tireoide, etc.) — são relevantes clinicamente mas não são safety triggers neste nicho. Condições crônicas controladas são manejo de coach, não bloqueio de relatório.

**Justificativa das opções:** Quatro condições + "nenhuma". Ombro e joelho/lombar são informativas (não trigger safety — são gestão do PT). Cardíaca e rabdomiólise são os dois únicos cenários em CrossFit competitivo onde há risco clínico real que exige avaliação presencial antes de intensificar.

---

## 5 · Branches

### Branch: `Box Local` (trigger: `competitive_phase == box_competitor`)

- **Tom geral:** Encorajador e construtivo. "Você já está competindo — vamos organizar seu próximo passo." Evitar tom de "você precisa evoluir muito" — validar o estágio atual.
- **pillarGuidance:** Pilares focam em consolidação de base técnica e construção de volume sustentável. Usar analogias acessíveis, evitar jargão de periodização avançada.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Não mostrar comparações com atletas de elite. Benchmarks de referência são da categoria regional (ex: Fran sub-5:00, não sub-3:00).
- **Narrative arc override:** Arco de "consolidação e descoberta" — o relatório ajuda a descobrir qual pilar atacar primeiro, com horizonte de 3-6 meses.

**Justificativa:** O atleta de box local precisa de validação + direção. Se o relatório comparar com padrões de elite, frustra. Se for superficial demais, não impressiona. O tom certo é "você está no caminho, e aqui está o mapa".

### Branch: `Regional/Estadual` (trigger: `competitive_phase == regional_competitor`)

- **Tom geral:** Direto e técnico. "Vamos identificar o que está te segurando." Pode usar jargão moderado — esse atleta conhece os termos.
- **pillarGuidance:** Pilares focam em equilíbrio entre os 3 pilares clássicos (ginástica, força, motor) e introduzem conceitos de periodização e pico. Linguagem técnica moderada.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Benchmarks de referência da categoria regional/estadual (Fran sub-4:00, squat 1.8x BW). Mostrar gap analysis entre nível atual e próximo tier.
- **Narrative arc override:** Arco de "otimização e equilíbrio" — o relatório identifica o pilar mais fraco e propõe estratégia de ataque com horizonte de competição (próximo campeonato).

**Justificativa:** O competidor regional tem base sólida mas gaps específicos. O relatório deve funcionar como "diagnóstico de performance" — apontar com precisão onde investir para subir de tier.

### Branch: `Elite / Quarterfinals+` (trigger: `competitive_phase == quarterfinals_plus`)

- **Tom geral:** Profissional e preciso. Linguagem de coach de elite para atleta de elite. Sem hand-holding, sem motivação genérica. Dados, gaps, estratégia.
- **pillarGuidance:** Pilares focam em otimização marginal, gestão de volume/recuperação e preparação mental para competição. Linguagem técnica avançada permitida.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Benchmarks de referência de Quarterfinals/Semifinals. Gap analysis com percentis da categoria. Recomendação de procurar coaching individual se ainda não tem.
- **Narrative arc override:** Arco de "refinamento e pico" — o relatório assume competência técnica e foca em 2-3 ajustes de alto impacto. Sempre direciona para atendimento presencial como próximo passo.

**Justificativa:** O atleta de elite tem repertório completo. Um relatório online tem valor limitado para ele — o maior valor é identificar gaps que ele pode estar cego (viés de confirmação) e direcionar para coaching individual. O relatório é o "trailer" do serviço premium.

---

## 6 · Safety triggers

| Questão             | Opções              | Reason (clínico)                                                                | Efeito no relatório                                                                                             |
| ------------------- | ------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `health_conditions` | `cardiac_condition` | Treino de alta intensidade com picos >90% FC máx requer liberação cardiológica  | Macros de treino omitidas, intensidade limitada, SafetyNote aparece, IA instruída a recomendar avaliação médica |
| `health_conditions` | `rhabdo_history`    | Risco aumentado de recorrência em volume excêntrico alto, requer acompanhamento | SafetyNote aparece, IA instruída a limitar recomendações de volume, recomendar monitoramento médico             |

**safetyTemplate:**

- **Title:** "Sua segurança vem primeiro"
- **Body:** "Identificamos uma condição que merece atenção especial antes de intensificar seu treino competitivo. Isso não significa que você não possa competir — muitos atletas de alto nível treinam com condições semelhantes sob acompanhamento adequado. Recomendamos que você converse com seu médico e com [profissional_nome] para estabelecer limites seguros de intensidade. Com liberação médica e monitoramento, você pode continuar evoluindo com segurança."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `strength_ratio`

- **O que é:** Classificação da força relativa do atleta (baseada na resposta de Q4 + peso de `basics`)
- **Por que aparece para o aluno:** Dá ao atleta um benchmark concreto e mostra onde ele está vs referência competitiva. Força é o preditor #1 de performance — ver isso quantificado motiva
- **Cálculo:** Estimativa de 1RM back squat relativo = tier selecionado × peso corporal. Faixas: <1.5x (developing), 1.5-2x (competitive), >2x (elite). Referência: Bellar et al. (2015) + benchmarks comunitários
- **Visualização proposta:** Gauge radial com 3 faixas coloridas (developing / competitive / elite). Valor central mostra a estimativa de 1RM absoluto
- **Placeholder:** `[strength_class]`, `[estimated_squat]`

### 7.2 · `gymnastics_readiness`

- **O que é:** Classificação do repertório ginástico do atleta
- **Por que aparece para o aluno:** Mostra claramente onde está na progressão ginástica e qual é o próximo "unlock"
- **Cálculo:** Mapeamento direto da resposta de Q3. Developing → 40%, Intermediate → 70%, Advanced → 95%
- **Visualização proposta:** Gauge radial com 3 faixas (developing / intermediate / advanced). Label mostra o próximo movimento a desbloquear
- **Placeholder:** `[gymnastics_class]`, `[next_skill]`

### 7.3 · `competitor_profile_radar`

- **O que é:** Perfil multidimensional do atleta em 4-5 eixos (Força, Ginástica, Motor, Consistência, Mental)
- **Por que aparece para o aluno:** Visual impactante que mostra o "formato" do atleta. Cria identificação imediata ("ah, sou forte mas fraco em ginástica")
- **Cálculo:** Derivado das respostas de Q2-Q5. Gargalo selecionado = eixo mais baixo. Demais eixos inferidos por complementaridade
- **Visualização proposta:** Radar chart (5 eixos). Preenchimento com cor do tier competitivo (verde/amarelo/azul)
- **Placeholder:** `[strongest_pillar]`, `[weakest_pillar]`

### 7.4 · `bmi_contextual`

- **O que é:** IMC com interpretação específica para atleta de CrossFit (onde IMC alto frequentemente = massa muscular, não gordura)
- **Por que aparece para o aluno:** Contextualiza IMC corretamente — atletas de CrossFit frequentemente caem em "sobrepeso" por massa muscular. O relatório explica isso
- **Cálculo:** peso / altura². Faixas padrão OMS, com nota contextual para atletas ("IMC tem limitações para atletas com alta massa muscular")
- **Visualização proposta:** Card numérico com valor + nota contextual (não gauge — evitar que o atleta se assuste com classificação OMS inadequada)
- **Placeholder:** `[bmi_value]`, `[bmi_context]`

### 7.5 · `priority_action`

- **O que é:** A ação #1 que o atleta deveria focar nas próximas 8 semanas
- **Por que aparece para o aluno:** O output mais acionável do relatório. "Se você só pudesse mudar uma coisa, seria isso"
- **Cálculo:** Derivado do gargalo (Q2) + nível (Q3/Q4) + fase (Q1). Lógica de regras determinísticas
- **Visualização proposta:** Card destacado (hero card) com ícone, título e 2-3 linhas de ação concreta
- **Placeholder:** `[priority_action]`, `[priority_timeframe]`

### 7.6 · `hydration_target`

- **O que é:** Meta diária de água baseada no peso corporal e nível de atividade
- **Por que aparece para o aluno:** Métrica acionável simples que funciona como "quick win" no relatório
- **Cálculo:** 35-40ml × peso corporal (atleta de alta intensidade). Referência: ACSM guidelines para atletas
- **Visualização proposta:** Card numérico simples (ex: "3.2L/dia")
- **Placeholder:** `[water_ml]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `competition_tier`

- **O que é:** Classificação do atleta em tier competitivo (Box / Regional / Elite)
- **Por que importa para o PT:** Segmentação imediata de leads por nível — permite priorizar atletas mais sérios ou identificar oportunidades de upsell para coaching individual
- **Cálculo:** Direto de Q1 (`competitive_phase`)
- **Visualização proposta:** Badge colorido (🟢 Box / 🟡 Regional / 🔴 Elite)

### 8.2 · `bottleneck_diagnosis`

- **O que é:** O gargalo auto-reportado com cruzamento de dados (ginástica + força)
- **Por que importa para o PT:** Permite montar plano de treino antes mesmo da primeira conversa. "Esse atleta é forte mas fraco em ginástica — preciso preparar progressões de muscle-up"
- **Cálculo:** Q2 (gargalo) + validação cruzada com Q3/Q4 (se diz que gargalo é força mas squat é 2x BW, flag de "gargalo auto-percebido ≠ dados" — possível blind spot)
- **Visualização proposta:** Card com gargalo declarado + flag de consistência/inconsistência com dados objetivos

### 8.3 · `training_maturity_score`

- **O que é:** Score 1-10 de maturidade de treinamento combinando fase, estrutura e nível técnico
- **Por que importa para o PT:** Indica quanto "mão" o atleta precisa. Score baixo = precisa de muita orientação. Score alto = precisa de fine-tuning. Ajuda a precificar o serviço
- **Cálculo:** Ponderação: competitive_phase (30%) + training_structure (30%) + gymnastics_level (20%) + strength_level (20%). Mapeamento linear para 1-10
- **Visualização proposta:** Scorecard numérico com classificação (Iniciando competição / Competidor consistente / Atleta maduro)

### 8.4 · `injury_risk_flags`

- **O que é:** Lista de condições reportadas com classificação de risco
- **Por que importa para o PT:** Visão imediata de restrições antes de programar. Ombro = cuidado com overhead volume. Rabdo = monitorar CPK
- **Cálculo:** Direto de Q6 com classificação (informativo / safety)
- **Visualização proposta:** Lista com semáforo (🟡 informativo / 🔴 safety)

### 8.5 · `lead_quality_score`

- **O que é:** Score de qualidade do lead para o PT (quão provável é converter em cliente pagante)
- **Por que importa para o PT:** Priorização. Atleta de elite com programação individual = provavelmente já tem coach → lead frio. Atleta regional que só faz WOD = lead quente para coaching
- **Cálculo:** Heurística: higher tier + lower training structure = higher lead quality (mais precisa de ajuda). Elite + structured = lower (já tem suporte)
- **Visualização proposta:** Score numérico simples com estrelas (★★★★☆)

---

## 9 · Pilares do relatório

### Pilar 1 · Programação Inteligente

- **Subtitle:** "Treinar mais nem sempre é treinar melhor"
- **Conceito central:** O diferencial competitivo não é volume — é periodização. Ciclos de força, skill e engine devem ser organizados por prioridade, não misturados aleatoriamente. O gargalo identificado define o foco do próximo bloco de treino.
- **Evidência científica:** Concurrent training periodization para CrossFit (HWPO methodology; Conquer Athlete programming principles). Bellar et al. (2015): força é o preditor dominante de performance em benchmarks — priorizar ciclos de força para quem está abaixo dos benchmarks competitivos.
- **Placeholders esperados:** `[weakest_pillar]`, `[priority_action]`, `[priority_timeframe]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):**
  "Seu ponto de atenção agora é [weakest_pillar]. Isso não significa abandonar o resto — significa que nas próximas [priority_timeframe], o foco principal vai pra esse pilar. Pense assim: quando o box programa um WOD genérico, ele atende todo mundo razoavelmente. Mas um competidor precisa de tratamento cirúrgico nos gaps. [profissional_nome] pode montar um plano que ataque [weakest_pillar] sem sacrificar seus pontos fortes."
- **Exemplo de texto técnico (35 palavras):**
  "Gap prioritário: [weakest_pillar]. Recomenda-se bloco de ênfase de [priority_timeframe] com periodização concorrente — manutenção nos demais pilares, progressão linear no pilar-alvo. Reavaliação via benchmark WOD pós-ciclo."

### Pilar 2 · Eficiência Técnica

- **Subtitle:** "Movimentos limpos economizam energia quando importa"
- **Conceito central:** Em competição, eficiência técnica é a diferença entre terminar forte ou entrar em débito. Cada rep desperdiçada em um movimento ineficiente custa oxigênio e tempo. Ginástica e Olympic lifts são os maiores ladrões de eficiência. O relatório foca no nível técnico atual e no próximo "unlock" do atleta.
- **Evidência científica:** Principio de economia de movimento em esportes de endurance (Saunders et al., 2004 — adaptado para CrossFit). Progressões ginásticas baseadas em pré-requisitos neurais (força strict → kipping → cycling).
- **Placeholders esperados:** `[gymnastics_class]`, `[next_skill]`, `[strength_class]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):**
  "Seu nível ginástico atual é [gymnastics_class]. O próximo movimento pra você desbloquear é [next_skill] — e isso vai abrir eventos inteiros que hoje são limitantes. A chave não é 'tentar até sair' — é construir os pré-requisitos com método. Força strict primeiro, depois timing de kip, depois cycling sob fadiga. [profissional_nome] pode montar uma progressão que respeita seu nível atual e acelera o próximo degrau."
- **Exemplo de texto técnico (35 palavras):**
  "Classificação ginástica: [gymnastics_class]. Próximo unlock: [next_skill]. Protocolo sugerido: 4-6 semanas de progressão strict (EMOMs + sets submáximos) antes de introduzir kipping em volume. Reavaliação em 30 dias."

### Pilar 3 · Recuperação e Sustentabilidade

- **Subtitle:** "Consistência derrota intensidade — sempre"
- **Conceito central:** O volume de treino competitivo exige recuperação proporcional. Atletas que treinam 5-6x/semana sem gestão de carga acumulam fadiga, aumentam risco de lesão e estagnam. Sono, nutrição, mobilidade e deload não são "extras" — são parte do programa. O relatório contextualiza recuperação como estratégia competitiva, não como fraqueza.
- **Evidência científica:** Gabbett (2016) — training load management e acute:chronic workload ratio. Taxa de lesão 5x maior em competidores vs iniciantes (PMC 2019). Relação entre sleep debt e performance (Mah et al., 2011).
- **Placeholders esperados:** `[water_ml]`, `[training_structure]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):**
  "Treinar duro é fácil — treinar consistente é o desafio real. Se você está fazendo [training_structure], seu corpo precisa de recuperação proporcional ao volume. Isso significa: no mínimo 7h de sono, [water_ml] de água por dia, e mobilidade como parte do treino (não como opção). Um deload a cada 4-6 semanas não é frescura — é estratégia. [profissional_nome] pode calibrar seu volume ideal."
- **Exemplo de texto técnico (35 palavras):**
  "Volume atual compatível com [training_structure]. Recomendação: monitorar acute:chronic workload ratio (Gabbett), deload programado a cada 4-6 semanas, mínimo 7h de sono. Hidratação-alvo: [water_ml]/dia."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Avaliação para praticantes de CrossFit com intenção competitiva — de atletas de campeonatos de box até candidatos a Quarterfinals/Semifinals. Foco em diagnóstico de gaps (ginástica, força, motor, mental), periodização e gestão de volume."

- **narrativeArc:**
  1. Abertura: Validar a identidade competitiva do atleta ("você já está no jogo")
  2. Diagnóstico: Apresentar o perfil multidimensional (radar) — forte onde, fraco onde
  3. Gargalo: Aprofundar no limitante principal com dados concretos
  4. Ação prioritária: A mudança #1 para as próximas semanas
  5. Pilares: 3 blocos de recomendação (programação, técnica, recuperação)
  6. Ponte para o profissional: "para montar o plano certo para seu caso, converse com [profissional_nome]"

- **terminology:** WOD, metcon, engine, PR, RX, scaled, benchmark, AMRAP, EMOM, 1RM, cycling (de reps), kipping, strict, deficit, unbroken, time cap, chipper, couplet, triplet, assault bike, rower, ski erg, barbell complex, squat clean, snatch, thruster, muscle-up, HSPU, handstand walk, toes-to-bar, box jump, wall ball, double-under, rope climb

- **forbiddenTerms:**
  - "exercício" (usar "treino" ou "movimento") — competidores não "fazem exercício"
  - "academia" (usar "box") — CrossFit tem identidade forte anti-academia
  - "repetição" isolada (usar "rep") — jargão universal
  - "cardio" (usar "engine" ou "capacidade aeróbia") — "cardio" é de academia
  - "você é iniciante" / "nível básico" — mesmo developing é competidor, não iniciante
  - "tome cuidado" / "não force" — tom paternalista que afasta competidores
  - "queimar gordura" / "emagrecer" — não é o objetivo deste público
  - "suplemento milagroso" / "segredo" — linguagem de marketing que destrói credibilidade

- **recommendedTone:** "Direto, técnico mas acessível, como um coach experiente falando com um atleta que respeita. Valida o esforço sem bajulação. Aponta gaps sem julgamento. Sempre conecta o diagnóstico com ação concreta. Zero motivacional vazio."

- **pillarGuidance:**
  1. "Pilar Programação: foque na relação entre o gargalo identificado e a estrutura de treino atual. Se treina só WOD, explique por que precisa de trabalho direcionado. Se já tem programação, foque em validar ou questionar a priorização."
  2. "Pilar Técnica: foque no nível ginástico atual e no próximo unlock. Seja específico sobre o caminho de progressão. Se o atleta é advanced, foque em eficiência de cycling e pacing em vez de progressão de movimentos."
  3. "Pilar Recuperação: normalize recuperação como estratégia competitiva, não como fraqueza. Atletas competitivos frequentemente resistem a descanso — posicione deload e sono como vantagem competitiva."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `very_active` — competidores de CrossFit treinam 5-6x/semana com sessões de alta intensidade (60-90min). Mesmo o tier mais baixo (box competitor, class_only) treina pelo menos 4x/semana em alta intensidade.

- **activityMapping:** Não mapeado diretamente por nenhuma pergunta. O default `very_active` se aplica a todos os tiers competitivos. Se `training_structure == class_only`, poderia ser `moderately_active`, mas o contexto competitivo (+ trabalho extra informal não declarado) justifica manter `very_active` como default uniforme.

---

## 12 · Notas de design (decisões não-óbvias)

### Por que "Competitivo" e não "Performance"

"Performance" é genérico — qualquer modalidade tem "performance". "Competitivo" é o termo que a comunidade brasileira usa para se autodescrever. No hub, o card vai mostrar apenas "Competitivo" (a modalidade CrossFit já foi selecionada), criando identificação imediata.

### Por que NÃO incluí pergunta sobre nutrição

Nutrição é relevante para competidores, mas: (a) é transversal (afeta todos os pilares), (b) uma pergunta de "como você come?" com 4 opções simplifica demais um tema complexo, (c) incluí-la geraria expectativa de prescrição dietética no relatório, o que é escopo de nutricionista. Nutrição aparece como subtema no pilar de Recuperação e na nota da IA, mas não como pergunta dedicada.

### Por que o gargalo é single_choice e não multiple_choice

Forçar a escolha de UM gargalo gera dado mais valioso. Quando tudo é prioridade, nada é. A pergunta pede "o que mais te limita", não "o que você quer melhorar" — essa formulação empurra o atleta para honestidade. O relatório pode abordar gaps secundários na narrativa da IA, mas o foco principal é derivado dessa única escolha.

### Por que muscle-up é o divisor dos tiers ginásticos

Muscle-up (barra ou argola) é universalmente reconhecido como o "gate" para competição real em CrossFit. Eventos de Quarterfinals e campeonatos regionais quase sempre incluem muscle-up. Sem esse movimento, o atleta é eliminado de eventos inteiros. Os outros movimentos (HSPU, HSW) são diferenciadores de tier, mas muscle-up é o pré-requisito.

### Por que não incluí Motor 7 (métricas/ferramentas)

Considerei incluir perguntas sobre pace de 2K/5K row, assault bike cals, ou uso de HR monitor. Descartei porque: (a) a maioria dos competidores brasileiros não usa power meter ou HR em metcons, (b) pedir tempos numéricos de ergometer requer que o atleta tenha testado recentemente (muitos não têm), (c) os benchmarks de ginástica + força já capturam indiretamente a capacidade do atleta. O motor aeróbio aparece como opção de gargalo (Q2) e é endereçado no relatório via pilares, sem necessidade de input numérico.

### Por que ombro e joelho/lombar NÃO são safety triggers

Lesões de ombro e joelho são extremamente comuns em CrossFit competitivo (25% e 27% respectivamente). Tratar como safety trigger bloquearia uma proporção inaceitável de relatórios. São condições de manejo pelo coach/PT, não de emergência médica. Apenas condição cardíaca e histórico de rabdomiólise são safety — ambos exigem avaliação médica antes de intensificar treino.

### Sobre os benchmarks de força (1.5x e 2x BW)

Os cortes são amplamente usados pela comunidade competitiva mas são heurísticos, não validados cientificamente como thresholds exatos. Para mulheres, os ratios são proporcionalmente menores (~1.2x e 1.7x). A IA deve calibrar a interpretação usando o sexo de `basics`. Isso está documentado como nota para implementação, não como pergunta extra.

---

## 13 · Pendências

### Incertezas

- **Calibração dos tiers de força para mulheres:** Os cortes 1.5x/2x BW são referenciais masculinos. Para mulheres, os benchmarks competitivos são diferentes (~1.2x/1.7x). A IA precisa de lógica condicional baseada em sexo de `basics`. Confirmar cortes com coach de CrossFit feminino competitivo.

### Libs não identificadas

- **Radar chart para competitor_profile:** A lib de charts (recharts via shadcn) suporta radar nativamente? Precisa confirmar.
- **Cálculo de hydration_target:** Simples (35-40ml × peso), mas confirmar se alguma lib de fitness já implementa com ajustes por clima/altitude.

### Decisões pendentes de validação profissional

- **Branches realmente mudam o suficiente?** Os 3 branches mudam tom e referências, mas não adicionam/removem perguntas. Isso é intencional (manter formulário uniforme para todos os tiers), mas vale validar com coach competitivo se o relatório diferenciado é suficiente.
- **Rhabdo como safety trigger:** É raro o suficiente para não impactar completion rate, mas vale validar com médico esportivo se o histórico de rabdo realmente exige bloqueio de relatório ou se é melhor como flag informativo pro PT.

### Casos de borda

- **Atleta de Games-level:** Capturado por `quarterfinals_plus`, mas o relatório online tem valor limitado. O branch direciona para atendimento presencial, mas o profissional usando o template pode não ter capacidade para esse nível. Documentar como limitação conhecida.
- **Atleta multi-modal (CrossFit + powerlifting, CrossFit + corrida):** Não endereçado. Esses atletas provavelmente se encaixam em um dos tiers mas têm necessidades híbridas. Futuro: template de "CrossFit + outra modalidade" ou customização pelo PT.
- **Atleta adolescente (<18):** Não endereçado explicitamente. Adolescentes competem em Teen divisions mas têm considerações de desenvolvimento. Se surgir demanda, pode ser branch ou template #24.

---

## 14 · Fontes citadas

1. **Bellar D. et al. (2015).** "The relationship of aerobic capacity, anaerobic peak power, and experience to performance in CrossFit exercise." _Biology of Sport_, 32(4), 315-320. PMC4577560 — Demonstra que CrossFit Total (força) é o melhor preditor de performance em benchmark WODs.

2. **Weisenthal B. et al. (2014).** "Injury rate and patterns among CrossFit athletes." _Orthopaedic Journal of Sports Medicine_, 2(4). PMC4555972 — Meta-análise de taxa de lesão (0.27-3.3/1000h), distribuição por articulação (ombro 25%, lombar 14%, joelho 13%).

3. **Smith M. et al. (2013).** "CrossFit-Based High-Intensity Power Training Improves Maximal Aerobic Fitness and Body Composition." _Journal of Strength and Conditioning Research_, 27(11), 3159-3172 — VO2max melhora ~14% em 10 semanas de CrossFit.

4. **Tibana R. et al. (2016).** "Epidemiological Profile of Brazilian CrossFit Athletes." _Open Access Journal of Sports Medicine_, 7, 31-38. PMC5010098 — Perfil demográfico brasileiro: n=566, 32.7% competem, 60% homens, 25-35 anos, classes A-B.

5. **Gabbett T.J. (2016).** "The training-injury prevention paradox: should athletes be training smarter and harder?" _British Journal of Sports Medicine_, 50(5), 273-280 — Acute:chronic workload ratio e gestão de carga para prevenção de lesões.

6. **Mah C.D. et al. (2011).** "The effects of sleep extension on the athletic performance of collegiate basketball players." _Sleep_, 34(7), 943-950 — Relação entre sono e performance atlética.

7. **CrossFit Games Season Guide 2026.** CrossFit Inc. — Estrutura de qualificação: Open → Quarterfinals → Semifinals → Games. Copa Sur como semifinal da América Latina.

8. **HWPO Training / Conquer Athlete.** — Metodologias de periodização concorrente para CrossFit competitivo. Referência para estrutura de blocos (força, skill, engine).

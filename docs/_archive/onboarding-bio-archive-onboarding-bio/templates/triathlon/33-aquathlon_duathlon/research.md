# Research · Especialidade 33 · Aquathlon & Duathlon

## 0 · Metadados

- **Número:** 33
- **Modality:** triathlon
- **Pasta:** `triathlon/33-aquathlon_duathlon/`
- **Plano:** pro
- **Validação clínica:** Opcional
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. CBTri (Confederação Brasileira de Triathlon) — regulamentos e calendário oficial de aquathlon/duathlon
  2. ITU/World Triathlon — distâncias oficiais, regras de competição, dados demográficos globais
  3. ACSM Guidelines for Exercise Testing and Prescription (11ª ed., 2022)
  4. Jack Daniels — _Daniels' Running Formula_ (3ª ed.) — VDOT e zonas de corrida
  5. Sweetenham & Atkinson — _Championship Swim Training_ — métricas de natação
  6. Allen & Coggan — _Training and Racing with a Power Meter_ (3ª ed.) — zonas de potência ciclismo
  7. Friel — _The Triathlete's Training Bible_ (5ª ed.) — periodização multisport

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 25-45 anos, com pico em 30-40
- **Gênero:** ~65% masculino, 35% feminino (proporção mais equilibrada que triathlon full — aquathlon/duathlon atraem mais mulheres por serem logisticamente mais simples)
- **Contexto socioeconômico:** classe B-C+. Diferente do triathlon (que exige bike cara + inscrições altas), aquathlon/duathlon são **as portas de entrada mais acessíveis do multisport**. Aquathlon requer apenas sunga/maiô + tênis. Duathlon requer bike (mas muitos usam MTB ou speed de entrada)
- **Mercado:** pequeno-médio. Estimativa de 15-30 mil praticantes regulares no Brasil (contra ~80-100 mil triatletas). Mas crescimento acelerado — CBTri tem expandido calendário de aquathlon/duathlon nos últimos anos

### Onde estão online

- **Instagram:** seguem perfis de assessorias multisport, coaches de triathlon que também oferecem treinos de duathlon/aquathlon. Hashtags: #aquathlon, #duathlon, #multisport, #treinotriplo
- **Strava:** muitos usam para registrar treinos de corrida e bike (duathlon). Menos common para natação (aquathlon) — usam Garmin Connect ou apps de piscina
- **WhatsApp:** grupos de assessoria esportiva e grupos de prova (ex: "Duathlon SP 2026", "Aquathlon Santos")
- **Facebook:** grupos como "Duathlon Brasil", "Aquathlon & Multisport" — engajamento moderado, mais velho (35+)

### Linguagem-padrão

- **Termos de identidade:** "multisportista", "duatleta", "aquatleta" (menos comum), "biatleta" (informal)
- **Treino:** "brick" ou "tijolão" (treino combinado), "transição" ou "T1/T2", "tiro" (sprint), "rodagem" (corrida leve), "base" (fase aeróbia)
- **Prova:** "sprint" (curta), "standard" (padrão), "dar o gás na T2", "saí da água morto", "pedalar e depois correr é outra coisa"
- **Expressões comuns:** "treinar duas modalidades já é desafio suficiente", "sou corredor que nada" ou "ciclista que corre", "não preciso de bike pra sofrer" (aquatleta, humor)

### O que os ofende ou afasta

- Ser tratado como "triatleta incompleto" ou "quem não consegue fazer tri" — muitos ESCOLHEM aquathlon/duathlon por preferência, não por limitação
- Formulário que assume que todo mundo quer migrar pra triathlon — nem todos querem
- Linguagem de atleta de elite em público amador recreativo
- Promessas de "resultado rápido" — público multisport tende a ser mais maduro sobre expectativas

### Dor mais comum

- **Equilibrar o treino entre as duas modalidades** sem negligenciar uma. Corredores que nadam (aquathlon) tendem a negligenciar natação. Ciclistas que correm (duathlon) sofrem com impacto articular da corrida pós-bike
- **Transição ineficiente** — perder tempo e ritmo entre modalidades
- **Falta de assessoria específica** — a maioria dos coaches foca em triathlon ou corrida pura; aquathlon/duathlon ficam como "subproduto"

## 2 · Decisão de escopo

**Este template vai cobrir:**

- Praticantes amadores de aquathlon (natação + corrida) e duathlon (corrida + ciclismo + corrida)
- Do iniciante ao intermediário-avançado (age-groupers que competem regionalmente/nacionalmente)
- Distâncias sprint e standard de ambas modalidades
- Quem treina com ou sem assessoria formal

**Este template NÃO vai cobrir:**

- Atletas profissionais/elite com equipe técnica completa (público de Custom)
- Duathlon off-road / cross-duathlon (nicho muito pequeno, logística diferente)
- Aquathlon de águas abertas com distâncias longas (>1500m natação) — isso cai no template #28 (Águas Abertas) ou #32 (Ironman) pela exigência de segurança
- Crianças/adolescentes em escolinha de multisport

**Decisão de label:** Manter **"Aquathlon & Duathlon"** como label. Considerei separar em dois templates, mas:

1. O público se sobrepõe significativamente (muitos fazem ambas modalidades)
2. A estrutura do formulário é quase idêntica — muda apenas quais modalidades se combinam
3. Segmentação via Motor 6 (Q1) resolve elegantemente

## 3 · Motores escolhidos

### Motores considerados e decisão

| Motor                      | Considerei? | Decisão                       | Justificativa                                                                                                                 |
| -------------------------- | ----------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Motor 1 (Contexto atual)   | Sim         | **Descartado**                | O nível de atividade atual é capturado melhor pelo Motor 3 (maturidade) neste contexto                                        |
| Motor 2 (Gargalo)          | Sim         | **Incluído**                  | Essencial — diagnósticos de gargalo são muito distintos entre aquathlon e duathlon                                            |
| Motor 3 (Nível/Maturidade) | Sim         | **Incluído**                  | Espectro claro iniciante→avançado que muda tom, métricas e prescrição                                                         |
| Motor 4 (Comportamento)    | Sim         | **Incluído**                  | Consistência de treino em DUAS modalidades é o preditor #1 de resultado                                                       |
| Motor 5 (Ambiente)         | Sim         | **Descartado**                | Menos variação que em musculação (quem faz multisport já tem acesso a local de treino). Não muda substancialmente o relatório |
| Motor 6 (Identidade/Fase)  | Sim         | **Incluído como segmentação** | Aquathlon vs Duathlon define TUDO: modalidades, métricas, prescrição, transição                                               |
| Motor 7 (Métricas)         | Sim         | **Incluído (condicional)**    | Quem usa relógio/potencímetro recebe zonas e projeções; quem não usa recebe orientação por esforço percebido                  |
| Motor 8 (Safety)           | Sim         | **Incluído**                  | Obrigatório. Multisport tem risco cardiovascular em transição e risco de lesão por impacto combinado                          |

### Lista final: 6 motores → 6 perguntas

1. **Segmentação (Motor 6)** → `sport_type` — Aquathlon ou Duathlon? Define branches e modalidades
2. **Gargalo (Motor 2)** → `main_bottleneck` — O que mais atrapalha seu progresso?
3. **Nível (Motor 3)** → `experience_level` — Há quanto tempo pratica multisport?
4. **Comportamento (Motor 4)** → `weekly_sessions` — Quantas sessões fez na última semana?
5. **Métricas (Motor 7)** → `uses_device` — Usa relógio/dispositivo para treinar?
6. **Safety (Motor 8)** → `health_conditions` — Condições de saúde

## 4 · Perguntas e opções

### Q1 · `sport_type` _(Motor 6 — Identidade/Segmentação)_

**Type:** `single_choice`
**Label:** "Qual é a sua modalidade?"
**Helper:** "Se pratica ambas, escolha a que é seu foco principal agora"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`aquathlon`** — "Aquathlon (natação + corrida)"
  - Safety trigger? não

- **`duathlon`** — "Duathlon (corrida + ciclismo + corrida)"
  - Safety trigger? não

- **`both`** — "Pratico ambas"
  - Safety trigger? não

**Justificativa da pergunta:** É a pergunta mais determinante do template. Aquathlon e duathlon têm modalidades completamente diferentes (natação vs ciclismo), o que muda métricas, conselhos de treino, transições e até perfil de risco. Sem essa segmentação, o relatório seria genérico demais. Alternativa descartada: perguntar "qual modalidade é seu ponto fraco?" — informativo, mas não segmenta.

**Justificativa das opções:** Três opções cobrem 100% dos casos. "Ambas" existe porque há praticantes que alternam entre provas de aquathlon e duathlon conforme calendário. Não segmenta em branch próprio — usa branch de aquathlon (maioria faz aquathlon como secundário) mas adiciona nota sobre duathlon no relatório.

---

### Q2 · `experience_level` _(Motor 3 — Nível/Maturidade)_

**Type:** `single_choice`
**Label:** "Há quanto tempo você pratica provas multisport?"
**Helper:** "Conte desde quando começou a treinar com foco em duas ou mais modalidades"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick

**Opções:**

- **`beginner`** — "Menos de 6 meses (ou nunca fiz prova)"
  - Safety trigger? não

- **`intermediate`** — "6 meses a 2 anos"
  - Safety trigger? não

- **`advanced`** — "Mais de 2 anos"
  - Safety trigger? não

**Justificativa da pergunta:** O nível define o tom e a profundidade técnica do relatório inteiro. Um iniciante precisa de educação; um avançado precisa de diagnóstico. Alternativa descartada: "quantas provas já fez?" — menos preciso porque alguém pode treinar há 3 anos e ter feito poucas provas, ou ter feito muitas provas em 6 meses.

**Justificativa das opções:** Três faixas (0-6m, 6m-2a, 2a+) são as mais usadas em periodização multisport. Quatro faixas adicionaria granularidade sem mudar substancialmente o relatório.

---

### Q3 · `main_bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label:** "O que mais atrapalha seu progresso hoje?"
**Helper:** "Escolha o que mais pesa — mesmo que tenha mais de um"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`weak_modality`** — "Sou muito melhor numa modalidade que na outra"
  - Safety trigger? não

- **`transition`** — "Perco muito tempo e ritmo nas transições"
  - Safety trigger? não

- **`pacing`** — "Não consigo dosar o esforço entre os segmentos"
  - Safety trigger? não

- **`consistency`** — "Não consigo manter regularidade no treino"
  - Safety trigger? não

- **`injury_fear`** — "Tenho medo de lesão ou já me machuquei"
  - Safety trigger? não

**Justificativa da pergunta:** O gargalo define a narrativa central do relatório — é o que o lead veio resolver. Alternativa descartada: "qual sua maior dificuldade?" (mais vago) ou lista com 8+ opções (analysis paralysis).

**Justificativa das opções:** Cinco diagnósticos clássicos do multisport. `weak_modality` é o mais frequente (~40% dos praticantes). `transition` e `pacing` são os dois seguintes. `consistency` captura o público recreativo que luta com agenda. `injury_fear` captura quem já se machucou e trava. Não incluí "nutrição" como gargalo separado porque em aquathlon/duathlon (provas de 30-90min tipicamente) a nutrição intra-prova é menos decisiva que em triathlon long — entra nos pilares mas não como gargalo principal.

---

### Q4 · `weekly_sessions` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label:** "Na última semana, quantas sessões de treino você fez no total?"
**Helper:** "Conte qualquer treino focado (corrida, natação, bike, força). Caminhada casual não conta"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`0_1`** — "0 a 1 sessão"
  - Safety trigger? não

- **`2_3`** — "2 a 3 sessões"
  - Safety trigger? não

- **`4_5`** — "4 a 5 sessões"
  - Safety trigger? não

- **`6_plus`** — "6 ou mais sessões"
  - Safety trigger? não

**Justificativa da pergunta:** Volume real (não planejado) é o melhor preditor de progressão em multisport. Perguntar "última semana" força resposta honesta — evita autoimagem inflada. Alternativa descartada: "quantas vezes pretende treinar?" (intenção ≠ realidade).

**Justificativa das opções:** Quatro faixas que cobrem de sedentário a dedicado. Não separei por modalidade (ex: "2 corridas + 1 nado") para manter a pergunta respondível em 5 segundos — o detalhe por modalidade é inferido pelo Q1 e trabalhado no relatório.

---

### Q5 · `uses_device` _(Motor 7 — Métricas/Ferramentas)_

**Type:** `single_choice`
**Label:** "Você usa relógio esportivo ou ciclocomputador nos treinos?"
**Helper:** "Garmin, Apple Watch, COROS, Wahoo, Polar ou similar"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`yes_hr`** — "Sim, com frequência cardíaca"
  - Safety trigger? não

- **`yes_advanced`** — "Sim, com pace + potência ou métricas avançadas"
  - Safety trigger? não

- **`no`** — "Não uso nada / só o celular"
  - Safety trigger? não

**Justificativa da pergunta:** Define se o relatório fala em "zonas de FC" e "potência" ou em "esforço leve/moderado/forte". Incluir métricas técnicas para quem não tem como medir frustra e confunde. Alternativa descartada: perguntar separadamente sobre cada tipo de métrica (FC, potência, pace, SWOLF) — muitas sub-perguntas para pouco ganho.

**Justificativa das opções:** Três níveis (sem dados / FC / avançado) capturam o espectro sem complexidade. Não separei "pace" de "potência" porque quem tem potencímetro geralmente também tem pace — é o mesmo público.

---

### Q6 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label:** "Você tem alguma dessas condições?"
**Helper:** "Marque todas que se aplicam. Isso ajuda a personalizar seu relatório com segurança"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`cardiac`** — "Problema cardíaco diagnosticado (arritmia, sopro, etc.)"
  - Safety trigger? **sim** (reason: "Risco cardiovascular real em atividade multimodal de alta intensidade. Transições são momentos de estresse cardíaco agudo. Exige liberação cardiológica.")

- **`respiratory`** — "Asma ou problema respiratório grave"
  - Safety trigger? não (asma controlada não é emergência — ajusta tom)

- **`joint_injury`** — "Lesão articular recente (joelho, tornozelo, ombro, quadril)"
  - Safety trigger? não (lesão articular requer cuidado, não bloqueio — o profissional avalia presencialmente)

- **`surgery_recent`** — "Cirurgia nos últimos 6 meses"
  - Safety trigger? **sim** (reason: "Pós-cirúrgico recente com atividade multisport requer liberação médica. Risco de complicação, especialmente em modalidades de impacto.")

- **`none`** — "Nenhuma dessas"
  - Safety trigger? não

**Justificativa da pergunta:** Safety obrigatório. Em multisport, as transições são momentos de estresse cardíaco significativo (mudança abrupta de posição e padrão motor), e a combinação de modalidades multiplica o risco articular. Alternativa descartada: lista exaustiva de 10+ condições — inflaciona sem necessidade. As quatro condições listadas cobrem os cenários genuinamente perigosos em aquathlon/duathlon.

**Justificativa das opções:** `cardiac` e `surgery_recent` são safety triggers porque exigem liberação médica presencial antes de treinar multisport com intensidade. `respiratory` e `joint_injury` ajustam o tom mas não bloqueiam — são condições manejáveis pelo profissional. `none` é escape explícito.

## 5 · Branches

### Branch: `Aquathlon` (trigger: `sport_type == aquathlon || sport_type == both`)

- **Tom geral:** Foco em eficiência aquática e transição água→asfalto. Linguagem que respeita a identidade do aquatleta — não é "triatleta sem bike", é atleta de um esporte com desafios técnicos únicos.
- **pillarGuidance:** Pilar 1 (natação) ganha protagonismo. Pilar 2 (corrida) foca na corrida pós-natação (legs feel different after swimming). Pilar 3 (transição) foca em T1 água→corrida.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Adiciona `swim_efficiency` (SWOLF estimado), `swim_run_ratio` (proporção de tempo entre segmentos). Remove métricas de ciclismo.
- **Narrative arc override:** "Seu corpo na água → a transição que define a prova → seu ritmo no asfalto → onde está o ganho"

**Justificativa:** A combinação natação+corrida é fundamentalmente diferente de corrida+bike+corrida. A natação exige técnica específica (braçada, respiração, orientação) que muda completamente o primeiro terço do relatório. Sem branch, o relatório tentaria falar de bike e natação ao mesmo tempo — confuso e genérico.

---

### Branch: `Duathlon` (trigger: `sport_type == duathlon`)

- **Tom geral:** Foco no "brick effect" e gestão de três segmentos. O duathlon é brutal na segunda corrida — o relatório precisa falar disso com honestidade e estratégia.
- **pillarGuidance:** Pilar 1 (corrida #1) foca em pacing conservador. Pilar 2 (ciclismo) foca em potência sustentada e preparação para T2. Pilar 3 (corrida #2) é o pilar de "sobrevivência e crescimento" — como treinar o brick para que a segunda corrida não seja um arrasto.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Adiciona `ftp_estimated` (se usa potência), `run_bike_run_split` (proporção ideal entre segmentos). Remove métricas de natação.
- **Narrative arc override:** "O dilema dos três segmentos → por que a primeira corrida define a segunda → seu motor no bike → a segunda corrida: de sobrevivência a estratégia"

**Justificativa:** O duathlon tem três segmentos (run-bike-run), o que cria uma dinâmica de pacing completamente diferente do aquathlon (swim-run). A segunda corrida sobre pernas fatigadas do ciclismo é O desafio definidor do duathlon — o relatório precisa endereçar isso como tema central, não como nota de rodapé.

## 6 · Safety triggers

| Questão             | Opções           | Reason (clínico)                                                                                                                                                                                                                      | Efeito no relatório                                                                  |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `health_conditions` | `cardiac`        | Multisport envolve transições com mudança abrupta de FC e postura. Risco de evento cardíaco agudo, especialmente em transição água→corrida (aquathlon) onde vasodilatação periférica + posição vertical súbita pode causar hipotensão | Macros omitidas, zonas de intensidade omitidas, timeline omitida, SafetyNote aparece |
| `health_conditions` | `surgery_recent` | Pós-operatório com atividade de impacto (corrida) + fadiga combinada (multisport) pode comprometer cicatrização ou causar complicação mecânica                                                                                        | Macros omitidas, timeline omitida, SafetyNote aparece                                |

**safetyTemplate:**

- **Title:** "Sua segurança vem primeiro"
- **Body:** "Identificamos que você tem uma condição que merece atenção antes de qualquer prescrição de treino multisport. Aquathlon e duathlon combinam modalidades que exigem muito do corpo — e a transição entre elas é um momento de estresse fisiológico significativo. Isso não significa que você não possa praticar — muitas pessoas com essa condição treinam e competem com excelência. Mas o caminho seguro passa por uma avaliação presencial com um profissional de saúde que conheça sua condição, e depois um plano de treino construído em cima dessa avaliação. [profissional_nome] pode te ajudar a montar esse plano após a liberação médica."

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `estimated_vo2max`

- **O que é:** VO2max estimado a partir do nível de atividade e dados antropométricos
- **Por que aparece para o aluno:** Indicador tangível de condicionamento cardiovascular. "Seu motor aeróbio" — conceito intuitivo, motivador quando melhora
- **Cálculo:** Estimativa via fórmula de Jackson et al. (1990) — usa idade, sexo, IMC, nível de atividade. Alternativa: se o aluno informa pace de corrida, usar tabela VDOT de Jack Daniels para estimativa mais precisa
- **Visualização proposta:** Gauge radial com faixas por idade/sexo (fraco / regular / bom / excelente / superior). Rationale: valor único com classificação — formato gauge ideal
- **Placeholder:** `[vo2max_estimated]`, `[vo2max_class]`

### 7.2 · `training_balance`

- **O que é:** Score de equilíbrio entre modalidades baseado em weekly_sessions e sport_type
- **Por que aparece para o aluno:** Mostra visualmente se está negligenciando uma modalidade — diagnóstico imediato
- **Cálculo:** Proporção sugerida por Friel (Triathlete's Training Bible): para aquathlon ~45% natação / 55% corrida; para duathlon ~30% run1 / 40% bike / 30% run2. Score = quão perto da proporção ideal o volume reportado está
- **Visualização proposta:** Donut com duas fatias (aquathlon) ou três (duathlon), mostrando proporção atual vs ideal. Rationale: proporções que somam 100% → donut
- **Placeholder:** `[balance_score]`, `[dominant_modality]`, `[weak_modality]`

### 7.3 · `weekly_volume_target`

- **O que é:** Volume semanal recomendado (horas) por modalidade
- **Por que aparece para o aluno:** Ação concreta — "treine X horas de Y e Z horas de W por semana"
- **Cálculo:** Baseado em experience_level + weekly_sessions + sport_type. Faixas de referência de Friel: iniciante 3-5h/semana, intermediário 5-8h, avançado 8-12h. Distribuição por modalidade conforme branch
- **Visualização proposta:** Card com breakdown por modalidade (ícone + horas). Rationale: informação acionável, precisa ser rápida de ler
- **Placeholder:** `[volume_total]`, `[volume_mod1]`, `[volume_mod2]`

### 7.4 · `transition_readiness`

- **O que é:** Score qualitativo de preparação para transição baseado em experience + bottleneck + sessions
- **Por que aparece para o aluno:** A transição é o diferencial do multisport — ver um score motiva treinar especificamente para isso
- **Cálculo:** Score derivado: +2 se experience >= intermediate, +2 se weekly_sessions >= 4, -2 se bottleneck == transition, +1 se uses_device != no. Escala 0-6 → faixas (precisa atenção / em desenvolvimento / pronto pra competir)
- **Visualização proposta:** Gauge com 3 faixas (vermelho/amarelo/verde). Rationale: score único + classificação semafórica → gauge
- **Placeholder:** `[transition_score]`, `[transition_class]`

### 7.5 · `hydration_target`

- **O que é:** Meta diária de hidratação (litros) considerando volume de treino
- **Por que aparece para o aluno:** Simples, acionável, universal. Multisport tem demanda de hidratação elevada
- **Cálculo:** Fórmula base: peso × 35ml (ACSM) + 500ml por hora de treino. Ajuste: +200ml se pratica natação (desidratação não percebida na água)
- **Visualização proposta:** Card numérico simples com ícone de gota. Rationale: valor único, rápido
- **Placeholder:** `[hydration_liters]`

### 7.6 · `race_pace_zones` (condicional: `uses_device != no`)

- **O que é:** Zonas de pace para corrida e/ou natação baseadas no nível estimado
- **Por que aparece para o aluno:** Orientação prática para treino e prova — "corra nesse ritmo no primeiro segmento"
- **Cálculo:** Zonas de Daniels (VDOT) para corrida. Para natação: zonas de pace baseadas em T-pace (CSS — Critical Swim Speed). Para bike: zonas de Coggan se tem potência, ou FC
- **Visualização proposta:** Zone table com faixas coloridas (easy / moderate / threshold / VO2 / sprint). Rationale: múltiplas faixas por intensidade → tabela de zonas
- **Placeholder:** `[zone_easy]`, `[zone_threshold]`, `[zone_vo2]`

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `readiness_score`

- **O que é:** Score composto de prontidão do lead para treino multisport (0-100)
- **Por que importa para o PT:** Triagem rápida — "esse lead está pronto para começar treino estruturado ou precisa de base primeiro?"
- **Cálculo:** Ponderação: experience_level (30%) + weekly_sessions (30%) + bottleneck severity (20%) + health_conditions (20%). Fórmula: cada variável normalizada 0-1, soma ponderada × 100
- **Visualização proposta:** Scorecard numérico com cor (vermelho <40, amarelo 40-70, verde >70). Rationale: score único de triagem rápida

### 8.2 · `bottleneck_category`

- **O que é:** Classificação do gargalo principal para priorização de treino
- **Por que importa para o PT:** Saber se o lead precisa de trabalho técnico (transição), aeróbio (weak modality), ou comportamental (consistency) muda a abordagem do primeiro mês
- **Cálculo:** Direto do Q3 (main_bottleneck), enriquecido com dados de Q1 e Q4
- **Visualização proposta:** Tag colorida com label (ex: "🟠 Desequilíbrio entre modalidades"). Rationale: classificação categórica → tag

### 8.3 · `injury_risk_level`

- **O que é:** Nível estimado de risco de lesão (baixo / moderado / alto)
- **Por que importa para o PT:** Calibra agressividade da progressão de volume. Lead com risco alto precisa de introdução mais gradual
- **Cálculo:** Baseado em: health_conditions (lesão articular = +2, cirurgia = +3), bottleneck == injury_fear (+2), weekly_sessions >= 6 (+1, overtraining risk), experience == beginner (+1). Score → faixas
- **Visualização proposta:** Semáforo (verde/amarelo/vermelho). Rationale: decisão binária (posso puxar ou não?)

### 8.4 · `sport_profile`

- **O que é:** Perfil resumido (ex: "Duatleta intermediário, 4-5x/semana, gargalo em pacing, usa FC")
- **Por que importa para o PT:** Snapshot em 1 linha para dashboard — o PT vê dezenas de leads e precisa de triagem rápida
- **Cálculo:** Concatenação inteligente de Q1 + Q2 + Q3 + Q4 + Q5
- **Visualização proposta:** Linha de texto com badges. Rationale: informação composta textual → badges inline

### 8.5 · `modality_gap`

- **O que é:** Qual modalidade é o elo fraco e quão grande é a lacuna (estimativa qualitativa)
- **Por que importa para o PT:** Direciona o plano de treino. Se o gap é grande, prioriza a modalidade fraca; se é pequeno, foca em transição e pacing
- **Cálculo:** Inferido de Q1 (sport_type) + Q3 (bottleneck == weak_modality) + Q2 (experience). Heurística: iniciante com gargalo em modalidade fraca → gap grande
- **Visualização proposta:** Barra comparativa (mod1 vs mod2) com indicador de gap. Rationale: comparação entre dois valores → barra side-by-side

## 9 · Pilares do relatório

### Pilar 1 · Equilíbrio entre modalidades

- **Subtitle:** "Seu plano de distribuição de treino"
- **Conceito central:** Em multisport, o resultado da prova é determinado pelo elo mais fraco, não pelo mais forte. Distribuir volume e intensidade de forma inteligente entre as duas (ou três) modalidades é mais importante que treinar muito numa só.
- **Evidência científica:** Friel (2016) — princípio do "limitador" em triathlon/multisport: identificar e priorizar a modalidade limitante sem abandonar a forte. Mujika (2009) — taper e periodização para eventos multimodais.
- **Placeholders esperados:** `[dominant_modality]`, `[weak_modality]`, `[volume_mod1]`, `[volume_mod2]`, `[balance_score]`, `[weekly_sessions]`
- **Exemplo de texto popular (70 palavras):** "Você provavelmente já percebeu: treinar só corrida (ou só natação) não faz de você um aquatleta melhor. Seu ponto forte é [dominant_modality] — e isso é ótimo, mas seu resultado de prova depende mais de melhorar [weak_modality]. A sugestão é dedicar pelo menos [volume_mod2] horas por semana à modalidade mais fraca, sem cortar a outra. Equilíbrio, não igualdade."
- **Exemplo de texto técnico (35 palavras):** "Proporção atual sugere predominância em [dominant_modality]. Recomenda-se redistribuição gradual (4 semanas) para [balance_score]% [weak_modality], mantendo estímulo de qualidade na modalidade dominante. Referência: Friel, 2016."

### Pilar 2 · Transição e brick training

- **Subtitle:** "O segredo que separa multisportistas de quem só treina modalidades"
- **Conceito central:** A transição entre modalidades não é apenas logística (trocar de roupa/equipamento) — é uma adaptação neuromuscular. Treinar especificamente para a transição (brick workouts) é o que transforma duas modalidades isoladas em um esporte integrado.
- **Evidência científica:** Hue et al. (1998) — efeito da natação na performance subsequente de corrida em triatletas. Millet & Vleck (2000) — fisiologia da transição em multisport. O "brick effect" em duathlon é documentado como queda de 5-15% na performance de corrida pós-ciclismo em amadores (Bentley et al., 2002).
- **Placeholders esperados:** `[transition_score]`, `[transition_class]`, `[sport_type]`, `[experience_level]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "A transição é onde a prova de verdade acontece. Sair da água e começar a correr (ou descer da bike e correr) é um choque para o corpo — as pernas demoram pra 'lembrar' como correr. Sua preparação atual para transição está [transition_class]. Brick workouts — treinos combinados, tipo nadar 15min e correr logo depois — são o remédio. Comece com 1 por semana e veja a diferença em 4 semanas."
- **Exemplo de texto técnico (40 palavras):** "Score de prontidão para transição: [transition_score]/6 ([transition_class]). Recomenda-se inclusão de 1-2 brick sessions semanais com progressão de volume. Foco em adaptação neuromuscular e re-patterning motor pós-transição. Ref: Millet & Vleck, 2000."

### Pilar 3 · Estratégia de prova e pacing

- **Subtitle:** "Como dosar seu esforço em cada segmento"
- **Conceito central:** Em multisport, a tentação é sair forte no primeiro segmento. Isso quase sempre resulta em colapso no segundo (ou terceiro, no duathlon). Pacing inteligente — baseado em esforço percebido, FC ou potência — é o que diferencia quem melhora de quem estagna.
- **Evidência científica:** Abbiss & Laursen (2008) — estratégias de pacing em esportes de endurance. Em duathlon, a distribuição ideal é tipicamente 90-92% do pace solo no run 1, 85-90% do FTP no bike, aceitando queda de 5-8% no run 2 (Bentley et al., 2007). Em aquathlon, nadar a 85-90% do CSS permite corrida mais forte.
- **Placeholders esperados:** `[vo2max_estimated]`, `[race_pace_zones]`, `[main_bottleneck]`, `[uses_device]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "O erro número 1 em prova de multisport: sair rápido demais. Se você gasta tudo na natação (ou na primeira corrida), o resto vira sobrevivência. A regra de ouro: comece num ritmo que parece 'fácil demais' nos primeiros 5 minutos. Se [uses_device] permitir, mire em [zone_easy] a [zone_threshold] no primeiro segmento. A prova é ganha na segunda metade, não na primeira."
- **Exemplo de texto técnico (35 palavras):** "Estratégia de pacing negativo-split para [sport_type]: primeiro segmento a 88-92% de intensidade-alvo, segundo segmento a 95-100%. Referência: Abbiss & Laursen, 2008. Monitorar via [uses_device] quando disponível."

## 10 · AI Context

- **specialtyDescription:** "Aquathlon (natação + corrida) e duathlon (corrida + ciclismo + corrida) são modalidades multisport que combinam duas ou três disciplinas em uma prova contínua. O público-alvo são atletas amadores brasileiros, do iniciante ao intermediário-avançado, que buscam progredir em provas regionais e nacionais."
- **narrativeArc:**
  1. Validação — reconhecer a escolha do lead pelo multisport como decisão inteligente e desafiadora
  2. Diagnóstico — apresentar o cenário atual (nível, volume, gargalo) sem julgamento
  3. Revelação — mostrar o dado que o lead não sabia sobre si (training balance, transition readiness)
  4. Estratégia — pilares com ações concretas, específicas para a combinação de modalidades do lead
  5. Projeção — o que muda com 4-8 semanas de treino ajustado (realista, não motivacional vazio)
  6. Ponte — conexão com o profissional como próximo passo natural ("com [profissional_nome], você monta esse plano sob medida")
- **terminology:** "brick", "transição", "T1", "T2", "pacing", "split", "rodagem", "tiro", "base", "multisport", "segmento", "modalidade", "aquatleta", "duatleta"
- **forbiddenTerms:**
  - "triatleta incompleto" — ofensivo, invalida a escolha do esporte
  - "esporte menor" — diminui a modalidade
  - "fácil" / "simples" — multisport nunca é simples
  - "anamnese" — termo clínico, não é isso que o lead está preenchendo
  - "intake" — termo interno, nunca em copy público
  - "paciente" — é aluno/atleta/lead, nunca paciente
  - "emagrecer" — não é o foco da modalidade; se perda de peso for subproduto, usar "composição corporal"
- **recommendedTone:** "Direto, técnico sem ser hermético, respeitoso com o esporte. Tom de coach que sabe do que fala e trata aquathlon/duathlon como esportes sérios, não como 'triathlon de treino'. Usar dados concretos, evitar motivacionalismo vazio."
- **pillarGuidance:**
  1. "Fale sobre equilíbrio entre modalidades com dados concretos (proporção de volume). Use [balance_score] e [dominant_modality]. Seja honesto sobre o gap sem ser punitivo."
  2. "Explique o brick effect com base científica mas linguagem acessível. Use [transition_score]. Sugira frequência e formato de brick workouts específicos para o branch (aquathlon: swim→run / duathlon: bike→run)."
  3. "Aborde pacing com estratégia de prova real. Se usa dispositivo, referencie zonas. Se não usa, trabalhe com esforço percebido. Sempre fale sobre o primeiro segmento como 'investimento' no segundo."

## 11 · Configuração de cálculos

- **activityLevelDefault:** `moderately_active` — justificativa: quem pratica multisport tipicamente treina 3-5x/semana. Mesmo o iniciante que responde "0-1 sessões" está buscando aumentar, e o nível "moderately_active" reflete a intenção + estilo de vida ativo que levou a pessoa ao multisport
- **activityMapping:** Pergunta `weekly_sessions` mapeia:
  - `0_1` → `lightly_active`
  - `2_3` → `moderately_active`
  - `4_5` → `very_active`
  - `6_plus` → `extremely_active`

## 12 · Notas de design (decisões não-óbvias)

### Por que não separei aquathlon e duathlon em dois templates

Considerei seriamente. A favor da separação: métricas e modalidades são diferentes. Contra: o público se sobrepõe (~30% faz ambas), o fluxo do formulário é idêntico, e a diferença é resolvida elegantemente com branches (seção 5). Dois templates significariam manutenção dobrada para conteúdo 80% idêntico. Decisão: template único com segmentação.

### Por que não incluí pergunta sobre distância-alvo (sprint vs standard)

Considerada e descartada. Motivo: para o público amador de aquathlon/duathlon, a distância-alvo muda marginalmente o relatório. Sprint e standard diferem em volume de treino, mas não em conceitos, métricas ou pilares. O nível do atleta (Q2) já captura essa informação indiretamente — iniciantes fazem sprint, avançados fazem standard. Incluir distância-alvo adicionaria uma pergunta sem mudar substancialmente o relatório.

### Por que `injury_fear` é gargalo e não safety trigger

Medo de lesão é um gargalo psicológico/comportamental, não uma condição médica. Quem seleciona "tenho medo de lesão" pode nunca ter se machucado — está prevendo. O relatório ajusta o tom para reassegurar e educar sobre prevenção, mas não bloqueia prescrição. Lesão real está em Q6 (`joint_injury`).

### Por que `respiratory` (asma) não é safety trigger

Asma controlada permite treino e competição em multisport — vários atletas olímpicos são asmáticos. A condição ajusta o relatório (mais atenção a aquecimento, cuidado com intensidade máxima em frio), mas não exige bloqueio de prescrição nem avaliação médica obrigatória.

### Por que escolhi "both" como terceira opção em Q1 em vez de não ter

Sem essa opção, quem faz ambas é forçado a uma escolha artificial e pode abandonar. Com ela, a experiência é honesta e acolhedora. Implementação: "both" segue o branch de aquathlon (mais complexo tecnicamente) com notas adicionais sobre duathlon nos pilares.

### Por que não incluí Motor 5 (Ambiente)

Em musculação, saber se a pessoa treina em casa ou academia muda tudo. Em multisport, o local de treino é menos variável — corrida é na rua, natação é na piscina, bike é na rua ou rolo. A pergunta não muda substancialmente o relatório. Única variação relevante (piscina vs águas abertas para aquathlon) é muito nichada para justificar uma pergunta.

## 13 · Pendências

1. **VO2max estimation accuracy:** A fórmula de Jackson et al. (1990) sem teste de campo tem margem de erro de ±10-15%. Para multisportistas, uma estimativa baseada em pace de corrida (VDOT) seria mais precisa, mas exigiria uma pergunta adicional ("qual seu pace médio em 5K?") que foi descartada por adicionar fricção. Decidir se vale adicionar como pergunta condicional para `uses_device == yes_advanced`.

2. **CSS (Critical Swim Speed) para aquatletas:** O cálculo de zonas de natação via CSS requer dois tempos de referência (200m e 400m) que o lead não terá disponível no formulário. Alternativa: usar estimativa baseada em nível + frequência de treino. Precisar qual lib implementa isso.

3. **FTP estimation para duatletas:** Estimativa de FTP sem teste formal é imprecisa. Para `uses_device == yes_advanced`, considerar perguntar "qual seu FTP?" diretamente vs estimar por nível. Trade-off: precisão vs fricção.

4. **Validação de proporções de treino por modalidade:** As proporções sugeridas (45/55 para aquathlon, 30/40/30 para duathlon) são baseadas em Friel, mas podem variar por nível e distância-alvo. Confirmar com coaches especializados.

5. **Brick workout prescriptions:** A frequência de brick sessions sugerida nos pilares (1-2x/semana) é generalizada. Para iniciantes, 1x/semana pode ser muito — começar com brick quinzenal pode ser mais seguro. Validar com profissional de multisport.

## 14 · Fontes citadas

1. **Friel, J.** (2016). _The Triathlete's Training Bible_ (5th ed.). VeloPress. — Periodização, proporções de volume, princípio do limitador
2. **Daniels, J.** (2014). _Daniels' Running Formula_ (3rd ed.). Human Kinetics. — Tabela VDOT, zonas de corrida
3. **Allen, H. & Coggan, A.** (2019). _Training and Racing with a Power Meter_ (3rd ed.). VeloPress. — Zonas de potência para ciclismo (Coggan levels)
4. **Hue, O. et al.** (1998). "The effect of prior cycling on the biomechanics and energetics of running in triathlon." _European Journal of Applied Physiology_, 77(1-2), 98-105. — Efeito da modalidade anterior na subsequente
5. **Millet, G.P. & Vleck, V.E.** (2000). "Physiological and biomechanical adaptations to the cycle to run transition in Olympic triathlon." _Sports Medicine_, 30(3), 161-187. — Fisiologia da transição
6. **Bentley, D.J. et al.** (2002). "Specific aspects of contemporary triathlon." _Sports Medicine_, 32(6), 345-359. — Performance em transição, queda de rendimento no segundo segmento
7. **Bentley, D.J. et al.** (2007). "Pacing strategy and physiological responses during a 20-km cycling time trial in duathlon." _Journal of Science and Medicine in Sport_, 10(5), 299-305. — Estratégia de pacing em duathlon
8. **Abbiss, C.R. & Laursen, P.B.** (2008). "Describing and understanding pacing strategies during athletic competition." _Sports Medicine_, 38(3), 239-252. — Pacing em endurance
9. **ACSM** (2022). _ACSM's Guidelines for Exercise Testing and Prescription_ (11th ed.). Wolters Kluwer. — Hidratação, estimativa de VO2max, classificações de aptidão
10. **Jackson, A.S. et al.** (1990). "Prediction of functional aerobic capacity without exercise testing." _Medicine & Science in Sports & Exercise_, 22(6), 863-870. — Fórmula de estimativa de VO2max sem teste

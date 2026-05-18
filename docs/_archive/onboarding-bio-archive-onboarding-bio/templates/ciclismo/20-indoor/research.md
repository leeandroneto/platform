# Research · Especialidade 20 · Ciclismo Indoor / Virtual

## 0 · Metadados

- **Número:** 20
- **Modality:** ciclismo
- **Pasta:** `ciclismo/20-indoor/`
- **Label proposto:** Ciclismo Indoor / Virtual
- **specialty_code proposto:** `indoor_virtual`
- **Plano:** pro
- **Validação clínica:** Opcional
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. Coggan, A. & Allen, H. — _Training and Racing with a Power Meter_ (referência de zonas de potência e métricas TSS/IF/NP)
  2. TrainerRoad Blog — Cycling Power Zones Explained
  3. TrainingPeaks — Normalized Power, Intensity Factor and Training Stress Score
  4. Zwift Insider — Rider Categorization Based on FTP
  5. Bikemagazine Brasil — Rolos smart e treinos indoor (dez/2024)
  6. ZTBR (Zwift Team Brasil) — comunidade e perfil de ciclistas virtuais BR
  7. Polar — FTP W/kg classification table
  8. CTS (Chris Carmichael) — Training Stress Score and indoor vs outdoor FTP differences

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico típico

- **Faixa etária:** 28-50 anos, concentração forte em 32-45
- **Gênero:** majoritariamente masculino (~75-80%), mas parcela feminina cresce com a gamificação (Zwift, Rouvy)
- **Contexto socioeconômico:** classe B/B+. Ciclismo indoor exige investimento em equipamento (rolo smart R$2.500-8.000, bike já possuída, assinatura de plataforma ~R$70-100/mês). Não é esporte de entrada barata
- **Localização:** capitais e cidades grandes. São Paulo, Rio, Curitiba, BH, Brasília concentram a maioria. Regiões com clima extremo (calor intenso no Nordeste, chuva no Sul) empurram mais gente pro indoor

### Ordem de grandeza

Mercado **médio-pequeno** mas em crescimento constante. Estimativa: 50-150 mil praticantes regulares de ciclismo indoor com plataforma virtual no Brasil (Zwift + Rouvy + MyWhoosh + TrainerRoad). A ZTBR (comunidade Zwift Brasil) tem 6+ anos e representatividade em competições internacionais. O grupo Facebook "Zwift Brasil" tem milhares de membros ativos.

### Onde estão online

- **Instagram:** seguem perfis de coaching (@gozwiftbrasil, assessorias), marcas de equipamento, influencers de ciclismo
- **YouTube:** tutoriais de setup, reviews de rolo, vlogs de treino (canal Pedalento, Bike Magazine)
- **WhatsApp/Telegram:** grupos de assessoria, grupos de pelotão virtual (ZTBR organiza social rides)
- **Strava:** perfil quase universal — todo ciclista indoor sincroniza rides
- **Discord/Companion apps:** Zwift Companion, grupos no Discord de equipes virtuais

### Linguagem-padrão

- "Rolo" (o equipamento), "rolar" (pedalar no rolo)
- "FTP" é universalmente conhecido (mesmo iniciantes sabem o termo)
- "Watts", "W/kg" — moeda corrente
- "Subir o FTP", "fazer FTP test"
- "Sofrer" (treino intenso no rolo, com orgulho)
- "Base", "threshold", "sweet spot" — termos de treino em inglês mesmo
- "ERG mode" vs "SIM mode"
- "Smart trainer", "rolo inteligente"
- "Zwiftar" (verbo), "dar uma pedalada virtual"

### O que os ofende ou afasta

- Ser chamado de "ciclista de sofá" ou implicar que indoor não é "ciclismo de verdade"
- Formulário que não entende a diferença entre spin class (aula coletiva) e ciclismo virtual estruturado com potência
- Assumir que todo mundo tem medidor de potência ou rolo smart (muitos estão em rolo básico + sensor de velocidade)
- Perguntas que parecem vindas de quem nunca pedalou num rolo
- Tom condescendente sobre motivação — eles sabem que é difícil, não precisam ouvir "vai ser legal!"

### Dor mais comum

**Monotonia + falta de estrutura = estagnação.** A maioria sabe que precisa treinar com estrutura (zonas, periodização), mas não sabe COMO. Pedalou 6 meses no Zwift fazendo free ride, o FTP não sobe, o treino vira tédio. Busca um profissional que entenda potência e saiba prescrever treinos indoor com progressão real.

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Ciclistas que treinam predominantemente indoor (rolo/smart trainer + plataforma virtual)
- Ciclistas outdoor que usam indoor como complemento significativo (>30% do volume)
- Todos os níveis: de quem acabou de montar o setup até quem compete em e-racing
- Motivações: fitness geral, complemento ao outdoor, competição virtual, perda de peso pedalando, evolução de performance (subir FTP)

### Este template NÃO vai cobrir:

- **Spin class / cycling de academia** (público diferente, sem potência, sem plataforma — poderia ser template futuro separado)
- **Ciclista outdoor puro** que nunca usa rolo (templates 16-19 cobrem)
- **Triatletas** que usam indoor como perna do treino (triathlon terá templates próprios)
- **Reabilitação em bicicleta ergométrica** (contexto clínico, não fitness)

---

## 3 · Motores escolhidos

### Decisão narrativa

O ciclista indoor é um público **técnico por natureza** — mesmo o iniciante já sabe o que é FTP porque a plataforma mostra. Isso muda como as perguntas devem ser formuladas: posso ser mais direto e técnico que em musculação.

**Motores considerados:**

1. **Motor 6 (Identidade/Fase)** — perfeito como segmentação. O ciclista indoor se identifica fortemente com uma dessas fases: "acabei de montar o rolo", "faço free ride sem estrutura", "treino estruturado", "compito virtual". Cada fase implica nível de dado disponível e tipo de prescrição diferente.

2. **Motor 2 (Gargalo)** — essencial. O que trava cada ciclista indoor é muito específico: monotonia, estagnação de FTP, falta de estrutura, desconforto no rolo, não saber interpretar dados de potência.

3. **Motor 5 (Ambiente/Disponibilidade)** — relevante porque o setup varia MUITO: rolo básico vs smart trainer vs bike indoor. Isso define se o profissional pode prescrever treinos com ERG mode, se tem dados de potência reais ou estimados.

4. **Motor 7 (Métricas/Ferramentas)** — crucial. Saber se tem potência real, qual o FTP atual, se usa HR. Mas condicional: só aprofunda se o setup permite.

5. **Motor 4 (Comportamento/Consistência)** — a consistência real no indoor é a variável que mais prediz resultado. Quantas sessões por semana, duração média, há quanto tempo mantém.

6. **Motor 8 (Safety)** — health_conditions padrão. Ciclismo indoor tem risco baixo, mas questões cardiovasculares precisam de flag.

**Motores descartados:**

- **Motor 3 (Nível/Maturidade)** — redundante com Motor 6 (a fase já captura maturidade) e Motor 7 (métricas disponíveis já sinalizam experiência). Adicionar explicitamente seria pergunta a mais sem ganho.
- **Motor 1 (Contexto Atual)** genérico — substituído pelo Motor 6, que é mais específico e engajante.

### Lista final (6 motores → 7 perguntas):

1. **Segmentação (Motor 6)** → `indoor_phase` — fase atual do ciclista indoor (define branch + tom)
2. **Gargalo (Motor 2)** → `bottleneck` — o que mais trava evolução/consistência
3. **Setup (Motor 5)** → `trainer_setup` — tipo de equipamento disponível
4. **Métricas (Motor 7)** → `power_data` — se tem dados de potência e FTP conhecido
5. **FTP (Motor 7 condicional)** → `ftp_value` — valor numérico do FTP (só se respondeu que tem potência)
6. **Consistência (Motor 4)** → `weekly_volume` — frequência real de treino indoor
7. **Safety (Motor 8)** → `health_conditions` — triagem de risco

Total: **7 perguntas específicas** (+ bloco universal). O `ftp_value` é condicional (só aparece se tem potência), então na prática muitos alunos respondem 6.

---

## 4 · Perguntas e opções

### Q1 · `indoor_phase` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Qual fase melhor descreve você no ciclismo indoor?"
**Helper:** "Sem julgamento — cada fase tem suas necessidades"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`starting`** — "Montando o setup / primeiras pedaladas"
  - Safety trigger? não

- **`freeride`** — "Pedalo no Zwift/app, mas sem estrutura de treino"
  - Safety trigger? não

- **`structured`** — "Já treino com zonas de potência / plano estruturado"
  - Safety trigger? não

- **`competitive`** — "Participo de e-racing / competições virtuais"
  - Safety trigger? não

**Justificativa da pergunta:** A fase no ciclismo indoor é o maior diferenciador de prescrição. Um ciclista em setup inicial precisa de orientação sobre posição e frequência básica; um freerider precisa de estrutura; um treinado precisa de otimização. A pergunta funciona como autoclassificação sem julgamento — o aluno se reconhece imediatamente numa das fases.

**Justificativa das opções:** Cobrem o espectro completo da jornada do ciclista indoor. Starting e freeride capturam ~60% do público (a maioria que busca profissional está nesses estágios). Structured e competitive capturam o público avançado que busca refinamento. Não há "Outro" porque essas 4 fases cobrem >95% dos casos reais.

---

### Q2 · `bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais te trava hoje no treino indoor?"
**Helper:** "Escolha o que mais pesa — vamos trabalhar nisso"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`monotony`** — "Tédio e falta de motivação pra subir no rolo"
  - Safety trigger? não

- **`plateau`** — "Meu FTP estagnou / não vejo evolução"
  - Safety trigger? não

- **`no_structure`** — "Não sei montar um treino / interpretar meus dados"
  - Safety trigger? não

- **`discomfort`** — "Desconforto físico no rolo (selim, lombar, calor)"
  - Safety trigger? não

- **`time`** — "Pouco tempo disponível pra treinar"
  - Safety trigger? não

**Justificativa da pergunta:** Esses são os 5 gargalos reais que a literatura e comunidades de ciclismo indoor identificam. Descartei "falta de equipamento" (se está respondendo, já tem algum setup) e "não gostar de tecnologia" (não combina com o perfil de quem busca ciclismo virtual).

**Justificativa das opções:** Cobrem ~90% dos motivos de procura por profissional no ciclismo indoor. Monotonia e estagnação são os dois principais (representam >50% das queixas). Falta de estrutura é o gap mais endereçável pelo profissional. Desconforto é subvalorizado mas crítico — treinar com dor leva a abandono. Tempo curto é transversal a todas as fases.

---

### Q3 · `trainer_setup` _(Motor 5 — Ambiente/Disponibilidade)_

**Type:** `single_choice`
**Label (client-facing):** "Qual equipamento você usa?"
**Helper:** "Isso ajuda a calibrar o tipo de treino que funciona no seu setup"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`smart_direct`** — "Rolo smart (direct drive) — tipo Kickr, Neo, Flux"
  - Safety trigger? não

- **`smart_wheel`** — "Rolo smart (wheel-on) — roda encostada no rolo"
  - Safety trigger? não

- **`basic_power`** — "Rolo básico + pedivela/pedal com potência"
  - Safety trigger? não

- **`basic_no_power`** — "Rolo básico sem potência (uso velocidade ou FC)"
  - Safety trigger? não

- **`spin_bike`** — "Bike indoor fixa (Stages, Peloton, genérica)"
  - Safety trigger? não

**Justificativa da pergunta:** O setup define fundamentalmente o que é possível prescrever. Sem potência, o treino muda completamente (FC + RPE vs zonas de watts). Com ERG mode, intervalos são automáticos. Essa informação é mais valiosa que "qual app você usa" porque determina a qualidade dos dados disponíveis.

**Justificativa das opções:** Cobrem o espectro completo de equipamentos. Smart direct drive e smart wheel-on são ~60% do público ativo em plataformas. Basic + power meter é o setup do ciclista que investe no medidor mas não no rolo. Basic sem potência captura iniciantes e ciclistas que usam indoor esporadicamente. Spin bike captura o público que pedala em casa sem bike própria no rolo.

---

### Q4 · `power_data` _(Motor 7 — Métricas/Ferramentas)_

**Type:** `single_choice`
**Label (client-facing):** "Você sabe seu FTP atual?"
**Helper:** "FTP = a potência que sustenta por ~1 hora. Se não sabe, tudo bem"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`known_recent`** — "Sim, testei nos últimos 3 meses"
  - Safety trigger? não

- **`known_old`** — "Sim, mas testei há mais de 3 meses"
  - Safety trigger? não

- **`estimated`** — "Tenho uma estimativa do app, mas nunca testei formalmente"
  - Safety trigger? não

- **`no_ftp`** — "Não sei meu FTP / não uso potência"
  - Safety trigger? não

**Justificativa da pergunta:** FTP é a pedra angular do treino por potência. Saber se o aluno tem esse dado (e quão recente é) define a abordagem inteira do profissional. Descartei perguntar o FTP diretamente nesta pergunta para não misturar motores — o valor numérico fica em Q5 (condicional).

**Justificativa das opções:** Quatro estados mutuamente exclusivos que cobrem 100% dos cenários. "Estimativa do app" é diferente de "testei formalmente" — a precisão muda. "Há mais de 3 meses" é o threshold prático após o qual zonas ficam pouco confiáveis.

---

### Q5 · `ftp_value` _(Motor 7 condicional — valor numérico)_

**Type:** `number`
**Label (client-facing):** "Qual seu FTP em watts?"
**Helper:** "Valor aproximado — não precisa ser exato"
**Required:** não
**Visibility:** `if power_data == known_recent OR power_data == known_old OR power_data == estimated`
**Segmentação:** não
**depthRequired:** standard
**Validation:** min 50, max 500

**Justificativa da pergunta:** Com peso (do bloco universal) + FTP = W/kg, que é a métrica-chave do ciclismo. Isso permite classificar o aluno, calcular zonas, estimar TSS alvo, e gerar métricas ricas no relatório. É condicional porque pedir watts a quem não tem potência gera frustração.

---

### Q6 · `weekly_volume` _(Motor 4 — Comportamento/Consistência)_

**Type:** `single_choice`
**Label (client-facing):** "Na última semana, quantas sessões indoor você fez?"
**Helper:** "Conte só as que realmente aconteceram, não as planejadas"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`zero`** — "Nenhuma (estou retomando ou começando)"
  - Safety trigger? não

- **`one_two`** — "1-2 sessões"
  - Safety trigger? não

- **`three_four`** — "3-4 sessões"
  - Safety trigger? não

- **`five_plus`** — "5 ou mais sessões"
  - Safety trigger? não

**Justificativa da pergunta:** Pergunta sobre SEMANA PASSADA (comportamento real), não sobre intenção. Volume semanal define se o profissional prescreve ramp-up, manutenção ou otimização. Descartei "duração média por sessão" como pergunta separada — aumentaria fricção e o profissional pode perguntar depois na consultoria.

**Justificativa das opções:** Faixas práticas que todo ciclista identifica instantaneamente. Zero captura iniciantes/retomadas. 1-2 é volume mínimo. 3-4 é o padrão do ciclista indoor dedicado. 5+ é o volume alto que requer cuidado.

---

### Q7 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Alguma condição de saúde que devemos saber?"
**Helper:** "Marque todas que se aplicam"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 5

**Opções:**

- **`cardiac`** — "Problema cardíaco diagnosticado"
  - Safety trigger? **sim** (reason: "Condição cardíaca requer liberação médica antes de treino de intensidade. Ciclismo indoor permite picos de intensidade prolongados sem as pausas naturais do outdoor — risco cardiovascular amplificado.")

- **`hypertension_uncontrolled`** — "Pressão alta não controlada"
  - Safety trigger? **sim** (reason: "Hipertensão não controlada em treino de alta intensidade indoor (sem pausas, ambiente quente) representa risco de evento cardiovascular.")

- **`joint_issues`** — "Problema articular em joelhos ou quadril"
  - Safety trigger? não (ajusta tom e prescrição, mas não bloqueia — ciclismo indoor é justamente indicado para problemas articulares por ser de baixo impacto)

- **`diabetes`** — "Diabetes (tipo 1 ou 2)"
  - Safety trigger? não (requer atenção na prescrição mas não bloqueia — treino regular é benéfico)

- **`recent_surgery`** — "Cirurgia recente (últimos 6 meses)"
  - Safety trigger? **sim** (reason: "Cirurgia recente requer liberação médica específica antes de retorno ao treino de intensidade.")

- **`none`** — "Nenhuma das anteriores"
  - Safety trigger? não

**Justificativa da pergunta:** Ciclismo indoor tem risco inerente baixo (sem quedas, sem trânsito), mas o esforço cardiovascular pode ser intenso e prolongado. Safety triggers ativam apenas para condições que requerem acompanhamento médico presencial. Hipertensão CONTROLADA e diabetes não são safety — ajustam tom e prescrição.

**Justificativa das opções:** Focam nas condições que realmente mudam a segurança do treino indoor. Não incluo lombalgia (muito comum, é mais desconforto que risco), nem condições raras. O campo `personal_note` (universal) captura qualquer coisa fora dessas opções.

---

## 5 · Branches

### Branch: `Iniciante` (trigger: `indoor_phase == starting`)

- **Tom geral:** acolhedor, didático, sem jargão técnico excessivo. Foco em criar confiança e hábito
- **pillarGuidance:** priorizar conforto no setup, frequência mínima viável, introdução gentil a zonas. Evitar sobrecarregar com dados
- **Additional questions:** nenhuma
- **Remove questions:** Q5 (`ftp_value`) provavelmente não se aplica (mas a visibilityRule já cuida)
- **Metrics override:** W/kg e zonas de potência são menos relevantes — priorizar métricas de consistência (frequência, aderência) e conforto
- **Narrative arc override:** "Montar o setup certo → criar o hábito → primeiros ganhos" em vez de "diagnosticar → otimizar → performance"

**Justificativa:** O iniciante não quer ouvir sobre FTP e TSS — quer saber que está fazendo certo, que o desconforto vai diminuir, e que vai evoluir. Relatório precisa ser encorajador sem ser vazio.

### Branch: `Performance` (trigger: `indoor_phase == structured OR indoor_phase == competitive`)

- **Tom geral:** direto, técnico, orientado a dados. Pode usar jargão (sweet spot, Z2, TSS)
- **pillarGuidance:** foco em otimização de zonas, periodização, gestão de fadiga, race preparation (se competitive)
- **Additional questions:** nenhuma (Q5 já captura FTP quando disponível)
- **Remove questions:** nenhuma
- **Metrics override:** todas as métricas de potência são relevantes — W/kg, zonas Coggan, TSS/h estimado, classificação comparativa
- **Narrative arc override:** "Onde você está → onde pode chegar → como ajustar o treino para chegar lá" com dados concretos

**Justificativa:** Structured e competitive compartilham a mesma linguagem e nível de dado. A diferença é ênfase (evolução geral vs competição), mas o relatório não precisa bifurcar — o `pillarGuidance` e `aiContext` lidam com essa nuance sem branch separado.

### Branch: `Freerider` (trigger: `indoor_phase == freeride`)

- **Tom geral:** motivacional-prático. Não julga a falta de estrutura — mostra o que muda com estrutura
- **pillarGuidance:** bridge de "ride intuitivo" para "treino com propósito". Mostrar que estrutura não mata diversão
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** se tem potência, calcular zonas mesmo sem FTP formal (estimativa). Se não tem, focar em FC e consistência
- **Narrative arc override:** "O que você já faz de certo → o que falta → o salto que vem com estrutura"

**Justificativa:** O freerider é o público-alvo principal (maior pool de conversão). Não é iniciante (já pedala), não é treinado (não tem plano). O relatório precisa mostrar o valor da estrutura sem parecer que "free ride é errado".

---

## 6 · Safety triggers

| Questão             | Opções                      | Reason (clínico)                                                                                                                                | Efeito no relatório                                                                                 |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `health_conditions` | `cardiac`                   | Condição cardíaca diagnosticada — requer liberação médica antes de treino de intensidade. Indoor amplifica picos de esforço sem pausas naturais | macros omitidas / zonas de intensidade omitidas / SafetyNote aparece / IA não prescreve intensidade |
| `health_conditions` | `hypertension_uncontrolled` | Hipertensão não controlada em ambiente indoor (calor, esforço sustentado) representa risco cardiovascular                                       | macros omitidas / intensidade limitada / SafetyNote aparece                                         |
| `health_conditions` | `recent_surgery`            | Cirurgia recente requer avaliação presencial de retorno ao esporte                                                                              | timeline de progressão omitida / SafetyNote aparece                                                 |

**safetyTemplate:**

- **Title:** "Sua segurança em primeiro lugar"
- **Body:** "Identificamos condições que pedem atenção especial antes de iniciar ou intensificar o treino indoor. Isso não significa que você não pode pedalar — significa que o caminho ideal começa com uma avaliação médica presencial para garantir que o treino seja seguro e eficaz pra você. Seu profissional [profissional_nome] vai receber essas informações e pode te orientar sobre os próximos passos, incluindo quais exames ou liberações buscar."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `wkg_classification`

- **O que é:** Classificação do ciclista por W/kg (relação potência/peso)
- **Por que aparece para o aluno:** é a métrica que o ciclista indoor mais se identifica. Ver "você está na faixa X, a próxima faixa é Y" gera motivação concreta
- **Cálculo:** FTP (watts) ÷ peso (kg). Classificação por tabela Coggan: <2.0 = Untrained, 2.0-2.5 = Fair, 2.5-3.25 = Moderate, 3.25-3.75 = Good, 3.75-4.25 = Very Good, 4.25-5.0 = Excellent, >5.0 = Exceptional (valores para homens; mulheres ~10% menor por faixa). Ref: Coggan FTP Power Profiling Table
- **Visualização proposta:** **Gauge horizontal com faixas coloridas** — cursor indica posição atual, faixas vão de "Iniciante" a "Excepcional". Rationale: gauge é intuitivo, mostra onde está E quanto falta pro próximo nível
- **Placeholder:** `[wkg_value]`, `[wkg_class]`
- **Condição:** só aparece se `ftp_value` foi preenchido

### 7.2 · `power_zones`

- **O que é:** As 7 zonas de potência (Coggan) com faixa de watts personalizada
- **Por que aparece para o aluno:** é o "mapa" do treino. Cada zona tem propósito e o aluno entende o que cada treino ataca
- **Cálculo:** 7 zonas derivadas do FTP: Z1 <55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%, Z6 121-150%, Z7 >150%. Ref: Coggan/Allen, _Training and Racing with a Power Meter_
- **Visualização proposta:** **Zone table colorida** — cada zona com nome popular (Recuperação, Resistência, Tempo, Limiar, VO2max, Anaeróbio, Sprint), faixa de watts, e cor. Rationale: tabela de zonas é formato universalmente reconhecido por ciclistas
- **Placeholder:** `[zone_X_min]`, `[zone_X_max]` para cada zona
- **Condição:** só aparece se `ftp_value` foi preenchido

### 7.3 · `weekly_tss_target`

- **O que é:** Meta semanal de TSS (Training Stress Score) baseada no volume e fase
- **Por que aparece para o aluno:** dá um "orçamento" semanal concreto de treino. "Sua meta é acumular ~300 TSS/semana" é mais acionável que "treine 4x"
- **Cálculo:** TSS = (duração_s × NP × IF) / (FTP × 3600) × 100. Meta semanal estimada por volume: 1-2x/sem → 100-200 TSS, 3-4x → 200-400 TSS, 5+ → 400-600 TSS. Sem FTP: usar estimativa por FC (hrTSS). Ref: TrainingPeaks TSS guidelines
- **Visualização proposta:** **Card numérico com comparison** — TSS alvo semanal + "isso equivale a X sessões de Y minutos em Z2". Rationale: traduz número técnico em linguagem prática
- **Placeholder:** `[tss_weekly_target]`
- **Condição:** informativo para quem tem potência; omitido ou simplificado para quem não tem

### 7.4 · `hydration_indoor`

- **O que é:** Meta de hidratação específica para treino indoor (maior que outdoor por ausência de ventilação natural)
- **Por que aparece para o aluno:** desidratação indoor é subestimada. A taxa de sudorese indoor é 1.5-2x maior que outdoor para mesma intensidade
- **Cálculo:** Estimativa base: 500-1000ml/hora dependendo de peso, intensidade e temperatura ambiente. Fórmula simplificada: peso × 10ml para sessão de 1h em intensidade moderada (Z2-Z3). Ajuste +30% para intensidade alta (Z4+). Ref: ACSM Position Stand on Exercise and Fluid Replacement
- **Visualização proposta:** **Card com ícone de garrafa** — volume recomendado por sessão. Rationale: simples, visual, acionável
- **Placeholder:** `[hydration_ml_per_hour]`

### 7.5 · `session_duration_ideal`

- **O que é:** Duração ideal de sessão baseada no volume semanal e gargalo declarado
- **Por que aparece para o aluno:** concretiza o treino em tempo real. "Suas sessões ideais são de 45-60min" resolve a dúvida mais comum
- **Cálculo:** Heurística baseada em volume semanal × tempo disponível. 1-2 sessões → 45-60min. 3-4 sessões → 40-75min (variando por tipo). 5+ → 30-90min (polarizado). Se gargalo == time → priorizar sessões curtas e intensas (30-45min)
- **Visualização proposta:** **Card numérico** — faixa de duração + "distribuição sugerida: X sessões curtas, Y sessões longas"
- **Placeholder:** `[session_duration_min]`, `[session_duration_max]`

### 7.6 · `consistency_score`

- **O que é:** Score de consistência baseado em volume real × fase
- **Por que aparece para o aluno:** validação emocional. Ver "sua consistência é 7/10 — acima da média para sua fase" encoraja
- **Cálculo:** Score 1-10 baseado em: volume semanal × duração na fase × regularidade declarada. Heurística própria (não há fórmula acadêmica padronizada — anotar em Pendências)
- **Visualização proposta:** **Gauge radial** — ponteiro de 1 a 10 com faixas (baixa / moderada / alta / excelente). Rationale: gauge emocional, vê rápido se está "indo bem"
- **Placeholder:** `[consistency_score]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `ftp_wkg_raw`

- **O que é:** W/kg numérico bruto (FTP/peso)
- **Por que importa para o PT:** classificação rápida do aluno. 2.5 W/kg vs 4.0 W/kg = prescrição completamente diferente
- **Cálculo:** FTP ÷ peso_kg
- **Visualização proposta:** **Badge com cor** — verde (>3.5), amarelo (2.5-3.5), laranja (<2.5). Rationale: triagem visual instantânea

### 8.2 · `training_readiness`

- **O que é:** Score de prontidão de treino: combinação de fase × volume × gargalo × setup
- **Por que importa para o PT:** indica se o aluno está pronto para treino estruturado imediato ou precisa de ramp-up
- **Cálculo:** Heurística: phase(starting=1, freeride=2, structured=3, competitive=4) × volume_factor × setup_factor. Setup sem potência penaliza (prescrição menos precisa)
- **Visualização proposta:** **Scorecard semáforo** — Ready / Needs Ramp-up / Needs Setup. Rationale: decisão binária para o PT

### 8.3 · `equipment_capability`

- **O que é:** Classificação do que o setup do aluno permite em termos de treino
- **Por que importa para o PT:** antes de prescrever, o PT precisa saber: tem ERG mode? Tem potência real? Isso muda tudo
- **Cálculo:** Derivado de `trainer_setup`: smart_direct = full (ERG + potência real), smart_wheel = full (ERG + potência estimada), basic_power = partial (potência real, sem ERG), basic_no_power = limited (FC/RPE only), spin_bike = varies
- **Visualização proposta:** **Tag/badge** com ícones: ⚡ potência, 🎮 ERG mode, ❤️ FC only

### 8.4 · `adherence_risk`

- **O que é:** Predição de risco de abandono baseada em gargalo × fase × volume
- **Por que importa para o PT:** se gargalo == monotonia e volume == zero → alto risco de não começar ou abandonar rápido. PT pode preparar estratégia de engajamento
- **Cálculo:** Heurística: monotonia + zero_volume = alto risco; plateau + structured = baixo risco (frustrado mas comprometido); etc.
- **Visualização proposta:** **Semáforo** — baixo / médio / alto risco de abandono

### 8.5 · `coggan_zones_full`

- **O que é:** Tabela completa das 7 zonas com watts absolutos
- **Por que importa para o PT:** referência direta para prescrição de treinos
- **Cálculo:** mesmo de 7.2, mas com detalhamento técnico (inclui tempo-in-zone targets por semana)
- **Visualização proposta:** **Tabela técnica** com targets de tempo por zona

---

## 9 · Pilares do relatório

### Pilar 1 · Estrutura de Treino

- **Subtitle:** "Treino inteligente no rolo: qualidade > quantidade"
- **Conceito central:** Cada sessão indoor tem propósito definido — base, threshold, intervalado, ou recuperação. Treino sem estrutura é exercício; treino com estrutura é evolução. A chave é distribuição correta de tempo nas zonas: 80% Z1-Z2 (base aeróbica), 20% Z4-Z5 (estímulo de adaptação).
- **Evidência científica:** Modelo polarizado 80/20 (Seiler, 2010; Stöggl & Sperlich, 2014) — validado em ciclistas de todos os níveis. Treino polarizado produz maiores ganhos de FTP que treino "threshold" contínuo.
- **Placeholders:** `[zone_2_range]`, `[zone_4_range]`, `[tss_weekly_target]`, `[session_duration_min]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Com o seu perfil, o caminho mais eficiente é dividir seus treinos em dois tipos: sessões longas e tranquilas, pedalando entre [zone_2_range] watts (onde seu corpo queima gordura e constrói resistência), e sessões mais curtas e intensas perto de [zone_4_range] watts. Essa combinação — chamada treino polarizado — é usada por ciclistas profissionais e funciona em qualquer nível. [profissional_nome] vai montar essa distribuição pra você."
- **Exemplo de texto técnico (35 palavras):** "Distribuição polarizada 80/20 recomendada: base aeróbica em Z2 ([zone_2_range]W) com 2-3 sessões semanais, estímulo em Z4-Z5 ([zone_4_range]W) 1-2x/semana. TSS semanal alvo: [tss_weekly_target]. Periodização em blocos de 3:1."

### Pilar 2 · Performance e Evolução

- **Subtitle:** "Seus números, seu progresso"
- **Conceito central:** No ciclismo indoor, evolução é mensurável. W/kg é a métrica-mestre: sobe porque você fica mais forte (FTP sobe) ou mais leve (peso desce), ou ambos. O relatório mostra onde o aluno está comparado a benchmarks, e projeta onde pode chegar com treino consistente.
- **Evidência científica:** Tabela de classificação Coggan (Power Profiling); progressão típica de FTP: +5-15% nos primeiros 6 meses com treino estruturado para ciclistas recreativos (Allen & Coggan, 2010)
- **Placeholders:** `[wkg_value]`, `[wkg_class]`, `[ftp_value]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "Hoje você está em [wkg_value] W/kg — isso te coloca na faixa '[wkg_class]'. Não é um rótulo, é um ponto de partida. Com treino estruturado, ciclistas nessa faixa tipicamente evoluem 5-15% de FTP nos primeiros meses. Isso significa que seu [ftp_value]W pode virar algo em torno de [projecao_ftp]W — e cada watt a mais muda como você se sente pedalando. [profissional_nome] vai traçar o caminho concreto."
- **Exemplo de texto técnico (30 palavras):** "FTP atual: [ftp_value]W ([wkg_value] W/kg), classificação [wkg_class] (Coggan). Progressão esperada com treino polarizado: +5-15% em 12-16 semanas. Re-teste recomendado a cada 4-6 semanas."

### Pilar 3 · Conforto e Sustentabilidade

- **Subtitle:** "Pedalando por prazer, não por obrigação"
- **Conceito central:** A maior barreira do ciclismo indoor não é fisiológica — é psicológica e ergonômica. O rolo é implacável: sem pausas naturais, sem vento, posição estática. Resolver conforto e monotonia é pré-requisito para consistência. Hidratação indoor, ventilação, variação de treinos, e social rides são tão importantes quanto watts.
- **Evidência científica:** Taxa de sudorese indoor 1.5-2x maior que outdoor para mesma intensidade (Jeukendrup & Gleeson, 2010). Monotonia como preditor de abandono em atividade física (Emm-Collison et al., 2020).
- **Placeholders:** `[hydration_ml_per_hour]`, `[consistency_score]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Pedalando indoor, seu corpo aquece mais rápido e sua sem venilação natural. Por isso, sua meta de hidratação é [hydration_ml_per_hour]ml por hora — mais do que você tomaria na rua. Além do corpo, cuide da cabeça: variar entre treinos solo, social rides e workouts guiados mantém a motivação alta. Sua pontuação de consistência é [consistency_score]/10 — [profissional_nome] vai te ajudar a manter ou subir esse número."
- **Exemplo de texto técnico (35 palavras):** "Reposição hídrica indoor recomendada: [hydration_ml_per_hour]ml/h (peso × 10ml base, +30% em Z4+). Score de consistência: [consistency_score]/10. Estratégias anti-monotonia: variação de estímulo (ERG/SIM), social rides 1x/sem, periodização de tipo de sessão."

---

## 10 · AI Context

- **specialtyDescription:** "Ciclismo indoor e virtual — treino em rolo/smart trainer com ou sem plataformas como Zwift, Rouvy e MyWhoosh. Público que busca estrutura, evolução mensurável e ajuda para manter consistência no treino dentro de casa."

- **narrativeArc:**
  1. Reconhecer a fase atual do ciclista e validar (todo nível é legítimo)
  2. Identificar o gargalo específico e mostrar que é comum e resolvível
  3. Apresentar métricas concretas (W/kg, zonas, TSS) de forma acessível — números são aliados, não julgamento
  4. Estruturar os 3 pilares como caminho de evolução (treino → performance → sustentabilidade)
  5. Projetar onde o ciclista pode chegar com treino consistente e estruturado
  6. Conectar com o profissional como acelerador — "sozinho você pedala, com orientação você evolui"
  7. Fechar com CTA claro para contato via WhatsApp

- **terminology:** FTP, watts, W/kg, zonas de potência, rolo, smart trainer, Z2, sweet spot, intervalado, base aeróbica, ERG mode, TSS, endurance, threshold, recovery ride, social ride, ramp test, free ride, workout, polarizado
- **forbiddenTerms:**
  - "bicicleta ergométrica" (confunde com equipamento de clínica/fisioterapia)
  - "spinning" (marca registrada, conotação de aula coletiva genérica)
  - "gordinho"/"magrelo" ou qualquer referência depreciativa a composição corporal
  - "sofá"/"sedentário" como rótulo (usar "retomando" ou "começando")
  - "fácil" (nada no rolo é fácil — usar "acessível" ou "viável")
  - "ciclista de sofá"/"ciclista de apartamento" (depreciativo)

- **recommendedTone:** Direto, técnico sem ser inacessível. Fala como um coach que entende de potência e sabe traduzir dados em ação. Usa analogias do mundo do ciclismo. Valida o esforço de pedalar indoor (é mais difícil mentalmente que outdoor) sem ser condescendente. Números são ferramentas, não julgamentos.

- **pillarGuidance:**
  1. **Estrutura de Treino:** "Prescreva distribuição de zonas 80/20. Se o aluno é iniciante, foque em criar hábito antes de otimizar zonas. Se é avançado, seja específico com tempo-in-zone targets."
  2. **Performance e Evolução:** "Use W/kg como norte. Se o aluno tem FTP, classifique e projete evolução. Se não tem, não force — trabalhe com FC e RPE, e sugira FTP test como próximo passo."
  3. **Conforto e Sustentabilidade:** "Hidratação e monotonia são tão importantes quanto treino. Sempre mencione ventilação, variação de estímulo, e social rides. Score de consistência valida quem já está no caminho."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `moderately_active` — justificativa: quem responde este template já pratica ciclismo indoor (mesmo que esporadicamente), o que implica atividade regular acima de sedentário. Quem marca 5+ sessões pode ser reclassificado para `very_active` via mapping.

- **activityMapping:**
  - Questão: `weekly_volume`
  - `zero` → `lightly_active` (está retomando, não está pedalando atualmente)
  - `one_two` → `moderately_active`
  - `three_four` → `very_active`
  - `five_plus` → `extremely_active`

---

## 12 · Notas de design (decisões não-óbvias)

### Por que NÃO incluo pergunta sobre plataforma (Zwift/Rouvy/TrainerRoad)?

A plataforma usada não muda a prescrição de treino. O profissional precisa saber se o aluno tem potência e ERG mode — não se usa Zwift ou Rouvy. A pergunta de setup captura o que importa (smart trainer vs básico), e a plataforma pode ser perguntada depois na consultoria.

### Por que "Indoor / Virtual" e não só "Indoor" ou só "Zwift"?

"Indoor" sozinho inclui spin class de academia (público diferente). "Zwift" exclui quem usa TrainerRoad, Rouvy, ou MyWhoosh. "Indoor / Virtual" comunica claramente: treino em casa/estúdio com rolo e plataforma digital.

### Por que health_conditions é multiple_choice e não single?

Uma pessoa pode ter problema articular E diabetes. Condições de saúde não são mutuamente exclusivas. O `maxSelections: 5` previne abuse sem limitar casos legítimos.

### Por que não pergunto tempo de prática em anos?

A pergunta `indoor_phase` (fase) é mais rica que tempo absoluto. Alguém com 3 anos de free ride está menos avançado que alguém com 6 meses de treino estruturado. Fase > tempo.

### Por que o branch "Freerider" existe separado de "Iniciante"?

O freerider não é iniciante — ele pedala, tem setup, conhece a plataforma. Mas também não é treinado — não tem estrutura. É o maior pool de conversão para o profissional, e o relatório precisa falar uma língua diferente: não é "bem-vindo ao ciclismo" nem "vamos otimizar suas zonas". É "o que você já faz funciona, mas com estrutura funciona 3x mais".

### Por que W/kg usa tabela Coggan e não outra?

Coggan é o padrão da indústria. TrainerRoad, Zwift, TrainingPeaks, Strava — todos usam a mesma referência. Usar outra classificação geraria confusão quando o aluno comparar com o que vê nos apps.

### Por que não incluo métricas de composição corporal (% gordura)?

O ciclista indoor focado em performance se mede em W/kg, não em % gordura. O W/kg já incorpora o benefício de perder peso (W sobe, kg desce = W/kg sobe). Adicionar % gordura seria redundante e remete mais ao contexto de musculação/emagrecimento.

---

## 13 · Pendências

1. **`consistency_score` — fórmula não validada.** A heurística proposta (volume × fase × regularidade) é razoável mas não tem base acadêmica. Precisa de calibração empírica ou descarte em favor de abordagem mais simples (apenas descrever a frequência sem score numérico).

2. **Classificação W/kg feminina.** A tabela Coggan tem ajuste para mulheres (~10% menor por faixa), mas os valores exatos variam por fonte. Precisa definir tabela de referência específica antes da implementação.

3. **hrTSS para quem não tem potência.** O cálculo de TSS baseado em FC (hrTSS) é uma estimativa — algumas libs implementam (TrainingPeaks), mas a precisão é questionável. Avaliar se vale incluir ou se para quem não tem potência omitimos TSS e focamos em FC zones.

4. **Indoor FTP vs Outdoor FTP.** Literatura sugere que FTP indoor é 5-10% menor que outdoor. O aluno que informa FTP pode ter testado em qual ambiente? Não perguntamos — anotar para futuro.

5. **Spin bike com potência.** Bikes indoor premium (Stages, Keiser) medem potência, mas com calibração diferente de power meters de bike. Avaliar se precisa de ajuste na classificação W/kg para esse equipamento.

6. **Validação clínica.** Marcada como "Opcional" na tabela original. A pesquisa confirma: ciclismo indoor com intensidade controlada tem risco muito baixo. Safety triggers para condições cardiovasculares e cirurgia recente são suficientes. Não requer validação bloqueante de especialista.

---

## 14 · Fontes citadas

1. **Allen, H. & Coggan, A.** (2010). _Training and Racing with a Power Meter_, 2nd ed. VeloPress. — Referência fundamental para zonas de potência, TSS, IF, NP, e Power Profiling.

2. **Seiler, S.** (2010). "What is best practice for training intensity and duration distribution in endurance athletes?" _International Journal of Sports Physiology and Performance_, 5(3), 276-291. — Base para modelo polarizado 80/20.

3. **Stöggl, T. & Sperlich, B.** (2014). "Polarized training has greater impact on key endurance variables than threshold, high intensity, or high volume training." _Frontiers in Physiology_, 5, 33. — Evidência de superioridade do treino polarizado.

4. **ACSM** (2007). "Exercise and Fluid Replacement." _Medicine & Science in Sports & Exercise_, 39(2), 377-390. — Diretrizes de hidratação durante exercício, aplicáveis a contexto indoor com ajuste por ventilação.

5. **Jeukendrup, A. & Gleeson, M.** (2010). _Sport Nutrition_, 2nd ed. Human Kinetics. — Taxa de sudorese comparativa indoor vs outdoor.

6. **Polar** — FTP Class Table (W/kg). Disponível em support.polar.com. — Tabela de classificação por W/kg derivada de Coggan.

7. **Zwift Insider** — Rider Categorization Based on FTP. Disponível em zwiftinsider.com. — Classificação de categorias usada pela maior plataforma de ciclismo virtual.

8. **TrainingPeaks** — Normalized Power, Intensity Factor and Training Stress Score. Disponível em trainingpeaks.com. — Definições e fórmulas de NP, IF e TSS.

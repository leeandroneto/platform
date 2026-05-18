# Research · Especialidade 1 · Emagrecimento

## 0 · Metadados

- **Número:** 1
- **Modality:** musculacao
- **Pasta:** `musculacao/01-emagrecimento/`
- **Plano:** core
- **Validação clínica:** ⚠️ Recomendada (nutricionista esportivo para validar metas calóricas e macros)
- **Pesquisado em:** 2026-04-23
- **Label proposto:** Emagrecimento _(mantido — é o termo que o público busca e se identifica)_
- **`specialty_code` proposto:** `emagrecimento`
- **Fontes consultadas:**
  1. IBGE/PNS 2019 — Pesquisa Nacional de Saúde (prevalência de sobrepeso/obesidade no Brasil)
  2. Mifflin MD, St Jeor ST et al. (1990) — "A new predictive equation for resting energy expenditure in healthy individuals" (_Am J Clin Nutr_)
  3. Schoenfeld BJ, Aragon AA (2018) — "How much protein can the body use in a single meal for muscle-building?" (_J Int Soc Sports Nutr_)
  4. Hall KD et al. (2011) — "Quantification of the effect of energy imbalance on bodyweight" (_Lancet_)
  5. Helms ER, Aragon AA, Fitschen PJ (2014) — "Evidence-based recommendations for natural bodybuilding contest preparation" (_J Int Soc Sports Nutr_) — referência para proteína em déficit
  6. ACSM Position Stand (2009) — "Appropriate physical activity intervention strategies for weight loss and prevention of weight regain for adults"
  7. Sociedade Brasileira de Endocrinologia e Metabologia (SBEM) — Diretrizes de obesidade
  8. Dados Google Trends Brasil — volume de busca "emagrecer", "perder peso", "secar"

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 25-45 anos (pico de procura por personal trainer para emagrecimento)
- **Gênero:** ~65% mulheres, ~35% homens (mulheres buscam mais ativamente ajuda profissional para emagrecimento; homens tendem a tentar sozinhos antes)
- **Contexto socioeconômico:** Classes B e C urbanas. Tem acesso a academia (R$80-200/mês) mas nem sempre ao nutricionista. O personal é visto como "investimento caro mas que funciona"
- **Prevalência:** Brasil tem ~60% de adultos com sobrepeso ou obesidade (PNS 2019). É o MAIOR mercado potencial de qualquer especialidade — literalmente metade dos adultos do país

### Ordem de grandeza

**Mercado gigante.** ~96 milhões de adultos brasileiros com sobrepeso/obesidade. Desses, uma fração busca personal trainer (estimativa conservadora: 2-5% ativamente buscando = 2-5 milhões de pessoas). É o template que vai ser mais usado, de longe.

### Onde estão online

- **Instagram:** principal canal. Hashtags: #emagrecimento (15M+), #projetoverão, #secando, #perdadepeso, #antesedepois. Seguem perfis de coaches, nutricionistas, influencers fitness
- **YouTube:** buscam treinos para emagrecer, "o que comer para secar", rotinas
- **WhatsApp:** grupos de emagrecimento, desafios de 30 dias, comunidades de academia
- **TikTok:** conteúdo rápido de dicas, "o que eu como num dia", transformações
- **Apps:** MyFitnessPal, FatSecret (contagem de calorias), apps de treino

### Linguagem que usam

- **Termos de identidade:** "secar", "perder barriga", "emagrecer de vez", "montar shape", "definir", "perder os quilinhos", "projeto verão", "sair do sedentarismo"
- **Expressões de dor:** "efeito sanfona", "já tentei de tudo", "não consigo manter", "metabolismo travado", "platô", "faço dieta e não emagreço"
- **Expressões de desejo:** "emagrecer com saúde", "sem passar fome", "resultado que dura", "perder peso sem sofrer"
- **Termos de comunidade:** "foco, força e fé" (clichê mas amplamente usado), "bora", "treino é terapia"

### O que os ofende ou afasta

- ❌ Ser chamado de "gordo/a" ou "obeso/a" — mesmo clinicamente correto, é devastador
- ❌ Julgamento moral sobre comida ("você come errado", "falta disciplina")
- ❌ Promessas de resultado rápido ("emagreça 10kg em 2 semanas") — já foram enganados antes
- ❌ Fotos de modelos fitness irreais como "meta"
- ❌ Tom condescendente ou de superioridade
- ❌ Minimizar o esforço ("é só comer menos") — reduz a complexidade da experiência deles

### Dor mais comum

**Ciclo yo-yo.** Já tentaram emagrecer (dieta da moda, treino por 2 meses, app), conseguiram perder um pouco, pararam, recuperaram tudo + extra. A dor não é "não saber o que fazer" — é "já sei o que fazer mas não consigo manter". A frustração acumulada é a barreira principal. Sentem que "não funciona pra mim" quando na verdade o método era insustentável.

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Adultos (18-65 anos) que querem perder gordura corporal com suporte de musculação
- Desde sedentários completos até pessoas que já treinam mas estagnaram
- Qualquer quantidade de peso a perder (5kg ou 40kg — o template adapta via branches e IA)
- Pessoas com condições controladas (tireoide medicada, hipertensão estável) — ajuste de tom, sem bloqueio

### Este template NÃO vai cobrir:

- **Obesidade grau III (IMC > 40) com comorbidades severas** — precisa de equipe multidisciplinar (endocrinologista, cirurgião bariátrico). O safety trigger direciona
- **Emagrecimento para competição** (cutting extremo, bodybuilding prep) — vai para template #4 (Fisiculturismo) ou #5 (Estética/Definição)
- **Transtornos alimentares ativos** (anorexia, bulimia, compulsão severa) — safety trigger ativa, omite metas calóricas, direciona para acompanhamento psicológico
- **Menores de 18 anos** — bloco universal coleta idade; IA ajusta recomendações, mas template não é desenhado para adolescentes
- **Emagrecimento pós-parto** — template #7 (Gestante/Pós-parto)
- **Idosos 60+** — template #6 (Terceira idade)

---

## 3 · Motores escolhidos

### Motores considerados e triagem

| Motor                          | Considerado? | Decisão                          | Razão                                                                                                                                                                   |
| ------------------------------ | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor 1 (Contexto atual)       | Sim          | **Descartado**                   | Q3 (treino semanal real) captura melhor o contexto atual via comportamento concreto, sem sobreposição                                                                   |
| Motor 2 (Gargalo)              | Sim          | ✅ **Incluído**                  | Essencial — define o foco do relatório. Os gargalos de emagrecimento são extremamente bem mapeados                                                                      |
| Motor 3 (Nível/Maturidade)     | Sim          | **Descartado**                   | Para emagrecimento, "nível de treino" é menos relevante que "fase da jornada" (Motor 6). A maturidade técnica importa menos que o histórico emocional com emagrecimento |
| Motor 4 (Comportamento)        | Sim          | ✅ **Incluído (2×)**             | Comportamento é REI neste template. Treino real (Q3) + alimentação real (Q4) — são os dois eixos que determinam resultado                                               |
| Motor 5 (Ambiente)             | Sim          | ✅ **Incluído**                  | Disponibilidade semanal muda substancialmente a prescrição e a expectativa temporal                                                                                     |
| Motor 6 (Identidade/Fase)      | Sim          | ✅ **Incluído como segmentação** | A "fase" na jornada de emagrecimento (início/recomeço/platô) é o fator que mais muda o arco narrativo do relatório                                                      |
| Motor 7 (Métricas/Ferramentas) | Sim          | **Descartado**                   | Público de emagrecimento não usa ferramentas técnicas (FC, potência). Quem usa balança/fita métrica já está representado. Não agrega sinal suficiente                   |
| Motor 8 (Safety)               | Sim          | ✅ **Incluído**                  | Obrigatório — emagrecimento tem interseção com condições metabólicas, cardiovasculares e transtornos alimentares                                                        |

### Justificativa do duplo Motor 4

Emagrecimento é uma das únicas especialidades onde **dois comportamentos distintos e independentes** determinam o resultado: treino e alimentação. Um sem o outro não funciona. Uma pessoa pode treinar 5x/semana e comer mal (não emagrece). Outra pode comer perfeitamente e não treinar (perde peso mas perde massa magra). O relatório precisa saber AMBOS para calibrar as recomendações.

### Lista final (5 motores → 6 perguntas)

1. **Segmentação (Motor 6 · Identidade/Fase)** → `journey_phase` — Em qual momento da jornada de emagrecimento a pessoa está
2. **Gargalo (Motor 2)** → `main_obstacle` — O que mais trava o resultado
3. **Comportamento: treino (Motor 4)** → `weekly_training` — Quantos dias REALMENTE treinou na última semana
4. **Comportamento: alimentação (Motor 4)** → `eating_pattern` — Como é a alimentação real, hoje
5. **Disponibilidade (Motor 5)** → `available_days` — Quantas vezes por semana PODE treinar
6. **Safety (Motor 8)** → `health_conditions` — Triagem de condições que requerem atenção

---

## 4 · Perguntas e opções

### Q1 · `journey_phase` _(Motor 6 · Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Em qual momento você está?"
**Helper:** "Não tem resposta certa — cada fase tem seu caminho"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** `quick`

**Opções:**

- **`starting`** — "Estou começando agora"
  - Safety trigger? Não

- **`restarting`** — "Já tentei antes, quero retomar"
  - Safety trigger? Não

- **`plateau`** — "Treino mas parei de ver resultado"
  - Safety trigger? Não

**Justificativa da pergunta:** A fase na jornada de emagrecimento é o preditor mais forte do tom e conteúdo do relatório. Alternativa descartada: "Há quanto tempo tenta emagrecer?" — captura tempo mas não captura o ESTADO EMOCIONAL e a experiência qualitativa. "Em qual momento você está?" permite que a pessoa se RECONHEÇA na opção (alto engajamento) e dá à IA informação suficiente para calibrar todo o arco narrativo.

**Justificativa das opções:** Cobertura de ~95% dos casos. Quem nunca tentou = starting. Quem já tentou e parou = restarting (a maioria). Quem está ativo mas estagnado = plateau. Caso de borda não coberto: pessoa que está emagrecendo com sucesso e quer otimizar — mas essa pessoa dificilmente busca um novo personal via Instagram; já tem acompanhamento.

---

### Q2 · `main_obstacle` _(Motor 2 · Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais atrapalha seu resultado?"
**Helper:** "Escolha o que pesa MAIS — mesmo que vários se apliquem"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`

**Opções:**

- **`inconsistent_eating`** — "Alimentação descontrolada"
  - Safety trigger? Não

- **`no_routine`** — "Não consigo manter rotina de treino"
  - Safety trigger? Não

- **`emotional_eating`** — "Como por ansiedade, estresse ou emoção"
  - Safety trigger? Não

- **`lost`** — "Não sei o que fazer (treino ou alimentação)"
  - Safety trigger? Não

- **`motivation_loss`** — "Perco a motivação depois de um tempo"
  - Safety trigger? Não

**Justificativa da pergunta:** O gargalo determina o FOCO do relatório. Alternativa descartada: pergunta aberta ("o que te atrapalha?") — gera dados não-estruturáveis pela IA e aumenta fricção (precisa pensar e digitar). Single choice com opções fortes é mais eficiente e dá sinal claro.

**Justificativa das opções:** Baseado em literatura sobre barreiras ao emagrecimento (ACSM 2009, estudos de aderência) e na prática real de personal trainers brasileiros. Os 5 gargalos cobrem ~90% dos casos. Caso de borda: "tenho lesão que me impede" — capturado em Q6 (health_conditions). "Problema hormonal" — capturado em Q6 (tireoide) e ajustado via tom, não via gargalo.

---

### Q3 · `weekly_training` _(Motor 4 · Comportamento real)_

**Type:** `single_choice`
**Label (client-facing):** "Na última semana, quantos dias você treinou?"
**Helper:** "Conta qualquer atividade intencional: academia, caminhada, aula, treino em casa"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`

**Opções:**

- **`zero`** — "Nenhum"
  - Safety trigger? Não

- **`one_two`** — "1 a 2 dias"
  - Safety trigger? Não

- **`three_four`** — "3 a 4 dias"
  - Safety trigger? Não

- **`five_plus`** — "5 ou mais dias"
  - Safety trigger? Não

**Justificativa da pergunta:** Comportamento REAL e RECENTE. "Na última semana" é concreto — não permite autoimagem inflada ("eu treino 4x" quando na verdade treinou 1x no último mês). Alternativa descartada: "Quantas vezes por semana você costuma treinar?" — "costuma" permite resposta aspiracional, não real. A pergunta no passado recente captura verdade.

**Justificativa das opções:** Faixas claras e mutuamente exclusivas. Mapeiam diretamente para `activity_level` nos cálculos metabólicos (seção 11). Cobrem 100% dos cenários.

---

### Q4 · `eating_pattern` _(Motor 4 · Comportamento real)_

**Type:** `single_choice`
**Label (client-facing):** "Como está sua alimentação hoje?"
**Helper:** "Sem certo ou errado — quanto mais honesto, melhor o relatório"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`chaotic`** — "Sem controle, como o que aparece"
  - Safety trigger? Não

- **`trying`** — "Tento comer bem mas escorrego com frequência"
  - Safety trigger? Não

- **`reasonable`** — "Razoável na maioria dos dias"
  - Safety trigger? Não

- **`controlled`** — "Bem controlada, sei o que como"
  - Safety trigger? Não

**Justificativa da pergunta:** Alimentação é o fator #1 em emagrecimento — treino sem nutrição adequada não produz resultado. Alternativa descartada: "Você segue alguma dieta?" — binária demais (sim/não) e carregada (dieta = restrição). "Como está sua alimentação hoje?" é aberto, não-julgante, e as opções capturam um espectro contínuo de controle.

**Justificativa das opções:** Espectro de 4 pontos do caos ao controle. Cobrem praticamente 100% dos cenários. Caso de borda: pessoa com transtorno alimentar — se responde "sem controle" por compulsão, é capturada em Q6 (health_conditions); o template não tenta diagnosticar TA via esta pergunta.

---

### Q5 · `available_days` _(Motor 5 · Disponibilidade)_

**Type:** `single_choice`
**Label (client-facing):** "Quantas vezes por semana você consegue treinar?"
**Helper:** "Pense na sua rotina real — trabalho, família, deslocamento"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`2x`** — "2 vezes por semana"
  - Safety trigger? Não

- **`3x`** — "3 vezes por semana"
  - Safety trigger? Não

- **`4_5x`** — "4 a 5 vezes por semana"
  - Safety trigger? Não

- **`6_plus`** — "6 ou mais vezes"
  - Safety trigger? Não

**Justificativa da pergunta:** Disponibilidade determina a prescrição de treino e calibra a projeção temporal. Alternativa descartada: "Onde pretende treinar?" (academia/casa/ar livre) — muda menos o relatório do que a frequência. O PT pergunta local presencialmente. A disponibilidade semanal é o dado que mais impacta a recomendação.

**Justificativa das opções:** Faixas práticas que cobrem todas as realidades. Sem opção "1x" porque 1x por semana com musculação para emagrecimento é subótimo ao ponto de o relatório recomendar complementar com caminhada — mas se a pessoa só pode 2x, o template acomoda. Caso de borda: "nenhum dia" — mas quem está preenchendo já demonstrou intenção de treinar.

---

### Q6 · `health_conditions` _(Motor 8 · Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Marque todas que se aplicam — isso ajuda a personalizar seu relatório com segurança"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`
**maxSelections:** 4

**Opções:**

- **`cardiovascular`** — "Problema cardíaco diagnosticado"
  - Safety trigger? **SIM** (reason: "Cardiopatia diagnosticada requer liberação cardiológica para exercício. Prescrição de intensidade sem avaliação médica é risco direto.")

- **`eating_disorder`** — "Histórico de transtorno alimentar"
  - Safety trigger? **SIM** (reason: "Metas calóricas e de peso para pessoa com histórico de TA podem reativar ou agravar o transtorno. Requer acompanhamento de psicólogo/psiquiatra especializado.")

- **`uncontrolled_diabetes`** — "Diabetes sem acompanhamento médico"
  - Safety trigger? **SIM** (reason: "Diabetes sem acompanhamento pode causar hipoglicemia durante exercício. Prescrição dietética sem médico é risco clínico.")

- **`hypertension_uncontrolled`** — "Pressão alta sem acompanhamento"
  - Safety trigger? **SIM** (reason: "Hipertensão descontrolada + exercício intenso = risco de evento cardiovascular. Precisa de avaliação médica.")

- **`thyroid`** — "Problema de tireoide"
  - Safety trigger? **NÃO** (condição controlada — ajusta tom e expectativa, não bloqueia)

- **`joint_injury`** — "Lesão ou dor articular que limita movimento"
  - Safety trigger? **NÃO** (limita exercícios mas não requer intervenção médica urgente — PT adapta presencialmente)

- **`none`** — "Nenhuma das anteriores"
  - Safety trigger? Não

**Justificativa da pergunta:** Triagem de segurança obrigatória. Formato `multiple_choice` porque a pessoa pode ter mais de uma condição. Alternativa descartada: pergunta binária "tem algum problema de saúde? sim/não" + textarea — gera dado desestruturado, difícil para a IA processar, e aumenta fricção.

**Justificativa das opções:** Foco em condições relevantes para emagrecimento + musculação. Não incluí: "gravidez" (template #7), "idade > 60" (template #6), "uso de anabolizantes" (template #4), "depressão/ansiedade" (relevante mas não é safety trigger — é gargalo emocional, capturado em Q2). Tireoide e lesão articular estão presentes mas SEM safety trigger — são ajustes de contexto, não bloqueios.

**Justificativa dos safety triggers:** Apenas 4 condições ativam safety: cardiovascular, transtorno alimentar, diabetes descontrolada, hipertensão descontrolada. Critério: requerem avaliação/acompanhamento médico presencial para exercício seguro. Tireoide medicada e lesão articular NÃO são safety — o PT adapta presencialmente.

---

## 5 · Branches

### Branch: "Início" (trigger: `journey_phase == starting`)

- **Tom geral:** Acolhedor, encorajador, sem pressão. Celebra a decisão de começar. Evita tom condescendente ("que bom que você veio!") — trata como adulto tomando uma decisão séria.
- **pillarGuidance:**
  - Pilar 1 (Nutrição): foco em criar estrutura básica, não otimizar. "Primeiro passo" > "dieta perfeita". Evitar sobrecarga de informação.
  - Pilar 2 (Treino): foco em criar hábito, não performance. Frequência > intensidade. Celebrar consistência.
  - Pilar 3 (Mentalidade): normalizar os primeiros 30 dias como "fase de construção", não de "resultado visível". Expectativa realista.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:**
  - Timeline: projeção mais conservadora (incluir fase de adaptação de 4 semanas antes de resultado visível)
  - Remover "taxa de perda semanal esperada" se IMC < 25 (pode não precisar perder peso, apenas recompor)
- **Narrative arc override:** Arco "construção" — validação → simplicidade → primeiros passos → compromisso realista → convite ao profissional

**Justificativa:** Quem está começando precisa de ENCORAJAMENTO e SIMPLICIDADE. Se o relatório começa com metas calóricas detalhadas e projeções complexas, assusta. O branch muda substancialmente o tom, o nível de detalhe técnico, e a expectativa temporal.

---

### Branch: "Recomeço" (trigger: `journey_phase == restarting`)

- **Tom geral:** Validante, anti-culpa. Reconhece esforço passado sem romantizar fracasso. Tom de "desta vez vai ser diferente porque o MÉTODO é diferente, não você". Direto, respeitoso.
- **pillarGuidance:**
  - Pilar 1 (Nutrição): foco em sustentabilidade. Anti-dieta restritiva. "Comer bem 80% do tempo > perfeição 100%". Déficit moderado.
  - Pilar 2 (Treino): foco em prazer e rotina, não resultado rápido. "O melhor treino é o que você vai fazer daqui a 6 meses".
  - Pilar 3 (Mentalidade): desconstruir o mito da disciplina. Foco em sistema/ambiente > willpower. Abordar ciclo yo-yo com honestidade.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:**
  - Enfatizar "taxa de perda semanal SUSTENTÁVEL" (0.3-0.5kg, não 1kg+)
  - Adicionar "risco de yo-yo" como métrica PT (derivada de Q1=restarting + Q2)
- **Narrative arc override:** Arco "reconstrução" — validação do esforço passado → diagnóstico do que falhou → nova abordagem → sustentabilidade → convite ao profissional como PARCEIRO (não salvador)

**Justificativa:** O público "recomeço" é o MAIOR segmento de emagrecimento (~50-60% dos leads). Eles têm cicatrizes emocionais de tentativas anteriores. Um relatório que ignora isso e trata como "começando" perde credibilidade instantaneamente. O branch muda o arco narrativo inteiro: de "vamos começar!" para "vamos fazer diferente desta vez".

---

### Branch: "Platô" (trigger: `journey_phase == plateau`)

- **Tom geral:** Técnico-estratégico, de igual para igual. Tom de "consultor" — "vamos analisar os dados e encontrar o ajuste". Menos emocional, mais analítico. Respeita a experiência que a pessoa já tem.
- **pillarGuidance:**
  - Pilar 1 (Nutrição): foco em recalibração. TDEE mudou com o novo peso — o déficit precisa ser recalculado. Abordar "comer pouco demais" como causa possível (metabolismo adaptativo).
  - Pilar 2 (Treino): foco em periodização e variação de estímulo. "Fazer a mesma coisa = obter o mesmo resultado". Introduzir conceito de progressão de carga.
  - Pilar 3 (Mentalidade): foco em composição corporal vs peso na balança. "O número pode não mudar mas o corpo está mudando". Propor métricas alternativas (fotos, roupas, medidas).
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:**
  - Enfatizar composição corporal estimada (relação peso vs altura vs atividade)
  - De-enfatizar peso-alvo puro (pode ser mais relevante medir circunferências)
  - Adicionar "possíveis causas do platô" como seção narrativa (sono, estresse, volume de treino, recálculo nutricional)
- **Narrative arc override:** Arco "otimização" — reconhecimento do progresso já feito → diagnóstico técnico do platô → ajustes específicos → novas métricas de progresso → convite ao profissional para AFINAR (não para "salvar")

**Justificativa:** Platô é o momento onde a maioria abandona de vez — "não funciona pra mim". Um relatório que apenas repete "coma menos, treine mais" confirma o desespero. O branch muda substancialmente: aborda o platô como fenômeno fisiológico normal (metabolismo adaptativo), propõe métricas alternativas ao peso, e posiciona o profissional como ajuste fino, não como última esperança.

---

## 6 · Safety triggers

| Questão             | Opções que ativam           | Reason (clínico)                                                              | Efeito no relatório                                                                                    |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `health_conditions` | `cardiovascular`            | Cardiopatia diagnosticada requer liberação cardiológica para exercício físico | Macros omitidas, timeline omitida, SafetyNote ativada                                                  |
| `health_conditions` | `eating_disorder`           | Metas calóricas/peso podem reativar ou agravar transtorno alimentar           | **Macros omitidas, meta de peso omitida, timeline omitida**, SafetyNote com direcionamento a psicólogo |
| `health_conditions` | `uncontrolled_diabetes`     | Risco de hipoglicemia durante exercício sem supervisão médica                 | Macros omitidas, timeline omitida, SafetyNote ativada                                                  |
| `health_conditions` | `hypertension_uncontrolled` | Risco cardiovascular com exercício intenso sem acompanhamento                 | Macros omitidas, timeline omitida, SafetyNote ativada                                                  |

### safetyTemplate (padrão — usado quando qualquer trigger ativa)

- **Title:** "Seu caminho com acompanhamento profissional"
- **Body:** "Com base nas suas respostas, identificamos que é importante ter acompanhamento médico antes de iniciar ou intensificar seu programa de emagrecimento. Isso NÃO significa que você não pode emagrecer — significa que o caminho mais seguro e eficaz passa por uma avaliação presencial. [profissional_nome] pode trabalhar em conjunto com seu médico para criar um programa que respeite suas necessidades. Entre em contato para agendar uma avaliação inicial."

### safetyTemplate específico para `eating_disorder`

- **Title:** "Cuidado especializado para você"
- **Body:** "Identificamos que você tem histórico de transtorno alimentar. Isso requer um cuidado especial — por isso, este relatório não inclui metas de calorias ou peso. Emagrecimento com saúde para você passa por um acompanhamento psicológico especializado, em paralelo ao trabalho com [profissional_nome]. Não é uma limitação — é o caminho mais seguro e eficaz. Entre em contato com [profissional_nome] para conversar sobre a melhor abordagem para o seu caso."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `imc` — Índice de Massa Corporal

- **O que é:** Relação peso/altura² com interpretação narrativa
- **Por que aparece para o aluno:** É a métrica mais reconhecida pelo público leigo. O aluno quer saber "onde eu estou" e o IMC é a forma mais intuitiva (mesmo com limitações). A NARRATIVA em volta é o que importa — não o número seco.
- **Cálculo:** `peso(kg) / altura(m)²` — classificação OMS (< 18.5 abaixo, 18.5-24.9 normal, 25-29.9 sobrepeso, 30-34.9 obesidade I, 35-39.9 obesidade II, ≥ 40 obesidade III)
- **Visualização proposta:** **Gauge radial** com faixas coloridas (verde/amarelo/laranja/vermelho). Valor central grande. Classificação em texto abaixo ("Sobrepeso leve — mais perto do ideal do que você imagina"). Tom: nunca alarmista, sempre contextualizado.
- **Placeholder:** `[imc_valor]`, `[imc_classificacao]`
- **Nota:** Para o ALUNO, usar classificações humanizadas: "dentro do ideal" / "um pouco acima" / "acima do recomendado" / "significativamente acima". Nunca "obeso".

### 7.2 · `meta_kcal` — Meta calórica diária

- **O que é:** Calorias diárias recomendadas para emagrecer com saúde (TDEE − déficit)
- **Por que aparece para o aluno:** É a métrica mais acionável — "comer X calorias por dia". Dá um número concreto para seguir. Aluno adora números de meta.
- **Cálculo:**
  1. TMB via Mifflin-St Jeor: `10 × peso + 6.25 × altura(cm) − 5 × idade + s` (s = +5 homem, −161 mulher)
  2. TDEE = TMB × fator de atividade (mapeado de `weekly_training`)
  3. Meta = TDEE − déficit (300-500 kcal; nunca abaixo de 1200 kcal mulheres / 1500 kcal homens)
- **Referência:** Mifflin et al. 1990 — equação mais precisa para população com sobrepeso vs Harris-Benedict
- **Visualização proposta:** **Card numérico** grande com o valor central ("~1.800 kcal/dia") e subtexto explicativo ("para perder ~0.4kg por semana com saúde")
- **Placeholder:** `[meta_kcal]`
- **⚠️ Omitido quando:** safety trigger `eating_disorder` ativo

### 7.3 · `meta_proteina` — Meta diária de proteína

- **O que é:** Gramas de proteína recomendadas por dia para preservar massa magra durante déficit calórico
- **Por que aparece para o aluno:** Proteína é o macronutriente mais importante em emagrecimento (saciedade + preservação muscular). Número concreto que o aluno pode seguir.
- **Cálculo:** `1.6 a 2.2g × peso(kg)` — usar 1.6g para sedentários, 2.0g para ativos, 2.2g para alta frequência. Referência: Schoenfeld & Aragon 2018, Helms et al. 2014
- **Visualização proposta:** **Card numérico** com valor e equivalência prática ("~130g/dia ≈ 4 porções de proteína")
- **Placeholder:** `[meta_proteina_g]`
- **⚠️ Omitido quando:** safety trigger `eating_disorder` ativo

### 7.4 · `meta_agua` — Meta diária de hidratação

- **O que é:** Litros de água recomendados por dia
- **Por que aparece para o aluno:** Simples, acionável, todo mundo pode fazer. Hidratação adequada melhora metabolismo, saciedade, performance e recuperação.
- **Cálculo:** `35ml × peso(kg)` — ajustado para cima se `weekly_training >= three_four` (+500ml). Referência: EFSA 2010 (European Food Safety Authority)
- **Visualização proposta:** **Card numérico** com ícone de água e equivalência prática ("~2.5L/dia ≈ 8 copos")
- **Placeholder:** `[meta_agua_l]`

### 7.5 · `projecao_temporal` — Quando vou chegar lá

- **O que é:** Estimativa de semanas para atingir o peso-alvo, assumindo déficit sustentável
- **Por que aparece para o aluno:** É a pergunta #1 de quem quer emagrecer: "quanto tempo vai demorar?" Dar uma projeção REALISTA (não otimista) constrói confiança.
- **Cálculo:** `(peso_atual − peso_meta) / taxa_semanal`. Taxa: 0.3-0.5kg/semana (ACSM 2009 recomenda 0.5-1kg, mas 0.3-0.5 é mais sustentável para público que já fez yo-yo). Ajustar para branch: starting = +4 semanas (adaptação), plateau = +2 semanas (readaptação).
- **Referência:** Hall et al. 2011 (modelagem dinâmica de perda de peso — a taxa NÃO é linear, desacelera com o tempo)
- **Visualização proposta:** **Timeline horizontal** com marcos ("4 semanas: primeiras mudanças visíveis", "12 semanas: resultado consolidado", "X semanas: peso-alvo"). Com faixa de variação (±2 semanas) para não parecer promessa exata.
- **Placeholder:** `[projecao_semanas]`, `[projecao_meses]`
- **⚠️ Omitido quando:** qualquer safety trigger ativo. Também omitido se peso meta não informado.

### 7.6 · `deficit_diario` — Déficit calórico recomendado

- **O que é:** Quanto abaixo do TDEE a pessoa deve comer, em kcal
- **Por que aparece para o aluno:** Contextualiza o meta_kcal — "você vai comer 400 calorias a menos do que gasta". Ajuda a entender a lógica, não só o número.
- **Cálculo:** 300-500 kcal/dia, calibrado por:
  - IMC > 35: pode tolerar 500-700 kcal de déficit (ACSM 2009)
  - IMC 25-35: 300-500 kcal (padrão)
  - IMC < 25: 200-300 kcal (recomposição, não perda agressiva)
  - Branch restarting: usar faixa inferior (300-400) — priorizar sustentabilidade
- **Visualização proposta:** **Card com comparação** — "Você gasta ~2.200 kcal/dia → meta de ~1.800 kcal/dia (déficit de ~400 kcal)"
- **Placeholder:** `[deficit_kcal]`
- **⚠️ Omitido quando:** safety trigger ativo

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `bmi_class` — Classificação IMC técnica

- **O que é:** Classificação OMS com código técnico (underweight / normal / overweight / obesity_1 / obesity_2 / obesity_3)
- **Por que importa para o PT:** Classificação rápida para triagem e priorização de leads. IMC > 30 indica necessidade de avaliação complementar. IMC > 35 exige atenção especial a volume e intensidade.
- **Cálculo:** peso / altura² → classificação OMS
- **Visualização proposta:** **Badge colorido** com classificação (verde/amarelo/laranja/vermelho) + valor numérico

### 8.2 · `tmb` — Taxa Metabólica Basal

- **O que é:** Calorias que o corpo gasta em repouso absoluto
- **Por que importa para o PT:** Base para prescrição nutricional. PT que trabalha com nutricionista precisa desse dado para calibrar.
- **Cálculo:** Mifflin-St Jeor (seção 7.2)
- **Visualização proposta:** **Card numérico** com valor + equação usada

### 8.3 · `tdee` — Gasto Energético Total Diário

- **O que é:** TMB × fator de atividade = total que o corpo gasta por dia
- **Por que importa para o PT:** Referência para prescrever déficit. PT precisa saber o TDEE para calcular quanto cortar.
- **Cálculo:** TMB × activity multiplier (seção 11)
- **Visualização proposta:** **Card numérico** com breakdown (TMB + atividade = TDEE)

### 8.4 · `adherence_score` — Score de adesão estimado

- **O que é:** Previsão de probabilidade de aderência, baseada nas respostas
- **Por que importa para o PT:** Prever quais leads têm maior chance de abandonar permite intervenção proativa. Leads com score baixo podem precisar de mais check-ins.
- **Cálculo:** Score composto (0-100) baseado em:
  - `weekly_training`: zero=0, one_two=25, three_four=50, five_plus=75
  - `eating_pattern`: chaotic=0, trying=25, reasonable=50, controlled=75
  - `journey_phase`: starting=50 (neutro), restarting=25 (risco alto de yo-yo), plateau=60 (já tem hábito)
  - `main_obstacle`: emotional_eating=−15, motivation_loss=−10 (fatores de risco)
  - Score final = média ponderada, cap 0-100
- **Referência:** Modelo próprio baseado em literatura de aderência ao exercício (Dishman 1988, Marcus 2003)
- **Visualização proposta:** **Gauge semicircular** com faixas (0-30 vermelho "alto risco", 30-60 amarelo "atenção", 60-100 verde "bom prognóstico")

### 8.5 · `yoyo_risk` — Flag de risco yo-yo

- **O que é:** Indicador binário de risco elevado de ciclo yo-yo
- **Por que importa para o PT:** Leads em recomeço com gargalo emocional têm altíssimo risco de repetir o padrão. PT precisa saber para adaptar abordagem (menos metas agressivas, mais check-ins, referência a psicólogo se necessário).
- **Cálculo:** `journey_phase == restarting AND (main_obstacle == emotional_eating OR main_obstacle == motivation_loss)` → flag ativa
- **Visualização proposta:** **Badge de alerta** (amarelo/vermelho) com texto "Histórico de tentativas anteriores com gargalo emocional — priorizar sustentabilidade e acompanhamento frequente"

### 8.6 · `metabolic_risk` — Classificação de risco metabólico

- **O que é:** Indica se há sinais de risco metabólico baseado em IMC + condições de saúde
- **Por que importa para o PT:** Triagem rápida para decidir se precisa encaminhar para médico antes de começar
- **Cálculo:**
  - `bmi >= 35` OU `health_conditions inclui diabetes/cardiovascular/hypertension` → risco alto
  - `bmi 30-35` sem condições → risco moderado
  - `bmi < 30` sem condições → risco baixo
- **Visualização proposta:** **Semáforo** (verde/amarelo/vermelho) com descrição

---

## 9 · Pilares do relatório

### Pilar 1 · Alimentação inteligente

- **Subtitle:** "Comer para emagrecer sem sofrer"
- **Conceito central:** Emagrecimento sustentável não vem de dieta restritiva — vem de um déficit calórico moderado com nutrição adequada. Proteína preserva massa muscular, hidratação potencializa metabolismo, e estrutura reduz decisões ruins. O objetivo não é a "dieta perfeita" — é um padrão alimentar que funciona 80% do tempo, nos dias bons E nos ruins.
- **Evidência científica:** Déficit moderado (300-500 kcal/dia) preserva massa magra e metabolismo melhor que déficits agressivos (Garthe et al. 2011). Proteína em 1.6-2.2g/kg é consenso para preservação muscular em déficit (Helms et al. 2014, Schoenfeld & Aragon 2018).
- **Placeholders:** `[meta_kcal]`, `[meta_proteina_g]`, `[meta_agua_l]`, `[deficit_kcal]`, `[profissional_nome]`
- **Exemplo de texto popular (80 palavras):** "Seu corpo gasta cerca de [meta_kcal + deficit_kcal] calorias por dia. Pra emagrecer com saúde, sua meta é consumir em torno de [meta_kcal] calorias — um déficit de [deficit_kcal] calorias que é suficiente pra perder gordura sem passar fome. A prioridade é proteína: [meta_proteina_g]g por dia mantém sua massa muscular enquanto o corpo queima gordura. E [meta_agua_l]L de água por dia ajudam tudo a funcionar melhor. Sem dieta radical, sem cortar grupos alimentares inteiros."
- **Exemplo de texto técnico (40 palavras):** "Déficit estimado de [deficit_kcal] kcal/dia sobre TDEE de [tdee] kcal (Mifflin-St Jeor × fator atividade). Proteína em [meta_proteina_g]g/dia (≈2.0g/kg) para preservação de massa magra em déficit. Hidratação em [meta_agua_l]L/dia. Periodização nutricional a critério do profissional."

### Pilar 2 · Treino estratégico

- **Subtitle:** "Menos é mais quando é feito certo"
- **Conceito central:** Para emagrecer, o treino ideal combina musculação (preserva massa magra, aumenta metabolismo basal) com atividade aeróbia leve-moderada (aumenta gasto calórico sem comprometer recuperação). A frequência ideal é a POSSÍVEL — 3x de musculação bem feita vale mais que 6x mal feita. Progressão de carga é o estímulo que mantém o corpo adaptando.
- **Evidência científica:** Musculação durante déficit calórico preserva significativamente mais massa magra que cardio isolado (Villareal et al. 2017). ACSM recomenda 150-250min/semana de atividade moderada para prevenção de reganho (ACSM 2009). Treino de resistência 2-4x/semana é suficiente para estímulo preservador.
- **Placeholders:** `[frequencia]`, `[profissional_nome]`
- **Exemplo de texto popular (80 palavras):** "Musculação é sua maior aliada no emagrecimento — e não é porque 'queima caloria'. É porque músculos ativos aceleram seu metabolismo o dia inteiro, mesmo em repouso. Com [frequencia] treinos por semana, focando em exercícios que trabalham grandes grupos musculares, seu corpo vira uma máquina de queima de gordura. Nos outros dias, caminhada leve de 30-40 minutos complementa sem sobrecarregar. [profissional_nome] vai montar a divisão ideal pra sua rotina."
- **Exemplo de texto técnico (40 palavras):** "Protocolo sugerido: musculação [frequencia]×/semana com foco em compostos multiarticulares. Complementar com LISS 150-200min/semana. Progressão de carga semanal para manter estímulo adaptativo. Periodização e ajuste de volume a critério de [profissional_nome]."

### Pilar 3 · Consistência acima de tudo

- **Subtitle:** "O segredo não é motivação — é rotina"
- **Conceito central:** Resultado em emagrecimento é função de consistência ao longo do tempo, não de perfeição em curto prazo. Motivação é combustível de ignição; hábito é o motor. Sono inadequado (< 7h) aumenta grelina e reduz leptina, sabotando o déficit. Estresse crônico eleva cortisol e promove acúmulo de gordura visceral. Gerenciar sono, estresse e expectativa é tão importante quanto treino e alimentação.
- **Evidência científica:** Sono < 6h reduz perda de gordura em 55% mesmo em déficit calórico equivalente (Nedeltcheva et al. 2010). Cortisol crônico promove lipogênese visceral (Björntorp 2001). Aderência a longo prazo é o preditor mais forte de sucesso em emagrecimento (Wing & Phelan 2005).
- **Placeholders:** `[profissional_nome]`, `[projecao_semanas]`
- **Exemplo de texto popular (80 palavras):** "A diferença entre quem emagrece e quem emagrece DE VEZ não é genética, disciplina ou força de vontade. É consistência. Treinar [frequencia]x por semana por [projecao_semanas] semanas vale infinitamente mais que treinar todo dia por 3 semanas e parar. Dormir 7-8 horas potencializa seus resultados. Gerenciar estresse impede que o cortisol sabote seu déficit. [profissional_nome] não vai te dar uma dieta mágica — vai te ajudar a construir hábitos que duram."
- **Exemplo de texto técnico (40 palavras):** "Aderência > otimização em fase de déficit. Priorizar sono (7-9h) para regulação de grelina/leptina. Monitorar sinais de cortisol crônico (retenção hídrica, estagnação apesar de déficit). Check-ins semanais com [profissional_nome] para ajuste progressivo."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

### specialtyDescription

"Emagrecimento com musculação para adultos brasileiros. O público varia de sedentários que nunca treinaram a praticantes que estagnaram. A maioria tem histórico de tentativas anteriores (efeito yo-yo). O relatório precisa equilibrar empatia emocional com precisão técnica — validar sem ser condescendente, orientar sem prometer milagres."

### narrativeArc

1. **Abertura acolhedora** — reconhecer a coragem de buscar ajuda profissional (sem exagero)
2. **Diagnóstico empático** — conectar as respostas do formulário com a realidade do aluno ("pelos seus dados, vejo que...")
3. **Contexto educativo** — explicar POR QUE o corpo funciona como funciona (metabolismo, déficit, preservação muscular)
4. **Métricas personalizadas** — apresentar os números com interpretação (não apenas dados soltos)
5. **Pilares acionáveis** — cada pilar com 1-2 ações concretas que o aluno pode começar HOJE
6. **Projeção realista** — timeline honesta, com faixa de variação, sem promessa
7. **Convite ao profissional** — posicionar [profissional_nome] como parceiro do caminho, não como vendedor

### terminology

Termos que a IA pode e deve usar:

- "emagrecer", "perder gordura", "secar" (coloquial, aceito)
- "déficit calórico" (com explicação na primeira menção)
- "metabolismo", "metabolismo basal"
- "massa muscular", "massa magra"
- "composição corporal"
- "proteína", "hidratação"
- "consistência", "rotina", "hábito"
- "progressão", "adaptação"
- "recomposição corporal" (com explicação)

### forbiddenTerms

- ❌ "obeso/a", "obesidade" — usar "acima do peso recomendado" (clínico demais, ofensivo para público leigo)
- ❌ "gordo/a" — nunca, em nenhum contexto
- ❌ "dieta" isolado — usar "alimentação", "plano alimentar", "padrão alimentar" (dieta = sofrimento no imaginário popular)
- ❌ "regime" — mesma razão
- ❌ "sacrifício", "sofrer", "abrir mão" — reforça mentalidade de privação
- ❌ "disciplina" como virtude moral — usar "consistência", "rotina" (disciplina implica culpa quando falha)
- ❌ "queimar calorias" como foco principal — pode ser mencionado contextualmente mas não como objetivo do treino
- ❌ "emagrecer rápido", "resultado rápido" — nunca prometer velocidade
- ❌ "redução localizada", "perder barriga" como promessa — é mito fisiológico
- ❌ "preguiça", "falta de vontade" — julgamento moral

### recommendedTone

"Profissional de saúde que é também um comunicador empático. Fala como um personal trainer experiente que ENTENDE a frustração do aluno mas não alimenta vitimismo. Direto sem ser frio. Técnico quando necessário, mas sempre traduz para linguagem acessível. Validante sem ser bajulador. O tom de alguém que acredita genuinamente que o aluno vai conseguir — porque tem as ferramentas certas."

### pillarGuidance

1. **Alimentação:** "Foque em praticidade e sustentabilidade. Use os placeholders numéricos (meta_kcal, meta_proteina_g) para dar concretude. Nunca proponha cardápio — apenas diretrizes. Contextualize o déficit como algo moderado e gerenciável, não como privação."
2. **Treino:** "Foque em frequência possível, não ideal. Use [frequencia] do formulário. Valorize musculação como ferramenta metabólica, não apenas calórica. Mencione exercícios compostos mas não prescreva — direcione para [profissional_nome]."
3. **Consistência:** "Aborde sono e estresse como pilares silenciosos. Desconstrua a ideia de que resultado = motivação constante. Use [projecao_semanas] para ancorar expectativa temporal realista. Feche com convite ao profissional."

---

## 11 · Configuração de cálculos

### activityLevelDefault

`sedentary` — Justificativa: a maioria do público de emagrecimento é sedentário ou levemente ativo. Usar "sedentary" como default garante que o TDEE não seja superestimado para quem não responde a pergunta de frequência. Superestimar TDEE = déficit insuficiente = sem resultado = perda de credibilidade do relatório.

### activityMapping

Pergunta fonte: `weekly_training`

| Resposta     | `activity_level`    | Multiplicador |
| ------------ | ------------------- | ------------- |
| `zero`       | `sedentary`         | 1.2           |
| `one_two`    | `lightly_active`    | 1.375         |
| `three_four` | `moderately_active` | 1.55          |
| `five_plus`  | `very_active`       | 1.725         |

**Nota:** O multiplicador `extremely_active` (1.9) não é usado neste template — é para atletas de alto volume, que não são o público de emagrecimento.

### Cálculos implementados

| Cálculo        | Fórmula                                               | Referência                      |
| -------------- | ----------------------------------------------------- | ------------------------------- |
| TMB (homens)   | `10 × peso(kg) + 6.25 × altura(cm) − 5 × idade + 5`   | Mifflin-St Jeor 1990            |
| TMB (mulheres) | `10 × peso(kg) + 6.25 × altura(cm) − 5 × idade − 161` | Mifflin-St Jeor 1990            |
| TDEE           | `TMB × activity_multiplier`                           | —                               |
| IMC            | `peso(kg) / altura(m)²`                               | OMS                             |
| Meta calórica  | `TDEE − déficit` (min 1200♀ / 1500♂)                  | ACSM 2009                       |
| Meta proteína  | `peso(kg) × 1.6-2.2` (fator por atividade)            | Schoenfeld & Aragon 2018        |
| Meta água      | `peso(kg) × 0.035` (+0.5L se ativo)                   | EFSA 2010                       |
| Projeção       | `(peso_atual − peso_meta) / 0.4` semanas              | Hall et al. 2011 (simplificado) |
| Déficit        | 300-500 kcal (ajustado por IMC e branch)              | ACSM 2009                       |

---

## 12 · Notas de design (decisões não-óbvias)

### Por que mantive o label "Emagrecimento" e não renomeei

Considerei alternativas: "Perda de gordura", "Redução de peso", "Recomposição corporal". Todas são tecnicamente mais precisas mas NENHUMA é o que o público busca. No Google Trends Brasil, "emagrecer" tem volume de busca 10-20× maior que qualquer alternativa. No Instagram, #emagrecimento tem 15M+ posts. O hub mostra um card para o aluno — ele precisa se reconhecer instantaneamente. "Emagrecimento" é a palavra-gatilho do público. A IA no relatório pode usar linguagem mais sofisticada ("perda de gordura", "recomposição"), mas o label precisa falar a língua do lead.

### Por que Motor 4 aparece duas vezes (treino + alimentação)

Tipicamente um template usa cada motor no máximo 1 vez. Justifiquei na seção 3: emagrecimento é a única especialidade onde dois comportamentos INDEPENDENTES (treino e alimentação) são igualmente determinantes. Um não substitui o outro. Se eu fundisse numa pergunta só ("como está seu estilo de vida?"), perderia granularidade crítica para o relatório.

### Por que NÃO incluí pergunta sobre tipo de treino (musculação vs cardio vs funcional)

O template é da modalidade "musculação" — o aluno já selecionou musculação no hub. Perguntar de novo qual tipo de treino prefere é redundante e confuso. Se pratica outra atividade em paralelo (corrida, funcional), não muda substancialmente o relatório de emagrecimento com musculação. O PT ajusta presencialmente.

### Por que NÃO incluí pergunta sobre "foco visual" (barriga, braço, perna)

Redução localizada é mito fisiológico. Se perguntasse "onde quer perder gordura?", o aluno esperaria recomendações localizadas no relatório — que não podemos entregar com honestidade. Criar expectativa que não pode ser cumprida é pior que não perguntar. O PT pergunta presencialmente e adapta ênfase de treino (trabalhar core por força, não por "queimar gordura abdominal").

### Por que `eating_disorder` tem safetyTemplate específico

Diferente das outras condições (cardiovascular, diabetes), onde o safety omite macros e timeline mas mantém estrutura do relatório, transtorno alimentar requer que o relatório NÃO MENCIONE nenhum número relacionado a comida ou peso. Nem meta calórica, nem proteína, nem peso-alvo, nem timeline de perda. Qualquer número pode ser gatilho. Por isso um template de safety separado, com redação específica.

### Por que 3 branches em vez de mais (ex: separar "recomeço com sucesso parcial" de "recomeço com fracasso total")

Mais granularidade = mais perguntas de follow-up ou opções demais na segmentação. 3 branches capturam os 3 ESTADOS EMOCIONAIS distintos: empolgação do novo (starting), frustração do repetido (restarting), perplexidade do estagnado (plateau). Sub-estados dentro de cada um são resolvidos pela combinação com Q2 (gargalo) — a IA cruza as informações.

### Por que o score de adesão é apenas para o PT e não aparece para o aluno

Mostrar ao aluno "sua probabilidade de sucesso é 35%" é devastador emocionalmente e contraproducente. O PT precisa desse dado para estratégia; o aluno não. É a diferença mais clara entre métricas PT vs aluno neste template.

### Por que tireoide NÃO é safety trigger

Hipotireoidismo é a condição endócrina mais citada por pessoas com dificuldade para emagrecer. Mas tireoide MEDICADA e acompanhada não contraindica exercício nem exige tratamento médico urgente — apenas desacelera metabolismo (~200-300 kcal/dia a menos). O template ajusta expectativa de projeção temporal via IA ("considerando sua condição de tireoide, o ritmo pode ser mais gradual"), mas não bloqueia metas calóricas. Se a tireoide NÃO está medicada, o aluno deveria primeiro procurar endocrinologista — mas isso é capturado implicitamente pelo tom do relatório, não por um safety trigger completo.

---

## 13 · Pendências

### Perguntas incertas

- **"Toma alguma medicação?"** — Descartei porque abre escopo demais (centenas de medicações) e o PT pergunta presencialmente. Mas medicações como corticoides crônicos afetam significativamente o emagrecimento. Validar com profissional se vale incluir.
- **"Qual seu nível de estresse?"** — Relevante (cortisol afeta emagrecimento) mas difícil de quantificar em single_choice sem parecer superficial. Optei por abordar estresse no Pilar 3 via IA, não como pergunta.

### Cálculos cuja lib ainda não foi identificada

- **Projeção temporal dinâmica (Hall et al. 2011):** O modelo de Hall é um sistema de equações diferenciais que prevê a taxa decrescente de perda de peso ao longo do tempo (não linear). A simplificação usada aqui (`peso_diff / 0.4kg/semana`) é MUITO simplificada. Buscar lib que implemente o modelo completo ou usar a aproximação com nota de que "a taxa desacelera com o tempo".
- **Score de adesão:** Modelo próprio sem validação científica formal. É heurístico. Funcional para triagem mas não deveria ser apresentado como "científico". Documentar como "estimativa baseada em fatores de risco conhecidos".

### Decisões que dependem de validação profissional

- **Faixa de déficit calórico por IMC:** A progressão 200-300 / 300-500 / 500-700 por faixa de IMC precisa ser validada por nutricionista esportivo. A literatura suporta déficits mais agressivos em obesidade (ACSM), mas a prática brasileira com público leigo pode preferir conservadorismo.
- **Meta de proteína para sedentários (1.6g/kg):** Pode ser agressiva para quem nunca treinou — a absorção/adesão a alto teor de proteína é desafiadora. Validar se 1.4g/kg é mais realista como ponto de partida.

### Casos de borda não cobertos

- **Adolescentes (< 18 anos):** Template não é desenhado para menores. Se o bloco universal coleta idade < 18, a IA deve ajustar tom e NÃO recomendar déficit calórico (crescimento). Não foi modelado como branch.
- **Idosos (60+):** Direcionados para template #6 (Terceira idade). Se alguém 60+ preenche este template, a IA deve ajustar (sarcopenia é risco maior que estética). Não foi modelado.
- **Pós-bariátrica:** Pessoa que fez cirurgia bariátrica tem necessidades nutricionais muito específicas. Não coberto — seria caso de Custom ou encaminhamento.
- **Uso de GLP-1 agonistas (Ozempic, Wegovy):** Crescente no Brasil. Afeta metabolismo, apetite e composição corporal. Não perguntado no template — poderia ser adicionado em versão futura como opção em `health_conditions`.

---

## 14 · Fontes citadas

1. **IBGE/PNS (2019).** Pesquisa Nacional de Saúde — Percepção do estado de saúde, estilos de vida, doenças crônicas e saúde bucal. IBGE, Rio de Janeiro.
2. **Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO (1990).** A new predictive equation for resting energy expenditure in healthy individuals. _American Journal of Clinical Nutrition_, 51(2), 241-247.
3. **Schoenfeld BJ, Aragon AA (2018).** How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution. _Journal of the International Society of Sports Nutrition_, 15(1), 10.
4. **Helms ER, Aragon AA, Fitschen PJ (2014).** Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. _Journal of the International Society of Sports Nutrition_, 11(1), 20.
5. **Hall KD, Sacks G, Chandramohan D, et al. (2011).** Quantification of the effect of energy imbalance on bodyweight. _The Lancet_, 378(9793), 826-837.
6. **ACSM Position Stand (2009).** Appropriate physical activity intervention strategies for weight loss and prevention of weight regain for adults. _Medicine & Science in Sports & Exercise_, 41(2), 459-471.
7. **Garthe I, Raastad T, Refsnes PE, Koivisto A, Sundgot-Borgen J (2011).** Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes. _International Journal of Sport Nutrition and Exercise Metabolism_, 21(2), 97-104.
8. **Villareal DT, Aguirre L, Gurney AB, et al. (2017).** Aerobic or resistance exercise, or both, in dieting obese older adults. _New England Journal of Medicine_, 376(20), 1943-1955.
9. **Nedeltcheva AV, Kilkus JM, Imperial J, Schoeller DA, Penev PD (2010).** Insufficient sleep undermines dietary efforts to reduce adiposity. _Annals of Internal Medicine_, 153(7), 435-441.
10. **Björntorp P (2001).** Do stress reactions cause abdominal obesity and comorbidities? _Obesity Reviews_, 2(2), 73-86.
11. **Wing RR, Phelan S (2005).** Long-term weight loss maintenance. _American Journal of Clinical Nutrition_, 82(1), 222S-225S.
12. **EFSA (2010).** Scientific Opinion on Dietary Reference Values for water. _EFSA Journal_, 8(3), 1459.
13. **SBEM — Sociedade Brasileira de Endocrinologia e Metabologia.** Diretrizes Brasileiras de Obesidade, 4ª edição (2016).

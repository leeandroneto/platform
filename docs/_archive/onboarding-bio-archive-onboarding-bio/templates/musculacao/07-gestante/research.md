# Research · Especialidade 7 · Gestante e Pós-parto

## 0 · Metadados

- **Número:** 7
- **Modality:** musculacao
- **Pasta:** `musculacao/07-gestante/`
- **Plano:** pro
- **Validação clínica:** 🚨 Bloqueante — obstetra (contraindicações absolutas) + educador físico com formação em gestante/puérpera (prescrição segura)
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. ACOG Committee Opinion 804 (2020) — Physical Activity and Exercise During Pregnancy
  2. FEBRASGO — Recomendações para a prática de exercício físico na gravidez
  3. SBC/DERC (2021) — Posicionamento sobre exercícios na gestação e pós-parto (Arq Bras Cardiol)
  4. IOM/National Academies (2009) — Weight Gain During Pregnancy: Reexamining the Guidelines
  5. Cochrane Reviews — Exercise for prevention of pre-eclampsia and gestational diabetes
  6. SBMEE — Posicionamento oficial sobre atividade física e saúde da mulher
  7. Estudos brasileiros de prevalência de atividade física em gestantes (PLoS ONE, SciELO, RBSMI)
  8. Gizele Monteiro / Método Gerar — referência de mercado brasileiro para personal gestante

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária:** 28-40 anos (tendência crescente — gestantes com 35+ anos crescem +1,1 p.p./ano no Brasil)
- **Gênero:** 100% feminino
- **Contexto socioeconômico:** predominantemente classe B/C+. Gestantes com 12+ anos de escolaridade têm 2,2x mais chance de se exercitar no lazer. Renda acima de 2 salários mínimos é fator protetor (OR 0.24)
- **Localização:** urbana, concentrada em capitais e regiões metropolitanas

### Ordem de grandeza

- **~2,4 milhões de nascimentos/ano** (IBGE, 2024). Estimativa de 1,5-1,8 milhão de gestantes simultâneas
- **Apenas 4,3% mantêm exercício ao longo de toda a gestação.** Queda progressiva: 10,4% (1T) → 8,5% (2T) → 6,5% (3T)
- Mercado de alta demanda latente — milhões de gestantes, menos de 5% com acompanhamento de exercício
- Público que PAGA por personal é o segmento alto desse mercado: mulheres com renda, escolaridade e acesso a Instagram

### Onde estão online

- **Instagram** é o canal #1 — seguem perfis como @gizelemonteiro, @aryoficial, @carolbuffara
- **YouTube** para vídeos de treino seguro na gravidez
- **Grupos de WhatsApp** de gestantes (montados por clínicas, doulas, cursos de parto)
- **Apps**: mercado fragmentado, sem líder brasileiro. Apps gringos traduzidos dominam (Pregnancy Workouts, Mommacise)
- **Hotmart/Kiwify**: cursos para gestantes e para personal trainers que atendem gestantes

### Linguagem-padrão

- "exercício na gravidez", "treino para gestante", "personal gestante"
- "diástase", "assoalho pélvico", "Kegel"
- "puerpério", "pós-parto", "recuperação pós-parto"
- "barriga pós-parto", "barriga de mãe"
- "trimestre" (1º, 2º, 3º)
- "volta ao treino", "retorno pós-parto"
- "escape de xixi" (incontinência em linguagem popular)
- "o que pode e o que não pode" (busca mais comum)

### O que ofende ou afasta

- **"Emagrecer na gravidez"** — ofensivo e clinicamente errado. Ganho de peso é esperado e saudável
- **"Secar"** / **"queimar gordura"** — linguagem de cutting aplicada a gestante é absurda
- **"Barriga feia"** / **"corpo destruído"** — body shaming pós-parto afasta imediatamente
- **Tom paternalista** — "grávida tem que ficar de repouso" ou "cuidado, não force"
- **Promessas de resultado rápido** pós-parto — "corpo de antes em 30 dias" é mentira e pressão
- **Limite de 140 bpm** — informação desatualizada desde 1994 (ACOG abandonou). Usar como regra demonstra desconhecimento

### Dor mais comum que leva a procurar ajuda

**"Não sei o que é seguro fazer."** A insegurança sobre o que pode e o que não pode é o driver #1. A gestante QUER se exercitar mas tem medo de errar e prejudicar o bebê. O personal especializado oferece segurança, validação e permissão para se mover. Secundariamente: controle de peso gestacional, dores lombares, e preparação para o parto.

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- **Gestantes saudáveis** nos 3 trimestres que buscam orientação de exercício
- **Puérperas** nos primeiros 12 meses pós-parto que querem retornar ao exercício
- Profissionais (PT/EF) que atendem esse público e querem um formulário premium para captar leads

### Este template NÃO vai cobrir:

- **Gestação de alto risco com repouso absoluto prescrito** — essas mulheres não devem preencher formulário de exercício, devem ser orientadas a seguir prescrição médica. O safety trigger cobre isso
- **Pós-parto >12 meses** — após 1 ano, a mulher é funcionalmente uma adulta regular e pode usar templates de musculação geral
- **Prescrição de exercícios de assoalho pélvico** — o template identifica se há sintomas, mas a prescrição específica de Kegel/hipopressivos é escopo de fisioterapeuta pélvica, não do PT
- **Nutrição gestacional detalhada** — mencionamos hidratação e conceitos gerais, mas prescrição nutricional na gestação é escopo de nutricionista

### Decisão de label

Manter **"Gestante e Pós-parto"** como label. Motivos:

- É o termo que o mercado brasileiro usa ("personal gestante e pós-parto")
- Cobre ambas as fases num template unificado (com branches)
- "Maternidade Ativa" foi considerado mas é aspiracional demais para o hub — a lead precisa se identificar imediatamente
- `specialty_code`: `gestante_pos_parto`

---

## 3 · Motores escolhidos

### Motores considerados e decisão

| Motor                     | Usado?         | Justificativa                                                                                            |
| ------------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| Motor 6 (Identidade/Fase) | ✅ Segmentação | A fase (trimestre vs pós-parto) muda TUDO: recomendações, riscos, métricas, tom                          |
| Motor 1 (Contexto Atual)  | ✅             | Histórico de exercício pré-gestação determina baseline e capacidade segura                               |
| Motor 4 (Comportamento)   | ✅             | Frequência atual REAL (não idealizada) calibra recomendações                                             |
| Motor 2 (Gargalo)         | ✅             | A preocupação principal direciona o foco do relatório                                                    |
| Motor 8 (Safety)          | ✅             | OBRIGATÓRIO — contraindicações absolutas podem ser letais                                                |
| Motor 5 (Ambiente)        | ❌             | Menos relevante — gestantes treinam onde o PT indica, não escolhem ambiente livre                        |
| Motor 7 (Métricas)        | ❌             | Gestantes não monitoram FC/pace com rigor. RPE e talk test bastam como conceito no relatório             |
| Motor 3 (Nível)           | ❌             | Absorvido pelo Motor 1 (histórico pré-gestação) — nível técnico é menos relevante que experiência prévia |

**Motores condicionais (pós-parto only):**

- Motor extra: tipo de parto (afeta timeline de retorno)
- Motor extra: sintomas pós-parto (diástase, assoalho pélvico — informa recuperação)

### Lista final: 5 motores base + 2 condicionais = 5-7 perguntas

1. **Segmentação (Motor 6)** → `phase` — Qual fase da jornada (trimestre ou pós-parto)
2. **Contexto Atual (Motor 1)** → `exercise_background` — Histórico de exercício antes da gestação
3. **Comportamento (Motor 4)** → `current_frequency` — Frequência de exercício na última semana
4. **Gargalo (Motor 2)** → `main_concern` — Maior preocupação ou barreira atual
5. **Safety (Motor 8)** → `health_conditions` — Triagem de contraindicações

Condicionais (pós-parto): 6. **Fase (Motor 6 ext.)** → `birth_type` — Via de parto (afeta timeline) 7. **Diagnóstico (Motor 8 adj.)** → `postpartum_symptoms` — Sintomas pós-parto relevantes

---

## 4 · Perguntas e opções

### Q1 · `phase` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Em que momento você está?"
**Helper:** "Isso define como seu relatório será personalizado"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`trimester_1`** — "1º trimestre (até 13 semanas)"
  - Safety trigger? não

- **`trimester_2`** — "2º trimestre (14-27 semanas)"
  - Safety trigger? não

- **`trimester_3`** — "3º trimestre (28-40 semanas)"
  - Safety trigger? não

- **`postpartum_early`** — "Pós-parto recente (até 6 meses)"
  - Safety trigger? não

- **`postpartum_late`** — "Pós-parto tardio (6-12 meses)"
  - Safety trigger? não

**Justificativa da pergunta:** A fase é o divisor #1 de toda a experiência. Exercício no 1T tem restrições diferentes do 3T, que é radicalmente diferente do pós-parto. Sem essa informação, nenhuma recomendação faz sentido. As 5 opções cobrem todo o espectro da jornada maternal (gestação + primeiro ano pós-parto). Pós-parto >12 meses sai do escopo (mulher retorna ao template geral de musculação).

**Justificativa das opções:** A divisão por trimestres é o padrão clínico universal (ACOG, FEBRASGO). A separação entre pós-parto recente e tardio captura a diferença entre fase de cicatrização (0-6m) e fase de reconstrução (6-12m). Cobrem ~100% dos casos no escopo.

---

### Q2 · `exercise_background` _(Motor 1 — Contexto Atual)_

**Type:** `single_choice`
**Label:** "Antes da gestação, como era sua rotina de exercícios?"
**Helper:** "Seu histórico nos ajuda a calibrar as recomendações"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`regular`** — "Treinava regularmente (3+ vezes por semana, há mais de 6 meses)"
  - Safety trigger? não

- **`occasional`** — "Fazia exercício de vez em quando (1-2 vezes por semana ou irregular)"
  - Safety trigger? não

- **`sedentary`** — "Não me exercitava regularmente"
  - Safety trigger? não

**Justificativa da pergunta:** O histórico pré-gestação é o melhor preditor de capacidade funcional atual e aderência futura. Determina a intensidade inicial segura, o vocabulário do relatório (pode usar "série", "carga" vs "caminhada", "movimento"), e o tom motivacional. Foi preferido a "nível de experiência" porque gestação não é sobre nível técnico — é sobre quanto o corpo já está adaptado ao exercício.

**Justificativa das opções:** 3 faixas capturam o espectro sem fragmentar demais. "Regular" vs "Ocasional" vs "Sedentária" é intuitivo e respondível em 3 segundos. Não incluí "atleta/competitiva" como opção separada porque: (1) é <2% do público, (2) atletas gestantes tipicamente já têm acompanhamento, (3) "regular" com as respostas de frequência atual captura a intensidade real.

---

### Q3 · `current_frequency` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label:** "Na última semana, quantas vezes você se exercitou?"
**Helper:** "Conte qualquer atividade: caminhada, musculação, yoga, natação..."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`none`** — "Nenhuma vez"
  - Safety trigger? não

- **`1_2x`** — "1-2 vezes"
  - Safety trigger? não

- **`3_4x`** — "3-4 vezes"
  - Safety trigger? não

- **`5_plus`** — "5 vezes ou mais"
  - Safety trigger? não

**Justificativa da pergunta:** Pergunta comportamental concreta sobre a ÚLTIMA SEMANA (não sobre intenção ou "rotina habitual"). Captura o comportamento real, não o idealizado. Gestantes tipicamente superestimam intenção e subestimam a queda de frequência ao longo dos trimestres. O dado recente é mais valioso que auto-relato de "quanto pretendo treinar".

**Justificativa das opções:** 4 faixas são padrão em questionários de frequência. O "helper" inclui exemplos variados (caminhada, yoga) para que a lead não pense que "exercício = academia" e subestime.

---

### Q4 · `main_concern` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label:** "Qual sua maior preocupação hoje?"
**Helper:** "Escolha a que mais pesa — seu relatório vai focar nela"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`safety_doubt`** — "Não sei o que é seguro fazer"
  - Safety trigger? não

- **`weight_management`** — "Controle de peso"
  - Safety trigger? não

- **`pain_discomfort`** — "Dores ou desconfortos físicos"
  - Safety trigger? não

- **`birth_prep`** — "Me preparar para o parto"
  - Safety trigger? não

- **`body_recovery`** — "Recuperar meu corpo e minha forma"
  - Safety trigger? não

- **`energy_mood`** — "Ter mais energia e disposição"
  - Safety trigger? não

**Justificativa da pergunta:** Essas 6 opções cobrem os diagnósticos reais do nicho. Cada uma direciona o arco narrativo do relatório para um foco diferente, maximizando a sensação de "feito pra mim". Descartei "melhorar autoestima" (vago, coberto por energy_mood e body_recovery) e "socializar" (irrelevante para o formato de relatório individual).

**Justificativa das opções:** Pesquisa de mercado e literatura indicam que insegurança (safety_doubt), peso (weight_management), dor (pain_discomfort), e preparação para o parto (birth_prep) são os 4 drivers principais de gestantes. Recuperação corporal (body_recovery) e energia (energy_mood) cobrem o pós-parto. As 6 opções atendem >90% dos casos. Nenhuma opção "outro" — se essas não cobrem, o campo `personal_note` (universal) serve.

---

### Q5 · `birth_type` _(Motor 6 ext. — Fase)_

**Type:** `single_choice`
**Label:** "Como foi seu parto?"
**Helper:** "Isso define o tempo de recuperação recomendado"
**Required:** sim
**Visibility:** `if phase == postpartum_early OR phase == postpartum_late`
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`vaginal_normal`** — "Parto vaginal sem complicações"
  - Safety trigger? não

- **`vaginal_complicated`** — "Parto vaginal com complicações (laceração, fórceps, episiotomia)"
  - Safety trigger? não

- **`cesarean`** — "Cesárea"
  - Safety trigger? não

**Justificativa da pergunta:** A via de parto é o determinante #1 da timeline de retorno ao exercício no pós-parto. Cesárea vs vaginal sem complicações vs vaginal com complicações tem diferenças de semanas no retorno seguro. Sem essa informação, a IA não consegue personalizar o relatório com timeline confiável.

**Justificativa das opções:** 3 opções cobrem 100% dos partos. Vaginal foi dividido em 2 porque a presença de laceração/fórceps muda significativamente a recuperação do assoalho pélvico. Não incluí "parto humanizado" ou "parto na água" como opções separadas — são variantes do vaginal que não mudam a timeline de exercício.

---

### Q6 · `postpartum_symptoms` _(Motor 8 adj. — diagnóstico pós-parto)_

**Type:** `multiple_choice`
**Label:** "Você percebe algum desses sintomas?"
**Helper:** "Marque todos que se aplicam — isso personaliza suas recomendações"
**Required:** sim
**Visibility:** `if phase == postpartum_early OR phase == postpartum_late`
**Segmentação:** não
**depthRequired:** standard
**maxSelections:** 4

**Opções:**

- **`diastasis`** — "Separação na barriga (diástase — sinto a barriga 'dividida' ou pontuda ao levantar)"
  - Safety trigger? não

- **`incontinence`** — "Escape de xixi ao tossir, espirrar ou fazer esforço"
  - Safety trigger? não

- **`pelvic_pain`** — "Dor ou sensação de peso na região pélvica"
  - Safety trigger? não

- **`back_pain`** — "Dor lombar persistente"
  - Safety trigger? não

- **`none_symptoms`** — "Nenhum desses"
  - Safety trigger? não

**Justificativa da pergunta:** Diástase e incontinência são os dois problemas pós-parto mais prevalentes e mais subdiagnosticados. Sem pergunta direta, a lead não menciona espontaneamente (vergonha, normalização). Multiple choice porque coexistem frequentemente (diástase + incontinência em até 66% dos casos). Informa tanto o relatório (orientações de exercício seguro) quanto o PT (flags de atenção para avaliação presencial).

**Justificativa das opções:** 4 sintomas + "nenhum" cobrem os problemas musculoesqueléticos e de assoalho pélvico mais comuns. Não incluí "depressão pós-parto" — é condição psiquiátrica que merece triage médica, não formulário de exercício.

---

### Q7 · `health_conditions` _(Motor 8 — Liberação/Risco)_

**Type:** `multiple_choice`
**Label:** "Você tem alguma dessas condições?"
**Helper:** "Marque todas que se aplicam. Isso garante que suas recomendações sejam seguras"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`placenta_previa`** — "Placenta prévia ou placenta baixa"
  - Safety trigger? **sim** (reason: "Contraindicação absoluta — ACOG/FEBRASGO. Risco de hemorragia materna.")

- **`pre_eclampsia`** — "Pré-eclâmpsia ou pressão alta na gestação"
  - Safety trigger? **sim** (reason: "Contraindicação absoluta — ACOG. Risco de eclâmpsia e HELLP.")

- **`vaginal_bleeding`** — "Sangramento vaginal no 2º ou 3º trimestre"
  - Safety trigger? **sim** (reason: "Contraindicação absoluta — ACOG. Risco de descolamento placentário.")

- **`preterm_risk`** — "Risco de parto prematuro ou cerclagem cervical"
  - Safety trigger? **sim** (reason: "Contraindicação absoluta — ACOG/FEBRASGO. Risco de parto prematuro.")

- **`cardiac_pulmonary`** — "Doença cardíaca ou pulmonar diagnosticada"
  - Safety trigger? **sim** (reason: "Contraindicação absoluta — ACOG. Risco de descompensação cardiopulmonar.")

- **`gestational_diabetes`** — "Diabetes gestacional"
  - Safety trigger? **não** (condição controlável com exercício)

- **`none_conditions`** — "Nenhuma dessas condições"
  - Safety trigger? não

**Justificativa da pergunta:** Triagem de segurança é OBRIGATÓRIA neste template. As contraindicações absolutas para exercício na gestação são bem definidas pela ACOG e FEBRASGO e podem ter consequências graves (hemorragia, parto prematuro, eclâmpsia). A pergunta é multiple_choice porque condições podem coexistir (diabetes gestacional + hipertensão). `depthRequired: quick` garante que SEMPRE aparece, mesmo em formulários rápidos.

**Justificativa das opções:** As 5 opções com safety trigger correspondem às contraindicações absolutas mais prevalentes listadas pelo ACOG Committee Opinion 804. Não incluí gestação múltipla (gêmeos) como opção separada porque: o risco de parto prematuro em gestação múltipla já está coberto por `preterm_risk`, e gestação gemelar sem risco de prematuridade não é contraindicação absoluta até 28 semanas. Diabetes gestacional foi incluída sem safety trigger porque exercício é PARTE do tratamento.

---

## 5 · Branches

### Branch: `Gestante` (trigger: `phase ∈ [trimester_1, trimester_2, trimester_3]`)

- **Tom geral:** Empoderamento + segurança. "Seu corpo é incrível — ele está criando uma vida e ainda consegue se mover." Confiança sem arrogância, ciência sem frieza.
- **pillarGuidance:**
  - Pilar 1 (Movimento): Foco em exercícios seguros por trimestre. 1T: manter rotina com ajustes de intensidade. 2T: janela ideal para fortalecimento. 3T: mobilidade, respiração, assoalho pélvico.
  - Pilar 2 (Corpo): Contextualizar mudanças corporais como adaptações geniais (não como "problemas"). Ganho de peso como investimento, não como perda.
  - Pilar 3 (Preparação): Parto como "evento atlético" que se treina. Resistência cardiovascular, assoalho pélvico, técnicas de respiração.
- **Additional questions:** nenhuma
- **Remove questions:** Q5 (birth_type), Q6 (postpartum_symptoms) — não se aplicam
- **Metrics override:** Mostrar zona de FC segura, faixa de ganho de peso gestacional, meta de hidratação gestacional
- **Narrative arc override:** validação → educação sobre a fase → desmistificação → recomendações concretas → preparação → CTA

**Justificativa:** A gestante tem necessidades fundamentalmente diferentes da puérpera. O arco narrativo é sobre PERMISSÃO e PREPARAÇÃO. As perguntas de pós-parto (birth_type, postpartum_symptoms) são irrelevantes e confusas. Sem esse branch, o relatório tentaria cobrir gestação e pós-parto ao mesmo tempo, diluindo ambos.

---

### Branch: `Pós-parto` (trigger: `phase ∈ [postpartum_early, postpartum_late]`)

- **Tom geral:** Paciência + progressão + validação. "Seu corpo fez algo extraordinário. A recuperação é uma jornada, não uma corrida." Evitar QUALQUER comparação com "corpo de antes".
- **pillarGuidance:**
  - Pilar 1 (Movimento): Retorno progressivo respeitando timeline do parto. Priorizar core profundo e assoalho pélvico antes de carga/impacto.
  - Pilar 2 (Corpo): Recuperação como processo de meses. Diástase e assoalho pélvico como prioridades funcionais, não estéticas.
  - Pilar 3 (Reconstrução): Rebuilding de força funcional para a nova vida (carregar bebê, amamentar, dormir melhor). Fitness como ferramenta de saúde mental pós-parto.
- **Additional questions:** Q5 (birth_type), Q6 (postpartum_symptoms)
- **Remove questions:** nenhuma
- **Metrics override:** Mostrar timeline de retorno por tipo de parto, flags de atenção (diástase/incontinência), meta de hidratação com amamentação
- **Narrative arc override:** validação do esforço → contextualização da recuperação → sintomas como dados (não defeitos) → recomendações progressivas → marcos funcionais → CTA

**Justificativa:** O pós-parto adiciona 2 perguntas exclusivas (via de parto + sintomas) que são irrelevantes para gestantes. O tom muda de "preparação" para "recuperação". Os marcos mudam de "preparar para o parto" para "voltar a funcionar no novo corpo". Sem esse branch, uma puérpera com diástase e cesárea receberia relatório genérico de gestante.

---

## 6 · Safety triggers

| Questão             | Opções              | Reason (clínico)                                                        | Efeito no relatório                                                                            |
| ------------------- | ------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `health_conditions` | `placenta_previa`   | Contraindicação absoluta (ACOG). Risco de hemorragia materna grave      | Macros omitidas, timeline omitida, SafetyNote aparece, IA instruída a não prescrever exercício |
| `health_conditions` | `pre_eclampsia`     | Contraindicação absoluta (ACOG). Risco de eclâmpsia e síndrome HELLP    | Idem                                                                                           |
| `health_conditions` | `vaginal_bleeding`  | Contraindicação absoluta (ACOG). Risco de descolamento placentário      | Idem                                                                                           |
| `health_conditions` | `preterm_risk`      | Contraindicação absoluta (ACOG/FEBRASGO). Risco de parto prematuro      | Idem                                                                                           |
| `health_conditions` | `cardiac_pulmonary` | Contraindicação absoluta (ACOG). Risco de descompensação cardiopulmonar | Idem                                                                                           |

**Nota:** `gestational_diabetes` NÃO é safety trigger. Exercício é parte do tratamento e melhora controle glicêmico. Apenas ajusta o tom e adiciona orientações de monitoramento.

**safetyTemplate:**

- **Title:** "Atenção especial à sua saúde"
- **Body:** "Identificamos que sua situação atual requer acompanhamento médico antes de iniciar ou continuar qualquer programa de exercícios. Isso não significa que você nunca poderá se exercitar — muitas dessas condições são temporárias ou manejáveis. Mas o caminho mais seguro para você e seu bebê passa por uma avaliação presencial com seu obstetra. Converse com [profissional_nome] sobre os próximos passos: com a liberação médica em mãos, vocês podem traçar um plano seguro e personalizado juntas."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `hydration_target`

- **O que é:** Meta diária de água em litros, ajustada para gestação/amamentação
- **Por que aparece para o aluno:** Concreto, acionável, fácil de seguir no dia a dia. Gestantes precisam de 2,3-3L/dia, lactantes de 3-3,8L/dia
- **Cálculo:** Peso × 35ml/kg (base) + 500ml (gestação) ou + 700ml (amamentação). Fonte: IOM Dietary Reference Intakes for Water (2004), ajustado por ACOG recommendations
- **Visualização proposta:** Card numérico com ícone de copo de água + comparação com baseline ("você precisa de +500ml do que antes da gestação"). Simples, direto
- **Placeholder:** `[meta_agua_litros]`

### 7.2 · `safe_activity_minutes`

- **O que é:** Meta semanal de atividade física em minutos
- **Por que aparece para o aluno:** Traduz as diretrizes clínicas em um número acionável. "150 minutos por semana" é concreto
- **Cálculo:** 150 min/semana (ACOG/FEBRASGO) para gestantes saudáveis. Ajustado: se sedentária, começar com 60 min/semana e progredir em 4 semanas. Se pós-parto recente, começar com 90 min/semana após liberação
- **Visualização proposta:** Gauge radial com faixas (abaixo/dentro/acima da meta). Valor central = meta. Cor verde na faixa recomendada
- **Placeholder:** `[meta_minutos_semana]`

### 7.3 · `weight_gain_context` (gestante only)

- **O que é:** Faixa de ganho de peso gestacional esperado baseada no IMC pré-gestacional
- **Por que aparece para o aluno:** Contextualiza o ganho como NORMAL e saudável. Remove culpa e ansiedade. Dá faixa concreta
- **Cálculo:** Diretrizes IOM (2009) — IMC <18.5: 12,5-18kg; IMC 18.5-24.9: 11,5-16kg; IMC 25-29.9: 7-11,5kg; IMC ≥30: 5-9kg. Referência: IOM "Weight Gain During Pregnancy: Reexamining the Guidelines"
- **Visualização proposta:** Card com faixa colorida (verde = dentro do esperado), mostrando "ganho esperado total" e "ganho por semana nesta fase". NÃO mostrar como gauge (evita sensação de "peso errado")
- **Placeholder:** `[ganho_esperado_total]`, `[ganho_por_semana]`

### 7.4 · `recovery_timeline` (pós-parto only)

- **O que é:** Timeline personalizada de retorno ao exercício baseada em via de parto e fase atual
- **Por que aparece para o aluno:** Dá horizonte temporal concreto. "Em X semanas, você pode Y" — gera expectativa realista e motivação
- **Cálculo:** Baseado em via de parto: vaginal normal → atividade leve em 4 semanas, moderada em 6, intensa em 12-16. Cesárea → leve em 6, moderada em 8-12, intensa em 16-24. Fonte: SBC/DERC 2021, ACOG
- **Visualização proposta:** Timeline horizontal com marcos (ícones de atividade crescente). Destaque visual no "você está aqui" baseado em semanas pós-parto
- **Placeholder:** `[semanas_para_moderado]`, `[semanas_para_intenso]`

### 7.5 · `exercise_intensity_guide`

- **O que é:** Nível de intensidade recomendado com base em RPE e talk test
- **Por que aparece para o aluno:** Substitui o mito dos "140 bpm" com orientação prática e confiável. "Se consegue conversar, a intensidade está boa"
- **Cálculo:** RPE alvo 12-14 (escala de Borg 6-20). Talk test como validação prática. FC alvo por idade como referência secundária (Canadian guidelines: <20 anos: 140-155; 20-29: 135-150; 30-39: 130-145; 40+: 125-140)
- **Visualização proposta:** Zone table com 3 faixas (leve/moderada/intensa) + descrições práticas ("conversa normal" / "conversa com pausas" / "não consegue conversar"). Faixa verde em "moderada"
- **Placeholder:** `[fc_alvo_min]`, `[fc_alvo_max]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `risk_classification`

- **O que é:** Classificação de risco gestacional baseada nas condições reportadas
- **Por que importa para o PT:** Priorização imediata: lead com safety trigger precisa de liberação médica antes de qualquer prescrição. Lead sem risco pode começar imediatamente
- **Cálculo:** Safety triggered → alto risco (vermelho). Diabetes gestacional → atenção (amarelo). Nenhuma condição → liberada (verde)
- **Visualização proposta:** Semáforo (badge colorido) no card do lead. Verde/amarelo/vermelho. Clicável para ver detalhes

### 8.2 · `readiness_score`

- **O que é:** Score 0-100 de prontidão para exercício, ponderando fase + histórico + frequência + condições
- **Por que importa para o PT:** Ajuda a priorizar leads e calibrar primeira sessão. Score alto = lead pronta para treinar. Score baixo = precisa de mais conversa/avaliação
- **Cálculo:** Composição ponderada — histórico regular (+30), frequência 3-4x (+25), sem condições (+25), 2T (+20, fase ideal) / 1T (+10) / 3T (+5) / pós-parto recente (-5) / pós-parto tardio (+15). Normalizar para 0-100
- **Visualização proposta:** Gauge radial no card do lead, com score numérico e label (Baixa/Moderada/Alta prontidão)

### 8.3 · `postpartum_flags`

- **O que é:** Lista de flags de atenção pós-parto (diástase, incontinência, dor pélvica, lombalgia)
- **Por que importa para o PT:** Checklist imediata para a avaliação presencial. Se marcou diástase → fazer teste de dedos na primeira sessão. Se incontinência → encaminhar para fisioterapeuta pélvica
- **Cálculo:** Direto das respostas de Q6 (postpartum_symptoms)
- **Visualização proposta:** Scorecard com semáforo por sintoma. Presente = amarelo. Ausente = verde. Safety = vermelho

### 8.4 · `adherence_prediction`

- **O que é:** Previsão de adesão baseada em histórico + frequência atual
- **Por que importa para o PT:** Leads com alta predição de adesão são mais fáceis de converter e reter. Leads com baixa predição precisam de estratégia diferenciada (sessões mais curtas, check-ins semanais, meta de processo não de resultado)
- **Cálculo:** Heurística: sedentária + 0 sessões/semana = baixa. Regular + 3-4x = alta. Cruzamento de exercise_background × current_frequency
- **Visualização proposta:** Badge textual (Baixa/Moderada/Alta) no card do lead

### 8.5 · `bmi_classification`

- **O que é:** Classificação de IMC pré-gestacional (estimado ou reportado)
- **Por que importa para o PT:** Define faixa de ganho de peso esperado (IOM), intensidade inicial, e atenção a comorbidades (IMC ≥30 aumenta risco de diabetes gestacional e pré-eclâmpsia)
- **Cálculo:** IMC padrão (peso/altura²). Para gestante, idealmente usar peso pré-gestacional — se não disponível, usar peso atual com ajuste por trimestre (IOM ganho médio por semana)
- **Visualização proposta:** Badge com faixa (baixo peso / normal / sobrepeso / obesidade). NÃO mostrar ao aluno com essa classificação — dashboard only

---

## 9 · Pilares do relatório

### Pilar 1 · Movimento Seguro

- **Subtitle:** "O que você pode (e deve) fazer agora"
- **Conceito central:** Exercício na gestação e no pós-parto é seguro, recomendado, e traz benefícios comprovados. O medo de se mover é mais perigoso que o movimento orientado. Cada fase tem exercícios ideais — e o profissional sabe quais são.
- **Evidência científica:** ACOG Committee Opinion 804 (2020): "Physical activity in pregnancy has minimal risks and has been shown to benefit most women." FEBRASGO: exercício regular reduz risco de pré-eclâmpsia, diabetes gestacional, depressão, e melhora desfechos do parto.
- **Placeholders esperados:** `[meta_minutos_semana]`, `[frequencia_recomendada]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Seu corpo foi feito pra se mover — inclusive agora. Na fase em que você está, [meta_minutos_semana] minutos de atividade por semana trazem benefícios reais: mais energia, menos dores, melhor sono e um corpo mais preparado pro que vem pela frente. Não precisa ser nada intenso — o importante é consistência. Com [profissional_nome], você vai saber exatamente o que fazer em cada sessão."
- **Exemplo de texto técnico (35 palavras):** "Recomendação: [meta_minutos_semana] min/semana de atividade moderada (RPE 12-14), priorizando fortalecimento de core profundo, glúteos e assoalho pélvico. Intensidade validada por talk test. Progressão individualizada conforme tolerância e fase gestacional/puerperal."

### Pilar 2 · Corpo em Transformação

- **Subtitle:** "Entendendo o que está acontecendo com você"
- **Conceito central:** As mudanças corporais (ganho de peso, alterações posturais, frouxidão ligamentar, diástase, recuperação pós-parto) são adaptações fisiológicas, não "problemas". Entender o que acontece reduz ansiedade e permite decisões melhores.
- **Evidência científica:** IOM (2009) — faixas de ganho de peso gestacional por IMC. Estudos de prevalência de diástase (30-70%) e incontinência (até 69% na gestação). SBC/DERC — efeitos da relaxina na estabilidade articular.
- **Placeholders esperados:** `[ganho_esperado_total]`, `[meta_agua_litros]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "Seu corpo está fazendo algo extraordinário. O ganho de peso que você percebe é o investimento que ele está fazendo — bebê, placenta, líquido amniótico, sangue extra, reservas de energia. A faixa esperada pra você é de [ganho_esperado_total] kg ao longo da gestação. Cada corpo tem seu ritmo. Mantenha hidratação em [meta_agua_litros] litros por dia e confie no processo. [profissional_nome] acompanha com você."
- **Exemplo de texto técnico (35 palavras):** "Ganho ponderal esperado: [ganho_esperado_total] kg (referência IOM por BMI pré-gestacional). Hidratação: [meta_agua_litros] L/dia. Monitorar sinais de overreaching: fadiga persistente, edema desproporcional, dor articular nova. Manter diário simplificado de sintomas."

### Pilar 3 · Preparação e Recuperação

- **Subtitle (gestante):** "Seu treino para o grande dia"
- **Subtitle (pós-parto):** "Reconstruindo de dentro para fora"
- **Conceito central:** Para gestante: o parto é um evento físico que se prepara — resistência cardiovascular, assoalho pélvico e respiração são treináveis. Para pós-parto: a recuperação é progressiva e tem marcos — cada semana é um passo, não uma corrida contra o tempo.
- **Evidência científica:** Meta-análise Cochrane — exercício na gestação reduz duração do trabalho de parto e taxa de cesárea de emergência. Exercícios de assoalho pélvico reduzem risco de incontinência pós-parto em 37% e prolapso em 56%.
- **Placeholders esperados:** `[profissional_nome]`, `[semanas_para_moderado]` (pós-parto), `[frequencia_recomendada]`
- **Exemplo de texto popular (gestante, 70 palavras):** "O parto é o evento mais atlético da sua vida — e você pode treinar pra ele. Exercícios de assoalho pélvico fortalecem os músculos que vão trabalhar na hora do expulsivo. Técnicas de respiração ajudam no controle da dor. E a resistência cardiovascular que você constrói agora faz diferença real na sua recuperação depois. [profissional_nome] vai montar essa preparação com você."
- **Exemplo de texto popular (pós-parto, 70 palavras):** "Recuperação não é 'voltar ao corpo de antes' — é construir o corpo que funciona agora. Carregar seu bebê sem dor, subir escada sem ofegar, dormir melhor quando conseguir dormir. Em [semanas_para_moderado] semanas, você pode avançar para exercício moderado. Cada marco é uma conquista real. [profissional_nome] vai caminhar com você nesse ritmo, sem pressa e sem pressão."
- **Exemplo de texto técnico (35 palavras):** "Gestante: priorizar resistência aeróbica, fortalecimento de assoalho pélvico (Kegel), e respiração diafragmática. Pós-parto: progressão por marcos — core profundo (semana 4-6), carga submáxima (semana 8-12), impacto controlado (semana 16+)."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Template para gestantes (1º ao 3º trimestre) e puérperas (até 12 meses pós-parto) que buscam orientação de exercício seguro. O público é predominantemente feminino, 28-40 anos, classe B/C+, urbana, que busca segurança e validação profissional para se exercitar durante a maternidade."

- **narrativeArc:**
  1. Validação: reconhecer a coragem de buscar movimento nessa fase
  2. Contextualização da fase: explicar o que está acontecendo no corpo AGORA (trimestre-específico ou pós-parto-específico)
  3. Desmistificação: abordar o medo/preocupação principal com evidência acessível
  4. Diagnóstico do gargalo: conectar a preocupação da lead com a solução via exercício
  5. Recomendações concretas via pilares: números, frequências, tipos de exercício
  6. Projeção: o que esperar nas próximas semanas/meses seguindo as orientações
  7. CTA: o profissional como parceiro da jornada — marcar conversa via WhatsApp

- **terminology:** trimestre, gestação, pós-parto, puerpério, assoalho pélvico, core profundo, diástase, Kegel, fortalecimento, mobilidade, intensidade moderada, talk test, esforço percebido, ganho de peso gestacional, liberação médica, hidratação, amamentação, recuperação, progressão

- **forbiddenTerms:**
  - "emagrecer" / "emagrecimento" (na gestação, ganho é esperado — NUNCA usar)
  - "secar" / "definir" (linguagem de cutting inadequada para gestante/puérpera)
  - "queimar gordura" / "queimar calorias" (foco é saúde, não estética agressiva)
  - "dieta" (prescrição nutricional não é escopo — e o termo é gatilho)
  - "140 bpm" como limite (desatualizado desde 1994 — ACOG abandonou)
  - "abdominais" sem qualificação (gestante/puérpera com diástase não faz crunch/sit-up)
  - "corpo de antes" / "voltar ao normal" (implica que o corpo atual é anormal)
  - "barriga de mãe" em tom negativo (naturalizar ≠ depreciar)
  - "exercício leve" como única opção (paternalista — gestante saudável pode fazer moderado)
  - "cuidado" / "tome cuidado" repetidamente (gera mais medo, não mais segurança)
  - "pra ontem" / "resultado rápido" / "em X dias" (pressão temporal é tóxica nesse nicho)
  - "esforço máximo" / "dar tudo" (inapropriado para gestante)

- **recommendedTone:** "Acolhedor, cientificamente embasado, empoderador. Fale como uma profissional que é mãe e personal trainer — entende a ciência E a experiência vivida. Evite tanto o tom médico frio ('contraindicado em pacientes com...') quanto o motivacional vazio ('você é incrível!'). O tom ideal é: 'seu corpo está fazendo algo extraordinário, e existem formas seguras e eficazes de se mover agora — vou te mostrar quais'."

- **pillarGuidance:**
  1. Pilar 1 (Movimento Seguro): "Foque no que a lead PODE fazer, não no que não pode. Liste tipos de exercício recomendados para a fase (trimestre/pós-parto), frequência e intensidade. Use RPE e talk test como referência. Cite [meta_minutos_semana] e [frequencia_recomendada]."
  2. Pilar 2 (Corpo em Transformação): "Normalize as mudanças. Use [ganho_esperado_total] para contextualizar peso. Mencione hidratação ([meta_agua_litros]). Se pós-parto, aborde sintomas reportados (diástase, incontinência) com tom de solução, não de problema."
  3. Pilar 3 (Preparação/Recuperação): "Gestante: parto como evento treinável, assoalho pélvico como protagonista. Pós-parto: marcos progressivos, funcionalidade antes de estética. Use [semanas_para_moderado] se pós-parto. Sempre fechar direcionando ao [profissional_nome]."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `lightly_active` — Justificativa: a maioria das gestantes e puérperas que preenchem o formulário não está sedentária (o ato de buscar um personal já indica disposição), mas está abaixo do nível "moderadamente ativa". Sedentária subestimaria quem caminha diariamente; moderadamente ativa superestimaria a média.

- **activityMapping:**
  - Pergunta: `current_frequency`
  - Mapping:
    - `none` → `sedentary`
    - `1_2x` → `lightly_active`
    - `3_4x` → `moderately_active`
    - `5_plus` → `very_active`

- **requiresTargetWeight:** `false` — Justificativa: meta de peso é inapropriada na gestação (ganho é esperado) e potencialmente prejudicial no pós-parto recente (pressão por perda rápida). O relatório usa `weight_gain_context` (gestante) e marcos funcionais (pós-parto) em vez de "peso alvo".

---

## 12 · Notas de design (decisões não-óbvias)

### Por que `requiresTargetWeight: false`

Diferente de templates de emagrecimento/estética, pedir "peso alvo" a uma gestante é clinicamente errado (ela vai GANHAR peso) e emocionalmente nocivo para uma puérpera (pressão por perda rápida = gatilho para distúrbios alimentares pós-parto). O campo universal de goal/targetWeight é desativado. A projeção vem das faixas IOM (gestante) ou de marcos funcionais (pós-parto).

### Por que não incluí "atleta gestante" como segmentação

Mulheres que competiam/treinavam alto rendimento antes da gestação são <2% do público. Incluir uma opção dedicada inflaria o template para atender um edge case. A combinação `exercise_background: regular` + `current_frequency: 5_plus` já captura esse perfil, e a IA pode ajustar tom/intensidade com base nos dados.

### Por que Q6 (postpartum_symptoms) é multiple_choice e não single

Diástase, incontinência, dor pélvica e lombalgia coexistem com frequência alta (até 66% das mulheres com diástase também têm disfunção de assoalho pélvico). Single choice obrigaria a lead a priorizar, perdendo dados clinicamente relevantes. maxSelections: 4 previne seleção irrealista.

### Por que não incluí "depressão pós-parto" nos sintomas

Depressão pós-parto é condição psiquiátrica que requer triagem por instrumento validado (Edinburgh Postnatal Depression Scale), não por checkbox num formulário de exercício. Incluí-la trivializaria o diagnóstico e colocaria o PT numa posição de triagem para a qual não é qualificado. Exercício ajuda na prevenção e no tratamento adjuvante, mas a lead com depressão precisa de psiquiatra/psicólogo primeiro. O campo `personal_note` (texto livre universal) captura se a lead quiser mencionar saúde mental espontaneamente.

### Por que diabetes gestacional NÃO é safety trigger

Exercício é parte do tratamento da diabetes gestacional (melhora controle glicêmico, reduz necessidade de insulina). Bloquear o relatório para essa condição seria contraproducente. A opção existe para que o relatório ADAPTE as recomendações (monitorar glicemia, não treinar em jejum), não para bloqueá-las.

### Por que manter label "Gestante e Pós-parto" em vez de 2 templates separados

Considerei separar em "Gestante" e "Pós-parto" como templates independentes. Decisão: manter unificado porque (1) o mesmo PT atende ambos os públicos, (2) o branch system já diferencia, (3) templates separados dobrariam manutenção sem ganho substantivo para o lead — ela se identifica com a fase na Q1, não no hub.

### Por que o limite de 140 bpm é tratado como forbiddenTerm

O ACOG abandonou essa recomendação em 1994. Usar como referência num produto de 2026 demonstra desatualização e pode levar gestantes a subestimarem a intensidade segura (muitas estão abaixo de 140 bpm mesmo sedentárias, devido ao aumento do volume plasmático). O RPE e talk test são os métodos recomendados. O FC range aparece como referência SECUNDÁRIA no relatório, baseado nas Canadian guidelines por faixa etária.

---

## 13 · Pendências

### Validação clínica (🚨 BLOQUEANTE)

- [ ] **Revisão por obstetra** — todas as contraindicações absolutas e safety triggers precisam de validação por obstetra antes de ir a produção. Risco legal se um safety trigger faltar
- [ ] **Revisão por educador físico com formação em gestante** — exercícios recomendados por fase, timeline de retorno pós-parto, intensidades propostas
- [ ] **Revisão por fisioterapeuta pélvica** — abordagem de diástase e incontinência no relatório (não ultrapassar escopo do PT)

### Cálculos pendentes

- [ ] Ganho de peso por semana gestacional (precisa de semana exata, não apenas trimestre — possível pedir "quantas semanas?" como subpergunta condicional, mas adiciona fricção)
- [ ] Score de readiness (fórmula proposta é heurística, não validada — precisa de ajuste com profissionais)
- [ ] Ajuste de IMC para peso gestacional (peso atual ≠ peso pré-gestacional — precisamos de lógica para estimar)

### Decisões pendentes

- [ ] Incluir pergunta sobre amamentação para pós-parto? Afeta hidratação e disponibilidade de tempo, mas adiciona mais uma pergunta (já estamos em 7 para pós-parto)
- [ ] Incluir "semana gestacional" como input numérico? Daria granularidade para cálculos de ganho de peso semanal, mas pode ser respondido imprecisamente e adiciona fricção
- [ ] Limitar opções de health_conditions para pós-parto? Placenta prévia e sangramento vaginal gestacional não se aplicam a puérperas, mas filtrar por fase adiciona complexidade ao template

### Casos de borda não cobertos

- Gestação de gêmeos/triplos (restrições adicionais após 28 semanas, não totalmente coberto — parcialmente via `preterm_risk`)
- Gestante adolescente (<18 anos) — perfil diferente, possivelmente necessita adaptação de linguagem
- Pós-parto com complicações graves (hemorragia pós-parto, eclâmpsia puerperal) — saem do escopo do PT
- Mulher em processo de fertilização in vitro (ansiedade extrema, possível repouso prescrito) — coberto parcialmente por safety triggers

---

## 14 · Fontes citadas

1. **ACOG Committee Opinion 804** (2020). Physical Activity and Exercise During Pregnancy and the Postpartum Period. American College of Obstetricians and Gynecologists.
2. **FEBRASGO** — Recomendações para a prática de exercício físico na gravidez: uma revisão crítica da literatura. Revista Brasileira de Ginecologia e Obstetrícia.
3. **SBC/DERC** (2021). Posicionamento sobre exercícios físicos na gestação e no pós-parto. Arquivos Brasileiros de Cardiologia.
4. **IOM/National Academies** (2009). Weight Gain During Pregnancy: Reexamining the Guidelines. Institute of Medicine.
5. **Mottola MF et al.** (2018). 2019 Canadian Guideline for Physical Activity throughout Pregnancy. British Journal of Sports Medicine, 52(21), 1339-1346.
6. **Davenport MH et al.** (2018). Exercise for the prevention and treatment of low back, pelvic girdle and lumbopelvic pain during pregnancy. British Journal of Sports Medicine, 52(21), 1339-1346.
7. **Woodley SJ et al.** (2020). Pelvic floor muscle training for preventing and treating urinary and faecal incontinence in antenatal and postnatal women. Cochrane Database of Systematic Reviews.
8. **Benjamin DR et al.** (2014). Effects of exercise on diastasis of the rectus abdominis muscle in the antenatal and postnatal periods: a systematic review. Physiotherapy, 100(1), 1-8.
9. **Nascimentos 2024** — IBGE, Estatísticas do Registro Civil 2024. Agência Brasil.
10. **Prevalência de atividade física em gestantes brasileiras** — PLoS ONE (2015), SciELO/RBSMI (2015), RECIMA21 (2022).
11. **Gizele Monteiro** — Programa "Gravidez em Forma" e "Mães sem Diástase". Referência de mercado brasileiro para personal gestante. gizelemonteiro.com.br.
12. **SBMEE** — Posicionamento oficial sobre atividade física e saúde da mulher. Revista Brasileira de Medicina do Esporte.

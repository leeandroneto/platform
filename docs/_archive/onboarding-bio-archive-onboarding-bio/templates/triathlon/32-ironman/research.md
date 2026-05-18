# Research · Especialidade 32 · Ironman (140.6)

## 0 · Metadados

- **Número:** 32
- **Modality:** triathlon
- **Pasta:** `triathlon/32-ironman/`
- **Plano:** pro
- **Validação clínica:** 🚨 Bloqueante (cardiologista esportivo + médico do esporte). Justificativa: incidência de morte súbita em triathlon é 1,74/100.000 — maior que maratona. Homens 60+ chegam a 18,6/100.000. 67% dos eventos cardíacos acontecem no nado.
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. Harris KM et al. "Death and Cardiac Arrest in U.S. Triathlon Participants, 1985-2016." Annals of Internal Medicine, 2017;167(8)
  2. Jeukendrup A. "Training the Gut for Athletes." Sports Medicine, 2017 (GSSI SSE #178)
  3. "Sociodemographic, Socioeconomic and Motivational Profile of Brazilian Triathletes" — Rev. Bras. Med. Esporte (SciELO)
  4. "A Systematic Review of Long-Distance Triathlon Musculoskeletal Injuries" — PMC, 2022
  5. Johnson EC et al. "Exercise-associated hyponatremia among IRONMAN triathletes." Scand J Med Sci Sports, 2023
  6. Neubauer O et al. "Recovery after an Ironman triathlon: sustained inflammatory responses." PubMed, 2008
  7. Weber S. "VLaMax Model" — Scientific Triathlon Podcast #169
  8. TrainingPeaks — "A Coach's Guide to ATL, CTL & TSB"

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 30-49 anos (age-group mais populoso: 35-44). Atletas de 18 a 73 anos registrados.
- **Gênero:** ~80% masculino, ~20% feminino (dados Ironman Brasil Florianópolis 2025).
- **Classe socioeconômica:** 88,6% classe A (SciELO). Profissões mais comuns: educadores físicos (17,8%), empresários (8,5%), militares (6,8%). Investem R$100-R$1.000/mês em participação, equipamento e coaching — até 17% da renda mensal.
- **Mercado:** nicho pequeno-médio. ~25.000 triatletas ativos no Brasil (CBTri), ~2.000 inscritos no Ironman Brasil 2025. Crescimento consistente: de 250 (2000) para 2.000 (2025).

### Onde estão online

- **Instagram** é o epicentro: seguem assessorias esportivas (@bora.assessoria, @runfunbr, @bresportesassessoria, @ironmindassessoriaesportiva) e perfis de atletas.
- **Strava** é rede social de treino — compartilham cada sessão, competem em segmentos.
- **TrainingPeaks** para planilhas estruturadas (padrão ouro das assessorias brasileiras).
- **Garmin Connect** sincronizado com relógio (Garmin domina o mercado tri brasileiro).
- **Grupos WhatsApp** de assessorias e equipes de treino.

### Linguagem

- **Termos de identidade:** "longão" (sessão longa), "brick" (bike→run combinado), "tiro" (intervalo intenso), "planilha" (plano de treino), "T1/T2" (transição), "pace" (ritmo/km), "zona" (Z1-Z5), "bloco" (ciclo de treino), "base/construção/específico/polimento" (fases da periodização), "assessoria" (coaching agency — modelo dominante no Brasil).
- **Termos aspiracionais:** "cruzar a linha", "you are an Ironman", "quebrar o sub-12" (sub-12 horas), "ir pra Kona" (mundial do Havaí), "finisher".
- **Orgulho do sofrimento:** esse público se identifica com a dor, a dedicação, o sacrifício. "Cada metro é conquistado." Não querem ser tratados como amadores frágeis.

### O que ofende ou afasta

- Formulário genérico que não entende a complexidade do esporte (3 modalidades + nutrição + transição).
- Tratamento como "corredor que também nada e pedala" — triatletas são triatletas.
- Promessas vazias ("complete seu Ironman fácil!") — sabem que não é fácil, e é por isso que fazem.
- Tom condescendente ou que subestime o conhecimento técnico deles — muitos já treinam há anos com assessoria.
- Perguntas que ignoram que eles já investem pesado em coach/planilha — o valor aqui é o diagnóstico diferenciado, não o óbvio.

### Dor mais comum

A dor central é o **medo de não completar** — por lesão, por falha nutricional na prova, por overtraining, por não conseguir conciliar treino de 15-20h/semana com trabalho e família. A segunda dor é o **platô de performance**: já treina muito, mas não melhora — precisa identificar o gargalo real (nadar? pedalar? correr? nutrição? recuperação?).

## 2 · Decisão de escopo

### Este template cobre:

- Atletas que estão se preparando para (ou já completaram) um Ironman full distance (3,8km swim + 180km bike + 42,2km run)
- Age-groupers de todos os níveis: primeiro Ironman até veteranos buscando qualificação para Kona/Nice
- Atletas que treinam com ou sem assessoria esportiva

### Este template NÃO cobre:

- Meio Ironman (70.3) → template #31
- Sprint/Olímpico → template #30
- Atletas profissionais com equipe médica dedicada (use Custom)
- Atletas em reabilitação pós-lesão grave → encaminhar para template #15 ou profissional de fisioterapia
- Adolescentes (<18 anos) — raríssimos em full distance

### Nota sobre o label

Mantenho **"Ironman (140.6)"** como label. "Ironman" é marca registrada da World Triathlon Corporation, mas o público usa esse termo universalmente. No hub, o aluno procura "Ironman", não "triathlon long distance". O `specialty_code` será `ironman_full_distance`.

## 3 · Motores escolhidos

### Raciocínio

O atleta de Ironman é técnico, informado e já investe em treino. O formulário precisa capturar informação que um coach de assessoria **não teria num primeiro contato via Instagram** — o diferencial é a avaliação estruturada.

**Motores considerados e decisão:**

| Motor                   | Decisão                       | Justificativa                                                                                                                   |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Motor 6 (Fase)          | ✅ **Segmentação**            | O estágio do atleta (primeiro IM vs. veterano vs. retorno) muda TUDO: tom, métricas, perguntas.                                 |
| Motor 2 (Gargalo)       | ✅ **Obrigatório**            | O gargalo no Ironman é multifacetado (modalidade fraca, nutrição, recuperação, tempo). Identificá-lo é o valor central.         |
| Motor 4 (Comportamento) | ✅ **Incluído**               | Volume de treino real vs. planejado é a variável que mais prediz burnout e lesão. Comportamento recente, não intenção.          |
| Motor 7 (Métricas)      | ✅ **Incluído (condicional)** | Se usa relógio/potencímetro, podemos calibrar zonas. Se não usa, relatório adapta. Pergunta binária + sub-pergunta condicional. |
| Motor 8 (Safety)        | ✅ **Obrigatório**            | Validação clínica bloqueante. Morte súbita 1,74/100k. ECG é requisito World Triathlon para elites.                              |
| Motor 1 (Contexto)      | ❌ Descartado                 | Capturado implicitamente pela segmentação (Motor 6) e pelo comportamento (Motor 4). Pergunta separada seria redundante.         |
| Motor 3 (Nível)         | ❌ Descartado                 | Fundido com Motor 6 (fase). "Primeiro IM" = iniciante, "busca Kona" = avançado. Não precisa de escala numérica separada.        |
| Motor 5 (Ambiente)      | ❌ Descartado                 | Ironman exige piscina + bike + corrida obrigatoriamente. O "onde" é menos relevante que "quanto" e "como".                      |

### Lista final (5 motores, 6 perguntas):

1. **Segmentação (Motor 6)** → `athlete_stage` — Em qual momento da jornada Ironman esse atleta está
2. **Gargalo (Motor 2)** → `main_bottleneck` — O que mais trava o resultado dele
3. **Comportamento (Motor 4)** → `weekly_training_hours` — Volume real de treino semanal (número, não autoimagem)
4. **Métricas (Motor 7)** → `uses_metrics` + `metric_data` — Se monitora dados e quais (FTP, pace, FC)
5. **Safety (Motor 8)** → `health_screening` — Triagem cardíaca e condições de risco

## 4 · Perguntas e opções

### Q1 · `athlete_stage` _(Motor 6 — Fase/Identidade)_

**Type:** `single_choice`
**Label:** "Onde você está na sua jornada Ironman?"
**Helper:** "Escolha o que mais representa seu momento atual."
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** `quick`

**Opções:**

- **`first_ironman`** — "Vou fazer meu primeiro Ironman"
  - Safety trigger? não

- **`experienced`** — "Já completei e quero melhorar meu tempo"
  - Safety trigger? não

- **`comeback`** — "Estou voltando após pausa ou lesão"
  - Safety trigger? não

**Justificativa da pergunta:** O estágio define completamente o tom do relatório. Um primeiro-timer precisa de acolhimento e fundamentos; um experiente quer análise técnica e otimização; um retorno precisa de cautela e reconstrução. Descartei "atleta profissional" como opção porque o template é para age-groupers.

**Justificativa das opções:** Cobrem os 3 cenários reais do funil: entrada (primeiro IM), evolução (melhorar), e retorno (pausa/lesão). "Busca Kona" foi considerado como 4ª opção, mas na prática é um sub-set de "experienced" — não justifica branch próprio (mesmas perguntas, mesmo arco, só muda meta).

---

### Q2 · `main_bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label:** "O que mais te trava hoje na preparação?"
**Helper:** "Se mais de um se aplica, escolha o principal."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`weak_swim`** — "Nado é meu ponto fraco"
  - Safety trigger? não

- **`nutrition_failures`** — "Nutrição de prova me prejudica"
  - Safety trigger? não

- **`time_management`** — "Conciliar treino com vida pessoal"
  - Safety trigger? não

- **`recurring_injury`** — "Lesões que não param de voltar"
  - Safety trigger? não

- **`performance_plateau`** — "Treino bastante mas não melhoro"
  - Safety trigger? não

**Justificativa da pergunta:** Em vez de "qual seu maior desafio?" (genérico), cada opção é um diagnóstico específico que muda o foco dos pilares do relatório. Descartei "equipamento" como opção — é decisão de compra, não gargalo de preparação.

**Justificativa das opções:** Cobrem os 5 gargalos clássicos documentados na literatura de triathlon long-distance: técnica de nado, nutrição de prova, gestão de tempo, lesão recorrente e platô de performance. "Medo da prova" foi descartado — é transversal a todos, não é um gargalo operacional.

---

### Q3 · `weekly_training_hours` _(Motor 4 — Comportamento real)_

**Type:** `single_choice`
**Label:** "Na última semana típica, quantas horas você realmente treinou?"
**Helper:** "Conte tudo: nado, bike, corrida, musculação, mobilidade."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`under_6`** — "Menos de 6 horas"
  - Safety trigger? não

- **`6_to_10`** — "6 a 10 horas"
  - Safety trigger? não

- **`10_to_15`** — "10 a 15 horas"
  - Safety trigger? não

- **`over_15`** — "Mais de 15 horas"
  - Safety trigger? não

**Justificativa da pergunta:** "Na última semana típica" força resposta real, não aspiracional. Horas de treino é a variável que mais prediz readiness para Ironman e risco de overtraining. Descartei "quantas sessões por semana" porque não captura duração (1 sessão de 5h ≠ 1 de 45min).

**Justificativa das opções:** Faixas alinhadas com a literatura de periodização para Ironman: <6h (insuficiente), 6-10h (age-grouper padrão), 10-15h (competitivo), 15h+ (elite amador). Cobrem 95%+ dos cenários reais.

---

### Q4 · `uses_metrics` _(Motor 7 — Métricas, parte 1)_

**Type:** `single_choice`
**Label:** "Você monitora dados de treino com relógio ou potencímetro?"
**Helper:** "Garmin, Apple Watch, Wahoo, Coros, etc."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `standard`

**Opções:**

- **`yes_full`** — "Sim, FC + potência no bike (e/ou pace estruturado)"
  - Safety trigger? não

- **`yes_basic`** — "Sim, mas só frequência cardíaca"
  - Safety trigger? não

- **`no`** — "Não uso nada / só percepção"
  - Safety trigger? não

**Justificativa da pergunta:** Condiciona o nível de profundidade técnica do relatório. Se tem dados, podemos falar em zonas e FTP. Se não, falamos em percepção e volume. Descartei pergunta aberta sobre "qual relógio?" — irrelevante para o template.

**Justificativa das opções:** 3 níveis claros: completo (FC + potência/pace), básico (só FC), nenhum. Cobrem 100% dos cenários sem fricção.

---

### Q5 · `metric_data` _(Motor 7 — Métricas, parte 2, condicional)_

**Type:** `single_choice`
**Label:** "Qual seu FTP aproximado no bike (watts)?"
**Helper:** "Se não sabe, responda 'Não sei'. Você encontra no TrainingPeaks ou Garmin Connect."
**Required:** sim
**Visibility:** `if uses_metrics == yes_full`
**Segmentação:** não
**depthRequired:** `detailed`

**Opções:**

- **`under_180`** — "Menos de 180W"
  - Safety trigger? não

- **`180_to_250`** — "180 a 250W"
  - Safety trigger? não

- **`over_250`** — "Mais de 250W"
  - Safety trigger? não

- **`dont_know`** — "Não sei meu FTP"
  - Safety trigger? não

**Justificativa da pergunta:** FTP é a métrica mais acionável para Ironman no bike — determina pacing de prova e zonas de treino. Só aparece para quem tem potencímetro (`yes_full`). Descartei perguntar pace de corrida e tempo de nado/100m na mesma pergunta — seriam 3 perguntas condicionais, excesso. FTP é a mais impactante: bike = 50%+ do tempo de prova.

**Justificativa das opções:** Faixas pragmáticas para age-groupers brasileiros (70-85kg típico). "Não sei" é opção honesta — muitos têm potencímetro mas nunca testaram formalmente.

---

### Q6 · `health_screening` _(Motor 8 — Safety/Liberação)_

**Type:** `multiple_choice`
**Label:** "Você tem alguma dessas condições?"
**Helper:** "Selecione todas que se aplicam. Suas respostas são confidenciais."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** `quick`
**maxSelections:** 4

**Opções:**

- **`cardiac_history`** — "Problema cardíaco diagnosticado (arritmia, sopro, histórico familiar de morte súbita)"
  - Safety trigger? **sim** (reason: "Incidência de morte súbita em triathlon é 1,74/100k — maior que maratona. Homens 60+ chegam a 18,6/100k. ECG + eco obrigatórios antes de prescrição de volume. Harris et al., 2017.")

- **`recent_chest_pain`** — "Dor no peito ou desmaio durante esforço nos últimos 6 meses"
  - Safety trigger? **sim** (reason: "Dor torácica e síncope de esforço são red flags cardíacas absolutas. Risco de morte súbita no nado é desproporcional. Avaliação cardiológica urgente antes de qualquer prescrição.")

- **`diabetes`** — "Diabetes (tipo 1 ou 2)"
  - Safety trigger? **sim** (reason: "Risco de hipoglicemia severa em 8-17h de esforço contínuo. Exige liberação médica + protocolo integrado de insulina/nutrição. Não é safety 'leve' — é risco de coma hipoglicêmico durante nado em águas abertas.")

- **`hypertension_uncontrolled`** — "Pressão alta sem acompanhamento médico"
  - Safety trigger? **sim** (reason: "Hipertensão não controlada + volume de Ironman = risco cardiovascular elevado. Difere de hipertensão controlada/medicada que é safe.")

- **`none`** — "Nenhuma dessas"
  - Safety trigger? não

**Justificativa da pergunta:** Ironman tem a maior taxa de eventos cardíacos entre esportes de endurance. A triagem é obrigatória — não é "nice to have". Descartei perguntar sobre lesões ortopédicas aqui — já são capturadas no gargalo (Q2, `recurring_injury`). Safety é para risco de vida, não para dor no joelho.

**Justificativa das opções:** As 4 condições que REALMENTE exigem acompanhamento médico presencial antes de treinar para Ironman. Não incluí "tireoide" ou "asma controlada" — são condições gerenciáveis que não disparam safety (ajustam tom, mas não bloqueiam). A opção `none` é explícita para confirmar que o atleta leu e descartou conscientemente.

## 5 · Branches

### Branch: `Primeiro Ironman` (trigger: `athlete_stage == first_ironman`)

- **Tom geral:** Acolhedor-técnico. Inspirar confiança sem esconder a complexidade. "Você consegue — e aqui está exatamente o que precisa priorizar."
- **pillarGuidance:** Pilares focam em fundamentos: base aeróbia, nutrição de prova como habilidade treinável, prevenção de lesão. Menos zonas/potência, mais consistência e progressão.
- **Additional questions:** nenhuma
- **Remove questions:** `metric_data` (Q5) permanece se aplicável, mas o relatório não enfatiza otimização de FTP — enfatiza completar.
- **Metrics override:** Remove métricas de otimização avançada (TSS/CTL). Mantém métricas de base (hidratação, nutrição/h, volume semanal progressivo).
- **Narrative arc override:** "Você tomou a decisão → aqui está onde você está → aqui está o caminho → aqui está o que priorizar → seu profissional é o guia."

**Justificativa:** Um primeiro-timer precisa de um arco de "construção de confiança" — não de análise de platô. Se o relatório falar em CTL/TSB para quem nunca fez um tri, perde o lead.

---

### Branch: `Experiente` (trigger: `athlete_stage == experienced`)

- **Tom geral:** Direto-técnico. Respeitar a experiência, falar de igual para igual. Métricas avançadas são bem-vindas. Menos "motivação", mais "análise".
- **pillarGuidance:** Pilares focam em otimização: polarização de treino, nutrição de prova periodizada, análise de onde perde mais tempo (swim/bike/run split analysis).
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Inclui TSS/CTL target, análise de split (tempo por modalidade + T1/T2), pacing de prova baseado em FTP.
- **Narrative arc override:** "Você já sabe o que é → aqui está o diagnóstico do seu gargalo → aqui está a otimização específica → aqui está o plano → seu profissional vai calibrar."

**Justificativa:** Atleta experiente fecha o relatório se perceber que é genérico. Precisa de profundidade técnica e respeito pela bagagem que já tem.

---

### Branch: `Retorno` (trigger: `athlete_stage == comeback`)

- **Tom geral:** Empático-prudente. Validar a decisão de voltar sem pressionar timeline. "Seu corpo lembra — mas precisa de tempo pra reconstruir."
- **pillarGuidance:** Pilares focam em retorno progressivo: volume mínimo viável, indicadores de prontidão (não de performance), escuta corporal. Nutrição e sono como pilares de recuperação.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Remove metas de tempo/pace. Foca em métricas de readiness: qualidade do sono, FC de repouso, volume semanal sustentável sem dor.
- **Narrative arc override:** "Você está voltando → aqui está onde seu corpo está agora → aqui está a reconstrução → aqui está o que respeitar → seu profissional vai moderar."

**Justificativa:** Atleta em retorno é o mais vulnerável a se machucar — quer voltar ao nível anterior rápido demais. O relatório precisa ser freio inteligente, não acelerador.

## 6 · Safety triggers

| Questão            | Opções                      | Reason (clínico)                                                                        | Efeito no relatório                                                                             |
| ------------------ | --------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `health_screening` | `cardiac_history`           | Morte súbita em tri 1,74/100k; 67% no nado. ECG + eco obrigatórios. Harris et al., 2017 | macros omitidas, timeline omitida, SafetyNote aparece, zonas omitidas                           |
| `health_screening` | `recent_chest_pain`         | Red flag cardíaca absoluta. Avaliação urgente antes de qualquer prescrição              | macros omitidas, timeline omitida, SafetyNote aparece, zonas omitidas                           |
| `health_screening` | `diabetes`                  | Risco hipoglicemia severa em 8-17h de esforço. Protocolo médico integrado obrigatório   | macros omitidas (nutrição exige endócrino), timeline mantida com disclaimer, SafetyNote aparece |
| `health_screening` | `hypertension_uncontrolled` | HAS não controlada + volume IM = risco cardiovascular elevado                           | macros omitidas, timeline omitida, SafetyNote aparece                                           |

**safetyTemplate:**

- **Title:** "Sua segurança vem primeiro"
- **Body:** "Algumas das condições que você marcou exigem avaliação médica especializada antes de iniciar — ou continuar — uma preparação para Ironman. Isso não significa que você não pode competir. Significa que o caminho mais seguro passa por um cardiologista esportivo ou médico do esporte que entenda as demandas de endurance de longa duração. Seu profissional [profissional_nome] pode orientar essa etapa e adaptar o plano após a liberação médica. O Ironman não vai a lugar nenhum — ele espera por você, preparado da forma certa."

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `hydration_target_ml`

- **O que é:** Meta de hidratação por hora de prova (mL/h)
- **Por que aparece para o aluno:** Acionável — sabe exatamente quanto beber por hora. Errar hidratação é a causa #1 de hiponatremia (10,6% de incidência em IM).
- **Cálculo:** Base de 500-750 mL/h, ajustado por peso corporal (7-10 mL/kg/h). Ref: American College of Sports Medicine guidelines + Hew-Butler, NEJM 2015.
- **Visualização proposta:** Card numérico com ícone de garrafa. "750 mL/hora — equivale a 1 garrafa de 750mL por posto de hidratação no bike." Rationale: número simples, acionável, sem interpretação necessária.
- **Placeholder:** `[hidratacao_hora]`

### 7.2 · `carb_target_gh`

- **O que é:** Meta de carboidrato por hora de prova (g/h)
- **Por que aparece para o aluno:** É o número mais importante da nutrição de prova. "Quanto gel/isotônico por hora?"
- **Cálculo:** 60-90g/h para eventos >2,5h (dual transporter glucose+fructose). Ajustado por peso e experiência. Ref: Jeukendrup, Sports Medicine 2017.
- **Visualização proposta:** Card numérico + comparativo visual ("= 2 géis + 500mL de isotônico por hora"). Rationale: traduzir gramas em objetos concretos que o atleta conhece.
- **Placeholder:** `[carb_hora]`

### 7.3 · `sodium_target_mgh`

- **O que é:** Meta de sódio por hora (mg/h)
- **Por que aparece para o aluno:** Sódio é o micronutriente que mais impacta performance em endurance longo.
- **Cálculo:** 300-600 mg/h padrão; 1000-1500 mg/h em calor extremo ou alto sweat rate. Ref: Precision Hydration / ACSM.
- **Visualização proposta:** Card numérico com faixa de zona (verde: adequado, amarelo: ajustar). Rationale: a maioria subestima necessidade de sódio.
- **Placeholder:** `[sodio_hora]`

### 7.4 · `weekly_volume_target`

- **O que é:** Volume semanal recomendado de treino (horas/semana) para o estágio atual
- **Por que aparece para o aluno:** Calibra expectativa — "quanto preciso treinar?"
- **Cálculo:** Baseado no branch (primeiro IM: 8-12h, experiente: 12-16h, retorno: 6-10h progressivo) + volume atual (Q3). Incremento máximo 10%/semana. Ref: Joe Friel, "Triathlete's Training Bible".
- **Visualização proposta:** Gauge radial com ponteiro no volume atual e faixa-alvo hachurada. Rationale: o atleta vê de relance se está sub ou sobre treinando.
- **Placeholder:** `[volume_alvo]`

### 7.5 · `race_day_timeline`

- **O que é:** Projeção narrativa de como será o dia da prova (timeline hora a hora)
- **Por que aparece para o aluno:** É o conteúdo mais engajante — o lead se imagina competindo. Alto valor emocional.
- **Cálculo:** Baseado em FTP (Q5) para bike split + estimativa de run pace por volume semanal. Se sem dados, usa faixas genéricas por volume de treino. Ref: ironman.com finishing time distributions.
- **Visualização proposta:** Timeline horizontal com marcos (swim exit → T1 → bike split → T2 → marathon → finish). Cada segmento com tempo estimado e dica-chave. Rationale: narrativa visual que cria identificação.
- **Placeholder:** `[tempo_estimado_total]`, `[bike_split]`, `[run_split]`

### 7.6 · `bmi_contextual`

- **O que é:** IMC com interpretação específica para atleta de endurance
- **Por que aparece para o aluno:** Contexto importa — IMC "sobrepeso" em atleta musculoso é irrelevante. A interpretação é o valor.
- **Cálculo:** Peso / (Altura²). Interpretação ajustada para atletas (ranges diferentes de população geral). Ref: WHO + contextualização para atletas de endurance.
- **Visualização proposta:** Gauge com faixas coloridas e texto narrativo ("Seu IMC está na faixa X — para atletas de endurance, isso significa Y"). Rationale: número sem contexto ofende; com contexto, informa.
- **Placeholder:** `[imc_valor]`, `[imc_interpretacao]`

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `training_load_score`

- **O que é:** Score composto de carga de treino (0-100) derivado de volume semanal + experiência + gargalo
- **Por que importa para o PT:** Classifica o lead rapidamente — "esse atleta está subtreinado, adequado ou sobrecarregado?"
- **Cálculo:** Score ponderado: volume atual vs. recomendado para o estágio (Q1 + Q3), penalizado por lesão recorrente (Q2). Proprietary scoring.
- **Visualização proposta:** Scorecard com semáforo (verde/amarelo/vermelho). Rationale: PT olha dashboard e prioriza quem precisa de atenção.

### 8.2 · `bottleneck_flag`

- **O que é:** Flag indicando o gargalo principal declarado pelo atleta
- **Por que importa para o PT:** Direciona a primeira conversa. Se o lead marcou "nutrição", o PT já sabe por onde começar.
- **Cálculo:** Direto da Q2 (`main_bottleneck`).
- **Visualização proposta:** Badge colorido no card do lead. Rationale: visível de relance sem abrir ficha.

### 8.3 · `injury_risk_index`

- **O que é:** Índice de risco de lesão (baixo/médio/alto) baseado em volume + gargalo + estágio
- **Por que importa para o PT:** Identifica quem precisa de progressão mais conservadora.
- **Cálculo:** Alto se: volume >15h + gargalo é lesão, OU retorno + volume >10h, OU primeiro IM + volume >12h. Médio se: qualquer combinação com 1 fator de risco. Baixo: sem fatores.
- **Visualização proposta:** Semáforo no card + tooltip com justificativa. Rationale: flag visual rápido.

### 8.4 · `ftp_watts` (se informado)

- **O que é:** FTP declarado pelo atleta
- **Por que importa para o PT:** Dado técnico para prescrição de zonas de potência no bike.
- **Cálculo:** Direto da Q5 (faixa). Valor exato se informado futuramente.
- **Visualização proposta:** Número + classificação por w/kg (necessita peso do bloco universal).

### 8.5 · `readiness_score`

- **O que é:** Score de prontidão para a prova (0-100)
- **Por que importa para o PT:** Responde "esse atleta está pronto?" de forma rápida.
- **Cálculo:** Composto de: estágio (experienced > first_timer > comeback), volume (adequação à faixa), ausência de safety triggers, posse de métricas. Proprietary scoring.
- **Visualização proposta:** Gauge ou número grande no topo da ficha do lead. Rationale: o PT quer saber rapidamente quem está mais ou menos pronto.

### 8.6 · `cardiovascular_risk_flag`

- **O que é:** Flag booleano de risco cardiovascular baseado na triagem
- **Por que importa para o PT:** Alerta visual imediato. O PT sabe que precisa exigir liberação médica antes de prescrever.
- **Cálculo:** `true` se qualquer safety trigger de Q6 ativado.
- **Visualização proposta:** Badge vermelho "⚠ Liberação médica pendente" no card. Rationale: impossível ignorar.

## 9 · Pilares do relatório

### Pilar 1 · Sua Base Aeróbia

- **Subtitle:** "O alicerce dos 226 km"
- **Conceito central:** No Ironman, a base aeróbia é tudo. A capacidade de sustentar esforço moderado por 8-17 horas depende de eficiência metabólica (queima de gordura), resistência muscular e adaptação cardiovascular ao exercício prolongado. Volume em zona 2 é o investimento que paga dividendos no dia da prova.
- **Evidência científica:** Modelo de polarização 80/20 (Seiler, 2010). Atletas de endurance que treinam 80% em baixa intensidade e 20% em alta têm melhores resultados que os que treinam em intensidade moderada crônica.
- **Placeholders:** `[volume_alvo]`, `[frequencia_semanal]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Seu volume atual de [volume_atual]h por semana mostra que você já tem compromisso com o treino. Para o seu estágio, o ideal é estar na faixa de [volume_alvo]h — e a maioria desse volume precisa ser em ritmo confortável, onde você consegue conversar. Parece contra-intuitivo, mas é o treino 'fácil' que constrói a máquina aeróbia que vai te carregar por 226km. [profissional_nome] vai estruturar essa progressão."
- **Exemplo de texto técnico (35 palavras):** "Volume semanal de [volume_alvo]h com distribuição polarizada (80% Z1-Z2, 20% Z4-Z5). Priorizar sessões longas em zona 2 para otimização de oxidação lipídica e economia de movimento. Progressão ≤10%/semana."

### Pilar 2 · Nutrição como Quarta Modalidade

- **Subtitle:** "O que entra na boca decide se você cruza a linha"
- **Conceito central:** No Ironman, nutrição não é suporte — é a quarta modalidade. Absorver 60-90g de carboidrato por hora por 8-14 horas exige treino do sistema gastrointestinal, estratégia de sódio e hidratação, e prática repetida nos longões. GI distress é o maior causador de abandonos, e é 100% prevenível com protocolo.
- **Evidência científica:** Jeukendrup, 2017 — gut training upregula transportadores SGLT1 e GLUT5, aumentando capacidade de absorção em ~30%. Dual transporter (glucose + fructose) permite 90g+/h vs. 60g/h com glucose isolada.
- **Placeholders:** `[carb_hora]`, `[hidratacao_hora]`, `[sodio_hora]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "Seu alvo é [carb_hora]g de carboidrato por hora durante o bike e a corrida — isso equivale a mais ou menos 2 géis + 500mL de isotônico por hora. Parece muito? É exatamente por isso que você precisa treinar isso nos longões a partir de agora. Comece com [carb_hora_inicio]g e aumente progressivamente. Seu estômago vai se adaptar. E [hidratacao_hora]mL de líquido por hora mantém tudo funcionando. [profissional_nome] monta esse protocolo."
- **Exemplo de texto técnico (40 palavras):** "Target nutricional: [carb_hora]g CHO/h (glucose:fructose 2:1), [hidratacao_hora]mL/h fluido, [sodio_hora]mg Na+/h. Gut training progressivo nos longões (iniciar em 30g/h, progredir 10g/semana). Monitorar GI tolerance e ajustar concentração osmolar."

### Pilar 3 · O Gargalo que Trava Seu Resultado

- **Subtitle:** "Onde estão seus minutos escondidos"
- **Conceito central:** Todo triatleta tem um gargalo — a modalidade ou aspecto que mais consome tempo relativo ao potencial. Identificar e atacar esse gargalo gera mais retorno que melhorar o que já é forte. Para muitos, o nado é onde os minutos são mais "baratos" (grandes ganhos com técnica), e o bike é onde os minutos são mais "caros" (ganhos exigem consistência e potência).
- **Evidência científica:** Análise de split times em Ironman mostra que age-groupers perdem proporcionalmente mais tempo no nado e na T2 que profissionais (TriRating race analysis). Economias de 5-10min no nado via técnica são comuns em 3-6 meses de trabalho direcionado.
- **Placeholders:** `[gargalo_principal]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Você identificou [gargalo_principal] como seu maior travamento. Boa notícia: saber onde está o problema já é metade da solução. A maioria dos triatletas treina o que gosta — não o que precisa. Se o nado é o gargalo, 3 sessões de técnica por semana por 3 meses podem cortar 5-10 minutos sem aumentar seu VO2max. [profissional_nome] vai montar a estratégia específica pra atacar esse ponto."
- **Exemplo de texto técnico (35 palavras):** "Gargalo identificado: [gargalo_principal]. Priorizar intervenção específica nesta modalidade/aspecto durante bloco de construção. Análise de split time recomendada após próxima prova para quantificar ganho efetivo."

## 10 · AI Context

- **specialtyDescription:** "Ironman (140.6) é a prova mais exigente do triathlon amador: 3,8km de nado + 180km de bike + 42,2km de corrida, tipicamente 8-17 horas de esforço contínuo. O público é majoritariamente masculino (80%), classe A, 30-49 anos, que investe significativamente em treino e equipamento. Muitos treinam com assessorias esportivas e usam dados (FC, potência, pace)."

- **narrativeArc:**
  1. Abertura: validar a decisão de encarar o Ironman (ou de querer melhorar/voltar)
  2. Diagnóstico: "aqui está onde você está hoje" — volume, gargalo, dados disponíveis
  3. Contexto científico: por que o gargalo identificado importa (com dados, não com opinião)
  4. Pilares de ação: o que fazer concretamente (base aeróbia, nutrição, gargalo específico)
  5. Projeção: como vai ser o dia da prova se seguir o plano
  6. Ponte com o profissional: "seu profissional vai calibrar cada número deste relatório para você"
  7. Fechamento: frase aspiracional mas técnica — não motivacional vazia

- **terminology:** planilha, longão, brick, tiro, transição (T1/T2), pace, zona (Z1-Z5), bloco, base, construção, específico, polimento, taper, FTP, watts, watt/kg, normalizado (NP), TSS, split, age-grouper, finisher, assessoria, periodização, sweet spot, zona 2, polarizado, dual transporter, gel, isotônico, gut training

- **forbiddenTerms:**
  - "fácil" referindo-se ao Ironman (ofende; nada no IM é fácil)
  - "dieta" (conotação restritiva; usar "nutrição" ou "protocolo nutricional")
  - "amador" de forma pejorativa (age-grouper é o termo correto)
  - "gordo", "obeso", "acima do peso" (usar "composição corporal atual" se necessário)
  - "não consegue" (usar "ainda não" ou "em desenvolvimento")
  - "Ironman é pra qualquer um" (é perigoso dizer isso sem avaliação médica — ironicamente, é o template com mais safety triggers)
  - "só" minimizando distância ("são só 3,8km de nado" — é em águas abertas, com 2.000 pessoas)
  - "limite" como barreira ("você está no limite") — usar "potencial" ou "margem de evolução"

- **recommendedTone:** Direto, técnico e respeitoso. O atleta de Ironman quer ser tratado como alguém que já faz algo extraordinário — não precisa de motivação genérica, precisa de análise precisa e caminho claro. Usar dados e referências quando disponíveis. Emocionar pela competência, não pela frase de efeito.

- **pillarGuidance:**
  1. "Pilar 1 (Base): conectar volume atual do atleta com meta, explicar polarização em linguagem acessível, dar número concreto de horas-alvo. Se primeiro IM, focar em consistência; se experiente, focar em qualidade da distribuição."
  2. "Pilar 2 (Nutrição): dar números exatos (g/h carb, mL/h fluido, mg/h sódio), traduzir em objetos concretos (géis, garrafas), explicar gut training. Nunca deixar esse pilar genérico — é a diferença entre cruzar a linha e abandonar."
  3. "Pilar 3 (Gargalo): personalizar 100% com base na resposta de Q2. Se nado, falar de técnica e economia. Se nutrição, aprofundar protocolo. Se tempo, falar de periodização inteligente. Se lesão, falar de progressão e sinais de alerta. Se platô, falar de polarização."

## 11 · Configuração de cálculos

- **activityLevelDefault:** `very_active` — justificativa: qualquer pessoa treinando para Ironman está treinando no mínimo 6h/semana em 3 modalidades. Mesmo os sub-6h estão acima de "moderately_active" pela definição ACSM (150min+ de exercício vigoroso/semana).

- **activityMapping:**
  - Q3 (`weekly_training_hours`) mapeia para activity_level:
    - `under_6` → `moderately_active` (único cenário de downgrade)
    - `6_to_10` → `very_active`
    - `10_to_15` → `very_active` (cálculo calórico ajustado pelo volume real)
    - `over_15` → `extremely_active`

## 12 · Notas de design

### Por que não incluí "qual modalidade é mais forte?"

Parece óbvia, mas é redundante com Q2 (gargalo). Se o nado é gargalo, o forte provavelmente é bike ou run. Perguntar as duas coisas é desperdiçar uma pergunta. O gargalo é mais acionável.

### Por que FTP e não pace de corrida como pergunta condicional

O bike representa 50%+ do tempo de prova em Ironman. FTP é a métrica mais acionável para pacing de bike — e errar o pacing no bike destrói a corrida. Pace de corrida em Ironman é derivado do que sobra depois do bike, não é uma métrica independente. Se pedalar forte demais, o pace planejado vira ficção.

### Por que 3 branches e não 2 ou 4

"Retorno após pausa/lesão" poderia ser fundido com "primeiro IM" (ambos precisam de construção), mas o tom é fundamentalmente diferente: o primeiro-timer tem entusiasmo e falta de experiência; o retorno tem experiência e frustração/medo. Unificar perderia nuance que importa. Uma 4ª branch "busca Kona" foi descartada — é um sub-caso de "experiente" (mesmas perguntas, mesmas métricas, só muda o tom de "melhorar" para "classificar").

### Por que diabetes é safety trigger

Diferente de hipertensão controlada, diabetes em ultra-endurance (8-17h) apresenta risco real de hipoglicemia severa — especialmente no nado, onde perda de consciência = afogamento. O atleta diabético pode e deve fazer Ironman, mas precisa de protocolo integrado com endocrinologista. Não é cautela excessiva — é protocolo médico esportivo padrão.

### Por que não incluí pergunta sobre equipamento (tipo de bike, roupa de neoprene)

Equipamento é decisão de compra, não diagnóstico. O formulário captura QUEM o atleta é e COMO treina — não O QUE ele tem. Equipamento pode ser abordado nos pilares do relatório se relevante, mas não justifica uma pergunta.

### Sobre o label "Ironman"

"Ironman" é marca registrada da World Triathlon Corporation (WTC). Em contexto comercial, deveríamos usar "triathlon long distance" ou "full distance triathlon". Porém, para o hub do onboarding.bio, o público busca "Ironman" — ninguém pesquisa "triathlon long distance". Decisão: manter label como "Ironman (140.6)" no hub, usar `specialty_code: ironman_full_distance` internamente. Se WTC reclamar, ajustamos o label para "Full Distance (140.6)".

## 13 · Pendências

1. **Validação clínica bloqueante:** Necessário revisão por cardiologista esportivo e/ou médico do esporte para validar:
   - Safety triggers escolhidos (são suficientes? faltam condições?)
   - safetyTemplate (linguagem adequada?)
   - Limiar de safety para diabetes em ultra-endurance

2. **Cálculo de bike split estimado a partir de FTP:** Existe em ferramentas como BestBikeSplit e TrainingPeaks, mas não encontrei lib open-source que implemente. Pode exigir implementação própria (fórmula é: `tempo_bike = distância / (FTP × %FTP_sustentável × eficiência_aerodinâmica)`). Anotar para avaliação na Fase C.

3. **Projeção de tempo total de prova:** Modelos existem (TriRating, CoachCox) mas são proprietários. Faixas genéricas por volume de treino são publicadas pelo Ironman, mas precisam de validação com dados reais.

4. **Lib de cálculos específicos:** Verificar se existe lib para:
   - Zonas de potência (Coggan) a partir de FTP
   - Estimativa de VO2max por performance (VDOT de Daniels adaptado para triatletas)
   - TSS estimado para Ironman por FTP + tempo esperado

5. **Hidratação personalizada:** O cálculo de 7-10 mL/kg/h é genérico. Idealmente, teste de suor (sweat rate test) seria input, mas não é viável no formulário. Manter faixa com recomendação de teste presencial.

6. **Decisão pendente:** Se `hypertension_uncontrolled` deveria realmente ser safety trigger full (macros omitidas etc.) ou apenas trigger parcial com disclaimer. Hipertensão não controlada + Ironman é arriscado, mas o atleta pode estar em processo de controle. Decisão para o cardiologista validar.

## 14 · Fontes citadas

1. Harris KM, Henry JT, Rohman E, Haas TS, Maron BJ. "Death and Cardiac Arrest in U.S. Triathlon Participants, 1985 to 2016: A Case Series." _Annals of Internal Medicine_, 2017;167(8):529-535.
2. Jeukendrup AE. "Training the Gut for Athletes." _Sports Medicine_, 2017;47(Suppl 1):101-110.
3. "Sociodemographic, Socioeconomic and Motivational Profile of Brazilian Triathletes." _Revista Brasileira de Medicina do Esporte_ (SciELO).
4. Villegas García JA et al. "A Systematic Review of Long-Distance Triathlon Musculoskeletal Injuries." _PMC_, 2022.
5. Johnson EC et al. "Clinical presentation of exercise-associated hyponatremia in male and female IRONMAN triathletes over three decades." _Scandinavian Journal of Medicine & Science in Sports_, 2023.
6. Hew-Butler T et al. "Hyponatremia among Triathletes in the Ironman European Championship." _New England Journal of Medicine_, 2015.
7. Neubauer O et al. "Recovery after an Ironman triathlon: sustained inflammatory responses and muscular stress." _European Journal of Applied Physiology_, 2008.
8. Seiler S. "What is best practice for training intensity and duration distribution in endurance athletes?" _International Journal of Sports Physiology and Performance_, 2010;5(3):276-291.
9. Friel J. _The Triathlete's Training Bible_. 5th edition. VeloPress.
10. Weber S. "VLaMax Model for Endurance Sports." _Scientific Triathlon Podcast_, Episode #169.
11. TrainingPeaks. "A Coach's Guide to ATL, CTL & TSB." (online resource)
12. Rawson ES et al. "Blood biomarkers in male and female participants after an Ironman-distance triathlon." _PMC_, 2017.
13. Pfeiffer B, Stellingwerff T, Zaltas E, Jeukendrup AE. "Oxidation of solid versus liquid carbohydrate sources during exercise." _Medicine & Science in Sports & Exercise_, 2010;42(11):2030-7.

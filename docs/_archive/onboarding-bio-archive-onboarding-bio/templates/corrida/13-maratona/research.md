# Research · Especialidade 13 · Maratona (42K)

## 0 · Metadados

- **Número:** 13
- **Modality:** corrida
- **Pasta:** `corrida/13-maratona/`
- **Plano:** pro
- **Validação clínica:** Opcional (recomenda-se avaliação cardiológica pré-participação, mas não é bloqueante para o template)
- **Pesquisado em:** 2026-04-23
- **Fontes consultadas:**
  1. Rapoport, B.I. (2010). "Metabolic Factors Limiting Performance in Marathon Runners." _PLoS Computational Biology_
  2. Smyth, B. (2021). "How recreational marathon runners hit the wall: A large-scale data analysis of late-race pacing collapse." _PLoS ONE_
  3. Daniels, J. (2014). _Daniels' Running Formula_, 3rd ed. Human Kinetics
  4. Lopes et al. (2021). "A systematic review of running-related musculoskeletal injuries in runners." _Journal of Sport and Health Science_
  5. Contra Relógio (2025). Ranking de maratonas brasileiras — dados de concluintes
  6. Pfitzinger, P. & Douglas, S. (2019). _Advanced Marathoning_, 3rd ed. Human Kinetics
  7. Noakes, T. (2003). _Lore of Running_, 4th ed. Human Kinetics

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 30–50 anos (média ~38 anos em assessorias paulistas)
- **Gênero:** ~65% masculino / 35% feminino, com crescimento feminino acelerado
- **Contexto socioeconômico:** classe B/C predominante — a maratona exige investimento em tênis, inscrição (R$200–500), nutrição esportiva, e muitas vezes assessoria (R$200–600/mês). Não é esporte de entrada de renda baixa
- **Geografia:** concentração massiva em SP (10 maratonas urbanas, 14.241 finalistas em 2025) e RJ (Maratona do Rio: 13.125 finalistas). Sul e Nordeste crescendo

### Números

- ~60.000 finalistas de maratona no Brasil em 2025 (62 provas), crescimento de 36,8% vs 2024
- Apenas 5% dos corredores de rua brasileiros encaram a maratona — é nicho dentro do nicho
- Cerca de 1 milhão de corredores ativos no Brasil → ~50-60 mil são maratonistas

### Onde estão online

- **Instagram:** perfil principal. Seguem assessorias (RunFun, Iguana Sports, CPH), influencers de corrida, marcas (Asics, Nike Run Club). Postam medalhas, pace screenshots
- **Strava:** rede social primária de treino. Segmentos, clubs, rankings — cultura forte de compartilhamento
- **Grupos WhatsApp:** de assessorias, de provas específicas ("Maratona de SP 2026"), de pace groups ("Sub4", "Sub3:30")
- **Apps:** Strava, Nike Run Club, Garmin Connect, Training Peaks
- **YouTube/Podcasts:** Contra-Relógio, Corrida Perfeita, Corre Lá (consumo de conteúdo técnico)

### Linguagem-padrão

- "Longão" (treino longo semanal)
- "Pace" (ritmo min/km, universalizado mesmo em português)
- "Tiro" (treino intervalado rápido)
- "Bater a parede" / "dar o muro" (hitting the wall)
- "Sub-X" (meta de tempo: sub4, sub3:30)
- "Taper" / "polimento" (período de redução pré-prova)
- "Gel" (suplementação em prova)
- "Negativo" / "split negativo" (segunda metade mais rápida)
- "Assessoria" (grupo de treinamento com coach)
- "PB" ou "RP" (personal best / recorde pessoal)
- "Longão progressivo" (longão que termina forte)
- "Quebrar" (fracassar em prova — oposto de "completar")

### O que ofende ou afasta

- Chamar de "corredor de fim de semana" ou minimizar a seriedade
- Tratamento genérico — maratonista se vê como alguém comprometido, não casual
- Promessas de resultado mágico sem processo ("complete sua maratona em 8 semanas!")
- Ignorar a dor e o sacrifício envolvido — a maratona é identidade, não hobby
- Tom excessivamente clínico/médico — eles são atletas, não pacientes
- Formulário que parece para iniciante de 5K

### Dor mais comum que os leva a procurar ajuda

- **"Estou estagnado no tempo"** — corre maratona mas não melhora o pace
- **"Sempre me arrebento nos últimos 10km"** — problema de pacing/nutrição em prova
- **"Vivo lesionado"** — ciclo de treino → lesão → pausa → retorno
- **"Não sei montar planilha sozinho"** — volume, intensidade, longão, taper
- **"Quero baixar de sub-X"** — meta concreta que precisa de orientação estruturada

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Maratonistas amadores que já completaram ou estão se preparando para completar **42,195 km**
- Faixa de experiência: da primeira maratona até o corredor experiente buscando sub-3h
- Objetivos: completar, melhorar tempo (sub-5, sub-4:30, sub-4, sub-3:30, sub-3), voltar de lesão/pausa
- Pessoas que já correm distâncias menores (10K, 21K) e estão dando o salto ou já deram

### Este template NÃO vai cobrir:

- **Quem nunca correu** → template #10 (corrida recreativa)
- **Quem só corre 5K/10K sem intenção de maratona** → templates #10/#11
- **Meia-maratona como destino final** → template #12
- **Trail/ultra** → template #14 (terreno, navegação, autossuficiência mudam tudo)
- **Atleta profissional/elite** → foge do escopo SaaS (tem assessoria dedicada)
- **Reabilitação de corredor** → template #15

### Decisão de label

Mantenho **"Maratona (42K)"** como label. É o termo universalmente usado pelo público. Alternativas como "Maratona de rua" ou "Maratona urbana" são redundantes — o público brasileiro entende "maratona" como 42K urbana por default. Trail tem template próprio.

---

## 3 · Motores escolhidos

### Motores considerados e decisão

| Motor                          | Incluir?             | Justificativa                                                                                                               |
| ------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Motor 1 – Contexto atual       | ✅ Sim               | Saber onde o corredor está hoje (volume, tempo de prática) é essencial pra calibrar                                         |
| Motor 2 – Gargalo              | ✅ Sim               | O gargalo do maratonista define o foco do relatório inteiro                                                                 |
| Motor 3 – Nível/Maturidade     | ✅ Sim, via Motor 6  | Fase de treino implica maturidade — um corredor que já fez 5 maratonas e está em ciclo de pico é claramente avançado        |
| Motor 4 – Comportamento        | ✅ Sim               | Consistência de treino é a variável #1 em maratona. Sem isso, qualquer recomendação é chute                                 |
| Motor 5 – Ambiente             | ❌ Não               | Maratonista treina na rua, a localização não muda prescrição. Tempo disponível é relevante mas pode ser inferido do volume  |
| Motor 6 – Identidade/Fase      | ✅ Sim (segmentação) | A fase de treino (base, construção, pico, taper, pós-prova) é O fator que mais muda o relatório                             |
| Motor 7 – Métricas/Ferramentas | ✅ Sim (condicional) | Se o corredor conhece seu pace ou tempo recente, abre métricas muito mais ricas (VDOT, zonas). Se não conhece, funciona sem |
| Motor 8 – Safety               | ✅ Sim               | Obrigatório em qualquer template. Maratona tem risco cardíaco real                                                          |

### Lista final: 6 motores → 7 perguntas

1. **Segmentação (Motor 6)** → `training_phase` — Em que fase de treino o corredor está (define arco narrativo inteiro)
2. **Contexto (Motor 1)** → `marathon_experience` — Quantas maratonas já fez (calibra tom e profundidade técnica)
3. **Comportamento (Motor 4)** → `weekly_frequency` — Quantos dias treinou na última semana (consistência real, não declarada)
4. **Gargalo (Motor 2)** → `main_bottleneck` — O que mais trava o resultado (foco do relatório)
5. **Métricas (Motor 7)** → `recent_time` — Tem tempo recente de prova? (condicional: abre cálculo VDOT)
6. **Métricas condicional (Motor 7)** → `best_marathon_time` — Melhor tempo em maratona (só se já fez maratona)
7. **Safety (Motor 8)** → `health_conditions` — Triagem de saúde

---

## 4 · Perguntas e opções

### Q1 · `training_phase` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Em que momento do seu treino de maratona você está?"
**Helper:** "Isso ajuda a calibrar as recomendações para o seu momento atual"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`base_building`** — "Estou montando minha base aeróbica"
  - Safety trigger? Não

- **`build_peak`** — "Estou em fase de construção ou pico de treino"
  - Safety trigger? Não

- **`taper_race`** — "Estou no polimento ou próximo da prova"
  - Safety trigger? Não

- **`returning`** — "Estou voltando após pausa ou lesão"
  - Safety trigger? Não

**Justificativa da pergunta:** A fase de treino é a variável que mais muda o que o relatório deve dizer. Um corredor em base precisa de paciência e volume; um em pico precisa de gestão de fadiga; um em taper precisa de gestão emocional; um retornando precisa de progressão segura. O hub já definiu que é "maratona" — aqui definimos o QUANDO dentro do ciclo.

**Justificativa das opções:** As 4 fases cobrem o ciclo completo de periodização de maratona (Pfitzinger & Douglas). "Retornando" é adição pragmática — ~30% dos maratonistas estão em ciclo pós-lesão/pausa segundo dados de lesão (52% de incidência anual em maratonistas).

---

### Q2 · `marathon_experience` _(Motor 1 — Contexto)_

**Type:** `single_choice`
**Label (client-facing):** "Quantas maratonas você já completou?"
**Helper:** "Conta apenas 42K completos finalizados"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick

**Opções:**

- **`zero`** — "Nenhuma — será minha primeira"
  - Safety trigger? Não

- **`one_to_three`** — "1 a 3 maratonas"
  - Safety trigger? Não

- **`four_plus`** — "4 ou mais maratonas"
  - Safety trigger? Não

**Justificativa da pergunta:** A experiência prévia em maratona define o grau de profundidade técnica do relatório e identifica se o corredor precisa de orientação de "completar" vs "otimizar". Escala simples de 3 para resposta em 2 segundos.

**Justificativa das opções:** Zero/1-3/4+ segmenta em novato/intermediário/veterano sem exigir número exato (que nem todo mundo lembra). Descartei "quantidade exata" (número) porque a precisão não muda a recomendação — o que importa é a faixa.

---

### Q3 · `weekly_frequency` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Na última semana, quantos dias você treinou corrida?"
**Helper:** "Conte apenas dias em que correu — musculação e outros não entram"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`zero_one`** — "0 a 1 dia"
  - Safety trigger? Não

- **`two_three`** — "2 a 3 dias"
  - Safety trigger? Não

- **`four_five`** — "4 a 5 dias"
  - Safety trigger? Não

- **`six_seven`** — "6 a 7 dias"
  - Safety trigger? Não

**Justificativa da pergunta:** Frequência REAL (não planejada) da última semana é o melhor proxy de consistência em corrida. Volume semanal em km seria mais preciso mas exige que o corredor saiba (nem todos usam GPS). Dias/semana é respondível em 2 segundos e suficiente para calibrar.

**Justificativa das opções:** 4 faixas cobrem o espectro. Descartei perguntar km/semana (precisa de cálculo, muitos não sabem exato) e "quantas horas" (confuso para corredor que pensa em dias).

---

### Q4 · `main_bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais tem travado sua evolução na maratona?"
**Helper:** "Escolha o fator que mais pesa hoje"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`pacing_wall`** — "Sempre me arrebento nos últimos 10-12km"
  - Safety trigger? Não

- **`injuries`** — "Vivo me machucando durante o ciclo de treino"
  - Safety trigger? Não

- **`time_plateau`** — "Estagnei no meu tempo e não consigo melhorar"
  - Safety trigger? Não

- **`nutrition_fueling`** — "Não sei me alimentar direito para a distância"
  - Safety trigger? Não

- **`consistency`** — "Não consigo manter regularidade nos treinos"
  - Safety trigger? Não

**Justificativa da pergunta:** O gargalo do maratonista define onde o relatório deve investir energia narrativa. São 5 opções porque a maratona tem gargalos bem distribuídos — descartei "falta de tempo" (é subset de consistência) e "medo da distância" (é emocional, capturado melhor pela fase + experiência). Cada opção gera arco narrativo diferente nos pilares.

**Justificativa das opções:** Os 5 gargalos são os diagnósticos clássicos de assessorias de maratona. Cobrem facilmente 90%+ dos casos. "Outro" foi descartado — se não se encaixa em nenhum, provavelmente precisa de serviço Custom.

---

### Q5 · `recent_race` _(Motor 7 — Métricas)_

**Type:** `single_choice`
**Label (client-facing):** "Você tem tempo recente de prova (últimos 12 meses)?"
**Helper:** "Qualquer distância: 5K, 10K, 21K ou 42K"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`yes`** — "Sim, tenho tempo de prova recente"
  - Safety trigger? Não

- **`no`** — "Não — não corri prova recente"
  - Safety trigger? Não

**Justificativa da pergunta:** Essa pergunta é o gatilho para Q6. Se o corredor tem tempo recente, abrimos a pergunta de detalhamento para calcular VDOT. Se não tem, pulamos — e o relatório funciona sem métricas derivadas. Descartei perguntar diretamente "qual seu VDOT?" (ninguém sabe) e "qual seu VO2max?" (requer teste de laboratório).

---

### Q6 · `race_time_detail` _(Motor 7 — Métricas, condicional)_

**Type:** `single_choice` (seleção de distância) + `text` (tempo)
**Label (client-facing):** "Qual foi seu melhor tempo recente?"
**Helper:** "Informe a distância e o tempo (ex: 10K em 50min, 21K em 1h55)"
**Required:** sim (quando visível)
**Visibility:** `if recent_race == yes`
**Segmentação:** não
**depthRequired:** standard

**Sub-campos:**

- Distância: `5K` | `10K` | `21K` | `42K` (single choice)
- Tempo: campo de texto livre (formato HH:MM:SS ou MM:SS)

**Justificativa:** Formato combinado para máxima flexibilidade. O corredor escolhe a distância mais recente/confiável e digita o tempo. De qualquer distância, calculamos VDOT via fórmula de Jack Daniels e derivamos zonas + predição de maratona. Campo de texto para tempo é mais rápido que 3 dropdowns separados (horas/minutos/segundos).

**Justificativa do condicional:** Só aparece se Q5 = "sim". Corredor sem prova recente não consegue responder (inventaria) e a métrica seria inútil.

---

### Q7 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Selecione todas que se aplicam — isso ajusta o relatório para sua segurança"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`cardiac`** — "Problema cardíaco diagnosticado (arritmia, sopro, cardiopatia)"
  - Safety trigger? **Sim** (reason: "Risco cardiovascular aumentado em esforço de alta intensidade/longa duração. Requer liberação cardiológica com teste ergométrico/ergoespirometria antes de iniciar preparação para maratona.")

- **`hypertension_uncontrolled`** — "Pressão alta sem acompanhamento médico"
  - Safety trigger? **Sim** (reason: "Hipertensão não controlada + esforço de maratona = risco de evento cardiovascular. Precisa de avaliação médica e possivelmente teste de esforço.")

- **`diabetes`** — "Diabetes (tipo 1 ou tipo 2)"
  - Safety trigger? Não (motivo: diabetes controlado não impede maratona — ajusta recomendação nutricional, não bloqueia)

- **`recent_injury`** — "Lesão musculoesquelética atual (dor que limita treino)"
  - Safety trigger? Não (motivo: lesão musculoesquelética não é emergência médica — ajusta abordagem de treino)

- **`none`** — "Nenhuma dessas condições"
  - Safety trigger? Não

**Justificativa da pergunta:** Safety obrigatório. Foco em condições que realmente exigem liberação médica antes de maratona. Descartei: asma (controlada não afeta), tireoide (medicada não afeta), colesterol (não é risco agudo), cirurgias antigas (relevante mas não para triagem rápida).

**Justificativa das opções:** Só 5 opções para manter triagem rápida. Cardíaco e hipertensão não controlada são os dois safety triggers genuínos (risco real de evento agudo em maratona). Diabetes e lesão ativa ajustam tom/recomendações sem bloquear. "Nenhuma" garante que a resposta é intencional, não esquecida.

---

## 5 · Branches

### Branch: `Retorno` (trigger: `training_phase == returning`)

- **Tom geral:** Acolhedor e progressivo. Reconhecer a frustração de estar "atrás" do que já foi capaz. Foco em paciência e progressão.
- **pillarGuidance:** Pilar de treino foca em progressão de volume (regra dos 10%), não em intensidade. Pilar de nutrição foca em anti-inflamatórios e recuperação tecidual. Pilar de mentalidade foca em dissociar identidade de pace.
- **Additional questions:** Nenhuma
- **Remove questions:** Nenhuma
- **Metrics override:** Remove projeção de tempo de maratona (sem base recente para projetar). Adiciona "semanas estimadas para retomada de volume-alvo".
- **Narrative arc override:** O arco não é "como chegar ao tempo X" mas "como reconstruir a base com segurança". O fio narrativo é: reconhecer onde está → aceitar o ritmo do retorno → plano de retomada → horizonte realista.

**Justificativa:** O corredor retornando precisa ouvir coisas fundamentalmente diferentes de quem está em ciclo ativo. Projeção de tempo é cruel para quem está voltando. O pilar de treino muda de "como otimizar" para "como não se machucar de novo". Sem esse branch, o relatório seria insensível.

### Branch: `Taper / Pré-prova` (trigger: `training_phase == taper_race`)

- **Tom geral:** Confiante e estratégico. O trabalho de treino já foi feito — agora é logística, nutrição de prova e mental. Menos "você deveria" e mais "confie no que você fez".
- **pillarGuidance:** Pilar de treino foca em gestão do taper (redução de volume, manutenção de intensidade). Pilar de nutrição foca em carb-loading, estratégia de gel/hidratação em prova, refeição pré-prova. Pilar de mentalidade foca em ansiedade pré-prova e estratégia de pacing no dia.
- **Additional questions:** Nenhuma
- **Remove questions:** Nenhuma
- **Metrics override:** Adiciona "estratégia de pacing recomendada" (negative split ou even split baseado no perfil). Remove métricas de "como melhorar base" (irrelevante no taper).
- **Narrative arc override:** O arco é "você está pronto — agora vamos garantir que o dia da prova seja perfeito". Foco em execução, não em construção.

**Justificativa:** O corredor em taper precisa de relatório tático, não estratégico. Falar em "montar base aeróbica" para quem corre em 2 semanas é irrelevante e ansiolítico. O pilar de nutrição muda completamente (de "nutrição de treino" para "nutrição de prova"). Sem esse branch, o relatório seria genérico.

### Branch: `Base / Construção` (trigger: `training_phase == base_building` OU `training_phase == build_peak`)

- **Tom geral:** Técnico e motivador. Esses são os corredores em ciclo ativo — querem saber o que fazer amanhã. Linguagem de prescrição.
- **pillarGuidance:** Pilares padrão — treino estruturado, nutrição de treinamento, mentalidade de processo.
- **Additional questions:** Nenhuma
- **Remove questions:** Nenhuma
- **Metrics override:** Nenhum (fluxo padrão completo)
- **Narrative arc override:** Nenhum (arco padrão)

**Justificativa:** Base e construção compartilham o mesmo arco narrativo ("como chegar preparado à maratona") com diferenças de ênfase que a IA resolve via `training_phase` sem precisar de branch separado. Separar geraria dois branches quase idênticos — anti-pattern #3.

---

## 6 · Safety triggers

| Questão             | Opções                      | Reason (clínico)                                                                                                                | Efeito no relatório                                                                                                                |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `health_conditions` | `cardiac`                   | Risco de evento cardiovascular agudo em esforço prolongado (morte súbita em maratona é quase exclusivamente de origem cardíaca) | Macros omitidas, timeline omitida, projeção de tempo omitida, SafetyNote aparece, IA instruída a não prescrever volume/intensidade |
| `health_conditions` | `hypertension_uncontrolled` | Hipertensão não monitorada + esforço de 3-5h = risco de pico pressórico perigoso                                                | Macros omitidas, timeline omitida, SafetyNote aparece, IA reforça necessidade de avaliação médica antes de treinar                 |

**safetyTemplate:**

- **Title:** "Sua segurança vem antes de qualquer tempo de prova"
- **Body:** "Com base nas suas respostas, identificamos que você precisa de uma avaliação médica antes de iniciar ou continuar uma preparação para maratona. Isso não significa que você não pode correr — muitos maratonistas treinam e competem com acompanhamento médico adequado. Significa que as recomendações deste relatório precisam ser validadas por um profissional de saúde que conheça seu histórico. Procure um cardiologista esportivo para um teste ergométrico ou ergoespirometria. Com a liberação em mãos, [profissional_nome] pode montar sua preparação com segurança."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `vdot_score`

- **O que é:** Índice de performance VDOT (método Jack Daniels), calculado a partir de tempo recente de prova
- **Por que aparece para o aluno:** Dá uma "nota" objetiva da fitness atual do corredor — é engajante porque é comparável (VDOT 40 vs 50) e trackável ao longo do tempo
- **Cálculo:** Fórmula de Jack Daniels — VO2 = -4.60 + 0.182258v + 0.000104v² (v em m/min), ajustado pela fração de VO2max sustentável na duração da prova. Ref: Daniels (2014). Libs: `@kissmybutton/vdot`, `daniels-running-calculator`
- **Visualização proposta:** Card numérico grande com classificação textual (ex: "VDOT 45 — Intermediário forte"). Gauge radial com faixas de 30-70 é alternativa
- **Placeholder:** `[vdot_score]`, `[vdot_level]`
- **Condicional:** Só aparece se `recent_race == yes`

### 7.2 · `marathon_prediction`

- **O que é:** Tempo estimado de maratona baseado no VDOT
- **Por que aparece para o aluno:** A projeção de tempo é a métrica mais emocionante para o maratonista — responde a pergunta "quanto vou fazer?"
- **Cálculo:** Derivado do VDOT via tabelas de Daniels. A projeção de 5K→42K ou 10K→42K é padrão, com margem de ±3-5% dependendo da qualidade do treino de longa distância
- **Visualização proposta:** Card destacado com tempo no formato H:MM:SS, com indicação da meta "sub-X" mais próxima (ex: "Projeção: 3:52 — a 8min do sub-3:45")
- **Placeholder:** `[marathon_prediction]`, `[target_sub]`
- **Condicional:** Só aparece se `recent_race == yes` e `training_phase != returning`

### 7.3 · `training_zones`

- **O que é:** 5 zonas de treino de corrida (Easy, Marathon, Threshold, Interval, Repetition) em min/km
- **Por que aparece para o aluno:** Transforma "corra no ritmo confortável" em números concretos. É a informação mais acionável do relatório — o corredor sai sabendo exatamente em que pace correr cada tipo de treino
- **Cálculo:** Derivadas do VDOT via fórmulas de Daniels. Easy: 59-74% VDOT, Marathon: 75-84%, Threshold: 83-88%, Interval: 95-100%, Repetition: 105-110%
- **Visualização proposta:** Zone table colorida com 5 linhas (faixa de pace por zona), cores de verde (Easy) a vermelho (Rep). Familiar para corredores de Garmin/Strava
- **Placeholder:** `[zone_easy]`, `[zone_marathon]`, `[zone_threshold]`, `[zone_interval]`, `[zone_rep]`
- **Condicional:** Só aparece se `recent_race == yes`

### 7.4 · `weekly_volume_recommendation`

- **O que é:** Volume semanal sugerido (km/semana) baseado na fase de treino, experiência e frequência
- **Por que aparece para o aluno:** Responde "quanto devo correr por semana?" — a pergunta mais frequente de maratonistas amadores
- **Cálculo:** Heurística baseada em Pfitzinger & Douglas (2019): base = 40-55 km/sem para sub-4, 55-70 km/sem para sub-3:30, 70-90 km/sem para sub-3. Ajustado por fase (base: 70% do pico, construção: 85%, pico: 100%, taper: 40-60%)
- **Visualização proposta:** Card numérico com range (ex: "45-55 km/semana") + contexto da fase
- **Placeholder:** `[weekly_volume_min]`, `[weekly_volume_max]`

### 7.5 · `longrun_target`

- **O que é:** Distância e pace recomendados para o longão semanal
- **Por que aparece para o aluno:** O longão é o treino mais importante da preparação de maratona e o que gera mais dúvida ("até onde vou?")
- **Cálculo:** Longão máximo: 32-35km (Pfitzinger) ou ~2.5-3h de duração para amadores. Pace: zona Easy a Easy+Marathon (últimos km). Progressão de longão ao longo do ciclo
- **Visualização proposta:** Card com distância-alvo + pace recomendado
- **Placeholder:** `[longrun_km]`, `[longrun_pace]`

### 7.6 · `hydration_fueling_plan`

- **O que é:** Estratégia de hidratação e reposição de carboidrato para prova
- **Por que aparece para o aluno:** Previne o "muro". É a informação que mais salva maratonas de primeiro-timer
- **Cálculo:** 30-60g carb/hora para esforços de 3-5h (ACSM guidelines), 400-800ml água/hora dependendo de peso e temperatura. Géis a cada 30-45min
- **Visualização proposta:** Timeline horizontal mostrando em quais km tomar gel/água (ex: Km 8 → gel 1, Km 15 → gel 2...). Visual tipo "race day strip"
- **Placeholder:** `[gel_frequency]`, `[hydration_ml_per_hour]`

### 7.7 · `bmi_contextual`

- **O que é:** IMC com interpretação contextualizada para corredor (não a escala genérica da OMS)
- **Por que aparece para o aluno:** Corredores se preocupam com peso vs performance. Contextualizar o IMC para corredor (não sedentário) evita leitura errada
- **Cálculo:** Peso/(Altura²) — fórmula padrão, mas faixas interpretativas ajustadas para corredor de endurance (IMC 20-23 é ótimo para maratona, vs 18.5-24.9 genérico)
- **Visualização proposta:** Gauge com faixas adaptadas para corredor + nota contextual
- **Placeholder:** `[bmi_value]`, `[bmi_runner_interpretation]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `injury_risk_score`

- **O que é:** Score composto de risco de lesão (0-100) baseado em frequência, experiência, fase e histórico
- **Por que importa para o PT:** Permite priorizar atenção para clientes em risco alto de lesão (ex: novato com 6-7 treinos/semana em fase de pico = alerta vermelho)
- **Cálculo:** Score ponderado: frequência alta + experiência baixa + retornando de lesão = risco elevado. Heurística proprietária (não há fórmula publicada — construir baseado em fatores de risco da literatura de Lopes et al. 2021)
- **Visualização proposta:** Scorecard semáforo (verde/amarelo/vermelho)

### 8.2 · `training_maturity_index`

- **O que é:** Classificação de maturidade de treinamento (novato/intermediário/avançado/veterano) baseado em experiência + frequência + fase
- **Por que importa para o PT:** Define como conversar com o lead — jargão técnico vs linguagem simples, prescrição detalhada vs diretrizes gerais
- **Cálculo:** Combinação de `marathon_experience` + `weekly_frequency` + `training_phase` em matrix de classificação
- **Visualização proposta:** Badge com classificação + tooltip explicativo

### 8.3 · `bottleneck_classification`

- **O que é:** O gargalo principal categorizado + métricas associadas
- **Por que importa para o PT:** Informa a primeira conversa com o lead — se o gargalo é pacing, o PT sabe que precisa falar de estratégia de prova; se é lesão, precisa encaminhar para fisio primeiro
- **Cálculo:** Direto da resposta de `main_bottleneck`
- **Visualização proposta:** Card com ícone + descrição curta + sugestão de abordagem

### 8.4 · `vdot_with_zones`

- **O que é:** VDOT completo com todas as 5 zonas em tabela técnica (pace + FC estimada)
- **Por que importa para o PT:** Permite montar planilha de treino imediatamente, sem precisar recalcular
- **Cálculo:** Mesmo do 7.1/7.3 mas apresentado em formato técnico com mais detalhes
- **Visualização proposta:** Tabela de zonas completa com pace min/km + pace min/400m + %HRmax estimado

### 8.5 · `readiness_assessment`

- **O que é:** Avaliação de prontidão para maratona (pronto / precisa de mais preparo / não recomendado agora)
- **Por que importa para o PT:** Flag rápido de "esse lead precisa de mais base antes de tentar 42K?" — evita que o PT monte planilha de maratona para quem deveria estar treinando 10K ainda
- **Cálculo:** Combinação de frequência, experiência, fase e safety triggers. Ex: zero maratonas + 0-1 dia de treino/semana = "precisa de mais preparo"
- **Visualização proposta:** Semáforo com justificativa de 1 linha

---

## 9 · Pilares do relatório

### Pilar 1 · Treino Inteligente

- **Subtitle:** "A estrutura que transforma quilômetros em resultado"
- **Conceito central:** Maratona não se treina correndo cada dia no mesmo ritmo. A periodização — distribuir intensidades diferentes ao longo da semana e do ciclo — é o que diferencia preparação de acúmulo de quilômetros. O longão constrói resistência, os tiros desenvolvem velocidade, a corrida fácil permite recuperação ativa.
- **Evidência científica:** Polarized training model (Seiler, 2010) — distribuição 80/20 entre baixa e alta intensidade maximiza adaptações em endurance. Daniels (2014) — zonas de treino derivadas de VDOT otimizam estímulo fisiológico específico.
- **Placeholders esperados:** `[weekly_volume_min]`, `[weekly_volume_max]`, `[longrun_km]`, `[zone_easy]`, `[zone_marathon]`, `[frequencia]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Seu treino ideal agora gira em torno de [weekly_volume_min]-[weekly_volume_max]km por semana, com longão de até [longrun_km]km no fim de semana. A maioria das corridas — uns 80% — deve ser em ritmo fácil ([zone_easy]/km), aquele pace em que você consegue conversar. Os outros 20% são os treinos que realmente empurram sua performance. Parece pouco? É exatamente o que a ciência mostra que funciona."
- **Exemplo de texto técnico (35 palavras):** "Distribuição polarizada 80/20 com volume semanal de [weekly_volume_min]-[weekly_volume_max]km. Longão progressivo até [longrun_km]km em pace Easy ([zone_easy]/km) com últimos 3-5km em Marathon pace ([zone_marathon]/km). [profissional_nome] pode ajustar para seu ciclo."

### Pilar 2 · Combustível e Recuperação

- **Subtitle:** "O que entra no corpo determina o que sai na corrida"
- **Conceito central:** A maratona é, fundamentalmente, um problema de energia. O corpo tem glicogênio para ~30km; os outros 12km precisam vir de estratégia — carga de carboidrato pré-prova, reposição durante a corrida, e nutrição de recuperação que permite absorver o treino.
- **Evidência científica:** Rapoport (2010) — modelo metabólico mostra que depleção de glicogênio é causa primária do "muro". ACSM Position Stand — 30-60g carb/hora para endurance >2.5h. Smyth (2021) — 40% dos maratonistas sofrem colapso de pacing, fortemente correlacionado com pacing agressivo + subnutrição em prova.
- **Placeholders esperados:** `[gel_frequency]`, `[hydration_ml_per_hour]`, `[bmi_value]`, `[profissional_nome]`
- **Exemplo de texto popular (75 palavras):** "A parede do km 30 não é inevitável — é evitável com estratégia. Seu corpo guarda combustível para uns 30km; depois disso, se não repôs carboidrato durante a corrida, a queda é brutal. A regra prática: um gel a cada [gel_frequency] minutos, começando cedo (km 6-8, não km 20). E hidratação constante — cerca de [hydration_ml_per_hour]ml por hora. Treinar com gel é tão importante quanto treinar perna."
- **Exemplo de texto técnico (35 palavras):** "Protocolo de reposição: [gel_frequency]min entre géis (30-60g CHO/h), hidratação de [hydration_ml_per_hour]ml/h ajustável por condições térmicas. Carb-loading 48-72h pré-prova (8-10g CHO/kg). [profissional_nome] personaliza baseado em seu peso e ritmo."

### Pilar 3 · Cabeça de Maratonista

- **Subtitle:** "42km começam no corpo — os últimos 12 se decidem na mente"
- **Conceito central:** A maratona é o evento esportivo amador onde a dimensão psicológica mais importa. Gerenciar ansiedade pré-prova, aceitar o desconforto dos km 30-35, manter disciplina de pace quando as pernas pedem para acelerar no início — tudo isso é treino mental, não motivação genérica.
- **Evidência científica:** Noakes — modelo do "governador central" — o cérebro limita performance antes do colapso fisiológico real. Smyth (2021) — pacing discipline nos primeiros 21K é o maior preditor de performance nos últimos 21K.
- **Placeholders esperados:** `[marathon_prediction]`, `[target_sub]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Os primeiros 21km não são metade da maratona — são a preparação para a maratona real, que começa no km 30. A tentação de sair mais rápido que o planejado é enorme, especialmente com adrenalina e público. Cada segundo que você 'economiza' nos primeiros 10km, paga com juros nos últimos 10. [profissional_nome] pode te ajudar a montar uma estratégia de pacing que funcione."
- **Exemplo de texto técnico (35 palavras):** "Pacing strategy: negative split ou even split, com primeiros 21km 5-10s/km mais lento que pace-alvo. Projeção atual: [marathon_prediction]. Treino mental de tolerância ao desconforto nos longões acima de 28km é parte da preparação."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Preparação para maratona (42,195km) para corredores amadores brasileiros, desde a primeira maratona até veteranos buscando otimizar tempo. O público se leva a sério como atleta e espera tratamento técnico — nunca genérico."

- **narrativeArc:**
  1. Reconhecer a grandeza do objetivo (42km não é qualquer corrida)
  2. Localizar o corredor na jornada (fase, experiência, gargalo)
  3. Apresentar diagnóstico honesto do estado atual (métricas se disponíveis, análise qualitativa se não)
  4. Entregar pilares com prescrição concreta (números, não conceitos vagos)
  5. Conectar gargalo específico com solução específica
  6. Fechar com projeção/horizonte realista e ponte para o profissional

- **terminology:** `longão`, `pace`, `tiro`, `polimento/taper`, `split negativo`, `gel`, `bater a parede/muro`, `sub-X`, `PB/RP`, `corrida fácil`, `corrida forte`, `limiar`, `progressivo`, `regenerativo`, `volume semanal`, `ciclo de treino`, `base aeróbica`

- **forbiddenTerms:**
  - `"corrida de fundo"` — técnico demais, ninguém fala assim
  - `"atleta recreativo"` — diminui quem treina 5x/semana para maratona
  - `"exercício aeróbio"` — clínico, prefira "corrida"
  - `"musculatura"` — prefira "músculo" ou "força"
  - `"desistir"` — nunca usar, mesmo para quem "quebrou" em prova
  - `"dieta"` — usar "alimentação" ou "nutrição"
  - `"obesidade/obeso"` — usar "peso acima do ideal para performance" se necessário
  - `"sedentário"` — impossível aplicar a quem está fazendo formulário de maratona
  - `"você consegue!"` — motivação vazia, proibida

- **recommendedTone:** "Técnico mas acessível — como um treinador de assessoria de corrida conversando com o atleta. Direto, com dados quando disponíveis, sem enrolação motivacional. Respeita o esforço do corredor e trata a maratona como algo sério."

- **pillarGuidance:**
  1. "No pilar de Treino, use dados concretos (km, pace, zonas) quando VDOT disponível. Sem VDOT, foque em princípios de distribuição de intensidade e progressão de longão. Sempre mencione a importância do treino fácil (80/20)."
  2. "No pilar de Combustível, foque em estratégia de prova (géis, hidratação, timing). Para fase de base/construção, foque em nutrição de recuperação. Para retornando, foque em nutrição anti-inflamatória. Nunca prometa emagrecimento — o foco é performance."
  3. "No pilar de Cabeça, foque em pacing discipline (não sair rápido), tolerância ao desconforto pós-km30, e gestão de ansiedade pré-prova. Evite clichês motivacionais — use evidência (Smyth 2021, Noakes) para explicar por que mental importa."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `very_active` — justificativa: qualquer pessoa se preparando para maratona treina 3+ vezes/semana, com longões de 20-35km. Isso é, por definição, muito ativo. Mesmo o maratonista em pausa/retorno está mais ativo que "moderadamente ativo".

- **activityMapping:**
  | Resposta (`weekly_frequency`) | Activity Level |
  |-------------------------------|----------------|
  | `zero_one` | `moderately_active` |
  | `two_three` | `moderately_active` |
  | `four_five` | `very_active` |
  | `six_seven` | `extremely_active` |

  Justificativa: Maratonista com 0-1 treino/semana ainda é provavelmente mais ativo que sedentário (está em fase de pausa, não é inativo por natureza), mas para cálculos de gasto calórico, `moderately_active` é mais conservador e preciso para o momento atual.

---

## 12 · Notas de design (decisões não-óbvias)

### Por que NÃO pergunto "qual seu objetivo de tempo?"

O bloco universal já coleta `goal` com campo livre. Além disso, a pergunta "qual seu tempo-alvo?" gera respostas aspiracionais, não realistas. O VDOT calculado a partir de prova recente (Q5/Q6) dá uma projeção científica — mais útil que o desejo do corredor. Se ele quiser dizer "quero sub-3:30", usa o campo livre.

### Por que a experiência (Q2) não é segmentação

Considerei usar experiência (0 / 1-3 / 4+) como segmentação principal. Descartei porque a fase de treino (Q1) muda o relatório de forma mais substancial. Um novato em taper e um veterano em taper precisam de relatórios mais parecidos entre si do que um novato em base e um novato em taper. Experiência modula tom; fase modula conteúdo.

### Por que Q6 aceita qualquer distância (não só maratona)

Muitos maratonistas nunca correram 42K ou estão se preparando para a primeira. Exigir "tempo de maratona" excluiria esses. Um tempo de 10K ou 21K produz projeção de maratona igualmente válida via VDOT (com margem maior para distâncias mais curtas, documentado no copy).

### Por que branches compartilham base+construção

Base e construção são fases distintas no treinamento, mas o arco narrativo do relatório é essencialmente o mesmo: "como se preparar para a maratona". A diferença está na ênfase (volume vs intensidade), que a IA resolve via `training_phase` sem branch separado. Criar dois branches quase idênticos viola o anti-pattern #3.

### Por que diabetes NÃO é safety trigger

Diabetes tipo 1 e tipo 2 controlados são compatíveis com maratona (inclusive há maratonistas diabéticos de alto nível). A condição exige ajuste de nutrição em prova (monitorar glicemia, ajustar géis), não bloqueio do relatório. Safety trigger para diabetes seria paternalista e incorreto.

### Por que "lesão ativa" NÃO é safety trigger

Lesão musculoesquelética (joelho, canela, pé) é extremamente comum em maratonistas (52% ao ano). Bloquear o relatório para metade do público seria inútil. A lesão ajusta recomendações de volume e direciona ao profissional de saúde, mas não é emergência médica.

---

## 13 · Pendências

1. **Lib de VDOT:** Identificar lib JavaScript/TypeScript que implemente o cálculo de VDOT de Jack Daniels com precisão. Candidatas: `@kissmybutton/vdot`, `daniels-running-calculator`, `running-tools`. Se não houver lib confiável, implementar as fórmulas originais (Daniels 2014, equações publicadas).

2. **Formato do campo de tempo (Q6):** Decidir se é campo de texto livre (ex: "3:52:30") com parsing, ou dropdowns de H/M/S. Texto livre é mais rápido no celular mas parsing é frágil. Sugestão: input com máscara HH:MM:SS.

3. **Projeção de maratona a partir de 5K:** A projeção VDOT de 5K→42K tem margem de erro maior que 21K→42K (a correlação cai com a diferença de distância). Documentar no relatório a margem quando a distância base for 5K.

4. **Carb-loading e nutrição de prova:** As recomendações do Pilar 2 são baseadas em guidelines ACSM (30-60g CHO/h). Para público avançado, guidelines mais recentes sugerem até 90-120g/h com treino gastrointestinal. Decidir se inclui essa faixa superior ou mantém conservador.

5. **Teste ergométrico:** A recomendação de teste ergométrico para todo maratonista (mesmo sem safety trigger) é consenso médico no Brasil (SBMEE). Avaliar se inclui como nota padrão ou apenas para safety.

6. **Score de risco de lesão (8.1):** Não existe fórmula publicada consolidada. Proposto como heurística proprietária baseada nos fatores de risco identificados por Lopes et al. (2021). Precisa de validação com fisioterapeuta esportivo ou profissional de educação física.

---

## 14 · Fontes citadas

1. Daniels, J. (2014). _Daniels' Running Formula_, 3rd ed. Human Kinetics. — Base para VDOT, zonas de treino, periodização.
2. Pfitzinger, P. & Douglas, S. (2019). _Advanced Marathoning_, 3rd ed. Human Kinetics. — Volume semanal, progressão de longão, estrutura de ciclo.
3. Rapoport, B.I. (2010). "Metabolic Factors Limiting Performance in Marathon Runners." _PLoS Computational Biology_, 6(10). — Modelo metabólico de depleção de glicogênio.
4. Smyth, B. (2021). "How recreational marathon runners hit the wall: A large-scale data analysis of late-race pacing collapse in the marathon." _PLoS ONE_, 16(5). — 40% sofrem colapso de pacing, correlação com saída rápida.
5. Lopes, A.D. et al. (2021). "A systematic review of running-related musculoskeletal injuries in runners." _Journal of Sport and Health Science_, 10(6). — Taxas e tipos de lesão.
6. Seiler, S. (2010). "What is best practice for training intensity and duration distribution in endurance athletes?" _International Journal of Sports Physiology and Performance_, 5(3). — Modelo polarizado 80/20.
7. Noakes, T. (2003). _Lore of Running_, 4th ed. Human Kinetics. — Central governor model, ciência da fadiga.
8. American College of Sports Medicine (2016). "Nutrition and Athletic Performance." _Joint Position Statement_. — Guidelines de carb/hora em endurance.
9. Contra Relógio (2025). "Ranking de maratonas brasileiras 2025." — Dados de participação e crescimento no Brasil.
10. Kamel Turismo (2025). "Tempo médio de maratona." — Distribuição de tempos de conclusão Brasil.

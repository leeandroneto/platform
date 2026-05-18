# Research · Especialidade 19 · Gravel

## 0 · Metadados

- **Numero:** 19
- **Modality:** ciclismo
- **Pasta:** `ciclismo/19-gravel/`
- **Plano:** pro
- **Validacao clinica:** Opcional
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. Pesquisa Perfil do Atleta Brasileiro — Ticket Sports / Bikemagazine (2025)
  2. UCI Gravel World Series Camboriu — resultados e reportagem (Bikemagazine, mar/2025)
  3. Gravel Brasil Ride Bonito — regulamento e perfil (brasilride.com.br, 2025)
  4. Coggan, A. & Allen, H. — _Training and Racing with a Power Meter_ (zonas de potencia)
  5. Jeukendrup, A. — Carbohydrate intake during exercise (Sports Medicine, 2014)
  6. ACSM Position Stand — Fluid replacement during exercise (Medicine & Science in Sports, 2007)
  7. BikeRadar / Wahoo — Gravel training guides (2024-2025)
  8. Grand View Research — Brazil bicycle market outlook (2026-2033)

## 1 · Quem e esse publico no Brasil

### Perfil demografico

- **Faixa etaria:** 30-50 anos (nucleo 35-45). Idade media do ciclista brasileiro esportivo e 42 anos.
- **Genero:** ~80-85% masculino, participacao feminina crescendo (15-20%).
- **Contexto socioeconomico:** Classe A/B. Gravel bikes custam R$8.000-R$40.000+. ~49% dos ciclistas esportivos BR tem renda acima de 5 salarios minimos. E nicho de alto ticket.
- **Background:** a maioria NAO e iniciante. Vem do road (busca aventura fora do asfalto) ou do MTB (busca eficiencia e velocidade). Poucos chegam sem experiencia previa em ciclismo.

### Ordem de grandeza

Mercado **pequeno mas em crescimento acelerado**. Estimativa de 5.000-15.000 praticantes ativos no Brasil. O UCI Gravel World Series em Camboriu (mar/2025) reuniu 400+ ciclistas de 11 paises na primeira edicao. A Brasil Ride agora tem categoria gravel dedicada. O mercado global de gravel bikes cresce ~8% CAGR.

### Onde estao online

- **Instagram:** @mundociclismo (572K), @ucigravelbrasil, @brasilride, perfis regionais
- **Strava:** clubes regionais de gravel (SP, SC, MG, RJ). Strava e a rede social primaria desse publico.
- **WhatsApp:** grupos locais por cidade — principal canal de organizacao de pedais
- **YouTube:** Velodrom Cycling, canais de review de gravel bikes, vlogs de provas
- **Podcasts:** Gregario Cycling, Bikehub Podcast, Vem Na Roda

### Linguagem que usam

- **Pedal** (o ato), **giro** (treino/passeio)
- **Estradao** (estrada de terra larga — cenario classico do gravel BR)
- **Cascalho** (gravel literal), **"socador de cascalho"** (autodescricao humoristica)
- **Bikepacking** (mantido em ingles)
- **Gravel bike** (nunca "bicicleta de cascalho")
- **Drop bar**, **tubeless**, **pneu largo**
- **D+** (desnivel positivo), **altimetria**
- **Bonk** (quebrar de fome/fadiga), **pelotao**
- **"O asfalto acaba, a vida comeca"** (mantra da comunidade)

### O que ofende ou afasta

- Tratar gravel como "road de segunda" ou "MTB light" — praticantes tem identidade propria
- Tom de aula/palestra ("voce precisa entender que...") — publico e experiente, ja pedala
- Formularizacao generica — esse publico preenche planilhas no TrainingPeaks, espera profundidade
- Foco excessivo em estetica/peso corporal — a motivacao e performance e aventura, nao aparencia
- Ignorar a dimensao de aventura/liberdade — gravel e tanto esporte quanto estilo de vida

### Dor mais comum

**Falta de planos de treino especificos para gravel.** Coaches de road nao entendem a demanda de terreno misto; coaches de MTB focam em tecnica que nao se aplica. O graveleiro fica no meio, improvisando periodizacao. Segundo problema: **nutricao em rides longos** (4-8h em estradao sem apoio).

## 2 · Decisao de escopo

### Este template vai cobrir:

- Ciclistas que ja pedalam (road, MTB ou gravel) e querem orientacao especifica para gravel
- Objetivos: preparar para evento gravel, melhorar performance em terreno misto, transicionar de road/MTB para gravel
- Distancias de 50km a 200km+ (fondos/granfondos, stage races, bikepacking de 1-2 dias)
- Praticantes recreativos serios ate competidores amadores (nao elite UCI)

### Este template NAO vai cobrir:

- Bikepacking multi-dia (logistica, equipamento, rotas — merece template proprio ou feature futura)
- Ciclistas sem experiencia previa (esses vao para `16-recreativo`)
- Elite UCI profissional (periodizacao ultra-especifica com equipe de suporte)
- Randonneur/Audax puro (publico sobreposto mas com regras e cultura distintas)

## 3 · Motores escolhidos

### Decisao narrativa

O graveleiro brasileiro tipico ja treina — a questao nao e "voce faz exercicio?" mas sim "como voce treina e onde esta travado?". Isso torna Motor 1 (contexto) menos sobre nivel basico e mais sobre **origem ciclistica** (road vs MTB vs gravel nativo), que muda radicalmente as recomendacoes.

**Motores considerados e decisao:**

| Motor                       | Decisao                   | Motivo                                                                                                     |
| --------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Motor 6 (Identidade/Fase)   | **INCLUIDO como Motor 1** | Background ciclistico (road/MTB/gravel) e a segmentacao mais impactante — muda bike fit, treino, linguagem |
| Motor 2 (Gargalo)           | **INCLUIDO**              | Essencial — identifica o que trava resultado                                                               |
| Motor 4 (Comportamento)     | **INCLUIDO**              | Volume semanal real define capacidade de carga e tipo de periodizacao                                      |
| Motor 7 (Metricas)          | **INCLUIDO**              | Gravel depende muito de ferramentas (potenciometro, GPS, FC). Quem tem, recebe recomendacoes mais precisas |
| Motor 5 (Ambiente)          | **INCLUIDO**              | Tipo de terreno predominante muda tudo (estradao vs trilha vs misto)                                       |
| Motor 8 (Safety)            | **INCLUIDO**              | Obrigatorio                                                                                                |
| Motor 3 (Nivel)             | **DESCARTADO**            | Background (Motor 6) ja captura maturidade. Pergunta separada de nivel seria redundante                    |
| Motor 1 (Contexto generico) | **DESCARTADO**            | Absorvido pelo Motor 6 (background) e Motor 4 (volume)                                                     |

**Total: 6 motores → 7 perguntas especificas** (dentro do alvo 5-8).

### Lista final

1. **Segmentacao (Motor 6 — Identidade)** → `cycling_background` — De onde o ciclista vem (road/MTB/gravel)
2. **Gargalo (Motor 2)** → `main_bottleneck` — O que mais trava o resultado no gravel
3. **Comportamento (Motor 4)** → `weekly_volume` — Volume real de treino semanal
4. **Metricas (Motor 7)** → `training_tools` — Quais ferramentas de medicao usa
5. **Metricas condicional (Motor 7)** → `ftp_value` — FTP numerico (so aparece se tem potenciometro)
6. **Ambiente (Motor 5)** → `terrain_profile` — Tipo de terreno predominante nos treinos/provas
7. **Safety (Motor 8)** → `health_conditions` — Condicoes de saude

## 4 · Perguntas e opcoes

### Q1 · `cycling_background` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Qual e sua historia no ciclismo?"
**Helper:** "Isso ajuda a calibrar as recomendacoes pro seu nivel de experiencia"
**Required:** sim
**Visibility:** sempre
**Segmentacao:** sim (abre branches)
**depthRequired:** quick

**Opcoes:**

- **`from_road`** — "Venho do speed/road e quero explorar o gravel"
  - Safety trigger? nao

- **`from_mtb`** — "Venho do MTB e migrei pro gravel"
  - Safety trigger? nao

- **`gravel_native`** — "Comecei direto no gravel"
  - Safety trigger? nao

**Justificativa da pergunta:** O background ciclistico e o maior preditor de quais adaptacoes o atleta precisa. Um roadie forte tem potencia mas nao tem bike handling; um MTBiker tem tecnica mas precisa de eficiencia aerobia. A recomendacao muda substancialmente. Descartei "ha quanto tempo pedala gravel?" porque o background explica mais com menos friccao.

**Justificativa das opcoes:** Essas 3 origens cobrem ~95% dos praticantes. "Comecei no spinning/indoor" e raro e se encaixa em `gravel_native`. Triatletas que migram se encaixam em `from_road`.

---

### Q2 · `main_bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais limita seu desempenho no gravel hoje?"
**Helper:** "Escolha o que mais pesa — vamos tratar os outros no relatorio tambem"
**Required:** sim
**Visibility:** sempre
**Segmentacao:** nao
**depthRequired:** standard

**Opcoes:**

- **`endurance_fade`** — "Perco forca na segunda metade dos pedais longos"
  - Safety trigger? nao

- **`nutrition_hydration`** — "Nao sei o que comer/beber em pedais de 3h+"
  - Safety trigger? nao

- **`pacing_terrain`** — "Nao consigo dosar esforco no terreno misto"
  - Safety trigger? nao

- **`bike_fit_comfort`** — "Sinto dor ou desconforto em pedais longos (lombar, pescoco, maos)"
  - Safety trigger? nao

- **`consistency`** — "Treino irregular — nao consigo manter uma rotina"
  - Safety trigger? nao

**Justificativa da pergunta:** Esses 5 gargalos cobrem os problemas reais que graveleiros brasileiros relatam em comunidades e consultorias. Descartei "equipamento/bike" porque nao e escopo de treino — e decisao de compra. Descartei "motivacao" porque esse publico ja e motivado (investe R$10k+ em bike).

**Justificativa das opcoes:** Cada opcao mapeia para uma estrategia diferente no relatorio. `endurance_fade` → periodizacao zona 2 + nutricao. `nutrition_hydration` → protocolo carb/h + hidratacao. `pacing_terrain` → estrategia de esforco variavel. `bike_fit_comfort` → checklist de ajuste. `consistency` → estruturacao de rotina. Sem sobreposicao.

---

### Q3 · `weekly_volume` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Na ultima semana, quantas horas voce pedalou no total?"
**Helper:** "Conte tudo: treino, commute, pedal recreativo"
**Required:** sim
**Visibility:** sempre
**Segmentacao:** nao
**depthRequired:** standard

**Opcoes:**

- **`under_3h`** — "Menos de 3 horas"
  - Safety trigger? nao

- **`3_to_6h`** — "3 a 6 horas"
  - Safety trigger? nao

- **`6_to_10h`** — "6 a 10 horas"
  - Safety trigger? nao

- **`over_10h`** — "Mais de 10 horas"
  - Safety trigger? nao

**Justificativa da pergunta:** Volume semanal real (nao planejado) e o dado mais util pra calibrar recomendacoes de carga. Pergunto sobre a ultima semana pra capturar comportamento real, nao intencao. Descartei "quantos treinos por semana?" porque 3 treinos de 1h e muito diferente de 3 treinos de 3h — horas e mais preciso.

**Justificativa das opcoes:** As faixas refletem os patamares de adaptacao fisiologica: <3h (construcao de base), 3-6h (manutencao recreativa), 6-10h (otimizacao), >10h (gestao de fadiga). Sem sobreposicao, respondivel em 3 segundos.

---

### Q4 · `training_tools` _(Motor 7 — Metricas/Ferramentas)_

**Type:** `multiple_choice`
**Label (client-facing):** "Quais ferramentas voce usa no treino?"
**Helper:** "Marque todas que se aplicam"
**Required:** sim
**Visibility:** sempre
**Segmentacao:** nao
**depthRequired:** standard
**maxSelections:** 5

**Opcoes:**

- **`power_meter`** — "Potenciometro (medidor de potencia)"
  - Safety trigger? nao

- **`hr_monitor`** — "Monitor cardiaco (cinta ou relogio)"
  - Safety trigger? nao

- **`gps_computer`** — "Ciclocomputador com GPS (Garmin, Wahoo, etc.)"
  - Safety trigger? nao

- **`indoor_trainer`** — "Rolo/trainer (indoor)"
  - Safety trigger? nao

- **`none`** — "Nenhuma ferramenta — pedalo por sensacao"
  - Safety trigger? nao

**Justificativa da pergunta:** As ferramentas disponiveis determinam o nivel de precisao das recomendacoes. Um graveleiro com potenciometro recebe zonas Coggan e TSS targets; um sem ferramentas recebe orientacao por RPE. Essa pergunta e multiple_choice porque combinacoes sao comuns (potenciometro + GPS, por exemplo). Descartei perguntas separadas por ferramenta (5 perguntas sim/nao) porque uma so com multipla selecao captura tudo sem friccao.

---

### Q5 · `ftp_value` _(Motor 7 — Metricas condicional)_

**Type:** `number`
**Label (client-facing):** "Qual seu FTP atual (em watts)?"
**Helper:** "Se nao sabe o valor exato, sua melhor estimativa. Valor medio: 180-280W."
**Required:** nao
**Visibility:** `if training_tools contains power_meter`
**Segmentacao:** nao
**depthRequired:** standard

**Justificativa da pergunta:** FTP e o dado mais valioso pra calcular zonas de treino, TSS, e metas de pacing. So aparece pra quem tem potenciometro — sem potenciometro, o FTP e irrelevante. Descartei pedir FC maxima (impreciso, a maioria chuta) e VO2max do relogio (algoritmo variavel por fabricante). FTP e o numero que ciclistas treinados realmente conhecem.

---

### Q6 · `terrain_profile` _(Motor 5 — Ambiente)_

**Type:** `single_choice`
**Label (client-facing):** "Qual terreno predomina nos seus pedais de gravel?"
**Helper:** "Pense nos ultimos 3 meses — onde voce mais pedalou?"
**Required:** sim
**Visibility:** sempre
**Segmentacao:** nao
**depthRequired:** standard

**Opcoes:**

- **`flat_dirt`** — "Estradao plano ou ondulado (terra batida, cascalho)"
  - Safety trigger? nao

- **`hilly_mixed`** — "Misto com subidas e descidas (serra, morros)"
  - Safety trigger? nao

- **`technical_trail`** — "Trilhas e singletrack (terreno tecnico)"
  - Safety trigger? nao

- **`varied`** — "Varia muito — cada pedal e diferente"
  - Safety trigger? nao

**Justificativa da pergunta:** O terreno predominante muda radicalmente a prescricao de treino, setup de bike, e riscos. Um graveleiro de estradao plano treina diferente de um que roda serra tecnica. Descartei perguntar distancia media porque distancia sem perfil de terreno e pouco informativa (100km plano ≠ 100km de serra).

---

### Q7 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Voce tem alguma condicao de saude que devemos considerar?"
**Helper:** "Marque todas que se aplicam — isso ajuda a personalizar as recomendacoes com seguranca"
**Required:** sim
**Visibility:** sempre
**Segmentacao:** nao
**depthRequired:** quick
**maxSelections:** 4

**Opcoes:**

- **`cardiac`** — "Condicao cardiaca (arritmia, cardiopatia, historico de evento cardiovascular)"
  - Safety trigger? sim (reason: "Condicao cardiaca em esporte de endurance com esforcos prolongados em locais remotos exige liberacao e acompanhamento cardiologico presencial")

- **`joint_injury`** — "Lesao articular ativa (joelho, quadril, tornozelo)"
  - Safety trigger? nao (lesao articular ativa nao e emergencia medica, mas o copy orienta buscar fisio)

- **`respiratory`** — "Condicao respiratoria (asma severa, DPOC)"
  - Safety trigger? sim (reason: "Condicao respiratoria severa em esforcos prolongados e remotos exige liberacao e acompanhamento medico")

- **`diabetes`** — "Diabetes tipo 1 ou 2 em uso de medicacao"
  - Safety trigger? sim (reason: "Diabetes com medicacao em esforco prolongado e remoto exige ajuste medico de dosagem e plano de contingencia")

- **`none`** — "Nenhuma condicao — estou liberado pra treinar"
  - Safety trigger? nao

**Justificativa da pergunta:** Safety e obrigatorio. Em ciclismo de endurance, as condicoes que realmente mudam o risco sao cardiacas (morte subita em esforco), respiratorias (crise em local remoto), e diabetes (hipoglicemia isolado). Descartei hipertensao controlada (nao e safety, ajusta tom apenas) e dor cronica (nao e emergencia). O formato multiple_choice permite combinacoes.

**Justificativa das opcoes:** 3 condicoes com safety trigger real (cardiaca, respiratoria, diabetes) + 1 sem trigger (articular — relevante pro relatorio mas nao emergencial) + "nenhuma". Cobrem os cenarios clinicamente significativos para endurance outdoor.

## 5 · Branches

### Branch: `Roadie em Transicao` (trigger: `cycling_background == from_road`)

- **Tom geral:** Respeitar a base de potencia e eficiencia que o roadie ja tem. Focar nas adaptacoes especificas: posicao no drop bar off-road, pressao de pneu, pacing variavel, resistencia a vibracao, nutricao autonoma.
- **pillarGuidance:** "O aluno ja conhece treino estruturado — nao ensine o basico. Foque nas diferencas: terreno muda gestao de esforco, posicao muda conforto, e autossuficiencia muda planejamento."
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Enfatizar comparacao road vs gravel nas metricas (ex: "seu FTP no gravel sera ~5-10% menor que no road devido a rolling resistance e posicao")
- **Narrative arc override:** Arco de "adaptacao de expertise" — voce ja sabe pedalar, agora vai aprender a pedalar em terreno que nao perdoa.

**Justificativa:** Roadies sao o maior grupo migrando pro gravel. Suas expectativas sao diferentes (esperam numeros precisos, comparacoes com road) e seus problemas sao especificos (dor no tronco pelo terreno, frustacao com queda de potencia). Sem esse branch, o relatorio pareceria generico demais pra um ciclista experiente.

### Branch: `MTBiker Expandindo` (trigger: `cycling_background == from_mtb`)

- **Tom geral:** Valorizar a experiencia tecnica e o conforto em terreno. Focar no que muda: eficiencia aerobia, cadencia mais alta, posicao de drop bar, sustentacao de esforco por horas (vs. intensidade curta do MTB).
- **pillarGuidance:** "O aluno sabe lidar com terreno — nao foque em tecnica. Foque em eficiencia: pedal redondo, cadencia 85-95rpm, zona 2 longa, posicao aerodinamica nos trechos rapidos."
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Enfatizar construcao aerobia (zona 2) e eficiencia mecanica (cadencia). Menos enfase em tecnica de terreno.
- **Narrative arc override:** Arco de "eficiencia sobre resistencia" — voce ja aguenta o terreno, agora vai aprender a ser eficiente nele por horas.

**Justificativa:** MTBikers que migram pro gravel tipicamente tem tecnica de sobra mas falta base aerobia sustentada. Seu treino de MTB era intenso/curto; gravel pede longo/moderado. Sem esse branch, o relatorio faria recomendacoes de tecnica que o MTBiker ja domina e ignoraria a lacuna real.

### Branch: `Gravel Nativo` (trigger: `cycling_background == gravel_native`)

- **Tom geral:** Acolhedor, sem assumir conhecimento previo de road ou MTB. Construir do zero: base aerobia, tecnica de terreno, mecanica basica, nutricao, planejamento de rota.
- **pillarGuidance:** "O aluno nao tem comparacao com outra disciplina. Ensine os fundamentos do gravel como esporte completo: posicao, pedalada, terreno, nutricao, recuperacao. Use linguagem acessivel mas nao condescendente."
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Focar em metricas simples e acionaveis (FC se tiver, RPE se nao). Menos enfase em zonas de potencia avancadas.
- **Narrative arc override:** Arco de "construcao de fundamentos" — voce esta no comeco certo, vamos montar uma base que sustente crescimento.

**Justificativa:** ~15-20% dos graveleiros comecaram direto no gravel pos-pandemia. Nao tem as referencias que roadies e MTBikers trazem. Sem esse branch, o relatorio assumiria conhecimento que nao existe.

## 6 · Safety triggers

| Questao             | Opcoes        | Reason (clinico)                                                                                                   | Efeito no relatorio                                                                                      |
| ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `health_conditions` | `cardiac`     | Risco de evento cardiovascular em esforco prolongado, agravado por ambiente remoto sem acesso rapido a atendimento | Macros de intensidade omitidas. Timeline omitida. SafetyNote aparece. IA orienta liberacao cardiologica. |
| `health_conditions` | `respiratory` | Crise respiratoria severa em esforco prolongado sem acesso a medicacao de emergencia ou atendimento                | Zonas de intensidade conservadoras. SafetyNote aparece. IA enfatiza levar medicacao de resgate.          |
| `health_conditions` | `diabetes`    | Hipoglicemia em esforco de 3-6h sem acesso a alimento ou atendimento. Ajuste de medicacao requer medico.           | Nutricao adaptada com alertas. SafetyNote aparece. Timeline ajustada. IA nao sugere ajuste de medicacao. |

**safetyTemplate:**

- **Title:** "Sua seguranca vem primeiro"
- **Body:** "Identificamos uma condicao de saude que merece atencao especial no contexto do gravel — esforcos prolongados em locais remotos exigem planejamento extra. As recomendacoes deste relatorio foram ajustadas para serem mais conservadoras, mas **nao substituem avaliacao medica presencial**. Antes de intensificar o treino ou participar de provas, converse com seu medico sobre a pratica de ciclismo de endurance. Seu profissional [profissional_nome] pode trabalhar em conjunto com sua equipe medica para montar um plano seguro e eficiente."

## 7 · Metricas para o ALUNO (relatorio)

### 7.1 · `estimated_ftp_zones`

- **O que e:** Zonas de potencia baseadas no FTP (7 zonas Coggan) ou zonas de FC equivalentes
- **Por que aparece para o aluno:** Saber em que zona treinar e a informacao mais acionavel possivel — transforma "pedalar mais" em "pedalar nessa faixa de esforco"
- **Calculo:** Zonas Coggan (% do FTP). Se sem potenciometro, zonas de FC por Karvonen ou %FCmax. FTP estimado se nao fornecido: pode usar formula de estimativa por peso/idade/volume como proxy grosseiro, ou omitir e trabalhar com RPE.
- **Referencia:** Coggan, A. & Allen, H. — _Training and Racing with a Power Meter_
- **Visualizacao proposta:** `zone_table` — tabela com 7 zonas, cada uma com faixa de watts (ou FC), nome da zona, e descricao em linguagem simples ("Conversa facil" → "Limite maximo"). Cores do verde ao vermelho.
- **Placeholder:** `[zona_2_min]`, `[zona_2_max]`, `[ftp_watts]`

### 7.2 · `nutrition_target`

- **O que e:** Meta de carboidrato por hora (g/h) e liquido por hora (ml/h) para pedais de endurance
- **Por que aparece para o aluno:** Nutricao e o fator mais subestimado e mais facil de corrigir em gravel. Numero concreto → acao imediata.
- **Calculo:** Carboidrato: 60-90g/h (Jeukendrup guideline), ajustado por peso e duracao. Liquido: 500-750ml/h (ACSM), ajustado por clima estimado.
- **Referencia:** Jeukendrup, A. — Sports Medicine, 2014; ACSM Fluid Replacement, 2007
- **Visualizacao proposta:** `card_comparison` — card com 3 numeros grandes: carb/h, liquido/h, calorias/h. Cores suaves. Icone de comida/agua.
- **Placeholder:** `[carb_per_hour]`, `[fluid_per_hour]`, `[cal_per_hour]`

### 7.3 · `weekly_volume_target`

- **O que e:** Volume semanal recomendado (horas) com distribuicao sugerida por dia
- **Por que aparece para o aluno:** Transforma "preciso treinar mais" em "pedalar X horas distribuidas assim". Pratico e imediato.
- **Calculo:** Baseado no volume atual (Q3) + principio de progressao de 10%/semana + objetivo declarado. Sem formula cientifica unica — logica de periodizacao basica.
- **Referencia:** Principio de progressao gradual (ACSM Guidelines for Exercise Testing, 11th ed.)
- **Visualizacao proposta:** `card` com numero grande (horas/semana) + mini distribuicao (ex: "2x curto na semana + 1x longo no weekend"). Barra de progresso mostrando volume atual vs recomendado.
- **Placeholder:** `[volume_semanal_h]`, `[sessao_curta_min]`, `[sessao_longa_h]`

### 7.4 · `readiness_score`

- **O que e:** Score 0-100 de prontidao para uma prova de gravel tipica (80-120km), baseado nas respostas do formulario
- **Por que aparece para o aluno:** Gamificacao leve — "onde voce esta" numa escala visual. Engajante e motivacional sem ser vazio.
- **Calculo:** Score composto: volume semanal (30% peso) + background ciclistico (20%) + ferramentas de medicao (15%) + ausencia de gargalo critico (20%) + ausencia de condicao medica (15%). Heuristica, nao formula cientifica — documentar como tal.
- **Referencia:** Heuristica de produto (nao ciencia). Inspirado em readiness scores de Whoop/Oura adaptado pro contexto.
- **Visualizacao proposta:** `gauge_radial` — gauge semicircular com 3 faixas: Construindo (0-40, amarelo), Preparado (41-70, verde claro), Pronto (71-100, verde). Valor central grande. Frase curta abaixo ("Voce esta construindo uma base solida" / "Pronto pra encarar!").
- **Placeholder:** `[readiness_score]`, `[readiness_label]`

### 7.5 · `tire_pressure_suggestion`

- **O que e:** Sugestao de pressao de pneu (psi) baseada no peso + terreno
- **Por que aparece para o aluno:** Pressao de pneu e a pergunta #1 em grupos de gravel no WhatsApp. Numero concreto com justificativa = valor imediato.
- **Calculo:** Formula de SILCA ou tabela baseada em peso do ciclista + largura do pneu + tipo de terreno. Tabelas publicadas por fabricantes (Rene Herse, SILCA).
- **Referencia:** SILCA Tire Pressure Calculator methodology; Rene Herse pressure guidelines
- **Visualizacao proposta:** `card` com numero grande (F: XX psi / R: XX psi) + icone de terreno. Nota explicativa curta.
- **Placeholder:** `[pressure_front_psi]`, `[pressure_rear_psi]`

## 8 · Metricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `training_load_classification`

- **O que e:** Classificacao do volume de treino atual vs recomendado para o objetivo (sub-treinado / adequado / sobrecarregado)
- **Por que importa para o PT:** Identifica rapidamente se o lead esta treinando pouco (precisa de plano progressivo), adequadamente (precisa de otimizacao), ou demais (risco de overtraining). Prioriza a primeira conversa.
- **Calculo:** Comparacao volume declarado (Q3) vs benchmarks da literatura para nivel de objetivo.
- **Visualizacao proposta:** `scorecard_semaforo` — verde/amarelo/vermelho com label.

### 8.2 · `bottleneck_diagnostic`

- **O que e:** O gargalo declarado pelo lead + classificacao cruzada com volume e background
- **Por que importa para o PT:** Permite ao profissional preparar a conversa inicial. "Esse lead tem queixa de fadiga na segunda metade mas treina <3h/semana — o problema e volume, nao nutricao."
- **Calculo:** Cruzamento Q2 (gargalo) × Q3 (volume) × Q1 (background). Logica de regras, nao formula.
- **Visualizacao proposta:** `card_diagnostico` — gargalo principal com contexto (1-2 frases) + flag de atencao se houver inconsistencia.

### 8.3 · `equipment_profile`

- **O que e:** Resumo de ferramentas que o lead usa (potenciometro, FC, GPS, indoor)
- **Por que importa para o PT:** Define como o profissional vai comunicar treinos — por watts, por FC, por RPE. Evita enviar planilha com zonas de potencia pra quem nao tem potenciometro.
- **Calculo:** Direto das respostas de Q4.
- **Visualizacao proposta:** `checklist_icons` — lista com icones de cada ferramenta (check verde / X cinza).

### 8.4 · `ftp_watts_per_kg`

- **O que e:** FTP relativo (W/kg) — FTP dividido pelo peso corporal
- **Por que importa para o PT:** Benchmark universal de performance em ciclismo. Permite comparar atletas independente do peso. Classifica o nivel real (1.5 W/kg = recreativo, 3.5+ = competitivo).
- **Calculo:** `ftp_value / peso_kg`. Se FTP nao fornecido, omitir (nao estimar).
- **Referencia:** Coggan classification chart (Cat 5 a World Tour)
- **Visualizacao proposta:** `gauge` com faixas por classificacao Coggan (Untrained → World Class).

### 8.5 · `risk_flags`

- **O que e:** Lista de flags de atencao baseada nas respostas (condicao medica + gargalo + volume)
- **Por que importa para o PT:** Sumario rapido do que precisa de atencao antes de prescrever. Ex: "condicao cardiaca + volume >10h = risco alto", "dor articular + terreno tecnico = ajustar bike fit primeiro".
- **Calculo:** Logica de regras cruzando Q7 × Q2 × Q3 × Q6.
- **Visualizacao proposta:** `alert_list` — lista com icones de severidade (vermelho / amarelo / verde) e frases curtas.

## 9 · Pilares do relatorio

### Pilar 1 · Pedalada Inteligente

- **Subtitle:** "Treine na zona certa, no terreno certo"
- **Conceito central:** A base do desempenho em gravel e aerobia — nao potencia maxima, nao velocidade. Zona 2 longa e o motor do gravel. A estrategia de pacing muda com o terreno: constante no estradao, variavel na serra, conservadora na trilha.
- **Evidencia cientifica:** Modelo polarizado de treino (Seiler, 2010) — 80% zona baixa, 20% alta. Adaptacao a endurance requer estimulo prolongado em intensidade moderada.
- **Placeholders:** `[zona_2_min]`, `[zona_2_max]`, `[volume_semanal_h]`, `[sessao_longa_h]`
- **Exemplo de texto popular (60-80 palavras):** "A maioria dos graveleiros treina rapido demais nos dias faceis e devagar demais nos dias dificeis. O resultado? Fadiga acumulada sem adaptacao real. Seu corpo precisa de horas em intensidade moderada — aquela conversa que flui, frequencia cardiaca estavel, sem ofegar. Esse e o motor do gravel. Reserve [sessao_longa_h]h no fim de semana pra pedalar em zona 2, e os ganhos vao aparecer em 4-6 semanas."
- **Exemplo de texto tecnico (30-40 palavras):** "Periodizacao polarizada (Seiler, 2010): 80% do volume em zona 2 (FTP 56-75%), 20% em zona 4-5. Priorize sessoes longas em terreno similar ao da prova-alvo. Progressao: +10%/semana de volume em zona 2."

### Pilar 2 · Combustivel e Hidratacao

- **Subtitle:** "O gravel nao perdoa quem subestima nutricao"
- **Conceito central:** Em esforcos de 3h+, nutricao adequada e a diferenca entre terminar forte e quebrar. No gravel, sem apoio externo, o planejamento e tudo. Carboidrato por hora, liquido por hora, e pratica no treino sao os 3 eixos.
- **Evidencia cientifica:** Jeukendrup (2014) — ingestao de 60-90g carb/h em endurance. ACSM (2007) — reposicao hidrica individualizada.
- **Placeholders:** `[carb_per_hour]`, `[fluid_per_hour]`, `[cal_per_hour]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Aquele momento que as pernas simplesmente param de responder? Quase nunca e falta de condicionamento — e falta de combustivel. Seu corpo queima [cal_per_hour] calorias por hora pedalando gravel, e se voce nao repoe, ele desliga. A regra e simples: [carb_per_hour]g de carboidrato por hora (gel, banana, rapadura, o que funcionar pra voce) e [fluid_per_hour]ml de liquido. Treine isso nos pedais de semana — nao teste nada novo na prova."
- **Exemplo de texto tecnico (30-40 palavras):** "Ingestao alvo: [carb_per_hour]g CHO/h (mix glicose:frutose 2:1 para >60g/h). Hidratacao: [fluid_per_hour]ml/h, contendo 500-700mg Na/L. Treinar tolerancia gastrointestinal nas sessoes longas — adaptacao leva 4-6 semanas."

### Pilar 3 · Corpo Preparado

- **Subtitle:** "Resiliencia alem do pedal"
- **Conceito central:** Gravel estressa o corpo inteiro — nao so as pernas. Tronco, pescoco, maos e core absorvem impacto por horas. Trabalho complementar de forca e mobilidade previne dor, lesao e fadiga prematura. Bike fit adequado e pre-requisito.
- **Evidencia cientifica:** Sayers & Clover (2012) — analise ergonomica em ciclismo off-road. Prevalencia de dor lombar e neuropatia ulnar em ciclistas de longa distancia.
- **Placeholders:** `[profissional_nome]`, `[pressure_front_psi]`, `[pressure_rear_psi]`
- **Exemplo de texto popular (60-80 palavras):** "Gravel nao e so perna — e corpo inteiro. Se depois de 3 horas suas maos formigam, o pescoco trava e a lombar grita, nao e fraqueza: e falta de preparo do tronco pro impacto. 15 minutos de forca 3x por semana mudam tudo: prancha, remada, extensao de quadril. E antes de mais nada, confira o ajuste da sua bike — no gravel, 5mm de reach fazem diferenca entre conforto e sofrimento."
- **Exemplo de texto tecnico (30-40 palavras):** "Trabalho complementar: core anti-extensao (prancha), forca de tronco (remada), estabilidade escapular. 3x/semana, 15-20min. Bike fit: verificar stack/reach para posicao gravel (2-3cm mais alto que road). Pressao sugerida: F [pressure_front_psi]psi / R [pressure_rear_psi]psi."

## 10 · AI Context (instrucoes para a IA que vai gerar o relatorio)

- **specialtyDescription:** "Ciclismo gravel — modalidade de ciclismo em terreno misto (estradas de terra, cascalho, trilhas leves) que exige resistencia aerobia, autossuficiencia e adaptabilidade. O publico e predominantemente masculino, 30-50 anos, classe A/B, com experiencia previa em road ou MTB."

- **narrativeArc:**
  1. Abertura: Reconhecer o background ciclistico do lead e validar a escolha pelo gravel
  2. Diagnostico: Apresentar o cenario atual (volume, ferramentas, terreno) com dados concretos
  3. Gargalo: Nomear o principal limitador e explicar POR QUE ele trava o resultado
  4. Metricas: Mostrar os numeros que importam (zonas, nutricao, pressao) com visualizacoes claras
  5. Pilares: 3 recomendacoes estruturadas, da mais impactante pra menos
  6. Proximo passo: CTA claro — "converse com [profissional_nome] para montar seu plano de treino"
  7. Encerramento: Frase que reforce a identidade graveleira ("o asfalto acaba, a vida comeca — e agora voce sabe como chegar mais longe")

- **terminology:** pedal, giro, estradao, cascalho, drop bar, pneu largo, tubeless, D+ (desnivel positivo), bonk, zona 2, base aerobia, pacing, bike fit, rolo/trainer, FTP, W/kg, TSS, RPE

- **forbiddenTerms:**
  - "bicicleta de cascalho" (ninguem fala assim — use "gravel bike")
  - "mountain bike" como sinonimo de gravel (sao esportes diferentes)
  - "emagrecer" / "secar" / "perder barriga" (motivacao desse publico nao e estetica)
  - "corrida de bicicleta" (o termo e "prova" ou "evento")
  - "iniciante" de forma pejorativa (mesmo quem comecou recentemente no gravel ja pedala)
  - "dieta" (publico associa a restricao — use "nutricao" ou "combustivel")
  - Termos condescendentes ("voce precisa entender que...", "e importante saber que...")

- **recommendedTone:** "Tecnico mas acessivel. Fale como um coach experiente conversando com um ciclista que ja pedala — sem simplificacao excessiva, sem jargao desnecessario. Respeite a experiencia do lead. Seja direto, pratico, com toques de humor ligados a cultura gravel."

- **pillarGuidance:**
  1. "Pilar 1 (Pedalada Inteligente): Foque em zonas de treino e pacing. Se o lead tem potenciometro, use watts. Se nao, use RPE e FC. Adapte a linguagem ao background (roadie ja sabe zonas; gravel nativo precisa aprender)."
  2. "Pilar 2 (Combustivel): Seja especifico com numeros (g carb/h, ml/h). Desmistifique — nutricao em endurance nao e complicada, e planejamento. Cite alimentos reais brasileiros (banana, rapadura, paoca, tapioca)."
  3. "Pilar 3 (Corpo Preparado): Foque em prevencao, nao correcao. Exercicios concretos (nome + repeticoes). Se o lead reportou dor/desconforto como gargalo, esse pilar ganha destaque."

## 11 · Configuracao de calculos

- **activityLevelDefault:** `very_active`
  - **Justificativa:** O publico desse template ja pedala regularmente (condicao de entrada: vem de road, MTB ou ja faz gravel). Mesmo o sub-grupo de menor volume (<3h/semana) provavelmente faz outras atividades. `very_active` como default evita subestimar TDEE, o que levaria a recomendacoes de nutricao insuficientes em endurance.

- **activityMapping:**
  - `weekly_volume == under_3h` → `moderately_active`
  - `weekly_volume == 3_to_6h` → `very_active`
  - `weekly_volume == 6_to_10h` → `very_active`
  - `weekly_volume == over_10h` → `extremely_active`

## 12 · Notas de design (decisoes nao-obvias)

### Por que NAO inclui pergunta sobre objetivo/meta de prova

O hub ja direciona pra "Gravel". Dentro de gravel, os objetivos sao surpreendentemente homogeneos: pedalar mais longe, mais forte, sem quebrar. Perguntar "qual sua meta?" geraria respostas vagas ("melhorar", "completar uma prova") que nao mudam o relatorio substancialmente. O gargalo (Q2) captura melhor o que direciona o conteudo.

### Por que `training_tools` e multiple_choice e nao single

Ciclistas combinam ferramentas. "Potenciometro + GPS + indoor trainer" e combinacao comum. Single_choice forcaria escolher a "principal", perdendo informacao util. O custo (1 pergunta multi-select vs 4 perguntas sim/nao) e mínimo.

### Por que `ftp_value` e condicional e nao obrigatorio

FTP so faz sentido com potenciometro. Perguntar FTP pra quem nao mede potencia gera chute ou confusao. A visibilidade condicional (`if training_tools contains power_meter`) evita a pergunta pra ~50% dos respondentes que nao tem potenciometro.

### Por que lesao articular NAO e safety trigger

Lesao articular ativa e clinicamente relevante mas nao e emergencia em ciclismo. Ciclismo e low-impact. O copy orienta buscar fisio, mas nao ativa safetyReduced (que omitiria macros e timeline — desnecessario).

### Por que descartei Motor 3 (Nivel/Maturidade)

O background (Q1) ja captura maturidade indiretamente. Um roadie de 10 anos nao precisa de pergunta separada de "ha quanto tempo pedala?" — ja sabemos que e experiente. Adicionar nivel explícito seria redundante e adicionaria 1 pergunta sem mudar o relatorio.

### Por que `readiness_score` e heuristica, nao ciencia

Nao existe formula cientifica validada para "prontidao para gravel". O score e um produto de engajamento (gamificacao leve) que combina sinais do formulario. Documentei claramente como heuristica pra nao criar falsa expectativa de base cientifica.

### Por que a label sugerida permanece "Gravel"

"Gravel" e universalmente entendido pelo publico brasileiro desse nicho. Alternativas ("Cascalho", "Terreno Misto", "Aventura") seriam confusas ou vagas. O termo em ingles e parte da identidade da comunidade.

## 13 · Pendencias

1. **Calculo de pressao de pneu:** A formula SILCA e proprietaria. Alternativa: tabela lookup por peso × largura de pneu × terreno. Verificar se ha lib open source que implementa. Se nao, implementar tabela baseada em guidelines publicados (Rene Herse, SILCA blog posts).

2. **FTP estimado sem teste:** Nao existe formula confiavel para estimar FTP sem teste de campo ou laboratorio. Para leads sem potenciometro, o relatorio deve trabalhar com RPE e FC em vez de inventar um FTP. Decisao: omitir FTP estimado.

3. **Zonas de FC:** Formula Karvonen exige FC de repouso (nao coletamos). Alternativa: %FCmax com FCmax estimada por idade (220-idade e imprecisa mas e o padrao). Avaliar se vale adicionar pergunta de FC repouso (provavelmente nao — adiciona friccao).

4. **Score de prontidao (`readiness_score`):** Os pesos (30/20/15/20/15) sao arbitrarios. Precisam de calibracao com dados reais de uso. Marcar como v1 e iterar pos-lancamento.

5. **Validacao clinica:** Marcada como "Opcional" na tabela. Gravel nao tem riscos clinicos especificos alem dos cobertos pelo safety generico (cardiaco, respiratorio, diabetes). Se um medico esportivo ou fisiologista revisar, focar nas recomendacoes de nutricao em endurance e limites de volume.

6. **Bikepacking como branch ou template separado:** Decidi excluir bikepacking multi-dia do escopo. Se demanda crescer, pode virar template `19b-bikepacking` ou branch condicional de Q6. Monitorar pos-lancamento.

## 14 · Fontes citadas

1. **Coggan, A. & Allen, H.** — _Training and Racing with a Power Meter_ (3rd ed., 2019). Referencia para zonas de potencia e classificacao FTP.
2. **Seiler, S.** — "What is best practice for training intensity and duration distribution in endurance athletes?" _International Journal of Sports Physiology and Performance_, 5(3), 2010. Modelo polarizado 80/20.
3. **Jeukendrup, A.** — "A step towards personalized sports nutrition: carbohydrate intake during exercise." _Sports Medicine_, 44(Suppl 1), 2014. Guidelines de carb/h.
4. **American College of Sports Medicine (ACSM)** — "Exercise and Fluid Replacement." _Medicine & Science in Sports & Exercise_, 39(2), 2007. Reposicao hidrica.
5. **ACSM** — _Guidelines for Exercise Testing and Prescription_ (11th ed., 2021). Progressao de carga, niveis de atividade.
6. **Sayers, M. & Clover, J.** — "Ergonomic analysis of cycling: a systematic review." _Journal of Sports Sciences_, 30(15), 2012. Prevalencia de dor e lesao em ciclismo.
7. **SILCA** — Tire Pressure Calculator methodology (silca.cc/pages/sppc-form). Referencia para calculo de pressao.
8. **Ticket Sports / Bikemagazine** — "Pesquisa: Perfil do Atleta Brasileiro" (fev/2025). Demografia e perfil socioeconomico do ciclista BR.
9. **UCI Gravel World Series Camboriu** — Reportagem Bikemagazine (mar/2025). Dados de participacao e perfil do evento inaugural no Brasil.
10. **Brasil Ride** — Regulamento Gravel Brasil Ride Bonito (2025). Distancias, altimetria, formato stage race.

# Research · Especialidade 17 · Speed (Ciclismo de Estrada)

## 0 · Metadados

- **Número:** 17
- **Modality:** ciclismo
- **Pasta:** `ciclismo/17-road/`
- **Plano:** pro
- **Validação clínica:** Opcional (recomendada para faixas 40+, mas não bloqueante)
- **Pesquisado em:** 2026-04-24
- **Label proposto:** "Speed" (não "Road" — o público brasileiro chama universalmente de "speed")
- **specialty_code proposto:** `speed`
- **Fontes consultadas:**
  1. Coggan, A. & Allen, H. — _Training and Racing with a Power Meter_ (referência padrão para zonas de potência)
  2. Ticket Sports — _Perfil do Atleta Brasileiro 2025_ (dados demográficos de ciclismo no Brasil)
  3. Aliança Bike — _MTB no MAPA 2025_ (perfil demográfico complementar)
  4. Diretriz Brasileira de Cardiologia do Esporte (triagem pré-participação)
  5. Tanaka, H. et al. (2001) — fórmula FCmax revisada: 208 − 0.7×idade
  6. TrainingPeaks — documentação oficial de TSS, CTL, ATL, TSB
  7. Bikemagazine.com.br — matérias sobre periodização, provas e tendências 2024-2026
  8. Strava / Garmin — dados sobre adoção de medidores de potência no Brasil

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 30-50 anos (média ~38 anos em provas)
- **Gênero:** ~85-90% masculino, 10-15% feminino (a menor proporção entre as modalidades de ciclismo)
- **Contexto socioeconômico:** classe média-alta a alta. Uma bike de entrada custa R$5.000-10.000; setups competitivos vão de R$15.000 a R$40.000+. Medidor de potência adiciona R$2.000-8.000. É um esporte de alto investimento em equipamento
- **Concentração geográfica:** Sudeste (SP, RJ, MG) responde por ~58% dos praticantes. SC e PR também são fortes (eventos UCI, relevo favorável)

### Ordem de grandeza

Mercado **médio-grande**. O Brasil tem ~6 milhões de usuários Strava com ciclismo como atividade principal. Desses, estima-se 500.000 a 1 milhão de praticantes ativos de speed (estrada/asfalto com bike de drop bar). Eventos cresceram 6,1% em participação entre 2023-2024. O ticket médio de inscrição subiu para R$226,81 — público que paga por experiência.

### Onde estão online

- **Strava:** a rede social de facto. Segmentos, KOMs e desafios mensais são o centro da vida competitiva amadora
- **Instagram:** perfis de assessorias esportivas (ACPerformance, FCA, Menuci, Athlon), influenciadores (Portal Wheeling/Hudson Xavier, @ociclistaamador), eventos (L'Étape, Gran Fondo)
- **WhatsApp:** todo grupão tem grupo. Hiperlocais — "Speed Zona Sul SP", "Grupão da Orla RJ", "Pedal das 6h Curitiba". Entrada por boca-a-boca em pedais ou bike shops
- **YouTube:** Portal Wheeling (maior canal de bikes das Américas), Pedaleria, Bikemagazine
- **TrainingPeaks:** plataforma dominante para prescrição de treino coach→atleta. Integrado com Garmin/Wahoo
- **Zwift/Rouvy:** indoor training crescendo rápido por segurança no trânsito e otimização de tempo

### Linguagem-padrão

- **"Speed"** — o nome universal para ciclismo de estrada no Brasil. Ninguém fala "road cycling" ou "ciclismo de estrada" no dia a dia
- **"Grupão"** — pedal em grupo regular. "Vou no grupão domingo"
- **"Pelotão"** — grupo principal. "Fiquei no pelotão até a subida"
- **"Vácuo"** — pegar reboque aerodinâmico de outro ciclista
- **"Puxar/puxada"** — ir na frente puxando o vento pro grupo
- **"Clip" / "sapatilha"** — pedais clipless e sapatos de ciclismo
- **"Bretelle"** — bermuda com suspensório (bib short)
- **"Quebrar/estourar"** — bonk, esgotar completamente
- **"Dar pau/meter pau"** — atacar forte, ir all-out
- **"Grupeta/grupetto"** — grupo dos que ficaram pra trás

### O que os ofende ou afasta

- Chamar a bike de "bicicleta" em tom casual/diminutivo — é "minha speed" ou "minha bike"
- Confundir speed com MTB, gravel ou cicloturismo (tribos distintas, orgulho da identidade)
- Tom excessivamente paternalista sobre segurança ("ciclismo é perigoso") — eles sabem, não querem ser lembrados
- "Ciclista de domingo" — pejorativo para quem não treina sério
- Prometir resultados mágicos ou usar linguagem de academia genérica

### Dor mais comum que leva a procurar ajuda

**Plateau de performance** — "pedalo 3-4x por semana há meses e não melhoro." A resposta quase sempre é: treina sem estrutura (todo pedal em zona 3, o "purgatório do tempo"), sem periodização, sem dados objetivos. O ciclista amador brasileiro típico faz todo pedal na mesma intensidade e se frustra quando para de evoluir.

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Ciclistas de estrada (drop bar, asfalto) de TODOS os níveis: iniciante, regular/recreativo e competidor amador
- Objetivos: performance em provas, evolução pessoal, saúde/fitness, prazer no pedal em grupo
- Quem treina sozinho E quem faz grupão
- Quem usa power meter, quem usa apenas FC, e quem treina "no feeling"

### Este template NÃO vai cobrir:

- **Ciclismo indoor/Zwift puro** (template #20 — dinâmica, métricas e público diferentes)
- **Gravel** (template #19 — equipamento, terreno e cultura distintos)
- **MTB** (template #18 — modalidade completamente diferente)
- **Triatletas** (futuro — gerenciam 3 esportes em paralelo)
- **Ciclismo profissional/elite federado** (público extremamente pequeno, necessidades ultra-específicas)
- **Cicloturismo** (não é performance, é viagem — outro produto)

### Decisão de naming

**Proponho label "Speed"** no lugar de "Road / Speed". Razão: no Brasil, "road" não é usado pelo público. "Speed" é a palavra que o ciclista digita, fala e se identifica. O `specialty_code` fica `speed` (curto, limpo, inequívoco).

---

## 3 · Motores escolhidos

### Motores considerados e decisão

| Motor                   | Considerado? | Decisão                       | Justificativa                                                                                                                                                                                                        |
| ----------------------- | ------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor 1 (Contexto)      | Sim          | Descartado                    | Absorvido pelo Motor 6 — "como se define" já captura onde está hoje                                                                                                                                                  |
| Motor 2 (Gargalo)       | Sim          | **Incluído**                  | Essencial. O gargalo muda radicalmente o relatório — falta de estrutura ≠ dor no joelho ≠ nutrição ruim                                                                                                              |
| Motor 3 (Nível)         | Sim          | Descartado                    | Coberto pelo Motor 6 (identidade). Perguntar "há quanto tempo pedala" E "como se define" é redundante — a identidade é mais rica                                                                                     |
| Motor 4 (Comportamento) | Sim          | **Incluído**                  | Volume real semanal é a variável mais preditiva de resultado. Quem faz 2 pedais/semana precisa de conselho diferente de quem faz 5                                                                                   |
| Motor 5 (Ambiente)      | Sim          | Descartado                    | A maioria pedala na rua com a speed que tem. O ambiente não muda substancialmente a prescrição neste template (diferente de musculação, onde "casa vs academia" é decisivo). Quem pedala indoor vai pro template #20 |
| Motor 6 (Identidade)    | Sim          | **Incluído como segmentação** | O mais poderoso para speed. "Estou começando" vs "pedalo regular" vs "compito em provas" define tom, profundidade técnica e métricas do relatório inteiro                                                            |
| Motor 7 (Métricas)      | Sim          | **Incluído**                  | Crítico. Se tem power meter → relatório pode falar em zonas de potência, W/kg, TSS. Se só FC → zonas de FC. Se nada → recomendações qualitativas. Pergunta condicional para FTP                                      |
| Motor 8 (Safety)        | Sim          | **Incluído**                  | Obrigatório. Risco cardíaco real em esforços intensos, especialmente na faixa 35+                                                                                                                                    |

### Lista final: 5 motores, 7 perguntas

1. **Segmentação (Motor 6)** → `cycling_identity` — define o perfil do ciclista e abre branches
2. **Gargalo (Motor 2)** → `main_bottleneck` — identifica o que trava a evolução
3. **Comportamento (Motor 4)** → `weekly_rides` — volume real de treino semanal
4. **Métricas (Motor 7)** → `measurement_tools` + `ftp_value` (condicional) — o que mede e com que ferramenta
5. **Safety (Motor 8)** → `health_conditions` — triagem de saúde

**Total: 7 perguntas** (6 visíveis para todos, 1 condicional). Dentro do range 5-8.

---

## 4 · Perguntas e opções

### Q1 · `cycling_identity` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Como você se define no speed hoje?"
**Helper:** "Escolha o que mais combina com seu momento atual"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`starting`** — "Estou começando"
  - Copy (60-120 palavras): "Você está nos primeiros meses do speed — talvez tenha vindo do MTB, da corrida, ou esteja montando na bike pela primeira vez. Tudo é novo: a posição aerodinâmica, pedalar de clip, o ritmo do grupão. E está certo — essa fase tem uma curva de aprendizado real. As dores iniciais (selim, lombar, pescoço) são normais e temporárias quando o ajuste da bike está correto. O relatório vai focar no que importa agora: conforto, segurança, consistência e os primeiros ganhos de condicionamento que vêm rápido quando o corpo se adapta."
  - Safety trigger? não

- **`regular`** — "Pedalo regularmente e quero evoluir"
  - Copy (60-120 palavras): "Você já pedala há meses (ou anos), tem sua rotina de grupão ou treino solo, conhece suas rotas. Mas sente que estagnou — os tempos nos segmentos pararam de cair, as subidas não ficam mais fáceis, o pelotão ainda te larga no mesmo ponto. Esse é o platô clássico do ciclista que treina por instinto. O relatório vai mostrar onde está o gargalo real (quase sempre é treinar sempre na mesma intensidade) e como estruturar os pedais que você já faz para que cada um tenha um propósito."
  - Safety trigger? não

- **`competitor`** — "Faço provas ou treino para competir"
  - Copy (60-120 palavras): "Você participa de provas (Gran Fondo, L'Étape, circuitos, KOMs no Strava) ou treina com mentalidade competitiva. Conhece conceitos como FTP, zonas, periodização — mesmo que não aplique tudo com rigor. Quer extrair mais watts, melhorar W/kg, chegar mais preparado nos eventos. O relatório vai ser técnico: análise das suas métricas atuais, diagnóstico do gargalo de performance, e recomendações específicas para o seu momento na temporada. Se você tem medidor de potência, vamos usar esses dados. Se não, vamos trabalhar com o que tem."
  - Safety trigger? não

**Justificativa da pergunta:** A identidade ciclística é o eixo que mais muda no relatório. Um iniciante precisa ouvir sobre conforto e segurança; um regular precisa de diagnóstico de platô; um competidor quer dados e periodização. Alternativa descartada: "Há quanto tempo pedala speed?" — tempo é menos informativo que identidade (alguém pode pedalar há 5 anos sem nunca ter competido; outro compete após 8 meses).

**Justificativa das opções:** Três opções cobrem o espectro. Não há 4ª opção porque "profissional/elite" está fora do escopo (público minúsculo, necessidades que extrapolam um formulário). "Cicloturismo" também está fora — é outra motivação.

---

### Q2 · `main_bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais trava sua evolução no pedal hoje?"
**Helper:** "Escolha o principal — aquele que, se resolvesse, mudaria mais"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`no_structure`** — "Não sei estruturar meu treino"
  - Safety trigger? não

- **`pain_discomfort`** — "Sinto dores que atrapalham (joelho, lombar, selim)"
  - Safety trigger? não

- **`nutrition_fuel`** — "Minha alimentação e nutrição no pedal não são boas"
  - Safety trigger? não

- **`time_consistency`** — "Falta tempo ou consistência para treinar"
  - Safety trigger? não

- **`performance_plateau`** — "Estagnei — meus números pararam de melhorar"
  - Safety trigger? não

**Justificativa da pergunta:** O gargalo é a pergunta diagnóstica mais importante. Cada opção gera um relatório com foco diferente. Alternativa descartada: "O que você gostaria de melhorar?" — muito positivo, não captura a DOR. Gargalo captura o que frustra, que é mais acionável.

**Justificativa das opções:** 5 opções cobrem os gargalos clássicos do ciclismo amador brasileiro: (1) falta de estrutura é o mais comum, (2) dor/desconforto é o segundo, (3) nutrição é subestimada mas impactante, (4) tempo é realidade de adulto que trabalha, (5) platô é o gargalo do ciclista já engajado. Caso de borda não coberto: "medo do trânsito" — é um impeditivo real mas não é gargalo de treinamento (é gargalo de logística/segurança pública, fora do escopo do relatório de treino).

---

### Q3 · `weekly_rides` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Na última semana, quantos pedais você realmente fez?"
**Helper:** "Conte pedais de treino, grupão e indoor — não conte deslocamento"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`zero`** — "Nenhum"
  - Safety trigger? não

- **`one_two`** — "1-2 pedais"
  - Safety trigger? não

- **`three_four`** — "3-4 pedais"
  - Safety trigger? não

- **`five_plus`** — "5 ou mais pedais"
  - Safety trigger? não

**Justificativa da pergunta:** Volume semanal REAL (não planejado) é o dado comportamental mais preditivo. A formulação "na última semana" força resposta concreta, não aspiracional. Alternativa descartada: "Quantos km por semana?" — quilometragem é ambígua (30km de intervalos em subida ≠ 30km planos de passeio) e exige que o aluno calcule.

**Justificativa das opções:** Faixas clássicas da prescrição de ciclismo. Zero captura inativo/retorno. 1-2 é mínimo funcional. 3-4 é o sweet spot amador. 5+ é volume alto que precisa de atenção à recuperação. Não há opção "7+" porque quem pedala todo dia já sabe que faz isso e seleciona 5+.

---

### Q4 · `measurement_tools` _(Motor 7 — Métricas/Ferramentas)_

**Type:** `single_choice`
**Label (client-facing):** "Que ferramenta de treino você usa no pedal?"
**Helper:** "Escolha a principal — a que define seus dados de treino"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`power_meter`** — "Medidor de potência (power meter)"
  - Safety trigger? não

- **`hr_monitor`** — "Frequencímetro (monitor de FC)"
  - Safety trigger? não

- **`gps_only`** — "Apenas GPS/Strava (velocidade, distância)"
  - Safety trigger? não

- **`nothing`** — "Não uso nada / pedalo sem dados"
  - Safety trigger? não

**Justificativa da pergunta:** A ferramenta de medição muda FUNDAMENTALMENTE o que o relatório pode calcular e recomendar. Com power meter → zonas Coggan, W/kg, TSS. Com FC → zonas por FCmax, análise qualitativa. Sem nada → RPE e recomendações qualitativas. Alternativa descartada: perguntar "você tem power meter?" como sim/não — simplista demais, perde a distinção entre FC (segundo melhor) e nada.

**Justificativa das opções:** Hierarquia clara de precisão: potência > FC > GPS > nada. Cada nível habilita um conjunto diferente de cálculos no relatório. Não há "smartwatch genérico" como opção porque quem usa Apple Watch para ciclismo tipicamente tem FC (sensor óptico), coberto por `hr_monitor`.

---

### Q5 · `ftp_value` _(Motor 7 — Métricas/Ferramentas, condicional)_

**Type:** `number`
**Label (client-facing):** "Qual seu FTP atual (em watts)?"
**Helper:** "Se não sabe exatamente, coloque o valor mais recente do seu teste ou estimativa do Garmin/Wahoo/Zwift"
**Required:** não (mas fortemente encorajado se visível)
**Visibility:** `if measurement_tools == power_meter`
**Segmentação:** não
**depthRequired:** standard
**Validação:** min: 80, max: 500 (range realista para amadores)

**Justificativa da pergunta:** Se a pessoa tem power meter, o FTP é a métrica-rei. Com FTP + peso (do bloco universal), calcula-se W/kg e zonas de potência — as métricas mais valiosas do relatório. Alternativa descartada: perguntar FTP para todos — quem não tem power meter não sabe FTP, e chutar seria dado lixo.

---

### Q6 · `longest_ride` _(Motor 4 — Comportamento complementar)_

**Type:** `single_choice`
**Label (client-facing):** "Qual o pedal mais longo que você fez no último mês?"
**Helper:** "Em distância aproximada"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`under_30km`** — "Menos de 30 km"
  - Safety trigger? não

- **`30_60km`** — "30-60 km"
  - Safety trigger? não

- **`60_100km`** — "60-100 km"
  - Safety trigger? não

- **`over_100km`** — "Mais de 100 km"
  - Safety trigger? não

**Justificativa da pergunta:** O pedal mais longo recente é um indicador objetivo de capacidade aeróbica atual. Combina com `weekly_rides` para dar uma foto completa: frequência × duração. Alternativa descartada: "Quantos km por semana?" — pede cálculo mental e mistura treinos de qualidade com volume. O pedal mais longo é mais simples de responder e mais informativo para prescrição.

**Justificativa das opções:** Faixas que refletem marcos reais do ciclismo amador: sub-30 (iniciante/intensidade), 30-60 (grupão urbano), 60-100 (fundo regular), 100+ (endurance sério). Cada faixa implica capacidade aeróbica e necessidades nutricionais diferentes.

---

### Q7 · `health_conditions` _(Motor 8 — Safety/Risco)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições de saúde?"
**Helper:** "Selecione todas que se aplicam — isso ajusta o relatório para sua segurança"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`cardiac`** — "Problema cardíaco diagnosticado (arritmia, sopro, cardiopatia)"
  - Safety trigger? **sim** (reason: "Risco de evento cardíaco agudo em esforço de alta intensidade. Ciclismo de estrada envolve picos de Z4-Z5 em subidas e sprints. Diretriz Brasileira de Cardiologia do Esporte recomenda avaliação pré-participação com ECG.")

- **`hypertension`** — "Pressão alta (hipertensão)"
  - Safety trigger? **não** (condição controlada não é emergência — ajusta tom, não bloqueia)

- **`diabetes`** — "Diabetes (tipo 1 ou 2)"
  - Safety trigger? **não** (ajusta recomendações de nutrição, não bloqueia)

- **`recent_surgery`** — "Cirurgia ou lesão grave nos últimos 6 meses"
  - Safety trigger? **sim** (reason: "Retorno prematuro ao esforço pode reabrir lesão, comprometer consolidação óssea ou causar complicação pós-operatória. Precisa de liberação do cirurgião/fisioterapeuta.")

- **`chest_pain`** — "Dor no peito ou falta de ar em esforço"
  - Safety trigger? **sim** (reason: "Possível sintoma de doença coronariana, arritmia ou outra condição cardíaca não diagnosticada. Precisa de investigação antes de treinar.")

- **`none`** — "Nenhuma dessas condições"
  - Safety trigger? não

**Justificativa da pergunta:** Risco cardíaco é REAL no ciclismo de estrada (esforços intensos em subidas/sprints em faixa etária 35-50 predominante). A Diretriz Brasileira de Cardiologia do Esporte recomenda triagem. Alternativa descartada: PAR-Q completo — excessivamente clínico para formulário de 3 minutos. Optei por condições que DE FATO mudam o relatório.

**Justificativa das opções:** As 5 condições cobrem os riscos relevantes para ciclismo de intensidade. Não incluí: asma (ajusta mas raramente bloqueia), artrose (dor/desconforto coberta no gargalo), tireoide (medicada não impacta treino de ciclismo). Incluí `chest_pain` como sintoma-sentinel porque pode ser o primeiro sinal de cardiopatia não diagnosticada — mais relevante que perguntar condições específicas que a pessoa pode não saber que tem.

---

## 5 · Branches

### Branch: `Começando` (trigger: `cycling_identity == starting`)

- **Tom geral:** acolhedor, encorajador, sem jargão técnico. A IA deve falar como um amigo ciclista mais experiente, não como um treinador. Celebrar a decisão de começar.
- **pillarGuidance:** foco em conforto, adaptação corporal, e primeiros marcos. Evitar falar de zonas de potência, periodização avançada ou números de performance. Referência é "como se sentir bem na bike" e "primeiros 3 meses".
- **Additional questions:** nenhuma
- **Remove questions:** `ftp_value` nunca aparece (já condicional), e `longest_ride` perde relevância (provavelmente sub-30km)
- **Metrics override:** omitir W/kg, zonas de potência, TSS. Focar em: volume semanal sugerido, meta calórica, hidratação, gauges de condicionamento básico.
- **Narrative arc override:** "Você deu o primeiro passo → seu corpo vai se adaptar rápido → aqui está o que focar nos próximos 3 meses → procure o profissional para acelerar essa evolução"

**Justificativa:** Um iniciante que recebe relatório com FTP, W/kg e zonas Coggan vai se sentir incompetente e fechar. O relatório precisa validar a decisão de começar e dar um mapa simples dos primeiros passos. Mudar apenas o tom (sem mudar métricas e arco narrativo) não é suficiente.

---

### Branch: `Regular` (trigger: `cycling_identity == regular`)

- **Tom geral:** direto, developmental. A IA assume que o ciclista conhece o básico e quer entender POR QUE não está evoluindo. Linguagem técnica moderada com explicações breves.
- **pillarGuidance:** foco em diagnóstico de platô, introdução a estrutura de treino, distribuição 80/20 de intensidades. Pode falar de zonas (FC ou potência conforme ferramenta), periodização básica, bike fit.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** nenhum — mostra todas as métricas aplicáveis com base na ferramenta declarada
- **Narrative arc override:** "Aqui está onde você está → aqui está o que provavelmente está te travando → aqui está a estrutura que falta → procure o profissional para montar seu plano"

**Justificativa:** O ciclista regular é o público-alvo principal deste template (maior volume). Ele precisa de diagnóstico + plano de ação. Não é suficiente mudar apenas tom — o arco narrativo precisa centrar no gargalo declarado e oferecer solução estruturada. Mas não precisa de métricas diferentes do padrão.

---

### Branch: `Competidor` (trigger: `cycling_identity == competitor`)

- **Tom geral:** técnico, respeitoso, entre-iguais. A IA pode usar termos como FTP, W/kg, TSS, periodização, base/build/peak. O ciclista competidor quer dados e diagnóstico preciso, não motivação.
- **pillarGuidance:** foco em otimização, periodização para prova-alvo, gestão de fadiga/forma, nutrição de performance. Pode citar estudos e fórmulas. Tom de consultor de performance, não de coach motivacional.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** priorizar W/kg, zonas de potência detalhadas (se power meter), estimativa de TSS/CTL. Omitir métricas básicas redundantes (ex: "você deveria pedalar 3x por semana" — ele já sabe).
- **Narrative arc override:** "Seus dados dizem isso → seu gargalo técnico é esse → aqui está a periodização que faz sentido agora → o profissional pode refinar isso com análise individual"

**Justificativa:** Competidor que recebe relatório genérico ("durma bem, beba água") perde respeito pelo produto. Ele precisa que o relatório "fale a língua dele" e ofereça insight que surpreenda. A mudança substancial é: métricas priorizadas, profundidade técnica dos pilares, e arco narrativo centrado em dados — não em sentimentos.

---

## 6 · Safety triggers

| Questão             | Opções           | Reason (clínico)                                                                                                                                 | Efeito no relatório                                                                                |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `health_conditions` | `cardiac`        | Risco de evento cardíaco agudo. Diretriz BR Cardio Esporte recomenda ECG pré-participação. Ciclismo de estrada envolve Z4-Z5 em subidas/sprints. | Macros omitidas, timeline omitida, SafetyNote aparece, IA não prescreve intensidade                |
| `health_conditions` | `recent_surgery` | Retorno prematuro pode comprometer recuperação. Variável demais para prescrever remotamente.                                                     | Macros omitidas, timeline omitida, SafetyNote aparece, IA direciona ao especialista que acompanhou |
| `health_conditions` | `chest_pain`     | Possível sintoma de cardiopatia não diagnosticada. Investigar antes de treinar.                                                                  | Macros omitidas, timeline omitida, SafetyNote aparece, IA recomenda cardiologista urgente          |

**safetyTemplate:**

- **Title:** "Sua segurança vem primeiro"
- **Body:** "Com base nas suas respostas, o relatório vai focar em orientações gerais de saúde em vez de prescrição de treino específica. Isso não é uma limitação — é responsabilidade. O ciclismo é uma ferramenta incrível de saúde, mas para aproveitar com segurança, você precisa primeiro de uma avaliação presencial com o profissional adequado (cardiologista esportivo, fisioterapeuta ou médico que acompanhou sua recuperação). O profissional [profissional_nome] pode direcionar você ao especialista certo e, com a liberação em mãos, montar um plano de treino adaptado para sua condição."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `power_to_weight`

- **O que é:** Relação potência/peso (W/kg) baseada no FTP declarado e peso do bloco universal
- **Por que aparece para o aluno:** É a métrica de identidade do ciclista de estrada. Quando um ciclista fala "sou 3.2 W/kg", ele sabe exatamente o que isso significa na sua comunidade. É comparável, aspiracional e diretamente ligada à capacidade em subidas.
- **Cálculo:** FTP (watts) ÷ peso (kg). Referência: tabela Coggan (Untrained 1.5-2.0, Recreational 2.0-2.5, Cat 4/5 2.5-3.2, Cat 3 3.2-3.8, Cat 1/2 3.8-4.5)
- **Visualização proposta:** **Gauge radial** com faixas coloridas por classificação Coggan. Valor central grande (ex: "3.1 W/kg"), faixa atual destacada, próximo nível indicado. Rationale: é a "nota" do ciclista — visual imediato de onde está e quanto falta.
- **Condição:** só aparece se `measurement_tools == power_meter` E `ftp_value` preenchido
- **Placeholder:** `[w_per_kg]`

### 7.2 · `power_zones`

- **O que é:** As 7 zonas de potência Coggan calculadas a partir do FTP
- **Por que aparece para o aluno:** Dá ao ciclista o mapa de intensidades. Ele pode olhar essa tabela e saber: "quando meu Garmin mostrar 180W, estou em Z3 Tempo". Transforma número abstrato em ação.
- **Cálculo:** FTP × percentuais Coggan (Z1: <55%, Z2: 56-75%, Z3: 76-90%, Z4: 91-105%, Z5: 106-120%, Z6: 121-150%, Z7: >150%)
- **Visualização proposta:** **Zone table** — tabela com 7 linhas, cores por zona (verde→amarelo→laranja→vermelho), colunas: Zona | Nome | Faixa (W) | Descrição curta. Rationale: é o formato que os ciclistas já conhecem de TrainingPeaks/Garmin.
- **Condição:** só aparece se `measurement_tools == power_meter` E `ftp_value` preenchido
- **Placeholder:** `[zone_table]`

### 7.3 · `hr_zones`

- **O que é:** 5 zonas de frequência cardíaca calculadas pela fórmula de Tanaka (208 − 0.7×idade)
- **Por que aparece para o aluno:** Para quem treina com frequencímetro, dá o guia de intensidade equivalente ao de zonas de potência. Menos preciso, mas funcional.
- **Cálculo:** FCmax estimada = 208 − (0.7 × idade). Zonas: Z1 <60%, Z2 60-70%, Z3 70-80%, Z4 80-90%, Z5 90-100% da FCmax
- **Visualização proposta:** **Zone table** — mesmo formato das zonas de potência, mas com BPM. Cores iguais para consistência visual.
- **Condição:** aparece se `measurement_tools == hr_monitor` OU `measurement_tools == power_meter` (complementar)
- **Placeholder:** `[hr_zones]`

### 7.4 · `caloric_expenditure`

- **O que é:** Estimativa de gasto calórico por hora de pedal, baseada em peso e intensidade média declarada
- **Por que aparece para o aluno:** É a métrica que conecta ciclismo com composição corporal. O ciclista que quer emagrecer ou manter peso quer saber "quanto queimo num pedal de 2h".
- **Cálculo:** Se tem power meter: kJ do pedal ≈ kcal (regra dos 25% de eficiência). Se não: METs × peso(kg) × 1.05 × horas. METs por intensidade: leve=6, moderada=8, intensa=10, muito intensa=12.
- **Visualização proposta:** **Card numérico** com valor grande (ex: "820 kcal/h") e comparação contextual ("equivale a ~2.5 refeições"). Rationale: número único com contexto emocional.
- **Placeholder:** `[kcal_per_hour]`

### 7.5 · `hydration_target`

- **O que é:** Meta de hidratação por hora de pedal, ajustada por peso
- **Por que aparece para o aluno:** Desidratação é causa #1 de queda de performance e risco de cãibra em clima tropical. Meta concreta ("beba X ml por hora") é acionável imediatamente.
- **Cálculo:** Regra base: 500-800 ml/hora (ACSM guidelines). Ajuste: +200ml para peso >85kg, +100ml para clima quente declarado. Eletrólitos: 500-700mg sódio/litro para pedais >90min.
- **Visualização proposta:** **Card numérico** com ícone de garrafa, valor em ml/hora, e nota sobre eletrólitos. Rationale: informação direta, sem gráfico necessário.
- **Placeholder:** `[hydration_ml]`

### 7.6 · `training_distribution`

- **O que é:** Avaliação qualitativa de como o ciclista provavelmente distribui intensidade (baseado nas respostas)
- **Por que aparece para o aluno:** A maioria dos amadores treina "tudo em zona 3". Mostrar visualmente que estão na distribuição errada é um insight de alto impacto.
- **Cálculo:** Baseado em `weekly_rides` + `measurement_tools` + `main_bottleneck`. Se gargalo é platô + alto volume → provavelmente 100% Z3 (distribuição "errada"). Recomendação: 80% Z1-Z2 + 20% Z4-Z5 (distribuição "ideal").
- **Visualização proposta:** **Donut chart comparativo** — dois donuts lado a lado: "como provavelmente está" vs "como deveria estar". Cores por zona. Rationale: contraste visual entre estado atual e ideal é o tipo de insight que faz o ciclista pensar "é exatamente isso".
- **Placeholder:** `[distribution_chart]`

### 7.7 · `endurance_level`

- **O que é:** Classificação qualitativa de capacidade aeróbica baseada em `longest_ride` + `weekly_rides`
- **Por que aparece para o aluno:** Dá uma "nota" de onde está a resistência atual, em linguagem simples.
- **Cálculo:** Matriz simples: longest_ride × weekly_rides → categorias: "Construindo base", "Base sólida", "Endurance forte", "Ultra-endurance". Não é VO2max (sem teste), mas é indicativo útil.
- **Visualização proposta:** **Gauge simples** com 4 faixas nomeadas. Rationale: visual rápido de "onde estou", sem pretensão de ser métrica clínica.
- **Placeholder:** `[endurance_level]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `ftp_classification`

- **O que é:** Classificação do FTP na tabela Coggan (Untrained / Recreational / Cat 4-5 / Cat 3 / Cat 1-2 / Domestic Pro)
- **Por que importa para o PT:** Diagnóstico imediato do nível do atleta. Define a abordagem de treino (volume vs intensidade), expectativas realistas e linguagem técnica do coaching.
- **Cálculo:** W/kg na tabela Coggan, ajustado por sexo
- **Visualização proposta:** **Scorecard** com classificação em destaque + percentil estimado

### 8.2 · `overtraining_risk`

- **O que é:** Score de risco de overtraining baseado em volume declarado + gargalo + ferramentas
- **Por que importa para o PT:** Identifica leads que estão treinando demais sem recuperação. Comum em ciclistas com 5+ pedais/semana que reportam platô ou fadiga.
- **Cálculo:** Heurística: weekly_rides(5+) × bottleneck(plateau|pain) × identity(regular|competitor) → score 0-100. Não é diagnóstico clínico, é flag de atenção.
- **Visualização proposta:** **Semáforo** (verde/amarelo/vermelho)

### 8.3 · `adherence_score`

- **O que é:** Score preditivo de adesão ao plano de treino baseado em comportamento declarado
- **Por que importa para o PT:** Prever quais leads vão manter o treino vs quais vão desistir. Ciclistas com volume zero + gargalo "falta tempo" têm alta chance de drop-off.
- **Cálculo:** Heurística: weekly_rides(peso alto) + longest_ride(peso médio) + identity(peso baixo). 0-100.
- **Visualização proposta:** **Gauge** com faixas verde/amarelo/vermelho

### 8.4 · `equipment_level`

- **O que é:** Classificação do nível de equipamento (por proxy: se tem power meter, provavelmente tem setup competitivo)
- **Por que importa para o PT:** Indica capacidade de investimento e seriedade do lead. Quem tem power meter provavelmente paga assessoria esportiva sem hesitar.
- **Cálculo:** Mapeamento direto de `measurement_tools`: power_meter=Premium, hr_monitor=Intermediário, gps_only=Básico, nothing=Iniciante
- **Visualização proposta:** **Badge** com ícone

### 8.5 · `bottleneck_diagnosis`

- **O que é:** Classificação do gargalo principal em categorias acionáveis para o coach
- **Por que importa para o PT:** O PT olha o lead e sabe imediatamente se é caso de periodização (no_structure/plateau), de encaminhamento para bike fitter (pain), de educação nutricional (nutrition), ou de coaching comportamental (time_consistency).
- **Cálculo:** Mapeamento direto de `main_bottleneck`
- **Visualização proposta:** **Card categórico** com ícone + recomendação de abordagem

### 8.6 · `vo2max_estimate`

- **O que é:** Estimativa de VO2max baseada em FTP e peso (se dados disponíveis)
- **Por que importa para o PT:** VO2max é o indicador gold-standard de capacidade aeróbica. Mesmo estimado, dá ao coach um benchmark da "capacidade do motor" do atleta.
- **Cálculo:** VO2max (ml/kg/min) = (10.8 × watts_at_FTP) / peso_kg + 7 (fórmula adaptada para ciclismo, Storer et al. 1990). Alternativa: se não tem FTP, não calcular.
- **Visualização proposta:** **Card numérico** com classificação por faixa etária (ACSM norms)

---

## 9 · Pilares do relatório

### Pilar 1 · Estrutura de Treino

- **Subtitle:** "Treinar com propósito, não com instinto"
- **Conceito central:** A evolução no ciclismo vem da variação intencional de intensidade, não do acúmulo de quilômetros na mesma zona. A distribuição 80/20 (80% do volume em intensidade baixa, 20% em alta) é o padrão validado que separa ciclistas que evoluem dos que estagnam.
- **Evidência científica:** Seiler, S. (2010). "What is best practice for training intensity and duration distribution in endurance athletes?" — metanálise mostrando que distribuição polarizada (80/20) produz melhores adaptações aeróbicas que distribuição threshold-centrada.
- **Placeholders esperados:** `[weekly_rides]`, `[zone_table]` ou `[hr_zones]`, `[distribution_chart]`, `[endurance_level]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "A maioria dos ciclistas que estagnam têm um hábito em comum: todo pedal é na mesma intensidade. Vai pro grupão e empurra. Treina na semana e empurra também. O corpo se adapta a esse estímulo e para de responder. A chave é variar: pedais leves de verdade (conversa tranquila) na maioria das saídas, e 1-2 sessões na semana onde você realmente empurra forte — e depois descansa de verdade."
- **Exemplo de texto técnico (30-40 palavras):** "Distribuição polarizada (Z1-Z2 em 80% do volume, Z4-Z5 em 20%) maximiza adaptações oxidativas e performance em limiares. Periodização reversa pode ser indicada para ciclistas amadores com disponibilidade limitada."

### Pilar 2 · Posição e Conforto na Bike

- **Subtitle:** "Cada pedalada começa no ajuste"
- **Conceito central:** A posição na bike é a raiz de 80% das dores e desconfortos no ciclismo de estrada. Selim, drop do guidão, comprimento do stem, ângulo dos tacos — cada variável afeta diferentes articulações. Bike fit profissional não é luxo para competidores; é investimento essencial desde o início.
- **Evidência científica:** Bini, R. et al. (2011). "Effects of bicycle saddle height on knee injury risk and cycling performance" — demonstra relação direta entre altura do selim e forças no joelho. Retül (sistema de bike fit 3D) documentação de referência.
- **Placeholders esperados:** `[main_bottleneck]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Se você sente dor no joelho depois de pedalar, a primeira coisa que seu coach vai olhar não é o treino — é a bike. Selim 2cm abaixo do ideal já coloca pressão extra no joelho a cada pedalada. Em 5.000 pedaladas por hora, essa conta fecha em lesão. Um bike fit profissional (R$300-600) é provavelmente o melhor investimento que você pode fazer no ciclismo."
- **Exemplo de texto técnico (30-40 palavras):** "Pressão patelar anterior correlaciona com selim baixo (ângulo de flexão do joelho >45° no ponto morto inferior). Avaliação cinemática 3D identifica desalinhamentos que geram sobrecargas articulares repetitivas."

### Pilar 3 · Nutrição no Pedal

- **Subtitle:** "O combustível que define o pedal"
- **Conceito central:** Nutrição ciclística tem dois momentos críticos: o que se consome DURANTE o pedal (carboidrato, hidratação, eletrólitos — crucial acima de 90 minutos) e a recuperação pós-pedal (proteína + carboidrato na janela de 30-60 minutos). No clima tropical brasileiro, hidratação e reposição de sódio são particularmente críticos. "Quebrar" (bonk) é quase sempre prevenível com ingestão planejada.
- **Evidência científica:** Jeukendrup, A. (2014). "A step towards personalized sports nutrition: carbohydrate intake during exercise" — recomendações de 60-90g carb/hora para esforço >2.5h. ACSM Position Stand on Exercise and Fluid Replacement (2007) — 500-800ml/hora.
- **Placeholders esperados:** `[kcal_per_hour]`, `[hydration_ml]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Já 'quebrou' no meio de um pedal longo? Aquela sensação de pernas de chumbo, tontura, vontade de parar? Isso é hipoglicemia — seu corpo ficou sem glicose. A regra é simples: acima de 90 minutos de pedal, comece a comer a cada 20-30 minutos. Gel, banana, barra — o que for. E beba ANTES de ter sede. No calor brasileiro, quando sente sede já perdeu ~2% do peso em suor."
- **Exemplo de texto técnico (30-40 palavras):** "Ingestão recomendada: 60-90g CHO/h para esforços >2.5h via transportadores duais (glicose+frutose). Hidratação: 500-800ml/h com 500-700mg Na⁺/L. Déficit hídrico >2% do peso corporal compromete termorregulação e performance."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Ciclismo de estrada (speed) para amadores brasileiros, do iniciante ao competidor. Público predominantemente masculino, 30-50 anos, classe média-alta, que pedala em estradas e grupões urbanos. Valoriza dados, performance e equipamento."

- **narrativeArc:**
  1. Validar a identidade ciclística ("você é um ciclista de verdade, independente do nível")
  2. Apresentar o diagnóstico do gargalo principal com empatia e especificidade
  3. Mostrar métricas pessoais (zonas, W/kg ou equivalentes) como ponto de partida concreto
  4. Desenvolver os 3 pilares como plano de ação conectado ao gargalo
  5. Contextualizar cada recomendação com a realidade do ciclista (volume, ferramenta, nível)
  6. Fechar com projeção realista de evolução e CTA para o profissional
  7. Direcionar ao profissional como parceiro de evolução, não como "autoridade que sabe mais"

- **terminology:** speed, grupão, pelotão, vácuo, puxar, clip, sapatilha, bretelle, zona, limiar, base, build, peak, FTP, watts, W/kg, cadência, subida, plano, segmento, PR, KOM, quebrar, estourar, longão, intervalado

- **forbiddenTerms:**
  - "bicicleta" (usar "bike" ou "speed" — "bicicleta" é genérico demais, perde identidade)
  - "ciclista de domingo" (pejorativo)
  - "marombeiro" (linguagem de academia, não de ciclismo)
  - "emagrecer" / "emagrecimento" (usar "composição corporal" ou "perder gordura" — ciclista não se vê como "público de emagrecimento")
  - "dieta" (usar "alimentação" ou "nutrição" — "dieta" tem conotação restritiva)
  - "pedalada" (redundante e informal demais — usar "pedal" ou "saída")
  - "sedentário" (ofensivo para quem pedala, mesmo que pouco)

- **recommendedTone:** "Técnico mas acessível — como um coach experiente explicando num café depois do grupão. Usa dados quando tem, percepção quando não tem. Nunca condescendente, nunca genérico. Respeita o nível declarado e ajusta profundidade automaticamente."

- **pillarGuidance:**
  1. "Estrutura: foque na distribuição 80/20 e na ideia de que treinar menos intenso na maioria das saídas paradoxalmente produz mais resultado. Use zonas de potência se disponível, FC se não, percepção de esforço se nada."
  2. "Posição: conecte qualquer dor/desconforto declarado à provável causa postural. Não prescreva ajustes específicos — direcione para bike fit profissional. Se não declarou dor, fale de prevenção e eficiência biomecânica."
  3. "Nutrição: foque em nutrição DURANTE o pedal (a mais negligenciada). Dê números concretos de carboidrato/hora e hidratação/hora. No pós-pedal, proteína + carboidrato. Sempre mencione o calor brasileiro como fator agravante."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `moderately_active` — justificativa: ciclista de estrada que preenche esse formulário pedala no mínimo 1-2x/semana, o que já é atividade moderada. Iniciante pode ser `lightly_active`, competidor com 5+ pedais será `very_active`.

- **activityMapping:**
  - Pergunta base: `weekly_rides`
  - Mapeamento:
    - `zero` → `sedentary` (inativo naquela semana — mas pode ser temporário)
    - `one_two` → `lightly_active`
    - `three_four` → `moderately_active`
    - `five_plus` → `very_active`
  - Ajuste: se `cycling_identity == competitor` E `weekly_rides >= three_four`, promover para `very_active` ou `extremely_active`

---

## 12 · Notas de design (decisões não-óbvias)

### Por que "Speed" e não "Road" ou "Ciclismo de Estrada"

No Brasil, NINGUÉM fala "road cycling" ou "ciclismo de estrada" no dia a dia. A palavra universal é "speed" — é como o público se identifica. Manter "Road" no label seria como chamar um template de corrida de "Running" em vez de "Corrida". O `specialty_code` proposto é `speed`.

### Por que NÃO inclui pergunta sobre meta de prova

Alternativa considerada: "Tem alguma prova nos próximos 3 meses?" — seria útil para periodização. Descartei porque: (1) maioria dos ciclistas amadores NÃO faz provas, (2) quem faz já está com assessoria/coach, (3) adiciona pergunta que não muda o relatório para 70%+ dos respondentes. Não passa no teste "se cortasse, o relatório mudaria?"

### Por que NÃO inclui pergunta sobre tipo de pedal (solo vs grupo)

Alternativa considerada: "Você pedala mais solo ou em grupo?" — descartei porque não muda substancialmente as recomendações de treino. Grupão vs solo afeta experiência social, não fisiologia. O pilar de estrutura de treino aplica-se igualmente.

### Por que `longest_ride` em vez de "quantos km por semana"

Km/semana exige cálculo mental e mistura intensidades. O pedal mais longo é: (1) mais fácil de lembrar (evento específico), (2) mais informativo sobre capacidade aeróbica, (3) respondível em 3 segundos. É a pergunta que um coach faria numa conversa rápida: "qual foi teu pedal mais longo recente?"

### Por que hipertensão e diabetes NÃO são safety triggers

Ambas são condições crônicas que geralmente estão controladas com medicação. Ciclismo é RECOMENDADO para ambas. Bloquear o relatório por hipertensão controlada geraria frustração no lead e perda de credibilidade. O relatório ajusta tom (ex: "evite sprints all-out sem aquecimento") mas não ativa safetyReduced.

### Por que `chest_pain` como opção separada de `cardiac`

Um ciclista pode ter dor no peito em esforço sem nunca ter sido diagnosticado com problema cardíaco. É o sintoma-sentinel que precede diagnóstico em muitos casos de doença coronariana assintomática. Separar permite safety trigger para o sintoma (urgente — investigue) sem duplicar com o diagnóstico (cardiopatia já conhecida e tratada, que tem sua própria opção).

### Por que apenas 3 branches e não 5 (um por gargalo)

O gargalo muda o FOCO dos pilares mas não muda as perguntas, as métricas calculadas ou o arco narrativo geral. Isso é melhor resolvido via `pillarGuidance` dinâmico (a IA recebe o gargalo e adapta o texto) do que via branch formal. Branches existem para mudanças ESTRUTURAIS — o que branch `starting` faz (omitir métricas avançadas, mudar arco inteiro) é qualitativamente diferente do que uma variação de gargalo faz.

---

## 13 · Pendências

### Perguntas incertas

- **`longest_ride` vs `average_ride_duration`:** Optei por longest_ride por ser mais concreto. Pode ser que duração média seja mais representativa do dia a dia. Testar com 5-10 ciclistas reais qual resposta vem mais rápido e com mais confiança.

### Cálculos cuja lib ainda não foi identificada

- **Zonas de potência Coggan:** cálculo trivial (percentuais do FTP), não precisa de lib. Pode ser calculado inline.
- **VO2max estimado (Storer et al.):** fórmula simples, pode ser inline. Verificar se alguma lib esportiva já implementa.
- **TSS:** fórmula conhecida mas requer NP (Normalized Power), que é um cálculo streaming sobre dados de potência — irrelevante aqui porque não temos dados do ride, apenas FTP declarado. Não calcular TSS no relatório.
- **Gasto calórico:** fórmula MET é simples (inline). Se houver lib tipo `sports-formulas` ou `fitness-calc` que já implemente, usar.

### Decisões que dependem de validação profissional

- **Faixas de `power_to_weight` para mulheres:** A tabela Coggan tem valores separados por sexo. Verificar se os valores que conheço estão atualizados. Mulheres ciclistas de estrada são ~10-15% do público — relevante mas minoritário.
- **Recomendação de hidratação em clima tropical:** Os 500-800ml/h são guidelines ACSM para clima temperado. Para o calor brasileiro (30-40°C + umidade), a recomendação prática pode ser maior. Consultar nutricionista esportivo brasileiro.

### Casos de borda

- **Ciclista que vem do MTB:** Pode ter alta capacidade aeróbica mas nenhuma experiência em posição de drop bar. O template captura via `cycling_identity == starting`, mas o copy poderia ser mais específico para "migração de modalidade".
- **Ciclista com deficiência (paracyclismo):** Fora do escopo deste template. Necessidades muito específicas de adaptação.
- **E-bike (bike elétrica de estrada):** Crescendo no Brasil. O template não distingue entre bike convencional e e-bike. As métricas de potência são diferentes (assist vs leg power). Para MVP, ignorar — e-bike de estrada é nicho ainda pequeno no Brasil.

---

## 14 · Fontes citadas

1. Coggan, A. & Allen, H. (2010). _Training and Racing with a Power Meter_, 2nd ed. VeloPress. — Zonas de potência, classificação W/kg, conceitos de TSS/NP/IF.
2. Seiler, S. (2010). "What is best practice for training intensity and duration distribution in endurance athletes?" _International Journal of Sports Physiology and Performance_, 5(3), 276-291. — Distribuição 80/20 polarizada.
3. Tanaka, H., Monahan, K. D., & Seals, D. R. (2001). "Age-predicted maximal heart rate revisited." _Journal of the American College of Cardiology_, 37(1), 153-156. — Fórmula FCmax: 208 − 0.7×idade.
4. Jeukendrup, A. (2014). "A step towards personalized sports nutrition: carbohydrate intake during exercise." _Sports Medicine_, 44(S1), 25-33. — 60-90g CHO/hora para esforço prolongado.
5. ACSM (2007). "Exercise and Fluid Replacement." _Medicine & Science in Sports & Exercise_, 39(2), 377-390. — Hidratação 500-800ml/hora.
6. Bini, R., Hume, P. A., & Croft, J. L. (2011). "Effects of bicycle saddle height on knee injury risk and cycling performance." _Sports Medicine_, 41(6), 463-476. — Relação selim-joelho.
7. Storer, T. W., Davis, J. A., & Caiozzo, V. J. (1990). "Accurate prediction of VO2max in cycle ergometry." _Medicine & Science in Sports & Exercise_, 22(5), 704-712. — Fórmula VO2max para ciclismo.
8. Ticket Sports (2025). _Perfil do Atleta Brasileiro 2025_. — Demografia de participantes de provas de ciclismo no Brasil.
9. Aliança Bike (2025). _MTB no MAPA 2025_. — Dados complementares do perfil do ciclista brasileiro.
10. Diretriz Brasileira de Cardiologia do Esporte, SBC (2019). — Avaliação pré-participação esportiva com ECG.

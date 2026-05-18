# Research · Especialidade 29 · Natação Masters

## 0 · Metadados

- **Número:** 29
- **Modality:** natacao
- **Pasta:** `natacao/29-masters/`
- **Plano:** pro
- **Validação clínica:** ⚠️ Recomendada (cardiologista esportivo para faixas 60+; fisioterapeuta esportivo para protocolo de ombro)
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. Tanaka & Seals, "Endurance exercise performance in Masters athletes", _J Physiol_ 2008
  2. Tanaka & Seals, "Declines in swimming performance with age", _J Appl Physiol_ 2003
  3. "Effects of aging in Masters swimmers: 40-year review", _Open Access J Sports Med_ 2013
  4. "Prevention and Treatment of Swimmer's Shoulder", _Int J Sports Phys Ther_ 2010
  5. "Hypothesized mechanisms of death in swimming", _BMC Sports Sci Med Rehabil_ 2023
  6. "Freestyle master's swimming: performance trends 1986-2024", _PLOS ONE_ 2024
  7. ABMN (Associação Brasileira de Masters de Natação) — regulamentos e rankings
  8. "A representação social de nadadores masters campeões", _RBCE_

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária:** 25-70+, com concentração forte entre 30-54 anos. Categorias ABMN/World Aquatics em faixas de 5 anos (25-29, 30-34... até 95-99). Existe também o Pré-Master (20-24).
- **Gênero:** ~55-60% masculino em competições; tendência à paridade na natação recreativa master.
- **Socioeconômico:** Classe B e acima. Natação exige infraestrutura cara (mensalidade de academia/clube, equipamento, inscrição em competições). Público predominantemente urbano, com ensino superior, concentrado no Sudeste (SP, RJ, MG) e Sul (RS, SC).
- **Dois perfis distintos:**
  1. **Ex-nadador competitivo** retornando após 10-20 anos de hiato (30-45 anos). Tem base técnica, mas corpo já não suporta mesmo volume. Alto risco de lesão por excesso.
  2. **Adulto que começou a nadar por saúde** e foi "fisgado" pela progressão técnica/competição (35-55 anos). Técnica limitada, frequentemente autodidatas. Alta motivação, mas patina em platôs.

### Ordem de grandeza

- **Competidores registrados:** 3.000-5.000 ativos no circuito ABMN.
- **Praticantes recreativos master (sem competir):** 30.000-100.000. É o público-alvo principal — quem treina 2-3x/semana na academia, sem coach estruturado, e que seria lead de um treinador especializado.

### Onde estão online

- **Instagram:** Seguem @abmnatacao (8k+), @cbdaoficial, treinadores de natação especializados. Stories de treino e resultados de competição são o formato dominante.
- **WhatsApp:** Grupos regionais por estado/clube — principal canal de logística (caronas para competições, horários de treino, convites para treinos coletivos).
- **Facebook:** Ainda ativo para a faixa 40+, especialmente em grupos de natação por cidade/estado.
- **YouTube:** Canais técnicos (Swim Smooth, Effortless Swimming) são referência mesmo em inglês. Brasileiro: Viva Assessoria.
- **Apps:** MySwimPro, Swim.com, Garmin Connect (para quem usa relógio com GPS aquático).

### Linguagem-padrão

- **Termos de identidade:** "atleta master", "nadador master", "máster" (com acento, popular). Usam faixa etária como badge de honra ("categoria 35-39").
- **Treino:** "tiro" (rep), "série" (set), "a cada" (intervalo de saída), "educativo" (drill), "progressivo", "negativo" (second-half faster).
- **Equipamento:** "palmar" (paddle), "nadadeira" (fin), "prancha" (kickboard), "pullbuoy", "snorkel frontal".
- **Nados:** "crawl/nado livre", "costas", "peito", "borboleta/golfinho", "medley".
- **Métricas:** "pace", "SWOLF", "braçadas por piscina", "tempo de prova".

### O que os ofende ou afasta

- **"Idoso", "velho", "terceira idade"** → ofensivo. São "atletas master", ponto.
- **"Amador"** → implica falta de seriedade. Masters levam competição MUITO a sério.
- **"Declínio", "perda", "limitação da idade"** → framing negativo. Usar "evolução", "adaptação", "superação dentro da categoria".
- **"Para a sua idade"** → patronizing. Comparar dentro da categoria, nunca contra padrão absoluto.
- **Formulário genérico** que não entende nada de natação → fecha na hora. Esse público é técnico e detecta improviso.

### Dor mais comum que os leva a procurar ajuda

**Platô de performance + dor no ombro.** O nadador master treina há meses/anos, sente que estagnou (mesmo tempo na prova, mesma sensação na água), e possivelmente começa a sentir desconforto no ombro. Quer alguém que estruture o treino com periodização real, corrija técnica, e previna lesão — não só "nade mais metros".

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Nadadores master e pré-master (20+) de **piscina** — recreativos e competitivos
- Todos os nados (crawl, costas, peito, borboleta, medley)
- Objetivos: melhorar técnica, baixar tempo, preparar competição, manter saúde, retornar após hiato
- Faixas até ~75 anos (acima disso, volume de praticantes é residual)

### Este template NÃO vai cobrir:

- **Águas abertas** → template #28 (natacao/28-aguas_abertas/) cobre isso. Há crossover, mas a preparação é fundamentalmente diferente (navegação, sighting, água fria, correnteza).
- **Natação terapêutica/reabilitação** → não é competição ou performance, é saúde clínica.
- **Triathlon** → futuro, requer gerenciar 3 disciplinas.
- **Crianças/adolescentes** em natação competitiva → fora do escopo master.

### Decisão de label

O label **"Natação Masters"** está correto e é o termo oficial usado pela ABMN e World Aquatics. "Veteranos" pode soar pejorativo para a faixa 25-40. Proponho:

- **Label público (hub):** "Natação Masters"
- **`specialty_code`:** `masters_swimming`
- **Slug:** mantém `29-masters`

---

## 3 · Motores escolhidos

### Decisão narrativa

**Motores considerados:**

1. **Motor 6 (Identidade/Fase)** como segmentação — o nadador master está em uma de três fases claras: voltando à natação, treinando regularmente, ou competindo ativamente. Essa fase muda radicalmente o tom do relatório. → **INCLUÍDO** como Motor de Segmentação.

2. **Motor 2 (Gargalo)** — obrigatório. O que trava o master é muito específico: técnica estagnada, falta de periodização, dor no ombro, inconsistência. → **INCLUÍDO**.

3. **Motor 4 (Comportamento/Consistência)** — frequência real de treino é a variável #1 para prescrição em natação master. Quem treina 2x/semana recebe plano fundamentalmente diferente de quem treina 5x. → **INCLUÍDO**.

4. **Motor 7 (Métricas/Ferramentas)** — natação é extremamente dependente de métricas (pace, SWOLF, CSS). Saber se o nadador monitora permite calibrar o nível técnico do relatório. → **INCLUÍDO**, com sub-perguntas condicionais.

5. **Motor 8 (Liberação/Risco)** — obrigatório. População com risco cardiovascular real (especialmente 50+), prevalência altíssima de lesão de ombro. → **INCLUÍDO**.

**Motores descartados:**

- **Motor 1 (Contexto Atual)** → absorvido pelo Motor 6 (fase já define contexto) e Motor 4 (frequência).
- **Motor 3 (Nível/Maturidade)** → parcialmente absorvido pelo Motor 6 (fase implica maturidade) e Motor 7 (quem monitora CSS é claramente avançado).
- **Motor 5 (Ambiente/Disponibilidade)** → natação master é 99% em piscina de clube/academia. Não muda recomendação o suficiente para justificar pergunta. A variável que importa (frequência/sessão) está no Motor 4.

### Lista final (5 motores → 6 perguntas + 1 condicional = 7 perguntas)

1. **Segmentação (Motor 6 — Identidade/Fase)** → `swimming_phase` — Em que momento da natação o aluno está
2. **Gargalo (Motor 2)** → `main_barrier` — O que mais trava a evolução
3. **Comportamento (Motor 4)** → `weekly_frequency` — Frequência real de treino semanal
4. **Comportamento (Motor 4)** → `session_volume` — Volume típico por sessão
5. **Métricas (Motor 7)** → `metric_tracking` — Se monitora métricas de nado
6. **Métricas (Motor 7)** → `known_css` — CSS/pace conhecido (condicional)
7. **Safety (Motor 8)** → `health_conditions` — Condições de saúde relevantes

---

## 4 · Perguntas e opções

### Q1 · `swimming_phase` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Qual sua fase na natação hoje?"
**Helper:** "Escolha a que mais se parece com você"
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`returning`** — "Retornando à natação"
  - Safety trigger? Não

- **`recreational`** — "Treino regular, sem competir"
  - Safety trigger? Não

- **`competitive`** — "Treino e compito em provas master"
  - Safety trigger? Não

**Justificativa da pergunta:** A fase define o tom, a profundidade técnica e o foco do relatório inteiro. Um nadador retornando precisa de cautela e progressão; um recreativo precisa de motivação e estrutura; um competitivo precisa de precisão e periodização. Alternativa descartada: "Há quanto tempo nada?" — é menos identitária e não captura intenção.

**Justificativa das opções:** Cobrem ~95% dos masters. Caso de borda: o nadador que nunca nadou e está começando do zero aos 40 — esse é melhor atendido pelo template #25 (adulto iniciante). Se a pesquisa mostrar volume significativo, podemos adicionar opção "começando agora", mas provavelmente seria branch raso demais (melhor redirecionar).

---

### Q2 · `main_barrier` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais te trava hoje na natação?"
**Helper:** "O principal obstáculo — pode ter mais de um, mas escolha o maior"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`technique_plateau`** — "Sinto que minha técnica estagnou"
  - Safety trigger? Não

- **`shoulder_pain`** — "Dor ou desconforto no ombro"
  - Safety trigger? Não (dor crônica gerenciável ≠ lesão aguda)

- **`no_structure`** — "Treino sem estrutura ou plano"
  - Safety trigger? Não

- **`inconsistency`** — "Não consigo manter regularidade"
  - Safety trigger? Não

- **`competition_prep`** — "Quero baixar meu tempo em provas"
  - Safety trigger? Não

**Justificativa da pergunta:** Cada gargalo gera recomendação radicalmente diferente nos pilares. Alternativa descartada: "O que você gostaria de melhorar?" — é aspiracional, não diagnóstico. O gargalo captura a dor real.

**Justificativa das opções:** Cobrem os 5 problemas dominantes na literatura e na prática de coaching de masters. Caso de borda: "ansiedade em águas abertas" — fora do escopo (template #28). "Problemas de respiração" — é sub-caso de técnica, não precisa de opção separada.

---

### Q3 · `weekly_frequency` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Na última semana, quantas vezes você nadou?"
**Helper:** "Conte apenas sessões de pelo menos 30 minutos"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`0_1x`** — "0-1 vez"
  - Safety trigger? Não

- **`2_3x`** — "2-3 vezes"
  - Safety trigger? Não

- **`4_5x`** — "4-5 vezes"
  - Safety trigger? Não

- **`6_plus`** — "6 ou mais vezes"
  - Safety trigger? Não

**Justificativa da pergunta:** Frequência real (última semana, não intenção) é o dado comportamental mais importante para calibrar volume de prescrição. Pergunta sobre "quantas vezes pretende treinar" captura desejo, não realidade. O hack de "última semana" força resposta honesta.

**Justificativa das opções:** 4 faixas cobrem o espectro inteiro. Pesquisa mostra que a distribuição real é bimodal: pico em 2-3x (recreativos) e pico em 4-5x (competitivos).

---

### Q4 · `session_volume` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Quanto você nada por sessão, normalmente?"
**Helper:** "Estimativa — não precisa ser exato"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`under_1500`** — "Menos de 1.500m"
  - Safety trigger? Não

- **`1500_2500`** — "1.500 a 2.500m"
  - Safety trigger? Não

- **`2500_4000`** — "2.500 a 4.000m"
  - Safety trigger? Não

- **`over_4000`** — "Mais de 4.000m"
  - Safety trigger? Não

**Justificativa da pergunta:** Volume por sessão + frequência = carga semanal total, que é a variável-chave para prescrição e risco de lesão. Alternativa descartada: "tempo de sessão" — menos preciso, pois velocidade varia muito entre nadadores.

**Justificativa das opções:** 4 faixas mapeiam diretamente às categorias da literatura de treinamento de natação master (Maglischo, Sweetenham). Cobrem desde iniciante até atleta de alto volume.

---

### Q5 · `metric_tracking` _(Motor 7 — Métricas/Ferramentas)_

**Type:** `single_choice`
**Label (client-facing):** "Você acompanha métricas do seu nado?"
**Helper:** "Pace, braçadas, tempo de prova, relógio de natação..."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`nothing`** — "Não acompanho nada"
  - Safety trigger? Não

- **`basic`** — "Tempo e pace por 100m"
  - Safety trigger? Não

- **`advanced`** — "SWOLF, CSS, zonas de pace, ou uso relógio de natação"
  - Safety trigger? Não

**Justificativa da pergunta:** Define o nível de literacia técnica do nadador e calibra o relatório. Se não acompanha nada, relatório é narrativo e educativo. Se usa CSS, relatório pode ser prescritivo com zonas. Alternativa descartada: "Você tem relógio de natação?" — é sobre o equipamento, não sobre o comportamento. Quem tem relógio e não olha os dados é diferente de quem usa cronômetro de parede e anota tudo.

**Justificativa das opções:** 3 níveis são suficientes. A escala nothing → basic → advanced mapeia diretamente a progressão natural de monitoramento em natação. Não precisa de "intermediário" — basic já é o intermediário.

---

### Q6 · `known_css` _(Motor 7 — Métricas, condicional)_

**Type:** `number`
**Label (client-facing):** "Qual seu pace CSS (em segundos por 100m)?"
**Helper:** "Se não sabe exato, seu pace confortável para 400m contínuos"
**Required:** não
**Visibility:** "if metric_tracking == advanced"
**Segmentação:** não
**depthRequired:** detailed

**Justificativa da pergunta:** CSS é o dado de entrada mais valioso para cálculos de zonas de treino em natação. Só aparece para quem já indicou monitoramento avançado — quem não sabe o que é CSS nunca vê essa pergunta. O campo numérico permite cálculos diretos no engine (zonas de pace, projeção de tempos).

**Alternativa descartada:** Pedir tempo de 400m e 50m para calcular CSS automaticamente — duas perguntas numéricas é muito para um formulário mobile. Se o nadador sabe o CSS, informa direto. Se não sabe, o relatório sugere como testar.

---

### Q7 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Marque todas que se aplicam — é para personalizar suas recomendações"
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 5

**Opções:**

- **`none`** — "Nenhuma dessas"
  - Safety trigger? Não

- **`shoulder_injury`** — "Lesão ou cirurgia no ombro"
  - Safety trigger? **Sim** (reason: "Lesão estrutural de ombro ou pós-cirúrgico requer avaliação de fisioterapeuta antes de prescrição de volume/intensidade")

- **`cardiac_condition`** — "Problema cardíaco (arritmia, infarto prévio, cirurgia cardíaca)"
  - Safety trigger? **Sim** (reason: "Risco de evento cardíaco agudo durante imersão — requer liberação cardiológica e teste ergométrico recente")

- **`hypertension`** — "Hipertensão"
  - Safety trigger? Não (hipertensão controlada é ajuste de tom, não bloqueio)

- **`diabetes`** — "Diabetes"
  - Safety trigger? Não (ajuste de tom e recomendação, não bloqueio — exceto se insulino-dependente sem controle, mas isso seria caso clínico)

- **`epilepsy`** — "Epilepsia ou convulsões"
  - Safety trigger? **Sim** (reason: "Risco de afogamento em caso de crise convulsiva na água — requer acompanhamento médico e supervisão presencial obrigatória")

**Justificativa da pergunta:** Triagem de segurança obrigatória. Em natação master, os riscos relevantes são: ombro (prevalência 40-90%), cardíaco (risco real em 50+), e epilepsia (risco de afogamento). Hipertensão e diabetes são ajustes de tom, não bloqueio.

**Justificativa das opções:** 5 condições + "nenhuma" cobrem os cenários clinicamente relevantes para natação. Alternativa descartada: "dor lombar", "problema cervical" — são relevantes mas não são safety triggers; ajustam recomendação de nados (evitar borboleta) sem bloquear o relatório.

---

## 5 · Branches

### Branch: `Retornando` (trigger: `swimming_phase == returning`)

- **Tom geral:** Acolhedor + cauteloso + validante. "Voltar exige mais coragem do que começar." Foco em progressão segura.
- **pillarGuidance:** Pilares enfatizam reconstrução de base (não performance), prevenção de lesão de recomeço, e marcos de progresso de curto prazo (primeiras 4-8 semanas).
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Omitir projeção de tempos de prova (irrelevante). Enfatizar SWOLF como métrica de evolução técnica (não competitiva).
- **Narrative arc override:** Arco de "redescoberta" — validar o passado do nadador, reconhecer que o corpo mudou, projetar os primeiros marcos alcançáveis.

**Justificativa:** O nadador retornando tem necessidades emocionais e físicas radicalmente diferentes. Falar de CSS ou taper para alguém que não nada há 10 anos é irrelevante e potencialmente desmotivante. O relatório precisa validar a decisão de voltar e dar o primeiro passo concreto.

### Branch: `Recreativo` (trigger: `swimming_phase == recreational`)

- **Tom geral:** Motivacional + educativo. "Você já está fazendo — agora vamos fazer render." Foco em estrutura e evolução perceptível.
- **pillarGuidance:** Pilares enfatizam estrutura de treino (sair do "nadar metros aleatórios"), ganhos de eficiência técnica, e opcionalmente introduzir a ideia de competições como motivação.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** padrão
- **Narrative arc override:** Arco de "upgrade" — de nadador que frequenta a piscina para nadador que treina com propósito.

**Justificativa:** O recreativo é o público mais numeroso e mais convertível. O relatório precisa mostrar que "treinar é diferente de nadar" sem ser condescendente. A mudança substantiva está no foco dos pilares (técnica + estrutura vs performance + competição).

### Branch: `Competitivo` (trigger: `swimming_phase == competitive`)

- **Tom geral:** Técnico + direto + assertivo. Sem motivação vazia — dados, zonas, periodização.
- **pillarGuidance:** Pilares enfatizam periodização para prova-alvo, trabalho de velocidade/potência, taper, e prevenção de overtraining.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Incluir projeção de tempos. Se CSS informado, calcular zonas de pace. FINA points como referência.
- **Narrative arc override:** Arco de "precisão" — diagnóstico do status atual, identificação do limitante principal, plano tático para próximo ciclo.

**Justificativa:** O competitivo espera profundidade técnica. Um relatório genérico ou motivacional para quem já compete é sinal de incompetência do profissional. A mudança substancial: métricas avançadas, linguagem técnica permitida, foco em resultados mensuráveis.

---

## 6 · Safety triggers

| Questão             | Opções              | Reason (clínico)                                                                                                                                                                                                       | Efeito no relatório                                                                                                                                                                         |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `health_conditions` | `shoulder_injury`   | Lesão estrutural de ombro requer avaliação de fisioterapeuta antes de prescrição de volume/nados. Risco de agravamento com palmares e nados de alto stress (borboleta, crawl com recuperação alta).                    | Macros de volume omitidas. Pilar de treino menciona adaptações mas não prescreve séries. SafetyNote com orientação a procurar fisioterapeuta esportivo.                                     |
| `health_conditions` | `cardiac_condition` | Risco de evento cardíaco agudo durante imersão em água. Estudos mostram patologias cardíacas em 78% dos afogamentos de nadadores competentes (BMC Sports Sci Med Rehabil, 2023). Exige liberação cardiológica recente. | Intensidade omitida. Zonas de pace omitidas. Timeline omitida. SafetyNote com orientação a apresentar liberação cardiológica + teste ergométrico ao profissional antes de iniciar programa. |
| `health_conditions` | `epilepsy`          | Risco direto de afogamento em caso de crise convulsiva na água. Mesmo epilepsia controlada requer supervisão presencial obrigatória.                                                                                   | SafetyNote severo: natação apenas com supervisão presencial, nunca sozinho. Orientação a comunicar equipe do clube/academia sobre a condição.                                               |

**safetyTemplate** (texto quando trigger ativa):

- **Title:** "Sua saúde merece atenção especial"
- **Body:** "Com base nas suas respostas, identificamos que você tem uma condição que exige acompanhamento profissional presencial antes de seguir um programa de natação. Isso não é uma limitação — nadadores com [condição] obtêm resultados excepcionais com a orientação certa. O próximo passo é conversar com [profissional_nome] e, se necessário, apresentar uma liberação médica. A partir daí, seu treino será personalizado com a segurança que você merece."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `swolf_estimate`

- **O que é:** SWOLF estimado (tempo em segundos + contagem de braçadas por 25m)
- **Por que aparece para o aluno:** É a métrica de eficiência mais intuitiva — número menor = nado mais eficiente. Fácil de medir sozinho, tangível, e mostra evolução rápida com trabalho técnico.
- **Cálculo:** Estimativa baseada no pace informado e volume/frequência. Se pace = 2:00/100m → ~30s/25m. Stroke count estimado por regressão linear (nadadores recreativos: 18-22 braçadas/25m; competitivos: 14-18). SWOLF = tempo + braçadas. Alternativa: usar contagem real se implementar campo numérico futuro.
- **Visualização proposta:** Gauge radial com faixas (Excelente <35 | Bom 35-45 | Regular 45-55 | A melhorar >55). Rationale: gauge mostra posição relativa numa escala, incentiva melhoria.
- **Placeholder:** `[swolf_estimate]`

### 7.2 · `weekly_volume_total`

- **O que é:** Volume semanal total estimado (metros)
- **Por que aparece para o aluno:** Contexto concreto — "você nada X metros por semana" é mais tangível que "você treina 3 vezes". Permite comparação com recomendações para o nível.
- **Cálculo:** `frequência_semanal × volume_por_sessão_médio`. Ex: 3x/semana × 2.000m = 6.000m/semana.
- **Visualização proposta:** Card numérico com comparação vs recomendação por fase. Ex: "6.000m/semana — dentro da faixa recomendada para nadadores recreativos (4.500-9.000m)".
- **Placeholder:** `[volume_semanal]`

### 7.3 · `css_zones` (condicional — só se `known_css` informado)

- **O que é:** Zonas de pace baseadas no CSS (Critical Swim Speed)
- **Por que aparece para o aluno:** Transforma um número abstrato (CSS) em prescrição acionável ("sua zona A1 é entre 2:10 e 2:20/100m").
- **Cálculo:** CSS como limiar (zona A2). A1 = CSS + 10-15%. A3 = CSS - 5%. Sprint = CSS - 10-15%. Baseado no modelo de Ginn (2004) e adaptado pela prática de treinamento de natação.
- **Visualização proposta:** Zone table horizontal com 4 faixas coloridas (A1 azul/recuperação, A2 verde/limiar, A3 amarelo/VO2, Sprint vermelho). Rationale: zone table é o padrão visual para zonas de treino em qualquer esporte de endurance.
- **Placeholder:** `[zona_a1]`, `[zona_a2]`, `[zona_a3]`, `[zona_sprint]`

### 7.4 · `meta_kcal`

- **O que é:** Gasto calórico estimado por sessão e por semana
- **Por que aparece para o aluno:** Relevante especialmente para quem busca composição corporal. Natação tem gasto calórico alto mas frequentemente subestimado.
- **Cálculo:** MET da natação (crawl moderado = 7.0 METs, crawl vigoroso = 10.0 METs, de acordo com Compendium of Physical Activities) × peso × duração. MET ajustado pelo volume e intensidade implícita na frequência + volume informados.
- **Visualização proposta:** Card numérico duplo — "por sessão" e "por semana". Rationale: card simples, comparável entre sessões.
- **Placeholder:** `[kcal_sessao]`, `[kcal_semana]`

### 7.5 · `hydration_target`

- **O que é:** Meta de hidratação diária estimada
- **Por que aparece para o aluno:** Desidratação em natação é subestimada (o nadador não percebe suor dentro d'água). Relevante e acionável.
- **Cálculo:** Fórmula base (35ml/kg) + ajuste por volume de treino (+500ml por sessão acima de 1h). Referência: ACSM position stand on hydration.
- **Visualização proposta:** Card numérico simples com ícone de gota.
- **Placeholder:** `[meta_agua]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `adherence_risk_score`

- **O que é:** Score de risco de abandono (0-100) baseado em frequência real, consistência, fase, e gargalo declarado.
- **Por que importa para o PT:** Identifica leads com alto risco de desistir nas primeiras 4 semanas — permite intervenção proativa (mensagem de check-in, ajuste de plano).
- **Cálculo:** Ponderação de fatores: frequência baixa (+30), gargalo = inconsistência (+25), fase = retornando (+15), sem métricas (+10). Score > 60 = alto risco.
- **Visualização proposta:** Semáforo (verde/amarelo/vermelho) no card do lead. Rationale: decisão binária (precisa de atenção ou não).

### 8.2 · `training_load_weekly`

- **O que é:** Carga de treino semanal estimada (frequência × volume × intensidade implícita)
- **Por que importa para o PT:** Permite classificar o lead em faixa de treinabilidade e calibrar a primeira prescrição sem adivinhar.
- **Cálculo:** frequência × volume_médio × fator_de_intensidade (derivado de metric_tracking: nothing=0.6, basic=0.7, advanced=0.8 — quem monitora treina com mais intenção).
- **Visualização proposta:** Barra horizontal com faixas (Baixo/Moderado/Alto/Muito Alto).

### 8.3 · `injury_flag`

- **O que é:** Flag binário de risco de lesão, com classificação (ombro, overuse, cardíaco)
- **Por que importa para o PT:** Determina se o PT precisa pedir laudos médicos antes de iniciar o programa.
- **Cálculo:** Baseado em health_conditions + volume (>4x + >3000m + shoulder_injury = flag vermelho de overuse). Regra lógica, não fórmula.
- **Visualização proposta:** Badge com ícone + texto curto ("Ombro: atenção", "Cardíaco: exige liberação").

### 8.4 · `technical_level_estimate`

- **O que é:** Estimativa do nível técnico (iniciante/intermediário/avançado) baseada em fase + métricas + volume
- **Por que importa para o PT:** Calibra a comunicação e a complexidade do plano prescrito.
- **Cálculo:** Heurística: competitive + advanced metrics = avançado. recreational + basic = intermediário. returning + nothing = iniciante. Ponto: SWOLF estimado se disponível.
- **Visualização proposta:** Badge textual com descrição curta.

### 8.5 · `fina_points_estimate` (condicional — se CSS informado)

- **O que é:** Estimativa de FINA points baseada no CSS convertido para projeção de 100m livre
- **Por que importa para o PT:** Permite classificar o nível competitivo do lead objetivamente, comparável entre idades e provas.
- **Cálculo:** Points = 1000 × (World Record Masters por faixa etária / Tempo projetado)³. World records disponíveis em masterstiming.com e ABMN.
- **Visualização proposta:** Card numérico com escala descritiva (200-400 = recreativo, 400-600 = competitivo regional, 600-800 = competitivo nacional, 800+ = elite).

---

## 9 · Pilares do relatório

### Pilar 1 · Eficiência Técnica

- **Subtitle:** "Nadar melhor antes de nadar mais"
- **Conceito central:** Em natação, técnica domina performance. Reduzir arrasto é mais eficiente que aumentar potência. Educativos específicos, foco em DPS (distância por braçada), e trabalho de posição do corpo são as maiores alavancas para qualquer nível.
- **Evidência científica:** Toussaint & Beek (1992) — até 90% da variação de velocidade em natação é explicada por técnica (arrasto e propulsão), não por capacidade aeróbica.
- **Placeholders esperados no copy:** `[swolf_estimate]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Seu SWOLF estimado está em [swolf_estimate] — isso significa que sua combinação de velocidade e eficiência tem espaço concreto de melhoria. Nadadores que focam em reduzir uma braçada por piscina sem perder velocidade costumam ver ganhos de 3-5% no pace em 6-8 semanas. O segredo não é força — é posição do corpo e timing da braçada. [profissional_nome] pode filmar seu nado e identificar onde você perde energia."
- **Exemplo de texto técnico (30-40 palavras):** "SWOLF [swolf_estimate]. Foco recomendado: redução de arrasto frontal via posição de cabeça neutra, catch em early vertical forearm, e rotação de quadril sincronizada. Trabalho de educativos 2-3x/semana, 400-600m por sessão."

### Pilar 2 · Estrutura e Periodização

- **Subtitle:** "Treinar com plano muda tudo"
- **Conceito central:** A maioria dos masters nada metragem aleatória sem estímulo progressivo. Periodização — mesmo simplificada (base → construção → afinamento) — gera resultados mensuráveis em 8-12 semanas. Frequência e consistência valem mais que volume bruto.
- **Evidência científica:** Maglischo (2003) — Swimming Fastest: periodização em natação com base científica. Costill et al. (1991) — resposta de performance a diferentes modelos de periodização em nadadores.
- **Placeholders esperados no copy:** `[volume_semanal]`, `[frequencia]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Você nada [volume_semanal] metros por semana, [frequencia] vezes. Isso é uma base sólida — mas sem plano, o corpo se acostuma e para de evoluir. Imagine dividir suas sessões em dias com foco diferente: um dia de resistência longa, um de velocidade curta, um de técnica. Em 8 semanas, nadadores que saem do 'treino igual todo dia' costumam baixar 3-8 segundos no pace de 100m. [profissional_nome] monta esse plano sob medida."
- **Exemplo de texto técnico (30-40 palavras):** "Volume semanal: [volume_semanal]m. Distribuição recomendada: 60% A1 (aeróbico), 20% A2 (limiar/CSS), 15% A3 (VO2), 5% sprint. Mesociclo de 4 semanas com deload na 4ª semana (redução de 30-40% do volume)."

### Pilar 3 · Prevenção e Longevidade

- **Subtitle:** "Nadar por muitos anos ainda"
- **Conceito central:** O nadador master precisa cuidar do corpo para que a natação seja sustentável por décadas. Ombro saudável, mobilidade torácica, fortalecimento de estabilizadores, e gerenciamento de carga são tão importantes quanto a performance. Autocuidado não é fraqueza — é estratégia de quem quer estar nadando aos 70.
- **Evidência científica:** Tanaka & Seals (2008) — performance declina ~0.6%/ano linearmente até 70; masters que mantêm treinamento consistente preservam VO2max significativamente acima da curva de envelhecimento. "Prevention and Treatment of Swimmer's Shoulder" (2010) — fortalecimento de manguito rotador + serratus anterior reduz incidência de impingement em 60%.
- **Placeholders esperados no copy:** `[frequencia]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "A cada década, o corpo muda — e a beleza da natação master é que ela se adapta a cada fase. Nadadores que incluem 10-15 minutos de mobilidade de ombro e fortalecimento fora d'água por semana reduzem drasticamente o risco de lesão que mais afasta pessoas da piscina. Não é sobre nadar apesar da idade — é nadar COM a experiência que a idade traz. [profissional_nome] entende essa jornada."
- **Exemplo de texto técnico (30-40 palavras):** "Protocolo preventivo: mobilidade torácica + fortalecimento de manguito rotador (external rotation, Y-raise, serratus punch) 2x/semana. Limitar palmares a 20% do volume total. Monitorar dor de ombro na escala DASH mensalmente."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Natação Masters é a prática competitiva e recreativa de natação em piscina por adultos de 20+ anos, organizada em categorias de 5 em 5 anos. O público vai do ex-nadador retornando ao atleta que disputa campeonatos brasileiros. É um nicho técnico, informado, e que valoriza profundidade — formulário genérico é inaceitável."

- **narrativeArc:**
  1. Reconhecimento do estágio atual do nadador (fase + gargalo) — validar sem julgar
  2. Diagnóstico técnico baseado nos dados (SWOLF, volume, frequência) — objetivo e claro
  3. Contextualização: o que o gargalo informado significa na prática de natação master
  4. Pilar 1: Eficiência técnica — o que mudar para evoluir
  5. Pilar 2: Estrutura e periodização — como organizar a semana
  6. Pilar 3: Prevenção e longevidade — como cuidar do corpo
  7. Próximo passo: ponte para o profissional como caminho natural (não pitch)

- **terminology:** ["pace", "SWOLF", "educativo", "série", "tiro", "A1/A2/A3", "crawl", "nado livre", "medley", "CSS", "braçada", "palmar", "pullbuoy", "prancha", "nadadeira", "piscina curta/longa", "virada", "saída", "chegada", "afinamento/taper", "base aeróbica", "limiar", "progressivo", "negativo"]

- **forbiddenTerms:**
  - "idoso" / "velho" / "terceira idade" → usar "atleta master", "nadador master", categoria de idade
  - "amador" → implica falta de seriedade
  - "declínio" / "perda" / "deterioração" → usar "evolução", "adaptação", "ajuste"
  - "para a sua idade" → patronizing; comparar dentro da categoria
  - "sedentário" → carrega julgamento, mesmo se tecnicamente aplicável ao retornante
  - "fórmula mágica" / "resultado rápido" / "transformação" → marketing vazio, público detecta

- **recommendedTone:** "Técnico porém acessível. Trate o nadador como adulto informado que merece profundidade, não como leigo que precisa de motivação vazia. Credibilidade vem de precisão, não de entusiasmo. Quando falar de limitações, frame como dados, não como problemas."

- **pillarGuidance:**
  1. "Eficiência Técnica: foque em métricas concretas (SWOLF, stroke count, DPS). Cite educativos específicos quando relevante. Evite 'melhore sua técnica' genérico — diga O QUE melhorar e POR QUE aquilo importa."
  2. "Estrutura e Periodização: conecte volume e frequência informados com distribuição recomendada. Se o nadador treina sem plano, explique a diferença entre 'nadar metros' e 'treinar'. Se já compete, fale de periodização para prova-alvo."
  3. "Prevenção e Longevidade: normalize o autocuidado. Exercícios preventivos de ombro, mobilidade, e deload não são 'coisa de fraco'. Frame como estratégia inteligente de quem quer nadar por mais 20-30 anos."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `moderately_active` — nadadores master que preenchem o formulário tipicamente já treinam 2-3x/semana; são moderadamente ativos por definição. O lead inativo não procura um treinador de natação master.

- **activityMapping:** A pergunta `weekly_frequency` mapeia:
  - `0_1x` → `lightly_active`
  - `2_3x` → `moderately_active`
  - `4_5x` → `very_active`
  - `6_plus` → `extremely_active`

---

## 12 · Notas de design (decisões não-óbvias)

### Por que "Natação Masters" e não "Natação Veteranos"

"Veteranos" tem conotação ambígua em pt-BR — pode soar como "velho" ou "acabado" para a faixa 25-40. "Masters" é o termo oficial internacional (ABMN, World Aquatics) e carrega orgulho identitário. O público se auto-identifica como "master".

### Por que não incluí pergunta sobre nado principal (crawl/costas/peito/borboleta)

Considerei e descartei. Razões: (1) A maioria dos masters treina predominantemente crawl (>80% do volume) — a resposta seria enviesada. (2) A pergunta sobre nado de prova é relevante apenas para competitivos, tornaria o formulário mais longo para 60%+ do público sem mudar substancialmente o relatório. (3) O gargalo "competition_prep" já implica que o PT vai perguntar sobre prova-alvo na primeira conversa.

### Por que `session_volume` é em metros e não em tempo

Tempo por sessão varia muito com velocidade do nadador — um nadador que leva 2:30/100m nada 1.200m em 30min, enquanto um que faz 1:30/100m nada 2.000m. Metros é a unidade universal de treinamento de natação e permite cálculos diretos de carga.

### Por que `shoulder_injury` é safety trigger mas `hypertension` não é

Lesão de ombro em natação é diferente de hipertensão: a atividade-alvo (nadar) exerce carga DIRETA na articulação lesionada. Prescrever volume e nados sem avaliação de fisioterapeuta pode agravar a lesão. Hipertensão controlada, por outro lado, é beneficiada pela natação — não há contradição; apenas ajuste de intensidade máxima.

### Por que apenas 3 opções em `metric_tracking` (não 4-5)

Natação tem um espectro de monitoramento mais binário que outros esportes. Ou o nadador não mede nada (a maioria), mede o básico (pace no cronômetro da parede), ou é nerd de dados (relógio + CSS + SWOLF). Não há "intermediário" significativo que mude a prescrição.

### Por que `known_css` é campo numérico e não range de opções

CSS é um valor contínuo e preciso (ex: 125 segundos/100m). Transformar em faixas ("entre 1:30 e 2:00") perderia resolução para cálculo de zonas. Quem sabe o CSS sabe o número exato — é público avançado. E o campo é condicional (só aparece para quem marcou `advanced`), então não há risco de confundir quem não sabe o que é CSS.

---

## 13 · Pendências

1. **FINA Points calculation:** Fórmula é simples (Points = 1000 × (WR/Time)³), mas precisa de base de dados de World Records Masters por faixa etária e prova. Verificar se masterstiming.com oferece API ou se precisamos tabela estática. Marcar como pendência de lib.

2. **CSS estimation formula (quando não informado):** Existe a fórmula CSS = 350 / (T400 - T50), mas requerer dois tempos de prova no formulário é excessivo. Alternativa: estimar CSS a partir do pace informado com fator de conversão (pace × 0.92 ≈ CSS para recreativos). Requer validação com dados reais. Pendência de lib/fórmula.

3. **SWOLF estimation accuracy:** Sem contagem real de braçadas, a estimativa é grosseira (regressão baseada em pace e nível). Pode ser mais útil como métrica educativa ("o que é SWOLF e como medir") do que como valor calculado. Decisão a tomar na implementação.

4. **Validação clínica:** Recomendada (⚠️) — idealmente um cardiologista esportivo revisaria os safety triggers para a faixa 60+ e um fisioterapeuta esportivo validaria as recomendações de ombro. Não é bloqueante para lançamento, mas desejável antes de escalar.

5. **Projeção de tempos para competidores:** Se o nadador informa CSS e prova-alvo, é possível projetar tempos para distâncias de 50m a 1500m usando modelos de fadiga (modelo de Péronnet & Thibault adaptado para natação). Lib não identificada — verificar se sports-formulas ou similar implementa.

6. **Integração com calendário ABMN:** Se futuro — puxar automaticamente as próximas provas do calendário master para exibir no relatório. Feature futura, não para MVP.

---

## 14 · Fontes citadas

1. Tanaka H, Seals DR. "Endurance exercise performance in Masters athletes: age-associated changes and underlying physiological mechanisms." _J Physiol_. 2008;586(1):55-63.
2. Tanaka H, Seals DR. "Age and gender interactions in physiological functional capacity: insight from swimming performance." _J Appl Physiol_. 2003;82:846-851.
3. Rubin RT et al. "Effects of aging in Masters swimmers: 40-year review and suggestions for optimal health benefits." _Open Access J Sports Med_. 2013;4:211-219.
4. Bak K, Faunø P. "Clinical findings in competitive swimmers with shoulder pain." _Am J Sports Med_. 1997;25(2):254-260.
5. Wanivenhaus F et al. "Prevention and Treatment of Swimmer's Shoulder." _Int J Sports Phys Ther_. 2010;5(2):167-179.
6. Löllgen H et al. "Hypothesized mechanisms of death in swimming: a systematic review." _BMC Sports Sci Med Rehabil_. 2023;15:155.
7. Knechtle B et al. "Freestyle master's swimming: Nationality, sex, and performance trends in World Aquatics competitions (1986-2024)." _PLOS ONE_. 2024;19(6):e0332040.
8. Toussaint HM, Beek PJ. "Biomechanics of competitive front crawl swimming." _Sports Med_. 1992;13(1):8-24.
9. Maglischo EW. _Swimming Fastest_. Champaign, IL: Human Kinetics; 2003.
10. Costill DL et al. "Adaptations to swimming training: influence of training volume." _Med Sci Sports Exerc_. 1991;23(3):371-377.
11. Ainsworth BE et al. "Compendium of Physical Activities: an update of activity codes and MET intensities." _Med Sci Sports Exerc_. 2000;32(9):S498-S504.
12. ABMN — Associação Brasileira de Masters de Natação. Regulamentos e Rankings. abmn.org.br.

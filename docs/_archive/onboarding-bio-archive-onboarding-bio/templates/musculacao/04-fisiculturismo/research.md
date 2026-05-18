# Research · Especialidade 4 · Fisiculturismo

## 0 · Metadados

- **Número:** 4
- **Modality:** musculacao
- **Pasta:** `musculacao/04-fisiculturismo/`
- **Plano:** pro
- **Validação clínica:** ⚠️ Recomendada (PT especialista em fisiculturismo / preparador físico com experiência em atletas)
- **Pesquisado em:** 2026-04-23
- **Fontes consultadas:**
  1. Kouri et al. (1995) — Fat-free mass index in users and nonusers of anabolic-androgenic steroids, _Clinical Journal of Sport Medicine_
  2. Helms et al. (2014) — Evidence-based recommendations for natural bodybuilding contest preparation, _JISSN_
  3. Morton et al. (2018) — A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength, _BJSM_
  4. Escalante et al. (2021) — Peak week recommendations for bodybuilders, _JISSN_
  5. Mifflin et al. (1990) — A new predictive equation for resting energy expenditure in healthy individuals, _AJCN_
  6. Hodgdon & Beckett (1984) — US Navy body fat estimation method
  7. IFBB Brasil / FEBRAFIM — categorias oficiais e limites de peso por altura
  8. Pesquisa IHRSA/ACAD Brasil — 32.000+ academias, 9.6M praticantes

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária:** 20-45 anos (core: 25-38)
- **Gênero:** predominantemente masculino (~70%), mas com segmento feminino crescente (~30%), impulsionado pelas categorias Wellness e Bikini (originadas no Brasil)
- **Socioeconômico:** classes A/B predominam (custo elevado de alimentação, suplementação, coaching e competições). Existe presença em classes C com menor investimento em assessoria
- **Ordem de grandeza:** competidores federados são poucos milhares nacionalmente. "Bodybuilders de estilo de vida" (treinam com metodologia de fisiculturismo, controlam dieta, medem evolução, mas não competem) são centenas de milhares — uma fatia relevante dos 9.6M praticantes de academia

### Onde estão online

- **Instagram:** canal primário. Influenciadores como Renato Cariani, Ramon Dino, Fabio Giga (1M+ cada). Coaches de prep usam Stories para acompanhar atletas
- **YouTube:** conteúdo aprofundado — diários de prep, breakdowns nutricionais, rotinas de treino
- **WhatsApp:** grupos de coaching, comunicação de federações, troca entre atletas
- **Fóruns:** hipertrofia.org e fisiculturismo.com.br (comunidades ativas, embora migrando para redes sociais)
- **TikTok:** crescente (#maromba, #gymtok), conteúdo curto

### Linguagem-padrão

O público mistura português e inglês com fluidez:

- **Fases:** "off-season", "bulking", "cutting", "secar", "peak week", "dieta reversa"
- **Aparência:** "shape" (forma geral), "seco/rasgado/trincado" (baixo BF%), "fibrado", "definido"
- **Métodos:** "dieta flexível" (IIFYM), "zerar carbo", "refeed", "deload"
- **Cultura:** "maromba" (identidade), "shape em V/X" (proporções ideais)

### O que os ofende ou afasta

- **"Bomba/bombado"** — termo pejorativo para uso de anabolizantes. A comunidade natural é especialmente sensível. O template **nunca** pode insinuar uso de PEDs
- **"Exagero/obsessão"** — trivializar a dedicação como comportamento obsessivo
- **Formulário genérico** — quem segue metodologia de bodybuilding espera ser tratado como atleta, não como "pessoa que quer emagrecer"
- **Promessas irreais** — o público é sofisticado; sabe que hipertrofia leva anos

### Dor mais comum

**Estagnação** (platô de ganho muscular ou de perda de gordura) combinada com **dificuldade de adesão nutricional** a longo prazo. Especificamente: saber o que fazer mas não conseguir sustentar a execução por semanas/meses seguidos.

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Praticantes de musculação com **metodologia de fisiculturismo** (periodização, controle nutricional estruturado, acompanhamento de composição corporal)
- Tanto competidores quanto "lifestyle bodybuilders" que se identificam com a cultura
- Todas as fases do ciclo (off-season, cutting, manutenção, reverse diet)
- Ambos os sexos (a IA adapta métricas e referências por sexo via `basics.sex`)

### Este template NÃO vai cobrir:

- **Praticantes casuais** que querem "ganhar massa" sem metodologia estruturada → template #2 (Ganho de Massa)
- **Estética leve / "definição de verão"** → template #5 (Estética/Definição)
- **Peak week detalhada** (manipulação de água/sódio/carboidrato nos 7 dias pré-competição) → isso é prescrição clínica específica demais para um formulário de lead; o relatório menciona a existência mas direciona ao profissional
- **Prescrição de ergogênicos** — fora do escopo do produto

### Decisão de label

Mantido **"Fisiculturismo"**. O termo em português é amplamente compreendido e carrega a conotação de seriedade e metodologia que diferencia esse público dos templates #2 e #5. O público-alvo se auto-identifica com o termo. `specialty_code: bodybuilding` (mais universal em código).

---

## 3 · Motores escolhidos

### Motores considerados e decisão

| Motor                          | Incluir?                 | Justificativa                                                                                                                                                                                   |
| ------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor 6 (Fase/Identidade)      | ✅ Sim, como segmentação | A fase do ciclo é A variável que mais muda o relatório. Um atleta em bulking e um em cutting recebem relatórios fundamentalmente diferentes                                                     |
| Motor 2 (Gargalo)              | ✅ Sim                   | Diagnóstico do travamento real — define o foco do relatório                                                                                                                                     |
| Motor 3 (Nível/Maturidade)     | ✅ Sim                   | Experiência de treino calibra complexidade do conteúdo e expectativas realistas de resultado                                                                                                    |
| Motor 7 (Métricas/Ferramentas) | ✅ Sim                   | Quem acompanha BF% e medidas recebe relatório mais técnico e preciso                                                                                                                            |
| Motor 8 (Safety)               | ✅ Sim                   | Obrigatório — condições de saúde                                                                                                                                                                |
| Motor 1 (Contexto atual)       | ❌ Não                   | Redundante com Motor 6 nesta especialidade — a fase já comunica o contexto atual                                                                                                                |
| Motor 4 (Comportamento)        | ❌ Não                   | Tentei incluir "quantos treinos fez na última semana", mas esse público é consistente por definição. Quem é inconsistente cai no gargalo "consistência". Pergunta separada desperdiçaria 1 slot |
| Motor 5 (Ambiente)             | ❌ Não                   | 95%+ treina em academia com equipamento completo. Não adiciona sinal relevante                                                                                                                  |

### Adição fora do framework: intenção competitiva

Adicionei uma pergunta sobre **intenção de competir** que não se encaixa perfeitamente em nenhum motor canônico. É um modificador de audiência (competidor vs lifestyle) que muda o tom e a profundidade técnica do relatório sem ser exatamente "fase" nem "nível". Funciona como complemento do Motor 6.

### Lista final (6 perguntas específicas):

1. **Fase atual (Motor 6, Segmentação)** → `phase` — define o arco narrativo inteiro do relatório
2. **Experiência de treino (Motor 3)** → `experience` — calibra jargão e expectativas
3. **Intenção competitiva (Motor 6 modificador)** → `competition_intent` — distingue atleta de lifestyle
4. **Gargalo principal (Motor 2)** → `bottleneck` — foco do relatório
5. **Acompanhamento corporal (Motor 7)** → `body_tracking` — profundidade das métricas
6. **Condições de saúde (Motor 8)** → `health_conditions` — safety

---

## 4 · Perguntas e opções

### Q1 · `phase` _(Motor 6 — Fase/Identidade, SEGMENTAÇÃO)_

**Type:** `single_choice`
**Label (client-facing):** "Em qual fase do seu ciclo você está agora?"
**Helper:** "Cada fase tem estratégias e metas diferentes — isso personaliza todo o seu relatório."
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`volume`** — "Ganho de massa / Off-season"
  - Safety trigger? Não

- **`definicao`** — "Definição / Cutting"
  - Safety trigger? Não

- **`transicao`** — "Manutenção / Dieta reversa"
  - Safety trigger? Não

**Justificativa da pergunta:** A fase do ciclo é o fator que mais muda a prescrição em bodybuilding. Superávit vs déficit vs manutenção calórica determinam macros, treino, cardio, métricas relevantes — praticamente tudo. Alternativa descartada: "Qual seu objetivo principal?" — redundante, porque quem seleciona fisiculturismo no hub já declarou o macro-objetivo. A fase é mais específica e acionável.

**Justificativa das opções:** Off-season, cutting e manutenção/reversa cobrem 100% do ciclo de periodização em bodybuilding. Não há quarta fase. "Pre-contest" poderia ser opção separada, mas é uma sub-fase de cutting — a intensidade da prep é capturada melhor pela intenção competitiva (Q3) do que por criar uma 4ª opção que fragmenta o branch.

---

### Q2 · `experience` _(Motor 3 — Nível/Maturidade)_

**Type:** `single_choice`
**Label (client-facing):** "Há quanto tempo você treina focado em hipertrofia?"
**Helper:** "Considere treino com progressão de carga e dieta estruturada, não apenas frequentar a academia."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick

**Opções:**

- **`iniciante`** — "Menos de 2 anos"
  - Safety trigger? Não

- **`intermediario`** — "2 a 5 anos"
  - Safety trigger? Não

- **`avancado`** — "Mais de 5 anos"
  - Safety trigger? Não

**Justificativa da pergunta:** Experiência de treino determina: (1) quanto jargão técnico é apropriado, (2) quão agressivas podem ser as metas de ganho/perda, (3) quais abordagens de treino fazem sentido. Um iniciante não precisa de DUP; um avançado não precisa ouvir sobre "treinar cada grupo 2x/semana". Alternativa descartada: "Qual seu nível?" (autoavaliação subjetiva) — anos de treino é mais objetivo e calibra melhor.

**Justificativa das opções:** <2, 2-5, 5+ é o corte mais aceito na literatura de periodização. Corresponde a: fase de ganhos rápidos (novato), fase de otimização (intermediário), fase de refinamento (avançado). 4 opções (adicionando "competidor") foi descartado — competição já é capturada em Q3.

---

### Q3 · `competition_intent` _(Motor 6 modificador — Intenção competitiva)_

**Type:** `single_choice`
**Label (client-facing):** "Qual sua relação com competição?"
**Helper:** (sem helper — pergunta autoexplicativa)
**Required:** sim
**Visibility:** sempre
**Segmentação:** não (mas modifica tom e métricas)
**depthRequired:** standard

**Opções:**

- **`ja_competi`** — "Já competi"
  - Safety trigger? Não

- **`pretendo`** — "Pretendo competir em breve"
  - Safety trigger? Não

- **`talvez`** — "Talvez no futuro"
  - Safety trigger? Não

- **`nao`** — "Não, treino pra mim"
  - Safety trigger? Não

**Justificativa da pergunta:** A intenção competitiva é o segundo eixo de personalização mais importante depois da fase. Um atleta em cutting que vai competir em 12 semanas precisa de relatório radicalmente diferente de um lifestyle em cutting para o verão. Alternativa descartada: não perguntar e inferir da fase — "definição" não implica competição. A pergunta é leve (5 segundos) e o sinal é enorme.

**Justificativa das opções:** 4 opções cobrem o espectro completo: já competiu (veterano), vai competir (novato de palco ou retorno), interesse futuro (curiosidade), e não (lifestyle). "Qual categoria?" foi descartada como pergunta separada — seria relevante para competidores mas adicionaria uma 7ª pergunta; a IA pode perguntar sobre categoria no `personal_note` universal ou o PT resolve presencialmente.

---

### Q4 · `bottleneck` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais tem travado seu progresso?"
**Helper:** "Escolha o que pesa mais no dia a dia — o que mais frustra."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick

**Opções:**

- **`dieta`** — "Não consigo manter a alimentação no plano"
  - Safety trigger? Não

- **`plato`** — "Resultados estagnaram"
  - Safety trigger? Não

- **`recuperacao`** — "Fadiga, dores ou dificuldade de recuperar"
  - Safety trigger? Não

- **`proporcao`** — "Desequilíbrio entre grupamentos musculares"
  - Safety trigger? Não

- **`outro`** — "Outra coisa (vou descrever no campo livre)"
  - Safety trigger? Não

**Justificativa da pergunta:** Gargalo é o coração do relatório — define o que a IA vai enfatizar. "O que você gostaria de melhorar?" foi descartado — é muito genérico e gera respostas aspiracionais ("tudo"). "O que trava" é mais diagnóstico e honesto.

**Justificativa das opções:** Dieta, platô, recuperação e proporção são os 4 gargalos mais documentados na literatura e nos fóruns de bodybuilding brasileiro. "Consistência de treino" foi descartada porque esse público, por definição, treina regularmente (diferente do template #1 ou #3). A opção "outro" com direcionamento ao campo livre cobre os ~10% restantes sem desperdiçar uma opção.

---

### Q5 · `body_tracking` _(Motor 7 — Métricas/Ferramentas)_

**Type:** `single_choice`
**Label (client-facing):** "Como você acompanha sua composição corporal?"
**Helper:** (sem helper)
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`bf_medidas`** — "Meço % de gordura e faço medidas corporais"
  - Safety trigger? Não

- **`so_medidas`** — "Faço medidas, mas não meço % de gordura"
  - Safety trigger? Não

- **`so_balanca`** — "Só acompanho pelo peso na balança"
  - Safety trigger? Não

- **`nao_acompanho`** — "Não acompanho / só pelo espelho"
  - Safety trigger? Não

**Justificativa da pergunta:** A disponibilidade de dados de composição corporal determina a profundidade técnica do relatório. Quem mede BF% recebe FFMI preciso e projeções calibradas; quem não mede recebe estimativas e orientação para começar. Alternativa descartada: perguntar BF% diretamente — a maioria não sabe o número exato, e um valor chutado é pior que estimativa via fórmula.

**Justificativa das opções:** 4 níveis de tracking, do mais completo ao zero. Cobrem 100% dos cenários. "Bioimpedância/DEXA" como opção separada foi descartado — não muda o cálculo (quem tem DEXA marca `bf_medidas` de qualquer forma).

---

### Q6 · `health_conditions` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma condição de saúde que exige acompanhamento médico?"
**Helper:** "Marque todas que se aplicam. Isso não impede sua avaliação — ajuda a personalizá-la com segurança."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`nenhuma`** — "Nenhuma"
  - Safety trigger? Não

- **`cardiaca`** — "Problema cardíaco"
  - Safety trigger? **Sim** — reason: "Treino de alta intensidade, manobra de Valsalva, e manipulação nutricional severa (cutting agressivo, peak week) representam risco cardiovascular real. Exige liberação e acompanhamento cardiológico."

- **`renal`** — "Problema renal"
  - Safety trigger? **Sim** — reason: "Prescrição de 2-3g/kg de proteína com função renal comprometida é contraindicação absoluta sem acompanhamento nefrologista."

- **`hormonal`** — "Distúrbio hormonal (tireoide, diabetes, etc.)"
  - Safety trigger? Não — reason: "Condições hormonais controladas (tireoide medicada, diabetes tipo 2 com medicação) ajustam tom mas não bloqueiam. Não exigem acompanhamento presencial imediato."

- **`articular`** — "Lesão articular ou óssea ativa"
  - Safety trigger? **Sim** — reason: "Treinar com carga pesada sobre lesão articular ativa sem avaliação fisioterápica é risco de agravamento significativo."

- **`transtorno_alimentar`** — "Histórico de transtorno alimentar"
  - Safety trigger? **Sim** — reason: "Contest prep com histórico de transtorno alimentar (anorexia, bulimia, compulsão) exige acompanhamento psicológico/psiquiátrico presencial obrigatório. Déficit calórico severo é gatilho documentado."

**Justificativa da pergunta:** Safety obrigatório. Bodybuilding tem riscos específicos: carga articular pesada, dietas extremas, manipulação de água. As opções refletem condições relevantes para ESTE nicho, não condições genéricas.

**Justificativa das opções:** Cardíaca, renal, articular e transtorno alimentar são as 4 condições que mais interagem com a prática de bodybuilding. "Hormonal" foi incluída sem safety trigger porque é comum (tireoide, SOP) e geralmente controlada. "Hipertensão" foi absorvida em "cardíaca" (hipertensão grave é problema cardíaco; controlada não é safety). "Outra" foi descartada para evitar trigger falso.

---

## 5 · Branches

### Branch: `Volume` (trigger: `phase == volume`)

- **Tom geral:** empoderamento construtivo. Paciência estratégica. "Cada semana no superávit é um investimento."
- **pillarGuidance:**
  - Pilar 1 (Nutrição): foco em superávit moderado, timing de carboidrato, meta proteica 1.6-2.2g/kg
  - Pilar 2 (Treino): volume alto, progressão de carga, periodização de hipertrofia
  - Pilar 3 (Recuperação): sono como variável anabólica, gerenciamento de estresse
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** mostrar meta calórica de superávit, projeção de ganho de massa magra mensal, FFMI com projeção de potencial
- **Narrative arc override:** "Você está construindo → seu potencial → meta calórica → plano nutricional → treino para crescer → recuperação → próximos meses → chamada para ação"

**Justificativa:** Off-season é fundamentalmente diferente — superávit vs déficit muda toda a aritmética nutricional. A narrativa foca em construção e paciência, não em restrição e preservação. Sem esse branch, o relatório genérico seria neutro demais para quem está ativamente em fase de ganho.

---

### Branch: `Definição` (trigger: `phase == definicao`)

- **Tom geral:** precisão cirúrgica. Disciplina com inteligência. "Secar sem perder o que construiu."
- **pillarGuidance:**
  - Pilar 1 (Nutrição): foco em déficit controlado, proteína elevada 2.3-3.1g/kg LBM, refeed strategies
  - Pilar 2 (Treino): manutenção de intensidade, redução estratégica de volume, cardio como ferramenta (não castigo)
  - Pilar 3 (Recuperação): gerenciamento de fadiga em déficit, sono ainda mais crítico, sinais de overreaching
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** mostrar meta calórica de déficit, projeção de perda de gordura semanal, peso-alvo estimado, timeline para BF% desejado
- **Narrative arc override:** "Você está revelando → seu ponto de partida → déficit ideal → proteína para preservar → treino para manter → sinais de atenção → projeção realista → chamada para ação"

**Justificativa:** Cutting exige relatório oposto ao de volume em quase tudo: superávit vira déficit, "comer mais" vira "comer preciso", projeção de ganho vira projeção de perda. A narrativa foca em preservação muscular e gestão de déficit — mensagens que seriam contraproducentes em off-season.

---

### Branch: `Transição` (trigger: `phase == transicao`)

- **Tom geral:** avaliação estratégica. Momento de reset. "Parar para avaliar é tão produtivo quanto treinar."
- **pillarGuidance:**
  - Pilar 1 (Nutrição): manutenção calórica ou reverse diet gradual, normalização de metabolismo
  - Pilar 2 (Treino): foco em fraquezas, trabalho de proporção, experimentação de estímulos
  - Pilar 3 (Recuperação): descanso ativo, avaliação de desgaste acumulado, saúde metabólica
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** mostrar FFMI atual como "inventário", avaliação de proporções, gasto calórico de manutenção
- **Narrative arc override:** "Onde você está → inventário do shape → seu FFMI → pontos fortes e fracos → nutrição de manutenção → plano para o próximo ciclo → chamada para ação"

**Justificativa:** Transição é a fase mais negligenciada e onde mais atletas erram (rebote pós-cutting, bulk sujo pós-competição). O relatório aqui é avaliativo e planejador, não prescritivo de superávit/déficit. Sem branch, a IA não saberia que o foco é "pausa estratégica", não "meta agressiva".

---

## 6 · Safety triggers

| Questão             | Opções                 | Reason (clínico)                                                                | Efeito no relatório                                                        |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `health_conditions` | `cardiaca`             | Risco cardiovascular com treino de alta intensidade e restrição calórica severa | Macros omitidas, timeline omitida, SafetyNote aparece                      |
| `health_conditions` | `renal`                | Contraindicação de dieta hiperproteica sem acompanhamento nefrologista          | Macros omitidas, timeline omitida, SafetyNote aparece                      |
| `health_conditions` | `articular`            | Risco de agravamento com carga pesada sem avaliação fisioterápica               | Timeline omitida, SafetyNote aparece, macros mantidas (não afeta nutrição) |
| `health_conditions` | `transtorno_alimentar` | Déficit calórico e controle alimentar rigoroso como gatilho documentado         | Macros omitidas, timeline omitida, SafetyNote aparece, tom extra acolhedor |

**safetyTemplate:**

- **Title:** "Sua saúde vem primeiro"
- **Body:** "Com base nas suas respostas, identificamos que você tem uma condição que merece atenção especial antes de seguir qualquer plano de treino ou alimentação. Isso não significa que você não pode treinar — significa que o caminho mais inteligente passa por uma avaliação presencial com [profissional_nome] e, se necessário, com o especialista médico adequado. Seu relatório foi ajustado para priorizar segurança. [profissional_nome] vai te orientar sobre os próximos passos com o cuidado que sua situação exige."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `ffmi_score`

- **O que é:** Fat-Free Mass Index normalizado — indica o nível de desenvolvimento muscular relativo à altura
- **Por que aparece para o aluno:** é O número que define "quanto músculo você tem" de forma comparável. Mais significativo que peso ou IMC para bodybuilders. O aluno vê onde está no espectro e quanto potencial tem
- **Cálculo:** `FFMI = (peso × (1 - BF%/100)) / altura²`. Normalizado: `FFMI + 6.1 × (1.8 - altura_m)`. Se BF% não disponível, estimar via Navy method ou usar Boer LBM. Ref: Kouri et al. (1995)
- **Visualização proposta:** Gauge radial com faixas (abaixo da média / média / acima / excelente / superior). Valor central grande + classificação por texto. Rationale: 1 valor + classificação = gauge é o formato natural; o aluno vê instantaneamente onde está
- **Placeholder:** `[ffmi_valor]`, `[ffmi_classificacao]`

### 7.2 · `meta_calorica`

- **O que é:** meta calórica diária ajustada para a fase (superávit/déficit/manutenção)
- **Por que aparece para o aluno:** é o número mais acionável — saber quantas kcal consumir por dia é a informação #1 que o aluno quer
- **Cálculo:** TMB via Katch-McArdle (se LBM disponível) ou Mifflin-St Jeor. TDEE = TMB × fator de atividade. Ajuste por fase: volume +300-500kcal, definição -300-500kcal, manutenção ±0. Ref: Helms et al. (2014)
- **Visualização proposta:** Card numérico grande com ícone, subtítulo da fase ("superávit de ~400 kcal" ou "déficit de ~350 kcal"). Rationale: número único + contexto = card é mais claro que gauge
- **Placeholder:** `[meta_kcal]`, `[ajuste_fase]`

### 7.3 · `meta_proteina`

- **O que é:** meta de proteína diária em gramas
- **Por que aparece para o aluno:** proteína é a obsessão #1 do bodybuilder. Saber o número exato em gramas é altamente acionável
- **Cálculo:** Volume: 1.6-2.2 g/kg peso total. Definição: 2.3-3.1 g/kg de massa magra (ou ~2.0-2.7 g/kg peso total). Manutenção: 1.8-2.4 g/kg. Ref: Morton et al. (2018), Helms et al. (2014)
- **Visualização proposta:** Card numérico com comparação ("isso equivale a ~X peitos de frango por dia" — contextualização concreta). Rationale: número puro é abstrato pra quem não pesa comida; analogia alimentar ancora
- **Placeholder:** `[meta_proteina_g]`

### 7.4 · `meta_hidratacao`

- **O que é:** meta de ingestão de água diária em litros
- **Por que aparece para o aluno:** hidratação afeta performance, aparência e recuperação. Número simples e fácil de seguir
- **Cálculo:** 40-45 ml/kg de peso corporal (arredondado para 0.5L). Ref: ACSM guidelines
- **Visualização proposta:** Card numérico simples (ícone de gota + litros). Rationale: é um número só, não precisa de gauge
- **Placeholder:** `[meta_agua_litros]`

### 7.5 · `projecao_timeline`

- **O que é:** projeção de tempo estimado para atingir meta (ganho de X kg de massa em Y meses, ou perda de X kg de gordura em Y semanas)
- **Por que aparece para o aluno:** timeline realista é o antídoto contra expectativas irreais e desistência prematura. O aluno vê que o resultado é possível mas precisa de tempo
- **Cálculo:** Volume: ganho de 0.25-0.5 kg/semana (ajustar por nível). Definição: perda de 0.5-1% do peso/semana. Timeline = delta / taxa semanal. Se safety triggered, omitir
- **Visualização proposta:** Timeline horizontal com marcos ("mês 1: -2kg gordura", "mês 2: -4kg", "meta: mês 4"). Rationale: progressão temporal é mais motivante em formato de jornada que como número isolado
- **Placeholder:** `[projecao_semanas]`, `[projecao_meses]`

### 7.6 · `imc_contextualizado`

- **O que é:** IMC com interpretação específica para bodybuilders (IMC alto ≠ obesidade quando há massa muscular elevada)
- **Por que aparece para o aluno:** desmistificar o IMC que o SUS/médico fala. Bodybuilders com IMC 28+ são "obesos" pelo critério padrão — o relatório contextualiza
- **Cálculo:** IMC padrão (peso/altura²) + nota explicativa automática se FFMI > 22 e IMC > 25 ("seu IMC indica sobrepeso pelo critério padrão, mas seu desenvolvimento muscular explica isso — o FFMI é um indicador mais preciso para o seu perfil")
- **Visualização proposta:** Card com dois números lado a lado (IMC + FFMI) e nota contextual. Rationale: mostrar os dois juntos educa o aluno sobre por que FFMI importa mais
- **Placeholder:** `[imc_valor]`, `[imc_nota]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `ffmi_normalized`

- **O que é:** FFMI normalizado com classificação detalhada
- **Por que importa para o PT:** avaliação objetiva de desenvolvimento muscular; identifica se o cliente está próximo do teto natural ou tem muito espaço para crescer. Ajuda a calibrar expectativas realistas
- **Cálculo:** Kouri et al. (1995), normalização por altura
- **Visualização proposta:** Gauge com 6 faixas + marcador de percentil. Rationale: PT quer saber a classificação exata e comparar com referências

### 8.2 · `bf_estimado`

- **O que é:** percentual de gordura corporal estimado
- **Por que importa para o PT:** composição corporal é a métrica central em bodybuilding. Define se o cliente está pronto para competir, se o cutting está funcionando, se o bulk está controlado
- **Cálculo:** Navy method (Hodgdon & Beckett) se medidas disponíveis; BMI-based (Deurenberg) como fallback com nota de menor precisão para populações musculares
- **Visualização proposta:** Gauge com faixas (essencial: 2-5%, atlético: 6-12%, fitness: 13-17%, acima: 18%+). Faixas ajustadas por sexo

### 8.3 · `lbm_kg`

- **O que é:** massa magra estimada em kg
- **Por que importa para o PT:** base para todos os cálculos de nutrição (Katch-McArdle, proteína por kg LBM) e para avaliar evolução real (ganhou peso = ganhou músculo ou gordura?)
- **Cálculo:** Se BF% disponível: `peso × (1 - BF%/100)`. Senão: Boer formula
- **Visualização proposta:** Card numérico com delta vs última avaliação (se disponível no futuro)

### 8.4 · `tdee_calculado`

- **O que é:** gasto calórico total estimado
- **Por que importa para o PT:** ponto de partida para toda prescrição nutricional. PT vê o número e ajusta com base em experiência clínica
- **Cálculo:** Katch-McArdle (preferencial) ou Mifflin-St Jeor × fator de atividade
- **Visualização proposta:** Card numérico com breakdown (TMB + TEA + TEF)

### 8.5 · `adherence_risk`

- **O que é:** score de risco de desistência/baixa adesão derivado das respostas
- **Por que importa para o PT:** permite priorizar acompanhamento mais próximo para leads com maior risco de abandonar
- **Cálculo:** Score composto: gargalo="dieta" (+2), gargalo="recuperação" (+1), experiência="iniciante" (+1), tracking="nao_acompanho" (+2). Range 0-5. Não é cálculo científico — é heurística de priorização
- **Visualização proposta:** Semáforo (verde/amarelo/vermelho) com score numérico

### 8.6 · `competition_readiness`

- **O que é:** indicador de prontidão competitiva (só para quem marcou intenção de competir)
- **Por que importa para o PT:** rápida triagem — o cliente está realmente pronto ou precisa de mais tempo?
- **Cálculo:** Heurística baseada em: FFMI (>22 homem / >18 mulher), experiência (>2 anos), BF% (<15% homem / <22% mulher para início de prep). Não é diagnóstico — é sinal para o PT investigar
- **Visualização proposta:** Checklist com semáforos (FFMI ✅/⚠️, experiência ✅/⚠️, BF% ✅/⚠️)

---

## 9 · Pilares do relatório

### Pilar 1 · Nutrição Estratégica

- **Subtitle:** "Combustível calibrado para sua fase"
- **Conceito central:** Em bodybuilding, nutrição não é "comer certo" — é engenharia calórica. Superávit, déficit ou manutenção: cada fase tem uma aritmética específica. Este pilar traduz os números em ação diária.
- **Evidência científica:** Helms et al. (2014) para recomendações de proteína em deficit; Morton et al. (2018) para dose-resposta proteica; Mifflin et al. (1990) / Katch-McArdle para estimativa metabólica
- **Placeholders esperados:** `[meta_kcal]`, `[meta_proteina_g]`, `[ajuste_fase]`, `[meta_agua_litros]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Pra você que está em [fase], sua meta calórica fica em torno de [meta_kcal] kcal por dia — isso significa [ajuste_fase]. Em proteína, mire em pelo menos [meta_proteina_g]g por dia distribuídas em 4-5 refeições. Não precisa ser perfeito todo dia, mas precisa ser consistente na semana. [profissional_nome] vai detalhar um plano alimentar completo pro seu caso."
- **Exemplo de texto técnico (35 palavras):** "TDEE estimado com ajuste de fase ([ajuste_fase]). Meta proteica: [meta_proteina_g]g/dia (2.2g/kg LBM em déficit, periodizar conforme aderência). Distribuição 4-5 refeições com leucina threshold >2.5g por refeição."

### Pilar 2 · Treino & Progressão

- **Subtitle:** "Estímulo certo na dose certa"
- **Conceito central:** Hipertrofia é adaptação ao estímulo — mas o estímulo precisa ser progressivo, variado e sustentável. Este pilar calibra a abordagem de treino para a fase atual e nível de experiência.
- **Evidência científica:** Schoenfeld et al. (2017) para volume de treino e hipertrofia; Helms et al. (2014) para manutenção de intensidade em déficit
- **Placeholders esperados:** `[experiencia_texto]`, `[fase_treino_foco]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Com [experiencia_texto] de treino, seu corpo já desenvolveu adaptações importantes. Na fase de [fase_treino_foco], o foco do treino muda: não é só levantar mais peso, é escolher os estímulos que movem a agulha. Grupamentos atrasados precisam de prioridade. [profissional_nome] vai montar a periodização ideal pro seu momento — com o estímulo certo, na dose certa."
- **Exemplo de texto técnico (35 palavras):** "Periodização por fase: [fase_treino_foco]. Priorizar intensidade sobre volume em déficit; volume progressivo em superávit. Frequência 2x/grupo/semana com distribuição push-pull-legs ou upper-lower conforme disponibilidade."

### Pilar 3 · Recuperação & Longevidade

- **Subtitle:** "O músculo cresce quando você descansa"
- **Conceito central:** Recuperação não é passividade — é a variável que mais separa quem progride de quem estagna ou se machuca. Sono, estresse, descanso entre sessões e sinais de overreaching são tão importantes quanto treino e dieta.
- **Evidência científica:** Dattilo et al. (2011) para relação sono-hormônios anabólicos; Kreher & Schwartz (2012) para overtraining syndrome
- **Placeholders esperados:** `[gargalo_texto]`, `[profissional_nome]`
- **Exemplo de texto popular (70 palavras):** "Seu gargalo principal — [gargalo_texto] — está diretamente conectado à recuperação. Músculo cresce no descanso, não no treino. Se o sono está ruim, o estresse alto, ou os treinos muito próximos, o corpo não tem tempo de reconstruir. Antes de adicionar mais treino, garanta que está recuperando o que já faz. [profissional_nome] vai avaliar esse equilíbrio presencialmente."
- **Exemplo de texto técnico (35 palavras):** "Avaliação de recuperação: sono 7-9h, intervalo entre sessões do mesmo grupo ≥48h, monitorar sinais de overreaching (performance declinante, aumento de RPE subjetivo, irritabilidade). Deload a cada 4-6 semanas."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Fisiculturismo: avaliação para praticantes de musculação com metodologia de bodybuilding — periodização de treino, controle nutricional estruturado e acompanhamento de composição corporal. Inclui competidores e lifestyle bodybuilders."
- **narrativeArc:**
  1. Reconhecer a fase atual e validar a escolha ("você está em volume — é o momento de construir")
  2. Apresentar a fotografia do ponto de partida (FFMI, composição estimada)
  3. Diagnosticar o gargalo e conectar com a fase
  4. Entregar as metas numéricas (calorias, proteína, hidratação)
  5. Pilar de nutrição calibrado para a fase
  6. Pilar de treino ajustado para nível e fase
  7. Pilar de recuperação conectado ao gargalo
  8. Projeção temporal realista
  9. Chamada para ação — "fale com [profissional_nome] para montar o plano completo"
- **terminology:** ["shape", "off-season", "cutting", "secar", "definição", "volume", "bulk", "massa magra", "BF%", "periodização", "mesociclo", "deload", "refeed", "reverse diet", "FFMI", "composição corporal", "superávit", "déficit", "hipertrofia", "progressão de carga", "grupamento", "proporcionalidade"]
- **forbiddenTerms:**
  - "bomba/bombado" — pejorativo, insinua uso de PEDs
  - "anabolizante/esteróide" — não é escopo do produto, pode ser ofensivo
  - "obeso/obesidade" (no contexto de IMC alto) — bodybuilders com IMC >30 não são obesos; usar "IMC acima do padrão" com contextualização FFMI
  - "dieta restritiva" — conotação negativa; usar "estratégia alimentar" ou "nutrição calibrada"
  - "você precisa/deve" (imperativo) — usar "recomendamos" ou "o ideal seria"; o relatório não prescreve, direciona
  - "sacrifício" — conotação de sofrimento; usar "dedicação" ou "compromisso"
- **recommendedTone:** "Técnico mas acessível. Trate o lead como atleta sério, não como paciente ou leigo. Use jargão do nicho com naturalidade (o público entende), mas explique métricas menos comuns (FFMI) brevemente. Tom de coach experiente conversando com atleta — respeitoso, direto, sem motivacionalismo vazio."
- **pillarGuidance:**
  1. "Nutrição: sempre ancorar em números (kcal, gramas de proteína, litros de água). Contextualizar para a fase. Não dar plano alimentar — dar meta numérica e direcionar ao profissional."
  2. "Treino: calibrar complexidade pelo nível de experiência. Iniciante: fundamentos. Intermediário: periodização. Avançado: otimização. Sempre mencionar que o profissional vai montar a periodização detalhada."
  3. "Recuperação: conectar diretamente com o gargalo reportado. Se gargalo é platô, falar de deload. Se é fadiga, falar de sono e volume. Ser específico, não genérico."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `very_active` — justificativa: fisiculturistas treinam 4-6x/semana com alta intensidade, além de possível cardio. O multiplicador `very_active` (1.725) é o mais representativo do gasto real desse público. `extremely_active` (1.9) seria para dupla sessão diária, que é minoria.
- **activityMapping:**
  - Não há pergunta direta de frequência de treino neste template (o público treina 4-6x/semana por definição)
  - Mapeamento fixo: bodybuilding → `very_active` (1.725)
  - Override manual: se `experience == iniciante`, considerar `moderately_active` (1.55) — iniciantes podem treinar 3-4x/semana

---

## 12 · Notas de design (decisões não-óbvias)

### Por que NÃO incluí pergunta de frequência de treino

Em templates de público geral (#1, #2, #3), frequência de treino é variável-chave. Em fisiculturismo, é constante — 4-6x/semana é o padrão universal. Perguntar seria desperdiçar 1 das 5-8 perguntas em algo que não muda o relatório. O activity level é fixado em `very_active`.

### Por que `competition_intent` é pergunta separada e não opção da fase

Tentei colocar "prep competitiva" como 4ª opção de `phase`, mas isso mistura dois eixos: (1) balanço calórico (surplus/deficit/maintenance) e (2) contexto motivacional (competição/lifestyle). Um atleta em cutting para o verão e um em cutting para competição têm o mesmo balanço calórico mas relatórios diferentes em tom e referências. Separar permite combinações (ex: "transição" + "já competi" = relatório de avaliação pós-competição).

### Por que `health_conditions` é multiple_choice e não single_choice

Uma pessoa pode ter problema articular E histórico de transtorno alimentar simultaneamente. Safety triggers são aditivos, não excludentes.

### Por que NÃO incluí pergunta sobre categoria competitiva (bodybuilding/classic/physique/bikini/wellness)

Seria relevante para competidores mas: (1) adicionaria 7ª pergunta, (2) só é útil para quem marcou "já competi" ou "pretendo" (~30-40% do público estimado), (3) a IA não precisa dessa info para gerar relatório — o PT resolve presencialmente. Se no futuro adicionarmos depth "detailed", essa pergunta pode entrar como condicional.

### Por que `hormonal` NÃO é safety trigger

Tireoide tratada e diabetes tipo 2 controlada são as condições hormonais mais comuns nesse público. São relevantes (ajustam tom e expectativas de metabolismo) mas não exigem interrupção do relatório nem acompanhamento presencial imediato. A IA menciona a condição e sugere alinhamento com o endocrinologista, sem bloquear métricas.

### Por que incluí `transtorno_alimentar` como safety trigger

Contest prep envolve déficit calórico severo, controle alimentar obsessivo, pesagem diária, e manipulação de água — todos gatilhos documentados para recaída de transtornos alimentares. A literatura (Sundgot-Borgen & Torstveit, 2004) mostra prevalência elevada de transtornos alimentares em atletas de esportes com ênfase em peso/aparência. Este é um dos poucos casos em que o formulário DEVE direcionar para acompanhamento psicológico antes de seguir.

### Por que o label ficou "Fisiculturismo" e não "Bodybuilding" ou "Hipertrofia Avançada"

O público brasileiro usa ambos os termos ("fisiculturismo" e "bodybuilding"), mas o hub é em português e "fisiculturismo" carrega conotação de seriedade metodológica que diferencia claramente dos templates #2 (ganho de massa casual) e #5 (estética/definição leve). "Hipertrofia Avançada" é mais técnico e menos identitário. O `specialty_code: bodybuilding` fica em inglês no código por convenção técnica.

---

## 13 · Pendências

### Cálculos

- **FFMI:** fórmula trivial (3 linhas), não precisa de lib. Implementar no engine
- **Body fat estimation (Navy method):** `@finegym/fitness-calc` implementa, mas precisa verificar se aceita medidas em cm (padrão brasileiro) ou só inches
- **Katch-McArdle BMR:** disponível em `@finegym/fitness-calc`; verificar API

### Validação clínica

- Template recomenda validação com PT especialista em fisiculturismo. Não é bloqueante para lançamento, mas ideal antes de abrir para o público Pro
- Safety triggers para `transtorno_alimentar` e `renal` devem ser revisados por profissional de saúde

### Casos de borda não cobertos

- **Atleta em peak week** (últimos 7 dias pré-competição): manipulação de água/sódio/carbo é clínica demais para formulário. O relatório menciona que existe mas não prescreve. O PT faz presencialmente
- **Atleta com múltiplas competições por ano**: a fase pode ser ambígua (mini off-season de 4 semanas entre competições). O relatório trata como "transição" mas o PT ajusta
- **Atletas de categorias específicas** (Wellness, Bikini, Classic): cada categoria tem ênfases estéticas diferentes. O template genérico de fisiculturismo não diferencia — feature futura via depth "detailed" ou sub-templates

### Decisões dependentes de implementação

- Proporção/simetria como métrica visual (radar chart) depende de coleta de medidas corporais no bloco universal ou em pergunta condicional. Atualmente `basics` coleta peso/altura/sexo — medidas de circunferência precisariam de extensão do bloco universal ou pergunta condicional neste template
- FFMI precisa de BF% — se o aluno marca `nao_acompanho`, o FFMI é estimado via fórmula menos precisa (Boer LBM). Documentar no relatório que é estimativa

---

## 14 · Fontes citadas

1. Kouri, E.M. et al. (1995). Fat-free mass index in users and nonusers of anabolic-androgenic steroids. _Clinical Journal of Sport Medicine_, 5(4), 223-228.
2. Helms, E.R. et al. (2014). Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. _Journal of the International Society of Sports Nutrition_, 11(20).
3. Morton, R.W. et al. (2018). A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. _British Journal of Sports Medicine_, 52(6), 376-384.
4. Mifflin, M.D. et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. _American Journal of Clinical Nutrition_, 51(2), 241-247.
5. Hodgdon, J.A. & Beckett, M.B. (1984). Prediction of percent body fat for U.S. Navy men and women from body circumferences and height. Naval Health Research Center, Report No. 84-29.
6. Escalante, G. et al. (2021). Peak week recommendations for bodybuilders: an evidence based approach. _BMC Sports Science, Medicine and Rehabilitation_, 13(68).
7. Schoenfeld, B.J. et al. (2017). Dose-response relationship between weekly resistance training volume and increases in muscle mass. _Medicine and Science in Sports and Exercise_, 49(3), 456-461.
8. Dattilo, M. et al. (2011). Sleep and muscle recovery: endocrinological and molecular basis for a new and promising hypothesis. _Medical Hypotheses_, 77(2), 220-222.
9. Kreher, J.B. & Schwartz, J.B. (2012). Overtraining syndrome: a practical guide. _Sports Health_, 4(2), 128-138.
10. Sundgot-Borgen, J. & Torstveit, M.K. (2004). Prevalence of eating disorders in elite athletes is higher than in the general population. _Clinical Journal of Sport Medicine_, 14(1), 25-32.

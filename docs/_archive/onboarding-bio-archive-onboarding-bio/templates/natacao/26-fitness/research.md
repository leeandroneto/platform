# Research · Especialidade 26 · Natação Fitness

## 0 · Metadados

- **Número:** 26
- **Modality:** natacao
- **Label proposto:** Natação para Condicionamento
- **`specialty_code` proposto:** `natacao_condicionamento`
- **Pasta:** `natacao/26-fitness/`
- **Plano:** pro
- **Validação clínica:** Opcional
- **Pesquisado em:** 2026-04-24
- **Fontes consultadas:**
  1. Compendium of Physical Activities (Ainsworth et al., 2011) — MET values para natação por nado e intensidade
  2. National Geographic Brasil — "A natação talvez seja o melhor exercício que existe" (2024)
  3. Jornal da USP — "Benefícios da natação à saúde são os maiores dentre os esportes"
  4. Fitness Brasil — Panorama Setorial 2024 (perfil de praticantes no Brasil)
  5. CNN Brasil — "Natação para adultos: como começar e benefícios" (2024)
  6. TraPlaGo — "The Complete Guide to Critical Swim Speed Training" (2025)
  7. SwimAnalytics — Swimming Performance Formulas (CSS, TSS)
  8. TopEndSports — SWOLF efficiency test methodology

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária predominante:** 25-50 anos, com pico entre 30-45
- **Gênero:** leve predominância feminina (~55-60%), mas equilibrado em academias de natação urbanas
- **Contexto socioeconômico:** classe B e C+. A natação exige acesso a piscina (academia, clube ou condomínio), o que filtra por renda. Mensalidade típica: R$150-350/mês em academias aquáticas
- **Geografia:** concentrado em capitais e cidades médias com infraestrutura de piscinas. São Paulo, Rio, BH, Curitiba, Porto Alegre lideram

### Ordem de grandeza

Mercado **grande**. A natação tem aproximadamente 11 milhões de praticantes no Brasil (dados CBDA). O segmento "fitness" (não-competitivo, não-iniciante) representa a maioria — estimativa de 6-8 milhões de praticantes regulares que nadam para saúde e condicionamento, sem pretensão competitiva.

### Onde estão online

- **Instagram:** seguem perfis de academias de natação, coaches aquáticos, influenciadores fitness que incluem natação (ex: Karol Meyer, Cesar Cielo para aspiração)
- **YouTube:** tutoriais de técnica ("como melhorar crawl"), treinos de piscina, reviews de equipamentos (óculos, palmar, nadadeira)
- **WhatsApp:** grupos da turma de natação da academia, combinação de horários
- **Apps:** Garmin Connect, Apple Watch Workout, MySwimPro (minoria tech-savvy usa relógio aquático)
- **Strava:** minoria usa para nadar, mais comum entre quem também corre/pedala

### Linguagem que usam

- "Nadar uns metrinho", "fazer uns tiros", "tirar um treino na piscina"
- "Crawl" (não "nado livre" no dia a dia), "costas", "peito", "borboleta" (ou "borba")
- "Piscina" (nunca "tanque" ou "raia" isoladamente)
- "Braçada", "pernada", "respiração bilateral"
- "Tá nadando bem" / "tô pegando ritmo"
- "Fazer X metros" (metragem como métrica de volume)
- "Série" (conjunto de repetições com intervalo)
- "Educativo" (drill de técnica)
- Quem mede: "pace" (tempo por 100m), "SWOLF" (smartwatch)

### O que ofende ou afasta

- **Tom de professor de escolinha:** tratá-los como crianças aprendendo. Eles já sabem nadar — querem evoluir
- **Jargão excessivo de competição:** "taper", "periodização mesocíclica", "base aeróbia" — assusta quem nada 3x/semana para saúde
- **Promessas de resultado rápido:** "emagreça 10kg nadando" — público maduro desconfia
- **Comparação com atletas:** "nade como o Phelps" — ridículo para quem nada 1.500m em 40min
- **Menosprezar a atividade:** "natação não emagrece" (mito popular que irrita quem escolheu natação como esporte principal)

### Dor mais comum

**Falta de evolução percebida.** Diferente da musculação (onde o espelho mostra resultado) ou corrida (onde o pace melhora visivelmente), na natação a pessoa nada meses sem sentir que melhorou. Não tem métrica clara, não tem feedback visual. "Eu nado 3x por semana há 2 anos e não sei se estou melhor." Isso gera abandono.

Segunda dor: **monotonia**. Nadar raia ida e volta sem estrutura é tedioso. Quem não tem professor particular ou treino estruturado enjoa rápido.

## 2 · Decisão de escopo

### Este template cobre:

- Adultos que **já sabem nadar** (completam pelo menos 50m sem parar)
- Nadam para **condicionamento, saúde cardiovascular, emagrecimento, bem-estar**
- Frequência de 2-5x/semana
- Podem ou não ter smartwatch aquático
- Podem treinar em academia de natação, clube, condomínio ou piscina pública
- Podem nadar com ou sem acompanhamento de professor

### Este template NÃO cobre:

- **Adultos iniciantes** que não sabem nadar ou não completam 50m → template #25 (adulto iniciante)
- **Competidores** que participam de provas e buscam índices → template #27 (competitivo)
- **Águas abertas** com demandas específicas de segurança → template #28 (águas abertas)
- **Masters/veteranos** com foco em categorias etárias → template #29 (masters)
- **Reabilitação aquática** (hidroterapia prescrita por fisioterapeuta)
- **Hidroginástica** (modalidade com dinâmica, métricas e público completamente diferentes)

### Justificativa do escopo

O nadador fitness é o maior segmento da natação adulta e também o mais mal-atendido. Ele não é iniciante (já aprendeu), não é competidor (não quer prova), mas quer evoluir e ter feedback sobre seu progresso. É exatamente o público que um professor de natação com link na bio do Instagram vai captar: alguém que já nada, quer mais, e busca orientação personalizada.

## 3 · Motores escolhidos

### Motores considerados e decisão

| Motor                | Incluído? | Justificativa                                                                                                                                                                                                                                                                 |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 · Contexto Atual   | ✅ Sim    | Preciso saber frequência e tempo de prática para calibrar recomendações                                                                                                                                                                                                       |
| 2 · Gargalo          | ✅ Sim    | O diagnóstico do que trava o resultado é o coração do relatório                                                                                                                                                                                                               |
| 3 · Nível/Maturidade | ❌ Não    | O nível é inferido pela frequência (Motor 1) + nados dominados (Motor 6). Perguntar "há quanto tempo nada?" não muda substancialmente o relatório porque um nadador de 5 anos que nada 2x/semana sem estrutura pode ter o mesmo nível que um de 1 ano que treina 4x com coach |
| 4 · Comportamento    | ✅ Sim    | Consistência real é variável-chave — distingue quem "diz que nada" de quem efetivamente nada                                                                                                                                                                                  |
| 5 · Ambiente         | ✅ Sim    | Piscina de 25m vs 50m, com ou sem raia exclusiva, com ou sem material (palmar, prancha) muda completamente a prescrição                                                                                                                                                       |
| 6 · Identidade/Fase  | ✅ Sim    | Quais nados a pessoa domina é a segmentação mais natural — define complexidade do treino e variedade possível                                                                                                                                                                 |
| 7 · Métricas         | ❌ Não    | Apenas minoria usa smartwatch aquático. Perguntar sobre SWOLF/pace confundiria 80%+ do público. Incluo como sub-pergunta condicional dentro de Ambiente (Motor 5)                                                                                                             |
| 8 · Safety           | ✅ Sim    | Obrigatório — condições articulares, cardiovasculares, otológicas (ouvido)                                                                                                                                                                                                    |

**Total: 6 motores → 7 perguntas** (dentro do range 5-8)

### Lista final

1. **Identidade/Fase (Motor 6)** → `nados_dominados` — Quais nados a pessoa consegue nadar com conforto (segmentação)
2. **Contexto Atual (Motor 1)** → `frequencia_piscina` — Quantas vezes por semana efetivamente vai à piscina
3. **Comportamento (Motor 4)** → `estrutura_treino` — Como é o treino: livre, segue planilha, tem professor
4. **Gargalo (Motor 2)** → `maior_dificuldade` — O que mais trava a evolução na natação
5. **Ambiente (Motor 5)** → `contexto_piscina` — Onde nada e se tem acesso a materiais
6. **Ambiente/Métricas (Motor 5+7)** → `usa_smartwatch` — Se usa relógio/smartwatch aquático (condicional: se sim, pergunta pace)
7. **Safety (Motor 8)** → `condicoes_saude` — Triagem de condições que exigem atenção médica

## 4 · Perguntas e opções

### Q1 · `nados_dominados` _(Motor 6 · Identidade/Fase)_

**Type:** `multiple_choice`
**Label (client-facing):** "Quais nados você consegue nadar com conforto?"
**Helper:** "Selecione todos que consegue manter por pelo menos 50 metros sem parar."
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick
**maxSelections:** 4

**Opções:**

- **`crawl`** — "Crawl (nado livre)"
  - Safety trigger? não

- **`costas`** — "Costas"
  - Safety trigger? não

- **`peito`** — "Peito (breaststroke)"
  - Safety trigger? não

- **`borboleta`** — "Borboleta"
  - Safety trigger? não

**Justificativa da pergunta:** Os nados dominados são a variável que mais impacta a prescrição de treino na natação fitness. Um nadador que só faz crawl recebe um treino completamente diferente de quem faz 3-4 nados. Além disso, é a pergunta mais engajante — a pessoa se identifica imediatamente. Alternativa descartada: "qual seu nado principal?" (single choice) — perderia informação sobre versatilidade.

**Justificativa das opções:** Os 4 nados olímpicos são universais e mutuamente exclusivos em termos de técnica. Não incluí "medley" como opção separada porque é combinação dos 4. O helper "50 metros sem parar" filtra entre "conheço o nado" e "consigo nadar de verdade" — essa distinção é crucial.

---

### Q2 · `frequencia_piscina` _(Motor 1 · Contexto Atual)_

**Type:** `single_choice`
**Label (client-facing):** "Quantas vezes por semana você vai à piscina?"
**Helper:** "Considere a média das últimas 4 semanas, não a meta."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick

**Opções:**

- **`1x`** — "1 vez por semana"
  - Safety trigger? não

- **`2x`** — "2 vezes por semana"
  - Safety trigger? não

- **`3x`** — "3 vezes por semana"
  - Safety trigger? não

- **`4x`** — "4 vezes por semana"
  - Safety trigger? não

- **`5x_mais`** — "5 ou mais vezes"
  - Safety trigger? não

**Justificativa da pergunta:** Frequência é a variável mais objetiva de comprometimento e determina o volume semanal possível. O helper "últimas 4 semanas" evita o viés aspiracional ("quero ir 5x mas vou 2x"). Alternativa descartada: "quantos metros nada por sessão?" — muito difícil de responder com precisão sem smartwatch.

**Justificativa das opções:** Faixas de 1 a 5+ cobrem todo o espectro. Não usei "esporadicamente" porque o template assume que a pessoa já nada regularmente (escopo definido na seção 2).

---

### Q3 · `estrutura_treino` _(Motor 4 · Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Como são seus treinos na piscina hoje?"
**Helper:** ""
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`livre`** — "Nado por conta, sem roteiro definido"
  - Safety trigger? não

- **`planilha_app`** — "Sigo treinos de app, vídeo ou planilha"
  - Safety trigger? não

- **`turma`** — "Faço aula em turma com professor"
  - Safety trigger? não

- **`professor_particular`** — "Treino com professor particular"
  - Safety trigger? não

**Justificativa da pergunta:** A estrutura do treino determina o nível de prescrição que o relatório pode oferecer. Para quem nada livre, o relatório muda a vida (primeira vez com estrutura). Para quem já tem professor, complementa. Alternativa descartada: "você planeja seus treinos?" (binária, perde nuance).

**Justificativa das opções:** As 4 opções cobrem o espectro de autonomia. "Planilha/app" foi separada de "professor" porque o perfil comportamental é diferente (autodidata vs delegador).

---

### Q4 · `maior_dificuldade` _(Motor 2 · Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais te trava hoje na natação?"
**Helper:** "Escolha o que mais pesa. Se mais de um, escolha o principal."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`respiracao`** — "Respiração — canso rápido, não consigo manter o ritmo"
  - Safety trigger? não

- **`tecnica_nado`** — "Técnica — sinto que nado errado ou ineficiente"
  - Safety trigger? não

- **`monotonia`** — "Monotonia — fico entediado nadando raia ida e volta"
  - Safety trigger? não

- **`estagnacao`** — "Estagnação — nado há meses e não sinto evolução"
  - Safety trigger? não

- **`ombro_dor`** — "Desconforto nos ombros ou articulações"
  - Safety trigger? não

- **`tempo`** — "Tempo disponível — não consigo ir mais vezes"
  - Safety trigger? não

**Justificativa da pergunta:** O gargalo direciona o foco do relatório. Cada opção gera narrativa e pilar diferentes. São os 6 diagnósticos mais frequentes do nicho natação fitness no Brasil, baseados em literatura de coaching aquático e feedback de professores de natação. Alternativa descartada: "o que você gostaria de melhorar?" — pergunta por desejo, não por dor. A dor é mais diagnóstica.

**Justificativa das opções:** 6 opções cobrem os gargalos reais (não genéricos). "Respiração" e "técnica" são problemas físico-técnicos. "Monotonia" e "estagnação" são problemas psicológicos/de estrutura. "Ombro/dor" é problema clínico. "Tempo" é restrição logística. Cada um gera abordagem diferente no relatório.

---

### Q5 · `contexto_piscina` _(Motor 5 · Ambiente)_

**Type:** `single_choice`
**Label (client-facing):** "Onde você costuma nadar?"
**Helper:** ""
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`academia_natacao`** — "Academia de natação ou escola aquática"
  - Safety trigger? não

- **`clube`** — "Clube ou associação"
  - Safety trigger? não

- **`condominio`** — "Piscina de condomínio ou residencial"
  - Safety trigger? não

- **`publica_sesc`** — "Piscina pública, SESC ou centro esportivo"
  - Safety trigger? não

**Justificativa da pergunta:** O local de treino determina metragem da piscina, acesso a materiais, suporte técnico e condições de treino. Um treino para piscina de 50m com palmar e nadadeira é completamente diferente de um para piscina de condomínio de 12m sem nada. Alternativa descartada: "tamanho da piscina" (pergunta técnica que muita gente não sabe responder com certeza — o local é proxy mais confiável).

**Justificativa das opções:** 4 contextos cobrem 95%+ dos cenários reais. "Mar/lago" foi excluído (template de águas abertas). "Hotel" e "spa" são muito raros para treino regular.

---

### Q6 · `usa_smartwatch` _(Motor 5+7 · Ambiente/Métricas)_

**Type:** `single_choice`
**Label (client-facing):** "Você usa relógio ou smartwatch na piscina?"
**Helper:** "Para medir distância, pace ou braçadas enquanto nada."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`sim_uso`** — "Sim, uso e acompanho os dados"
  - Safety trigger? não

- **`tenho_nao_uso`** — "Tenho, mas não olho muito os dados"
  - Safety trigger? não

- **`nao_uso`** — "Não uso"
  - Safety trigger? não

**Justificativa da pergunta:** Define o nível de sofisticação das métricas no relatório. Quem tem dados recebe referências quantitativas (pace, SWOLF). Quem não tem recebe métricas perceptuais (esforço percebido, contagem de braçadas manual). Alternativa descartada: "qual seu pace de 100m?" — a maioria não sabe e se sentiria inadequada.

**Justificativa das opções:** 3 opções simples. "Tenho mas não uso" captura um perfil real e muito comum — o relatório pode resgatar valor do equipamento parado.

---

### Q7 · `condicoes_saude` _(Motor 8 · Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Selecione todas que se aplicam. Essa informação ajuda a personalizar seu relatório com segurança."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 5

**Opções:**

- **`ombro_lesao`** — "Lesão ou cirurgia recente no ombro"
  - Safety trigger? não (condiciona tom, não bloqueia)

- **`cardio`** — "Problema cardíaco diagnosticado"
  - Safety trigger? **sim** (reason: "Condição cardíaca em ambiente aquático exige liberação cardiológica específica para atividade em imersão. Risco de arritmia ou síncope na água é emergência com socorro mais difícil que em terra.")

- **`epilepsia`** — "Epilepsia ou convulsões"
  - Safety trigger? **sim** (reason: "Crise convulsiva na água é emergência com alto risco de afogamento. Exige liberação neurológica e supervisão presencial obrigatória.")

- **`asma`** — "Asma"
  - Safety trigger? não

- **`ouvido`** — "Problemas recorrentes de ouvido (otite, perfuração timpânica)"
  - Safety trigger? não

- **`nenhuma`** — "Nenhuma dessas"
  - Safety trigger? não

**Justificativa da pergunta:** Safety obrigatório. As condições listadas são as que efetivamente impactam natação de forma diferente de outros esportes. Hipertensão estável, diabetes tipo 2 controlada e problemas articulares genéricos NÃO são safety triggers — ajustam tom mas não bloqueiam. Cardiopatia e epilepsia SÃO safety por causa do risco específico do meio aquático (dificuldade de socorro).

**Justificativa das opções:** 5 condições + "nenhuma" é conciso. "Lesão no ombro" é a mais prevalente na natação. "Cardio" e "epilepsia" são os safety triggers reais do meio aquático. "Asma" é incluída porque o público espera ver (mas NÃO é trigger — natação é recomendada para asma). "Ouvido" é específico de natação e raramente aparece em templates de terra.

---

## 5 · Branches

### Branch: `apenas_crawl` (trigger: `nados_dominados == [crawl]` — apenas crawl selecionado)

- **Tom geral:** Encorajador e progressivo. Foco em construir base antes de diversificar.
- **pillarGuidance:** IA enfatiza evolução dentro do crawl (variações de ritmo, respiração bilateral, drills de deslize) e introduz educativos de costas como segundo nado natural.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Omitir métricas de medley. Focar em pace/100m de crawl, braçadas por piscina, eficiência de nado.
- **Narrative arc override:** Arco focado em "você já tem o essencial — agora vamos polir e expandir". Relatório não pressiona para aprender novos nados imediatamente, mas planta a semente.

**Justificativa:** Nadador que só faz crawl é o perfil mais comum e precisa de tratamento específico. Se o relatório falar de "séries de medley" para quem só nada crawl, perde credibilidade. O branch garante que o relatório fala a língua desse nadador.

### Branch: `multiestilos` (trigger: `nados_dominados` inclui 3+ nados)

- **Tom geral:** Desafiador e sofisticado. Linguagem pode ser mais técnica.
- **pillarGuidance:** IA pode propor séries de medley, alternância de nados por objetivo (crawl para aeróbio, peito para recuperação, borboleta para potência, costas para equilíbrio), periodização por blocos.
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Incluir métrica de medley pace e distribuição de metragem por nado.
- **Narrative arc override:** Arco focado em "você tem versatilidade rara — vamos usar cada nado como ferramenta estratégica". Relatório trata os nados como paleta, não como opções isoladas.

**Justificativa:** Quem domina 3+ nados tem nível técnico alto e um relatório genérico de crawl seria frustrante. O branch muda substancialmente as recomendações — séries de medley, periodização por nado, distribuição de volume.

### Branch: `safety_ativado` (trigger: `condicoes_saude` inclui `cardio` OU `epilepsia`)

- **Tom geral:** Acolhedor, cauteloso e direcionador. Sem alarme, mas firme na recomendação de avaliação.
- **pillarGuidance:** IA omite prescrições de intensidade específicas. Pilares focam em "como se preparar para nadar com segurança" e "o que discutir com seu médico e professor".
- **Additional questions:** nenhuma
- **Remove questions:** nenhuma
- **Metrics override:** Omitir projeção de timeline. Omitir metas calóricas. Manter métricas informativas (IMC, nível de atividade).
- **Narrative arc override:** "Seu corpo na água" (educativo sobre como o meio aquático interage com sua condição) → "O que conversar com seu médico" → "Como um profissional de natação pode te ajudar com segurança".

**Justificativa:** Condições cardíacas e epilepsia no meio aquático são qualitativamente diferentes de outros esportes. O relatório não pode prescrever intensidade sem liberação médica específica para imersão. O branch não impede de nadar — direciona para avaliação adequada.

---

## 6 · Safety triggers

| Questão           | Opções      | Reason (clínico)                                                                                                                                                              | Efeito no relatório                                                                                 |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `condicoes_saude` | `cardio`    | Risco de arritmia/síncope em imersão — pressão hidrostática altera pré-carga cardíaca; reflexo de imersão facial pode desencadear bradicardia; socorro na água é mais difícil | Macros omitidas, timeline omitida, SafetyNote aparece, IA não prescreve intensidade                 |
| `condicoes_saude` | `epilepsia` | Crise convulsiva na água = risco de afogamento imediato. Diferente de qualquer ambiente terrestre. Exige liberação neurológica + supervisão presencial                        | Macros omitidas, timeline omitida, SafetyNote aparece, IA orienta avaliação médica antes de retomar |

**safetyTemplate:**

- **Title:** "Sua segurança na água vem primeiro"
- **Body:** "A natação pode ser excelente para você, mas antes de seguir com recomendações de treino, é importante passar por uma avaliação médica específica para atividade em meio aquático. O ambiente da piscina interage de forma única com o corpo — e um profissional de saúde pode definir os parâmetros seguros para que você nade com tranquilidade. Converse com [profissional_nome] — ele(a) vai te orientar nos próximos passos e pode coordenar com seu médico."

---

## 7 · Métricas para o ALUNO (relatório)

### `calorias_estimadas`

- **O que é:** Estimativa de gasto calórico por sessão de natação
- **Por que aparece para o aluno:** Dado concreto e motivacional — "cada treino seu queima ~X calorias"
- **Cálculo:** MET × peso (kg) × tempo (h). MET por nado: crawl moderado 8.0, crawl vigoroso 10.0, costas 7.0, peito 10.3, borboleta 13.8 (Compendium of Physical Activities, Ainsworth 2011). Usar média ponderada baseada nos nados dominados.
- **Visualização proposta:** Card numérico com ícone de chama. Valor central grande + "por sessão de Xmin" embaixo. Faixa referência: "equivale a ~Y minutos de corrida moderada" para contexto.
- **Placeholder:** `[calorias_sessao]`

### `imc_contextualizado`

- **O que é:** IMC com interpretação narrativa, não-clínica
- **Por que aparece para o aluno:** Referência universal que o público entende, mas precisa de contexto para não ser ofensiva
- **Cálculo:** peso / altura². Classificação OMS, mas apresentada com narrativa ("dentro da faixa saudável", "acima do ideal para sua altura — a natação é uma das melhores aliadas para ajustar isso")
- **Visualização proposta:** Gauge radial com faixas coloridas (verde/amarelo/laranja). Ponteiro no valor do aluno. Sem label "obeso" — usar "acima do ideal".
- **Placeholder:** `[imc_valor]`, `[imc_faixa]`

### `meta_hidrica`

- **O que é:** Recomendação de ingestão de água diária ajustada para nadadores
- **Por que aparece para o aluno:** Nadadores subestimam desidratação (não percebem suor na água). Dado acionável e surpreendente.
- **Cálculo:** 35ml × peso(kg) + 500ml (compensação da perda imperceptível em imersão). Referência: ACSM Position Stand on Exercise and Fluid Replacement.
- **Visualização proposta:** Card com copo/garrafa + volume em litros. Destaque: "Na piscina você sua sem perceber — por isso a hidratação é ainda mais importante."
- **Placeholder:** `[meta_agua_litros]`

### `frequencia_ideal`

- **O que é:** Frequência semanal recomendada baseada no objetivo e nível atual
- **Por que aparece para o aluno:** Responde a pergunta mais comum: "quantas vezes por semana eu deveria nadar?"
- **Cálculo:** Baseado em diretrizes ACSM (150min/semana de atividade moderada ou 75min vigorosa). Ajustado: se gargalo é "tempo", propõe sessões mais curtas e densas; se frequência atual é 2x e ideal é 3x, sugere como encaixar.
- **Visualização proposta:** Card comparison: "Hoje: Xx" vs "Recomendado: Yx" com seta de progressão.
- **Placeholder:** `[frequencia_atual]`, `[frequencia_recomendada]`

### `projecao_evolucao`

- **O que é:** Estimativa de ganho de condicionamento em 4, 8 e 12 semanas
- **Por que aparece para o aluno:** Timeline de resultado é o dado mais engajante do relatório — mostra que há caminho concreto
- **Cálculo:** Baseado na frequência declarada e nível atual. Referência: estudos de adaptação fisiológica à natação (ganho cardiovascular de 10-15% em 8 semanas com 3x/semana, McArdle et al., Exercise Physiology). Expresso em termos práticos: "nada 100m em ~2:30 → em 8 semanas pode chegar a ~2:15"
- **Visualização proposta:** Timeline horizontal com 3 marcos (4sem, 8sem, 12sem) e breve descrição do que esperar em cada.
- **Placeholder:** `[projecao_4sem]`, `[projecao_8sem]`, `[projecao_12sem]`

### `metragem_semanal`

- **O que é:** Volume total de natação recomendado por semana (em metros)
- **Por que aparece para o aluno:** Métrica concreta de treino — o equivalente aquático do "quilômetros por semana" do corredor
- **Cálculo:** Baseado em frequência × duração × intensidade. Referência: nadador fitness recreativo 1.500-3.000m/semana; fitness dedicado 3.000-6.000m/semana; fitness avançado 6.000-10.000m/semana (USA Swimming guidelines adaptadas).
- **Visualização proposta:** Card com barra de progresso: metragem atual estimada vs metragem-alvo.
- **Placeholder:** `[metragem_semanal]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### `nivel_tecnico_estimado`

- **O que é:** Score composto baseado em nados dominados + frequência + estrutura de treino
- **Por que importa para o PT:** Permite triagem rápida — saber se o lead precisa de aula básica, intermediária ou avançada antes do primeiro contato
- **Cálculo:** Score 1-5 ponderado: nados_dominados (peso 40%) + frequencia (peso 30%) + estrutura_treino (peso 30%). 1 nado = 1pt, 2 nados = 2pt, 3+ = 3pt. Frequência 1x=1pt, 2x=2pt, 3x=3pt, 4+=4pt. Livre=1pt, planilha=2pt, turma=3pt, particular=4pt.
- **Visualização proposta:** Badge colorido (Iniciante fitness / Intermediário / Avançado) no card do lead.

### `risco_ombro`

- **O que é:** Flag de atenção para lesão de ombro baseada em frequência + nados + histórico
- **Por que importa para o PT:** "Ombro do nadador" é a lesão #1. PT precisa saber quem está em risco antes de prescrever volume alto de crawl.
- **Cálculo:** Score qualitativo: frequência 4+ vezes × só crawl × lesão prévia no ombro = risco alto. Sem lesão + multiestilos + frequência moderada = risco baixo.
- **Visualização proposta:** Semáforo (verde/amarelo/vermelho) no card do lead.

### `perfil_aderencia`

- **O que é:** Predição de adesão baseada em frequência real + estrutura de treino + gargalo
- **Por que importa para o PT:** Leads com gargalo "monotonia" ou "tempo" + sem estrutura = risco alto de abandono. PT pode priorizar atendimento.
- **Cálculo:** Heurística: gargalo monotonia/tempo + livre + 1-2x/semana = alto risco. Gargalo técnica/respiração + professor + 3+x = baixo risco.
- **Visualização proposta:** Score 1-10 com barra + label ("alta chance de continuar" / "precisa de atenção para não abandonar").

### `bmi_class`

- **O que é:** Classificação IMC técnica (underweight, normal, overweight, obesity_1, obesity_2, obesity_3)
- **Por que importa para o PT:** Classificação diagnóstica para priorização de abordagem nutricional e carga
- **Cálculo:** peso/altura² com classificação OMS padrão
- **Visualização proposta:** Label discreto no card do lead.

### `gasto_energetico_semanal`

- **O que é:** TEE (Total Energy Expenditure) semanal do treino de natação
- **Por que importa para o PT:** Permite calcular déficit/superávit calórico real se o aluno tem objetivo de composição corporal
- **Cálculo:** MET × peso × horas semanais de natação (baseado em frequência × duração estimada por contexto de piscina)
- **Visualização proposta:** Valor numérico + comparativo com recomendação ACSM.

---

## 9 · Pilares do relatório

### Pilar 1 · Sua Técnica na Água

- **Subtitle:** "Nadar melhor, não apenas mais"
- **Conceito central:** Eficiência técnica é o multiplicador silencioso da natação. Pequenos ajustes na posição do corpo, entrada da mão e respiração geram mais resultado que adicionar volume. Menos braçadas por piscina = mais distância com menos esforço.
- **Evidência científica:** Estudos de biomecânica aquática mostram que a resistência frontal (drag) do corpo na água é o principal limitador de velocidade. Reduzir drag via posição do corpo melhora performance em 15-25% sem aumento de esforço (Toussaint & Beek, 1992, Biomechanics of Swimming).
- **Placeholders esperados no copy:** `[nados_dominados]`, `[gargalo]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Você domina o crawl — e isso já é uma base sólida. Mas a diferença entre nadar 1000 metros exausto e nadar 1000 metros com energia sobrando está na técnica: a posição do corpo na água, o momento certo de respirar, o deslize após cada braçada. Não é sobre nadar mais forte — é sobre nadar mais inteligente. Com [profissional_nome], você pode desbloquear esse nível com ajustes simples."
- **Exemplo de texto técnico (30-40 palavras):** "Análise de eficiência: nadador com crawl dominante, oportunidade de redução de stroke count via extensão do catch e glide phase. Priorizar drills de posição lateral e respiração bilateral para estabilização do stroke pattern."

### Pilar 2 · Seu Treino Estruturado

- **Subtitle:** "Da raia ida e volta ao treino com propósito"
- **Conceito central:** Um treino de natação efetivo tem blocos com objetivo (aquecimento, principal, volta à calma), variação de estímulo (ritmo, nado, material) e progressão semanal. Mesmo em 30 minutos, a estrutura transforma o resultado.
- **Evidência científica:** Princípio da especificidade e da sobrecarga progressiva (ACSM Guidelines for Exercise Testing and Prescription, 11th ed.). Treinos estruturados com variação de intensidade produzem ganhos cardiovasculares 2-3x superiores a treinos de volume constante (estudo de meta-análise de interval training aquático, Lauer et al., 2019).
- **Placeholders esperados no copy:** `[frequencia_atual]`, `[frequencia_recomendada]`, `[metragem_semanal]`, `[calorias_sessao]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Hoje você nada [frequencia_atual]x por semana — e cada sessão pode render muito mais com um roteiro simples: 200m de aquecimento solto, um bloco principal com séries intervaladas (ex: 4×100m com 20s de descanso), e 100m de volta à calma. Isso transforma uma hora de 'nadar por nadar' em um treino que queima [calorias_sessao] calorias e evolui seu condicionamento de forma mensurável."
- **Exemplo de texto técnico (30-40 palavras):** "Programação sugerida: 3 sessões semanais (aeróbio contínuo, intervalado misto, técnico-regenerativo). Volume-alvo: [metragem_semanal]m/semana com progressão de 10% a cada 2 semanas. Monitorar RPE e stroke count."

### Pilar 3 · Seu Corpo e a Água

- **Subtitle:** "Cuidados que fazem você nadar por muitos anos"
- **Conceito central:** Natação é de baixíssimo impacto articular, mas tem desgastes próprios: ombro, ouvido, pele, hidratação. Cuidar dessas dimensões garante longevidade na piscina. Inclui fortalecimento compensatório (rotadores de ombro), aquecimento articular pré-treino e hidratação durante a sessão.
- **Evidência científica:** Prevalência de "swimmer's shoulder" em 40-91% de nadadores competitivos e alta incidência em recreativos com volume >3x/semana sem trabalho preventivo (Wanivenhaus et al., 2012, Sports Health). ACSM Position Stand on Fluid Replacement recomenda hidratação ativa durante exercício aquático.
- **Placeholders esperados no copy:** `[meta_agua_litros]`, `[risco_ombro]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):** "Na piscina, você não sente o suor — mas perde líquido do mesmo jeito. Sua meta diária de hidratação é [meta_agua_litros]L, e uma garrafa na borda da piscina faz diferença. Sobre os ombros: eles trabalham muito no crawl. Incluir 5 minutos de aquecimento articular antes de entrar na água e exercícios de fortalecimento de rotadores 2x por semana é o seguro mais barato que existe contra lesão."
- **Exemplo de texto técnico (30-40 palavras):** "Protocolo preventivo: aquecimento articular pré-sessão (bandas elásticas, rotação externa). Hidratação: [meta_agua_litros]L/dia + 200ml a cada 30min de treino. Risco de impingement: [risco_ombro]. Avaliação otorrinolaringológica anual recomendada para frequência >3x/sem."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Natação para condicionamento físico: adultos que já sabem nadar e usam a piscina como principal atividade física para saúde, resistência cardiovascular e bem-estar. Não são competidores, mas querem evoluir e ter feedback sobre seu progresso."

- **narrativeArc:**
  1. Validação — reconhecer que escolher natação como atividade principal é uma decisão inteligente (baixo impacto, trabalho de corpo inteiro)
  2. Diagnóstico — mostrar onde o aluno está hoje (nível, frequência, gargalo identificado)
  3. Revelação — mostrar uma métrica que surpreende (calorias queimadas, projeção de evolução, SWOLF benchmark se aplicável)
  4. Técnica — pilar 1: o que melhorar na execução dos nados
  5. Estrutura — pilar 2: como organizar os treinos na semana
  6. Longevidade — pilar 3: cuidados com ombro, hidratação, prevenção
  7. Próximo passo — direcionar para o profissional como quem vai montar o treino personalizado

- **terminology:**
  - crawl, costas, peito, borboleta
  - braçada, pernada, respiração bilateral
  - série, intervalo, educativo (drill)
  - pace (tempo por 100m), metragem
  - aquecimento, bloco principal, volta à calma
  - pull buoy, prancha, palmar, nadadeira
  - hidrodinâmica, deslize (glide)

- **forbiddenTerms:**
  - "nado livre" → usar "crawl" (é como o público fala no dia a dia)
  - "prescrição" → usar "sugestão" ou "recomendação" (natação fitness não é clínica)
  - "atleta" → usar "nadador" ou "praticante" (público não se vê como atleta)
  - "dieta" → usar "alimentação" (conotação negativa)
  - "obeso/obesidade" → usar "acima do peso ideal" (no relatório do aluno)
  - "fracasso/falha" → usar "ponto de atenção" ou "oportunidade"
  - "queima de gordura localizada" → não existe fisiologicamente
  - "simples" ou "fácil" → minimiza o esforço do nadador

- **recommendedTone:** "Tom de professor particular de natação que conhece você pelo nome: técnico o suficiente para gerar confiança, acessível o suficiente para que alguém sem formação esportiva entenda tudo. Usa analogias com o que a pessoa já vive na piscina. Celebra o que já conquistou antes de apontar melhorias."

- **pillarGuidance:**
  1. "Foque na relação braçada-eficiência. Use exemplos concretos do nado que a pessoa domina. Se só crawl, não fale de medley. Se multiestilos, explore as vantagens de cada nado como ferramenta."
  2. "Proponha estrutura de treino compatível com a frequência declarada. Se 2x/semana, não proponha planilha de 5x. Inclua exemplo de treino concreto (distância, intervalo, objetivo do bloco)."
  3. "Personalize os cuidados com base no gargalo e condições de saúde. Se marcou ombro, enfatize prevenção. Se marcou asma, explique por que a piscina é aliada. Sempre inclua hidratação."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `moderately_active`
  - **Justificativa:** Nadador fitness que nada 2-3x/semana em intensidade moderada se enquadra em "moderadamente ativo" pelo Compendium. Não é sedentário (já tem atividade regular), mas também não é "muito ativo" (isso seria 5+x/semana ou biathleta).

- **activityMapping:**
  - Pergunta: `frequencia_piscina`
  - Mapeamento:
    - `1x` → `lightly_active`
    - `2x` → `lightly_active` a `moderately_active` (depende do contexto de outras atividades)
    - `3x` → `moderately_active`
    - `4x` → `very_active`
    - `5x_mais` → `very_active` a `extremely_active`
  - **Nota:** O mapeamento assume natação como atividade principal. Se a pessoa também treina musculação, corrida etc., o nível real seria maior, mas não captamos essa informação neste template (para não inflar perguntas). O default `moderately_active` é conservador e seguro.

---

## 12 · Notas de design (decisões não-óbvias)

### Por que `nados_dominados` é multiple_choice e não single ("qual seu nado principal?")

Saber quais nados a pessoa domina é mais informativo que saber qual prefere. Um nadador que sabe crawl+costas+peito tem 3x mais opções de treino que um que só sabe crawl. Isso muda pilar, métricas e tom do relatório inteiramente. Pergunta single_choice perderia essa dimensão.

### Por que NÃO incluí pergunta sobre objetivo (emagrecer, condicionamento, relaxar)

O hub já define a especialidade como "Natação Fitness/Condicionamento" — perguntar "qual seu objetivo?" seria redundante. O gargalo (`maior_dificuldade`) captura mais sinal que o objetivo declarado: saber que alguém trava na respiração é mais acionável que saber que quer "melhorar condicionamento".

### Por que NÃO incluí pergunta sobre duração da sessão

Duração é parcialmente inferida do contexto da piscina (academia = 45-60min padrão de aula, condomínio = variável) e frequência. Perguntar aumentaria para 8 perguntas sem gerar mudança substancial no relatório — a IA pode calibrar recomendações com a frequência e o contexto.

### Por que asma NÃO é safety trigger

Natação é historicamente recomendada para asmáticos (ar úmido, posição horizontal, controle respiratório). ACSM e múltiplos estudos confirmam que o ambiente aquático é um dos melhores para broncoespasmo induzido por exercício. Seria contraproducente ativar safety e omitir prescrição para alguém que DEVERIA estar na piscina.

### Por que "ombro_lesao" NÃO é safety trigger

Lesão de ombro é extremamente comum em nadadores e não exige parada total — exige adaptação (troca de nado, redução de volume, fortalecimento). Ativar safety bloquearia o relatório para um público que pode e deve continuar nadando com ajustes. O copy da opção orienta a procurar fisio, sem bloquear.

### Por que propus renomear para "Natação para Condicionamento"

"Fitness" é americanismo que o público brasileiro entende, mas não usa naturalmente quando fala da própria natação. Ninguém diz "eu faço natação fitness". Dizem "eu nado para me manter/condicionar/ter saúde". "Condicionamento" é mais preciso e natural em pt-BR, além de se diferenciar claramente de "iniciante", "competitivo" e "masters".

### Por que apenas 2 branches de segmentação (não 3)

O terceiro branch potencial seria "apenas_peito" (nadador que só sabe peito), mas esse perfil é melhor atendido pelo branch `apenas_crawl` com ajuste de tom (peito isolado = nível semelhante de versatilidade). Criar branch dedicado para 1 nado não-crawl não muda substancialmente o relatório o suficiente para justificar complexidade.

---

## 13 · Pendências

1. **Lib de cálculo de calorias por nado:** Precisa identificar lib JS/TS que implemente Compendium MET values por stroke type, ou implementar manualmente a tabela de METs (são ~8 valores). Não é fórmula complexa — é lookup table + multiplicação.

2. **Referência de pace/100m por nível:** Precisa de tabela calibrada para nadadores brasileiros fitness (não competidores). Os benchmarks disponíveis (SWOLF ranges, CSS calculators) são calibrados para nadadores de língua inglesa/competitivos. Pode ser construída empiricamente com feedback de professores de natação parceiros.

3. **Projeção de evolução:** A estimativa de "melhora X% em Y semanas" precisa de validação com literatura mais granular. McArdle et al. dá a faixa geral (10-15% cardiovascular em 8 semanas), mas não é específico para natação em todas as populações. Anotar como "estimativa conservadora baseada em literatura geral de fisiologia do exercício".

4. **Métrica SWOLF condicional:** Para quem usa smartwatch, seria valioso incluir referência de SWOLF (45-60 para fitness = saudável, <45 = eficiente). Mas a minoria usa smartwatch aquático. Decisão: incluir como complemento textual no pilar técnico para quem marcou `sim_uso`, não como métrica visual separada.

5. **Validação com professor de natação:** Embora classificação clínica seja "Opcional", o template seria significativamente melhor com feedback de 1-2 professores de natação que atendam público fitness. Foco: validar as 6 opções de gargalo e confirmar se cobrem 80%+ dos casos reais.

---

## 14 · Fontes citadas

1. **Ainsworth, B.E. et al. (2011).** Compendium of Physical Activities: A Second Update of Codes and MET Values. _Medicine & Science in Sports & Exercise_, 43(8), 1575-1581. — MET values para cálculo calórico por nado e intensidade.

2. **Toussaint, H.M. & Beek, P.J. (1992).** Biomechanics of Competitive Front Crawl Swimming. _Sports Medicine_, 13(1), 8-24. — Resistência hidrodinâmica e impacto da técnica na performance.

3. **Wanivenhaus, F. et al. (2012).** Epidemiology of Injuries and Prevention Strategies in Competitive Swimmers. _Sports Health_, 4(3), 246-251. — Prevalência de "swimmer's shoulder" e protocolos preventivos.

4. **McArdle, W.D., Katch, F.I. & Katch, V.L. (2014).** _Exercise Physiology: Nutrition, Energy, and Human Performance_, 8th ed. — Adaptação cardiovascular ao treino aquático e projeções de evolução.

5. **ACSM (2021).** _Guidelines for Exercise Testing and Prescription_, 11th ed. — Frequência, intensidade e volume recomendados; posição sobre hidratação em exercício.

6. **Fitness Brasil (2024).** Panorama Setorial 2024. — Perfil demográfico de praticantes de atividade física no Brasil.

7. **CBDA — Confederação Brasileira de Desportos Aquáticos.** Dados de praticantes de natação no Brasil (~11 milhões).

8. **USA Swimming.** Guidelines for recreational and fitness swimming volume (metragem semanal por nível).

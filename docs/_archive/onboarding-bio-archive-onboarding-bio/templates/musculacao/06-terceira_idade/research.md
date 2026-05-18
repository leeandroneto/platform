# Research · Especialidade 6 · 60+ Ativo

## 0 · Metadados

- **Número:** 6
- **Modality:** musculacao
- **Pasta:** `musculacao/06-terceira_idade/`
- **Plano:** pro
- **Validação clínica:** 🚨 Bloqueante — geriatra e/ou educador físico com especialização em gerontologia
- **Pesquisado em:** 2026-04-23
- **Label proposto:** "60+ Ativo" (ver Notas de design, seção 12)
- **`specialty_code` proposto:** `ativo_60plus`
- **Fontes consultadas:**
  1. ACSM Guidelines for Exercise Testing and Prescription, 11th ed. (2022)
  2. Fragala et al. — "Resistance Training for Older Adults: Position Statement from the NSCA" (Journal of Strength & Conditioning Research, 2019)
  3. Izquierdo et al. — "International Exercise Recommendations in Older Adults (ICFSR)" (Journal of Nutrition, Health & Aging, 2021)
  4. Bauer et al. — "Evidence-Based Recommendations for Optimal Dietary Protein Intake in Older People: A Position Paper from the PROT-AGE Study Group" (JAMDA, 2013)
  5. Sherrington et al. — "Exercise for preventing falls in older people living in the community" (Cochrane Review, 2019)
  6. IBGE — Censo Demográfico 2022: projeções populacionais
  7. SBGG (Sociedade Brasileira de Geriatria e Gerontologia) — Diretrizes para atividade física no envelhecimento
  8. Cruz-Jentoft et al. — "Sarcopenia: revised European consensus" (EWGSOP2, Age and Ageing, 2019)

---

## 1 · Quem é esse público no Brasil

### Perfil demográfico

- **Faixa etária:** 60-80 anos (núcleo: 60-72). Acima de 80 tipicamente requer acompanhamento presencial exclusivo.
- **Gênero:** mulheres são maioria — 56% da população 60+ (IBGE 2022). Também são maioria em academias e programas de ginástica para essa faixa.
- **Contexto socioeconômico:** classe B/C predomina entre os que buscam PT. Classe A já tem acompanhamento privado completo. Classe D/E usa programas públicos (Academia da Saúde do SUS) — não é o ICP do onboarding.bio.
- **Escolaridade:** variada, mas a maioria que chega via Instagram tem familiaridade com smartphone.

### Ordem de grandeza

**Grande mercado em crescimento acelerado.** IBGE 2022 aponta ~32,1 milhões de pessoas 60+ no Brasil (15,6% da população). Projeção para 2030: ~40 milhões. É o segmento demográfico que mais cresce. A penetração em academias nessa faixa ainda é baixa (~8-12% estimado), representando espaço enorme de captação.

### Onde estão online

- **WhatsApp:** praticamente 100% de adoção, principal canal de comunicação
- **Instagram:** crescimento acelerado — Meta reporta ~18M de usuários 55+ no Brasil (2025). Perfis de saúde, receitas, lifestyle
- **YouTube:** consumo alto (tutoriais, saúde, notícias), mas passivo
- **Facebook:** ainda relevante mas em declínio de engajamento ativo
- **Grupos WhatsApp:** turmas de ginástica, caminhada, igreja — boca-a-boca é o canal #1 de indicação

### Linguagem-padrão

- **Termos de identidade:** "manter a forma", "qualidade de vida", "disposição", "autonomia", "não depender dos outros", "envelhecer bem", "ficar forte"
- **Termos de dor:** "sinto dor no joelho", "não aguento mais ficar parado(a)", "perdi muita força", "tenho medo de cair", "me sinto travado(a)"
- **O que usam para se referir à atividade:** "fazer exercício", "ginástica", "musculação" (sim, o termo é usado), "academia", "caminhada"
- **NÃO usam:** "treinar", "shape", "bulking", "PR", "rep", "set" — jargão de jovem academia. Usam "série", "repetição", "peso" (termos traduzidos).

### O que ofende ou afasta

- **Infantilização:** tratar como frágil por padrão. "Cuidado vovô" mata a conversão. Muitos 60+ são extremamente ativos e se ofendem quando tratados como incapazes.
- **Termo "idoso":** legal (Estatuto do Idoso), mas muitos não se identificam. Evitar como label público.
- **"Terceira idade":** aceitável mas cada vez mais datado. Preferem não ser categorizado pela idade, e sim pelo estilo de vida.
- **"Melhor idade":** eufemismo que soa condescendente para muitos.
- **Promessas irreais:** "volte a ter o corpo dos 30" é mentira e eles sabem. Respeitar a inteligência do público.
- **Focar apenas em limitações:** "o que você NÃO consegue?" como abordagem principal. Devemos perguntar sobre capacidades, não sobre deficiências.

### Dor mais comum que os leva a procurar ajuda

**Perda de força funcional percebida** — "não consigo mais fazer coisas que fazia antes" (carregar compras, subir escada, brincar com netos). É a motivação mais poderosa porque conecta exercício com autonomia e dignidade, não com estética. Em segundo lugar: **recomendação médica** ("meu médico mandou fazer musculação") e **medo de quedas** (especialmente após um episódio ou de alguém próximo).

---

## 2 · Decisão de escopo

### Este template vai cobrir:

- Adultos 60-80 anos funcionalmente independentes (vivem sozinhos ou com mínima assistência)
- Todos os níveis de experiência com exercício (de sedentário a ativo regular)
- Objetivos: manutenção de independência, ganho de força, prevenção de quedas, qualidade de vida, socialização
- Condições crônicas controladas (diabetes medicada, hipertensão controlada, artrose leve/moderada, próteses articulares estabilizadas)

### Este template NÃO vai cobrir:

- **Acima de 80 com fragilidade severa** → requer protocolo individualizado presencial, não cabe em template de lead capture
- **Demência / declínio cognitivo significativo** → precisa de cuidador preenchendo, muda toda a dinâmica do formulário
- **Pós-operatório recente (< 6 meses de cirurgia ortopédica ou cardíaca)** → especialidade #8 (Reabilitação) cobre melhor
- **Condições cardíacas ou pressão NÃO controladas** → safety trigger redireciona ao profissional com recomendação de avaliação médica
- **Dependência funcional severa (não consegue se deslocar sozinho)** → requer atendimento domiciliar especializado

---

## 3 · Motores escolhidos

### Decisão narrativa

**Motores considerados e decisão:**

| Motor                          | Incluir?                        | Justificativa                                                                                                                                            |
| ------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor 6 (Identidade/Fase)      | ✅ Segmentação                  | A "fase ativa" é o segmentador perfeito: ativo/querendo começar/com limitações. Define branch e tom.                                                     |
| Motor 2 (Gargalo)              | ✅                              | Essencial. O que trava é o centro da narrativa do relatório.                                                                                             |
| Motor 4 (Comportamento)        | ✅                              | Frequência real recente — calibra recomendação de progressão.                                                                                            |
| Motor 3 (Nível/Maturidade)     | ✅ Adaptado como tela funcional | Em vez de "experiência de treino", adaptei para capacidade funcional (ADLs). Para 60+, o que importa é o que CONSEGUE fazer, não há quanto tempo treina. |
| Motor 5 (Ambiente)             | ✅                              | Local de treino muda radicalmente a prescrição (máquinas vs corpo livre vs ar livre).                                                                    |
| Motor 8 (Safety)               | ✅                              | Obrigatório. Público com maior prevalência de comorbidades.                                                                                              |
| Motor 1 (Contexto atual)       | ❌                              | Redundante — Motor 6 + Motor 4 já capturam contexto atual.                                                                                               |
| Motor 7 (Métricas/Ferramentas) | ❌                              | Público raramente usa FC, apps de treino, etc. Pergunta técnica sem retorno. Seria fricção vazia.                                                        |

**Total: 6 motores → 6 perguntas específicas.** Dentro do range ideal.

### Lista final

1. **Segmentação (Motor 6)** → `fase_ativa` — Fase de vida ativa atual (abre branches)
2. **Comportamento (Motor 4)** → `frequencia_semanal` — Frequência real de atividade na última semana
3. **Gargalo (Motor 2)** → `principal_barreira` — O que mais impede ou já impediu de se exercitar
4. **Nível funcional (Motor 3 adaptado)** → `capacidade_funcional` — Triagem funcional via ADLs cotidianas
5. **Ambiente (Motor 5)** → `local_treino` — Onde pretende treinar
6. **Safety (Motor 8)** → `condicoes_saude` — Condições de saúde relevantes

---

## 4 · Perguntas e opções

### Q1 · `fase_ativa` _(Motor 6 — Identidade/Fase)_

**Type:** `single_choice`
**Label (client-facing):** "Como você descreveria sua fase ativa hoje?"
**Helper:** "Escolha a opção que mais se parece com você agora."
**Required:** sim
**Visibility:** sempre
**Segmentação:** sim (abre branches)
**depthRequired:** quick

**Opções:**

- **`ativo_regular`** — "Já pratico exercícios regularmente"
  - Copy (60-120 palavras): "Excelente — manter uma rotina de exercícios após os 60 é uma das decisões mais poderosas para a longevidade. A ciência mostra que adultos que treinam regularmente nessa faixa etária preservam até 80% mais massa muscular por década comparado aos sedentários. Seu corpo já reconhece o estímulo do treino e responde com eficiência. O próximo passo é garantir que seu programa esteja otimizado para as necessidades específicas dessa fase: proteção articular, densidade óssea, equilíbrio e força funcional. Um ajuste fino no que você já faz pode multiplicar seus resultados."
  - Safety trigger? não

- **`quer_comecar`** — "Quero começar ou voltar a treinar"
  - Copy (60-120 palavras): "Essa decisão tem mais impacto do que parece. A perda muscular natural (sarcopenia) acelera a partir dos 60, mas a boa notícia é que o músculo responde ao treino em QUALQUER idade — estudos mostram ganhos de força de 25-100% mesmo em nonagenários após 8-12 semanas de treino resistido. Não importa quanto tempo ficou parado(a). Seu corpo tem uma capacidade impressionante de readaptação. O segredo é começar com o volume certo, respeitar a recuperação (que é mais lenta mas igualmente eficaz) e construir consistência antes de intensidade. Cada sessão conta."
  - Safety trigger? não

- **`com_limitacoes`** — "Tenho limitações que dificultam exercícios"
  - Copy (60-120 palavras): "Ter limitações não significa que exercício não é para você — na verdade, a evidência científica mostra exatamente o contrário. Para dor articular, artrose e restrições de mobilidade, o exercício resistido corretamente prescrito é considerado tratamento de primeira linha por reumatologistas e geriatras. A chave é a adaptação inteligente: escolher amplitudes de movimento confortáveis, usar progressão gradual, respeitar sinais de dor e trabalhar COM o corpo, não contra ele. Um profissional que entende esse público sabe exatamente como ajustar cada exercício para sua realidade. Limitação não é barreira — é informação para um programa melhor."
  - Safety trigger? não (mas direciona ao branch mais conservador)

**Justificativa da pergunta:** A fase ativa é o segmentador mais natural para 60+ porque define toda a calibração do relatório — linguagem, nível de ambição, tom motivacional, métricas relevantes. É mais útil que "objetivo" (que no universal já coleta goal) porque revela o PONTO DE PARTIDA, não o destino.

**Justificativa das opções:** Três opções cobrem o espectro completo da realidade funcional dos 60+. Descartei "ativo competitivo" como 4ª opção (atletas master existem, mas são <2% desse público no contexto Instagram — não justifica branch). Também descartei separar "começar" de "voltar" — para o template, o caminho é igual (progressão gradual).

---

### Q2 · `frequencia_semanal` _(Motor 4 — Comportamento)_

**Type:** `single_choice`
**Label (client-facing):** "Na última semana, quantas vezes você fez alguma atividade física?"
**Helper:** "Conta tudo: caminhada, ginástica, musculação, dança, hidroginástica..."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick

**Opções:**

- **`nenhuma`** — "Nenhuma vez"
  - Copy (60-80 palavras): "Sem julgamento — a maioria das pessoas com mais de 60 anos no Brasil não pratica atividade física regular. Isso significa que qualquer frequência que você construir a partir de agora vai gerar um impacto desproporcional na sua saúde. O corpo sedentário responde com entusiasmo ao primeiro estímulo. A recomendação científica começa com apenas 2 sessões semanais — é menos do que parece."
  - Safety trigger? não

- **`uma_duas`** — "1 a 2 vezes"
  - Copy (60-80 palavras): "Você já está na frente da maioria. Uma ou duas sessões por semana já ativam processos de preservação muscular e óssea. Pesquisas mostram que mesmo uma sessão semanal de resistido reduz o risco de queda em 23%. O próximo degrau é consistência — manter esse ritmo por semanas, não dias. Se possível, chegar a 3 sessões é o ponto ótimo para essa faixa etária."
  - Safety trigger? não

- **`tres_quatro`** — "3 a 4 vezes"
  - Copy (60-80 palavras): "Essa é a frequência que a ciência aponta como ideal para adultos 60+. Três a quatro sessões semanais cobrem os pilares essenciais: força, equilíbrio, mobilidade e condicionamento cardiovascular. Seu corpo já tem uma base sólida de adaptação. O foco agora é qualidade da prescrição — garantir que cada sessão trabalhe o que mais importa para manter sua autonomia e vitalidade a longo prazo."
  - Safety trigger? não

- **`cinco_mais`** — "5 ou mais vezes"
  - Copy (60-80 palavras): "Impressionante. Sua consistência está acima da média geral de QUALQUER faixa etária. Nesse nível, o cuidado principal é com recuperação — o tecido muscular e articular acima dos 60 precisa de mais tempo entre estímulos intensos. Periodização inteligente (alternar dias de força com dias de mobilidade/equilíbrio) protege de overuse e maximiza o retorno de cada sessão."
  - Safety trigger? não

**Justificativa da pergunta:** Comportamento recente e concreto, não intenção. "Quantas vezes pretende treinar?" é inútil — todo mundo diz 3-4. O que a pessoa REALMENTE fez na última semana é a fotografia verdadeira. Calibra expectativa de progressão, mapeia activity_level para TDEE, e indica realismo de metas.

**Justificativa das opções:** Quatro faixas claras que capturam o espectro sem forçar precisão ("3 ou 4? não lembro exato" → faixa resolve). Inclui helper para expandir o que conta como atividade física — muitos 60+ caminham diariamente mas não "contam" como exercício.

---

### Q3 · `principal_barreira` _(Motor 2 — Gargalo)_

**Type:** `single_choice`
**Label (client-facing):** "O que mais te impede ou já te impediu de se exercitar?"
**Helper:** "Se mais de uma opção se aplica, escolha a que pesa MAIS."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`dor_articular`** — "Dor ou desconforto nas articulações"
  - Copy (80-120 palavras): "Dor articular é a barreira mais citada por adultos 60+ — e a mais mal interpretada. Artrose, desgaste cartilaginoso e dores crônicas NÃO são contraindicação para exercício. Ao contrário: a Sociedade Brasileira de Reumatologia e a ACSM recomendam exercício resistido como tratamento de primeira linha para artrose de joelho e quadril. O mecanismo é direto — o fortalecimento muscular ao redor da articulação reduz a carga sobre a cartilagem, melhora a lubrificação sinovial e diminui a dor ao longo de semanas. O segredo está em escolher amplitudes confortáveis, progredir gradualmente e nunca forçar dor aguda. Exercício não piora artrose — inatividade piora."
  - Safety trigger? não

- **`medo_lesao`** — "Medo de me machucar"
  - Copy (80-120 palavras): "O medo é legítimo — mas os dados dizem o oposto do que parece. A taxa de lesão em programas supervisionados de musculação para 60+ é menor que 1% por participante-ano (Fragala et al., NSCA 2019). É mais seguro que caminhar na rua sem supervisão. O risco real não está em fazer exercício — está em NÃO fazer. A perda muscular (sarcopenia) e de equilíbrio são os maiores preditores de queda e fratura em 60+. Um programa bem prescrito, com progressão controlada, é a melhor proteção contra lesão que existe. O profissional que acompanha você sabe exatamente como dosar a intensidade."
  - Safety trigger? não

- **`falta_orientacao`** — "Não sei o que é seguro para mim"
  - Copy (80-120 palavras): "Essa é a dúvida mais inteligente dessa lista. Reconhecer que precisa de orientação específica para a sua faixa etária já é um diferencial enorme. As necessidades de um adulto 60+ são genuinamente diferentes: recuperação mais lenta (mas igualmente eficaz), prioridade em exercícios multiarticulares funcionais, atenção à pressão arterial durante esforço, cuidado com amplitudes extremas. Informação genérica de internet (pensada para jovens) pode ser não apenas inútil, mas arriscada. O profissional certo não adapta um treino de jovem para você — ele projeta um programa específico para as demandas biomecânicas, fisiológicas e de estilo de vida de quem tem 60+."
  - Safety trigger? não

- **`falta_motivacao`** — "Falta de companhia ou motivação"
  - Copy (80-120 palavras): "Depois dos 60, a motivação raramente é estética — é social e funcional. A boa notícia: academias com programas para essa faixa etária criam comunidades fortes. Turmas de ginástica, grupos de caminhada e treinos em dupla transformam exercício em encontro social. A ciência confirma: adultos que treinam em grupo têm aderência 2-3× maior do que os que treinam sozinhos. Se a solidão ou falta de companhia é o que trava, o profissional certo não vai te dar uma planilha — vai te conectar a um contexto onde exercício é parte de uma rotina social que você quer manter."
  - Safety trigger? não

- **`profissional_inadequado`** — "Não encontro profissional que entenda minha faixa etária"
  - Copy (80-120 palavras): "Você tocou no ponto mais importante. A maioria dos profissionais de educação física é treinada com foco em jovens atletas ou adultos saudáveis. Poucos se especializam em gerontologia do exercício — e a diferença é substancial. Um profissional preparado para 60+ entende de periodização adaptada, prescrição com condições crônicas, progressão conservadora de carga, exercícios de equilíbrio integrados e comunicação respeitosa (sem infantilizar). O fato de você estar aqui preenchendo este formulário indica que o profissional que te indicou provavelmente tem essa especialização. Seu relatório vai mostrar exatamente como esse acompanhamento se traduz em resultados."
  - Safety trigger? não

- **`nenhuma_barreira`** — "Nenhuma — estou bem encaminhado(a)"
  - Copy (60-80 palavras): "Ótimo — você já superou as barreiras mais comuns. Seu relatório vai focar em otimização: como garantir que seu programa esteja alinhado com as melhores práticas para preservação muscular, saúde óssea e prevenção de quedas nessa fase. Mesmo quem já treina bem pode ter gaps em equilíbrio, mobilidade ou nutrição proteica que fazem diferença a longo prazo."
  - Safety trigger? não

**Justificativa da pergunta:** O gargalo é o coração do relatório — define em QUE a narrativa foca. Para 60+, as barreiras são radicalmente diferentes de jovens: não é "falta de tempo" ou "dieta" (os gargalos típicos de emagrecimento). É medo, dor e falta de orientação adequada. Cada opção desconstrói uma crença limitante com evidência.

**Justificativa das opções:** Mapeadas a partir dos 5 gargalos mais citados em pesquisas brasileiras sobre inatividade em idosos (SBGG, VIGITEL 2023). "Falta de tempo" foi descartada — irrelevante para aposentados/semi-aposentados. "Custo" também — quem chega via PT de Instagram já aceitou pagar. "Nenhuma" fecha a lista positivamente.

---

### Q4 · `capacidade_funcional` _(Motor 3 adaptado — Nível funcional)_

**Type:** `multiple_choice`
**Label (client-facing):** "Quais dessas atividades fazem parte do seu dia a dia?"
**Helper:** "Marque todas que você faz sem dificuldade."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard
**maxSelections:** 5

**Opções:**

- **`escada`** — "Subir um lance de escada sem me segurar"
  - Copy (40-60 palavras): "Subir escadas sem apoio exige força de quadríceps, equilíbrio dinâmico e capacidade cardiovascular. É um dos marcadores mais fortes de independência funcional em 60+. Quem consegue fazer isso tem reserva muscular sólida nos membros inferiores."
  - Safety trigger? não

- **`levantar_cadeira`** — "Levantar de uma cadeira sem usar as mãos"
  - Copy (40-60 palavras): "O teste sit-to-stand é usado mundialmente como triagem de força funcional em geriatria. Levantar sem apoio das mãos exige força de glúteos, quadríceps e core. É o movimento funcional mais preditivo de autonomia a longo prazo."
  - Safety trigger? não

- **`carregar_peso`** — "Carregar sacolas de compras (5kg ou mais)"
  - Copy (40-60 palavras): "Força de preensão e capacidade de carga são preditores diretos de mortalidade em 60+ (estudos de coorte, Leong et al., Lancet 2015). Carregar peso no dia a dia indica que a musculatura de membros superiores e core mantém funcionalidade adequada."
  - Safety trigger? não

- **`caminhar_15min`** — "Caminhar 15 minutos sem parar"
  - Copy (40-60 palavras): "Capacidade de caminhar 15 minutos sem pausa reflete condicionamento cardiovascular mínimo e ausência de limitações musculoesqueléticas severas. É a base sobre a qual se constrói qualquer programa de exercícios para essa faixa etária."
  - Safety trigger? não

- **`agachar`** — "Agachar para pegar algo no chão"
  - Copy (40-60 palavras): "Agachar e retornar à posição em pé exige mobilidade de quadril, tornozelo e joelho, além de equilíbrio e força excêntrica. É um dos movimentos mais comprometidos com a idade e um dos mais treináveis com exercício resistido."
  - Safety trigger? não

**Justificativa da pergunta:** Esta é a pergunta mais inovadora do template. Em vez de perguntar "qual seu nível" (subjetivo, 60+ tende a subestimar), transformamos atividades do dia a dia em triagem funcional indireta. Cada opção mapeia para um teste clínico validado (sit-to-stand, stair climb, grip strength proxy, walk test, squat-to-stand). A SOMA das marcações gera um score funcional de 0-5 que é extraordinariamente informativo:

- 5/5 → alta capacidade funcional
- 3-4/5 → capacidade moderada, gaps identificáveis
- 0-2/5 → baixa capacidade, prioridade em fundamentos

**Justificativa das opções:** Os 5 itens foram selecionados com base nos testes funcionais mais validados em geriatria (Short Physical Performance Battery — SPPB, Timed Up and Go). Cada item testa uma dimensão diferente (MMII, MMSS, cardio, mobilidade, equilíbrio). São atividades que 100% dos 60+ reconhecem — sem jargão, sem constrangimento. Reframei como "fazem parte do seu dia a dia" em vez de "você consegue fazer?" para evitar tom de teste/julgamento.

---

### Q5 · `local_treino` _(Motor 5 — Ambiente)_

**Type:** `single_choice`
**Label (client-facing):** "Onde você pretende treinar?"
**Helper:** "Se ainda não decidiu, escolha o que mais te atrai."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** standard

**Opções:**

- **`academia`** — "Academia"
  - Copy (60-80 palavras): "A academia é o ambiente mais seguro e completo para treino resistido 60+. Máquinas guiadas reduzem o risco de execução incorreta, permitem ajuste fino de carga e protegem articulações comprometidas. O ambiente social (turmas, colegas, equipe) reforça aderência. Academias com programas dedicados para essa faixa etária são ideais — procure as que oferecem horários adaptados e profissionais com formação em gerontologia."
  - Safety trigger? não

- **`casa`** — "Em casa"
  - Copy (60-80 palavras): "Treinar em casa é viável com adaptações. Cadeiras, garrafas d'água, elásticos de resistência e o peso do próprio corpo são suficientes para os primeiros meses. O desafio é progressão e segurança — sem equipamento apropriado, o teto de estímulo chega rápido. O programa vai priorizar exercícios seguros sem equipamento, com variações de progressão usando objetos domésticos. Supervisão remota pelo profissional ajuda a corrigir execução."
  - Safety trigger? não

- **`ar_livre`** — "Ao ar livre (praça, parque)"
  - Copy (60-80 palavras): "Academias ao ar livre (academias da terceira idade em praças) são populares e acessíveis. O ambiente social é forte — muitos grupos se formam espontaneamente. A limitação está nos equipamentos (geralmente poucos e sem carga ajustável) e na ausência de supervisão técnica. O programa vai incluir exercícios com peso corporal e elásticos que complementam os aparelhos disponíveis na praça."
  - Safety trigger? não

- **`nao_decidi`** — "Ainda não decidi"
  - Copy (40-60 palavras): "Sem problema — a decisão de onde treinar pode vir depois da primeira conversa com o profissional. O relatório vai apresentar recomendações que funcionam em qualquer ambiente, e o profissional pode orientar a melhor escolha baseada no que você precisa."
  - Safety trigger? não

**Justificativa da pergunta:** Local muda drasticamente a prescrição para 60+. Em academia, usa máquinas guiadas (mais seguras). Em casa, precisa de adaptações criativas. Ao ar livre, limitado em equipamento. O pilar "Movimento Seguro" dá recomendações completamente diferentes baseado nessa resposta.

**Justificativa das opções:** "Estúdio de pilates/funcional" foi descartada — se o lead vai pra pilates, provavelmente não é o público deste template de musculação. "Condomínio/prédio" foi agrupado com "casa".

---

### Q6 · `condicoes_saude` _(Motor 8 — Safety)_

**Type:** `multiple_choice`
**Label (client-facing):** "Você tem alguma dessas condições?"
**Helper:** "Marque todas que se aplicam. Essas informações são confidenciais e ajudam a personalizar seu relatório."
**Required:** sim
**Visibility:** sempre
**Segmentação:** não
**depthRequired:** quick
**maxSelections:** 7

**Opções:**

- **`hipertensao_descontrolada`** — "Pressão alta não controlada (sem medicação ou dosagem em ajuste)"
  - Copy (40-60 palavras): "Pressão arterial não controlada requer avaliação médica antes de iniciar exercício resistido. A musculação pode elevar transitoriamente a pressão durante o esforço. Com controle adequado (medicação estabilizada), o exercício é seguro e inclusive recomendado para reduzir a pressão a longo prazo."
  - Safety trigger? **sim** (reason: "Risco de evento cardiovascular durante esforço. Necessita liberação médica e estabilização pressórica antes de iniciar programa de exercícios.")

- **`cardiopatia`** — "Problema cardíaco (arritmia, insuficiência, angina, etc.)"
  - Copy (40-60 palavras): "Condições cardíacas não estabilizadas exigem avaliação cardiológica e, em muitos casos, teste ergométrico antes de iniciar exercício. Com liberação médica, o treino resistido é recomendado inclusive para reabilitação cardíaca — mas a prescrição precisa ser supervisionada e individualizada."
  - Safety trigger? **sim** (reason: "Risco de evento cardíaco durante esforço resistido. Necessita estratificação de risco cardiológico e liberação médica.")

- **`diabetes`** — "Diabetes (tipo 1 ou 2)"
  - Copy (40-60 palavras): "Diabetes controlada não contraindica exercício — ao contrário, o exercício resistido é uma das intervenções mais eficazes para controle glicêmico. O cuidado é com hipoglicemia durante e após o treino (especialmente com insulina). O profissional precisa saber para ajustar horário e intensidade das sessões."
  - Safety trigger? **não** (condição controlada, ajuste de prescrição)

- **`osteoporose`** — "Osteoporose diagnosticada"
  - Copy (40-60 palavras): "Osteoporose diagnosticada requer cuidado com exercícios de flexão espinhal extrema e impacto de alta intensidade, mas exercício resistido é TRATAMENTO de primeira linha — o estímulo mecânico promove formação óssea. O programa vai priorizar exercícios de carga axial e evitar movimentos de risco."
  - Safety trigger? **não** (exercício é tratamento, não contraindicação)

- **`protese`** — "Prótese articular (quadril, joelho, ombro)"
  - Copy (40-60 palavras): "Próteses articulares estabilizadas (> 6 meses pós-cirurgia, reabilitação concluída) permitem treino resistido com adaptações. O programa vai respeitar amplitudes de movimento recomendadas pelo cirurgião e evitar carga excessiva na articulação substituída. Fortalecimento da musculatura ao redor da prótese é essencial."
  - Safety trigger? **não** (prótese estabilizada, ajuste de exercícios)

- **`quedas_recentes`** — "Já caí nos últimos 6 meses"
  - Copy (40-60 palavras): "Quedas recentes são um sinal de alerta importante para o profissional — indicam possível déficit de equilíbrio, força ou efeito de medicação. O programa vai priorizar treino de equilíbrio e fortalecimento de membros inferiores. Se as quedas foram frequentes (2+), avaliação médica pode ser necessária."
  - Safety trigger? **não** (flag importante para PT, mas uma queda isolada não exige liberação médica — o exercício É a intervenção)

- **`polimedicacao`** — "Tomo 5 ou mais medicamentos por dia"
  - Copy (40-60 palavras): "Polimedicação (5+ medicamentos) é comum após os 60 e pode afetar equilíbrio, pressão arterial em pé (hipotensão ortostática), tempo de reação e fadiga. O profissional precisa conhecer seus medicamentos para ajustar horários de treino, monitorar sinais e adaptar intensidade."
  - Safety trigger? **não** (flag para PT, ajuste de prescrição)

- **`nenhuma`** — "Nenhuma dessas"
  - Copy (30-40 palavras): "Excelente ponto de partida. Sem condições que exijam adaptações específicas, o programa pode progredir com segurança dentro dos protocolos padrão para sua faixa etária."
  - Safety trigger? não

**Justificativa da pergunta:** OBRIGATÓRIA para especialidade com validação clínica bloqueante. Para 60+, a prevalência de comorbidades é alta (~70% têm pelo menos uma condição crônica). Multiple_choice porque é comum ter mais de uma condição simultaneamente.

**Justificativa das opções:** As 7 condições foram selecionadas pela prevalência em 60+ brasileiros (VIGITEL, PNAD Saúde) E pelo impacto na prescrição de exercício. **Apenas 2 são safety triggers** (hipertensão descontrolada e cardiopatia) — seguindo a regra de que safety é para "precisa de médico ANTES de começar", não para "precisa de ajuste na prescrição".

Descartadas:

- "Labirintite/tontura" — coberta indiretamente por `quedas_recentes` e `polimedicacao`
- "Depressão" — relevante mas sensível demais para formulário de lead capture
- "Artrose/artrite" — capturada por `dor_articular` em Q3 (gargalo), não precisa de pergunta de saúde separada
- "Câncer" — muito amplo (câncer em remissão ≠ câncer em tratamento), requer anamnese presencial

---

## 5 · Branches

### Branch: "Ativo Regular" (trigger: `fase_ativa == ativo_regular`)

- **Tom geral:** Respeitoso e nivelado. Não infantiliza, não celebra em excesso. Trata como alguém que sabe o que faz e busca otimização, não básico.
- **pillarGuidance:** Foco em refinamento: periodização adaptada, prevenção proativa, nutrição para performance (não para "sobrevivência"). Pode usar terminologia de treino intermediária.
- **Additional questions:** Nenhuma.
- **Remove questions:** Nenhuma.
- **Metrics override:** Adiciona métricas de performance (volume de treino estimado, score funcional com expectativa alta). Remove timeline de "início de programa" (já está no programa).
- **Narrative arc override:** "Você já está no caminho. Vamos refinar → Otimizar → Proteger o que você conquistou."

**Justificativa:** Esse público (15-25% estimado dos leads 60+) precisa de relatório que não pareça "para iniciante". Se o relatório fala "comece com 2x/semana" para quem treina 4x, perde credibilidade. O arco muda de "construir hábito" para "otimizar investimento".

### Branch: "Quer Começar" (trigger: `fase_ativa == quer_comecar`)

- **Tom geral:** Acolhedor, empoderador, validante. Foco em "você PODE e está tomando a decisão certa". Sem pressão, sem urgência artificial.
- **pillarGuidance:** Foco em fundamentos: como começar sem medo, o que esperar nas primeiras semanas, progressão mínima viável. Linguagem simples, exemplos concretos. Evitar jargão.
- **Additional questions:** Nenhuma.
- **Remove questions:** Nenhuma.
- **Metrics override:** Enfatiza score funcional como baseline ("aqui é seu ponto de partida"), timeline de adaptação ("em 4-6 semanas você já sentirá diferença"), frequência mínima recomendada.
- **Narrative arc override:** "Sua decisão de começar agora → O que acontece no seu corpo com treino resistido → Por onde começar → O profissional como guia."

**Justificativa:** Maior grupo estimado (50-60% dos leads). O relatório precisa funcionar como "empurrão final" — o lead já está interessado mas inseguro. Cada seção deve reduzir medo e construir confiança com evidência, não com frases vazias.

### Branch: "Com Limitações" (trigger: `fase_ativa == com_limitacoes`)

- **Tom geral:** Cuidadoso mas NÃO pessimista. Valida que limitação ≠ impossibilidade. Foco em "o que É possível" mais que "o que não pode". Tom de especialista clínico compassivo.
- **pillarGuidance:** Foco em adaptação inteligente: exercícios modificados, amplitudes seguras, progressão ultra-gradual. Cada pilar começa com "o que muda para você" e depois "como adaptar". Citar evidência de que exercício melhora (não piora) a maioria das condições crônicas.
- **Additional questions:** Nenhuma (Q4 e Q6 já capturam o que precisa).
- **Remove questions:** Nenhuma.
- **Metrics override:** Score funcional com expectativa calibrada (faixas de referência ajustadas). Enfatiza métricas de segurança e prevenção de quedas. Omite métricas de performance.
- **Narrative arc override:** "Limitações são informação, não sentença → A ciência mostra que exercício é tratamento → O que muda na SUA prescrição → O profissional como parceiro nesse processo."

**Justificativa:** 20-30% dos leads 60+. Grupo mais vulnerável e que mais precisa de um relatório que convença a dar o próximo passo. Se o relatório parece genérico ou ignora suas limitações, perde total credibilidade. Se exagera nas restrições, assusta. O equilíbrio é: "sim, você pode — e eis como, especificamente, para o seu caso."

---

## 6 · Safety triggers

| Questão           | Opções                      | Reason (clínico)                                                                                                                                                                                        | Efeito no relatório                                                                              |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `condicoes_saude` | `hipertensao_descontrolada` | Hipertensão não controlada eleva risco de AVC e evento cardíaco durante manobra de Valsalva e esforço isométrico, comuns na musculação. Estabilização pressórica é pré-requisito.                       | Macros omitidas, timeline omitida, SafetyNote aparece, IA instrui buscar médico antes de iniciar |
| `condicoes_saude` | `cardiopatia`               | Arritmias, insuficiência cardíaca e angina instável requerem estratificação de risco cardiológico (teste ergométrico/ergoespirométrico) antes de iniciar exercício resistido. Risco de evento cardíaco. | Macros omitidas, timeline omitida, SafetyNote aparece, IA instrui buscar cardiologista           |

**safetyTemplate:**

- **Title:** "Seu cuidado merece atenção especial"
- **Body:** "Identificamos que você tem uma condição que precisa de avaliação médica antes de iniciar ou ajustar um programa de exercícios. Isso NÃO significa que exercício não é para você — na maioria dos casos, é exatamente o contrário. Mas a segurança vem primeiro. Converse com seu médico, obtenha a liberação para exercícios, e traga essa informação para [profissional_nome]. Com a liberação em mãos, vocês constroem juntos um programa seguro e eficaz para sua realidade."

---

## 7 · Métricas para o ALUNO (relatório)

### 7.1 · `score_funcional`

- **O que é:** Score de 0-5 baseado nas respostas de Q4 (capacidade funcional), representando capacidade funcional autorrelatada.
- **Por que aparece para o aluno:** É a métrica mais poderosa emocionalmente — o lead vê uma fotografia da sua autonomia atual e entende o que pode melhorar. Score 5/5 valida. Score 3/5 motiva sem alarmar.
- **Cálculo:** Contagem simples das atividades marcadas em `capacidade_funcional` (0-5 pontos). Classificação: 5 = Excelente, 4 = Boa, 3 = Moderada, 2 = Baixa, 0-1 = Atenção prioritária.
- **Visualização proposta:** Gauge radial com 5 faixas coloridas (vermelho → amarelo → verde). Valor central grande. Abaixo: "Capacidade Funcional: [classificação]".
- **Placeholder no copy:** `[score_funcional]`, `[classificacao_funcional]`

### 7.2 · `meta_proteina_g`

- **O que é:** Meta diária de proteína em gramas, calculada com fator ajustado para 60+ (1.2-1.5 g/kg vs 0.8g/kg padrão).
- **Por que aparece para o aluno:** Proteína é a recomendação nutricional mais acionável e impactante para prevenção de sarcopenia. "Coma X gramas de proteína" é concreto.
- **Cálculo:** Peso (kg) × fator proteico. Fator: 1.2 g/kg para sedentários (Q2 = nenhuma/1-2), 1.4 g/kg para ativos (Q2 = 3-4), 1.5 g/kg para muito ativos (Q2 = 5+). Referência: PROT-AGE Study Group (Bauer et al., 2013).
- **Visualização proposta:** Card numérico com valor grande ("120g/dia"), subtitle com equivalência prática ("≈ 4 porções de carne/ovo/laticínio").
- **Placeholder:** `[meta_proteina_g]`

### 7.3 · `meta_hidratacao_ml`

- **O que é:** Meta diária de água em ml, ajustada para 60+ (que têm sensação de sede reduzida fisiologicamente).
- **Por que aparece para o aluno:** Desidratação é subdiagnosticada em 60+ e afeta cognição, equilíbrio e força muscular. "Beba X ml" é ação imediata.
- **Cálculo:** 35 ml/kg de peso corporal (recomendação ESPEN para adultos 60+, mais conservadora que os 40 ml/kg para jovens). Arredondar para 50ml mais próximo.
- **Visualização proposta:** Card numérico com ícone de gota. Valor central + equivalência em copos ("≈ 8-10 copos").
- **Placeholder:** `[meta_hidratacao_ml]`

### 7.4 · `frequencia_recomendada`

- **O que é:** Frequência semanal recomendada de treino resistido, baseada no nível atual.
- **Por que aparece para o aluno:** É a resposta mais desejada — "quantas vezes por semana?" Gera ação imediata.
- **Cálculo:** Baseada em Q2 (frequência atual) + Q1 (fase): sedentário → 2x/semana; ativo leve → 3x/semana; ativo regular → 3-4x/semana; muito ativo → manter com periodização. Referência: ACSM Position Stand on Exercise for Older Adults.
- **Visualização proposta:** Card com número grande + calendário visual (ex: seg-qua-sex marcados).
- **Placeholder:** `[frequencia_recomendada]`

### 7.5 · `imc_interpretado`

- **O que é:** IMC calculado com interpretação ajustada para 60+ (faixas de referência são diferentes — IMC 25-27 é considerado protetor em idosos, diferente de jovens).
- **Por que aparece para o aluno:** IMC é universalmente reconhecido, mas a interpretação para 60+ é contra-intuitiva — "levemente acima do peso" é na verdade protetor. Surpreende e educa.
- **Cálculo:** Peso / Altura². Faixas geriátricas (Winter et al., 2014; Afonso et al., 2012): < 22 = Abaixo do peso (risco), 22-27 = Faixa ideal para 60+, 27-30 = Levemente acima (monitorar), > 30 = Acima do ideal. NÃO usar classificação OMS padrão — ela subestima risco de baixo peso e superestima risco de sobrepeso leve em idosos.
- **Visualização proposta:** Gauge horizontal com 4 faixas coloridas. Ponteiro indicando posição. Nota explicativa: "Para adultos 60+, as faixas de referência são diferentes de adultos jovens."
- **Placeholder:** `[imc_valor]`, `[imc_classificacao_60plus]`

### 7.6 · `timeline_adaptacao`

- **O que é:** Projeção de quando o lead sentirá os primeiros resultados funcionais (não estéticos).
- **Por que aparece para o aluno:** Gerencia expectativa e previne desistência precoce. "Em 4-6 semanas você sentirá diferença na escada" é mais poderoso que "em 3 meses você perde 5kg".
- **Cálculo:** Baseada em evidência fisiológica de adaptação neural e muscular em 60+: ganhos neurais (coordenação, força percebida) em 2-4 semanas; hipertrofia mensurável em 8-12 semanas (Fragala et al., 2019). Ajustar por Q2 (frequência): mais frequente → mais rápido.
- **Visualização proposta:** Timeline horizontal com marcos ("Semana 2-4: Mais disposição → Semana 6-8: Mais equilíbrio → Semana 10-12: Ganho de força visível"). Somente no branch "Quer começar". Omitida se safety trigger ativo.
- **Placeholder:** `[semanas_primeiro_resultado]`

---

## 8 · Métricas para o PROFISSIONAL (dashboard futuro)

### 8.1 · `risco_sarcopenia`

- **O que é:** Score de triagem inspirado no SARC-F (Cruz-Jentoft et al., 2019), baseado em Q4 (score funcional) + Q2 (frequência) + idade + sexo.
- **Por que importa para o PT:** Identifica leads que precisam de intervenção prioritária de preservação muscular. Sarcopenia é a "doença silenciosa" do envelhecimento e o principal alvo do treinamento resistido em 60+.
- **Cálculo:** Score composto: pontos por idade (60-69: 0, 70-79: 1, 80+: 2) + inversão do score funcional (5-score: 0-5 pontos) + sedentarismo (Q2=nenhuma: 2, Q2=1-2: 1, Q2≥3: 0). Total 0-9. Classificação: 0-2 = Baixo risco, 3-5 = Moderado, 6-9 = Alto risco.
- **Visualização proposta:** Semáforo (verde/amarelo/vermelho) com score numérico e classificação.

### 8.2 · `risco_queda`

- **O que é:** Classificação de risco de queda baseada em Q4 + Q6 (quedas recentes) + idade.
- **Por que importa para o PT:** Quedas em 60+ são a principal causa de lesão grave e perda de independência. O PT precisa saber se o lead é alto risco para priorizar equilíbrio e propriocepção no programa.
- **Cálculo:** Fatores de risco: Q6=quedas_recentes (+3), Q4 score ≤ 2 (+2), Q2=nenhuma (+1), idade ≥ 75 (+1), Q6=polimedicacao (+1). Total 0-8. Classificação: 0-1 = Baixo, 2-4 = Moderado, 5+ = Alto.
- **Visualização proposta:** Scorecard com semáforo + lista de fatores de risco identificados (checklist visual).

### 8.3 · `flag_polimedicacao`

- **O que é:** Flag binária (sim/não) + número estimado de medicamentos (5+).
- **Por que importa para o PT:** Polimedicação afeta equilíbrio (beta-bloqueadores, anti-hipertensivos, benzodiazepínicos), resposta ao exercício (beta-bloqueadores limitam FC), e risco de hipoglicemia (insulina). PT precisa saber para ajustar monitoramento.
- **Cálculo:** Q6 = polimedicacao marcado.
- **Visualização proposta:** Badge/tag colorido ("Polimedicação: Sim/Não"). Se sim, nota: "Solicitar lista de medicamentos na primeira consulta."

### 8.4 · `perfil_funcional_detalhado`

- **O que é:** Breakdown do score funcional por domínio (MMII, MMSS, cardio, mobilidade, equilíbrio) baseado nos 5 itens de Q4.
- **Por que importa para o PT:** Não basta saber o score total — o PT precisa saber ONDE está o déficit. Se o lead marca tudo exceto "agachar", o déficit é mobilidade de quadril/tornozelo. Se não marca "escada" nem "levantar cadeira", o déficit é força de MMII.
- **Cálculo:** Cada item de Q4 mapeia para um domínio: escada → MMII+cardio, levantar_cadeira → MMII+core, carregar_peso → MMSS+preensão, caminhar_15min → cardio, agachar → mobilidade+equilíbrio.
- **Visualização proposta:** Radar de 5 eixos (MMII, MMSS, Cardio, Mobilidade, Core) com preenchimento. Gaps visualmente óbvios.

### 8.5 · `classificacao_imc_geriatrico`

- **O que é:** IMC com classificação geriátrica específica (faixas diferentes de adultos jovens).
- **Por que importa para o PT:** O PT precisa saber que IMC 25 em 60+ NÃO é "sobrepeso preocupante" — é faixa ideal. E IMC < 22 em 60+ é sinal de alerta (perda muscular/desnutrição).
- **Cálculo:** Mesmo cálculo da métrica de aluno (7.5), com faixas clínicas detalhadas: < 20 = Desnutrição provável, 20-22 = Risco de desnutrição, 22-27 = Eutrofia, 27-30 = Sobrepeso leve, 30-35 = Obesidade grau I, > 35 = Obesidade grau II+.
- **Visualização proposta:** Tabela de classificação com highlight na faixa do lead. Nota sobre diferença das faixas vs adultos jovens.

### 8.6 · `comorbidades_count`

- **O que é:** Contagem total de condições marcadas em Q6 (excluindo "nenhuma").
- **Por que importa para o PT:** Multimorbidade (2+) requer abordagem multidisciplinar. O PT precisa dimensionar a complexidade do caso na triagem.
- **Cálculo:** Count de opções marcadas em Q6, excluindo `nenhuma`.
- **Visualização proposta:** Badge numérico. 0 = verde, 1-2 = amarelo, 3+ = vermelho. Lista expandível com as condições marcadas.

---

## 9 · Pilares do relatório

### Pilar 1 · Força e Autonomia

- **Subtitle:** "Músculos que preservam sua independência"
- **Conceito central:** Treinamento resistido é a intervenção mais eficaz para prevenir e reverter a perda muscular relacionada à idade. Cada sessão de treino preserva a capacidade de fazer o que você quer, quando quer, sem depender de ninguém.
- **Evidência científica:** Fragala et al. (NSCA 2019): ganhos de força de 25-100% em idosos após 8-12 semanas. Izquierdo et al. (ICFSR 2021): treino resistido 2-3x/semana como recomendação primária.
- **Placeholders esperados:** `[frequencia_recomendada]`, `[score_funcional]`, `[classificacao_funcional]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):**
  "Seus músculos são seu maior patrimônio nessa fase da vida. A cada década após os 30, perdemos naturalmente de 3 a 8% da massa muscular — e essa perda acelera após os 60. Mas o treino de força reverte esse processo em qualquer idade. Com [frequencia_recomendada] sessões por semana, sua capacidade funcional (hoje em [classificacao_funcional]) vai melhorar progressivamente. O primeiro passo é conversar com [profissional_nome] para montar seu programa."
- **Exemplo de texto técnico (30-40 palavras):**
  "Treino resistido progressivo 2-3×/sem reverte sarcopenia e melhora SPPB em idosos comunitários. Ganhos neurais ocorrem em 2-4 semanas; hipertrofia mensurável em 8-12 semanas (Fragala et al., 2019). Priorizar exercícios multiarticulares."

### Pilar 2 · Nutrição para Vitalidade

- **Subtitle:** "Combustível certo para músculos que respondem"
- **Conceito central:** Após os 60, a necessidade de proteína é MAIOR que em adultos jovens (1.2-1.5 g/kg vs 0.8 g/kg). A maioria dos 60+ brasileiros consome proteína insuficiente. Hidratação adequada é igualmente crítica pela redução fisiológica da sensação de sede.
- **Evidência científica:** Bauer et al. (PROT-AGE 2013): 1.2-1.5 g/kg/dia para preservação muscular em 60+. ESPEN Guidelines para hidratação em idosos.
- **Placeholders esperados:** `[meta_proteina_g]`, `[meta_hidratacao_ml]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):**
  "Seu corpo precisa de mais proteína agora do que quando era jovem — não menos. A meta de [meta_proteina_g] gramas por dia garante que seus músculos tenham material para se reconstruir após o treino. Na prática, isso significa incluir uma fonte de proteína em cada refeição principal. E atenção especial à água: sua meta é [meta_hidratacao_ml] ml por dia. Converse com [profissional_nome] sobre como encaixar isso na sua rotina."
- **Exemplo de texto técnico (30-40 palavras):**
  "Ingestão proteica ≥ 1.2 g/kg/dia com distribuição equilibrada entre refeições (25-30g/refeição) maximiza síntese proteica muscular em idosos. Leucina como aminoácido-chave. Hidratação: 35 ml/kg/dia (ESPEN)."

### Pilar 3 · Equilíbrio e Prevenção

- **Subtitle:** "Segurança que liberta"
- **Conceito central:** Treino de equilíbrio e prevenção de quedas é tão importante quanto treino de força para 60+. A combinação de força + equilíbrio reduz risco de queda em até 40%. Cada sessão de treino é também uma sessão de proteção.
- **Evidência científica:** Sherrington et al. (Cochrane Review 2019): exercício de equilíbrio reduz taxa de quedas em 23%; combinado com força, reduz 34-40%. Granacher et al. (2013): treino multicomponente (força + equilíbrio + coordenação).
- **Placeholders esperados:** `[score_funcional]`, `[classificacao_funcional]`, `[local_treino]`, `[profissional_nome]`
- **Exemplo de texto popular (60-80 palavras):**
  "Quedas não são "parte do envelhecimento" — são preveníveis. Treinos que combinam força, equilíbrio e coordenação reduzem o risco de queda em até 40%. No seu caso, com capacidade funcional [classificacao_funcional], o programa no(a) [local_treino] vai incluir exercícios específicos de equilíbrio em cada sessão — não como atividade separada, mas integrados naturalmente ao treino de força. [profissional_nome] sabe exatamente como fazer isso."
- **Exemplo de texto técnico (30-40 palavras):**
  "Treino multicomponente (resistido + equilíbrio + coordenação) 2-3×/sem reduz taxa de quedas em 34-40% em idosos comunitários (Sherrington et al., 2019). Incluir exercícios proprioceptivos progressivos em cada sessão."

---

## 10 · AI Context (instruções para a IA que vai gerar o relatório)

- **specialtyDescription:** "Template para adultos 60+ que buscam iniciar, retomar ou otimizar treinamento resistido (musculação) para preservação de autonomia funcional, prevenção de sarcopenia e quedas, e qualidade de vida. O público varia de sedentários a ativos regulares, com prevalência de condições crônicas controladas."

- **narrativeArc:**
  1. Validação: reconhecer a coragem/inteligência de buscar acompanhamento especializado para 60+
  2. Diagnóstico acolhedor: apresentar score funcional e IMC geriátrico como fotografia do ponto de partida (sem julgamento)
  3. Desmistificação: desconstruir a barreira principal identificada (Q3) com evidência científica
  4. Prescrição macro: apresentar frequência recomendada, meta proteica, meta hídrica como ações concretas
  5. Pilares: aprofundar cada pilar com copy personalizado por branch
  6. Timeline: projetar resultados funcionais esperados (quando não há safety trigger)
  7. Ponte: direcionar ao profissional como o parceiro necessário para implementar com segurança

- **terminology:** ["qualidade de vida", "autonomia", "independência", "disposição", "vitalidade", "força funcional", "equilíbrio", "prevenção de quedas", "saúde óssea", "massa muscular", "musculação", "treino de força", "resistido"]

- **forbiddenTerms:**
  - "idoso" — conotação pejorativa para muitos; usar "adulto 60+" ou "essa fase da vida"
  - "terceira idade" — datado, pode soar patronizante
  - "melhor idade" — eufemismo que irrita parte do público
  - "vovô/vovó" — infantilização
  - "apesar da sua idade" — implica que idade é defeito
  - "para a sua idade" — relativiza conquista ("está bem para a sua idade" = "não está bem de verdade")
  - "cuidado" como tom geral — tratar com respeito, não com pena
  - "anti-aging" — pseudociência, promessa vazia
  - "voltar a ser jovem" — impossível, desonesto
  - "sarcopenia" em texto para aluno — jargão médico; usar "perda muscular natural"
  - "frágil/fragilidade" — termos que o público rejeita

- **recommendedTone:** "Respeitoso, direto e embasado. Tratar o lead como adulto inteligente que tomou uma decisão sensata. Validar sem bajular. Informar sem alarmar. Cada parágrafo deve ter pelo menos um dado concreto (número, referência, fato verificável) — nunca só motivação vazia."

- **pillarGuidance:**
  1. "Força e Autonomia: conectar cada recomendação de treino a uma atividade funcional do dia a dia. Não falar em 'ganhar bíceps' — falar em 'carregar compras sem esforço'. Citar frequência recomendada e score funcional como âncoras."
  2. "Nutrição para Vitalidade: enfatizar que a necessidade proteica é MAIOR após os 60 (contraintuitivo para muitos). Dar metas numéricas concretas (gramas/dia, copos de água). Evitar lista de alimentos específicos (isso é tarefa do nutricionista)."
  3. "Equilíbrio e Prevenção: normalizar treino de equilíbrio como parte do treino de força (não atividade separada 'para quem tem problema'). Citar redução de risco de queda com evidência. Adaptar por local de treino."

---

## 11 · Configuração de cálculos

- **activityLevelDefault:** `lightly_active` — a maioria dos leads 60+ que chegam via Instagram são sedentários ou levemente ativos. Caminham mas não fazem exercício estruturado. Default lightly_active é mais realista que sedentary (que subestima atividades cotidianas de quem é funcional).

- **activityMapping:** Q2 (`frequencia_semanal`) mapeia para activity_level:
  | Resposta Q2 | activity_level |
  |-------------|---------------|
  | `nenhuma` | `sedentary` |
  | `uma_duas` | `lightly_active` |
  | `tres_quatro` | `moderately_active` |
  | `cinco_mais` | `very_active` |

- **requiresTargetWeight:** `false` — para 60+, o objetivo raramente é um peso-alvo. É funcional. O bloco universal de `goal` com `targetWeightKg` não faz sentido aqui; o campo `goal text` basta para capturar o objetivo em palavras.

---

## 12 · Notas de design (decisões não-óbvias)

### Por que "60+ Ativo" e não "Terceira Idade"

"Terceira idade" é funcional mas cada vez mais rejeitado pelo público. Em grupos de WhatsApp, turmas de ginástica e perfis de Instagram, o público se auto-identifica como "60+", "melhor fase" ou simplesmente pela atividade que faz ("turma de musculação da manhã"). "60+ Ativo" é factual (faixa etária) + aspiracional (ativo). Mantém clareza no hub sem ser patronizante. O slug da pasta pode ser renomeado para `06-ativo_60plus`.

### Por que `capacidade_funcional` é multiple_choice e não escala/slider

Escala subjetiva ("de 0 a 10, quão funcional você é?") é inútil — 60+ tende a subestimar ou superestimar. Checklist de atividades concretas é objetivável: ou sobe escada sem segurar ou não sobe. A soma gera score sem que o lead perceba que está sendo "testado". É menos invasivo e mais preciso.

### Por que NÃO incluí pergunta sobre sono

Sono é relevante para 60+ (insônia é prevalente), mas: (a) não muda a prescrição de treino resistido significativamente, (b) é difícil de responder em 5 segundos ("como é seu sono?" é subjetivo), (c) engordaria o template sem retorno proporcional no relatório. O PT pode perguntar presencialmente.

### Por que NÃO incluí pergunta sobre medicamentos específicos

Pergunta sobre medicamentos específicos (lista de nomes) seria ideal para o PT, mas é invasiva demais para formulário de lead capture público e difícil de preencher no celular. A flag de `polimedicacao` (5+) captura o sinal mais importante. O PT solicita a lista completa na primeira consulta.

### Por que `quedas_recentes` NÃO é safety trigger

A maioria dos idosos que caem uma vez não precisa de liberação médica antes de exercício — o exercício É a intervenção para prevenir a próxima queda. Safety trigger bloquearia o relatório para um público que mais precisa dele. A informação vai para o PT via dashboard (risco_queda), que decide se precisa de avaliação médica caso a caso.

### Por que apenas 2 safety triggers (e não 4-5)

Na primeira versão desta pesquisa considerei incluir diabetes, osteoporose e polimedicação como safety triggers. Descartei porque: todas essas condições são comuns, controladas e NÃO contraindicam exercício — apenas modificam prescrição. Se 70% dos 60+ tem pelo menos uma condição crônica e cada uma fosse safety, quase todo lead receberia relatório bloqueado. Isso destruiria a conversão. Apenas condições que requerem LIBERAÇÃO MÉDICA PRÉVIA são safety.

### Por que `requiresTargetWeight: false`

O bloco universal oferece `goal` com `targetWeightKg`. Para 60+, pedir "peso desejado" é no mínimo irrelevante e potencialmente danoso (idosos com IMC baixo são de risco — e pedir peso-alvo pode reforçar busca por emagrecimento inadequada). O campo `goal text` ("qual seu principal objetivo?") captura a intenção de forma aberta.

### Por que faixas de IMC diferentes do padrão OMS

A classificação OMS (IMC < 18.5 baixo peso, 18.5-24.9 normal, 25-29.9 sobrepeso) foi desenvolvida para adultos jovens. Meta-análises em 60+ (Winter et al., BMJ 2014; Afonso et al., 2012) mostram que: (a) IMC 25-27 é PROTETOR em idosos (paradoxo da obesidade), (b) IMC < 22 é fator de risco independente para mortalidade. Usar faixas OMS padrão diagnosticaria como "sobrepeso" muitos idosos que estão na faixa ideal. Isso desinforma o lead e desacredita o relatório.

---

## 13 · Pendências

### Perguntas incertas

- **Q4 (capacidade funcional):** precisa validar se as 5 atividades selecionadas cobrem os domínios relevantes com geriatra/gerontologista. Possível adição: "Vestir-se sozinho(a)" (AVD básica) — descartada agora por ser potencialmente constrangedora para o público funcional deste template.

### Cálculos cuja lib ainda não foi identificada

- **Score de sarcopenia:** o SARC-F original usa 5 perguntas específicas — adaptei para os dados disponíveis, mas o score proposto NÃO é o SARC-F validado. É uma aproximação. Precisamos decidir se criamos um score próprio ou adaptamos uma ferramenta validada.
- **IMC geriátrico:** faixas baseadas em meta-análises, mas não há consenso único. As faixas propostas (22-27 eutrofia) são as mais citadas na literatura brasileira de gerontologia, mas ABESO e OMS discordam. Decisão de quais faixas usar é clínica.

### Decisões que dependem de validação profissional

- **🚨 BLOQUEANTE:** Todo o template precisa de revisão por geriatra e/ou educador físico com CREF e especialização em gerontologia ANTES de ir para produção. Pontos críticos para revisão:
  1. Adequação dos safety triggers (são suficientes? São demais?)
  2. Faixas de IMC geriátrico (qual conjunto adotar?)
  3. Itens da triagem funcional (Q4) — são representativos?
  4. Fator proteico para 60+ (1.2-1.5 g/kg — consenso real ou varia por contexto?)
  5. Terminologia — "60+ Ativo" é aceito profissionalmente?

### Casos de borda que o template não cobre

- **Idosos frágeis (escala Fried ≥ 3):** precisa de template ou fluxo separado, possivelmente com cuidador preenchendo
- **Atletas master (60+ competitivos):** pequeno volume, mas existem. Poderiam ser branch ou template separado em fase futura
- **Cadeirantes/mobilidade reduzida severa:** requer abordagem presencial especializada, fora do escopo de lead capture digital
- **Comorbidades psiquiátricas (depressão severa, demência inicial):** afetam formulário e adesão, mas são sensíveis demais para triagem via Instagram

---

## 14 · Fontes citadas

1. **ACSM** — _ACSM's Guidelines for Exercise Testing and Prescription_, 11th ed. Philadelphia: Wolters Kluwer, 2022.
2. **Fragala, M.S. et al.** — "Resistance Training for Older Adults: Position Statement from the National Strength and Conditioning Association." _Journal of Strength and Conditioning Research_, 33(8), 2019.
3. **Izquierdo, M. et al.** — "International Exercise Recommendations in Older Adults (ICFSR): Expert Consensus Guidelines." _Journal of Nutrition, Health & Aging_, 25(7), 2021.
4. **Bauer, J. et al.** — "Evidence-Based Recommendations for Optimal Dietary Protein Intake in Older People: A Position Paper from the PROT-AGE Study Group." _Journal of the American Medical Directors Association_, 14(8), 2013.
5. **Sherrington, C. et al.** — "Exercise for preventing falls in older people living in the community." _Cochrane Database of Systematic Reviews_, (1), 2019.
6. **Cruz-Jentoft, A.J. et al.** — "Sarcopenia: revised European consensus on definition and diagnosis (EWGSOP2)." _Age and Ageing_, 48(1), 2019.
7. **Winter, J.E. et al.** — "BMI and all-cause mortality in older adults: a meta-analysis." _The American Journal of Clinical Nutrition_, 99(4), 2014.
8. **Leong, D.P. et al.** — "Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study." _The Lancet_, 386(9990), 2015.
9. **Granacher, U. et al.** — "Effects of resistance training in youth athletes on muscular fitness and athletic performance." _Frontiers in Physiology_, 4, 2013. _(Note: used for multicomponent training principles applied to older adults)_
10. **IBGE** — Censo Demográfico 2022: Tábuas de mortalidade e projeções populacionais. Brasília, 2023.
11. **SBGG** — Sociedade Brasileira de Geriatria e Gerontologia. Diretrizes de atividade física para o idoso, 2020.
12. **Ministério da Saúde** — VIGITEL Brasil 2023: Vigilância de fatores de risco e proteção para doenças crônicas. Brasília, 2024.

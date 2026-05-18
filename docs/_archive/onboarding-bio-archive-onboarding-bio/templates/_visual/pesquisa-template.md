# mapa-mestre-v2.md

## Sistema de Templates de Onboarding — onboarding.bio

> **Status:** Proposta arquitetural expandida (v2)
> **Escopo:** Referência mestre para os próximos 6–12 meses de desenvolvimento de templates adaptativos para profissionais de educação física CREF e treinadores esportivos no mercado brasileiro.
> **Stack-alvo:** TypeScript + Supabase (schema JSONB).
> **Filosofia:** Cada motor existe para mudar algo _substancial_ na saída (estrutura, métrica, pilar narrativo, tom ou nível de risco). Branches existem para capturar variância real, não para gerar ilusão de personalização.

---

## 0. Sumário Executivo — O que mudou vs. v1

**v1 (estado atual):**

- 8 motores de decisão (Contexto, Gargalo, Nível/Maturidade, Comportamento, Ambiente/Disponibilidade, Identidade/Fase, Métricas/Ferramentas, Liberação/Risco).
- 33 templates em 7 modalidades (Musculação, Corrida, Ciclismo, CrossFit, Natação, Triathlon + variantes de Reabilitação).
- Branches majoritariamente de 1–2 níveis.

**v2 (este documento) introduz:**

| Mudança                                                                                                                                                                                                     | Justificativa                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **+8 motores propostos** (Saúde/Triagem PAR-Q+, Carga & Recuperação, Nutrição, Psicológico/Estágio de Mudança, Social/Suporte, Histórico Esportivo, Tecnologia/Wearables, Ciclos Biológicos & Sazonalidade) | Cobre lacunas críticas de evidência (medicina esportiva, fisiologia, psicologia do exercício) e padrões de apps top de mercado.                                                                              |
| **Profundidade média de branches: 3–5 níveis**                                                                                                                                                              | Apps líderes (Future, Whoop, MacroFactor, TrainerRoad) demonstram que profundidade vale a pena _quando cada nível altera saída_.                                                                             |
| **Princípios formais de quando criar/não criar branch**                                                                                                                                                     | Anti-padrão recorrente em v1: branches que só mudam copy. v2 institui regra do "valor incremental obrigatório".                                                                                              |
| **Heurística de fadiga (UX)**                                                                                                                                                                               | Benchmark: 6 perguntas com >55% de completude (Typeform); cair para <40% acima de 12 perguntas/12 min. v2 prevê _progressive disclosure_ + _one-question-at-a-time_ condicional + checkpoints de salvamento. |
| **Resolução de conflitos entre motores**                                                                                                                                                                    | Regras explícitas (ex.: Histórico domina Nível em "atleta retornando"; Saúde/Triagem domina tudo se PAR-Q+ ≥1 sim).                                                                                          |
| **+6 modalidades opcionais** com justificativa de mercado brasileiro (Lutas, Calistenia, Yoga/Pilates, Esportes Coletivos amadores, Powerlifting, Escalada).                                                |
| **Bibliografia consolidada** dos frameworks.                                                                                                                                                                |

**Resumo:** v1 era um sistema de _árvore rasa por modalidade_. v2 é uma _grade ortogonal_ (motores × modalidades) com profundidade onde há ganho real, e largura onde há diferenciação de mercado.

---

## 1. Lista Expandida de Motores (16 totais)

### 1.1 Os 8 motores originais (mantidos, com leves refinamentos)

| #   | Motor                          | Função no relatório IA                                                                                               |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| M1  | **Contexto**                   | Por que está aqui agora? Gatilho, urgência, deadline, evento. Define tom e escopo.                                   |
| M2  | **Gargalo**                    | Onde dói mais? Define qual pilar do relatório recebe mais profundidade.                                              |
| M3  | **Nível / Maturidade**         | Iniciante / intermediário / avançado / atleta. Define vocabulário, métricas mostradas, complexidade.                 |
| M4  | **Comportamento**              | Adesão histórica, consistência, padrão de quebra. Calibra agressividade da prescrição.                               |
| M5  | **Ambiente / Disponibilidade** | Casa/academia, equipamentos, tempo/semana, deslocamento. Filtra estrutura física do plano.                           |
| M6  | **Identidade / Fase de vida**  | Mãe pós-parto, executivo, estudante, aposentado, atleta master. Calibra narrativa e prioridades.                     |
| M7  | **Métricas / Ferramentas**     | Frequencímetro, potenciômetro, balança bioimpedância, fita métrica, nada. Define o que pode ser medido vs. estimado. |
| M8  | **Liberação / Risco**          | Triagem médica básica. **Mantido como gate de segurança absoluto.**                                                  |

### 1.2 Os 8 motores novos propostos

#### **M9 — Saúde & Triagem Pré-Participação (PAR-Q+ / ACSM)**

**Por que existe:** O PAR-Q+ 2024 (versão validada em português brasileiro por Schwartz et al., 2021, n=493) é o padrão internacional para triagem antes de exercício. O algoritmo da ACSM 10ª ed. usa três entradas (atividade atual, doença CV/metabólica/renal conhecida ou sintomas, intensidade desejada) para decidir referência médica. M8 (Liberação/Risco) cobre o _gate_ binário, mas não a estratificação clínica fina.

**Diferença vs. M8:** M8 é "preciso liberar?". M9 é "que classe de risco e que adaptações específicas?" (hipertensão controlada → evitar Valsalva; diabetes tipo 1 → ajustar carga em jejum; gestante → contraindicações trimestrais).

**Saídas que controla:** classe de risco (verde/amarelo/vermelho), banner clínico no relatório, lista de contraindicações específicas, recomendação de encaminhamento médico.

**Branches sugeridos (3 níveis):**

1. PAR-Q+ 7 perguntas → 0 sim / 1+ sim
2. Se 1+ sim → seção do follow-up correspondente (cardiovascular, metabólica, neurológica, musculoesquelética, gestação, oncológica)
3. Cada follow-up → controle/intensidade desejada → liberação condicional ou bloqueio

---

#### **M10 — Carga, Recuperação & Prontidão (ACWR + sRPE + Readiness)**

**Por que existe:** Acute:Chronic Workload Ratio (ACWR; Gabbett et al.) tem zona de menor risco entre **0.80 e 1.30**; sRPE (Foster, 1995) é o método mais validado de quantificação interna de carga; readiness scores combinando HRV + sono + dor muscular + humor + estresse (Hooper Index, ARMS) preveem fatiga e risco. Nenhum dos motores v1 captura _carga acumulada_ ou _prontidão diária_.

**Saídas que controla:** dose-resposta inicial, taper sugerido, alertas de overreaching, decisão entre manutenção/progressão/deload, narrativa sobre recuperação.

**Branches (3+ níveis):**

1. Já mensura carga? → Sim/Não
2. Se Sim → método (RPE, distância/volume, TSS, Whoop, watch)
3. Se RPE → conhece sRPE? → escala usada (CR10 vs RPE 6–20)
4. Histórico de overtraining/lesão por carga → flag para iniciar com ACWR alvo 0.8 e progressão lenta
5. Sono médio (h) + qualidade subjetiva 1–5 + dor muscular hoje + humor → readiness baseline

---

#### **M11 — Nutrição & Energia Disponível**

**Por que existe:** Fitness e performance dependem de balanço energético (TDEE), distribuição de macros, timing peri-treino, hidratação e — em atletas — energia disponível (LEA / RED-S, IOC CAT2 2023). Nenhum dos 8 motores originais toca em nutrição, mas todo PT brasileiro CREF orienta no mínimo a parte comportamental (timing, hidratação, suplementação básica). MacroFactor mostra que algoritmos adaptativos baseados em ingestão real + tendência de peso superam metas estáticas.

**Limites éticos/legais:** o CREF não permite prescrição de dieta (privativa do nutricionista). M11 só captura _contexto_ nutricional para calibrar o relatório (ex.: "você está em déficit há 12 semanas, expectativa de PR é irrealista") e _pontes_ para encaminhamento.

**Branches (4 níveis):**

1. Fase nutricional autorrelatada → Cutting / Bulking / Manutenção / Recomp / Não controla
2. Se Cutting/Bulking → tempo nessa fase (semanas) → magnitude (déficit/superávit estimado %)
3. Restrição alimentar → vegetariano / vegano / sem lactose / sem glúten / religiosa / nenhuma
4. Suplementação atual → whey / creatina / cafeína / pré-treino / nada / outros (texto)
5. Se atleta endurance + feminino → flag LEAF-Q (3 perguntas-chave: amenorreia, fratura por estresse, restrição intencional) → encaminhamento RED-S CAT2

---

#### **M12 — Psicológico & Estágio de Mudança**

**Por que existe:** O modelo Transteórico (Prochaska & DiClemente; validado em exercício por décadas) define 5 estágios — Pré-contemplação, Contemplação, Preparação, Ação, Manutenção (+ Recaída). A intervenção _correta_ depende do estágio: dar plano detalhado para alguém em pré-contemplação queima ponte. BREQ-3 (validado em PT-BR para 50+, MDPI 2024) operacionaliza Self-Determination Theory: amotivação → externa → introjetada → identificada → integrada → intrínseca. Apps top (Headspace, Calm, Future) abrem com pergunta de motivação intrínseca para calibrar tom.

**Saídas que controla:** tom do relatório (motivacional vs técnico vs desafiador), densidade de "porquês" vs "comos", uso de gamificação, frequência sugerida de check-ins.

**Branches (3 níveis):**

1. "Onde você está?" → 5 opções mapeadas para estágios TTM (precontempla → "ainda não tenho certeza se quero" / mantém há 6+ meses → "já é parte de mim")
2. Se Ação/Manutenção + reincidente → trigger de relapse coping (relapse é regra, não exceção; já planeja janelas de risco)
3. BREQ-3 mini (4 perguntas: identificada / introjetada / externa / intrínseca dominante) → calibra narrativa
4. Autoeficácia (1 pergunta tipo "se você quisesse muito, conseguiria treinar 4×/semana neste mês?" 1–10) → ajusta agressividade

---

#### **M13 — Social & Suporte**

**Por que existe:** Suporte familiar, parceiro de treino e ambiente social são preditores robustos de adesão (literatura clássica de Bandura sobre eficácia coletiva; spillover effect, PMC 2022). Em mercado brasileiro, treino em grupo (corrida de rua, CrossFit box, jiu-jitsu) é cultura forte — dado do Panorama Setorial Fitness Brasil 2025 (corrida 28%, musculação 26%) sugere migração para experiências sociais ao ar livre.

**Saídas que controla:** sugestão de formato (solo, parceria, grupo, comunidade), gestão de expectativa quando suporte é negativo, sugestão de mecanismos de accountability.

**Branches (3 níveis):**

1. Companhia de treino atual → sozinho / parceiro fixo / grupo / coach / aulas
2. Suporte do círculo próximo → ativo / neutro / contrário (ex.: parceiro reclama do tempo de treino)
3. Disponibilidade para participar de comunidade online → sim/não → modalidade preferida (Strava, WhatsApp, presencial)

---

#### **M14 — Histórico Esportivo & Lesões**

**Por que existe:** Lesão prévia é o preditor #1 de lesão futura (literatura unânime; van der Horst et al. 2016 sobre hamstring re-injury 38% em 6 meses). Atleta retornando após gravidez, longa pausa, cirurgia ou lesão crônica é um perfil que **conflita com M3 (Nível)** se tratado isoladamente. Future, TrueCoach e plataformas clínicas tratam histórico como motor próprio com peso superior em conflitos.

**Saídas que controla:** override sobre Nível (atleta retornando ≠ iniciante); fase de reabilitação ativa; restrições de movimento; cronograma realista de retorno.

**Branches (4 níveis):**

1. Lesão nos últimos 12 meses? → Sim/Não
2. Se Sim → região anatômica (multi-select) → fase atual (aguda < 2sem / subaguda 2–6sem / crônica >6sem / em rehab supervisionado / liberado clinicamente)
3. Se liberado → critérios de RTP atendidos? (≥90% força contralateral, hop tests, sem dor em atividade intensa, ACL-RSI ≥56 quando aplicável) → libera carga progressiva ou mantém em fase de transição
4. Histórico de adesão prévia: maior streak já feito, motivo da última quebra → calibra plano "anti-quebra"

---

#### **M15 — Tecnologia & Familiaridade Digital**

**Por que existe:** A penetração de wearables em adultos brasileiros está em torno de 36–44% (CNN Brasil 2024 / ACSM Worldwide Trends). O relatório IA precisa saber se pode pedir leitura de FTP do Wahoo, HRV do Whoop, glicose contínua, OU se precisa cair em métricas estimadas. Whoop e TrainerRoad mostram que onboardings que assumem dados ricos quebram com usuários "low-data".

**Saídas que controla:** se relatório usa dados objetivos vs. estimativas; se sugere protocolos de auto-teste (Ramp test, CSS test); densidade de gráficos.

**Branches (3 níveis):**

1. Wearable principal → Garmin / Apple Watch / Polar / Whoop / Coros / Wahoo / Smart band genérica / Nenhum
2. App de tracking primário → Strava / Training Peaks / TrainerRoad / Garmin Connect / Apple Fitness / planilha / nada
3. Métrica disponível mais avançada → Potência (W) / Pace + HR / só HR / só pace / só percepção
4. Disposição para auto-testar (FTP test 20', CSS test 400+200m, AMRAP) → sim com supervisão / sim sozinho / não

---

#### **M16 — Ciclos Biológicos & Sazonalidade**

**Por que existe:** Ciclo menstrual influencia treino (literatura crescente: Kissow et al. 2025 sobre SIT em fase folicular vs lútea; ACSM e BJSM com cada vez mais evidência). Sazonalidade brasileira tem impacto real (calor extremo em janeiro afeta hidratação e zonas de FC; chuva em SP/RJ afeta corrida de rua; "operação verão" muda objetivo). Apps femininos como Whoop Women's Hormonal Insights e Oura mostram que usuários respondem a essa personalização.

**Saídas que controla:** ajustes finos de carga em fases específicas, narrativa de expectativa (PR realista no inverno do hemisfério sul vs. no verão), recomendações sazonais (treino indoor em chuva, hidratação no verão).

**Branches (3 níveis):**

1. Sexo biológico → masculino / feminino / não-binário (sem ajustes de ciclo se não-aplicável)
2. Se feminino + idade fértil + sem contraceptivo hormonal → quer integrar ciclo? → registra fase atual / ciclo médio (dias) / sintomas dominantes
3. Localização (estado/cidade) → estação atual + perfil climático → ajustes (calor extremo, frio do Sul, altitude do RJ vs. nível do mar)

### 1.3 Resumo dos motores (resposta rápida ao founder)

| #       | Motor                                          | Origem      | Categoria               |
| ------- | ---------------------------------------------- | ----------- | ----------------------- |
| M1      | Contexto                                       | v1          | Estratégico             |
| M2      | Gargalo                                        | v1          | Estratégico             |
| M3      | Nível/Maturidade                               | v1          | Calibração              |
| M4      | Comportamento                                  | v1          | Calibração              |
| M5      | Ambiente                                       | v1          | Operacional             |
| M6      | Identidade/Fase                                | v1          | Narrativo               |
| M7      | Métricas/Ferramentas                           | v1          | Operacional             |
| M8      | Liberação/Risco                                | v1          | **Segurança (gate)**    |
| **M9**  | **Saúde & Triagem PAR-Q+/ACSM**                | **v2 novo** | **Segurança (clínico)** |
| **M10** | **Carga & Prontidão (ACWR/sRPE/Readiness)**    | **v2 novo** | **Calibração**          |
| **M11** | **Nutrição & Energia Disponível**              | **v2 novo** | **Pilar adicional**     |
| **M12** | **Psicológico & Estágio de Mudança (TTM/SDT)** | **v2 novo** | **Narrativo**           |
| **M13** | **Social & Suporte**                           | **v2 novo** | **Adesão**              |
| **M14** | **Histórico Esportivo & Lesões**               | **v2 novo** | **Override de Nível**   |
| **M15** | **Tecnologia & Familiaridade Digital**         | **v2 novo** | **Operacional**         |
| **M16** | **Ciclos Biológicos & Sazonalidade**           | **v2 novo** | **Calibração fina**     |

---

## 2. Princípios de Branches

### 2.1 Quando criar um branch (regras de ouro)

Um branch só se justifica se passar **pelo menos 2 dos 5 testes**:

1. **Teste da Estrutura:** muda a arquitetura do plano (séries/reps, zonas, periodização, modalidade dominante).
2. **Teste da Métrica:** muda _qual_ métrica é central no relatório (FTP vs. HR vs. RPE).
3. **Teste do Pilar:** muda quais pilares (Treino, Nutrição, Recuperação, Mental) recebem profundidade.
4. **Teste da Narrativa:** muda o "porquê" central (performance vs. estética vs. saúde vs. competição).
5. **Teste do Tom:** muda significativamente a linguagem (técnica densa vs. didática simples vs. motivacional).

### 2.2 Quando NÃO criar um branch (anti-padrões a recusar)

| Anti-padrão                           | Sintoma                                                           | Correção                                                           |
| ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Branch-só-pra-mudar-copy**          | Duas branches geram o mesmo plano com 3 palavras diferentes.      | Unificar branches; tratar variação no template via tags/variáveis. |
| **Branch-de-vaidade**                 | Branch existe pra "parecer personalizado" sem mudar saída.        | Remover ou consolidar.                                             |
| **Branch-órfã**                       | Branch só atinge <2% dos usuários e tem custo alto de manutenção. | Mesclar com vizinha mais próxima.                                  |
| **Branch-redundante-com-outro-motor** | Mesma decisão capturada por 2 motores diferentes.                 | Designar dono único; outros motores leem o resultado.              |
| **Branch-que-pede-dado-que-não-uso**  | Pergunta-se algo, mas o relatório nunca usa.                      | Se não usa, não pergunta.                                          |
| **Branch-que-quebra-em-mobile**       | Mais de 5 sub-opções num radio em telas pequenas.                 | Agrupar em macro-categorias com refinamento progressivo.           |

### 2.3 Profundidade saudável (heurística baseada em UX research)

Evidência consolidada (Typeform/SurveyMonkey/InMoment/Lensym/NN/g):

- **Completude cai significativamente após 6 perguntas** (InMoment: 74% dos usuários só topam até 5 perguntas).
- **Surveys >12 minutos têm 3× mais drop-off** que <5 minutos (SurveySparrow).
- **One-question-at-a-time (Typeform) eleva completude para ~40–55%** vs. ~20% em forms tradicionais.
- **Progressive disclosure** (Nielsen Norman) é o padrão para reduzir cognitive load em fluxos complexos.

**Heurística onboarding.bio:**

| Profundidade   | Recomendação                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **1–2 níveis** | Sempre OK. Use por padrão.                                                                                                                 |
| **3 níveis**   | OK se o 3º nível só aparece para <30% dos usuários (rota de exceção/aprofundamento).                                                       |
| **4 níveis**   | OK só para perfis avançados/competitivos onde o usuário _espera_ especificidade (atleta master, triatleta 70.3+, powerlifter competitivo). |
| **5+ níveis**  | Apenas em rotas opt-in ("quer aprofundar?"). Nunca obrigatório.                                                                            |

**Regras operacionais:**

1. **Tempo total ≤ 7 minutos** para o aluno comum (10–15 perguntas efetivas, com branches dinâmicas). Atletas avançados podem ir até 12 minutos pois esperam-no.
2. **Salvamento automático em cada checkpoint** (a cada 3 perguntas).
3. **Barra de progresso real** (não falsa) — usuários completam mais quando sabem onde estão.
4. **One-question-at-a-time como padrão** com agrupamento de "irmãs lógicas" em multi-question pages só para dados demográficos óbvios (idade, peso, altura juntos OK; preferência de feedback + objetivo NÃO).
5. **"Pular" deve existir** em perguntas não-críticas. Forçar resposta = abandonar.
6. **Linguagem em PT-BR coloquial mas técnica quando útil** (como Typeform: "fala uma palavra" é melhor que "qual é o seu nome").

### 2.4 Como integrar M8/M9 (safety triggers) em branches profundas

Princípio: **safety triggers são interruptores assíncronos, não branches sequenciais.**

- M8 e M9 rodam _em paralelo_ a partir de respostas em qualquer ponto do fluxo.
- Se a qualquer momento um sintoma de bandeira vermelha aparece (dor torácica em esforço, tontura, perda de consciência, sangramento de gestante, dor 8+/10 em região operada <6 semanas), o fluxo **interrompe** e mostra um banner clínico de encaminhamento.
- Implementação: cada motor de pergunta emite eventos; um _safety listener_ observa e pode sobrepor a UI a qualquer momento.
- O relatório IA **nunca** ignora bandeiras: mesmo se o aluno tentar "burlar", a saída final mostra os disclaimers obrigatórios.

### 2.5 Resolução de conflitos entre motores

Quando dois motores divergem, há uma hierarquia explícita:

| Conflito                                              | Quem domina                 | Razão                                                                                        |
| ----------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| M8/M9 (saúde) vs. qualquer outro                      | **M8/M9**                   | Sempre. Risco clínico não-negociável.                                                        |
| M14 (histórico) vs. M3 (nível)                        | **M14**                     | "Atleta retornando após cirurgia" ≠ iniciante. Trata como intermediário/avançado em retorno. |
| M14 (lesão ativa) vs. M2 (gargalo)                    | **M14 sobrepõe**            | Reabilitação primeiro; gargalo é redirecionado pra que não conflite com fase de cura.        |
| M10 (carga atual já alta) vs. M1 (urgência)           | **M10**                     | Urgência não justifica overreaching que vai gerar lesão antes do evento.                     |
| M11 (déficit calórico severo) vs. M1 (objetivo PR)    | **Conflito visível**        | Relatório chama o conflito explicitamente: "déficit + meta de PR não convivem; escolha 1".   |
| M12 (pré-contemplação) vs. M1 (alta urgência alegada) | **M12**                     | Inverte o tom: relatório foca em construir motivação, não em prescrever 5×/semana.           |
| M5 (sem equipamento) vs. M2 (gargalo força máxima)    | **Híbrido com flag**        | Plano adaptado a calistenia/banda; relatório explica limitação real e alternativas pagas.    |
| M7 (sem ferramentas) vs. M3 (avançado)                | **Estimativa + auto-teste** | Sugere protocolos auto-administráveis (Ramp test, CSS test, AMRAP) com disclaimers.          |

Estes conflitos são _codificados como regras explícitas no engine de geração_, não deixados para interpretação livre da LLM.

---

## 3. Tabela Motores × Modalidades

> Notação: ✅ = motor crítico (sempre usado); 🟡 = motor situacional (usado em ~30–60% dos casos); ➖ = raramente relevante (skipped por padrão).

| Motor                       | Musculação | Corrida | Ciclismo | CrossFit | Natação | Triathlon | Reabilitação |
| --------------------------- | ---------- | ------- | -------- | -------- | ------- | --------- | ------------ |
| M1 Contexto                 | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| M2 Gargalo                  | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| M3 Nível                    | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | 🟡           |
| M4 Comportamento            | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| M5 Ambiente                 | ✅         | 🟡      | ✅       | ✅       | ✅      | ✅        | ✅           |
| M6 Identidade               | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| M7 Métricas                 | 🟡         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| M8 Liberação                | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| **M9 Saúde PAR-Q+**         | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| **M10 Carga/Prontidão**     | 🟡         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| **M11 Nutrição**            | ✅         | 🟡      | 🟡       | ✅       | 🟡      | ✅        | 🟡           |
| **M12 Psicológico**         | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| **M13 Social**              | 🟡         | ✅      | ✅       | ✅       | 🟡      | ✅        | 🟡           |
| **M14 Histórico**           | ✅         | ✅      | ✅       | ✅       | ✅      | ✅        | ✅           |
| **M15 Tecnologia**          | 🟡         | ✅      | ✅       | 🟡       | ✅      | ✅        | 🟡           |
| **M16 Ciclos/Sazonalidade** | 🟡         | ✅      | ✅       | 🟡       | 🟡      | ✅        | ➖           |

**Insight:** modalidades de endurance (corrida, ciclismo, triathlon) usam praticamente todos os 16 motores. Reabilitação tem padrão peculiar (M16 ➖, mas M14 e M9 dominam). Musculação tem maior peso em M11 (Nutrição) por causa da cultura de cutting/bulking no Brasil.

---

## 4. Árvores de Branch Detalhadas — As 7 Modalidades Atuais

> Cada árvore abaixo é um esqueleto de 3+ níveis. **Não é o template inteiro** — é a "espinha dorsal" do motor M2 (Gargalo) + M3 (Nível) interagindo com motores secundários.

### 4.1 Musculação

```
Objetivo dominante (M1+M2)
├── HIPERTROFIA / ESTÉTICA
│   ├── Fase do ciclo nutricional (M11) → Bulk / Cut / Recomp / Manutenção
│   │   ├── Em CUT
│   │   │   ├── Tempo em déficit (semanas) → 0–4 / 5–12 / >12
│   │   │   │   └── Se >12 sem → flag de adaptação metabólica → sugere diet break/refeed; relatório alerta sobre LEA
│   │   │   ├── Magnitude do déficit estimada → leve / moderado / agressivo
│   │   │   └── Histórico de cutting → primeiro / 2-3x / muitos (> efeito iô-iô?)
│   │   ├── Em BULK
│   │   │   ├── Tipo → "lean bulk" / "dirty bulk"
│   │   │   ├── Histórico de respostas (ganho fácil / hardgainer)
│   │   │   └── Marcador-alvo: peso / circunferência / força em X exercício
│   │   └── Em MANUTENÇÃO/RECOMP → flag de paciência (recomp é lento)
│   ├── Volume de treino atual semanal (séries por grupo)
│   └── Marcador específico de progresso preferido
│       └── Espelho / fita / DEXA / foto / força em base lift
│
├── FORÇA / PERFORMANCE
│   ├── Modalidade-alvo → Powerlifting amador / Strongman / Apenas força geral
│   ├── PRs atuais (squat / bench / deadlift) → categoriza nível por Wilks/DOTS
│   ├── Sistema de autorregulação que usa → RPE / RIR / %1RM / nada
│   └── Frequência de teste → mensal / trimestral / nunca
│
├── SAÚDE / LONGEVIDADE
│   ├── Idade + comorbidades (link M9)
│   ├── Marcador funcional preferido → mobilidade / equilíbrio / força para AVDs
│   └── Frequência sustentável → 2x / 3x / 4x+
│
└── REABILITAÇÃO / DOR (link M14)
    └── (ver árvore de Reabilitação, seção 4.7)
```

### 4.2 Corrida

```
Experiência (M3)
├── INICIANTE (<6 meses ou run-walk)
│   ├── Objetivo de evento → primeira 5K / 10K / sem evento / só saúde
│   ├── Frequência atual semanal → 0 / 1-2 / 3+
│   └── Tipo de pisada / histórico de dor → tem orientação? / nunca avaliou
│
├── INTERMEDIÁRIO (consegue 10K, ainda sem 21K)
│   ├── Tipo de prova-alvo → 10K / 21K (meia) / 42K (maratona) / trail / sem prova
│   │   └── Se prova → distância + data → calcula prazo de bloco
│   ├── Pace atual confiável → 5K time recente / 10K time / só estimativa
│   │   └── Calcula VDOT (Daniels) → zonas E/M/T/I/R
│   ├── Ferramenta de medição (M7+M15) → relógio GPS / app celular / nada
│   │   └── Se relógio → marca/modelo (Garmin/Apple/Polar/Coros) → integração disponível
│   └── Volume semanal atual (km) → calcula ACWR alvo
│
└── AVANÇADO / COMPETITIVO
    ├── PRs em distâncias-chave (5K, 10K, 21K, 42K) → VDOT preciso
    ├── Tipo de prova-alvo → asfalto / trail / ultra / track
    ├── Métrica específica que persegue → tempo / posição / qualificação Boston-style
    ├── Estrutura de treino preferida → polarizado 80/20 / piramidal / threshold-heavy
    ├── Histórico de lesão por corrida (M14) → canela / joelho / aquiles / IT band / planta
    │   └── Se sim, há quanto tempo → ajusta volume inicial, prioriza força
    ├── Periodização → linear / undulating / block / não estrutura
    └── Sazonalidade brasileira (M16) → calor extremo? altitude? estação chuvosa?
```

**Saídas-chave do branch:** zonas Daniels VDOT (E/M/T/I/R) ou zonas por FC%; volume semanal inicial; long run; quantidade e tipo de quality sessions; estratégia de pacing para prova-alvo.

### 4.3 Ciclismo

```
Modalidade (M1)
├── ESTRADA / SPEED
│   ├── Objetivo → fitness / fondo amador / performance / classificação
│   ├── Ferramentas (M7+M15)
│   │   ├── Potenciômetro? → marca, indoor/outdoor
│   │   │   └── FTP atual (W ou W/kg)
│   │   │       ├── Conhece? → quando foi medido? (>60 dias = re-teste)
│   │   │       └── Não conhece? → oferece protocolo (Ramp / 20-min / AI Detection se TR)
│   │   ├── Sem potenciômetro → frequencímetro? → zonas por FC%LTHR
│   │   └── Nem um nem outro → zonas por RPE + velocidade média
│   ├── Estrutura preferida → polarizado / sweet spot / pirâmide / GranFondo-style
│   ├── Plataforma usada (M15) → TrainerRoad / Zwift / Wahoo SYSTM / Strava / planilha / nenhuma
│   └── Volume atual semanal (h) → ACWR alvo
│
├── MOUNTAIN BIKE / XCO / XCM
│   ├── Tipo de evento → maratona MTB / XCO / enduro / só trilha
│   └── Componente técnica vs. fisiológica → balanço de skill drills
│
├── GRAVEL / ULTRA
│   └── Distância-alvo + autonomia + nutrição em prova (link M11)
│
└── INDOOR / SPINNING / CASUAL
    └── Sem necessidade de FTP detalhado → RPE-based
```

### 4.4 CrossFit

```
Fase competitiva (M1)
├── COMPETITIVO (Open / Quarterfinals / Sanctional)
│   ├── Movimentos dominados → matriz Rx
│   │   ├── Ginásticos: muscle-up anel / bar / HSPU / pistol / DU
│   │   ├── Olímpicos: snatch 1RM / clean&jerk 1RM em % do peso
│   │   └── Monoestructurais: 5K time / 2K row / 1-mile assault bike
│   ├── Níveis de força (M3) → squats e levantamentos em relação ao peso corporal
│   ├── Tipo de programação atual → CrossFit.com / Mayhem / Misfit / Linchpin / box-only
│   ├── Métricas competitivas conhecidas → Fran / Murph / Grace / Helen / "the girls" times
│   │   └── Histórico de PRs + última testada
│   ├── Periodização para Open → fase atual (off-season / build / peak / taper)
│   └── Volume semanal (sessões + cardio extra)
│
├── INTERMEDIÁRIO (faz Rx em metade dos WODs)
│   ├── Lacunas técnicas auto-percebidas → ginástica / olympic / capacidade aeróbica
│   ├── Frequência semanal → 3 / 4 / 5+
│   └── Sente que está progredindo? (auto-percepção) → calibra volume de skill work
│
├── INICIANTE / ON-RAMP
│   ├── Tempo em CrossFit → <3 meses / 3-6 / 6-12
│   ├── Histórico fitness prévio → atleta / sedentário / vinha de academia
│   └── Equipamentos disponíveis se treino em casa
│
└── HÍBRIDO (CF + outra modalidade dominante: hyrox, run, lifting)
    └── Ratio de prioridade → 70/30 / 50/50
```

### 4.5 Natação

```
Nados dominados (M3)
├── Crawl como dominante
│   ├── Frequência atual → 1-2x / 3-4x / 5+x semana
│   ├── Métrica conhecida (M7)
│   │   ├── Conhece CSS? (test 400m + 200m)
│   │   │   └── Se sim → pace por 100m / zonas (Recovery 65–75% / End1 75–85% / End2 85–90% / Threshold 90–100% / VO2max 100–110%)
│   │   └── Conhece pace 100m de prova? → estimativa CSS via fade rule (+4 a +6s do best 400m pace)
│   ├── Tipo de prova-alvo
│   │   ├── Águas abertas → 1.5K / 5K / 10K / Travessia do Rio (cultural BR)
│   │   ├── Piscina → 50/100/200/400/800/1500
│   │   └── Triathlon (linka 4.6)
│   ├── Fase da temporada → off / build / peak / racing
│   └── Limitação principal → técnica / aeróbica / mental (águas abertas) / força
│
├── Múltiplos nados (medley / formação)
│   └── Precisa de balanço entre 4 estilos
│
└── Iniciante / aprendendo crawl
    ├── Consegue 25m sem parar? → não / sim com pausa / sim contínuo
    └── Acesso a técnico/aulas → sim / só treino solo
```

### 4.6 Triathlon

```
Distância-alvo (M1) → cada uma muda estrutura de fato
├── SUPER SPRINT / SPRINT (750m + 20K + 5K)
│   ├── Disciplina mais fraca (M2 — preditor #1 de performance: ciclismo no Sprint)
│   ├── Ferramentas (M15) → potência? GPS? CSS conhecido?
│   ├── Métricas atuais (M7) → FTP / VDOT / CSS pace
│   └── Volume semanal disponível (h) → 6-8h típico
│
├── OLÍMPICO (1.5K + 40K + 10K)
│   ├── Disciplina-chave preditora: NATAÇÃO (Bibliografia: Frontiers Physiology 2021)
│   │   └── Se nada fraca → branch específica de "swim camp" virtual
│   ├── Volume típico → 10-12h/sem
│   └── Brick sessions disponíveis → bike→run em mesmo dia possível?
│
├── 70.3 / MEIO-IRONMAN
│   ├── Disciplina-chave preditora: CICLISMO
│   ├── Ferramentas críticas → potenciômetro recomendado para esta distância
│   ├── Histórico de prova longa anterior → nenhuma / só running / Olímpico já feito
│   ├── Estratégia de nutrição em prova (M11) → testou? quantos g CHO/h?
│   └── Volume típico → 12-15h/sem
│
└── 140.6 / IRONMAN
    ├── Disciplina-chave preditora: CORRIDA (paradoxalmente)
    ├── Volume típico → 15-20h/sem
    ├── Logística de vida (M6 + M13) → suporte familiar é gating
    ├── Cronograma anual → corrida-chave em qual mês? bloco base no inverno BR?
    ├── Histórico de finishes prévios → primeiro Ironman / múltiplos
    └── Equipamento (M5) → bike TT? rolo? wetsuit?
```

### 4.7 Reabilitação (variantes dentro de cada modalidade)

```
Região anatômica afetada (M14)
├── JOELHO
│   ├── Diagnóstico
│   │   ├── Pós-cirúrgico (LCA / menisco / patela) → fase pós-op
│   │   │   ├── 0-2 sem (proteção / ROM passivo) → bloqueio de carga
│   │   │   ├── 2-6 sem (ROM ativo / carga progressiva) → exercícios isolados, baixa carga
│   │   │   ├── 6-12 sem (força e estabilidade) → mono-articular, sem pivô
│   │   │   ├── 3-6 meses (força e dinâmico) → testes de hop começam
│   │   │   └── 6-9+ meses (return to sport)
│   │   │       └── Critérios RTP atendidos? → ≥90% LSI força / hop tests / sem dor / ACL-RSI ≥56
│   │   │           ├── Sim → libera retorno gradual (CCC: control-chaos continuum)
│   │   │           └── Não → mantém em fase de transição
│   │   ├── Conservador (tendinopatia patelar / síndrome femoropatelar / ITBS)
│   │   │   ├── Dor atual (NRS 0-10) em atividade-alvo
│   │   │   ├── Fase: irritabilidade alta / moderada / baixa
│   │   │   └── Liberação médica formal? → tem laudo / só auto-relato
│   │   └── Crônico não-diagnosticado → encaminhamento médico obrigatório (M9)
│   ├── Restrições específicas → impacto / agachamento profundo / pivôs / deceleração
│   └── Modalidade que quer voltar (corrida? CF? musculação?) → adapta progressão
│
├── OMBRO / MMSS
│   ├── Diagnóstico (manguito / labrum / luxação recorrente / impacto)
│   ├── ROM atual em flexão e abdução
│   ├── Fase: dor de repouso? só em movimento? só em final de range?
│   └── Restrições → over-head movements? carga axial? bench? press?
│
├── COLUNA (lombar / cervical / torácica)
│   ├── Tipo: discal / facetária / muscular / inespecífica
│   ├── Bandeiras vermelhas (M9): irradiação para mmii com déficit motor / disfunção esfincteriana / dor noturna
│   │   └── QUALQUER bandeira vermelha → bloqueio total + encaminhamento neurológico
│   ├── Centralização vs periferização (princípio McKenzie básico)
│   └── Modalidade preferida que conflita (deadlift? agachamento?)
│
├── QUADRIL / PÉLVIS
│   ├── Femoroacetabular / labral / pubalgia (comum em jogadores) / piriformis
│   ├── Pós-parto? (cruza com M6) → diástase abdominal screening
│   └── Restrições rotacionais
│
├── TORNOZELO / PÉ
│   ├── Entorse aguda (graus I/II/III) / instabilidade crônica
│   ├── Tendinopatia aquileia / fascite plantar
│   └── Modalidade-alvo (corrida tem perfil próprio)
│
└── MMSS NÃO-OMBRO (cotovelo / punho / mão)
    ├── Epicondilite / túnel do carpo
    └── Esporte de manopla? (escalada, bjj, raquete) → adapta
```

**Princípio universal de Reabilitação no onboarding.bio:**

1. Sem laudo médico/fisio + bandeira vermelha → bloqueio + encaminhamento.
2. Sem laudo + dor moderada/baixa + sem bandeiras → plano "movimento seguro" com disclaimer e janela de re-avaliação em 2-4 semanas.
3. Com laudo + fase definida → plano por fase com critérios objetivos de progressão.
4. **Nunca prescrever protocolo de reabilitação sem que aluno tenha profissional de saúde acompanhando** — onboarding.bio é coadjuvante, não substituto.

---

## 5. Novas Modalidades Sugeridas (com justificativa de mercado brasileiro)

> Critério: tamanho de mercado real + diferenciação de motores + viabilidade técnica de template.

| #      | Modalidade                                                                     | Justificativa de mercado BR                                                                                                                                              | Motores diferenciais                                                                                                                                                                                                                    |
| ------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **N1** | **Lutas (BJJ / MMA / Boxe / Muay Thai)**                                       | BJJ é cultura nacional (Gracie, GFTeam, Atos). Brasil é potência mundial. >5.000 academias. UFC popular. CrossFit + S&C para BJJ é nicho subexplorado em apps.           | M2 (gargalos: grip / aeróbico anaeróbico / explosão / mobilidade quadril+ombro), M14 (crônica de joelho/ombro/cotovelo), M11 (cuts de peso pra competição — alto risco), M16 (calendário IBJJF). **Recomendação: PRIORITÁRIO para v2.** |
| **N2** | **Calistenia / Street Workout**                                                | Crescimento explosivo pós-pandemia, espaços "Estação Saúde" em todas capitais. Acessível (zero custo). Cultura própria com benchmarks (muscle-up, planche, front-lever). | M5 (barras públicas / paralelas / casa), M3 (níveis claros: principiante → muscle-up → planche), M7 (foto/vídeo como métrica primária).                                                                                                 |
| **N3** | **Yoga / Pilates / Mobilidade**                                                | Crescimento de 27% entre 2022–2024 (CNN Brasil). Pilates clínico é grande em SP/RJ. Yoga de manutenção ou complemento.                                                   | M2 (mobilidade dominante), M12 (motivação = bem-estar mental), M11 ➖, M6 (gestantes pós-parto comum). Não é treino de força clássico — pilar é diferente.                                                                              |
| **N4** | **Esportes Coletivos Recreativos (futebol / vôlei / basquete / beach tennis)** | Beach tennis explodiu 2022–2025 no Brasil. Futebol amador onipresente. Base S&C para não-atletas é demanda real ("quero correr melhor na pelada").                       | M2 (potência, agilidade, sprints repetidos), M14 (lesões típicas: tornozelo/ joelho/ posterior), M16 (sazonalidade torneios amadores), M13 (forte).                                                                                     |
| **N5** | **Powerlifting / Strongman**                                                   | Federações brasileiras (CBLB, IPF-Brasil) crescentes. Wilks/DOTS conhecidos. Cultura RPE/RIR madura.                                                                     | M7 (1RM em SBD), M11 (fase de peso para categoria), M3 nivelamento por Wilks, M10 RPE-based autoregulation. Variação clara da Musculação atual.                                                                                         |
| **N6** | **Escalada (esportiva / boulder / trad)**                                      | Crescimento via ginásios indoor (Cia. Athletica, Ibirapuera Climbing, etc.). Olimpíada visibilizou. Comunidade técnica.                                                  | M2 (grip / dedo / antebraço / core / mobilidade quadril), M3 (graduação V0–V17 / 5.6–5.15), M14 (crônicas de polia/cotovelo/ombro).                                                                                                     |

**Modalidades pesquisadas mas DESPRIORITIZADAS para v2:**

- **Surfe:** Apesar de Brasil ser potência (Medina, Toledo), o público amador é geograficamente concentrado (litoral) e o S&C para surfe é nicho — pode entrar em v3.
- **Atletismo (lançamentos / saltos / decatlo):** Mercado pequeno fora de federações; alto custo de manutenção dos templates por baixa adesão esperada.
- **Dança fitness (zumba / ritmos):** Categorizar dentro de "Cardio Geral" do template Musculação ou Saúde, não merece motor próprio inicialmente.
- **Esportes aquáticos não-natação (SUP, kayak, remo):** Nicho geográfico; agrupar em "Endurance água" futuro.

**Recomendação operacional:** lançar **N1 (Lutas) e N2 (Calistenia)** como prioridade na v2, deixar N3–N6 como roadmap explícito na documentação interna.

---

## 6. Princípios de UX para Evitar Fadiga em Formulários Adaptativos

Baseado em literatura de Nielsen Norman Group, Typeform, MacroFactor, Whoop, Future, e estudos sobre cognitive fatigue:

### 6.1 Princípios não-negociáveis

1. **One-question-at-a-time como padrão.** Múltiplas perguntas só em "irmãs lógicas óbvias" (idade + peso + altura). Eleva completude de ~20% para ~40-55%.
2. **Progressive disclosure (Nielsen, 1995).** Revelar complexidade _só quando_ a resposta anterior justifica.
3. **Barra de progresso real e honesta.** Mostrar "passo X de Y" com Y dinâmico (não fingir que falta menos).
4. **Skip explícito em perguntas não-críticas.** Forçar resposta = 80% de abandono em fields opcionais (estatística repetida em múltiplas fontes).
5. **Salvamento automático em checkpoints a cada 3 perguntas.** Aluno pode voltar amanhã.
6. **Linguagem coloquial brasileira ("mata o orgulho do form").** "Bora começar?" > "Início do formulário". "Tá magrelo ou cheio?" pode ser melhor que "Qual sua composição corporal autopercebida?" (testar — depende da audiência da PT).
7. **Output personalizado visível ao final.** Crítica de UXCam: usuários respondem mais quando _veem_ a personalização gerada (MyFitnessPal mostra calorias-alvo imediatamente; relatório IA do onboarding.bio precisa de "preview shock").
8. **Tempo total ≤ 7 min target / ≤ 12 min ceiling.** SurveySparrow: surveys >12 min têm 3× mais drop-off.
9. **Entrada rica em modalidade preferida = imediato.** Se aluno escolheu "corrida" no passo 1, não pergunte se ele tem academia em casa antes de entrar em pace.

### 6.2 Padrões específicos para fitness

10. **Numbers com sliders, não inputs livres.** Pace, peso, FC, FTP — sliders com unidades certas evitam erros de digitação.
11. **"Não sei / nunca medi" como opção sempre.** Se aluno é forçado a inventar FTP, sistema cai em garbage in / garbage out.
12. **Auto-teste como branch alternativo, não bloqueio.** "Quer fazer um teste rápido em 20 min?" / "Prefiro estimar pelas minhas corridas" — ambos válidos.
13. **Linguagem técnica é feature, não bug, para avançados.** Se o aluno pediu modalidade "Triathlon 70.3" e indicou potência, falar "FTP", "TSS", "IF" é o esperado. Para iniciante, traduzir.
14. **Rede de segurança visível.** "Suas respostas alimentam o relatório. Pode editá-las depois no perfil." → reduz ansiedade.

### 6.3 Anti-padrões a recusar (UX)

| Anti-padrão                                                  | Por quê                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Welcome screen com 3 parágrafos de marketing                 | Usuários querem _valor_, não pitch. NN/g: "marketing onboarding" tem mais skip do que features. |
| Pedido de cadastro (email/senha) antes de mostrar valor      | Calm, Headspace, Blinkist, Fastic — todos colocam paywall/cadastro _depois_ da personalização.  |
| Notificação push request no primeiro segundo                 | Usuário não tem motivo para autorizar ainda.                                                    |
| Tutorial passivo (carrossel de 5 slides)                     | "Nobody has 5 minutes to watch a meta-video" — Korczynska.                                      |
| Formulário tradicional "Wall of Text" com 30 fields visíveis | Estimulativa de esforço excessiva; abandono pré-início.                                         |
| Perguntar dado que app não vai usar                          | Quebra contrato implícito de "cada pergunta = personalização".                                  |

---

## 7. Esquema de Implementação (TypeScript + Supabase JSONB)

### 7.1 Forma sugerida do schema (orientação, não código final)

```typescript
type Engine =
  | 'context' | 'bottleneck' | 'level' | 'behavior'
  | 'environment' | 'identity' | 'metrics' | 'risk_clearance'
  // novos:
  | 'health_screening' | 'load_readiness' | 'nutrition'
  | 'psychological' | 'social' | 'history'
  | 'technology' | 'biological_cycles';

type Modality =
  | 'musculacao' | 'corrida' | 'ciclismo' | 'crossfit'
  | 'natacao' | 'triathlon' | 'reabilitacao'
  // opcionais v2:
  | 'lutas' | 'calistenia' | 'yoga_pilates'
  | 'esportes_coletivos' | 'powerlifting' | 'escalada';

interface Branch {
  id: string;
  engine: Engine;
  modality: Modality | 'all';
  parent_branch_id: string | null;
  depth: 1 | 2 | 3 | 4 | 5;
  trigger_condition: JSONLogic; // jsonlogic-like for condition evaluation
  question: { pt_BR: string; ui_type: 'single' | 'multi' | 'slider' | 'text' | 'number'; options?: Option[] };
  output_signals: OutputSignal[]; // affects what in the report
  safety_listener?: SafetyRule[];
}

interface SafetyRule {
  trigger: 'parq_red_flag' | 'red_s_flag' | 'pain_above_8' | 'rtp_not_met' | ...;
  action: 'block' | 'warn' | 'refer_medical';
  banner_pt_BR: string;
}

interface ConflictRule {
  engine_a: Engine;
  engine_b: Engine;
  resolution: 'a_wins' | 'b_wins' | 'flag_to_user' | 'hybrid';
  rationale: string;
}
```

Armazenar branches como JSONB no Supabase permite versionar templates (cada PT pode ter overrides), A/B testar perguntas, e separar lógica de motor de lógica de modalidade.

### 7.2 Telemetria recomendada

- Tempo médio de completude por motor.
- Taxa de skip por pergunta.
- Drop-off por checkpoint.
- Conflitos disparados por sessão.
- Bandeiras de M8/M9 por sessão.

Sem telemetria, é impossível saber se uma branch passa o teste 2.1 (mudança substancial). Recomendação: revisar branches a cada 90 dias com base nos dados — podar agressivamente.

---

## 8. Bibliografia & Frameworks Usados

### 8.1 Triagem & Liberação Médica

- **PAR-Q+ (2024 Update).** PAR-Q+ Collaboration. Versão oficial em `eparmedx.com`. Validada em PT-BR: Schwartz J, et al. _Frontiers in Cardiovascular Medicine_ 2021;8:712696. doi: 10.3389/fcvm.2021.712696.
- **ACSM Pre-Participation Screening Algorithm.** ACSM's Guidelines for Exercise Testing and Prescription, 11ª ed. (2022). Riebe D, et al. _MSSE_ original 2015.
- **Whitfield GP, et al.** "Applying the ACSM Preparticipation Screening Algorithm." _MSSE_ 2017 (NHANES validation).

### 8.2 Programação de Treino

- **NASM OPT Model.** National Academy of Sports Medicine — 5 fases (Stabilization Endurance, Strength Endurance, Hypertrophy, Maximal Strength, Power) em 3 níveis. Material oficial NASM.
- **Daniels J.** _Daniels' Running Formula_, 4th ed. Human Kinetics, 2021. Sistema VDOT e zonas E/M/T/I/R.
- **Periodização.** Bompa & Buzzichelli, _Periodization: Theory and Methodology of Training_, 6ª ed. Linear vs DUP vs Block: meta-análise Frontiers Public Health 2026 (DOI: 10.3389/fpubh.2026.1707627); Stronger by Science (Helms et al.).

### 8.3 Avaliação de Movimento

- **FMS (Functional Movement Screen).** Cook G, Burton L, et al. 7 testes, scoring 0–3, composite ≤14 → maior risco lesão. Reliability: Teyhen DS, et al. _JOSPT_ 2012;42(6):530-540.
- **SFMA (Selective Functional Movement Assessment).** Para pacientes com dor.

### 8.4 Carga & Recuperação

- **ACWR (Acute:Chronic Workload Ratio).** Gabbett TJ. _BJSM_ 2016. Sweet spot 0.8–1.3. Meta-análise: PubMed 41029871 (2025).
- **sRPE (session-RPE).** Foster C, et al. _Journal of Strength & Conditioning Research_ 2001. Revisão 25 anos: PubMed 33508782 (2021).
- **Readiness questionnaires.** Hooper Index (sleep, fatigue, stress, soreness). ARMS (Acute Readiness Monitoring Scale) — PMC 8498198. McLean wellness questionnaire.
- **HRV-guided training.** Kubios, Elite HRV; revisão MDPI Sensors 2025;26(1):3.

### 8.5 Comportamento & Psicologia

- **Transtheoretical Model / Stages of Change.** Prochaska JO & DiClemente CC. 5+1 estágios. NCBI Bookshelf NBK556005.
- **Self-Determination Theory / BREQ-3.** Deci & Ryan; Markland D, Tobin V. Validação PT-BR 50+: MDPI 2024 (DOI: 10.3390/ijerph22010082).
- **Motivational Interviewing & OARS.** Miller WR & Rollnick S, _Motivational Interviewing_, 3rd ed. (2013).

### 8.6 Nutrição & Energia

- **MacroFactor.** Algoritmo adaptativo de TDEE baseado em ingestão real + tendência de peso. Stronger By Science / Greg Nuckols.
- **REDs / RED-S.** IOC Consensus Statement 2023, _BJSM_ 2023;57:1073-1097. CAT2 (Clinical Assessment Tool v2) BJSM 2023;57:1068-1072.
- **LEAF-Q & LEAM-Q.** Para screening de baixa disponibilidade energética (M e F).

### 8.7 Modalidades Específicas

- **CSS (Critical Swim Speed).** Wakayoshi K, et al. 1992; protocolo simplificado Ginn 1993 (400m + 200m TT). TrainingPeaks; MyProCoach.
- **CrossFit Benchmark Workouts.** "The Girls" e Hero WODs (Fran 21-15-9; Murph; Helen; Grace 30 C&J). CrossFit.com Essentials.
- **Triathlon discipline weighting.** Frontiers Physiology 2021 (DOI: 10.3389/fphys.2021.654552): preditor por distância (Sprint=ciclismo; Olímpico=natação; 70.3=ciclismo; 140.6=corrida).
- **Powerlifting RPE/RIR.** Tuchscherer M., Helms E. Wilks/DOTS/IPF GL formulas.

### 8.8 Reabilitação & Return-to-Play

- **RTP criteria.** ≥90% LSI força contralateral; hop tests 90%+; ACL-RSI ≥56. van der Horst N, et al. _Sports Med_ 2016;46:899–912 (hamstring). Taberner M, et al. _BJSM_ 2019 (Control-Chaos Continuum).
- **Phases of rehabilitation.** Aguda → Subaguda → Crônica/Funcional → Pré-RTP → RTP → Post-rehab monitoring (Barça Innovation Hub).

### 8.9 UX & Design de Formulários

- **Nielsen Norman Group.** "Mobile-App Onboarding" (Budiu R.); "Progressive Disclosure" (Nielsen J., 1995).
- **Typeform research.** "10 tips for writing better survey questions" — completude 55% positivo vs 38% negativo.
- **InMoment / SurveyMonkey / SurveySparrow.** Drop-off rates por length; 74% só topam 5 perguntas.
- **Apps benchmark:** Whoop, Future, MacroFactor, TrainerRoad, Strava, Calm, Headspace, Fastic, Blinkist (UXCam, Appcues, NN/g, designerup.co).

### 8.10 Mercado Brasileiro

- **Panorama Setorial Fitness Brasil 2025** (FitnessBrasil): corrida 28%, musculação 26%, alongamento 8%, ciclismo 6%, treinamento funcional 6%, natação 5%, pilates 5%.
- **CNN Brasil (2024–2026):** Pilates/yoga +27% 2022-2024; wearables 36-44% adultos; tendências fitness 2026.
- **ChronoMAX (2025):** análise de 11.9M resultados de corridas de rua brasileiras 2023–2025; 51,8% mulheres no pelotão; Sudeste 51% concluintes.
- **Credence Research (2024):** Brazil Fitness Market valor USD 42.8M → USD 88.5M até 2032 (CAGR 9.5%).

---

## 9. Roadmap Sugerido de Implementação

| Sprint                 | Entrega                                                                 | Critério de aceite                                                          |
| ---------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **0 (semana 1)**       | Migração: documentar v1 atual em mesma estrutura JSONB que v2 vai usar. | Cada um dos 33 templates atuais expressos no schema novo, sem perda.        |
| **1 (semanas 2-3)**    | Implementar M9 (Saúde PAR-Q+ PT-BR).                                    | Aluno responde PAR-Q+ em <90s; bandeiras vermelhas bloqueiam fluxo.         |
| **2 (semanas 4-5)**    | Implementar M14 (Histórico) + regra de override de M3.                  | "Atleta retornando" gera plano diferente de "Iniciante".                    |
| **3 (semanas 6-7)**    | M10 (Carga/Prontidão) + ACWR no plano gerado.                           | Plano de bloco respeita 0.8–1.3 ACWR alvo.                                  |
| **4 (semanas 8-9)**    | M12 (Psicológico TTM/SDT) → calibração de tom.                          | Aluno em pré-contemplação recebe relatório com tom diferente de Manutenção. |
| **5 (semanas 10-11)**  | M11 (Nutrição contexto) — sem prescrever, só calibrar.                  | Detecta conflito "déficit + meta de PR" e mostra explicitamente.            |
| **6 (semanas 12-13)**  | M13 + M15 + M16 (motores menores).                                      | Cobertura completa dos 16 motores.                                          |
| **7 (semanas 14-16)**  | Aprofundar branches v1 → v2 (Musculação, Corrida, Ciclismo).            | Profundidade média ≥3 níveis, conformidade com testes da seção 2.1.         |
| **8 (semanas 17-19)**  | Aprofundar branches CrossFit, Natação, Triathlon, Reabilitação.         | Idem.                                                                       |
| **9 (semanas 20-22)**  | Modalidade Lutas (N1) + Calistenia (N2).                                | 2 novas modalidades em produção.                                            |
| **10 (semanas 23-26)** | Telemetria + revisão de branches subutilizadas.                         | Branches com <2% de uso e sem alteração substancial são podadas.            |

---

## 10. Critérios de Sucesso da v2

1. **Tempo médio de onboarding ≤ 7 min** (baseline v1 a medir).
2. **Taxa de completude ≥ 70%** (vs ~40-50% típico do mercado para forms de >10 perguntas).
3. **NPS do relatório IA gerado ≥ 50** entre alunos finais.
4. **0 incidentes de safety bypass** (M8/M9 nunca burlados).
5. **Cada branch ativo em produção atende ≥ 1 dos 5 testes da seção 2.1.**
6. **PTs CREF têm autonomia para criar overrides de templates** sem precisar de dev.
7. **16 motores cobrem ≥ 95% dos casos** sem necessidade de "outro" como rota frequente.

---

## 11. Notas Finais & Avisos

- **Este documento NÃO é prescrição clínica.** É uma especificação arquitetural. PT/CREF acompanha; profissional médico é referência para casos clínicos.
- **CREF e prescrição alimentar:** M11 captura contexto, **não prescreve dietas** (privativo do nutricionista). Templates devem incluir disclaimer e CTA para encaminhamento.
- **Privacidade e LGPD:** dados de saúde (M9) são sensíveis. Schema deve segregar e respeitar consentimento granular. Não armazenar bandeiras vermelhas sem necessidade.
- **Atualização contínua:** PAR-Q+ é atualizado periodicamente (atual 2024); ACSM Guidelines a cada 5 anos; IOC RED-S CAT a cada 5 anos. Revisar bibliografia anualmente.
- **Limitação de evidência:** ACWR teve críticas metodológicas recentes (Lolli et al. 2017+); usar como guia, não como dogma. Periodização linear vs undulating: meta-análises mostram efeitos similares — não vender uma como superior.
- **Conflito de motores não é bug, é feature.** Quando M10 e M1 conflitam, o relatório DEVE mostrar o conflito ao aluno — isso é parte do valor.

---

_Documento vivo. Próxima revisão: trimestral, com base em telemetria e novos achados de literatura._
_Autor: pesquisa consolidada para onboarding.bio v2._
_Versão do documento: 2.0 — abril/2026._

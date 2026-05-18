# Documento Mestre — Funil de Análise CREF → Fundadores onboarding.bio

**Versão:** 1.1 (com pesquisa de mercado real — maio 2026)
**Data:** maio de 2026
**Objetivo:** captar profissionais autônomos do CREF via tráfego pago, entregar diagnóstico de negócio com IA como isca digital, e converter em fundadores do MVP a R$ 27/mês vitalício.

---

## 1. Visão geral do funil

```
Anúncio Meta Ads
    ↓
Página de captura (onboarding.bio/analise-gratuita)
    ↓
Formulário inteligente (23 perguntas, ~5 minutos)
    ↓
Geração do relatório com IA (síncrono, streaming, ~30s)
    ↓
Página do relatório (8 seções + gancho condicional)
    ↓
CTA do gancho → Landing de fundadores
    ↓
CTA "ver meu site na prática" → Onboarding interativo
    ↓
Preview real do site com dados reais
    ↓
Checkout integrado (R$ 27/mês via Pix recorrente)
    ↓
Slug ativo + painel liberado + boas-vindas
```

**Tempo total da jornada:** ~15 minutos com 4 entregas de valor pelo caminho.

---

## 2. Posicionamento e copy mestre

### Promessa central da isca

"Análise gratuita do seu negócio para profissionais do CREF — diagnóstico personalizado em 5 minutos."

### Promessa do produto (landing)

"Captação de novos alunos com gestão completa do negócio em um único lugar — `onboarding.bio/seu-nome`."

### Tom de voz

Direto, próximo, profissional sem ser corporativo. Sem jargão de marketing digital.

---

## 3. Etapa 1 — Criativos do anúncio (Meta Ads)

### Configuração

- **Plataforma única:** Meta Ads (Facebook + Instagram)
- **Pixel:** instalado em todas as páginas do funil
- **CAPI:** configurada (eventos Lead, CompleteRegistration, Purchase)
- **UTM padrão:** `utm_source=meta`, `utm_medium=ads`, `utm_campaign={nome}`, `utm_content={criativo}`

### Segmentação

- **Geo:** Brasil
- **Idade:** 25–55
- **Interesses:** personal trainer, fitness business, CREF, musculação, crossfit, corrida, ciclismo, natação, triathlon
- **Orçamento inicial:** R$ 30–50/dia

### Criativos a produzir

- 3–5 estáticos (feed e stories)
- 2–3 vídeos curtos (15s e 30s)
- 5+ headlines variadas
- 5+ descrições variadas
- 3 ângulos de copy: dor, curiosidade, autoridade

### CTA do botão

"Saiba mais" ou "Cadastrar-se"

---

## 4. Etapa 2 — Página de captura

### URL

`onboarding.bio/analise-gratuita`

### Estrutura

- Headline alinhada ao anúncio
- Subheadline com a entrega do relatório
- 3–5 bullets de valor
- Tempo estimado: "5 minutos"
- CTA primário: "Começar minha análise"
- Aceite LGPD obrigatório

### Princípios de UX

- Mobile-first com cara de app
- Sem menu, sem footer pesado
- Sem distrações visuais
- Carrega em menos de 2 segundos

---

## 5. Etapa 3 — Formulário inteligente (23 perguntas)

### Princípios gerais

- Mobile-first com cara de app
- Uma pergunta por tela
- Transições suaves
- Botões mínimo 48px de altura
- Barra de progresso fixa no topo
- Auto-save (recupera progresso se fechar)
- Tela final de transição: "Estamos preparando sua análise..."

### Bloco 1 — Perfil (3 perguntas, múltipla escolha)

**1.** Qual sua modalidade principal?

> Musculação · Corrida · Ciclismo · Natação · CrossFit · Triathlon

**2.** Onde você atua?

> Academia parceira · Domicílio · Ao ar livre · Estúdio próprio · Online

**3.** Há quanto tempo atua como autônomo?

> Menos de 1 ano · 1–3 anos · 4–7 anos · Mais de 7 anos

### Bloco 2 — Números (4 perguntas — valores exatos)

**4.** Quantos alunos ativos você tem hoje? _(input numérico)_
**5.** Quanto você cobra em média por aluno/mês? _(input R$)_
**6.** Quais seus gastos fixos mensais aproximados? _(input R$)_
**7.** Há quanto tempo, em média, seus alunos ficam com você? _(input em meses)_

### Bloco 3 — Mercado (2 perguntas, múltipla escolha)

**8.** O que outros profissionais da sua região cobram em média?

> Menos que eu · Parecido comigo · Mais que eu · Não sei

**9.** Qual o perfil do seu aluno mais comum?

> Iniciante/sedentário · Pessoa ativa sem objetivo específico · Atleta amador · Atleta de performance/competição

### Bloco 4 — Negócio (2 perguntas, múltipla escolha)

**10.** De onde vêm a maioria dos seus alunos?

> Indicação de alunos · Instagram/redes sociais · Academia onde trabalho · Google/internet · Outros

**11.** Qual sua maior dificuldade hoje?

> Conseguir novos alunos · Reter quem já tenho · Cobrar mais caro · Organizar as finanças · Conciliar tempo

### Bloco 5 — Operação digital (6 perguntas, múltipla escolha)

**12.** Você tem um site profissional hoje?

> Sim · Tenho só Instagram/redes · Tenho um Linktree ou similar · Não tenho nada

**13.** Como novos interessados costumam te procurar?

> Direct do Instagram · WhatsApp direto · Indicação por mensagem · Não sei direito, é confuso

**14.** Quando alguém demonstra interesse, como você organiza a conversão?

> Converso pelo WhatsApp e tento fechar · Mando um PDF/proposta · Faço uma avaliação presencial · Não tenho um processo definido

**15.** Onde você guarda hoje as informações dos seus alunos? _(múltipla escolha)_

> Caderno/papel · WhatsApp · Planilha Excel/Google · Notion · App específico · Na cabeça mesmo

**16.** Você já perdeu aluno por não ter conseguido mostrar resultado/evolução?

> Sim, com frequência · Algumas vezes · Raramente · Nunca pensei nisso

**17.** Quanto tempo por semana você gasta com tarefas administrativas?

> Menos de 2h · 2–5h · 5–10h · Mais de 10h

### Bloco 6 — Visão de negócio (4 perguntas)

**18.** Você já vendeu ou pensa em vender programas estruturados?

> Já vendo (assessoria, mentoria, pacote) · Pensei em vender mas não sei como · Nunca pensei nisso · Não faz sentido pro meu negócio

**19.** Como você cobra seus alunos hoje?

> Pix manual mensal · Boleto/transferência · Maquininha · Plataforma de pagamento · Misto

**20.** Qual seu maior canal de conteúdo hoje?

> Instagram · TikTok · YouTube · Não produzo conteúdo · Outros

**21.** Quantos seguidores você tem no seu maior canal? _(input numérico)_

### Bloco 7 — Autopercepção (2 perguntas abertas)

**22.** Em uma frase: qual seu maior diferencial como profissional? _(máx. 100 caracteres)_
**23.** O que você gostaria de melhorar no seu negócio nos próximos 6 meses? _(máx. 100 caracteres)_

### Dados pessoais (no final)

- Nome completo, e-mail, WhatsApp com DDD
- Estado _(dropdown)_, Cidade _(autocomplete IBGE)_
- Você é registrado no CREF?
  > Sim · Estagiário/estudante · Não tenho · Outra área
- Número do CREF _(opcional, sem validação)_
- Aceite LGPD _(obrigatório)_
- Opt-in para receber o relatório

---

## 6. Etapa 4 — Banco de dados de mercado (Supabase) — DADOS REAIS

### Justificativa

Manter o banco no Supabase em vez de JSON no código permite atualizar benchmarks sem deploy, carregar só o necessário no contexto da IA, versionamento automático e edição direta pelo painel.

### Tabela `market_benchmarks`

```sql
CREATE TABLE market_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modalidade text NOT NULL CHECK (modalidade IN ('musculacao','corrida','ciclismo','natacao','crossfit','triathlon')),
  preco_basico_min numeric NOT NULL,
  preco_basico_max numeric NOT NULL,
  preco_medio_min numeric NOT NULL,
  preco_medio_max numeric NOT NULL,
  preco_premium_min numeric NOT NULL,
  preco_premium_max numeric NOT NULL,
  ticket_medio_nacional numeric NOT NULL,
  churn_mensal_min numeric NOT NULL,
  churn_mensal_max numeric NOT NULL,
  permanencia_meses_min numeric NOT NULL,
  permanencia_meses_max numeric NOT NULL,
  conversao_leads_min numeric NOT NULL,
  conversao_leads_max numeric NOT NULL,
  sazonalidade_picos text[] NOT NULL,
  sazonalidade_vales text[] NOT NULL,
  perfil_aluno_idade text NOT NULL,
  perfil_aluno_genero text NOT NULL,
  perfil_aluno_classe text NOT NULL,
  objetivos_alunos text[] NOT NULL,
  diferenciais_valorizados text[] NOT NULL,
  forcas_setor text[] NOT NULL,
  ameacas_setor text[] NOT NULL,
  oportunidades_setor text[] NOT NULL,
  ferramentas_dominantes text[] NOT NULL,
  observacoes_canal jsonb,
  updated_at timestamptz DEFAULT now()
);
```

### Como o backend usa

Antes de chamar a IA:

```sql
SELECT * FROM market_benchmarks WHERE modalidade = ?
```

Pega ~1KB de dados relevantes e injeta no prompt.

### Manutenção

- Atualização trimestral (preços nominais reajustados por IPCA quando aplicável)
- Edição pelo Supabase Studio

---

### 6.1 Dados — MUSCULAÇÃO / PERSONAL TRAINING

| Campo                      | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preco_basico_min`         | 400                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `preco_basico_max`         | 700                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `preco_medio_min`          | 700                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `preco_medio_max`          | 1200                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `preco_premium_min`        | 1200                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `preco_premium_max`        | 2500                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ticket_medio_nacional`    | 900                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `churn_mensal_min`         | 6                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `churn_mensal_max`         | 10                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `permanencia_meses_min`    | 6                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `permanencia_meses_max`    | 14                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `conversao_leads_min`      | 8                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `conversao_leads_max`      | 35                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `sazonalidade_picos`       | ['janeiro','fevereiro','marco','setembro','outubro','novembro']                                                                                                                                                                                                                                                                                                                                                                                             |
| `sazonalidade_vales`       | ['maio','junho','julho','agosto','dezembro']                                                                                                                                                                                                                                                                                                                                                                                                                |
| `perfil_aluno_idade`       | "26–45 anos (faixa dominante)"                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `perfil_aluno_genero`      | "62% homens / 38% mulheres"                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `perfil_aluno_classe`      | "B e C dominantes; A no premium"                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `objetivos_alunos`         | ['hipertrofia/estética','emagrecimento','saúde e longevidade','performance esportiva','reabilitação pós-lesão']                                                                                                                                                                                                                                                                                                                                             |
| `diferenciais_valorizados` | ['resultado mensurável com fotos e medidas','proximidade humana e disponibilidade','segurança técnica','especialização em nicho']                                                                                                                                                                                                                                                                                                                           |
| `forcas_setor`             | ['demanda crescente puxada por longevidade e saúde mental','baixa barreira de entrada para iniciar a carreira autônoma','margens altas no segmento premium']                                                                                                                                                                                                                                                                                                |
| `ameacas_setor`            | ['academias low-cost reduzem percepção de valor do personal de bairro','apps de IA prescrevendo treino genérico','exigência de NFS-e e proibição de MEI aumentam pressão regulatória']                                                                                                                                                                                                                                                                      |
| `oportunidades_setor`      | ['modelo híbrido presencial + online com tracking via wearable','público 50+ longevidade ativa com baixa concorrência qualificada','nichos especializados como gestantes, oncológico e reabilitação cardíaca']                                                                                                                                                                                                                                              |
| `ferramentas_dominantes`   | ['WhatsApp','planilhas Google/Excel','Trainerize','MFIT','Vedius','Tecnofit Personal']                                                                                                                                                                                                                                                                                                                                                                      |
| `observacoes_canal`        | `{"online": "-15% a -40% vs presencial; faixa típica R$ 150–500/mês", "domiciliar": "+20–40% sobre o valor da academia", "academia_parceira": "personal paga taxa de uso R$ 50–500/mês ao espaço", "estudio_proprio": "+30–60% acima da média por exclusividade", "ar_livre": "preço médio sem prêmio significativo", "1_a_1": "R$ 70–250/h", "dupla": "30–50% de desconto por aluno", "pequenos_grupos": "R$ 150–400/aluno/mês — formato em crescimento"}` |

---

### 6.2 Dados — CORRIDA / ASSESSORIA

| Campo                      | Valor                                                                                                                                                                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preco_basico_min`         | 90                                                                                                                                                                                                                                                                     |
| `preco_basico_max`         | 180                                                                                                                                                                                                                                                                    |
| `preco_medio_min`          | 200                                                                                                                                                                                                                                                                    |
| `preco_medio_max`          | 380                                                                                                                                                                                                                                                                    |
| `preco_premium_min`        | 400                                                                                                                                                                                                                                                                    |
| `preco_premium_max`        | 700                                                                                                                                                                                                                                                                    |
| `ticket_medio_nacional`    | 250                                                                                                                                                                                                                                                                    |
| `churn_mensal_min`         | 5                                                                                                                                                                                                                                                                      |
| `churn_mensal_max`         | 8                                                                                                                                                                                                                                                                      |
| `permanencia_meses_min`    | 8                                                                                                                                                                                                                                                                      |
| `permanencia_meses_max`    | 14                                                                                                                                                                                                                                                                     |
| `conversao_leads_min`      | 15                                                                                                                                                                                                                                                                     |
| `conversao_leads_max`      | 25                                                                                                                                                                                                                                                                     |
| `sazonalidade_picos`       | ['marco','abril','maio','outubro','novembro','dezembro']                                                                                                                                                                                                               |
| `sazonalidade_vales`       | ['janeiro','julho']                                                                                                                                                                                                                                                    |
| `perfil_aluno_idade`       | "idade média 34 anos (caiu de 37 em 2024)"                                                                                                                                                                                                                             |
| `perfil_aluno_genero`      | "50% mulheres, 50% homens"                                                                                                                                                                                                                                             |
| `perfil_aluno_classe`      | "B e C (43% classe C em 2025)"                                                                                                                                                                                                                                         |
| `objetivos_alunos`         | ['saúde e qualidade de vida','primeira prova 5K ou 10K','meia-maratona','maratona','saúde mental']                                                                                                                                                                     |
| `diferenciais_valorizados` | ['senso de comunidade e grupo de WhatsApp ativo','apoio em provas com tenda e isotônico','planilha integrada ao relógio Garmin/Polar/Coros','correção de lesão e biomecânica']                                                                                         |
| `forcas_setor`             | ['modalidade em explosão com 5.241 provas em 2025 e crescimento de 85%','base demográfica nova com 45% dos inscritos em sua primeira prova','baixíssimo CapEx para o profissional sem necessidade de estúdio']                                                         |
| `ameacas_setor`            | ['clubes de corrida gratuitos patrocinados por marcas como Nike, adidas, Asics','planilhas gratuitas e IA via Strava e ChatGPT','commoditização do treinador quando várias assessorias atendem a mesma cidade']                                                        |
| `oportunidades_setor`      | ['feminino e classe C em forte expansão','provas temáticas e turismo esportivo (Majors, Ironman 70.3)','pacote de primeira maratona como produto fechado']                                                                                                             |
| `ferramentas_dominantes`   | ['TrainingPeaks','SisRUN Coach','Strava','WhatsApp Business','planilhas Google']                                                                                                                                                                                       |
| `observacoes_canal`        | `{"online_puro": "R$ 120–250/mês", "presencial_grupo": "preço base da assessoria", "personalizado_1_a_1": "R$ 400–800/mês", "pacotes_anuais": "10–20% de desconto (1 ou 2 mensalidades grátis)", "matricula_avaliacao": "R$ 100–250 cobrada na primeira mensalidade"}` |

---

### 6.3 Dados — CICLISMO

| Campo                      | Valor                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `preco_basico_min`         | 150                                                                                                                                                                                                                                                                      |
| `preco_basico_max`         | 280                                                                                                                                                                                                                                                                      |
| `preco_medio_min`          | 280                                                                                                                                                                                                                                                                      |
| `preco_medio_max`          | 500                                                                                                                                                                                                                                                                      |
| `preco_premium_min`        | 500                                                                                                                                                                                                                                                                      |
| `preco_premium_max`        | 900                                                                                                                                                                                                                                                                      |
| `ticket_medio_nacional`    | 330                                                                                                                                                                                                                                                                      |
| `churn_mensal_min`         | 4                                                                                                                                                                                                                                                                        |
| `churn_mensal_max`         | 7                                                                                                                                                                                                                                                                        |
| `permanencia_meses_min`    | 12                                                                                                                                                                                                                                                                       |
| `permanencia_meses_max`    | 24                                                                                                                                                                                                                                                                       |
| `conversao_leads_min`      | 10                                                                                                                                                                                                                                                                       |
| `conversao_leads_max`      | 20                                                                                                                                                                                                                                                                       |
| `sazonalidade_picos`       | ['abril','maio','junho','julho','agosto','setembro','outubro']                                                                                                                                                                                                           |
| `sazonalidade_vales`       | ['janeiro','fevereiro','marco']                                                                                                                                                                                                                                          |
| `perfil_aluno_idade`       | "idade média 42 anos; 83% acima de 29 anos"                                                                                                                                                                                                                              |
| `perfil_aluno_genero`      | "86% homens, 14–24% mulheres"                                                                                                                                                                                                                                            |
| `perfil_aluno_classe`      | "A e B dominantes (público economicamente favorecido)"                                                                                                                                                                                                                   |
| `objetivos_alunos`         | ['melhorar FTP e potência','completar Granfondos','MTB races como Brasil Ride','saúde e perda de peso adulta','comunidade de pelotão']                                                                                                                                   |
| `diferenciais_valorizados` | ['análise técnica de dados (potência, FC, VAM)','conhecimento de rotas','suporte em provas longas','periodização clara']                                                                                                                                                 |
| `forcas_setor`             | ['público de alto poder aquisitivo (47% gastam R$ 100–300/mês em manutenção)','crescimento de e-bikes (+89% no 1ºT 2025)','modalidade adulta consolidada com baixíssima rotatividade']                                                                                   |
| `ameacas_setor`            | ['plataformas internacionais como TrainerRoad e Zwift Workouts entregando planilha por US$ 20/mês','planilhas gratuitas em comunidades Strava e fóruns','infraestrutura urbana limitada e percepção de insegurança em algumas regiões']                                  |
| `oportunidades_setor`      | ['MTB e gravel em forte expansão regional (Nordeste, Centro-Oeste e Norte dobraram)','mulheres no ciclismo crescendo (24,65% em 2024 vs 22,18% em 2023)','coaching para cicloturismo e provas de longa distância']                                                       |
| `ferramentas_dominantes`   | ['TrainingPeaks','Strava Premium','Zwift','WKO5','planilhas Google','WhatsApp']                                                                                                                                                                                          |
| `observacoes_canal`        | `{"online": "praticamente o padrão da modalidade", "presencial_grupo": "raros, maioria pedala sozinho ou em pelotão informal", "bike_fit_avulso": "R$ 300–800 — soma ao ticket mensal", "premium_internacional": "TrainingPeaks Coach Edition US$ 19/mês pago à parte"}` |

---

### 6.4 Dados — NATAÇÃO

| Campo                      | Valor                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preco_basico_min`         | 100                                                                                                                                                                                                                                                                                                                 |
| `preco_basico_max`         | 180                                                                                                                                                                                                                                                                                                                 |
| `preco_medio_min`          | 180                                                                                                                                                                                                                                                                                                                 |
| `preco_medio_max`          | 300                                                                                                                                                                                                                                                                                                                 |
| `preco_premium_min`        | 300                                                                                                                                                                                                                                                                                                                 |
| `preco_premium_max`        | 600                                                                                                                                                                                                                                                                                                                 |
| `ticket_medio_nacional`    | 200                                                                                                                                                                                                                                                                                                                 |
| `churn_mensal_min`         | 6                                                                                                                                                                                                                                                                                                                   |
| `churn_mensal_max`         | 10                                                                                                                                                                                                                                                                                                                  |
| `permanencia_meses_min`    | 6                                                                                                                                                                                                                                                                                                                   |
| `permanencia_meses_max`    | 36                                                                                                                                                                                                                                                                                                                  |
| `conversao_leads_min`      | 25                                                                                                                                                                                                                                                                                                                  |
| `conversao_leads_max`      | 40                                                                                                                                                                                                                                                                                                                  |
| `sazonalidade_picos`       | ['fevereiro','marco','abril','setembro','outubro','novembro']                                                                                                                                                                                                                                                       |
| `sazonalidade_vales`       | ['julho','dezembro']                                                                                                                                                                                                                                                                                                |
| `perfil_aluno_idade`       | "bimodal — crianças 3–12 e adultos 30–60"                                                                                                                                                                                                                                                                           |
| `perfil_aluno_genero`      | "60% feminino na hidroginástica/aquático adulto"                                                                                                                                                                                                                                                                    |
| `perfil_aluno_classe`      | "A, B e C — varia muito por região e tipo de espaço"                                                                                                                                                                                                                                                                |
| `objetivos_alunos`         | ['aprender a nadar','melhorar técnica para travessias e triathlon','condicionamento de baixo impacto','reabilitação articular','segurança aquática infantil']                                                                                                                                                       |
| `diferenciais_valorizados` | ['paciência (especialmente medo de água em adulto)','turmas reduzidas','água quente','segurança e atenção individual']                                                                                                                                                                                              |
| `forcas_setor`             | ['aula percebida como obrigatória por muitos pais por questão de segurança aquática','sem concorrência low-cost real porque exige piscina e estrutura','público fiel em adultos (reabilitação, gestantes, terceira idade)']                                                                                         |
| `ameacas_setor`            | ['custo de estrutura (piscina aquecida, tratamento) tira margem do profissional autônomo','clubes sociais subsidiados (SESC, AABBs) com mensalidades simbólicas','competição de modalidades aquáticas substitutas como hidroginástica e aquabike']                                                                  |
| `oportunidades_setor`      | ['adulto que nunca aprendeu a nadar — público crescente puxado por travessias e triathlon iniciante','natação para gestantes e bebês com tickets premium','preparação física para travessias amadoras']                                                                                                             |
| `ferramentas_dominantes`   | ['WhatsApp','planilhas Google','agenda Google','apps de avaliação técnica em vídeo']                                                                                                                                                                                                                                |
| `observacoes_canal`        | `{"hora_aula_domiciliar": "R$ 80–200 (média R$ 84)", "hora_aula_academia_parceira": "R$ 60–150", "pacote_8_aulas_1_a_1": "R$ 600–1.500/mês", "pacote_dupla": "R$ 50–90 por aluno por sessão", "online": "praticamente inviável (apenas dryswim/conceitual)", "horarios_tipicos": "fragmentados — 5h-9h e 17h-22h"}` |

---

### 6.5 Dados — CROSSFIT

| Campo                      | Valor                                                                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preco_basico_min`         | 200                                                                                                                                                                                                                                                |
| `preco_basico_max`         | 320                                                                                                                                                                                                                                                |
| `preco_medio_min`          | 320                                                                                                                                                                                                                                                |
| `preco_medio_max`          | 500                                                                                                                                                                                                                                                |
| `preco_premium_min`        | 500                                                                                                                                                                                                                                                |
| `preco_premium_max`        | 900                                                                                                                                                                                                                                                |
| `ticket_medio_nacional`    | 330                                                                                                                                                                                                                                                |
| `churn_mensal_min`         | 3                                                                                                                                                                                                                                                  |
| `churn_mensal_max`         | 6                                                                                                                                                                                                                                                  |
| `permanencia_meses_min`    | 14                                                                                                                                                                                                                                                 |
| `permanencia_meses_max`    | 24                                                                                                                                                                                                                                                 |
| `conversao_leads_min`      | 25                                                                                                                                                                                                                                                 |
| `conversao_leads_max`      | 40                                                                                                                                                                                                                                                 |
| `sazonalidade_picos`       | ['fevereiro','marco','setembro','outubro','novembro']                                                                                                                                                                                              |
| `sazonalidade_vales`       | ['dezembro','janeiro']                                                                                                                                                                                                                             |
| `perfil_aluno_idade`       | "28–45 anos (70% millennials)"                                                                                                                                                                                                                     |
| `perfil_aluno_genero`      | "40–55% mulheres"                                                                                                                                                                                                                                  |
| `perfil_aluno_classe`      | "A e B (dispostos a pagar 2–3x mensalidade de academia tradicional)"                                                                                                                                                                               |
| `objetivos_alunos`         | ['condicionamento físico geral','pertencer a uma comunidade','performance e PRs','emagrecimento','ficar em forma sem rotina entediante']                                                                                                           |
| `diferenciais_valorizados` | ['qualidade técnica do coach (correção de movimento)','ambiente do box','eventos in-house e throwdowns','horários compatíveis com rotina de executivo']                                                                                            |
| `forcas_setor`             | ['comunidade como fator número 1 de retenção, dificilmente replicável por low-cost','Brasil é o 2º país do mundo em boxes afiliados (~1.124 unidades)','ticket alto e previsível com público millennial classe A/B']                               |
| `ameacas_setor`            | ['aumento de 50% na taxa de afiliação CrossFit em 2024 e exigência de Level 2 pressionam custos','Cross Training marca-branca confunde o aluno final','lesões publicizadas afastam parte do público iniciante']                                    |
| `oportunidades_setor`      | ['CrossFit Kids e Master 50+ como segmentos com baixíssimo churn','competições amadoras locais como produto monetizável','híbrido box + programação online para ex-alunos que se mudaram']                                                         |
| `ferramentas_dominantes`   | ['SugarWOD','Wodify','Tecnofit Box','PushPress','WhatsApp comunitário','Instagram do box']                                                                                                                                                         |
| `observacoes_canal`        | `{"mensalidade_box": "valor base (turmas em grupo)", "open_gym": "R$ 100–250/sessão", "personal_em_box": "R$ 800–2.500/mês para 8–12 sessões", "programacao_online": "R$ 150–500/mês", "afiliacao_crossfit_inc": "R$ 13.200/ano (12x sem juros)"}` |

---

### 6.6 Dados — TRIATHLON

| Campo                      | Valor                                                                                                                                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preco_basico_min`         | 250                                                                                                                                                                                                                                                                                             |
| `preco_basico_max`         | 400                                                                                                                                                                                                                                                                                             |
| `preco_medio_min`          | 400                                                                                                                                                                                                                                                                                             |
| `preco_medio_max`          | 600                                                                                                                                                                                                                                                                                             |
| `preco_premium_min`        | 600                                                                                                                                                                                                                                                                                             |
| `preco_premium_max`        | 1500                                                                                                                                                                                                                                                                                            |
| `ticket_medio_nacional`    | 450                                                                                                                                                                                                                                                                                             |
| `churn_mensal_min`         | 3                                                                                                                                                                                                                                                                                               |
| `churn_mensal_max`         | 6                                                                                                                                                                                                                                                                                               |
| `permanencia_meses_min`    | 14                                                                                                                                                                                                                                                                                              |
| `permanencia_meses_max`    | 30                                                                                                                                                                                                                                                                                              |
| `conversao_leads_min`      | 12                                                                                                                                                                                                                                                                                              |
| `conversao_leads_max`      | 20                                                                                                                                                                                                                                                                                              |
| `sazonalidade_picos`       | ['agosto','setembro','outubro','novembro','dezembro','janeiro','fevereiro','marco']                                                                                                                                                                                                             |
| `sazonalidade_vales`       | ['junho','julho']                                                                                                                                                                                                                                                                               |
| `perfil_aluno_idade`       | "30–45 anos (faixa dominante)"                                                                                                                                                                                                                                                                  |
| `perfil_aluno_genero`      | "70% homens, 30% mulheres"                                                                                                                                                                                                                                                                      |
| `perfil_aluno_classe`      | "A e B (renda média acima de 5 salários mínimos, predominância de pós-graduados)"                                                                                                                                                                                                               |
| `objetivos_alunos`         | ['completar primeiro Ironman 70.3','qualificar para Mundial Kona','performance pessoal','desafio de vida','saúde mental']                                                                                                                                                                       |
| `diferenciais_valorizados` | ['experiência do coach em prova (Ironman finishes)','suporte logístico no dia da prova','conhecimento técnico de transições, pacing e nutrição','periodização integrando 3 modalidades']                                                                                                        |
| `forcas_setor`             | ['público de alto poder aquisitivo e altamente fidelizado','ciclo anual de provas-alvo gera retenção natural','3 fontes de receita técnica integradas (natação, ciclismo, corrida)']                                                                                                            |
| `ameacas_setor`            | ['base estreita de mercado nicho (~30–50 mil triatletas amadores ativos no BR)','aulas e grupos gratuitos da CBTri e ligas competem na entrada','custo total da modalidade afasta novos entrantes (bike R$ 15–50k, wetsuit, inscrições)']                                                       |
| `oportunidades_setor`      | ['mulheres no triathlon (~31% e crescendo)','ultra-distância e Xtreme como nicho premium','training camps e turismo esportivo (Ironman 70.3 Florianópolis, Cascavel, Foz, Rio)']                                                                                                                |
| `ferramentas_dominantes`   | ['TrainingPeaks (padrão internacional)','WKO5','Final Surge','SisRUN','WhatsApp Business','Zoom para reuniões mensais']                                                                                                                                                                         |
| `observacoes_canal`        | `{"online_planilha": "R$ 250–400/mês", "presencial_3_modalidades": "R$ 400–600/mês", "one_to_one_premium": "R$ 600–1.500+/mês", "matricula_inicial": "R$ 100–250", "ftp_lactato_avulso": "R$ 300–700 (cliente paga à parte)", "trainingpeaks_coach": "US$ 19/mês pago à parte pelo treinador"}` |

---

### 6.7 Quadro-resumo (referência rápida para a IA)

| Modalidade | Ticket médio | Churn mensal | Permanência | Conversão leads |
| ---------- | ------------ | ------------ | ----------- | --------------- |
| Musculação | R$ 900       | 6–10%        | 6–14 meses  | 8–35%           |
| Corrida    | R$ 250       | 5–8%         | 8–14 meses  | 15–25%          |
| Ciclismo   | R$ 330       | 4–7%         | 12–24 meses | 10–20%          |
| Natação    | R$ 200       | 6–10%        | 6–36 meses  | 25–40%          |
| CrossFit   | R$ 330       | 3–6%         | 14–24 meses | 25–40%          |
| Triathlon  | R$ 450       | 3–6%         | 14–30 meses | 12–20%          |

### 6.8 Insights transversais (para a IA usar em qualquer modalidade)

- **WhatsApp é o sistema operacional do CREF brasileiro** — canal #1 em todas as 6 modalidades para comunicação, cobrança, captação e retenção.
- **Aula experimental gratuita dobra a conversão** — sobe de 10–20% (sem) para 25–40% (com).
- **72% dos cancelamentos acontecem nos primeiros 90 dias** — onboarding bem feito reduz churn em 30–50%.
- **Personal trainer não pode ser MEI desde 2018** — opera como pessoa física com RPA, ME (Anexo III via Fator R) ou na informalidade. NFS-e é obrigatória em SP, Curitiba e Florianópolis em 2026.
- **Wearables são o novo diferencial técnico** — aluno chega com Garmin/Apple Watch/Whoop e espera interpretação de HRV, VO2máx, sono.

### 6.9 Calibração regional (a IA deve aplicar)

- **Capitais cobram 50–100% mais que cidades de 50–200k habitantes.**
- Para profissionais no **Nordeste, Norte e Centro-Oeste**, considerar tickets **20–30% menores** e churn **10–15% maior** que a média da tabela.
- Para **Sudeste e Sul** (especialmente capitais), os valores da tabela são representativos.

### 6.10 Limites de confiança (a IA deve respeitar)

- Apresentar **faixas, não números pontuais** (ex.: "ticket médio de R$ 700–1.200" em vez de "R$ 950").
- Sempre que possível, calibrar pelo **estado/cidade** do profissional antes de recomendar pricing.
- Usar **churn de 6–10%** como gatilho de alerta — acima disso, sugerir auditoria de onboarding; abaixo de 3%, validar se o cálculo está correto.
- Para profissionais com **menos de 12 meses de história**, evitar prever LTV — usar apenas benchmark do nicho.

### 6.11 Fontes consultadas

- ACAD Brasil, IHRSA, HFA 2025
- Trainerize State of the Industry 2025/2026
- ACSM Worldwide Survey 2026
- ABRACEO/CBAt (provas de corrida 2025)
- SciELO 2023 (perfil de triatletas)
- Aliança Bike (mountain bike Brasil 2025)
- Pacto, Tecnofit, NeoFitFlow (benchmarks de churn)
- Cronoshare, Superprof, PersonalGO, Conecta Fitness (preços de personal)
- Webrun, Fitness Brasil, Times Brasil (corrida)
- Run Fun, Lobo Assessoria, Adriano Bastos, GPA, Menuci (referências de assessoria)
- Glassdoor, Indeed, Quero Bolsa, Meu Tudo (salários)

---

## 7. Etapa 5 — Geração do relatório com IA

### Modelo

**Claude Sonnet 4.5** — relação qualidade/custo/velocidade ideal para geração estruturada com benchmarks injetados.

### Estratégia técnica

- Geração síncrona com streaming
- Output estruturado em JSON com schema fixo
- Streaming exibido em tempo real
- Validação pós-geração (backend confere se todos os campos vieram preenchidos)
- Fallback: se a IA falhar, gera versão estática mínima

### Estrutura do prompt mestre

1. **Papel/identidade** — "Você é um analista de negócios especializado em profissionais autônomos do mercado fitness brasileiro."
2. **Contexto do produto** — uma linha sobre onboarding.bio
3. **Dados de entrada** — respostas + benchmarks da modalidade injetados do Supabase
4. **Regras de geração**
   - Não afirmar dados que não estejam no benchmark fornecido
   - Não inventar números de mercado
   - Apresentar **faixas**, não números pontuais
   - Aplicar calibração regional conforme item 6.9
   - Lógica condicional dos ganchos (item 8)
5. **Estrutura de saída obrigatória (JSON)** — 8 seções com schema fixo
6. **Tom de voz** — direto, próximo, profissional, sem jargão
7. **Few-shot examples** — 1–2 exemplos completos de relatório bem feito
8. **Restrições negativas explícitas**
   - "NÃO mencione site como fraqueza se a pessoa respondeu que tem site profissional."
   - "NÃO afirme dados de mercado fora do benchmark fornecido."
   - "NÃO use linguagem genérica de marketing."
   - "NÃO prever LTV de profissionais com menos de 12 meses de história."

### Variáveis nomeadas

`{{nome}}`, `{{modalidade}}`, `{{cidade}}`, `{{estado}}`, `{{respostas_formulario}}`, `{{benchmarks}}`

---

## 8. Etapa 6 — Lógica condicional dos ganchos

### Princípio

Só puxa um gancho se a fraqueza apareceu de fato nas respostas. Se o profissional está bem em tudo, o tom muda.

### Mapa de ganchos

| Resposta do formulário                       | Gancho na seção 8                                  |
| -------------------------------------------- | -------------------------------------------------- |
| Sem site profissional                        | Site template incluso em `onboarding.bio/seu-nome` |
| Tem só Linktree/Instagram                    | Vitrine própria que converte                       |
| Sem processo de conversão                    | Formulário inteligente + relatório IA              |
| Dados em vários lugares                      | Gestão unificada                                   |
| Já perdeu aluno por falta de evolução        | Galeria de antes/depois + depoimentos              |
| Cobra Pix manual                             | Cobrança recorrente automatizada                   |
| Pensou em vender programas mas não sabe como | Programas estruturados (roadmap)                   |
| Tem audiência grande mas poucos alunos       | Funil de conversão de seguidores                   |
| 5h+ em admin/semana                          | Centralização economiza horas                      |

### Dois tons de fechamento

**Tom A — várias dores detectadas:**

> "Carlos, suas 3 prioridades exigem ferramentas separadas hoje — site, captação, gestão. Existe um caminho mais simples."

**Tom B — bem estruturado:**

> "Marina, você tem fundamento sólido. O próximo nível é escala: como atender mais alunos sem perder qualidade. Estamos construindo algo pensado pra isso."

---

## 9. Etapa 7 — Página do relatório

### URL

`onboarding.bio/relatorio/[token]`

### Características

- Link permanente (sem expiração)
- Token único por relatório
- Marca presente em header e footer
- Botão "Baixar como PDF" (gera sob demanda, com a marca)
- Botão "Compartilhar via WhatsApp" com mensagem pronta

### 8 seções do relatório

1. Cabeçalho com dados do profissional
2. Indicadores financeiros (cards com valores reais)
3. Análise SWOT (gerada pela IA cruzando respostas + benchmarks)
4. Persona do aluno ideal
5. Análise de precificação (você vs. mercado)
6. Ponto de equilíbrio
7. Concorrência e diferenciais
8. **Top 3 ações prioritárias + gancho condicional**

---

## 10. Etapa 8 — Landing page de fundadores

### URL

`onboarding.bio/fundadores`

### Estrutura final (10 seções)

1. **Hero personalizado** com tom condicional (A ou B)
2. **Espelho de fraquezas** (só as detectadas no relatório)
3. **Como funciona em 3 passos**
4. **Tudo incluso agora** (4 blocos: captação, site, gestão de leads/alunos, gestão comercial)
5. **Roadmap** (timeline de 3 fases — direto na página, sem link externo)
6. **Changelog** (o que foi entregue no último mês)
7. **Por que ser fundador** (6 benefícios)
8. **Comparativo fragmentado vs. onboarding.bio**
9. **FAQ**
10. **CTA final com escassez**

### Roadmap (3 fases simplificadas)

**🟢 Disponível agora**

- Site profissional `onboarding.bio/seu-nome`
- Formulário inteligente + relatório IA
- Gestão completa: leads, alunos, planos, financeiro, fotos, depoimentos

**🟡 Próximos 90 dias**

- **Programas digitais:** desafios, assessorias, mentorias e comunidades
- **App do aluno:** evolução, check-ins, treinos pelo celular
- **Cobrança automática:** Pix recorrente, split, gestão financeira

**🔵 Em breve**

- **Lançamentos e perpétuos**
- **Integrações Strava, Garmin, Apple Health**
- **IA generativa de treinos** com base no histórico

### Comparativo fragmentado vs onboarding.bio

| O que você gasta hoje (separado)  | Custo médio        | Onboarding.bio |
| --------------------------------- | ------------------ | -------------- |
| Site profissional (Wix, designer) | R$ 50–150/mês      | ✅ Incluso     |
| CRM/gestão de leads               | R$ 40–100/mês      | ✅ Incluso     |
| Linktree Pro                      | R$ 30/mês          | ✅ Incluso     |
| Plataforma de formulário          | R$ 30/mês          | ✅ Incluso     |
| **Total fragmentado**             | **R$ 150–280/mês** | **R$ 27/mês**  |

---

## 11. Etapa 9 — Onboarding interativo

### Lógica

O CTA da landing leva para o onboarding (não direto pro pagamento). Pré-preenche tudo que veio do formulário.

### Fluxo

1. Pré-preenche dados existentes
2. Pergunta os 5–7 campos que faltam:
   - Slug desejado (validação de unicidade)
   - Bio profissional curta
   - Foto de perfil (upload)
   - 2 fotos extras (transformação ou ambiente)
   - 1 depoimento de aluno (opcional)
   - Confirmação de preços/planos
3. **Preview interativo do site** com dados reais
4. CTA: "Ativar agora — R$ 27/mês"

---

## 12. Etapa 10 — Pagamento

### Gateway

**EFI Bank**

### Configuração

- Método principal: Pix recorrente
- Renovação automática com aviso prévio
- Cancelamento pelo painel, sem multa
- Reembolso: 7 dias (CDC)
- NFS-e automática

### UX do checkout

- Modal/drawer no mesmo flow do onboarding (não redireciona)
- Site do profissional visível ao fundo
- "Seu site fica ativo em 30 segundos"
- Confirmação imediata + e-mail de boas-vindas + WhatsApp do fundador

---

## 13. Etapa 11 — Pós-pagamento

### Imediato

- Slug ativo
- Painel liberado
- E-mail de boas-vindas
- WhatsApp manual do fundador

### Primeiros 7 dias

- Tutorial inicial no painel
- Convite para grupo dos fundadores
- E-mails de acompanhamento manual

---

## 14. Tracking e analytics (mínimo MVP)

### Ferramentas

- Meta Ads Manager
- Pixel + CAPI com eventos:
  - `Lead` (preencheu formulário)
  - `LeadQualified` (visualizou relatório)
  - `InitiateCheckout` (iniciou onboarding)
  - `Purchase` (pagou)
- Acompanhamento manual no painel próprio

### Métricas críticas

- CPL, taxa de conclusão do formulário, taxa de visualização do relatório, taxa de clique no gancho, taxa de conversão da landing, CAC total

---

## 15. Itens legais e operacionais

### Documentos

- ✅ Termos de uso (com cláusula beta vitalício)
- ✅ Política de privacidade (LGPD com IA + Meta Pixel)
- ✅ Política de reembolso (7 dias)
- 🟡 Contrato de fundador

### Operacional

- ✅ CNPJ ativo
- 🟡 Conta PJ vinculada
- 🟡 Domínio com SSL
- 🟡 EFI Bank em produção
- ✅ Hospedagem (Vercel)
- 🟡 Sentry
- 🟡 Backup automático Supabase

### Suporte

- WhatsApp do fundador
- E-mail de suporte
- FAQ na landing

---

## 16. Decisões fechadas

✅ Mobile-first com cara de app
✅ CREF: campo opcional, sem validação automática
✅ 23 perguntas (mistura de exato e range)
✅ Cidade com autocomplete IBGE, Estado dropdown
✅ Banco de mercado no Supabase com dados reais por modalidade
✅ Sonnet 4.5 com prompt JSON estruturado + few-shot
✅ Geração síncrona com streaming
✅ Link do relatório permanente + PDF com marca
✅ Roadmap direto na landing, simplificado em 3 fases
✅ CTA da landing → onboarding → preview → checkout (fluxo único)
✅ EFI Bank como gateway, Pix recorrente como método principal
✅ Tracking mínimo: Pixel + CAPI + acompanhamento manual

---

## 17. Pendências para o lançamento

### Bloqueantes (antes do primeiro real em ads)

- [ ] Página de captura `onboarding.bio/analise-gratuita`
- [ ] Formulário com 23 perguntas (mobile-first com cara de app)
- [ ] Tabela `market_benchmarks` populada com os dados das seções 6.1 a 6.6
- [ ] Prompt mestre revisado com few-shot examples
- [ ] Endpoint de geração com streaming
- [ ] Página de relatório com 8 seções
- [ ] Geração de PDF com marca
- [ ] Landing `onboarding.bio/fundadores` com 10 seções
- [ ] Onboarding interativo
- [ ] Preview do site com dados reais
- [ ] Checkout integrado (EFI Bank)
- [ ] Pixel e CAPI configurados
- [ ] Termos e LGPD revisados

### Não bloqueantes (ajusta com tráfego rodando)

- Otimização de criativos
- A/B testing de headlines
- Automação de e-mail
- Automação de WhatsApp
- Tracking analytics avançado

---

## 18. Próximos passos imediatos

1. Popular tabela `market_benchmarks` com os dados das seções 6.1 a 6.6
2. Escrever o prompt mestre da IA com 1–2 few-shot examples e as restrições do item 6.10
3. Ajustar formulário existente para incluir as 23 perguntas
4. Construir a página de relatório com lógica condicional
5. Construir landing de fundadores
6. Conectar onboarding existente ao final da landing
7. Configurar Pixel e eventos
8. Testar fluxo end-to-end com 3–5 pessoas reais antes do tráfego pago

---

**Fim do documento.**

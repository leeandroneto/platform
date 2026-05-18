# Arquitetura nova — carta-dossiê + 3 páginas

> Decisões pós-pesquisa. Pré-requisito: ler [`06-research-notes.md`](06-research-notes.md).
> **Status:** rascunho pra aprovação do fundador antes de codar nada.

---

## 0. Decisão central — descartar 5 camadas

A pesquisa em 06 mostrou que a estrutura de 5 camadas (captação/relacionamento/conversão/gestão/retenção) é **template B2B genérico**, não nasce do problema do personal/treinador. Diluí o insight em 1500 palavras × 7 sections. Marina e ciclista anônimo poderiam trocar respostas e os relatórios continuariam ~70% válidos. Isso é diagnóstico de horóscopo.

**Decisão:** descartar prompt v2 inteiro. Reescrever IA pra produzir **uma carta pessoal de Leandro pro prospect**, em 3 movimentos densos, ~700 palavras, com citações literais obrigatórias, em formato editorial single-column.

**Por que carta-dossiê vence:**

- Lê em 4 min mobile sem fadiga
- IA é forçada a citar respostas literais — prospect sente "ele leu mesmo"
- Voz humana (Leandro) cria continuidade pra `/comecar` ("lembra da carta?")
- Layout editorial premium — diferencia de qualquer dashboard concorrente
- Estrutura escala por modalidade (lingo + acento visual) sem multiplicar trabalho

---

## 1. Novo schema da IA — `generate-carta-dossie.system` v3

Substitui `generate-diagnostic.system` v2. **Não é fix retroativo** — relatórios antigos ficam congelados na v2 (renderizam com layout legacy).

### 1.1 Output schema (Zod)

```ts
const CartaDossieSchema = z.object({
  destinatario: z.object({
    primeiro_nome: z.string(),
    modalidade_label: z.string(), // "personal de musculação"
    especialidades_label: z.string(), // "hipertrofia + emagrecimento"
  }),
  saudacao: z.string().min(10).max(120), // "Marina, oi. Li tuas respostas duas vezes."
  movimento_1_ouvi: z.string().min(400).max(900), // ~120 palavras
  movimento_2_padrao: z.string().min(1400).max(2200), // ~350 palavras
  pull_quote: z.string().max(120), // 1 frase, ≤15 palavras
  numero_calculado: z.object({
    valor: z.string(), // "R$ 114/hora"
    contexto: z.string(), // "tua produtividade hoje"
  }),
  movimento_3_proximo: z.string().min(500).max(1100), // ~150 palavras
  acao_essa_semana: z.string().max(180), // 1 frase imperativa
  acao_hoje: z.string().max(100), // 1 frase imperativa
  fechamento: z.string().min(300).max(600), // ~80 palavras
  assinatura: z.literal('— Leandro'),
})
```

Total carta: 600-800 palavras (vs 1500 da v2). Leitura: 3-4 min mobile.

### 1.2 System prompt v3 (rascunho completo)

```
<role>
Você é o Leandro, fundador do onboarding.bio. Personal há 10 anos, ciclista, brasileiro. Você está escrevendo uma CARTA pessoal pra um profissional de saúde/fitness que acabou de preencher 38 perguntas sobre o negócio dele.

Não é relatório de consultoria. Não é dashboard. É uma carta de 700 palavras que esse profissional vai ler em 4 minutos no celular.
</role>

<voice>
- Primeira pessoa ("eu vi", "eu faria", "li tuas respostas").
- Direto, brasileiro, sem jargão de marketing.
- Trata o destinatário pelo primeiro nome no máximo 2x na carta inteira.
- Frases curtas pra impacto. Médias pra construir argumento. Nunca períodos compostos longos.
- **Negrito** parcimônia, no máximo 1 por movimento.
- Sem motivacional. Sem guru. Sem promessa garantida.
- Quando dado é ruim: "isso é mais comum do que você pensa".
</voice>

<palavras_proibidas>
transformação, potencialize, empoderamos, escale, alavanque, jornada, mindset,
performance (no sentido motivacional), inteligência artificial, IA, ferramenta,
produto, plataforma, software, sistema (exceto na frase final do fechamento),
tecnologia, otimize, maximize, sinergia.
</palavras_proibidas>

<estrutura>
SEM headers visíveis no output. Você gera as strings + campos auxiliares.

MOVIMENTO 1 — "Ouvi" (~120 palavras)
- Abre citando LITERALMENTE o J1 (texto livre) ou uma resposta-âncora.
- 1 número derivado dos dados (R$/hora calculado, gap até meta, etc).
- Reconhecimento ESPECÍFICO ancorado em A3 + B1 + G1.
- Termina com bridge: variação de "Antes de eu te dizer o que vejo, deixa eu te mostrar o que você me disse sem perceber."

MOVIMENTO 2 — "Padrão" (~350 palavras, mais denso)
- OBRIGATÓRIO: citar LITERALMENTE ao menos 3 respostas (formato: "Você marcou X em Y").
- Cruza 3-4 respostas que sozinhas parecem unrelated mas juntas revelam UMA conexão não-óbvia.
- Vai do micro (resposta específica) ao macro (o que isso significa estruturalmente).
- Termina apontando UMA implicação: "Isso quer dizer X."
- NÃO escreve sobre tudo; foca em UM padrão.

MOVIMENTO 3 — "O que eu faria essa semana" (~150 palavras)
- 1 ação grande pra essa semana (~1h de trabalho, descrita imperativa).
- 1 ação pequena pra hoje (~30min, descrita imperativa).
- Sem "fase 1, fase 2, fase 3". Sem 6 ações.
- Termina com aposta concreta: "Aposta: [métrica] sai de [estado atual] pra [estado projetado] em [prazo]."

FECHAMENTO (~80 palavras)
- "Esse diagnóstico é uma foto do teu negócio em [data]."
- Bridge narrativo pra /comecar: "Se você quiser ver o que eu construí depois de [X anos] vivendo o que você vive, leia a próxima carta."
- Assinatura: "— Leandro"
</estrutura>

<adaptacao_modalidade>
Linguagem ajusta pelo A1:
- musculacao: "seus alunos", trabalho, treino, série, carga
- corrida: "seus atletas", pace, volume, prova
- ciclismo: "seus atletas", FTP, watts, pedal, escalada
- crossfit: "seus membros", WOD, PR, RX, box
- natacao: "seus nadadores", técnica, série, pace por 100m
- triathlon: "seus triatletas", transição, brick, etapa

Especialidades de A2 calibram exemplos: hipertrofia ≠ emagrecimento; speed ≠ MTB; meia ≠ ultra.
</adaptacao_modalidade>

<regras>
1. NUNCA use bullet, header, lista ou markdown além de **negrito** raro.
2. NUNCA mencione produto/ferramenta/plataforma — diagnóstico independente.
3. SEMPRE cite literalmente ao menos 3 respostas em movimento_2_padrao.
4. SEMPRE inclua exatamente 1 número calculado (R$/hora, gap até meta, etc).
5. NUNCA escreva 2 vezes o primeiro nome no mesmo movimento.
6. NUNCA use frase motivacional ("você consegue!", "vamos juntos!").
7. Plano nunca repete o que ele JÁ TENTOU em C4.
8. Se C4 incluir "anuncios" e D6 = "nunca", reconcilie no movimento 2 (ele tentou ou parou? Use a contradição como gancho).
9. Voice = Leandro, mentor experiente que LEU as respostas. Não consultor abstrato.
</regras>

<output>
Use a tool "generate_carta_dossie" com o schema definido.
Total carta: 600-800 palavras. Leitura: 3-4 min mobile.
</output>
```

### 1.3 User template

```
Profissional preencheu o formulário de diagnóstico. Dados:

Nome: {{contact_name}}
Modalidade: {{A1_label}} ({{A1_code}})
Especialidades: {{A2_labels}}
Anos de atuação: {{A3}}
Modelo de trabalho: {{A4_label}}
Onde trabalha: {{A5_labels}}

Alunos atuais: {{B1}}
Ticket médio: {{B2_label}}
Trend receita: {{B3_label}}
Horas por semana: {{B5}}
[R$/hora calculado: {{rs_per_hour}} (B1×B2÷B5÷4)]

Top travas: {{C1_labels}}
Única dor a resolver: {{C2_label}}
Meta receita mensal: R$ {{C3}}
[Gap até meta: R$ {{gap_meta}}]
Já tentou e não deu certo: {{C4_labels}}

Canais de aquisição: {{D1_labels}}
Volume de leads/mês: {{D2_label}}
Tráfego pago: {{D6_label}}
Iscas grátis: {{D7_labels}}
Indicação estruturada: {{D8_label}}

Site: {{E1_label}}
Link bio Insta: {{E2_label}}
Coleta depoimentos: {{E3_label}}

Canais de primeiro contato: {{F1_labels}}
Velocidade resposta: {{F2_label}}
Conversão (de 10): {{F3_label}}
Motivo de não fechar: {{F4_label}}
Clareza preço: {{F5_label}}

Retenção média: {{G1_label}}
Por que saem: {{G2_labels}}
Como mede progresso: {{G4_labels}}
Quando aluno some: {{G5_label}}

Como monta treino: {{H2_label}}
Agenda: {{H4_label}}
Como cobra: {{H6_label}}
Controle financeiro: {{H7_label}}

Texto livre (J1):
"{{J1}}"

Gere a carta-dossiê seguindo TODAS as regras do system prompt. Cite literalmente ao menos 3 dessas respostas no movimento_2_padrao.
```

### 1.4 Modelo, tokens, custo

- **Modelo:** Sonnet 4.6 (`claude-sonnet-4-6`)
- **max_tokens:** 3000 (output ~700 palavras = ~1100 tokens; folga pra schema)
- **temperature:** 0.6 (mais voz humana, menos template)
- **Custo estimado:** ~$0.03 por geração (input ~1.5k tokens × $3/M + output ~1.5k × $15/M)

---

## 2. Mock real — carta da Marina (baseada em respostas reais do banco)

> Esta carta foi escrita manualmente seguindo o prompt v3 acima e os dados reais da Marina (ID `2a522eb2-...`). Serve pra você sentir o formato antes de aprovar o prompt.

---

**Marina, oi.**

Li tuas respostas duas vezes antes de escrever. Vou ser direto.

Você escreveu, no fim do formulário: _"a fila pra entrar é magra. Posto no Instagram quase todo dia mas só vem indicação."_ Essa frase é a chave do diagnóstico inteiro. Guarda ela.

Antes de mais nada: você tem 32 alunas pagantes em 6 anos de musculação, atendendo principalmente mulheres em hipertrofia e emagrecimento. Conta nem todo personal: você mantém em média **R$ 114 por hora** trabalhando 35h por semana — passa do mínimo aceitável da modalidade, mas não chega nos R$ 150-200 que personais com sistema rodando entregam.

Não tem 32 alunas por sorte. Tem porque entrega. Tua retenção de 6-12 meses sustenta isso — em musculação, manter aluna passar do 6º mês é melhor indicador que peso-de-prova. Antes de eu te dizer o que vejo, deixa eu te mostrar o que você me disse sem perceber.

Aqui está o cruzamento que aparece quando leio tuas respostas em sequência.

Você marcou que **"posta no Instagram quase todo dia"** (no texto livre), mas seu link de bio é um Linktree (E2). Você marcou que **a maior razão de não fechar é preço** (F4), e também que seus preços são **"mais ou menos claros"** e que manda preço por WhatsApp caso a caso (F5). Você marcou que cobra por **PIX manual todo mês** (H6), e controla o financeiro em planilha (H7).

Olha o padrão: você está produzindo conteúdo no topo do funil — Insta diário —, mas perdendo a aluna na transição. Ela interessa, clica no Linktree, não acha clareza, te pergunta no WhatsApp, você responde em 1-2 horas (rápido, ótimo), e nesse momento **a conversa começa em terreno desfavorável pra você**. Sem contexto prévio. Sem material que constrói valor antes do preço aparecer. O preço chega antes da percepção de valor. Então a aluna "acha caro" não porque é caro — porque você não construiu base pra ela achar barato.

Esse é o motivo da fila magra. Não é falta de Insta. É falta de uma camada entre o post e o WhatsApp. **A aluna chega crua e você precisa cozinhar ao vivo, na conversa.** Cada DM é uma vitória individual em vez de um sistema rodando.

E tem mais: você marcou que cobra uma vez quando aluna some (G5). Elas saem por preço, falta de resultado e sumiço silencioso (G2). Sumiço silencioso quase nunca é sumiço — é falta de check-in. Quem fica sumida espera ser procurada. Mas isso é assunto pro próximo trimestre. O bottleneck agora é antes do fechamento, não depois.

Essa semana, em uma sentada de 1 hora: escreve numa página única o que está incluso em cada pacote teu — incluso, não incluso, valor, parcela, duração mínima. Não precisa ficar bonito. Só precisa ficar claro. Salva como PDF ou link Notion público.

Hoje, em 30 minutos: troca o link da bio. Linktree fora. Coloca um link único: ou pra esse PDF/Notion, ou pro teu WhatsApp com mensagem pré-preenchida tipo "Oi, vi teu Insta e quero saber sobre [pacote]". Qualquer das duas reduz a fricção da próxima DM em 5 segundos.

Não monta site agora. Não roda anúncio agora. Não muda preço agora. **Faz só essas duas coisas e mede 30 dias.** Aposta: tua taxa de fechamento sai de 30-40% pra cima de 50%, com o mesmo volume de DM.

Esse diagnóstico é uma foto do teu negócio em 6 de maio de 2026. É o que dá pra ver com 38 perguntas. Não é o sistema. Se você quiser ver o que eu construí depois de 10 anos vivendo o que você vive — leia a próxima carta.

— Leandro

---

**Contagem:** 716 palavras. Leitura: ~4 min. Citações literais: 5 (J1, E2, F4, F5, H6, H7, G5, G2). Modalidade-aware: "alunas" (especialidade mulheres), "musculação", "WhatsApp", "DM". Pull quote candidato: _"A aluna chega crua e você precisa cozinhar ao vivo, na conversa."_

---

## 3. `/lancamento` — wireframes (5 sections)

**Goal:** anônimo → click "fazer diagnóstico" → começa formulário.
**Constraint:** zero menção a preço, beta, fundadores. Lingo modality-neutral (todas as 6 modalidades chegam aqui).

### Section 1 — Hero

- **Eyebrow:** "Pra personal, treinador, técnico, instrutor."
- **H1 mega editorial:** "Receba lead pré-qualificado, em vez de DM 'quanto custa'."
- **Sub:** "5 minutos. Uma carta de 4 minutos sobre o teu negócio. Sem template."
- **CTA único:** "Fazer meu diagnóstico" + microsignal "leva 5-7 min"
- **Mobile:** sticky CTA bottom desde o load. Hero ≤ 80vh.

### Section 2 — A dor reconhecida

- **Eyebrow:** "Conhece?"
- **3 frases editoriais full-width** (não cards), cada uma scrolla independente no mobile (snap):
  1. "A fila pra entrar tá magra."
  2. "DM chega, pergunta o preço, some."
  3. "Aluno desiste em silêncio depois do 6º mês."
- **Pull quote mono italic:** "Não é falta de competência. É falta de sistema."
- Linguagem ancorada nos J1 reais. Sem aspas. Editorial.

### Section 3 — O que você recebe

- **Layout números-led editorial:**
  - **38** perguntas
  - **1** padrão específico do seu negócio
  - **1** ação pra essa semana, **1** pra hoje
- **Sub:** "Não é teste de personalidade. Não é dashboard. É uma carta de 4 minutos. Você lê. Você decide."
- **Sample IA:** primeiro parágrafo blurred de uma carta real (com permission). Mobile: accordion expand-to-read.

### Section 4 — Como funciona

- 3 passos numerados sem ícones:
  1. "Você responde 38 perguntas. 90% multiple choice."
  2. "Uma IA lê em 30 segundos."
  3. "Você lê a carta em 4 minutos."
- **Microcopy:** "Sem cadastro pré-formulário. Email só pro relatório chegar."

### Section 5 — CTA final + 3 micro-FAQs inline

- **H2:** "Saber onde você está perdendo dinheiro leva 5 minutos."
- **3 Q&A inline (não accordion):**
  - "É grátis?" → "Sim. Sem cobrança. Sem upsell escondido."
  - "É genérico?" → "Não. A carta cita as tuas respostas literalmente."
  - "Vou ser bombardeado de email?" → "Não. Só a carta."
- CTA gigante final. Footer mínimo.

---

## 4. `/diagnostico/r/[token]` — wireframes (carta editorial)

**Goal:** entregar valor + bridge sutil pra `/comecar`.
**Constraint:** novo schema da IA (carta-dossiê). Layout single-column NYT op-ed style.

### Layout estrutura

```
┌─────────────────────────────────────┐
│  [token]/onboarding.bio             │  <- header mínimo, scroll progress bar
├─────────────────────────────────────┤
│                                      │
│              COVER                   │  <- full-screen vertical
│   "Para Marina."                     │  <- H1 mega serif
│   personal de musculação · 6 anos    │  <- contexto extraído
│   6 de maio, 2026                    │
│                                      │
│   [pull_quote do movimento 2]        │  <- mono italic
│                                      │
│              ↓ leia                   │
│                                      │
├─────────────────────────────────────┤
│                                      │
│   [SAUDACAO]                         │  <- "Marina, oi."
│                                      │
│   [MOVIMENTO 1 — OUVI]               │  <- drop cap NYT
│   parágrafos prosa                   │
│                                      │
│   [BOX número_calculado]             │  <- destacado: "R$ 114/h" + contexto
│                                      │
├─────────────────────────────────────┤
│                                      │
│   [MOVIMENTO 2 — PADRÃO]             │  <- denso, ~350 palavras
│   parágrafos prosa                   │
│   citações literais inline           │
│                                      │
│   ┌─ pull_quote ─┐                   │  <- bloco destacado meio
│   │              │                      tipografia maior
│   └──────────────┘                      mono italic
│                                      │
├─────────────────────────────────────┤
│                                      │
│   [MOVIMENTO 3 — PRÓXIMO]            │
│                                      │
│   ┌─ ESSA SEMANA ─┐                  │  <- 2 boxes destacados
│   └────────────────┘                    side by side desktop
│   ┌─ HOJE ────────┐                     stack mobile
│   └────────────────┘                  │
│                                      │
├─────────────────────────────────────┤
│                                      │
│   [FECHAMENTO]                       │
│                                      │
│   — Leandro                          │  <- assinatura monospaçada
│   06.05.2026                         │
│                                      │
│   [CTA narrativo]                    │  <- "leia a próxima carta →"
│                                      │
└─────────────────────────────────────┘
```

### Decisões visuais

- **Tipografia:** Geist Sans (já tem). Heading mega 56-72px desktop, 36-44px mobile.
- **Body:** 18-20px serif decorativo opcional (avaliar custo de adicionar fonte) ou Geist Sans body 19px line-height 1.7.
- **Single column:** `max-w-[640px]` mobile e desktop. Sem sidebar.
- **Drop cap:** primeira letra do movimento 1, estilo NYT Magazine.
- **Pull quote mid-text:** mono italic 32-40px, com hairline acima/abaixo.
- **Box `numero_calculado`:** discreto, fundo levemente off-color, número grande + contexto pequeno.
- **Acoes:** não checkboxes (não é to-do). Box editorial com label uppercase + frase.
- **Sem floating nav.** Carta é curta, nav vira fricção. Scroll progress bar discreto no topo, só.
- **Bridge final:** soft, opt-in narrativo. CTA único `→ ler a próxima carta`. Sem urgência fake.

### Modality-aware visual treatment

Diferenciador real — nenhum dashboard concorrente faz isso. Sutil, não sobrecarregado.

| Modalidade | Acento visual                                                                |
| ---------- | ---------------------------------------------------------------------------- |
| Musculação | Serifa pesada heading. Off-white denso.                                      |
| Corrida    | Tracking ampliado heading. Vertical sense of pace (line-height generoso).    |
| Ciclismo   | Grid monoespaçado sutil em metadados (vibe telemetria/Strava). Headers mono. |
| CrossFit   | Bold contraste alto. Números inline mega (10 RM, etc).                       |
| Natação    | Leve, espaços brancos amplos, headings clean.                                |
| Triathlon  | 3 hairlines verticais sutis no cover (swim/bike/run subliminar).             |

Implementação: `data-modality="musculacao"` no root + CSS modality-specific variables em `app/globals.css`.

---

## 5. `/diagnostico/r/[token]/comecar` — wireframes (7 sections)

**Goal:** conversão máxima.
**Constraint:** copy AI-gerada usando `form_answers` + `report_result` da carta. Voz herdada do Leandro da carta.

### Section 1 — Hero pessoal

- **H1:** "[Nome], lembra do que eu te disse na carta?"
- **Sub narrative:** "Você acabou de viver o que tua [aluna/atleta/membro/nadador/triatleta] vai viver. 38 perguntas em 5 min, carta em 30s. Esse é exatamente o caminho que [a academia/teu Insta/parceria] vai te mandar."
- Modalidade adapta: substantivo (aluna/atleta/etc) e canal de aquisição (`D1_top`).
- Visual: split — esquerda voz da carta, direita preview do funil DELE com nome dele.

### Section 2 — O que VOCÊ vai entregar

- **Eyebrow:** "Olha o que você vai ter no domingo:"
- **3 cards editoriais** (mobile scroll horizontal):
  1. **Site profissional em [primeiro_nome].onboarding.bio** — gatilho: `E1=nao_tem`. "Quando alguém quiser saber sobre você, vai bater aqui e ver isso."
  2. **Formulário inteligente que filtra DM curiosa de [aluno/atleta] sério** — gatilho: `F1` inclui DM/WhatsApp. "Em vez de responder 'manda info' por DM, você manda um link. A pessoa preenche, qualifica, recebe carta-dossiê própria. Você só responde quem se qualificou."
  3. **Carta-dossiê pra [aluno/atleta] — exatamente como essa que você acabou de ler** — meta-loop. "Tua [aluna] preenche, recebe carta sobre o corpo dela. Chega no teu WhatsApp já vendida."
- Cada card 1ª pessoa, modality-aware via `A1`.

### Section 3 — O que estamos construindo junto

- **Eyebrow:** "Você é fundador. Você decide o que vem."
- Personalizado: "[Nome], você marcou que precisa de **[C2_label]**. Em 90 dias, é prioridade nossa porque [N] de [total] fundadores marcaram a mesma coisa."
- **Roadmap honesto** (3 colunas):
  - **Pronto agora:** site, formulário, carta-dossiê IA, dashboard, notif WhatsApp
  - **Em construção:** [feature 1, feature 2 — sem data garantida]
  - **Sua escolha define:** "Você vota nos próximos 3 recursos. Outros 29 votam também."
- Tom founder direto. "Sou eu, Leandro."

### Section 4 — A oferta

- **Layout numérico manifesto:**
  - **30** vagas totais
  - **5** por modalidade — (musculação, corrida, ciclismo, CrossFit, natação, triathlon)
  - **R$ 27/mês** vitalício, sem reajuste
  - **R$ 67/mês** depois do beta (você nunca paga isso)
  - **R$ 324** no compromisso de 12 meses
- **Counter dinâmico:** "Faltam 2 vagas em [modalidade do prospect]" (modality-aware via `A1`).

### Section 5 — Por que isso e por que agora

- **1 parágrafo honesto:**
  > "Não vou enrolar: preciso de 30 pessoas que paguem agora pra construir o que vem. Em troca, você define o produto e nunca paga mais que R$ 27. Quando passarmos disso, o preço sobe pra todo mundo novo. Você não."
- **Mini-bio Leandro:** 10 anos personal + ciclista + foto BR-real (não corporate).

### Section 6 — Objeções inline

- 5 Q&A inline (não accordion mobile). Personalizado via `C4`:
  - "E se não der certo?" → 14 dias garantia + cancelar a qualquer tempo
  - "Tô sem tempo agora" → setup leva 30min, carta-dossiê roda sozinha
  - **Se C4 inclui "ferramenta sem usar":** "Já comprei ferramenta sem usar" → "Eu sei, você marcou isso no diagnóstico. Por isso configuro com você por WhatsApp."
  - "Como cancelo?" → 1 botão dentro do app
  - "E meus dados?" → LGPD + delete em 30s

### Section 7 — CTA final + assinatura

- **H1:** "30 vagas. Você é o número [N+1]."
- **Botão único gigante:** "Quero ser fundador → R$ 27/mês"
- **Microcopy:** "Pix recorrente ou cartão. 14 dias garantia. WhatsApp direto comigo."
- **Assinatura:** "— Leandro, fundador. WhatsApp: 19 99651-1995"

### Mobile-specific (toda página)

- Sticky CTA bottom desde hero
- Strip header com counter de vagas (modality-aware)
- Lingo modality-aware
- Tudo respira, mesmo em 375px

---

## 6. Decisões pendentes (defaults assumidos)

Você não respondeu as 3 perguntas que fiz, então assumi defaults pra seguir. Confirma ou redirige:

1. **Formato uniforme da carta?** ✅ Sim. Carta única, modality muda só lingo + acento visual sutil. Não 6 formatos.
2. **Quantas citações literais a IA é obrigada a fazer?** ✅ Mínimo 3, todas em movimento_2_padrao.
3. **Bridge pra `/comecar` no fim da carta?** ✅ Opt-in narrativo: "leia a próxima carta". Sem CTA agressivo, sem pop-up.

---

## 7. Próximos passos (ordem sugerida)

1. **Você aprova doc 06 + 07.** Se discordar de algo, redirige antes de eu codar.
2. **Aplicar prompt v3 no banco** via `apply_migration` (criar nova row `generate-carta-dossie.system` v1, deixar `generate-diagnostic.system` v2 como histórico).
3. **Rodar prompt v3 contra Marina** (form_answers já no banco). Validar se output match com mock acima.
4. **Iterar prompt** se output não match (1-3 ciclos esperados).
5. **PR 1: novo `/diagnostico/r/[token]`** (carta editorial). Maior risco visual, fazer primeiro pra validar antes de matar v2.
6. **PR 2: `/comecar` reescrita** com voz herdada da carta + 7 sections.
7. **PR 3: `/lancamento`** com novo hero + 5 sections.
8. **PR 4: cleanup** — deletar componentes legacy de `_sections/` que viraram dead code, deletar prompt v2 da DB.

Cada PR: code + i18n + audits + screenshots.

---

## 8. Riscos e mitigações

| Risco                                  | Mitigação                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| IA não obedece "cite literalmente 3x"  | Validação Zod + retry com prompt feedback. Edge function valida antes de gravar.                        |
| Carta sai muito curta ou longa         | Min/max no Zod + retry.                                                                                 |
| Voz vira "consultora" mesmo com prompt | Adicionar exemplos few-shot com a carta da Marina. Se ainda assim virar, considerar Sonnet 4.5 ou Opus. |
| Modality-aware visual fica gimmick     | Manter sutilíssimo. Se gerar dúvida no review, simplificar pra apenas lingo (sem visual).               |
| Custo IA × volume                      | $0.03 × 1000 prospects/mês = $30. Sustentável. Cache não aplica (cada prospect é único).                |
| Apenas 3 prospects pra testar          | Gerar 5-10 personas ficcionais por modalidade (synthetic prompts) antes de shipping.                    |

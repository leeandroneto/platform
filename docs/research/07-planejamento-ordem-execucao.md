# desafit.app — Validação Crítica do Plano M0→M5 (solo + AI + bootstrapped)

**TL;DR.** A sequência agency-first → SaaS é defensável e historicamente comprovada (37signals/Basecamp, Campaign Monitor, Harvest/Iridesco, Disco Labs/Submarine, Perch, Gymdesk, Typeform, Ask BOSCO/Modo25). A maior fragilidade do plano **não está na ordem dos marcos**, mas em três pontos: (1) "5 dias de bootstrap + schema de ~54 tabelas antes de qualquer venda" é gold-plating clássico, agravado por AI-assisted dev; (2) M2 (1ª venda) deveria iniciar **em paralelo a M0**, não depois; (3) "1º tenant autônomo" (M3) como marco isolado é uma armadilha — o que destrava o produto é cliente-pagante-engajado, não autonomia técnica precoce. O cronograma implícito (provavelmente 6–9 meses) é otimista em ~2×: 14–24 meses é a faixa realista para solo+AI+BR.

---

## 1. Veredito por marco

| Marco                                 | Veredito                      | Frase                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M0** Bootstrap (5 dias)             | 🔄 ajustar                    | 5 dias para infra + schema completo antes de validar venda viola "distribution kills you, not product" — encurte para 2–3 dias de esqueleto operacional e inicie outreach já em paralelo.                                                                                                     |
| **M1** Funil agência                  | 🔄 ajustar                    | Funil sem produto é correto (Dan Martell/SaaS Academy, Forum Ventures: 3–5 LOIs antes do MVP), mas só funciona se outreach começou antes do código.                                                                                                                                           |
| **M2** Pacote A entregável + 1ª venda | ✅ ok                         | Done-for-you de alto toque para os primeiros 10 é canônico (Productize/Eisha Armstrong, Nate Ritter, Disco Labs). R$ 3.500 + R$ 100/mês é coerente com BR onde Trainerize/MyPTHub/Pacto cobram US$ 30–80/mês sem white-label local.                                                           |
| **M3** 1º tenant "autônomo"           | ❌ erro estrutural de framing | Buscar autonomia técnica como marco antes de 3–5 clientes pagantes é otimização precoce — Submarine virou "Frankenstein's monster" justamente por automatizar antes da repetição se manifestar. Reescreva como: "cliente nº 1 paga 3 mensalidades consecutivas sem founder no WhatsApp dele". |
| **M4** 5 tenants                      | ✅ ok                         | Número certo: é onde a repetição revela o que vira produto (regra "primeiros 100 são human-touched"; Perch/Rachel Andrew atingiu split 50/50 só com base recorrente real; Eran Galperin/Gymdesk operou solo até $40k MRR).                                                                    |
| **M5** SaaS público 10+ tenants       | 🔄 ajustar                    | "Público" exige self-service onboarding, billing assíncrono e suporte — provavelmente subestimado. Campaign Monitor levou ~2 anos do agency-tool ao SaaS pleno; Perch 4 anos; Submarine ainda híbrido.                                                                                        |

**Marco de maior risco de quebra: M2.** Não M3, nem M5. Sem venda real em ≤ 60 dias do início, o projeto vira side-project sem feedback loop e o founder cai no "estou achando lindo" (viés documentado por Channing Allen/Indie Hackers como boreout-by-uncertainty e por Pieter Levels como armadilha do solopreneur). M3 é risco secundário (escopo creep). M5 é risco distante.

---

## 2. Schema completo (~54 tabelas) no dia 1 — recomendação

**Recomendação: NÃO. Quebrar em três camadas e materializar só a primeira.**

A literatura é convergente:

- **Martin Fowler & Pramod Sadalage (Evolutionary Database Design, martinfowler.com/articles/evodb.html)**: schema evolui com a aplicação; mudanças pós-deploy são gerenciáveis com migrações disciplinadas, especialmente em greenfield. Projetos com 500+ tabelas em produção foram construídos evolutivamente.
- **YAGNI (Kent Beck/Fowler, martinfowler.com/bliki/Yagni.html)**: capacidades presumidas para o futuro são custo presente certo contra benefício futuro incerto.
- **Bytebase, Microsoft Azure SaaS Patterns, WorkOS, Launchpad**: consenso para greenfield multi-tenant bootstrapped é "Shared DB, Shared Schema com `tenant_id` em todas as tabelas relevantes" — simples e suficiente até centenas de tenants.

**Decidir dia 1 (irreversível barato agora, caro depois):**

- `tenant_id`/`org_id` em **todas** as tabelas multi-tenant, NOT NULL, com FK. Único "schema upfront" inegociável.
- **RLS (Row-Level Security)** no Postgres/Supabase desde a primeira tabela. Supabase facilita; retroativar RLS dói.
- Convenções: naming, soft-delete (`deleted_at`), `created_at/updated_at`, UUID vs serial, padrão de auditoria.

**NÃO criar no dia 1:** tabelas sem consumer (rota/tela que escreva nelas na mesma semana). "Tabela órfã" é o gold-plating mais barato de cometer com Claude Code e o mais caro depois — FKs órfãs viram ruído semântico que confunde a própria IA nas sessões seguintes.

**Tradeoff explícito:** adicionar coluna/tabela com 0–10 tenants = migração de 1 minuto. Manter 54 tabelas mentalmente coerentes solo, com IA hallucinating relações entre elas, é alto e contínuo. **Heurística: corte para 12–18 tabelas core no dia 1** (auth/tenants/users/roles + domínio fitness mínimo: alunos, anamnese, treinos, exercícios, sessões, mensagens, pagamentos, audit). Expanda JIT.

---

## 3. Features must → nice (cortar do M2)

1. **Dashboards analíticos para o profissional** — todo concorrente BR (Pacto, TreinoConectado, Trainerize) vende, mas pouco usado nos 30 primeiros dias. Sirva CSV/print.
2. **App nativo iOS/Android** — PWA cobre 90% do uso fitness B2B; Trainerize/MyPTHub levaram anos para nativo. Evite app stores na fase agência.
3. **Customização visual profunda do white-label** — logo + cor primária + subdomínio já vendem "white-label". Theme builder é buraco sem fundo.
4. **Push + WhatsApp Business API desde M2** — profissional já manda WhatsApp manual; pode entrar em M4 quando virar dor.
5. **Biblioteca própria de exercícios com vídeos** — concorrentes têm 6.000+. Você não vence aí. Permita upload + link YouTube/Vimeo; remete depois.

## 4. Features nice → must (antecipar para M2)

1. **Onboarding de aluno em 1 link** (magic link + PWA "add to home screen"). Fricção aqui derruba o aluno do seu cliente, que culpa **você**.
2. **Pix + cartão recorrente no dia da 1ª venda** — Pacto e concorrentes BR vendem por isso. Stripe ainda é caro/lento para BR; integre **Asaas, Pagar.me ou Iugu** cedo, ou ofereça boleto.
3. **LGPD operacional** (consentimento explícito, exportação, contrato de operador, DPO de contato) — B2B saúde sem isto trava venda imediatamente. Não é teatro: é gatilho de compra.
4. **Importador de planilha de alunos** — profissional tem Excel/Sheets hoje. Sem importer, setup leva 4h e venda cai. Manual no Pacote A, automatize cedo.
5. **Export/backup do cliente** (botão "exportar tudo em CSV/JSON") — clientes B2B pequenos têm trauma de "ficar refém". Derruba a objeção #1 de compra.

---

## 5. Pitfalls (10) com mitigação

| #   | Pitfall                                                                                                                                                                                       | Mitigação                                                                                                                                                          |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Falsa velocidade do AI-dev**: estudo METR/Addy Osmani (2025) mostrou devs experientes 19% **mais lentos** com Cursor/Claude em codebases reais, embora acreditassem estar 20% mais rápidos. | Cronometre 1 tarefa/semana sem IA para calibrar. Use IA livre só para 70% boilerplate; arquitetura/schema/contratos faça à mão primeiro, peça crítica à IA depois. |
| 2   | **Cognitive debt / capability regression** (ModelsLab, MIT 2025): seis meses de AI-first debug e o founder perde o músculo de debugar sozinho.                                                | 1 sessão/semana de debugging manual de bug não-urgente. Mantém capability arquitetural.                                                                            |
| 3   | **Bugs IA-gerados**: blocos de Copilot/Claude têm 2–3× mais bug-fix commits subsequentes (arXiv 2026 / Faros AI).                                                                             | Trate output IA como PR de júnior, não como o seu. Teste mínimo antes de merge mesmo solo.                                                                         |
| 4   | **Gold-plating de schema**: Claude propõe estruturas "limpas" elegantes e cria 30 tabelas mortas em uma sessão.                                                                               | Regra: nenhuma tabela nova sem rota/UI que escreva nela na mesma semana.                                                                                           |
| 5   | **Frankenstein agency-product** (Disco Labs/Submarine): customização por cliente vira código não-reusável; Gavin precisou de RBF de US$ 250k para conseguir "podar".                          | Antes de aceitar customização no Pacote A, escreva: "Isto vira feature do produto ou fica fora?" Sem resposta clara, **recuse e suba o preço**.                    |
| 6   | **Burnout silencioso** (Solo-Founder Playbook 2025–2026): 54% burnout rate, 75% ansiedade — preditor #1 de failure solo.                                                                      | Cap de horas explícito (≤ 45h/sem). 1 dia/semana off-screen. Peer group de 4–8 founders mesmo estágio (MicroConf Connect, Indie Hackers Pro).                      |
| 7   | **"Estou achando lindo" loop** (Pieter Levels, Channing Allen sobre boreout-by-uncertainty): sem usuário real, founder calibra em si mesmo.                                                   | 1 ligação/semana com cliente ou prospect, **mesmo sem ter o que mostrar**. Não é demo, é entrevista.                                                               |
| 8   | **Construir antes de vender** (Dan Martell/SaaS Academy 800+ founders, Dallas Price/Forum Ventures): métrica de validação é 3–5 LOIs/depósitos, não "MVP pronto".                             | Pré-venda no M0–M1 com Figma + entrevista. Sem 3 sim financeiros, não escreva o 2º componente.                                                                     |
| 9   | **Permanência em modo agência** (Disco Labs 10+ anos híbrido; Harvest co-existindo com Iridesco; Perch 4 anos para sair). Cash do serviço destrói foco do produto.                            | Gatilho **escrito** de corte (ver §8). Sem critério explícito, agency vira a empresa.                                                                              |
| 10  | **Multi-tenant feito errado** (WorkOS, Ariel Software): esquecer `tenant_id` em UMA query = vazamento entre tenants = morte da reputação B2B saúde.                                           | RLS desde a primeira tabela. **Teste automatizado** que tenta ler dados do tenant B autenticado como A (deve retornar 0 linhas).                                   |

---

## 6. Antipatterns específicos do contexto

### Solo + AI-assisted dev

- **Delegar arquitetura à IA**: schema, multi-tenancy, contratos LGPD, modelo de billing. Decisões irreversíveis (Bezos "one-way door") devem ser escritas por humano em ADR (Architecture Decision Record); IA só revisa.
- **Aceitar a primeira saída**: staff engineer da Sanity (6 semanas com Claude Code) — "the first attempt will be 95% garbage". Esperar 3 iterações é o normal.
- **Não manter CLAUDE.md / .cursorrules vivo**: a IA não aprende entre sessões. Toda decisão recorrente precisa virar instrução escrita ou se repete pra sempre.
- **Mocking excessivo gerado por IA** (relato Ada.cx): Claude tende a mockar tudo, escondendo bugs reais. Instrução explícita: "não mockar código interno do repo".

### LATAM / Brasil bootstrapped

- **Cobrar só em USD/cartão internacional**: BR profissional fitness paga Pix (96% dos PMEs aceitam). Stripe BR existe mas é caro e cheio de fricção para receber. Asaas/Pagar.me/Iugu/Mercado Pago são default.
- **Ignorar emissão de NFS-e** desde o Pacote A — sem nota, B2B sério não compra. Use ferramenta tipo eNotas/NFE.io.
- **LGPD como "trato depois"** — em saúde/fitness com dado biométrico/anamnese é **trato agora**, sob risco de ANPD.
- **Preço em USD para mercado interno**: R$ 100/mês está coerente; resista à pressão de subir cedo demais antes da retenção provada.
- **Suporte só em inglês ou só por email**: BR PME espera WhatsApp. Aceite que suporte humano vai consumir tempo no M2–M4.

### B2B fitness/saúde

- **Achar que profissional liberal tem RH e processo**: ele é solo como você. Onboarding precisa ser auto-explicativo em 15 min ou ele desiste e volta para o Excel.
- **Subestimar o "professor da academia"** — concorrentes (Trainerize, TreinoConectado, MyPTHub) já dominam o nicho de personal autônomo individual. O nicho mais subatendido em BR é **estúdios pequenos multi-profissional, nutricionistas, fisios autônomos** — segmente.
- **Vender features de academia (catraca, controle de acesso, biometria)**: Pacto e outros estão lá. Mantenha foco no profissional 1:1 ou estúdio até M4.
- **Conteúdo fitness genérico (vídeos, planos prontos)**: já é commodity. Diferencial está em **fluxo de trabalho do profissional**, não em conteúdo.

---

## 7. Cadência semanal — solo + AI

|         | Manhã (3–4h foco profundo)                                                                                            | Tarde (3–4h baixo foco)                                                     |
| ------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Seg** | Planning solo (30min) → escolher 1 outcome (não 1 feature). Build com IA.                                             | Outreach: 10 mensagens cold/morna a profissionais fitness/saúde BR.         |
| **Ter** | Build (Claude Code, foco máximo).                                                                                     | Build + auto-review (1h sem IA antes de commitar).                          |
| **Qua** | Build.                                                                                                                | **Ligação com 1 cliente/prospect** (mesmo 20 min) + notes.                  |
| **Qui** | Build.                                                                                                                | Conteúdo: 1 post LinkedIn ou comunidade BR (grupos de personal, CREF, CRN). |
| **Sex** | Retro solo (30 min): o que travou, decisão reversível ou não, débito assumido. **Demo end-to-end própria** (ver §10). | Admin: financeiro, contratos, LGPD, NFs, suporte clientes.                  |
| **Sáb** | Off (ou estudo, sem build).                                                                                           | Off.                                                                        |
| **Dom** | Off.                                                                                                                  | 30 min preview semana + 1 post Indie Hackers/MicroConf.                     |

A sessão de debug manual sem IA cai Ter ou Qui à tarde. Cap em ~40h úteis/semana. Solo-Founder Playbook: founders que voltam de burnout cortam de 50h para 30h **sem impacto em MRR** — o trabalho estava inflado.

---

## 8. KPIs

### Sinal (5) — pré-receita

1. **Conversas reais com ICP/semana** — meta ≥ 3 ligações com profissional fitness/saúde BR pagante. Abaixo disso = construindo no escuro.
2. **LOIs ou depósitos comprometidos** — meta 3–5 antes do M2 fechar (Forum Ventures).
3. **Tempo até 1ª venda paga** — alvo ≤ 60 dias do M0. Acima = refazer hipótese.
4. **Setup-to-active rate** do Pacote A — % de clientes pagos com aluno ativo em 14 dias. Mede se entrega valor, não se existe.
5. **Hours-to-onboard** por novo tenant — baseline manual, meta de queda mês-a-mês. É o gatilho real para flip (§9).

### Vanidade (5) — ignorar

1. **Commits, LOC, PRs/dia** — com Claude Code mentem grotescamente.
2. **Stars/forks GitHub** se repo público.
3. **Seguidores e impressões** sem clique-para-agendar.
4. **Tabelas criadas / % "schema completo" / cobertura de testes em código não-shipado**.
5. **MRR projetado** ou "pipeline ponderado" sem LOI escrito.

---

## 9. Gatilhos agência → SaaS

### Quantitativos (todos simultâneos)

- **≥ 5 tenants pagando há ≥ 3 meses** com Pacote A (consistente com Gymdesk, Campaign Monitor).
- **Setup manual caiu para ≤ 25% do tempo original** sem perda de conversão — o playbook é codificável.
- **≥ 2 tenants pedindo self-service** ou pagando alguém para operar a ferramenta.
- **MRR ≥ 2× receita média mensal de setup** — quando aluguel passa o serviço, o jogo virou. Foi o gatilho do 37signals (~2005) e do Campaign Monitor (~2008).
- **CAC orgânico ≤ 1 mês de LTV** em ao menos 1 canal — self-service tem oxigênio.

### Qualitativos

- Clientes comparam você com **Trainerize, MyPTHub, TreinoConectado**, não com "freelancer" — você virou categoria.
- Founder não lembra de cor todos os clientes — serviço não escala mais.
- Pedidos de feature **se repetem entre clientes que não se conhecem** (insight central de Basecamp e Disco Labs).
- Você está **recusando contratos** que faria 6 meses atrás para não comprometer foco — Rachel Andrew e Gavin Ballard descrevem como ponto psicológico de virada.

**Risco de permanência: alto.** Disco Labs 10+ anos híbrido, Harvest anos com Iridesco em paralelo, Perch 4 anos. Default é ficar. Sem gatilho escrito, você fica.

---

## 10. Pré-launch outreach + validação pré-código

**Comece outreach no M0, não no M2.** Convergência:

- **Dan Martell** (SaaS Academy, 800+ founders): pre-sell antes do primeiro componente; 4-step formula.
- **Dallas Price** (Forum Venture Studio): mate 85% das ideias em entrevistas, ganhe 3–5 LOIs antes do MVP.
- **Aleksa/Dealmayker**: protótipo clicável de 5–7 telas + lista warm de 10–20 nomes → 3 pagos antes de production code.
- **John Readman / Ask BOSCO (Modo25 agency-to-SaaS)**: "Não espere o produto ficar pronto para vender. Software nunca está pronto."
- **Yash Chavan / SARAL**: 5 early adopters pré-venda validou demanda e financiou desenvolvimento.

5–10 entrevistas pré-código com personal trainers, nutricionistas e fisios BR — pedindo **compromisso financeiro**, não só opinião. Se nenhum dos 10 colocar dinheiro: o produto está errado, não a venda.

---

## 11. Definição de "pronto" por marco — anti "85% done forever"

**Critério único, end-to-end:** _uma pessoa real que não é o founder completa o fluxo crítico do marco sem ele intervir, em uma sessão observada._

- **M0 pronto:** founder cobra R$ 1 real de uma conta-teste e vê o evento no Supabase. Stack instalada não conta.
- **M1 pronto:** 1 prospect agendou call via funil sem founder mandar link manualmente.
- **M2 pronto:** 1 cliente pagou R$ 3.500 **e** 1 aluno dele fez login e marcou 1 treino como concluído.
- **M3 pronto:** o cliente do M2 passou 14 dias **sem mandar mensagem** ao founder e seguiu cobrando alunos.
- **M4 pronto:** 5 clientes pagantes simultâneos; 3 deles onboarded em ≤ 50% do tempo do primeiro.
- **M5 pronto:** 1 tenant fez signup, configurou e ativou aluno **sem o founder ver o nome dele** até a notificação de pagamento.

**Débito técnico aceitável** quando explícito em `ARCHITECTURE.md` ("X está hardcoded; será refatorado quando Y") e quando não bloqueia o critério end-to-end. **Inaceitável** quando esconde risco de segurança multi-tenant ou perda de dados.

---

## 12. Decisões reversíveis vs irreversíveis com IA (Bezos framing)

| Tipo                             | Exemplos                                                                                                                                                                          | Quem decide                                                                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **One-way door (irreversíveis)** | Schema core multi-tenant; modelo de billing (per-seat vs per-tenant); contrato LGPD/operador; entidade jurídica; nome do produto; arquitetura tenant_id+RLS vs schema-per-tenant. | **Founder, escrito em ADR**. IA só revisa. Solo founders perdem meses agonizando em two-way doors e atravessam one-way doors em 90 minutos — o oposto do que deveria ser. |
| **Two-way door (reversíveis)**   | Cor da landing; copy; preço (até deal fechado); tooling secundário; nomes de componentes; pricing tier; CSS; copy do email.                                                       | **IA pode propor e implementar**. Decida em horas, ajuste depois.                                                                                                         |

Regra prática: audite as últimas 10 decisões grandes. Se >7 foram one-way, está se movendo lento demais; se <2 foram one-way, está evitando o que importa.

---

## 13. Docs vivos sem burocracia

- **`README.md` + `ARCHITECTURE.md` + `CLAUDE.md` (ou `.cursorrules`)** — único stack documental obrigatório solo.
- `CLAUDE.md` é manual da IA: convenções, padrões, "não faça X", "use Y". Atualize toda vez que pegar a IA fazendo algo errado pela 2ª vez. **É o seu maior multiplicador**.
- `ARCHITECTURE.md` lista débitos técnicos explícitos e ADRs curtos (1 parágrafo por decisão one-way).
- **Notion/Linear são cilada solo** — vira backlog-cemitério. Use 1 arquivo `BACKLOG.md` no repo + GitHub issues só para clientes pagantes.
- Loom de 5 min explicando uma decisão > página de doc que ninguém relê. Grave para você mesmo daqui a 3 meses.

---

## 14. Estimativa realista de duração (sanity check)

| Marco | Plano implícito    | Realista solo+AI BR                                    | Por quê                                                                                                         |
| ----- | ------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| M0    | 5 dias             | 3–7 dias se cortar schema upfront; 2–3 semanas se não. | OK com escopo enxuto.                                                                                           |
| M1    | "logo após M0"     | 2–6 semanas, em paralelo a M0.                         | Funil sem produto é rápido; tempo real é construir lista warm BR.                                               |
| M2    | "1ª venda"         | 4–10 semanas pós-outreach iniciar.                     | Forum Ventures / Indie Hackers: 30–90 dias é faixa típica para B2B R$ 3,5k com warm network.                    |
| M3    | "1º autônomo"      | 8–16 semanas após M2.                                  | Reformule como "cliente engajado pagando 3×", não "tecnicamente autônomo".                                      |
| M4    | "5 tenants"        | 6–12 meses do início.                                  | Gymdesk/Galperin ~24 meses solo; Perch 4 anos no split. 6 meses é otimista mas factível com warm network forte. |
| M5    | "10+ SaaS público" | 12–24 meses do início.                                 | Self-service real é projeto próprio. Pieter Levels e Galperin descrevem como "segundo zero-to-one".             |

**Cronograma total realista M0→M5: 14–24 meses solo+AI**, não 6–9. Calibrar a expectativa reduz risco do "wall do mês 3" (Solo-Founder Playbook).

---

## 15. Síntese final

1. **Sequência (✅)**: agency-first → SaaS é exatamente o caminho recomendado para B2B vertical solo bootstrapped. Não mude.
2. **Schema 54 tabelas dia 1 (❌)**: maior overengineering do plano. Corte para 12–18 core + `tenant_id` + RLS, expanda JIT.
3. **5 dias de bootstrap antes de outreach (🔄)**: inverta. Outreach em paralelo desde dia 1.
4. **M3 mal-framed (❌)**: reescreva como engajamento de cliente pagante, não propriedade técnica do produto.
5. **Prazo implícito (🔄)**: dobre as estimativas. Defenda 30–45h sustentáveis, não sprints de 70h.
6. **Falta gatilho escrito para flip agência → SaaS (🔄)**: sem critério quantitativo, o default é ficar em agência.
7. **AI-assisted sem disciplina (🔄)**: assuma 2× mais bugs em código IA-only, 1 sessão de debug manual/semana, e que velocidade percebida ≠ real.

O plano não tem erro estrutural fatal — tem ajustes de framing e calibração de expectativa. O maior risco silencioso é confundir produtividade aparente do Claude Code com progresso real de negócio. Contraveneno: **falar com gente que paga, toda semana**, mesmo quando o instinto diz "só mais essa feature".

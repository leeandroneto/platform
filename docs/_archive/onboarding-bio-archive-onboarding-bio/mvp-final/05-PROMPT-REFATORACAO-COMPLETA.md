# Prompt — refatoração do NOSSO funil de captação (vende SaaS pros 30 fundadores)

> **Pra colar em outra conversa Claude Code (Opus 4.7).** Sessão dedicada, ler tudo antes de tocar em código.
> **Modo:** product designer + writer + frontend engineer. Pesquisar exaustivamente, mockup mental, depois implementar.

---

## 🎯 Escopo CLARO (não sair disso)

### O que VAMOS refatorar — NOSSO funil de captação

São as 4 páginas que **NÓS** usamos pra captar profissionais (personal trainers/coaches) e vendê-los a assinatura beta R$27 vitalício:

1. `/lancamento` — landing pública pra tráfego frio (atrai prospect)
2. `/diagnostico` — formulário 38 perguntas que o PROFISSIONAL preenche sobre o NEGÓCIO dele
3. `/diagnostico/r/[token]` — relatório IA do NEGÓCIO do profissional
4. `/diagnostico/r/[token]/comecar` — landing oferta 30 fundadores

**Foco da refatoração:** copy + layout visual + IA (prompt e tom). Perguntas já foram cortadas (60→38) e prompt já foi v2-ado. Falta: estética revista editorial, copy "construir junto", mobile=app, visual coeso.

### O que NÃO MEXER — feature MVP (funil do PROFISSIONAL)

São as páginas que o profissional CONTRATANTE recebe quando paga, pros ALUNOS DELE usarem:

- `/[slug]` — site público do profissional
- `/[slug]/analise/...` — formulário que ALUNOS DO PROFISSIONAL preenchem (configurável por modalidade)
- `/r/[token]` — relatório personalizado pro ALUNO (IMC, calorias, macros, observações)
- Edge function `generate-report` (diferente do `generate-diagnostic`)
- Tabela `intakes` (vs `prospect_professionals`)
- Dashboard `/funil`, `/site`, `/leads`, `/clients`, settings, CRUDs — todo o backstage do profissional

**Por que não mexer:** já está em produção, funciona, profissional contratante tem expectativa. Só PRECISA ENTENDER o que é pra **vender o peixe** na refatoração do nosso funil — ou seja, a copy de `/comecar` precisa explicar com clareza o que o fundador vai receber quando assinar.

---

## ⚠️ Mentalidade obrigatória

**Esqueça tudo que existe hoje no NOSSO funil de captação.**

- Esqueça as 7 camadas / 5 atos do relatório atual (mas mantenha o schema da IA — só mude visualização)
- Esqueça as 16 sections do `/comecar` atual
- Esqueça o layout "cara de site" — Hero+Features+CTA+FAQ
- Esqueça o tom "consultor McKinsey"

A estrutura atual é fruto de iterações longas tentando "vender o produto pronto". Não serve pro MVP beta. Comece do zero com a oferta real do beta na cabeça.

**A única coisa que NÃO pode mudar:** schema do output da IA (5 campos `ato_*` no `call-anthropic.ts`) — alterar significa retreinar prompt + revalidar. Use os 5 campos mas mude a NARRATIVA visual deles.

---

## 1. O que é o produto (contexto mínimo)

**onboarding.bio** — SaaS pra personal trainers / coaches autônomos. Promessa: receber lead pré-qualificado pelo formulário inteligente + relatório IA, em vez de responder DM no Instagram.

**Posicionamento beta:** ferramenta sendo construída JUNTO com 30 fundadores. R$27/mês vitalício. Compromisso de 12 meses (R$324 total). Sem reajuste, nunca. Pós-beta vira R$67.

**Público-alvo (prospect que vê /comecar):** personal trainer pessoa-física (CREF), 25-45 anos, 2-15 anos de mercado, faturando R$5k-30k/mês, atende mulheres ou homens via musculação/corrida/pilates/CrossFit/ciclismo/natação.

**Insight central de marketing:** o prospect que chega em `/comecar` ACABOU DE EXPERIMENTAR o produto na pele. Ele preencheu o formulário, recebeu um diagnóstico do PRÓPRIO negócio dele. Sabe exatamente como o aluno dele vai sentir. Use isso. Não venda features — fale "agora que você sentiu, vamos colocar a sua cara nisso."

---

## 2. As 4 superfícies a refatorar (ESCOPO — só essas)

### 2.1. `/lancamento` — landing pública (tráfego frio)

- Atrai profissional desconhecido (Ads, indicação, redes sociais)
- Único CTA: "Faça o diagnóstico em 5 min"
- Sem oferta de preço (preço só aparece em `/comecar` pós-diagnóstico)
- Hoje: 9 sections (Hero, Problem, Method, Pricing, Products grid, FAQ, Roadmap, FinalCTA) — fadigante
- MVP: 5 sections, 1 promessa por section, prova social acima da dobra

### 2.2. `/diagnostico` — formulário 38 perguntas

- O profissional preenche sobre o NEGÓCIO dele (pessoa, escala, dores, captação, conversão, retenção, gestão)
- 38 perguntas em 9 blocos: Perfil, Escala, Dores, Captação, Presença, Conversão, Retenção, Gestão, Fechamento
- Tipos: single-choice (auto-advance), multi-choice (max_select), número, textarea, contato, consent LGPD
- 5-7 min de preenchimento, salvamento de draft, login Google opcional
- Hoje: steps verticais formal
- MVP: tom conversacional editorial (microcopy já reescrita), ritmo + transições + estado de loading da IA mais imersivo

### 2.3. `/diagnostico/r/[token]/processing` — tela de geração IA

- Loading 30-60s enquanto edge function `generate-diagnostic` chama Anthropic
- Hoje: spinner básico
- MVP: momento mágico — narrativa de "estamos analisando seu negócio", animação fluida

### 2.4. `/diagnostico/r/[token]` — relatório IA do NEGÓCIO do profissional

- A entrega de valor — justifica o cadastro
- Schema fixo do AI output (NÃO MUDAR, só mudar visualização):
  - `ato_1_conta_da_hora` — quanto a hora dele vale (receita÷horas)
  - `ato_2_gap` — distância entre estado atual e meta declarada
  - `ato_3_radar` — score nas 5 camadas (captação/relacionamento/conversão/gestão/retenção)
  - `ato_4_vazamentos` — onde está perdendo dinheiro
  - `ato_5_gargalos` — bottleneck principal
  - `sumario_executivo`, `financeiro`, `camada_*` (×5), `reconhecimento`, `benchmarks_narrativa`, `plano_acao` (2 fases × 2 ações)
- Total ~1500 palavras (prompt v2 já apertou)
- Hoje: 8 sections caóticas (Cover + MethodIntro + 5 Layers + 5 Atos + Bridge + Closing) — "consultor McKinsey"
- MVP: layout REVISTA EDITORIAL coeso, narrativa contínua, pull-quotes, números grandes, tipografia generosa, repensar "nosso método" (5 camadas pode virar outra coisa)
- Closing termina convidando pra `/comecar` (oferta beta)

### 2.5. `/diagnostico/r/[token]/comecar` — landing 30 fundadores ★ MAIOR ROI

- Token-only, máxima conversão
- Insight central: o profissional ACABOU DE EXPERIMENTAR a feature na pele (preencheu formulário, recebeu relatório). Sabe exatamente como o aluno DELE vai sentir quando passar pelo funil que ele vai contratar.
- Copy precisa ATERRISSAR:
  1. "Você acabou de viver o que seu aluno vai viver"
  2. "Aqui está o que você vai receber se virar fundador" → catálogo da feature MVP (ver §3)
  3. "Construímos junto. 30 fundadores. R$27 vitalício."
  4. CTA único pra checkout/WhatsApp
- Hoje: 16 sections espalhadas (HeroTransfer, MetricsBar, FoundersBetaSection, FormPreview, TemplateSection, SiteSection, DashboardSection, WhatsAppSection, TrafficSection, FounderProof, OfferActivation, AddonsActivation, BetaGroup, CriticalPoint, MidCta, PricingSection)
- MVP: 5-7 sections, narrativa coesa, copy aproveitando respostas do prospect (`{firstName}`, modalidade, dores citadas no formulário)

---

## 3. O que VENDER em `/comecar` — feature MVP (funil DO profissional)

> **Não vamos refatorar essas páginas.** Mas a copy de `/comecar` precisa apresentar com clareza o que o fundador vai receber. Use o inventário abaixo como FONTE pra escrever copy honesta. Tudo aqui já EXISTE em produção.

### 3.1. Funil do profissional (alunos preenchem, profissional recebe lead pronto)

**O que o profissional vai oferecer aos alunos dele:**

- **`/[slug]/analise/...`** — formulário inteligente que os ALUNOS dele preenchem (configurável por modalidade: musculação, corrida, pilates, CrossFit, ciclismo, natação)
  - 33 templates prontos por modalidade (perguntas + lógica condicional)
  - Aluno preenche em 2-3 min no celular
  - Tema visual = paleta/shape/fonte que o profissional escolheu
- **`/r/[token]`** — relatório IA personalizado pro aluno
  - IMC, % gordura corporal estimado, calorias diárias, macronutrientes
  - Observações sobre objetivo, restrições, nível atual
  - Edge function `generate-report` (Anthropic) gera em 30s
  - Aluno chega no profissional já como "cliente quase fechado"
- **`/[slug]`** — site público do profissional
  - Hero com foto + claim, sobre, credenciais, planos, depoimentos, FAQ
  - 2 CTAs: WhatsApp direto + link pro formulário do funil

### 3.2. Notificações automáticas

- **WhatsApp** ao profissional quando aluno preenche formulário (com nome + modalidade + link pro relatório do aluno)
- **Email** transactional pra cada evento (novo lead, pagamento confirmado, etc)
- **Follow-up automático** se profissional não respondeu o lead em 24h e 48h
- **Drip series** pro próprio profissional (D1, D3, D7, D10, D14 pós-cadastro)

### 3.3. Dashboard do profissional (operação diária)

- **`/leads`** — tabela de leads recebidos com filtros, status update inline, hover preview, paginação
- **`/clients`** — clientes convertidos, com sub-tabs:
  - Avaliações físicas (medidas + fotos)
  - Treinos (montagem manual de planos)
  - Transformações (fotos antes/depois com timeline)
  - Plano contratado
  - Histórico de follow-up
- **`/dashboard`** — overview de leads novos + clientes ativos + métricas básicas

### 3.4. Configuração do funil do profissional

- **`/template/[modality]`** — picker de templates por modalidade
- **`/funil`** (rota pública) → `/forms/[modality]` (folder EN) — editor com 4 tabs:
  - **ConfigTab** — escolher/trocar template ativo
  - **FormularioTab** — visualizar/reordenar/configurar visibilidade das perguntas
  - **RelatorioTab** — editar narrativa do relatório (profundidade, tom)
  - **ProximoPassoTab** — mensagem pós-relatório (texto + vídeo opcional do profissional)

### 3.5. Site editor (11 tabs configuráveis)

- **`/site`** — editor visual com preview live (desktop/mobile)
- 11 tabs: Hero, Stats, About, Ticker, Methodology, Experience, Results (fotos antes/depois), Testimonials, Plans, QuickCta, FAQ, Visibility (drag-and-drop ordering)

### 3.6. Settings (8 sub-rotas)

- `/settings/profile` — nome, bio, links personalizados
- `/settings/contact` — slug público da URL + WhatsApp
- `/settings/design` — paleta (5 curadas), shape, tipografia, dark/light → aplica em **todas as páginas públicas**
- `/settings/media` — vídeo de fundo do hero, galeria de imagens
- `/settings/notifications` — controle de alertas WhatsApp/email + histórico
- `/settings/packages` — pacotes oferecidos
- `/settings/account` — email + senha
- `/settings/subscription` — status assinatura EFI + histórico + cancelamento

### 3.7. CRUDs (rotas próprias com PlanManager/CrudManager)

- `/plans` — pacotes oferecidos no site
- `/testimonials` — depoimentos com foto+texto
- `/locations` — onde atende (academia, online, domicílio)
- `/methodology` — etapas do método de trabalho
- `/services` — serviços oferecidos
- `/faq` — perguntas frequentes
- `/credentials` — formações/CREF/certificações

### 3.8. Onboarding pós-pagamento (FRE — First-Run Experience)

- Login Google ou email/senha + verificação
- Pagamento EFI Bank (Pix recorrente ou cartão)
- Wizard guiado: escolha template → personalização (nome, slug, foto, paleta, shape, tipografia) → site preview live → ativação do formulário pra receber leads

### 3.9. Acessibilidade do que vai ser entregue (já implementado)

- WCAG 2.2 AA + AAA selectivo
- Multi-tenant com APCA-validated focus ring
- Reduced motion respeitado
- Touch targets ≥44px
- Tudo público é screen-reader friendly

### B. Onboarding do profissional (pós-pagamento — 100% funcional)

7. **Cadastro + autenticação**
   - Email/senha + Google OAuth
   - Verificação de email
   - Recuperação de senha

8. **Pagamento EFI Bank**
   - Pix recorrente
   - Cartão de crédito recorrente
   - Webhook tratando confirmação, falha, cancelamento, refund

9. **Wizard de onboarding (FRE — First-Run Experience)**
   - Setup inicial guiado pós-pagamento
   - Profissional escolhe template base por modalidade
   - Personaliza nome, slug público, foto, paleta, shape, tipografia
   - Site preview ao vivo durante o setup
   - Termina com `/aluno/dashboard` ativado e formulário pronto pra receber leads

### C. Dashboard — operação diária

10. **`/dashboard` — home**
    - Overview de leads novos, clientes ativos, métricas básicas

11. **`/leads` — gestão de leads recebidos**
    - Tabela TanStack com leads do funil
    - Filtros (status, modalidade, data), busca, paginação
    - Status update inline (novo, em conversa, ganho, perdido)
    - Detalhe do lead com respostas completas + relatório gerado
    - Hover card com preview rápido

12. **`/clients` + `/clients/[id]` — gestão de clientes (ex-leads convertidos)**
    - Lista com busca/filtros
    - Detalhe do cliente com tabs:
      - **Avaliações físicas** (`AssessmentList`) — IMC, gordura corporal, medidas, fotos
      - **Treinos** (`WorkoutEditor`) — montagem manual de planos de treino
      - **Transformações** (`TransformationEditor`) — fotos antes/depois com timeline
      - **Plano contratado** (`ClientPlanSection`) — pacote ativo, vencimento
      - **Follow-up de leads** (`LeadFollowUpEditor`) — histórico de tentativas

### D. Dashboard — Funil (configuração do formulário/relatório/próximo passo)

13. **`/template` + `/template/[modality]` + `/template/active`**
    - Picker de templates do funil por modalidade (musculação, corrida, pilates, CrossFit, ciclismo, natação)
    - Profissional escolhe 1 template base e ativa
    - Templates trazem perguntas + lógica condicional + estrutura do relatório

14. **`/forms` + `/forms/[modality]` — editor do funil ativo**
    - 4 tabs:
      - **ConfigTab** — escolher/trocar template ativo
      - **FormularioTab** — editar perguntas (visualizar, reordenar, ajustar visibilidade)
      - **RelatorioTab** — editar narrativa do relatório (configurações de profundidade, tom)
      - **ProximoPassoTab** — mensagem pós-relatório (texto + vídeo opcional do profissional)

### E. Dashboard — Site editor (11 tabs)

15. **`/site` — editor visual da landing pública `/[slug]`**
    - Preview live side-by-side (desktop/mobile toggle)
    - 11 tabs de configuração (cada section da landing):
      - **HeroTab** — claim, foto, CTA primário
      - **StatsTab** — métricas em destaque (anos atuando, alunos atendidos, etc)
      - **AboutTab** — bio + credenciais (CREF, formações)
      - **TickerTab** — banner rolante de claims
      - **MethodologyTab** — método de trabalho (4-5 etapas)
      - **ExperienceTab** — anos de mercado, tipo de público, modalidades
      - **ResultsTab** — fotos antes/depois (CRUD de cases)
      - **TestimonialsTab** — depoimentos (CRUD de quotes com foto)
      - **PlansTab** — pacotes oferecidos (preço, duração, inclusos)
      - **QuickCtaTab** — CTAs principais (WhatsApp + formulário do funil)
      - **FaqTab** — perguntas frequentes (CRUD)
      - **VisibilityTab** — toggle de quais sections aparecem + ordem (drag-and-drop)

### F. Dashboard — Settings (8 sub-rotas)

16. **`/settings/profile`** — Perfil
    - Nome de exibição, bio, informações pessoais
    - Links personalizados (até 5: YouTube, Calendly, portfólio etc — aparecem na landing)

17. **`/settings/contact`** — Contato
    - **Slug público** (URL `/[slug]`)
    - Número de WhatsApp (recebe notificações + serve de CTA público)

18. **`/settings/design`** — Aparência
    - **Paleta** (cores) — 5 paletas curadas multi-tenant
    - **Shape** — rounded/sharp/soft (raios de borda)
    - **Tipografia** — fontes do sistema
    - **Tema** — dark/light
    - Aplicado em **todas as páginas públicas**: site `/[slug]`, formulário, relatório

19. **`/settings/media`** — Mídia
    - **Vídeo de fundo do hero** (do site público)
    - **Galeria de imagens** do site (logo, avatar, cover, fotos do trabalho)

20. **`/settings/notifications` + `/settings/notifications/history`**
    - Controle de quais alertas o profissional recebe (WhatsApp + email)
    - Histórico de notificações enviadas

21. **`/settings/packages`** — pacotes oferecidos no site (CRUD via PlanManager)

22. **`/settings/account`** — Conta
    - Mudar email
    - Mudar senha

23. **`/settings/subscription`** — Plano
    - Status da assinatura EFI (ativo, atraso, cancelado)
    - Histórico de pagamentos
    - Cancelar assinatura

### G. Dashboard — CRUDs (rotas próprias)

24. **`/plans` — PlanManager** — pacotes oferecidos no site público
25. **`/testimonials` — TestimonialManager** — depoimentos com foto+texto
26. **`/locations` — LocationManager** — endereços onde atende (academia, online, domicílio)
27. **`/methodology` — MethodologyManager** — etapas do método de trabalho
28. **`/services` — ServiceManager** — serviços oferecidos
29. **`/faq` — FaqManager** — perguntas frequentes do site
30. **`/credentials` — CredentialManager** — formações, certificações, CREF

### H. Notificações automáticas funcionando

31. **Email** (transactional via Resend):
    - Bem-vindo ao cadastrar
    - Confirmação de email
    - Reset de senha
    - Pagamento confirmado
    - Pagamento falhou
    - Cancelamento de assinatura
    - Refund confirmado
    - Novo lead recebido (com link pro relatório)
    - Drip series (D1, D3, D7, D10, D14 pós-cadastro)
    - DSR — direito do titular (LGPD): export, delete, received

32. **WhatsApp** (Z-API edge function `send-whatsapp`):
    - Notificação ao profissional quando lead preenche formulário
    - Follow-up reminders automáticos (24h, 48h se ele não respondeu o lead)

33. **Crons agendados:**
    - `drip-emails` — envia drip series
    - `weekly-digest` — resumo semanal
    - `follow-up-reminders` — lembretes de leads não respondidos

### I. Acessibilidade (já implementado)

- WCAG 2.2 AA + AAA selectivo
- Skip links em 7 layouts
- Focus ring multi-tenant validado APCA
- Reduced motion respeitado
- Screen reader labels
- Touch targets ≥44px

---

### NÃO PROMETER (pra ninguém, em lugar nenhum):

Tudo o que está abaixo é roadmap "fundadores votam o que vem", **nunca** como feature confirmada com data:

- Treinos automáticos gerados por IA pra cada cliente
- Cobrança recorrente DOS ALUNOS (apenas o checkout do SaaS pro profissional existe)
- Agenda integrada com lembretes pros alunos
- Comunidade entre alunos do mesmo profissional
- App mobile nativo (hoje é web responsivo)
- Integração com Strava/Garmin/Polar/Apple Health
- Avaliação física profunda além das perguntas do formulário
- Anamnese clínica
- Vídeos de execução de exercícios
- Plano nutricional automático (ferramenta menciona macros mas não monta plano)
- Gestão financeira completa do profissional (controla pagamento da assinatura, não o financeiro do negócio dele)
- Multi-profissional / equipe / academia (hoje é single-pro)
- Marketplace público de profissionais
- Sistema de avaliação/rating dos profissionais

→ Use linguagem **"vamos construir junto"**, **"sua escolha define"**, **"30 fundadores votam o próximo recurso"**. Nunca "lançamos X em Y dias" / "incluso na próxima versão".

---

### Como o MVP gera valor (resumo pra entender o pitch)

**Pro profissional:**

- Lead chega pré-qualificado (não DM genérica)
- Lead recebe diagnóstico de presente — autoridade antes da venda
- Notificação WhatsApp imediata + lembretes automáticos
- Site profissional pronto sem precisar de designer
- Tudo configurável em ~30 min de onboarding

**Pro lead do profissional:**

- 5 min preenchendo um formulário inteligente (não chato)
- Recebe relatório IA personalizado em 30s — vê o nível do serviço antes de pagar
- Já chega no WhatsApp do profissional como cliente quase fechado

**Pro fundador (oferta 30 vagas):**

- R$27/mês vitalício × 12 meses (R$324 total)
- Voz nas próximas features (sua dor vira feature)
- Acompanhamento direto do fundador (Leandro) por WhatsApp

---

## (Seção movida — escopo já está em §2.1-2.5 acima)

---

## 4. Princípios de design

### Visual — estilo revista editorial, não site corporativo

- Tipografia generosa (já tem `--font-geist` Sans + `--font-geist-mono` Mono)
- Espaços brancos amplos (`max-w-[80ch]`, `py-20 md:py-28`)
- Pull-quotes, números grandes, primeira letra capitular ocasional
- Imagens/ilustrações editoriais (não mockup de tela)
- Contraste forte entre títulos e corpo
- Sem grids de "cards de feature" — refatorar pra blocos narrativos

### Mobile = app, não site

- Bottom-sheet (shadcn `Drawer`) em vez de modais
- Sticky CTA bottom em forms
- Header colapsável ao scroll
- Haptic feedback em ações primárias (`lib/utils/haptic.ts` existe)
- Touch targets 44px+
- Safe area awareness

### Motion (já tem Motion 12 — `motion/react`)

- Fade + slide-up na entrada de cada section (`whileInView` com `viewport={{ once: true }}`)
- Transições fluidas entre steps do formulário
- Cuidado com `repeat:Infinity` — sempre wrappar com `useReducedMotion()`
- Micro-interações em CTAs (scale, glow)

### Tipografia (use componentes, não classes)

- `<Heading level={1-6}>` — semantic + style
- `<Text variant="body|body-large|body-small|micro|lead">`
- `<Eyebrow variant="default|accent|mono|mono-xs">` — labels pequenos uppercase
- Heroic typography permitido com `// eslint-disable-next-line token-bypass/no-tailwind-bypass -- PADRAO-VALIDADO §2.3` quando necessário

### Cores — sempre via tokens CSS

- `var(--brand-text)`, `var(--brand-text-muted)`, `var(--brand-bg)`, `var(--brand-bg-elevated)`, `var(--brand-border)`
- `var(--color-accent)` — paleta do profissional (multi-tenant)
- Nunca hex/rgb inline

---

## 5. Antes de codar, LEIA TUDO

### Docs estratégicos

1. `CLAUDE.md` — contexto geral, stack, regras
2. `docs/mvp-final/README.md` + `01-formulario-mapa.md` + `02-relatorio-fluxo.md` + `03-decisoes.md` + `04-copy-recomendacao.md`
3. `docs/core/architecture.md` (se existir) — camadas, regras
4. `docs/core/decisions.md` — decisões fechadas
5. `docs/plano/REPLAN-DESAFIOS.md` — direção atual

### Estado atual mapeado

- Schema do banco: `lib/types/database.ts`
- Perguntas (38 ativas): `prospect_questions` table — query: `SELECT id, block, title, type, options FROM prospect_questions WHERE is_active = true ORDER BY block_order, order_index`
- Edge function: `supabase/functions/generate-diagnostic/` (mapping correto pra A1-I4)
- Prompt IA v2: `ai_prompts.generate-diagnostic.system` (já reescrito ~1500 palavras)

### Componentes existentes a refatorar

- **Formulário:** `components/form/audit/AuditForm.tsx`, `QuestionScreen.tsx`, `QuestionStep.tsx`, `_steps/_primitives/*`
- **Relatório:** `components/report/audit/AuditReport.tsx`, `_sections/*`, `_analysis/Ato*Section.tsx`, `_shared/FloatingNav.tsx`
- **/comecar:** `components/diagnostic-activation/ActivationPage.tsx` (orchestrator) + `_sections/*` (16 arquivos — provavelmente cortar 10)
- **/lancamento:** `components/launch/LaunchPage.tsx` + `_sections/*` (9 arquivos)

### i18n

- Tudo em `messages/pt-BR.json`
- Namespaces relevantes: `publicFunnel.activation` (/comecar), `publicFunnel.launch` (/lancamento), `publicFunnel.diagnostic` (formulário), `auditReport` (relatório — pode estar incompleto, criar conforme precisar)

### Padrões do projeto

- Camadas estritas: `lib/domain/` (puro), `lib/data/` (Supabase), `lib/hooks/`, `app/<route>/actions.ts`
- shadcn new-york dark-first em `components/ui/`
- Motion 12 (`motion/react`, nunca `framer-motion`)
- Tailwind v4.2 — tokens em `app/globals.css` `@theme`
- Sem `tailwind.config.ts`

---

## 6. Processo recomendado (não pule etapas)

### Fase 1 — Pesquisa (1-2h, sem código)

**Estude o público:**

1. Lê as 38 perguntas ativas no banco. Entenda o que cada bloco revela.
2. Lê 2-3 relatórios reais que a IA já gerou (`SELECT report_result FROM prospect_professionals WHERE report_result IS NOT NULL LIMIT 3`). Veja a qualidade da narrativa.
3. Pesquise referências externas:
   - Sites de revista editorial (The New Yorker, Wired, Bloomberg longreads)
   - Landing pages SaaS beta (e.g. early-stage YCombinator companies)
   - Apps de diagnóstico/auto-conhecimento (Pattern, Co-Star, Calm)
   - Notion, Linear, Vercel — pra estética minimal+confidente

**Produza um doc curto** em `docs/mvp-final/06-research-notes.md` com:

- 5-10 referências visuais (links + 1 frase do que rouba de cada)
- Decisão de tom (1 paragraph)
- Decisão de "nosso método" — mantém 5 camadas? renomeia? sumiu?
- Decisão de layout do relatório (revista? journal? scrollytelling?)

### Fase 2 — Estrutura nova (2h, ainda sem código)

**Documente em `docs/mvp-final/07-arquitetura-nova.md`:**

- Sitemap das 4 superfícies (lista de sections novas, ordem)
- Wireframe textual de cada section (que copy, que motion, que prova)
- Tipografia hierarchy (h1, h2, h3 por section)
- Decisão de quais sections antigas sobrevivem vs deletar

**Aprovação do fundador:** este doc ANTES de implementar. Se ele recusar, refaça antes de tocar código.

### Fase 3 — Implementação (8-15h, código de verdade)

**Ordem sugerida (cada uma vira PR separado):**

1. Hero + estrutura nova de uma das superfícies (a de maior ROI: `/comecar`)
2. Sections seguintes da mesma superfície
3. Repete pra próxima superfície
4. Por último: motion polish + a11y check + audit:wcag-\* todos passando

**Cada section nova:**

- TSX componente em `_sections/`
- i18n keys em `messages/pt-BR.json`
- Sem hardcoded PT em JSX (lint `jsx-no-literals` enforça)
- Tokens CSS sempre
- Motion respeitando `useReducedMotion()`
- `<main id="main-content">` no layout (já tem)

**Sections antigas:**

- NÃO DELETAR arquivos imediatamente — só remover do orchestrator
- Confirmar via knip que viraram dead code
- Deletar em PR separado depois de validação visual

### Fase 4 — Validação (1-2h)

- Preencher 1 formulário ponta-a-ponta como prospect novo
- Avaliar relatório gerado pela IA — bate com a estética nova?
- Avaliar `/comecar` personalizada — conversão sente?
- Mobile (375px Chrome DevTools) e desktop (1280)
- 5 paletas × 3 shapes (multi-tenant — testar `/[slug]?palette=lime&shape=rounded`)

---

## 7. Restrições não-negociáveis

1. **Escopo:** SÓ as 4 páginas listadas em §2 (`/lancamento`, `/diagnostico`, `/diagnostico/r/[token]`, `/diagnostico/r/[token]/comecar`). NÃO mexer em `/[slug]/*`, `/r/[token]` (do aluno), edge `generate-report`, dashboard, settings, CRUDs, onboarding pago, edge functions de email/whatsapp.
2. **Sem mudança no schema do AI output** (`ato_1_conta_da_hora` … `ato_5_gargalos` em `call-anthropic.ts`). Mudar = retreinar.
3. **Sem prometer features futuras** com data ou commitment. Roadmap é "fundadores votam o que vem", não "lançamos X em 90 dias".
4. **Não inventar features.** Use a lista de §3 como única fonte do que existe.
5. **Sem destruir o que já funciona em produção:** pagamento EFI, edge functions deployadas, dashboard, funil do profissional.
6. **Sem inventar perguntas no formulário.** Já cortou de 60→38 (soft-delete via `is_active`). Não cortar mais.
7. **Sempre em PT-BR** (i18n via next-intl). Sem hardcoded em JSX.
8. **Acessibilidade:** todos os audits têm que passar (`pnpm audit:h1`, `pnpm audit:wcag-*`). Não regredir.

---

## 8. Entregáveis esperados

1. `docs/mvp-final/06-research-notes.md` — pesquisa + decisões de tom/layout
2. `docs/mvp-final/07-arquitetura-nova.md` — wireframes + sitemap + aprovação do fundador
3. PRs implementados — 1 por superfície (4 PRs no total) ou consolidado se fizer sentido
4. `docs/mvp-final/03-decisoes.md` atualizado — log do que foi cravado
5. Screenshots before/after de cada superfície em `docs/mvp-final/screenshots/`

---

## 9. Critérios de aceite

- Visualmente parece **revista editorial**, não SaaS landing genérico
- Mobile sente como app, não como site
- Copy faz prospect entender em 30s: "ah, é uma ferramenta nova sendo construída junto, R$27 pra sempre, 30 vagas"
- `/comecar` aproveita as respostas do prospect na copy (nome, modalidade, principais dores)
- Relatório IA cabe em leitura de 3-4 min sem scroll infinito
- Formulário preenchido em 5-7 min sem fadiga
- Zero menção a features que não existem
- `pnpm dev` roda, todas as audits passam
- Build verde (`pnpm build`)

---

## 10. Comando inicial pra colar na próxima conversa

> Cole isso depois que abrir conversa nova:

```
Você vai refatorar o NOSSO funil de captação do onboarding.bio — as 4 páginas que
NÓS usamos pra captar profissionais (personal trainers/coaches) e vender a assinatura
beta R$27 vitalício pros 30 fundadores:

1. /lancamento — landing fria pública
2. /diagnostico — formulário 38 perguntas que o PROFISSIONAL preenche
3. /diagnostico/r/[token] — relatório IA do NEGÓCIO do profissional
4. /diagnostico/r/[token]/comecar — landing oferta 30 fundadores (★ maior ROI)

NÃO mexer em /[slug], /[slug]/analise, /r/[token], dashboard, settings, CRUDs, onboarding
pago, edge generate-report. Essas são FEATURE MVP (funil DO profissional pros alunos
DELE) — já em produção, não tocar. Você só precisa entender o que elas FAZEM
pra escrever copy honesta vendendo o peixe em /comecar.

Mentalidade: ESQUEÇA o layout/copy atual das 4 páginas. Comece do zero estilo
revista editorial, mobile=app, tom "construir junto" beta.

Leia agora (NESTA ORDEM):
1. docs/mvp-final/05-PROMPT-REFATORACAO-COMPLETA.md (este doc — contexto + escopo + inventário)
2. docs/mvp-final/README.md
3. docs/mvp-final/01-formulario-mapa.md (38 perguntas atuais)
4. docs/mvp-final/02-relatorio-fluxo.md (fluxo IA)
5. docs/mvp-final/03-decisoes.md (já aplicado: prompt v2, microcopy, mapping fix)
6. docs/mvp-final/04-copy-recomendacao.md (princípios de copy)
7. CLAUDE.md

Depois: rode SQL pra ver as 38 perguntas + 2 relatórios reais já gerados pela IA.
Depois: pesquisa visual (revista editorial, landing high-conversion beta SaaS).
Depois: produza docs/mvp-final/06-research-notes.md com decisões.
Depois: produza docs/mvp-final/07-arquitetura-nova.md com wireframes das 4 páginas.
PARE pra fundador aprovar o doc 07 antes de codar nada.

Após aprovação: implemente PR por PR (1 página por vez), começando por /comecar
(maior ROI de conversão). Cada PR: code + i18n + tests passando + audits passando.

Use Opus 4.7 (você já é). Motion 12 (motion/react) com useReducedMotion().
shadcn Drawer/Sheet pra mobile-app feel. Tipografia generosa estilo revista.
Sem inventar features. Sem prometer roadmap. Beta R$27 vitalício, 30 vagas.

Comece lendo os docs na ordem.
```

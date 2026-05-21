# Resumo completo da sessão — 2026-05-19

> **Tipo:** síntese curada da sessão de 12h (07:27 → 19:26 UTC). Não é ADR nem plano —
> é o "qualquer pessoa que abrir amanhã consegue continuar" da sessão.
> Fonte bruta: `docs/_archive/2026-05-19-conversation-evolution.md` (459 KB, 266 entradas).
> Reflexão paralela (estado mental + insights): `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md`.

**Sessão:** `026a894c-0976-4745-8d41-5524e405ac37` (compactada) → continuada em `62d430db`.
**Working tree:** branch `main`, 4 arquivos modificados, 1 untracked (pesquisa 26 dispatching).

---

## 1. Visão geral em 4 linhas

1. Infra externa Fase 1 **fechada** (GitHub + Vercel + Resend + Upstash + AI Gateway + CLI).
2. **3 migrations aplicadas** (0015 forms_align + 0016 structural_reserves + 0017 cross_table_tenant_consistency) → 48 tabelas no `lib/contracts/database.ts`.
3. **Pesquisa 24 (Page Engine, 67 KB) + Pesquisa 25 (AI Reports, 64 KB)** concluídas e lidas em profundidade.
4. **Pesquisa 26 (design system vibes)** disparada (~30min Claude Desktop, ainda aguardando) após reconhecimento de que "13 paletas isoladas" é insuficiente pra white-label premium.

Bloco crítico (não-óbvio): a sessão tentou "harmonizar 3 features" (form+page+report) num walkthrough de 12 decisões — **9 fecharam, 3 não** — e na decisão #10 o user identificou que **o framing inteiro estava errado** (pesquisas 23+24+25 são UM sistema = funil agência, não 3 features). Trabalho de harmonização **pausado**, retomada instruída em `§0.2.1` do plano + memória.

---

## 2. O que foi entregue concretamente

### 2.1 Infra externa fechada hoje

| Componente            | Estado                                        | Notas                                              |
| --------------------- | --------------------------------------------- | -------------------------------------------------- |
| **GitHub**            | `leeandroneto/platform` Hobby                 | Branch protection skipped (JIT Pro)                |
| **Vercel project**    | `platform` em **gru1 (São Paulo)** Hobby Free | Auto-deploy on push to main                        |
| **Supabase**          | Free plan em produção                         | HaveIBeenPwned Pro-only (JIT)                      |
| **Domain**            | `desafit.app` apex canonical, `www` redirect  | Vercel DNS                                         |
| **Resend**            | Domínio verified DKIM/SPF/DMARC               | API key em Vercel + `.env.local`                   |
| **Upstash Redis**     | sa-east-1 regional                            | REST URL + token em Vercel + `.env.local`          |
| **Vercel AI Gateway** | Key gerada no dashboard                       | Em `.env.local`; NÃO em Vercel ainda (JIT Etapa 3) |
| **Vercel CLI local**  | v54.1.0                                       | Autenticado                                        |

**Bugs descobertos durante setup (memória técnica útil):**

- `vercel env add NAME preview` precisa `--git-branch` mas CLI v54 não aceita wildcard. Workaround: pular Preview, popular JIT.
- `.vercel/project.json` ≠ `.vercel/repo.json` (CLI usa o primeiro pra env operations).
- `vercel domains add desafit.app --force` não move entre projetos. Único caminho: dashboard.

### 2.2 Migrations aplicadas hoje (sequenciais via MCP)

| #        | Nome                             | O que faz                                                                                                                                                                                                                | Por quê                                                                                                                                         |
| -------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **0015** | `forms_align_research_23`        | Rename `capture_*` → `form_*` + 25 colunas (`kind` enum, `vertical`, `status`, `logic_rules`, `bot_score`, `ip_address_hashed`, `idempotency_key`, `share_token`, etc) + cria `form_versions` espelhando `page_versions` | Pesquisa 23 fechou vocabulário canônico — alinhar antes de codar Form Engine. Grep confirmou zero consumers → rename seguro.                    |
| **0016** | `structural_reserves`            | `tenants.lifecycle_state` enum + `audit_log` + `notifications` + `tenant_webhooks` + `webhook_deliveries`                                                                                                                | Reserva estrutural pré-Fase 1: lifecycle (provisioning/active/suspended/pending_deletion/deleted), audit append-only via RLS, webhooks outbound |
| **0017** | `cross_table_tenant_consistency` | Função `assert_tenant_match()` + **11 triggers** em tabelas críticas (enrollments, modules, components, component_schedules, form_submissions, form_versions, form_reports, leads, page_versions, webhook_deliveries)    | Defesa em profundidade (achado 4 da auditoria RLS) — garante que FKs respeitem boundary cross-tenant mesmo se RLS falhar                        |

Antes desta sessão já estavam aplicadas migrations **0001-0014** (incluindo a `0013_security_hardening_v2` consolidada que veio de conversa paralela).

### 2.3 Trabalho de docs

| Doc                                                                                                                          | Estado                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `docs/research/24-page-engine-architecture.md`                                                                               | ✅ pronta (67 KB)                                                                          |
| `docs/research/25-ai-reports-architecture.md`                                                                                | ✅ pronta (64 KB)                                                                          |
| `docs/research/26-design-system-vibes.md`                                                                                    | ⏳ dispatching (~30min Claude Desktop) — arquivo `compass_artifact_wf-...` pendente rename |
| `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md`                                                                                    | §0.2 + §0.2.1 atualizado (RESET documentado, 50+ decisões cravadas)                        |
| `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md`                                                                   | Reflexão em curso (11 seções)                                                              |
| `CHANGELOG.md`                                                                                                               | Entry [Unreleased]                                                                         |
| Memórias `feedback_frescura_filter.md`, `feedback_research_briefing_intent.md`, rewrite `project_harmonizacao_3_features.md` | Criadas                                                                                    |

---

## 3. Decisões arquiteturais cravadas hoje (bloco a bloco)

Cada decisão segue o formato: **decisão · contexto · mecanismo · referências · importância**.

### 3.1 Sequência de construção do funil: form → IA → relatório → landing

**Decisão.** Construir nessa ordem (inversa do fluxo do usuário final).

**Contexto.** A intuição inicial era começar pela landing porque é o que o lead vê primeiro. Mas o user perguntou se não fazia mais sentido inverter, e a análise confirmou.

**Mecanismo.** Cada etapa entrega valor isolado testável:

- Form sem landing já gera lead capturado em DB ✅
- IA sem display já popula assessment row ✅
- Display (relatório) sem landing já acessível por link direto ✅
- Landing por último valida funil end-to-end

**Referências.** Discussão `07:30 → 07:38`. Plano §1.0. Pesquisa 23 §5 confirmou.

**Importância.** Sem isso, landing nasceria sem dados reais pra exibir (precisaria mockar). Inversão deixa cada etapa testável isolada — chave pra solo dev.

---

### 3.2 Dois motores totalmente separados — Form Engine + Page Engine

**Decisão.** Forms ≠ Pages. **Motores isolados** (código, tabelas, prompts, renderers). Compartilham só helpers genéricos (`publish`, `duplicate`, `lockVersion`) em `lib/engines/base.ts` + registro central em `lib/engines/registry.ts`. **Adicionar motor 3+ exige ADR.**

**Contexto.** User perguntou "um motor único pra forms e pages?" — análise comparou players sérios (Typeform/Tally/Fillout vs Webflow/Framer/Builder.io). Resposta: ninguém respeitável tenta motor único. **Plasmic é o único híbrido sério e mantém os dois motores totalmente separados internamente.**

**Mecanismo.**

- **Form Engine:** estrutura **linear** `FormDefinition = { version, kind, vertical, locale, steps[], logic[], welcome?, thankYou, theme? }`. Step = `{ id, ref, title?, blocks[], layout: 'single-question'|'multi-question' }`. Block = discriminated union por `type`. **Lógica condicional vive em `logic[]` ao lado dos steps, não dentro deles.**
- **Page Engine:** estrutura **árvore recursiva** `PageSpec = { version, kind, root: PageBlock }` onde `PageBlock = { id, type, props, children: PageBlock[] }`. Recursão via `z.lazy`. **Tree depth max 5 + `assertUniqueIds()`.**

**Referências.** Pesquisa 23 §1.2, pesquisa 24 §1.1. Plano §1.1+§1.2. Mensagem-âncora USER #1035 (`08:57`).

**Importância (one-way door).** Forms são lineares com regras; pages são árvore. Editor visual de cada é radicalmente diferente. IA gera muito melhor quando o "molde" reflete a natureza. Unificar = ferramenta ruim em ambos.

---

### 3.3 Form Engine polimórfico via `forms.kind` enum

**Decisão.** **UM Form Engine** cobre todos os tipos via coluna `forms.kind` enum + prompt-template próprio por kind. Mesmo renderer, mesmo editor.

**Kinds catalogados (no banco):** `lead_capture`, `onboarding`, `assessment`, `anamnesis`, `survey`, `brief` (vibe coding input), `check_in`, `evaluation`, `prospect`.

**Contexto.** Tentação de criar "motor de captação", "motor de onboarding", "motor de anamnese" separados. **Errado.** "Onboarding", "captação", "anamnese" não têm estruturas diferentes — têm copy diferente, quantidade típica de perguntas diferente, prompt de IA diferente. Motor por tipo = repetir renderer/editor/validação/branching/persistência 6 vezes = bug garantido.

**Mecanismo.**

```sql
CREATE TYPE form_kind AS ENUM (
  'lead_capture','onboarding','assessment','anamnesis',
  'survey','brief','check_in','evaluation','prospect'
);

ALTER TABLE forms ADD COLUMN kind form_kind NOT NULL;
```

Mudar tipo = mudar `kind` + prompt-template. **Não toca renderer.**

**Referências.** Plano §3.3. Pesquisa 23 §3. ADR-0041 pendente.

**Importância.** Decide se a infra escala pra 10+ tipos de form ou trava em 3. **One-way door** — vocabulário e schema codificam essa premissa.

---

### 3.4 Report NÃO é engine separado — é `pages.kind='report'` com AI fill

**Decisão.** Eliminar conceito "Report Engine". Report = **Page Engine** + um valor `'report'` adicionado ao `page_kind` enum + AI fill content via prompt linkado.

**Contexto.** A meio caminho da harmonização, o user perguntou "report é PDF ou página?" e ficou claro:

- Lead vê relatório → relatório leva pra página de vendas → converte → fecha pacote
- É **funil comercial**, não "B2B report formal"
- PDF pode ser **opcional** (anexo email), mas output principal é **página**

**Mecanismo.**

```sql
ALTER TYPE page_kind ADD VALUE 'report';

ALTER TABLE forms
  ADD COLUMN report_template_id uuid NULL REFERENCES page_templates(id),
  ADD COLUMN report_prompt_version_id uuid NULL REFERENCES ai_prompt_versions(id);
```

- Form com `report_template_id NULL` = não gera report (form comum)
- Form com `report_template_id NOT NULL` = lead que submete recebe report (manual ou automático)
- Cada combinação `form_kind + template + prompt` tem sua **intenção** curada
- IA não escreve estrutura — preenche placeholders dentro de blocos do template
- Visual sempre vem de template; profissional escolhe template, **não cria on-the-fly**

**Referências.** Discussão `18:43 → 18:50`. Plano §0.2 decisões adicionais. Mensagem-âncora USER #1427.

**Importância.** Simplifica drasticamente o plano. **Mata "Report Engine"** como conceito separado. Reusa schema/RPCs do Page Engine. Mantém o reuso form→page sem motor novo.

---

### 3.5 Catálogo completo de engines (10 + 6 + 6 = 22 engines previstos)

**Decisão.** Enumerar TODOS os engines do produto agora — sem codar, só catalogar. Cada engine novo exige **ADR + atualização do catálogo**.

**Contexto.** USER #1085 (`11:22`): "será que é bom já tentar prever todos os tipos de engines que teremos, pelo menos os que são certeza? por exemplo engine de criar programas (com todas aquelas variações de componentes possíveis), push, emails, automações, módulos, etc. E engines internas para uso apenas da agência/saas vs dos profissionais etc."

**Mecanismo.** 3 categorias:

#### A. Engines de conteúdo (profissional do tenant cria/edita)

| Engine                       | Spec shape                                                                       | Quando entra                                          | Relação com outros                                                        |
| ---------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| **Form Engine**              | Linear `steps[]+blocks[]+logic[]`                                                | Fase 1 (agora)                                        | Alimenta Report; aciona Automation; binda Domain                          |
| **Page Engine**              | Árvore recursiva                                                                 | Fase 1 mínimo, Fase 2 full                            | Renderiza forms via embed; consome Media; pode chamar Automation          |
| **Program Engine**           | Híbrida — estrutura (módulos/semanas/sessões) + blocos (exercícios/aulas/lições) | Fase 3 (Pacote A)                                     | Consome Forms (onboarding/check-in/assessment); gera Reports; aciona Push |
| **Module Engine**            | Sub-unidade do Program. Linear (ordered lessons)                                 | Junto com Program                                     | Polimórfico por vertical (treino, aula, lição)                            |
| **Email Engine**             | Template estruturado (header/body/footer com merge tags)                         | Fase 1 mínimo (transacional report); Fase 2 marketing | Consome dados de Form/Program/Report                                      |
| **Push Notification Engine** | Template curto com merge tags + segmentação                                      | Fase 2-3                                              | Acionada por Automation                                                   |
| **Automation Engine**        | Flow declarativo: gatilho → condição → ações (Zapier-like)                       | Fase 2-3                                              | Conecta TODOS os outros engines                                           |
| **Report Engine**            | ~~Removido~~ — é Page Engine + AI fill                                           | —                                                     | Ver §3.4                                                                  |
| **Document Engine**          | Long-form (Notion-like) — ebooks, materiais educativos                           | Fase 3+                                               | Standalone; pode ser parte de Program                                     |
| **Chatbot Engine**           | Conversa scriptada (script + branches) — atendimento cliente                     | Fase 3+                                               | Híbrido com IA generativa; alimenta CRM                                   |

#### B. Engines internas (agência/SaaS opera — não exposta a profissional)

| Engine                                                                                     | Quando entra |
| ------------------------------------------------------------------------------------------ | ------------ |
| **Tenant Provisioning** (workflow declarativo cria tenant + seed forms/pages/copy/paleta)  | Fase 1       |
| **White-label Config** (form interno paleta+logo+copy+domain — é instância de Form Engine) | Fase 1       |
| **Plan/Pricing Manager** (form interno + lógica de entitlements)                           | Fase 1-2     |
| **Onboarding Wizard** (Page Engine + Form Engine combinados)                               | Fase 2       |
| **Analytics Dashboard Config** (Page Engine + cards de métrica)                            | Fase 2-3     |
| **Billing/Stripe Integration** (workflow + webhook handlers — sem spec próprio)            | Fase 1-2     |

#### C. Engines de processamento (backend, sem UI)

| Engine              | Tecnologia                                        | Status             |
| ------------------- | ------------------------------------------------- | ------------------ |
| **Workflow Engine** | Vercel WDK (`'use workflow'`, GA 16-abr-2026)     | Disponível, Fase 1 |
| **Queue Engine**    | Vercel Queues                                     | Disponível, Fase 1 |
| **Cron Engine**     | Vercel Cron                                       | Disponível, Fase 1 |
| **Webhook In/Out**  | Custom + HMAC                                     | Construir Fase 1   |
| **Storage Engine**  | Vercel Blob + Supabase Storage                    | Disponível, Fase 1 |
| **AI Routing**      | Vercel AI Gateway + nosso router (Haiku classify) | Construir Fase 1   |

**Referências.** Plano #26 (`docs/blueprint/21-engine-catalog.md` pendente). Resposta-âncora em `.tmp_1085_full.txt`.

**Importância.** Sem catálogo, primeira decisão de schema cross-engine (data binding, naming, RLS) bate em parede. **Prever ≠ construir** — só constrói quando feature precisar.

---

### 3.6 Reuso interno vs externo via flag `scope`

**Decisão.** **Mesmo motor (Form Engine, Page Engine), instâncias diferentes via `scope` flag** + RLS condicional. Não duplicar código.

**Contexto.** USER #1085 separou explicitamente "engines internas pra uso só da agência/saas vs dos profissionais." Aspectos que mudam: RLS (cross-tenant vs tenant-bound), UI (`/admin/*` vs `/painel/*`), chat IA (opera SOBRE tenants vs DENTRO de um tenant), billing, catálogo de blocks (superset vs subset).

**Mecanismo.**

```sql
ALTER TABLE forms ADD COLUMN scope text NOT NULL DEFAULT 'tenant'
  CHECK (scope IN ('tenant', 'internal', 'platform'));

CREATE POLICY "tenant_scope_select" ON forms FOR SELECT
USING (
  CASE scope
    WHEN 'tenant'   THEN tenant_id = current_tenant_id()
    WHEN 'internal' THEN auth.jwt() ->> 'role' = 'agency_admin'
    WHEN 'platform' THEN auth.jwt() ->> 'role' = 'platform_admin'
  END
);
```

- `scope='tenant'` → forms que profissional cria pros clientes (público, onboarding)
- `scope='internal'` → forms que agência usa pra configurar tenant (white-label setup, plano, seed)
- `scope='platform'` → forms de meta-configuração (suporte, admin de admins)

UI escolhe qual scope mostrar baseado na role do usuário logado.

**Referências.** Resposta `.tmp_1085_full.txt §3`. Mensagem-âncora USER #1085.

**Importância.** Sem isso, agência precisaria de **outro sistema** pra configurar tenants. Com flag, vibe coding agência usa o mesmo Form Engine que o profissional usará na Fase 2.

---

### 3.7 Data bindings declarativos no spec do form

**Decisão.** Cada block do form pode ter `bindings[]` opcional que mapeia respostas pra colunas de tabelas de domínio. **Sem migration extra** — JSONB do `form_versions.definition` já comporta.

**Contexto.** USER #1085: "profissional quer criar um formulario para captar fotos de antes e depois (anets no onboarding provavelmente). como vai saber que aquela imagem deve ir na tabela x, no campo z?"

**Mecanismo.**

```jsonc
{
  "id": "block-abc",
  "type": "file-upload",
  "ref": "before_photo",
  "label": "Foto antes",
  "acceptedMimeTypes": ["image/*"],
  "bindings": [
    {
      "target_table": "client_profiles",
      "target_field": "before_photo_url",
      "value_extractor": "blob_url",
    },
  ],
}
```

Pós-submit, step do Workflow `apply_bindings` lê o spec, aplica cada `bindings[]` no banco.

**Domain catalog** = código TS em `lib/contracts/domain-catalog.ts` (NÃO tabela). IA consulta pra:

1. **Sugerir bindings** ao criar pergunta ("quer que essa foto popule o perfil do cliente também?")
2. **Detectar duplicação** ("já existe campo 'peso' no perfil — usar esse mesmo?")
3. **Gerar relatório** consumindo dados de várias tabelas

Skeleton inicial: `client_profile`, `tenant_brand`. Expandir conforme features.

**Referências.** `.tmp_1085_full.txt §2`. Pesquisa 25 §3. Plano §3.6 #25.

**Importância (estratégica).**

- **Hoje (Fase 1):** Form Engine grava em `form_responses` (sempre). `bindings[]` pode estar vazio.
- **Amanhã (Fase 2):** ativam-se bindings → forms começam a alimentar `client_profile`.
- **Fase 3:** Program Engine consome `client_profile` → personalização end-to-end **sem código novo**.

É o que torna a infra de form útil pra Pacote A sem refactor.

---

### 3.8 Fases canônicas — Fase 1 / Fase 2 / Fase 3 (renomeia H1/H2/H3)

**Decisão.** Abandonar nomenclatura "H1/H2/H3" que eu inventei. Usar:

| Fase                                      | Quem opera                              | O que faz                                                                                   |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Fase 1 — Agência opera**                | Vocês (agência)                         | Montam funil de cada cliente. Cliente (profissional) ainda não mexe sozinho                 |
| **Fase 2 — Self-service do profissional** | Profissional do tenant                  | Entra no painel, cria/edita forms/pages sozinho via chat IA + (eventualmente) editor visual |
| **Fase 3 — Pacote A (cliente final usa)** | Cliente do profissional (atleta, aluno) | Preenche os forms que o profissional configurou. Não cria nada                              |

A ordem é **forçada**: Fase 2 só faz sentido depois que vocês validaram a infra rodando Fase 1 por dentro.

**Não confundir com roadmap M0→M1→M2→M3.** Roadmap = sprints temporais. Fases = modos de operação que coexistem na arquitetura.

**Referências.** Discussão `09:27 → 09:30`. Plano §0 visão. Mensagem-âncora USER #1041.

**Importância.** "H1/H2/H3" era jargão sem significado → confusão na própria sessão. Renomeação alinha vocabulário do plano com vocabulário da memória.

---

### 3.9 Lego principle — infra dos 3 modos desde o dia 1

**Decisão.** Schema, RLS, contracts, hooks **suportam Fase 1 + Fase 2 + Fase 3 desde o primeiro commit**. Fase 1 apenas **USA** o modo agência. Templates, tone, cost cap, multi-tenant — tudo fica como pesquisa 25 propôs. O que muda é o **seed inicial** (1 template em vez de 3).

**Contexto.** USER #1417 (`18:12`): "templates GA? resuma mais e seja mais objetivo, linguagem simples, vamos ter as duas maneiras nao apenas uma, precisamos suportar as duas, como se fosse um lego."

Eu havia proposto cortar `share_token`/`share_expires_at`/`tone` enum "porque agência opera Fase 1". User corrigiu: **stripping arquitetura ≠ princípio "mil passos à frente"**. O princípio diz o oposto: infra suporta os 2 modos **desde dia 1**.

**Mecanismo (Lego ready, Fase 1 só usa o subset agência):**

- `form_reports.share_token text` — token aleatório permanente (Lego)
- `form_reports.share_revoked_at timestamptz NULL` — coluna existe, default NULL (Lego)
- `form_reports.share_expires_at timestamptz NULL` — coluna existe (Lego)
- `tenant.tone` enum com valores Fase 2+ (Lego)
- **Seed Fase 1:** 1 template `form_template` musculação + 1 `ai_prompt_version` musculação — não 3-6 templates GA
- **PULAR:** view counters / tabela views (frescura — ver §3.10)

**Referências.** Discussão `18:12 → 18:18`. Plano §0.2 RESET. Memória `feedback_mil_passos_a_frente.md`.

**Importância.** **Único princípio que evita refactor maciço na transição Fase 1 → Fase 2.** Sem Lego, "agência opera primeiro" vira justificativa pra hardcode → quando self-service chega, reescreve tudo.

---

### 3.10 Filtro "frescura" — sem analytics/scoring sem demanda

**Decisão.** Recusar dia 0 qualquer feature de:

- Lead scoring (firmographic+behavioral+intent breakdown)
- A/B testing automation
- View counters em tabelas
- Sentiment analysis
- Dashboards de priorização
- "Checar se é bot" Deep Analysis (BotID basic basta)

**Contexto.** USER #1427 (`18:43`): "decisao 10: checar se é bot? rapaz isso nao é coisa de se pensar agora, olha como estamos deixando as coisas complexas sem necessidade real, cade o principio do jit? de nao sair criando coisas sem precisao ainda. daqui a pouco temos um banco de dados de 400 tabelas e nenhuma feature."

Eu trouxe BotID Deep Analysis ($1/1k) + Vercel Workflow 7-steps pipeline + lead score 30/50/20 porque pesquisa 25 trouxe. **Repassei sem filtrar.** JIT puro: sem volume real, sem demanda, sem âncora.

**Mecanismo.** Memória `feedback_frescura_filter.md` criada. Triagem manual basta enquanto for solo dev + ≤10 tenants.

**Referências.** Discussão `18:43 → 18:50`. Memória `feedback_frescura_filter.md`.

**Importância.** **Sem esse filtro, código vira "best-practices SaaS B2B genérico" e perde 4-6 semanas/mês construindo coisa que ninguém vai usar.** Fundamental pra solo dev.

---

### 3.11 JIT com âncora — toda decisão adiada precisa de trigger + playbook

**Decisão.** Adiar uma decisão (JIT) **exige**:

1. **Trigger explícito** — lint, hook, rule path-loaded, ou critério mensurável ("quando 3º profissional pedir form custom")
2. **Playbook curto** — apontando pra onde a resposta está documentada (pesquisa, ADR, plano)

Sem âncora, JIT vira "Claude futuro re-deduz tudo do zero".

**Contexto.** Memória pré-existente `feedback_jit_anchoring.md` consolidada hoje com casos concretos. Toda rule path-loaded `.claude/rules/*.md` ganhou uma seção **"Condição de revisitar"**.

**Mecanismo.** Rules afetadas: i18n, contrast, shadcn-zone, design-tokens, brand, entitlements. Cada uma diz: "esta rule vale até X; quando Y acontecer, revisitar e atualizar".

**Referências.** Memória `feedback_jit_anchoring.md`. Rules `.claude/rules/*.md`.

**Importância.** Sem playbook, JIT é só procrastinação travestida de pragmatismo.

---

### 3.12 Mil passos à frente — feature = instância de infra

**Decisão.** Nada hardcoded. Cada feature é **instância de uma infra generalizada** que, na Fase 2, vira editor visual + chat IA assistente + ferramenta self-service.

**Contexto.** USER #997 e USER #1000 cravaram: "nada é hardcoded desde o dia zero, todas as perguntas, vao morar no banco de dados em formato ja estruturado com aquela pesquisa de template e versionamento que paginas de vendas/captação ja tem (hotmart like)."

**Mecanismo.** Para cada peça:

1. Quem cria? (agência / profissional / cliente / IA)
2. Que dados ficam no DB vs hardcoded?
3. Como vira editor visual depois?
4. Como vira chat IA?
5. Que campos podem virar bindings de domínio?

Se a resposta de qualquer das 5 é "depois refatora", **redesenha agora**.

**Referências.** Memória `feedback_mil_passos_a_frente.md`. Mensagem-âncora USER #1000.

**Importância.** **Princípio raiz** que justifica catálogo+registry+spec, scope flag, bindings, kind enum, templates versionados. Sem ele, plano vira hardcode-driven.

---

### 3.13 Versionamento Hotmart-like — snapshot-only

**Decisão.** **Snapshot-only**, sem "update available". Publicar uma versão = `INSERT` imutável em `_versions`. Edits forçam nova versão. Submissions/views ficam pinned na versão que viam quando submeteram/visualizaram.

**Contexto.** USER #997 pediu pesquisa específica sobre "Hotmart-like template versioning". Stream B do agent dispatching no Claude Desktop validou: snapshot é o que players sérios fazem (Notion polymorphic blocks, BlockSuite versioned schemas, Sanity 3-state, Builder.io backward-compat).

**Mecanismo.**

- `forms` (working) ↔ `form_versions` (snapshot imutável). `forms.current_version_id` aponta pra versão ativa.
- Mesmo pattern em `pages` ↔ `page_versions`, `page_templates`, `form_templates`.
- `lockVersionAfterFirstUse(engineKind, versionId)` — quando 1ª submission/view, marca `locked=true`; edits forçam nova versão.
- RPC `publish_page` atomic com `for update` lock; trigger `block_page_versions_update` bloqueia UPDATE em `page_versions` (snapshot imutável).
- `pages.etag` (uuid string regenerado em cada update) + `pages.first_viewed_at` (lock pós-1ª view — antes disso draft pode ser "destruído").

**Referências.** Plano §1.3 + §2.1. Pesquisa 24 §12. Pesquisa 23 §6. ADR equivalente cravado.

**Importância.** **One-way door.** Snapshot-only é o que permite editor visual + IA editor + multi-editor sem corromper estado vivo. Implementar diferente = retrabalho grande na Fase 2.

---

### 3.14 Definição "motor" = dimensão de dado pra decisão downstream

**Decisão.** **Motor não é lista fixa**. É **meta-framework**: dimensão de dado que precisa ser capturada pra alimentar uma decisão downstream. A IA pode entrevistar o criador do form pra descobrir essas dimensões.

**Contexto.** USER #1000 (`08:07`): "os 8 motores que temos no onboarding-bio sao para as modalidades que tinhamos la. precisamos encontrar um sistema que encontre os motores para qualquer area."

Eu havia proposto reciclar os 8 motores fitness sem questionar — **erro reconhecido**.

**Mecanismo lógico universal pra descobrir motores em qualquer area:**

1. Qual o **output esperado** do form? (lead qualificado? relatório IA? perfil de aluno? scope de projeto?)
2. Quais **decisões downstream** dependem dos dados? (priorizar lead? gerar plano? customizar app? aprovar inscrição?)
3. Pra cada decisão, **qual a dimensão mínima** que preciso saber?
4. Cada dimensão = 1 motor.
5. **A IA pode entrevistar** o criador do form pra descobrir as dimensões.

**Exemplos aplicados:**

| Form                                       | Output                                     | Motores prováveis                                                                                |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Funil agência** (lead Pacote A)          | Lead qualificado pra ligação de venda      | INTENT · FIT (vertical/tamanho) · MOMENTO/URGÊNCIA · ORÇAMENTO · CANAL · AUTORIDADE/SOCIAL PROOF |
| **Onboarding pós-pago** (cliente Pacote A) | Programa configurado + branding + conteúdo | MARCA/IDENTIDADE · VERTICAL/MÉTODO · PÚBLICO · CONTEÚDO · OPERAÇÃO                               |

Nada a ver com TDEE/PAR-Q dos 8 do onboarding-bio.

**Referências.** Plano §0.2. Mensagem-âncora USER #1000. Erro documentado em `project_harmonizacao_3_features.md`.

**Importância.** Sem essa definição, qualquer feature de form vira "copia/cola dos 8 motores fitness" — engessa o produto pra além de fitness.

---

### 3.15 Vibe coding híbrido (estrutura conversacional) — Fase 1

**Decisão.** Não "vibe coding puro" (chat aberto que adivinha tudo) nem "meta-form" rígido. **Híbrido**: chat IA classifica pedido + faz perguntas estruturadas DENTRO do chat.

**Contexto.** USER #1041 perguntou direto: "o que é vibe coding minimo e vibe coding maximo? oferecer primeiro vibe coding com edição via texto pelo profissional ou dar uma ferramenta visual onde ele clica e edita sozinho?"

**Comparação cravada:**

| Modo                                                       | Custo eng  | Tempo     | Quem usa bem               |
| ---------------------------------------------------------- | ---------- | --------- | -------------------------- |
| **Vibe coding puro** (chat livre)                          | médio      | 1-2 sem   | qualquer um                |
| **Meta-form** (form com 5-8 perguntas fixas)               | baixo      | 3-5 dias  | qualquer um                |
| **Híbrido (vibe coding + perguntas estruturadas no chat)** | médio-alto | 1.5-2 sem | qualquer um                |
| **Editor visual drag-drop**                                | alto       | 3-6 sem   | profissional com paciência |

**Mecanismo (Fase 1, ~1-2 sem implementação):**

1. **Profissional abre chat** no painel admin (ou clica "Criar com IA")
2. **IA classifica pedido** (Haiku 4.5) — engine? kind? (form? page? form de captação? de onboarding?)
3. **IA coleta contexto via chat** — N perguntas (3 simples, 8 complexos). Pula óbvio se profissional já deu contexto
4. **Opcional:** IA lê referência externa (página de programa, doc) pra sugerir perguntas mais relevantes
5. **IA gera spec completo** via `generateText({ output: Output.object({ FormDefinition }) })` (Sonnet 4.6)
6. **Sistema valida spec** automaticamente (Zod). Retry 3× se inválido
7. **Preview na tela** — iframe mobile + desktop
8. Profissional escolhe: **aceitar e publicar** | **ajustar via chat** ("muda pergunta 3", "remove pergunta 5") IA aplica diff | **regenerar com outro tom**
9. **Publicar** → spec vira versão imutável + URL pública ativa

**Edição via chat (Fase 1) vence editor visual (Fase 2) por:**

- Custo eng: médio (chat existe pronto em libs) vs alto (drag-drop + undo/redo + side panel + autosave + a11y + mobile)
- Tempo: 1-2 sem vs 3-6 sem
- Cobertura real: 70-80% das edições ("muda pergunta", "remove", "torna obrigatória")

**Referências.** Pesquisa 23 §8. Plano §3.3 (chat). Mensagem-âncora USER #1041.

**Importância.** **Sem essa decisão, perderia 3-6 semanas construindo editor visual antes de validar que profissional usa.** Chat é validação cheap.

---

### 3.16 Editor visual — Fase 2 com Liveblocks Storage + LWW

**Decisão.** Editor visual real fica pra Fase 2. Quando chegar, base **Liveblocks Storage** com **LWW (last-write-wins) + ETag + 409 Conflict** resolve dia 1 sem precisar Yjs/CRDT.

**Threshold pra migrar pra Liveblocks Yjs (collaborative):**

- ≥5 conflitos/dia OR
- demanda "cursor do colega" >1×/semana OR
- ≥3 tenants Enterprise pagantes

**Contexto.** Pesquisa 24 detalhou. Fase 1 é single-editor (você ou profissional editando isolado). Conflict cross-editor é raro até equipe crescer.

**Stack futuro confirmado:** `@dnd-kit` v6.x (drag-drop) + `xyflow/react` (branching visual) + `zundo` (undo/redo).

**Referências.** Pesquisa 24 §3-§4. Plano "deferred features".

**Importância.** Decide **forma da migration** quando Fase 2 chegar. LWW dia 1 = sem retrabalho cross-tenant; Yjs JIT quando conflito real aparecer.

---

### 3.17 Catálogos como fonte de verdade pra IA

**Decisão.** Toda IA generativa do produto consulta **catálogos declarativos** antes de gerar. Catálogos vivem em código TS (não tabela) — versionados em PR + revisão. Atualizar catálogo + ADR antes de codar.

**Mecanismo.** 3 catálogos:

| Catálogo                        | Vive em                                                         | Conteúdo                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Domain Catalog**              | `lib/contracts/domain-catalog.ts`                               | Tabelas+campos bindáveis (`client_profile`, `tenant_brand`, futuro `program_session`...). Semantics + units + descriptions |
| **Block Catalog (Form + Page)** | Embedded em `lib/contracts/form-blocks/<kind>.ts` (prop `card`) | Card estruturado: `purpose`, `when_to_use`, `common_bindings`, `anti_patterns`, `relations`                                |
| **Engine Catalog**              | `docs/blueprint/21-engine-catalog.md`                           | Mapa de engines (status, propósito, tabelas, relações)                                                                     |

**Prompt catalog loader** (`lib/ai/catalog-loader.ts`) carrega tudo isso como contexto pra prompts.

**Referências.** Plano §3.6 #25-#31. Pesquisa 23 §10. Pesquisa 25 §11.

**Importância.** **Quando block/tabela/engine não está catalogado, IA não enxerga.** Catálogo é a interface entre código e IA — sem ele, IA gera spec inválido ou bind errado.

---

### 3.18 Operations API tipada = MCP-ready desde dia 1

**Decisão.** ~15 operations Form Engine + Page Engine viram **tools tipadas** em `lib/engines/operations/*.ts` com Zod input/output + descrição rica. **Fase 1 chama via REST**; Fase 2 wrap em MCP server **sem refactor** — só `mcp.tool(opSchema)`.

**Mecanismo.**

```
lib/mcp/
  server.ts           — MCP server scaffold (closed em prod)
  registry.ts         — auto-registra operations de lib/engines/operations/
  middleware.ts       — auth + rate limit (compartilhado com REST)

app/api/mcp/
  [transport]/route.ts — POST/GET handlers (HTTP streamable)
```

Sem URL pública até Fase 2. Validação interna em dev. **Custo extra ~3h** durante Etapa 0b — antes era "Fase 2 separada" no plano, agora é dia 1.

**Operations Form Engine v1 (9 tools, sem `delete_*` por safety):** `create_form`, `list_forms`, `get_form`, `update_form`, `publish_form`, `get_submissions`, `analyze_submissions`, `generate_form_from_brief`, `list_templates`.

**Operations Page Engine v1 (12 tools):** `createPage`, `listPages`, `getPage`, `updatePage`, `duplicatePage`, `publishPage`, `archivePage`, `getPageVersions`, `revertPageVersion`, `generatePageFromBrief`, `editPageViaDiff`, `getPageAnalytics` (futuro).

**Diferenciação competitiva:** **MCP server próprio em Smithery.ai** = profissional avançado pode usar Claude Desktop/ChatGPT pra criar forms no nosso sistema sem abrir o painel. Tally/Typeform/Jotform não têm.

**Referências.** Pesquisa 23 §9. Plano §3.6 #28. Reflexão `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md §5`.

**Importância.** **Decide se a infra escala pra agentic dev/agência ou trava em REST.** "Wrap depois" sem design tipado dá errado.

---

### 3.19 Storage canônico — Vercel Blob (reports) + Supabase Storage (uploads cliente)

**Decisão.** Pesquisa mencionou ambos. Misturar = caos. Divisão por responsabilidade:

| Storage              | Uso                                              | Razão                                                                  |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| **Vercel Blob**      | Reports (PDF gerado), assets internos da agência | Mais barato, integra com Workflow, não precisa de RLS pra docs gerados |
| **Supabase Storage** | Uploads do cliente (fotos, docs anexados)        | RLS integrado nativo, MIME validation, bucket folder-scoped por tenant |

**Referências.** Plano §3.4. Pesquisa 25 §6.

**Importância.** Decidir antes de Etapa 4 evita migration de buckets depois.

---

### 3.20 Vocabulário canônico cruzado com naming rule

**Decisão.** **18 termos canônicos** da pesquisa 23 cruzados com **16 termos banidos** da `.claude/rules/naming.md`. Resultado consolidado:

**Aceito (forms domain):** `form`, `block`, `step`, `version`, `submission`, `response`, `report`, `logic rule`, `kind`, `template`, `definition`, `published`, `draft`, `theme`, `welcome`, `thankYou`.

**Banido em código (replace_all):**

- Domain: `field` → `block`, `question` → `input block`, `answer` → `response`, `revision` → `version`, `branch` (em código) → `logic rule`
- Negócio: `student`, `trainer`, `intake`, `wizard`, `prospect`, `diagnostic`, `customization`, `workspace`, `framer-motion`, `aluno` (folder)
- One-way: `prompt` é OK, mas evitar `assistant`/`gpt`/`claude` no nome de tabela (provider-neutral)

**Referências.** `.claude/rules/naming.md` (16 termos) + pesquisa 23 §2 (18 termos). Plano §6.

**Importância.** **One-way door enorme.** Renomear schema depois custa migrations + atualização cross-file. Cravar dia 1.

---

### 3.21 Stack travado pós-pesquisas

**Decisão.** **Não bumpar major sem ADR** o seguinte:

Next 16 (App Router, Turbopack, RSC default, `proxy.ts`) · React 19 · Tailwind v4 (`@theme` OKLCH) · shadcn new-york dark-first · Motion 12 (`motion/react`, NUNCA `framer-motion`) · Supabase `@supabase/ssr` 0.10 · Zod 4 + RHF 7 · next-intl 4 · pnpm 10 · Geist · Vitest · Playwright · **Storybook 10 (`@storybook/nextjs-vite`, ADR-0038 supersede Ladle)** · Serwist (`@serwist/turbopack`, ADR-0014).

**Adições/atualizações da pesquisa 24+25:**

- Next 16.2 estabilizou `cacheTag` + `cacheLife` (sem prefixo `unstable_`)
- Zod 4 **bug conhecido**: `discriminatedUnion + lazy` quebrado → usar `z.union()` ordenado
- AI SDK v6: `generateObject` / `streamObject` **deprecated** → `generateText({ output: Output.object({ schema }) })` + `streamText`
- Vercel AI Gateway plain `provider/model` strings — não `@ai-sdk/anthropic` direto
- Anthropic: Sonnet 4.6 ($3/$15), Haiku 4.5 ($1/$5), Opus 4.7 ($5/$25 + 35% "token armadilha")
- Vercel Workflow (WDK) **GA 16-abr-2026** via `'use workflow'`
- Vercel Blob, Vercel BotID, Vercel Queues (todas disponíveis)
- JSON Patch RFC 6902 + EASE encoding (-31% tokens vs full regen) pra edits IA

**Referências.** CLAUDE.md "Stack travado". Pesquisas 24+25.

---

### 3.22 Componentes/Wrappers — zona quarentenada (ADR-0040)

**Decisão (fechamento dia 0 cravado em ADR-0040).**

- **3 wrappers obrigatórios:** `AppForm`, `AppToast`, `AppEntitlementGate`
- **3 typography primitives obrigatórios:** `Heading`, `Text`, `Eyebrow` (+ Metric, DataCell, Code, Section, Stack, Container, VisuallyHidden, EmptyState, Divider já existem)
- **47 shadcn primitives quarantenados** em `components/ui/*` — Edit **bloqueado** (hook + lint), canal único: `npx shadcn add` via Bash
- **Wrappers JIT** em `components/app-*.tsx` SÓ com **valor agregado** (passthrough proibido — Vercel Academy)
- **Logo wordmark único** em componente `<Logo>` — zero inline (00-PROJETO §9)
- **Brand assets zero inline:** lint bloqueia `"desafit"` literal fora de allowlist

**Atenção (do dia hoje):**

- `Field` component shadcn (Out 2025) substitui wrappers custom de Label+Error+Description — eliminar 4-5 wrappers planejados
- `Muted` typography primitive existe; pode ser substituído por `Text` com variant — **revisitar**

**Referências.** ADR-0040 §A-§E. `.claude/rules/shadcn-zone.md`.

**Importância.** Zona quarentenada = pré-requisito pra editor visual + IA generation. Sem ela, customização de tenant vira fork de primitive shadcn.

---

### 3.23 i18n inline na `FormDefinition` (CONFLITO com rule)

**Decisão pendente (não-cravada).** Pesquisa 23 propõe **copy inline** no spec (não chaves `t()`) porque profissional personaliza copy individualmente; next-intl só pro **chrome do app**. Conflita com `.claude/rules/i18n.md` ("`t()` desde primeira string").

**Resolução proposta:**

- `next-intl` cobre chrome (botões, validações genéricas: "Próximo/Voltar/Enviar")
- Copy de blocks (perguntas, descrições, statements) fica **inline** na `FormDefinition`
- `FormDefinition` ganha campo `translations: { 'en': { 'block-id': {...} } }` overlay quando precisar multi-locale form

**Onde cravar:** próxima ADR ou blueprint 20 (i18n-strategy).

**Referências.** Pesquisa 23 §11. `.claude/rules/i18n.md` "Condição de revisitar".

---

### 3.24 APCA Silver gate + tokens OKLCH

**Decisão (dia 0, ratificada hoje).**

- Body text Lc ≥ **75**
- Large text Lc ≥ **60**
- Non-text (icons, focus rings) Lc ≥ **45**
- Gate em script `pnpm token:audit` (executado em `prebuild`)
- Validação `apca-w3` + `culori` (OKLCH → sRGB pra cálculo)

**Referências.** `.claude/rules/contrast.md` ADR-0040 §L. Plano dia 0.

---

### 3.25 Design system — inflexão estratégica (PAUSADO até pesquisa 26)

**Decisão preliminar (não-cravada).** Mover de "13 paletas" para **3 dimensões separadas curadas**:

- **Template ("estilo")** = bundle de tokens estruturais (typography 12-15 variants, shapes, spacing, motion, density, photography style, whitespace)
- **Palette** = cores aplicadas por cima
- **Content** = copy + imagens

**Contexto.** USER #1331 (`15:17`): "estamos criando uma plataforma de criação de páginas, criação de apps... design é fundamental, é a essência. 78 marcas para escolher ou inspirar." USER #1335 (`15:40`): "o que criamos foram paletas de cores e não templates. templates são um conjunto de decisões juntas, o certo seria o profissional escolher um template de 'estilo' e aplicar uma paleta de cores."

**Reconhecimento:** estávamos pensando em "13 paletas" como dimensão única de design. Insuficiente pra white-label premium. Profissional não-designer precisa **modelo composicional**.

**8 arquetipos candidatos extraídos das 78 marcas em `docs/references/design-systems/`:**

1. Premium minimalista (Linear, Vercel, Apple)
2. Editorial acolhedor (Sanity, Notion, Stripe)
3. Fintech sofisticado (Stripe, Revolut, Wise)
4. Dev-tools dark (Supabase, Cursor, Warp)
5. Performance atlético (Nike, Whoop-style, Tesla) — provável fit musculação
6. Builder ousado (Webflow, Framer, Figma)
7. Wellness orgânico (Mastercard cream, Clay) — provável fit yoga
8. AI-conversational (Claude, Cohere, Anthropic)

**Vertical sugere template inicial:**

- musculação → "Performance atlético"
- yoga → "Wellness orgânico"
- idiomas → "Editorial acolhedor"

**Pesquisa 26 (dispatching) cobre 25 perguntas:** template × palette × content separation · arquetipos extraídos · typography rica (Apple-style 14 variants) · photo handling (aspect ratios, crop, fallback, AI matching from reference) · mobile vs desktop philosophy per template · PWA-specific design · shadcn primitives variants per template · vibe matching engine (foto/texto/brand referência → IA escolhe) · antifragility (combinações proibidas).

**O que NÃO muda após pesquisa 26:**

- Schema dos 3 motores (forms, pages, programs)
- Migrations 0001-0017 aplicadas
- Stack travado
- 47 shadcn primitives quarantenados (ADR-0040)
- Wrapper pattern (3 obrigatórios + JIT)
- Tokens OKLCH + APCA Silver gate + RLS arquitetura
- 13 paletas atuais → viram **dimensão color sobre templates**

**O que provavelmente muda:**

- Etapa 0b (catálogos) ganha conceito "template" ANTES de domain catalog
- §3 primitivos ganha `TemplateSpec` como entidade primária
- Vibe coding (Etapa 3) ganha "vibe matching" via foto/brand referência
- Storybook ganha "template gallery"

**Referências.** Reflexão `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md §4`. Pesquisa 26 (dispatching). Mensagens-âncora USER #1331, #1332, #1335.

---

### 3.26 Skills/MCPs decididos

| Item                                                                            | Decisão                       | Razão                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| **Impeccable** (`/audit` + `/polish`)                                           | ✅ Instalado                  | Anti-AI-generic. Reduz "wallpaper component" e "blow-it-up-with-AI shimmer" |
| **frontend-design (oficial Anthropic)**                                         | ✅ Já listado                 | Framework macro antes de codar UI                                           |
| **Vercel Analytics**                                                            | ✅ Habilitado (1 click, free) | Built-in, zero custo                                                        |
| **Axe Accessibility MCP**                                                       | ⏳ JIT                        | Quando APCA não pegar ARIA                                                  |
| **v0-mcp**                                                                      | ⏳ JIT                        | Gerar variants em massa                                                     |
| **Sentry**                                                                      | ⏳ JIT Etapa 6                | Free 5k/mês                                                                 |
| **PostHog**                                                                     | ⏳ JIT Etapa 3+               | Free 1M events/mês                                                          |
| **Builder.io MCP / Webflow MCP / Tailwind MCP (não existe) / Style Dictionary** | ❌ Não instalar               | Atrito > valor                                                              |

**Referências.** Reflexão `§6` + `§7`. Plano §9.

---

## 4. Princípios cravados (memória persistente — valem sempre)

Estes vão pra `memory/*.md` e re-injetam em toda sessão futura:

1. **Mil passos à frente** — feature = instância de infra, nunca hardcoded · `feedback_mil_passos_a_frente.md`
2. **Lego** — infra suporta agência + self-service desde dia 1; Fase 1 USA modo agência · `project_plano_dia_1.md`
3. **Vibe coding primeiro, editor visual depois**
4. **JIT com âncora** — trigger + playbook senão Claude futuro re-deduz · `feedback_jit_anchoring.md`
5. **Filtro frescura** — sem analytics/scoring/dashboards sem demanda · `feedback_frescura_filter.md`
6. **Padrão público primeiro** — W3C/Material 3/iOS HIG/lib madura antes de codar custom (00-PROJETO §8 hierarquia 4 níveis)
7. **Critério premium** — privilegiar recurso atual de ponta (React 19, Tailwind v4, Cache Components, Motion 12, OKLCH, APCA)
8. **Mobile-first 100%** inclusive painel profissional (90% opera só mobile, viewport 375px touch real)
9. **5 roles fixos** — admin/professional/client/staff/influencer. Nunca expandir sem pivot
10. **EN no DB + código + folders; PT-BR na URL pública e UI via rewrites + next-intl**
11. **Catálogos = fonte de verdade pra IA** (`domain-catalog.ts` + block `card` + `engine-catalog.md`)
12. **SECDEF que aceita `p_tenant_id` SEMPRE valida JWT** — "trust the JWT not the args" · `feedback_secdef_validates_tenant_id.md`
13. **pnpm add não é paralelizável** — race em package.json, serializar mesmo se user insistir · `feedback_pnpm_parallel_add.md`
14. **Pesquisas complementares são UM sistema** — não silos · `feedback_research_briefing_intent.md`
15. **Brand resolve em runtime via `useBrand()` / `getBrandByHost`** — NUNCA hardcoded "desafit" no código

---

## 5. Pesquisas — estado e síntese

### 5.1 Pesquisa 23 (Forms, base) — lida e integrada

- 1158 linhas de pesquisa autoritativa
- 5 decisões fechadas pós-pesquisa
- Schema 100% pronto
- Migration 0015 aplicada alinhando schema

### 5.2 Pesquisa 24 (Page Engine, 67 KB) — lida, decisões cravadas

Highlights pra integrar:

- Tree depth max 5 + `assertUniqueIds()`; 10 page kinds com `KIND_CAPABILITIES` gate (pixels/conversion per kind: `legal/maintenance` → robots noindex, sem pixels; `thank-you` usa server-side conversion Meta CAPI + Google CAPI com dedupe `event_id`)
- RPC `publish_page` atomic com `for update` lock; trigger bloqueia UPDATE em `page_versions`
- `pages.etag` (uuid regenerado) + `pages.first_viewed_at` (locks pós-1ª view)
- `cacheTag()` limites: 128 tags × 256 chars; cross-engine via `revalidateTag('form:${id}')` — pages embedando forms invalidam junto sem rastreamento
- 12 operations MCP-ready
- Defesa 3-camadas: token → tenant + role + RLS
- JSON Patch fallback ~10%
- A/B testing: tabela `page_experiments` + cookie `anon_id` 90d sticky
- Satori subset CSS (sem grid/calc/CSS vars complexos)
- **7 blocks MVP:** `section`, `hero`, `feature-grid`, `testimonial-grid`, `pricing-cards`, `cta`, `embed-form`
- Players matrix decision: clonar **Hotmart pages** (BR + B2B + infoprodutor; sem multi-tenant exposto = oceano azul) + **Builder.io** (JSON tree headless dev-first MCP separados Publish/Hybrid) + **Framer Wireframer** (UX chat→preview)
- Templates por vertical Fase 1: 4-5 templates × 4 verticais ≈ 16-20 templates (curados manualmente + ajustados por IA)
- Threshold pra migrar Liveblocks Yjs: ≥5 conflitos/dia OR demanda "cursor do colega" >1× OR ≥3 tenants Enterprise pagantes
- Posicionamento: "Hotmart Pages para agências" (oceano azul = multi-tenant + headless + AI + MCP)

### 5.3 Pesquisa 25 (AI Reports, 64 KB) — lida, decisões cravadas com filtro frescura aplicado depois

Highlights pra integrar:

- `generateObject` deprecated → `Output.object()`
- ReportContent shape: `{ sections: [executive_summary, findings, recommendations, action_items, next_steps, disclaimers] }` discriminated union por kind
- Disclaimers determinísticos
- Vercel Workflow GA
- Schema `ai_prompt_versions` completo + 3 templates GA Fase 1
- `tenant.tone` enum (formal/casual/motivacional)
- Mínimo 1024 tokens cache Sonnet
- Retries table; **fallback estático SEMPRE envia** (não bloquear se IA falhar)
- OKLCH→sRGB culori
- Resend DKIM/DMARC obrigatório
- Share link **HMAC 30d** (com filtro frescura: `expires_at` é coluna NULL default — Lego)
- ~~Lead score 30/50/20~~ (frescura — JIT)
- ~~Eval 180 fixtures~~ (gerar amostra menor pra Fase 1)
- Constitutional principles
- Retention 24m
- Geolocation `@vercel/functions`
- Workflow limites + DLQ child workflow
- Sentry tags: `tenant_id, vertical, submission_id, model_used` em cada step error
- Alert Slack se `overall_score` cai >10% WoW OR `safety < 9` em qualquer caso → release block
- LLM-as-judge: promptfoo Fase 1 (open source YAML CI free); ~~30 goldens × 6 verticais = 180 fixtures~~ → começar com 10×1 Fase 1; weekly cron `/api/internal/evals/run`

### 5.4 Pesquisa 26 (Design System Vibes) — ⏳ DISPATCHING

Status: rodando no Claude Desktop (~30min). Arquivo `compass_artifact_wf-33493e41-...md` em `docs/research/` pendente rename pra `26-design-system-vibes.md`.

Cobertura: template × palette × content separation + 8 arquetipos extraídos + typography rica + photo handling + AI vibe matching from photo/brand reference + mobile vs desktop + PWA-specific + shadcn primitives variants per template + antifragility (combinações proibidas) + vertical→vibe mapping automático.

### 5.5 Pesquisa 03 (Prompt Engineering) — ❌ NÃO consultada hoje

**Erro reconhecido.** Quando decidi prompt-templates versionados e LLM-as-judge weekly, devia ter consultado pesquisa 03 (que cobre Anthropic Prompt Eng Guide, Constitutional AI, CoT/Decomposition/Few-shot/ToT). **Retomada deve ler antes de cravar prompts Fase 1.**

---

## 6. Modelo de negócio — 3 pacotes (funil agência vende os 3, NÃO só A)

**Erro reconhecido durante a sessão:** confundi "vender Pacote A" com "vender 3 pacotes". Funil agência da `desafit.app/agencia` é landing institucional que vende **os 3 pacotes**:

| Pacote                         | Entrada  | Mensalidade         | Entrega | Conteúdo                                                                                                                              |
| ------------------------------ | -------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Vendas/Captação**        | R$ 1.500 | R$ 100/mês após 30d | 30 dias | Subdomínio + landing + form captação + form onboarding + TDEE/macros + checkout + cupons + pixel + email + painel leads — **sem app** |
| **B — App com marca**          | R$ 3.000 | R$ 200/mês após 11m | 60 dias | PWA Android/iPhone + programa + player vídeo + biblioteca 800+ exercícios + check-in + gamificação (mês 3) + 10 meses isenção bonus   |
| **C — Conjunto (recomendado)** | R$ 4.000 | R$ 200/mês após 11m | 90 dias | A + B + chatbot nutricional IA + gamificação + 10 meses isenção + economia R$ 500                                                     |

**Modelo financeiro:**

- Aluno paga prof direto via gateway escolhido (Asaas/Pagar.me/MP/Stripe BR). **desafit não intermedia.**
- Plataforma cobra prof via **EFI Bank** (Pix recorrente + cartão 10×)

**Meta declarada:** 10 tenants pagantes em 4 meses (R$ 20k entrada).

**Funil M1 (atual) = vender os 3 pacotes via:**

```
Marketing (Meta Ads / orgânico)
  → Landing institucional desafit
  → Form de captação multi-step
  → Relatório IA personalizado (gerado das respostas)
  → Page de vendas comparando os 3 pacotes
  → CTA WhatsApp → Leandro fecha venda
  → Confirma pacote → começa entrega (M2+)
```

**Referências.** `docs/blueprint/00-PROJETO.md §3`. `docs/blueprint/11-roadmap.md`. Memória `project_harmonizacao_3_features.md`.

---

## 7. Roadmap de sprints (M0→M3) vs Fases de operação (1/2/3)

| Marco      | Período (estimado) | Conteúdo                                                                                                  | Operador      |
| ---------- | ------------------ | --------------------------------------------------------------------------------------------------------- | ------------- |
| **M0**     | Sem 1-2 (fechando) | Bootstrap repo, infra dia 0                                                                               | —             |
| **M1**     | Sem 3-4 (atual)    | **Funil agência** (`desafit.app/agencia`): form + relatório IA + page vendas 3 pacotes + handoff WhatsApp | Agência       |
| **M2**     | Sem 5-8            | 1º tenant Pacote A entregue via vibe coding interno                                                       | Agência       |
| **M3**     | Sem 9-12           | 2º-5º tenant — refinar playbook agência                                                                   | Agência       |
| **Fase 2** | ~Mês 4+            | Self-service profissional + MCP server publicado em Smithery.ai                                           | Profissional  |
| **Fase 3** | ~Mês 6+            | Pacote A vira commodity de configuração; cliente final consome                                            | Cliente final |

**Distinção crítica:** M0/M1/M2/M3 = **sprints temporais**. Fase 1/2/3 = **modos de operação** que coexistem na arquitetura (Lego).

---

## 8. Erros reconhecidos hoje (memória pra Claude futuro)

Documentados em `project_harmonizacao_3_features.md` e `feedback_*.md`:

1. **Tratei pesquisas 23+24+25 como silos** — na verdade UM sistema = funil agência. Walkthrough de 12 decisões em formato "feature-by-feature" estava errado desde o início. Correção: lente integrada cruzando pilares (engines + IA + estrutura + schema + Zod + MCP).
2. **Propus "estrutura mínima"** quando user quer arquitetura premium completa. Em USER #1417: "stripping arquitetura ≠ princípio Lego". Removi `share_token`/`tone`/`expires_at` "porque agência opera Fase 1" — errado.
3. **Confundi roadmap M0/M1/M2/M3 (sprints) com Fase 1/2/3 (operação).** User pediu pra parar de falar "Fase X Etapa Y" repetidamente.
4. **Trouxe "checar se é bot" e "Vercel Workflow 7 steps" sem aplicar filtro JIT.** Frescura puro — pesquisa 25 trouxe, repassei sem filtrar.
5. **Falei "Fase X Etapa Y" repetido** após user pedir pra parar.
6. **Não reli pesquisas com profundidade** — chutei recomendações em alguns pontos.
7. **Confundi "vender Pacote A" com "vender 3 pacotes"** — funil agência vende os 3, não só A.
8. **Reciclei 8 motores onboarding-bio sem questionar.** Eram específicos de fitness coaching com 6 modalidades. Não viraram "motores universais" — precisava meta-framework (§3.14).
9. **Não consultei pesquisa 03 (prompt engineering)** quando decisões de prompt-template / LLM-as-judge surgiram.

---

## 9. Memórias criadas hoje

| Memória                                        | Conteúdo                                                           | Quando aplicar                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `feedback_research_briefing_intent.md`         | Pesquisas complementares = UM sistema, não silos                   | Sempre que user pedir "pesquise X também" → tratar como complemento, não feature isolada |
| `feedback_frescura_filter.md`                  | Sem analytics/scoring/A-B/dashboards de priorização em MVP solo    | Sempre que pesquisa externa trouxer feature "best-practice SaaS"                         |
| `project_harmonizacao_3_features.md` (rewrite) | Sessão PAUSADA, decisões 1-9 fechadas, retomar com lente integrada | Próxima sessão que abrir o tema "harmonização"                                           |

Memórias pré-existentes ativas (auto-loaded):

- `feedback_pnpm_parallel_add.md`
- `feedback_jit_anchoring.md`
- `feedback_mil_passos_a_frente.md`
- `project_plano_dia_1.md`
- `feedback_secdef_validates_tenant_id.md`

---

## 10. Estado das 12 decisões da harmonização

Walkthrough tentou fechar 12 decisões cruzando pesquisas 24+25 com plano. **9 fecharam, 3 não.** Status de cada:

| #      | Tema                                                       | Status                                                                                                                  |
| ------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1      | Coluna spec por engine (`definition` vs `blocks_snapshot`) | ✅ Cada motor mantém nome semântico próprio                                                                             |
| 2      | Versionamento Hotmart-like cross-engine                    | ✅ Snapshot-only, mesmo padrão                                                                                          |
| 3      | Operations API tipada Fase 1                               | ✅ ~15 operations, MCP-ready                                                                                            |
| 4      | Vocab canônico cross-engine                                | ✅ Form vocab + Page vocab + naming.md cruzados                                                                         |
| 5      | Stack travado pós-pesquisa                                 | ✅ Confirmado, ADR's mantidos                                                                                           |
| 6      | AI provider strategy                                       | ✅ Vercel AI Gateway plain strings                                                                                      |
| 7      | Storage canônico                                           | ✅ Vercel Blob (reports) + Supabase Storage (uploads cliente)                                                           |
| 8      | Defesa em camadas                                          | ✅ RLS L1 + role L2 + entitlements L3                                                                                   |
| 9      | Cross-engine invalidation                                  | ✅ `cacheTag('engine:id')` + `revalidateTag('engine:id')`                                                               |
| **10** | Pipeline pós-submit (7 steps)                              | ❌ **Não fechou** — pesquisa 25 detalhou; user identificou frescura. Retomar com lente "report = page kind, não engine" |
| **11** | Vocab `form_kind` vs `page_kind` enums SQL                 | ❌ **Não fechou** — discussão acabou em `'report'` value mas faltou enum SQL formal                                     |
| **12** | Cost cap por tenant                                        | ❌ **Não fechou** — pesquisa 25 sugere, mas hover entre frescura e Lego                                                 |

---

## 11. Pendências cravadas

### 11.1 Pesquisas

- ⏳ **Pesquisa 26 (design system vibes)** voltar e ser integrada (~30min)
- ❌ **Pesquisa 03 (prompt engineering)** — não foi consultada hoje, devia ser antes de cravar prompts Fase 1

### 11.2 Docs a criar

- ADR-0041 "Engine catalog + 2 motores separados"
- `docs/blueprint/19-wrapper-strategy.md` (consolida ADR-0040 §E + §F)
- `docs/blueprint/20-i18n-strategy.md` (consolida ADR-0040 §G + decide inline vs `t()` em forms)
- `docs/blueprint/21-engine-catalog.md` (enumera engines + relações)
- `docs/blueprint/22-program-engine-spec.md` (pre-spec Program Engine — componentes, dimensões, sequenciamento)
- ADR-0042 "Template × Palette × Content separation" (após pesquisa 26)

### 11.3 Plano

- Reescrita §3 do plano com `TemplateSpec` após pesquisa 26
- Refactor design system (templates × paletas × content separados)
- Decidir continuar Etapa 0a/0b com templates ou pular pra Etapa 1 (Form Engine que não depende)

### 11.4 Decisões de design (após pesquisa 26)

- Photo handling strategy (aspect ratios, crop, fallback, AI matching)
- Mobile vs desktop philosophy per template
- PWA-specific design
- shadcn primitives variants per template
- Antifragility combinações proibidas
- Vertical → template mapping automático
- Logo wordmark final (designer pro JIT)

### 11.5 Open one-way doors a fechar

- Schema SQL (cravando dia 1)
- FormDefinition / PageSpec shape (cravando dia 1)
- Vocabulário (cravado §3.20)
- JSON Logic (json-logic-js confirmado)
- JWT claim (cravado dia 0)
- PII encryption (a definir)

### 11.6 Conformidade/Legal (antes de produção real)

- LGPD DSAR endpoints (antes de cliente pagante real)
- DPAs com sub-processadores (antes de produção real)
- Stripe integração — Fase 1 vs Fase 2 ainda aberto

### 11.7 Etapa 0a (infra) — pendências do plano

- Vercel BotID: ativar Deep Analysis (Pro+) em `/api/forms/[id]/submit` — **JIT**
- Instalar deps: `pnpm add ai @vercel/queue botid json-logic-js @upstash/ratelimit @upstash/redis resend @react-pdf/renderer @react-email/components` + dev types
- AI Gateway key no Vercel (atualmente só `.env.local`)

### 11.8 Componentes (JIT trackeados)

- 9 typography primitives restantes — possivelmente repensar à luz da pesquisa 26
- 4 entitlement components (Badge, PaywallModal, QuotaBanner, UpgradeCTA) — JIT quando primeiro paywall surgir
- 42+ wrappers shadcn não-críticos — JIT por consumer real
- 4 composições Card PWA aluno — JIT junto com primeira tela PWA aluno
- Tenant copy overrides JIT (gatilho rule i18n)

---

## 12. Retomada — instruções pra próxima sessão

Quando reabrir (essa sessão ou outra), seguir este protocolo (documentado em plano §0.2.1):

1. **Ler obrigatoriamente:**
   - `docs/blueprint/00-PROJETO.md`
   - `docs/blueprint/11-roadmap.md`
   - `docs/blueprint/09-pacote-a.md` + `10-pacote-b-c.md`
   - `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md` (especialmente §0.2 + §0.2.1 RESET)
   - `docs/research/23-form-engine-architecture.md` (1158 linhas)
   - `docs/research/24-page-engine-architecture.md` (67 KB)
   - `docs/research/25-ai-reports-architecture.md` (64 KB)
   - **`docs/research/03-prompt-engineering.md` (não foi consultada hoje)**
   - `docs/research/26-design-system-vibes.md` (quando voltar)

2. **Aplicar 4 filtros mentais via memória:**
   - `feedback_research_briefing_intent.md` — pesquisas = UM sistema
   - `feedback_frescura_filter.md` — sem analytics/scoring sem demanda
   - `feedback_jit_anchoring.md` — JIT só com trigger + âncora
   - `feedback_mil_passos_a_frente.md` — infra generalizada sempre

3. **Retomar mapeando pilares** (engines + IA + estrutura + schema + Zod + MCP) **cruzando as 3 pesquisas** — NÃO tabela comparativa de features, NÃO walkthrough decisão-por-decisão.

4. **Reconhecer:**
   - Funil agência vende os **3 pacotes** (não só A)
   - Design system tem rethink pendente (template × palette × content)
   - Sistema é UM com 3 motores (Form + Page + Program), report = page kind
   - Fase 1/2/3 ≠ M0/M1/M2/M3

---

## 13. Glossário rápido (vocab final hoje)

| Termo                   | Definição                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------- |
| **Engine**              | Motor de produto = renderer + spec schema + editor + prompt-template. Catalogado em `engine-catalog.md`. Polimórfico via `kind` enum |
| **Motor**               | Dimensão de dado pra alimentar decisão downstream. Não é lista fixa. Descoberto via meta-framework + IA entrevista                   |
| **Kind**                | Discriminador polimórfico dentro de engine. `forms.kind`, `pages.kind`. Decide prompt-template, blocks visíveis, capabilities        |
| **Scope**               | Flag `tenant                                                                                                                         | internal | platform` no nível de cada row. Decide RLS + UI + chat IA |
| **Spec**                | Definição declarativa de uma instância de engine. JSON validado por Zod. Ex: `FormDefinition`, `PageSpec`                            |
| **Block**               | Bloco em form ou page. Discriminated union por `type`. Cada block tem Zod schema + (em forms) opcional `bindings[]`                  |
| **Binding**             | Mapeamento de resposta de form pra coluna de tabela de domínio. Declarativo no spec                                                  |
| **Template**            | (1) Design — bundle de tokens estruturais. (2) Conteúdo — `form_template` ou `page_template` versionado. **Contextual**              |
| **Version**             | Snapshot imutável em `_versions`. Forms/pages têm working state + N versões publicadas (Hotmart-like)                                |
| **Lego**                | Princípio: infra suporta 3 modos desde dia 1 (agência + self-service + cliente final). Fase 1 só USA modo agência                    |
| **Frescura**            | Filtro: sem analytics/scoring/dashboards sem demanda real comprovada                                                                 |
| **JIT**                 | Just-in-time. Adiar decisão exige trigger + playbook (lint, hook, rule) — senão Claude futuro re-deduz                               |
| **Mil passos à frente** | Nada hardcoded. Feature = instância de infra generalizada que vira editor + chat IA + MCP self-service depois                        |

---

**Fim do resumo.** Para ir mais fundo em qualquer decisão, ler o transcript bruto em `docs/_archive/2026-05-19-conversation-evolution.md` filtrando pela hora correspondente.

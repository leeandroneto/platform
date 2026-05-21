# 21. Engine catalog

> Consolida ADR-0041 (2 motores + kind + scope) + decisões de catálogo da sessão 2026-05-19.
> Fonte única declarativa: "quais engines existem, em que status, e como se relacionam".
> Última atualização: 2026-05-19.

---

## 1. Princípio

**Engine** = motor de produto que cria/edita/renderiza/persiste um TIPO de coisa (form, page, program, email...). Cada engine tem:

- Um **spec schema** (Zod) que define a forma da coisa
- Um **renderer** que transforma spec em UI
- Um (futuro) **editor** que permite modificar o spec
- Um **prompt-template** que orienta a IA gerar/editar o spec
- Tabelas próprias (sempre em `public.*` per ADR-0033)

**Engines polimórficos** via coluna `kind`. **Reuso interno/externo** via coluna `scope` (per ADR-0041).

**Por que catalogar todos agora:** prever onde cada engine encaixa orienta naming, scope, RLS e data bindings desde o dia 1. **Prever ≠ construir** — só constrói quando feature pedir.

---

## 2. Catálogo

22 engines previstos em 3 categorias.

**Status:** `available` (pronto/disponível) · `building` (Fase 1 ativo) · `planned` (catalogado, sem construir) · `future` (Fase 2+).

### 2.1 Engines de conteúdo (profissional do tenant cria/edita)

| Engine                       | Status   | Propósito                                                                       |
| ---------------------------- | -------- | ------------------------------------------------------------------------------- |
| **Form Engine**              | building | Captação, onboarding, anamnese, brief, avaliação (polimórfico via `kind`)       |
| **Page Engine**              | building | Landing, sales, document, thank-you, error, blog, **report opcional** (AI-fill) |
| **Program Engine**           | planned  | Treinos/aulas estruturados em módulos+sessões (Pacote A)                        |
| **Module Engine**            | planned  | Sub-unidade de Program (lessons ordenadas)                                      |
| **Email Engine**             | planned  | Templates transacionais + marketing                                             |
| **Push Notification Engine** | future   | Templates curtos + segmentação                                                  |
| **Automation Engine**        | future   | Flows declarativos (gatilho → condição → ações)                                 |
| **Document Engine**          | future   | Long-form (ebooks, materiais)                                                   |
| **Chatbot Engine**           | future   | Conversa scriptada + IA generativa                                              |

### 2.2 Engines internas (agência/SaaS opera, não exposta a profissional)

Operam via `scope='internal'` ou `scope='platform'` nos engines de conteúdo + alguns engines próprios.

| Engine                         | Status  | Propósito                                                       |
| ------------------------------ | ------- | --------------------------------------------------------------- |
| **Tenant Provisioning**        | planned | Workflow declarativo cria tenant + seed forms/pages/copy/paleta |
| **White-label Config**         | planned | Form `scope='internal'` (paleta + logo + copy + domain)         |
| **Plan/Pricing Manager**       | planned | Form `scope='platform'` + lógica de entitlements                |
| **Onboarding Wizard**          | future  | Page Engine + Form Engine combinados — setup guiado             |
| **Analytics Dashboard Config** | future  | Page Engine + cards de métrica configuráveis                    |
| **Billing/Stripe Integration** | planned | Workflow + webhook handlers (sem spec próprio)                  |

### 2.3 Engines de processamento (backend, sem UI)

| Engine              | Tecnologia                                         | Status    |
| ------------------- | -------------------------------------------------- | --------- |
| **Workflow Engine** | Vercel WDK (`'use workflow'`)                      | available |
| **Queue Engine**    | Vercel Queues                                      | available |
| **Cron Engine**     | Vercel Cron                                        | available |
| **Storage Engine**  | Vercel Blob (reports) + Supabase Storage (uploads) | available |
| **AI Routing**      | Vercel AI Gateway + router Haiku classify          | building  |
| **Webhook In/Out**  | Custom + HMAC                                      | building  |

---

## 3. Relação entre engines

**Engines de conteúdo são autônomos por padrão.** Cada um cria/persiste/publica seu tipo independente. Conexões abaixo são **possíveis ligações**, não fluxos default.

### 3.1 Ligações possíveis

| Origem      | Destino       | Como                                              | Quando                                                                                |
| ----------- | ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Form Engine | Page Engine   | `forms.report_template_id NULL` + AI fill content | **Exceção opcional.** Só forms marcados explicitamente como "gera report" — não regra |
| Form Engine | Email Engine  | Workflow pós-submit dispara template transacional | Notificação ao profissional, confirmação ao lead — não obrigatório                    |
| Form Engine | domain tables | `bindings[]` no block spec (ver §4)               | Quando block deve popular tabela de domínio (`client_profile`, etc) — opcional        |
| Page Engine | Form Engine   | Block `embed-form` referenciando form publicado   | Landing/sales embedando captura                                                       |
| Page Engine | Storage       | Render Satori → PNG/PDF                           | Snapshot para preview ou anexo email                                                  |
| Automation  | qualquer      | Gatilho → condição → ação executada via Workflow  | Fase 2+                                                                               |

### 3.2 Contexto do funil agência (Fase 1)

O funil comercial da `desafit.app/agencia` **usa** algumas dessas ligações:

```
Form Engine (lead_capture) ──► Workflow ──► AI Routing ──► Page Engine (kind='report')
                                    │                              │
                                    ├──► Email Engine (Resend) ────► lead recebe link
                                    │
                                    └──► Storage (Blob, PDF opcional)
```

Esse pipeline é **específico do funil agência** (vender Pacote A/B/C). NÃO é o fluxo default de Form Engine. **A maioria dos forms não gera report** — captação simples grava `form_responses` e dispara notificação. Só forms onde profissional/agência configurou `report_template_id` ativam o pipeline IA.

---

## 4. Data bindings (mecanismo de ligação engine ↔ domínio)

Cada block do Form Engine pode ter campo `bindings[]` opcional no spec:

```jsonc
{
  "id": "block-abc",
  "type": "file-upload",
  "ref": "before_photo",
  "bindings": [
    {
      "target_table": "client_profiles",
      "target_field": "before_photo_url",
      "value_extractor": "blob_url",
    },
  ],
}
```

Pós-submit, step `apply_bindings` no Workflow lê o spec e popula a tabela de domínio. **Sem migration nova** — `form_versions.definition` JSONB já comporta.

**Por que isso importa:** é o que conecta Form Engine (Fase 1) ao Program Engine (Fase 3) sem refactor. Fase 1 grava só em `form_responses`; quando Fase 3 chegar, ativa bindings → forms começam a alimentar `client_profile` que Program Engine consome.

---

## 5. Domain catalog (skeleton)

`lib/contracts/domain-catalog.ts` declara tabelas+colunas **bindáveis** por engines. Não é tabela do banco — é metadado TypeScript versionado em PR.

Skeleton inicial (Fase 1):

- `client_profiles` (campos básicos: nome, contato, demographics)
- `tenant_brand` (paleta, logo, font, shape)

Expande conforme features. Cada engine novo documenta suas tabelas bindáveis aqui.

**Uso pela IA:** roteador consulta catalog pra (1) sugerir bindings ao criar pergunta, (2) detectar duplicação, (3) gerar report consumindo dados.

---

## 6. Convenção pra adicionar engine novo

1. **Antes de codar:** ADR superseding ou complementar atualizando este catálogo
2. **Atualizar tabela** do §2 com status `planned` → `building` quando começar
3. **Registrar** em `lib/engines/registry.ts` com `{ table, specSchema, renderer, chatPromptTemplate }`
4. **Documentar tabelas bindáveis** no domain catalog se aplicável
5. **Adicionar entry** em `.claude/rules/*` path-loaded se padrão de código for específico

---

## Referências

- ADR-0041 (engine catalog + 2 motores + kind + scope) — decisão raiz
- ADR-0033 (schema único `public.*`)
- ADR-0024 (multi-marca via hostname) — `scope='tenant'` se alinha
- ADR-0040 §A-§F (shadcn-zone aplica a renderers de todos engines)
- Pesquisa 23 (form engine), 24 (page engine), 25 (ai reports — usado APENAS no funil agência + sob demanda)
- `docs/_sessions/2026-05-19-resumo-completo.md` §3.5 — origem do catálogo

# OSS References by Feature

> **Tipo:** registro deferred — referências open source pra cada feature futura
> **Data:** 2026-05-22
> **Status:** vivo (revisitar a cada plano novo)
> **Cross-links:** `docs/_deferred/post-funil-agencia.md` + `docs/plans/funil-agencia.md` + `docs/plans/theme-builder.md`

---

## Sobre este arquivo

Lista de projetos open source que podem ser **copiados, integrados ou estudados** pra acelerar cada feature futura. Reduz risco de reinventar roda. Cada feature consulta este arquivo ANTES de começar implementação.

### Estratégias possíveis (por licença + alinhamento)

| Estratégia                 | Quando                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| **COPY direto**            | License permissiva (MIT, Apache 2.0, BSD) + arquitetura compatível + valor agregado claro |
| **INTEGRAR (npm install)** | License permissiva + lib madura + multi-tenant não complica + bundle aceitável            |
| **ESTUDAR só**             | License copyleft (AGPL, GPL) OU stack divergente OU pattern aplicável mas código não      |
| **SKIP**                   | License incompatível + valor marginal                                                     |

### Anti-padrão

Não deixar este arquivo morrer. **Revisitar a cada plano novo** pra ver se algum item virou gatilho disparado.

---

## 1. Vibe coding / AI orchestration (Item 5 da ordem ADR-0046)

Camada principal do nosso produto AI-native. Foco em arquitetura proven.

| Projeto                    | Licença    | Stack                  | Ação            | Valor                                                                                                      |
| -------------------------- | ---------- | ---------------------- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| **Vercel AI Chatbot**      | MIT        | Next.js + AI SDK       | ✅ COPY         | Artifacts pattern (Document + Suggestion + composite PK versioning). Já clonado em `vercel/ai-chatbot` ref |
| **Mastra**                 | Apache 2.0 | Next.js + TypeScript   | INTEGRAR        | AI framework Next.js native: agents, workflows, RAG, evals, observability                                  |
| **Inngest**                | Apache 2.0 | Multi-platform         | INTEGRAR JIT    | Durable workflows pra AI longa (5-30s). Resumable streams. Cross-link research-44                          |
| **Trigger.dev**            | Apache 2.0 | Node + TypeScript      | INTEGRAR alt    | Alternativa Inngest, jobs durable + retry policies                                                         |
| **OpenV0**                 | MIT        | Next.js + Claude/GPT   | COPY/ESTUDAR    | AI gera shadcn components. Patterns prompt + parsing + safety                                              |
| **AnythingLLM**            | MIT        | Node + multi-DB        | ESTUDAR         | RAG agentic chatbot — arquitetura RAG + multi-tenant inspiração                                            |
| **LibreChat**              | MIT        | Node + React           | ESTUDAR         | Multi-model chat UI completo — patterns de routing entre modelos                                           |
| **AutoGen**                | MIT        | Python + .NET          | ESTUDAR pattern | Multi-agent orchestration patterns aplicáveis ao Vercel AI SDK                                             |
| **CrewAI**                 | MIT        | Python                 | ESTUDAR pattern | Multi-agent framework simples — role/task/crew abstraction                                                 |
| **Continue.dev**           | Apache 2.0 | TypeScript + multi-IDE | ESTUDAR         | Context injection patterns pra IA dev tools                                                                |
| **AgentOps / OpenLLMetry** | Apache 2.0 | SDK multi-language     | INTEGRAR JIT    | AI observability — traces, costs, evals                                                                    |

**Foco prioritário:** Vercel AI Chatbot (já clonado) + Mastra + Inngest.

---

## 2. Forms (Item 2 da ordem ADR-0046 — form captação agência)

Forms Engine bare-bones nasce com o form da agência. Referências:

| Projeto              | Licença  | Stack                         | Ação                         | Valor                                                                                                     |
| -------------------- | -------- | ----------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Survey.js**        | MIT      | JavaScript framework-agnostic | ✅ COPY JSON spec + renderer | JSON spec maduro com 20+ tipos de campos, branching logic, validação. Builder visual também MIT           |
| **Formbricks**       | AGPL-3.0 | Next.js + Supabase            | ⚠️ ESTUDAR só                | Stack IDÊNTICA à nossa (Next + Supabase) — arquitetura multi-tenant + analytics + RLS patterns inspiração |
| **Form.io**          | OSL 3.0  | Angular + Node                | ESTUDAR                      | Drag-drop forms + workflow + render API                                                                   |
| **FormKit**          | MIT      | Vue                           | ESTUDAR patterns             | Validation schemas + logic engine aplicáveis cross-framework                                              |
| **OhMyForm**         | GPL-3.0  | Node + Angular                | ⚠️ ESTUDAR só                | Typeform clone — UX patterns step-by-step                                                                 |
| **React Hook Form**  | MIT      | React                         | ✅ JÁ USAMOS                 | —                                                                                                         |
| **Tally clones OSS** | varia    | varia                         | ESTUDAR UX                   | Typeform-like minimalist UX                                                                               |

**Foco prioritário:** Survey.js (JSON spec + branching logic) + Formbricks (arquitetura multi-tenant inspiração).

**Cross-link:** `docs/research/23-form-system-architecture.md` (research já feito sobre Form Engine).

---

## 3. AI Reports (Item 3 da ordem ADR-0046)

Report IA do form agência = primeiro caso AI report. Referências:

| Projeto                         | Licença    | Stack          | Ação                     | Valor                                                                |
| ------------------------------- | ---------- | -------------- | ------------------------ | -------------------------------------------------------------------- |
| **Vercel AI Chatbot Artifacts** | MIT        | Next.js        | ✅ COPY pattern          | `createDocumentHandler<T>()` factory + tool layer + resumable stream |
| **Mastra**                      | Apache 2.0 | Next.js        | INTEGRAR                 | Structured outputs + Zod schemas + evals                             |
| **LangChain.js**                | MIT        | TypeScript     | ESTUDAR/INTEGRAR         | Chains/prompts/output parsers patterns                               |
| **Promptfoo**                   | MIT        | Node CLI       | INTEGRAR JIT             | Prompt evaluation + drift detection (research-44 mencionou)          |
| **Anthropic Claude SDK**        | MIT        | Multi-language | ✅ VIA Vercel AI Gateway | Direct SDK não, mas Gateway provider                                 |
| **Vercel AI SDK**               | Apache 2.0 | TypeScript     | ✅ JÁ USAMOS             | —                                                                    |

**Foco prioritário:** Vercel AI Chatbot Artifacts (copy) + Mastra (integrar) + Promptfoo (JIT pro CI gate).

**Cross-link:** `docs/research/25-ai-reports-architecture.md` (30+ decisões cravadas ready-to-consume).

---

## 4. Pages / Visual builders (Item 4 da ordem ADR-0046)

Page Engine bare-bones nasce com a sales page agência. Referências:

| Projeto                | Licença      | Stack                  | Ação                | Valor                                                                      |
| ---------------------- | ------------ | ---------------------- | ------------------- | -------------------------------------------------------------------------- |
| **Puck**               | MIT          | React + Next.js compat | ✅ COPY             | JSON spec + drag-drop minimalista. Próximo do Page Engine ADR-0041         |
| **Craft.js**           | MIT          | React                  | COPY framework      | Framework pra construir page builders próprios. Mais flexível, mais código |
| **Editor.js**          | Apache 2.0   | Vanilla JS             | COPY block patterns | Block-style editor estilo Notion                                           |
| **Plate**              | MIT          | React + Slate          | ESTUDAR/INTEGRAR    | Editor visual flexível, blocks composáveis, AI plugins                     |
| **TinaCMS**            | Apache 2.0   | React/Next.js          | ESTUDAR             | Visual editing inline em sites                                             |
| **Webstudio**          | AGPL-3.0     | React                  | ⚠️ ESTUDAR só       | Webflow OSS completo — copia complicado                                    |
| **GrapesJS**           | BSD-3-Clause | Vanilla JS             | COPY parts          | Drag-drop maduro, framework-agnostic                                       |
| **Builder.io Mitosis** | MIT          | Multi-framework        | ESTUDAR             | Compila pra qualquer framework — patterns spec→code                        |
| **Payload CMS**        | MIT          | Next.js native         | ✅ INTEGRAR/COPY    | Schema-driven, admin auto-gerado, RLS-friendly. **MUITO valioso**          |

**Foco prioritário:** Puck (copy spec) + Payload CMS (schema-driven inspiration heavy).

**Cross-link:** `docs/research/24-page-engine-architecture.md` (research já feito sobre Page Engine).

---

## 5. AI app builders / Generative UI (Item 5 da ordem ADR-0046, longe)

Pros AI builders que entram após funil agência capturar leads. Pacote A delivery.

| Projeto                         | Licença    | Stack            | Ação               | Valor                                       |
| ------------------------------- | ---------- | ---------------- | ------------------ | ------------------------------------------- |
| **Vercel AI Chatbot Artifacts** | MIT        | Next.js          | ✅ COPY pattern    | Generative UI pattern proven                |
| **OpenV0**                      | MIT        | Next.js + Claude | COPY/ESTUDAR       | AI gera shadcn components                   |
| **Bolt.new** (StackBlitz core)  | MIT        | Web Container    | ⚠️ ESTUDAR         | Open core — IDE in-browser                  |
| **Lovable.dev**                 | Closed     | TanStack Start   | ⚠️ ESTUDAR público | Multi-model hydration pattern (research-44) |
| **Replit Agent 3**              | Closed     | Python DSL       | ESTUDAR público    | Multi-agent + tool calling 90% success      |
| **Mastra**                      | Apache 2.0 | Next.js          | INTEGRAR           | (já listado)                                |
| **AutoGen**                     | MIT        | Python           | ESTUDAR pattern    | Multi-agent orchestration                   |

**Foco prioritário:** Vercel AI Chatbot Artifacts + Mastra + OpenV0.

---

## 6. Programs / Course builders (Pacote B futuro)

LMS pros tenants criarem programas + PWA aluno.

| Projeto                    | Licença  | Stack         | Ação          | Valor                                                    |
| -------------------------- | -------- | ------------- | ------------- | -------------------------------------------------------- |
| **LearnHouse**             | AGPL-3.0 | Next.js       | ⚠️ ESTUDAR só | LMS moderno Next.js — stack próxima nossa                |
| **Open edX**               | AGPL-3.0 | Python        | ⚠️ ESTUDAR só | Heavyweight mas patterns curriculum/sequencing maduros   |
| **Moodle**                 | GPL-3.0  | PHP           | ⚠️ ESTUDAR só | LMS mais antigo, referência madura curriculum            |
| **TutorLMS Free**          | GPL-3.0  | PHP WordPress | ⚠️ ESTUDAR só | LMS WordPress                                            |
| **Decap CMS** (NetlifyCMS) | MIT      | React         | COPY parts    | Git-based content — programs como content estruturado    |
| **Strapi**                 | MIT      | Node          | ESTUDAR       | Headless CMS — API auto-gerada patterns                  |
| **Sanity Studio**          | MIT      | React         | ESTUDAR       | Content editor framework                                 |
| **Payload CMS**            | MIT      | Next.js       | ✅ INTEGRAR   | (já listado — schema-driven aplicável a programs também) |

**Foco prioritário:** LearnHouse (estudar arquitetura) + Decap (content patterns).

---

## 7. Workflow / Flow builders (futuro Pacote B — gamificação)

Pra construir flow builder de progresso/gamificação visual.

| Projeto                 | Licença                 | Stack          | Ação               | Valor                                                |
| ----------------------- | ----------------------- | -------------- | ------------------ | ---------------------------------------------------- |
| **xyflow / React Flow** | MIT                     | React          | ✅ COPY            | Diagram/flow library — base pra flow builder próprio |
| **Activepieces**        | MIT                     | Node + React   | ✅ INTEGRAR alt    | Workflow automation alternativa MIT                  |
| **n8n**                 | Sustainable Use License | Node           | ⚠️ ESTUDAR pattern | Workflow visual maduro, self-host OK                 |
| **Trigger.dev**         | Apache 2.0              | Node           | (já listado)       | —                                                    |
| **Inngest**             | Apache 2.0              | Multi-platform | (já listado)       | —                                                    |

**Foco prioritário:** xyflow (copy diagram lib) + Activepieces (workflow MIT).

---

## 8. Admin panels / Internal tools (futuro)

Pra admin panel auto-gerado pros tenants gerenciarem dados.

| Projeto         | Licença    | Stack                 | Ação           | Valor                                                  |
| --------------- | ---------- | --------------------- | -------------- | ------------------------------------------------------ |
| **Refine**      | MIT        | React + multi-backend | ✅ INTEGRAR    | Admin panel framework Next.js. RBAC + CRUD auto-gerado |
| **AdminJS**     | MIT        | Node                  | ESTUDAR        | Admin panel maduro                                     |
| **React Admin** | MIT        | React                 | ESTUDAR        | Framework maduro pra admin                             |
| **Tooljet**     | AGPL-3.0   | Node + React          | ⚠️ ESTUDAR só  | Internal tools — workflow builder visual               |
| **Appsmith**    | Apache 2.0 | Java + React          | INTEGRAR parts | Internal tools — RBAC patterns                         |
| **Lowdefy**     | MIT        | YAML config           | ESTUDAR        | Config-driven app builder — schema declarativo         |
| **NocoDB**      | AGPL-3.0   | Node + Vue            | ⚠️ ESTUDAR só  | Airtable OSS — multi-tenant tables                     |

**Foco prioritário:** Refine (admin pattern) + Lowdefy (config-driven inspiration).

---

## 9. Email builders (Pacote A bonus + futuro)

Pra construtor de emails per-tenant (newsletter, transactional, etc).

| Projeto         | Licença  | Stack          | Ação          | Valor                                          |
| --------------- | -------- | -------------- | ------------- | ---------------------------------------------- |
| **Maily**       | MIT      | React + Tiptap | ✅ COPY       | Drag-drop email editor. React Email-compatible |
| **React Email** | MIT      | React          | ✅ JÁ USAMOS  | —                                              |
| **MJML**        | MIT      | XML markup     | INTEGRAR JIT  | Email markup language proven                   |
| **Postal**      | MIT      | Ruby           | ESTUDAR       | Self-hosted email infrastructure               |
| **Listmonk**    | AGPL-3.0 | Go             | ⚠️ ESTUDAR só | Newsletter manager — patterns de campanha      |

**Foco prioritário:** Maily (copy email editor) + React Email (já).

---

## 10. CMS / Content Management

Pro caso de page templates, blog do tenant, etc.

| Projeto                 | Licença    | Stack          | Ação          | Valor                                        |
| ----------------------- | ---------- | -------------- | ------------- | -------------------------------------------- |
| **Payload CMS**         | MIT        | Next.js native | ✅ INTEGRAR   | **MUITO valioso** schema-driven + admin auto |
| **Sanity Studio**       | MIT        | React          | ESTUDAR       | Content editor framework                     |
| **Strapi**              | MIT        | Node           | ESTUDAR       | Headless CMS                                 |
| **Directus**            | BSL 1.1    | Node           | ⚠️ ESTUDAR só | Database admin moderno                       |
| **Decap CMS**           | MIT        | React          | COPY parts    | Git-based                                    |
| **TinaCMS**             | Apache 2.0 | React/Next.js  | ESTUDAR       | (já listado)                                 |
| **Plasmic** (OSS parts) | MIT        | React          | ESTUDAR       | Visual CMS + page builder                    |

**Foco prioritário:** Payload CMS (schema-driven core).

---

## 11. Component libraries (JIT por feature)

Coleções shadcn-compatible extras pra acelerar UI.

| Projeto           | Licença           | Ação         | Valor                                                                     |
| ----------------- | ----------------- | ------------ | ------------------------------------------------------------------------- |
| **shadcn/ui**     | MIT               | ✅ JÁ USAMOS | Primitives canonical (39 instaladas)                                      |
| **Origin UI**     | MIT               | INTEGRAR JIT | Blocks shadcn-compatible extras (multi-select, time picker, avatar-stack) |
| **Magic UI**      | MIT               | INTEGRAR JIT | Animated components (já em motion v12)                                    |
| **Kibo UI**       | MIT               | INTEGRAR JIT | SaaS-focused blocks (kbd, announcement-bar, dropzone)                     |
| **Tremor**        | Apache 2.0        | INTEGRAR JIT | Dashboard/analytics components (35+)                                      |
| **ReUI**          | MIT               | INTEGRAR JIT | Data-grid TanStack v8 (29 components)                                     |
| **billingsdk**    | MIT               | INTEGRAR JIT | Billing UI components (Stripe/Polar friendly)                             |
| **Aceternity UI** | Paid + restritivo | ❌ SKIP      | Banido per `.claude/rules/components.md` (framer-motion + paywall)        |

**Foco prioritário:** Origin UI + Kibo UI + Tremor conforme features pedirem.

**Cross-link:** `.claude/rules/components.md` (hierarquia + wrapper pattern).

---

## 12. Analytics / Tracking

Pra analytics interno + dashboards pros tenants.

| Projeto       | Licença  | Stack           | Ação          | Valor                                      |
| ------------- | -------- | --------------- | ------------- | ------------------------------------------ |
| **PostHog**   | MIT      | Multi-platform  | ✅ INTEGRAR   | Analytics + session replay + feature flags |
| **Umami**     | MIT      | Node + Postgres | INTEGRAR alt  | Simple analytics — multi-tenant friendly   |
| **Plausible** | AGPL-3.0 | Elixir          | ⚠️ ESTUDAR só | Privacy analytics                          |
| **OpenPanel** | AGPL-3.0 | Node            | ⚠️ ESTUDAR só | Alternativa Plausible                      |

**Foco prioritário:** PostHog (integrar quando 1ª feature crítica de analytics chegar).

---

## 13. Editores prose / Rich text (já decidido)

| Projeto       | Licença    | Stack                  | Ação                    | Valor                                                              |
| ------------- | ---------- | ---------------------- | ----------------------- | ------------------------------------------------------------------ |
| **Novel**     | Apache 2.0 | Tiptap + Vercel AI SDK | ✅ ADOPT (ADR-0045 D.4) | Editor AI-native pra lesson/journal                                |
| **Tiptap**    | MIT (base) | ProseMirror            | ✅ Base do Novel        | Já validado em produção massiva (LinkedIn, GitLab, Anthropic, NYT) |
| **Plate**     | MIT        | Slate-based            | ⚠️ Alternativa          | Caso Novel ficar leve, Plate é fallback                            |
| **Lexical**   | MIT        | Facebook's             | ⚠️ Alternativa          | Editor da Meta                                                     |
| **Editor.js** | Apache 2.0 | Vanilla JS             | ⚠️ Alternativa          | Block editor estilo Notion                                         |

**Foco prioritário:** Novel + Tiptap (cravado ADR-0045).

---

## Gatilhos pra revisitar este arquivo

| Gatilho                          | Ação                                                                       |
| -------------------------------- | -------------------------------------------------------------------------- |
| Iniciar plano nova feature       | Consultar categoria correspondente antes de implementar                    |
| Item OSS update major            | Re-avaliar relevância                                                      |
| 3+ features consumindo mesma lib | Promover de "INTEGRAR JIT" pra `dependencies` no `package.json` permanente |
| License mudou (ex: BSL→AGPL)     | Re-avaliar SKIP/ESTUDAR                                                    |
| Lib abandonada (no commit 6m+)   | Marcar como SKIP + buscar alternativa                                      |

## Cross-references

- `docs/plans/funil-agencia.md` — ordem ADR-0046 dogfooding-first
- `docs/_deferred/post-funil-agencia.md` — index deferred geral
- `docs/_deferred/ai-theme-generation-detail.md` — Fase 6 antiga
- `docs/_deferred/v0-registry-integration-detail.md` — Fase 7 antiga
- `docs/research/23-form-system-architecture.md` — Form Engine
- `docs/research/24-page-engine-architecture.md` — Page Engine
- `docs/research/25-ai-reports-architecture.md` — AI Reports (30+ decisões cravadas)
- `docs/research/38-registry-novel-ai-integration.md` — Registry + Novel
- `docs/research/44-real-players-integration-patterns.md` — 20 players validação stack
- ADR-0045 — Registry Strategy
- ADR-0046 — Dogfooding-first execution order

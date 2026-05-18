# Auditoria de Schema — 22/04/2026

> **Status:** Documentacao de descobertas. Nenhuma decisao confirmada. Revisitar quando as features estiverem mais maduras.

---

## Contexto

Projeto em dev, pre-producao. Muitas features ainda nao construidas, paginas por criar, tabelas por vincular. Esta auditoria mapeou o estado atual do banco (53 tabelas) para identificar duplicacoes, redundancias e oportunidades de simplificacao.

**Metodo:** Listagem completa via MCP Supabase (`list_tables` verbose + `execute_sql`), cruzamento com FKs, contagem de rows, e busca no codigo (lib/data, components, edge functions, RPCs, migrations) para cada tabela.

---

## Regra geral: quando usar tabela normalizada vs JSON vs JSONB

> Referencia do Supabase AI — guardar para aplicar nas decisoes futuras.

### Tabelas normalizadas — usar quando:

- Modelo estavel (campos que quase sempre existem, tipos bem definidos)
- Relacionamentos reais: 1:N, N:N, historico, auditoria, inventario, permissoes
- Consultas previsiveis: filtros por colunas, agregacoes, ordenacao, paginacao eficiente
- Integridade garantida: NOT NULL, CHECK, FOREIGN KEY, constraints, validacao no banco
- RLS e politicas granulares com base em colunas/joins
- Exemplo tipico: orders, order_items, products, customers

### JSON/JSONB — usar quando:

- Schema variavel ou "pluggable" (cada usuario/integracao envia campos diferentes)
- Payloads e metadados: webhooks, respostas de integracoes externas, configs de feature flags
- Evolucao rapida sem travar mudancas de DDL toda hora
- Campos "pouco consultados" (armazenar e retornar, nao filtrar pesado)
- Exemplo: webhook_events(payload jsonb) ou user_settings(settings jsonb)
- **No Postgres/Supabase, jsonb e recomendado na maioria dos casos** (indexa/consulta melhor, mais eficiente pra processar)

### Abordagem hibrida (melhor dos dois mundos):

- Campos que voce sempre consulta → coluna normalizada
- Campos extras/variaveis → jsonb
- Performance e indexes para o que e importante + flexibilidade para o resto

### Checklist rapido (decisao em 30s):

**Escolha tabelas normalizadas se:**

- Da pra nomear claramente as colunas
- Voce vai filtrar/ordenar/join nelas com frequencia
- Voce quer constraints e integridade no banco

**Escolha jsonb se:**

- Os campos mudam com o tempo
- O conteudo vem "de fora" (payloads)
- Voce nao sabe/controla os formatos ainda

### Dicas extras:

- Se usar jsonb e vai filtrar por campos dele, pensar em indexes (GIN/expressoes) desde o comeco
- Evitar "jsonb como banco relacional": se comecar a fazer muitos joins/filtros complexos, provavelmente virou hora de normalizar

---

## Descoberta 1: Sistema dual de templates (DUPLICACAO)

### O que existe

**Sistema A — normalizado (8 tabelas `analise_*`):**

- `analise_templates` (pai)
- `analise_template_questions`
- `analise_template_options`
- `analise_template_objectives`
- `analise_template_pillars`
- `analise_professional_templates` (overrides)
- `analise_professional_question_overrides`
- `analise_professional_option_overrides`

**Sistema B — JSONB (1 tabela):**

- `modality_templates` (tudo em `template_data jsonb`)
- `professional_modalities.customization` (overrides via JSONB)

### Evidencia

Ambos tem o mesmo registro (`musculacao@1.0.0`, mesmos campos id/profession/modality/version/label). O codigo usa os dois: `lib/data/analise-template.ts` le do sistema normalizado, `lib/data/template.ts` le de `modality_templates`. Nenhuma RPC referencia as tabelas `analise_*`. Todas as 8 tabelas normalziadas tem 0 rows (dados vivem no JSONB).

### Nota

O CLAUDE.md ja diz que `modality_templates` e a "runtime source of truth". O usuario confirmou que as `analise_*` serao deletadas.

---

## Descoberta 2: `intake_calculation_archive` (DUPLICACAO)

### O que existe

- Tabela `intake_calculation_archive` com colunas tipadas (bmr, tdee, bmi, bmi_class, water_target_ml, daily_calorie_target, protein_target_g, carb_target_g, fat_target_g, timeline_months)
- Coluna `intakes.calculations` (JSONB) com exatamente os mesmos dados
- Trigger `populate_intake_calculation_archive` que copia JSONB → colunas a cada INSERT em intakes

### Evidencia

Todos os 12 intakes tem ambos (has_calc_jsonb = true, has_archive_row = true). O JSONB e a source of truth. A archive e populada automaticamente por trigger. Usada em `lib/data/intake-calculation.ts` mas o dado ja esta disponivel no JSONB.

### Analise

Denormalizacao prematura para analytics que nao existem. Se precisar no futuro: generated columns em `intakes` ou materialized view.

---

## Descoberta 3: `client_transformations` — colunas JSONB duplicadas

### O que existe

A tabela tem **dois formatos** para os mesmos dados:

- Colunas tipadas: `weight_kg_before`, `weight_kg_after`, `body_fat_pct_before`, `body_fat_pct_after`, `muscle_mass_kg_before`, `muscle_mass_kg_after`
- Colunas JSONB: `metrics_before`, `metrics_after`

### Evidencia

O codigo (`TransformationEditor.tsx`, `TransformationsSection.tsx`) usa exclusivamente as colunas tipadas. As colunas JSONB nao sao lidas em nenhum lugar do codebase. Migration `20260419_000017_client_transformations_denormalization.sql` adicionou as colunas tipadas, mas as JSONB nao foram removidas.

---

## Descoberta 4: `professional_customization_history` (sem consumidor)

### O que existe

- Tabela append-only de audit log
- 2 triggers: `log_professional_landing_sections_change` e `log_professional_modality_customization_change`
- 0 rows
- Nenhum componente, pagina ou API le desta tabela

### Analise

Audit trail sem consumidor. Os triggers rodam em todo UPDATE de `professionals.landing_sections` e `professional_modalities.customization`. Overhead sem beneficio atual.

---

## Descoberta 5: Tabelas candidatas a JSONB em `professionals`

### Contexto

A tabela `professionals` ja usa JSONB extensivamente: `landing_sections jsonb`, `custom_links jsonb`, `onboarding_draft jsonb`, `gallery_urls array`. O padrao ja esta estabelecido.

### Candidatas

Estas 4 tabelas compartilham o mesmo padrao:

- Pertenca exclusiva a 1 professional (FK `professional_id`)
- **Nenhuma outra tabela aponta FK para elas** (sao folhas no grafo de FKs)
- Lista ordenada simples (`display_order`, `is_active`)
- 0 rows em todas
- Usadas para landing page e CRUD no dashboard
- Cada uma tem: `lib/data/`, `Manager.tsx`, RLS (select_own, insert_own, update_own, delete_own, public_read)

| Tabela                | Campos                                                                   | Volume esperado por profissional |
| --------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| `credentials`         | title, issuer, year, description, url, display_order, is_active          | 3-5 itens                        |
| `faq_items`           | question, answer, display_order, is_active                               | 5-10 itens                       |
| `methodology_pillars` | title, body, number, display_order, is_active                            | 3-5 itens                        |
| `locations`           | name, type, address, city, neighborhood, notes, display_order, is_active | 1-3 itens                        |

### Aplicando o checklist

- Campos nomeaveis? Sim
- Filtra/ordena/join frequente? **Nao** — so `WHERE professional_id = X ORDER BY display_order`
- Precisa de constraints/FK? **Nao** — nenhuma FK aponta para elas
- → Pelo checklist: **candidatas a JSONB**

### Tradeoffs identificados

**Se converter para JSONB:**

- Ganha: -4 tabelas, -16 RLS policies, -4 GRANTs, landing page vira 1 query em vez de 5
- Perde: CrudManager funciona out-of-the-box com tabelas, requer reescrever 4 managers + 4 lib/data files
- Nota: `landing-sections.ts` faz queries separadas a cada uma dessas tabelas para montar dados da landing

**Se manter como tabelas:**

- Ganha: infra de CrudManager ja pronta, RLS granular por item
- Perde: mais tabelas, mais policies, mais round-trips

---

## Descoberta 6: Tabelas `system_*` — candidatas a constantes no app

### O que existe

| Tabela                       | Rows | Conteudo                                                |
| ---------------------------- | ---- | ------------------------------------------------------- |
| `system_bmi_classifications` | 6    | Faixas de BMI (underweight, normal, etc). Padrao medico |
| `system_lead_statuses`       | 5    | Status do pipeline (prospect, contacted, etc)           |
| `system_plan_features`       | 13   | Features dos planos Core/Pro para landing page          |
| `system_plan_pricing`        | 4    | Precos dos planos                                       |

Todas tem `edited_by uuid` e `edited_at timestamptz` — pensadas para painel admin que nao existe.

### Uso no codigo

- `system_bmi_classifications`: lida na Edge Function `submit-form` e em `lib/data/bmi-classification.ts`
- `system_lead_statuses`: lida em `lib/data/lead-status.ts` para montar badges
- `system_plan_features`: lida em `lib/data/plan-features.ts` para landing page
- `system_plan_pricing`: lida em `lib/data/plan-pricing.ts` para landing page

### Aplicando o checklist

- Campos nomeaveis? Sim
- Filtra/ordena/join frequente? **Nao** — todas sao "le tudo de uma vez"
- Precisa de constraints/FK? **Nao** — dados imutaveis/raramente mutaveis
- Mudam com o tempo? **Nao** — mudam com decisoes de produto (deploy)
- → Pelo checklist: **candidatas a constantes** (`lib/domain/constants/`)

### Nota sobre `system_plan_pricing`

Se quiser mudar preco sem deploy, manter como tabela (ou mover para env var / config no Supabase). Para MVP, constante e mais simples.

---

## Descoberta 7: `leads` vs `clients` — NAO e duplicacao

### Contexto

Parece duplicacao a primeira vista porque leads tem colunas de client: `client_status`, `monthly_value_cents`, `plan_name`, `client_since`. Dados identicos quando lead vira client (mesmo nome, phone, status "active").

### Analise

**Nao sao redundantes.** Razoes:

1. Nem todo client passa por lead — profissional pode criar client que ja tinha antes de usar a ferramenta
2. Nem todo lead vira client — lead pode ficar em "prospect" pra sempre
3. As colunas de client em leads sao **denormalizacao intencional** para o Kanban do CRM (listar leads com info de conversao sem JOIN)
4. `clients` e entidade com ciclo de vida proprio (assessments, plans, sessions, payments, transformations, workouts)

---

## Descoberta 8: Tabelas corretamente modeladas (manter)

### CRM cluster

| Tabela                   | Rows | FKs                                                   | Justificativa                                  |
| ------------------------ | ---- | ----------------------------------------------------- | ---------------------------------------------- |
| `leads`                  | 12   | → professionals                                       | Pipeline de vendas, denormalizacao intencional |
| `clients`                | 2    | → professionals, → leads (optional)                   | Entidade com ciclo de vida proprio             |
| `client_plans`           | 0    | → clients, → plan_packages, → professionals           | Rastreia sessions_used, FK real                |
| `client_sessions`        | 0    | → clients, → client_plans, → professionals            | Log de sessoes, FK real                        |
| `client_payments`        | 0    | → clients, → client_plans, → professionals            | Pagamentos manuais, FK real                    |
| `client_assessments`     | 0    | → clients, → professionals                            | Referenciado por client_transformations via FK |
| `client_transformations` | 0    | → clients, → professionals, → client_assessments (x2) | FK before/after assessment                     |

### Landing page com FKs reais

| Tabela          | FK apontando PARA ela          | Justificativa                        |
| --------------- | ------------------------------ | ------------------------------------ |
| `services`      | `plan_packages.service_id`     | Nao pode virar JSONB — tem join real |
| `plan_packages` | `client_plans.package_id`      | Nao pode virar JSONB — tem join real |
| `testimonials`  | (tem FK → `clients.client_id`) | Relacao com client tem valor         |

### Subscricoes & pagamentos

| Tabela                         | Justificativa                                |
| ------------------------------ | -------------------------------------------- |
| `subscriptions`                | Entidade central de billing                  |
| `subscription_events`          | Event log, FK → subscriptions                |
| `payment_transactions`         | Registro de cobranca, FK → subscriptions     |
| `cancellation_feedback`        | Feedback de churn, FK → subscription_events  |
| `promotional_codes`            | Cupons, standalone                           |
| `promotional_code_redemptions` | FK → codes, → subscriptions, → professionals |

### Notificacoes & messaging

| Tabela                     | Justificativa                                                      |
| -------------------------- | ------------------------------------------------------------------ |
| `notification_preferences` | 1:1 com profiles, campos estaveis, query real em 5+ Edge Functions |
| `notification_requests`    | Fila/audit de notificacoes, service_role writes                    |
| `email_drip_schedule`      | Fila de drip, consumida por Edge Function                          |
| `wa_messages`              | Audit log WhatsApp, usado pra dedup em Edge Functions              |

### LGPD/compliance (obrigatorio)

| Tabela                  | Justificativa                                       |
| ----------------------- | --------------------------------------------------- |
| `consent_logs`          | Requisito legal, admin-only read, RPC writes        |
| `data_subject_requests` | Requisito legal, public INSERT, admin SELECT/UPDATE |

### Workout

| Tabela              | Justificativa                                  |
| ------------------- | ---------------------------------------------- |
| `workout_plans`     | FK de workout_exercises, FK → clients          |
| `workout_exercises` | Exercicios dentro de plano, FK → workout_plans |

### Infraestrutura

| Tabela                    | Justificativa                                             |
| ------------------------- | --------------------------------------------------------- |
| `profiles`                | Auth, 1:1 com auth.users                                  |
| `professionals`           | Entidade central                                          |
| `professional_modalities` | Modalidades do profissional, customization JSONB          |
| `slug_blocklist`          | Validacao de slug na RPC `claim_slug`, seguranca no banco |
| `webhook_logs`            | Audit de webhooks, payload JSONB (uso correto de JSONB)   |

---

## Descoberta 9: Influencer/Afiliados — questao aberta

| Tabela            | Rows | UI existente                                                                 |
| ----------------- | ---- | ---------------------------------------------------------------------------- |
| `influencers`     | 0    | `app/(influencer)/influencer/*` (dashboard, referrals, commissions, payouts) |
| `referrals`       | 0    | Mesmas paginas                                                               |
| `commissions`     | 0    | Integracao no webhook Asaas                                                  |
| `payout_requests` | 0    | Admin + influencer pages                                                     |

Sao 4 tabelas com UI completa, lib/data, RLS, integracao no webhook. **Zero uso real.** Decisao de produto: se afiliados sao pos-MVP, sao 4 tabelas + rotas + componentes que sao dead weight. Se sao MVP, manter.

---

## Analise JSONB vs Normalizado — recomendacoes do Supabase AI

> Analise feita pelo assistente Supabase com base no schema real. Complementa as descobertas acima.

### JSONB que esta CORRETO (manter)

| Campo                                                    | Razao                                           |
| -------------------------------------------------------- | ----------------------------------------------- |
| `professionals.landing_sections`                         | Payload de UI, schema variavel por tier         |
| `professionals.custom_links`                             | Lista flexivel, sem filtro por subcampo         |
| `professionals.onboarding_draft`                         | Draft temporario, schema muda rapido            |
| `leads.external_links`                                   | Payload flexivel                                |
| `webhook_logs.payload`                                   | Payload externo, nunca filtrado por subcampo    |
| `notification_requests.payload`                          | Fire-and-forget, blob                           |
| `subscription_events.metadata`                           | Evento com dados variaveis                      |
| `professional_customization_history.old_value/new_value` | Audit log, snapshot                             |
| `professional_modalities.customization`                  | Config de UI/IA por profissional, evolui rapido |
| `analise_template_options.parent_values`                 | Condicoes de dependencia, carrega e renderiza   |
| `client_transformations.metrics_before/after`            | Historico de metricas variaveis (NAO filtrado)  |

**Conclusao:** O uso de JSONB no projeto esta majoritariamente em areas de payload/snapshot, o que e saudavel.

### JSONB que MERECE atencao futura

| Campo                  | Risco                                                                        | Quando agir                      |
| ---------------------- | ---------------------------------------------------------------------------- | -------------------------------- |
| `intakes.answers`      | Se precisar filtrar "intakes onde answer X = Y" (ex: dashboard de analytics) | Quando analytics entrar          |
| `intakes.calculations` | Se precisar agregar metricas (ex: media de IMC dos leads)                    | Quando analytics entrar          |
| `intakes.result`       | Deep data. Se virar criterio de busca/relatorio, gargalo                     | Improvavel — so armazena e exibe |
| `intakes.extra_data`   | Sem uso atual. Monitorar                                                     | Se comecar a crescer             |

**Recomendacao:** Hoje `intakes.*` so armazena e exibe (snapshot). Nao filtram por subcampos. Manter JSONB. Se analytics entrar (Fase 10+), considerar `intake_calculation_archive` normalizado (que ja existe!) ou generated columns.

### Consequencias de migrar JSONB ↔ normalizado

**RLS:**

- JSONB → colunas: RLS melhora (policies com colunas simples e indexadas)
- Colunas → JSONB: RLS piora (dificil expressar policies com subcampos, indexing pior)

**RPCs:**

- JSONB → colunas: RPCs que usam `->>` / `jsonb_extract_path` precisam reescrita
- Colunas → JSONB: perde constraints/FK, parsing vira responsabilidade do codigo

**Estrategia segura de migracao (quando necessario):**

1. Adicionar colunas novas (dual-write temporario)
2. Backfill via migration
3. Ajustar RLS e RPCs
4. Desativar o campo antigo

---

## Resumo: o que avaliar quando retomar

| Grupo                   | Acao potencial                      | Tabelas                                                                                                                                | Complexidade                       |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Duplicacao real         | Dropar                              | `intake_calculation_archive`, `professional_customization_history`, 2 colunas JSONB de `client_transformations`, 8 tabelas `analise_*` | Baixa                              |
| Candidatas a JSONB      | Migrar para `professionals`         | `credentials`, `faq_items`, `methodology_pillars`, `locations`                                                                         | Media (requer reescrever managers) |
| Candidatas a constantes | Migrar para `lib/domain/constants/` | 4 tabelas `system_*`                                                                                                                   | Media (atualizar Edge Functions)   |
| Questao de produto      | Decidir escopo MVP                  | 4 tabelas de afiliados                                                                                                                 | Depende                            |
| Corretamente modelado   | Nada a fazer                        | Todo o resto (~31 tabelas)                                                                                                             | N/A                                |

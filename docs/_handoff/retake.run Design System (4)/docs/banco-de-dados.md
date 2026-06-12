# retake.run — Especificação do Modelo de Dados

> Documento-fonte para validar o schema com a IA do Supabase (tabelas, PK/FK, tipos).
> Cobre: entidades e relações, multi-tenant, planos/preços, sites/templates, temas por tenant,
> captação, alunos, **núcleo de treino de corrida**, agenda/recursos, eventos, produtos/commerce,
> patrocínio/marcas, cupons, comunicação, IA/vibe coding, roadmap/changelog/votos, auditoria/LGPD,
> i18n, a11y, versionamento — e o que mora no **banco/back** vs **front**.
>
> **Status:** especificação para validação. NÃO é ordem de construção — ver fases em §16.
> **Nomenclatura:** zero `desafit` / `onboarding`. Schema de produto = **`run.*`**; cross-cutting = **`public.*`**.

---

## 0. Convenções globais (valem para TODA tabela)

| Convenção | Regra |
|---|---|
| **Multi-tenant** | Toda tabela de produto tem `tenant_id uuid NOT NULL REFERENCES public.tenants`. Exceções: tabelas de plataforma (`parties`, `tenants`, `plans`, `prices`, catálogos globais, blocklist). |
| **PK** | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` em tudo. |
| **Timestamps** | `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz` (trigger). |
| **Soft delete** | `archived_at timestamptz NULL` onde faz sentido (tenants, sites, produtos). Nunca DELETE físico de dado com histórico. |
| **RLS** | Todas com RLS. Filtro por JWT direto: `tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid`. Sem subquery `EXISTS`. CI falha se faltar RLS. |
| **Mutação** | Multi-tabela só via RPC `SECURITY DEFINER` (`search_path=''`). Server actions = thin adapters. |
| **Versionamento imutável** | Onde há "versão" (páginas, prompts, temas, documentos): tabela `_versions` append-only + trigger que bloqueia UPDATE/DELETE. Ponteiro `current_version_id` na tabela-pai. |
| **Enum vs lookup** | Enum Postgres para conjuntos **fechados e estáveis** (status, kind). Tabela-lookup quando o tenant pode estender ou precisa de label/i18n/ordem. |
| **jsonb** | Para dados de forma variável, sem query relacional pesada (tokens, payload de bloco, terms de contrato, snapshot). Nunca para o que precisa de FK/agg frequente. |
| **Dinheiro** | `amount_cents int` + `currency char(3)`. Nunca float. Multi-moeda desde o desenho. |

---

## 1. Identidade & Multi-tenant (`public.*`) — o party model

> Papel mora na **relação**, não na entidade. Uma pessoa/empresa = 1 login (`party`), N papéis, N planos.

### `public.parties`
Quem existe no sistema (pessoa OU organização). Liga ao `auth.users`.
- `id`, `kind enum(person|organization)`, `auth_user_id uuid` (FK auth.users, nullable p/ leads/orgs sem login), `display_name`, `legal_name`, `document` (CPF/CNPJ), `country char(2)`, `preferred_currency char(3)`, `contacts jsonb` (emails/phones/social).
- **jsonb:** `contacts`. **enum:** `kind`.

### `public.party_roles`
Papel que uma party exerce, com escopo e vigência.
- `id`, `party_id FK`, `role_type enum`, `scope_kind enum(platform|tenant|event)`, `scope_id uuid` (nullable; aponta tenant/event conforme scope), `begin_date date`, `end_date date NULL`, `status enum(pending|active|suspended|ended)`.
- `role_type` ∈ `tenant · supplier_industry · supplier_distributor · supplier_manufacturer · supplier_nutrition_brand · service_provider · event_organizer · sponsor_platform · sponsor_tenant · sponsor_event`.
- **Decisão:** `role_type` como **enum** (fechado) + `valid_role_pairs` (lookup) para combinações permitidas.

### `public.valid_role_pairs`
Regras de quais papéis podem coexistir/contratar entre si. `role_a`, `role_b`, `relationship_kind`, `allowed bool`. (Pendente preencher.)

### `public.party_relationships`
Contrato/vínculo entre duas parties.
- `party_a_id` (oferece), `party_b_id` (contrata), `kind` (ex.: `brokered_by_platform`, `sponsorship`, `b2b_supply`), `terms jsonb`, `status`, `platform_fee_cents int`, `begin/end`.

### `public.tenants`
A assessoria/clube (cliente pagante). É um `party_role(role_type=tenant)` materializado para performance de RLS.
- `id`, `party_id FK`, `slug` (único, `retake.run/{slug}`), `display_label` ("assessoria"/"run club"/"equipe" — só rótulo, **sem subtipo**), `city`, `state char(2)`, `status enum(active|idle|suspended|archived)`, `theme_tokens jsonb`, `settings jsonb`.
- **front × back:** `theme_tokens` mora no banco; o **derivado** (secondary/surfaces) é calculado e injetado inline no front (ver §3).

### `public.profiles`
Perfil de pessoa logada dentro de contexto (atleta, staff). 1 party pode ter profile por tenant.
- `id`, `party_id FK`, `auth_user_id`, `full_name`, `avatar_url`, `locale`, `a11y_prefs jsonb` (reduce-motion, font-scale, contrast).

### `public.memberships`
Papel de uma pessoa **dentro de um tenant** (autorização escopada por tenant).
- `id`, `tenant_id FK`, `party_id FK` (ou profile), `role enum(owner|coach|finance|reception|marketing|athlete|lead)`, `permissions jsonb` (override fino opcional), `status`, `invited_at`, `joined_at`.
- **enum:** `role` (as 7 pessoas do tenant). **JWT** carrega `tenant_id` + `role` ativos.

### `public.domains`
- `tenant_id`, `mode enum(path|subdomain|cname)`, `value` (slug/host), `status enum(pending|verifying|active|error)`, `verified_at`, `dns jsonb`.

### `public.slug_blocklist`
Lista de slugs reservados/proibidos. `slug`, `reason`.

---

## 2. Planos, Preços, Features, Uso (`public.*`)

> Preços **no banco**, editáveis sem deploy. Plano controla features+cotas, não o tipo de cliente.

### `public.plans`
- `id`, `audience enum(tenant|sponsor|supplier)`, `code` (ex.: `free`, `apoiador`, `membro`, `sponsor_estadual`, `sponsor_nacional`, `b2b_vitrine`), `name`, `description`, `sort`, `is_public bool`, `contract enum(none|monthly|annual|biennial)`.

### `public.plan_features`
Mapeia feature → plano. `plan_id`, `feature_key` (lookup), `value jsonb` (limite/flag, ex.: `{ "events_max": 3 }`).

### `public.features`
Catálogo de chaves de feature (lookup). `key`, `label`, `kind enum(boolean|quota|enum)`, `description`. (i18n no label.)

### `public.prices`
- `plan_id FK`, `recurrence enum(monthly|quarterly|annual|biennial|one_time)`, `amount_cents`, `currency`, `effective_from`, `effective_to NULL`. Permite preço por estado extra (patrocínio) via `meta jsonb`.

### `public.subscriptions`
- `tenant_id` (ou `party_id` p/ sponsor/supplier), `plan_id`, `price_id`, `status enum(trialing|active|past_due|canceled|paused)`, `current_period_end`, `gateway enum(efi|pagarme)`, `gateway_ref`, `founder bool`, `founder_locked_until date` (preço travado 2 anos).

### `public.feature_usage`
Cotas com reset. `tenant_id`, `feature_key`, `period_start`, `used int`, `limit int`, `resets_at`.

---

## 3. Temas por tenant, Templates, a11y (`public.*` + `run.*`)

### `public.tenant_themes` + `public.tenant_theme_versions` (versionado)
- `tenant_id`, `current_version_id`. Version: `tokens jsonb` (primary, mode, shape, density, logo_url, favicon_url, app_name), `derived jsonb` (cache de secondary/tertiary/surfaces gerados por `deriveTokens`), `contrast_report jsonb` (APCA Lc por par), `created_by`.
- **front × back:** **banco** guarda `tokens` (input do usuário/IA) e o `derived` cacheado. **Front** injeta `derived` inline em `<html style>` via CSS vars; `deriveTokens(primary)` roda no server (Edge) na hora de salvar e valida **APCA Lc ≥ 60**.
- **a11y:** contraste validado no save (não no front); `profiles.a11y_prefs` aplica reduce-motion/font-scale no runtime do front.

### `run.templates` (registry de templates de site)
- `id`, `code`, `name`, `kind enum(tenant_site|landing|deck)`, `preview_url`, `schema jsonb` (quais blocks aceita), `min_plan` (Apoiador usa template; Membro = bespoke fora do template).
- **Nota:** fase artesanal = composição no código (deploy). Registry emerge depois de ~5-10 sites. Tokens/conteúdo no banco já (revalida em segundos); composição no código (lento, pago).

### `run.public_pages` + `run.page_versions` (versionado, imutável)
- Page: `tenant_id`, `template_id`, `slug`, `status enum(draft|published)`, `current_version_id`, `seo jsonb`.
- Version: `blocks jsonb[]` ou via `page_blocks` normalizado (ver §4 library_item placement). Imutável (trigger bloqueia UPDATE/DELETE).

---

## 4. Biblioteca & Composição (`run.*`) — `components` → `library_item`

> UMA biblioteca, referenciada por **placement (nunca cópia)**. Anti-EAV: kind tipado + tabelas de placement.

### `run.library_items`
- `tenant_id` (ou global se `tenant_id IS NULL` = catálogo da rede), `kind enum(workout_segment|content|exercise|block)`, `name`, `payload jsonb` (forma varia por kind), `tags text[]`, `version int`.
- **jsonb:** `payload`. **enum:** `kind`.

### Tabelas de placement (FK explícita, não cópia)
- `run.training_day_items` → referencia `library_item` (kind=workout_segment) no calendário (§6).
- `run.module_items` → referencia `library_item` (kind=content) num curso/programa (§5 conteúdo).
- `run.page_blocks` → referencia `library_item` (kind=block) numa página (§3).
- Cada placement: `id`, `parent_id`, `library_item_id FK`, `sort`, `overrides jsonb` (ajustes locais sem mutar o item).

---

## 5. Conteúdo (modelo Hotmart, desacoplado — `run.*`)

> "Programa" foi **decomposto**: venda→plan/subscription; treino→calendário (§6); conteúdo→aqui.

### `run.programs` · `run.modules` · `run.module_items`
- Program: `tenant_id`, `title`, `sale_model enum(perpetual|cohort)`, `cohort_mode`, `access enum(plan_included|paid_addon|public)`, `status`.
- Module: `program_id`, `title`, `sort`.
- module_item: placement → `library_item(kind=content)` | tipo de aula (`video|live|presencial|pdf|quiz|exercise`), `unlock_rules jsonb`.
- `run.component_progress`: `profile_id`, `module_item_id`, `status`, `progress jsonb`. Certificado: `run.certificates`.
- **Membro:** até 5 `programs` divulgados (vitrine), sem intermediar pagamento no MVP.

---

## 6. Núcleo de treino de corrida (`run.*`) — O FOSSO

> Vocabulário validado (TrainingPeaks/TrueCoach/TrainerRoad/NSCA). Treino **segmentado**, não monolítico.

### `run.athlete_thresholds`
Pré-requisito do modelo de carga. `tenant_id`, `athlete_id FK profiles`, `pace_threshold`, `hr_threshold`, `measured_at`, `zones jsonb` (calculadas do threshold), `source enum(test|manual|wearable)`.

### Periodização (hierarquia)
- `run.macrocycles`: `tenant_id`, `athlete_id` (ou template), `goal`, `start_date`, `end_date`, `target_event_id NULL`.
- `run.mesocycles`: `macrocycle_id`, `focus enum(base|build|peak|transition)`, `weeks int`, `target_load jsonb`.
- `run.microcycles`: `mesocycle_id`, `week_start`, `target_load`.
- `run.sessions`: `microcycle_id`, `date`, `title`, `modality enum(run|...)` (corrida agora; endurance depois), `status`.

### `run.training_day_items` (o treino segmentado)
- `session_id`, `library_item_id FK` (kind=workout_segment) ou `inline jsonb`, `sort`, `target jsonb` (pace|hr|power|rpe + alvo ou faixa), `kind enum(warmup|work|recovery|cooldown)`.

### `run.training_plan_templates`
Plano reutilizável across alunos/temporadas. Estrutura espelhada (meso/micro/session/day_item) com `library_item` por referência.

### Prescrito × Executado (loop central)
- `run.workout_executions`: `training_day_item_id` (ou session), `athlete_id`, `executed jsonb` (pace/dist/hr/rpe realizados), `compliance enum(green|yellow|red)`, `source enum(manual|wearable)`, `wearable_activity_id NULL`.
- `run.wearable_connections`: `athlete_id`, `provider enum(garmin|strava|polar|coros|apple)`, `tokens jsonb` (cifrado), `status`.
- `run.wearable_activities`: atividade crua sincronizada → processada vs threshold.
- **Fase 2:** carga TSS/CTL/ATL/TSB (`run.load_metrics`) + PMC.

---

## 7. Alunos & Gestão (`run.*`)

- `run.athletes` (ou usa `memberships` role=athlete + `profiles`): `tenant_id`, `profile_id`, `status enum(active|paused|canceled|overdue)`, `level`, `group_id`, `goal`, `joined_at`.
- `run.anamnese`: `athlete_id`, `health jsonb` (lesões, restrições, medicamentos), `updated_at`.
- `run.assessments`: `athlete_id`, `kind` (VO2/FC/peso/teste), `value jsonb`, `measured_at` (histórico/evolução).
- `run.athlete_notes`: notas internas, timeline.
- `run.groups`: turmas/grupos/nível/cidade (segmentação).

---

## 8. Agenda & Recursos (`run.*`)

- `run.classes`: `tenant_id`, `title`, `mode enum(presencial|online|hibrido)`, `location`, `capacity`, `recurrence jsonb`, `coach_id`.
- `run.class_sessions`: ocorrência (data/hora), `class_id`, `status`.
- `run.attendance`: `class_session_id`, `athlete_id`, `checked_in_at`.
- `run.resources`: salas, banheira de gelo, sala de massagem, recovery, equipamentos. `kind`, `capacity`, `bookable bool`.
- `run.resource_bookings`: `resource_id`, `athlete_id`, `slot`, controla cota por plano (`feature_usage`).

---

## 9. Eventos & Provas (`run.*`) — calendário mantido pelas assessorias

- `run.events`: `tenant_id NULL` (prova externa) ou do tenant, `name`, `type enum(rua|trail|revezamento|treinao|clinica|viagem)`, `date`, `city`, `state`, `distances text[]`, `price_from_cents`, `external_signup_url`, `source enum(managed|imported|suggested)`, `status enum(queue|published|archived)`, `verified bool`, `organizer_party_id NULL`.
- `run.event_lots`: lotes (organizador gerencia). `event_id`, `name`, `distance`, `price_cents`, `cap`, `sold`, `window`.
- `run.event_registrations`: inscritos (quando houver checkout próprio — fase futura). `event_id`, `athlete_id/party_id`, `lot_id`, `payment_status`, `checkin_at`.
- `run.event_moderation`: fila/flags anti-fake (`reports int`, `dupe_of`, `domain_ok bool`, `cnpj_ok bool`).
- **Regra:** retake **não** mantém o conteúdo do calendário — assessorias atualizam suas provas. retake mantém a estrutura/curadoria.

---

## 10. Produtos & Commerce (`run.*`) — físico, dropship, B2B/B2C

- `run.products`: `tenant_id` (loja do clube) ou `supplier_party_id` (catálogo do fornecedor), `kind enum(physical_stock|dropship|digital|service|subscription|event)`, `name`, `description`, `images jsonb`, `status`.
- `run.product_variants`: `product_id`, `attributes jsonb` (tamanho/cor/sabor), `sku`, `price_cents`, `stock int NULL` (null = dropship).
- `run.commission_rules`: quem define preço/comissão = **retake** por produto/categoria (não fornecedor/assessoria). `scope`, `percent`/`amount`, `waterfall jsonb`.
- `run.orders` + `run.order_items`: `tenant_id`, `buyer_party_id`, `status`, `totals jsonb`, `split jsonb` (3 vias: fornecedor/assessoria/retake), `fulfillment enum(local_pickup|local_delivery|ship_supplier)`.
- `run.suppliers` (perfil B2B / vitrine): `party_id`, `categories text[]`, `verified`, `profile jsonb`. Onboarding KYC/KYB.
- **Fases:** B2C atacado/dropship + B2B + divulgação. Split (Pagar.me) = fase marketplace. APIs de integração com sistemas do fornecedor = futuro.

---

## 11. Patrocínio, Marcas, Cupons (`public.*`/`run.*`)

- `public.sponsorships`: `party_id` (a marca), `tier enum(estadual|nacional|oficial|institucional)`, `scope_states text[]` (geográfico), `status`, `subscription_id`, `founder bool`, `assets jsonb` (logo/banner).
- `run.brand_placements` (faixa de marcas): onde a marca aparece. `sponsorship_id`, `position int`, `fixed bool`, `surface enum(marquee|brand_page)`, `state_scope`, métricas (`impressions`, `clicks`) — métricas agregadas (cache) ou tabela de eventos.
- `run.coupons`: `code`, `owner enum(retake|sponsor)`, `discount`, `affiliate_program enum(awin|rakuten|direct)`, `commission jsonb`, `status enum(pending|approved|live)`. **Cupom = receita da retake**, não produto vendido à marca; corredor pega no site da rede.
- `run.coupon_redemptions`: rastreio (código/UTM/postback).

---

## 12. Comunicação (`public.*`/`run.*`)

- `run.email_templates`, `run.push_templates`: editáveis por tenant, i18n.
- `public.push_subscriptions`: Web Push (RFC 8292), `tenant_push_secrets`.
- `run.notifications`: in-app (Realtime fase 2). `recipient_profile_id`, `kind`, `payload jsonb`, `read_at`.
- `run.message_threads` / `run.messages`: chat treinador↔aluno.
- `run.communication_log`: régua automática (boas-vindas, D+7, renovação, inadimplência) — histórico por aluno.

---

## 13. IA & Vibe coding (`public.*`)

- `public.ai_prompts` + `public.ai_prompt_versions`: registry versionado (imutável).
- `public.ai_generations` (= `ai_invocations`): log de execução + `public.ai_usage_monthly` (consumo/cota por tenant).
- `public.chats` / `public.messages` / `public.documents` / `public.document_versions` (imutável estilo Hotmart): base do vibe coding (edição de tokens/conteúdo via chat).
- `public.engine_plans`: **Plan Approval Gate** (IA propõe → usuário aprova → aplica). `pipeline_runs` (state machine).
- `public.projects`: agrupa chats + instruções (estilo Claude.ai).
- **front × back:** prompts e logs no banco; o **pipeline** (4 estágios: identidade→estrutura→componentes→coerência) roda no back (Edge/AI Gateway). Front só dispara e mostra o stream/aprovação.

---

## 14. Roadmap, Changelog & Votos (`public.*`) — build in public

- `public.roadmap_items`: `title`, `description`, `horizon enum(now|next|later)`, `theme`, `status enum(idea|planned|in_progress|shipped)`, `public bool`, `sort`.
- `public.feature_votes`: `roadmap_item_id`, `party_id`, `weight int` (só Apoiador/Membro votam → validar via membership/subscription). Voto **prioriza**, decisão é da retake.
- `public.changelog_entries`: `title`, `body`, `type enum(novo|melhoria|em_breve)`, `published_at`, `by_community bool`, `roadmap_item_id NULL` (liga shipped→changelog).
- **front × back:** o board e o contador são UI; o estado (votos, horizonte, status) no banco.

---

## 15. Auditoria, LGPD, Versões (`public.*`)

- `public.audit_log` (append-only) + `public.content_audit_log`.
- `public.consents`: consentimento LGPD por party; export/delete requests.
- `public.webhook_deliveries`: retry de webhooks (gateway, melhor envio futuro).
- `public.outbox` (`form_submission_outbox`): outbox pattern p/ fan-out pós-submissão.
- **Versionamento (padrão repetido):** qualquer `_versions` é append-only + trigger anti-UPDATE/DELETE + `current_version_id` no pai. Aplica a: pages, themes, prompts, documents.

---

## 16. i18n & a11y (estratégia)

- **i18n:** next-intl 4, **pt-BR único no MVP**, `messages/en-US.json` espelho. Strings de UI = **front** (arquivos de mensagem). Conteúdo do tenant (nome de plano, labels de feature, templates de e-mail) = **banco**, com coluna `i18n jsonb` (`{ "pt-BR": "...", "en-US": "..." }`) ou tabela `*_translations` quando houver muitos idiomas. **Decisão a validar:** `i18n jsonb` inline (simples, MVP) vs tabela de tradução normalizada (escala).
- **a11y:** contraste APCA (Lc ≥ 60) validado no save do tema (back). `profiles.a11y_prefs` (reduce-motion, font-scale, contrast) aplicado no front. Hit targets ≥ 44px, foco visível — regra de front, não banco.

---

## 17. Separação BANCO/BACK × FRONT (resumo)

| Mora no **banco + back** | Mora no **front** |
|---|---|
| `theme_tokens` (input) + `derived` cacheado; `deriveTokens` + APCA no Edge ao salvar | Injeção dos CSS vars inline; transições, motion, hover/press |
| Preços, planos, features, cotas (`feature_usage`) | Render dos cards de preço, toggle anual/bienal |
| Conteúdo de página (`page_versions`, `page_blocks`/`library_item`) | Composição/layout do template, animações |
| Strings de domínio do tenant (`i18n jsonb`) | Strings de UI (`messages/*.json`) |
| Votos, roadmap, changelog (estado) | Board, contador, interações |
| Pipeline de IA (prompts, generations, engine_plans) | Disparo, stream, tela de aprovação |
| Split, comissão, pedidos, pagamentos | Checkout UI (gateway hospedado/embed) |
| RLS, RPC, auditoria, LGPD | Nada de acesso direto ao Supabase de componente |

---

## 18. Decisões de tipo — guia rápido para validar

- **enum (fechado/estável):** `parties.kind`, `party_roles.role_type`, `memberships.role`, `subscriptions.status`, `events.type/source/status`, `products.kind`, `sponsorships.tier`, `roadmap_items.horizon`, `compliance(green|yellow|red)`, `mesocycles.focus`.
- **lookup table (extensível/i18n/ordem):** `features`, `plans`, `valid_role_pairs`, categorias de fornecedor/produto.
- **jsonb (forma variável, sem agg relacional):** `theme_tokens`/`derived`, `library_items.payload`, `target` de treino, `terms` de relationship, `split`, `assets`, `i18n`, `a11y_prefs`, `unlock_rules`.
- **normalizado (FK, query/agg frequente):** toda a hierarquia de treino, placements (training_day_items/module_items/page_blocks), orders/order_items, feature_usage, brand_placements, votos.
- **imutável + versions:** pages, themes, prompts, documents.

---

## 19. Pendências a decidir (antes de migrar)

1. Nome do schema de produto: **`run.*`** (recomendado) vs `app.*`.
2. `valid_role_pairs` — preencher a matriz de combinações permitidas.
3. i18n: `jsonb` inline vs tabela de tradução (recomendo `jsonb` no MVP pt-BR único).
4. Dinheiro no marketplace: split direto pro tenant vs passar pela retake (híbrido por tipo de transação).
5. Merchant of Record nas vendas (responsabilidade fiscal).
6. `athletes` como tabela própria vs `memberships(role=athlete)` + `profiles` (recomendo tabela própria `run.athletes` por causa dos campos de domínio).
7. Regra de eventos no nível Membro (quantos / ilimitado).
8. Métricas de marca (`impressions`/`clicks`): coluna agregada cacheada vs tabela de eventos.

> **Próximo passo:** introspecção MCP do banco `platform` (list_tables/list_migrations) para comparar o que já existe vs esta especificação, e classificar cada tabela em **aproveitar / refatorar / dropar** (ver contexto §8). Só então gerar migrations via `mcp__supabase__apply_migration`.

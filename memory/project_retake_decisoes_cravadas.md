---
name: retake.run — decisões cravadas (validação ponto-a-ponto 2026-06-11)
description: Decisões validadas com user na sessão de pivot retake.run, formato 1 ponto por vez (era → vai ser → suja sugestão → confirma). Acumula conforme avança.
type: project
originSessionId: 6e98177a-6f93-4968-a264-1da387e8331d
---

Validação ponto-a-ponto pra cravar entendimento do pivot retake.run, antes de qualquer refactor de código. Cada item = "como era no desafit" + "como vai ser no retake" + decisão cravada.

**Why:** user explicitamente pediu "antes de tomar decisões precipitadas, vamos confirmar o entendimento". Pattern: 1 ponto por vez, simples/resumido, eu proponho, user confirma/ajusta.

**How to apply:**

## Ponto 1 ✅ Marca única + schema único public + URL path-default

**(REVISADO 2026-06-11: schema único `public.*` confirmado, não duplo)**

- Apagar `public.brands` + ADR-0024 + `useBrand()` + lógica multi-brand inteira
- Apagar `.claude/rules/brand.md`
- **Tudo em `public.*`** — schema único confirmado (ADR-0033 sobrevive). Fronteira de segurança = RLS por tenant. Schema separado SÓ JIT com gatilho real (PCI scope, secrets vault, audit append-only) — abre ADR específica
- URL default = path `retake.run/{slug}`. Subdomain/CNAME via `public.domains` controlado por entitlement do plano (Apoiador/Membro)
- **Tema do tenant aplica SÓ no site público** dele. Dashboard + app + tudo retake.run usa NOSSO design system fixo (grafite/creme/terracota, Oswald display, Hanken body, Space Mono métricas)
- Antes cada tenant tinha PWA próprio — agora app nativo único retake
- `public.tenant_themes` versionado + derived cacheado + APCA Lc ≥ 60 validado no save

## Princípio universal cravado — zero exposição client-side

**Why:** user cravou "importante é não ficar nada exposto no client side". Segurança baseline pra tudo retake.

**Regras (aplicam SEMPRE):**

- Service role key Supabase NUNCA no client. Só Edge Functions + Server Actions
- Sensitive data (CPF/CNPJ, dados financeiros, secrets, chaves API, tokens wearable cifrados) NUNCA chega ao browser
- Mutações = Server Actions ou API routes com `import 'server-only'` no top. Client nunca chama Supabase mutate direto
- Reads sensíveis = RSC + Server Action (não browser query direto, mesmo com RLS)
- Realtime channels = auth strict + RLS row-level + scope obrigatório por tenant
- Edge Function + AI provider keys + gateway keys (Pagar.me/Efí/Asaas) = SOMENTE Edge/Server
- `lib/data/*` lança erro server-side. Server Actions traduzem pra `Result` antes de ir ao client
- Schema introspection: anon role nunca vê tabelas internas (revoke explícito)
- JWT carrega apenas: tenant_id, role, party_id (nada além)
- Hooks/`useEffect` nunca pra fetching sensível — mover pra RSC

**Como verificar:**

- Checklist `lib/data/*` tem `import 'server-only'`
- Splinter advisor `mcp__plugin_supabase_supabase__get_advisors security` zero novos warnings pós-cada migration
- ESLint custom rule bloqueia `createClient` (anon) em paths não-públicos

## Ponto 2 ✅ App: PWA per-tenant+per-brand → app nativo único retake

**Estado real verificado (não suposição):**

- `app/sw.ts` SW genérico
- `app/api/tenants/[id]/manifest.webmanifest/route.ts` — manifest dinâmico per-tenant (cada profissional 1 PWA)
- `app/api/brands/[id]/manifest.webmanifest/route.ts` — manifest dinâmico per-brand (desafit/yoga/ingles)
- Serwist habilitado prod, desabilitado dev (`next.config.ts:87-90`)
- ADR-0014 + blueprint 08 PWA

**Decisão cravada:**

- Apagar PWA inteiro: `app/sw.ts` · `app/serwist/[path]/route.ts` · routes manifest both tenant+brand · icon routes per-tenant · withSerwist no next.config
- Desinstalar `@serwist/turbopack`, `@serwist/next`, `serwist`
- Reverter ADR-0014 + blueprint 08
- Apagar assets PWA (apple touch icons, splash screens)
- App nativo único retake (Apple/Google) = próxima fase JIT (React Native/Expo decisão pós-MVP web)
- UI kit `athlete-app/` no handoff = referência visual + spec, não implementação web
- 1 codebase Next 16 puro: dashboard tenant + sites públicos tenant + landings retake + admin retake

## Ponto 3 ✅ Party model + 5 camadas de auth

**Estado real:** flat `tenants + memberships(role)` + brand_id multi-marca

**Decisão cravada — agora estrutural:**

- `public.parties` (pessoa OR org, liga `auth.users`)
- `public.party_roles` (role_type + scope_kind + status)
- `public.party_relationships` (vínculos entre parties, terms jsonb, platform_fee_cents)
- `public.tenants` materializado de `party_role(tenant)` pra perf RLS
- `public.memberships` enriquecido: role enum 7 valores (owner/coach/finance/reception/marketing/athlete/lead) + position_label text NULL + permissions jsonb DEFAULT '{}' + group_id uuid NULL
- `public.groups` + `group_assignments` (data scope: coach só vê seu grupo)
- `public.profiles` (a11y_prefs jsonb)
- `public.domains` (path/subdomain/cname per-tenant)
- `public.slug_blocklist`
- JWT injeta: tenant_id + active_membership_role + party_id

**JIT (extension points cravados, vazios até gatilho):**

- `valid_role_pairs` (popular sob pressão)
- `service_provider` party_role (nutricionista terceirizada etc)
- Audit detalhado por resource
- ReBAC formal OpenFGA/Permify (REJECT até 3+ tenants pedirem)

**NÃO criar (over-engineering):**

- Tabela `titles` normalizada (texto livre basta)
- Per-resource ACL
- `party_organization_links` separada (1 party N memberships cobre)
- Multi-MFA por role

**Industry-confirmed:** Silverston UDM + WorkOS RBAC multi-tenant + Permit.io + AWS Prescriptive + TrainingPeaks/FinalSurge (data scope por grupo, não role).

## Ponto 4 ✅ Tokens & Tema: DS retake fixo + tema só do site público

**2 universos visuais separados:**

**Universo 1 — DS retake fixo (intocável):**

- Painel + admin + landings retake + app nativo
- Grafite #1D1D1B (60%) + Creme #F1ECE2 (25%) + Terracota #D96C3A (10%) + Azul Oceano + Cinza Mineral
- Oswald display UPPERCASE condensed + Hanken Grotesk body + Space Mono métricas
- 8pt grid · radii 2-24 + pill 999 · shadows S100/S200/S300 warm · motion 120/200/360ms ease-out
- Vivem hardcoded em `app/globals.css @theme inline`

**Universo 2 — Tema do site público do tenant (editável):**

- 3 níveis cravados:
  - **Grátis** = 6 presets curados pela retake (escolhe 1 de 6 paletas)
  - **Apoiador** = theme builder completo (clone tweakcn reescopado pros tokens retake-flavored) + IA extrai cor de foto/Instagram/logo + versionamento imutável
  - **Membro** = retake constrói à mão + theme builder disponível pra edição posterior
- `tenant_themes` + `tenant_theme_versions` versionado imutável
- `deriveTokens(primary)` Edge Function — gera surfaces/secondary, valida APCA Lc ≥ 60
- SSR injeta `derived` inline em `<html style>` no layout do site público

**Arquitetura componentes:**

- `components/ui/*` — shadcn primitives token-agnostic (`Button`/`Card`/`Input`) — zona quarentenada
- `components/retake/*` — componentes atléticos retake-only (StatCard mono pace, ComplianceTag green/amber/red, ícone pista, marquee marcas) — consomem tokens fixos retake (`--terracota`/`--grafite`) hardcoded
- `components/site/*` — blocos do site público (Hero, Pricing, Sponsor Bar)
- Layouts segregam contexto:
  - `app/(painel)/*` + `(auth)/*` + `(admin)/*` + `(landings)/*` = tokens retake fixos
  - `app/(site-publico)/[slug]/*` = injeta tokens derivados do tenant no SSR

**Theme builder atual sobrevive mas refatorado:**

- Pattern Zustand store + persist + skipHydration sobrevive
- Pipeline DB → snapshot → SSR injection sobrevive
- `colorFormatter` (OKLCH↔HEX↔HSL) sobrevive (útil pro Edge derivar)
- APCA contrast lib sobrevive
- UI complexo dos 28 sliders + 9 seções control panel + 6 demos preview = REWORK pra reescopar tokens retake-flavored
- Conceitos archetype/palettes (era do desafit) = APAGAR
- 45 keys shadcn-canonical per-tenant = SUBSTITUIR por ~5 inputs do tenant (Apoiador) + 6 presets curados (Grátis)

## Ponto 5 ✅ Page Engine: 1 template fixo + galeria de estilos + chat-as-form + dados em tabelas

**Decisão raiz:**

- Retake decide composição (não tenant, não IA livre escolhendo blocos)
- 1 template fixo dia 1 (todos planos usam ele)
- Galeria de estilos curados depois (Apoiador) — minimalista/neo-brutalism/swiss/editorial/etc — clica → re-aplica dados existentes
- Membro = bespoke 100% retake
- Tenant pode toggle visibilidade de seções em qualquer plano

**Cadastros vs Copy:**

- Dados em tabelas próprias template-agnostic: `coaches` (treinadores/equipe), `plans`, `services`, `testimonials`, `gallery`, etc — qualquer template lê
- Copy/texto em `page_versions.content jsonb` por template — sem UI tradicional de edição
- Edição copy = chat (vibe coding). Edição dados = dashboard manual.

**Onboarding chat-as-form:**

- Chat É o formulário. Perguntas em ordem + uploads inline (drag+crop) + IA extrai tudo (paleta/copy/dados/voz/contexto)
- Após preview renderizado, chat continua operacional pra ajustes
- Chat tem acesso a jsonb + arquivos + cadastros
- NÃO escolhe blocos/seções

**Paletas:**

- 6 presets curados retake (Grátis)
- 1 personalizada IA-extraída — aparece pra todos (upsell visível), badge "Apoiador", mensagem ao selecionar, popup pagamento ao publicar
- Sem trial

**Edição pós-onboarding:**

- Chat pra copy/texto/tokens/arquivos (vibe coding dia 1)
- Dashboard manual pra dados (preços/equipe/galeria/toggle seções/ordem fotos)

**Registry híbrido (Opção C):**

- Banco como SSOT runtime: `run.blocks` + `run.styles` + `run.templates` apontam pros componentes versionados em código
- JSON registry espelha pra dev linting + futuro CLI
- Pattern Webstudio/Plasmic

**Builder livre JIT:**

- Distinção cravada: editor vibe (chat tokens/copy/dados) = dia 1; builder livre páginas (escolhe seções/reordena/monta do zero) = decisão JIT do user sem gatilho automático
- User decide a hora certa

**Aproveita do trabalho atual:**

- 13 sections `athletic-editorial` → vira primeiro template `retake-default` (refatorar tokens + copy)
- 14 motion utilities → vira motion library reusável (podar os heavy)

**Apaga:**

- 22 block kinds Zod schemas
- Engine handler page-landing + 10 tools + ADR-0058 + ADR-0053
- Migrations 0053-0056 (refazer alinhado handoff §3)
- Rules `vibe-coding-builder.md` + `registry-blocks.md` antigos
- Templates atuais arq desafit (athletic-editorial archetype morto)

## Ponto 6 ✅ Form Engine: engine genérico → 3 categorias com solução adequada

**Apaga engine genérico inteiro:**

- `lib/contracts/form-engine/` (14 block kinds + definition + steps + logic + plan-spec + suggestions + submission + response)
- `features/forms/` (builder + editor 8 tabs + list + renderer multi-step)
- `lib/engines/handlers/form-lead-capture.ts` + 14 tools
- Migrations 0015, 0045-0051 (refazer alinhado handoff)
- ADR-0041 + blueprint 22 + blueprint 26 (201KB) + rule `forms-engine.md`

**3 categorias cravadas:**

**1. Captação de lead (site público do tenant) — híbrido fixo+jsonb:**

- Campos fixos retake: nome, email, telefone, objetivo enum, experiência enum, **local** (puxa de `tenant_locations` cadastrados — presencial com cidades + online + híbrido), aceite LGPD
- Campos custom em `forms.custom_questions jsonb` — perguntas específicas via chat (vibe coding edita jsonb), não via builder UI
- Herda tokens do tenant

**2. Anamnese (app atleta) — JIT, arquitetura aberta:**

- Não construir dia 1
- Tabela `run.anamnese (athlete_id, health jsonb, running_history jsonb, updated_at)` reservada — flexível pra forms estruturados depois sem migration nova
- Quando construir: mesmo padrão fixos retake + jsonb pra custom

**3. Forms internos operacionais — RHF tradicional:**

- Login/signup/dashboard/criar atleta/criar plano/admin cadastros (patrocínio/fornecedor/evento) = RHF + Zod direto, shadcn `<Form>` canonical
- Sem engine, sem registry, sem vibe coding

**Arquitetura futuros forms:**

- Tabela genérica `run.tenant_forms (id, tenant_id, kind enum, fixed_fields jsonb, custom_questions jsonb, version int)` + `run.tenant_form_submissions`
- Dia 1 só popula `kind=lead_capture`. Avaliação/sugestão/app atleta JIT.

**Ordem de execução cravada dia 1:**

1. Sites públicos tenants (template + tokens + captação)
2. Painel de leads (dashboard tenant)
3. Resto JIT

**Princípio:** dados sempre no banco — chat/IA edita via Server Actions, nunca arquivos.

**Sobrevive:**

- Rule `state-management.md` (RHF vs Zustand split) — neutra
- Outbox pattern (`run.form_submission_outbox`) — fan-out leads
- Pattern shadcn `<Form>` canonical

## Ponto 7 ✅ IA: arquitetura multi-agent + UX Opção C híbrida

**Visão:** IA = diferencial estratégico, vai estar em tudo no futuro maduro. Dia 1 chat geral operacional, schema preparado pra agentes especializados plugarem JIT.

**Arquitetura backend (cravar agora):**

- `public.chats(id, tenant_id, agent_kind enum, scope_id uuid NULL, party_id, title)` — `agent_kind` permite N agentes (`general` dia 1, `site_editor`/`report`/`suggestion`/etc JIT). Substitui ADR-0069 dual-scope.
- `public.messages` linear por thread
- `public.ai_tools(id, name, agent_kinds[], schema jsonb, requires_approval bool, risk_level enum)` — tools registry SSOT
- `public.engine_plans` (existe) — approval gate genérico, opt-in por tool
- `public.audit_log` — toda mutação via IA grava com actor=ai, tool, params, result
- `public.ai_prompts` + `_versions` imutável (existe) — prompt por agent_kind
- `public.ai_usage_monthly` (existe) — cota/billing por plano

**UX cravada — Opção C híbrida:**

- 🟦 **Chat com preview dentro de surfaces de criação**: `/dashboard/meu-site` tem chat à esquerda + site à direita (estilo v0/Lovable). Replica em `/dashboard/relatorios/[atleta]` quando construir.
- 🟧 **Chat geral em balão flutuante (canto inferior direito)**: sempre acessível em qualquer tela do painel. Comandos dia-a-dia ("cadastra esse lead + print whatsapp", "lista todos os leads dessa semana"). Sem preview, output em tabelas/listas no chat + botões export (CSV/PDF).
- 🟩 **Inline ✨ + `/ai`**: espalhado em campos chave (headline/descrição/mensagem) e editores de texto. Não abre nada.

**Stack IA sobrevive:**

- AI SDK v6 + AI Gateway + Sonnet 4.6 + Haiku 4.5 + cache TTL 1h
- 9 AI Elements primitivos reusáveis pras 3 formas UX
- Multimodal input + Supabase Storage uploads
- Tabelas `chats/messages/engine_plans/pipeline_runs/ai_prompts/ai_generations/ai_usage_monthly`

**Ajusta (não apaga):**

- ADR-0069 dual-scope vira multi-agent (project_id → scope_id + adiciona agent_kind)
- 12 artifact kinds — manter úteis (text/image/sheet/table), apagar genéricos que eram pra builder (mermaid/mindmap/html), adicionar específicos retake JIT (report_draft/plan_change/palette_extraction)
- `components/chat/` vendor zone refatora pras 3 surfaces UX
- Tools fork — apaga getWeather, refatora pra tools retake (createLead/updateCopy/updateTokens/insertCoach/etc)

**Apaga:**

- Conceito "pasta de projeto" como chat scope
- v0-1.5-md (era pra page builder vibe coding, agora sem builder livre)
- tools genéricas que não cabem

**Fase de execução alinhada com prioridade do user:**

1. Dia 1 (timerun): chat geral operacional balão + ~10 tools básicas (criar lead, atualizar tokens/copy, adicionar plano/produto/evento, anexar foto)
2. Pós-base: chat com preview embarcado em `/dashboard/meu-site`
3. JIT pós-features: agentes relatórios/sugestões/atleta/treino

**Princípio cravado:** dados sempre no banco — chat/IA edita via Server Actions com audit + approval gate em mutações críticas.

## Ponto 8 ✅ Vocab/Naming retake corrida + camada staff/equipe

**Vocab cravado:**

| EN          | UI PT-BR                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------- |
| `tenant`    | "assessoria" / "run club" / "coach autônomo" (display livre via `tenants.display_label`) |
| `staff`     | "equipe" / "time" — qualquer membership ≠ athlete/lead                                   |
| `member`    | "membro" — todos: staff + athletes + leads                                               |
| `owner`     | "responsável" / "dono" / "admin"                                                         |
| `coach`     | "treinador" / "coach"                                                                    |
| `reception` | "recepção" / "atendimento"                                                               |
| `finance`   | "financeiro"                                                                             |
| `marketing` | "marketing"                                                                              |
| `athlete`   | "atleta"                                                                                 |
| `lead`      | "lead" / "interessado"                                                                   |

**Vocab corrida-vertical (novo):** `macrocycle`/temporada · `mesocycle`/bloco · `microcycle`/semana · `session`/sessão · `workout_segment`/segmento · `threshold`/limiar · `pace`/pace · `compliance`/aderência · `wearable`/relógio · `event`/prova · `lap`/volta · `split`/parcial · `PR`/recorde pessoal · `assessment`/avaliação · `anamnese`/anamnese.

**UI surfaces cravadas:**

- `/dashboard/equipe` — todos staff memberships (não tela separada "treinadores"). Filtros por role.
- `/dashboard/atletas` — athletes
- `/dashboard/leads` — leads
- Cadastro de novo membro = 1 flow único com select de role enum (não 5 telas separadas).

**Coach autônomo** = tenant com 1 membership `role=owner+coach` na mesma party. Schema já suporta.

**Site público hero**: "Conheça nossa equipe" (assessoria) vs "Sobre mim" (autônomo) — switch automático por count de staff. "Treinadores" no site = só memberships role IN (owner,coach) com `is_public_visible=true`.

**Banidos cravados:**

- `professional` (genérico desafit) — sumir
- `client` como aluno-final — sumir (vira `athlete`). `client` SÓ no sentido técnico (frontend client component, API client)
- `student` / `trainer` / `archetype` / `brand_parent` / multi-vertical anything

**Cadence verbal cravada:** `RUN. EAT. RECOVERY. REPEAT.` — staccato. UPPERCASE display + sentence case body + UPPERCASE eyebrows wide tracking. Imperativo curto (`Iniciar treino` / `Registrar` / `Ajustar`). Métricas mono tabular vírgula decimal `R$`. Zero emoji.

## Ponto 9 ✅ Recursos físicos + Parcerias + Comissões (filtrado corrida)

**Locais físicos (corrida-fit):**

- `public.resources(id, tenant_id, kind enum, name, capacity, address jsonb, ownership enum, partner_party_id NULL, monthly_cost_cents NULL, bookable bool, status)`
- `kind enum`: location (studio/academia) | room (funcional/avaliação/massagem) | space (outdoor/pista/parque/trilha) | equipment (esteira/ergômetro/oxímetro/monitor cardíaco/banheira gelo)
- `ownership enum`: owned | rented | partner

**3 modelos parceria cravados (Trinks + Lei Profissional Parceiro):**

`public.party_relationships.kind` enum estende:

- `external_partner` — fisio/nutri/massagista atende em local dele, encaminhamento
- `internal_partner` — coach autônomo dentro do studio do tenant (Lei Profissional Parceiro), comissão por serviço
- `space_rental` — tenant aluga sala/espaço pra terceiro
- (mantém kinds platform: `brokered_by_platform` / `sponsorship` / `b2b_supply`)

`terms jsonb` = commission_pct, monthly_rent_cents, scope, etc

**Serviços corrida cravados:**

`public.services(id, tenant_id, name, kind enum, default_price_cents, default_commission_pct, is_active)`

- `kind enum`: training_presencial | training_online | assessment_physical | assessment_biomechanic | consultation | massage_sports | physio_sports | nutrition_plan | race_support | other

`public.service_providers(id, tenant_id, service_id, provider_party_id, commission_pct OR commission_fixed_cents, is_active)` — qual member/parceiro presta qual serviço.

**Comissão automática:**

- Trigger em `payments` após status=confirmed
- Calcula comissão por linha do pedido conforme `service_providers` + `commission_rules`
- Gera entries em `public.commission_ledger` (provider, amount, status pending → paid)
- Repasse via integração Stone/Asaas/Pagar.me — JIT

**Descartado pra corrida:**

- Cabines/cadeiras (era salão)
- Coworking aluguel por hora intenso (raro Brasil)
- Estoque pesado (corrida tem pouco produto físico)
- Heat map horários (JIT, não dia 1)
- App separado pro profissional (1 dashboard único cobre)

**Onboarding pergunta no chat (estende Ponto 5):**

1. Tipo tenant: autônomo / assessoria / run club / studio funcional
2. Local físico? sim/não · próprio/alugado · quantas salas
3. Equipe: sozinho / 2-5 / 5+ → cria memberships
4. Parceiros externos? fisio/nutri/massagista/outro → cria relationships
5. Serviços oferecidos? checkbox → cria services + service_providers
6. Modelo cobrança: mensalidade / por sessão / planos com fidelidade

**Surfaces dashboard:**

- `/dashboard/recursos` — locais, salas, equipamentos
- `/dashboard/parceiros` — relationships ativas
- `/dashboard/servicos` — services + service_providers + commission_rules
- `/dashboard/comissoes` — histórico geradas e pagas

## Ponto 10 ✅ Planos / Preços / Monetização — 3 audiences + Grátis perpétuo

**Apaga (era desafit):**

- `tenants.trial_started_at` + `trial_expires_at` + `plan_status` (sem trial 14d retake)
- `tenants.skip_plan_gate`
- Migration 0041 (refazer)
- ADR-0062 amendment trial
- Memory `feedback_trial_14d_no_gating`
- **Founder flag** — tirado. Preço travado vem do `contract` enum (anual/bienal) + duração

**Schema cravado:**

```
public.plans(id, audience enum (tenant|sponsor|supplier), code, name,
             description, sort, is_public bool,
             contract enum (none|monthly|annual|biennial))
public.prices(plan_id, recurrence enum, amount_cents NULL, currency,
              effective_from, effective_to NULL,
              meta jsonb (per_state | quote_required | etc))
public.plan_features(plan_id, feature_key, value jsonb)
public.features(key, label, kind enum, description)
public.subscriptions(tenant_id OR party_id, plan_id, price_id, status,
                     current_period_end, gateway enum (efi|pagarme|stone|asaas),
                     gateway_ref)
public.feature_usage(tenant_id, feature_key, period_start, used, limit, resets_at)
```

**Tenants (3 níveis):**

- **Grátis** — perpétuo, R$ 0, site `retake.run/{slug}`, 6 paletas, leads, faixa marcas, vitrine fornecedores. NÃO aparece na vitrine pública.
- **Apoiador** — R$ 29/mês (anual) · R$ 19/mês (bienal) — vitrine pública + white-label + domínio próprio + loja + 3 eventos + paleta personalizada IA
- **Membro** — R$ 59/mês (anual) · R$ 39/mês (bienal) — site bespoke retake + remove marcas + 5 programas online + voto roadmap + acesso antecipado

**Sponsors (marcas):**

- Estadual R$ 100/mês por estado (anual 3x ou trimestral 3x)
- Nacional R$ 500/mês (anual 12x ou trimestral 3x)
- Oficial sob proposta (1 vaga/categoria, exclusividade)
- Cupom/Afiliado = receita retake (AWIN/Rakuten/direto)

**Suppliers:**

- Vitrine B2B R$ 99/mês

**Serviços (não-plano):**

- Tráfego pago Setup R$ 1.500 (one-time)
- Tráfego pago Setup pra Membro R$ 1.050 (30% off)
- Acompanhamento mensal sob consulta (`prices.amount_cents = NULL` + `prices.meta.quote_required = true`)

**Regras cravadas:**

- Grátis perpétuo, sem trial
- Apoiador/Membro = pago direto, checkout (Pix/cartão)
- Patrocinador mín 3 meses pago antecipado, logo+desc+link em 7 dias
- Sponsor passa por curadoria admin (CNPJ+marca+cupom)
- Supplier passa por KYC/KYB admin (CNPJ+capacidade entrega)
- Preços NO BANCO — editar = update SQL, zero deploy
- 5 frentes receita: tenant subs · sponsor subs · supplier subs · marketplace commission (JIT) · cupons afiliados retake

**Mantém:**

- `requireEntitlement` + `requireQuota` server-side
- `EntitlementProvider` client hydration
- ADR-0034 (vertical slice) + ADR-0035 (gating UX)
- `.claude/rules/entitlements.md` (refatorar texto)
- `features/<name>/plan-gates.ts` pattern + ESLint enforce
- Tabelas plans/prices/plan_features/features/subscriptions/feature_usage (refatorar pras 3 audiences)

**Fluxos cravados:**

- Onboarding tenant: cria conta → escolhe Grátis ou Apoiador/Membro → Grátis ativa imediato (sem cartão) · Apoiador/Membro = checkout → onboarding IA chat-as-form (Ponto 5)
- Sponsors/Suppliers = fluxo separado em `/patrocinio` e `/empresas` → cria party_role(pending) → fila aprovação admin

## Ponto 11 ✅ Stack/Libs: sobrevive vs apaga

**Dia 1 cravado:**

- Next 16 App Router + Turbopack + proxy.ts
- React 19
- Tailwind v4 @theme
- shadcn new-york (light-first vestido retake — Ponto 4)
- Supabase ssr + RLS + Edge Functions
- Zod 4 + RHF 7 + Zustand 5 (ADR-0049 split)
- Vitest + Playwright
- **next-intl 4 com 3 locales dia 0**: pt-BR + en + es
- pnpm 10
- AI SDK v6 + AI Gateway + Sonnet 4.6 + Haiku 4.5 + cache TTL 1h
- TanStack Query (server state)
- date-fns (pace/splits/semanas)
- Recharts (gráficos pace/aderência/PR)
- Lucide icons (substitui custom até receber)
- **Oswald + Hanken Grotesk + Space Mono** via next/font/google
- Motion 12 (`motion/react`) — motion library do site
- DOMPurify (sanitização chat IA)
- BotID Vercel (anti-bot em forms públicos)
- Resend (email transacional)
- AI Elements 9 components
- 9 Supabase UI (auth/dropzone/realtime)

**Mantém como artefatos do chat (utilidade futura):**

- Mermaid (diagramas)
- Markmap (mind maps)
- dotlottie (animações)

**JIT (cravado mas não dia 1):**

- Storybook 10 (visual check em browser basta dia 1)
- Plate.js v53 (rich text — sem caso dia 1, ADR-0054 sobrevive)
- Tremor (dashboards complexos)
- react-pdf/docx/xlsx/pptxgenjs (export tabelas — JIT por demanda real)
- Pagar.me + Efí + Asaas + Stone (gateway por audience)
- Mux (vídeo)
- Cal.com (booking fase 2)
- Garmin/Strava/Polar/Coros APIs (wearable fase 2)
- Anthropic Files API (PDF nativo no chat)
- Fal.ai Nano Banana 2 (image gen — paleta personalizada IA)

**Apaga:**

- Serwist + @serwist/turbopack + sw.ts + manifest routes (PWA cancelado Ponto 2)
- Geist font family (substituído por Oswald + Hanken + Space Mono)
- v0-1.5-md model (sem page builder)
- Anthropic direto `@ai-sdk/anthropic` (single channel AI Gateway)

## Ponto 12 ✅ Arquitetura componentes vibe-coding-ready + Lint pós-pivot

**Composição vive no BANCO (não código hardcoded) — vibe-coding-ready dia 1:**

```
public.page_versions.content jsonb = {
  style_preset: 'minimalista' | 'swiss' | 'neo-brutalism' | 'retake-default',
  blocks: [
    { id, kind: 'hero', variant: 'minimal', visible: true, sort: 1, props_override: {} },
    { id, kind: 'about', variant: 'default', visible: true, sort: 2, props_override: {} },
    ...
  ],
  slots: { hero: {...}, about: {...}, plans: [...] }  ← copy/dados editáveis
}
```

**Código (vibe-coding-ready):**

```
components/site/
├── primitives/                    # Eyebrow, DisplayHeading, SectionWrapper, Container
├── motion/                        # parallax, reveal, etc
├── sections/                      # Hero, About, Plans, FAQ, Testimonials
│                                  # ÚNICOS — aceitam slots + variant + props_override
│                                  # Token-driven, registry com schema Zod
└── style-presets/                 # Token sets por estilo
    ├── retake-default.ts
    ├── minimalista.ts
    ├── swiss.ts
    └── neo-brutalism.ts

lib/site/style-seeds/              # Receita default por estilo (qual seções + variants iniciais)
├── retake-default.seed.ts
├── minimalista.seed.ts
├── swiss.seed.ts
└── neo-brutalism.seed.ts
```

**Como funciona:**

- Tenant escolhe estilo → seed popula composition default em `page_versions.content.blocks` + tokens de `style-presets/{style}.ts` aplicam (override paleta tenant)
- Tenant troca estilo → seed diferente, mas slots (dados) preservam
- Tenant toggle "ocultar Plans" → `blocks[].visible=false` em nova page_version
- IA futura: tools `reorder_page_sections`/`toggle_section`/`add_section`/`update_section_variant`/`update_section_props` registradas em `public.ai_tools`, aplicam via Server Action + audit log + nova page_version imutável
- Membro bespoke: retake admin edita `blocks` direto, pode criar `kind='custom'` apontando pra `components/site/sections/custom/{tenant_slug}.tsx` JIT
- Variant override por estilo quando seção precisa visual radicalmente diferente: `components/site/sections/{kind}/variants/{style}.tsx` JIT

**Princípio cravado:**

- **Composição é dado JSONB** (não código) — IA edita via tools
- **Sections são peças únicas no registry** (kind + Zod + variants) — IA conhece catálogo
- **Slots separados da composição** — IA edita slot sem tocar composição
- **Variants/visibility/sort/style-preset são valores** (string/bool/int) — IA edita direto

## Ponto 12-bis ✅ Lint pós-pivot

**Apaga (era desafit):**

- `brand/no-brand-hardcode` (sem multi-brand)
- vocab enforce desafit antigo

**Mantém:**

- `plan-gates/plan-gates-required`
- `design-tokens/no-tailwind-bypass`
- `no-raw-fontfamily`
- `react/jsx-no-literals` (exceções: `components/site/sections/**`, `components/site/templates/seeds/**`, `lib/seed/**`)
- `sheriff` boundaries (layers)
- `react-hooks` v7
- `max-lines/max-lines-per-function` WARN 600/150 (SOLID critério)
- complexity + max-params ERROR
- Hooks: `block-token-bypass.sh`, `component-research-gate.sh`, `protect-eslint.sh`
- `no-vh-in-mobile-aware` (agora aplica em `app/(site-publico)/**` — painel é web puro)

**Reescreve:**

- vocab enforce → bloqueia `desafit`/`yoga.app`/`ingles.app`/`archetype`/`brand_parent`/`student`/`trainer`/`professional` (genérico)/`client` (como aluno-final)/`framer-motion`/`intake`/`wizard`/`onboarding.bio`/`onboarding-bio`
- `vocab-warn.sh` aponta pra lista retake

**Novas regras retake-specific:**

- `retake/no-multi-vertical-vocab` — bloqueia menções multi-vertical
- `retake/no-client-as-athlete` — identifier `client` para aluno-final bloqueado (mantém uso técnico)
- `retake/no-anthropic-direct` — bloqueia `@ai-sdk/anthropic` (tudo via AI Gateway)
- `retake/no-serwist` — PWA cancelado
- `retake/server-only-required` — `lib/data/**` precisa `'server-only'`
- `retake/no-supabase-client-mutation-in-client-components` — mutações só Server Actions
- `retake/no-cpf-cnpj-in-client-bundle` — sensitive sem mask/encode
- `retake/no-emoji-in-jsx` — soft warn em emoji literal
- `retake/mono-for-metrics` — warn em métricas sem `font-mono`

**Novos hooks:**

- `enforce-handoff-readonly.sh` — `docs/_handoff/**` só leitura
- `enforce-vocab-retake.sh` substitui `vocab-warn.sh`
- `enforce-server-only-data-layer.sh`
- `enforce-token-retake.sh`

**Audit suite:**

- `pnpm vocab:audit` · `pnpm i18n:audit` (3 locales) · `pnpm token:audit` · `pnpm security:audit` · `pnpm boundaries:audit`

## Ponto 13 ✅ Comunicação + Eventos + Roadmap (3 menores)

### 13.A — Comunicação (Resend)

**Dia 1:**

- `public.communication_templates(tenant_id, kind enum, subject, body, locale, version)` — React Email JSX
- `public.communication_log(tenant_id, recipient_party_id, kind enum, template_id, status enum, sent_at, opened_at, payload jsonb)`
- `public.communication_rules(tenant_id, trigger enum, template_id, delay_minutes, is_active)` — régua

**4 sequências mínimas SaaS (industry pattern):**

- Onboarding (boas-vindas + ativação)
- Trial → conversão (Apoiador/Membro)
- Dunning (pagamento falhou)
- Churn prevention (atleta inativo, lead sem retorno)

**Triggers dia 1:**

- `lead.created`, `lead.no_response_after_72h`, `subscription.payment_failed`, `subscription.upcoming_renewal`, `tenant.welcomed`

**Infra cravada:**

- SPF + DKIM + DMARC `p=none` mínimo
- One-click unsubscribe em transactional (Gmail 2026 requirement)
- Postmaster Tools — spam rate <0.3%
- Não misturar transactional + marketing no mesmo provider

**JIT:**

- Push notifications in-app (app nativo fase 2)
- Chat treinador↔atleta (app nativo fase 2)
- SMS/WhatsApp Business API
- Marketing emails (Loops/Customer.io)
- In-app notifications dashboard (Realtime)

### 13.B — Eventos/Provas

**Tabelas:**

- `public.events(tenant_id NULL, name, type enum (rua|trail|revezamento|treinao|clinica|viagem), date, city, state, distances text[], price_from_cents, external_signup_url, source enum (managed|imported|suggested), status enum (queue|published|archived), verified bool, organizer_party_id NULL, dedup_of NULL)`
- `public.event_lots(event_id, name, distance, price_cents, cap, sold, window)`
- `public.event_registrations(event_id, athlete_id, lot_id, payment_status, checkin_at)` — JIT
- `public.event_moderation(event_id, reports int, dupe_of, domain_ok bool, cnpj_ok bool)`

**Curadoria humana + anti-fake:**

- CNPJ verification pra claim de evento
- Dedup fuzzy match `name + date + city`
- 3+ community reports = auto-despublica → revisar
- Organizadores verificados ganham badge

**Surfaces:**

- `/eventos` público — calendário com filtros UF/distância/data/tipo
- `/eventos/[slug]` SEO público
- `/eventos/publicar` sugestão aberta
- `/dashboard/eventos` tenant cria/edita
- `admin.retake.run/eventos` staff modera

**Limite por plano:**

- Grátis: visualiza, não cria
- Apoiador: até 3 eventos
- Membro: ilimitado

### 13.C — Construção Aberta (Roadmap + Voto + Changelog)

**3 horizontes (handoff §3.14):**

- `now` (Agora) — desenvolvimento ativo
- `next` (Próximo) — fila, votação aberta Apoiador+Membro
- `later` (Mais pra frente) — backlog público

**Tabelas:**

- `public.roadmap_items(id, title, description, horizon enum, theme, status enum (idea|planned|in_progress|shipped), public bool, sort)`
- `public.feature_votes(roadmap_item_id, party_id, weight int)` — só Apoiador+Membro
- `public.changelog_entries(id, title, body, type enum (novo|melhoria|em_breve), published_at, by_community bool, roadmap_item_id NULL)`

**Surfaces:**

- `/novidades` público — kanban por status + changelog (industry pattern Canny/Featurebase)
- `/dashboard/votar` Apoiador+Membro vota
- `admin.retake.run/roadmap` staff gerencia + publica changelog

**Regra cravada:** voto prioriza, decisão é da retake (industry confirma: voting shows demand, doesn't replace product judgment)

**Embed dentro do dashboard tenant** (não board isolado distante)

## (próximos pontos a cravar aqui conforme user confirma)

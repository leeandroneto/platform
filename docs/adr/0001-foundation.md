# ADR-0001 — Foundation retake.run

**Status:** Accepted
**Date:** 2026-06-11
**Deciders:** Owner (Leandro Neto)
**Tags:** foundation · architecture · product-vision

## Context

retake.run nasce como plataforma vertical de **corrida** no Brasil. Serve assessorias, run clubs e coaches autônomos (mesma entidade `tenant`, plano define o que pode), com calendário público de provas, vitrine B2B de fornecedores e patrocínio escalonado por geografia.

Esta ADR consolida 14 pontos validados ponto-a-ponto com o owner em sessão de 2026-06-11. Foi a sessão fundadora — antes da primeira linha de código retake.run rodar.

Documentos SSOT pareados: `docs/_handoff/` (4 arquivos + Design System completo) + memória path-based `project_retake_decisoes_cravadas.md`.

## Decision

### 1. Marca única + schema único public + URL path-default

- 1 marca retake. URL default `retake.run/{slug}` por path. Subdomain + CNAME = upsell Apoiador/Membro via `public.domains` controlado por entitlement.
- Schema único `public.*`. RLS é a fronteira de segurança. Schema separado SÓ JIT com gatilho real (PCI scope, secrets vault).
- Tema do tenant aplica SÓ no site público dele. Dashboard + admin + landings + app = DS retake fixo.

### 2. App nativo único da retake (sem PWA web)

- Zero PWA web (sem Serwist, sw.ts, manifest routes per-tenant/per-brand).
- 1 app nativo retake (RN/Expo decisão JIT pós-MVP web), nas lojas Apple/Google, submissão única.
- Atletas entram via convite (`memberships role=athlete`) — app é o canal.
- UI kit `athlete-app/` do handoff = referência visual, não implementação web.

### 3. Party model + 5 camadas de autorização

- `public.parties` (pessoa OR organização, liga `auth.users`)
- `public.party_roles` (role_type + scope_kind + status)
- `public.party_relationships` (vínculos com `terms jsonb` + `platform_fee_cents`)
- `public.tenants` materializado de `party_role(tenant)` pra perf RLS
- `public.memberships` (role enum 7 valores: owner/coach/finance/reception/marketing/athlete/lead + position_label + permissions jsonb + group_id)
- `public.groups` + `group_assignments` (data scope: coach só vê seu grupo)
- JWT injeta: tenant_id + active_membership_role + party_id

### 4. DS retake fixo + tema só no site público

**2 universos visuais:**

- **Universo 1 (intocável):** painel + admin + landings retake + app — grafite/creme/terracota + Oswald display + Hanken Grotesk body + Space Mono mono — hardcoded em `app/globals.css @theme inline`. Vocab CSS var shadcn-canonical com valores apontando pros tokens retake.
- **Universo 2 (editável):** site público do tenant — 3 níveis: Grátis (6 paletas curadas) · Apoiador (theme builder completo + IA cor de foto) · Membro (bespoke retake + builder pós-edição). `public.tenant_themes` versionado + `deriveTokens(primary)` Edge + APCA Lc ≥ 60 single gate.

**Componentes:**

- `components/ui/*` shadcn primitives token-agnostic, zona quarentenada
- `components/retake/*` atléticos retake-only (StatCard mono pace, ComplianceTag) com tokens fixos
- `components/site/*` blocos do site (renderizam com tokens do tenant)

### 5. Page Engine: 1 template fixo + galeria de estilos JIT + vibe-coding-ready

- Dia 1 = 1 template `retake-default` (refatorado do athletic-editorial)
- Galeria de estilos curados (minimalista/swiss/neo-brutalism/editorial/etc) JIT no Apoiador — clica → re-aplica dados existentes
- Membro = bespoke retake + theme builder pós-edição
- Tenant toggle visibility de seções (não reordena dia 1)
- **Composição vive no BANCO** (vibe-coding-ready): `page_versions.content jsonb` = `{ style_preset, blocks: [{ kind, variant, visible, sort, props_override }], slots }`
- Dados em tabelas template-agnostic (`coaches`/`plans`/`services`/`testimonials`/`gallery`)
- Onboarding via chat-as-form + uploads (prints Instagram + PDFs) + IA extrai paleta/copy/dados/voz e cria cadastros automaticamente
- Registry híbrido (banco SSOT runtime + JSON registry pra dev/CI)
- Tools IA registradas em `public.ai_tools` (toggle_section/reorder/add/update_variant/update_props) — habilita IA editar tudo via approval gate

### 6. Form Engine: 3 categorias com solução adequada

- **Captação de lead (site público):** form **híbrido** — campos fixos cravados retake (nome/email/phone/objetivo/experiência/local-puxado-de-`tenant_locations`/LGPD) + `custom_questions jsonb` (chat edita)
- **Anamnese (app atleta):** tabela `public.anamnese` JIT — não constrói dia 1
- **Forms internos operacionais:** RHF + Zod tradicional + shadcn `<Form>` canonical

### 7. IA: arquitetura multi-agent + UX Opção C híbrida

**Arquitetura:**

- `public.chats(agent_kind enum, scope_id NULL)` — multi-agent, NÃO dual-scope projetos
- `public.ai_tools(name, agent_kinds[], schema jsonb, requires_approval bool, risk_level enum)` — SSOT registry
- `public.engine_plans` — approval gate genérico opt-in por tool
- `public.audit_log` — toda mutação via IA grava com actor=ai

**UX Opção C:**

- 🟦 **Chat com preview** embarcado em `/dashboard/meu-site` (estilo v0/Lovable)
- 🟧 **Chat geral em balão flutuante** (canto inferior direito) — comandos operacionais dia-a-dia ("cadastra esse lead" + print whatsapp, "lista todos leads dessa semana")
- 🟩 **Inline ✨ + `/ai`** em campos chave (headline/descrição) e editores de texto

**Fase execução:**

1. Dia 1 (timerun): chat geral balão + ~10 tools básicas
2. Pós-base: chat com preview embarcado em `/meu-site`
3. JIT pós-features: agentes relatórios/sugestões/atleta/treino

### 8. Vocab corrida + camada staff/equipe

- `tenant`/"assessoria/run club/coach autônomo" (display livre via `tenants.display_label`)
- `staff`/"equipe" (todo membership ≠ athlete/lead)
- `member`/"membro" · `owner`/"responsável" · `coach`/"treinador" · `reception`/"recepção" · `finance`/"financeiro" · `marketing`/"marketing" · `athlete`/"atleta" · `lead`/"lead"
- Corrida-vertical: `pace` · `threshold` · `compliance` · `macrocycle` · `mesocycle` · `microcycle` · `session` · `workout_segment` · `wearable` · `event` · `lap` · `split` · `PR` · `assessment` · `anamnese`
- Cadence: `RUN. EAT. RECOVERY. REPEAT.` UPPERCASE display + sentence case body + métricas mono tabular vírgula decimal `R$`. Zero emoji.

### 9. Recursos físicos + 3 modelos de parceria + comissões

- `public.resources(kind enum: location|room|space|equipment, ownership enum: owned|rented|partner)`
- `public.party_relationships.kind` estende com `external_partner` (fisio/nutri/massagista terceiros) + `internal_partner` (Lei Profissional Parceiro) + `space_rental`
- `public.services` curado corrida (training_presencial/online + assessment + consultation + massage_sports + physio_sports + nutrition_plan + race_support)
- `public.service_providers` + `commission_rules` por prestador
- Comissão automática via trigger pós-pagamento + `commission_ledger`
- Onboarding pergunta tipo de tenant + local + equipe + parceiros + serviços + modelo de cobrança via chat

### 10. Planos / Preços / Monetização — 3 audiences + Grátis perpétuo

**Tenants:**

- Grátis perpétuo, R$ 0, site `retake.run/{slug}` + 6 paletas + leads + faixa marcas
- Apoiador R$ 29/mês (anual) ou R$ 19/mês (bienal)
- Membro R$ 59/mês (anual) ou R$ 39/mês (bienal)

**Sponsors:**

- Estadual R$ 100/mês por estado · Nacional R$ 500/mês · Oficial sob proposta · Cupom/Afiliado = receita retake

**Suppliers:**

- Vitrine B2B R$ 99/mês

**Serviços (não-plano):**

- Tráfego pago Setup R$ 1.500 · Setup Membro R$ 1.050 (30% off) · Acompanhamento mensal sob consulta

**Regras:**

- Grátis = perpétuo, sem trial
- Apoiador/Membro = checkout direto, sem trial
- Sem founder flag (preço travado vem do contract enum)
- Preços NO BANCO
- 5 frentes receita: tenant subs · sponsor subs · supplier subs · marketplace commission (JIT) · cupons afiliados retake

### 11. Stack

**Dia 1:**

Next 16 + React 19 + Tailwind v4 + shadcn new-york (light-first vestido) + Supabase ssr + Zod 4 + RHF 7 + Zustand 5 + Vitest + Playwright + next-intl 4 (3 locales pt-BR/en/es) + pnpm 10 + AI SDK v6 + AI Gateway + Sonnet 4.6 + Haiku 4.5 + cache + TanStack Query + date-fns + Recharts + Lucide + Oswald + Hanken Grotesk + Space Mono via `next/font` + Motion 12 + DOMPurify + BotID + Resend.

**Mantém como artefato chat:** Mermaid + Markmap + dotlottie.

**JIT:** Storybook · Plate.js v53 · Tremor · react-pdf/docx/xlsx/pptxgenjs · gateways · Mux · Cal.com · wearable APIs · Anthropic Files API · Fal.ai Nano Banana 2.

**Apaga:** Serwist · sw.ts · manifest routes · Geist · v0-1.5-md · `@ai-sdk/anthropic` direto.

### 12. Lint pós-pivot + componentes vibe-coding-ready

**Lint sobrevive:**

- `plan-gates/plan-gates-required` · `design-tokens/no-tailwind-bypass` · `no-raw-fontfamily` · `react/jsx-no-literals` (exceções renderers) · sheriff boundaries · react-hooks v7 · max-lines WARN 600/150 · complexity ERROR

**Novas retake-specific:**

- `retake/no-multi-vertical-vocab` · `retake/no-anthropic-direct` · `retake/no-serwist` · `retake/server-only-required` · `retake/no-supabase-client-mutation-in-client-components` · `retake/no-cpf-cnpj-in-client-bundle` · `retake/no-emoji-in-jsx` · `retake/mono-for-metrics`

**Hooks novos:**

- `enforce-handoff-readonly.sh` · `enforce-vocab-retake.sh` · `enforce-server-only-data-layer.sh` · `enforce-token-retake.sh`

### 13. Comunicação + Eventos + Roadmap

**Comunicação (Resend dia 1):**

- 4 sequências mínimas SaaS: onboarding · trial→conversão · dunning · churn prevention
- Templates editáveis por tenant em React Email JSX
- SPF + DKIM + DMARC `p=none` mínimo + one-click unsubscribe
- Push/chat treinador-aluno JIT (app nativo fase 2)

**Eventos/Provas:**

- Calendário comunidade-mantido + curadoria humana retake
- 3 fontes: managed (organizador verificado) · imported (staff retake) · suggested (fila aberta)
- Anti-fake: CNPJ verification + dedup fuzzy match + 3+ reports = auto-despublica

**Roadmap público:**

- 3 horizontes: now · next · later
- Kanban com status columns (industry pattern Canny/Featurebase)
- Voto: só Apoiador+Membro. **Voto prioriza, decisão é da retake.**

### 14. Estratégia de execução — reset cirúrgico

- Backup: `Desktop/platform/` intocada
- Pasta nova: `Documents/retake/` recebe só o que sobrevive
- GitHub: mesmo repo, branch nova `main` com 1 commit `feat(retake): foundation` (force push, sem histórico)
- Supabase: mesmo project, baseline limpa via migrations 0001_purge + 0002_identity_foundation + outras JIT por sprint

## Consequences

**Positivas:**

- Foco vertical = produto especialista (fosso = núcleo de treino corrida)
- Stack alinhada com handoff cravado
- Schema do zero alinhado party model — sem dívida arquitetural
- Vibe-coding-ready desde dia 1 (composição em banco)
- Pricing/monetização 3 audiences claros
- IA arquitetura multi-agent preparada pra crescer JIT

**Negativas / dívida assumida:**

- Refactor profundo da base anterior (preserved como backup local)
- Galeria de estilos JIT (não dia 1)
- Anamnese + app nativo são fase 2+

## Execution

Sprints S0-S7 detalhados em `docs/plans/foundation.md`. Migrations em `docs/migrations/`. Decisões granulares (paths cravados, vocab list, etc) em CLAUDE.md.

## References

- `docs/_handoff/README.md` — handoff completo SSOT
- `docs/_handoff/planos-onboarding-permissoes.md`
- `docs/_handoff/banco-de-dados.md`
- `docs/_handoff/modelo-de-produto.md`
- `docs/_handoff/retake.run Design System (4)/` — DS completo (tokens + components + UI kits)
- `docs/blueprint/00-projeto.md` — resumo produto+público+arquitetura
- `docs/plans/foundation.md` — sprints S0-S7
- Memory `project_retake_decisoes_cravadas.md` — 14 pontos cravados

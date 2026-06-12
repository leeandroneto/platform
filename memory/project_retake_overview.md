---
name: retake.run — projeto vertical de corrida
description: Plataforma vertical de corrida (endurance) no Brasil. Serve assessorias, run clubs e coaches autônomos. Fosso = núcleo de treino. Foundation criada 2026-06-11.
type: project
---

retake.run é plataforma vertical de corrida (endurance) no Brasil, multi-tenant SaaS, 1 marca, 1 código, 1 deploy.

**Why:** decisão de pivot do owner (2026-06-11) — projeto anterior era SaaS B2B multi-vertical (fitness/yoga/idiomas). Foco vertical = produto especialista. Fosso = núcleo de treino de corrida (periodização → segmentado → prescrito × executado → integração wearables).

**How to apply:**

5 públicos:

1. Tenants pagantes (assessoria/run club/coach autônomo) — mesma entidade, plano define
2. Atletas (consumer, grátis, app nativo único retake)
3. Sponsors (marcas, escopo geográfico estadual/nacional/oficial)
4. Suppliers (fornecedores B2B vitrine)
5. Event organizers

Stack travado: Next 16 + React 19 + Tailwind v4 + shadcn new-york + Supabase ssr + Zod 4 + RHF 7 + Zustand 5 + next-intl 4 (3 locales) + AI SDK v6 + AI Gateway + Sonnet 4.6 + Haiku 4.5 + TanStack Query + date-fns + Recharts + Lucide + Oswald + Hanken Grotesk + Space Mono via next/font + Motion 12 + Resend + BotID + DOMPurify.

Schema único `public.*`. RLS = fronteira de segurança. Party model + 5 camadas auth (parties + party_roles + party_relationships + tenants materializado + memberships com role enum 7 valores).

URL: `retake.run/{slug}` por path. Subdomain + CNAME = upsell Apoiador/Membro.

DS retake fixo no painel/admin/landings/app (grafite/creme/terracota + Oswald + Hanken + Space Mono). Tema editável SÓ no site público do tenant (3 níveis: Grátis 6 paletas curadas · Apoiador theme builder completo + IA cor de foto · Membro bespoke retake).

Composição vibe-coding-ready desde dia 1: `page_versions.content jsonb` com style_preset + blocks[] + slots. IA edita tudo via tools registradas em `public.ai_tools` + approval gate `public.engine_plans`.

3 categorias de form: lead capture híbrido (campos fixos + custom_questions jsonb) · anamnese JIT · ops RHF. Sem builder genérico.

IA arquitetura multi-agent: `chats.agent_kind enum`. UX Opção C: chat com preview embarcado em surfaces criação + chat geral balão flutuante + inline ✨/`/ai`.

3 audiences planos: tenants (Grátis/Apoiador/Membro) · sponsors (estadual/nacional/oficial) · suppliers (Vitrine B2B). Grátis perpétuo sem trial. Preços NO BANCO.

Fases: 1 entra dinheiro · 2 retém · 3 encanta · 4 marketplace · 5 inteligência. Multi-tenant atravessa todas.

Docs SSOT:

- `docs/_handoff/` (intocável)
- `docs/adr/0001-foundation.md`
- `docs/blueprint/00-projeto.md`
- `docs/plans/foundation.md` (sprints S0-S7)
- `CLAUDE.md`

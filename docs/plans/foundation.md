# Plano de Execução — Foundation retake.run

> Status: Active. Última atualização: 2026-06-11.
> Plano executável sprint-a-sprint dia 1 → milestone "monetização Apoiador/Membro funcional".

## Sprints

### S0 — Cleanup + estrutura (✅ FEITO nesta sessão)

- [x] Pasta nova `Documents/retake/` criada
- [x] Backup local `Desktop/platform/` intocada
- [x] Estrutura de pastas (`app/`, `components/`, `lib/`, `docs/`, `.claude/`, `messages/`)
- [x] CLAUDE.md cravado
- [x] ADR-0001 foundation cravada
- [x] Blueprint 00-projeto cravado
- [x] Este plano cravado
- [x] `.claude/` configurado (settings + rules + hooks + skills)
- [x] memory path-based
- [x] Configs raiz copiados/refatorados (`package.json`, `tsconfig`, `next.config`, `tailwind.config`, etc)
- [x] Handoff `docs/_handoff/` copiado intacto
- [x] Migration 0001_purge aplicada (drop cascade)
- [x] Migration 0002_identity_foundation aplicada (party model + RLS)
- [x] Git: force push origin main com commit `feat(retake): foundation`

### S1 — Tokens + Fonts + shadcn vestido + layouts dos 3 mundos

**Output esperado:** build verde + tokens retake aplicados visualmente.

- [ ] `next/font/google` Oswald + Hanken Grotesk + Space Mono
- [ ] `app/globals.css` `@theme inline` com tokens retake (vocab shadcn-canonical, valores apontando pros tokens retake)
- [ ] Extensões opt-in retake (`--font-display`, `--radius-pill`, `--shadow-warm-*`, `--tracking-eyebrow`)
- [ ] shadcn primitives essenciais via `npx shadcn add` (button, card, input, label, form, sheet, dialog, drawer, dropdown-menu, sidebar, separator, badge, avatar, tabs, sonner)
- [ ] Supabase UI auth (`password-based-auth` + `social-auth`)
- [ ] Lucide instalado e configurado
- [ ] Layouts dos 3 mundos: `app/(painel)/`, `app/(publico)/`, `app/(auth)/`, `app/(admin)/`
- [ ] `proxy.ts` + `i18n/request.ts` com 3 locales
- [ ] `app/page.tsx` raiz mostrando "retake.run" com tokens aplicados (validação visual)

### S2 — Auth + Party model + memberships

**Output esperado:** login funcional, 1 tenant criado, JWT injeta tenant_id+role+party_id.

- [ ] Supabase clients (`lib/supabase/server.ts`, `client.ts`, `admin.ts`) refatorados retake
- [ ] `lib/env.ts` Zod schema retake
- [ ] `proxy.ts` session refresh
- [ ] `app/(auth)/entrar/page.tsx` via Supabase UI `password-based-auth`
- [ ] `app/(auth)/cadastrar/page.tsx`
- [ ] `app/(auth)/sair/route.ts`
- [ ] `app/auth/callback/route.ts` (OAuth)
- [ ] JWT hook `custom_access_token_hook` SECDEF — injeta tenant_id + active_membership_role + party_id
- [ ] RLS dual-read I21 helper
- [ ] `lib/contracts/auth.ts` Zod schemas
- [ ] `lib/data/parties.ts` + `tenants.ts` + `memberships.ts` (`'server-only'`)
- [ ] Tests Vitest cobertura essencial

### S3 — Dashboard estrutura (sidebar + sidebar secundário + mobile-first)

**Output esperado:** esqueleto do painel navegável + mobile-first todas as 15 rotas.

- [ ] Sidebar global retrátil (shadcn `<Sidebar collapsible="icon">`)
- [ ] Sidebar secundário contextual (quando necessário, ex: `/configuracoes`)
- [ ] Header global (logo retake + workspace + ⌘K + user dropdown)
- [ ] CMD-K Palette
- [ ] Esqueleto rotas `/dashboard/{inicio,meu-site,leads,atletas,equipe,recursos,parceiros,servicos,comissoes,eventos,configuracoes,votar}`
- [ ] Drawer mobile + sidebar desktop (Sheet shadcn)
- [ ] Tokens mobile (`--touch-min`, `100dvh`, safe-area)
- [ ] Navegação 13 itens mobile-first checklist passa

### S4 — Site público + onboarding chat-as-form + lead capture

**Output esperado:** tenant cria conta Grátis → site no ar em `retake.run/{slug}` com captação ativa. Caso timerun pronto.

- [ ] Template `retake-default` em `components/site/templates/retake-default/` (refator do athletic-editorial com tokens retake + copy retake)
- [ ] 13 sections retake (hero/sobre/planos/depoimentos/FAQ/methodology/transformations/stats/ticker/contato/cta-final/gallery/footer)
- [ ] Motion library reusable (poda os heavy)
- [ ] Migration tabelas: `pages` + `page_versions` (imutável) + `coaches` + `plans` + `services` + `testimonials` + `gallery` + `tenant_locations` + `tenant_themes` + `tenant_theme_versions`
- [ ] Onboarding chat surface `/dashboard/meu-site/onboarding` (chat-as-form)
- [ ] IA tools dia 1: `set_brand_palette`, `set_brand_voice`, `insert_coach`, `insert_plan`, `insert_service`, `insert_testimonial`, `set_hero_copy`, `set_about_copy`, `upload_gallery_image`, `extract_from_pdf`, `extract_palette_from_image`
- [ ] Approval gate em mutações críticas
- [ ] Public route `retake.run/{slug}` SSR
- [ ] Theme inject inline `<style precedence="theme">` per-tenant
- [ ] Lead capture form (campos fixos + custom_questions jsonb)
- [ ] Submit via Server Action → insere em `leads` + outbox dispara régua

### S5 — Painel de leads + comunicação básica + eventos próprios + lojinha interna

**Output esperado:** dashboard timerun completo, faz dinheiro de inscrições.

- [ ] `/dashboard/leads` (lista, filtros, kanban Novo→Contatado→Visita→Convertido, detalhe)
- [ ] Resend integration + 4 sequências mínimas (onboarding · trial→conversão · dunning · churn prevention)
- [ ] React Email templates editáveis
- [ ] `/dashboard/eventos` criar/editar evento interno
- [ ] `/dashboard/produtos` lojinha (sem checkout dia 1)
- [ ] Régua comunicação automática trigger
- [ ] `lib/email/render.ts` refatorado

### S6 — Gateway + planos pagos (Apoiador/Membro/Sponsors/Suppliers)

**Output esperado:** Apoiador/Membro/sponsors/suppliers vendendo.

- [ ] Integração Asaas OU Pagar.me (Pix + cartão)
- [ ] Checkout Apoiador/Membro
- [ ] Tabelas: `plans` + `prices` + `plan_features` + `features` + `subscriptions` + `feature_usage`
- [ ] Entitlements (`requireEntitlement` + `requireQuota`) server-side
- [ ] Webhook gateway → atualiza `subscription.status`
- [ ] Sponsors fluxo: `/patrocinio` + cadastro + fila aprovação admin
- [ ] Suppliers fluxo: `/empresas` + cadastro + KYC fila admin
- [ ] Admin platform (`admin.retake.run`) — staff retake

### S7+ JIT — Features especializadas

- Theme builder Apoiador refatorado (~5 inputs)
- Galeria de estilos (minimalista/swiss/neo-brutalism) com seeds
- Chat geral operacional balão flutuante (`/dashboard/*`)
- Relatórios IA + Apoio treinador
- Recursos físicos + parcerias + comissões
- Núcleo treino segmentado + wearable connections
- Marketplace completo
- App nativo (RN/Expo)

## Pontos de validação cravados

- Cada sprint termina com **visual check em browser real** (Chrome desktop + iOS Safari + Android)
- `mcp__plugin_supabase_supabase__get_advisors security` zero novos warnings pós cada migration
- Audit suite verde: `pnpm vocab:audit` + `i18n:audit` + `token:audit` + `lint --max-warnings 0` + `typecheck` + `test` + `build`
- 1 commit por fase do sprint (não bundle múltiplas fases)
- Sprint 4 = milestone "timerun no ar"
- Sprint 6 = milestone "monetização Apoiador/Membro funcional"

## Sequência de migrations (preview)

```
0001_purge_pre_retake               ✅ S0
0002_identity_foundation            ✅ S0  (parties + party_roles + party_relationships + tenants + memberships + groups + RLS + JWT hook)
0003_plans_prices_subscriptions     S6
0004_themes_versioning              S4
0005_pages_versioning               S4
0006_content_tables                 S4  (coaches + services + plans_offered + testimonials + gallery + tenant_locations)
0007_leads_outbox                   S4-S5
0008_communication                  S5  (templates + log + rules)
0009_events_moderation              S5
0010_ai_chats_tools_engine_plans    S4-S6
0011_resources_partnerships         JIT
0012_services_providers_commissions JIT
0013_sponsors_suppliers             S6
0014_roadmap_changelog_votes        JIT
0015_anamnese_training              fase 2+
```

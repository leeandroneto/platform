# 03 — Naming e Vocabulário

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Vocabulário canônico desafit.app. ESLint enforce dia 1.
> Causa raiz: vocabulário inconsistente custou ~150-170h de refator no onboarding-bio.

---

## 1. Idioma por camada

| Camada | Idioma | Exemplo |
|---|---|---|
| DB (tabelas, colunas, enums, RPCs, triggers, buckets, Edge Functions) | **EN 100%** | `tenants`, `created_at`, `tenant_role`, `complete_set` |
| Code identifiers (arquivos, pastas, types, funções, variáveis) | **EN 100%** | `lib/data/programs.ts`, `ProgramRow`, `getActiveTenant()` |
| Pastas em `app/` (route folders) | **EN kebab-case** | `app/(client)/client/` |
| URL pública | **PT-BR via rewrites** em `next.config.ts` | `desafit.app/treinos` → interna `/workouts` |
| Strings UI em componentes | **PT-BR via `t()` next-intl** | `t('workouts.title')` |
| Documentação interna | **PT-BR livre** | `docs/`, `blueprint/`, ADRs |
| JSONB AI payload keys | **EN sempre** | `{ pillars, reflection, next_step }` |
| JSONB AI payload values | **PT-BR (LLM output)** | `pillars: ["Hipertrofia", "Resistência"]` |

**Razão:** schema/código portável internacional, UI brasileira nativa.
Decisão `feedback_naming_standard` na memória.

---

## 2. Vocabulário banido (lint enforce)

Lista canônica completa — ESLint `id-denylist` + `no-restricted-imports`
+ `no-restricted-syntax` bloqueiam. CI grep como safety net.

| Banido | Use | Razão |
|---|---|---|
| `student` | `client` | D-G5 (5 roles canônicos) |
| `trainer` | `professional` | D-G5 |
| `agency` | `admin` + impersonation | Fase agência ≠ role separado (00-PROJETO §5) |
| `intake` | `capture_form` ou `form` | Legado onboarding-bio |
| `wizard` | `setup` | Sessão fluxo pós-signup |
| `prospect` | `lead` | Padrão CRM canônico |
| `diagnostic` / `diagnostico` | `assessment` | Gerador IA antigo |
| `customization` | `theme` ou `branding` | Tabela tema antiga |
| `workspace` | `tenant` | Confusão semântica |
| `framer-motion` | `motion/react` (Motion 12) | Lib renomeada 2024 |
| `aluno` em folder/identifier | `client` | URL via rewrite ok |
| `reflexao` / `pilares` / `ato_*` | `reflection` / `pillars` / `act_*` | JSONB keys EN sempre |
| `proximo_passo` | `next_step` | Idem |
| `legacy-*` / `_legacy/` | nada — não criar | Greenfield, sem arqueologia |
| `prof-*` (abreviado) | `professional-*` completo | Consistência |
| `onboarding.bio` / `onboarding-bio` | nada — não citar | Produto anterior pausado |
| `_archive/` | git history basta | Não criar pasta |
| `copy-positioning.md` (arquivo extinto) | `00-PROJETO.md` ou `master-plan.md` | Doc removido |
| `Btn` / `useToggle` (abreviação inventada) | `Button` / `useDisclosure` (padrão consagrado) | Convenção indústria |

**Aplicação prática:** antes de cada resposta/código/doc, varrer mentalmente
essa lista. Se termo banido aparece em texto citado de pesquisa → traduzir
pro canônico nas próprias palavras, **nunca propagar**.

Memória relacionada: `feedback_vocab_check_before_response.md`.

---

## 3. Vocabulário canônico do produto

| Termo | Definição | Schema |
|---|---|---|
| `tenant` | Espaço isolado de 1 profissional (UUID em `public.tenants`) | raiz multi-tenant |
| `professional` | Dono do tenant (role primário) | enum `user_role` |
| `client` | Aluno final (consumidor do PWA) | enum `user_role` |
| `staff` | Colaborador do profissional dentro do tenant | enum `user_role`/`membership_role` |
| `admin` | Leandro/equipe plataforma (role global, fora memberships) | enum `user_role` |
| `influencer` | Afiliado (role global, fora memberships) | enum `user_role` |
| `program` | Produto vendido (curso, desafio, mentoria) | `platform.programs` |
| `module` | Subdivisão flexível dentro de programa (nome configurável: "Semana 1", "Fase 1") | `platform.modules` |
| `component` | Unidade atômica de conteúdo | `platform.components` |
| `component.kind` | Polimorfismo via enum (11 kinds dia 1) | enum `desafit.component_kind` |
| `enrollment` | Cliente matriculado em programa | `platform.enrollments` |
| `cohort` | Turma com início/fim fixo | `platform.cohorts` |
| `capture_form` | Formulário de captação branded | `platform.capture_forms` |
| `lead` | Inscrito no capture_form | `platform.leads` |
| `assessment` | Relatório gerado por IA pós-capture_form | derivado de `capture_submissions` |
| `setup` | Fluxo pós-signup (4 telas na fase SaaS, manual na fase agência) | rotas `app/(setup)/` |
| `theme_tokens` | Branding do tenant (JSONB) | `tenants.theme_tokens` |
| `vertical` | Vertical profissional (musculação/inglês/nutrição/...) | `public.verticals` |
| `vertical_id` | Tenant escolhe 1 dia 1 (expansível N:N futuro) | `tenants.vertical_id` |

---

## 4. Roles fixos (5 valores, nunca expandir sem pivot)

| Role | Escopo | Notas |
|---|---|---|
| `admin` | global | Leandro/plataforma; controla tenants, IA, billing, impersonation |
| `professional` | tenant-scoped | Dono do tenant; cria programas, gerencia alunos |
| `client` | tenant-scoped | Consome PWA, marca progresso, faz check-in |
| `staff` | tenant-scoped | Assistente do professional dentro do tenant |
| `influencer` | global | Afiliado; indica profissionais via link único |

`memberships` aceita só `professional`, `client`, `staff` (admin + influencer são global `user_role` fora de memberships).

Detalhes: 00-PROJETO §5 + master plan §4.2 + `.claude/rules/roles.md`.

---

## 5. `component.kind` enum (11 dia 1 + reservados)

**Ativos em `fitness_strength` dia 1:**
- Universais (cross-vertical): `video_lesson`, `lesson`, `material`, `message`, `task`, `scheduled_live`, `individual_call`, `in_person_class`, `check_in`
- Fitness specific: `workout`, `meal_plan`

**Reservados dia 1 (declarados, ativados por vertical futura):**
- `vocab_drill`, `reading_comprehension`, `speaking_practice` (english_lang)
- `recipe`, `food_log` (nutrition)
- `journal_entry`, `thought_record` (therapy)
- `yoga_sequence`, `breathing_practice` (yoga_meditation)
- `goal_milestone`, `okr_review` (career/business_coaching)

Mapping vertical → kind em `public.vertical_component_kinds`. Render UI
filtra na origem (impossível prof de musculação ver `vocab_drill`).

---

## 6. Convenções de arquivo

| Item | Padrão | Exemplo |
|---|---|---|
| Componente | `kebab-case.tsx` | `workout-editor.tsx` |
| Pasta de componente | `kebab-case/` | `components/workout-editor/` |
| Hook | `use-*.ts` | `lib/hooks/use-responsive.ts` |
| Helper/util | `kebab-case.ts` | `lib/utils/calculate-tdee.ts` |
| Schema Zod | `<entity>.schema.ts` | `lib/contracts/programs/programs.schema.ts` |
| Adapter | `<entity>.adapter.ts` | `lib/contracts/programs/programs.adapter.ts` |
| Contracts (i/o Server Action) | `<entity>.contracts.ts` | `lib/contracts/programs/programs.contracts.ts` |
| Server Action | `*.action.ts` em `app/<route>/_actions/` | `app/(shell)/programs/_actions/create-program.action.ts` |
| Data layer | `<entity>.ts` em `lib/data/` | `lib/data/programs.ts` |
| Componente principal | nome do componente (não `index.tsx`) | `components/workout-editor/workout-editor.tsx` |
| Migration | `YYYYMMDDHHMMSS_<verb_en>.sql` | `20260601120000_add_programs.sql` |
| Edge Function | kebab-case folder | `supabase/functions/send-email/` |
| RPC | `<verb>_<entity>` snake | `complete_set`, `enroll_client`, `create_program` |
| Eventos analytics (PostHog) | snake_case | `signup_completed`, `enrollment_created` |

ESLint `unicorn/filename-case` enforce kebab.

---

## 7. Convenções de identifiers

| Tipo | Padrão | Exemplo |
|---|---|---|
| Component / type | PascalCase | `WorkoutEditor`, `ProgramRow` |
| Função / variável | camelCase | `getActiveTenant`, `currentUserId` |
| Constante module-level | UPPER_SNAKE | `MAX_RETRIES`, `DEFAULT_TENANT_ID` |
| Enum SQL | snake_case | `user_role`, `component_kind` |
| Coluna DB | snake_case | `created_at`, `tenant_id` |
| FK | `<entity>_id` snake | `tenant_id`, `program_id`, `client_user_id` |
| Boolean | prefixo `is_*` | `is_active`, `is_published`, `is_validated` |
| Timestamp | `created_at`, `updated_at`, `deleted_at` | soft delete em todas tabelas-chave |
| Variants TS | enum union literal | `variant: 'default' \| 'outlined' \| 'interactive' \| 'featured'` |
| Token CSS | `--<category>-<name>` | `--color-primary`, `--surface-card`, `--brand-radius` |

---

## 8. URL rewrites PT→EN

Rotas internas EN (folders), URL pública PT via `next.config.ts`:

| URL pública | Folder interno |
|---|---|
| `/treinos` | `/workouts` |
| `/treinos/:slug` | `/workouts/:slug` |
| `/alunos` | `/clients` |
| `/aluno/:path*` | `/client/:path*` |
| `/perfil` | `/profile` |
| `/configuracoes` | `/settings` |
| `/aparencia` | `/appearance` |
| `/captacao` | `/capture` |
| `/vendas` | `/sales` |
| `/agenda` | `/schedule` |
| `/programa/:path*` | `/program/:path*` |
| `/inicio` | `/home` |
| `/chatbot` | `/assistant` |

Locales não-PT (en-US, pt-PT, es-ES) — URLs ficam em EN nativo (sem rewrite). Resolução por `Accept-Language` ou prefixo `/[locale]/`.

---

## 9. Strings UI — zero hardcoded (D-G66)

14 padrões cobertos por defesa multi-camada:

1. JSX text — `react/jsx-no-literals`
2. JSX attribute (`aria-label`, `placeholder`, `alt`, `title`, `aria-valuetext`) — `no-restricted-syntax`
3. `toast.*()` call literal — idem
4. `throw new Error('...')` — idem
5. `export const metadata = { title: '...' }` — idem
6. `fail({ kind, cause: '...' })` — idem
7. Zod `.min(3, 'Mín 3 caracteres')` — idem; usar `z.setErrorMap` global
8. `sendPush({ title, body })` / `sendEmail({ subject })` — idem
9. const string PT/EN dicionário — grep pre-commit + `pnpm i18n:audit`
10. Email templates react-email — `react/jsx-no-literals` strict no override
11. Push templates — keys em `messages/<locale>/push.json`
12. `mapToAppError(e, '...')` — força chave de erro
13. AppError fields (`reason`, `resource`) — enum + `t()` na UI
14. URL constants — allowlist via `new URL('https://...')`

Allowlist hardcoded:
- `messages/<locale>/*.json` (único lugar legítimo)
- `lib/i18n/**/*` (config)
- `**/*.test.ts` (fixtures)
- `scripts/**`, `tools/**` (CLI dev)
- `console.warn/error` / `Sentry.captureException` (log dev)
- `process.env.X` (env vars)
- `posthog.capture('event_snake_case')` (event names)

Detalhes: master plan §15.7 · `.claude/rules/i18n.md`.

---

## 10. Brand assets — zero inline (00-PROJETO §9)

| Asset | Onde vive | Trocar = |
|---|---|---|
| Cor da marca | 1 token OKLCH em `@theme` | editar 1 var → propaga 100% |
| Logo desafit | 1 SVG via componente `<Logo>` | editar 1 SVG → propaga 100% |
| Tipografia brand | `--font-brand` em `@theme` | editar 1 var → propaga 100% |
| Nome `"desafit"` / `"desafit.app"` | Componente `<Logo>` ou metadata centralizada | lint bloqueia literal fora de allowlist |

Mesma regra recursiva pra tenant white-label — cor, logo, fonte, nome de
cada tenant vivem em CSS via API route (D-G59), zero hardcode.

**Allowlist `"desafit"` literal:**
- `messages/<locale>/*.json` (texto UI)
- Metadata SEO root (`app/layout.tsx` `metadata.title`)
- ADRs / blueprint / docs (texto descritivo)
- Comentários técnicos onde for inevitável

---

## 11. Exceções aceitas

| Termo | Por que aceito |
|---|---|
| `lgpd/` | Acrônimo legal brasileiro (rota `/lgpd`) |
| JSONB internal keys AI-bound (`pilares`, `reflexao`, `ato_*`) | **Apenas legado integrado** — novos prompts usam `pillars`, `reflection`, `act_*`. Fase 08 de prompt rewrite migra |
| Texto literal em testes (`expect(...).toBe('...')` ) | Fixture, não vai pra usuário |

---

## Referências

- `00-PROJETO.md` §5 (5 roles) · §9 (brand assets zero inline)
- `_CONFLITOS.md` #12 (lint enforcement)
- Master plan §0.3 (vocab) · §2 (naming) · §15 (i18n)
- Pesquisa 04 §2.2 (id-denylist + no-restricted-imports)
- Pesquisa 09 (token-bypass mesmo modelo aplicado a vocab)
- `.claude/rules/naming.md` (existente)
- Memórias: `feedback_naming_standard.md`, `feedback_no_legacy_vocabulary.md`, `feedback_vocab_check_before_response.md`

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — vocab banido completo + 5 roles + URL rewrites + brand zero inline | Leandro |

# Fases 25-82 — Resto do Plano (formato denso)

> **Cada fase aqui segue o mesmo loop interno** documentado no `_TEMPLATE.md`: auditoria → plano de execução → execução → conferência → decisão automática.
> Pra fases futuras (não próximas), o detalhamento aqui é resumido. Quando uma fase virar 🔵 (próxima), DEVE ser expandida pra arquivo individual `fase-NN-{slug}.md` antes de começar.

---

## Fase 25 — Motion foundations + integração nos componentes

|                |            |
| -------------- | ---------- |
| **Camadas**    | 3          |
| **Estado**     | ⏳         |
| **Depende de** | 24         |
| **Bloqueia**   | 27, 60, 61 |
| **Tamanho**    | M          |

**Escopo (resumo):**

- Tokens motion: `--motion-instant: 80ms` até `--motion-celebrate: 800ms`
- 4 easings em `lib/design/motion.ts`
- Presets: `fadeIn`, `slideUp`, `scaleIn`, `stagger`, `sharedLayout`
- Componentes do DS animam via presets (Drawer, AlertDialog, Toast, Skeleton, Popover, Tooltip, Tabs, Accordion, Combobox)
- `<MotionConfig reducedMotion="user">` no root
- Lint `no-restricted-imports` força `motion/react`

**Loop interno:**

- **Auditoria:** listar componentes do DS sem motion presets, listar imports diretos de framer-motion (zero esperado).
- **Plano:** wave 01 — adicionar tokens; wave 02 — refatorar cada componente do DS pra usar preset; wave 03 — verificar reduced motion respeitado.
- **Conferência:** todos os componentes do DS usam preset, zero usa motion direto sem preset, axe-core respeita reduced motion.

---

## Fase 26 — Personalização visual: schema + style engine ✅

|                |                            |
| -------------- | -------------------------- |
| **Camadas**    | 1, 2, 5                    |
| **Estado**     | ✅ Concluída 2026-04-29    |
| **Depende de** | 21 (sem inline colors), 25 |
| **Bloqueia**   | 27                         |
| **Tamanho**    | M                          |

**Entregue:**

- Migration `20260429120000_add_professional_design_columns.sql`: 6 colunas de design + 5 white-label preparatórias + 6 CHECK constraints na tabela `professionals`. Aplicada no remoto via `supabase db query --linked`.
- `lib/design/presets.ts` reescrito: 6 templates curados (Energia/Clínico/Raiz/Revista/Noturno/Impacto) com palette+typography+mode+shape+density. Font overrides (moderna/editorial/esportiva) mapeados pra CSS data-typography.
- `lib/design/style-engine.ts`: `resolveDesignAttrs()` resolve config do profissional → data attributes HTML. `applyDesignToDocument()` / `clearDesignFromDocument()` pra DOM client-side. `designAttrsToProps()` pra SSR.
- `lib/data/professional-design.ts`: Zod schemas completos (`professionalDesignSchema`, `hexColorSchema` com validação APCA). `getProfessionalDesign()` e `getDesignBySlug()`.
- `lib/types/database.ts` atualizado com 11 novas colunas (Row/Insert/Update).
- `DesignForm.tsx` e server action adaptados pra usar `design_template` + overrides (schema Zod com `color_override` APCA-validated, `font_override`, `shape_override`, `density_override`, `theme_mode`).
- 23 testes novos: 14 style-engine (golden paths todos templates + overrides + system theme) + 9 presets.
- White-label: 5 campos preparatórios (`white_label_enabled` default false, `_custom_domain`, `_app_name`, `_logo_url`, `_email_from` nullable). Schema pronto, zero implementação.
- **Conferência:** tsc 0 erros, lint 0 erros, vitest 397/397, build OK.

---

## Fase 27 — Personalização visual: tela de Aparência

|                |                           |
| -------------- | ------------------------- |
| **Camadas**    | 3, 4                      |
| **Estado**     | ✅ (concluída 2026-04-29) |
| **Depende de** | 26                        |
| **Bloqueia**   | 45 (landing pública usa)  |
| **Tamanho**    | M                         |

**Escopo:**

- Tela `/settings/appearance`: seleção de estilo (6 tiles), cor de marca (9 swatches + picker custom), tipografia (3 vibes), shape, density
- Live preview lado a lado
- Salvar/descartar (sticky bar)
- Auditoria de **onde personalização vaza** (§1.4 do design system)
- Brand fixo permanece em dashboard interno + PWA cliente (D87)

**Concluído 2026-04-29:**

- Server action expandida: `design_template`, `color_override`, `font_override`, `shape_override`, `density_override`, `theme_mode` — Zod + APCA
- DesignForm reescrito: 6 seções (style tiles, brand color 9 swatches + hex custom, typography 3 vibes, shape 3, density 3, live preview)
- Live preview: hero + CTA + card refletem palette/shape/density/theme em tempo real
- Sticky save/discard bar bottom-fixed, aparece só com dirty state
- Validação APCA inline em cor custom. 30+ i18n keys. Brand fixo não vaza.
- 0 erros lint, 0 erros tsc, 397/397 testes

---

## Fase 28 — Branch protection + Husky + commitlint

|                |                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Camadas**    | 11                                                                                                                    |
| **Estado**     | ✅ (waves 01-02 concluídas e testadas; wave 03 bloqueada — GitHub Free não suporta branch protection em repo privado) |
| **Depende de** | (nenhuma técnica)                                                                                                     |
| **Bloqueia**   | (boa prática contínua)                                                                                                |
| **Tamanho**    | S                                                                                                                     |

**Escopo:**

- Branch protection em `main`: PR obrigatório, status checks (CI verde), sem force-push, conventional commit no PR title
- Husky pre-commit: `pnpm lint --staged`, `pnpm exec tsc --noEmit`
- Husky pre-push: `pnpm exec vitest run`
- commitlint com Conventional Commits

**Concluído 2026-04-29:**

- Wave 01: Husky v9.1.7 + lint-staged v16.4.0 — pre-commit (eslint + tsc), pre-push (vitest)
- Wave 02: commitlint v20.5.2 + config-conventional — commit-msg hook
- Wave 03: BLOQUEADA — branch protection/rulesets retornam 403 em repo privado com GitHub Free. Documentado em `docs/auditorias/2026-04-29-infra-husky-protection/waves/wave-03-branch-protection.md`. Reavaliar com upgrade para GitHub Team ou repo público

**Loop:** auditoria do que está configurado vs faltando, plano de waves, conferência roda script que valida cada gate.

---

## Fase 29 — Google OAuth + README profissional

|                |        |
| -------------- | ------ |
| **Camadas**    | 11, 12 |
| **Estado**     | ✅     |
| **Depende de** | 28     |
| **Tamanho**    | S      |

**Escopo:**

- Google OAuth: consent screen, credentials, redirect URI, teste e2e
- README profissional: setup local em < 30min, scripts disponíveis, estrutura, troubleshooting

**Concluído 2026-04-29:**

- Google OAuth já implementado no código: `GoogleButton` (OAuth flow) + `GoogleOneTap` (ID token flow) + `/callback` route + guards + rate limiting
- Fluxo e2e verificado: login/signup → Google → callback → exchangeCodeForSession → redirect por role
- `.env.example` criado na raiz com todas as vars de `lib/env.ts` documentadas (obrigatórias vs opcionais)
- `README.md` profissional: pré-requisitos, setup < 30min, Google OAuth setup (consent screen + credentials + redirect URI + Supabase provider), scripts, git hooks, estrutura do projeto, stack, troubleshooting

**Loop:** padrão.

---

## Fase 30 — Auth do `client` + rotas `/aluno/`

|                |                         |
| -------------- | ----------------------- |
| **Camadas**    | 1, 2, 5, 6              |
| **Estado**     | ✅ Concluída 2026-04-29 |
| **Depende de** | 5, 6, 7, 8, 9, 28, 29   |
| **Bloqueia**   | 50, 51                  |
| **Tamanho**    | M                       |

**Entregue:**

- Migration `add_client_role_and_invitation_columns`: `ALTER TYPE user_role ADD VALUE 'client'` + 5 colunas em `clients` (`profile_id`, `invitation_token`, `invitation_expires_at`, `invited_at`, `activated_at`) + 2 índices. Aplicada no remoto via MCP `apply_migration`.
- `database.ts` atualizado com `'client'` no enum e 5 novas colunas em clients Row/Insert/Update.
- Auth guards: `requireClient()` em `lib/auth/guards.ts`. Redirect `role='client'` → `/aluno/dashboard` em `lib/auth/redirect.ts`. `/aluno/` adicionado a `SAFE_PREFIXES`.
- Rotas em `app/(client)/`: layout enxuto (brand fixo onboarding.bio, sem sidebar/cmdK/bottom nav), `/aluno/dashboard` (placeholder "Bem-vindo, {nome}"), `/aluno/ativar` (ativação por token + senha ou Google OAuth).
- Redirects 301: `/aluno/login` → `/login`, `/aluno/forgot-password` → `/forgot-password`, `/aluno/reset-password` → `/reset-password` (login unificado, não duplicado — anti-padrão A5).
- Server actions: `activateClientAction` (valida token, cria user Supabase Auth, seta profile role='client', vincula `clients.profile_id`, marca `activated_at`). `inviteClientAction` (gera token UUID, expira 7d, single-use; email TODO Phase 47, log em dev).
- Data layer: `lib/data/client-auth.ts` com `createClientInvitation()` e `getClientByInvitationToken()`.
- i18n: `clientAuth.activatePage.*` + `clientAuth.dashboard.*` em `messages/pt-BR.json`.
- 4 testes novos de redirect para `role='client'` (19 total no arquivo, todos passando).
- URL migrada de `/c/` → `/aluno/` (decisão de produto: linguagem do mercado BR, mais discoverable, alinhado §2.4 — URL pública PT-BR). Zero referências `/c/` restantes.
- **Conferência:** tsc 0 erros, lint 0 erros, vitest 401/401, build OK.

**Decisões registradas:**

- D88: Login unificado em `/login` — detecta role e redireciona. Não duplicar componentes auth (A5).
- D89: Rotas de cliente em `/aluno/` (não `/c/`). Linguagem do mercado BR, discoverable, URL pública PT-BR.
- D90: Signup do cliente via convite (`/aluno/ativar?token=...`), não signup direto. Cliente só existe se profissional criou.
- D91: Migration reconciliada (2026-04-30). Arquivo local `20260430024727_add_client_role_and_invitation_columns.sql` criado retroativamente com timestamp exato do registro remoto.

---

## Fase 31 — Engenharia de prompts: schema + tabelas + logging ✅

|                |               |
| -------------- | ------------- |
| **Camadas**    | 2, 5          |
| **Estado**     | ✅ 2026-04-30 |
| **Depende de** | 4             |
| **Bloqueia**   | 32, 33, 41    |
| **Tamanho**    | M             |

**Escopo entregue:**

- `ai_prompts` expandida: 11 colunas novas (`key`, `version`, `system_prompt`, `user_template`, `output_schema_zod`, `model`, `max_tokens`, `temperature`, `examples`, `guardrails`, `created_by`). Colunas antigas `slug`/`prompt` mantidas como DEPRECATED (drop após Fase 32). 3 rows migrados (`key=slug`, `system_prompt=prompt`).
- `ai_prompt_versions` criada (append-only). Trigger `trg_ai_prompt_version_snapshot` auto-snapshots OLD row + auto-incrementa version no BEFORE UPDATE.
- `ai_generations` criada (14 colunas: prompt_key, version, model, input, output, tokens, cost, latency, professional_id, client_id, error). 3 indexes.
- Função `is_admin()` (SECURITY DEFINER, search_path seguro).
- RLS nas 3 tabelas (7 policies). Validado empiricamente com SET ROLE: authenticated lê prompts (✅), non-admin INSERT bloqueado (✅), anon vê 0 (✅ — fix: policy original era TO public), prof A/B isolados em generations (✅).
- `database.ts` types atualizados (3 tabelas).
- 5 migrations aplicadas via MCP.

**Decisões:** D92, D93.

**Loop:** padrão. Concluído.

---

## Fase 32 — Engenharia de prompts: migração dos prompts hardcoded ✅

|                |                         |
| -------------- | ----------------------- |
| **Camadas**    | 2                       |
| **Estado**     | ✅ Concluída 2026-04-30 |
| **Depende de** | 31                      |
| **Bloqueia**   | 33                      |
| **Tamanho**    | M                       |

**Entregue:**

- Shared utility `supabase/functions/_shared/ai-prompt.ts`: `getPrompt()` (lê prompt do banco, sem fallback hardcoded), `getSystemPromptText()`, `logGeneration()` (observabilidade em `ai_generations`).
- 4 prompts migrados pro banco (`ai_prompts`):
  - `generate-report.system` (v1): claude-sonnet-4-6, 6000 tokens, temp 0.3, 3222 chars. Prospect analysis (hero + 5 atos + bridge).
  - `generate-diagnostic.system` (v1): claude-sonnet-4-20250514, 8192 tokens, temp 0.3, 5740 chars. Full diagnostic report (senior consulting persona).
  - `submit-form.system` (v2, renomeado de haiku-report-v1): claude-haiku-4-5-20251001, 2048 tokens, temp 0.2, 3897 chars. Lead intake report.
  - `generate-site-content.system` (v1): claude-sonnet-4-20250514, 4096 tokens, temp 0.3, 8774 chars. Landing page content com `{{tone}}`/`{{nivel_tecnico}}` placeholders.
- 4 Edge Functions refatoradas: lêem prompt + model/temp/max_tokens do banco, logam em `ai_generations`. Zero prompt hardcoded.
- 2 arquivos deletados: `generate-diagnostic/_ai/system-prompt.ts`, `generate-site-content/_ai/build-system-prompt.ts`.
- Hardcoded `call-anthropic.ts` de 3 funções atualizado: model/temp/maxTokens aceitos como params (defaults mantidos como fallback local).
- 3 dev rows deletadas (`analise_diagnostic`, `prospect_diagnostic`, `haiku-report-v1`) — substituídas pelas 4 acima.
- Bonus fix: import fantasma `./analise.ts` → `./report.ts` em `submit-form/_engine/types/specialty-template.ts`.
- 4 Edge Functions deployadas e ACTIVE (generate-report v8, generate-diagnostic v16, submit-form v7, generate-site-content v7).
- JSONB keys PT (`pilares`, `reflexao`, `ato_*`, `camada_*`): 144+ refs em 30+ files — NÃO renomeadas. Deliberadamente adiado pra Phase 08 (prompt rewrite coordenado). Decisão D94.
- **Conferência:** tsc 0 erros, lint 0 erros (1 warning pré-existente), vitest 401/401, build OK. `grep SYSTEM_PROMPT supabase/functions/` = 0 resultados.

---

## Fase 33 — Engenharia de prompts: dashboard admin

|                |      |
| -------------- | ---- |
| **Camadas**    | 1, 3 |
| **Estado**     | ✅   |
| **Depende de** | 32   |
| **Tamanho**    | S    |

**Escopo:**

- `/admin/prompts` — listagem com filtro (all/active/inactive), toggle ativar/desativar inline
- `/admin/prompts/[key]` — editor completo (system_prompt, user_template, output_schema, model, temperature, max_tokens, examples JSONB, guardrails JSONB) + tab histórico de versões
- `/admin/prompts/[key]/generations` — logs de `ai_generations` com filtro período (7/30/90d) + erro, stats agregadas (custo, latência, taxa de erro)
- Server actions: `updatePromptAction`, `togglePromptActiveAction` — ambas com `requireAdmin()`
- Componentes: `PromptList`, `PromptEditor`, `PromptVersionHistory`, `GenerationsTable`, `JsonbEditor` em `components/admin/`
- 49 i18n keys em `messages/pt-BR.json`
- Link "Prompts IA" na nav do layout admin
- Validação empírica: RLS bloqueia professional (0 rows), permite admin (UPDATE 1), trigger versionamento dispara (snapshot em `ai_prompt_versions`)
- Adiado: botão "Testar" (requer rate limiting server-side), alarmes Sentry (Fase futura)

**Loop:** padrão. Concluída 2026-04-30.

---

## Fase 34 — Templates v2: bloco universal + engine NEAT

|                |         |
| -------------- | ------- |
| **Camadas**    | 1, 2    |
| **Estado**     | ⏳      |
| **Depende de** | 5, 6, 8 |
| **Bloqueia**   | 35      |
| **Tamanho**    | M       |

**Escopo:**

- Bloco universal v2 no WizardRoot (16-21 perguntas — ver `MASTER-SPEC.md` §14.1)
- Engine atualizado: TDEE usa NEAT real
- Tudo conforme `docs/produto/templates/MASTER-SPEC.md`

**Loop:** padrão. Conferência: TDEE calculado bate com fórmula validada (test unit).

---

## Fase 35 — Templates v2: versionamento + migração dos 33

|                |        |
| -------------- | ------ |
| **Camadas**    | 5      |
| **Estado**     | ⏳     |
| **Depende de** | 34, 36 |
| **Tamanho**    | L      |

**Escopo:**

- `specialty_template_versions`
- `pinned_version int` em `professional_templates`
- `overrides JSONB` validado por Zod
- `professional_template_versions` (histórico de edições)
- Migrar 33 templates v1 → v2: auditar contra MASTER-SPEC, remover perguntas que viraram universais, aprofundar branches em templates rasos
- Métricas separadas: `metricsToShow[]` (aluno) + `metricsForProfessional[]` (PT)

**Loop:** padrão. Auditoria por especialidade.

---

## Fase 36 ⚠️ — Validação clínica dos 5 BLOQUEANTES

|                                                                                                                                                   |                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Estado**                                                                                                                                        | ⚠️ Auditoria pendente |
| **Decisão sua:** quem valida? Pri Ortiz? Outro CREF? Grupo? Documento assinado deve ser arquivado em `docs/produto/templates/validacao-clinica/`. |
| **Bloqueia**                                                                                                                                      | 35, 39                |
| **Tamanho**                                                                                                                                       | M                     |

**Escopo:** validar clinicamente templates: gestante, terceira idade, reabilitação, águas abertas, ironman.

---

## Fase 37 — Schema desafios: 12 tabelas + RLS

|                |        |
| -------------- | ------ |
| **Camadas**    | 5, 6   |
| **Estado**     | ⏳     |
| **Depende de** | 5, 30  |
| **Bloqueia**   | 38, 40 |
| **Tamanho**    | M      |

**Escopo:**

- 12 tabelas (Hotmart pattern): `challenge_templates`, `challenge_template_versions`, `challenge_template_modules`, `challenge_template_components` (com `component_type` enum), `component_schedules`, `component_dependencies`, `challenge_instances`, `challenge_instance_component_overrides`, `enrollments`, `enrollment_component_progress`, `client_check_ins`, `client_gallery`
- RLS em todas
- Migration única, decisões de naming explícitas em `decisions.md`

**Loop:** padrão.

---

## Fase 38 — Schema desafios: pg_cron + Edge Function dispatch

|                |      |
| -------------- | ---- |
| **Camadas**    | 2, 5 |
| **Estado**     | ⏳   |
| **Depende de** | 37   |
| **Tamanho**    | S    |

**Escopo:**

- `pg_cron` extension habilitada
- Edge Function `dispatch-challenge-messages`
- Job pg_cron rodando a cada hora
- Logs estruturados

**Loop:** padrão.

---

## Fase 39 ⚠️ — Schema desafios: seed do template "21 Dias Mais Leve"

|                                                                                                      |                       |
| ---------------------------------------------------------------------------------------------------- | --------------------- |
| **Estado**                                                                                           | ⚠️ Auditoria pendente |
| **Decisão sua:** conteúdo final do template (cronograma, mensagens, descrição). Você + Pri produzem. |
| **Depende de**                                                                                       | 36, 37                |
| **Tamanho**                                                                                          | S                     |

---

## Fase 40 — Painel profissional do desafio: rotas + lista

|                |           |
| -------------- | --------- |
| **Camadas**    | 1, 2, 3   |
| **Estado**     | ⏳        |
| **Depende de** | 8, 23, 37 |
| **Bloqueia**   | 41, 42    |
| **Tamanho**    | M         |

**Escopo:**

- Rotas em `app/(app)/(shell)/desafios/`: `/desafios` (lista), `/desafios/[id]` (detalhes), `/desafios/[id]/editar`
- Lista usa `<DataTable>` (desktop) + `<MobileList>` (mobile)
- Empty states 3 variantes
- Loading skeleton específico

**Loop:** padrão.

---

## Fase 41 — Painel profissional do desafio: wizard de criação

|                |            |
| -------------- | ---------- |
| **Camadas**    | 1, 2, 3, 4 |
| **Estado**     | ⏳         |
| **Depende de** | 40         |
| **Tamanho**    | M          |

**Escopo:**

- `/desafios/novo`: wizard segue §6.4 do design system
- Multi-step com progresso, navegação, save automático de rascunho
- Validação por step

**Loop:** padrão.

---

## Fase 42 — Painel profissional do desafio: editor de componentes

|                |         |
| -------------- | ------- |
| **Camadas**    | 1, 2, 3 |
| **Estado**     | ⏳      |
| **Depende de** | 40      |
| **Tamanho**    | M       |

**Escopo:**

- Editor que permite override de componentes do template no instance
- Drawer responsivo
- Preview ao vivo
- Versionamento (histórico)

**Loop:** padrão.

---

## Fase 43 ⚠️ — Hospedagem de vídeo: decisão e implementação

|                                                                                                                      |                       |
| -------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Estado**                                                                                                           | ⚠️ Auditoria pendente |
| **Decisão sua:** hospedar (Mux/Cloudflare/Bunny) ou cola URL externa (YouTube/Vimeo). Trade-off de custo × controle. |
| **Bloqueia**                                                                                                         | 49                    |
| **Tamanho**                                                                                                          | M                     |

---

## Fase 44 ⚠️ — Pré-requisito legal: CNAE 74.90-1/04 no CNPJ

|                                                                            |                           |
| -------------------------------------------------------------------------- | ------------------------- |
| **Estado**                                                                 | ⚠️ Auditoria pendente     |
| **Decisão sua:** adicionar CNAE no contador (R$ 100-200, 5-15 dias úteis). |
| **Bloqueia**                                                               | 46                        |
| **Tamanho**                                                                | XS (operacional, não dev) |

---

## Fase 45 — Landing pública do desafio: estrutura + branding

|                |      |
| -------------- | ---- |
| **Camadas**    | 3, 4 |
| **Estado**     | ⏳   |
| **Depende de** | 27   |
| **Bloqueia**   | 46   |
| **Tamanho**    | M    |

**Escopo:**

- Landing em `/[slug]/desafio/[id]`
- Hero, dor, promessa, como funciona, prova social, FAQ, garantia, CTA
- Customizada com branding do profissional
- Hero image full-bleed, vídeo opcional com poster
- Layout segue §12.6 do design system

**Loop:** padrão.

---

## Fase 46 — Pagar.me: integração + split nativo + webhook

|                |                       |
| -------------- | --------------------- |
| **Camadas**    | 2, 5, 6               |
| **Estado**     | ⏳                    |
| **Depende de** | 5 (Edge Function), 44 |
| **Bloqueia**   | 47                    |
| **Tamanho**    | M                     |

**Escopo:**

- Recebedor principal: profissional (80%)
- Recebedor split: onboarding.bio (20%)
- Edge Function `pagarme-webhook` (handler)
- Validação de assinatura do webhook
- Idempotência

**Loop:** padrão. Testes E2E sandbox Pagar.me.

---

## Fase 47 — Enrollment: fluxo completo + email de boas-vindas

|                |         |
| -------------- | ------- |
| **Camadas**    | 1, 2, 4 |
| **Estado**     | ⏳      |
| **Depende de** | 7, 46   |
| **Bloqueia**   | 49      |
| **Tamanho**    | M       |

**Escopo:**

- Lead → paga → enrollment `pending_payment`
- Webhook confirma → `active`
- Cliente criado/linkado
- Email de boas-vindas via Resend
- Alocação automática de grupo WhatsApp

**Loop:** padrão.

---

## Fase 48 — Sequência de e-mails de pré-venda: templates + UI

|                |         |
| -------------- | ------- |
| **Camadas**    | 2, 3, 4 |
| **Estado**     | ⏳      |
| **Depende de** | 31, 47  |
| **Tamanho**    | M       |

**Escopo:**

- Templates parametrizáveis em `lib/email/templates/launch-sequence/`
- Sequência configurável por profissional via UI
- Aquecimento da lista antes de abrir vagas
- Estrutura: pré-lançamento (3-5 emails) → abertura → escassez → fechamento

**Loop:** padrão.

---

## Fase 49 — Onboarding pós-pagamento: intake + foto inicial

|                |            |
| -------------- | ---------- |
| **Camadas**    | 1, 2, 3, 4 |
| **Estado**     | ⏳         |
| **Depende de** | 43, 47     |
| **Tamanho**    | M          |

**Escopo:**

- Intake form (Bloco K + Bloco V)
- Foto inicial estruturada (3 ângulos, fundo branco, jejum)
- Redirect pra `/c/dashboard`

**Loop:** padrão.

---

## Fase 50 — PWA cliente: shell + 6 abas + manifest

|                |         |
| -------------- | ------- |
| **Camadas**    | 1, 3, 8 |
| **Estado**     | ⏳      |
| **Depende de** | 30      |
| **Bloqueia**   | 51, 52  |
| **Tamanho**    | M       |

**Escopo:**

- App em `/c/` com 6 abas: Home, Programa, Evolução, Comunidade, Recursos, Perfil
- Bottom tab 6 slots seguindo §6.2 do design system
- Brand fixo `onboarding.bio` (teal) — D87
- Manifest, ícones em todas resoluções, theme-color

**Loop:** padrão.

---

## Fase 51 — PWA cliente: check-in noturno + foto evolução

|                |         |
| -------------- | ------- |
| **Camadas**    | 2, 3, 4 |
| **Estado**     | ⏳      |
| **Depende de** | 50      |
| **Tamanho**    | S       |

**Escopo:**

- Check-in noturno: botão grande, opções ✅ 🟡 ❌ + texto livre
- Foto de evolução: upload, comparação semanal (§11.6)

**Loop:** padrão.

---

## Fase 52 — PWA cliente: notificações push + offline

|                |      |
| -------------- | ---- |
| **Camadas**    | 2, 8 |
| **Estado**     | ⏳   |
| **Depende de** | 50   |
| **Tamanho**    | S    |

**Escopo:**

- Service worker (Workbox ou next-pwa)
- Notificações push (Web Push API)
- Offline básico (read-only)
- Install prompt customizado (após 3 sessões, detecta iOS Safari)

**Loop:** padrão.

---

## Fase 53 — WhatsApp Cloud API: integração + webhook

|                |        |
| -------------- | ------ |
| **Camadas**    | 2, 6   |
| **Estado**     | ⏳     |
| **Depende de** | 5      |
| **Bloqueia**   | 54, 55 |
| **Tamanho**    | M      |

**Escopo:**

- Verificação Meta + chip dedicado
- Templates aprovados (5-15 dias)
- Webhook handler em Edge Function `wa-webhook`
- Validação de assinatura

**Loop:** padrão.

---

## Fase 54 — WhatsApp: mensagens diárias programadas + dispatcher

|                |     |
| -------------- | --- |
| **Camadas**    | 2   |
| **Estado**     | ⏳  |
| **Depende de** | 53  |
| **Tamanho**    | M   |

**Escopo:**

- 7h bom dia + tarefa, 11h hidratação, 14h treino, 17h passos, 22h check-in com botões
- Dispatcher Edge Function chamada por pg_cron
- Idempotência

**Loop:** padrão.

---

## Fase 55 — WhatsApp: sentiment analysis + detecção de risco

|                |        |
| -------------- | ------ |
| **Camadas**    | 2      |
| **Estado**     | ⏳     |
| **Depende de** | 54, 33 |
| **Tamanho**    | M      |

**Escopo:**

- Classificação 5 níveis via Claude Haiku
- Tópicos: dor, desistência, conquista, dúvida, ansiedade
- Urgência: imediata / 24h / monitorar
- Detecção: sem check-in 3 dias → alerta; sentimento negativo + dor → urgente; menção a desistência → crítico

**Loop:** padrão.

---

## Fase 56 — Cases automáticos: geração + aprovação + download

|                |         |
| -------------- | ------- |
| **Camadas**    | 2, 3, 4 |
| **Estado**     | ⏳      |
| **Depende de** | 55      |
| **Tamanho**    | M       |

**Escopo:**

- Marco (5%+ peso, 3+cm cintura, NPS 9-10) + autoriza imagem → card auto-gerado
- Profissional aprova / edita / baixa JPG (1080×1080)

**Loop:** padrão.

---

## Fase 57 — Analytics agregados por desafio

|                |         |
| -------------- | ------- |
| **Camadas**    | 1, 2, 3 |
| **Estado**     | ⏳      |
| **Depende de** | 51, 55  |
| **Tamanho**    | M       |

**Escopo:**

- `/desafios/[id]/analytics`: adesão da turma, NPS médio, cohort retention, conversão pra continuidade, receita gerada, cases prontos

**Loop:** padrão.

---

## Fase 58 — Dashboard PT: risk flags + readiness + LTV

|                |         |
| -------------- | ------- |
| **Camadas**    | 1, 2, 3 |
| **Estado**     | ⏳      |
| **Depende de** | 55, 57  |
| **Tamanho**    | M       |

**Escopo:**

- `/dashboard` (§12.1 do design system)
- Risk flags por aluno, readiness score, adherence prediction, cardiovascular risk, LTV estimado

**Loop:** padrão.

---

## Fase 59 — Pesquisa de saída + pitch de continuidade

|                |      |
| -------------- | ---- |
| **Camadas**    | 2, 4 |
| **Estado**     | ⏳   |
| **Depende de** | 51   |
| **Tamanho**    | S    |

**Escopo:**

- Pesquisa de saída automática (dia 19-21): 8 perguntas
- Pitch de continuidade automático (dia 21 + email D+1): 3 caminhos

**Loop:** padrão.

---

## Fase 60 — Native patterns: pull-to-refresh + swipe + haptics

|                |        |
| -------------- | ------ |
| **Camadas**    | 3      |
| **Estado**     | ⏳     |
| **Depende de** | 25, 50 |
| **Tamanho**    | M      |

**Escopo:**

- Pull-to-refresh em listas (alunos, mensagens, dashboard PT, Home PWA)
- Swipe horizontal entre dias do calendário (PWA)
- Swipe pra arquivar mensagem (dashboard PT)
- Haptic feedback (`useHaptic()` hook)

**Loop:** padrão.

---

## Fase 61 — Native patterns: page transitions + install prompt

|                |     |
| -------------- | --- |
| **Camadas**    | 3   |
| **Estado**     | ⏳  |
| **Depende de** | 25  |
| **Tamanho**    | S   |

**Escopo:**

- Page transitions: slide horizontal forward/reverse (mobile), fade simples 150ms (desktop)
- Splash screen real, status bar styling

**Loop:** padrão.

---

## Fase 62 — Craft pass: 15 telas críticas

|                |                           |
| -------------- | ------------------------- |
| **Camadas**    | 3, 4                      |
| **Estado**     | ⏳                        |
| **Depende de** | 60, 61, todas as features |
| **Tamanho**    | L                         |

**Escopo:** polish cirúrgico em 15 telas críticas (lista em `PLANO_LANCAMENTO.md` antigo §16.2).

Para cada tela: hierarquia visual, EmptyState 3 variantes, skeleton com shape correto, microcopy específica, erro útil, atalho de teclado, gestures úteis, optimistic updates.

**Loop:** padrão. Auditoria pré-craft, plano por tela, conferência manual + lighthouse.

---

## Fase 63 — Performance budget: bundle + LCP + optimistic

|                |       |
| -------------- | ----- |
| **Camadas**    | 8, 11 |
| **Estado**     | ⏳    |
| **Depende de** | 62    |
| **Tamanho**    | M     |

**Escopo:**

- LCP < 2s em landing pública
- Skeleton aparece em < 100ms
- Optimistic updates em check-in, toggle, save curto
- Image loading: AVIF + WebP, blur placeholder, `fetchpriority="high"` no LCP
- Bundle splitting: cliente não baixa código de admin
- Bundle budget cravado em CI (`bundlesize`)

**Loop:** padrão.

---

## Fase 64 — Hardening de segurança: rate limit + CSP + secret scan

|                |        |
| -------------- | ------ |
| **Camadas**    | 6, 11  |
| **Estado**     | ⏳     |
| **Depende de** | 28, 30 |
| **Tamanho**    | M      |

**Escopo:**

- Rate limiting em endpoints públicos (login, signup, forgot, reset, contato)
- CSP headers calibrados (sem unsafe-inline)
- Secret scanning em CI (gitleaks)
- Pre-commit hook bloqueia commit com secret

**Loop:** padrão.

---

## Fase 65 — Hardening de segurança: dependency review

|             |     |
| ----------- | --- |
| **Camadas** | 11  |
| **Estado**  | ⏳  |
| **Tamanho** | XS  |

**Escopo:**

- Dependabot configurado, revisão manual mensal
- Revisar alerts acumulados

**Loop:** padrão.

---

## Fase 66 — Hardening de banco: backup verificado + DR plan

|             |     |
| ----------- | --- |
| **Camadas** | 12  |
| **Estado**  | ⏳  |
| **Tamanho** | XS  |

**Escopo:**

- Confirmar Point-in-Time Recovery habilitado no Supabase (dashboard)
- Fazer 1 restore real em ambiente de teste pra confirmar que PITR funciona
- Documentar procedimento de restore em runbook simples

**Loop:** padrão.

---

## Fase 67 — Hardening LGPD: DSR + retenção + processadores

|             |       |
| ----------- | ----- |
| **Camadas** | 6, 12 |
| **Estado**  | ⏳    |
| **Tamanho** | M     |

**Escopo:**

- Processo de DSR (data subject request) funcional testado
- Privacy policy atualizada com lista de processadores (Supabase, Pagar.me, Resend, Anthropic)
- Fluxo de breach notification

**Loop:** padrão.

---

## Fase 68 — Observabilidade: logging estruturado

|             |     |
| ----------- | --- |
| **Camadas** | 10  |
| **Estado**  | ⏳  |
| **Tamanho** | S   |

**Escopo:**

- Sentry calibrado com source maps
- Sem `console.log` em produção (lint trava)
- PII não vaza pra logs

**Loop:** padrão.

---

## Fase 69 — Observabilidade: métricas de negócio + Web Vitals RUM

|             |     |
| ----------- | --- |
| **Camadas** | 10  |
| **Estado**  | ⏳  |
| **Tamanho** | S   |

**Escopo:**

- Vercel Analytics configurado
- Eventos básicos de negócio rastreados (signup, lead criado, desafio comprado)

**Loop:** padrão.

---

## Fase 70 — Observabilidade: alertas calibrados + runbook

|             |        |
| ----------- | ------ |
| **Camadas** | 10, 12 |
| **Estado**  | ⏳     |
| **Tamanho** | S      |

**Escopo:**

- Sentry alertas calibrados (taxa anômala, não evento único)
- Runbook simples (o que fazer quando X cai)

**Loop:** padrão.

---

## Fase 71 — Testes em camadas: unit lib/domain (≥80%)

|             |     |
| ----------- | --- |
| **Camadas** | 7   |
| **Estado**  | ⏳  |
| **Tamanho** | M   |

**Escopo:**

- Vitest unit tests em `lib/domain/` ≥ 80% coverage
- Edge cases: empty, null, undefined, valores extremos, unicode
- Asserts específicos, não "espera não dar erro"

**Loop:** padrão.

---

## Fase 72 — Testes em camadas: integration lib/data

|             |     |
| ----------- | --- |
| **Camadas** | 7   |
| **Estado**  | ⏳  |
| **Tamanho** | M   |

**Escopo:**

- Vitest integration tests em `lib/data/` cobrindo queries críticas
- Payload conhecido, asserts específicos

**Loop:** padrão.

---

## Fase 73 — Testes em camadas: RPC smoke + RLS isolation

|             |      |
| ----------- | ---- |
| **Camadas** | 5, 7 |
| **Estado**  | ⏳   |
| **Tamanho** | M    |

**Escopo:**

- RPCs críticas com smoke test (input válido → output válido)
- RLS das tabelas multi-tenant com teste de isolamento (A não vê B)
- Vitest contra Supabase local

**Loop:** padrão.

---

## Fase 74 — Testes em camadas: E2E Playwright golden paths

|             |     |
| ----------- | --- |
| **Camadas** | 7   |
| **Estado**  | ⏳  |
| **Tamanho** | M   |

**Escopo:**

- Profissional: signup → setup → criar desafio → ver inscritos → enviar mensagem
- Cliente: ver landing → comprar → fazer intake → fazer check-in → ver dashboard final

**Loop:** padrão.

---

## Fase 75 — Testes em camadas: a11y axe-core em CI

|             |      |
| ----------- | ---- |
| **Camadas** | 7, 9 |
| **Estado**  | ⏳   |
| **Tamanho** | S    |

**Escopo:**

- axe-core rodado manualmente em rotas críticas durante review de a11y
- Resultados documentados, não como gate de CI

**Loop:** padrão.

---

## Fase 76 — Audit a11y manual: NVDA + VoiceOver em telas críticas

|             |     |
| ----------- | --- |
| **Camadas** | 9   |
| **Estado**  | ⏳  |
| **Tamanho** | M   |

**Escopo:**

- Auditoria manual com NVDA (Windows) + VoiceOver (Mac/iOS) em telas críticas: signup, dashboard, formulário público, relatório, PWA cliente
- Documentado em `docs/produto/design/audit-a11y.md`

**Loop:** padrão.

---

## Fase 77 ⚠️ — Audit externo de segurança: penetration test

|                                                                                                                                             |                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Estado**                                                                                                                                  | 📦 Movido pra pós-beta (simplificação 2026-04-29) |
| **Decisão sua:** contratar empresa de pentest (R$ 5k-15k típico). Foco: auth, RLS bypass, payment integration, Edge Functions, file upload. |
| **Bloqueia**                                                                                                                                | —                                                 |
| **Tamanho**                                                                                                                                 | M                                                 |

**Movido pra pós-beta:** não bloqueia mais o beta. Fazer quando houver tração e budget.

---

## Fase 78 ⚠️ — Audit externo de a11y: WCAG 2.2 AA validado

|                                                  |                                                   |
| ------------------------------------------------ | ------------------------------------------------- |
| **Estado**                                       | 📦 Movido pra pós-beta (simplificação 2026-04-29) |
| **Decisão sua:** contratar auditor independente. |
| **Bloqueia**                                     | —                                                 |
| **Tamanho**                                      | S                                                 |

**Movido pra pós-beta:** não bloqueia mais o beta. Fazer quando houver tração e budget.

---

## Fase 79 ⚠️ — Audit externo de performance: WebPageTest profissional

|                                                                                  |                                                   |
| -------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Estado**                                                                       | 📦 Movido pra pós-beta (simplificação 2026-04-29) |
| **Decisão sua:** WebPageTest profissional ou consultoria. Opcional, recomendado. |
| **Bloqueia**                                                                     | —                                                 |
| **Tamanho**                                                                      | S                                                 |

**Movido pra pós-beta:** não bloqueia mais o beta. Fazer quando houver tração e budget.

---

## Fase 80 ⚠️ — Audit jurídico: ToS + Privacy + DPA + LGPD operacional

|                                                                     |                       |
| ------------------------------------------------------------------- | --------------------- |
| **Estado**                                                          | ⚠️ Auditoria pendente |
| **Decisão sua:** advogado revisa ToS, Privacy, DPA, processos LGPD. |
| **Bloqueia**                                                        | 82                    |
| **Tamanho**                                                         | M                     |

---

## Fase 81 — Documentação operacional: runbook + on-call

|             |     |
| ----------- | --- |
| **Camadas** | 12  |
| **Estado**  | ⏳  |
| **Tamanho** | S   |

**Escopo:**

- Runbook completo em `docs/plano/operacional/runbook.md`
- O que fazer quando Supabase/Pagar.me/WhatsApp/Resend cair
- Como fazer rollback de deploy
- Como restaurar backup
- On-call (mesmo que solo)

**Loop:** padrão.

---

## Fase 82 ⚠️ — Beta fechado: 50 vagas P1 + opt-in P2

|                                                                                      |                       |
| ------------------------------------------------------------------------------------ | --------------------- |
| **Estado**                                                                           | ⚠️ Auditoria pendente |
| **Decisão sua:** critérios de saída do beta (NPS ≥ 50? churn < 5%/mês? MRR mínimo?). |
| **Tamanho**                                                                          | ongoing               |

**Escopo:**

- 50 vagas R$ 47/mês vitalício (P1)
- P2 (Desafios) entra como opt-in
- Acesso direto ao fundador
- Onboarding manual dos primeiros 5
- NPS semanal nas primeiras 4 semanas
- SLA bugs: P0 4h, P1 24h, P2 1 semana

**Pré-requisito de abertura — Lighthouse manual:**

- Rodar Lighthouse manualmente em rotas críticas (landing, dashboard, `/{slug}`, relatório)
- Performance ≥ 80 em todas, ≥ 90 em landing
- Documentar resultado

---

## Pós-launch (Fase 83+) — Parking lot

| Item                                         | Origem              | Quando                                  |
| -------------------------------------------- | ------------------- | --------------------------------------- |
| Vibe coding builder (desafios)               | D38                 | Após 1 template ponta-a-ponta validado  |
| Templates de acompanhamento                  | conversa 2026-04-29 | Após desafios estabilizarem             |
| Hospedagem de vídeo cobrada por uso          | conversa 2026-04-29 | Pós-tração                              |
| Webinar/transmissão integrada                | conversa 2026-04-29 | Pós-tração                              |
| Programa de afiliados                        | conversa 2026-04-29 | Pós-tração                              |
| Domínio customizado por extensão paga        | conversa 2026-04-29 | Pós-tração                              |
| Tier de comissão decrescente                 | conversa 2026-04-29 | Quando houver PT 6-dígitos/mês          |
| Treino IA self-service                       | D56                 | Pós-tração; commodity                   |
| Agenda interna                               | D57                 | Pós-tração                              |
| App nativo                                   | D58                 | Após PWA validar caso de uso            |
| Multi-modalidade                             | D6                  | Após 50 betas validarem single-modality |
| Marketplace de templates entre profissionais | —                   | Visão de longo prazo                    |
| Integração Strava/Garmin                     | —                   | Pesquisa em andamento                   |
| Expansão pra nutricionista esportivo         | conversa 2026-04-29 | Após 50 betas validados                 |

# Resumo Executivo — Plano Impecável

> **Pacote completo entregue em 2026-04-29.**
> Refaz o `PLANO_LANCAMENTO.md` linear, sem subfases, com loop interno fechado por fase. Cria `PADRAO-IMPECAVEL.md` como referência técnica canônica. Estrutura `docs/auditorias/` pra rastreio de cada auditoria.

---

## O que foi entregue

### 1. Padrão Impecável (canônico)

`docs/plano-lancamento/PADRAO-IMPECAVEL.md` — 12 camadas + 8 anti-padrões fundamentais:

1. **Código** (SOLID, reutilização, tipagem estrita, error handling, imports, naming, tamanho de arquivo)
2. **Separação Lógica × UI × Dados × IO Externo** (5 camadas: app/, lib/data/, lib/domain/, Supabase, Edge Functions)
3. **UI** (referencia DESIGN-SYSTEM-FOUNDATION.md, não duplica)
4. **UX** (referencia posicionamento.md §5-6, não duplica)
5. **Banco de Dados** (RLS, FKs, índices, naming)
6. **Segurança** (rate limit, CSP, Dependabot)
7. **Testes** (golden paths: unit, integration, RPC, RLS, E2E, VRT, a11y manual)
8. **Performance** (Lighthouse≥90, LCP<2s, AVIF/WebP)
9. **Acessibilidade** (WCAG 2.2 AA via lint, NVDA+VoiceOver manual)
10. **Observabilidade** (Sentry + Vercel Analytics)
11. **CI/CD** (gates obrigatórios, branch protection, conventional commits)
12. **Documentação** (mínimo necessário, runbook operacional)

**Anti-padrões:**

- A1 — Warning como estado final (lint só termina como `error`)
- A2 — "Resolvo depois" (fase só fecha com critério cumprido)
- A3 — Exception sem justificativa concreta
- A4 — "Funciona, então tá pronto"
- A5 — Cópia disfarçada de "reutilização"
- A6 — Sufixo `Old`/`New` (mascarar dívida)
- A7 — Decisão silenciosa (sem registro em decisions.md)
- A8 — Feature flag eterno

### 2. Plano linear reescrito

`docs/plano-lancamento/PLANO_LANCAMENTO.md` — 82 fases lineares (1, 2, 3...), sem subfases. Cada fase tem:

- Camadas do PADRAO-IMPECAVEL cobertas
- Estado (✅/🔵/⏳/⚠️)
- Dependências
- Tamanho estimado
- Loop interno fechado: auditoria → plano → execução → conferência → próxima fase ou rev2

**Mudanças vs versão anterior:**

- L de subfases (04.0, 04.1a, 04.1b...) → fases lineares 10-19
- "Fase 04" antiga fragmentada → fechada com Fases 20-24
- Plano expandido de ~19 fases pra **82 fases pequenas e focadas**
- Cada fase com critério mensurável e comando exato de verificação
- Anti-padrões de simplificação cravados explicitamente

### 3. Fases individuais

`docs/plano/fases/`:

| Arquivo                                | Conteúdo                                                      |
| -------------------------------------- | ------------------------------------------------------------- |
| `_TEMPLATE.md`                         | Template canônico de fase (copiar pra criar nova)             |
| `fase-05-separacao-camadas.md`         | Próxima a executar — separação Lógica × UI × Dados × IO       |
| `fase-06-tipagem-estrita.md`           | Tipagem end-to-end, zero `any`                                |
| `fase-07-tratamento-erro.md`           | Erros tipados em camadas                                      |
| `fase-08-i18n-completo.md`             | Migração das 306 strings hardcoded                            |
| `fase-09-a11y-completo.md`             | Promoção das regras a11y a `error` + autoFocus                |
| `fase-20-migracao-headings.md`         | Migração de 309 headings (✅ concluída 2026-04-29)            |
| `fase-21-migracao-inline-colors.md`    | Migração de 127 inline colors (✅ concluída 2026-04-29)       |
| `fase-22-revisao-buttons-excluidos.md` | Revisão honesta dos 5 buttons                                 |
| `fase-23-governanca-final-ds.md`       | Promoção final das regras de DS a `error`                     |
| `fase-24-conferencia-ds.md`            | Conferência cruzada do design system completo                 |
| `fases-10-19-historico.md`             | Documentação retroativa do trabalho do design system já feito |
| `fases-25-82.md`                       | Detalhamento das 58 fases restantes (formato denso)           |

### 4. Estrutura de auditorias

`docs/auditorias/`:

```
docs/auditorias/
├── _template/                      ← estrutura canônica de pasta de auditoria
├── _pendentes/                     ← 9 auditorias pendentes de decisão sua
│   ├── RESUMO-DECISOES.md          ← lista consolidada das 9 decisões
│   ├── fase-36-validacao-clinica/
│   ├── fase-39-seed-template-21-dias/
│   ├── fase-43-hospedagem-video/
│   ├── fase-44-cnae/
│   ├── fase-77-pentest/
│   ├── fase-78-a11y-externo/
│   ├── fase-79-perf-externo/
│   ├── fase-80-juridico/
│   └── fase-82-criterios-beta/
└── (futuras: {YYYY-MM-DD}-{slug}/  ← uma por execução de fase)
```

---

## Como o agente trabalha daqui pra frente

1. **Lê** `PLANO_LANCAMENTO.md` e identifica próxima fase 🔵.
2. **Abre** `docs/plano-lancamento/fase-NN.md` com detalhe.
3. **Executa loop interno**:
   - Cria `docs/auditorias/{YYYY-MM-DD}-{slug}/`
   - Roda comandos de auditoria, gera arquivos de violação
   - Cria `waves/`, um arquivo por wave (briefing pronto pra abrir conversa nova)
   - Executa waves (paralelo onde indicado)
   - Cria `verificacao.md` com resultado de cada critério
4. **Decisão automática**:
   - ✅ → atualiza plano, vai pra próxima fase
   - ❌ → cria `{slug}-rev2/`, repete loop
   - **Nunca avança com critério não cumprido.**

Anti-padrões cravados em cada fase:

- Lint não tem warning como estado final
- "Resolvo depois" não fecha fase
- Exception precisa razão técnica nominada
- Funcionar não é o mesmo que pronto

---

## Progresso (atualizado 2026-05-01)

| #   | Fase                                                        | Estado | Resultado                                                                                                                                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5   | Separação Lógica × UI × Dados × IO                          | ✅     | 25 components → server actions, 3 arquivos decompostos                                                                                                                                                                                                                                                                                                    |
| 6   | Tipagem estrita                                             | ✅     | 18 any → 0 (1 aceito), Supabase types regenerados                                                                                                                                                                                                                                                                                                         |
| 7   | Tratamento de erro tipado                                   | ✅     | lib/errors/ criado, 170 throws tipados                                                                                                                                                                                                                                                                                                                    |
| 8   | i18n completo                                               | ✅     | 306 strings → t(), jsx-no-literals zerado                                                                                                                                                                                                                                                                                                                 |
| 9   | a11y autoFocus                                              | ✅     | 14 warnings → 0 (todas documentadas)                                                                                                                                                                                                                                                                                                                      |
| 20  | Migração 309 headings                                       | ✅     | 309 linhas removidas, 0 restantes, outline OK                                                                                                                                                                                                                                                                                                             |
| 21  | Migração 127 inline colors                                  | ✅     | 127 warnings → 0; 8 tokens semânticos criados (success/warning/whatsapp/score-\*); 35 arquivos migrados                                                                                                                                                                                                                                                   |
| 22  | Revisão dos 22 buttons (5 excluídos + 17 motion.button gap) | ✅     | Contagem real: 22, não 5. Criados `<SelectionCard>` (11 consumers) e `<UploadDropzone>` (2 consumers). 6 exceptions finais com razão única. D75-D78 registrados.                                                                                                                                                                                          |
| 23  | Governança final DS (regras → `error`)                      | ✅     | Bloco promovido a `error` (D80). 4 testes de regressão OK. Deploy production verificado.                                                                                                                                                                                                                                                                  |
| 24  | Conferência final DS                                        | ✅     | DS selado (D83). APCA 16/18, Ladle 50% stories (gap catálogo). 4 issues para backlog.                                                                                                                                                                                                                                                                     |
| 25  | Motion foundations                                          | ✅     | 6 duration + 4 easing tokens CSS. `lib/design/motion.ts` canonical. `MotionConfig reducedMotion="user"` no root. 6 presets (D84).                                                                                                                                                                                                                         |
| 26  | Personalização visual: schema + style engine                | ✅     | Migration 11 colunas (6 design + 5 white-label) + 6 CHECK constraints. Style engine (`resolveDesignAttrs`). 6 templates curados (D85). Data layer Zod + APCA. 23 testes.                                                                                                                                                                                  |
| 27  | Personalização visual: tela de Aparência                    | ✅     | DesignForm completo: 6 style tiles, 9 color swatches + hex custom c/ APCA inline, 3 typography vibes, shape/density selectors, live preview (hero+CTA+card), sticky save/discard bar. Server action expandida (6 campos). 30+ i18n keys. Brand fixo não vaza. 0 erros lint/tsc, 397 testes.                                                               |
| 28  | Husky + commitlint + branch protection                      | ✅     | pre-commit lint+tsc, commit-msg commitlint, pre-push vitest. Branch protection bloqueada no GitHub Free (D79). lint-staged exclui scripts/.                                                                                                                                                                                                               |
| 29  | Google OAuth + README profissional                          | ✅     | OAuth e2e verificado (GoogleButton + GoogleOneTap + callback). `.env.example` criado. README profissional com setup < 30min, OAuth guide, scripts, estrutura, troubleshooting.                                                                                                                                                                            |
| 30  | Auth cliente + rotas `/aluno/`                              | ✅     | Migration `client` role + 5 colunas convite. `requireClient()` guard. Rotas `app/(client)/aluno/` (layout enxuto, brand fixo). Ativação por token. Login unificado (D88). URL `/aluno/` (D89). 401 testes.                                                                                                                                                |
| 31  | Engenharia de prompts: schema + tabelas + logging           | ✅     | `ai_prompts` expandida (11 colunas novas). `ai_prompt_versions` append-only + trigger auto-snapshot. `ai_generations` logging (14 cols). `is_admin()` helper. RLS 7 policies, validada empiricamente com SET ROLE (D92, D93). 5 migrations via MCP. 401 testes.                                                                                           |
| 32  | Engenharia de prompts: migração dos prompts hardcoded       | ✅     | 4 Edge Functions migradas: prompts lidos de `ai_prompts` (zero hardcoded). Shared `_shared/ai-prompt.ts` (getPrompt + logGeneration). 4 prompts no banco com model/temp/max_tokens. 3 dev rows limpas. 4 deploys ACTIVE. JSONB keys PT adiadas pra Phase 08 (D94). Bonus: fix import fantasma `analise.ts`.                                               |
| 33  | Engenharia de prompts: dashboard admin                      | ✅     | `/admin/prompts` — listagem+filtro, editor completo (11 campos + JSONB validado), tab histórico versões, logs `ai_generations` com stats (custo/latência/taxa erro). 5 componentes em `components/admin/`. 49 i18n keys. RLS validada empiricamente: professional bloqueado, admin edita + trigger versiona. Adiado: botão "Testar" (rate limiting). D96. |

**PLAYBOOK-MVP Fases 0-4 concluídas (2026-04-30):** globals.css, components/ui base, hooks+componentes novos, i18n+constants+pricing+brand. 130 strings PT migradas para getTranslations(). Pricing centralizado R$27/R$67 (D97). Brand tagline alinhado com positioning.md. Timing constants e MODALITY_PROFESSIONAL_TITLES consolidados. .lintstagedrc fix (--no-warn-ignored). 401/401 testes, 0 erros lint/tsc.

**Auditoria retroativa (2026-04-30):** Fases 20-30 verificadas empiricamente. Todas ✅ confirmadas. Migration Fase 30 reconciliada (D91) — arquivo local `20260430024727_add_client_role_and_invitation_columns.sql` criado retroativamente com timestamp exato do remoto.
**Lint atual:** 0 erros, 1 warning (pré-existente `.ladle/config.mjs`).
**Testes:** 401/401 (46 test files).
**Fase 33 (dashboard admin prompts):** RLS validada empiricamente (D96). 5 componentes, 49 i18n keys, 3 server actions.
**Bug ESLint corrigido:** D74 — no-raw-button estava silenciosamente desligado. D75 — motion.button escapava do selector AST.
**Componentes DS novos (Fase 22):** `<SelectionCard>` (selection cards com whileTap spring), `<UploadDropzone>` (upload areas com preview/loading).
**Deploy fix (D81-D82):** `lib/env.ts` trata empty strings de `vercel pull`; commits de agent bloqueiam auto-deploy Vercel (author não-membro).

---

## Decisões pendentes suas (6 fases ⚠️)

Ver `docs/plano-lancamento/RESUMO-DECISOES.md` pro detalhe de cada uma.

**Bloqueiam beta (decidir agora):**

- Fase 44 — CNAE 74.90-1/04 (5-15 dias úteis)
- Fase 80 — Audit jurídico (2-4 semanas)

**Bloqueiam Produto 2 (decidir antes da Fase 35):**

- Fase 36 — Validação clínica (depende de Pri Ortiz)
- Fase 39 — Seed "21 Dias" (depende de você + Pri)
- Fase 43 — Hospedagem de vídeo (recomendação: Bunny Stream)

**Decidir mais perto do beta:**

- Fase 82 — Critérios de saída beta

**Movidas pra pós-beta (simplificação 2026-04-29):**

- Fases 77, 78, 79 — audits externos (pentest, a11y, perf)

---

## O que não mudou

- `docs/core/positioning.md` (não tocado)
- `docs/core/DESIGN-SYSTEM-FOUNDATION.md` (não tocado)
- `docs/produto/templates/MASTER-SPEC.md` (não tocado)
- `docs/produto/formulario-editor/SPEC.md` (não tocado)
- `docs/produto/desafios/contexto.md` (não tocado)
- `docs/core/decisions.md` (atualizado: D74-D78 adicionados)
- `docs/core/architecture.md` (não tocado)
- `docs/core/schema.md` (não tocado)

Tudo isso continua sendo fonte canônica. Plano e padrão impecável **referenciam**, não duplicam.

---

## Tamanho real do trabalho

**Sem ilusão:**

- Plano impecável = 82 fases reais, cada uma fechada com critério cravado
- Cada fase = 4h (XS) a 2 semanas (L)
- Soma estimada (sem auditorias externas): **6-9 meses focado**
- Com auditorias externas: **8-12 meses** até beta abrir com qualidade impecável

Comparando:

- Plano "MVP" (anterior): 4-5 meses até beta, qualidade adequada pra validar mercado
- Plano "impecável" (este): 8-12 meses até beta, qualidade pronta pra DD enterprise

**Trade-off explícito:** este plano atrasa beta em 4-7 meses pra ganhar nível de qualidade que aguenta DD sem desconto técnico.

Você confirmou que quer impecável "não negociável". Plano reflete isso.

---

## Próximo passo

Fases 5-9, 20-33 concluídas. Design system selado + motion foundations + personalização visual completa + infra (Husky/commitlint + Google OAuth + README) + auth cliente + engenharia de prompts completa (schema 3 tabelas + migração 4 Edge Functions + dashboard admin `/admin/prompts` com editor, histórico, logs, stats).

**PLAYBOOK-MVP (Bloco 1 — Captação):** Fases 0-10 concluídas (2026-05-01). Shape/density tokens cascateando em 171 arquivos (357 edits). globals.css (overscroll, tap-highlight, scroll-smooth). Novos componentes: `<Breadcrumb>`, `<OptimizedImage>`, `<Textarea showCount>`, `useUnsavedChanges`, `inputMode` auto-numeric. EmptyState consolidado. Apenas 10 `rounded-*` hardcoded intencionais restam no codebase inteiro.

**Fase 4 (2026-04-30):** 130 strings PT migradas para getTranslations(). Pricing centralizado R$27/R$67 (D97). Brand tagline alinhado. Timing constants e MODALITY_PROFESSIONAL_TITLES consolidados.

**Fase 5 (2026-05-01):** Infra global — Sentry source maps (withSentryConfig), Vercel Analytics + Speed Insights, rate limiting conectado em todos os endpoints (auth, diagnostic, intake), RLS isolation testado (PT A ≠ PT B), PWA manifest, DSR process documentado, ToS/Privacy pendente jurídico.

**Fase 6 (2026-05-01):** Core features — 6 modalidades ativas, notificação email on new lead, SEO dinâmico (generateMetadata + OG), proOnly removido do SiteHub (D109), CustomizationEditor bloqueado (D110), DS cascade em páginas públicas (data-shape/density/surface), trocar email/senha in-app (/settings/account).

**Fase 7 (2026-05-01):** DS compliance — 74 hex inline em creatives/carousel migrados para tokens CSS, 5 hex em diagnostic-activation migrados, 5 tipografia arbitrária fora de creatives migrados. Pricing page card fallback mobile.

**Fase 8 (2026-05-01):** UX patterns por página — DeleteConfirmation em 5 componentes destrutivos, 3 loading skeletons (/site, /subscription, /template), generateMetadata dinâmico em leads/[id] e clients/[id], Breadcrumbs em detail pages, useUnsavedChanges em ProfileForm/DesignForm/ContactForm, useOptimistic no LeadStatusChanger, toast no LeadFollowUpEditor, showCount em 3 textareas, smooth scroll no PremiumNav, next/image nos avatars, dashboard bottom padding.

**Fase 9 (2026-05-01):** Mobile app-like redesign — SiteHub drawers, dashboard touchable, design preview drawer, profile collapsible, client touch targets, checkout reorder.

**Fase 10 (2026-05-01):** Centralizar hardcoded data — AuditForm 9 checkpoints → i18n (title/message/echo com modality names + ticket ranges), plan features duplicação eliminada (plans.ts → plan-features.ts, DB tem dados em system_plan_features), TemplateSection MODALITY_TEMPLATES removido → fetch do DB via listTemplateLabelsByModality(), ClientStatusSection labels restantes → i18n, ClosingSection MOD_AUDIENCE → i18n. Adicionadas ~30 chaves i18n (checkpointModality, ticketRange, modAudience, planFeatures).

**Fase 11 (2026-05-01):** Craft pass visual — 100 rotas auditadas (42 → 100 com sub-rotas). 18 issues corrigidos: 9 generateMetadata adicionados, 2 error.tsx boundaries (client/influencer), 3 loading.tsx skeletons (client/influencer/onboarding), 4 pages data-shape/density/surface completados, 1 page resolveDesignAttrs full. Deferidos pra Phase F: hardcoded PT-BR strings; admin mobile (desktop by design).

Próxima: **Fase 12** do PLAYBOOK-MVP (copy rewrite + smoke test E2E) — **requer fundador presente**. Pendências externas: deploy Edge Function `submit-form`, EFI Plan IDs, smoke test EFI, ToS/Privacy (jurídico).

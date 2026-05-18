# ⚠️ ARQUIVADO — Substituído em 2026-05-14

> **Este plano foi substituído por [`docs/planos/PLANO-UNICO.md`](../planos/PLANO-UNICO.md).**
>
> Bloco 1 (MVP Captação onboarding.bio) foi descontinuado com o pivot pro desafit.app. Blocos 2-5 (Programas em Grupo/Individual/1:1/Membership) foram absorvidos pelo roadmap de produto do desafit (Sessões F-J do PLANO-UNICO). Bloco T (Transversal) roda em paralelo às sessões futuras.
>
> Não usar este plano como referência ativa.

---

# Plano de Lançamento — onboarding.bio

> **Master plan linear.** Organizado por blocos de produto na ordem de implementação (D98).
> Cada fase é unidade atômica com **loop interno fechado**: auditoria → plano de execução → execução → conferência → fase seguinte (ou nova auditoria se algo falhou).
> **Nada simplificado, nada mascarado, tudo 100% resolvido antes de avançar.**
> **Última atualização:** 2026-05-01.
> **Referências canônicas obrigatórias:**
>
> - `docs/plano-lancamento/PADRAO-IMPECAVEL.md` — padrões técnicos
> - `docs/plano-lancamento/MVP-CAPTACAO-CHECKLIST.md` — checklist operacional do MVP
> - `docs/core/DESIGN-SYSTEM-FOUNDATION.md` — visual/UX
> - `docs/core/decisions.md` — decisões D1-D112
> - `docs/core/positioning.md` — copy/marca

---

## §1 · Como ler este plano

### 1.1 Estrutura

O plano é organizado em **6 blocos** que seguem a ordem de produtos (D98):

| Bloco | Produto                                       | Estado                    |
| ----- | --------------------------------------------- | ------------------------- |
| 0     | Fundação (infra, DS, auth, IA)                | ✅ Concluído (Fases 1-33) |
| 1     | **MVP Captação**                              | 🔵 Em andamento           |
| 2     | Programa em Grupo (antigo "desafios")         | ⏳ Próximo                |
| 3     | Programa Individual                           | ⏳                        |
| 4     | Acompanhamento Individual 1:1                 | ⏳                        |
| 5     | Membership / Comunidade Nativa                | ⏳ Último                 |
| T     | Transversal (perf, segurança, testes, polish) | ⏳ Paralelo               |

### 1.2 Loop interno de cada fase

Toda fase segue o mesmo loop:

1. **Auditoria** → gera `docs/auditorias/{data}-{slug}/`
2. **Plano de execução** → gera waves paralelizáveis
3. **Execução** → waves na ordem, commits dedicados
4. **Conferência** → comandos de verificação, resultado esperado
5. **Decisão:** ✅ tudo passa → avança. ❌ algo falha → nova auditoria, repete.

### 1.3 Anti-simplificação (implícito em toda fase)

- Lint zero erros, zero warnings ao final
- Build zero erros, testes 100% verdes
- Critério mensurável, não "parece pronto"
- Exception precisa justificativa técnica nominada
- "Resolvo depois" não fecha fase

### 1.4 Convenção de estado

- ✅ Concluída
- 🔵 Próxima (em execução ou próxima a executar)
- ⏳ Futura
- ⚠️ Auditoria pendente (precisa decisão do fundador)
- ~~riscado~~ Eliminada (com referência à decisão)

---

## §2 · Estado atual real (snapshot 2026-04-30)

| Frente                      | Estado                                                                                                                                                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fases 1-33 (fundação)       | ✅ todas concluídas                                                                                                                                                                                                                                      |
| Build (tsc + vitest + lint) | ✅ 0 erros, 401/401 testes, 0 erros lint                                                                                                                                                                                                                 |
| Schema banco                | 53 tabelas, 136 RLS policies                                                                                                                                                                                                                             |
| Templates v1                | 33 ativos (6 modalidades)                                                                                                                                                                                                                                |
| Edge Functions              | 11 ACTIVE (deployed)                                                                                                                                                                                                                                     |
| Migrations                  | Sincronizadas (baseline + 2 adicionais)                                                                                                                                                                                                                  |
| Design System               | ✅ Selado (D83). 6 estilos curados, OKLCH, APCA. Shape/density tokens cascateando em 171 arquivos (Fases 1-3 playbook concluídas 2026-04-30)                                                                                                             |
| Engenharia de prompts       | ✅ Zero hardcoded. 4 prompts no banco + admin dashboard                                                                                                                                                                                                  |
| Auth client                 | ✅ Role `client` + `/aluno/` + invitation tokens                                                                                                                                                                                                         |
| WhatsApp Cloud API          | ✅ Parcial — integrado (`lib/wa/client.ts` + Edge Functions). Falta: OBA (selo verde)                                                                                                                                                                    |
| EFI Bank                    | ✅ Integrado (credit card + PIX Automático). Falta: plan IDs reais em produção                                                                                                                                                                           |
| MVP Captação                | 🔵 Fases 0-11 concluídas (2026-05-01). Craft pass: 100 rotas auditadas, 18 issues corrigidos. Próxima: **Fase 12** (copy + smoke test — requer fundador presente). Pendências externas: deploy Edge Function `submit-form`, EFI Plan IDs, smoke test EFI |

### Decisões vigentes

| Área                   | Decisão                                                     | Ref  |
| ---------------------- | ----------------------------------------------------------- | ---- |
| Pricing beta           | R$27/mês vitalício, 30 vagas (5 por modalidade × 6)         | D97  |
| Pricing pós-beta       | R$67/mês, plano único                                       | D97  |
| Ordem de produtos      | Captação → Grupo → Individual → 1:1 → Membership            | D98  |
| Modalidades MVP        | musculacao, corrida, ciclismo, natacao, crossfit, triathlon | D103 |
| Plano MVP              | Único — sem Core/Pro. Acesso total                          | D108 |
| SiteHub                | Liberado pra todos                                          | D109 |
| CustomizationEditor    | Bloqueado no MVP                                            | D110 |
| Landing de venda betas | `/diagnostico/r/[token]/comecar` (ActivationPage)           | D111 |
| Validação clínica      | Eliminada — PT é responsável                                | D100 |
| WhatsApp grupo         | Automático via Cloud API quando OBA disponível              | D101 |
| Pagar.me               | 2,49/compra + 8,99% — pós-MVP                               | D102 |
| Billing aluno          | Plataforma intermedia: 2,49/mês + 7,99% — com Produto 4     | D103 |
| Chat 1:1               | Supabase Realtime — com Produto 4                           | D104 |
| Custom subdomain       | Removido do escopo                                          | D106 |
| CNAE                   | Posterga pra antes do Pagar.me                              | D107 |

---

## §3 · Sequência de fases por bloco

### Bloco 0 — Fundação ✅

Todas as 33 fases concluídas. Detalhes em `fases-25-82.md` e arquivos individuais.

| #     | Fase                                                                      | Estado |
| ----- | ------------------------------------------------------------------------- | ------ |
| 1     | Auditoria fundacional do codebase                                         | ✅     |
| 2     | Sweep de nomenclatura EN                                                  | ✅     |
| 3     | Lint cleanup any + erros bloqueantes                                      | ✅     |
| 4     | Reconciliação de migrations + limpeza DB                                  | ✅     |
| 5     | Hardening separação Lógica × UI × Dados × IO                              | ✅     |
| 6     | Tipagem estrita end-to-end                                                | ✅     |
| 7     | Tratamento de erro tipado em camadas                                      | ✅     |
| 8     | Lint i18n completo + migração de strings                                  | ✅     |
| 9     | Lint a11y completo + auditoria autoFocus                                  | ✅     |
| 10-19 | Design System (tokens, tipografia, shape, codemod, componentes, catálogo) | ✅     |
| 20    | DS: migração de 309 headings                                              | ✅     |
| 21    | DS: migração de 127 inline colors                                         | ✅     |
| 22    | DS: revisão dos 22 buttons                                                | ✅     |
| 23    | DS: governança final (regras como error)                                  | ✅     |
| 24    | Conferência final do design system (D83: DS selado)                       | ✅     |
| 25    | Motion foundations + integração nos componentes                           | ✅     |
| 26    | Personalização visual: schema + style engine                              | ✅     |
| 27    | Personalização visual: tela de Aparência                                  | ✅     |
| 28    | Infra: branch protection + Husky + commitlint                             | ✅     |
| 29    | Infra: Google OAuth + README profissional                                 | ✅     |
| 30    | Auth do `client` + rotas `/aluno/`                                        | ✅     |
| 31    | Engenharia de prompts: schema + tabelas + logging                         | ✅     |
| 32    | Engenharia de prompts: migração dos prompts hardcoded                     | ✅     |
| 33    | Engenharia de prompts: dashboard admin                                    | ✅     |

---

### Bloco 1 — MVP Captação 🔵

**Objetivo:** fechar os 20 itens bloqueantes e abrir as 30 vagas beta.
**Checklist operacional:** `docs/plano-lancamento/MVP-CAPTACAO-CHECKLIST.md`
**Estimativa:** 35-45h de trabalho focado (2-3 sprints)

| #      | Fase                                                                                                                                      | Camadas | Estado        | Tam     |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------- | ------- |
| MVP-1  | Ativar 6 modalidades em `ACTIVE_MODALITIES` + QA por modalidade                                                                           | 1       | ✅ 2026-05-01 | S       |
| MVP-2  | Notificação WA/email on new lead (conectar submit-form → send-whatsapp + send-email)                                                      | 2       | ✅ 2026-05-01 | M       |
| MVP-3  | SEO dinâmico: `generateMetadata` + OG image em `/[slug]` e `/[slug]/site`                                                                 | 3       | ✅ 2026-05-01 | S       |
| MVP-4  | Remover `proOnly` do SiteHub (D109) + bloquear CustomizationEditor (D110)                                                                 | 1, 3    | ✅ 2026-05-01 | S       |
| MVP-5  | Configurar EFI Plan IDs reais + smoke test pagamento                                                                                      | 2       | ⏸️ EXTERNO    | S       |
| MVP-6  | Revisar pricing na ActivationPage + onboarding step (R$27)                                                                                | 3       | ✅ 2026-05-01 | S       |
| MVP-7  | Mobile redesign: SiteHub drawers, dashboard touchable, design preview drawer, profile collapsible, client touch targets, checkout reorder | 3       | ✅ 2026-05-01 | M       |
| MVP-8  | Rate limit em login/signup/form-submit                                                                                                    | 6       | 🔵            | M       |
| MVP-9  | ToS + Privacy Policy (mínimo legal)                                                                                                       | —       | ⚠️            | Externo |
| MVP-10 | RLS isolation test (2 PTs reais) + Sentry source maps + Vercel Analytics                                                                  | 5, 10   | 🔵            | S       |
| MVP-11 | Smoke test E2E completo (prospect + PT, 6 modalidades, mobile)                                                                            | 7       | 🔵            | M       |

**Ao concluir Bloco 1:** abrir 30 vagas beta, onboard primeiros PTs, hotfix loop.

---

### Bloco 2 — Programa em Grupo ⏳

**Produto:** programas sazonais tipo "21 Dias Mais Leve". Cohort sincronizado, comunidade via WhatsApp do PT.
**Depende de:** Bloco 1 concluído + feedback dos primeiros betas.
**Decisões aplicáveis:** D98 (ordem), D100 (sem validação clínica), D101 (WA grupo automático), D102 (Pagar.me split), D105 (template sem prescrição), D107 (CNAE posterga).

| #      | Fase                                                 | Camadas    | Estado        | Tam | Notas                                                                    |
| ------ | ---------------------------------------------------- | ---------- | ------------- | --- | ------------------------------------------------------------------------ |
| 34     | Templates v2: bloco universal + engine NEAT          | 1, 2       | ⏳            | M   | Infra base pra formulários v2                                            |
| 35     | Templates v2: versionamento + migração dos 33        | 5          | ⏳            | L   | `specialty_template_versions`, `pinned_version`                          |
| ~~36~~ | ~~Validação clínica dos 5 bloqueantes~~              | —          | ~~ELIMINADA~~ | —   | D100: sem validação clínica                                              |
| 37     | Schema programas: tabelas + RLS                      | 5, 6       | ⏳            | M   | `programs`, `program_enrollments` + tabelas de desafio do plano original |
| 38     | pg_cron + Edge Function dispatch de mensagens        | 2, 5       | ⏳            | S   |                                                                          |
| 39     | Seed do template "21 Dias Mais Leve"                 | —          | ⏳            | S   | D105: base sem prescrição, nós escrevemos                                |
| 40     | Painel PT do programa: rotas + lista                 | 1, 2, 3    | ⏳            | M   | `/programas` com DataTable + MobileList                                  |
| 41     | Painel PT do programa: wizard de criação             | 1, 2, 3, 4 | ⏳            | M   | Multi-step, save rascunho                                                |
| 42     | Painel PT do programa: editor de componentes         | 1, 2, 3    | ⏳            | M   | Override de template no instance                                         |
| 43     | Hospedagem de vídeo: decisão e implementação         | —          | ⚠️            | M   | Mux ou Cloudflare — decidir quando chegar perto (D98)                    |
| 45     | Landing pública do programa: `/[slug]/programa/[id]` | 3, 4       | ⏳            | M   | Hero, dor, promessa, cronograma, preço, CTA                              |
| 44     | CNAE 74.90-1/04 no CNPJ                              | —          | ⏳            | XS  | Iniciar antes da Fase 46 (D107)                                          |
| 46     | Pagar.me: integração + split (2,49 + 8,99%)          | 2, 5, 6    | ⏳            | M   | D102: PT define condições (PIX, cartão, parcelamento, repasse)           |
| 47     | Enrollment: fluxo completo + email + grupo WA        | 1, 2, 4    | ⏳            | M   | D101: grupo WA automático se OBA                                         |
| 48     | Sequência de emails de pré-venda                     | 2, 3, 4    | ⏳            | M   | Aquecimento → abertura → escassez → fechamento                           |

| QG-2 | **Quality gate Bloco 2:** todas as páginas novas cumprem §4 (DS, mobile app-like, nav/UX, i18n, cascade, segurança, copy) | 3, 4, 7 | ⏳ | M | Craft pass visual + auditoria §4 em: `/programas`, `/programas/[id]`, `/programas/novo`, `/[slug]/programa/[id]`, enrollment page |

**Ao concluir Bloco 2:** PTs podem vender programas em grupo com landing, checkout Pagar.me, enrollment, e grupo WA.

---

### Bloco 3 — Programa Individual ⏳

**Produto:** programas perpétuos (mesmo conteúdo do grupo, enrollment individual).
**Depende de:** Bloco 2 concluído.
**Reaproveitamento:** ~80% da infra do Bloco 2.

| #    | Fase                                                     | Camadas | Estado | Tam | Notas                                                 |
| ---- | -------------------------------------------------------- | ------- | ------ | --- | ----------------------------------------------------- |
| PI-1 | Tipo `individual` no schema programs                     | 5       | ⏳     | S   | Enrollment perpétuo, sem datas de turma, sem grupo WA |
| PI-2 | Timeline individual (`enrollment.started_at` como dia 1) | 1, 2    | ⏳     | S   | vs cohort (`program.starts_at`)                       |
| PI-3 | Landing individual + adaptação wizard                    | 3, 4    | ⏳     | M   | Mesma estrutura, sem "turma"                          |
| PI-4 | Teste + onboard PTs vendendo programa individual         | 7       | ⏳     | S   |                                                       |

| QG-3 | **Quality gate Bloco 3:** páginas novas/adaptadas cumprem §4 | 3, 4, 7 | ⏳ | S | Landing individual, wizard adaptado |

**Ao concluir Bloco 3:** PTs podem vender programas individuais perpétuos.

---

### Bloco 4 — Acompanhamento Individual 1:1 ⏳

**Produto:** acompanhamento recorrente, chat 1:1, prescrição de treino.
**Depende de:** Bloco 2 (Pagar.me já integrado).
**Decisões:** D103 (billing 2,49/mês + 7,99%), D104 (chat Supabase Realtime), D112 (clients desbloqueia aqui).

| #    | Fase                                                   | Camadas    | Estado | Tam | Notas                                   |
| ---- | ------------------------------------------------------ | ---------- | ------ | --- | --------------------------------------- |
| 49   | Onboarding pós-pagamento: intake + foto inicial        | 1, 2, 3, 4 | ⏳     | M   | Bloco K + Bloco V                       |
| 50   | PWA cliente: shell + abas + manifest                   | 1, 3, 8    | ⏳     | M   | `/aluno/` (D89), brand fixo (D87)       |
| 51   | PWA cliente: check-in periódico + foto evolução        | 2, 3, 4    | ⏳     | S   |                                         |
| 52   | PWA cliente: notificações push + offline               | 2, 8       | ⏳     | S   | Service worker, Web Push API            |
| AC-1 | Desbloquear `/clients` (remover proOnly)               | 1          | ⏳     | XS  | D112                                    |
| AC-2 | Chat 1:1 via Supabase Realtime                         | 1, 2, 3    | ⏳     | L   | D104: PT decide se usa chat ou WhatsApp |
| AC-3 | Billing recorrente aluno→PT via Pagar.me               | 2, 5       | ⏳     | M   | D103: 2,49/mês + 7,99%                  |
| AC-4 | Polish prescrição de treino (exercise library, vídeos) | 1, 3       | ⏳     | M   | WorkoutEditor já existe, polish         |

| QG-4 | **Quality gate Bloco 4:** todas as páginas cumprem §4 — incluindo páginas existentes que foram desbloqueadas | 3, 4, 7 | ⏳ | L | `/clients`, `/clients/[id]` (6 tabs), `/aluno/dashboard`, `/aluno/ativar`, chat, WorkoutEditor, PlanSection, AssessmentList, PaymentHistory, TransformationEditor — auditoria §4 completa + craft pass mobile |

**Ao concluir Bloco 4:** PTs podem acompanhar alunos 1:1 com chat, treinos, check-ins, e cobrança recorrente.

---

### Bloco 5 — Membership / Comunidade Nativa ⏳

**Produto:** comunidade nativa substituindo WhatsApp como canal dos programas em grupo.
**Depende de:** Bloco 4. Último da esteira (D98).
**Timing:** só quando 3+ PTs pedirem e WhatsApp não escalar.

| #    | Fase                                                 | Camadas | Estado | Tam | Notas                                           |
| ---- | ---------------------------------------------------- | ------- | ------ | --- | ----------------------------------------------- |
| 53   | WhatsApp Cloud API: OBA + templates aprovados        | 2, 6    | ⏳     | M   | Integração base ✅ feita. Falta: OBA, templates |
| 54   | WhatsApp: mensagens diárias programadas + dispatcher | 2       | ⏳     | M   | 7h/11h/14h/17h/22h                              |
| 55   | WhatsApp: sentiment analysis + detecção de risco     | 2       | ⏳     | M   | Claude Haiku, 5 níveis                          |
| 56   | Cases automáticos: geração + aprovação + download    | 2, 3, 4 | ⏳     | M   | Marco (5%+ peso, NPS 9+) → card auto            |
| 57   | Analytics agregados por programa                     | 1, 2, 3 | ⏳     | M   | Adesão, NPS, cohort retention                   |
| 58   | Dashboard PT: risk flags + readiness + LTV           | 1, 2, 3 | ⏳     | M   |                                                 |
| 59   | Pesquisa de saída + pitch de continuidade            | 2, 4    | ⏳     | S   | Dia 19-21, 3 caminhos                           |
| MB-1 | Comunidade nativa (feed, threads, moderação)         | 1, 2, 3 | ⏳     | XL  | Substitui grupo WhatsApp                        |

| QG-5 | **Quality gate Bloco 5:** todas as páginas de comunidade cumprem §4 | 3, 4, 7 | ⏳ | M | Feed, threads, moderação, analytics — auditoria §4 + craft pass |

**Ao concluir Bloco 5:** comunidade nativa com feed, threads, sentiment analysis, e cases automáticos.

---

### Bloco T — Transversal ⏳

Fases que podem rodar em paralelo com qualquer bloco, conforme dependências.

#### T.1 — Polish e UX

| #   | Fase                                               | Camadas | Estado | Tam | Depende de             |
| --- | -------------------------------------------------- | ------- | ------ | --- | ---------------------- |
| 60  | Native patterns: pull-to-refresh + swipe + haptics | 3       | ⏳     | M   | 25, 50                 |
| 61  | Native patterns: page transitions + install prompt | 3       | ⏳     | S   | 25                     |
| 62  | Craft pass: 15 telas críticas                      | 3, 4    | ⏳     | L   | 60, 61, todas features |

#### T.2 — Performance e Observabilidade

| #   | Fase                                                  | Camadas | Estado | Tam |
| --- | ----------------------------------------------------- | ------- | ------ | --- |
| 63  | Performance budget: bundle + LCP + optimistic         | 8, 11   | ⏳     | M   |
| 68  | Observabilidade: logging estruturado                  | 10      | ⏳     | M   |
| 69  | Observabilidade: métricas de negócio + Web Vitals RUM | 10      | ⏳     | S   |
| 70  | Observabilidade: alertas calibrados + runbook         | 10, 12  | ⏳     | S   |

#### T.3 — Segurança

| #   | Fase                                           | Camadas  | Estado | Tam |
| --- | ---------------------------------------------- | -------- | ------ | --- |
| 64  | Hardening: rate limit + CSP + secret scan      | 6, 11    | ⏳     | M   |
| 65  | Hardening: SAST + dependency scan + license    | 6, 11    | ⏳     | S   |
| 66  | Hardening banco: backup verificado + DR plan   | 5, 6, 12 | ⏳     | S   |
| 67  | Hardening LGPD: DSR + retenção + processadores | 6, 12    | ⏳     | M   |

#### T.4 — Testes

| #   | Fase                                | Camadas | Estado | Tam |
| --- | ----------------------------------- | ------- | ------ | --- |
| 71  | Unit lib/domain (≥80%)              | 7       | ⏳     | M   |
| 72  | Integration lib/data                | 7       | ⏳     | M   |
| 73  | RPC smoke + RLS isolation           | 5, 7    | ⏳     | M   |
| 74  | E2E Playwright golden paths         | 7       | ⏳     | M   |
| 75  | a11y axe-core em CI                 | 7, 9    | ⏳     | S   |
| 76  | Audit a11y manual: NVDA + VoiceOver | 9       | ⏳     | M   |

#### T.5 — Externos e Legal

| #   | Fase                                               | Camadas | Estado      | Tam     |
| --- | -------------------------------------------------- | ------- | ----------- | ------- |
| 77  | Pentest externo                                    | 6       | 📦 Pós-beta | M       |
| 78  | Audit externo a11y (WCAG 2.2 AA)                   | 9       | 📦 Pós-beta | S       |
| 79  | Audit externo performance                          | 8       | 📦 Pós-beta | S       |
| 80  | Audit jurídico: ToS + Privacy + DPA + LGPD         | —       | ⚠️          | M       |
| 81  | Documentação operacional: runbook + on-call        | 12      | ⏳          | S       |
| 82  | Beta fechado: 30 vagas, R$27/mês, 5 por modalidade | —       | ⚠️          | ongoing |

---

## §4 · Regras de qualidade por página (Blocos 2-5)

> Extraídas do MVP Captação (Bloco 1) como padrão obrigatório pra toda página nova.
> Toda página que entra no app — em qualquer bloco — deve cumprir TODOS estes critérios antes de ser considerada pronta.

### 4.1 Componentes e Design System

- [ ] Zero `<h1>`-`<h6>` raw → usar `<Heading>`
- [ ] Zero `<button>` raw → usar `<Button>`, `<IconButton>`, ou `<SelectionCard>`
- [ ] Zero `<table>` raw → usar `<DataTable>` ou `table.tsx` do DS com tokens
- [ ] Zero `<img>` raw → usar `<OptimizedImage>` (wrapper `next/image` com `priority`/`sizes`)
- [x] Zero hex inline (`bg-[#xxx]`, `text-[#xxx]`) → usar tokens CSS (Phase 7, 2026-05-01)
- [x] Zero `text-[Xpx]` arbitrário → usar escalas DS (`text-micro` a `text-display`) (Phase 7, 2026-05-01)
- [ ] Zero `rounded-[Xpx]` arbitrário → usar `var(--shape-*)` tokens
- [ ] Empty states usam `<EmptyState>` do DS (3 variantes: initial, filtered, error)
- [ ] Modals/dialogs usam `<Dialog>`, `<Sheet>`, `<FormModal>`, ou `<ResponsiveDrawer>`
- [ ] Ações destrutivas usam `<DeleteConfirmation>` (AlertDialog com confirmação)

### 4.2 Mobile app-like (não desktop espremido)

- [ ] Layout mobile distinto do desktop (`md:hidden` / `hidden md:block`)
- [ ] Listas: cards tocáveis no mobile, tabela no desktop
- [ ] Formulários complexos: abrem em sheet/drawer no mobile, inline no desktop
- [ ] Tabs com muitas opções: lista tocável no mobile → sheet por item
- [ ] Touch targets mínimo 44px (`min-h-[44px]` ou `.touch-target`)
- [ ] `inputMode` correto em inputs numéricos
- [ ] `pb-[var(--bottom-nav-height)] md:pb-0` em toda página do shell
- [ ] Safe-area insets (`safe-pb`, `safe-pt`) em sticky elements

### 4.3 Navegação e UX patterns

- [ ] `<Breadcrumb>` em detail pages (Dashboard → Seção → Nome)
- [ ] `<MobileBackButton>` no topo em mobile
- [ ] `loading.tsx` com skeleton tipado pra toda rota com data fetching
- [ ] `error.tsx` com retry em toda rota
- [ ] `generateMetadata` com título dinâmico em toda rota
- [ ] Toast success/error em toda server action
- [ ] `useUnsavedChanges` em todo form com dirty state
- [ ] `useOptimistic` em toda mutation de status (feedback instantâneo)
- [ ] Scroll-to-section smooth em páginas com nav de seções

### 4.4 i18n e dados

- [ ] Zero string PT hardcoded em JSX → usar `t()` de `messages/pt-BR.json`
- [ ] Zero string PT hardcoded em server actions → usar seção de erros em i18n
- [ ] Zero dado hardcoded que deveria estar no banco (labels, features, pricing)
- [ ] Constants centralizadas em `lib/constants/` (não duplicar)
- [ ] Pricing sempre via `lib/constants/prices.ts` (nunca hardcoded)

### 4.5 Design token cascade (tema do PT)

- [ ] Páginas públicas setam: `data-palette`, `data-typography`, `data-shape`, `data-density`, `data-surface="public"`
- [ ] Componentes shadcn usam `var(--shape-button)` (não `rounded-md`)
- [ ] Componentes shadcn usam `var(--density-pad-*)` (não `px-4 py-2`)
- [x] Cores via `bg-primary`, `text-muted-foreground` etc (não hex) (Phase 7, 2026-05-01)

### 4.6 Segurança e compliance

- [ ] RLS policy em toda tabela nova (mesma migration)
- [ ] Rate limit em endpoints públicos
- [ ] `consent_logs` em toda coleta de dados pessoais
- [ ] Server actions retornam `{ ok, data } | { ok, error }` (nunca throw)

### 4.7 Copy e posicionamento

- [ ] Copy só menciona features que existem em produção (A17)
- [ ] Zero "máquina de vendas", "segredos", "gatilhos mentais", emojis em UI (D6)
- [ ] Tom Vercel/Linear — direto, elegante, técnico
- [ ] Pricing sempre atualizado com `lib/constants/prices.ts`

---

## §5 · Detalhamento das fases (arquivo externo)

> Fases 1-33 (Bloco 0): detalhamento completo nos arquivos individuais `docs/plano-lancamento/fase-NN.md` e em `fases-25-82.md`.
>
> Bloco 1 (MVP): detalhamento operacional em `MVP-CAPTACAO-CHECKLIST.md` com estado de cada item, mapa de 42 rotas, e smoke test E2E.
>
> Blocos 2-5: detalhamento em `fases-25-82.md`. Cada fase será expandida pra arquivo individual quando virar 🔵.

---

## §6 · Fluxo de trabalho do agente

Toda vez que o agente for executar:

1. **Lê este plano** e identifica o bloco atual e a próxima fase 🔵.
2. **Se é Bloco 1 (MVP):** lê `MVP-CAPTACAO-CHECKLIST.md` e executa o próximo item bloqueante.
3. **Se é Bloco 2+:** lê `fases-25-82.md`, expande a fase pra arquivo individual, executa loop interno.
4. **Decisão automática:** ✅ → atualiza plano, avança. ❌ → nova auditoria, repete.

**Nunca pula fase. Nunca avança com critério não cumprido.**

---

## §7 · Auditorias pendentes (decisão do fundador)

| #     | Fase                 | O que precisa ser decidido                                            |
| ----- | -------------------- | --------------------------------------------------------------------- |
| 43    | Hospedagem de vídeo  | Mux ou Cloudflare Stream. Decidir quando chegar perto.                |
| 80    | Audit jurídico       | Advogado revisa ToS, Privacy, DPA, processos LGPD. Bloqueia cobrança. |
| 82    | Beta fechado         | Critérios de saída (NPS, churn, MRR mínimo).                          |
| MVP-9 | ToS + Privacy Policy | Mínimo legal pra cobrar R$27/mês. Redigir ou contratar jurídico.      |

**Decisões já tomadas (removidas desta lista):**

- ~~Fase 36 (validação clínica)~~ → Eliminada (D100)
- ~~Fase 39 (conteúdo "21 Dias")~~ → Decidido: nós escrevemos, sem prescrição (D105)
- ~~Fase 44 (CNAE)~~ → Posterga pra antes do Pagar.me (D107)

---

## §8 · Decisões abertas (parking lot)

| ID         | Decisão                                         | Quando                   | Status                                                          |
| ---------- | ----------------------------------------------- | ------------------------ | --------------------------------------------------------------- |
| ~~OPEN-1~~ | ~~Formulário-editor na Fase 35 ou pós-launch?~~ | —                        | ✅ Bloqueado no MVP (D110), reabilitar quando padrões emergirem |
| ~~OPEN-2~~ | ~~Storybook ou Ladle?~~                         | —                        | ✅ Ladle                                                        |
| OPEN-3     | Backend de jobs: pg_cron+Edge ou escalar?       | Quando volume justificar | aberta                                                          |
| ~~OPEN-4~~ | ~~Cliente paga em 1× ou parcelado?~~            | —                        | ✅ PT decide condições (D102)                                   |
| ~~OPEN-5~~ | ~~Beta cobra antes do produto pronto?~~         | —                        | ✅ Sim, R$27/mês MVP captação (D97)                             |
| OPEN-7     | Mind Elixir vs simple-mind-map                  | Pós-launch               | aberta                                                          |
| ~~OPEN-8~~ | ~~Personalização visual no PWA cliente?~~       | —                        | ✅ Brand fixo (D87)                                             |

---

## §9 · Pós-launch (parking lot)

Features que ficam paradas até demanda real ou tração validar:

| Item                                         | Quando                                       |
| -------------------------------------------- | -------------------------------------------- |
| Vibe coding builder (programas via IA)       | Após 1 template ponta-a-ponta validado (D38) |
| Hospedagem de vídeo cobrada por uso          | Pós-tração                                   |
| Webinar/transmissão integrada                | Pós-tração                                   |
| Programa de afiliados                        | Pós-tração                                   |
| Treino IA self-service                       | Pós-tração (D56: commodity)                  |
| Agenda interna                               | Pós-tração (D57)                             |
| App nativo                                   | Após PWA validar (D58)                       |
| Marketplace de templates entre profissionais | Visão de longo prazo                         |
| Integração Strava/Garmin                     | Pesquisa em andamento                        |
| Expansão pra nutricionista esportivo         | Após 50 betas validados                      |
| Pentest externo                              | Quando tiver tração e budget                 |
| Audit externo a11y (WCAG 2.2 AA)             | Quando tiver tração e budget                 |

---

## §10 · Documentos referenciados

- `docs/plano-lancamento/MVP-CAPTACAO-CHECKLIST.md` — checklist operacional do MVP (42 rotas, 20 bloqueantes)
- `docs/plano-lancamento/PADRAO-IMPECAVEL.md` — padrões técnicos (12 camadas)
- `docs/plano-lancamento/fases-25-82.md` — detalhamento denso das fases futuras
- `docs/core/DESIGN-SYSTEM-FOUNDATION.md` — visual/UX
- `docs/core/decisions.md` — decisões D1-D112
- `docs/core/positioning.md` — copy/marca
- `docs/core/architecture.md` — arquitetura técnica
- `docs/core/schema.md` — schema do banco
- `docs/produto/templates/MASTER-SPEC.md` — especificação dos templates
- `docs/produto/desafios/contexto.md` — escopo dos programas/desafios
- `docs/auditorias/{data}-{slug}/` — uma pasta por auditoria

---

## §11 · Histórico

- 2026-04-28 — Reescrita completa após auditoria + reorganização de docs
- 2026-04-29 — Reescrita linear 1-82, sem subfases. PADRAO-IMPECAVEL criado
- 2026-04-29 — Simplificação: removido over-engineering enterprise (30 itens)
- 2026-04-29 — Fases 5-9 concluídas (separação, tipagem, erros, i18n, a11y)
- 2026-04-29 — Fases 25-27 concluídas (motion, design personalization)
- 2026-04-29 — Fases 28-29 concluídas (Husky, Google OAuth, README)
- 2026-04-30 — Fases 30-33 concluídas (auth client, prompt engineering)
- 2026-04-30 — **Reorganização por blocos de produto (D98).** Ordem: Captação → Grupo → Individual → 1:1 → Membership. Fase 36 eliminada (D100). Pricing atualizado R$27/30 vagas (D97). 16 novas decisões D97-D112. MVP Captação extraído como Bloco 1 com checklist operacional dedicado.
- 2026-05-01 — Fases 6-9 do Playbook MVP concluídas (core features, DS tokens, UX patterns, mobile redesign). Fase 8: DeleteConfirmation, loading skeletons, metadata dinâmica, breadcrumbs, useUnsavedChanges, useOptimistic, toast feedback, showCount, smooth scroll, next/image avatars, dashboard padding.

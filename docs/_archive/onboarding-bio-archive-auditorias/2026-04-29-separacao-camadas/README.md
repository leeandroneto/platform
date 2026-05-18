# Auditoria: Separação Lógica × UI × Dados × IO

**Data:** 2026-04-29
**Fase:** 5
**Estado:** Em execução

## Resultado da auditoria

| #   | Categoria                          | Violações                              | Prioridade |
| --- | ---------------------------------- | -------------------------------------- | ---------- |
| 1   | Cliente importa lib/supabase/admin | **0**                                  | —          |
| 2   | Cliente importa lib/data (runtime) | **25** (+ 18 type-only OK)             | Alta       |
| 3   | lib/domain com deps externas       | **0**                                  | —          |
| 4   | IO externo fora de Edge Function   | **0**                                  | —          |
| 5   | Server action > 60 linhas          | **13**                                 | Média      |
| 6   | Arquivo > 400 linhas               | **19** (excl. database.ts auto-gerado) | Baixa      |
| 7   | Utils genéricos                    | **1**                                  | Trivial    |
| 8   | Mutação multi-tabela sem RPC       | **1** (false positive)                 | Trivial    |

## Categoria 2 — detalhamento

### 18 type-only (NÃO são violações)

Importam apenas types de lib/data (removidos em compilação). Aceitos.

### 25 DIRECT_CALL (violações reais)

Client components que importam `createClient` do browser e chamam funções de `lib/data/` diretamente. Devem usar server actions.

**Clusters:**

- Landing editor: 7 arquivos (LandingEditor + 6 tabs)
- Clients CRUD: 7 arquivos (Assessment, Plan, Payment, Session, Transformation, Workout, Profile)
- Leads management: 6 arquivos (status, notes, links, follow-up, convert, manual)
- Detail panels: 2 arquivos (LeadDetailPanel, ClientDetailPanel — reads)
- Outros: 3 arquivos (NewClientForm, ManualLeadForm, LeadStatusBadge)

### 1 HOOK_WRAP (aceito)

`useSubmitIntake.ts` — chama Edge Function via fetch, não Supabase direto.

## Categoria 5 — server actions > 60 linhas

| Linhas | Arquivo                                          |
| ------ | ------------------------------------------------ |
| 462    | `app/(app)/onboarding/actions.ts`                |
| 187    | `app/(auth)/actions.ts`                          |
| 133    | `app/(app)/(shell)/settings/media/actions.ts`    |
| 123    | `app/(app)/(shell)/subscription/actions.ts`      |
| 107    | `app/(app)/(shell)/forms/actions.ts`             |
| 101    | `app/(app)/(shell)/testimonials/actions.ts`      |
| 99     | `app/(app)/(shell)/template/actions.ts`          |
| 95     | `app/(public)/lgpd/request/actions.ts`           |
| 85     | `app/(public)/diagnostic/actions.ts`             |
| 83     | `app/(influencer)/influencer/payouts/actions.ts` |
| 77     | `app/(app)/(shell)/settings/contact/actions.ts`  |
| 76     | `app/(public)/influencer/signup/actions.ts`      |
| 65     | `app/(app)/(shell)/settings/profile/actions.ts`  |

## Categoria 6 — arquivos > 400 linhas (top 10)

| Linhas | Arquivo                                                            |
| ------ | ------------------------------------------------------------------ |
| 1152   | `app/(public)/creatives/page.tsx`                                  |
| 948    | `components/funnel/tabs/RelatorioTab.tsx`                          |
| 793    | `components/report/audit/AuditAnalysis.tsx`                        |
| 684    | `app/(public)/carousel/page.tsx`                                   |
| 635    | `components/form/lead/LeadForm.tsx`                                |
| 617    | `components/form/audit/AuditForm.tsx`                              |
| 549    | `app/(public)/pricing/page.tsx`                                    |
| 514    | `components/funnel/tabs/ConfigTab.tsx`                             |
| 513    | `components/ui/CrudManager.tsx` (aceito — abstração compartilhada) |
| 480    | `app/(public)/coming-soon/page.tsx`                                |

(+ 9 arquivos entre 431-472 linhas)

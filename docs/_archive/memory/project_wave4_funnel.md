---
name: Wave 4 — Funnel Customization (COMPLETED)
description: RLS write-own for professional_modalities + professionals customization updates; deleted server actions, refactored to browser client
type: project
originSessionId: ded90a57-b4a3-49b2-bd11-2084c7cccbfd
---

# Wave 4 — Funnel Customization — COMPLETED 2026-04-20

**Commit:** c3b481b

## Scope

- **Domínio:** Funnel customization (professional_modalities + professionals)
- **Tabelas:**
  - `professional_modalities` (UPDATE customization JSONB)
  - `professionals` (UPDATE next*step*\* fields)

## Changes

### DB Layer

- Migration: `20260420030000_wave_4_funnel_policies.sql`
  - Created `professional_modalities_update_own` — UPDATE via `current_professional_id()`
  - Created `professionals_update_own` — UPDATE via `auth.uid()`

### Frontend

- **New hooks:**
  - `lib/hooks/useUpdateProfessionalModality.ts` — browser client + Supabase RLS
  - `lib/hooks/useUpdateNextStep.ts` — browser client + Supabase RLS
  - `lib/domain/types/next-step.ts` — NextStepData type + validation schema

- **Refactored:**
  - `components/funnel/CustomizationEditor.tsx` — uses hooks instead of saveCustomizationAction
  - `components/funnel/tabs/ProximoPassoTab.tsx` — callback-based save instead of saveNextStepAction

- **Deleted:**
  - `app/(app)/(shell)/funnel/[modality]/actions.ts` — server actions removed, replaced by RLS direct

## Validations

✅ Policies created (USING + WITH CHECK defined)
✅ Security boundary: professional_id isolation via current_professional_id()
✅ TSC: zero new errors in Wave 4 components
✅ Advisors: unchanged at 2 (auth_leaked_password + webhook_logs)

## Dependencies

- **Depends on:** Wave 1 (current_professional_id() helper)
- **Parallel:** Wave 2 (shared professional_modalities table, but different columns)
- **Unblocks:** None (Wave 4 was independent)

## Key Notes

- `applyCustomization()` runs on browser, no RPC needed — only UPDATE goes to DB
- `professionals` UPDATE uses `auth.uid()` because profile_id is direct auth relationship (intentional, not current_professional_id())
- ProximoPassoTab has its own save button + state, separate from CustomizationEditor save

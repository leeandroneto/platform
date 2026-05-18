---
name: Intakes RPC Token Security (VALIDATED)
description: Wave 0.6 fixed all 4 vulnerabilities — SECURITY DEFINER, search_path, public policy dropped, anon grants revoked
type: project
originSessionId: 0b45c49e-799c-49ae-bef8-77d144e71d75
---

## VALIDATED: Intakes Security Hardening

**When:** 2026-04-19 (Wave 0.6 reconciliation migration)
**Migration:** `supabase/migrations/20260419_wave_0_6_intakes_reconciliation.sql`
**Original commits (frontend):** d83dbfe, f18f48e, 62c9be4

## What was fixed

| Vulnerability                            | Fix                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Policy `intakes public read` USING(true) | DROPPED                                                             |
| Function without SECURITY DEFINER        | Recreated with SECURITY DEFINER + SET search_path = public, pg_temp |
| anon had ALL table grants                | REVOKE ALL FROM anon + authenticated                                |
| authenticated + public had EXECUTE       | REVOKE; only anon + service_role have EXECUTE now                   |

## Current state (post-fix)

- Policy: only `"intakes owner read"` (professional via auth.uid())
- Function: SECURITY DEFINER, search_path locked
- Table grants: postgres + service_role only
- Function grants: anon + postgres + service_role only
- 9/9 validation tests passed (B2-B6, C1-C3)
- Security advisors: `get_intake_by_public_token` search_path advisory RESOLVED

**Why:** This was a critical blocker — all migration waves depend on intakes security being solid.
**How to apply:** Intakes security is now baseline. Future waves can reference this as the model for RPC + RLS patterns.

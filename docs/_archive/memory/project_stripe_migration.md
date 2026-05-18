---
name: EFI Bank migration (Stripe removed)
description: Migração Stripe→EFI Bank concluída 2026-04-22. Gateway único para cartão recorrente + PIX Automático. Participante direto do Banco Central.
type: project
originSessionId: a45ca312-1346-4919-bcdf-a687425ad99d
---

Checkout migrado de Stripe para EFI Bank em 2026-04-22. Gateway único.

**Why:** Centralizar cartão de crédito + PIX Automático num só provedor. EFI é participante direto do SPI (Banco Central), tem API REST documentada, SDK Node.js, e taxas competitivas (3,49% cartão, 1,19% PIX).

**How to apply:**

- EFI secrets ficam SÓ no Supabase (Edge Functions). Next.js nunca vê.
- Edge Functions: `create-checkout` (cartão one-step + PIX recorrência), `cancel-checkout`, `efi-webhook`
- `stripe-webhook` mantido temporariamente para subscriptions legadas
- Auth helper compartilhado: `supabase/functions/_shared/efi-auth.ts` (OAuth2 + mTLS para PIX)
- Frontend: `EfiCreditCardForm` + tokenização client-side via `lib/payments/efi-client.ts`
- Ponte: `lib/data/checkout.ts` → `client.functions.invoke()`
- PIX Automático: `CheckoutPixInline` reconectado com QR + polling
- Tab Cartão/PIX em CheckoutFlow e UpgradeCheckout
- Promo codes: nosso banco, não EFI/Stripe coupons
- RPC `start_checkout` aceita `p_gateway` (default 'efi') e `p_payment_method`
- DB: gateway default='efi', campo `payment_method` em subscriptions, campos `pix_txid`/`pix_e2eid` em payment_transactions
- Zero referência a "@stripe" em código TS/TSX (packages removidos)
- Env vars: `EFI_CLIENT_ID`, `EFI_CLIENT_SECRET`, `EFI_PLAN_CORE_ID`, `EFI_PLAN_PRO_ID`, `EFI_WEBHOOK_TOKEN` (Supabase), `NEXT_PUBLIC_EFI_ACCOUNT_ID` (.env)
- PIX mTLS: `EFI_PIX_CERT_PEM`, `EFI_PIX_KEY_PEM` (PEM convertidos de p12)

---
name: Launch Status April 2026
description: Status de contas e infra para lançamento — EFI Bank PJ aguardando confirmação, WhatsApp API pendente para amanhã (2026-04-27)
type: project
originSessionId: 65377ad9-2fbe-415d-8996-748c3e5deea4
---

## Status do Lançamento (2026-04-26)

### Contas abertas ✅

- **Supabase** — conta aberta
- **Vercel** — conta aberta
- **Resend** — conta aberta
- **Sentry** — conta aberta
- **EFI Bank PJ** — conta aberta, aguardando confirmação (esperado: 2026-04-27)
- **Google Auth** — conta aberta

### Pendente

- **Z-API WhatsApp** — fundador vai criar amanhã (2026-04-27)
- **EFI Bank credenciais**: ativar API Cobranças + PIX, criar planos Core/Pro, gerar certificado PIX (p12→PEM), setar secrets no Supabase + .env.local — só após confirmação da conta PJ
- **Vercel envs produção** — setar após contas confirmadas

### Técnico (após credenciais EFI)

- Deploy Edge Functions: `supabase functions deploy create-checkout cancel-checkout efi-webhook`
- Registrar webhook URL no dashboard EFI
- Teste e2e: cartão sandbox, PIX Automático, cancel + refund CDC

### Código

- Checkout EFI 100% implementado — aguarda credenciais para teste
- tsc 0 erros, 129 testes, build pass (verificado 2026-04-22)
- 33 templates no banco (verificado 2026-04-26)
- Fases 1, 2A-2C, 3, 4A, 4B concluídas

**How to apply:** Quando o usuário perguntar sobre status de infra/contas, usar este documento. Próximo passo de código: Fase 5 (Dashboard).

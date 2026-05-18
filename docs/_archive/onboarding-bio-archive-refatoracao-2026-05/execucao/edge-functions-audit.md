# Auditoria — Edge Functions (Fase 154)

> **Data:** 2026-05-04  
> **Auditor:** Terminal B (Claude Sonnet 4.6)  
> **Escopo:** 14 edge functions em `supabase/functions/*/index.ts`  
> **Status:** ✅ Críticos resolvidos | ⚠️ Médios documentados | 📝 Baixos anotados

---

## Resumo executivo

| Categoria   | Encontrado            | Resolvido nesta fase | Documentado como débito |
| ----------- | --------------------- | -------------------- | ----------------------- |
| **CRÍTICO** | 7 issues em 7 funções | 7 ✅                 | —                       |
| **MÉDIO**   | 3 issues              | —                    | 3 ⚠️                    |
| **BAIXO**   | 4 issues              | —                    | 4 📝                    |

---

## Inventário das 14 funções

| #   | Função                  | Linhas | Tipo          | Auth entrada      | CORS | JSON try/catch |
| --- | ----------------------- | ------ | ------------- | ----------------- | ---- | -------------- |
| 1   | `cancel-checkout`       | 196    | auth-JWT      | ✅                | ✅   | ✅             |
| 2   | `create-checkout`       | 420    | auth-JWT      | ✅                | ✅   | ✅             |
| 3   | `drip-emails`           | 299    | cron          | ✅ (fixado)       | n/a  | ✅ (sem body)  |
| 4   | `efi-webhook`           | 510    | webhook-token | ✅ (fixado)       | n/a  | ✅             |
| 5   | `follow-up-reminders`   | 254    | cron          | ✅ (fixado)       | n/a  | ✅ (sem body)  |
| 6   | `generate-diagnostic`   | 266    | público-token | ✅ (token via DB) | ✅   | ✅             |
| 7   | `generate-report`       | 633    | público-token | ✅ (token via DB) | ✅   | ✅             |
| 8   | `generate-site-content` | 117    | auth-JWT      | ✅                | ✅   | ✅             |
| 9   | `register-pix-webhooks` | 73     | admin         | ✅ (fixado)       | n/a  | ✅             |
| 10  | `save-diagnostic-draft` | 51     | público       | ⬜ (intencional¹) | ✅   | ✅             |
| 11  | `send-email`            | 100    | serviço       | ✅ (fixado)       | ✅   | ✅             |
| 12  | `send-whatsapp`         | 237    | serviço       | ✅ (fixado)       | ✅   | ✅             |
| 13  | `submit-form`           | 286    | público       | ⬜ (intencional²) | ✅   | ✅             |
| 14  | `weekly-digest`         | 162    | cron          | ✅ (fixado)       | n/a  | ✅             |

¹ `save-diagnostic-draft`: recebe draft UUID gerado no cliente, sem auth intencional — qualquer pessoa pode salvar um draft anônimo. RLS protege acesso posterior. Risco controlado.  
² `submit-form`: ponto de entrada público do formulário de lead. Não requer auth por design (lead ainda não tem conta).

---

## CRÍTICOS — resolvidos nesta fase

### C1 · Cron functions sem incoming auth (3 funções)

**Funções:** `drip-emails`, `weekly-digest`, `follow-up-reminders`

**Problema:** Qualquer pessoa com a URL da função podia triggar envios reais de email e WhatsApp para usuários, sem nenhuma verificação. Custos reais + risco de abuso.

**Fix aplicado:** Guard `CRON_SECRET` no início de cada handler:

- Se `CRON_SECRET` env var configurada → rejeita chamadas sem `Authorization: Bearer <secret>` (401)
- Se não configurada → loga `warn [SECURITY]` e permite (backwards-compatible com pg_cron existente)

**Para ativar proteção completa:** Configurar `CRON_SECRET` em Supabase Secrets e atualizar pg_cron para passar `headers => '{"Authorization": "Bearer <CRON_SECRET>"}'`.

---

### C2 · `send-email` e `send-whatsapp` sem auth de entrada

**Problema:** Qualquer um com a URL podia enviar emails/WA usando os recursos do projeto (Resend API + Meta Cloud API), potencialmente para spam/phishing.

**Fix aplicado:** Guard service role key:

```ts
const authHeader = req.headers.get('Authorization')
if (!authHeader || authHeader !== `Bearer ${SERVICE_ROLE_KEY}`) {
  return fail('unauthorized', 401)
}
```

**Callers já em compliance:** `submit-form/index.ts` (linha 211 e 252) já passava `Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}` — nenhuma quebra de compatibilidade.

---

### C3 · `register-pix-webhooks` sem verificação da auth prometida no JSDoc

**Problema:** O JSDoc dizia "Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>" mas o código não verificava. Qualquer um podia chamar e re-registrar webhooks EFI (risco baixo mas falsa promessa de segurança).

**Fix aplicado:** Verificação explícita do service role key antes de qualquer operação.

---

### C4 · `efi-webhook` bypass silencioso quando `EFI_WEBHOOK_TOKEN` vazio

**Problema:** `if (WEBHOOK_TOKEN)` — se o env var não estivesse configurado (empty string = falsy), o check de token era completamente ignorado, aceitando qualquer POST.

**Fix aplicado:** Fail-fast explícito:

```ts
if (!WEBHOOK_TOKEN) {
  log('error', 'efi-webhook EFI_WEBHOOK_TOKEN not configured', { fn: 'efi-webhook' })
  return fail('webhook_not_configured', 500)
}
```

---

## MÉDIOS — documentados como débito

### M1 · Nenhuma função usa Zod para validação de input em runtime

**Regra violada:** `.claude/rules/edge-functions.md` — "Input validado com Zod antes de processar."

**Situação atual:** Todas as 14 funções usam TypeScript types para shape do input, mas sem validação em runtime. Um input malformado (ex: `age: "trinta"` em vez de `30`) passa silenciosamente.

**Funções mais críticas sem Zod:**

- `submit-form` — input complexo com `basics`, `goals`, `questions`, `template`
- `create-checkout` — `customer`, `billingAddress`, dados financeiros
- `generate-diagnostic` — `form_answers` como `Record<string, unknown>`

**Ação sugerida:** Abrir fase dedicada (pós-154) para adicionar Zod nos 5 handlers com inputs mais complexos. Prioridade: `submit-form` → `create-checkout` → `generate-diagnostic` → `generate-report` → `save-diagnostic-draft`.

---

### M2 · 3 funções acima de 300 linhas (limite do projeto)

| Função            | Linhas | Candidato à decomposição                                                                                                      |
| ----------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `generate-report` | 633    | Extrair: label maps → `_data/labels.ts`, build-context → `_engine/build-context.ts`, Anthropic call → `_ai/call-anthropic.ts` |
| `efi-webhook`     | 510    | Extrair: event mapping → `_handlers/`, idempotency → `_shared/idempotency.ts`                                                 |
| `create-checkout` | 420    | Extrair: `createCardSubscription` e `createPixRecurrence` → `_payment/`                                                       |

**Ação sugerida:** Fase separada pós-audit. Não é emergência — lógica está correta, apenas tamanho.

---

### M3 · Inconsistência no provedor WA entre funções

| Função                | Provedor WA              |
| --------------------- | ------------------------ |
| `follow-up-reminders` | Meta Cloud API (v22.0)   |
| `send-whatsapp`       | Meta Cloud API (v22.0)   |
| `weekly-digest`       | **Z-API** (api.z-api.io) |

**Problema:** `weekly-digest` usa Z-API enquanto as outras usam Meta Cloud API. Dois provedores WA em paralelo complica auditoria, rotação de credenciais e diagnóstico de falhas.

**Ação sugerida:** Migrar `weekly-digest` para usar `send-whatsapp` (que já usa Meta Cloud API) ou replicar o helper `sendViaMeta` da `follow-up-reminders`. Decisão de produto: se Z-API tem features específicas pra digest, documentar por quê.

---

## BAIXOS — anotados

### L1 · `register-pix-webhooks` é utilitário one-time ainda deployado

O JSDoc diz "Run once after deploying, then can be deleted." Função ainda está deployada. Risco mitigado pelo fix C3 (agora requer service role key). Sugestão: remover da próxima vez que fizer `supabase functions deploy`.

### L2 · `efi-webhook` retorna `new Response()` raw no final (linha 506)

```ts
return new Response(JSON.stringify({ received: true }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
})
```

Inconsistente com o helper `ok()` do projeto (que adiciona CORS headers automaticamente). Não é bug — webhook é server-to-server, EFI não precisa de CORS. Mas gera inconsistência de padrão. Mesmo problema em `register-pix-webhooks` linha 59.

### L3 · `submit-form` tem TODO sobre prompt hardcoded

```ts
// TODO(phase-08): submit-form/_ai/build-system-prompt.ts hardcodes the
// narrative system prompt. Migrate to ai_prompts table same way
// generate-diagnostic and generate-report do.
```

Débito #2 já documentado em `CLAUDE.md` e `AUDITORIA-2026-04-28.md`. Confirmado ativo.

### L4 · Label maps em PT hardcoded em `generate-report`

Linhas 10-100: `MODALITY`, `WORKMODEL`, `TICKET`, `LEADS`, etc. — dicionários PT hardcoded no código. Consistente com débito #10 do `CLAUDE.md` (JSONB AI-bound keys em PT — defer Phase 08). Não é novo.

---

## Env vars auditadas

| Var                                                     | Funções que usam                                                                 | Observação                            |
| ------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------- |
| `SUPABASE_URL`                                          | todas                                                                            | obrigatória                           |
| `SUPABASE_SERVICE_ROLE_KEY`                             | todas exceto `register-pix-webhooks`                                             | obrigatória                           |
| `SUPABASE_ANON_KEY`                                     | `cancel-checkout`, `create-checkout`, `generate-site-content`                    | fallback para service role se ausente |
| `RESEND_API_KEY`                                        | `drip-emails`, `send-email`                                                      | noop se ausente (dev-safe)            |
| `RESEND_FROM_EMAIL`                                     | `drip-emails`, `send-email`                                                      | default hardcoded                     |
| `META_WA_PHONE_NUMBER_ID`                               | `follow-up-reminders`, `send-whatsapp`                                           | noop se ausente                       |
| `META_WA_ACCESS_TOKEN`                                  | `follow-up-reminders`, `send-whatsapp`                                           | noop se ausente                       |
| `Z_API_INSTANCE_ID`, `Z_API_TOKEN`                      | `weekly-digest`                                                                  | noop se ausente                       |
| `EFI_PLAN_ID`, `EFI_WEBHOOK_TOKEN`, `EFI_PIX_KEY`       | `create-checkout`, `efi-webhook`, `register-pix-webhooks`                        | críticos em prod                      |
| `EFI_CLIENT_ID`, `EFI_CLIENT_SECRET`, `EFI_CERT_BASE64` | `_shared/efi-auth.ts`                                                            | críticos em prod                      |
| `ANTHROPIC_API_KEY`                                     | `generate-report`, `generate-diagnostic`, `submit-form`, `generate-site-content` | via `_shared/ai-prompt.ts`            |
| `CRON_SECRET`                                           | `drip-emails`, `weekly-digest`, `follow-up-reminders`                            | **NOVO** — configurar em prod         |

---

## Padrão \_shared validado

`supabase/functions/_shared/response.ts` — **100% correto:**

- `ok()`, `fail()`, `preflight()`, `log()` — todos com CORS headers
- Formato `{ ok: true/false, error?, detail? }` — consistente com `lib/api/response.ts` do Next.js
- Nenhuma mudança necessária

`supabase/functions/_shared/efi-auth.ts` — não auditado nesta fase (auth EFI-específica, fora do escopo do pattern sweep).

`supabase/functions/_shared/ai-prompt.ts` — não auditado nesta fase (escopo é infra de prompts, fora do escopo de segurança desta fase).

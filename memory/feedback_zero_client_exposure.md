---
name: Zero exposição client-side
description: Princípio universal cravado pelo owner — nada sensível no browser. Aplica em tudo retake.
type: feedback
---

Princípio universal cravado pelo owner: zero exposição client-side. Aplica em TUDO retake.

**Why:** segurança baseline + multi-tenant exige fronteira rígida. Vazamento cross-tenant é catastrófico.

**How to apply:**

- Service role key Supabase NUNCA no client. Só Edge Functions + Server Actions
- Sensitive data (CPF/CNPJ, dados financeiros, secrets, chaves API, tokens wearable cifrados) NUNCA chega ao browser
- Mutações = Server Actions ou API routes com `import 'server-only'` no top. Client nunca chama Supabase mutate direto
- Reads sensíveis = RSC + Server Action (não browser query direto, mesmo com RLS)
- Realtime channels = auth strict + RLS row-level + scope obrigatório por tenant
- Edge Function + AI provider keys + gateway keys (Pagar.me/Efí/Asaas) = SOMENTE Edge/Server
- `lib/data/*` lança erro server-side. Server Actions traduzem pra `Result` antes de ir ao client
- Schema introspection: anon role nunca vê tabelas internas (revoke explícito)
- JWT carrega apenas: tenant_id, role, party_id (nada além)

**Verificação:**

- Checklist `lib/data/*` tem `import 'server-only'`
- Splinter advisor `mcp__plugin_supabase_supabase__get_advisors security` zero novos warnings pós-cada migration
- Hook `enforce-server-only-data-layer.sh` ativo
- ESLint custom rule bloqueia `createClient` (anon) em paths não-públicos

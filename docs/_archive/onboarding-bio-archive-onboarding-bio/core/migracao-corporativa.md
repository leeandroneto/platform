# Migração para conta corporativa (CNPJ)

Plano de execução para migrar todo o stack do email pessoal para a conta corporativa
(CNPJ novo + email `@onboarding.bio` via Zoho Mail).

**Última atualização:** 2026-04-23

---

## Resumo executivo

| Etapa                  | Impacto                                    | Duração        | Downtime            |
| ---------------------- | ------------------------------------------ | -------------- | ------------------- |
| Supabase transfer      | Zero mudança em código                     | 5 min          | Zero                |
| Vercel transfer        | Zero mudança em código                     | 5 min          | Zero                |
| GitHub transfer        | Zero mudança em código                     | 5 min          | Zero                |
| Sentry transfer        | Muda `NEXT_PUBLIC_SENTRY_DSN`              | 10 min         | Zero                |
| Anthropic rotação      | Muda `ANTHROPIC_API_KEY` (Supabase secret) | 10 min         | < 1 min             |
| Resend rotação         | Muda `RESEND_API_KEY` (Supabase secret)    | 10 min         | Zero                |
| Google OAuth recriação | Muda Client ID/Secret em Supabase Auth     | 15 min         | Força re-consent    |
| EFI abertura           | Abrir conta PJ nova no CNPJ                | 2-3 dias úteis | N/A (ainda não usa) |

**Ponto mais crítico:** Google OAuth — fazer **agora** enquanto ainda não tem usuários em produção.

---

## Inventário do stack

Serviços externos em uso no projeto (confirmado via leitura do código):

| #   | Serviço                                | Owner atual                                     | Env vars                                                                                        | Docs oficiais                                                                                                                     |
| --- | -------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Supabase**                           | pessoal                                         | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | [Project Transfers](https://supabase.com/docs/guides/platform/project-transfer)                                                   |
| 2   | **Vercel**                             | pessoal                                         | (no dashboard)                                                                                  | [Transferring a project](https://vercel.com/docs/projects/transferring-projects)                                                  |
| 3   | **GitHub**                             | pessoal                                         | —                                                                                               | [Transferring a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository) |
| 4   | **Google OAuth**                       | pessoal (Google Cloud)                          | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` + Supabase Auth                                                  | [OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)                                                          |
| 5   | **EFI Bank**                           | ainda não aberto                                | `NEXT_PUBLIC_EFI_ACCOUNT_ID` + 7 secrets EFI\_\*                                                | `docs/plano/execucao/checklist-efi-setup.md`                                                                                      |
| 6   | **Anthropic**                          | pessoal                                         | `ANTHROPIC_API_KEY` (Supabase secret)                                                           | [Managing Workspaces](https://support.anthropic.com/en/articles/9796807-creating-and-managing-workspaces)                         |
| 7   | **Resend**                             | pessoal                                         | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`                                                           | [Managing Teams](https://resend.com/docs/dashboard/settings/team)                                                                 |
| 8   | **Sentry**                             | pessoal                                         | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`                                                   | [Transfer projects](https://sentry.zendesk.com/hc/en-us/articles/23572020203419)                                                  |
| 9   | **Upstash Redis**                      | pessoal (opcional)                              | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                            | —                                                                                                                                 |
| 10  | **Meta Cloud API (WhatsApp Business)** | provisionar Meta Business Suite + chip dedicado | `META_WA_PHONE_NUMBER_ID`, `META_WA_ACCESS_TOKEN`, opcional `META_WA_TEMPLATE_*`                | Migrado de Z-API em 2026-04-29                                                                                                    |
| —   | **Zoho Mail**                          | já corporativo                                  | —                                                                                               | [Adding Users](https://www.zoho.com/mail/help/adminconsole/adding-users.html)                                                     |

---

## Fase 0 — Preparação (semana 0, antes de tocar em qualquer conta)

### 0.1 Estrutura de emails no Zoho

Criar usuários reais:

- [ ] `leeandro@onboarding.bio` — sócio admin principal
- [ ] `tech@onboarding.bio` — dono técnico de Supabase, Vercel, Anthropic, Sentry, Google Cloud
- [ ] `financeiro@onboarding.bio` — dono de EFI, Resend, cartões, notas fiscais

Criar como **aliases** (não consomem licença):

- [ ] `contato@onboarding.bio` → alias de `leeandro@`
- [ ] `suporte@onboarding.bio` → alias de `leeandro@`
- [ ] `admin@onboarding.bio` → alias de `leeandro@`
- [ ] `no-reply@onboarding.bio` → catch-all para emails transacionais

**⚠️ SPF crítico:** se Resend vai enviar emails pelo domínio, o registro SPF precisa incluir ambos:

```
v=spf1 include:zoho.com include:resend.com ~all
```

Falha comum: só `zoho.com` → Resend começa a bouncear. Só `resend.com` → Zoho rejeita inbound.

### 0.2 Backup completo de credenciais

Antes de mexer em qualquer coisa, exportar para um password manager (Bitwarden, 1Password):

- [ ] Todas as env vars do Vercel (`vercel env pull` quando tiver CLI, ou copiar do dashboard)
- [ ] Todos os secrets de Supabase Edge Functions (Settings → Edge Functions → Secrets)
- [ ] `.env.local` atual
- [ ] API keys antigas de cada serviço (para revogar depois)

### 0.3 Método de pagamento

- [ ] Cartão para usar nas contas corporativas (pode ser pessoal no início, reembolso do sócio na contabilidade, ou cartão PJ quando a conta bancária sair)

---

## Fase 1 — Criar contas corporativas (semana 1, não toca no stack atual)

> **Nota:** esta fase só _cria_ as contas novas. Nada do stack em produção é afetado. Pode fazer em ritmo calmo.

### 1.1 GitHub Organization

- [ ] Criar Org `onboarding-bio` em [github.com/organizations/new](https://github.com/organizations/new) logado com `admin@`
- [ ] Plano Free é suficiente para começar
- [ ] Adicionar `tech@` como Owner da Org

### 1.2 Vercel Team

- [ ] Criar Team `onboarding-bio` em [vercel.com/teams/create](https://vercel.com/teams/create) logado com `tech@`
- [ ] Hobby plan começa; upgrade para Pro antes do launch (ambientes de staging + bandwidth)
- [ ] Adicionar método de pagamento válido **antes** do transfer da Fase 2

### 1.3 Supabase Organization

- [ ] Criar Org em [supabase.com/dashboard/new](https://supabase.com/dashboard/new) logado com `tech@`
- [ ] Free plan começa; upgrade para Pro antes do launch ($25/mês)

### 1.4 Google Cloud project novo

- [ ] Login em [console.cloud.google.com](https://console.cloud.google.com) com `tech@`
- [ ] Criar project `onboarding-bio-prod`
- [ ] **OAuth Consent Screen**:
  - User Type: **External**
  - App name: `onboarding.bio`
  - User support email: `suporte@onboarding.bio`
  - App logo: upload do logo
  - Application homepage: `https://onboarding.bio`
  - Application privacy policy: `https://onboarding.bio/legal/privacidade`
  - Application terms of service: `https://onboarding.bio/legal/termos`
  - Authorized domains: `onboarding.bio`
  - Developer contact: `tech@onboarding.bio`
  - Scopes: `openid`, `email`, `profile` (não exigem brand verification)
- [ ] **Credentials → OAuth 2.0 Client ID**:
  - Type: Web application
  - Name: `onboarding.bio Web`
  - Authorized JavaScript origins: `http://localhost:3000`, `https://onboarding.bio`
  - Authorized redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback` (pegar URL da Fase 2 depois)
- [ ] **Publish App** (sair do modo Testing) — scopes básicos são auto-approved

### 1.5 Anthropic Organization

- [ ] [console.anthropic.com](https://console.anthropic.com) logado com `tech@`
- [ ] Criar Organization → Workspace `onboarding-bio-prod`
- [ ] Adicionar método de pagamento
- [ ] **Não** gerar API key ainda — só na Fase 3 para evitar vazamento

### 1.6 Sentry Organization

- [ ] [sentry.io](https://sentry.io) com `tech@`
- [ ] Criar Organization `onboarding-bio`
- [ ] Plan Free começa (até 5k errors/mês)
- [ ] Confirmar região: se o Sentry atual é US, criar novo também em US (não dá para migrar entre regiões)

### 1.7 EFI Bank — abrir conta PJ

- [ ] [sejaefi.com.br](https://sejaefi.com.br) → Conta Digital PJ
- [ ] Titular: CNPJ novo; cadastrar `financeiro@onboarding.bio`
- [ ] Docs necessários: contrato social, RG/CPF do sócio, selfie
- [ ] **Não precisa certificado digital** — EFI valida por selfie + docs
- [ ] Aprovação: 1-3 dias úteis
- [ ] Após aprovado, seguir `docs/plano/execucao/checklist-efi-setup.md` para gerar credenciais e cadastrar planos

---

## Fase 2 — Transfers (zero downtime, não muda código)

> **Atenção:** cada transfer é operação de metadata. URLs, keys, env vars ficam iguais. Só a "propriedade" muda.

### 2.1 Supabase project transfer

- [ ] No projeto atual: **Settings → General → Transfer project**
- [ ] Selecionar Organization destino (criada em 1.3)
- [ ] Confirmar — feito em segundos
- [ ] Verificar: todos os secrets de Edge Functions estão lá (EFI\_\*, RESEND_API_KEY, ANTHROPIC_API_KEY, etc.)

**Gotchas:**

- Billing antigo cobra até o momento do transfer; novo cobra do transfer em diante. Fazer no início do ciclo de cobrança.
- Se o projeto está em Pro, a org destino precisa suportar Pro (ou perde features).

### 2.2 Vercel project transfer

- [ ] No projeto: **Settings → General → (fim da página) Transfer Project**
- [ ] Selecionar Team destino
- [ ] Confirmar lista de domínios (`onboarding.bio` vai junto) e env vars
- [ ] Aguardar email de confirmação

**Gotchas:**

- Domínio `onboarding.bio` vai junto se estiver associado ao projeto
- Re-conectar GitHub integration: **Project → Settings → Git → Disconnect** e reconectar com a nova Org GitHub (só depois da 2.3)

### 2.3 GitHub repository transfer

- [ ] No repo: **Settings → Danger Zone → Transfer ownership**
- [ ] Digitar `<org>/onboarding-bio`
- [ ] Aceitar na Org destino

**Gotchas:**

- Redirects automáticos de URL antiga funcionam **indefinidamente**, mas **não criar** repo com mesmo nome na conta pessoal depois (quebra redirect).
- Repository secrets vão junto. Environment secrets vão junto. Organization-level secrets (se houver) não vão — recriar.
- Após transfer, re-conectar Vercel Git integration (ver 2.2).

### 2.4 Sentry project transfer

- [ ] **Project Settings → General → Transfer Administration → Transfer Project**
- [ ] Email do owner da nova org recebe link de aceite
- [ ] Após aceito: em **Client Keys** pegar o novo DSN
- [ ] Atualizar `NEXT_PUBLIC_SENTRY_DSN` em Vercel env vars (Production + Preview + Development)
- [ ] Redeploy
- [ ] Verificar: enviar um erro de teste e confirmar que aparece na nova org

**O que NÃO transfere:**

- Releases history, Sessions, Crash-free rates histórico
- Teams — reassignar manualmente na nova org, senão projeto fica invisível

---

## Fase 3 — Rotação de credenciais

> **Padrão**: criar nova credencial primeiro, testar, atualizar env/secret, redeploy, verificar, depois revogar antiga. Coexistência por 1-2 dias é OK (e recomendado).

### 3.1 Anthropic API key

- [ ] Na nova org: **Settings → API Keys → Create Key**
- [ ] Nome: `onboarding-bio-supabase-edge-functions`
- [ ] Permissions: todas as necessárias
- [ ] Copiar key (só aparece uma vez)
- [ ] Supabase → **Settings → Edge Functions → Secrets**: atualizar `ANTHROPIC_API_KEY`
- [ ] Redeploy Edge Functions que usam Claude:
  - `submit-form` (renomeada de `submit-intake` em 2026-04-29)
  - `generate-site-content`
  - `generate-report` (renomeada de `generate-analise` em 2026-04-28)
- [ ] Smoke test: submeter um intake e confirmar geração de relatório
- [ ] Revogar key antiga no console antigo

### 3.2 Resend API key

- [ ] Convidar `financeiro@onboarding.bio` como **Admin** no Resend atual (Settings → Team)
- [ ] Aceitar convite no novo email
- [ ] Criar nova API key: **API Keys → Create API Key**
- [ ] Supabase → **Edge Functions → Secrets**: atualizar `RESEND_API_KEY`
- [ ] Redeploy: `send-email`, `drip-emails`, `efi-webhook`
- [ ] Smoke test: trigger email transacional e confirmar recebimento
- [ ] Revogar key antiga
- [ ] Opcional: remover user pessoal do team

### 3.3 Google OAuth — **CRÍTICO**

> Fazer quando não houver usuários ativos (fins de semana, fora do horário comercial). Como ainda não estamos em produção real, tem janela.

- [ ] No project Google Cloud novo (criado em 1.4): **APIs & Services → Credentials → OAuth 2.0 Client IDs**
- [ ] Copiar Client ID e Client Secret do Client criado em 1.4
- [ ] Supabase Dashboard → **Authentication → Providers → Google**:
  - Client ID: colar novo
  - Client Secret: colar novo
  - Save
- [ ] Smoke test: logout → login com Google → confirmar fluxo
- [ ] Depois de validado, desabilitar o Client ID antigo no Google Cloud antigo

**Se houver usuários em produção com refresh tokens ativos:**

- Eles verão a tela de consentimento de novo no próximo login
- Comunicar antes via email: "ao fazer login, você verá uma nova tela de permissão — é normal"

### 3.4 EFI Bank (depende de 1.7 ter aprovado)

Seguir integralmente `docs/plano/execucao/checklist-efi-setup.md`. Env vars/secrets a atualizar:

- `NEXT_PUBLIC_EFI_ACCOUNT_ID`
- `EFI_CLIENT_ID`, `EFI_CLIENT_SECRET`
- `EFI_PLAN_CORE_ID`, `EFI_PLAN_PRO_ID` (criar via API POST /v1/plan)
- `EFI_PIX_CERT_P12_BASE64` (certificado PIX gerado e convertido para base64)
- `EFI_WEBHOOK_TOKEN` (token arbitrário, configurar no painel EFI)
- `EFI_SANDBOX=false` quando sair do sandbox

Webhook URL: `https://<project-ref>.supabase.co/functions/v1/efi-webhook`

---

## Fase 4 — Validação e limpeza

### 4.1 Smoke test end-to-end em produção

- [ ] Signup com email novo
- [ ] Login com Google
- [ ] Onboarding completo (todos os steps)
- [ ] Checkout com PIX sandbox
- [ ] Checkout com cartão sandbox
- [ ] Webhook EFI chega e marca subscription como active
- [ ] Submit intake como aluno
- [ ] Relatório gerado pela IA (Anthropic)
- [ ] Email drip recebido (Resend)
- [ ] Erro forçado aparece no Sentry

### 4.2 Revogar antigas

- [ ] API key Anthropic antiga: revogada
- [ ] API key Resend antiga: revogada
- [ ] OAuth Client ID Google antigo: desabilitado
- [ ] Cancelar billing Supabase/Vercel/Sentry pessoais (se já transferiu tudo)

### 4.3 Atualizar documentação interna

- [ ] `docs/core/integrations.md`: owners corporativos
- [ ] Password manager: consolidar credenciais e revogar as entries antigas
- [ ] Este doc: marcar data de conclusão

---

## Fase 5 — Compliance brasileiro (paralelo, sem bloqueio técnico)

### 5.1 Emissão de notas fiscais

- [ ] Login gov.br nível **Ouro** (biometria facial) do sócio — dispensa certificado digital para emitir NFS-e MEI
- [ ] Cadastrar no [Emissor Nacional NFS-e](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/nota-fiscal)
- [ ] Emitir primeira NFS-e de teste

### 5.2 Contador (obrigatório desde dia 1)

- [ ] Contratar contador especializado em SaaS / Simples Nacional
- [ ] Regime esperado: Simples Nacional Anexo III (ISS 2-5% + impostos federais)
- [ ] Ele cuida de: DAS mensal, DEFIS anual, folha do sócio, obrigações acessórias

### 5.3 Certificado digital (não urgente no mês 1)

- [ ] e-CNPJ A1 (arquivo, ~R$180/ano) comprar quando:
  - Aparecer primeira obrigação acessória (DEFIS, SPED)
  - Quiser acessar e-CAC da Receita direto
  - Precisar assinar termos em tribunais/cartórios digitais

### 5.4 Conta bancária PJ

- [ ] Opções gratuitas: Inter PJ, BS2, C6 Bank PJ
- [ ] Timing: 30 dias após CNPJ, quando já tiver fluxo de caixa para separar
- [ ] EFI já está ativo para receber pagamentos no CNPJ

---

## O que dá para operar **sem** certificado digital agora

✅ Abrir CNPJ, contratar SaaS (cartão pessoal OK temporariamente), operar EFI PJ, Zoho Mail, emitir NFS-e via gov.br Ouro, receber PIX no CNPJ.

❌ Só com e-CNPJ: e-CAC Receita, SPED, obrigações acessórias assinadas digitalmente.

---

## Observações não óbvias

1. **SPF conflito**: Zoho Mail (inbound) + Resend (outbound) no mesmo domínio → SPF precisa incluir **ambos**. Falha comum.
2. **Aliases no Zoho** não consomem licença — usar para `contato@`, `suporte@`, `financeiro@` em vez de criar users reais.
3. **Certificado A1 (arquivo)** é mais barato e prático que A3 (token) para SaaS — copia para servidor, assina automaticamente.
4. **Regime tributário**: SaaS B2C Simples Nacional Anexo III costuma ser o enquadramento correto; ISS municipal varia de 2% a 5% dependendo da cidade. Contador trava.
5. **Brand verification Google**: scopes básicos (`email`, `profile`) são auto-approved — **não** precisa passar pela review de dias/semanas que assusta a documentação.
6. **Downtime zero** em todas as operações exceto Google OAuth (força re-consent) e EFI (se já tivesse conta ativa sendo transferida via Termo de Troca — não é nosso caso).

---

## Fontes

- [Supabase Project Transfers](https://supabase.com/docs/guides/platform/project-transfer)
- [Vercel Transferring Projects](https://vercel.com/docs/projects/transferring-projects)
- [Vercel Transferring Domains](https://vercel.com/docs/domains/working-with-domains/transfer-your-domain)
- [GitHub Transferring a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
- [Google OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)
- [Anthropic Managing Workspaces](https://support.anthropic.com/en/articles/9796807-creating-and-managing-workspaces)
- [Sentry Transfer projects](https://sentry.zendesk.com/hc/en-us/articles/23572020203419)
- [Resend Managing Teams](https://resend.com/docs/dashboard/settings/team)
- [EFI Termo de Troca de Titularidade](https://s3-sa-east-1.amazonaws.com/pe85007/portal/wp-content/uploads/2023/02/Termo-de-troca-de-titularidade-Efi.pdf)
- [Zoho Mail Adding Users](https://www.zoho.com/mail/help/adminconsole/adding-users.html)
- [NFS-e Emissor Nacional MEI](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/nota-fiscal)
- Checklist EFI interno: `docs/plano/execucao/checklist-efi-setup.md`

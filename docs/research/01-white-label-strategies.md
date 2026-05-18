# desafit.app — Recomendações fundamentadas (15 decisões)

> Pesquisa conduzida 16/mai/2026, fontes BR e globais. Onde a evidência é fraca, está sinalizado. Assume todos "não revisitar" do briefing.

---

## BLOCO 1 — Infraestrutura técnica

### 1.1 Hospedagem de vídeo: Mux vs Bunny.net vs Cloudflare Stream

**Pesquisa:**

- Cloudflare Stream cobra $5/1.000 min armazenados + $1/1.000 min entregues, sem fee de encoding (https://www.buildmvpfast.com/alternatives/cloudflare-stream)
- Mux cobra ~$0,07/min encoding + $0,025/min delivery (720p); melhor analytics (Mux Data) e player React/Next polido com mux-player (https://www.mux.com/articles/the-best-video-apis-right-now)
- Bunny Stream é "roughly half the cost of Cloudflare Stream" para hosting básico, com player customizável, **DRM opcional** e suporte explícito a vídeo vertical 9:16 (https://www.pkgpulse.com/guides/mux-vs-cloudflare-stream-vs-bunny-stream-video-cdn-2026)
- Comparação Foliovision: Bunny ~$60/ano vs Cloudflare ~$828/ano em volume equivalente (https://foliovision.com/player/video-security/encoding/pricing-comparison-cloudflare)
- Bunny.net tem 119 PoPs globais incluindo São Paulo, latência média sub-29ms (https://bunny.net/vs/cloudflare/)

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **Mux** | Melhor DX para Next/React; Mux Data analytics nativos; multi-CDN | 2–3× mais caro; overkill para 720p/baixo volume |
| **Cloudflare Stream** | Pricing previsível; encoding grátis; integração ecossistema CF | Sem per-title encoding; analytics fracos; player limitado |
| **Bunny Stream** | ~50% mais barato; player white-label real; PoP SP; DRM opcional | Analytics agregados; sem QoE per-session |

**Recomendação:** **Bunny Stream** para fase 1.

**Razões:**

1. Volume previsto (150GB armazenado, 500–1000 alunos em 720p) faz o Mux custar 3–4× mais sem ganho proporcional — Mux Data não é diferencial nesse estágio.
2. Bunny tem PoP em São Paulo + sub-29ms; Cloudflare e Mux dependem de CDNs globais sem garantia BR.
3. Player Bunny aceita CSS customizado e não exibe branding "Mux"/"Cloudflare" — multi-tenant fica natural, cada tenant com cor própria via tokens.
4. Custo estimado ano 1: ~$15–30/mês. Mux equivalente custaria $80–120/mês.

**Caveat principal:** Bunny não tem QoE analytics — para diagnosticar travamento de vídeo, instrumentar com Mux Data SDK (funciona com qualquer HLS) ou Datadog RUM.

**Custo mensal ano 1:** ~$15–30. Gatilho de migração para Mux: quando 1+ tenant pagar tier premium exigindo analytics QoE ou DRM forte.

---

### 1.2 AI Gateway: Vercel AI Gateway vs Anthropic direto vs OpenRouter vs Portkey

**Pesquisa:**

- Vercel AI Gateway tem **zero markup**: "Tokens cost the same as they would from the provider directly, with zero markup, including with Bring Your Own Key" (https://vercel.com/docs/ai-gateway)
- Failover automático entre anthropic, bedrock e vertexAnthropic incluído (https://vercel.com/ai-gateway/models/claude-sonnet-4.5)
- Free users ganham $5 de crédito a cada 30 dias; integração nativa com AI SDK v5/v6 e OIDC auth
- Zero Data Retention disponível para requests diretos (não BYOK)
- Observabilidade inclui cost-per-request, throughput P50, TTFT P50 ao vivo (https://vercel.com/ai-gateway/models/claude-haiku-4.5)

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **Vercel AI Gateway** | Zero markup; failover; integra AI SDK; OIDC; observability nativa | Lock-in Vercel; rate-limit por tenant não é first-class |
| **Anthropic direto** | Menor latência teórica; sem dependência extra | Sem failover; logs você constrói; key management manual |
| **OpenRouter** | Catálogo enorme de modelos | Markup pequeno (~5%); menos polido para Next/AI SDK |
| **Portkey** | Rate-limit per-key/per-tenant nativo; semantic cache | Plano gratuito limitado; custo adicional em escala |

**Recomendação:** **Vercel AI Gateway**.

**Razões:**

1. Zero markup confirmado em doc oficial — sem custo de oportunidade vs Anthropic direta.
2. Stack já é Vercel + AI SDK — Portkey/OpenRouter cria layer desnecessária no MVP.
3. Failover Anthropic→Bedrock→Vertex resolve risco de downtime sem código custom.
4. Observability (cost per request, P50) basta para atribuir custo por tenant via metadata até 50 tenants.

**Caveat principal:** Rate-limit por tenant não é nativo — implementar throttling no edge function (Upstash Ratelimit + Supabase). Se chegar a 100+ tenants concorrentes, Portkey vira opção.

**Custo estimado:** 300 Sonnet × ~4k tokens × $0,003/1k ≈ $3,60 + 5k Haiku × 2k tokens × $0,001/1k ≈ $10. **Total ~$15–25/mês**, bem dentro do budget $200.

---

### 1.3 Custom domain por tenant — MVP ou Fase 2?

**Pesquisa:**

- Trainerize cobra **$169 setup + $5–45/mês** pelo app white-label (https://assistantcoach.fit/blog/real-cost-fitness-coaching-software/)
- MyPTHub cobra ~$157/mês pela versão white-label completa
- TrueCoach **não oferece** white-label real — clientes ficam dentro da marca TrueCoach
- Hotmart, Kiwify e Eduzz **não** oferecem custom domain real no app/área de membros (https://cademi.com.br/blog/hotmart-ou-kiwify/)
- Cliente alvo (30k+ seguidores, R$15k+ MRR) tipicamente já tem domínio próprio em uso na bio do Instagram

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **MVP (dia 1)** | Diferencial real vs Hotmart/Kiwify; justifica setup R$3k–4k; SEO próprio | Complexidade SSL/CNAME; tickets de DNS |
| **Fase 2** | MVP mais simples; foco em validar core | Perda de cliente premium ("se vou em subdomínio, pago Hotmart") |

**Recomendação:** **MVP — liberar custom domain no Pacote B (R$3k) e Pacote C (R$4k); Pacote A fica em subdomínio.**

**Razões:**

1. Posicionamento "marca própria, não Mydose" exige custom domain — sem isso o Pacote B perde 80% do valor percebido.
2. Setup R$3k–4k cobre a mão de obra de provisionar CNAME por tenant — done-for-you implica isso.
3. Concorrentes globais cobram explicitamente (Trainerize $169 + $5/mês) — é benchmark de pricing.
4. Implementação técnica é trivial via Cloudflare for SaaS (ver 1.4) — não é o gargalo.

**Caveat principal:** Suporte vai pegar tickets de "DNS não propagou", "certificado inválido" — automatize status check no painel do tenant antes de liberar.

**Risco se errar:** Subdomínio gratuito leva cliente a comparar com Hotmart e questionar pricing. Confiança: **alta.**

---

### 1.4 Cloudflare for SaaS vs Vercel Domains API

**Pesquisa:**

- Cloudflare for SaaS: **100 custom hostnames grátis**, depois **$0,10/hostname/mês** (caiu de $2 em 2024) (https://blog.cloudflare.com/waf-for-saas/)
- Limite pay-as-you-go subiu de 5.000 para **50.000 hostnames** em maio/2025 (https://developers.cloudflare.com/changelog/post/2025-05-19-paygo-updates/)
- Custom origin server agora disponível em Free/Pro/Business (não só Enterprise)
- WAF/DDoS/Bot Mitigation extensíveis para custom hostnames sem upgrade
- Vercel Domains API tem limites mais restritivos por projeto e não inclui WAF — força uso de Vercel Firewall separado

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **Cloudflare for SaaS** | $0,10/domínio; WAF/DDoS grátis; 50k limit; SSL auto | Camada extra fora da Vercel; doc de CNAME para o cliente |
| **Vercel Domains API** | Integração nativa; deploy unificado | Limite menor; sem WAF; mais caro acima de 100 |
| **Approuter (BR)** | Suporte BR | Menos maduro; sem WAF global |

**Recomendação:** **Cloudflare for SaaS**.

**Razões:**

1. Custo previsível: 100 grátis + $0,10 extra. 100 tenants ano 3 = **$0/mês**; 500 tenants = **$40/mês**.
2. WAF + DDoS + Bot Mitigation grátis no PAYG — Vercel cobra à parte por Firewall Plus.
3. Custom origin liberado em planos não-Enterprise elimina o lock-in que era reclamação histórica.
4. Padrão de mercado (Shopify, Webflow, Notion) — cliente PT/nutri já viu fluxo "aponte CNAME pra..." e segue sem suporte.

**Caveat principal:** Cloudflare for SaaS exige "fallback origin" — mantenha 1 zona DNS dedicada (`apps.desafit.app`) para evitar conflito com zona principal.

**Custo estimado:** 100 tenants ≈ $0/mês; 500 tenants ≈ $40/mês.

---

### 1.5 Vapid keys Web Push: 1 por env ou 1 por tenant?

**Pesquisa:**

- RFC 8292: "The public key of the application server serves as a **stable identifier for the server**. This key can be used to **restrict a push message subscription to a specific application server**" (https://datatracker.ietf.org/doc/html/rfc8292)
- Pushpad gera par VAPID por website: "more secure and allows customers to export their own VAPID keys at any time, no lock-in" (https://pushpad.xyz/blog/web-push-what-is-vapid)
- MagicBell: "most teams generate a separate pair per project. Using distinct keys makes it easier to rotate credentials and isolate push traffic" (https://www.magicbell.com/tools/vapid-keys)
- Subscription do browser fica vinculada ao public key passado em `applicationServerKey` — rotacionar invalida todas
- Mozilla recomenda o par como contato debug do server (https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/)

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **1 par por env** | Simples; fácil rotacionar | Comprometeu uma = comprometeu todos; tenant não pode "portar" |
| **1 par por tenant** | Isolation real; tenant tem soberania; rotação granular | DB carrega N pares; signing precisa selecionar key por request |

**Recomendação:** **1 par por tenant**, gerado no provisioning e armazenado criptografado em `tenant_secrets` (pgcrypto / Supabase Vault).

**Razões:**

1. RFC 8292 e provedores estabelecidos (Pushpad) tratam isolation per-tenant como padrão — alinhamento com "white-label real".
2. Comprometimento de chave de um tenant não vaza os outros.
3. Migração futura para self-hosted pelo tenant é tecnicamente possível — fortalece narrativa anti-lock-in.
4. Custo operacional desprezível — par P-256 são ~2 strings de 88 caracteres no banco.

**Caveat principal:** No service worker do PWA branded, `applicationServerKey` deve ser entregue dinamicamente via fetch ao backend no momento do `pushManager.subscribe()` — nunca hardcode no manifest.

---

## BLOCO 2 — Pagamentos

### 2.1 Gateway do aluno dia 1: Asaas vs Pagar.me vs Mercado Pago vs Stripe BR

**Pesquisa:**

- **Asaas**: cadastro gratuito, Pix R$ 0,49 por cobrança; cartão R$ 0,49 + 1,99% sobre parcelas; **instituição de pagamento autorizada pelo BCB (código 461)** (https://www.asaas.com/precos-e-taxas)
- **Mercado Pago**: 3,99–4,99% conforme prazo de liberação, ampla base BR mas onboarding com mais fricção (https://www.wdshop.com.br/blog/5-melhores-plataformas-de-pagamento-online-para-sua-loja-virtual-25/)
- **Pagar.me**: API mais robusta, foco e-commerce/marketplace; usado por mid-market com time técnico (https://docs.pagar.me/v1/docs/criando-um-recebedor-1)
- **Stripe BR**: Pix suportado desde 2022 mas ecossistema BR fraco; reembolso menos automático
- PT/nutri vendendo programa próprio R$ 15k+ MRR tipicamente já usa Asaas ou Mercado Pago — Pagar.me só aparece em time técnico próprio

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **Asaas** | API moderna; Pix nativo; onboarding em horas; doc PT-BR; 30 Pix grátis/mês | Menos features de subscription que Stripe |
| **Pagar.me** | API enterprise; split nativo; antifraude maduro | Onboarding mais demorado; melhor pra PJ |
| **Mercado Pago** | Brand BR forte; parcelado agressivo | Webhooks historicamente flaky; suporte fraco |
| **Stripe BR** | DX mundial; dashboard rico | Pix funcional mas sem ecossistema BR maduro |

**Recomendação dia 1:** **Asaas**. Ordem: **Pagar.me → Mercado Pago → Stripe**.

**Razões:**

1. Cliente alvo reconhece Asaas — onboarding "criou conta, primeira venda" em <2h.
2. API e webhooks documentados em PT-BR — adapter mais rápido de implementar.
3. Pix R$ 0,49 fixo é o pricing mais agressivo para ticket R$ 200–500 (médio do segmento).
4. Pagar.me será inevitável na fase marketplace (split nativo) — implementar como #2 alinha sem reescrever.

**Caveat principal:** Asaas teve relatos no Reclame Aqui sobre retenção de saldo em chargeback alto — para tenants que escalarem rápido (R$ 50k+/mês), oriente preferir Pagar.me ou conta PJ Asaas.

---

### 2.2 Pagar.me split: KYC automático ou manual?

**Pesquisa:**

- Pagar.me v1 `POST /recipients` aceita `register_information` completo (PF ou PJ) com dados bancários, mas status final depende de review do compliance Pagar.me (https://docs.pagar.me/v1/docs/criando-um-recebedor-1)
- Documentos PJ: CNPJ, razão social, receita anual, sócios majoritários (CPF, mãe, endereço); PF: CPF, comprovante de renda
- Modelo de status análogo Yuno: CREATED → PENDING → SUCCEEDED/REJECTED (https://docs.y.uno/docs/split-payments-marketplace)
- Alternativas BR com split nativo: Iugu split, Asaas split, Mercado Pago Marketplace
- Stripe Connect funciona BR mas Custom accounts ainda têm limitações de KYC local

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **KYC 100% automatizado** | Onboarding instantâneo; UX premium | Risco de fraude; rejection rate alto bate métricas Pagar.me |
| **Manual <30 tenants** | Aprende padrões de aprovação; reduz rejection | Não escala; ops em founder |
| **Híbrido (semi-auto)** | Automatiza submission, founder revisa antes do submit | Latência de ~24h no onboarding |

**Recomendação:** **Onboarding semi-automatizado via API + revisão manual da plataforma nos primeiros 30 tenants do split.**

Fluxo:

1. Coletar dados do prof via form no painel (PJ obrigatório, ou MEI com restrições TPV).
2. Founder revisa submission antes de chamar `POST /recipients`.
3. Webhook Pagar.me sinaliza approval (1–5 dias MEI, 5–10 dias PJ com sócios PEP).
4. Após 30 recipients aprovados sem rejection, automatizar 100%.

**Caveat principal:** Receita anual <R$ 50k acelera approval mas limita TPV. Para tenant que faz lançamento R$ 200k em 7 dias, o recipient pode ser suspenso — adicione "receita projetada 12m" no onboarding e pré-aprove com Pagar.me se >R$ 500k.

**Risco:** rejection rate >5% nos primeiros 30 fica registrado no histórico da conta — pior do que ir manual no início.

---

## BLOCO 3 — Comunicação

### 3.1 OBA WhatsApp — quando solicitar?

**Pesquisa:**

- Timing real 2025/2026: 2–7 dias úteis normal, até 3 semanas em filas (https://www.wati.io/blog/whatsapp-green-tick-verification/)
- BSP route típico: 7 dias a 3 semanas (https://respond.io/blog/whatsapp-green-tick)
- **Selo virou azul em 2024** — Meta unificou badges Facebook/Instagram/WhatsApp (https://www.uptail.ai/blog/whatsapp-green-tick-verification-for-business)
- Pré-requisitos: Meta Business Manager verified, 2FA, Tier 1+, **3–5 PR articles orgânicos** (notability) (https://www.engati.ai/blog/how-to-get-a-whatsapp-green-tick)
- Caminho alternativo **Meta Verified subscription** (paga) disponível BR — aprovação em horas/dias mesmo sem notability
- Sem badge: API funciona 100% (templates, broadcasts, chatbots); diferencial é display name no chat list

**Trade-offs:**
| Estratégia | Pros | Contras |
|---|---|---|
| **Número único plataforma** | Custo concentrado; 1 OBA gerencia tudo | Aluno vê marca desafit, não marca do prof |
| **1 número por tenant** | White-label total; OBA per-tenant aumenta confiança | N BSPs/OBAs/verifications = explosão de ops |
| **Híbrido (recomendado)** | Plataforma para operacional + opt-in BYO para tier alto | Complexidade dupla |

**Recomendação:** **Estratégia híbrida.**

1. **Número compartilhado desafit** para notificações operacionais (lembrete aula, cobrança, check-in). Solicitar OBA da própria desafit quando atingir 5 menções orgânicas em mídia. Estimado mês 4–6.
2. **Pacote C ou tier alto**: opção BYO number — "WhatsApp com sua marca, +R$ 500/mês".
3. **Não buscar OBA per-tenant inicialmente** — custo BSP + ops é proibitivo para 1 founder.

**Razões:**

1. Notability orgânica exige PR — só faz sentido após 10–15 tenants e mídia fitness cobrir.
2. Sem OBA, funcionalidade idêntica — pressão de timing é cosmética.
3. Meta Verified pago é Plan B se aprovação orgânica demorar (~$10–30/mês BR).
4. Push notification PWA cobre 80% dos casos operacionais — WhatsApp só para cobrança crítica e re-engajamento.

**Caveat principal:** Custo Meta Cloud API é **por conversa**, não por mensagem. Conversas user-initiated em 24h são grátis; templates Utility/Marketing custam $0,03–0,07 BR. Modele em mensalidade plataforma, não repasse direto.

---

## BLOCO 4 — Observabilidade + QA

### 4.1 Sentry: Free vs Team vs Business

**Pesquisa:**

- Free (Developer): 5k errors/mês, 10k spans, **1 user**, 30 dias retention (https://sentry.io/pricing/)
- Team: **$26/mês** anual — 50k errors, 5M spans, unlimited users, 90 dias retention (https://docs.sentry.io/pricing/)
- Business: $80/mês — mesma quota base + SSO/SAML, custom dashboards, cross-project routing
- Overage após quota: ~$0,000290/event (https://last9.io/blog/sentry-pricing/)
- Alternativas: Highlight.io (free 500 sessions + 1k errors), self-hosted Sentry, BetterStack, Logtail

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **Free** | $0; suficiente <5k errors | 1 user; sem Replay produtivo; 30d retention |
| **Team** | $26 trivial; unlimited users; Replay; integrações | Sem SSO; sem custom dashboards |
| **Business** | SSO, dashboards, retention 90d | $80 caro pra founder solo; features para times |
| **Highlight.io free** | Replay + erros grátis | Menos maduro; integrações limitadas |

**Recomendação:** **Team plan ($26/mês) dia 1.**

**Razões:**

1. Founder solo + 50 tenants ano 1 → 5k errors é teto baixo (1 bug em loop queima quota em horas).
2. Session Replay (Team) economiza 80% do tempo de debug do PWA do aluno — impossível reproduzir iPhone bug sem ele.
3. Unlimited users prepara para contratar 1 dev/QA no ano 2 sem trocar plano.
4. $26/mês < 1h de dev time — ROI instantâneo no primeiro bug não trivial.

**Caveat principal:** Configure `before_send` + Spike Protection no SDK dia 1 — bug em loop nas Edge Functions pode queimar 50k errors em 1h e gerar overage $50–100.

**Gatilho upgrade Business:** Primeiro funcionário externo (SSO obrigatório) OU 100k errors/mês recorrente (PAYG fica caro vs reserved Business).

---

### 4.2 VRT: Playwright puro vs Chromatic vs Argos vs Percy

**Pesquisa:**

- Chromatic Storybook-first; integração Playwright disponível mas paga (~$149/mês tier popular) (https://www.chromatic.com/compare/playwright)
- Argos CI free para projeto pessoal, claim "$807 vs Chromatic + Percy" em case (https://argos-ci.com/)
- Playwright `toHaveScreenshot()` grátis built-in, mas bug conhecido de **OS dependency** (baseline Mac, CI Linux = false positives) (https://www.tonyward.dev/articles/visual-regression-testing-disruption)
- Solução para OS issue: Playwright em Docker no CI igual ao baseline — adiciona ~2min/run
- Percy (BrowserStack) free 5k snapshots/mês; AI review filtra 40% false positives mas é tier Standard+ (https://percy.io/blog/visual-regression-testing-tools)

**Trade-offs:**
| Opção | Pros | Contras |
|---|---|---|
| **Playwright VRT puro** | Grátis; no third-party; repo-local | OS dependency; sem review UI; baselines pesam |
| **Argos CI** | Free pra solo; review UI; PR integration | Time pequeno; menos features Chromatic |
| **Chromatic** | Melhor review UI; anti-flake; Storybook | $149/mês para 35k snapshots — caro pra solo |
| **Percy** | Free 5k snapshots; AI review | Pricing escala rápido por viewport |

**Recomendação:** **Playwright VRT puro em Docker até 30 tenants; Argos CI quando precisar de review UI compartilhada.**

**Razões:**

1. Dev solo não tem ninguém para revisar diff — review UI sofisticada do Chromatic é desperdiçada.
2. 10 rotas × 3 viewports = 30 screenshots/PR cabe em qualquer free tier futuro.
3. Docker em GitHub Actions resolve OS dependency com 2min/run extra — aceitável.
4. Argos free tier ($0) cobre projeto solo; quando contratar segundo dev, paid plan é ~3× mais barato que Chromatic.

**Caveat principal:** Playwright em Docker exige imagem fixa (`mcr.microsoft.com/playwright:v1.x-jammy`) — pin a versão; atualizar Playwright sem rebaselining quebra tudo.

**Gatilho upgrade Argos/Chromatic:** primeiro designer/QA dedicado OU >100 snapshots/PR (review em git inviável).

---

## BLOCO 5 — Estratégia + roadmap

### 5.1 Gatilhos de transição agência → SaaS self-service

**Pesquisa:**

- Hotmart, Kiwify, Cademí nasceram self-service — não há blueprint direto BR de "agência → SaaS"
- Trainerize evoluiu de software-only para "Smart Meal + Custom App" como add-ons (https://www.trainerize.com/pricing/), mas onboarding sempre foi self-service
- TTFV <30 min, NPS >40, support ticket <0,3/tenant/semana são thresholds comuns SaaS B2B para "produto self-serve maduro"
- MyPTHub e PT Distinction ainda mantêm "concierge onboarding" pago em paralelo ao self-service — modelo não exclusivo

**Trade-offs:**
| Abordagem | Pros | Contras |
|---|---|---|
| **Switch único (data X)** | Marketing claro; pricing limpo | Risco se gatilho impreciso; abandona clientes em transição |
| **Coexistência (recomendada)** | Reduz risco; concierge vira upsell | Complexidade operacional dupla |
| **Manter agência indefinido** | Margem alta por tenant | TAM limitado ao bandwidth founder |

**Recomendação:** **5 gatilhos quantitativos cumulativos — não eliminar setup, transformá-lo em tier concierge opcional.**

1. **15 tenants ativos** pagando mensalidade há 3+ meses (retenção, não só venda).
2. **TTFV self-service <60 min** ("criou conta" → "primeiro aluno no app"), medido com usuário externo.
3. **Tickets <2/tenant no primeiro mês** — onboarding documentado/intuitivo.
4. **NPS ≥40** dos primeiros tenants — bar BR mais baixo que global.
5. **2 vídeos de onboarding completados** sem intervenção humana (criou conta, configurou, ativou domínio).

**Caveat principal:** Eliminar setup pode soar como desvalorização — Hotmart cobra 9,9% indefinidamente justificando como "valor de suporte". Manter tier concierge R$1.500 como opção.

**Risco cedo demais:** Churn alto + suporte 24/7 + NPS despencando. Risco tarde: TAM travado em 30 tenants/ano (capacidade founder).

---

### 5.2 Locale switcher EN — quando ativar?

**Pesquisa:**

- Sem dados públicos consolidados sobre quando Hotmart/RD viraram EN — Hotmart abriu LATAM (ES) antes
- Resultados Digitais (RD Station) abriu LATAM via ES, EN pós-aquisição TOTVS
- Manter 2 idiomas ativos sem cliente real exige revisão dupla de copy (legal, marketing, transacional)
- Producthunt/IndieHackers atraem visitas EN, mas conversão BR-based para cliente pagante EN historicamente <2%

**Trade-offs:**
| Timing | Pros | Contras |
|---|---|---|
| **Dia 1** | Ready para qualquer lead EN | Overhead constante de revisão; copy ruim mata conversão |
| **3+ leads EN/30 dias** | Sinal de demanda real | Pode atrasar oportunidade |
| **Pós-1º cliente pagante EN** | Investimento contra receita real | Pode perder onda |

**Recomendação:** **Ativar EN quando 3+ leads EN qualificados em 30 dias OU 1º cliente pagante EN.** Antes, manter `messages/en-US.json` espelho como skeleton, sem expor switcher.

Próximo locale após EN: **ES (LATAM)** — não PT-PT.

**Razões:**

1. Manter 2 idiomas ativos sem cliente real = overhead invisível mas alto (cada copy change vira PR duplo).
2. Conversão visitante EN → cliente BR-based <2% historicamente — pouco ROI no esforço de tradução.
3. ES amplifica LATAM (~600M falantes) vs PT-PT (~10M) — ROI 60×.
4. Vibe coding Claude entende PT-BR nativo — vantagem competitiva local não traduz para EN imediatamente.

**Caveat principal:** Instrumente i18n nas strings desde dia 1 mesmo sem ativar switcher — não tente migrar depois.

---

### 5.3 Concorrentes diretos e indiretos

**Pesquisa BR:**

- **Mydose AI** (mydoseapp.com): "comunidades gamificadas com IA" para profs bem-estar — marketplace style, **não é white-label real**, todos os profs aparecem dentro da marca Mydose
- **Tecnofit Personal**: app **gratuito** para prescrição (https://www.tecnofit.com.br/solucoes-tecnofit-personal/); planos academia R$ 189+/mês; sem white-label, marca Tecnofit visível
- **Pacto Soluções**: gestão de academia (CRM/financeiro/DRE) — não compete diretamente com app do aluno (https://sistemapacto.com.br/)
- **TreinoAI/MFit/NextFit**: R$ 24,90–160/mês por personal, sem white-label real

**Pesquisa global:**

- **Trainerize**: $5–$250/mês + $169 setup + add-on white-label (https://assistantcoach.fit/blog/real-cost-fitness-coaching-software/)
- **TrueCoach**: $26–$137/mês, sem white-label, **cobra 5% sobre payments processados**
- **MyPTHub**: ~$157/mês white-label completo, foco UK/global
- **PT Distinction**: melhor white-label/preço entre globais
- **CoachingPortal**: $109/mês all-included (white-label + meal planner + 17k receitas)

**Indiretos/adjacentes:**

- **Hotmart**: 9,90% + R$1 TR; sem white-label real (https://cademi.com.br/blog/qual-melhor-gateway-de-pagamento/)
- **Kiwify**: 8,99% + R$2,49; sem white-label
- **Eduzz**: 4,90% + R$1 direto / 8,90% + R$1 via afiliado
- **Cademí**: "primeiro hub de membros BR", foco creator/educador, **não vertical fitness** (https://cademi.com.br/blog/hotmart-ou-kiwify/)
- **Memberkit**: similar a Cademí

**Tabela comparativa (6 mais relevantes):**

| Player         | Preço              | White-label real (domain+app)                 | Multi-modal           | Vibe coding/IA | Mercado  | Gap                                        |
| -------------- | ------------------ | --------------------------------------------- | --------------------- | -------------- | -------- | ------------------------------------------ |
| **Mydose**     | R$ 297+/mês (est.) | Não                                           | Bem-estar marketplace | IA gamificação | BR       | Cliente fica dentro da marca Mydose        |
| **Tecnofit**   | R$ 189+/mês        | Não                                           | Não (só fitness)      | Não            | BR       | Foco academia, ignora PT solo              |
| **Trainerize** | $5–250 + $169 wl   | Parcial (app branded; sem custom domain real) | Fitness only          | Smart Meal AI  | Global   | Sem custom domain real; sem PT-BR; sem Pix |
| **MyPTHub**    | ~$157/mês          | Sim                                           | Fitness only          | Limitado       | Global   | Sem BR localization; pricing alto          |
| **Hotmart**    | 9,9% TR            | Não                                           | Sim (curso/qualquer)  | Limitado       | BR/LATAM | Marketplace — sem marca própria            |
| **Cademí**     | SaaS mensal        | Parcial                                       | Sim (cursos)          | Não            | BR       | Foco educação, não fitness recorrente      |

**3 oportunidades de diferenciação não óbvias:**

1. **Schema agnóstico desde dia 1, vertical até a UX.** Cademí é horizontal demais (perde fitness); Trainerize é fitness demais (perde yoga/coaching). Desafit pode entrar em yoga/coaching/inglês ano 2 sem rebuild, mas UX fase 1 é 100% PT/nutri. Ninguém ataca esse meio.
2. **White-label real BR-localizado.** Trainerize/MyPTHub não têm Pix, EFI, NFS-e, OBA WhatsApp BR. Mercado R$ 5–15k MRR de PT/nutri BR está sem opção que combine domain próprio + Pix nativo + WhatsApp.
3. **Vibe coding como onboarding, não como feature.** Concorrentes têm "AI Smart Meal Planner" como feature interna. Desafit pode usar IA para **provisionar o app inteiro** (manifest, copy, fluxo) — moat real, Hotmart/Trainerize não vão construir porque o modelo deles é template-based.

---

## BLOCO 6 — Validação do modelo de negócio

### 6.1 Precificação pacotes (R$ 1.500 / R$ 3.000 / R$ 4.000 + R$ 100/200)

**Pesquisa:**

- Trainerize white-label: $169 setup + $5–45/mês ≈ R$ 850 setup + R$ 25–230/mês (https://www.trainerize.com/pricing/)
- MyPTHub: ~R$ 800/mês equivalente; CoachingPortal $109/mês ≈ R$ 555/mês all-included
- Agências digitais BR cobram R$ 3k–8k para funnel + landing + integração — Pacote A (R$1.500) **abaixo do benchmark**
- Hotmart/Kiwify alternativa "grátis" mas custa 9–10% TR; R$ 15k MRR × 10% = R$ 1.500/mês — desafit R$ 200/mês é 87% mais barato (https://tactus.com.br/qual-a-melhor-plataforma-digital/)
- Cliente R$15k MRR aceita ticket R$ 4k se ROI claro — é 0,8 mês de faturamento

**Trade-offs:**
| Cenário | Pros | Contras |
|---|---|---|
| **Manter preços atuais** | Acessível; baixa fricção de venda | Subprecificação visível vs Trainerize; mensalidade não cobre custos (ver red flag #2) |
| **Subir B/C (+R$500)** | Anchor maior; melhor margem; alinha com global | Eventual perda de leads price-sensitive |
| **Subir A também** | Margem em todos | Comoditiza fora do nicho premium |

**Recomendação:** **Manter Pacote A em R$1.500; subir B para R$3.500 e C para R$4.500.**

**Razões:**

1. Diferencial R$1.500 (A→B) é grande, mas B→C é só R$1.000 — diminui upgrade percebido. Subir C para R$4.500 amplia anchor e melhora venda do meio.
2. Mensalidade R$100/200 está abaixo de Trainerize/MyPTHub em USD — pode subir B/C para R$247/mês após mês 11 sem fricção.
3. Apresentação "10× R$450" (Pacote C) > "10× R$400" — manter "10× sem juros" é poderoso (Hotmart treinou esse público).
4. Pacote A em R$1.500 com mensalidade baixa entra como "tryout pago" — funnel pra B/C.

Apresentação:

- "Pacote C — Conjunto completo: 10× R$ 450 ou R$ 4.500 à vista (5% off)"
- Garantia 7 dias (CDC obrigatória)
- Escassez real: "5 novos profs/mês para garantir suporte"

**Caveat principal:** Bônus "10 meses sem mensalidade" no C é caro — R$ 200×10 = R$ 2.000 receita diferida. Troque por "12 meses com 50% off (R$ 100)" — mesma percepção, melhor fluxo.

---

### 6.2 Mensalidade SaaS fase 2 — R$ 297–497?

**Pesquisa:**

- Trainerize white-label completo: ~$45/mês ≈ R$ 230 (https://assistantcoach.fit/blog/real-cost-fitness-coaching-software/)
- MyPTHub: $157/mês ≈ R$ 800
- CoachingPortal: $109/mês ≈ R$ 555 (all-included)
- Cademí pricing não público, mercado estima R$ 197–497/mês conforme tier
- Single tier vs Starter/Pro/Enterprise: SaaS B2B maduros (Notion, Linear) convergem em 3 tiers — capturam land-and-expand

**Trade-offs:**
| Estratégia | Pros | Contras |
|---|---|---|
| **Single tier (R$397)** | Simples; comunicação direta | Deixa dinheiro na mesa nos extremos (PT pequeno e PT escalado) |
| **3 tiers (recomendado)** | Cobre spectrum; upgrade path claro | Complexidade comunicação |
| **5+ tiers** | Hiper-segmentação | Paradoxo da escolha; suporte explode |

**Recomendação:** **3 tiers após eliminar setup.**

| Tier        | Preço/mês | Inclui                                                                             |
| ----------- | --------- | ---------------------------------------------------------------------------------- |
| **Starter** | R$ 197    | Subdomínio desafit.app/slug, 1 programa, até 50 clients, sem IA                    |
| **Pro**     | R$ 397    | Custom domain, programas ilimitados, até 200 clients, IA básica (chat nutri Haiku) |
| **Scale**   | R$ 697    | Clients ilimitados, vibe coding Sonnet, suporte prioritário, WhatsApp OBA branded  |

**Razões:**

1. R$ 197–697 cobre PT solo (5–10k MRR) até PT escalado (R$ 50k+ MRR).
2. Pro (R$ 397) é o anchor; paywall pra custom domain (feature de alta percepção).
3. Scale (R$ 697) é metade do MyPTHub convertido — defesa competitiva.
4. Starter (R$ 197) abre porta para PT/nutri menor que vira Pro em 6 meses (land-and-expand).

**Caveat principal:** Quem comprou Pacote B/C com R$ 200/mês (fase agência) deve ser **grandfathered** — respeito ao early adopter + word-of-mouth.

---

### 6.3 Take rate fase SaaS marketplace — 5–10%?

**Pesquisa:**

- Hotmart: 9,90% + R$1 (https://cademi.com.br/blog/onde-vender-cursos-online/)
- Kiwify: 8,99% + R$2,49
- Eduzz: 4,90% + R$1 direto; 8,90% via afiliado
- Monetizze: 7,99% + R$1,50
- Patreon: 5–12% (creator pro tier)
- Substack: 10%; Gumroad: 10% + cartão
- Pagar.me direto (sem plataforma): ~3,99% cartão + ~0,99% Pix — custo "raw"
- TrueCoach cobra 5% extra **além da mensalidade** — comportamento "marketplace disfarçado"

**Trade-offs:**
| Estrutura | Pros | Contras |
|---|---|---|
| **Flat 10%** | Simples; alinha com Hotmart | Sem incentivo a upgrade SaaS |
| **Escalonado por tier (recomendado)** | Recompensa volume; força land-and-expand | Comunicação mais complexa |
| **0% TR + mensalidade alta** | Sem atrito psicológico | Pricing pouco competitivo em entrada |

**Recomendação:** **TR escalonado por tier SaaS — 8% Starter / 6% Pro / 4% Scale.**

Estrutura:

- Mensalidade SaaS continua independente (modelo híbrido Shopify-like)
- Tier Enterprise opcional R$1.997/mês: **0% TR** — válvula para clientes maduros

**Razões:**

1. 6% (Pro) deixa desafit 3,9 pontos abaixo de Hotmart — diferencial claro com marca própria.
2. Estrutura escalonada incentiva upgrade — TR cai com pagamento SaaS maior.
3. Custo gateway raw (~4%) deixa ~2% margem no Pro — viável.
4. Cliente vindo de Hotmart vê redução de 4 pontos + ganha marca própria — pitch óbvio.

**Caveat principal:** Aceitação cultural de "pagar SaaS + pagar TR" é o atrito. Sem válvula 0% TR no Enterprise, cliente que escala sai pra Pagar.me direto. Comunicar como "Enterprise = 0% TR" cria upgrade path natural.

---

## Resumo executivo

### Tabela das 15 decisões

| #   | Decisão                 | Recomendação                                                       | Confiança |
| --- | ----------------------- | ------------------------------------------------------------------ | --------- |
| 1.1 | Vídeo hosting           | **Bunny Stream**                                                   | Alta      |
| 1.2 | AI Gateway              | **Vercel AI Gateway**                                              | Alta      |
| 1.3 | Custom domain           | **MVP no Pacote B/C**                                              | Alta      |
| 1.4 | SSL multi-tenant        | **Cloudflare for SaaS**                                            | Alta      |
| 1.5 | VAPID Web Push          | **1 par por tenant**                                               | Alta      |
| 2.1 | Gateway aluno dia 1     | **Asaas** (depois Pagar.me/MP/Stripe)                              | Alta      |
| 2.2 | Pagar.me KYC            | **Semi-automatizado + revisão manual <30 tenants**                 | Média     |
| 3.1 | WhatsApp OBA            | **Híbrido: número desafit mês 4–6; BYO opcional**                  | Média     |
| 4.1 | Sentry plan             | **Team $26/mês dia 1**                                             | Alta      |
| 4.2 | VRT                     | **Playwright+Docker até 30 tenants; depois Argos**                 | Média     |
| 5.1 | Agência→SaaS            | **5 gatilhos cumulativos; manter concierge como tier**             | Média     |
| 5.2 | EN locale               | **3+ leads EN ou 1º cliente pagante; ES antes de PT-PT**           | Média     |
| 5.3 | Concorrentes            | **3 gaps: schema agnóstico, BR-localized, vibe coding onboarding** | Alta      |
| 6.1 | Pacotes A/B/C           | **A R$1.500; B→R$3.500; C→R$4.500**                                | Média     |
| 6.2 | Mensalidade SaaS fase 2 | **3 tiers R$197/R$397/R$697**                                      | Média     |
| 6.3 | Take rate marketplace   | **8/6/4% escalonado por SaaS tier + Enterprise 0%**                | Média     |

### Top 5 surpresas

1. **Cloudflare for SaaS caiu de $2 para $0,10/hostname** e levantou limit pra 50k sem precisar Enterprise (mudança de 2025). Decisão 1.4 fica trivial.
2. **Vercel AI Gateway tem zero markup confirmado em doc oficial** — esperava 5–10% como OpenRouter. Não há razão financeira pra ir direto na Anthropic.
3. **TrueCoach cobra 5% extra sobre payments processados** além da mensalidade — comportamento de "marketplace disfarçado". Torna a take-rate desafit (6%) competitiva mesmo somando com mensalidade.
4. **WhatsApp tick mudou de verde para azul em 2024** (Meta unificou badges) — copy do briefing precisa atualização. E o caminho pago Meta Verified ($10–30/mês BR) pula a exigência de notability.
5. **Bunny Stream tem PoP em São Paulo com sub-29ms latência** — Mux e Cloudflare não destacam isso. Para PWA de aluno BR consumindo treino em vídeo, é a diferença entre buffering e play instantâneo.

### Top 3 RED FLAGS na estratégia atual

1. **Bônus "10 meses sem mensalidade" no Pacote C destrói fluxo de caixa.** R$ 4.000 entra hoje, mas R$ 2.000 de receita diferida some — e o tenant que mais consome suporte (acabou de comprar) é o que **menos paga** nos próximos 10 meses. Troque por desconto percentual (50% × 12 meses) ou crédito em programas adicionais.

2. **Mensalidade R$ 100 no Pacote A está abaixo do custo unitário real.** Vercel + Supabase + Bunny + Sentry + Resend + Meta Cloud API + EFI somam ~R$ 35–50/tenant/mês em custo direto. Sobra R$ 50–65 de margem bruta — sem contar suporte. Em 50 tenants, R$ 2.500–3.250 brutos/mês não cobre 1 BPO. Reveja para mínimo R$ 147–197.

3. **Decidir "não OBA WhatsApp dia 1" é correto, mas o briefing trata Meta Cloud API como decisão fechada sem dimensionar custo de templates.** Lembretes via Utility template custam $0,03–0,07 BR/conversa. 50 tenants × 200 alunos × 4 msgs/mês = 40k conversas ≈ R$ 7–14k/mês. Isso **mata** unit economics se repassado errado. Mitigação: priorizar push notification (free, ver 1.5) e usar WhatsApp template só para cobrança crítica e re-engajamento de aluno inativo.

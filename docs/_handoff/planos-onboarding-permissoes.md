# retake.run — Planos, Onboarding, Aprovações & Permissões

> Especificação de **quem existe, quanto paga, como entra, quem aprova e quem pode o quê.**
> Planos e preços **moram no banco** (`public.plans` / `public.prices` / `public.plan_features`)
> — esta tabela é o conteúdo-semente, não valores hardcoded no código.
> Ver `banco-de-dados.md` §1, §2 para o schema; aqui é a lógica de produto.

---

## 1. Entidades (party model) — quem existe no sistema

Tudo é uma `party` (pessoa OU organização) com 1+ `party_roles`. Papel mora na **relação**.

| Papel (`role_type`) | Paga assinatura? | Paga comissão? | Aprovação? | Onboarding |
|---|---|---|---|---|
| **tenant** (assessoria/clube) | depende do plano | — | não (self-service) | §3.1 |
| **event_organizer** | não | — | verificação CNPJ p/ reivindicar | §3.5 |
| **sponsor_*** (marca) | sim (cota) | opcional (cupom) | **sim — curadoria** | §3.3 |
| **supplier_*** (fornecedor) | sim (Vitrine R$99) | % no marketplace (futuro) | **sim — KYC/KYB** | §3.4 |
| **service_provider** | não | fee/ % (ponte) | sim | futuro |
| **corredor** (athlete) | **não** (grátis) | — | não | entra via convite do tenant |

> Pessoas **dentro** de um tenant têm papel por `membership` (§5), não `party_role`.

---

## 2. Planos & Preços (semente do banco)

> `amount_cents` + `currency='BRL'`. Cobrança via `subscriptions`. `founder=true` trava preço 2 anos.

### 2.1 Assessorias (`audience=tenant`)
| code | nome | recorrência | preço | features-chave |
|---|---|---|---|---|
| `free` | Grátis | none | R$ 0 | site `retake.run/{slug}`, 6 paletas, leads, faixa de marcas, vitrine de fornecedores. **Não** aparece na vitrine pública. |
| `apoiador` | Apoiador | annual / biennial | R$ 29/mês (anual) · R$ 19/mês (bienal) | + vitrine pública, white-label, domínio próprio, métricas, **loja própria**, até 3 eventos |
| `membro` | Membro | annual / biennial | R$ 59/mês (anual) · R$ 39/mês (bienal) | + site bespoke (feito pela retake), **sem marcas**, até 5 programas online, **voto no roadmap**, acesso antecipado |

### 2.2 Marcas / patrocínio (`audience=sponsor`)
| code | nome | recorrência | preço | escopo |
|---|---|---|---|---|
| `sponsor_estadual` | Estadual | annual (3x) / quarterly (3x) | R$ 100/mês **por estado** (soma vários) | faixa + página de marca nos sites do(s) estado(s); cupom sem aprovação; 1 post |
| `sponsor_nacional` | Nacional | annual (12x) / quarterly (3x) | R$ 500/mês | rede inteira + destaque na área de cupons |
| `sponsor_oficial` | Oficial | sob proposta | negociado (1 vaga/categoria) | exclusividade de categoria, selo licenciável, naming, preferência na renovação |
| — | **Cupom/Afiliado** | — | **receita da retake** (não cota) | retake cura via AWIN/Rakuten/direto; marca menor *solicita* entrada |

> Regras patrocínio: mínimo 3 meses pago antecipado; logo+descrição+link em 7 dias; **founder** trava 2 anos.

### 2.3 Fornecedores (`audience=supplier`)
| code | nome | recorrência | preço |
|---|---|---|---|
| `b2b_vitrine` | Vitrine B2B | monthly | R$ 99/mês — perfil no diretório, badge, botão de orçamento. retake não interfere na negociação. |

### 2.4 Serviço de tráfego pago (não é plano de plataforma — serviço)
| code | nome | cobrança | preço |
|---|---|---|---|
| `traffic_starter` | Starter | one_time | R$ 490 (setup + 1 mês) |
| `traffic_pro` | Pro | monthly | R$ 390/mês (gestão contínua) |
> Verba de anúncio é à parte (paga às plataformas). Sem fidelidade no Pro.

---

## 3. Onboarding por entidade/plano

> Cada fluxo termina criando `party` + `party_role` (+ `tenant`/`subscription` quando aplica).
> Telas-alvo: `ui_kits/auth/index.html` e `ui_kits/tenant-site/onboarding.html`.

### 3.1 Tenant — Grátis
1. Cria conta (e-mail/Google) → `party(kind=organization)` + `auth.users`.
2. Escolhe **Grátis**.
3. Dados: nome, CNPJ (opcional no grátis?), cidade.
4. **Onboarding do site** (`onboarding.html`): slug (`retake.run/{slug}`, valida `slug_blocklist`), tema (6 paletas), conteúdo básico.
5. Publica → site no ar. `subscription(plan=free, status=active)`.
- **Sem aprovação.** Anti-abuso assíncrono (§4.3).

### 3.2 Tenant — Apoiador / Membro
1. Igual ao grátis até escolher o plano.
2. **Pagamento** (cartão/Pix) → `subscription(status=active)`, marca `founder` se aplicável.
3. Apoiador: libera vitrine pública, domínio próprio, loja, eventos.
4. Membro: agenda **construção do site bespoke** pela retake (tarefa interna) + libera voto/programas.

### 3.3 Sponsor (marca) — **com aprovação**
1. Vem de `/patrocinio` → "Falar com a gente" ou cadastro.
2. Cria `party(kind=organization)` + `party_role(sponsor_*, status=pending)`.
3. Escolhe cota (Estadual+UFs / Nacional / Oficial-proposta).
4. **Fila de aprovação** (admin §4.1): valida CNPJ, marca, cupom (se houver ≥ -10%).
5. Aprovado → `subscription(active)` + `sponsorship` + entra na `brand_placements` (faixa).
6. Envia logo/descrição/link em até 7 dias (lembrete automático).

### 3.4 Supplier (fornecedor) — **com KYC/KYB**
1. Vem de `/empresas` → cadastro Vitrine B2B.
2. `party_role(supplier_*, status=pending)` + dados fiscais.
3. **Fila KYC** (admin §4.1): CNPJ ativo, capacidade de entrega, (amostra?).
4. Aprovado → perfil publicado na vitrine + `subscription(b2b_vitrine, active)`.
5. (Futuro) cadastro de catálogo + subconta de gateway p/ split.

### 3.5 Organizador de evento
1. `/eventos/publicar` → lista evento **sem conta obrigatória** (sugestão entra na fila §4.2).
2. Para **gerenciar** (lotes/inscritos): **reivindicar evento** → verificação **CNPJ** → vira `event_organizer` verificado.

### 3.6 Corredor (atleta)
- **Sem onboarding de venda.** Entra via **código de convite** do tenant (app). Cadastro + anamnese. Sempre grátis.

---

## 4. Aprovações (quem aprova o quê) — console admin (`ui_kits/admin/`)

### 4.1 Fila de cadastros (KYC/curadoria)
- **Patrocinadores/cupons:** CNPJ ativo, marca adequada, cupom ≥ -10% (se houver), pagamento antecipado. → aprovar / rejeitar.
- **Fornecedores:** CNPJ + KYC/KYB, capacidade de entrega. → aprovar / rejeitar.
- Estados: `pending → active | rejected`. Log em `audit_log`.

### 4.2 Moderação de eventos (anti-fake)
- Fontes: `managed` (auto-publica) · `imported` (curado) · `suggested` (fila).
- Checagens: link na **whitelist** de inscrição, **CNPJ** do organizador, **dedup**, **denúncias**.
- Ações: publicar / rejeitar / **fundir** / verificar organizador. Auto-despublica com 3+ denúncias.

### 4.3 Anti-abuso do grátis
- Verificação assíncrona (WhatsApp/Instagram/CREF) para novos sites grátis.
- **Sites ociosos** (sem acesso/lead em N dias) → avisar → arquivar.

### 4.4 Curadoria de catálogo / faixa de marcas
- Quais produtos a rede aceita; ordem e posições fixas da faixa de marcas (inventário de mídia).

---

## 5. RBAC — papéis dentro do tenant (quem pode o quê)

> `memberships(tenant_id, party_id, role, permissions jsonb)`. Autorização = **Actor (user+tenant)
> → Action → Resource**, escopada por tenant. Checagem no topo da árvore (tenant→grupo→aluno→treino).
> Tela-alvo: Dashboard → Configurações → Equipe & permissões.

### 5.1 Matriz de papéis (default)
| Recurso / Ação | owner | coach | finance | reception | marketing | athlete | lead |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Configurações do tenant / billing | ✅ | — | ver | — | — | — | — |
| Equipe & permissões (convidar) | ✅ | — | — | — | — | — | — |
| Site & vibe coding | ✅ | — | — | — | ✅ | — | — |
| Captação / leads (CRM) | ✅ | — | — | ✅ | ✅ | — | — |
| Atletas (cadastro/anamnese) | ✅ | ✅ (seus) | — | ✅ | — | próprio | — |
| Treino (prescrever/biblioteca) | ✅ | ✅ (seus) | — | — | — | ver próprio | — |
| Agenda / turmas / check-in | ✅ | ✅ | — | ✅ | — | ver/inscrever | — |
| Financeiro / cobrança | ✅ | — | ✅ | — | — | própria | — |
| Comissões | ✅ | — | ✅ | — | — | — | — |
| Comunidade (moderar) | ✅ | ✅ | — | — | ✅ | participar | — |
| Eventos (criar interno/público) | ✅ | ✅ | — | ✅ | ✅ | inscrever | — |
| Loja / produtos | ✅ | — | ✅ | — | ✅ | comprar | — |
| Marketplace (mostrar/ocultar) | ✅ | — | ✅ | — | ✅ | — | — |

- **owner/admin:** tudo. **coach:** treino/atletas/agenda dos *seus* alunos. **finance:** financeiro/comissões/billing (ver). **reception:** captação/agenda/check-in. **marketing:** site/comunidade/vitrine/campanhas. **athlete:** acesso via app ao próprio treino/dados. **lead:** sem login (pré-conversão).
- `permissions jsonb` permite override fino por membership sem criar papel novo.

### 5.2 Escopo de dados (crítico p/ RLS)
- Toda query filtra por `tenant_id` do JWT. **Nunca** cruza tenants.
- `coach` vê só alunos do(s) grupo(s) dele (escopo `group_id`).
- `athlete` vê só os próprios dados.
- Admin da **retake** (staff) é papel de **plataforma** (`party_role scope=platform`), fora do RBAC do tenant — acessa o console admin, não o dashboard do tenant.

---

## 6. Resumo para o schema (o que vira tabela)

- `public.plans` (audience, code, contract) + `public.prices` (recurrence, amount_cents) + `public.plan_features` + `public.features` (lookup).
- `public.subscriptions` (tenant/party, plan, status, founder, founder_locked_until).
- `public.party_roles` (status pending/active) — driver das aprovações.
- `public.memberships` (role enum + permissions jsonb) — driver do RBAC.
- `public.approval_queue` (ou usa `party_roles.status` + view) para KYC.
- `run.event_moderation` para fila de eventos.
- Tudo com RLS por `tenant_id` do JWT. Mutação via RPC `SECURITY DEFINER`.

> **Preço/plano nunca no front.** O front lê de `plans/prices` e renderiza. Mudança de preço = update no banco, zero deploy.

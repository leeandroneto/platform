# 0035. UX de feature gating: visible + badge PRO + paywall

Date: 2026-05-18
Status: accepted

## Context

ADR-0034 definiu entitlements model (gate server + sheriff + lint). Falta decidir
**como o gate APARECE na UI** pro usuário com plano que não tem a feature.

3 patterns conhecidos:

| Pattern                | UX                                                  | Conversão | Descoberta                       |
| ---------------------- | --------------------------------------------------- | --------- | -------------------------------- |
| **Hidden**             | Botão some quando plano não tem                     | Limpo     | 0% (usuário não sabe que existe) |
| **Disabled + tooltip** | Botão visível, opaco, tooltip "PRO"                 | Médio     | Alta                             |
| **Visible + paywall**  | Botão clicável, abre modal explicando + CTA upgrade | Mais alta | Alta                             |

Pendo/Productboard 2024 study (B2B SaaS):

- Hidden: perde **~80% do upsell** vs visible variants
- Disabled + tooltip: ~2-3× upsell vs hidden
- Visible + paywall: ~3-5× upsell vs hidden, mas pode irritar se feature é core
  do dia-a-dia (usuário clica esperando funcionar)

Sem decisão formal, cada feature vira pattern diferente — confusão visual + UX
inconsistente.

## Decision

Pattern canônico por **tipo de feature**, não por preferência ad-hoc:

### Tipo A — Feature niche (chatbot, automations, white-label full)

**Visible + badge PRO + paywall modal no clique.**

- Botão na nav/sidebar/menu sempre visível
- Badge "PRO" (ou nome do plano: "B+", "C") posicionado canto superior direito
- Click → abre `<PaywallModal feature="chatbot" />` que mostra:
  - Screenshot/preview da feature
  - 3 bullets de benefício
  - CTA "Ver planos" → `/upgrade?feature=chatbot&from=<plano-atual>`
  - Link secundário "Falar com vendas"

Máximo upsell + descoberta. Usuário niche descobre que existe.

### Tipo B — Feature core que prof usa diariamente (custom_domain, branded_pwa)

**Visible + badge PRO + tooltip no hover (não modal).**

- Botão sempre visível
- Badge "PRO" no canto
- Hover (desktop) ou long-press (mobile) → tooltip:
  - "Disponível no Pacote B" + ícone info que abre modal completo opcional
- Click no botão principal não bloqueia — segue pra tela mas com banner "feature
  limitada" + CTA upgrade ao tentar usar

Permite preview, evita frustração de "cliquei e não funciona".

### Tipo C — Quota numérica (max_programs, max_clients)

**Sempre visible, banner quando perto do limite.**

- Sem badge no botão (feature em si é gratuita)
- Banner sticky no topo da tela `/programs`:
  - "8 de 10 programas usados — upgrade pra Pacote B (50)"
  - X% progress bar
- Ao tentar criar 11º programa: modal "Limite atingido" + CTA upgrade

Convertibilidade vem da fricção real (quer criar mais, não pode).

### Mapeamento features → tipos

| Feature            | Tipo | Razão                                           |
| ------------------ | ---- | ----------------------------------------------- |
| `chatbot`          | A    | Niche, prof não usa diário, descoberta vale     |
| `automations`      | A    | Niche, complexa, paywall com preview ajuda      |
| `white_label_full` | A    | Niche premium, justifica investimento           |
| `custom_domain`    | B    | Core, prof quer testar como fica antes de pagar |
| `branded_pwa`      | B    | Core, prof quer ver branded preview             |
| `ai_assessment`    | A    | Niche, mostra IA generating preview             |
| `max_programs`     | C    | Quota, fricção orgânica é melhor CTA            |
| `max_clients`      | C    | Quota                                           |
| `max_storage_gb`   | C    | Quota                                           |

Adicionar feature nova = decidir tipo (A/B/C) no `plan-gates.ts`:

```ts
export const chatbotGate: FeatureGate = {
  feature: 'chatbot',
  requiredPlans: ['C'],
  upgradeFrom: ['A', 'B'],
  upgradeUrl: '/upgrade?feature=chatbot',
  quotaKey: null,
  uxPattern: 'A', // ← visible + paywall modal
  paywallCopy: {
    title: 'Chatbot IA personalizado',
    bullets: [
      'Atende alunos 24/7 com seu método',
      'Treinado em seus programas e exercícios',
      'Reduz dúvidas no WhatsApp em ~70%',
    ],
    previewImage: '/screenshots/chatbot-demo.png',
  },
}
```

### Componentes shared em `lib/entitlements/components/`

- `<EntitlementBadge plan="C" />` — badge "PRO" / "C" canto botão
- `<EntitlementGate feature="chatbot">` — wrapper que esconde/marca/intercepta
- `<PaywallModal feature="chatbot" />` — modal paywall completo
- `<QuotaBanner feature="max_programs" />` — banner topo quando próximo limite
- `<UpgradeCTA from="A" to="C" feature="chatbot" />` — CTA unificado

Toda feature usa esses 5 componentes — UI consistente sem reinventar.

### Animação Motion (ADR-0014)

PaywallModal abre com `motion/react`:

- Backdrop fade-in 200ms
- Modal slide-up + spring (spring `gentle` do `lib/design/motion.ts`)
- CTA pulsa sutilmente (attention sem irritar)

## Consequences

**Positivo:**

- 3 tipos cobrem todas features previsíveis dia 1 — não vira buffet de patterns
- `plan-gates.ts` declarativo: dev escolhe tipo, componentes shared fazem o resto
- Conversão upgrade ~3-5× vs hidden (Pendo 2024)
- Onboarding dev: "feature niche = tipo A, core = B, quota = C"
- Admin pode mudar `uxPattern` por plano sem deploy (feature toggleable)

**Negativo:**

- 5 componentes shared a manter (`<EntitlementBadge/Gate/PaywallModal/QuotaBanner/UpgradeCTA>`)
- Tipo B (preview parcial) é mais complexo de implementar — feature roda mas com banner
- Risco de over-marketing se PaywallModal aparecer demais — mitigar: rate limit 1x/sessão por feature
- `paywallCopy` precisa ser escrito por feature (não é genérico) — investimento marketing

**Neutro:**

- Componentes vivem em `lib/entitlements/components/` (não em `features/`) porque são cross-feature
- ESLint pode validar que `uxPattern` está declarado no `plan-gates.ts`
- A/B test futuro entre tipos (A vs B pra mesma feature) entra via feature flag JIT
- Sprint 1 (Pacote A) entrega `<UpgradeCTA>` + `<EntitlementBadge>` + `<PaywallModal>` (mesmo se só 1 feature ainda usar — primitive nasce pronta)

## Referências

- ADR-0034 (vertical slice + entitlements model)
- ADR-0008 (shadcn 100%) — componentes paywall via shadcn Dialog + Card
- ADR-0014 (Motion 12) — animações paywall via motion/react
- ADR-0016 (pipeline UI dia 0 expandido) — componentes entram na Tarefa 25.5
- Pendo State of Product Discovery 2024 — paywall vs hidden vs disabled benchmarks
- Stripe Billing entitlements UX patterns
- Notion upgrade modal pattern (referência visual)

## Histórico

| Data       | Mudança        | Aprovador |
| ---------- | -------------- | --------- |
| 2026-05-18 | Versão inicial | Leandro   |

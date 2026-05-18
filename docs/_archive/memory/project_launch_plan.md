---
name: Plano de Lançamento
description: Plano completo para terminar e lançar o onboarding.bio — código, infraestrutura, burocracia, marketing, 3 dias sem tokens
type: project
originSessionId: 440b7b42-ae95-4163-b309-a5a2483da768
---

# Plano de Lançamento — onboarding.bio

**Documento principal**: `docs/refactor/PLANO_LANCAMENTO.md`

## Estrutura de trabalho

- 3 camadas: Core Loop → Monetização → Polish
- Nunca polir antes do Core Loop estar sólido
- Cadência: segunda (planejamento) → terça-quinta (execução) → sexta (revisão)

## Auditorias em andamento

Em `docs/refactor/auditoria/`:

- A-E: técnica (rodaram em paralelo)
- F: completude das 74 páginas (pendente — rodar em terminal separado)
- CONSOLIDATE: rodar após A-E para gerar plano técnico

## 3 dias sem tokens — o que fazer

- **Dia 1**: burocracia (ME) + contas (Resend, Asaas, Vercel, Sentry, Upstash, Supabase prod)
- **Dia 2**: presença digital (Instagram, LinkedIn, YouTube, Product Hunt, Betalist) + conteúdo
- **Dia 3**: comunidades de PTs + beta users + legal + break-even financeiro

## Break-even

- Custos fixos: ~R$300/mês
- Break-even: 9 clientes Core (R$37)
- Meta mês 1: 10 clientes

## Sequência de launch

1. Esperar auditorias → rodar CONSOLIDATE
2. Rodar auditoria F
3. Sprint B (deploy)
4. 3 beta users → validação
5. Launch: Instagram + DM pra PTs + Product Hunt

---
name: Feature request
about: Nova feature ou melhoria
title: '[feature] '
labels: ['feature', 'triage']
assignees: []
---

## Outcome desejado

(O que o user consegue fazer DEPOIS que não conseguia ANTES)

## Quem pede

- [ ] Fundador (visão própria)
- [ ] Tenant específico (qual: \_\_\_)
- [ ] N tenants pediram (quantos: \_\_\_)
- [ ] Lead/prospect (perde sem isso)

## Princípio §39 check (ADR-0003)

- [ ] 1º cliente que precisa: \_\_\_ (nome do tenant ou "ninguém ainda")
- [ ] Manual aceito pra 1º? (S/N)
- [ ] Sprint imediato pós-1º: ferramenta entregue antes do 2º cliente

Sem cliente real pedindo + manual viável → **não construir agora** (rejeitado §39).

## Dependências entre camadas (blueprint/12-sprint-plan.md §0)

- [ ] Schema (`platform.<table>` se aplicável): \_\_\_
- [ ] Server Action: \_\_\_
- [ ] Edge Function (rodada local 3× antes prod): \_\_\_
- [ ] UI mobile-first 375px: \_\_\_

## Pacote afetado

- [ ] Pacote A (R$ 1.500)
- [ ] Pacote B (R$ 3.000)
- [ ] Pacote C (R$ 4.000)
- [ ] Plataforma interna (admin)

## ADR necessário?

- [ ] Não (decisão reversível)
- [ ] Sim (decisão one-way door) — número ADR: \_\_\_

## Esforço estimado

(S = 1-4h · M = 1-2 dias · L = 3-7 dias · XL = >1 semana)

S / M / L / XL: \_\_\_

---
name: Report depth and branching control
description: PT controls report depth (quick lead capture vs full anamnesis) and each specialty has conditional branches (by experience level, trimester, distance, etc)
type: feedback
originSessionId: d8dc29db-049d-4406-839e-307463de6f90
---

O profissional precisa controlar a PROFUNDIDADE do relatorio por especialidade:

- Quick (4-6 perguntas, 30s) = quiz de Instagram para captar leads
- Standard (8-12 perguntas, 2-3min) = avaliacao padrao
- Detailed (15-20 perguntas, 5-8min) = anamnese completa com dados sensiveis

**Why:** O mesmo PT pode usar o produto de formas diferentes. No Instagram quer conversao rapida. Na consultoria presencial quer um relatorio completo de anamnese. Nao e "um tamanho serve para todos".

**How to apply:** Cada pergunta e metrica do template tem `depthRequired`. O wizard filtra por depth em runtime. O prompt da IA recebe o depth e ajusta extensao/complexidade. O PT configura depth no dashboard.

Alem disso, cada especialidade tem BRANCHES (ramificacoes condicionais):

- Emagrecimento: por nivel de experiencia (iniciante muda pilares e tom)
- Gestante: por trimestre (1o/2o/3o/pos-parto muda tudo)
- Corrida: por distancia-alvo (5K vs maratona muda zonas e pilares)
- CrossFit: por objetivo (fitness vs competition muda profundidade)

Branches ativam/removem perguntas, mudam metricas, ajustam pilares e arco narrativo.

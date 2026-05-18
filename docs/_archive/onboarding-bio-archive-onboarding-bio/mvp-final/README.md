# MVP Final — Entrega 1

> **Foco:** primeira entrega que sustenta o lançamento do beta dos 30 fundadores.
> **Componentes:** formulário do prospect + relatório IA + site público + dashboard básico de gestão.
> **Critério:** funil convertendo de ponta a ponta com fricção mínima e copy alinhada à proposta beta (não ao "produto pronto").
> **Iniciado:** 2026-05-05.

---

## Documentos

1. [`01-formulario-mapa.md`](./01-formulario-mapa.md) — mapa atual das 60 perguntas + proposta v2 conservadora (~38 perguntas)
2. [`02-relatorio-fluxo.md`](./02-relatorio-fluxo.md) — análise de como funciona o relatório IA hoje (5 atos) + proposta MVP
3. [`03-decisoes.md`](./03-decisoes.md) — log de decisões cravadas (preencher conforme aprovações)

---

## Princípios

- **Não tirar perguntas demais.** A IA depende de contexto pra gerar relatório de qualidade. Cortar agressivo barateia o output.
- **Cortar copy/storytelling de "produto pronto"** — substituir por linguagem beta ("você é fundador", "seu input molda").
- **Manter os 5 atos do relatório** (`conta_da_hora`, `gap`, `radar`, `vazamentos`, `gargalos`) — são uma narrativa coesa cravada no schema da IA. Mexer aqui significa retreinar prompt.
- **Site MVP enxuto** — cortar Stats/Ticker/Results/Testimonials (fundador não tem material ainda). Manter Hero/About/Experience/Plans/QuickCta/FAQ.
- **Dashboard 8 rotas** — esconder CRUDs avançados do menu (vão pra Wave 16).

---

## Estado mapeado (2026-05-05)

| Componente              | Hoje                        | Plano MVP      | Variação    |
| ----------------------- | --------------------------- | -------------- | ----------- |
| Perguntas formulário    | 60 (10 blocos)              | ~38 (8 blocos) | -37%        |
| Atos do relatório       | 5 (+ Hero, Bridge, Closing) | 5 (mantido)    | 0           |
| Sections do site        | 11                          | 6              | -45%        |
| Sections /comecar       | 16                          | 6-8            | -50% a -62% |
| Rotas no menu dashboard | 30+                         | 8              | -73%        |

---

## Decisões pendentes

Ver [`03-decisoes.md`](./03-decisoes.md). Todas as cortes propostas em `01-formulario-mapa.md` e `02-relatorio-fluxo.md` precisam de "OK" do fundador antes de virar migration/código.

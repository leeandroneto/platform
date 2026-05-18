# \_archive — referência histórica read-only

> **Claude NÃO lê esta pasta por padrão.** Só consulta quando você apontar explicitamente.
> Decisão: `docs/blueprint/14-docs-lifecycle.md §11` + `docs/blueprint/18-transferencia.md §4`.

## Conteúdo

| Path                      | O que é                                                   | Quando consultar                                            |
| ------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| `master-plan-original.md` | Master plan ~6.631 linhas (todas as decisões D-G1..D-G76) | Quando precisar contexto histórico de decisão pré-bootstrap |
| `pesquisas/01-16.md`      | 16 pesquisas de fundação (UI/UX, prompts, lint, PWA, etc) | Quando ADR cita "pesquisa NN §M" e precisar do detalhe      |
| `proposta_desafit.html`   | Canon comercial (preços, pacotes, copy)                   | Quando atualizar landing institucional                      |
| `mockup-desafit.png`      | Canon visual                                              | Quando recriar telas do produto                             |
| `memory/`                 | Memórias do Claude Code do onboarding-bio                 | Quando precisar lembrar decisão histórica não migrada       |

## Hierarquia (lembrete)

ADR > Blueprint > Master Plan (arquivado aqui) > Memória

Se algo no master plan parece errado/desatualizado vs blueprint atual → **blueprint ganha**. Não corrigir master plan (imutável).

## Como apontar pra Claude consultar

Exemplo:

> "Consulte `docs/_archive/pesquisas/03-engenharia-de-prompt.md §6` pra decidir como estruturar o prompt do generate-assessment."

Sem apontar explicitamente, Claude ignora esta pasta inteira.

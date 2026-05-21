# Planos ativos

> Última atualização: 2026-05-20

## Convenção

- **1 arquivo = 1 plano** com nome descritivo (sem prefixos cronológicos tipo "DIA-0")
- **Header obrigatório** com status: `ativo | pausado | concluído`
- **Bloqueia / Bloqueado por:** dependências explícitas
- Planos arquivados ficam em `docs/_archive/plans/`

## Planos ativos

| Plano              | Status           | Bloqueia                | Bloqueado por              |
| ------------------ | ---------------- | ----------------------- | -------------------------- |
| `design-system.md` | 🟢 ativo (Dia 2) | `funil-agencia.md`      | nada                       |
| `funil-agencia.md` | ⏸️ pausado       | M2 (1º tenant Pacote A) | `design-system.md` Passo 8 |

## Próximo a executar

`design-system.md` Passo 3+ (cravar decisões + implementação).
`funil-agencia.md` retoma quando design-system Passo 8 fechar.

## Planos arquivados

Ver `docs/_archive/plans/README.md`:

- `dia-0-bootstrap.md` — fechado 2026-05-18 (ADR-0040 cravou)
- `2026-05-18-PLANO-FECHAMENTO-DIA-0.md` — versão anterior do dia 0
- `2026-05-18-SESSION-DUMP.md` — working notes session
- `2026-05-PHASE-A-FINAL.md` — fase A bootstrap (F1+F2 done)

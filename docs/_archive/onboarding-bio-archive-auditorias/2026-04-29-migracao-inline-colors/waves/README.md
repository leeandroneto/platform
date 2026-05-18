# Waves — Fase 21

## Ordem de execução

| Wave | Categoria                         | Paralelizável | Ocorrências |
| ---- | --------------------------------- | ------------- | ----------- |
| 01   | color (texto)                     | ✅ sim        | ~55         |
| 02   | background/backgroundColor        | ✅ sim        | ~45         |
| 03   | borderColor/border                | ✅ sim        | ~11         |
| 04   | allowlist CSS vars (documentação) | ❌ sequencial | ~30 linhas  |

Waves 01-03 são paralelizáveis (categorias geralmente em arquivos diferentes).
Wave 04 é sequencial no fim (documentação + comentários).

## Pré-requisito

Antes das waves: adicionar tokens semânticos ao globals.css:

- `--color-success`
- `--color-warning`
- `--color-whatsapp`
- `--color-score-high`, `--color-score-mid`, `--color-score-low`, `--color-score-info`

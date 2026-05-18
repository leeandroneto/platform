# Design systems — referências de mood

Snapshot de [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (71 design systems, gerados pela Google Stitch). Clonado raso 2026-05-18.

## Uso — princípio único

**Referência APENAS de mood, hierarquia, density e espaçamento.** NUNCA copiar tokens literais (cores hex, fontes específicas, pixels exatos).

Tokens do projeto vêm do **banco runtime** via `/api/{tenants,brands}/[id]/theme.css` — multi-marca white-label. Copiar `#533afd` da Stripe quebra o sistema.

Detalhes operacionais: `.claude/rules/design-references.md`.

## Estrutura

```
<brand>/
  DESIGN.md     ← descrição YAML+texto do sistema (9 seções)
  README.md     ← preview/instruções da marca específica
```

## Atualização

Snapshot upstream, não submodule. Pra atualizar:

```bash
# Re-clone shallow, diff manual, commit do snapshot novo
git clone --depth 1 https://github.com/VoltAgent/awesome-design-md.git /tmp/awesome-design-md
diff -r /tmp/awesome-design-md/design-md docs/references/design-systems/
# aplicar mudanças desejadas, commit
```

## Atribuição

Conteúdo upstream: licença CC0 (`LICENSE.upstream`).
Marca pertence ao titular respectivo — uso aqui é descritivo/referência, não distribuição.

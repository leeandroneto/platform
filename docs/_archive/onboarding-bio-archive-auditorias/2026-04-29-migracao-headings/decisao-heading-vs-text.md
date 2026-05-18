# Decisão de migração: `<Heading>` vs `<Text>`

Para cada ocorrência, decidir:

## É `<Heading>` (semântico — anuncia seção da página)

- Está dentro de `<header>`, `<main>`, `<section>`, `<article>`, `<aside>` definindo hierarquia da página
- Aparece no outline da página (ferramenta de a11y mostra como heading)
- Leitor de tela navegando "próximo heading" deve parar aqui

→ Migrar pra `<Heading level={N}>`. Decidir N pelo contexto:

- `level={1}`: título único da página (h1)
- `level={2}`: seção principal (h2)
- `level={3}`: subseção (h3)
- `level="display"`: hero display text (maps to h1 tag)
- etc.

## É `<Text>` (apenas estilo — não tem função de outline)

- Aparece em card, badge, label, tooltip, toast
- Não está em hierarquia semântica de página
- Leitor de tela não deve tratar como navegação

→ Migrar pra `<Text variant="body|label|micro|muted">` com `as` tag se necessário.

## Casos delicados

- **Section eyebrow** (`text-xs uppercase tracking-widest text-muted-foreground`): se divide seções da página → `<Heading>`, se é apenas label decorativo → `<Text variant="label">`
- **Modal/Dialog title**: verificar se Dialog.Title já aplica aria semantics. Se sim → `<Text>`. Se não → `<Heading level={2}>`
- **Card title em lista**: geralmente `<Heading level={3}>` se cada card é uma seção; `<Text>` se é só label
- **Skeleton/placeholder**: `<Text>`

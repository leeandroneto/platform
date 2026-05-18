# Auditoria: migração de headings

**Data:** 2026-04-29
**Fase:** 20

## Estado inicial

- **186 violações** de `no-direct-heading` (warning ativo) — contagem real menor que as 308 estimadas originalmente
- Componente `<Heading level={1-6|"display">` existe em `components/ui/heading.tsx`
- Componente `<Text variant="body|label|micro|muted|...">` existe em `components/ui/text.tsx`

## Categorias auditadas

1. **Heading semântico real** → `<Heading level={N}>` — anuncia seção da página, leitor de tela navega aqui
2. **Texto estilístico** → `<Text variant="...">` — card title, label, tooltip, sem hierarquia de página
3. **Casos delicados** — modal title, card title em lista, section eyebrow — decisão caso a caso

## Waves

| Wave | Área                      | Violações | Status |
| ---- | ------------------------- | --------- | ------ |
| 01   | Marketing & public static | ~76       |        |
| 02   | Internal / Dashboard      | ~82       |        |
| 03   | Public flows & funnel     | ~21       |        |
| 04   | Reusable UI components    | ~2        |        |

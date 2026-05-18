# Auditoria: revisao dos buttons excluidos + gap motion.button

**Data:** 2026-04-29
**Fase:** 22

## Contexto

Durante a "Fase 04" antiga, 5 `<button>` foram excluidos da regra `no-raw-button` com justificativas que precisam ser auditadas. Alem disso, o ESLint selector `JSXOpeningElement[name.name='button']` nunca capturou `<motion.button>` (member expression), criando um gap silencioso de ~17 arquivos.

## Descoberta real

| Categoria                              | Contagem                 | Status                        |
| -------------------------------------- | ------------------------ | ----------------------------- |
| Raw `<button>` (5 excluidos no eslint) | 5 arquivos               | Auditados                     |
| `motion.button` (gap no selector)      | 17 arquivos (~20 usages) | Auditados                     |
| `<button>` em `components/ui/`         | ~15 arquivos             | Ignorados (sao DS primitives) |
| **Total que precisa decisao**          | **22 arquivos**          |                               |

## Decisoes resumo

| Arquivo                     | Tipo                    | Decisao                                |
| --------------------------- | ----------------------- | -------------------------------------- |
| global-error.tsx            | `<button>`              | KEEP — zero-dependency fallback        |
| SimulationTabs.tsx          | `<button>`              | MIGRATE → `<Button variant="ghost">`   |
| ProfilePhoto.tsx            | `<button>`              | KEEP — upload area com aspect-ratio    |
| BackgroundPhoto.tsx         | `<button>`              | KEEP — upload area com aspect-ratio    |
| Checkout.tsx                | `<button role="radio">` | MIGRATE → `RadioGroupPrimitive`        |
| 11 files selection pattern  | `motion.button`         | MIGRATE → `<SelectionCard>` (D76)      |
| 6 files genuinamente unicos | `motion.button`         | KEEP — CTAs, links, FAB, template grid |
| 2 files components/motion/  | `motion.button`         | KEEP — motion primitives (ignores)     |

## Acoes

1. Criado `<SelectionCard>` em `components/ui/selection-card.tsx` (D76)
2. Adicionado selector ESLint para `motion.button` (member expression)
3. Removidas file-level ignores dos 5 arquivos originais
4. `components/motion/**` adicionado ao ignores (sao primitives do DS)
5. 11 motion.button migrados pra SelectionCard (zero exceptions necessarias)
6. 8 exceptions restantes com `// eslint-disable-next-line` + razao nominada unica

## Arquivos da auditoria

- [decisao-por-button.md](decisao-por-button.md) — decisao detalhada por arquivo
- [excecoes-atuais.md](excecoes-atuais.md) — estado do eslint.config antes/depois
- [localizacao-buttons.md](localizacao-buttons.md) — linha exata de cada button
- [waves/wave-01-decidir-aplicar.md](waves/wave-01-decidir-aplicar.md) — wave de execucao

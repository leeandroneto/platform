---
name: Design references — awesome-design-md (71 design systems)
description: APENAS referência de mood/spacing/hierarchy/density. NUNCA copiar tokens literais (hex, fonts específicas). Tokens vêm do banco runtime via theme.css.
paths:
  - 'app/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'components/app-*.tsx'
---

## Princípio

`docs/references/design-systems/` tem 71 DESIGN.md de marcas grandes (Apple, Stripe, Linear, Notion, Vercel, etc — fork shallow do [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)).

**Use APENAS como referência conceitual** — mood, hierarquia visual, density, ritmo de espaçamento. **NUNCA copie tokens literais.**

## Por quê separar mood ↔ tokens

Projeto é **multi-marca white-label**. Tokens (cor/font/shape) vêm do **banco runtime** via `/api/{tenants,brands}/[id]/theme.css`. Cada tenant tem identidade própria. Copiar `#635BFF` da Stripe quebra o white-label silencioso E é bloqueado por hook (`block-token-bypass.sh`) + ESLint (`design-tokens/no-tailwind-bypass`).

| O que USAR do DESIGN.md                           | O que IGNORAR                                            |
| ------------------------------------------------- | -------------------------------------------------------- |
| "Whitespace generoso" / "Densidade alta"          | Cores hex literais (`#1c1e54`)                           |
| "Hierarquia tipográfica forte (3 níveis)"         | Fonte específica (`Sohne`, `Inter Display`)              |
| "Sombra discreta única + bordas sem radius alto"  | Radius pixel-perfect (`border-radius: 6px`)              |
| "Scroll cinematográfico com seções largas"        | Animation curves exatas (`cubic-bezier(0.4, 0, 0.2, 1)`) |
| "Grid 12 colunas, gap 24px, padding lateral 32px" | Breakpoints em px literal — usa Tailwind tokens          |
| "Densidade dashboard alta tipo Linear"            | `font-family: -apple-system, ...`                        |

## Quando consultar

| Surface                               | Marca de referência (sugestões — não obrigatórias)           |
| ------------------------------------- | ------------------------------------------------------------ |
| Landing pública de tenant (Etapa JIT) | Stripe (trust SaaS), Linear (clean minimal), Vercel (dev-y)  |
| Dashboard admin profissional          | Linear, Notion, Supabase                                     |
| PWA aluno (mobile-first)              | Apple HIG via apple/, Notion (organic), Spotify (engagement) |
| Marketing/landing brand-pai (legal)   | Apple, Stripe, Anthropic                                     |
| Email transactional                   | Notion (calmo), Linear (estruturado)                         |
| Onboarding/quiz                       | Cal, Tella, Lovable                                          |

## Workflow ao implementar feature

1. **Decide marca de referência** baseado em surface + brand identity
2. **Lê `docs/references/design-systems/<brand>/DESIGN.md`** — foca nas seções 1 (Theme), 4 (Component Stylings — só padrões), 5 (Layout), 6 (Depth), 7 (Do's/Don'ts), 8 (Responsive)
3. **Extrai SÓ princípios** — verbos, adjetivos, ratios, conceitos. Nunca pixels, hex, fontes
4. **Implementa** usando tokens do projeto (`bg-primary`, `text-foreground`, `rounded-md`, `var(--shape-*)`) — Claude obedece via CSS vars do tenant
5. **Adiciona marker** no top do arquivo: `// RESEARCH: shadcn primitive + design ref docs/references/design-systems/<brand>/DESIGN.md (mood: ...)`

## Lista das 71 marcas disponíveis

Categorias gerais (consulte `docs/references/design-systems/` pra lista completa):

- **AI:** anthropic, cohere, claude, elevenlabs, midjourney equivalente, minimax, mistral.ai, ollama, opencode.ai, openai equivalente, replicate, runwayml, together.ai, x.ai
- **Dev tools:** cursor, expo, framer, github equivalente, hashicorp, linear.app, lovable, mintlify, mongodb, posthog, raycast, sanity, sentry, supabase, vercel, voltagent, warp
- **Fintech:** binance, coinbase, kraken, mastercard, revolut, stripe, wise
- **SaaS:** airtable, cal, clickhouse, composio, figma, intercom, miro, notion, resend, shopify, slack, superhuman, zapier
- **Consumer:** airbnb, apple, meta, netflix equivalente, pinterest, playstation, spotify, starbucks, tesla, uber, webflow, wired, x
- **Auto/luxo:** bmw, bmw-m, bugatti, ferrari, lamborghini, nike, renault
- **Outros:** clay, ibm, nvidia, sanity, theverge, vodafone

## Anti-patterns

| Anti-pattern                                               | Por quê                                                   | Substituto                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `style={{ color: '#533afd' }}` baseado em Stripe DESIGN.md | Hook `block-token-bypass.sh` bloqueia + perde white-label | `className="text-primary"` (CSS var do tenant)                   |
| Importar `font-family: Sohne` de Stripe                    | Brand do tenant decide fonte                              | Use `var(--font-sans)` ou `--font-brand`                         |
| Copiar shadow exato `0 4px 16px rgba(0,0,0,0.08)`          | Idem token bypass                                         | `shadow-sm`/`shadow-md` Tailwind ou `var(--shadow-*)` se existir |
| Forçar "scroll snap como Apple" pra TODAS as features      | Aesthetic não combina com tenant fitness                  | Aplica só onde faz sentido (landing de premium)                  |
| Misturar 3 DESIGN.md numa feature                          | Vira frankenstein visual                                  | 1 referência por surface                                         |
| Hardcode breakpoint `1140px` do Stripe DESIGN.md           | Tailwind tokens cobrem (sm/md/lg/xl)                      | `md:`/`lg:` Tailwind                                             |

## Condição de revisitar

| Gatilho                                                                                                                         | Ação                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Repo upstream lança nova marca relevante (ex: design system novo de Linear)                                                     | `git pull` em `docs/references/design-systems/` (manualmente — não é submodule) ou re-clone se mudou estrutura |
| Marca de referência usada vira contraditória ao brand atual (ex: tenant pediu "calmo Notion" depois mudou pra "agressivo Nike") | Refator: recolhe a aesthetic nova, NÃO mistura — feature inteira refatorada                                    |
| Stripe re-design quebra alinhamento da rule (ex: padrão muda)                                                                   | Re-pull. Não é fonte de verdade nosso — é snapshot                                                             |
| Cliente pede "queremos parecer Spotify" especificamente                                                                         | Use spotify/DESIGN.md como ref principal — documentar em ADR se virar tema persistente do tenant               |

## Não toque

- Arquivos `docs/references/design-systems/<brand>/DESIGN.md` não devem ser editados (são snapshots upstream)
- Quando atualizar: re-clone + diff manual + commit do snapshot novo
- `LICENSE.upstream` preserva atribuição original (CC0 do VoltAgent)

## Referências

- Repo upstream: https://github.com/VoltAgent/awesome-design-md (71K+ stars)
- Recomendação de uso: `docs/references/como-usar.md` (PT-BR — visão geral curta)
- `.claude/rules/design-tokens.md` — tokens canônicos do projeto (única fonte runtime)
- `.claude/rules/tenant-content.md` — landing strategy (mood vem daqui, copy vai pra banco)
- `.claude/rules/shadcn-zone.md` — wrapper pattern (componentes seguem mood ref mas usam primitive shadcn)
- ADR-0040 §H — APCA Silver (qualquer mood escolhido obedece thresholds de contraste)

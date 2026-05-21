# Sessão 2026-05-20 — Decisões design system (corrections + new)

> **Tipo:** decisões confirmadas nesta sessão. Ainda não em ADR.
> **Propagar para:** `docs/plans/design-system.md` + ADR quando terminar rodada de decisões.

---

## D-PALETTE — Paletas: 24 seeds, eixo independente

**Decisão:** 24 paletas — 1 por brand de referência (os 24 archetypes curados).

- Cada paleta = seed OKLCH extraído da cor primária/accent da marca + todos os 29 semantic roles derivados via tonal derivation
- Archetype tem 1 paleta **default** (a cor da marca de referência)
- Profissional pode **trocar** para qualquer outra paleta (ex: ama o archetype stripe mas a cor da marca é verde)
- Futuro: podem entrar mais paletas sem precisar de brand/archetype associado

**Invalida:** D-25/F1 do doc 30 ("manter 13 paletas atuais") e "Reduzir pra 6-8" do Passo 5 do plano.

---

## D-TYPOGRAPHY — Tipografias: 24 famílias, eixo independente

**Decisão:** 24 tipografias — 1 por brand de referência.

- Cada tipografia = fonte que a marca de referência usa → melhor equivalente gratuita (Google Fonts / open-source)
- Archetype tem 1 tipografia **default**
- Profissional pode **trocar** independentemente do archetype

**Invalida:** G1/D-23 do doc 30 (9 Google Fonts baseados no codebase existente, não nas brands).

---

## D-PHOTOGRAPHY — Photography: documentação no archetype, não enforcement

**Decisão:** photography é campo de **documentação/recomendação** no archetype config. Não é enforcement técnico.

- Archetype config tem campo `photography.style: 'full-bleed' | 'framed' | 'composite' | 'absent'`
- Orienta AI e dev — não obriga componente
- Componentes usam shadcn `<AspectRatio>` como utilitário opt-in quando necessário
- Nenhum builder (Webflow, Framer, Builder.io) nem vibe coder (v0, Lovable, Replit, Base44) enforça photography no componente — indústria trata como recomendação

**Fecha:** D-08 (photography: camada própria vs sub-propriedade do archetype).

---

## D-02 — 24 archetypes (formal close)

24 archetypes, 24 paletas (com 29 roles cada), tipografias = default do archetype (extraídas do DESIGN.md de cada marca). Profissional pode trocar paleta e tipografia independentemente.

## D-15 — Vocab oficial: `archetype`

`archetype` substitui `template` para design system. Cravar em `naming.md`.
`template` preservado para Page Engine / Form Engine (semântica diferente).

## D-27 — Photography: implementação

- Fase 1 (agora): campo `photography.style` no archetype config
- JIT: quando componentes forem criados, recebem classificação de photography junto

## Nota de processo

A partir daqui: toda decisão apresentada vem com recomendação explícita.

## F2 — Compatibility matrix: NÃO

Sem `recommendedPalettes[]` por archetype. Qualquer paleta com qualquer archetype, sem restrições. Complexidade desnecessária.

## G3 — Font loading

Todas as famílias declaradas no build via `next/font`. Preload = só as fontes do archetype ativo do tenant. Resto lazy (`preload: false`). Quantidade exata de famílias únicas determinada após extração das 24 DESIGN.md.

## D-40 — Budgets CSS + fonts

Manter budgets (250KB CSS + 200KB fonts). Lazy loading garante que só o archetype ativo carrega — boas práticas aplicadas.

## D-28 — Theme swap

Web: APCA gate antes de salvar → DB update + `theme_version++` → CSS endpoint nova URL → CDN invalida → `data-attrs` atualizam → CSS vars cascateiam sem reload.
PWA: gap documentado, JIT Sprint 14.

## D-16 — Clone-first legal

OK com 3 regras: nomes neutros no código, fontes proprietárias substituídas por equivalentes gratuitas, cores como valores OKLCH anônimos.

## D-38 — StatusBadge a11y

Cor + texto, radius do archetype. Ícone opcional. Satisfaz WCAG 1.4.1 (cor + 1 coisa basta).

## D-39 — forced-colors

Suporte básico JIT antes de primeiro cliente enterprise. ~1 dia de trabalho.

## D-11 — PWA manifest iOS

Manifest dinâmico. O que congela no iOS após install: só ícone/nome/splash (metadata). UI dentro do app atualiza normalmente. Não é blocker.
Futuro JIT: Capacitor se cliente pedir presença nativa real.

## Componentes — pós design system

Criação de componentes vem DEPOIS do design system completo + análise das 24 marcas.
Pendências:

- Limpar primitivos não usados vs pré-planejar o que entra com certeza
- Section templates + page templates (para vibe coding / editor visual / IA)
- Revisar rules (afrouxar ou apertar)
- Documentação de quando criar novo componente
- AppForm/AppToast/AppEntitlementGate revisão (mudou design system + maneira de trabalhar)

## Governança — adicionar novo archetype

`pnpm archetype:scaffold <name>` gera `lib/design/archetypes/<name>/index.ts` com template completo.
CI gate bloqueia PR se: APCA falhar, tokens obrigatórios faltarem, ou archetype não registrado em `registry.generated.ts`.

**Documentação obrigatória para novo archetype:**

- Fonte: qual DESIGN.md de referência
- Paleta default: seed OKLCH extraído da marca
- Tipografia default: fonte da marca + equivalente gratuita
- Photography style: `full-bleed | framed | composite | absent`
- Todos os 29 semantic roles mapeados (com FALLBACKs explícitos onde a marca não define)
- Dark mode suportado: `supportsLight | supportsDark | both`
- Density: valor documentado (compact / comfortable / spacious)

**MCP desde o início:**
Design system precisa de interface MCP para AI tools desde a concepção — não como addon.
Isso inclui:

- Query de tokens por archetype (`get_archetype_tokens`)
- Validação de combo archetype + palette + typography
- Geração de preview CSS para um tenant
- Listagem de archetypes disponíveis com metadata
- Storybook MCP já existe (`localhost:6006/mcp` em `.mcp.json`) — design system MCP complementa

## Decisões ainda pendentes

- Nenhuma identificada — rodada de correções concluída

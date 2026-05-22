---
name: Component creation governance — checklist A-J obrigatório por componente novo
description: Toda criação de componente passa por checklist 10 categorias (identidade / contrato Zod / multi-tenant fit / a11y / i18n / performance / storybook / testes / docs / registry-ready). Porta §15 do pivot arquivado.
paths:
  - 'components/**/*.{ts,tsx}'
  - 'lib/contracts/page-blocks/**/*.ts'
  - 'lib/contracts/form-blocks/**/*.ts'
  - 'lib/contracts/components/**/*.ts'
---

## Princípio

Consistência de longo prazo não vem de "boa vontade" — vem de **checklist
obrigatório** que TODO componente passa antes de merge. Não importa se o
projeto tem 5 ou 500 componentes; cada um nasce com o mesmo padrão.

**Quando aplica:** TODO componente novo criado em qualquer fase ou JIT —
primitive (shadcn add), wrapper composto (`components/app-*.tsx`), block
semantic L2 (`components/blocks/*`), smart block L3, vendor adapt
(`components/vendor/*`), feature-scoped (`features/*/components/`).

**Quem garante:** humano no PR + esta rule path-loaded + hook
`component-research-gate.sh` (ADR-0036, RESEARCH marker). Camadas de
enforcement automation são deferred — gatilhos cravados na tabela
"Condição de revisitar" abaixo.

---

## Checklist obrigatório (A-J) — porta §15.1 do pivot arquivado

Componente sem 1 item = PR bloqueado em review humano.

### A. Identidade do componente

- [ ] **Nome canônico** snake-case/kebab-case sem vocab banido (ver
      `.claude/rules/naming.md`)
- [ ] **Categoria** declarada: `primitive` (shadcn ui/) / `semantic` (L2
      block) / `smart` (L3 block composto + lógica + IA opcional)
- [ ] **Localização correta:**
  - `components/ui/*` — zona quarentenada shadcn (só via
    `npx shadcn add`, hook bloqueia Edit/Write)
  - `components/app-*.tsx` — wrappers compostos com valor agregado real
    (ADR-0040 §E + research-20 — passthrough proibido)
  - `components/blocks/*` — Page Engine L2/L3 (RSC default + JSDoc
    `@registry-meta` — invariante ADR-0045 D.13)
  - `components/vendor/*` — third-party copy-paste JIT (Origin UI, Kibo
    UI, Magic UI) com `// RESEARCH:` marker linha 1
  - `features/<name>/components/` — feature-scoped não-promovido
- [ ] **Versão semver** no header do arquivo (`v1.0.0` — bump major em
      breaking change)

### B. Contrato técnico (Zod obrigatório)

- [ ] **Props schema Zod** em `lib/contracts/components/<name>.ts` —
      SSOT, NÃO TS interface manual
- [ ] **Variants** declarados como union literal
      (`variant: 'primary' | 'secondary' | 'ghost'`)
- [ ] **Slots/children:** quais tipos aceita, quais NÃO (ex: `<Card>`
      não aceita `<Card>` aninhado)
- [ ] **Defaults explícitos** no schema (sem mágica)
- [ ] **TypeScript inferido do Zod** (`type Props = z.infer<typeof PropsSchema>`)
      — nunca duplicar manual

### C. Encaixe multi-tenant (CRÍTICO — fail aqui = quebra customização)

- [ ] **Tokens consumidos** listados explicitamente — devem ser
      **shadcn-canonical apenas** (`var(--primary)`, `bg-card`,
      `text-foreground`, etc). NUNCA hex/oklch hardcoded
- [ ] **Áreas customizáveis pelo tenant** mapeadas:
  - Cor primária → `--primary` (tenant define em `tenant_themes.snapshot`)
  - Cor de fundo → `--background` / `--card`
  - Fonte → `--font-sans` / `--font-serif` / `--font-mono`
  - Radius → `--radius`
  - Shadow → primitives derivados de 6 base tokens
- [ ] **Áreas imutáveis universais** mapeadas (vêm de `app/globals.css`,
      componente NÃO pode override):
  - Touch-min 44px, safe-area, z-index, motion durations, breakpoint 768px
- [ ] **Reação light/dark** validada em Storybook (G abaixo)
- [ ] **APCA Silver pass:** body Lc ≥75, large ≥60, non-text ≥45 —
      validado via `pnpm validate:apca`
- [ ] **Brand-agnostic:** zero `'desafit'` / `'yoga.app'` / `'ingles.app'`
      hardcoded. Sempre via `useBrand()` (ver `.claude/rules/brand.md`)

### D. Acessibilidade (não-negociável)

- [ ] **ARIA roles/labels** corretos (`<button>` não `<div onClick>`)
- [ ] **Keyboard navigation:** Tab, Enter, Esc, setas conforme aplicável
- [ ] **Focus visible** com `:focus-visible` ring (token `--ring`)
- [ ] **Screen reader:** alt em ícones, `aria-label` em controles sem
      label visível
- [ ] **Touch target ≥44px** em mobile (regra
      `no-vh-in-mobile-aware` + visual check)
- [ ] **Sem dependência de cor isolada** pra comunicar estado (erro =
      vermelho + ícone + texto, não só vermelho)

### E. i18n (ver `.claude/rules/i18n.md`)

- [ ] **Strings de chrome** via `t('namespace.key')` —
      `messages/<locale>/<namespace>.json`
- [ ] **Conteúdo do tenant** inline no spec JSONB (perguntas de form,
      copy de landing — NÃO `t()`)
- [ ] **Plurais** via ICU MessageFormat se aplicável
- [ ] **RTL ready** (sem `margin-left` literal — usar `me-*`/`ms-*`
      Tailwind logical properties)

### F. Performance

- [ ] **RSC default** — só vira Client Component (`'use client'`) com
      justificativa documentada no header (state, browser API, event
      handler que não pode subir)
- [ ] **Bundle impact medido** (`pnpm size` antes/depois) — se >5KB
      adicional, justificar
- [ ] **Lazy loading** quando aplicável (imports dinâmicos pra modais,
      dialogs heavy)
- [ ] **Streaming-friendly** (sem bloqueios síncronos no render)

### G. Storybook story obrigatória

- [ ] Arquivo `<name>.stories.tsx` co-localizado
- [ ] **Default story** com props mínimos
- [ ] **Todas as variants** (variant prop union literal)
- [ ] **Todos os estados** (hover, focus, disabled, loading, error)
- [ ] **Mobile + desktop viewport** (`parameters.viewport`)
- [ ] **Multi-preset matrix** (renderiza nos 5-7 presets) — DEFERRED
      Fase 8 (parte da Validation Suite Contínua) — JIT quando 1º
      componente entrar

### H. Testes

- [ ] **Vitest unit test** cobrindo props/variants/comportamento
- [ ] **Playwright snapshot visual** — DEFERRED, obrigatório a partir
      da Validation Suite Contínua (JIT)
- [ ] **APCA contrast test** via script — `pnpm validate:apca`
- [ ] **Coverage mínimo 70%** lines + branches no componente

### I. Documentação co-localizada

- [ ] **Header do arquivo** com: nome, versão (semver), categoria,
      propósito (1 linha), exemplos rápidos
- [ ] **Comentário Zod schema** explicando cada prop não-óbvia
- [ ] **MDX doc** opcional ao lado da story (`<name>.mdx`) com:
  - When to use
  - When NOT to use (anti-patterns)
  - Related components
  - Migration guide (se substitui outro)

### J. Registry-ready (cross-cutting ADR-0045 invariante D.13)

- [ ] **JSDoc `@registry-meta`** no arquivo `.tsx` formato canonical
      (ver `.claude/rules/registry-blocks.md` pra detalhe):

  ```ts
  /**
   * @registry-meta
   * {
   *   "kind": "...",
   *   "category": "primitive" | "page-block" | "form-block" | "smart-block",
   *   "version": "1.0.0",
   *   "description": "...",
   *   "examples": [...],
   *   "when_to_use": [...],
   *   "anti_patterns": [...],
   *   "related": [...],
   *   "vertical": null | "fitness" | "yoga" | "ingles"
   * }
   */
  ```

- [ ] Pronto pra entrar em `lib/generated/block-catalog.json` quando
      build script `scripts/build-block-catalog.ts` existir (DEFERRED —
      JIT 5+ block contracts; ver
      `docs/_deferred/v0-registry-integration-detail.md`)
- [ ] Pronto pra promover pra DB table `block_kinds_catalog` quando 3
      consumers gate disparar (ADR-0045 §3)

---

## Onboarding componente externo (porta §15.5 do pivot)

Componente vindo de fora (shadcn `npx shadcn add`, paste v0 — DEMOTED
per ADR-0045 D.1, copy TweakCN, Origin UI, Magic UI, Kibo UI) NÃO escapa
do checklist:

1. **Instalar** em `components/ui/*` (shadcn — via `npx shadcn add`,
   nunca Edit direto) ou em `components/vendor/<source>/`
2. **Auditoria imediata** contra checklist A-J:
   - Consome shadcn-canonical? (esperado SIM — caso contrário, abrir
     ADR justificando exceção)
   - APCA pass? (`pnpm validate:apca`)
   - Acessibilidade ok? (review manual + lint axe se aplicável)
3. **Se OK e wrapper agregando valor real:** criar
   `components/app-<name>.tsx` SÓ se passar critério de valor agregado
   (ADR-0040 §E — passthrough proibido)
4. **Wrapper passa pelo checklist A-J inteiro**
5. **Doc co-localizada** cita origem + license + commit hash

---

## Refactor componente legado (porta §15.6 do pivot)

Componente antigo (pré-pivot ou recém-criado sem disciplina) precisa
entrar no padrão **antes do PR que adiciona feature nova depender
dele**:

1. **Identifica gaps** via checklist A-J
2. **Cria sessão** `docs/_sessions/YYYY-MM-DD-refactor-<component>.md`
   listando gaps
3. **PR refactor SEPARADO** do PR feature (não mistura)
4. **Refactor PR:** adiciona Zod schema, story, test, doc — sem mudar
   comportamento
5. **Feature PR depois:** usa componente já compliant

---

## Enforcement automation (DEFERRED — JIT)

Camadas JIT (não criar agora, gatilhos cravados):

- **Hook `component-research-gate.sh` (ADR-0036)** ✅ EXISTE — bloqueia
  Write sem `// RESEARCH:` marker linha 1. Cobre marker check; NÃO
  duplicar com nova lint.
- **ESLint rule custom validando JSDoc `@registry-meta`** — DEFERRED.
  Criar JIT quando 5+ componentes existirem
- **CI gate fail PR sem knowledge card** — DEFERRED. User explicitamente
  pediu adiar (CI gates travam desenvolvimento). Promover de WARN →
  ERROR quando primeira feature paga em produção (research-39 Q3
  cravou)
- **Métricas saúde trimestral** (`pnpm component:metrics` script) —
  DEFERRED. Criar JIT quando 10+ componentes existirem (porta §15.7
  pivot original)

---

## Anti-burocracia

Cada item do checklist existe por **incidente passado ou risco
conhecido**:

- **Zod schema obrigatório** → fase anterior teve sub-schemas TS sem
  SSOT, virou bagunça (ADR-0044 contexto)
- **Multi-tenant fit explícito (C)** → archetype-bound wrappers
  quebraram quando tenant mudou (incidente pivot)
- **Storybook story (G)** → componentes sem story renderizam só "em
  produção" e bugs aparecem tarde
- **APCA test** → contraste é one-way door (legal compliance em alguns
  países)
- **Knowledge card (J)** → evita refactor cego quando registry catalog
  ganhar peso (princípio cross-cutting ADR-0045)

Se algum item parecer overhead, perguntar: **"que bug futuro esse item
previne?"** Se "nenhum claro" → discutir remoção em ADR. Não remover
por gut feeling.

---

## Condição de revisitar (formato ADR-0040 §L)

| Gatilho                                                                       | Ação                                                                                               |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **5+ componentes existirem com `@registry-meta`**                             | Criar ESLint rule custom validando JSDoc estrutural                                                |
| **10+ componentes existirem**                                                 | Criar `pnpm component:metrics` script (porta §15.7 pivot original — % com Zod / story / test ≥70%) |
| **Funil agência primeira feature paga em produção**                           | Promover CI gate de WARN → ERROR (research-39 Q3 cravou)                                           |
| **Origin UI / Magic UI / outro vendor adotado em 3+ features**                | Adicionar paths exception específicos em `eslint.config.mjs` pra namespace `components/vendor/*`   |
| **Componente do shadcn registry quebra checklist C (multi-tenant fit)**       | ADR explicita exceção OU não adopta                                                                |
| **Vertical 2 ativa (`yoga.app` ou `ingles.app`)**                             | Adicionar `vertical` enum no `@registry-meta` schema obrigatório                                   |
| **Validation Suite Contínua entra em escopo** (`docs/_deferred/validation-*`) | Mover G "multi-preset matrix" + H "Playwright snapshot" de DEFERRED pra obrigatório                |

---

## Referências

- **ADR-0040** §A-§F + §L — closure dia 0 (wrapper pattern + zona
  quarentenada + condição de revisitar)
- **ADR-0044** — pivot TweakCN / shadcn-canonical (interface obrigatória)
- **ADR-0045** — Registry Strategy (D.13 invariante + JSDoc format)
- **ADR-0046** — dogfooding-first execution order (princípio meta)
- **ADR-0036** — hooks PreToolUse JSON (`component-research-gate.sh`)
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` § 15 — origem desta
  rule (§15.1 A-J + §15.5 onboarding + §15.6 refactor portados)
- `.claude/rules/components.md` — hierarquia 3 categorias + wrapper
  pattern operacional
- `.claude/rules/shadcn-zone.md` — zona quarentenada + 20 primitives
- `.claude/rules/design-tokens.md` — ~45 keys shadcn-canonical
- `.claude/rules/brand.md` — `useBrand()` + multi-vertical
- `.claude/rules/i18n.md` — `t()` chrome vs JSONB tenant
- `.claude/rules/contrast.md` — APCA Silver dual-gate
- `.claude/rules/naming.md` — vocab banido
- `.claude/rules/abstractions.md` — princípio "3+ usos antes de
  abstrair"
- `.claude/rules/registry-blocks.md` — invariante D.13 + JSDoc format
  canonical

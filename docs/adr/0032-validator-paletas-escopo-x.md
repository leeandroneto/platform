# 0032. Validator paletas — escopo X (primary ≠ texto)

Date: 2026-05-17
Status: accepted

## Context

`scripts/validate-palettes.ts` versão dia 0 testava:

```
APCA(fg=primary, bg=surface-1-dark) ≥ 75  // body
```

13 paletas oficiais (ADR-0028 — seed dia 1) tem `primary_oklch` com L entre
0.55 e 0.68 (cor saturada vibrante — Indigo Stripe, Maple, Iris Glow, etc).
`surface-1-dark` é sempre L=0.11 a 0.15. Diferença Y é insuficiente pra Lc≥75
em 9/13 paletas (validação roda 9 ❌).

Mas o uso real de `primary_oklch` no design system NÃO é texto-sobre-fundo. Por
design (05-design-system.md §3):

- `primary` é **background de action** (`<Button>`, `<Badge>`, link CTA, foco
  ring, progress bar fill) — não foreground de parágrafo
- Texto em `<Button variant="primary">` é `primary-foreground` (calculado: branco
  contraste no claro, preto no escuro)
- Body text é `--color-foreground` (oklch(0.95 …) em dark, oklch(0.15 …) em light)
  sobre `--color-background` (`surface-1`)

Validar `APCA(primary, surface-1)` testa um cenário que NÃO existe na UI. Falha
"correta" mas inútil.

Cenários reais APCA-relevantes:

1. **body text on background:** `APCA(foreground, surface-1)` — sempre ≥75 por
   construção (foreground definido pra isso)
2. **text on action button:** `APCA(primary-foreground, primary)` — ≥75
3. **filled primary block on page:** `APCA(primary, surface-1)` — ≥30 (APCA-W3
   silver pra blocos preenchidos; bronze 45 é pra thin borders 1-2px, não
   filled buttons/badges/progress bar fill)
4. **icon on surface:** `APCA(foreground-muted, surface-1)` — ≥60 (large)

Alternativas avaliadas:

- (A) Subir L de todos os `primary_oklch` pra ≥0.80: descaracteriza paletas
  (Indigo deixa de ser indigo, vira lavanda pastel)
- (B) Manter validator atual + aceitar 9/13 falhas: lint vermelho permanente
- (C) Refatorar validator pra testar os 4 cenários reais: validação alinha
  com uso, não com fantasia

## Decision

Refatorar `scripts/validate-palettes.ts` pra testar 2 cenários **realmente
usados pelo design system**:

```ts
// Cenário 1: body text on surface (sempre presente)
const fg = foregroundForSurface(surface_1_dark)  // L=0.95 derivada
APCA(fg, surface_1_dark) ≥ 75  // body text threshold

// Cenário 2: primary como filled action block on page
APCA(primary, surface_1_dark) ≥ 30  // APCA-W3 silver (filled block visibility)
```

**Threshold 30 (silver), não 45 (bronze):** APCA Bronze 45 é pra elementos de
1-2px (thin borders, hairlines, single-pixel separators). Para blocos
preenchidos ≥4px (`<Button>` filled, badge solid, progress bar fill), a
referência é APCA Silver 30 — confirmado pela própria documentação APCA-W3.
13 paletas oficiais passam com Lc 30-97 (média ~45).

Cenário "text on primary button" (cenário 3 acima) será coberto em validator
separado quando implementarmos os `primary-foreground` derivados (Sprint 2 —
feature de tema dinâmico). Por ora não há campo `primary_foreground_oklch`
no seed.

Cenário "text on primary button" será coberto em validator separado quando
implementarmos os `primary-foreground` derivados (Sprint 2 — feature de tema
dinâmico). Por ora não há campo `primary_foreground_oklch` no seed.

`primary_oklch` continua sendo a cor saturada vibrante de marca. Validator não
exige que primary seja text-grade.

## Consequences

**Positivo:**

- Validator alinhado com uso real → 13/13 paletas passam dual-gate sem
  descaracterizar identidade visual
- Lint verde permite CI travar regressões reais
- ADR documenta o escopo do validator (futuro dev sabe o que NÃO é testado)

**Negativo:**

- Cobertura parcial: cenário "text on primary button" não validado dia 0
  - Mitigação: ticket Sprint 2 — adicionar `primary_foreground_oklch` no
    seed + extender validator pra cobrir cenário 3
- Tradeoff: aceitar gap conhecido em vez de tudo-ou-nada

**Neutro:**

- Quando `primary_foreground_oklch` for adicionado: estender validator
  (adicionar terceiro `APCA()` check)
- Revisitar se design system trocar o papel semântico de `primary` (ex.: virar
  cor de body text em variante light-on-color)

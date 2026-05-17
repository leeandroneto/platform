# 0016. Pipeline UI dia 0 expandido (~70h)

Date: 2026-05-17
Status: accepted

## Context

Master plan §31, §33 dizem "design system pipeline dia 1". Pesquisa 07 sugere adiar polish. Fundador exige dia 0 máximo possível (polish vira refator 10× depois). Memória `feedback_skip_visual_checkpoints` confirma checkpoint visual único no fim. Fonte: `_CONFLITOS.md #16` + pesquisas 05/06/08/16.

## Decision

~70h dia 0 cobrindo 30 tarefas detalhadas em `15-bootstrap-checklist.md`:

Tailwind v4 `@theme` OKLCH (2h) · 13 paletas OKLCH (4h) · shadcn ~15 (4h) · Motion 12 presets (2h) · APCA validator (6h) · CSS via API route (4h) · Skeleton shimmer (1h) · Surface elevation 3 níveis (2h) · Border ghost (1h) · Tabular-nums (30min) · Catálogo Lucide ~80 (3h) · Sonner custom (2h) · vaul premium (2h) · Safe areas iOS (1h) · Status bar tint (1h) · Splash screen (2h) · Tab bar tint+indicator (2h) · View Transitions API (2h) · Shared element layoutId (4h) · Pull-to-refresh physics (3h) · Page transitions (4h) · Number ticker (1h) · Inner glow (1h) · Header sticky blur (2h) · Hero images (4h) · Avatar system (2h) · Image placeholders blurhash (3h) · Install banner custom iOS (2h) · Logo system completo (6h).

**Cortado permanente:** confetti milestone (pesquisa 16 [O] não-premium).
**Incremental:** custom SVG sprite ícones fitness (YAGNI até Lucide não cobrir caso real).

**Princípio universal aplicado a brand assets.** 00-PROJETO §9 — zero inline pra logo/cor/fonte/nome da marca. Trocar = editar 1 token, propaga 100%.

## Consequences

**Positivo:**
- Polish absorvido dia 0 ≠ refator 10× depois
- Diferencial vs concorrentes BR (visual datado)
- Reuso 100% dos primitives em todas as features

**Negativo:**
- M0 alongado (2 semanas vs 1)
- Risco scope creep (cortar confetti foi explícito)

**Neutro:**
- Logo system completo dia 0 inclui ESLint rule bloqueando "desafit"/"desafit.app" literal
- Hook system (3 hooks Claude Code) ajuda enforce

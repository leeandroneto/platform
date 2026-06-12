#!/usr/bin/env bash
# SessionStart hook — carrega contexto retake.run
set -euo pipefail

cat <<'EOF'
═══════════════════════════════════════════════════════════════════════════════
📋 retake.run context loaded

  Vocab cravado (.claude/rules/naming.md):
    coach / athlete / tenant / staff / member / lead
    pace / threshold / compliance / macrocycle / session / wearable

  Banidos (ESLint enforce):
    student / trainer / professional / client (como aluno) / intake / wizard /
    framer-motion / archetype / brand_parent / multi-vertical anything

  Schema único:
    public.*  — TUDO (RLS é a fronteira)
    auth.* / storage.* / realtime.* — Supabase managed

  Tokens shadcn-canonical + extensões opt-in retake:
    --background --foreground --primary --secondary --muted --accent
    --destructive --border --input --ring --chart-1..5 --sidebar-*
    --font-sans --font-serif --font-mono --radius
    Extensões: --font-display --radius-pill --shadow-warm-* --tracking-eyebrow

  Hooks ativos:
    enforce-handoff-readonly · protect-eslint · block-token-bypass
    enforce-vocab-retake · enforce-server-only-data-layer
    post-shadcn-add · format-on-write

  Plano ativo: docs/plans/foundation.md (sprints S0-S7)
  ADR fundadora: docs/adr/0001-foundation.md
  Handoff SSOT: docs/_handoff/ (intocável)

═══════════════════════════════════════════════════════════════════════════════
EOF

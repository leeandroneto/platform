#!/usr/bin/env bash
# SessionStart hook — carrega contexto crítico em toda nova sessão Claude Code.
# Fonte: 16-claude-code.md §4.1

cat <<'EOF'
═══════════════════════════════════════════════════════════════════════════════
📋 desafit context loaded

  Vocab banido (.claude/rules/naming.md):
    student, trainer, intake, wizard, prospect, diagnostic, customization,
    workspace, framer-motion, aluno (folder), reflexao, pilares, proximo_passo

  Schema (ADR-0033 — schema único):
    public.*     — TUDO (catálogos + produto + RLS-protected tenant data)
    auth.*       — Supabase managed (não tocar)
    storage.*    — Supabase managed (não tocar)

  Brand multi-marca:
    SEMPRE env.NEXT_PUBLIC_BRAND_NAME / BRAND_DOMAIN / BRAND_PARENT
    NUNCA hardcoded 'desafit' / 'yoga.app' / 'ingles.app'

  Decisões: docs/adr/NNNN-*.md (23 ADRs dia 0)
  Hierarquia: 00-PROJETO > ADR > Blueprint > Master Plan arquivado > Memória

═══════════════════════════════════════════════════════════════════════════════
EOF

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

  Decisões: docs/adr/NNNN-*.md (40 ADRs). ADR-0040 = fechamento dia 0.
  Hierarquia: 00-PROJETO > ADR > Blueprint > Master Plan arquivado > Memória

  Rules path-loaded (.claude/rules/*.md):
    Por path: data-layer, domain-logic, server-actions, features, jwt-claims, components
    ADR-0040: i18n, contrast, shadcn-zone, design-tokens, brand, entitlements

  Zona quarentenada shadcn (ADR-0040 §A-§E):
    components/ui/* = Edit BLOQUEADO. Canal único: npx shadcn add via Bash.
    Wrapper customização em components/app-*.tsx — 3 obrigatórios + demais JIT.
    Passthrough proibido (Vercel Academy).

  Plano ativo: docs/plans/PLANO-MESTRE-DIA-0.md

═══════════════════════════════════════════════════════════════════════════════
EOF

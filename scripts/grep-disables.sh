#!/usr/bin/env bash
# ─── pnpm audit:disables ──────────────────────────────────────────────────────
# Bloqueia eslint-disable fora da allowlist única (ADR-0012).
# Memória: feedback_zero_eslint_disable (830 disables no onboarding-bio velho).

set -e

ALLOWED_REASONS=(
  'block oficial shadcn'
  'third-party-component'
)

ALLOWLIST_PATTERN=$(printf '%s\n' "${ALLOWED_REASONS[@]}" | paste -sd'|' -)

HITS=$(
  grep -RInE 'eslint-disable' --include='*.ts' --include='*.tsx' \
    app/ components/ lib/ 2>/dev/null \
  | grep -vE "$ALLOWLIST_PATTERN" \
  || true
)

if [ -n "$HITS" ]; then
  echo "❌ eslint-disable fora da allowlist:"
  echo "$HITS"
  echo ""
  echo "Allowlist (ADR-0012):"
  printf '  - %s\n' "${ALLOWED_REASONS[@]}"
  echo ""
  echo "Adicionar novo padrão exige novo ADR superseding 0012."
  exit 1
fi

echo "✅ disables clean (apenas allowlist)"
exit 0

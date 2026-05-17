#!/usr/bin/env bash
# ─── pnpm vocab:audit ─────────────────────────────────────────────────────────
# Grep cross-file de vocab banido — captura literal/comment/template strings
# que regra AST do ESLint não pega.
# Fonte: ADR-0012 + .claude/rules/naming.md + 13-lint-enforcement.md §4.1

set -e

BANNED='\b(student|trainer|intake|wizard|prospect|diagnostic|customization|workspace|framer-motion|reflexao|pilares|proximo_passo)\b'

# Allowlist (decisão D-G66 — 8 lugares legítimos)
ALLOWLIST=(
  '.claude/rules/naming.md'
  'docs/adr/0012-lint-enforcement-dia-0.md'
  'docs/adr/0019-setup-4-telas-fase-2.md'
  'docs/_archive/'
  'messages/.*/meta\.banned_vocab\.'
  'tests/fixtures/banned-vocab\.test\.ts'
  'ADR-[0-9]+ mention OK:'
  'docs/adr/README\.md'
  'CHANGELOG\.md'
)

# Build allowlist grep expression
EXCLUDE_PATTERN=$(printf '%s\n' "${ALLOWLIST[@]}" | paste -sd'|' -)

HITS=$(
  grep -RInE "$BANNED" \
    --include='*.ts' --include='*.tsx' --include='*.md' --include='*.sql' --include='*.json' \
    app/ components/ lib/ supabase/ messages/ scripts/ docs/ 2>/dev/null \
  | grep -vE "$EXCLUDE_PATTERN" \
  || true
)

if [ -n "$HITS" ]; then
  echo "❌ Vocab banido detectado:"
  echo "$HITS"
  echo ""
  echo "Substitutos canônicos em .claude/rules/naming.md"
  exit 1
fi

echo "✅ vocab:audit clean (0 hits fora da allowlist)"
exit 0

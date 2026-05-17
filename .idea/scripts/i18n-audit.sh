#!/usr/bin/env bash
# ─── pnpm i18n:audit ──────────────────────────────────────────────────────────
# Grep cross-file de literais hardcoded em paths críticos.
# Captura padrões que ESLint AST não pega (multilinha, embedded em templates).
# Fonte: D-G66 (i18n 14 padrões) + 13-lint-enforcement.md §4.2

set -e

# Padrão: JSX text node em pt-BR (capitalizado, ≥3 chars, sem t() wrapper)
PATTERN='>[A-ZÀ-Ý][a-zà-ÿ ]{2,}<'

HITS=$(
  grep -RInE "$PATTERN" --include='*.tsx' app/ components/ 2>/dev/null \
  | grep -v '{t(' \
  | grep -v '{\.\.\.t' \
  | grep -v '^messages/' \
  || true
)

# Padrão secundário: aria-label/placeholder/title/alt com literal
ATTR_PATTERN='(aria-label|placeholder|title|alt)="[A-ZÀ-Ý][^"]{2,}"'
ATTR_HITS=$(
  grep -RInE "$ATTR_PATTERN" --include='*.tsx' app/ components/ 2>/dev/null \
  | grep -vE 'alt=""' \
  || true
)

if [ -n "$HITS" ] || [ -n "$ATTR_HITS" ]; then
  echo "❌ UI strings hardcoded detectados (use t() de next-intl):"
  [ -n "$HITS" ] && echo "$HITS"
  [ -n "$ATTR_HITS" ] && echo "$ATTR_HITS"
  exit 1
fi

echo "✅ i18n:audit clean"
exit 0

#!/usr/bin/env bash
# ─── pnpm i18n:audit ──────────────────────────────────────────────────────────
# Grep cross-file de literais hardcoded em paths críticos.
# Captura padrões que ESLint AST não pega (multilinha, embedded em templates).
# Fonte: D-G66 (i18n 14 padrões) + 13-lint-enforcement.md §4.2

set -e

# Padrão: JSX text node em pt-BR (capitalizado, ≥3 chars, sem t() wrapper)
PATTERN='>[A-ZÀ-Ý][a-zà-ÿ ]{2,}<'

# components/ui/ excluído: shadcn ships com strings internas em EN (sr-only, defaults
# Radix). Customização vira eventual via wrappers nossos. Auditar shadcn primitives
# vira ruído de upstream. App-specific UI ainda é auditado.
# Blocks shadcn no root de components/ (ADR-0031 §1): também vendor — excluídos.
VENDOR_BLOCKS='components/(app-sidebar|nav-.*|section-cards|site-header|chart-area-interactive|search-form|team-switcher|login-form|version-switcher|data-table)\.tsx'
HITS=$(
  grep -RInE "$PATTERN" --include='*.tsx' app/ components/ 2>/dev/null \
  | grep -v '^components/ui/' \
  | grep -vE "^$VENDOR_BLOCKS" \
  | grep -v '{t(' \
  | grep -v '{\.\.\.t' \
  | grep -v '^messages/' \
  || true
)

# Padrão secundário: aria-label/placeholder/title/alt com literal
ATTR_PATTERN='(aria-label|placeholder|title|alt)="[A-ZÀ-Ý][^"]{2,}"'
ATTR_HITS=$(
  grep -RInE "$ATTR_PATTERN" --include='*.tsx' app/ components/ 2>/dev/null \
  | grep -v '^components/ui/' \
  | grep -vE "^$VENDOR_BLOCKS" \
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

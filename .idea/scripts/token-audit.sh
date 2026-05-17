#!/usr/bin/env bash
# ─── pnpm token:audit ─────────────────────────────────────────────────────────
# Grep cross-file de hex/rgba/CSS vars hardcoded em código.
# Allowlist: app/globals.css @theme block + blurhash (que usa hex).
# Fonte: ADR-0012 + 13-lint-enforcement.md §4.3

set -e

HEX_PATTERN='#[0-9a-fA-F]{3,8}\b'
RGB_PATTERN='rgba?\('

HITS=$(
  grep -RInE "$HEX_PATTERN|$RGB_PATTERN" \
    --include='*.ts' --include='*.tsx' --include='*.css' \
    app/ components/ lib/ 2>/dev/null \
  | grep -v 'app/globals\.css.*@theme' \
  | grep -v 'blurhash' \
  | grep -v 'app/icon\.tsx' \
  | grep -v 'app/apple-icon\.tsx' \
  | grep -v 'app/opengraph-image\.tsx' \
  | grep -v 'next/og' \
  || true
)

if [ -n "$HITS" ]; then
  echo "❌ Token bypass detectado (hex/rgba hardcoded):"
  echo "$HITS"
  echo ""
  echo "Use tokens semantic via 'var(--*)' ou className token shadcn."
  echo "Allowlist: app/globals.css @theme, blurhash, ImageResponse (next/og)."
  exit 1
fi

echo "✅ token:audit clean"
exit 0

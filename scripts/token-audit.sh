#!/usr/bin/env bash
# ─── pnpm token:audit ─────────────────────────────────────────────────────────
# Grep cross-file de hex/rgba/CSS vars hardcoded em código.
# Allowlist: app/globals.css @theme block + blurhash (que usa hex).
# Fonte: ADR-0012 + 13-lint-enforcement.md §4.3

set -e

HEX_PATTERN='#[0-9a-fA-F]{3,8}\b'
RGB_PATTERN='rgba?\('

# components/ui/chart.tsx excluído: contém #ccc/#fff em selectors CSS Recharts
# internals (third-party). Anotado no header do arquivo. NÃO replicar pattern.
HITS=$(
  grep -RInE "$HEX_PATTERN|$RGB_PATTERN" \
    --include='*.ts' --include='*.tsx' --include='*.css' \
    app/ components/ lib/ 2>/dev/null \
  | grep -v 'app/globals\.css' \
  | grep -v 'blurhash' \
  | grep -v 'app/icon\.tsx' \
  | grep -v 'app/apple-icon\.tsx' \
  | grep -v 'app/opengraph-image\.tsx' \
  | grep -v 'next/og' \
  | grep -v 'components/ui/chart\.tsx' \
  | grep -v 'lib/design/presets/' \
  | grep -v 'lib/design/tailwind-colors\.ts' \
  | grep -v 'components/admin/theme-studio/' \
  || true
)

if [ -n "$HITS" ]; then
  echo "❌ Token bypass detectado (hex/rgba hardcoded):"
  echo "$HITS"
  echo ""
  echo "Use tokens semantic via 'var(--*)' ou className token shadcn."
  echo "Allowlist: app/globals.css @theme, blurhash, ImageResponse (next/og), lib/design/presets/* (TweakCN preset data, convertido JIT pra OKLCH), lib/design/tailwind-colors.ts (Tailwind palette map), components/admin/theme-studio/* (TweakCN-adapted files: brand logos inline + preserved upstream defaults; alinhado com override ESLint design-tokens/no-tailwind-bypass)."
  exit 1
fi

echo "✅ token:audit clean"
exit 0

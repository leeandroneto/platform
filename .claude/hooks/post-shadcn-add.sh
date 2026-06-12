#!/usr/bin/env bash
# PostToolUse hook — após npx shadcn add, lembra de auditar
set -euo pipefail

input=$(cat)
command=$(echo "$input" | grep -oE '"command":"[^"]+"' | sed 's/"command":"//;s/"$//' || echo "")

if echo "$command" | grep -qE "npx shadcn"; then
  echo "✓ shadcn component instalado"
  echo "  Verifique tokens canonical aplicados (deve recolorir automático)"
fi

exit 0

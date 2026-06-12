#!/usr/bin/env bash
# PostToolUse hook — formata arquivos após Write/Edit
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")

# Only format .ts/.tsx/.json/.md
if [[ "$path" == *.ts || "$path" == *.tsx || "$path" == *.json || "$path" == *.md || "$path" == *.css ]]; then
  if command -v pnpm &> /dev/null && [[ -f package.json ]]; then
    pnpm exec prettier --write "$path" 2>/dev/null || true
  fi
fi

exit 0

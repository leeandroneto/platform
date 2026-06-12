#!/usr/bin/env bash
# PreToolUse hook — bloqueia Edit/Write em docs/_handoff/
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")

if [[ "$path" == *"docs/_handoff/"* ]]; then
  echo "❌ docs/_handoff/ é SSOT cravado pelo owner — somente leitura"
  echo "   Path tentado: $path"
  exit 2
fi

exit 0

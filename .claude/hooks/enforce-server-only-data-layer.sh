#!/usr/bin/env bash
# PreToolUse hook — lib/data/** precisa 'server-only' no topo
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")
content=$(echo "$input" | grep -oE '"content":"[^"]+"' | sed 's/"content":"//;s/"$//' || echo "")

if [[ "$path" == *"lib/data/"* ]] && [[ "$path" == *.ts ]]; then
  # Skip test files
  if [[ "$path" == *"__tests__"* ]] || [[ "$path" == *.test.ts ]]; then
    exit 0
  fi

  if ! echo "$content" | grep -q "import 'server-only'\|import \"server-only\""; then
    echo "❌ $path precisa de 'import \"server-only\"' no topo"
    echo "   Detalhes: .claude/rules/data-layer.md"
    exit 2
  fi
fi

exit 0

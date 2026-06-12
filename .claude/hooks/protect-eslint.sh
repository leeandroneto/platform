#!/usr/bin/env bash
# PreToolUse hook — components/ui/* é zona quarentenada
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")

# Allow eslint.config and components.json
if [[ "$path" == *"components/ui/"* ]] && [[ "$path" == *.tsx || "$path" == *.ts ]]; then
  # Allow only via npx shadcn (PostToolUse Bash will detect)
  echo "❌ components/ui/* é zona quarentenada — canal único é 'npx shadcn add'"
  echo "   Wrappers customizados em components/retake/ ou components/site/"
  exit 2
fi

exit 0

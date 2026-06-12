#!/usr/bin/env bash
# PreToolUse hook — bloqueia hex/HSL/rgba literal em .ts/.tsx (force CSS vars)
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")
content=$(echo "$input" | grep -oE '"content":"[^"]+"' | sed 's/"content":"//;s/"$//' || echo "")

if [[ -z "$content" ]]; then
  content=$(echo "$input" | grep -oE '"new_string":"[^"]+"' | sed 's/"new_string":"//;s/"$//' || echo "")
fi

# Allow exception paths
if [[ "$path" == *"app/globals.css"* ]] || \
   [[ "$path" == *"tokens/"* ]] || \
   [[ "$path" == *"og/route"* ]] || \
   [[ "$path" == *"lib/design/contrast"* ]] || \
   [[ "$path" == *"manifest"* ]] || \
   [[ "$path" == *"theme-defaults"* ]]; then
  exit 0
fi

# Check for hex/HSL/rgba in .ts/.tsx
if [[ "$path" == *.ts || "$path" == *.tsx ]]; then
  if echo "$content" | grep -qE '#[0-9a-fA-F]{3,8}\b|hsl\(|rgba?\(' ; then
    echo "❌ Token bypass detectado: hex/HSL/rgba literal em $path"
    echo "   Use CSS vars canonical: var(--primary), var(--background), etc"
    echo "   Detalhes: .claude/rules/design-tokens.md"
    exit 2
  fi
fi

exit 0

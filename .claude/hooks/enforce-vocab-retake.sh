#!/usr/bin/env bash
# PreToolUse hook — vocab retake corrida enforce em código novo
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")
content=$(echo "$input" | grep -oE '"content":"[^"]+"' | sed 's/"content":"//;s/"$//' || echo "")

if [[ -z "$content" ]]; then
  content=$(echo "$input" | grep -oE '"new_string":"[^"]+"' | sed 's/"new_string":"//;s/"$//' || echo "")
fi

# Skip docs paths
if [[ "$path" == *"docs/"* ]] || [[ "$path" == *".md" ]]; then
  exit 0
fi

# Apply only to .ts/.tsx
if [[ "$path" == *.ts || "$path" == *.tsx ]]; then
  banned_patterns=(
    "\\bstudent\\b"
    "\\btrainer\\b"
    "\\bintake\\b"
    "\\bwizard\\b"
    "\\bframer-motion\\b"
    "\\barchetype\\b"
    "\\bbrand_parent\\b"
    "\\bonboarding\\.bio\\b"
  )

  found=()
  for p in "${banned_patterns[@]}"; do
    if echo "$content" | grep -qE "$p"; then
      found+=("$p")
    fi
  done

  if [[ ${#found[@]} -gt 0 ]]; then
    echo "❌ Vocab banido detectado em $path: ${found[*]}"
    echo "   Substitutos: .claude/rules/naming.md"
    exit 2
  fi
fi

exit 0

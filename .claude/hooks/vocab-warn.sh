#!/usr/bin/env bash
# UserPromptSubmit hook — alerta vocab banido em prompts do user
set -euo pipefail

input=$(cat)

banned_patterns=(
  "student"
  "trainer"
  "intake"
  "wizard"
  "professional[^s]"
  "framer-motion"
  "archetype"
  "brand_parent"
  "multi-vertical"
)

found=()
for p in "${banned_patterns[@]}"; do
  if echo "$input" | grep -iqE "$p"; then
    found+=("$p")
  fi
done

if [[ ${#found[@]} -gt 0 ]]; then
  echo "⚠️  vocab banido detectado no prompt: ${found[*]}"
  echo "   Substitutos cravados em .claude/rules/naming.md:"
  echo "   student→athlete · trainer→coach · intake→lead-capture · wizard→setup"
  echo "   framer-motion→motion/react · archetype/brand_parent→nada (retake é vertical único)"
fi

exit 0

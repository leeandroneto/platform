#!/usr/bin/env bash
# UserPromptSubmit hook — warn (não bloqueia) quando user prompt contém vocab banido.
# Fonte: 16-claude-code.md §4.2 + memória feedback_vocab_check_before_response.

# Stdin recebe o prompt do user
PROMPT=$(cat)

declare -A SUBSTITUTES=(
  [student]=client
  [trainer]=professional
  [intake]=capture_form
  [wizard]=setup
  [prospect]=lead
  [diagnostic]=assessment
  [customization]=branding
  [workspace]=tenant
  [framer-motion]=motion/react
  [aluno]=client
  [reflexao]=reflection
  [pilares]=pillars
  [proximo_passo]=next_step
)

WARNED=0
for term in "${!SUBSTITUTES[@]}"; do
  if echo "$PROMPT" | grep -iqE "\\b${term}\\b"; then
    if [ $WARNED -eq 0 ]; then
      echo "⚠️  Termos banidos detectados no prompt — substitutos canônicos:" >&2
      WARNED=1
    fi
    echo "    '$term' → '${SUBSTITUTES[$term]}'" >&2
  fi
done

if [ $WARNED -eq 1 ]; then
  echo "" >&2
  echo "Confirma uso intencional, ou reformula com o canônico?" >&2
  echo "(Detalhes: .claude/rules/naming.md)" >&2
fi

# Exit 0 = warning soft (não bloqueia o prompt)
exit 0

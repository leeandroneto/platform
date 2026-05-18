#!/usr/bin/env bash
# PreToolUse Write|Edit hook — bloqueia hex/rgba literal em .ts/.tsx fora allowlist
# (ADR-0012 token bypass). Para disable comments ESLint, ver block-disable-content.sh.
#
# Formato JSON output stdout + exit 0 (ADR-0036, bug anthropics/claude-code#13744:
# exit 2 em PreToolUse NAO bloqueia confiavelmente Write/Edit).

INPUT=$(cat)

# Extrai conteudo proposto (Write content OU Edit new_string)
CONTENT=$(echo "$INPUT" | grep -oE '"(content|new_string)"\s*:\s*"[^"]*"' | head -1)
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')

# Hex/rgba so faz sentido checar em .ts/.tsx
if echo "$FILE_PATH" | grep -qE '\.(ts|tsx)$' \
   && ! echo "$FILE_PATH" | grep -qE 'globals\.css|icon\.tsx|apple-icon\.tsx|opengraph-image\.tsx|blurhash'; then
  if echo "$CONTENT" | grep -qE '#[0-9a-fA-F]{3,8}\b' || echo "$CONTENT" | grep -qE 'rgba?\('; then
    cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Hex/rgba literal detectado em .ts/.tsx. Use token semantic via var(--*) ou className token shadcn. Allowlist: app/globals.css @theme, ImageResponse (next/og), blurhash. Detalhes: ADR-0012, .claude/rules/naming.md."}}
EOF
    exit 0
  fi
fi

exit 0

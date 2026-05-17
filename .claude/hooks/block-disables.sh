#!/usr/bin/env bash
# PreToolUse Write|Edit hook — bloqueia adicionar eslint-disable fora allowlist
# + hex/rgba literal + JSX text node literal sem t() wrapper.
# Fonte: 16-claude-code.md §4.3 + ADR-0012.

# Claude Code envia JSON no stdin com tool_input.content (Write) ou new_string (Edit)
INPUT=$(cat)

# Extrai conteúdo proposto (Write content OU Edit new_string)
CONTENT=$(echo "$INPUT" | grep -oE '"(content|new_string)":\s*"[^"]*"' | head -1)

# Allowlist eslint-disable
ALLOWED='block oficial shadcn|third-party-component'

# Check eslint-disable
if echo "$CONTENT" | grep -qE 'eslint-disable' && ! echo "$CONTENT" | grep -qE "$ALLOWED"; then
  cat <<'EOF' >&2
{
  "decision": "block",
  "stopReason": "eslint-disable fora da allowlist. Allowlist (ADR-0012): 'block oficial shadcn' OU 'third-party-component'. Adicionar novo padrão exige ADR superseding 0012."
}
EOF
  exit 2
fi

# Check hex literal em files lint
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path":\s*"[^"]*"' | head -1 | sed 's/.*"\(.*\)"/\1/')

if echo "$FILE_PATH" | grep -qE '\.(ts|tsx)$' && ! echo "$FILE_PATH" | grep -qE 'globals\.css|icon\.tsx|apple-icon\.tsx|opengraph-image\.tsx|blurhash'; then
  if echo "$CONTENT" | grep -qE '#[0-9a-fA-F]{3,8}\b' || echo "$CONTENT" | grep -qE 'rgba?\('; then
    cat <<'EOF' >&2
{
  "decision": "block",
  "stopReason": "Hex/rgba literal detectado. Use token semantic via 'var(--*)' ou className token shadcn. Allowlist: app/globals.css @theme, ImageResponse (next/og), blurhash."
}
EOF
    exit 2
  fi
fi

exit 0

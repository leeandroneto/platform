#!/usr/bin/env bash
# PreToolUse Write hook - bloqueia criacao de componente UX sem marker RESEARCH.
#
# Escopo: Write em
#   - components/**/*.{ts,tsx}
#   - features/*/components/**/*.{ts,tsx}
#   - lib/**/components/**/*.{ts,tsx}
#
# Exige linha 1 com '// RESEARCH: <fonte>' apontando origem (shadcn block, primitive,
# @origin-ui, @kibo-ui, @billingsdk, @aceternity, @reui, @tremor, ou justificativa
# explicita pra custom). Hierarquia em ADR-0008/0037.
#
# Razao: incidente 7818df1 (revertido em 4be49e3) - Claude criou 5 componentes UX
# do zero violando ADR-0008 hierarquia. Componentes UX SO sao criados JIT
# (principio Phase A Final).
#
# Formato JSON output stdout + exit 0 (ADR-0036, bug anthropics/claude-code#13744).

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | grep -oE '"tool_name"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"([^"]*)"$/\1/')

# So Write cria arquivo novo. Edit modifica existente (gate ja foi passado).
if [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')

# Match: caminho contem segmento components/ + extensao .ts/.tsx
MATCH=0
if echo "$NORMALIZED" | grep -qE '(^|/)components/.+\.(ts|tsx)$'; then MATCH=1; fi
if echo "$NORMALIZED" | grep -qE '/features/[^/]+/components/.+\.(ts|tsx)$'; then MATCH=1; fi
if echo "$NORMALIZED" | grep -qE '/lib/.+/components/.+\.(ts|tsx)$'; then MATCH=1; fi

if [ $MATCH -eq 0 ]; then
  exit 0
fi

# Extrai content e checa marker nos primeiros ~300 chars (linha 1 razoavel)
CONTENT=$(echo "$INPUT" | grep -oE '"content"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"content"\s*:\s*"(.*)"$/\1/')
HEAD=$(echo "$CONTENT" | head -c 300)

if ! echo "$HEAD" | grep -qE '// RESEARCH: '; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Componente UX sem marker '// RESEARCH: <fonte>' nos primeiros 300 chars. Hierarquia (ADR-0008/0037): shadcn blocks -> primitives -> @origin-ui -> @kibo-ui -> @billingsdk -> @aceternity -> @reui -> @tremor -> custom. Antes de criar: 1) mcp__shadcn__search + mcp__storybook__list-components; 2) escolher fonte MAIS ALTA na hierarquia; 3) inserir marker linha 1 com link/justificativa; 4) so entao Write. Componentes UX SO JIT (Phase A Final principio)."}}
EOF
  exit 0
fi

exit 0

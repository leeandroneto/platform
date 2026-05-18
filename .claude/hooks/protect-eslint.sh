#!/usr/bin/env bash
# PreToolUse Write|Edit hook — protege eslint.config.* de edicao direta.
#
# Razao: eslint.config.mjs e gate de governance. Mudar regra ESLint exige novo ADR
# superseding 0012/0036, nao edit livre. Incidente 7818df1 (revertido em 4be49e3)
# mostrou Claude adicionando overrides path-based pra silenciar rules.
#
# Formato JSON output stdout + exit 0 (ADR-0036, bug anthropics/claude-code#13744).

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')
# Normaliza backslashes Windows -> forward slash
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')

if echo "$NORMALIZED" | grep -qE '(^|/)eslint\.config\.(mjs|cjs|js|ts)$'; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"eslint.config.* eh gate de governance (ADR-0012, ADR-0036). Mudar regra/override exige ADR superseding 0012 ou 0031. Nao editar direto via Write/Edit. Proponha ADR, aprovacao do founder, depois edita."}}
EOF
  exit 0
fi

exit 0

#!/usr/bin/env bash
# PreToolUse Write|Edit hook - bloqueia patterns de escape ESLint no conteudo.
#
# Padroes bloqueados:
#   - "es" + "lint-disable" comment (com allowlist ADR-0012)
#   - noInlineConfig literal (silenciar inline configs)
#   - reportUnusedDisableDirectives literal (silenciar enforcement)
#
# Razao: incidente 7818df1 (revertido em 4be49e3) mostrou Claude adicionando
# disable comments + path overrides pra silenciar rules. Defesa em profundidade
# vs editor de eslint.config.* (que protect-eslint.sh ja bloqueia).
#
# Formato JSON output stdout + exit 0 (ADR-0036, bug anthropics/claude-code#13744).

INPUT=$(cat)

# Skip eslint.config.* (protect-eslint.sh ja gate; tokens sao legitimos la)
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')
if echo "$NORMALIZED" | grep -qE '(^|/)eslint\.config\.(mjs|cjs|js|ts)$'; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | grep -oE '"(content|new_string)"\s*:\s*"[^"]*"' | head -1)

# Allowlist (ADR-0012): 2 padroes unicos justificados
ALLOWED='block oficial shadcn|third-party-component'

# Pattern construido em runtime pra nao trigger ele mesmo no source
DISABLE_TOKEN="eslint""-disable"

# Check disable comments
if echo "$CONTENT" | grep -qE "$DISABLE_TOKEN" && ! echo "$CONTENT" | grep -qE "$ALLOWED"; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Disable comment ESLint fora da allowlist (ADR-0012). Allowlist: 'block oficial shadcn' OU 'third-party-component'. Adicionar novo padrao exige ADR superseding 0012. Note: ADR-0036 ativou eslint-comments/no-use:error, entao toda nova excecao precisa decisao explicita."}}
EOF
  exit 0
fi

# Check noInlineConfig literal (so faz sentido em config files; nao deve aparecer em src)
if echo "$CONTENT" | grep -qE '\bnoInlineConfig\b'; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"noInlineConfig token detectado no conteudo. ADR-0036 ja enforca linterOptions.noInlineConfig:true em eslint.config.mjs. Nao duplicar nem desligar."}}
EOF
  exit 0
fi

# Check reportUnusedDisableDirectives literal
if echo "$CONTENT" | grep -qE '\breportUnusedDisableDirectives\b'; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"reportUnusedDisableDirectives token detectado. ADR-0036 ja enforca este nivel em eslint.config.mjs (linterOptions.reportUnusedDisableDirectives:'error'). Editar gate exige novo ADR superseding 0036."}}
EOF
  exit 0
fi

exit 0

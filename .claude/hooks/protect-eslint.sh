#!/usr/bin/env bash
# PreToolUse Write|Edit hook — protege eslint.config.* de edicao sem autorizacao ADR.
#
# Razao: eslint.config.mjs e gate de governance. Mudar regra ESLint exige ADR
# documentando a mudanca. Incidente 7818df1 (revertido em 4be49e3) mostrou Claude
# adicionando overrides path-based pra silenciar rules sem rastreio. Custo: ~150h.
#
# Canal de autorizacao (ADR-0040 §B + evolucao 2026-05-18):
#  Edit/Write e permitida quando o conteudo (new_string ou content) contem marker
#  `// ADR-NNNN` E o arquivo `docs/adr/NNNN-*.md` existe no repo.
#
# Principio: trigger aponta pra resposta (memory feedback_jit_anchoring).
# Defesa em camadas: pra burlar, Claude teria que tambem criar ADR fake no
# docs/adr/ — outro vetor que pode ganhar hook proprio se virar problema.
#
# Formato JSON output stdout + exit 0 (ADR-0036, bug anthropics/claude-code#13744).

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')

# Nao e eslint.config.* -> passa direto
if ! echo "$NORMALIZED" | grep -qE '(^|/)eslint\.config\.(mjs|cjs|js|ts)$'; then
  exit 0
fi

# E eslint.config.* -> procura ADR markers no INPUT inteiro (cobre new_string + content + old_string)
# Regex permissivo: aceita `ADR-NNNN` em qualquer lugar (defesa real e o ADR existir em docs/adr/).
ADR_NUMBERS=$(echo "$INPUT" | grep -oE 'ADR-[0-9]{4}' | grep -oE '[0-9]{4}' | sort -u)

if [ -z "$ADR_NUMBERS" ]; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"eslint.config.* exige autorizacao via marker `// ADR-NNNN` no diff (mudanca rastreavel). Adicione comentario citando ADR aprovado. Ex: `// ADR-0040 §B — eslint-plugin-better-tailwindcss`."}}
EOF
  exit 0
fi

# Valida que pelo menos um ADR referenciado existe em docs/adr/
ANY_VALID=0
for NUM in $ADR_NUMBERS; do
  if ls docs/adr/${NUM}-*.md >/dev/null 2>&1; then
    ANY_VALID=1
    break
  fi
done

if [ "$ANY_VALID" -eq 0 ]; then
  REFERENCED=$(echo "$ADR_NUMBERS" | tr '\n' ',' | sed 's/,$//')
  cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"eslint.config.* cita ADR(s) [${REFERENCED}] mas nenhum arquivo docs/adr/<NUM>-*.md existe. Crie o ADR aprovado primeiro, depois edite."}}
EOF
  exit 0
fi

exit 0

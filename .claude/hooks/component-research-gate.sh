#!/usr/bin/env bash
# PreToolUse Write hook - bloqueia criacao de componente UX sem marker RESEARCH.
#
# Escopo: Write em
#   - components/**/*.{ts,tsx}
#   - features/*/components/**/*.{ts,tsx}
#   - lib/**/components/**/*.{ts,tsx}
#
# Exige linha 1 com '// RESEARCH: <fonte>' apontando origem (shadcn block, primitive,
# origin-ui, kibo-ui, reui, tremor, billingsdk, ou justificativa explicita pra
# custom). Hierarquia ordenada em ADR-0008/0037. Aceternity fora do produto.
#
# Razao: incidente 7818df1 (revertido em 4be49e3) - Claude criou 5 componentes UX
# do zero violando ADR-0008 hierarquia. Componentes UX SO sao criados JIT
# (principio Phase A Final).
#
# Formato JSON output stdout + exit 0 (ADR-0036, bug anthropics/claude-code#13744).

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | grep -oE '"tool_name"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"([^"]*)"$/\1/')

FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')

# ADR-0040 §A — zona quarentenada components/ui/**. Edit categoricamente BLOQUEADO
# (vendor surface). Canal unico: Bash `npx shadcn add <slug>` reescreve primitive
# inteira. Customizacao vai em components/app-*.tsx (3 wrappers dia 0 + JIT).
if [ "$TOOL_NAME" = "Edit" ] && echo "$NORMALIZED" | grep -qE '(^|/)components/ui/.+\.(ts|tsx)$'; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"components/ui/* e zona quarentenada (ADR-0040 §A) — Edit BLOQUEADO. Canal unico de modificacao: Bash `npx shadcn add <slug>`. Customizacao composta vai em components/app-*.tsx. Detalhes: .claude/rules/shadcn-zone.md."}}
EOF
  exit 0
fi

# Demais Edits passam (gate de marker so se aplica a Write criando arquivo novo).
if [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

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
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Componente UX sem marker '// RESEARCH: <fonte>' nos primeiros 300 chars. Hierarquia (ADR-0008/0037, pesquisa 2026-05-18): vendor canonico (shadcn blocks -> primitives) -> catalogos copy-paste (origin-ui -> kibo-ui -> reui -> tremor -> billingsdk) -> custom. Aceternity fora do produto (Framer Motion incompat). Antes de criar: 1) mcp__shadcn__search + mcp__shadcn__list-components; 2) escolher fonte MAIS ALTA; 3) inserir marker linha 1; 4) so entao Write. Componentes UX SO JIT."}}
EOF
  exit 0
fi

exit 0

#!/usr/bin/env bash
# PostToolUse Write|Edit hook — roda prettier no arquivo modificado.
#
# Razao: ESLint `simple-import-sort` + `better-tailwindcss` brigam com formatacao
# manual. Rodar prettier no save normaliza (sort imports, sort tailwind classes,
# whitespace) e remove falsos positivos de lint que so existem por causa de
# formatacao bruta. Sem hook, Claude futuro precisa lembrar de rodar prettier
# manual depois de cada Edit — fricao alta.
#
# Output: nao bloqueia (exit 0 sempre). Erros do prettier vao pra stderr mas
# nao afetam o fluxo. Suporte limitado a extensoes que prettier conhece.

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')

# Skip se path vazio ou nao bate extensoes suportadas
if [ -z "$NORMALIZED" ]; then
  exit 0
fi

case "$NORMALIZED" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.md|*.css|*.scss|*.yml|*.yaml)
    # Roda prettier silencioso. Falha vai pra stderr mas nao bloqueia.
    pnpm exec prettier --write --log-level warn "$NORMALIZED" >&2 2>&1 || true
    ;;
  *)
    # Extensao nao suportada — skip silencioso
    ;;
esac

exit 0

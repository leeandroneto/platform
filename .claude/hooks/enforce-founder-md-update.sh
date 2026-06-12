#!/usr/bin/env bash
# PreToolUse hook — bloqueia Edit/Write em ADR-0001, foundation.md, schema-completo.md, schema.dbml
# sem que FOUNDER.md tenha sido tocado no mesmo trabalho.
# Reduz risco de FOUNDER.md ficar stale.
set -euo pipefail

input=$(cat)
path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | sed 's/"file_path":"//;s/"$//' || echo "")

# Paths que disparam warning
trigger_paths=(
  "docs/adr/0001-foundation.md"
  "docs/plans/foundation.md"
  "docs/blueprint/01-schema-completo.md"
  "schema.dbml"
)

# Verifica se path bate com algum trigger
is_trigger=0
for tp in "${trigger_paths[@]}"; do
  if [[ "$path" == *"$tp"* ]]; then
    is_trigger=1
    break
  fi
done

if [[ "$is_trigger" -eq 1 ]]; then
  # Warning amigável (não bloqueia hard — só lembra)
  cat <<EOF
⚠️  ATENÇÃO: você está editando $path

   Esse arquivo é parte da fundação do projeto. Se mudar decisão arquitetural,
   atualize TAMBÉM:
     - FOUNDER.md (header "Synced from ADR-0001 vN.N · foundation.md vN.N")
     - docs/blueprint/00-projeto.md (se afeta visão de produto)
     - CLAUDE.md (se afeta discovery)

   Para garantir consistência, considere fazer 1 commit unificado com todos
   os arquivos atualizados.
EOF
fi

exit 0

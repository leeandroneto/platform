#!/usr/bin/env bash
# PostToolUse Bash hook — injeta checklist apos `npx shadcn add`.
#
# Razao: cada primitive adicionada precisa passar pelo audit shadcn-zone (ADR-0040
# §A): grep strings literais, grep cores hardcoded, deletar variants nao usados,
# decidir se cria wrapper composto. Sem injecao automatica, Claude futuro esquece.
#
# Output: stderr (mensagem informativa, nao bloqueia). PostToolUse nao usa
# permissionDecision — apenas adiciona contexto pra proxima resposta.

INPUT=$(cat)

COMMAND=$(echo "$INPUT" | grep -oE '"command"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"command"\s*:\s*"(.*)"$/\1/')

# So dispara se for shadcn add
if ! echo "$COMMAND" | grep -qE 'shadcn[[:space:]]+add'; then
  exit 0
fi

cat >&2 <<'EOF'

═══════════════════════════════════════════════════════════════════════════════
✅ shadcn add detectado. Checklist obrigatorio (ADR-0040 §A + shadcn-zone.md):

1. mcp__shadcn__get_audit_checklist — seguir TODOS os passos
2. grep '"[A-Z]' nos arquivos novos → mover pra messages/pt-BR/<namespace>.json
3. grep 'oklch(|#[0-9a-f]|rgb(' → trocar por var(--color-*) ou var(--tenant-*)
4. Deletar variants cva() que o wrapper nao usa
5. Wrapper components/app-<nome>.tsx SO se primitive ganhar comportamento extra
6. pnpm validate:apca && pnpm lint --max-warnings 0
═══════════════════════════════════════════════════════════════════════════════
EOF

exit 0

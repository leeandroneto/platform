# Fase 6 — Tipagem estrita end-to-end

## Metadata

| Campo                | Valor                     |
| -------------------- | ------------------------- |
| **Número**           | 6                         |
| **Nome curto**       | `tipagem-estrita`         |
| **Estado**           | 🔵 Próxima                |
| **Camadas cobertas** | 1 (Código)                |
| **Depende de**       | 3, 5                      |
| **Bloqueia**         | 7, 30, 31, 34             |
| **Tamanho**          | M (1-2 dias)              |
| **Branch**           | `fase-06-tipagem-estrita` |

---

## Por que esta fase, por que agora

Tipagem estrita é fundação de tudo que vem depois. `any` em qualquer canto vira veneno: você refatora algo, TypeScript não pega o erro porque `any` engoliu, sobe pra produção, quebra. Discriminated unions vs booleanos soltos é diferença entre código que escala e código que vira spaghetti em 6 meses. Branded types pra IDs críticos (`ProfessionalId`, `ClientId`) impede classe de bugs onde IDs se misturam.

A Fase 6 elimina toda a dívida de tipagem **antes** de criar 30+ fases novas em cima. Custa 1-2 dias agora, custaria 1-2 semanas depois com risco de quebrar features no ar.

---

## Loop interno

### Passo 1 — Auditoria

**Cria:** `docs/auditorias/{data}-tipagem-estrita/`

**Categorias auditadas:**

````bash
SLUG="tipagem-estrita"
DATA=$(date +%Y-%m-%d)
PASTA="docs/auditorias/${DATA}-${SLUG}"
mkdir -p "${PASTA}" && cd "${PASTA}"

# README + decisions
cat > README.md <<EOF
# Auditoria: Tipagem estrita end-to-end

**Data:** ${DATA}
**Fase:** 6

## Categorias auditadas
1. \`any\` explícito
2. \`as any\` (cast escapatório)
3. \`@ts-ignore\` e \`@ts-expect-error\` sem comentário
4. Booleanos soltos em vez de discriminated union
5. IDs críticos como string crua (branded type recomendado pra ProfessionalId, ClientId)
6. Tipos manuais em vez de \`z.infer\`
7. \`unknown\` sem parsing/validação posterior
EOF

echo "# Decisões tomadas" > decisions.md

# 1. any explícito
echo "# Violações: any explícito" > violacoes-01-any.md
echo '```' >> violacoes-01-any.md
grep -rn ": any\b\|<any>\|: any\[" ../../../app ../../../components ../../../lib 2>/dev/null \
  | grep -v "node_modules\|.d.ts" >> violacoes-01-any.md
echo '```' >> violacoes-01-any.md

# 2. as any
echo "# Violações: as any" > violacoes-02-as-any.md
echo '```' >> violacoes-02-as-any.md
grep -rn "as any\b\|as unknown as" ../../../app ../../../components ../../../lib 2>/dev/null \
  | grep -v "node_modules" >> violacoes-02-as-any.md
echo '```' >> violacoes-02-as-any.md

# 3. ts-ignore / ts-expect-error
echo "# Violações: @ts-ignore (proibido) e @ts-expect-error sem comentário" > violacoes-03-ts-ignore.md
echo "" >> violacoes-03-ts-ignore.md
echo "## @ts-ignore (sempre proibido)" >> violacoes-03-ts-ignore.md
echo '```' >> violacoes-03-ts-ignore.md
grep -rn "@ts-ignore" ../../../app ../../../components ../../../lib 2>/dev/null \
  | grep -v "node_modules" >> violacoes-03-ts-ignore.md
echo '```' >> violacoes-03-ts-ignore.md
echo "" >> violacoes-03-ts-ignore.md
echo "## @ts-expect-error (precisa de comentário justificando)" >> violacoes-03-ts-ignore.md
echo '```' >> violacoes-03-ts-ignore.md
grep -rn "@ts-expect-error" ../../../app ../../../components ../../../lib 2>/dev/null \
  | grep -v "node_modules" >> violacoes-03-ts-ignore.md
echo '```' >> violacoes-03-ts-ignore.md
echo "" >> violacoes-03-ts-ignore.md
echo "**Auditar manualmente:** cada @ts-expect-error precisa ter comentário de justificativa na linha anterior." >> violacoes-03-ts-ignore.md

# 4. Booleanos soltos
echo "# Violações: booleanos soltos em vez de discriminated union" > violacoes-04-booleanos-soltos.md
echo "" >> violacoes-04-booleanos-soltos.md
echo "Heurística: estado com isLoading + isError + data?" >> violacoes-04-booleanos-soltos.md
echo '```' >> violacoes-04-booleanos-soltos.md
grep -rln "isLoading" ../../../app ../../../components 2>/dev/null | while read f; do
  if grep -q "isError\|hasError" "$f"; then
    echo "$f"
  fi
done >> violacoes-04-booleanos-soltos.md
echo '```' >> violacoes-04-booleanos-soltos.md

# 5. IDs como string crua (auditoria manual orientada)
echo "# Recomendação: branded types pra IDs críticos (ProfessionalId, ClientId)" > violacoes-05-ids-string.md
echo "" >> violacoes-05-ids-string.md
echo "Recomendado: branded types pra IDs críticos (ProfessionalId, ClientId). Outros IDs podem continuar como string." >> violacoes-05-ids-string.md
echo '```' >> violacoes-05-ids-string.md
echo "type ProfessionalId = string & { __brand: 'ProfessionalId' }" >> violacoes-05-ids-string.md
echo "type ClientId = string & { __brand: 'ClientId' }" >> violacoes-05-ids-string.md
echo '```' >> violacoes-05-ids-string.md
echo "" >> violacoes-05-ids-string.md
echo "## Heurística: professionalId e clientId tipados como string crua" >> violacoes-05-ids-string.md
echo '```' >> violacoes-05-ids-string.md
grep -rn "professionalId: string\|professionalId?: string\|clientId: string\|clientId?: string" \
  ../../../app ../../../components ../../../lib 2>/dev/null \
  | grep -v "node_modules\|.d.ts" >> violacoes-05-ids-string.md
echo '```' >> violacoes-05-ids-string.md

# 6. Tipos manuais vs z.infer
echo "# Violações: tipos manuais que deveriam vir de z.infer" > violacoes-06-tipo-vs-zod.md
echo "" >> violacoes-06-tipo-vs-zod.md
echo "Em lib/data/ e lib/domain/, tipos devem vir de z.infer<typeof Schema> sempre que houver schema Zod." >> violacoes-06-tipo-vs-zod.md
echo "Auditoria manual: pra cada arquivo com schema Zod, verificar se tipos relacionados usam z.infer." >> violacoes-06-tipo-vs-zod.md

# 7. unknown sem parsing
echo "# Violações: unknown sem parsing/validação" > violacoes-07-unknown-sem-parse.md
echo "" >> violacoes-07-unknown-sem-parse.md
echo "unknown é melhor que any, mas precisa ser tipado em algum momento via parse." >> violacoes-07-unknown-sem-parse.md
echo '```' >> violacoes-07-unknown-sem-parse.md
grep -rn ": unknown\b" ../../../app ../../../components ../../../lib 2>/dev/null \
  | grep -v "node_modules\|.d.ts" >> violacoes-07-unknown-sem-parse.md
echo '```' >> violacoes-07-unknown-sem-parse.md
````

### Passo 2 — Plano de execução

Uma wave por categoria com violações > 0. Modelo no `_TEMPLATE.md`.

**Paralelização:**

- Waves 01, 02 (any e as any) tocam mesmos arquivos frequentemente — sequenciais.
- Wave 03 (ts-ignore) independente — paralelo.
- Wave 04 (booleanos) toca componentes — paralelo com 03.
- Wave 05 (IDs críticos) tipos refactor — sequencial (mexe em props que outras waves podem tocar).
- Waves 06, 07 paralelas com 05.

### Passo 3 — Execução

Wave por wave. Anti-padrões da fase:

- Trocar `any` por `unknown` sem fazer parsing depois (§A4 do PADRAO-IMPECAVEL — "funcionar não é pronto").
- Esconder `any` em type alias (`type Foo = any` não vale).
- `as unknown as Foo` é cast forçado, igual `as any` — proibido.

### Passo 4 — Conferência

```bash
# Cada um deve retornar 0:
grep -rn ": any\b\|<any>\|: any\[" ../../../app ../../../components ../../../lib | grep -v node_modules | wc -l
grep -rn "as any\b\|as unknown as" ../../../app ../../../components ../../../lib | grep -v node_modules | wc -l
grep -rn "@ts-ignore" ../../../app ../../../components ../../../lib | grep -v node_modules | wc -l

# Cada @ts-expect-error com comentário (auditoria manual):
grep -rn -B 1 "@ts-expect-error" ../../../app ../../../components ../../../lib

# Globais:
pnpm exec tsc --noEmit  # 0 erros
pnpm lint               # 0 erros, 0 warnings
pnpm exec vitest run    # tudo verde
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

(Preenchido após conclusão.)

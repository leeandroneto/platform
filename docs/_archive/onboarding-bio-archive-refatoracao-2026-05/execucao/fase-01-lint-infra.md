# Fase 01 — Lint Infrastructure

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-01-lint-infra.md e execute"`
> **Tempo:** ~2h
> **Depende de:** Fase 00
> **Paralelo com:** nada (foundation — tudo depende dela)
> **Modelo:** Sonnet 4.6 — instala/configura, segue receita
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Instalar plugins de lint, configurar regras como WARN (nao error), rodar audit pra contar violacoes.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md` (regras do projeto)
3. Ler `docs/refatoracao-2026-05/03-estrategias-lint.md` (config detalhada)
4. Ler `eslint.config.mjs` (estado real — NUNCA confiar no doc, ler o arquivo)

## Itens

### Instalar plugins

```
[ ] 01.1 — pnpm add -D eslint-plugin-simple-import-sort eslint-plugin-unused-imports
[ ] 01.2 — pnpm add -D prettier prettier-plugin-tailwindcss
[ ] 01.3 — pnpm add -D knip
[ ] 01.4 — pnpm add -D @next/bundle-analyzer
```

### Configurar Prettier

```
[ ] 01.5 — Criar .prettierrc na raiz:
           {
             "semi": false,
             "singleQuote": true,
             "trailingComma": "all",
             "tabWidth": 2,
             "printWidth": 100,
             "plugins": ["prettier-plugin-tailwindcss"]
           }
[ ] 01.6 — Criar .prettierignore: .next, out, build, supabase/functions, onboarding-bio, node_modules
```

### Configurar knip

```
[ ] 01.7 — Criar knip.json na raiz (ver 03-estrategias-lint.md pra config completa)
```

### Atualizar eslint.config.mjs

IMPORTANTE: ler o arquivo REAL primeiro. Nao sobrescrever regras existentes.

```
[ ] 01.8 — Adicionar simple-import-sort (import + config do 03-estrategias-lint.md)
[ ] 01.9 — Adicionar unused-imports (import + regra)
[ ] 01.10 — EXPANDIR no-restricted-syntax com novos selectors como WARN:
            - <input> → Input
            - <textarea> → Textarea
            - <select> → Select
            - <table> → Table
            - <dialog> → Dialog
            - <label> → Label
            - <img> → Image
            - oklch em style={{}}
            - document.getElementById/querySelector/querySelectorAll
            NOTA: os selectors existentes (button, h1-h6, motion.button, hex/rgb/hsl)
            ja estao como ERROR — NAO mudar eles. So ADICIONAR os novos como WARN.

[ ] 01.11 — EXPANDIR no-restricted-imports (adicionar next/document, next/head,
            createClient, vitest, @/app/* — ver 03-estrategias-lint.md)
            CUIDADO: ESLint flat config substitui regra inteira. Consolidar
            todos os paths num unico bloco.
```

### Atualizar lint-staged

```
[ ] 01.12 — Editar .lintstagedrc.mjs pra incluir prettier:
            '!(scripts)/**/*.{js,jsx,ts,tsx,mjs,cjs}': [
              'eslint --max-warnings=0 --no-warn-ignored --fix',
              'prettier --write',
            ],
            '!(scripts)/**/*.{json,css,md,yml,yaml}': ['prettier --write'],
```

### Atualizar pre-push

```
[ ] 01.13 — Editar .husky/pre-push pra incluir knip:
            pnpm exec vitest run
            pnpm knip
```

### Rodar audit

```
[ ] 01.14 — pnpm lint 2>&1 | tee audit-output.txt
            Contar warnings por tipo. Registrar no CHECKLIST.md.
[ ] 01.15 — pnpm knip 2>&1 | tee knip-output.txt
            Registrar dead code encontrado.
[ ] 01.16 — pnpm exec tsc --noEmit (deve passar — nao mudamos codigo)
[ ] 01.17 — pnpm exec vitest run (deve passar)
```

### Commit

```
[ ] 01.18 — git pull --rebase origin main
[ ] 01.19 — git add -A && git commit -m "chore(lint): install simple-import-sort, unused-imports, prettier, knip — new rules as warn"
```

## Ao concluir

Reportar:

- Plugins instalados: X
- Novas regras lint adicionadas: X (como warn)
- Violacoes detectadas: X warnings por tipo
- Dead code (knip): X findings
- tsc/vitest: passam

Dizer ao fundador:

---

**Fase 01 concluida.**

Proximas fases desbloqueadas — **podem rodar em PARALELO (2 terminais)**:

**Terminal A:** `"leia docs/refatoracao-2026-05/execucao/fase-02-dead-code.md e execute"`
**Terminal B:** `"leia docs/refatoracao-2026-05/execucao/fase-03-shadcn-install.md e execute"`

## Fase 02 deleta componentes mortos. Fase 03 instala novos. Nao tocam nos mesmos arquivos — seguro rodar juntas.

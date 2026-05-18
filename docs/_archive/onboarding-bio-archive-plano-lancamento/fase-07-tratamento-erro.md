# Fase 7 — Tratamento de erro tipado em camadas

## Metadata

| Campo                | Valor                     |
| -------------------- | ------------------------- |
| **Número**           | 7                         |
| **Estado**           | 🔵 Próxima                |
| **Camadas cobertas** | 1, 2                      |
| **Depende de**       | 5, 6                      |
| **Bloqueia**         | 30, 46, 47                |
| **Tamanho**          | S (4-12h)                 |
| **Branch**           | `fase-07-tratamento-erro` |

---

## Por que esta fase, por que agora

Erros silenciosos são pior que crashes. `try { ... } catch (e) {}` engole problema, app continua rodando "OK", usuário vê dado errado, ninguém é alertado. Server action que dá `throw` em vez de retornar `{ ok: false, error }` quebra cliente sem mensagem útil. Toast "Algo deu errado, tente novamente" é insulto à inteligência do usuário e impossibilita debugging.

A Fase 7 estabelece padrão de tratamento de erro **antes** de criar features que vão lidar com pagamento (Fase 46), enrollment (Fase 47), webhook (Fase 53). Erros nessas áreas têm consequência real (cliente pagou e não recebe acesso, mensagem não dispara, dado fica inconsistente).

---

## Loop interno

### Passo 1 — Auditoria

**Cria:** `docs/auditorias/{data}-tratamento-erro/`

**Categorias:**

```bash
# 1. Catch vazio (engole erro)
echo "# Violações: catch vazio" > violacoes-01-catch-vazio.md
grep -rn "catch.*{[\s]*}" ../../../app ../../../components ../../../lib | grep -v node_modules

# 2. Catch só com console.log/warn (loga e segue como se não fosse erro)
echo "# Violações: catch só com console" > violacoes-02-catch-console.md
# Auditoria manual orientada: catch que tem apenas console.* sem rethrow ou tratamento

# 3. Server action que dá throw em vez de retornar discriminated union
echo "# Violações: server action com throw" > violacoes-03-server-action-throw.md
grep -rln "use server" ../../../app | while read f; do
  if grep -q "throw " "$f"; then
    echo "$f"
    grep -n "throw " "$f"
  fi
done

# 4. Toast com mensagem genérica
echo "# Violações: toast genérico" > violacoes-04-toast-generico.md
grep -rn 'toast.*"Algo deu errado\|toast.*"Erro ao\|toast.*"Ocorreu um erro\|toast.*"Tente novamente"' \
  ../../../app ../../../components

# 5. Falta de Error Boundary por área (só global)
echo "# Violações: Error Boundary global único em vez de por área" > violacoes-05-error-boundary.md
# Listar todos os ErrorBoundary e verificar se há boundaries por área lógica
grep -rn "ErrorBoundary" ../../../app ../../../components

# 6. Erros não tipados em lib/data
echo "# Violações: lib/data lança erro genérico" > violacoes-06-erro-nao-tipado.md
grep -rn "throw new Error(" ../../../lib/data 2>/dev/null
# Esperado: zero. Lib/data deve usar classes próprias (NotFoundError, etc.)

# 7. Lib/errors/ existe?
echo "# Status: lib/errors/" > status-lib-errors.md
if [ -d "../../../lib/errors" ]; then
  echo "Existe." >> status-lib-errors.md
  ls ../../../lib/errors/ >> status-lib-errors.md
else
  echo "NÃO existe. Precisa ser criado com classes: NotFoundError, UnauthorizedError, ValidationError, ConflictError." >> status-lib-errors.md
fi
```

### Passo 2 — Plano de execução

Wave especial **antes das outras**: criar `lib/errors/` com classes tipadas se ainda não existir. Depois waves por categoria.

```
waves/
├── wave-00-criar-lib-errors.md         (PRIMEIRO)
├── wave-01-catch-vazio.md
├── wave-02-catch-console.md
├── wave-03-server-action-throw.md
├── wave-04-toast-generico.md
├── wave-05-error-boundary-areas.md
├── wave-06-erro-tipado-em-data.md
└── README.md
```

### Passo 3 — Execução

**Wave 00 (criar `lib/errors/`)** — sequencial, todas as outras dependem dela.

Conteúdo esperado:

```typescript
// lib/errors/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` ${id}` : ''} não encontrado`, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  /* ... */
}
export class ValidationError extends AppError {
  /* ... */
}
export class ConflictError extends AppError {
  /* ... */
}
export class ExternalServiceError extends AppError {
  /* ... */
}
```

**Outras waves:** podem paralelizar (categorias diferentes em arquivos diferentes na maioria).

**Anti-padrões específicos:**

- "Vou só rethrow do catch" — não. Catch deve **tratar** ou **propagar com contexto enriquecido**, não passar adiante igual.
- "Toast genérico tá OK quando o erro não é tratável" — não. Mesmo erro não-tratável merece mensagem específica ("Falha ao processar pagamento. Cartão recusado pelo banco emissor.").

### Passo 4 — Conferência

```bash
# Catch vazio: 0
grep -rn "catch.*{[\s]*}" app/ components/ lib/ | grep -v node_modules | wc -l

# Server action com throw: 0
grep -rln "use server" app/ | while read f; do grep -l "throw " "$f"; done | wc -l

# Toast genérico: 0
grep -rn 'toast.*"Algo deu errado\|toast.*"Erro ao' app/ components/ | wc -l

# lib/data sem erro tipado: 0
grep -rn "throw new Error(" lib/data/ | wc -l

# lib/errors/ existe e tem classes mínimas
ls lib/errors/index.ts
grep -E "class (NotFoundError|UnauthorizedError|ValidationError|ConflictError)" lib/errors/index.ts
```

### Passo 5 — Decisão automática

Padrão.

---

## Resultado

(Preenchido após conclusão.)

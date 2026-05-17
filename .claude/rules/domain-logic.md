---
name: Domain layer rules
description: Lógica pura, zero IO, .test.ts obrigatório, ≤200 linhas
paths:
  - "lib/domain/**/*.ts"
---

## Regras Domain layer

### Zero IO
- NÃO `import 'react'`
- NÃO `import '@supabase/*'`
- NÃO `fetch()`, `setTimeout()`, `Date.now()` direto (injetar via param)
- NÃO ler `process.env` (env vem via param ou config injetado)

### Pureza
- Funções determinísticas: mesmo input → mesmo output
- Sem mutação de argumentos
- Sem side effects (logging, error reporting → camada acima)

### Tipos
- Usar `Result<T, AppError>` quando operação pode falhar de forma esperada
- Lançar `AppError` quando falha é estado inesperado (invariant break)
- Nunca retornar `null` quando `undefined` é semanticamente melhor

### Tamanho
- Arquivo ≤ 200 linhas
- Função ≤ 60 linhas
- Acima: extrair sub-funções no mesmo arquivo (não criar arquivo novo só por isso)

### Testabilidade
- TODA função em `lib/domain/` tem `<file>.test.ts` companheiro
- Vitest cobre golden path + edge cases + invariant violations
- Sem mocks (já é puro, não tem o que mockar)

## Anti-patterns

- ❌ `import { createClient } from '@supabase/supabase-js'`
- ❌ `import { useState } from 'react'`
- ❌ Função que chama API REST
- ❌ Função que lê filesystem
- ❌ Função que depende de `new Date()` sem injetar clock
- ❌ Função que registra log direto (passar logger via param ou throw)

## Exemplo

```ts
// lib/domain/macros/calculateTdee.ts
import { AppError } from '@/lib/contracts/errors'

export interface TdeeInput {
  weightKg: number
  heightCm: number
  ageYears: number
  sex: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'high'
}

export function calculateTdee(input: TdeeInput): number {
  if (input.weightKg <= 0 || input.heightCm <= 0) {
    throw AppError.invalidInput('weight and height must be positive')
  }
  // Mifflin-St Jeor formula
  // ...
}
```

```ts
// lib/domain/macros/calculateTdee.test.ts
import { describe, it, expect } from 'vitest'
import { calculateTdee } from './calculateTdee'

describe('calculateTdee', () => {
  it('matches Mifflin-St Jeor reference value for adult male', () => {
    expect(calculateTdee({ weightKg: 80, heightCm: 180, ageYears: 30, sex: 'male', activityLevel: 'moderate' }))
      .toBeCloseTo(2780, 0)
  })
})
```

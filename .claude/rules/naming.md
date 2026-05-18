---
name: Naming + vocab banido
description: Convenções de naming por camada + 16 termos proibidos no codebase
paths:
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
  - 'lib/**/*.ts'
  - 'supabase/**/*.{ts,sql}'
  - 'messages/**/*.json'
---

## Convenções de nomenclatura

| Camada                                                             | Idioma                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| DB schema (tabelas, colunas, enums, RPCs, Edge Functions, buckets) | **EN 100%**                                                 |
| Code identifiers (arquivos, pastas, types, componentes, funcoes)   | **EN 100%**                                                 |
| Pastas de rota em `app/`                                           | **EN (interno)**                                            |
| URL pública                                                        | **PT-BR via rewrites em `vercel.ts`**                       |
| Strings UI em componentes                                          | **PT-BR via `t()` em `messages/pt-BR.json`** (lint enforce) |
| Documentação interna                                               | **PT-BR livre**                                             |
| Brand identity                                                     | **via env (`NEXT_PUBLIC_BRAND_*`), nunca hardcoded**        |

## Palavras proibidas (16 termos — ESLint enforce)

| Banido                             | Use                               |
| ---------------------------------- | --------------------------------- |
| `student`                          | `client`                          |
| `trainer`                          | `professional`                    |
| `intake`                           | `capture_form`                    |
| `wizard`                           | `setup`                           |
| `prospect`                         | `lead`                            |
| `diagnostic`, `diagnostico`        | `assessment`                      |
| `customization`                    | `branding` / `theme`              |
| `workspace`                        | `tenant`                          |
| `framer-motion`                    | `motion/react`                    |
| `aluno` em folder/identifier       | `client` (URL via rewrite ok)     |
| `reflexao`, `pilares`, `ato_*`     | `reflection`, `pillars`, `act_*`  |
| `proximo_passo`                    | `next_step`                       |
| `prof-*` (abreviado)               | `professional-*` completo         |
| `legacy-*`, `_legacy/`             | não existe                        |
| `onboarding.bio`, `onboarding-bio` | nada — não citar (legado pausado) |
| `desafit` hardcoded                | `env.NEXT_PUBLIC_BRAND_NAME`      |

## Aplicação

Antes de qualquer resposta/código/doc: varrer mentalmente contra essa lista.
Se algum termo aparece → usar substituto. Se citar texto descritivo de fonte
externa que usa termo banido → citar em quote, traduzir pro canônico, não
propagar.

## Exceções aceitas

- `lgpd/` (acronimo legal BR)
- JSONB internal keys AI-bound legados (`pilares`, `reflexao`, `ato_*`) só
  em migration de dados — emitir como EN sempre que possível

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

## Princípio shadcn-canonical (ADR-0044)

**Adaptamos AO shadcn, não criamos vocabulário paralelo.** shadcn-canonical
**41 tokens (TweakCN-vocab)** é a interface pública obrigatória do design
system. Extras opt-in só após estudo prévio + ADR. Ver `.claude/rules/design-tokens.md`.

## Palavras proibidas (ESLint enforce)

| Banido                                                  | Use                                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `student`                                               | `client`                                                                   |
| `trainer`                                               | `professional`                                                             |
| `intake`                                                | `lead-capture` (kind do form)                                              |
| `wizard`                                                | `setup`                                                                    |
| `prospect`                                              | `lead`                                                                     |
| `diagnostic`, `diagnostico`                             | `assessment`                                                               |
| `customization`                                         | `branding` / `theme`                                                       |
| `workspace`                                             | `tenant`                                                                   |
| `framer-motion`                                         | `motion/react`                                                             |
| `aluno` em folder/identifier                            | `client` (URL via rewrite ok)                                              |
| `reflexao`, `pilares`, `ato_*`                          | `reflection`, `pillars`, `act_*`                                           |
| `proximo_passo`                                         | `next_step`                                                                |
| `prof-*` (abreviado)                                    | `professional-*` completo                                                  |
| `legacy-*`, `_legacy/`                                  | não existe                                                                 |
| `onboarding.bio`, `onboarding-bio`                      | nada — não citar (legado pausado)                                          |
| `desafit` hardcoded                                     | `env.NEXT_PUBLIC_BRAND_NAME`                                               |
| **Design system — ADR-0044 (vocab pivot)**              |                                                                            |
| `archetype` (como bundle estrutural)                    | tokens shadcn-canonical (legacy `tenants.archetype_id text` só até Fase 4) |
| `--role-*` (qualquer dos 67 invented)                   | tokens shadcn-canonical (`--background`, `--card`, etc)                    |
| `5 slots tipografia` (display/body/mono/accent/eyebrow) | 3 fontes canonical (`--font-sans/serif/mono`)                              |
| `voice tokens` per archetype                            | — (sem substituto, conceito morto)                                         |
| `native aliases archetype-specific`                     | extension opt-in via ADR + fallback chain                                  |
| `--shape-*` (ADR-0028 superseded)                       | `--radius` + Tailwind utilities                                            |
| `--elevation-flat/raised/overlay` (ADR-0042 superseded) | 8 níveis shadow algorítmicos derivados                                     |
| `mechanic-swap`, `tinted-brand`, `frosted-opt-in`, etc  | — (7 estratégias canônicas mortas)                                         |

## Vocabulário canônico de motores (Form Engine + Page Engine — Plano Dia 1)

Termos oficiais EN (DB + código). Aplicado em `lib/contracts/form*`, `lib/contracts/page*`,
`lib/forms/**`, `lib/engines/**`, `components/app-form-*`, `components/app-page-*`,
`app/(admin)/forms/**`, `app/(public)/**/f/**`, migrations relacionadas.

| Conceito                | Termo canônico    | A evitar em código (uso livre em UI/docs PT-BR) |
| ----------------------- | ----------------- | ----------------------------------------------- |
| Objeto inteiro          | `form`            | quiz, survey, questionnaire (são `kind`)        |
| Bloco no form           | `block`           | field                                           |
| Bloco que é pergunta    | `input block`     | question                                        |
| Container de blocos     | `step`            | page, section                                   |
| Definição publicada     | `version`         | revision                                        |
| Resposta de uma pessoa  | `submission`      | response (1 submission tem N responses)         |
| Resposta de um block    | `response`        | answer                                          |
| Resultado IA gerado     | `report`          | analysis, summary                               |
| Critério IA pra geração | `generation rule` | guideline                                       |
| Padrão pré-pronto       | `template`        | preset, recipe                                  |
| Variante A/B            | `variant`         | experiment-arm                                  |
| Regra condicional       | `logic rule`      | conditional, branch (em código)                 |

Enum `forms.kind` (Postgres):
`'form' | 'quiz' | 'survey' | 'assessment' | 'check-in' | 'lead-capture' | 'onboarding' | 'brief'`

- `brief` = form que alimenta IA pra gerar artifact (kind interno do feature "vibe coding")
- "vibe coding" continua sendo o NOME DA FEATURE (ação do profissional), não kind no banco.

## Aplicação

Antes de qualquer resposta/código/doc: varrer mentalmente contra essa lista.
Se algum termo aparece → usar substituto. Se citar texto descritivo de fonte
externa que usa termo banido → citar em quote, traduzir pro canônico, não
propagar.

## Exceções aceitas

- `lgpd/` (acronimo legal BR)
- JSONB internal keys AI-bound legados (`pilares`, `reflexao`, `ato_*`) só
  em migration de dados — emitir como EN sempre que possível
- `field` aparece em libs externas (React Hook Form `<FormField>`) — uso da lib OK,
  nosso domínio usa `block`/`input block`
- `branch` em docs sobre git branches (não condicional de form) — OK
- `question` em UI/copy PT-BR ("Pergunta 3 de 7") — OK; em código continua `block`

## Convenções de nomenclatura retake corrida

| Camada                                                        | Idioma                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| DB schema (tabelas/colunas/enums/RPCs/Edge Functions/buckets) | **EN 100%**                                                   |
| Code identifiers (arquivos/pastas/types/funções/componentes)  | **EN 100%**                                                   |
| Pastas de rota em `app/`                                      | **EN interno** (`(painel)`, `(auth)`, `(publico)`, `(admin)`) |
| URL pública                                                   | **PT-BR** via rewrites                                        |
| Strings UI em componentes                                     | **PT-BR via `t()`** em `messages/pt-BR/*.json`                |
| Documentação interna                                          | **PT-BR livre**                                               |

## Vocab canônico (use em código, PT-BR aparece via `t()` em UI)

### Identidade

| EN (código) | PT-BR (UI)                                                                               |
| ----------- | ---------------------------------------------------------------------------------------- |
| `tenant`    | "assessoria" / "run club" / "coach autônomo" — display livre via `tenants.display_label` |
| `staff`     | "equipe" — todo membership ≠ athlete/lead                                                |
| `member`    | "membro" — todos: staff + athletes + leads                                               |
| `owner`     | "responsável" / "dono" / "admin"                                                         |
| `coach`     | "treinador" / "coach"                                                                    |
| `reception` | "recepção" / "atendimento"                                                               |
| `finance`   | "financeiro"                                                                             |
| `marketing` | "marketing"                                                                              |
| `athlete`   | "atleta"                                                                                 |
| `lead`      | "lead" / "interessado"                                                                   |

### Corrida-vertical

| EN                | PT-BR                      |
| ----------------- | -------------------------- |
| `pace`            | "pace" / "ritmo"           |
| `threshold`       | "limiar"                   |
| `compliance`      | "aderência"                |
| `macrocycle`      | "temporada" / "macrociclo" |
| `mesocycle`       | "bloco" / "mesociclo"      |
| `microcycle`      | "semana" / "microciclo"    |
| `session`         | "sessão" / "treino"        |
| `workout_segment` | "segmento"                 |
| `wearable`        | "relógio" / "wearable"     |
| `event`           | "evento" / "prova"         |
| `lap`             | "volta"                    |
| `split`           | "parcial"                  |
| `PR`              | "recorde pessoal" / "PR"   |
| `assessment`      | "avaliação"                |
| `anamnese`        | "anamnese"                 |

## Banidos (ESLint enforce)

### Vocab que vazou de projetos genéricos anteriores

- `student` → `athlete`
- `trainer` → `coach`
- `professional` (era genérico) → `coach`
- `client` (como aluno-final) → `athlete` (manter `client` SÓ no sentido técnico — React client component, API client)
- `intake` → `lead-capture` / `captação`
- `wizard` → `setup`
- `prospect` → `lead`
- `diagnostic`/`diagnostico` → `assessment`
- `customization` → `theme`
- `workspace` → `tenant`
- `framer-motion` → `motion/react`
- `archetype` (DS retake é fixo, não tem) → nada
- `brand_parent` / `brand filhas` → nada
- Multi-vertical anything → nada (retake é vertical)
- Qualquer nome de projeto antigo → nada

## Convenções específicas retake

- **Cadence verbal:** `RUN. EAT. RECOVERY. REPEAT.` — staccato, hard stops. Reusa em landings (`Treina. Mede. Evolui.` / `Capta. Treina. Retém.`)
- **Casing:**
  - HEADLINES + LABELS → UPPERCASE (Oswald display)
  - Body & UI copy → sentence case (Hanken Grotesk)
  - Eyebrows → UPPERCASE com tracking `--tracking-eyebrow` (0.18em)
- **Métricas:** mono tabular vírgula decimal (`48,7 km`), unidades lowercase espaçadas (`15 min`), `R$` BR
- **Imperativo:** UI fala via ações (`Iniciar treino`, `Registrar`, `Ajustar`) — não "você/seu"
- **Zero emoji em UI** — energia vem de tipografia/cor/track motif

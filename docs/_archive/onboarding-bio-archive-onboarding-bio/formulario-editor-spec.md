# Formulário Editor · Spec

> **Manual único** do editor visual de formulários e do builder com IA. Substitui os 4 docs anteriores (`pesquisa.md`, `proposta-v2-ia.md`, `prompt-geracao-template.md`, `markmap-research.md`).
> **Status:** especificação pra ser implementada quando entrar no `PLANO_LANCAMENTO`. Possível entrar mais cedo se complexidade da fatia escolhida for baixa (ver §1.2).
> **Última atualização:** 2026-04-28

---

## §1 · Escopo e status

### 1.1 O que é

Editor visual onde o profissional **modifica ou cria do zero** um formulário/template do onboarding.bio. Substitui o paradigma de "wizard linear" por uma **árvore mental editável** onde cada nó é uma pergunta e clicar `+` na ponta de uma linha cria uma ramificação ou pergunta nova.

Cobre dois casos de uso convergentes:

- **Edição** de um template ativo (override em JSONB sobre a base oficial — padrão Hotmart, ver `docs/core/decisions.md` D24)
- **Criação assistida por IA** de um template novo a partir de descrição em linguagem natural (vibe coding builder, D38)

### 1.2 Quando entra no plano de lançamento

D38 difere o builder com IA pra **pós-launch**, mas com nuance: se a fatia escolhida pra primeiro release for simples (ex: só edição de override sobre base, sem geração IA), pode entrar **antes do beta**. Decisão a tomar quando o `PLANO_LANCAMENTO` for reescrito.

Critério: complexidade da fatia × valor pro profissional. Se mexer em formulário sem programador for o que destrava o produto, antecipa. Se for ajuste de UX sobre algo que já funciona, espera.

### 1.3 O que esta spec NÃO faz

- Não substitui o MASTER-SPEC dos templates (`docs/produto/templates/MASTER-SPEC.md`). MASTER-SPEC define o **conteúdo** do template; este doc define a **interface de edição**.
- Não duplica o prompt de geração de template — esse vive no MASTER-SPEC §13 (vibe coding em estágios).

---

## §2 · Visão do produto

### 2.1 Modelo mental

Profissional vê o formulário como árvore expandível:

```
📋 Formulário de Análise — Emagrecimento                       [Preview] [Publicar]

├── ✓ 1. Já tentou emagrecer antes?                            [sempre visível]
│   ├── Nunca, primeira vez
│   ├── Já tentei 1-2 vezes
│   └── Já tentei várias vezes
│
├── ✓ 2. Quantas vezes por semana você treina?                 [sempre visível]
│   └── slider 0-10 dias
│
├── 💡 3. [Sugerida] Como dorme?                               [sempre visível]
│   ├── 7-9h e acordo descansado
│   ├── Suficiente mas acordo cansado
│   ├── Menos de 6h
│   └── Insônia ou irregular
│
├── ✓ 4. Tem alguma condição?                                  [sempre visível]
│   ├── Nenhuma
│   ├── Cardíaca ⚠️                              [safety trigger]
│   ├── Diabetes ⚠️                              [safety trigger]
│   └── Dor crônica
│
└── + Adicionar pergunta
```

- ✓ = pergunta ativa
- 💡 = sugestão da IA, ainda não aceita
- ⚠️ = opção marca safety trigger

### 2.2 Princípios

| Princípio                                              | Detalhe                                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Árvore visual, não wizard linear**                   | Profissional vê a estrutura inteira de uma vez, expand/collapse por contexto                                |
| **Edição = override**                                  | Profissional NUNCA edita a base oficial. Edição cria/atualiza override em JSONB no `professional_templates` |
| **IA entrega árvore pronta, não sugere infinitamente** | 1 chamada IA por sessão (na entrada). Profissional refina sem mais IA. Sem loops                            |
| **Condicionais visíveis na árvore**                    | Não em painel separado. Indentação + label "Se X = Y"                                                       |
| **Validação estática, sem IA**                         | Regras determinísticas (mínimo 2 perguntas, sem condicional órfão, etc.)                                    |
| **Preview reusa o WizardRoot existente**               | Zero retrabalho de runtime — `mode: 'builder-preview'`                                                      |

---

## §3 · Modelo de dados

### 3.1 Schema do formulário (override)

```typescript
// lib/domain/types/form-builder.ts

type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'in'
  | 'not_in'
  | 'gt'
  | 'lt'
  | 'contains'
  | 'is_empty'
  | 'is_not_empty'

type Condition = {
  field: string // code da pergunta a avaliar
  operator: ConditionOperator
  value: string | number | string[]
}

type VisibilityRule = {
  logic: 'and' | 'or'
  conditions: Condition[]
}

type BuilderQuestion = {
  id: string // uuid (pra drag-drop keys)
  code: string // estável, snake_case
  type: 'single_choice' | 'multiple_choice' | 'text' | 'long_text' | 'number' | 'scale' | 'slider'
  label: string
  helper?: string
  placeholder?: string
  required: boolean
  position: number
  options?: BuilderOption[]
  validation?: {
    min?: number
    max?: number
    maxLength?: number
    maxSelections?: number
  }
  visibilityRule?: VisibilityRule // null = sempre visível
}

type BuilderOption = {
  id: string
  label: string
  value: string
  position: number
  isSafetyTrigger?: boolean
}

type FormSchema = {
  version: number // bumpa a cada save
  questions: BuilderQuestion[]
}
```

### 3.2 Onde guardar — override do profissional

`professional_templates.overrides` (JSONB) já existe (Hotmart pattern, D24). Estrutura:

```json
{
  "form_schema": { "version": 3, "questions": [...] },
  "added_questions": [...],
  "modified_options": { "question_code.option_code": {...} },
  "removed_questions": ["question_code"]
}
```

Quando o `form_schema` é null/empty → renderiza base do template oficial.
Quando existe → resolve base + override em runtime no `WizardRoot`.

### 3.3 Migração `parentValues` → `VisibilityRule`

Os 33 templates v1 usam `parentValues: { objective: "hypertrophy" }`. A migração pra `VisibilityRule`:

```typescript
// parentValues: { objective: "hypertrophy", experience: "beginner" }
// →
// visibilityRule: {
//   logic: 'and',
//   conditions: [
//     { field: 'objective', operator: 'eq', value: 'hypertrophy' },
//     { field: 'experience', operator: 'eq', value: 'beginner' }
//   ]
// }
```

Backward-compat na transição: se `visibilityRule` não existir, `WizardRoot` cai pra `parentValues`.

### 3.4 Mapa mental como entidade própria (alternativa pra fase 2+)

Se o editor evoluir pra mapa mental persistido (não só JSONB no template), tabela própria:

```sql
CREATE TABLE mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context_type TEXT NOT NULL CHECK (context_type IN (
    'form_builder', 'template_branches', 'product_decisions',
    'funnel', 'challenge_builder', 'roadmap', 'custom'
  )),
  context_ref_id UUID,    -- FK opcional pro recurso (template_id, etc.)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mind_map_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mind_map_id UUID NOT NULL REFERENCES mind_maps(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES mind_map_nodes(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  position_order INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active', 'decided', 'deferred', 'abolished', 'in_discussion'
  )),
  node_data JSONB DEFAULT '{}',  -- { color, icon, collapsed, links, notes }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_nodes_map ON mind_map_nodes(mind_map_id);
CREATE INDEX idx_nodes_parent ON mind_map_nodes(parent_id);
CREATE INDEX idx_nodes_order ON mind_map_nodes(mind_map_id, parent_id, position_order);
```

**Adjacency list escolhida sobre nested set / closure table / JSONB tree** — melhor balanço de reads/writes/Realtime granular pra 50-500 nós típicos.

RLS owner-only via `professional_id`.

---

## §4 · Engine

### 4.1 Evaluator puro

```typescript
// lib/domain/engine/conditions.ts — zero deps, testável

function evaluateCondition(
  condition: Condition,
  answers: Record<string, string | string[] | number>,
): boolean {
  const value = answers[condition.field]
  switch (condition.operator) {
    case 'eq':
      return value === condition.value
    case 'neq':
      return value !== condition.value
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(String(value))
    case 'not_in':
      return Array.isArray(condition.value) && !condition.value.includes(String(value))
    case 'gt':
      return Number(value) > Number(condition.value)
    case 'lt':
      return Number(value) < Number(condition.value)
    case 'contains':
      return String(value).includes(String(condition.value))
    case 'is_empty':
      return value == null || value === '' || (Array.isArray(value) && value.length === 0)
    case 'is_not_empty':
      return value != null && value !== '' && !(Array.isArray(value) && value.length === 0)
  }
}

function evaluateVisibility(
  rule: VisibilityRule | undefined,
  answers: Record<string, string | string[] | number>,
): boolean {
  if (!rule) return true
  const fn = rule.logic === 'and' ? 'every' : 'some'
  return rule.conditions[fn]((c) => evaluateCondition(c, answers))
}
```

### 4.2 Validação estática (sem IA)

```typescript
// lib/domain/engine/form-validation.ts

function validateFormSchema(schema: FormSchema): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  if (schema.questions.length < 2)
    errors.push('Adicione pelo menos 2 perguntas para gerar relatório útil.')

  if (schema.questions.length > 25)
    warnings.push('Formulários com mais de 25 perguntas têm taxa de abandono alta.')

  // Detectar condicionais órfãs (referenciam pergunta inexistente)
  const codes = new Set(schema.questions.map((q) => q.code))
  for (const q of schema.questions) {
    if (q.visibilityRule) {
      for (const c of q.visibilityRule.conditions) {
        if (!codes.has(c.field)) {
          errors.push(`Pergunta "${q.label}" referencia campo inexistente: ${c.field}`)
        }
      }
    }
  }

  // Detectar opções duplicadas, perguntas sem opções, etc.

  return { valid: errors.length === 0, errors, warnings }
}
```

Regras determinísticas. Sem IA. Mais confiável e zero custo.

---

## §5 · Fluxo do profissional (4 etapas)

### Etapa 1 · IA monta a árvore (5 segundos, 1 chamada)

Quando o profissional entra no editor pela primeira vez:

1. IA lê: perfil do Guided Setup + template base ativo + override existente (se houver)
2. IA gera árvore completa com 1-3 perguntas sugeridas, posicionadas, com condicionais já aplicadas
3. UI renderiza com animação progressiva (nós aparecem de cima pra baixo)

**Uma chamada, uma árvore. Sem iteração.** Detalhes do prompt: ver MASTER-SPEC §13 (vibe coding em estágios). Modelo: Haiku 4.5.

Output validado por Zod (`SuggestedQuestionSchema` em `lib/domain/ai/builder-schemas.ts`).

### Etapa 2 · Profissional refina (3-10 minutos, sem IA)

| Ação               | Onde                      | O que acontece                            |
| ------------------ | ------------------------- | ----------------------------------------- |
| Aceitar sugestão   | Click 💡 → Adicionar      | Vira ✓, integra na árvore                 |
| Rejeitar sugestão  | Click 💡 → Dispensar      | Some                                      |
| Editar label       | Click no texto            | Edição inline                             |
| Editar opções      | Expandir nó               | Add/remove/reorder com drag               |
| Editar condicional | Pill no nó                | Inline: Se [pergunta] [op] [valor]        |
| Reordenar pergunta | Drag handle               | Move na árvore                            |
| Adicionar manual   | "+" no final ou entre nós | Cria pergunta vazia                       |
| Deletar            | Menu ⋮                    | Confirmação                               |
| Restaurar padrão   | Botão                     | Reverte ao template base (apaga override) |

**A IA não participa mais.** Profissional no controle total. Crítico pra evitar "IA não para de sugerir".

### Etapa 3 · Preview interativo

Botão `[Preview]` abre o `WizardRoot` existente em modo embedded:

- Dados simulados (nome fictício, peso/altura aleatórios)
- Condicionais funcionando em tempo real
- Ao final, snippet de como o relatório usaria as respostas

Sem código novo no runtime — reusa `WizardRoot` com prop `mode='builder-preview'`.

### Etapa 4 · Publicar

Botão `[Publicar]`:

1. Validação estática (`validateFormSchema`)
2. Salva `overrides.form_schema` JSONB no `professional_templates`
3. Bumpa version do override
4. Feedback: "Seu formulário está no ar"
5. Redirect pro dashboard

---

## §6 · Vibe coding (geração via IA)

Quando profissional cria template novo do zero (não edita um existente), descreve em linguagem natural:

> "Quero um template de yoga pra ansiedade, público feminino 30-45, foco em respiração + postura"

A IA gera o template completo seguindo o **MASTER-SPEC §13** (estágios: Identidade → Motores → Perguntas → Branches → Pilares → Métricas → Coerência). Profissional revisa entre estágios, não só no final.

**Não duplicar o prompt aqui.** Esta spec referencia, MASTER-SPEC define.

---

## §7 · Lib visual: Mind Elixir

### 7.1 Por que Mind Elixir

Comparação completa em `markmap-research.md` (consolidada). Resumo:

| Lib             | Veredito                                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| **Mind Elixir** | 🥇 Click + branch nativo, MIT, mobile-friendly, ~30 KB, ativa (v5.10.0 abr/2026) |
| simple-mind-map | 🥈 Vue-centric, wrapper manual em React                                          |
| React Flow      | 🥉 Genérico demais, pro free é limitado                                          |
| Markmap         | Read-only — bom só pra Fase 1                                                    |
| jsMind          | Sem wrapper React                                                                |
| GoJS            | $3.5k/dev, proibitivo                                                            |

### 7.2 Wrapper React

```tsx
// components/builder/MindMap.tsx
'use client'
import { useEffect, useRef } from 'react'
import MindElixir from 'mind-elixir'

export function MindMap({ data, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mindRef = useRef<MindElixir | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const mind = new MindElixir({
      el: containerRef.current,
      direction: MindElixir.RIGHT,
      draggable: true,
      contextMenu: true,
      toolBar: true,
    })
    mind.init(data)
    mind.bus.addListener('operation', () => onChange?.(mind.getData()))
    mindRef.current = mind
    return () => mind.destroy()
  }, [])

  return <div ref={containerRef} className="h-full w-full" />
}
```

### 7.3 Padrões UX (gold standard Whimsical/Coggle)

| Padrão                         | Implementação                                                           |
| ------------------------------ | ----------------------------------------------------------------------- |
| Hover "+" pra adicionar branch | Nativo do Mind Elixir, customizar estilo                                |
| Tab = filho, Enter = irmão     | Configurar via Mind Elixir keyboard API                                 |
| Backspace = deletar            | Com confirmação se nó tem filhos                                        |
| Arrow keys = navegar           | Nativo                                                                  |
| Collapse/expand                | Click no nó. Estado em `node_data.collapsed`                            |
| Status badge visual            | Cor por status (verde=decidido, amarelo=em discussão, vermelho=abolido) |
| Auto-save                      | Debounce 500ms após operação. Sem botão "salvar"                        |

---

## §8 · Casos de uso (priorizados)

### 8.1 Edição de override de template (alta prioridade)

Estado atual: profissional não consegue editar formulário sem programador.

Com editor: árvore visual → click pra editar/adicionar/remover. Salva como override JSONB.

Features essenciais: click +, inline edit, drag pra reordenar, collapse/expand, condicionais inline.

### 8.2 Vibe coding builder de templates novos (média prioridade, depende D38)

Estado atual: criar template novo é manual (~1 dia, dev necessário).

Com builder: profissional descreve em linguagem natural, IA gera estrutura via MASTER-SPEC §13, profissional aprova entre estágios.

### 8.3 Mapa mental de decisões de produto (baixa prioridade, ferramenta interna)

Render visual de `decisions.md` com status por nó. Útil pra planejamento e onboarding de novos colaboradores.

### 8.4 Mapa mental do funil (baixa prioridade)

Funil de captação como árvore. Profissional personaliza seu funil clicando nos branches relevantes.

### 8.5 Builder de desafios (alta, mas depende do produto desafios estar maduro)

Profissional descreve desafio em árvore. IA expande cada nó. Mesmo padrão dos templates.

---

## §9 · Roadmap de implementação faseado

### Fase 1 · Read-only com Markmap (1-2 dias)

- Instalar `markmap-lib` + `markmap-view`
- Componente `<MarkdownMindMap content={markdown} />`
- Renderizar markdown existente como mapa visual
- Usado em: preview de `decisions.md`, preview de branches de templates atuais

**Valor:** validar se formato visual agrega antes de investir no editor.

### Fase 2 · Editor com Mind Elixir (1-2 semanas)

- Schema mind_maps + mind_map_nodes (migration)
- Componente `<FormBuilder templateId={id} />` com Mind Elixir
- CRUD: criar/editar/mover/deletar nós + opções
- Status por nó (active/decided/deferred/abolished)
- Validação estática + preview reusando WizardRoot
- Server actions em `app/(app)/(shell)/formulario-editor/actions.ts`
- Persistência: override em `professional_templates.overrides.form_schema`

**Dependência:** Fase 1 validada.

### Fase 3 · Vibe coding + colaborativo (3-4 semanas, pós-launch D38)

- Geração via IA seguindo MASTER-SPEC §13 (estágios)
- Edge Function `builder-assist` (Haiku 4.5 pra sugestões, Sonnet pra estrutura)
- Versionamento: `mind_map_versions` com snapshot JSONB
- Realtime multi-user (Supabase Realtime)
- Conflict resolution (operational transform ou CRDT)

**Dependência:** D38 desbloqueado (1 template ponta-a-ponta validado primeiro).

---

## §10 · Stack técnico

| Componente                     | Lib                                                 | Razão                                |
| ------------------------------ | --------------------------------------------------- | ------------------------------------ |
| Mapa mental editável           | `mind-elixir`                                       | Click + branch nativo, MIT, mobile   |
| Mapa mental read-only (Fase 1) | `markmap-lib` + `markmap-view`                      | Markdown → SVG, zero esforço         |
| Drag-and-drop opções           | `@dnd-kit/core` + `@dnd-kit/sortable`               | Padrão shadcn, touch nativo          |
| Cards de pergunta              | shadcn `Card` + `Collapsible`                       | Edição inline ao expandir            |
| Seletor de tipo                | shadcn `Select` ou `Command`                        | "/" pra buscar tipo                  |
| Condições inline               | shadcn `Select` + `Input` + `Badge`                 | Pills visuais                        |
| Preview                        | `WizardRoot` em modo `builder-preview`              | Zero retrabalho de runtime           |
| Mobile (Fase 2+)               | `@dnd-kit` com `TouchSensor` + bottom sheets shadcn | Edição por toque                     |
| Persistência                   | `professional_templates.overrides` JSONB            | Padrão Hotmart já existente          |
| IA (Fase 3)                    | Edge Function + Haiku 4.5 + Zod                     | 1 chamada por sessão, rate-limited   |
| Realtime (Fase 3)              | Supabase Realtime                                   | Sync multi-user nos `mind_map_nodes` |

---

## §11 · Riscos e trade-offs

| Risco                                 | Impacto                        | Mitigação                                                                   |
| ------------------------------------- | ------------------------------ | --------------------------------------------------------------------------- |
| Mind Elixir sem wrapper React oficial | Wrapper manual com `useEffect` | ~30 linhas, padrão pra libs vanilla                                         |
| Comunidade menor que React Flow       | Menos exemplos                 | Docs oficiais bons, MIT pra forkar se necessário                            |
| Mobile UX em telas pequenas           | Mapa apertado com muitos nós   | Zoom/pan nativo. Limitar profundidade visível (collapse auto)               |
| Performance com 500+ nós              | Render lento                   | Mind Elixir DOM direto. Pra 500 OK. Acima de 1000, considerar virtualização |
| Adjacency list + queries hierárquicas | Recursive CTE pode ser caro    | Pra 50-500 nós, carregar tudo client-side. ltree como cache se precisar     |
| Realtime conflict resolution          | Dois users editando mesmo nó   | Fase 3 problem. Operational transform ou CRDT. Single-user na Fase 2        |
| Manutenção da lib se abandonada       | Migrar custa caro              | MIT, API surface pequena. Plano B: simple-mind-map ou React Flow            |
| Scope creep                           | Virar produto inteiro          | Manter como ferramenta de edição + builder. Não virar "Miro competitor"     |

---

## §12 · Decisões pendentes (todas pra hora da implementação)

| #   | Decisão                                                                          | Quando decidir                          |
| --- | -------------------------------------------------------------------------------- | --------------------------------------- |
| FE1 | Operadores na v1: só `eq`/`neq`, ou já incluir `in`/`not_in`?                    | Início Fase 2                           |
| FE2 | Regenerar sugestões da IA: permitir ou one-shot por sessão?                      | Início Fase 3                           |
| FE3 | Perguntas do template base: editáveis ou read-only no editor?                    | Início Fase 2                           |
| FE4 | Mobile: bottom sheet pra editar nó ou inline expandido?                          | Design da UI                            |
| FE5 | Preview: reusar WizardRoot direto ou criar wrapper simplificado?                 | Quando WizardRoot tiver prop `embedded` |
| FE6 | Quando entrar no plano: pré-launch (fatia simples) ou pós-launch (D38 completo)? | Reescrita do PLANO_LANCAMENTO           |

---

## §13 · Referências

- [Mind Elixir](https://github.com/SSShooter/mind-elixir-core) — MIT, v5.10.0
- [Markmap](https://markmap.js.org/) — MIT, read-only
- [React Flow](https://reactflow.dev/) — MIT core
- [SurveyJS Conditional Logic](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic) — referência de schema
- [Tally Conditional Form Logic](https://tally.so/help/conditional-form-logic) — referência UX inline
- [PostgreSQL ltree](https://www.postgresql.org/docs/current/ltree.html) — extensão Supabase
- `docs/produto/templates/MASTER-SPEC.md` §13 — vibe coding em estágios
- `docs/core/decisions.md` D24 — Hotmart pattern (Template → Instância → Override)
- `docs/core/decisions.md` D38 — vibe coding builder deferido pós-launch

# Checklist — 7 estados por componente interativo

## Estado

**Requer verificacao manual no Ladle.** Tabela preenchida com analise de codigo (nao visual).

Para validacao completa: abrir `pnpm exec ladle dev` e confirmar cada estado visualmente.

## Analise baseada em codigo

| Componente           | default    | hover        | active         | focus-visible        | disabled        | loading            | error              |
| -------------------- | ---------- | ------------ | -------------- | -------------------- | --------------- | ------------------ | ------------------ |
| Button (default)     | Sim (code) | Sim (hover:) | Sim (active:)  | Sim (focus-visible:) | Sim (disabled:) | Sim (loading prop) | N/A                |
| Button (primary)     | Sim        | Sim          | Sim            | Sim                  | Sim             | Sim                | N/A                |
| Button (destructive) | Sim        | Sim          | Sim            | Sim                  | Sim             | Sim                | N/A                |
| IconButton           | Sim        | Sim          | Sim            | Sim                  | Sim             | Sim                | N/A                |
| SelectionCard        | Sim        | Sim          | Sim (whileTap) | Sim                  | Sim             | N/A                | N/A                |
| Input                | Sim        | Sim          | N/A            | Sim                  | Sim             | N/A                | Sim (aria-invalid) |
| Select               | Sim        | Sim          | N/A            | Sim                  | Sim             | N/A                | Sim                |
| Combobox             | Sim        | Sim          | N/A            | Sim                  | Sim             | Sim                | N/A                |
| Switch               | Sim        | Sim          | N/A            | Sim                  | Sim             | N/A                | N/A                |
| RadioGroup           | Sim        | Sim          | N/A            | Sim                  | Sim             | N/A                | N/A                |
| Checkbox             | Sim        | Sim          | N/A            | Sim                  | Sim             | N/A                | N/A                |

## Notas

- "Sim (code)" = estado existe no codigo (classes/props). Nao verificado visualmente.
- "N/A" = estado nao se aplica ao componente (ex: Button nao tem estado error; Input nao tem estado active).
- Button loading state usa `<Loader2>` spinner via prop `loading`.
- SelectionCard usa `motion` para active state (whileTap spring).
- Inputs usam `aria-invalid` para estado de erro, com ring vermelha via Tailwind.

## Veredicto: PENDENTE (requer verificacao visual no Ladle)

A analise de codigo indica que todos os estados esperados estao implementados. Falta confirmacao visual.

### Issue rastreado

- [ ] Abrir Ladle e validar visualmente cada estado, marcar check definitivo

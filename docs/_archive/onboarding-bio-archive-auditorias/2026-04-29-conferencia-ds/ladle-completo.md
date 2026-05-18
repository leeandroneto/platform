# Ladle catalog completo

Auditado em 2026-04-29.

## Stories existentes (14)

| #   | Componente              | Story file                      | Status |
| --- | ----------------------- | ------------------------------- | ------ |
| 1   | Heading (todos levels)  | `heading.stories.tsx`           | Existe |
| 2   | Text (todas variants)   | `text.stories.tsx`              | Existe |
| 3   | Button (8 tipos)        | `button.stories.tsx`            | Existe |
| 4   | IconButton              | `icon-button.stories.tsx`       | Existe |
| 5   | EmptyState (3 variants) | `empty-state.stories.tsx`       | Existe |
| 6   | StatusDot/Badge/Banner  | `status.stories.tsx`            | Existe |
| 7   | SegmentedControl        | `segmented-control.stories.tsx` | Existe |
| 8   | Combobox                | `combobox.stories.tsx`          | Existe |
| 9   | DataTable               | `data-table.stories.tsx`        | Existe |
| 10  | ResponsiveDrawer        | `responsive-drawer.stories.tsx` | Existe |
| 11  | BottomTabBar            | `bottom-tab-bar.stories.tsx`    | Existe |
| 12  | FormSection             | `form-section.stories.tsx`      | Existe |
| 13  | KBD                     | `kbd.stories.tsx`               | Existe |
| 14  | SkeletonVariants        | `skeleton-variants.stories.tsx` | Existe |

## Componentes DS sem story (14)

| #   | Componente               | Arquivo               | Criticidade                                  |
| --- | ------------------------ | --------------------- | -------------------------------------------- |
| 1   | AlertDialog              | `alert-dialog.tsx`    | Media — overlay critico, precisa story       |
| 2   | Card                     | `card.tsx`            | Media — componente estrutural                |
| 3   | Input                    | `input.tsx`           | Alta — input primario                        |
| 4   | Select                   | `select.tsx`          | Alta — input primario                        |
| 5   | Switch                   | `switch.tsx`          | Media                                        |
| 6   | RadioGroup               | `radio-group.tsx`     | Media                                        |
| 7   | Checkbox                 | `checkbox.tsx`        | Media                                        |
| 8   | CheckboxGroup            | `checkbox-group.tsx`  | Baixa — wrapper de Checkbox                  |
| 9   | Textarea                 | `textarea.tsx`        | Media                                        |
| 10  | MobileTopBar             | `mobile-top-bar.tsx`  | Baixa — chrome component                     |
| 11  | MobileList               | `mobile-list.tsx`     | Baixa — provavelmente coberto por data-table |
| 12  | CommandPalette           | `command-palette.tsx` | Media                                        |
| 13  | SelectionCard (Fase 22)  | `selection-card.tsx`  | Alta — componente novo, precisa validacao    |
| 14  | UploadDropzone (Fase 22) | `upload-dropzone.tsx` | Alta — componente novo, precisa validacao    |

## Cobertura

- **14/28 componentes DS tem story = 50%**
- Abaixo do target de 90%

## Nota sobre FormSection

`form-section.stories.tsx` pode cobrir parcialmente Input, Select, Switch, etc. se mostra inputs dentro de FormSection. Verificar conteudo manualmente no Ladle.

## Veredicto: FALHA (50% < 90%)

Nao bloqueia selar o DS — stories faltando nao indicam regressao. Componentes existem e sao usados no produto. O gap e de documentacao/catalogo, nao de funcionalidade.

### Issues rastreados (por prioridade)

- [ ] Story: SelectionCard (novo Fase 22, precisa validacao visual)
- [ ] Story: UploadDropzone (novo Fase 22, precisa validacao visual)
- [ ] Story: Input (campo primario)
- [ ] Story: Select (campo primario)
- [ ] Story: AlertDialog (overlay critico)
- [ ] Story: Card (estrutural)
- [ ] Story: Switch, RadioGroup, Checkbox, Textarea
- [ ] Story: CommandPalette
- [ ] Story: MobileTopBar, MobileList, CheckboxGroup (baixa prioridade)

# shadcn/ui — Auditoria agressiva do projeto

> Gerado 2026-05-03. **Regra:** shadcn é o default. Custom só quando comprovadamente impossível.
> Legenda: ✅ já shadcn | 🔄 migrar para shadcn | 🧱 adotar bloco como base | ❌ genuinamente impossível (SVG, motion, domínio puro)

---

## components/ui/ — primitivos

### Já são shadcn ✅ (nada a fazer)

| Componente    | Primitivo base               |
| ------------- | ---------------------------- |
| accordion     | Radix Accordion              |
| alert         | CVA                          |
| alert-dialog  | Radix AlertDialog            |
| avatar        | Radix Avatar                 |
| badge         | Radix Slot + CVA             |
| breadcrumb    | HTML nativo                  |
| button        | Radix Slot + CVA             |
| calendar      | react-day-picker             |
| card          | HTML nativo                  |
| carousel      | embla-carousel               |
| chart         | recharts + ChartContainer    |
| checkbox      | Radix Checkbox               |
| collapsible   | Radix Collapsible            |
| command       | cmdk                         |
| dialog        | Radix Dialog                 |
| drawer        | vaul                         |
| dropdown-menu | Radix DropdownMenu           |
| empty         | CVA                          |
| field         | CVA + Label + Separator      |
| form          | react-hook-form + Radix Slot |
| input         | HTML nativo                  |
| item          | Radix Slot + CVA             |
| kbd           | HTML nativo                  |
| label         | Radix Label                  |
| pagination    | buttonVariants               |
| popover       | Radix Popover                |
| progress      | Radix Progress               |
| radio-group   | Radix RadioGroup             |
| scroll-area   | Radix ScrollArea             |
| select        | Radix Select                 |
| separator     | Radix Separator              |
| sheet         | Radix Dialog (side)          |
| skeleton      | HTML nativo                  |
| slider        | HTML nativo — **VER ABAIXO** |
| sonner        | sonner wrapper               |
| spinner       | SVG + CVA                    |
| switch        | Radix Switch                 |
| table         | HTML nativo                  |
| tabs          | Radix Tabs + CVA             |
| textarea      | HTML nativo                  |
| toggle        | Radix Toggle + CVA           |
| toggle-group  | Radix ToggleGroup            |
| tooltip       | Radix Tooltip                |

### Migrar para shadcn 🔄

| Componente               | Problema                                                                       | Ação                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `slider.tsx`             | HTML puro sem Radix — sem keyboard nav completo, sem ARIA nativo               | `pnpm dlx shadcn@latest add slider` — instala versão Radix                             |
| `FormModal.tsx`          | Wrapper de Dialog com motion — duplica Dialog + adiciona dependência de Motion | Simplificar para usar `Dialog` diretamente; animation via CSS ou data-state            |
| `DeleteConfirmation.tsx` | Thin wrapper de AlertDialog — não adiciona nada além de props fixas            | Inline nos callers ou manter se reutilizado >3×; sem justificativa de arquivo separado |

### Primitivos custom intencionais ❌ (estes ficam — são o DS do projeto)

| Componente                 | Por que fica custom                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `heading.tsx`              | Semântica de níveis (h1-h6) + tipografia via tokens DS — shadcn não tem equivalente tipográfico |
| `text.tsx`                 | Variantes `body/label/mono/caption` com tokens DS                                               |
| `eyebrow.tsx`              | Primitive de seção acima de headings — sem equivalente                                          |
| `section-title.tsx`        | Primitive de layout (eyebrow + heading + description)                                           |
| `skip-link.tsx`            | A11y — nenhum shadcn tem esse primitive                                                         |
| `upload-dropzone.tsx`      | Upload custom com preview — shadcn não tem dropzone                                             |
| `CopyButton.tsx`           | Clipboard utility — sem equivalente shadcn                                                      |
| `CrudManager.tsx`          | Abstração de negócio do projeto — orquestra Dialog + AlertDialog + Empty                        |
| `SectionErrorBoundary.tsx` | React class component — sem equivalente shadcn                                                  |
| `Walkthrough.tsx`          | Guide overlay com Motion — genuinamente custom                                                  |

---

## components/dashboard/ — shell do profissional

| Componente                   | Status | Ação                                                                                                                                                                          |
| ---------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardLayout.tsx`        | 🧱     | Substituir pela estrutura do bloco **`sidebar-07`** (colapsa pra ícones). Orquestrador passa a usar `SidebarProvider` + `SidebarInset`                                        |
| `SidebarNav.tsx`             | 🔄     | Reescrever com `Sidebar`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuBadge`, `SidebarFooter`. Bloco **`sidebar-07`** como base                                           |
| `DrawerNav.tsx`              | 🔄     | Substituir pelo Sheet mode nativo do shadcn Sidebar (quando `<Sidebar>` é instalado, mobile usa Sheet automaticamente via `SidebarProvider`)                                  |
| `MobileNav.tsx`              | ❌     | Bottom nav flutuante com safe-area — sem equivalente em nenhum bloco shadcn. Usa apenas primitivos (cn + tokens + Link). Fica custom                                          |
| `DashboardEmptyState.tsx`    | 🔄     | Verificar se usa `<Empty>` do ui/. Se não, migrar                                                                                                                             |
| `LeadsChart.tsx`             | 🔄     | Usa recharts direto sem `ChartContainer`. Envolver em `<ChartContainer config={}>` + `<ChartTooltip>`. Bloco **`chart-area-interactive`** como referência para range selector |
| `LeadFilters.tsx`            | ✅     | Usa Select + Input — já shadcn                                                                                                                                                |
| `CopyLinkButton.tsx`         | 🔄     | Duplica `CopyButton` de `ui/`. Deletar e usar `<CopyButton>`                                                                                                                  |
| `DashboardWalkthrough.tsx`   | ❌     | Motion overlay — genuinamente custom                                                                                                                                          |
| `LeadNoteEditor.tsx`         | ✅     | Textarea + Button — já shadcn                                                                                                                                                 |
| `LeadStatusChanger.tsx`      | ✅     | Select/DropdownMenu — já shadcn                                                                                                                                               |
| `SubscriptionStatusCard.tsx` | ✅     | Card + Badge — já shadcn                                                                                                                                                      |

---

## components/auth/ — formulários de login/signup

| Componente              | Status | Ação                                                                                                                                                                                                                                                             |
| ----------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LoginForm.tsx`         | 🔄     | O formulário usa shadcn (`Field`, `Input`, `Button`), mas o **input de senha usa div relativa manual** em vez de `InputGroup`. Migrar ícone de email + olho de senha para **`input-group`** quando instalado. Exemplo: `input-group-icon` + `input-group-button` |
| `SignupForm.tsx`        | 🔄     | Igual ao LoginForm — mesma migração para `InputGroup`                                                                                                                                                                                                            |
| `ResetPasswordForm.tsx` | ✅     | Field + Input + Button — já shadcn                                                                                                                                                                                                                               |
| `Divider.tsx`           | 🔄     | Divisor "ou" com linha. Trocar por `<Separator>` com texto central (padrão shadcn)                                                                                                                                                                               |

### Pages de auth — layouts (app/(auth)/)

| Página            | Status | Ação                                                                                                                                    |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `login/page.tsx`  | 🧱     | Adotar layout do bloco **`login-04`** (formulário + imagem) ou **`login-02`** (duas colunas). O form interno permanece com lógica atual |
| `signup/page.tsx` | 🧱     | Adotar layout do bloco **`signup-04`** ou **`signup-02`**                                                                               |

---

## components/funnel/ — editor de template/formulário

| Componente                          | Status | Ação                                                                                                                                                         |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SpecialtyTemplateManager.tsx`      | 🔄     | Busca com Input + lista de cards de especialidade. Parte de busca+filtro → **`Command`** (já instalado). Cards de especialidade → `Item` com `data-selected` |
| `preview/PreviewFAB.tsx`            | ✅     | Button flutuante — já shadcn                                                                                                                                 |
| `preview/PreviewSheet.tsx`          | ✅     | Já usa `Sheet` — shadcn                                                                                                                                      |
| `preview/ReportPreview.tsx`         | ❌     | Renderização de relatório — domínio puro                                                                                                                     |
| `shared/ChangesBadge.tsx`           | ✅     | `Badge` — já shadcn                                                                                                                                          |
| `shared/InfoBadge.tsx`              | ✅     | `Badge` + `Tooltip` — já shadcn                                                                                                                              |
| `shared/AddCustomOptionForm.tsx`    | ✅     | Field + Input + Button — já shadcn                                                                                                                           |
| `shared/BottomSheet.tsx`            | 🔄     | Usa `Sheet side="bottom"`. Migrar para **`Drawer`** (vaul) que tem gesture nativo + snap points mobile                                                       |
| `shared/Field.tsx`                  | 🔄     | **DELETAR** — duplica `components/ui/field.tsx` que já existe. Substituir callers                                                                            |
| `shared/PlaceholderChips.tsx`       | ✅     | Badge — já shadcn                                                                                                                                            |
| `tabs/ConfigTab.tsx`                | ✅     | Tabs + shadcn primitives                                                                                                                                     |
| `tabs/FormularioTab.tsx`            | ✅     | Tabs                                                                                                                                                         |
| `tabs/ProximoPassoTab.tsx`          | ✅     | Usa shadcn primitives                                                                                                                                        |
| `tabs/RelatorioTab.tsx`             | ✅     | Usa shadcn primitives                                                                                                                                        |
| `tabs/_respostas/OptionBrowser.tsx` | 🔄     | Lista de opções com busca manual. Substituir pela estrutura de **`Command`**: `CommandInput` + `CommandList` + `CommandItem`                                 |
| `tabs/_respostas/OptionPanel.tsx`   | ✅     | Painel de detalhes — usa shadcn primitives                                                                                                                   |
| `tabs/_respostas/QuestionNav.tsx`   | 🔄     | Navegação entre perguntas com lista de itens. Usar **`Item`** (já instalado) em vez de divs custom                                                           |

---

## components/landing/ — editor de site público

| Componente                                 | Status | Ação                                                                                                                                                                                                                                 |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LandingEditor.tsx`                        | 🔄     | Orquestrador com lista de seções + Drawer de edição. A lista de seções (nav lateral no desktop) → usar **`Sidebar`** como nav de seções do editor, com `SidebarMenu` por grupo. Exatamente o padrão **`sidebar-08`** (inset sidebar) |
| `editor/_components/HeroTab.tsx`           | ✅     | Field + Input + Textarea — já shadcn                                                                                                                                                                                                 |
| `editor/_components/AboutTab.tsx`          | ✅     | Idem                                                                                                                                                                                                                                 |
| `editor/_components/StatsTab.tsx`          | ✅     | Field + Input                                                                                                                                                                                                                        |
| `editor/_components/TestimonialsTab.tsx`   | ✅     | CrudManager                                                                                                                                                                                                                          |
| `editor/_components/FaqTab.tsx`            | ✅     | CrudManager                                                                                                                                                                                                                          |
| `editor/_components/MethodologyTab.tsx`    | ✅     | CrudManager                                                                                                                                                                                                                          |
| `editor/_components/ExperienceTab.tsx`     | ✅     | CrudManager                                                                                                                                                                                                                          |
| `editor/_components/ResultsTab.tsx`        | ✅     | CrudManager                                                                                                                                                                                                                          |
| `editor/_components/PlansTab.tsx`          | ✅     | Form fields                                                                                                                                                                                                                          |
| `editor/_components/QuickCtaTab.tsx`       | ✅     | Form fields                                                                                                                                                                                                                          |
| `editor/_components/TickerTab.tsx`         | ✅     | CrudManager                                                                                                                                                                                                                          |
| `editor/_components/VisibilityTab.tsx`     | ✅     | Toggle + Switch                                                                                                                                                                                                                      |
| `editor/_components/SectionItemSheet.tsx`  | ✅     | Sheet — já shadcn                                                                                                                                                                                                                    |
| `editor/_components/SectionPreview.tsx`    | ❌     | Preview visual de seção — domínio puro                                                                                                                                                                                               |
| `ShowcaseAutoScroll.tsx`                   | ❌     | Motion scroll automático — custom                                                                                                                                                                                                    |
| `PremiumLanding.tsx`                       | 🔄     | Landing page pública. Seção de depoimentos → **`Carousel`** (já instalado) em vez de scroll custom. Bloco **`dashboard-01`** não se aplica, mas `sidebar-08` pode inspirar o layout de features com nav lateral                      |
| `premium/sections/PremiumNav.tsx`          | 🔄     | Nav horizontal de landing. Substituir por **`NavigationMenu`** (a instalar — Fase 45D)                                                                                                                                               |
| `premium/sections/PremiumTestimonials.tsx` | 🔄     | Testimonials com scroll. Substituir por **`Carousel`** (já instalado)                                                                                                                                                                |
| `onboarding/Breather.tsx`                  | ❌     | Tela cinematográfica Motion — impossível com shadcn                                                                                                                                                                                  |
| `onboarding/Nav.tsx`                       | 🔄     | Nav de steps. Usar **`Button`** + progress indicator customizado; ou `Tabs` em modo navegacional                                                                                                                                     |
| `onboarding/ThemeToggle.tsx`               | ✅     | `Button` toggle — já shadcn                                                                                                                                                                                                          |

---

## components/settings/ — configurações do profissional

| Componente               | Status | Ação                                                                                                                                                                                             |
| ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DesignForm.tsx`         | 🔄     | Seleção de templates/estilos com cards. A grade de cards de estilo (Energia/Clínico/Raiz etc.) → padrão **`field-choice-card`** (exemplo shadcn). Input de cor → `InputGroup` com preview de cor |
| `MobileCollapsible.tsx`  | 🔄     | Já usa `Collapsible` + `Item`. Poderia ser simplificado para **`Accordion`** (já instalado) que dá o mesmo comportamento com menos código                                                        |
| `CustomLinksSection.tsx` | ✅     | CrudManager — já shadcn                                                                                                                                                                          |
| `PackageManager.tsx`     | ✅     | CrudManager — já shadcn                                                                                                                                                                          |

---

## components/form/ — formulários de lead e diagnóstico

| Componente                      | Status | Ação                                                                                                |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `audit/QuestionScreen.tsx`      | ❌     | Multi-step question screen — domínio específico com lógica de pergunta/resposta                     |
| `audit/_blocks/MultiSelect.tsx` | 🔄     | Botões de seleção múltipla com max. Substituir por **`ToggleGroup type="multiple"`** (já instalado) |
| `lead/_steps/primitives.tsx`    | ❌     | Motion primitives de haptic feedback — custom                                                       |

---

## components/report/ — relatórios

| Componente                                    | Status | Ação                                                                                                  |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| `audit/_shared/NarrativeBlock.tsx`            | ✅     | Card + Text — já shadcn                                                                               |
| `audit/_shared/ScrollProgress.tsx`            | ❌     | Progress bar baseado em scroll position — sem equivalente shadcn                                      |
| `lead/_sections/Ticker.tsx`                   | ❌     | Marquee animado — custom Motion                                                                       |
| `lead/_sections/PapelProfissionalSection.tsx` | ✅     | Card + Text — já shadcn                                                                               |
| `lead/_sections/ProfessionalBlock.tsx`        | ✅     | Card + Avatar — já shadcn                                                                             |
| `lead/_sections/gauges/BmiArc.tsx`            | ❌     | SVG arc gauge — impossível com recharts/shadcn                                                        |
| `lead/_sections/gauges/HrZoneArc.tsx`         | ❌     | SVG arc gauge — impossível                                                                            |
| `lead/_sections/gauges/MacroDonut.tsx`        | 🔄     | Donut recharts direto. Envolver em `ChartContainer`. Bloco **`chart-pie-donut-text`** como referência |
| `lead/_sections/gauges/WaterDrop.tsx`         | ❌     | SVG shape orgânica — impossível                                                                       |
| `lead/_sections/gauges/WeightRange.tsx`       | 🔄     | Range visualization. Bloco **`chart-bar-horizontal`** ou **`chart-radial-simple`** como referência    |
| `metrics/MetricGrid.tsx`                      | ✅     | Card grid — já shadcn                                                                                 |
| `metrics/MetricStepper.tsx`                   | 🔄     | Steps visuais custom. Construir com **`Item`** + **`Separator`** (já instalados) em vez de divs raw   |
| `metrics/MetricTimeline.tsx`                  | ❌     | Timeline visual — sem equivalente shadcn direto                                                       |
| `metrics/gauges/BarComparison.tsx`            | 🔄     | Barras comparativas. Envolver em `ChartContainer`. Bloco **`chart-bar-horizontal`** como referência   |
| `metrics/gauges/BmiArc.tsx`                   | ❌     | SVG arc — impossível                                                                                  |
| `metrics/gauges/FfmiGauge.tsx`                | ❌     | SVG gauge — impossível                                                                                |
| `metrics/gauges/PhaseCard.tsx`                | ✅     | Card — já shadcn                                                                                      |
| `metrics/gauges/WaterDrop.tsx`                | ❌     | SVG orgânica — impossível                                                                             |

---

## components/shared/ — utilitários

| Componente            | Status | Ação                                                                                                                                                                                                  |
| --------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChipInput.tsx`       | 🔄     | Input + chips custom. Quando **`input-group`** for instalado (Fase 45E), usar `InputGroup` para o input part. Os chips são `Badge` com X — já shadcn. Estrutura permanece custom mas elimina divs raw |
| `MobileActionBar.tsx` | 🔄     | Action bar flutuante. Usar **`button-group`** (a instalar) para agrupar as ações. Positioning/safe-area fica custom                                                                                   |
| `ThemeProvider.tsx`   | ❌     | next-themes wrapper — fica custom                                                                                                                                                                     |

---

## components/clients/ — painel de clientes

| Componente                 | Status | Ação                                                                                              |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `PaymentLog.tsx`           | ✅     | Table — já shadcn                                                                                 |
| `SessionLog.tsx`           | ✅     | Table — já shadcn                                                                                 |
| `TransformationEditor.tsx` | 🔄     | Form + upload. Usar `Field` + `Input` + `upload-dropzone`. Verificar se há divs raw substituíveis |

---

## components/leads/ — gestão de leads

| Componente                | Status | Ação                                                                                                                                                             |
| ------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ExternalLinksEditor.tsx` | 🔄     | Array de links editáveis. Padrão **`form-rhf-array`** (exemplo shadcn) como referência direta. Usar `CrudManager` ou implementar com `Item` + botão de adicionar |

---

## components/admin/ — painel admin

| Componente                 | Status | Ação                                                                                                          |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `PromptVersionHistory.tsx` | 🔄     | Histórico de versões. Usar **`Table`** (já instalado) se for lista tabular, ou **`Item`** list com timestamps |

---

## components/influencer/

| Componente          | Status | Ação                                                                                     |
| ------------------- | ------ | ---------------------------------------------------------------------------------------- |
| `InfluencerNav.tsx` | 🔄     | Nav tabs. Usar **`Tabs`** (já instalado) ou **`NavigationMenu`** dependendo da estrutura |

---

## components/diagnostic-activation/

| Componente                      | Status | Ação                                                                                   |
| ------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `_sections/TemplateSection.tsx` | 🔄     | Grid de templates. Padrão **`field-choice-card`** (exemplo shadcn) — card selecionável |

---

## Pages — layouts que devem adotar blocos

| Rota                                    | Bloco                    | Detalhe                                                               |
| --------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `app/(auth)/login/page.tsx`             | 🧱 **`login-04`**        | Split com imagem. Form interno mantém lógica atual                    |
| `app/(auth)/signup/page.tsx`            | 🧱 **`signup-04`**       | Split com imagem                                                      |
| `app/(app)/(shell)/dashboard/page.tsx`  | 🧱 **`dashboard-01`**    | Referência para layout: sidebar + chart + table                       |
| `app/(app)/(shell)/settings/layout.tsx` | 🧱 **`sidebar-08`**      | Inset sidebar para nav de settings (conta/perfil/design/notificações) |
| `app/(app)/(shell)/site/page.tsx`       | 🧱 **`sidebar-08`**      | Editor com sidebar de seções + painel de edição                       |
| `app/(app)/onboarding/`                 | 🧱 **`login-02`** estilo | Telas de onboarding inspiradas no two-column block                    |

---

## Resumo por números

```
components/ui/
  ✅ já shadcn                41
  🔄 migrar                    3 (slider, FormModal, DeleteConfirmation)
  ❌ custom intencional        10 (DS primitives + utilities sem equivalente)

components/ (fora de ui/)
  ✅ já usa shadcn             ~35
  🔄 migrar para shadcn        ~28
  🧱 adotar bloco              6 pages/layouts
  ❌ genuinamente impossível   ~15 (SVG gauges, Motion, domínio puro)
```

---

## Casos genuinamente impossíveis (❌) — por quê

| Componente                                           | Motivo real                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| SVG gauges (BmiArc, HrZoneArc, FfmiGauge, WaterDrop) | Path/arc SVG custom com cálculos matemáticos (trigonometria) — recharts/shadcn não geram formas orgânicas |
| `ScrollProgress.tsx`                                 | Scroll listener + position calculation — puramente interativo, sem componente UI                          |
| `Ticker.tsx` (marquee)                               | Animação de marquee contínua com Motion — sem equivalente em shadcn                                       |
| `Walkthrough.tsx`                                    | Overlay posicionado via getBoundingClientRect — lógica de posicionamento dinâmico                         |
| `Breather.tsx`                                       | Tela cinematográfica full-screen com sequência de Motion                                                  |
| `ThemeProvider.tsx`                                  | Wrapper next-themes — infraestrutura, não UI                                                              |
| `lead/_steps/primitives.tsx`                         | Haptic + Motion step primitives — infraestrutura de animação                                              |
| `SectionPreview.tsx`                                 | Renderiza HTML do site do profissional — preview de domínio                                               |
| `audit/QuestionScreen.tsx`                           | Lógica de pergunta/resposta com branching — domínio puro                                                  |
| `MetricTimeline.tsx`                                 | Timeline visual com linhas de tempo — sem template shadcn equivalente                                     |
| `MobileNav.tsx`                                      | Bottom nav com safe-area — padrão mobile sem equivalente em blocos shadcn                                 |

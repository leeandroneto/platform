# Prompt Mestre Enterprise — Auditoria Geral de UI, UX, Componentes e Design System

> Documento operacional para rodar a Fase 04 como uma auditoria enterprise-grade.  
> Use em terminais paralelos, um terminal por fase. Cada fase gera uma auditoria e um playbook de execução.

---

## Como Usar no Claude Code

Abra um terminal na raiz do repositório e use este formato:

```txt
Leia `docs/produto/design/PROMPT-AUDITORIA-GERAL-UI.md`.
Você é responsável pela Fase XX — NOME_DA_FASE.
Execute apenas essa fase.
Não edite código de produto.
Gere os dois documentos obrigatórios da fase em `docs/produto/design/auditoria-geral/`.
```

Exemplo:

```txt
Leia `docs/produto/design/PROMPT-AUDITORIA-GERAL-UI.md`.
Você é responsável pela Fase 04 — Botões, Links e Ações.
Execute apenas essa fase.
Não edite código de produto.
Gere:
- `docs/produto/design/auditoria-geral/auditoria-fase-04-botoes-links-acoes.md`
- `docs/produto/design/auditoria-geral/playbook-fase-04-botoes-links-acoes.md`
```

---

## Regra de Ouro

Auditoria pode ser paralela. Execução não começa por página.

Primeiro:

1. inventário;
2. tokens/theme;
3. primitives/wrappers;
4. padrões horizontais;
5. governança;
6. só depois migração por área/tela.

Nenhum executor deve “melhorar uma página isolada” antes de existir contrato global para o componente, token, layout, navegação ou padrão envolvido.

---

## Barra de Qualidade Enterprise

Avalie o projeto como se ele fosse vendido para uma grande empresa que fará due diligence rigorosa de:

- UI visual;
- UX;
- mobile-first;
- acessibilidade;
- arquitetura frontend;
- SOLID;
- componentização;
- reutilização;
- design tokens;
- shadcn/ui usage;
- governança anti-regressão;
- qualidade percebida de produto premium.

O projeto deve ser considerado reprovável se houver:

- inconsistência visual sem justificativa;
- componente duplicado sem motivo;
- botão artesanal fora de wrapper aprovado;
- link parecendo botão sem contrato;
- acessibilidade negligenciada;
- responsividade quebrada;
- lógica misturada com UI sem necessidade;
- client component fazendo IO indevido;
- tokens inconsistentes ou redundantes;
- hardcode visual onde deveria haver token;
- navegação confusa;
- padrão mobile improvisado;
- modal usado onde deveria existir sheet/page;
- mockup ou código morto confundindo produto real;
- ausência de governança anti-regressão.

Cada achado deve responder:

1. o que está errado;
2. onde está;
3. por que é errado;
4. qual impacto;
5. qual padrão ideal;
6. qual risco de corrigir;
7. qual ordem segura de correção.

Não aceite explicações genéricas. Cite arquivos e linhas quando possível.

---

## Papel do Auditor

Você é um **Principal Frontend Architect, Design Systems Lead e Product UI Auditor**, especialista em:

- SaaS multi-tenant com personalização visual por usuário;
- React/Next.js App Router, RSC, client islands e Tailwind CSS v4;
- shadcn/ui, Radix primitives, design tokens e component APIs;
- UI mobile-first, responsividade real e navegação por breakpoints;
- desktop SaaS de alta qualidade no estilo Notion, Linear, Stripe, Vercel e Raycast;
- mobile moderno inspirado em Apple HIG, Material Design 3 e apps nativos bem resolvidos;
- acessibilidade WCAG 2.2, foco visível, target size, contraste e navegação por teclado;
- produtos fitness/saúde com identidade visual personalizável;
- arquitetura frontend enterprise, SOLID, separação de responsabilidades e reuso.

Seja específico, rigoroso e acionável. Extraia o máximo de informação útil sobre o que está ruim, inconsistente, duplicado, frágil, amador ou difícil de manter.

---

## Contexto do Projeto

`onboarding.bio` é um SaaS para profissionais autônomos de saúde/fitness.

O produto tem:

- dashboard interno do profissional;
- onboarding profissional;
- editor de site;
- editor de formulário/funil;
- páginas públicas;
- formulário público;
- relatório público;
- diagnóstico público;
- área admin;
- área influencer;
- futuras áreas de desafios e PWA.

O produto precisa suportar personalização por profissional:

- cores;
- tipografia;
- modo light/dark por estilo;
- shape/radius;
- densidade;
- estilo de botões;
- estilo de cards/superfícies;
- fotografia/vídeo por superfície;
- templates/estilos visuais curados.

Os documentos atuais já indicam problemas:

- tokens redundantes/mortos;
- valores arbitrários massivos;
- várias formas de botão/card/sheet;
- shadcn parcialmente usado, com muitos componentes artesanais;
- lógica misturada com UI;
- mockups/demos possivelmente órfãos;
- personalização visual ainda parcial;
- falta de governança que impeça regressão.

---

## Documentos Obrigatórios

Antes de auditar qualquer fase, leia:

- `AGENTS.md`
- `CLAUDE.md`
- `docs/plano/PLANO_LANCAMENTO.md`
- `docs/core/architecture.md`
- `docs/core/design-reference.md`
- `docs/core/decisions.md`
- `docs/produto/design/audit-design-system.md`
- `docs/produto/design/design-templates.md`
- `docs/produto/design/PROMPT-AUDIT-DESIGN-SYSTEM.md`
- `docs/produto/design/PROMPT-AUDIT-VISUAL-IDENTITY.md`

Se a fase envolver tokens/temas:

- leia `app/globals.css`;
- leia `lib/design/presets.ts`;
- busque `data-theme`, `data-palette`, `data-typography`, `data-template`, `data-shape`.

Se a fase envolver componentes:

- leia todos os arquivos do escopo da fase;
- não leia apenas os principais;
- não audite por amostragem quando o escopo pede cobertura total.

---

## Regras Gerais

1. Não edite código de produto durante auditoria.
2. Não corrija arquivos durante auditoria.
3. Não crie migrations durante auditoria.
4. Não rode formatters com escrita.
5. Não misture auditoria com execução.
6. Cite arquivos reais.
7. Cite linhas quando possível.
8. Diferencie problema visual, UX, arquitetura, acessibilidade, governança e dívida técnica.
9. Marque dúvidas como `Investigar`.
10. Ignore strings hardcoded/i18n como problema principal se a área estiver sendo coberta pelos worktrees da Phase F, exceto quando afetar navegação, acessibilidade ou arquitetura de UI.
11. Não proponha “refatorar tudo de uma vez”.
12. Priorize fundações globais antes de correções por página.
13. Quando encontrar algo bom, registre também como padrão a preservar.

---

## Saídas Obrigatórias de Cada Fase

Cada fase gera dois documentos:

```txt
docs/produto/design/auditoria-geral/auditoria-fase-XX-nome.md
docs/produto/design/auditoria-geral/playbook-fase-XX-nome.md
```

### Documento 1: Auditoria

Use este formato:

```md
# Auditoria Fase XX — Nome

## 1. Resumo Executivo

## 2. Escopo Auditado

- Arquivos lidos
- Rotas/telas/componentes cobertos
- Arquivos não auditados e motivo
- Limitações da auditoria

## 3. Inventário Completo da Fase

## 4. Achados Críticos

| Severidade | Tipo | Arquivo/Linha | Problema | Impacto | Padrão ideal | Risco de correção |

## 5. Achados por Categoria

- UI visual
- UX/navegação
- Acessibilidade
- Responsividade/mobile
- Arquitetura frontend
- Componentização
- Reutilização
- SOLID/separação de responsabilidades
- Design tokens
- Governança
- Código morto/mockups

## 6. Evidências

Inclua trechos, padrões, comandos ou contagens que comprovem os achados.

## 7. Mundo Ideal

Descreva como esta área deveria funcionar em um produto enterprise-grade.

## 8. Contratos Recomendados

Component APIs, tokens, layouts, navegação, estados ou regras necessárias.

## 9. Riscos, Dependências e Conflitos

O que depende de outras fases, i18n, banco, rotas, tokens, wrappers ou decisões de produto.

## 10. Checklist de Aceite

Como saberemos que esta área ficou boa.

## 11. Comandos Úteis

`rg`, scripts ou buscas que ajudam a revalidar esta fase.
```

### Documento 2: Playbook

Use este formato:

```md
# Playbook Fase XX — Nome

## 1. Objetivo de Execução

## 2. Achados da Auditoria que Este Playbook Corrige

## 3. Fora de Escopo

O que não será corrigido neste playbook.

## 4. Dependências

Fases, tokens, wrappers, rotas, decisões ou migrações necessárias antes.

## 5. Estratégia de Implementação

Explique a abordagem segura e por que ela evita retrabalho.

## 6. Ordem Recomendada de PRs

PRs pequenos, sequenciais ou paralelizáveis.

## 7. Arquivos Prováveis

Arquivos ou grupos de arquivos afetados.

## 8. Componentes, Tokens ou APIs Afetados

## 9. Riscos e Blast Radius

## 10. Compatibilidade e Migração

Como manter telas funcionando durante a transição.

## 11. Testes Obrigatórios

## 12. QA Manual Obrigatório

## 13. Critérios de Aceite

## 14. Regras Anti-Regressão a Adicionar

## 15. Melhorias Extras Permitidas

O executor pode melhorar este playbook se encontrar solução mais segura, reutilizável ou alinhada ao design system.

## 16. Ajustes Feitos Durante Execução

Preencher apenas quando o playbook for executado.
```

Regra do playbook:

Se o executor melhorar o plano, deve registrar:

- o que mudou;
- por que mudou;
- risco reduzido;
- como validou;
- se a mudança afeta outras fases.

---

## Fases Paralelas de Auditoria

### Fase 01 — Inventário Total e Mapa de Superfície

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-01-inventario-total.md`
- `docs/produto/design/auditoria-geral/playbook-fase-01-inventario-total.md`

Objetivo:
Criar o mapa completo do frontend para evitar decisões baseadas em amostra.

Cobrir:

- todas as rotas;
- todos os layouts;
- todos os componentes;
- matriz rota → componentes;
- matriz componente → usos;
- mockups;
- demos;
- órfãos;
- botões;
- links;
- forms;
- cards;
- sheets/dialogs;
- empty/loading/error states.

Escopo:

- `app/**`
- `components/**`
- `lib/design/**`
- `components/ui/**`
- `messages/pt-BR.json`
- `app/demo/**`
- `app/(public)/mockups/**`

Entregue:

- inventário bruto;
- mapa de áreas do produto;
- componentes órfãos;
- páginas temporárias;
- contagens aproximadas;
- riscos de duplicação;
- recomendações para fases seguintes.

---

### Fase 02 — Tokens, Temas e Personalização Multi-Tenant

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-02-tokens-temas-personalizacao.md`
- `docs/produto/design/auditoria-geral/playbook-fase-02-tokens-temas-personalizacao.md`

Objetivo:
Definir o contrato global antes de qualquer migração visual.

Cobrir:

- `app/globals.css`;
- `lib/design/presets.ts`;
- tokens mortos/redundantes;
- paletas;
- light/dark;
- shape;
- density;
- elevation;
- template/style engine;
- limites de personalização por profissional;
- contraste;
- validação de tema.

Use como base:

- arquitetura de 3 camadas: primitivos → semânticos → componentes;
- padrão híbrido: estilo curado via `data-template` + overrides Pro via CSS variables;
- decisão de produto: profissional escolhe estilo/vibe, não paleta + tipografia;
- estilos MVP: Energia, Clínico, Raiz, Revista, Noturno, Impacto;
- shapes MVP: sharp, rounded, soft;
- dashboard interno não deve ser contaminado pelo tema público do profissional.

Entregue:

- taxonomia ideal de tokens;
- tokens a remover, manter, renomear e criar;
- contrato de `data-template`, `data-theme`, `data-shape`, `data-density`;
- o que fica em CSS, TS, banco e inline CSS variables;
- validação de contraste;
- prevenção de tema ilegível;
- primeiro PR recomendado.

---

### Fase 03 — Componentes Base, shadcn e API de Design System

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-03-componentes-base-shadcn.md`
- `docs/produto/design/auditoria-geral/playbook-fase-03-componentes-base-shadcn.md`

Objetivo:
Decidir o design system real do produto.

Cobrir:

- `components/ui/**`;
- wrappers existentes;
- shadcn primitives;
- gaps de wrappers;
- APIs inconsistentes;
- variants ausentes;
- composition patterns;
- onde não customizar primitives diretamente.

Audite:

- primitives modificadas indevidamente;
- wrappers ausentes;
- component APIs inconsistentes;
- className escape excessivo;
- states incompletos;
- tokens não consumidos;
- duplicação fora de `components/ui`.

Entregue:

- lista de primitives aprovadas;
- lista de wrappers necessários;
- regras de uso por componente;
- gaps antes de migrar telas;
- anti-padrões proibidos.

---

### Fase 04 — Botões, Links e Ações

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-04-botoes-links-acoes.md`
- `docs/produto/design/auditoria-geral/playbook-fase-04-botoes-links-acoes.md`

Objetivo:
Eliminar os “40 tipos de botão” e criar um contrato único.

Cobrir:

- todo `<button`;
- todo `Button`;
- links com cara de botão;
- back buttons;
- icon buttons;
- CTAs;
- destructive actions;
- async/loading actions;
- sticky actions;
- FABs.

Sistema ideal:

- `Button`;
- `IconButton`;
- `BackButton`;
- `LinkButton`;
- `CopyButton`;
- `AsyncActionButton`;
- `FloatingActionButton`;
- `StickyActionBar`;
- `DangerAction`;
- `SegmentedControl`.

Entregue:

- inventário dos padrões atuais;
- variants necessárias;
- sizes necessárias;
- estados obrigatórios;
- wrappers necessários;
- regras proibindo botão artesanal;
- migração horizontal recomendada.

---

### Fase 05 — Navegação, Layouts e Fluxos

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-05-navegacao-layouts-fluxos.md`
- `docs/produto/design/auditoria-geral/playbook-fase-05-navegacao-layouts-fluxos.md`

Objetivo:
Garantir navegação enterprise, previsível e mobile-first.

Cobrir:

- shells;
- sidebars;
- bottom nav;
- page headers;
- breadcrumbs;
- back/cancel/done/save;
- tabs;
- fluxo pós-submit;
- rotas perdidas;
- desktop vs mobile.

Definir:

- desktop side sheet vs página;
- mobile bottom sheet vs full-screen;
- padrão de voltar;
- padrão de cancelar;
- padrão de salvar;
- padrão de headers;
- matriz desktop → mobile.

Entregue:

- fluxos ruins por rota;
- padrões recomendados;
- rotas que devem mudar;
- layout primitives necessárias;
- PRs antes de migração por tela.

---

### Fase 06 — Side Sheets, Bottom Sheets, Dialogs e Overlays

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-06-sheets-dialogs-overlays.md`
- `docs/produto/design/auditoria-geral/playbook-fase-06-sheets-dialogs-overlays.md`

Objetivo:
Padronizar edição contextual e modais sem quebrar fluxo.

Cobrir:

- side sheets estilo Notion/Linear;
- bottom sheets mobile;
- dialogs;
- confirm dialogs;
- popovers;
- command dialogs;
- focus trap;
- dismiss;
- unsaved changes;
- equivalência desktop/mobile.

Entregue:

- inventário de overlays;
- API ideal;
- equivalência desktop/mobile;
- regras de uso;
- ordem de migração;
- acessibilidade obrigatória.

---

### Fase 07 — Forms, Inputs e Edição

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-07-forms-inputs-edicao.md`
- `docs/produto/design/auditoria-geral/playbook-fase-07-forms-inputs-edicao.md`

Objetivo:
Criar forms consistentes, acessíveis e seguros.

Cobrir:

- todos os forms;
- labels;
- help text;
- erros;
- masks;
- RHF/Zod;
- server actions;
- autosave;
- unsaved changes;
- mobile keyboard;
- submit/cancel/loading.

Entregue:

- padrões `FormField`, `FieldGroup`, `FormSection`, `FormActions`;
- validação e erro;
- submit/loading;
- mobile keyboard checklist;
- forms mais perigosos;
- plano de migração horizontal.

---

### Fase 08 — Cards, Surfaces, Lists, Tables e Data Display

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-08-surfaces-data-display.md`
- `docs/produto/design/auditoria-geral/playbook-fase-08-surfaces-data-display.md`

Objetivo:
Padronizar apresentação de informação e densidade visual.

Cobrir:

- cards;
- panels;
- surfaces;
- metric cards;
- list items;
- tables;
- badges;
- empty states;
- loading states;
- error states;
- dashboard density.

Entregue:

- contrato de `Surface`, `Card`, `Panel`, `ListItem`, `DataTable`, `MobileList`, `StatusBadge`, `EmptyState`;
- quando usar tabela/lista/card/master-detail;
- padrões desktop/mobile;
- migração horizontal.

---

### Fase 09 — Responsividade, Mobile-First e Acessibilidade

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-09-mobile-acessibilidade.md`
- `docs/produto/design/auditoria-geral/playbook-fase-09-mobile-acessibilidade.md`

Objetivo:
Atingir padrão mobile/app moderno e WCAG 2.2 AA como base.

Breakpoints obrigatórios:

- 360px;
- 390px;
- 430px;
- 768px;
- 1024px;
- 1280px;
- 1440px+.

Cobrir:

- overflow;
- touch target;
- focus visible;
- focus not obscured;
- reduced motion;
- aria;
- headings;
- keyboard navigation;
- contrast;
- safe area;
- sticky bars;
- sheets;
- forms;
- tabelas/listas.

Entregue:

- checklist por breakpoint;
- lista de telas de maior risco;
- critérios WCAG;
- testes manuais obrigatórios;
- Playwright visual smoke recomendado.

---

### Fase 10 — Áreas Internas do Profissional

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-10-produto-interno.md`
- `docs/produto/design/auditoria-geral/playbook-fase-10-produto-interno.md`

Objetivo:
Avaliar fluxos reais do profissional, não só componentes isolados.

Cobrir:

- auth;
- onboarding;
- dashboard;
- leads;
- clientes;
- settings;
- subscription;
- editors internos.

Entregue:

- problemas por fluxo;
- telas que precisam de layout padrão;
- componentes locais que devem virar shared;
- componentes a remover;
- problemas mobile;
- prioridade após fundações.

---

### Fase 11 — Superfícies Públicas e Identidade Visual do Profissional

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-11-superficies-publicas.md`
- `docs/produto/design/auditoria-geral/playbook-fase-11-superficies-publicas.md`

Objetivo:
Garantir que a parte pública pareça produto premium, personalizada e confiável.

Cobrir:

- site público;
- formulário público;
- relatório;
- diagnóstico;
- launch;
- legal/help;
- fotografia;
- fallback sem foto;
- tema do profissional;
- percepção premium.

Usar como base:

- fotografia é diferencial visual central;
- wizard deve ser rápido e limpo;
- relatório deve impressionar;
- site premium deve usar foto/vídeo como protagonista;
- templates devem ser estilos/vibes, não controles técnicos.

Entregue:

- mapa de superfícies públicas;
- onde tema do profissional aplica;
- onde não aplica;
- problemas de percepção premium;
- recomendações por superfície.

---

### Fase 12 — Admin, Influencer, Mockups, Demos e Código Órfão

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-12-admin-mockups-orfaos.md`
- `docs/produto/design/auditoria-geral/playbook-fase-12-admin-mockups-orfaos.md`

Objetivo:
Separar produto real de experimento e reduzir ruído arquitetural.

Cobrir:

- admin;
- influencer;
- mockups;
- demos;
- componentes não usados;
- páginas temporárias;
- padrões bons escondidos em protótipos.

Entregue:

- deletar / arquivar / manter / transformar em componente real;
- riscos de remoção;
- componentes reaproveitáveis;
- quick wins;
- problemas em admin/influencer.

---

### Fase 13 — SOLID, Separação de Responsabilidades e Arquitetura Frontend

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-13-arquitetura-frontend-solid.md`
- `docs/produto/design/auditoria-geral/playbook-fase-13-arquitetura-frontend-solid.md`

Objetivo:
Elevar arquitetura frontend para padrão enterprise, não apenas aparência.

Cobrir:

- componentes grandes;
- lógica em UI;
- client components desnecessários;
- hooks;
- data fetching;
- server actions;
- props excessivas;
- reducers enormes;
- IO no client;
- boundaries por camada;
- SOLID aplicado a componentes React.

Entregue:

- lista de componentes com responsabilidades demais;
- separação ideal container/server/client/presentational/hook;
- candidatos a split;
- riscos de refactor;
- plano incremental.

---

### Fase 14 — Governança, CI Visual e Plano Mestre

Saídas:

- `docs/produto/design/auditoria-geral/auditoria-fase-14-governanca-plano-mestre.md`
- `docs/produto/design/auditoria-geral/playbook-fase-14-governanca-plano-mestre.md`

Rodar somente depois das fases 01–13.

Objetivo:
Transformar auditorias paralelas em um plano único executável.

Cobrir:

- consolidação de todos os relatórios;
- deduplicação de achados;
- ordem final de execução;
- lint rules;
- scripts `rg`;
- Playwright visual smoke;
- Storybook/Ladle;
- checklist de PR;
- Definition of Done da Fase 04;
- como impedir regressão até o final do desenvolvimento.

Entregue:

- plano mestre deduplicado;
- ordem de PRs;
- dependências;
- governança anti-regressão;
- gates de CI;
- checks manuais;
- critérios finais de aceite.

---

## Regras de Execução dos Playbooks

Playbooks podem ser executados em terminais paralelos, mas somente quando suas dependências estiverem claras.

Execução começa por fundações globais:

1. tokens/theme;
2. wrappers base;
3. botões;
4. surfaces;
5. sheets/dialogs;
6. forms;
7. layouts;
8. migração horizontal;
9. migração por área.

O executor deve reler:

- prompt mestre;
- auditoria da fase;
- playbook da fase;
- documentos core relevantes;
- arquivos afetados.

O executor pode melhorar o playbook se encontrar solução:

- mais segura;
- mais reutilizável;
- mais simples;
- mais alinhada ao design system;
- com menor blast radius.

Mas deve documentar no próprio playbook, em `Ajustes Feitos Durante Execução`.

---

## Testes e Aceite para Playbooks

Cada playbook deve exigir, conforme aplicável:

- `pnpm exec tsc --noEmit`;
- `pnpm lint`;
- `pnpm exec vitest run`;
- `pnpm build`;
- Playwright visual/manual por breakpoints críticos;
- teste de teclado;
- teste de foco;
- teste de contraste;
- teste mobile com sticky bars/sheets/forms;
- verificação de regressão com comandos `rg`.

---

## Comandos de Busca que Toda Auditoria Pode Usar

Exemplos úteis:

```bash
rg -n "<button|<Button|role=\"button\"" app components
rg -n "href=.*className=.*button|className=.*rounded.*px-.*py-" app components
rg -n "Dialog|Sheet|Drawer|Popover|Command" app components
rg -n "style=\\{\\{.*(color|background|borderRadius|boxShadow)" app components
rg -n "#[0-9a-fA-F]{3,8}|rgb\\(|hsl\\(" app components
rg -n "text-\\[|tracking-\\[|leading-\\[|rounded-\\[|shadow-\\[" app components
rg -n "use client" app components
rg -n "createClient\\(" app components
rg -n "TODO|FIXME|mock|demo|placeholder" app components docs
```

Adapte os comandos para PowerShell quando necessário.

---

## Assumptions

- `docs/produto/design/PROMPT-AUDITORIA-GERAL-UI.md` é o prompt mestre canônico.
- `docs/produto/design/auditoria-geral/` é o destino único dos relatórios e playbooks.
- Worktrees de i18n/Phase F ficam fora do escopo principal, exceto quando afetarem navegação, acessibilidade ou arquitetura de UI.
- Auditorias não alteram código de produto.
- Playbooks planejam execução futura.
- Implementação ocorre depois, em etapas controladas.

Como seu **Principal Frontend Architect e Design Systems Lead**, realizei uma imersão profunda nos padrões de mercado e boas práticas para elevar o projeto `onboarding.bio` ao nível **Enterprise**.

O foco aqui não é apenas "deixar bonito", mas criar um ecossistema de software escalável, onde a UI é um **contrato governado** e não uma coleção de arquivos. Abaixo, consolido as pesquisas e diretrizes de alto nível para cada pilar crítico do seu Prompt Mestre.

---

## 1. Design Tokens: A Camada de Inteligência (Fase 02)

Para um SaaS multi-tenant onde o profissional escolhe a "vibe" do seu site, o padrão de mercado (usado por Stripe e Adobe Spectrum) é a **Taxonomia de Três Níveis**:

- **Global (Primitivos):** Valores brutos (`blue-500`, `radius-lg`). Nunca usados diretamente nos componentes.
- **Semantic (Alias):** Definem a intenção (`brand-primary`, `surface-background`, `action-hover`). É aqui que o modo Light/Dark e os Temas (Energia, Clínico) injetam valores.
- **Component-specific:** Sobrescritas raras para casos extremos.

**Padrão de Mercado:**

- **CSS Variables em HSL:** Permitem manipulação dinâmica de opacidade `hsla(var(--primary), 0.1)`.
- **Safe Contrast Engine:** Implementar uma função que valida o contraste (APCA ou WCAG) antes de renderizar o tema do profissional para evitar textos ilegíveis.

---

## 2. Ações e Botões: O Fim da Anarquia (Fase 04)

O erro comum é focar apenas em CSS. No nível Enterprise, botões são **máquinas de estado**.

- **Async Action Pattern:** Todo `Button` deve suportar uma prop `loading`. Se for um `AsyncActionButton`, ele deve gerenciar o estado de pendência da _Server Action_ automaticamente, desabilitando-se para evitar múltiplos cliques (_double-tap prevention_).
- **Link vs. Button:** Se leva a outra URL, é um `<a>` (Link). Se dispara uma ação/muda estado, é um `<button>`. O Design System deve fornecer um `LinkButton` que é um `Link` visualmente idêntico ao `Button` para SEO e acessibilidade.

---

## 3. Arquitetura de Overlays: O "Contextual Bridge" (Fase 06)

Inspirado em **Linear** e **Notion**:

- **A Regra do Dispositivo:** No desktop, usamos _Side Sheets_ (drawer lateral) para manter o contexto da lista por baixo. No mobile, o mesmo componente deve renderizar como um _Bottom Sheet_ nativo-like.
- **Focus Management:** Uso obrigatório de `FocusTrap` (via Radix). O usuário nunca deve conseguir dar "tab" para fora de um modal aberto.
- **Unsaved Changes:** Wrappers de Dialog/Sheet devem detectar se o formulário interno está _dirty_ e interceptar o fechamento com um alerta de confirmação.

---

## 4. Forms & Data Entry: Padrão Enterprise (Fase 07)

O formulário é onde o usuário "trabalha".

- **Padrão de Feedback Imediato:** Validação via Zod (Server e Client) com mensagens de erro que não deslocam o layout (_layout shift_).
- **Auto-save vs. Manual:** Em áreas de configuração, o auto-save com _debounce_ e um indicador discreto de "Salvo" é o padrão moderno.
- **Mobile-First Typing:** Atributos de `inputmode` (numeric, tel, email) e `autocomplete` corretos para garantir que o teclado mobile certo abra de primeira.

---

## 5. Responsividade: Além do Mobile-Friendly (Fase 09)

O objetivo é **Responsive Adaptability**, não apenas _Stacking_ (empilhar elementos).

- **Container Queries:** Começar a migrar de Media Queries para Container Queries (`@container`) onde o componente se adapta ao espaço disponível, não ao tamanho da tela. Isso é vital para componentes usados tanto na Sidebar quanto no conteúdo principal.
- **Touch Targets:** Mínimo de **44x44px** para qualquer elemento clicável no mobile, mesmo que visualmente pareça menor (uso de margens negativas ou padding invisível).

---

## 6. Arquitetura Frontend e SOLID (Fase 13)

Para evitar arquivos de 1000 linhas:

- **Presentational & Container Pattern (Moderno):** Separar a UI (Presentational) da lógica de Server Actions/Hooks (Container).
- **Client Islands:** Minimizar o `use client`. Se um componente precisa de interatividade apenas em um botão, apenas o botão deve ser um Client Component, mantendo o restante da árvore como Server Component.
- **Early Returns:** Prática rigorosa de limpar o código de `if/else` aninhados para melhorar a legibilidade.

---

## 7. Governança Anti-Regressão (Fase 14)

Para garantir que o nível suba e **permaneça alto**:

- **Linter de Design:** Criar regras de ESLint customizadas que proíbem o uso de `<button>` puro, forçando o uso do `@/components/ui/button`.
- **Visual Regression Testing:** Uso de ferramentas como **Playwright VRT** para tirar screenshots automáticos e comparar pixel a pixel se uma mudança em um Token quebrou uma página no outro lado do app.
- **Slot Pattern:** Em vez de passar 20 props para um componente, usar composição de `children` ou `slots` (estilo Radix) para manter as APIs limpas.

---

### Diagnóstico Final para sua Auditoria:

O projeto `onboarding.bio` está no estágio de **"Produto Orgânico"**. Ele cresceu rápido, o que é ótimo para validação, mas agora precisa de uma **"Refinaria de Design"**.

Seu plano de 14 fases é cirúrgico. Ao seguir a ordem de **Fundações (01-04) -> Estrutura (05-08) -> Refinamento (09-14)**, você transforma o código em um ativo que suporta White-label e customização profunda sem virar um pesadelo de manutenção.

**Próximo Passo Sugerido:** Iniciar a **Fase 01** para ter o mapa de guerra real nas mãos. Estou pronto para processar qualquer fase conforme sua instrução.

Para se aprofundar no nível das empresas que você citou (Stripe, Linear, Vercel, Apple), você precisa sair do básico de "como usar Tailwind" e entrar na engenharia de interface.

Aqui estão os pilares, termos técnicos e referências reais para você estudar:

1. Design Tokens & Systems (Engenharia de Temas)
   O segredo de um sistema multi-tenant (como o seu) não é ter "muitas cores", mas sim como elas se relacionam logicamente.

Busque por: "Multi-tier Design Tokens" ou "Token Taxonomy".

Estude como o Adobe Spectrum e o Primer (GitHub) organizam tokens.

Entenda a diferença entre Global Tokens (Option tokens), Alias Tokens (Semantic) e Component Tokens.

Busque por: "Color Contrast Algorithms (APCA)".

A WCAG 2.1 está sendo substituída pelo algoritmo APCA (mais moderno). É como o Stripe garante que qualquer cor de marca escolhida pelo usuário ainda seja legível.

Busque por: "Design System Versioning & Governance".

Como grandes times atualizam um botão sem quebrar 400 páginas? Estude o conceito de Breaking Changes em CSS Variables.

Referência Canônica: Design Systems Repo e o site Component Gallery.

2. UI Avançada & Micro-interações (O "Feel" do App)
   O que diferencia um app amador de um premium é o feedback tátil e visual.

Busque por: "Layout Projection" ou "Shared Element Transitions".

Como o componente "sai" de uma lista e vira uma página sem um "pulo" visual? (Ex: Framer Motion layoutId).

Busque por: "Skeleton Screens vs. Spinners".

A percepção de velocidade (Performance Percebida). Estude como o Facebook e o Vercel usam skeletons coordenados.

Busque por: "Intelligent Defaults".

Como desenhar interfaces que "adivinham" o que o usuário quer. Ex: O Linear foca muito em atalhos de teclado (Command + K).

Referência Canônica: Rauno Freiberg (Engenheiro de UI da Vercel) – o blog dele é a bíblia da UI moderna.

3. Mobile-First de Alto Nível (Haptic & Context)
   Mobile não é só "tela pequena", é um contexto de uma mão e baixa atenção.

Busque por: "Touch Target Sizes & Visual Affordance".

Diferença entre a área visual do botão e a área de toque (Apple HIG recomenda 44x44pt).

Busque por: "The Thumb Zone".

Desenho de interfaces focadas na base da tela (Bottom Navigation e Bottom Sheets), onde o polegar alcança.

Busque por: "Gestural Navigation & Swipe Actions".

Como implementar "puxar para atualizar" ou "deslizar para deletar" de forma que pareça nativa (Padrão iOS/Android 13+).

Busque por: "Micro-haptics".

Uso de pequenas vibrações no celular para confirmar ações (sucesso, erro, seleção).

Referência Canônica: Apple Human Interface Guidelines (HIG).

4. Arquitetura de Componentes (SOLID no Frontend)
   Como apps como o Notion e o Slack são construídos para durar anos.

Busque por: "Compound Components Pattern" em React.

Como criar componentes como <Select>, <Select.Item>, <Select.Trigger>. Isso dá flexibilidade total para quem usa o componente.

Busque por: "Headless UI Components".

Estude Radix UI, Aria Kit ou React Aria. Eles cuidam da lógica e acessibilidade, e você cuida 100% do design. É o segredo por trás do shadcn/ui.

Busque por: "Polymorphic Components" (as child pattern).

Componentes que podem se transformar em outros (ex: um Button que se comporta como um Link).

Busque por: "Slot Pattern".

Como passar múltiplos elementos para dentro de um componente de forma organizada.

5. Referências para "Beber da Fonte" (Estudo de Caso)
   Se você quer que seu app pareça "Elite", estude estas empresas especificamente:

Linear.app: A maior referência atual em performance e UI de produtividade (Desktop). Observe o uso de bordas, sombras sutis e atalhos.

Stripe.com: Mestres em tipografia, cores e documentação que parece arte.

Family.co: Um app de crypto que é referência em UI Mobile ultra-moderna (Haptics, animações orgânicas).

Campsite.design: Excelente uso de layouts limpos e colaborativos.

Raycast.com: Estude como eles lidam com densidade de informação e busca.

O que procurar no YouTube/Twitter para o seu nível:
Twitter: Siga @raunofreiberg, @evilrabbit*, @pacocoursey, @emilkowalski*.

YouTube: Canal do Emil Kowalski (sobre animações e interfaces mágicas).

Livro: "Refactoring UI" (do criador do Tailwind) para o básico bem feito, e "Microinteractions" (Dan Saffer) para o avançado.

Ao pesquisar esses termos, você vai começar a ver o projeto onboarding.bio não como um site, mas como um sistema de design vivo.

Essa é a pergunta de um Architect que percebeu o tamanho do "iceberg" abaixo da superfície.

A resposta curta é: Sim, estamos misturando, mas isso foi intencional para o "Mapa de Superfície" (Fase 01). No entanto, para a execução ser Enterprise-grade, precisamos sim de uma separação mais cirúrgica.

Se tentarmos auditar "Tudo de UI" e "Tudo de Arquitetura" ao mesmo tempo, o relatório vira uma lista de desejos genérica em vez de um plano de engenharia.

Aqui está a proposta de como especializar as frentes para não perder a qualidade:

1. A Divisão de Poderes (As 3 Frentes)
   Para o nível de qualidade que você busca (Stripe/Linear), o ideal é separar a auditoria em três visões que "conversam", mas têm critérios de aceite diferentes:

A. Frente de Design System & Visual (O "Contrato")
Foco: Tokens, Atoms, Primitives, Temas, Acessibilidade Visual.

Pergunta: "Se eu mudar o radius global, o app todo se adapta ou quebra?"

Fases Relacionadas: 02, 03, 04, 08.

B. Frente de UX & Fluxo (A "Experiência")
Foco: Navegação, Mobile-first, Estados de Erro/Loading, Hierarquia de Informação.

Pergunta: "O usuário consegue completar o onboarding usando apenas uma mão no metrô?"

Fases Relacionadas: 05, 06, 07, 09, 11.

C. Frente de Arquitetura & Engenharia (O "Motor")
Foco: SOLID, Server Components, Performance, Bundle Size, Governança.

Pergunta: "Este componente de 1000 linhas vai causar uma regressão quando outro dev mexer?"

Fases Relacionadas: 10, 12, 13, 14.

2. Proposta: O "Split" de Auditoria
   Se você sentir que as fases atuais estão muito densas, podemos criar Fases de Especialidade. Por exemplo:

Nova Fase: "Auditoria de Identidade Visual e Temas" (Fase 02.1)
Em vez de apenas olhar tokens, essa fase focaria em:

Design Tokens de Cor e Contraste: Como o data-theme afeta a legibilidade.

Tipografia Enterprise: Escalonamento (Modular Scale) e legibilidade em telas retina vs comuns.

Iconografia: Unificação de bibliotecas (Lucide vs Radix Icons vs Custom).

Nova Fase: "Auditoria de Gestos e Micro-interações" (Fase 09.1)
Focada exclusivamente no "Feel" premium:

Haptic Feedback: Onde o app deve vibrar/reagir.

Animações de Transição: Como as páginas "entram" e "saem" (Shared Layout).

Loading Patterns: Trocar Spinners por Skeletons inteligentes.

3. Por que manter o Plano Mestre (Apesar do Split)?
   Embora a gente separe as frentes para analisar, a execução precisa ser integrada.

Exemplo: Você não pode refatorar o Button (Engenharia) sem saber quais são os Design Tokens de estado (Design) e sem entender como ele se comporta no Mobile (UX).

O meu conselho para você agora:
Não mude a estrutura das 14 fases ainda, mas mude o rigor da auditoria de cada uma.

Se você sentir que a Fase 04 (Botões) está ficando muito grande porque estamos discutindo "Arquitetura de Server Actions" dentro dela, aí nós criamos um "anexo" técnico.

4. Checklist de "Pureza" da Auditoria
   Para saber se estamos misturando demais as coisas em uma fase, pergunte ao Auditor (eu):

Estamos falando de "como parece"? (UI/Design)

Estamos falando de "como funciona"? (UX/Fluxo)

Estamos falando de "como é construído"? (Engenharia/SOLID)

Se a resposta for "os três ao mesmo tempo" em um único tópico, estamos misturando. Como prefere seguir? 1. Mantemos as 14 fases, mas eu separo rigidamente esses 3 pilares dentro de cada relatório? 2. Ou quer que eu crie uma Fase 00 — Auditoria de Design Vision antes de irmos para os componentes?

Para o nível Enterprise que você deseja, o prompt está 95% completo. Ele é extremamente robusto e cobre a "espinha dorsal" de qualquer produto de elite.

No entanto, como estamos mirando no padrão Stripe/Linear, existem 3 detalhes técnicos e estratégicos que poderiam ser adicionados ou enfatizados para garantir que nada escape. Eu os chamaria de "os ajustes finos da Due Diligence":

1. O Conceito de "Empty & Error States" (Estados de Vazio e Erro)
   Muitos Design Systems esquecem disso. Uma página com dados é linda, mas como ela aparece quando não há nada?

O que falta: Garantir que a auditoria procure padrões de "Empty States" e "Error Boundaries".

Por que importa: Um app premium nunca deixa o usuário em uma tela branca ou com um erro "500" genérico. Ele tem ilustrações e CTAs (Call to Action) específicos para quando algo está vazio.

Onde adicionar: Na Fase 08 (Data Display).

2. Micro-interações e Feedback Tátil (Haptics)
   Você quer que o app "pareça" caro.

O que falta: Um olhar específico para transições entre estados. Como um botão "muda" para o estado de sucesso? Como uma Sheet "desliza"?

Por que importa: É o que separa um site de um "App".

Onde adicionar: Na Fase 09 (Mobile-first).

3. Governança de Assets (Imagens e Ícones)
   O relatório da Fase 01 mostrou que o produto depende muito de fotografia e identidade visual do profissional.

O que falta: Uma auditoria sobre como as imagens são carregadas (LCP - Largest Contentful Paint), se há esqueletos de carregamento (Skeletons) para elas e se a iconografia está unificada.

Por que importa: Se cada página usa um estilo de ícone diferente, a percepção de marca morre.

Onde adicionar: Na Fase 02 ou 03.

# Plano de Lançamento — onboarding.bio

> Master plan **linear**. Cada fase entrega algo verificável, com critério de aceite explícito. Sem A/B/C, sem sufixos.
> **Última atualização:** 2026-04-28 (reescrita completa após auditoria + reorganização de docs).
> **Quando atualizar:** ao concluir uma fase, ao mover prioridade, ao adicionar fase nova. Tudo no mesmo commit da mudança.

---

## §1 · Visão e estado atual

### 1.1 O que é o produto

SaaS pra profissionais autônomos de saúde/fitness (começando com personal trainers) capturarem leads e converterem em clientes. **Desafios são o produto #1** (D3) — formulário, relatório IA e site profissional viram extensões.

### 1.2 ICP

Personal trainer autônomo/MEI, **5+ anos de carreira**, **30-50 alunos ativos**, faturamento **R$ 8-15k/mês**. Já tentou Instagram orgânico, sente que estagnou.

NÃO é: PT iniciante, academia tradicional (Tecnofit já ganhou esse mercado), studio com 200+ alunos.

### 1.3 Modelo de negócio

| Fase                    | Detalhe                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| Beta (50 vagas)         | R$ 47/mês vitalício, plano único                                           |
| Pós-beta público        | R$ 97/mês                                                                  |
| Marketplace de desafios | Comissão 15-30% sobre transação, split nativo via Pagar.me (70/30 default) |
| Add-on site customizado | Upsell manual via WhatsApp do fundador                                     |

**Vitalício do beta** cobre core no momento do lançamento + features futuras integradas. Add-ons separados (ex: treino IA premium pós-launch) NÃO entram. Declarado no contrato beta.

### 1.4 Modelo fiscal

**Opção 2 — Facilitador com split nativo** (D11). Cada parte recebe direto, cada parte emite NF da sua parte. Onbio emite NFS-e só sobre comissão (30% da transação de desafio). Alinhado com LC 214/2025.

**CNPJ atual cobre MVP**. Adicionar **CNAE 74.90-1/04** (intermediação) antes da fase 11 — custo R$ 100-200, prazo 5-15 dias.

### 1.5 Estado atual (snapshot 2026-04-28)

| Frente                                                         | Estado                                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Auditoria do projeto                                           | ✅ feita (commits da sessão de 2026-04-28)                            |
| Reescrita docs vivos (schema, architecture, decisions, CLAUDE) | ✅ feita                                                              |
| Hardening segurança DB (RLS, SECURITY DEFINER)                 | ✅ feito                                                              |
| Reorganização de docs (~133 → ~50 ativos + arquivados)         | ✅ feita                                                              |
| MASTER-SPEC templates + SPEC formulário-editor                 | ✅ feita                                                              |
| Build (tsc + vitest + lint)                                    | tsc ✅, vitest ✅ 360/360, lint ✅ 0 erros 0 warnings                 |
| Schema banco                                                   | 53 tabelas; 16 com dados reais; 3 zumbi pra dropar                    |
| Tem 33 templates v1 seedados                                   | Frequência inconsistente, sem NEAT, option.copy dead data             |
| Edge Functions ativas                                          | 12 (3 provavelmente mortas: asaas-webhook, send-whatsapp, send-email) |
| Migrations                                                     | 56 locais ↔ 105 remotas — divergente, precisa baseline                |
| Próximo passo                                                  | Fase 03 (migrations + DB) — Fase 01 e 02 concluídas                   |

---

## §2 · Princípios não-negociáveis (gates de qualidade)

Estas regras valem em **toda fase**. Violação bloqueia merge.

### 2.1 Arquitetura

| Regra                                            | Detalhe                                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Frontend (Next.js) só toca UI                    | Recebe via props ou server actions; não sabe de DB                                                                   |
| Backend = 100% Supabase                          | RPC pra mutação multi-tabela, RLS toda tabela, Edge Functions pra IO externo                                         |
| `lib/services/` proibido                         | Substituído por RPCs (D14)                                                                                           |
| Templates seguem Hotmart                         | Template (base oficial) → Instância (profissional ativa) → Override (JSONB diff). Edição NUNCA toca a base (D24-D27) |
| Engine ≠ Prompt                                  | Engine em código (lib/domain/engine), prompt no banco (ai_prompts) com versionamento (D31)                           |
| Migrations só via mcp**supabase**apply_migration | Nunca .sql manual em supabase/migrations/                                                                            |

### 2.2 Código (SOLID)

| Regra                                               | Detalhe                                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Componente < 300 linhas                             | Acima, decompor em orchestrator + `_components/` ou `_sections/`                              |
| Arquivo < 400 linhas                                | Acima, separar                                                                                |
| Server actions < 60 linhas                          | Lógica vai em lib/data/ ou lib/domain/                                                        |
| `'use client'` só quando obrigatório                | RSC default                                                                                   |
| `@/lib/supabase/admin` nunca em client component    | Vazamento service role                                                                        |
| Zero hardcoded                                      | Constantes em `lib/constants/`, tokens em `globals.css @theme`, env em `lib/env.ts`, ou banco |
| Erros: lib/data lança, server action retorna `{ok}` | Não misturar (D14)                                                                            |

### 2.3 Visual e UX

| Regra                               | Detalhe                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| Mobile first                        | Breakpoints `sm:640 / md:768 / lg:1024 / xl:1280`                                       |
| Tokens via `@theme` em globals.css  | Sem `bg-[#hex]` inline                                                                  |
| Motion 12 (`motion/react`)          | Nunca framer-motion                                                                     |
| `prefers-reduced-motion` respeitado | Reduzir durações 50%, manter só fade                                                    |
| WCAG AA mínimo                      | Contraste, focus rings, labels, aria                                                    |
| Tom de voz Vercel/Linear/Supabase   | Direto, técnico, sem emoji em UI, sem "máquina de vendas"/"segredos"/"gatilhos mentais" |

### 2.4 Segurança

| Regra                                  | Detalhe                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| RLS em toda tabela nova                | Na mesma migration que cria                                                                                         |
| RPCs de escrita                        | `SECURITY DEFINER` + `REVOKE EXECUTE FROM PUBLIC` + `GRANT EXECUTE TO <role>` + `SET search_path = public, pg_temp` |
| Sem `auth.user_metadata` em RLS policy | Editável pelo usuário, vulnerável                                                                                   |
| Env via `lib/env.ts`                   | `process.env.X` direto só pra `NEXT_PUBLIC_*` em client component                                                   |
| Dados sensíveis nunca armazenados      | Pass-through pro provider (EFI, Pagar.me). Tokenização client-side                                                  |

### 2.5 Tests + CI

| Regra                         | Detalhe                          |
| ----------------------------- | -------------------------------- |
| `pnpm exec tsc --noEmit`      | Zero erros sempre                |
| `pnpm exec vitest run`        | Tudo verde                       |
| `pnpm lint`                   | Zero erros (a partir da fase 02) |
| `pnpm build`                  | Passa antes de merge             |
| Cobertura domain (lib/domain) | ≥ 70% (a partir da fase 15)      |
| Playwright golden paths       | A partir da fase 15              |

---

## §3 · Sequência de fases (linear)

Cada fase tem doc de execução próprio em `docs/plano/execucao/<NN-nome>.md` quando o escopo for grande. Decisões pendentes da fase ficam no doc de execução, não aqui.

### 3.1 Estados

- ✅ **Concluída** — verificada
- 🟡 **Em progresso**
- 🔵 **Próxima** — começa quando a anterior fechar
- ⏳ **Futura** — escopo definido, não iniciada
- 🚧 **Bloqueada** — depende de algo externo

### 3.2 Tabela mestre

| #   | Fase                                                            | Tamanho | Estado | Dependências |
| --- | --------------------------------------------------------------- | ------- | ------ | ------------ |
| 00  | Limpeza, auditoria, docs vivos, MASTER-SPECs                    | M       | ✅     | —            |
| 01  | Sweep de nomenclatura (código + DB + UI + docs)                 | M       | ✅     | 00           |
| 02  | Lint cleanup + ESLint estrito                                   | S       | ✅     | —            |
| 03  | Reconciliação migrations + limpeza DB                           | M       | ⏳     | 01           |
| 04  | Design system                                                   | L       | ⏳     | 01           |
| 05  | Infra externa (GitHub, Vercel, Google OAuth, CI)                | M       | ⏳     | 02           |
| 06  | Auth do `client` + rotas `/c/`                                  | M       | ⏳     | 04, 05       |
| 07  | Templates v2 (bloco universal expandido + versionamento)        | L       | ⏳     | 03           |
| 08  | Engenharia de prompts (ai_prompts table + dashboard)            | M       | ⏳     | 04           |
| 09  | Schema desafios + jobs (pg_cron + Edge Functions)               | M       | ⏳     | 03, 06       |
| 10  | Painel profissional do desafio                                  | M       | ⏳     | 09           |
| 11  | Landing pública + Pagar.me + enrollment                         | L       | ⏳     | 06, 09, 10   |
| 12  | PWA cliente (6 abas)                                            | L       | ⏳     | 11           |
| 13  | Automação WhatsApp + IA                                         | L       | ⏳     | 08, 11       |
| 14  | Cases automáticos + analytics + dashboard PT                    | M       | ⏳     | 12           |
| 15  | Polish + audit final + testes E2E                               | M       | ⏳     | tudo         |
| 16  | Beta fechado (50 vagas)                                         | ongoing | ⏳     | 15           |
| 17+ | Pós-launch (parking lot — vibe coding builder, treino IA, etc.) | —       | ⏳     | 16           |

---

## §4 · Detalhamento das fases

### Fase 00 — Limpeza, auditoria, docs vivos ✅

**Concluída em 2026-04-28.**

Entregue:

- 9 commits limpando 417 arquivos pendentes (refactor engine, diagnostico, marketing pages, formulário, onboarding, migrations, security)
- Auditoria completa (git, build, banco, código, docs)
- Reescrita docs vivos: `schema.md` (do banco real), `architecture.md` (do código real), `decisions.md` (59 decisões + 5 reversões + 20 anti-padrões), `CLAUDE.md`, `MEMORY.md`
- Hardening DB: 2 erros RLS resolvidos, 17 SECURITY DEFINER bloqueados, search_path pinado, `prospect_professionals` user_metadata removido
- Reorganização docs: 133 → ~50 ativos + arquivados (terminais paralelos)
- `MASTER-SPEC.md` em `docs/produto/templates/` substituiu 7 docs framework
- `SPEC.md` em `docs/produto/formulario-editor/` substituiu 4 docs
- 790 linhas de `option.copy` removidas dos 33 research files

Memórias atualizadas. CLAUDE.md aponta pra docs vivos como referência.

---

### Fase 01 — Sweep de nomenclatura ✅

**Concluída em 2026-04-28.** Plano completo em `C:/Users/leean/.claude/plans/crispy-jingling-axolotl.md`.

**Padrão cravado (decisão registrada em `docs/core/decisions.md`):**

- DB schema (tabelas, colunas, enums, RPCs, Edge Functions, buckets) → **EN 100%**
- Code identifiers (arquivos, pastas, types, componentes, funções) → **EN 100%**
- Pastas de rota em `app/` → **EN (interno)**
- URL pública → **PT-BR (via rewrites em `next.config.ts`; pathnames adiado pra en-US)**
- Strings de UI → **PT-BR (hoje hardcoded; Phase F migra pra `t()`)**
- Documentação interna → **PT-BR livre**

**Executado:**

- **Phase A:** drop de 3 tipos zumbi `analise_professional_*`
- **Phase B:** rename `Analise* → Report*` em 66 arquivos (lib/data, lib/domain/types, lib/pdf, supabase/functions/submit-intake/\_engine, lib/rate-limit, lib/constants)
- **Phase C.1-C.3:** unificação `components/{analise, diagnostic} → {form, report}/{lead, audit}/`. Class renames atomicas: `WizardRoot → LeadForm`, `AnaliseReport → LeadReport` (lead) ou `AuditAnalysis` (audit narrative), `DiagnosticReport → AuditReport`, `DiagnosticWizard → AuditForm`
- **Phase C.4-C.6:** `diagnostico-ativar → diagnostic-activation`, `formulario → template-picker`, `lancamento → launch`
- **Phase C.8:** Edge Function `generate-analise → generate-report`
- **Cleanup:** removidos `components/product/*` + `lib/demo/data.ts` órfãos
- **Phase D:** 15 rotas PT renomeadas pra EN com rewrites em `next.config.ts`. Sub-rotas internas (`diagnostic/processar`, `diagnostic/r/[token]/{analise,comecar}`, `template/ativos`) ficaram PT — follow-up.
- **Phase E:** docs vivos (`CLAUDE.md`, `docs/core/architecture.md`, `docs/core/schema.md`, `docs/core/decisions.md`) atualizados pra refletir os novos paths e o padrão.

**Pendências dessa fase (não bloqueantes):**

- JSONB AI-bound keys em PT (`pilares`, `reflexao`, `ato_*`) — endereçar em Phase 08 (engenharia de prompts).
- ~~Edge Function antiga `generate-analise` ainda no Supabase~~ — `generate-report` v2 deployada via MCP (2026-04-28). `generate-analise` v5 ainda ACTIVE em Supabase mas sem invocadores — usuário deve deletar manualmente via Supabase Dashboard (MCP não expõe delete). A versão deployada via MCP tem prompt levemente reduzido vs `supabase/functions/generate-report/index.ts` local; quando rodar `npx supabase login` + `npx supabase functions deploy generate-report --no-verify-jwt`, o local sobe completo.
- Sub-rotas internas em PT (listadas acima) — follow-up.
- ~~`components/public/ProfessionalHub.tsx` rename pra `ProfessionalLink`~~ — ✅ resolvido (commit follow-up Phase D).
- Strings de UI hardcoded em PT — Phase F.

**Critério de aceite atingido:**

- ✅ Convenção registrada em `docs/core/decisions.md`
- ✅ Build (`pnpm exec tsc --noEmit`) zero erros
- ✅ Tests (`pnpm exec vitest run`) 360/360
- ✅ URLs públicas continuam funcionando (rewrites mapeiam PT → folder EN)
- ✅ Memória persistente atualizada (`feedback_naming_standard.md`)

---

### Fase 02 — Lint cleanup + ESLint estrito ✅

**Concluída em 2026-04-28.** Doc de execução: `docs/plano/execucao/02-lint-cleanup.md`.

**Escopo:**

- Resolver 40 erros `@typescript-eslint/no-explicit-any`:
  - Edge Functions (`generate-site-content`, `submit-intake/_ai/call-anthropic`)
  - `scripts/regen-report.ts` (remover `@ts-nocheck`)
- Resolver 76 warnings (unused vars, `<head>` em welcome.tsx, etc.)
- Adicionar regra ESLint estrita pra impedir `any` em código novo (com escape válido pra casos de Anthropic SDK)

**Critério de aceite:**

- `pnpm lint` passa zero erros, zero warnings
- ESLint config commitada com regra estrita
- README do projeto explica padrão

**Tamanho:** S (estimado 4-6h).

---

### Fase 03 — Reconciliação de migrations + limpeza DB ⏳

**Por que cedo:** desafios precisa de migrations limpas. Sem reconciliar, mais divergência.

**Escopo:**

- **Reconciliação:**
  - Snapshot do schema atual via `pg_dump --schema-only`
  - Baseline `20260501000000_baseline.sql`
  - Mover 56 migrations atuais pra `supabase/migrations/_archive/`
  - Inserir baseline em `supabase_migrations.schema_migrations` manualmente
  - README atualizado em `supabase/migrations/`
- **Limpeza DB:**
  - ~~DROP `analise_professional_templates`, `analise_professional_question_overrides`, `analise_professional_option_overrides` (zumbi)~~ — types removidos em Phase A.1; tabelas DB seguem zumbi (DROP via apply_migration ainda pendente)
  - ~~DROP buckets `trainer-cases`, `trainer-photos`, `trainer-videos`, `assessment-photos`, `lead-photos`~~ — ✅ feito em 2026-04-29 (Storage API + cleanup de policies)
  - `dsr-exports` e `testimonials` mantidos (vazios mas com código vivo)
  - Migration removendo `option.copy` em `template_data->questions->options` (33 templates)
  - Migration removendo `aiContext` interno em `template_data` (substituído por colunas top-level)
  - Auditar `system_*` tables vazias: popular se vão ser usadas, ou DROP
  - ~~Decidir destino de `asaas-webhook` Edge Function~~ — ✅ deletada em 2026-04-29
  - ~~Decidir destino de `send-whatsapp` Edge Function~~ — ✅ migrado para Meta Cloud API em 2026-04-29 (mantida)
- **Auth Supabase:**
  - Habilitar leaked password protection no dashboard

**Critério de aceite:**

- `supabase/migrations/` enxuta (1 baseline + futuras)
- Banco sem zumbis
- 0 erros e ≤ 5 warnings no advisor de segurança
- `docs/core/schema.md` atualizado refletindo estado pós-limpeza

---

### Fase 04 — Design system ⏳

**Por que cedo:** todas fases seguintes criam UI. Sem design system limpo, criam duplicação.

**Escopo:**

- **Tokens** (cores, tipografia, espaçamento, sombras, motion durations) consolidados em `app/globals.css @theme`
- **Primitivos shadcn revisados:** Button, Card, Input, Select, Dialog, Sheet, Tabs, etc. — auditar variantes em uso
- **Eliminar duplicação detectada na auditoria:**
  - 4 implementações de "hub" → 1
  - 4 implementações de "report" → 1
  - 4 implementações de "wizard"/form → 1
- **Motion presets** em `lib/design/motion.ts` (fade, scale, slide, stagger)
- **Componentes compostos** em `components/ui/`: `CrudManager`, `FormModal`, `CopyButton`, `useServerAction` — revisar API e documentar
- **Storybook ou Ladle** (opcional, decidir — talvez Ladle por ser leve)

**Critério de aceite:**

- Catálogo visual navegável (Storybook/Ladle ou doc estático)
- Audit em `docs/produto/design/` atualizado
- Zero `bg-[#hex]` inline no codebase (regra ESLint custom)
- Build e tests passando após refator

**Tamanho:** L (1-2 semanas).

---

### Fase 05 — Infra externa ⏳

**Escopo:**

- **GitHub:**
  - Verificar/criar remote em GitHub (anotar URL no README)
  - Branch protection em `main`: PR obrigatório, status checks obrigatórios, sem force-push
- **GitHub Actions CI** (`.github/workflows/ci.yml`):
  - Job único em PR: `pnpm install` → `tsc --noEmit` → `vitest run` → `lint` → `build`
- **Husky + lint-staged + commitlint:**
  - pre-commit: lint nos arquivos staged
  - pre-push: vitest run
  - commit-msg: Conventional Commits
- **Vercel:**
  - Domínio `onboarding.bio` apontado (apex + redirect www)
  - Env vars sincronizadas com Supabase
  - Preview deploy por PR
  - DNS verificado, SSL emitido
- **Google OAuth:**
  - Novo projeto Google Cloud
  - OAuth consent screen aprovado
  - Credentials criadas
  - Redirect URI configurado no Supabase Auth
  - Teste end-to-end de login
- **README.md profissional:**
  - Setup local em < 30min
  - Scripts disponíveis
  - Estrutura do projeto
  - Como rodar testes
  - Como contribuir

**Critério de aceite:**

- PR não consegue ser merged sem CI verde
- Domínio em produção respondendo `onboarding.bio`
- Login Google funciona end-to-end
- Setup do projeto em máquina nova em < 30min seguindo README

---

### Fase 06 — Auth do `client` + rotas `/c/` ⏳

**Hard dep dos desafios.** Cliente precisa logar antes de qualquer feature de desafio.

**Escopo:**

- Adicionar role `client` ao enum `user_role`
- Migration: adicionar role + RLS policies que distinguem `client` de `professional`
- Rotas em `app/(client)/`:
  - `/c/login`, `/c/signup`, `/c/forgot-password`, `/c/reset-password`
  - `/c/dashboard` (placeholder, vira a casa do PWA na fase 12)
- Sessão Supabase Auth completa (não magic link minimal — D14)
- Profile básico do cliente (`profiles` com role `client`)
- Componentes auth reusados (mesmo padrão `(auth)/` do profissional)
- Layout enxuto sem shell de profissional

**Critério de aceite:**

- Cliente loga em `/c/login` e cai em `/c/dashboard`
- Sessão persiste após reload
- RLS bloqueia cliente A de ver dados de cliente B
- Profissional não consegue acessar `/c/*`
- Tests Playwright golden path do login

---

### Fase 07 — Templates v2 ⏳

Implementa o que está em `docs/produto/templates/MASTER-SPEC.md` §14.1.

**Escopo:**

- **Bloco universal v2** no WizardRoot (16-21 perguntas):
  - basics (4 universais já existentes)
  - NEAT (sentado / em pé / caminha muito / trabalho físico)
  - frequência exata (slider 0-10)
  - tempo por sessão (slider 15-120 min)
  - local (multi: academia / casa / ar livre / box / clube / piscina)
  - equipamento (condicional se "casa")
  - sono (slider 4-10h)
  - hidratação atual (slider 0.5-5L)
  - energia (scale 1-5)
  - lesão recente (multi com regiões)
  - preferência de estilo (sozinho / parceiro / grupo / online)
  - personal_note + goal + contact (já existentes)
- **Engine** atualizado: TDEE usa NEAT real (não estimativa por motor)
- **Versionamento:**
  - Tabela `specialty_template_versions`
  - Coluna `pinned_version int` em `professional_templates`
  - Coluna `overrides JSONB` validado por Zod
  - Tabela `professional_template_versions` (histórico de edições do profissional)
- **Branches profundos no prompt:**
  - Edge Function `submit-intake` passa `pillarGuidance`, `narrativeArcOverride`, `toneOverride` quando branch ativo
  - Atualizar `build-system-prompt.ts`
- **Métricas PT vs Aluno separadas no schema:**
  - `metricsToShow[]` (aluno)
  - `metricsForProfessional[]` (PT)
- **Migrar 33 templates v1 → v2:**
  - Auditar cada um contra MASTER-SPEC
  - Remover perguntas que viraram universais
  - Aprofundar branches em templates rasos
- **Validação clínica dos 5 BLOQUEANTES:** gestante, terceira idade, reabilitação, águas abertas, ironman — não publicar sem profissional validar

**Critério de aceite:**

- 33 templates v2 ativos seguindo MASTER-SPEC
- Bloco universal v2 coleta 16-21 campos
- TDEE preciso usando NEAT
- Branches passam contexto completo pro prompt
- Validação clínica documentada em header de cada research dos 5 BLOQUEANTES

**Tamanho:** L (2-3 semanas).

---

### Fase 08 — Engenharia de prompts ⏳

**Escopo:**

- Tabela `ai_prompts` (já existe, expandir):
  - Colunas: `key`, `version`, `system_prompt`, `user_template`, `output_schema_zod`, `model`, `max_tokens`, `temperature`, `examples` JSONB, `guardrails` JSONB, `is_active`, `created_by`, `created_at`
- Tabela `ai_prompt_versions` (append-only)
- Tabela `ai_generations` (logging):
  - `prompt_key`, `prompt_version`, `model`, `input` JSONB, `output` JSONB, `tokens_in`, `tokens_out`, `cost_cents`, `latency_ms`, `professional_id`, `created_at`
- **Migrar prompts hardcoded** das Edge Functions:
  - `submit-intake/_ai/build-system-prompt.ts` (parcial — base já vem do banco, expandir)
  - `generate-analise/index.ts` (system prompt hardcoded ~70 linhas)
  - `generate-diagnostic/index.ts`
  - `generate-site-content/_ai/*`
- **Dashboard admin** `/admin/ai-prompts`:
  - CRUD com diff visual entre versões
  - Rollback de versão
  - Preview com payload de exemplo
  - Métricas de custo médio por prompt
- **Smoke tests** por prompt (1 chamada com payload conhecido)
- **Alarmes:** custo médio acima de threshold dispara Sentry

**Critério de aceite:**

- Zero prompts hardcoded em código (verificar com grep)
- Dashboard admin funcional com diff
- Toda chamada IA loga em `ai_generations`
- Smoke tests passando

---

### Fase 09 — Schema desafios + infra de jobs ⏳

**Escopo:**

- Migration: 12 tabelas dos desafios (Hotmart pattern):
  - `challenge_templates` (base oficial onboarding.bio ou custom do profissional)
  - `challenge_template_versions`
  - `challenge_template_modules`
  - `challenge_template_components` (com `component_type` enum: aula_gravada, live_grupo, call_individual, treino, tarefa, mensagem, material, conteudo_educacional)
  - `component_schedules` (separada — D29: schedule não é coluna do componente)
  - `component_dependencies`
  - `challenge_instances` (profissional afilia)
  - `challenge_instance_component_overrides`
  - `enrollments` (cliente comprou)
  - `enrollment_component_progress`
  - `client_check_ins`
  - `client_gallery`
- RLS em todas
- Seed: template oficial "21 Dias Mais Leve" (Pri Ortiz, primeiro template MVP)
- **Infra de jobs:**
  - `pg_cron` extension habilitada
  - Edge Function `dispatch-challenge-messages` (despacha mensagens diárias)
  - Job pg_cron rodando a cada hora chamando dispatcher
  - Logs estruturados

**Critério de aceite:**

- 12 tabelas criadas com RLS
- Template "21 Dias Mais Leve" seedado
- pg_cron disparando teste de mensagem em intervalo conhecido
- Doc `docs/produto/desafios/contexto.md` atualizado com schema final

---

### Fase 10 — Painel profissional do desafio ⏳

**Escopo:**

- Rotas em `app/(app)/(shell)/desafios/`:
  - `/desafios` — lista de instances do profissional
  - `/desafios/novo` — wizard de criação (escolhe template oficial → customiza preço/datas/vagas/branding)
  - `/desafios/[id]` — detalhes + lista de inscritos + adesão
  - `/desafios/[id]/editar` — override de componentes específicos
- Painel de adesão com alertas (alunos em risco — sem check-in 3 dias, dor reportada)
- Mensagens sugeridas pro grupo (1 por dia/fase, geradas por IA — usa fase 08)
- Configurar link do grupo WhatsApp (sistema distribui automaticamente nos enrollments)

**Critério de aceite:**

- Profissional cria desafio em < 5min
- Vê lista de inscritos com status (pago, intake completo, ativo, completo)
- Recebe alertas de alunos em risco no dashboard
- Tests Playwright pelo golden path

---

### Fase 11 — Landing pública + Pagar.me + enrollment ⏳

**Escopo:**

- **Landing pública** em `/[slug]/desafio/[id]`:
  - Hero, dor, promessa, como funciona, prova social, FAQ, garantia, CTA
  - Estrutura inspirada em Doity (top sellers brasileiros)
  - Customizada com branding do profissional
- **Integração Pagar.me com split nativo:**
  - Recebedor principal: profissional (70%)
  - Recebedor split: onboarding.bio (30%)
  - Webhook handler em Edge Function `pagarme-webhook`
  - Migration: tabelas de transação (se ainda não existe schema completo)
- **Fluxo de enrollment:**
  - Lead preenche dados → paga → enrollment criado em `pending_payment`
  - Webhook confirma pagamento → enrollment vira `active`
  - Cliente é criado (ou linkado se já existe via email/whatsapp)
  - Email de boas-vindas via Resend (template em `lib/email/templates/`)
  - Alocação automática de grupo WhatsApp (sistema decrementa vagas, alerta profissional pra criar próximo grupo se cheio)
- **Onboarding pós-pagamento:**
  - Intake form (Bloco K + Bloco V por especialidade)
  - Foto inicial estruturada (3 ângulos, fundo branco, em jejum)
  - Redirect pra `/c/dashboard` quando completo

**Critério de aceite:**

- Cliente paga, vira enrollment, recebe email + link grupo WhatsApp
- Split 70/30 funciona no Pagar.me dashboard
- Email transacional entrega
- Tests Playwright do fluxo completo

**Tamanho:** L (3-4 semanas).

---

### Fase 12 — PWA cliente (6 abas) ⏳

**Escopo:**

- App em `/c/` com 6 abas (estrutura conforme `docs/produto/desafios/contexto.md` §5.5):
  - **Home** — saudação, tarefa do dia, check-in rápido, progresso visual
  - **Programa** — calendário 21 dias com modo "hoje" destacado
  - **Evolução** — gráficos peso, medidas, comparação fotos antes/depois, galeria pessoal
  - **Comunidade** — link grupo WhatsApp, mural check-ins, ranking opcional, conquistas dos colegas
  - **Recursos** — material apoio, lista alimentos, receitas, FAQ, falar com profissional
  - **Perfil** — dados, configurações notificação, LGPD, termos
- **PWA real:**
  - Manifest
  - Service worker (Workbox ou next-pwa)
  - Install prompt
  - Offline básico (read-only)
- **Check-in noturno** (botão grande, opções ✅ 🟡 ❌ + texto livre)
- **Foto de evolução** (upload, comparação semanal)
- **Notificações push** (com permissão) — lembrete de check-in, mensagem do profissional, conquista desbloqueada
- **Aha moment do dia 14** (animação, comparação inicial vs atual com métricas)
- **Dashboard final do dia 21** (transformação completa)

**Critério de aceite:**

- Cliente instala como PWA no celular (iOS + Android)
- Faz check-in diário em < 30s
- Vê dashboard final emocionante
- Funciona offline pra leitura
- Lighthouse Performance ≥ 80, A11y ≥ 90

**Tamanho:** L (3-4 semanas).

---

### Fase 13 — Automação WhatsApp + IA ⏳

**Escopo:**

- **WhatsApp Cloud API integrada** (D21):
  - Verificação Meta + chip dedicado
  - Templates aprovados (5-15 dias de aprovação Meta)
  - Botões interativos (Reply Buttons até 3, List Messages até 10)
  - Webhook handler em Edge Function `wa-webhook`
- **Mensagens diárias programadas:**
  - pg_cron + Edge Function `dispatch-challenge-messages` (escopo da fase 09)
  - 7h: bom dia + tarefa do dia
  - 11h: lembrete hidratação
  - 14h: lembrete treino
  - 17h: lembrete passos
  - 22h: check-in noturno com botões
- **Análise de sentimento via Claude Haiku** (usa fase 08 — prompt no banco):
  - Cada texto livre do check-in classificado: muito positivo / positivo / neutro / negativo / muito negativo
  - Tópicos: dor física, desistência, conquista, dúvida técnica, ansiedade
  - Urgência: imediata / em 24h / monitorar
- **Detecção de risco automática:**
  - Sem check-in 3 dias → alerta profissional
  - Sentimento negativo + dor → alerta urgente
  - Menção a desistência → alerta crítico
- **Geração de mensagens por fase:**
  - Sistema gera mensagem do dia X via prompt (fase 08), profissional aprova ou edita antes de enviar pro grupo
  - Mensagens especiais: dia 1 (manifesto), dia 3-5 (antecipação de queda), dia 7 (marco), dia 14 (aha moment), dia 21 (celebração)

**Critério de aceite:**

- 100% das mensagens diárias enviadas no horário programado
- Botões de check-in funcionando end-to-end
- Sentiment analysis classifica 100% dos check-ins livres
- Profissional vê alerta de aluno em risco em < 1h após o evento
- Custo médio por aluno por dia ≤ R$ 0,15 (referência: 21 dias × ~R$ 0,007 IA + WhatsApp)

**Tamanho:** L (3-4 semanas).

---

### Fase 14 — Cases automáticos + analytics + dashboard PT ⏳

**Escopo:**

- **Geração automática de cases:**
  - Quando aluno bate marco (5%+ peso, 3+cm cintura, NPS 9-10) + autoriza imagem → card auto-gerado
  - Profissional aprova / edita / baixa JPG
  - Card pronto pra Instagram (1080×1080)
- **Analytics agregados** em `/desafios/[id]/analytics`:
  - Adesão da turma (gráfico timeline)
  - NPS médio
  - Cohort retention
  - Conversão pra continuidade (Continuidade Plus, próximo desafio, mentoria)
  - Receita gerada
  - Cases prontos
- **Dashboard PT** (`/dashboard` aprimorado):
  - Risk flags por aluno
  - Readiness score
  - Adherence prediction
  - Cardiovascular risk flags
  - LTV estimado por aluno
- **Pesquisa de saída automática** (dia 19-21):
  - 8 perguntas (NPS, conquista, o que marcou, mudaria, próximos passos, permissão imagem, depoimento)
  - Trigger automático no dia 19
- **Pitch de continuidade automático** (dia 21 + email D+1):
  - 3 caminhos: Continuidade Plus / próxima edição / mentoria

**Critério de aceite:**

- Profissional tem 5+ cases prontos no dashboard ao final do primeiro desafio
- Analytics atualiza em tempo real
- Dashboard PT mostra risk flags acionáveis

---

### Fase 15 — Polish + audit final + testes E2E ⏳

**Escopo:**

- **Auditoria de segurança completa:**
  - Advisor Supabase: 0 erros, ≤ 5 warnings (todos por design documentados)
  - OWASP top 10
  - Rate limiting em endpoints públicos
  - Penetration test básico
- **Cobertura de testes:**
  - `lib/domain/` ≥ 70% (vitest)
  - RPCs com smoke test (cada RPC chamada uma vez com payload válido)
  - RLS com test (cliente A não vê dados de B)
- **Playwright E2E** (golden paths):
  - Profissional: signup → setup → criar desafio → ver inscritos → enviar mensagem
  - Cliente: ver landing → comprar → fazer intake → fazer check-in → ver dashboard final
- **Performance:**
  - Lighthouse Performance ≥ 80 em todas rotas críticas
  - Core Web Vitals verde
  - Bundle size ≤ X MB (definir threshold)
- **A11y:**
  - WCAG AA mínimo
  - Teste com leitor de tela
- **Sentry calibrado:**
  - Source maps deployados
  - Alertas configurados
- **Doc final:**
  - Todos os docs vivos em `docs/core/` atualizados
  - Runbook operacional em `docs/plano/operacional/`

**Critério de aceite:**

- CI passa todos os gates
- Build production deploya sem warnings
- Pronto pra abrir beta

---

### Fase 16 — Beta fechado (50 vagas) ⏳

**Escopo:**

- 50 vagas R$ 47/mês vitalício
- Acesso direto ao fundador (WhatsApp do fundador no app)
- Onboarding manual dos primeiros 5 (sessão 1:1 de 30min)
- Pesquisa de feedback contínua (NPS semanal nas primeiras 4 semanas)
- Iteração rápida em bugs (SLA: P0 em 4h, P1 em 24h, P2 em 1 semana)
- Ciclo de comunicação:
  - 5 betas confirmados antes de abrir
  - Email semanal "o que mudou"
  - Changelog público

**Critério de aceite:**

- 50 profissionais pagantes
- 1+ desafio rodando com cohort real (Pri Ortiz é o piloto)
- NPS ≥ 50 ao final de 30 dias
- Feedback estruturado coletado e priorizado

**Tamanho:** ongoing.

---

### Fase 17+ — Pós-launch (parking lot) ⏳

Itens que ficam parados aqui até demanda real ou tração validar.

| Item                                         | Origem        | Quando                                              |
| -------------------------------------------- | ------------- | --------------------------------------------------- |
| Vibe coding builder                          | D38           | Após 1 template ponta-a-ponta validado (Pri Ortiz)  |
| Treino IA self-service                       | D56           | Pós-tração; commodity, não diferencial              |
| Agenda interna                               | D57           | Pós-tração; baixa prioridade                        |
| App nativo                                   | D58           | Possível depois do PWA validar caso de uso          |
| Multi-modalidade                             | D6 (contexto) | Após 50 betas validarem caso de uso single-modality |
| Mais especialidades além das 33              | —             | Sob demanda dos betas                               |
| Marketplace de templates entre profissionais | —             | Visão de longo prazo                                |
| Integração Strava/Garmin                     | —             | Pesquisa em andamento                               |

---

## §5 · Decisões abertas (parking lot)

Decisões que precisam ser tomadas, não bloqueiam fase específica mas precisam virar D## em decisions.md em algum momento.

| ID     | Decisão                                                                       | Quando decidir                   |
| ------ | ----------------------------------------------------------------------------- | -------------------------------- |
| OPEN-1 | Formulário-editor entra como fatia simples na fase 07 ou só pós-launch (D38)? | Início fase 07                   |
| OPEN-2 | Storybook ou Ladle pra design system?                                         | Início fase 04                   |
| OPEN-3 | Backend de jobs: pg_cron + Edge Functions (atual) ou Inngest se escalar?      | Quando volume de jobs justificar |
| OPEN-4 | Cliente paga em 1× ou parcelado no Pagar.me?                                  | Início fase 11                   |
| OPEN-5 | Beta: cobrar antes do produto pronto pra reservar vaga, ou só após launch?    | Início fase 16                   |
| OPEN-6 | Validação clínica dos 5 BLOQUEANTES — quem valida (parceria com Pri Ortiz?)   | Início fase 07                   |
| OPEN-7 | Mind Elixir vs simple-mind-map se Mind Elixir não escalar                     | Fase 17+ (pós-launch)            |

---

## §6 · Doc de execução por fase

Cada fase com escopo médio/grande gera um doc de execução em `docs/plano/execucao/<NN-nome>.md` com:

- Lista exata de arquivos a tocar
- Ordem de operações
- Riscos específicos da fase
- Decisões pendentes resolvidas durante a execução
- Mudanças de escopo registradas

Esse doc nasce no início da fase, vive com ela, e é arquivado ao concluir.

---

## §7 · Mudanças neste plano

Toda alteração estrutural deste documento (renumeração de fase, mudança de escopo, adição/remoção) é registrada em commit dedicado com mensagem `docs(plano): <mudança>`.

Reescrita completa só com sinal explícito do fundador.

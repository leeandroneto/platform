# retake.run — Pacote de Handoff para o Projeto Real

> **O que é isto:** o material completo do protótipo retake.run, organizado para o Claude Code
> usar como **referência visual e fonte de verdade do produto** ao refatorar o projeto real.
>
> **O que NÃO é:** código de produção. Este projeto é um protótipo de alta fidelidade
> (HTML/CSS + JSX via Babel no browser, dados mockados). O runtime é **andaime — descarte.**
> O que se aproveita é: **design system, tokens, telas como alvo visual, fluxos, copy e a
> especificação de dados/produto.**

---

## 0. Como o Claude Code deve usar esta pasta

1. **Leia primeiro** este README inteiro + `planos-onboarding-permissoes.md` + `banco-de-dados.md` + `modelo-de-produto.md`.
2. **Trate cada arquivo `.html` em `ui_kits/`** como o **pixel-target** de uma rota/tela do app real — reconstruir em Next + shadcn, **não** copiar o código.
3. **Tokens** (`/tokens/*.css`) → viram o `@theme` do Tailwind v4 / CSS vars do shadcn (conversão quase 1:1).
4. **Planos, preços, features, onboarding, aprovações** → **moram no BANCO** (não hardcode). Ver `planos-onboarding-permissoes.md` e `banco-de-dados.md`.
5. **Regra de ouro:** se algo não está na spec de dados (`banco-de-dados.md`), questione antes de manter código antigo. A spec é o filtro do que aproveitar/descartar.

---

## 1. O que é a retake (resumo do produto)

Rede que conecta as **5 pontas** do mundo da corrida — **assessorias/clubes, corredores, marcas,
fornecedores e a própria retake**. Começa pelo **site grátis das assessorias** (captação),
e evolui para o **sistema operacional da corrida** (treino, app, gestão, loja, marketplace).

**Modelo de receita:** o site é grátis/barato porque **marcas pagam** para aparecer aos corredores.
Tiers pagos (Apoiador/Membro) adicionam visibilidade e recursos. Marketplace/comissão vêm depois.

**Princípios inegociáveis (não violar no código):**
- **Alunos são do tenant.** A retake nunca compartilha alunos/dados entre assessorias.
- **Não competimos com o tenant.** Não somos assessoria; damos infraestrutura.
- **Comunidade/gamificação é intra-assessoria** (no app, entre alunos da mesma assessoria) — nunca entre tenants.
- **Eventos:** internos (só alunos, no site/app do tenant) **vs** públicos (compartilhados no calendário da retake).
- **Calendário de provas:** o conteúdo é mantido pelas **assessorias**, não pela retake.
- **Cupom é benefício do corredor** (pega no site da retake, compra na marca) — não passa pela assessoria.

---

## 2. Stack-alvo do projeto real (decidida)

- **Front+back:** Next.js (App Router) + Server Actions (thin adapters sobre RPC).
- **Banco/auth/storage:** Supabase (Postgres + RLS + Edge Functions).
- **UI:** shadcn (new-york, **despir o default escuro** e vestir com tokens retake) + Tailwind v4 (`@theme`).
- **Estado server:** TanStack Query · **Forms:** React Hook Form + Zod.
- **Gráficos:** Recharts/Tremor · **Datas:** date-fns · **IA:** AI SDK.
- **Pagamento:** gateway por tenant (split na fase marketplace).
- **i18n:** next-intl, pt-BR único no MVP. **a11y:** APCA Lc ≥ 60 validado no save de tema.

> O protótipo **não** usa nada disso (é Babel no browser). Reconstruir limpo.

---

## 3. Mapa de telas — protótipo → projeto real

Cada item é um `.html` que serve de **alvo visual**. Coluna "rota sugerida" = onde vive no app real.

### 3.1 Site público / marketing (`ui_kits/landing/`)
| Protótipo | Rota sugerida | O que é |
|---|---|---|
| `index.html` | `/` | Home neutra: ecossistema, 3 portas, hoje×futuro, tabela "todo mundo ganha/contribui", modelo |
| `assessorias.html` | `/assessorias` | Hub assessorias: hoje×futuro, mockup do template, **planos** (toggle 1/2 anos), glossário, FAQ |
| `corredores.html` | `/corredores` | Hub corredor: vitrine de assessorias, cupons & marcas |
| `empresas.html` | `/empresas` | Hub B2B: vitrine de fornecedores (categorias) |
| `patrocinio.html` | `/patrocinio` | **Fundador**: hero, "por que entrar agora" (3 fases), cotas (Estadual/Nacional/Oficial), Vitrine B2B, cupons, matriz, FAQ |
| `trafego-pago.html` | `/trafego-pago` | Serviço à parte: pacotes Starter/Pro |
| `eventos.html` | `/eventos` | Calendário público de provas (filtros, praça, distância) |
| `evento.html` | `/eventos/[id]` | Página de uma prova (SEO) |
| `publicar-evento.html` | `/eventos/publicar` | Organizador lista evento (form, sem pagamento) |
| `plataforma.html` | `/plataforma` | Teaser "em breve": mockups, 12 módulos, **roadmap de 6 fases**, lista de espera |
| `novidades.html` | `/novidades` | Roadmap público (Agora/A seguir·voto/Mais pra frente) + changelog |
| `_chrome.js` | layout | **Header + footer compartilhados** (1 fonte só) — no real vira `<SiteHeader/>` + `<SiteFooter/>` |

### 3.2 Site do tenant (`ui_kits/tenant-site/`)
| Protótipo | Rota | O que é |
|---|---|---|
| `index.html` | `retake.run/[slug]` | **Template padrão da rede**, recolorível por tokens do tenant (demo: tema Maré azul). Default da fase artesanal |
| `onboarding.html` | `/[slug]/onboarding` | Onboarding self-service do site (slug, tema, conteúdo) |

### 3.3 App do atleta (`ui_kits/athlete-app/`)
| Protótipo | O que é |
|---|---|
| `index.html` + `AppScreens.jsx` + `AppScreens2.jsx` | App nativo único da retake (não white-label). Telas: Hoje (execução guiada + PSE), Desempenho, Comunidade (intra-assessoria), Loja, Perfil (assinatura, histórico, chat com treinador, notificações, anamnese, onboarding) |
| `ios-frame.jsx` | Bezel iOS (só protótipo — descartar) |

### 3.4 Dashboard do tenant (`ui_kits/dashboard/`)
| Tela (em `screens.jsx` / `DashboardExtra.jsx` / etc.) | O que é |
|---|---|
| Visão geral | KPIs (alunos, treinos, faturamento, atletas em risco) |
| Meu site | Editor + vibe coding (tokens/conteúdo) |
| Captação | **Kanban de leads** drag-and-drop (Novo→Contatado→Visita→Convertido) + lista |
| Atletas | Lista + **detalhe** (anamnese, compliance, plano, pagamentos) |
| Treinos | **Treino estruturado**: periodização macro→micro, biblioteca, prescrito×executado |
| Agenda | Sessões/turmas + check-in |
| Financeiro | Cobrança, inadimplência, repasses |
| Comissões | Comissões internas/externas |
| Comunidade | Mural, avisos, ranking/desafios (intra-tenant) |
| Eventos | Lista de eventos do tenant |
| Marketplace | Produtos de fornecedores (consome catálogo) |
| Produtos | Loja própria do tenant |
| Configurações | **Equipe & permissões** (7 papéis), assinatura, gateway |

### 3.5 Painéis de entidade
| Protótipo | Entidade | O que é |
|---|---|---|
| `auth/index.html` | todas | Login + escolha de tipo de conta + onboarding do tenant (plano→dados→pagamento) |
| `admin/` (index + AdminScreens 1/2 + Shell) | **retake staff** | Console interno: rede, tenants, **aprovações KYC**, **moderação de eventos** (anti-fake), faixa de marcas, faturamento, qualidade & abuso |
| `organizer-panel/index.html` | organizador | Eventos próprios, lotes, inscritos, check-in, reivindicar evento (CNPJ) |
| `sponsor-panel/index.html` | marca | Desempenho, criativos, post no feed, faturas |
| `supplier-panel/index.html` | fornecedor | Pedidos, catálogo, vitrine, financeiro/repasses |

---

## 4. Design system & tokens

- **`/tokens/colors.css`** — paleta (creme/terracota/grafite + azul-oceano + semânticos). **Convenção de cor semântica:** terracota = ação/ativo/agora · azul = informação/"em breve"/futuro · verde = sucesso · vermelho = erro · âmbar = alerta.
- **`/tokens/typography.css`** — Oswald (display, condensada, uppercase) + corpo + mono. Escalas.
- **`/tokens/effects.css`** — raios, sombras, blur.
- **`/tokens/base.css`** + **`/tokens/fonts.css`** — reset e @font-face.
- **`/assets/`** — logos (`logo-full.svg`, `logo-full-cream.svg` vetoriais; `logo-mark*.png`), imagens, mockups.
  - ⚠️ **Pendência:** o **símbolo de pista (mark) só existe em PNG** — extrair SVG no real.
- **`ui_kits/_shared/retake-ui.jsx`** — primitivos do protótipo (Button/Card/Badge/Tabs/Input/Avatar/Switch/Icon/StatCard/ComplianceTag). **Referência de API/variantes** para mapear aos componentes shadcn — não migrar o código.

### Theming por tenant (decisão de arquitetura)
- Tenant guarda `theme_tokens` (input) no banco; `deriveTokens(primary)` roda no **Edge** ao salvar, gera `derived` (surfaces/secondary) e valida **APCA**. Front injeta `derived` como CSS vars inline.
- **Personalidade sem fazer à mão:** tokens como *eixos de estilo* (radius, border, shadow, font, density) + **presets curados** + **biblioteca finita de blocos tokenizados**. Templates fixos AGORA (1 forte, recolorível); builder de blocos só com volume. Membro = bespoke à mão.

---

## 5. Ordem de reconstrução recomendada

1. **Fundação:** tokens → `@theme`; shadcn vestido com retake; `_chrome.js` → header/footer.
2. **Banco:** introspecção do schema atual × `banco-de-dados.md` → classificar **aproveitar/refatorar/dropar** → migrations. Planos/preços/features **no banco**.
3. **Auth + onboarding + RBAC** (ver `planos-onboarding-permissoes.md`) — base transversal.
4. **Público:** landing + site do tenant (fase artesanal) + forms ligados a Edge Function.
5. **Núcleo de corrida** (o fosso): threshold → treino estruturado → prescrito×executado.
6. **Captação/gestão:** leads (kanban), atletas, agenda, financeiro.
7. **Painéis de entidade** (admin/sponsor/supplier/organizer) conforme a fase do roadmap.
8. **Loja → eventos → marketplace** seguem a ordem do roadmap (§ `plataforma.html`).

---

## 6. Índice de documentos desta pasta

| Arquivo | Conteúdo |
|---|---|
| `README.md` (este) | Briefing-mestre, mapa de telas, ordem de reconstrução |
| `planos-onboarding-permissoes.md` | Entidades × planos × preços × onboarding × aprovações (KYC) × RBAC (quem faz o quê) |
| `banco-de-dados.md` | Especificação completa do schema (tabelas, PK/FK, enum/jsonb/normalizado, banco×front) |
| `modelo-de-produto.md` | Modelo de negócio (sites, cupons, patrocínio) consolidado |

> Os assets visuais e o código do protótipo ficam em `/ui_kits`, `/tokens`, `/assets` na raiz do projeto — referencie por caminho.

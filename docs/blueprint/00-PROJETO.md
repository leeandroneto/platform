# desafit.app — Constituição do projeto

> **Documento append-only.** Mudar qualquer item aqui exige decisão explícita
> de pivot do fundador, registrada em ADR + nova versão deste documento
> (nunca edição silenciosa). Referência permanente contra drift de conceito.
>
> **Última revisão:** 2026-05-17 · **Status:** accepted

---

## 1. Vision / Missão

desafit.app é a plataforma para profissionais de saúde, treinamento e bem-estar
criarem um aplicativo próprio com a sua marca — entregue done-for-you na fase
agência, evoluindo para SaaS self-service quando o playbook estiver codificado.
O profissional foca em método e relação com aluno; a plataforma resolve infra,
captação, entrega e retenção.

---

## 2. Modelo de negócio

**Fase atual: agência.** Fundador configura tenant manualmente para os primeiros
clientes. Self-service via vibe coding entra após validação operacional do
playbook agência.

**Mercado inicial:** Brasil. Idioma de operação pt-BR. Outros locales
(en-US / pt-PT / es-ES) suportados no schema dia 1, ativados sob demanda real.

**Vertical inicial:** musculação (`fitness_strength`). Arquitetura suporta
expansão para qualquer vertical sem reescrita do core.

**Cliente ideal:** personal trainer ou nutricionista com 30k+ seguidores,
faturando R$ 15k+/mês consistentemente, já vendeu pelo Hotmart/Kiwify, quer
marca própria — não quer aparecer dentro de marketplace.

---

## 3. Pacotes comerciais

Investimento único + mensalidade plataforma cobrada do profissional via
EFI Bank. Aluno paga prof direto via gateway escolhido (Asaas / Pagar.me /
Mercado Pago / Stripe BR) — plataforma NÃO intermedia.

### Pacote A — Vendas e captação · R$ 1.500

- Entrega: 30 dias
- Mensalidade: R$ 100/mês a partir do 31º dia (30 dias de cortesia)
- Promessa: estrutura completa para captar lead, vender programa e processar
  pagamento — sem aplicativo

**Inclui:**

- Subdomínio `seunome.desafit.app`
- Página de vendas do programa
- Página de captação com formulário
- Formulário de onboarding personalizado
- Cálculo automático TDEE / calorias / macros
- Checkout integrado (Pix + cartão)
- Cupons de desconto configuráveis
- Pixel Meta + Google Analytics
- E-mail transacional com domínio do prof
- Painel de leads

### Pacote B — Aplicativo com sua marca · R$ 3.000

- Entrega: 60 dias
- Mensalidade: R$ 200/mês a partir do 11º mês
  (10 meses de isenção alinhados ao parcelamento 10×)
- Promessa: o app do aluno com a marca do prof, conteúdo do programa,
  engajamento e retenção

**Inclui:**

- Aplicativo com sua marca (Android + iPhone, via PWA)
- Subdomínio `seunome.desafit.app`
- Estrutura do programa configurada conforme método do prof
- Player de vídeo com hospedagem inclusa
- Biblioteca de 800+ exercícios
- Biblioteca pessoal de vídeos do prof
- Materiais offline (PDFs salvos no app)
- Painel administrativo completo
- Migração de alunos via planilha
- Treinamento por videoconferência
- Check-in diário
- Galeria antes/depois
- Histórico completo de progresso
- Notificações push configuráveis
- Streak de dias consecutivos
- Marcação de séries, repetições e cargas
- **Bônus:** Gamificação personalizada (mês 3) + 10 meses sem mensalidade

### Pacote C — Conjunto completo (recomendado) · R$ 4.000

- Entrega total: 90 dias
- Mensalidade: R$ 200/mês a partir do 11º mês
- Promessa: operação ponta a ponta — captação, venda, app, engajamento,
  retenção — com desconto e bônus exclusivos

**Inclui tudo do Pacote A + tudo do Pacote B, mais bônus exclusivos:**

- Gamificação personalizada (mês 3)
- Chatbot nutricional com IA (entregue ~1 mês após pacote)
- 10 meses sem mensalidade
- Economia de R$ 500 vs A + B contratados separadamente

### Adicionais (cobrados separadamente)

| Item                           | Valor    | Prazo extra |
| ------------------------------ | -------- | ----------- |
| Programa adicional configurado | R$ 800   | +10 dias    |
| Setup tráfego pago (Meta Ads)  | R$ 1.200 | +7 dias     |
| Site institucional             | R$ 500   | +7 dias     |
| Página adicional customizada   | R$ 300   | +5 dias     |

### Formas de pagamento (todos pacotes)

- Pix à vista — 10% off
- 2× Pix (assinatura + entrega final)
- 10× cartão sem juros

---

## 4. Verticais — arquitetura agnóstica

**Ativa dia 1 (1):** `fitness_strength` — musculação.

**Princípio:** a plataforma deve suportar **qualquer tipo de vertical**
profissional — saúde, treinamento, bem-estar, educação, mentoria, terapia,
coaching, idiomas, etc. Nenhuma lista fechada de verticais futuras é definida
nesta constituição; decisão de ativar X ou Y vem quando cliente real chegar.

**Arquitetura:** plugin content library + `component.kind` polimórfico +
`payload jsonb` validado por Zod. Ativar vertical nova é **configuração**
(`verticals.active = true` + preencher `messages/<locale>/kinds.<vertical>.json`),
nunca refator de core.

---

## 5. 5 roles fixos

`user_role` enum global com 5 valores. Nunca expandir sem pivot.

| Role           | Escopo        | Função                                                                                        |
| -------------- | ------------- | --------------------------------------------------------------------------------------------- |
| `admin`        | global        | Leandro / equipe plataforma — controla tenants, prompts IA, billing, impersonation, broadcast |
| `professional` | tenant-scoped | Dono do tenant — cria/edita programas, gerencia alunos, recebe pagamentos                     |
| `client`       | tenant-scoped | Aluno final — consome programa via PWA, marca progresso, faz check-in                         |
| `staff`        | tenant-scoped | Assistente do `professional` dentro do tenant dele                                            |
| `influencer`   | global        | Afiliado — indica profissionais via link único, recebe comissão                               |

**Operação done-for-you (fase agência):** fundador executa via `admin` +
impersonation, sem role separado.

**Termos banidos** (lint enforce): `student` (use `client`), `trainer`
(use `professional`), `agency` (use `admin` + impersonation).

---

## 6. 5 tabs do PWA aluno

Bottom-nav fixa de 5 itens. Não admite hamburger nem 4/6 tabs. Escolhido pela
necessidade do produto desafit, não cópia de outro app.

| Tab          | Conteúdo                                                                           |
| ------------ | ---------------------------------------------------------------------------------- |
| **Início**   | Hoje + streak + próximo evento agendado                                            |
| **Programa** | Estrutura: módulos, componentes destravados/bloqueados, navegação dia a dia        |
| **Agenda**   | Lives, calls 1:1, encontros presenciais, deadlines de tarefa, check-ins semanais   |
| **Chatbot**  | Chatbot nutricional IA (Pacote C) + dúvidas sobre programa via IA                  |
| **Perfil**   | Settings, pagamento, progresso (peso, fotos, métricas, gamificação), suporte, sair |

**Sem chat 1:1 com profissional.** Comunicação prof→aluno é assíncrona via
push + email. Top-bar tem apenas logo do tenant + avatar do aluno (sem ícone
de chat).

---

## 7. Mobile-first 100% — incluindo painel profissional

**90% dos profissionais operam APENAS via mobile.** Estão sempre na rua entre
clientes e academias. Desktop é cenário minoritário (10%, planejamento em casa).

Implica:

- Painel profissional, editor, vibe coding, formulários — tudo funciona bem
  em viewport 375px com touch real
- Touch targets ≥ 44px em todo lugar (não só PWA aluno)
- Inputs ≥ 16px (sem auto-zoom iOS)
- Modais sempre bottom-sheet vaul em mobile (não Dialog desktop)
- Tabelas de dados viram cards stack vertical em mobile
- Drag-drop fino (editor tier 2) precisa funcionar com gestos touch reais
- Form-based primeiro (touch-friendly); drag-drop só onde gesto suporta

Desktop é progressive enhancement, nunca premissa.

---

## 8. Restrições não-negociáveis

### Arquitetura de produto

- **Multi-tenant white-label desde a primeira tabela.** Toda tabela tem
  `tenant_id`; toda RLS filtra por JWT; todo branding sai de
  `tenants.theme_tokens`.
- **Schema completo dia 1** (suporta 100% da proposta comercial). UI por
  cliente: cada feature da proposta é entregue ao 1º cliente —
  preferencialmente com ferramenta junto; manual aceito SÓ pro 1º cliente
  se cronograma apertar, com sprint imediato pós-1º para construir a
  ferramenta antes do 2º cliente entrar.
- **Modular para qualquer profissão.** Polimorfismo via `component.kind` +
  `payload jsonb` validado por Zod.

### Design system

- **13 paletas OKLCH oficiais.** Adicionar 14ª = pivot.
- **APCA Lc ≥ 60 body / 75 small text / 45 UI elements.** WCAG 2.2 AA
  como fallback.
- **shadcn new-york dark-first 100%.** Custom só com decision registrada.

### Hierarquia de busca de SOLUÇÃO (princípio geral inviolável)

Antes de codificar QUALQUER coisa — componente, helper, hook, schema
pattern, motion token, color token, error handler, lint rule,
arquitetura, PWA strategy, AI prompt, RLS pattern — buscar nesta ordem:

1. **Padrão oficial estabelecido** — W3C, Material 3, iOS HIG, WCAG,
   Postgres docs, Next.js docs, React docs, Tailwind v4 spec, RFC,
   apca-w3 spec, etc.
2. **Lib / registry maduro** — shadcn, Radix, Motion 12, Open Props,
   dnd-kit, Serwist, Vercel AI SDK, Supabase SDK, etc. Versionados,
   mantidos, com testes em produção.
3. **Pattern documentado da comunidade** — registry colável shadcn
   (Credenza, Origin UI, Magic UI pontual, Aceternity só landing, Kibo UI),
   blog oficial, exemplo de produção conhecido.
4. **Custom novo** — apenas quando 1, 2 e 3 não cobrirem, com decisão
   registrada em ADR (`docs/adr/`) ou `docs/components/decisions.md`.

Aplicado a TUDO. Custo psicológico de criar do zero deve ser alto.
Sempre que possível: "qual é o padrão público pra isso?" antes de
"como vou implementar?". Evita a bagunça de soluções proliferantes
e reinvenções do projeto anterior.

**Critério premium adicional:** desafit é app premium. UX/UI moderna e
de ponta vale custo extra de complexidade controlada. Privilegiar
**recurso atual em produção** (React 19, Next.js 16, Tailwind v4,
Motion 12, View Transitions API, OKLCH, APCA, Material 3 tokens
atuais, Cache Components, etc) sobre soluções legadas mesmo que mais
difundidas. Decisão entre "subset minimalista" vs "padrão completo"
sempre tende ao MAIS rico, desde que mantenha consistência interna
(não misturar paradigmas — escolhe um padrão moderno e segue ele).

### Disciplina de código

- **Zero `eslint-disable`** exceto allowlist exata (shadcn vendored,
  third-party-component, fixtures de teste). CI bloqueia.
- **Vocabulário banido (lint enforce):** `student`, `trainer`, `agency`,
  `intake`, `wizard`, `prospect`, `diagnostic`, `customization`,
  `workspace`, `framer-motion`, `aluno` em folder, `prof-*` abreviado,
  `reflexao`/`pilares`/`ato_*` (JSONB PT do legado).
- **pnpm only.** Nunca npm/yarn.
- **EN no DB + código + folders. PT-BR na URL pública e na UI**
  (via rewrites + next-intl).

### Pagamentos

- **Plataforma cobra prof via EFI Bank** (Pix recorrente + cartão 10×).
- **Aluno paga prof direto** via gateway escolhido — plataforma NÃO
  intermedia na fase agência nem na fase SaaS self-service inicial.
- **Pagar.me marketplace split** entra apenas na fase SaaS marketplace
  futura (quando virar take rate sobre vendas).

### Comunicação prof ↔ aluno

- **Apenas push + email.** Sem chat 1:1 in-app.
- `component_kind='message'` é CONTEÚDO DE PROGRAMA (motivacional pré-escrita),
  não conversa.
- **Chatbot do PWA = IA**, nunca prof.

### Acesso

- **Aluno e profissional usam login email + senha** (não magic link).
  PWA fitness abre 3-5×/dia — magic link cria fricção inaceitável.

---

## 9. Brand assets — zero inline

Qualquer ativo da identidade visual (logo, cores, tipografia, nome da marca,
ícones próprios, espaçamentos, sombras) **vive em token ou componente único**.
Inline literal proibido em código.

- **Cor da marca:** trocar = editar 1 token OKLCH, propaga 100%.
- **Logo:** trocar = editar 1 SVG, propaga 100% via componente `<Logo>`.
- **Tipografia:** trocar = editar variável `--font-brand`, propaga 100%.
- **Nome da marca (`desafit.app`):** sempre via `<Logo>` ou metadata centralizada.
  Lint bloqueia string literal `"desafit"` / `"desafit.app"` fora de allowlist
  (metadata SEO, ADR, comentário técnico).

Mesma regra recursivamente para tenant white-label: cor, logo, fonte e nome de
cada tenant vivem em CSS via API route (D-G59) — zero hardcode, troca em runtime.

Motivo: incidente onboarding.bio teve `onbio` / `o.b` / `onboarding.bio` /
sem logo coexistindo em headers diferentes. Não repetir.

---

## 10. Restrições temporais

### Proposta comercial

- Validade: **7 dias** a partir da emissão
- Início dos trabalhos: após confirmação do pagamento inicial

### Setup (cronograma máximo)

- Pacote A: 30 dias
- Pacote B: 60 dias
- Pacote C: 90 dias
- Cronograma pode antecipar OU atrasar conforme imprevistos —
  comunicação aberta semana a semana

### Mensalidade plataforma

- Pacote A: cobrança inicia no 31º dia após entrega
- Pacotes B/C: cobrança inicia no 11º mês após assinatura
  (alinhada ao fim do parcelamento 10×)

---

## Histórico de revisões

| Data       | Mudança                                                                                                                                                                 | Aprovador |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — verticais agnósticas; staff mantido; beta removido (não pertence ao desafit)                                                                           | Leandro   |
| 2026-05-17 | §8 — adicionada hierarquia de 4 níveis de busca de componentes (shadcn → block → registry comunidade → custom)                                                          | Leandro   |
| 2026-05-17 | §8 — hierarquia de busca generalizada como princípio inviolável aplicado a tudo (padrão oficial → lib madura → comunidade → custom)                                     | Leandro   |
| 2026-05-17 | §9 nova — Brand assets zero inline; troca de cor/logo/fonte/nome propaga via token único; lint bloqueia "desafit" literal; mesma regra recursiva pra tenant white-label | Leandro   |
| 2026-05-17 | §8 — adicionado critério "premium" (privilegiar recurso moderno atual, subset rico em vez de minimalista)                                                               | Leandro   |

# retake.run — Modelo de Produto (sites, cupons, patrocínio)

> Análise consolidada em 10 jun 2026, a partir das decisões do fundador.
> Complementa o "Mapa Completo do Produto" (§4, §9, §13, §21, §23).

## 1. A escada de sites (3 níveis)

| | Grátis | Apoiador · R$ 29/mês (anual) · R$ 19 (bienal) | Membro · R$ 59/mês (anual) · R$ 39 (bienal) |
|---|---|---|---|
| Endereço | `retake.run/seuclube` | + domínio próprio | + domínio próprio |
| Design | 6 paletas (light/dark) | white label: template com a identidade da marca | site 100% personalizado, feito pela retake |
| Diretório público de assessorias | ❌ não aparece | ✅ aparece, com destaque | ✅ aparece, com destaque |
| Propaganda | faixa de marcas (financia o grátis) | faixa de marcas | **remoção total das marcas** |
| Captação | form → leads 100% do clube + dashboard | idem | idem |
| Produtos próprios (entrega/retirada local) | ❌ | ✅ comissão por produto (definida pela retake) | ✅ |
| Eventos no calendário | — | até 3 | + |
| Programas online divulgados na retake | — | — | até 5 (sem intermediar pagamento) |
| Voto nas decisões · acesso antecipado | — | — | ✅ · contrato anual ou bienal |

**Racional:** o grátis capta volume e é financiado pelas marcas; produtos próprios com
pagamento ficam fora do grátis (proteção de marca / MoR) — no grátis só entrega ou
retirada local. URLs em **path** (`retake.run/seuclube`), não subdomínio.

## 2. De onde vêm as informações do site

O site **projeta um cadastro** — nunca tem conteúdo próprio:
- Identidade (logo, paleta) → `tenant_themes` (versionado)
- Pessoas (treinadores: nome, CREF, bio, foto) → `memberships`
- Oferta (planos, serviços, preços, horários) → `plans` / `products`
- Textos (headline, sobre, depoimentos) → `pages` / `page_versions`

O onboarding self-service é o primeiro preenchimento. Depois: dashboard ("Meu site")
ou vibe coding. **Mesma fonte para grátis e pago** — o pago renderiza mais blocos.
Upgrade não refaz nada.

### Vibe coding (grátis e pago)
- IA escreve no **banco**, nunca no código (3 velocidades do §4)
- **Plan Approval Gate** (`engine_plans`): IA propõe → tenant aprova → aplica → ISR revalida
- Caso de uso âncora: **geração de copy** (entrevista → headline, bios, descrições)
- Créditos de IA por plano (`feature_usage`, §9) diferenciam grátis vs pago

## 3. Cotas de patrocínio — modelo MVP (sem marketplace)

> Modelo de marcas é **geográfico**: a marca escolhe o alcance. Patrocínio é
> self-service e o cupom não precisa de aprovação. Vitrine B2B e a área de cupons
> passam por curadoria (anti-poluição).

| | Patrocinador Estadual | Patrocinador Nacional | Patrocinador Oficial | Vitrine B2B |
|---|---|---|---|---|
| Quem é | marca que quer um ou mais estados | marca que quer o Brasil inteiro | marca que quer ser dona da categoria | fornecedor que vende para assessorias |
| Paga | **R$ 100/mês por estado** (soma vários) | **R$ 500/mês** | **sob proposta** | **R$ 99/mês** |
| Prazo | mín. 3 meses antecipado · trimestral 3x ou anual 12x | idem | negociado | mensal |
| Recebe | faixa de marcas + página de marca no alcance · cupom sem aprovação · 1 post ao contratar | tudo do estadual, nacional · destaque na área de cupons | exclusividade de categoria · selo licenciável · naming · preferência na renovação | perfil no diretório · badge · orçamento direto |
| Requisitos | CNPJ · logo+descrição+link em 7 dias | idem | CNPJ · acordo | CNPJ + KYC |

**Patrocinador Oficial:** sem preço de tabela; pode coexistir com patrocinadores da
mesma categoria até os contratos vencerem (ou esperar a categoria abrir).

**Cupons & Afiliados — receita da retake, não cota vendida à marca:** a retake se
cadastra em programas de afiliados (AWIN, Rakuten, parcerias diretas), gera cupons da
rede e publica na área de cupons; fica com a comissão negociada. Marcas menores podem
**solicitar entrada** de um cupom — a retake aprova. Patrocinadores criam cupom sem
aprovação. Corredores: 100% gratuito (sem plano pago por enquanto).

## 4. Lacunas a resolver

1. **Painel do patrocinador** — cadastrar marca/cupom; ver impressões, cliques,
   usos, comissão. Sem isso não renova. *(protótipo: `ui_kits/sponsor-panel/`)*
2. **Contagem de impressões do marquee** por site (mídia sem métrica não se vende)
3. **Anti-abuso do grátis** — validação leve: WhatsApp verificado, Instagram, CREF
4. **Arquivamento de sites abandonados** (sem login/lead em X meses → despublica);
   a qualidade da rede É o produto vendido às marcas
5. **LGPD** — lead pertence ao tenant; retake é operadora; aceite no form
6. **Guardrails do vibe coding** — IA edita conteúdo/tokens, nunca composição
7. **Aprovação de marca/cupom** pela retake antes de publicar (régua do KYC)

## 5. Superfícies no protótipo

- `ui_kits/tenant-site/` — site Essencial + onboarding self-service
- `ui_kits/landing/corredores.html` — hub do corredor (assessorias + marcas & cupons)
- `ui_kits/landing/empresas.html` — hub B2B (cotas + diretório de fornecedores)
- `ui_kits/dashboard/` — "Meu site" (cadastro + vibe coding)
- `ui_kits/sponsor-panel/` — painel do patrocinador (cupom + relatório)

# 0022. Marca pai (holding) é identidade comercial, zero tech dia 1

Date: 2026-05-17
Status: accepted

## Context

Decisão de como múltiplas marcas (desafit + yoga + ingles + onboarding.bio retomado) se relacionam. Fundador planeja holding/marca-pai comercial. Fonte: `_CONFLITOS.md #22` + memória `project_desafit_multi_brand_strategy`.

## Decision

Marca pai é **identidade comercial**, zero impacto técnico dia 1.

**Aparece em:**
- Footer (`Powered by <marca-pai>`)
- About / Sobre
- LGPD / termos de serviço
- Vercel team name (governance)
- GitHub organization

**NÃO aparece em:**
- Schema (continua `platform.*`)
- Rotas (continua `<slug>.desafit.app` / `<slug>.yoga.app`)
- Componentes
- Lógica de produto
- Env vars técnicas

**Admin global multi-marca só entra em M+12** quando 2ª marca rodar (princípio §39 mesmo pra ferramenta interna).

## Consequences

**Positivo:**
- Tech permanece coerente (não vai precisar refator pra "extrair" marca pai depois)
- Marca pai pode mudar (rename, sale, M&A) sem refator tech
- Cada marca filha mantém autonomia visual/posicionamento

**Negativo:**
- Quando 2ª marca rodar, admin global precisa ser construído (esperado)

**Neutro:**
- Lista de "lugares onde aparece" guia revisão visual dia 1
- ADR-0021 (schema core) é dependência direta
- ADR-0023 (onboarding.bio retomada) reforça princípio (marca filha = repo separado)

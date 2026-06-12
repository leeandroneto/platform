// RESEARCH: copy literal vercel/chatbot Apache-2.0 (lib/constants.ts) + adapt (Sprint 1.3 E.3a)
// Removidos: generateDummyPassword + DUMMY_PASSWORD + guestRegex — sao artefatos de NextAuth/Drizzle
// no fork pra guest users. Nosso auth e Supabase OAuth/email-link (ADR-0062), sem guest mode.

export const isProductionEnvironment = process.env.NODE_ENV === 'production'
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development'
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.PLAYWRIGHT || process.env.CI_PLAYWRIGHT,
)

// PATCH-2026-05-26 tarde (Sprint 1.4.A3): substituídos prompts demo upstream
// (Next.js advantages, Dijkstra, Silicon Valley essay, San Francisco weather)
// por prompts do nosso domínio (criação de conteúdo SaaS B2B fitness/yoga/coach).
// JIT: refatorar pra puxar via tenant business_profile quando Sprint 1.4 Bloco B
// (system prompt v2 tenant-aware) entrar — sugestões dinâmicas por modalidade/formato.
export const suggestions = [
  'Crie um formulário de captação de leads pra minha academia',
  'Gere uma landing de oferta pra promoção de fim de ano',
  'Monte um relatório de avaliação inicial pra novos clientes',
  'Estruture um briefing de campanha pra próximo lançamento',
]

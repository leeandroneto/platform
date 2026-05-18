// i18n/request.ts — next-intl 4 server-side config (ADR-0040 §G).
//
// Dia 0: locale fixo pt-BR (decisão 13). Rota `app/[locale]/` adiada JIT
// (gatilho em .claude/rules/i18n.md "Condição de revisitar").
//
// Namespace por feature: cada feature carrega seu próprio namespace via dynamic
// import. Dia 0 só `common` (actions, errors, validation). Auth/billing/programs/
// push/email/kinds.<vertical> entram JIT por feature.

import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'pt-BR'
  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
    },
  }
})

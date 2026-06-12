// lib/i18n/routing.ts — next-intl 4 routing config (Sprint 1.2).
//
// localePrefix 'as-needed' — pt-BR sem prefixo na URL (canônico user-facing
// PT-BR), en/es com prefixo /en/* e /es/*.
//
// localeDetection true — next-intl resolve via Accept-Language header e
// cookie NEXT_LOCALE em primeira visita. proxy.ts complementa propagando
// header x-locale pra RSC (ver detect-locale.ts).
//
// Aplica-se SÓ a rotas em app/[locale]/(publico)/**. Painel logado
// (app/(painel)/**) + auth (app/(auth)/**) NÃO localizados — decisão D8.

import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
})

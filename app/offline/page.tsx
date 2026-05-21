// RESEARCH: offline fallback page — precached pelo SW (Serwist fallbacks ADR-0014).
// Server Component minimalista. Copy via t() next-intl. Logo do tenant via <Logo>
// quando RouteProvider tiver brand (online retorna do cache OU se offline carrega
// shell sem brand).
//
// Pós-pivot ADR-0044: <Heading>/<Text> deletados (re-add JIT). Markup HTML plain
// até Fase 1 do pivot reintroduzir typography wrappers se valor agregado real.

import { getTranslations } from 'next-intl/server'

export default async function OfflinePage() {
  const t = await getTranslations('common')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="font-semibold">{t('errors.offline')}</h2>
      <p className="text-muted-foreground max-w-md">{t('errors.offline')}</p>
    </main>
  )
}

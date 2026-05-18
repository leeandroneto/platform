// RESEARCH: offline fallback page — precached pelo SW (Serwist fallbacks ADR-0014).
// Server Component minimalista. Copy via t() next-intl. Logo do tenant via <Logo>
// quando RouteProvider tiver brand (online retorna do cache OU se offline carrega
// shell sem brand).

import { getTranslations } from 'next-intl/server'

import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'

export default async function OfflinePage() {
  const t = await getTranslations('common')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <Heading level={2}>{t('errors.offline')}</Heading>
      <Text variant="body" className="text-muted-foreground max-w-md">
        {t('errors.offline')}
      </Text>
    </main>
  )
}

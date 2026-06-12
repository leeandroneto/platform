// RESEARCH: extract pattern — SWR fetch + transform + error toast logic
// extraído do TenantSidebar pra reduzir LOC. Sprint Bloco B 2026-05-27.

'use client'

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'
import useSWRInfinite from 'swr/infinite'

import { type ChatHistory, getChatHistoryPaginationKey } from '@/lib/chat/history-pagination'
import type { Recent } from '@/lib/types/sidebar'
import { fetcher } from '@/lib/utils/chat-helpers'

/**
 * SWR fetch dos chats recents (pagination cursor — pattern fork ai-chatbot).
 * Retorna lista `Recent[]` mapeada + toast no failure (não bloqueia render).
 *
 * @param enabled - false desabilita fetch (user não autenticado)
 */
export function useChatRecents(enabled: boolean): Recent[] {
  const t = useTranslations('painel')

  const { data: paginatedRecents, isLoading } = useSWRInfinite<ChatHistory>(
    enabled ? getChatHistoryPaginationKey : () => null,
    fetcher,
    { fallbackData: [], revalidateOnFocus: false },
  )

  const recents: Recent[] = useMemo(() => {
    if (!paginatedRecents) return []
    return paginatedRecents.flatMap((page) =>
      page.chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        url: `/conversas/${chat.id}`,
        createdAt: chat.created_at,
      })),
    )
  }, [paginatedRecents])

  useEffect(() => {
    if (!isLoading && paginatedRecents === undefined && enabled) {
      toast.error(t('recents.loadError'))
    }
  }, [isLoading, paginatedRecents, enabled, t])

  return recents
}

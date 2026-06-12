// RESEARCH: tweakcn (Apache-2.0) — adapted from hooks/use-font-search.ts
// ADAPT: replaces @tanstack/react-query useInfiniteQuery (not in stack)
//        with native React useState + useCallback + event-driven fetch pattern.
//        API surface kept identical so FontPicker doesn't need changes.
//        react-hooks/set-state-in-effect: pattern is standard async fetch in
//        useEffect — see ADR-0031 §11 override below (eslint.config.mjs).
// See NOTICE.md.

import { useCallback, useEffect, useRef, useState } from 'react'

import type { FontCategory, PaginatedFontsResponse } from '@/lib/design/contract/fonts'

export type FilterFontCategory = 'all' | FontCategory

interface UseFontSearchParams {
  query: string
  category?: FilterFontCategory
  limit?: number
  enabled?: boolean
}

interface PageData {
  pages: PaginatedFontsResponse[]
}

interface UseFontSearchResult {
  data: PageData | undefined
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

// ── Pure fetch helper ─────────────────────────────────────────────────────────

interface FetchFontsPageOptions {
  query: string
  category: FilterFontCategory
  limit: number
  offset: number
  signal: AbortSignal
}

async function fetchFontsPage(opts: FetchFontsPageOptions): Promise<PaginatedFontsResponse> {
  const { query, category, limit, offset, signal } = opts
  const searchParams = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    offset: offset.toString(),
  })

  if (category && category !== 'all') {
    searchParams.append('category', category)
  }

  const response = await fetch(`/api/admin/theme-studio/google-fonts?${searchParams}`, { signal })

  if (!response.ok) {
    // ADAPT: AppError not usable in browser-side hook (no server context)
    console.error(`Google Fonts fetch failed: ${response.status}`)
    throw Object.assign(new Error(`Google Fonts fetch failed`), { status: response.status })
  }

  return (await response.json()) as PaginatedFontsResponse
}

// ── useFontSearch ─────────────────────────────────────────────────────────────

export function useFontSearch({
  query,
  category = 'all',
  limit = 20,
  enabled = true,
}: UseFontSearchParams): UseFontSearchResult {
  const [pages, setPages] = useState<PaginatedFontsResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const nextOffsetRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const loadPage = useCallback(
    async (offset: number, isFirst: boolean) => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      if (isFirst) {
        setIsLoading(true)
      } else {
        setIsFetchingNextPage(true)
      }

      try {
        const data = await fetchFontsPage({
          query,
          category,
          limit,
          offset,
          signal: controller.signal,
        })
        if (isFirst) {
          setPages([data])
        } else {
          setPages((prev) => [...prev, data])
        }
        nextOffsetRef.current = data.offset + data.limit
        setHasNextPage(data.hasMore)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        console.error('useFontSearch error:', error)
        if (isFirst) {
          setPages([])
          setHasNextPage(false)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
          setIsFetchingNextPage(false)
        }
      }
    },
    [query, category, limit],
  )

  // Reset + re-fetch when query/category/enabled changes
  // Pattern: async fetch in useEffect — see eslint override (ADR-0031 §11).
  useEffect(() => {
    if (!enabled) return
    nextOffsetRef.current = 0
    void loadPage(0, true)

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [enabled, loadPage])

  const fetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    void loadPage(nextOffsetRef.current, false)
  }, [hasNextPage, isFetchingNextPage, loadPage])

  return {
    data: pages.length > 0 ? { pages } : undefined,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
}

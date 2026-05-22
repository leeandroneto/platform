// tests/setup.ts — Setup global do Vitest
// Carregado automaticamente via vitest.config.ts setupFiles

import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Mock `server-only` — impede que o guard "This module cannot be imported from a
// Client Component module" quebre testes de unidade (Vitest não é Next.js RSC).
vi.mock('server-only', () => ({}))

// ─── Mock `nuqs` — Storybook + jsdom não fornecem adapter Next ────────────
// useQueryState retorna par [value, setter] estável; usado em preview-panel,
// preset-select. Pass-through default value pra render.
vi.mock('nuqs', () => ({
  useQueryState: (
    _key: string,
    options?: { defaultValue?: unknown; parse?: (v: string) => unknown },
  ) => {
    const fallback = (options?.defaultValue ?? '') as unknown
    const value = options?.parse ? options.parse(String(fallback)) : fallback
    return [value, vi.fn()]
  },
  useQueryStates: () => [{}, vi.fn()],
}))

// ─── Mock `next-intl` — useTranslations pass-through pra key ─────────────
// Componentes do theme-studio chamam useTranslations('namespace') em massa;
// retornar a key estabiliza assertions sem precisar montar messages dict.
vi.mock('next-intl', () => ({
  useTranslations: (_namespace?: string) => {
    const t = (key: string, _values?: Record<string, unknown>) => key
    // next-intl `t.rich`, `t.raw` etc — stubs no-op (componentes só usam `t(key)`)
    Object.assign(t, { rich: t, raw: t, markup: t, has: () => true })
    return t
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// ─── Mock `next-themes` — useTheme + ThemeProvider ───────────────────────
// contrast-checker usa next-themes pra toggle. jsdom não tem provider;
// stub retorna 'light' + setter spy.
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
    systemTheme: 'light',
    themes: ['light', 'dark', 'system'],
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// ─── Mock RouteProvider — brand/tenant fixtures pra hooks no client ──────
vi.mock('@/lib/route/RouteProvider', () => {
  const mockBrand = {
    id: 'mock-brand',
    name: 'mock',
    host: 'localhost',
    logo_url: null,
    default_vertical: 'fitness',
    parent_label: null,
    theme_version: 1,
  }
  const mockTenant = {
    id: 'mock-tenant',
    slug: 'mock',
    brand_id: 'mock-brand',
    name: 'Mock',
    vertical: 'fitness',
    theme_version: 1,
  }
  return {
    useBrand: () => mockBrand,
    useTenant: () => mockTenant,
    useTenantOptional: () => mockTenant,
    RouteProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})

// ─── Mock Google Fonts loader — evita network/style injection em jsdom ───
vi.mock('@/lib/design/fonts/google-fonts', async () => {
  const actual = await vi.importActual<typeof import('@/lib/design/fonts/google-fonts')>(
    '@/lib/design/fonts/google-fonts',
  )
  return {
    ...actual,
    loadGoogleFont: vi.fn(),
    fetchGoogleFonts: vi.fn().mockResolvedValue([]),
  }
})

// ─── Mock font helpers (waitForFont, buildFontFamily, getDefaultWeights) ──
vi.mock('@/lib/design/fonts/index', async () => {
  const actual = await vi.importActual<typeof import('@/lib/design/fonts/index')>(
    '@/lib/design/fonts/index',
  )
  return {
    ...actual,
    waitForFont: vi.fn().mockResolvedValue(undefined),
  }
})

// ─── Mock useFontSearch — evita network fetch em FontPicker ──────────────
vi.mock('@/lib/hooks/use-font-search', () => ({
  useFontSearch: ({ enabled = true }: { enabled?: boolean } = {}) => ({
    data: enabled
      ? {
          pages: [
            {
              fonts: [
                {
                  family: 'Inter',
                  category: 'sans-serif' as const,
                  variants: ['400', '500', '700'],
                  variable: true,
                },
                {
                  family: 'Roboto',
                  category: 'sans-serif' as const,
                  variants: ['400', '700'],
                  variable: false,
                },
              ],
              offset: 0,
              limit: 15,
              hasMore: false,
            },
          ],
        }
      : undefined,
    isLoading: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
  }),
}))

// ─── Mock IntersectionObserver (jsdom não tem) ────────────────────────────
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
  root = null
  rootMargin = ''
  thresholds = []
} as unknown as typeof IntersectionObserver

// ─── Mock ResizeObserver (Radix/shadcn primitives need it) ────────────────
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
;(global as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
  MockResizeObserver as unknown as typeof ResizeObserver

// ─── Mock matchMedia (jsdom não tem completo) ─────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ─── Mock scrollIntoView (jsdom não implementa) ───────────────────────────
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}

// ─── Mock navigator.clipboard pra code-panel copy tests ───────────────────
if (typeof navigator !== 'undefined' && !navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined), readText: vi.fn() },
    writable: true,
    configurable: true,
  })
}

// ─── Mock crypto.randomUUID (Node 24+ tem, mas garante consistência) ──────
if (!('randomUUID' in crypto)) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => '00000000-0000-0000-0000-000000000000',
  })
}

beforeAll(() => {
  // Setup global antes de TODOS os testes
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.restoreAllMocks()
})

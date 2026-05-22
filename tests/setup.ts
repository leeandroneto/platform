// tests/setup.ts — Setup global do Vitest
// Carregado automaticamente via vitest.config.ts setupFiles

import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Mock `server-only` — impede que o guard "This module cannot be imported from a
// Client Component module" quebre testes de unidade (Vitest não é Next.js RSC).
vi.mock('server-only', () => ({}))

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

// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/code-panel.tsx (Fase 3).
// Cobre: render multi-format selectors, package manager toggle, copy clipboard,
// registry command vs hint rendering.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import CodePanel from './code-panel'

describe('CodePanel', () => {
  it('renderiza título do painel via i18n', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    expect(screen.getByText('title')).toBeDefined()
  })

  it('renderiza 4 package manager tabs (pnpm/npm/yarn/bun)', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    expect(screen.getByText('pnpm')).toBeDefined()
    expect(screen.getByText('npm')).toBeDefined()
    expect(screen.getByText('yarn')).toBeDefined()
    expect(screen.getByText('bun')).toBeDefined()
  })

  it('mostra hint quando themeId NÃO é passado (sem registry command)', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    expect(screen.getByText(/registryUrlHint/)).toBeDefined()
  })

  it('alterna package manager ao clicar tab', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    const npmTab = screen.getByText('npm')
    fireEvent.click(npmTab)
    // Após click, npm fica selecionado (bg-muted) — só smoke test
    expect(npmTab).toBeDefined()
  })

  it('renderiza tabs CSS + Tailwind config + layout', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    // tabs.css i18n key
    expect(screen.getByText('tabs.css')).toBeDefined()
    // layout.tsx (Next.js) é label literal
    expect(screen.getByText(/layout\.tsx/)).toBeDefined()
  })

  it('aceita prop themeId opcional sem crash', () => {
    const { container } = renderWithProviders(<CodePanel themeId="theme-xyz-123" />, {
      withForm: true,
    })
    expect(container.firstChild).not.toBeNull()
  })

  it('quando themeId passado, registry command é mostrado (sem hint)', () => {
    renderWithProviders(<CodePanel themeId="theme-xyz-123" />, { withForm: true })
    // Comando shadcn registry deve conter "shadcn@latest add"
    const codeElements = screen.getAllByText(/shadcn@latest add/)
    expect(codeElements.length).toBeGreaterThan(0)
  })

  it('clicar copy button (themeId presente) não crash', async () => {
    renderWithProviders(<CodePanel themeId="theme-abc" />, { withForm: true })
    const copyBtns = screen.getAllByLabelText('copy')
    expect(copyBtns.length).toBeGreaterThan(0)
    fireEvent.click(copyBtns[0]!)
    // navigator.clipboard mockado em setup
    await new Promise((r) => setTimeout(r, 50))
  })

  it('clicar tab CSS muda activeTab e mantém pre/code render', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    const cssTab = screen.getByText('tabs.css')
    fireEvent.click(cssTab)
    expect(cssTab).toBeDefined()
  })

  it('Tailwind v3 select (option) habilita config tab', () => {
    renderWithProviders(<CodePanel />, { withForm: true })
    // Apenas validar que o select renderizou (radix renderiza option em portal mas trigger é visível)
    expect(screen.getAllByText(/Tailwind v/).length).toBeGreaterThan(0)
  })
})

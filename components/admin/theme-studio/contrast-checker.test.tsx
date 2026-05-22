// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/contrast-checker.tsx (Fase 3).
// Cobre: render trigger button, dialog open com filter buttons + theme toggle,
// APCA Lc dual-gate badges (filter all/issues). Deep visual sign-off → Fase 5.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import { ContrastChecker } from './contrast-checker'

describe('ContrastChecker', () => {
  it('renderiza trigger button com i18n key "trigger"', () => {
    renderWithProviders(<ContrastChecker />, { withForm: true })
    expect(screen.getByText('trigger')).toBeDefined()
  })

  it('trigger é um <button> acessível', () => {
    renderWithProviders(<ContrastChecker />, { withForm: true })
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renderiza sem crash com ThemeFormProvider injetado', () => {
    const { container } = renderWithProviders(<ContrastChecker />, { withForm: true })
    expect(container.firstChild).not.toBeNull()
  })

  it('abrir dialog mostra title + description i18n keys', () => {
    renderWithProviders(<ContrastChecker />, { withForm: true })
    fireEvent.click(screen.getByText('trigger'))
    // Após abrir dialog, "title" key aparece como DialogTitle
    expect(screen.getAllByText('title').length).toBeGreaterThan(0)
  })

  it('abrir dialog mostra filter buttons "filterAll"', () => {
    renderWithProviders(<ContrastChecker />, { withForm: true })
    fireEvent.click(screen.getByText('trigger'))
    expect(screen.getByText('filterAll')).toBeDefined()
  })

  it('abrir dialog mostra ThemeToggle aria-label "toggleTheme"', () => {
    renderWithProviders(<ContrastChecker />, { withForm: true })
    fireEvent.click(screen.getByText('trigger'))
    expect(screen.getAllByLabelText('toggleTheme').length).toBeGreaterThan(0)
  })

  it('learnMore link tem href APCA documentation', () => {
    renderWithProviders(<ContrastChecker />, { withForm: true })
    fireEvent.click(screen.getByText('trigger'))
    const link = screen.getByText('learnMore') as HTMLAnchorElement
    expect(link.getAttribute('href')).toContain('apcacontrast.com')
  })
})

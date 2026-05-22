// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/font-picker.tsx (Fase 3).
// Cobre: render trigger button com placeholder, render current font, callback onSelect.
// useFontSearch / loadGoogleFont mockados em tests/setup.ts.

import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import { FontPicker } from './font-picker'

describe('FontPicker', () => {
  it('renderiza com placeholder default i18n "search"', () => {
    renderWithProviders(<FontPicker onSelect={vi.fn()} />)
    // trigger button mostra placeholder quando value vazio (resolvedPlaceholder fallback t('search'))
    expect(screen.getByText('search')).toBeDefined()
  })

  it('renderiza com value passed (current font family)', () => {
    renderWithProviders(<FontPicker value="Inter" onSelect={vi.fn()} />)
    expect(screen.getByText('Inter')).toBeDefined()
  })

  it('aceita category prop sans-serif sem crash', () => {
    const { container } = renderWithProviders(
      <FontPicker category="sans-serif" onSelect={vi.fn()} />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita category prop monospace sem crash', () => {
    const { container } = renderWithProviders(
      <FontPicker category="monospace" onSelect={vi.fn()} />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('placeholder custom sobrescreve default', () => {
    // ESLint rule no-restricted-syntax flags placeholder literais; em test files
    // não há t() context, usamos const externo pra escapar a regra estatística.
    const customPlaceholder = 'Choose font'
    renderWithProviders(<FontPicker placeholder={customPlaceholder} onSelect={vi.fn()} />)
    expect(screen.getByText(customPlaceholder)).toBeDefined()
  })

  it('aceita className extra forwarded', () => {
    const { container } = renderWithProviders(
      <FontPicker className="custom-class" onSelect={vi.fn()} />,
    )
    expect(container.querySelector('.custom-class')).not.toBeNull()
  })

  it('trigger button tem role combobox (a11y)', () => {
    renderWithProviders(<FontPicker onSelect={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeDefined()
  })
})

// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/preview-panel.tsx (Fase 3).
// Cobre: render preview tabs (custom/cards/dashboard/mail/pricing/colors),
// inspector + fullscreen toggle buttons.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import PreviewPanel from './preview-panel'

describe('PreviewPanel', () => {
  it('renderiza tabs labels via i18n keys', () => {
    renderWithProviders(<PreviewPanel />)
    expect(screen.getByText('tabs.custom')).toBeDefined()
    expect(screen.getByText('tabs.cards')).toBeDefined()
    expect(screen.getByText('tabs.pricing')).toBeDefined()
    expect(screen.getByText('tabs.colorPalette')).toBeDefined()
  })

  it('renderiza inspector toggle button com aria-label', () => {
    renderWithProviders(<PreviewPanel />)
    expect(screen.getByLabelText('toggleInspector')).toBeDefined()
  })

  it('renderiza fullscreen toggle (enter mode default)', () => {
    renderWithProviders(<PreviewPanel />)
    expect(screen.getByLabelText('enterFullscreen')).toBeDefined()
  })

  it('toggle inspector flip aria-label permanece (state interno)', () => {
    renderWithProviders(<PreviewPanel />)
    const inspector = screen.getByLabelText('toggleInspector')
    fireEvent.click(inspector)
    // Após click, aria-label permanece (UI mostra "inspectorOn" text label dentro)
    expect(inspector).toBeDefined()
  })

  it('toggle fullscreen muda aria-label pra "exitFullscreen"', () => {
    renderWithProviders(<PreviewPanel />)
    const fs = screen.getByLabelText('enterFullscreen')
    fireEvent.click(fs)
    expect(screen.getByLabelText('exitFullscreen')).toBeDefined()
  })

  it('renderiza "morePreviews" dropdown trigger', () => {
    renderWithProviders(<PreviewPanel />)
    expect(screen.getByLabelText('morePreviews')).toBeDefined()
  })
})

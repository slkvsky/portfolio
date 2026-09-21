import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Pricing } from './Pricing'
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'

/** Triggers a language switch from inside the provider without going through
 * the header toggle, which this section doesn't render on its own. */
function SwitchToDe() {
  const { setLang } = useLanguage()
  return <button onClick={() => setLang('de')}>switch-to-de</button>
}

describe('Pricing', () => {
  it('keeps calculator selections and the € sign after a language switch', () => {
    render(
      <LanguageProvider>
        <SwitchToDe />
        <Pricing />
      </LanguageProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Web app' }))
    fireEvent.click(screen.getByRole('button', { name: 'Large' }))
    expect(screen.getByRole('button', { name: 'Web app' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getAllByText(/€/).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByText('switch-to-de'))

    // Selections carry over as the same options, just relabelled in German —
    // choices are stored as translation keys, not display text, so the
    // dictionary swap doesn't clear them.
    expect(screen.getByRole('button', { name: 'Web-App' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Groß' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getAllByText(/€/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Nur ein Richtwert/)).toBeInTheDocument()
  })
})

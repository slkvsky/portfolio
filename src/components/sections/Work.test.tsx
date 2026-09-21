import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Work } from './Work'
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'

/** Triggers a language switch from inside the provider without going through
 * the header toggle, which this section doesn't render on its own. */
function SwitchToDe() {
  const { setLang } = useLanguage()
  return <button onClick={() => setLang('de')}>switch-to-de</button>
}

describe('Work', () => {
  it('keeps the open accordion row open across a language switch', () => {
    render(
      <LanguageProvider>
        <SwitchToDe />
        <Work />
      </LanguageProvider>
    )

    // Row 0 (car detailing) is open by default.
    expect(
      screen.getByText(/Site for a mobile car detailing studio in Wuppertal/)
    ).toBeInTheDocument()

    // Open row 2 (the planner project) instead, closing row 0.
    fireEvent.click(screen.getByText('Planner product site'))
    expect(screen.getByText(/Landing page and checkout for Tempo/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('switch-to-de'))

    // The same row (index-based state, unaffected by the copy swap) stays
    // open, now showing the German summary — not reset back to row 0.
    expect(screen.getByText(/Landingpage und Checkout für Tempo/)).toBeInTheDocument()
    expect(screen.queryByText(/mobiles Auto-Detailing-Studio/)).not.toBeInTheDocument()
  })
})

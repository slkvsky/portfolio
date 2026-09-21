import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LanguageProvider, useLanguage } from './LanguageContext'

/** Minimal consumer — enough to exercise detection, switching, and persistence
 * without pulling in the rest of the app (which needs matchMedia/
 * IntersectionObserver mocks the test setup doesn't provide). */
function Probe() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="headline">{t('hero.headline')}</span>
      <button onClick={() => setLang('de')}>de</button>
      <button onClick={() => setLang('en')}>en</button>
    </div>
  )
}

describe('LanguageContext', () => {
  const originalLanguage = window.navigator.language

  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => {
    Object.defineProperty(window.navigator, 'language', {
      value: originalLanguage,
      configurable: true,
    })
  })

  it('defaults to English when the browser language is not German', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    )
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('defaults to German when the browser language starts with "de"', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'de-DE',
      configurable: true,
    })
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    )
    expect(screen.getByTestId('lang')).toHaveTextContent('de')
  })

  it('switches the rendered copy and persists the manual choice to localStorage', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    )
    expect(screen.getByTestId('headline')).toHaveTextContent(
      'We design and build premium web products that feel effortless.'
    )

    fireEvent.click(screen.getByText('de'))
    expect(screen.getByTestId('lang')).toHaveTextContent('de')
    expect(screen.getByTestId('headline')).toHaveTextContent(
      'Wir entwickeln Websites und Web-Apps'
    )
    expect(window.localStorage.getItem('lang')).toBe('de')
  })

  it('respects a stored manual choice over the browser language on the next mount', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'de-DE',
      configurable: true,
    })
    window.localStorage.setItem('lang', 'en')

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    )
    // Stored 'en' wins even though the browser reports German — this is
    // what makes a reload keep the language the visitor actually picked.
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('falls back to static English with a no-op setter outside a provider', () => {
    // /legal, /privacy, and 404 render Header/Footer without LanguageProvider
    // (see main.tsx vs. legal.tsx/privacy.tsx/notfound.tsx) — this is what
    // keeps them single-language without a separate code path.
    render(<Probe />)
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    fireEvent.click(screen.getByText('de'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })
})

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { en, type TranslationKey } from './en'
import { de } from './de'

export type Lang = 'de' | 'en'

const STORAGE_KEY = 'lang'
const dictionaries: Record<Lang, Record<TranslationKey, string>> = { en, de }

function isLang(value: string | null): value is Lang {
  return value === 'de' || value === 'en'
}

/** Manual choice (persisted) first, then `navigator.language`, then English. */
function detectInitialLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    // localStorage unavailable (private mode, disabled) — fall through to detection
  }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

/**
 * Default value used by any consumer rendered outside `LanguageProvider`
 * (the standalone /legal, /privacy, and 404 bundles — see main.tsx vs.
 * legal.tsx/privacy.tsx/notfound.tsx). Those pages stay single-language and
 * out of scope for the toggle, so they fall back to static English and a
 * no-op setter rather than needing their own provider.
 */
const defaultValue: LanguageContextValue = {
  lang: 'en',
  setLang: () => {},
  t: (key) => en[key],
}

const LanguageContext = createContext<LanguageContextValue>(defaultValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang())

  const value = useMemo<LanguageContextValue>(() => {
    const dict = dictionaries[lang]
    return {
      lang,
      setLang: (next) => {
        setLangState(next)
        try {
          window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
          // ignore write failures (private mode, disabled storage) — the
          // choice just won't survive a reload this session
        }
      },
      t: (key) => dict[key],
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

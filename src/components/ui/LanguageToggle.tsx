import { useLanguage, type Lang } from '@/i18n/LanguageContext'

/**
 * `DE | EN` text switch — no flag icon, no dropdown, styled as data (mono)
 * rather than as a `.btn-main` so it doesn't compete with the nav buttons.
 * Carries `data-header-icon` so the header's existing dark-region contrast
 * check (see Header.tsx) picks it up the same way it does the menu trigger.
 */
export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      data-header-icon
      className="lang-toggle data flex items-center gap-1.5 text-[0.75rem]"
      aria-label={t('common.language')}
    >
      <LangOption code="de" active={lang === 'de'} onSelect={setLang} />
      <span aria-hidden="true" className="lang-toggle__divider">
        |
      </span>
      <LangOption code="en" active={lang === 'en'} onSelect={setLang} />
    </div>
  )
}

function LangOption({
  code,
  active,
  onSelect,
}: {
  code: Lang
  active: boolean
  onSelect: (lang: Lang) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      aria-pressed={active}
      className={`lang-toggle__option ${active ? 'lang-toggle__option--active' : ''}`}
    >
      {code.toUpperCase()}
    </button>
  )
}

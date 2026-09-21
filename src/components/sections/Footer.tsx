import { footerLinks, site } from '@/data/content'
import { useLanguage } from '@/i18n/LanguageContext'

/**
 * Shared by the homepage (inside `LanguageProvider`, reactive DE/EN) and the
 * standalone /legal, /privacy, /404 bundles (no provider — `useLanguage()`
 * falls back to its static-English default, so this footer renders exactly
 * as before there, out of scope for the toggle).
 */
export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 items-center gap-6 border-t border-border pt-8 text-center sm:grid-cols-3 sm:text-left">
        {/* Left: legal */}
        <ul className="flex items-center justify-center gap-6 sm:justify-start">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="label text-[0.75rem] text-gray-dark transition-colors hover:text-accent-ink"
              >
                {t(link.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        {/* Center: email */}
        <div className="sm:text-center">
          <a
            href={`mailto:${site.email}`}
            className="label text-[0.75rem] text-black transition-colors hover:text-accent-ink"
          >
            {site.email}
          </a>
        </div>

        {/* Right: socials */}
        <ul className="flex items-center justify-center gap-6 sm:justify-end">
          <li>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="label text-[0.75rem] text-gray-dark transition-colors hover:text-accent-ink"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="label text-[0.75rem] text-gray-dark transition-colors hover:text-accent-ink"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

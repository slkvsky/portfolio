import { footerLinks, site } from '@/data/content'

export function Footer() {
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
                {link.label}
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

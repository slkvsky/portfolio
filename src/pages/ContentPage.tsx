import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { site, type ContentPageData } from '@/data/content'

/**
 * Shared shell for standalone content pages (Legal, Privacy) — hairline-ruled,
 * no cards or pills, no scroll-reveal motion. Reuses the homepage Header and
 * Footer for consistent chrome; `hrefBase="/"` turns the header's in-page
 * anchors into real navigations back to the homepage.
 */
export function ContentPage({ page }: { page: ContentPageData }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header hrefBase="/" />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
        <a
          href="/"
          className="label text-[0.75rem] text-gray-dark transition-colors hover:text-accent"
        >
          ← Back to home
        </a>

        <span className="eyebrow mt-10 block text-gray-dark">{page.eyebrow}</span>
        <h1 className="mt-3 text-h-xl">{page.title}</h1>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-body-sm text-gray-dark">
          <span className="label">Last updated</span>
          <span className="data">{page.updated}</span>
        </p>
        <p className="mt-6 max-w-[52ch] text-body-md text-gray-dark">{page.intro}</p>

        <ul className="mt-12 border-t border-border">
          {page.sections.map((section, i) => (
            <li
              key={section.heading}
              className="border-b border-border py-8 sm:grid sm:grid-cols-[4rem_1fr] sm:gap-6"
            >
              <span className="data text-[0.75rem] text-gray-dark">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="text-h-sm">{section.heading}</h2>
                <div className="mt-3 max-w-[52ch] space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-body-md text-gray-dark">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.items && (
                  <ul className="mt-3 max-w-[52ch] space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="border-t border-border pt-2 text-body-md text-gray-dark first:border-t-0 first:pt-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.heading === 'Contact' && (
                  <dl className="mt-4 max-w-[52ch] border-t border-border">
                    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                      <dt className="label text-[0.75rem] text-gray-dark">Name</dt>
                      <dd className="text-body-sm text-black">{site.name}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                      <dt className="label text-[0.75rem] text-gray-dark">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${site.email}`}
                          className="text-body-sm text-black transition-colors hover:text-accent"
                        >
                          {site.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}

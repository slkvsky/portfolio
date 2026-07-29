import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Plus } from '@/components/ui/icons'
import { EASE_ACCORDION } from '@/lib/motion'
import { getLenis } from '@/lib/useLenis'
import { site } from '@/data/content'

/**
 * `hrefBase` lets the header's in-page anchors resolve correctly from pages
 * other than the homepage (e.g. `/legal` passes `hrefBase="/"`, turning
 * `#work` into a real navigation to `/#work`). Defaults to `''` — unchanged
 * behaviour on the homepage itself, where Lenis intercepts the plain hash.
 */
export function Header({ hrefBase = '' }: { hrefBase?: string } = {}) {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const recheckContrast = useRef<() => void>(() => {})

  // Per-button contrast: each button independently checks whether a dark region
  // ([data-header-invert]) sits directly behind IT (x + y overlap), so a header
  // straddling a dark/light boundary inverts only the buttons that need it.
  // `[data-header-icon]` extends this to the mobile menu trigger, which isn't
  // a `.btn-main`. The full-screen mobile menu is itself a `[data-header-invert]`
  // target, so opening it automatically flips the CTA + trigger to their
  // light-on-dark styling — the same mechanism that already handles scrolling
  // over the dark Testimonial/FinalCTA sections.
  useEffect(() => {
    const header = ref.current
    if (!header) return
    const buttons = Array.from(
      header.querySelectorAll<HTMLElement>('.btn-main, [data-header-icon]')
    )
    if (!buttons.length) return

    const overlaps = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

    let raf = 0
    const update = () => {
      raf = 0
      const dRects = Array.from(
        document.querySelectorAll<HTMLElement>('[data-header-invert]')
      ).map((d) => d.getBoundingClientRect())
      for (const btn of buttons) {
        const r = btn.getBoundingClientRect()
        btn.toggleAttribute('data-over-dark', dRects.some((d) => overlaps(r, d)))
      }
    }
    recheckContrast.current = update
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // tab switches / the mobile menu change layout without scrolling — keep in sync
    const poll = window.setInterval(schedule, 400)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.clearInterval(poll)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  // Recheck contrast the instant the menu opens/closes, rather than waiting
  // for the next scroll/poll tick.
  useEffect(() => {
    recheckContrast.current()
  }, [open])

  // Lock background scroll while the full-screen menu is open. `overflow:
  // hidden` alone isn't enough — Lenis drives scroll from its own wheel/touch
  // listeners, independent of the CSS property, so it has to be stopped too
  // (a no-op via optional chaining on pages that don't run Lenis at all).
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const lenis = getLenis()
    lenis?.stop()
    return () => {
      document.body.style.overflow = prev
      lenis?.start()
    }
  }, [open])

  // Close on Escape, and if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 640px)')
    function onChange() {
      if (mq.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  const navLinks = [
    { label: 'Work', href: `${hrefBase}#work` },
    { label: 'Pricing', href: `${hrefBase}#pricing` },
  ]

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50">
      {/* z-50 so the CTA + trigger stay above the full-screen overlay below —
          both are children of this already-stacking-context header, so their
          z-index only needs to beat the overlay's z-40, not the page's z-50. */}
      <div className="relative z-50 mx-auto flex max-w-content items-center justify-end px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-2 sm:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Button key={link.href} as="a" href={link.href} variant="secondary">
                {link.label}
              </Button>
            ))}
          </nav>
          <Button as="a" href={`${hrefBase}#contact`} variant="primary">
            Start a conversation
          </Button>

          <button
            type="button"
            data-header-icon
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="header-icon-btn grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-black transition-colors sm:hidden"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.4, ease: EASE_ACCORDION }}
              className="grid place-items-center"
            >
              <Plus className="h-4 w-4" />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Full-screen dark takeover — reuses the site's own dark-band language
          (Testimonial/FinalCTA/Work feature card) rather than inventing a new
          surface. Big serif nav type with mono indices, matching the Work
          index and Process timeline. A single delegated click handler closes
          the menu when any link inside is followed. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            data-header-invert
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_ACCORDION }}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) setOpen(false)
            }}
            className="fixed inset-0 z-40 flex flex-col bg-black text-white sm:hidden"
          >
            <nav aria-label="Primary" className="flex flex-1 flex-col justify-center px-4">
              <ul className="border-t border-white/15">
                {navLinks.map((link, i) => (
                  <li key={link.href} className="border-b border-white/15">
                    <a href={link.href} className="flex items-baseline gap-4 py-7">
                      <span className="data text-[0.75rem] text-white/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-h-lg">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center justify-between gap-4 border-t border-white/15 px-4 py-6">
              <a
                href={`mailto:${site.email}`}
                className="label text-[0.8125rem] text-white/60 transition-colors hover:text-white"
              >
                {site.email}
              </a>
              <a
                href={`${hrefBase}#contact`}
                className="label text-[0.8125rem] text-white transition-colors hover:text-white/60"
              >
                Start a conversation →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

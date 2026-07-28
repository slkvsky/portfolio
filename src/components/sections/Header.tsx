import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * `hrefBase` lets the header's in-page anchors resolve correctly from pages
 * other than the homepage (e.g. `/legal.html` passes `hrefBase="/"`, turning
 * `#work` into a real navigation to `/#work`). Defaults to `''` — unchanged
 * behaviour on the homepage itself, where Lenis intercepts the plain hash.
 */
export function Header({ hrefBase = '' }: { hrefBase?: string } = {}) {
  const ref = useRef<HTMLElement>(null)

  // Per-button contrast: each button independently checks whether a dark region
  // ([data-header-invert]) sits directly behind IT (x + y overlap), so a header
  // straddling a dark/light boundary inverts only the buttons that need it.
  useEffect(() => {
    const header = ref.current
    if (!header) return
    const buttons = Array.from(header.querySelectorAll<HTMLElement>('.btn-main'))
    if (!buttons.length) return

    const overlaps = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

    let raf = 0
    const update = () => {
      raf = 0
      // queried fresh each pass so dark blocks that mount/unmount (e.g. the
      // Pricing tab panels) are always accounted for
      const dRects = Array.from(
        document.querySelectorAll<HTMLElement>('[data-header-invert]')
      ).map((d) => d.getBoundingClientRect())
      for (const btn of buttons) {
        const r = btn.getBoundingClientRect()
        btn.toggleAttribute('data-over-dark', dRects.some((d) => overlaps(r, d)))
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // tab switches change layout without scrolling — keep it in sync
    const poll = window.setInterval(schedule, 400)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.clearInterval(poll)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-content items-center justify-end px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-2 sm:flex" aria-label="Primary">
            <Button as="a" href={`${hrefBase}#work`} variant="secondary">
              Work
            </Button>
            <Button as="a" href={`${hrefBase}#pricing`} variant="secondary">
              Pricing
            </Button>
          </nav>
          <Button as="a" href={`${hrefBase}#contact`} variant="primary">
            Start a conversation
          </Button>
        </div>
      </div>
    </header>
  )
}

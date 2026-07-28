import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth-scroll via Lenis. Respects prefers-reduced-motion (skips entirely).
 * Also wires anchor clicks (#pricing etc.) through Lenis for eased jumps.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Arriving with a hash already in the URL (e.g. following a header link
    // from /legal.html to /#work) is a native browser jump that Lenis never
    // sees, so it lands under the fixed header. Correct it once on mount.
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) lenis.scrollTo(el as HTMLElement, { offset: -80, immediate: true })
    }

    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -80 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
}

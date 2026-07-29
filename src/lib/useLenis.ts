import { useEffect } from 'react'
import Lenis from 'lenis'

// Module-scope handle so components outside the App root (e.g. the mobile
// menu overlay in Header.tsx) can pause/resume Lenis without prop drilling or
// a context provider. `null` on pages that don't call useLenis() (the content
// pages) or under reduced-motion — callers must optional-chain.
let activeLenis: Lenis | null = null
export function getLenis(): Lenis | null {
  return activeLenis
}

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
    activeLenis = lenis

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
      activeLenis = null
    }
  }, [])
}

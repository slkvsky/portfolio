import { useEffect, useRef, useState } from 'react'
import { initFluid, type FluidHandle } from '@/lib/fluid'

/**
 * Interactive WebGL fluid background. Renders a transparent canvas whose dye
 * composites over the page. Gated for accessibility & performance:
 *  - skipped entirely under prefers-reduced-motion (CSS aura fallback shows)
 *  - lower sim/dye resolution on small screens
 *  - paused when scrolled out of view or the tab is hidden
 */
export function FluidBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<FluidHandle | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // static dot-grid fallback shows

    const small = window.matchMedia('(max-width: 768px)').matches
    // the hero section holds the [data-fluid-text] elements to render into the sim
    const maskRoot = canvas.closest('section') as HTMLElement | null
    const handle = initFluid(
      canvas,
      {
        SIM_RESOLUTION: small ? 96 : 128,
        DYE_RESOLUTION: small ? 192 : 256,
      },
      maskRoot
    )
    if (!handle) return // no WebGL → static dot-grid fallback shows
    handleRef.current = handle
    setActive(true)

    // hide the DOM ink of masked text — the canvas renders it now
    const masked = maskRoot
      ? Array.from(maskRoot.querySelectorAll<HTMLElement>('[data-fluid-text]'))
      : []
    masked.forEach((el) => el.classList.add('is-fluid-masked'))

    // realign the mask once layout/fonts have fully settled
    const rebuildTimer = window.setTimeout(() => handle.rebuildMask(), 500)

    // Pause when the hero leaves the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting
        if (visible) handle.resume()
        else handle.pause()
      },
      { threshold: 0.05 }
    )
    io.observe(canvas)

    // Pause on tab hide.
    const onVisibility = () => {
      if (document.hidden) handle.pause()
      else handle.resume()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onResize = () => handle.resize()
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(rebuildTimer)
      masked.forEach((el) => el.classList.remove('is-fluid-masked'))
      handle.destroy()
      handleRef.current = null
      setActive(false)
    }
  }, [])

  return (
    <>
      {/* Static dot-grid fallback (reduced-motion / no WebGL) */}
      {!active && <div className={`${className ?? ''} dot-grid`} aria-hidden="true" />}
      <canvas
        ref={canvasRef}
        className={className}
        aria-hidden="true"
        // never intercept clicks/scroll — listeners are on window
        style={{ pointerEvents: 'none' }}
      />
    </>
  )
}

import type { Variants } from 'framer-motion'

export const EASE_SIGNATURE = [0.23, 1, 0.32, 1] as const
export const EASE_ACCORDION = [0.86, 0, 0.07, 1] as const

/** Fade + rise, used on section reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_SIGNATURE },
  },
}

/** Container that staggers its direct children ~0.08s. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/** Shared viewport config for scroll reveals. */
export const revealViewport = { once: true, margin: '-10% 0px -10% 0px' } as const

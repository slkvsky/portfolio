import { useRef, type CSSProperties } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { heroSpecs } from '@/data/content'
import { useLanguage } from '@/i18n/LanguageContext'
import { EASE_SIGNATURE, fadeUp, staggerContainer } from '@/lib/motion'
import { Button } from '@/components/ui/Button'
import { FluidBackground } from '@/components/ui/FluidBackground'

// The H1 is rasterised into the fluid canvas via a text mask, so it must not
// translate (a moving rect would misalign the mask). Fade opacity only — the
// rect stays put, and the fade still applies in the no-WebGL fallback.
const h1FadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE_SIGNATURE } },
}

// Swap while trying accent-color candidates — scoped to the hero (fluid dye +
// aura glow) only, the rest of the site keeps --color-accent until one wins.
const HERO_ACCENT = '#00b2ca'

/**
 * Asymmetric editorial hero: the headline hangs flush-left in the upper zone,
 * the subhead and action sit low-right, and a full-bleed spec strip rules the
 * bottom edge. The fluid canvas stays behind the whole thing, unchanged.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { t, lang } = useLanguage()

  // As the hero scrolls away the background recedes rather than hard-cutting.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2], { clamp: true })

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Static CSS aura is the base layer and the reduced-motion / no-WebGL
          fallback; the fluid canvas composites its dye on top. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          ...(reduced ? undefined : { opacity: bgOpacity }),
          '--hero-accent': HERO_ACCENT,
        } as CSSProperties}
      >
        <div className="hero-aura" aria-hidden="true" />
        {/* Keyed by lang so the fluid engine remounts on toggle — its text
            mask is rasterised from the DOM once at mount (see fluid.ts'
            buildMask) and wouldn't otherwise re-measure the new headline. */}
        <FluidBackground
          key={lang}
          className="absolute inset-0 z-[1] h-full w-full"
          accentColor={HERO_ACCENT}
        />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-content flex-1 flex-col justify-center px-4 pt-32 pb-16 sm:px-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Upper zone — headline flush left, ragged right */}
        <motion.h1
          variants={h1FadeIn}
          className="h1-hero lg:max-w-[13ch]"
          data-fluid-text
        >
          {t('hero.headline')}
        </motion.h1>

        {/* Lower zone — subhead + action, offset right against the headline */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-col gap-6 sm:mt-16 lg:mt-24 lg:ml-auto lg:max-w-[38ch] lg:items-start"
        >
          <p className="max-w-[36ch] text-body-lg text-gray-dark">{t('hero.subhead')}</p>
          <Button as="a" href="#contact" variant="primary">
            {t('common.startConversation')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom edge — full-bleed spec strip, cells divided by hairlines */}
      <motion.dl
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid w-full grid-cols-2 border-t border-border sm:grid-cols-4"
      >
        {heroSpecs.map((spec) => (
          <div
            key={spec.labelKey}
            className="border-b border-border px-4 py-5 sm:border-b-0 sm:border-l sm:px-6 sm:py-6 sm:first:border-l-0"
          >
            <dt className="label text-[0.6875rem] text-gray-dark">{t(spec.labelKey)}</dt>
            <dd className="data mt-1.5 text-body-sm text-black">{t(spec.valueKey)}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  )
}

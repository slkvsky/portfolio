import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { UspPattern } from '@/components/ui/Shapes'
import { usps, uspSection, type Usp } from '@/data/content'

export function USP() {
  const gridRef = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()
  // Anchor the scrub to the grid, not the section — so the flip plays out
  // while the cards actually travel up through the viewport (the header sits
  // above and would otherwise eat most of the animation off-screen).
  // Starts when the grid top enters from the bottom, finishes as it reaches
  // the upper third — each card's flip is scrubbed off this, not one-shot.
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start 95%', 'start 40%'],
  })

  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <ParallaxHeader reduced={!!reduced} />

      <ul
        ref={gridRef}
        className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
      >
        {usps.map((usp, i) => (
          <UspCard
            key={usp.title}
            usp={usp}
            index={i}
            scrollYProgress={scrollYProgress}
            reduced={!!reduced}
          />
        ))}
      </ul>
    </section>
  )
}

/**
 * Header that drifts down into place with layered parallax as it scrolls up
 * from the hero — each line travels a different distance so they spread apart
 * near the hero and converge as the block settles, reading as depth/descent.
 */
function ParallaxHeader({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 30%'],
  })

  // Lines start lifted toward the hero (negative y) and settle down to 0.
  // Higher lines travel further, so the block fans out toward the hero and
  // converges as it settles — the parallax depth, and no line collides with
  // the one below it on the way down.
  const eyebrowY = useTransform(scrollYProgress, [0, 0.65], [-160, 0], { clamp: true })
  const titleY = useTransform(scrollYProgress, [0, 0.8], [-90, 0], { clamp: true })
  const textY = useTransform(scrollYProgress, [0.12, 0.95], [-36, 0], { clamp: true })
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1], { clamp: true })
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.7], [0, 1], { clamp: true })

  if (reduced) {
    return (
      <div className="max-w-[42ch]">
        <span className="eyebrow text-gray-dark">{uspSection.eyebrow}</span>
        <h2 className="mt-4 text-h-2xl font-semibold">{uspSection.title}</h2>
        <p className="mt-4 text-body-lg text-gray-dark">{uspSection.text}</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="max-w-[42ch]">
      <motion.span
        style={{ y: eyebrowY, opacity }}
        className="eyebrow block text-gray-dark"
      >
        {uspSection.eyebrow}
      </motion.span>
      <motion.h2
        style={{ y: titleY, opacity: titleOpacity }}
        className="mt-4 text-h-2xl font-semibold"
      >
        {uspSection.title}
      </motion.h2>
      <motion.p
        style={{ y: textY, opacity }}
        className="mt-4 text-body-lg text-gray-dark"
      >
        {uspSection.text}
      </motion.p>
    </div>
  )
}

function UspCard({
  usp,
  index,
  scrollYProgress,
  reduced,
}: {
  usp: Usp
  index: number
  scrollYProgress: MotionValue<number>
  reduced: boolean
}) {
  // Each card's window starts a little later than the last, so they flip
  // up in sequence as the section scrolls through rather than together.
  const start = index * 0.1
  const end = start + 0.62
  const rotateX = useTransform(scrollYProgress, [start, end], [80, 0], { clamp: true })
  const y = useTransform(scrollYProgress, [start, end], [90, 0], { clamp: true })
  const z = useTransform(scrollYProgress, [start, end], [-240, 0], { clamp: true })

  // Reduced motion: no scroll-scrubbed flip — cards sit flat and static.
  const style = reduced
    ? undefined
    : {
        rotateX,
        y,
        z,
        transformPerspective: 1200,
        transformOrigin: 'bottom center',
      }

  return (
    <motion.li
      style={style}
      className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-card-mobile border border-border bg-bg p-6 sm:min-h-[320px] sm:rounded-card sm:p-7"
    >
      <UspPattern
        shape={usp.shape}
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-signature group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-bg from-15% via-bg/75 via-55% to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <h3 className="text-h-sm">{usp.title}</h3>
        <p className="mt-3 text-body-md text-gray-dark">{usp.text}</p>
      </div>
    </motion.li>
  )
}

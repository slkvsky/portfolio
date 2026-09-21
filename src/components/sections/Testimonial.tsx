import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { testimonial } from '@/data/content'

const words = testimonial.quote.split(' ')

/**
 * One word of the quote, lighting up (blur + opacity) over its own slice of
 * the pin's scroll progress — words near the start of the quote finish
 * resolving before words near the end even begin.
 */
function Word({
  word,
  index,
  progress,
}: {
  word: string
  index: number
  progress: MotionValue<number>
}) {
  // Words resolve across the middle 75% of the pin, leaving room at the
  // start for the block's own fade-in and at the end for the attribution row.
  const start = 0.1 + (index / words.length) * 0.75
  const end = start + 0.75 / words.length
  const local = useTransform(progress, [start, end], [0, 1])
  const opacity = useTransform(local, [0, 1], [0.25, 1])
  const filter = useTransform(local, (v) => `blur(${(1 - v) * 4}px)`)

  return (
    <motion.span style={{ opacity, filter }} className="inline-block">
      {word}
      {' '}
    </motion.span>
  )
}

/**
 * Full-bleed dark band — edge to edge, no rounded corners, no card. The
 * attribution reads as a data row rather than a caption.
 *
 * The outer section is taller than the viewport so the inner band can pin
 * (`sticky`) while the page scrolls through it, then get covered by USP's
 * light background sliding up over it — `data-header-invert` moves to the
 * sticky element itself so the header's contrast check tracks what's
 * actually pinned on screen, not the tall scroll track around it.
 *
 * `['start start', 'end end']` on the outer (tall) section maps
 * scrollYProgress 0→1 exactly onto the pin's lifetime — 0 the instant the
 * band locks in place, 1 the instant it's about to be covered — so the word
 * reveal and the attribution fade are scrubbed by the pin itself, not by a
 * generic viewport crossing.
 */
export function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const attributionOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1])

  return (
    <section ref={sectionRef} className="relative h-[140svh] sm:h-[160svh]">
      <div
        data-header-invert
        className="sticky top-0 flex h-[100svh] items-center bg-black text-white"
      >
        <Reveal className="mx-auto max-w-content px-4 sm:px-6">
          {reduced ? (
            <blockquote className="max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.15] tracking-[-0.015em]">
              {testimonial.quote}
            </blockquote>
          ) : (
            <blockquote className="max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.15] tracking-[-0.015em]">
              {words.map((word, index) => (
                <Word
                  key={index}
                  word={word}
                  index={index}
                  progress={scrollYProgress}
                />
              ))}
            </blockquote>
          )}

          <motion.div
            style={reduced ? undefined : { opacity: attributionOpacity }}
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/15 pt-5"
          >
            <span className="label text-[0.8125rem] text-white">
              {testimonial.author}
            </span>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span className="label text-[0.8125rem] text-white/55">
              {testimonial.role}
            </span>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

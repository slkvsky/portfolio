import { motion, useReducedMotion } from 'framer-motion'
import { process } from '@/data/content'
import { EASE_SIGNATURE, revealViewport } from '@/lib/motion'

/**
 * "How this goes" — three numbered phases strung along a horizontal hairline
 * spine. The rule draws in first, then each phase rises after it, so the
 * section reads as a timeline being laid down rather than content appearing.
 */
export function Process() {
  const reduced = useReducedMotion()

  return (
    <section
      id="process"
      className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28"
    >
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: EASE_SIGNATURE }}
        className="max-w-[42ch]"
      >
        <span className="eyebrow text-gray-dark">{process.eyebrow}</span>
        <h2 className="mt-4 text-h-xl">{process.title}</h2>
      </motion.div>

      {/* The spine: a hairline that draws left→right, with the phases hung off it */}
      <div className="mt-14 sm:mt-20">
        <motion.div
          aria-hidden="true"
          className="h-px origin-left bg-border"
          initial={reduced ? undefined : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.9, ease: EASE_SIGNATURE }}
        />

        <ol className="grid grid-cols-1 sm:grid-cols-3">
          {process.phases.map((phase, i) => (
            <motion.li
              key={phase.n}
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{
                duration: 0.7,
                ease: EASE_SIGNATURE,
                // after the spine has drawn past this phase's position
                delay: reduced ? 0 : 0.25 + i * 0.12,
              }}
              className="relative border-b border-border py-8 sm:border-b-0 sm:border-l sm:py-10 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
            >
              {/* tick where the phase meets the spine */}
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 hidden h-3 w-px bg-black sm:block"
              />
              <div className="flex items-baseline gap-3">
                <span className="data text-[0.8125rem] text-gray-dark">
                  {phase.n}
                </span>
                <h3 className="text-h-sm">{phase.title}</h3>
                <span className="ml-auto data text-[0.8125rem] text-gray-dark sm:ml-0">
                  {phase.duration}
                </span>
              </div>
              <p className="mt-4 max-w-[38ch] text-body-md text-gray-dark">
                {phase.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

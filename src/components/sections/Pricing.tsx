import { useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { pricing } from '@/data/content'
import { EASE_SIGNATURE } from '@/lib/motion'

type Mode = 'single' | 'recurring'

const swap = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: EASE_SIGNATURE },
}

export function Pricing() {
  const [mode, setMode] = useState<Mode>('single')
  // Choices live here so the giant hero figure (left) and the step controls
  // (right) stay in sync — the number-forward layout splits them apart.
  const [choices, setChoices] = useState<(string | null)[]>(
    pricing.form.steps.map(() => null)
  )
  const [low, high] = estimate(choices)
  const allAnswered = choices.every((c) => c !== null)
  const picked = choices.filter((c): c is string => c !== null)

  return (
    <section
      id="pricing"
      className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* Header row */}
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h-xl font-semibold">{pricing.heading}</h2>
          <p className="mt-3 max-w-[36ch] text-body-md text-gray-dark">
            {pricing.paragraphs[0]}
          </p>
        </div>
        <ModeToggle mode={mode} setMode={setMode} />
      </Reveal>

      {/* Number-forward split: giant estimate (sticky) | compact controls */}
      <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait">
            {mode === 'single' ? (
              <motion.div key="s-hero" {...swap}>
                <EstimateHero
                  low={low}
                  high={high}
                  allAnswered={allAnswered}
                  picked={picked}
                />
              </motion.div>
            ) : (
              <motion.div key="r-hero" {...swap}>
                <RecurringHero />
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        <div>
          <AnimatePresence mode="wait">
            {mode === 'single' ? (
              <motion.div key="s-ctrl" {...swap}>
                <Steps
                  choices={choices}
                  setChoices={setChoices}
                  allAnswered={allAnswered}
                />
              </motion.div>
            ) : (
              <motion.div key="r-ctrl" {...swap}>
                <RecurringPlans />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: Mode
  setMode: (m: Mode) => void
}) {
  const options: { key: Mode; label: string }[] = [
    { key: 'single', label: 'Single project' },
    { key: 'recurring', label: 'Recurring' },
  ]
  return (
    <div
      className="inline-flex w-fit items-center rounded-pill border border-border bg-white p-1"
      role="group"
      aria-label="Pricing mode"
    >
      {options.map((o) => {
        const active = o.key === mode
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setMode(o.key)}
            aria-pressed={active}
            className="relative z-10 rounded-pill px-4 py-2 label text-[0.8125rem] transition-colors"
            style={{ color: active ? '#fff' : 'var(--color-gray-dark)' }}
          >
            {active && (
              <motion.span
                layoutId="pricing-pill"
                className="absolute inset-0 -z-10 rounded-pill bg-black"
                transition={{ duration: 0.45, ease: EASE_SIGNATURE }}
              />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Cost model (values in $k). Each of the four steps maps its option to a
 * factor; the running estimate is the min/max combination across the still-
 * unanswered dimensions, so the range *narrows* as choices are made and
 * collapses to a single fixed quote once every step is answered.
 */
const COST: Record<number, Record<string, number>> = {
  0: { Website: 1.5, 'Web app': 2.6, 'Mobile app': 2.8, 'Bots & automation': 1.2 }, // base
  1: { Small: 0.75, Medium: 1, Large: 1.4 }, // size multiplier
  2: { Refine: 0, Balanced: 0.6, Expressive: 1.2 }, // creativity add-on
  3: { Rush: 1.2, Standard: 1, Flexible: 0.9 }, // timeline multiplier
}

function span(stepIndex: number, choice: string | null): [number, number] {
  const map = COST[stepIndex]
  if (choice != null) return [map[choice], map[choice]]
  const vals = Object.values(map)
  return [Math.min(...vals), Math.max(...vals)]
}

function estimate(choices: (string | null)[]): [number, number] {
  const [tLo, tHi] = span(0, choices[0])
  const [sLo, sHi] = span(1, choices[1])
  const [cLo, cHi] = span(2, choices[2])
  const [mLo, mHi] = span(3, choices[3])
  return [(tLo * sLo + cLo) * mLo, (tHi * sHi + cHi) * mHi]
}

function fmtK(k: number) {
  const v = k < 10 ? Math.round(k * 10) / 10 : Math.round(k)
  return `$${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}k`
}

/** Spring-animated $k figure that counts to its target on change. */
function Money({ k }: { k: number }) {
  const reduced = useReducedMotion()
  const spring = useSpring(k, { stiffness: 130, damping: 20, mass: 0.6 })
  const [shown, setShown] = useState(k)
  useEffect(() => {
    // Reduced motion: jump straight to the value, no count-up.
    if (reduced) spring.jump(k)
    else spring.set(k)
  }, [k, spring, reduced])
  useMotionValueEvent(spring, 'change', (v) => setShown(v))
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {fmtK(reduced ? k : shown)}
    </span>
  )
}

/** Left column: the giant, live estimate figure — the hero of the section. */
function EstimateHero({
  low,
  high,
  allAnswered,
  picked,
}: {
  low: number
  high: number
  allAnswered: boolean
  picked: string[]
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {!allAnswered && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="label text-[0.75rem] text-gray-dark">
          {allAnswered ? 'Your fixed quote' : 'Live estimate'}
        </span>
      </div>

      <div
        aria-live="polite"
        className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display font-semibold leading-[0.95] tracking-[-0.02em] text-[clamp(3.25rem,7.5vw,6.5rem)]"
      >
        <Money k={low} />
        {!allAnswered && (
          <span className="flex items-baseline gap-x-4 text-accent">
            <span aria-hidden="true">–</span>
            <span className="text-black">
              <Money k={high} />
            </span>
          </span>
        )}
      </div>

      <p className="mt-6 max-w-[28ch] text-body-md text-gray-dark">
        {allAnswered
          ? 'Fixed-scope quote based on your selections — no surprises at handoff.'
          : 'A ballpark that tightens with every answer on the right.'}
      </p>

      {picked.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {picked.map((c) => (
            <span
              key={c}
              className="label rounded-pill border border-border px-2.5 py-1 text-[0.6875rem] text-gray-dark"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Left column when in recurring mode — a bold statement in place of a figure. */
function RecurringHero() {
  return (
    <div>
      <span className="label text-[0.75rem] text-gray-dark">
        Monthly partnership
      </span>
      <p className="mt-5 font-display font-semibold leading-[0.98] tracking-[-0.02em] text-[clamp(3rem,6.5vw,5.5rem)]">
        Let’s talk.
      </p>
      <p className="mt-6 max-w-[28ch] text-body-md text-gray-dark">
        Two ways to work together every week — no lock-in, pause anytime.
      </p>
    </div>
  )
}

/** Right column: the compact step controls, as hairline-divided rows. */
function Steps({
  choices,
  setChoices,
  allAnswered,
}: {
  choices: (string | null)[]
  setChoices: React.Dispatch<React.SetStateAction<(string | null)[]>>
  allAnswered: boolean
}) {
  function select(stepIndex: number, option: string) {
    setChoices((prev) => {
      const next = [...prev]
      next[stepIndex] = option
      return next
    })
  }

  const isActive = (i: number) => i === 0 || choices[i - 1] !== null

  return (
    <div>
      <div className="border-t border-border">
        {pricing.form.steps.map((step, i) => {
          const active = isActive(i)
          return (
            <div
              key={step.label}
              className="border-b border-border py-6 transition-opacity duration-500 ease-signature"
              style={{ opacity: active ? 1 : 0.3 }}
              aria-disabled={!active}
            >
              <div className="flex items-center gap-2.5">
                <span className="data text-[0.75rem] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="label text-[0.8125rem]">{step.label}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.options.map((opt) => {
                  const selected = choices[i] === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={!active}
                      onClick={() => select(i, opt)}
                      aria-pressed={selected}
                      className="rounded-pill border px-4 py-2 text-body-sm transition-colors duration-300 ease-signature disabled:cursor-not-allowed"
                      style={{
                        borderColor: selected
                          ? 'var(--color-black)'
                          : 'var(--color-border)',
                        background: selected ? 'var(--color-black)' : 'transparent',
                        color: selected ? '#fff' : 'var(--color-black)',
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-6">
        <Button as="a" href="#contact" variant="primary">
          {allAnswered ? 'Start this project' : 'Start a conversation'}
        </Button>
      </div>
    </div>
  )
}

function RecurringPlans() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {pricing.plans.map((plan) => (
        <article
          key={plan.name}
          data-header-invert={plan.featured || undefined}
          className="flex flex-col rounded-card border p-7"
          style={{
            background: plan.featured ? 'var(--color-black)' : 'var(--color-white)',
            color: plan.featured ? '#fff' : 'var(--color-black)',
            borderColor: plan.featured
              ? 'var(--color-black)'
              : 'var(--color-border)',
          }}
        >
          <span
            className="label text-[0.8125rem]"
            style={{ color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--color-gray-dark)' }}
          >
            {plan.name}
          </span>

          <div className="mt-4 flex items-baseline gap-1">
            <span
              className={`font-semibold tracking-tight ${
                plan.price.startsWith('$') ? 'text-h-2xl' : 'text-h-md'
              }`}
            >
              {plan.price}
            </span>
            {plan.cadence && (
              <span
                className="label text-body-md"
                style={{ color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--color-gray-dark)' }}
              >
                {plan.cadence}
              </span>
            )}
          </div>

          <ul className="mt-6 flex-1">
            {plan.features.map((f) => (
              <li
                key={f}
                className="border-t py-3 text-body-sm last:border-b"
                style={{
                  borderColor: plan.featured
                    ? 'rgba(255,255,255,0.15)'
                    : 'var(--color-border)',
                  color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--color-black)',
                }}
              >
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Button
              as="a"
              href="#contact"
              variant={plan.featured ? 'on-dark' : 'primary'}
              className="w-full"
            >
              {plan.cta}
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}

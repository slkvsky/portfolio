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
import { pricingSteps, pricingPlans, type PricingPlan } from '@/data/content'
import { useLanguage, type Lang } from '@/i18n/LanguageContext'
import type { TranslationKey } from '@/i18n/en'
import { EASE_SIGNATURE } from '@/lib/motion'

type Mode = 'single' | 'recurring'

const swap = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: EASE_SIGNATURE },
}

export function Pricing() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<Mode>('single')
  // Choices live here so the giant hero figure (left) and the step controls
  // (right) stay in sync — the number-forward layout splits them apart.
  // Stored as translation keys (stable across a language switch) rather than
  // display labels, so toggling DE/EN never resets an in-progress selection.
  const [choices, setChoices] = useState<(TranslationKey | null)[]>(
    pricingSteps.map(() => null)
  )
  const [low, high] = estimate(choices)
  const allAnswered = choices.every((c) => c !== null)
  const picked = choices.filter((c): c is TranslationKey => c !== null)

  return (
    <section
      id="pricing"
      className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* Header row */}
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h-xl font-semibold">{t('pricing.heading')}</h2>
          <p className="mt-3 max-w-[36ch] text-body-md text-gray-dark">
            {t('pricing.paragraph1')}
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
          <p className="mt-8 text-[0.6875rem] text-gray-dark">{t('pricing.ballparkNote')}</p>
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
  const { t } = useLanguage()
  const options: { key: Mode; labelKey: TranslationKey }[] = [
    { key: 'single', labelKey: 'pricing.modeSingle' },
    { key: 'recurring', labelKey: 'pricing.modeRecurring' },
  ]
  return (
    <div
      className="inline-flex w-fit items-center rounded-pill border border-border bg-white p-1"
      role="group"
      aria-label={t('pricing.modeAria')}
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
            {t(o.labelKey)}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Cost model (values in €k). Each of the four steps maps its option to a
 * factor; the running estimate is the min/max combination across the still-
 * unanswered dimensions, so the range *narrows* as choices are made and
 * collapses to a single fixed quote once every step is answered. Keyed by
 * translation key rather than display label, so the model doesn't care which
 * language is showing.
 */
const COST: Record<number, Record<string, number>> = {
  0: {
    'pricing.option.website': 1.4,
    'pricing.option.webApp': 5.5,
    'pricing.option.mobileApp': 6,
    'pricing.option.botsAutomation': 2.5,
  }, // base
  1: { 'pricing.option.small': 0.75, 'pricing.option.medium': 1, 'pricing.option.large': 1.5 }, // size multiplier
  2: {
    'pricing.option.designHave': 0,
    'pricing.option.designSome': 0.9,
    'pricing.option.designFull': 1.8,
  }, // design add-on
  3: { 'pricing.option.rush': 1.3, 'pricing.option.standard': 1, 'pricing.option.flexible': 0.9 }, // timeline multiplier
}

function span(stepIndex: number, choice: TranslationKey | null): [number, number] {
  const map = COST[stepIndex]
  if (choice != null) return [map[choice], map[choice]]
  const vals = Object.values(map)
  return [Math.min(...vals), Math.max(...vals)]
}

function estimate(choices: (TranslationKey | null)[]): [number, number] {
  const [tLo, tHi] = span(0, choices[0])
  const [sLo, sHi] = span(1, choices[1])
  const [cLo, cHi] = span(2, choices[2])
  const [mLo, mHi] = span(3, choices[3])
  return [(tLo * sLo + cLo) * mLo, (tHi * sHi + cHi) * mHi]
}

/**
 * EN keeps the "$0.9k"-style shorthand (with € swapped in); DE expands to
 * the full euro amount with a period thousands separator, e.g. "14.000 €" —
 * a German audience reads that as a real price, not an abbreviation.
 */
function fmtMoney(k: number, lang: Lang): string {
  const v = k < 10 ? Math.round(k * 10) / 10 : Math.round(k)
  if (lang === 'de') {
    const amount = Math.round(v * 1000)
    return `${new Intl.NumberFormat('de-DE').format(amount)} €`
  }
  return `€${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}k`
}

/** Spring-animated €k figure that counts to its target on change. */
function Money({ k }: { k: number }) {
  const { lang } = useLanguage()
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
      {fmtMoney(reduced ? k : shown, lang)}
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
  picked: TranslationKey[]
}) {
  const { t } = useLanguage()
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
          {allAnswered ? t('pricing.fixedQuoteLabel') : t('pricing.liveEstimate')}
        </span>
      </div>

      <div
        aria-live="polite"
        className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display font-semibold leading-[0.95] tracking-[-0.02em] text-[clamp(3.25rem,7.5vw,6.5rem)]"
      >
        <Money k={low} />
        {!allAnswered && (
          <span className="flex items-baseline gap-x-4 text-accent-ink">
            <span aria-hidden="true">–</span>
            <span className="text-black">
              <Money k={high} />
            </span>
          </span>
        )}
      </div>

      <p className="mt-6 max-w-[28ch] text-body-md text-gray-dark">
        {allAnswered ? t('pricing.fixedQuoteText') : t('pricing.tighten')}
      </p>

      {picked.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {picked.map((key) => (
            <span
              key={key}
              className="label rounded-pill border border-border px-2.5 py-1 text-[0.6875rem] text-gray-dark"
            >
              {t(key)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Left column when in recurring mode — a bold statement in place of a figure. */
function RecurringHero() {
  const { t } = useLanguage()
  return (
    <div>
      <span className="label text-[0.75rem] text-gray-dark">
        {t('pricing.monthlyPartnership')}
      </span>
      <p className="mt-5 font-display font-semibold leading-[0.98] tracking-[-0.02em] text-[clamp(3rem,6.5vw,5.5rem)]">
        {t('pricing.letsTalkStatement')}
      </p>
      <p className="mt-6 max-w-[28ch] text-body-md text-gray-dark">
        {t('pricing.recurringSubtext')}
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
  choices: (TranslationKey | null)[]
  setChoices: React.Dispatch<React.SetStateAction<(TranslationKey | null)[]>>
  allAnswered: boolean
}) {
  const { t } = useLanguage()

  function select(stepIndex: number, option: TranslationKey) {
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
        {pricingSteps.map((step, i) => {
          const active = isActive(i)
          return (
            <div
              key={step.labelKey}
              className="border-b border-border py-6 transition-opacity duration-500 ease-signature"
              style={{ opacity: active ? 1 : 0.3 }}
              aria-disabled={!active}
            >
              <div className="flex items-center gap-2.5">
                <span className="data text-[0.75rem] text-accent-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="label text-[0.8125rem]">{t(step.labelKey)}</span>
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
                      {t(opt)}
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
          {allAnswered ? t('pricing.startThisProject') : t('common.startConversation')}
        </Button>
      </div>
    </div>
  )
}

function RecurringPlans() {
  const { t } = useLanguage()
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {pricingPlans.map((plan: PricingPlan) => {
        const price = t(plan.priceKey)
        return (
          <article
            key={plan.nameKey}
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
              {t(plan.nameKey)}
            </span>

            <div className="mt-4 flex items-baseline gap-1">
              <span
                className={`font-semibold tracking-tight ${
                  price.startsWith('€') ? 'text-h-2xl' : 'text-h-md'
                }`}
              >
                {price}
              </span>
              {plan.cadenceKey && (
                <span
                  className="label text-body-md"
                  style={{ color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--color-gray-dark)' }}
                >
                  {t(plan.cadenceKey)}
                </span>
              )}
            </div>

            <ul className="mt-6 flex-1">
              {plan.featureKeys.map((fk) => (
                <li
                  key={fk}
                  className="border-t py-3 text-body-sm last:border-b"
                  style={{
                    borderColor: plan.featured
                      ? 'rgba(255,255,255,0.15)'
                      : 'var(--color-border)',
                    color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--color-black)',
                  }}
                >
                  {t(fk)}
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
                {t(plan.ctaKey)}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

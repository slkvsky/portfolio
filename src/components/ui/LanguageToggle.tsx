import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_SIGNATURE } from '@/lib/motion'

const langs = ['EN', 'DE'] as const
type Lang = (typeof langs)[number]

/** Tiny rounded segmented control with a sliding pill. */
export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>('EN')

  return (
    <div
      className="relative flex items-center rounded-pill border border-border bg-white p-0.5"
      role="group"
      aria-label="Language"
    >
      {langs.map((l) => {
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className="relative z-10 rounded-pill px-2.5 py-1 label text-[0.6875rem] transition-colors"
            style={{ color: active ? '#fff' : 'var(--color-gray-dark)' }}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-pill bg-black"
                transition={{ duration: 0.4, ease: EASE_SIGNATURE }}
              />
            )}
            {l}
          </button>
        )
      })}
    </div>
  )
}

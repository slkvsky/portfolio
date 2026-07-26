import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from '@/components/ui/icons'
import { Reveal } from '@/components/ui/Reveal'
import { faqs } from '@/data/content'
import { EASE_ACCORDION } from '@/lib/motion'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mb-10">
        <span className="eyebrow text-gray-dark">FAQ</span>
        <h2 className="mt-3 text-h-xl font-semibold">Questions, answered</h2>
      </Reveal>

      <Reveal>
        <ul className="border-t border-border">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <li key={faq.q} className="border-b border-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-h-sm font-medium">{faq.q}</span>
                    <motion.span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-black"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: EASE_ACCORDION }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_ACCORDION }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[46em] pb-6 text-body-md text-gray-dark">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}

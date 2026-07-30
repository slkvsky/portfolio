import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowUpRight } from '@/components/ui/icons'
import { work, projects, type Project } from '@/data/content'
import { EASE_ACCORDION } from '@/lib/motion'

/**
 * Selected work as an editorial index: one hairline-divided row per project,
 * expandable in place. Rows are buttons, so the detail is reachable by keyboard
 * and nothing depends on hover.
 */
export function Work() {
  // The first project is the featured case — open on arrival.
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="work" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="max-w-[42ch]">
        <span className="eyebrow text-gray-dark">{work.eyebrow}</span>
        <h2 className="mt-4 text-h-xl">{work.title}</h2>
      </Reveal>

      <ol className="mt-12 border-t border-border sm:mt-16">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.title}
            project={project}
            index={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </ol>
    </section>
  )
}

function ProjectRow({
  project,
  index,
  isOpen,
  onToggle,
}: {
  project: Project
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const reduced = useReducedMotion()
  const panelId = `project-panel-${index}`

  return (
    <li className="group border-b border-border">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-baseline gap-4 py-7 text-left sm:gap-6 sm:py-8"
        >
          <span className="data w-8 shrink-0 text-[0.75rem] text-gray-dark">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title shifts right on hover — the row reacts, nothing else moves */}
          <span className="flex-1 font-display text-h-md transition-transform duration-500 ease-signature group-hover:translate-x-3">
            {project.title}
          </span>

          <span className="hidden shrink-0 text-body-sm text-gray-dark lg:block lg:w-40">
            {project.discipline}
          </span>
          <span className="data hidden shrink-0 text-body-sm text-gray-dark lg:block lg:w-44">
            {project.stack}
          </span>
          <span className="data shrink-0 text-body-sm text-gray-dark">
            {project.year}
          </span>

          {/* Open/closed marker: a plain rotating cross, no circle chrome */}
          <motion.span
            aria-hidden="true"
            className="ml-1 shrink-0 text-gray-dark sm:ml-3"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE_ACCORDION }}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M8 3v10M3 8h10" strokeLinecap="round" />
            </svg>
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? undefined : { height: 0, opacity: 0 }}
            animate={reduced ? undefined : { height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_ACCORDION }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-6 pb-9 sm:flex-row sm:items-end sm:justify-between sm:gap-10 lg:pl-14">
              <p className="max-w-[52ch] text-body-md text-gray-dark">
                {project.summary}
              </p>

              <div className="flex shrink-0 items-center gap-5">
                <span className="data text-body-sm text-gray-dark">
                  {project.duration}
                </span>
                {project.nda ? (
                  <span className="label border border-border px-2 py-1 text-[0.6875rem] text-gray-dark">
                    NDA
                  </span>
                ) : project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="label inline-flex items-center gap-1.5 border-b border-black pb-0.5 text-[0.8125rem] transition-colors hover:border-accent-ink hover:text-accent-ink"
                  >
                    Visit
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

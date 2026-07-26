import { Reveal } from '@/components/ui/Reveal'
import { testimonial } from '@/data/content'

/**
 * Full-bleed dark band — edge to edge, no rounded corners, no card. The
 * attribution reads as a data row rather than a caption.
 */
export function Testimonial() {
  return (
    <section data-header-invert className="bg-black text-white">
      <Reveal className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
        <blockquote className="max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.15] tracking-[-0.015em]">
          {testimonial.quote}
        </blockquote>

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/15 pt-5">
          <span className="label text-[0.8125rem] text-white">
            {testimonial.author}
          </span>
          <span aria-hidden="true" className="text-white/30">
            /
          </span>
          <span className="label text-[0.8125rem] text-white/55">
            {testimonial.role}
          </span>
        </div>
      </Reveal>
    </section>
  )
}

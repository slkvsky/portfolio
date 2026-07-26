import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { finalCta, site } from '@/data/content'

export function FinalCTA() {
  return (
    <section id="contact" data-header-invert className="px-4 pb-4 sm:px-6">
      <Reveal className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden rounded-card bg-black p-8 text-white sm:p-14">
        {/* subtle accent glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(50% 60% at 80% 15%, hsl(0 78% 62% / 0.35), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-h-3xl font-semibold">{finalCta.title}</h2>
          <div className="mt-8">
            <Button
              as="a"
              href={`mailto:${site.email}`}
              variant="on-dark"
              className="!px-7 !py-4 !text-base"
            >
              {finalCta.button}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

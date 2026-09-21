import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { FluidBackground } from '@/components/ui/FluidBackground'
import { site } from '@/data/content'
import { useLanguage } from '@/i18n/LanguageContext'

export function FinalCTA() {
  const { t } = useLanguage()
  return (
    <section id="contact" className="px-4 pb-4 sm:px-6">
      <Reveal className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden rounded-card p-8 sm:p-14">
        {/* subtle accent glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(50% 60% at 80% 15%, hsl(187 78% 62% / 0.35), transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Same fluid dye engine as the Hero — bookends the site on the same
            signature motion. No [data-fluid-text] here, so it's pure ambient
            dye, no text masking. */}
        <FluidBackground className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-h-3xl font-semibold">{t('finalCta.title')}</h2>
          <div className="mt-8">
            <Button
              as="a"
              href={`mailto:${site.email}`}
              variant="primary"
              className="!px-7 !py-4 !text-base"
            >
              {t('common.startConversation')}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

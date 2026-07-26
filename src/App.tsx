import { useLenis } from '@/lib/useLenis'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { USP } from '@/components/sections/USP'
import { Work } from '@/components/sections/Work'
import { Testimonial } from '@/components/sections/Testimonial'
import { Process } from '@/components/sections/Process'
import { Pricing } from '@/components/sections/Pricing'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'

export default function App() {
  useLenis()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      {/* Work-first arc: proof, then the people who vouch for it, then the
          claims, the process, and only then the price. */}
      <main id="main">
        <Hero />
        <Work />
        <Testimonial />
        <USP />
        <Process />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

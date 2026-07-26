import { useLenis } from '@/lib/useLenis'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Footer } from '@/components/sections/Footer'

export default function App() {
  useLenis()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
      </main>
      <Footer />
    </>
  )
}

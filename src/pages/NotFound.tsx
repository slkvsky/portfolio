import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { Button } from '@/components/ui/Button'

/**
 * Static 404 — same chrome as the content pages (Header/Footer), no motion
 * or data dependency so it renders even if something else on the site broke.
 */
export function NotFound() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header hrefBase="/" />
      <main
        id="main"
        className="mx-auto flex max-w-3xl flex-col items-start px-4 pb-24 pt-32 sm:px-6 sm:pt-40"
      >
        <span className="data text-[0.75rem] text-gray-dark">404</span>
        <h1 className="mt-3 text-h-xl">Page not found.</h1>
        <p className="mt-4 max-w-[46ch] text-body-md text-gray-dark">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Button as="a" href="/" variant="primary" className="mt-10">
          Back to home
        </Button>
      </main>
      <Footer />
    </>
  )
}

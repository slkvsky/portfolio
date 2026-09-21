import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver, and framer-motion's `whileInView`
// (used by <Reveal>, throughout the section components) calls it as soon as
// it mounts — without a stub, any test rendering one of those components
// throws `ReferenceError: IntersectionObserver is not defined` rather than
// the assertion it's actually testing.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error — a real IntersectionObserver has more surface than this
// jsdom test double needs.
window.IntersectionObserver ??= IntersectionObserverStub

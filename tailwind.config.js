/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        white: 'var(--color-white)',
        black: 'var(--color-black)',
        accent: 'var(--color-accent)',
        'gray-dark': 'var(--color-gray-dark)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Geist Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // desktop-oriented scale; hero uses clamp() in CSS
        'h-3xl': ['5.5rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'h-2xl': ['4rem', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        'h-xl': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'h-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h-sm': ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body-lg': ['1.25rem', { lineHeight: '1.5' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        // Hard-edged, document-like: the visual weight moves from filled
        // rounded slabs to hairline rules.
        card: '0.25rem',
        'card-mobile': '0.25rem',
        pill: '0.25rem',
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(0.23, 1, 0.32, 1)',
        accordion: 'cubic-bezier(0.86, 0, 0.07, 1)',
      },
      maxWidth: {
        content: '80rem',
      },
    },
  },
  plugins: [],
}

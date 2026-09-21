# Portfolio

Personal developer portfolio — single-page, built with Vite, React, TypeScript, and Tailwind.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** for layout and design tokens
- **Framer Motion** for scroll-driven reveals and transitions
- **Lenis** for smooth scrolling
- A custom **WebGL fluid simulation** (Navier–Stokes solver) driving the hero background,
  with a text mask so the headline reacts to the cursor

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build locally
npm run lint     # eslint
npm run test     # vitest
```

## Before deploying

`index.html`, `legal.html`, `privacy.html`, `public/sitemap.xml`, and `public/robots.txt` use
`https://your-domain.example` as a placeholder for canonical URLs, Open Graph tags, and JSON-LD.
Replace it with the real production domain once one is chosen.

## Structure

```
src/
  components/
    sections/   # one file per page section (Hero, Work, Pricing, ...)
    ui/          # shared primitives (Button, Reveal, icons, ...)
  data/
    content.ts   # all page copy, in one place
  lib/
    fluid.ts     # the WebGL fluid engine
    motion.ts    # shared Framer Motion variants/easings
    useLenis.ts  # smooth-scroll wiring
```

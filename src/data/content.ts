/**
 * All page copy lives here as placeholders — swap freely.
 */

export const site = {
  name: 'Oleh Salikovskyi',
  logoInitials: 'OS',
  email: 'slkvsky@gmail.com',
  socials: {
    linkedin: 'https://www.linkedin.com/in/olehsalikovskyi',
    github: 'https://github.com/slkvsky',
  },
}

export const hero = {
  headline: 'I design and build premium web products that feel effortless.',
  subhead:
    'Independent developer partnering with founders and teams to ship fast, considered interfaces.',
  cta: 'Start a conversation',
  /** Bottom-edge spec strip — keys read as labels, values as data. */
  specs: [
    { k: 'Experience', v: '5+ yrs' },
    { k: 'Projects', v: '30+' },
    { k: 'Stack', v: 'React · TS · RN' },
    { k: 'Based', v: 'Germany · CET' },
  ],
}

export const uspSection = {
  eyebrow: 'Why work with me',
  title: 'Work you can count on.',
  text: 'I step in on high-stakes projects where execution can’t fail — from product launches to full rebuilds — and see them through start to finish.',
}

export type Usp = {
  title: string
  text: string
  shape: 'nested-squares' | 'stacked-rects' | 'circles-row' | 'rotated-squares'
}

export const usps: Usp[] = [
  {
    title: 'Product thinking',
    text: 'I sweat the flows and edge cases, not just the happy path.',
    shape: 'nested-squares',
  },
  {
    title: 'Design-grade UI',
    text: 'Pixel-considered interfaces with motion that earns its keep.',
    shape: 'stacked-rects',
  },
  {
    title: 'Performance first',
    text: 'Fast by default — Core Web Vitals treated as a feature.',
    shape: 'circles-row',
  },
  {
    title: 'Reliable delivery',
    text: 'Clear scope, steady cadence, and no surprises at handoff.',
    shape: 'rotated-squares',
  },
]

export const work = {
  eyebrow: 'Selected work',
  title: 'Shipped, not mocked up.',
}

export const testimonial = {
  quote:
    'Oleh caught problems I didn’t even know to ask about. That’s the difference between a developer and someone who actually gets it.',
  author: 'Kira',
  role: 'SMM specialist, kairuxs',
}

export type Project = {
  title: string
  discipline: string
  stack: string
  year: string
  duration: string
  /** Revealed when the row is expanded. */
  summary: string
  link?: string
  nda?: boolean
}

export const projects: Project[] = [
  {
    title: 'Design system and marketing site',
    discipline: 'Design system',
    stack: 'Next.js · TS',
    year: '2025',
    duration: '6 weeks',
    summary:
      'Tokens through to shipped pages for a Series-B fintech — a component library, docs, and a rebuilt marketing site. Page loads came down 40%.',
    link: 'https://example.com',
  },
  {
    title: 'Realtime analytics dashboard',
    discipline: 'Web app',
    stack: 'React · WebSocket',
    year: '2025',
    duration: '8 weeks',
    summary:
      'A live metrics console handling thousands of events per second, with virtualised tables and charts that stay smooth under load.',
    link: 'https://example.com',
  },
  {
    title: 'E-commerce replatform',
    discipline: 'Commerce',
    stack: 'Next.js · Stripe',
    year: '2024',
    duration: '12 weeks',
    summary:
      'Migrated a legacy storefront without losing SEO or order history. Checkout conversion improved and the team can ship changes themselves now.',
    link: 'https://example.com',
  },
  {
    title: 'AI writing assistant',
    discipline: 'Product',
    stack: 'React · Streaming',
    year: '2024',
    duration: '6 weeks',
    summary:
      'A streaming editor interface with inline suggestions and revision history. Built end to end under NDA.',
    nda: true,
  },
]

export type Phase = {
  /** Two-digit index shown on the spine. */
  n: string
  title: string
  duration: string
  text: string
}

export const process = {
  eyebrow: 'How this goes',
  title: 'Three phases, no surprises.',
  phases: [
    {
      n: '01',
      title: 'Scope',
      duration: '~1 week',
      text: 'A short call, then a written breakdown: what ships, in what order, and what it costs. Fixed before anything is built.',
    },
    {
      n: '02',
      title: 'Build',
      duration: '4–8 weeks',
      text: 'Weekly cycles with a demo at the end of each. You see working software continuously, not a reveal at the finish line.',
    },
    {
      n: '03',
      title: 'Handover',
      duration: 'ongoing',
      text: 'Documented code, a walkthrough, and transferred ownership. I stay reachable for whatever comes after launch.',
    },
  ] satisfies Phase[],
}

export const pricing = {
  heading: 'Simple pricing',
  paragraphs: [
    'Two ways to work together — a fixed-scope project or an ongoing monthly partnership.',
    'No lock-in, no bloated retainers. Just clear deliverables and a steady pace.',
  ],
  form: {
    steps: [
      {
        label: 'Project type',
        options: ['Website', 'Web app', 'Mobile app', 'Bots & automation'],
      },
      { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      { label: 'Creativity', options: ['Refine', 'Balanced', 'Expressive'] },
      { label: 'Timeline', options: ['Rush', 'Standard', 'Flexible'] },
    ],
  },
  plans: [
    {
      name: 'Part-time',
      price: 'Let’s talk',
      cadence: '',
      features: [
        'Up to 20 hrs / week',
        'Async updates + weekly call',
        'One active workstream',
        'Pause anytime',
      ],
      cta: 'Choose part-time',
      featured: false,
    },
    {
      name: 'Full-time',
      price: 'Let’s talk',
      cadence: '',
      features: [
        'Up to 40 hrs / week',
        'Daily collaboration',
        'Multiple workstreams',
        'Priority turnaround',
      ],
      cta: 'Choose full-time',
      featured: true,
    },
  ],
}

export type Faq = { q: string; a: string }

export const faqs: Faq[] = [
  {
    q: 'What does a typical engagement look like?',
    a: 'We start with a short scoping call, agree on milestones, then work in weekly cycles with async updates and a demo at the end of each.',
  },
  {
    q: 'Which tech stack do you use?',
    a: 'Mostly React, Next.js, and TypeScript with Tailwind and Framer Motion. I adapt to your existing stack when it makes sense.',
  },
  {
    q: 'Can you work with our designers?',
    a: 'Absolutely. I collaborate directly in Figma and treat design handoff as a two-way conversation, not a hand-off wall.',
  },
  {
    q: 'How do you handle NDAs and IP?',
    a: 'Happy to sign your NDA. All work product and IP transfers to you on final payment.',
  },
]

export const finalCta = {
  title: 'Build your next project with me',
  button: 'Start a conversation',
}

export const footerLinks = [
  { label: 'Legal notice', href: '/legal' },
  { label: 'Privacy', href: '/privacy' },
] as const

export type ContentSection = {
  heading: string
  body: string[]
  /** Optional bullet list rendered under the paragraphs. */
  items?: string[]
}

export type ContentPageData = {
  eyebrow: string
  title: string
  /** ISO date, rendered as data (mono). */
  updated: string
  intro: string
  sections: ContentSection[]
}

export const legalNotice: ContentPageData = {
  eyebrow: 'Legal',
  title: 'Legal notice',
  updated: '2026-07-28',
  intro:
    'The basics: who runs this site, what the work shown here is and isn’t, and how to reach me.',
  sections: [
    {
      heading: 'Who runs this site',
      body: [
        'This site is run by Oleh Salikovskyi, an independent developer. Contact details are below — there’s no separate company behind it.',
      ],
    },
    {
      heading: 'Content and ownership',
      body: [
        'The design, code, and writing on this site are mine. Projects shown under "Selected work" belong to the clients they were built for and are shown with their permission; some are described in general terms or marked NDA where the details aren’t mine to share.',
      ],
    },
    {
      heading: 'External links',
      body: [
        'Links to LinkedIn, GitHub, or client sites take you off this domain. I don’t control what’s on those sites and linking to them isn’t an endorsement of everything they contain.',
      ],
    },
    {
      heading: 'No warranty',
      body: [
        'Everything here is provided as-is. I try to keep it accurate, but nothing on this site is a binding offer, a quote, or professional advice — that only happens once we’ve actually talked.',
      ],
    },
    {
      heading: 'Contact',
      body: ['The fastest way to reach me is email.'],
    },
  ],
}

export const privacyPolicy: ContentPageData = {
  eyebrow: 'Legal',
  title: 'Privacy policy',
  updated: '2026-07-28',
  intro: 'The short version: this site doesn’t collect anything about you.',
  sections: [
    {
      heading: 'Summary',
      body: [
        'This is a static portfolio site. It doesn’t have a database, doesn’t run analytics, and doesn’t ask you for anything.',
      ],
    },
    {
      heading: 'No cookies, no tracking',
      body: [
        'Nothing is set in your browser and no third-party analytics or advertising scripts run here.',
      ],
    },
    {
      heading: 'No forms, no accounts',
      body: [
        'The only way to contact me is the email link, which opens your own mail client. Nothing you write is submitted to or stored by this site — it goes directly to my inbox, the same as any email.',
      ],
    },
    {
      heading: 'Fonts',
      body: [
        'All fonts are self-hosted with the site itself. Loading this page doesn’t make requests to Google Fonts or any other font CDN.',
      ],
    },
    {
      heading: 'Hosting',
      body: [
        'Whoever hosts this site may keep standard server logs (IP address, timestamp, user agent) for security and operational purposes. That’s the host’s infrastructure, not something this site controls or accesses.',
      ],
    },
    {
      heading: 'Email',
      body: [
        'If you email me, that message sits in an ordinary mailbox and is used only to reply to you.',
      ],
    },
    {
      heading: 'Changes',
      body: ['This page may be updated occasionally. The date above reflects the last change.'],
    },
    {
      heading: 'Contact',
      body: ['Questions about any of this — just email.'],
    },
  ],
}

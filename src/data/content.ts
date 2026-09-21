import type { TranslationKey } from '@/i18n/en'

/**
 * Structural / language-agnostic data only — all user-facing copy lives in
 * `src/i18n/en.ts` and `de.ts` and is looked up via `useLanguage().t(key)`.
 * Each array below carries the *shape* (order, stack, links, ids) plus the
 * translation keys that resolve to the actual copy for whichever language
 * is active.
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

export type HeroSpec = { labelKey: TranslationKey; valueKey: TranslationKey }

/** Bottom-edge spec strip — keys read as labels, values as data. */
export const heroSpecs: HeroSpec[] = [
  { labelKey: 'hero.spec.experience.label', valueKey: 'hero.spec.experience.value' },
  { labelKey: 'hero.spec.projects.label', valueKey: 'hero.spec.projects.value' },
  { labelKey: 'hero.spec.stack.label', valueKey: 'hero.spec.stack.value' },
  { labelKey: 'hero.spec.based.label', valueKey: 'hero.spec.based.value' },
]

export type Usp = {
  titleKey: TranslationKey
  textKey: TranslationKey
  shape: 'nested-squares' | 'stacked-rects' | 'circles-row' | 'rotated-squares'
}

export const usps: Usp[] = [
  {
    titleKey: 'usp.productThinking.title',
    textKey: 'usp.productThinking.text',
    shape: 'nested-squares',
  },
  {
    titleKey: 'usp.designGradeUi.title',
    textKey: 'usp.designGradeUi.text',
    shape: 'stacked-rects',
  },
  {
    titleKey: 'usp.performanceFirst.title',
    textKey: 'usp.performanceFirst.text',
    shape: 'circles-row',
  },
  {
    titleKey: 'usp.reliableDelivery.title',
    textKey: 'usp.reliableDelivery.text',
    shape: 'rotated-squares',
  },
]

export type Project = {
  titleKey: TranslationKey
  disciplineKey: TranslationKey
  durationKey: TranslationKey
  /** Revealed when the row is expanded. */
  summaryKey: TranslationKey
  /** Tech stack line — a data label, not copy, so it's identical in both languages. */
  stack: string
  year: string
  link?: string
  nda?: boolean
}

export const projects: Project[] = [
  {
    titleKey: 'work.project.carDetailing.title',
    disciplineKey: 'work.project.carDetailing.discipline',
    durationKey: 'work.project.carDetailing.duration',
    summaryKey: 'work.project.carDetailing.summary',
    stack: 'React · GSAP',
    year: '2026',
    link: 'https://www.broskidetailing.de',
  },
  {
    titleKey: 'work.project.kairuxs.title',
    disciplineKey: 'work.project.kairuxs.discipline',
    durationKey: 'work.project.kairuxs.duration',
    summaryKey: 'work.project.kairuxs.summary',
    stack: 'React · GSAP',
    year: '2025',
    link: 'https://kairuxs.com',
  },
  {
    titleKey: 'work.project.tempo.title',
    disciplineKey: 'work.project.tempo.discipline',
    durationKey: 'work.project.tempo.duration',
    summaryKey: 'work.project.tempo.summary',
    stack: 'Next.js · TS',
    year: '2026',
    link: 'https://tempo.in.ua',
  },
  {
    titleKey: 'work.project.web3Startup.title',
    disciplineKey: 'work.project.web3Startup.discipline',
    durationKey: 'work.project.web3Startup.duration',
    summaryKey: 'work.project.web3Startup.summary',
    stack: 'React · Web3',
    year: '2025',
    nda: true,
  },
]

export type Phase = {
  /** Two-digit index shown on the spine. */
  n: string
  titleKey: TranslationKey
  durationKey: TranslationKey
  textKey: TranslationKey
}

export const phases: Phase[] = [
  {
    n: '01',
    titleKey: 'process.scope.title',
    durationKey: 'process.scope.duration',
    textKey: 'process.scope.text',
  },
  {
    n: '02',
    titleKey: 'process.build.title',
    durationKey: 'process.build.duration',
    textKey: 'process.build.text',
  },
  {
    n: '03',
    titleKey: 'process.handover.title',
    durationKey: 'process.handover.duration',
    textKey: 'process.handover.text',
  },
]

export type PricingStep = { labelKey: TranslationKey; options: TranslationKey[] }

export const pricingSteps: PricingStep[] = [
  {
    labelKey: 'pricing.step.projectType.label',
    options: [
      'pricing.option.website',
      'pricing.option.webApp',
      'pricing.option.mobileApp',
      'pricing.option.botsAutomation',
    ],
  },
  {
    labelKey: 'pricing.step.size.label',
    options: ['pricing.option.small', 'pricing.option.medium', 'pricing.option.large'],
  },
  {
    labelKey: 'pricing.step.design.label',
    options: ['pricing.option.designHave', 'pricing.option.designSome', 'pricing.option.designFull'],
  },
  {
    labelKey: 'pricing.step.timeline.label',
    options: ['pricing.option.rush', 'pricing.option.standard', 'pricing.option.flexible'],
  },
]

export type PricingPlan = {
  nameKey: TranslationKey
  priceKey: TranslationKey
  cadenceKey?: TranslationKey
  featureKeys: TranslationKey[]
  ctaKey: TranslationKey
  featured: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    nameKey: 'pricing.plan.partTime.name',
    priceKey: 'pricing.letsTalk',
    featureKeys: [
      'pricing.plan.partTime.feature1',
      'pricing.plan.partTime.feature2',
      'pricing.plan.partTime.feature3',
      'pricing.plan.partTime.feature4',
    ],
    ctaKey: 'pricing.plan.partTime.cta',
    featured: false,
  },
  {
    nameKey: 'pricing.plan.fullTime.name',
    priceKey: 'pricing.letsTalk',
    featureKeys: [
      'pricing.plan.fullTime.feature1',
      'pricing.plan.fullTime.feature2',
      'pricing.plan.fullTime.feature3',
      'pricing.plan.fullTime.feature4',
    ],
    ctaKey: 'pricing.plan.fullTime.cta',
    featured: true,
  },
]

export type Faq = { questionKey: TranslationKey; answerKey: TranslationKey }

export const faqs: Faq[] = [
  { questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer' },
  { questionKey: 'faq.q2.question', answerKey: 'faq.q2.answer' },
  { questionKey: 'faq.q3.question', answerKey: 'faq.q3.answer' },
  { questionKey: 'faq.q4.question', answerKey: 'faq.q4.answer' },
]

export type FooterLink = { labelKey: TranslationKey; href: string }

export const footerLinks: FooterLink[] = [
  { labelKey: 'footer.legal', href: '/legal' },
  { labelKey: 'footer.privacy', href: '/privacy' },
]

// ---------------------------------------------------------------------------
// /legal and /privacy are out of scope for the DE/EN toggle (see the language
// task): they stay English-only, so their copy stays inline here rather than
// moving into the dictionaries.

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

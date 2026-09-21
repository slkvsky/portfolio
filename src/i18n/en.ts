/**
 * Flat English dictionary — the source of truth for translation keys.
 * `de.ts` is typed against `TranslationKey` (below), so a missing or
 * mistyped key in the German dictionary is a compile error, not a runtime gap.
 */
export const en = {
  'common.startConversation': 'Start a conversation',
  'common.openMenu': 'Open menu',
  'common.closeMenu': 'Close menu',
  'common.skipToContent': 'Skip to content',
  'common.primaryNav': 'Primary',
  'common.language': 'Language',

  'nav.work': 'Work',
  'nav.pricing': 'Pricing',

  'hero.headline': 'We design and build premium web products that feel effortless.',
  'hero.subhead':
    'Independent studio partnering with founders and teams to ship fast, considered interfaces.',
  'hero.spec.experience.label': 'Experience',
  'hero.spec.experience.value': '5+ yrs',
  'hero.spec.projects.label': 'Projects',
  'hero.spec.projects.value': '15+',
  'hero.spec.stack.label': 'Stack',
  'hero.spec.stack.value': 'React · TS · Node.js',
  'hero.spec.based.label': 'Based',
  'hero.spec.based.value': 'Germany · CET',

  'work.eyebrow': 'Selected work',
  'work.title': 'Shipped, not mocked up.',
  'work.visit': 'Visit',
  'work.nda': 'NDA',

  'work.project.carDetailing.title': 'Car detailing studio site',
  'work.project.carDetailing.discipline': 'Business site',
  'work.project.carDetailing.duration': '4 weeks',
  'work.project.carDetailing.summary':
    'Site for a mobile car detailing studio in Wuppertal — a step-by-step price calculator, a scroll-scrubbed before/after video, a B2B inquiry flow, and a self-hosted form backend.',

  'work.project.kairuxs.title': 'Personal brand site for an SMM specialist',
  'work.project.kairuxs.discipline': 'Marketing site',
  'work.project.kairuxs.duration': '4 weeks',
  'work.project.kairuxs.summary':
    'Personal brand and booking site for an SMM specialist — case-study results, tiered pricing, and a UGC gallery, built solo end to end.',

  'work.project.tempo.title': 'Planner product site',
  'work.project.tempo.discipline': 'Product site',
  'work.project.tempo.duration': '2 weeks',
  'work.project.tempo.summary':
    'Landing page and checkout for Tempo, a configurable one-time-purchase personal planner, plus its gamified companion app in early access.',

  'work.project.web3Startup.title': 'Web3 startup app',
  'work.project.web3Startup.discipline': 'Web3',
  'work.project.web3Startup.duration': '12 months',
  'work.project.web3Startup.summary':
    'MetaMask wallet auth, on-chain integrations, and registration flows for a Web3 startup platform — built with a team, under NDA.',

  'testimonial.quote':
    'Oleh caught problems I didn’t even know to ask about. That’s the difference between a developer and someone who actually gets it.',
  'testimonial.author': 'Kira',
  'testimonial.role': 'SMM specialist, kairuxs',

  'usp.eyebrow': 'Why work with us',
  'usp.title': 'Work you can count on.',
  'usp.text':
    'We step in on high-stakes projects where execution can’t fail — from product launches to full rebuilds — and see them through start to finish.',
  'usp.productThinking.title': 'Product thinking',
  'usp.productThinking.text': 'We sweat the flows and edge cases, not just the happy path.',
  'usp.designGradeUi.title': 'Design-grade UI',
  'usp.designGradeUi.text': 'Pixel-considered interfaces with motion that earns its keep.',
  'usp.performanceFirst.title': 'Performance first',
  'usp.performanceFirst.text': 'Fast by default — Core Web Vitals treated as a feature.',
  'usp.reliableDelivery.title': 'Reliable delivery',
  'usp.reliableDelivery.text': 'Clear scope, steady cadence, and no surprises at handoff.',

  'process.eyebrow': 'How this goes',
  'process.title': 'Three phases, no surprises.',
  'process.scope.title': 'Scope',
  'process.scope.duration': '~1 week',
  'process.scope.text':
    'A short call, then a written breakdown: what ships, in what order, and what it costs. Fixed before anything is built.',
  'process.build.title': 'Build',
  'process.build.duration': '4–8 weeks',
  'process.build.text':
    'Weekly cycles with a demo at the end of each. You see working software continuously, not a reveal at the finish line.',
  'process.handover.title': 'Handover',
  'process.handover.duration': 'ongoing',
  'process.handover.text':
    'Documented code, a walkthrough, and transferred ownership. We stay reachable for whatever comes after launch.',

  'pricing.heading': 'Simple pricing',
  'pricing.paragraph1':
    'Two ways to work together — a fixed-scope project or an ongoing monthly partnership.',
  'pricing.paragraph2': 'No lock-in, no bloated retainers. Just clear deliverables and a steady pace.',
  'pricing.modeAria': 'Pricing mode',
  'pricing.modeSingle': 'Single project',
  'pricing.modeRecurring': 'Recurring',
  'pricing.ballparkNote': 'Ballpark only — the exact number depends on your project.',
  'pricing.liveEstimate': 'Live estimate',
  'pricing.fixedQuoteLabel': 'Your fixed quote',
  'pricing.tighten': 'A ballpark that tightens with every answer on the right.',
  'pricing.fixedQuoteText': 'Fixed-scope quote based on your selections — no surprises at handoff.',
  'pricing.startThisProject': 'Start this project',
  'pricing.monthlyPartnership': 'Monthly partnership',
  'pricing.letsTalkStatement': 'Let’s talk.',
  'pricing.letsTalk': 'Let’s talk',
  'pricing.recurringSubtext': 'Two ways to work together every week — no lock-in, pause anytime.',

  'pricing.step.projectType.label': 'Project type',
  'pricing.step.size.label': 'Size',
  'pricing.step.design.label': 'Design',
  'pricing.step.timeline.label': 'Timeline',

  'pricing.option.website': 'Website',
  'pricing.option.webApp': 'Web app',
  'pricing.option.mobileApp': 'Mobile app',
  'pricing.option.botsAutomation': 'Bots & automation',
  'pricing.option.small': 'Small',
  'pricing.option.medium': 'Medium',
  'pricing.option.large': 'Large',
  'pricing.option.designHave': 'Have designs',
  'pricing.option.designSome': 'Some design',
  'pricing.option.designFull': 'Full design',
  'pricing.option.rush': 'Rush',
  'pricing.option.standard': 'Standard',
  'pricing.option.flexible': 'Flexible',

  'pricing.plan.partTime.name': 'Part-time',
  'pricing.plan.partTime.feature1': 'Up to 20 hrs / week',
  'pricing.plan.partTime.feature2': 'Async updates + weekly call',
  'pricing.plan.partTime.feature3': 'One active workstream',
  'pricing.plan.partTime.feature4': 'Pause anytime',
  'pricing.plan.partTime.cta': 'Choose part-time',

  'pricing.plan.fullTime.name': 'Full-time',
  'pricing.plan.fullTime.feature1': 'Up to 40 hrs / week',
  'pricing.plan.fullTime.feature2': 'Daily collaboration',
  'pricing.plan.fullTime.feature3': 'Multiple workstreams',
  'pricing.plan.fullTime.feature4': 'Priority turnaround',
  'pricing.plan.fullTime.cta': 'Choose full-time',

  'faq.eyebrow': 'FAQ',
  'faq.title': 'Questions, answered',
  'faq.q1.question': 'What does a typical engagement look like?',
  'faq.q1.answer':
    'We start with a short scoping call, agree on milestones, then work in weekly cycles with async updates and a demo at the end of each.',
  'faq.q2.question': 'Which tech stack do you use?',
  'faq.q2.answer':
    'Mostly React, Next.js, and TypeScript with Tailwind and Framer Motion. We adapt to your existing stack when it makes sense.',
  'faq.q3.question': 'Can you work with our designers?',
  'faq.q3.answer':
    'Absolutely. We collaborate directly in Figma and treat design handoff as a two-way conversation, not a hand-off wall.',
  'faq.q4.question': 'How do you handle NDAs and IP?',
  'faq.q4.answer': 'Happy to sign your NDA. All work product and IP transfers to you on final payment.',

  'finalCta.title': 'Build your next project with us',

  'footer.legal': 'Legal notice',
  'footer.privacy': 'Privacy',
} as const

export type TranslationKey = keyof typeof en

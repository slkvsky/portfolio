import type { TranslationKey } from './en'

/**
 * German dictionary. Typed as `Record<TranslationKey, string>` against the
 * English dictionary's keys, so a key added to `en.ts` and forgotten here is
 * a compile error — TypeScript checks both the missing and the excess case.
 *
 * This is its own copy, not a 1:1 translation of the English strings: the
 * English copy targets startup founders, the German copy targets a broader
 * mix of German small businesses and pitches itself in plainer terms.
 */
export const de: Record<TranslationKey, string> = {
  'common.startConversation': 'Projekt besprechen',
  'common.openMenu': 'Menü öffnen',
  'common.closeMenu': 'Menü schließen',
  'common.skipToContent': 'Zum Inhalt springen',
  'common.primaryNav': 'Hauptnavigation',
  'common.language': 'Sprache',

  'nav.work': 'Projekte',
  'nav.pricing': 'Preise',

  'hero.headline':
    'Wir entwickeln Websites und Web-Apps, die einfach funktionieren – und gut aussehen.',
  'hero.subhead':
    'Unabhängiges Studio für Unternehmen und Gründer, die eine durchdachte Lösung wollen.',
  'hero.spec.experience.label': 'Erfahrung',
  'hero.spec.experience.value': '5+ Jahre',
  'hero.spec.projects.label': 'Projekte',
  'hero.spec.projects.value': '15+',
  'hero.spec.stack.label': 'Stack',
  'hero.spec.stack.value': 'React · TS · Node.js',
  'hero.spec.based.label': 'Standort',
  'hero.spec.based.value': 'Deutschland · MEZ',

  'work.eyebrow': 'Ausgewählte Projekte',
  'work.title': 'Umgesetzt, nicht nur entworfen.',
  'work.visit': 'Ansehen',
  'work.nda': 'NDA',

  'work.project.carDetailing.title': 'Website für ein Auto-Detailing-Studio',
  'work.project.carDetailing.discipline': 'Unternehmenswebsite',
  'work.project.carDetailing.duration': '4 Wochen',
  'work.project.carDetailing.summary':
    'Website für ein mobiles Auto-Detailing-Studio in Wuppertal — mit Schritt-für-Schritt-Preisrechner, scrollgesteuertem Vorher/Nachher-Video, B2B-Anfrageformular und selbst gehostetem Formular-Backend.',

  'work.project.kairuxs.title': 'Personal-Brand-Website für eine Social-Media-Spezialistin',
  'work.project.kairuxs.discipline': 'Marketing-Website',
  'work.project.kairuxs.duration': '4 Wochen',
  'work.project.kairuxs.summary':
    'Personal-Brand- und Buchungswebsite für eine Social-Media-Spezialistin — mit Case-Study-Ergebnissen, gestaffelten Preispaketen und einer UGC-Galerie, komplett allein umgesetzt.',

  'work.project.tempo.title': 'Produktwebsite für einen Planer',
  'work.project.tempo.discipline': 'Produkt-Website',
  'work.project.tempo.duration': '2 Wochen',
  'work.project.tempo.summary':
    'Landingpage und Checkout für Tempo, einen konfigurierbaren Personal-Planer zum Einmalkauf, inklusive der gamifizierten Begleit-App im Early Access.',

  'work.project.web3Startup.title': 'App für ein Web3-Startup',
  'work.project.web3Startup.discipline': 'Web3',
  'work.project.web3Startup.duration': '12 Monate',
  'work.project.web3Startup.summary':
    'MetaMask-Wallet-Login, On-Chain-Integrationen und Registrierungs-Flows für eine Web3-Startup-Plattform — im Team umgesetzt, unter NDA.',

  'testimonial.quote':
    'Oleh hat Probleme erkannt, von denen ich nicht mal wusste, dass ich sie hätte ansprechen müssen. Das ist der Unterschied zwischen einem Entwickler und jemandem, der es wirklich versteht.',
  'testimonial.author': 'Kira',
  'testimonial.role': 'Social-Media-Spezialistin, kairuxs',

  'usp.eyebrow': 'Warum mit uns arbeiten',
  'usp.title': 'Arbeit, auf die Verlass ist.',
  'usp.text':
    'Wir übernehmen Projekte, bei denen die Umsetzung sitzen muss — von Produktlaunches bis zu kompletten Neubauten — und begleiten sie von Anfang bis Ende.',
  'usp.productThinking.title': 'Produktdenken',
  'usp.productThinking.text': 'Wir achten auf Abläufe und Sonderfälle, nicht nur auf den Idealfall.',
  'usp.designGradeUi.title': 'Durchdachtes UI-Design',
  'usp.designGradeUi.text': 'Pixelgenaue Oberflächen mit Bewegung, die einen Zweck erfüllt.',
  'usp.performanceFirst.title': 'Performance zuerst',
  'usp.performanceFirst.text':
    'Schnell von Haus aus — Ladezeit ist kein Nebeneffekt, sondern Teil des Produkts.',
  'usp.reliableDelivery.title': 'Verlässliche Lieferung',
  'usp.reliableDelivery.text':
    'Klarer Umfang, fester Rhythmus, keine Überraschungen bei der Übergabe.',

  'process.eyebrow': 'So läuft die Zusammenarbeit',
  'process.title': 'Drei Phasen, keine Überraschungen.',
  'process.scope.title': 'Planung',
  'process.scope.duration': '~1 Woche',
  'process.scope.text':
    'Ein kurzes Gespräch, danach eine schriftliche Aufschlüsselung: was geliefert wird, in welcher Reihenfolge und was es kostet. Verbindlich festgelegt, bevor etwas gebaut wird.',
  'process.build.title': 'Umsetzung',
  'process.build.duration': '4–8 Wochen',
  'process.build.text':
    'Wöchentliche Zyklen mit einer Demo am Ende jedes Zyklus. Sie sehen laufend funktionierende Software, keine Enthüllung erst am Schluss.',
  'process.handover.title': 'Übergabe',
  'process.handover.duration': 'laufend',
  'process.handover.text':
    'Dokumentierter Code, eine Einweisung und vollständige Übergabe. Wir bleiben erreichbar für alles, was nach dem Launch kommt.',

  'pricing.heading': 'Transparente Preise',
  'pricing.paragraph1':
    'Zwei Arten der Zusammenarbeit — ein Projekt mit festem Umfang oder eine laufende monatliche Partnerschaft.',
  'pricing.paragraph2':
    'Keine Vertragsbindung, keine aufgeblähten Pauschalen. Nur klare Ergebnisse und ein stetiges Tempo.',
  'pricing.modeAria': 'Preismodell',
  'pricing.modeSingle': 'Einzelprojekt',
  'pricing.modeRecurring': 'Laufend',
  'pricing.ballparkNote': 'Nur ein Richtwert — der genaue Preis hängt von Ihrem Projekt ab.',
  'pricing.liveEstimate': 'Live-Kalkulation',
  'pricing.fixedQuoteLabel': 'Ihr Festpreis',
  'pricing.tighten': 'Eine grobe Einschätzung, die mit jeder Antwort rechts genauer wird.',
  'pricing.fixedQuoteText':
    'Festpreisangebot basierend auf Ihren Angaben — keine Überraschungen bei der Übergabe.',
  'pricing.startThisProject': 'Dieses Projekt starten',
  'pricing.monthlyPartnership': 'Monatliche Partnerschaft',
  'pricing.letsTalkStatement': 'Lassen Sie uns sprechen.',
  'pricing.letsTalk': 'Lassen Sie uns sprechen',
  'pricing.recurringSubtext':
    'Zwei Arten der wöchentlichen Zusammenarbeit — ohne Bindung, jederzeit pausierbar.',

  'pricing.step.projectType.label': 'Projektart',
  'pricing.step.size.label': 'Umfang',
  'pricing.step.design.label': 'Design',
  'pricing.step.timeline.label': 'Zeitrahmen',

  'pricing.option.website': 'Website',
  'pricing.option.webApp': 'Web-App',
  'pricing.option.mobileApp': 'Mobile App',
  'pricing.option.botsAutomation': 'Bots & Automatisierung',
  'pricing.option.small': 'Klein',
  'pricing.option.medium': 'Mittel',
  'pricing.option.large': 'Groß',
  'pricing.option.designHave': 'Design vorhanden',
  'pricing.option.designSome': 'Teilweise vorhanden',
  'pricing.option.designFull': 'Komplettdesign',
  'pricing.option.rush': 'Eilig',
  'pricing.option.standard': 'Standard',
  'pricing.option.flexible': 'Flexibel',

  'pricing.plan.partTime.name': 'Teilzeit',
  'pricing.plan.partTime.feature1': 'Bis zu 20 Std. / Woche',
  'pricing.plan.partTime.feature2': 'Asynchrone Updates + wöchentlicher Call',
  'pricing.plan.partTime.feature3': 'Ein aktiver Workstream',
  'pricing.plan.partTime.feature4': 'Jederzeit pausierbar',
  'pricing.plan.partTime.cta': 'Teilzeit wählen',

  'pricing.plan.fullTime.name': 'Vollzeit',
  'pricing.plan.fullTime.feature1': 'Bis zu 40 Std. / Woche',
  'pricing.plan.fullTime.feature2': 'Tägliche Zusammenarbeit',
  'pricing.plan.fullTime.feature3': 'Mehrere Workstreams',
  'pricing.plan.fullTime.feature4': 'Bevorzugte Bearbeitung',
  'pricing.plan.fullTime.cta': 'Vollzeit wählen',

  'faq.eyebrow': 'FAQ',
  'faq.title': 'Fragen, beantwortet',
  'faq.q1.question': 'Wie läuft eine typische Zusammenarbeit ab?',
  'faq.q1.answer':
    'Wir starten mit einem kurzen Scoping-Gespräch, legen Meilensteine fest, danach arbeiten wir in wöchentlichen Zyklen mit asynchronen Updates und einer Demo am Ende jedes Zyklus.',
  'faq.q2.question': 'Welchen Tech-Stack setzen Sie ein?',
  'faq.q2.answer':
    'Meist React, Next.js und TypeScript mit Tailwind und Framer Motion. Bei Bedarf passen wir uns an Ihren bestehenden Stack an.',
  'faq.q3.question': 'Können Sie mit unseren Designern zusammenarbeiten?',
  'faq.q3.answer':
    'Auf jeden Fall. Wir arbeiten direkt in Figma und verstehen die Designübergabe als einen Dialog, nicht als einseitige Übergabe.',
  'faq.q4.question': 'Wie gehen Sie mit NDAs und geistigem Eigentum um?',
  'faq.q4.answer':
    'Wir unterschreiben gerne Ihr NDA. Alle Arbeitsergebnisse und Rechte gehen bei Zahlung der Schlussrechnung vollständig auf Sie über.',

  'finalCta.title': 'Setzen wir Ihr nächstes Projekt gemeinsam um.',

  'footer.legal': 'Impressum',
  'footer.privacy': 'Datenschutz',
}

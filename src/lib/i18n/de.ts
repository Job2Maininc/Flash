import type { Dictionary } from "./en";

export const de = {
  meta: {
    titleDefault: "Flash — Dating per Live-Video",
    description:
      "Dating per Live-Video. Sag, wer du bist und wen du suchst, swipen zum Matchen, Favoriten später zurückrufen.",
  },
  a11y: {
    skipToContent: "Zum Inhalt springen",
  },
  nav: {
    howItWorks: "So funktioniert’s",
    about: "Über uns",
    safety: "Sicherheit",
    privacy: "Datenschutz",
    matches: "Matches",
    login: "Anmelden",
    start: "Videochat starten",
    joinVideoChat: "Videochat starten",
    language: "Sprache",
    backToCall: "← Anruf",
  },
  home: {
    headline: "Live-Video-Dating nach deinen Regeln",
    lead: "Du sagst, wer du bist und wen du suchst. Der Anruf startet. Swipen, wenn du fertig bist.",
    heroEyebrow: "Live-Video-Dating",
    heroHeadline: "Sprich in den nächsten 30 Sekunden mit jemandem Neuem",
    heroParts: {
      before: "Sprich in den nächsten",
      emph1: "30 Sekunden",
      mid: "mit jemandem",
      emph2: "Neuen",
    },
    heroLead:
      "Spitzname, Geschlecht, wen du suchst. Dann bist du vor der Kamera mit jemandem, der dasselbe gewählt hat.",
    seeHow: "So funktioniert’s",
    trustLive: "Live",
    trustVerified: "Verifiziert",
    trustNoAds: "Ohne Werbung",
    trustAge: "18+",
    trustFreeStart: "Kostenlos starten",
    talkingSuffix: "gerade im Gespräch",
    marquee: [
      "Paris",
      "Berlin",
      "Wien",
      "Zürich",
      "Lyon",
      "Bordeaux",
    ],
    startFree: "Videochat starten",
    stickyCtaHint: "Kostenlos · ohne Anmeldung",
    rotatePrompt: "Dreh dein Handy für einen besseren Call",
    whyFlash: "Warum Flash",
    howEyebrow: "So funktioniert’s",
    howTitle: "Drei Schritte. Ein Live-Anruf",
    howParts: {
      before: "Drei Schritte. Ein",
      emph: "Live-Anruf",
    },
    howLead:
      "Einstellungen einmal setzen. Flash setzt euch Gesicht an Gesicht. Behalten, wer sitzt.",
    steps: [
      {
        title: "Sag, wer du bist",
        body: "Spitzname, Geschlecht und wen du suchst. Damit filtern wir die Warteschlange, bevor jemand klingelt.",
      },
      {
        title: "Sprich live",
        body: "Der Anruf startet in Sekunden. Du hörst die Pause vor dem Lachen. Genau das ist das Produkt.",
      },
      {
        title: "Swipen & zurückrufen",
        body: "Rechts behält. Links sucht weiter. Matches bleiben auf deiner Liste zum späteren Anruf.",
      },
    ],
    whyEyebrow: "Warum Flash",
    whyTitle: "Schluss mit Foto-Scrollen",
    whyLead:
      "Gesichter bewegen sich. Stimmen brechen. Du entscheidest im Moment, nicht nach zwanzig Nachrichten.",
    whyPoints: [
      "Matching nutzt dein Geschlecht und wen du suchst. Weniger falsche Türen.",
      "Video ist von Anfang an an. Du spürst die Stimmung, bevor du einen Abend investierst.",
      "Gegenseitige Likes landen auf einer Liste, die du später öffnest.",
      "Männer, Frauen, nicht-binär. Ab 18 bist du willkommen.",
    ],
    compare: {
      eyebrow: "Anders gebaut",
      title: "Wie Dating-Apps laufen · Wie Flash läuft",
      lead: "Gleiches Ziel — jemanden treffen. Anderer Weg zum ersten echten Hallo.",
      appsLabel: "Dating-Apps",
      flashLabel: "Flash",
      rows: [
        { apps: "Fotos wischen", flash: "Gesicht sehen" },
        { apps: "Tagelang tippen", flash: "In 30 Sekunden sprechen" },
        { apps: "Match verschwindet im Chat-Stapel", flash: "Rückruf-Liste" },
      ],
    },
    enterEyebrow: "Bei Flash einsteigen",
    enterTitle: "Bereit für deinen nächsten Anruf?",
    enterLead:
      "Kostenlos starten. Kamera und Mikro nötig. Wenn’s komisch wird: auflegen. Keine Rede nötig.",
    howFrameLabels: ["Setup", "Live-Anruf", "Match"],
    features: [
      {
        eyebrow: "Matching",
        title: "Triff jemanden, der zu dem passt, was du willst",
        body: "Zuerst Geschlecht und Vorliebe. Dann Live-Video. Der Filter macht die langweilige Arbeit.",
        linkLabel: "Matching starten",
        href: "/join",
        demo: "match",
      },
      {
        eyebrow: "Sicherheit",
        title: "Du behältst die Kontrolle über jeden Anruf",
        body: "Blockieren ist ein Tippen. Melden danach optional. Consent ist die Basis — kein Nice-to-have.",
        linkLabel: "Sicherheitsregeln lesen",
        href: "/safety",
        demo: "safety",
      },
      {
        eyebrow: "Auf Kamera",
        title: "Dein Gesicht ist das Profil",
        body: "Kein polierter Foto-Stapel. Menschen, die beide liked haben, bleiben zum späteren Anruf.",
        linkLabel: "So funktioniert’s",
        href: "/#how-it-works",
        demo: "verified",
      },
    ],
    safetyDemo: [
      {
        icon: "report",
        title: "Melden",
        body: "Belästigung oder Regelverstöße während oder nach dem Anruf markieren.",
      },
      {
        icon: "block",
        title: "Blockieren",
        body: "Verhindert, dass dich die Person erneut in der Warteschlange trifft.",
      },
      {
        icon: "verified",
        title: "Live vor der Kamera",
        body: "Dein Gesicht ist das Profil — kein polierter Foto-Stapel.",
      },
    ],
    trustEyebrow: "Vertrauen & Sicherheit",
    trustTitle: "Für Erwachsene, die auftauchen",
    trustLead:
      "Video-Dating braucht klare Regeln. Das macht Flash tatsächlich.",
    trustBullets: [
      {
        title: "Nur 18+",
        body: "Flash ist für Erwachsene. Wenn jemand minderjährig wirkt, blockiere und melde. Diese Meldung hat Priorität.",
      },
      {
        title: "Gastmodus ist keine Ausweisprüfung",
        body: "Beim Beitritt bestätigst du aktiv, dass du 18+ bist. Im Gastmodus prüfen wir keinen amtlichen Ausweis — melde minderjähriges Verhalten, damit wir handeln können.",
      },
      {
        title: "Consent zuerst",
        body: "Ein Nein, Stille oder Unwohlsein beendet es. Links swipen. Du schuldest keine Rede.",
      },
      {
        title: "Blockieren & melden",
        body: "Ein Tippen blockiert und beendet den Anruf. Melden geht auch nach dem Auflegen. Blocks gelten nur, solange dein Gast-Cookie bleibt.",
      },
      {
        title: "Daten bleiben schlank",
        body: "Gastmodus, signiertes Session-Cookie, kein E-Mail-Konto. Streams über LiveKit; Aufnahmen speichern wir nicht.",
      },
    ],
    faqEyebrow: "FAQ",
    faqTitle: "Klare Antworten",
    faq: [
      {
        id: "camera",
        question: "Brauche ich Kamera und Mikrofon?",
        answer:
          "Ja. Flash ist Live-Video. Dein Browser fragt vor dem Anruf nach Zugriff.",
      },
      {
        id: "free",
        question: "Ist der Start kostenlos?",
        answer:
          "Ja. Spitzname wählen, sagen wer du bist und wen du suchst, dann in die Warteschlange.",
      },
      {
        id: "match",
        question: "Was passiert bei einem gegenseitigen Like?",
        answer:
          "Es wird ein Match. Die Person landet auf deiner Match-Liste zum späteren Video-Rückruf.",
      },
      {
        id: "safe",
        question: "Wie beende ich einen schlechten Anruf?",
        answer:
          "Jederzeit auflegen oder nach links swipen. Details stehen auf der Sicherheitsseite.",
      },
    ],
    closingTitle: "Dein nächstes Gespräch ist einen Tipp entfernt",
  },
  chips: {
    videoDating: "Video-Dating",
    filteredMatches: "Gefilterte Matches",
    tapRecall: "Rückruf mit einem Tipp",
  },
  form: {
    nickname: "Dein Spitzname",
    placeholder: "z. B. Lea",
    iAm: "Ich bin",
    lookingFor: "Ich suche",
    sexHomme: "Mann",
    sexFemme: "Frau",
    sexNonBinaire: "Nicht-binär",
    lookingHommes: "Männer",
    lookingFemmes: "Frauen",
    lookingTous: "Alle",
    submitting: "Wird gestartet…",
    submit: "Meinen ersten Flash starten",
    ageConfirm: "Ich bin 18 Jahre oder älter",
    legal: "Wenn du fortfährst, akzeptierst du die respektvollen Dating-Regeln von Flash.",
    continueError: "Weiter geht gerade nicht",
    genericError: "Etwas ist schiefgelaufen",
  },
  errors: {
    NICKNAME_TOO_SHORT: "Der Spitzname muss mindestens 2 Zeichen haben.",
    SEX_REQUIRED: "Wähle dein Geschlecht.",
    LOOKING_FOR_REQUIRED: "Sag uns, wen du suchst.",
    NICKNAME_BANNED:
      "Dieser Spitzname ist vorübergehend gesperrt. Wähle einen anderen.",
    SCOPE_REQUIRED: "Sag uns, wo du Leute treffen willst.",
    AGE_REQUIRED: "Bestätige, dass du 18 Jahre oder älter bist.",
  },
  presence: {
    waitingMany: "{n} Leute warten gerade",
    someoneThere: "Jemand ist gerade da",
    primeTime:
      "Prime Time ab 21:00 — trag dich ein und wir klingeln · nächste volle Stunde in",
  },
  join: {
    metaTitle: "Videochat beitreten",
    metaDescription:
      "Tritt einem Flash-Videochat bei. Sieh, wer online ist, wähle dein Setup und starte den Live-Anruf.",
    peopleOnline: "Personen online",
    personOnline: "Person online",
    scopeLabel: "Wo treffen",
    scopeLocal: "Lokal",
    scopeGlobal: "Global",
    scopeAllCountries: "Alle Länder",
    scopeGlobalRandom: "Zufällig",
    scopeRandom: "Zufällig",
    startChat: "Videochat starten",
    starting: "Wird gestartet…",
    safetyReminder:
      "Kamera an. Sei respektvoll. Jederzeit auflegen, wenn du musst.",
    previewTitle: "Sieh dich selbst, bevor es live geht",
    previewBody:
      "Kamera und Mikrofon werden auf dem nächsten Screen freigegeben — nachdem du sagst, wer du bist und wen du suchst.",
    selectGender: "Auswählen…",
    selectLooking: "Auswählen…",
    selectCountry: "Land wählen…",
    missingName: "Spitzname fehlt (mindestens 2 Zeichen).",
    missingGender: "Wähle dein Geschlecht.",
    missingLooking: "Sag, wen du suchst.",
    missingScope: "Wähle, wo du Leute treffen willst.",
    missingCountry: "Wähle ein Land aus der Liste.",
    missingAge: "Bestätige, dass du 18 Jahre oder älter bist.",
    controlGender: "Geschlecht",
    controlName: "Name",
    controlCountry: "Wo treffen",
    controlLooking: "Suche",
  },
  footer: {
    blurb:
      "Flash ist Live-Video-Dating. Sag wer du bist, sprich vor der Kamera, swipe, behalte wer sitzt.",
    age: "18+ · Einvernehmliches Dating",
    colProduct: "Produkt",
    colCompany: "Unternehmen",
    colLegal: "Rechtliches",
    impressum: "Impressum",
    terms: "AGB",
  },
  about: {
    metaTitle: "Über uns",
    metaDescription:
      "Flash ist Live-Video-Dating: Matching nach Vorlieben, Swipe und rückrufbare Matches.",
    eyebrow: "Über uns",
    title: "Flash ist Dating vor der Kamera",
    lead: "Wir haben Flash für Leute gebaut, die retuschierte Profile und Chats satt haben, die ungelesen sterben. Du zeigst dich im Video. Du swipest. Du kannst zurückrufen, wer geklickt hat.",
    promiseTitle: "Unser Versprechen",
    promiseBody:
      "Jeder Anruf startet mit deinem Geschlecht und wen du suchst schon gefiltert. Der Rest sind eure Gesichter.",
    whoTitle: "Für wen",
    whoBody:
      "Männer, Frauen, nicht-binäre Personen — hetero, queer, neugierig — ab 18. Wenn du einen Menschen vor einem Lebenslauf willst, bist du richtig.",
    notTitle: "Was wir nicht sind",
    notBody:
      "Kein Fotokatalog. Kein soziales Netzwerk. Keine anonymen Likes ohne Folge. Flash ist ein Video-Date, das bleiben kann.",
    join: "Flash beitreten",
  },
  imprint: {
    metaTitle: "Impressum",
    metaDescription: "Anbieterkennzeichnung nach § 5 DDG.",
    eyebrow: "Rechtliches",
    title: "Impressum",
    lead: "Angaben gemäß § 5 DDG. Platzhalter in eckigen Klammern bitte vor dem Live-Gang ersetzen.",
    providerTitle: "Anbieter",
    emailLabel: "E-Mail",
    phoneLabel: "Telefon",
    vatLabel: "USt-IdNr.",
    responsibleTitle: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    odrTitle: "Online-Streitbeilegung",
    odrBody:
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:",
    disputeTitle: "Verbraucherschlichtung",
    disputeBody:
      "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. [[ANPASSEN falls anders]]",
  },
  terms: {
    metaTitle: "Nutzungsbedingungen",
    metaDescription: "Entwurf der Nutzungsbedingungen für Flash.",
    draftNotice:
      "Entwurf, anwaltlich zu prüfen — nur für die interne Vorbereitung, noch nicht deployen.",
    eyebrow: "Rechtliches",
    title: "Nutzungsbedingungen",
    lead: "Gerüst mit [[Platzhaltern]]. Vor dem öffentlichen Einsatz rechtlich prüfen lassen.",
    sections: [
      {
        title: "Geltungsbereich",
        body: "Diese Bedingungen gelten für die Nutzung von Flash durch [[NAME]] ([[ANSCHRIFT]]). Flash ist ein Live-Video-Dating-Dienst.",
      },
      {
        title: "Mindestalter 18",
        body: "Die Nutzung ist nur Personen gestattet, die das 18. Lebensjahr vollendet haben. Mit der Registrierung als Gast bestätigst du dieses Alter aktiv.",
      },
      {
        title: "Verhaltensregeln",
        body: "Respekt und Einvernehmlichkeit sind Pflicht. Belästigung, Drohungen, ungewollte sexuelle Inhalte und das Vortäuschen einer anderen Identität sind untersagt.",
      },
      {
        title: "Sperrung / Kündigung",
        body: "[[NAME]] kann Accounts oder Gastsitzungen bei Verstößen sperren. Du kannst die Nutzung jederzeit beenden, indem du die Sitzung beendest und Site-Daten löschst.",
      },
      {
        title: "Haftung",
        body: "[[HAFTUNGSTEXT — anwaltlich zu formulieren]]. Flash vermittelt Gespräche; für das Verhalten anderer Nutzer haften wir nur im gesetzlich zwingenden Rahmen.",
      },
      {
        title: "Widerrufsrecht",
        body: "[[WIDERRUFSTEXT — anwaltlich zu formulieren]]. Soweit digitale Dienstleistungen betroffen sind, gelten die einschlägigen Verbraucherschutzregeln.",
      },
      {
        title: "Anwendbares Recht",
        body: "Es gilt das Recht von [[LAND / RECHTSORDNUNG]], soweit zwingendes Verbraucherrecht dem nicht entgegensteht. Gerichtsstand: [[GERICHTSSTAND]].",
      },
    ],
  },
  privacy: {
    metaTitle: "Datenschutz",
    metaDescription:
      "Wie Flash deinen Spitznamen, deine Vorlieben und Video-Call-Daten behandelt.",
    eyebrow: "Datenschutz",
    title: "Klar, was wir behalten.",
    lead: "Flash läuft im Gastmodus: kein E-Mail-Konto nötig. Hier steht klar, was fließt, damit Video-Dating funktioniert.",
    giveTitle: "Was du uns gibst",
    giveBody:
      "Spitzname, Geschlecht und wen du suchst. Diese Infos dienen dem Matching und zeigen, wer du im Anruf bist. Sie hängen an einem signierten Session-Cookie auf deinem Gerät.",
    videoTitle: "Video & Audio",
    videoBody:
      "Kamera-/Mikro-Streams laufen über unseren Partner LiveKit für den Echtzeit-Anruf. Flash speichert deine Aufnahmen nicht.",
    queueTitle: "Matches & Warteschlange",
    queueBody:
      "Warteschlange, Sessions und Match-Liste werden vorübergehend (Redis) gespeichert, damit das Produkt läuft. Matches bleiben für den Video-Rückruf verfügbar.",
    controlTitle: "Deine Hebel",
    controlBody:
      "Du kannst jederzeit auflegen, den Spitznamen ändern, indem du auf der Startseite neu startest, und begrenzen, was die Kamera zeigt. Für Anfragen zu deinen Daten kontaktiere das Flash-Team über den Kanal auf dem Deployment.",
    safetyLink: "Sieh dir auch unsere Sicherheitsregeln an →",
  },
  safety: {
    metaTitle: "Sicherheit",
    metaDescription:
      "Flash-Sicherheitsregeln: 18+, Consent, Respekt im Video und gute Kamera-Praxis.",
    eyebrow: "Sicherheit",
    title: "Du entscheidest, wie jeder Anruf endet.",
    lead: "Video-Dating braucht gegenseitigen Respekt. Das ist der Flash-Rahmen — klar, nicht verhandelbar, damit du die Kontrolle behältst.",
    tips: [
      {
        title: "Nur 18+",
        body: "Flash ist für Erwachsene. Wenn jemand minderjährig wirkt, blockiere und melde — diese Meldung hat höchste Priorität für die Prüfung.",
      },
      {
        title: "Consent zuerst",
        body: "Video ist kein Recht. Respektiere ein Nein, Stille, Unwohlsein — swipe nach links und geh weiter.",
      },
      {
        title: "Blockieren & melden",
        body: "Ein Tippen blockiert und beendet den Anruf sofort. Du kannst auch nach dem Auflegen melden. Ein Block gilt nur, solange dein Gast-Cookie bleibt — wer Site-Daten löscht, erscheint als neue Person.",
      },
      {
        title: "Schütz deinen Rahmen",
        body: "Zeig keine Adresse, Dokumente oder Bankdaten. Du bestimmst, was die Kamera zeigt.",
      },
      {
        title: "Vertrau deinem Bauch",
        body: "Komisches Verhalten? Auflegen. Du musst nichts erklären. Der nächste Flash wartet.",
      },
    ],
    emergency:
      "Im Notfall offline die lokalen Dienste rufen. Flash hilft beim Kennenlernen; deine Sicherheit bleibt bei dir.",
    cta: "Videochat starten",
  },
  matches: {
    title: "Deine Matches",
    eyebrow: "Matches",
    subtitlePrefix: "Menschen, mit denen es geklickt hat —",
    emptyTitle: "Noch kein Funke",
    emptyBody:
      "Während eines Anrufs nach rechts swipen. Wenn die Person auch liked, landet sie auf deiner Liste — und du kannst sie per Video zurückrufen.",
    loginPrompt:
      "Melde dich mit deinem Spitznamen an, um Matches aus dieser Sitzung zu sehen.",
    recall: "Zurückrufen",
    recallError: "Rückruf nicht möglich",
    genericError: "Etwas ist schiefgelaufen",
    open: "Öffnen",
    unlocked: "Chat freigeschaltet",
    locked: "Freischalten zum Chatten",
  },
  browse: {
    matches: "Matches",
    searchingTitle: "Wir suchen dein Match…",
    searchingBody:
      "Warteschlange nach deinem Geschlecht und wen du suchst. Sobald jemand Passendes da ist, startet der Anruf.",
    searchingHints: [
      "Filter nach Geschlecht und wen du suchst…",
      "Warteschlange fair und consent-first…",
      "Nächste freie passende Person startet den Anruf…",
      "Bleib hier — Chemie ist einen Flash entfernt…",
    ],
    cancelSearch: "Abbrechen",
    connecting: "Verbinden…",
    connectingCall: "Verbindung zum Anruf…",
    recallNotice: "Rückruf läuft — Verbindung zum Anruf…",
    peerLeft: "{name} hat den Anruf verlassen",
    peerLeftFallback: "Dein Gegenüber",
    itsAMatch: "Es ist ein Match ♥",
    waitingLike: "Warten auf den Like…",
    swipeHint: "Über den Bildschirm wischen",
    queueError: "Warteschlange nicht verfügbar",
    sessionError: "Sitzungsfehler",
    swipeError: "Swipe nicht möglich",
    genericError: "Etwas ist schiefgelaufen",
  },
  call: {
    joining: "{name} tritt dem Anruf bei…",
    livekitUnavailable: "LiveKit-Token nicht verfügbar",
    videoError: "Videofehler",
    pass: "Weiter",
    like: "Like",
    match: "Match",
    mic: "Mikrofon ein- oder ausschalten",
    camera: "Kamera ein- oder ausschalten",
    block: "Blockieren",
    reportTitle: "Person melden",
    reportLead:
      "Optional — du hast den Anruf schon verlassen. Melden hilft, Flash sicherer zu halten.",
    reportReason: "Grund",
    reportNote: "Optionale Notiz",
    reportSubmit: "Meldung senden",
    reportSkip: "Überspringen",
    reportError: "Meldung konnte nicht gesendet werden",
    reportLastCall: "Letzten Anruf melden",
    reportReasons: {
      seemed_underage: "Wirkt minderjährig",
      harassment: "Belästigung oder Drohungen",
      sexual_content: "Unerwünschte sexuelle Inhalte",
      spam: "Spam oder Betrug",
      other: "Sonstiges",
    },
  },
  celebration: {
    with: "mit",
    findInMatches: "Finde sie unter Matches",
  },
  media: {
    title: "Kamera & Mikrofon",
    body: "Flash braucht Kamera und Mikrofon für Anrufe. Dein Browser fragt nach Zugriff.",
    activate: "Kamera und Mikrofon aktivieren",
    activating: "Wird aktiviert…",
    denied:
      "Zugriff verweigert. Tippe auf „Kamera aktivieren“ oder erlaube die Seite im Browser (Symbol links neben der URL).",
    notFound: "Keine Kamera oder kein Mikrofon auf diesem Gerät gefunden.",
    inUse: "Kamera oder Mikrofon wird bereits von einer anderen App genutzt.",
    overconstrained:
      "Kamera/Mikrofon lassen sich mit den gewünschten Einstellungen nicht nutzen.",
    https: "Für Kamera und Mikrofon ist HTTPS nötig.",
    generic: "Kein Zugriff auf Kamera oder Mikrofon.",
  },
  images: {
    chemistry: "Zwei Menschen mitten im Gespräch bei warmem Abendlicht",
    community: "Menschen im Gespräch, ungestellt",
  },
} satisfies Dictionary;

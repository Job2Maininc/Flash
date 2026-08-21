# Flash — Repo-Inventur (Prompt 0)

Stand: Branch `docs/audit-inventur`, abgeleitet von `main`.  
**Keine Produktcode-Änderungen** — nur diese Audit-Datei.

---

## 1. Verzeichnisbaum (relevant, ohne `node_modules`)

```
.
├── public/
│   ├── images/
│   │   ├── about/          # conversation.jpg + .webp
│   │   └── portraits/      # p01–p15 .jpg + .webp
│   ├── *.svg               # next/vercel placeholder assets
│   └── …
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── about/
│   │   ├── api/            # blocks, guest, livekit, matches, queue, session, …
│   │   ├── browse/
│   │   ├── join/
│   │   ├── matches/
│   │   ├── privacy/
│   │   ├── safety/
│   │   ├── styleguide/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── opengraph-image.tsx
│   │   └── page.tsx        # Startseite
│   ├── components/
│   │   ├── browse/         # Call UI overlays (timer, block, report, …)
│   │   ├── join/           # Join lobby
│   │   ├── marketing/      # Landing sections + CameraHeader/Footer
│   │   ├── ui/             # Primitives (Button, Marquee, Section, …)
│   │   └── *.tsx           # BrowseClient, VideoStage, FlashBrand, …
│   ├── hooks/
│   └── lib/
│       ├── i18n/           # en.ts, de.ts, config, get-locale
│       └── …               # matching, guest, livekit, safety, hearts, …
├── DESIGN.md
├── package.json
└── …
```

Kein `messages/`-Ordner (kein next-intl). Keine separate `tailwind.config.*` — Tokens in `src/app/globals.css` + Tailwind v4 `@theme inline`.

---

## 2. Routen unter `src/app/`

| Pfad | Datei | Server / Client |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | **Server** (`async` Page) |
| `/join` | `src/app/join/page.tsx` | **Server** (Client-Kinder: `JoinVideoChat`) |
| `/browse` | `src/app/browse/page.tsx` | **Server** (Client: `BrowseClient` via Suspense) |
| `/matches` | `src/app/matches/page.tsx` | **Server** |
| `/about` | `src/app/about/page.tsx` | **Server** |
| `/safety` | `src/app/safety/page.tsx` | **Server** |
| `/privacy` | `src/app/privacy/page.tsx` | **Server** |
| `/styleguide` | `src/app/styleguide/page.tsx` | **Server** (noindex) |
| Root layout | `src/app/layout.tsx` | **Server** |
| OG image | `src/app/opengraph-image.tsx` | Edge ImageResponse |

Keine Page enthält `"use client"`; Client-Verhalten steckt in Kindkomponenten.

API-Routen (Auswahl): `/api/guest`, `/api/queue/join`, `/api/session/*`, `/api/livekit/*`, `/api/blocks`, `/api/reports`, `/api/matches`, `/api/matches/[id]/unlock`, `/api/matches/[id]/messages`, `/api/swipes`, `/api/locale`, `/api/online`, `/api/presence`, `/api/last-partner`.

---

## 3. Startseite — Sektion → Komponente

Reihenfolge wie in `src/app/page.tsx` (+ Header außerhalb von `<main>`):

| # | Sektion | Komponente | Dateipfad |
| --- | --- | --- | --- |
| — | Header (+ Intro) | `HomeIntroHeader` → `CameraHeader` | `src/components/HomeIntroHeader.tsx`, `src/components/marketing/CameraHeader.tsx` |
| 1 | Hero | `HomeHero` (+ `LiveGrid`) | `src/components/marketing/HomeHero.tsx` |
| 2 | Städte-Marquee | `Marquee` | `src/components/ui/Marquee.tsx` |
| — | Matches (nur wenn vorhanden) | `MatchesSection` | `src/components/marketing/MatchesSection.tsx` |
| 3 | How it works | `HowItWorks` | `src/components/marketing/HowItWorks.tsx` |
| 4–6 | Matching / Safety / On camera | `FeatureBlocks` (3 Features aus `t.home.features`) | `src/components/marketing/FeatureBlocks.tsx` |
| 7 | Testimonials („Calls that actually begin“) | `Testimonials` | `src/components/marketing/Testimonials.tsx` |
| 8 | Trust & Safety | `TrustSafety` | `src/components/marketing/TrustSafety.tsx` |
| 9 | FAQ | `FaqSection` | `src/components/marketing/FaqSection.tsx` |
| 10 | Footer-CTA | `ClosingCta` | `src/components/marketing/ClosingCta.tsx` |
| 11 | Footer | `CameraFooter` | `src/components/marketing/CameraFooter.tsx` |
| — | Sticky Mobile CTA | `StickyMobileCta` | `src/components/marketing/StickyMobileCta.tsx` |

---

## 4. i18n

| Aspekt | Ist-Zustand |
| --- | --- |
| Bibliothek | **Keine** next-intl / react-i18next — Custom |
| Locale-Cookie | `flash_locale` (`src/lib/i18n/config.ts`) |
| Locales | `en` (Default), `de` |
| Dateien | `src/lib/i18n/en.ts`, `src/lib/i18n/de.ts` |
| API | `getDictionary(locale)`, `getLocale()`, `POST /api/locale` |
| Provider | `LocaleProvider` + `useI18n()` für Client |

**Top-Level-Keys** in den Dictionaries:  
`meta`, `a11y`, `nav`, `home`, `chips`, `form`, `errors`, `join`, `footer`, `about`, `privacy`, `safety`, `matches`, `browse`, `call`, `celebration`, `media`, `images`.

`Dictionary` = `typeof en`; DE muss dieselbe Shape haben.

---

## 5. Farben & Typografie

- **Tailwind v4** via `@import "tailwindcss"` + `@theme inline` in `src/app/globals.css` (keine `tailwind.config.js`).
- **Fonts** (`src/app/layout.tsx`): Schibsted Grotesk → `--font-display` / `--font-body`; Spline Sans Mono → `--font-mono` (nur Timer/Zähler).
- Design-Notizen: `DESIGN.md`.

### Farbtokens (Hex aus `:root`)

| Token | Hex | Rolle |
| --- | --- | --- |
| `--ink-900` | `#0e0b12` | Stage / Hintergrund |
| `--ink-800` | `#16121c` | Flächen |
| `--ink-700` | `#201a28` | Borders / alt surfaces |
| `--ink-600` | `#2e2637` | Borders |
| `--cam-paper` | `#f3f1ee` | Primärtext auf Dunkel |
| `--muted` | `#a096aa` | Sekundärtext |
| `--faint` | `#8f8799` | Tertiär (~5.7:1 auf ink-900) |
| `--key-500` | `#ff4326` | CTA / Accent (Vermillion) |
| `--key-400` | `#ff6a52` | Hellere Key |
| `--key-600` | `#e02e14` | Dunklere Key |
| `--rim-500` | `#6c5cff` | Reserved indigo |
| `--rim-400` | `#8b7dff` | Hellere Rim |
| `--live` | `#e8256b` | Live-Pulse (Magenta) |
| `--ok` | `#4ade9b` | Success |
| `--warn` | `#ffc24b` | Warning |
| Legacy `--paper-legacy` | `#f3ebe0` | Alt-System |
| Legacy `--ink` | `#1a1410` | Alt-System |
| Legacy `--accent` | `#e8ff4a` | Lime (legacy) |
| Legacy `--danger` | `#c23b22` | Danger |

---

## 6. `package.json` — Dependencies

**dependencies**

| Paket | Version |
| --- | --- |
| `@livekit/components-react` | ^2.9.23 |
| `@livekit/components-styles` | ^1.2.0 |
| `@upstash/redis` | ^1.38.2 |
| `jose` | ^6.2.8 |
| `livekit-client` | ^2.21.0 |
| `livekit-server-sdk` | ^2.17.0 |
| `next` | 16.3.0 |
| `react` | 19.2.8 |
| `react-dom` | 19.2.8 |

**devDependencies**

| Paket | Version |
| --- | --- |
| `@tailwindcss/postcss` | ^4 |
| `@types/node` | ^20 |
| `@types/react` | ^19 |
| `@types/react-dom` | ^19 |
| `eslint` | ^9 |
| `eslint-config-next` | 16.3.0 |
| `tailwindcss` | ^4 |
| `typescript` | ^5 |

---

## 7. `next/image` — Stellen & `sizes`

| Datei | `sizes` gesetzt? |
| --- | --- |
| `src/components/ui/VideoTile.tsx` | Ja — `(max-width: 768px) 33vw, 20vw` |
| `src/components/MarketingSection.tsx` | Ja — `(max-width: 1024px) 100vw, 50vw` |
| `src/components/marketing/FeatureBlocks.tsx` | Ja — `120px` |
| `src/components/marketing/HowItWorks.tsx` | Ja — `280px`, `80px`, `96px` |
| `src/app/about/page.tsx` | Ja — `(max-width: 768px) 100vw, 768px` |

Hero-Portraits in `LiveGrid` nutzen **kein** `next/image` (CSS/`VideoTile`-Pfad prüfen bei Bedarf); die registrierten `HERO_PORTRAITS` zeigen auf WebP unter `/images/portraits/`.

---

## 8. Portrait-Bilder

| Ort | Inhalt |
| --- | --- |
| `public/images/portraits/` | **15** Paare `p01`–`p15` als **`.webp`** + **`.jpg`** |
| Nutzung im Code | `HERO_PORTRAITS` → nur **`.webp`** (`src/lib/hero-portraits.ts`) |
| WebP-Größe | ca. **19–110 KB**, Ø ~**47 KB** |
| About | `public/images/about/conversation.webp` (~154 KB) + `.jpg` (~231 KB) |

Format laut Kommentar: warm graded, 4:5, mood-only (keine Namen/Alter an Faces).

---

## 9. Legal-Seiten

| Inhalt | Route | Bemerkung |
| --- | --- | --- |
| Datenschutz | `/privacy` | Eigene Page mit Copy aus `t.privacy` |
| Safety-Regeln | `/safety` | Eigene Page; Footer-Label **Impressum** zeigt aktuell auch auf `/safety` |
| AGB / Terms | — | Footer-Link `t.footer.terms` zeigt auf **`/privacy`**, keine eigene `/terms`-Route |
| Impressum | — | **Keine** dedizierte `/impressum`-Route; nur Footer-Link → `/safety` |

---

## 5 Dateien, die du am ehesten selbst lesen solltest

1. `src/app/page.tsx` — Startseiten-Zusammensetzung  
2. `src/app/globals.css` — Tokens, Typo-Utilities, Motion  
3. `src/lib/i18n/en.ts` — Canonical Copy/Keys (DE muss folgen)  
4. `src/components/marketing/CameraHeader.tsx` — Nav, Login, Matches, CTA  
5. `src/lib/matching.ts` — Kern Session/Queue/Match-Logik (Produktverhalten)

Ergänzend nützlich: `DESIGN.md`, `src/lib/guest.ts`, `src/components/BrowseClient.tsx`.

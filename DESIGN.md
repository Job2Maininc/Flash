# Flash — Camera Light Design System

Living notes for the `feature/camera-light-redesign` visual system. Presentation only: matching, LiveKit, guest auth, Redis, and route URLs stay out of scope for design changes.

## Intent

Flash should feel like a live studio — dark stage, warm key light, rim accents — not a purple SaaS template or a cream-and-serif brochure. The product surfaces (join, browse, call, matches) share the same ink / key language as the marketing site.

## Brand tokens

Defined in `src/app/globals.css` (`:root` + `@theme inline`).

| Token | Role | Value |
| --- | --- | --- |
| `--ink-900` … `--ink-600` | Stage backgrounds / borders | `#0e0b12` → `#2e2637` |
| `--cam-paper` | Primary text on dark | `#fbf3ec` |
| `--muted` / `--faint` | Secondary / tertiary text | `#a096aa` / `#6a6172` |
| `--key-500` / `--key-400` / `--key-600` | **Clickable only** — CTAs, active controls, logo bolt | `#ff7a45` family |
| `--live` | **Live pulse dot only** — never fill, border, or body text | `#ff2d55` |
| `--cam-paper` / `--paper` | Affirmative / confirming (checks, wordmark text) | `#fbf3ec` |
| `--rim-500` | Reserved / unused on marketing (do not decorate with purple) | `#6c5cff` |
| `--ok` | **Not used on marketing** | `#4ade9b` |

**Logo bolt:** always `--key-500` orange (`FlashLogo`, `icon.svg`). No lime exception.

Legacy cream/lime (`--paper-legacy`, `--accent`) remain only for unmigrated product chrome; new UI prefers Camera Light.

### Elevation & motion

- `--elev-1` / `--elev-2` — inset hairline + soft depth
- `--glow-key` — CTA / live preview emphasis
- `--dur-fast` 140ms · `--dur-base` 320ms · `--dur-slow` 700ms
- `--ease-out` / `--ease-in-out` — intentional, not bouncey

### Type

| Role | Font | CSS |
| --- | --- | --- |
| Display (Camera Light) | Bricolage Grotesque | `--font-camera-display` · wordmark + headlines |
| Body | DM Sans | `--font-body` · `.cam-body` / `.cam-body-l` |
| Mono / timers / eyebrows | JetBrains Mono | `--font-mono` · `.cam-eyebrow` |
| Legacy display | Fraunces | `--font-display` (avoid on Camera Light surfaces) |

## Primitives

Under `src/components/ui/`:

- `Button` — primary (key), secondary, ghost, danger (live)
- `Badge` / `LiveBadge` — status chips
- `Card`, `Pill`, `Section`, `Reveal`
- `VideoTile`, `Marquee`, `CountUp`, `DeviceFrame`, `Accordion`
- `NoiseOverlay` — film grain (decorative, `aria-hidden`)
- `cn()` — class join helper
- `useReducedMotion()` — JS hook mirroring `prefers-reduced-motion`

Review surface: `/styleguide` (noindex).

## Layout grammar

1. **One composition** in the first viewport (brand + one headline + one lead + one CTA group + dominant visual).
2. **Dark stage** with radial key spill — not flat black.
3. **No hero cards** / floating promo badges on media.
4. **One job per section** — eyebrow, title, short lead.
5. Motion supports hierarchy (reveal, tile enter, connect line) — never noise.

## Product surfaces

| Surface | Visual notes |
| --- | --- |
| Join | Key-glow stage, pill pickers, primary start CTA, safety reminder |
| Searching | Concentric pulse rings, mono elapsed timer, rotating hints, cancel |
| In-call | Remote full-bleed, local tile with key ring, auto-hiding control pill, 3-2-1 count-in |
| Matches | Dark list rows, primary recall buttons |
| Celebration | Scale/fade match overlay on key |

Handlers, session polling, LiveKit room wiring, and swipe logic must not change for visual work.

## Accessibility & motion

### Built-in

- Skip link → `#main` (root layout)
- `:focus-visible` uses key rim (not lime)
- `themeColor` = ink-900
- Viewport allows user zoom (`maximumScale` unset)
- Global `prefers-reduced-motion: reduce` collapses animation/transition durations
- `LiveGrid` / `CountIn` / `CallControlBar` / `Marquee` / `Reveal` respect reduced motion in JS/CSS
- Mobile menu traps Escape and restores `body` overflow

### Manual checklist (axe / Lighthouse)

Run locally after `npm install && npm run build && npm run start`:

1. **axe DevTools** on `/`, `/join`, `/browse` (with mock media if needed), `/matches`, `/safety`
   - No critical contrast failures on cam-paper / muted over ink
   - Buttons/links have accessible names
   - Dialogs/menus expose `role` / `aria-*` where used
2. **Lighthouse** (mobile + desktop) — aim:
   - Accessibility ≥ 90
   - Best Practices ≥ 90
   - Performance: hero images via `next/image` / portrait set; grain overlay must stay CSS-only
3. Keyboard: Tab through header → CTA → footer; Escape closes mobile menu; search cancel is reachable
4. Screen reader: LiveBadge / searching timer use polite live regions where applicable

Document regressions in PR notes; do not “fix” a11y by changing product APIs.

## i18n

EN + DE dictionaries in `src/lib/i18n/`. Camera Light copy (features, trust, FAQ, searching hints, safety reminder) must stay in sync across both files. `Dictionary` is `typeof en`.

## Anti-patterns (do not ship)

- Purple mesh / indigo SaaS gradients as the main look
- Warm cream + terracotta “AI brochure” default
- Dense broadsheet / newspaper columns
- Fake stats bands
- Inset hero cards or floating sticker badges on the hero
- New Framer Motion / Lenis deps unless explicitly approved (current motion is CSS + rAF / IntersectionObserver)

## File map

```
src/app/globals.css          tokens + cam-* utilities
src/app/layout.tsx           fonts, skip link, themeColor
src/app/styleguide/page.tsx  token playground
src/components/ui/*          primitives
src/components/marketing/*   home sections + CameraHeader/Footer
src/components/join/*        lobby chrome
src/components/browse/*      searching / call chrome overlays
DESIGN.md                    this file
```

## Change policy

Visual PRs should prove **no logic diff** in matching, LiveKit token fetch, queue join, swipe, recall, or guest cookie contracts. Prefer className / presentational wrappers over rewriting handlers.

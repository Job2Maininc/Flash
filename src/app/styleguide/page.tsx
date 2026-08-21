import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  LiveBadge,
  NoiseOverlay,
  Pill,
  Reveal,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "ink-900", varName: "--ink-900" },
  { name: "ink-800", varName: "--ink-800" },
  { name: "ink-700", varName: "--ink-700" },
  { name: "ink-600", varName: "--ink-600" },
  { name: "cam-paper", varName: "--cam-paper" },
  { name: "muted", varName: "--muted" },
  { name: "faint", varName: "--faint" },
  { name: "key-500", varName: "--key-500" },
  { name: "key-400", varName: "--key-400" },
  { name: "key-600", varName: "--key-600" },
  { name: "rim-500", varName: "--rim-500" },
  { name: "rim-400", varName: "--rim-400" },
  { name: "live", varName: "--live" },
  { name: "ok", varName: "--ok" },
  { name: "warn", varName: "--warn" },
] as const;

export default function StyleguidePage() {
  return (
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <div aria-hidden className="cam-spill pointer-events-none absolute inset-x-0 top-0 h-[42dvh]" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 safe-top">
        <p className="cam-eyebrow">Camera Light · Design system</p>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] underline-offset-4 transition hover:text-[var(--cam-paper)] hover:underline"
        >
          ← Back to site
        </Link>
      </header>

      <main id="main" className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 pb-24 pt-6">
        <Reveal>
          <p className="cam-eyebrow">Design system</p>
          <h1 className="cam-display-xl mt-3 text-[var(--cam-paper)]">
            Flash tokens &amp; primitives
          </h1>
          <p className="cam-body-l mt-5 text-[var(--muted)]">
            Tokens, type, and primitives for Flash Camera Light. Full system
            notes live in <code className="text-[var(--key-400)]">DESIGN.md</code>{" "}
            at the repo root.
          </p>
        </Reveal>

        <section className="space-y-5">
          <h2 className="cam-h2">Color</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {swatches.map((swatch) => (
              <div key={swatch.name} className="space-y-2">
                <div
                  className="aspect-[4/3] rounded-[var(--radius-md)] border border-[var(--ink-600)] shadow-[var(--elev-1)]"
                  style={{ background: `var(${swatch.varName})` }}
                />
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
                  {swatch.name}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="cam-grad-key-rim h-24 rounded-[var(--radius-lg)] shadow-[var(--elev-1)]" />
            <div className="relative h-24 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--ink-800)] shadow-[var(--elev-1)]">
              <div className="cam-spill absolute inset-0" />
              <p className="relative z-10 p-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
                Key→Rim · Spill
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="cam-h2">Typography</h2>
          <div className="space-y-6 rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-6 shadow-[var(--elev-1)]">
            <p className="cam-eyebrow">Eyebrow / mono</p>
            <p className="cam-display-xl">Display XL</p>
            <p className="cam-display-l">Display L headline</p>
            <p className="cam-h2">Section H2</p>
            <p className="cam-body-l text-[var(--muted)]">
              Body L — warm off-white on deep ink. Max width keeps lines readable.
            </p>
            <p className="cam-body text-[var(--muted)]">
              Body — Camera Light is faces lit by screens: warm key, cool rim,
              deep shadow. Live red only when something is actually live.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="cam-h2">Buttons</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="cam-h2">Badges &amp; pills</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge tone="key">Key</Badge>
            <Badge tone="rim">Rim</Badge>
            <Badge tone="ok">Ok</Badge>
            <Badge tone="warn">Warn</Badge>
            <LiveBadge label="1,284 talking right now" />
            <Pill>Idle pill</Pill>
            <Pill active>Active pill</Pill>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="cam-h2">Cards &amp; elevation</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <p className="cam-eyebrow">elev-1</p>
              <p className="mt-3 cam-body text-[var(--muted)]">
                Raised surface with inset top highlight — reads as lit, not flat.
              </p>
            </Card>
            <Card elevated className="p-6">
              <p className="cam-eyebrow">elev-2</p>
              <p className="mt-3 cam-body text-[var(--muted)]">
                Deeper glow for hover / featured quote cards.
              </p>
            </Card>
            <Card className="border-[var(--key-500)]/40 p-6 shadow-[var(--glow-key)] md:col-span-2">
              <p className="cam-eyebrow text-[var(--key-400)]">glow-key</p>
              <p className="mt-3 cam-body text-[var(--muted)]">
                Reserved for emphasis — never spray on every card.
              </p>
            </Card>
          </div>
        </section>

        <Section inverted className="rounded-[var(--radius-xl)] !px-0 !py-12">
          <div className="px-6">
            <p className="cam-eyebrow !text-[var(--ink-600)]">Inverted band</p>
            <p className="cam-display-l mt-3 text-[var(--ink-900)]">
              Paper breath between dark sections
            </p>
            <p className="cam-body mt-4 text-[var(--ink-700)]">
              At most twice on the marketing site — for rhythm, not default.
            </p>
          </div>
        </Section>

        <section className="space-y-3 pb-8">
          <h2 className="cam-h2">Assumptions (Phase 1)</h2>
          <ul className="cam-body list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>Body face stays DM Sans until Geist/Switzer is installed via npm.</li>
            <li>Display and body use Schibsted Grotesk; mono is Spline Sans Mono.</li>
            <li>Hero grid will use still portraits with a drop-in VideoTile prop.</li>
            <li>No fake stats band; testimonials if numbers are not publishable.</li>
            <li>DE/EN i18n stays; no native-app sticky bar.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

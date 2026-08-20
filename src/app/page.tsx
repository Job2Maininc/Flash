import Image from "next/image";
import Link from "next/link";
import { MarketingSection } from "@/components/MarketingSection";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeIntroHeader } from "@/components/HomeIntroHeader";
import { HomeHero } from "@/components/marketing/HomeHero";
import { Marquee } from "@/components/ui/Marquee";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { clearGuestCookie } from "@/lib/guest";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
import { localizedStockImages } from "@/lib/stock-images";

export default async function HomePage() {
  try {
    await clearGuestCookie();
  } catch {
    // Ignore cookie errors so the landing form still renders.
  }

  const t = getDictionary(await getLocale());
  const images = localizedStockImages(t);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <HomeIntroHeader />
      <HomeHero portraits={HERO_PORTRAITS} />
      <Marquee items={t.home.marquee} />

      {/* Phase 3 will restyle these sections into Camera Light. */}
      <div className="bg-[var(--paper-legacy)] text-[var(--ink)]">
        <MarketingSection
          id="how-it-works"
          eyebrow={t.home.howEyebrow}
          title={t.home.howTitle}
          lead={t.home.howLead}
          image={images.videoDate}
        >
          <ol className="mt-8 space-y-5">
            {t.home.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-faint)]">
                  0{index + 1}
                </span>
                <div>
                  <p className="font-medium text-[var(--ink)]">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </MarketingSection>

        <MarketingSection
          eyebrow={t.home.whyEyebrow}
          title={t.home.whyTitle}
          lead={t.home.whyLead}
          image={images.chemistry}
          reverse
        >
          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            {t.home.whyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </MarketingSection>

        <section className="relative px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              {t.home.socialEyebrow}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
              {t.home.socialTitle}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {t.home.testimonials.map((item) => (
                <blockquote key={item.name} className="space-y-4">
                  <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                    “{item.quote}”
                  </p>
                  <footer>
                    <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                      {item.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                      {item.detail}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section
          id="enter"
          className="relative border-t border-[var(--ink)]/10 px-5 py-16 sm:py-20"
        >
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                {t.nav.joinVideoChat}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
                {t.home.enterTitle}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-muted)]">
                {t.home.enterLead}
              </p>
              <Link
                href="/join"
                className="flash-btn flash-btn-primary mt-8 inline-flex px-6 py-3.5 text-base"
              >
                {t.nav.joinVideoChat}
              </Link>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src={images.community.src}
                alt={images.community.alt}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}

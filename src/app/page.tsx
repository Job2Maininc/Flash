import Image from "next/image";
import Link from "next/link";
import { FeatureChips } from "@/components/FeatureChips";
import { MarketingSection } from "@/components/MarketingSection";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeIntroHeader } from "@/components/HomeIntroHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { clearGuestCookie } from "@/lib/guest";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
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
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1] flash-grain"
      />

      <HomeIntroHeader />

      <section className="relative mt-4 min-h-[min(88dvh,920px)] overflow-hidden">
        <Image
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/55 to-black/25"
        />
        <div className="relative z-10 flex min-h-[min(88dvh,920px)] flex-col justify-end px-5 pb-14 pt-28 sm:pb-20">
          <div className="mx-auto w-full max-w-5xl flash-fade-in">
            <p className="font-[family-name:var(--font-display)] text-6xl tracking-tight text-[var(--ink)] sm:text-7xl md:text-8xl">
              Flash
            </p>
            <h1 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
              {t.home.headline}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              {t.home.lead}
            </p>
            <FeatureChips />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/join"
                className="flash-btn flash-btn-primary px-6 py-3.5 text-base"
              >
                {t.home.startFree}
              </Link>
              <Link
                href="/about"
                className="flash-btn rounded-full border border-[var(--ink)]/15 bg-white/55 px-6 py-3.5 text-base text-[var(--ink)] backdrop-blur-sm hover:bg-white/80"
              >
                {t.home.whyFlash}
              </Link>
            </div>
          </div>
        </div>
      </section>

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
  );
}
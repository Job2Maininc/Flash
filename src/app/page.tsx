import { HomeIntroHeader } from "@/components/HomeIntroHeader";
import { CameraFooter } from "@/components/marketing/CameraFooter";
import { ClosingCta } from "@/components/marketing/ClosingCta";
import { FaqSection } from "@/components/marketing/FaqSection";
import { FeatureBlocks } from "@/components/marketing/FeatureBlocks";
import { HomeHero } from "@/components/marketing/HomeHero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Testimonials } from "@/components/marketing/Testimonials";
import { TrustSafety } from "@/components/marketing/TrustSafety";
import { Marquee } from "@/components/ui/Marquee";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { clearGuestCookie } from "@/lib/guest";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";

export default async function HomePage() {
  try {
    await clearGuestCookie();
  } catch {
    // Ignore cookie errors so the landing form still renders.
  }

  const t = getDictionary(await getLocale());

  const howSteps = t.home.steps.map((step, index) => ({
    title: step.title,
    body: step.body,
    frameLabel: t.home.howFrameLabels[index] ?? step.title,
  }));

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <HomeIntroHeader />
      <main id="main">
        <HomeHero portraits={HERO_PORTRAITS} />
        <Marquee items={t.home.marquee} />

        <HowItWorks
          eyebrow={t.home.howEyebrow}
          title={t.home.howTitle}
          lead={t.home.howLead}
          steps={howSteps}
        />

        <FeatureBlocks features={t.home.features} />

        <Testimonials
          eyebrow={t.home.socialEyebrow}
          title={t.home.socialTitle}
          quotes={t.home.testimonials}
        />

        <TrustSafety
          eyebrow={t.home.trustEyebrow}
          title={t.home.trustTitle}
          lead={t.home.trustLead}
          bullets={t.home.trustBullets}
        />

        <FaqSection
          eyebrow={t.home.faqEyebrow}
          title={t.home.faqTitle}
          items={t.home.faq}
        />

        <ClosingCta
          title={t.home.closingTitle}
          cta={t.nav.joinVideoChat}
          talkingSuffix={t.home.talkingSuffix}
        />

        <CameraFooter />
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { HomeIntroHeader } from "@/components/HomeIntroHeader";
import { CameraFooter } from "@/components/marketing/CameraFooter";
import { ClosingCta } from "@/components/marketing/ClosingCta";
import { CompareSection } from "@/components/marketing/CompareSection";
import { FaqJsonLd } from "@/components/marketing/FaqJsonLd";
import { FaqSection } from "@/components/marketing/FaqSection";
import { FeatureBlocks } from "@/components/marketing/FeatureBlocks";
import { HomeHero } from "@/components/marketing/HomeHero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MatchesSection } from "@/components/marketing/MatchesSection";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";
import { TrustSafety } from "@/components/marketing/TrustSafety";
import { Marquee } from "@/components/ui/Marquee";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const title = t.meta.titleDefault;
  const description = t.meta.description;

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/",
        de: "/",
        "x-default": "/",
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "de" ? ["en_US"] : ["de_DE"],
      type: "website",
      siteName: "Flash",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  // Keep the guest cookie so blocks/matches survive a visit to /.
  // New identity is created explicitly on /join via createGuest.

  const t = getDictionary(await getLocale());

  const howSteps = t.home.steps.map((step, index) => ({
    title: step.title,
    body: step.body,
    frameLabel: t.home.howFrameLabels[index] ?? step.title,
  }));

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <FaqJsonLd items={t.home.faq} />
      <NoiseOverlay />
      <HomeIntroHeader />
      <main
        id="main"
        className="max-md:pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0"
      >
        <HomeHero />
        <Marquee items={t.home.marquee} />

        <MatchesSection />

        <HowItWorks
          eyebrow={t.home.howEyebrow}
          title={t.home.howTitle}
          lead={t.home.howLead}
          steps={howSteps}
        />

        <FeatureBlocks features={t.home.features} />

        <CompareSection />

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

        <ClosingCta title={t.home.closingTitle} cta={t.join.startChat} />

        <CameraFooter />
      </main>
      <StickyMobileCta />
    </div>
  );
}

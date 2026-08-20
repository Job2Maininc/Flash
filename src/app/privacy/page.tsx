import Link from "next/link";
import type { Metadata } from "next";
import { CameraFooter } from "@/components/marketing/CameraFooter";
import { CameraHeader } from "@/components/marketing/CameraHeader";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
  };
}

export default async function PrivacyPage() {
  const t = getDictionary(await getLocale());

  return (
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <div className="h-16 pt-[env(safe-area-inset-top)]" />
      <CameraHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="cam-eyebrow text-[var(--key-400)]">{t.privacy.eyebrow}</p>
        <h1 className="cam-display-l mt-3">{t.privacy.title}</h1>
        <p className="cam-body-l mt-5 text-[var(--muted)]">{t.privacy.lead}</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-[var(--muted)]">
          <section className="space-y-3 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">{t.privacy.giveTitle}</h2>
            <p>{t.privacy.giveBody}</p>
          </section>
          <section className="space-y-3 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.privacy.videoTitle}
            </h2>
            <p>{t.privacy.videoBody}</p>
          </section>
          <section className="space-y-3 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.privacy.queueTitle}
            </h2>
            <p>{t.privacy.queueBody}</p>
          </section>
          <section className="space-y-3 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.privacy.controlTitle}
            </h2>
            <p>{t.privacy.controlBody}</p>
          </section>
        </div>

        <Link
          href="/safety"
          className="cam-footer-link mt-12 inline-flex text-sm text-[var(--key-400)]"
        >
          {t.privacy.safetyLink}
        </Link>
      </main>
      <CameraFooter />
    </div>
  );
}

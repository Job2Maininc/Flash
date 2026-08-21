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
    title: t.imprint.metaTitle,
    description: t.imprint.metaDescription,
  };
}

export default async function ImprintPage() {
  const t = getDictionary(await getLocale());

  return (
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <div className="h-16 pt-[env(safe-area-inset-top)]" />
      <CameraHeader />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="cam-eyebrow">{t.imprint.eyebrow}</p>
        <h1 className="cam-display-l mt-3">{t.imprint.title}</h1>
        <p className="cam-body-l mt-5 text-[var(--muted)]">{t.imprint.lead}</p>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-[var(--muted)]">
          <section className="space-y-2 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.imprint.providerTitle}
            </h2>
            <p className="font-medium text-[var(--cam-paper)]">[[NAME]]</p>
            <p>[[ANSCHRIFT]]</p>
            <p>
              {t.imprint.emailLabel}:{" "}
              <a
                className="text-[var(--key-400)] underline-offset-4 hover:underline"
                href="mailto:[[E-MAIL]]"
              >
                [[E-MAIL]]
              </a>
            </p>
            <p>
              {t.imprint.phoneLabel}: [[TELEFON]]
            </p>
            <p>{t.imprint.vatLabel}: [[USt-IdNr. falls vorhanden]]</p>
          </section>

          <section className="space-y-2 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.imprint.responsibleTitle}
            </h2>
            <p>[[VERANTWORTLICH NACH § 18 ABS. 2 MStV]]</p>
          </section>

          <section className="space-y-2 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.imprint.odrTitle}
            </h2>
            <p>{t.imprint.odrBody}</p>
            <p>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--key-400)] underline-offset-4 hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          <section className="space-y-2 border-t border-[var(--ink-700)] pt-6">
            <h2 className="cam-h2 text-[var(--cam-paper)]">
              {t.imprint.disputeTitle}
            </h2>
            <p>{t.imprint.disputeBody}</p>
          </section>
        </div>

        <Link
          href="/privacy"
          className="cam-footer-link mt-12 inline-flex text-sm text-[var(--cam-paper)]"
        >
          {t.nav.privacy} →
        </Link>
      </main>
      <CameraFooter />
    </div>
  );
}

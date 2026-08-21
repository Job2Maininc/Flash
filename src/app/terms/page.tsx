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
    title: t.terms.metaTitle,
    description: t.terms.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage() {
  const t = getDictionary(await getLocale());

  return (
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <div className="h-16 pt-[env(safe-area-inset-top)]" />
      <CameraHeader />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-[var(--warn)]/40 bg-[var(--warn)]/10 px-4 py-3 text-sm text-[var(--cam-paper)]"
        >
          {t.terms.draftNotice}
        </div>

        <p className="cam-eyebrow mt-8">{t.terms.eyebrow}</p>
        <h1 className="cam-display-l mt-3">{t.terms.title}</h1>
        <p className="cam-body-l mt-5 text-[var(--muted)]">{t.terms.lead}</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-[var(--muted)]">
          {t.terms.sections.map((section) => (
            <section
              key={section.title}
              className="space-y-3 border-t border-[var(--ink-700)] pt-6"
            >
              <h2 className="cam-h2 text-[var(--cam-paper)]">{section.title}</h2>
              <p className="whitespace-pre-line">{section.body}</p>
            </section>
          ))}
        </div>

        <Link
          href="/imprint"
          className="cam-footer-link mt-12 inline-flex text-sm text-[var(--cam-paper)]"
        >
          {t.footer.impressum} →
        </Link>
      </main>
      <CameraFooter />
    </div>
  );
}

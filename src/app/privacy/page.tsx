import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";
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
    <div className="relative min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-50" />
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          {t.privacy.eyebrow}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          {t.privacy.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
          {t.privacy.lead}
        </p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-[var(--ink-muted)]">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.privacy.giveTitle}
            </h2>
            <p>{t.privacy.giveBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.privacy.videoTitle}
            </h2>
            <p>{t.privacy.videoBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.privacy.queueTitle}
            </h2>
            <p>{t.privacy.queueBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.privacy.controlTitle}
            </h2>
            <p>{t.privacy.controlBody}</p>
          </section>
        </div>

        <Link
          href="/safety"
          className="mt-12 inline-flex text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
        >
          {t.privacy.safetyLink}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
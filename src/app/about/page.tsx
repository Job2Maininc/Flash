import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { localizedStockImages } from "@/lib/stock-images";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
  };
}

export default async function AboutPage() {
  const t = getDictionary(await getLocale());
  const images = localizedStockImages(t);

  return (
    <div className="relative min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-50" />
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          {t.about.eyebrow}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          {t.about.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
          {t.about.lead}
        </p>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden">
          <Image
            src={images.chemistry.src}
            alt={images.chemistry.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-[var(--ink-muted)]">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.about.promiseTitle}
            </h2>
            <p>{t.about.promiseBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.about.whoTitle}
            </h2>
            <p>{t.about.whoBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.about.notTitle}
            </h2>
            <p>{t.about.notBody}</p>
          </section>
        </div>

        <Link
          href="/join"
          className="flash-btn flash-btn-primary mt-12 inline-flex px-6 py-3.5"
        >
          {t.nav.joinVideoChat}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
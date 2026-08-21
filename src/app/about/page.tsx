import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CameraFooter } from "@/components/marketing/CameraFooter";
import { CameraHeader } from "@/components/marketing/CameraHeader";
import { Button } from "@/components/ui/Button";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
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
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <div className="h-16 pt-[env(safe-area-inset-top)]" />
      <CameraHeader />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="cam-eyebrow text-[var(--faint)]">{t.about.eyebrow}</p>
        <h1 className="cam-display-l mt-3">{t.about.title}</h1>
        <p className="cam-body-l mt-5 text-[var(--muted)] text-pretty">
          {t.about.lead}
        </p>

        <div className="relative mt-10 max-h-[60vh] overflow-hidden rounded-[var(--radius-xl)]">
          <div className="relative aspect-[5/4] max-h-[60vh] w-full">
            <Image
              src={images.chemistry.src}
              alt={images.chemistry.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-[var(--muted)]">
          <section className="space-y-3">
            <h2 className="cam-h2 text-[var(--cam-paper)]">{t.about.promiseTitle}</h2>
            <p className="text-pretty">{t.about.promiseBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="cam-h2 text-[var(--cam-paper)]">{t.about.whoTitle}</h2>
            <p className="text-pretty">{t.about.whoBody}</p>
          </section>
          <section className="space-y-3">
            <h2 className="cam-h2 text-[var(--cam-paper)]">{t.about.notTitle}</h2>
            <p className="text-pretty">{t.about.notBody}</p>
          </section>
        </div>

        <Link href="/join" className="mt-12 inline-flex">
          <Button size="lg">{t.join.startChat}</Button>
        </Link>
      </main>
      <CameraFooter />
    </div>
  );
}

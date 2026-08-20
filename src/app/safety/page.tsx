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
    title: t.safety.metaTitle,
    description: t.safety.metaDescription,
  };
}

export default async function SafetyPage() {
  const t = getDictionary(await getLocale());
  const images = localizedStockImages(t);

  return (
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <NoiseOverlay />
      <div className="h-16 pt-[env(safe-area-inset-top)]" />
      <CameraHeader />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="cam-eyebrow text-[var(--key-400)]">{t.safety.eyebrow}</p>
        <h1 className="cam-display-l mt-3">{t.safety.title}</h1>
        <p className="cam-body-l mt-5 text-[var(--muted)]">{t.safety.lead}</p>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)]">
          <Image
            src={images.safety.src}
            alt={images.safety.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <ul className="mt-12 space-y-8">
          {t.safety.tips.map((tip) => (
            <li
              key={tip.title}
              className="border-t border-[var(--ink-700)] pt-6"
            >
              <h2 className="cam-h2 text-[var(--cam-paper)]">{tip.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">
                {tip.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm leading-relaxed text-[var(--faint)]">
          {t.safety.emergency}
        </p>

        <Link href="/join" className="mt-10 inline-flex">
          <Button size="lg">{t.safety.cta}</Button>
        </Link>
      </main>
      <CameraFooter />
    </div>
  );
}

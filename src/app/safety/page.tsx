import Link from "next/link";
import type { Metadata } from "next";
import { CameraFooter } from "@/components/marketing/CameraFooter";
import { CameraHeader } from "@/components/marketing/CameraHeader";
import { Button } from "@/components/ui/Button";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.safety.metaTitle,
    description: t.safety.metaDescription,
  };
}

/** Typography-only safety page — no photography, no motion chrome. */
export default async function SafetyPage() {
  const t = getDictionary(await getLocale());

  return (
    <div className="relative min-h-dvh bg-[var(--ink-800)] text-[var(--cam-paper)]">
      <div className="h-16 pt-[env(safe-area-inset-top)]" />
      <CameraHeader />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="cam-eyebrow text-[var(--faint)]">{t.safety.eyebrow}</p>
        <h1 className="cam-display-l mt-3">{t.safety.title}</h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
          {t.safety.lead}
        </p>

        <ul className="mt-14 space-y-10">
          {t.safety.tips.map((tip) => (
            <li
              key={tip.title}
              className="border-t border-[var(--ink-600)] pt-8"
            >
              <h2 className="font-[family-name:var(--font-camera-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)]">
                {tip.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--muted)] text-pretty">
                {tip.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-sm leading-relaxed text-[var(--faint)] text-pretty">
          {t.safety.emergency}
        </p>

        <Link href="/join" className="mt-12 inline-flex">
          <Button size="lg">{t.safety.cta}</Button>
        </Link>
      </main>
      <CameraFooter />
    </div>
  );
}

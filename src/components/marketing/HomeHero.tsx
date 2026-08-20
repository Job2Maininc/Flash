"use client";

import Link from "next/link";
import { LiveGrid, type GridPortrait } from "@/components/marketing/LiveGrid";
import { Button } from "@/components/ui/Button";
import { Spotlight } from "@/components/ui/Spotlight";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  portraits: GridPortrait[];
};

export function HomeHero({ portraits }: Props) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden px-5 pb-6 pt-[4.75rem] sm:pb-8 sm:pt-24 lg:min-h-[calc(100dvh-4rem)] lg:pb-8">
      <div
        aria-hidden
        className="cam-spill pointer-events-none absolute inset-x-0 top-0 h-[42vh]"
      />
      <Spotlight />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10 lg:pt-2">
        <div className="max-w-xl lg:pt-4">
          <p className="cam-eyebrow text-[var(--faint)]">{t.home.heroEyebrow}</p>
          <h1 className="cam-display-xl mt-3 text-[var(--cam-paper)]">
            {t.home.heroHeadline}
          </h1>
          <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-[var(--muted)] sm:mt-4 sm:text-lg">
            {t.home.heroLead}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
            <Link href="/join">
              <Button size="lg">{t.home.startFree}</Button>
            </Link>
            <a href="/#how-it-works">
              <Button variant="secondary" size="lg">
                {t.home.seeHow}
              </Button>
            </a>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--faint)] sm:mt-5">
            <li className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--live)]"
                aria-hidden
              />
              {t.home.trustLive}
            </li>
            <li>{t.home.trustVerified}</li>
            <li>{t.home.trustNoAds}</li>
            <li>{t.home.trustAge}</li>
          </ul>
        </div>

        <LiveGrid
          portraits={portraits}
          talkingSuffix={t.home.talkingSuffix}
          className="-mt-1 lg:mt-0 lg:min-h-0"
        />
      </div>
    </section>
  );
}

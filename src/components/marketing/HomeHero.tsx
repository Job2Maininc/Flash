"use client";

import Link from "next/link";
import { LiveGrid, type GridPortrait } from "@/components/marketing/LiveGrid";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Spotlight } from "@/components/ui/Spotlight";
import { useI18n } from "@/components/LocaleProvider";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { shouldShowLiveCount } from "@/lib/live-count";

type Props = {
  portraits: GridPortrait[];
};

export function HomeHero({ portraits }: Props) {
  const { t } = useI18n();
  const online = useOnlineCount();
  const showLive = shouldShowLiveCount(online);
  const h = t.home.heroParts;

  return (
    <section className="relative overflow-hidden px-5 pb-6 pt-[4.75rem] sm:pb-8 sm:pt-24 max-md:min-h-[100dvh] lg:min-h-[calc(100dvh-4rem)] lg:pb-8">
      <div
        aria-hidden
        className="cam-spill pointer-events-none absolute inset-x-0 top-0 h-[42dvh]"
      />
      <Spotlight />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10 lg:pt-2">
        <div className="max-w-xl lg:pt-4">
          <p className="cam-eyebrow text-[var(--faint)]">{t.home.heroEyebrow}</p>
          <h1 className="cam-display-xl cam-balance mt-3 max-md:text-[2.75rem] text-[var(--cam-paper)]">
            {h.before}{" "}
            <span className="cam-emph">{h.emph1}</span>{" "}
            {h.mid}{" "}
            <span className="cam-emph">{h.emph2}</span>
          </h1>
          <p className="cam-body mt-3 max-w-md text-[var(--muted)] sm:mt-4">
            {t.home.heroLead}
          </p>

          <div
            data-sticky-hero-cta
            className="mt-5 flex w-full flex-col gap-3 md:mt-6 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-3"
          >
            <Link href="/join" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto">
                {t.home.startFree}
              </Button>
            </Link>
            <a
              href="/#how-it-works"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-transparent px-7 text-base text-[var(--muted)] transition-[border-color,color,transform] duration-[var(--dur-fast)] active:scale-[.97] md:w-auto"
            >
              {t.home.seeHow}
            </a>
          </div>

          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--faint)] sm:mt-5">
            {showLive ? (
              <li className="inline-flex items-center gap-2 whitespace-nowrap">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--live)]"
                  aria-hidden
                />
                <span className="tabular-nums">
                  <CountUp value={online ?? 0} />
                </span>{" "}
                {t.home.talkingSuffix}
              </li>
            ) : (
              <li className="whitespace-nowrap text-[var(--faint)]">
                {t.home.beTheFirst}
              </li>
            )}
            <li>{t.home.trustNoAds}</li>
            <li>{t.home.trustAge}</li>
          </ul>
        </div>

        <LiveGrid
          portraits={portraits}
          className="-mt-1 lg:mt-0 lg:min-h-0"
        />
      </div>
    </section>
  );
}

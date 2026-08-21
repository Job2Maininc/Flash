"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroPrefChips } from "@/components/marketing/HeroPrefChips";
import { HeroPreviewFrame } from "@/components/marketing/HeroPreviewFrame";
import { PresenceLine } from "@/components/marketing/PresenceLine";
import { Button } from "@/components/ui/Button";
import { Spotlight } from "@/components/ui/Spotlight";
import { useI18n } from "@/components/LocaleProvider";
import {
  buildJoinHref,
  prefGenderToSex,
  prefSeekingToLooking,
  readHeroPrefs,
} from "@/lib/hero-prefs";
import type { LookingFor, Sex } from "@/lib/types";

export function HomeHero() {
  const { t } = useI18n();
  const h = t.home.heroParts;
  const [sex, setSex] = useState<Sex | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");

  useEffect(() => {
    const prefs = readHeroPrefs();
    const g = prefGenderToSex(prefs.g);
    const s = prefSeekingToLooking(prefs.seeking);
    if (g) setSex(g);
    if (s) setLookingFor(s);
  }, []);

  const joinHref = buildJoinHref({ sex, lookingFor });

  return (
    <section className="relative overflow-hidden px-5 pb-6 pt-[4.75rem] sm:pb-8 sm:pt-24 max-md:min-h-[100dvh] lg:min-h-[calc(100dvh-4rem)] lg:pb-8">
      <div
        aria-hidden
        className="cam-spill pointer-events-none absolute inset-x-0 top-0 h-[42dvh]"
      />
      <Spotlight />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-12 lg:gap-y-4 lg:pt-2">
        <div className="max-w-xl lg:pt-4">
          <p className="cam-eyebrow">{t.home.heroEyebrow}</p>
          <h1 className="cam-display-xl cam-balance mt-3 max-md:text-[2.75rem] text-[var(--cam-paper)]">
            <span className="block">
              {h.before}{" "}
              <span className="cam-emph">{h.emph1}</span>
            </span>
            <span className="block">
              {h.mid}{" "}
              <span className="cam-emph">{h.emph2}</span>
            </span>
          </h1>
          <p className="cam-body mt-3 max-w-md text-[var(--muted)] sm:mt-4">
            {t.home.heroLead}
          </p>

          <HeroPrefChips
            sex={sex}
            lookingFor={lookingFor}
            onSexChange={setSex}
            onLookingChange={setLookingFor}
          />

          <div
            data-sticky-hero-cta
            className="mt-5 flex w-full flex-col gap-3 md:mt-6 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-3"
          >
            <Link href={joinHref} className="w-full md:w-auto">
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
        </div>

        <HeroPreviewFrame className="lg:row-span-2 lg:justify-self-end" />

        <div className="max-w-xl">
          <PresenceLine />
          <p className="mt-2 text-[13px] font-medium text-[var(--muted)]">
            {t.home.trustNoAds}
            <span aria-hidden className="mx-2 text-[var(--faint)]">
              ·
            </span>
            {t.home.trustAge}
            <span aria-hidden className="mx-2 text-[var(--faint)]">
              ·
            </span>
            {t.home.trustFreeStart}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { LiveBadge } from "@/components/ui/Badge";
import { useI18n } from "@/components/LocaleProvider";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
import { shouldShowLiveCount } from "@/lib/live-count";

type Props = {
  title: string;
  cta: string;
  talkingSuffix: string;
};

export function ClosingCta({ title, cta, talkingSuffix }: Props) {
  const { t } = useI18n();
  const online = useOnlineCount();
  const count = online ?? 0;
  const showLive = shouldShowLiveCount(online);
  const echoes = HERO_PORTRAITS.slice(0, 2);

  return (
    <section className="relative flex min-h-[min(88dvh,860px)] items-center justify-center overflow-hidden border-t border-[var(--ink-700)] px-5 py-[clamp(72px,10vw,160px)]">
      <div aria-hidden className="cam-spill pointer-events-none absolute inset-0" />
      {echoes.map((tile, i) => (
        <div
          key={tile.src}
          aria-hidden
          className="cam-echo-tile pointer-events-none absolute aspect-[3/4] w-[18vw] max-w-40 overflow-hidden rounded-[var(--radius-xl)] opacity-25 max-md:blur-sm md:blur-md"
          style={{
            left: `${18 + i * 42}%`,
            top: `${22 + (i % 2) * 24}%`,
            animationDelay: `${i * 0.8}s`,
            backgroundImage: `url(${tile.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="cam-display-xl max-md:text-[2.5rem] text-[var(--cam-paper)]">
          {title}
        </h2>
        <Link href="/join" className="mt-10" data-sticky-closing-cta>
          <Button size="lg">{cta}</Button>
        </Link>
        <div className="mt-8">
          {showLive ? (
            <LiveBadge
              label={
                <>
                  <CountUp value={count} /> {talkingSuffix}
                </>
              }
            />
          ) : (
            <p className="font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--faint)]">
              {t.home.beTheFirst}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useI18n } from "@/components/LocaleProvider";

type Props = {
  onlineCount: number | null;
};

export function JoinStage({ onlineCount }: Props) {
  const { t } = useI18n();
  const display =
    onlineCount === null ? "—" : new Intl.NumberFormat().format(onlineCount);

  return (
    <div className="relative min-h-[min(58dvh,640px)] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(ellipse_at_center,_#2c2418_0%,_#0c0a08_62%)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:min-h-[min(62dvh,720px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] flash-grain"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl">
          Flash
        </p>
        <p
          className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold tabular-nums tracking-tight text-[var(--accent)] sm:text-5xl"
          aria-live="polite"
        >
          {display}
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/55">
          {t.join.peopleOnline}
        </p>
      </div>
    </div>
  );
}

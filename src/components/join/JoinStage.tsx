"use client";

import { useI18n } from "@/components/LocaleProvider";
import { LiveBadge } from "@/components/ui/Badge";
import { shouldShowLiveCount } from "@/lib/live-count";

type Props = {
  onlineCount: number | null;
};

export function JoinStage({ onlineCount }: Props) {
  const { t } = useI18n();
  const showLive = shouldShowLiveCount(onlineCount);
  const count = onlineCount ?? 0;
  const peopleLabel =
    count === 1 ? t.join.personOnline : t.join.peopleOnline;

  return (
    <div className="relative min-h-[min(52dvh,560px)] w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--ink-600)] bg-[var(--ink-800)] shadow-[var(--elev-2),var(--glow-key)] sm:min-h-[min(56dvh,640px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] cam-spill"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[var(--radius-xl)] opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,122,69,0.22), transparent 62%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-[family-name:var(--font-camera-display)] text-6xl font-bold tracking-tight text-[var(--cam-paper)] sm:text-7xl md:text-8xl">
          Flash
        </p>
        <div className="mt-6 flex flex-col items-center gap-2">
          {showLive ? (
            <LiveBadge
              label={
                <span>
                  <span className="tabular-nums">
                    {new Intl.NumberFormat().format(count)}
                  </span>{" "}
                  <span className="font-normal opacity-80">{peopleLabel}</span>
                </span>
              }
            />
          ) : (
            <p className="font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--faint)]">
              {t.join.beTheFirst}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

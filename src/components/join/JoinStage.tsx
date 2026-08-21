"use client";

import { useI18n } from "@/components/LocaleProvider";
import { LiveBadge } from "@/components/ui/Badge";
import { shouldShowLiveCount } from "@/lib/live-count";

type Props = {
  onlineCount: number | null;
};

/**
 * Pre-join stage — calm trust frame without getUserMedia.
 * Live camera preview needs explicit approval (touches media pipeline).
 */
export function JoinStage({ onlineCount }: Props) {
  const { t } = useI18n();
  const showLive = shouldShowLiveCount(onlineCount);
  const count = onlineCount ?? 0;
  const peopleLabel =
    count === 1 ? t.join.personOnline : t.join.peopleOnline;

  return (
    <div className="relative min-h-[min(45dvh,420px)] w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--ink-600)] bg-[var(--ink-800)] shadow-[var(--elev-2)] sm:min-h-[min(46dvh,480px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(255,67,38,0.14), transparent 62%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--ink-600)] bg-[var(--ink-900)]/70 shadow-[var(--elev-1)]"
        >
          <svg
            className="h-8 w-8 text-[var(--faint)]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="3"
              y="6"
              width="14"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M17 10l4-2v8l-4-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="font-[family-name:var(--font-camera-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)] sm:text-3xl">
            {t.join.previewTitle}
          </p>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[var(--muted)] text-pretty">
            {t.join.previewBody}
          </p>
        </div>

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
  );
}

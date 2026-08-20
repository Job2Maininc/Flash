"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { FlashLogo } from "@/components/FlashLogo";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  peerNickname: string | null;
  onComplete: () => void;
};

const BURSTS = Array.from({ length: 12 }, (_, i) => i);

export function MatchCelebration({ peerNickname, onComplete }: Props) {
  const { t } = useI18n();
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 2600);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink-900)]/75 backdrop-blur-lg flash-match-overlay"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {BURSTS.map((i) => (
          <span
            key={i}
            className="flash-match-particle absolute left-1/2 top-1/2 text-2xl"
            style={
              {
                animationDelay: `${i * 0.05}s`,
                "--flash-angle": `${i * 30}deg`,
              } as CSSProperties
            }
          >
            {i % 3 === 0 ? "♥" : "⚡"}
          </span>
        ))}
      </div>

      <div className="flash-match-pop relative z-10 flex scale-100 flex-col items-center gap-4 px-8 text-center opacity-100 transition-[transform,opacity] duration-[240ms] ease-[var(--ease-out)]">
        <FlashLogo size={64} glow="strong" />
        <p className="font-[family-name:var(--font-camera-display)] text-5xl tracking-tight text-[var(--key-400)] sm:text-6xl">
          Match
        </p>
        {peerNickname ? (
          <p className="text-lg text-[var(--cam-paper)]/90">
            {t.celebration.with}{" "}
            <span className="font-[family-name:var(--font-camera-display)] text-2xl text-[var(--cam-paper)]">
              {peerNickname}
            </span>
          </p>
        ) : null}
        <p className="text-sm text-[var(--cam-paper)]/55">
          {t.celebration.findInMatches}
        </p>
      </div>
    </div>
  );
}

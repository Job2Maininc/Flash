"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { FlashLogo } from "@/components/FlashLogo";

type Props = {
  peerNickname: string | null;
  onComplete: () => void;
};

const BURSTS = Array.from({ length: 12 }, (_, i) => i);

export function MatchCelebration({ peerNickname, onComplete }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 2600);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg flash-match-overlay"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {BURSTS.map((i) => (
          <span
            key={i}
            className="flash-match-particle absolute left-1/2 top-1/2 text-2xl"
            style={{
              animationDelay: `${i * 0.05}s`,
              "--flash-angle": `${i * 30}deg`,
            } as CSSProperties}
          >
            {i % 3 === 0 ? "♥" : "⚡"}
          </span>
        ))}
      </div>

      <div className="flash-match-pop relative z-10 flex flex-col items-center gap-4 px-8 text-center">
        <FlashLogo size={64} glow="strong" />
        <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--accent)] sm:text-6xl">
          Match
        </p>
        {peerNickname ? (
          <p className="text-lg text-white/90">
            avec{" "}
            <span className="font-[family-name:var(--font-display)] text-2xl text-white">
              {peerNickname}
            </span>
          </p>
        ) : null}
        <p className="text-sm text-white/55">Retrouve-les dans Matches</p>
      </div>
    </div>
  );
}

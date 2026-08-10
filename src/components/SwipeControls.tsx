"use client";

import { hapticTap } from "@/lib/haptics";

type Props = {
  disabled?: boolean;
  myVote: "left" | "right" | null;
  onSwipe: (direction: "left" | "right") => void;
};

export function SwipeControls({ disabled, myVote, onSwipe }: Props) {
  function swipeLeft() {
    hapticTap();
    onSwipe("left");
  }

  function swipeRight() {
    hapticTap();
    onSwipe("right");
  }

  const leftVoted = myVote === "left";
  const rightVoted = myVote === "right";

  return (
    <div className="pointer-events-auto flex w-full items-center justify-center gap-8 px-6 pb-2 pt-3 safe-bottom">
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={disabled || leftVoted}
          onClick={swipeLeft}
          className={`flash-btn relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl shadow-lg backdrop-blur-md sm:h-16 sm:w-16 ${
            leftVoted
              ? "border-white/15 bg-white/10 text-white/40"
              : "border-white/25 bg-black/50 text-white enabled:hover:border-white/50 enabled:hover:bg-black/65"
          }`}
          aria-label="Passer"
        >
          ✕
          {leftVoted ? (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]"
              aria-hidden
            >
              ✓
            </span>
          ) : null}
        </button>
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/45">
          Passer
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={disabled || rightVoted}
          onClick={swipeRight}
          className={`flash-btn relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl sm:h-16 sm:w-16 ${
            rightVoted
              ? "border-[var(--accent)]/50 bg-[var(--accent)]/25 text-[var(--accent)]/60 shadow-none"
              : "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)] shadow-[0_0_28px_rgba(232,255,74,0.4)] enabled:hover:brightness-105"
          }`}
          aria-label="Matcher"
        >
          ♥
          {rightVoted ? (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] text-[var(--ink)]"
              aria-hidden
            >
              ✓
            </span>
          ) : null}
        </button>
        <span
          className={`text-[10px] font-medium uppercase tracking-widest ${
            rightVoted ? "text-[var(--accent)]/50" : "text-[var(--accent)]/70"
          }`}
        >
          Like
        </span>
      </div>
    </div>
  );
}

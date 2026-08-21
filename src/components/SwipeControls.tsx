"use client";

import { hapticTap } from "@/lib/haptics";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

type Props = {
  disabled?: boolean;
  myVote: "left" | "right" | null;
  onSwipe: (direction: "left" | "right") => void;
};

export function SwipeControls({ disabled, myVote, onSwipe }: Props) {
  const { t } = useI18n();

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
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl shadow-[var(--elev-1)] backdrop-blur-md sm:h-16 sm:w-16",
            "transition-[border-color,background-color,transform] duration-[var(--dur-fast)] active:scale-[.97]",
            leftVoted
              ? "border-[var(--ink-600)] bg-[var(--ink-800)] text-[var(--cam-paper)]/40"
              : "border-[var(--ink-600)] bg-[var(--ink-900)]/70 text-[var(--cam-paper)] enabled:hover:border-[var(--ink-700)] enabled:hover:bg-[var(--ink-800)]",
          )}
          aria-label={t.call.pass}
        >
          ✕
          {leftVoted ? (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ink-600)] text-[10px]"
              aria-hidden
            >
              ✓
            </span>
          ) : null}
        </button>
        <span className="text-[10px] font-medium text-[var(--cam-paper)]/45">
          {t.call.pass}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={disabled || rightVoted}
          onClick={swipeRight}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl sm:h-16 sm:w-16",
            "transition-[border-color,background-color,box-shadow,transform] duration-[var(--dur-fast)] active:scale-[.97]",
            rightVoted
              ? "border-[var(--key-500)]/50 bg-[var(--key-500)]/25 text-[var(--key-400)]/60 shadow-none"
              : "border-[var(--key-500)] bg-[var(--key-500)] text-[var(--paper)] shadow-[var(--glow-key)] enabled:hover:brightness-105",
          )}
          aria-label={t.call.match}
        >
          ♥
          {rightVoted ? (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--key-500)] text-[10px] text-[var(--paper)]"
              aria-hidden
            >
              ✓
            </span>
          ) : null}
        </button>
        <span
          className={cn(
            "text-[10px] font-medium",
            rightVoted ? "text-[var(--key-400)]/50" : "text-[var(--key-400)]/70",
          )}
        >
          {t.call.like}
        </span>
      </div>
    </div>
  );
}

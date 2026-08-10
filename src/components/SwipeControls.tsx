"use client";

type Props = {
  disabled?: boolean;
  myVote: "left" | "right" | null;
  onSwipe: (direction: "left" | "right") => void;
};

export function SwipeControls({ disabled, myVote, onSwipe }: Props) {
  return (
    <div className="pointer-events-auto flex w-full items-center justify-center gap-8 px-6 pb-2 pt-3 safe-bottom">
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={disabled || myVote === "left"}
          onClick={() => onSwipe("left")}
          className="flash-btn flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/25 bg-black/50 text-2xl text-white shadow-lg backdrop-blur-md enabled:hover:border-white/50 enabled:hover:bg-black/65 sm:h-16 sm:w-16"
          aria-label="Passer"
        >
          ✕
        </button>
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/45">
          Passer
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={disabled || myVote === "right"}
          onClick={() => onSwipe("right")}
          className="flash-btn flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] text-2xl text-[var(--ink)] shadow-[0_0_28px_rgba(232,255,74,0.4)] enabled:hover:brightness-105 sm:h-16 sm:w-16"
          aria-label="Matcher"
        >
          ♥
        </button>
        <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--accent)]/70">
          Like
        </span>
      </div>
    </div>
  );
}

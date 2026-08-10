"use client";

type Props = {
  disabled?: boolean;
  myVote: "left" | "right" | null;
  onSwipe: (direction: "left" | "right") => void;
};

export function SwipeControls({ disabled, myVote, onSwipe }: Props) {
  return (
    <div className="pointer-events-auto flex w-full items-center justify-center gap-6 px-6 pb-8 pt-4">
      <button
        type="button"
        disabled={disabled || myVote === "left"}
        onClick={() => onSwipe("left")}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 bg-black/40 text-2xl text-white backdrop-blur-sm transition enabled:active:scale-95 disabled:opacity-40"
        aria-label="Passer"
      >
        ✕
      </button>
      <button
        type="button"
        disabled={disabled || myVote === "right"}
        onClick={() => onSwipe("right")}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] text-2xl text-[var(--ink)] transition enabled:active:scale-95 disabled:opacity-40"
        aria-label="Matcher"
      >
        ♥
      </button>
    </div>
  );
}

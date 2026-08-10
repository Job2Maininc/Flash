"use client";

import type { ReactNode } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

type Props = {
  children: ReactNode;
  enabled?: boolean;
  canSwipeLeft?: boolean;
  canSwipeRight?: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export function SwipeSurface({
  children,
  enabled = true,
  canSwipeLeft = true,
  canSwipeRight = true,
  onSwipeLeft,
  onSwipeRight,
}: Props) {
  const { offsetX, dragging, handlers } = useSwipeGesture({
    enabled,
    onSwipeLeft: () => {
      if (canSwipeLeft) onSwipeLeft();
    },
    onSwipeRight: () => {
      if (canSwipeRight) onSwipeRight();
    },
  });

  const progress = Math.min(Math.abs(offsetX) / 120, 1);
  const swipeRight = offsetX > 0;
  const swipeLeft = offsetX < 0;

  return (
    <div className="absolute inset-0 h-full w-full min-h-0">
      <div className="absolute inset-0 h-full w-full min-h-0">{children}</div>

      <div
        className="absolute inset-0 z-10 touch-none select-none"
        style={{ touchAction: "none" }}
        {...handlers}
      >
        {dragging && swipeRight && canSwipeRight ? (
          <div
            className="pointer-events-none absolute inset-0 bg-[var(--accent)]/25"
            style={{ opacity: progress }}
          />
        ) : null}

        {dragging && swipeLeft && canSwipeLeft ? (
          <div
            className="pointer-events-none absolute inset-0 bg-[var(--danger)]/25"
            style={{ opacity: progress }}
          />
        ) : null}

        {dragging && swipeRight && canSwipeRight ? (
          <div
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 rounded-full border-4 border-[var(--accent)] bg-black/30 px-5 py-2.5 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)] shadow-[0_0_24px_rgba(232,255,74,0.35)] backdrop-blur-sm"
            style={{ opacity: progress }}
          >
            ♥
          </div>
        ) : null}

        {dragging && swipeLeft && canSwipeLeft ? (
          <div
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 rounded-full border-4 border-[var(--danger)] bg-black/30 px-5 py-2.5 text-2xl text-[var(--danger)] backdrop-blur-sm"
            style={{ opacity: progress }}
          >
            ✕
          </div>
        ) : null}
      </div>
    </div>
  );
}

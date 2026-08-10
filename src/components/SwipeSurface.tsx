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
    <div
      className="absolute inset-0 touch-none select-none"
      style={{ touchAction: "none" }}
      {...handlers}
    >
      <div
        className={dragging ? "" : "transition-transform duration-200 ease-out"}
        style={{
          transform: dragging
            ? `translateX(${offsetX}px) rotate(${offsetX * 0.04}deg)`
            : "translateX(0) rotate(0)",
        }}
      >
        {children}
      </div>

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
          className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rounded-full border-4 border-[var(--accent)] px-4 py-2 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)]"
          style={{ opacity: progress }}
        >
          ♥
        </div>
      ) : null}

      {dragging && swipeLeft && canSwipeLeft ? (
        <div
          className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 rounded-full border-4 border-[var(--danger)] px-4 py-2 text-2xl text-[var(--danger)]"
          style={{ opacity: progress }}
        >
          ✕
        </div>
      ) : null}
    </div>
  );
}

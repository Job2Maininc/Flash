import { useCallback, useRef, useState } from "react";
import { hapticTap } from "@/lib/haptics";

type Options = {
  enabled?: boolean;
  threshold?: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export function useSwipeGesture({
  enabled = true,
  threshold = 80,
  onSwipeLeft,
  onSwipeRight,
}: Options) {
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const axis = useRef<"x" | "y" | null>(null);

  const reset = useCallback(() => {
    start.current = null;
    axis.current = null;
    setOffsetX(0);
    setDragging(false);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      start.current = { x: e.clientX, y: e.clientY };
      axis.current = null;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled || !start.current) return;

      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      if (!axis.current) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }

      if (axis.current === "y") return;
      setOffsetX(dx);
    },
    [enabled],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled || !start.current) {
        reset();
        return;
      }

      const dx = e.clientX - start.current.x;

      if (axis.current === "x") {
        if (dx >= threshold) {
          hapticTap();
          onSwipeRight();
        } else if (dx <= -threshold) {
          hapticTap();
          onSwipeLeft();
        }
      }

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      reset();
    },
    [enabled, onSwipeLeft, onSwipeRight, reset, threshold],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      reset();
    },
    [reset],
  );

  return {
    offsetX,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  };
}

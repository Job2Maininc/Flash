"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

const HIDE_MS = 4000;

/**
 * Auto-hides call chrome after inactivity.
 * Touch: show on any tap; fade after 4s. Does not rely on hover.
 */
export function CallControlBar({ children, className }: Props) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  const bump = useCallback(() => {
    setVisible(true);
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    if (reduceMotion) return;
    timerRef.current = window.setTimeout(() => setVisible(false), HIDE_MS);
  }, [reduceMotion]);

  useEffect(() => {
    bump();
    const onPointer = () => bump();
    const onKey = () => bump();
    // pointerdown covers touch + mouse; skip continuous pointermove (hover).
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, [bump]);

  return (
    <div
      className={cn(
        "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        className,
      )}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

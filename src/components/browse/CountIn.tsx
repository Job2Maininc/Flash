"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  active: boolean;
};

/** Brief 3-2-1 overlay when a call becomes ready — visual only. */
export function CountIn({ active }: Props) {
  const reduceMotion = useReducedMotion();
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!active || reduceMotion) {
      setN(null);
      return;
    }
    setN(3);
    let current = 3;
    const id = window.setInterval(() => {
      current -= 1;
      if (current <= 0) {
        window.clearInterval(id);
        setN(null);
        return;
      }
      setN(current);
    }, 700);
    return () => {
      window.clearInterval(id);
      setN(null);
    };
  }, [active, reduceMotion]);

  if (n == null) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
      aria-hidden
    >
      <span
        key={n}
        className="cam-count-in font-[family-name:var(--font-camera-display)] text-7xl font-bold text-[var(--cam-paper)] drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)] sm:text-8xl"
      >
        {n}
      </span>
    </div>
  );
}

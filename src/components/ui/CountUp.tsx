"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  className?: string;
  durationMs?: number;
};

export function CountUp({ value, className, durationMs = 900 }: Props) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const startValue = 0;
    const endValue = value;
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(startValue + (endValue - startValue) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduced]);

  return (
    <span className={cn("tabular-nums", className)}>
      {new Intl.NumberFormat().format(display)}
    </span>
  );
}

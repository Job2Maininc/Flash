"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  className?: string;
};

/** Infinite CSS marquee — static when reduced motion is preferred. */
export function Marquee({ items, className }: Props) {
  const reduced = useReducedMotion();
  const row = reduced ? items : [...items, ...items];

  return (
    <div
      className={cn(
        "cam-marquee relative overflow-hidden border-y border-[var(--ink-700)] bg-[var(--ink-900)] py-3.5",
        className,
      )}
      data-static={reduced ? "true" : undefined}
    >
      <div
        className={cn(
          "flex gap-10 whitespace-nowrap",
          reduced ? "w-full flex-wrap justify-center px-5" : "cam-marquee-track w-max will-change-transform",
        )}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-[0.14em] text-[var(--faint)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

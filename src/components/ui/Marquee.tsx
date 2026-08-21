"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  className?: string;
};

/** Infinite CSS marquee — cities only; static when reduced motion is preferred. */
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
          reduced
            ? "w-full flex-wrap justify-center px-5"
            : "cam-marquee-track w-max will-change-transform",
        )}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-[family-name:var(--font-body)] text-[13px] font-medium tracking-normal text-[var(--muted)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  className?: string;
};

/** Infinite CSS marquee — pauses on hover. */
export function Marquee({ items, className }: Props) {
  const row = [...items, ...items];

  return (
    <div
      className={cn(
        "cam-marquee relative overflow-hidden border-y border-[var(--ink-700)] bg-[var(--ink-900)] py-3.5",
        className,
      )}
    >
      <div className="cam-marquee-track flex w-max gap-10 whitespace-nowrap will-change-transform">
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

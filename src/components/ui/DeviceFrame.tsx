import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  label?: string;
};

/** Lightweight device frame — not a stock iPhone PNG. */
export function DeviceFrame({ children, className, label }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--ink-600)] bg-[var(--ink-800)] p-2 shadow-[var(--elev-2)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-[rgba(251,243,236,.12)]"
      />
      <div className="relative aspect-[9/16] overflow-hidden rounded-[calc(var(--radius-xl)-6px)] bg-[var(--ink-900)]">
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40"
        />
      </div>
      {label ? (
        <p className="cam-eyebrow mt-3 px-1 text-center text-[var(--faint)]">
          {label}
        </p>
      ) : null}
    </div>
  );
}

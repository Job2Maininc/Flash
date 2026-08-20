import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  label?: string;
};

/** Lightweight device frame — lit screen with inner highlight + soft reflection. */
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
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-[rgba(251,243,236,.14)]"
      />
      <div className="relative aspect-[9/16] overflow-hidden rounded-[calc(var(--radius-xl)-6px)] bg-[var(--ink-900)] ring-1 ring-inset ring-[rgba(251,243,236,.1)]">
        {children}
        {/* Soft screen reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(251,243,236,.14)_0%,transparent_42%,transparent_100%)]"
        />
        {/* 1px inner highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[calc(var(--radius-xl)-6px)] shadow-[inset_0_0_0_1px_rgba(251,243,236,.08)]"
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

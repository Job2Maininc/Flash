import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

/** Vertical join field: label above, faint SVG icon, full-width control. */
export function JoinField({ label, children, icon, className }: Props) {
  return (
    <label className={cn("flex w-full flex-col gap-1.5", className)}>
      <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
        {label}
      </span>
      <span className="relative flex min-h-14 items-center gap-3 rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-800)] px-3.5 transition-[border-color] duration-[var(--dur-fast)] focus-within:border-[var(--key-500)]/55">
        {icon ? (
          <span className="shrink-0 text-[var(--faint)]" aria-hidden>
            {icon}
          </span>
        ) : null}
        {children}
      </span>
    </label>
  );
}

export function JoinFieldIcon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {children}
    </svg>
  );
}

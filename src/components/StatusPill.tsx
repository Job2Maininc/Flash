import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "muted" | "danger" | "glass";

const styles: Record<Variant, string> = {
  accent:
    "bg-[var(--key-500)] text-[var(--paper)] shadow-[var(--glow-key)]",
  muted:
    "bg-[var(--ink-800)]/80 text-[var(--cam-paper)]/90 backdrop-blur-md border border-[var(--ink-600)]",
  danger: "bg-[var(--live)]/90 text-[var(--paper)] backdrop-blur-md",
  glass:
    "bg-[var(--ink-900)]/55 text-[var(--cam-paper)]/90 backdrop-blur-md border border-[var(--ink-600)] shadow-[var(--elev-1)]",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  animate?: boolean;
};

export function StatusPill({
  children,
  variant = "glass",
  className = "",
  animate = true,
}: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium tracking-wide",
        styles[variant],
        animate ? "flash-fade-in" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}

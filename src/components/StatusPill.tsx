import type { ReactNode } from "react";

type Variant = "accent" | "muted" | "danger" | "glass";

const styles: Record<Variant, string> = {
  accent:
    "bg-[var(--accent)] text-[var(--ink)] shadow-[0_0_24px_rgba(232,255,74,0.35)]",
  muted: "bg-black/55 text-white/90 backdrop-blur-md border border-white/10",
  danger: "bg-[var(--danger)]/90 text-white backdrop-blur-md",
  glass:
    "bg-black/45 text-white/90 backdrop-blur-md border border-white/15 shadow-lg",
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
      className={`pointer-events-none rounded-full px-4 py-1.5 text-sm font-medium tracking-wide ${styles[variant]} ${animate ? "flash-fade-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

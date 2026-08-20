import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "key" | "rim" | "live" | "ok" | "warn";
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-[var(--ink-700)] text-[var(--paper)]",
  key: "bg-[var(--key-500)]/15 text-[var(--key-400)]",
  rim: "bg-[var(--rim-500)]/15 text-[var(--rim-400)]",
  live: "bg-[var(--live)]/15 text-[var(--live)]",
  ok: "bg-[var(--ok)]/15 text-[var(--ok)]",
  warn: "bg-[var(--warn)]/15 text-[var(--warn)]",
};

export const Badge = forwardRef<HTMLSpanElement, Props>(
  function Badge({ className, tone = "default", ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1",
          "font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.12em]",
          tones[tone],
          className,
        )}
        {...props}
      />
    );
  },
);

type LiveProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  label: ReactNode;
};

/**
 * Live presence chip — only the pulsing `--live` dot carries red.
 * Label is cream mono (no red fill / glow / border).
 */
export const LiveBadge = forwardRef<HTMLSpanElement, LiveProps>(
  function LiveBadge({ className, label, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 font-[family-name:var(--font-mono)]",
          "text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--cam-paper)]",
          className,
        )}
        {...props}
      >
        <span aria-hidden className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--live)] opacity-60" />
          <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
        </span>
        <span className="tabular-nums">{label}</span>
      </span>
    );
  },
);

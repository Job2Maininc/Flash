import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
};

export const Pill = forwardRef<HTMLSpanElement, Props>(
  function Pill({ className, active = false, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5 text-sm",
          "font-[family-name:var(--font-body)] transition-[background-color,border-color] duration-[var(--dur-fast)] ease-[var(--ease-out)]",
          active
            ? "border-[var(--key-500)] bg-[var(--key-500)]/15 text-[var(--paper)]"
            : "border-[var(--ink-600)] bg-[var(--ink-800)] text-[var(--muted)]",
          className,
        )}
        {...props}
      />
    );
  },
);

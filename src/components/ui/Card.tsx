import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

export const Card = forwardRef<HTMLDivElement, Props>(
  function Card({ className, elevated = false, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] text-[var(--paper)]",
          elevated ? "shadow-[var(--elev-2)]" : "shadow-[var(--elev-1)]",
          className,
        )}
        {...props}
      />
    );
  },
);

"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** When false, always visible (useful in styleguide). */
  animate?: boolean;
};

export const Reveal = forwardRef<HTMLDivElement, Props>(
  function Reveal({ className, animate = true, children, ...props }, ref) {
    const reduced = useReducedMotion();
    const motionOff = !animate || reduced;

    return (
      <div
        ref={ref}
        className={cn(
          motionOff ? "opacity-100" : "cam-reveal",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

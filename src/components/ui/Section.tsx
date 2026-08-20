import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLElement> & {
  inverted?: boolean;
  as?: "section" | "div" | "footer" | "header";
  narrow?: boolean;
};

export const Section = forwardRef<HTMLElement, Props>(
  function Section(
    {
      className,
      inverted = false,
      as: Tag = "section",
      narrow = false,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Tag
        ref={ref as never}
        className={cn(
          "relative px-5",
          "py-[clamp(4.5rem,10vw,10rem)]",
          inverted
            ? "bg-[var(--paper)] text-[var(--ink-900)]"
            : "bg-[var(--ink-900)] text-[var(--paper)]",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "mx-auto w-full",
            narrow ? "max-w-3xl" : "max-w-6xl",
          )}
        >
          {children}
        </div>
      </Tag>
    );
  },
);

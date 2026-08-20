import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLElement> & {
  /** Cream inverted band */
  inverted?: boolean;
  /** Alternate dark band (ink-800) for section seams */
  alt?: boolean;
  as?: "section" | "div" | "footer" | "header";
  /** ~800px content column (FAQ) */
  narrow?: boolean;
  /** Top hairline seam on dark sections */
  seam?: boolean;
};

/**
 * Shared marketing rail: px-5 + max-w-6xl (or ~800px narrow).
 * Vertical rhythm: clamp(72px, 10vw, 160px).
 */
export const Section = forwardRef<HTMLElement, Props>(
  function Section(
    {
      className,
      inverted = false,
      alt = false,
      as: Tag = "section",
      narrow = false,
      seam = false,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Tag
        ref={ref as never}
        className={cn(
          "cam-section relative px-5",
          "py-[clamp(72px,10vw,160px)]",
          inverted
            ? "my-[clamp(1.5rem,4vw,3rem)] bg-[var(--paper)] text-[var(--ink-900)]"
            : alt
              ? "bg-[var(--ink-800)] text-[var(--cam-paper)]"
              : "bg-[var(--ink-900)] text-[var(--cam-paper)]",
          seam && !inverted && "border-t border-[var(--ink-700)]",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "cam-rail mx-auto w-full",
            narrow ? "max-w-[800px]" : "max-w-6xl",
          )}
        >
          {children}
        </div>
      </Tag>
    );
  },
);

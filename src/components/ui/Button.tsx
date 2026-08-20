import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--key-500)] text-[var(--paper)] shadow-[var(--glow-key)] hover:bg-[var(--key-400)]",
  secondary:
    "bg-transparent text-[var(--paper)] border border-[var(--ink-600)] hover:border-[var(--ink-700)] hover:bg-[var(--ink-800)]",
  ghost:
    "bg-transparent text-[var(--paper)] hover:bg-[var(--ink-800)]",
  danger:
    "bg-[var(--live)] text-[var(--paper)] hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-7 py-3.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-[family-name:var(--font-body)] font-medium",
          "transition-[transform,background-color,border-color,box-shadow,opacity] duration-[var(--dur-fast)] ease-[var(--ease-out)]",
          "active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--key-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink-900)]",
          "disabled:cursor-not-allowed disabled:opacity-55",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner
            size="sm"
            className="border-[var(--paper)]/30 border-t-[var(--paper)]"
          />
        ) : null}
        <span className={loading ? "opacity-80" : undefined}>{children}</span>
      </button>
    );
  },
);

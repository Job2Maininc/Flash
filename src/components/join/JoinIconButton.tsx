"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  label: string;
  children: ReactNode;
};

export function JoinIconButton({
  active = false,
  label,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-2xl transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[var(--shadow-glow)]"
          : "border-white/15 bg-white/8 hover:border-white/35 hover:bg-white/12"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

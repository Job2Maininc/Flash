"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  label: string;
  caption: string;
  emoji: ReactNode;
};

export function JoinIconButton({
  active = false,
  label,
  caption,
  emoji,
  className = "",
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex h-14 shrink-0 items-center gap-2.5 rounded-2xl border px-3.5 text-left transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[var(--shadow-glow)]"
          : "border-white/15 bg-white/8 hover:border-white/35 hover:bg-white/12"
      } ${className}`}
      {...props}
    >
      <span aria-hidden className="text-2xl leading-none">
        {emoji}
      </span>
      <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-white sm:text-base">
        {caption}
      </span>
    </button>
  );
}

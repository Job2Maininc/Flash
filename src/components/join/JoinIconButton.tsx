"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

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
      className={cn(
        "flex h-14 shrink-0 items-center gap-2.5 rounded-[var(--radius-pill)] border px-3.5 text-left transition-[border-color,background-color,box-shadow] duration-[var(--dur-fast)]",
        active
          ? "border-[var(--key-500)]/55 bg-[var(--key-500)]/15 shadow-[var(--glow-key)]"
          : "border-[var(--ink-600)] bg-[var(--ink-800)]/80 hover:border-[var(--ink-700)] hover:bg-[var(--ink-700)]",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="text-2xl leading-none">
        {emoji}
      </span>
      <span className="font-[family-name:var(--font-camera-display)] text-sm font-semibold tracking-tight text-[var(--cam-paper)] sm:text-base">
        {caption}
      </span>
    </button>
  );
}

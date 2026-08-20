"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  children: ReactNode;
  align?: "left" | "right";
};

export function JoinMenu({ open, children, align = "left" }: Props) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute bottom-full z-30 mb-2 min-w-[13.5rem] overflow-hidden rounded-[1.25rem] border border-[var(--ink-600)] bg-[var(--ink-800)]/95 p-1.5 shadow-[var(--elev-2)] backdrop-blur-md",
        align === "right" ? "right-0" : "left-0",
      )}
      role="menu"
    >
      {children}
    </div>
  );
}

type ItemProps = {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

export function JoinMenuItem({ active = false, onClick, children }: ItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-[background-color,color] duration-[var(--dur-fast)]",
        active
          ? "bg-[var(--key-500)] text-[var(--paper)]"
          : "text-[var(--cam-paper)]/85 hover:bg-[var(--ink-700)]",
      )}
    >
      {children}
    </button>
  );
}

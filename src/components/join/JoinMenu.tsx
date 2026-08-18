"use client";

import type { ReactNode } from "react";

type Props = {
  open: boolean;
  children: ReactNode;
  align?: "left" | "right";
};

export function JoinMenu({ open, children, align = "left" }: Props) {
  if (!open) return null;

  return (
    <div
      className={`absolute bottom-full z-30 mb-2 min-w-[13.5rem] overflow-hidden rounded-2xl border border-white/15 bg-[#16110d]/95 p-1.5 shadow-2xl backdrop-blur-md ${
        align === "right" ? "right-0" : "left-0"
      }`}
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
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-[var(--accent)] text-[var(--ink)]"
          : "text-white/85 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

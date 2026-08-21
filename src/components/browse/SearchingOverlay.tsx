"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/LocaleProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  onCancel: () => void;
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SearchingOverlay({ onCancel }: Props) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const hints = t.browse.searchingHints;

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (hints.length < 2) return;
    const id = window.setInterval(() => {
      setHintIndex((i) => (i + 1) % hints.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [hints.length]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[var(--ink-900)]/60 px-6 text-center backdrop-blur-[4px]">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {!reduceMotion ? (
          <>
            <span
              aria-hidden
              className="cam-search-ring absolute inset-0 rounded-full border border-[var(--key-500)]/35"
            />
            <span
              aria-hidden
              className="cam-search-ring cam-search-ring-delay absolute inset-3 rounded-full border border-[var(--rim-400)]/30"
            />
          </>
        ) : null}
        <span
          aria-hidden
          className="relative h-14 w-14 rounded-full bg-[var(--key-500)]/20 shadow-[var(--glow-key)]"
        />
        <span
          aria-hidden
          className="absolute h-3 w-3 rounded-full bg-[var(--key-500)]"
        />
      </div>

      <div className="space-y-3">
        <p className="font-[family-name:var(--font-camera-display)] text-2xl tracking-tight text-[var(--cam-paper)] sm:text-3xl">
          {t.browse.searchingTitle}
        </p>
        <p
          key={hintIndex}
          className="cam-reveal mx-auto max-w-xs text-sm leading-relaxed text-[var(--cam-paper)]/65"
        >
          {hints[hintIndex] ?? t.browse.searchingBody}
        </p>
        <p
          className="font-[family-name:var(--font-mono)] text-sm tabular-nums text-[var(--key-400)]"
          aria-live="polite"
        >
          {formatElapsed(elapsed)}
        </p>
      </div>

      <Link
        href="/join"
        onClick={onCancel}
        className={cn(
          "pointer-events-auto inline-flex h-9 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] px-4",
          "font-[family-name:var(--font-body)] text-sm font-medium text-[var(--cam-paper)]",
          "transition-[background-color,border-color] duration-[var(--dur-fast)]",
          "hover:border-[var(--ink-700)] hover:bg-[var(--ink-800)]",
        )}
      >
        {t.browse.cancelSearch}
      </Link>
    </div>
  );
}

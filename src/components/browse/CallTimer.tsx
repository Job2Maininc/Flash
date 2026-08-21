"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTDOWN_FROM_MS, COUNTDOWN_WARN_MS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  endsAt: number | null;
  onExpire?: () => void;
};

function formatMs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Sibling of the video only — never wrap <video>. Renders once per second.
 */
export function CallTimer({ endsAt, onExpire }: Props) {
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => Date.now());
  const expiredRef = useRef(false);
  const announcedRef = useRef<Set<number>>(new Set());
  const [liveMsg, setLiveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!endsAt) return;
    expiredRef.current = false;
    announcedRef.current = new Set();
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (!endsAt) return;
    const remaining = endsAt - now;
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpire?.();
    }
    const seconds = Math.max(0, Math.ceil(remaining / 1000));
    for (const m of [60, 30, 10, 0]) {
      if (seconds === m && !announcedRef.current.has(m)) {
        announcedRef.current.add(m);
        setLiveMsg(`${seconds} seconds remaining`);
      }
    }
  }, [endsAt, now, onExpire]);

  if (!endsAt) return null;

  const remaining = Math.max(0, endsAt - now);
  const seconds = Math.ceil(remaining / 1000);
  const warn = remaining <= COUNTDOWN_WARN_MS;
  const final = remaining <= COUNTDOWN_FROM_MS && remaining > 0;

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] z-30 -translate-x-1/2",
          "rounded-[var(--radius-pill)] bg-[rgba(22,18,28,0.92)] px-3.5 py-1.5",
          "font-[family-name:var(--font-mono)] text-sm tabular-nums tracking-wide",
          warn ? "text-[var(--key-400)]" : "text-[var(--cam-paper)]/85",
        )}
        aria-hidden
      >
        {formatMs(remaining)}
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMsg}
      </div>

      {final ? (
        <div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          aria-hidden
        >
          <span
            key={seconds}
            className={cn(
              "relative font-[family-name:var(--font-camera-display)] text-7xl font-bold text-white tabular-nums",
              !reduced && "cam-timer-pulse",
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,122,69,.28) 0%, transparent 70%)",
              }}
            />
            {seconds}
          </span>
        </div>
      ) : null}
    </>
  );
}

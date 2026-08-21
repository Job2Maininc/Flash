"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { interpolate } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type PresencePayload = { online: number | null };

function msUntilNextFullHour(now = new Date()): number {
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(now.getHours() + 1);
  return Math.max(0, next.getTime() - now.getTime());
}

function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  className?: string;
  inverted?: boolean;
};

/**
 * Honest presence line — never invents a crowd.
 * Replaces “be the first tonight” style empty claims.
 */
export function PresenceLine({ className, inverted = false }: Props) {
  const { t } = useI18n();
  const [online, setOnline] = useState<number | null | undefined>(undefined);
  const [remainingMs, setRemainingMs] = useState(() => msUntilNextFullHour());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/presence", { method: "GET" });
        if (!res.ok) {
          if (!cancelled) setOnline(null);
          return;
        }
        const data = (await res.json()) as PresencePayload;
        if (!cancelled) {
          setOnline(
            typeof data.online === "number" && Number.isFinite(data.online)
              ? Math.max(0, Math.floor(data.online))
              : null,
          );
        }
      } catch {
        if (!cancelled) setOnline(null);
      }
    }
    load();
    const id = window.setInterval(load, 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (online !== 0 && online !== null && online !== undefined) return;
    const id = window.setInterval(() => {
      setRemainingMs(msUntilNextFullHour());
    }, 1000);
    return () => window.clearInterval(id);
  }, [online]);

  if (online === undefined) {
    return (
      <p
        className={cn(
          "text-[13px] font-medium",
          inverted ? "text-[var(--ink-600)]" : "text-[var(--muted)]",
          className,
        )}
      >
        …
      </p>
    );
  }

  if (typeof online === "number" && online >= 3) {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-2 text-[13px] font-medium",
          inverted ? "text-[var(--ink-700)]" : "text-[var(--muted)]",
          className,
        )}
      >
        <span
          className="relative flex h-2 w-2 shrink-0"
          aria-hidden
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--live)] opacity-60" />
          <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
        </span>
        {interpolate(t.presence.waitingMany, { n: String(online) })}
      </p>
    );
  }

  if (online === 1 || online === 2) {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-2 text-[13px] font-medium",
          inverted ? "text-[var(--ink-700)]" : "text-[var(--muted)]",
          className,
        )}
      >
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--live)]"
          aria-hidden
        />
        {t.presence.someoneThere}
      </p>
    );
  }

  // 0 or null — no invented crowd; point toward evening prime time.
  return (
    <p
      className={cn(
        "text-[13px] font-medium leading-relaxed",
        inverted ? "text-[var(--ink-700)]" : "text-[var(--muted)]",
        className,
      )}
    >
      <span>{t.presence.primeTime}</span>{" "}
      <span className="font-[family-name:var(--font-mono)] tabular-nums" aria-live="polite">
        {formatCountdown(remainingMs)}
      </span>
    </p>
  );
}

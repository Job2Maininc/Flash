"use client";

import { useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

type Props = {
  partnerId: string;
  roomId: string | null;
  onLeave: () => void;
  onBlocked: (partnerId: string) => void;
  className?: string;
};

/**
 * One-tap block. Leaves the call locally first; API runs with keepalive.
 * Must stay outside CallControlBar auto-hide.
 */
export function BlockButton({
  partnerId,
  roomId,
  onLeave,
  onBlocked,
  className,
}: Props) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  async function onBlock() {
    if (busy) return;
    setBusy(true);
    // Local leave first — escape must work if the API is down.
    onLeave();
    onBlocked(partnerId);

    const body = JSON.stringify({ blockedId: partnerId, roomId });
    const send = () =>
      fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "include",
      });

    try {
      const res = await send();
      if (!res.ok) await send();
    } catch {
      try {
        await send();
      } catch {
        // Already out of the call.
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onBlock}
      disabled={busy}
      className={cn(
        "pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)]",
        "border border-[var(--live)]/50 bg-[rgba(22,18,28,0.92)] px-4 text-sm font-medium text-[var(--live)]",
        "active:scale-[.97] disabled:opacity-60",
        className,
      )}
      aria-label={t.call.block}
    >
      {t.call.block}
    </button>
  );
}

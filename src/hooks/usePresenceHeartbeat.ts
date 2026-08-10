import { useEffect, useRef } from "react";
import type { SessionView } from "@/lib/types";
import { sessionViewChanged } from "@/lib/session-view";

const HEARTBEAT_MS = 9000;
const HIDDEN_PAUSE_MS = 30_000;

type Options = {
  active?: boolean;
  onSession?: (session: SessionView) => void;
};

export function usePresenceHeartbeat({ active = true, onSession }: Options) {
  const onSessionRef = useRef(onSession);
  onSessionRef.current = onSession;

  useEffect(() => {
    if (!active) return;

    let hiddenSince: number | null = null;

    async function ping() {
      if (
        hiddenSince !== null &&
        Date.now() - hiddenSince > HIDDEN_PAUSE_MS
      ) {
        return;
      }

      try {
        const res = await fetch("/api/presence", { method: "POST" });
        if (!res.ok) return;
        const data = (await res.json()) as { session?: SessionView };
        if (data.session && onSessionRef.current) {
          onSessionRef.current(data.session);
        }
      } catch {
        // ignore transient network errors
      }
    }

    const interval = window.setInterval(ping, HEARTBEAT_MS);
    ping();

    function onVisibilityChange() {
      if (document.hidden) {
        hiddenSince = Date.now();
      } else {
        hiddenSince = null;
        ping();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active]);
}

export function sendSessionLeave(reason = "disconnect"): void {
  const body = JSON.stringify({ reason });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/session/leave",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }

  fetch("/api/session/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function mergeSessionUpdate(
  prev: SessionView | null,
  next: SessionView,
): SessionView {
  return sessionViewChanged(prev, next) ? next : prev ?? next;
}

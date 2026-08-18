import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "flash_visitor";
const PING_MS = 12_000;

function readVisitorId(): string {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function useOnlineCount() {
  const [count, setCount] = useState<number | null>(null);

  const ping = useCallback(async () => {
    try {
      const res = await fetch("/api/online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: readVisitorId() }),
      });
      const data = (await res.json()) as { count?: number };
      if (typeof data.count === "number") {
        setCount(Math.max(1, data.count));
      }
    } catch {
      setCount((current) => current ?? 1);
    }
  }, []);

  useEffect(() => {
    ping();
    const id = window.setInterval(ping, PING_MS);
    return () => window.clearInterval(id);
  }, [ping]);

  return count;
}

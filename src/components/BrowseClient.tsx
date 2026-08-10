"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VideoStage } from "@/components/VideoStage";
import { SwipeControls } from "@/components/SwipeControls";
import { MediaPermissionPrompt } from "@/components/MediaPermissionPrompt";
import { FlashBrand } from "@/components/FlashBrand";
import { requestMediaAccess } from "@/lib/media";
import { sessionViewChanged } from "@/lib/session-view";
import type { SessionView } from "@/lib/types";

const POLL_MS = 1500;

export function BrowseClient() {
  const [session, setSession] = useState<SessionView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaPrompt, setMediaPrompt] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const joining = useRef(false);
  const roomKey = session?.roomName ?? null;

  const refresh = useCallback(async () => {
    const res = await fetch("/api/session");
    if (res.status === 401) {
      window.location.href = "/";
      return;
    }
    const data = (await res.json()) as {
      session?: SessionView;
      error?: string;
    };
    if (!res.ok) throw new Error(data.error ?? "Erreur session");
    if (data.session) {
      setSession((prev) =>
        sessionViewChanged(prev, data.session!) ? data.session! : prev,
      );
    }
  }, []);

  const join = useCallback(async () => {
    if (joining.current) return;
    joining.current = true;
    try {
      const res = await fetch("/api/queue/join", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/";
        return;
      }
      const data = (await res.json()) as {
        session?: SessionView;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "File d'attente indisponible");
      if (data.session) {
        setSession((prev) =>
          sessionViewChanged(prev, data.session!) ? data.session! : prev,
        );
      }
    } finally {
      joining.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await requestMediaAccess();
        if (!cancelled) {
          setMediaReady(true);
          setMediaPrompt(false);
        }
      } catch {
        if (!cancelled) setMediaPrompt(true);
      }
      try {
        await join();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [join]);

  useEffect(() => {
    const id = window.setInterval(() => {
      refresh().catch(() => undefined);
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!session || session.state !== "ended") return;
    const t = window.setTimeout(() => {
      join().catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur"),
      );
    }, 400);
    return () => window.clearTimeout(t);
  }, [session, join]);

  async function onSwipe(direction: "left" | "right") {
    setSwiping(true);
    setError(null);
    try {
      const res = await fetch("/api/session/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      const data = (await res.json()) as {
        session?: SessionView;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Swipe impossible");
      if (data.session) {
        setSession((prev) =>
          sessionViewChanged(prev, data.session!) ? data.session! : prev,
        );
      }
      if (direction === "left" || data.session?.state === "ended") {
        await join();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSwiping(false);
    }
  }

  const inCall = session?.state === "active" || session?.state === "matched";

  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--ink)] text-white">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
        <FlashBrand
          href="/browse"
          glow="strong"
          className="pointer-events-auto"
          wordmarkClassName="text-white"
        />
        <Link
          href="/matches"
          className="pointer-events-auto text-sm text-white/80 underline-offset-4 hover:underline"
        >
          Matches
        </Link>
      </header>

      <main className="relative flex-1">
        {!mediaReady && mediaPrompt ? (
          <MediaPermissionPrompt
            onGranted={() => {
              setMediaReady(true);
              setMediaPrompt(false);
            }}
          />
        ) : null}

        {inCall && roomKey && mediaReady ? (
          <VideoStage
            key={roomKey}
            roomName={roomKey}
            peerNickname={session?.peerNickname ?? null}
          />
        ) : null}

        {!inCall ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,_#2a2218_0%,_#0c0a08_55%)] px-6 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]" />
            <p className="font-[family-name:var(--font-display)] text-2xl">
              En attente…
            </p>
            <p className="max-w-xs text-sm text-white/60">
              Dès qu&apos;une personne est dispo, l&apos;appel démarre. Reste sur
              cet écran.
            </p>
          </div>
        ) : null}

        {session?.state === "matched" ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-sm text-[var(--ink)]">
            C&apos;est un match
          </div>
        ) : null}

        {session?.myVote === "right" && session.state === "active" ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2 bg-black/50 px-4 py-1 text-sm backdrop-blur-sm">
            En attente de son like…
          </div>
        ) : null}
      </main>

      {error ? (
        <p className="absolute bottom-28 left-0 right-0 z-20 px-4 text-center text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-20">
        <SwipeControls
          disabled={!inCall || swiping || !mediaReady}
          myVote={session?.myVote ?? null}
          onSwipe={onSwipe}
        />
      </div>
    </div>
  );
}

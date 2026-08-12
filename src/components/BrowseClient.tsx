"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VideoStage } from "@/components/VideoStage";
import { SwipeControls } from "@/components/SwipeControls";
import { SwipeSurface } from "@/components/SwipeSurface";
import { MediaPermissionPrompt } from "@/components/MediaPermissionPrompt";
import { LocalPreview } from "@/components/LocalPreview";
import { FlashBrand } from "@/components/FlashBrand";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { MatchCelebration } from "@/components/MatchCelebration";
import { Spinner } from "@/components/Spinner";
import { StatusPill } from "@/components/StatusPill";
import { hapticSuccess } from "@/lib/haptics";
import { sessionViewChanged } from "@/lib/session-view";
import {
  mergeSessionUpdate,
  sendSessionLeave,
  usePresenceHeartbeat,
} from "@/hooks/usePresenceHeartbeat";
import type { SessionView } from "@/lib/types";

const POLL_MS = 1000;
const POLL_IN_CALL_MS = 350;
const REJOIN_MS = 400;

export function BrowseClient() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<SessionView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaPrompt, setMediaPrompt] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const [peerLeftNotice, setPeerLeftNotice] = useState<string | null>(null);
  const [previewSeed, setPreviewSeed] = useState(0);
  const joining = useRef(false);
  const leftSent = useRef(false);
  const wasInCall = useRef(false);
  const peerLeftHandled = useRef(false);
  const lastPeerNickname = useRef<string | null>(null);
  const [forceOutOfCall, setForceOutOfCall] = useState(false);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [recallNotice, setRecallNotice] = useState<string | null>(null);
  const prevSessionState = useRef<SessionView["state"] | null>(null);
  const roomKey = session?.roomName ?? null;

  const inCallSession =
    session?.state === "active" || session?.state === "matched";
  const inCall = inCallSession && !forceOutOfCall;

  if (session?.peerNickname) {
    lastPeerNickname.current = session.peerNickname;
  }

  const applySession = useCallback((next: SessionView) => {
    setSession((prev) =>
      sessionViewChanged(prev, next) ? next : prev,
    );
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
      if (data.session) applySession(data.session);
    } finally {
      joining.current = false;
    }
  }, [applySession]);

  const processPeerLeft = useCallback(
    (nickname?: string | null) => {
      if (peerLeftHandled.current) return;
      peerLeftHandled.current = true;
      setForceOutOfCall(true);

      const label =
        nickname ?? lastPeerNickname.current ?? "Ton partenaire";
      setPeerLeftNotice(`${label} a quitté l'appel`);

      fetch("/api/session/peer-left", { method: "POST" })
        .then(async (res) => {
          const data = (await res.json()) as { session?: SessionView };
          if (data.session) applySession(data.session);
        })
        .catch(() => undefined);

      window.setTimeout(() => {
        setPeerLeftNotice(null);
        setForceOutOfCall(false);
        peerLeftHandled.current = false;
        join().catch((err) =>
          setError(err instanceof Error ? err.message : "Erreur"),
        );
      }, REJOIN_MS);
    },
    [applySession, join],
  );

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
      if (data.session.peerLeft) {
        processPeerLeft(data.session.peerNickname);
      }
      applySession(data.session);
    }
  }, [applySession, processPeerLeft]);

  const handlePeerLeft = useCallback(() => {
    processPeerLeft(session?.peerNickname);
  }, [processPeerLeft, session?.peerNickname]);

  const leaveBrowse = useCallback((reason = "disconnect") => {
    if (leftSent.current) return;
    leftSent.current = true;
    sendSessionLeave(reason);
  }, []);

  const handleLocalDisconnect = useCallback(() => {
    leaveBrowse("disconnect");
  }, [leaveBrowse]);

  useEffect(() => {
    if (searchParams.get("recall") === "1") {
      setRecallNotice("Rappel en cours — connexion à l'appel…");
      window.history.replaceState({}, "", "/browse");
      const t = window.setTimeout(() => setRecallNotice(null), 3500);
      return () => window.clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      session?.state === "matched" &&
      prevSessionState.current !== "matched"
    ) {
      hapticSuccess();
      setShowMatchCelebration(true);
    }
    prevSessionState.current = session?.state ?? null;
  }, [session?.state]);

  useEffect(() => {
    if (inCall && roomKey) {
      setConnecting(true);
      const t = window.setTimeout(() => setConnecting(false), 900);
      return () => window.clearTimeout(t);
    }
    setConnecting(false);
  }, [inCall, roomKey]);

  usePresenceHeartbeat({
    active: true,
    inCall: inCallSession,
    onSession: (next) => {
      if (next.peerLeft) {
        processPeerLeft(next.peerNickname);
      }
      setSession((prev) => mergeSessionUpdate(prev, next));
    },
  });

  useEffect(() => {
    join().catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
  }, [join]);

  useEffect(() => {
    const ms = inCallSession ? POLL_IN_CALL_MS : POLL_MS;
    const id = window.setInterval(() => {
      refresh()
        .then(() => undefined)
        .catch(() => undefined);
    }, ms);
    return () => window.clearInterval(id);
  }, [refresh, inCallSession]);

  useEffect(() => {
    if (!session || session.state !== "ended") return;
    const t = window.setTimeout(() => {
      join().catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur"),
      );
    }, 400);
    return () => window.clearTimeout(t);
  }, [session, join]);

  useEffect(() => {
    const inCallNow =
      session?.state === "active" || session?.state === "matched";

    if (wasInCall.current && !inCallNow) {
      if (session?.state === "waiting" && !peerLeftHandled.current) {
        processPeerLeft(session.peerNickname);
      }
    }

    wasInCall.current = inCallNow;
  }, [session, processPeerLeft]);

  useEffect(() => {
    function onLeave() {
      leaveBrowse("disconnect");
    }

    window.addEventListener("pagehide", onLeave);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("beforeunload", onLeave);
      leaveBrowse("disconnect");
    };
  }, [leaveBrowse]);

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
      if (data.session) applySession(data.session);
      if (direction === "left" || data.session?.state === "ended") {
        await join();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSwiping(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--ink)] text-white">
      <AmbientOrbs variant="dark" />

      {showMatchCelebration ? (
        <MatchCelebration
          peerNickname={session?.peerNickname ?? null}
          onComplete={() => setShowMatchCelebration(false)}
        />
      ) : null}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 safe-top">
        <FlashBrand
          href="/browse"
          glow="strong"
          className="pointer-events-auto"
          wordmarkClassName="text-white"
        />
        <Link
          href="/matches"
          onClick={() => leaveBrowse("disconnect")}
          className="flash-btn pointer-events-auto rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-sm text-white/85 backdrop-blur-md hover:bg-black/50"
        >
          Matches
        </Link>
      </header>

      <main className="relative flex-1 min-h-0">
        {!mediaReady && mediaPrompt ? (
          <MediaPermissionPrompt
            onGranted={() => {
              setPreviewSeed((n) => n + 1);
              setMediaReady(true);
              setMediaPrompt(false);
            }}
          />
        ) : null}

        {inCall && roomKey ? (
          <div className="absolute inset-0 h-full w-full flash-view-in">
            <SwipeSurface
              enabled={!swiping}
              canSwipeLeft={session?.myVote !== "left"}
              canSwipeRight={session?.myVote !== "right"}
              onSwipeLeft={() => onSwipe("left")}
              onSwipeRight={() => onSwipe("right")}
            >
              <VideoStage
                key={roomKey}
                roomName={roomKey}
                peerNickname={session?.peerNickname ?? null}
                onPeerLeft={handlePeerLeft}
                onDisconnected={handleLocalDisconnect}
              />
            </SwipeSurface>

            {connecting ? (
              <div className="pointer-events-none absolute inset-x-6 top-[4.5rem] z-30 safe-top">
                <div className="overflow-hidden rounded-full bg-white/10">
                  <div className="h-1 w-full rounded-full bg-[var(--accent)] flash-connect-bar" />
                </div>
                <p className="mt-2 text-center text-xs font-medium uppercase tracking-widest text-white/45">
                  Connexion…
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {!inCall ? (
          <div className="absolute inset-0 h-full w-full flash-view-in">
            <LocalPreview
            key={previewSeed}
            active
            className="absolute inset-0 h-full w-full"
            onReady={() => {
              setMediaReady(true);
              setMediaPrompt(false);
            }}
            onError={() => setMediaPrompt(true)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/55 px-6 text-center backdrop-blur-[3px]">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 rounded-full bg-[var(--accent)]/20 flash-pulse-ring" />
                <Spinner size="lg" />
              </div>
              <div className="flash-fade-in space-y-2">
                <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                  On cherche ton match…
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-white/65">
                  File filtrée selon ton sexe et qui tu cherches. Dès qu&apos;une
                  personne compatible est dispo, l&apos;appel démarre.
                </p>
              </div>
            </div>
          </LocalPreview>
          </div>
        ) : null}

        {recallNotice ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-30 -translate-x-1/2">
            <StatusPill variant="accent">{recallNotice}</StatusPill>
          </div>
        ) : null}

        {peerLeftNotice ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-30 -translate-x-1/2">
            <StatusPill variant="muted">{peerLeftNotice}</StatusPill>
          </div>
        ) : null}

        {session?.state === "matched" && !showMatchCelebration ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2">
            <StatusPill variant="accent">C&apos;est un match ♥</StatusPill>
          </div>
        ) : null}

        {session?.myVote === "right" && session.state === "active" ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2">
            <StatusPill variant="muted">En attente de son like…</StatusPill>
          </div>
        ) : null}
      </main>

      {error ? (
        <div className="absolute bottom-36 left-4 right-4 z-20 mx-auto max-w-sm">
          <p
            className="flash-fade-in rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/90 px-4 py-2.5 text-center text-sm text-white shadow-lg"
            role="alert"
          >
            {error}
          </p>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-20">
        <SwipeControls
          disabled={!inCall || swiping}
          myVote={session?.myVote ?? null}
          onSwipe={onSwipe}
        />
        {inCall ? (
          <p className="pb-3 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/35 safe-bottom">
            Glisse sur l&apos;écran
          </p>
        ) : null}
      </div>
    </div>
  );
}

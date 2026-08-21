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
import { MatchCelebration } from "@/components/MatchCelebration";
import { StatusPill } from "@/components/StatusPill";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchingOverlay } from "@/components/browse/SearchingOverlay";
import { CountIn } from "@/components/browse/CountIn";
import { ReportSheet } from "@/components/browse/ReportSheet";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { useI18n } from "@/components/LocaleProvider";
import { interpolate } from "@/lib/i18n";
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
  const { t } = useI18n();
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
  const leaveTimerRef = useRef<number | null>(null);
  const [forceOutOfCall, setForceOutOfCall] = useState(false);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [callReady, setCallReady] = useState(false);
  const [recallNotice, setRecallNotice] = useState<string | null>(null);
  const [reportFor, setReportFor] = useState<string | null>(null);
  const [reportRoomId, setReportRoomId] = useState<string | null>(null);
  const [lastPartnerId, setLastPartnerId] = useState<string | null>(null);
  const prevSessionState = useRef<SessionView["state"] | null>(null);
  const roomKey = session?.roomName ?? null;

  const inCallSession =
    session?.state === "active" || session?.state === "matched";
  const inCall = inCallSession && !forceOutOfCall;
  const showStablePreview = !mediaPrompt && (!inCall || !callReady);

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
      if (!res.ok) throw new Error(data.error ?? t.browse.queueError);
      if (data.session) applySession(data.session);
    } finally {
      joining.current = false;
    }
  }, [applySession, t.browse.queueError]);

  const processPeerLeft = useCallback(
    (nickname?: string | null, peerId?: string | null) => {
      if (peerLeftHandled.current) return;
      peerLeftHandled.current = true;
      setForceOutOfCall(true);
      if (peerId) setLastPartnerId(peerId);

      const label =
        nickname ?? lastPeerNickname.current ?? t.browse.peerLeftFallback;
      setPeerLeftNotice(interpolate(t.browse.peerLeft, { name: label }));

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
          setError(err instanceof Error ? err.message : t.browse.genericError),
        );
      }, REJOIN_MS);
    },
    [applySession, join, t.browse.peerLeft, t.browse.peerLeftFallback, t.browse.genericError],
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
    if (!res.ok) throw new Error(data.error ?? t.browse.sessionError);
    if (data.session) {
      if (data.session.peerLeft) {
        processPeerLeft(data.session.peerNickname, data.session.peerId);
      }
      applySession(data.session);
    }
  }, [applySession, processPeerLeft, t.browse.sessionError]);

  const handlePeerLeft = useCallback(() => {
    processPeerLeft(session?.peerNickname, session?.peerId);
  }, [processPeerLeft, session?.peerNickname, session?.peerId]);

  const leaveBrowse = useCallback((reason = "disconnect") => {
    if (leftSent.current) return;
    leftSent.current = true;
    sendSessionLeave(reason);
  }, []);

  const handleLocalDisconnect = useCallback(() => {
    leaveBrowse("disconnect");
  }, [leaveBrowse]);

  const handleCallConnected = useCallback(() => {
    setCallReady(true);
  }, []);

  const handleLocalLeaveFromBlock = useCallback(() => {
    setForceOutOfCall(true);
    setCallReady(false);
  }, []);

  const handleBlocked = useCallback((partnerId: string) => {
    setReportFor(partnerId);
    setReportRoomId(roomKey);
    setLastPartnerId(partnerId);
  }, [roomKey]);

  const handleCallExpired = useCallback(() => {
    if (session?.peerId) setLastPartnerId(session.peerId);
    leaveBrowse("timeout");
  }, [leaveBrowse, session?.peerId]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/last-partner", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{
          last?: { partnerId: string; roomId: string | null } | null;
        }>;
      })
      .then((data) => {
        if (cancelled || !data?.last?.partnerId) return;
        setLastPartnerId(data.last.partnerId);
        setReportRoomId(data.last.roomId);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("recall") === "1") {
      setRecallNotice(t.browse.recallNotice);
      window.history.replaceState({}, "", "/browse");
      const timeoutId = window.setTimeout(() => setRecallNotice(null), 3500);
      return () => window.clearTimeout(timeoutId);
    }
  }, [searchParams, t.browse.recallNotice]);

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
      setCallReady(false);
      setConnecting(true);
      const timeoutId = window.setTimeout(() => setConnecting(false), 900);
      return () => window.clearTimeout(timeoutId);
    }
    setCallReady(false);
    setConnecting(false);
  }, [inCall, roomKey]);

  usePresenceHeartbeat({
    active: true,
    inCall: inCallSession,
    onSession: (next) => {
      if (next.peerLeft) {
        processPeerLeft(next.peerNickname, next.peerId);
      }
      setSession((prev) => mergeSessionUpdate(prev, next));
    },
  });

  useEffect(() => {
    join().catch((err) => setError(err instanceof Error ? err.message : t.browse.genericError));
  }, [join, t.browse.genericError]);

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
    const timeoutId = window.setTimeout(() => {
      join().catch((err) =>
        setError(err instanceof Error ? err.message : t.browse.genericError),
      );
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [session, join, t.browse.genericError]);

  useEffect(() => {
    const inCallNow =
      session?.state === "active" || session?.state === "matched";

    if (wasInCall.current && !inCallNow) {
      if (session?.state === "waiting" && !peerLeftHandled.current) {
        processPeerLeft(session.peerNickname, session.peerId);
      }
    }

    wasInCall.current = inCallNow;
  }, [session, processPeerLeft]);

  useEffect(() => {
    // Cancel a deferred leave from a StrictMode remount cleanup.
    if (leaveTimerRef.current != null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    function onLeave() {
      leaveBrowse("disconnect");
    }

    window.addEventListener("pagehide", onLeave);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("beforeunload", onLeave);
      // Defer so React StrictMode remount can cancel before presence is cleared.
      leaveTimerRef.current = window.setTimeout(() => {
        leaveBrowse("disconnect");
        leaveTimerRef.current = null;
      }, 150);
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
      if (!res.ok) throw new Error(data.error ?? t.browse.swipeError);
      if (data.session) applySession(data.session);
      if (direction === "left" || data.session?.state === "ended") {
        await join();
      }
    } catch (err) {
          setError(err instanceof Error ? err.message : t.browse.genericError);
    } finally {
      setSwiping(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--ink-900)] text-[var(--cam-paper)]">
      {!inCall ? <NoiseOverlay className="opacity-[0.03]" /> : null}

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
          wordmarkClassName="text-[var(--cam-paper)]"
        />
        <div className="pointer-events-auto flex items-center gap-2">
          <LanguageSwitcher variant="dark" />
          <Link
            href="/matches"
            onClick={() => leaveBrowse("disconnect")}
            className="rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 px-3.5 py-1.5 text-sm text-[var(--cam-paper)]/85 backdrop-blur-md transition-colors hover:bg-[var(--ink-800)]"
          >
            {t.browse.matches}
          </Link>
        </div>
      </header>

      <main id="main" className="relative flex-1 min-h-0">
        {!mediaReady && mediaPrompt ? (
          <MediaPermissionPrompt
            onGranted={() => {
              setPreviewSeed((n) => n + 1);
              setMediaReady(true);
              setMediaPrompt(false);
            }}
          />
        ) : null}

        {showStablePreview ? (
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
              {!inCall ? (
                <SearchingOverlay onCancel={() => leaveBrowse("disconnect")} />
              ) : null}
            </LocalPreview>
          </div>
        ) : null}

        {inCall && roomKey ? (
          <div className="absolute inset-0 h-full w-full">
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
                callEndsAt={session?.callEndsAt ?? null}
                onPeerLeft={handlePeerLeft}
                onDisconnected={handleLocalDisconnect}
                onConnected={handleCallConnected}
                onBlocked={handleBlocked}
                onLocalLeave={handleLocalLeaveFromBlock}
                onCallExpired={handleCallExpired}
              />
            </SwipeSurface>

            {connecting ? (
              <div className="pointer-events-none absolute inset-x-6 top-[4.5rem] z-30 safe-top">
                <div className="overflow-hidden rounded-full bg-[var(--ink-600)]">
                  <div className="h-1 w-full rounded-full bg-[var(--key-500)] flash-connect-bar" />
                </div>
                <p className="mt-2 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-widest text-[var(--cam-paper)]/45">
                  {t.browse.connecting}
                </p>
              </div>
            ) : null}

            <CountIn active={callReady && !connecting} />
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

        {!inCall && lastPartnerId ? (
          <div className="absolute left-1/2 top-28 z-30 -translate-x-1/2">
            <button
              type="button"
              className="pointer-events-auto rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[rgba(22,18,28,0.92)] px-4 py-2 text-xs text-[var(--muted)]"
              onClick={() => {
                setReportFor(lastPartnerId);
                setReportRoomId(null);
              }}
            >
              {t.call.reportLastCall}
            </button>
          </div>
        ) : null}

        {session?.state === "matched" && !showMatchCelebration ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2">
            <StatusPill variant="accent">{t.browse.itsAMatch}</StatusPill>
          </div>
        ) : null}

        {session?.myVote === "right" && session.state === "active" ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2">
            <StatusPill variant="muted">{t.browse.waitingLike}</StatusPill>
          </div>
        ) : null}
      </main>

      {error ? (
        <div className="absolute bottom-36 left-4 right-4 z-20 mx-auto max-w-sm">
          <p
            className="cam-reveal rounded-xl border border-[var(--live)]/30 bg-[var(--live)]/90 px-4 py-2.5 text-center text-sm text-[var(--paper)] shadow-[var(--elev-1)]"
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
          <p className="pb-3 text-center font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--cam-paper)]/35 safe-bottom">
            {t.browse.swipeHint}
          </p>
        ) : null}
      </div>
      <ReportSheet
        open={Boolean(reportFor)}
        partnerId={reportFor}
        roomId={reportRoomId}
        onClose={() => setReportFor(null)}
      />
    </div>
  );
}

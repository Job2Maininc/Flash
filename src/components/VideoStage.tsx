"use client";

import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import type { RemoteParticipant } from "livekit-client";
import { RoomEvent } from "livekit-client";
import type { TrackReference } from "@livekit/components-core";
import "@livekit/components-styles";
import { AttachedVideo } from "@/components/AttachedVideo";
import { BlockButton } from "@/components/browse/BlockButton";
import { CallControlBar } from "@/components/browse/CallControlBar";
import { CallTimer } from "@/components/browse/CallTimer";
import { DraggablePip } from "@/components/browse/DraggablePip";
import { MediaControls } from "@/components/MediaControls";
import { Spinner } from "@/components/Spinner";
import { StatusPill } from "@/components/StatusPill";
import { useI18n } from "@/components/LocaleProvider";
import { interpolate } from "@/lib/i18n";

const PeerNicknameContext = createContext<string | null>(null);

const LIVEKIT_ROOM_OPTIONS = {
  disconnectOnPageLeave: true,
  videoCaptureDefaults: { facingMode: "user" as const },
};

type RoomShellProps = {
  token: string;
  url: string;
  callEndsAt: number | null;
  onPeerLeft?: () => void;
  onDisconnected?: () => void;
  onConnected?: () => void;
  onBlocked?: (partnerId: string) => void;
  onLocalLeave?: () => void;
  onCallExpired?: () => void;
};

const LiveKitRoomShell = memo(function LiveKitRoomShell({
  token,
  url,
  callEndsAt,
  onPeerLeft,
  onDisconnected,
  onConnected,
  onBlocked,
  onLocalLeave,
  onCallExpired,
}: RoomShellProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect
      video
      audio
      className="absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
      options={LIVEKIT_ROOM_OPTIONS}
      onConnected={onConnected}
      onDisconnected={onDisconnected}
    >
      <PeerDisconnectListener onPeerLeft={onPeerLeft} />
      <StageInner
        onPeerLeft={onPeerLeft}
        callEndsAt={callEndsAt}
        onBlocked={onBlocked}
        onLocalLeave={onLocalLeave}
        onCallExpired={onCallExpired}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
});

function PeerDisconnectListener({
  onPeerLeft,
}: {
  onPeerLeft?: () => void;
}) {
  const room = useRoomContext();
  const handled = useRef(false);

  useEffect(() => {
    if (!room) return;
    handled.current = false;

    // Only treat a real participant leave as peer-left.
    // TrackUnsubscribed fires on transient renegotiation / layer switches and
    // must not end the call.
    const onParticipantDisconnected = (participant: RemoteParticipant) => {
      if (participant.isLocal || handled.current) return;
      handled.current = true;
      onPeerLeft?.();
    };

    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    return () => {
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    };
  }, [room, onPeerLeft]);

  return null;
}

/** Camera publication with an attachable track — keep mounted even when muted. */
function isCameraTrack(track: TrackReference): boolean {
  return Boolean(
    track.source === Track.Source.Camera && track.publication?.track,
  );
}

function StageInner({
  onPeerLeft,
  callEndsAt,
  onBlocked,
  onLocalLeave,
  onCallExpired,
}: {
  onPeerLeft?: () => void;
  callEndsAt: number | null;
  onBlocked?: (partnerId: string) => void;
  onLocalLeave?: () => void;
  onCallExpired?: () => void;
}) {
  const { t } = useI18n();
  const peerNickname = useContext(PeerNicknameContext);
  const room = useRoomContext();
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const prevRemoteCount = useRef(0);
  const peerLeftHandled = useRef(false);
  const [landscapePhone, setLandscapePhone] = useState(false);

  const partnerId =
    remoteParticipants.find((p) => !p.isLocal)?.identity ?? null;

  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }],
    { onlySubscribed: true },
  );

  const { remote, local } = useMemo(() => {
    const remoteTrack = cameraTracks.find(
      (t) => !t.participant.isLocal && isCameraTrack(t as TrackReference),
    ) as TrackReference | undefined;
    const localTrack = cameraTracks.find(
      (t) => t.participant.isLocal && isCameraTrack(t as TrackReference),
    ) as TrackReference | undefined;
    return { remote: remoteTrack, local: localTrack };
  }, [cameraTracks]);

  const remoteSid = remote?.publication?.trackSid ?? null;
  const localSid = local?.publication?.trackSid ?? null;
  const hasRemoteVideo = Boolean(remote);
  const waitingForPeer =
    !hasRemoteVideo && remoteParticipants.length === 0 && peerNickname;
  const cameraOff = Boolean(
    localParticipant && !localParticipant.isCameraEnabled,
  );

  useEffect(() => {
    const mq = window.matchMedia(
      "(orientation: landscape) and (max-height: 500px)",
    );
    const sync = () => setLandscapePhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const count = remoteParticipants.length;
    if (
      prevRemoteCount.current > 0 &&
      count === 0 &&
      !peerLeftHandled.current
    ) {
      peerLeftHandled.current = true;
      onPeerLeft?.();
    }
    if (count > 0) {
      peerLeftHandled.current = false;
    }
    prevRemoteCount.current = count;
  }, [remoteParticipants.length, onPeerLeft]);

  return (
    <div className="call-surface absolute inset-0 h-full w-full flash-video-bg">
      <div className="call-video absolute inset-0 h-full w-full">
        {hasRemoteVideo && remote && remoteSid ? (
          <AttachedVideo
            key={remoteSid}
            trackRef={remote}
            className="h-full w-full"
          />
        ) : local && localSid ? (
          <AttachedVideo
            key={localSid}
            trackRef={local}
            className="h-full w-full"
            mirror
          />
        ) : null}
        {!hasRemoteVideo && !local ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/55 to-transparent"
        aria-hidden
      />

      {hasRemoteVideo && local && localSid ? (
        <DraggablePip>
          <AttachedVideo
            key={`pip-${localSid}`}
            trackRef={local}
            className="h-full w-full"
            mirror
          />
        </DraggablePip>
      ) : cameraOff ? (
        <div
          className="absolute bottom-[max(7rem,env(safe-area-inset-bottom))] right-4 z-20 flex h-32 w-24 flex-col items-center justify-center gap-1 rounded-[1.25rem] border border-[var(--ink-600)] bg-[var(--ink-900)]/90 text-[var(--cam-paper)]/70 shadow-[var(--elev-1)] sm:bottom-32 sm:h-40 sm:w-32"
          aria-hidden
        >
          <span className="text-2xl">📷</span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide">
            off
          </span>
        </div>
      ) : null}

      {waitingForPeer ? (
        <div className="absolute left-1/2 top-24 z-20 -translate-x-1/2">
          <StatusPill variant="muted">
            {interpolate(t.call.joining, { name: peerNickname ?? "" })}
          </StatusPill>
        </div>
      ) : null}

      <CallTimer endsAt={callEndsAt} onExpire={onCallExpired} />

      <CallControlBar
        className={
          landscapePhone
            ? "absolute right-4 top-1/2 z-30 -translate-y-1/2"
            : "absolute bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 z-30 -translate-x-1/2 sm:bottom-32 sm:left-4 sm:translate-x-0"
        }
      >
        <MediaControls />
      </CallControlBar>

      {/* Block stays outside auto-hide — always reachable while panicking. */}
      {partnerId ? (
        <BlockButton
          partnerId={partnerId}
          roomId={room?.name ?? null}
          onLeave={() => onLocalLeave?.()}
          onBlocked={(id) => onBlocked?.(id)}
          className={
            landscapePhone
              ? "absolute bottom-6 right-4 z-40"
              : "absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] right-4 z-40 sm:bottom-8"
          }
        />
      ) : null}

      {peerNickname && hasRemoteVideo ? (
        <div className="absolute left-4 top-16 z-20 sm:top-[4.5rem]">
          <StatusPill
            variant="glass"
            animate={false}
            className="font-[family-name:var(--font-camera-display)] text-base !bg-[rgba(22,18,28,0.92)] !backdrop-blur-none"
          >
            {peerNickname}
          </StatusPill>
        </div>
      ) : null}

      {landscapePhone ? (
        <div className="pointer-events-none absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-40 flex justify-center px-4 md:hidden">
          <p className="rounded-[var(--radius-pill)] bg-[rgba(22,18,28,0.92)] px-4 py-2 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--cam-paper)]">
            {t.home.rotatePrompt}
          </p>
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  roomName: string;
  peerNickname: string | null;
  callEndsAt?: number | null;
  onPeerLeft?: () => void;
  onDisconnected?: () => void;
  onConnected?: () => void;
  onBlocked?: (partnerId: string) => void;
  onLocalLeave?: () => void;
  onCallExpired?: () => void;
};

export function VideoStage({
  roomName,
  peerNickname,
  callEndsAt = null,
  onPeerLeft,
  onDisconnected,
  onConnected,
  onBlocked,
  onLocalLeave,
  onCallExpired,
}: Props) {
  const { t } = useI18n();
  const [creds, setCreds] = useState<{ token: string; url: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCreds(null);
    setError(null);

    (async () => {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName }),
        });
        const data = (await res.json()) as {
          token?: string;
          url?: string;
          error?: string;
        };
        if (!res.ok || !data.token || !data.url) {
          throw new Error(data.error ?? t.call.livekitUnavailable);
        }
        if (!cancelled) setCreds({ token: data.token, url: data.url });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t.call.videoError);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomName, t.call.livekitUnavailable, t.call.videoError]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--ink-900)] px-6 text-center text-[var(--cam-paper)]">
        <p className="max-w-sm text-sm leading-relaxed text-[var(--cam-paper)]/80">
          {error}
        </p>
      </div>
    );
  }

  if (!creds) {
    return (
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(22,18,28,0.92)] text-[var(--cam-paper)]/85">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span
              aria-hidden
              className="cam-search-ring absolute inset-0 rounded-full border border-[var(--key-500)]/40"
            />
            <Spinner size="lg" />
          </div>
          <p className="font-[family-name:var(--font-camera-display)] text-lg">
            {t.browse.connectingCall}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PeerNicknameContext.Provider value={peerNickname}>
      <LiveKitRoomShell
        token={creds.token}
        url={creds.url}
        callEndsAt={callEndsAt}
        onPeerLeft={onPeerLeft}
        onDisconnected={onDisconnected}
        onConnected={onConnected}
        onBlocked={onBlocked}
        onLocalLeave={onLocalLeave}
        onCallExpired={onCallExpired}
      />
    </PeerNicknameContext.Provider>
  );
}

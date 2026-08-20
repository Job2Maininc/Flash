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
import type { RemoteParticipant, RemoteTrackPublication } from "livekit-client";
import { RoomEvent } from "livekit-client";
import type { TrackReference } from "@livekit/components-core";
import "@livekit/components-styles";
import { AttachedVideo } from "@/components/AttachedVideo";
import { CallControlBar } from "@/components/browse/CallControlBar";
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
  onPeerLeft?: () => void;
  onDisconnected?: () => void;
  onConnected?: () => void;
};

const LiveKitRoomShell = memo(function LiveKitRoomShell({
  token,
  url,
  onPeerLeft,
  onDisconnected,
  onConnected,
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
      <StageInner onPeerLeft={onPeerLeft} />
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

    const onParticipantDisconnected = (participant: RemoteParticipant) => {
      if (participant.isLocal || handled.current) return;
      handled.current = true;
      onPeerLeft?.();
    };

    const onTrackUnsubscribed = (
      _track: unknown,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      if (participant.isLocal || handled.current) return;
      if (publication.source === Track.Source.Camera) {
        handled.current = true;
        onPeerLeft?.();
      }
    };

    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
    return () => {
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
      room.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
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

function StageInner({ onPeerLeft }: { onPeerLeft?: () => void }) {
  const { t } = useI18n();
  const peerNickname = useContext(PeerNicknameContext);
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const prevRemoteCount = useRef(0);
  const peerLeftHandled = useRef(false);

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
      {/* Main stage: video stays mounted; placeholder overlays when empty */}
      <div className="call-video absolute inset-0 flex h-full w-full items-center justify-center">
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

      {/* Top vignette for header legibility */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/55 to-transparent"
        aria-hidden
      />

      {hasRemoteVideo && local && localSid ? (
        <div className="absolute bottom-28 right-4 z-20 flex h-36 w-28 items-center justify-center overflow-hidden rounded-[1.25rem] border border-[var(--ink-600)] bg-[var(--ink-800)] shadow-[var(--elev-2)] ring-1 ring-[var(--key-500)]/25 sm:bottom-32 sm:h-40 sm:w-32">
          <AttachedVideo
            key={`pip-${localSid}`}
            trackRef={local}
            className="h-full w-full"
            mirror
          />
        </div>
      ) : cameraOff ? (
        <div
          className="absolute bottom-28 right-4 z-20 flex h-36 w-28 flex-col items-center justify-center gap-1 rounded-[1.25rem] border border-[var(--ink-600)] bg-[var(--ink-900)]/90 text-[var(--cam-paper)]/70 shadow-[var(--elev-1)] sm:bottom-32 sm:h-40 sm:w-32"
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

      <CallControlBar className="absolute bottom-28 left-4 z-30 safe-bottom sm:bottom-32">
        <MediaControls />
      </CallControlBar>

      {peerNickname && hasRemoteVideo ? (
        <div className="absolute left-4 top-16 z-20 sm:top-[4.5rem]">
          <StatusPill
            variant="glass"
            animate={false}
            className="font-[family-name:var(--font-camera-display)] text-base"
          >
            {peerNickname}
          </StatusPill>
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  roomName: string;
  peerNickname: string | null;
  onPeerLeft?: () => void;
  onDisconnected?: () => void;
  onConnected?: () => void;
};

export function VideoStage({
  roomName,
  peerNickname,
  onPeerLeft,
  onDisconnected,
  onConnected,
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--ink-900)]/40 text-[var(--cam-paper)]/85 backdrop-blur-[2px]">
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
        onPeerLeft={onPeerLeft}
        onDisconnected={onDisconnected}
        onConnected={onConnected}
      />
    </PeerNicknameContext.Provider>
  );
}

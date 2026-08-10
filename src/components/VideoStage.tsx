"use client";

import {
  createContext,
  memo,
  useContext,
  useEffect,
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
import { MediaControls } from "@/components/MediaControls";
import { LocalPreview } from "@/components/LocalPreview";

const PeerNicknameContext = createContext<string | null>(null);

type RoomShellProps = {
  token: string;
  url: string;
  onPeerLeft?: () => void;
  onDisconnected?: () => void;
};

const LiveKitRoomShell = memo(function LiveKitRoomShell({
  token,
  url,
  onPeerLeft,
  onDisconnected,
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
      options={{
        disconnectOnPageLeave: true,
        videoCaptureDefaults: { facingMode: "user" },
      }}
      onDisconnected={() => onDisconnected?.()}
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

function isCameraTrack(track: TrackReference): boolean {
  return Boolean(
    track.source === Track.Source.Camera &&
      track.publication?.track &&
      !track.publication.isMuted,
  );
}

function StageInner({ onPeerLeft }: { onPeerLeft?: () => void }) {
  const peerNickname = useContext(PeerNicknameContext);
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const prevRemoteCount = useRef(0);
  const peerLeftHandled = useRef(false);

  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }],
    { onlySubscribed: true },
  );

  const remote = cameraTracks.find(
    (t) => !t.participant.isLocal && isCameraTrack(t as TrackReference),
  ) as TrackReference | undefined;
  const local = cameraTracks.find(
    (t) => t.participant.isLocal && isCameraTrack(t as TrackReference),
  ) as TrackReference | undefined;

  const hasRemoteVideo = Boolean(remote);
  const hasLocalVideo = Boolean(local);
  const waitingForPeer =
    !hasRemoteVideo && remoteParticipants.length === 0 && peerNickname;

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
    <div className="absolute inset-0 h-full w-full bg-[var(--ink)]">
      <div className="absolute inset-0 h-full w-full">
        {hasRemoteVideo && remote ? (
          <AttachedVideo trackRef={remote} className="h-full w-full" />
        ) : hasLocalVideo && local ? (
          <AttachedVideo trackRef={local} className="h-full w-full" mirror />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/60">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
          </div>
        )}
      </div>

      {hasRemoteVideo && hasLocalVideo && local ? (
        <div className="absolute bottom-28 right-4 z-20 h-36 w-28 overflow-hidden rounded-md border border-white/30 shadow-lg">
          <AttachedVideo trackRef={local} className="h-full w-full" mirror />
        </div>
      ) : localParticipant && !localParticipant.isCameraEnabled ? (
        <div
          className="absolute bottom-28 right-4 z-20 flex h-36 w-28 flex-col items-center justify-center gap-1 rounded-md border border-white/30 bg-black/60 text-white/70 shadow-lg"
          aria-hidden
        >
          <span className="text-2xl">📷</span>
          <span className="text-[10px] uppercase tracking-wide">off</span>
        </div>
      ) : null}

      {waitingForPeer ? (
        <div className="absolute left-4 right-4 top-20 z-20 rounded-md bg-black/55 px-4 py-2 text-center text-sm text-white/90 backdrop-blur-sm">
          {peerNickname} rejoint l&apos;appel…
        </div>
      ) : null}

      <div className="absolute bottom-28 left-4 z-30">
        <MediaControls />
      </div>

      {peerNickname && hasRemoteVideo ? (
        <p className="absolute left-4 top-16 z-20 font-[family-name:var(--font-display)] text-xl text-white drop-shadow">
          {peerNickname}
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  roomName: string;
  peerNickname: string | null;
  onPeerLeft?: () => void;
  onDisconnected?: () => void;
};

export function VideoStage({
  roomName,
  peerNickname,
  onPeerLeft,
  onDisconnected,
}: Props) {
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
          throw new Error(data.error ?? "Token LiveKit indisponible");
        }
        if (!cancelled) setCreds({ token: data.token, url: data.url });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur vidéo");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomName]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--ink)] px-6 text-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  if (!creds) {
    return (
      <LocalPreview className="absolute inset-0 h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white/80 backdrop-blur-[1px]">
          <p className="font-[family-name:var(--font-display)] text-lg">
            Connexion à l&apos;appel…
          </p>
        </div>
      </LocalPreview>
    );
  }

  return (
    <PeerNicknameContext.Provider value={peerNickname}>
      <LiveKitRoomShell
        token={creds.token}
        url={creds.url}
        onPeerLeft={onPeerLeft}
        onDisconnected={onDisconnected}
      />
    </PeerNicknameContext.Provider>
  );
}

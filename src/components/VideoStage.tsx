"use client";

import {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-core";
import "@livekit/components-styles";
import { MediaControls } from "@/components/MediaControls";
import { LocalPreview } from "@/components/LocalPreview";

const PeerNicknameContext = createContext<string | null>(null);

type RoomShellProps = {
  token: string;
  url: string;
};

const LiveKitRoomShell = memo(function LiveKitRoomShell({
  token,
  url,
}: RoomShellProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect
      video
      audio
      className="absolute inset-0"
      options={{ disconnectOnPageLeave: true }}
    >
      <StageInner />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
});

function StageInner() {
  const peerNickname = useContext(PeerNicknameContext);
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const cameraOn = localParticipant?.isCameraEnabled ?? false;

  const remoteTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: true },
  );
  const localTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  );

  const remote = remoteTracks.find(
    (t): t is TrackReference =>
      !t.participant.isLocal &&
      t.source === Track.Source.Camera &&
      t.publication !== undefined,
  );
  const local = localTracks.find(
    (t): t is TrackReference =>
      t.participant.isLocal &&
      t.source === Track.Source.Camera &&
      t.publication !== undefined,
  );

  const hasRemoteVideo = Boolean(remote);
  const hasLocalVideo = Boolean(local && cameraOn);
  const waitingForPeer =
    !hasRemoteVideo && remoteParticipants.length === 0 && peerNickname;

  return (
    <div className="absolute inset-0 bg-[var(--ink)]">
      {hasRemoteVideo ? (
        <VideoTrack
          trackRef={remote}
          className="h-full w-full object-cover"
        />
      ) : hasLocalVideo ? (
        <VideoTrack
          trackRef={local}
          className="h-full w-full object-cover [transform:scaleX(-1)]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/60">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
        </div>
      )}

      {hasRemoteVideo && hasLocalVideo ? (
        <div className="absolute bottom-28 right-4 overflow-hidden rounded-md border border-white/30 shadow-lg">
          <VideoTrack
            trackRef={local}
            className="h-36 w-28 object-cover [transform:scaleX(-1)]"
          />
        </div>
      ) : localParticipant && !cameraOn ? (
        <div
          className="absolute bottom-28 right-4 flex h-36 w-28 flex-col items-center justify-center gap-1 rounded-md border border-white/30 bg-black/60 text-white/70 shadow-lg"
          aria-hidden
        >
          <span className="text-2xl">📷</span>
          <span className="text-[10px] uppercase tracking-wide">off</span>
        </div>
      ) : null}

      {waitingForPeer ? (
        <div className="absolute left-4 right-4 top-20 z-10 rounded-md bg-black/55 px-4 py-2 text-center text-sm text-white/90 backdrop-blur-sm">
          {peerNickname} rejoint l&apos;appel…
        </div>
      ) : null}

      <div className="absolute bottom-28 left-4 z-30">
        <MediaControls />
      </div>

      {peerNickname && hasRemoteVideo ? (
        <p className="absolute left-4 top-16 font-[family-name:var(--font-display)] text-xl text-white drop-shadow">
          {peerNickname}
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  roomName: string;
  peerNickname: string | null;
};

export function VideoStage({ roomName, peerNickname }: Props) {
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
      <LocalPreview className="absolute inset-0">
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
      <LiveKitRoomShell token={creds.token} url={creds.url} />
    </PeerNicknameContext.Provider>
  );
}

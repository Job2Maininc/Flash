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
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

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
  const participants = useParticipants();
  const remoteCount = participants.filter((p) => !p.isLocal).length;

  const remoteTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: true },
  );
  const localTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  );

  const remote = remoteTracks.find(
    (t) => !t.participant.isLocal && t.source === Track.Source.Camera,
  );
  const local = localTracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.Camera,
  );

  return (
    <div className="absolute inset-0 bg-[var(--ink)]">
      {remote?.publication ? (
        <VideoTrack
          trackRef={remote}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-white/80">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
          <p className="font-[family-name:var(--font-display)] text-lg">
            {remoteCount === 0
              ? `En attente de ${peerNickname ?? "ton partenaire"}…`
              : `Connexion à ${peerNickname ?? "ton partenaire"}…`}
          </p>
          {remoteCount === 0 ? (
            <p className="max-w-xs text-sm text-white/50">
              Tu es connecté. Ton partenaire doit ouvrir Flash sur la même
              session — ou attends qu&apos;il rejoigne la file.
            </p>
          ) : null}
        </div>
      )}

      {local?.publication ? (
        <div className="absolute bottom-28 right-4 overflow-hidden rounded-md border border-white/30 shadow-lg">
          <VideoTrack
            trackRef={local}
            className="h-36 w-28 object-cover"
          />
        </div>
      ) : null}

      {peerNickname ? (
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
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--ink)] text-white/70">
        Préparation de l&apos;appel…
      </div>
    );
  }

  return (
    <PeerNicknameContext.Provider value={peerNickname}>
      <LiveKitRoomShell token={creds.token} url={creds.url} />
    </PeerNicknameContext.Provider>
  );
}

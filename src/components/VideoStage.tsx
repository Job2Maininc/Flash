"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

type Props = {
  roomName: string;
  peerNickname: string | null;
};

function StageInner({ peerNickname }: { peerNickname: string | null }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const remote = tracks.find(
    (t) => t.participant.isLocal === false && t.source === Track.Source.Camera,
  );
  const local = tracks.find(
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
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/80">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
          <p className="font-[family-name:var(--font-display)] text-lg">
            Connexion à {peerNickname ?? "ton match"}…
          </p>
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

      <RoomAudioRenderer />
    </div>
  );
}

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
    <LiveKitRoom
      token={creds.token}
      serverUrl={creds.url}
      connect
      video
      audio
      className="absolute inset-0"
      onError={(e) => setError(e.message)}
    >
      <StageInner peerNickname={peerNickname} />
    </LiveKitRoom>
  );
}

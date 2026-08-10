"use client";

import { useEffect, useRef } from "react";
import type { TrackReference } from "@livekit/components-core";

type Props = {
  trackRef: TrackReference;
  className?: string;
  mirror?: boolean;
};

export function AttachedVideo({ trackRef, className = "", mirror = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    const publication = trackRef.publication;
    const track = publication?.track;
    if (!element || !track) return;

    track.attach(element);
    element.muted = trackRef.participant.isLocal;
    element.playsInline = true;
    element.autoplay = true;
    element.play().catch(() => undefined);

    return () => {
      track.detach(element);
    };
  }, [trackRef]);

  return (
    <video
      ref={videoRef}
      className={className}
      playsInline
      autoPlay
      muted={trackRef.participant.isLocal}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: mirror ? "scaleX(-1)" : undefined,
        background: "#0c0a08",
      }}
    />
  );
}

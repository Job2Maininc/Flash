"use client";

import { memo, useEffect, useRef } from "react";
import type { TrackReference } from "@livekit/components-core";

type Props = {
  trackRef: TrackReference;
  className?: string;
  mirror?: boolean;
};

/**
 * Attaches a LiveKit track to a stable <video> element.
 * Re-attach only when the underlying track identity changes — not when
 * useTracks() returns a new TrackReference object on every render.
 */
export const AttachedVideo = memo(function AttachedVideo({
  trackRef,
  className = "",
  mirror = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const track = trackRef.publication?.track;
  const trackSid = trackRef.publication?.trackSid ?? null;
  const isLocal = trackRef.participant.isLocal;

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !track) return;

    track.attach(element);
    element.muted = isLocal;
    element.playsInline = true;
    element.autoplay = true;
    void element.play().catch(() => undefined);

    return () => {
      track.detach(element);
    };
  }, [track, trackSid, isLocal]);

  return (
    <video
      ref={videoRef}
      className={className}
      playsInline
      autoPlay
      muted={isLocal}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: mirror ? "scaleX(-1)" : undefined,
        background: "var(--ink-900)",
      }}
    />
  );
});

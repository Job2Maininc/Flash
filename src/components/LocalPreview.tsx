"use client";

import type { ReactNode } from "react";
import { useLocalMediaStream } from "@/hooks/useLocalMediaStream";

type Props = {
  active?: boolean;
  className?: string;
  children?: ReactNode;
  onReady?: () => void;
  onError?: (message: string) => void;
};

export function LocalPreview({
  active = true,
  className = "",
  children,
  onReady,
  onError,
}: Props) {
  const { videoRef, ready, error } = useLocalMediaStream(active, {
    onReady,
    onError,
  });

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[var(--ink)] ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full object-contain [transform:scaleX(-1)] ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {!ready ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2a2218_0%,_#0c0a08_55%)]" />
      ) : null}

      {error ? (
        <p className="absolute bottom-4 left-4 right-4 text-center text-xs text-white/50">
          {error}
        </p>
      ) : null}

      {children}
    </div>
  );
}

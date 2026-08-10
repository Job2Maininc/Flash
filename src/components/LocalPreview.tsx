"use client";

import type { ReactNode } from "react";
import { useLocalMediaStream } from "@/hooks/useLocalMediaStream";

type Props = {
  active?: boolean;
  className?: string;
  children?: ReactNode;
};

export function LocalPreview({ active = true, className = "", children }: Props) {
  const { videoRef, ready, error } = useLocalMediaStream(active);

  return (
    <div className={`relative overflow-hidden bg-[var(--ink)] ${className}`}>
      {ready ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover [transform:scaleX(-1)]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2a2218_0%,_#0c0a08_55%)]" />
      )}

      {error ? (
        <p className="absolute bottom-4 left-4 right-4 text-center text-xs text-white/50">
          {error}
        </p>
      ) : null}

      {children}
    </div>
  );
}

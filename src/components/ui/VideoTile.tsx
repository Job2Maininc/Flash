"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type VideoTileProps = {
  /** Poster / still frame. Required until real clips ship. */
  src: string;
  alt: string;
  /** Optional silent loop clip (webm/mp4). Drop in later. */
  videoSrc?: string;
  className?: string;
  priority?: boolean;
  dimmed?: boolean;
  connected?: boolean;
  style?: CSSProperties;
};

/**
 * Hero tile. Still + Ken Burns for now; pass `videoSrc` when clips exist
 * (`muted playsInline loop preload="metadata"`).
 * On image error: gradient placeholder only — never visible alt text.
 */
export function VideoTile({
  src,
  alt,
  videoSrc,
  className,
  priority = false,
  dimmed = false,
  connected = false,
  style,
}: VideoTileProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "cam-tile relative aspect-[3/4] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--ink-800)]",
        "shadow-[var(--elev-1)] transition-[opacity,filter,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        dimmed && "opacity-45 saturate-[.6]",
        connected && "z-[2] scale-[1.04]",
        className,
      )}
      style={style}
    >
      {!failed ? (
        videoSrc ? (
          <video
            className="cam-tile-media h-full w-full object-cover"
            src={videoSrc}
            poster={src}
            muted
            playsInline
            loop
            preload="metadata"
            aria-label={alt}
            onError={() => setFailed(true)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            priority={priority}
            className="cam-tile-media object-cover"
            onError={() => setFailed(true)}
          />
        )
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_var(--ink-600)_0%,_var(--ink-800)_55%,_var(--ink-900)_100%)]"
        />
      )}
      {/* Screen-reader label when media failed (no visible caption). */}
      {failed ? <span className="sr-only">{alt}</span> : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink-900)]/55 via-transparent to-transparent"
      />
    </div>
  );
}

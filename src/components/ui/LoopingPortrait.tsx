"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  /** Still frame / poster — required so the component works without a clip. */
  poster: string;
  /** Optional muted looping clip (webm/mp4). When omitted, poster shows alone. */
  src?: string;
  className?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
};

/**
 * Decorative portrait that upgrades to a silent loop when `src` is provided.
 * No rebuild needed when clips are added later.
 */
export function LoopingPortrait({
  poster,
  src,
  className,
  sizes = "120px",
  quality = 60,
  priority = false,
}: Props) {
  if (src) {
    return (
      <video
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          className,
        )}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster={poster}
        aria-hidden
      >
        <source src={src} />
      </video>
    );
  }

  return (
    <Image
      src={poster}
      alt=""
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}

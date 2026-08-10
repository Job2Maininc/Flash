"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

const baseBtn =
  "flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-white backdrop-blur-sm transition active:scale-95 disabled:opacity-40 [&_svg]:h-5 [&_svg]:w-5";

export function MediaControls() {
  return (
    <div
      className="pointer-events-auto flex items-center gap-3"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
    >
      <TrackToggle
        source={Track.Source.Microphone}
        showIcon
        aria-label="Activer ou couper le micro"
        className={baseBtn}
      />
      <TrackToggle
        source={Track.Source.Camera}
        showIcon
        aria-label="Activer ou couper la caméra"
        className={baseBtn}
      />
    </div>
  );
}

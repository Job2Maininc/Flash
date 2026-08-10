"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

const baseBtn =
  "flash-btn flash-btn-ghost-dark flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12 [&_svg]:h-5 [&_svg]:w-5";

export function MediaControls() {
  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5"
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

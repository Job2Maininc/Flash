"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

const baseBtn = cn(
  "flex h-14 w-14 items-center justify-center rounded-full sm:h-12 sm:w-12",
  "border border-[var(--ink-600)] bg-[var(--ink-800)] text-[var(--cam-paper)]",
  "transition-[background-color,border-color,transform] duration-[var(--dur-fast)]",
  "hover:border-[var(--ink-700)] hover:bg-[var(--ink-700)] active:scale-[.97]",
  "[&_svg]:h-5 [&_svg]:w-5",
);

export function MediaControls() {
  const { t } = useI18n();

  return (
    <div
      className="call-chrome pointer-events-auto flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[rgba(22,18,28,0.92)] p-1.5 shadow-[var(--elev-1)]"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
    >
      <TrackToggle
        source={Track.Source.Microphone}
        showIcon
        aria-label={t.call.mic}
        className={baseBtn}
      />
      <TrackToggle
        source={Track.Source.Camera}
        showIcon
        aria-label={t.call.camera}
        className={baseBtn}
      />
    </div>
  );
}

"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

const baseBtn = cn(
  "flex h-11 w-11 items-center justify-center rounded-full sm:h-11 sm:w-11",
  "border border-[var(--ink-600)] bg-[var(--ink-800)]/70 text-[var(--cam-paper)] backdrop-blur-md",
  "transition-[background-color,border-color,transform] duration-[var(--dur-fast)]",
  "hover:border-[var(--ink-700)] hover:bg-[var(--ink-700)] active:scale-[.97]",
  "[&_svg]:h-5 [&_svg]:w-5",
);

export function MediaControls() {
  const { t } = useI18n();

  return (
    <div
      className="pointer-events-auto flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 p-1.5 shadow-[var(--elev-1)] backdrop-blur-xl"
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

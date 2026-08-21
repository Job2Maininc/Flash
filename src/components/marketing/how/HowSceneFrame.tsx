"use client";

import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { SceneSetup } from "@/components/marketing/how/SceneSetup";
import { SceneCall } from "@/components/marketing/how/SceneCall";
import { SceneMatch } from "@/components/marketing/how/SceneMatch";
import { cn } from "@/lib/cn";

type Props = {
  step: 0 | 1 | 2;
  label?: string;
  reducedMotion?: boolean;
  className?: string;
};

/** Shared sticky/static device frame that crossfades How-it-works scenes. */
export function HowSceneFrame({
  step,
  label,
  reducedMotion = false,
  className,
}: Props) {
  return (
    <div className={cn("relative w-full max-w-[min(100%,380px)]", className)}>
      {/* Warm skin-tone glow — only behind this frame, nowhere else */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] z-0 h-[70%] w-[85%] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,168,120,0.28) 0%, rgba(196,110,78,0.12) 42%, transparent 72%)",
        }}
      />
      <DeviceFrame label={label} className="relative z-[1] w-full">
        <div className="absolute inset-0 overflow-hidden bg-[var(--ink-900)]">
          <SceneSetup active={step === 0} reducedMotion={reducedMotion} />
          <SceneCall active={step === 1} reducedMotion={reducedMotion} />
          <SceneMatch active={step === 2} reducedMotion={reducedMotion} />
        </div>
      </DeviceFrame>
    </div>
  );
}

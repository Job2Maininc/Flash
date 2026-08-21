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
    <DeviceFrame
      label={label}
      className={cn("w-full max-w-[min(100%,380px)]", className)}
    >
      <div className="absolute inset-0 overflow-hidden bg-[var(--ink-900)]">
        <SceneSetup active={step === 0} reducedMotion={reducedMotion} />
        <SceneCall active={step === 1} reducedMotion={reducedMotion} />
        <SceneMatch active={step === 2} reducedMotion={reducedMotion} />
      </div>
    </DeviceFrame>
  );
}

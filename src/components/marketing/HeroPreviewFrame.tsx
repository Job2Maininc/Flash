"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { useI18n } from "@/components/LocaleProvider";
import { useLocalPreview } from "@/hooks/useLocalPreview";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

/**
 * Hero live frame — local camera preview only, with call-UI chrome as decoration.
 */
export function HeroPreviewFrame({ className }: Props) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const { status, videoRef, start, stop } = useLocalPreview({ rootRef });
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const showIdlePortrait =
    status === "idle" || status === "unsupported" || status === "denied";

  useEffect(() => {
    if (!showIdlePortrait) return;
    const id = window.setInterval(() => {
      setPortraitIndex((i) => (i + 1) % Math.min(HERO_PORTRAITS.length, 8));
    }, 4200);
    return () => window.clearInterval(id);
  }, [showIdlePortrait]);

  useEffect(() => {
    if (status !== "live") {
      setElapsed(0);
      return;
    }
    const started = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const portrait = HERO_PORTRAITS[portraitIndex] ?? HERO_PORTRAITS[0];
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div
      ref={rootRef}
      className={cn(
        "mx-auto w-full max-w-[min(100%,380px)] lg:mx-0 lg:justify-self-end",
        className,
      )}
    >
      <DeviceFrame
        className={cn(
          status === "requesting" && "cam-hero-pulse",
        )}
      >
        <div className="absolute inset-0 overflow-hidden bg-[var(--ink-900)]">
          {/* Idle / fallback portrait crossfade */}
          {showIdlePortrait && portrait ? (
            <div className="absolute inset-0" aria-hidden>
              <Image
                key={portrait.src}
                src={portrait.src}
                alt=""
                fill
                sizes="380px"
                quality={60}
                priority
                className="object-cover opacity-90 transition-opacity duration-[var(--dur-slow)]"
              />
              <div className="absolute inset-0 bg-[var(--ink-900)]/45" />
            </div>
          ) : null}

          {/* Live local video — never leaves this element */}
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              status === "live" ? "scale-x-[-1]" : "pointer-events-none opacity-0",
            )}
          />

          {status === "idle" ? (
            <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 px-5 text-center">
              <button
                type="button"
                onClick={() => void start()}
                className="rounded-[var(--radius-pill)] border border-[var(--cam-paper)]/35 bg-[var(--ink-900)]/70 px-5 py-3 text-sm font-medium text-[var(--cam-paper)] backdrop-blur-md transition hover:border-[var(--cam-paper)]/60 active:scale-[.97]"
              >
                {t.home.previewShowMe}
              </button>
              <p className="max-w-[28ch] text-[12px] leading-relaxed text-[var(--cam-paper)]/80 text-pretty">
                {t.home.previewPrivacy}
              </p>
            </div>
          ) : null}

          {status === "requesting" ? (
            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[var(--ink-900)]/50 px-5 text-center">
              <p className="text-sm font-medium text-[var(--cam-paper)]">
                {t.home.previewWaiting}
              </p>
            </div>
          ) : null}

          {status === "denied" ? (
            <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 px-5 text-center">
              <p className="max-w-[30ch] text-sm leading-relaxed text-[var(--cam-paper)] text-pretty">
                {t.home.previewDenied}
              </p>
              <button
                type="button"
                onClick={() => void start()}
                className="rounded-[var(--radius-pill)] border border-[var(--cam-paper)]/35 bg-[var(--ink-900)]/70 px-5 py-2.5 text-sm font-medium text-[var(--cam-paper)] backdrop-blur-md"
              >
                {t.home.previewRetry}
              </button>
            </div>
          ) : null}

          {status === "live" ? (
            <>
              <div
                className="absolute left-3 top-3 z-[2] inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 px-2.5 py-1 text-[11px] font-medium text-[var(--cam-paper)] backdrop-blur-md"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
                Live
              </div>
              <div
                className="absolute right-3 top-3 z-[2] rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[var(--cam-paper)] backdrop-blur-md"
                aria-hidden
              >
                {mm}:{ss}
              </div>

              {/* Decorative call chrome — Report · Camera · Pass · Like */}
              <div
                className="pointer-events-none absolute inset-x-3 bottom-3 z-[2] flex items-center justify-center gap-2"
                aria-hidden
              >
                <FakeControl label="⚑" />
                <FakeControl label="◎" />
                <FakeControl label="✕" />
                <FakeControl label="♥" accent />
              </div>

              <button
                type="button"
                onClick={() => stop()}
                className="absolute bottom-[3.75rem] left-1/2 z-[3] -translate-x-1/2 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/70 px-3 py-1.5 text-[11px] font-medium text-[var(--cam-paper)] backdrop-blur-md"
              >
                {t.home.previewCamOff}
              </button>
            </>
          ) : null}
        </div>
      </DeviceFrame>
    </div>
  );
}

function FakeControl({
  label,
  accent = false,
}: {
  label: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-[10px] backdrop-blur-md",
        accent
          ? "bg-[var(--key-500)] text-[var(--paper)] shadow-[var(--glow-key)]"
          : "border border-[var(--ink-600)] bg-[var(--ink-800)]/80 text-[var(--cam-paper)]",
      )}
    >
      {label}
    </span>
  );
}

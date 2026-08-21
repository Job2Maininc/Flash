"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/components/LocaleProvider";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
import {
  playDemoRingtone,
  readRingSoundEnabled,
  writeRingSoundEnabled,
} from "@/lib/ring-sound";
import { cn } from "@/lib/cn";

type Props = {
  active: boolean;
  reducedMotion?: boolean;
};

/**
 * Step 1 — ringing rings, then cut to a live face with timer + waveform.
 * Ringtone is opt-in (localStorage); never autoplays with sound by default.
 */
export function SceneCall({ active, reducedMotion = false }: Props) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"ring" | "live">(
    reducedMotion ? "live" : "ring",
  );
  const [elapsed, setElapsed] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const peer = HERO_PORTRAITS[4];
  const self = HERO_PORTRAITS[1];

  useEffect(() => {
    setSoundOn(readRingSoundEnabled());
  }, []);

  useEffect(() => {
    if (!active) {
      setPhase(reducedMotion ? "live" : "ring");
      setElapsed(0);
      return;
    }
    if (reducedMotion) {
      setPhase("live");
      return;
    }
    if (soundOn) {
      void playDemoRingtone();
    }
    const cut = window.setTimeout(() => setPhase("live"), 1600);
    return () => window.clearTimeout(cut);
  }, [active, reducedMotion, soundOn]);

  useEffect(() => {
    if (!active || phase !== "live") return;
    const started = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [active, phase]);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    writeRingSoundEnabled(next);
    if (next && active && phase === "ring") {
      void playDemoRingtone();
    }
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div
      className={cn(
        "absolute inset-0 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
        active
          ? "z-[1] translate-y-0 opacity-100"
          : "pointer-events-none z-0 translate-y-2 opacity-0",
      )}
      {...(!active ? { "aria-hidden": true } : {})}
    >
      {/* Ringing */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--ink-900)] transition-opacity duration-[var(--dur-slow)]",
          phase === "ring"
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span className="cam-how-ring absolute inset-0 rounded-full border border-[var(--cam-paper)]/25" />
          <span className="cam-how-ring cam-how-ring-delay absolute inset-2 rounded-full border border-[var(--cam-paper)]/20" />
          <span className="cam-how-ring cam-how-ring-delay-2 absolute inset-4 rounded-full border border-[var(--key-500)]/35" />
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[var(--ink-600)] bg-[var(--ink-800)]">
            {peer ? (
              <Image
                src={peer.src}
                alt=""
                fill
                sizes="64px"
                quality={60}
                className="object-cover"
              />
            ) : null}
          </div>
        </div>
        <p className="text-sm font-medium text-[var(--cam-paper)]">
          {t.home.howDemo.ringing}
        </p>
        <button
          type="button"
          onClick={toggleSound}
          className="pointer-events-auto absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/70 px-2.5 py-1.5 text-[11px] font-medium text-[var(--cam-paper)] backdrop-blur-md"
          aria-pressed={soundOn}
          aria-label={soundOn ? t.home.howDemo.soundOn : t.home.howDemo.soundOff}
        >
          <SpeakerIcon on={soundOn} />
          {soundOn ? t.home.howDemo.soundOnShort : t.home.howDemo.soundOffShort}
        </button>
      </div>

      {/* Live */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[var(--dur-slow)]",
          phase === "live" ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0" aria-hidden>
          {peer ? (
            <Image
              src={peer.src}
              alt=""
              fill
              sizes="380px"
              quality={60}
              className="object-cover"
            />
          ) : null}
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--ink-900)]/85 via-transparent to-[var(--ink-900)]/40"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 px-2.5 py-1 text-[11px] font-medium text-[var(--cam-paper)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" aria-hidden />
          Live
        </div>
        <div className="absolute right-3 top-3 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[var(--cam-paper)] backdrop-blur-md">
          {mm}:{ss}
        </div>

        <div
          className="absolute bottom-20 left-3 right-3 flex h-8 items-end justify-center gap-0.5"
          aria-hidden
        >
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              className="cam-how-wave w-1 rounded-full bg-[var(--cam-paper)]/70"
              style={{ animationDelay: `${(i % 8) * 0.08}s` }}
            />
          ))}
        </div>

        <div
          className="absolute bottom-16 right-3 h-20 w-14 overflow-hidden rounded-[0.75rem] border border-[var(--ink-600)] shadow-[var(--elev-1)] ring-1 ring-[var(--key-500)]/30"
          aria-hidden
        >
          <div className="relative h-full w-full">
            {self ? (
              <Image
                src={self.src}
                alt=""
                fill
                sizes="80px"
                quality={60}
                className="object-cover"
              />
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          className="pointer-events-auto absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/70 px-2.5 py-1.5 text-[11px] font-medium text-[var(--cam-paper)] backdrop-blur-md"
          aria-pressed={soundOn}
          aria-label={soundOn ? t.home.howDemo.soundOn : t.home.howDemo.soundOff}
        >
          <SpeakerIcon on={soundOn} />
          {soundOn ? t.home.howDemo.soundOnShort : t.home.howDemo.soundOffShort}
        </button>
      </div>
    </div>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 10v4h3l5 4V6l-5 4H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {on ? (
        <path
          d="M16 9.5c1.2.9 1.2 4.1 0 5M18.5 7c2.2 1.8 2.2 8.2 0 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M16 10l4 4M20 10l-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

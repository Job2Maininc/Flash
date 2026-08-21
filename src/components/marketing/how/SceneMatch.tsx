"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/LocaleProvider";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
import { cn } from "@/lib/cn";

type Props = {
  active: boolean;
  reducedMotion?: boolean;
};

type MatchChip = {
  id: string;
  src: string;
};

const THRESHOLD = 100;
const MAX_ROT = 10;
/** Same peer as SceneCall first — continuity: you’re still in that call. */
const CALL_PEERS = [
  HERO_PORTRAITS[4],
  HERO_PORTRAITS[6],
  HERO_PORTRAITS[9],
].filter(Boolean);
const SELF = HERO_PORTRAITS[1];

type DemoPhase = "live" | "auto-swipe" | "match" | "play";

/**
 * Step 2 — swipe happens on the live call (not a photo card), then match.
 */
export function SceneMatch({ active, reducedMotion = false }: Props) {
  const { t } = useI18n();
  const descId = useId();
  const liveId = useId();
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<MatchChip[]>([]);
  const [liveMsg, setLiveMsg] = useState("");
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const [demo, setDemo] = useState<DemoPhase>("live");
  const [elapsed, setElapsed] = useState(12);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const interactive = demo === "play";
  const peer = CALL_PEERS[index];
  const done = index >= CALL_PEERS.length;
  const demoPeer = CALL_PEERS[0];

  useEffect(() => {
    if (!active) {
      setIndex(0);
      setMatches([]);
      setLiveMsg("");
      setOffsetX(0);
      setExitDir(null);
      setDragging(false);
      setDemo("live");
      setElapsed(12);
      startRef.current = null;
      return;
    }

    if (reducedMotion) {
      setDemo("play");
      setElapsed(18);
      return;
    }

    setDemo("live");
    setIndex(0);
    setMatches([]);
    setElapsed(12);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setDemo("auto-swipe"), 900));
    timers.push(
      window.setTimeout(() => {
        if (demoPeer) {
          setMatches([{ id: `demo-${demoPeer.src}`, src: demoPeer.src }]);
          setLiveMsg(t.browse.itsAMatch);
        }
        setDemo("match");
      }, 1750),
    );
    timers.push(
      window.setTimeout(() => {
        setIndex(1);
        setElapsed(4);
        setDemo("play");
      }, 3400),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active, reducedMotion, demoPeer, t.browse.itsAMatch]);

  useEffect(() => {
    if (!active || (demo !== "live" && demo !== "play" && demo !== "auto-swipe"))
      return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active, demo]);

  const commit = useCallback(
    (dir: "left" | "right") => {
      if (!interactive) return;
      const card = CALL_PEERS[index];
      if (!card) return;
      setExitDir(dir);
      window.setTimeout(() => {
        if (dir === "right") {
          setMatches((prev) => [
            ...prev,
            { id: `${card.src}-${index}`, src: card.src },
          ]);
          setLiveMsg(t.home.howDemo.keptLive);
        } else {
          setLiveMsg(t.home.howDemo.passedLive);
        }
        setIndex((i) => i + 1);
        setOffsetX(0);
        setExitDir(null);
        setDragging(false);
        setElapsed(3);
        startRef.current = null;
      }, reducedMotion ? 0 : 280);
    },
    [
      index,
      interactive,
      reducedMotion,
      t.home.howDemo.keptLive,
      t.home.howDemo.passedLive,
    ],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || reducedMotion || done || exitDir) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || !startRef.current || reducedMotion) return;
    setOffsetX(e.clientX - startRef.current.x);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (offsetX >= THRESHOLD) commit("right");
    else if (offsetX <= -THRESHOLD) commit("left");
    else {
      setOffsetX(0);
      setDragging(false);
      startRef.current = null;
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || done || exitDir) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      commit("right");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      commit("left");
    }
  };

  const rot = Math.max(-MAX_ROT, Math.min(MAX_ROT, (offsetX / 120) * MAX_ROT));
  const keepOpacity =
    demo === "auto-swipe"
      ? 1
      : Math.min(1, Math.max(0, offsetX / THRESHOLD));
  const passOpacity = Math.min(1, Math.max(0, -offsetX / THRESHOLD));

  const showCallSurface =
    demo === "live" ||
    demo === "auto-swipe" ||
    (interactive && !done && peer);

  const callStyle: CSSProperties | undefined =
    demo === "auto-swipe"
      ? undefined
      : exitDir
        ? {
            transform: `translateX(${exitDir === "right" ? 110 : -110}%) rotate(${exitDir === "right" ? MAX_ROT : -MAX_ROT}deg)`,
            opacity: 0,
            transition:
              "transform 280ms var(--ease-out), opacity 280ms var(--ease-out)",
          }
        : interactive
          ? {
              transform: `translateX(${offsetX}px) rotate(${rot}deg)`,
              transition: dragging ? "none" : "transform 320ms var(--ease-out)",
            }
          : undefined;

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const surfacePeer =
    demo === "live" || demo === "auto-swipe" || demo === "match"
      ? demoPeer
      : peer;

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
        active
          ? "z-[1] translate-y-0 opacity-100"
          : "pointer-events-none z-0 translate-y-2 opacity-0",
      )}
      {...(!active ? { "aria-hidden": true } : {})}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {showCallSurface && surfacePeer ? (
          <div
            role={interactive ? "button" : undefined}
            tabIndex={interactive && active ? 0 : -1}
            aria-describedby={interactive ? descId : undefined}
            aria-label={interactive ? t.home.howDemo.swipeCardLabel : undefined}
            onKeyDown={interactive ? onKeyDown : undefined}
            onPointerDown={interactive ? onPointerDown : undefined}
            onPointerMove={interactive ? onPointerMove : undefined}
            onPointerUp={interactive ? onPointerUp : undefined}
            onPointerCancel={interactive ? onPointerUp : undefined}
            className={cn(
              "absolute inset-0 touch-none select-none outline-none",
              interactive &&
                "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--key-500)]",
              demo === "auto-swipe" && "cam-how-auto-swipe",
            )}
            style={demo === "auto-swipe" ? undefined : callStyle}
          >
            <LiveCallChrome
              peerSrc={surfacePeer.src}
              selfSrc={SELF?.src}
              timer={`${mm}:${ss}`}
              keepLabel={t.home.howDemo.keep}
              passLabel={t.home.howDemo.pass}
              keepOpacity={keepOpacity}
              passOpacity={passOpacity}
              hint={
                demo === "live"
                  ? t.browse.swipeHint
                  : interactive
                    ? t.home.howDemo.swipeHint
                    : null
              }
            />
          </div>
        ) : null}

        {demo === "match" && demoPeer ? (
          <div className="cam-how-match-burst absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-[var(--ink-900)]/92 px-4 text-center backdrop-blur-sm">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--key-500)] shadow-[var(--glow-key)]">
              <Image
                src={demoPeer.src}
                alt=""
                fill
                sizes="80px"
                quality={60}
                className="object-cover"
              />
            </div>
            <p className="font-[family-name:var(--font-camera-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)]">
              {t.browse.itsAMatch}
            </p>
            <p className="max-w-[22ch] text-xs text-[var(--muted)]">
              {t.home.howDemo.keptLive}
            </p>
          </div>
        ) : null}

        {interactive && done ? (
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 bg-[var(--ink-900)] px-4 text-center">
            <p className="text-sm text-[var(--muted)]">
              {t.home.howDemo.deckEmpty}
            </p>
            <Link
              href="/join"
              className="rounded-[var(--radius-pill)] bg-[var(--key-500)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] shadow-[var(--glow-key)]"
              tabIndex={active ? 0 : -1}
            >
              {t.join.startChat}
            </Link>
          </div>
        ) : null}

        {reducedMotion && interactive && !done ? (
          <div className="absolute inset-x-3 bottom-3 z-[3] flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/80 py-2 text-xs font-medium text-[var(--cam-paper)] backdrop-blur-md"
              onClick={() => commit("left")}
            >
              {t.home.howDemo.pass}
            </button>
            <button
              type="button"
              className="flex-1 rounded-[var(--radius-pill)] bg-[var(--key-500)] py-2 text-xs font-medium text-[var(--paper)]"
              onClick={() => commit("right")}
            >
              {t.home.howDemo.keep}
            </button>
          </div>
        ) : null}
      </div>

      <p id={descId} className="sr-only">
        {t.home.howDemo.swipeHint}
      </p>
      <p id={liveId} className="sr-only" aria-live="polite">
        {liveMsg}
      </p>

      <div className="shrink-0 border-t border-[var(--ink-700)] bg-[var(--ink-900)] px-3 py-2.5">
        <p className="text-[10px] font-medium text-[var(--muted)]">
          {t.nav.matches}
        </p>
        <ul className="mt-1.5 flex min-h-10 flex-wrap gap-2">
          {matches.map((m) => (
            <li
              key={m.id}
              className="cam-how-match-chip inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-800)] py-1 pl-1 pr-2"
            >
              <span className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={m.src}
                  alt=""
                  fill
                  sizes="24px"
                  quality={60}
                  className="object-cover"
                />
              </span>
              <button
                type="button"
                tabIndex={-1}
                className="pointer-events-none text-[10px] font-medium text-[var(--key-400)]"
              >
                {t.matches.recall}
              </button>
            </li>
          ))}
          {matches.length === 0 ? (
            <li className="text-[10px] text-[var(--faint)]">
              {t.home.howDemo.matchesEmpty}
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

function LiveCallChrome({
  peerSrc,
  selfSrc,
  timer,
  keepLabel,
  passLabel,
  keepOpacity,
  passOpacity,
  hint,
}: {
  peerSrc: string;
  selfSrc?: string;
  timer: string;
  keepLabel: string;
  passLabel: string;
  keepOpacity: number;
  passOpacity: number;
  hint: string | null;
}) {
  return (
    <>
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={peerSrc}
          alt=""
          fill
          sizes="380px"
          quality={60}
          className="object-cover"
          draggable={false}
        />
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
        {timer}
      </div>

      <span
        aria-hidden
        className="absolute left-3 top-12 rounded-[var(--radius-md)] border-2 border-[var(--live)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--live)]"
        style={{ opacity: keepOpacity }}
      >
        {keepLabel}
      </span>
      <span
        aria-hidden
        className="absolute right-3 top-12 rounded-[var(--radius-md)] border-2 border-[var(--muted)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--cam-paper)]"
        style={{ opacity: passOpacity }}
      >
        {passLabel}
      </span>

      <div
        className="absolute bottom-24 left-3 right-3 flex h-8 items-end justify-center gap-0.5"
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

      {selfSrc ? (
        <div
          className="absolute bottom-20 right-3 h-20 w-14 overflow-hidden rounded-[0.75rem] border border-[var(--ink-600)] shadow-[var(--elev-1)] ring-1 ring-[var(--key-500)]/30"
          aria-hidden
        >
          <div className="relative h-full w-full">
            <Image
              src={selfSrc}
              alt=""
              fill
              sizes="80px"
              quality={60}
              className="object-cover"
              draggable={false}
            />
          </div>
        </div>
      ) : null}

      {hint ? (
        <p className="absolute bottom-3 left-3 right-3 text-center text-[11px] font-medium text-[var(--cam-paper)]/90">
          {hint}
        </p>
      ) : null}
    </>
  );
}

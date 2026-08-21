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
const MAX_ROT = 12;
const DECK = [HERO_PORTRAITS[2], HERO_PORTRAITS[6], HERO_PORTRAITS[9]].filter(
  Boolean,
);

type DemoPhase = "intro" | "auto-swipe" | "match" | "play";

/**
 * Step 2 — auto swipe → “It’s a match”, then a playable stack.
 * CSS transforms only (no framer-motion).
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
  const [demo, setDemo] = useState<DemoPhase>("intro");
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const interactive = demo === "play";
  const current = DECK[index];
  const done = index >= DECK.length;
  const demoCard = DECK[0];

  useEffect(() => {
    if (!active) {
      setIndex(0);
      setMatches([]);
      setLiveMsg("");
      setOffsetX(0);
      setExitDir(null);
      setDragging(false);
      setDemo("intro");
      startRef.current = null;
      return;
    }

    if (reducedMotion) {
      setDemo("play");
      return;
    }

    setDemo("intro");
    setIndex(0);
    setMatches([]);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setDemo("auto-swipe"), 450));
    timers.push(
      window.setTimeout(() => {
        if (demoCard) {
          setMatches([{ id: `demo-${demoCard.src}`, src: demoCard.src }]);
          setLiveMsg(t.browse.itsAMatch);
        }
        setDemo("match");
      }, 1200),
    );
    timers.push(
      window.setTimeout(() => {
        setIndex(1);
        setDemo("play");
      }, 2800),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active, reducedMotion, demoCard, t.browse.itsAMatch]);

  const commit = useCallback(
    (dir: "left" | "right") => {
      if (!interactive) return;
      const card = DECK[index];
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

  const showDemoCard =
    demo === "intro" || demo === "auto-swipe" || demo === "match";
  const showPlayCard = interactive && !done && current;

  const cardStyle: CSSProperties | undefined =
    demo === "auto-swipe"
      ? undefined
      : exitDir
        ? {
            transform: `translateX(${exitDir === "right" ? 140 : -140}%) rotate(${exitDir === "right" ? MAX_ROT : -MAX_ROT}deg)`,
            opacity: 0,
            transition:
              "transform 280ms var(--ease-out), opacity 280ms var(--ease-out)",
          }
        : {
            transform: `translateX(${offsetX}px) rotate(${rot}deg)`,
            transition: dragging ? "none" : "transform 320ms var(--ease-out)",
          };

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
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="font-[family-name:var(--font-camera-display)] text-lg font-bold text-[var(--cam-paper)]">
          Flash
        </span>
        <span className="text-[11px] font-medium text-[var(--muted)]">
          {t.home.howFrameLabels[2]}
        </span>
      </div>

      <div className="relative mx-3 mt-3 min-h-0 flex-1">
        {showDemoCard && demoCard ? (
          <div
            className={cn(
              "absolute inset-x-2 top-2 bottom-16 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ink-600)] bg-[var(--ink-800)] shadow-[var(--elev-2)]",
              demo === "auto-swipe" && "cam-how-auto-swipe",
              demo === "match" && "pointer-events-none opacity-0",
            )}
            style={demo === "auto-swipe" ? undefined : (cardStyle ?? undefined)}
            aria-hidden
          >
            <div className="relative h-full w-full">
              <Image
                src={demoCard.src}
                alt=""
                fill
                sizes="280px"
                quality={60}
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-900)]/70 via-transparent to-transparent" />
              <span
                className="absolute left-3 top-3 rounded-[var(--radius-md)] border-2 border-[var(--live)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--live)]"
                style={{ opacity: keepOpacity }}
              >
                {t.home.howDemo.keep}
              </span>
            </div>
          </div>
        ) : null}

        {demo === "match" && demoCard ? (
          <div className="cam-how-match-burst absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--key-500)] shadow-[var(--glow-key)]">
              <Image
                src={demoCard.src}
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
            <p className="text-xs text-[var(--muted)]">
              {t.home.howDemo.keptLive}
            </p>
          </div>
        ) : null}

        {showPlayCard && current ? (
          <div
            ref={cardRef}
            role="button"
            tabIndex={active ? 0 : -1}
            aria-describedby={descId}
            aria-label={t.home.howDemo.swipeCardLabel}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-x-2 top-2 bottom-16 touch-none select-none overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ink-600)] bg-[var(--ink-800)] shadow-[var(--elev-2)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--key-500)]"
            style={cardStyle}
          >
            <div className="relative h-full w-full">
              <Image
                src={current.src}
                alt=""
                fill
                sizes="280px"
                quality={60}
                className="object-cover"
                draggable={false}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[var(--ink-900)]/70 via-transparent to-transparent"
              />
              <span
                aria-hidden
                className="absolute left-3 top-3 rounded-[var(--radius-md)] border-2 border-[var(--live)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--live)]"
                style={{ opacity: keepOpacity }}
              >
                {t.home.howDemo.keep}
              </span>
              <span
                aria-hidden
                className="absolute right-3 top-3 rounded-[var(--radius-md)] border-2 border-[var(--muted)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--cam-paper)]"
                style={{ opacity: passOpacity }}
              >
                {t.home.howDemo.pass}
              </span>
            </div>
          </div>
        ) : null}

        {interactive && done ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
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
          <div className="absolute inset-x-2 bottom-2 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-800)] py-2 text-xs font-medium text-[var(--cam-paper)]"
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

      <div className="border-t border-[var(--ink-700)] px-3 py-2.5">
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

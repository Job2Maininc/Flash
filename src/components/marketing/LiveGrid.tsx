"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { LiveBadge } from "@/components/ui/Badge";
import { CountUp } from "@/components/ui/CountUp";
import { VideoTile } from "@/components/ui/VideoTile";
import { useI18n } from "@/components/LocaleProvider";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { shouldShowLiveCount } from "@/lib/live-count";

export type GridPortrait = {
  src: string;
  alt: string;
  videoSrc?: string;
};

type Props = {
  portraits: GridPortrait[];
  talkingSuffix: string;
  className?: string;
};

function centerOutOrder(cols: number, rows: number): number[] {
  const total = cols * rows;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  return Array.from({ length: total }, (_, i) => i).sort((a, b) => {
    const ax = a % cols;
    const ay = Math.floor(a / cols);
    const bx = b % cols;
    const by = Math.floor(b / cols);
    const da = (ax - cx) ** 2 + (ay - cy) ** 2;
    const db = (bx - cx) ** 2 + (by - cy) ** 2;
    return da - db;
  });
}

export function LiveGrid({ portraits, talkingSuffix, className }: Props) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const online = useOnlineCount();
  const rootRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cols, setCols] = useState(5);
  const [connected, setConnected] = useState<[number, number] | null>(null);
  const [line, setLine] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [inView, setInView] = useState(true);
  const [entered, setEntered] = useState(false);
  const [staticMode, setStaticMode] = useState(false);

  const rows = cols === 3 ? 3 : 3;
  const visibleCount = cols * rows;
  const tiles = useMemo(
    () => portraits.slice(0, Math.max(visibleCount, 9)),
    [portraits, visibleCount],
  );
  const order = useMemo(() => centerOutOrder(cols, rows), [cols, rows]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCols(mq.matches ? 3 : 5);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const saveData =
      "connection" in navigator &&
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData,
      );
    setStaticMode(reduced || saveData);
  }, [reduced]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (staticMode) {
      setEntered(true);
      return;
    }
    const id = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(id);
  }, [staticMode]);

  const measureLine = useCallback((a: number, b: number) => {
    const root = rootRef.current;
    const elA = tileRefs.current[a];
    const elB = tileRefs.current[b];
    if (!root || !elA || !elB) return null;
    const rb = root.getBoundingClientRect();
    const ra = elA.getBoundingClientRect();
    const rr = elB.getBoundingClientRect();
    return {
      x1: ra.left + ra.width / 2 - rb.left,
      y1: ra.top + ra.height / 2 - rb.top,
      x2: rr.left + rr.width / 2 - rb.left,
      y2: rr.top + rr.height / 2 - rb.top,
    };
  }, []);

  useEffect(() => {
    if (staticMode || !inView || !entered) return;

    let timeout = 0;
    let hold = 0;

    function pair() {
      const n = Math.min(tiles.length, visibleCount);
      if (n < 2) return;
      let a = Math.floor(Math.random() * n);
      let b = Math.floor(Math.random() * n);
      while (b === a) b = Math.floor(Math.random() * n);
      setConnected([a, b]);
      setLine(measureLine(a, b));
      hold = window.setTimeout(() => {
        setConnected(null);
        setLine(null);
        timeout = window.setTimeout(pair, 4000);
      }, 1200);
    }

    timeout = window.setTimeout(pair, 2800);
    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(hold);
    };
  }, [staticMode, inView, entered, tiles.length, visibleCount, measureLine]);

  useEffect(() => {
    if (!connected) return;
    const onResize = () => setLine(measureLine(connected[0], connected[1]));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [connected, measureLine]);

  const countValue = online ?? 0;
  const showLive = shouldShowLiveCount(online);

  return (
    <div
      ref={rootRef}
      className={cn("relative origin-top scale-[0.85] sm:scale-90 lg:scale-[0.85]", className)}
      data-static={staticMode ? "true" : undefined}
    >
      <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
        {showLive ? (
          <LiveBadge
            label={
              <>
                <CountUp value={countValue} /> {talkingSuffix}
              </>
            }
          />
        ) : (
          <p className="font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--faint)]">
            {t.home.beTheFirst}
          </p>
        )}
      </div>

      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {tiles.slice(0, visibleCount).map((tile, index) => {
          const staggerIndex = order.indexOf(index);
          const delay = staticMode ? 0 : staggerIndex * 40;
          const floatDelay = `${(index * 0.73) % 4}s`;
          const floatDur = `${6 + (index % 4)}s`;
          const isConnected =
            connected !== null &&
            (connected[0] === index || connected[1] === index);
          const dimmed =
            connected !== null && !isConnected && !staticMode;

          const style: CSSProperties = {
            animationDelay: staticMode ? undefined : floatDelay,
            animationDuration: staticMode ? undefined : floatDur,
            ["--cam-enter-delay" as string]: `${delay}ms`,
          };

          return (
            <div
              key={`${tile.src}-${index}`}
              ref={(node) => {
                tileRefs.current[index] = node;
              }}
              className={cn(
                entered ? "cam-tile-enter" : "opacity-0",
                !staticMode && inView && "cam-tile-float",
              )}
              style={style}
            >
              <VideoTile
                src={tile.src}
                alt={tile.alt}
                videoSrc={tile.videoSrc}
                priority={index < 4}
                dimmed={dimmed}
                connected={isConnected}
              />
            </div>
          );
        })}
      </div>

      {line && !staticMode ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] h-full w-full overflow-visible"
        >
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            pathLength={1}
            stroke="var(--cam-paper)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="cam-connect-line opacity-70"
          />
          <circle cx={line.x1} cy={line.y1} r="4" fill="var(--cam-paper)" className="cam-connect-pulse" />
          <circle cx={line.x2} cy={line.y2} r="4" fill="var(--cam-paper)" className="cam-connect-pulse" />
        </svg>
      ) : null}
    </div>
  );
}

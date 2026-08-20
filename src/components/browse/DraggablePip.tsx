"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Corner = "tl" | "tr" | "bl" | "br";

type Props = {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
};

const EDGE = 16;
const BOTTOM_CHROME = 120;

function cornerPos(
  corner: Corner,
  w: number,
  h: number,
  vw: number,
  vh: number,
) {
  const left = EDGE;
  const right = vw - w - EDGE;
  const top = EDGE + 48;
  const bottom = vh - h - BOTTOM_CHROME;

  switch (corner) {
    case "tl":
      return { x: left, y: top };
    case "tr":
      return { x: right, y: top };
    case "bl":
      return { x: left, y: Math.max(top, bottom) };
    case "br":
    default:
      return { x: right, y: Math.max(top, bottom) };
  }
}

function nearestCorner(
  x: number,
  y: number,
  w: number,
  h: number,
  vw: number,
  vh: number,
): Corner {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const left = cx < vw / 2;
  const top = cy < vh / 2;
  if (top && left) return "tl";
  if (top && !left) return "tr";
  if (!top && left) return "bl";
  return "br";
}

/** Draggable local preview tile — layout only, snaps to nearest corner. */
export function DraggablePip({
  children,
  className,
  width = 96,
  height = 128,
}: Props) {
  const [corner, setCorner] = useState<Corner>("br");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const layout = useCallback(() => {
    setPos(cornerPos(corner, width, height, window.innerWidth, window.innerHeight));
  }, [corner, width, height]);

  useEffect(() => {
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [layout]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      px: pos.x,
      py: pos.y,
    };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const dx = e.clientX - dragOrigin.current.x;
    const dy = e.clientY - dragOrigin.current.y;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({
      x: Math.min(Math.max(EDGE, dragOrigin.current.px + dx), vw - width - EDGE),
      y: Math.min(Math.max(EDGE, dragOrigin.current.py + dy), vh - height - EDGE),
    });
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    const next = nearestCorner(
      pos.x,
      pos.y,
      width,
      height,
      window.innerWidth,
      window.innerHeight,
    );
    setCorner(next);
    setPos(
      cornerPos(next, width, height, window.innerWidth, window.innerHeight),
    );
  }

  return (
    <div
      className={cn(
        "absolute z-20 touch-none overflow-hidden rounded-[1.25rem] border border-[var(--ink-600)] bg-[var(--ink-800)] shadow-[var(--elev-2)] ring-1 ring-[var(--key-500)]/25",
        dragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{
        width,
        height,
        left: pos.x,
        top: pos.y,
        transition: dragging ? "none" : "left 200ms ease, top 200ms ease",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  );
}

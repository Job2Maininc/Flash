"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  size?: number;
};

const FINE_DESKTOP = "(pointer: fine) and (min-width: 1024px)";

/** Cursor-following spotlight. Mounted only on fine pointers ≥1024px. */
export function Spotlight({ className, size = 420 }: Props) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia(FINE_DESKTOP);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    function onMove(e: PointerEvent) {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    }

    function loop() {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.08;
      p.y += (p.ty - p.y) * 0.08;
      if (el) {
        el.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
        el.style.opacity = "1";
      }
      raf.current = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled, size]);

  if (reduced || !enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[5] opacity-0 mix-blend-screen",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255,67,38,.18) 0%, transparent 68%)`,
      }}
    />
  );
}

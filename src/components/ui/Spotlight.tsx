"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  size?: number;
};

/** Cursor-following spotlight. Disabled on touch / reduced motion. */
export function Spotlight({ className, size = 420 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;

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
  }, [reduced, size]);

  if (reduced) return null;

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
        background: `radial-gradient(circle, rgba(255,122,69,.18) 0%, transparent 68%)`,
      }}
    />
  );
}

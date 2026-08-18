"use client";

import { useEffect, useRef, type RefObject } from "react";
import { FlashBrand } from "@/components/FlashBrand";

type Props = {
  targetRef: RefObject<HTMLElement | null>;
  onComplete: () => void;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function FlashIntro({ targetRef, onComplete }: Props) {
  const flyingRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flying = flyingRef.current;
    const veil = veilRef.current;
    const bloom = bloomRef.current;
    const target = targetRef.current;
    if (!flying || !veil || !bloom || !target) return;

    const animations: Animation[] = [];
    let cancelled = false;

    function place(x: number, y: number, scale: number) {
      flying!.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    async function run() {
      try {
        await document.fonts.ready;
      } catch {
        // Continue with fallback metrics if font loading fails.
      }
      if (cancelled || !flyingRef.current) return;

      const width = flying.offsetWidth;
      const height = flying.offsetHeight;
      const startX = (window.innerWidth - width) / 2;
      const startY = (window.innerHeight - height) / 2;
      place(startX, startY, 0.72);
      flying.style.opacity = "0";

      const lightUp = flying.animate(
        [
          {
            opacity: 0,
            transform: `translate(${startX}px, ${startY}px) scale(0.72)`,
            filter: "brightness(1.1) saturate(1.1)",
          },
          {
            opacity: 1,
            transform: `translate(${startX}px, ${startY}px) scale(1.08)`,
            filter: "brightness(1.85) saturate(1.35)",
            offset: 0.62,
          },
          {
            opacity: 1,
            transform: `translate(${startX}px, ${startY}px) scale(1)`,
            filter: "brightness(1.25) saturate(1.15)",
          },
        ],
        {
          duration: 420,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
      animations.push(lightUp);
      await lightUp.finished.catch(() => undefined);
      if (cancelled) return;

      await wait(80);
      if (cancelled) return;

      const from = flying.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!from.width || !to.width) {
        onComplete();
        return;
      }
      const scale = to.width / from.width;
      const endX = to.left;
      const endY = to.top;

      const dock = flying.animate(
        [
          {
            opacity: 1,
            transform: `translate(${startX}px, ${startY}px) scale(1)`,
            filter: "brightness(1.25)",
            offset: 0,
          },
          {
            opacity: 1,
            transform: `translate(${endX}px, ${endY}px) scale(${scale})`,
            filter: "brightness(1)",
            offset: 0.82,
          },
          {
            opacity: 0,
            transform: `translate(${endX}px, ${endY}px) scale(${scale})`,
            filter: "brightness(1)",
            offset: 1,
          },
        ],
        {
          duration: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
      const veilOut = veil.animate(
        [
          { opacity: 1 },
          { opacity: 0, offset: 0.5 },
          { opacity: 0 },
        ],
        {
          duration: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
      const bloomOut = bloom.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 280,
        easing: "ease-out",
        fill: "forwards",
      });
      animations.push(dock, veilOut, bloomOut);
      await wait(500);
      if (!cancelled) onComplete();
      await dock.finished.catch(() => undefined);
    }

    run();

    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
    };
  }, [onComplete, targetRef]);

  return (
    <div className="pointer-events-auto fixed inset-0 z-[80]" aria-hidden>
      <div
        ref={veilRef}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#2a2214_0%,_#0c0a08_70%)]"
      />
      <div
        ref={bloomRef}
        className="flash-intro-bloom pointer-events-none absolute left-1/2 top-1/2"
      />
      <div
        ref={flyingRef}
        className="fixed left-0 top-0 origin-top-left opacity-0 will-change-transform"
      >
        <FlashBrand
          size={120}
          glow="strong"
          wordmarkClassName="text-[5.625rem] tracking-tight text-[var(--paper)]"
        />
      </div>
    </div>
  );
}

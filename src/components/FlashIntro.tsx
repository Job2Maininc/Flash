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

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function waitForFonts() {
  try {
    await Promise.race([document.fonts.ready, wait(280)]);
  } catch {
    // Use fallback metrics if font loading is slow or unavailable.
  }
}

export function FlashIntro({ targetRef, onComplete }: Props) {
  const flyingRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animations: Animation[] = [];
    let cancelled = false;

    async function run() {
      await waitForFonts();
      await nextFrame();
      if (cancelled) return;

      const flyingEl = flyingRef.current;
      const veilEl = veilRef.current;
      const bloomEl = bloomRef.current;
      if (!flyingEl || !veilEl || !bloomEl) {
        onComplete();
        return;
      }

      let targetEl = targetRef.current;
      for (let i = 0; i < 24; i += 1) {
        if (targetEl && targetEl.getBoundingClientRect().width > 0) break;
        await nextFrame();
        if (cancelled) return;
        targetEl = targetRef.current;
      }
      if (!targetEl || targetEl.getBoundingClientRect().width === 0) {
        onComplete();
        return;
      }

      const width = flyingEl.offsetWidth;
      const height = flyingEl.offsetHeight;
      const startX = (window.innerWidth - width) / 2;
      const startY = (window.innerHeight - height) / 2;
      flyingEl.style.transform = `translate(${startX}px, ${startY}px) scale(0.72)`;

      const lightUp = flyingEl.animate(
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

      const from = flyingEl.getBoundingClientRect();
      const to = targetEl.getBoundingClientRect();
      if (!from.width || !to.width) {
        onComplete();
        return;
      }
      const scale = to.width / from.width;
      const endX = to.left;
      const endY = to.top;

      const dock = flyingEl.animate(
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
      const veilOut = veilEl.animate(
        [{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }],
        {
          duration: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
      const bloomOut = bloomEl.animate([{ opacity: 1 }, { opacity: 0 }], {
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
        className="fixed left-0 top-0 origin-top-left will-change-transform"
        style={{ opacity: 0 }}
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

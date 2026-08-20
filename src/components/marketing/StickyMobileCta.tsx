"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

/**
 * Bottom sticky CTA for ≤768px. Hides when hero or closing CTA is in view.
 */
export function StickyMobileCta() {
  const { t } = useI18n();
  const [pastFold, setPastFold] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [closingVisible, setClosingVisible] = useState(false);
  const shownOnce = useRef(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const threshold = document.documentElement.scrollHeight * 0.4;
      const next = y > threshold * 0.4 || y > window.innerHeight * 0.4;
      setPastFold(next);
      if (next) shownOnce.current = true;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = document.querySelector("[data-sticky-hero-cta]");
    const closing = document.querySelector("[data-sticky-closing-cta]");
    if (!hero && !closing) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const isHero = entry.target.hasAttribute("data-sticky-hero-cta");
          if (isHero) setHeroVisible(entry.isIntersecting);
          else setClosingVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.35 },
    );

    if (hero) io.observe(hero);
    if (closing) io.observe(closing);
    return () => io.disconnect();
  }, []);

  const visible =
    pastFold && !heroVisible && !closingVisible && shownOnce.current;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ink-700)] bg-[var(--ink-800)] px-5 pt-3 shadow-[var(--elev-2)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <p className="min-w-0 flex-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
          {t.home.stickyCtaHint}
        </p>
        <Link href="/join" tabIndex={visible ? 0 : -1}>
          <Button size="md">{t.home.startFree}</Button>
        </Link>
      </div>
    </div>
  );
}

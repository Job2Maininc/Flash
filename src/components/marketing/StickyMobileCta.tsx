"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

/**
 * Bottom sticky CTA for ≤768px.
 * Visible only after 40% page scroll and when neither hero nor closing CTA is in view.
 */
export function StickyMobileCta() {
  const { t } = useI18n();
  const [pastFold, setPastFold] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [closingVisible, setClosingVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setPastFold(window.scrollY / maxScroll >= 0.4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
      { threshold: 0.2 },
    );

    if (hero) io.observe(hero);
    if (closing) io.observe(closing);
    return () => io.disconnect();
  }, []);

  const visible = pastFold && !heroVisible && !closingVisible;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ink-700)] bg-[var(--ink-800)] px-5 pt-3 shadow-[var(--elev-2)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] md:hidden",
        "pb-[max(16px,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
        <p className="whitespace-nowrap text-center text-[13px] font-medium text-[var(--muted)]">
          {t.home.stickyCtaHint}
        </p>
        <Link href="/join" tabIndex={visible ? 0 : -1} className="w-full">
          <Button size="md" className="w-full shadow-none">
            {t.home.startFree}
          </Button>
        </Link>
      </div>
    </div>
  );
}

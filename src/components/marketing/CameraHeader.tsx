"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlashBrand } from "@/components/FlashBrand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Props = {
  brandRef?: RefObject<HTMLDivElement | null>;
  brandHidden?: boolean;
};

export function CameraHeader({ brandRef, brandHidden = false }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [heroCtaInView, setHeroCtaInView] = useState(false);
  const menuId = useId();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  const links = [
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
    { href: "/safety", label: t.nav.safety },
  ];

  const legalLinks = [
    { href: "/privacy", label: t.nav.privacy },
    { href: "/safety", label: t.footer.impressum },
    { href: "/privacy", label: t.footer.terms },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Below 768px: hide compact header CTA while the hero CTA is on screen.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    function bind() {
      if (!mq.matches) {
        setHeroCtaInView(false);
        return () => undefined;
      }
      const hero = document.querySelector("[data-sticky-hero-cta]");
      if (!hero) {
        setHeroCtaInView(false);
        return () => undefined;
      }
      const io = new IntersectionObserver(
        ([entry]) => setHeroCtaInView(entry.isIntersecting),
        { threshold: 0.2 },
      );
      io.observe(hero);
      return () => io.disconnect();
    }

    let cleanup = bind();
    const onMq = () => {
      cleanup();
      cleanup = bind();
    };
    mq.addEventListener("change", onMq);
    return () => {
      mq.removeEventListener("change", onMq);
      cleanup();
    };
  }, [pathname]);

  // Close menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Body scroll lock (position:fixed — required on iOS).
  useEffect(() => {
    if (!open) return;
    scrollYRef.current = window.scrollY;
    const { body, documentElement } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      documentElement.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  // Focus trap + Esc.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusables?.length) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      hamburgerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-200 ease-[var(--ease-out)]",
          "pt-[env(safe-area-inset-top)]",
          scrolled
            ? "border-b border-[var(--ink-700)] bg-[rgba(14,11,18,0.92)] md:bg-[rgba(14,11,18,.72)] md:backdrop-blur-[16px] md:backdrop-saturate-[140%]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 md:h-16">
          <div
            ref={brandRef}
            className={cn(
              "inline-flex transition-opacity duration-[var(--dur-fast)]",
              brandHidden ? "opacity-0" : "opacity-100",
            )}
          >
            <FlashBrand
              href="/"
              wordmarkClassName="text-xl text-[var(--cam-paper)] sm:text-2xl"
              glow="strong"
            />
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => {
              const active = link.href === pathname;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-[family-name:var(--font-camera-display)] text-base font-bold tracking-tight transition",
                    active
                      ? "text-[var(--cam-paper)]"
                      : "text-[var(--cam-paper)]/70 hover:text-[var(--cam-paper)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageSwitcher variant="dark" />
            </div>
            <Link
              href="/join"
              className={cn(
                "hidden min-[390px]:inline-flex md:inline-flex",
                "transition-opacity duration-[var(--dur-fast)]",
                heroCtaInView &&
                  "max-md:pointer-events-none max-md:opacity-0",
              )}
              tabIndex={heroCtaInView ? -1 : 0}
              aria-hidden={heroCtaInView}
            >
              <Button
                size="sm"
                className="!h-10 !min-h-10 px-3.5 text-sm !shadow-none md:!h-11 md:!min-h-11 md:px-4 md:!shadow-[var(--glow-key)]"
              >
                {t.nav.start}
              </Button>
            </Link>
            <button
              ref={hamburgerRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] text-[var(--cam-paper)] active:scale-[.97] md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                aria-hidden
                className="text-lg"
              >
                {open ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-[var(--ink-900)] px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(5rem,calc(env(safe-area-inset-top)+4rem))] md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button
            type="button"
            className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] text-[var(--cam-paper)] active:scale-[.97]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          <nav className="mt-2 flex flex-col gap-1">
            {links.map((link, i) => (
              <MenuLink
                key={link.href}
                href={link.href}
                delay={i * 30}
                onNavigate={() => setOpen(false)}
              >
                {link.label}
              </MenuLink>
            ))}
          </nav>

          <Link
            href="/join"
            className="mt-8"
            onClick={() => setOpen(false)}
          >
            <Button size="lg" className="w-full">
              {t.join.startChat}
            </Button>
          </Link>

          <div className="mt-auto flex flex-col gap-6 pt-10">
            <LanguageSwitcher variant="dark" />
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
              {legalLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-[13px] font-medium text-[var(--muted)] active:text-[var(--cam-paper)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MenuLink({
  href,
  children,
  delay,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  delay: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="cam-menu-item border-b border-[var(--ink-700)] py-4 font-[family-name:var(--font-camera-display)] text-[length:var(--type-display-l)] font-bold tracking-tight text-[var(--cam-paper)] active:opacity-80"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Link>
  );
}

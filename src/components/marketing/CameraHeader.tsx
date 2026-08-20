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
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "/join", label: t.nav.joinVideoChat },
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
    { href: "/safety", label: t.nav.safety },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200 ease-[var(--ease-out)]",
          "pt-[env(safe-area-inset-top)]",
          scrolled
            ? "border-b border-[var(--ink-700)] bg-[rgba(14,11,18,.72)] backdrop-blur-[16px] backdrop-saturate-[140%]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
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
                      ? "text-[var(--key-400)]"
                      : "text-[var(--cam-paper)]/80 hover:text-[var(--cam-paper)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="dark" />
            <Link href="/join" className="hidden sm:inline-flex">
              <Button size="sm">{t.nav.joinVideoChat}</Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] text-[var(--cam-paper)] md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden className="font-[family-name:var(--font-mono)] text-lg">
                {open ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-[var(--ink-900)] px-5 pb-10 pt-20 md:hidden"
        >
          <button
            ref={closeRef}
            type="button"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] text-[var(--cam-paper)]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <nav className="mt-6 flex flex-col gap-2">
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
          <Link href="/join" className="mt-10" onClick={() => setOpen(false)}>
            <Button size="lg" className="w-full">
              {t.nav.joinVideoChat}
            </Button>
          </Link>
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
      className="cam-menu-item border-b border-[var(--ink-700)] py-4 font-[family-name:var(--font-camera-display)] text-3xl font-bold tracking-tight text-[var(--cam-paper)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Link>
  );
}

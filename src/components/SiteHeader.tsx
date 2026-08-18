"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { FlashBrand } from "@/components/FlashBrand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  variant?: "light" | "dark";
  brandRef?: RefObject<HTMLDivElement | null>;
  brandHidden?: boolean;
};

export function SiteHeader({
  variant = "light",
  brandRef,
  brandHidden = false,
}: Props) {
  const { t } = useI18n();
  const pathname = usePathname();
  const dark = variant === "dark";
  const links = [
    { href: "/join", label: t.nav.joinVideoChat },
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
    { href: "/safety", label: t.nav.safety },
    { href: "/privacy", label: t.nav.privacy },
  ];

  return (
    <header className="relative z-20 flex items-center justify-between gap-3 px-5 safe-top">
      <div
        ref={brandRef}
        className={`inline-flex ${brandHidden ? "opacity-0" : "opacity-100"}`}
      >
        <FlashBrand
          href="/"
          wordmarkClassName={
            dark
              ? "text-2xl text-white sm:text-3xl"
              : "text-2xl text-[var(--ink)] sm:text-3xl"
          }
          glow="strong"
        />
      </div>
      <nav className="flex min-w-0 flex-1 items-center justify-end gap-3 overflow-x-auto sm:gap-5 lg:justify-center lg:gap-7">
        {links.map((link) => {
          const active = link.href === pathname;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight transition sm:text-xl lg:text-2xl ${
                active
                  ? dark
                    ? "text-[var(--accent)]"
                    : "text-[var(--ink)]"
                  : dark
                    ? "text-white/85 hover:text-white"
                    : "text-[var(--ink)]/90 hover:text-[var(--ink)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <LanguageSwitcher variant={dark ? "dark" : "light"} />
    </header>
  );
}

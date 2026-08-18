"use client";

import Link from "next/link";
import { FlashBrand } from "@/components/FlashBrand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteHeader({ ctaHref = "/#enter", ctaLabel }: Props) {
  const { t } = useI18n();
  const links = [
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
    { href: "/safety", label: t.nav.safety },
    { href: "/privacy", label: t.nav.privacy },
  ];

  return (
    <header className="relative z-20 flex items-center justify-between gap-3 px-5 safe-top">
      <FlashBrand
        href="/"
        wordmarkClassName="text-2xl text-[var(--ink)] sm:text-3xl"
        glow="strong"
      />
      <nav className="hidden items-center gap-5 text-sm text-[var(--ink-muted)] md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-[var(--ink)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link
          href={ctaHref}
          className="flash-btn flash-btn-primary rounded-full px-4 py-2 text-sm"
        >
          {ctaLabel ?? t.nav.start}
        </Link>
      </div>
    </header>
  );
}
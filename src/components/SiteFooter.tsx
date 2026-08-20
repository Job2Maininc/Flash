"use client";

import Link from "next/link";
import { FlashBrand } from "@/components/FlashBrand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/LocaleProvider";

export function SiteFooter() {
  const { t } = useI18n();
  const footerLinks = [
    { href: "/join", label: t.join.startChat },
    { href: "/about", label: t.nav.about },
    { href: "/safety", label: t.nav.safety },
    { href: "/privacy", label: t.nav.privacy },
    { href: "/matches", label: t.nav.matches },
  ];

  return (
    <footer className="relative z-10 border-t border-[var(--ink)]/10 bg-[var(--ink)] px-5 py-12 text-[var(--paper)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <FlashBrand
            href="/"
            wordmarkClassName="text-2xl text-[var(--paper)]"
            glow="soft"
          />
          <p className="text-sm leading-relaxed text-white/65">{t.footer.blurb}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            {t.footer.age}
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <LanguageSwitcher variant="dark" />
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
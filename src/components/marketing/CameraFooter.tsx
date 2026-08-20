"use client";

import Link from "next/link";
import { FlashBrand } from "@/components/FlashBrand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/LocaleProvider";

export function CameraFooter() {
  const { t } = useI18n();

  const columns = [
    {
      heading: t.footer.colProduct,
      links: [
        { href: "/join", label: t.join.startChat },
        { href: "/#how-it-works", label: t.nav.howItWorks },
        { href: "/matches", label: t.nav.matches },
      ],
    },
    {
      heading: t.footer.colCompany,
      links: [
        { href: "/about", label: t.nav.about },
        { href: "/safety", label: t.nav.safety },
      ],
    },
    {
      heading: t.footer.colLegal,
      links: [
        { href: "/privacy", label: t.nav.privacy },
        { href: "/safety", label: t.footer.impressum },
        { href: "/privacy", label: t.footer.terms },
      ],
    },
  ];

  return (
    <footer className="relative z-10 border-t border-[var(--ink-700)] bg-[var(--ink-900)] px-5 py-16 pb-[max(4rem,calc(5.5rem+env(safe-area-inset-bottom)))] text-[var(--cam-paper)] md:pb-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm space-y-4">
          <FlashBrand
            href="/"
            wordmarkClassName="text-2xl text-[var(--cam-paper)]"
            glow="soft"
          />
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {t.footer.blurb}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--faint)]">
            {t.footer.age}
          </p>
          <LanguageSwitcher variant="dark" />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div
              key={col.heading}
              className={
                col.heading === t.footer.colLegal
                  ? "col-span-2 sm:col-span-1"
                  : undefined
              }
            >
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--faint)]">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="cam-footer-link inline-flex min-h-11 items-center text-sm text-[var(--muted)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { FlashBrand } from "@/components/FlashBrand";

const footerLinks = [
  { href: "/about", label: "À propos" },
  { href: "/safety", label: "Sécurité" },
  { href: "/privacy", label: "Confidentialité" },
  { href: "/matches", label: "Matches" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--ink)]/10 bg-[var(--ink)] px-5 py-12 text-[var(--paper)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <FlashBrand
            href="/"
            wordmarkClassName="text-2xl text-[var(--paper)]"
            glow="soft"
          />
          <p className="text-sm leading-relaxed text-white/65">
            Flash est un site de rencontres en vidéo live. Moins de profils
            figés, plus de vraies conversations — swipe, match, rappelle.
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            18+ · Rencontres consenties
          </p>
        </div>
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
    </footer>
  );
}

import Link from "next/link";
import { FlashBrand } from "@/components/FlashBrand";

const links = [
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/about", label: "À propos" },
  { href: "/safety", label: "Sécurité" },
  { href: "/privacy", label: "Confidentialité" },
];

type Props = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteHeader({
  ctaHref = "/#entrer",
  ctaLabel = "Commencer",
}: Props) {
  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-5 safe-top">
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
      <Link
        href={ctaHref}
        className="flash-btn flash-btn-primary rounded-full px-4 py-2 text-sm"
      >
        {ctaLabel}
      </Link>
    </header>
  );
}

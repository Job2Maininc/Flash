import Link from "next/link";
import { FlashLogo } from "@/components/FlashLogo";

type Props = {
  href?: string;
  size?: number;
  glow?: "soft" | "strong";
  className?: string;
  wordmarkClassName?: string;
};

export function FlashBrand({
  href,
  size = 32,
  glow = "soft",
  className = "",
  wordmarkClassName = "",
}: Props) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <FlashLogo size={size} glow={glow} />
      <span
        className={`font-[family-name:var(--font-display)] text-2xl tracking-tight ${wordmarkClassName}`}
      >
        Flash
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

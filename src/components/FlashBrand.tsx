import Link from "next/link";
import { FlashLogo } from "@/components/FlashLogo";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  size?: number;
  glow?: "soft" | "strong";
  className?: string;
  wordmarkClassName?: string;
};

/**
 * Wordmark in display face (extra-bold), tracking -0.04em.
 * The `l` is replaced by the bolt mark so it reads as a logo, not plain text.
 */
export function FlashBrand({
  href,
  size = 32,
  glow = "soft",
  className = "",
  wordmarkClassName = "",
}: Props) {
  const boltSize = Math.round(size * 0.72);

  const content = (
    <span
      className={cn("inline-flex items-baseline gap-0.5", className)}
      aria-label="Flash"
    >
      <span
        className={cn(
          "inline-flex items-baseline font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.04em] text-[var(--cam-paper)]",
          wordmarkClassName,
        )}
      >
        <span>F</span>
        <FlashLogo
          size={boltSize}
          glow={glow}
          className="mx-0.5 inline-block translate-y-[0.12em] self-center"
        />
        <span>ash</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

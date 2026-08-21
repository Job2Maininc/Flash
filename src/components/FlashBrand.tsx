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
 * Bolt mark beside the wordmark (not replacing a letter).
 * Wordmark uses display face, extra-bold, tracking -0.04em.
 */
export function FlashBrand({
  href,
  size = 32,
  glow = "soft",
  className = "",
  wordmarkClassName = "",
}: Props) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <FlashLogo size={size} glow={glow} />
      <span
        className={cn(
          "font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.04em]",
          wordmarkClassName,
        )}
      >
        Flash
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

import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  image?: { src: string; alt: string };
  reverse?: boolean;
};

export function MarketingSection({
  id,
  eyebrow,
  title,
  lead,
  children,
  image,
  reverse = false,
}: Props) {
  return (
    <section
      id={id}
      className="relative mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12"
    >
      <div className={reverse ? "lg:order-2" : undefined}>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h2>
        {lead ? (
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-muted)]">
            {lead}
          </p>
        ) : null}
        {children}
      </div>
      {image ? (
        <div
          className={`relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}

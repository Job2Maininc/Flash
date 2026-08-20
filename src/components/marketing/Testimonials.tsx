"use client";

import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

type Quote = {
  quote: string;
  name: string;
  detail: string;
};

type Props = {
  eyebrow: string;
  title: string;
  quotes: Quote[];
};

export function Testimonials({ eyebrow, title, quotes }: Props) {
  return (
    <Section inverted>
      <ScrollReveal>
        <p className="cam-eyebrow !text-[var(--ink-600)]">{eyebrow}</p>
        <h2 className="cam-h2 mt-3 max-w-[20ch] text-balance !text-[var(--ink-900)]">
          {title}
        </h2>
      </ScrollReveal>

      <div className="mt-10 hidden gap-4 md:columns-2 lg:columns-3">
        {quotes.map((item, index) => (
          <QuoteCard
            key={`${item.name}-${index}`}
            item={item}
            highlight={index === 1}
            inverted
            className="mb-4 break-inside-avoid"
          />
        ))}
      </div>

      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:hidden">
        {quotes.map((item, index) => (
          <QuoteCard
            key={`m-${item.name}-${index}`}
            item={item}
            highlight={index === 1}
            inverted
            className="w-[min(82vw,22rem)] shrink-0 snap-start"
          />
        ))}
      </div>
    </Section>
  );
}

function QuoteCard({
  item,
  highlight,
  inverted,
  className,
}: {
  item: Quote;
  highlight?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <blockquote
      className={cn(
        "rounded-[var(--radius-lg)] border p-5 transition-[transform,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--elev-2)]",
        inverted
          ? "border-[var(--ink-900)]/10 bg-white/75 shadow-[var(--shadow-soft)]"
          : "border-[var(--ink-700)] bg-[var(--ink-800)] shadow-[var(--elev-1)]",
        highlight && "border-[var(--ink-600)] shadow-[var(--elev-1)]",
        className,
      )}
    >
      <p
        className={cn(
          "text-base leading-relaxed",
          inverted ? "text-[var(--ink-700)]" : "text-[var(--muted)]",
        )}
      >
        “{item.quote}”
      </p>
      <footer className="mt-5 flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full font-[family-name:var(--font-mono)] text-xs",
            inverted
              ? "bg-[var(--ink-900)]/8 text-[var(--ink-600)]"
              : "bg-[var(--ink-700)] text-[var(--faint)]",
          )}
        >
          {item.name.slice(0, 1)}
        </span>
        <span>
          <span
            className={cn(
              "block font-[family-name:var(--font-camera-display)] text-lg",
              inverted ? "text-[var(--ink-900)]" : "text-[var(--cam-paper)]",
            )}
          >
            {item.name}
          </span>
          <span className="block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
            {item.detail}
          </span>
        </span>
      </footer>
    </blockquote>
  );
}

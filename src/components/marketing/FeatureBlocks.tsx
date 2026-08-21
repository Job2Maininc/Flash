"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { useI18n } from "@/components/LocaleProvider";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
import { cn } from "@/lib/cn";

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  linkLabel: string;
  href: string;
  demo: string;
};

type Props = {
  features: Feature[];
};

export function FeatureBlocks({ features }: Props) {
  return (
    <div className="space-y-4">
      {features.map((feature, index) => {
        const flip = index % 2 === 1;
        return (
          <Section
            key={feature.title}
            alt={index % 2 === 1}
            seam={index === 0}
          >
            <ScrollReveal>
              <div
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-14",
                  flip && "lg:[&>*:first-child]:order-2",
                )}
              >
                <DemoPanel kind={feature.demo} />
                <div>
                  <p className="cam-eyebrow text-[var(--faint)]">
                    {feature.eyebrow}
                  </p>
                  <h2 className="cam-h2 mt-3 max-w-[16ch]">
                    {feature.title}
                  </h2>
                  <p className="cam-body mt-4 text-[var(--muted)] text-pretty">
                    {feature.body}
                  </p>
                  <Link
                    href={feature.href}
                    className="mt-6 inline-flex font-[family-name:var(--font-body)] text-sm text-[var(--key-400)] underline decoration-[var(--key-500)]/40 underline-offset-4 transition hover:decoration-[var(--key-500)]"
                  >
                    {feature.linkLabel}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </Section>
        );
      })}
    </div>
  );
}

function DemoPanel({ kind }: { kind: string }) {
  const { t } = useI18n();

  if (kind === "match") {
    return (
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-6 shadow-[var(--elev-1)]">
        <div className="flex items-center gap-3">
          {["A", "B", "C"].map((label, i) => (
            <div
              key={label}
              className="cam-demo-avatar flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ink-700)] font-[family-name:var(--font-mono)] text-xs text-[var(--faint)]"
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              {label}
            </div>
          ))}
          <div className="ml-auto rounded-full bg-[var(--ink-700)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--cam-paper)]">
            paired
          </div>
        </div>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[var(--ink-700)]">
          <div className="cam-demo-bar h-full rounded-full bg-[var(--cam-paper)]/70" />
        </div>
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--faint)]">
          Queue → match → timer
        </p>
      </div>
    );
  }

  if (kind === "safety") {
    const items = t.home.safetyDemo;
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-5 shadow-[var(--elev-1)]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-900)]/70 px-3.5 py-3"
            >
              <SafetyIcon name={item.icon} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--cam-paper)]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--faint)] text-pretty">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const tiles = HERO_PORTRAITS.slice(0, 6);
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-4 shadow-[var(--elev-1)]">
      {tiles.map((tile, i) => (
        <div
          key={tile.src}
          className="cam-tile-enter relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--ink-700)]"
          style={{ ["--cam-enter-delay" as string]: `${i * 70}ms` }}
        >
          <Image
            src={tile.src}
            alt=""
            fill
            sizes="120px"
            className="object-cover"
          />
          {i === 2 ? (
            <span className="cam-verify-stamp absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink-700)] text-xs text-[var(--cam-paper)] shadow-[var(--elev-1)]">
              ✓
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function SafetyIcon({ name }: { name: string }) {
  const common =
    "mt-0.5 h-5 w-5 shrink-0 text-[var(--faint)]";
  if (name === "report") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 4v16M5 5h10l-1.5 3.5L15 12H5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "block") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 7l10 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.8 1.8L15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
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
          <Section key={feature.title} className="!py-[clamp(3rem,8vw,6rem)]">
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
                  <h2 className="cam-h2 mt-3 max-w-[16ch]">{feature.title}</h2>
                  <p className="cam-body mt-4 text-[var(--muted)]">
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
    return (
      <div className="group relative h-56 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-5 shadow-[var(--elev-1)]">
        {["Report", "Block", "Verified"].map((label, i) => (
          <div
            key={label}
            className="absolute left-5 right-5 rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-900)] px-4 py-3 text-sm text-[var(--cam-paper)] shadow-[var(--elev-1)] transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:-translate-y-1"
            style={{ top: `${2.5 + i * 3.2}rem`, zIndex: 3 - i }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-lg)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-4 shadow-[var(--elev-1)]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--ink-700)]"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background: `linear-gradient(135deg, rgba(255,122,69,${0.12 + (i % 3) * 0.08}), rgba(46,38,55,0.85))`,
            }}
          />
          {i === 2 ? (
            <span className="cam-verify-stamp absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink-700)] text-xs text-[var(--cam-paper)]">
              ✓
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

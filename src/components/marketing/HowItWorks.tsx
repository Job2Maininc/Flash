"use client";

import { useEffect, useRef, useState } from "react";
import { HowSceneFrame } from "@/components/marketing/how/HowSceneFrame";
import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { useI18n } from "@/components/LocaleProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Step = {
  title: string;
  body: string;
  frameLabel: string;
};

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: Step[];
};

/**
 * How it works — one sticky DeviceFrame scene driven by scroll step index.
 * Reduced motion: three static frames stacked with copy (no sticky / auto transitions).
 */
export function HowItWorks({ eyebrow, title: _title, lead, steps }: Props) {
  const { t } = useI18n();
  const how = t.home.howParts;
  void _title;
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Section id="how-it-works" seam>
        <ScrollReveal>
          <p className="cam-eyebrow">{eyebrow}</p>
          <h2 className="cam-h2 mt-3">
            {how.before}{" "}
            <span className="font-extrabold">{how.emph}</span>
          </h2>
          <p className="cam-body-l mt-4 text-[var(--muted)] text-pretty">{lead}</p>
        </ScrollReveal>

        <ol className="mt-10 space-y-14">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10"
            >
              <HowSceneFrame
                step={(index as 0 | 1 | 2) ?? 0}
                label={step.frameLabel}
                reducedMotion
                className="mx-auto"
              />
              <div>
                <p className="text-[13px] font-medium text-[var(--muted)]">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-[var(--muted)] text-pretty">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  return <HowItWorksScroll eyebrow={eyebrow} lead={lead} steps={steps} />;
}

function HowItWorksScroll({
  eyebrow,
  lead,
  steps,
}: {
  eyebrow: string;
  lead: string;
  steps: Step[];
}) {
  const { t } = useI18n();
  const how = t.home.howParts;
  const [active, setActive] = useState<0 | 1 | 2>(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = nodes.indexOf(visible.target as HTMLLIElement);
        if (index >= 0 && index <= 2) setActive(index as 0 | 1 | 2);
      },
      // Center band of the viewport — keeps the phone scene in sync with copy.
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="how-it-works" seam>
      <ScrollReveal>
        <p className="cam-eyebrow">{eyebrow}</p>
        <h2 className="cam-h2 mt-3">
          {how.before}{" "}
          <span className="font-extrabold">{how.emph}</span>
        </h2>
        <p className="cam-body-l mt-4 text-[var(--muted)] text-pretty">{lead}</p>
      </ScrollReveal>

      {/*
        One tall wrapper so sticky stays alive for all three steps.
        Avoid items-start on the grid — that shrink-wraps the phone column
        and sticky dies after step 1.
      */}
      <div className="relative mt-10 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div
          className={cn(
            "sticky top-[calc(4.5rem+env(safe-area-inset-top))] z-[2]",
            "mx-auto mb-6 w-full max-w-[200px] sm:max-w-[240px]",
            "lg:mb-0 lg:max-w-[min(100%,340px)] lg:self-start",
          )}
        >
          <HowSceneFrame step={active} label={steps[active]?.frameLabel} />
        </div>

        <ol>
          {steps.map((step, index) => {
            const on = index === active;
            return (
              <li
                key={step.title}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                className="flex min-h-[min(58vh,420px)] items-center py-4 lg:min-h-[min(65vh,520px)] lg:py-6"
              >
                <div
                  className={cn(
                    "w-full rounded-[var(--radius-lg)] border p-5 transition-[opacity,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-out)] sm:p-6",
                    on
                      ? "border-[var(--ink-600)] bg-[var(--ink-800)] opacity-100 shadow-[var(--elev-1)]"
                      : "border-transparent bg-transparent opacity-40",
                  )}
                >
                  <p className="text-[13px] font-medium text-[var(--muted)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-[var(--muted)] text-pretty">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

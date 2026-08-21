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
 * How it works — desktop: sticky phone + scrolling copy.
 * Mobile: stacked frame-above-copy per step (no sticky overlap).
 */
export function HowItWorks({ eyebrow, title: _title, lead, steps }: Props) {
  const { t } = useI18n();
  const how = t.home.howParts;
  void _title;
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Section id="how-it-works" seam>
        <Header eyebrow={eyebrow} how={how} lead={lead} />
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
              <StepCopy step={step} index={index} on />
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  return <HowItWorksMotion eyebrow={eyebrow} lead={lead} steps={steps} />;
}

function Header({
  eyebrow,
  how,
  lead,
}: {
  eyebrow: string;
  how: { before: string; emph: string };
  lead: string;
}) {
  return (
    <ScrollReveal>
      <p className="cam-eyebrow">{eyebrow}</p>
      <h2 className="cam-h2 mt-3">
        {how.before} <span className="font-extrabold">{how.emph}</span>
      </h2>
      <p className="cam-body-l mt-4 text-[var(--muted)] text-pretty">{lead}</p>
    </ScrollReveal>
  );
}

function StepCopy({
  step,
  index,
  on,
}: {
  step: Step;
  index: number;
  on: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-[var(--radius-lg)] border p-5 transition-[opacity,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-out)] sm:p-6",
        on
          ? "border-[var(--ink-600)] bg-[var(--ink-800)] opacity-100 shadow-[var(--elev-1)]"
          : "border-transparent bg-transparent opacity-40 lg:opacity-40",
        // On mobile stacked layout, always fully readable
        "max-lg:border-[var(--ink-600)] max-lg:bg-[var(--ink-800)] max-lg:opacity-100 max-lg:shadow-[var(--elev-1)]",
      )}
    >
      <p className="text-[13px] font-medium text-[var(--muted)]">0{index + 1}</p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)]">
        {step.title}
      </h3>
      <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-[var(--muted)] text-pretty">
        {step.body}
      </p>
    </div>
  );
}

function HowItWorksMotion({
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
  const [mobileInView, setMobileInView] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const desktopStepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mobileStepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = desktopStepRefs.current.filter(Boolean) as HTMLLIElement[];
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
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const nodes = mobileStepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (nodes.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        setMobileInView((prev) => {
          const next = [...prev];
          for (const entry of entries) {
            const index = nodes.indexOf(entry.target as HTMLLIElement);
            if (index >= 0) next[index] = entry.isIntersecting;
          }
          return next;
        });
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.35 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="how-it-works" seam>
      <Header eyebrow={eyebrow} how={how} lead={lead} />

      {/* ——— Mobile: frame above copy, no sticky ——— */}
      <ol className="mt-10 space-y-14 lg:hidden">
        {steps.map((step, index) => (
          <li
            key={`m-${step.title}`}
            ref={(node) => {
              mobileStepRefs.current[index] = node;
            }}
            className="flex flex-col gap-5"
          >
            <HowSceneFrame
              step={index as 0 | 1 | 2}
              label={step.frameLabel}
              play={mobileInView[index] ?? false}
              className="mx-auto w-full max-w-[min(72vw,260px)]"
            />
            <StepCopy step={step} index={index} on />
          </li>
        ))}
      </ol>

      {/* ——— Desktop: sticky phone + scrolling steps ——— */}
      <div className="relative mt-12 hidden lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div className="sticky top-28 z-[2] w-full max-w-[min(100%,340px)] self-start">
          <HowSceneFrame
            step={active}
            label={steps[active]?.frameLabel}
            play
          />
        </div>

        <ol>
          {steps.map((step, index) => {
            const on = index === active;
            return (
              <li
                key={`d-${step.title}`}
                ref={(node) => {
                  desktopStepRefs.current[index] = node;
                }}
                className="flex min-h-[min(65vh,520px)] items-center py-6"
              >
                <StepCopy step={step} index={index} on={on} />
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

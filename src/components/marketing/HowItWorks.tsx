"use client";

import { useEffect, useRef, useState } from "react";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
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

const FRAME_STATES = ["queue", "connected", "decision"] as const;

export function HowItWorks({ eyebrow, title, lead, steps }: Props) {
  const [active, setActive] = useState(0);
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
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-35% 0px -40% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="how-it-works">
      <ScrollReveal>
        <p className="cam-eyebrow text-[var(--faint)]">{eyebrow}</p>
        <h2 className="cam-h2 mt-3 max-w-[18ch]">{title}</h2>
        <p className="cam-body-l mt-4 text-[var(--muted)]">{lead}</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <DeviceFrame label={steps[active]?.frameLabel}>
            <FramePreview state={FRAME_STATES[active] ?? "queue"} />
          </DeviceFrame>
        </div>

        <ol className="space-y-6 lg:space-y-10">
          {steps.map((step, index) => {
            const on = index === active;
            return (
              <li
                key={step.title}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-5 transition-[opacity,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-out)] sm:p-6",
                  on
                    ? "border-[var(--ink-600)] bg-[var(--ink-800)] opacity-100 shadow-[var(--elev-1)]"
                    : "border-transparent opacity-35",
                )}
              >
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--faint)]">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-camera-display)] text-2xl font-bold tracking-tight text-[var(--cam-paper)]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-[var(--muted)]">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

function FramePreview({ state }: { state: (typeof FRAME_STATES)[number] }) {
  return (
    <div className="flex h-full flex-col justify-between bg-[radial-gradient(ellipse_at_top,_#2a2218_0%,_#0e0b12_70%)] p-4">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
          Flash
        </span>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--live)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
          Live
        </span>
      </div>

      <div className="relative mx-auto aspect-[3/4] w-[78%] overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-[var(--ink-800)]">
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-[var(--dur-base)]",
            state === "queue" ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(255,122,69,.25), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-[var(--key-500)]/25 to-[var(--ink-700)]/40 transition-opacity duration-[var(--dur-base)]",
            state === "connected" ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-[var(--dur-base)]",
            state === "decision" ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/70">
            Pass
          </span>
          <span className="rounded-full bg-[var(--key-500)] px-4 py-2 text-xs text-[var(--ink-900)]">
            Match
          </span>
        </div>
        <p className="absolute inset-x-0 bottom-3 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-white/55">
          {state}
        </p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[var(--key-500)] transition-[width] duration-[var(--dur-base)] ease-[var(--ease-out)]"
          style={{ width: `${((FRAME_STATES.indexOf(state) + 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

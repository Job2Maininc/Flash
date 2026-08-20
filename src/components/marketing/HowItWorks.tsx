"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { HERO_PORTRAITS } from "@/lib/hero-portraits";
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

const FRAME_STATES = ["setup", "call", "match"] as const;

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
    <Section id="how-it-works" seam>
      <ScrollReveal>
        <p className="cam-eyebrow text-[var(--faint)]">{eyebrow}</p>
        <h2 className="cam-h2 mt-3 max-w-[18ch] text-balance">{title}</h2>
        <p className="cam-body-l mt-4 text-[var(--muted)] text-pretty">{lead}</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <DeviceFrame label={steps[active]?.frameLabel}>
            <FramePreview state={FRAME_STATES[active] ?? "setup"} />
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
                <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-[var(--muted)] text-pretty">
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

/** Token-based product UI mocks — not photos. Cross-fade with scroll step. */
function FramePreview({ state }: { state: (typeof FRAME_STATES)[number] }) {
  const peer = HERO_PORTRAITS[3];
  const self = HERO_PORTRAITS[1];

  return (
    <div className="relative h-full bg-[var(--ink-900)]">
      <ScreenSetup active={state === "setup"} />
      <ScreenCall active={state === "call"} peerSrc={peer.src} selfSrc={self.src} />
      <ScreenMatch active={state === "match"} peerSrc={peer.src} />
    </div>
  );
}

function ScreenSetup({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col gap-3 p-4 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!active}
    >
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-camera-display)] text-lg font-bold text-[var(--cam-paper)]">
          Flash
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--faint)]">
          Setup
        </span>
      </div>

      <div className="mt-1 flex-1 space-y-2.5">
        <Field label="Name" value="····" />
        <Field label="Gender" value="—" />
        <Field label="Looking for" value="—" />
        <Field label="Where" value="Nearby" />
      </div>

      <div className="rounded-[var(--radius-pill)] bg-[var(--key-500)] py-2.5 text-center text-sm font-medium text-[var(--paper)] shadow-[var(--glow-key)]">
        Start video chat
      </div>
      <p className="text-center font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-[var(--faint)]">
        Camera on · Be kind · 18+
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-800)] px-3 py-2">
      <p className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-[var(--faint)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-[var(--cam-paper)]">{value}</p>
    </div>
  );
}

function ScreenCall({
  active,
  peerSrc,
  selfSrc,
}: {
  active: boolean;
  peerSrc: string;
  selfSrc: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!active}
    >
      <div className="absolute inset-0">
        <Image src={peerSrc} alt="" fill sizes="280px" className="object-cover" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[var(--ink-900)]/80 via-transparent to-[var(--ink-900)]/35"
      />
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-900)]/55 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--cam-paper)] backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" aria-hidden />
        Live
      </div>
      <div className="absolute bottom-16 right-3 h-20 w-14 overflow-hidden rounded-[0.75rem] border border-[var(--ink-600)] shadow-[var(--elev-1)] ring-1 ring-[var(--key-500)]/30">
        <div className="relative h-full w-full">
          <Image
            src={selfSrc}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink-600)] bg-[var(--ink-800)]/80 text-[var(--cam-paper)] backdrop-blur-md">
          ⌕
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink-600)] bg-[var(--ink-800)]/80 text-[var(--cam-paper)] backdrop-blur-md">
          ◎
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink-600)] bg-[var(--ink-800)]/80 text-[10px] text-[var(--cam-paper)] backdrop-blur-md">
          ✕
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--key-500)] text-[10px] text-[var(--paper)] shadow-[var(--glow-key)]">
          ♥
        </span>
      </div>
    </div>
  );
}

function ScreenMatch({
  active,
  peerSrc,
}: {
  active: boolean;
  peerSrc: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--ink-900)]/92 p-5 text-center transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!active}
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[var(--ink-600)] shadow-[var(--elev-2)]">
        <Image src={peerSrc} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <p className="font-[family-name:var(--font-camera-display)] text-3xl font-bold tracking-tight text-[var(--cam-paper)]">
        Match
      </p>
      <p className="text-xs text-[var(--muted)]">Saved to Matches</p>
      <div className="mt-2 w-full rounded-[var(--radius-pill)] bg-[var(--key-500)] py-2.5 text-sm font-medium text-[var(--paper)] shadow-[var(--glow-key)]">
        Call back
      </div>
    </div>
  );
}

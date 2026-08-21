"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

type Props = {
  active: boolean;
  reducedMotion?: boolean;
};

const FIELDS = [
  { key: "name", delay: 0 },
  { key: "gender", delay: 450 },
  { key: "looking", delay: 900 },
  { key: "where", delay: 1350 },
] as const;

/**
 * Step 0 — chip/fields fill themselves in sequence when the scene becomes active.
 */
export function SceneSetup({ active, reducedMotion = false }: Props) {
  const { t } = useI18n();
  const [filled, setFilled] = useState(reducedMotion ? FIELDS.length : 0);
  const [chipOn, setChipOn] = useState(reducedMotion ? 1 : -1);

  useEffect(() => {
    if (!active) {
      setFilled(reducedMotion ? FIELDS.length : 0);
      setChipOn(reducedMotion ? 1 : -1);
      return;
    }
    if (reducedMotion) {
      setFilled(FIELDS.length);
      setChipOn(1);
      return;
    }
    const timers: number[] = [];
    FIELDS.forEach((field, i) => {
      timers.push(
        window.setTimeout(() => setFilled(i + 1), field.delay + 200),
      );
    });
    [0, 1, 2].forEach((i) => {
      timers.push(window.setTimeout(() => setChipOn(i), 500 + i * 280));
    });
    timers.push(window.setTimeout(() => setChipOn(1), 500 + 3 * 280));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active, reducedMotion]);

  const values = {
    name: "Jordan",
    gender: t.form.sexFemme,
    looking: t.form.lookingHommes,
    where: t.join.scopeAnywhere,
  };

  const chips = [t.form.sexHomme, t.form.sexFemme, t.form.sexNonBinaire];

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col gap-3 p-4 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
        active
          ? "z-[1] translate-y-0 opacity-100"
          : "pointer-events-none z-0 translate-y-2 opacity-0",
      )}
      aria-hidden={!active}
    >
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-camera-display)] text-lg font-bold text-[var(--cam-paper)]">
          Flash
        </span>
        <span className="text-[11px] font-medium text-[var(--muted)]">
          {t.home.howFrameLabels[0]}
        </span>
      </div>

      <p className="text-[11px] font-medium text-[var(--muted)]">{t.form.iAm}</p>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((label, i) => (
          <span
            key={label}
            className={cn(
              "rounded-[var(--radius-pill)] border px-2.5 py-1 text-[11px] font-medium transition-[border-color,background-color,color] duration-[var(--dur-base)]",
              chipOn === i
                ? "border-[var(--cam-paper)] bg-[var(--cam-paper)] text-[var(--ink-900)]"
                : "border-[var(--ink-600)] text-[var(--muted)]",
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-1 flex-1 space-y-2">
        {FIELDS.map((field, i) => {
          const show = filled > i;
          return (
            <div
              key={field.key}
              className={cn(
                "rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-800)] px-3 py-2 transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]",
                show ? "translate-y-0 opacity-100" : "translate-y-1 opacity-35",
              )}
            >
              <p className="text-[10px] font-medium text-[var(--muted)]">
                {field.key === "name"
                  ? t.form.nickname
                  : field.key === "gender"
                    ? t.form.iAm
                    : field.key === "looking"
                      ? t.form.lookingFor
                      : t.join.controlCountry}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-sm text-[var(--cam-paper)] transition-opacity duration-[var(--dur-base)]",
                  show ? "opacity-100" : "opacity-0",
                )}
              >
                {values[field.key]}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[var(--radius-pill)] bg-[var(--key-500)] py-2.5 text-center text-sm font-medium text-[var(--paper)] shadow-[var(--glow-key)]">
        {t.join.startChat}
      </div>
    </div>
  );
}

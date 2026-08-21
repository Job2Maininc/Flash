"use client";

import { useI18n } from "@/components/LocaleProvider";
import type { LookingFor, Sex } from "@/lib/types";
import {
  writeHeroPrefs,
  sexToPrefGender,
  lookingToPrefSeeking,
} from "@/lib/hero-prefs";
import { cn } from "@/lib/cn";
import { useEffect } from "react";

type Props = {
  sex: Sex | "";
  lookingFor: LookingFor | "";
  onSexChange: (value: Sex) => void;
  onLookingChange: (value: LookingFor) => void;
};

const chipClass = (active: boolean) =>
  cn(
    "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border px-4 text-sm font-medium transition-[border-color,background-color,color,transform] duration-[var(--dur-fast)] active:scale-[.97]",
    active
      ? "border-[var(--cam-paper)] bg-[var(--cam-paper)] text-[var(--ink-900)]"
      : "border-[var(--ink-600)] bg-transparent text-[var(--muted)] hover:border-[var(--ink-500)] hover:text-[var(--cam-paper)]",
  );

/**
 * Two radiogroup chip rows for hero prefs — no dropdowns.
 * Persists to sessionStorage `flash:prefs` on change.
 */
export function HeroPrefChips({
  sex,
  lookingFor,
  onSexChange,
  onLookingChange,
}: Props) {
  const { t } = useI18n();

  useEffect(() => {
    const patch: {
      g?: ReturnType<typeof sexToPrefGender>;
      seeking?: ReturnType<typeof lookingToPrefSeeking>;
    } = {};
    if (sex) patch.g = sexToPrefGender(sex);
    if (lookingFor) patch.seeking = lookingToPrefSeeking(lookingFor);
    if (patch.g || patch.seeking) writeHeroPrefs(patch);
  }, [sex, lookingFor]);

  const genderOptions: { value: Sex; label: string }[] = [
    { value: "homme", label: t.form.sexHomme },
    { value: "femme", label: t.form.sexFemme },
    { value: "non_binaire", label: t.form.sexNonBinaire },
  ];

  const lookingOptions: { value: LookingFor; label: string }[] = [
    { value: "hommes", label: t.form.lookingHommes },
    { value: "femmes", label: t.form.lookingFemmes },
    { value: "tous", label: t.form.lookingTous },
  ];

  return (
    <div className="mt-5 space-y-4 sm:mt-6">
      <fieldset className="space-y-2">
        <legend className="text-[13px] font-medium text-[var(--muted)]">
          {t.form.iAm}
        </legend>
        <div
          role="radiogroup"
          aria-label={t.form.iAm}
          className="flex flex-wrap gap-2"
        >
          {genderOptions.map((option) => {
            const id = `hero-g-${option.value}`;
            const checked = sex === option.value;
            return (
              <span key={option.value} className="relative">
                <input
                  id={id}
                  type="radio"
                  name="hero-gender"
                  value={option.value}
                  checked={checked}
                  onChange={() => onSexChange(option.value)}
                  className="sr-only"
                />
                <label htmlFor={id} className={chipClass(checked)}>
                  {option.label}
                </label>
              </span>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[13px] font-medium text-[var(--muted)]">
          {t.form.lookingFor}
        </legend>
        <div
          role="radiogroup"
          aria-label={t.form.lookingFor}
          className="flex flex-wrap gap-2"
        >
          {lookingOptions.map((option) => {
            const id = `hero-s-${option.value}`;
            const checked = lookingFor === option.value;
            return (
              <span key={option.value} className="relative">
                <input
                  id={id}
                  type="radio"
                  name="hero-seeking"
                  value={option.value}
                  checked={checked}
                  onChange={() => onLookingChange(option.value)}
                  className="sr-only"
                />
                <label htmlFor={id} className={chipClass(checked)}>
                  {option.label}
                </label>
              </span>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

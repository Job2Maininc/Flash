"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import { useI18n } from "@/components/LocaleProvider";
import {
  LOOKING_FOR_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/compatibility";
import { GUEST_ERROR, type GuestErrorCode } from "@/lib/guest-errors";
import type { LookingFor, Sex } from "@/lib/types";

export function GuestForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [nickname, setNickname] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sexLabels: Record<Sex, string> = {
    homme: t.form.sexHomme,
    femme: t.form.sexFemme,
    non_binaire: t.form.sexNonBinaire,
  };
  const lookingLabels: Record<LookingFor, string> = {
    hommes: t.form.lookingHommes,
    femmes: t.form.lookingFemmes,
    tous: t.form.lookingTous,
  };

  function translateError(code: string | undefined, fallback: string): string {
    if (code && code in GUEST_ERROR) {
      return t.errors[code as GuestErrorCode];
    }
    return fallback;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, sex, lookingFor, ageConfirmed }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(translateError(data.error, t.form.continueError));
      }
      router.push("/browse");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.genericError);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flash-fade-in flex w-full max-w-sm flex-col gap-5"
    >
      <label className="flex flex-col gap-2">
        <span className="flex items-center justify-between font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--ink-muted)]">
          <span>{t.form.nickname}</span>
          <span className="text-xs tabular-nums text-[var(--ink-faint)]">
            {nickname.length}/24
          </span>
        </span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={24}
          autoComplete="nickname"
          placeholder={t.form.placeholder}
          className="flash-input px-4 py-3.5 text-xl text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
          required
          minLength={2}
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--ink-muted)]">
          {t.form.iAm}
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {SEX_OPTIONS.map((option) => {
            const selected = sex === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSex(option.value)}
                className={`flash-btn rounded-xl border px-2 py-3 text-sm transition ${
                  selected
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--ink)]/15 bg-white/50 text-[var(--ink-muted)] hover:bg-white/80"
                }`}
                aria-pressed={selected}
              >
                {sexLabels[option.value]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--ink-muted)]">
          {t.form.lookingFor}
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {LOOKING_FOR_OPTIONS.map((option) => {
            const selected = lookingFor === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setLookingFor(option.value)}
                className={`flash-btn rounded-xl border px-2 py-3 text-sm transition ${
                  selected
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--ink)]/15 bg-white/50 text-[var(--ink-muted)] hover:bg-white/80"
                }`}
                aria-pressed={selected}
              >
                {lookingLabels[option.value]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
        <input
          type="checkbox"
          checked={ageConfirmed}
          onChange={(e) => setAgeConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
          required
        />
        <span>{t.form.ageConfirm}</span>
      </label>
      <button
        type="submit"
        disabled={loading || !sex || !lookingFor || !ageConfirmed}
        className="flash-btn flash-btn-primary mt-1 px-6 py-4 text-lg tracking-wide disabled:opacity-50"
      >
        {loading ? (
          <>
            <Spinner
              size="sm"
              className="border-[var(--paper)]/30 border-t-[var(--paper)]"
            />
            {t.form.submitting}
          </>
        ) : (
          t.form.submit
        )}
      </button>
      <p className="text-center text-xs leading-relaxed text-[var(--ink-faint)]">
        {t.form.legal}
      </p>
    </form>
  );
}
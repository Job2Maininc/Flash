"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import {
  LOOKING_FOR_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/compatibility";
import type { LookingFor, Sex } from "@/lib/types";

export function GuestForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, sex, lookingFor }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Impossible de continuer");
      }
      router.push("/browse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
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
          <span>Ton pseudo</span>
          <span className="text-xs tabular-nums text-[var(--ink-faint)]">
            {nickname.length}/24
          </span>
        </span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={24}
          autoComplete="nickname"
          placeholder="ex. Léa"
          className="flash-input px-4 py-3.5 text-xl text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
          required
          minLength={2}
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--ink-muted)]">
          Je suis
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
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--ink-muted)]">
          Je cherche
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
                {option.label}
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
      <button
        type="submit"
        disabled={loading || !sex || !lookingFor}
        className="flash-btn flash-btn-primary mt-1 px-6 py-4 text-lg tracking-wide disabled:opacity-50"
      >
        {loading ? (
          <>
            <Spinner
              size="sm"
              className="border-[var(--paper)]/30 border-t-[var(--paper)]"
            />
            Entrée…
          </>
        ) : (
          "Lancer mon premier flash"
        )}
      </button>
      <p className="text-center text-xs leading-relaxed text-[var(--ink-faint)]">
        En continuant, tu confirmes avoir 18 ans ou plus et accepter nos
        règles de rencontre respectueuse.
      </p>
    </form>
  );
}

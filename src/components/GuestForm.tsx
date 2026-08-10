"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";

export function GuestForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
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
        body: JSON.stringify({ nickname }),
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
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="flash-btn flash-btn-primary mt-1 px-6 py-4 text-lg tracking-wide"
      >
        {loading ? (
          <>
            <Spinner size="sm" className="border-[var(--paper)]/30 border-t-[var(--paper)]" />
            Entrée…
          </>
        ) : (
          "Entrer"
        )}
      </button>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--ink-muted)]">
          Ton pseudo
        </span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={24}
          autoComplete="nickname"
          placeholder="ex. Léa"
          className="rounded-none border-0 border-b-2 border-[var(--ink)] bg-transparent px-0 py-3 text-2xl text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)]"
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
        className="mt-2 bg-[var(--ink)] px-6 py-4 font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--paper)] transition enabled:hover:bg-[var(--accent)] enabled:hover:text-[var(--ink)] disabled:opacity-60"
      >
        {loading ? "Entrée…" : "Entrer"}
      </button>
    </form>
  );
}

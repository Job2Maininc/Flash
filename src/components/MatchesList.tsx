"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MatchEntry } from "@/lib/types";

type Props = {
  initialMatches: MatchEntry[];
};

export function MatchesList({ initialMatches }: Props) {
  const router = useRouter();
  const [matches] = useState(initialMatches);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function recall(peerId: string) {
    setError(null);
    setLoadingId(peerId);
    try {
      const res = await fetch("/api/session/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Rappel impossible");
      router.push("/browse?recall=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setLoadingId(null);
    }
  }

  if (matches.length === 0) {
    return (
      <p className="text-[var(--ink-muted)]">
        Aucun match pour l&apos;instant. Swipe à droite — deux fois — pour en
        créer.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="divide-y divide-[var(--ink)]/15">
        {matches.map((m) => (
          <li
            key={m.peerId}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                {m.nickname}
              </p>
              <p className="text-xs text-[var(--ink-muted)]">
                {m.matchedAt
                  ? new Date(m.matchedAt).toLocaleString("fr-FR")
                  : ""}
              </p>
            </div>
            <button
              type="button"
              disabled={loadingId === m.peerId}
              onClick={() => recall(m.peerId)}
              className="bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] disabled:opacity-50"
            >
              {loadingId === m.peerId ? "…" : "Rappeler"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
